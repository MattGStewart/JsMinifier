import CodeMirror from 'https://cdn.skypack.dev/codemirror@5.65.2';
import 'https://cdn.skypack.dev/codemirror@5.65.2/mode/javascript/javascript.js';
import 'https://cdn.skypack.dev/codemirror@5.65.2/mode/xml/xml.js';
import 'https://cdn.skypack.dev/codemirror@5.65.2/mode/css/css.js';
import 'https://cdn.skypack.dev/codemirror@5.65.2/addon/selection/active-line.js';

const inputEditor = CodeMirror(document.getElementById('input-editor'), {
  mode: 'javascript',
  lineNumbers: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  theme: 'vscode-dark',
  styleActiveLine: true
});

const outputEditor = CodeMirror(document.getElementById('output-editor'), {
  mode: 'javascript',
  lineNumbers: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  theme: 'vscode-dark',
  readOnly: true,
  styleActiveLine: true
});

export { inputEditor, outputEditor };
