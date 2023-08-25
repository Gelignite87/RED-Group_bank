/**
 * Приведение номера к строке с валютным символом
 * @param {number} number
 * @returns {string}
 */
export function formatToCurrency(number) {
	return new Intl.NumberFormat('ru-RU', {
		currency: 'RUB',
		style: 'currency'
	}).format(number)
}
