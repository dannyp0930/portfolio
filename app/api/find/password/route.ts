import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '@/lib/utils/auth';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASSWORD,
	},
});

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();
		if (!email) {
			return NextResponse.json(
				{ error: '이메일을 입력해주세요' },
				{ status: 400 }
			);
		}
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json(
				{ error: '해당 이메일로 가입된 사용자가 없습니다' },
				{ status: 404 }
			);
		}
		const mailCount = await prisma.mailLog.count({
			where: {
				createdAt: {
					gte: new Date(new Date().setHours(0, 0, 0, 0)),
				},
			},
		});
		if (mailCount >= 400) {
			return NextResponse.json(
				{ error: 'Daily email sending limit exceeded.' },
				{ status: 429 }
			);
		}
		const tempPassword = generateRandomPassword(12);
		const hashPassword = await bcrypt.hash(tempPassword, 10);
		await prisma.user.update({
			where: { email },
			data: { password: hashPassword },
		});
		const mailOptions = {
			from: process.env.GMAIL_USER,
			to: email,
			subject: '임시 비밀번호 발급 안내',
			html: `
        <p>안녕하세요,</p>
        <p>요청하신 임시 비밀번호가 발급되었습니다:</p>
        <p><strong>${tempPassword}</strong></p>
        <p>로그인 후 반드시 비밀번호를 변경해주세요.</p>
        <p>감사합니다.</p>
      `,
		};
		await transporter.sendMail(mailOptions);
		return NextResponse.json(
			{ message: '임시 비밀번호가 이메일로 발송되었습니다' },
			{ status: 200 }
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ error: 'Something went wrong', details: err },
			{ status: 500 }
		);
	}
}
