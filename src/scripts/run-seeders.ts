import { AppDataSource } from '../data-source';
import { PedidosSeeder } from '../database/seeders/pedidos.seeder';

async function runSeeders() {
  try {
    console.log('🌱 Iniciando seeders...');
    
    await AppDataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Ejecutar seeder de pedidos
    await PedidosSeeder.run(AppDataSource);

    console.log('🎉 Todos los seeders ejecutados exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

runSeeders();