import React from 'react';
import { Moon, Sun } from 'lucide-react';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import './Settings.css';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, settings, updateUser, updateSettings } = useUser();

  const roles = ['Employee', 'Manager', 'HR', 'Operations', 'Admin'];

  return (
    <Layout title="Settings" hideRightPanel>
      <div className="settings-container">
        <div className="settings-content">
          <h1 className="settings-title">Settings</h1>

          {/* Appearance Section */}
          <div className="settings-section">
            <h2 className="section-title">Appearance</h2>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Theme</div>
                  <div className="setting-description text-sm text-muted">
                    Choose between light and dark mode
                  </div>
                </div>
                <div className="theme-toggle">
                  <button
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => theme !== 'light' && toggleTheme()}
                  >
                    <Sun size={18} />
                    <span>Light</span>
                  </button>
                  <button
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => theme !== 'dark' && toggleTheme()}
                  >
                    <Moon size={18} />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="settings-section">
            <h2 className="section-title">Profile</h2>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Name</div>
                </div>
                <input
                  type="text"
                  className="setting-input"
                  value={user.name}
                  onChange={(e) => updateUser({ name: e.target.value })}
                />
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Email</div>
                </div>
                <input
                  type="email"
                  className="setting-input"
                  value={user.email}
                  onChange={(e) => updateUser({ email: e.target.value })}
                />
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Role</div>
                </div>
                <select
                  className="setting-select"
                  value={user.role}
                  onChange={(e) => updateUser({ role: e.target.value })}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Department</div>
                </div>
                <input
                  type="text"
                  className="setting-input"
                  value={user.department}
                  onChange={(e) => updateUser({ department: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Answer Preferences Section */}
          <div className="settings-section">
            <h2 className="section-title">Answer Preferences</h2>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Answer Length</div>
                  <div className="setting-description text-sm text-muted">
                    Control the detail level of responses
                  </div>
                </div>
                <select
                  className="setting-select"
                  value={settings.answerLength}
                  onChange={(e) => updateSettings({ answerLength: e.target.value })}
                >
                  <option value="brief">Brief</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Show Sources</div>
                  <div className="setting-description text-sm text-muted">
                    Display source citations with answers
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.showSources}
                    onChange={(e) => updateSettings({ showSources: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Regenerate Confirmation</div>
                  <div className="setting-description text-sm text-muted">
                    Ask for confirmation before regenerating answers
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.regenerateConfirmation}
                    onChange={(e) => updateSettings({ regenerateConfirmation: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-section">
            <h2 className="section-title">Notifications</h2>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Enable Notifications</div>
                  <div className="setting-description text-sm text-muted">
                    Receive notifications about system updates
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSettings({ notifications: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Document Processing Alerts</div>
                  <div className="setting-description text-sm text-muted">
                    Get notified when documents finish processing
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.documentProcessingAlerts}
                    onChange={(e) => updateSettings({ documentProcessingAlerts: e.target.checked })}
                    disabled={!settings.notifications}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">System Alerts</div>
                  <div className="setting-description text-sm text-muted">
                    Important system notifications and updates
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.systemAlerts}
                    onChange={(e) => updateSettings({ systemAlerts: e.target.checked })}
                    disabled={!settings.notifications}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Accessibility Section */}
          <div className="settings-section">
            <h2 className="section-title">Accessibility / Comfort</h2>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Font Size</div>
                  <div className="setting-description text-sm text-muted">
                    Adjust text size for better readability
                  </div>
                </div>
                <select
                  className="setting-select"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: e.target.value })}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">Comfortable Spacing</div>
                  <div className="setting-description text-sm text-muted">
                    Increase spacing between elements
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.comfortableSpacing}
                    onChange={(e) => updateSettings({ comfortableSpacing: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-label">High Contrast Mode</div>
                  <div className="setting-description text-sm text-muted">
                    Enhance contrast for better visibility
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
