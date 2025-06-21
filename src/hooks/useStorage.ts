import { useEffect } from 'react';
import { Task } from '@/types';
import { loadTasksFromStorage, saveTasksToStorage } from '@/utils/storage';

export const useStorage = (
  tasks: Task[],
  loadTasks: (tasks: Task[]) => void
) => {
  // Load tasks from storage on mount
  useEffect(() => {
    const storedTasks = loadTasksFromStorage();
    if (storedTasks.length > 0) {
      loadTasks(storedTasks);
    }
  }, [loadTasks]);

  // Save tasks to storage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);
};