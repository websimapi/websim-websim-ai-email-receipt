import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence, interpolate } from "remotion";
import { EmailList, EmailReader, Cursor } from "./components.jsx";
import { Inbox, Cpu } from "lucide-react";
const EmailReplay = ({ eventLog, initialEmails }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!eventLog || eventLog.length === 0) {
    return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "bg-slate-950 flex items-center justify-center text-white", children: /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl font-bold", children: "No Recording Data" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 19,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 18,
      columnNumber: 9
    });
  }
  const startTime = eventLog[0].timestamp;
  const currentTime = startTime + frame / fps * 1e3;
  let emails = [...initialEmails];
  let cursor = { x: 500, y: 300 };
  let typingBuffer = "";
  let selectedEmail = null;
  let activeView = "inbox";
  const pastEvents = eventLog.filter((e) => e.timestamp <= currentTime);
  pastEvents.forEach((e) => {
    switch (e.type) {
      case "MOUSE_MOVE":
        cursor = { x: e.payload.x, y: e.payload.y };
        break;
      case "CLICK":
        if (e.payload.target && e.payload.target.startsWith("email-item-")) {
          const id = e.payload.target.replace("email-item-", "");
          selectedEmail = emails.find((em) => em.id === id);
        }
        break;
      case "TYPE_CHAR":
        typingBuffer += e.payload.char;
        break;
      case "EMAIL_RECEIVED":
        if (!emails.find((em) => em.id === e.payload.id)) {
          emails = [e.payload, ...emails];
        }
        break;
      case "EMAIL_SENT":
        typingBuffer = "";
        break;
    }
  });
  const nextMouseEvent = eventLog.find((e) => e.type === "MOUSE_MOVE" && e.timestamp > currentTime);
  const lastMouseEvent = [...pastEvents].reverse().find((e) => e.type === "MOUSE_MOVE");
  if (lastMouseEvent && nextMouseEvent) {
    const duration = nextMouseEvent.timestamp - lastMouseEvent.timestamp;
    const elapsed = currentTime - lastMouseEvent.timestamp;
    const progress = Math.min(elapsed / duration, 1);
    cursor.x = lastMouseEvent.payload.x + (nextMouseEvent.payload.x - lastMouseEvent.payload.x) * progress;
    cursor.y = lastMouseEvent.payload.y + (nextMouseEvent.payload.y - lastMouseEvent.payload.y) * progress;
  }
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { className: "bg-slate-900 text-white font-sans overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "h-14 border-b border-slate-700 bg-slate-950 flex items-center px-4 space-x-4 z-10", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 text-cyan-400", children: [
        /* @__PURE__ */ jsxDEV(Cpu, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 85,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("span", { className: "font-bold tracking-wider", children: "AI_REPLAY_LOG_V1" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 86,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 84,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 text-center font-mono text-xs text-slate-500", children: [
        "T: ",
        Math.floor(currentTime)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 88,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 83,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex overflow-hidden h-full", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-1/3 h-full flex flex-col border-r border-slate-700", children: /* @__PURE__ */ jsxDEV(EmailList, { emails, selectedId: selectedEmail?.id, readOnly: true }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 96,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 95,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "w-2/3 h-full relative", children: [
        /* @__PURE__ */ jsxDEV(EmailReader, { email: selectedEmail, isAiView: true, typingBuffer }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 99,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-cyan-900/5 pointer-events-none mix-blend-overlay retro-scanline" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 102,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 98,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Cursor, { x: cursor.x, y: cursor.y, isAi: true, label: "AI AGENT" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 107,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-4 right-4 font-mono text-cyan-500 text-sm bg-black/80 px-2 py-1 rounded", children: [
      "FRAME: ",
      frame
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 110,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 81,
    columnNumber: 5
  });
};
export {
  EmailReplay
};
