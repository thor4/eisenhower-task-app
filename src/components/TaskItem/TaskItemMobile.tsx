import React, { useState, useRef, useEffect } from 'react';
import { Task, PRIORITY_LABELS, Priority } from '@/types';

interface TaskItemMobileProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  className?: string;
}

export const TaskItemMobile: React.FC<TaskItemMobileProps> = ({
  task,
  onToggle,
  onDelete,
  onPriorityChange,
  className = '',
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeState, setSwipeState] = useState<'none' | 'delete' | 'priority-up' | 'priority-down'>('none');
  const [isPressed, setIsPressed] = useState(false);
  const taskRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const priorityClass = `priority-${task.priority}`;
  const completedClass = task.completed ? 'completed' : '';

  // Minimum distance for swipe detection
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
    setSwipeState('none');
    setIsPressed(true);

    // Start long press timer for priority change
    longPressTimer.current = setTimeout(() => {
      // Vibrate if available for haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });

    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    // Clear long press timer if user moves
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        setSwipeState(deltaX > 0 ? 'delete' : 'delete');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        setSwipeState(deltaY < 0 ? 'priority-up' : 'priority-down');
      }
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!touchStart || !touchEnd) {
      // Simple tap - toggle completion
      onToggle(task.id);
      return;
    }

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    // Handle swipe actions
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe - delete
      if (navigator.vibrate) navigator.vibrate(100);
      onDelete(task.id);
    } else if (Math.abs(deltaY) > minSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical swipe - change priority
      if (navigator.vibrate) navigator.vibrate(50);
      
      if (deltaY < 0) {
        // Swipe up - increase priority
        const newPriority = Math.min(3, task.priority + 1) as Priority;
        if (newPriority !== task.priority) {
          onPriorityChange(task.id, newPriority);
        }
      } else {
        // Swipe down - decrease priority
        const newPriority = Math.max(1, task.priority - 1) as Priority;
        if (newPriority !== task.priority) {
          onPriorityChange(task.id, newPriority);
        }
      }
    } else {
      // Small movement or tap - toggle completion
      onToggle(task.id);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setSwipeState('none');
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <div
      ref={taskRef}
      className={`task-item-mobile ${priorityClass} ${completedClass} ${className} ${isPressed ? 'pressed' : ''} ${swipeState !== 'none' ? `swipe-${swipeState}` : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}. Priority ${task.priority}. ${task.completed ? 'Completed' : 'Active'}. Tap to toggle, swipe right to delete, swipe up/down to change priority.`}
    >
      <div className="task-content-mobile">
        <div className="priority-indicator-mobile" title={`Priority ${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </div>
        
        <div className="task-main-mobile">
          <span className={`task-title-mobile ${task.completed ? 'strikethrough' : ''}`}>
            {task.title}
          </span>
        </div>

        <div className="task-status-mobile">
          {task.completed ? '✓' : '○'}
        </div>
      </div>

      <div className="task-meta-mobile">
        <small className="task-date-mobile">
          {task.completed ? 'Completed' : 'Created'}: {' '}
          {(task.completed ? task.updatedAt : task.createdAt).toLocaleDateString()}
        </small>
      </div>

      {/* Swipe hints */}
      {swipeState === 'delete' && (
        <div className="swipe-hint delete-hint">Release to delete</div>
      )}
      {swipeState === 'priority-up' && (
        <div className="swipe-hint priority-hint">Release to increase priority</div>
      )}
      {swipeState === 'priority-down' && (
        <div className="swipe-hint priority-hint">Release to decrease priority</div>
      )}
    </div>
  );
};

export default TaskItemMobile;