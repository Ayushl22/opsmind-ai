import React from 'react';
import { Bell, HelpCircle, PanelRightOpen, PanelRightClose } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ title, rightPanelCollapsed, setRightPanelCollapsed, showRightPanelToggle = true }) => {
  return (
    <div className="navbar">
      <div className="navbar-title">{title}</div>
      <div className="navbar-actions">
        {showRightPanelToggle && (
          <button
            className="navbar-icon-button"
            onClick={() => setRightPanelCollapsed(prev => !prev)}
            title={rightPanelCollapsed ? 'Open right panel' : 'Close right panel'}
          >
            {rightPanelCollapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
          </button>
        )}

        <button className="navbar-icon-button" title="Help">
          <HelpCircle size={20} />
        </button>
        <button className="navbar-icon-button" title="Notifications">
          <Bell size={20} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
