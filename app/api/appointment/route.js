import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../libs/prisma'; // Adjust the import according to your project structure

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      patientName,
      doctorEmail,
      date,
      time,
      fee,
    } = body;

    // Validate required fields
    if (!patientName || !doctorEmail || !date || !time || fee === undefined) {
      return new NextResponse(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Create the new schedule entry
    const newSchedule = await prisma.schedules.create({
      data: {
        patientName,
        doctorEmail,
        date: new Date(date), // Convert to Date object
        time,
        fee,
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error creating schedule', details: error.message }),
      { status: 500 }
    );
  }
}

// Handle GET requests to fetch all schedules
export async function GET(req) {
  try {
    const schedules = await prisma.schedules.findMany();

    if (schedules.length === 0) {
      return NextResponse.json({ message: 'No schedules found' }, { status: 404 });
    }

    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
