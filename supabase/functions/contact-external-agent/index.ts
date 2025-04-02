
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
      throw new Error("Server configuration error: Missing environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body = await req.json();
    const { agentId, message } = body;
    
    if (!agentId || !message) {
      console.error("Missing required fields in request", { agentId, messagePreview: message?.substring(0, 30) });
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          details: 'agentId and message are required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log(`Processing request for agent ${agentId}: "${message.substring(0, 50)}..."`);

    // Get agent API endpoint and key
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('api_endpoint, api_key, title')
      .eq('id', agentId)
      .maybeSingle();
      
    if (agentError || !agent) {
      console.error("Error fetching agent:", agentError || "Agent not found");
      return new Response(
        JSON.stringify({ 
          error: 'Agent not found', 
          details: agentError?.message || "Could not find the specified agent" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404 
        }
      );
    }
    
    if (!agent.api_endpoint) {
      return new Response(
        JSON.stringify({ 
          error: 'Agent configuration error', 
          details: "Agent API endpoint is missing" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    console.log(`Contacting external agent at: ${agent.api_endpoint}`);
    
    // Contact the external API with timeout and error handling
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header if API key exists
      if (agent.api_key) {
        headers['Authorization'] = `Bearer ${agent.api_key}`;
      }
      
      const response = await fetch(agent.api_endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message: message,
          max_tokens: 1000,
          prompt: message // Some APIs use prompt instead of message
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Read response as text first to debug any issues
      const responseText = await response.text();
      console.log(`Raw response from external agent: ${responseText.substring(0, 200)}...`);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        responseData = { text: responseText }; // Fallback to raw text
      }
      
      if (!response.ok) {
        throw new Error(`External API error: ${response.status} ${response.statusText}`);
      }
      
      console.log("Successfully received response from external agent");
      
      // Log the interaction
      await supabase.from('agent_logs').insert({
        agent_id: agentId,
        log_type: 'interaction',
        message: message,
        metadata: { response: responseData }
      });
      
      // Handle different response formats from various APIs
      let formattedResponse;
      if (typeof responseData === 'string') {
        formattedResponse = { text: responseData };
      } else if (responseData.output) {
        formattedResponse = { text: responseData.output };
      } else if (responseData.response) {
        formattedResponse = { text: responseData.response };
      } else if (responseData.answer) {
        formattedResponse = { text: responseData.answer };
      } else if (responseData.text) {
        formattedResponse = { text: responseData.text };
      } else if (responseData.message) {
        formattedResponse = { text: responseData.message };
      } else if (responseData.content) {
        formattedResponse = { text: responseData.content };
      } else if (responseData.choices && responseData.choices[0]) {
        // OpenAI-like format
        const choice = responseData.choices[0];
        formattedResponse = { 
          text: choice.text || (choice.message ? choice.message.content : JSON.stringify(choice)) 
        };
      } else {
        // If we can't determine the format, send the whole response
        formattedResponse = { 
          text: `Response from ${agent.title}: ${JSON.stringify(responseData)}` 
        };
      }
      
      return new Response(
        JSON.stringify(formattedResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      
      return new Response(
        JSON.stringify({
          error: 'External API communication error',
          details: fetchError.message || 'Failed to contact external agent'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }
    
  } catch (error) {
    console.error('Error contacting external agent:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Agent communication failed', 
        details: error.message || 'Unknown error occurred' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
