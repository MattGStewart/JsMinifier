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
