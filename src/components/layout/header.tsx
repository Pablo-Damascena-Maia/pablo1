import React from 'react';
import { Bell, UserCircle } from 'lucide-react';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 py-3 md:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold md:hidden">Torre Verde</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <UserCircle size={32} className="text-gray-500" />
            <div className="hidden md:block">
              <p className="text-sm font-medium">Usuário</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}