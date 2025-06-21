## Development Workflows

### Standalone React Development
```bash
cd lively-react
npm install
npm run dev
```

### Integration Development (Recommended)
For developing the React component within the AngularJS host:

```bash
# Option 1: Auto-rebuild with file watching
npm run dev:integration

# Option 2: Manual build and copy
npm run build:copy

# Option 3: One-time integration build
npm run integration
```

### Available Scripts

- `npm run dev` - Start standalone React development server
- `npm run build` - Build for production
- `npm run build:integration` - Build for AngularJS integration
- `npm run build:copy` - Build and copy to Angular project
- `npm run dev:integration` - Development mode with auto-rebuild and Angular server
- `npm run integration` - Build, copy, and serve Angular project
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Integration Architecture

The React component is built as a UMD module that can be mounted in AngularJS:

1. **Build Process**: Creates a UMD bundle in `copy-angular-output/dist/`
2. **Integration**: AngularJS directive mounts the React component
3. **State Management**: React component manages its own state independently
4. **Data Persistence**: Uses IndexedDB for client-side storage

## Data Models

### Core Interfaces
```typescript
interface LunchItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  available?: boolean;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  date: string;
  items: LunchItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
```
