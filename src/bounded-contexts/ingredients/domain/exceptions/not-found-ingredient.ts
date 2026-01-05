import { NotFoundException } from '@src/bounded-contexts/shared/domain/exceptions/not-found.exception';

export class NotFoundIngredientException extends NotFoundException {
  constructor(idOrName: string | number) {
    super(`Ingredient <${idOrName}> not found`);
  }
}
