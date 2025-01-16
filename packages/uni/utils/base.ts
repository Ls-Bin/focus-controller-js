export  type BaseFocusItem ={
  left:number
  top:number
  width:number
  height:number
  disabled?:boolean
  ifShow?:boolean
  ifParentShow?:boolean
  el?:Element
}


export function getParentTag(el: any, parents: any[] = []): Element[] {
  return el instanceof HTMLElement
    ? 'BODY' !== el.parentElement?.nodeName
      ? (parents.push(el.parentElement),
        getParentTag(el.parentElement, parents))
      : parents
    : [];
}

export function parentShow(el: Element) {
  return getParentTag(el)?.filter(function (c: Element) {
    return 'none' === window.getComputedStyle(c).display;
  }).length
    ? false
    : true;
}


export function initFocusableElList(rangeEl?: HTMLElement | undefined) {
  let focusableElList: NodeListOf<Element> ;
  const focusItemList: BaseFocusItem[] = [];
  if (rangeEl) {
    focusableElList = rangeEl.querySelectorAll('[focusable]');
  } else {
    focusableElList = document.querySelectorAll('[focusable]');
  }

  focusableElList?.forEach(function (el) {
    const elRect = el.getBoundingClientRect();
    focusItemList.push({
      left: elRect.left,
      top: elRect.top,
      width: elRect.width,
      height: elRect.height,
      disabled: !!el.getAttribute('focusdisable'),
      ifParentShow:parentShow(el),
      ifShow:'none' !== window.getComputedStyle(el).display,
      el
    });
  });

  return focusItemList;
}
