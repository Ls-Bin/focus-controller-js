import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import MouseWheel from '@better-scroll/mouse-wheel';
import { Options } from "@better-scroll/core/dist/types/Options";

export const name = 'focus-controller-js';

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

export type FocusControllerProps = {
  scrollFn?: (event: any) => void;

  betterScrollOptions?:Record<string, Options>
  // x轴上下偏移
  ruleOffsetX?:[number, number];
  ruleOffsetY?:[number, number];
};

type Direction = 'left' | 'right' | 'up' | 'down';

type DefaultNearData = {
  distances: number[];
  elList: Element[];
  rectList: DOMRect[];
};

/**
 * 电视端焦点控制
 */
class FocusControllerJs {
  rangeEl?: HTMLElement;
  KEYS: Record<string, number[]>;
  scrollCaches: Record<string, BScrollConstructor>;
  limitingEl: any;
  scrollFn?: (event: any, focusedEl: KeyboardEvent) => void;
  scrollTimeout?: NodeJS.Timeout;
  longTimeout?: NodeJS.Timeout;
  longInterval?: NodeJS.Timeout;
  rules: ('rowFirst' | 'columnFirst')[] = [];
  ruleOffsetX?: [number,number] = [0,0];
  ruleOffsetY?: [number,number] = [0,0];

   // betterScroll选项 key为 focus-scroll-key
  betterScrollOptions:Record<string, Options>={}
  constructor(option: FocusControllerProps = {}) {
    this.scrollFn = option?.scrollFn;
    this.betterScrollOptions = option?.betterScrollOptions||{};
    this.ruleOffsetX = option?.ruleOffsetX||[0,0];
    this.ruleOffsetY = option?.ruleOffsetY||[0,0];

    this.KEYS = {
      KEY_LEFT: [37, 21],
      KEY_UP: [38, 19],
      KEY_RIGHT: [39, 22],
      KEY_DOWN: [40, 20],
      KEY_ENTER: [13, 23],
    };

    // 缓存better-scroll
    this.scrollCaches = {};

    this.rules = ['rowFirst', 'columnFirst'];

    this.initScroll();

    document.removeEventListener('keyup', (e) => this.onShortKeyUp(e), false);
    document.removeEventListener(
      'keydown',
      (e) => this.onLongKeyDown(e),
      false,
    );
    document.addEventListener('keyup', (e) => this.onShortKeyUp(e));
    document.addEventListener('keydown', (e) => this.onLongKeyDown(e));

    Object.defineProperty(this, 'limitingEl', {
      get: function () {
        return this._limitingEl;
      },
      set: function (node) {
        if (node) {
          document.querySelectorAll('[focusable]').forEach(function (
            el: Element,
          ) {
            el.setAttribute('focusdisable', '');
            el.removeAttribute('focusable');
          });
          node.querySelectorAll('[focusdisable]').forEach(function (
            el: Element,
          ) {
            el.setAttribute('focusable', '');
            el.removeAttribute('focusdisable');
          });
        } else {
          document.querySelectorAll('[focusable]').forEach(function (
            el: Element,
          ) {
            el.removeAttribute('focusdisable');
          });
          document.querySelectorAll('[focusdisable]').forEach(function (
            el: Element,
          ) {
            el.setAttribute('focusable', '');
            el.removeAttribute('focusdisable');
          });
        }

        this._limitingEl = node;
      },
      enumerable: true,
      configurable: true,
    });
  }

  init() {
    // 控制焦点操作范围
    this.limitingEl = '';
  }

  // 长按
  onLongKeyDown(e: KeyboardEvent) {
    if (this.longTimeout) return;
    this.longTimeout = setTimeout(() => {
      console.log('长按', e);
      // 持续触发按钮
      this.longInterval = setInterval(() => {
        this.keyUpEvent(e);
      }, 150);
    }, 500);
  }

