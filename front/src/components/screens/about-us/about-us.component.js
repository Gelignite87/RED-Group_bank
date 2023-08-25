import { BaseScreenComponent } from '@/core/component/base-screen.component'
import renderService from '@/core/services/render.service'

import styles from './about-us.module.sass'
import template from './about-us.template.html'

export class AboutUs extends BaseScreenComponent {
	constructor() {
		super({ title: 'About us' })
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		return this.element
	}
}
