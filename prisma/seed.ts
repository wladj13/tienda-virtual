import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electrónica',
      slug: 'electronica',
      description: 'Dispositivos electrónicos y gadgets',
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Ropa',
      slug: 'ropa',
      description: 'Ropa y accesorios de moda',
    },
  });

  const home = await prisma.category.create({
    data: {
      name: 'Hogar',
      slug: 'hogar',
      description: 'Artículos para el hogar',
    },
  });

  // Create products
  const products = [
    {
      name: 'Auriculares Bluetooth Premium',
      slug: 'auriculares-bluetooth-premium',
      description: 'Auriculares inalámbricos con cancelación de ruido, batería de 30 horas y sonido de alta fidelidad. Ideales para música, llamadas y trabajo remoto.',
      price: 149.99,
      comparePrice: 199.99,
      sku: 'AUR-BT-001',
      stock: 45,
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']),
      featured: true,
      active: true,
    },
    {
      name: 'Smartwatch Deportivo',
      slug: 'smartwatch-deportivo',
      description: 'Reloj inteligente con GPS integrado, monitor de frecuencia cardíaca, resistencia al agua 5ATM y más de 100 modos de ejercicio.',
      price: 249.99,
      comparePrice: 299.99,
      sku: 'SW-DP-002',
      stock: 30,
      images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']),
      featured: true,
      active: true,
    },
    {
      name: 'Cámara Mirrorless 4K',
      slug: 'camara-mirrorless-4k',
      description: 'Cámara sin espejo con sensor full-frame, grabación 4K 60fps, enfoque automático híbrido y conectividad Wi-Fi.',
      price: 1299.99,
      sku: 'CAM-ML-003',
      stock: 15,
      images: JSON.stringify(['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800']),
      featured: false,
      active: true,
    },
    {
      name: 'Camisa Casual Premium',
      slug: 'camisa-casual-premium',
      description: 'Camisa de algodón orgánico con corte moderno, disponible en varios colores. Perfecta para el día a día o eventos semi-formales.',
      price: 59.99,
      sku: 'CAM-CAS-001',
      stock: 100,
      images: JSON.stringify(['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800']),
      featured: true,
      active: true,
    },
    {
      name: 'Zapatillas Running Elite',
      slug: 'zapatillas-running-elite',
      description: 'Zapatillas de running con tecnología de amortiguación avanzada, upper transpirable y suela de goma durable.',
      price: 129.99,
      comparePrice: 159.99,
      sku: 'ZAP-RUN-001',
      stock: 60,
      images: JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']),
      featured: true,
      active: true,
    },
    {
      name: 'Bolso de Cuero Genuino',
      slug: 'bolso-cuero-genuino',
      description: 'Bolso de mano de cuero genuino con múltiples compartimentos, adecuado para trabajo o viajes.',
      price: 189.99,
      sku: 'BOL-CU-001',
      stock: 35,
      images: JSON.stringify(['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800']),
      featured: false,
      active: true,
    },
    {
      name: 'Lámpara de Escritorio LED',
      slug: 'lampara-escritorio-led',
      description: 'Lámpara de escritorio con luz LED regulable, carga inalámbrica para smartphones y diseño minimalista.',
      price: 79.99,
      sku: 'LAM-LED-001',
      stock: 80,
      images: JSON.stringify(['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800']),
      featured: true,
      active: true,
    },
    {
      name: 'Juego de Sábanas de Algodón Egipcio',
      slug: 'sabanas-algodon-egipcio',
      description: 'Juego de sábanas de 4 piezas de algodón egipcio 400 thread count, suave y duradero.',
      price: 99.99,
      comparePrice: 129.99,
      sku: 'SAB-ALG-001',
      stock: 50,
      images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']),
      featured: false,
      active: true,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    // Connect to category based on slug
    if (product.slug.includes('electronica')) {
      await prisma.product.update({
        where: { id: created.id },
        data: { categories: { connect: { id: electronics.id } } },
      });
    } else if (product.slug.includes('camisa') || product.slug.includes('zapatilla') || product.slug.includes('bolso')) {
      await prisma.product.update({
        where: { id: created.id },
        data: { categories: { connect: { id: clothing.id } } },
      });
    } else {
      await prisma.product.update({
        where: { id: created.id },
        data: { categories: { connect: { id: home.id } } },
      });
    }
  }

  // Create blog posts
  const posts = [
    {
      title: 'Cómo elegir los mejores auriculares para ti',
      slug: 'como-elegir-auriculares',
      excerpt: 'Guía completa para elegir auriculares según tu estilo de vida y necesidades auditivas.',
      content: '<p>Bienvenido a nuestra guía completa sobre cómo elegir los mejores auriculares...</p>',
      coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      published: true,
      publishedAt: new Date(),
      authorId: 'system',
    },
    {
      title: 'Tendencias en moda sostenible para 2024',
      slug: 'tendencias-moda-sostenible-2024',
      excerpt: 'Descubre las principales tendencias en moda sostenible que están revolucionando la industria.',
      content: '<p>La moda sostenible continúa ganando terreno en 2024...</p>',
      coverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      published: true,
      publishedAt: new Date(),
      authorId: 'system',
    },
    {
      title: 'Guía completa para decorar tu hogar',
      slug: 'guia-decorar-hogar',
      excerpt: 'Ideas y consejos prácticos para transformar tu espacio en un hogar acogedor y moderno.',
      content: '<p>Decorar tu hogar es una forma de expresar tu personalidad...</p>',
      coverImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      published: true,
      publishedAt: new Date(),
      authorId: 'system',
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.create({ data: post });
  }

  console.log('Database seeded successfully!');
  console.log(`Created ${products.length} products, ${posts.length} blog posts, and 3 categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
