# Stage 1: # Stage 1: Build
FROM golang:1.24-alpine AS builder
WORKDIR /app

# Ambil mod dulu buat caching
COPY go.mod go.sum ./
RUN go mod download

# Copy SEMUA kodingan
COPY . .

# Sekarang baru rapihin dan build
RUN go mod tidy
RUN go build -o main ./cmd/api/main.go

# Stage 2: Run
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/schema.sql .
EXPOSE 8080
CMD ["./main"]
