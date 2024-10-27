import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../libs/prisma'; // Adjust the import according to your project structure

// Handle POST request to create a new doctor
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      specialty,
      experience,
      fees,
      education,
      address1,
      address2,
      aboutMe,
      image,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return new NextResponse(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400 }
      );
    }

    // Check if the user exists by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Check if the email is already in use by another doctor
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (existingDoctor) {
      return new NextResponse(
        JSON.stringify({ error: 'Doctor with this email already exists' }),
        { status: 400 }
      );
    }

    // Create the new doctor entry
    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        email,
        specialty,
        experience,
        fees: String(fees), // Use the string representation of fees
        education,
        address1,
        address2,
        aboutMe,
        image,
        user: { connect: { email } }, // Establish relationship with User by email
      },
    });

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error creating doctor', details: error.message }),
      { status: 500 }
    );
  }
}

// Handle GET request to retrieve doctors
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a single doctor by ID
      const doctor = await prisma.doctor.findUnique({
        where: { id },
        include: { user: true }, // Include user data if needed
      });

      if (!doctor) {
        return new NextResponse(
          JSON.stringify({ error: 'Doctor not found' }),
          { status: 404 }
        );
      }

      return NextResponse.json(doctor);
    } else {
      // Fetch all doctors
      const doctors = await prisma.doctor.findMany({
        include: { user: true }, // Include user data if needed
      });
      return NextResponse.json(doctors);
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching doctors', details: error.message }),
      { status: 500 }
    );
  }
}
