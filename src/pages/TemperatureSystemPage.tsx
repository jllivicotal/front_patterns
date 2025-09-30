import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ThermometerSun,
  GaugeCircle,
  Snowflake,
  Flame,
  Loader2,
  RefreshCw,
  Thermometer,
  PlusCircle,
  Droplets,
  Trash2,
} from 'lucide-react';
import { useTemperatureSystem } from '@/hooks/useTemperatureSystem';
import { MeasurementUnit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const measurementUnits = [MeasurementUnit.CELSIUS, MeasurementUnit.FAHRENHEIT] as const;

const createBlockSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'Ingresa un nombre para el bloque')
    .max(50, 'El nombre es demasiado largo'),
  tipoMedicion: z.enum(measurementUnits),
  temperatura: z
    .coerce.number()
    .min(-100, 'Temperatura mínima permitida: -100')
    .max(200, 'Temperatura máxima permitida: 200'),
});

const updateTemperatureSchema = z.object({
  bloqueId: z
    .coerce.number()
    .int()
    .positive('Selecciona un bloque válido'),
  temperatura: z
    .coerce.number()
    .min(-100, 'Temperatura mínima permitida: -100')
    .max(200, 'Temperatura máxima permitida: 200'),
});

type CreateBlockFormInput = z.input<typeof createBlockSchema>;
type CreateBlockFormValues = z.output<typeof createBlockSchema>;
type UpdateTemperatureFormInput = z.input<typeof updateTemperatureSchema>;
type UpdateTemperatureFormValues = z.output<typeof updateTemperatureSchema>;

