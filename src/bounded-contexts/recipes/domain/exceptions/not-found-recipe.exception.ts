import { ErrorCode } from "@src/bounded-contexts/shared/domain/error-code.enum";
import { DomainException } from "@src/bounded-contexts/shared/domain/exceptions/domain.exception";

export class NotFoundRecipeException extends DomainException {
  constructor(idOrdName: string | number) {
    super({
      message: `Recipe <${idOrdName}> not found`,
      errorCode: ErrorCode.NOT_FOUND_ENTITY,
    });
  }
}
