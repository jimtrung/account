package config

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

var DB *pgx.Conn
var PORT string
var JwtSecret []byte

func SetupDB() {
	if err := godotenv.Load(); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to load .env: %v\n", err)
	}

	dbURL := os.Getenv("DATABASE_URL")

	conn, err := pgx.Connect(context.Background(), dbURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	DB = conn
	PORT = os.Getenv("PORT")
	JwtSecret = []byte(os.Getenv("SECRET_KEY"))

	fmt.Println("Connected to database successfully")
}
