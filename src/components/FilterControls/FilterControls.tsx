import React from 'react';
import { TaskState } from '@/types';

interface FilterControlsProps {
  filter: TaskState['filter'];
  sortBy: TaskState['sortBy'];
  onFilterChange: (filter: TaskState['filter']) => void;
  onSortChange: (sortBy: TaskState['sortBy']) => void;
  onClearCompleted: () => void;
  taskCounts: {
    total: number;
    active: number;
    completed: number;
  };
  className?: string;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
  onClearCompleted,
  taskCounts,
  className = '',
}) => {
  return (
    <div className={`filter-controls ${className}`}>
      <div className="filter-section">
        <h3>Filter Tasks</h3>
        <div className="filter-buttons">
          {(['all', 'active', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => onFilterChange(filterOption)}
              className={`filter-button ${filter === filterOption ? 'active' : ''}`}
              title={`Show ${filterOption} tasks`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              <span className="count">
                ({filterOption === 'all' ? taskCounts.total : 
                  filterOption === 'active' ? taskCounts.active : 
                  taskCounts.completed})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="sort-section">
        <label htmlFor="sort-select" className="sort-label">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as TaskState['sortBy'])}
          className="sort-select"
        >
          <option value="priority">Priority (High to Low)</option>
          <option value="created">Date Created (Newest First)</option>
          <option value="updated">Last Updated (Newest First)</option>
        </select>
      </div>

      {taskCounts.completed > 0 && (
        <div className="actions-section">
          <button
            onClick={onClearCompleted}
            className="clear-completed-button"
            title="Remove all completed tasks"
          >
            Clear Completed ({taskCounts.completed})
          </button>
        </div>
      )}

      <div className="summary-section">
        <p className="task-summary">
          {taskCounts.active} active, {taskCounts.completed} completed, {taskCounts.total} total
        </p>
      </div>
    </div>
  );
};

export default FilterControls;