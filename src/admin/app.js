// Importar componentes personalizados

import CustomActionButton from "./extensions/components/CustomActionButton/index.js";
import ContentStatusIndicator from "./extensions/components/ContentStatusIndicator/index.js";


export default {
  config: {
    // Configuraciones de traducción
    translations: {
      en: {
        "app.components.HomePage.welcome.again": "Welcome back to your CMS!",
        "app.components.LeftMenu.navbrand.title": "Custom Admin Panel",
        "global.actions": "Custom Actions",
      },
      es: {
        "app.components.HomePage.welcome.again": "¡Bienvenido de nuevo a tu CMS!",
        "app.components.LeftMenu.navbrand.title": "Panel de Administración",
        "global.actions": "Acciones Personalizadas",
      }
    },
    
    // Configuración de tema personalizado
    theme: {
      colors: {
        primary100: '#f0f8ff',
        primary200: '#e1f0ff',
        primary500: '#0066cc',
        primary600: '#0052a3',
        primary700: '#004080',
      }
    },
    
    // Configuraciones adicionales
    notifications: {
      releases: false, // Deshabilitar notificaciones de nuevas versiones
    },
    
    tutorials: false, // Deshabilitar tutoriales por defecto
  },

  bootstrap(app) {
    console.log('🚀 Inicializando customizaciones del admin panel...');

    // ============================================
    // INJECTION ZONE - CONTENT MANAGER
    // ============================================

    // 1. Inyectar botones de acción personalizados en la vista de lista
    // app.injectContentManagerComponent("listView", "actions", {
    //   name: "CustomActionButton",
    //   Component: CustomActionButton,
    // });

    // 2. Inyectar indicador de estado en la vista de edición
    // app.injectContentManagerComponent("editView", "informations", {
    //   name: "ContentStatusIndicator", 
    //   Component: ContentStatusIndicator,
    // });

    // 3. Ejemplo de inyección en modal de eliminación
    // app.injectContentManagerComponent("editView", "right-links", {
    //   name: "DeleteWarning",
    //   Component: () => (
    //     <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
    //       <strong>⚠️ Atención:</strong> Esta acción no se puede deshacer.
    //     </div>
    //   ),
    // });

    console.log('✅ Customizaciones del admin panel cargadas correctamente');
  },
};
