"use server"

import { UpdateUserParams } from "@clerk/nextjs/types"
import User from "../database/models/user.model"
import { ConnectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import { revalidatePath } from "next/cache"

// create
export async function createUser(user: CreateUserParams) {
        try {
        await ConnectToDatabase()
        const newUser =await User.create(user);
        return JSON.parse(JSON.stringify(newUser))

        
    } catch (error) {
        handleError(error);
}

}

//read

export async function getUserById(userId:string){
    try {
            await ConnectToDatabase();
            const user = await User.findOne({clerkId:userId})
            if (!user){
                throw new Error("user not found")
            }
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        handleError(error)
    }
}

//update

export async function updateUser(clerkId:string,user:UpdateUserParams){
try {
    await ConnectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

//delete 

export async function deleteUser(clerkId: string){
  try {
    await ConnectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}