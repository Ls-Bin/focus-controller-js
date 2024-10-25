# [focus-controller-js](https://github.com/Ls-Bin/focus-controller-js)
[![](https://img.shields.io/badge/Powered%20by-jslib%20base-brightgreen.svg)](https://github.com/yanhaijing/jslib-base)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Ls-Bin/focus-controller-js/blob/master/LICENSE)
[![CI](https://github.com/Ls-Bin/focus-controller-js/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Ls-Bin/focus-controller-js/actions/workflows/ci.yml)
[![npm](https://img.shields.io/badge/npm-0.1.0-orange.svg)](https://www.npmjs.com/package/focus-controller-js)
[![NPM downloads](http://img.shields.io/npm/dm/focus-controller-js.svg?style=flat-square)](http://www.npmtrends.com/focus-controller-js)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/Ls-Bin/focus-controller-js.svg)](http://isitmaintained.com/project/Ls-Bin/focus-controller-js "Percentage of issues still open")

适配tv电视焦点控制，可方向键控制焦点

## :star: 特性

## :rocket: 使用者指南

通过npm下载安装代码

```bash
$ npm install --save focus-controller-js
```

如果你是webpack等环境

```js
import FocusControllerJs from "focus-controller-js";

const focusController = new FocusControllerJs();

```

如果你是浏览器环境

```html
<script src="node_modules/focus-controller-js/dist/index.aio.js"></script>
```

## Usage
## 

## examples
 - [vue3](./apps/vue3/README.md)


## :kissing_heart: 贡献者指南
首次运行需要先安装依赖

```bash
$ npm install
```

一键打包生成生产代码

```bash
$ npm run build
```

运行单元测试:

```bash
$ npm test
```

> 注意：浏览器环境需要手动测试，位于`test/browser`

