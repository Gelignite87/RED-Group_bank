import { StorageService } from '../services/storage.service'

/**
 * Singleton pattern store
 */
export class Store {
	constructor() {
		this.observers = []
		this.storageService = new StorageService()
		const savedUser = this.storageService.getItem('user')
		const state = savedUser ? { user: savedUser } : { user: null }
		this.state = new Proxy(state, {
			//отслеживаем событие записи и вызываем this.notify()
			set: (target, prop, value) => {
				target[prop] = value //если не прописать эту строчку то к моменту вызова this.notify() this.state будет пустым
				this.notify()
				return true
			}
		})
	}
	/**
	 * Get the singleton instance of the Store.
	 * @returns {Store.instance}
	 */
	static getInstance() {
		//статичный метод можно вызвать без создания инстанса (Store.getInstance())
		if (!this.instance) this.instance = new Store()
		return Store.instance
	}
	addObserver(observer) {
		this.observers.push(observer)
	}
	removeObserver(observer) {
		this.observers = this.observers.filter(o => o !== observer)
	}
	notify() {
		this.observers.forEach(observer => observer.update())
	}
	async login(user, accessToken) {
		this.storageService.setItem('user', user)
		this.storageService.setItem('accessToken', accessToken)
		// Ниже представлена реализация для асинхронной операции
		// await new Promise((resolve, reject) => {
		// 	this.storageService.setItem('accessToken', accessToken)
		// 	const data = this.storageService.getItem('accessToken')
		// 	data
		// 		? resolve(data)
		// 		: reject(console.error('Ошибка работы с LocalStorage'))
		// })
		this.state.user = user
	}
	logout() {
		this.state.user = null
		this.storageService.removeItem('user')
		this.storageService.removeItem('accessToken')
	}
	updateCard(card) {
		const oldUser = this.state.user
		const newUser = { ...oldUser, card }
		this.state.user = newUser
		this.storageService.setItem('user', newUser)
	}
}
