import * as escodegen from 'https://cdn.skypack.dev/escodegen@2.0.0';
import * as esprima from 'https://cdn.skypack.dev/esprima@4.0.1';
import * as Terser from 'https://cdn.skypack.dev/terser@5.10.0';
import * as eslint from 'https://cdn.skypack.dev/eslint@7.32.0';
import { init } from './codeMirror.js';

init();

class MinifierApp {
  constructor() {
    this.inputEditor = document.getElementById('input-editor');
    this.outputEditor = document.getElementById('output-editor');
    this.minifyButton = document.getElementById('start');
    this.copyButton = document.getElementById('copy');
    this.clearButton = document.getElementById('clear');
    this.loadSampleButton = document.getElementById('load-sample');
    this.dragDropArea = document.getElementById('drag-drop-area');
    this.init();
  }

  async init() {
    this.minifyButton.addEventListener('click', this.minify.bind(this));
    this.copyButton.addEventListener('click', this.copyToClipboard.bind(this));
    this.clearButton.addEventListener('click', this.clear.bind(this));
    this.loadSampleButton.addEventListener('click', this.loadSampleCode.bind(this));
    this.createDragDropArea();

    // Initialize CodeMirror instances for input and output
    this.codeMirrorInput = CodeMirror(this.inputEditor, {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'default',
      matchBrackets: true,
    });
    this.codeMirrorOutput = CodeMirror(this.outputEditor, {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'default',
      readOnly: true,
      matchBrackets: true,
    });
  }

  async minify() {
    const inputCode = this.codeMirrorInput.getValue();
    const lintedAndFixedCode = await lintAndFix(inputCode);

    const worker = new Worker('minifierWorker.js');
    worker.postMessage(lintedAndFixedCode);

    worker.onmessage = (event) => {
      if (event.data.minified) {
        this.codeMirrorOutput.setValue(event.data.minified);
      } else if (event.data.error) {
        this.codeMirrorOutput.setValue(`/* ${event.data.error} */`);
      }
    };
  }

  // ... (rest of the class methods)
}

const app = new MinifierApp();

const downloadButton = document.getElementById("download");

downloadButton.addEventListener("click", () => {
  const outputText = app.codeMirrorOutput.getValue();
  const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "minified-output.txt";
  a.click();
  URL.revokeObjectURL(url);
});

async function lintAndFix(code) {
  const { Linter } = eslint;
  const linter = new Linter();

  const defaultConfig = {
    env: { es2022: true },
    parserOptions: { ecmaVersion: 2022 },
    rules: { /* Add any custom rules here */ },
  };

  const messages = linter.verifyAndFix(code, defaultConfig);
  return messages.fixed ? messages.output : code;
}
