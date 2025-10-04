import { Badge } from '@/components/ui/badge';

export function StatusPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">System Status</h1>
        <p className="text-lg text-muted-foreground">
          Monitor your research platform health and performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Health</h3>
            <Badge variant="default">Operational</Badge>
          </div>
          <p className="text-muted-foreground">
            All systems running normally with 99.9% uptime.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Agents</h3>
            <Badge variant="default">3/4 Active</Badge>
          </div>
          <p className="text-muted-foreground">
            Most research agents are operational and processing tasks.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Storage Usage</h3>
            <Badge variant="secondary">68%</Badge>
          </div>
          <p className="text-muted-foreground">
            Research data storage is within normal usage parameters.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">API Requests</h3>
            <Badge variant="default">Normal</Badge>
          </div>
          <p className="text-muted-foreground">
            External API integrations responding within expected limits.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Processing Queue</h3>
            <Badge variant="outline">12 Jobs</Badge>
          </div>
          <p className="text-muted-foreground">
            Background tasks processing with average wait time of 2 minutes.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Last Backup</h3>
            <Badge variant="default">2 hours ago</Badge>
          </div>
          <p className="text-muted-foreground">
            Research data backup completed successfully.
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Literature Review Agent completed 5 paper analyses</span>
            <span className="text-sm text-muted-foreground">5 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">System backup completed successfully</span>
            <span className="text-sm text-muted-foreground">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">New collaboration request from Dr. Smith</span>
            <span className="text-sm text-muted-foreground">4 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}