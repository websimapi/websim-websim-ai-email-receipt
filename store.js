import { createStore } from 'https://esm.sh/zustand/vanilla';

// Initial Mock Data
const INITIAL_EMAILS = [
  {
    id: 'msg_0',
    from: 'system@websim.ai',
    to: 'ai@websim.ai',
    subject: 'Welcome to the Simulation',
    body: 'You are an AI agent. Your job is to read emails and reply to them. Use the interface provided.',
    folder: 'inbox',
    read: false,
    timestamp: Date.now()
  }
];

// The Event Log (The "JSON Object" for the video)
// Format: { timestamp: number, type: string, payload: any, actor: 'user' | 'ai' }
export const eventLog = [];

export const addEvent = (type, payload, actor = 'user') => {
  eventLog.push({
    timestamp: Date.now(),
    type,
    payload,
    actor
  });
};

// Global State
export const store = createStore((set, get) => ({
  viewMode: 'user', // 'user' | 'ai' | 'replay'
  
  // Email Data
  emails: INITIAL_EMAILS,
  draft: { to: 'ai@websim.ai', subject: '', body: '' },
  
  // AI State
  aiCursor: { x: 500, y: 300 },
  aiStatus: 'IDLE', // 'IDLE' | 'READING' | 'THINKING' | 'TYPING' | 'MOVING'
  aiTarget: null, // DOM Element ID to interact with
  
  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  
  sendEmail: (email) => {
    const newEmail = {
      ...email,
      id: `msg_${Date.now()}`,
      timestamp: Date.now(),
      read: false,
      folder: 'inbox' // Goes to inbox effectively
    };
    
    set(state => ({ 
      emails: [newEmail, ...state.emails],
      draft: { to: 'ai@websim.ai', subject: '', body: '' } 
    }));
    
    addEvent('EMAIL_RECEIVED', newEmail, 'system');
    
    // Play sound
    new Audio('notification.mp3').play().catch(() => {});
  },

  markRead: (id) => {
    set(state => ({
      emails: state.emails.map(e => e.id === id ? { ...e, read: true } : e)
    }));
    addEvent('MARK_READ', { id }, 'ai');
  },

  updateAiCursor: (x, y) => {
    set({ aiCursor: { x, y } });
    // We don't log every single pixel move to the main array to save memory, 
    // but for the Replay we'll interpolate. 
    // However, the prompt asks for frame-by-frame storage. 
    // We will store "keyframe" moves in the event log.
  },

  setDraft: (field, value) => set(state => ({ draft: { ...state.draft, [field]: value } })),
}));

// AI "Driver" Logic
// This function runs periodically to drive the AI behavior
let aiInterval;
let aiMemory = {
  lastProcessedEmailId: null
};

// Helper to get element position
const getElementPos = (id) => {
  const el = document.getElementById(id);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  // Return center of element
  return { 
    x: rect.left + rect.width / 2, 
    y: rect.top + rect.height / 2 
  };
};

// Smooth mouse move simulation
async function moveMouseTo(targetX, targetY, duration = 500) {
  const start = store.getState().aiCursor;
  const startTime = Date.now();
  
  return new Promise(resolve => {
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing (ease-out-quad)
      const ease = t => t * (2 - t);
      const t = ease(progress);
      
      const x = start.x + (targetX - start.x) * t;
      const y = start.y + (targetY - start.y) * t;
      
      store.getState().updateAiCursor(x, y);
      addEvent('MOUSE_MOVE', { x, y }, 'ai'); // Log for replay
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(animate);
  });
}

async function typeText(text, targetInputId) {
  addEvent('FOCUS_INPUT', { id: targetInputId }, 'ai');
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    await new Promise(r => setTimeout(r, 50 + Math.random() * 50)); // Variable typing speed
    
    // Update the UI state directly to simulate typing into the "system"
    // In a real app we'd dispatch events, but here we cheat slightly for stability
    if (targetInputId === 'reply-body') {
       // We handle this via specific "AI Reply" state in the UI components usually,
       // but let's assume the AI is just emitting "TYPE" events that the UI listens to?
       // Actually, let's update a specific "AI Typing Buffer" in the store.
    }
    
    addEvent('TYPE_CHAR', { char, targetId: targetInputId }, 'ai');
    
    // Audio feedback
    const audio = new Audio('keyboard_clack.mp3');
    audio.volume = 0.3;
    audio.play().catch(()=>{});
  }
}

