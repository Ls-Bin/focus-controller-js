import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
import MouseWheel from '@better-scroll/mouse-wheel';

export const name = 'focus-controller-js';

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

// let bs = new BScroll('.wrapper', {
//   // ...... 详见配置项
//   // scrollY: true,
//   freeScroll: true,
//   probeType: 3,
//   // click: true,
//   // preventDefault: false,
//   scrollbar: {
//     // fade: false,
//     minSize: 30,
//   },
// });
export type FocusControllerProps={
  scrollFn?:(event:any)=>void
}


/**
 * 电视端焦点控制
 */
 class FocusControllerJs {
  scrollElId:string
  KEYS:Record<string, number[]>
  scrollCaches:Record<string, BScrollConstructor>
  limitingEl:any
  scrollFn?: (event: any, focusedEl: KeyboardEvent)=>void
  scrollTimeout?:NodeJS.Timeout
  longTimeout?:NodeJS.Timeout
  longInterval?:NodeJS.Timeout
  constructor(option:FocusControllerProps = {}) {
    this.scrollFn = option?.scrollFn;

    this.scrollElId = '.scroll-wrap';

    this.KEYS = {
      KEY_LEFT: [37, 21],
      KEY_UP: [38, 19],
      KEY_RIGHT: [39, 22],
      KEY_DOWN: [40, 20],
      KEY_ENTER: [13, 23],
    };

    // 缓存better-scroll
    this.scrollCaches = {};

    this.initScroll()


    document.removeEventListener('keyup',(e)=> this.onShortKeyUp(e), false);
    document.removeEventListener('keydown',(e)=> this.onLongKeyDown(e), false);
    document.addEventListener('keyup', (e)=> this.onShortKeyUp(e));
    document.addEventListener('keydown', (e)=> this.onLongKeyDown(e));

    Object.defineProperty(this, 'limitingEl', {
      get: function() {
        return this._limitingEl;
      },
      set: function(node) {
        if (node) {
          document.querySelectorAll('[focusable]').forEach(function(el:Element) {
            el.setAttribute('focusdisable', '');
            el.removeAttribute('focusable');
          });
          node.querySelectorAll('[focusdisable]').forEach(function(el:Element) {
            el.setAttribute('focusable', '');
            el.removeAttribute('focusdisable');
          });
        } else {
          document.querySelectorAll('[focusable]').forEach(function(el:Element) {
            el.removeAttribute('focusdisable');
          });
          document.querySelectorAll('[focusdisable]').forEach(function(el:Element) {
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
  onLongKeyDown(e:KeyboardEvent){

    if(this.longTimeout)return
    this.longTimeout = setTimeout(() => {
      console.log("长按",e);
      // 持续触发按钮
      this.longInterval = setInterval(()=>{
        this.keyUpEvent(e)
      },150)
    }, 500);
  }

  // 短按
  onShortKeyUp(e:KeyboardEvent){
    clearTimeout(this.longTimeout)
    this.longTimeout = undefined
    clearInterval(this.longInterval)
    this.longInterval = undefined
    this.keyUpEvent(e)
  }
  keyUpEvent( e:KeyboardEvent) {
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
      const focusedEl:any = document.querySelectorAll('[focused]');
      if (focusedEl.length) {

        focusedEl[0]?.click();
      }
    }
    e.preventDefault();

    if (!direction) return;

    const nextEl = this.getNextFocusEl(direction);
    if (nextEl) {
      this.setFocus(nextEl);
        this.doScroll('scrollTop', nextEl, );
    }

    // 禁止方向键触发滚动
    e.preventDefault();
  }

  requestFocus(e:any) {
    return this.setFocus(e.$el || e);
  }

  /**
   * 设置焦点
   * @param el
   */
  setFocus(el:Element) {
    this.clearFocus();

    el.classList.add('focus');
    el.setAttribute('focused', '');
    el.dispatchEvent(new CustomEvent('onFocus', { detail: { el: el } }));
  }

  /**
   * 清除焦点
   * @param el
   */
  clearFocus() {
    document.querySelectorAll('[focused]').forEach(function(b) {
      b.removeAttribute('focused');
      b.classList.remove('focus');
      b.dispatchEvent(new CustomEvent('onBlur', { detail: { el: b } }));
    });
  }

  /**
   * 获取下个焦点
   * @param direction -方向
   */
  getNextFocusEl(direction:string) {
    console.time('getNextFocusEl');
    const focusableEl = document.querySelectorAll('[focusable]');
    const focusedEl = document.querySelectorAll('[focused]');

    if (!focusableEl.length) return;

    if (
      // 没已选焦点
      !focusedEl.length ||
      // 焦点在限制范围外
      focusedEl[0].getAttribute('focusdisable') !== null
    )
      return focusableEl[0];

    let el = focusedEl[0];

    // console.dir(el);
    // console.dir(focusedEl);
    // console.log(el.getAttribute('focusdisable'));

    // console.log('focusedEl', focusedEl, el.getBoundingClientRect());
    // console.log(el === focusableEl[0], el === focusableEl[0]);
    const focusedRect = el.getBoundingClientRect();
    const elCenter = [focusedRect.left + focusedRect.width / 2, focusedRect.top + focusedRect.height / 2]; //中心点[x,y]

    const distances:any[] = [];

    // let
    focusableEl.forEach((_el, index) => {
      const rect = _el.getBoundingClientRect();
      const focusableCenter = [rect.left + rect.width / 2, rect.top + rect.height / 2]; //中心点[x,y]

      distances.push(null);

      if ('none' !== window.getComputedStyle(_el).display && this.parentShow(_el)) {
        if ('left' === direction && focusedRect.left > focusableCenter[0]) {
          distances[index] = this.getPointDistances(focusableCenter, elCenter);
        }
        if ('right' === direction && focusedRect.right < focusableCenter[0]) {
          distances[index] = this.getPointDistances(focusableCenter, elCenter);
        }
        if ('up' === direction && focusedRect.top > focusableCenter[1]) {
          distances[index] = this.getPointDistances(focusableCenter, elCenter);
        }
        if ('down' === direction && focusedRect.bottom < focusableCenter[1]) {
          distances[index] = this.getPointDistances(focusableCenter, elCenter);
        }
      } else {
        console.log('没有显示的元素');
      }
    });

    // 设置最近距离的元素
    if (distances.filter(d => d).length) {
      const min = Math.min(...distances.filter(d => d));
      el = focusableEl[distances.indexOf(min)];
    }

    console.timeEnd('getNextFocusEl');
    return el;
  }

  scrollTo(x:number,y:number)  {
    this.scrollCaches[this.scrollElId].scrollTo(x,y)
  }


  /**
   * 执行滚动
   * @param scrollType- 可选: scrollTop | scrollLeft
   * @param focusedEl
   */
  doScroll(scrollType:'scrollTop' | 'scrollLeft', focusedEl:any) {
    // 上下滚动
    if (scrollType === 'scrollTop') {
      if (this.scrollFn) {
        this.scrollFn(focusedEl.offsetTop, focusedEl);
      } else {
        const cacheId = this.scrollElId
        if ( this.scrollCaches[cacheId]) {
          // this.scrollCaches[cacheId].stop();

          // 节流期间跳过动画
          if (!this.scrollTimeout) {

            this.scrollCaches[cacheId].scrollToElement(focusedEl, 300, true, true);
            // this.scrollCaches[cacheId].scrollToElement(focusedEl, 150, true, -focusedEl.offsetHeight);
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

    // 左右滚动
    if (scrollType === 'scrollLeft') {
      // scrollEl.scrollTo({ left: num, behavior: 'smooth' });
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
  initScroll() {
    // 先全部禁用
    for (const key in this.scrollCaches) {
      this.scrollCaches[key].disable();
    }

    const cacheId =this.scrollElId
    if (this.scrollCaches[cacheId]) {
      this.scrollCaches[cacheId].refresh();
      this.scrollCaches[cacheId].enable();
    } else {
      this.scrollCaches[cacheId] = new BScroll(this.scrollElId,
        {
        // ...... 详见配置项 https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html#disabletouch
        //   disableMouse: false,
        //   disableTouch: false,
        // freeScroll: true,
        // probeType: 3,
        // preventDefault: false,
        // mouseWheel: true,
        // scrollbar: {
        //   fade: true,
        // },
          bounce:false //边缘回弹动画
      }
      );
    }
  }

  getParentTag(el:any, parents:any[] = []) :Element[]{
    return el instanceof HTMLElement
      ? 'BODY' !== el.parentElement?.nodeName
        ? (parents.push(el.parentElement), this.getParentTag(el.parentElement, parents))
        : parents
      : [];
  }
  parentShow(el:Element) {
    return this.getParentTag(el)?.filter(function(c:Element) {
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

    document.querySelectorAll('[tv-scroll]').forEach(el => {
      el.removeAttribute('tv-scroll');
    });
  }
}

export default FocusControllerJs

// window.FocusControllerJs = FocusControllerJs
