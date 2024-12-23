import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function main() {
  try {
    // Reset database
    console.log("🗑️  Cleaning up database...");
    await execAsync("npx prisma migrate reset --force");

    // Generate Prisma Client
    console.log("🔧 Generating Prisma Client...");
    await execAsync("npx prisma generate");

    // Run migrations
    console.log("🔄 Running migrations...");
    await execAsync("npx prisma migrate dev --name init");

    // Create SUDO user
    console.log("👤 Creating SUDO user...");
    await prisma.user.create({
      data: {
        email: process.env.SUDO_EMAIL || "sudo@example.com",
        password: process.env.SUDO_PASSWORD || "test123",
        firstName: "Super",
        lastName: "Admin",
        role: "SUDO",
      },
    });

    console.log("✅ Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
