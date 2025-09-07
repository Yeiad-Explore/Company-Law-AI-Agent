import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { GradientCard } from "@/components/ui/gradient-card";
import { AnimatedGroup } from "@/components/ui/animated-group";
import {
  Rocket,
  Building2,
  Scale,
  Shield,
  Users,
  FileText,
  BarChart3,
  Clock,
  Search,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  const solutions = [
    {
      icon: Rocket,
      title: "For Startups",
      subtitle: "Incorporation & compliance made simple",
      description:
        "Navigate the complex world of business formation and early-stage compliance with AI-powered guidance tailored for startups.",
      features: [
        "Company incorporation guidance",
        "Early-stage compliance requirements",
        "Funding round legal preparation",
        "Intellectual property protection",
        "Regulatory compliance monitoring",
      ],
      benefits: [
        "Save weeks of legal research",
        "Reduce compliance costs by 60%",
        "Avoid costly legal mistakes",
        "Focus on building your product",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Building2,
      title: "For Enterprises",
      subtitle: "Governance monitoring & risk reduction",
      description:
        "Maintain comprehensive compliance across multiple jurisdictions with enterprise-grade legal AI that scales with your business.",
      features: [
        "Multi-jurisdiction compliance",
        "Board governance monitoring",
        "Risk assessment and mitigation",
        "Regulatory change tracking",
        "Audit trail management",
      ],
      benefits: [
        "Reduce legal risk exposure",
        "Improve governance efficiency",
        "Ensure regulatory compliance",
        "Streamline audit processes",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Scale,
      title: "For Law Firms",
      subtitle: "Faster legal research & drafting",
      description:
        "Enhance your legal practice with AI-powered research and document analysis that accelerates case preparation and client service.",
      features: [
        "Legal research acceleration",
        "Document analysis and review",
        "Case law research",
        "Client communication tools",
        "Billing and time tracking",
      ],
      benefits: [
        "Increase billable hours efficiency",
        "Improve research accuracy",
        "Faster case preparation",
        "Enhanced client satisfaction",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "For Compliance Officers",
      subtitle: "Alerts, reporting, and accountability",
      description:
        "Stay ahead of regulatory changes with proactive compliance monitoring and comprehensive reporting tools designed for compliance professionals.",
      features: [
        "Regulatory change alerts",
        "Compliance reporting automation",
        "Risk assessment tools",
        "Audit preparation assistance",
        "Training and certification tracking",
      ],
      benefits: [
        "Proactive compliance management",
        "Automated reporting workflows",
        "Reduced manual oversight",
        "Enhanced accountability",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Solutions for Every Business
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Tailored legal AI solutions designed for your specific industry and
            business needs
          </p>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            },
            item: {
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-card border rounded-xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-xl flex items-center justify-center mb-6`}
              >
                <solution.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-2">{solution.title}</h3>
              <p className="text-lg text-primary font-medium mb-4">
                {solution.subtitle}
              </p>
              <p className="text-muted-foreground mb-8">
                {solution.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Benefits
                  </h4>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <Button asChild className="w-full">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
          ))}
        </AnimatedGroup>
      </div>

      {/* AI-Powered Features Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Features</h2>
            <p className="text-lg text-muted-foreground">
              Discover our cutting-edge AI capabilities that make legal work
              faster and more accurate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <GradientCard
              title="Intelligent Document Analysis"
              description="AI-powered analysis of legal documents with instant insights, risk assessment, and actionable recommendations."
              icon={<FileText className="w-5 h-5 text-white" />}
              linkText="Learn More"
              href="#document-analysis"
            />

            <GradientCard
              title="Advanced Legal Research"
              description="Comprehensive legal research powered by AI with real-time updates, case law analysis, and citation tracking."
              icon={<Search className="w-5 h-5 text-white" />}
              linkText="Explore Research"
              href="#legal-research"
            />

            <GradientCard
              title="Lightning Fast Results"
              description="Get instant answers to complex legal questions in seconds, not hours. Our AI processes information at unprecedented speed."
              icon={<Zap className="w-5 h-5 text-white" />}
              linkText="See Speed"
              href="#performance"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Not Sure Which Solution is Right for You?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team can help you choose the perfect solution for your business
            needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonColorful label="Contact Sales" />
            <ButtonColorful label="Schedule Demo" />
          </div>
        </div>
      </div>
    </div>
  );
}
