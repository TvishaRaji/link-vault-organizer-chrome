
import React, { useState } from 'react';
import { useLinks } from '../context/LinkContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Predefined colors for categories
const COLORS = [
  '#9b87f5', // purple
  '#F97316', // orange
  '#0EA5E9', // blue
  '#10B981', // green
  '#EC4899', // pink
  '#EAB308', // yellow
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#D946EF', // fuchsia
];

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ isOpen, onClose }) => {
  const { addCategory } = useLinks();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    addCategory({
      name: name.trim(),
      color: selectedColor
    });
    
    setName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">New Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-8 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-brand-purple scale-110' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
