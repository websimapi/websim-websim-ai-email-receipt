import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence, interpolate } from "remotion";
import { EmailList, EmailReader, Cursor } from "./components.jsx";
import { Inbox, Cpu, User } from "lucide-react";
import clsx from "clsx";
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
        lineNumber: 91,
        columnNumber: 25
      }) : /* @__PURE__ */ jsxDEV(User, { size: 18 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 91,
        columnNumber: 45
      }),
      /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-sm tracking-wider", children: isAi ? "AI_VIEWPORT" : "USER_INBOX" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 92,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 89,
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
          lineNumber: 97,
          columnNumber: 21
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 96,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "w-2/3 h-full relative", children: [
        /* @__PURE__ */ jsxDEV(
          EmailReader,
          {
            email: state.selectedEmail,
            isAiView: isAi,
            typingBuffer: state.typingBuffer,
            replyingToId: state.replyingToId
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 104,
            columnNumber: 21
          }
        ),
        isAi && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-cyan-900/5 pointer-events-none mix-blend-overlay retro-scanline" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 110,
          columnNumber: 30
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 103,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 95,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Cursor, { x: state.cursor.x, y: state.cursor.y, isAi, label: isAi ? "AI AGENT" : "USER" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 114,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 87,
    columnNumber: 9
  });
};
const EmailReplay = ({ eventLog, initialEmails }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!eventLog || eventLog.length === 0) {
    return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "bg-slate-950 flex items-center justify-center text-white", children: /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl font-bold", children: "No Recording Data" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 127,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 126,
      columnNumber: 9
    });
  }
  const startTime = eventLog[0].timestamp;
  const currentTime = startTime + frame / fps * 1e3;
  const userState = reconstructState(eventLog, currentTime, initialEmails, "user");
  const aiState = reconstructState(eventLog, currentTime, initialEmails, "ai");
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "bg-black flex flex-row items-stretch overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "w-1/2 h-full relative border-r border-slate-800", children: /* @__PURE__ */ jsxDEV(ReplayInterface, { state: userState, isAi: false }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 156,
      columnNumber: 14
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 155,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "w-1/2 h-full relative", children: /* @__PURE__ */ jsxDEV(ReplayInterface, { state: aiState, isAi: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 161,
      columnNumber: 14
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 160,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-4 right-4 font-mono text-xs text-cyan-400 bg-black/90 px-3 py-1 rounded z-50 border border-cyan-900/50 shadow-lg", children: [
      "T: ",
      (currentTime - startTime).toFixed(0),
      "ms | FRAME: ",
      frame
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 165,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 153,
    columnNumber: 5
  });
};
export {
  EmailReplay
};
