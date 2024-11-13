'use client'
import React, { useState } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { AiOutlineInfoCircle, AiOutlineExclamationCircle } from 'react-icons/ai';

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    country_name: '',
    // Additional fields for UI purposes
    otp: '',
    organization: '',
    orgType: '',
    language: 'english',
    dataConsent: false
  });

  const steps = [
    {
      title: "Account Creation",
      description: "Set up your NDC platform account"
    },
    {
      title: "Profile Customization",
      description: "Customize your experience"
    },
    {
      title: "Data Privacy",
      description: "Review our privacy commitments"
    }
  ];

  const handleSendOTP = () => {
    setOtpSent(true);
  };


  const handleRegistration = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Prepare the payload according to API schema
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        country_name: formData.country_name
      };

      const response = await fetch('https://ndcbackend.agnesafrica.org  /auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Handle successful registration
      // The API returns id, user_role, refresh_token, and access_token
      // You might want to store these in your auth context or state management
      console.log('Registration successful:', data);
      
      // Here you could redirect to login or dashboard
      // router.push('/dashboard');

    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const renderAccountCreation = () => (
    <div className="space-y-8">
      {/* Account Setup Steps */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Account Setup Steps</h3>
        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={e => setFormData({...formData, first_name: e.target.value})}
              maxLength={255}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={e => setFormData({...formData, last_name: e.target.value})}
              maxLength={255}
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your country"
              value={formData.country_name}
              onChange={e => setFormData({...formData, country_name: e.target.value})}
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <div className="flex gap-2">
              <input 
                type="email" 
                className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your corporate email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                maxLength={255}
              />
              <button 
                onClick={handleSendOTP}
                disabled={otpSent || !formData.email}
                className={`px-4 py-2 rounded-md text-white ${
                  otpSent || !formData.email 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Send OTP
              </button>
            </div>
          </div>
          
          {otpSent && (
            <div>
              <label className="block text-sm font-medium mb-1">Email Verification Code</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP sent to your email"
                value={formData.otp}
                onChange={e => setFormData({...formData, otp: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-1">Please check your email for the verification code</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              minLength={6}
              maxLength={69}
            />
          </div>
        </div>
      </section>

      {/* Information Required */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Information Required</h3>
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-gray-600">• Corporate email address</p>
          <p className="text-sm text-gray-600">• Secure password (min. 8 characters)</p>
          <p className="text-sm text-gray-600">• Email verification code</p>
          <p className="text-sm text-gray-600">• Organization details</p>
        </div>
      </section>

      {/* Common Questions */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Common Questions</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Who can create an account?</h4>
            <p className="text-sm text-gray-600">Representatives from government agencies, environmental organizations, and authorized institutions working on climate action.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">How long does verification take?</h4>
            <p className="text-sm text-gray-600">Email verification is instant. Organization verification may take 1-2 business days.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What if I don&apos;t receive the OTP?</h4>
            <p className="text-sm text-gray-600">You can request a new code after 60 seconds. Please check your spam folder.</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderProfileCustomization = () => (
    <div className="space-y-8">
      {/* Tailor Your Experience */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Tailor Your Experience</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600">Customize your NDC platform experience to better suit your organization&apo;s needs and preferences.</p>
        </div>
      </section>

      {/* Language and Preferences */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Language and Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primary Language</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.language}
              onChange={e => setFormData({...formData, language: e.target.value})}
            >
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="arabic">Arabic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time Zone</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>UTC (Coordinated Universal Time)</option>
              <option>GMT (Greenwich Mean Time)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Organization Type */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Organization Type</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Organization Category</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.orgType}
              onChange={e => setFormData({...formData, orgType: e.target.value})}
            >
              <option value="">Select organization type</option>
              <option value="government">Government Agency</option>
              <option value="ngo">Environmental NGO</option>
              <option value="research">Research Institution</option>
              <option value="international">International Organization</option>
              <option value="private">Private Sector Climate Initiative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Organization Size</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>1-50 employees</option>
              <option>51-200 employees</option>
              <option>201-1000 employees</option>
              <option>1000+ employees</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );

  const renderDataPrivacy = () => (
    <div className="space-y-8">
      {/* Our Commitment to Privacy */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Our Commitment to Privacy</h3>
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <p className="text-gray-600">Your privacy and data security are our top priorities. We implement robust measures to protect your information and maintain transparency in our data handling practices.</p>
          <ul className="text-sm text-gray-600 space-y-2 mt-2">
            <li>• Secure data storage and transmission</li>
            <li>• Regular security audits and updates</li>
            <li>• Transparent data usage policies</li>
            <li>• User control over data sharing</li>
          </ul>
        </div>
      </section>

      {/* Encryption Standards */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Encryption Standards</h3>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Advanced Security Measures</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• AES-256 encryption for data at rest</li>
            <li>• TLS 1.3 for data in transit</li>
            <li>• Multi-factor authentication</li>
            <li>• Regular security assessments</li>
          </ul>
        </div>
      </section>

      {/* Compliance Information */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Compliance Information</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Regulatory Compliance</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• GDPR compliance for EU data protection</li>
              <li>• ISO 27001 certification</li>
              <li>• Regular compliance audits</li>
            </ul>
          </div>
          
          <div className="mt-6">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={formData.dataConsent}
                onChange={e => setFormData({...formData, dataConsent: e.target.checked})}
              />
              <span className="text-sm text-gray-600">
                I understand and agree to the NDC Platform&apos;s data privacy terms, conditions, and practices
              </span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate required fields for first step
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.country_name) {
        setError('Please fill in all required fields');
        return;
      }
      if (!formData.otp) {
        setError('Please verify your email first');
        return;
      }
    }
    
    if (currentStep === 3) {
      // Handle final registration
      handleRegistration();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps - Redesigned for better responsiveness */}
        <div className="mb-8 overflow-hidden">
          {/* Desktop Version - Hidden on mobile */}
          <div className="hidden sm:flex justify-between">
            {steps.map((step, index) => (
              <div key={`desktop-${step.title}`} className="flex-1">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                    currentStep > index + 1 ? 'bg-green-500' :
                    currentStep === index + 1 ? 'bg-blue-500' : 'bg-gray-300'
                  } text-white`}>
                    {currentStep > index + 1 ? (
                      <BsCheckCircleFill className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Version - Shown only on mobile */}
          <div className="sm:hidden">
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => (
                <div key={`mobile-${step.title}`} className="flex flex-col items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    currentStep > index + 1 ? 'bg-green-500' :
                    currentStep === index + 1 ? 'bg-blue-500' : 'bg-gray-300'
                  } text-white`}>
                    {currentStep > index + 1 ? (
                      <BsCheckCircleFill className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-0.5 bg-gray-200 -mx-2 hidden"></div>
                  )}
                </div>
              ))}
            </div>
            {/* Current step title for mobile */}
            <div className="text-center mt-2">
              <p className="text-sm font-medium">{steps[currentStep - 1].title}</p>
              <p className="text-xs text-gray-500">{steps[currentStep - 1].description}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">{steps[currentStep - 1].title}</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {currentStep === 1 && renderAccountCreation()}
            {currentStep === 2 && renderProfileCustomization()}
            {currentStep === 3 && renderDataPrivacy()}

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className={`px-4 py-2 rounded-md border border-gray-300 ${
                  currentStep === 1 || isLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={isLoading || (currentStep === 3 && !formData.dataConsent)}
                className={`px-4 py-2 rounded-md text-white ${
                  isLoading || (currentStep === 3 && !formData.dataConsent)
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Processing...' : currentStep === 3 ? 'Complete Registration' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {currentStep === 1 && otpSent && (
          <div className="mt-4 p-4 bg-green-50 rounded-md flex items-start space-x-2">
            <BsCheckCircleFill className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-green-800">OTP Sent Successfully</h3>
              <p className="text-sm text-green-700">Please check your email for the verification code.</p>
            </div>
          </div>
        )}

        {currentStep === 3 && !formData.dataConsent && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-md flex items-start space-x-2">
            <AiOutlineExclamationCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Consent Required</h3>
              <p className="text-sm text-yellow-700">Please review and accept the data privacy terms to complete registration.</p>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-1 text-sm text-gray-500">
            <AiOutlineInfoCircle className="w-4 h-4" />
            <span>Need help? Contact our support team at support@ndcplatform.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;