import { $R } from '@/core/rquery/rquery.lib'

import { Layout } from '@/components/layout/layout.component'
import { NotFound } from '@/components/screens/not-found/not-found.component'

import { ROUTES } from './routes.data'

export class Router {
	#currentRoute = null
	#layout = null
	constructor() {
		this.#handleRouter() //первый рендер
		window.addEventListener('popstate', () => {
			//слушатель на нажатие кнопки вперед/назад в браузере
			this.#handleRouter() //рендер
		})
		this.#handleLinks() //слушатель который перехватывает ссылки и меняет их дефолтное поведение
	}
	#handleLinks() {
		document.addEventListener('click', event => {
			const target = event.target.closest('a') //возвращает ближайший родительский элемент (или сам элемент)
			if (target) {
				event.preventDefault()
				this.navigate(target.href)
			}
		})
	}
	getCurrentPath() {
		return window.location.pathname
	}
	navigate(path) {
		if (path !== this.getCurrentPath()) {
			window.history.pushState({}, '', path) //меняем текст в адресной строке браузера
			this.#handleRouter()
		}
	}
	#handleRouter() {
		const path = this.getCurrentPath() || '/'
		let route = ROUTES.find(route => route.path === path)
		if (!route) {
			route = {
				path: '404',
				component: NotFound
			}
			window.history.pushState({}, '', route.path) //меняем текст в адресной строке браузера
		}
		this.#currentRoute = route
		this.#render()
	}
	#render() {
		const component = new this.#currentRoute.component({
			router: this
		}).render() //разворачиваем class выполняющий функции компонента и делаем рендер
		if (!this.#layout) {
			//прокидываем в layout router и children и делаем рендер
			this.#layout = new Layout({
				router: this,
				children: component
			}).render()
			$R('#app').append(this.#layout) //добавляем на страницу layout
		} else {
			component && $R('#content').html('').append(component) //если layout уже добавлен то ищем в нём #content и вставляем туда component
		}
	}
}
