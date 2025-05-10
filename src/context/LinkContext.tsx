
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link, Category } from '../types';
import { toast } from '@/components/ui/use-toast';

interface LinkContextType {
  links: Link[];
  categories: Category[];
  addLink: (link: Omit<Link, 'id' | 'createdAt'>) => void;
  deleteLink: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

// Default categories with predefined colors
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#9b87f5' },
  { id: '2', name: 'Personal', color: '#F97316' },
  { id: '3', name: 'Learning', color: '#0EA5E9' },
];

export const LinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load data from chrome.storage
  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.get(['links', 'categories'], (result) => {
            if (result.links) setLinks(result.links);
            if (result.categories) {
              setCategories(result.categories);
            } else {
              // Save default categories if none exist
              chrome.storage.local.set({ categories: DEFAULT_CATEGORIES });
            }
          });
        } else {
          // Local development fallback
          const storedLinks = localStorage.getItem('links');
          const storedCategories = localStorage.getItem('categories');
          
          if (storedLinks) setLinks(JSON.parse(storedLinks));
          if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
          } else {
            // Save default categories if none exist
            localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Failed to load data",
          description: "Please try reloading the extension."
        });
      }
    };
    
    loadData();
  }, []);

  // Save data to chrome.storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.set({ links, categories });
        } else {
          // Local development fallback
          localStorage.setItem('links', JSON.stringify(links));
          localStorage.setItem('categories', JSON.stringify(categories));
        }
      } catch (error) {
        console.error('Error saving data:', error);
        toast({
          variant: "destructive",
          title: "Failed to save data",
          description: "Your changes might not be persisted."
        });
      }
    };
    
    if (links.length > 0 || categories.length > DEFAULT_CATEGORIES.length) {
      saveData();
    }
  }, [links, categories]);

  const addLink = (link: Omit<Link, 'id' | 'createdAt'>) => {
    const newLink: Link = {
      ...link,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setLinks(prev => [newLink, ...prev]);
    toast({
      title: "Link saved",
      description: "Your link has been saved successfully."
    });
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    toast({
      title: "Link deleted",
      description: "Your link has been removed."
    });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Category created",
      description: `Category "${category.name}" has been created.`
    });
    return newCategory.id;
  };

  const deleteCategory = (id: string) => {
    // Don't delete a category if it has links
    const hasLinks = links.some(link => link.categoryId === id);
    
    if (hasLinks) {
      toast({
        variant: "destructive",
        title: "Cannot delete category",
        description: "Please delete or move all links in this category first."
      });
      return;
    }
    
    setCategories(prev => prev.filter(category => category.id !== id));
    
    if (activeCategory === id) {
      setActiveCategory(null);
    }
    
    toast({
      title: "Category deleted",
      description: "The category has been removed."
    });
  };

  return (
    <LinkContext.Provider 
      value={{ 
        links,
        categories,
        addLink,
        deleteLink,
        addCategory,
        deleteCategory,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </LinkContext.Provider>
  );
};

export const useLinks = () => {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error('useLinks must be used within a LinkProvider');
  }
  return context;
};
