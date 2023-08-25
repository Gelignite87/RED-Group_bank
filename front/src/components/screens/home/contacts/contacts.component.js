import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'
import { Store } from '@/core/store/store'

import { Heading } from '@/components/ui/heading/heading.component'
import { Loader } from '@/components/ui/loader/loader.component'
import { UserItem } from '@/components/ui/user-item/user-item.component'

import { formatCardNumberWithDashes } from '@/utils/format/format-card-number'

import { UserService } from '@/api/user.service'

import styles from './contacts.module.sass'
import template from './contacts.template.html'

import { TransferField } from './transfer-field/transfer-field.component'

export class Contacts extends ChildComponent {
	constructor() {
		super()
		this.store = Store.getInstance()
		this.userService = new UserService()
		this.element = renderService.htmlToElement(
			template,
			[TransferField, new Heading('Transfer money')],
			styles
		)
	}
	fetchData() {
		$R(this.element).find('#contacts-list').append(new Loader().render())
		this.userService.getAll(null, data => {
			if (!data) return
			this.element.querySelector('[data-component="loader"]').remove()
			for (const user of data) {
				$R(this.element)
					.find('#contacts-list')
					.append(
						new UserItem(user, true, () => {
							//третьим параметром передаётся callback срабатывающий при клике на UserItem
							$R('[name="card-number"]').value(
								//находим input у которого аттрибут name="card-number"
								formatCardNumberWithDashes(user.card.number)
							)
						}).render()
					)
			}
			$R(this.element)
				.find('#contacts-list')
				.findAll('button')
				.forEach(contactElement => {
					contactElement.addClass('fade-in')
				})
		})
	}
	render() {
		if (this.store.state.user) this.fetchData()
		return this.element
	}
}
