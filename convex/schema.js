import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),       // Correct schema validation for strings
    note: v.string(),
    time: v.string(),
    color: v.string(),
    textColor: v.string(),
    email: v.string(),
    pinned: v.optional(v.boolean()), // Added for pinning support
  }),
});