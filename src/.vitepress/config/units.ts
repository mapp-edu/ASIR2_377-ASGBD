// ============================================================================
// CONFIGURACIÓN DE UNIDADES — Navegación y Contenidos
// ============================================================================
//
// 👤 EDITA ESTE ARCHIVO para definir las unidades del módulo
//    y su navegación (navbar y sidebar).
//
// CONCEPTOS CLAVE:
//   Unidad (unit) — Un bloque de contenido con su propia navegación.
//                   Aquí, cada unidad es una unidad de trabajo (UT) del módulo,
//                   asociada a un resultado de aprendizaje (RA).
//   Navbar        — Menú horizontal en la barra superior.
//   Sidebar       — Panel de navegación lateral izquierdo.
//   code          — Prefijo de URL de los archivos de esta unidad.
//                   Ejemplo: code = 'ut1' → los links apuntan a /ut1/...
//
// ESTRUCTURA DE CADA UNIDAD (src/<code>/):
//   index.md                   Portada: RA, criterios de evaluación y mapa
//   contenidos/                Conceptos comunes a todos los SGBD
//   contenidos/oracle/         Teoría en versión Oracle
//   contenidos/postgresql/     Teoría en versión PostgreSQL
//   ejercicios/                Prácticas con rúbrica y cuestionarios
//
// FLUJO RÁPIDO:
//   1. Crea los archivos .md en src/<code>/contenidos/ o src/<code>/ejercicios/
//   2. Añade los links aquí (en el sidebar de la unidad)
//   3. El sistema detecta todas las unidades automáticamente:
//        /<code>/ → carga el sidebar de esa unidad
//        /        → raíz sin sidebar (guía didáctica)
//
// ============================================================================

import { DefaultTheme } from 'vitepress'
import type { NavGroup } from '../shared/navigation'

// ============================================================================
// 1. SIDEBARS
// ============================================================================

// ── UT1 · Implantación de sistemas gestores de bases de datos (RA1) ──────
const ut1Sidebar: DefaultTheme.SidebarItem[] = [
  { text: '🏁 Presentación de la unidad', link: '/' },
  {
    text: '📚 Conceptos comunes',
    collapsed: false,
    items: [
      { text: 'Conceptos generales de un SGBD', link: '/contenidos/1-conceptos-generales' },
    ],
  },
  {
    text: '🔶 Oracle',
    collapsed: false,
    items: [
      { text: 'Ediciones, versiones y requisitos', link: '/contenidos/oracle/1-ediciones-versiones-requisitos' },
      { text: 'Instancia, arquitectura y OFA', link: '/contenidos/oracle/2-instancia-arquitectura' },
      { text: 'Instalación y acceso', link: '/contenidos/oracle/3-instalacion-acceso' },
      { text: 'Creación de PDB y conclusiones', link: '/contenidos/oracle/4-pdb-conclusiones' },
    ],
  },
  {
    text: '🐘 PostgreSQL',
    collapsed: false,
    items: [
      { text: 'Versiones, clúster y arquitectura', link: '/contenidos/postgresql/1-versiones-cluster-arquitectura' },
      { text: 'Instalación y estructura de carpetas', link: '/contenidos/postgresql/2-instalacion-estructura' },
      { text: 'Acceso y varios clústeres', link: '/contenidos/postgresql/3-acceso-multicluster' },
    ],
  },
  {
    text: '🧪 Prácticas y ejercicios',
    collapsed: false,
    items: [
      { text: 'Índice de actividades', link: '/ejercicios/' },
      { text: 'Práctica 1: preparación de la MV Linux Mint', link: '/ejercicios/practica-1-mv-linux-mint' },
      { text: 'Práctica 2: desplegar Oracle, PostgreSQL y MariaDB', link: '/ejercicios/practica-2-tres-sgbd' },
      { text: 'Práctica 3: instalar los clientes de los tres SGBD', link: '/ejercicios/practica-3-clientes' },
      { text: 'Práctica 4: preparación de la MV Windows 10 Pro', link: '/ejercicios/practica-4-mv-windows-10' },
      { text: 'Práctica 5: instalar Oracle 21c en Windows 10 Pro', link: '/ejercicios/practica-5-oracle-21c-windows' },
      { text: 'Práctica 6: selección del SGBD', link: '/ejercicios/practica-6-seleccion-sgbd' },
      { text: 'Cómo hacer un trabajo de clase', link: '/ejercicios/como-hacer-un-trabajo' },
      { text: 'Guía: Oracle Database Free en un contenedor', link: '/ejercicios/guia-1-oracle-en-contenedor' },
      { text: 'Guía: CDB y PDB con dbca', link: '/ejercicios/guia-2-cdb-pdb' },
      { text: 'Guía: órdenes básicas y primeros errores en Oracle', link: '/ejercicios/guia-3-ordenes-basicas-errores' },
      { text: 'Cuestionario de autoevaluación', link: '/ejercicios/cuestionario' },
    ],
  },
]

