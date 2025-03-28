interface ErrorMessages {
	[table: string]: {
		[field: string]: string;
	};
}

const errorMessages: ErrorMessages = {
	careerOverview: {
		organization: '조직을 입력하세요.',
		position: '직무를 입력하세요.',
		description: '설명을 입력하세요.',
		startDate: '시작 일자를 선택하세요.',
	},
	certifcate: {
		certificateName: '자격증명을 입력하세요.',
		issueDate: '발급기관을 입력하세요.',
		issuingOrganization: '발급일을 선택하세요.',
	},
	contact: {
		type: '타입을 입력하세요.',
		value: '값을 입력하세요.',
		label: '라벨을 입력하세요.',
	},
	education: {
		institutionName: '학교명을 입력하세요.',
		degreeStatus: '학적을 입력하세요.',
		startDate: '입학 일자를 선택하세요.',
		endDate: '졸업 일자를 선택하세요.',
	},
	experience: {
		organization: '조직을 입력하세요.',
		description: '설명을 입력하세요.',
		startDate: '시작 일자를 선택하세요.',
		endDate: '종료 일자를 선택하세요.',
	},
	language: {
		languageName: '언어명을 입력하세요.',
		proficiency: '숙련도를 선택하세요.',
		examDate: '시험일자를 선택하세요.',
		institution: '기관을 입력하세요.',
	},
};

export default errorMessages;
