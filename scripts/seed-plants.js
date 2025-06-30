const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const plantData = [
  {
    name: "Northern Lights #1",
    genetics: "Northern Lights",
    phase: "floracion",
    germinationDate: new Date('2024-10-15'),
    vegetationDate: new Date('2024-11-01'),
    floweringDate: new Date('2024-12-15'),
  },
  {
    name: "OG Kush Principal",
    genetics: "OG Kush",
    phase: "vegetacion",
    germinationDate: new Date('2024-11-20'),
    vegetationDate: new Date('2024-12-05'),
  },
  {
    name: "White Widow #1",
    genetics: "White Widow",
    phase: "germinacion",
    germinationDate: new Date('2024-12-20'),
  },
  {
    name: "Blue Dream",
    genetics: "Blue Dream",
    phase: "floracion",
    germinationDate: new Date('2024-10-01'),
    vegetationDate: new Date('2024-10-20'),
    floweringDate: new Date('2024-12-01'),
  },
  {
    name: "Amnesia Haze",
    genetics: "Amnesia Haze",
    phase: "vegetacion",
    germinationDate: new Date('2024-11-10'),
    vegetationDate: new Date('2024-11-25'),
  },
  {
    name: "Purple Kush",
    genetics: "Purple Kush",
    phase: "floracion",
    germinationDate: new Date('2024-09-15'),
    vegetationDate: new Date('2024-10-05'),
    floweringDate: new Date('2024-11-20'),
  },
  {
    name: "Green Crack",
    genetics: "Green Crack",
    phase: "germinacion",
    germinationDate: new Date('2024-12-25'),
  },
  {
    name: "Sour Diesel",
    genetics: "Sour Diesel",
    phase: "vegetacion",
    germinationDate: new Date('2024-11-15'),
    vegetationDate: new Date('2024-12-01'),
  },
  {
    name: "Jack Herer",
    genetics: "Jack Herer",
    phase: "floracion",
    germinationDate: new Date('2024-10-10'),
    vegetationDate: new Date('2024-10-30'),
    floweringDate: new Date('2024-12-10'),
  },
  {
    name: "Gorilla Glue #4",
    genetics: "Gorilla Glue #4",
    phase: "vegetacion",
    germinationDate: new Date('2024-11-25'),
    vegetationDate: new Date('2024-12-10'),
  },
  {
    name: "AK-47",
    genetics: "AK-47",
    phase: "germinacion",
    germinationDate: new Date('2024-12-28'),
  },
  {
    name: "Skywalker OG",
    genetics: "Skywalker OG",
    phase: "floracion",
    germinationDate: new Date('2024-09-20'),
    vegetationDate: new Date('2024-10-10'),
    floweringDate: new Date('2024-11-25'),
  },
  {
    name: "Girl Scout Cookies",
    genetics: "Girl Scout Cookies",
    phase: "vegetacion",
    germinationDate: new Date('2024-11-18'),
    vegetationDate: new Date('2024-12-03'),
  },
  {
    name: "Pineapple Express",
    genetics: "Pineapple Express",
    phase: "floracion",
    germinationDate: new Date('2024-10-05'),
    vegetationDate: new Date('2024-10-25'),
    floweringDate: new Date('2024-12-05'),
  },
  {
    name: "Strawberry Cough",
    genetics: "Strawberry Cough",
    phase: "germinacion",
    germinationDate: new Date('2024-12-30'),
  }
];

async function seedPlants() {
  try {
    console.log('🌱 Iniciando carga de plantas de prueba...');

    // Buscar cualquier usuario existente o crear uno de prueba
    let user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('👤 No se encontraron usuarios. Creando usuario de prueba...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      user = await prisma.user.create({
        data: {
          name: 'Usuario de Prueba',
          email: 'test@example.com',
          password: hashedPassword
        }
      });
      console.log(`✅ Usuario creado: ${user.name} (${user.email})`);
    } else {
      console.log(`✅ Usuario encontrado: ${user.name} (${user.email})`);
    }

    // Eliminar plantas existentes del usuario (opcional)
    const existingPlants = await prisma.plant.count({
      where: { userId: user.id }
    });

    if (existingPlants > 0) {
      console.log(`🗑️  Eliminando ${existingPlants} plantas existentes...`);
      await prisma.plant.deleteMany({
        where: { userId: user.id }
      });
    }

    // Crear las nuevas plantas
    console.log('🌿 Creando 15 plantas de prueba...');
    
    for (let i = 0; i < plantData.length; i++) {
      const plant = plantData[i];
      await prisma.plant.create({
        data: {
          ...plant,
          userId: user.id
        }
      });
      console.log(`   ✓ ${i + 1}/15 - ${plant.name} (${plant.phase})`);
    }

    console.log('🎉 ¡Plantas cargadas exitosamente!');
    console.log('\n📊 Resumen:');
    
    const summary = await prisma.plant.groupBy({
      by: ['phase'],
      where: { userId: user.id },
      _count: true
    });

    summary.forEach(group => {
      const phaseName = group.phase === 'germinacion' ? 'Germinación' :
                       group.phase === 'vegetacion' ? 'Vegetación' : 'Floración';
      console.log(`   ${phaseName}: ${group._count} plantas`);
    });

  } catch (error) {
    console.error('❌ Error al cargar plantas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
seedPlants(); 