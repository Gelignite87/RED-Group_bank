/**
 * Добавление (-) через каждые 4 цифры номера кредитной карты
 * @param {string} value - credit card number
 * @returns {string}
 */
export function formatCardNumberWithDashes(value) {
	return value.replace(/(\d{4})(?=\d)/g, '$1-')
}
/**
 * Приведение номера карты к виду **** **** **** ****
 * @param {string} cardNumber - credit card number
 * @returns {string}
 */
export function formatCardNumber(cardNumber) {
	const formattedNumber = cardNumber.replace(/\s/g, '').match(/.{1,4}/g) //replace удаляет все пробелы, match возвращает массив совпадений с регулярным выражением
	return formattedNumber ? formattedNumber.join(' ') : ''
}
