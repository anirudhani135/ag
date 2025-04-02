
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { agentId, message } = await req.json()

    // Get agent API endpoint and key
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('api_endpoint, api_key')
      .eq('id', agentId)
      .single();
      
    if (agentError) throw agentError;
    
    if (!agent.api_endpoint || !agent.api_key) {
      throw new Error("Agent API configuration is incomplete");
    }
    
    // Contact the external API
    const response = await fetch(agent.api_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${agent.api_key}`
      },
      body: JSON.stringify({ 
        message: message,
        max_tokens: 1000 
      })
    });
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Log the interaction
    await supabase.from('agent_logs').insert({
      agent_id: agentId,
      log_type: 'interaction',
      message: message,
      metadata: { response: data }
    });
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error contacting external agent:', error)
    return new Response(
      JSON.stringify({ error: 'Agent communication failed', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
