import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { Mail, Settings, Play, Monitor, User, Send as SendIcon, Columns, ArrowRightLeft, Paperclip, Image as ImageIcon, X } from "lucide-react";
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
const InterfacePanel = ({ isAi, state, selectedEmail, onSelectEmail, isComposeOpen, setIsComposeOpen, draftBody, setDraftBody, draftAttachment, setDraftAttachment, handleUserSend }) => {
  const folder = isAi ? state.aiFolder : state.userFolder;
  const userEmail = "user@websim.ai";
  const aiEmail = "ai@websim.ai";
  const [userReplyDraft, setUserReplyDraft] = useState("");
  const [userReplyAttachment, setUserReplyAttachment] = useState(null);
  useEffect(() => {
    setUserReplyDraft("");
    setUserReplyAttachment(null);
  }, [selectedEmail?.id]);
  const handleUserReplyChange = (text) => {
    setUserReplyDraft(text);
    if (!isAi) {
      addEvent("TEXT_UPDATE", { text }, "user");
    }
  };
  const handleSendReply = () => {
    if (!userReplyDraft.trim() && !userReplyAttachment || !selectedEmail) return;
    store.getState().sendEmail({
      from: "user@websim.ai",
      to: selectedEmail.from === "user@websim.ai" ? selectedEmail.to : selectedEmail.from,
      subject: selectedEmail.subject.startsWith("Re:") ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
      body: userReplyDraft,
      attachment: userReplyAttachment,
      folder: "sent"
    });
    setUserReplyDraft("");
    setUserReplyAttachment(null);
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
          lineNumber: 81,
          columnNumber: 29
        }) : /* @__PURE__ */ jsxDEV(User, { size: 18 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 81,
          columnNumber: 53
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 80,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("h2", { className: clsx("font-bold text-sm tracking-wider", isAi ? "text-cyan-400" : "text-slate-700"), children: isAi ? "AI_AGENT_VIEW" : "USER_INBOX" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 83,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 79,
        columnNumber: 13
      }),
      isAi && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 text-xs font-mono text-cyan-600", children: [
        /* @__PURE__ */ jsxDEV("span", { className: clsx("w-2 h-2 rounded-full", state.aiStatus !== "IDLE" ? "bg-cyan-400 animate-pulse" : "bg-cyan-900") }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 89,
          columnNumber: 20
        }),
        /* @__PURE__ */ jsxDEV("span", { className: clsx(state.aiStatus.includes("ANALYZING") || state.aiStatus.includes("GENERATING") ? "text-purple-400 font-bold" : ""), children: state.aiStatus }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 90,
          columnNumber: 20
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 88,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 77,
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
                lineNumber: 113,
                columnNumber: 25
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline", children: "Compose" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 114,
                columnNumber: 25
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 102,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 101,
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
            lineNumber: 118,
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
            lineNumber: 124,
            columnNumber: 17
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("div", { className: clsx("flex-1 flex flex-col relative", isAi ? "bg-slate-950" : "bg-white"), children: [
        !isAi && isComposeOpen ? /* @__PURE__ */ jsxDEV("div", { className: "p-4 md:p-8 w-full h-full overflow-auto", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold text-slate-800 mb-4", children: "New Message" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 136,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("input", { disabled: true, value: "To: ai@websim.ai", className: "w-full p-2 text-sm border rounded bg-slate-50 text-slate-500" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 138,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV(
              "textarea",
              {
                value: draftBody,
                onChange: (e) => setDraftBody(e.target.value),
                placeholder: "Message...",
                className: "w-full h-48 p-3 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-800 mb-2"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 139,
                columnNumber: 29
              }
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "cursor-pointer text-slate-500 hover:text-blue-600 transition-colors p-2 rounded hover:bg-slate-100", children: [
                  /* @__PURE__ */ jsxDEV(Paperclip, { size: 18 }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 149,
                    columnNumber: 39
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
                            setDraftAttachment(url);
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
                      lineNumber: 150,
                      columnNumber: 39
                    }
                  )
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 148,
                  columnNumber: 36
                }),
                draftAttachment && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 bg-slate-100 px-2 py-1 rounded border border-slate-200", children: [
                  /* @__PURE__ */ jsxDEV(ImageIcon, { size: 14, className: "text-blue-500" }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 166,
                    columnNumber: 41
                  }),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-600 max-w-[100px] truncate", children: "attachment" }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 167,
                    columnNumber: 41
                  }),
                  /* @__PURE__ */ jsxDEV("button", { onClick: () => setDraftAttachment(null), className: "text-slate-400 hover:text-red-500", children: /* @__PURE__ */ jsxDEV(X, { size: 14 }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 168,
                    columnNumber: 136
                  }) }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 168,
                    columnNumber: 41
                  })
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 165,
                  columnNumber: 38
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 147,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end space-x-2", children: [
                /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsComposeOpen(false), className: "px-4 py-2 text-sm text-slate-500", children: "Cancel" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 173,
                  columnNumber: 37
                }),
                /* @__PURE__ */ jsxDEV("button", { id: "send-user-btn", onClick: handleUserSend, className: "px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700", children: "Send" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 174,
                  columnNumber: 37
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 172,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 146,
              columnNumber: 29
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 137,
            columnNumber: 25
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 135,
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
            userReplyAttachment,
            setUserReplyAttachment: !isAi ? setUserReplyAttachment : void 0,
            onSendReply: !isAi ? handleSendReply : void 0
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 180,
            columnNumber: 21
          }
        ),
        isAi && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(AiVisionOverlay, { focus: state.aiVisionFocus }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 200,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV(
            Cursor,
            {
              x: state.aiCursor.x,
              y: state.aiCursor.y,
              isAi: true,
              isClicking: state.aiClicking,
              fixed: true,
              label: "AI"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 201,
              columnNumber: 25
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none retro-scanline z-40 opacity-30 mix-blend-overlay" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 209,
            columnNumber: 25
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 199,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 133,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 98,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 73,
    columnNumber: 7
  });
};
const App = () => {
  const [state, setState] = useState(store.getState());
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedAiEmail, setSelectedAiEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [draftBody, setDraftBody] = useState("");
  const [draftAttachment, setDraftAttachment] = useState(null);
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
    if (!draftBody.trim() && !draftAttachment) return;
    store.getState().sendEmail({
      from: "user@websim.ai",
      to: "ai@websim.ai",
      subject: "Inquiry",
      body: draftBody,
      attachment: draftAttachment,
      folder: "inbox"
    });
    setDraftBody("");
    setDraftAttachment(null);
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
            lineNumber: 302,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("span", { children: "SYSTEM_ONLINE" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 303,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("span", { className: "text-slate-600", children: "|" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 304,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("span", { children: [
            state.emails.length,
            " MESSAGES"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 305,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 301,
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
                  lineNumber: 315,
                  columnNumber: 29
                }),
                /* @__PURE__ */ jsxDEV("span", { children: "Switch View" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 316,
                  columnNumber: 29
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 311,
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
                  lineNumber: 326,
                  columnNumber: 25
                }),
                /* @__PURE__ */ jsxDEV("span", { children: "REPLAY SESSION" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 327,
                  columnNumber: 25
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 320,
              columnNumber: 22
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 308,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 300,
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
            draftAttachment,
            setDraftAttachment,
            handleUserSend
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 336,
            columnNumber: 25
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 335,
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
            lineNumber: 361,
            columnNumber: 26
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 356,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 333,
        columnNumber: 14
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 298,
      columnNumber: 9
    });
  };
  if (state.viewMode === "replay") {
    const startTime = eventLog[0]?.timestamp || Date.now();
    const endTime = eventLog[eventLog.length - 1]?.timestamp || Date.now();
    const durationSeconds = (endTime - startTime) / 1e3;
    const duration = Math.max(150, Math.ceil((durationSeconds + 5) * 30));
    return /* @__PURE__ */ jsxDEV("div", { className: "h-full w-full bg-black flex flex-col items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-full aspect-video max-w-[1280px] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative mb-6", children: /* @__PURE__ */ jsxDEV(
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
          numberOfSharedAudioTags: 20,
          style: { width: "100%", height: "100%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 397,
          columnNumber: 19
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 396,
        columnNumber: 15
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-[1280px] flex justify-end mt-4", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => store.getState().setViewMode("live"),
          className: "px-6 py-3 bg-slate-800 text-white rounded hover:bg-slate-700 border border-slate-700 font-medium text-sm flex items-center space-x-2 shadow-lg transition-all",
          children: [
            /* @__PURE__ */ jsxDEV(Monitor, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 420,
              columnNumber: 23
            }),
            /* @__PURE__ */ jsxDEV("span", { children: "Back to Inbox" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 421,
              columnNumber: 23
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 416,
          columnNumber: 19
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 415,
        columnNumber: 15
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 395,
      columnNumber: 11
    });
  }
  return renderLive();
};
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 432,
  columnNumber: 13
}));
