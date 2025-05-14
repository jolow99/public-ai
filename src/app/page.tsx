import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  Shield,
  Database,
  ThumbsUp,
  Zap,
  Users,
  Code,
  Layers,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Audience Personas Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Public AI for Everyone</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In the long run, people will choose technology based on their
              politics. Choose AI that aligns with your values.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Everyday Users */}
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-[#ef243d] mb-4">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                All the best public AI models, in one place.
              </h3>
              <p className="text-gray-600 mb-6">
                Use AI that acts in your best interest. With Public AI Utility
                Co, you get a fast, private, and ethical alternative to
                ChatGPT—powered by the best open models like SEA-LION, OLMo2,
                and LLaMA.
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center text-[#ef243d] font-medium hover:text-[#d41e35]"
              >
                Try the chat now
                <ArrowUpRight className="ml-1 w-4 h-4" />
              </a>
            </div>

            {/* AI App Developers */}
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-[#ef243d] mb-4">
                <Code className="w-10 h-10" />
              </div>
              <div className="inline-block px-3 py-1 text-xs font-medium text-[#ef243d] bg-red-50 rounded-full mb-2">
                Coming Soon
              </div>
              <h3 className="text-xl font-semibold mb-3">
                A unified API for open models you can trust.
              </h3>
              <p className="text-gray-600 mb-6">
                Build your product on a more transparent and affordable
                foundation. Access the best open-source LLMs from one
                endpoint—with clear terms and lower prices than the incumbents.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-[#ef243d] font-medium hover:text-[#d41e35]"
              >
                Join the developer waitlist
                <ArrowUpRight className="ml-1 w-4 h-4" />
              </a>
            </div>

            {/* Model Developers */}
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-[#ef243d] mb-4">
                <Layers className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Help make open models better—for everyone.
              </h3>
              <p className="text-gray-600 mb-6">
                Opt in to receive anonymized feedback and usage data from real
                users to improve your models. Join a community of public AI labs
                building the future together.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-[#ef243d] font-medium hover:text-[#d41e35]"
              >
                Partner with us
                <ArrowUpRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              AI Chat Platform Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access multiple AI models in one place with a clean, intuitive
              interface designed for productivity and privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Multiple AI Models",
                description:
                  "Chat with OpenAI, Claude, SEA-LION, and OLMo2 models",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Data Privacy",
                description: "Full control over your conversation data",
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Chat History",
                description: "Access and manage your past conversations",
              },
              {
                icon: <ThumbsUp className="w-6 h-6" />,
                title: "Feedback System",
                description: "Rate responses to improve your experience",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-[#ef243d] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#ef243d] text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">4+</div>
              <div className="text-white">AI Models Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$4.99</div>
              <div className="text-white">Monthly Premium Plan</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white">Data Control</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start with our free plan or upgrade to premium for additional
              features and models.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Free tier card */}
            <PricingCard
              item={{
                id: "free-tier",
                name: "Free",
                amount: 0,
                interval: "month",
                popular: false,
              }}
              user={user}
            />
            {/* Subscription plans from Stripe */}
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join the Public AI Movement Today
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            When you choose Public AI Utility Co, you're not just using
            AI—you're supporting a movement to build AI for the public good.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-[#ef243d] rounded-lg hover:bg-[#d41e35] transition-colors"
          >
            Start Chatting Free
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
