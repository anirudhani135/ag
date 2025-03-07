
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { AgentCard } from "@/components/marketplace/AgentCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { CategoryNav } from "@/components/marketplace/CategoryNav";
import { FilterSystem } from "@/components/marketplace/FilterSystem";
import { supabase } from "@/integrations/supabase/client";
import { useFeatureTour } from "@/components/feature-tours/FeatureTourProvider";
import { FeatureTourDisplay } from "@/components/feature-tours/FeatureTourDisplay";
import { Button } from "@/components/ui/button";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { startTour } = useFeatureTour();

  // Start the welcome tour when component mounts
  useEffect(() => {
    // Add marketplace-specific class for tour targeting
    const container = document.querySelector('.marketplace-container');
    if (container) {
      container.classList.add('marketplace-link');
    }
    
    // Wait for the page to load completely
    const timer = setTimeout(() => {
      startTour("welcome-tour");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [startTour]);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [{ id: 'all', name: 'All', icon: '🌟' }];
      }
      
      return [{ id: 'all', name: 'All', icon: '🌟' }, ...(data || [])];
    }
  });

  // Fetch agents with search and filters
  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents', searchQuery, selectedCategory, selectedFilters],
    queryFn: async () => {
      try {
        // Check if the table exists first
        const { error: tableError } = await supabase
          .from('agents')
          .select('id', { count: 'exact', head: true })
          .limit(1);
          
        // If the table doesn't exist or is empty, return sample data
        if (tableError) {
          console.log("Using sample agents data");
          return sampleAgents;
        }
        
        let query = supabase
          .from('agents')
          .select(`
            *,
            categories:category_id (name),
            developer:developer_id (name, avatar_url)
          `);

        if (searchQuery) {
          query = query.textSearch('search_vector', searchQuery);
        }

        if (selectedCategory !== 'all') {
          query = query.eq('category_id', selectedCategory);
        }

        if (selectedFilters.includes('verified')) {
          query = query.eq('status', 'verified');
        }

        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching agents:", error);
          return sampleAgents;
        }
        
        return data.length > 0 ? data : sampleAgents;
      } catch (error) {
        console.error("Error in agents query:", error);
        return sampleAgents;
      }
    }
  });

  const filterOptions = [
    { id: 'verified', label: 'Verified Agents' },
    { id: 'free', label: 'Free Agents' },
    { id: 'paid', label: 'Paid Agents' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 marketplace-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Marketplace</h2>
            <p className="text-muted-foreground">Discover and use AI agents from our community</p>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar onSearch={handleSearch} className="w-64" />
            <FilterSystem
              options={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          </div>
        </div>

        <CategoryNav
          categories={categories || []}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="flex justify-end">
          <Button
            onClick={() => startTour("welcome-tour")}
            variant="outline"
            size="sm"
          >
            Start Tour
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-[300px] animate-pulse" />
            ))}
          </div>
        ) : agents && agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                title={agent.title}
                description={agent.description}
                price={agent.price}
                category={agent.categories?.name || 'Uncategorized'}
                rating={agent.rating || 0}
                onView={() => {/* TODO: Implement agent details view */}}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No agents found matching your criteria.
            </p>
          </Card>
        )}
      </div>
      
      <FeatureTourDisplay />
    </DashboardLayout>
  );
};

// Sample data for when database is empty
const sampleAgents = [
  {
    id: '1',
    title: 'Content Writer',
    description: 'AI-powered content writer that can generate blog posts, articles, and more.',
    price: 0,
    categories: { name: 'Writing' },
    rating: 4.5,
    status: 'verified'
  },
  {
    id: '2',
    title: 'Data Analyzer',
    description: 'Analyze your datasets and generate insightful reports with visualizations.',
    price: 9.99,
    categories: { name: 'Analytics' },
    rating: 4.8,
    status: 'verified'
  },
  {
    id: '3',
    title: 'Customer Support Assistant',
    description: 'Handle customer inquiries and provide support 24/7.',
    price: 19.99,
    categories: { name: 'Support' },
    rating: 4.2,
    status: 'verified'
  },
  {
    id: '4',
    title: 'Code Review Helper',
    description: 'Review your code for bugs, security issues, and best practices.',
    price: 0,
    categories: { name: 'Development' },
    rating: 4.7,
    status: 'verified'
  },
  {
    id: '5',
    title: 'Email Marketing Assistant',
    description: 'Create and analyze email marketing campaigns to boost engagement.',
    price: 14.99,
    categories: { name: 'Marketing' },
    rating: 4.4,
    status: 'verified'
  },
  {
    id: '6',
    title: 'Legal Document Helper',
    description: 'Generate and review legal documents for your business needs.',
    price: 29.99,
    categories: { name: 'Legal' },
    rating: 4.6,
    status: 'verified'
  }
];

export default Marketplace;
