import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'

import { formatToCurrency } from '@/utils/format/format-to-currency'
import { formatDate } from '@/utils/format/format-to-date'

import styles from './transaction-item.module.sass'
import template from './transaction-item.template.html'

export class TransactionItem extends ChildComponent {
	constructor(transaction) {
		super()
		this.transaction = transaction
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		const isIncome = this.transaction.type === 'TOP_UP'
		if (isIncome) $R(this.element).addClass(styles.income)
		$R(this.element)
			.find('#transaction-name')
			.text(isIncome ? 'Income' : 'Expense')
		$R(this.element)
			.find('#transaction-date')
			.text(formatDate(this.transaction.createdAt))
		$R(this.element)
			.find('#transaction-amount')
			.text(formatToCurrency(this.transaction.amount))
		return this.element
	}
}
