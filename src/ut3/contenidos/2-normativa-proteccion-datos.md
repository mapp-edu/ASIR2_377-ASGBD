---
layout: doc
title: "Normativa de protección de datos"
sidebar: true
outline: [2, 3]
aside: true
---

# Normativa de protección de datos

## ⚖️ Normativa vigente en materia de protección de datos

### 📘 ¿Qué es la normativa de protección de datos?

Es el conjunto de leyes y regulaciones que tienen como objetivo **garantizar la privacidad y la seguridad de los datos personales** que gestionan las empresas y organizaciones. Afecta directamente a la gestión de los sistemas de información, especialmente a los que contienen bases de datos con información de personas físicas.

### 🇪🇺 Reglamento General de Protección de Datos (RGPD)

- **Nombre completo:** Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo
- **Aplicación:** obligatoria en todos los Estados miembros de la Unión Europea desde el 25 de mayo de 2018
- **Objetivo:** proteger los derechos fundamentales de las personas en lo que respecta al tratamiento de sus datos personales

#### Principios básicos del RGPD

- Licitud, lealtad y transparencia
- Finalidad determinada y legítima
- Minimización de datos
- Exactitud
- Limitación del plazo de conservación
- Integridad y confidencialidad
- Responsabilidad proactiva

#### 👥 Derechos de las personas usuarias

- Derecho de acceso
- Derecho de rectificación
- Derecho de supresión («derecho al olvido»)
- Derecho de oposición
- Derecho a la limitación del tratamiento
- Derecho a la portabilidad de los datos

### 🇪🇸 LOPDGDD – Ley Orgánica 3/2018

En España, el RGPD se complementa con la LOPDGDD:

- **Nombre completo:** Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales
- **Objetivo:** adaptar el RGPD al ordenamiento jurídico español y añadir derechos digitales

#### Algunos puntos destacados de la LOPDGDD

- Designación de un Delegado de Protección de Datos (DPD) en determinadas entidades
- Medidas de seguridad según el riesgo de los datos tratados
- Registro de actividades de tratamiento
- Evaluación de impacto cuando hay un riesgo elevado
- Derechos digitales: educación digital, neutralidad, desconexión laboral, etc.

### Obligaciones técnicas relacionadas con las bases de datos

- Control de acceso y permisos por roles
- Auditorías de acceso a datos personales
- Registro de cambios y transacciones
- Copias de seguridad y planes de recuperación
- Cifrado de datos sensibles

### Derechos ARCO

- Acceso
- Rectificación
- Cancelación
- Oposición

### Papel del SGBD

- Gestión de usuarios y permisos
- Sistemas de recuperación
- Integridad referencial (RI)
- Cifrado (información sensible)
- Auditoría

### Clasificar la información

- Nivel básico
- Nivel medio
- Nivel alto

**Los procedimientos deben estar documentados y supervisados para poder garantizar el cumplimiento de la normativa y de la ley.**

### 📊 Sanciones por incumplimiento

El RGPD prevé sanciones de hasta el **4 % del volumen de negocio anual global** o **20 millones de euros**, la cuantía que sea mayor.

### Conclusión

Tanto el **RGPD** como la **LOPDGDD** establecen un marco normativo estricto y necesario para proteger los datos personales. A la hora de administrar bases de datos, hay que asegurarse de que:

- Los datos sensibles están bien protegidos
- Solo accede a ellos quien está autorizado
- Se pueden trazar las operaciones sobre datos personales
- Se pueden cumplir los derechos de los usuarios

> ⚖️ «Una base de datos segura no solo es eficiente, sino también legalmente responsable.»

## Informes de buenas prácticas del CCN-CERT

![Logotipo del CCN-CERT, Centro Criptológico Nacional #center](/img/contenidos/ut3/logo-ccncert.png)

Los informes **CCN-CERT BP** son documentos técnicos que ofrecen recomendaciones y buenas prácticas de ciberseguridad, elaborados por el CCN-CERT con el objetivo de ayudar a las administraciones públicas y a otras organizaciones a mejorar la protección de sus sistemas de información.

- [CCN-CERT BP/24. Recomendaciones de seguridad en bases de datos](https://www.ccn-cert.cni.es/es/series-ccn-stic/informes-de-ciberseguridad-ccn-cert/informes-ccn-cert-buenas-practicas-bp/6353-ccn-cert-bp-24-recomendaciones-de-seguridad-en-bases-de-datos/file.html)
- [CCN-CERT BP/22. Recomendaciones de seguridad para Oracle Database 19c](https://www.ccn-cert.cni.es/es/pdf/informes-de-ciberseguridad-ccn-cert/informes-ccn-cert-buenas-practicas-bp/6257-ccn-cert-bp22-recomendaciones-de-seguridad-para-oracle-database-19c/file.html)
- [Security Information in PostgreSQL](https://www.postgresql.org/support/security/) (página oficial de seguridad de PostgreSQL, en inglés)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
