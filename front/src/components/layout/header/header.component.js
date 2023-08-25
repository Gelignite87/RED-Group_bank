import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'
import { Store } from '@/core/store/store'

import { UserItem } from '@/components/ui/user-item/user-item.component'

import styles from './header.module.sass'
import template from './header.template.html'

import { Logo } from './logo/logo.component'
import { LogoutButton } from './logout-button/logout-button.component'
import { Search } from './search/search.component'

export class Header extends ChildComponent {
	constructor({ router }) {
		super()
		this.store = Store.getInstance()
		this.store.addObserver(this)
		this.router = router
		this.userItem = new UserItem({
			name: 'FDA',
			avatarPath: '/'
		})
	}
	update() {
		const authSideElement = $R(this.element).find('#auth-side')
		if (this.store.state.user) {
			authSideElement.show()
			this.userItem.update(this.store.state.user)
		} else {
			authSideElement.hide()
		}
	}
	render() {
		this.element = renderService.htmlToElement(
			template,
			[Logo, new LogoutButton({ router: this.router }), Search, this.userItem],
			styles
		)
		this.update()
		return this.element
	}
}
