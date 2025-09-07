import { useState, useCallback } from "react";
import { apiService, QuestionRequest, QuestionResponse } from "@/lib/api";

export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  sources?: string[];
  webResults?: Array<{
    title: string;
    url: string;
    content: string;
    relevance_score: number;
  }>;
  processingTime?: number;
  llmUsed?: string;
}

export interface UseAIChatOptions {
  defaultProvider?: "openai" | "groq" | "gemini";
  useWebSearch?: boolean;
  maxSearchResults?: number;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string, customOptions?: Partial<UseAIChatOptions>) => {
      if (!content.trim()) return;

      const mergedOptions = { ...options, ...customOptions };

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: content.trim(),
        timestamp: new Date().toLocaleString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const request: QuestionRequest = {
          question: content.trim(),
          llm_provider: mergedOptions.defaultProvider || "groq",
          use_web_search: mergedOptions.useWebSearch || false,
          max_search_results: mergedOptions.maxSearchResults || 3,
        };

        const response: QuestionResponse = await apiService.askQuestion(
          request
        );

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: response.answer,
          timestamp: new Date().toLocaleString(),
          sources: response.sources_used,
          webResults: response.web_search_results,
          processingTime: response.processing_time,
          llmUsed: response.llm_used,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);

        const errorAIMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: `I apologize, but I encountered an error: ${errorMessage}. Please try again or contact support if the issue persists.`,
          timestamp: new Date().toLocaleString(),
        };

        setMessages((prev) => [...prev, errorAIMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (messages.length === 0) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.type === "user");
    if (!lastUserMessage) return;

    // Remove the last AI message (if it was an error)
    setMessages((prev) => prev.slice(0, -1));

    // Retry the last user message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  };
}
