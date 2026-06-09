# Guía de Integración API - Backend Ciudadela MIA

Esta documentación describe detalladamente todos los endpoints expuestos por el backend en NestJS, estructurados de forma precisa para permitir una conexión exitosa y sin ambigüedades desde el frontend (React).

---

## 🛡️ Aspectos Generales de Conexión

### 1. URL Base
* **Desarrollo Local**: `http://localhost:3000/api`
* **Producción (Hostinger)**: `https://[TU-DOMINIO-HOSTINGER]/api` *(La ruta final está bajo el prefijo global `/api`)*

### 2. Autenticación (JWT Bearer Token)
La mayoría de los endpoints requieren autenticación. Debes incluir el token obtenido en el login en la cabecera `Authorization` de cada petición HTTP:
```http
Authorization: Bearer <access_token>
```
*Si no se envía el token o es inválido, el servidor responderá con un error HTTP `401 Unauthorized`.*

### 3. Rate Limiting (Límite de Peticiones)
El servidor cuenta con un limitador global de tráfico.
* **Límite**: Máximo **100 peticiones por minuto por dirección IP**.
* Si excedes este límite, recibirás un error HTTP `429 Too Many Requests`. Tu frontend debe manejar este estado y notificar al usuario que espere unos instantes.

### 4. Cabeceras Obligatorias (para peticiones con cuerpo JSON)
```http
Content-Type: application/json
```

---

## 👥 Roles de Usuario Disponibles
* `superadmin`: Acceso total. Puede crear y modificar administradores y superadministradores.
* `admin`: Acceso administrativo. No puede alterar a otros `admin` ni a `superadmin`. Puede crear/modificar operarios e hidráulicos.
* `hidraulico`: Acceso operativo y consulta de indicadores.
* `operario`: Acceso operativo a macromedición. Al exportar datos de macromedidor, solo se le permite descargar sus propios registros.

---

## 📂 Endpoints del Módulo de Autenticación (`/auth`)

### 🔑 1. Iniciar Sesión (Login)
Permite autenticarse en el sistema y obtener el JWT.
* **Método**: `POST`
* **Ruta**: `/auth/login`
* **Autenticación**: Ninguna (Público)
* **Cuerpo de la Petición (JSON)**:
  ```json
  {
    "username": "nombre_de_usuario",
    "password": "contraseña_segura"
  }
  ```
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Inicio de sesión exitoso.",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "admin",
        "role": "superadmin"
      }
    }
  }
  ```

---

### 👤 2. Ver Perfil Actual
Obtiene los datos del usuario correspondiente al token activo.
* **Método**: `GET`
* **Ruta**: `/auth/profile`
* **Autenticación**: Requerida (Bearer Token)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "username": "admin",
      "id": 1,
      "role": "superadmin"
    }
  }
  ```

---

### 🚪 3. Cerrar Sesión (Logout)
Registra la salida del usuario en la bitácora de auditoría.
* **Método**: `POST`
* **Ruta**: `/auth/logout`
* **Autenticación**: Requerida (Bearer Token)
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Sesión cerrada exitosamente."
  }
  ```

---

### 🌱 4. Sembrado Inicial de Superadmin
Crea el usuario superadministrador por defecto. **Solo funciona si no hay ningún usuario registrado en la base de datos.**
* **Método**: `POST`
* **Ruta**: `/auth/seed-first-admin`
* **Autenticación**: Ninguna
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Superadministrador inicial creado exitosamente.",
    "data": {
      "username": "superadmin",
      "role": "superadmin",
      "temp_password": "superadminCiudadela123",
      "warning": "Por favor, cambie la contraseña después de iniciar sesión por primera vez."
    }
  }
  ```
* **Respuesta en caso de que ya existan usuarios (403 Forbidden)**:
  ```json
  {
    "message": "El sembrado inicial ya no está disponible porque ya existen usuarios registrados en el sistema.",
    "error": "Forbidden",
    "statusCode": 403
  }
  ```

