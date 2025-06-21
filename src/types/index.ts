export type Priority = 0 | 1 | 2 | 3;

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  sortBy: 'priority' | 'created' | 'updated';
}

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: TaskState['filter'] }
  | { type: 'SET_SORT'; payload: TaskState['sortBy'] }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'CLEAR_COMPLETED' };

export interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  addTask: (title: string, priority: Priority) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: TaskState['filter']) => void;
  setSortBy: (sortBy: TaskState['sortBy']) => void;
  clearCompleted: () => void;
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  3: '***', // Urgent & Important (Do First)
  2: '**',  // Important but not urgent (Schedule)  
  1: '*',   // Nice to have
  0: '',    // Backlog (no asterisk)
};

export const PRIORITY_DESCRIPTIONS: Record<Priority, string> = {
  3: 'Urgent & Important (Do First)',
  2: 'Important but not urgent (Schedule)',
  1: 'Nice to have',
  0: 'Backlog',
};