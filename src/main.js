import {
	createSSRApp
} from "vue";
import App from "./App.vue";

const _global = typeof globalThis !== 'undefined'
	? globalThis
	: typeof window !== 'undefined'
	? window
	: typeof global !== 'undefined'
	? global
	: this

if (_global && typeof _global.URLSearchParams === 'undefined') {
	class URLSearchParams {
		constructor(init = '') {
			this.params = []
			if (typeof init === 'string') {
				const query = init.startsWith('?') ? init.slice(1) : init
				query.split('&').forEach(item => {
					if (!item) return
					const [key, value = ''] = item.split('=')
					this.append(decodeURIComponent(key), decodeURIComponent(value))
				})
			} else if (Array.isArray(init)) {
				init.forEach(([key, value]) => this.append(key, value))
			} else if (init && typeof init === 'object') {
				Object.keys(init).forEach(key => this.append(key, init[key]))
			}
		}

		append(name, value) {
			this.params.push([String(name), String(value)])
		}

		toString() {
			return this.params
				.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
				.join('&')
		}
	}
	_global.URLSearchParams = URLSearchParams
}

export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
