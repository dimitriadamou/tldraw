import {
	DEFAULT_EMBED_DEFINITIONS,
	EmbedDefinition,
	EmbedDefinitionOverride,
} from '@tldraw/tlschema'
import { ReactNode, createContext, useContext } from 'react'

const EmbedDefinitionsContext = createContext<
	null | readonly EmbedDefinition[] | EmbedDefinitionOverride[]
>(null)

interface EmbedDefinitionsProviderProps {
	embeds?: readonly EmbedDefinition[] | EmbedDefinitionOverride[] | undefined
	children: ReactNode
}

export function EmbedDefinitionsProvider({
	embeds = DEFAULT_EMBED_DEFINITIONS,
	children,
}: EmbedDefinitionsProviderProps) {
	return (
		<EmbedDefinitionsContext.Provider value={embeds}>{children}</EmbedDefinitionsContext.Provider>
	)
}

/** @public */
export function useEmbedDefinitions() {
	const embeds = useContext(EmbedDefinitionsContext)
	if (!embeds) {
		throw new Error('useEmbedDefinitions must be used inside of <EmbedDefinitionsProvider />')
	}
	return embeds
}
