# 🎓 Sistema de Certificados con Patrón Memento

## 🚀 Inicio Rápido

### 1. Iniciar el Backend (NestJS)
```bash
cd design_patterns
npm run start:dev
```
El backend estará disponible en `http://localhost:3000`

### 2. Iniciar el Frontend (React)
```bash
cd front_patterns
npm run dev
```
El frontend estará disponible en `http://localhost:5173`

### 3. Acceder al Sistema de Certificados
Abre tu navegador en:
```
http://localhost:5173/memento
```

## 📝 Guía de Uso del Patrón Memento

### Escenario 1: Crear una Solicitud Básica

1. **Completa el formulario de datos del alumno:**
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Matrícula: `2021001`
   - Carrera: `Ingeniería en Sistemas`
   - Email: `juan.perez@universidad.edu`

2. **Selecciona el tipo de certificado:**
   - Elige "Certificado de Estudios" del dropdown

3. **Agrega observaciones (opcional):**
   ```
   Certificado solicitado para trámite de beca.
   Urgente - fecha límite: 15 de octubre.
   ```

4. **Crea la solicitud:**
   - Click en "Crear Solicitud"
   - ✅ Verás una notificación de éxito
   - El estado cambiará a **Borrador**

---

### Escenario 2: Modificar y Deshacer Cambios

1. **Modifica el tipo de certificado:**
   - Cambia de "Certificado de Estudios" a "Constancia de Inscripción"
   - Click en "Actualizar Solicitud"
   - 💾 Se crea un snapshot automático: "Actualización de solicitud"

2. **Agrega observaciones adicionales:**
   - Escribe: `Incluir todas las materias cursadas`
   - Click en "Actualizar Solicitud"
   - 💾 Nuevo snapshot creado

3. **Deshacer el último cambio:**
   - Click en el botón "↩️ Deshacer"
   - ℹ️ Notificación: "Se restauró el estado anterior"
   - Las observaciones vuelven al estado previo

4. **Rehacer el cambio:**
   - Click en el botón "↪️ Rehacer"
   - ℹ️ Las observaciones se restauran

5. **Ver el historial:**
   - Observa el panel derecho "Historial de Cambios"
   - Verás: "Estado inicial" → "Actualización de solicitud" → etc.
   - El snapshot actual está marcado con badge morado "Actual"

---

### Escenario 3: Agregar Adjuntos

1. **Abrir formulario de adjuntos:**
   - Click en "📎 Agregar Adjunto"

2. **Completar datos del archivo:**
   - Nombre: `comprobante_pago.pdf`
   - Tipo MIME: `application/pdf`
   - URL: `https://storage.universidad.edu/docs/12345.pdf`
   - Tamaño: `204800` (bytes, equivale a 200 KB)

3. **Agregar el adjunto:**
   - Click en "Agregar"
   - ✅ Notificación: "Adjunto agregado: comprobante_pago.pdf"
   - 💾 Snapshot automático creado

4. **Agregar más adjuntos** (repite el proceso):
   - `historial_academico.pdf`
   - `identificacion.pdf`

5. **Deshacer adjuntos:**
   - Click en "Deshacer" para eliminar el último adjunto agregado
   - Observa cómo la lista se actualiza automáticamente

---

### Escenario 4: Generar y Firmar Certificado

1. **Generar el certificado:**
   - Click en "📄 Generar Certificado"
   - El estado cambia de **Borrador** → **Generado**
   - Badge cambia de amarillo a azul
   - 💾 Snapshot: "Certificado generado"

2. **Intentar editar (bloqueado):**
   - Nota que ya no puedes agregar más adjuntos
   - El formulario de actualización sigue disponible

3. **Firmar el certificado:**
   - Click en "✍️ Firmar Certificado"
   - El estado cambia de **Generado** → **Firmado**
   - Badge cambia de azul a verde
   - ✅ Mensaje: "Certificado Completado - Listo para descarga"
   - 💾 Snapshot: "Certificado firmado"

4. **Estado final:**
   - Los adjuntos son inmutables
   - El certificado está listo para descarga
   - Puedes navegar el historial pero no modificar

---

### Escenario 5: Navegación Temporal Avanzada

1. **Revisa el historial completo:**
   - Observa todos los snapshots en el panel derecho
   - Cada uno tiene:
     - Etiqueta descriptiva
     - Timestamp
     - Indicador de "Actual" si corresponde

2. **Deshacer múltiples veces:**
   - Click en "Deshacer" repetidamente
   - Observa cómo retrocedes: Firmado → Generado → Borrador
   - El contador muestra tu posición (ej: 2/7)

3. **Rehacer para avanzar:**
   - Click en "Rehacer" varias veces
   - Avanza nuevamente: Borrador → Generado → Firmado
   - El estado se restaura completamente

4. **Indicadores visuales:**
   - **Undo deshabilitado**: No hay estados anteriores
   - **Redo deshabilitado**: No hay estados futuros
   - **Historial**: Posición actual resaltada en morado

