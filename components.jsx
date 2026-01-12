import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef } from "react";
import { Mail, Send, MousePointer2, Inbox, SendHorizontal, Cpu, MonitorPlay } from "lucide-react";
import clsx from "clsx";
import { store, addEvent } from "./store.js";
const FolderTabs = ({ currentFolder, onSwitch, isAi }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex border-b", isAi ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"), children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => onSwitch("inbox"),
        className: clsx(
          "flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors",
          currentFolder === "inbox" ? isAi ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800" : "text-blue-600 border-b-2 border-blue-600 bg-white" : isAi ? "text-slate-500 hover:text-cyan-400/50" : "text-slate-500 hover:text-slate-700"
        ),
        children: [
          /* @__PURE__ */ jsxDEV(Inbox, { size: 16 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 19,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV("span", { children: "Inbox" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 20,
            columnNumber: 9
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 10,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => onSwitch("sent"),
        className: clsx(
          "flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors",
          currentFolder === "sent" ? isAi ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800" : "text-blue-600 border-b-2 border-blue-600 bg-white" : isAi ? "text-slate-500 hover:text-cyan-400/50" : "text-slate-500 hover:text-slate-700"
        ),
        children: [
          /* @__PURE__ */ jsxDEV(SendHorizontal, { size: 16 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 31,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV("span", { children: "Sent" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 32,
            columnNumber: 9
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 22,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 9,
    columnNumber: 5
  });
};
const EmailList = ({ emails, onSelect, selectedId, readOnly = false }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto bg-slate-900 border-r border-slate-700 custom-scrollbar", children: [
    emails.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "p-8 text-slate-500 text-center text-sm", children: "Folder is empty" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 43,
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
              lineNumber: 57,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-500", children: new Date(email.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 60,
              columnNumber: 13
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 56,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-medium text-slate-300 truncate mb-1", children: email.subject }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 64,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-500 truncate", children: email.body }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 65,
            columnNumber: 11
          })
        ]
      },
      email.id,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 9
      }
    ))
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 41,
    columnNumber: 5
  });
};
const EmailReader = ({
  email,
  onClose,
  isAiView,
  typingBuffer,
  replyingToId,
  onReplyClick,
  userReplyDraft = "",
  setUserReplyDraft,
  onSendReply
}) => {
  if (!email) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-950", children: [
      /* @__PURE__ */ jsxDEV(Mail, { size: 48, className: "mb-4 opacity-50" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 87,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("p", { children: "Select an email to read" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 88,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 86,
      columnNumber: 7
    });
  }
  const isReplying = replyingToId === email.id;
  return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col bg-slate-950 h-full", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "p-6 border-b border-slate-800", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-white mb-4", children: email.subject }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 98,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold", children: email.from[0].toUpperCase() }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 101,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "font-bold", children: email.from }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 105,
              columnNumber: 15
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-400", children: [
              "to ",
              email.to
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 106,
              columnNumber: 15
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 104,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 100,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-slate-500", children: new Date(email.timestamp).toLocaleString() }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 109,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 99,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 97,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "p-6 flex-1 overflow-y-auto whitespace-pre-wrap text-slate-300 leading-relaxed", children: email.body }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 115,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "p-4 border-t border-slate-800 bg-slate-900", children: isReplying ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 text-blue-400 text-sm font-mono mb-2", children: [
        /* @__PURE__ */ jsxDEV(Cpu, { size: 14 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 124,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("span", { children: isAiView ? "AI RESPONSE GENERATION PROTOCOL" : "COMPOSING REPLY..." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 125,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 123,
        columnNumber: 14
      }),
      !isAiView && setUserReplyDraft ? /* @__PURE__ */ jsxDEV(
        "textarea",
        {
          id: "reply-body",
          value: userReplyDraft,
          onChange: (e) => setUserReplyDraft(e.target.value),
          className: "w-full p-4 bg-slate-800 rounded border border-blue-900/50 text-white font-mono h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder-slate-500",
          placeholder: "Type your reply here..."
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 129,
          columnNumber: 16
        }
      ) : /* @__PURE__ */ jsxDEV(
        "div",
        {
          id: "reply-body",
          className: clsx(
            "w-full p-4 rounded border font-mono h-32 whitespace-pre-wrap",
            isAiView ? "bg-black/50 border-cyan-900/50 text-cyan-100" : "bg-slate-800 border-slate-700 text-slate-300"
          ),
          children: [
            isAiView ? typingBuffer || "" : userReplyDraft || typingBuffer || "",
            isAiView && /* @__PURE__ */ jsxDEV("span", { className: "animate-pulse inline-block w-2 h-4 bg-cyan-400 ml-1" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 145,
              columnNumber: 31
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 137,
          columnNumber: 16
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          id: "send-reply-btn",
          onClick: onSendReply,
          disabled: isAiView,
          className: clsx(
            "px-6 py-2 rounded flex items-center space-x-2 shadow-lg transition-all",
            isAiView ? "bg-cyan-900/20 text-cyan-700 border border-cyan-900/30 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50"
          ),
          children: [
            /* @__PURE__ */ jsxDEV(Send, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 159,
              columnNumber: 19
            }),
            /* @__PURE__ */ jsxDEV("span", { children: "Send Reply" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 160,
              columnNumber: 19
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 150,
          columnNumber: 17
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 149,
        columnNumber: 14
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 122,
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
            lineNumber: 171,
            columnNumber: 16
          }),
          /* @__PURE__ */ jsxDEV("span", { children: "Reply" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 172,
            columnNumber: 16
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 166,
        columnNumber: 14
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 165,
      columnNumber: 12
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 120,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 96,
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
          lineNumber: 188,
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
            lineNumber: 189,
            columnNumber: 7
          }
        ),
        label && /* @__PURE__ */ jsxDEV("div", { className: clsx(
          "absolute left-6 top-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-10",
          isAi ? "bg-cyan-500 text-black" : "bg-white text-black"
        ), children: label }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 197,
          columnNumber: 9
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 184,
      columnNumber: 5
    }
  );
};
export {
  Cursor,
  EmailList,
  EmailReader,
  FolderTabs
};
