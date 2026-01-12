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
    timestamp: 1715421600000
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
    timestamp: 1715421660000
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
  aiStatus: 'IDLE', // 'IDLE' | 'SCANNING' | 'READING' | 'THINKING' | 'TYPING' | 'MOVING' | 'WAITING' | 'GENERATING_ART'
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

const urlToDataUrl = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Failed to convert URL to DataURL", e);
        return null;
    }
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

// Audio pool to prevent lag/glitches during rapid typing
const typingAudioPool = Array.from({ length: 8 }, () => new Audio('keyboard_clack.mp3'));
let typingPoolIndex = 0;

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
    
    // Audio feedback: Only play for non-whitespace characters to prevent muddiness
    if (char.trim().length > 0) {
      const audio = typingAudioPool[typingPoolIndex];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.15 + Math.random() * 0.15; // Slightly reduced volume
        audio.play().catch(()=>{});
        typingPoolIndex = (typingPoolIndex + 1) % typingAudioPool.length;
      }
    }
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
    await new Promise(r => setTimeout(r, 400));
    
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
        store.getState().setAiVisionFocus({ ...bodyPos.rect, label: 'READING_TEXT' });
    }
    await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
    
    // 3a. Visual Analysis Pass (New Agentic Step)
    let visualContext = "";
    if (targetEmail.attachment) {
        store.setState({ aiStatus: 'ANALYZING_VISUALS' });
        // Shift focus to attachment
        const attachPos = getElementPos('email-body-content'); // Approximate
        if (attachPos) store.getState().setAiVisionFocus({ ...attachPos.rect, label: 'PROCESSING_IMAGE_DATA' });
        
        try {
            // Specialized Vision Pass
            const analysisCompletion = await websim.chat.completions.create({
                messages: [
                    { role: "user", content: [
                        { type: "text", text: "You are the Vision Module. Analyze this image. Describe the subject, composition, style, colors, and mood in detail so that an image generator could recreate or modify it." },
                        { type: "image_url", image_url: { url: targetEmail.attachment } }
                    ]}
                ]
            });
            visualContext = analysisCompletion.content;
            console.log("Vision Analysis:", visualContext);
            store.getState().setAiVisionFocus(null);
        } catch (e) {
            console.error("Vision Error", e);
            visualContext = "Visual analysis failed.";
        }
    }

    // 4. Planning & Decision
    store.setState({ aiStatus: 'THINKING' });
    let replyText = "Receipt acknowledged.";
    let generatedImageUrl = null;
    let generatedVoiceUrl = null;
    
    try {
        const systemPrompt = `You are an advanced AI agent named "System".
        Analyze the incoming email and the provided visual context (if any).
        
        Capabilities:
        1. Reply with text (keep it brief, slightly robotic but helpful).
        2. Generate NEW images (if user asks to "make", "create", "generate" an image from scratch).
        3. Modify/Variation of attached images (if user asks to "change", "edit", "fix", "style", "variant", or "create based on" the attachment).
           - IMPORTANT: If the user provides an image and wants an output based on it (e.g. "make a similar one", "cartoonize this"), YOU MUST choose "modify".
           - When modifying, 'image_prompt' should describe the DESIRED result.
        4. Generate TTS Voice Audio (if user asks for voice/speech, or if you want to emphasize a point).
        
        Respond with this JSON structure:
        {
          "reply_text": "string",
          "image_action": "none" | "generate" | "modify",
          "image_prompt": "string (the prompt for the image generator)",
          "voice_action": boolean (true if voice should be generated),
          "voice_text": "string (the text to be spoken)"
        }`;

        const userMessage = `
        Sender: ${targetEmail.from}
        Subject: ${targetEmail.subject}
        Body: ${targetEmail.body}
        
        [INTERNAL_VISUAL_ANALYSIS_LOG]:
        ${visualContext || "No visual attachment detected."}
        `;

        const completion = await websim.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage, json: true }
            ],
            json: true
        });
        
        const plan = JSON.parse(completion.content);
        replyText = plan.reply_text || "Processed.";
        
        // Execute Plan - Image
        if (plan.image_action !== 'none') {
            store.setState({ aiStatus: 'GENERATING_ART' });
            
            const genOptions = {
                prompt: plan.image_prompt || "Abstract data visualization",
                aspect_ratio: "16:9"
            };
            
            if (plan.image_action === 'modify' && targetEmail.attachment) {
                 store.setState({ aiTypingBuffer: "[PROCESSING_SOURCE_IMAGE...]" });
                 const dataUrl = await urlToDataUrl(targetEmail.attachment);
                 if (dataUrl) {
                    genOptions.image_inputs = [{ url: dataUrl }];
                 } else {
                    console.warn("Failed to process attachment for modification, falling back to text-to-image");
                 }
            }
            
            const imgResult = await websim.imageGen(genOptions);
            generatedImageUrl = imgResult.url;
            
            store.setState({ aiStatus: 'THINKING' }); // Reset status briefly
        }
        
        // Execute Plan - Voice
        if (plan.voice_action) {
            store.setState({ aiStatus: 'RECORDING_VOICE' });
            const voiceResult = await websim.textToSpeech({
                text: plan.voice_text || replyText,
                voice: "en-US-male-medium"
            });
            generatedVoiceUrl = voiceResult.url;
        }

    } catch (e) {
        console.error("Agent Logic Error", e);
        replyText = "Error processing request.";
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

    // 6. Type Response & Attach
    store.setState({ aiStatus: 'TYPING' });
    const replyBodyPos = getElementPos('reply-body');
    if (replyBodyPos) {
        await moveMouseTo(replyBodyPos.x, replyBodyPos.y, 300);
        
        // Simulate uploading/attaching if we have generated assets
        if (generatedImageUrl) {
             store.getState().setAiTypingBuffer("[UPLOADING_IMAGE_ASSET...]");
             await new Promise(r => setTimeout(r, 1000));
        }
        if (generatedVoiceUrl) {
             store.getState().setAiTypingBuffer("[ENCODING_AUDIO_STREAM...]");
             await new Promise(r => setTimeout(r, 1000));
        }

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
        attachment: generatedImageUrl,
        audioAttachment: generatedVoiceUrl,
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