import {
  RootAggregate,
  type RootAggregatePrimitives,
} from "@src/bounded-contexts/shared/domain/root.aggregate";
import { IdValueObject } from "@src/bounded-contexts/shared/domain/value-objects/id.value-object";
import { NumberValueObject } from "@src/bounded-contexts/shared/domain/value-objects/number.value-object";

import { IngredientsIds } from "./value-objects/ingredients-ids.value-object";

export type RecipePrimitives = RootAggregatePrimitives & {
  ingredientsIds: string[];
};

export class Recipe extends RootAggregate<RecipePrimitives> {
  static fromPrimitives(props: Omit<RecipePrimitives, "id">): Recipe {
    const { ingredientsIds } = props;

    return new Recipe(
      IdValueObject.generateId(),
      IngredientsIds.fromPrimitives(ingredientsIds)
    );
  }

  constructor(id: IdValueObject, private ingredientsIds: IngredientsIds) {
    super(id, new NumberValueObject(1));
  }

  toPrimitives(): RecipePrimitives {
    return {
      id: this.id.value,
      ingredientsIds: this.ingredientsIds.getIds(),
    };
  }
}