---

## 👥 Endpoints del Módulo de Usuarios (`/users`)
*Nota: Solo accesibles por usuarios con rol `superadmin` o `admin`. Un `admin` no puede modificar a otro `admin` ni a un `superadmin`.*

### ➕ 1. Crear Usuario
* **Método**: `POST`
* **Ruta**: `/users`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Cuerpo de la Petición (JSON)**:
  ```json
  {
    "username": "operario123",
    "password": "contraseñaFuerte123*",
    "role": "operario" // Valores válidos: superadmin, admin, operario, hidraulico
  }
  ```
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Usuario creado exitosamente.",
    "data": {
      "username": "operario123",
      "role": "operario",
      "isActive": true,
      "createdBy": 1,
      "id": 5,
      "createdAt": "2026-06-03T15:20:00.000Z"
    }
  }
  ```

---

### 📋 2. Listar Usuarios
Retorna la lista de usuarios. El rol `admin` solo visualizará a los usuarios de rol `operario` e `hidraulico`. El rol `superadmin` ve a todos.
* **Método**: `GET`
* **Ruta**: `/users`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 3,
        "username": "operario_norte",
        "role": "operario",
        "isActive": true,
        "createdBy": 1,
        "createdAt": "2026-06-02T16:25:22.000Z"
      }
    ]
  }
  ```

---

### ✏️ 3. Actualizar Username
Modifica el nombre de usuario de una cuenta.
* **Método**: `PATCH`
* **Ruta**: `/users/:id`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Cuerpo de la Petición (JSON)**:
  ```json
  {
    "username": "nuevo_username_operario"
  }
  ```
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Usuario actualizado exitosamente.",
    "data": {
      "id": 3,
      "username": "nuevo_username_operario",
      "role": "operario"
    }
  }
  ```

---

### 🟢 4. Activar Usuario
Reactiva a un usuario que ha sido desactivado.
* **Método**: `POST`
* **Ruta**: `/users/:id/activate`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Usuario activado exitosamente.",
    "data": { "id": 3, "isActive": true }
  }
  ```

---

### 🔴 5. Desactivar Usuario
Bloquea temporalmente el acceso de un usuario sin borrar sus datos.
* **Método**: `POST`
* **Ruta**: `/users/:id/deactivate`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Usuario desactivado exitosamente.",
    "data": { "id": 3, "isActive": false }
  }
  ```

---

### 🏷️ 6. Cambiar Rol de Usuario
* **Método**: `PATCH`
* **Ruta**: `/users/:id/role`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Cuerpo de la Petición (JSON)**:
  ```json
  {
    "role": "hidraulico" // Valores válidos: superadmin, admin, operario, hidraulico
  }
  ```
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Rol de usuario actualizado exitosamente.",
    "data": { "id": 3, "role": "hidraulico" }
  }
  ```

---

### 🔑 7. Restablecer Contraseña (Reset Password)
Establece una nueva clave para el usuario especificado.
* **Método**: `POST`
* **Ruta**: `/users/:id/reset-password`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Cuerpo de la Petición (JSON)**:
  ```json
  {
    "password": "nuevaContrasenaSuperSegura123!"
  }
  ```
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Contraseña restablecida exitosamente."
  }
  ```

---

### 🗑️ 8. Eliminar Usuario (Soft Delete)
Realiza una eliminación lógica (desactiva y oculta de los listados comunes).
* **Método**: `DELETE`
* **Ruta**: `/users/:id`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Usuario eliminado (borrado lógico) exitosamente."
  }
  ```

---

## 📊 Endpoints de Indicadores Técnicos (`/indicadores-tecnicos`)

