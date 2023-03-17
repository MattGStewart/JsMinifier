importScripts('https://cdn.skypack.dev/escodegen');
importScripts('https://cdn.skypack.dev/esprima');
importScripts('https://cdn.skypack.dev/terser');
importScripts('https://cdn.skypack.dev/eslint');

self.addEventListener('message', async (event) => {
  const inputCode = event.data;

  const lintedAndFixedCode = await lintAndFix(inputCode);

  try {
    esprima.parse(lintedAndFixedCode, { tokens: true, comment: true });
  } catch (error) {
    try {
      const fixedCode = escodegen.generate(
        esprima.parseScript(lintedAndFixedCode, {
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
    const minified = await Terser.minify(lintedAndFixedCode, {
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
