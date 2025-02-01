import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AgentCardProps {
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  onView: () => void;
}

export const AgentCard = ({
  title,
  description,
  price,
  category,
  rating,
  onView,
}: AgentCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            <Badge variant="secondary">{category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold">${price}</span>
            <div className="flex items-center gap-1">
              <span className="text-sm">⭐</span>
              <span className="text-sm">{rating.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onView} className="w-full bg-primary-gradient hover:shadow-hover">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};