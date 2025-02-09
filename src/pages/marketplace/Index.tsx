
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { AgentCard } from "@/components/marketplace/AgentCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { CategoryNav } from "@/components/marketplace/CategoryNav";
import { FilterSystem } from "@/components/marketplace/FilterSystem";
import { supabase } from "@/integrations/supabase/client";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return [{ id: 'all', name: 'All', icon: '🌟' }, ...data];
    }
  });

  // Fetch agents with search and filters
  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents', searchQuery, selectedCategory, selectedFilters],
    queryFn: async () => {
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
      if (error) throw error;
      return data;
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Marketplace</h2>
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
    </DashboardLayout>
  );
};

export default Marketplace;
