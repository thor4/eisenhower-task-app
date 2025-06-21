export type Priority = 1 | 2 | 3 | 4;

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
  4: '****', // Urgent & Important (Do First)
  3: '***',  // Important, Not Urgent (Schedule)  
  2: '**',   // Urgent, Not Important (Delegate)
  1: '*',    // Neither Urgent nor Important (Don't Do)
};

export const PRIORITY_DESCRIPTIONS: Record<Priority, string> = {
  4: 'Urgent & Important (Do First)',
  3: 'Important, Not Urgent (Schedule)',
  2: 'Urgent, Not Important (Delegate)',
  1: 'Neither Urgent nor Important (Don\'t Do)',
};