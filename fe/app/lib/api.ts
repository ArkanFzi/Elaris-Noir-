const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function apiCall(
  endpoint: string,
  options?: RequestInit,
  token?: string | null
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }

  return response.json();
}

// Products
export async function getProducts() {
  return apiCall("/products");
}

export async function getProduct(id: number) {
  return apiCall(`/products/${id}`);
}

export async function createProduct(data: any, token: string) {
  return apiCall("/products", { method: "POST", body: JSON.stringify(data) }, token);
}

export async function updateProduct(id: number, data: any, token: string) {
  return apiCall(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);
}

export async function deleteProduct(id: number, token: string) {
  return apiCall(`/products/${id}`, { method: "DELETE" }, token);
}

// Articles
export async function getArticles(status?: string) {
  const url = status ? `/articles?status=${status}` : "/articles";
  return apiCall(url);
}

export async function getArticle(id: number) {
  return apiCall(`/articles/${id}`);
}

export async function createArticle(data: any, token: string) {
  return apiCall("/articles", { method: "POST", body: JSON.stringify(data) }, token);
}

export async function updateArticle(id: number, data: any, token: string) {
  return apiCall(`/articles/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);
}

export async function deleteArticle(id: number, token: string) {
  return apiCall(`/articles/${id}`, { method: "DELETE" }, token);
}

// Testimonials
export async function getTestimonials(status?: string) {
  const url = status ? `/testimonials?status=${status}` : "/testimonials";
  return apiCall(url);
}

export async function createTestimonial(data: any, token: string) {
  return apiCall("/testimonials", { method: "POST", body: JSON.stringify(data) }, token);
}

export async function updateTestimonial(id: number, data: any, token: string) {
  return apiCall(`/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);
}

export async function deleteTestimonial(id: number, token: string) {
  return apiCall(`/testimonials/${id}`, { method: "DELETE" }, token);
}

// Wishlist
export async function getWishlist(token: string) {
  return apiCall("/wishlist", {}, token);
}

export async function addToWishlist(productId: number, token: string) {
  return apiCall(
    "/wishlist/items",
    { method: "POST", body: JSON.stringify({ product_id: productId }) },
    token
  );
}

export async function removeFromWishlist(id: number, token: string) {
  return apiCall(`/wishlist/items/${id}`, { method: "DELETE" }, token);
}

// Orders
export async function createOrder(data: any, token: string) {
  return apiCall("/orders", { method: "POST", body: JSON.stringify(data) }, token);
}

export async function getOrders(token: string) {
  return apiCall("/orders", {}, token);
}

// Addresses
export async function addAddress(data: any, token: string) {
  return apiCall("/addresses", { method: "POST", body: JSON.stringify(data) }, token);
}

export async function getAddresses(token: string) {
  return apiCall("/addresses", {}, token);
}
