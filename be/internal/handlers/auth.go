package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	"elaris_noir_be/internal/middleware"
	"elaris_noir_be/internal/models"
	"elaris_noir_be/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("DEBUG: RegisterHandler called")
	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}
	if req.Email == "" || req.Password == "" {
		utils.ErrorJSON(w, http.StatusBadRequest, "email and password required")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "could not hash password")
		return
	}

	var id int
	err = h.DB.QueryRowContext(r.Context(), "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id",
		req.FirstName, req.LastName, req.Email, string(hash)).Scan(&id)
	if err != nil {
		if strings.Contains(err.Error(), "unique") {
			utils.ErrorJSON(w, http.StatusBadRequest, "email already in use")
			return
		}
		utils.ErrorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	token, err := middleware.CreateToken(id, req.Email)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "could not create token")
		return
	}

	// Fetch full user to return consistent response
	var user models.User
	user.ID = id
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Email = req.Email
	user.Role = "customer" // Default

	utils.JsonOK(w, map[string]interface{}{
		"token": token,
		"user":  user,
	})
}

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("DEBUG: LoginHandler called")
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var user models.User
	var passHash string

	err := h.DB.QueryRowContext(r.Context(), "SELECT id, first_name, last_name, email, role, password_hash FROM users WHERE email=$1", req.Email).
		Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Role, &passHash)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			utils.ErrorJSON(w, http.StatusUnauthorized, "invalid credentials")
			return
		}
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passHash), []byte(req.Password)); err != nil {
		utils.ErrorJSON(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	token, err := middleware.CreateToken(user.ID, user.Email)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "could not create token")
		return
	}

	utils.JsonOK(w, map[string]interface{}{
		"token": token,
		"user":  user,
	})
}
