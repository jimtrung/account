package models

import "time"

type User struct {
	UserID      int        `json:"user_id"`
	Username    string     `json:"username"`
	Password    string     `json:"password"`
	Email       string     `json:"email"`
	PhoneNumber string     `json:"phone_number"`
	Country     string     `json:"country"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}

type UserResponse struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
