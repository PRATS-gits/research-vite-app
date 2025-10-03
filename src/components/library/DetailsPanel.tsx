/**
 * DetailsPanel Component
 * Side panel showing comprehensive file/folder information
 */

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Image,
  File,
  Folder,
  Download,
  Share2,
  Star,
  Calendar,
  HardDrive,
  User,
  MapPin,
} from 'lucide-react';
import { useLibraryStore } from '@/store/libraryStore';
import { formatFileSize } from '@/types/library';
import { format } from 'date-fns';

interface DetailsPanelProps {
  itemId: string;
  onClose: () => void;
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

export function DetailsPanel({ itemId, onClose }: DetailsPanelProps) {
  const item = useLibraryStore((state) => state.items[itemId]);
  const folderPath = useLibraryStore((state) => state.folderPath);
  const downloadFile = useLibraryStore((state) => state.downloadFile);
  const starItem = useLibraryStore((state) => state.starItem);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isStarring, setIsStarring] = useState(false);

  if (!item) {
    return null;
  }

  const getFileIcon = () => {
    if (item.type === 'folder') {
      return <Folder className="h-16 w-16 text-blue-500" />;
    }

    switch (item.fileType) {
      case 'pdf':
        return <FileText className="h-16 w-16 text-red-500" />;
      case 'image':
        return <Image className="h-16 w-16 text-blue-500" />;
      case 'document':
        return <FileText className="h-16 w-16 text-blue-600" />;
      default:
        return <File className="h-16 w-16 text-gray-500" />;
    }
  };

  const getLocationPath = () => {
    if (folderPath.length === 0) return 'Root';
    return folderPath.map((p) => p.name).join(' / ');
  };

  const handleDownload = async () => {
    if (item.type === 'file') {
      setIsDownloading(true);
      try {
        await downloadFile(item.id);
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleStar = async () => {
    setIsStarring(true);
    try {
      await starItem(item.id);
    } catch (error) {
      console.error('Star failed:', error);
    } finally {
      setIsStarring(false);
    }
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Details</SheetTitle>
          <SheetDescription>
            Information about this {item.type}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Icon and name */}
          <div className="flex flex-col items-center gap-3 py-4">
            {getFileIcon()}
            <div className="text-center">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              {item.type === 'file' && (
                <Badge variant="secondary" className="mt-2">
                  {item.extension.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Information */}
          <div className="space-y-1">
            <InfoRow
              icon={item.type === 'folder' ? Folder : FileText}
              label="Type"
              value={item.type === 'folder' ? 'Folder' : item.fileType.toUpperCase()}
            />

            {item.type === 'file' && (
              <InfoRow
                icon={HardDrive}
                label="Size"
                value={formatFileSize(item.size)}
              />
            )}

            {item.type === 'folder' && (
              <InfoRow
                icon={FileText}
                label="Items"
                value={`${item.itemCount} items`}
              />
            )}

            <InfoRow
              icon={Calendar}
              label="Created"
              value={format(item.createdAt, 'PPP p')}
            />

            <InfoRow
              icon={Calendar}
              label="Modified"
              value={format(item.updatedAt, 'PPP p')}
            />

            <InfoRow
              icon={User}
              label="Owner"
              value="Research User"
            />

            <InfoRow
              icon={MapPin}
              label="Location"
              value={getLocationPath()}
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            {item.type === 'file' && (
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
            )}

            <Button
              onClick={handleStar}
              disabled={isStarring}
              className="w-full"
              variant="outline"
            >
              <Star
                className={`mr-2 h-4 w-4 ${item.starred ? 'fill-yellow-400 text-yellow-400' : ''}`}
              />
              {item.starred ? 'Remove from Starred' : 'Add to Starred'}
            </Button>

            {item.type === 'file' && (
              <Button className="w-full" variant="outline" disabled>
                <Share2 className="mr-2 h-4 w-4" />
                Share (Coming Soon)
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
