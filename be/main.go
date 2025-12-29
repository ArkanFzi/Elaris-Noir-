package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret []byte

type App struct {
	db *sql.DB
}

type User struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
}

type Product struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Category    string `json:"category"`
	Description string `json:"description"`
	PriceCents  int    `json:"price_cents"`
	ImageURL    string `json:"image_url"`
}

type Article struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Excerpt     string    `json:"excerpt"`
	Content     string    `json:"content"`
	Category    string    `json:"category"`
	ImageURL    string    `json:"image_url"`
	Status      string    `json:"status"`
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Testimonial struct {
	ID          int       `json:"id"`
	AuthorName  string    `json:"author_name"`
	AuthorTitle string    `json:"author_title"`
	AuthorImage string    `json:"author_image"`
	Text        string    `json:"text"`
	Rating      *int      `json:"rating"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type WishlistItem struct {
	ID        int       `json:"id"`
	ProductID int       `json:"product_id"`
	Product   *Product  `json:"product"`
	AddedAt   time.Time `json:"added_at"`
}

// Order-related types
type OrderItemReq struct {
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

type CreateOrderReq struct {
	Items           []OrderItemReq       `json:"items"`
	ShippingAddress map[string]string    `json:"shipping_address"`
	TotalCents      int                  `json:"total_cents"`
}

func main() {
	// Load JWT secret from environment
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "replace_this_with_a_secure_random_secret"
	}
	jwtSecret = []byte(secret)

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		// default local postgres
		dbURL = "postgres://postgres:12345678@localhost:5432/postgres?sslmode=disable"
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("failed to open db: %v", err)
	}
	defer db.Close()

	// Ping DB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("failed to ping db: %v", err)
	}

	// Run migrations (create database and apply schema) unless MIGRATE=false
	if os.Getenv("MIGRATE") != "false" {
		if err := migrateDatabase(db, dbURL); err != nil {
			log.Fatalf("migration failed: %v", err)
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
		log.Fatalf("failed to open app db: %v", err)
	}
	// close initial admin connection and use appDB for the server
	db.Close()
	db = appDB

	app := &App{db: db}

	r := mux.NewRouter()

	api := r.PathPrefix("/api").Subrouter()

	// Public
	api.HandleFunc("/products", app.GetProductsHandler).Methods("GET")
	api.HandleFunc("/products/{id}", app.GetProductHandler).Methods("GET")
	api.HandleFunc("/articles", app.GetArticlesHandler).Methods("GET")
	api.HandleFunc("/articles/{id}", app.GetArticleHandler).Methods("GET")
	api.HandleFunc("/testimonials", app.GetTestimonialsHandler).Methods("GET")
	api.HandleFunc("/register", app.RegisterHandler).Methods("POST")
	api.HandleFunc("/login", app.LoginHandler).Methods("POST")

	// Authenticated
	auth := api.NewRoute().Subrouter()
	auth.Use(app.AuthMiddleware)
	auth.HandleFunc("/orders", app.CreateOrderHandler).Methods("POST")
	auth.HandleFunc("/orders", app.GetOrdersHandler).Methods("GET")
	auth.HandleFunc("/addresses", app.AddAddressHandler).Methods("POST")
	auth.HandleFunc("/addresses", app.GetAddressesHandler).Methods("GET")
	auth.HandleFunc("/wishlist", app.GetWishlistHandler).Methods("GET")
	auth.HandleFunc("/wishlist/items", app.AddWishlistHandler).Methods("POST")
	auth.HandleFunc("/wishlist/items/{id}", app.RemoveWishlistHandler).Methods("DELETE")

	// Admin routes
	admin := api.NewRoute().Subrouter()
	admin.Use(app.AuthMiddleware)
	admin.Use(app.AdminMiddleware)
	admin.HandleFunc("/products", app.CreateProductHandler).Methods("POST")
	admin.HandleFunc("/products/{id}", app.UpdateProductHandler).Methods("PUT")
	admin.HandleFunc("/products/{id}", app.DeleteProductHandler).Methods("DELETE")
	admin.HandleFunc("/articles", app.CreateArticleHandler).Methods("POST")
	admin.HandleFunc("/articles/{id}", app.UpdateArticleHandler).Methods("PUT")
	admin.HandleFunc("/articles/{id}", app.DeleteArticleHandler).Methods("DELETE")
	admin.HandleFunc("/testimonials", app.CreateTestimonialHandler).Methods("POST")
	admin.HandleFunc("/testimonials/{id}", app.UpdateTestimonialHandler).Methods("PUT")
	admin.HandleFunc("/testimonials/{id}", app.DeleteTestimonialHandler).Methods("DELETE")

	// CORS & preflight
	r.Use(corsMiddleware)

	// Start server
	addr := ":8080"
	log.Printf("Server listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, r))
}

// -------------------- Handlers --------------------

func (a *App) GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := a.db.QueryContext(r.Context(), "SELECT id, name, category, description, price_cents, image_url FROM products ORDER BY id")
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Category, &p.Description, &p.PriceCents, &p.ImageURL); err != nil {
			errorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		products = append(products, p)
	}

	jsonOK(w, products)
}

func (a *App) GetProductHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var p Product
	err = a.db.QueryRowContext(r.Context(), "SELECT id, name, category, description, price_cents, image_url FROM products WHERE id=$1", id).
		Scan(&p.ID, &p.Name, &p.Category, &p.Description, &p.PriceCents, &p.ImageURL)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			errorJSON(w, http.StatusNotFound, "product not found")
			return
		}
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}

	jsonOK(w, p)
}

// RegisterHandler creates a user and returns JWT
func (a *App) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}
	if req.Email == "" || req.Password == "" {
		errorJSON(w, http.StatusBadRequest, "email and password required")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "could not hash password")
		return
	}

	var id int
	err = a.db.QueryRowContext(r.Context(), "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id",
		req.FirstName, req.LastName, req.Email, string(hash)).Scan(&id)
	if err != nil {
		if strings.Contains(err.Error(), "unique") {
			errorJSON(w, http.StatusBadRequest, "email already in use")
			return
		}
		errorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	token, err := createToken(id, req.Email)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "could not create token")
		return
	}

	jsonOK(w, map[string]interface{}{"token": token, "user": map[string]interface{}{"id": id, "email": req.Email}})
}

// LoginHandler authenticates and returns JWT
func (a *App) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	var passHash string
	var email string
	err := a.db.QueryRowContext(r.Context(), "SELECT id, password_hash, email FROM users WHERE email=$1", req.Email).Scan(&id, &passHash, &email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			errorJSON(w, http.StatusUnauthorized, "invalid credentials")
			return
		}
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passHash), []byte(req.Password)); err != nil {
		errorJSON(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	token, err := createToken(id, email)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "could not create token")
		return
	}

	jsonOK(w, map[string]interface{}{"token": token})
}

func (a *App) CreateOrderHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ctxKeyUserID{}).(int)
	var req CreateOrderReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	// Basic validation
	if len(req.Items) == 0 {
		errorJSON(w, http.StatusBadRequest, "items required")
		return
	}

	// Put everything in a transaction
	tx, err := a.db.BeginTx(r.Context(), nil)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db tx error")
		return
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Create shipping address (naive: insert always)
	var shippingID sql.NullInt64
	if req.ShippingAddress != nil {
		res := tx.QueryRowContext(r.Context(), `INSERT INTO addresses (user_id, full_name, line1, line2, city, postal_code, country, is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
			userID,
			req.ShippingAddress["full_name"],
			req.ShippingAddress["line1"],
			req.ShippingAddress["line2"],
			req.ShippingAddress["city"],
			req.ShippingAddress["postal_code"],
			req.ShippingAddress["country"],
			false,
		)
		var sid int64
		if err := res.Scan(&sid); err != nil {
			errorJSON(w, http.StatusInternalServerError, "could not insert address")
			return
		}
		shippingID = sql.NullInt64{Int64: sid, Valid: true}
	}

	// Create order
	var orderID int
	err = tx.QueryRowContext(r.Context(), `INSERT INTO orders (user_id, total_cents, status, shipping_address_id) VALUES ($1,$2,$3,$4) RETURNING id`,
		userID, req.TotalCents, "processing", nilIfInvalid(shippingID)).Scan(&orderID)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "could not create order")
		return
	}

	// Insert order items and fetch unit price for each product
	for _, it := range req.Items {
		var unitPrice int
		if err := tx.QueryRowContext(r.Context(), "SELECT price_cents FROM products WHERE id=$1", it.ProductID).Scan(&unitPrice); err != nil {
			tx.Rollback()
			errorJSON(w, http.StatusBadRequest, "invalid product id")
			return
		}

		_, err := tx.ExecContext(r.Context(), "INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES ($1,$2,$3,$4)", orderID, it.ProductID, it.Quantity, unitPrice)
		if err != nil {
			tx.Rollback()
			errorJSON(w, http.StatusInternalServerError, "could not insert order item")
			return
		}
	}

	if err := tx.Commit(); err != nil {
		errorJSON(w, http.StatusInternalServerError, "could not commit transaction")
		return
	}

	jsonOK(w, map[string]interface{}{"order_id": orderID, "status": "processing"})
}

