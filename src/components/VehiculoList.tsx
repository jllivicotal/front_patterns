import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, Car, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import type { Vehiculo } from '../types';

interface VehiculoListProps {
  vehiculos: Vehiculo[];
  loading: boolean;
  error: string | null;
  onDelete: (codigo: number) => Promise<void>;
}

export default function VehiculoList({ vehiculos, loading, error, onDelete }: VehiculoListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (codigo: number) => {
    setDeletingId(codigo);
    try {
      await onDelete(codigo);
      toast.success('🗑️ Vehículo eliminado', {
        description: 'El vehículo ha sido eliminado permanentemente.',
        duration: 4000,
      });
    } catch (error) {
      toast.error('❌ Error al eliminar', {
        description: 'No se pudo eliminar el vehículo. Verifica que no esté siendo utilizado.',
        duration: 6000,
      });
      console.error('Error al eliminar vehículo:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  };

  const getSpecificInfo = (vehiculo: Vehiculo) => {
    if (vehiculo.numPuertas) {
      return `${vehiculo.numPuertas} puertas`;
    }
    if (vehiculo.capacidadTon) {
      return `Carga: ${vehiculo.capacidadTon} ton`;
    }
    if (vehiculo.traccion) {
      return `Tracción: ${vehiculo.traccion}`;
    }
    return 'N/A';
  };

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'auto':
        return 'default';
      case 'camion':
        return 'secondary';
      case 'camioneta':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="glass border-0 shadow-2xl">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">Cargando vehículos...</h3>
                <p className="text-gray-600">Obteniendo la lista de vehículos registrados</p>
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
                <Car className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-red-700">Error al cargar vehículos</h3>
                <p className="text-red-600 max-w-md">
                  No se pudieron cargar los vehículos. Por favor, verifica tu conexión e inténtalo de nuevo.
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Gestión de Vehículos
          </h1>
          <p className="text-gray-600 text-lg">
            Administra el inventario de vehículos utilizando el patrón Builder
          </p>
        </div>
        <Button 
          asChild 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover-lift shadow-lg"
          size="lg"
        >
          <Link to="/vehiculos/nuevo">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Vehículo
          </Link>
        </Button>
      </div>

      <Card className="glass border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-blue-900 flex items-center">
                <Car className="w-6 h-6 mr-3 text-blue-600" />
                Lista de Vehículos
              </CardTitle>
              <CardDescription className="text-blue-700">
                Inventario completo de vehículos registrados en el sistema
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-sm font-medium">
              Builder Pattern
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {vehiculos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Car className="w-12 h-12 text-blue-500 animate-pulse" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-semibold text-gray-800">No hay vehículos registrados</h3>
                <p className="text-gray-600 max-w-md">
                  Comienza creando tu primer vehículo para gestionar el inventario
                </p>
              </div>
              <Button 
                asChild 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover-lift shadow-lg"
                size="lg"
              >
                <Link to="/vehiculos/nuevo">
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Primer Vehículo
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Total de vehículos: <span className="font-medium text-blue-600">{vehiculos.length}</span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Builder Pattern
                </Badge>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150">
                      <TableHead className="font-semibold text-blue-900">Código</TableHead>
                      <TableHead className="font-semibold text-blue-900">Nombre</TableHead>
                      <TableHead className="font-semibold text-blue-900">Placa</TableHead>
                      <TableHead className="font-semibold text-blue-900">Tipo</TableHead>
                      <TableHead className="font-semibold text-blue-900">País</TableHead>
                      <TableHead className="font-semibold text-blue-900">Características</TableHead>
                      <TableHead className="font-semibold text-blue-900">Costo Matrícula</TableHead>
                      <TableHead className="text-center font-semibold text-blue-900">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehiculos.map((vehiculo) => (
                      <TableRow key={vehiculo.codigo} className="hover-lift hover:bg-blue-50/50 transition-all duration-200">
                        <TableCell className="font-medium text-blue-800">
                          #{vehiculo.codigo}
                        </TableCell>
                        <TableCell className="font-medium">{vehiculo.nombre}</TableCell>
                        <TableCell>
                          <code className="bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-lg text-sm font-mono border">
                            {vehiculo.placa}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTipoBadgeVariant(vehiculo.tipo)} className="hover-lift">
                            {vehiculo.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{vehiculo.pais}</TableCell>
                        <TableCell className="text-sm text-gray-600 font-medium">
                          {getSpecificInfo(vehiculo)}
                        </TableCell>
                        <TableCell className="font-bold text-green-700">
                          {formatCurrency(vehiculo.costoMatricula)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="hover-lift hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                            >
                              <Link to={`/vehiculos/${vehiculo.codigo}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="hover-lift hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700"
                            >
                              <Link to={`/vehiculos/${vehiculo.codigo}/editar`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={deletingId === vehiculo.codigo}
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
                                    ¿Estás seguro de que deseas eliminar el vehículo{' '}
                                    <span className="font-medium text-gray-900">"{vehiculo.nombre}"</span>?{' '}
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3 sm:gap-3">
                                  <AlertDialogCancel className="mt-0 w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(vehiculo.codigo)}
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
                    ))}
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