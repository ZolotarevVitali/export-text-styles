/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/export/constants.ts":
/*!*********************************!*\
  !*** ./src/export/constants.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSS_FONT_WEIGHTS: () => (/* binding */ CSS_FONT_WEIGHTS)
/* harmony export */ });
const CSS_FONT_WEIGHTS = {
    thin: '100',
    hairline: '100',
    extralight: '200',
    ultralight: '200',
    light: '300',
    normal: '400',
    regular: '400',
    book: '400',
    roman: '400',
    medium: '500',
    semibold: '600',
    demibold: '600',
    bold: '700',
    extrabold: '800',
    ultrabold: '800',
    black: '900',
    heavy: '900',
};


/***/ }),

/***/ "./src/export/export-text-styles/index.ts":
/*!************************************************!*\
  !*** ./src/export/export-text-styles/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exportTextStyles: () => (/* binding */ exportTextStyles)
/* harmony export */ });
/* harmony import */ var _utils_styles_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/styles-text */ "./src/export/utils/styles-text.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

/** Builds the SCSS mixin files and their shared index from local text styles. */
function exportTextStyles(_a) {
    return __awaiter(this, arguments, void 0, function* ({ useVariables }) {
        const textStyles = yield (0,_utils_styles_text__WEBPACK_IMPORTED_MODULE_0__.getTextStyles)({ useVariables });
        const textStylesFiles = {};
        if (Object.keys(textStyles).length === 0) {
            return null;
        }
        Object.entries(textStyles).forEach(([fileName, textStyles]) => {
            textStylesFiles[fileName] = getTextStylesFileContent(textStyles);
        });
        return Object.assign(Object.assign({}, textStylesFiles), { 'index.scss': getIndexFileContent(textStyles) });
    });
}
/** Joins all generated mixins assigned to a single SCSS file. */
function getTextStylesFileContent(textStyles) {
    return textStyles
        .map((textStyle) => {
        return getTextStyleMixinContent(textStyle);
    })
        .join('\n\n');
}
/** Serializes one prepared text style as a documented SCSS mixin. */
function getTextStyleMixinContent(textStyle) {
    const { mixinName, originalName } = textStyle, props = __rest(textStyle, ["mixinName", "originalName"]);
    const description = `/*figma style name: ${originalName}*/\n`;
    const mixinContent = Object.entries(props)
        .filter(([_, value]) => !!value)
        .map(([key, value]) => `\t${key}: ${value};`)
        .join('\n');
    return `${description}@mixin ${mixinName} {\n${mixinContent}\n}`;
}
/** Generates an index that imports every text-style SCSS file. */
function getIndexFileContent(textStyles) {
    let fileContent = '';
    for (const key of Object.keys(textStyles)) {
        fileContent += `@import './${key.replace('.scss', '')}';\n`;
    }
    return fileContent;
}


/***/ }),

/***/ "./src/export/utils/styles-text.ts":
/*!*****************************************!*\
  !*** ./src/export/utils/styles-text.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTextStyles: () => (/* binding */ getTextStyles)
/* harmony export */ });
/* harmony import */ var _variable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./variable */ "./src/export/utils/variable.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/export/constants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


