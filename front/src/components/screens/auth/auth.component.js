import { BaseScreenComponent } from '@/core/component/base-screen.component'
import { $R } from '@/core/rquery/rquery.lib'
import formService from '@/core/services/form.service'
import renderService from '@/core/services/render.service'
import validationService from '@/core/services/validation.service'
import { Store } from '@/core/store/store'

import { Button } from '@/components/ui/button/button.component'
import { Field } from '@/components/ui/field/field.component'

import { authService } from '@/api/auth.service'

import styles from './auth.module.sass'
import template from './auth.template.html'

export class Auth extends BaseScreenComponent {
	#isTypeLogin = true
	constructor({ router }) {
		super({ title: 'Auth' })
		this.store = Store.getInstance()
		this.store.addObserver(this)
		this.router = router
	}
	update() {
		if (this.store.state.user) {
			this.router.navigate('/')
			return true
		}
	}
	#validateFields(formValues) {
		const emailLabel = $R(this.element).find('label:first-child')
		const passwordLabel = $R(this.element).find('label:last-child')
		if (!formValues.email) validationService.showError(emailLabel)
		if (!formValues.password) validationService.showError(passwordLabel)
		return formValues.email && formValues.password
	}
	#handleSubmit = e => {
		const formValues = formService.getFormValues(e.target)
		if (!this.#validateFields(formValues)) return
		authService.main(this.#isTypeLogin ? 'login' : 'register', formValues)
	}
	#changeFormType(e) {
		e.preventDefault()
		$R(this.element)
			.find('h1')
			.text(this.#isTypeLogin ? 'Register' : 'Sign In')
		e.target.innerText = this.#isTypeLogin ? 'Sign In' : 'Register'
		this.#isTypeLogin = !this.#isTypeLogin
	}
	render() {
		this.element = renderService.htmlToElement(
			template,
			[new Button({ children: 'Submit' })],
			styles
		)
		$R(this.element)
			.find('form')
			.submit(this.#handleSubmit)
			.find('#change-form-type')
			.click(e => {
				this.#changeFormType(e)
			}) //работа с контекстом, другой вариант: this.#changeFormType.bind(this)
		$R(this.element)
			.find('#auth-inputs')
			.append(
				new Field({
					placeholder: 'Enter email',
					name: 'email',
					type: 'email'
				}).render()
			)
			.append(
				new Field({
					placeholder: 'Enter password',
					name: 'password',
					type: 'password'
				}).render()
			)
		if (this.update()) return null
		return this.element
	}
}
