package handlers

import (
	"database/sql"
	"elaris_noir_be/internal/utils"
	"net/http"
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
