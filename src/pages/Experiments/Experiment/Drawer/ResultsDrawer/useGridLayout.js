import { useMemo } from 'react';
import { ADD_CARD_KEY } from './constants';

export default (figures = []) => {
  return useMemo(() => {
    let totalW = 0;

    const gridItems = figures.map((item) => {
      let itemLayout = item.layout;

      if (!itemLayout) {
        itemLayout = {
          x: (Math.floor(totalW / 6) % 2) * 6,
          y: 99999,
          w: 6,
          h: 10,
        };
      }

      totalW += itemLayout.w;
      itemLayout.i = item.id;
      itemLayout.minW = 4;
      itemLayout.minH = 10;

      return itemLayout;
    });

    gridItems.push({
      i: ADD_CARD_KEY,
      x: (Math.floor(totalW / 6) % 2) * 6,
      y: 99999,
      w: 6,
      h: 2,
      isBounded: true,
      isDraggable: true,
      isResizable: false,
    });

    return gridItems;
  }, [figures]);
};
