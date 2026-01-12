import { createStore } from 'https://esm.sh/zustand/vanilla';

// Initial Mock Data
export const INITIAL_EMAILS = [
  {
    id: 'msg_0',
    from: 'system@websim.ai',
    to: 'ai@websim.ai',
    subject: 'Welcome to the Simulation',
    body: 'You are an AI agent. Your job is to read emails and reply to them. Use the interface provided.',
    folder: 'inbox',
    read: false,
    starred: false,
    timestamp: Date.now()
  },
  {
    id: 'msg_1',
    from: 'admin@websim.ai',
    to: 'user@websim.ai',
    subject: 'System Access Granted',
    body: 'Welcome User. You can communicate with the AI agent by sending emails to ai@websim.ai.',
    folder: 'inbox',
    read: false,
    starred: true,
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
  viewMode: 'live', // 'live' | 'replay'
  mobileView: 'user', // 'user' | 'ai'
  replayConfig: { type: 'split' }, // Default to split
  
  // Email Data
  emails: INITIAL_EMAILS,
  userFolder: 'inbox', // 'inbox' | 'sent'
  aiFolder: 'inbox',   // 'inbox' | 'sent'
  draft: { to: 'ai@websim.ai', subject: '', body: '' },
  
  // AI State
  aiCursor: { x: 500, y: 300 },
  aiClicking: false,
  aiStatus: 'IDLE', // 'IDLE' | 'SCANNING' | 'READING' | 'THINKING' | 'TYPING' | 'MOVING' | 'WAITING'
  aiTarget: null, // DOM Element ID to interact with
  replyingToId: null, // The email ID currently being replied to
  aiActiveEmailId: null, // The email ID the AI is currently viewing
  aiTypingBuffer: "", // Live buffer for what AI is typing
  aiVisionFocus: null, // { x, y, width, height, label }
  
  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  setMobileView: (view) => set({ mobileView: view }),
  setReplayConfig: (config) => set({ replayConfig: config }),
  setReplyingTo: (id) => set({ replyingToId: id }),
  setAiActiveEmailId: (id) => set({ aiActiveEmailId: id }),
  setAiClicking: (isClicking) => set({ aiClicking: isClicking }),
  setAiTypingBuffer: (text) => set({ aiTypingBuffer: text }),
  setAiVisionFocus: (focus) => set({ aiVisionFocus: focus }),
  
  toggleStar: (id, actor = 'user') => {
    set(state => ({
      emails: state.emails.map(e => e.id === id ? { ...e, starred: !e.starred } : e)
    }));
    addEvent('TOGGLE_STAR', { id }, actor);
  },

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
  setFolder: (actor, folder) => set(state => actor === 'user' ? { userFolder: folder } : { aiFolder: folder }),
}));

// AI "Driver" Logic
// This function runs periodically to drive the AI behavior
let aiInterval;
let aiMemory = {
  lastProcessedEmailId: null
};

// Helper to get element position and dimensions
const getElementPos = (id) => {
  const el = document.getElementById(id);
  if (!el) return null;
  // If element is hidden (e.g. display:none), dimensions are 0
  if (el.offsetParent === null) return null;
  
  // Scroll if necessary
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  const rect = el.getBoundingClientRect();
  // Return center and dimensions
  return { 
    x: rect.left + rect.width / 2, 
    y: rect.top + rect.height / 2,
    rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
  };
};

// Smooth mouse move simulation
async function moveMouseTo(targetX, targetY, duration = 600) {
  const start = store.getState().aiCursor;
  const startTime = Date.now();
  let lastLogTime = 0;
  
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
      
      // Throttle logging to prevent JSON bloat, but ensure start/end are logged
      if (Date.now() - lastLogTime > 40 || progress >= 1 || progress <= 0) {
        addEvent('MOUSE_MOVE', { x, y }, 'ai'); // Log for replay
        lastLogTime = Date.now();
      }
      
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
    
    // AI acts as an Observer. It runs unless we are in Replay mode.
    if (state.viewMode === 'replay') return;
    
    // Ensure AI is in Inbox mode to see incoming messages
    if (state.aiFolder !== 'inbox') {
        store.getState().setFolder('ai', 'inbox');
        await new Promise(r => setTimeout(r, 500)); // Wait for render
        return;
    }

    const unreadEmails = state.emails.filter(e => !e.read && e.to === 'ai@websim.ai');
    
    if (unreadEmails.length === 0 || state.aiStatus !== 'IDLE') return;
    
    const targetEmail = unreadEmails[0];
    
    // 1. AI Notices Email - SCANNING PHASE
    store.setState({ aiStatus: 'SCANNING' });
    
    // Vision: Identify target in list
    const listPos = getElementPos(`email-item-${targetEmail.id}`);
    if (!listPos) return;
    
    store.getState().setAiVisionFocus({ ...listPos.rect, label: 'TARGET_ACQUIRED' });
    await new Promise(r => setTimeout(r, 400)); // Simulate processing time
    
    // 2. Move to Email in List
    store.setState({ aiStatus: 'MOVING' });
    await moveMouseTo(listPos.x, listPos.y);
    
    // 3. Click Email to Open
    await simulateClick(`email-item-${targetEmail.id}`);
    store.getState().markRead(targetEmail.id);
    store.getState().setAiActiveEmailId(targetEmail.id);
    store.getState().setReplyingTo(null);
    store.getState().setAiVisionFocus(null); // Clear focus
    
    store.setState({ aiStatus: 'READING' });
    
    // Vision: Scan the content area
    const bodyPos = getElementPos('email-body-content');
    if (bodyPos) {
        store.getState().setAiVisionFocus({ ...bodyPos.rect, label: 'ANALYZING_TEXT' });
    }
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    
    // 3b. DECISION: Is this important? (Random chance for demo)
    const isImportant = Math.random() > 0.6;
    if (isImportant) {
        store.setState({ aiStatus: 'MOVING' });
        const starPos = getElementPos('reader-star-btn');
        if (starPos) {
            store.getState().setAiVisionFocus({ ...starPos.rect, label: 'MARKING_IMPORTANT' });
            await moveMouseTo(starPos.x, starPos.y);
            await simulateClick('reader-star-btn');
            store.getState().toggleStar(targetEmail.id, 'ai');
            store.getState().setAiVisionFocus(null);
            await new Promise(r => setTimeout(r, 300));
        }
    }

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
    
    // 5. Move to 'Reply' Button
    const replyBtnPos = getElementPos('reply-btn');
    if (replyBtnPos) {
        store.setState({ aiStatus: 'MOVING' });
        store.getState().setAiVisionFocus({ ...replyBtnPos.rect, label: 'INITIATING_REPLY' });
        await moveMouseTo(replyBtnPos.x, replyBtnPos.y);
        store.getState().setAiVisionFocus(null);
        await simulateClick('reply-btn');
        store.getState().setReplyingTo(targetEmail.id);
        await new Promise(r => setTimeout(r, 400));
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