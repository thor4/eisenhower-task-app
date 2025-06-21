import {
  generateId,
  createTask,
  sortTasks,
  filterTasks,
  getFilteredAndSortedTasks,
  validateTask,
} from '@/utils/helpers';
import { Task, Priority } from '@/types';

describe('Helpers', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('createTask', () => {
    it('should create a task with correct properties', () => {
      const title = 'Test task';
      const priority: Priority = 3;
      const task = createTask(title, priority);

      expect(task.title).toBe(title);
      expect(task.priority).toBe(priority);
      expect(task.completed).toBe(false);
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('should trim whitespace from title', () => {
      const task = createTask('  Test task  ', 2);
      expect(task.title).toBe('Test task');
    });
  });

  describe('sortTasks', () => {
    const tasks: Task[] = [
      createTask('Low priority', 1),
      createTask('High priority', 4),
      createTask('Medium priority', 2),
    ];

    it('should sort by priority (highest first)', () => {
      const sorted = sortTasks(tasks, 'priority');
      expect(sorted[0].priority).toBe(4);
      expect(sorted[1].priority).toBe(2);
      expect(sorted[2].priority).toBe(1);
    });

    it('should sort by created date (newest first)', () => {
      const task1 = createTask('First', 1);
      const task2 = createTask('Second', 1);
      task1.createdAt = new Date('2023-01-01');
      task2.createdAt = new Date('2023-01-02');

      const sorted = sortTasks([task1, task2], 'created');
      expect(sorted[0].title).toBe('Second');
      expect(sorted[1].title).toBe('First');
    });

    it('should not mutate original array', () => {
      const original = [...tasks];
      sortTasks(tasks, 'priority');
      expect(tasks).toEqual(original);
    });
  });

  describe('filterTasks', () => {
    const tasks: Task[] = [
      { ...createTask('Active task', 1), completed: false },
      { ...createTask('Completed task', 2), completed: true },
      { ...createTask('Another active', 3), completed: false },
    ];

    it('should return all tasks when filter is "all"', () => {
      const filtered = filterTasks(tasks, 'all');
      expect(filtered).toHaveLength(3);
    });

    it('should return only active tasks when filter is "active"', () => {
      const filtered = filterTasks(tasks, 'active');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(task => !task.completed)).toBe(true);
    });

    it('should return only completed tasks when filter is "completed"', () => {
      const filtered = filterTasks(tasks, 'completed');
      expect(filtered).toHaveLength(1);
      expect(filtered.every(task => task.completed)).toBe(true);
    });
  });

  describe('getFilteredAndSortedTasks', () => {
    it('should apply both filter and sort', () => {
      const tasks: Task[] = [
        { ...createTask('Active low', 1), completed: false },
        { ...createTask('Active high', 4), completed: false },
        { ...createTask('Completed', 3), completed: true },
      ];

      const result = getFilteredAndSortedTasks(tasks, 'active', 'priority');
      expect(result).toHaveLength(2);
      expect(result[0].priority).toBe(4);
      expect(result[1].priority).toBe(1);
    });
  });

  describe('validateTask', () => {
    it('should return null for valid task', () => {
      const error = validateTask('Valid task', 3);
      expect(error).toBeNull();
    });

    it('should return error for empty title', () => {
      const error = validateTask('', 3);
      expect(error).toBe('Task title is required');
    });

    it('should return error for whitespace-only title', () => {
      const error = validateTask('   ', 3);
      expect(error).toBe('Task title is required');
    });

    it('should return error for title too long', () => {
      const longTitle = 'a'.repeat(201);
      const error = validateTask(longTitle, 3);
      expect(error).toBe('Task title must be 200 characters or less');
    });

    it('should return error for invalid priority', () => {
      const error = validateTask('Valid title', 5 as Priority);
      expect(error).toBe('Priority must be between 1 and 4');
    });
  });
});