// ── UT2 · Configuración del sistema gestor de bases de datos (RA2) ──────
const ut2Sidebar: DefaultTheme.SidebarItem[] = [
  { text: '🏁 Presentación de la unidad', link: '/' },
  {
    text: '⏳ Repaso previo',
    collapsed: true,
    items: [
      { text: 'Modelo entidad-relación', link: '/contenidos/repaso-1-modelo-er' },
      { text: 'Tipos de datos y tablas', link: '/contenidos/repaso-2-sql-tablas' },
      { text: 'Operaciones CRUD', link: '/contenidos/repaso-3-sql-crud' },
      { text: 'Normalización, permisos, transacciones y JOIN', link: '/contenidos/repaso-4-sql-avanzado' },
    ],
  },
  {
    text: '🔶 Oracle',
    collapsed: false,
    items: [
      { text: 'Entorno y conexiones', link: '/contenidos/oracle/1-entorno-conexiones' },
      { text: 'Instancia, cuentas de administración y arranque', link: '/contenidos/oracle/2-instancia-cuentas-arranque' },
      { text: 'Almacenamiento y diccionario de datos', link: '/contenidos/oracle/3-almacenamiento-diccionario' },
      { text: 'Redo log, ficheros log y parámetros NLS', link: '/contenidos/oracle/4-redo-log-ficheros-log' },
      { text: 'Gestión de fechas', link: '/contenidos/oracle/5-fechas-en-oracle' },
    ],
  },
  {
    text: '🐘 PostgreSQL',
    collapsed: false,
    items: [
      { text: 'Entorno y conexiones', link: '/contenidos/postgresql/1-entorno-conexiones' },
      { text: 'Clúster, cuentas de administración y arranque', link: '/contenidos/postgresql/2-instancia-cuentas-arranque' },
      { text: 'Almacenamiento y diccionario de datos', link: '/contenidos/postgresql/3-almacenamiento-diccionario' },
      { text: 'WAL y ficheros log', link: '/contenidos/postgresql/4-wal-ficheros-log' },
    ],
  },
  {
    text: '🧪 Prácticas y ejercicios',
    collapsed: false,
    items: [
      { text: 'Índice de actividades', link: '/ejercicios/' },
      { text: 'Práctica 1: primeros pasos en la administración de Oracle', link: '/ejercicios/practica-1-primeros-pasos' },
      { text: 'Práctica 2: selección del motor de almacenamiento', link: '/ejercicios/practica-2-motor-de-almacenamiento' },
      { text: 'Práctica 3: asegurar las cuentas de administración', link: '/ejercicios/practica-3-cuentas-de-administracion' },
      { text: 'Guía: tablespaces y datafiles en Oracle', link: '/ejercicios/guia-1-tablespaces-datafiles' },
      { text: 'Guía: uso de SQL*Plus', link: '/ejercicios/guia-2-uso-sqlplus' },
      { text: 'Guía: uso de vi', link: '/ejercicios/guia-3-uso-vi' },
      { text: 'Cuestionario de autoevaluación', link: '/ejercicios/cuestionario' },
    ],
  },
]

