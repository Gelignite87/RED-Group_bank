class ValidationService {
	constructor() {
		this.errorBorderTimeout = {}
	}
	showError(element, ms = 2500) {
		element.css('border-color', 'rgb(255 74 74 / 61%)')
		const el = element.element.children[0].name
		if (this.errorBorderTimeout[el]) clearTimeout(this.errorBorderTimeout[el])
		this.errorBorderTimeout[el] = setTimeout(() => {
			element.css('border-color', '')
		}, ms)
	}
}

export default new ValidationService()
