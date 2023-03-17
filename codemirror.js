import CodeMirror from 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.0/codemirror.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.0/mode/javascript/javascript.min.js';

export function init() {
  const inputArea = document.getElementById('input');
  const outputArea = document.getElementById('output');

  CodeMirror(inputArea, {
    mode: 'javascript',
    lineNumbers: true,
    scrollbarStyle: 'null',
  });

  CodeMirror(outputArea, {
    mode: 'javascript',
    lineNumbers: true,
    scrollbarStyle: 'null',
    readOnly: true,
  });
}
