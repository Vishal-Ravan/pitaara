import { useRouter } from 'next/router';
import { useState } from 'react';

export const ForgotPassword = () => {
    const router = useRouter();
  const [step, setStep] = useState(1); // Step 1: Send OTP | Step 2: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || 'Failed to send OTP.');
        return;
      }

      showAlert('OTP sent to your email.');
      setStep(2);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Something went wrong.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || 'Failed to reset password.');
        return;
      }

      showAlert('Password reset successful!');
      setTimeout(() => {
        router.push('/login'); // ✅ Redirect after 2 seconds
      }, 2000);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setStep(1);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Something went wrong.');
    }
  };

  return (
    <div className='login'>
      <div className='wrapper'>
        <div
          className='login-form js-img'
          style={{ backgroundImage: `url('/assets/img/login-form__bg.png')` }}
        >
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <h3>Forgot Password</h3>
              <div className='box-field'>
                <input
                  type='email'
                  className='form-control'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className='btn' type='submit'>
                Send OTP
              </button>
              <div className='login-form__bottom'>
              <span>
                No account?{' '}
                <a onClick={() => router.push('/registration')}>
                  Register now
                </a>
              </span>
              <span>
              Already have an account?  
              <a href='/login'> Log in</a>

              </span>
            </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <h3>Reset Password</h3>
              <div className='box-field'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter OTP'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className='box-field'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='New Password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button className='btn' type='submit'>
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>

      {alertMessage && (
        <div
          style={{
            background: '#000',
            color: '#fff',
            padding: '15px',
            position: 'fixed',
            right: '0',
            zIndex: 999,
            top: '70px',
            borderRadius: '5px',
          }}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
};
