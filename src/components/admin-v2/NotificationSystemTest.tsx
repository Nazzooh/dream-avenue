import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "./Button";
import { toast } from "sonner";
import { Bell, Radio, Activity } from "lucide-react";

export function NotificationSystemTest() {
  const [listenerActive, setListenerActive] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  // Unique test channel
  const CHANNEL = "dreamavenue_notifications_test";

  // Activate realtime listener
  const activateListener = async () => {
    setListenerActive(true);

    const channel = supabase.channel(CHANNEL);

    channel.on(
      "broadcast",
      { event: "notify" },
      (payload) => {
        const receivedAt = performance.now();
        const sentAt = payload.payload?.sentAt;

        if (sentAt) {
          setLatency(receivedAt - sentAt);
        }

        setLastMessage(JSON.stringify(payload.payload, null, 2));
        toast.success("Realtime notification received!");
      }
    );

    channel.subscribe();
  };

  // Send test notification via Supabase Broadcast
  const sendBroadcastTest = async () => {
    const sentAt = performance.now();

    await supabase.channel(CHANNEL).send({
      type: "broadcast",
      event: "notify",
      payload: {
        message: "Test notification broadcast from admin panel",
        sentAt
      },
    });

    toast("Broadcast sent (awaiting listener…) 🔔");
  };

  // Trigger toast test
  const sendToastTest = () => {
    toast.success("Test success toast!");
    toast.warning("Test warning toast!");
    toast.error("Test error toast!");
  };

  return (
    <div className="space-y-8">

      {/* SECTION: Realtime Listener */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Radio size={18} /> Realtime Listener
        </h2>
        <p className="text-gray-600 mt-1">
          Tests whether your Supabase broadcast system is working.
        </p>

        {!listenerActive ? (
          <Button className="mt-4" onClick={activateListener}>
            Activate Listener
          </Button>
        ) : (
          <p className="mt-4 text-green-600 font-medium">
            Listener active ✓
          </p>
        )}

        {lastMessage && (
          <div className="mt-4 bg-gray-100 p-3 rounded text-sm font-mono">
            <pre>{lastMessage}</pre>
          </div>
        )}

        {latency !== null && (
          <p className="text-sm mt-2 text-blue-600 font-medium">
            Latency: {latency.toFixed(2)} ms
          </p>
        )}
      </Card>

      {/* SECTION: Test Broadcast */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell size={18} /> Notification Broadcast Test
        </h2>
        <p className="text-gray-600 mt-1">
          Sends a realtime Supabase broadcast event.
        </p>

        <Button className="mt-4" onClick={sendBroadcastTest}>
          Send Broadcast Test
        </Button>
      </Card>

      {/* SECTION: Toast Test */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Activity size={18} /> Frontend Toast Test
        </h2>
        <p className="text-gray-600 mt-1">
          Shows sample toast notifications used across the admin dashboard.
        </p>

        <Button className="mt-4" onClick={sendToastTest}>
          Trigger Toast Tests
        </Button>
      </Card>
    </div>
  );
}