/** Loads local Figma text styles and prepares them for SCSS generation. */
function getTextStyles(_a) {
    return __awaiter(this, arguments, void 0, function* ({ useVariables }) {
        const textStyles = yield figma.getLocalTextStylesAsync();
        return yield prepareTextStyles({ textStyles, useVariables });
    });
}
/** Groups prepared styles by the first segment of their Figma style name. */
function prepareTextStyles(_a) {
    return __awaiter(this, arguments, void 0, function* ({ textStyles, useVariables, }) {
        const preparedTextStyles = {};
        for (const style of textStyles) {
            const fileName = getTextStyleFileName(style.name);
            //console.log(style);
            const preparedTextStyle = {
                originalName: style.name,
                mixinName: getTextStyleMixinName(style.name),
                'font-size': style.fontSize ? style.fontSize + 'px' : null,
                'font-family': yield getFontFamily({ style, useVariables }),
                'font-weight': yield getFontWeight({ style, useVariables }),
            };
            if (!preparedTextStyles[fileName]) {
                preparedTextStyles[fileName] = [];
            }
            preparedTextStyles[fileName].push(preparedTextStyle);
        }
        return preparedTextStyles;
    });
}
/** Creates a unique SCSS mixin name from the full Figma style name. */
function getTextStyleMixinName(name) {
    const normalizedName = normalizeName(name);
    return 'text-style-' + normalizedName + '-mixin';
}
/** Uses the top-level Figma style group as the output SCSS file name. */
function getTextStyleFileName(name) {
    const fileName = name.split('/')[0];
    const normalizedName = normalizeName(fileName);
    return normalizedName + '.scss';
}
/** Converts Figma naming separators into a lowercase, kebab-case identifier. */
function normalizeName(name) {
    return name
        .replace(/[\s/()]+/g, '-')
        .toLowerCase()
        .replace(/-+/g, '-');
}
function getFontFamily(_a) {
    return __awaiter(this, arguments, void 0, function* ({ style, useVariables, }) {
        var _b, _c;
        const variableName = yield (0,_variable__WEBPACK_IMPORTED_MODULE_0__.getVariableNameById)((_c = (_b = style === null || style === void 0 ? void 0 : style.boundVariables) === null || _b === void 0 ? void 0 : _b.fontFamily) === null || _c === void 0 ? void 0 : _c.id);
        // Prefer the bound Figma variable when variable-based output is enabled.
        return useVariables && variableName
            ? variableName
            : `'${style.fontName.family}', Arial, sans-serif` || null;
    });
}
function getFontWeight(_a) {
    return __awaiter(this, arguments, void 0, function* ({ style, useVariables, }) {
        var _b, _c, _d;
        const variableName = yield (0,_variable__WEBPACK_IMPORTED_MODULE_0__.getVariableNameById)((_c = (_b = style === null || style === void 0 ? void 0 : style.boundVariables) === null || _b === void 0 ? void 0 : _b.fontWeight) === null || _c === void 0 ? void 0 : _c.id);
        // Fall back to the text style value when no usable variable is bound.
        if (useVariables && variableName) {
            return variableName;
        }
        return normalizeFontWeightValue((_d = style === null || style === void 0 ? void 0 : style.fontName) === null || _d === void 0 ? void 0 : _d.style);
    });
}
/** Maps Figma font style labels and numeric weights to valid CSS weights. */
function normalizeFontWeightValue(fontWeight) {
    var _a;
    const normalizedFontWeight = fontWeight === null || fontWeight === void 0 ? void 0 : fontWeight.toLowerCase().replace(/italic|oblique/g, '').replace(/[^a-z0-9]/g, '');
    if (!normalizedFontWeight) {
        return null;
    }
    if (/^[1-9]00$/.test(normalizedFontWeight)) {
        return normalizedFontWeight;
    }
    return (_a = _constants__WEBPACK_IMPORTED_MODULE_1__.CSS_FONT_WEIGHTS[normalizedFontWeight]) !== null && _a !== void 0 ? _a : null;
}


/***/ }),

/***/ "./src/export/utils/variable.ts":
/*!**************************************!*\
  !*** ./src/export/utils/variable.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getVariableName: () => (/* binding */ getVariableName),
