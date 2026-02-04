"use client";

import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { ButlerProvider } from "@/providers/tambo-providers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  ArrowLeft,
  Dumbbell,
  Utensils,
  Activity,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

function ButlerChat() {
  const { thread, generationStage, isIdle } = useTamboThread();
  const { value, setValue, submit, isPending, error } = useTamboThreadInput();
  
  // All messages (no filtering since we removed initialMessages)
  const messages = thread?.messages ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isPending) return;
    
    try {
      await submit({ streamResponse: true });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickActions = [
    { label: "Log exercise", prompt: "I just did 3 sets of bench press at 60kg", icon: Dumbbell },
    { label: "Log meal", prompt: "For lunch I had grilled chicken with rice", icon: Utensils },
    { label: "Today's progress", prompt: "How am I doing today?", icon: Activity },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-green-100">
            <AvatarFallback className="bg-green-100 text-green-700">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold">FitLog Butler</h1>
            <p className="text-xs text-muted-foreground">
              Quick logging & tracking
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {isIdle ? "Ready" : generationStage}
        </Badge>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error sending message</p>
            <p className="text-xs text-red-600">{error.message}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-medium mb-2">Hey there! I&apos;m FitLog</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I help you track your workouts and meals quickly. Just tell me what you did
              and I&apos;ll log it for you!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setValue(action.prompt)}
                  className="gap-2"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 bg-green-100 shrink-0">
                <AvatarFallback className="bg-green-100 text-green-700">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-2"
                  : ""
              }`}
            >
              {/* Text content */}
              {Array.isArray(message.content) ? (
                message.content.map((part, i) =>
                  part.type === "text" ? (
                    <p key={i} className="whitespace-pre-wrap">
                      {part.text}
                    </p>
                  ) : null
                )
              ) : (
                <p className="whitespace-pre-wrap">{String(message.content)}</p>
              )}

              {/* Rendered component from Tambo */}
              {message.renderedComponent && (
                <div className="mt-3">{message.renderedComponent}</div>
              )}
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8 bg-primary shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isPending && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 bg-green-100 shrink-0">
              <AvatarFallback className="bg-green-100 text-green-700">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex gap-1">
                <span className="animate-bounce delay-0">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me what you did... (e.g., 'I did 3 sets of bench press at 60kg')"
            className="min-h-[60px] resize-none"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="h-[60px] w-[60px]"
            disabled={isPending || !value.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Try: &quot;I did squats 4×10 at 80kg&quot; or &quot;I ate chicken salad for lunch&quot;
        </p>
      </div>
    </div>
  );
}

export default function ButlerPage() {
  return (
    <ButlerProvider>
      <ButlerChat />
    </ButlerProvider>
  );
}
