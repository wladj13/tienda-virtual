# Tu Tienda - E-commerce Moderno

Tienda virtual moderna construida con Next.js 14, PostgreSQL, Prisma, Clerk y Stripe.

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Base de datos | PostgreSQL + Prisma ORM |
| Pagos | Stripe |
| Auth | Clerk |
| Estado | Zustand |
| Imágenes | Cloudinary |

## Empezar

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y completa:

- `DATABASE_URL` - URL de PostgreSQL (Neon, Railway, Supabase)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` - Clerk Dashboard
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe Dashboard
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary Dashboard

### 2. Instalar dependencias

```bash
npm install
```

### 3. Inicializar base de datos

```bash
npx prisma db push
npx prisma generate
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
tienda-virtual/
├── app/
│   ├── (shop)/           # Storefront (público)
│   │   ├── products/     # Catálogo con filtros
│   │   ├── cart/         # Carrito
│   │   ├── checkout/     # Pago con Stripe
│   │   └── blog/         # Blog
│   ├── (admin)/          # Dashboard admin
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   └── blog/
│   └── api/              # API routes
│       ├── checkout/     # Crear sesión de Stripe
│       └── webhooks/     # Webhooks de Stripe
├── prisma/
│   └── schema.prisma     # Schema de la BD
├── components/
│   ├── layout/           # Header, Footer
│   ├── shop/             # Componentes de tienda
│   └── admin/            # Componentes de admin
├── lib/
│   ├── prisma.ts         # Cliente Prisma
│   ├── stripe.ts         # Cliente Stripe
│   └── utils.ts          # Utilidades
└── store/
    └── cart.ts           # Estado del carrito (Zustand)
```

## Rutas

### Tienda (público)
- `/` - Página de inicio
- `/products` - Catálogo con filtros
- `/products/[slug]` - Detalle de producto
- `/cart` - Carrito de compras
- `/checkout` - Pago con Stripe
- `/blog` - Blog
- `/blog/[slug]` - Artículo del blog

### Admin
- `/dashboard` - Estadísticas
- `/dashboard/products` - Gestionar productos
- `/dashboard/orders` - Gestionar pedidos
- `/dashboard/blog` - Gestionar blog

## Próximos Pasos

1. Configurar Clerk (crear cuenta en clerk.com)
2. Configurar Stripe (crear cuenta en stripe.com)
3. Configurar base de datos PostgreSQL
4. Configurar Cloudinary para imágenes
5. Personalizar el diseño y contenido
6. Implementar más features (suscripciones, cupones, etc.)

## Deployment

Recomendado: Vercel (frontend) + Neon o Railway (PostgreSQL)
