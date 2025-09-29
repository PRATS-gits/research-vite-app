import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ConnectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Research Connections</h1>
        <p className="text-lg text-muted-foreground">
          Connect with researchers, collaborators, and institutions
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Active Collaborations</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-avatar-1.jpg" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">Dr. Research Partner</p>
                <p className="text-sm text-muted-foreground">Machine Learning Research</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">Prof. Jane Doe</p>
                <p className="text-sm text-muted-foreground">Data Science Institute</p>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Institution Networks</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Research University</p>
                <p className="text-sm text-muted-foreground">Computer Science Dept.</p>
              </div>
              <Badge variant="outline">Connected</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Research Lab</p>
                <p className="text-sm text-muted-foreground">Industry Partnership</p>
              </div>
              <Badge variant="outline">Connected</Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Collaboration Opportunities</h3>
        <p className="text-muted-foreground">
          Discover new research partnerships and collaboration opportunities based on your research interests.
        </p>
      </div>
    </div>
  );
}