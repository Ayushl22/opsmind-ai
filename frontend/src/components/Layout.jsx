import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import RightPanel from './RightPanel';
import './Layout.css';

const Layout = ({ title, children, rightPanelTitle, rightPanelContent, hideRightPanel = false }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="layout-main">
        <Navbar
          title={title}
          rightPanelCollapsed={rightPanelCollapsed}
          setRightPanelCollapsed={setRightPanelCollapsed}
          showRightPanelToggle={!hideRightPanel}
        />
        
        <div className="layout-content-wrapper">
          <div className="layout-content">
            {children}
          </div>
          
          {!hideRightPanel && (
            <RightPanel 
              collapsed={rightPanelCollapsed}
              title={rightPanelTitle || 'Workspace'}
            >
              {rightPanelContent}
            </RightPanel>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
