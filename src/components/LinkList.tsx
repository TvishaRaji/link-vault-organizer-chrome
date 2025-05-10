
import React from 'react';
import { useLinks } from '../context/LinkContext';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LinkList: React.FC = () => {
  const { links, categories, deleteLink, activeCategory, searchQuery } = useLinks();

  const filteredLinks = links.filter(link => {
    const matchesCategory = activeCategory === null || link.categoryId === activeCategory;
    const matchesSearch = searchQuery === '' || 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#9b87f5';
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const openLink = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  if (filteredLinks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 p-4">
        <p className="text-muted-foreground">
          {searchQuery 
            ? "No links match your search" 
            : activeCategory !== null 
              ? "No links in this category yet" 
              : "No links saved yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3 pb-20">
      {filteredLinks.map((link) => (
        <Card key={link.id} className="overflow-hidden group">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0" onClick={() => openLink(link.url)}>
                <h3 className="font-semibold truncate hover:text-brand-purple cursor-pointer">
                  {link.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {formatUrl(link.url)}
                </p>
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openLink(link.url)}
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open link</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete link</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="mt-2">
              <div
                className="flex items-center text-xs rounded-full px-2 py-1 w-fit"
                style={{ 
                  backgroundColor: `${getCategoryColor(link.categoryId)}20`,
                  color: getCategoryColor(link.categoryId)
                }}
              >
                <div 
                  className="h-2 w-2 rounded-full mr-1" 
                  style={{ backgroundColor: getCategoryColor(link.categoryId) }}
                />
                {getCategoryName(link.categoryId)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LinkList;
