---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: uso de vi"
pageClass: ejercicios-page
---

# 🧭 Guía: uso de vi

## ¿Qué es vi?

`vi` es un editor de texto para sistemas Unix y Linux, muy potente y ligero, que se ejecuta directamente en el terminal (sin entorno gráfico). Está incluido prácticamente en todas las distribuciones Unix/Linux (y también disponible en macOS).

Es muy antiguo pero robusto: fue creado hacia 1976 por Bill Joy, que después sería cofundador de Sun Microsystems. Aunque es muy básico visualmente, es muy eficiente para editar ficheros de configuración, código fuente o scripts directamente desde la línea de órdenes.

## Una vez dentro, ¿qué hacer?

- Cuando se entra en `vi`, el editor está en **modo de comandos** (acepta comandos).
- Para escribir hay que pulsar la tecla <kbd>i</kbd> (**modo de inserción**). En ese momento ya se puede escribir, borrar, modificar, etc.
- Para volver al modo de comandos se pulsa la tecla <kbd>Esc</kbd>.

Otros comandos:

| Comando | Acción |
|:---|:---|
| `dd` | borra una línea |
| `yy` | copia una línea |
| `p` | pega lo copiado o borrado |

## ¿Cómo salir de vi?

Vuelve al modo de comandos y pulsa:

| Comando | Acción |
|:---|:---|
| `:w` | escribir los cambios |
| `:q` | salir |
| `:wq` | guardar y salir |
| `:q!` | salir sin guardar los cambios |

## 💡 Ventajas

- Siempre disponible (forma parte del sistema base).
- Muy rápido y ligero.
- Altamente configurable.
- Ideal para trabajar en servidores o entornos sin interfaz gráfica.

## Variantes modernas

- **vim** (*Vi IMproved*): versión más moderna, con color, historial, autocompletado, etc.
- **neovim**: versión más reciente y extensible de vim.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD2/ASGBD-UD2.4 Us de vi.pdf`.</small>
