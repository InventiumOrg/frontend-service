# Inventory API Integration

This document explains how the inventory management system integrates with your backend API using JWT authentication.

## Setup

### 1. Environment Variables

Configure your environment variables in `.env` or `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:13740/v1
NEXT_PUBLIC_INVENTORY_SERVICE=localhost:13740

# Authentication Tokens
NEXT_PUBLIC_AUTH_TOKEN=your-jwt-token-here
NEXT_AUTH_TOKEN=your-jwt-token-here
```

### 2. Backend API Requirements

Your backend API should provide the following endpoints:

#### Authentication
- The API expects JWT tokens in the `Authorization` header: `Authorization: Bearer <token>`
- Tokens can be provided via:
  - Environment variables (`NEXT_PUBLIC_AUTH_TOKEN` or `NEXT_AUTH_TOKEN`)
  - Browser localStorage (`auth_token`)
  - HTTP cookies (`auth_token`)

#### API Routes

**GET /inventory/list**
- List all inventory items with optional filtering and pagination
- Query parameters: `search`, `status`, `page`, `limit`
- Supported response formats:

**Format 1: Items with pagination (Recommended)**
```json
{
  "items": [
    {
      "id": 1,
      "sku": "SKU-001",
      "name": "Product Name",
      "category": "Electronics",
      "quantity": 45,
      "price": 89.99,
      "status": "In Stock", // "In Stock" | "Low Stock" | "Out of Stock"
      "supplier": "Supplier Name",
      "lastUpdated": "2024-11-07"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 25,
    "itemsPerPage": 5
  }
}
```

**Format 2: Direct array**
```json
[
  {
    "id": 1,
    "sku": "SKU-001",
    "name": "Product Name",
    // ... other fields
  }
]
```

**Format 3: Nested data structure**
```json
{
  "data": {
    "items": [...],
    "pagination": {...}
  }
}
```

**GET /inventory/:id**
- Get a single inventory item by ID
- Returns: Single InventoryItem object

**POST /inventory**
- Create a new inventory item
- Request body: InventoryItem (without id)
- Returns: Created InventoryItem with generated ID

**PUT /inventory/:id**
- Update an existing inventory item
- Request body: Partial InventoryItem (only fields to update)
- Returns: Updated InventoryItem

**DELETE /inventory/:id**
- Delete an inventory item by ID
- Returns: 204 No Content on success

## Usage

### Server-Side Rendering (Current Implementation)

The inventory page uses server-side rendering with API calls:

```typescript
// In your page component
const { items, pagination } = await fetchInventoryItems({
  search: searchParams.search,
  status: searchParams.status,
  page: parseInt(searchParams.page || '1'),
});
```

### Client-Side Hook (Alternative)

For client-side data fetching, use the `useInventory` hook:

```typescript
import { useInventory } from '@/hooks/useInventory';

function InventoryComponent() {
  const { items, pagination, loading, error, refetch } = useInventory({
    search: 'electronics',
    status: 'In Stock',
    page: 1,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Authentication Mechanism

This frontend application uses a flexible JWT authentication system that supports multiple token sources:

### Token Priority (Server-Side)
1. **HTTP Cookies** - `auth_token` cookie (highest priority)
2. **Environment Variables** - `NEXT_AUTH_TOKEN` or `NEXT_PUBLIC_AUTH_TOKEN`

### Token Priority (Client-Side)
1. **localStorage** - `auth_token` key (highest priority)
2. **sessionStorage** - `auth_token` key
3. **Environment Variables** - `NEXT_PUBLIC_AUTH_TOKEN`

### Setting JWT Tokens

#### Method 1: Environment Variables (Recommended for Development)
```bash
# In your .env file
NEXT_PUBLIC_AUTH_TOKEN=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIs...
NEXT_AUTH_TOKEN=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIs...
```

#### Method 2: Programmatic (Production)
```typescript
import { setAuthToken } from '@/lib/auth';

// After successful login API call
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await loginResponse.json();
setAuthToken(token); // Sets both localStorage and cookie
```

#### Method 3: Browser Console (Development/Testing)
```javascript
// Use environment token
setTestToken();

// Use custom token
setCustomToken('your-jwt-token-here');

// Clear all tokens
clearTestToken();
```

### Authentication Flow

1. **Request Initiated** - User navigates to inventory page
2. **Token Resolution** - System checks token sources in priority order
3. **Header Injection** - Token added as `Authorization: Bearer <token>`
4. **API Request** - Request sent to backend with authentication
5. **Response Handling** - Success/error handling with fallbacks

### Auth Context Usage

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user?.name}!</div>;
}
```

### Protected Routes

