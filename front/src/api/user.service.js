import { raxios } from '@/core/raxios/raxios.lib'

export class UserService {
	#BASE_URL = '/users'
	getAll(searchTerm, onSuccess) {
		return raxios({
			path: `${this.#BASE_URL}${
				searchTerm
					? `?${new URLSearchParams({
							searchTerm
					  })}`
					: ''
			}`,
			onSuccess
		})
	}
}
