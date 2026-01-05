import { ErrorCode } from "../error-code.enum";
import { DomainException } from "./domain.exception";

export class DomainValidationException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.FALIED_DOMAIN_VALIDATION,
    });
  }
}
