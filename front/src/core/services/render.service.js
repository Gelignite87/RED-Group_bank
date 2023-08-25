import { ChildComponent } from '../component/child.component'

class RenderService {
	/**
	 * html в виде строки переводим в полноценный html элемент
	 * @param {string} htmlString
	 * @param {Array} components
	 * @param {Object} [styles]
	 * @returns {HTMLElement} html
	 */
	htmlToElement(htmlString, components = [], styles) {
		// ------Первый способ преобразовать строку в HTML (через template)
		// const template = document.createElement('template') //аналог фрагмента в react
		// template.innerHTML = htmlString.trim() //помещаем строку во фрагмент, trim убирает лишние пробелы
		// const html = template.content.firstChild //достаем полноценный html элемент из фрагмента
		// ------Второй способ преобразовать строку в HTML (через DOMParser)
		const doc = new DOMParser().parseFromString(htmlString, 'text/html')
		const html = doc.body.firstChild
		if (styles) {
			//если нет модульного файла стилей пропускаем этот блок
			if (!html) return //если нет html элемента завершаем функцию htmlToElement
			this.#applyModuleStyles(html, styles) //заменяем классы на их кешированную версию
		}
		this.#replaceComponentTags(html, components) //заменяем теги на html, полученные в результате рендера компонентов
		return html
	}
	/**
	 * Очищаем теги и заменяем их на html, полученные в результате рендера компонентов
	 * @param {HTMLElement} html
	 * @param {Array} components
	 * @returns {void} void
	 */
	#replaceComponentTags(html, components) {
		const tagPattern = /^component-/
		const allTags = html.querySelectorAll('*') //разбиваем большой элемент на массив тегов
		for (const tag of allTags) {
			if (tagPattern.test(tag.tagName.toLowerCase())) {
				//находим кастомные теги, начинающиеся с component-
				const clearTagName = tag.tagName //очищаем название тега от component-
					.toLowerCase()
					.replace(tagPattern, '')
					.replace(/-/, '')
				const foundComponent = components.find(component => {
					//в приходящем массиве component может быть классом или инстансом класса
					if (component instanceof ChildComponent)
						return component.constructor.name.toLowerCase() === clearTagName //находим инстанс компонента имя которого совпадает с очищенным тегом
					return component.name.toLowerCase() === clearTagName //находим компонент имя которого совпадает с очищенным тегом
				})
				if (foundComponent) {
					const componentHTML =
						foundComponent instanceof ChildComponent
							? foundComponent.render()
							: new foundComponent().render()
					tag.replaceWith(componentHTML) //целиком заменяет element на html который мы получили в результате рендера найденного компонента
				} else {
					console.error(
						//ошибка если ни одно имя не совпадает с очищенным тегом
						`Component ${clearTagName} not found in the provided components array`
					)
				}
			}
		}
	}
	/**
	 * Заменяем классы на их кешированную версию
	 * @param {string} html
	 * @param {Object} styles
	 * @returns {void} void
	 */
	#applyModuleStyles(html, styles) {
		const applyStyles = tag => {
			for (const [key, value] of Object.entries(styles)) {
				//Object.entries переводит объект в массив с массивами, где каждое свойство и значение являются отдельным массивом
				if (tag.classList.contains(key)) {
					//проверяем наличие класса в элементе
					tag.classList.remove(key) //удаляем класс
					tag.classList.add(value) //добавляем класс
				}
			}
		}
		if (html.getAttribute('class')) applyStyles(html) //проверяем наличие аттрибута класс и выполняем applyStyles
		const allTags = html.querySelectorAll('*') //разбиваем большой элемент на массив тегов
		allTags.forEach(applyStyles) //ищем нужные классы в массиве тегов
	}
}

export default new RenderService()
