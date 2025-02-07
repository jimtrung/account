package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jimtrung/account/config"
	"github.com/jimtrung/account/internal/models"
	"github.com/jimtrung/account/internal/services"
	"golang.org/x/crypto/bcrypt"
)

func Signup(c *gin.Context) {
	var user models.User
	if err := c.Bind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Wrong JSON format",
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password), 10,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}
	user.Password = string(hashedPassword)

	if err := services.AddUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to add user",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Account created successfully",
	})
}

func Login(c *gin.Context) {
	var userRes models.UserResponse
	if err := c.Bind(&userRes); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Wrong JSON format",
		})
		return
	}

	storedHashedPassword, err := services.GetPasswordByUsername(userRes.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Failed to get user password",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(storedHashedPassword),
		[]byte(userRes.Password),
	); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Wrong password",
		})
		return
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": userRes.Username,
			"exp":      time.Now().Add(time.Hour * 24).Unix(),
		},
	)

	signedToken, err := token.SignedString([]byte(config.JwtSecret))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Failed to sign token",
		})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", signedToken, 3600*24, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{})
}

func Validate(c *gin.Context) {
	user, _ := c.Get("user")

	c.JSON(http.StatusOK, user)
}
