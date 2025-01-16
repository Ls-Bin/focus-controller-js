export type BaseFocusItem = {
    left: number;
    top: number;
    width: number;
    height: number;
    disabled?: boolean;
    ifShow?: boolean;
    ifParentShow?: boolean;
    el?: Element;
};
export declare function getParentTag(el: any, parents?: any[]): Element[];
export declare function parentShow(el: Element): boolean;
export declare function initFocusableElList(rangeEl?: HTMLElement | undefined): BaseFocusItem[];
