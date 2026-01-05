import { RootValueObject } from "./root.value-object";

/**
 * StringValueObject is a base class for value objects that represent strings.
 */

export class StringValueObject extends RootValueObject<string> {
  constructor(value: string) {
    super(value.trim());
  }
}
