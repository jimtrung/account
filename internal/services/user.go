package services

import (
	"context"
	"crypto/rand"

	"github.com/jimtrung/account/config"
	"github.com/jimtrung/account/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func AddUser(user models.User) error {
	query := `
		INSERT INTO users (username, password, email)
		VALUES ($1, $2, $3);
	`

	_, err := config.DB.Exec(
		context.Background(),
		query, user.Username,
		user.Password, user.Email,
	)
	return err
}

func GetPasswordByUsername(username string) (string, error) {
	query := `
		SELECT password FROM users
		WHERE username = $1;
	`

	row := config.DB.QueryRow(
		context.Background(),
		query, username,
	)

	var hashedPassword string
	if err := row.Scan(&hashedPassword); err != nil {
		return "", err
	}

	return hashedPassword, nil
}

func GetUserByUsername(username string) (models.User, error) {
	query := `
		SELECT * FROM users
		WHERE username = $1;
	`

	row := config.DB.QueryRow(
		context.Background(),
		query, username,
	)

	var user models.User
	if err := row.Scan(
		&user.UserID, &user.Username,
		&user.Password, &user.Email,
		&user.PhoneNumber, &user.Country,
		&user.CreatedAt, &user.UpdatedAt,
	); err != nil {
		return models.User{}, err
	}

	return user, nil
}

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}<>?/"

func GenerateRandomPassword() (string, error) {
	bytes := make([]byte, 10)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	for i := range bytes {
		bytes[i] = charset[int(bytes[i])%len(charset)]
	}

	password := string(bytes)
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(password), 10,
	)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}
