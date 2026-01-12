import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo, useEffect, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence, interpolate, Audio, staticFile, delayRender, continueRender } from "remotion";
import { EmailList, EmailReader, Cursor } from "./components.jsx";
import { Inbox, Cpu, User } from "lucide-react";
import clsx from "clsx";
const TailwindLoader = () => {
  const [handle] = useState(() => delayRender("Loading Tailwind"));
  useEffect(() => {
    if (window.tailwind) {
      continueRender(handle);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    script.onload = () => {
      setTimeout(() => continueRender(handle), 100);
    };
    script.onerror = () => {
      console.warn("Tailwind failed to load in Render");
      continueRender(handle);
    };
    document.head.appendChild(script);
  }, [handle]);
  return null;
};
const GlobalStyles = () => /* @__PURE__ */ jsxDEV("style", { children: `
        /* Essential Styles Injection for Render */
        body { margin: 0; background-color: #0f172a; color: white; font-family: 'Segoe UI', sans-serif; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1e293b; }
        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }

        .ai-cursor {
          pointer-events: none;
          z-index: 9999;
          filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.6));
        }
        
        .cursor-ring {
          position: absolute;
          top: -8px;
          left: -8px;
          width: 40px;
          height: 40px;
          border: 2px solid rgba(56, 189, 248, 0.8);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.2s ease-out;
        }
        
        .cursor-active .cursor-ring {
          animation: ripple 0.5s ease-out;
        }

        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 1; border-width: 4px; }
          100% { transform: scale(2); opacity: 0; border-width: 0px; }
        }

        .retro-scanline {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
          background-size: 100% 4px;
          pointer-events: none;
        }
    ` }, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 38,
  columnNumber: 5
});
const reconstructState = (eventLog, currentTime, initialEmails, actorFilter) => {
  let emails = [...initialEmails];
  let cursor = { x: 500, y: 300 };
  let typingBuffer = "";
  let selectedEmail = null;
  let replyingToId = null;
  const pastEvents = eventLog.filter((e) => e.timestamp <= currentTime);
  pastEvents.forEach((e) => {
    if (e.type === "EMAIL_RECEIVED" || e.type === "EMAIL_SENT") {
      if (!emails.find((em) => em.id === e.payload.id)) {
        emails = [e.payload, ...emails];
      }
    }
    if (e.type === "TOGGLE_STAR") {
      emails = emails.map((em) => em.id === e.payload.id ? { ...em, starred: !em.starred } : em);
    }
    if (e.actor === actorFilter) {
      switch (e.type) {
        case "MOUSE_MOVE":
          cursor = { x: e.payload.x, y: e.payload.y };
          break;
        case "CLICK":
          if (e.payload.target && e.payload.target.startsWith("email-item-")) {
            const id = e.payload.target.replace("email-item-", "");
            selectedEmail = emails.find((em) => em.id === id);
            replyingToId = null;
            typingBuffer = "";
          } else if (e.payload.target === "reply-btn") {
            if (selectedEmail) replyingToId = selectedEmail.id;
          }
          break;
        case "FOCUS_INPUT":
          if (e.payload.id === "reply-body" && selectedEmail) {
            replyingToId = selectedEmail.id;
          }
          break;
        case "TYPE_CHAR":
          typingBuffer += e.payload.char;
          break;
        case "TEXT_UPDATE":
          typingBuffer = e.payload.text;
          break;
        case "EMAIL_SENT":
          typingBuffer = "";
          replyingToId = null;
          break;
      }
    }
  });
  const nextMouseEvent = eventLog.find((e) => e.type === "MOUSE_MOVE" && e.actor === actorFilter && e.timestamp > currentTime);
  const lastMouseEvent = [...pastEvents].reverse().find((e) => e.type === "MOUSE_MOVE" && e.actor === actorFilter);
  if (lastMouseEvent && nextMouseEvent) {
    const duration = nextMouseEvent.timestamp - lastMouseEvent.timestamp;
    const elapsed = currentTime - lastMouseEvent.timestamp;
    const progress = Math.min(elapsed / duration, 1);
    cursor.x = lastMouseEvent.payload.x + (nextMouseEvent.payload.x - lastMouseEvent.payload.x) * progress;
    cursor.y = lastMouseEvent.payload.y + (nextMouseEvent.payload.y - lastMouseEvent.payload.y) * progress;
  } else if (lastMouseEvent) {
    cursor = lastMouseEvent.payload;
  }
  return { emails, cursor, typingBuffer, selectedEmail, replyingToId };
};
const ReplayInterface = ({ state, isAi }) => {
  const displayedEmails = state.emails.filter((e) => {
    const userEmail = "user@websim.ai";
    const aiEmail = "ai@websim.ai";
    if (isAi) return e.to === aiEmail;
    return e.to === userEmail;
  });
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("h-full w-full relative flex flex-col overflow-hidden", isAi ? "bg-slate-900" : "bg-white"), children: [
    /* @__PURE__ */ jsxDEV("div", { className: clsx(
      "h-12 shrink-0 flex items-center px-4 space-x-2 border-b z-10",
      isAi ? "bg-slate-950 border-cyan-900 text-cyan-400" : "bg-slate-100 border-slate-200 text-slate-700"
    ), children: [
      isAi ? /* @__PURE__ */ jsxDEV(Cpu, { size: 18 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 181,
        columnNumber: 25
      }) : /* @__PURE__ */ jsxDEV(User, { size: 18 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 181,
        columnNumber: 45
      }),
      /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-sm tracking-wider", children: isAi ? "AI_VIEWPORT" : "USER_INBOX" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 182,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 179,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex overflow-hidden relative", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-1/3 h-full flex flex-col border-r border-slate-700/50", children: /* @__PURE__ */ jsxDEV(
        EmailList,
        {
          emails: displayedEmails,
          selectedId: state.selectedEmail?.id,
          readOnly: true
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 187,
          columnNumber: 21
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 186,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "w-2/3 h-full relative", children: [
        /* @__PURE__ */ jsxDEV(
          EmailReader,
          {
            email: state.selectedEmail,
            isAiView: isAi,
            typingBuffer: state.typingBuffer,
            replyingToId: state.replyingToId,
            isReplay: true
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 194,
            columnNumber: 21
          }
        ),
        isAi && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-cyan-900/5 pointer-events-none mix-blend-overlay retro-scanline" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 201,
          columnNumber: 30
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 193,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 185,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 177,
    columnNumber: 9
  });
};
const AudioLayer = ({ eventLog, startTime }) => {
  const { fps } = useVideoConfig();
  const audioEvents = useMemo(() => {
    return eventLog.flatMap((e, i) => {
      const offset = (e.timestamp - startTime) * fps / 1e3;
      const startFrame = Math.max(0, offset);
      if (e.type === "AUDIO_PLAY") {
        if (e.payload.sound === "notification") {
          return [{ id: `notif_${i}`, src: staticFile("notification.mp3"), start: startFrame, volume: 0.6, duration: Infinity }];
        }
        if (e.payload.sound === "click") {
          return [{ id: `click_${i}`, src: staticFile("mouse_click.mp3"), start: startFrame, volume: 0.5, duration: Infinity }];
        }
        if (e.payload.sound === "voice_message" && e.payload.url) {
          return [{ id: `voice_${i}`, src: e.payload.url, start: startFrame, volume: 1, duration: Infinity }];
        }
      }
      if (e.type === "TYPE_CHAR" && e.payload.char.trim().length > 0) {
        return [{ id: `type_${i}`, src: staticFile("keyboard_clack.mp3"), start: startFrame, volume: 0.15, duration: 10 }];
      }
      if (e.type === "CLICK" && !eventLog.find((ev) => ev.type === "AUDIO_PLAY" && Math.abs(ev.timestamp - e.timestamp) < 50)) {
        return [{ id: `click_inf_${i}`, src: staticFile("mouse_click.mp3"), start: startFrame, volume: 0.5, duration: 15 }];
      }
      if (e.type === "EMAIL_RECEIVED" && !eventLog.find((ev) => ev.type === "AUDIO_PLAY" && Math.abs(ev.timestamp - e.timestamp) < 50)) {
        return [{ id: `notif_inf_${i}`, src: staticFile("notification.mp3"), start: startFrame, volume: 0.6, duration: 60 }];
      }
      return [];
    });
  }, [eventLog, startTime, fps]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: audioEvents.map((evt) => /* @__PURE__ */ jsxDEV(Sequence, { from: evt.start, durationInFrames: evt.duration, children: /* @__PURE__ */ jsxDEV(Audio, { src: evt.src, volume: evt.volume }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 251,
    columnNumber: 21
  }) }, evt.id, false, {
    fileName: "<stdin>",
    lineNumber: 250,
    columnNumber: 17
  })) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 248,
    columnNumber: 9
  });
};
const EmailReplay = ({ eventLog, initialEmails }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!eventLog || eventLog.length === 0) {
    return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "bg-slate-950 flex items-center justify-center text-white", children: /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl font-bold", children: "No Recording Data" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 266,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 265,
      columnNumber: 9
    });
  }
  const startTime = eventLog[0].timestamp;
  const currentTime = startTime + frame / fps * 1e3;
  const userState = reconstructState(eventLog, currentTime, initialEmails, "user");
  const aiState = reconstructState(eventLog, currentTime, initialEmails, "ai");
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "bg-slate-950 flex flex-row items-stretch overflow-hidden relative font-sans text-white", children: [
    /* @__PURE__ */ jsxDEV(TailwindLoader, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 279,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(GlobalStyles, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 280,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(AudioLayer, { eventLog, startTime }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 281,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "w-1/2 h-full relative border-r border-slate-800", children: /* @__PURE__ */ jsxDEV(ReplayInterface, { state: userState, isAi: false }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 285,
      columnNumber: 14
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 284,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "w-1/2 h-full relative", children: /* @__PURE__ */ jsxDEV(ReplayInterface, { state: aiState, isAi: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 290,
      columnNumber: 14
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 289,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Cursor, { x: userState.cursor.x, y: userState.cursor.y, isAi: false, label: "USER" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 294,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Cursor, { x: aiState.cursor.x, y: aiState.cursor.y, isAi: true, label: "AI AGENT" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 295,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 278,
    columnNumber: 5
  });
};
export {
  EmailReplay
};
