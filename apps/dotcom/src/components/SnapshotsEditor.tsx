import { getLicenseKey } from '@tldraw/dotcom-shared'
import { useMemo } from 'react'
import {
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
	DefaultMainMenu,
	DefaultMainMenuContent,
	SerializedSchema,
	TLComponents,
	TLRecord,
	Tldraw,
	TldrawUiMenuGroup,
	TldrawUiMenuItem,
	useActions,
} from 'tldraw'
import { convertLegacyUrlParams } from '../hooks/useUrlState'
import { assetUrls } from '../utils/assetUrls'
import { DebugMenuItems } from '../utils/migration/DebugMenuItems'
import { useSharing } from '../utils/sharing'
import { SAVE_FILE_COPY_ACTION, useFileSystem } from '../utils/useFileSystem'
import { useHandleUiEvents } from '../utils/useHandleUiEvent'
import { ExportMenu } from './ExportMenu'
import { MultiplayerFileMenu } from './FileMenu'

const components: TLComponents = {
	ErrorFallback: ({ error }) => {
		throw error
	},
	MainMenu: () => (
		<DefaultMainMenu>
			<MultiplayerFileMenu />
			<DefaultMainMenuContent />
		</DefaultMainMenu>
	),
	KeyboardShortcutsDialog: (props) => {
		const actions = useActions()
		return (
			<DefaultKeyboardShortcutsDialog {...props}>
				<TldrawUiMenuGroup label="shortcuts-dialog.file" id="file">
					<TldrawUiMenuItem {...actions[SAVE_FILE_COPY_ACTION]} />
				</TldrawUiMenuGroup>
				<DefaultKeyboardShortcutsDialogContent />
			</DefaultKeyboardShortcutsDialog>
		)
	},
	SharePanel: () => {
		return (
			<div className="tlui-share-zone" draggable={false}>
				<ExportMenu />
			</div>
		)
	},
}

interface SnapshotEditorProps {
	schema: SerializedSchema
	records: TLRecord[]
}

export function SnapshotsEditor({ schema, records }: SnapshotEditorProps) {
	const handleUiEvent = useHandleUiEvents()
	const sharingUiOverrides = useSharing()
	const fileSystemUiOverrides = useFileSystem({ isMultiplayer: true })

	const snapshot = useMemo(
		() => ({
			schema,
			store: Object.fromEntries(records.map((record) => [record.id, record])),
		}),
		[schema, records]
	)

	return (
		<div className="tldraw__editor">
			<Tldraw
				licenseKey={getLicenseKey()}
				assetUrls={assetUrls}
				snapshot={snapshot}
				overrides={[sharingUiOverrides, fileSystemUiOverrides]}
				onUiEvent={handleUiEvent}
				onMount={(editor) => {
					;(window as any).app = editor
					;(window as any).editor = editor
					editor.updateInstanceState({ isReadonly: true })
					convertLegacyUrlParams()
					editor.loadStateFromUrl()
					return editor.updateUrlOnStateChange()
				}}
				components={components}
				renderDebugMenuItems={() => <DebugMenuItems />}
				inferDarkMode
			></Tldraw>
		</div>
	)
}
