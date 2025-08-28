import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LessonCard from '@/components/learning/lesson-card';
import StatsOverview from '@/components/gamification/stats-overview';
import Leaderboard from '@/components/gamification/leaderboard';
import { BookOpen, Play, TrendingUp, Users, Filter } from 'lucide-react';

const LearningDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - in real app this would come from API/database
  const userStats = {
    level: 12,
    xp: 2840,
    maxXp: 3000,
    streak: 7,
    totalLessons: 24,
    completedLessons: 18,
    weeklyGoal: 5,
    weeklyProgress: 3,
    studyTime: 180 // minutes
  };

  const recentAchievements = [
    { id: '1', type: 'gold' as const, icon: 'trophy' as const, title: 'Week Master' },
    { id: '2', type: 'silver' as const, icon: 'target' as const, title: 'Streak Hero' },
    { id: '3', type: 'bronze' as const, icon: 'star' as const, title: 'First Steps' }
  ];

  const lessons = [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      description: 'Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks.',
      duration: 25,
      difficulty: 'beginner' as const,
      progress: 0,
      status: 'available' as const,
      xpReward: 150,
      category: 'React'
    },
    {
      id: '2',
      title: 'Advanced State Management',
      description: 'Master complex state patterns with useReducer and Context API for scalable applications.',
      duration: 40,
      difficulty: 'intermediate' as const,
      progress: 65,
      status: 'in-progress' as const,
      xpReward: 250,
      category: 'React'
    },
    {
      id: '3',
      title: 'JavaScript ES6+ Features',
      description: 'Explore modern JavaScript features like arrow functions, destructuring, and modules.',
      duration: 30,
      difficulty: 'beginner' as const,
      progress: 100,
      status: 'completed' as const,
      xpReward: 200,
      stars: 3,
      category: 'JavaScript'
    },
    {
      id: '4',
      title: 'TypeScript Fundamentals',
      description: 'Get started with TypeScript to write more robust and maintainable code.',
      duration: 35,
      difficulty: 'intermediate' as const,
      progress: 0,
      status: 'locked' as const,
      xpReward: 220,
      category: 'TypeScript'
    },
    {
      id: '5',
      title: 'CSS Grid Layout',
      description: 'Master CSS Grid to create complex, responsive layouts with ease.',
      duration: 20,
      difficulty: 'beginner' as const,
      progress: 0,
      status: 'available' as const,
      xpReward: 180,
      category: 'CSS'
    },
    {
      id: '6',
      title: 'Node.js API Development',
      description: 'Build RESTful APIs with Node.js, Express, and proper error handling.',
      duration: 50,
      difficulty: 'advanced' as const,
      progress: 0,
      status: 'locked' as const,
      xpReward: 300,
      category: 'Node.js'
    }
  ];

  const leaderboardData = [
    {
      id: '1',
      name: 'Sarah Chen',
      level: 15,
      xp: 4200,
      rank: 1,
      streak: 12,
      weeklyXp: 450
    },
    {
      id: '2',
      name: 'Alex Thompson',
      level: 12,
      xp: 2840,
      rank: 2,
      streak: 7,
      weeklyXp: 320,
      isCurrentUser: true
    },
    {
      id: '3',
      name: 'Marcus Rodriguez',
      level: 14,
      xp: 3800,
      rank: 3,
      streak: 9,
      weeklyXp: 280
    },
    {
      id: '4',
      name: 'Emily Johnson',
      level: 11,
      xp: 2650,
      rank: 4,
      streak: 5,
      weeklyXp: 220
    },
    {
      id: '5',
      name: 'David Park',
      level: 10,
      xp: 2400,
      rank: 5,
      streak: 8,
      weeklyXp: 200
    }
  ];

  const categories = ['all', 'React', 'JavaScript', 'TypeScript', 'CSS', 'Node.js'];
  const filteredLessons = selectedCategory === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

  const handleLessonClick = (lessonId: string) => {
    console.log('Starting lesson:', lessonId);
    // In real app: navigate to lesson page or open lesson modal
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Alex!</h1>
            <p className="text-blue-100">Ready to continue your learning journey?</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
              <Play className="w-5 h-5 mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Community</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-6">
          {/* Category Filter */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Available Lessons</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    {...lesson}
                    onClick={() => handleLessonClick(lesson.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <StatsOverview 
            stats={userStats}
            recentAchievements={recentAchievements}
          />
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Leaderboard 
              entries={leaderboardData}
              timeframe="weekly"
            />
            <Card>
              <CardHeader>
                <CardTitle>Study Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Study groups feature coming soon!</p>
                  <p className="text-sm">Connect with other learners and study together.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningDashboard;