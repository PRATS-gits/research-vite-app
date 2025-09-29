import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold">Research Space Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your research management platform
        </p>
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <Button onClick={() => setCount((count) => count + 1)} size="lg">
          Click count: {count}
        </Button>
      </div>
      
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <p className="text-muted-foreground">
          This is your main dashboard. Use the sidebar to navigate between different sections
          of the research space application.
        </p>
      </div>
    </div>
  );
}