import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import { Options } from "@better-scroll/core/dist/types/Options";
import { BaseFocusItem } from "../utils/base";
export declare const name = "focus-controller-js";
export type FocusControllerProps = {
    scrollFn?: (event: any) => void;
    betterScrollOptions?: Record<string, Options>;
    ruleOffsetX?: [number, number];
    ruleOffsetY?: [number, number];
};
export type Direction = 'left' | 'right' | 'up' | 'down';
type DefaultNearData = {
    distances: number[];
    elList: Element[];
    rectList: BaseFocusItem[];
};
/**
 * 电视端焦点控制
 */
declare class FocusControllerJs {
    rangeEl?: HTMLElement;
    KEYS: Record<string, number[]>;
    scrollCaches: Record<string, BScrollConstructor>;
    scrollFn?: (event: any, focusedEl: KeyboardEvent) => void;
    scrollTimeout?: NodeJS.Timeout;
    longTimeout?: NodeJS.Timeout;
    longInterval?: NodeJS.Timeout;
    rules: ('rowFirst' | 'columnFirst')[];
    ruleOffsetX?: [number, number];
    ruleOffsetY?: [number, number];
    betterScrollOptions: Record<string, Options>;
    constructor(option?: FocusControllerProps);
    onLongKeyDown(e: KeyboardEvent): void;
    onShortKeyUp(e: KeyboardEvent): void;
    keyUpEvent(e: KeyboardEvent): void;
    requestFocus(e: any): void;
    setRange(el: HTMLElement | string): void;
    clearRange(): void;
    /**
     * 设置焦点
     * @param el
     */
    setFocus(el?: Element | string): void;
    /**
     * 清除焦点
     * @param el
     */
    clearFocus(): void;
    getRulesEl(nearData: DefaultNearData, focusedRect: BaseFocusItem): null;
    /**
     * 获取最近元素
     * @param direction -方向
     * @param elList
     * @param focusedRect
     */
    getNearEl(direction: Direction, elList: BaseFocusItem[], focusedRect: DOMRect): DefaultNearData;
    /**
     * 获取下个焦点
     * @param direction -方向
     */
    getNextFocusEl(direction: Direction): any;
    /**
     * 执行滚动
     * @param focusedEl
     */
    doScroll(focusedEl: any): void;
    /**
     * 计算2点距离
     * @param point1
     * @param point2
     * @returns {number}
     */
    getPointDistances(point1?: number[], point2?: number[]): number;
    initScroll(betterScrollOptions?: Record<string, Options>): void;
    scrollReFresh(): void;
    resetScrollEl(): void;
}
export default FocusControllerJs;
