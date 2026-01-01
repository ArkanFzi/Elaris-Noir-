package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Parse command line arguments
	emailPtr := flag.String("email", "", "Email of the user to promote to admin")
	flag.Parse()

	if *emailPtr == "" {
		fmt.Println("Usage: go run cmd/promote_admin/main.go -email <user_email>")
		os.Exit(1)
	}

	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found, using defaults")
	}

	// Construct connection string from env vars
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres"
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "postgres"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "elaris_noir"
	}

	sslMode := os.Getenv("SSL_MODE")
	if sslMode == "" {
		sslMode = "disable"
	}

	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		dbUser, dbPassword, dbHost, dbPort, dbName, sslMode)

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Could not connect to database (%s): %v", dbURL, err)
	}

	// Check if user exists
	var currentRole string
	err = db.QueryRow("SELECT role FROM users WHERE email = $1", *emailPtr).Scan(&currentRole)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Fatalf("User with email %s not found.", *emailPtr)
		}
		log.Fatal("Database error:", err)
	}

	if currentRole == "admin" {
		fmt.Printf("User %s is already an admin.\n", *emailPtr)
		return
	}

	// Update role
	_, err = db.Exec("UPDATE users SET role = 'admin' WHERE email = $1", *emailPtr)
	if err != nil {
		log.Fatal("Failed to update user role:", err)
	}

	fmt.Printf("Successfully promoted %s to ADMIN.\n", *emailPtr)
}
