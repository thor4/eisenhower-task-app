import { Task, Priority } from '@/types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createTask = (title: string, priority: Priority): Task => {
  const now = new Date();
  return {
    id: generateId(),
    title: title.trim(),
    priority,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
};

export const sortTasks = (tasks: Task[], sortBy: 'priority' | 'created' | 'updated'): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // Higher priority first (4 before 1)
        return b.priority - a.priority;
      case 'created':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'updated':
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      default:
        return 0;
    }
  });
};

export const filterTasks = (tasks: Task[], filter: 'all' | 'active' | 'completed'): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'all':
    default:
      return tasks;
  }
};

export const getFilteredAndSortedTasks = (
  tasks: Task[],
  filter: 'all' | 'active' | 'completed',
  sortBy: 'priority' | 'created' | 'updated'
): Task[] => {
  const filtered = filterTasks(tasks, filter);
  return sortTasks(filtered, sortBy);
};

export const validateTask = (title: string, priority: Priority): string | null => {
  if (!title.trim()) {
    return 'Task title is required';
  }
  if (title.trim().length > 200) {
    return 'Task title must be 200 characters or less';
  }
  if (![0, 1, 2, 3].includes(priority)) {
    return 'Priority must be between 0 and 3';
  }
  return null;
};