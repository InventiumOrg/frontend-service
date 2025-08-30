# Frontend Service - Codebase Structure Documentation

## Project Overview

**Venus** is a modern React/TypeScript application built with Vite, Material-UI, and Clerk authentication. The app runs under the `/inventium` base path and uses React Router DOM v6 for client-side routing.

## 🏗️ Architecture Overview

```
src/
├── components/          # Reusable UI components
│   ├── base/           # Base components (Image, ReactEchart, IconifyIcon)
│   ├── common/         # Common components (DataGridFooter)
│   ├── loader/         # Loading components (PageLoader, Splash)
│   ├── sections/       # Page-specific components
│   └── auth/           # Authentication components
├── layouts/            # Layout wrappers
│   ├── main-layout/    # Main app layout (sidebar, topbar, footer)
│   └── auth-layout/    # Authentication pages layout
├── pages/              # Page components
│   ├── dashboard/      # Dashboard implementation
│   └── authentication/ # Auth pages
├── routes/             # 🎯 ROUTING CONFIGURATION
│   ├── router.tsx      # Main router setup
│   ├── paths.ts        # Path constants
│   └── sitemap.ts      # Navigation structure
├── theme/              # MUI theme customization
├── data/               # Mock/static data
└── assets/             # Static assets
```

## 🛣️ Routing System

### Key Files for Route Customization

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/routes/router.tsx` | Route definitions and components | Add new routes |
| `src/routes/paths.ts` | Path constants and URLs | Define new path constants |
| `src/routes/sitemap.ts` | Navigation menu structure | Add navigation items |

### Current Route Structure

```
App (basename: '/inventium')
├── Protected Routes (requires authentication)
│   └── "/" (MainLayout)
│       └── Dashboard (index)
└── Public Routes
    └── "/auth" (AuthLayout)
        ├── "/signin" (external)
        └── "/signup" (external)
```

## 📝 How to Add a Custom Page

### Step 1: Create the Page Component

```bash
# Create your page file
src/pages/[category]/MyNewPage.tsx
```

**Example page component:**
```typescript
import { Grid } from '@mui/material';

const MyNewPage = () => {
  return (
    <Grid container spacing={2.5}>
      {/* Your page content */}
      <Grid item xs={12}>
        <h1>My New Page</h1>
      </Grid>
    </Grid>
  );
};

export default MyNewPage;
```

### Step 2: Add Path Constant

Edit `src/routes/paths.ts`:
```typescript
export default {
  // ... existing paths
  myNewPage: `/${rootPaths.pageRoot}/my-new-page`,
};
```

### Step 3: Configure the Route

Edit `src/routes/router.tsx`:
```typescript
// Add lazy import at top
const MyNewPage = lazy(() => import('pages/category/MyNewPage'));

// Add route to protected routes children array
children: [
  {
    index: true,
    element: <Dashboard />,
  },
  // Add your new route
  {
    path: 'pages/my-new-page',
    element: <MyNewPage />,
  },
],
```

### Step 4: Add to Navigation (Optional)

Edit `src/routes/sitemap.ts`:
```typescript
const sitemap: MenuItem[] = [
  // ... existing items
  {
    id: 'my-new-page',
    subheader: 'My New Page',
    path: '/pages/my-new-page',
    icon: 'material-symbols:page-info', // Iconify icon
  },
];
```

## 🔐 Authentication System

- **Clerk Integration**: Professional auth service
- **Protected Routes**: Auto-redirect to sign-in for unauthenticated users
- **Public Routes**: Auth pages redirect authenticated users to dashboard
- **External Auth**: Sign-in/sign-up handled by Clerk hosted pages

## 🎨 Styling and Theming

- **Material-UI v5**: Component library
- **Custom Theme**: Defined in `src/theme/theme.ts`
- **Responsive Design**: Built-in breakpoint system
- **Iconify**: Icon system with 100,000+ icons

## 📱 Layout System

### MainLayout (`src/layouts/main-layout/index.tsx`)
- Sidebar navigation
- Top bar with user menu
- Footer
- Responsive mobile drawer
- Used for all authenticated pages

### AuthLayout (`src/layouts/auth-layout/index.tsx`)
- Centered layout with logo
- Paper container for forms
- Used for authentication pages

## 🚀 Development Patterns

### Page Component Pattern
```typescript
// All pages follow this structure
const PageName = () => {
  return (
    <Grid container spacing={2.5}>
      {/* Use MUI Grid system for layout */}
    </Grid>
  );
};

export default PageName;
```

### Route Pattern
- **Lazy Loading**: All pages use `lazy()` import
- **Suspense**: Wrapped with `<PageLoader />` fallback
- **Layout Wrapping**: Protected routes use `MainLayout`

### Navigation Pattern
- **Icons**: All menu items use Iconify icons
- **Active State**: Visual indication for current page
- **Nested Menus**: Support for collapsible sub-menus

## 🛠️ Quick Start for Custom Pages

1. **Simple Page**: Create component → Add to router → Done
2. **With Navigation**: Follow all 4 steps above
3. **Protected**: Add to protected routes (default)
4. **Public**: Add to public routes (rare)

## 📋 Current Navigation Items

| Item | Status | Path | Notes |
|------|--------|------|-------|
| Dashboard | ✅ Active | `/` | Functional |
| Revenue | 🚧 Placeholder | `#!` | No route |
| Inventory | 🚧 Defined | `/inventory` | Path exists, no route |
| User Management | 📁 Menu | - | Collapsible |
| Schedules | 🚧 Placeholder | `#!` | No route |
| Payouts | 🚧 Placeholder | `#!` | No route |
| Settings | 🚧 Placeholder | `#!` | No route |

## 🔍 File Locations Summary

**Essential files to modify for custom routes:**

1. **`src/routes/router.tsx:7`** - Add route definitions
2. **`src/routes/paths.ts:8`** - Define path constants  
3. **`src/routes/sitemap.ts:6`** - Add navigation items
4. **`src/pages/[category]/`** - Create your page components

**Configuration files:**
- **`vite.config.ts:1`** - Build configuration
- **`src/theme/theme.ts:1`** - UI theme customization
- **`src/layouts/main-layout/index.tsx:1`** - Main layout structure