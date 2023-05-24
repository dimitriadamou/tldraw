import { assert } from '@tldraw/utils'
import { BaseRecord, ID } from '../BaseRecord'
import { Migrator } from '../Migrator'
import { createRecordType } from '../RecordType'
import { StoreSchema } from '../StoreSchema'

/** A user of tldraw */
interface User extends BaseRecord<'user', ID<User>> {
	name: string
}

const User = createRecordType<User>('user', {
	scope: 'document',
})

interface Shape<Props> extends BaseRecord<'shape', ID<Shape<object>>> {
	type: string
	x: number
	y: number
	props: Props
}

interface RectangleProps {
	width: number
	height: number
	opactiy: number
}

interface OvalProps {
	radius: number
	borderStyle: 'solid' | 'dashed'
}

const ShapeTypeMigrator = new Migrator({
	subTypeKey: 'type',
	subTypeMigrators: {
		rectangle: new Migrator({}),
	},
})

const Shape = createRecordType<Shape<RectangleProps | OvalProps>>('shape', {
	scope: 'document',
})

// this interface only exists to be removed
interface Org extends BaseRecord<'org', ID<Org>> {
	name: string
}

const Org = createRecordType<Org>('org', {
	scope: 'document',
})

type StoreRecord = Org | User | Shape<RectangleProps | OvalProps>

const validateRecord = (record: StoreRecord): StoreRecord => {
	switch (record.typeName) {
		case 'org': {
			assert(
				record && typeof record === 'object' && 'name' in record && typeof record.name === 'string'
			)
			return record
		}
		case 'user': {
			assert(
				record &&
					typeof record === 'object' &&
					'type' in record &&
					typeof record.type === 'string' &&
					'x' in record &&
					typeof record.x === 'number' &&
					'y' in record &&
					typeof record.y === 'number' &&
					'props' in record &&
					typeof record.props === 'object'
			)
			return record
		}
		case 'shape': {
			assert(
				record && typeof record === 'object' && 'name' in record && typeof record.name === 'string'
			)
			return record
		}
	}
}

export const testSchemaV0 = StoreSchema.create(
	{
		user: User,
		shape: Shape,
		org: Org,
	},
	{
		snapshotMigrator: new Migrator({}),
		validateRecord,
		migrators: {
			org: new Migrator({}),
			user: new Migrator({}),
			shape: ShapeTypeMigrator,
		},
	}
)