```typescript
import { withAuth } from '@/context/AuthContext';

const ProtectedInventoryPage = withAuth(InventoryPage);
export default ProtectedInventoryPage;
```

## Error Handling

The system includes comprehensive error handling:

1. **Network Errors**: Automatically falls back to sample data for development
2. **Authentication Errors**: Redirects to login page
3. **API Errors**: Shows user-friendly error messages
4. **Loading States**: Displays loading indicators during API calls

## API Client Features

- **Automatic JWT Authentication**: Adds Bearer token to all requests
- **Error Handling**: Throws typed `ApiError` with status codes
- **TypeScript Support**: Fully typed API responses
- **Fallback Data**: Uses sample data when API is unavailable

## Development vs Production

### Development Mode
- Falls back to sample data if API is unavailable
- Logs detailed error information to console
- Shows retry buttons on error states

### Production Mode
- Requires working API connection
- Shows user-friendly error messages
- Implements proper error boundaries

## Testing the Integration

### 1. Without Backend
The system will automatically use fallback sample data when the API is unavailable.

### 2. With Backend
1. Set `NEXT_PUBLIC_API_BASE_URL` in your `.env.local`
2. Ensure your API matches the expected format
3. Set up authentication (see below)

### 3. Authentication Testing

#### Option A: Environment Variables (Automatic)
The system automatically uses tokens from your environment variables. No manual setup required if you have:
```bash
NEXT_PUBLIC_AUTH_TOKEN=your-jwt-token
```

#### Option B: Browser Console (Development)
```javascript
// Use environment token (recommended)
setTestToken();

// Use custom token
setCustomToken('eyJhbGciOiJSUzI1NiIs...');

// Manual localStorage setup
localStorage.setItem('auth_token', 'your-jwt-token');
```

#### Option C: Programmatic (Production)
```typescript
import { setAuthToken } from '@/lib/auth';

// After successful login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();
setAuthToken(token);
```

### 4. Server-Side vs Client-Side Authentication

#### Server Components (SSR)
- Automatically read tokens from cookies or environment variables
- No client-side JavaScript required
- Better performance and SEO

#### Client Components (CSR)
- Read tokens from localStorage, sessionStorage, or environment
- Interactive features like forms and buttons
- Real-time updates and user feedback

### 5. Token Management

#### Automatic Token Injection
All API requests automatically include the Authorization header:
```http
GET /inventory HTTP/1.1
Host: localhost:13740
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIs...
Content-Type: application/json
```

#### Token Storage
- **Client-side**: localStorage + document.cookie
- **Server-side**: HTTP cookies via next/headers
- **Fallback**: Environment variables

## Security Considerations

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- All API requests include CSRF protection headers
- Sensitive operations require confirmation dialogs
- Error messages don't expose sensitive information

## Customization

### Changing API Base URL

Update the base URL in your environment variables:

```bash
# Change from default to your API
NEXT_PUBLIC_API_BASE_URL=http://your-api-domain.com/v1
```

### Changing API Endpoints

Modify the endpoints in `src/lib/inventory.ts` and `src/lib/inventory-server.ts`:

```typescript
// Change from '/inventory' to '/products'
const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
```

### Adding New Fields

Update the `InventoryItem` interface in `src/lib/inventory.ts`:

```typescript
export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  // Add your new fields here
  customField: string;
}
```

### Custom Authentication

Modify `src/lib/auth.ts` to use your preferred token storage method:

```typescript
export function getAuthToken(): string | null {
  // Use cookies, sessionStorage, or other methods
  return getCookie('auth_token');
}
```

## Current Configuration

Based on your environment setup, the system is configured as follows:

### API Endpoints
- **Base URL**: `http://localhost:13740/v1`
- **List Inventory**: `GET /inventory/list`
- **Get Item**: `GET /inventory/:id`
- **Create Item**: `POST /inventory`
- **Update Item**: `PUT /inventory/:id`
- **Delete Item**: `DELETE /inventory/:id`

### Authentication
- **Token Source**: Environment variables (`NEXT_PUBLIC_AUTH_TOKEN`, `NEXT_AUTH_TOKEN`)
- **Header Format**: `Authorization: Bearer <token>`
- **Fallback**: Sample data for development

### Development Tools
Available in browser console:
- `setTestToken()` - Use environment JWT token
- `setCustomToken(token)` - Set custom JWT token
- `clearTestToken()` - Clear all tokens

### Ready to Use
Your inventory system is pre-configured and ready to use with your existing JWT tokens and API endpoints. The system will automatically:
1. Use your environment JWT tokens
2. Make authenticated requests to `localhost:13740`
3. Handle server-side and client-side authentication
4. Provide fallback data during development