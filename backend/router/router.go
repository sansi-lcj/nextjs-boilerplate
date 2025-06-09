package router

import (
	v1 "building-asset-management/api/v1"
	"building-asset-management/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(config))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// API v1 routes
	apiv1 := r.Group("/api/v1")
	{
		// Authentication routes
		authAPI := v1.NewAuthAPI()
		auth := apiv1.Group("/auth")
		{
			auth.POST("/login", authAPI.Login)
			auth.POST("/logout", authAPI.Logout)
			auth.POST("/refresh", authAPI.RefreshToken)
		}

		// Protected routes
		protected := apiv1.Group("")
		protected.Use(middleware.JWTAuth())
		{
			// User info
			protected.GET("/me", authAPI.GetUserInfo)

			// Asset management routes
			assetAPI := v1.NewAssetAPI()

			// Asset routes
			assets := protected.Group("/assets")
			{
				assets.GET("", assetAPI.GetAssets)
				assets.GET("/:id", assetAPI.GetAsset)
				assets.POST("", assetAPI.CreateAsset)
				assets.PUT("/:id", assetAPI.UpdateAsset)
				assets.DELETE("/:id", assetAPI.DeleteAsset)
			}

			// Building routes
			buildings := protected.Group("/buildings")
			{
				buildings.GET("", assetAPI.GetBuildings)
				buildings.GET("/:id", assetAPI.GetBuilding)
				buildings.POST("", assetAPI.CreateBuilding)
				buildings.PUT("/:id", assetAPI.UpdateBuilding)
				buildings.DELETE("/:id", assetAPI.DeleteBuilding)
			}

			// Floor routes
			floors := protected.Group("/floors")
			{
				floors.GET("", assetAPI.GetFloors)
				floors.POST("", assetAPI.CreateFloor)
				floors.PUT("/:id", assetAPI.UpdateFloor)
				floors.DELETE("/:id", assetAPI.DeleteFloor)
			}

			// Room routes
			rooms := protected.Group("/rooms")
			{
				rooms.GET("", assetAPI.GetRooms)
				rooms.POST("", assetAPI.CreateRoom)
				rooms.PUT("/:id", assetAPI.UpdateRoom)
				rooms.DELETE("/:id", assetAPI.DeleteRoom)
			}

			// Statistics
			protected.GET("/statistics/assets", assetAPI.GetAssetStatistics)

			// System management routes
			systemAPI := v1.NewSystemAPI()

			// User management
			users := protected.Group("/users")
			{
				users.GET("", systemAPI.GetUsers)
				users.GET("/:id", systemAPI.GetUser)
				users.POST("", systemAPI.CreateUser)
				users.PUT("/:id", systemAPI.UpdateUser)
				users.DELETE("/:id", systemAPI.DeleteUser)
				users.PUT("/:id/password", systemAPI.ResetPassword)
			}

			// Role management
			roles := protected.Group("/roles")
			{
				roles.GET("", systemAPI.GetRoles)
				roles.GET("/:id", systemAPI.GetRole)
				roles.POST("", systemAPI.CreateRole)
				roles.PUT("/:id", systemAPI.UpdateRole)
				roles.DELETE("/:id", systemAPI.DeleteRole)
				roles.PUT("/:id/permissions", systemAPI.UpdateRolePermissions)
			}

			// Permission management
			permissions := protected.Group("/permissions")
			{
				permissions.GET("", systemAPI.GetPermissions)
				permissions.GET("/tree", systemAPI.GetPermissionTree)
			}

			// Menu management
			menus := protected.Group("/menus")
			{
				menus.GET("", systemAPI.GetMenus)
				menus.GET("/tree", systemAPI.GetMenuTree)
				menus.GET("/user", systemAPI.GetUserMenus)
			}

			// Organization management
			orgs := protected.Group("/organizations")
			{
				orgs.GET("", systemAPI.GetOrganizations)
				orgs.GET("/tree", systemAPI.GetOrganizationTree)
				orgs.GET("/:id", systemAPI.GetOrganization)
				orgs.POST("", systemAPI.CreateOrganization)
				orgs.PUT("/:id", systemAPI.UpdateOrganization)
				orgs.DELETE("/:id", systemAPI.DeleteOrganization)
			}

			// Operation logs
			logs := protected.Group("/logs")
			{
				logs.GET("/operations", systemAPI.GetOperationLogs)
				logs.GET("/logins", systemAPI.GetLoginLogs)
			}
		}
	}

	return r
}
