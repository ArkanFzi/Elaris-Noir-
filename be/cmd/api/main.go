package main

import (
	"log"
	"net/http"
	"os"

	"elaris_noir_be/internal/database"
	"elaris_noir_be/internal/handlers"
	"elaris_noir_be/internal/middleware"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	// We are now in cmd/api, so .env might be in root (../../.env) or current.
	// We'll try loading from predictable paths.
	if err := godotenv.Load(); err != nil {
		// try specific path if running from root with "go run cmd/api/main.go"
		if err := godotenv.Load("be/.env"); err != nil {
			log.Println("No .env file found, using environment variables")
		}
	}

	log.Printf("Config: ALLOWED_ORIGINS='%s'", os.Getenv("ALLOWED_ORIGINS"))

	// Initialize JWT Secret
	middleware.InitJWT()

	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	h := handlers.New(db)

	r := mux.NewRouter()
	// Middleware applied globally via wrapping at the end
	// r.Use(middleware.CORSMiddleware)

	api := r.PathPrefix("/api").Subrouter()

	// Public
	api.HandleFunc("/products", h.GetProductsHandler).Methods("GET")
	api.HandleFunc("/products/{id}", h.GetProductHandler).Methods("GET")
	api.HandleFunc("/articles", h.GetArticlesHandler).Methods("GET")
	api.HandleFunc("/articles/{id}", h.GetArticleHandler).Methods("GET")
	api.HandleFunc("/testimonials", h.GetTestimonialsHandler).Methods("GET")
	api.HandleFunc("/register", h.RegisterHandler).Methods("POST")
	api.HandleFunc("/login", h.LoginHandler).Methods("POST")

	// Authenticated
	auth := api.NewRoute().Subrouter()
	auth.Use(middleware.AuthMiddleware)
	auth.HandleFunc("/orders", h.CreateOrderHandler).Methods("POST")
	auth.HandleFunc("/orders", h.GetOrdersHandler).Methods("GET")
	auth.HandleFunc("/addresses", h.AddAddressHandler).Methods("POST")
	auth.HandleFunc("/addresses", h.GetAddressesHandler).Methods("GET")
	auth.HandleFunc("/wishlist", h.GetWishlistHandler).Methods("GET")
	auth.HandleFunc("/wishlist/items", h.AddWishlistHandler).Methods("POST")
	auth.HandleFunc("/wishlist/items/{id}", h.RemoveWishlistHandler).Methods("DELETE")
	auth.HandleFunc("/user/update", h.UpdateUserHandler).Methods("PUT")

	// Admin routes
	admin := api.NewRoute().Subrouter()
	admin.Use(middleware.AuthMiddleware)
	admin.Use(middleware.AdminMiddleware(db))
	admin.HandleFunc("/products", h.CreateProductHandler).Methods("POST")
	admin.HandleFunc("/products/{id}", h.UpdateProductHandler).Methods("PUT")
	admin.HandleFunc("/products/{id}", h.DeleteProductHandler).Methods("DELETE")
	admin.HandleFunc("/articles", h.CreateArticleHandler).Methods("POST")
	admin.HandleFunc("/articles/{id}", h.UpdateArticleHandler).Methods("PUT")
	admin.HandleFunc("/articles/{id}", h.DeleteArticleHandler).Methods("DELETE")
	admin.HandleFunc("/testimonials", h.CreateTestimonialHandler).Methods("POST")
	admin.HandleFunc("/testimonials/{id}", h.UpdateTestimonialHandler).Methods("PUT")
	admin.HandleFunc("/testimonials/{id}", h.DeleteTestimonialHandler).Methods("DELETE")
	admin.HandleFunc("/testimonials/{id}", h.DeleteTestimonialHandler).Methods("DELETE")
	admin.HandleFunc("/dashboard/stats", h.GetDashboardStatsHandler).Methods("GET")
	admin.HandleFunc("/users", h.GetAllUsersHandler).Methods("GET")
	admin.HandleFunc("/users/{id}", h.DeleteUserHandler).Methods("DELETE")
	admin.HandleFunc("/orders", h.GetAllOrdersHandler).Methods("GET")
	admin.HandleFunc("/orders/{id}/status", h.UpdateOrderStatusHandler).Methods("PUT")
	admin.HandleFunc("/orders/{id}", h.DeleteOrderHandler).Methods("DELETE")

	// Start server
	addr := ":8080"
	log.Printf("Server listening on %s", addr)
	// Wrap router with CORS middleware to ensure it runs for all requests (even 404/405)
	log.Fatal(http.ListenAndServe(addr, middleware.CORSMiddleware(r)))
}