func (a *App) GetOrdersHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ctxKeyUserID{}).(int)
	rows, err := a.db.QueryContext(r.Context(), "SELECT id, total_cents, status, shipping_address_id, created_at FROM orders WHERE user_id=$1 ORDER BY created_at DESC", userID)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	type OrderResp struct {
		ID        int           `json:"id"`
		TotalCents int          `json:"total_cents"`
		Status    string        `json:"status"`
		Items     []interface{} `json:"items"`
		CreatedAt time.Time     `json:"created_at"`
	}

	var out []OrderResp
	for rows.Next() {
		var o OrderResp
		var shipping sql.NullInt64
		if err := rows.Scan(&o.ID, &o.TotalCents, &o.Status, &shipping, &o.CreatedAt); err != nil {
			errorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}

		// fetch items
		itemsRows, err := a.db.QueryContext(r.Context(), "SELECT oi.product_id, oi.quantity, oi.unit_price_cents, p.name, p.image_url FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=$1", o.ID)
		if err != nil {
			errorJSON(w, http.StatusInternalServerError, "db error")
			return
		}
		var items []map[string]interface{}
		for itemsRows.Next() {
			var pid, qty, unit int
			var name, img sql.NullString
			if err := itemsRows.Scan(&pid, &qty, &unit, &name, &img); err != nil {
				itemsRows.Close()
				errorJSON(w, http.StatusInternalServerError, "db scan error")
				return
			}
			items = append(items, map[string]interface{}{"product_id": pid, "quantity": qty, "unit_price_cents": unit, "name": name.String, "image_url": img.String})
		}
		itemsRows.Close()
		o.Items = make([]interface{}, len(items))
		for i := range items { o.Items[i] = items[i] }
		out = append(out, o)
	}

	jsonOK(w, out)
}

