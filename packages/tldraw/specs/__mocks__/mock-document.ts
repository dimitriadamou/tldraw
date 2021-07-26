import { ColorStyle, DashStyle, SizeStyle, TLDrawDocument } from '../../src'

export const mockDocument: TLDrawDocument = {
  currentPageId: 'page1',
  pages: {
    page1: {
      id: 'page1',
      shapes: {
        rect1: {
          id: 'rect1',
          parentId: 'page1',
          name: 'Rectangle',
          childIndex: 0,
          type: 'rectangle',
          point: [0, 0],
          size: [100, 100],
          style: {
            dash: DashStyle.Draw,
            size: SizeStyle.Medium,
            color: ColorStyle.Blue,
          },
        },
        rect2: {
          id: 'rect2',
          parentId: 'page1',
          name: 'Rectangle',
          childIndex: 1,
          type: 'rectangle',
          point: [0, 200],
          size: [100, 100],
          style: {
            dash: DashStyle.Draw,
            size: SizeStyle.Medium,
            color: ColorStyle.Blue,
          },
        },
      },
      bindings: {},
    },
  },
  pageStates: {
    page1: {
      id: 'page1',
      selectedIds: [],
      currentParentId: 'page1',
      camera: {
        point: [0, 0],
        zoom: 1,
      },
    },
  },
}
