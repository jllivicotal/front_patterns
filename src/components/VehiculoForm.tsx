import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TipoVehiculo } from '@/types';
import type { CrearVehiculoDto, Vehiculo } from '@/types';

const vehiculoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  pais: z.string().min(1, 'El país es requerido'),
  placa: z.string().min(1, 'La placa es requerida'),
  tipo: z.enum([TipoVehiculo.AUTO, TipoVehiculo.CAMIONETA, TipoVehiculo.CAMION]),
  
  // Campos específicos
  numPuertas: z.number().min(1).optional(),
  traccion: z.string().optional(),
  capacidadTon: z.number().min(0).optional(),
}).refine((data) => {
  // Validación condicional según el tipo
  if (data.tipo === TipoVehiculo.AUTO && (!data.numPuertas || data.numPuertas < 1)) {
    return false;
  }
  if (data.tipo === TipoVehiculo.CAMIONETA && (!data.traccion || data.traccion.trim() === '')) {
    return false;
  }
  if (data.tipo === TipoVehiculo.CAMION && (!data.capacidadTon || data.capacidadTon <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Campos específicos requeridos según el tipo de vehículo",
  path: ["tipo"],
});

type VehiculoFormData = z.infer<typeof vehiculoSchema>;

interface VehiculoFormProps {
  onSubmit: (data: CrearVehiculoDto) => Promise<void>;
  initialData?: Vehiculo;
  isEdit?: boolean;
  loading?: boolean;
}

export function VehiculoForm({ onSubmit, initialData, isEdit = false, loading = false }: VehiculoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: initialData ? {
      nombre: initialData.nombre,
      pais: initialData.pais,
      placa: initialData.placa,
      tipo: initialData.tipo,
      numPuertas: initialData.numPuertas,
      traccion: initialData.traccion,
      capacidadTon: initialData.capacidadTon,
    } : undefined,
  });

  const tipo = watch('tipo');

  const onFormSubmit = async (data: VehiculoFormData) => {
    // Limpiar campos según el tipo
    const cleanedData = { ...data };
    
    // Agregar propietarioId por defecto y limpiar campos no deseados
    const dataWithOwner = {
      ...cleanedData,
      propietarioId: 1, // ID por defecto
    };

    // Eliminar campos que no deben enviarse al crear
    delete (dataWithOwner as any).codigo;
    delete (dataWithOwner as any).costoMatricula;
    
    if (tipo === TipoVehiculo.AUTO) {
      delete dataWithOwner.traccion;
      delete dataWithOwner.capacidadTon;
      if (dataWithOwner.numPuertas !== undefined) {
        dataWithOwner.numPuertas = Number(dataWithOwner.numPuertas);
      }
    } else if (tipo === TipoVehiculo.CAMIONETA) {
      delete dataWithOwner.numPuertas;
      delete dataWithOwner.capacidadTon;
    } else if (tipo === TipoVehiculo.CAMION) {
      delete dataWithOwner.numPuertas;
      delete dataWithOwner.traccion;
      if (dataWithOwner.capacidadTon !== undefined) {
        dataWithOwner.capacidadTon = Number(dataWithOwner.capacidadTon);
      }
    }

    await onSubmit(dataWithOwner);
  };

  const renderSpecificFields = () => {
    switch (tipo) {
      case TipoVehiculo.AUTO:
        return (
          <div className="space-y-2">
            <Label htmlFor="numPuertas">Número de Puertas *</Label>
            <Input
              id="numPuertas"
              type="number"
              min="1"
              placeholder="Ej: 4"
              required
              {...register('numPuertas', { 
                setValueAs: (v) => v === '' ? undefined : parseInt(v, 10) 
              })}
            />
            {errors.numPuertas && (
              <p className="text-sm text-red-600">{errors.numPuertas.message}</p>
            )}
          </div>
        );

      case TipoVehiculo.CAMIONETA:
        return (
          <div className="space-y-2">
            <Label htmlFor="traccion">Tipo de Tracción *</Label>
            <Select 
              value={watch('traccion') || ''} 
              onValueChange={(value) => setValue('traccion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de tracción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4x2">4x2</SelectItem>
                <SelectItem value="4x4">4x4</SelectItem>
              </SelectContent>
            </Select>
            {errors.traccion && (
              <p className="text-sm text-red-600">{errors.traccion.message}</p>
            )}
          </div>
        );

      case TipoVehiculo.CAMION:
        return (
          <div className="space-y-2">
            <Label htmlFor="capacidadTon">Capacidad (Toneladas) *</Label>
            <Input
              id="capacidadTon"
              type="number"
              min="0"
              step="0.1"
              placeholder="Ej: 25.5"
              {...register('capacidadTon', { 
                setValueAs: (v) => v === '' ? undefined : parseFloat(v) 
              })}
            />
            {errors.capacidadTon && (
              <p className="text-sm text-red-600">{errors.capacidadTon.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </CardTitle>
        <CardDescription>
          {isEdit 
            ? 'Modifica los datos del vehículo existente' 
            : 'Utiliza el patrón Builder para crear un nuevo vehículo'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Ej: Toyota Corolla"
                {...register('nombre')}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                placeholder="Ej: Japón"
                {...register('pais')}
              />
              {errors.pais && (
                <p className="text-sm text-red-600">{errors.pais.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="placa">Placa (debe ser única)</Label>
              <Input
                id="placa"
                placeholder="Ej: ABC-123, XYZ-789 (cada vehículo debe tener una placa diferente)"
                {...register('placa')}
              />
              {errors.placa && (
                <p className="text-sm text-red-600">{errors.placa.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Vehículo</Label>
              <Select 
                value={tipo || ''} 
                onValueChange={(value) => setValue('tipo', value as typeof TipoVehiculo[keyof typeof TipoVehiculo])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoVehiculo.AUTO}>Auto</SelectItem>
                  <SelectItem value={TipoVehiculo.CAMIONETA}>Camioneta</SelectItem>
                  <SelectItem value={TipoVehiculo.CAMION}>Camión</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-red-600">{errors.tipo.message}</p>
              )}
            </div>
          </div>



          {/* Campos específicos según tipo */}
          {tipo && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">
                Características específicas de {tipo.toLowerCase()}
              </h3>
              {renderSpecificFields()}
            </div>
          )}

          {/* Botón de envío */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Vehículo')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}