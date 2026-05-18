/* eslint-disable */
import type {
  ActionBuilder,
  GenericActionCtx,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

export declare const action: ActionBuilder<DataModel, "public">;
export type ActionCtx = GenericActionCtx<DataModel>;
