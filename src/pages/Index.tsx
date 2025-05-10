
import React from 'react';
import Header from '../components/Header';
import CategoryList from '../components/CategoryList';
import LinkList from '../components/LinkList';
import { LinkProvider } from '../context/LinkContext';

const Index = () => {
  return (
    <LinkProvider>
      <div className="flex flex-col h-full">
        <Header />
        <CategoryList />
        <div className="flex-1 overflow-auto">
          <LinkList />
        </div>
      </div>
    </LinkProvider>
  );
};

export default Index;
