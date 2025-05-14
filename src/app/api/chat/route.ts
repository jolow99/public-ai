import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, model, userId } = await request.json();

    if (!message || !model || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user has an active subscription for premium models
    const supabase = await createClient();
    let isPremiumModel = ["gpt-4", "claude-3"].includes(model);

    if (isPremiumModel) {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (!subscription) {
        return NextResponse.json(
          { error: "Premium subscription required for this model" },
          { status: 403 },
        );
      }
    }

    // Process the message based on the selected model
    let aiResponse = "";

    switch (model) {
      case "gpt-4":
        // In a real implementation, you would call the OpenAI API here
        aiResponse = await mockOpenAIResponse(message);
        break;
      case "claude-3":
        // In a real implementation, you would call the Anthropic API here
        aiResponse = await mockClaudeResponse(message);
        break;
      case "sea-lion":
        // In a real implementation, you would call the SEA-LION API here
        aiResponse = await mockSeaLionResponse(message);
        break;
      case "olmo-2":
        // In a real implementation, you would call the OLMo API here
        aiResponse = await mockOlmoResponse(message);
        break;
      default:
        aiResponse = "I'm not sure how to respond to that.";
    }

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

// Mock API responses for demonstration purposes
async function mockOpenAIResponse(message: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `[GPT-4] I've processed your request: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}"\n\nHere's my response as GPT-4. In a real implementation, this would be the actual response from the OpenAI API.`;
}

async function mockClaudeResponse(message: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `[Claude] I've analyzed your message: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}"\n\nHere's my response as Claude. In a real implementation, this would be the actual response from the Anthropic API.`;
}

async function mockSeaLionResponse(message: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return `[SEA-LION] Processing input: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}"\n\nHere's my response as SEA-LION. In a real implementation, this would be the actual response from the SEA-LION API.`;
}

async function mockOlmoResponse(message: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return `[OLMo] Analyzing your query: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}"\n\nHere's my response as OLMo 2. In a real implementation, this would be the actual response from the OLMo API.`;
}
