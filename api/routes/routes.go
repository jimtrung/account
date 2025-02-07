package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/jimtrung/account/api/handlers"
	"github.com/jimtrung/account/internal/middleware"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	v1 := api.Group("/v1")

	// Users
	users := v1.Group("/users")
	users.POST("/signup", handlers.Signup)
	users.POST("/login", handlers.Login)
	users.GET("/validate", middleware.RequireAuth, handlers.Validate)

	// Middleware
	// r.Static("/", "./public")
}
