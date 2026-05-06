import React from 'react';
import './RightPanel.css';

const RightPanel = ({ collapsed, title, children }) => {
  return (
    <div className={`right-panel ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed && (
        <>
          <div className="right-panel-header">
            <h3 className="panel-title">{title}</h3>
          </div>

          <div className="right-panel-content">
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default RightPanel;
