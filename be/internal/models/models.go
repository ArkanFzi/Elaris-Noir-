package models

import "time"

type User struct {
	ID        int       `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
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
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Excerpt     string     `json:"excerpt"`
	Content     string     `json:"content"`
	Category    string     `json:"category"`
	ImageURL    string     `json:"image_url"`
	Status      string     `json:"status"`
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
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
	Items           []OrderItemReq    `json:"items"`
	ShippingAddress map[string]string `json:"shipping_address"`
	TotalCents      int               `json:"total_cents"`
}
