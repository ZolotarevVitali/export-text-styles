/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

function exportTextStyles(_a) {
    return __awaiter(this, arguments, void 0, function* ({ useVariables }) {
        const textStyles = yield (0,_utils_styles_text__WEBPACK_IMPORTED_MODULE_0__.getTextStyles)({ useVariables });
        const textStylesFiles = {};
        Object.entries(textStyles).forEach(([fileName, textStyles]) => {
            textStylesFiles[fileName] = getTextStylesFileContent(textStyles);
        });
        return Object.assign(Object.assign({}, textStylesFiles), { 'index.scss': getIndexFileContent(textStyles) });
    });
}
function getTextStylesFileContent(textStyles) {
    return textStyles
        .map((textStyle) => {
        return getTextStyleMixinContent(textStyle);
    })
        .join('\n\n');
}
function getTextStyleMixinContent(textStyle) {
    const { mixinName, originalName } = textStyle, props = __rest(textStyle, ["mixinName", "originalName"]);
    const description = `/*figma style name: ${originalName}*/\n`;
    const mixinContent = Object.entries(props)
        .map(([key, value]) => `\t${key}: ${value};`)
        .join('\n');
    return `${description}@mixin ${mixinName} {\n${mixinContent}\n}`;
}
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getTextStyles(_a) {
    return __awaiter(this, arguments, void 0, function* ({ useVariables }) {
        const textStyles = yield figma.getLocalTextStylesAsync();
        return prepareTextStyles({ textStyles, useVariables });
    });
}
function prepareTextStyles({ textStyles, useVariables, }) {
    const preparedTextStyles = {};
    textStyles.forEach((style) => {
        const fileName = getTextStyleFileName(style.name);
        const preparedTextStyle = {
            originalName: style.name,
            mixinName: getTextStyleMixinName(style.name),
            fontSize: style.fontSize + 'px',
        };
        if (!preparedTextStyles[fileName]) {
            preparedTextStyles[fileName] = [];
        }
        preparedTextStyles[fileName].push(preparedTextStyle);
    });
    return preparedTextStyles;
}
function getTextStyleMixinName(name) {
    const normalizedName = normalizeName(name);
    return 'text-style-' + normalizedName + '-mixin';
}
function getTextStyleFileName(name) {
    const fileName = name.split('/')[0];
    const normalizedName = normalizeName(fileName);
    return normalizedName + '.scss';
}
function normalizeName(name) {
    return name
        .replace(/[\s/()]+/g, '-')
        .toLowerCase()
        .replace(/-+/g, '-');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSxjQUFjLFNBQUksSUFBSSxTQUFJO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELGNBQWM7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNxRDtBQUM5QztBQUNQLDJEQUEyRCxjQUFjO0FBQ3pFLGlDQUFpQyxpRUFBYSxHQUFHLGNBQWM7QUFDL0Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDZDQUE2QyxzQkFBc0IsK0NBQStDO0FBQ2xILEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFlBQVksMEJBQTBCO0FBQ3RDLCtDQUErQyxhQUFhO0FBQzVEO0FBQ0Esb0NBQW9DLElBQUksSUFBSSxPQUFPO0FBQ25EO0FBQ0EsY0FBYyxZQUFZLFNBQVMsWUFBWSxJQUFJLGFBQWEsR0FBRztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx5QkFBeUIsRUFBRTtBQUNoRTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3BEQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDTztBQUNQLDJEQUEyRCxjQUFjO0FBQ3pFO0FBQ0EsbUNBQW1DLDBCQUEwQjtBQUM3RCxLQUFLO0FBQ0w7QUFDQSw2QkFBNkIsMkJBQTJCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDN0NBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHlCQUF5QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDRFQUFnQixHQUFHLGdDQUFnQztBQUNwRjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzLy4vc3JjL2V4cG9ydC9leHBvcnQtdGV4dC1zdHlsZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzLy4vc3JjL2V4cG9ydC91dGlscy9zdHlsZXMtdGV4dC50cyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvLi9zcmMvY29kZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX3Jlc3QgPSAodGhpcyAmJiB0aGlzLl9fcmVzdCkgfHwgZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgICB0W3BdID0gc1twXTtcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgICAgfVxuICAgIHJldHVybiB0O1xufTtcbmltcG9ydCB7IGdldFRleHRTdHlsZXMgfSBmcm9tICcuLi91dGlscy9zdHlsZXMtdGV4dCc7XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0VGV4dFN0eWxlcyhfYSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uKiAoeyB1c2VWYXJpYWJsZXMgfSkge1xuICAgICAgICBjb25zdCB0ZXh0U3R5bGVzID0geWllbGQgZ2V0VGV4dFN0eWxlcyh7IHVzZVZhcmlhYmxlcyB9KTtcbiAgICAgICAgY29uc3QgdGV4dFN0eWxlc0ZpbGVzID0ge307XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRleHRTdHlsZXMpLmZvckVhY2goKFtmaWxlTmFtZSwgdGV4dFN0eWxlc10pID0+IHtcbiAgICAgICAgICAgIHRleHRTdHlsZXNGaWxlc1tmaWxlTmFtZV0gPSBnZXRUZXh0U3R5bGVzRmlsZUNvbnRlbnQodGV4dFN0eWxlcyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCB0ZXh0U3R5bGVzRmlsZXMpLCB7ICdpbmRleC5zY3NzJzogZ2V0SW5kZXhGaWxlQ29udGVudCh0ZXh0U3R5bGVzKSB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldFRleHRTdHlsZXNGaWxlQ29udGVudCh0ZXh0U3R5bGVzKSB7XG4gICAgcmV0dXJuIHRleHRTdHlsZXNcbiAgICAgICAgLm1hcCgodGV4dFN0eWxlKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRUZXh0U3R5bGVNaXhpbkNvbnRlbnQodGV4dFN0eWxlKTtcbiAgICB9KVxuICAgICAgICAuam9pbignXFxuXFxuJyk7XG59XG5mdW5jdGlvbiBnZXRUZXh0U3R5bGVNaXhpbkNvbnRlbnQodGV4dFN0eWxlKSB7XG4gICAgY29uc3QgeyBtaXhpbk5hbWUsIG9yaWdpbmFsTmFtZSB9ID0gdGV4dFN0eWxlLCBwcm9wcyA9IF9fcmVzdCh0ZXh0U3R5bGUsIFtcIm1peGluTmFtZVwiLCBcIm9yaWdpbmFsTmFtZVwiXSk7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBgLypmaWdtYSBzdHlsZSBuYW1lOiAke29yaWdpbmFsTmFtZX0qL1xcbmA7XG4gICAgY29uc3QgbWl4aW5Db250ZW50ID0gT2JqZWN0LmVudHJpZXMocHJvcHMpXG4gICAgICAgIC5tYXAoKFtrZXksIHZhbHVlXSkgPT4gYFxcdCR7a2V5fTogJHt2YWx1ZX07YClcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xuICAgIHJldHVybiBgJHtkZXNjcmlwdGlvbn1AbWl4aW4gJHttaXhpbk5hbWV9IHtcXG4ke21peGluQ29udGVudH1cXG59YDtcbn1cbmZ1bmN0aW9uIGdldEluZGV4RmlsZUNvbnRlbnQodGV4dFN0eWxlcykge1xuICAgIGxldCBmaWxlQ29udGVudCA9ICcnO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRleHRTdHlsZXMpKSB7XG4gICAgICAgIGZpbGVDb250ZW50ICs9IGBAaW1wb3J0ICcuLyR7a2V5LnJlcGxhY2UoJy5zY3NzJywgJycpfSc7XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGZpbGVDb250ZW50O1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5leHBvcnQgZnVuY3Rpb24gZ2V0VGV4dFN0eWxlcyhfYSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uKiAoeyB1c2VWYXJpYWJsZXMgfSkge1xuICAgICAgICBjb25zdCB0ZXh0U3R5bGVzID0geWllbGQgZmlnbWEuZ2V0TG9jYWxUZXh0U3R5bGVzQXN5bmMoKTtcbiAgICAgICAgcmV0dXJuIHByZXBhcmVUZXh0U3R5bGVzKHsgdGV4dFN0eWxlcywgdXNlVmFyaWFibGVzIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gcHJlcGFyZVRleHRTdHlsZXMoeyB0ZXh0U3R5bGVzLCB1c2VWYXJpYWJsZXMsIH0pIHtcbiAgICBjb25zdCBwcmVwYXJlZFRleHRTdHlsZXMgPSB7fTtcbiAgICB0ZXh0U3R5bGVzLmZvckVhY2goKHN0eWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gZ2V0VGV4dFN0eWxlRmlsZU5hbWUoc3R5bGUubmFtZSk7XG4gICAgICAgIGNvbnN0IHByZXBhcmVkVGV4dFN0eWxlID0ge1xuICAgICAgICAgICAgb3JpZ2luYWxOYW1lOiBzdHlsZS5uYW1lLFxuICAgICAgICAgICAgbWl4aW5OYW1lOiBnZXRUZXh0U3R5bGVNaXhpbk5hbWUoc3R5bGUubmFtZSksXG4gICAgICAgICAgICBmb250U2l6ZTogc3R5bGUuZm9udFNpemUgKyAncHgnLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIXByZXBhcmVkVGV4dFN0eWxlc1tmaWxlTmFtZV0pIHtcbiAgICAgICAgICAgIHByZXBhcmVkVGV4dFN0eWxlc1tmaWxlTmFtZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBwcmVwYXJlZFRleHRTdHlsZXNbZmlsZU5hbWVdLnB1c2gocHJlcGFyZWRUZXh0U3R5bGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcmVwYXJlZFRleHRTdHlsZXM7XG59XG5mdW5jdGlvbiBnZXRUZXh0U3R5bGVNaXhpbk5hbWUobmFtZSkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWROYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKTtcbiAgICByZXR1cm4gJ3RleHQtc3R5bGUtJyArIG5vcm1hbGl6ZWROYW1lICsgJy1taXhpbic7XG59XG5mdW5jdGlvbiBnZXRUZXh0U3R5bGVGaWxlTmFtZShuYW1lKSB7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBuYW1lLnNwbGl0KCcvJylbMF07XG4gICAgY29uc3Qgbm9ybWFsaXplZE5hbWUgPSBub3JtYWxpemVOYW1lKGZpbGVOYW1lKTtcbiAgICByZXR1cm4gbm9ybWFsaXplZE5hbWUgKyAnLnNjc3MnO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWVcbiAgICAgICAgLnJlcGxhY2UoL1tcXHMvKCldKy9nLCAnLScpXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5yZXBsYWNlKC8tKy9nLCAnLScpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGV4cG9ydFRleHRTdHlsZXMgfSBmcm9tICcuL2V4cG9ydC9leHBvcnQtdGV4dC1zdHlsZXMnO1xuLy8gVGhpcyBwbHVnaW4gZXhwb3J0cyBGaWdtYSBkZXNpZ24gdG9rZW5zICh2YXJpYWJsZXMgYW5kIHN0eWxlcykgdG8gSlNPTiBmb3JtYXRcbi8vIFRoaXMgZmlsZSBob2xkcyB0aGUgbWFpbiBjb2RlIGZvciBwbHVnaW5zLiBDb2RlIGluIHRoaXMgZmlsZSBoYXMgYWNjZXNzIHRvXG4vLyB0aGUgKmZpZ21hIGRvY3VtZW50KiB2aWEgdGhlIGZpZ21hIGdsb2JhbCBvYmplY3QuXG4vLyBZb3UgY2FuIGFjY2VzcyBicm93c2VyIEFQSXMgaW4gdGhlIDxzY3JpcHQ+IHRhZyBpbnNpZGUgXCJ1aS5odG1sXCIgd2hpY2ggaGFzIGFcbi8vIGZ1bGwgYnJvd3NlciBlbnZpcm9ubWVudCAoU2VlIGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9wbHVnaW4tZG9jcy9ob3ctcGx1Z2lucy1ydW4pLlxuLy8gVGhpcyBzaG93cyB0aGUgSFRNTCBwYWdlIGluIFwidWkuaHRtbFwiLlxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA0MDAsIGhlaWdodDogNDAwIH0pO1xuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXG4vLyBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgcGFzc2VkIHRoZSBcInBsdWdpbk1lc3NhZ2VcIiBwcm9wZXJ0eSBvZiB0aGVcbi8vIHBvc3RlZCBtZXNzYWdlLlxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnZXhwb3J0Jykge1xuICAgICAgICBjb25zdCB0ZXh0U3R5bGVzID0geWllbGQgZXhwb3J0VGV4dFN0eWxlcyh7IHVzZVZhcmlhYmxlczogbXNnLnVzZVZhcmlhYmxlcyB9KTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2V4cG9ydC10ZXh0LXN0eWxlcycsXG4gICAgICAgICAgICB0ZXh0U3R5bGVzLFxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==