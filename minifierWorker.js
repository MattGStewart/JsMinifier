importScripts('https://cdn.skypack.dev/escodegen');
importScripts('https://cdn.skypack.dev/esprima');
importScripts('https://cdn.skypack.dev/terser');

self.addEventListener('message', async (event) => {
  const inputCode = event.data;
  
  try {
    esprima.parse(inputCode, { tokens: true, comment: true });
  } catch (error) {
    try {
      const fixedCode = escodegen.generate(
        esprima.parseScript(inputCode, {
          tolerant: true,
          tokens: true,
          comment: true,
        })
      );
      self.postMessage({ fixedCode });
      return;
    } catch (e) {
      self.postMessage({ error: 'Error: Unable to fix syntax errors' });
      return;
    }
  }

  try {
    const minified = await Terser.minify(inputCode, {
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

    self.postMessage({ minified: minified.code });
  } catch (error) {
    self.postMessage({ error: 'Error: Unable to minify due to syntax errors' });
  }
});
