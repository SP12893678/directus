import { AxiosInstance } from 'axios';
import { PrimaryKey } from '../types';

export class UtilsHandler {
	private axios: AxiosInstance;

	constructor(axios: AxiosInstance) {
		this.axios = axios;
	}

	random = {
		string: async (length: number = 32) => {
			const result = await this.axios.get('/utils/random/string', { params: { length } });
			return result.data;
		},
	};

	hash = {
		generate: async (string: string) => {
			const result = await this.axios.post('/utils/hash/generate', { string });
			return result.data;
		},
		verify: async (string: string, hash: string) => {
			const result = await this.axios.post('/utils/hash/generate', { string, hash });
			return result.data;
		},
	};

	async sort(collection: string, item: PrimaryKey, to: PrimaryKey) {
		await this.axios.post(`/utils/sort/${collection}`, { item, to });
	}

	async revert(revision: PrimaryKey) {
		await this.axios.post(`/utils/revert/${revision}`);
	}
}
