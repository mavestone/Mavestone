"use client";

import React from "react";
import {
  Copy,
  Flag,
  MoreHorizontal,
  MoreVertical,
  Reply,
  Trash2,
  UserMinus2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ScrollArea } from "./scroll-area";
import { cn } from "../../lib/utils";

const DEMO_USER = {
  id: "user-123",
  name: "You",
  avatar: "https://api.dicebear.com/9.x/glass/svg?seed=you",
};

type StatusType = "online" | "dnd" | "offline";
const DEMO_OTHER = {
  id: "user-456",
  name: "Alice",
  avatar: "https://api.dicebear.com/9.x/glass/svg?seed=alice",
  status: "online" as StatusType,
};

const STATUS_COLORS: Record<StatusType, string> = {
  online: "bg-green-500",
  dnd: "bg-red-500",
  offline: "bg-gray-400",
};

function StatusBadge({ status }: { status: StatusType }) {
  return (
    <span
      aria-label={status}
      className={cn(
        "inline-block size-3 rounded-full border-2 border-background",
        STATUS_COLORS[status]
      )}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    />
  );
}

const DEMO_MESSAGES = [
  { id: 1, text: "Hey there! 👋", sender: DEMO_OTHER, time: "09:00" },
  { id: 2, text: "Hi Alice! How are you?", sender: DEMO_USER, time: "09:01" },
  {
    id: 3,
    text: "I'm good, thanks! Have you checked out hextaui.com?",
    sender: DEMO_OTHER,
    time: "09:02",
  },
  { id: 4, text: "Not yet! What is it?", sender: DEMO_USER, time: "09:03" },
  {
    id: 5,
    text: "It's a modern UI component library. Super easy to use!",
    sender: DEMO_OTHER,
    time: "09:04",
  },
  {
    id: 6,
    text: "That sounds cool. Does it have ready-made blocks?",
    sender: DEMO_USER,
    time: "09:05",
  },
  {
    id: 7,
    text: "Yes! Tons of blocks and beautiful primitives. You can just copy and paste.",
    sender: DEMO_OTHER,
    time: "09:06",
  },
  { id: 8, text: "Is it customizable?", sender: DEMO_USER, time: "09:07" },
  {
    id: 9,
    text: "Absolutely. You can theme everything with Tailwind and CSS variables.",
    sender: DEMO_OTHER,
    time: "09:08",
  },
  {
    id: 10,
    text: "Nice! Is there a CLI for installing components?",
    sender: DEMO_USER,
    time: "09:09",
  },
  {
    id: 11,
    text: "Yep, just run 'npx hextaui@latest add button' and you're set.",
    sender: DEMO_OTHER,
    time: "09:10",
  },
  {
    id: 12,
    text: "Thanks for the info! I'll try it out today.",
    sender: DEMO_USER,
    time: "09:11",
  },
  {
    id: 13,
    text: "Let me know if you need help. The docs are great too!",
    sender: DEMO_OTHER,
    time: "09:12",
  },
];

// Redesigned user actions block (for conversation - header)
function UserActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="User actions"
          className="border-muted-foreground/30"
          size="icon"
          type="button"
          variant="outline"
        >
          <MoreVertical
            aria-hidden="true"
            className="size-4"
            focusable="false"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-36 rounded-lg bg-popover p-1 shadow-xl">
        <div className="flex flex-col gap-1">
          <Button
            className="w-full justify-start gap-2 rounded bg-transparent text-rose-600 hover:bg-accent"
            size="sm"
            type="button"
            variant="ghost"
          >
            <UserMinus2
              aria-hidden="true"
              className="size-4"
              focusable="false"
            />
            <span className="font-medium text-xs">Block User</span>
          </Button>
          <Button
            className="w-full justify-start gap-2 rounded bg-transparent text-destructive hover:bg-accent"
            size="sm"
            type="button"
            variant="ghost"
          >
            <Trash2 aria-hidden="true" className="size-4" focusable="false" />
            <span className="font-medium text-xs">Delete Conversation</span>
          </Button>
          <Button
            className="w-full justify-start gap-2 rounded bg-transparent text-yellow-600 hover:bg-accent"
            size="sm"
            type="button"
            variant="ghost"
          >
            <Flag aria-hidden="true" className="size-4" focusable="false" />
            <span className="font-medium text-xs">Report User</span>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Redesigned message actions block (for single message, on hover)
