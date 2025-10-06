import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type {
  EstadoMementoResponse,
  HistorialMementoResponse,
  CreateSolicitudPayload,
  UpdateSolicitudPayload,
  CreateAdjuntoPayload,
} from '@/types';

export function useMemento() {
  const [estado, setEstado] = useState<EstadoMementoResponse | null>(null);
  const [historial, setHistorial] = useState<HistorialMementoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstado = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getMementoEstado();
      setEstado(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el estado';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistorial = useCallback(async () => {
    try {
      const data = await apiClient.getMementoHistorial();
      setHistorial(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el historial';
      setError(message);
    }
  }, []);

  const crearSolicitud = useCallback(
    async (payload: CreateSolicitudPayload) => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.crearSolicitud(payload);
        setEstado(data);
        await fetchHistorial();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al crear la solicitud';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchHistorial]
  );

  const actualizarSolicitud = useCallback(
    async (payload: UpdateSolicitudPayload) => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.actualizarSolicitud(payload);
        setEstado(data);
        await fetchHistorial();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al actualizar la solicitud';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchHistorial]
  );

  const agregarAdjunto = useCallback(
    async (payload: CreateAdjuntoPayload) => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.agregarAdjunto(payload);
        setEstado(data);
        await fetchHistorial();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al agregar adjunto';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchHistorial]
  );

  const generarCertificado = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.generarCertificado();
      setEstado(data);
      await fetchHistorial();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar certificado';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchHistorial]);

  const firmarCertificado = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.firmarCertificado();
      setEstado(data);
      await fetchHistorial();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al firmar certificado';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchHistorial]);

  const undo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.mementoUndo();
      setEstado(data);
      await fetchHistorial();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al deshacer';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchHistorial]);

  const redo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.mementoRedo();
      setEstado(data);
      await fetchHistorial();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al rehacer';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchHistorial]);

  const limpiarHistorial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.limpiarMementoHistorial();
      await fetchEstado();
      await fetchHistorial();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al limpiar historial';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEstado, fetchHistorial]);

  const crearSnapshot = useCallback(
    async (etiqueta: string) => {
      try {
        setLoading(true);
        setError(null);
        await apiClient.crearSnapshot(etiqueta);
        await fetchHistorial();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al crear snapshot';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchHistorial]
  );

  useEffect(() => {
    fetchEstado();
    fetchHistorial();
  }, [fetchEstado, fetchHistorial]);

  return {
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
    crearSnapshot,
    refresh: fetchEstado,
  };
}
