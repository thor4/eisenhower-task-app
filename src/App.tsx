import React from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useStorage } from '@/hooks/useStorage';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
import { FilterControls } from '@/components/FilterControls';
import './App.css';

const App: React.FC = () => {
  const {
    state,
    addTask,
    toggleTask,
    deleteTask,
    changePriority,
    setFilter,
    setSortBy,
    clearCompleted,
    loadTasks,
    filteredAndSortedTasks,
  } = useTasks();

  // Enable automatic save/load functionality
  useStorage(state.tasks, loadTasks);

  const taskCounts = {
    total: state.tasks.length,
    active: state.tasks.filter(t => !t.completed).length,
    completed: state.tasks.filter(t => t.completed).length,
  };

  const getEmptyMessage = () => {
    switch (state.filter) {
      case 'active':
        return 'No active tasks. Great job! 🎉';
      case 'completed':
        return 'No completed tasks yet.';
      default:
        return 'No tasks yet. Add your first task above!';
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Eisenhower Task Manager</h1>
        <p className="app-subtitle">
          Organize tasks by priority using the Eisenhower method
        </p>
      </header>

      <main className="app-main">
        <section className="add-task-section">
          <AddTaskForm onAddTask={addTask} />
        </section>

        <section className="filter-section">
          <FilterControls
            filter={state.filter}
            sortBy={state.sortBy}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            onClearCompleted={clearCompleted}
            taskCounts={taskCounts}
          />
        </section>

        <section className="task-list-section">
          <TaskList
            tasks={filteredAndSortedTasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onPriorityChange={changePriority}
            emptyMessage={getEmptyMessage()}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Priority levels: *** (Do First) | ** (Schedule) | * (Nice to Have) | Backlog
        </p>
        <p className="mobile-instructions">
          📱 Tap to complete • Swipe → to delete • Swipe ↑↓ to change priority
        </p>
      </footer>
    </div>
  );
};

export default App;