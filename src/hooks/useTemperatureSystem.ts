import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { MeasurementUnit } from '@/types';
import type {
  Bloque,
  CreateBloquePayload,
  UpdateBloquePayload,
  TemperatureReading,
  AvailableTemperatureBlock,
  TemperatureSystemStats,
} from '@/types';

export function useTemperatureSystem() {
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<AvailableTemperatureBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBloques = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getBloques();
      setBloques(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los bloques');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTemperatures = useCallback(async () => {
    try {
      const data = await apiClient.getTemperatureReadings();
      setTemperatures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las temperaturas');
    }
  }, []);

  const fetchAvailableBlocks = useCallback(async () => {
    try {
      const data = await apiClient.getTemperatureBlocks();
      setAvailableBlocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los bloques disponibles');
    }
  }, []);

  const createBloque = useCallback(async (payload: CreateBloquePayload) => {
    try {
      setLoading(true);
      setError(null);
      const nuevo = await apiClient.createBloque(payload);
      setBloques(prev => [nuevo, ...prev]);
      return nuevo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el bloque');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBloque = useCallback(async (id: number, payload: UpdateBloquePayload) => {
    try {
      setLoading(true);
      setError(null);
      const actualizado = await apiClient.updateBloque(id, payload);
      setBloques(prev => prev.map(b => (b.id === id ? actualizado : b)));
      return actualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el bloque');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBloque = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteBloque(id);
      setBloques(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el bloque');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTemperatures = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([fetchTemperatures(), fetchAvailableBlocks()]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchTemperatures, fetchAvailableBlocks]);

  const adapterStats = useMemo<TemperatureSystemStats>(() => {
    const total = bloques.length;
    if (!total) {
      return {
        totalBloques: 0,
        promedioCelsius: 0,
        bloquesCelsius: 0,
        bloquesFahrenheit: 0,
      };
    }

    const normalize = (bloque: Bloque) =>
      bloque.tipoMedicion === MeasurementUnit.FAHRENHEIT
        ? ((bloque.temperatura - 32) * 5) / 9
        : bloque.temperatura;

    const suma = bloques.reduce((acc, bloque) => acc + normalize(bloque), 0);
    const bloquesCelsius = bloques.filter(b => b.tipoMedicion === MeasurementUnit.CELSIUS).length;
    const bloquesFahrenheit = total - bloquesCelsius;

    return {
      totalBloques: total,
      promedioCelsius: suma / total,
      bloquesCelsius,
      bloquesFahrenheit,
    };
  }, [bloques]);

  useEffect(() => {
    fetchBloques();
    refreshTemperatures();
  }, [fetchBloques, refreshTemperatures]);

  return {
    bloques,
    temperatures,
    availableBlocks,
    loading,
    error,
    adapterStats,
    refreshing,
    fetchBloques,
    fetchTemperatures,
    fetchAvailableBlocks,
    refreshTemperatures,
    createBloque,
    updateBloque,
    deleteBloque,
  };
}
