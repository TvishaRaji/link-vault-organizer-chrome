
import React from 'react';
import { useLinks } from '../context/LinkContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useDialog } from '../hooks/useDialog';
import AddLinkDialog from './AddLinkDialog';

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useLinks();
  const { isOpen, openDialog, closeDialog } = useDialog();

  return (
    <header className="sticky top-0 z-10 bg-background border-b p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-purple">LinkSaver</h1>
        <Button onClick={openDialog} size="sm" variant="ghost" className="text-brand-purple hover:bg-brand-purple-light hover:text-brand-purple-dark">
          <Plus className="h-5 w-5" />
          <span className="ml-1">Add Link</span>
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {isOpen && <AddLinkDialog isOpen={isOpen} onClose={closeDialog} />}
    </header>
  );
};

export default Header;