### ➕ 1. Crear Registro de Indicador
* **Método**: `POST`
* **Ruta**: `/indicadores-tecnicos`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Cuerpo de la Petición (JSON)**: *(Todos los campos numéricos son opcionales excepto la fecha)*
  ```json
  {
    "fecha": "2026-06-01", // Obligatorio. Formato YYYY-MM-DD
    "cobertura_acueducto": 98.50,
    "usuarios_acueducto": 1240,
    "micromedicion_nominal": 95.00,
    "micromedicion_real": 92.30,
    "irca": 1.25,
    "ianc_promedio": 14.50,
    "produccion_acueducto": 15024.12,
    "consumo_acueducto": 12850.80,
    "continuidad_acueducto": 24.00,
    "cobertura_alcantarillado": 94.20,
    "usuarios_alcantarillado": 1180,
    "cobertura_aseo": 100.00,
    "usuarios_aseo": 1350,
    "barrido_km": 45.80,
    "continuidad_aseo": 6.00,
    "produccion_residuos_ton": 320.45
  }
  ```
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Indicador técnico creado exitosamente.",
    "data": {
      "id": 12,
      "fecha": "2026-06-01",
      "cobertura_acueducto": "98.50",
      "usuarios_acueducto": 1240,
      "...": "..."
    }
  }
  ```

---

### 📋 2. Obtener Indicadores (Con Filtros)
Permite listar los indicadores técnicos ordenados cronológicamente de forma descendente.
* **Método**: `GET`
* **Ruta**: `/indicadores-tecnicos`
* **Autenticación**: Requerida (Bearer Token)
* **Parámetros Query (Opcionales)**:
  * `anio` (Número entero): Filtra los registros de un año específico (ej: `2026`).
  * `mes` (Número de 1 a 12): Filtra los registros de un mes específico (ej: `6`).
  * `fechaInicio` (Formato YYYY-MM-DD): Límite inferior de fecha (ej: `2026-01-01`).
  * `fechaFin` (Formato YYYY-MM-DD): Límite superior de fecha (ej: `2026-06-30`).
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 12,
        "fecha": "2026-06-01",
        "cobertura_acueducto": "98.50",
        "usuarios_acueducto": 1240,
        "micromedicion_nominal": "95.00",
        "micromedicion_real": "92.30",
        "irca": "1.25",
        "ianc_promedio": "14.50",
        "produccion_acueducto": "15024.12",
        "consumo_acueducto": "12850.80",
        "continuidad_acueducto": "24.00",
        "cobertura_alcantarillado": "94.20",
        "usuarios_alcantarillado": 1180,
        "cobertura_aseo": "100.00",
        "usuarios_aseo": 1350,
        "barrido_km": "45.80",
        "continuidad_aseo": "6.00",
        "produccion_residuos_ton": "320.45",
        "createdBy": 1,
        "created_at": "2026-06-03T19:55:40.000Z"
      }
    ]
  }
  ```

---

### 🔍 3. Consultar Años y Meses Registrados (Para Filtros en React)
Útil para armar selects o filtros dinámicos en la UI con los años y meses existentes en la base de datos.
* **Método**: `GET`
* **Ruta**: `/indicadores-tecnicos/filtros-disponibles`
* **Autenticación**: Requerida (Bearer Token)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "anio": 2026,
        "meses": [1, 2, 3, 4, 5, 6]
      },
      {
        "anio": 2025,
        "meses": [11, 12]
      }
    ]
  }
  ```

---

### 📖 4. Obtener un Indicador por ID
* **Método**: `GET`
* **Ruta**: `/indicadores-tecnicos/:id`
* **Autenticación**: Requerida (Bearer Token)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 12,
      "fecha": "2026-06-01",
      "...": "..."
    }
  }
  ```

---

