import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../app/libs/prisma'; // Adjust the import according to your project structure

// GET request: Retrieve a single appointment by ID
export async function GET(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  const appointment = await prisma.appts.findUnique({
    where: { id: String(id) }, // Convert ID to string
  });

  if (!appointment) {
    return new NextResponse(
      JSON.stringify({ message: 'Appointment not found' }),
      { status: 404 }
    );
  }

  return NextResponse.json(appointment);
}

// PUT request: Update an appointment by ID
export async function PUT(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const body = await req.json();

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  const updatedAppointment = await prisma.appts.update({
    where: { id: String(id) }, // Convert ID to string
    data: {
      patientName: body.patientName, // Updated field
      doctorEmail: body.doctorEmail,
      date: new Date(body.date), // Assuming this is a valid date string
      time: body.time,
      fee: Number(body.fee), // Ensure fee is a number
    },
  });

  return NextResponse.json(updatedAppointment);
}

// DELETE request: Delete an appointment by ID
export async function DELETE(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  await prisma.appts.delete({
    where: { id: String(id) }, // Convert ID to string
  });

  return new NextResponse(null, { status: 204 });
}
