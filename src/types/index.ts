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

// Tipos para el patrón Composite - Sistema de Archivos
export const FileSystemItemKind = {
  FILE: 'file',
  FOLDER: 'folder',
} as const;

export type FileSystemItemKind = typeof FileSystemItemKind[keyof typeof FileSystemItemKind];

export const FileType = {
  PDF: 'PDF',
  DOCX: 'DOCX',
  XLSX: 'XLSX',
} as const;

export type FileType = typeof FileType[keyof typeof FileType];

export interface FileSystemNode {
  name: string;
  type: FileSystemItemKind;
  size: number;
  fileType?: FileType;
  children?: FileSystemNode[];
  path: string;
}

export interface FileSystemStatistics {
  totalSize: number;
  totalFiles: number;
  totalFolders: number;
  structure: string;
}

// Tipos para el patrón Adapter - Sistema de Temperatura
export const MeasurementUnit = {
  CELSIUS: 'CELSIUS',
  FAHRENHEIT: 'FAHRENHEIT',
} as const;

export type MeasurementUnit = typeof MeasurementUnit[keyof typeof MeasurementUnit];

export interface Bloque {
  id: number;
  nombre: string;
  tipoMedicion: MeasurementUnit;
  temperatura: number;
  fechaRegistro: string;
}

export interface CreateBloquePayload {
  nombre: string;
  tipoMedicion: MeasurementUnit;
  temperatura: number;
}

export interface UpdateBloquePayload {
  nombre?: string;
  tipoMedicion?: MeasurementUnit;
  temperatura?: number;
}

export interface TemperatureReading {
  blockId: string;
  valueC: number;
  timestamp: string;
  originalValue: number;
  originalUnit: MeasurementUnit;
  blockDbId?: number;
}

export interface TemperatureSystemStats {
  totalBloques: number;
  promedioCelsius: number;
  bloquesCelsius: number;
  bloquesFahrenheit: number;
}

export interface AvailableTemperatureBlock {
  id: number;
  name: string;
  tipoMedicion: MeasurementUnit;
}

// Tipos para el patrón Memento - Sistema de Solicitudes de Certificado
export interface DatosAlumno {
  nombre: string;
  apellido: string;
  matricula: string;
  carrera: string;
  email: string;
}

export interface Adjunto {
  nombre: string;
  tipo: string;
  url: string;
  tamanio: number;
}

export interface SolicitudCertificado {
  datosAlumno: DatosAlumno;
  tipoCertificado: string;
  observaciones: string;
  adjuntos: Adjunto[];
  estado: 'borrador' | 'generado' | 'firmado';
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface SnapshotMemento {
  id: number;
  etiqueta: string;
  timestamp: string;
  estado: SolicitudCertificado;
}

export interface EstadoMementoResponse {
  solicitud: SolicitudCertificado | null;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  historial: {
    actual: number;
    total: number;
    capacidadMaxima: number;
  };
}

export interface HistorialMementoResponse {
  snapshots: SnapshotMemento[];
  capacidadMaxima: number;
  posicionActual: number;
}

export interface CreateSolicitudPayload {
  datosAlumno: DatosAlumno;
  tipoCertificado: string;
  observaciones?: string;
  adjuntos?: Adjunto[];
}

export interface UpdateSolicitudPayload {
  tipoCertificado?: string;
  observaciones?: string;
}

export interface CreateAdjuntoPayload {
  nombre: string;
  tipo: string;
  url: string;
  tamanio: number;
}

// Tipos para el patrón Command - Editor de Texto
export interface CommandResponse {
  mensaje: string;
  texto: string;
  longitud: number;
}

export interface InfoHistorialCommand {
  totalComandos: number;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  grabandoMacro: boolean;
  nombreMacroActual?: string;
  macrosDisponibles: number;
}

export interface LogOperacion {
  operacion: string;
  timestamp: string;
  detalles: string;
}

export interface MacroInfo {
  nombre: string;
  comandos: number;
  fechaCreacion: string;
}

// DTOs para operaciones Command
export interface InsertarTextoDto {
  pos: number;
  texto: string;
}

export interface BorrarRangoDto {
  desde: number;
  hasta: number;
}

export interface ReemplazarDto {
  desde: number;
  len: number;
  nuevo: string;
}

export interface MacroDto {
  nombre: string;
}