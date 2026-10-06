---
layout: doc
title: "PostgreSQL: cifrado y auditoría"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: cifrado y auditoría

## 🔐 Cifrado en PostgreSQL

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

### 🛠️ Tipos de cifrado en PostgreSQL

- **A nivel de aplicación / columnas**: para programadores o cifrado personalizado
- **Cifrado en tránsito (SSL/TLS)**: cifrado de los datos mientras viajan por la red

### Extensión pgcrypto (cifrado manual)

Paquete para hacer cifrado, hash y autenticación.

```sql
--Preparación
CREATE EXTENSION pgcrypto;
CREATE EXTENSION pgcrypto SCHEMA utilitats;  -- Para ocultar funciones
```

Y cómo saber si se ha instalado bien...

```sql
SELECT extname  FROM pg_extension;
\dx
```

También se puede comprobar si una extensión está disponible para ser instalada con: `SELECT * FROM pg_available_extensions WHERE name = 'pgcrypto';`

Una extensión se instala dentro de un **schema**. Importante: `search_path`. Aunque la extensión esté instalada, puede no funcionar si el esquema no está en el search_path.

```sql
 -- ¿Cómo saber en qué schema está instalada una extensión?
SELECT extname, extnamespace::regnamespace
FROM pg_extension WHERE extname = 'pgcrypto';
```

Una extensión incluye unas funciones que se pueden utilizar en el código PL/pgSQL

```sql
 -- Para saber de qué funciones dispone una extensión...
SELECT proname FROM pg_proc WHERE pronamespace = (
    SELECT extnamespace     FROM pg_extension     WHERE extname = 'pgcrypto' );
```

```sql
 -- uso de una función de PGCRYPTO
INSERT INTO usuaris (nom, email)
VALUES (
  'Anna',
  pgp_sym_encrypt('anna@email.com', 'clau_secreta')
);
```

```sql
Leer datos / descifrar
SELECT nom,
       pgp_sym_decrypt(email, 'clau_secreta')
FROM usuaris;
```

```sql
-- Generar un HASH con "bcrypt"
INSERT INTO usuaris (nom, password)
VALUES (
  'anna',
  crypt('contrasenya123', gen_salt('bf'))
);
-- bf >> bcrypt
-- crypt('contrasenya123', gen_salt('bf',12)) >> incrementa el coste (12)
```

```sql
--Verificar la contraseña
SELECT *
FROM usuaris
WHERE nom = 'anna'
  AND password = crypt('contrasenya123', password);
-- Como en password están el salt y el coste, calcula el bcrypt de 'contrasenya123' con ese salt y ese coste
```

```sql
--Otras opciones
SELECT digest('text', 'sha256');
```

---

### Cifrado en tránsito (SSL/TLS)

Cifrado automático a nivel de red.

```txt
-- Editar postgresql.conf:
ssl = on
```

```txt
--  Añadir los certificados
server.crt   -- certificado
server.key   -- clave privada
```

```bash
-- Permisos importantes
chmod 600 server.key
```

```bash
-- Reiniciar postgres
pg_ctl restart
```

```txt
-- Configurar el acceso seguro (pg_hba.conf)
hostssl all all 0.0.0.0/0 md5
```

Conectar con:

```bash
psql -h localhost -d empresa -U anna --set=sslmode=require
o
psql "host=localhost dbname=empresa user=anna sslmode=verify-full"
```

Modos SSL importantes (sslmode)

| Modo | Significado |
| --- | --- |
| disable | sin SSL |
| prefer | usa SSL si puede |
| require | obliga a usar SSL |
| verify-ca | valida el certificado |
| verify-full | valida el certificado + el host |

---

### Buenas prácticas

- Cifra solo los datos sensibles
- Evita BASE64 o ROT13 para contraseñas
- Usa funciones `HASH()` para almacenar contraseñas

### Conclusión

El cifrado es esencial para la protección de datos en entornos reales y es un requisito legal y de buenas prácticas. PostgreSQL ofrece soluciones potentes que cubren necesidades técnicas y legales.

> 🔐 Una buena gestión de claves, un uso moderado del cifrado y la auditoría de acceso son claves para garantizar una seguridad real.

## 🕵️ Auditoría en PostgreSQL

### 📘 ¿Qué es una auditoría?

La auditoría es una funcionalidad de los sistemas gestores de bases de datos que permite **registrar y controlar la actividad de los usuarios**. Es especialmente útil por motivos de seguridad, detección de errores, trazabilidad y cumplimiento normativo (p. ej., RGPD).

### 🎯 Objetivos de la auditoría

- Detectar acciones no autorizadas
- Rastrear cambios o accesos a datos sensibles
- Monitorizar la actividad de los usuarios privilegiados
- Cumplir con auditorías internas o externas

### ⚙️ Tipos de auditoría en PostgreSQL

#### Auditoría básica (logs del servidor)

```txt
-- En el fichero postgresql.conf
logging_collector = on
log_statement = 'all'
log_connections = on
log_disconnections = on
```

Esto registra: conexiones, desconexiones y todas las consultas SQL

⚠️ Problema: demasiada información (puede saturar) y no es estructurada (difícil de analizar)

#### Auditoría avanzada con una extensión (pgAudit)

```txt
-- Configuración
shared_preload_libraries = 'pgaudit'
pgaudit.log = 'read, write, ddl'
```

```bash
-- aplicar los cambios...
sudo systemctl restart postgresql
```

```sql
-- Instalación
CREATE EXTENSION pgaudit;
```

→ La información NO se guarda en una tabla, sino en los logs del servidor PostgreSQL.

```txt
Lo más habitual, y según esté configurado en postgresql.conf

logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d.log'
```

En la ruta: /var/lib/postgresql/data/log/postgresql-2026-03-20.log

Se podrá encontrar información en este formato...

```sql
AUDIT: READ, SELECT, table=clients, user=anna
```

Si tienes

```txt
log_destination = 'syslog'
```

👉 Los logs van a: /var/log/syslog, /var/log/messages

#### Auditoría con triggers (personalizada)

#### Auditoría de accesos

Intentos de login (log_connections) y fallos (log_failed_attempts, indirectamente)

### Cómo ver los registros de la auditoría

### Consejos de seguridad y gestión

- Activa la auditoría para acciones sensibles (login, borrar, cambiar permisos)
- Revisa regularmente los registros de auditoría
- No dejes la auditoría abierta en producción sin revisar el espacio
- Automatiza el análisis con scripts o informes

### Conclusión

La auditoría es una herramienta potente para la seguridad y el control de las bases de datos PostgreSQL. Permite identificar comportamientos sospechosos, controlar accesos no autorizados y mantener la trazabilidad de las operaciones. Además, es una práctica recomendada por normativas legales y de calidad.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