---

### Escenario 6: Limpiar y Comenzar de Nuevo

1. **Limpiar el historial:**
   - Click en "🗑️ Limpiar Historial"
   - ⚠️ Confirma la acción
   - Todo el historial se borra
   - Vuelves al estado inicial vacío

2. **Crear nueva solicitud:**
   - Completa el formulario con datos diferentes
   - Observa que el historial comienza limpio
   - Solo verás el nuevo "Estado inicial"

---

## 🎯 Conceptos del Patrón Memento Demostrados

### 1. **Originator (SolicitudCertificado)**
   - El objeto cuyo estado queremos guardar
   - Contiene: datos del alumno, tipo, observaciones, adjuntos, estado

### 2. **Memento (SolicitudMemento)**
   - Captura inmutable del estado en un momento dado
   - Incluye: timestamp, etiqueta, estado completo

### 3. **Caretaker (HistorialSolicitudes)**
   - Administra la colección de mementos
   - Permite navegación (undo/redo)
   - Controla la capacidad máxima del historial

### 4. **Ventajas Demostradas:**
   - ✅ Restauración completa de estado
   - ✅ Navegación temporal bidireccional
   - ✅ Historial persistente
   - ✅ Sin exposición de detalles internos
   - ✅ Snapshots automáticos y manuales

---

## 📊 Estadísticas del Historial

El sistema muestra:
- **Posición actual** vs. **Total de snapshots** (ej: 3/5)
- **Capacidad máxima** del historial
- **Timestamps** de cada snapshot
- **Etiquetas** descriptivas automáticas

---

## 🎨 Elementos Visuales

### Badges de Estado
- 🟡 **Borrador**: Editable, permite agregar adjuntos
- 🔵 **Generado**: Certificado creado, pendiente de firma
- 🟢 **Firmado**: Proceso completo, listo para descarga

### Notificaciones
- ✅ **Success** (verde): Operación exitosa
- ❌ **Error** (rojo): Fallo en la operación
- ℹ️ **Info** (azul): Undo/Redo ejecutado

### Iconos
- 📄 Certificados
- ↩️ Deshacer
- ↪️ Rehacer
- 💾 Guardar
- 📎 Adjuntos
- 🕐 Historial
- 🗑️ Limpiar

---

## 🔍 Debugging

### Ver el estado en tiempo real:
1. Abre DevTools (F12)
2. Ve a la pestaña Network
3. Observa las llamadas a:
   - `GET /memento/estado`
   - `POST /memento/undo`
   - `POST /memento/redo`
   - `GET /memento/historial`

### Inspeccionar snapshots:
```javascript
// En la consola del navegador
fetch('http://localhost:3000/api/memento/historial')
  .then(r => r.json())
  .then(console.log)
```

---

## 🎓 Ejercicio Práctico Completo

### Objetivo: Demostrar el flujo completo con múltiples modificaciones

1. **Crear solicitud inicial** (Estado 1)
   - Alumno: María González
   - Certificado: Constancia de Inscripción

2. **Cambiar tipo** (Estado 2)
   - Nuevo tipo: Certificado de Calificaciones

3. **Agregar observaciones** (Estado 3)
   - "Necesito todas las materias del semestre"

4. **Agregar adjunto 1** (Estado 4)
   - comprobante.pdf

5. **Agregar adjunto 2** (Estado 5)
   - identificacion.pdf

6. **Cambiar observaciones** (Estado 6)
   - "Incluir promedio general"

7. **Generar certificado** (Estado 7)

8. **Navegar el historial:**
   - Deshacer 3 veces (volver a Estado 4)
   - Observar que se pierden: observaciones modificadas, generación
   - Rehacer 2 veces (Estado 6)
   - Volver a deshacer al Estado 1

9. **Limpiar y empezar nuevo flujo**

---

## 💡 Tips

- **Snapshots automáticos**: Se crean con cada operación (crear, actualizar, adjuntar, generar, firmar)
- **Etiquetas**: Descriptivas y generadas automáticamente
- **Límites**: El historial tiene capacidad configurable en el backend
- **Persistencia**: El estado se guarda en el backend, no se pierde al refrescar

---

## 🐛 Solución de Problemas

### El botón "Deshacer" está deshabilitado
- ✅ Normal si estás en el estado inicial
- ✅ Haz al menos una modificación primero

### El botón "Rehacer" está deshabilitado
- ✅ Normal si no has deshecho nada
- ✅ Primero usa "Deshacer"

### No se muestra el historial
- ⚠️ Verifica que el backend esté corriendo
- ⚠️ Revisa la consola del navegador por errores
- ⚠️ Confirma que la API esté en `http://localhost:3000/api`

### Error al crear solicitud
- ⚠️ Todos los campos del alumno son obligatorios
- ⚠️ El email debe tener formato válido
- ⚠️ Selecciona un tipo de certificado

---

**🎉 ¡Disfruta explorando el patrón Memento con una interfaz completa y funcional!**
