import { NotFoundException } from '@src/bounded-contexts/shared/domain/exceptions/not-found.exception';

export class NotFoundRecipeException extends NotFoundException {
  constructor(idOrdName: string | number) {
    super(`Recipe <${idOrdName}> not found`);
  }
}
