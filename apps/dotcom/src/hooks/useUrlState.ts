import { default as React, useEffect } from 'react'
import { Editor, TLPageId, debounce, react, useEditor } from 'tldraw'

const PARAMS = {
	// deprecated
	viewport: 'viewport',
	page: 'page',
	// current
	v: 'v',
	p: 'p',
} as const

export type UrlStateParams = Partial<Record<keyof typeof PARAMS, string>>

const viewportFromString = (str: string) => {
	const [x, y, w, h] = str.split(',').map((n) => parseInt(n, 10))
	return { x, y, w, h }
}

const viewportToString = (
	{ x, y, w, h }: { x: number; y: number; w: number; h: number },
	precision = 0
) => {
	return `${x.toFixed(precision)},${y.toFixed(precision)},${w.toFixed(precision)},${h.toFixed(
		precision
	)}`
}

/**
 * @param app - The app instance.
 * @public
 */
export const getViewportUrlQuery = (editor: Editor): UrlStateParams | null => {
	if (!editor.getViewportPageBounds()) return null
	return {
		[PARAMS.v]: viewportToString(editor.getViewportPageBounds()),
		[PARAMS.p]: editor.getCurrentPageId()?.split(':')[1],
	}
}

/** @public */
export function useUrlState(onChangeUrl: (params: UrlStateParams) => void) {
	const editor = useEditor()
	const onChangeUrlRef = React.useRef(onChangeUrl)
	onChangeUrlRef.current = onChangeUrl

	// Load initial data
	useEffect(() => {
		if (!editor) return

		const url = new URL(location.href)

		// We need to check the page first so that any changes to the camera will be applied to the correct page.
		if (url.searchParams.has(PARAMS.page) || url.searchParams.has(PARAMS.p)) {
			const newPageId =
				url.searchParams.get(PARAMS.page) ?? 'page:' + url.searchParams.get(PARAMS.p)
			if (newPageId) {
				if (editor.store.has(newPageId as TLPageId)) {
					editor.run(
						() => {
							editor.setCurrentPage(newPageId as TLPageId)
						},
						{ history: 'ignore' }
					)
				}
			}
		}

		if (url.searchParams.has(PARAMS.viewport) || url.searchParams.has(PARAMS.v)) {
			const newViewportRaw = url.searchParams.get(PARAMS.viewport) ?? url.searchParams.get(PARAMS.v)
			if (newViewportRaw) {
				try {
					const viewport = viewportFromString(newViewportRaw)
					editor.zoomToBounds(viewport, { immediate: true, inset: 0 })
				} catch (err) {
					console.error(err)
				}
			}
		}

		const handleChange = debounce((params: UrlStateParams | null) => {
			if (params) onChangeUrlRef.current(params)
		}, 500)

		const unsubscribe = react('urlState', () => {
			handleChange(getViewportUrlQuery(editor))
		})

		return () => {
			handleChange.cancel()
			unsubscribe()
		}
	}, [editor])
}
