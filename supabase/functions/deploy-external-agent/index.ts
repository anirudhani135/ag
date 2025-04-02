
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
      console.error("Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error', 
          details: 'Missing environment variables' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body = await req.json();
    const { agentId, apiEndpoint, apiKey, title, description } = body;

    console.log("Processing deployment request:", { title, apiEndpoint });
    
    if (!apiEndpoint || !title) {
      console.error("Missing required fields in request:", { title, apiEndpoint });
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          details: 'Title and API endpoint are required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Validate API endpoint format
    let validatedEndpoint = apiEndpoint;
    if (!validatedEndpoint.startsWith('http')) {
      validatedEndpoint = `https://${validatedEndpoint}`;
    }

    try {
      // Validate URL format
      new URL(validatedEndpoint);
    } catch (e) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API endpoint', 
          details: 'The API endpoint URL format is invalid' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Test the API endpoint with a simple request to verify it's reachable
    try {
      const testResponse = await fetch(validatedEndpoint, {
        method: 'HEAD',
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      console.log(`API endpoint test status: ${testResponse.status}`);
      
      // We don't fail if the HEAD request doesn't work - some APIs might not support it
      // This is just for logging purposes
    } catch (apiError) {
      // Log but don't fail - endpoint might still work for POST requests
      console.warn(`Warning: Could not connect to API endpoint: ${apiError.message}`);
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
          api_endpoint: validatedEndpoint,
          api_key: apiKey
        })
        .eq('id', agentId)
        .select('id')
        .single();
        
      if (error) {
        console.error("Database error updating agent:", error);
        return new Response(
          JSON.stringify({ 
            error: 'Database error updating agent',
            details: error.message
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          }
        );
      }
      agent = data;
    } else {
      console.log('Creating new external agent');
      
      // First, get a valid category ID from the database
      const { data: categories, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (categoryError) {
        console.error("Error getting category:", categoryError);
        // Continue with null category_id, which should still work if the column allows nulls
      }
      
      const categoryId = categories && categories.length > 0 ? categories[0].id : null;
      console.log(`Using category_id: ${categoryId}`);
      
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
          api_endpoint: validatedEndpoint,
          api_key: apiKey,
          rating: 5,
          category_id: categoryId  // Using the fetched category ID or null
        })
        .select('id')
        .single();
        
      if (error) {
        console.error("Database error creating agent:", error);
        return new Response(
          JSON.stringify({ 
            error: 'Database error creating agent',
            details: error.message
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          }
        );
      }
      agent = data;
    }
    
    if (!agent?.id) {
      return new Response(
        JSON.stringify({ 
          error: 'Agent creation failed',
          details: 'No agent ID returned from database'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
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
      JSON.stringify({ 
        error: 'Deployment failed', 
        details: error.message || 'Unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
