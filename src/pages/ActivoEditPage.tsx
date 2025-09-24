import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useActivos } from '@/hooks/useActivos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ActivoFijo, ActualizarActivoDto, TipoActivo } from '@/types';

const TIPOS_ACTIVO: TipoActivo[] = ['COMPUTADOR', 'MESA', 'AUTO', 'SILLA', 'OTRO'];

export function ActivoEditPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { updateActivo, fetchActivo } = useActivos();
  
  const [activo, setActivo] = useState<ActivoFijo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingActivo, setLoadingActivo] = useState(true);
  const [formData, setFormData] = useState<ActualizarActivoDto>({
    nombre: '',
    precio: 0,
    tipo: 'COMPUTADOR',
    cpu: '',
    ramGB: undefined,
    material: '',
    placa: '',
    ergonomica: false,
  });

  useEffect(() => {
    const loadActivo = async () => {
      if (!codigo) return;
      
      try {
        setLoadingActivo(true);
        const data = await fetchActivo(parseInt(codigo));
        if (data) {
          setActivo(data);
          setFormData({
            nombre: data.nombre,
            precio: data.precio,
            tipo: data.tipo,
            cpu: data.cpu || '',
            ramGB: data.ramGB,
            material: data.material || '',
            placa: data.placa || '',
            ergonomica: data.ergonomica || false,
          });
        }
      } catch (error) {
        toast.error('Error al cargar activo', {
          description: 'No se pudo cargar la información del activo.',
        });
      } finally {
        setLoadingActivo(false);
      }
    };

    loadActivo();
  }, [codigo, fetchActivo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo) return;

    setLoading(true);
    try {
      await updateActivo(parseInt(codigo), formData);
      toast.success('Activo actualizado', {
        description: 'El activo fijo ha sido actualizado exitosamente.',
      });
      navigate(`/activos/${codigo}`);
    } catch (error) {
      toast.error('Error al actualizar', {
        description: 'No se pudo actualizar el activo fijo. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ActualizarActivoDto, value: string | number | boolean | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loadingActivo) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="glass border-0 shadow-2xl">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-green-500" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">Cargando activo...</h3>
                <p className="text-gray-600">Obteniendo datos para editar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activo) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="glass border-0 shadow-2xl border-red-200">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-red-700">Activo no encontrado</h3>
                <p className="text-red-600 max-w-md">
                  No se pudo encontrar el activo fijo que deseas editar.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/activos')} 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover-lift"
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
          onClick={() => navigate(`/activos/${codigo}`)}
          className="hover-lift hover:bg-green-50 hover:border-green-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Editar Activo Fijo
          </h1>
          <p className="text-gray-600">Modificar datos del activo #{codigo}</p>
        </div>
      </div>

      {/* Formulario */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
          <CardTitle className="text-2xl text-green-900 flex items-center">
            <Package className="w-6 h-6 mr-3 text-green-600" />
            Información del Activo Fijo
          </CardTitle>
          <CardDescription className="text-green-700">
            Actualiza los datos del activo utilizando el patrón Factory
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Activo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Ej: Laptop Dell Inspiron"
                    required
                    className="focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio">Precio *</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => handleInputChange('precio', parseFloat(e.target.value))}
                    placeholder="Ej: 1500000"
                    required
                    min="0"
                    className="focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tipo">Tipo de Activo *</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value: TipoActivo) => handleInputChange('tipo', value)}
                  >
                    <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_ACTIVO.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Características Específicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Características Específicas</h3>
              
              {formData.tipo === 'COMPUTADOR' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpu">Procesador</Label>
                    <Input
                      id="cpu"
                      value={formData.cpu}
                      onChange={(e) => handleInputChange('cpu', e.target.value)}
                      placeholder="Ej: Intel Core i7"
                      className="focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ramGB">Memoria RAM (GB)</Label>
                    <Input
                      id="ramGB"
                      type="number"
                      value={formData.ramGB || ''}
                      onChange={(e) => handleInputChange('ramGB', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 16"
                      min="1"
                      className="focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {formData.tipo === 'MESA' && (
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    placeholder="Ej: Madera, Metal, Vidrio"
                    className="focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              )}

              {formData.tipo === 'AUTO' && (
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa del Vehículo</Label>
                  <Input
                    id="placa"
                    value={formData.placa}
                    onChange={(e) => handleInputChange('placa', e.target.value)}
                    placeholder="Ej: ABC-123"
                    className="focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              )}

              {formData.tipo === 'SILLA' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ergonomica"
                    checked={formData.ergonomica}
                    onCheckedChange={(checked) => handleInputChange('ergonomica', checked as boolean)}
                  />
                  <Label htmlFor="ergonomica">Silla ergonómica</Label>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/activos/${codigo}`)}
                disabled={loading}
                className="hover-lift"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover-lift shadow-lg"
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