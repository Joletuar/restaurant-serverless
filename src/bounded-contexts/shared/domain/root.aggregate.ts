import type { IdValueObject } from "./value-objects/id.value-object";
import type { NumberValueObject } from "./value-objects/number.value-object";

export type RootAggregatePrimitives = {
  id: string;
};

export abstract class RootAggregate<T> {
  abstract toPrimitives(): T;

  constructor(
    protected id: IdValueObject,
    protected version: NumberValueObject
  ) {}

  getId(): IdValueObject {
    return this.id;
  }

  equals(other: RootAggregate<T>): boolean {
    return this.id.equals(other.id);
  }

  toString(): string {
    return JSON.stringify(this.toPrimitives(), null, 2);
  }
}
