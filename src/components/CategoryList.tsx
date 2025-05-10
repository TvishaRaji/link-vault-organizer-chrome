
import React from 'react';
import { useLinks } from '../context/LinkContext';
import { Button } from '@/components/ui/button';
import { useDialog } from '../hooks/useDialog';
import AddCategoryDialog from './AddCategoryDialog';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CategoryList: React.FC = () => {
  const { categories, links, activeCategory, setActiveCategory, deleteCategory } = useLinks();
  const { isOpen, openDialog, closeDialog } = useDialog();

  const getLinkCount = (categoryId: string) => {
    return links.filter(link => link.categoryId === categoryId).length;
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="p-3 border-b">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-sm text-muted-foreground">CATEGORIES</h2>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 text-xs hover:bg-brand-purple-light text-brand-purple"
          onClick={openDialog}
        >
          + New
        </Button>
      </div>
      
      <div className="space-y-1">
        <Button
          variant={activeCategory === null ? "secondary" : "ghost"}
          className="w-full justify-start font-normal"
          onClick={() => setActiveCategory(null)}
        >
          All Links
          <Badge variant="outline" className="ml-auto">
            {links.length}
          </Badge>
        </Button>
        
        {categories.map((category) => (
          <div key={category.id} className="flex items-center group">
            <Button
              variant={activeCategory === category.id ? "secondary" : "ghost"}
              className="w-full justify-start font-normal"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div 
                className="h-2 w-2 rounded-full mr-2" 
                style={{ backgroundColor: category.color }}
              />
              {category.name}
              <Badge variant="outline" className="ml-auto">
                {getLinkCount(category.id)}
              </Badge>
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory(category.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      
      {isOpen && <AddCategoryDialog isOpen={isOpen} onClose={closeDialog} />}
    </div>
  );
};

export default CategoryList;
