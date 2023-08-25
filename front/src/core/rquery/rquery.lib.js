import { formatCardNumberWithDashes } from '@/utils/format/format-card-number'

/**
 * Класс RQuery для работы с DOM элементами
 */
class RQuery {
	/**
	 * Создание нового инстанса RQuery
	 * @param {string|HTMLElement} selector - CSS selector or HTMLElement
	 */
	constructor(selector) {
		if (typeof selector === 'string') {
			this.element = document.querySelector(selector)
			if (!this.element) {
				throw new Error(`Элемент c селектором: ${selector} не найден`)
			}
		} else if (selector instanceof HTMLElement) {
			this.element = selector
		} else {
			throw new Error(`Селектор: ${selector} не является HTMLElement`)
		}
	}
	/**
	 * Находим первый элемент, соответствующий селектору
	 * @param {string} selector - CSS selector
	 * @returns {RQuery}
	 */
	find(selector) {
		if (this.element.querySelector(selector)) {
			return new RQuery(this.element.querySelector(selector))
		} else {
			throw new Error(`HTMLElement c cелектором: ${selector} не найден`)
		}
	}
	/**
	 * Находим все элементы, соответствующие селектору
	 * @param {string} selector - CSS selector
	 * @returns {RQuery[]}
	 */
	findAll(selector) {
		const elements = this.element.querySelectorAll(selector)
		if (elements) {
			return Array.from(elements).map(element => new RQuery(element))
		} else {
			throw new Error(`HTMLElements c cелектором: ${selector} не найдены`)
		}
	}
	/**
	 * Добавляем дочерний элемент
	 * @param {HTMLElement} childElement
	 * @returns {RQuery}
	 */
	append(childElement) {
		this.element.appendChild(childElement)
		return this
	}
	/**
	 * Вставка элемента перед текущим элементом
	 * @param {HTMLElement} newElement
	 * @returns {RQuery}
	 */
	before(newElement) {
		if (!(newElement instanceof HTMLElement)) {
			throw new Error('Element must be an HTMLElement')
		}
		this.element.insertBefore(newElement, this.element.firstChild)
		return this
	}
	/**
	 * Get or Set innerHTML у элемента
	 * @param {string} [htmlContent] - htmlContent
	 * @returns {RQuery|string}
	 */
	html(htmlContent) {
		if (typeof htmlContent === 'undefined') {
			return this.element.innerHTML
		} else this.element.innerHTML = htmlContent
		return this
	}
	/**
	 * Get or Set textContent у элемента
	 * @param {string} [textContent] - textContent
	 * @returns {RQuery|string}
	 */
	text(textContent) {
		if (typeof textContent === 'undefined') {
			return this.element.textContent
		} else this.element.textContent = textContent
		return this
	}
	/**
	 * Добавить слушатель события
	 * @param {string} eventType - тип события
	 * @param {function(Event):void} callback - функция, которая сработает при клике
	 * @returns {RQuery}
	 */
	on(eventType, callback) {
		if (typeof eventType !== 'string' || typeof callback !== 'function') {
			throw new Error('EventType and callback must be string and function')
		}
		this.element.addEventListener(eventType, callback)
		return this
	}
	/**
	 * Событие клика
	 * @param {function(Event):void} callback - функция, которая сработает при клике
	 * @returns {RQuery}
	 */
	click(callback) {
		this.element.addEventListener('click', callback)
		return this
	}
	/**
	 * Событие submit
	 * @param {function(Event):void} onSubmit - функция, которая сработает при клике
	 * @returns {RQuery}
	 */
	submit(onSubmit) {
		if (this.element.tagName.toLowerCase() !== 'form')
			throw new Error('element must be form')
		this.element.addEventListener('submit', e => {
			e.preventDefault()
			onSubmit(e)
		})
		return this
	}
	/**
	 * Добавление аттрибутов и слушателей событий для input
	 * @param {Object} options - объект содержащий опции для input
	 * @param {function(Event):void} [options.onInput] - событие добавления в input
	 * @param {Object} [options.rest] - иные опции
	 * @returns {RQuery}
	 */
	input({ onInput, ...rest }) {
		if (this.element.tagName.toLowerCase() !== 'input')
			throw new Error('element must be input')
		for (const key in rest) this.element.setAttribute(key, rest[key])
		if (onInput) this.element.addEventListener('input', onInput)
		return this
	}
	/**
	 * Get or set value of an input element
	 * @param {string} [newValue] new value
	 * @return {string|RQuery}
	 */
	value(newValue) {
		if (typeof newValue === 'undefined') {
			return this.element.value
		} else {
			this.element.value = newValue
			return this
		}
	}
	/**
	 * Добавление аттрибутов и слушателей событий для input с числами
	 * @param {number} limit - максимальное значение
	 * @returns {RQuery}
	 */
	numberInput(limit) {
		if (
			this.element.tagName.toLowerCase() !== 'input' ||
			this.element.type !== 'number'
		)
			throw new Error('element must be input with number')
		this.element.addEventListener('input', e => {
			let value = e.target.value.replace(/[^0-9]/g, '')
			if (limit) value = value.substring(0, limit)
			e.target.value = value
		})
		return this
	}
	/**
	 * Добавление аттрибутов и слушателей событий для input кредитной карты
	 * @returns {RQuery}
	 */
	creditCardInput() {
		const limit = 16
		if (
			this.element.tagName.toLowerCase() !== 'input' ||
			this.element.type !== 'text'
		)
			throw new Error('element must be input with text')
		this.element.addEventListener('input', e => {
			let value = e.target.value.replace(/[^0-9]/g, '')
			if (limit) value = value.substring(0, limit)
			e.target.value = formatCardNumberWithDashes(value)
		})
		return this
	}
	show() {
		this.element.style.removeProperty('display')
		return this
	}
	hide() {
		this.element.style.display = 'none'
		return this
	}
	/**
	 * Меняем стили
	 * @param {string} property - CSS property
	 * @param {string} value
	 * @returns {RQuery}
	 */
	css(property, value) {
		if (typeof property !== 'string' && typeof value !== 'string') {
			throw new Error('property and value must be string')
		}
		this.element.style[property] = value
		return this
	}
	/**
	 * Добавление классов
	 * @param {string|string[]} classNames - имя класса
	 * @returns {RQuery}
	 */
	addClass(classNames) {
		if (Array.isArray(classNames)) {
			classNames.forEach(className => this.element.classList.add(className))
		} else this.element.classList.add(classNames)
		return this
	}
	/**
	 * Удаление классов
	 * @param {string|string[]} classNames - имя класса
	 * @returns {RQuery}
	 */
	removeClass(classNames) {
		if (Array.isArray(classNames)) {
			classNames.forEach(className => this.element.classList.remove(className))
		} else this.element.classList.remove(classNames)
		return this
	}
	/**
	 * Set or Get значения аттрибута
	 * @param {string} attributeName - название аттрибута
	 * @param {string} [value] - значение, передаваемое в аттрибут
	 * @returns {RQuery|string}
	 */
	attr(attributeName, value) {
		if (typeof attributeName !== 'string')
			throw new Error('attributeName must be string')
		if (typeof value === 'undefined')
			return this.element.getAttribute(attributeName)
		this.element.setAttribute(attributeName, value)
		return this
	}
	/**
	 * Удаление аттрибута
	 * @param {string} attributeName - название аттрибута
	 * @returns {RQuery|string}
	 */
	removeAttr(attributeName) {
		if (typeof attributeName !== 'string')
			throw new Error('attributeName must be string')
		this.element.removeAttribute(attributeName)
		return this
	}
}

/**
 * Создание нового инстанса RQuery
 * @param {string|HTMLElement} selector - CSS selector or HTMLElement
 * @returns {RQuery}
 */
export function $R(selector) {
	return new RQuery(selector)
}