// ── UT3 · Control de acceso: usuarios, vistas y privilegios (RA3) ──────
const ut3Sidebar: DefaultTheme.SidebarItem[] = [
  { text: '🏁 Presentación de la unidad', link: '/' },
  {
    text: '📚 Conceptos comunes',
    collapsed: false,
    items: [
      { text: 'La tríada CID', link: '/contenidos/1-triada-cid' },
      { text: 'Normativa de protección de datos', link: '/contenidos/2-normativa-proteccion-datos' },
    ],
  },
  {
    text: '🔶 Oracle',
    collapsed: false,
    items: [
      { text: 'Usuarios y seguridad de las cuentas', link: '/contenidos/oracle/1-usuarios' },
      { text: 'Privilegios, roles y perfiles', link: '/contenidos/oracle/2-privilegios-roles-perfiles' },
      { text: 'Vistas y sinónimos', link: '/contenidos/oracle/3-vistas-sinonimos' },
      { text: 'Cifrado y auditoría', link: '/contenidos/oracle/4-cifrado-auditoria' },
      { text: 'Integridad y transacciones', link: '/contenidos/oracle/5-integridad-transacciones' },
      { text: 'Copias de seguridad y recuperación', link: '/contenidos/oracle/6-copias-seguridad' },
    ],
  },
  {
    text: '🐘 PostgreSQL',
    collapsed: false,
    items: [
      { text: 'Usuarios y seguridad de las cuentas', link: '/contenidos/postgresql/1-usuarios' },
      { text: 'Privilegios, roles y perfiles', link: '/contenidos/postgresql/2-privilegios-roles-perfiles' },
      { text: 'Vistas como mecanismo de seguridad', link: '/contenidos/postgresql/3-vistas' },
      { text: 'Cifrado y auditoría', link: '/contenidos/postgresql/4-cifrado-auditoria' },
      { text: 'Integridad y transacciones', link: '/contenidos/postgresql/5-integridad-transacciones' },
      { text: 'Copias de seguridad y recuperación', link: '/contenidos/postgresql/6-copias-seguridad' },
    ],
  },
  {
    text: '🧪 Prácticas y ejercicios',
    collapsed: false,
    items: [
      { text: 'Índice de actividades', link: '/ejercicios/' },
      { text: 'Práctica 1: usuarios y permisos', link: '/ejercicios/practica-1-usuarios-permisos' },
      { text: 'Práctica 2: copias con Oracle expdp', link: '/ejercicios/practica-2-copias-expdp' },
      { text: 'Práctica 3: vistas, sinónimos y roles', link: '/ejercicios/practica-3-vistas-sinonimos-roles' },
      { text: 'Guía: conexiones como SYSDBA en Windows', link: '/ejercicios/guia-1-sysdba-en-windows' },
      { text: 'Guía: permisos UPDATE y DELETE en Oracle', link: '/ejercicios/guia-2-update-delete-select' },
      { text: 'Guía: usuarios comunes en Oracle', link: '/ejercicios/guia-3-usuarios-comunes' },
      { text: 'Cuestionario de autoevaluación', link: '/ejercicios/cuestionario' },
    ],
  },
]

