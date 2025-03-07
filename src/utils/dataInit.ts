
import { supabase } from "@/integrations/supabase/client";

export async function initSampleData() {
  console.log("Initializing sample data...");
  
  // Check if we already have api_metrics data
  const { count, error: countError } = await supabase
    .from('api_metrics')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error("Error checking api_metrics:", countError);
    return;
  }
  
  // Only insert if we don't have any data
  if (count === 0) {
    // Insert sample api_metrics
    const now = new Date();
    const timePoints = Array.from({ length: 24 }, (_, i) => {
      const timestamp = new Date(now);
      timestamp.setHours(now.getHours() - 23 + i);
      return timestamp.toISOString();
    });
    
    const apiMetrics = timePoints.map(timestamp => ({
      timestamp,
      response_time: Math.floor(Math.random() * 500) + 50,
      error_rate: Math.random() * 5,
      requests_per_minute: Math.floor(Math.random() * 120) + 5,
      requests_count: Math.floor(Math.random() * 100) + 10,
      status_code: 200,
      endpoint: '/api/data',
      request_method: 'GET',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0',
      error_details: null
    }));
    
    const { error: insertError } = await supabase
      .from('api_metrics')
      .insert(apiMetrics);
      
    if (insertError) {
      console.error("Error inserting api_metrics:", insertError);
    } else {
      console.log("Successfully inserted sample api_metrics");
    }
  }
  
  // Check if we have feature tours
  const { count: tourCount, error: tourCountError } = await supabase
    .from('feature_tours')
    .select('*', { count: 'exact', head: true });
    
  if (tourCountError) {
    console.error("Error checking feature_tours:", tourCountError);
    return;
  }
  
  // Only insert if we don't have any tours
  if (tourCount === 0) {
    const sampleTour = {
      title: "Welcome Tour",
      steps: [
        {
          target: ".dashboard-overview",
          title: "Dashboard Overview",
          content: "This is your main dashboard where you can see all your metrics at a glance.",
          placement: "bottom"
        },
        {
          target: ".analytics-section",
          title: "Analytics",
          content: "View detailed analytics about your API usage and performance.",
          placement: "right"
        },
        {
          target: ".marketplace-link",
          title: "Marketplace",
          content: "Explore and discover agents in our marketplace.",
          placement: "left"
        }
      ]
    };
    
    const { error: tourInsertError } = await supabase
      .from('feature_tours')
      .insert([sampleTour]);
      
    if (tourInsertError) {
      console.error("Error inserting feature tour:", tourInsertError);
    } else {
      console.log("Successfully inserted sample feature tour");
    }
  }
}
