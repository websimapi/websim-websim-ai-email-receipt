import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef } from "react";
import { Mail, Send, MousePointer2, Inbox, SendHorizontal, Cpu, MonitorPlay, Star, Crosshair, Paperclip, Image as ImageIcon, X } from "lucide-react";
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
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 overflow-hidden", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    store.getState().toggleStar(email.id, readOnly ? "ai" : "user");
                  },
                  className: "hover:bg-slate-700/50 p-1 rounded transition-colors shrink-0 z-10",
                  children: /* @__PURE__ */ jsxDEV(Star, { size: 14, className: clsx("transition-colors", email.starred ? "fill-yellow-500 text-yellow-500" : "text-slate-600 hover:text-slate-400") }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 65,
                    columnNumber: 19
                  })
                },
                void 0,
                false,
                {
                  fileName: "<stdin>",
                  lineNumber: 58,
                  columnNumber: 17
                }
              ),
              /* @__PURE__ */ jsxDEV("span", { className: clsx("font-medium truncate", !email.read ? "text-white" : "text-slate-400"), children: email.from }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 67,
                columnNumber: 17
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 57,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-500 shrink-0", children: new Date(email.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 71,
              columnNumber: 13
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 56,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "text-sm font-medium text-slate-300 truncate mb-1", children: email.subject }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 75,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-500 truncate", children: email.body }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 76,
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
  userReplyAttachment = null,
  setUserReplyAttachment,
  onSendReply
}) => {
  if (!email) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-950", children: [
      /* @__PURE__ */ jsxDEV(Mail, { size: 48, className: "mb-4 opacity-50" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("p", { children: "Select an email to read" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 101,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 99,
      columnNumber: 7
    });
  }
  const isReplying = replyingToId === email.id;
  return /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col bg-slate-950 h-full", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "p-6 border-b border-slate-800", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-white", children: email.subject }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 112,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "reader-star-btn",
            onClick: () => store.getState().toggleStar(email.id, isAiView ? "ai" : "user"),
            className: "p-2 hover:bg-slate-800 rounded-full transition-colors",
            children: /* @__PURE__ */ jsxDEV(Star, { size: 20, className: clsx("transition-colors", email.starred ? "fill-yellow-500 text-yellow-500" : "text-slate-600 hover:text-slate-400") }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 118,
              columnNumber: 17
            })
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 113,
            columnNumber: 13
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 111,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold", children: email.from[0].toUpperCase() }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 123,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "font-bold", children: email.from }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 127,
              columnNumber: 15
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-400", children: [
              "to ",
              email.to
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 128,
              columnNumber: 15
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 126,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 122,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-slate-500", children: new Date(email.timestamp).toLocaleString() }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 131,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 121,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 110,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { id: "email-body-content", className: "p-6 flex-1 overflow-y-auto whitespace-pre-wrap text-slate-300 leading-relaxed", children: [
      email.body,
      email.attachment && /* @__PURE__ */ jsxDEV("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-500 mb-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDEV(ImageIcon, { size: 12 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 142,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("span", { children: "Attachment" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 143,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 141,
          columnNumber: 14
        }),
        /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: email.attachment,
            alt: "Email Attachment",
            className: "max-w-full rounded border border-slate-700 max-h-[400px] object-contain bg-black/20",
            loading: "lazy"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 145,
            columnNumber: 14
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 140,
        columnNumber: 11
      }),
      email.audioAttachment && /* @__PURE__ */ jsxDEV("div", { className: "mt-4 p-3 bg-slate-900/50 rounded border border-slate-800 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-cyan-900/30 p-2 rounded-full text-cyan-400", children: /* @__PURE__ */ jsxDEV(MonitorPlay, { size: 20 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 156,
          columnNumber: 17
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 155,
          columnNumber: 14
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-cyan-500 font-mono mb-1 uppercase tracking-wider flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 160,
              columnNumber: 21
            }),
            "AI_VOICE_MESSAGE.mp3"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 159,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("audio", { controls: true, src: email.audioAttachment, className: "w-full h-8" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 163,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 158,
          columnNumber: 14
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 154,
        columnNumber: 11
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 137,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "p-4 border-t border-slate-800 bg-slate-900", children: isReplying ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 text-blue-400 text-sm font-mono mb-2", children: [
        /* @__PURE__ */ jsxDEV(Cpu, { size: 14 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 174,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("span", { children: isAiView ? "AI RESPONSE GENERATION PROTOCOL" : "COMPOSING REPLY..." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 175,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 173,
        columnNumber: 14
      }),
      !isAiView && setUserReplyDraft ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxDEV(
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
            lineNumber: 180,
            columnNumber: 18
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "cursor-pointer text-slate-400 hover:text-white transition-colors p-2 rounded hover:bg-slate-800", children: [
            /* @__PURE__ */ jsxDEV(Paperclip, { size: 18 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 190,
              columnNumber: 27
            }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: async (e) => {
                  if (e.target.files[0]) {
                    try {
                      const url = await websim.upload(e.target.files[0]);
                      setUserReplyAttachment(url);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 191,
                columnNumber: 27
              }
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 189,
            columnNumber: 24
          }),
          userReplyAttachment && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 bg-slate-800 px-2 py-1 rounded border border-slate-700", children: [
            /* @__PURE__ */ jsxDEV(ImageIcon, { size: 14, className: "text-blue-400" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 207,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-300 max-w-[100px] truncate", children: "image_attached" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 208,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("button", { onClick: () => setUserReplyAttachment(null), className: "text-slate-500 hover:text-red-400", children: /* @__PURE__ */ jsxDEV(X, { size: 14 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 209,
              columnNumber: 128
            }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 209,
              columnNumber: 29
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 206,
            columnNumber: 26
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 188,
          columnNumber: 21
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 187,
          columnNumber: 18
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 179,
        columnNumber: 16
      }) : /* @__PURE__ */ jsxDEV(
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
              lineNumber: 224,
              columnNumber: 31
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 216,
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
              lineNumber: 238,
              columnNumber: 19
            }),
            /* @__PURE__ */ jsxDEV("span", { children: "Send Reply" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 239,
              columnNumber: 19
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 229,
          columnNumber: 17
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 228,
        columnNumber: 14
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 172,
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
            lineNumber: 250,
            columnNumber: 16
          }),
          /* @__PURE__ */ jsxDEV("span", { children: "Reply" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 251,
            columnNumber: 16
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 245,
        columnNumber: 14
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 244,
      columnNumber: 12
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 170,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 109,
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
          lineNumber: 267,
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
            lineNumber: 268,
            columnNumber: 7
          }
        ),
        label && /* @__PURE__ */ jsxDEV("div", { className: clsx(
          "absolute left-6 top-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-10",
          isAi ? "bg-cyan-500 text-black" : "bg-white text-black"
        ), children: label }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 276,
          columnNumber: 9
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 263,
      columnNumber: 5
    }
  );
};
const AiVisionOverlay = ({ focus }) => {
  if (!focus) return null;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "fixed pointer-events-none z-30 transition-all duration-300 ease-out border-2 border-dashed border-red-500/50 bg-red-500/5",
      style: {
        left: focus.x,
        top: focus.y,
        width: focus.width,
        height: focus.height
      },
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute -top-6 left-0 bg-red-500/80 text-white text-[10px] font-mono px-1 py-0.5 rounded-sm flex items-center space-x-1", children: [
          /* @__PURE__ */ jsxDEV(Crosshair, { size: 10 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 304,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("span", { children: focus.label || "OBJECT_DETECTED" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 305,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 303,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute -bottom-4 right-0 text-red-400 text-[9px] font-mono", children: [
          Math.round(focus.width),
          "x",
          Math.round(focus.height)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 307,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 311,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 312,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 313,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 314,
          columnNumber: 13
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 294,
      columnNumber: 9
    }
  );
};
export {
  AiVisionOverlay,
  Cursor,
  EmailList,
  EmailReader,
  FolderTabs
};