// ── UT4 · Automatización de tareas de administración (RA4) ──────
const ut4Sidebar: DefaultTheme.SidebarItem[] = [
  { text: '🏁 Presentación de la unidad', link: '/' },
  {
    text: '🔶 Oracle',
    collapsed: false,
    items: [
      { text: 'Automatización, conceptos', link: '/contenidos/oracle/1-automatizacion-conceptos' },
      { text: 'PL/SQL: bloques anónimos, variables y operaciones', link: '/contenidos/oracle/2-bloques-variables' },
      { text: 'PL/SQL: estructuras de control', link: '/contenidos/oracle/3-estructuras-control' },
      { text: 'PL/SQL: procedimientos y funciones', link: '/contenidos/oracle/4-procedimientos-funciones' },
      { text: 'Disparadores y secuencias', link: '/contenidos/oracle/5-disparadores-secuencias' },
      { text: 'PL/SQL: cursores y excepciones', link: '/contenidos/oracle/6-cursores-excepciones' },
      { text: 'Tareas automatizables', link: '/contenidos/oracle/7-tareas-programadas' },
    ],
  },
  {
    text: '🐘 PostgreSQL',
    collapsed: false,
    items: [
      { text: 'Automatización, conceptos', link: '/contenidos/postgresql/1-automatizacion-conceptos' },
      { text: 'PL/pgSQL: bloques DO, variables y operaciones', link: '/contenidos/postgresql/2-bloques-variables' },
      { text: 'PL/pgSQL: estructuras de control', link: '/contenidos/postgresql/3-estructuras-control' },
      { text: 'PL/pgSQL: procedimientos y funciones', link: '/contenidos/postgresql/4-procedimientos-funciones' },
      { text: 'Disparadores y secuencias', link: '/contenidos/postgresql/5-disparadores-secuencias' },
      { text: 'PL/pgSQL: cursores y excepciones', link: '/contenidos/postgresql/6-cursores-excepciones' },
      { text: 'Tareas automatizables', link: '/contenidos/postgresql/7-tareas-programadas' },
    ],
  },
  {
    text: '🧪 Prácticas y ejercicios',
    collapsed: false,
    items: [
      { text: 'Índice de actividades', link: '/ejercicios/' },
      { text: 'Práctica 1: bloques anónimos en Oracle', link: '/ejercicios/practica-1-bloques-anonimos' },
      { text: 'Práctica 2: boletín de repaso de PL/SQL', link: '/ejercicios/practica-2-boletin-plsql' },
      { text: 'Práctica 3: boletín de procedimientos y funciones', link: '/ejercicios/practica-3-procedimientos-funciones' },
      { text: 'Práctica 4: procedimiento almacenado y permisos de ejecución', link: '/ejercicios/practica-4-procedimiento-almacenado' },
      { text: 'Práctica 5: crear un job en Oracle', link: '/ejercicios/practica-5-jobs' },
      { text: 'Práctica 6: disparadores', link: '/ejercicios/practica-6-disparadores' },
      { text: 'Guía: AUTHID en los procedimientos almacenados', link: '/ejercicios/guia-1-authid' },
      { text: 'Guía: la variable de control en WHILE, FOR y LOOP', link: '/ejercicios/guia-2-ambito-variables-bucles' },
      { text: 'Cuestionario de autoevaluación', link: '/ejercicios/cuestionario' },
    ],
  },
]

// ── UT5 · Optimización del rendimiento (RA5) ──────
const ut5Sidebar: DefaultTheme.SidebarItem[] = [
  { text: '🏁 Presentación de la unidad', link: '/' },
  {
    text: '🔶 Oracle',
    collapsed: false,
    items: [
      { text: 'Monitorización del SGBD', link: '/contenidos/oracle/1-monitorizacion' },
      { text: 'Optimización y herramientas', link: '/contenidos/oracle/2-optimizacion' },
      { text: 'Optimización de los objetos de la base de datos', link: '/contenidos/oracle/3-optimizacion-objetos' },
    ],
  },
  {
    text: '🐘 PostgreSQL',
    collapsed: false,
    items: [
      { text: 'Monitorización del SGBD', link: '/contenidos/postgresql/1-monitorizacion' },
      { text: 'Optimización y herramientas', link: '/contenidos/postgresql/2-optimizacion' },
      { text: 'Optimización de los objetos de la base de datos', link: '/contenidos/postgresql/3-optimizacion-objetos' },
    ],
  },
  {
    text: '🧪 Prácticas y ejercicios',
    collapsed: false,
    items: [
      { text: 'Índice de actividades', link: '/ejercicios/' },
      { text: 'Práctica 1: monitorización y alertas de rendimiento', link: '/ejercicios/practica-1-monitorizacion-y-alertas' },
      { text: 'Práctica 2: índices y optimización de consultas', link: '/ejercicios/practica-2-indices-y-consultas' },
      { text: 'Práctica 3: recursos del SGBD y ajustes del sistema operativo', link: '/ejercicios/practica-3-recursos-y-sistema-operativo' },
      { text: 'Cuestionario de autoevaluación', link: '/ejercicios/cuestionario' },
    ],
  },
]