function MessageActions({ isMe }: { isMe: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Message actions"
          className="size-7 rounded bg-background hover:bg-accent"
          size="icon"
          type="button"
          variant="ghost"
        >
          <MoreHorizontal
            aria-hidden="true"
            className="size-3.5"
            focusable="false"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-40 rounded-lg bg-popover p-1 shadow-xl"
      >
        <div className="flex flex-col gap-1">
          <Button
            aria-label="Reply"
            className="w-full justify-start gap-2 rounded px-2 py-1 text-xs"
            size="sm"
            type="button"
            variant="ghost"
          >
            <Reply aria-hidden="true" className="size-3" focusable="false" />
            <span>Reply</span>
          </Button>
          <Button
            aria-label="Copy"
            className="w-full justify-start gap-2 rounded px-2 py-1 text-xs"
            size="sm"
            type="button"
            variant="ghost"
          >
            <Copy aria-hidden="true" className="size-3" focusable="false" />
            <span>Copy</span>
          </Button>
          {isMe ? (
            <Button
              aria-label="Delete"
              className="w-full justify-start gap-2 rounded px-2 py-1 text-destructive text-xs"
              size="sm"
              type="button"
              variant="ghost"
            >
              <Trash2 aria-hidden="true" className="size-3" focusable="false" />
              <span>Delete</span>
            </Button>
          ) : null}
          <Button
            aria-label="Report"
            className="w-full justify-start gap-2 rounded px-2 py-1 text-xs text-yellow-600"
            size="sm"
            type="button"
            variant="ghost"
          >
            <Flag aria-hidden="true" className="size-3" focusable="false" />
            <span>Report</span>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MessageConversation({
  className,
  messages = DEMO_MESSAGES,
  otherUser = DEMO_OTHER,
  currentUser = DEMO_USER,
  onSendMessage,
}: {
  className?: string;
  messages?: any[];
  otherUser?: any;
  currentUser?: any;
  onSendMessage?: (text: string) => void;
}) {
  const [inputValue, setInputValue] = React.useState("");

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <Card
      className={cn(
        "mx-auto flex h-full min-h-0 w-full grow flex-col overflow-hidden shadow-none border-none bg-transparent",
        className
      )}
    >
      {/* Header */}
      <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 border-b border-white/5 bg-black/20 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-10 border border-white/10">
              <AvatarImage alt={otherUser.name} src={otherUser.avatar} />
              <AvatarFallback className="bg-white/5 text-white">{otherUser.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-white text-base">{otherUser.name}</div>
            <div className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-widest font-black">
              <StatusBadge status={otherUser.status} /> {otherUser.status}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserActionsMenu />
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="min-h-0 flex-1 p-0 bg-black/10">
        <ScrollArea
          aria-label="Conversation transcript"
          className="flex h-full max-h-full flex-col bg-transparent p-6"
          role="log"
        >
          {messages.map((msg) => {
            const isMe = msg.sender.id === currentUser.id;
            return (
              <div
                className={cn(
                  "group mb-6 flex gap-3",
                  isMe ? "justify-end" : "justify-start"
                )}
                key={msg.id}
              >
                <div
                  className={cn(
                    "flex max-w-[85%] items-start gap-3",
                    isMe ? "flex-row-reverse" : undefined
                  )}
                >
                  <Avatar className="size-8 border border-white/5">
                    <AvatarImage
                      alt={msg.sender.name}
                      src={msg.sender.avatar}
                    />
                    <AvatarFallback className="bg-white/5 text-[10px]">{msg.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        isMe
                          ? "bg-[#25D366] text-white rounded-tr-none shadow-lg shadow-[#25D366]/10"
                          : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <time
                        aria-label={`Sent at ${msg.time}`}
                        className="text-gray-600 text-[10px] font-medium"
                        dateTime={msg.time}
                      >
                        {msg.time}
                      </time>
                      <div className="opacity-0 transition-all group-hover:opacity-100">
                        <MessageActions isMe={isMe} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex gap-3 items-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-[#25D366]/50 transition-all resize-none min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-[#25D366] hover:bg-[#20bd5b] text-white rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#25D366]/20"
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
