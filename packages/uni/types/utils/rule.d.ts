import { BaseFocusItem } from "./base";
export declare function isRowFirstRule(focusedRect: BaseFocusItem, elRect: BaseFocusItem, ruleOffsetX?: [number, number]): true | undefined;
export declare function isColumnFirstRule(focusedRect: BaseFocusItem, elRect: BaseFocusItem, ruleOffsetY?: [number, number]): true | undefined;
export declare function getRulesEl(options: {
    focusedRect: DOMRect;
    rectList: BaseFocusItem[];
    rules: ('rowFirst' | 'columnFirst')[];
    ruleOffsetX: [number, number];
    ruleOffsetY: [number, number];
}): null;
