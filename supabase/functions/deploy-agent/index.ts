
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeploymentConfig {
  environment: string;
  deployment_type?: string;
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

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    // Get agent version information
    const { data: versionData, error: versionError } = await supabase
      .from('agent_versions')
      .select('version_number, runtime_config')
      .eq('id', versionId)
      .single();

    if (versionError) {
      console.error('Error fetching version:', versionError);
      throw versionError;
    }

    console.log(`Deploying version ${versionData.version_number} for agent ${agentId}`);

    // Create deployment record
    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .insert({
        agent_id: agentId,
        version_id: versionId,
        status: 'deploying',
        environment: config.environment,
        deployed_by: user?.id,
        metrics: {
          deployment_type: config.deployment_type || 'native',
          version_number: versionData.version_number,
          start_time: new Date().toISOString(),
          progress: 20
        },
        resource_usage: {
          cpu: config.resources.cpu,
          memory: config.resources.memory,
          timeout: config.resources.timeout,
          scaling: config.scaling
        }
      })
      .select()
      .single()

    if (deploymentError) {
      console.error('Error creating deployment:', deploymentError)
      throw deploymentError
    }

    console.log(`Created deployment with ID: ${deployment.id}`);

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

    // Create log entry
    await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: deployment.id,
        status: 'deploying',
        message: `Started deployment of agent version ${versionData.version_number} to ${config.environment}`,
        metadata: {
          deployment_id: deployment.id,
          config: config,
          timestamp: new Date().toISOString()
        }
      });

    // Initialize health check monitoring
    await initializeHealthCheck(supabase, deployment.id, agentId);

    // Start the deployment process
    await simulateDeployment(supabase, deployment.id, agentId);

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
      JSON.stringify({ error: 'Deployment process failed', details: error.message }),
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

async function initializeHealthCheck(supabase: any, deploymentId: string, agentId: string) {
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

    // Simulated health metrics
    const initialMetrics = {
      response_time: 0,
      error_rate: 0,
      uptime_percentage: 100,
      last_health_check: new Date().toISOString()
    }

    // Update monitoring metrics
    await supabase
      .from('monitoring_metrics')
      .insert({
        agent_id: agentId,
        metrics: {
          deployment_id: deploymentId,
          health: initialMetrics,
          initial_health_check: new Date().toISOString()
        }
      })

  } catch (error) {
    console.error('Error initializing health check:', error)
    throw error
  }
}

// Simulate a deployment process with progress updates
async function simulateDeployment(supabase: any, deploymentId: string, agentId: string) {
  try {
    // This would be replaced with actual deployment logic in production
    const stages = [
      { progress: 30, message: "Preparing runtime environment" },
      { progress: 50, message: "Configuring agent resources" },
      { progress: 70, message: "Starting agent services" },
      { progress: 90, message: "Running final health checks" },
      { progress: 100, message: "Deployment complete" }
    ];

    for (const stage of stages) {
      // Wait 1-2 seconds between stages to simulate work
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
      
      // Update deployment with progress
      await supabase
        .from('deployments')
        .update({
          metrics: {
            progress: stage.progress,
            current_stage: stage.message,
            last_update: new Date().toISOString()
          }
        })
        .eq('id', deploymentId);

      // Log the progress
      await supabase
        .from('deployment_logs')
        .insert({
          deployment_id: deploymentId,
          status: stage.progress === 100 ? 'complete' : 'in_progress',
          message: stage.message,
          metadata: { progress: stage.progress }
        });
    }

    // Final update when deployment is complete
    await supabase
      .from('deployments')
      .update({
        status: 'running',
        metrics: {
          progress: 100,
          completion_time: new Date().toISOString(),
          status: 'successful'
        },
        error_rate: Math.random() * 2, // Simulated initial error rate
        response_time: 100 + Math.random() * 200 // Simulated initial response time
      })
      .eq('id', deploymentId);

    // Update agent status
    await supabase
      .from('agents')
      .update({
        deployment_status: 'active'
      })
      .eq('id', agentId);

  } catch (error) {
    console.error('Error in deployment simulation:', error);
    
    // Update deployment with error
    await supabase
      .from('deployments')
      .update({
        status: 'failed',
        metrics: {
          error: error.message,
          failure_time: new Date().toISOString()
        }
      })
      .eq('id', deploymentId);
    
    // Log the error
    await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: deploymentId,
        status: 'failed',
        message: `Deployment failed: ${error.message}`,
        metadata: { error: error.message }
      });
    
    // Update agent status
    await supabase
      .from('agents')
      .update({
        deployment_status: 'failed'
      })
      .eq('id', agentId);
  }
}
