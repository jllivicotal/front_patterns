import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehiculos, useVehiculo } from '@/hooks/useVehiculos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Car, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ActualizarVehiculoDto, TipoVehiculo } from '@/types';

const TIPOS_VEHICULO: TipoVehiculo[] = ['AUTO', 'CAMIONETA', 'CAMION'];

export function VehiculoEditPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { updateVehiculo } = useVehiculos();
  const { vehiculo, loading: loadingVehiculo } = useVehiculo(codigo ? parseInt(codigo) : null);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ActualizarVehiculoDto>({
    nombre: '',
    pais: '',
    placa: '',
    tipo: 'AUTO',
    propietarioId: undefined,
    numPuertas: undefined,
    traccion: '',
    capacidadTon: undefined,
  });

  useEffect(() => {
    if (vehiculo) {
      setFormData({
        nombre: vehiculo.nombre,
        pais: vehiculo.pais,
        placa: vehiculo.placa,
        tipo: vehiculo.tipo,
        propietarioId: vehiculo.propietarioId,
        numPuertas: vehiculo.numPuertas,
        traccion: vehiculo.traccion,
        capacidadTon: vehiculo.capacidadTon,
      });
    }
  }, [vehiculo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo) return;

    setLoading(true);
    try {
      await updateVehiculo(parseInt(codigo), formData);
      toast.success('✅ Vehículo actualizado', {
        description: 'Los cambios se han guardado exitosamente.',
        duration: 4000,
      });
      navigate(`/vehiculos/${codigo}`);
    } catch (error) {
      toast.error('❌ Error al actualizar', {
        description: 'No se pudieron guardar los cambios. Revisa los datos e inténtalo de nuevo.',
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ActualizarVehiculoDto, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loadingVehiculo) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="glass border-0 shadow-2xl">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">Cargando vehículo...</h3>
                <p className="text-gray-600">Obteniendo datos para editar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!vehiculo) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="glass border-0 shadow-2xl border-red-200">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-red-700">Vehículo no encontrado</h3>
                <p className="text-red-600 max-w-md">
                  No se pudo encontrar el vehículo que deseas editar.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/vehiculos')} 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover-lift"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la Lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/vehiculos/${codigo}`)}
          className="hover-lift hover:bg-blue-50 hover:border-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Editar Vehículo
          </h1>
          <p className="text-gray-600">Modificar datos del vehículo #{codigo}</p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <CardTitle className="text-2xl text-blue-900 flex items-center">
            <Car className="w-6 h-6 mr-3 text-blue-600" />
            Información del Vehículo
          </CardTitle>
          <CardDescription className="text-blue-700">
            Actualiza los datos del vehículo utilizando el patrón Builder
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Vehículo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Ej: Toyota Corolla 2020"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">País *</Label>
                  <Input
                    id="pais"
                    value={formData.pais}
                    onChange={(e) => handleInputChange('pais', e.target.value)}
                    placeholder="Ej: Colombia"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    value={formData.placa}
                    onChange={(e) => handleInputChange('placa', e.target.value)}
                    placeholder="Ej: ABC-123"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Vehículo *</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value: TipoVehiculo) => handleInputChange('tipo', value)}
                  >
                    <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_VEHICULO.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propietarioId">ID del Propietario</Label>
                  <Input
                    id="propietarioId"
                    type="number"
                    value={formData.propietarioId || ''}
                    onChange={(e) => handleInputChange('propietarioId', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Ej: 12345"
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Características Específicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Características Específicas</h3>
              
              {formData.tipo === 'AUTO' && (
                <div className="space-y-2">
                  <Label htmlFor="numPuertas">Número de Puertas</Label>
                  <Input
                    id="numPuertas"
                    type="number"
                    value={formData.numPuertas || ''}
                    onChange={(e) => handleInputChange('numPuertas', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Ej: 4"
                    min="2"
                    max="5"
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {formData.tipo === 'CAMIONETA' && (
                <div className="space-y-2">
                  <Label htmlFor="traccion">Tipo de Tracción</Label>
                  <Input
                    id="traccion"
                    value={formData.traccion || ''}
                    onChange={(e) => handleInputChange('traccion', e.target.value)}
                    placeholder="Ej: 4x4, AWD, FWD"
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {formData.tipo === 'CAMION' && (
                <div className="space-y-2">
                  <Label htmlFor="capacidadTon">Capacidad de Carga (Toneladas)</Label>
                  <Input
                    id="capacidadTon"
                    type="number"
                    step="0.1"
                    value={formData.capacidadTon || ''}
                    onChange={(e) => handleInputChange('capacidadTon', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Ej: 5.5"
                    min="0.1"
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/vehiculos/${codigo}`)}
                disabled={loading}
                className="hover-lift"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover-lift shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}