export function TemperatureSystemPage() {
  const {
    bloques,
    temperatures,
    availableBlocks,
    loading,
    error,
    adapterStats,
    createBloque,
    updateBloque,
    deleteBloque,
    refreshTemperatures,
    refreshing,
  } = useTemperatureSystem();

  const createBlockForm = useForm<CreateBlockFormInput, any, CreateBlockFormValues>({
    resolver: zodResolver(createBlockSchema),
    defaultValues: {
      nombre: '',
      tipoMedicion: MeasurementUnit.CELSIUS,
      temperatura: 25,
    },
  });

  const updateTemperatureForm = useForm<UpdateTemperatureFormInput, any, UpdateTemperatureFormValues>({
    resolver: zodResolver(updateTemperatureSchema),
    defaultValues: {
      bloqueId: 0,
      temperatura: 0,
    },
  });

  const selectedBloqueId = updateTemperatureForm.watch('bloqueId');

  const selectedBloque = useMemo(() => {
    if (!bloques.length) return null;
    const numericId = Number(selectedBloqueId);
    return bloques.find((bloque) => bloque.id === numericId) ?? null;
  }, [bloques, selectedBloqueId]);

  useEffect(() => {
    if (bloques.length === 0) {
      updateTemperatureForm.reset({ bloqueId: 0, temperatura: 0 });
      return;
    }

    const currentId = updateTemperatureForm.getValues('bloqueId');
    const existing = bloques.some((bloque) => bloque.id === Number(currentId));
    const fallback = existing ? Number(currentId) : bloques[0].id;
    const target = bloques.find((bloque) => bloque.id === fallback) ?? bloques[0];

    updateTemperatureForm.reset({
      bloqueId: target.id,
      temperatura: target.temperatura,
    });
  }, [bloques, updateTemperatureForm]);

  useEffect(() => {
    if (selectedBloque) {
      updateTemperatureForm.setValue('temperatura', selectedBloque.temperatura, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [selectedBloque, updateTemperatureForm]);

  const handleCreateBlock = createBlockForm.handleSubmit(async (values) => {
    try {
      await createBloque(values);
      await refreshTemperatures();
      toast.success(`Bloque "${values.nombre}" creado correctamente.`);
      createBlockForm.reset({
        nombre: '',
        tipoMedicion: values.tipoMedicion,
        temperatura: values.temperatura,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear el bloque';
      toast.error(message);
    }
  });

  const handleUpdateTemperature = updateTemperatureForm.handleSubmit(async (values) => {
    try {
      const bloque = bloques.find((b) => b.id === Number(values.bloqueId));
      if (!bloque) {
        toast.error('Selecciona un bloque válido.');
        return;
      }

      await updateBloque(bloque.id, { temperatura: values.temperatura });
      await refreshTemperatures();
      toast.success(`Temperatura de "${bloque.nombre}" actualizada.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo actualizar la temperatura';
      toast.error(message);
    }
  });

  const handleDeleteBlock = async (id: number, nombre: string) => {
    try {
      await deleteBloque(id);
      await refreshTemperatures();
      toast.success(`Bloque "${nombre}" eliminado.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo eliminar el bloque';
      toast.error(message);
    }
  };

  const formatTimestamp = (input: string | Date) => {
    const date = input instanceof Date ? input : new Date(input);
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const avgLabel = `${adapterStats.promedioCelsius.toFixed(1)} °C`;
  const sensorsAvailableLabel = availableBlocks.length
    ? availableBlocks
        .map((block) => `${block.name} (${block.tipoMedicion === MeasurementUnit.CELSIUS ? '°C' : '°F'})`)
        .join(', ')
    : 'No reportados';

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patrón Adapter</h1>
          <p className="max-w-2xl text-slate-600">
            Unifica sensores de temperatura en °C y °F mediante el patrón Adapter. Administra nuevos bloques desde la
            base de datos e ingresa lecturas manuales mientras consultas los sensores físicos simulados.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-sky-50 text-sky-700 border-sky-200">
              Conversión Automática
            </Badge>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              Adapter Pattern
            </Badge>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              NestJS + React
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={refreshTemperatures}
          disabled={loading || refreshing}
          className="gap-2"
        >
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Actualizar lecturas
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50/80">
          <CardContent className="py-4 text-sm text-red-700">
            Se produjo un error al cargar el sistema de temperatura: {error}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-white/80 border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              <ThermometerSun className="h-5 w-5 text-orange-500" /> Bloques registrados
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-slate-900">
              {adapterStats.totalBloques}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-white/80 border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              <GaugeCircle className="h-5 w-5 text-blue-500" /> Promedio (°C)
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-slate-900">
              {avgLabel}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-white/80 border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              <Snowflake className="h-5 w-5 text-sky-500" /> Sensores en °C
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-slate-900">
              {adapterStats.bloquesCelsius}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-white/80 border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              <Flame className="h-5 w-5 text-amber-500" /> Sensores en °F
            </CardTitle>
            <CardDescription className="text-3xl font-bold text-slate-900">
              {adapterStats.bloquesFahrenheit}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="bg-white/85 border-slate-100 shadow-sm xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Thermometer className="h-5 w-5 text-slate-600" /> Registrar bloque de temperatura
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Guarda un nuevo bloque con su unidad nativa. El sistema Adapter luego normaliza las lecturas a °C para el panel de sensores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...createBlockForm}>
              <form onSubmit={handleCreateBlock} className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={createBlockForm.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nombre del bloque</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Bloque Norte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createBlockForm.control}
                  name="tipoMedicion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad de medición</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la unidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={MeasurementUnit.CELSIUS}>Celsius (°C)</SelectItem>
                          <SelectItem value={MeasurementUnit.FAHRENHEIT}>Fahrenheit (°F)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Define cómo se reportarán las lecturas desde este bloque.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createBlockForm.control}
                  name="temperatura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperatura registrada</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Ej: 24.5"
                          value={field.value === undefined || field.value === null ? '' : String(field.value)}
                          onChange={(event) => field.onChange(event.target.value)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        Guarda la última lectura conocida en la unidad seleccionada.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" className="gap-2" disabled={loading || createBlockForm.formState.isSubmitting}>
                    {createBlockForm.formState.isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                    Guardar bloque
                  </Button>
                </div>
              </form>
            </Form>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-slate-500" />
                Almacenar los bloques en la base de datos permite sincronizar sensores físicos con lecturas manuales, demostrando cómo el Adapter homogeniza distintas fuentes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/85 border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <GaugeCircle className="h-5 w-5 text-slate-600" /> Actualizar temperatura manualmente
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Selecciona un bloque almacenado y digita una nueva lectura para mantener el historial al día.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bloques.length === 0 ? (
              <p className="text-sm text-slate-500">No hay bloques registrados aún. Crea uno primero.</p>
            ) : (
              <Form {...updateTemperatureForm}>
                <form onSubmit={handleUpdateTemperature} className="space-y-4">
                  <FormField
                    control={updateTemperatureForm.control}
                    name="bloqueId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bloque</FormLabel>
                        <Select
                          value={String(field.value ?? '')}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un bloque" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bloques.map((bloque) => (
                              <SelectItem key={bloque.id} value={String(bloque.id)}>
                                {bloque.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedBloque && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      <p><span className="font-semibold">Unidad:</span> {selectedBloque.tipoMedicion === MeasurementUnit.CELSIUS ? 'Celsius (°C)' : 'Fahrenheit (°F)'}</p>
                      <p><span className="font-semibold">Lectura actual:</span> {selectedBloque.temperatura.toFixed(1)}</p>
                    </div>
                  )}

                  <FormField
                    control={updateTemperatureForm.control}
                    name="temperatura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva temperatura</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Ej: 22.8"
                            value={field.value === undefined || field.value === null ? '' : String(field.value)}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2" disabled={loading || updateTemperatureForm.formState.isSubmitting}>
                    {updateTemperatureForm.formState.isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Thermometer className="h-4 w-4" />
                    )}
                    Registrar lectura
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/85 border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-orange-500" /> Bloques almacenados en la base de datos
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Administra tus bloques persistidos con NestJS + Prisma. Puedes eliminarlos cuando lo necesites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bloques.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no has registrado bloques.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Temperatura</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloques.map((bloque) => (
                    <TableRow key={bloque.id}>
                      <TableCell className="font-medium">{bloque.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                          {bloque.tipoMedicion === MeasurementUnit.CELSIUS ? '°C' : '°F'}
                        </Badge>
                      </TableCell>
                      <TableCell>{bloque.temperatura.toFixed(1)}</TableCell>
                      <TableCell>{new Date(bloque.fechaRegistro).toLocaleDateString('es-CO')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-500"
                          onClick={() => handleDeleteBlock(bloque.id, bloque.nombre)}
                          disabled={loading}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/85 border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-slate-600" /> Lecturas de sensores adaptados
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Datos normalizados a °C a partir de sensores en diferentes unidades.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {temperatures.length === 0 ? (
              <p className="text-sm text-slate-500">No hay lecturas disponibles.</p>
            ) : (
              <div className="space-y-3">
                {temperatures.map((reading) => (
                  <div
                    key={`${reading.blockId}-${reading.timestamp}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{reading.blockId}</p>
                      <p className="text-xs text-slate-500">Actualizado: {formatTimestamp(reading.timestamp)}</p>
                      <p className="text-xs text-slate-500">
                        Lectura original: {reading.originalValue.toFixed(1)} °{reading.originalUnit === MeasurementUnit.CELSIUS ? 'C' : 'F'}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{reading.valueC.toFixed(1)} °C</span>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
              Sensores disponibles: {sensorsAvailableLabel}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
