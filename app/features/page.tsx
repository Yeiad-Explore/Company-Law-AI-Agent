import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import {
  Scale,
  FileText,
  Search,
  Building2,
  Shield,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      icon: Scale,
      title: "Multi-Model Legal Reasoning",
      description:
        "Advanced AI models provide comprehensive legal analysis with multiple reasoning approaches for maximum accuracy.",
      details: [
        "OpenAI GPT-4 for complex legal analysis",
        "Groq for ultra-fast responses",
        "Google Gemini for advanced reasoning",
        "Context-aware legal interpretation",
      ],
    },
    {
      icon: FileText,
      title: "Intelligent Document Analysis",
      description:
        "Upload and analyze legal documents with AI precision. Supports PDF, DOCX, and text files.",
      details: [
        "PDF document processing",
        "Word document analysis",
        "Text file parsing",
        "Smart content extraction",
      ],
    },
    {
      icon: Search,
      title: "Smart Compliance Search",
      description:
        "Find relevant legal information instantly with semantic search across your document library.",
      details: [
        "Semantic document search",
        "Real-time web search integration",
        "Context-aware results",
        "Source attribution and citations",
      ],
    },
    {
      icon: Building2,
      title: "Company-Specific Guidance",
      description:
        "Get tailored legal advice based on your company's industry, jurisdiction, and business type.",
      details: [
        "Industry-specific compliance",
        "Jurisdiction-aware guidance",
        "Company type customization",
        "Personalized legal recommendations",
      ],
    },
    {
      icon: Shield,
      title: "Real-Time Compliance Dashboard",
      description:
        "Monitor your compliance status with real-time updates and automated alerts.",
      details: [
        "Compliance status tracking",
        "Automated deadline alerts",
        "Risk assessment reports",
        "Regulatory change notifications",
      ],
    },
    {
      icon: Zap,
      title: "Export & Reporting Capabilities",
      description:
        "Generate comprehensive reports and export legal analysis in multiple formats.",
      details: [
        "PDF report generation",
        "DOCX document export",
        "Conversation history export",
        "Compliance audit trails",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful Features for Legal Excellence
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover how Veridic AI's advanced capabilities can transform your
            legal compliance workflow
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            },
            item: {
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li
                    key={detailIndex}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AnimatedGroup>
      </div>

      {/* CTA Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your free trial today and see how Veridic AI can transform
            your legal workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
