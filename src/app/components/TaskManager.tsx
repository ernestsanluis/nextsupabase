'use client';

import { supabase } from '@/supabase-client';
import { Session } from '@supabase/supabase-js';
import { useState, useEffect, FormEvent } from 'react';

type Task = {
  id: string;
  title: string;
  description: string;
};

export default function TaskManager({ session }: { session: Session }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('email', session.user.email)
      .order('id', { ascending: true });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setTasks(data || []);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!newTask.title.trim()) {
      setMessage('Title is required.');
      return;
    }
  
    setLoading(true);
  
    if (editingId) {
      const { error } = await supabase
        .from('tasks')
        .update({ ...newTask })
        .eq('id', editingId);
  
      if (error) {
        setMessage('Update failed.');
        console.error(error.message);
      } else {
        setMessage('Task updated!');
        setEditingId(null);
      }
    } else {
      const { error } = await supabase.from('tasks').insert([
        {
          ...newTask,
          email: session.user.email, // ✅ Only use email
        },
      ]);
  
      if (error) {
        setMessage('Insert failed.');
        console.error(error.message);
      } else {
        setMessage('Task added!');
      }
    }
  
    setNewTask({ title: '', description: '' });
    await fetchTasks();
    setLoading(false);
  };



  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Delete error:', error.message);
    } else {
      await fetchTasks();
    }
  };

  const handleEdit = (task: Task) => {
    setNewTask({ title: task.title, description: task.description });
    setEditingId(task.id);
    setMessage('Editing task...');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect (() => {
    const channel = supabase.channel("tasks-channel")
    channel.on(
        "postgres_changes",
        { event : "INSERT", schema: "public", table: "tasks"},
        (payload) => {
        const newTask = payload.new as Task;
        setTasks((prev) => [...prev, newTask]);
        }
    )
    .subscribe((status) => {
        console.log("Subscription: ", status);
    }
    );
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 px-4 py-2 rounded hover:bg-red-500 text-sm"
      >
        Logout
      </button>

      <h1 className="text-2xl font-bold mb-4 text-center">Task Manager</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full mb-2 p-2 rounded bg-gray-700 placeholder-gray-400"
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full mb-2 p-2 rounded bg-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
        >
          {editingId ? 'Update Task' : loading ? 'Saving...' : 'Add Task'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-center text-green-400">{message}</p>
      )}

      <div className="mt-6 space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="bg-gray-800 p-4 rounded-md border border-gray-700">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-300">{task.description}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-4">No tasks yet.</p>
        )}
      </div>
    </div>
  );
}
