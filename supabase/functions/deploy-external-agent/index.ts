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

    // Parse request body
    const { agentId, apiEndpoint, apiKey, title, description } = await req.json()

    // Using a demo developer ID for simplified deployment
    const DEMO_USER_ID = "d394384a-8eb4-4f49-8cce-ba2d0784e3b4";
    
    // If agentId is provided, update existing agent
    // Otherwise, create a new agent
    let agent;
    if (agentId) {
      console.log(`Updating external agent with ID: ${agentId}`);
      
      const { data, error } = await supabase
        .from('agents')
        .update({ 
          status: 'live',
          deployment_status: 'active',
          api_endpoint: apiEndpoint,
          api_key: apiKey
        })
        .eq('id', agentId)
        .select('id')
        .single();
        
      if (error) throw error;
      agent = data;
    } else {
      console.log('Creating new external agent');
      
      // Create new agent
      const { data, error } = await supabase
        .from('agents')
        .insert({
          title: title,
          description: description,
          status: 'live',
          deployment_status: 'active',
          price: 0,
          developer_id: DEMO_USER_ID,
          api_endpoint: apiEndpoint,
          api_key: apiKey
        })
        .select('id')
        .single();
        
      if (error) throw error;
      agent = data;
    }
    
    if (!agent?.id) {
      throw new Error("Failed to create or update agent");
    }
    
    // Add to marketplace metrics
    const { data: existingMetrics } = await supabase
      .from('agent_metrics')
      .select('id')
      .eq('agent_id', agent.id)
      .maybeSingle();
      
    if (!existingMetrics) {
      await supabase.from('agent_metrics')
        .insert({
          agent_id: agent.id,
          views: 0,
          unique_views: 0,
          purchases: 0,
          revenue: 0,
          date: new Date().toISOString().split('T')[0]
        });
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Agent deployed successfully',
        status: 'active',
        agentId: agent.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in deployment process:', error)
    return new Response(
      JSON.stringify({ error: 'Deployment failed', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
