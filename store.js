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
  replayConfig: { type: 'single', view: 'user' },
  
  // Email Data
  emails: INITIAL_EMAILS,
  draft: { to: 'ai@websim.ai', subject: '', body: '' },
  
  // AI State
  aiCursor: { x: 500, y: 300 },
  aiClicking: false,
  aiStatus: 'IDLE', // 'IDLE' | 'READING' | 'THINKING' | 'TYPING' | 'MOVING' | 'WAITING'
  aiTarget: null, // DOM Element ID to interact with
  replyingToId: null, // The email ID currently being replied to
  aiTypingBuffer: "", // Live buffer for what AI is typing
  
  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  setReplayConfig: (config) => set({ replayConfig: config }),
  setReplyingTo: (id) => set({ replyingToId: id }),
  setAiClicking: (isClicking) => set({ aiClicking: isClicking }),
  setAiTypingBuffer: (text) => set({ aiTypingBuffer: text }),
  
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
  
  // Only scroll if we are in AI view to avoid disrupting user
  if (store.getState().viewMode === 'ai') {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  const rect = el.getBoundingClientRect();
  // Return center of element
  return { 
    x: rect.left + rect.width / 2, 
    y: rect.top + rect.height / 2 
  };
};

// Smooth mouse move simulation
async function moveMouseTo(targetX, targetY, duration = 600) {
  const start = store.getState().aiCursor;
  const startTime = Date.now();
  
  // Add some randomness to path (Bezier-like curve midpoint)
  const controlX = (start.x + targetX) / 2 + (Math.random() - 0.5) * 100;
  const controlY = (start.y + targetY) / 2 + (Math.random() - 0.5) * 100;

  return new Promise(resolve => {
    const animate = () => {
      // If user switches view, we might want to stop, but let's finish the move
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Cubic easing
      const t = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      
      // Quadratic Bezier
      const x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * controlX + t * t * targetX;
      const y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * controlY + t * t * targetY;
      
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

async function simulateClick(targetId) {
    store.getState().setAiClicking(true);
    setTimeout(() => store.getState().setAiClicking(false), 200);
    new Audio('mouse_click.mp3').play().catch(()=>{});
    addEvent('CLICK', { target: targetId }, 'ai');
}

async function typeText(text, targetInputId) {
  addEvent('FOCUS_INPUT', { id: targetInputId }, 'ai');
  let currentBuffer = "";
  store.getState().setAiTypingBuffer("");
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    await new Promise(r => setTimeout(r, 30 + Math.random() * 40)); // Variable typing speed
    
    currentBuffer += char;
    store.getState().setAiTypingBuffer(currentBuffer);
    
    addEvent('TYPE_CHAR', { char, targetId: targetInputId }, 'ai');
    
    // Audio feedback
    const audio = new Audio('keyboard_clack.mp3');
    audio.volume = 0.2 + Math.random() * 0.2;
    audio.play().catch(()=>{});
  }
}

export const startAiLoop = () => {
  if (aiInterval) return;
  
  console.log("AI System Online");
  
  aiInterval = setInterval(async () => {
    const state = store.getState();
    
    // AI acts as an Observer. It only "works" visually when observed in AI mode.
    // Otherwise it waits. This ensures coordinates are valid.
    if (state.viewMode !== 'ai') return;
    
    const unreadEmails = state.emails.filter(e => !e.read && e.to === 'ai@websim.ai');
    
    if (unreadEmails.length === 0 || state.aiStatus !== 'IDLE') return;
    
    const targetEmail = unreadEmails[0];
    
    // 1. AI Notices Email
    store.setState({ aiStatus: 'MOVING' });
    
    // 2. Move to Email in List
    const listPos = getElementPos(`email-item-${targetEmail.id}`);
    if (!listPos) return; // Should exist if we are in AI view
    
    await moveMouseTo(listPos.x, listPos.y);
    
    // 3. Click Email to Open
    await simulateClick(`email-item-${targetEmail.id}`);
    store.getState().markRead(targetEmail.id);
    store.getState().setReplyingTo(null); // Reset reply state when opening new email
    
    store.setState({ aiStatus: 'READING' });
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000)); // Variable Reading time
    
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
    
    // 5. Move to 'Reply' Button and Click it to open input
    const replyBtnPos = getElementPos('reply-btn');
    if (replyBtnPos) {
        store.setState({ aiStatus: 'MOVING' });
        await moveMouseTo(replyBtnPos.x, replyBtnPos.y);
        await simulateClick('reply-btn');
        store.getState().setReplyingTo(targetEmail.id);
        await new Promise(r => setTimeout(r, 400)); // UI transition wait
    }

    // 6. Type Response
    store.setState({ aiStatus: 'TYPING' });
    // Now 'reply-body' textarea should be visible
    const replyBodyPos = getElementPos('reply-body');
    if (replyBodyPos) {
        // Move to text area center just for effect
        await moveMouseTo(replyBodyPos.x, replyBodyPos.y, 300);
        await typeText(replyText, 'reply-body');
    }
    
    // 7. Send
    const sendBtnPos = getElementPos('send-reply-btn');
    if (sendBtnPos) {
        store.setState({ aiStatus: 'MOVING' });
        await moveMouseTo(sendBtnPos.x, sendBtnPos.y);
        await simulateClick('send-reply-btn');
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
        aiStatus: 'IDLE',
        aiTypingBuffer: "",
        replyingToId: null
    }));
    addEvent('EMAIL_SENT', replyEmail, 'ai');
    
  }, 1000);
};