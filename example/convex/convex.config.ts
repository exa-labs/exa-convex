import { defineApp } from "convex/server";
import { v } from "convex/values";
import exa from "convex-exa/convex.config";

const app = defineApp({
  env: {
    EXA_API_KEY: v.string(),
  },
});

app.use(exa, {
  name: "exa",
  env: {
    EXA_API_KEY: app.env.EXA_API_KEY,
  },
});

export default app;
