import { ErrorCode } from "@src/bounded-contexts/shared/domain/error-code.enum";
import { DomainException } from "@src/bounded-contexts/shared/domain/exceptions/domain.exception";

export class NotFoundIngredientException extends DomainException {
  constructor(idOrName: string | number) {
    super({
      message: `Ingredient <${idOrName}> not found.`,
      errorCode: ErrorCode.NOT_FOUND_ENTITY,
    });
  }
}
