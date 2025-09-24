import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Vehiculo, CrearVehiculoDto, ActualizarVehiculoDto } from '@/types';

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehiculos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getVehiculos();
      setVehiculos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVehiculo = useCallback(async (codigo: number): Promise<Vehiculo | null> => {
    try {
      setLoading(true);
      setError(null);
      const vehiculo = await apiClient.getVehiculo(codigo);
      return vehiculo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vehículo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createVehiculo = async (vehiculo: CrearVehiculoDto) => {
    try {
      setLoading(true);
      setError(null);
      const newVehiculo = await apiClient.createVehiculo(vehiculo);
      setVehiculos(prev => [...prev, newVehiculo]);
      return newVehiculo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear vehículo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVehiculo = async (codigo: number, vehiculo: ActualizarVehiculoDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedVehiculo = await apiClient.updateVehiculo(codigo, vehiculo);
      setVehiculos(prev => 
        prev.map(v => v.codigo === codigo ? updatedVehiculo : v)
      );
      return updatedVehiculo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar vehículo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVehiculo = async (codigo: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteVehiculo(codigo);
      setVehiculos(prev => prev.filter(v => v.codigo !== codigo));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar vehículo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  return {
    vehiculos,
    loading,
    error,
    fetchVehiculos,
    fetchVehiculo,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
  };
}

export function useVehiculo(codigo: number | null) {
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehiculo = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getVehiculo(id);
      setVehiculo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vehículo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codigo) {
      fetchVehiculo(codigo);
    }
  }, [codigo]);

  return {
    vehiculo,
    loading,
    error,
    fetchVehiculo,
  };
}