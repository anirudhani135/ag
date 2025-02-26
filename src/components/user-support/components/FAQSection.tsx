
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from './LoadingSpinner';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

const FAQSection = ({ searchQuery }: { searchQuery: string }) => {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true);

      if (searchQuery) {
        query = query.ilike('question', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FAQ[];
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
      {faqs?.length ? (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <h4 className="font-medium">{faq.question}</h4>
              <p className="text-sm text-muted-foreground mt-2">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>No FAQs available</p>
        </div>
      )}
    </Card>
  );
};

export default FAQSection;
