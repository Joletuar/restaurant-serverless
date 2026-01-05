import { NotFoundException } from '@src/bounded-contexts/shared/domain/exceptions/not-found.exception';

export class NotFoundOrderException extends NotFoundException {
  constructor(idOrdName: string | number) {
    super(`Order <${idOrdName}> not found`);
  }
}