export const startAiLoop = () => {
  if (aiInterval) return;
  
  console.log("AI System Online");
  
  aiInterval = setInterval(async () => {
    const state = store.getState();
    const unreadEmails = state.emails.filter(e => !e.read && e.to === 'ai@websim.ai');
    
    if (unreadEmails.length === 0 || state.aiStatus !== 'IDLE') return;
    
    const targetEmail = unreadEmails[0];
    
    // 1. AI Notices Email
    store.setState({ aiStatus: 'MOVING' });
    
    // 2. Move to Email in List (We assume the DOM ID is `email-item-${id}`)
    const listPos = getElementPos(`email-item-${targetEmail.id}`);
    if (!listPos) return; // UI might not be rendered yet if in User View, but we assume AI View is mounted "virtually" or we switch context
    
    await moveMouseTo(listPos.x, listPos.y);
    
    // 3. Click Email
    addEvent('CLICK', { x: listPos.x, y: listPos.y, target: `email-item-${targetEmail.id}` }, 'ai');
    new Audio('mouse_click.mp3').play().catch(()=>{});
    store.getState().markRead(targetEmail.id);
    store.setState({ aiStatus: 'READING' });
    
    await new Promise(r => setTimeout(r, 1500)); // Reading time
    
    // 4. Generate Reply with LLM
    store.setState({ aiStatus: 'THINKING' });
    let replyText = "Receipt acknowledged.";
    try {
        const completion = await websim.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful automated email receipt AI. Keep replies brief, robotic but polite. Max 2 sentences." },
                { role: "user", content: `Reply to email: ${targetEmail.subject} - ${targetEmail.body}` }
            ]
        });
        replyText = completion.content;
    } catch (e) {
        console.error("LLM Error", e);
    }
    
    // 5. Move to Reply Button
    const replyBtnPos = getElementPos('reply-btn');
    if (replyBtnPos) {
        store.setState({ aiStatus: 'MOVING' });
        await moveMouseTo(replyBtnPos.x, replyBtnPos.y);
        addEvent('CLICK', { x: replyBtnPos.x, y: replyBtnPos.y, target: 'reply-btn' }, 'ai');
        new Audio('mouse_click.mp3').play().catch(()=>{});
    }

    // 6. Type Response
    store.setState({ aiStatus: 'TYPING' });
    // In our simplified sim, the AI adds the email to the system directly after "typing"
    // We simulate the typing visually via events for the Replay, 
    // but for logic we just wait and then send.
    await typeText(replyText, 'reply-body');
    
    // 7. Send
    const sendBtnPos = getElementPos('send-reply-btn');
    if (sendBtnPos) {
        store.setState({ aiStatus: 'MOVING' });
        await moveMouseTo(sendBtnPos.x, sendBtnPos.y);
        addEvent('CLICK', { x: sendBtnPos.x, y: sendBtnPos.y, target: 'send-reply-btn' }, 'ai');
        new Audio('mouse_click.mp3').play().catch(()=>{});
    }
    
    // Actual Logic Update
    const replyEmail = {
        id: `reply_${Date.now()}`,
        from: 'ai@websim.ai',
        to: targetEmail.from,
        subject: `Re: ${targetEmail.subject}`,
        body: replyText,
        folder: 'sent',
        read: true,
        timestamp: Date.now()
    };
    
    store.setState(prev => ({
        emails: [replyEmail, ...prev.emails],
        aiStatus: 'IDLE'
    }));
    addEvent('EMAIL_SENT', replyEmail, 'ai');
    
  }, 1000);
};