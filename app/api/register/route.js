import bcrypt from 'bcryptjs'; 
import prisma from '../../libs/prisma'; // Adjust the import according to your project structure
import { NextResponse } from 'next/server';

// POST request: Register a new user
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Check for missing fields
    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing Fields' }),
        { status: 400 }
      );
    }

    // Set default role
    const userRole = 'USER'; // Default role is 'USER'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: 'Email already exists' }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: userRole, // Use the default role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // Select the role field
        createdAt: true,
        updatedAt: true,
      },
    });

    return new NextResponse(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// GET request: Retrieve all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // Include role in user retrieval
        createdAt: true,
        updatedAt: true,
      },
    });

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
