import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): string => {
    // Basic format check
    if (!email) return "Email is required";
    
    // Remove any whitespace
    email = email.trim();
    
    // Check for minimum length
    if (email.length < 5) return "Email is too short";
    
    // Check for maximum length
    if (email.length > 254) return "Email is too long";
    
    // Comprehensive email regex
    const emailRegex = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    
    // Additional specific checks
    if (email.includes('..')) return "Email cannot contain consecutive dots";
    if (email.includes('@.')) return "Invalid character after @";
    if (email.includes('.@')) return "Invalid character before @";
    if (email.split('@').length > 2) return "Email cannot contain multiple @ symbols";
    if (email.startsWith('.')) return "Email cannot start with a dot";
    if (email.endsWith('.')) return "Email cannot end with a dot";
    if (/@.*_/.test(email)) return "Domain cannot contain underscore";
    
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate email on change
    if (name === 'email') {
      const emailError = validateEmail(value);
      setErrors(prev => ({
        ...prev,
        email: emailError
      }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors(prev => ({
        ...prev,
        email: emailError
      }));
      toast.error(emailError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://181.214.44.15:8080/authentication/login', {
        ...formData,
        email: formData.email.trim().toLowerCase()
      });
      
      if (response.status === 200) {
        const { access_token, user } = response.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('userInfo', JSON.stringify({
          ...user,
          email: formData.email.trim().toLowerCase()
        }));
        
        toast.success('Login successful!');
        
        // Navigate based on user role
        if (user.role === 'mentor') {
          navigate('/mentor/dashboard');
        } else {
          navigate('/mentee/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !!errors.email}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || !!errors.email
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-medium text-green-600 hover:text-green-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 