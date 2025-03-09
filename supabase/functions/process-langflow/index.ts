
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LangflowConfig {
  nodes: Array<{
    id: string;
    data: Record<string, any>;
    type: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
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

    const { agentId, config } = await req.json()

    // Validate required fields
    if (!agentId || !config) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate the Langflow configuration
    if (!validateLangflowConfig(config)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Langflow configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    // Get current agent version number
    const versionNumber = await generateVersionNumber(supabase, agentId);
    console.log(`Generated version number: ${versionNumber}`);

    // Create a new version for the agent
    const { data: versionData, error: versionError } = await supabase
      .from('agent_versions')
      .insert({
        agent_id: agentId,
        version_number: versionNumber,
        runtime_config: config,
        status: 'pending',
        created_by: user?.id
      })
      .select()
      .single()

    if (versionError) {
      console.error('Error creating version:', versionError)
      throw versionError
    }

    console.log(`Created agent version with ID: ${versionData.id}`);

    // Update agent configuration
    const { error: configError } = await supabase
      .from('agent_configurations')
      .upsert({
        agent_id: agentId,
        version_id: versionData.id,
        runtime_config: config,
        updated_at: new Date().toISOString()
      })

    if (configError) {
      console.error('Error updating configuration:', configError)
      throw configError
    }

    // Create deployment log
    const { error: logError } = await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: versionData.id,
        status: 'processing',
        metadata: {
          nodes_count: config.nodes.length,
          edges_count: config.edges.length,
          version_number: versionNumber,
          timestamp: new Date().toISOString()
        },
        message: `Started processing Langflow configuration with ${config.nodes.length} nodes and ${config.edges.length} edges`
      })

    if (logError) {
      console.error('Error creating deployment log:', logError)
      throw logError
    }

    return new Response(
      JSON.stringify({ 
        message: 'Configuration processed successfully',
        versionId: versionData.id,
        versionNumber
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing Langflow configuration:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process configuration', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function validateLangflowConfig(config: LangflowConfig): boolean {
  // Basic validation of Langflow JSON structure
  if (!config || !Array.isArray(config.nodes) || !Array.isArray(config.edges)) {
    return false
  }

  // Validate nodes
  const validNodes = config.nodes.every(node => 
    node.id && 
    typeof node.id === 'string' &&
    node.type &&
    typeof node.type === 'string' &&
    node.data &&
    typeof node.data === 'object'
  )

  if (!validNodes) return false

  // Validate edges
  const validEdges = config.edges.every(edge =>
    edge.source &&
    typeof edge.source === 'string' &&
    edge.target &&
    typeof edge.target === 'string'
  )

  if (!validEdges) return false

  // Validate node connections
  const nodeIds = new Set(config.nodes.map(node => node.id))
  const validConnections = config.edges.every(edge =>
    nodeIds.has(edge.source) && nodeIds.has(edge.target)
  )

  return validConnections
}

async function generateVersionNumber(supabase: any, agentId: string): Promise<string> {
  try {
    const { data: versions, error } = await supabase
      .from('agent_versions')
      .select('version_number')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) throw error;

    if (!versions || versions.length === 0) {
      return '1.0.0'
    }

    const lastVersion = versions[0].version_number
    const [major, minor, patch] = lastVersion.split('.').map(Number)
    return `${major}.${minor}.${patch + 1}`
  } catch (error) {
    console.error('Error generating version number:', error);
    return '1.0.0'; // Default if we can't get previous version
  }
}
