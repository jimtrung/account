package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jimtrung/account/api/routes"
	"github.com/jimtrung/account/config"
	"github.com/jimtrung/account/internal/middleware"
)

func main() {
	config.SetupDB()
	middleware.NewAuth()

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	routes.SetupRoutes(r)

	fmt.Println("Server running at port", config.PORT)
	r.Run("127.0.0.1:" + config.PORT)
}
