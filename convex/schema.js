import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),       // Correct schema validation for strings
    content: v.optional(v.any()), // Store editor content directly
    storageId: v.optional(v.id("_storage")), // Keep for backward compatibility
    time: v.string(),
    email: v.string(),
    pinned: v.optional(v.boolean()), // Added for pinning support
    isPublic: v.optional(v.boolean()), // Added for shareable public notes
  }),
});