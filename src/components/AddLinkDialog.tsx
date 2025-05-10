
import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddLinkDialog: React.FC<AddLinkDialogProps> = ({ isOpen, onClose }) => {
  const { addLink, categories, activeCategory } = useLinks();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [currentTabInfo, setCurrentTabInfo] = useState({ title: '', url: '' });

  useEffect(() => {
    // Pre-fill with current tab info if in extension context
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setCurrentTabInfo({
            title: tabs[0].title || '',
            url: tabs[0].url || ''
          });
          setTitle(tabs[0].title || '');
          setUrl(tabs[0].url || '');
        }
      });
    }
    
    // Set initial category
    if (activeCategory) {
      setCategoryId(activeCategory);
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, activeCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim() || !url.trim() || !categoryId) {
      return;
    }
    
    // Add http:// if missing
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    addLink({
      title: title.trim(),
      url: formattedUrl,
      categoryId
    });
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle(currentTabInfo.title);
    setUrl(currentTabInfo.url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Save Link</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Link title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <div 
                        className="h-2 w-2 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLinkDialog;
