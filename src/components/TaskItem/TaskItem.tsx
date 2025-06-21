import React from 'react';
import { Task, PRIORITY_LABELS } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
  className?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  className = '',
}) => {
  const priorityClass = `priority-${task.priority}`;
  const completedClass = task.completed ? 'completed' : '';

  return (
    <div className={`task-item ${priorityClass} ${completedClass} ${className}`}>
      <div className="task-content">
        <span className="priority-indicator" title={`Priority ${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        
        <div className="task-main">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="task-checkbox"
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          
          <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
            {task.title}
          </span>
        </div>
      </div>

      <div className="task-actions">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="edit-button"
            aria-label={`Edit "${task.title}"`}
            title="Edit task"
          >
            ✏️
          </button>
        )}
        
        <button
          onClick={() => onDelete(task.id)}
          className="delete-button"
          aria-label={`Delete "${task.title}"`}
          title="Delete task"
        >
          🗑️
        </button>
      </div>

      <div className="task-meta">
        <small className="task-date">
          {task.completed ? 'Completed' : 'Created'}: {' '}
          {(task.completed ? task.updatedAt : task.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
};

export default TaskItem;