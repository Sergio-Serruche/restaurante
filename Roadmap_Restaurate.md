# Roadmap de Desarrollo - Restaurate
*Cronograma del Ciclo de Vida del Desarrollo de Software (16 Semanas)*

---

## 1. Cronograma General de Fases (Diagrama de Gantt)

El siguiente diagrama de Gantt ilustra la distribución del tiempo y el solapamiento planificado entre las diferentes fases del proyecto para optimizar la entrega en 16 semanas:

```mermaid
gantt
    title Plan de Desarrollo - Restaurate (16 Semanas)
    dateFormat  W
    axisFormat  Semana %e

    section Planificación y Diseño
    Fase 1: Planificación        :active, des1, 0, 2w
    Fase 2: Diseño de Arq/UI     :active, des2, 2w, 2w
    
    section Infraestructura y Dev
    Fase 3: Config. Inicial      :des3, 4w, 1w
    Fase 4: Desarrollo Backend   :des4, 5w, 4w
    Fase 5: Desarrollo Frontend  :des5, 7w, 4w
    
    section Integración y QA
    Fase 6: Integración          :des6, 11w, 1w
    Fase 7: Pruebas y Control QA :des7, 12w, 2w
    
    section Entrega
    Fase 8: Despliegue (Deploy)  :des8, 14w, 1w
    Fase 9: Documentación y Cierre:des9, 15w, 1w
```

---

## 2. Detalle de Fases de Desarrollo

A continuación, se describen los entregables y tareas específicas para cada etapa del proyecto:

### FASE 1 – PLANIFICACIÓN (Semanas 1-2)
*Enfoque: Alineación de objetivos, definición de alcance y análisis de viabilidad.*
* **Tareas:**
  - [ ] Reuniones de definición con stakeholders.
  - [ ] Redacción y aprobación del plan de negocios final.
  - [ ] Levantamiento y clasificación de requerimientos funcionales y no funcionales.
  - [ ] Creación de historias de usuario y estimación de puntos de historia en Scrum.
* **Entregables:**
  - `Plan_Negocios_Restaurate.md`
  - Backlog de producto priorizado en Jira o Trello.

### FASE 2 – DISEÑO DE ARQUITECTURA (Semanas 3-4)
*Enfoque: Definición de las bases técnicas y diseño visual de la experiencia de usuario (UX).*
* **Tareas:**
  - [ ] Diseño conceptual de microservicios y flujos de mensajería (RabbitMQ).
  - [ ] Creación del esquema de base de datos relacional para PostgreSQL.
  - [ ] Diseño de contratos de API REST (Swagger/OpenAPI).
  - [ ] Creación de wireframes y prototipos interactivos de alta fidelidad en Figma.
* **Entregables:**
  - Diagramas de arquitectura y especificación técnica de APIs.
  - Prototipos de UI interactivos de cara al cliente y administrador.

### FASE 3 – CONFIGURACIÓN DEL PROYECTO (Semana 5)
*Enfoque: Inicialización del entorno de desarrollo global y CI/CD básico.*
* **Tareas:**
  - [ ] Creación de repositorios de código en GitHub con políticas de ramas (GitFlow).
  - [ ] Configuración de contenedores Docker para desarrollo local (PostgreSQL, Redis, RabbitMQ).
  - [ ] Configuración del proyecto base de Spring Boot y Next.js.
* **Entregables:**
  - Repositorios listos y documentación de desarrollo inicial en `README.md`.

### FASE 4 – DESARROLLO BACKEND (Semanas 6-9)
*Enfoque: Implementación de la lógica de negocio, persistencia de datos y seguridad.*
* **Tareas:**
  - [ ] Implementación de microservicios de Usuarios y Autenticación con JWT.
  - [ ] Creación de los módulos de Gestión de Productos, Categorías y Carrito de compras.
  - [ ] Desarrollo del motor de procesamiento de Pedidos y flujos de estados.
  - [ ] Integración con la API externa de pasarela de pagos.
  - [ ] Implementación de lógica de geolocalización para el servicio de reparto.
* **Entregables:**
  - APIs funcionales de los microservicios cubiertas por pruebas unitarias locales.

### FASE 5 – DESARROLLO FRONTEND (Semanas 8-11)
*Enfoque: Construcción de la interfaz de usuario responsive y la lógica del cliente.*
* **Tareas:**
  - [ ] Maquetación y desarrollo del flujo de compra del cliente (Catálogo -> Carrito -> Pago).
  - [ ] Creación del panel del Administrador (gestión de platos, categorías e ingresos).
  - [ ] Desarrollo de la aplicación móvil de repartidores y el flujo de estados de reparto.
* **Entregables:**
  - Frontend interactivo conectado a mockups y listo para integración real.

### FASE 6 – INTEGRACIÓN (Semana 12)
*Enfoque: Conexión de todas las capas del sistema y flujos de extremo a extremo.*
* **Tareas:**
  - [ ] Conexión del frontend web y móvil con los microservicios backend reales a través del API Gateway.
  - [ ] Habilitación de la sincronización en tiempo real vía WebSockets para el panel de cocina (KDS).
  - [ ] Pruebas del flujo completo de compra, pago, preparación y asignación del repartidor.
* **Entregables:**
  - Sistema 100% integrado en ambiente de staging.

### FASE 7 – PRUEBAS Y CONTROL DE CALIDAD (Semanas 13-14)
*Enfoque: Garantía de la estabilidad, seguridad y rendimiento bajo carga.*
* **Tareas:**
  - [ ] Ejecución de pruebas unitarias, de integración y funcionales automatizadas.
  - [ ] Auditoría de seguridad OWASP y validación de vulnerabilidades en tokens JWT.
  - [ ] Pruebas de estrés y rendimiento de peticiones concurrentes con JMeter.
* **Entregables:**
  - Reporte de QA y corrección de bugs críticos resuelta.

### FASE 8 – DESPLIEGUE (Semana 15)
*Enfoque: Lanzamiento y puesta en producción del sistema.*
* **Tareas:**
  - [ ] Creación de los manifiestos de Kubernetes para la orquestación en la nube (AWS/GCP).
  - [ ] Configuración del proxy inverso Nginx, dominios y certificados de seguridad SSL.
  - [ ] Migración de la base de datos de producción e inserción de datos iniciales.
* **Entregables:**
  - Entorno de producción funcional accesible mediante URL pública segura (`https://`).

### FASE 9 – DOCUMENTACIÓN Y CIERRE (Semana 16)
*Enfoque: Transferencia de conocimiento e inducción para la entrega oficial.*
* **Tareas:**
  - [ ] Redacción del manual técnico de la arquitectura y diccionario de datos de la base de datos.
  - [ ] Creación de guías de usuario para cocineros, administradores y repartidores.
  - [ ] Presentación final del producto ante los stakeholders.
* **Entregables:**
  - Repositorio final documentado y manuales de usuario funcionales.

---

## 3. Matriz Tecnológica

| Componente | Tecnologías Clave |
| :--- | :--- |
| **Backend** | Java Spring Boot, Spring Security (JWT), Hibernate (JPA) |
| **Frontend** | Next.js, React, Vanilla CSS, TailwindCSS (opcional), HTML5 |
| **Bases de Datos** | PostgreSQL (Relacional), Redis (Caché en memoria) |
| **Mensajería** | RabbitMQ (Broker de eventos asíncronos) |
| **Infraestructura** | Docker (Contenedores), Kubernetes (Orquestación), Nginx (Proxy) |
| **Control / DevOps** | Git & GitHub, GitHub Actions (CI/CD) |
