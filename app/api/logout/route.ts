import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
	const cookieStore = await cookies();
	try {
		cookieStore.delete('access-token');
		cookieStore.delete('refresh-token');
		cookieStore.delete('is-admin');
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
