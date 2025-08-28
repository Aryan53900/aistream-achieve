import Header from '@/components/layout/header';
import LearningDashboard from '@/components/dashboard/learning-dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <LearningDashboard />
      </main>
    </div>
  );
};

export default Index;
