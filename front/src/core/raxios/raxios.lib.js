import { NotificationService } from '../services/notification.service'
import { StorageService } from '../services/storage.service'

import { extractErrorMessage } from './extract-error-message'

/**
 * raxios библиотека для работы с API
 * @param {Object} options
 * @param {string} options.path - путь к API
 * @param {('GET' | 'POST' | 'PUT' |'PATCH' | 'DELETE')} [options.method='GET'] - HTTP метод
 * @param {Object} [options.body=null] - тела запроса
 * @param {Object} [options.headers={}] - headers
 * @param {Function} [options.onSuccess=null] - функция, которая будет вызвана при успешном запросе
 * @param {Function} [options.onError=null] - функция, которая будет вызвана при ошибке
 * @returns {Promise<isLoading:boolean,error:string|null,data:any|null>} - объект содержит состояние загрузки, ошибку и данные ответа
 */
export async function raxios({
	path,
	method = 'GET',
	body = null,
	headers = {},
	onError = null,
	onSuccess = null
}) {
	let isLoading = true
	let error = null
	let data = null
	const url = `${process.env.SERVER_URL}/api${path}`
	const accessToken = new StorageService().getItem('accessToken')
	const requestOptions = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers
		}
	}
	if (accessToken) {
		requestOptions.headers.Authorization = `Bearer ${accessToken}`
	}
	if (body) {
		requestOptions.body = JSON.stringify(body)
	}
	try {
		const response = await fetch(url, requestOptions)
		if (response.ok) {
			data = await response.json()
			onSuccess && onSuccess(data)
		} else {
			const errorMessage = extractErrorMessage(await response.json())
			onError && onError(errorMessage)
			new NotificationService().show('error', errorMessage)
		}
	} catch (error) {
		const errorMessage = extractErrorMessage(error)
		onError && onError(errorMessage)
		new NotificationService().show('error', errorMessage)
	} finally {
		isLoading = false
	}
	return { isLoading, error, data }
}
