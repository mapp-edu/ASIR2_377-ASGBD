---
layout: doc
title: "Oracle: cifrado y auditoría"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: cifrado y auditoría

## 🔐 Cifrado en Oracle

### ¿Qué es y por qué cifrar?

El cifrado (encriptación) convierte datos legibles en un formato codificado que solo se puede descifrar con una clave. Es esencial para proteger información sensible.

Otra manera de proteger datos es hacer un HASH (hashing). Objetivo: generar una huella única e irreversible de un texto. Uso típico: guardar contraseñas de forma segura, verificar la integridad de ficheros, firmas digitales.

#### Razones para aplicar cifrado:

- Protección de datos sensibles (DNI, contraseñas...)
- Evitar el robo de datos en caso de ataque o acceso indebido
- Cumplimiento legal (RGPD, LOPDGDD)
- Requisitos de seguridad corporativa o gubernamental (CCN-CERT)

#### ⚠️ Posibles inconvenientes:

- Rendimiento reducido si se usa masivamente
- Aumento de la complejidad en la gestión
- Puede limitar la compatibilidad con aplicaciones

### 🛠️ Tipos de cifrado en Oracle

- **Manual con DBMS_CRYPTO**: para programadores o cifrado personalizado
- **TDE (Transparent Data Encryption)**: cifrado automático por columnas o tablespaces

### DBMS_CRYPTO (cifrado manual)

Paquete para hacer cifrado, hash y autenticación.

- `DBMS_CRYPTO.ENCRYPT()` / `DECRYPT()`
- `DBMS_CRYPTO.HASH()`

Fuera del paquete `DBMS_CRYPTO`, la función `STANDARD_HASH` es una función incorporada, como SYSDATE, y permite calcular un HASH más fácilmente

#### Ejemplo: hacer un hash SHA-1 de una contraseña

(Las funciones HASH no cifran, solo resumen. No se pueden descifrar)

Ejemplo de uso de la función STANDARD_HASH, incorporada en Oracle

```sql
SELECT STANDARD_HASH('contrasenya', 'SHA1') FROM dual;   --muy débil actualmente
-- otro tipo de hash
SELECT STANDARD_HASH('contrasenya', 'SHA256') FROM dual;
```

STANDARD_HASH soporta todos los algoritmos modernos (MD5, SHA1, SHA256, SHA384, SHA512, SHA3_256, SHA3_512…)

También se puede hacer con la función HASH del paquete DBMS_CRYPTO

```sql
SELECT RAWTOHEX(  DBMS_CRYPTO.HASH(HEXTORAW('1231'),3) ) FROM dual;
SELECT RAWTOHEX(  DBMS_CRYPTO.HASH(UTL_I18N.STRING_TO_RAW('SECRETA'),4) ) FROM dual;
-- Donde el número del segundo parámetro => type 3:SHA-1 type 4:SHA256 type 5:SHA384 type 6:SHA512
```

Para hacer una buena gestión del hash de contraseñas hay que combinar: usar SHA-512, añadir salt y añadir iteraciones (hash lento); o utilizar desde la capa de aplicación funciones externas como bcrypt, scrypt, argon2 o PBKDF2, pensadas especialmente para contraseñas.

#### Ejemplo de cifrado con AES

```sql
SELECT RAWTOHEX(
         DBMS_CRYPTO.ENCRYPT(
           src => UTL_RAW.cast_to_raw('Texto secreto'),
           typ => 4354, -- AES_CBC_PKCS5
           key => UTL_RAW.cast_to_raw('0123456789ABCDEF0123456789ABCDEF'),
           iv  => UTL_RAW.cast_to_raw('ABCDEF9876543210')
         )
       ) AS text_encriptat_hex
FROM dual;
```

```txt
Oracle determina automáticamente qué versión de AES se debe aplicar según la longitud del RAW
  que se envíe al parámetro key (clave de 16 bytes → AES-128, clave de 24 bytes → AES-192, clave de 32 bytes → AES-256)
```

#### Convertir entre formatos:

- `UTL_I18N.STRING_TO_RAW` → texto a RAW
- `RAWTOHEX` → RAW a hexadecimal (y `HEXTORAW` al revés)
- `UTL_I18N.RAW_TO_CHAR` → RAW a texto

---

### 💾 TDE – Transparent Data Encryption

Cifrado automático a nivel de disco. No hace falta modificar el código de las aplicaciones.

#### Componentes:

- **TDE Master Key** → clave maestra
- **Keystore (Wallet)** → archivo con claves
- **Column / Tablespace Keys** → claves específicas

#### 🔁 Modalidades:

- **Column-level TDE**: solo algunas columnas
- **Tablespace-level TDE**: todos los datos dentro del tablespace

