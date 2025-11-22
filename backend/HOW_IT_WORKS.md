# How the Architecture Works Together

## 🔄 Complete Flow Example: Creating a User

### Step-by-Step Flow

```
1. HTTP Request comes in:
   POST /api/users
   Body: { username, firstName, lastName, email, password }

2. Route (users.ts) receives the request:
   - Routes it to UserController.create()

3. Controller (UserController.ts):
   - Validates input with Zod schema
   - Calls UserService.createUser(data)

4. Service (UserService.ts):
   - Business logic: Check if email exists
   - Business logic: Check if username exists
   - Hash password with bcrypt
   - Calls UserRepository.create(data)

5. Repository (TypeOrmUserRepository.ts):
   - Data access: Create TypeORM entity
   - Data access: Save to database
   - Returns saved user

6. Response flows back:
   Repository → Service → Controller → Route → HTTP Response
```

## 📊 Visual Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP REQUEST                             │
│              POST /api/users {data}                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (src/presentation/http)                  │
│                                                               │
│  ┌─────────────┐         ┌──────────────────┐              │
│  │   Route     │────────▶│   Controller     │              │
│  │  users.ts   │         │ UserController   │              │
│  └─────────────┘         │  - Validation    │              │
│                          │  - Error handling│              │
│                          └────────┬─────────┘              │
└───────────────────────────────────┼──────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (src/application/services)                │
│                                                               │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Service                              │       │
│  │           UserService                             │       │
│  │  - Business Logic                                 │       │
│  │  - Validation (uniqueness)                        │       │
│  │  - Password hashing                               │       │
│  │  - Orchestration                                  │       │
│  └────────────────────┬─────────────────────────────┘       │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  DOMAIN LAYER (src/domain)                                   │
│                                                               │
│  ┌──────────────────┐       ┌──────────────────┐           │
│  │    Entities      │       │   Repository     │           │
│  │   User.ts        │       │   Interface      │           │
│  │  - Interface     │       │ UserRepository   │           │
│  │  - DTOs          │       │  - Contract      │           │
│  └──────────────────┘       └────────┬─────────┘           │
└───────────────────────────────────────┼──────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE LAYER (src/infrastructure)                   │
│                                                               │
│  ┌────────────────────────────────────────────────┐         │
│  │         Repository Implementation               │         │
│  │       TypeOrmUserRepository                     │         │
│  │  - Implements UserRepository interface          │         │
│  │  - Database queries (TypeORM)                   │         │
│  │  - Data transformation                          │         │
│  └──────────────────────┬─────────────────────────┘         │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (SQLite)                           │
│                   database.sqlite                            │
│                                                               │
│  Tables: users, meals, goals, workouts                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔌 Dependency Injection Pattern

### How Components are Wired (users.ts example)

```typescript
// 1. Create Repository (knows how to talk to DB)
const repository = new TypeOrmUserRepository();

// 2. Inject Repository into Service (business logic)
const service = new UserService(repository);

// 3. Inject Service into Controller (HTTP handling)
const controller = new UserController(service);

// 4. Connect Controller methods to Routes
router.post("/", controller.create);
```

### Why This Works

- **Controller** doesn't know about the database
- **Service** doesn't know about HTTP requests
- **Repository** doesn't know about business logic
- Each layer only depends on interfaces, not implementations

## 📦 Each Component's Job

### 1. Model/Entity (Domain)
```typescript
// src/domain/entities/User.ts
export interface User {
  id: string;
  username: string;
  email: string;
  // ... defines the shape
}
```
**Job:** Define data structure

### 2. Repository (Infrastructure)
```typescript
// src/infrastructure/persistence/TypeOrmUserRepository.ts
export class TypeOrmUserRepository implements UserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    // Talk to database
  }
}
```
**Job:** Database operations (CRUD)

### 3. Service (Application)
```typescript
// src/application/services/UserService.ts
export class UserService {
  async createUser(data: CreateUserDTO): Promise<User> {
    // Check if email exists (business rule)
    // Hash password (business logic)
    // Call repository
  }
}
```
**Job:** Business logic & validation

### 4. Controller (Presentation)
```typescript
// src/presentation/http/controllers/UserController.ts
export class UserController {
  create = async (req: Request, res: Response) => {
    // Validate HTTP input
    // Call service
    // Return HTTP response
  }
}
```
**Job:** Handle HTTP requests/responses

## ✅ Current Status

**Users Module:**
```
Route → UserController → UserService → TypeOrmUserRepository → Database
  ✅        ✅              ✅                ✅                  ✅
```

**Meals Module:**
```
Route → MealController → MealService → TypeOrmMealRepository → Database
  ✅        ✅              ✅                ✅                  ✅
```

**Everything is properly wired and working together!** 🎉

## 🎯 Key Benefits

1. **Testability**: Mock any layer independently
2. **Flexibility**: Swap database without changing business logic
3. **Clarity**: Each file has one clear purpose
4. **Scalability**: Add new features by following the same pattern
5. **Maintainability**: Easy to find where to make changes
