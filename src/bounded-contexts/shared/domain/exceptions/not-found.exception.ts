import { ErrorCode } from '../error-code.enum';
import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.NOT_FOUND_ENTITY,
    });
  }
}
