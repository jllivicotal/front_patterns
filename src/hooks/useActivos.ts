import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { ActivoFijo, CrearActivoDto, ActualizarActivoDto } from '@/types';

export function useActivos() {
  const [activos, setActivos] = useState<ActivoFijo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getActivos();
      setActivos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar activos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivo = useCallback(async (codigo: number): Promise<ActivoFijo | null> => {
    try {
      setLoading(true);
      setError(null);
      const activo = await apiClient.getActivo(codigo);
      return activo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar activo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createActivo = async (activo: CrearActivoDto) => {
    try {
      setLoading(true);
      setError(null);
      const newActivo = await apiClient.createActivo(activo);
      setActivos(prev => [...prev, newActivo]);
      return newActivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear activo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateActivo = async (codigo: number, activo: ActualizarActivoDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedActivo = await apiClient.updateActivo(codigo, activo);
      setActivos(prev => 
        prev.map(a => a.codigo === codigo ? updatedActivo : a)
      );
      return updatedActivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar activo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivo = async (codigo: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteActivo(codigo);
      setActivos(prev => prev.filter(a => a.codigo !== codigo));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar activo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivos();
  }, [fetchActivos]);

  return {
    activos,
    loading,
    error,
    fetchActivos,
    fetchActivo,
    createActivo,
    updateActivo,
    deleteActivo,
  };
}

export function useActivo(codigo: number | null) {
  const [activo, setActivo] = useState<ActivoFijo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivo = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getActivo(id);
      setActivo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar activo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codigo) {
      fetchActivo(codigo);
    }
  }, [codigo]);

  return {
    activo,
    loading,
    error,
    fetchActivo,
  };
}