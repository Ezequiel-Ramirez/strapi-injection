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
import React, { useState, useEffect } from "react";
import { Button } from "@strapi/design-system/Button";
import { Plus } from "@strapi/icons";
import { useLocation } from 'react-router-dom';

const CustomButton = () => {
  const location = useLocation();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Configurar en qué páginas mostrar el componente
    const isPostsPage = /^\/content-manager\/collection-types\/api::posts\.post/.test(location.pathname);
    const isUsersPage = /^\/content-manager\/collection-types\/plugin::users-permissions\.user/.test(location.pathname);
    
    // Mostrar solo en páginas específicas
    setShouldShow(isPostsPage || isUsersPage);
  }, [location.pathname]);

  // Si no debe mostrarse, retornar null
  if (!shouldShow) return null;

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

> ⚠️ **IMPORTANTE**: Sin la validación de ubicación (`useLocation` y `useEffect`), el componente se mostraría en **TODAS las entidades** del Content Manager. Es fundamental configurar las rutas específicas donde quieres que aparezca tu componente para evitar que se muestre en lugares no deseados.

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



## 📋 Mejores Prácticas

### 🎯 Para Injection Zone

1. **Estructura Organizativa**
   ```
   src/admin/extensions/
   ├── components/
   │   ├── shared/          # Componentes reutilizables
   │   ├── content-manager/ # Específicos del gestor de contenido
   │   └── plugins/         # Específicos de plugins
   ├── hooks/               # Custom hooks reutilizables
   ├── services/            # Servicios y lógica de negocio
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


## 🎯 Conclusión

La customización del Panel de Administración de Strapi V4 ofrece múltiples enfoques:

1. **🟢 Plugins Existentes** - Para necesidades comunes y rápida implementación
2. **🟡 Configuración** - Para personalizaciones superficiales y branding
3. **🎯 Injection Zone** - **Enfoque recomendado** para la mayoría de customizaciones
4. **🔴 Plugins Personalizados** - Para funcionalidades complejas y específicas

**Injection Zone** representa el equilibrio perfecto entre flexibilidad, estabilidad y mantenibilidad, siendo la metodología principal que adoptaremos en nuestros proyectos de desarrollo.

---

*Desarrollado para el equipo de desarrollo - Enfoque en Injection Zone para customización eficiente del Panel de Administración de Strapi V4*
