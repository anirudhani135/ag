
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: articles, isLoading } = useQuery({
    queryKey: ['knowledge-base', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_base_articles')
        .select('*')
        .eq('published', true);

      if (searchQuery) {
        query = query.textSearch('search_vector', searchQuery);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Article[];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Knowledge Base</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </Card>
          ))
        ) : articles?.length ? (
          articles.map((article) => (
            <Card key={article.id} className="p-4 hover:bg-accent/5 cursor-pointer transition-colors">
              <h3 className="font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
              <div className="flex gap-2 mt-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No articles found
          </div>
        )}
      </div>
    </div>
  );
};
