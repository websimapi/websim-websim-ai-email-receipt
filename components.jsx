import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef } from "react";
import { Mail, Send, MousePointer2, Inbox, RefreshCw, Cpu, MonitorPlay } from "lucide-react";
import clsx from "clsx";
import { store, addEvent } from "./store.js";
const EmailList = ({ emails, onSelect, selectedId, readOnly = false }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto bg-slate-900 border-r border-slate-700", children: [
    emails.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "p-8 text-slate-500 text-center", children: "No messages" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 11,
      columnNumber: 9
    }),
    emails.map((email) => /* @__PURE__ */ jsxDEV(
      "div",
      {
        id: `email-item-${email.id}`,
        onClick: () => !readOnly && onSelect(email),
        className: clsx(
          "p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors",
          !email.read && "bg-slate-800/50 border-l-4 border-l-blue-500",
          selectedId === email.id && "bg-slate-800"
        ),
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-baseline mb-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: clsx("font-medium truncate", !email.read ? "text-white" : "text-slate-400"), children: email.from }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 25,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-500", children: new Date(email.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 28,
              columnNumber: 13
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 24,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-medium text-slate-300 truncate mb-1", children: email.subject }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 32,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-500 truncate", children: email.body }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 33,
            columnNumber: 11
          })
        ]
      },
      email.id,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 14,
        columnNumber: 9
      }
    ))
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 9,
    columnNumber: 5
  });
};
const EmailReader = ({ email, onClose, isAiView, typingBuffer, replyingToId, onReplyClick }) => {
  if (!email) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-950", children: [
      /* @__PURE__ */ jsxDEV(Mail, { size: 48, className: "mb-4 opacity-50" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 45,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("p", { children: "Select an email to read" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 44,
      columnNumber: 7
    });
  }
  const isReplying = replyingToId === email.id;
  return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col bg-slate-950 h-full", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "p-6 border-b border-slate-800", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-white mb-4", children: email.subject }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 56,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold", children: email.from[0].toUpperCase() }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 59,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "font-bold", children: email.from }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 63,
              columnNumber: 15
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-400", children: [
              "to ",
              email.to
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 64,
              columnNumber: 15
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 62,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 58,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-slate-500", children: new Date(email.timestamp).toLocaleString() }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 67,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 57,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 55,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "p-6 flex-1 overflow-y-auto whitespace-pre-wrap text-slate-300 leading-relaxed", children: email.body }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 73,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "p-4 border-t border-slate-800 bg-slate-900", children: isReplying ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 text-blue-400 text-sm font-mono mb-2", children: [
        /* @__PURE__ */ jsxDEV(Cpu, { size: 14 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("span", { children: isAiView ? "AI RESPONSE GENERATION PROTOCOL" : "COMPOSING REPLY..." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 83,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 81,
        columnNumber: 14
      }),
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          id: "reply-body",
          className: "w-full p-4 bg-black/50 rounded border border-blue-900/50 text-blue-100 font-mono h-32 whitespace-pre-wrap",
          children: [
            isAiView ? typingBuffer : "User manual input would go here...",
            /* @__PURE__ */ jsxDEV("span", { className: "animate-pulse inline-block w-2 h-4 bg-blue-400 ml-1" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 90,
              columnNumber: 16
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 85,
          columnNumber: 14
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDEV("button", { id: "send-reply-btn", className: "bg-blue-600 text-white px-6 py-2 rounded flex items-center space-x-2 shadow-lg shadow-blue-900/50", children: [
        /* @__PURE__ */ jsxDEV(Send, { size: 16 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 94,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV("span", { children: "Send Reply" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 95,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 93,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 92,
        columnNumber: 14
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 80,
      columnNumber: 12
    }) : /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        id: "reply-btn",
        onClick: onReplyClick,
        className: "bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded flex items-center space-x-2 transition-colors",
        children: [
          /* @__PURE__ */ jsxDEV(Send, { size: 16 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 106,
            columnNumber: 16
          }),
          /* @__PURE__ */ jsxDEV("span", { children: "Reply" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 107,
            columnNumber: 16
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 101,
        columnNumber: 14
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 100,
      columnNumber: 12
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 78,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 54,
    columnNumber: 5
  });
};
const Cursor = ({ x, y, label, isAi, isClicking }) => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx("ai-cursor fixed top-0 left-0 pointer-events-none", isClicking && "cursor-active"),
      style: { transform: `translate(${x}px, ${y}px)` },
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "cursor-ring" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 123,
          columnNumber: 7
        }),
        /* @__PURE__ */ jsxDEV(
          MousePointer2,
          {
            className: clsx(
              "w-6 h-6 relative z-10 transition-transform duration-100",
              isAi ? "text-cyan-400 fill-cyan-400/20" : "text-white",
              isClicking && "scale-90"
            )
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 124,
            columnNumber: 7
          }
        ),
        label && /* @__PURE__ */ jsxDEV("div", { className: clsx(
          "absolute left-6 top-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-10",
          isAi ? "bg-cyan-500 text-black" : "bg-white text-black"
        ), children: label }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 132,
          columnNumber: 9
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 119,
      columnNumber: 5
    }
  );
};
export {
  Cursor,
  EmailList,
  EmailReader
};
