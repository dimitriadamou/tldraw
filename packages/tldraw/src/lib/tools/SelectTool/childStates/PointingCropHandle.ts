import {
	StateNode,
	TLEventHandlers,
	TLImageShape,
	TLPointerEventInfo,
	TLShape,
} from '@tldraw/editor'
import { CursorTypeMap } from '../select-helpers'

type TLPointingCropHandleInfo = TLPointerEventInfo & {
	target: 'selection'
} & {
	onInteractionEnd?: string
}

export class PointingCropHandle extends StateNode {
	static override id = 'pointing_crop_handle'

	private info = {} as TLPointingCropHandleInfo

	private updateCursor(shape: TLShape) {
		const cursorType = CursorTypeMap[this.info.handle!]
		this.editor.updateInstanceState({
			cursor: {
				type: cursorType,
				rotation: shape.rotation,
			},
		})
	}

	override onEnter = (info: TLPointingCropHandleInfo) => {
		this.info = info
		this.parent.setCurrentToolIdMask(info.onInteractionEnd)
		const selectedShape = this.editor.getSelectedShapes()[0]
		if (!selectedShape) return

		this.updateCursor(selectedShape)
		this.editor.setCroppingShape(selectedShape.id)
	}

	override onExit = () => {
		this.editor.updateInstanceState(
			{ cursor: { type: 'default', rotation: 0 } },
			{ ephemeral: true }
		)
		this.parent.setCurrentToolIdMask(undefined)
	}

	override onPointerMove: TLEventHandlers['onPointerMove'] = () => {
		const isDragging = this.editor.inputs.isDragging

		if (isDragging) {
			this.parent.transition('resizing_crop', {
				shape: this.editor.getOnlySelectedShape() as TLImageShape,
				handle: this.info.handle,
			})
		}
	}

	override onPointerUp: TLEventHandlers['onPointerUp'] = () => {
		if (this.info.onInteractionEnd) {
			this.editor.setCurrentTool(this.info.onInteractionEnd, this.info)
		} else {
			this.editor.setCroppingShape(null)
			this.parent.transition('idle')
		}
	}

	override onCancel: TLEventHandlers['onCancel'] = () => {
		this.cancel()
	}

	override onComplete: TLEventHandlers['onComplete'] = () => {
		this.cancel()
	}

	override onInterrupt = () => {
		this.cancel()
	}

	private cancel() {
		this.editor.setCroppingShape(null)
		if (this.info.onInteractionEnd) {
			this.editor.setCurrentTool(this.info.onInteractionEnd, this.info)
		} else {
			this.editor.setCroppingShape(null)
			this.parent.transition('idle')
		}
	}
}
