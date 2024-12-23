# Backend Documentation

## Architecture Overview

### Core Technologies

- Node.js with Express
- TypeScript
- Prisma ORM
- JWT for authentication
- PostgreSQL database

### Directory Structure

```
src/
├── controllers/
│   ├── auth.controller.ts
│   ├── insurers.controller.ts
│   └── audit.controller.ts
├── middleware/
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/
│   ├── auth.ts
│   └── insurers.ts
├── services/
│   └── auth.service.ts
├── utils/
│   ├── apiResponse.ts
│   └── errors.ts
└── types/
    └── auth.ts
```

### Database Schema

#### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Insurer Model

```prisma
model Insurer {
  id           String       @id @default(cuid())
  name         String
  address      String?
  phone        String?
  billingEmail String?
  pricingRules PricingRules?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}
```

### API Endpoints

#### Authentication

- POST `/api/v1/auth/login`
- POST `/api/v1/auth/register`
- GET `/api/v1/auth/profile`
- PUT `/api/v1/auth/profile`

#### Insurers

- GET `/api/v1/insurers`
- GET `/api/v1/insurers/:id`
- POST `/api/v1/insurers`
- PUT `/api/v1/insurers/:id`
- DELETE `/api/v1/insurers/:id`

### Authentication & Authorization

#### JWT Implementation

```typescript
interface JWTPayload {
  id: string;
  email: string;
  role: Role;
}
```

#### Role-Based Access

```typescript
enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUDO = "SUDO",
}
```

### Controllers

#### InsurersController

Key methods:

- `create`: Creates new insurer
- `update`: Updates insurer and pricing rules
- `delete`: Deletes insurer
- `getAll`: Retrieves all insurers
- `getById`: Retrieves specific insurer

### Middleware

#### Authentication Middleware

```typescript
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}
```

### Error Handling

- Custom AppError class
- Global error handler middleware
- Structured error responses

### API Response Format

```typescript
class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200);

  static error(res: Response, message: string, statusCode = 500);
}
```

### Security Features

- Password hashing with bcrypt
- JWT token validation
- Role-based access control
- Request validation
- SQL injection prevention via Prisma

### Audit Logging

```typescript
model AuditLog {
  id         String   @id @default(cuid())
  userId     String
  entityId   String
  entityType String
  action     String
  changes    Json
  createdAt  DateTime @default(now())
}
```

### Environment Configuration

Required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`

### Insurer Management

#### Update Insurer

The insurer update endpoint (`PUT /api/v1/insurers/:id`) handles both basic insurer information and pricing rules updates in a single transaction.

```typescript
interface UpdateInsurerRequest {
  name: string;
  address: string;
  phone: string;
  billingEmail: string;
  carrierNote?: string;
  pricingRules: {
    domesticWindshield: number;
    domesticTempered: number;
    foreignWindshield: number;
    foreignTempered: number;
    oem: number;
    laborType: "FLAT" | "MULTIPLIER";
    laborTypeValue: number;
    glassLaborRate: number;
    defaultHourlyRate: number;
    laborDomesticWindshield: number;
    laborDomesticTempered: number;
    laborForeignWindshield: number;
    laborForeignTempered: number;
    otherKitFlat: number;
    kitFlat1: number;
    kitFlat1_5: number;
    kitFlat2: number;
    kitFlat2_5: number;
    kitFlat3: number;
  };
}
```

The endpoint follows these steps:

1. Validates the insurer exists
2. Updates basic insurer information
3. Updates or creates pricing rules using Prisma's upsert operation
4. Returns the updated insurer with its pricing rules

Response format:

```typescript
{
  success: true,
  data: {
    id: string;
    name: string;
    // ... other insurer fields
    pricingRules: {
      // ... pricing rules fields
    }
  }
}
```

#### Data Validation

- All numeric pricing rule values are converted to numbers with fallback to 0
- Labor type is validated to be either "FLAT" or "MULTIPLIER"
- Required fields are checked before processing
- Proper error responses for invalid data

#### Error Handling

The endpoint provides detailed error messages for:

- Invalid insurer ID
- Missing required fields
- Invalid pricing rule values
- Database transaction failures
