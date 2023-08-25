import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import { NotificationService } from '@/core/services/notification.service'
import renderService from '@/core/services/render.service'
import validationService from '@/core/services/validation.service'
import { Store } from '@/core/store/store'

import { Button } from '@/components/ui/button/button.component'
import { Field } from '@/components/ui/field/field.component'

import { CardService } from '@/api/card.service'

import styles from './transfer-field.module.sass'
import template from './transfer-field.template.html'

export class TransferField extends ChildComponent {
	constructor() {
		super()
		this.store = Store.getInstance()
		this.cardService = new CardService()
		this.notificationService = new NotificationService()
	}
	handleTransfer(e) {
		e.preventDefault()
		if (!this.store.state.user)
			this.notificationService.show('error', 'You need authorization!')
		$R(e.target).text('Sending...').attr('disabled', true)
		const toCardNumber = $R(this.element)
			.find('input')
			.value()
			.replaceAll('-', '')
		if (!toCardNumber) {
			validationService.showError($R(this.element).find('label'))
			$R(e.target).removeAttr('disabled').text('Send')
		}
		let amount = prompt('transfer amount')
		this.cardService.transfer({ amount, toCardNumber }, () => {
			$R(this.element).find('input').value('')
			amount = ''
			$R(e.target).removeAttr('disabled').text('Send')
			document.dispatchEvent(new Event('transactionCompleted')) //здесь срабатывает кастомное событие(event)
			document.dispatchEvent(new Event('balanceUpdated')) //здесь срабатывает кастомное событие(event)
		})
	}
	render() {
		this.element = renderService.htmlToElement(
			template,
			[
				new Field({
					name: 'card-number',
					placeholder: 'xxxx-xxxx-xxxx-xxxx',
					variant: 'credit-card'
				}),
				new Button({
					children: 'Send',
					variant: 'purple',
					onClick: this.handleTransfer.bind(this)
				})
			],
			styles
		)
		return this.element
	}
}
