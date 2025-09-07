"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAIChat, ChatMessage } from "@/hooks/useAIChat";
import {
  Send,
  RotateCcw,
  Download,
  Copy,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

interface AIChatProps {}

export function AIChat({}: AIChatProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  } = useAIChat({
    defaultProvider: "groq",
    useWebSearch: true,
    maxSearchResults: 3,
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    await sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const convertMarkdownToPlainText = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
      .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
      .replace(/#{1,6}\s/g, "") // Remove headers
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
      .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double
      .trim();
  };

  const exportChat = () => {
    const chatData = {
      exportDate: new Date().toISOString(),
      messages: messages.map((msg) => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp,
        sources: msg.sources,
        llmUsed: msg.llmUsed,
        processingTime: msg.processingTime,
      })),
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veridic-ai-chat-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b p-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">AI Legal Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Ask questions about company law, compliance, and governance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportChat}
              disabled={messages.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-sm">
              Ask me anything about legal compliance, corporate governance, or
              company law.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm whitespace-pre-wrap">
                    {convertMarkdownToPlainText(message.content)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0 opacity-70 hover:opacity-100"
                    onClick={() => copyToClipboard(message.content, message.id)}
                  >
                    {copiedMessageId === message.id ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                <div className="mt-2 text-xs opacity-70">
                  {message.timestamp}
                  {message.llmUsed && (
                    <span className="ml-2">• {message.llmUsed}</span>
                  )}
                  {message.processingTime && (
                    <span className="ml-2">
                      • {message.processingTime.toFixed(2)}s
                    </span>
                  )}
                </div>

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs font-medium mb-2">Sources:</p>
                    <ul className="text-xs space-y-1">
                      {message.sources.map((source, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-white/70 rounded-full mr-2" />
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Web Results */}
                {message.webResults && message.webResults.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs font-medium mb-2">Web Sources:</p>
                    <ul className="text-xs space-y-2">
                      {message.webResults.map((result, index) => (
                        <li key={index} className="flex items-start">
                          <ExternalLink className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {result.title}
                            </a>
                            <p className="text-xs opacity-70 mt-1 line-clamp-2">
                              {result.content}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-start">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-[80%]">
              <p className="text-sm text-destructive mb-2">Error: {error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={retryLastMessage}
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <RotateCcw className="w-3 h-3 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-card">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a legal question..."
            className="flex-1 min-h-[40px] max-h-32 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
