import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import axios from 'axios';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASSWORD,
	},
});

export async function POST(req: NextRequest) {
	const { to, subject, text, html, filename, path } = await req.json();
	const recipients = Array.isArray(to) ? to : [to];
	const mailCount = await prisma.mailLog.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setHours(0, 0, 0, 0)),
			},
		},
	});
	if (mailCount + recipients.length >= 400) {
		return NextResponse.json(
			{ error: 'Daily email sending limit exceeded.' },
			{ status: 429 }
		);
	}
	try {
		const response = await axios.get(path, { responseType: 'arraybuffer' });
		for (const recipient of recipients) {
			const mailOptions = {
				from: process.env.GMAIL_USER,
				to: recipient,
				subject,
				text,
				html,
				attachments:
					filename && path
						? [
								{
									filename,
									content: Buffer.from(response.data),
								},
							]
						: [],
			};
			await transporter.sendMail(mailOptions);
			await prisma.mailLog.create({
				data: {
					to: recipient,
				},
			});
		}
		return NextResponse.json(
			{ message: 'Email sent successfully.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ error: 'Failed to send email.', details: err },
			{ status: 500 }
		);
	}
}
