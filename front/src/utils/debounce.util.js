export function debounce(func, ms) {
	let timeout //переменная timeout создается один раз при переназначении функции debounce и каждый последующий вызов внутренний функции обращается к одному и тому же timeout. При этом переменные, объявленные внутри внутренней функции будут при каждом её вызове создаваться заново
	return function (event) {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(event), ms)
	}
}
