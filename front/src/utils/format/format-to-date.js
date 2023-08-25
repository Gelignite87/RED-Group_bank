/**
 * Форматирование даты
 * @param {string} dateString 'YYYY-MM-DDTHH:mm:ss.sssZ'
 * @returns {string} 'MMM DD YYYY'
 */
export function formatDate(dateString) {
	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	})
}
