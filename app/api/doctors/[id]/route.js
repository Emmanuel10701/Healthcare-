import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma';
// GET request: Retrieve a single doctor by email
export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const email = pathname.split('/').pop(); // Extract email from the URL

  if (!email) {
    return new NextResponse(
      JSON.stringify({ message: 'Email is required' }),
      { status: 400 }
    );
  }

  const doctor = await prisma.doctor.findUnique({
    where: { email: String(email) }, // Use email instead of ID
  });

  if (!doctor) {
    return new NextResponse(
      JSON.stringify({ message: 'Doctor not found' }),
      { status: 404 }
    );
  }

  return NextResponse.json(doctor);
}

// PUT request: Update a doctor by ID
export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const body = await req.json();

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  const updatedDoctor = await prisma.doctor.update({
    where: { id: String(id) },
    data: {
      name: body.name,
      email: body.email,
      specialty: body.specialty,
      experience: body.experience,
      fees: String(body.fees),
      education: body.education,
      address1: body.address1,
      address2: body.address2,
      aboutMe: body.aboutMe,
      image: body.image,
    },
  });

  return NextResponse.json(updatedDoctor);
}

// DELETE request: Delete a doctor by ID
export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  await prisma.doctor.delete({
    where: { id: String(id) },
  });

  return new NextResponse(null, { status: 204 });
}

