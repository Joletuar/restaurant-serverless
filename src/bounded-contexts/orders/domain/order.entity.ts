import {
  RootAggregate,
  type RootAggregatePrimitives,
} from '@src/bounded-contexts/shared/domain/root.aggregate';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';
import { NumberValueObject } from '@src/bounded-contexts/shared/domain/value-objects/number.value-object';

import { InvalidOrderStatusTransitionException } from './exceptions/invalid-order-status-transition.exception';
import { OrderStatus } from './value-objects/order-status.value-object';

export type OrderPrimitives = RootAggregatePrimitives & {
  recipeId: string;
  status: string;
};

export class Order extends RootAggregate<OrderPrimitives> {
  static fromPrimitives(props: Omit<OrderPrimitives, 'id'>): Order {
    const { recipeId, status } = props;

    return new Order(
      IdValueObject.generateId(),
      IdValueObject.fromPrimitives(recipeId),
      OrderStatus.fromPrimitives(status)
    );
  }

  constructor(
    id: IdValueObject,
    private recipeId: IdValueObject,
    private status: OrderStatus
  ) {
    super(id, NumberValueObject.fromPrimitives(1));
  }

  toPrimitives(): OrderPrimitives {
    return {
      id: this.id.value,
      recipeId: this.recipeId.value,
      status: this.status.value,
    };
  }

  updateStatus(newStatus: OrderStatus): void {
    if (this.status.isCancelled() || this.status.isCompleted()) {
      throw new InvalidOrderStatusTransitionException(
        this.status.value,
        newStatus.value
      );
    }

    if (this.status.isPending()) {
      if (newStatus.isCancelled() || newStatus.isCompleted()) {
        throw new InvalidOrderStatusTransitionException(
          this.status.value,
          newStatus.value
        );
      }
    }

    this.status = newStatus;
  }

  getRecipeIdValue(): string {
    return this.recipeId.value;
  }
}
