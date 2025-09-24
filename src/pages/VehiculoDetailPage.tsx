import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVehiculo } from '@/hooks/useVehiculos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Car } from 'lucide-react';

export function VehiculoDetailPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { vehiculo, loading } = useVehiculo(codigo ? parseInt(codigo) : null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'AUTO':
        return 'default';
      case 'CAMIONETA':
        return 'secondary';
      case 'CAMION':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/vehiculos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalle del Vehículo</h1>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  if (!vehiculo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/vehiculos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehículo no encontrado</h1>
          </div>
        </div>
        <p className="text-gray-600">El vehículo solicitado no existe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/vehiculos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehiculo.nombre}
            </h1>
            <p className="text-gray-600 mt-2">
              Código: {vehiculo.codigo} • Placa: {vehiculo.placa}
            </p>
          </div>
        </div>
        
        <Button asChild>
          <Link to={`/vehiculos/${vehiculo.codigo}/editar`}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Información General
            </CardTitle>
            <CardDescription>
              Datos básicos del vehículo construido con Builder Pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Código</label>
                <p className="text-lg font-semibold">{vehiculo.codigo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-lg font-semibold">{vehiculo.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">País</label>
                <p className="text-lg">{vehiculo.pais}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Placa</label>
                <p className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                  {vehiculo.placa}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo</label>
                <div className="mt-1">
                  <Badge variant={getTipoBadgeVariant(vehiculo.tipo)} className="text-sm">
                    {vehiculo.tipo}
                  </Badge>
                </div>
              </div>
              {vehiculo.propietarioId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">ID Propietario</label>
                  <p className="text-lg">{vehiculo.propietarioId}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Características Específicas */}
        <Card>
          <CardHeader>
            <CardTitle>Características Específicas</CardTitle>
            <CardDescription>
              Detalles específicos según el tipo de vehículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehiculo.tipo === 'AUTO' && vehiculo.numPuertas && (
              <div>
                <label className="text-sm font-medium text-gray-500">Número de Puertas</label>
                <p className="text-2xl font-bold text-blue-600">{vehiculo.numPuertas}</p>
              </div>
            )}
            
            {vehiculo.tipo === 'CAMIONETA' && vehiculo.traccion && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo de Tracción</label>
                <p className="text-2xl font-bold text-green-600">{vehiculo.traccion}</p>
              </div>
            )}
            
            {vehiculo.tipo === 'CAMION' && vehiculo.capacidadTon && (
              <div>
                <label className="text-sm font-medium text-gray-500">Capacidad de Carga</label>
                <p className="text-2xl font-bold text-orange-600">{vehiculo.capacidadTon} toneladas</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <label className="text-sm font-medium text-gray-500">Costo de Matrícula</label>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(vehiculo.costoMatricula)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Calculado automáticamente según el tipo y características
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del Patrón */}
      <Card>
        <CardHeader>
          <CardTitle>Patrón Builder</CardTitle>
          <CardDescription>
            Este vehículo fue creado utilizando el patrón Builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">¿Cómo funciona el Builder Pattern?</h4>
            <p className="text-blue-800 text-sm">
              El patrón Builder permite la construcción paso a paso de objetos complejos. 
              En este caso, el VehiculoBuilder facilita la creación de diferentes tipos de vehículos 
              (Auto, Camioneta, Camión) con sus características específicas, validando que cada 
              tipo tenga los campos requeridos y calculando automáticamente el costo de matrícula 
              según las reglas de negocio definidas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}