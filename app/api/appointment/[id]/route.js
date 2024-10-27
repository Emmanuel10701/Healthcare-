import { NextResponse } from 'next/server';
import prisma from '../../../../app/libs/prisma'; // Adjust the import according to your project structure

// GET request: Retrieve a schedule by doctor's email or patient's name
export async function GET(req) {
  const { pathname } = req.nextUrl;
  const searchTerm = pathname.split('/').pop().trim(); // Extract the search term from the URL and trim whitespace

  if (!searchTerm) {
    return new NextResponse(
      JSON.stringify({ message: 'Search term is required' }),
      { status: 400 }
    );
  }

  try {
    const schedule = await prisma.schedules.findFirst({
      where: {
        OR: [
          { doctorEmail: searchTerm }, // Match by doctor's email
          { patientName: { contains: searchTerm, mode: 'insensitive' } }, // Match by patient's name, case insensitive
        ],
      },
    });

    if (!schedule) {
      return new NextResponse(
        JSON.stringify({ message: 'Schedule not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(schedule, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// PUT request: Update a schedule by ID
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

  try {
    const updatedSchedule = await prisma.schedules.update({
      where: { id: String(id) }, // Convert ID to string
      data: {
        patientName: body.patientName,
        doctorEmail: body.doctorEmail,
        date: new Date(body.date), // Assuming this is a valid date string
        time: body.time,
        fee: Number(body.fee), // Ensure fee is a number
      },
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Schedule update failed.', details: error.message }),
      { status: 500 }
    );
  }
}

// DELETE request: Delete a schedule by ID
export async function DELETE(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    await prisma.schedules.delete({
      where: { id: String(id) }, // Convert ID to string
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Schedule deletion failed.', details: error.message }),
      { status: 500 }
    );
  }
}
