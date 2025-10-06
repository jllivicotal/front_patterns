import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMemento } from '@/hooks/useMemento';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Undo2,
  Redo2,
  Save,
  FileCheck,
  FilePenLine,
  History,
  Trash2,
  Loader2,
  Clock,
  User,
  Mail,
  GraduationCap,
  Paperclip,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const datosAlumnoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  matricula: z.string().min(1, 'La matrícula es requerida'),
  carrera: z.string().min(1, 'La carrera es requerida'),
  email: z.string().email('Email inválido'),
});

const solicitudSchema = z.object({
  datosAlumno: datosAlumnoSchema,
  tipoCertificado: z.string().min(1, 'Selecciona un tipo de certificado'),
  observaciones: z.string().optional(),
});

const adjuntoSchema = z.object({
  nombre: z.string().min(1, 'El nombre del archivo es requerido'),
  tipo: z.string().min(1, 'El tipo es requerido'),
  url: z.string().url('URL inválida'),
  tamanio: z.number().min(1, 'El tamaño debe ser mayor a 0'),
});

type SolicitudFormValues = z.infer<typeof solicitudSchema>;
type AdjuntoFormValues = z.infer<typeof adjuntoSchema>;

const tiposCertificado = [
  'Certificado de Estudios',
  'Constancia de Inscripción',
  'Constancia de Egreso',
  'Certificado de Calificaciones',
  'Constancia de Servicio Social',
];

