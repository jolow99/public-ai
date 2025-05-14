"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { supabase } from "../../supabase/supabase";
import { Check } from "lucide-react";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/login?redirect=pricing";
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  // Define features based on plan type
  const getFeaturesForPlan = (planName: string) => {
    if (planName && planName.toLowerCase().includes("free")) {
      return [
        "Access to basic AI models",
        "Limited message history",
        "Basic chat interface",
        "Standard response time",
      ];
    } else {
      return [
        "Access to all AI models",
        "Unlimited message history",
        "Priority response time",
        "Advanced features",
        "Premium support",
      ];
    }
  };

  const features = getFeaturesForPlan(item.name);

  return (
    <Card
      className={`w-[350px] relative overflow-hidden transition-transform duration-200 p-6
        ${item.popular 
          ? "border-2 border-[#ef243d] shadow-xl scale-105 !bg-white ring-2 ring-[#ef243d]/30 !text-gray-900" 
          : "border border-gray-200 !bg-gray-50 !text-gray-700"}
      `}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#ef243d]/10 via-white to-purple-50 opacity-30 pointer-events-none" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-[#ef243d] to-[#108171] rounded-full w-fit mb-4 shadow">
            Most Popular
          </div>
        )}
        <CardTitle className={`text-2xl font-bold tracking-tight ${item.popular ? "!text-[#ef243d]" : "!text-gray-900"}`}>
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2 !text-gray-900">
          <span className={`text-4xl font-bold ${item.popular ? "!text-[#ef243d]" : "!text-gray-900"}`}>
            ${item?.amount / 100}
          </span>
          <span className="!text-gray-600">/{item?.interval}</span>
        </CardDescription>
        {!item.popular && (
          <div className="mt-2 text-sm text-gray-600">
            Rate limiting and slower speeds apply.
          </div>
        )}
        {item.popular && (
          <div className="mt-2 text-sm text-[#108171] font-semibold">
            Less rate limiting and faster speeds.
          </div>
        )}
      </CardHeader>
      <CardContent className="!text-gray-900">
        <ul className="space-y-3 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="!text-gray-900">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="relative">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className={`w-full py-6 text-lg font-medium ${item.popular ? "bg-[#ef243d] hover:bg-[#d41e35] text-white" : "bg-[#108171] hover:bg-[#0a6a5c] text-white"}`}
        >
          {!item.name || item.name.toLowerCase().includes("free")
            ? "Get Started"
            : "Upgrade Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