### ✏️ 5. Modificar Indicador Técnico
* **Método**: `PATCH`
* **Ruta**: `/indicadores-tecnicos/:id`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Cuerpo de la Petición (JSON)**: *(Campos que deseas modificar)*
  ```json
  {
    "irca": 1.10,
    "cobertura_aseo": 99.90
  }
  ```
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Indicador técnico actualizado exitosamente.",
    "data": {
      "id": 12,
      "irca": "1.10",
      "cobertura_aseo": "99.90",
      "updatedBy": 1
    }
  }
  ```

---

### 🗑️ 6. Eliminar Indicador Técnico (Soft Delete)
* **Método**: `DELETE`
* **Ruta**: `/indicadores-tecnicos/:id`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Indicador técnico eliminado exitosamente."
  }
  ```

---

## 🚰 Endpoints de Registro de Macromedidor (`/registro-macromedidor`)

### ➕ 1. Crear Lectura de Macromedidor
Al ingresar una lectura, el backend calcula automáticamente el `consolidado_m3` (restando la lectura actual menos la lectura anterior) y el `consumo_acumulado_dia` (acumulado de las horas anteriores del mismo día).
*Si el registro se inserta de forma extemporánea (fuera de orden cronológico), el sistema recalcula los registros posteriores y los acumulados diarios en cascada.*
* **Método**: `POST`
* **Ruta**: `/registro-macromedidor`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`, `operario`)
* **Cuerpo de la Petición (JSON)**:
  ```json
  {
    "fecha": "2026-06-03", // Obligatorio. Formato YYYY-MM-DD
    "hora": 14, // Obligatorio. Entero entre 1 y 24 (Formato 24h)
    "lectura_m3": 12450.80, // Obligatorio. Número decimal positivo
    "observaciones": "Sin novedades en la lectura." // Opcional. Texto
  }
  ```
* **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Lectura de macromedidor registrada exitosamente.",
    "data": {
      "fecha": "2026-06-03",
      "hora": 14,
      "lectura_m3": 12450.8,
      "observaciones": "Sin novedades en la lectura.",
      "consolidado_m3": 12.30, // Calculado de forma automática
      "consumo_acumulado_dia": 58.40, // Acumulado diario hasta la hora 14
      "operario_id": 3,
      "createdBy": 3,
      "id": 98,
      "created_at": "2026-06-03T19:10:00.000Z"
    }
  }
  ```
* **Respuesta en caso de duplicidad en Fecha + Hora (409 Conflict)**:
  ```json
  {
    "message": "Ya existe una lectura registrada para la fecha 2026-06-03 a la hora 14.",
    "error": "Conflict",
    "statusCode": 409
  }
  ```

---

### 📋 2. Listar Todas las Lecturas
* **Método**: `GET`
* **Ruta**: `/registro-macromedidor`
* **Autenticación**: Requerida (Bearer Token)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 98,
        "fecha": "2026-06-03",
        "hora": 14,
        "lectura_m3": "12450.80",
        "consolidado_m3": "12.30",
        "consumo_acumulado_dia": "58.40",
        "operario_id": 3,
        "observaciones": "Sin novedades en la lectura.",
        "created_at": "2026-06-03T19:10:00.000Z"
      }
    ]
  }
  ```

---

### 📅 3. Consultar Lecturas de una Fecha
* **Método**: `GET`
* **Ruta**: `/registro-macromedidor/fecha`
* **Autenticación**: Requerida (Bearer Token)
* **Parámetros Query**:
  * `fecha` (Obligatorio, YYYY-MM-DD): Ej: `/registro-macromedidor/fecha?fecha=2026-06-03`
* **Respuesta Exitosa (200 OK)**: Ordenado cronológicamente por hora ascendente.
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```

---

### 🗓️ 4. Consultar Lecturas por Rango de Fechas
* **Método**: `GET`
* **Ruta**: `/registro-macromedidor/rango`
* **Autenticación**: Requerida (Bearer Token)
* **Parámetros Query**:
  * `fechaInicio` (Obligatorio, YYYY-MM-DD)
  * `fechaFin` (Obligatorio, YYYY-MM-DD)
