
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

interface LangFlowConfig {
  nodes: any[];
  edges: any[];
}

interface ExternalApiConfig {
  api_endpoint: string;
  api_key?: string;
  headers?: Record<string, string>;
}

interface CustomConfig {
  integration_type: string;
  config_json: Record<string, any>;
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

    const { agentId, config, deploymentType } = await req.json()

    // Validate required fields
    if (!agentId || !config) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    // Get agent information
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError) {
      console.error('Error fetching agent:', agentError);
      throw agentError;
    }

    console.log(`Deploying agent ${agent.title} with type: ${deploymentType}`);

    // Process based on deployment type
    let deploymentId;
    switch (deploymentType) {
      case 'api':
        deploymentId = await handleApiDeployment(supabase, agent, config, user.id);
        break;
      case 'langflow':
        deploymentId = await handleLangFlowDeployment(supabase, agent, config, user.id);
        break;
      case 'custom':
        deploymentId = await handleCustomDeployment(supabase, agent, config, user.id);
        break;
      default:
        deploymentId = await handleApiDeployment(supabase, agent, config, user.id);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Deployment initiated successfully',
        deploymentId
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

async function handleApiDeployment(supabase: any, agent: any, config: ExternalApiConfig, userId: string): Promise<string> {
  console.log('Starting API deployment process');
  
  // Validate API config
  if (!config.api_endpoint) {
    throw new Error('API endpoint is required for API deployments');
  }
  
  try {
    // Create new version record
    const { data: version, error: versionError } = await supabase
      .from('agent_versions')
      .insert({
        agent_id: agent.id,
        version_number: agent.version_number || '1.0.0',
        runtime_config: {
          integration_type: 'api',
          api_endpoint: config.api_endpoint,
          api_key: config.api_key || null,
          custom_headers: config.headers || {}
        },
        status: 'active'
      })
      .select()
      .single();
      
    if (versionError) throw versionError;
    
    // Create deployment record
    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .insert({
        agent_id: agent.id,
        version_id: version.id,
        status: 'deploying',
        environment: 'production',
        deployed_by: userId,
        metrics: {
          deployment_type: 'api',
          version_number: version.version_number,
          start_time: new Date().toISOString(),
          progress: 20
        },
        resource_usage: {
          cpu: '0.5',
          memory: '512',
          timeout: 30,
          scaling: {
            minReplicas: 1,
            maxReplicas: 3
          }
        }
      })
      .select()
      .single();
      
    if (deploymentError) throw deploymentError;
    
    // Log deployment
    await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: deployment.id,
        status: 'deploying',
        message: `Started API deployment for agent ${agent.title}`,
        metadata: {
          deployment_id: deployment.id,
          integration_type: 'api',
          api_endpoint: config.api_endpoint,
          timestamp: new Date().toISOString()
        }
      });
    
    // Initialize health monitoring
    await initializeHealthCheck(supabase, deployment.id, agent.id);
    
    // Simulate deployment process
    simulateDeployment(supabase, deployment.id, agent.id, 'api').catch(console.error);
    
    return deployment.id;
  } catch (error) {
    console.error('API deployment error:', error);
    throw error;
  }
}

async function handleLangFlowDeployment(supabase: any, agent: any, config: LangFlowConfig, userId: string): Promise<string> {
  console.log('Starting LangFlow deployment process');
  
  // Validate LangFlow config
  if (!config.nodes || !config.edges) {
    throw new Error('Valid LangFlow configuration with nodes and edges is required');
  }
  
  try {
    // Create new version record with LangFlow config
    const { data: version, error: versionError } = await supabase
      .from('agent_versions')
      .insert({
        agent_id: agent.id,
        version_number: agent.version_number || '1.0.0',
        runtime_config: {
          integration_type: 'langflow',
          langflow_config: {
            nodes: config.nodes,
            edges: config.edges
          }
        },
        status: 'active'
      })
      .select()
      .single();
      
    if (versionError) throw versionError;
    
    // Create deployment record
    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .insert({
        agent_id: agent.id,
        version_id: version.id,
        status: 'deploying',
        environment: 'production',
        deployed_by: userId,
        metrics: {
          deployment_type: 'langflow',
          version_number: version.version_number,
          start_time: new Date().toISOString(),
          progress: 20
        },
        resource_usage: {
          cpu: '1.0',  // LangFlow may need more resources
          memory: '1024',
          timeout: 60,
          scaling: {
            minReplicas: 1,
            maxReplicas: 5
          }
        }
      })
      .select()
      .single();
      
    if (deploymentError) throw deploymentError;
    
    // Log deployment
    await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: deployment.id,
        status: 'deploying',
        message: `Started LangFlow deployment for agent ${agent.title}`,
        metadata: {
          deployment_id: deployment.id,
          integration_type: 'langflow',
          node_count: config.nodes.length,
          edge_count: config.edges.length,
          timestamp: new Date().toISOString()
        }
      });
    
    // Initialize health monitoring
    await initializeHealthCheck(supabase, deployment.id, agent.id);
    
    // Simulate deployment process
    simulateDeployment(supabase, deployment.id, agent.id, 'langflow').catch(console.error);
    
    return deployment.id;
  } catch (error) {
    console.error('LangFlow deployment error:', error);
    throw error;
  }
}

