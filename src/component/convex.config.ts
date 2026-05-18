import { defineComponent } from "convex/server";
import { v } from "convex/values";

export default defineComponent("exa", {
  env: {
    EXA_API_KEY: v.string(),
  },
});
