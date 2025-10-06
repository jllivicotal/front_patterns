import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface DocumentoState {
  texto: string;
  longitud: number;
}

interface InfoHistorial {
  totalComandos: number;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  grabandoMacro: boolean;
  nombreMacroActual?: string;
  macrosDisponibles: number;
}

interface LogEntry {
  operacion: string;
  timestamp: string;
  detalles: string;
}

interface MacroInfo {
  nombre: string;
  comandos: number;
  fechaCreacion: string;
}

export const useCommand = () => {
  const [documento, setDocumento] = useState<DocumentoState>({ texto: '', longitud: 0 });
  const [info, setInfo] = useState<InfoHistorial | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [macros, setMacros] = useState<MacroInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar estado inicial
  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [textoData, infoData, logData, macrosData] = await Promise.all([
        apiClient.getTextoDocumento(),
        apiClient.getCommandInfo(),
        apiClient.getCommandLog(),
        apiClient.listarMacros(),
      ]);

      setDocumento(textoData);
      setInfo(infoData);
      setLog(logData.log);
      setMacros(macrosData.macros);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el estado');
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarEstado = useCallback(async () => {
    try {
      const [textoData, infoData, logData] = await Promise.all([
        apiClient.getTextoDocumento(),
        apiClient.getCommandInfo(),
        apiClient.getCommandLog(),
      ]);

      setDocumento(textoData);
      setInfo(infoData);
      setLog(logData.log);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  }, []);

  const mostrarMensaje = useCallback((mensaje: string) => {
    setSuccessMessage(mensaje);
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  const insertarTexto = useCallback(async (pos: number, texto: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.insertarTexto({ pos, texto });
      setDocumento({ texto: response.texto, longitud: response.longitud });
      await actualizarEstado();
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al insertar texto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actualizarEstado, mostrarMensaje]);

  const borrarRango = useCallback(async (desde: number, hasta: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.borrarRango({ desde, hasta });
      setDocumento({ texto: response.texto, longitud: response.longitud });
      await actualizarEstado();
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al borrar rango');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actualizarEstado, mostrarMensaje]);

  const reemplazarTexto = useCallback(async (desde: number, len: number, nuevo: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.reemplazarTexto({ desde, len, nuevo });
      setDocumento({ texto: response.texto, longitud: response.longitud });
      await actualizarEstado();
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reemplazar texto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actualizarEstado, mostrarMensaje]);

  const undo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.commandUndo();
      setDocumento({ texto: response.texto, longitud: response.longitud });
      await actualizarEstado();
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al deshacer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actualizarEstado, mostrarMensaje]);

  const redo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.commandRedo();
      setDocumento({ texto: response.texto, longitud: response.longitud });
      await actualizarEstado();
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rehacer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actualizarEstado, mostrarMensaje]);

  const grabarMacro = useCallback(async (nombre: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.grabarMacro(nombre);
      setInfo(response.info);
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al grabar macro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  const finalizarMacro = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.finalizarMacro();
      setInfo(response.info);
      
      // Recargar lista de macros
      const macrosData = await apiClient.listarMacros();
      setMacros(macrosData.macros);
      
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al finalizar macro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  const cancelarMacro = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.cancelarMacro();
      setInfo(response.info);
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar macro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  const ejecutarMacro = useCallback(async (nombre: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.ejecutarMacro(nombre);
      setDocumento({ texto: response.texto, longitud: response.longitud });
      await actualizarEstado();
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ejecutar macro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actualizarEstado, mostrarMensaje]);

  const eliminarMacro = useCallback(async (nombre: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.eliminarMacro(nombre);
      setMacros(response.macros);
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar macro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  const limpiarHistorial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.limpiarHistorialCommand();
      setInfo(response.info);
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al limpiar historial');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  const limpiarLog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.limpiarLogCommand();
      setLog([]);
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al limpiar log');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  const limpiarDocumento = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.limpiarDocumento();
      setDocumento({ texto: response.texto, longitud: 0 });
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al limpiar documento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mostrarMensaje]);

  const reiniciar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.reiniciarEditor();
      await cargarEstado();
      mostrarMensaje(response.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reiniciar editor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cargarEstado, mostrarMensaje]);

  return {
    // Estado
    documento,
    info,
    log,
    macros,
    loading,
    error,
    successMessage,
    
    // Operaciones de edición
    insertarTexto,
    borrarRango,
    reemplazarTexto,
    
    // Undo/Redo
    undo,
    redo,
    
    // Macros
    grabarMacro,
    finalizarMacro,
    cancelarMacro,
    ejecutarMacro,
    eliminarMacro,
    
    // Utilidades
    limpiarHistorial,
    limpiarLog,
    limpiarDocumento,
    reiniciar,
    cargarEstado,
  };
};
