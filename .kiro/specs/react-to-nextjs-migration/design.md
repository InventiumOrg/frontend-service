# Design Document

## Overview

This design document outlines the architecture and implementation approach for migrating the Inventium React/Vite application to Next.js 14 with App Router. The migration will preserve all existing functionality while leveraging Next.js's server-side rendering capabilities, improved performance, and developer experience enhancements.

The migration strategy focuses on a systematic approach that maintains the current component architecture while adapting to Next.js conventions. We'll use Next.js App Router for its modern approach to routing, layouts, and data fetching.

## Architecture

### Current Architecture
- **Framework**: React 18 with Vite
- **Routing**: React Router v6 with client-side routing
- **Authentication**: Clerk with React integration
- **Styling**: Material-UI v5 with Emotion
- **State Management**: React hooks and context
- **Build Tool**: Vite with TypeScript

### Target Architecture
- **Framework**: Next.js 14 with App Router
- **Routing**: File-based routing with Next.js App Router
- **Authentication**: Clerk with Next.js integration
- **Styling**: Material-UI v5 with Next.js integration
- **State Management**: React hooks and context (preserved)
- **Build Tool**: Next.js built-in build system

### Migration Strategy

The migration will follow a **lift-and-shift** approach with strategic adaptations:

1. **Project Structure Transformation**: Convert to Next.js App Router structure
2. **Component Preservation**: Keep existing components with minimal changes
3. **Routing Conversion**: Transform React Router to file-based routing
4. **Authentication Migration**: Switch from Clerk React to Clerk Next.js
5. **Configuration Adaptation**: Replace Vite config with Next.js config

## Components and Interfaces

### Project Structure Mapping

```
Current Structure → Next.js Structure
src/
├── pages/           → app/
│   ├── dashboard/   → app/dashboard/
│   ├── inventory/   → app/inventory/
│   └── auth/        → app/auth/ (handled by Clerk)
├── layouts/         → app/ (as layout.tsx files)
├── components/      → components/ (preserved)
├── theme/           → theme/ (preserved)
├── utils/           → utils/ (preserved)
└── assets/          → public/ (moved)
```

### Key Component Adaptations

#### 1. Layout System
**Current**: Wrapper components with React Router Outlet
```typescript
// Current: MainLayout wraps children
<MainLayout>
  <Outlet />
</MainLayout>
```

**Target**: Next.js layout.tsx files
```typescript
// app/layout.tsx - Root layout
// app/(protected)/layout.tsx - Protected routes layout
```

#### 2. Routing System
**Current**: Programmatic routing with React Router
```typescript
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/inventory/explore",
    element: <Inventory />
  }
]);
```

**Target**: File-based routing
```
app/
├── page.tsx (Dashboard)
├── inventory/
│   ├── explore/
│   │   └── page.tsx
│   └── catelogue/
│       └── page.tsx
```

#### 3. Authentication Integration
**Current**: Clerk React with custom route protection
```typescript
const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useAuth();
  // Custom protection logic
};
```

**Target**: Next.js middleware with Clerk
```typescript
// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';
```

### Interface Definitions

#### Configuration Interfaces
```typescript
// next.config.js structure
interface NextConfig {
  typescript: TypeScriptConfig;
  experimental: ExperimentalConfig;
  env: EnvironmentConfig;
}

// Environment variable mapping
interface EnvironmentMapping {
  VITE_CLERK_PUBLISHABLE_KEY → NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  VITE_INVENTORY_SERVICE → NEXT_PUBLIC_INVENTORY_SERVICE;
  VITE_AUTH_TOKEN → NEXT_PUBLIC_AUTH_TOKEN;
}
```

#### Component Props Interfaces
```typescript
// Layout component interfaces (preserved)
interface MainLayoutProps {
  children: React.ReactNode;
}

interface AuthLayoutProps {
  children: React.ReactNode;
}

// Page component interfaces (adapted for Next.js)
interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
```

## Data Models

### Route Structure Model
```typescript
interface RouteStructure {
  path: string;
  component: string;
  layout: 'main' | 'auth' | 'none';
  protection: 'protected' | 'public' | 'auth-only';
}

const routeMapping: RouteStructure[] = [
  {
    path: '/',
    component: 'Dashboard',
    layout: 'main',
    protection: 'protected'
  },
  {
    path: '/inventory/explore',
    component: 'Inventory',
    layout: 'main',
    protection: 'protected'
  },
  {
    path: '/inventory/catelogue',
    component: 'Catelogue',
    layout: 'main',
    protection: 'protected'
  }
];
```

