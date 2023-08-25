import { ChildComponent } from '@/core/component/child.component'
import { $R } from '@/core/rquery/rquery.lib'
import renderService from '@/core/services/render.service'

import { UserItem } from '@/components/ui/user-item/user-item.component'

import { debounce } from '@/utils/debounce.util'
import { formatCardNumberWithDashes } from '@/utils/format/format-card-number'

import { UserService } from '@/api/user.service'

import styles from './search.module.sass'
import template from './search.template.html'

export class Search extends ChildComponent {
	constructor() {
		super()
		this.userService = new UserService()
	}
	async #handleSearch(event) {
		const searchTerm = event.target.value
		const searchResultElement = $R(this.element).find('#search-results')
		if (!searchTerm) {
			//очищаем #search-results после очистки поля input
			searchResultElement.html('')
			return
		}
		await this.userService.getAll(searchTerm, users => {
			searchResultElement.html('')
			users.forEach((user, index) => {
				const userItem = new UserItem(user, true, () => {
					searchResultElement.html('') //при клике на userItem очищаем #search-results
					$R('[name="card-number"]').value(
						//находим input у которого аттрибут name="card-number"
						formatCardNumberWithDashes(user.card.number)
					)
				}).render()
				$R(userItem)
					.addClass(styles.item)
					.css('transition-delay', `${index * 0.1}s`) //ожидание перед запуском transition
				searchResultElement.append(userItem)
				setTimeout(() => userItem.classList.add(styles.visible), 1) //если присвоить класс без задержки transition не сработает
			})
		})
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)
		const debounceHandleSearch = debounce(this.#handleSearch.bind(this), 300)
		$R(this.element)
			.find('input')
			.input({
				type: 'search',
				name: 'search',
				placeholder: 'Поиск контактов'
			})
			.on('input', debounceHandleSearch)
		return this.element
	}
}
