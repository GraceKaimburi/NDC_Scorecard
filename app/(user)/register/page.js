'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const comprehensiveCountries = [
  // UN Member States (193)
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", 
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", 
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", 
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", 
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", 
  "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", 
  "Vietnam", "Yemen", "Zambia", "Zimbabwe",

  // Non-UN Member Observer States
  "Vatican City", "Palestine",

  // Dependent Territories and Special Administrative Regions
  "American Samoa", "Anguilla", "Aruba", "Bermuda", "British Virgin Islands", "Cayman Islands", "Cook Islands", "Curaçao", "Falkland Islands", 
  "French Polynesia", "Greenland", "Guam", "Hong Kong", "Isle of Man", "Jersey", "Macau", "Montserrat", "New Caledonia", "Niue", 
  "Northern Mariana Islands", "Puerto Rico", "Saint Helena", "Saint Pierre and Miquelon", "Tokelau", "Turks and Caicos Islands", 
  "U.S. Virgin Islands", "Wallis and Futuna",

  // Disputed or Partially Recognized States
  "Abkhazia", "Artsakh", "Cook Islands", "Northern Cyprus", "South Ossetia", "Taiwan", "Transnistria", "Western Sahara",

  // Additional Territories
  "Christmas Island", "Cocos (Keeling) Islands", "French Guiana", "Guadeloupe", "Martinique", "Mayotte", "Réunion", "Saint Martin", 
  "Sint Maarten"
];

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country_name: '',
    affiliation: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, country_name, affiliation, password, confirmPassword } = formData;

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
    setIsLoading(true);

    try {
      // Send registration request
      const response = await fetch('https://ndcbackend.agnesafrica.org/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          country_name,
          affiliation,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration initiated! Please check your email for OTP.');
        setShowOtpInput(true);
      } else if (response.status === 400) {
        // Check for "account already exists" error
        if (data.detail && data.detail.toLowerCase().includes('already exists')) {
          setError('An account with this email already exists. Please log in.');
        } else {
          setError(data.detail || 'Registration failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP sent to your email.');
      return;
    }

    const verificationData = {
      email: formData.email,
      otp: otp,
    };

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://ndcbackend.agnesafrica.org/auth/verify_otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration Successful.');
        router.push('/login');
      } else {
        setError(data.detail || 'Failed to verify OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-100 px-4 py-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700">
          {showOtpInput ? 'Verify Email' : 'Registration Form'}
        </h1>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {!showOtpInput ? (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="first_name" className="block text-gray-600 mb-1">First Name: *</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-gray-600 mb-1">Last Name: *</label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
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
              <label htmlFor="country_name" className="block text-gray-600 mb-1">
                Country Name: *
              </label>
              <select
                name="country_name"
                id="country_name"
                value={formData.country_name}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a Country</option>
                {comprehensiveCountries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="affiliation" className="block text-gray-600 mb-1">Affiliation: *</label>
              <input
                type="text"
                name="affiliation"
                id="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                required
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
              disabled={isLoading}
              className={`w-full ${
                isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
              } text-white p-2 rounded-md transition`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-600 mb-1">Email:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                readOnly
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="otp" className="block text-gray-600 mb-1">Enter OTP sent to your email:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange} 
                placeholder="Enter OTP"
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
              } text-white p-2 rounded-md transition`}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
