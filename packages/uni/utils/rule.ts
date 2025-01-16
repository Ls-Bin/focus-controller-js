// 优先行选中
import { BaseFocusItem } from "./base";

export function isRowFirstRule(focusedRect:BaseFocusItem, elRect:BaseFocusItem, ruleOffsetX?:[number,number]) {
  // console.log('isRowFirstRule=',focusedRect, elRect,focusedRect.top <= elRect.top+(this.ruleOffsetX?.[0]||0),
  //   ( focusedRect.top+focusedRect.height) >= (elRect.top+elRect.height)+(this.ruleOffsetX?.[1]||0)
  //   )
  if(focusedRect.top <= elRect.top+(ruleOffsetX?.[0]||0)&&
    (focusedRect.top+focusedRect.height) >= (elRect.top+elRect.height)+(ruleOffsetX?.[1]||0)
  ){
    return true
  }
}
// 优先列选中
export function  isColumnFirstRule(focusedRect:BaseFocusItem, elRect:BaseFocusItem,ruleOffsetY?:[number,number]) {

  if(focusedRect.left <= elRect.left+(ruleOffsetY?.[0]||0)&&
    (focusedRect.left+focusedRect.width) >= (elRect.left+elRect.width)+(ruleOffsetY?.[1]||0)
  ){
    return true
  }
}


// 获取规则匹配el
export function getRulesEl(
options:{
  focusedRect:DOMRect
  rectList: BaseFocusItem[],
  rules:('rowFirst'|'columnFirst')[]
  ruleOffsetX:[number,number]
  ruleOffsetY:[number,number]
}
) {
  let res = null;
  const ruleMap: Record<string, any[]> = {};
  options.rules.forEach((rule) => {
    if (!ruleMap[rule]) ruleMap[rule] = [];
    options.rectList.forEach((rect, index) => {
      switch (rule) {
        case 'rowFirst': {
          const is = isRowFirstRule(options.focusedRect, rect,options.ruleOffsetX);
          if (is) ruleMap[rule][index] = rect;
          break;
        }
        case 'columnFirst': {
          const is = isColumnFirstRule(options.focusedRect, rect,options.ruleOffsetY);
          if (is) ruleMap[rule][index] = rect;
          break;
        }
      }
    });
  });

  options.rules.some((rule) => {
    const arr = ruleMap[rule];
    if (arr.length) {
      const distances: any[] = [];
      const elList: any[] = [];
      arr.forEach((item, index) => {
        if (item) {
          // distances.push(options.distances[index]);
          // elList.push(options.elList[index]);
        }
      });
      const min = Math.min(...distances.filter((d) => d));
      res = elList[distances.indexOf(min)];
      console.log('使用规则获取el:',rule,res);
      if(res) return true
    }
  });

  return res;
}
