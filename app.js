// Part 1
import * as escodegen from 'https://cdn.skypack.dev/escodegen@2.0.0';
import * as esprima from 'https://cdn.skypack.dev/esprima@4.0.1';
import * as Terser from 'https://cdn.skypack.dev/terser@5.10.0';
import { init } from './codeMirror.js';

init();

initCodeMirror();



class MinifierApp {
  constructor() {
    this.input = document.getElementById('input');
    this.output = document.getElementById('output');
    this.minifyButton = document.getElementById('minify');
    this.copyButton = document.getElementById('copy');
    this.clearButton = document.getElementById('clear');
    this.loadSampleButton = document.getElementById('load-sample');
    this.dragDropArea = document.getElementById('drag-drop-area');
    this.startButton = document.getElementById('start');
    this.stopButton = document.getElementById('stop');
    this.refreshButton = document.getElementById('refresh');
    this.timerDisplay = document.getElementById('timer-display');
    this.startTime = 0;
    this.init();
  }

  async init() {
    this.minifyButton.addEventListener('click', this.minify.bind(this));
    this.copyButton.addEventListener('click', this.copyToClipboard.bind(this));
    this.clearButton.addEventListener('click', this.clear.bind(this));
    this.loadSampleButton.addEventListener('click', this.loadSampleCode.bind(this));
    this.createDragDropArea();

    // Initialize CodeMirror instances for input and output
    this.codeMirrorInput = CodeMirror(this.input, {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'default',
      matchBrackets: true,
    });
    this.codeMirrorOutput = CodeMirror(this.output, {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'default',
      readOnly: true,
      matchBrackets: true,
    });
  }

  createDragDropArea() {
    this.dragDropArea.addEventListener('dragover', this.handleDragOver.bind(this));
    this.dragDropArea.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragDropArea.classList.add('drag-over');
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragDropArea.classList.remove('drag-over');

    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/javascript') {
      const reader = new FileReader();
      reader.onload = () => {
        this.codeMirrorInput.setValue(reader.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please drop a valid .js file');
    }
  }

  async minify() {
    this.startTime = Date.now();
    this.updateTimer();
    this.timeout = setTimeout(() => {
      this.timerDisplay.textContent = '';
    }, 5000);

    const code = this.codeMirrorInput.getValue();
    try {
      esprima.parse(code);
    } catch (error) {
      try {
        const fixedCode = escodegen.generate(esprima.parseScript(code, { tolerant: true }));
        this.codeMirrorInput.setValue(fixedCode);
      } catch (error) {
        clearTimeout(this.timeout);
        alert('Error: Unable to fix syntax errors');
        return;
      }
    }

    try {
      const minified = await Terser.minify(code, {
        ecma: 2022,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true,
          keep_fnames: true,
        },
        mangle: {
          toplevel: true,
          keep_fnames: true,
        },
        output: {
          beautify: false,
        },
      });
      this.codeMirrorOutput.setValue(minified.code);
    } catch (error) {
      alert('Error: Unable to minify due to syntax errors');
    }
  }
  

        updateTimer() {
            const elapsedTime = Date.now() - this.startTime;
            this.timerDisplay.textContent = `Elapsed time: ${elapsedTime} ms`;
            this.timeout = setTimeout(() => {
            this.updateTimer();
            }, 100);
        }
        
        copyToClipboard() {
            this.codeMirrorOutput.focus();
            this.codeMirrorOutput.setSelection({ line: 0, ch: 0 }, { line: this.codeMirrorOutput.lineCount(), ch: 0 });
            document.execCommand('copy');
            this.showCopiedMessage();
          }
          
        
          clear() {
            this.codeMirrorInput.setValue('');
            this.codeMirrorOutput.setValue('');
          }
          
          loadSampleCode() {
            this.codeMirrorInput.setValue(`function helloWorld() {
              console.log("Hello, world!");
            }
            helloWorld();`);
          }
        
          showCopiedMessage() {
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = 'Copied!';
            setTimeout(() => {
              this.copyButton.textContent = originalText;
            }, 1500);
          }
          }
        
          const app = new MinifierApp();

          const downloadButton = document.getElementById("download");

        downloadButton.addEventListener("click", () => {
        const outputText = outputEditor.getValue();
        const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "minified-output.txt";
        a.click();
        URL.revokeObjectURL(url);
        });