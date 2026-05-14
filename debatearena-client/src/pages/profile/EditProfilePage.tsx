import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './EditProfilePage.module.css';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      navigate('/profile');
    } catch (err) {
      // Error handled by useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Edit Profile</h1>
      </header>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>MA</div>
            <div className={styles.avatarActions}>
              <button type="button" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '13px' }}>
                <Camera size={16} />
                Change Picture
              </button>
              <button type="button" className="btn-ghost" style={{ padding: '6px 12px', fontSize: '13px' }}>
                Remove
              </button>
            </div>
          </div>

          {/* Username */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Bio */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Bio</label>
            <textarea 
              className={styles.textarea} 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell the arena who you are..."
              disabled={isSubmitting}
              maxLength={300}
            />
          </div>

          <div className={styles.actions}>
            <button 
              type="button" 
              className="btn-ghost" 
              onClick={() => navigate('/profile')}
              disabled={isSubmitting}
            >
              <X size={18} style={{ marginRight: '8px' }} />
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn-primary ${styles.saveBtn}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} style={{ marginRight: '8px' }} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
