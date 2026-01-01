package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"elaris_noir_be/internal/models"
	"elaris_noir_be/internal/utils"

	"github.com/gorilla/mux"
)

func (h *Handler) GetTestimonialsHandler(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	var rows, err = h.DB.QueryContext(r.Context(), "SELECT id, author_name, author_title, author_image, text, rating, status, created_at, updated_at FROM testimonials ORDER BY created_at DESC")
	if status != "" {
		rows, err = h.DB.QueryContext(r.Context(), "SELECT id, author_name, author_title, author_image, text, rating, status, created_at, updated_at FROM testimonials WHERE status=$1 ORDER BY created_at DESC", status)
	}

	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var testimonials []models.Testimonial
	for rows.Next() {
		var t models.Testimonial
		if err := rows.Scan(&t.ID, &t.AuthorName, &t.AuthorTitle, &t.AuthorImage, &t.Text, &t.Rating, &t.Status, &t.CreatedAt, &t.UpdatedAt); err != nil {
			utils.ErrorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		testimonials = append(testimonials, t)
	}

	utils.JsonOK(w, testimonials)
}

func (h *Handler) CreateTestimonialHandler(w http.ResponseWriter, r *http.Request) {
	var req models.Testimonial
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	err := h.DB.QueryRowContext(r.Context(), "INSERT INTO testimonials (author_name, author_title, author_image, text, rating, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
		req.AuthorName, req.AuthorTitle, req.AuthorImage, req.Text, req.Rating, req.Status).Scan(&id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	utils.JsonOK(w, map[string]int{"id": id})
}

func (h *Handler) UpdateTestimonialHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req models.Testimonial
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "UPDATE testimonials SET author_name=$1, author_title=$2, author_image=$3, text=$4, rating=$5, status=$6, updated_at=NOW() WHERE id=$7",
		req.AuthorName, req.AuthorTitle, req.AuthorImage, req.Text, req.Rating, req.Status, id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db update error")
		return
	}

	utils.JsonOK(w, map[string]string{"status": "updated"})
}

func (h *Handler) DeleteTestimonialHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "DELETE FROM testimonials WHERE id=$1", id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db delete error")
		return
	}

	utils.JsonOK(w, map[string]string{"status": "deleted"})
}
