package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"elaris_noir_be/internal/middleware"
	"elaris_noir_be/internal/models"
	"elaris_noir_be/internal/utils"
)

// nilIfInvalid helps to pass NULL shipping_address
func nilIfInvalid(n sql.NullInt64) interface{} {
	if n.Valid {
		return n.Int64
	}
	return nil
}

func (h *Handler) CreateOrderHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.CtxKeyUserID{}).(int)
	var req models.CreateOrderReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorJSON(w, http.StatusBadRequest, "invalid json")
		return
	}

	// Basic validation
	if len(req.Items) == 0 {
		utils.ErrorJSON(w, http.StatusBadRequest, "items required")
		return
	}

	// Put everything in a transaction
	tx, err := h.DB.BeginTx(r.Context(), nil)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db tx error")
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
			utils.ErrorJSON(w, http.StatusInternalServerError, "could not insert address")
			return
		}
		shippingID = sql.NullInt64{Int64: sid, Valid: true}
	}

	// Create order
	var orderID int
	err = tx.QueryRowContext(r.Context(), `INSERT INTO orders (user_id, total_cents, status, shipping_address_id) VALUES ($1,$2,$3,$4) RETURNING id`,
		userID, req.TotalCents, "processing", nilIfInvalid(shippingID)).Scan(&orderID)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "could not create order")
		return
	}

	// Insert order items and fetch unit price for each product
	for _, it := range req.Items {
		var unitPrice int
		if err := tx.QueryRowContext(r.Context(), "SELECT price_cents FROM products WHERE id=$1", it.ProductID).Scan(&unitPrice); err != nil {
			tx.Rollback()
			utils.ErrorJSON(w, http.StatusBadRequest, "invalid product id")
			return
		}

		_, err := tx.ExecContext(r.Context(), "INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES ($1,$2,$3,$4)", orderID, it.ProductID, it.Quantity, unitPrice)
		if err != nil {
			tx.Rollback()
			utils.ErrorJSON(w, http.StatusInternalServerError, "could not insert order item")
			return
		}
	}

	if err := tx.Commit(); err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "could not commit transaction")
		return
	}

	utils.JsonOK(w, map[string]interface{}{"order_id": orderID, "status": "processing"})
}

func (h *Handler) GetOrdersHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.CtxKeyUserID{}).(int)

	// Pagination
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	limit := 10
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}
	offset := (page - 1) * limit

	// Efficient single query with JSON_AGG
	query := `
		SELECT 
			o.id, 
			o.total_cents, 
			o.status, 
			o.shipping_address_id, 
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
		LEFT JOIN order_items oi ON o.id = oi.order_id
		LEFT JOIN products p ON oi.product_id = p.id
		WHERE o.user_id = $1
		GROUP BY o.id
		ORDER BY o.created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := h.DB.QueryContext(r.Context(), query, userID, limit, offset)
	if err != nil {
		utils.ErrorJSON(w, http.StatusInternalServerError, "db error")
		return
	}
	defer rows.Close()

	type OrderResp struct {
		ID         int             `json:"id"`
		TotalCents int             `json:"total_cents"`
		Status     string          `json:"status"`
		Items      json.RawMessage `json:"items"`
		CreatedAt  time.Time       `json:"created_at"`
	}

	var out []OrderResp
	for rows.Next() {
		var o OrderResp
		var shipping sql.NullInt64 // placeholder
		var itemsJSON []byte
		if err := rows.Scan(&o.ID, &o.TotalCents, &o.Status, &shipping, &o.CreatedAt, &itemsJSON); err != nil {
			utils.ErrorJSON(w, http.StatusInternalServerError, "db scan error")
			return
		}
		o.Items = json.RawMessage(itemsJSON)
		out = append(out, o)
	}

	utils.JsonOK(w, out)
}
