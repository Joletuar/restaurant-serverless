import { DomainValidationException } from "@src/bounded-contexts/shared/domain/exceptions/domain-validation.exception";

export class InvalidOrderStatusTransitionException extends DomainValidationException {
  constructor(currentStatus: string, newStatus: string) {
    super(
      `The order has the current <${currentStatus}> status, and can't no change to <${newStatus}> status.`
    );
  }
}
