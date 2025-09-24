// Tipos para el patrón Builder - Vehículos
export const TipoVehiculo = {
  AUTO: 'AUTO',
  CAMIONETA: 'CAMIONETA',
  CAMION: 'CAMION',
} as const;

export type TipoVehiculo = typeof TipoVehiculo[keyof typeof TipoVehiculo];

export interface Vehiculo {
  codigo: number;
  nombre: string;
  pais: string;
  placa: string;
  tipo: TipoVehiculo;
  propietarioId?: number;
  costoMatricula: number;
  
  // Propiedades específicas para Auto
  numPuertas?: number;
  
  // Propiedades específicas para Camioneta
  traccion?: string;
  
  // Propiedades específicas para Camion
  capacidadTon?: number;
}

export interface CrearVehiculoDto {
  nombre: string;
  pais: string;
  placa: string;
  tipo: TipoVehiculo;
  propietarioId?: number;
  
  // Propiedades específicas según tipo
  numPuertas?: number;
  traccion?: string;
  capacidadTon?: number;
}

export interface ActualizarVehiculoDto {
  nombre?: string;
  pais?: string;
  placa?: string;
  tipo?: TipoVehiculo;
  propietarioId?: number;
  numPuertas?: number;
  traccion?: string;
  capacidadTon?: number;
}

// Tipos para el patrón Factory - Activos Fijos
export const TipoActivo = {
  COMPUTADOR: 'COMPUTADOR',
  MESA: 'MESA',
  AUTO: 'AUTO',
  SILLA: 'SILLA',
  OTRO: 'OTRO',
} as const;

export type TipoActivo = typeof TipoActivo[keyof typeof TipoActivo];

export interface OpcionesActivo {
  vidaUtilMeses?: number;
  marca?: string;
  modelo?: string;
  serie?: string;
  color?: string;
  dimensiones?: string;
  material?: string;
  placaVehiculo?: string;
}

export interface ActivoFijo {
  codigo: number;
  nombre: string;
  precio: number;
  tipo: TipoActivo;
  valorActual: number;
  opciones?: OpcionesActivo;
  
  // Campos específicos para Computador
  cpu?: string;
  ramGB?: number;
  
  // Campos específicos para Mesa
  material?: string;
  
  // Campos específicos para AutoAF
  placa?: string;
  
  // Campos específicos para Silla
  ergonomica?: boolean;
}

export interface CrearActivoDto {
  codigo: number;
  nombre: string;
  precio: number;
  tipo: TipoActivo;
  opciones?: OpcionesActivo;
  
  // Campos específicos según tipo
  cpu?: string;
  ramGB?: number;
  material?: string;
  placa?: string;
  ergonomica?: boolean;
}

export interface ActualizarActivoDto {
  nombre?: string;
  precio?: number;
  tipo?: TipoActivo;
  opciones?: OpcionesActivo;
  cpu?: string;
  ramGB?: number;
  material?: string;
  placa?: string;
  ergonomica?: boolean;
  codigo?: number;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}