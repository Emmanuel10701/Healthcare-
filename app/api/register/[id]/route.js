import bcrypt from 'bcryptjs';
import prisma from '../../../../libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Handle GET, PUT, and DELETE requests for a single user
export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Fetch a single user by ID
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();
    const { name, email, role } = body;

    // Check for required fields
    if (!name && !email && !role) {
      return new NextResponse(
        JSON.stringify({ message: 'No fields to update' }),
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Delete user by ID
    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify({ message: 'User deleted successfully' }),
      { status: 204 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
