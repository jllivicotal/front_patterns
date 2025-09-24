import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  Vehiculo, 
  CrearVehiculoDto, 
  ActualizarVehiculoDto,
  ActivoFijo,
  CrearActivoDto,
  ActualizarActivoDto
} from '@/types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 segundos de timeout
    });

    // Interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        let message = error.response?.data?.message || error.message || 'Error desconocido';
        
        // Mejorar mensajes específicos para errores comunes
        if (message.includes('Ya existe un vehículo con la placa')) {
          message = `${message}. Por favor, usa una placa diferente.`;
        }
        
        throw new Error(message);
      }
    );
  }

  // ===== VEHICULOS API =====
  async getVehiculos(): Promise<Vehiculo[]> {
    const response = await this.client.get<Vehiculo[]>('/vehiculos');
    return response.data;
  }

  async getVehiculo(codigo: number): Promise<Vehiculo> {
    const response = await this.client.get<Vehiculo>(`/vehiculos/${codigo}`);
    return response.data;
  }

  async createVehiculo(vehiculo: CrearVehiculoDto): Promise<Vehiculo> {
    console.log('Enviando datos al backend:', JSON.stringify(vehiculo, null, 2));
    const response = await this.client.post<Vehiculo>('/vehiculos', vehiculo);
    return response.data;
  }

  async updateVehiculo(codigo: number, vehiculo: ActualizarVehiculoDto): Promise<Vehiculo> {
    const response = await this.client.put<Vehiculo>(`/vehiculos/${codigo}`, vehiculo);
    return response.data;
  }

  async deleteVehiculo(codigo: number): Promise<void> {
    await this.client.delete(`/vehiculos/${codigo}`);
  }

  // ===== ACTIVOS FIJOS API =====
  async getActivos(): Promise<ActivoFijo[]> {
    const response = await this.client.get<ActivoFijo[]>('/activos');
    return response.data;
  }

  async getActivo(codigo: number): Promise<ActivoFijo> {
    const response = await this.client.get<ActivoFijo>(`/activos/${codigo}`);
    return response.data;
  }

  async createActivo(activo: CrearActivoDto): Promise<ActivoFijo> {
    const response = await this.client.post<ActivoFijo>('/activos', activo);
    return response.data;
  }

  async updateActivo(codigo: number, activo: ActualizarActivoDto): Promise<ActivoFijo> {
    activo.codigo = codigo; // Asegurar que el código esté presente
    const response = await this.client.put<ActivoFijo>(`/activos/${codigo}`, activo);
    return response.data;
  }

  async deleteActivo(codigo: number): Promise<void> {
    await this.client.delete(`/activos/${codigo}`);
  }
}

export const apiClient = new ApiClient();