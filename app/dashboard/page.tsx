"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AIChat } from "@/components/dashboard/AIChat";
import {
  Upload,
  MessageSquare,
  FileText,
  Settings,
  Download,
  Search,
  Scale,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("chat");

  const documents = [
    { name: "Companies Act 1994.pdf", size: "2.3 MB", uploaded: "2 days ago" },
    {
      name: "Corporate Governance Guidelines.docx",
      size: "1.8 MB",
      uploaded: "1 week ago",
    },
    {
      name: "Board Meeting Minutes.pdf",
      size: "945 KB",
      uploaded: "2 weeks ago",
    },
  ];

  const recentQueries = [
    {
      question: "AGM requirements",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      question: "Board composition rules",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      question: "Financial reporting obligations",
      timestamp: "3 days ago",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Veridic AI Chat</h1>
                <p className="text-sm text-muted-foreground">
                  Your AI-powered legal assistant
                </p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Documents */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </h3>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.size} • {doc.uploaded}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>

              {/* Recent Queries */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Queries
                </h3>
                <div className="space-y-3">
                  {recentQueries.map((query, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">{query.question}</p>
                        <p className="text-xs text-muted-foreground">
                          {query.timestamp}
                        </p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b p-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={activeTab === "chat" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI Chat
                  </Button>
                  <Button
                    variant={activeTab === "search" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("search")}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Document Search
                  </Button>
                </div>
              </div>

              {/* Chat Component */}
              {activeTab === "chat" ? (
                <AIChat />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Document Search
                    </h3>
                    <p className="text-sm">
                      Search through your uploaded documents
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
