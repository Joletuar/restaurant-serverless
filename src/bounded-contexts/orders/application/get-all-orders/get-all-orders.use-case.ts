import { OrderMapper } from "@src/bounded-contexts/orders/application/order.mapper";
import type { OrderRepository } from "@src/bounded-contexts/orders/domain/order.repository";

import type { GetAllOrdersResultDto } from "./get-all-orders-result.dto";

export class GetterAllOrdersQueryHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<GetAllOrdersResultDto> {
    const orders = await this.orderRepository.getAll();

    return OrderMapper.toDtoList(orders);
  }
}
