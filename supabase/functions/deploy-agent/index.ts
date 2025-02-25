
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeploymentConfig {
  environment: string;
  resources: {
    cpu: string;
    memory: string;
    timeout: number;
  };
  scaling: {
    minReplicas: number;
    maxReplicas: number;
  };
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

    const { agentId, versionId, config } = await req.json()

    // Validate required fields
    if (!agentId || !versionId || !config) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate configuration
    if (!validateDeploymentConfig(config)) {
      return new Response(
        JSON.stringify({ error: 'Invalid deployment configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create deployment record
    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .insert({
        agent_id: agentId,
        version_id: versionId,
        status: 'deploying',
        metrics: {},
        resource_usage: config.resources
      })
      .select()
      .single()

    if (deploymentError) {
      console.error('Error creating deployment:', deploymentError)
      throw deploymentError
    }

    // Update agent status
    const { error: agentError } = await supabase
      .from('agents')
      .update({
        deployment_status: 'deploying',
        current_version_id: versionId
      })
      .eq('id', agentId)

    if (agentError) {
      console.error('Error updating agent:', agentError)
      throw agentError
    }

    // Initialize monitoring metrics
    await supabase
      .from('monitoring_metrics')
      .insert({
        agent_id: agentId,
        metrics: {
          deployment_id: deployment.id,
          config: config,
          initial_health_check: new Date().toISOString()
        }
      })

    // Start health check monitoring (simulated for now)
    await initializeHealthCheck(supabase, deployment.id)

    return new Response(
      JSON.stringify({ 
        message: 'Deployment initiated successfully',
        deploymentId: deployment.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in deployment process:', error)
    return new Response(
      JSON.stringify({ error: 'Deployment process failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function validateDeploymentConfig(config: DeploymentConfig): boolean {
  // Basic validation of required fields
  if (!config.environment || !config.resources || !config.scaling) {
    return false
  }

  // Validate resource constraints
  if (!config.resources.cpu || !config.resources.memory || !config.resources.timeout) {
    return false
  }

  // Validate scaling configuration
  if (
    typeof config.scaling.minReplicas !== 'number' ||
    typeof config.scaling.maxReplicas !== 'number' ||
    config.scaling.minReplicas < 0 ||
    config.scaling.maxReplicas < config.scaling.minReplicas
  ) {
    return false
  }

  return true
}

async function initializeHealthCheck(supabase: any, deploymentId: string) {
  try {
    // Create initial health check record
    await supabase
      .from('health_incidents')
      .insert({
        deployment_id: deploymentId,
        incident_type: 'deployment_health_check',
        severity: 'info',
        description: 'Initial deployment health check started',
      })

    // Simulated health metrics (replace with actual monitoring integration)
    const initialMetrics = {
      response_time: 0,
      error_rate: 0,
      uptime_percentage: 100,
      last_health_check: new Date().toISOString()
    }

    // Update deployment with initial metrics
    await supabase
      .from('deployments')
      .update({
        metrics: initialMetrics,
        status: 'running',
        health_status: 'healthy'
      })
      .eq('id', deploymentId)

  } catch (error) {
    console.error('Error initializing health check:', error)
    throw error
  }
}
