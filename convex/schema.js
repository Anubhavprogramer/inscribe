import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    email: v.string(),
    name: v.string(),
  }),
    notes: defineTable({
        userId: v.string(),
        content: v.string(),
        createdAt: v.number(),
    }),
});