  // 短按
  onShortKeyUp(e: KeyboardEvent) {
    clearTimeout(this.longTimeout);
    this.longTimeout = undefined;
    clearInterval(this.longInterval);
    this.longInterval = undefined;
    this.keyUpEvent(e);
  }
  keyUpEvent(e: KeyboardEvent) {
    let direction = '';
    for (const key in this.KEYS) {
      const item = this.KEYS[key];
      if (item.includes(e.keyCode)) {
        if (key === 'KEY_LEFT') direction = 'left';
        if (key === 'KEY_UP') direction = 'up';
        if (key === 'KEY_RIGHT') direction = 'right';
        if (key === 'KEY_DOWN') direction = 'down';
      }
    }

    if (this.KEYS['KEY_ENTER'].includes(e.keyCode)) {
      const focusedEl: any = document.querySelectorAll('[focused]');
      if (focusedEl.length) {
        focusedEl[0]?.click();
      }
    }
    e.preventDefault();

    if (!direction) return;

    const nextEl = this.getNextFocusEl(<"left" | "right" | "up" | "down">direction);
    if (nextEl) {
      this.setFocus(nextEl);
      this.doScroll( nextEl);
    }

    // 禁止方向键触发滚动
    e.preventDefault();
  }

  requestFocus(e: any) {
    return this.setFocus(e.$el || e);
  }


  setRange(el:HTMLElement|string){
    if(typeof el === 'string'){
      this.rangeEl = document?.querySelector(el)||undefined;
    }else{
      this.rangeEl = el
    }
    console.log('setRange=',el,this.rangeEl);
  }
  clearRange(){
    this.rangeEl=undefined;
  }

  /**
   * 设置焦点
   * @param el
   */
  setFocus(el?: Element|string) {
    let newEl = el
    this.clearFocus();

    if(typeof el === 'string'){
      newEl = document?.querySelector(el)||undefined;
    }
    if(newEl instanceof Element){
      newEl.setAttribute('focused', '');
      newEl.dispatchEvent(new CustomEvent('onFocus', { detail: { el: el } }));
    }


  }

  /**
   * 清除焦点
   * @param el
   */
  clearFocus() {
    document.querySelectorAll('[focused]').forEach(function (b) {
      b.removeAttribute('focused');
      b.dispatchEvent(new CustomEvent('onBlur', { detail: { el: b } }));
    });
  }

  // 优先行选中
  isRowFirstRule(focusedRect:DOMRect, elRect:DOMRect) {
    // console.log('isRowFirstRule=',focusedRect, elRect,focusedRect.top <= elRect.top+(this.ruleOffsetX?.[0]||0),
    //   ( focusedRect.top+focusedRect.height) >= (elRect.top+elRect.height)+(this.ruleOffsetX?.[1]||0)
    //   )
    if(focusedRect.top <= elRect.top+(this.ruleOffsetX?.[0]||0)&&
      (focusedRect.top+focusedRect.height) >= (elRect.top+elRect.height)+(this.ruleOffsetX?.[1]||0)
      ){
      return true
    }
  }
  // 优先列选中
  isColumnFirstRule(focusedRect:DOMRect, elRect:DOMRect) {

    if(focusedRect.left <= elRect.left+(this.ruleOffsetY?.[0]||0)&&
      (focusedRect.left+focusedRect.width) >= (elRect.left+elRect.width)+(this.ruleOffsetY?.[1]||0)
    ){
      return true
    }
  }

