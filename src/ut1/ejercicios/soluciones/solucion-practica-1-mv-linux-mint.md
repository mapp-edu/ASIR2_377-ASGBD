---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 1: preparación de la MV Linux Mint"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 1: preparación de la MV Linux Mint

::: tip Solución de referencia
Resolución de referencia de la [Práctica 1](../practica-1-mv-linux-mint), con las comprobaciones que debe contener la entrega, los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

Es una práctica de preparación del entorno: no tiene una «respuesta» que calcular, sino **evidencias** que deben aparecer en el documento. Esta solución indica cuáles son y cómo obtenerlas. Las órdenes de comprobación se han probado en Ubuntu 24.04, la base de Linux Mint 22.

## 1. Crear la máquina virtual

En VirtualBox (Nueva → Experto):

| Ajuste | Dónde | Valor |
|:---|:---|:---|
| Tipo y versión | Nombre y sistema operativo | Linux · Ubuntu (64-bit) |
| Memoria | Hardware | 4096 MB |
| Procesadores | Hardware | 2 (o 4) |
| Disco | Disco duro | VDI dinámico de 50 GB |
| Virtualización anidada | Configuración → Sistema → Procesador | *Habilitar VT-x/AMD-V anidado* |
| Portapapeles compartido | Configuración → General → Avanzado | Bidireccional |
| Disquetera | Configuración → Sistema → Placa base → Orden de arranque | Desmarcada |
| Red | Configuración → Red → Adaptador 1 | NAT |

La casilla de virtualización anidada aparece en gris si la CPU del anfitrión no tiene VT-x/AMD-V activado en la BIOS o si Hyper-V está activo en un anfitrión Windows. También se puede activar por línea de órdenes, con la máquina apagada:

```bash
VBoxManage modifyvm "<nombre-mv>" --nested-hw-virt on
```

::: tip Nota sobre el disco
Linux Mint ocupa unos 10 GB y la imagen de Oracle Database Free de la práctica 2 ocupa varios GB más, a los que se suman el contenedor, PostgreSQL y MariaDB. Con un disco **dinámico** de 50 GB, el fichero de la MV en el anfitrión solo crece con lo que se usa. Justificar el tamaño con esta previsión es una decisión de nivel 3–4 en 1.e.
:::

## 2–5. Instalación de Linux Mint 22

Secuencia esperada en el instalador: idioma español → distribución de teclado española → **instalar códecs multimedia** → *Borrar disco e instalar Linux Mint* → zona horaria Madrid → usuario y equipo.

| Campo | Valor esperado |
|:---|:---|
| Nombre | Nombre del alumno o la alumna |
| Nombre del equipo | `srv-<nombre>`, con menos de 15 caracteres en total |
| Usuario | Su nombre, en minúsculas y sin espacios ni tildes |

Si se olvida el nombre del equipo durante la instalación, se cambia después:

```bash
sudo hostnamectl set-hostname srv-ana
sudo sed -i 's/127.0.1.1.*/127.0.1.1\tsrv-ana/' /etc/hosts   # para que sudo no avise
hostnamectl
```

::: info Sobre el nombre del equipo
En Linux el límite real del nombre de equipo es de 64 caracteres; el de 15 caracteres viene de NetBIOS (Windows) y conviene respetarlo para evitar problemas al compartir recursos con equipos Windows. Con el prefijo `srv-` (4 caracteres) quedan 11 para el nombre.

El prefijo indica que esta máquina es el **servidor** de los tres SGBD (práctica 2); la máquina cliente de la práctica 3 es otra.
:::

## 6–7. Actualizar e instalar el motor de contenedores

```bash
sudo apt update
sudo apt upgrade -y          # recomendable, aunque el enunciado solo pide update
sudo apt install -y podman-docker
```

Comprobaciones que deben aparecer en la entrega:

```bash
podman --version             # podman version 4.9.x en Mint 22
docker --version             # el paquete podman-docker crea el alias: muestra la versión de podman
podman info | grep -E "rootless|graphDriverName"
podman run --rm hello-world  # opcional: comprueba que descarga y ejecuta contenedores
```

