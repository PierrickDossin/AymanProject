# User API Testing Guide

## Base URL
```
http://localhost:4000/api/users
```

## API Endpoints

### 1. Create a User (POST /api/users)
```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

### 2. Get All Users (GET /api/users)
```bash
curl http://localhost:4000/api/users
```

### 3. Get User by ID (GET /api/users/:id)
```bash
curl http://localhost:4000/api/users/{USER_ID}
```

### 4. Update User (PUT /api/users/:id)
```bash
curl -X PUT http://localhost:4000/api/users/{USER_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnny",
    "email": "johnny.doe@example.com"
  }'
```

### 5. Delete User (DELETE /api/users/:id)
```bash
curl -X DELETE http://localhost:4000/api/users/{USER_ID}
```

## User Schema

### Create User Request
```json
{
  "username": "string (3-50 chars, required)",
  "firstName": "string (1-100 chars, required)",
  "lastName": "string (1-100 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

### Update User Request (all fields optional)
```json
{
  "username": "string (3-50 chars)",
  "firstName": "string (1-100 chars)",
  "lastName": "string (1-100 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)",
  "avatarUrl": "string (valid URL)"
}
```

### User Response
```json
{
  "id": "uuid",
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "avatarUrl": "string or null",
  "createdAt": "date",
  "updatedAt": "date"
}
```

Note: Password is never returned in responses (hashed and stored securely)

## Features Implemented

✅ **User Model** with:
- Unique username
- Unique email
- Hashed passwords (bcrypt)
- First name and last name
- Optional avatar URL
- Timestamps (createdAt, updatedAt)

✅ **Clean Architecture**:
- Domain Layer: User entity & repository interface
- Application Layer: UserService with business logic
- Infrastructure Layer: TypeOrmUserRepository implementation
- Presentation Layer: UserController with validation

✅ **Security**:
- Passwords are hashed with bcrypt (10 salt rounds)
- Passwords never returned in API responses
- Email and username uniqueness validation

✅ **Validation**:
- Zod schema validation for all inputs
- Email format validation
- Password minimum length (6 characters)
- Username/email uniqueness checks

✅ **Full CRUD Operations**:
- Create user with validation
- List all users
- Get user by ID
- Update user (partial updates supported)
- Delete user
