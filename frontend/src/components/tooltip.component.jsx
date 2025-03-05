import React, { useState } from 'react';

const Tooltip = ({ children, tooltipText, onClick, tooltipPosition = 'top' }) => { // Добавляем tooltipPosition
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="tooltip-button" onClick={onClick}>
        {children}
      </button>
      {isHovered && (
        <span className={`tooltip-text ${tooltipPosition}`}>{tooltipText}</span> // Добавляем класс с направлением
      )}
    </div>
  );
};

export default Tooltip;
