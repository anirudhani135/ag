
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const submitHandler = (data: any) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                {...register("subject", { required: "Subject is required" })}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about your issue"
                rows={5}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message as string}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Ticket</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTicketModal;
