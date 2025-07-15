'use client';

import TaskManager from './components/TaskManager';
import AuthForm from './components/AuthForm';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase-client';

export default function HomePage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      {session ? <TaskManager session={session} /> : <AuthForm />}
    </main>
  );
}
