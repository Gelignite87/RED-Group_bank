import { raxios } from '@/core/raxios/raxios.lib'
import { NotificationService } from '@/core/services/notification.service'
import { Store } from '@/core/store/store'

class AuthService {
	#BASE_URL = '/auth'
	constructor() {
		this.store = Store.getInstance()
		this.notificationService = new NotificationService()
	}
	main(type, body) {
		return raxios({
			path: `${this.#BASE_URL}/${type}`,
			method: 'POST',
			body,
			onSuccess: data => {
				this.store.login(data.user, data.accessToken)
				this.notificationService.show('success', 'Success logged in!')
			}
		})
	}
}
export const authService = new AuthService()
