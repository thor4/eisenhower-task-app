import React from 'react';
import { Priority, PRIORITY_LABELS, PRIORITY_DESCRIPTIONS } from '@/types';

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  className?: string;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`priority-selector ${className}`}>
      <label htmlFor="priority-select" className="priority-label">
        Priority:
      </label>
      <select
        id="priority-select"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) as Priority)}
        className="priority-select"
        title={PRIORITY_DESCRIPTIONS[value]}
      >
        {([4, 3, 2, 1] as Priority[]).map((priority) => (
          <option key={priority} value={priority}>
            {PRIORITY_LABELS[priority]} - {PRIORITY_DESCRIPTIONS[priority]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PrioritySelector;