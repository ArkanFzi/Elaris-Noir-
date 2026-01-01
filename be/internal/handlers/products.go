package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"elaris_noir_be/internal/models"
	"elaris_noir_be/internal/utils"

	"github.com/gorilla/mux"
)

func (h *Handler) GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	limit := 20
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}
	offset := (page - 1) * limit

	rows, err := h.DB.QueryContext(r.Context(), "SELECT id, name, category, description, price_cents, image_url FROM products ORDER BY id LIMIT $1 OFFSET $2", limit, offset)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Category, &p.Description, &p.PriceCents, &p.ImageURL); err != nil {
			utils.ErrorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		products = append(products, p)
	}

	utils.JsonOK(w, products)
}

func (h *Handler) GetProductHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var p models.Product
	err = h.DB.QueryRowContext(r.Context(), "SELECT id, name, category, description, price_cents, image_url FROM products WHERE id=$1", id).
		Scan(&p.ID, &p.Name, &p.Category, &p.Description, &p.PriceCents, &p.ImageURL)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			utils.ErrorJSON(w, http.StatusNotFound, "product not found")
			return
		}
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}

	utils.JsonOK(w, p)
}

// Admin Handlers

func (h *Handler) CreateProductHandler(w http.ResponseWriter, r *http.Request) {
	var req models.Product
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	err := h.DB.QueryRowContext(r.Context(), "INSERT INTO products (name, category, description, price_cents, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING id",
		req.Name, req.Category, req.Description, req.PriceCents, req.ImageURL).Scan(&id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	w.WriteHeader(http.StatusCreated)
	utils.JsonOK(w, map[string]int{"id": id})
}

func (h *Handler) UpdateProductHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req models.Product
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "UPDATE products SET name=$1, category=$2, description=$3, price_cents=$4, image_url=$5, updated_at=NOW() WHERE id=$6",
		req.Name, req.Category, req.Description, req.PriceCents, req.ImageURL, id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db update error")
		return
	}

	utils.JsonOK(w, map[string]string{"status": "updated"})
}

func (h *Handler) DeleteProductHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "DELETE FROM products WHERE id=$1", id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db delete error")
		return
	}

	utils.JsonOK(w, map[string]string{"status": "deleted"})
}