---

### Buenas prácticas

- Cifra solo los datos sensibles
- Evita BASE64 o ROT13 para contraseñas
- Usa funciones `HASH()` para almacenar contraseñas
- Gestiona la keystore con seguridad
- Audita el acceso a los datos cifrados

### Conclusión

El cifrado es esencial para la protección de datos en entornos reales y es un requisito legal y de buenas prácticas. Oracle ofrece soluciones potentes como TDE y DBMS_CRYPTO que cubren necesidades técnicas y legales.

> 🔐 Una buena gestión de claves, un uso moderado del cifrado y la auditoría de acceso son claves para garantizar una seguridad real.

## 🕵️ Auditoría en Oracle

### 📘 ¿Qué es una auditoría?

La auditoría es una funcionalidad de los sistemas gestores de bases de datos que permite **registrar y controlar la actividad de los usuarios**. Es especialmente útil por motivos de seguridad, detección de errores, trazabilidad y cumplimiento normativo (p. ej., RGPD).

### 🎯 Objetivos de la auditoría

- Detectar acciones no autorizadas
- Rastrear cambios o accesos a datos sensibles
- Monitorizar la actividad de los usuarios privilegiados
- Cumplir con auditorías internas o externas

### ⚙️ Tipos de auditoría en Oracle

- **Estándar (traditional)**: basada en órdenes como `AUDIT`
- **Auditoría unificada (Unified Audit)**: disponible desde Oracle 12c

#### 🔎 Diferencias:

| Característica | Estándar | Unificada |
| --- | --- | --- |
| Implementación | Bases separadas (AUD$) | Todas las auditorías integradas |
| Activa por defecto | No | Sí, desde 12c |
| Control granular | Limitado | Muy flexible |
| Mejor rendimiento | No | Sí |

### 🛠️ Activar la auditoría estándar (tradicional)

Desde Oracle 23ai no se puede utilizar (obsoleta).

### 🛠️ Unified Audit (Oracle 12c+)

Unifica todos los registros de auditoría: privilegios, órdenes, errores, logons... Se activa con el parámetro de sistema `ENABLE_UNIFIED_AUDIT = TRUE`.

```sql
SELECT VALUE
FROM V$OPTION
WHERE PARAMETER = 'Unified Auditing';   -- para saber si está activa
```

Modos de la auditoría unificada

Mixed Mode: puedes usar AUDIT SESSION y Unified Auditing a la vez <br> Only Mode: solo funciona Unified Auditing; los antiguos comandos AUDIT están bloqueados

#### Ejemplo de política unificada:

```sql
CREATE AUDIT POLICY aud_logins
  ACTIONS LOGON;

AUDIT POLICY aud_logins;    -- Audita los logins de usuarios

CREATE AUDIT POLICY acces_alumnes
  ACTIONS SELECT ON alumnes;

AUDIT POLICY acces_alumnes;      -- Audita los selects sobre una tabla (de cualquier usuario)

AUDIT POLICY acces_alumnes BY usuari1,usuari2;  -- Audita los selects sobre una tabla (por parte de usuari1 o usuari2)
```

### 📦 Vistas de auditoría unificada

- `AUDIT_UNIFIED_POLICIES`
- `AUDIT_UNIFIED_ENABLED_POLICIES`
- `UNIFIED_AUDIT_TRAIL`

### Cómo ver las reglas creadas

```sql
SELECT policy_name, audit_option, condition_eval_opt, audit_condition
FROM audit_unified_policies
ORDER BY policy_name;
```

### Cómo ver las reglas activas

```sql
SELECT * FROM AUDIT_UNIFIED_ENABLED_POLICIES;
```

### Cómo ver los registros de la auditoría

```sql
SELECT EVENT_TIMESTAMP, DBUSERNAME, USERHOST, ACTION_NAME
      FROM UNIFIED_AUDIT_TRAIL
      WHERE OBJECT_NAME = 'ALUMNES';
      ORDER BY EVENT_TIMESTAMP DESC;
```

```sql
-- Deshabilitar primero
NOAUDIT POLICY acces_alumnes;

-- Eliminar la política
DROP AUDIT POLICY nom_politica;
```

### Consejos de seguridad y gestión

- Activa la auditoría para acciones sensibles (login, borrar, cambiar permisos)
- Revisa regularmente los registros de auditoría
- No dejes la auditoría abierta en producción sin revisar el espacio
- Automatiza el análisis con scripts o informes

### Conclusión

La auditoría es una herramienta potente para la seguridad y el control de las bases de datos Oracle. Permite identificar comportamientos sospechosos, controlar accesos no autorizados y mantener la trazabilidad de las operaciones. Además, es una práctica recomendada por normativas legales y de calidad.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
