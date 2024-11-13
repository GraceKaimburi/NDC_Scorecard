'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country_name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, country_name, password, confirmPassword } = formData;

    // Front-end validation
    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      setError('All fields marked * are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    try {
      const response = await fetch('https://ndcbackend.agnesafrica.org/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          country_name,
          password,
        }),
      });

      if (response.ok) {
        setSuccess('Registration successful!');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          country_name: '',
          password: '',
          confirmPassword: '',
        });
        setTimeout(() => router.push('/login'), 1500);
      } else {
        const data = await response.json();
        if (data.message === 'user with this email already exists.') {
          setError('This email is already registered. Please use a different email or log in.');
        } else {
          setError(data.message || 'An error occurred during registration.');
        }
      }
    } catch (err) {
      setError('Failed to register. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-100 px-4 py-16 ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700">Registration Form</h1>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-gray-600 mb-1">First Name:</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-gray-600 mb-1">Last Name:</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-600 mb-1">Email: *</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="country_name" className="block text-gray-600 mb-1">Country Name:</label>
            <input
              type="text"
              name="country_name"
              id="country_name"
              value={formData.country_name}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600 mb-1">Password: *</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-600 mb-1">Confirm Password: *</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
