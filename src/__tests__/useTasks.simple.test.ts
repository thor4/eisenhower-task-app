import { TaskState, TaskAction, Priority } from '@/types';
import { createTask } from '@/utils/helpers';

// Extract the reducer function for testing
const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  sortBy: 'priority',
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = createTask(action.payload.title, action.payload.priority);
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }

    case 'UPDATE_TASK': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates, updatedAt: new Date() }
          : task
      );
      return {
        ...state,
        tasks: updatedTasks,
      };
    }

    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    }

    case 'TOGGLE_TASK': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      );
      return {
        ...state,
        tasks: updatedTasks,
      };
    }

    case 'SET_FILTER': {
      return {
        ...state,
        filter: action.payload,
      };
    }

    case 'SET_SORT': {
      return {
        ...state,
        sortBy: action.payload,
      };
    }

    case 'LOAD_TASKS': {
      return {
        ...state,
        tasks: action.payload,
      };
    }

    case 'CLEAR_COMPLETED': {
      return {
        ...state,
        tasks: state.tasks.filter(task => !task.completed),
      };
    }

    default:
      return state;
  }
};

describe('Task Reducer', () => {
  it('should add a task', () => {
    const action: TaskAction = {
      type: 'ADD_TASK',
      payload: { title: 'Test task', priority: 3, completed: false }
    };

    const newState = taskReducer(initialState, action);
    
    expect(newState.tasks).toHaveLength(1);
    expect(newState.tasks[0].title).toBe('Test task');
    expect(newState.tasks[0].priority).toBe(3);
    expect(newState.tasks[0].completed).toBe(false);
  });

  it('should update a task', () => {
    const task = createTask('Test task', 3);
    const stateWithTask: TaskState = {
      ...initialState,
      tasks: [task]
    };

    const action: TaskAction = {
      type: 'UPDATE_TASK',
      payload: { id: task.id, updates: { title: 'Updated task', priority: 4 } }
    };

    const newState = taskReducer(stateWithTask, action);
    
    expect(newState.tasks[0].title).toBe('Updated task');
    expect(newState.tasks[0].priority).toBe(4);
  });

  it('should delete a task', () => {
    const task = createTask('Test task', 3);
    const stateWithTask: TaskState = {
      ...initialState,
      tasks: [task]
    };

    const action: TaskAction = {
      type: 'DELETE_TASK',
      payload: task.id
    };

    const newState = taskReducer(stateWithTask, action);
    
    expect(newState.tasks).toHaveLength(0);
  });

  it('should toggle task completion', () => {
    const task = createTask('Test task', 3);
    const stateWithTask: TaskState = {
      ...initialState,
      tasks: [task]
    };

    const action: TaskAction = {
      type: 'TOGGLE_TASK',
      payload: task.id
    };

    const newState = taskReducer(stateWithTask, action);
    
    expect(newState.tasks[0].completed).toBe(true);

    const newState2 = taskReducer(newState, action);
    expect(newState2.tasks[0].completed).toBe(false);
  });

  it('should set filter', () => {
    const action: TaskAction = {
      type: 'SET_FILTER',
      payload: 'active'
    };

    const newState = taskReducer(initialState, action);
    
    expect(newState.filter).toBe('active');
  });

  it('should set sort order', () => {
    const action: TaskAction = {
      type: 'SET_SORT',
      payload: 'created'
    };

    const newState = taskReducer(initialState, action);
    
    expect(newState.sortBy).toBe('created');
  });

  it('should clear completed tasks', () => {
    const task1 = createTask('Active task', 3);
    const task2 = { ...createTask('Completed task', 2), completed: true };
    
    const stateWithTasks: TaskState = {
      ...initialState,
      tasks: [task1, task2]
    };

    const action: TaskAction = {
      type: 'CLEAR_COMPLETED'
    };

    const newState = taskReducer(stateWithTasks, action);
    
    expect(newState.tasks).toHaveLength(1);
    expect(newState.tasks[0].title).toBe('Active task');
  });

  it('should load tasks from external source', () => {
    const externalTasks = [
      {
        id: '1',
        title: 'External task 1',
        priority: 3 as Priority,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'External task 2',
        priority: 1 as Priority,
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const action: TaskAction = {
      type: 'LOAD_TASKS',
      payload: externalTasks
    };

    const newState = taskReducer(initialState, action);
    
    expect(newState.tasks).toHaveLength(2);
    expect(newState.tasks[0].title).toBe('External task 1');
    expect(newState.tasks[1].title).toBe('External task 2');
  });
});