import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthPage.css';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

type AuthStep = 'choice' | 'login' | 'mobile-entry' | 'otp-verification' | 'registration' | 'signup-success';

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [authStep, setAuthStep] = useState<AuthStep>('choice');
  const [mobilenumber, setMobileno] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const { setUserFromBackend } = useAuth();

  // Backend API base URL
  const API_BASE = 'http://localhost:5000/api/auth';

  // Resend timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1: Handle mobile number submission
  // Step 1: Handle mobile number submission (request OTP)
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mobilenumber.length !== 11) {
      setError('Mobile number must be exactly 11 digits.');
      return;
    }

    if (!mobilenumber.startsWith('09')) {
      setError('Mobile number must start with "09".');
      return;
    }

    setLoading(true);
    try {
      // Call backend to trigger OTP (using /send-otp)
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNo: mobilenumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setAuthStep('otp-verification');
      setResendTimer(60);
      setError('');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP submission
  // Step 2: Handle OTP submission (verify OTP)
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Call backend to verify OTP
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNo: mobilenumber, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');
      setAuthStep('registration');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle registration completion
  // Step 3: Handle registration completion (create account)
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Full name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Call backend to register
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, mobileNo: mobilenumber, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setAuthStep('signup-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numbersOnly;
      setOtp(newOtp);

      // Auto-focus next input
      if (numbersOnly && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  // Resend OTP handler
  // Resend OTP handler (calls backend again)
  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      // Call backend to resend OTP (using /send-otp)
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNo: mobilenumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Choice Screen - Sign In or Sign Up */}
          {authStep === 'choice' && (
            <>
              <div className="auth-header">
                <img src="/ilogo.png" alt="iKomyutPH" className="auth-logo" />
                <h1>Welcome!</h1>
                <p>Choose what you want to do</p>
              </div>

              <div className="choice-buttons">
                <button
                  type="button"
                  className="btn btn--primary choice-btn"
                  onClick={() => {
                    setAuthStep('login');
                    setError('');
                    setMobileno('');
                    setPassword('');
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn btn--secondary choice-btn"
                  onClick={() => {
                    setAuthStep('mobile-entry');
                    setError('');
                    setMobileno('');
                    setPassword('');
                    setName('');
                  }}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}

          {/* Login Screen */}
          {authStep === 'login' && (
            <>
              <div className="auth-header">
                <img src="/ilogo.png" alt="iKomyutPH" className="auth-logo" />
                <h1>Sign In</h1>
                <p>Access your account</p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError('');

                  if (mobilenumber.length !== 11) {
                    setError('Mobile number must be exactly 11 digits.');
                    return;
                  }

                  if (!mobilenumber.startsWith('09')) {
                    setError('Mobile number must start with "09".');
                    return;
                  }

                  if (!password) {
                    setError('Password is required');
                    return;
                  }

                  setLoading(true);
                  try {
                    const res = await fetch(`${API_BASE}/login`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ mobileNo: mobilenumber, password }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Login failed');
                    // Save user to auth context
                    setUserFromBackend({
                      id: data.user.id,
                      mobileNo: data.user.mobileNo,
                      username: data.user.username,
                      token: data.token,
                    });
                    onAuthSuccess();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Login failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="auth-form"
              >
                <div className="form-group">
                  <label htmlFor="mobile-login">Mobile Number</label>
                  <input
                    id="mobile-login"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={mobilenumber}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/\D/g, '');
                      if (numbersOnly.length <= 11) {
                        setMobileno(numbersOnly);
                      }
                    }}
                    placeholder="09XXXXXXXXX"
                    disabled={loading}
                  />
                  {mobilenumber && !mobilenumber.startsWith('09') && (
                    <div className="error-message">Mobile number must start with "09"</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password-login">Password</label>
                  <input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Sign In'}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => {
                      setAuthStep('mobile-entry');
                      setError('');
                      setMobileno('');
                      setPassword('');
                      setName('');
                    }}
                  >
                    Sign Up
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                      setAuthStep('choice');
                      setError('');
                    }}
                  >
                    ← Back
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Mobile Number Entry Screen */}
          {authStep === 'mobile-entry' && (
            <>
              <div className="auth-header">
                <img src="/ilogo.png" alt="iKomyutPH" className="auth-logo" />
                <h1>Hello!</h1>
                <p>Create Your Account with Your Mobile Number</p>
              </div>

              <form onSubmit={handleMobileSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="mobile-signup">Mobile Number</label>
                  <div className="input-with-icon">
                    <span className="phone-icon">📞</span>
                    <input
                      id="mobile-signup"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={mobilenumber}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/\D/g, '');
                        if (numbersOnly.length <= 11) {
                          setMobileno(numbersOnly);
                        }
                      }}
                      placeholder="Mobile Number"
                      disabled={loading}
                    />
                  </div>
                  {mobilenumber && !mobilenumber.startsWith('09') && (
                    <div className="error-message">Mobile number must start with "09"</div>
                  )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Submit'}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => {
                      setAuthStep('login');
                      setError('');
                      setMobileno('');
                      setPassword('');
                      setName('');
                    }}
                  >
                    Sign In
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                      setAuthStep('choice');
                      setError('');
                    }}
                  >
                    ← Back
                  </button>
                </p>
              </div>
            </>
          )}

          {/* OTP Verification Screen */}
          {authStep === 'otp-verification' && (
            <>
              <div className="auth-header">
                <h1>Verify Your Mobile Number</h1>
                <p>Enter the 6-digit verification code we just sent to your mobile number to continue your signup.</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="auth-form">
                <div className="otp-input-group">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="otp-input"
                      disabled={loading}
                    />
                  ))}
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Didn't you receive any code?{' '}
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                  >
                    {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                      setAuthStep('mobile-entry');
                      setError('');
                      setOtp(['', '', '', '', '', '']);
                    }}
                  >
                    ← Back to Sign up
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Registration Details Screen */}
          {authStep === 'registration' && (
            <>
              <div className="auth-header">
                <img src="/ilogo.png" alt="iKomyutPH" className="auth-logo" />
                <h1>Complete Your Registration</h1>
                <p>Fill in your details to finish creating your account</p>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="name">Username</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="@gmail.com"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobile-confirm">Mobile Number</label>
                  <input
                    id="mobile-confirm"
                    type="tel"
                    value={mobilenumber}
                    disabled
                    className="input-disabled"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password-create">Password</label>
                  <input
                    id="password-create"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  {password && password.length < 6 && (
                    <div className="error-message">Password must be at least 6 characters</div>
                  )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                      setAuthStep('otp-verification');
                      setError('');
                    }}
                  >
                    ← Back to Verification
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Signup Success Screen */}
          {authStep === 'signup-success' && (
            <>
              <div className="auth-header">
                <div className="success-icon">✓</div>
                <h1>Account Created!</h1>
                <p>Your account has been successfully created</p>
              </div>

              <div className="success-message">
                <p>Welcome to iKomyutPH! Please sign in to access your account.</p>
              </div>

              <button
                type="button"
                className="btn btn--primary auth-submit"
                onClick={() => {
                  setAuthStep('login');
                  setError('');
                  setMobileno('');
                  setPassword('');
                  setName('');
                  setOtp(['', '', '', '', '', '']);
                }}
              >
                Go to Sign In
              </button>

              <div className="auth-footer">
                <p>
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                      setAuthStep('choice');
                      setError('');
                    }}
                  >
                    ← Back to Home
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
