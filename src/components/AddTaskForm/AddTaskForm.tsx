import React, { useState } from 'react';
import { Priority } from '@/types';
import { validateTask } from '@/utils/helpers';
import { PrioritySelector } from '@/components/PrioritySelector';

interface AddTaskFormProps {
  onAddTask: (title: string, priority: Priority) => void;
  className?: string;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onAddTask,
  className = '',
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(4); // Default to highest priority
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateTask(title, priority);
    if (validationError) {
      setError(validationError);
      return;
    }

    onAddTask(title, priority);
    setTitle('');
    setPriority(4);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className={`add-task-form ${className}`}>
      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Task Title:
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task description..."
          className="task-input"
          maxLength={200}
          required
        />
      </div>

      <div className="form-group">
        <PrioritySelector
          value={priority}
          onChange={setPriority}
          className="priority-selector-form"
        />
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="add-button"
        disabled={!title.trim()}
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;