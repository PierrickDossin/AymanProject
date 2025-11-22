# Backend Architecture Overview

## 🏗️ Clean Architecture Structure

```
src/
├── domain/                          # Business logic layer (interfaces & entities)
│   ├── entities/                    # Domain models (DTOs & interfaces)
│   │   ├── User.ts                  # User domain model
│   │   ├── Meal.ts                  # Meal domain model
│   │   └── Workout.ts               # Workout domain model
│   └── repositories/                # Repository interfaces
│       ├── UserRepository.ts        # User repository contract
│       ├── MealRepository.ts        # Meal repository contract
│       └── WorkoutRepository.ts     # Workout repository contract
│
├── application/                     # Application services (business logic)
│   └── services/
│       ├── UserService.ts           # User business logic
│       ├── MealService.ts           # Meal business logic
│       └── WorkoutService.ts        # Workout business logic
│
├── infrastructure/                  # External concerns (DB, config)
│   ├── config/
│   │   └── env.ts                   # Environment configuration
│   ├── database/
│   │   ├── data-source.ts           # TypeORM DataSource config
│   │   └── entities/                # TypeORM entities (DB models)
│   │       ├── User.ts              # User table schema
│   │       ├── Meal.ts              # Meal table schema
│   │       ├── Goal.ts              # Goal table schema
│   │       └── Workout.ts           # Workout table schema
│   └── persistence/                 # Repository implementations
│       ├── TypeOrmUserRepository.ts
│       ├── TypeOrmMealRepository.ts
│       └── InMemoryWorkoutRepository.ts
│
└── presentation/                    # API layer (controllers & routes)
    └── http/
        ├── controllers/             # Request handlers
        │   ├── UserController.ts    # User endpoints logic
        │   ├── MealController.ts    # Meal endpoints logic
        │   └── WorkoutController.ts # Workout endpoints logic
        └── routes/                  # Route definitions
            ├── users.ts             # User routes
            ├── meals.ts             # Meal routes
            ├── goals.ts             # Goal routes
            └── workouts.ts          # Workout routes
```

## 🔄 Data Flow

```
Request → Route → Controller → Service → Repository → Database
                      ↓            ↓          ↓
                  Validation   Business   Data Access
                               Logic
```

## 📦 Component Responsibilities

### 1. **Domain Layer** (Pure business logic)
- **Entities**: Define the shape of your data (interfaces, DTOs, enums)
- **Repository Interfaces**: Define contracts for data access (no implementation)

### 2. **Application Layer** (Use cases)
- **Services**: Business logic, validation, orchestration
- Uses repository interfaces (dependency injection)
- Independent of database implementation

### 3. **Infrastructure Layer** (External dependencies)
- **Database Entities**: TypeORM schemas (actual DB tables)
- **Repository Implementations**: Concrete data access logic
- **Config**: Environment variables, database connection

### 4. **Presentation Layer** (API)
- **Controllers**: Handle HTTP requests/responses
- **Routes**: Define API endpoints and wire controllers
- Input validation (Zod schemas)

## 🔌 Dependency Injection Flow

### User Flow Example:
```typescript
// 1. Repository Implementation (Infrastructure)
TypeOrmUserRepository implements UserRepository

// 2. Service (Application)
UserService(repository: UserRepository)

// 3. Controller (Presentation)
UserController(service: UserService)

// 4. Routes wire it all together
const repo = new TypeOrmUserRepository()
const service = new UserService(repo)
const controller = new UserController(service)
```

## ✅ Current Implementation Status

### Users Module ✅
- ✅ Domain: User entity, UserRepository interface
- ✅ Application: UserService with bcrypt password hashing
- ✅ Infrastructure: TypeOrmUserRepository
- ✅ Presentation: UserController, routes

### Meals Module ✅
- ✅ Domain: Meal entity with MealType enum, MealRepository interface
- ✅ Application: MealService with daily totals
- ✅ Infrastructure: TypeOrmMealRepository
- ✅ Presentation: MealController, routes

### Workouts Module ⚠️
- ✅ Domain: Workout entity, WorkoutRepository interface
- ✅ Application: WorkoutService
- ⚠️ Infrastructure: InMemoryWorkoutRepository (not using DB)
- ✅ Presentation: WorkoutController, routes

## 🎯 Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Easy to mock repositories and services
3. **Flexibility**: Can swap database (SQL → MongoDB) without touching business logic
4. **Maintainability**: Clear structure, easy to find and modify code
5. **Scalability**: Add new features by following the same pattern
