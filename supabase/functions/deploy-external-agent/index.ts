
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
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body = await req.json();
    const { agentId, apiEndpoint, apiKey, title, description } = body;

    console.log("Processing deployment request:", { title, apiEndpoint });
    
    if (!apiEndpoint || !title) {
      throw new Error("Missing required fields: title and API endpoint are required");
    }

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
        
      if (error) {
        console.error("Database error updating agent:", error);
        throw error;
      }
      agent = data;
    } else {
      console.log('Creating new external agent');
      
      // Create new agent
      const { data, error } = await supabase
        .from('agents')
        .insert({
          title: title,
          description: description || `External AI agent: ${title}`,
          status: 'live',
          deployment_status: 'active',
          price: 0,
          developer_id: DEMO_USER_ID,
          api_endpoint: apiEndpoint,
          api_key: apiKey,
          rating: 5,
          category_id: 1  // Default category
        })
        .select('id')
        .single();
        
      if (error) {
        console.error("Database error creating agent:", error);
        throw error;
      }
      agent = data;
    }
    
    if (!agent?.id) {
      throw new Error("Failed to create or update agent");
    }
    
    console.log("Agent deployed successfully with ID:", agent.id);
    
    // Add to marketplace metrics
    const { data: existingMetrics, error: metricsError } = await supabase
      .from('agent_metrics')
      .select('id')
      .eq('agent_id', agent.id)
      .maybeSingle();
      
    if (metricsError) {
      console.warn("Error checking for existing metrics:", metricsError);
    }
    
    if (!existingMetrics) {
      const { error: insertError } = await supabase.from('agent_metrics')
        .insert({
          agent_id: agent.id,
          views: 0,
          unique_views: 0,
          purchases: 0,
          revenue: 0,
          date: new Date().toISOString().split('T')[0]
        });
        
      if (insertError) {
        console.warn("Error inserting metrics:", insertError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Agent deployed successfully',
        status: 'active',
        agentId: agent.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in deployment process:', error);
    
    // Return a proper error response
    return new Response(
      JSON.stringify({ error: 'Deployment failed', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