// ── UT6 · Disponibilidad: bases de datos distribuidas y replicadas (RA6) ──────
const ut6Sidebar: DefaultTheme.SidebarItem[] = [
  { text: '🏁 Presentación de la unidad', link: '/' },
  {
    text: '📚 Conceptos comunes',
    collapsed: false,
    items: [
      { text: 'Bases de datos en la nube y clústeres', link: '/contenidos/1-nube-cluster' },
      { text: 'SGBD distribuidos y reglas de Date', link: '/contenidos/2-sgbd-distribuidos' },
      { text: 'Fragmentación y replicación', link: '/contenidos/3-fragmentacion-replicacion' },
    ],
  },
  {
    text: '🔶 Oracle',
    collapsed: false,
    items: [
      { text: 'Clúster Oracle RAC', link: '/contenidos/oracle/1-oracle-rac' },
    ],
  },
  {
    text: '🐘 PostgreSQL',
    collapsed: false,
    items: [
      { text: 'PostgreSQL como SGBD distribuido', link: '/contenidos/postgresql/1-postgresql-distribuido' },
    ],
  },
  {
    text: '🧪 Prácticas y ejercicios',
    collapsed: false,
    items: [
      { text: 'Índice de actividades', link: '/ejercicios/' },
      { text: 'Práctica 1: base de datos distribuida y fragmentación', link: '/ejercicios/practica-1-base-de-datos-distribuida' },
      { text: 'Práctica 2: integración de bases de datos preexistentes', link: '/ejercicios/practica-2-integracion-de-bases-de-datos' },
      { text: 'Práctica 3: replicación maestro-esclavo y en cadena', link: '/ejercicios/practica-3-replicacion' },
      { text: 'Cuestionario de autoevaluación', link: '/ejercicios/cuestionario' },
    ],
  },
]

// ============================================================================
// 2. REGISTRO DE UNIDADES
// ============================================================================
// Propiedades de cada unidad:
//   id        — Identificador único (debe coincidir con la clave del objeto)
//   code      — Prefijo de URL. Los links del sidebar se prefijarán
//               automáticamente con /<code>/
//   title     — Nombre corto (aparece en el desplegable del navbar)
//   fullTitle — Nombre completo (pestaña del navegador)
//   siteTitle — Nombre en el sidebar (puede usar </br> para saltos de línea)
//   icon      — Emoji decorativo
//   navbar    — Barra superior. El navbar global lo aporta `root` y es el
//               mismo en todas las páginas: enlace a la guía y desplegable
//               «📚 Unidades» con todas las unidades (navbarGlobal).
//   sidebar   — Ítems del panel lateral de esta unidad

export interface UnitConfig {
  id: string
  code: string
  title: string
  fullTitle: string
  siteTitle: string
  icon: string
  navbar: DefaultTheme.NavItem[]
  sidebar: DefaultTheme.SidebarItem[]
}

// Barra superior, igual en todas las páginas (guía didáctica y unidades).
// Para ocultar una unidad del desplegable, quita su línea de `items`.
const navbarGlobal: DefaultTheme.NavItem[] = [
  { text: '🏠 Guía Didáctica', link: '/' },
  {
    text: '📚 Unidades',
    items: [
      { text: 'UT1 — Implantación de SGBD', link: '/ut1/' },
      { text: 'UT2 — Configuración del SGBD', link: '/ut2/' },
      { text: 'UT3 — Control de acceso', link: '/ut3/' },
      { text: 'UT4 — Automatización de tareas', link: '/ut4/' },
      { text: 'UT5 — Optimización del rendimiento', link: '/ut5/' },
      { text: 'UT6 — Disponibilidad', link: '/ut6/' },
    ],
  },
]

