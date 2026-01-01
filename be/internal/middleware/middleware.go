package middleware

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"elaris_noir_be/internal/utils"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret []byte

func InitJWT() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "replace_this_with_a_secure_random_secret"
	}
	jwtSecret = []byte(secret)
}

func GetJWTSecret() []byte {
	if jwtSecret == nil {
		InitJWT()
	}
	return jwtSecret
}

type CtxKeyUserID struct{}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			utils.ErrorJSON(w, http.StatusUnauthorized, "missing authorization header")
			return
		}
		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.ErrorJSON(w, http.StatusUnauthorized, "invalid authorization header")
			return
		}
		tkn := parts[1]
		parsed, err := jwt.Parse(tkn, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return GetJWTSecret(), nil
		})
		if err != nil || !parsed.Valid {
			utils.ErrorJSON(w, http.StatusUnauthorized, "invalid token")
			return
		}
		claims, ok := parsed.Claims.(jwt.MapClaims)
		if !ok {
			utils.ErrorJSON(w, http.StatusUnauthorized, "invalid token claims")
			return
		}
		sub, ok := claims["sub"].(float64)
		if !ok {
			utils.ErrorJSON(w, http.StatusUnauthorized, "invalid token subject")
			return
		}
		userID := int(sub)
		ctx := context.WithValue(r.Context(), CtxKeyUserID{}, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func AdminMiddleware(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userID := r.Context().Value(CtxKeyUserID{}).(int)
			var role string
			err := db.QueryRowContext(r.Context(), "SELECT role FROM users WHERE id=$1", userID).Scan(&role)
			if err != nil || role != "admin" {
				utils.ErrorJSON(w, http.StatusForbidden, "admin access required")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		allowedOrigins := os.Getenv("ALLOWED_ORIGINS")

		// If ALLOWED_ORIGINS is not set, we might default to * or specific dev url.
		if allowedOrigins == "" {
			allowedOrigins = "http://localhost:3000"
		}

		fmt.Printf("CORS Debug: Request Method=%s Origin='%s' AllowedEnv='%s'\n", r.Method, origin, allowedOrigins)

		if allowedOrigins == "*" {
			// Echo origin to allow all with credentials
			if origin != "" {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			} else {
				// If no origin, maybe it's not a browser call, but we can't do wildcard with crendetials.
				// For tools like Postman, they might not send Origin unless configured.
			}
		} else {
			origins := strings.Split(allowedOrigins, ",")
			for _, o := range origins {
				if strings.TrimSpace(o) == origin {
					w.Header().Set("Access-Control-Allow-Origin", origin)
					break
				}
			}
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Max-Age", "86400")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func CreateToken(userID int, email string) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   userID,
		"email": email,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	})
	return t.SignedString(GetJWTSecret())
}
