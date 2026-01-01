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

func (h *Handler) GetArticlesHandler(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	var rows *sql.Rows
	var err error

	if status != "" {
		rows, err = h.DB.QueryContext(r.Context(), "SELECT id, title, excerpt, content, category, image_url, status, published_at, created_at, updated_at FROM articles WHERE status=$1 ORDER BY created_at DESC", status)
	} else {
		rows, err = h.DB.QueryContext(r.Context(), "SELECT id, title, excerpt, content, category, image_url, status, published_at, created_at, updated_at FROM articles ORDER BY created_at DESC")
	}

	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	var articles []models.Article
	for rows.Next() {
		var a models.Article
		if err := rows.Scan(&a.ID, &a.Title, &a.Excerpt, &a.Content, &a.Category, &a.ImageURL, &a.Status, &a.PublishedAt, &a.CreatedAt, &a.UpdatedAt); err != nil {
			utils.ErrorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		articles = append(articles, a)
	}

	utils.JsonOK(w, articles)
}

func (h *Handler) GetArticleHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var article models.Article
	err = h.DB.QueryRowContext(r.Context(), "SELECT id, title, excerpt, content, category, image_url, status, published_at, created_at, updated_at FROM articles WHERE id=$1", id).
		Scan(&article.ID, &article.Title, &article.Excerpt, &article.Content, &article.Category, &article.ImageURL, &article.Status, &article.PublishedAt, &article.CreatedAt, &article.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			utils.ErrorJSON(w, http.StatusNotFound, "article not found")
			return
		}
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}

	utils.JsonOK(w, article)
}

func (h *Handler) CreateArticleHandler(w http.ResponseWriter, r *http.Request) {
	var req models.Article
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	var id int
	err := h.DB.QueryRowContext(r.Context(), "INSERT INTO articles (title, excerpt, content, category, image_url, status, published_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
		req.Title, req.Excerpt, req.Content, req.Category, req.ImageURL, req.Status, req.PublishedAt).Scan(&id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db insert error")
		return
	}

	utils.JsonOK(w, map[string]int{"id": id})
}

func (h *Handler) UpdateArticleHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req models.Article
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "UPDATE articles SET title=$1, excerpt=$2, content=$3, category=$4, image_url=$5, status=$6, published_at=$7, updated_at=NOW() WHERE id=$8",
		req.Title, req.Excerpt, req.Content, req.Category, req.ImageURL, req.Status, req.PublishedAt, id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db update error")
		return
	}

	utils.JsonOK(w, map[string]string{"status": "updated"})
}

func (h *Handler) DeleteArticleHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "DELETE FROM articles WHERE id=$1", id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db delete error")
		return
	}

	utils.JsonOK(w, map[string]string{"status": "deleted"})
}
