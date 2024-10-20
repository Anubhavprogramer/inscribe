
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").collect();
  },
});


export const createTask = mutation({
  args: {   // The ID of the note to be created
    title: v.string(),       // Correct schema validation for strings
    note: v.string(),
    time: v.string(),
    color: v.string(),
    textColor: v.string(),
    email: v.string(),
   },
  handler: async (ctx, args) => {
    const notesID = await ctx.db.insert("notes", { 
        title: args.title,
        note: args.note,
        time: args.time,
        color: args.color,
        textColor: args.textColor,
        email: args.email,
    });
    
    // Log the newly created note ID
    // console.log(notesID);
    
    // Return the newly created note's ID
    return { _id: notesID };
  },
});



export const updateNote = mutation({
  args: {
    _id: v.id("notes"),      // The ID of the note to be updated
    title: v.optional(v.string()),  // Optional fields to update
    note: v.optional(v.string()),
    time: v.optional(v.string()),
    color: v.optional(v.string()),
    textColor: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { _id, title, note, time, color, textColor, email } = args;

    // Get the note with the given _id
    const noteData = await ctx.db.get(_id);

    // Check if the note exists
    if (!noteData) {
      throw new Error("Note not found");
    }

    // Patch the note with updated fields
    await ctx.db.patch(_id, { title, note, time, color, textColor, email });

    // Optionally log the updated note
    // console.log("Note updated:", { _id, title, note, time, color, textColor, email });
  }
});
