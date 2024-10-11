import { mutation, query } from "./_generated/server";

export const userAdd = mutation(({db},userId,userName)=>{
    db.insert("user",{
        email: userId,
        name: userName,
    })
})

export const getUser = query(({db},userId)=>{
    return db.query("user")
        .filter((q)=>q.eq(q.field("email"),userId))
        .collect()
})