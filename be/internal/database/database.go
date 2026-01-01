package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/url"
	"os"
	"regexp"
	"time"

	_ "github.com/lib/pq"
)

func InitDB() (*sql.DB, error) {
	// Construct database URL from .env variables for the initial connection
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	sslMode := os.Getenv("SSL_MODE")

	// Initial connection is to the 'postgres' db to check for/create the app's db
	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/postgres?sslmode=%s",
		dbUser, dbPassword, dbHost, dbPort, sslMode)

	// Fallback if .env is not complete
	if dbHost == "" {
		log.Println("DB variables not found in .env, using default DATABASE_URL. THIS MAY FAIL.")
		defaultDbURL := os.Getenv("DATABASE_URL")
		if defaultDbURL != "" {
			dbURL = defaultDbURL
		} else {
			dbURL = "postgres://postgres:12345678@localhost:5432/postgres?sslmode=disable"
		}
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open db: %v", err)
	}
	defer db.Close()

	// Ping DB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping db: %v", err)
	}

	// Run migrations (create database and apply schema) unless MIGRATE=false
	if os.Getenv("MIGRATE") != "false" {
		if err := migrateDatabase(db, dbURL); err != nil {
			return nil, fmt.Errorf("migration failed: %v", err)
		}
	}

	// Connect the app to the migrated DB (default MIGRATION_DB_NAME=elaris_noir)
	appDBName := os.Getenv("MIGRATION_DB_NAME")
	if appDBName == "" {
		appDBName = "elaris_noir"
	}
	appDBURL := changeDBNameInURL(dbURL, appDBName)
	appDB, err := sql.Open("postgres", appDBURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open app db: %v", err)
	}

	return appDB, nil
}

// migrateDatabase will ensure the application database exists and apply schema from be/schema.sql
func migrateDatabase(adminDB *sql.DB, dbURL string) error {
	dbName := os.Getenv("MIGRATION_DB_NAME")
	if dbName == "" {
		dbName = "elaris_noir"
	}
	// basic validation for safety
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9_]+$`, dbName)
	if !matched {
		return fmt.Errorf("invalid database name: %s", dbName)
	}

	var exists int
	err := adminDB.QueryRow("SELECT 1 FROM pg_database WHERE datname=$1", dbName).Scan(&exists)
	if err == sql.ErrNoRows {
		// create DB
		if _, err := adminDB.Exec(fmt.Sprintf("CREATE DATABASE %s", dbName)); err != nil {
			return fmt.Errorf("create db failed: %w", err)
		}
		log.Printf("created database %s", dbName)
	} else if err != nil {
		return err
	} else {
		log.Printf("database %s already exists", dbName)
	}

	// apply schema
	// schema.sql is expected to be next to the main.go in the be/ folder
	schemaPath := "schema.sql"
	// Try to find schema.sql in probable locations
	if _, err := os.Stat(schemaPath); os.IsNotExist(err) {
		if _, err := os.Stat("be/schema.sql"); err == nil {
			schemaPath = "be/schema.sql"
		} else if _, err := os.Stat("../schema.sql"); err == nil {
			schemaPath = "../schema.sql"
		}
	}

	b, err := os.ReadFile(schemaPath)
	if err != nil {
		return fmt.Errorf("read schema: %w", err)
	}

	appDBURL := changeDBNameInURL(dbURL, dbName)
	appDB, err := sql.Open("postgres", appDBURL)
	if err != nil {
		return fmt.Errorf("open app db: %w", err)
	}
	defer appDB.Close()

	if _, err := appDB.Exec(string(b)); err != nil {
		return fmt.Errorf("apply schema: %w", err)
	}
	log.Printf("applied schema %s to %s", schemaPath, dbName)
	return nil
}

func changeDBNameInURL(dbURL, dbName string) string {
	u, err := url.Parse(dbURL)
	if err != nil {
		return dbURL
	}
	u.Path = "/" + dbName
	return u.String()
}
