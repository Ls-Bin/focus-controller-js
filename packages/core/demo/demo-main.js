
var nodeList=[]
const focusWrap = window.document.querySelector('.focus-wrap')
for (var i=0;i<100;i++){
  const child = document.createElement('div');
  child.setAttribute('focusable','focusable')
  child.className=('focus-item')
  focusWrap.appendChild(child)
}

window.scrollTo({top:0})

var forceController = new window['focus-controller-js'].default()

forceController.scrollTo(0)
console.log(forceController)
