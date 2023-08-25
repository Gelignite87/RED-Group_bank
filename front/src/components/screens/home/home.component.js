import { BaseScreenComponent } from '@/core/component/base-screen.component'
import renderService from '@/core/services/render.service'
import { Store } from '@/core/store/store'

import styles from './home.module.sass'
import template from './home.template.html'

import { Actions } from './actions/actions.component'
import { CardInfo } from './card-info/card-info.component'
import { Contacts } from './contacts/contacts.component'
import { Statistics } from './statistics/statistics.component'
import { Transactions } from './transactions/transactions.component'

export class Home extends BaseScreenComponent {
	constructor({ router }) {
		super({ title: 'Home' })
		this.store = Store.getInstance()
		this.router = router
	}
	update() {
		if (!this.store.state.user) {
			this.router.navigate('/auth')
			return true
		}
	}
	render() {
		this.element = renderService.htmlToElement(
			template,
			[CardInfo, Actions, Contacts, Transactions, Statistics],
			styles
		)
		if (this.update()) return null
		return this.element
	}
}
