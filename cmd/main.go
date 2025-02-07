package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jimtrung/account/api/routes"
	"github.com/jimtrung/account/config"
)

func main() {
	config.SetupDB()

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	routes.SetupRoutes(r)

	fmt.Println("Server running at port", config.PORT)
	r.Run(":" + config.PORT)
}
