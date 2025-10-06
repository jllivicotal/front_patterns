# Implementación del Patrón Memento en el Frontend

## 📋 Resumen

Se ha implementado completamente la interfaz frontend para consumir los endpoints del patrón Memento del backend, permitiendo la gestión de solicitudes de certificados con funcionalidad completa de Undo/Redo.

## 🎯 Características Implementadas

### 1. **Gestión de Solicitudes de Certificado**
- ✅ Crear nuevas solicitudes con datos del alumno
- ✅ Actualizar tipo de certificado y observaciones
- ✅ Agregar adjuntos a las solicitudes
- ✅ Generar certificados
- ✅ Firmar certificados digitalmente

### 2. **Funcionalidad Memento (Undo/Redo)**
- ✅ Deshacer cambios (Undo) con restauración de estado anterior
- ✅ Rehacer cambios (Redo) con avance al siguiente estado
- ✅ Visualización del historial de snapshots
- ✅ Limpieza del historial
- ✅ Indicador visual del estado actual vs. total de estados

### 3. **Interfaz de Usuario**
- ✅ Formulario completo para datos del alumno (nombre, apellido, matrícula, carrera, email)
- ✅ Selector de tipos de certificado
- ✅ Campo de observaciones con textarea
- ✅ Formulario dinámico para adjuntos
- ✅ Panel de estado actual con badges visuales
- ✅ Historial de snapshots con timestamps
- ✅ Controles de navegación temporal (Undo/Redo)

## 📁 Archivos Creados

### Tipos TypeScript
- **`src/types/index.ts`** (actualizado)
  - `DatosAlumno`: Información del estudiante
  - `Adjunto`: Archivos adjuntos
  - `SolicitudCertificado`: Estado completo de la solicitud
  - `SnapshotMemento`: Captura de estado
  - `EstadoMementoResponse`: Respuesta del servidor con estado actual
  - `HistorialMementoResponse`: Lista de snapshots
  - Payloads para crear/actualizar

### API Client
- **`src/lib/api-client.ts`** (actualizado)
  - `getMementoEstado()`: Obtener estado actual
  - `crearSolicitud()`: Crear nueva solicitud
  - `actualizarSolicitud()`: Actualizar solicitud existente
  - `agregarAdjunto()`: Agregar archivo adjunto
  - `generarCertificado()`: Generar documento
  - `firmarCertificado()`: Firmar digitalmente
  - `mementoUndo()`: Deshacer último cambio
  - `mementoRedo()`: Rehacer cambio deshecho
  - `getMementoHistorial()`: Obtener historial completo
  - `limpiarMementoHistorial()`: Limpiar todo el historial
  - `crearSnapshot()`: Crear snapshot manual

### Hook Personalizado
- **`src/hooks/useMemento.ts`**
  - Manejo de estado local y remoto
  - Llamadas a la API con manejo de errores
  - Auto-actualización del historial tras cada operación
  - Estados de carga y error

### Componentes UI
- **`src/components/ui/textarea.tsx`** (nuevo)
  - Componente de área de texto con estilos consistentes
- **`src/components/ui/separator.tsx`** (nuevo)
  - Separador visual horizontal/vertical

### Página Principal
- **`src/pages/MementoPage.tsx`** (nuevo)
  - Formulario principal con validación Zod
  - Panel de estado actual
  - Formulario de adjuntos
  - Historial visual de snapshots
  - Controles de Undo/Redo
  - Badges de estado (Borrador, Generado, Firmado)
  - Notificaciones con toast

### Navegación
- **`src/App.tsx`** (actualizado)
  - Ruta `/memento` agregada
- **`src/components/Layout.tsx`** (actualizado)
  - Botón de navegación "Certificados" con badge Memento
  - Estilo purple-pink gradient
  - Footer actualizado

## 🎨 Diseño Visual

### Colores del Tema
- **Gradient principal**: Purple (500) → Pink (500)
- **Estados**:
  - Borrador: Yellow
  - Generado: Blue
  - Firmado: Green

### Iconos Utilizados
- 📄 `FileText`: Certificados
- ↩️ `Undo2`: Deshacer
- ↪️ `Redo2`: Rehacer
- 💾 `Save`: Guardar
- ✅ `FileCheck`: Certificado generado
- ✍️ `FilePenLine`: Firmar
- 📚 `History`: Historial
- 🗑️ `Trash2`: Limpiar
- 👤 `User`: Datos del alumno
- 📧 `Mail`: Email
- 🎓 `GraduationCap`: Carrera
- 📎 `Paperclip`: Adjuntos
- ✔️ `CheckCircle`: Completado
- ⚠️ `AlertCircle`: Errores

