import React from 'react';
import { Task } from '@/types';
import { TaskItem } from '@/components/TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: Task) => void;
  className?: string;
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  className = '',
  emptyMessage = 'No tasks found.',
}) => {
  if (tasks.length === 0) {
    return (
      <div className={`task-list-empty ${className}`}>
        <p className="empty-message">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`task-list ${className}`}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          className="task-list-item"
        />
      ))}
    </div>
  );
};

export default TaskList;