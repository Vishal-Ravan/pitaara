import { useContext, useState } from 'react';
import { AuthContext } from 'pages/_app'; // Import AuthContext
import { SocialLogin } from 'components/shared/SocialLogin/SocialLogin';
import router from 'next/router';

export const Login = () => {
  const { setUser } = useContext(AuthContext); // Access AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login Response:', data);

      if (!response.ok) {
        if (data.message === 'User not found') {
          alert('User not found. Please register first.');
          router.push('/registration');
        } else {
          alert(data.message || 'Login failed. Please try again.');
        }
        return;
      }

      // Store user data in localStorage
      const userData = { email,name:data.name, token: data.token };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log(userData,'kkkk')

      alert('Login successful!');
      router.push('/');
    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='login'>
      <div className='wrapper'>
        <div
          className='login-form js-img'
          style={{ backgroundImage: `url('/assets/img/login-form__bg.png')` }}
        >
          <form onSubmit={handleLogin}>
            <h3>log in with</h3>
            <SocialLogin />
            <div className='box-field'>
              <input
                type='text'
                className='form-control'
                placeholder='Enter your email or nickname'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='box-field'>
              <input
                type='password'
                className='form-control'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className='btn' type='submit'>
              log in
            </button>
            <div className='login-form__bottom'>
              <span>
                No account?{' '}
                <a onClick={() => router.push('/registration')}>
                  Register now
                </a>
              </span>
              <a href='#'>Lost your password?</a>
            </div>
          </form>
        </div>
      </div>
      <img
        className='promo-video__decor js-img'
        src='/assets/img/promo-video__decor.jpg'
        alt=''
      />
    </div>
  );
};
