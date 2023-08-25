import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'

import styles from './user-item.module.sass'
import template from './user-item.template.html'

export class UserItem extends ChildComponent {
	constructor(user, isGray = false, onClick) {
		super()
		if (!user) throw new Error('User is required')
		if (!user?.name) throw new Error('User must have name')
		if (!user?.avatarPath) throw new Error('User must have avatarPath')
		this.user = user
		this.isGray = isGray
		this.onClick = onClick
	}
	#preventDefault(e) {
		e.preventDefault()
	}
	update({ avatarPath, name }) {
		if (avatarPath && name) {
			$R(this.element).find('img').attr('src', avatarPath).attr('alt', name)
			$R(this.element).find('span').text(name)
		}
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		this.update(this.user)
		$R(this.element).click(this.onClick || this.#preventDefault.bind(this))
		if (!this.onClick) $R(this.element).attr('disabled', '')
		if (this.isGray) $R(this.element).addClass(styles.gray)
		return this.element
	}
}
