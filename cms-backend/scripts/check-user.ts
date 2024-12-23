import { prisma } from "../src/lib/prisma";

async function checkUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (user) {
      console.log("User found");
    } else {
      console.log("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error checking user");
    throw error;
  }
}

export { checkUser };
