import styles from '@/components/layout/notification/notification.module.sass'

import { $R } from '../rquery/rquery.lib'

export class NotificationService {
	#timeout
	constructor() {
		this.#timeout = null
	}
	#setTimeout(callback, ms = 3000) {
		if (!this.#timeout) clearTimeout(this.#timeout)
		this.#timeout = setTimeout(callback, ms)
	}
	show(type, message) {
		if (!['success', 'error'].includes(type))
			throw new Error('Invalid notification type. Use success|error')
		const classNames = {
			success: styles.success,
			error: styles.error
		}
		const notificationElement = $R('#notification')
		const className = classNames[type]
		notificationElement.text(message).addClass(className)
		this.#setTimeout(() => notificationElement.removeClass(className))
	}
}
