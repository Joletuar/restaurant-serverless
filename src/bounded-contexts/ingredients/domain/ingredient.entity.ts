import {
  RootAggregate,
  type RootAggregatePrimitives,
} from "@src/bounded-contexts/shared/domain/root.aggregate";
import { IdValueObject } from "@src/bounded-contexts/shared/domain/value-objects/id.value-object";
import { NumberValueObject } from "@src/bounded-contexts/shared/domain/value-objects/number.value-object";
import { StringValueObject } from "@src/bounded-contexts/shared/domain/value-objects/string.value-object";

export type IngredientPrimivites = RootAggregatePrimitives & {
  name: string;
};

export class Ingredient extends RootAggregate<IngredientPrimivites> {
  static fromPrimitives(props: Omit<IngredientPrimivites, "id">): Ingredient {
    const { name } = props;

    return new Ingredient(
      IdValueObject.generateId(),
      new StringValueObject(name)
    );
  }

  constructor(id: IdValueObject, private readonly name: StringValueObject) {
    super(id, new NumberValueObject(1));
  }

  toPrimitives(): IngredientPrimivites {
    return {
      id: this.id.value,
      name: this.name.value,
    };
  }
}
