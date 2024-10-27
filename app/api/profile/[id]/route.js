import prisma from '../../../../../app/libs/prisma'; // Adjust the import according to your project structure
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop();

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: String(id) },
      select: {
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        gender: true,
        address: true,
        aboutMe: true,
        image: true,
      },
    });

    if (!patient) {
      return new NextResponse(
        JSON.stringify({ message: 'Patient not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop();
  const body = await req.json();

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    const birthDate = body.birthDate ? new Date(body.birthDate).toISOString() : undefined;

    const updatedPatient = await prisma.patient.update({
      where: { id: String(id) },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        birthDate,
        gender: body.gender,
        address: body.address,
        aboutMe: body.aboutMe,
        image: body.image,
      },
      select: {
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        gender: true,
        address: true,
        aboutMe: true,
        image: true,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop();

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    await prisma.patient.delete({
      where: { id: String(id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
