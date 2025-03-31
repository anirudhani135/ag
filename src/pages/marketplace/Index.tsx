import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AgentCard } from '@/components/marketplace/AgentCard';
import { AgentDetailsModal } from '@/components/marketplace/AgentDetailsModal';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { CategoryNav } from '@/components/marketplace/CategoryNav';
import { FilterSystem } from '@/components/marketplace/FilterSystem';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { CATEGORIES_MOCK, AGENTS_MOCK } from '@/utils/dataInit';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  icon?: string;
  created_at?: string;
  description?: string;
}

interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: {
    name: string;
  };
  rating: number;
  status: string;
}

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // If no categories in the database, return mock data
        if (!data?.length) {
          console.log('No categories found, using mock data');
          return CATEGORIES_MOCK;
        }
        
        return data as Category[];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return CATEGORIES_MOCK;
      }
    },
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    staleTime: 1000 * 60 * 5, // 5 minutes before refetch
  });

  const buildAgentQuery = () => {
    let query = supabase
      .from('agents')
      .select(`
        id,
        title,
        description,
        price,
        rating,
        status,
        categories:category_id (name)
      `)
      .eq('status', 'active');
    
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }
    
    if (selectedPriceRange) {
      query = query
        .gte('price', selectedPriceRange[0])
        .lte('price', selectedPriceRange[1]);
    }
    
    if (selectedRating) {
      query = query.gte('rating', selectedRating);
    }
    
    // Add sorting
    if (sortOrder === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortOrder === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (sortOrder === 'price-high') {
      query = query.order('price', { ascending: false });
    } else if (sortOrder === 'rating') {
      query = query.order('rating', { ascending: false });
    }
    
    return query;
  };

  const { data: agents = [], isLoading: isLoadingAgents } = useQuery({
    queryKey: ['marketplace-agents', selectedCategory, selectedPriceRange, selectedRating, sortOrder],
    queryFn: async () => {
      try {
        const query = buildAgentQuery();
        const { data, error } = await query;
        
        if (error) throw error;
        
        // If no agents in the database, return mock data
        if (!data?.length) {
          console.log('No agents found, using mock data');
          return AGENTS_MOCK;
        }
        
        return data as Agent[];
      } catch (error) {
        console.error('Error fetching agents:', error);
        return AGENTS_MOCK;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes before refetch
  });

  // Filter agents based on search query
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return agents.filter(
      agent => 
        agent.title.toLowerCase().includes(normalizedQuery) || 
        agent.description.toLowerCase().includes(normalizedQuery)
    );
  }, [agents, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handlePriceChange = (range: [number, number]) => {
    setSelectedPriceRange(range);
  };

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const handleAgentClick = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  const handleCloseModal = () => {
    setSelectedAgentId(null);
  };

  const handleHire = (agentId: string) => {
    // Here we would typically create a transaction or deploy the agent
    navigate(`/agent/${agentId}/dashboard`);
    toast({
      title: "Agent Hired",
      description: "The agent has been added to your collection.",
    });
  };

  const selectedAgent = selectedAgentId 
    ? agents.find(agent => agent.id === selectedAgentId) || null
    : null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">AI Agent Marketplace</h1>
        <p className="text-muted-foreground">
          Discover, hire, and deploy AI agents created by our developer community
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar/Filters (mobile collapsible, desktop fixed) */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Categories</h3>
            {isLoadingCategories ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <CategoryNav 
                categories={categories} 
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />
            )}
          </div>
          
          <FilterSystem
            selectedPriceRange={selectedPriceRange}
            onPriceChange={handlePriceChange}
            selectedRating={selectedRating}
            onRatingChange={handleRatingChange}
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <SearchBar onSearch={handleSearch} />
            
            <div className="w-full sm:w-auto flex-shrink-0">
              <Select value={sortOrder} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoadingAgents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h3 className="text-lg font-medium">No agents found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setSelectedPriceRange([0, 1000]);
                  setSelectedRating(null);
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={() => handleAgentClick(agent.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAgent && (
        <AgentDetailsModal
          agent={selectedAgent}
          isOpen={!!selectedAgentId}
          onClose={handleCloseModal}
          onPurchase={() => handleHire(selectedAgent.id)}
        />
      )}
    </DashboardLayout>
  );
};

export default MarketplacePage;
