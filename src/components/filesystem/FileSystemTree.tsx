import { useState, memo } from 'react';
import type { MouseEvent } from 'react';
import type { FileSystemNode, FileType } from '@/types';
import { FileSystemItemKind } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Folder as FolderIcon,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  FileType as FileTypeIcon,
  ChevronDown,
  ChevronRight,
  Trash2,
  Loader2,
} from 'lucide-react';

interface FileSystemTreeProps {
  root: FileSystemNode;
  onDelete?: (node: FileSystemNode) => void;
  busyPath?: string | null;
  actionsDisabled?: boolean;
}

interface FileNodeItemProps {
  node: FileSystemNode;
  level?: number;
  onDelete?: (node: FileSystemNode) => void;
  busyPath?: string | null;
  actionsDisabled?: boolean;
}

const FileNodeItem = memo(({ node, level = 0, onDelete, busyPath, actionsDisabled }: FileNodeItemProps) => {
  const isFolder = node.type === FileSystemItemKind.FOLDER;
  const [expanded, setExpanded] = useState(level < 1);
  const isDeleting = busyPath === node.path;
  const canDelete = Boolean(onDelete) && node.path !== '/' && !actionsDisabled;

  const toggle = () => {
    if (isFolder) {
      setExpanded((prev) => !prev);
    }
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onDelete || isDeleting || !canDelete) {
      return;
    }
    onDelete(node);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${value} ${sizes[i]}`;
  };

  const renderFileBadge = () => {
    if (!node.fileType) return null;
    const variantMap: Record<FileType, string> = {
      PDF: 'bg-red-100 text-red-700 border-red-200',
      DOCX: 'bg-blue-100 text-blue-700 border-blue-200',
      XLSX: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    return (
      <Badge variant="outline" className={cn('text-xs capitalize', variantMap[node.fileType])}>
        {node.fileType}
      </Badge>
    );
  };

  const icon = () => {
    if (isFolder) {
      return expanded ? (
        <FolderOpen className="w-4 h-4 text-amber-500" />
      ) : (
        <FolderIcon className="w-4 h-4 text-amber-500" />
      );
    }

    switch (node.fileType) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'DOCX':
        return <FileTypeIcon className="w-4 h-4 text-blue-500" />;
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          'flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          {
            'cursor-pointer': isFolder,
            'pl-8': level === 0 && !isFolder,
          },
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <span className="flex items-center space-x-2">
          {isFolder ? (
            expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />
          ) : (
            <span className="w-4 h-4" />
          )}
          {icon()}
          <span className="font-medium text-sm text-slate-700">{node.name}</span>
        </span>
        <div className="ml-auto flex items-center space-x-2">
          {renderFileBadge()}
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 text-xs">
            {formatBytes(node.size)}
          </Badge>
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={cn(
                'inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              aria-label={`Eliminar ${isFolder ? 'carpeta' : 'archivo'} ${node.name}`}
              title={`Eliminar ${isFolder ? 'carpeta' : 'archivo'}`}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </button>
      {isFolder && expanded && node.children && node.children.length > 0 && (
        <div className="space-y-1">
          {node.children.map((child) => (
            <FileNodeItem
              key={child.path}
              node={child}
              level={level + 1}
              onDelete={onDelete}
              busyPath={busyPath}
              actionsDisabled={actionsDisabled}
            />
          ))}
        </div>
      )}
      {isFolder && expanded && (!node.children || node.children.length === 0) && (
        <div className="pl-10 text-xs text-slate-400">(Carpeta vacía)</div>
      )}
    </div>
  );
});
FileNodeItem.displayName = 'FileNodeItem';

export function FileSystemTree({ root, onDelete, busyPath, actionsDisabled }: FileSystemTreeProps) {
  return (
    <Card className="border-slate-200 bg-white/80 backdrop-blur">
      <CardContent className="p-4">
        <div className="space-y-2">
          <FileNodeItem node={root} onDelete={onDelete} busyPath={busyPath} actionsDisabled={actionsDisabled} />
        </div>
      </CardContent>
    </Card>
  );
}
