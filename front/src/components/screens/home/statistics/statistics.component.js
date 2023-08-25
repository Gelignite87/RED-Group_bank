import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'
import { Store } from '@/core/store/store'

import { Heading } from '@/components/ui/heading/heading.component'
import { Loader } from '@/components/ui/loader/loader.component'

import { formatToCurrency } from '@/utils/format/format-to-currency'

import { StatisticService } from '@/api/statistic.service'

import styles from './statistics.module.sass'
import template from './statistics.template.html'

import { StatisticItem } from './statistic-item/statistic-item.component'
import { StatisticsDonutChart } from './statistics-donut-chart/statistics-donut-chart.component'

export class Statistics extends ChildComponent {
	constructor() {
		super()
		this.store = Store.getInstance()
		this.statisticService = new StatisticService()
		this.element = renderService.htmlToElement(
			template,
			[new Heading('Statistics')],
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
	renderChart(income, expense) {
		const total = income + expense
		let incomePercent = (income / total) * 100 + 0.01
		let expensePercent = 100 - incomePercent + 0.01
		return new StatisticsDonutChart(incomePercent, expensePercent).render()
	}
	fetchData() {
		$R(this.element).before(new Loader().render())
		this.statisticService.main(data => {
			if (!data) return
			this.element.querySelector('[data-component="loader"]').remove()
			$R(this.element)
				.find('#statistics-items')
				.text('')
				.append(
					new StatisticItem(
						'Income:',
						formatToCurrency(data[0].value),
						'green'
					).render()
				)
				.append(
					new StatisticItem(
						'Expense:',
						formatToCurrency(data[1].value),
						'purple'
					).render()
				)
			$R(this.element)
				.find('#donut-chart')
				.text('')
				.append(this.renderChart(data[0].value, data[1].value))
		})
	}
	render() {
		if (this.store.state.user) this.fetchData()
		return this.element
	}
}
