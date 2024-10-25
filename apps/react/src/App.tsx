import './App.css';

import FocusControllerJs from 'focus-controller-js';
import { useEffect, useMemo } from "react";
function onKeyDown(event: KeyboardEvent) {
  // stop page scroll
  event.preventDefault();
}


const focusController = new FocusControllerJs();



const App = () => {
  useEffect(() => {
    const el = document.querySelector('.focus-item') || undefined;
    console.log(el);
    focusController.setFocus(el);
    document.removeEventListener('keydown', onKeyDown);
    document.addEventListener('keydown', onKeyDown);
  },[]);


  return (
    <div className="content">
      {Array.from(Array(10), (e, i) => {
        return <div className="focus-item" focusable="focusable" tabindex="-1" key={i}>{i}</div>
      })}
      {Array.from(Array(20), (e, i) => {
        return <div className="focus-item" focusable="focusable" tabindex="-1" style={{width:'53px'}} key={i}>{i}</div>
      })}
      {Array.from(Array(10), (e, i) => {
        return <div className="focus-item" focusable="focusable" tabindex="-1" style={{width:'234px'}} key={i}>{i}</div>
      })}
    </div>
  );
};

export default App;
