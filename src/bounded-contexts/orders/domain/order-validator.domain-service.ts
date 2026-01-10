import type { IdValueObject } from "@src/bounded-contexts/shared/domain/value-objects/id.value-object";

import { NotFoundOrderException } from "./exceptions/not-found-order.exception";
import type { OrderRepository } from "./order.repository";
import type { Order } from "./order.entity";

export class OrderValidatorDomainService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async ensureOrderExists(orderId: IdValueObject): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) throw new NotFoundOrderException(orderId.value);

    return order;
  }
}
