import { useReducer, useCallback } from 'react';
import { Task, TaskState, TaskAction, Priority } from '@/types';
import { createTask, getFilteredAndSortedTasks } from '@/utils/helpers';

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

export const useTasks = () => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const addTask = useCallback((title: string, priority: Priority) => {
    dispatch({ type: 'ADD_TASK', payload: { title, priority, completed: false } });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }, []);

  const setFilter = useCallback((filter: TaskState['filter']) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const setSortBy = useCallback((sortBy: TaskState['sortBy']) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  const loadTasks = useCallback((tasks: Task[]) => {
    dispatch({ type: 'LOAD_TASKS', payload: tasks });
  }, []);

  const filteredAndSortedTasks = getFilteredAndSortedTasks(
    state.tasks,
    state.filter,
    state.sortBy
  );

  return {
    state,
    dispatch,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
    setSortBy,
    clearCompleted,
    loadTasks,
    filteredAndSortedTasks,
  };
};