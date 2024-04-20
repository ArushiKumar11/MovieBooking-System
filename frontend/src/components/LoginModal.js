import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user'))); // Initialize from local storage directly

  const navigate = useNavigate();

  // Sync user state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      closeModal();
       // Redirect after login
    } else {
      localStorage.removeItem('user');
    }
  }, [user, navigate]);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      setUser(response.data); // Set user in state
      closeModal();
    
    } catch (error) {
      console.error('Login error:', error.response || error);
      alert('Failed to login. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setUser(null); // Clear user state which will also remove from local storage via useEffect
  };

  const redirectToRegister = () => {
    navigate('/register');
    closeModal();
  };

  return (
    <>
      <button onClick={user ? handleLogout : openModal} className="bg-red-600 text-white px-2 py-1 text-sm rounded">
        {user ? `Hi, ${user.fullName}` : 'Sign In'}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Sign in to your account
                </Dialog.Title>
                <form onSubmit={handleLogin}>
                  <div className="mt-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <p className="text-sm">
                    New user?{' '}
                    <a onClick={redirectToRegister} className="font-medium text-red-600 hover:text-red-500 cursor-pointer">
                      Register here
                    </a>
                  </p>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default LoginModal;
