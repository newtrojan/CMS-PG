import { prisma } from "../src/db";

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "sudo@example.com" },
      select: {
        id: true,
        email: true,
        role: true,
        password: true, // Include this to verify password exists
      },
    });

    console.log("User details:", {
      ...user,
      hasPassword: !!user?.password,
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
