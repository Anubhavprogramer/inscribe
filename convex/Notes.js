import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

// Get a single note by ID
export const getById = query({
  args: { _id: v.id("notes") },
  handler: async (ctx, { _id }) => {
    const note = await ctx.db.get(_id);
    if (!note) return null;
    return note;
  },
});

// Get all notes for a user by email
export const getAllByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const notes = await ctx.db.query("notes")
      .filter((q) => q.eq(q.field("email"), email))
      .collect();
    return notes;
  },
});



export const createTask = mutation({
  args: {   // The ID of the note to be created
    title: v.string(),       // Correct schema validation for strings
    storageId: v.optional(v.id("_storage")),
    time: v.string(),
    email: v.string(),
    pinned: v.optional(v.boolean()),
   },
  handler: async (ctx, args) => {
    const notesID = await ctx.db.insert("notes", { 
        title: args.title,
        storageId: args.storageId,
        time: args.time,
        email: args.email,
        pinned: args.pinned,
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
    content: v.optional(v.any()),    // Editor content
    storageId: v.optional(v.id("_storage")),
    time: v.optional(v.string()),
    email: v.optional(v.string()),
    pinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { _id, ...updateFields } = args;

    // Get the note with the given _id
    const noteData = await ctx.db.get(_id);

    // Check if the note exists
    if (!noteData) {
      throw new Error("Note not found");
    }

    // Create an object with only the fields that are defined
    const fieldsToUpdate = {};
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] !== undefined) {
        fieldsToUpdate[key] = updateFields[key];
      }
    });

    // Only patch if there are fields to update
    if (Object.keys(fieldsToUpdate).length > 0) {
      await ctx.db.patch(_id, fieldsToUpdate);
    }

    // Optionally log the updated note
    // console.log("Note updated:", { _id, fieldsToUpdate });
  }
});


export const deleteNote = mutation({
  args: {
    _id: v.id("notes"), // Expecting the ID of the note to delete
  },
  handler: async (ctx, args) => {
    const { _id } = args;

    // Check if the note exists
    const noteData = await ctx.db.get(_id);
    if (!noteData) {
      throw new Error("Note not found");
    }

    // Delete the note from the database
    await ctx.db.delete(_id);
  },
});


export const getNoteContent = query({
  args: { _id: v.id("notes") },
  handler: async (ctx, args) => {
    try {
      const note = await ctx.db.get(args._id);
      
      if (!note) {
        return null;
      }
      
      // Return content directly from the database
      if (note.content) {
        return note.content;
      }
      
      // Return empty editor content for new notes
      return {
        time: Date.now(),
        blocks: [],
        version: "2.28.2"
      };
    } catch (error) {
      console.error("Error fetching note content:", error);
      // Return empty content on error
      return {
        time: Date.now(),
        blocks: [],
        version: "2.28.2"
      };
    }
  },
});
