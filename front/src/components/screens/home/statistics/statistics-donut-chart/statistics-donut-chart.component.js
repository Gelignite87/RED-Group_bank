import { ChildComponent } from '@/core/component/child.component'
import renderService from '@/core/services/render.service'

import { DonutChart } from '@/components/ui/donut-chart/donut-chart.component'

import styles from './statistics-donut-chart.module.sass'
import template from './statistics-donut-chart.template.html'

export class StatisticsDonutChart extends ChildComponent {
	constructor(incomePercent, expensePercent) {
		super()
		this.incomePercent = incomePercent
		this.expensePercent = expensePercent
	}
	render() {
		this.element = renderService.htmlToElement(
			template,
			[
				new DonutChart([
					{ value: this.incomePercent, color: '#08f0c8' },
					{ value: this.expensePercent, color: '#917cff' }
				])
			],
			styles
		)
		return this.element
	}
}
