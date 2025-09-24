import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Package, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ActivoFijo } from '@/types';

interface ActivoListProps {
  activos: ActivoFijo[];
  loading: boolean;
  error: string | null;
  onDelete: (codigo: number) => void;
}

export function ActivoList({ activos, loading, error, onDelete }: ActivoListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (codigo: number) => {
    setDeletingId(codigo);
    try {
      await onDelete(codigo);
      toast.success('🗑️ Activo fijo eliminado', {
        description: 'El activo fijo ha sido eliminado permanentemente.',
        duration: 4000,
      });
    } catch (error) {
      toast.error('❌ Error al eliminar', {
        description: 'No se pudo eliminar el activo fijo. Verifica que no esté siendo utilizado.',
        duration: 6000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTipoBadgeVariant = (tipo: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (tipo) {
      case 'COMPUTADOR':
        return 'default';
      case 'MESA':
        return 'secondary';
      case 'AUTO':
        return 'outline';
      case 'SILLA':
        return 'destructive';
      case 'OTRO':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getSpecificInfo = (activo: ActivoFijo) => {
    switch (activo.tipo) {
      case 'COMPUTADOR':
        return `${activo.cpu || 'N/A'} • ${activo.ramGB || 0}GB RAM`;
      case 'MESA':
        return `Material: ${activo.material || 'N/A'}`;
      case 'AUTO':
        return `Placa: ${activo.placa || 'N/A'}`;
      case 'SILLA':
        return activo.ergonomica ? 'Ergonómica' : 'Estándar';
      default:
        return 'N/A';
    }
  };

  const getDepreciationPercentage = (precio: number, valorActual: number) => {
    const depreciation = ((precio - valorActual) / precio) * 100;
    return Math.round(depreciation);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="glass border-0 shadow-2xl">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-green-500" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">Cargando activos fijos...</h3>
                <p className="text-gray-600">Obteniendo la lista de activos registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="glass border-0 shadow-2xl border-red-200">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-red-700">Error al cargar activos</h3>
                <p className="text-red-600 max-w-md">
                  No se pudieron cargar los activos fijos. Por favor, verifica tu conexión e inténtalo de nuevo.
                </p>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover-lift"
              >
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Gestión de Activos Fijos
          </h1>
          <p className="text-gray-600 text-lg">
            Administra el inventario de activos utilizando el patrón Factory
          </p>
        </div>
        <Button 
          asChild 
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover-lift shadow-lg"
          size="lg"
        >
          <Link to="/activos/nuevo">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Activo
          </Link>
        </Button>
      </div>

      <Card className="glass border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-green-900 flex items-center">
                <Package className="w-6 h-6 mr-3 text-green-600" />
                Lista de Activos Fijos
              </CardTitle>
              <CardDescription className="text-green-700">
                Inventario completo de activos registrados en el sistema
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-4 py-2 text-sm font-medium">
              Factory Pattern
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {activos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-green-500 animate-pulse" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-semibold text-gray-800">No hay activos registrados</h3>
                <p className="text-gray-600 max-w-md">
                  Comienza creando tu primer activo fijo para gestionar el inventario
                </p>
              </div>
              <Button 
                asChild 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover-lift shadow-lg"
                size="lg"
              >
                <Link to="/activos/nuevo">
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Primer Activo
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Total de activos: <span className="font-medium text-green-600">{activos.length}</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Factory Pattern
                </Badge>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-150">
                      <TableHead className="font-semibold text-green-900">Código</TableHead>
                      <TableHead className="font-semibold text-green-900">Nombre</TableHead>
                      <TableHead className="font-semibold text-green-900">Tipo</TableHead>
                      <TableHead className="font-semibold text-green-900">Precio</TableHead>
                      <TableHead className="font-semibold text-green-900">Valor Actual</TableHead>
                      <TableHead className="font-semibold text-green-900">Características</TableHead>
                      <TableHead className="text-center font-semibold text-green-900">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activos.map((activo) => {
                      const depreciationPercentage = getDepreciationPercentage(activo.precio, activo.valorActual);
                      return (
                        <TableRow key={activo.codigo} className="hover-lift hover:bg-green-50/50 transition-all duration-200">
                          <TableCell className="font-medium text-green-800">
                            #{activo.codigo}
                          </TableCell>
                          <TableCell className="font-medium">{activo.nombre}</TableCell>
                          <TableCell>
                            <Badge variant={getTipoBadgeVariant(activo.tipo)} className="hover-lift">
                              {activo.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-green-700">
                            {formatCurrency(activo.precio)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <span className="font-medium">{formatCurrency(activo.valorActual)}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                depreciationPercentage > 50 
                                  ? 'bg-red-100 text-red-700'
                                  : depreciationPercentage > 25
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                -{depreciationPercentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 font-medium">
                            {getSpecificInfo(activo)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="hover-lift hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                              >
                                <Link to={`/activos/${activo.codigo}`}>
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="hover-lift hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700"
                              >
                                <Link to={`/activos/${activo.codigo}/editar`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={deletingId === activo.codigo}
                                    className="hover-lift hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md">
                                  <AlertDialogHeader className="text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                                      <Trash2 className="h-6 w-6 text-red-600" />
                                    </div>
                                    <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                                      Confirmar eliminación
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm text-gray-500 mt-2">
                                      ¿Estás seguro de que deseas eliminar el activo{' '}
                                      <span className="font-medium text-gray-900">"{activo.nombre}"</span>?{' '}
                                      Esta acción no se puede deshacer.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-3 sm:gap-3">
                                    <AlertDialogCancel className="mt-0 w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50">
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(activo.codigo)}
                                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}