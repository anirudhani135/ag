
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

    const { agentId, apiEndpoint, apiKey } = await req.json()

    console.log(`Deploying external agent with ID: ${agentId}`);

    // Update agent status
    const { error: updateError } = await supabase
      .from('agents')
      .update({ 
        status: 'live',
        deployment_status: 'active',
        api_endpoint: apiEndpoint,
        api_key: apiKey
      })
      .eq('id', agentId);
      
    if (updateError) {
      console.error('Error updating agent:', updateError);
      throw updateError;
    }
    
    // Add to marketplace metrics
    const { data: existingMetrics } = await supabase
      .from('agent_metrics')
      .select('id')
      .eq('agent_id', agentId)
      .maybeSingle();
      
    if (!existingMetrics) {
      await supabase.from('agent_metrics')
        .insert({
          agent_id: agentId,
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
        status: 'active'
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
