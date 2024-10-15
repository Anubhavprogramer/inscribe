
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
    // do something with `taskId`
    // console.log(notesID);
  },
});



export const updateNote = mutation({
  args: { 
    id: v.id("notes"),      // The ID of the note to be updated
    title: v.optional(v.string()),  // Optional fields to update (string)
    note: v.optional(v.string()),
    time: v.optional(v.string()),
    color: v.optional(v.string()),
    textColor: v.optional(v.string()),
    email: v.optional(v.string()),
   },
  handler: async (ctx, args) => {
    const {id, title, note, time, color, textColor, email} = args;
    // console.log(await ctx.db.get(args));
    // { text: "foo", status: { done: true }, _id: ... }
    // Update the note with the given `id`:
    await ctx.db.patch(id, { title, note, time, color, textColor, email });
    // console.log(await ctx.db.get(id));
    // { text: "bar", status: { done: true }, _id: ... }
    // Ensure you're passing the id as a string
    const noteData = await ctx.db.get(id);
    if (!noteData) {
      throw new Error("Note not found");
    }

    // Patch the note with updated fields
    await ctx.db.patch(id, { title, note, color, textColor, time });
    // console.log("Note updated:", { id, title, note, color, textColor, time });
  }
});