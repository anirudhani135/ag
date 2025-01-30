import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO at TechCorp",
    content: "AgentVerse has transformed how we handle customer support. The AI agents are incredibly efficient.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Founder at AI Startup",
    content: "The best AI marketplace we've used. The integration process was seamless.",
    rating: 5
  },
  {
    name: "Emily Williams",
    role: "Product Manager",
    content: "Outstanding platform. The AI agents have helped us scale our operations significantly.",
    rating: 5
  }
];

export const TestimonialsSection = () => {
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
            See what our customers have to say about their experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur border-white/10 hover:shadow-hover transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                  ))}
                </div>
                <p className="mb-4 text-white/90">{testimonial.content}</p>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};