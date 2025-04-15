import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SocialLogin } from 'components/shared/SocialLogin/SocialLogin';
import { useRouter } from 'next/router';

export const Registration = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required('First name is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone number must be numeric')
      .min(10, 'Phone must be at least 10 digits')
      .required('Phone is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  // Formik for Form Handling
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      role:'user',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage('Registration successful! Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setErrorMessage(data.message || 'Registration failed');
        }
      } catch (error) {
        setErrorMessage('Something went wrong. Please try again.');
      }

      setLoading(false);
    },
  });

  return (
    <>
      {/* <!-- BEGIN REGISTRATION --> */}
      <div className='login registration'>
        <div className='wrapper'>
          <div
            className='login-form js-img'
            style={{
              backgroundImage: `url('/assets/img/registration-form__bg.png')`,
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <h3>Sign Up</h3>
              {/* <SocialLogin />   */}

              {successMessage && (
        <div style={{
          background: '#000', 
          color: '#fff', 
          padding: '15px', 
          textAlign: 'center', 
          position:'fixed',
          right:'0px',
          zIndex:999,
          top:"70px",
          borderRadius: '5px'
        }}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div style={{
          background: '#000', 
          color: '#fff', 
          padding: '15px', 
          textAlign: 'center', 
          position:'fixed',
          right:'0px',
          zIndex:999,
          top:"70px",
          borderRadius: '5px'
        }}>
          {errorMessage}
        </div>
      )}
      
              {/* Name Fields */}
                <div className='box-field'>
                  <input
                    type='text'
                    name='name'
                    className='form-control'
                    placeholder='Enter your name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className='error-text'>{formik.errors.name}</p>
                  )}
                </div>
                

              {/* Contact Fields */}
              <div className='box-field__row'>
                <div className='box-field'>
                  <input
                    type='tel'
                    name='phone'
                    className='form-control'
                    placeholder='Enter your phone'
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className='error-text'>{formik.errors.phone}</p>
                  )}
                </div>
                <div className='box-field'>
                  <input
                    type='email'
                    name='email'
                    className='form-control'
                    placeholder='Enter your email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className='error-text'>{formik.errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className='box-field__row'>
                <span>Password</span>
                <div className='box-field'>
                  <input
                    type='password'
                    name='password'
                    className='form-control'
                    placeholder='Enter your password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className='error-text'>{formik.errors.password}</p>
                  )}
                </div>
                <div className='box-field'>
                  <input
                    type='password'
                    name='confirmPassword'
                    className='form-control'
                    placeholder='Confirm password'
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className='error-text'>{formik.errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <label className='checkbox-box checkbox-box__sm'>
                <input type='checkbox' />
                <span className='checkmark'></span>
                Remember me
              </label>

              {/* Submit Button */}
              <button className='btn' type='submit' disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>

              {/* Redirect to Login */}
              <div className='login-form__bottom'>
                <span>
                  Already have an account?{' '}
                  <a onClick={() => router.push('/login')}>Log in</a>
                </span>
              </div>
            </form>
          </div>
        </div>
      
      </div>
      {/* <!-- REGISTRATION EOF   --> */}
    </>
  );
};
