package handlers

import (
	"database/sql"
	"elaris_noir_be/internal/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

type DashboardStats struct {
	TotalUsers        int     `json:"totalUsers"`
	TotalProducts     int     `json:"totalProducts"`
	TotalArticles     int     `json:"totalArticles"`
	TotalTestimonials int     `json:"totalTestimonials"`
	MonthlyRevenue    float64 `json:"monthlyRevenue"`
	GrowthRate        float64 `json:"growthRate"`
}

func (h *Handler) GetDashboardStatsHandler(w http.ResponseWriter, r *http.Request) {
	stats := DashboardStats{}

	// 1. Total Users
	err := h.DB.QueryRow("SELECT COUNT(*) FROM users").Scan(&stats.TotalUsers)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	// 2. Total Products
	err = h.DB.QueryRow("SELECT COUNT(*) FROM products").Scan(&stats.TotalProducts)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	// 3. Total Articles
	err = h.DB.QueryRow("SELECT COUNT(*) FROM articles").Scan(&stats.TotalArticles)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	// 4. Total Testimonials
	err = h.DB.QueryRow("SELECT COUNT(*) FROM testimonials").Scan(&stats.TotalTestimonials)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	// 5. Total Revenue (Sum of all orders for simplicity, ideally filtered by status='completed')
	// We divide by 100 because stored in cents.
	var totalCents sql.NullInt64
	err = h.DB.QueryRow("SELECT SUM(total_cents) FROM orders").Scan(&totalCents)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	if totalCents.Valid {
		stats.MonthlyRevenue = float64(totalCents.Int64) / 100.0
	} else {
		stats.MonthlyRevenue = 0
	}

	// 6. Growth Rate (Mock for now, or calculate based on created_at vs last month)
	// Let's Mock it to 12.5% as placeholder, or random.
	stats.GrowthRate = 12.5

	utils.JsonOK(w, stats)
}

// GetAllOrdersHandler returns all orders for admin with pagination and filters
func (h *Handler) GetAllOrdersHandler(w http.ResponseWriter, r *http.Request) {
	// Pagination
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	statusFilter := r.URL.Query().Get("status")
	searchQuery := r.URL.Query().Get("search")

	page := 1
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	limit := 20
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
		limit = l
	}
	offset := (page - 1) * limit

	// Build query with filters
	query := `
		SELECT 
			o.id, 
			o.user_id,
			u.email,
			u.first_name,
			u.last_name,
			o.total_cents, 
			o.status, 
			o.created_at,
			COALESCE(
				json_agg(
					json_build_object(
						'product_id', oi.product_id,
						'quantity', oi.quantity,
						'unit_price_cents', oi.unit_price_cents,
						'name', p.name,
						'image_url', p.image_url
					) 
				) FILTER (WHERE oi.id IS NOT NULL), 
				'[]'
			) as items
		FROM orders o
		LEFT JOIN users u ON o.user_id = u.id
		LEFT JOIN order_items oi ON o.id = oi.order_id
		LEFT JOIN products p ON oi.product_id = p.id
		WHERE 1=1
	`

	args := []interface{}{}
	argCount := 1

	if statusFilter != "" {
		query += fmt.Sprintf(" AND o.status = $%d", argCount)
		args = append(args, statusFilter)
		argCount++
	}

	if searchQuery != "" {
		query += fmt.Sprintf(" AND (u.email ILIKE $%d OR CAST(o.id AS TEXT) LIKE $%d)", argCount, argCount)
		args = append(args, "%"+searchQuery+"%")
		argCount++
	}

	query += `
		GROUP BY o.id, u.email, u.first_name, u.last_name
		ORDER BY o.created_at DESC
	`
	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argCount, argCount+1)
	args = append(args, limit, offset)

	rows, err := h.DB.QueryContext(r.Context(), query, args...)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	type OrderResp struct {
		ID         int             `json:"id"`
		UserID     int             `json:"user_id"`
		UserEmail  string          `json:"user_email"`
		FirstName  string          `json:"first_name"`
		LastName   string          `json:"last_name"`
		TotalCents int             `json:"total_cents"`
		Status     string          `json:"status"`
		Items      json.RawMessage `json:"items"`
		CreatedAt  time.Time       `json:"created_at"`
	}

	var out []OrderResp
	for rows.Next() {
		var o OrderResp
		var itemsJSON []byte
		if err := rows.Scan(&o.ID, &o.UserID, &o.UserEmail, &o.FirstName, &o.LastName, &o.TotalCents, &o.Status, &o.CreatedAt, &itemsJSON); err != nil {
			utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
			return
		}
		o.Items = json.RawMessage(itemsJSON)
		out = append(out, o)
	}

	utils.JsonOK(w, out)
}

// UpdateOrderStatusHandler updates order status
func (h *Handler) UpdateOrderStatusHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	// Validate status
	validStatuses := map[string]bool{
		"pending":    true,
		"processing": true,
		"shipped":    true,
		"delivered":  true,
		"cancelled":  true,
	}
	if !validStatuses[req.Status] {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid status")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "UPDATE orders SET status=$1, updated_at=now() WHERE id=$2", req.Status, id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.JsonOK(w, map[string]string{"status": "updated"})
}

// DeleteOrderHandler deletes an order
func (h *Handler) DeleteOrderHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid id")
		return
	}

	_, err = h.DB.ExecContext(r.Context(), "DELETE FROM orders WHERE id=$1", id)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.JsonOK(w, map[string]string{"status": "deleted"})
}
