import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { Mail, Settings, Play, Monitor, User, Send as SendIcon, Columns } from "lucide-react";
import { store, startAiLoop, addEvent, eventLog } from "./store.js";
import { EmailList, EmailReader, Cursor } from "./components.jsx";
import { EmailReplay } from "./video.jsx";
import clsx from "clsx";
const App = () => {
  const [state, setState] = useState(store.getState());
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [draftBody, setDraftBody] = useState("");
  useEffect(() => {
    let lastLog = 0;
    const handleMouseMove = (e) => {
      if (state.viewMode === "user" && Date.now() - lastLog > 50) {
        addEvent("MOUSE_MOVE", { x: e.clientX, y: e.clientY }, "user");
        lastLog = Date.now();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [state.viewMode]);
  useEffect(() => {
    const unsub = store.subscribe((newState) => setState(newState));
    startAiLoop();
    return unsub;
  }, []);
  useEffect(() => {
    if (selectedEmail) {
      const fresh = state.emails.find((e) => e.id === selectedEmail.id);
      if (fresh) setSelectedEmail(fresh);
    }
  }, [state.emails]);
  const handleUserSend = () => {
    if (!draftBody.trim()) return;
    store.getState().sendEmail({
      from: "user@websim.ai",
      to: "ai@websim.ai",
      subject: "Inquiry",
      body: draftBody,
      folder: "inbox"
    });
    setDraftBody("");
    setIsComposeOpen(false);
    addEvent("CLICK", { target: "send-user-btn" }, "user");
  };
  const renderInterface = () => {
    const isAiView = state.viewMode === "ai";
    return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-col h-full w-full", isAiView ? "border-4 border-cyan-500/30" : ""), children: [
      /* @__PURE__ */ jsxDEV("div", { className: clsx(
        "h-16 flex items-center justify-between px-6 border-b z-20 transition-colors",
        isAiView ? "bg-slate-900 border-cyan-900" : "bg-white border-slate-200 text-slate-800"
      ), children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: clsx("p-2 rounded-lg", isAiView ? "bg-cyan-900 text-cyan-400" : "bg-blue-600 text-white"), children: /* @__PURE__ */ jsxDEV(Mail, { size: 24 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 74,
            columnNumber: 21
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 73,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("h1", { className: clsx("text-xl font-bold", isAiView ? "text-cyan-400" : "text-slate-800"), children: isAiView ? "SYSTEM_VIEW // AI_AGENT" : "My Inbox" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 76,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 72,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3 bg-slate-100 p-1 rounded-lg", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => store.getState().setViewMode("user"),
              className: clsx(
                "px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all",
                !isAiView ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
              ),
              children: [
                /* @__PURE__ */ jsxDEV(User, { size: 16 }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 87,
                  columnNumber: 21
                }),
                " ",
                /* @__PURE__ */ jsxDEV("span", { children: "User View" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 87,
                  columnNumber: 40
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 82,
              columnNumber: 17
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => store.getState().setViewMode("ai"),
              className: clsx(
                "px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all",
                isAiView ? "bg-cyan-950 text-cyan-400 shadow ring-1 ring-cyan-800" : "text-slate-500 hover:text-slate-700"
              ),
              children: [
                /* @__PURE__ */ jsxDEV(Monitor, { size: 16 }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 94,
                  columnNumber: 21
                }),
                " ",
                /* @__PURE__ */ jsxDEV("span", { children: "AI View" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 94,
                  columnNumber: 43
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 89,
              columnNumber: 17
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "flex bg-purple-50 rounded-md overflow-hidden border border-purple-100", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  store.getState().setReplayConfig({
                    type: "single",
                    view: state.viewMode === "ai" ? "ai" : "user"
                  });
                  store.getState().setViewMode("replay");
                },
                className: "px-4 py-2 text-sm font-medium flex items-center space-x-2 text-purple-600 hover:bg-purple-100 border-r border-purple-200 transition-colors",
                children: [
                  /* @__PURE__ */ jsxDEV(Play, { size: 16 }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 107,
                    columnNumber: 25
                  }),
                  " ",
                  /* @__PURE__ */ jsxDEV("span", { children: "Replay" }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 107,
                    columnNumber: 44
                  })
                ]
              },
              void 0,
              true,
              {
                fileName: "<stdin>",
                lineNumber: 97,
                columnNumber: 21
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  store.getState().setReplayConfig({ type: "merge", view: "split" });
                  store.getState().setViewMode("replay");
                },
                className: "px-3 py-2 text-sm font-medium flex items-center justify-center text-purple-600 hover:bg-purple-100 transition-colors",
                title: "Merge View",
                children: /* @__PURE__ */ jsxDEV(Columns, { size: 16 }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 117,
                  columnNumber: 25
                })
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 109,
                columnNumber: 21
              }
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 96,
            columnNumber: 18
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 81,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 69,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex overflow-hidden relative", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-full md:w-96 flex flex-col border-r border-slate-200 bg-slate-50 h-full", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-4", children: /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                if (!isAiView) setIsComposeOpen(true);
                addEvent("CLICK", { target: "compose-btn" }, "user");
              },
              disabled: isAiView,
              className: clsx(
                "w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all",
                isAiView ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
              ),
              children: [
                /* @__PURE__ */ jsxDEV(SendIcon, { size: 18 }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 137,
                  columnNumber: 25
                }),
                /* @__PURE__ */ jsxDEV("span", { children: "Compose New Email" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 138,
                  columnNumber: 25
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 128,
              columnNumber: 21
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 127,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV(
            EmailList,
            {
              emails: state.emails,
              selectedId: selectedEmail?.id,
              onSelect: (e) => {
                setSelectedEmail(e);
                addEvent("CLICK", { target: `email-item-${e.id}` }, "user");
              },
              readOnly: isAiView
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 141,
              columnNumber: 17
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 126,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "hidden md:flex flex-1 bg-white h-full relative", children: [
          isComposeOpen ? /* @__PURE__ */ jsxDEV("div", { className: "p-8 w-full max-w-2xl mx-auto", children: [
            /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-slate-800 mb-6", children: "New Message to AI" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 156,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDEV("input", { disabled: true, value: "To: ai@websim.ai", className: "w-full p-3 border rounded bg-slate-50 text-slate-500" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 158,
                columnNumber: 29
              }),
              /* @__PURE__ */ jsxDEV(
                "textarea",
                {
                  value: draftBody,
                  onChange: (e) => {
                    setDraftBody(e.target.value);
                  },
                  placeholder: "Write something to the AI...",
                  className: "w-full h-64 p-4 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-800"
                },
                void 0,
                false,
                {
                  fileName: "<stdin>",
                  lineNumber: 159,
                  columnNumber: 29
                }
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end space-x-3", children: [
                /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsComposeOpen(false), className: "px-6 py-2 text-slate-500 hover:text-slate-700", children: "Cancel" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 169,
                  columnNumber: 33
                }),
                /* @__PURE__ */ jsxDEV("button", { id: "send-user-btn", onClick: handleUserSend, className: "px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium", children: "Send" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 170,
                  columnNumber: 33
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 168,
                columnNumber: 29
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 157,
              columnNumber: 25
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 155,
            columnNumber: 21
          }) : /* @__PURE__ */ jsxDEV(
            EmailReader,
            {
              email: selectedEmail,
              isAiView,
              typingBuffer: state.aiTypingBuffer,
              replyingToId: state.replyingToId,
              onReplyClick: () => store.getState().setReplyingTo(selectedEmail.id)
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 175,
              columnNumber: 21
            }
          ),
          isAiView && /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 right-4 bg-black/80 text-cyan-400 p-4 rounded font-mono text-xs border border-cyan-800 shadow-2xl backdrop-blur-sm z-50", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "mb-2 font-bold border-b border-cyan-900 pb-1", children: "SYSTEM STATUS" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 188,
                columnNumber: 29
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between space-x-8 mb-1", children: [
                /* @__PURE__ */ jsxDEV("span", { children: "MODE:" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 190,
                  columnNumber: 33
                }),
                /* @__PURE__ */ jsxDEV("span", { className: "text-white", children: state.aiStatus }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 191,
                  columnNumber: 33
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 189,
                columnNumber: 29
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between space-x-8 mb-1", children: [
                /* @__PURE__ */ jsxDEV("span", { children: "COORDS:" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 194,
                  columnNumber: 33
                }),
                /* @__PURE__ */ jsxDEV("span", { className: "text-white", children: [
                  Math.round(state.aiCursor.x),
                  ", ",
                  Math.round(state.aiCursor.y)
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 195,
                  columnNumber: 33
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 193,
                columnNumber: 29
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between space-x-8", children: [
                /* @__PURE__ */ jsxDEV("span", { children: "TASKS:" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 198,
                  columnNumber: 33
                }),
                /* @__PURE__ */ jsxDEV("span", { className: "text-white", children: [
                  state.emails.filter((e) => !e.read && e.to === "ai@websim.ai").length,
                  " PENDING"
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 199,
                  columnNumber: 33
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 197,
                columnNumber: 29
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 187,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV(
              Cursor,
              {
                x: state.aiCursor.x,
                y: state.aiCursor.y,
                isAi: true,
                isClicking: state.aiClicking,
                label: "AI AGENT"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 202,
                columnNumber: 25
              }
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none retro-scanline z-40 opacity-50 mix-blend-multiply" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 210,
              columnNumber: 25
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 186,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 153,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 124,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 67,
      columnNumber: 7
    });
  };
  if (state.viewMode === "replay") {
    const duration = Math.max(150, Math.ceil((Date.now() - (eventLog[0]?.timestamp || Date.now())) / 1e3 * 30));
    const isSplit = state.replayConfig.type === "merge";
    return /* @__PURE__ */ jsxDEV("div", { className: "h-full w-full bg-black flex flex-col items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: clsx("bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-slate-800", isSplit ? "w-[95%] h-[90%]" : "w-full max-w-5xl aspect-video"), children: /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: EmailReplay,
          durationInFrames: duration,
          fps: 30,
          compositionWidth: isSplit ? 1920 : 1280,
          compositionHeight: isSplit ? 1080 : 720,
          inputProps: {
            eventLog: JSON.parse(JSON.stringify(eventLog)),
            initialEmails: [{ ...store.getState().emails.find((e) => e.id === "msg_0") }],
            replayConfig: state.replayConfig
          },
          controls: true,
          autoPlay: true,
          loop: true,
          style: { width: "100%", height: "100%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 227,
          columnNumber: 19
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 226,
        columnNumber: 15
      }),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => store.getState().setViewMode("user"),
          className: "mt-6 px-6 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors font-medium flex items-center space-x-2",
          children: [
            /* @__PURE__ */ jsxDEV(Monitor, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 248,
              columnNumber: 19
            }),
            /* @__PURE__ */ jsxDEV("span", { children: "Return to System" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 249,
              columnNumber: 19
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 244,
          columnNumber: 15
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 225,
      columnNumber: 11
    });
  }
  return renderInterface();
};
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 259,
  columnNumber: 13
}));
