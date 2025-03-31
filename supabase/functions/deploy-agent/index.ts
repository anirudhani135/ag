
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

    const { agentId, versionId, deploymentId, externalType, sourceUrl, apiKey } = await req.json()

    // Validate required fields
    if (!agentId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
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

    console.log(`Deploying agent ${agent.title} with type: ${externalType}`);

    // Update agent with proper marketplace status if needed
    if (agent.status !== 'active') {
      const { error: updateError } = await supabase
        .from('agents')
        .update({ 
          status: 'active',
          deployment_status: 'active'
        })
        .eq('id', agentId);
        
      if (updateError) {
        console.error('Error updating agent status:', updateError);
      } else {
        console.log('Updated agent status to active');
      }
    }

    // Add deployment logs
    await supabase
      .from('deployment_logs')
      .insert({
        deployment_id: deploymentId,
        status: 'deploying',
        message: `Starting deployment for ${externalType} agent: ${agent.title}`,
        metadata: {
          agent_id: agentId,
          version_id: versionId,
          external_type: externalType,
          timestamp: new Date().toISOString()
        }
      });

    // Initialize health monitoring
    await initializeHealthCheck(supabase, deploymentId, agentId);
    
    // Simulate deployment process
    simulateDeployment(supabase, deploymentId, agentId, externalType).catch(console.error);
    
    return new Response(
      JSON.stringify({ 
        message: 'Deployment initiated successfully',
        deploymentId,
        agent: {
          id: agentId,
          title: agent.title
        }
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
      'openai': {
        stages: [
          { progress: 30, message: "Validating OpenAI Assistant API access" },
          { progress: 50, message: "Configuring OpenAI integration" },
          { progress: 70, message: "Setting up authentication" },
          { progress: 90, message: "Testing OpenAI connectivity" },
          { progress: 100, message: "OpenAI integration complete" }
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
      'langchain': {
        stages: [
          { progress: 30, message: "Configuring LangChain integration" },
          { progress: 50, message: "Building chain components" },
          { progress: 70, message: "Setting up model providers" },
          { progress: 90, message: "Testing chain functionality" },
          { progress: 100, message: "LangChain integration complete" }
        ],
        duration: 1200 // ms between stages
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
    
    const deployment = deploymentTypes[deploymentType] || deploymentTypes['custom'];

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

    // Update agent status - ensure it's active and visible in marketplace
    await supabase
      .from('agents')
      .update({
        status: 'active',
        deployment_status: 'active'
      })
      .eq('id', agentId);

    // Create marketplace metrics for the agent if they don't exist
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
