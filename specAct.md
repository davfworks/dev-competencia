# Travesía Rieles del Lago 2026

## 1. Descripción General

Travesía Rieles del Lago 2026 es el sitio web oficial de la primera edición de la carrera de ciclismo desarrollada alrededor de los paisajes del Lago San Pablo y la antigua vía férrea.

La plataforma tendrá como objetivo promocionar el evento, informar a los participantes, facilitar el proceso de inscripción y dar visibilidad a patrocinadores y aliados.

El sitio será una Landing Page semi estática desarrollada en React y totalmente parametrizable mediante archivos JSON.

No existirá almacenamiento local de participantes ni base de datos.

---

## 2. Objetivos

### Objetivos Principales

* Promocionar la carrera.
* Centralizar la información del evento.
* Facilitar la inscripción de participantes.
* Mejorar la experiencia móvil.
* Mostrar patrocinadores y aliados estratégicos.
* Automatizar el envío de correos de confirmación.

### Criterios de Éxito

* Diseño responsive.
* Navegación intuitiva.
* Configuración mediante archivos JSON.
* Formulario funcional.
* Correos enviados correctamente.
* Lighthouse superior a 90.

---

## 3. Tecnologías

### Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React

### Servicios Externos

* YouTube
* Vimeo
* Google Maps
* Servicio SMTP configurable

---

## 4. Restricciones

* No utilizar base de datos.
* No implementar autenticación.
* No crear panel administrativo.
* No implementar pagos en línea.
* No almacenar información de participantes.
* No utilizar contenido hardcodeado dentro de los componentes.

---

## 5. Gestión de Contenido

Toda la información editable deberá cargarse desde archivos JSON ubicados en:

```text
src/data
```

Archivos mínimos requeridos:

```text
hero.json
countdown.json
competition.json
details.json
articles.json
registration.json
sponsors.json
footer.json
social.json
contact.json
```

Toda modificación de contenido deberá realizarse mediante estos archivos.

---

## 6. Estructura General de la Página

La Landing Page deberá mostrar las siguientes secciones en el siguiente orden:

1. Navbar
2. Hero
3. Tiempo Regresivo
4. Competencia
5. Detalles
6. Artículos
7. Inscripciones
8. Patrocinadores
9. Footer

---

# 7. Navbar

## Diseño

El Navbar deberá estar posicionado sobre la sección Hero.

### Desktop

Lado izquierdo:

* Inicio
* Competencia
* Detalles
* Artículos
* Inscripciones
* Sponsors
* Contacto

Lado derecho:

* Ícono de bicicleta

### Estilo

* Transparente.
* Overlay oscuro semitransparente.
* Fijo durante el desplazamiento.
* Texto color blanco.

### Mobile

* Menú hamburguesa.
* Menú desplegable a pantalla completa.
* Navegación mediante scroll suave.

---

# 8. Hero

## Objetivo

Generar impacto visual y presentar la identidad del evento.

## Fondo

La sección deberá permitir video de fondo desde:

* YouTube
* Vimeo
* Archivo local

Configuración mediante JSON.

## Comportamiento del Video

* Reproducción automática.
* Sin sonido.
* Reproducción en bucle.
* Ajuste responsive.
* Cobertura completa del contenedor.

## Distribución

### Izquierda

Texto grande:

```text
PRIMERA EDICIÓN
```

### Centro

Logo principal.

Ubicación:

```text
/public/assets/images/logo.png
```

El logo deberá ser circular y ocupar el elemento visual principal de la sección.

Debajo del logo deberá existir un espacio para un slogan configurable.

### Derecha

Fecha oficial del evento.

Ejemplo:

```text
15 MARZO 2026
```

### Responsive

La disposición visual deberá mantenerse en dispositivos móviles.

No se deberá convertir en una única columna centrada.

---

# 9. Sección Tiempo Regresivo

## Contenido

Mostrar en el siguiente orden:

### Título

```text
TRAVESÍA RIELES DEL LAGO 2026
```

### Subtítulo

Slogan del evento.

### Ubicación

Lugar del evento.

### Fecha

Fecha oficial del evento.

### Botón Principal

Texto:

```text
INSCRIBIRME AHORA
```

Acción:

Desplazar hacia la sección de inscripciones.

### Cuenta Regresiva

Mostrar:

* Días
* Horas
* Minutos
* Segundos

La cuenta regresiva deberá actualizarse cada segundo.

---

# 10. Sección Competencia

## Diseño

Dos columnas.

### Columna Izquierda

Información descriptiva:

* Historia de la competencia.
* Descripción del evento.
* Objetivos.
* Características de la ruta.

### Columna Derecha

Video embebido de YouTube.

La URL deberá configurarse mediante JSON.

---

# 11. Sección Detalles

## Diseño

Dos tarjetas horizontales en escritorio.

Una columna en dispositivos móviles.

---

## Tarjeta 1 - Ruta

Mostrar:

* Imagen representativa de la ruta.

Al hacer clic deberá abrir:

* Ruta en Google Maps.

La URL deberá configurarse mediante JSON.

---

## Tarjeta 2 - Altimetría

Mostrar:

* Imagen de altimetría.

Al hacer clic deberá abrir:

* Imagen ampliada.
* PDF.
* Recurso externo.

La URL deberá configurarse mediante JSON.

