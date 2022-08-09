import React, { useState } from 'react';
import Formula from './Formula';
import Buttons from './Buttons';
import Output from './Output';
import './App.css';

const App = () => {
    const [currentVal, setCurrentVal]=useState('0');
    const [prevVal, setPrevVal]=useState('0');
    const [formula, setFormula]=useState('');
    const [currentSign, setCurrentSign]=useState('pos');
    const [lastClicked, setLastClicked]=useState('');
    const[evaluated, setEvaluated]=useState('false');

    const isOperator = /[x/+‑]/,
    endsWithOperator = /[x+‑/]$/,
    endsWithNegativeSign = /\d[x/+‑]{1}‑$/;

    function maxDigitWarning() {
          setCurrentVal('Digit Limit Met');
          setPrevVal(currentVal);
        setTimeout(() => setCurrentVal(prevVal), 1000);
      }
    
      function handleEvaluate() {
        if (!currentVal.includes('Limit')) {
          let expression = formula;
          while (endsWithOperator.test(expression)) {
            expression = expression.slice(0, -1);
          }
          expression = expression
            .replace(/x/g, '*')
            .replace(/‑/g, '-')
            .replace('--', '+0+0+0+0+0+0+');
          // eslint-disable-next-line no-eval
          let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
          
            setCurrentVal(answer.toString());
            setFormula(
              expression
                .replace(/\*/g, '⋅')
                .replace(/-/g, '‑')
                .replace('+0+0+0+0+0+0+', '‑-')
                .replace(/(x|\/|\+)‑/, '$1-')
                .replace(/^‑/, '-') +
              '=' +
              answer);
            setPrevVal(answer);
            setEvaluated(true);
        }
      }
    
      function handleOperators(e) {
        console.log('handleoperator');
        if (!currentVal.includes('Limit')) {
          const value = e.target.value;
          const formula1= formula;
          const prevVal1=prevVal; 
          const evaluated1 =evaluated ;          
            setCurrentVal(value); setEvaluated(false); 
    
          if (evaluated1) {
                setFormula(prevVal1 + value);
          } else if (!endsWithOperator.test(formula1)) {
              setPrevVal(formula1);
              setFormula(formula1 + value);
          } else if (!endsWithNegativeSign.test(formula1)) {
              setFormula(
                (endsWithNegativeSign.test(formula1 + value) ? formula1 : prevVal1) +
                value)
          } else if (value !== '‑') {
            
              setFormula(prevVal1 + value);
            
          }
        }
      }
    
      function handleNumbers(e) {
        console.log('handlenumberr');

        if (!currentVal.includes('Limit')) {
          const currentVal1= currentVal;
            const formula1= formula;
            const evaluated1 = evaluated ;
          const value = e.target.value;
          setEvaluated(false);
          if (currentVal1.length > 21) {
            maxDigitWarning();
          } else if (evaluated1) {
              setCurrentVal(value);
              setFormula(value !== '0' ? value : '');
                }
          else {
              setCurrentVal(
                currentVal1 === '0' || isOperator.test(currentVal1)
                  ? value
                  : currentVal1 + value);
              setFormula(
                currentVal1 === '0' && value === '0'

                  ? formula1 === ''
                    ? value
                    : formula1
                  : /([^.0-9]0|^0)$/.test(formula1)
                  ? formula1.slice(0, -1) + value
                  : formula1 + value);

          }
        }
      }
    
    function handleDecimal() {
        if (evaluated === true) {
            setCurrentVal('0.');
            setFormula('0.');
            setEvaluated(false);
        } else if (
          !currentVal.includes('.') &&
          !currentVal.includes('Limit')
        ) {
            setEvaluated(false); 
        if (currentVal.length > 21) {
            maxDigitWarning();
          } else if (
            endsWithOperator.test(formula) ||
            (currentVal === '0' && formula === '')
          ) {
              setCurrentVal('0.');
              setFormula(formula + '0.');
          } else {
              setCurrentVal(formula.match(/(-?\d+\.?\d*)$/)[0] + '.');
              setFormula(formula + '.');
          }
        }
      }
    
      function initialize() {
          setCurrentVal('0');
          setPrevVal('0');
          setFormula('');
          setCurrentSign('pos');
          setLastClicked('');
          setEvaluated(false);
      }


  return (
    <div className='app'>
        <div className="calculator">
          <Formula formula={formula.replace(/x/g, '⋅')} />
          <Output currentValue={currentVal} />
          <Buttons
            decimal={handleDecimal}
            evaluate={handleEvaluate}
            initialize={initialize}
            numbers={handleNumbers}
            operators={handleOperators}
          />
        </div>
      </div>
  );
  }
export default App