export function MementoPage() {
  const {
    estado,
    historial,
    loading,
    error,
    crearSolicitud,
    actualizarSolicitud,
    agregarAdjunto,
    generarCertificado,
    firmarCertificado,
    undo,
    redo,
    limpiarHistorial,
  } = useMemento();

  const [mostrarFormularioAdjunto, setMostrarFormularioAdjunto] = useState(false);

  const solicitudForm = useForm<SolicitudFormValues>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: {
      datosAlumno: {
        nombre: '',
        apellido: '',
        matricula: '',
        carrera: '',
        email: '',
      },
      tipoCertificado: '',
      observaciones: '',
    },
  });

  const adjuntoForm = useForm<AdjuntoFormValues>({
    resolver: zodResolver(adjuntoSchema),
    defaultValues: {
      nombre: '',
      tipo: 'application/pdf',
      url: 'https://example.com/documento.pdf',
      tamanio: 1024,
    },
  });

  const handleCrearSolicitud = solicitudForm.handleSubmit(async (values) => {
    try {
      await crearSolicitud(values);
      toast.success('✅ Solicitud creada', {
        description: 'Se ha creado una nueva solicitud de certificado',
      });
      solicitudForm.reset();
    } catch (err) {
      toast.error('Error al crear solicitud');
    }
  });

  const handleActualizarSolicitud = async () => {
    try {
      const tipoCertificado = solicitudForm.getValues('tipoCertificado');
      const observaciones = solicitudForm.getValues('observaciones');

      if (!tipoCertificado) {
        toast.error('Selecciona un tipo de certificado');
        return;
      }

      await actualizarSolicitud({
        tipoCertificado,
        observaciones,
      });

      toast.success('✏️ Solicitud actualizada', {
        description: 'Los cambios se guardaron en el historial',
      });
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  const handleAgregarAdjunto = adjuntoForm.handleSubmit(async (values) => {
    try {
      await agregarAdjunto({
        nombre: values.nombre,
        tipo: values.tipo,
        url: values.url,
        tamanio: values.tamanio,
      });
      toast.success('📎 Adjunto agregado', {
        description: `Se agregó: ${values.nombre}`,
      });
      adjuntoForm.reset({
        nombre: '',
        tipo: 'application/pdf',
        url: 'https://example.com/documento.pdf',
        tamanio: 1024,
      });
      setMostrarFormularioAdjunto(false);
    } catch (err) {
      toast.error('Error al agregar adjunto');
    }
  });

  const handleGenerarCertificado = async () => {
    try {
      await generarCertificado();
      toast.success('📄 Certificado generado', {
        description: 'El certificado ha sido generado correctamente',
      });
    } catch (err) {
      toast.error('Error al generar certificado');
    }
  };

  const handleFirmarCertificado = async () => {
    try {
      await firmarCertificado();
      toast.success('✍️ Certificado firmado', {
        description: 'El certificado ha sido firmado digitalmente',
      });
    } catch (err) {
      toast.error('Error al firmar certificado');
    }
  };

  const handleUndo = async () => {
    try {
      await undo();
      toast.info('↩️ Deshacer', {
        description: 'Se restauró el estado anterior',
      });
    } catch (err) {
      toast.error('Error al deshacer');
    }
  };

  const handleRedo = async () => {
    try {
      await redo();
      toast.info('↪️ Rehacer', {
        description: 'Se restauró el estado siguiente',
      });
    } catch (err) {
      toast.error('Error al rehacer');
    }
  };

  const handleLimpiarHistorial = async () => {
    try {
      await limpiarHistorial();
      toast.success('🗑️ Historial limpiado', {
        description: 'Se eliminó todo el historial de cambios',
      });
    } catch (err) {
      toast.error('Error al limpiar historial');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoBadge = (estadoStr: string) => {
    const badges = {
      borrador: (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Borrador
        </Badge>
      ),
      generado: (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Generado
        </Badge>
      ),
      firmado: (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Firmado
        </Badge>
      ),
    };
    return badges[estadoStr as keyof typeof badges] || null;
  };

  const haySolicitud = !!estado?.solicitud;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sistema de Certificados
            </h1>
            <p className="text-slate-600 mt-1">Patrón Memento - Gestión con Undo/Redo</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-sm px-4 py-2">
          <History className="w-4 h-4 mr-2" />
          Memento Pattern
        </Badge>
      </div>

      {error && !estado && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4 text-sm text-red-700 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </CardContent>
        </Card>
      )}

      {/* Controles de Historial */}
      {haySolicitud && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUndo}
                      disabled={loading || !estado?.puedeDeshacer}
                      className="hover:bg-purple-100"
                      title={estado?.puedeDeshacer ? 'Volver al estado anterior' : 'No hay estados anteriores'}
                    >
                      <Undo2 className="w-4 h-4 mr-2" />
                      Deshacer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRedo}
                      disabled={loading || !estado?.puedeRehacer}
                      className="hover:bg-pink-100"
                      title={estado?.puedeRehacer ? 'Avanzar al estado siguiente' : 'No hay estados siguientes'}
                    >
                      <Redo2 className="w-4 h-4 mr-2" />
                      Rehacer
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 ml-1">
                    {!estado?.puedeDeshacer && !estado?.puedeRehacer && '🔒 No hay acciones para deshacer/rehacer'}
                    {estado?.puedeDeshacer && !estado?.puedeRehacer && '⬅️ Puedes deshacer (volver atrás)'}
                    {!estado?.puedeDeshacer && estado?.puedeRehacer && '➡️ Puedes rehacer (avanzar)'}
                    {estado?.puedeDeshacer && estado?.puedeRehacer && '↔️ Puedes navegar en ambas direcciones'}
                  </p>
                </div>
                
                <Separator orientation="vertical" className="h-12" />
                
                <div className="text-sm">
                  <div className="text-slate-600">
                    <span className="font-semibold">Posición:</span>{' '}
                    <Badge variant="outline" className="bg-white">
                      {estado?.historial.actual || 0} / {estado?.historial.total || 0}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {estado?.historial.total || 0} snapshot{(estado?.historial.total || 0) !== 1 ? 's' : ''} guardado{(estado?.historial.total || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLimpiarHistorial}
                disabled={loading}
                className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                title="Eliminar todo el historial de cambios"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Historial
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <Card className="lg:col-span-2 shadow-xl border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center space-x-2">
              <FilePenLine className="w-5 h-5 text-purple-600" />
              <span>{haySolicitud ? 'Editar Solicitud' : 'Nueva Solicitud'}</span>
            </CardTitle>
            <CardDescription>
              {haySolicitud
                ? 'Modifica los datos de la solicitud existente'
                : 'Crea una nueva solicitud de certificado'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <Form {...solicitudForm}>
              <form onSubmit={handleCrearSolicitud} className="space-y-6">
                {/* Datos del Alumno */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Datos del Alumno</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={solicitudForm.control}
                      name="datosAlumno.nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan" {...field} disabled={haySolicitud} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={solicitudForm.control}
                      name="datosAlumno.apellido"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input placeholder="Pérez" {...field} disabled={haySolicitud} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={solicitudForm.control}
                      name="datosAlumno.matricula"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matrícula</FormLabel>
                          <FormControl>
                            <Input placeholder="2021001" {...field} disabled={haySolicitud} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={solicitudForm.control}
                      name="datosAlumno.carrera"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carrera</FormLabel>
                          <FormControl>
                            <Input placeholder="Ing. en Sistemas" {...field} disabled={haySolicitud} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={solicitudForm.control}
                      name="datosAlumno.email"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="juan.perez@ejemplo.com"
                              {...field}
                              disabled={haySolicitud}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Tipo de Certificado */}
                <FormField
                  control={solicitudForm.control}
                  name="tipoCertificado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Certificado</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposCertificado.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Observaciones */}
                <FormField
                  control={solicitudForm.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Agrega observaciones o notas adicionales..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Información adicional sobre la solicitud</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botones */}
                <div className="flex items-center justify-end space-x-2">
                  {haySolicitud ? (
                    <Button
                      type="button"
                      onClick={handleActualizarSolicitud}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Actualizar Solicitud
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      Crear Solicitud
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Panel Derecho */}
        <div className="space-y-6">
          {/* Estado Actual */}
          {haySolicitud && estado.solicitud && (
            <Card className="shadow-xl border-pink-200">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-pink-600" />
                    <span>Estado Actual</span>
                  </span>
                  {getEstadoBadge(estado.solicitud.estado)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        {estado.solicitud.datosAlumno.nombre} {estado.solicitud.datosAlumno.apellido}
                      </p>
                      <p className="text-slate-600">{estado.solicitud.datosAlumno.matricula}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <GraduationCap className="w-4 h-4 text-slate-500 mt-0.5" />
                    <p className="text-slate-700">{estado.solicitud.datosAlumno.carrera}</p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 text-slate-500 mt-0.5" />
                    <p className="text-slate-700">{estado.solicitud.datosAlumno.email}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="font-semibold text-purple-700">{estado.solicitud.tipoCertificado}</p>
                  </div>

                  {estado.solicitud.observaciones && (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Observaciones:</p>
                      <p className="text-slate-700">{estado.solicitud.observaciones}</p>
                    </div>
                  )}

                  {estado.solicitud.adjuntos && estado.solicitud.adjuntos.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2 flex items-center">
                        <Paperclip className="w-3 h-3 mr-1" />
                        Adjuntos ({estado.solicitud.adjuntos.length})
                      </p>
                      <div className="space-y-2">
                        {estado.solicitud.adjuntos.map((adj, idx) => (
                          <div key={idx} className="bg-slate-50 p-2 rounded text-xs">
                            <p className="font-semibold">{adj.nombre}</p>
                            <p className="text-slate-500">
                              {adj.tipo} - {(adj.tamanio / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Creado: {formatDate(estado.solicitud.fechaCreacion)}
                    </p>
                    <p className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Modificado: {formatDate(estado.solicitud.fechaModificacion)}
                    </p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="space-y-2 pt-4">
                  {estado.solicitud.estado === 'borrador' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMostrarFormularioAdjunto(!mostrarFormularioAdjunto)}
                        className="w-full"
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Agregar Adjunto
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleGenerarCertificado}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <FileCheck className="w-4 h-4 mr-2" />
                        Generar Certificado
                      </Button>
                    </>
                  )}

                  {estado.solicitud.estado === 'generado' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleFirmarCertificado}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <FilePenLine className="w-4 h-4 mr-2" />
                      Firmar Certificado
                    </Button>
                  )}

                  {estado.solicitud.estado === 'firmado' && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-green-800">Certificado Completado</p>
                      <p className="text-xs text-green-600">Listo para descarga</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulario de Adjuntos */}
          {mostrarFormularioAdjunto && haySolicitud && (
            <Card className="shadow-xl border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Paperclip className="w-4 h-4" />
                  <span>Nuevo Adjunto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Form {...adjuntoForm}>
                  <form onSubmit={handleAgregarAdjunto} className="space-y-4">
                    <FormField
                      control={adjuntoForm.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="documento.pdf" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adjuntoForm.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Tipo MIME</FormLabel>
                          <FormControl>
                            <Input placeholder="application/pdf" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adjuntoForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adjuntoForm.control}
                      name="tamanio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Tamaño (bytes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMostrarFormularioAdjunto(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" size="sm" disabled={loading} className="flex-1">
                        Agregar
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Historial */}
          {historial && historial.snapshots && historial.snapshots.length > 0 && (
            <Card className="shadow-xl border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  <span>Historial de Cambios</span>
                </CardTitle>
                <CardDescription className="text-xs">{historial.snapshots.length} snapshots guardados</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {[...historial.snapshots].reverse().map((snapshot, index) => (
                    <div
                      key={snapshot.id}
                      className={`p-3 rounded-lg border text-sm ${
                        historial.posicionActual === historial.snapshots.length - 1 - index
                          ? 'bg-purple-50 border-purple-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-slate-800">{snapshot.etiqueta}</p>
                        {historial.posicionActual === historial.snapshots.length - 1 - index && (
                          <Badge variant="default" className="text-xs bg-purple-600">
                            Actual
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(snapshot.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
