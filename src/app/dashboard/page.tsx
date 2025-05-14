import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { InfoIcon, UserCircle, MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import ChatInterface from "@/components/chat-interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to Public AI Utility Co - your trustworthy alternative
                to privately-owned AI systems
              </span>
            </div>
          </header>

          {/* Tabs for Dashboard Content */}
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <ChatInterface userId={user.id} />
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              {/* User Profile Section */}
              <section className="bg-card rounded-xl p-6 border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <UserCircle size={48} className="text-primary" />
                  <div>
                    <h2 className="font-semibold text-xl">User Profile</h2>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
                  <pre className="text-xs font-mono max-h-48 overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
