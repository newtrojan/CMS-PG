# Frontend Documentation

## Architecture Overview

### Core Technologies

- React with TypeScript
- Vite as build tool
- TailwindCSS for styling
- React Router for routing
- React Query for data fetching
- Context API for state management

### Directory Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx    # Main app layout wrapper
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   ├── UserProfile.tsx   # User profile dropdown
│   │   └── NotificationsSidebar.tsx # Notifications panel
│   └── ui/                   # Reusable UI components
├── contexts/
│   ├── AuthContext.tsx       # Authentication state management
│   └── NotificationContext.tsx # Global notifications
├── hooks/
│   ├── useAuth.tsx          # Authentication hook
│   └── useClickOutside.tsx  # Click outside detection
├── pages/
│   ├── Dashboard.tsx        # Dashboard page
│   ├── Insurer.tsx         # Insurer management
│   └── Login.tsx           # Login page
└── types/                  # TypeScript type definitions
```

### Key Components

#### MainLayout

- Primary layout wrapper
- Handles global layout structure
- Includes header, sidebar, and main content area
- Props:
  - `children`: React.ReactNode

#### NotificationsSidebar

- Manages notification display and history
- Features:
  - Real-time notifications
  - Read/unread status
  - Clear all functionality
- States:
  - `isOpen`: boolean
  - `notifications`: NotificationItem[]

#### UserProfile

- User profile management component
- Features:
  - Profile dropdown
  - Logout functionality
- States:
  - `profileData`: UserProfileData
  - `isDropdownOpen`: boolean

### Context Providers

#### AuthContext

```typescript
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};
```

#### NotificationContext

```typescript
type NotificationType = {
  type: "success" | "error";
  message: string;
};

type NotificationContextType = {
  showNotification: (notification: NotificationType) => void;
};
```

### Key Pages

#### Insurer Page

- Features:
  - CRUD operations for insurers
  - Pricing rules management
  - Audit logging
- States:
  ```typescript
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [selectedInsurer, setSelectedInsurer] = useState<Insurer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Insurer> | null>(null);
  ```

### Authentication Flow

1. User enters credentials
2. AuthContext handles login request
3. Token stored in context
4. Protected routes check auth status
5. Automatic redirect to login if unauthorized

### Error Handling

- Global error boundary
- Context-based notifications
- Form validation
- API error handling

### State Management

- Context API for global state
- Local state for component-specific data
- React Query for server state

### Styling

- TailwindCSS for utility-first styling
- Consistent color scheme
- Responsive design
- Dark/light mode support

### Insurer Management Page

The Insurer Management page (`/insurer`) provides a comprehensive interface for managing insurers and their pricing rules.

#### Features

- Insurer selection via dropdown
- Basic information editing (name, address, phone, email)
- Comprehensive pricing rules management
- Real-time validation and error handling
- Optimistic UI updates

#### State Management

```typescript
interface InsurerPageState {
  insurers: Insurer[];
  selectedInsurer: Insurer | null;
  isEditing: boolean;
  editedData: Insurer | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}
```

#### Notification System

The application uses a context-based notification system for user feedback:

```typescript
interface NotificationType {
  type: "success" | "error";
  message: string;
}
```

Notifications are displayed with:

- Success: Green background with checkmark icon
- Error: Red background with X icon
- Auto-dismissal after 3 seconds
- Consistent positioning (top-right corner)

#### Form Handling

- Deep copy of data for editing
- Type-safe form updates
- Proper handling of number inputs
- Currency formatting for pricing fields
- Responsive grid layout
