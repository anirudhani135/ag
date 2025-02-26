
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

interface Agent {
  id: string;
  title: string;
  description?: string;
  price: number;
  version: string;
}

interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

interface EditFormData {
  title: string;
  description: string;
  price: string;
  version: string;
}

const EditAgentModal = ({ isOpen, onClose, agent }: EditAgentModalProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<EditFormData>({
    defaultValues: {
      title: agent.title,
      description: agent.description || "",
      price: agent.price.toString(),
      version: agent.version,
    },
  });

  const onSubmit = (data: EditFormData) => {
    toast({
      title: "Coming Soon",
      description: "Agent editing will be available soon.",
      variant: "default",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              {...register("title")}
              className="opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              {...register("price")}
              className="opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              {...register("version")}
              className="opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="opacity-50 cursor-not-allowed"
              disabled
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgentModal;
