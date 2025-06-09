.PHONY: help install dev build test clean docker-up docker-down

# Default target
help: ## Show this help message
	@echo "Building Asset Management Platform"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

# Installation
install: ## Install all dependencies
	@echo "Installing backend dependencies..."
	cd backend && go mod download
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Development
dev: ## Start development servers
	@echo "Starting development servers..."
	@./scripts/start-local.sh

backend-dev: ## Start backend development server
	cd backend && go run main.go

frontend-dev: ## Start frontend development server
	cd frontend && npm start

# Build
build: build-backend build-frontend ## Build both backend and frontend

build-backend: ## Build backend
	@echo "Building backend..."
	cd backend && go build -o ../bin/server main.go

build-frontend: ## Build frontend
	@echo "Building frontend..."
	cd frontend && npm run build

# Test
test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests
	cd backend && go test ./...

test-frontend: ## Run frontend tests
	cd frontend && npm test

# Docker
docker-up: ## Start services with docker-compose
	docker-compose up -d

docker-down: ## Stop services
	docker-compose down

docker-build: ## Build docker images
	docker-compose build

docker-logs: ## View docker logs
	docker-compose logs -f

# Database
db-migrate: ## Run database migrations
	cd backend && go run main.go migrate

db-seed: ## Seed database with sample data
	cd backend && go run main.go seed

# Clean
clean: ## Clean build artifacts
	rm -rf bin/
	rm -rf frontend/build/
	rm -rf backend/building_asset.db
	find . -name "*.log" -delete

# Lint
lint: lint-backend lint-frontend ## Run linters

lint-backend: ## Lint backend code
	cd backend && golangci-lint run

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

# Format
fmt: ## Format code
	cd backend && go fmt ./...
	cd frontend && npm run format