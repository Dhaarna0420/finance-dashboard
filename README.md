1. Architecture
- Routes: Handle API endpoints
- Middleware: Auth + Role-based access
- DB Layer: SQLite for persistence

2. Roles
- viewer: read only
- analyst: read + summary
- admin: full access

3. Features
- JWT authentication
- Role-based authorization
- CRUD for financial records
- Filtering support
- Dashboard aggregation

4. Validation
- Basic checks for required fields
- Error responses with proper status codes

5. Possible Enhancements
- Pagination
- Rate limiting
- Soft delete
- Unit tests