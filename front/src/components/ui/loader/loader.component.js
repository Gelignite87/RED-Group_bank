import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'

import styles from './loader.module.sass'
import template from './loaderWithoutStyle.template.html'

export const LOADER_SELECTOR = '[data-component="loader"]'

export class Loader extends ChildComponent {
	constructor(width = 100, height = 100) {
		super()
		this.width = width
		this.height = height
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		$R(this.element)
			.css('width', `${this.width}px`)
			.css('height', `${this.height}px`)
			.addClass('bounce') //для класса bounce прописан глобальный стиль
		return this.element
	}
}
