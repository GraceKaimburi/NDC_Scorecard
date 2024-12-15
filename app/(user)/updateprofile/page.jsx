'use client';
import React, { useState, useEffect } from 'react';
import { getAccessToken } from '@/utils/access-token';
import Loading from '@/components/reusables/Loading';


const UpdateProfileForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country_name: '',
    user_profile: {
      middle_name: '',
      profession: '',
      language: []
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const languages = ['English', 'French', 'Portuguese']; 
  const accessToken = getAccessToken();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://ndcbackend.agnesafrica.org/users/me/', {
        headers: {
          Authorization: `JWT ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const userData = await response.json();
      setFormData(userData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      user_profile: {
        ...prev.user_profile,
        language: [value] 
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('https://ndcbackend.agnesafrica.org/users/me/', {
        method: 'PATCH',
        headers: {
          Authorization: `JWT ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              maxLength={255}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              maxLength={255}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            maxLength={255}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Country</label>
          <input
            type="text"
            name="country_name"
            value={formData.country_name}
            onChange={handleInputChange}
            maxLength={255}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Middle Name</label>
          <input
            type="text"
            name="user_profile.middle_name"
            value={formData.user_profile.middle_name}
            onChange={handleInputChange}
            maxLength={255}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Profession</label>
          <input
            type="text"
            name="user_profile.profession"
            value={formData.user_profile.profession}
            onChange={handleInputChange}
            maxLength={255}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Language</label>
          <select
            value={formData.user_profile.language[0] || ''}
            onChange={handleLanguageChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Profile updated successfully!
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;