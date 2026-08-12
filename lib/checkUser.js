import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return null;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

    // Check if user record already exists by email
    const existingEmailUser = await db.user.findUnique({
      where: { email },
    });

    if (existingEmailUser) {
      return await db.user.update({
        where: { id: existingEmailUser.id },
        data: {
          clerkUserId: user.id,
          name: name || existingEmailUser.name,
          imageUrl: user.imageUrl || existingEmailUser.imageUrl,
        },
      });
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email,
      },
    });

    return newUser;
  } catch (error) {
    console.error("checkUser error:", error?.message || error);
    return null;
  }
};
