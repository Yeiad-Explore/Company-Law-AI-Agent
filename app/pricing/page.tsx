import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Check, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "৳2,500",
      period: "/month",
      description:
        "Perfect for small businesses and startups getting started with legal compliance",
      features: [
        "Up to 10 document uploads",
        "Basic AI legal queries",
        "Email support",
        "Standard response time",
        "Basic compliance reports",
      ],
      limitations: [
        "No web search integration",
        "Limited export options",
        "Basic company profiles",
      ],
      popular: false,
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      price: "৳8,500",
      period: "/month",
      description:
        "Ideal for growing businesses that need advanced legal AI capabilities",
      features: [
        "Unlimited document uploads",
        "Multi-model AI queries",
        "Web search integration",
        "Priority support",
        "Advanced compliance reports",
        "Export to PDF/DOCX",
        "Company profile customization",
        "API access",
      ],
      limitations: [],
      popular: true,
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "৳25,000",
      period: "/month",
      description:
        "Tailored solutions for large organizations with complex compliance needs",
      features: [
        "Everything in Professional",
        "Team collaboration tools",
        "Custom integrations",
        "Dedicated account manager",
        "Custom AI model training",
        "Advanced analytics",
        "SSO integration",
        "Custom compliance workflows",
        "24/7 phone support",
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales",
    },
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, all plans come with a 14-day free trial. No credit card required to get started.",
    },
    {
      question: "What happens to my data if I cancel?",
      answer:
        "Your data is safely stored for 30 days after cancellation. You can export all your documents and conversations during this period.",
    },
    {
      question: "Do you offer custom pricing?",
      answer:
        "Yes, we offer custom pricing for Enterprise plans and large organizations. Contact our sales team to discuss your specific needs.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include our
            core AI legal assistance features.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card border rounded-xl p-8 ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-muted-foreground mb-3">
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <li key={limitationIndex} className="flex items-start">
                          <X className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button
                asChild
                className={`w-full ${
                  plan.popular ? "bg-primary hover:bg-primary/90" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/dashboard"}
                >
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </AnimatedGroup>
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of businesses already using Veridic AI for their
            legal compliance needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonColorful label="Start Free Trial" />
            <ButtonColorful label="Contact Sales" />
          </div>
        </div>
      </div>
    </div>
  );
}
