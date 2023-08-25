import { raxios } from '@/core/raxios/raxios.lib'

export class StatisticService {
	#BASE_URL = '/statistics'

	main(onSuccess) {
		return raxios({
			path: this.#BASE_URL,
			onSuccess
		})
	}
}
