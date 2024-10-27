import { NextResponse } from 'next/server';
import prisma from '../../../app/libs/prisma'; // Adjust the import according to your project structure

// Handle POST request to create a new schedule
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Request Body:', body); // Log incoming request body

    const { patientName, doctorEmail, date, time, fee } = body;

    // Validate required fields
    if (!patientName || !doctorEmail || !date || !time || !fee) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) { // Use getTime() to check validity
      return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 });
    }

    // Create the new schedule entry
    const newSchedule = await prisma.schedules.create({
      data: {
        patientName,
        doctorEmail,
        date: parsedDate, // Use the parsedDate variable
        time,
        fee: parseFloat(fee), // Ensure fee is a float
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Schedule creation failed.', details: error.message }, { status: 500 });
  }
}

// Handle GET request to retrieve all schedules
export async function GET(req) {
  try {
    const schedules = await prisma.schedules.findMany(); // Fetch all schedules

    if (schedules.length === 0) {
      return NextResponse.json(
        { message: 'No schedules found' },
        { status: 404 }
      );
    }

    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
