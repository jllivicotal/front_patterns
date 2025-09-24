import { useParams, useNavigate, Link } from 'react-router-dom';
import { useActivo } from '@/hooks/useActivos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Package, TrendingDown } from 'lucide-react';

export function ActivoDetailPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { activo, loading } = useActivo(codigo ? parseInt(codigo) : null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTipoBadgeVariant = (tipo: string) => {
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

  const getDepreciationPercentage = (precio: number, valorActual: number) => {
    const depreciation = ((precio - valorActual) / precio) * 100;
    return Math.round(depreciation);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/activos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalle del Activo</h1>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando activo...</p>
        </div>
      </div>
    );
  }

  if (!activo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/activos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activo no encontrado</h1>
          </div>
        </div>
        <p className="text-gray-600">El activo solicitado no existe.</p>
      </div>
    );
  }

  const depreciation = getDepreciationPercentage(activo.precio, activo.valorActual);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/activos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activo.nombre}
            </h1>
            <p className="text-gray-600 mt-2">
              Código: {activo.codigo} • Tipo: {activo.tipo}
            </p>
          </div>
        </div>
        
        <Button asChild>
          <Link to={`/activos/${activo.codigo}/editar`}>
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
              <Package className="w-5 h-5 mr-2" />
              Información General
            </CardTitle>
            <CardDescription>
              Datos básicos del activo creado con Factory Pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Código</label>
                <p className="text-lg font-semibold">{activo.codigo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-lg font-semibold">{activo.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo</label>
                <div className="mt-1">
                  <Badge variant={getTipoBadgeVariant(activo.tipo)} className="text-sm">
                    {activo.tipo}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Precio Original</label>
                <p className="text-lg font-semibold">{formatCurrency(activo.precio)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valor y Depreciación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="w-5 h-5 mr-2" />
              Valor y Depreciación
            </CardTitle>
            <CardDescription>
              Cálculo automático del valor actual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Actual</label>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(activo.valorActual)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Depreciación</label>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={depreciation > 50 ? 'destructive' : depreciation > 25 ? 'secondary' : 'outline'}
                  className="text-lg px-3 py-1"
                >
                  -{depreciation}%
                </Badge>
                <span className="text-sm text-gray-600">
                  (-{formatCurrency(activo.precio - activo.valorActual)})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Características Específicas */}
      <Card>
        <CardHeader>
          <CardTitle>Características Específicas</CardTitle>
          <CardDescription>
            Detalles específicos según el tipo de activo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activo.tipo === 'COMPUTADOR' && (
              <>
                {activo.cpu && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">CPU</label>
                    <p className="text-lg font-semibold text-blue-600">{activo.cpu}</p>
                  </div>
                )}
                {activo.ramGB && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">RAM</label>
                    <p className="text-lg font-semibold text-blue-600">{activo.ramGB} GB</p>
                  </div>
                )}
              </>
            )}
            
            {activo.tipo === 'MESA' && activo.material && (
              <div>
                <label className="text-sm font-medium text-gray-500">Material</label>
                <p className="text-lg font-semibold text-green-600">{activo.material}</p>
              </div>
            )}
            
            {activo.tipo === 'AUTO' && activo.placa && (
              <div>
                <label className="text-sm font-medium text-gray-500">Placa</label>
                <p className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">{activo.placa}</p>
              </div>
            )}
            
            {activo.tipo === 'SILLA' && activo.ergonomica !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo</label>
                <p className="text-lg font-semibold text-purple-600">
                  {activo.ergonomica ? 'Ergonómica' : 'Estándar'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Opciones Adicionales */}
      {activo.opciones && Object.keys(activo.opciones).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Opciones Adicionales</CardTitle>
            <CardDescription>
              Información complementaria del activo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activo.opciones.marca && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Marca</label>
                  <p className="text-lg">{activo.opciones.marca}</p>
                </div>
              )}
              {activo.opciones.modelo && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Modelo</label>
                  <p className="text-lg">{activo.opciones.modelo}</p>
                </div>
              )}
              {activo.opciones.serie && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Serie</label>
                  <p className="text-lg">{activo.opciones.serie}</p>
                </div>
              )}
              {activo.opciones.color && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Color</label>
                  <p className="text-lg">{activo.opciones.color}</p>
                </div>
              )}
              {activo.opciones.dimensiones && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Dimensiones</label>
                  <p className="text-lg">{activo.opciones.dimensiones}</p>
                </div>
              )}
              {activo.opciones.vidaUtilMeses && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Vida Útil</label>
                  <p className="text-lg">{activo.opciones.vidaUtilMeses} meses</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del Patrón */}
      <Card>
        <CardHeader>
          <CardTitle>Patrón Factory</CardTitle>
          <CardDescription>
            Este activo fue creado utilizando el patrón Factory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">¿Cómo funciona el Factory Pattern?</h4>
            <p className="text-green-800 text-sm">
              El patrón Factory centraliza la creación de diferentes tipos de activos fijos. 
              Basándose en el tipo especificado (Computador, Mesa, Auto, Silla, Otro), 
              la factory instancia la clase correcta con las propiedades específicas requeridas. 
              Cada tipo implementa su propio cálculo de depreciación, permitiendo que el sistema 
              maneje de manera polimórfica diferentes tipos de activos con comportamientos específicos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}