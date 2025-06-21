import { 
  loadTasksFromStorage, 
  saveTasksToStorage, 
  clearStorage, 
  exportTasks, 
  importTasks 
} from '@/utils/storage';
import { Task, Priority } from '@/types';

// Mock localStorage
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  const sampleTask: Task = {
    id: '1',
    title: 'Test task',
    priority: 3 as Priority,
    completed: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  };

  describe('saveTasksToStorage', () => {
    it('should save tasks to localStorage', () => {
      const tasks = [sampleTask];
      
      saveTasksToStorage(tasks);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'eisenhower-tasks',
        JSON.stringify(tasks)
      );
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => saveTasksToStorage([sampleTask])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save tasks to storage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('loadTasksFromStorage', () => {
    it('should load tasks from localStorage', () => {
      const tasks = [sampleTask];
      mockLocalStorage.store['eisenhower-tasks'] = JSON.stringify(tasks);
      
      const loaded = loadTasksFromStorage();
      
      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe(sampleTask.id);
      expect(loaded[0].title).toBe(sampleTask.title);
      expect(loaded[0].createdAt).toBeInstanceOf(Date);
      expect(loaded[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should return empty array when no data exists', () => {
      const loaded = loadTasksFromStorage();
      
      expect(loaded).toEqual([]);
    });

    it('should handle invalid JSON gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.store['eisenhower-tasks'] = 'invalid json';
      
      const loaded = loadTasksFromStorage();
      
      expect(loaded).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load tasks from storage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('clearStorage', () => {
    it('should remove tasks from localStorage', () => {
      mockLocalStorage.store['eisenhower-tasks'] = JSON.stringify([sampleTask]);
      
      clearStorage();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('eisenhower-tasks');
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => clearStorage()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear storage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('exportTasks', () => {
    it('should export tasks as formatted JSON', () => {
      const tasks = [sampleTask];
      
      const exported = exportTasks(tasks);
      
      expect(exported).toBe(JSON.stringify(tasks, null, 2));
    });
  });

  describe('importTasks', () => {
    it('should import valid task data', () => {
      const tasks = [sampleTask];
      const data = JSON.stringify(tasks);
      
      const imported = importTasks(data);
      
      expect(imported).toHaveLength(1);
      expect(imported[0].id).toBe(sampleTask.id);
      expect(imported[0].title).toBe(sampleTask.title);
      expect(imported[0].createdAt).toBeInstanceOf(Date);
      expect(imported[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => importTasks('invalid json')).toThrow('Failed to import tasks');
    });

    it('should throw error for non-array data', () => {
      const data = JSON.stringify({ not: 'array' });
      
      expect(() => importTasks(data)).toThrow('Data must be an array of tasks');
    });

    it('should throw error for invalid task structure', () => {
      const data = JSON.stringify([{ invalid: 'task' }]);
      
      expect(() => importTasks(data)).toThrow('Invalid task structure');
    });

    it('should handle missing dates by using current time', () => {
      const taskWithoutDates = {
        id: '1',
        title: 'Test task',
        priority: 3,
        completed: false,
      };
      const data = JSON.stringify([taskWithoutDates]);
      
      const imported = importTasks(data);
      
      expect(imported[0].createdAt).toBeInstanceOf(Date);
      expect(imported[0].updatedAt).toBeInstanceOf(Date);
    });
  });
});