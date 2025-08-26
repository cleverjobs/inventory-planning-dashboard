import '@testing-library/jest-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jest: any; // Provided by Jest runtime

// Silence noisy logs from dynamic imports / chart
if (typeof jest !== 'undefined' && jest.spyOn) {
	jest.spyOn(console, 'log').mockImplementation(() => {});
	jest.spyOn(console, 'error').mockImplementation(() => {});
}

// JSDOM polyfills
if (typeof window !== 'undefined') {
	if (!('matchMedia' in window)) {
		// @ts-ignore
		window.matchMedia = (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {}, // deprecated
			removeListener: () => {}, // deprecated
			dispatchEvent: () => false,
		});
	}
	if (!('ResizeObserver' in window)) {
		// @ts-ignore
		window.ResizeObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
		};
	}
}
