package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"elaris_noir_be/internal/middleware"
	"elaris_noir_be/internal/models"
	"elaris_noir_be/internal/utils"

	"github.com/gorilla/mux"
)

func (h *Handler) AddAddressHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.CtxKeyUserID{}).(int)
	var req map[string]string
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	err := h.DB.QueryRowContext(r.Context(), `INSERT INTO addresses (user_id, full_name, line1, line2, city, postal_code, country, is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
		userID, req["full_name"], req["line1"], req["line2"], req["city"], req["postal_code"], req["country"], false).Scan(&id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}
	utils.JsonOK(w, map[string]interface{}{"id": id})
}

func (h *Handler) GetAddressesHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.CtxKeyUserID{}).(int)
	rows, err := h.DB.QueryContext(r.Context(), "SELECT id, full_name, line1, line2, city, postal_code, country, is_default FROM addresses WHERE user_id=$1", userID)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var out []map[string]interface{}
	for rows.Next() {
		var id int
		var fn, l1, l2, city, pc, c string
		var isDefault bool
		if err := rows.Scan(&id, &fn, &l1, &l2, &city, &pc, &c, &isDefault); err != nil {
			utils.ErrorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		out = append(out, map[string]interface{}{"id": id, "full_name": fn, "line1": l1, "line2": l2, "city": city, "postal_code": pc, "country": c, "is_default": isDefault})
	}
	utils.JsonOK(w, out)
}

func (h *Handler) GetWishlistHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.CtxKeyUserID{}).(int)
	rows, err := h.DB.QueryContext(r.Context(),
		"SELECT wi.id, wi.product_id, p.id, p.name, p.category, p.description, p.price_cents, p.image_url, wi.added_at FROM wishlist_items wi JOIN products p ON p.id=wi.product_id WHERE wi.user_id=$1 ORDER BY wi.added_at DESC",
		userID)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var items []models.WishlistItem
	for rows.Next() {
		var item models.WishlistItem
		var p models.Product
		if err := rows.Scan(&item.ID, &item.ProductID, &p.ID, &p.Name, &p.Category, &p.Description, &p.PriceCents, &p.ImageURL, &item.AddedAt); err != nil {
			utils.ErrorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		item.Product = &p
		items = append(items, item)
	}

	utils.JsonOK(w, items)
}

func (h *Handler) AddWishlistHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.CtxKeyUserID{}).(int)
	var req map[string]int
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	productID, ok := req["product_id"]
	if !ok {
		utils.ErrorJSON(w, http.StatusBadRequest, "product_id required")
		return
	}

	var id int
	err := h.DB.QueryRowContext(r.Context(), "INSERT INTO wishlist_items (user_id, product_id) VALUES ($1,$2) RETURNING id", userID, productID).Scan(&id)
	if err != nil {
		if strings.Contains(err.Error(), "unique") {
			utils.ErrorJSON(w, http.StatusBadRequest, "product already in wishlist")
			return
		}
		utils.ErrorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	utils.JsonOK(w, map[string]int{"id": id})
}

func (h *Handler) RemoveWishlistHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.CtxKeyUserID{}).(int)
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "DELETE FROM wishlist_items WHERE id=$1 AND user_id=$2", id, userID)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db delete error")
		return
	}

	utils.JsonOK(w, map[string]string{"status": "removed"})
}

func (h *Handler) UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.CtxKeyUserID{}).(int)

	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	// Simple validation
	if req.Email == "" {
		utils.ErrorJSON(w, http.StatusBadRequest, "email is required")
		return
	}

	// Update in DB
	_, err := h.DB.ExecContext(r.Context(),
		"UPDATE users SET first_name=$1, last_name=$2, email=$3 WHERE id=$4",
		req.FirstName, req.LastName, req.Email, userID)

	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db update error")
		return
	}

	utils.JsonOK(w, map[string]string{"status": "updated"})
}

func (h *Handler) GetAllUsersHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.QueryContext(r.Context(), "SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC")
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Role, &u.CreatedAt); err != nil {
			utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
			return
		}
		users = append(users, u)
	}

	utils.JsonOK(w, users)
}

func (h *Handler) DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "DELETE FROM users WHERE id=$1", id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.JsonOK(w, map[string]string{"status": "deleted"})
}
