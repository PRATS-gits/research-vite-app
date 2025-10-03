import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Configure your research platform preferences and integrations
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">General Preferences</h3>
          <div className="space-y-4">
           
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about research progress</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-save</p>
                <p className="text-sm text-muted-foreground">Automatically save research notes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Research Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Suggestions</p>
                <p className="text-sm text-muted-foreground">Enable AI-powered research suggestions</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Citation Auto-format</p>
                <p className="text-sm text-muted-foreground">Automatically format citations</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">API Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Google Scholar</p>
              <p className="text-sm text-muted-foreground">Paper search integration</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">Connected</Badge>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Mendeley</p>
              <p className="text-sm text-muted-foreground">Reference management</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Disconnected</Badge>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Zotero</p>
              <p className="text-sm text-muted-foreground">Citation management</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">Connected</Badge>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">ORCID</p>
              <p className="text-sm text-muted-foreground">Researcher identification</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">Connected</Badge>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}