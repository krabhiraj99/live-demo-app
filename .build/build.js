const path = require('path');
const glob = require('glob');
const ncp = require('ncp').ncp;
const babel = require('@babel/core');
const vueTemplateCompiler = require('vue-template-compiler');
const fs = require('fs');

const babelOptions = {
    presets: [
      ['@babel/preset-env', { targets: { esmodules: true } }]
    ]
  };

// Transpile JS and Vue files
glob.glob('src/**/*.js', {}).then(files => { //src/**/*.{js,vue}

  for (const file of files) {
    console.log('processing ', file)
    const src = file;
    const dest = path.join('dist', path.relative('src', file));
    const code = fs.readFileSync(src, 'utf-8');

    if (src.endsWith('.js')) {
      // Transpile JS file
      const result = babel.transformSync(code, babelOptions);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, result.code);
    } 
    // else if (src.endsWith('.vue')) {
    //   // Transpile Vue file
    //   const result = vueTemplateCompiler.compile(code, {});

    //   const script = result.script.content;
    //   const scriptResult = babel.transformSync(script, babelOptions);
    //   const transpiledScript = `<script>${scriptResult.code}</script>`;

    //   const template = result.template.content;
    //   const transpiledTemplate = `<template>${template}</template>`;

    //   const transpiledCode = transpiledTemplate + transpiledScript;
    //   fs.mkdirSync(path.dirname(dest), { recursive: true });
    //   fs.writeFileSync(dest, transpiledCode);
    // }
  }

    // Copy non-JS and non-Vue files
    ncp.ncp('src', 'dist', {
        filter: (src) => {
        return !src.endsWith('.js') // && !src.endsWith('.vue');
        }
    }, (err) => {
        if (err) throw err;
    });
}).catch(err => {
    throw err;
})


