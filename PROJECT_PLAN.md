# Eisenhower Task Manager - Project Plan

## Overview
A mobile task management app that uses asterisks (*) to indicate priority levels based on the Eisenhower method, replacing the limitations of a basic notes app.

## Requirements Analysis

### Current Pain Points
- Using notes app is limiting
- No structured priority system
- Difficult to manage and organize tasks
- No visual priority indicators

### Core Features
1. **Priority System**: 1-4 asterisks representing Eisenhower quadrants
   - **** = Urgent & Important (Do First)
   - *** = Important, Not Urgent (Schedule)
   - ** = Urgent, Not Important (Delegate)
   - * = Neither Urgent nor Important (Don't Do)

2. **Task Management**
   - Add/edit/delete tasks
   - Mark tasks as complete
   - Visual priority indicators
   - Clean, mobile-optimized interface

3. **Data Persistence**
   - Local storage for offline access
   - Export/import functionality

## Technical Stack
- **Framework**: React Native (cross-platform mobile)
- **State Management**: React Context + useReducer
- **Storage**: AsyncStorage
- **Testing**: Jest + React Native Testing Library
- **Development**: Test-Driven Development (TDD)

## Architecture

### Data Models
```typescript
interface Task {
  id: string;
  title: string;
  priority: 1 | 2 | 3 | 4; // asterisk count
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  sortBy: 'priority' | 'created' | 'updated';
}
```

### Component Structure
```
App/
├── components/
│   ├── TaskList/
│   ├── TaskItem/
│   ├── AddTaskForm/
│   ├── PrioritySelector/
│   └── FilterControls/
├── hooks/
│   ├── useTasks/
│   └── useStorage/
├── utils/
│   ├── storage.ts
│   └── helpers.ts
├── types/
│   └── index.ts
└── __tests__/
```

## Development Phases

### Phase 1: Core Setup
- Project initialization
- Basic component structure
- Data models and types

### Phase 2: Core Logic (TDD)
- Task CRUD operations
- Priority system implementation
- State management

### Phase 3: UI Implementation
- Mobile-optimized interface
- Priority visualization
- Interactive components

### Phase 4: Persistence & Testing
- Local storage integration
- Comprehensive test coverage
- Performance optimization

## Success Criteria
- Intuitive asterisk-based priority system
- Fast, responsive mobile interface
- Reliable data persistence
- 90%+ test coverage
- Clear documentation