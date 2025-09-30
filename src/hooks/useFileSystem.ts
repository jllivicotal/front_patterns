import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  FileSystemItemKind,
  type FileSystemNode,
  type FileSystemStatistics,
  type FileType,
} from '@/types';

interface CreateFolderInput {
  name: string;
  parentPath: string;
}

interface CreateFileInput {
  name: string;
  parentPath: string;
  type: FileType;
  sizeKb: number;
}

interface UseFileSystemResult {
  root: FileSystemNode | null;
  statistics: FileSystemStatistics | null;
  structure: string;
  loading: boolean;
  isMutating: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createFolder: (input: CreateFolderInput) => Promise<void>;
  createFile: (input: CreateFileInput) => Promise<void>;
  removeItem: (path: string) => Promise<FileSystemNode>;
}

const normalizePathValue = (path: string): string =>
  path
    .replace(/\\/g, '/')
    .replace(/\s+/g, '')
    .replace(/\/+/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

const formatPath = (path: string): string => {
  const normalized = normalizePathValue(path);
  return normalized ? `/${normalized}` : '/';
};

const composePath = (parentPath: string, name: string) => {
  const parent = normalizePathValue(parentPath);
  const segment = normalizePathValue(name);

  if (!parent) {
    return formatPath(segment);
  }

  if (!segment) {
    return formatPath(parent);
  }

  return formatPath(`${parent}/${segment}`);
};

const removeNodeFromTree = (
  node: FileSystemNode,
  targetPath: string,
): { updatedTree: FileSystemNode; removed: FileSystemNode | null } => {
  if (node.type !== FileSystemItemKind.FOLDER || !node.children) {
    return { updatedTree: node, removed: null };
  }

  let removed: FileSystemNode | null = null;
  const updatedChildren: FileSystemNode[] = [];

  for (const child of node.children) {
    if (child.path === targetPath) {
      removed = child;
      continue;
    }

    if (removed) {
      updatedChildren.push(child);
      continue;
    }

    if (child.type === FileSystemItemKind.FOLDER) {
      const result = removeNodeFromTree(child, targetPath);
      if (result.removed) {
        removed = result.removed;
      }
      updatedChildren.push(result.updatedTree);
    } else {
      updatedChildren.push(child);
    }
  }

  return {
    updatedTree: { ...node, children: updatedChildren },
    removed,
  };
};

const recalculateFolderSizes = (node: FileSystemNode): FileSystemNode => {
  if (node.type === FileSystemItemKind.FILE) {
    return node;
  }
  const children = (node.children ?? []).map(recalculateFolderSizes);
  const size = children.reduce((sum, child) => sum + child.size, 0);
  return { ...node, children, size };
};

const addNodeToTree = (
  node: FileSystemNode,
  parentPath: string,
  newNode: FileSystemNode,
): FileSystemNode => {
  if (node.path === parentPath && node.type === FileSystemItemKind.FOLDER) {
    const children = [...(node.children ?? []), newNode];
    return { ...node, children };
  }
  if (!node.children) {
    return node;
  }
  const children = node.children.map((child) => addNodeToTree(child, parentPath, newNode));
  return { ...node, children };
};

const computeStatistics = (node: FileSystemNode): Omit<FileSystemStatistics, 'structure'> => {
  if (node.type === FileSystemItemKind.FILE) {
    return {
      totalSize: node.size,
      totalFiles: 1,
      totalFolders: 0,
    };
  }

  const children = node.children ?? [];
  return children.reduce(
    (acc, child) => {
      const childStats = computeStatistics(child);
      return {
        totalSize: acc.totalSize + childStats.totalSize,
        totalFiles: acc.totalFiles + childStats.totalFiles,
        totalFolders: acc.totalFolders + childStats.totalFolders,
      };
    },
    {
      totalSize: 0,
      totalFiles: 0,
      totalFolders: 1, // Contar la carpeta actual
    },
  );
};

const getStructureText = (node: FileSystemNode, indent = 0): string => {
  const prefix = '  '.repeat(indent);
  if (node.type === FileSystemItemKind.FILE) {
    const icon = (() => {
      switch (node.fileType) {
        case 'PDF':
          return '📄';
        case 'DOCX':
          return '📝';
        case 'XLSX':
          return '📊';
        default:
          return '📄';
      }
    })();
    return `${prefix}${icon} ${node.name} (${node.size} bytes)`;
  }

  const header = `${prefix}📁 ${node.name}/ (${node.size} bytes)`;
  const children = (node.children ?? []).map((child) => getStructureText(child, indent + 1));
  return children.length > 0 ? `${header}\n${children.join('\n')}` : header;
};

export function useFileSystem(): UseFileSystemResult {
  const [root, setRoot] = useState<FileSystemNode | null>(null);
  const [statistics, setStatistics] = useState<FileSystemStatistics | null>(null);
  const [structure, setStructure] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncDerivedState = useCallback((tree: FileSystemNode | null) => {
    if (!tree) {
      return;
    }
    const stats = computeStatistics(tree);
    const structureText = getStructureText(tree);
    setStatistics({ ...stats, structure: structureText });
    setStructure(structureText);
  }, []);

  const fetchFileSystem = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tree, stats, structureText] = await Promise.all([
        apiClient.getFileSystem(),
        apiClient.getFileSystemStatistics(),
        apiClient.getFileSystemStructure(),
      ]);
      setRoot(tree);
      setStatistics(stats);
      setStructure(structureText);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el sistema de archivos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyLocalInsertion = useCallback((parentPath: string, newNode: FileSystemNode) => {
    let success = false;

    setRoot((current) => {
      if (!current) {
        return current;
      }
      const withNode = addNodeToTree(current, parentPath, newNode);
      if (withNode === current) {
        return current;
      }
      const recalculated = recalculateFolderSizes(withNode);
      const structureText = getStructureText(recalculated);
      const stats = computeStatistics(recalculated);
      setStatistics({
        totalSize: stats.totalSize,
        totalFiles: stats.totalFiles,
        totalFolders: stats.totalFolders,
        structure: structureText,
      });
      setStructure(structureText);
      success = true;
      return recalculated;
    });

    if (!success) {
      throw new Error('No se encontró la carpeta destino');
    }
  }, []);

  const createFolder = useCallback(
    async ({ name, parentPath }: CreateFolderInput) => {
      if (!root) {
        throw new Error('El sistema de archivos todavía no está disponible');
      }
      setIsMutating(true);
      setError(null);
      try {
        await apiClient.createCompositeFolder({ name });
        const newNode: FileSystemNode = {
          name,
          type: FileSystemItemKind.FOLDER,
          size: 0,
          children: [],
          path: composePath(parentPath, name),
        };
        applyLocalInsertion(parentPath, newNode);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al crear la carpeta';
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [applyLocalInsertion, root],
  );

  const createFile = useCallback(
    async ({ name, parentPath, type, sizeKb }: CreateFileInput) => {
      if (!root) {
        throw new Error('El sistema de archivos todavía no está disponible');
      }
      setIsMutating(true);
      setError(null);
      try {
        const sizeBytes = Math.round(sizeKb * 1024);
        await apiClient.createCompositeFile({ name, size: sizeBytes, type });
        const newNode: FileSystemNode = {
          name,
          type: FileSystemItemKind.FILE,
          fileType: type,
          size: sizeBytes,
          path: composePath(parentPath, name),
        };
        applyLocalInsertion(parentPath, newNode);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al crear el archivo';
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [applyLocalInsertion, root],
  );

  const removeItem = useCallback(
    async (path: string) => {
      if (!root) {
        throw new Error('El sistema de archivos todavía no está disponible');
      }

      const normalizedTarget = normalizePathValue(path);
      if (!normalizedTarget) {
        throw new Error('No se puede eliminar la carpeta raíz');
      }

      setIsMutating(true);
      setError(null);

      let removedNode: FileSystemNode | null = null;
      let apiError: Error | null = null;

      try {
        try {
          await apiClient.deleteCompositeItem(normalizedTarget);
        } catch (err) {
          apiError = err instanceof Error ? err : new Error('Error al eliminar el elemento');
        }

        setRoot((current) => {
          if (!current) {
            return current;
          }

          const { updatedTree, removed } = removeNodeFromTree(current, formatPath(normalizedTarget));

          if (!removed) {
            return current;
          }

          const recalculated = recalculateFolderSizes(updatedTree);
          const structureText = getStructureText(recalculated);
          const stats = computeStatistics(recalculated);
          setStatistics({
            totalSize: stats.totalSize,
            totalFiles: stats.totalFiles,
            totalFolders: stats.totalFolders,
            structure: structureText,
          });
          setStructure(structureText);
          removedNode = removed;
          return recalculated;
        });

        if (!removedNode) {
          const message = apiError?.message ?? 'No se encontró el elemento a eliminar';
          setError(message);
          throw new Error(message);
        }

        if (apiError) {
          console.warn('El backend no confirmó la eliminación:', apiError);
        }

        return removedNode;
      } finally {
        setIsMutating(false);
      }
    },
    [root],
  );

  useEffect(() => {
    fetchFileSystem();
  }, [fetchFileSystem]);

  useEffect(() => {
    if (root) {
      syncDerivedState(root);
    }
  }, [root, syncDerivedState]);

  return {
    root,
    statistics,
    structure,
    loading,
    isMutating,
    error,
    refresh: fetchFileSystem,
    createFolder,
    createFile,
    removeItem,
  };
}
