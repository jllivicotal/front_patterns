import { useState } from 'react';
import { useCommand } from '@/hooks/useCommand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Replace,
  Play,
  Square,
  XCircle,
  List,
  RotateCcw,
  History,
  ClipboardList,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function CommandPage() {
  const {
    documento,
    info,
    log,
    macros,
    loading,
    error,
    successMessage,
    insertarTexto,
    borrarRango,
    reemplazarTexto,
    undo,
    redo,
    grabarMacro,
    finalizarMacro,
    cancelarMacro,
    ejecutarMacro,
    eliminarMacro,
    limpiarHistorial,
    limpiarLog,
    limpiarDocumento,
    reiniciar,
  } = useCommand();

  // Estado para formularios
  const [insertarForm, setInsertarForm] = useState({ pos: 0, texto: '' });
  const [borrarForm, setBorrarForm] = useState({ desde: 0, hasta: 0 });
  const [reemplazarForm, setReemplazarForm] = useState({ desde: 0, len: 0, nuevo: '' });
  const [nombreMacro, setNombreMacro] = useState('');
  const [macroAEjecutar, setMacroAEjecutar] = useState('');

  const handleInsertarTexto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insertarTexto(insertarForm.pos, insertarForm.texto);
      setInsertarForm({ pos: documento.longitud, texto: '' });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleBorrarRango = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await borrarRango(borrarForm.desde, borrarForm.hasta);
      setBorrarForm({ desde: 0, hasta: 0 });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleReemplazar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reemplazarTexto(reemplazarForm.desde, reemplazarForm.len, reemplazarForm.nuevo);
      setReemplazarForm({ desde: 0, len: 0, nuevo: '' });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleGrabarMacro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreMacro.trim()) return;
    try {
      await grabarMacro(nombreMacro);
      setNombreMacro('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEjecutarMacro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!macroAEjecutar.trim()) return;
    try {
      await ejecutarMacro(macroAEjecutar);
      setMacroAEjecutar('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patrón Command</h1>
          <p className="text-muted-foreground">Editor de texto con comandos desacoplados y Undo/Redo</p>
        </div>
        <Button onClick={reiniciar} variant="outline" size="sm" disabled={loading}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reiniciar Editor
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Documento */}
        <div className="lg:col-span-2 space-y-6">
          {/* Documento actual */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Documento</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={undo}
                    disabled={loading || !info?.puedeDeshacer}
                    variant="outline"
                    size="sm"
                  >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Deshacer
                  </Button>
                  <Button
                    onClick={redo}
                    disabled={loading || !info?.puedeRehacer}
                    variant="outline"
                    size="sm"
                  >
                    <Redo2 className="mr-2 h-4 w-4" />
                    Rehacer
                  </Button>
                </div>
              </div>
              <CardDescription>
                Longitud: {documento.longitud} caracteres
                {info && (
                  <span className="ml-4">
                    Comandos: {info.totalComandos}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={documento.texto}
                readOnly
                className="min-h-[200px] font-mono text-sm"
                placeholder="El documento está vacío..."
              />
              <div className="flex gap-2">
                <Button onClick={limpiarDocumento} variant="outline" size="sm" disabled={loading}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar Documento
                </Button>
                <Button onClick={limpiarHistorial} variant="outline" size="sm" disabled={loading}>
                  <History className="mr-2 h-4 w-4" />
                  Limpiar Historial
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Operaciones de edición */}
          <Card>
            <CardHeader>
              <CardTitle>Operaciones de Edición</CardTitle>
              <CardDescription>Comandos para modificar el documento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Insertar Texto */}
              <form onSubmit={handleInsertarTexto} className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Insertar Texto
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insert-pos">Posición</Label>
                    <Input
                      id="insert-pos"
                      type="number"
                      min={0}
                      max={documento.longitud}
                      value={insertarForm.pos}
                      onChange={(e) => setInsertarForm({ ...insertarForm, pos: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="insert-text">Texto</Label>
                    <div className="flex gap-2">
                      <Input
                        id="insert-text"
                        value={insertarForm.texto}
                        onChange={(e) => setInsertarForm({ ...insertarForm, texto: e.target.value })}
                        placeholder="Texto a insertar..."
                      />
                      <Button type="submit" disabled={loading || !insertarForm.texto}>
                        Insertar
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              <Separator />

              {/* Borrar Rango */}
              <form onSubmit={handleBorrarRango} className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Borrar Rango
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delete-from">Desde</Label>
                    <Input
                      id="delete-from"
                      type="number"
                      min={0}
                      max={documento.longitud}
                      value={borrarForm.desde}
                      onChange={(e) => setBorrarForm({ ...borrarForm, desde: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delete-to">Hasta</Label>
                    <Input
                      id="delete-to"
                      type="number"
                      min={0}
                      max={documento.longitud}
                      value={borrarForm.hasta}
                      onChange={(e) => setBorrarForm({ ...borrarForm, hasta: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button type="submit" disabled={loading} className="w-full">
                      Borrar
                    </Button>
                  </div>
                </div>
              </form>

              <Separator />

              {/* Reemplazar */}
              <form onSubmit={handleReemplazar} className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Replace className="h-4 w-4" />
                  Reemplazar Texto
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="replace-from">Desde</Label>
                    <Input
                      id="replace-from"
                      type="number"
                      min={0}
                      max={documento.longitud}
                      value={reemplazarForm.desde}
                      onChange={(e) => setReemplazarForm({ ...reemplazarForm, desde: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="replace-len">Longitud</Label>
                    <Input
                      id="replace-len"
                      type="number"
                      min={0}
                      value={reemplazarForm.len}
                      onChange={(e) => setReemplazarForm({ ...reemplazarForm, len: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="replace-new">Nuevo Texto</Label>
                    <div className="flex gap-2">
                      <Input
                        id="replace-new"
                        value={reemplazarForm.nuevo}
                        onChange={(e) => setReemplazarForm({ ...reemplazarForm, nuevo: e.target.value })}
                        placeholder="Nuevo texto..."
                      />
                      <Button type="submit" disabled={loading || !reemplazarForm.nuevo}>
                        Reemplazar
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Log de operaciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  <CardTitle>Log de Operaciones</CardTitle>
                </div>
                <Button onClick={limpiarLog} variant="outline" size="sm" disabled={loading}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar Log
                </Button>
              </div>
              <CardDescription>{log.length} operaciones registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {log.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay operaciones registradas
                  </p>
                ) : (
                  log.map((entry, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{entry.operacion}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{entry.detalles}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral - Macros */}
        <div className="space-y-6">
          {/* Estado del macro */}
          {info?.grabandoMacro && (
            <Card className="border-orange-500">
              <CardHeader>
                <CardTitle className="text-orange-600">
                  🔴 Grabando Macro
                </CardTitle>
                <CardDescription>
                  {info.nombreMacroActual}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button onClick={finalizarMacro} size="sm" disabled={loading}>
                  <Square className="mr-2 h-4 w-4" />
                  Finalizar
                </Button>
                <Button onClick={cancelarMacro} variant="outline" size="sm" disabled={loading}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Grabar nuevo macro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Grabar Macro
              </CardTitle>
              <CardDescription>
                Inicia la grabación de un nuevo macro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGrabarMacro} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="macro-name">Nombre del Macro</Label>
                  <Input
                    id="macro-name"
                    value={nombreMacro}
                    onChange={(e) => setNombreMacro(e.target.value)}
                    placeholder="mi_macro"
                    disabled={info?.grabandoMacro || loading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!nombreMacro.trim() || info?.grabandoMacro || loading}
                >
                  Iniciar Grabación
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de macros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Macros Disponibles
              </CardTitle>
              <CardDescription>
                {macros.length} {macros.length === 1 ? 'macro' : 'macros'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {macros.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay macros guardados
                  </p>
                ) : (
                  macros.map((macro) => (
                    <div key={macro.nombre} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{macro.nombre}</span>
                        <Button
                          onClick={() => eliminarMacro(macro.nombre)}
                          variant="ghost"
                          size="sm"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          {macro.comandos} {macro.comandos === 1 ? 'comando' : 'comandos'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(macro.fechaCreacion).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        onClick={() => ejecutarMacro(macro.nombre)}
                        size="sm"
                        className="w-full"
                        disabled={loading}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Ejecutar
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              {/* Ejecutar macro por nombre */}
              <form onSubmit={handleEjecutarMacro} className="space-y-2">
                <Label htmlFor="macro-execute">Ejecutar Macro</Label>
                <div className="flex gap-2">
                  <Input
                    id="macro-execute"
                    value={macroAEjecutar}
                    onChange={(e) => setMacroAEjecutar(e.target.value)}
                    placeholder="Nombre del macro"
                    disabled={loading}
                  />
                  <Button type="submit" disabled={!macroAEjecutar.trim() || loading}>
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Información del historial */}
          {info && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Estado del Historial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total comandos:</span>
                  <Badge>{info.totalComandos}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Puede deshacer:</span>
                  <Badge variant={info.puedeDeshacer ? 'default' : 'secondary'}>
                    {info.puedeDeshacer ? 'Sí' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Puede rehacer:</span>
                  <Badge variant={info.puedeRehacer ? 'default' : 'secondary'}>
                    {info.puedeRehacer ? 'Sí' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Macros disponibles:</span>
                  <Badge>{info.macrosDisponibles}</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