### Configuration Migration Model
```typescript
interface ConfigMigration {
  viteConfig: ViteConfig;
  nextConfig: NextConfig;
  packageJson: PackageJsonChanges;
  environmentVariables: EnvironmentMapping;
}

interface PackageJsonChanges {
  scriptsToUpdate: string[];
  dependenciesToAdd: string[];
  dependenciesToRemove: string[];
  devDependenciesToUpdate: string[];
}
```

### Component Migration Model
```typescript
interface ComponentMigration {
  sourceFile: string;
  targetFile: string;
  modificationsRequired: ComponentModification[];
  dependencies: string[];
}

interface ComponentModification {
  type: 'import' | 'export' | 'props' | 'hooks';
  description: string;
  required: boolean;
}
```

## Error Handling

### Migration Error Categories

#### 1. Build-time Errors
- **TypeScript Configuration Issues**: Path resolution conflicts
- **Import Resolution Errors**: Module not found errors during build
- **Next.js Configuration Errors**: Invalid next.config.js settings

**Handling Strategy**:
```typescript
// Gradual TypeScript path migration
const tsConfig = {
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],           // Next.js convention
      "components/*": ["./components/*"], // Preserve existing
      "layouts/*": ["./layouts/*"],       // Preserve existing
    }
  }
};
```

#### 2. Runtime Errors
- **Hydration Mismatches**: Server/client rendering differences
- **Authentication State Issues**: Clerk integration problems
- **Material-UI SSR Issues**: Styling inconsistencies

**Handling Strategy**:
```typescript
// Material-UI SSR configuration
const theme = createTheme({
  // Existing theme configuration
});

// Next.js App Router with MUI
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 3. Authentication Errors
- **Route Protection Failures**: Middleware configuration issues
- **Clerk Integration Problems**: API key or configuration mismatches

**Handling Strategy**:
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/',
  '/inventory(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

## Testing Strategy

### Testing Phases

#### Phase 1: Component Migration Testing
- **Unit Tests**: Verify individual components render correctly
- **Integration Tests**: Test component interactions within layouts
- **Visual Regression Tests**: Ensure UI consistency

#### Phase 2: Routing and Navigation Testing
- **Route Resolution Tests**: Verify all URLs resolve correctly
- **Navigation Tests**: Test programmatic and link-based navigation
- **Authentication Flow Tests**: Verify protected route behavior

#### Phase 3: Build and Deployment Testing
- **Build Process Tests**: Ensure clean builds without errors
- **Environment Variable Tests**: Verify configuration in different environments
- **Performance Tests**: Compare bundle sizes and load times

### Testing Tools and Approaches

#### Automated Testing
```typescript
// Component testing with Next.js
import { render, screen } from '@testing-library/react';
import { NextRouter } from 'next/router';
import Dashboard from '../app/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

test('Dashboard renders correctly', () => {
  render(<Dashboard />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
```

#### Manual Testing Checklist
1. **Authentication Flows**
   - Sign in/sign out functionality
   - Protected route redirection
   - Session persistence

2. **Page Rendering**
   - All pages load without errors
   - Material-UI components render correctly
   - Responsive design works across devices

3. **Navigation**
   - All internal links work
   - Browser back/forward buttons work
   - Direct URL access works

#### Performance Testing
- **Bundle Analysis**: Compare Vite vs Next.js bundle sizes
- **Load Time Comparison**: Measure page load performance
- **Core Web Vitals**: Ensure no regression in user experience metrics

### Rollback Strategy

#### Rollback Triggers
- Critical functionality broken
- Performance regression > 20%
- Authentication system failure
- Build process failure

#### Rollback Process
1. **Immediate**: Revert to previous deployment
2. **Investigation**: Identify root cause of issues
3. **Fix Forward**: Address issues in Next.js version
4. **Re-deploy**: Deploy fixed version

### Success Criteria

#### Functional Success Criteria
- All existing pages accessible and functional
- Authentication flows work identically
- No visual regressions in UI components
- All user interactions work as expected

#### Performance Success Criteria
- Page load times equal or better than current
- Bundle size optimized or equivalent
- Core Web Vitals scores maintained or improved
- Build times reasonable (< 2x current build time)

#### Technical Success Criteria
- Clean builds with no errors or warnings
- TypeScript compilation successful
- ESLint passes with existing rules
- All environment configurations working