import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, phoneNumber } = await req.json(); // Parse email and phone number from the request body

    // Check if at least one of the fields (email or phone number) is provided
    if (!email && !phoneNumber) {
      return NextResponse.json({ error: 'Email or Phone Number is required' }, { status: 400 });
    }

    // Get the Google Apps Script Web App URL from the environment variable
    const scriptUrl = `${process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL}?email=${encodeURIComponent(email || '')}&phoneNumber=${encodeURIComponent(phoneNumber || '')}`;

    // Make a GET request to the Google Apps Script Web App endpoint
    const response = await fetch(scriptUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to verify information' }, { status: 500 });
    }

    const result = await response.text();

    if (result === "Email or Phone Number not found") {
      return NextResponse.json({ error: 'Email or Phone number not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Information verified successfully' }, { status: 200 });

  } catch (error) {
    console.error("Error verifying information:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