* **Respuesta Exitosa (200 OK)**: Ej: `/registro-macromedidor/rango?fechaInicio=2026-06-01&fechaFin=2026-06-03`
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```

---

### 📆 5. Consultar Lecturas por Año y Mes
* **Método**: `GET`
* **Ruta**: `/registro-macromedidor/mes`
* **Autenticación**: Requerida (Bearer Token)
* **Parámetros Query**:
  * `anio` (Obligatorio, ej: `2026`)
  * `mes` (Obligatorio, ej: `6`)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```

---

### 📈 6. Consultar Datos Listos para Gráfico de Curvas
Retorna los datos transformados y ordenados con una clave `timestamp` (formato `"AAAA-MM-DD HH:00"`) para facilitar el renderizado de gráficos de línea o barras en el frontend.
* **Método**: `GET`
* **Ruta**: `/registro-macromedidor/curvas`
* **Autenticación**: Requerida (Bearer Token)
* **Parámetros Query (Obligatorios)**:
  * `fechaInicio` (YYYY-MM-DD)
  * `fechaFin` (YYYY-MM-DD)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 98,
        "fecha": "2026-06-03",
        "hora": 14,
        "timestamp": "2026-06-03 14:00",
        "lectura": 12450.8,
        "consolidado": 12.30,
        "acumulado": 58.40,
        "observaciones": "Sin novedades en la lectura."
      }
    ]
  }
  ```

---

### 🗑️ 7. Eliminar Lectura (Soft Delete)
Oculta el registro lógicamente de la base de datos y **recalcula automáticamente de manera retroactiva** el consolidado de la lectura siguiente y los acumulados diarios correspondientes.
* **Método**: `DELETE`
* **Ruta**: `/registro-macromedidor/:id`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Lectura de macromedidor eliminada y consumos recalculados exitosamente."
  }
  ```

---

## 📊 Endpoints de Auditoría (`/auditoria`)
*Nota: Solo accesibles para los roles `superadmin` y `admin`.*

### 👤 1. Historial de Acciones sobre Usuarios
Muestra las creaciones, actualizaciones, activaciones, desactivaciones, cambios de rol, eliminaciones y reseteos de contraseña de usuarios.
*El administrador (`admin`) solo verá las acciones que realizó o aquellas aplicadas a usuarios de nivel inferior (`operario`, `hidraulico`). El `superadmin` ve todo.*
* **Método**: `GET`
* **Ruta**: `/auditoria/usuarios`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "usuarioAfectadoId": 3,
        "usuarioAfectadoUsername": "operario_norte",
        "accion": "CREACION",
        "ejecutorId": 1,
        "ejecutorUsername": "admin_principal",
        "fecha": "2026-06-02T16:25:22.000Z",
        "detalles": "Creación del usuario con rol: operario"
      }
    ]
  }
  ```

---

### 🔐 2. Historial de Accesos al Sistema (Logins / Logouts)
Bitácora de inicio de sesión exitoso, fallido y cierres de sesión de cuentas, incluyendo la dirección IP y el navegador/sistema (User Agent) desde el que se realizó la petición.
*El administrador (`admin`) no tiene acceso a los registros de accesos de cuentas con rol `superadmin` o `admin`.*
* **Método**: `GET`
* **Ruta**: `/auditoria/accesos`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`)
* **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 15,
        "username": "operario_norte",
        "accion": "LOGIN_EXITOSO",
        "ip": "190.24.120.5",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/... ",
        "fecha": "2026-06-03T14:15:00.000Z",
        "detalles": "Inicio de sesión exitoso. Rol: operario"
      }
    ]
  }
  ```

---

## 📥 Endpoints de Exportación a Excel (`/export`)

Estos endpoints devuelven archivos binarios tipo Excel (`.xlsx`). Debido a que devuelven un Stream Binario, debes configurar la petición en tu frontend para recibir un `blob`.

### 📊 1. Exportar Indicadores Técnicos
* **Método**: `GET`
* **Ruta**: `/export/indicadores-tecnicos`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`, `hidraulico`)
* **Parámetros Query de Filtrado (Opcionales)**:
  * Admite los mismos parámetros que el endpoint de listado (`anio`, `mes`, `fechaInicio`, `fechaFin`). Solo exportará los registros que coincidan con estos filtros.

