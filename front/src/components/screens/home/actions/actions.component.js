import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import { NotificationService } from '@/core/services/notification.service'
import renderService from '@/core/services/render.service'
import validationService from '@/core/services/validation.service'
import { Store } from '@/core/store/store'

import { Button } from '@/components/ui/button/button.component'
import { Field } from '@/components/ui/field/field.component'

import { CardService } from '@/api/card.service'

import styles from './actions.module.sass'
import template from './actions.template.html'

export class Actions extends ChildComponent {
	constructor() {
		super()
		this.store = Store.getInstance()
		this.cardService = new CardService()
		this.notificationService = new NotificationService()
	}
	/**
	 * Update balance
	 * @param {Event} e
	 * @param {'top-up'|'withdrawal'} type
	 */
	updateBalance(e, type) {
		e.preventDefault()
		if (!this.store.state.user)
			this.notificationService.show('error', 'You need authorization!')
		$R(e.target).text('Sending...').attr('disabled', true)
		const amount = $R(this.element).find('input').value()
		if (!amount) {
			validationService.showError($R(this.element).find('label'))
			$R(e.target).removeAttr('disabled').text(type)
			return
		}
		this.cardService.updateBalance(amount, type, () => {
			$R(this.element).find('input').value('')
			$R(e.target).removeAttr('disabled').text(type)
			document.dispatchEvent(new Event('balanceUpdated')) //здесь срабатывает кастомное событие(event)
		})
	}
	render() {
		this.element = renderService.htmlToElement(
			template,
			[
				new Field({
					name: 'amount',
					placeholder: 'Enter amount',
					type: 'number'
				})
			],
			styles
		)
		$R(this.element)
			.find('#action-buttons')
			.append(
				new Button({
					children: 'Top-up',
					variant: 'green',
					onClick: e => this.updateBalance(e, 'top-up')
				}).render()
			)
			.append(
				new Button({
					children: 'Withdrawal',
					variant: 'purple',
					onClick: e => this.updateBalance(e, 'withdrawal')
				}).render()
			)
		return this.element
	}
}
