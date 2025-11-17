# 🎨 Guía Completa de Customización del Panel de Administración de Strapi V4

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Comandos Básicos](#comandos-básicos)
- [Las 4 Formas de Customizar Strapi](#las-4-formas-de-customizar-strapi)
  - [1. Plugins Existentes](#1-plugins-existentes)
  - [2. Opciones de Configuración](#2-opciones-de-configuración)
  - [3. Injection Zone (Recomendado)](#3-injection-zone-recomendado)
  - [4. Creación de Plugins Personalizados](#4-creación-de-plugins-personalizados)
- [Ejemplos Prácticos Implementados](#ejemplos-prácticos-implementados)
- [Estructura de Archivos](#estructura-de-archivos)
- [Mejores Prácticas](#mejores-prácticas)
- [Troubleshooting](#troubleshooting)
- [Recursos Adicionales](#recursos-adicionales)

## 🚀 Introducción

Strapi V4 es un CMS headless de código abierto que permite a los desarrolladores crear, gestionar y exponer datos a través de un Panel de Administración integrado. A diferencia de Strapi V3, donde era posible sobrescribir archivos directamente, Strapi V4 ofrece métodos más estables y mantenibles para la customización.

### 🗄️ Bases de Datos Soportadas

Strapi V4 soporta exclusivamente **bases de datos relacionales (SQL)**:

- **🐘 PostgreSQL** - Recomendada para producción
- **🐬 MySQL** - Ampliamente compatible (versión ≥ 8.0)
- **🦭 MariaDB** - Alternativa open-source a MySQL
- **📁 SQLite** - Ideal para desarrollo y prototipado


### 🎯 Enfoque del Documento

Este documento presenta **4 enfoques principales** para personalizar el Panel de Administración de Strapi V4, desde el más simple hasta el más complejo, con especial énfasis en **Injection Zone** como la solución más práctica y eficiente.

### ⚠️ Cambios Importantes desde V3

En Strapi V3 era posible "ejectar" archivos específicos creando la estructura de carpetas correspondiente en `/extensions`. Esta funcionalidad **ya no está disponible en V4**, pero las nuevas alternativas son más estables y mantenibles.

## 🛠️ Comandos Básicos

### Desarrollo

```bash
# Desarrollo estándar
yarn develop

# Desarrollo con recarga automática del admin (RECOMENDADO para customización)
yarn develop --watch-admin
```



## 🛠️ Las 4 Formas de Customizar Strapi

### 1. Plugins Existentes

**Nivel de Dificultad:** 🟢 Básico  
**Mantenimiento:** Mínimo

La forma más rápida de añadir funcionalidad es utilizar plugins ya desarrollados por la comunidad.

#### 📍 Dónde Encontrar Plugins

- **[Strapi Market](https://market.strapi.io/)** - Marketplace oficial
- **[Community Plugins](https://isstrapiready.com)** - Plugins de la comunidad

#### 🔧 Ejemplo: Editor Avanzado

```bash
# Instalar plugin de EditorJS para reemplazar el RichText por defecto
yarn add strapi-plugin-react-editorjs
```

#### ✅ Ventajas
- Implementación inmediata
- Funcionalidad probada
- Documentación disponible
- Sin código personalizado

#### ❌ Desventajas
- Funcionalidad limitada a lo que ofrece el plugin
- Dependencia externa
- Posibles incompatibilidades entre versiones

---

### 2. Opciones de Configuración

**Nivel de Dificultad:** 🟡 Intermedio  
**Mantenimiento:** Bajo

Strapi V4 permite personalizar varios aspectos del Panel de Administración a través de configuración.

#### 🎯 Elementos Configurables

- **Traducciones** y textos de interfaz
- **Logo** y favicon
- **Tema** y colores
- **Locales** disponibles
- **Tutoriales** y notificaciones

> **💡 Tip:** Para personalización profunda de traducciones, consulta el archivo completo de traducciones en español: [es.json en el repositorio oficial](https://github.com/strapi/strapi/blob/main/packages/core/admin/admin/src/translations/es.json)

#### 🔧 Ejemplo: Personalizar Traducciones y Tema

```javascript
// src/admin/app.js
export default {
  config: {
    translations: {
      en: {
        "app.components.HomePage.welcome.again": "¡Bienvenido al CMS!",
        "app.components.LeftMenu.navbrand.title": "Mi Panel Admin",
      },
      es: {
        "app.components.HomePage.welcome.again": "¡Hola! Bienvenido de nuevo",
      }
    },
    theme: {
      colors: {
        primary100: '#f0f8ff',
        primary600: '#0066cc',
        primary700: '#004499'
      }
    }
  },
  bootstrap() {},
};
```

#### ✅ Ventajas
- Cambios oficialmente soportados
- Fácil mantenimiento
- No requiere código React complejo

#### ❌ Desventajas
- Limitado a opciones predefinidas
- No permite cambios estructurales profundos

---

### 3. Injection Zone (Recomendado)

**Nivel de Dificultad:** 🟡 Intermedio  
**Mantenimiento:** Medio


Injection Zone permite inyectar componentes personalizados en ubicaciones específicas del Panel de Administración sin crear un plugin completo.

#### 📍 Zonas de Inyección Disponibles

| Vista | Zona | Descripción |
|-------|------|-------------|
| `listView` | `actions` | Botones de acción en lista |
| `editView` | `right-links` | Enlaces en panel derecho |
| `editView` | `informations` | Sección de información |

#### 🎨 Herramientas de Estilado para Customizaciones

Para el desarrollo y estilado de componentes personalizados, es posible instalar **Storybook** que proporciona un entorno aislado para desarrollar y probar componentes de UI:


**Recursos de Storybook:**
- **[Getting Started / Welcome - Docs ⋅ Storybook](https://storybook.js.org/docs/get-started/whats-a-story)** - Documentación oficial
- Permite desarrollar componentes de forma aislada
- Facilita el testing visual de diferentes estados
- Integración con el Design System de Strapi

#### 📦 Dependencias Requeridas

Para el desarrollo de componentes personalizados, asegúrate de tener instaladas las siguientes dependencias **con las versiones específicas que funcionan correctamente**:

```json
"dependencies": {
  "@strapi/design-system": "^1.19.0",
  "@strapi/icons": "^1.19.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-is": "^19.2.0",
  "react-router-dom": "5.3.4",
  "styled-components": "^5.3.11"
}
```



#### 🔧 Ejemplo: Botón Personalizado

**1. Crear el componente:**

```javascript
// src/admin/extensions/components/CustomButton/index.js
import React from "react";
import { Button } from "@strapi/design-system/Button";
import { Plus } from "@strapi/icons";

const CustomButton = () => {
  const handleClick = () => {
    console.log("Acción personalizada ejecutada");
  };

  return (
    <Button 
      variant="secondary" 
      startIcon={<Plus />} 
      onClick={handleClick}
    >
      Acción Personalizada
    </Button>
  );
};

export default CustomButton;
```

**2. Inyectar el componente:**

```javascript
// src/admin/app.js
import CustomButton from "./extensions/components/CustomButton";

export default {
  bootstrap(app) {
    app.injectContentManagerComponent("listView", "actions", {
      name: "CustomButton",
      Component: CustomButton,
    });
  },
};
```

#### ✅ Ventajas
- **Flexibilidad:** Permite componentes React personalizados
- **Estabilidad:** API oficial de Strapi
- **Mantenibilidad:** Menor acoplamiento que V3
- **Reutilización:** Componentes pueden usarse en múltiples vistas

#### ❌ Desventajas
- Requiere conocimiento de React
- Limitado a zonas de inyección predefinidas

---

### 4. Creación de Plugins Personalizados

**Nivel de Dificultad:** 🔴 Avanzado  
**Mantenimiento:** Alto

Para funcionalidades complejas que no pueden resolverse con Injection Zone.

#### 🔧 Cuándo Crear un Plugin

- Funcionalidad completamente nueva
- Múltiples vistas personalizadas
- Lógica de backend personalizada
- Reutilización entre proyectos

#### 📚 Recursos para Desarrollo

- **[Documentación Oficial](https://docs-v4.strapi.io/dev-docs/plugins/developing-plugins)**
- **[Video Tutorial](https://www.youtube.com/watch?v=9YCkauGqnZw)**

#### ✅ Ventajas
- Control total sobre funcionalidad
- Puede incluir backend personalizado
- Reutilizable entre proyectos

#### ❌ Desventajas
- Complejidad alta
- Tiempo de desarrollo significativo
- Requiere mantenimiento continuo

## 🎯 Ejemplos Prácticos Implementados

Este proyecto incluye ejemplos funcionales de **Injection Zone** listos para usar:

### 🔧 CustomActionButton

**Ubicación:** `listView > actions`

**Funcionalidades:**
- ✅ Exportar elementos seleccionados como JSON
- ✅ Abrir vista externa en nueva pestaña
- ✅ Notificaciones de éxito/error
- ✅ Validación de selección

```javascript
// src/admin/extensions/components/CustomActionButton/index.js
import React from "react";
import { Button } from "@strapi/design-system/Button";
import { Download, ExternalLink } from "@strapi/icons";
import { useNotification } from '@strapi/helper-plugin';

const CustomActionButton = ({ selectedEntries = [] }) => {
  const toggleNotification = useNotification();

  const handleExport = async () => {
    try {
      if (selectedEntries.length === 0) {
        toggleNotification({
          type: 'warning',
          message: 'Por favor selecciona al menos un elemento para exportar'
        });
        return;
      }

      // Crear y descargar archivo JSON
      const exportData = selectedEntries.map(entry => ({
        id: entry.id,
        title: entry.title || entry.name,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      }));

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toggleNotification({
        type: 'success',
        message: `${selectedEntries.length} elementos exportados exitosamente`
      });
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: 'Error al exportar los datos'
      });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        variant="secondary"
        startIcon={<Download />}
        onClick={handleExport}
        disabled={selectedEntries.length === 0}
      >
        Exportar Seleccionados ({selectedEntries.length})
      </Button>
      
      <Button
        variant="tertiary"
        startIcon={<ExternalLink />}
        onClick={() => window.open('/admin/dashboard', '_blank')}
      >
        Vista Externa
      </Button>
    </div>
  );
};

export default CustomActionButton;
```

### 📊 ContentStatusIndicator

**Ubicación:** `editView > informations`

**Funcionalidades:**
- ✅ Estado visual del contenido (Publicado/Borrador/Programado)
- ✅ Fechas de publicación y modificación
- ✅ Iconos y colores según estado

```javascript
// src/admin/extensions/components/ContentStatusIndicator/index.js
import React from "react";
import { Badge } from "@strapi/design-system/Badge";
import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import { CheckCircle, Clock, AlertTriangle } from "@strapi/icons";

const ContentStatusIndicator = ({ entry }) => {
  const getStatusInfo = () => {
    if (!entry) return { status: 'unknown', color: 'neutral', icon: AlertTriangle };

    const isPublished = entry.publishedAt;
    const isScheduled = entry.publishedAt && new Date(entry.publishedAt) > new Date();
    
    if (isScheduled) {
      return {
        status: 'programado',
        color: 'secondary',
        icon: Clock,
        message: `Publicación programada: ${new Date(entry.publishedAt).toLocaleDateString()}`
      };
    }
    
    if (isPublished) {
      return {
        status: 'publicado',
        color: 'success',
        icon: CheckCircle,
        message: `Publicado: ${new Date(entry.publishedAt).toLocaleDateString()}`
      };
    }
    
    return {
      status: 'borrador',
      color: 'warning',
      icon: AlertTriangle,
      message: 'Contenido en borrador'
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Box padding={2}>
      <Box marginBottom={2}>
        <Badge 
          backgroundColor={`${statusInfo.color}100`} 
          textColor={`${statusInfo.color}600`}
          startIcon={<StatusIcon />}
        >
          {statusInfo.status.toUpperCase()}
        </Badge>
      </Box>
      
      <Typography variant="pi" textColor="neutral600">
        {statusInfo.message}
      </Typography>
      
      {entry?.updatedAt && (
        <Typography variant="pi" textColor="neutral500" marginTop={1}>
          Última modificación: {new Date(entry.updatedAt).toLocaleString()}
        </Typography>
      )}
    </Box>
  );
};

export default ContentStatusIndicator;
```

## 📁 Estructura de Archivos

```
src/
├── admin/
│   ├── app.js                                # Configuración principal
│   └── extensions/
│       └── components/
│           ├── CustomActionButton/
│           │   └── index.js                  # Botones de acción personalizados
│           └── ContentStatusIndicator/
│               └── index.js                  # Indicador de estado de contenido
└── api/
    └── posts/                                # Entidad de ejemplo
        ├── content-types/
        │   └── post/
        │       └── schema.json               # Modelo de datos Posts
        ├── controllers/
        │   └── posts.js                      # Controlador Posts
        ├── routes/
        │   └── posts.js                      # Rutas Posts
        └── services/
            └── posts.js                      # Servicios Posts
```

### 📝 Entidad Posts (Ejemplo)

La entidad **Posts** incluye los siguientes campos para demostrar las customizaciones:

- **title** - Título del post (requerido)
- **content** - Contenido rich text
- **excerpt** - Resumen corto
- **slug** - URL amigable (auto-generado)
- **featured_image** - Imagen destacada
- **tags** - Etiquetas (JSON)
- **author** - Autor del post
- **status** - Estado (draft/published/archived)
- **views** - Contador de visualizaciones
- **meta_description** - Meta descripción SEO
- **publishedAt** - Fecha de publicación (automático con draft/publish)

### Configuración Principal (app.js)

```javascript
// src/admin/app.js
import CustomActionButton from "./extensions/components/CustomActionButton";
import ContentStatusIndicator from "./extensions/components/ContentStatusIndicator";

export default {
  config: {
    // Traducciones personalizadas
    translations: {
      en: {
        "app.components.HomePage.welcome.again": "Welcome back to your CMS!",
        "app.components.LeftMenu.navbrand.title": "Custom Admin Panel",
      },
      es: {
        "app.components.HomePage.welcome.again": "¡Bienvenido de nuevo a tu CMS!",
        "app.components.LeftMenu.navbrand.title": "Panel de Administración",
      }
    },
    
    // Tema personalizado
    theme: {
      colors: {
        primary100: '#f0f8ff',
        primary500: '#0066cc',
        primary600: '#0052a3',
        primary700: '#004080',
      }
    },
    
    notifications: { releases: false },
    tutorials: false,
  },

  bootstrap(app) {
    console.log('🚀 Inicializando customizaciones del admin panel...');

    // Inyectar botones de acción en vista de lista
    app.injectContentManagerComponent("listView", "actions", {
      name: "CustomActionButton",
      Component: CustomActionButton,
    });

    // Inyectar indicador de estado en vista de edición
    app.injectContentManagerComponent("editView", "informations", {
      name: "ContentStatusIndicator", 
      Component: ContentStatusIndicator,
    });

    console.log('✅ Customizaciones cargadas correctamente');
  },
};
```

## 🚀 Cómo Probar los Ejemplos

### 1. **Crear Contenido de Ejemplo**

Este proyecto incluye una entidad **Posts** configurada para demostrar las customizaciones:

```bash
# Iniciar Strapi
npm run develop
# o con recarga automática del admin
npm run develop -- --watch-admin
```

### 2. **Configurar la Entidad Posts**

1. Accede al Admin Panel: `http://localhost:1337/admin`
2. Crea tu cuenta de administrador
3. Ve a **Content Manager > Posts**
4. **Opción A**: Crea posts manualmente con diferentes estados
5. **Opción B**: Importa los datos de ejemplo desde `database/seeds/posts.json`

#### 📋 Posts de Ejemplo Incluidos

El proyecto incluye 4 posts de ejemplo que demuestran diferentes estados:

- **"Introducción a Strapi V4"** - ✅ Publicado (150 views)
- **"Customización con Injection Zone"** - ✅ Publicado (89 views)  
- **"Mejores Prácticas de Desarrollo"** - 📝 Borrador (0 views)
- **"Migración desde V3 a V4"** - ⏰ Programado para futuro (5 views)

### 3. **Verificar las Customizaciones**

Una vez que tengas posts creados, verás:

#### En ListView (Lista de Posts):
- **Botón "Exportar Seleccionados"** - Selecciona posts y exporta como JSON
- **Botón "Vista Externa"** - Abre dashboard en nueva pestaña
- **Contador dinámico** - Muestra cantidad de elementos seleccionados

#### En EditView (Editar Post):
- **Panel de Estado** - Muestra estado del post (Borrador/Publicado/Programado)
- **Información de fechas** - Creación y última modificación
- **Indicadores visuales** - Badges con colores según estado

#### Tema y Traducciones:
- **Colores azules** en lugar del púrpura por defecto
- **Textos personalizados** en español/inglés
- **Mensajes de bienvenida** customizados

## 📋 Mejores Prácticas

### 🎯 Para Injection Zone

1. **Estructura Organizativa**
   ```
   src/admin/extensions/
   ├── components/
   │   ├── shared/          # Componentes reutilizables
   │   ├── content-manager/ # Específicos del gestor de contenido
   │   └── plugins/         # Específicos de plugins
   └── utils/               # Utilidades compartidas
   ```

2. **Nomenclatura Consistente**
   ```javascript
   // ✅ Bueno
   app.injectContentManagerComponent("listView", "actions", {
     name: "ExportDataButton",
     Component: ExportDataButton,
   });
   
   // ❌ Evitar
   app.injectContentManagerComponent("listView", "actions", {
     name: "btn1",
     Component: MyButton,
   });
   ```

3. **Gestión de Estado**
   ```javascript
   // Usar hooks de Strapi cuando sea posible
   import { useNotification } from '@strapi/helper-plugin';
   
   const MyComponent = () => {
     const toggleNotification = useNotification();
     // ...
   };
   ```

### 🚀 Performance

- **Lazy Loading:** Cargar componentes solo cuando se necesiten
- **Memoización:** Usar React.memo para componentes pesados
- **Optimización de Queries:** Minimizar llamadas a la API

## 🔧 Troubleshooting

### 🚨 Problema: Error "Module not found: @strapi/design-system/v2"

**Síntomas:**
```
[ERROR] Module not found: Error: Can't resolve '@strapi/design-system/v2'
[ERROR] There seems to be an unexpected error, try again with --debug for more information
```

**Causa:** Versiones incompatibles de `@strapi/design-system` y `@strapi/icons`

**✅ Solución:**
```bash
# 1. Actualizar package.json con las versiones correctas:
"@strapi/design-system": "^1.19.0",
"@strapi/icons": "^1.19.0",
"styled-components": "^5.3.11"

# 2. Reinstalar dependencias
npm install

# 3. Si persisten conflictos:
npm install --legacy-peer-deps
```

### 🚨 Problema: Conflictos de styled-components

**Síntomas:**
```
npm error ERESOLVE unable to resolve dependency tree
npm error peer styled-components@"^6.0.0" from @strapi/icons@2.0.1
npm error Found: styled-components@5.3.3
```

**✅ Solución:** Usar las versiones compatibles del JSON de dependencias de arriba.

### 🚨 Problema: Puerto 1337 ya en uso

**Síntomas:**
```
[ERROR] The port 1337 is already used by another application.
```

**✅ Solución:**
```bash
# Windows
netstat -ano | findstr :1337
taskkill /PID [PID_NUMBER] /F

# Linux/Mac  
lsof -ti:1337 | xargs kill -9
```

### Problema: Los componentes no aparecen
**Solución:**
```bash
# Limpiar cache y reconstruir
yarn build
yarn develop --watch-admin
```

### Problema: Errores de importación
**Verificar:**
- Estructura de carpetas correcta
- Nombres de archivos exactos
- Sintaxis de importación en app.js

### Problema: Estilos no se aplican
**Verificar:**
- Configuración de tema en app.js
- Uso correcto del Design System
- Cache del navegador

## 💼 Casos de Uso Avanzados

### 🎯 Extensiones Posibles

#### 1. **Validador de Contenido**
```javascript
const ContentValidator = ({ entry }) => {
  // Validar campos obligatorios
  // Verificar formato de datos
  // Mostrar warnings/errores
};
```

#### 2. **Integración con APIs Externas**
```javascript
const SyncButton = () => {
  const syncWithCRM = async () => {
    // Sincronizar con CRM externo
    // Actualizar datos en tiempo real
  };
};
```

#### 3. **Workflow de Aprobación**
```javascript
const ApprovalWorkflow = ({ entry }) => {
  // Sistema de aprobación por roles
  // Estados: Pendiente > Revisión > Aprobado
  // Notificaciones automáticas
};
```

## 📚 Recursos Adicionales

### 📖 Documentación Oficial
- **[Admin Panel API](https://docs.strapi.io/developer-docs/latest/developer-resources/plugin-api-reference/admin-panel.html)**
- **[Design System](https://design-system.strapi.io/)**
- **[Helper Plugin](https://github.com/strapi/strapi/tree/master/packages/strapi-helper-plugin)**

### 🛠️ Herramientas de Desarrollo
- **[Strapi Design System Storybook](https://design-system.strapi.io/)**
- **[GitHub Dev Environment](https://github.dev/strapi/strapi)** - Para explorar código fuente

### 🎓 Tutoriales y Ejemplos
- **[Strapi Blog](https://strapi.io/blog)**
- **[Community Tutorials](https://strapi.io/tutorials)**
- **[GitHub Examples](https://github.com/strapi/strapi/tree/master/examples)**

### ✨ Community

- **[Discord](https://discord.strapi.io)** - Chat con la comunidad Strapi
- **[Forum](https://forum.strapi.io/)** - Preguntas y respuestas
- **[Awesome Strapi](https://github.com/strapi/awesome-strapi)** - Lista curada de recursos

## 🎯 Conclusión

La customización del Panel de Administración de Strapi V4 ofrece múltiples enfoques:

1. **🟢 Plugins Existentes** - Para necesidades comunes y rápida implementación
2. **🟡 Configuración** - Para personalizaciones superficiales y branding
3. **🎯 Injection Zone** - **Enfoque recomendado** para la mayoría de customizaciones
4. **🔴 Plugins Personalizados** - Para funcionalidades complejas y específicas

**Injection Zone** representa el equilibrio perfecto entre flexibilidad, estabilidad y mantenibilidad, siendo la metodología principal que adoptaremos en nuestros proyectos de desarrollo.

---

*Desarrollado para el equipo de desarrollo - Enfoque en Injection Zone para customización eficiente del Panel de Administración de Strapi V4*