---

### 🚰 2. Exportar Registro de Macromedidor
* **Método**: `GET`
* **Ruta**: `/export/registro-macromedidor`
* **Autenticación**: Requerida (Bearer Token) + Roles (`superadmin`, `admin`, `hidraulico`, `operario`)
* **Regla de Rol**: Si el usuario autenticado tiene el rol `operario`, el servidor filtrará la consulta y **únicamente exportará las lecturas ingresadas por el operario solicitante**, garantizando la privacidad y trazabilidad. Para los demás roles, se exportarán todos los registros coincidentes.
* **Parámetros Query de Filtrado (Opcionales)**:
  * `fecha` (YYYY-MM-DD): Exportar el día completo.
  * `fechaInicio` y `fechaFin` (YYYY-MM-DD): Rango de fechas.
  * `anio` y `mes` (Números): Filtra por el año y mes entero.
  * *Si se omiten los parámetros de consulta, se exportará la base de datos completa de macromedición (restringido a su propio usuario si es `operario`).*

---

### 💡 Ejemplo de Código en React / Axios para Descargar los Archivos
Dado que la API retorna un buffer binario, debes consumirlo así en tu frontend:

```javascript
import axios from 'axios';
import fileDownload from 'js-file-download'; // O puedes generar un enlace <a> temporal

const descargarExcelMacromedidor = async (filtros) => {
  try {
    const token = localStorage.getItem('token'); // Recupera tu JWT token
    const response = await axios.get('http://localhost:3000/api/export/registro-macromedidor', {
      params: filtros, // Ej: { anio: 2026, mes: 6 }
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob' // CRÍTICO: Indica a Axios que procese la respuesta como binario (Blob)
    });

    // Descargar el archivo con el nombre adecuado
    const nombreArchivo = `registro_macromedidor_${new Date().toISOString().substring(0, 10)}.xlsx`;
    fileDownload(response.data, nombreArchivo);
  } catch (error) {
    console.error('Error descargando el Excel:', error);
  }
};
```

*Si usas la API Nativa `fetch` en JavaScript:*
```javascript
const descargarExcelFetch = async () => {
  const response = await fetch('http://localhost:3000/api/export/registro-macromedidor', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'registro_macromedidor.xlsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
};
```

---

## ❌ Manejo Estándar de Errores de la API

El backend devuelve respuestas de error estructuradas bajo el estándar de NestJS. Todos los errores tienen el siguiente formato en su cuerpo JSON:

```json
{
  "statusCode": 400, // Código de estado HTTP
  "message": "Mensaje detallado explicando el motivo del error", // Puede ser un String o un Array de strings si son errores de validación de formulario
  "error": "Bad Request" // Tipo de error HTTP
}
```

### Códigos de Estado Comunes a manejar:
* `400 Bad Request`: Formato de datos de entrada inválido o malformado (ej. enviar una fecha con formato incorrecto o un valor negativo en lectura).
* `401 Unauthorized`: El Bearer Token no fue enviado, expiró o es incorrecto. Debe redirigirse al usuario a la pantalla de Login.
* `403 Forbidden`: El usuario tiene un token válido pero su rol no posee permisos suficientes para acceder a este endpoint (ej. un `operario` intentando acceder a la auditoría de usuarios).
* `404 Not Found`: El registro consultado por ID no existe o ya fue eliminado del sistema.
* `409 Conflict`: Intentar registrar un macromedidor en un horario/fecha que ya está ocupado.
* `429 Too Many Requests`: Demasiadas peticiones desde la misma IP (Rate Limiter activo). Esperar antes de reintentar.
