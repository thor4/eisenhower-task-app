import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, PRIORITY_LABELS, Priority } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  className?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onPriorityChange,
  className = '',
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [swipeState, setSwipeState] = useState<'none' | 'swiping'>('none');

  const priorityClass = `priority-${task.priority}`;
  const completedClass = task.completed ? 'completed' : '';

  // Simple click handler for desktop and mobile
  const handleTaskClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(task.id);
  };

  // Swipe handlers using react-swipeable
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (navigator.vibrate) navigator.vibrate(100);
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000); // Auto-hide after 3s
    },
    onSwipedRight: () => {
      if (navigator.vibrate) navigator.vibrate(100);
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    },
    onSwipedUp: () => {
      if (navigator.vibrate) navigator.vibrate(50);
      const newPriority = Math.min(3, task.priority + 1) as Priority;
      if (newPriority !== task.priority) {
        onPriorityChange(task.id, newPriority);
      }
    },
    onSwipedDown: () => {
      if (navigator.vibrate) navigator.vibrate(50);
      const newPriority = Math.max(0, task.priority - 1) as Priority;
      if (newPriority !== task.priority) {
        onPriorityChange(task.id, newPriority);
      }
    },
    onSwiping: () => setSwipeState('swiping'),
    onSwiped: () => setSwipeState('none'),
    trackMouse: false, // Only track touch, not mouse
    preventScrollOnSwipe: true, // Prevent page scroll during swipe
    delta: 10, // Minimum distance before registering swipe
  });

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      {...swipeHandlers}
      className={`task-item ${priorityClass} ${completedClass} ${className} ${swipeState === 'swiping' ? 'swiping' : ''}`}
      onClick={handleTaskClick}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}. Priority ${task.priority}. ${task.completed ? 'Completed' : 'Active'}. Click to toggle completion.`}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="task-content">
        <span className="priority-indicator" title={`Priority ${task.priority}`}>
          {PRIORITY_LABELS[task.priority] || 'Backlog'}
        </span>
        
        <div className="task-main">
          <span className="task-status">
            {task.completed ? '✓' : '○'}
          </span>
          
          <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
            {task.title}
          </span>
        </div>

        {/* Desktop delete button */}
        <button
          className="delete-button-desktop"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
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

      {/* Delete confirmation overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="delete-confirm-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-content">
              <p>Delete this task?</p>
              <div className="delete-confirm-buttons">
                <button 
                  className="delete-confirm-yes"
                  onClick={handleDeleteConfirm}
                >
                  Yes
                </button>
                <button 
                  className="delete-confirm-no"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskItem;