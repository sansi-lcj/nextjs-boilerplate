# Building Asset Management Platform

A comprehensive building asset management system with multi-level asset hierarchy, map visualization, data analytics, and complete system management features.

## Features

- 🏢 **Asset Management** - Four-level hierarchy (Asset → Building → Floor → Room)
- 🗺️ **Map Display** - Integration with Tianditu for asset visualization
- 📊 **Data Analytics** - Multi-dimensional statistics and charts
- 👥 **System Management** - Users, roles, permissions, and audit logs
- 🔐 **Security** - JWT authentication and RBAC authorization

## Tech Stack

### Backend
- **Language**: Go 1.18+
- **Framework**: Gin
- **Database**: MySQL 5.7+ / SQLite (for demo)
- **Cache**: Redis
- **ORM**: GORM

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: Ant Design 5
- **State Management**: Redux Toolkit
- **Charts**: Ant Design Charts
- **Build Tool**: Create React App

## Project Structure

```
.
├── backend/            # Go backend service
│   ├── api/           # API handlers
│   ├── config/        # Configuration files
│   ├── internal/      # Internal packages
│   ├── middleware/    # Middleware
│   ├── pkg/          # Shared packages
│   └── router/       # Route definitions
├── frontend/          # React frontend application
│   ├── public/       # Static assets
│   └── src/          # Source code
├── docs/             # Documentation
├── scripts/          # Utility scripts
├── docker-compose.yml # Docker composition
└── Makefile          # Build automation
```

## Quick Start

### Prerequisites

- Go 1.18+
- Node.js 14+
- MySQL 5.7+ (optional, uses SQLite by default)
- Redis (optional)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd building-asset-management
```

2. Install dependencies
```bash
make install
```

3. Start development servers
```bash
make dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

Default credentials:
- Username: `admin`
- Password: `admin123`

### Using Docker

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## Development

### Backend Development

```bash
# Run backend only
make backend-dev

# Run tests
make test-backend

# Format code
cd backend && go fmt ./...
```

### Frontend Development

```bash
# Run frontend only
make frontend-dev

# Run tests
make test-frontend

# Build for production
make build-frontend
```

## API Documentation

The API follows RESTful conventions:

- `GET /api/v1/assets` - List assets
- `POST /api/v1/assets` - Create asset
- `GET /api/v1/assets/:id` - Get asset details
- `PUT /api/v1/assets/:id` - Update asset
- `DELETE /api/v1/assets/:id` - Delete asset

See [API Documentation](docs/api-design.md) for complete reference.

## Configuration

Backend configuration is managed through `backend/config/config.yaml`:

```yaml
server:
  port: 8080
  mode: debug

database:
  driver: mysql
  mysql:
    host: localhost
    port: 3306
    username: root
    password: root123
    database: building_asset
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the repository.