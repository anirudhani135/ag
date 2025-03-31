
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

    const { agentId, versionId, deploymentId, externalType, sourceUrl, apiKey } = await req.json()

    console.log(`Deploying agent with ID: ${agentId}, type: ${externalType}`);

    // Update agent to use valid status values
    const { error: updateError } = await supabase
      .from('agents')
      .update({ 
        status: 'live', // Use 'live' instead of 'active' for the status
        deployment_status: 'active'
      })
      .eq('id', agentId);
      
    if (updateError) {
      console.error('Error updating agent status:', updateError);
      // Continue with deployment anyway
    } else {
      console.log('Updated agent status to live');
    }

    // Add deployment logs
    await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: deploymentId,
        status: 'deploying',
        message: `Deploying external agent with endpoint: ${sourceUrl}`,
        metadata: {
          agent_id: agentId,
          version_id: versionId,
          external_type: externalType,
          timestamp: new Date().toISOString()
        }
      });
    
    // Update deployment record to running immediately
    await supabase
      .from('deployments')
      .update({
        status: 'running',
        metrics: {
          progress: 100,
          completion_time: new Date().toISOString(),
          status: 'successful',
          deployment_type: externalType
        }
      })
      .eq('id', deploymentId);

    // Create marketplace metrics for the agent
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
        deploymentId,
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
