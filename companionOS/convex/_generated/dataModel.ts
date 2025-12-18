/**
 * Lightweight data model facade that mirrors Convex codegen output so the
 * backend can type-check without live Convex credentials.
 */
import type {
  DocumentByName,
  TableNamesInDataModel,
} from "convex/server";
import type { GenericId } from "convex/values";

import type schema from "../schema";
import type { CompanionDataModel } from "../schema";

export type DataModel = CompanionDataModel;
export type TableNames = TableNamesInDataModel<DataModel>;
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;
export type Id<TableName extends TableNames> = GenericId<TableName>;
export type Schema = typeof schema;
