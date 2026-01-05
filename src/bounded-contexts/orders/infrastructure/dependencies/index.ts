import { recipeValidatorDomainService } from '@src/bounded-contexts/recipes/infrastructure/dependencies';

import { CreateOrder } from '../../application/create-order/create-order.use-case';
import { FindOrderById } from '../../application/find-order-by-id/find-order-by-id.use-case';
import { GetAllOrders } from '../../application/get-all-orders/get-all-orders.use-case';
import { UpdateOrderStatusById } from '../../application/update-order-status-by-id/update-order-status-by-id.use-case';
import { OrderValidatorDomainService } from '../../domain/order-validator.domain-service';
import type { OrderRepository } from '../../domain/order.repository';

const repo = {} as OrderRepository;

export const orderValidatorDomainService = new OrderValidatorDomainService(
  repo
);

export const updateOrderStatusByIdUseCase = new UpdateOrderStatusById(
  repo,
  orderValidatorDomainService
);

export const createOrderUseCase = new CreateOrder(
  repo,
  recipeValidatorDomainService
);

export const findOrderByIdUseCase = new FindOrderById(
  orderValidatorDomainService
);

export const getAllOrdersUseCase = new GetAllOrders(repo);
