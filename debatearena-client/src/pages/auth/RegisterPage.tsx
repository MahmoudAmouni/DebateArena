import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RegisterPage.module.css';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  
  // Username availability mock state
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();

  // Mock username availability check when user stops typing
  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    
    setCheckingUsername(true);
    const timer = setTimeout(() => {
      // Mock logic: 'admin' is taken, everything else is available
      if (formData.username.toLowerCase() === 'admin') {
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('available');
      }
      setCheckingUsername(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (usernameStatus === 'taken') {
      newErrors.username = 'This username is already taken';
    }

    if (!ageConfirmed) {
      newErrors.age = 'You must confirm you are at least 16 years old';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    try {
      await register(formData);
    } catch (err) {
      // Error handled by useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className={styles.heading}>Create your account</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Username */}
        <div className={styles.inputGroup}>
          <div className={styles.label}>
            <label>Username</label>
            {checkingUsername ? (
              <span className={styles.indicator}><Loader2 size={10} className="animate-spin" /> Checking...</span>
            ) : usernameStatus === 'available' ? (
              <span className={`${styles.indicator} ${styles.indicatorSuccess}`}><div className={styles.indicatorDot} /> Available</span>
            ) : usernameStatus === 'taken' ? (
              <span className={`${styles.indicator} ${styles.indicatorError}`}><div className={styles.indicatorDot} /> Taken</span>
            ) : null}
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              placeholder="e.g. Socrates"
              required
            />
          </div>
          <AnimatePresence>
            {errors.username && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }} 
                className={styles.errorText}
              >
                {errors.username}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email Address</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        
        {/* Password */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }} 
                className={styles.errorText}
              >
                {errors.password}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Confirm Password</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }} 
                className={styles.errorText}
              >
                {errors.confirmPassword}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Age Confirmation */}
        <div className={styles.ageCallout}>
          <div className={styles.checkboxWrapper}>
            <input 
              type="checkbox" 
              id="age-confirm"
              className={styles.checkbox}
              checked={ageConfirmed}
              onChange={(e) => {
                setAgeConfirmed(e.target.checked);
                if (errors.age) setErrors({ ...errors, age: '' });
              }}
            />
          </div>
          <div className={styles.ageContent}>
            <label htmlFor="age-confirm" className={styles.ageText}>
              I confirm that I am at least 16 years of age.
            </label>
            <AnimatePresence>
              {errors.age && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -5 }} 
                  className={styles.errorText}
                >
                  {errors.age}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || checkingUsername || usernameStatus === 'taken'}
          className={`btn-primary ${styles.submitBtn}`}
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p className={styles.loginText}>
        Already have an account? <Link to="/login" className={styles.loginLink}>Sign In</Link>
      </p>
    </>
  );
};

export default RegisterPage;
