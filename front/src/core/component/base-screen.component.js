export class BaseScreenComponent {
	/**
	 * Create a new BaseScreen instance
	 * @param {Object} options.title - The title for the screen
	 */
	constructor({ title }) {
		document.title = title ? `${title} | RED Bank` : 'RED Bank'
	}
	/**
	 * Render the child component content
	 * @returns {HTMLElement} html
	 */
	render() {
		throw new Error('render method must be implemented')
	}
}
