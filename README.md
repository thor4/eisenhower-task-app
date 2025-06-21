# 📋 Eisenhower Task Manager

A mobile-optimized task management application that uses the Eisenhower method with asterisk-based priority indicators. Built with React, TypeScript, and Test-Driven Development.

## ✨ Features

### Priority System
- **4 Asterisks (****)**: Urgent & Important (Do First) - Red
- **3 Asterisks (***)**: Important, Not Urgent (Schedule) - Orange  
- **2 Asterisks (**)**: Urgent, Not Important (Delegate) - Yellow
- **1 Asterisk (*)**: Neither Urgent nor Important (Don't Do) - Green

### Core Functionality
- ✅ Add, edit, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Visual priority indicators with color coding
- ✅ Filter tasks (All, Active, Completed)
- ✅ Sort by priority, creation date, or last updated
- ✅ Automatic local storage persistence
- ✅ Clear completed tasks
- ✅ Mobile-responsive design
- ✅ Dark mode support
- ✅ Accessibility features

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eisenhower-task-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run build` - Build the app for production
- `npm run lint` - Run TypeScript type checking

## 🧪 Testing

The project follows Test-Driven Development (TDD) principles with comprehensive test coverage:

- **Unit Tests**: Core business logic and utilities
- **Integration Tests**: Task management workflows
- **Storage Tests**: Data persistence functionality

Run tests:
```bash
npm test
```

View coverage report:
```bash
npm run test:coverage
```

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── AddTaskForm/    # Task creation form
│   ├── TaskItem/       # Individual task display
│   ├── TaskList/       # Task list container
│   ├── PrioritySelector/ # Priority selection UI
│   └── FilterControls/ # Filtering and sorting
├── hooks/              # Custom React hooks
│   ├── useTasks.ts     # Task management logic
│   └── useStorage.ts   # Storage integration
├── utils/              # Utility functions
│   ├── helpers.ts      # Task manipulation utilities
│   └── storage.ts      # Local storage operations
├── types/              # TypeScript type definitions
└── __tests__/          # Test files
```

### Data Models

```typescript
interface Task {
  id: string;
  title: string;
  priority: 1 | 2 | 3 | 4; // Asterisk count
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### State Management
The app uses React's built-in state management with:
- `useReducer` for complex task operations
- `useContext` pattern ready for future scaling
- Local storage integration for persistence

## 🎨 Design Principles

### Mobile-First
- Responsive design optimized for mobile devices
- Touch-friendly interface elements
- Progressive enhancement for larger screens

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color scheme

### Performance
- Efficient state updates with useReducer
- Optimized re-renders with useCallback
- Lightweight bundle size

## 📱 Mobile Adaptation

While currently built as a Progressive Web App (PWA), the architecture is designed for easy adaptation to React Native:

### Ready for React Native
- Separated business logic from UI components
- Modular component architecture
- TypeScript throughout for type safety
- Storage abstraction layer

### Future Mobile Features
- Offline synchronization
- Push notifications for task reminders
- Export to calendar apps
- Widget support

## 🔧 Customization

### Adding New Priority Levels
Modify the `Priority` type in `src/types/index.ts`:

```typescript
export type Priority = 1 | 2 | 3 | 4 | 5; // Add level 5

export const PRIORITY_LABELS: Record<Priority, string> = {
  5: '*****', // Add new level
  4: '****',
  // ... rest
};
```

### Styling
The app uses CSS custom properties for easy theming. Modify `src/App.css` for:
- Color schemes
- Typography
- Spacing
- Mobile breakpoints

## 🗂️ Data Management

### Local Storage
Tasks are automatically saved to browser local storage and persist between sessions.

### Export/Import
```typescript
// Export tasks
const exported = exportTasks(tasks);

// Import tasks
const imported = importTasks(jsonData);
```

## 🐛 Known Issues & Limitations

1. **Storage**: Limited to browser local storage (5-10MB)
2. **Sync**: No cloud synchronization between devices
3. **Offline**: Works offline but no conflict resolution
4. **Performance**: Not optimized for thousands of tasks

## 🚧 Future Enhancements

- [ ] Cloud synchronization
- [ ] Team collaboration features
- [ ] Calendar integration
- [ ] Task templates
- [ ] Due dates and reminders
- [ ] Task categories/tags
- [ ] Search functionality
- [ ] Analytics and productivity insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Write tests for your changes
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow TDD principles
- Maintain >80% test coverage
- Use TypeScript strictly
- Follow accessibility best practices
- Keep components small and focused

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Eisenhower Method for priority framework
- React community for excellent tooling
- Contributors and testers

---

Built with ❤️ using React, TypeScript, and TDD principles.