import React from "react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { GradientCard } from "@/components/ui/gradient-card";
import { Scale, Users, Target, Award, Heart, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      description:
        "Former corporate lawyer with 15+ years experience in legal tech innovation.",
      icon: <Scale className="w-5 h-5 text-white" />,
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      description:
        "AI researcher and former Google engineer specializing in natural language processing.",
      icon: <Lightbulb className="w-5 h-5 text-white" />,
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Head of Legal Research",
      description:
        "Legal scholar and former law professor with expertise in corporate compliance.",
      icon: <Award className="w-5 h-5 text-white" />,
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We continuously push the boundaries of what's possible with AI in legal technology.",
      icon: <Lightbulb className="w-5 h-5 text-white" />,
    },
    {
      title: "Trust",
      description:
        "We build secure, reliable systems that legal professionals can depend on every day.",
      icon: <Heart className="w-5 h-5 text-white" />,
    },
    {
      title: "Excellence",
      description:
        "We strive for the highest standards in everything we do, from code to customer service.",
      icon: <Award className="w-5 h-5 text-white" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Veridic AI</h1>
                <p className="text-sm text-muted-foreground">
                  Your AI-powered legal assistant
                </p>
              </div>
            </div>
            <ButtonColorful label="Get Started" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Veridic AI
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to democratize legal expertise through artificial
            intelligence, making legal guidance accessible, reliable, and
            intelligent for everyone.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              Making corporate law compliance accessible, reliable, and
              intelligent. We believe that every business, regardless of size,
              should have access to world-class legal guidance powered by
              cutting-edge AI technology.
            </p>
            <p className="text-lg text-muted-foreground">
              By combining the expertise of legal professionals with the power
              of artificial intelligence, we're creating a future where legal
              compliance is not a barrier to innovation, but a catalyst for
              growth.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Vision</h2>
            <p className="text-lg text-muted-foreground">
              A world where businesses can innovate without compliance
              roadblocks. We envision a future where legal guidance is instant,
              accurate, and accessible to entrepreneurs and enterprises alike.
            </p>
            <p className="text-lg text-muted-foreground">
              Through continuous innovation and a deep understanding of legal
              challenges, we're building the next generation of legal technology
              that empowers rather than complicates.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <GradientCard
                key={index}
                title={value.title}
                description={value.description}
                icon={value.icon}
                linkText="Learn More"
                href={`#${value.title.toLowerCase()}`}
              />
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              The experts behind Veridic AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <GradientCard
                key={index}
                title={member.name}
                description={`${member.role}: ${member.description}`}
                icon={member.icon}
                linkText="View Profile"
                href={`#${member.name.toLowerCase().replace(" ", "-")}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">By the Numbers</h2>
            <p className="text-lg text-muted-foreground">
              Our impact in the legal technology space
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-muted-foreground">Documents Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                99.9%
              </div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                24/7
              </div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of the future of legal technology. Start your journey with
            Veridic AI today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonColorful label="Start Free Trial" />
            <ButtonColorful label="Contact Us" />
          </div>
        </div>
      </div>
    </div>
  );
}
