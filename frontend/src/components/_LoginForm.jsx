import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [npi, setNPI] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, npi, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        if (data.message.includes('successful')) {
          window.location.href = '/dashboard';
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <div className="mb-6">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          type="text"
          placeholder="NPI"
          value={npi}
          onChange={(e) => setNPI(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full px-3 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      <p className="mt-4 text-center">
        Don't have an account? <a href="/register" className="text-blue-500">Register here</a>
      </p>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </form>
  );
};

export default LoginForm;