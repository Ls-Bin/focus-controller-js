
var nodeList=[]
const focusWrap = window.document.querySelector('.focus-wrap')
for (var i=0;i<100;i++){
  const child = document.createElement('div');
  child.setAttribute('focusable','focusable')
  child.className=('focus-item')
  focusWrap.appendChild(child)
}


var forceController = new window['focus-controller-js'].default()

console.log(forceController)