async function handleCustomDeployment(supabase: any, agent: any, config: CustomConfig, userId: string): Promise<string> {
  console.log('Starting custom deployment process');
  
  try {
    // Create new version record with custom config
    const { data: version, error: versionError } = await supabase
      .from('agent_versions')
      .insert({
        agent_id: agent.id,
        version_number: agent.version_number || '1.0.0',
        runtime_config: {
          integration_type: 'custom',
          configuration: config.config_json || {}
        },
        status: 'active'
      })
      .select()
      .single();
      
    if (versionError) throw versionError;
    
    // Create deployment record
    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .insert({
        agent_id: agent.id,
        version_id: version.id,
        status: 'deploying',
        environment: 'production',
        deployed_by: userId,
        metrics: {
          deployment_type: 'custom',
          version_number: version.version_number,
          start_time: new Date().toISOString(),
          progress: 20
        },
        resource_usage: {
          cpu: '1.0',
          memory: '1024',
          timeout: 60,
          scaling: {
            minReplicas: 1,
            maxReplicas: 5
          }
        }
      })
      .select()
      .single();
      
    if (deploymentError) throw deploymentError;
    
    // Log deployment
    await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: deployment.id,
        status: 'deploying',
        message: `Started custom deployment for agent ${agent.title}`,
        metadata: {
          deployment_id: deployment.id,
          integration_type: 'custom',
          timestamp: new Date().toISOString()
        }
      });
    
    // Initialize health monitoring
    await initializeHealthCheck(supabase, deployment.id, agent.id);
    
    // Simulate deployment process
    simulateDeployment(supabase, deployment.id, agent.id, 'custom').catch(console.error);
    
    return deployment.id;
  } catch (error) {
    console.error('Custom deployment error:', error);
    throw error;
  }
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
async function simulateDeployment(supabase: any, deploymentId: string, agentId: string, deploymentType: string) {
  try {
    const deploymentTypes = {
      'api': {
        stages: [
          { progress: 30, message: "Validating API endpoint" },
          { progress: 50, message: "Configuring API integration" },
          { progress: 70, message: "Setting up authentication" },
          { progress: 90, message: "Testing API connectivity" },
          { progress: 100, message: "API integration complete" }
        ],
        duration: 1000 // ms between stages
      },
      'langflow': {
        stages: [
          { progress: 30, message: "Parsing LangFlow configuration" },
          { progress: 50, message: "Building agent components" },
          { progress: 70, message: "Initializing language models" },
          { progress: 85, message: "Connecting flow components" },
          { progress: 95, message: "Testing agent functionality" },
          { progress: 100, message: "LangFlow deployment complete" }
        ],
        duration: 1500 // ms between stages (longer for complexity)
      },
      'custom': {
        stages: [
          { progress: 30, message: "Analyzing custom configuration" },
          { progress: 50, message: "Setting up custom environment" },
          { progress: 70, message: "Building integration adapters" },
          { progress: 90, message: "Running validation tests" },
          { progress: 100, message: "Custom deployment complete" }
        ],
        duration: 1200 // ms between stages
      }
    };
    
    const deployment = deploymentTypes[deploymentType] || deploymentTypes['api'];

    for (const stage of deployment.stages) {
      // Wait between stages
      await new Promise(r => setTimeout(r, deployment.duration + Math.random() * 500));
      
      // Update deployment with progress
      await supabase
        .from('deployments')
        .update({
          metrics: {
            progress: stage.progress,
            current_stage: stage.message,
            deployment_type: deploymentType,
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
          metadata: { 
            progress: stage.progress,
            deployment_type: deploymentType
          }
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
          status: 'successful',
          deployment_type: deploymentType
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
    console.error(`Error in ${deploymentType} deployment simulation:`, error);
    
    // Update deployment with error
    await supabase
      .from('deployments')
      .update({
        status: 'failed',
        metrics: {
          error: error.message,
          failure_time: new Date().toISOString(),
          deployment_type: deploymentType
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
        metadata: { 
          error: error.message,
          deployment_type: deploymentType
        }
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
