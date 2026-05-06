import React from 'react';
import { User, Mail, Briefcase, Building2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import './Profile.css';

const Profile = () => {
  const { user } = useUser();

  return (
    <Layout title="Profile" hideRightPanel>
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <User size={48} />
              )}
            </div>
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-role-text text-muted">{user.role}</p>
          </div>

          <div className="profile-card">
            <h2 className="card-title">Profile Details</h2>
            
            <div className="profile-details">
              <div className="detail-item">
                <div className="detail-icon">
                  <User size={20} />
                </div>
                <div className="detail-content">
                  <div className="detail-label text-sm text-muted">Name</div>
                  <div className="detail-value">{user.name}</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Mail size={20} />
                </div>
                <div className="detail-content">
                  <div className="detail-label text-sm text-muted">Email</div>
                  <div className="detail-value">{user.email}</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Briefcase size={20} />
                </div>
                <div className="detail-content">
                  <div className="detail-label text-sm text-muted">Role</div>
                  <div className="detail-value">{user.role}</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Building2 size={20} />
                </div>
                <div className="detail-content">
                  <div className="detail-label text-sm text-muted">Department</div>
                  <div className="detail-value">{user.department}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
