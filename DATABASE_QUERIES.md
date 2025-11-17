# 🗄️ Tipos de Consultas en Strapi V4

Guía completa sobre los diferentes tipos de consultas que Strapi ejecuta desde el servidor hacia la base de datos.

## 📋 Índice

- [Consultas CRUD Básicas](#1-consultas-crud-básicas)
- [Consultas de Relaciones](#2-consultas-de-relaciones)
- [Filtros Avanzados](#3-consultas-con-filtros-avanzados)
- [Consultas de Agregación](#4-consultas-de-agregación)
- [Búsqueda de Texto](#5-consultas-de-búsqueda)
- [Consultas de Sistema](#6-consultas-de-sistema)
- [Transacciones](#7-consultas-transaccionales)
- [Auditoría](#8-consultas-de-auditoría)
- [Performance](#9-consultas-de-performance)
- [Consultas Personalizadas](#10-consultas-personalizadas)
- [Monitoreo](#-monitoreo-de-consultas)

---

## 1. Consultas CRUD Básicas

### CREATE (Crear)
```javascript
// Crear una nueva entrada
await strapi.entityService.create('api::post.post', {
  data: {
    title: 'Mi nuevo post',
    content: 'Contenido del post',
    publishedAt: new Date()
  }
});

// Crear con relaciones
await strapi.entityService.create('api::post.post', {
  data: {
    title: 'Post con autor',
    author: 1, // ID del autor
    categories: [1, 2, 3] // IDs de categorías
  }
});
```

### READ (Leer)
```javascript
// Obtener todas las entradas
await strapi.entityService.findMany('api::post.post', {
  populate: ['author', 'categories'],
  filters: { publishedAt: { $notNull: true } },
  sort: { createdAt: 'desc' },
  pagination: { page: 1, pageSize: 10 }
});

// Obtener una entrada específica
await strapi.entityService.findOne('api::post.post', 1, {
  populate: '*'
});

// Contar entradas
const count = await strapi.entityService.count('api::post.post', {
  filters: { publishedAt: { $notNull: true } }
});
```

### UPDATE (Actualizar)
```javascript
// Actualizar una entrada
await strapi.entityService.update('api::post.post', 1, {
  data: {
    title: 'Título actualizado',
    updatedAt: new Date()
  }
});

// Actualización parcial
await strapi.entityService.update('api::post.post', 1, {
  data: {
    views: { $inc: 1 } // Incrementar contador
  }
});
```

### DELETE (Eliminar)
```javascript
// Eliminar una entrada
await strapi.entityService.delete('api::post.post', 1);

// Eliminar múltiples entradas
const idsToDelete = [1, 2, 3];
for (const id of idsToDelete) {
  await strapi.entityService.delete('api::post.post', id);
}
```

---

## 2. Consultas de Relaciones

### Populate (Cargar relaciones)
```javascript
// Populate básico
await strapi.entityService.findMany('api::post.post', {
  populate: ['author', 'categories']
});

// Populate anidado
await strapi.entityService.findMany('api::post.post', {
  populate: {
    author: {
      populate: ['avatar', 'social_links']
    },
    categories: {
      populate: ['icon'],
      filters: { active: true }
    },
    comments: {
      populate: ['user'],
      filters: { approved: true },
      sort: { createdAt: 'desc' }
    }
  }
});
```

### Gestión de Relaciones Many-to-Many
```javascript
// Conectar/desconectar relaciones
await strapi.entityService.update('api::post.post', 1, {
  data: {
    categories: {
      connect: [2, 3], // Conectar categorías
      disconnect: [1]  // Desconectar categoría
    },
    tags: {
      set: [4, 5, 6] // Reemplazar todas las tags
    }
  }
});
```

---

## 3. Consultas con Filtros Avanzados

### Operadores de Comparación
```javascript
await strapi.entityService.findMany('api::post.post', {
  filters: {
    // Igualdad
    status: { $eq: 'published' },
    
    // Comparación numérica
    views: { $gte: 100 },        // Mayor o igual
    likes: { $lt: 50 },          // Menor que
    
    // Texto
    title: { $contains: 'Strapi' },     // Contiene (case sensitive)
    slug: { $containsi: 'tutorial' },   // Contiene (case insensitive)
    
    // Fechas
    publishedAt: { 
      $between: ['2023-01-01', '2023-12-31'] 
    },
    
    // Arrays
    'categories.slug': { $in: ['tech', 'tutorial'] },
    'tags.name': { $notIn: ['deprecated', 'old'] },
    
    // Nulos
    featuredImage: { $null: false },
    archivedAt: { $notNull: true }
  }
});
```

### Filtros Lógicos
```javascript
await strapi.entityService.findMany('api::post.post', {
  filters: {
    $or: [
      { featured: true },
      { views: { $gte: 1000 } },
      { 'author.verified': true }
    ],
    $and: [
      { publishedAt: { $notNull: true } },
      { status: 'published' }
    ]
  }
});
```

### Filtros en Relaciones
```javascript
await strapi.entityService.findMany('api::post.post', {
  filters: {
    'author.name': { $eq: 'Juan Pérez' },
    'categories.slug': { $in: ['tech', 'tutorial'] },
    'comments.approved': true
  }
});
```

---

## 4. Consultas de Agregación

### Conteos y Estadísticas
```javascript
// Contar entradas con filtros
const publishedCount = await strapi.entityService.count('api::post.post', {
  filters: { publishedAt: { $notNull: true } }
});

// Consultas de agregación con Knex
const stats = await strapi.db.connection.raw(`
  SELECT 
    COUNT(*) as total_posts,
    AVG(views) as avg_views,
    MAX(views) as max_views,
    MIN(views) as min_views,
    SUM(views) as total_views
  FROM posts 
  WHERE published_at IS NOT NULL
`);

// Agrupar por categoría
const categoryStats = await strapi.db.connection.raw(`
  SELECT 
    c.name as category_name,
    COUNT(p.id) as post_count,
    AVG(p.views) as avg_views
  FROM posts p
  JOIN posts_categories_links pcl ON p.id = pcl.post_id
  JOIN categories c ON pcl.category_id = c.id
  WHERE p.published_at IS NOT NULL
  GROUP BY c.id, c.name
  ORDER BY post_count DESC
`);
```

---

## 5. Consultas de Búsqueda

### Búsqueda de Texto Simple
```javascript
await strapi.entityService.findMany('api::post.post', {
  filters: {
    $or: [
      { title: { $containsi: 'búsqueda' } },
      { content: { $containsi: 'búsqueda' } },
      { excerpt: { $containsi: 'búsqueda' } }
    ]
  }
});
```

### Búsqueda Full-Text (PostgreSQL)
```javascript
// Usando consulta SQL directa para búsqueda full-text
const searchResults = await strapi.db.connection.raw(`
  SELECT *, ts_rank(search_vector, plainto_tsquery('spanish', ?)) as rank
  FROM posts 
  WHERE search_vector @@ plainto_tsquery('spanish', ?)
  ORDER BY rank DESC
  LIMIT 20
`, [searchTerm, searchTerm]);
```

---

## 6. Consultas de Sistema

### Usuarios y Roles
```javascript
// Usuarios del admin
const adminUsers = await strapi.query('admin::user').findMany({
  populate: ['roles']
});

// Roles y permisos
const roles = await strapi.query('admin::role').findMany({
  populate: ['permissions']
});
```

### Archivos y Media
```javascript
// Archivos subidos
const files = await strapi.query('plugin::upload.file').findMany({
  filters: {
    mime: { $startsWith: 'image/' }
  },
  sort: { createdAt: 'desc' }
});
```

### Configuración del Sistema
```javascript
// Configuración de content-types
const contentTypes = await strapi.db.query('strapi::core-store').findMany({
  where: { 
    key: { $startsWith: 'plugin_content_manager_configuration_content_types' } 
  }
});

// Configuración de plugins
const pluginConfig = await strapi.db.query('strapi::core-store').findOne({
  where: { key: 'plugin_users-permissions_advanced' }
});
```

---

## 7. Consultas Transaccionales

### Operaciones Atómicas
```javascript
// Transacción simple
await strapi.db.transaction(async (trx) => {
  // Crear post
  const post = await strapi.entityService.create('api::post.post', {
    data: { title: 'Nuevo post', author: authorId }
  }, { transacting: trx });

  // Actualizar contador del autor
  await strapi.entityService.update('api::author.author', authorId, {
    data: { post_count: { $inc: 1 } }
  }, { transacting: trx });

  // Si algo falla, se hace rollback automático
});
```

### Transacciones Complejas
```javascript
await strapi.db.transaction(async (trx) => {
  try {
    // Múltiples operaciones que deben ser atómicas
    const order = await strapi.entityService.create('api::order.order', {
      data: { user: userId, total: orderTotal }
    }, { transacting: trx });

    for (const item of orderItems) {
      await strapi.entityService.create('api::order-item.order-item', {
        data: { order: order.id, product: item.productId, quantity: item.quantity }
      }, { transacting: trx });

      // Actualizar stock
      await strapi.entityService.update('api::product.product', item.productId, {
        data: { stock: { $dec: item.quantity } }
      }, { transacting: trx });
    }

    // Crear factura
    await strapi.entityService.create('api::invoice.invoice', {
      data: { order: order.id, amount: orderTotal }
    }, { transacting: trx });

  } catch (error) {
    // El rollback es automático
    throw error;
  }
});
```

---

## 8. Consultas de Auditoría

### Logs de Sistema
```javascript
// Logs de auditoría del admin
const auditLogs = await strapi.db.query('admin::audit-log').findMany({
  where: {
    action: 'entry.create',
    date: { $gte: new Date('2023-01-01') }
  },
  orderBy: { date: 'desc' },
  limit: 100
});

// Actividad de usuarios
const userActivity = await strapi.db.connection.raw(`
  SELECT 
    u.firstname,
    u.lastname,
    COUNT(al.id) as actions_count,
    MAX(al.date) as last_activity
  FROM admin_users u
  LEFT JOIN admin_audit_logs al ON u.id = al.user_id
  WHERE al.date >= ?
  GROUP BY u.id, u.firstname, u.lastname
  ORDER BY actions_count DESC
`, [new Date('2023-01-01')]);
```

---

## 9. Consultas de Performance

### Optimización con Índices
```javascript
// Consultas optimizadas que usan índices
await strapi.db.connection('posts')
  .select('*')
  .where('slug', slug) // Usa índice en slug
  .first();

// Paginación eficiente
await strapi.entityService.findMany('api::post.post', {
  start: (page - 1) * pageSize,
  limit: pageSize,
  sort: { publishedAt: 'desc' } // Usa índice en publishedAt
});
```

### Consultas con Límites
```javascript
// Evitar consultas costosas
const recentPosts = await strapi.entityService.findMany('api::post.post', {
  filters: { publishedAt: { $notNull: true } },
  sort: { publishedAt: 'desc' },
  limit: 20, // Siempre usar límites
  populate: {
    author: { fields: ['name', 'avatar'] }, // Solo campos necesarios
    categories: { fields: ['name', 'slug'] }
  }
});
```

---

## 10. Consultas Personalizadas

### SQL Directo con Knex
```javascript
// Consulta compleja con JOINs
const popularPosts = await strapi.db.connection.raw(`
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.views,
    a.name as author_name,
    COUNT(c.id) as comment_count,
    AVG(r.rating) as avg_rating
  FROM posts p
  LEFT JOIN authors a ON p.author_id = a.id
  LEFT JOIN comments c ON p.id = c.post_id AND c.approved = true
  LEFT JOIN ratings r ON p.id = r.post_id
  WHERE p.published_at IS NOT NULL
    AND p.published_at >= ?
  GROUP BY p.id, p.title, p.slug, p.views, a.name
  HAVING COUNT(c.id) >= ?
  ORDER BY p.views DESC, avg_rating DESC
  LIMIT ?
`, [new Date('2023-01-01'), 5, 10]);
```

### Consultas con Query Builder
```javascript
// Usando el query builder de Knex
const posts = await strapi.db.connection('posts')
  .select('posts.*', 'authors.name as author_name')
  .leftJoin('authors', 'posts.author_id', 'authors.id')
  .where('posts.published_at', '>=', startDate)
  .andWhere('posts.views', '>=', minViews)
  .orderBy('posts.views', 'desc')
  .limit(20);
```

---

## 🔍 Monitoreo de Consultas

### Habilitar Logs de Base de Datos

```javascript
// config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      // ... configuración de conexión
    },
    debug: env.bool('DATABASE_DEBUG', false), // Habilitar en desarrollo
    pool: {
      min: 2,
      max: 10
    }
  }
});
```

### Middleware de Logging Personalizado

```javascript
// config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Análisis de Performance

```javascript
// Middleware personalizado para medir tiempo de queries
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const start = Date.now();
    
    // Interceptar queries
    const originalQuery = strapi.db.connection.query;
    const queries = [];
    
    strapi.db.connection.query = function(...args) {
      const queryStart = Date.now();
      const result = originalQuery.apply(this, args);
      
      if (result && result.then) {
        return result.then(res => {
          queries.push({
            sql: args[0],
            duration: Date.now() - queryStart
          });
          return res;
        });
      }
      
      queries.push({
        sql: args[0],
        duration: Date.now() - queryStart
      });
      
      return result;
    };
    
    await next();
    
    // Restaurar query original
    strapi.db.connection.query = originalQuery;
    
    const totalTime = Date.now() - start;
    const queryTime = queries.reduce((sum, q) => sum + q.duration, 0);
    
    if (totalTime > 1000) { // Log requests lentos
      strapi.log.warn(`Slow request: ${ctx.method} ${ctx.url}`, {
        totalTime,
        queryTime,
        queryCount: queries.length,
        slowQueries: queries.filter(q => q.duration > 100)
      });
    }
  };
};
```

---

## 📊 Mejores Prácticas

### ✅ Recomendaciones

1. **Usar siempre límites** en consultas que pueden devolver muchos resultados
2. **Populate solo lo necesario** para evitar N+1 queries
3. **Crear índices** en campos que se usan frecuentemente en filtros
4. **Usar transacciones** para operaciones que deben ser atómicas
5. **Monitorear queries lentas** en producción
6. **Cachear resultados** de consultas costosas cuando sea posible

### ❌ Evitar

1. **Populate '*'** en consultas de lista
2. **Consultas sin límites** en tablas grandes
3. **N+1 queries** al cargar relaciones en loops
4. **Filtros en campos sin índices** en tablas grandes
5. **Consultas síncronas** que bloqueen el event loop

---

## 🔗 Referencias

- **[Entity Service API](https://docs.strapi.io/dev-docs/api/entity-service)**
- **[Query Engine API](https://docs.strapi.io/dev-docs/api/query-engine)**
- **[Database Layer](https://docs.strapi.io/dev-docs/database)**
- **[Knex.js Documentation](https://knexjs.org/)**
