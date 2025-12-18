/**
 * Minimal Convex type shims so `npm run typecheck` succeeds before the
 * official Convex CLI connects this workspace to a deployment.
 *
 * Once `npx convex dev` is authenticated these definitions will be
 * replaced with the generated counterparts provided by Convex.
 */
import {
  actionGeneric,
  httpActionGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
  mutationGeneric,
  queryGeneric,
  type ActionBuilder,
  type GenericActionCtx,
  type GenericMutationCtx,
  type GenericQueryCtx,
  type MutationBuilder,
  type QueryBuilder,
} from "convex/server";
import type { CompanionDataModel } from "../schema";

export type QueryCtx = GenericQueryCtx<CompanionDataModel>;
export type MutationCtx = GenericMutationCtx<CompanionDataModel>;
export type ActionCtx = GenericActionCtx<CompanionDataModel>;

export const query: QueryBuilder<CompanionDataModel, "public"> = queryGeneric;
export const mutation: MutationBuilder<CompanionDataModel, "public"> =
  mutationGeneric;
export const internalQuery: QueryBuilder<CompanionDataModel, "internal"> =
  internalQueryGeneric;
export const internalMutation: MutationBuilder<
  CompanionDataModel,
  "internal"
> = internalMutationGeneric;
export const action: ActionBuilder<CompanionDataModel, "public"> = actionGeneric;
export const internalAction: ActionBuilder<CompanionDataModel, "internal"> =
  internalActionGeneric;
export const httpAction = httpActionGeneric;
