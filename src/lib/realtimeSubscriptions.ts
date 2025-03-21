
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export const subscribeToHealthUpdates = (callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel('health-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'deployments'
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return channel;
};

export const subscribeToRevenue = (callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel('revenue-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'platform_metrics'
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return channel;
};

export const subscribeToAgentUpdates = (callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel('agent-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'agents'
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return channel;
};

export const subscribeToTransactions = (callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel('transaction-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions'
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return channel;
};

export const subscribeToUserNotifications = (userId: string, callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel(`user-notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return channel;
};
