# Development Guide

## Architecture Overview

The Eisenhower Task Manager follows a clean architecture pattern with clear separation of concerns:

### Layers

1. **Presentation Layer** (`src/components/`)
   - React components for UI
   - Focused on presentation logic only
   - Receives data and callbacks from container components

2. **Business Logic Layer** (`src/hooks/`, `src/utils/`)
   - Core task management operations
   - Data transformation and validation
   - Side effect management (storage)

3. **Data Layer** (`src/types/`, `src/utils/storage.ts`)
   - Type definitions
   - Data persistence
   - API abstractions (future)

### Design Patterns

#### State Management Pattern
```typescript
// Centralized state with reducer pattern
const [state, dispatch] = useReducer(taskReducer, initialState);

// Action-based updates
dispatch({ type: 'ADD_TASK', payload: taskData });
```

#### Hook Composition Pattern
```typescript
// Compose multiple concerns
export const useTasks = () => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const storage = useStorage(state.tasks);
  
  return {
    state,
    actions: { addTask, updateTask, ... },
    computed: { filteredTasks }
  };
};
```

#### Storage Abstraction Pattern
```typescript
// Abstract storage implementation
export interface StorageAdapter {
  load(): Task[];
  save(tasks: Task[]): void;
  clear(): void;
}

// localStorage implementation
export const localStorageAdapter: StorageAdapter = {
  load: loadTasksFromStorage,
  save: saveTasksToStorage,
  clear: clearStorage,
};
```

## Testing Strategy

### Test-Driven Development (TDD)

1. **Red**: Write failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

#### Example TDD Cycle
```typescript
// 1. Red - Write failing test
it('should add a task with priority', () => {
  const result = addTask('Test task', 3);
  expect(result.priority).toBe(3);
});

// 2. Green - Minimal implementation
const addTask = (title: string, priority: Priority) => {
  return { title, priority };
};

// 3. Refactor - Full implementation
const addTask = (title: string, priority: Priority): Task => {
  return createTask(title, priority);
};
```

### Test Categories

#### Unit Tests
- Pure functions in `utils/`
- Individual components
- Custom hooks

#### Integration Tests
- Hook + storage combinations
- Component + hook interactions
- End-to-end user workflows

#### Property-Based Testing (Future)
```typescript
// Example property test
it('should maintain task count through operations', () => {
  fc.assert(fc.property(
    fc.array(taskGenerator),
    (tasks) => {
      const finalCount = applyOperations(tasks).length;
      expect(finalCount).toBeGreaterThanOrEqual(0);
    }
  ));
});
```

## Component Design

### Composition over Inheritance
```typescript
// Good: Composable components
<TaskList
  tasks={filteredTasks}
  renderItem={(task) => <TaskItem task={task} />}
  renderEmpty={() => <EmptyState />}
/>

// Avoid: Inheritance-based components
class TaskListBase extends Component {
  // Large, hard to test component
}
```

### Container/Presenter Pattern
```typescript
// Container: Handles state and logic
const TaskListContainer = () => {
  const { tasks, actions } = useTasks();
  
  return (
    <TaskList
      tasks={tasks}
      onToggle={actions.toggleTask}
      onDelete={actions.deleteTask}
    />
  );
};

// Presenter: Pure UI component
const TaskList = ({ tasks, onToggle, onDelete }) => {
  return (
    <div>
      {tasks.map(task => 
        <TaskItem 
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      )}
    </div>
  );
};
```

## Performance Considerations

### Optimization Techniques

#### Memoization
```typescript
// Memoize expensive computations
const filteredTasks = useMemo(() => 
  getFilteredAndSortedTasks(tasks, filter, sortBy),
  [tasks, filter, sortBy]
);

// Memoize callback functions
const handleToggle = useCallback((id: string) => {
  dispatch({ type: 'TOGGLE_TASK', payload: id });
}, []);
```

#### Virtual Scrolling (Future)
For large task lists:
```typescript
import { VirtualList } from 'react-virtual';

const VirtualTaskList = ({ tasks }) => {
  return (
    <VirtualList
      height={400}
      itemCount={tasks.length}
      itemSize={80}
      renderItem={({ index }) => 
        <TaskItem task={tasks[index]} />
      }
    />
  );
};
```

### Bundle Size Optimization

#### Code Splitting
```typescript
// Lazy load heavy components
const TaskAnalytics = lazy(() => import('./TaskAnalytics'));

// Use Suspense boundary
<Suspense fallback={<Loading />}>
  <TaskAnalytics />
</Suspense>
```

#### Tree Shaking
```typescript
// Good: Named imports
import { sortTasks } from '@/utils/helpers';

// Avoid: Namespace imports
import * as helpers from '@/utils/helpers';
```

## Error Handling

### Error Boundaries
```typescript
class TaskErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### Graceful Degradation
```typescript
// Handle storage failures gracefully
const saveWithFallback = (tasks: Task[]) => {
  try {
    saveTasksToStorage(tasks);
  } catch (error) {
    // Log error but don't crash
    console.error('Storage failed:', error);
    showNotification('Changes not saved - please try again');
  }
};
```

## Accessibility Guidelines

### Semantic HTML
```typescript
// Good: Semantic structure
<main>
  <section aria-labelledby="add-task-heading">
    <h2 id="add-task-heading">Add New Task</h2>
    <form>...</form>
  </section>
</main>

// Avoid: Generic divs
<div>
  <div>Add New Task</div>
  <div>...</div>
</div>
```

### ARIA Labels
```typescript
<button
  onClick={onDelete}
  aria-label={`Delete task: ${task.title}`}
  title="Delete task"
>
  🗑️
</button>
```

### Keyboard Navigation
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      onToggle();
      break;
    case 'Delete':
      onDelete();
      break;
  }
};
```

## Mobile Adaptation Strategy

### Responsive Design
```css
/* Mobile-first approach */
.task-item {
  /* Mobile styles by default */
  padding: 1rem;
  flex-direction: column;
}

/* Tablet and larger */
@media (min-width: 768px) {
  .task-item {
    flex-direction: row;
    padding: 0.75rem 1rem;
  }
}
```

### Touch Interactions
```css
/* Increase touch targets */
.task-checkbox {
  min-width: 44px;
  min-height: 44px;
}

/* Improve hover states for touch */
@media (hover: hover) {
  .task-item:hover {
    background: #f5f5f5;
  }
}
```

### React Native Migration Path

1. **Shared Logic**: Business logic already separated
2. **Component Mapping**: 
   - `div` → `View`
   - `span` → `Text`
   - `button` → `TouchableOpacity`
3. **Styling**: Convert CSS to StyleSheet
4. **Storage**: Replace localStorage with AsyncStorage

## Deployment

### Build Optimization
```bash
# Production build
npm run build

# Analyze bundle
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### Progressive Web App
```typescript
// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Offline support
const CACHE_NAME = 'eisenhower-tasks-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];
```

## Monitoring and Analytics

### Error Tracking
```typescript
// Integrate with error reporting service
window.addEventListener('unhandledrejection', (event) => {
  errorService.captureException(event.reason);
});
```

### Performance Metrics
```typescript
// Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Future Enhancements

### Planned Features
1. **Offline Sync**: Service worker + background sync
2. **Real-time Collaboration**: WebSocket integration
3. **Advanced Analytics**: Task completion patterns
4. **AI Suggestions**: Priority recommendations
5. **Calendar Integration**: Due date management

### Technical Debt
- [ ] Add React component tests
- [ ] Implement proper error boundaries
- [ ] Add performance monitoring
- [ ] Optimize for large datasets
- [ ] Implement proper loading states