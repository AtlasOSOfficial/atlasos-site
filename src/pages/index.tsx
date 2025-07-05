import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_REPLACE_WITH_YOUR_PUBLIC_KEY');

export default function Home() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('🧬 AtlasOS Reflex Terminal Online\nType "help" to begin.\n');
  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
  }, [output]);

  useEffect(() => {
    const last = localStorage.getItem('reflex-last');
    const plan = localStorage.getItem('reflex-plan');
    if (last) setOutput(prev => prev + `\n🧠 Last Command: ${last}`);
    if (plan) setOutput(prev => prev + `\n✅ Active Plan: ${plan}`);
  }, []);

  const interpret = async (cmd: string): Promise<string> => {
    const c = cmd.trim().toLowerCase();
    if (c === 'help') {
      return `Available commands:
  • status        :: system overview
  • launch        :: hard launch
  • memory        :: last command
  • pro           :: activate Pro tier
  • elite         :: activate Elite tier
  • clear         :: wipe terminal
  • echo [text]   :: repeat text
  • help          :: show this menu`;
    }

    if (c === 'status') return '🧠 Reflex Status: LINKED\n📡 COSMIC SALT active\n💾 Memory sync enabled';
    if (c === 'launch') return '🚀 AtlasOS launch sequence triggered.';
    if (c === 'memory') return `💾 ${localStorage.getItem('reflex-last') || '[none]'}`;
    if (c === 'clear') {
      setOutput('');
      return '';
    }
    if (c.startsWith('echo ')) return c.slice(5);

    if (c === 'pro' || c === 'elite') {
      const stripe = await stripePromise;
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: c }),
      });
      const session = await res.json();
      localStorage.setItem('reflex-plan', c.toUpperCase());
      await stripe?.redirectToCheckout({ sessionId: session.id });
      return `⏳ Redirecting to ${c.toUpperCase()} checkout...`;
    }

    return '⚠️ Unknown command. Type "help".';
  };

  const handleCommand = async () => {
    if (!command.trim()) return;
    localStorage.setItem('reflex-last', command);
    const result = await interpret(command);
    setOutput(prev => `${prev}\n> ${command}\n${result}`);
    setCommand('');
  };

  return (
    <main style={{
      background: 'radial-gradient(ellipse at center, #000 0%, #020202 100%)',
      color: '#0f0',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#0ff', marginBottom: '1rem' }}>🛸 AtlasOS Reflex Console</h1>
      <textarea
        ref={outputRef}
        value={output}
        readOnly
        rows={20}
        style={{
          width: '100%',
          maxWidth: '900px',
          background: '#000',
          color: '#0f0',
          border: '1px solid #0f0',
          padding: '1rem',
          resize: 'none',
          marginBottom: '1rem'
        }}
      />
      <input
        autoFocus
        value={command}
        onChange={e => setCommand(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleCommand()}
        placeholder="> Enter command"
        style={{
          width: '100%',
          maxWidth: '900px',
          padding: '1rem',
          background: '#111',
          color: '#0f0',
          border: '1px solid #0f0',
          marginBottom: '1rem'
        }}
      />
      <button
        onClick={handleCommand}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#0f0',
          color: '#000',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Run
      </button>
    </main>
  );
}
