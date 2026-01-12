import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { Mail, Settings, Play, Monitor, User, Send as SendIcon, Columns, ArrowRightLeft } from "lucide-react";
import { store, startAiLoop, addEvent, eventLog, INITIAL_EMAILS } from "./store.js";
import { EmailList, EmailReader, Cursor, FolderTabs, AiVisionOverlay } from "./components.jsx";
import { EmailReplay } from "./video.jsx";
import clsx from "clsx";
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};
const InterfacePanel = ({ isAi, state, selectedEmail, onSelectEmail, isComposeOpen, setIsComposeOpen, draftBody, setDraftBody, handleUserSend }) => {
  const folder = isAi ? state.aiFolder : state.userFolder;
  const userEmail = "user@websim.ai";
  const aiEmail = "ai@websim.ai";
  const [userReplyDraft, setUserReplyDraft] = useState("");
  useEffect(() => {
    setUserReplyDraft("");
  }, [selectedEmail?.id]);
  const handleUserReplyChange = (text) => {
    setUserReplyDraft(text);
    if (!isAi) {
      addEvent("TEXT_UPDATE", { text }, "user");
    }
  };
  const handleSendReply = () => {
    if (!userReplyDraft.trim() || !selectedEmail) return;
    store.getState().sendEmail({
      from: "user@websim.ai",
      to: selectedEmail.from === "user@websim.ai" ? selectedEmail.to : selectedEmail.from,
      subject: selectedEmail.subject.startsWith("Re:") ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
      body: userReplyDraft,
      folder: "sent"
    });
    setUserReplyDraft("");
    store.getState().setReplyingTo(null);
    addEvent("CLICK", { target: "send-reply-btn" }, "user");
    addEvent("EMAIL_SENT", { id: "user_reply" }, "user");
  };
  const displayedEmails = state.emails.filter((e) => {
    if (isAi) {
      return folder === "inbox" ? e.to === aiEmail : e.from === aiEmail;
    } else {
      return folder === "inbox" ? e.to === userEmail : e.from === userEmail;
    }
  });
  return /* @__PURE__ */ jsxDEV("div", { className: clsx(
    "flex flex-col h-full w-full relative overflow-hidden transition-colors duration-500",
    isAi ? "bg-slate-950 text-cyan-50 border-4 border-cyan-900/30" : "bg-white text-slate-800"
  ), children: [
    /* @__PURE__ */ jsxDEV("div", { className: clsx(
      "h-14 shrink-0 flex items-center justify-between px-4 border-b z-20",
      isAi ? "bg-slate-900 border-cyan-900" : "bg-white border-slate-200"
    ), children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: clsx("p-1.5 rounded-lg", isAi ? "bg-cyan-900 text-cyan-400" : "bg-blue-600 text-white"), children: isAi ? /* @__PURE__ */ jsxDEV(Monitor, { size: 18 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 77,
          columnNumber: 29
        }) : /* @__PURE__ */ jsxDEV(User, { size: 18 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 77,
          columnNumber: 53
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 76,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("h2", { className: clsx("font-bold text-sm tracking-wider", isAi ? "text-cyan-400" : "text-slate-700"), children: isAi ? "AI_AGENT_VIEW" : "USER_INBOX" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 79,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 75,
        columnNumber: 13
      }),
      isAi && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 text-xs font-mono text-cyan-600", children: [
        /* @__PURE__ */ jsxDEV("span", { className: clsx("w-2 h-2 rounded-full", state.aiStatus !== "IDLE" ? "bg-cyan-400 animate-pulse" : "bg-cyan-900") }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 85,
          columnNumber: 20
        }),
        /* @__PURE__ */ jsxDEV("span", { children: state.aiStatus }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 86,
          columnNumber: 20
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 84,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 73,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex overflow-hidden relative", children: [
      /* @__PURE__ */ jsxDEV("div", { className: clsx("w-1/3 min-w-[120px] max-w-[280px] flex flex-col border-r", isAi ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"), children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-3", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              if (!isAi) {
                setIsComposeOpen(true);
                addEvent("CLICK", { target: "compose-btn" }, "user");
              }
            },
            disabled: isAi,
            className: clsx(
              "w-full py-2 px-3 rounded text-sm font-medium flex items-center justify-center space-x-2 transition-all",
              isAi ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
            ),
            children: [
              /* @__PURE__ */ jsxDEV(SendIcon, { size: 14 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 107,
                columnNumber: 25
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline", children: "Compose" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 108,
                columnNumber: 25
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 96,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 95,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(
          FolderTabs,
          {
            isAi,
            currentFolder: isAi ? state.aiFolder : state.userFolder,
            onSwitch: (f) => store.getState().setFolder(isAi ? "ai" : "user", f)
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 112,
            columnNumber: 17
          }
        ),
        /* @__PURE__ */ jsxDEV(
          EmailList,
          {
            emails: displayedEmails,
            selectedId: selectedEmail?.id,
            onSelect: onSelectEmail,
            readOnly: isAi
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 118,
            columnNumber: 17
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 94,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("div", { className: clsx("flex-1 flex flex-col relative", isAi ? "bg-slate-950" : "bg-white"), children: [
        !isAi && isComposeOpen ? /* @__PURE__ */ jsxDEV("div", { className: "p-4 md:p-8 w-full h-full overflow-auto", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold text-slate-800 mb-4", children: "New Message" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 130,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("input", { disabled: true, value: "To: ai@websim.ai", className: "w-full p-2 text-sm border rounded bg-slate-50 text-slate-500" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 132,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV(
              "textarea",
              {
                value: draftBody,
                onChange: (e) => setDraftBody(e.target.value),
                placeholder: "Message...",
                className: "w-full h-48 p-3 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-800"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 133,
                columnNumber: 29
              }
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end space-x-2", children: [
              /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsComposeOpen(false), className: "px-4 py-2 text-sm text-slate-500", children: "Cancel" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 140,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("button", { id: "send-user-btn", onClick: handleUserSend, className: "px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700", children: "Send" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 141,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 139,
              columnNumber: 29
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 131,
            columnNumber: 25
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 129,
          columnNumber: 22
        }) : /* @__PURE__ */ jsxDEV(
          EmailReader,
          {
            email: selectedEmail,
            isAiView: isAi,
            typingBuffer: isAi ? state.aiTypingBuffer : "",
            replyingToId: state.replyingToId,
            onReplyClick: () => {
              store.getState().setReplyingTo(selectedEmail.id);
              if (!isAi) addEvent("CLICK", { target: "reply-btn" }, "user");
            },
            userReplyDraft,
            setUserReplyDraft: !isAi ? handleUserReplyChange : void 0,
            onSendReply: !isAi ? handleSendReply : void 0
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 146,
            columnNumber: 21
          }
        ),
        isAi && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(AiVisionOverlay, { focus: state.aiVisionFocus }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 164,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV(
            Cursor,
            {
              x: state.aiCursor.x,
              y: state.aiCursor.y,
              isAi: true,
              isClicking: state.aiClicking,
              label: "AI"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 165,
              columnNumber: 25
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none retro-scanline z-40 opacity-30 mix-blend-overlay" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 172,
            columnNumber: 25
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 163,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 127,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 92,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 69,
    columnNumber: 7
  });
};
const App = () => {
  const [state, setState] = useState(store.getState());
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedAiEmail, setSelectedAiEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [draftBody, setDraftBody] = useState("");
  const isMobile = useMobile();
  useEffect(() => {
    let lastLog = 0;
    const handleMouseMove = (e) => {
      if (state.viewMode === "live" && Date.now() - lastLog > 50) {
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
    if (selectedUserEmail) {
      const fresh = state.emails.find((e) => e.id === selectedUserEmail.id);
      if (fresh) setSelectedUserEmail(fresh);
    }
    if (selectedAiEmail) {
      const fresh = state.emails.find((e) => e.id === selectedAiEmail.id);
      if (fresh) setSelectedAiEmail(fresh);
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
  const renderLive = () => {
    const showUser = !isMobile || state.mobileView === "user";
    const showAi = !isMobile || state.mobileView === "ai";
    return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-full w-full bg-slate-950", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 text-slate-400 font-mono text-xs", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "w-2 h-2 bg-green-500 rounded-full" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 262,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("span", { children: "SYSTEM_ONLINE" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 263,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("span", { className: "text-slate-600", children: "|" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 264,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("span", { children: [
            state.emails.length,
            " MESSAGES"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 265,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 261,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
          isMobile && /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => store.getState().setMobileView(state.mobileView === "user" ? "ai" : "user"),
              className: "flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded text-slate-300 text-xs hover:bg-slate-700 border border-slate-700",
              children: [
                /* @__PURE__ */ jsxDEV(ArrowRightLeft, { size: 12 }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 275,
                  columnNumber: 29
                }),
                /* @__PURE__ */ jsxDEV("span", { children: "Switch View" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 276,
                  columnNumber: 29
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 271,
              columnNumber: 25
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                store.getState().setViewMode("replay");
              },
              className: "flex items-center space-x-2 px-3 py-1 bg-purple-900/30 text-purple-400 rounded text-xs hover:bg-purple-900/50 border border-purple-900/50 transition-colors",
              children: [
                /* @__PURE__ */ jsxDEV(Play, { size: 12 }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 286,
                  columnNumber: 25
                }),
                /* @__PURE__ */ jsxDEV("span", { children: "REPLAY SESSION" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 287,
                  columnNumber: 25
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 280,
              columnNumber: 22
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 268,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 260,
        columnNumber: 14
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex overflow-hidden relative", children: [
        showUser && /* @__PURE__ */ jsxDEV("div", { className: clsx("h-full relative z-10", isMobile ? "w-full" : "w-1/2 border-r border-slate-800"), children: /* @__PURE__ */ jsxDEV(
          InterfacePanel,
          {
            isAi: false,
            state,
            selectedEmail: selectedUserEmail,
            onSelectEmail: (e) => {
              setSelectedUserEmail(e);
              addEvent("CLICK", { target: `email-item-${e.id}` }, "user");
            },
            isComposeOpen,
            setIsComposeOpen,
            draftBody,
            setDraftBody,
            handleUserSend
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 296,
            columnNumber: 25
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 295,
          columnNumber: 21
        }),
        showAi && /* @__PURE__ */ jsxDEV("div", { className: clsx("h-full relative z-0", isMobile ? "w-full" : "w-1/2"), children: /* @__PURE__ */ jsxDEV(
          InterfacePanel,
          {
            isAi: true,
            state,
            selectedEmail: state.emails.find((e) => e.id === state.aiActiveEmailId),
            onSelectEmail: () => {
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 319,
            columnNumber: 26
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 314,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 293,
        columnNumber: 14
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 258,
      columnNumber: 9
    });
  };
  if (state.viewMode === "replay") {
    const duration = Math.max(150, Math.ceil((Date.now() - (eventLog[0]?.timestamp || Date.now())) / 1e3 * 30));
    return /* @__PURE__ */ jsxDEV("div", { className: "h-full w-full bg-black flex flex-col items-center justify-center p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full max-w-[1920px] max-h-[1080px] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative", children: [
      /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: EmailReplay,
          durationInFrames: duration,
          fps: 30,
          compositionWidth: 1280,
          compositionHeight: 720,
          inputProps: {
            eventLog: JSON.parse(JSON.stringify(eventLog)),
            initialEmails: INITIAL_EMAILS,
            replayConfig: { type: "split" }
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
          lineNumber: 349,
          columnNumber: 19
        }
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => store.getState().setViewMode("live"),
          className: "absolute bottom-6 right-6 px-6 py-2 bg-slate-800/90 text-white rounded hover:bg-slate-700 backdrop-blur border border-slate-600 font-medium text-sm flex items-center space-x-2 z-50",
          children: [
            /* @__PURE__ */ jsxDEV(Monitor, { size: 14 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 369,
              columnNumber: 23
            }),
            /* @__PURE__ */ jsxDEV("span", { children: "Back to System" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 370,
              columnNumber: 23
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 365,
          columnNumber: 19
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 348,
      columnNumber: 15
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 347,
      columnNumber: 11
    });
  }
  return renderLive();
};
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 381,
  columnNumber: 13
}));
