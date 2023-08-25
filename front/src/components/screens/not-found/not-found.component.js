import { BaseScreenComponent } from '@/core/component/base-screen.component'
import renderService from '@/core/services/render.service'

import styles from './not-found.module.sass'
import template from './not-found.template.html'

export class NotFound extends BaseScreenComponent {
	constructor() {
		super({ title: 'Not found' })
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		return this.element
	}
}