---

## Comportamiento

Las tarjetas deberán incluir:

* Hover.
* Animaciones suaves.
* Escalado.
* Sombra dinámica.

---

# 12. Sección Artículos

## Diseño

Dos tarjetas.

### Izquierda

Fotografías Oficiales.

Mostrar:

* Imagen representativa.
* Descripción.

Acción:

Abrir galería oficial.

La URL deberá configurarse mediante JSON.

---

### Derecha

Artículos Oficiales.

Mostrar:

* Imagen representativa.
* Descripción.

Acción:

Abrir tienda oficial.

La URL deberá configurarse mediante JSON.

---

# 13. Sección Inscripciones

La plataforma deberá soportar:

* Inscripción Individual.
* Inscripción Grupal.

El usuario deberá seleccionar el tipo de inscripción antes de visualizar los campos correspondientes.

---

## Inscripción Individual

Campos obligatorios:

* Nombres y Apellidos
* Fecha de Nacimiento
* Correo Electrónico
* Teléfono
* Ciudad
* País
* Categoría
* Género
* Talla de Jersey
* Observaciones
* Aceptación de Términos y Condiciones

---

## Inscripción Grupal

### Información del Equipo

* Nombre del Equipo
* Nombre del Representante
* Correo Electrónico
* Teléfono

### Integrantes

Lista dinámica.

Cada integrante deberá contener:

* Nombre Completo
* Fecha de Nacimiento
* Correo Electrónico
* Teléfono
* Género
* Talla de Jersey

Operaciones permitidas:

* Agregar Integrante
* Editar Integrante
* Eliminar Integrante

Cantidad mínima configurable.

Cantidad máxima configurable.

---

## Validaciones

Validar:

* Campos obligatorios.
* Correo electrónico válido.
* Fecha válida.
* Teléfono válido.
* Límites de integrantes.
* Aceptación de términos.

No se permitirá el envío si existen errores.

---

## Procesamiento

Al enviar la inscripción:

1. Validar formulario.
2. Generar estructura de datos.
3. Enviar correo de confirmación al participante.
4. Enviar correo de notificación al organizador.
5. Mostrar mensaje de éxito.

La información no deberá almacenarse.

---

# 14. Correos Electrónicos

## Correo al Participante

Asunto:

```text
Confirmación de Inscripción - Travesía Rieles del Lago 2026
```

Contenido:

* Información del evento.
* Datos de inscripción.
* Integrantes del equipo cuando corresponda.
* Información de contacto.

---

## Correo al Organizador

Asunto:

```text
Nueva Inscripción Recibida
```

Contenido:

* Tipo de inscripción.
* Información completa enviada por el participante.
* Fecha y hora de recepción.

---

# 15. Sección Patrocinadores

## Categorías

### Patrocinador Principal

### Sponsors

### Aliados

## Distribución

### Desktop

6 logos por fila.

### Tablet

4 logos por fila.

### Mobile

2 logos por fila.

Todos los logos deberán configurarse mediante JSON.

Las imágenes deberán cargarse desde:

```text
/public/assets/sponsors
```

---

# 16. Footer

## Columna 1

* Logo del evento.
* Nombre del evento.
* Edición.
* Slogan.

## Columna 2

* Información de contacto.
* Correo electrónico.
* Teléfono.

## Columna 3

Redes sociales:

* Facebook
* Instagram
* TikTok
* YouTube

## Columna 4

* Botón WhatsApp.
* Información adicional.

## Pie Legal

```text
© 2026 Travesía Rieles del Lago. Todos los derechos reservados.
```

---

# 17. Diseño Responsive

La plataforma deberá funcionar correctamente en:

* Mobile
* Tablet
* Desktop

Breakpoints mínimos:

* 320px
* 768px
* 1024px
* 1440px

Se deberá aplicar enfoque Mobile First.

---

# 18. SEO

Implementar:

* Meta Title
* Meta Description
* Open Graph
* Twitter Cards
* Sitemap.xml
* Robots.txt

---

# 19. Accesibilidad

Implementar:

* HTML semántico.
* Navegación por teclado.
* Etiquetas ARIA.
* Texto alternativo en imágenes.
* Contraste adecuado.

---

# 20. Rendimiento

Objetivos:

* Lighthouse superior a 90.
* Carga inicial menor a 3 segundos.
* Lazy Loading.
* Optimización de imágenes.
* Optimización de videos.

---

# 21. Fuera de Alcance

No incluye:

* Base de datos.
* Login.
* Registro de usuarios.
* Dashboard administrativo.
* Pagos en línea.
* Resultados de competencia.
* Certificados.
* Generación de dorsales.
* Cronometraje.

---

# 22. Criterios de Finalización

El proyecto se considerará terminado cuando:

* Todas las secciones definidas estén implementadas.
* Todo el contenido provenga de archivos JSON.
* El Hero soporte YouTube, Vimeo y archivos locales.
* La cuenta regresiva funcione correctamente.
* Los enlaces externos funcionen correctamente.
* Los formularios individual y grupal funcionen correctamente.
* Los correos sean enviados al participante y al organizador.
* El diseño responsive esté validado.
* El rendimiento alcance Lighthouse superior a 90.
* No exista almacenamiento de información de participantes.
* El sitio esté listo para despliegue en producción.
