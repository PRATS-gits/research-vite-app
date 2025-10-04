import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Research Agents</h1>
        <p className="text-lg text-muted-foreground">
          Manage and deploy AI agents for your research workflows
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Literature Review Agent</h3>
            <Badge variant="default">Active</Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            Automated literature review and paper summarization agent.
          </p>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Data Analysis Agent</h3>
            <Badge variant="secondary">Inactive</Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            Statistical analysis and visualization generation agent.
          </p>
          <Button variant="outline" size="sm">
            Activate
          </Button>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Citation Manager</h3>
            <Badge variant="default">Active</Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            Automatic citation formatting and bibliography management.
          </p>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Custom Agent</h3>
            <Badge variant="outline">New</Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            Create and configure custom research agents.
          </p>
          <Button variant="default" size="sm">
            Create Agent
          </Button>
        </div>
      </div>
    </div>
  );
}