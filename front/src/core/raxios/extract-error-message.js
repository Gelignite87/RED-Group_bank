export function extractErrorMessage(error) {
	return typeof error.message === 'object' ? error.message[0] : error.message
}
