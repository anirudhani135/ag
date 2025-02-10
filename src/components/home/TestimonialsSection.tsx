
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star, Quote, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  role: string;
  testimonial: string;
  rating: number;
  industry?: string;
  logo_url?: string;
  video_url?: string;
  metrics?: {
    [key: string]: number | string;
  };
}

export const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Testimonial[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 bg-white/5 backdrop-blur border-white/10">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-6 w-32" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Trusted by Industry Leaders
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            See what our customers have to say about their experience with our AI agents
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials?.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur border-white/10 hover:shadow-hover transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Quote className="w-8 h-8 text-primary-foreground opacity-50" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                    ))}
                  </div>
                </div>
                
                <p className="mb-6 text-white/90 line-clamp-4">{testimonial.testimonial}</p>
                
                {testimonial.metrics && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.entries(testimonial.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-3 rounded-lg bg-white/5">
                        <p className="text-xl font-bold text-white">{value}</p>
                        <p className="text-xs text-white/60 capitalize">{key.replace('_', ' ')}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-white">{testimonial.client_name}</h4>
                  <p className="text-white/60 text-sm">{testimonial.role} at {testimonial.company}</p>
                  {testimonial.industry && (
                    <p className="text-white/40 text-sm mt-1">{testimonial.industry}</p>
                  )}
                </div>

                {testimonial.video_url && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-white hover:text-primary-foreground hover:bg-white/10"
                    onClick={() => window.open(testimonial.video_url, '_blank')}
                  >
                    Watch Video Testimonial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
