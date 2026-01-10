import { OrderMapper } from "@src/bounded-contexts/orders/application/order.mapper";
import { IdValueObject } from "@src/bounded-contexts/shared/domain/value-objects/id.value-object";

import type { FindOrderByIdDto } from "./find-order-by-id.dto";
import type { FindOrderByIdResultDto } from "./find-order-by-id-result.dto";
import type { OrderValidatorDomainService } from "../../domain/order-validator.domain-service";
import type { Order } from "../../domain/order.entity";

export class FindOrderById {
  constructor(
    private readonly orderValidatorDomainService: OrderValidatorDomainService
  ) {}

  async execute(dto: FindOrderByIdDto): Promise<FindOrderByIdResultDto> {
    const { id } = dto;

    const order = await this.ensureExistsOrder(id);

    return OrderMapper.toDto(order);
  }

  private async ensureExistsOrder(orderId: string): Promise<Order> {
    const order = await this.orderValidatorDomainService.ensureOrderExists(
      IdValueObject.fromPrimitives(orderId)
    );

    return order;
  }
}
