- [x] agegar boton de "ver selección" y conectar con modal
- [x] Cambiar los atributos de todos los campos (aunque realmente solo necesitamos calar la primer pag, no?)
- [x] corregir estética del boton
- [x] Construir modal sumario basado en selección de servicios
- [x] Resolver integración de calendario
- [x] Corregir typos en radio fields (incluido vs included y $ en precios)
- [x] Modal: Intentar agrupar foto y video en las listas
- [x] Revisar modal on mobile
- [x] Corregir estética del calendario en IOS (webkit)
- [x] Input fields: cambiar color de placeholder
- [x] Cuando arrow: is-off, desactivar click
- [x] dar el mismo formato de currency a todos los precios
- [x] Corregir spacing en footer
- [x] Corregir jerarquía de colores (botones, links, etc)
- [ ] Conectar formulario de contacto a un flujo real
- [x] Agregar glitch de calculadora en la resta del cero
- [x] Corregir como se ve la fecha en movil
- [x] Crear CTA "aplicar ahora" en la última página
- [ ] Hacer últimos chequeos de como se transmite la información hacia el e-mail y como se le puede dar formato
- [ ]

FORM 2

- [x] Copiar el formulario a formCore2 para simplificar
- [x] Quita switches
- [x] Agrega master radio groups
- [x] Ajusta conditional visibility de servicios: comienza por revisar y ajustar los attributos del html
- [x] Asegura que el calculo de precios se haga correctamente
- [x] Revisa el modal de selección de servicios
- [ ] Conectar calendario a google forms / considera google API vs google sheets to calendar. cual funciona mejor?
- [ ] Investigar si hay manera (tomando en cuenta a webflow), de hacer un screenshot al modal y enviarlo por correo a okay ok cuando la persona haga submit
- [x] Checkout "donde es la boda" – agrega disclaimer
- [x] Hacer primer conexión con google calendar
- [ ] Reemplazar el calendario de google con la cuenta de okay ok
  - Cuales son los pasos?
    - Entra a google cloud console > create new project > create service account > create key> download json key and replace the env variables
    - Entrar a netlify y reemplazar environment variables con las de okay ok
    - Entrar a google calendar y crear un nuevo calendario
    - Entrar a google calendar y crear un nuevo evento
- [ ] Agregar phone number a formulario e inyectarlo en google

HOME:
[x] - construir home y modal
[x] - Hacer setup de modal menu
[x] - Hacer scroll-trigger on scroll paral menu
[ ] - Hacer prueba duplicate page, pero el fondo es un video
[x] - Hacer version movil

GALLERIES/pages:

[ ] - Boda

- Galería foto + video
  [ ] - Lifestyle
- Galería foto + video
  [ ] - Comercial
- Galería foto + video
  [ ] - Eventos

jan 1st

- [x] - hacer setup de layout de minigaleriavideo
- [x] - hacer setup de layout de cms video
- [x] - hacer tabs

jan 5th

- [x] - definir layout, links y anchors del title screen
- [x] - agregar block CTA de paquetes
- [x] - agregar block links a otros servicios (ó a "nuestra historia")

jan 6th

- [ ] - hacer colección de testimoniales
- [ ] - agregar sección de testimoniales a galería
  - [ ] - decidir si agregar links a otras páginas dentro del mismo block de los testimonials (flex-hor) o alargar el chorizo

okay ok plan de ataque:

- lo que vamos a hacer es construir una página madre para las galerías de boda, lifestyle, comercial y eventos.
- esta página va a tener un menú de tabs para foto y video (investiga como integrarlo para que el código funcione en estas dynamic pages)
- diseño, considera una posición estratégica para el botón de bookings
- vamos a crear una colección secundaria para las galerías de videos, ó investigar como hacer una colección de videos
- visualiza la versión movil

pre-entrega: 10 de enro

- [ ] hacer animación de transición entre foto/video
