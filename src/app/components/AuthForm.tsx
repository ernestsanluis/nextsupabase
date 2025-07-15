'use client';

import { useState } from 'react';
import { supabase } from '@/supabase-client';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [message, setMessage] = useState('');

  const handleAuth = async () => {
    setMessage('');
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(isSignUp ? 'Check your email to confirm sign up!' : 'Signed in successfully');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-gray-900 p-6 rounded-md shadow text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-2 p-2 rounded bg-gray-700 placeholder-gray-400"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-gray-700 placeholder-gray-400"
      />
      <button
        onClick={handleAuth}
        className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500"
      >
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>

      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setMessage('');
        }}
        className="w-full mt-2 text-sm text-gray-300 underline"
      >
        {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
      </button>

      {message && <p className="mt-4 text-center text-sm text-green-400">{message}</p>}
    </div>
  );
}
