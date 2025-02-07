package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/sessions"
	"github.com/jimtrung/account/config"
	"github.com/jimtrung/account/internal/models"
	"github.com/jimtrung/account/internal/services"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

const (
	key    = "trung123"
	maxAge = 86400 * 30
	isProd = true
)

func NewAuth() {
	googleClientId := os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	store := sessions.NewCookieStore([]byte(key))
	store.MaxAge(maxAge)
	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = isProd

	gothic.Store = store

	goth.UseProviders(
		google.New(
			googleClientId,
			googleClientSecret,
			"http://127.0.0.1:8080/auth/google/callback",
		),
	)
}

func BeginAuthProviderCallback(c *gin.Context) {
	provider := c.Param("provider")
	c.Request = c.Request.WithContext(context.WithValue(
		context.Background(),
		"provider",
		provider,
	))
	gothic.BeginAuthHandler(c.Writer, c.Request)
}

func GetAuthCallBackFunction(c *gin.Context) {
	provider := c.Param("provider")
	c.Request = c.Request.WithContext(context.WithValue(
		context.Background(),
		"provider",
		provider,
	))

	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(user)

	var userInfo = models.User{
		Username: user.Email,
		Password: services.GenerateRandomPassword(),
		Email:    user.Email,
	}
	if err := services.AddUser(userInfo); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": err.Error(),
		})
		return
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": userInfo.Username,
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

	c.Redirect(http.StatusFound, "http://127.0.0.1:8080/static/profile.html")
}
