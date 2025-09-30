import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useFileSystem } from '@/hooks/useFileSystem';
import { FileSystemTree } from '@/components/filesystem/FileSystemTree';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { RefreshCw, Layers, FolderTree, HardDrive, Download, Loader2, FolderPlus, FilePlus } from 'lucide-react';
import { FileSystemItemKind, FileType as FileTypeEnum, type FileSystemNode } from '@/types';

const fileTypeOptions = [FileTypeEnum.PDF, FileTypeEnum.DOCX, FileTypeEnum.XLSX] as const;

const folderFormSchema = z.object({
  parentPath: z.string().min(1, 'Selecciona una carpeta destino'),
  name: z.string().trim().min(1, 'Ingresa un nombre'),
});

const fileFormSchema = z.object({
  parentPath: z.string().min(1, 'Selecciona una carpeta destino'),
  name: z.string().trim().min(1, 'Ingresa un nombre'),
  type: z.enum(fileTypeOptions),
  sizeKb: z.coerce.number().min(1, 'El tamaño debe ser mayor que cero'),
});

type FolderFormValues = z.infer<typeof folderFormSchema>;

interface FolderOption {
  path: string;
  label: string;
  depth: number;
}

export function FileSystemPage() {
  const {
    root,
    statistics,
    structure,
    loading,
    error,
    refresh,
    isMutating,
    createFolder,
    createFile,
    removeItem,
  } = useFileSystem();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FileSystemNode | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${value} ${sizes[i]}`;
  };

  const derivedStats = useMemo(() => {
    if (!statistics) {
      return {
        totalSize: '—',
        totalFiles: '—',
        totalFolders: '—',
      };
    }

    return {
      totalSize: formatBytes(statistics.totalSize),
      totalFiles: statistics.totalFiles.toString(),
      totalFolders: statistics.totalFolders.toString(),
    };
  }, [statistics]);

  const folderOptions = useMemo<FolderOption[]>(() => {
    if (!root) {
      return [];
    }

    const options: FolderOption[] = [];
    const visit = (node: FileSystemNode, depth: number) => {
      if (node.type !== FileSystemItemKind.FOLDER) {
        return;
      }

      const prefix = depth === 0 ? '' : `${'\u00A0\u00A0'.repeat(depth)}› `;
      const title = depth === 0 ? 'root (/)' : node.name;
      options.push({
        path: node.path,
        label: `${prefix}${title}`,
        depth,
      });

      node.children?.forEach((child) => visit(child, depth + 1));
    };

    visit(root, 0);
    return options;
  }, [root]);

  const defaultParentPath = folderOptions[0]?.path ?? '/';

  const folderForm = useForm<FolderFormValues, any, FolderFormValues>({
    resolver: zodResolver(folderFormSchema),
    defaultValues: {
      parentPath: defaultParentPath,
      name: '',
    },
  });

  const fileForm = useForm<
    z.input<typeof fileFormSchema>,
    any,
    z.output<typeof fileFormSchema>
  >({
    resolver: zodResolver(fileFormSchema),
    defaultValues: {
      parentPath: defaultParentPath,
      name: '',
      type: fileTypeOptions[0],
      sizeKb: 512,
    },
  });

  useEffect(() => {
    if (!folderOptions.length) {
      return;
    }

    const fallbackPath = folderOptions[0].path;
    const folderParent = folderForm.getValues('parentPath');
    if (!folderOptions.some((option) => option.path === folderParent)) {
      folderForm.setValue('parentPath', fallbackPath, { shouldDirty: false, shouldValidate: true });
    }

    const fileParent = fileForm.getValues('parentPath');
    if (!folderOptions.some((option) => option.path === fileParent)) {
      fileForm.setValue('parentPath', fallbackPath, { shouldDirty: false, shouldValidate: true });
    }
  }, [folderOptions, folderForm, fileForm]);

  const handleDeleteRequest = (node: FileSystemNode) => {
    if (isMutating) {
      return;
    }

    if (node.path === '/') {
      toast.warning('No puedes eliminar la carpeta raíz.');
      return;
    }

    setDeleteTarget(node);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setDeleteTarget(null);
      setDeletingPath(null);
    }
  };

  const confirmDeletion = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeletingPath(deleteTarget.path);
      const removed = await removeItem(deleteTarget.path);
      const isFolder = removed.type === FileSystemItemKind.FOLDER;
      const label = isFolder ? 'Carpeta' : 'Archivo';
      const verb = isFolder ? 'eliminada' : 'eliminado';
      toast.success(`${label} "${removed.name}" ${verb} correctamente.`);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo eliminar el elemento';
      toast.error(message);
    } finally {
      setDeletingPath(null);
    }
  };

  const deleteKindLabel = deleteTarget?.type === FileSystemItemKind.FOLDER ? 'carpeta' : 'archivo';
  const deleteDialogTitle = deleteTarget ? `Eliminar ${deleteKindLabel}` : 'Eliminar elemento';
  const deleteDialogDescription = deleteTarget
    ? `Se eliminará el ${deleteKindLabel} "${deleteTarget.name}" (${formatBytes(deleteTarget.size)}). Esta acción no se puede deshacer.`
    : 'Esta acción no se puede deshacer.';
  const isDeleting = Boolean(deletingPath);

  const handleCreateFolder = folderForm.handleSubmit(async (values) => {
    try {
      await createFolder({ parentPath: values.parentPath, name: values.name });
      toast.success(`Carpeta "${values.name}" creada exitosamente.`);
      folderForm.reset({ parentPath: values.parentPath, name: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear la carpeta';
      toast.error(message);
    }
  });

  const handleCreateFile = fileForm.handleSubmit(async (values) => {
    try {
      await createFile({
        parentPath: values.parentPath,
        name: values.name,
        type: values.type,
        sizeKb: values.sizeKb,
      });
      toast.success(`Archivo "${values.name}" agregado correctamente.`);
      fileForm.reset({
        parentPath: values.parentPath,
        name: '',
        type: values.type,
        sizeKb: values.sizeKb,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear el archivo';
      toast.error(message);
    }
  });

  const isFolderSubmitting = folderForm.formState.isSubmitting || isMutating;
  const isFileSubmitting = fileForm.formState.isSubmitting || isMutating;
  const formsDisabled = !root || loading;

  return (
    <div className="space-y-8 pb-16">
      <AlertDialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteDialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTarget && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">Ruta:</span> {deleteTarget.path}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-slate-700">Tamaño:</span> {formatBytes(deleteTarget.size)}
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting || isMutating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletion} disabled={isDeleting || isMutating} className="bg-red-600 text-white hover:bg-red-500">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patrón Composite</h1>
          <p className="text-slate-600 max-w-2xl">
            Visualiza una jerarquía de archivos y carpetas empleando el patrón Composite. Cada carpeta agrupa archivos
            PDF, DOCX y XLSX, y su tamaño total corresponde a la suma de los elementos internos.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
              Jerarquía Recursiva
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              Composite Pattern
            </Badge>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              NestJS + React
            </Badge>
          </div>
        </div>
        <Button
          onClick={refresh}
          disabled={loading || isMutating}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={cn('h-4 w-4', { 'animate-spin': loading })} />
          Actualizar
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50/70">
          <CardContent className="py-4 text-sm text-red-700">
            Ocurrió un error al cargar los datos: {error}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/80 border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
              <Layers className="h-4 w-4 text-blue-500" /> Tamaño total
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-slate-900">
              {derivedStats.totalSize}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white/80 border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
              <FolderTree className="h-4 w-4 text-amber-500" /> Carpetas
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-slate-900">
              {derivedStats.totalFolders}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white/80 border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
              <HardDrive className="h-4 w-4 text-emerald-500" /> Archivos
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-slate-900">
              {derivedStats.totalFiles}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Estructura de carpetas</h2>
            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
              {root ? 'Actualizado' : 'Cargando...'}
            </Badge>
          </div>
          {loading && !root ? (
            <Card className="border-slate-200 bg-white/70">
              <CardContent className="flex h-40 items-center justify-center text-slate-500">
                Cargando estructura...
              </CardContent>
            </Card>
          ) : root ? (
            <FileSystemTree
              root={root}
              onDelete={handleDeleteRequest}
              busyPath={deletingPath}
              actionsDisabled={isMutating}
            />
          ) : (
            <Card className="border-slate-200 bg-white/70">
              <CardContent className="flex h-40 items-center justify-center text-slate-500 text-sm">
                No hay datos disponibles.
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 bg-white/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900">Crear elementos</CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Agrega nuevas carpetas o archivos manteniendo la jerarquía actual sin salir de esta página.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-slate-800">
                  <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <FolderPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nueva carpeta</h3>
                    <p className="text-sm text-slate-500">Selecciona la carpeta destino y define el nombre del nuevo directorio.</p>
                  </div>
                </div>
                <Form {...folderForm}>
                  <form onSubmit={handleCreateFolder} className="space-y-4">
                    <div className="grid gap-4">
                      <FormField
                        control={folderForm.control}
                        name="parentPath"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Carpeta destino</FormLabel>
                            <Select
                              disabled={formsDisabled || isFolderSubmitting || folderOptions.length === 0}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecciona una carpeta" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {folderOptions.map((option) => (
                                  <SelectItem key={option.path} value={option.path}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>La carpeta en donde se insertará la nueva subcarpeta.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={folderForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de la carpeta</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej. Documentación"
                                autoComplete="off"
                                disabled={formsDisabled || isFolderSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto" disabled={formsDisabled || isFolderSubmitting || folderOptions.length === 0}>
                      {isFolderSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderPlus className="mr-2 h-4 w-4" />}
                      Crear carpeta
                    </Button>
                  </form>
                </Form>
              </section>

              <div className="h-px bg-slate-200" />

              <section className="space-y-4">
                <div className="flex items-center gap-3 text-slate-800">
                  <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <FilePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nuevo archivo</h3>
                    <p className="text-sm text-slate-500">Define el archivo, su tamaño aproximado y el tipo de documento.</p>
                  </div>
                </div>
                <Form {...fileForm}>
                  <form onSubmit={handleCreateFile} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={fileForm.control}
                        name="parentPath"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Carpeta destino</FormLabel>
                            <Select
                              disabled={formsDisabled || isFileSubmitting || folderOptions.length === 0}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecciona una carpeta" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {folderOptions.map((option) => (
                                  <SelectItem key={option.path} value={option.path}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Directorio donde se colocará el archivo.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={fileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Nombre del archivo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej. presupuesto_final"
                                autoComplete="off"
                                disabled={formsDisabled || isFileSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={fileForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de archivo</FormLabel>
                            <Select
                              disabled={formsDisabled || isFileSubmitting}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fileTypeOptions.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={fileForm.control}
                        name="sizeKb"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tamaño estimado (KB)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                step={1}
                                placeholder="512"
                                disabled={formsDisabled || isFileSubmitting}
                                {...field}
                                value={Number.isNaN(Number(field.value)) ? '' : Number(field.value)}
                                onChange={(event) => field.onChange(event.target.value)}
                              />
                            </FormControl>
                            <FormDescription>Se convierte automáticamente a bytes para el backend.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto" disabled={formsDisabled || isFileSubmitting || folderOptions.length === 0}>
                      {isFileSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FilePlus className="mr-2 h-4 w-4" />}
                      Crear archivo
                    </Button>
                  </form>
                </Form>
              </section>
            </CardContent>
          </Card>

          <Card className="h-full border-slate-200 bg-slate-900 text-slate-100 flex flex-col overflow-hidden max-h-[65vh] lg:sticky lg:top-24 lg:max-h-[calc(100vh-220px)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-300">
                <Download className="h-4 w-4" /> Estructura en texto
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Resultado directo del backend, útil para depuración
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <pre className="h-full min-h-0 w-full overflow-auto rounded-lg bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                {structure || 'Cargando...'}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
