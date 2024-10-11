import { mutation } from "./_generated/server";

export const addNote = mutation(async ({ db }, { userId, title, content }) => {
  const createdAt = Date.now();
  
  // Insert the note into the notes table
  await db.insert("notes", {
    userId,    // Associate the note with the user's ID
    content,   // Content of the note
    createdAt, // Timestamp for when the note was created
  });
  
  // Return some confirmation or the created note
  return { userId, content, createdAt };
});
