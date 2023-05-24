import { BaseRecord, createRecordType, ID, Migrator } from '@tldraw/tlstore'
import { TLInstance } from './TLInstance'
import { TLPage } from './TLPage'
import { TLUserId } from './TLUser'

/**
 * TLUserDocument
 *
 * Settings that apply to this document for only the specified user
 *
 * @public
 */
export interface TLUserDocument extends BaseRecord<'user_document', TLUserDocumentId> {
	userId: TLUserId
	isPenMode: boolean
	isGridMode: boolean
	isDarkMode: boolean
	isMobileMode: boolean
	isSnapMode: boolean
	lastUpdatedPageId: ID<TLPage> | null
	lastUsedTabId: ID<TLInstance> | null
}

/** @public */
export type TLUserDocumentId = ID<TLUserDocument>

export const Versions = {
	AddSnapMode: 1,
	AddMissingIsMobileMode: 2,
	RemoveIsReadOnly: 3,
} as const

/** @public */
export const userdocumentTypeMigrator = new Migrator({
	currentVersion: Versions.RemoveIsReadOnly,
	migrators: {
		[Versions.AddSnapMode]: {
			up: (userDocument: TLUserDocument) => {
				return { ...userDocument, isSnapMode: false }
			},
			down: ({ isSnapMode: _, ...userDocument }: TLUserDocument) => {
				return userDocument
			},
		},
		[Versions.AddMissingIsMobileMode]: {
			up: (userDocument: TLUserDocument) => {
				return { ...userDocument, isMobileMode: userDocument.isMobileMode ?? false }
			},
			down: ({ isMobileMode: _, ...userDocument }: TLUserDocument) => {
				return userDocument
			},
		},
		[Versions.RemoveIsReadOnly]: {
			up: ({ isReadOnly: _, ...userDocument }: TLUserDocument & { isReadOnly: boolean }) => {
				return userDocument
			},
			down: (userDocument: TLUserDocument) => {
				return { ...userDocument, isReadOnly: false }
			},
		},
	},
})
/* STEP 4: Add your changes to the record type */

/* STEP 5: Add up + down migrations for your new version */
/** @public */
export const UserDocumentRecordType = createRecordType<TLUserDocument>('user_document', {
	scope: 'instance',
}).withDefaultProperties(
	(): Omit<TLUserDocument, 'id' | 'typeName' | 'userId'> => ({
		/* STEP 6: Add any new default values for properties here */
		isPenMode: false,
		isGridMode: false,
		isDarkMode: false,
		isMobileMode: false,
		isSnapMode: false,
		lastUpdatedPageId: null,
		lastUsedTabId: null,
	})
)

export { Versions as userDocumentVersions }
