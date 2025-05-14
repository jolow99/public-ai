"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ThumbsUp, ThumbsDown, Paperclip, Send, Trash } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  timestamp: string;
  feedback?: "positive" | "negative" | null;
};

type ChatProps = {
  userId: string;
};

export default function ChatInterface({ userId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const models = [
    { id: "gpt-4", name: "OpenAI GPT-4" },
    { id: "claude-3", name: "Anthropic Claude 3" },
    { id: "sea-lion", name: "SEA-LION" },
    { id: "olmo-2", name: "OLMo 2" },
  ];

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data as Message[]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !fileContent) return;

    const userContent = fileContent
      ? `${input}\n\nFile Content:\n${fileContent}`
      : input;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setFile(null);
    setFileContent(null);
    setIsLoading(true);

    try {
      // Save user message to database
      await supabase.from("chat_messages").insert({
        id: userMessage.id,
        user_id: userId,
        role: userMessage.role,
        content: userMessage.content,
        model: selectedModel,
        timestamp: userMessage.timestamp,
      });

      // Call API to get response based on selected model
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userContent,
          model: selectedModel,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI model");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        model: selectedModel,
        timestamp: new Date().toISOString(),
        feedback: null,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database
      await supabase.from("chat_messages").insert({
        id: assistantMessage.id,
        user_id: userId,
        role: assistantMessage.role,
        content: assistantMessage.content,
        model: selectedModel,
        timestamp: assistantMessage.timestamp,
        feedback: null,
      });
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (
    messageId: string,
    feedback: "positive" | "negative",
  ) => {
    try {
      // Update message in state
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)),
      );

      // Update message in database
      await supabase
        .from("chat_messages")
        .update({ feedback })
        .eq("id", messageId);
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check if file is .txt or .pdf
      if (
        selectedFile.type === "text/plain" ||
        selectedFile.type === "application/pdf"
      ) {
        setFile(selectedFile);

        // Read file content
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            let content = event.target.result.toString();

            // If PDF, we would need to extract text
            // For simplicity, we're just showing the raw content or would need a PDF.js integration
            if (selectedFile.type === "application/pdf") {
              content =
                "[PDF content extracted - in a real implementation, we would use PDF.js to extract text]";
            }

            setFileContent(content);
          }
        };

        if (selectedFile.type === "text/plain") {
          reader.readAsText(selectedFile);
        } else {
          // For PDF we'd use PDF.js in a real implementation
          reader.readAsText(selectedFile); // Simplified for demo
        }
      } else {
        alert("Please upload only .txt or .pdf files");
      }
    }
  };

  const clearChat = async () => {
    if (
      confirm(
        "Are you sure you want to clear the chat history? This cannot be undone.",
      )
    ) {
      try {
        // Delete all messages for this user from the database
        await supabase.from("chat_messages").delete().eq("user_id", userId);

        // Clear messages from state
        setMessages([]);
      } catch (error) {
        console.error("Error clearing chat history:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">AI Chat</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={clearChat}
            title="Clear chat history"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.role === "assistant" && (
                  <div className="flex items-center justify-end mt-2 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-6 w-6 ${message.feedback === "positive" ? "text-green-500" : ""}`}
                      onClick={() => handleFeedback(message.id, "positive")}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-6 w-6 ${message.feedback === "negative" ? "text-red-500" : ""}`}
                      onClick={() => handleFeedback(message.id, "negative")}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {message.model}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* File attachment display */}
      {file && (
        <div className="px-4 py-2 bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFile(null);
              setFileContent(null);
            }}
          >
            Remove
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.pdf"
              className="hidden"
            />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || (!input.trim() && !fileContent)}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
