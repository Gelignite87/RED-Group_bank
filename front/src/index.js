import '@/styles/global.sass'

import { Router } from './core/router/router'

new Router()

document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    link.setAttribute('nonce', '12345678')
})