import axios from 'axios';

const instance = axios.create({
	headers: {
		'Content-Type': 'application/json',
		withCredentials: true,
	},
});

const formInstance = axios.create({
	headers: {
		'Content-Type': 'multipart/form-data',
		withCredentials: true,
	},
});

export { instance, formInstance };
