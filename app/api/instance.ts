import axios from 'axios';
import https from 'https';

const commonConfig = {
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
};

const httpsAgent =
	process.env.NODE_ENV === 'development'
		? new https.Agent({ rejectUnauthorized: false })
		: undefined;

const instance = axios.create({
	baseURL: '/api',
	...commonConfig,
	httpsAgent,
});

const serverInstance = axios.create({
	baseURL: process.env.API_URL + '/api',
	...commonConfig,
	httpsAgent,
});

const formInstance = axios.create({
	baseURL: '/api',
	headers: {
		'Content-Type': 'multipart/form-data',
	},
	withCredentials: true,
});

export { instance, serverInstance, formInstance };
