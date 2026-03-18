import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from './types';

const API_URL = "https://task-api-javq5m0lt-noorulain45s-projects.vercel.app/api/tasks";

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Jost:wght@300;400;500;600&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// ── Full Blue palette ─────────────────────────────────────────────
const C = {
  pageBg:      '#dde8f8',        // soft blue page
  cardBg:      '#ffffff',
  accent:      '#1a56db',        // strong royal blue
  accentHover: '#1340b0',
  accentLight: '#dbeafe',        // pale blue – stat bg
  accentMid:   '#3b82f6',        // mid blue – stat numbers
  border:      '#93c5fd',        // light blue border
  borderDash:  '#60a5fa',
  textMain:    '#1e3a5f',        // dark navy text
  textMuted:   '#6b93c4',
  taskBg:      '#eff6ff',
  errorBg:     '#dbeafe',
  errorText:   '#1a56db',
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, #dde8f8 0%, #c7d9f5 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Jost', sans-serif",
    padding: '16px',
  },
  card: {
    background: C.cardBg,
    borderRadius: '20px',
    padding: '24px 28px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 8px 36px rgba(26,86,219,0.13)',
  },
  headerWrapper: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  title: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: '2.4rem',
    color: C.accent,
    margin: 0,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '0.63rem',
    letterSpacing: '0.22em',
    color: C.textMuted,
    marginTop: '4px',
    textTransform: 'uppercase' as const,
    fontWeight: 500,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginBottom: '14px',
  },
  statBox: {
    border: `1.5px solid ${C.border}`,
    borderRadius: '12px',
    padding: '10px 6px',
    textAlign: 'center',
    background: C.accentLight,
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: C.accentMid,
    lineHeight: 1,
    marginBottom: '3px',
  },
  statLabel: {
    fontSize: '0.58rem',
    letterSpacing: '0.14em',
    color: C.textMuted,
    textTransform: 'uppercase' as const,
    fontWeight: 600,
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  input: {
    flex: 1,
    border: `1.5px solid ${C.border}`,
    borderRadius: '50px',
    padding: '9px 16px',
    fontSize: '0.87rem',
    color: C.textMain,
    outline: 'none',
    fontFamily: "'Jost', sans-serif",
    background: '#fff',
    transition: 'border-color 0.2s',
  },
  addBtn: {
    background: C.accent,
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    padding: '9px 18px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Jost', sans-serif",
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
    transition: 'background 0.2s',
  },
  taskList: {
    minHeight: '100px',
    border: `1.5px dashed ${C.borderDash}`,
    borderRadius: '14px',
    padding: '10px',
    maxHeight: '280px',
    overflowY: 'auto' as const,
  },
  emptyState: {
    textAlign: 'center',
    padding: '20px 0',
    color: C.textMuted,
    fontSize: '0.73rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    fontWeight: 500,
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    background: C.taskBg,
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    marginBottom: '7px',
    transition: 'opacity 0.2s',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: C.accent,
    cursor: 'pointer',
    flexShrink: 0,
  },
  taskText: {
    flex: 1,
    fontSize: '0.87rem',
    color: C.textMain,
    fontWeight: 400,
  },
  taskTextDone: {
    flex: 1,
    fontSize: '0.87rem',
    color: C.textMuted,
    textDecoration: 'line-through',
    fontWeight: 400,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: C.border,
    fontSize: '0.9rem',
    padding: '0 2px',
    lineHeight: 1,
    transition: 'color 0.2s',
  },
  errorBanner: {
    background: C.errorBg,
    border: `1px solid ${C.border}`,
    color: C.errorText,
    borderRadius: '10px',
    padding: '8px 14px',
    fontSize: '0.81rem',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Task[]>(API_URL);
      setTasks(res.data);
      setError(null);
    } catch {
      setError('Backend disconnected! Check server.');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) { setError('Please enter a task title!'); return; }
    try {
      const res = await axios.post<Task>(API_URL, { title: newTitle });
      setTasks(prev => [...prev, res.data]);
      setNewTitle('');
      setError(null);
    } catch { setError('Failed to add task.'); }
  };

  const toggleTask = async (id: string, isCompleted: boolean) => {
    try {
      const res = await axios.put<Task>(`${API_URL}/${id}`, { isCompleted: !isCompleted });
      setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    } catch { setError('Update failed.'); }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch { setError('Delete failed.'); }
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.headerWrapper}>
          <h1 style={styles.title}>my tasks ♡</h1>
          <p style={styles.subtitle}>your little to-do list</p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>{error}</span>
            <button onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.accent, fontSize: '1rem' }}>
              ✕
            </button>
          </div>
        )}

        <div style={styles.statsRow}>
          <StatBox label="Total"   value={tasks.length} />
          <StatBox label="Pending" value={tasks.length - completedCount} />
          <StatBox label="Done"    value={completedCount} />
        </div>

        <form onSubmit={addTask} style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="add a new task..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onFocus={e => (e.target.style.borderColor = C.accent)}
            onBlur={e  => (e.target.style.borderColor = C.border)}
          />
          <button
            type="submit"
            style={styles.addBtn}
            onMouseOver={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseOut={e  => (e.currentTarget.style.background = C.accent)}
          >
            + add
          </button>
        </form>

        <div style={styles.taskList}>
          {loading && <div style={styles.emptyState}>💙 &nbsp; loading...</div>}
          {!loading && tasks.length === 0 && (
            <div style={styles.emptyState}>💙 &nbsp; nothing here yet — add a task!</div>
          )}
          {!loading && tasks.map(task => (
            <div key={task.id} style={{ ...styles.taskItem, opacity: task.isCompleted ? 0.65 : 1 }}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={task.isCompleted}
                onChange={() => toggleTask(task.id, task.isCompleted)}
              />
              <span style={task.isCompleted ? styles.taskTextDone : styles.taskText}>
                {task.title}
              </span>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteTask(task.id)}
                onMouseOver={e => (e.currentTarget.style.color = C.accent)}
                onMouseOut={e  => (e.currentTarget.style.color = C.border)}
                title="Delete"
              >✕</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div style={styles.statBox}>
    <div style={styles.statNumber}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

export default App;