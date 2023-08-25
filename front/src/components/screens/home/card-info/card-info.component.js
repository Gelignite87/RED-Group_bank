import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'
import { Store } from '@/core/store/store'

import { formatCardNumber } from '@/utils/format/format-card-number'
import { formatToCurrency } from '@/utils/format/format-to-currency'

import { CardService } from '@/api/card.service'

import styles from './card-info.module.sass'
import template from './card-info.template.html'

const CODE = '*****'

export class CardInfo extends ChildComponent {
	constructor() {
		super()
		this.store = Store.getInstance()
		this.cardService = new CardService()
		this.element = renderService.htmlToElement(template, [], styles)
		this.#removeListener()
		this.#addListener()
	}
	#addListener() {
		document.addEventListener('balanceUpdated', () => this.fetchData())
	}
	#removeListener() {
		document.removeEventListener('balanceUpdated', () => this.fetchData())
	}
	#copyCardNumber(e) {
		navigator.clipboard.writeText(e.target.innerText).then(() => {
			//запись в буфер обмена, в данном случае записываем свойство элемента innerText
			e.target.innerText = 'Card number copied!'
			setTimeout(() => {
				e.target.innerText = formatCardNumber(this.card.number)
			}, 1000)
		})
	}
	#toggleCvc(cardCvcElement) {
		cardCvcElement.element.textContent === CODE
			? cardCvcElement.text(this.card.cvc)
			: cardCvcElement.text(CODE)
	}
	fillElements() {
		// $R(this.element).html(
		// 	renderService.htmlToElement(template, [], styles).innerHTML
		// )
		$R(this.element)
			.findAll(':scope > div') //собираем все div на первом уровне вложенности
			.forEach(element => element.addClass('fade-in'))
		$R(this.element)
			.find('#card-number')
			.text(formatCardNumber(this.card.number))
			.click(this.#copyCardNumber.bind(this))
		$R(this.element)
			.find('#card-expire-date')
			.text(formatCardNumber(this.card.expireDate))
		$R(this.element).find('#card-cvc').text(CODE).css('width', '44px')
		$R(this.element)
			.find('#toggle-cvc')
			.click(this.#toggleCvc.bind(this, $R(this.element).find('#card-cvc')))
		$R(this.element)
			.find('#card-balance')
			.text(formatToCurrency(this.card.balance))
	}
	fetchData() {
		this.cardService.byUser(data => {
			if (data?.id) {
				this.card = data
				this.fillElements()
				this.store.updateCard(data)
			} else {
				this.store.updateCard(null)
			}
		})
	}
	render() {
		if (this.store.state.user) this.fetchData()
		return this.element
	}
}