func (a *App) AddAddressHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ctxKeyUserID{}).(int)
	var req map[string]string
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	err := a.db.QueryRowContext(r.Context(), `INSERT INTO addresses (user_id, full_name, line1, line2, city, postal_code, country, is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
		userID, req["full_name"], req["line1"], req["line2"], req["city"], req["postal_code"], req["country"], false).Scan(&id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}
	jsonOK(w, map[string]interface{}{"id": id})
}

func (a *App) GetAddressesHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ctxKeyUserID{}).(int)
	rows, err := a.db.QueryContext(r.Context(), "SELECT id, full_name, line1, line2, city, postal_code, country, is_default FROM addresses WHERE user_id=$1", userID)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var out []map[string]interface{}
	for rows.Next() {
		var id int
		var fn, l1, l2, city, pc, c string
		var isDefault bool
		if err := rows.Scan(&id, &fn, &l1, &l2, &city, &pc, &c, &isDefault); err != nil {
			errorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		out = append(out, map[string]interface{}{"id": id, "full_name": fn, "line1": l1, "line2": l2, "city": city, "postal_code": pc, "country": c, "is_default": isDefault})
	}
	jsonOK(w, out)
}

// -------------------- Helpers --------------------

func jsonOK(w http.ResponseWriter, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func errorJSON(w http.ResponseWriter, code int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

func createToken(userID int, email string) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"email": email,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	})
	return t.SignedString(jwtSecret)
}

// Auth middleware extracts JWT and populates context with user id

type ctxKeyUserID struct{}

func (a *App) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			errorJSON(w, http.StatusUnauthorized, "missing authorization header")
			return
		}
		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			errorJSON(w, http.StatusUnauthorized, "invalid authorization header")
			return
		}
		tkn := parts[1]
		parsed, err := jwt.Parse(tkn, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return jwtSecret, nil
		})
		if err != nil || !parsed.Valid {
			errorJSON(w, http.StatusUnauthorized, "invalid token")
			return
		}
		claims, ok := parsed.Claims.(jwt.MapClaims)
		if !ok {
			errorJSON(w, http.StatusUnauthorized, "invalid token claims")
			return
		}
		sub, ok := claims["sub"].(float64)
		if !ok {
			errorJSON(w, http.StatusUnauthorized, "invalid token subject")
			return
		}
		userID := int(sub)
		ctx := context.WithValue(r.Context(), ctxKeyUserID{}, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Admin middleware checks if user has admin role
type ctxKeyRole struct{}

func (a *App) AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(ctxKeyUserID{}).(int)
		var role string
		err := a.db.QueryRowContext(r.Context(), "SELECT role FROM users WHERE id=$1", userID).Scan(&role)
		if err != nil || role != "admin" {
			errorJSON(w, http.StatusForbidden, "admin access required")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Simple CORS middleware to allow requests from the frontend
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow from localhost:3000 during development
		allowOrigin := os.Getenv("CORS_ORIGIN")
		if allowOrigin == "" {
			allowOrigin = "http://localhost:3000"
		}

		w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Max-Age", "86400")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// nilIfInvalid helps to pass NULL shipping_address
func nilIfInvalid(n sql.NullInt64) interface{} {
	if n.Valid {
		return n.Int64
	}
	return nil
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
	b, err := os.ReadFile(schemaPath)
	if err != nil {
		// fallback: try repo-relative path
		b, err = os.ReadFile("be/schema.sql")
		if err != nil {
			return fmt.Errorf("read schema: %w", err)
		}
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

// -------------------- ARTICLES HANDLERS --------------------

func (a *App) GetArticlesHandler(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	var rows *sql.Rows
	var err error
	
	if status != "" {
		rows, err = a.db.QueryContext(r.Context(), "SELECT id, title, excerpt, content, category, image_url, status, published_at, created_at, updated_at FROM articles WHERE status=$1 ORDER BY created_at DESC", status)
	} else {
		rows, err = a.db.QueryContext(r.Context(), "SELECT id, title, excerpt, content, category, image_url, status, published_at, created_at, updated_at FROM articles ORDER BY created_at DESC")
	}
	
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var articles []Article
	for rows.Next() {
		var a Article
		if err := rows.Scan(&a.ID, &a.Title, &a.Excerpt, &a.Content, &a.Category, &a.ImageURL, &a.Status, &a.PublishedAt, &a.CreatedAt, &a.UpdatedAt); err != nil {
			errorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		articles = append(articles, a)
	}

	jsonOK(w, articles)
}

func (a *App) GetArticleHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var article Article
	err = a.db.QueryRowContext(r.Context(), "SELECT id, title, excerpt, content, category, image_url, status, published_at, created_at, updated_at FROM articles WHERE id=$1", id).
		Scan(&article.ID, &article.Title, &article.Excerpt, &article.Content, &article.Category, &article.ImageURL, &article.Status, &article.PublishedAt, &article.CreatedAt, &article.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			errorJSON(w, http.StatusNotFound, "article not found")
			return
		}
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}

	jsonOK(w, article)
}

func (a *App) CreateArticleHandler(w http.ResponseWriter, r *http.Request) {
	var req Article
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	err := a.db.QueryRowContext(r.Context(), "INSERT INTO articles (title, excerpt, content, category, image_url, status, published_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
		req.Title, req.Excerpt, req.Content, req.Category, req.ImageURL, req.Status, req.PublishedAt).Scan(&id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	jsonOK(w, map[string]int{"id": id})
}

func (a *App) UpdateArticleHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req Article
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	_, err = a.db.ExecContext(r.Context(), "UPDATE articles SET title=$1, excerpt=$2, content=$3, category=$4, image_url=$5, status=$6, published_at=$7, updated_at=NOW() WHERE id=$8",
		req.Title, req.Excerpt, req.Content, req.Category, req.ImageURL, req.Status, req.PublishedAt, id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db update error")
		return
	}

	jsonOK(w, map[string]string{"status": "updated"})
}

func (a *App) DeleteArticleHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = a.db.ExecContext(r.Context(), "DELETE FROM articles WHERE id=$1", id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db delete error")
		return
	}

	jsonOK(w, map[string]string{"status": "deleted"})
}

// -------------------- TESTIMONIALS HANDLERS --------------------

func (a *App) GetTestimonialsHandler(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	var rows *sql.Rows
	var err error
	
	if status != "" {
		rows, err = a.db.QueryContext(r.Context(), "SELECT id, author_name, author_title, author_image, text, rating, status, created_at, updated_at FROM testimonials WHERE status=$1 ORDER BY created_at DESC", status)
	} else {
		rows, err = a.db.QueryContext(r.Context(), "SELECT id, author_name, author_title, author_image, text, rating, status, created_at, updated_at FROM testimonials ORDER BY created_at DESC")
	}
	
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var testimonials []Testimonial
	for rows.Next() {
		var t Testimonial
		if err := rows.Scan(&t.ID, &t.AuthorName, &t.AuthorTitle, &t.AuthorImage, &t.Text, &t.Rating, &t.Status, &t.CreatedAt, &t.UpdatedAt); err != nil {
			errorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		testimonials = append(testimonials, t)
	}

	jsonOK(w, testimonials)
}

func (a *App) CreateTestimonialHandler(w http.ResponseWriter, r *http.Request) {
	var req Testimonial
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	err := a.db.QueryRowContext(r.Context(), "INSERT INTO testimonials (author_name, author_title, author_image, text, rating, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
		req.AuthorName, req.AuthorTitle, req.AuthorImage, req.Text, req.Rating, req.Status).Scan(&id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	jsonOK(w, map[string]int{"id": id})
}

func (a *App) UpdateTestimonialHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req Testimonial
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	_, err = a.db.ExecContext(r.Context(), "UPDATE testimonials SET author_name=$1, author_title=$2, author_image=$3, text=$4, rating=$5, status=$6, updated_at=NOW() WHERE id=$7",
		req.AuthorName, req.AuthorTitle, req.AuthorImage, req.Text, req.Rating, req.Status, id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db update error")
		return
	}

	jsonOK(w, map[string]string{"status": "updated"})
}

func (a *App) DeleteTestimonialHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = a.db.ExecContext(r.Context(), "DELETE FROM testimonials WHERE id=$1", id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db delete error")
		return
	}

	jsonOK(w, map[string]string{"status": "deleted"})
}

// -------------------- WISHLIST HANDLERS --------------------

func (a *App) GetWishlistHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ctxKeyUserID{}).(int)
	rows, err := a.db.QueryContext(r.Context(), 
		"SELECT wi.id, wi.product_id, p.id, p.name, p.category, p.description, p.price_cents, p.image_url, wi.added_at FROM wishlist_items wi JOIN products p ON p.id=wi.product_id WHERE wi.user_id=$1 ORDER BY wi.added_at DESC", 
		userID)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var items []WishlistItem
	for rows.Next() {
		var item WishlistItem
		var p Product
		if err := rows.Scan(&item.ID, &item.ProductID, &p.ID, &p.Name, &p.Category, &p.Description, &p.PriceCents, &p.ImageURL, &item.AddedAt); err != nil {
			errorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		item.Product = &p
		items = append(items, item)
	}

	jsonOK(w, items)
}

func (a *App) AddWishlistHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ctxKeyUserID{}).(int)
	var req map[string]int
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	productID, ok := req["product_id"]
	if !ok {
		errorJSON(w, http.StatusBadRequest, "product_id required")
		return
	}

	var id int
	err := a.db.QueryRowContext(r.Context(), "INSERT INTO wishlist_items (user_id, product_id) VALUES ($1,$2) RETURNING id", userID, productID).Scan(&id)
	if err != nil {
		if strings.Contains(err.Error(), "unique") {
			errorJSON(w, http.StatusBadRequest, "product already in wishlist")
			return
		}
		errorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	jsonOK(w, map[string]int{"id": id})
}

func (a *App) RemoveWishlistHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(ctxKeyUserID{}).(int)
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = a.db.ExecContext(r.Context(), "DELETE FROM wishlist_items WHERE id=$1 AND user_id=$2", id, userID)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db delete error")
		return
	}

	jsonOK(w, map[string]string{"status": "removed"})
}

// -------------------- PRODUCT CRUD HANDLERS --------------------

func (a *App) CreateProductHandler(w http.ResponseWriter, r *http.Request) {
	var req Product
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	err := a.db.QueryRowContext(r.Context(), "INSERT INTO products (name, category, description, price_cents, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING id",
		req.Name, req.Category, req.Description, req.PriceCents, req.ImageURL).Scan(&id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	w.WriteHeader(http.StatusCreated)
	jsonOK(w, map[string]int{"id": id})
}

func (a *App) UpdateProductHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req Product
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	_, err = a.db.ExecContext(r.Context(), "UPDATE products SET name=$1, category=$2, description=$3, price_cents=$4, image_url=$5, updated_at=NOW() WHERE id=$6",
		req.Name, req.Category, req.Description, req.PriceCents, req.ImageURL, id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db update error")
		return
	}

	jsonOK(w, map[string]string{"status": "updated"})
}

func (a *App) DeleteProductHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		errorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = a.db.ExecContext(r.Context(), "DELETE FROM products WHERE id=$1", id)
	if err != nil {
		errorJSON(w, http.StatusInternalServerError, "db delete error")
		return
	}

	jsonOK(w, map[string]string{"status": "deleted"})
}