export const UNITS: Record<string, UnitConfig> = {

  // Guía didáctica (src/index.md) — sin sidebar de curso.
  // Con varias unidades registradas, sus títulos son los del sitio completo.
  root: {
    id: 'root',
    code: 'root',
    title: 'ASGBD',
    fullTitle: 'Administración de Sistemas Gestores de Bases de Datos',
    siteTitle: 'Administración de Sistemas</br>Gestores de</br>Bases de Datos',
    icon: '🏠',
    navbar: navbarGlobal,
    sidebar: []
  },

  UT1: {
    id: 'UT1',
    code: 'ut1',        // → archivos en src/ut1/
    title: 'UT1',
    fullTitle: 'UT1 · Implantación de sistemas gestores de bases de datos',
    siteTitle: 'UT1 </br>Implantación de SGBD',
    icon: '📦',
    navbar: navbarGlobal,
    sidebar: ut1Sidebar
  },

  UT2: {
    id: 'UT2',
    code: 'ut2',        // → archivos en src/ut2/
    title: 'UT2',
    fullTitle: 'UT2 · Configuración del sistema gestor de bases de datos',
    siteTitle: 'UT2 </br>Configuración del SGBD',
    icon: '🛠️',
    navbar: navbarGlobal,
    sidebar: ut2Sidebar
  },

  UT3: {
    id: 'UT3',
    code: 'ut3',        // → archivos en src/ut3/
    title: 'UT3',
    fullTitle: 'UT3 · Control de acceso: usuarios, vistas y privilegios',
    siteTitle: 'UT3 </br>Control de acceso',
    icon: '👥',
    navbar: navbarGlobal,
    sidebar: ut3Sidebar
  },

  UT4: {
    id: 'UT4',
    code: 'ut4',        // → archivos en src/ut4/
    title: 'UT4',
    fullTitle: 'UT4 · Automatización de tareas de administración',
    siteTitle: 'UT4 </br>Automatización de tareas',
    icon: '📝',
    navbar: navbarGlobal,
    sidebar: ut4Sidebar
  },

  UT5: {
    id: 'UT5',
    code: 'ut5',        // → archivos en src/ut5/
    title: 'UT5',
    fullTitle: 'UT5 · Optimización del rendimiento',
    siteTitle: 'UT5 </br>Optimización del rendimiento',
    icon: '📈',
    navbar: navbarGlobal,
    sidebar: ut5Sidebar
  },

  UT6: {
    id: 'UT6',
    code: 'ut6',        // → archivos en src/ut6/
    title: 'UT6',
    fullTitle: 'UT6 · Disponibilidad: bases de datos distribuidas y replicadas',
    siteTitle: 'UT6 </br>Disponibilidad',
    icon: '⏱️',
    navbar: navbarGlobal,
    sidebar: ut6Sidebar
  },

}

// ============================================================================
// FUNCIONES DE ACCESO — No modificar
// ============================================================================

export function getAllUnitsArray(): UnitConfig[] {
  return Object.values(UNITS)
}

export function getUnitByCode(code: string): UnitConfig | undefined {
  return UNITS[code]
}

// ── Navbar dinámico por unidad ───────────────────────────────────────────
// La plantilla permite añadir un desplegable que solo aparece dentro de una
// unidad (clave = code de la unidad). Aquí no se usa: el desplegable
// «📚 Unidades» está en navbarGlobal y se ve en todas las páginas, también
// en la guía didáctica. Si se rellenara, aparecerían dos desplegables.
export const unitNavbars: Record<string, NavGroup[]> = {}
