import type { Order } from "@src/bounded-contexts/orders/domain/order.entity";
import type { OrderRepository } from "@src/bounded-contexts/orders/domain/order.repository";
import { OrderStatus } from "@src/bounded-contexts/orders/domain/value-objects/order-status.value-object";
import { IdValueObject } from "@src/bounded-contexts/shared/domain/value-objects/id.value-object";

import type { UpdateOrderStatusByIdDto } from "./update-order-by-id.dto";
import { OrderValidatorDomainService } from "../../domain/order-validator.domain-service";

export class UpdateOrderStatusById {
  constructor(
    private readonly repository: OrderRepository,
    private readonly orderValidatorDomainService: OrderValidatorDomainService
  ) {}

  async execute(dto: UpdateOrderStatusByIdDto): Promise<void> {
    const { id, status } = dto;

    const order = await this.ensureExistsOrder(id);

    order.updateStatus(OrderStatus.fromPrimitives(status));

    await this.repository.update(order);
  }

  private async ensureExistsOrder(orderId: string): Promise<Order> {
    const order = await this.orderValidatorDomainService.ensureOrderExists(
      IdValueObject.fromPrimitives(orderId)
    );

    return order;
  }
}
