import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'
import { Store } from '@/core/store/store'

import { Heading } from '@/components/ui/heading/heading.component'
import { Loader } from '@/components/ui/loader/loader.component'

import { TransactionService } from '@/api/transaction.service'

import styles from './transactions.module.sass'
import template from './transactions.template.html'

import { TransactionItem } from './transaction-item/transaction-item.component'

export class Transactions extends ChildComponent {
	constructor() {
		super()
		this.store = Store.getInstance()
		this.transactionService = new TransactionService()
		this.element = renderService.htmlToElement(
			template,
			[new Heading('Recent transactions')],
			styles
		)
		this.#removeListener()
		this.#addListener()
	}
	#addListener() {
		document.addEventListener('transactionCompleted', () => this.fetchData())
	}
	#removeListener() {
		document.removeEventListener('transactionCompleted', () => this.fetchData())
	}
	fetchData() {
		this.element.insertBefore(new Loader().render(), this.element.children[1])
		this.transactionService.getAll(data => {
			if (!data) return
			this.element.querySelector('[data-component="loader"]').remove()
			$R(this.element).find('#transactions-list').text('')
			if (data.length) {
				for (const transaction of data.transactions) {
					$R(this.element)
						.find('#transactions-list')
						.append(new TransactionItem(transaction).render())
				}
			} else {
				$R(this.element)
					.find('#transactions-list')
					.text('Transactions not found')
			}
		})
	}
	render() {
		if (this.store.state.user) this.fetchData()
		return this.element
	}
}
