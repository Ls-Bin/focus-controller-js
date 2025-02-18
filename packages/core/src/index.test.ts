import FocusControllerJs   from './index';
function renderHtml(){
  document.body.innerHTML = `
  <div class="scroll-wrap">
    <div class="focus-wrap">
    test
    </div>
    <div class="focus-range"></div>
  </div>
  `;

  const focusWrap = document.querySelector('.focus-wrap')
  for (let i=0;i<100;i++){
    const child = document.createElement('div');
    child.setAttribute('focusable','focusable')
    child.setAttribute('data-index',i)
    child.style.width = '100px'
    child.style.height = '100px'
    child.className=('focus-item')
    focusWrap?.appendChild(child)
  }
}

// const { JSDOM } = require("jsdom");

describe('FocusControllerJs', () => {

  let focusController: FocusControllerJs;

  beforeEach(() => {
    renderHtml()
    focusController = new FocusControllerJs();
  });


  it('查找 focusable 元素', () => {
    expect(document.querySelector('[focusable]')).not.toBeUndefined();
    expect(document.querySelector('[focused]')).toBeNull();
  });

   it('getNextFocusEl_NoFocusableElements_ReturnsUndefined', () => {
     expect(document.querySelector('[focused]')).toBeNull();
     // 模拟没有可聚焦元素
     const result = focusController.getNextFocusEl('right');
     expect(result).not.toBeUndefined();
   });

  it('禁用元素不能设置焦点', () => {
    document.querySelector('[focusable]')?.setAttribute('focusdisable', 'focusdisable')
    expect(document.querySelector('[focusable]'))?.toHaveAttribute('focusdisable');
    const result = focusController.getNextFocusEl('right');
    expect(result).not?.toHaveAttribute('focusdisable');
  });


    it('限制焦点范围', () => {
      focusController.setRange('.focus-range')
      const result = focusController.getNextFocusEl('right');

      expect(result).toBeUndefined();

      // 添加元素是否在焦点内的
      const focusWrap = document.querySelector('.focus-range')
      for (let i=0;i<10;i++){
        const child = document.createElement('div');
        child.setAttribute('focusable','focusable')
        child.setAttribute('data-in-range','true')
        child.style.width = '50px'
        child.style.height = '50px'
        child.className=('focus-item')
        focusWrap?.appendChild(child)
      }
      const newResult = focusController.getNextFocusEl('right');
      expect(newResult.getAttribute('data-in-range')).toBe('true');
  });


//
//   it('getNextFocusEl_FocusOutsideRange_ReturnsFirstFocusableElement', () => {
//     // 模拟可聚焦元素和焦点在限制范围之外
//     const mockInitFocusableElList = jest.fn().mockReturnValue([{}]);
//     focusController['initFocusableElList'] = mockInitFocusableElList;
//
//     const mockFocusedEls = document.querySelectorAll('[focused]');
//     mockFocusedEls[0].setAttribute('focusdisable', '');
//
//     const result = focusController.getNextFocusEl('right');
//     expect(result).toBe(mockInitFocusableElList()[0]);
//   });
//
//   it('getNextFocusEl_ValidFocusableElements_ReturnsNextFocusElement', () => {
//     // 模拟可聚焦元素和当前焦点在限制范围内
//     const mockInitFocusableElList = jest.fn().mockReturnValue([{}]);
//     focusController['initFocusableElList'] = mockInitFocusableElList;
//
//     const mockFocusedEls = document.querySelectorAll('[focused]');
//     mockFocusedEls[0].removeAttribute('focusdisable');
//
//     const mockGetNearEl = jest.fn().mockReturnValue({ distances: [1], elList: [{}] });
//     focusController['getNearEl'] = mockGetNearEl;
//
//     const result = focusController.getNextFocusEl('right');
//     expect(result).toBe(mockGetNearEl().elList[0]);
//   });
//
//   it('getNextFocusEl_RuleMatch_ReturnsRuleElement', () => {
//     // 模拟规则匹配下一个焦点元素
//     const mockInitFocusableElList = jest.fn().mockReturnValue([{}]);
//     focusController['initFocusableElList'] = mockInitFocusableElList;
//
//     const mockFocusedEls = document.querySelectorAll('[focused]');
//     mockFocusedEls[0].removeAttribute('focusdisable');
//
//     const mockGetNearEl = jest.fn().mockReturnValue({ distances: [1], elList: [{}] });
//     focusController['getNearEl'] = mockGetNearEl;
//
//     const mockGetRulesEl = jest.fn().mockReturnValue({});
//     focusController['getRulesEl'] = mockGetRulesEl;
//
//     const result = focusController.getNextFocusEl('right');
//     expect(result).toBe(mockGetRulesEl());
//   });
//
//   it('getNextFocusEl_NoRuleMatch_ReturnsClosestElement', () => {
//     // 模拟没有规则匹配，返回距离最近的元素
//     const mockInitFocusableElList = jest.fn().mockReturnValue([{}]);
//     focusController['initFocusableElList'] = mockInitFocusableElList;
//
//     const mockFocusedEls = document.querySelectorAll('[focused]');
//     mockFocusedEls[0].removeAttribute('focusdisable');
//
//     const mockGetNearEl = jest.fn().mockReturnValue({ distances: [1], elList: [{}] });
//     focusController['getNearEl'] = mockGetNearEl;
//
//     const mockGetRulesEl = jest.fn().mockReturnValue(null);
//     focusController['getRulesEl'] = mockGetRulesEl;
//
//     const result = focusController.getNextFocusEl('right');
//     expect(result).toBe(mockGetNearEl().elList[0]);
//   });
 });