`apt update` **no actualiza** el sistema: solo descarga la lista de paquetes disponibles. Lo que instala las actualizaciones es `apt upgrade` (o el Gestor de actualizaciones). Es una confusión habitual que conviene señalar al corregir.

## Comprobación de los requisitos de hardware

Es la evidencia principal de **1.e**: no basta con decir que se ha configurado, hay que **comprobarlo desde dentro** de la máquina.

```bash
free -h                      # Mem total: ~3,8Gi
nproc                        # 2 (o 4)
lsblk -d -o NAME,SIZE        # sda 25G
df -h /                      # espacio libre tras la instalación
lscpu | grep -E "Model name|Virtualization|^CPU\(s\)"
grep -cE 'vmx|svm' /proc/cpuinfo   # > 0 si la virtualización anidada está activa
```

| Requisito | Valor pedido | Comprobación | Valor obtenido |
|:---|:---|:---|:---|
| RAM | ≥ 4 GB | `free -h` | 3,8 Gi (el sistema reserva una parte; es correcto) |
| CPU | 2–4 | `nproc` | 2 |
| Disco | 50 GB | `lsblk` | 50G |
| Virtualización anidada | Activada | `grep -cE 'vmx\|svm' /proc/cpuinfo` y `lscpu` | > 0 · `Virtualization: VT-x` |

Para nivel 4: relacionar las cifras con los requisitos del SGBD (por ejemplo, Oracle Database Free limita su uso de memoria a 2 GB, por lo que 4 GB dejan margen al sistema y al resto de gestores) y advertir que los contenedores de podman no necesitan virtualización anidada; sí la necesitaría ejecutar máquinas virtuales dentro de la MV.

## 8. Después de la instalación

| Tarea | Cómo | Evidencia |
|:---|:---|:---|
| OVA | Apagar → Archivo → Exportar servicio virtualizado → formato OVF 2.0 | Captura del fichero `.ova` y su tamaño |
| Instantánea | Máquina → Tomar instantánea | Captura del árbol de instantáneas |
| Guest Additions | Dispositivos → Insertar imagen de CD de las Guest Additions → `sudo sh /media/$USER/VBox_GAs_*/VBoxLinuxAdditions.run` | `lsmod \| grep vboxguest` y prueba de copiar y pegar en los dos sentidos |

Antes de instalar las Guest Additions hacen falta las herramientas de compilación:

```bash
sudo apt install -y build-essential dkms linux-headers-$(uname -r)
```

Es el error más frecuente: sin ellas el instalador termina con avisos y el portapapeles no funciona. Linux Mint suele traer `virtualbox-guest-*` desde los repositorios; si están instalados, se puede usar esa versión y explicarlo.

El orden importa: la OVA y la instantánea se hacen **antes** de las Guest Additions, para tener una copia limpia a la que volver si algo falla.

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **1.d** | Falta `podman-docker` o la MV no está actualizada. | Sistema instalado y actualizado, `podman-docker` y Guest Additions funcionando. | Comprueba las versiones instaladas (`podman --version`, `lsmod`) y explica para qué sirve cada componente. | Además, explica la diferencia entre `apt update` y `apt upgrade` o resuelve las dependencias de las Guest Additions. |
| **1.e** | Solo muestra la configuración de VirtualBox. | Comprueba RAM, CPU, disco y virtualización anidada desde dentro de la MV. | Tabla de requisitos con valor pedido y valor obtenido, e interpreta las diferencias (RAM visible menor que la asignada). | Relaciona los recursos con lo que necesitarán los SGBD de la práctica 2 (espacio de la imagen de Oracle, límite de memoria de Oracle Free). |
| **1.g** | Capturas sueltas sin explicación. | Documenta todos los pasos, incluidas la OVA y la instantánea. | Cada captura tiene su explicación y se indica el orden seguido y por qué. | Documento claro, con tiempos y espacio ocupado y con las incidencias y su solución. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD, sobre la práctica adaptada de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