/* harmony export */   getVariableNameById: () => (/* binding */ getVariableNameById),
/* harmony export */   prepareVariableName: () => (/* binding */ prepareVariableName)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** Resolves a Figma variable ID to a CSS custom-property reference. */
function getVariableNameById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id) {
            return null;
        }
        const variable = yield figma.variables.getVariableByIdAsync(id);
        if (variable) {
            return `var(--${getVariableName(variable)})`;
        }
        return null;
    });
}
/** Converts a Figma variable name into a CSS custom-property name. */
function getVariableName(variable) {
    return prepareVariableName(variable.name);
}
/** Normalizes Figma path and word separators for use in CSS identifiers. */
function prepareVariableName(name) {
    return name.toLowerCase().replace(/[/. ]/g, '-');
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _export_export_text_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./export/export-text-styles */ "./src/export/export-text-styles/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// This plugin exports Figma design tokens (variables and styles) to JSON format
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 400, height: 400 });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'export') {
        const textStyles = yield (0,_export_export_text_styles__WEBPACK_IMPORTED_MODULE_0__.exportTextStyles)({ useVariables: msg.useVariables });
        figma.ui.postMessage({
            type: 'export-text-styles',
            textStyles,
        });
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBOzs7Ozs7O1VDN0JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHlCQUF5QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDRFQUFnQixHQUFHLGdDQUFnQztBQUNwRjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzLy4vc3JjL2V4cG9ydC9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzLy4vc3JjL2V4cG9ydC9leHBvcnQtdGV4dC1zdHlsZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzLy4vc3JjL2V4cG9ydC91dGlscy9zdHlsZXMtdGV4dC50cyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvLi9zcmMvZXhwb3J0L3V0aWxzL3ZhcmlhYmxlLnRzIiwid2VicGFjazovL0V4cG9ydCB0ZXh0IHN0eWxlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0V4cG9ydCB0ZXh0IHN0eWxlcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0V4cG9ydCB0ZXh0IHN0eWxlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0V4cG9ydCB0ZXh0IHN0eWxlcy8uL3NyYy9jb2RlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBDU1NfRk9OVF9XRUlHSFRTID0ge1xuICAgIHRoaW46ICcxMDAnLFxuICAgIGhhaXJsaW5lOiAnMTAwJyxcbiAgICBleHRyYWxpZ2h0OiAnMjAwJyxcbiAgICB1bHRyYWxpZ2h0OiAnMjAwJyxcbiAgICBsaWdodDogJzMwMCcsXG4gICAgbm9ybWFsOiAnNDAwJyxcbiAgICByZWd1bGFyOiAnNDAwJyxcbiAgICBib29rOiAnNDAwJyxcbiAgICByb21hbjogJzQwMCcsXG4gICAgbWVkaXVtOiAnNTAwJyxcbiAgICBzZW1pYm9sZDogJzYwMCcsXG4gICAgZGVtaWJvbGQ6ICc2MDAnLFxuICAgIGJvbGQ6ICc3MDAnLFxuICAgIGV4dHJhYm9sZDogJzgwMCcsXG4gICAgdWx0cmFib2xkOiAnODAwJyxcbiAgICBibGFjazogJzkwMCcsXG4gICAgaGVhdnk6ICc5MDAnLFxufTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xuaW1wb3J0IHsgZ2V0VGV4dFN0eWxlcyB9IGZyb20gJy4uL3V0aWxzL3N0eWxlcy10ZXh0Jztcbi8qKiBCdWlsZHMgdGhlIFNDU1MgbWl4aW4gZmlsZXMgYW5kIHRoZWlyIHNoYXJlZCBpbmRleCBmcm9tIGxvY2FsIHRleHQgc3R5bGVzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydFRleHRTdHlsZXMoX2EpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiogKHsgdXNlVmFyaWFibGVzIH0pIHtcbiAgICAgICAgY29uc3QgdGV4dFN0eWxlcyA9IHlpZWxkIGdldFRleHRTdHlsZXMoeyB1c2VWYXJpYWJsZXMgfSk7XG4gICAgICAgIGNvbnN0IHRleHRTdHlsZXNGaWxlcyA9IHt9O1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModGV4dFN0eWxlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3QuZW50cmllcyh0ZXh0U3R5bGVzKS5mb3JFYWNoKChbZmlsZU5hbWUsIHRleHRTdHlsZXNdKSA9PiB7XG4gICAgICAgICAgICB0ZXh0U3R5bGVzRmlsZXNbZmlsZU5hbWVdID0gZ2V0VGV4dFN0eWxlc0ZpbGVDb250ZW50KHRleHRTdHlsZXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGV4dFN0eWxlc0ZpbGVzKSwgeyAnaW5kZXguc2Nzcyc6IGdldEluZGV4RmlsZUNvbnRlbnQodGV4dFN0eWxlcykgfSk7XG4gICAgfSk7XG59XG4vKiogSm9pbnMgYWxsIGdlbmVyYXRlZCBtaXhpbnMgYXNzaWduZWQgdG8gYSBzaW5nbGUgU0NTUyBmaWxlLiAqL1xuZnVuY3Rpb24gZ2V0VGV4dFN0eWxlc0ZpbGVDb250ZW50KHRleHRTdHlsZXMpIHtcbiAgICByZXR1cm4gdGV4dFN0eWxlc1xuICAgICAgICAubWFwKCh0ZXh0U3R5bGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldFRleHRTdHlsZU1peGluQ29udGVudCh0ZXh0U3R5bGUpO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG5cXG4nKTtcbn1cbi8qKiBTZXJpYWxpemVzIG9uZSBwcmVwYXJlZCB0ZXh0IHN0eWxlIGFzIGEgZG9jdW1lbnRlZCBTQ1NTIG1peGluLiAqL1xuZnVuY3Rpb24gZ2V0VGV4dFN0eWxlTWl4aW5Db250ZW50KHRleHRTdHlsZSkge1xuICAgIGNvbnN0IHsgbWl4aW5OYW1lLCBvcmlnaW5hbE5hbWUgfSA9IHRleHRTdHlsZSwgcHJvcHMgPSBfX3Jlc3QodGV4dFN0eWxlLCBbXCJtaXhpbk5hbWVcIiwgXCJvcmlnaW5hbE5hbWVcIl0pO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gYC8qZmlnbWEgc3R5bGUgbmFtZTogJHtvcmlnaW5hbE5hbWV9Ki9cXG5gO1xuICAgIGNvbnN0IG1peGluQ29udGVudCA9IE9iamVjdC5lbnRyaWVzKHByb3BzKVxuICAgICAgICAuZmlsdGVyKChbXywgdmFsdWVdKSA9PiAhIXZhbHVlKVxuICAgICAgICAubWFwKChba2V5LCB2YWx1ZV0pID0+IGBcXHQke2tleX06ICR7dmFsdWV9O2ApXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICByZXR1cm4gYCR7ZGVzY3JpcHRpb259QG1peGluICR7bWl4aW5OYW1lfSB7XFxuJHttaXhpbkNvbnRlbnR9XFxufWA7XG59XG4vKiogR2VuZXJhdGVzIGFuIGluZGV4IHRoYXQgaW1wb3J0cyBldmVyeSB0ZXh0LXN0eWxlIFNDU1MgZmlsZS4gKi9cbmZ1bmN0aW9uIGdldEluZGV4RmlsZUNvbnRlbnQodGV4dFN0eWxlcykge1xuICAgIGxldCBmaWxlQ29udGVudCA9ICcnO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRleHRTdHlsZXMpKSB7XG4gICAgICAgIGZpbGVDb250ZW50ICs9IGBAaW1wb3J0ICcuLyR7a2V5LnJlcGxhY2UoJy5zY3NzJywgJycpfSc7XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGZpbGVDb250ZW50O1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBnZXRWYXJpYWJsZU5hbWVCeUlkIH0gZnJvbSAnLi92YXJpYWJsZSc7XG5pbXBvcnQgeyBDU1NfRk9OVF9XRUlHSFRTIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbi8qKiBMb2FkcyBsb2NhbCBGaWdtYSB0ZXh0IHN0eWxlcyBhbmQgcHJlcGFyZXMgdGhlbSBmb3IgU0NTUyBnZW5lcmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRleHRTdHlsZXMoX2EpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiogKHsgdXNlVmFyaWFibGVzIH0pIHtcbiAgICAgICAgY29uc3QgdGV4dFN0eWxlcyA9IHlpZWxkIGZpZ21hLmdldExvY2FsVGV4dFN0eWxlc0FzeW5jKCk7XG4gICAgICAgIHJldHVybiB5aWVsZCBwcmVwYXJlVGV4dFN0eWxlcyh7IHRleHRTdHlsZXMsIHVzZVZhcmlhYmxlcyB9KTtcbiAgICB9KTtcbn1cbi8qKiBHcm91cHMgcHJlcGFyZWQgc3R5bGVzIGJ5IHRoZSBmaXJzdCBzZWdtZW50IG9mIHRoZWlyIEZpZ21hIHN0eWxlIG5hbWUuICovXG5mdW5jdGlvbiBwcmVwYXJlVGV4dFN0eWxlcyhfYSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uKiAoeyB0ZXh0U3R5bGVzLCB1c2VWYXJpYWJsZXMsIH0pIHtcbiAgICAgICAgY29uc3QgcHJlcGFyZWRUZXh0U3R5bGVzID0ge307XG4gICAgICAgIGZvciAoY29uc3Qgc3R5bGUgb2YgdGV4dFN0eWxlcykge1xuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBnZXRUZXh0U3R5bGVGaWxlTmFtZShzdHlsZS5uYW1lKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3R5bGUpO1xuICAgICAgICAgICAgY29uc3QgcHJlcGFyZWRUZXh0U3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxOYW1lOiBzdHlsZS5uYW1lLFxuICAgICAgICAgICAgICAgIG1peGluTmFtZTogZ2V0VGV4dFN0eWxlTWl4aW5OYW1lKHN0eWxlLm5hbWUpLFxuICAgICAgICAgICAgICAgICdmb250LXNpemUnOiBzdHlsZS5mb250U2l6ZSA/IHN0eWxlLmZvbnRTaXplICsgJ3B4JyA6IG51bGwsXG4gICAgICAgICAgICAgICAgJ2ZvbnQtZmFtaWx5JzogeWllbGQgZ2V0Rm9udEZhbWlseSh7IHN0eWxlLCB1c2VWYXJpYWJsZXMgfSksXG4gICAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogeWllbGQgZ2V0Rm9udFdlaWdodCh7IHN0eWxlLCB1c2VWYXJpYWJsZXMgfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCFwcmVwYXJlZFRleHRTdHlsZXNbZmlsZU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcHJlcGFyZWRUZXh0U3R5bGVzW2ZpbGVOYW1lXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJlcGFyZWRUZXh0U3R5bGVzW2ZpbGVOYW1lXS5wdXNoKHByZXBhcmVkVGV4dFN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJlcGFyZWRUZXh0U3R5bGVzO1xuICAgIH0pO1xufVxuLyoqIENyZWF0ZXMgYSB1bmlxdWUgU0NTUyBtaXhpbiBuYW1lIGZyb20gdGhlIGZ1bGwgRmlnbWEgc3R5bGUgbmFtZS4gKi9cbmZ1bmN0aW9uIGdldFRleHRTdHlsZU1peGluTmFtZShuYW1lKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZE5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpO1xuICAgIHJldHVybiAndGV4dC1zdHlsZS0nICsgbm9ybWFsaXplZE5hbWUgKyAnLW1peGluJztcbn1cbi8qKiBVc2VzIHRoZSB0b3AtbGV2ZWwgRmlnbWEgc3R5bGUgZ3JvdXAgYXMgdGhlIG91dHB1dCBTQ1NTIGZpbGUgbmFtZS4gKi9cbmZ1bmN0aW9uIGdldFRleHRTdHlsZUZpbGVOYW1lKG5hbWUpIHtcbiAgICBjb25zdCBmaWxlTmFtZSA9IG5hbWUuc3BsaXQoJy8nKVswXTtcbiAgICBjb25zdCBub3JtYWxpemVkTmFtZSA9IG5vcm1hbGl6ZU5hbWUoZmlsZU5hbWUpO1xuICAgIHJldHVybiBub3JtYWxpemVkTmFtZSArICcuc2Nzcyc7XG59XG4vKiogQ29udmVydHMgRmlnbWEgbmFtaW5nIHNlcGFyYXRvcnMgaW50byBhIGxvd2VyY2FzZSwga2ViYWItY2FzZSBpZGVudGlmaWVyLiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWVcbiAgICAgICAgLnJlcGxhY2UoL1tcXHMvKCldKy9nLCAnLScpXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5yZXBsYWNlKC8tKy9nLCAnLScpO1xufVxuZnVuY3Rpb24gZ2V0Rm9udEZhbWlseShfYSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uKiAoeyBzdHlsZSwgdXNlVmFyaWFibGVzLCB9KSB7XG4gICAgICAgIHZhciBfYiwgX2M7XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlTmFtZSA9IHlpZWxkIGdldFZhcmlhYmxlTmFtZUJ5SWQoKF9jID0gKF9iID0gc3R5bGUgPT09IG51bGwgfHwgc3R5bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHN0eWxlLmJvdW5kVmFyaWFibGVzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZm9udEZhbWlseSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmlkKTtcbiAgICAgICAgLy8gUHJlZmVyIHRoZSBib3VuZCBGaWdtYSB2YXJpYWJsZSB3aGVuIHZhcmlhYmxlLWJhc2VkIG91dHB1dCBpcyBlbmFibGVkLlxuICAgICAgICByZXR1cm4gdXNlVmFyaWFibGVzICYmIHZhcmlhYmxlTmFtZVxuICAgICAgICAgICAgPyB2YXJpYWJsZU5hbWVcbiAgICAgICAgICAgIDogYCcke3N0eWxlLmZvbnROYW1lLmZhbWlseX0nLCBBcmlhbCwgc2Fucy1zZXJpZmAgfHwgbnVsbDtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEZvbnRXZWlnaHQoX2EpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiogKHsgc3R5bGUsIHVzZVZhcmlhYmxlcywgfSkge1xuICAgICAgICB2YXIgX2IsIF9jLCBfZDtcbiAgICAgICAgY29uc3QgdmFyaWFibGVOYW1lID0geWllbGQgZ2V0VmFyaWFibGVOYW1lQnlJZCgoX2MgPSAoX2IgPSBzdHlsZSA9PT0gbnVsbCB8fCBzdHlsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc3R5bGUuYm91bmRWYXJpYWJsZXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5mb250V2VpZ2h0KSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuaWQpO1xuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gdGhlIHRleHQgc3R5bGUgdmFsdWUgd2hlbiBubyB1c2FibGUgdmFyaWFibGUgaXMgYm91bmQuXG4gICAgICAgIGlmICh1c2VWYXJpYWJsZXMgJiYgdmFyaWFibGVOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFyaWFibGVOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub3JtYWxpemVGb250V2VpZ2h0VmFsdWUoKF9kID0gc3R5bGUgPT09IG51bGwgfHwgc3R5bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHN0eWxlLmZvbnROYW1lKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Quc3R5bGUpO1xuICAgIH0pO1xufVxuLyoqIE1hcHMgRmlnbWEgZm9udCBzdHlsZSBsYWJlbHMgYW5kIG51bWVyaWMgd2VpZ2h0cyB0byB2YWxpZCBDU1Mgd2VpZ2h0cy4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUZvbnRXZWlnaHRWYWx1ZShmb250V2VpZ2h0KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRGb250V2VpZ2h0ID0gZm9udFdlaWdodCA9PT0gbnVsbCB8fCBmb250V2VpZ2h0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBmb250V2VpZ2h0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvaXRhbGljfG9ibGlxdWUvZywgJycpLnJlcGxhY2UoL1teYS16MC05XS9nLCAnJyk7XG4gICAgaWYgKCFub3JtYWxpemVkRm9udFdlaWdodCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKC9eWzEtOV0wMCQvLnRlc3Qobm9ybWFsaXplZEZvbnRXZWlnaHQpKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVkRm9udFdlaWdodDtcbiAgICB9XG4gICAgcmV0dXJuIChfYSA9IENTU19GT05UX1dFSUdIVFNbbm9ybWFsaXplZEZvbnRXZWlnaHRdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBudWxsO1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4vKiogUmVzb2x2ZXMgYSBGaWdtYSB2YXJpYWJsZSBJRCB0byBhIENTUyBjdXN0b20tcHJvcGVydHkgcmVmZXJlbmNlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZhcmlhYmxlTmFtZUJ5SWQoaWQpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YXJpYWJsZSA9IHlpZWxkIGZpZ21hLnZhcmlhYmxlcy5nZXRWYXJpYWJsZUJ5SWRBc3luYyhpZCk7XG4gICAgICAgIGlmICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGB2YXIoLS0ke2dldFZhcmlhYmxlTmFtZSh2YXJpYWJsZSl9KWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG59XG4vKiogQ29udmVydHMgYSBGaWdtYSB2YXJpYWJsZSBuYW1lIGludG8gYSBDU1MgY3VzdG9tLXByb3BlcnR5IG5hbWUuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFyaWFibGVOYW1lKHZhcmlhYmxlKSB7XG4gICAgcmV0dXJuIHByZXBhcmVWYXJpYWJsZU5hbWUodmFyaWFibGUubmFtZSk7XG59XG4vKiogTm9ybWFsaXplcyBGaWdtYSBwYXRoIGFuZCB3b3JkIHNlcGFyYXRvcnMgZm9yIHVzZSBpbiBDU1MgaWRlbnRpZmllcnMuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZVZhcmlhYmxlTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLy4gXS9nLCAnLScpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGV4cG9ydFRleHRTdHlsZXMgfSBmcm9tICcuL2V4cG9ydC9leHBvcnQtdGV4dC1zdHlsZXMnO1xuLy8gVGhpcyBwbHVnaW4gZXhwb3J0cyBGaWdtYSBkZXNpZ24gdG9rZW5zICh2YXJpYWJsZXMgYW5kIHN0eWxlcykgdG8gSlNPTiBmb3JtYXRcbi8vIFRoaXMgZmlsZSBob2xkcyB0aGUgbWFpbiBjb2RlIGZvciBwbHVnaW5zLiBDb2RlIGluIHRoaXMgZmlsZSBoYXMgYWNjZXNzIHRvXG4vLyB0aGUgKmZpZ21hIGRvY3VtZW50KiB2aWEgdGhlIGZpZ21hIGdsb2JhbCBvYmplY3QuXG4vLyBZb3UgY2FuIGFjY2VzcyBicm93c2VyIEFQSXMgaW4gdGhlIDxzY3JpcHQ+IHRhZyBpbnNpZGUgXCJ1aS5odG1sXCIgd2hpY2ggaGFzIGFcbi8vIGZ1bGwgYnJvd3NlciBlbnZpcm9ubWVudCAoU2VlIGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9wbHVnaW4tZG9jcy9ob3ctcGx1Z2lucy1ydW4pLlxuLy8gVGhpcyBzaG93cyB0aGUgSFRNTCBwYWdlIGluIFwidWkuaHRtbFwiLlxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA0MDAsIGhlaWdodDogNDAwIH0pO1xuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXG4vLyBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgcGFzc2VkIHRoZSBcInBsdWdpbk1lc3NhZ2VcIiBwcm9wZXJ0eSBvZiB0aGVcbi8vIHBvc3RlZCBtZXNzYWdlLlxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnZXhwb3J0Jykge1xuICAgICAgICBjb25zdCB0ZXh0U3R5bGVzID0geWllbGQgZXhwb3J0VGV4dFN0eWxlcyh7IHVzZVZhcmlhYmxlczogbXNnLnVzZVZhcmlhYmxlcyB9KTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2V4cG9ydC10ZXh0LXN0eWxlcycsXG4gICAgICAgICAgICB0ZXh0U3R5bGVzLFxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==