import { Task } from '@/types';

const STORAGE_KEY = 'eisenhower-tasks';

export const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    
    // Convert date strings back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load tasks from storage:', error);
    return [];
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to storage:', error);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};

export const exportTasks = (tasks: Task[]): string => {
  return JSON.stringify(tasks, null, 2);
};

export const importTasks = (data: string): Task[] => {
  try {
    const tasks = JSON.parse(data);
    
    // Validate the structure
    if (!Array.isArray(tasks)) {
      throw new Error('Data must be an array of tasks');
    }
    
    return tasks.map((task: any) => {
      if (!task.id || !task.title || typeof task.priority !== 'number') {
        throw new Error('Invalid task structure');
      }
      
      return {
        ...task,
        createdAt: new Date(task.createdAt || Date.now()),
        updatedAt: new Date(task.updatedAt || Date.now()),
      };
    });
  } catch (error) {
    throw new Error(`Failed to import tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};