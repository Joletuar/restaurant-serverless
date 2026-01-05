import { Order } from "@src/bounded-contexts/orders/domain/order.entity";
import type { OrderRepository } from "@src/bounded-contexts/orders/domain/order.repository";
import { IdValueObject } from "@src/bounded-contexts/shared/domain/value-objects/id.value-object";
import { RecipeValidatorDomainService } from "@src/bounded-contexts/recipes/domain/recipe-validator.domain-service";

import { CreateOrderDto } from "./create-order.dto";

export class CreateOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly recipeValidatorDomainService: RecipeValidatorDomainService
  ) {}

  async execute(dto: CreateOrderDto): Promise<void> {
    await this.ensureIsValidRecipe(dto.recipeId);

    const order = Order.fromPrimitives({
      recipeId: dto.recipeId,
      status: dto.status,
    });

    await this.orderRepository.create(order);
  }

  private async ensureIsValidRecipe(recipeId: string): Promise<void> {
    await this.recipeValidatorDomainService.ensureRecipeExists(
      IdValueObject.fromPrimitives(recipeId)
    );
  }
}
