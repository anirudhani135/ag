// Mock data for categories
export const CATEGORIES_MOCK = [
  {
    id: "cat-1",
    name: "Customer Support",
    icon: "headset",
    description: "AI agents that can handle customer inquiries and support tickets"
  },
  {
    id: "cat-2",
    name: "Data Analysis",
    icon: "bar-chart",
    description: "Agents specialized in analyzing and visualizing data"
  },
  {
    id: "cat-3",
    name: "Content Creation",
    icon: "pen-tool",
    description: "AI tools for generating and optimizing content"
  },
  {
    id: "cat-4",
    name: "Development",
    icon: "code",
    description: "Coding assistants and development helpers"
  },
  {
    id: "cat-5",
    name: "Productivity",
    icon: "clock",
    description: "Tools to boost your personal and team productivity"
  }
];

// Mock data for agents
export const AGENTS_MOCK = [
  {
    id: "agent-1",
    title: "Customer Support Pro",
    description: "An AI agent designed to handle customer support inquiries 24/7. Capable of understanding context, managing multiple languages, and escalating complex issues to human operators when needed.",
    price: 29.99,
    categories: { name: "Customer Support" },
    rating: 4.7,
    features: ["24/7 availability", "Multi-language support", "Context awareness", "Sentiment analysis"],
    status: "published",
    developer_id: "dev-1",
    version: "2.1.0",
    created_at: "2023-09-15T14:23:00Z",
    updated_at: "2023-11-10T09:15:00Z"
  },
  {
    id: "agent-2",
    title: "Data Insights Engine",
    description: "Transform your raw data into actionable insights with this powerful data analysis agent. Features advanced visualization capabilities and automated report generation.",
    price: 49.99,
    categories: { name: "Data Analysis" },
    rating: 4.5,
    features: ["Data visualization", "Report generation", "Pattern recognition", "Anomaly detection"],
    status: "published",
    developer_id: "dev-2",
    version: "1.5.2",
    created_at: "2023-08-05T10:30:00Z",
    updated_at: "2023-10-20T16:45:00Z"
  },
  {
    id: "agent-3",
    title: "Content Creator",
    description: "Generate high-quality, SEO-optimized content for your blog, social media, or marketing campaigns. Includes tools for tone adjustment, keyword optimization, and content planning.",
    price: 34.99,
    categories: { name: "Content Creation" },
    rating: 4.3,
    features: ["SEO optimization", "Tone customization", "Multi-format output", "Content calendar"],
    status: "published",
    developer_id: "dev-3",
    version: "3.0.1",
    created_at: "2023-07-12T08:20:00Z",
    updated_at: "2023-12-01T11:10:00Z"
  },
  {
    id: "agent-4",
    title: "Code Assistant Pro",
    description: "Boost your development workflow with AI-powered code suggestions, bug detection, and automated documentation. Supports multiple programming languages and frameworks.",
    price: 59.99,
    categories: { name: "Development" },
    rating: 4.8,
    features: ["Code completion", "Bug detection", "Documentation generation", "Multi-language support"],
    status: "published",
    developer_id: "dev-4",
    version: "2.3.0",
    created_at: "2023-06-18T15:40:00Z",
    updated_at: "2023-11-25T09:30:00Z"
  },
  {
    id: "agent-5",
    title: "Meeting Assistant",
    description: "Never miss important details in your meetings again. This agent transcribes discussions, extracts action items, and helps you stay organized with intelligent summaries.",
    price: 19.99,
    categories: { name: "Productivity" },
    rating: 4.6,
    features: ["Meeting transcription", "Action item extraction", "Summary generation", "Calendar integration"],
    status: "published",
    developer_id: "dev-5",
    version: "1.2.1",
    created_at: "2023-09-30T11:15:00Z",
    updated_at: "2023-12-10T14:25:00Z"
  },
  {
    id: "agent-6",
    title: "Email Marketing Expert",
    description: "Craft engaging email campaigns with this specialized marketing agent. Features include template creation, A/B testing suggestions, and performance analytics.",
    price: 39.99,
    categories: { name: "Content Creation" },
    rating: 4.4,
    features: ["Email templates", "A/B testing", "Performance analytics", "Audience segmentation"],
    status: "published",
    developer_id: "dev-6",
    version: "2.0.0",
    created_at: "2023-08-22T09:50:00Z",
    updated_at: "2023-11-15T10:20:00Z"
  }
];

/**
 * Initialize sample data for development purposes
 * This function sets up mock data in localStorage or other client-side storage
 * to simulate a database during development
 */
export const initSampleData = async (): Promise<void> => {
  try {
    // Store categories in localStorage if not already present
    if (!localStorage.getItem('categories')) {
      localStorage.setItem('categories', JSON.stringify(CATEGORIES_MOCK));
    }
    
    // Store agents in localStorage if not already present
    if (!localStorage.getItem('agents')) {
      localStorage.setItem('agents', JSON.stringify(AGENTS_MOCK));
    }
    
    console.log('Sample data initialized successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
    return Promise.reject(error);
  }
};
