import { useCallback } from 'react';
import { ADD_CARD_KEY } from './constants';

export default (figures) => {
  return useCallback(
    (layout, _, newItem) => {
      if (newItem.i === ADD_CARD_KEY) return;

      for (const layoutItem of layout) {
        if (layoutItem.i !== ADD_CARD_KEY) {
          let compareResult = figures.find((item) => item.id === layoutItem.i);
          if (!compareResult) continue;

          compareResult.layout = {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
      }
    },
    [figures]
  );
};
