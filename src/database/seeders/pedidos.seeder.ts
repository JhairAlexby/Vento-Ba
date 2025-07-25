import { DataSource } from 'typeorm';
import { Pedido, EstadoPedido } from '../../pedidos/entities/pedido.entity';
import { DetallePedido } from '../../pedidos/entities/detalle-pedido.entity';
import { User } from '../../users/entities/user.entity';
import { Platillo } from '../../menu/entities/platillo.entity';

export class PedidosSeeder {
  static async run(dataSource: DataSource): Promise<void> {
    const pedidoRepository = dataSource.getRepository(Pedido);
    const detallePedidoRepository = dataSource.getRepository(DetallePedido);
    const userRepository = dataSource.getRepository(User);
    const platilloRepository = dataSource.getRepository(Platillo);

    // Verificar si ya existen pedidos
    const existingPedidos = await pedidoRepository.count();
    if (existingPedidos > 0) {
      console.log('Los pedidos ya existen, saltando seeder...');
      return;
    }

    // Obtener usuarios y platillos existentes
    const users = await userRepository.find();
    const platillos = await platilloRepository.find();

    if (users.length === 0 || platillos.length === 0) {
      console.log('No hay usuarios o platillos disponibles para crear pedidos');
      return;
    }

    const pedidosData = [
      {
        usuario: users[0],
        estado: EstadoPedido.ENTREGADO,
        notas: 'Entrega rápida, excelente servicio',
        detalles: [
          {
            platillo: platillos[0],
            cantidad: 2,
            notasEspeciales: 'Sin cebolla'
          },
          {
            platillo: platillos[1],
            cantidad: 1,
            notasEspeciales: 'Extra queso'
          }
        ]
      },
      {
        usuario: users[0],
        estado: EstadoPedido.EN_PREPARACION,
        notas: 'Para llevar',
        detalles: [
          {
            platillo: platillos[2] || platillos[0],
            cantidad: 1,
            notasEspeciales: 'Término medio'
          }
        ]
      },
      {
        usuario: users.length > 1 ? users[1] : users[0],
        estado: EstadoPedido.PENDIENTE,
        notas: 'Primera vez ordenando',
        detalles: [
          {
            platillo: platillos[0],
            cantidad: 3,
            notasEspeciales: 'Bien cocido'
          },
          {
            platillo: platillos[1],
            cantidad: 2
          }
        ]
      },
      {
        usuario: users.length > 1 ? users[1] : users[0],
        estado: EstadoPedido.LISTO,
        notas: 'Recoger en 10 minutos',
        detalles: [
          {
            platillo: platillos[1],
            cantidad: 1,
            notasEspeciales: 'Sin salsa picante'
          }
        ]
      },
      {
        usuario: users[0],
        estado: EstadoPedido.CANCELADO,
        notas: 'Cliente canceló por tiempo de espera',
        detalles: [
          {
            platillo: platillos[0],
            cantidad: 1
          }
        ]
      }
    ];

    for (const pedidoData of pedidosData) {
      let total = 0;
      const detallesCreados: DetallePedido[] = [];

      // Crear detalles y calcular total
      for (const detalleData of pedidoData.detalles) {
        const subtotal = Number(detalleData.platillo.precio) * detalleData.cantidad;
        total += subtotal;

        const detalle = detallePedidoRepository.create({
          platillo: detalleData.platillo,
          platilloId: detalleData.platillo.id,
          cantidad: detalleData.cantidad,
          precioUnitario: detalleData.platillo.precio,
          subtotal: subtotal,
          notasEspeciales: detalleData.notasEspeciales
        });

        detallesCreados.push(detalle);
      }

      // Crear pedido
      const pedido = pedidoRepository.create({
        usuario: pedidoData.usuario,
        usuarioId: pedidoData.usuario.id,
        total: total,
        estado: pedidoData.estado,
        notas: pedidoData.notas,
        detalles: detallesCreados
      });

      await pedidoRepository.save(pedido);
    }

    console.log('✅ Pedidos de ejemplo creados exitosamente');
  }
}