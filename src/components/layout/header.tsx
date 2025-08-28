import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProgressRing from '@/components/ui/progress-ring';
import { Flame, Coins, Menu, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
    level: number;
    xp: number;
    maxXp: number;
    streak: number;
    tokens: number;
  };
}

const Header = ({ user }: HeaderProps) => {
  const defaultUser = {
    name: 'Alex Thompson',
    avatar: undefined,
    level: 12,
    xp: 2840,
    maxXp: 3000,
    streak: 7,
    tokens: 1250
  };

  const currentUser = user || defaultUser;
  const xpProgress = (currentUser.xp / currentUser.maxXp) * 100;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Brand */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">LearnQuest</span>
          </div>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center space-x-4">
          {/* Streak */}
          <div className="hidden sm:flex items-center space-x-2 bg-gradient-card rounded-lg px-3 py-2">
            <Flame className="w-5 h-5 text-streak" />
            <span className="font-semibold text-sm">{currentUser.streak}</span>
          </div>

          {/* Tokens */}
          <div className="hidden md:flex items-center space-x-2 bg-gradient-card rounded-lg px-3 py-2">
            <Coins className="w-5 h-5 text-accent" />
            <span className="font-semibold text-sm">{currentUser.tokens.toLocaleString()}</span>
          </div>

          {/* Level & XP */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold">Level {currentUser.level}</div>
              <div className="text-xs text-muted-foreground">
                {currentUser.xp}/{currentUser.maxXp} XP
              </div>
            </div>
            <ProgressRing progress={xpProgress} size="sm">
              <span className="text-xs font-bold text-primary">{currentUser.level}</span>
            </ProgressRing>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
          </Button>

          {/* User Avatar */}
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;