  // 获取规则匹配el
  getRulesEl(nearData: DefaultNearData, focusedRect:DOMRect) {
    let res = null;
    const ruleMap: Record<string, any[]> = {};
    this.rules.forEach((rule) => {
      if (!ruleMap[rule]) ruleMap[rule] = [];
      nearData.rectList.forEach((rect, index) => {
        switch (rule) {
          case 'rowFirst': {
            const is = this.isRowFirstRule(focusedRect, rect);
            if (is) ruleMap[rule][index] = rect;
            break;
          }
          case 'columnFirst': {
            const is = this.isColumnFirstRule(focusedRect, rect);
            if (is) ruleMap[rule][index] = rect;
            break;
          }
        }
      });
    });

    this.rules.some((rule) => {
      const arr = ruleMap[rule];
      if (arr.length) {
        const distances: any[] = [];
        const elList: any[] = [];
        const rectList: any[] = [];
        arr.forEach((item, index) => {
          if (item) {
            distances.push(nearData.distances[index]);
            elList.push(nearData.elList[index]);
            rectList.push(nearData.rectList[index]);
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

  /**
   * 获取最近元素
   * @param direction -方向
   * @param elList
   * @param focusedRect
   */
  getNearEl(
    direction: Direction,
    elList: NodeListOf<Element>,
    focusedRect: DOMRect,
  ): DefaultNearData {
    const distances: number[] = [];
    const list: Element[] = [];
    const rectList: DOMRect[] = [];
    const focusedCenter = [
      focusedRect.left + focusedRect.width / 2,
      focusedRect.top + focusedRect.height / 2,
    ]; //中心点[x,y]

    elList.forEach((_el, ) => {
      if (
        'none' !== window.getComputedStyle(_el).display &&
        this.parentShow(_el)
      ) {
        const elRect = _el.getBoundingClientRect();
        const elCenter = [
          elRect.left + elRect.width / 2,
          elRect.top + elRect.height / 2,
        ]; //中心点[x,y]

        if ('left' === direction && focusedRect.left > elCenter[0]) {
          distances.push(this.getPointDistances(elCenter, focusedCenter));
          list.push(_el);
          rectList.push(elRect);
        }
        if ('right' === direction && focusedRect.right < elCenter[0]) {
          distances.push(this.getPointDistances(elCenter, focusedCenter));
          list.push(_el);
          rectList.push(elRect);
        }
        if ('up' === direction && focusedRect.top > elCenter[1]) {
          distances.push(this.getPointDistances(elCenter, focusedCenter));
          list.push(_el);
          rectList.push(elRect);
        }
        if ('down' === direction && focusedRect.bottom < elCenter[1]) {
          distances.push(this.getPointDistances(elCenter, focusedCenter));
          list.push(_el);
          rectList.push(elRect);
        }
      } else {
        console.log('没有显示的元素');
      }
    });

    return { distances, elList: list, rectList };
  }

  /**
   * 获取下个焦点
   * @param direction -方向
   */
  getNextFocusEl(direction: Direction) {
    console.time('getNextFocusEl');
    // @ts-ignore
    let focusableElList:NodeListOf<Element> = [];
    // @ts-ignore
    let focusedEls:NodeListOf<Element> = [];
      if(this.rangeEl){
        focusableElList=  this.rangeEl.querySelectorAll('[focusable]')
        focusedEls= this.rangeEl.querySelectorAll('[focused]')
      }else {
         focusableElList = document.querySelectorAll('[focusable]');
         focusedEls = document.querySelectorAll('[focused]');
      }
    if (!focusableElList.length) return;

    if (
      // 没已选焦点
      !focusedEls.length ||
      // 焦点在限制范围外
      focusedEls[0].getAttribute('focusdisable') !== null
    )
      return focusableElList[0];

    let focusedEl = focusedEls[0];

    const focusedRect = focusedEl.getBoundingClientRect();
    // 按键方向的元素列表
    const defaultNearData = this.getNearEl(
      direction,
      focusableElList,
      focusedRect,
    );

    // 规则匹配el
    const ruleEl = this.getRulesEl(defaultNearData, focusedRect);

    if (ruleEl) {
      focusedEl = ruleEl;
    } else {
      // 不匹配走默认逻辑
      const distances: any[] = defaultNearData.distances;
      // 设置最近距离的元素
      if (distances.filter((d) => d).length) {
        const min = Math.min(...distances.filter((d) => d));
        focusedEl = defaultNearData.elList[distances.indexOf(min)];
      }
    }

    console.timeEnd('getNextFocusEl');
    return focusedEl;
  }


  /**
   * 执行滚动
   * @param focusedEl
   */
  doScroll( focusedEl: any) {

    const parentElList = this.getParentTag(focusedEl)
   const scrollEl =   parentElList.find(el=>el.getAttribute('focus-scroll-key'))

    if(scrollEl){
      if (this.scrollFn) {
        this.scrollFn(focusedEl.offsetTop, focusedEl);
      } else {
        const cacheId:string = scrollEl.getAttribute('focus-scroll-key')||''
        if (this.scrollCaches[cacheId]) {
          // this.scrollCaches[cacheId].stop();

          // 节流期间跳过动画
          if (!this.scrollTimeout) {
            //@ts-ignore
            if (cacheId&&this.scrollCaches[cacheId]?.scrollToElement) {
              console.log('执行滚动动画', cacheId, this.scrollCaches[cacheId]);
              this.scrollCaches[cacheId]?.scrollToElement(
                focusedEl,
                300,
                true,
                true,
              );
            }
          }

          // 节流
          if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
          this.scrollTimeout = setTimeout(() => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = undefined;
          }, 50);
        }
      }
    }

  }

  /**
   * 计算2点距离
   * @param point1
   * @param point2
   * @returns {number}
   */
  getPointDistances(point1 = [0, 0], point2 = [0, 0]) {
    const dx = Math.abs(point1[0] - point2[0]);
    const dy = Math.abs(point1[1] - point2[1]);
    // 计算2个中心点距离
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  }

  // 设置滚动
  initScroll(betterScrollOptions?:Record<string, Options>) {
    this.betterScrollOptions = betterScrollOptions||this.betterScrollOptions||{};
    // 先全部禁用
    for (const key in this.scrollCaches) {

        this.scrollCaches[key].disable();
    }

    const scrollElList = document.querySelectorAll('[focus-scroll-key]')
    let scrollIds:any[] =[]

    scrollElList.forEach(el=>{
      scrollIds.push(el.getAttribute('focus-scroll-key')||'');
    })
    scrollIds = [...new Set(scrollIds)]

    scrollIds.forEach(cacheId=>{
        this.scrollCaches[cacheId] = new BScroll(cacheId, {
          // ...... 详见配置项 https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html#disabletouch
          //   disableMouse: false,
          //   disableTouch: false,
          // scrollX: true,
          // freeScroll: true,
          // probeType: 3,
          // preventDefault: false,
          // mouseWheel: true,
          // scrollbar: {
          //   fade: true,
          // },
          // bounce: false, //边缘回弹动画

          ...(this.betterScrollOptions[cacheId]||{})
        });

    })


  }

  // 重新计算滚动高度和宽度
  scrollReFresh(){
    for (const key in this.scrollCaches) {
      this.scrollCaches[key].refresh();
    }
  }
  getParentTag(el: any, parents: any[] = []): Element[] {
    return el instanceof HTMLElement
      ? 'BODY' !== el.parentElement?.nodeName
        ? (parents.push(el.parentElement),
          this.getParentTag(el.parentElement, parents))
        : parents
      : [];
  }
  parentShow(el: Element) {
    return this.getParentTag(el)?.filter(function (c: Element) {
      return 'none' === window.getComputedStyle(c).display;
    }).length
      ? false
      : true;
  }

  resetScrollEl() {
    for (const key in this.scrollCaches) {
      this.scrollCaches[key].destroy();
    }
    this.scrollCaches = {};

    document.querySelectorAll('[tv-scroll]').forEach((el) => {
      el.removeAttribute('tv-scroll');
    });
  }
}

export default FocusControllerJs;

// window.FocusControllerJs = FocusControllerJs