## 🔄 Flujo de Trabajo

1. **Crear Solicitud**
   - Llenar datos del alumno
   - Seleccionar tipo de certificado
   - Agregar observaciones (opcional)
   - Click en "Crear Solicitud"
   - Estado: **Borrador** 📝

2. **Editar Solicitud**
   - Cambiar tipo de certificado
   - Modificar observaciones
   - Agregar adjuntos
   - Cada cambio crea un snapshot automático

3. **Generar Certificado**
   - Click en "Generar Certificado"
   - Estado cambia a: **Generado** 📄

4. **Firmar Certificado**
   - Click en "Firmar Certificado"
   - Estado final: **Firmado** ✅

5. **Navegación Temporal**
   - **Deshacer**: Restaura el estado anterior
   - **Rehacer**: Avanza al siguiente estado
   - Historial muestra todos los snapshots con etiquetas

## 🚀 Uso

### Iniciar el Frontend
```bash
cd front_patterns
npm run dev
```

### Navegar a Memento
```
http://localhost:5173/memento
```

## 📦 Dependencias Instaladas

```bash
npm install @radix-ui/react-separator
```

## 🔗 Endpoints del Backend Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/memento/estado` | Obtener estado actual |
| POST | `/memento/solicitud` | Crear solicitud |
| PUT | `/memento/solicitud` | Actualizar solicitud |
| POST | `/memento/adjunto` | Agregar adjunto |
| POST | `/memento/generar` | Generar certificado |
| POST | `/memento/firmar` | Firmar certificado |
| POST | `/memento/undo` | Deshacer |
| POST | `/memento/redo` | Rehacer |
| GET | `/memento/historial` | Obtener historial |
| POST | `/memento/historial/limpiar` | Limpiar historial |
| POST | `/memento/snapshot` | Crear snapshot manual |

## ✨ Características Destacadas

### Validación de Formularios
- **React Hook Form** + **Zod** para validación robusta
- Mensajes de error personalizados
- Validación en tiempo real

### Notificaciones
- **Sonner (toast)** para feedback inmediato
- Diferentes tipos: success, error, info
- Descripciones contextuales

### Gestión de Estado
- Hook personalizado `useMemento`
- Auto-refresh del historial
- Manejo de estados de carga
- Sincronización con backend

### Accesibilidad
- Labels semánticos
- Feedback visual de estados
- Botones deshabilitados cuando corresponde
- Indicadores de carga

## 🎯 Demostración del Patrón Memento

El patrón Memento permite:

1. **Capturar**: Cada operación (crear, actualizar, adjuntar, generar, firmar) guarda un snapshot
2. **Restaurar**: Los botones Undo/Redo navegan por el historial
3. **Transparencia**: El usuario ve claramente su posición en el historial (ej: 3/5)
4. **Persistencia**: Todos los estados se guardan en el backend

## 🎨 Screenshots Conceptuales

### Formulario Principal
- Datos del alumno (4 campos + email)
- Selector de tipo de certificado
- Área de observaciones
- Botón de crear/actualizar

### Panel de Estado
- Badge con estado actual (Borrador/Generado/Firmado)
- Datos resumidos del alumno
- Lista de adjuntos
- Botones de acción contextuales

### Historial
- Lista de snapshots con timestamps
- Indicador del snapshot actual
- Etiquetas descriptivas automáticas

### Controles Temporales
- Botón Deshacer (deshabilitado si no hay estados previos)
- Botón Rehacer (deshabilitado si no hay estados futuros)
- Contador de posición (actual/total)
- Botón de limpiar historial

## 🔧 Próximas Mejoras Sugeridas

1. ✨ Visualización del documento PDF generado
2. 📥 Descarga de certificados firmados
3. 🔍 Búsqueda en el historial
4. 🏷️ Etiquetas personalizadas para snapshots
5. 📊 Comparación entre dos estados
6. 💾 Exportar historial completo
7. ⚡ Atajos de teclado (Ctrl+Z, Ctrl+Y)
8. 🎯 Saltar a un snapshot específico del historial

---

**✅ Implementación completa y lista para demostración práctica del patrón Memento!**
