import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../libs/prisma';

export async function POST(req) {
  try {
    const { name, email, phone, birthDate, gender, address, aboutMe, image } = await req.json();

    // Validate required fields
    if (!name || !email) {
      return new NextResponse(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400 }
      );
    }

    // Create the new patient entry
    const newPatient = await prisma.patient.create({
      data: {
        name,
        email,
        phone: phone || null, // Use null if phone is undefined
        birthDate: new Date(birthDate), // Ensure birthDate is a Date object
        gender,
        address,
        aboutMe,
        image,
      },
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error creating patient', details: error.message }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const patients = await prisma.patient.findMany();
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching patients', details: error.message }),
      { status: 500 }
    );
  }
}
