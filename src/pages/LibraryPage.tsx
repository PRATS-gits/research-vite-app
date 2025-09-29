import { Badge } from '@/components/ui/badge';

export function LibraryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Research Library</h1>
        <p className="text-lg text-muted-foreground">
          Manage your research papers, documents, and resources
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Papers</h3>
            <Badge variant="secondary">12</Badge>
          </div>
          <p className="text-muted-foreground">
            Access your recently added research papers and publications.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Collections</h3>
            <Badge variant="secondary">5</Badge>
          </div>
          <p className="text-muted-foreground">
            Organize your resources into themed collections.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Bookmarks</h3>
            <Badge variant="secondary">28</Badge>
          </div>
          <p className="text-muted-foreground">
            Quick access to your bookmarked research materials.
          </p>
        </div>
      </div>
    </div>
  );
}