import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { TipoActivo } from '@/types';
import type { CrearActivoDto, ActivoFijo } from '@/types';

const activoSchema = z.object({
  codigo: z.number().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  precio: z.number().min(0, 'El precio debe ser positivo'),
  tipo: z.enum([TipoActivo.COMPUTADOR, TipoActivo.MESA, TipoActivo.AUTO, TipoActivo.SILLA, TipoActivo.OTRO]),
  
  // Opciones comunes
  vidaUtilMeses: z.number().min(1).optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  serie: z.string().optional(),
  color: z.string().optional(),
  dimensiones: z.string().optional(),
  material: z.string().optional(),
  placaVehiculo: z.string().optional(),
  
  // Campos específicos
  cpu: z.string().optional(),
  ramGB: z.number().min(1).optional(),
  placa: z.string().optional(),
  ergonomica: z.boolean().optional(),
});

type ActivoFormData = z.infer<typeof activoSchema>;

interface ActivoFormProps {
  onSubmit: (data: CrearActivoDto) => Promise<void>;
  initialData?: ActivoFijo;
  isEdit?: boolean;
  loading?: boolean;
}

export function ActivoForm({ onSubmit, initialData, isEdit = false, loading = false }: ActivoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ActivoFormData>({
    resolver: zodResolver(activoSchema),
    defaultValues: initialData ? {
      codigo: initialData.codigo,
      nombre: initialData.nombre,
      precio: initialData.precio,
      tipo: initialData.tipo,
      vidaUtilMeses: initialData.opciones?.vidaUtilMeses,
      marca: initialData.opciones?.marca,
      modelo: initialData.opciones?.modelo,
      serie: initialData.opciones?.serie,
      color: initialData.opciones?.color,
      dimensiones: initialData.opciones?.dimensiones,
      material: initialData.opciones?.material,
      placaVehiculo: initialData.opciones?.placaVehiculo,
      cpu: initialData.cpu,
      ramGB: initialData.ramGB,
      placa: initialData.placa,
      ergonomica: initialData.ergonomica,
    } : undefined,
  });

  const tipo = watch('tipo');

  const onFormSubmit = async (data: ActivoFormData) => {
    // Asegurar que los números son realmente números
    const codigo = typeof data.codigo === 'string' ? parseInt(data.codigo, 10) : data.codigo;
    const precio = typeof data.precio === 'string' ? parseFloat(data.precio) : data.precio;
    
    if (isNaN(codigo) || codigo < 1) {
      setError('codigo', { message: 'El código debe ser un número válido mayor a 0' });
      return;
    }
    
    if (isNaN(precio) || precio < 0) {
      setError('precio', { message: 'El precio debe ser un número válido mayor o igual a 0' });
      return;
    }

    // Construir el objeto con opciones
    const opciones = {
      vidaUtilMeses: data.vidaUtilMeses,
      marca: data.marca,
      modelo: data.modelo,
      serie: data.serie,
      color: data.color,
      dimensiones: data.dimensiones,
      material: data.material,
      placaVehiculo: data.placaVehiculo,
    };

    // Limpiar campos vacíos de opciones
    const cleanedOpciones = Object.fromEntries(
      Object.entries(opciones).filter(([_, value]) => value !== undefined && value !== '')
    );

    const activoData: CrearActivoDto = {
      codigo,
      nombre: data.nombre,
      precio,
      tipo: data.tipo,
      opciones: Object.keys(cleanedOpciones).length > 0 ? cleanedOpciones : undefined,
    };

    // Agregar campos específicos según el tipo
    if (tipo === TipoActivo.COMPUTADOR) {
      activoData.cpu = data.cpu;
      activoData.ramGB = data.ramGB;
    } else if (tipo === TipoActivo.MESA) {
      activoData.material = data.material;
    } else if (tipo === TipoActivo.AUTO) {
      activoData.placa = data.placa;
    } else if (tipo === TipoActivo.SILLA) {
      activoData.ergonomica = data.ergonomica;
    }

    await onSubmit(activoData);
  };

  const renderSpecificFields = () => {
    switch (tipo) {
      case TipoActivo.COMPUTADOR:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpu">CPU</Label>
              <Input
                id="cpu"
                placeholder="Ej: Intel Core i7"
                {...register('cpu')}
              />
              {errors.cpu && (
                <p className="text-sm text-red-600">{errors.cpu.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ramGB">RAM (GB)</Label>
              <Input
                id="ramGB"
                type="number"
                min="1"
                placeholder="Ej: 16"
                {...register('ramGB', { 
                  setValueAs: (v) => v === '' ? undefined : parseInt(v, 10) 
                })}
              />
              {errors.ramGB && (
                <p className="text-sm text-red-600">{errors.ramGB.message}</p>
              )}
            </div>
          </div>
        );

      case TipoActivo.MESA:
        return (
          <div className="space-y-2">
            <Label htmlFor="materialMesa">Material</Label>
            <Input
              id="materialMesa"
              placeholder="Ej: Roble, Metal, MDF"
              {...register('material')}
            />
            {errors.material && (
              <p className="text-sm text-red-600">{errors.material.message}</p>
            )}
          </div>
        );

      case TipoActivo.AUTO:
        return (
          <div className="space-y-2">
            <Label htmlFor="placa">Placa</Label>
            <Input
              id="placa"
              placeholder="Ej: ABC-123"
              {...register('placa')}
            />
            {errors.placa && (
              <p className="text-sm text-red-600">{errors.placa.message}</p>
            )}
          </div>
        );

      case TipoActivo.SILLA:
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ergonomica"
                checked={watch('ergonomica') || false}
                onCheckedChange={(checked: boolean) => setValue('ergonomica', checked)}
              />
              <Label htmlFor="ergonomica">Silla Ergonómica</Label>
            </div>
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
          {isEdit ? 'Editar Activo Fijo' : 'Nuevo Activo Fijo'}
        </CardTitle>
        <CardDescription>
          {isEdit 
            ? 'Modifica los datos del activo existente' 
            : 'Utiliza el patrón Factory para crear un nuevo activo fijo'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                type="number"
                min="1"
                placeholder="Ej: 1"
                {...register('codigo', { 
                  setValueAs: (v) => v === '' ? undefined : parseInt(v, 10) 
                })}
              />
              {errors.codigo && (
                <p className="text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Ej: MacBook Pro"
                {...register('nombre')}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 2500000"
                {...register('precio', { 
                  setValueAs: (v) => v === '' ? undefined : parseFloat(v) 
                })}
              />
              {errors.precio && (
                <p className="text-sm text-red-600">{errors.precio.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Activo</Label>
            <Select 
              value={tipo || ''} 
              onValueChange={(value) => setValue('tipo', value as typeof TipoActivo[keyof typeof TipoActivo])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TipoActivo.COMPUTADOR}>Computador</SelectItem>
                <SelectItem value={TipoActivo.MESA}>Mesa</SelectItem>
                <SelectItem value={TipoActivo.AUTO}>Auto</SelectItem>
                <SelectItem value={TipoActivo.SILLA}>Silla</SelectItem>
                <SelectItem value={TipoActivo.OTRO}>Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-sm text-red-600">{errors.tipo.message}</p>
            )}
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

          {/* Opciones adicionales */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Opciones adicionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vidaUtilMeses">Vida Útil (meses)</Label>
                <Input
                  id="vidaUtilMeses"
                  type="number"
                  min="1"
                  placeholder="Ej: 36"
                  {...register('vidaUtilMeses', { 
                    setValueAs: (v) => v === '' ? undefined : parseInt(v, 10) 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  placeholder="Ej: Apple"
                  {...register('marca')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  placeholder="Ej: MacBook Pro 14"
                  {...register('modelo')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serie">Serie</Label>
                <Input
                  id="serie"
                  placeholder="Ej: 2024"
                  {...register('serie')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="Ej: Gris Espacial"
                  {...register('color')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensiones">Dimensiones</Label>
                <Input
                  id="dimensiones"
                  placeholder="Ej: 31.2 x 22.1 x 1.55 cm"
                  {...register('dimensiones')}
                />
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Activo')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}