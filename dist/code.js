/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   BREAKPOINTS_SORT_ORDER: () => (/* binding */ BREAKPOINTS_SORT_ORDER)
/* harmony export */ });
const BREAKPOINTS = {
    screenSm: 'screen-sm',
    screenMd: 'screen-md',
    screenLg: 'screen-lg',
    screenXl: 'screen-xl',
    screenXxl: 'screen-xxl',
};
const BREAKPOINTS_SORT_ORDER = {
    [BREAKPOINTS.screenSm]: 1,
    [BREAKPOINTS.screenMd]: 2,
    [BREAKPOINTS.screenLg]: 3,
    [BREAKPOINTS.screenXl]: 4,
    [BREAKPOINTS.screenXxl]: 5,
};


/***/ }),

/***/ "./src/export/export-css/index.ts":
/*!****************************************!*\
  !*** ./src/export/export-css/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exportCSSTokens: () => (/* binding */ exportCSSTokens)
/* harmony export */ });
/* harmony import */ var _utils_styles_tokens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/styles-tokens */ "./src/export/utils/styles-tokens.ts");
/* harmony import */ var _utils_variables_tokens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/variables-tokens */ "./src/export/utils/variables-tokens.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../constants */ "./src/constants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



function exportCSSTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const styleTokens = yield (0,_utils_styles_tokens__WEBPACK_IMPORTED_MODULE_0__.getStylesTokens)({ filePath: 'styles/style.scss' });
        const variablesTokens = yield (0,_utils_variables_tokens__WEBPACK_IMPORTED_MODULE_1__.getVariablesTokens)({ fileExtension: 'scss' });
        const tokensCombined = Object.assign(Object.assign({}, styleTokens), variablesTokens);
        //create a new object with the file path and the css tokens
        const CSSTokens = {};
        for (const key of Object.keys(tokensCombined)) {
            CSSTokens[key] = getCSSTokensFileContent(tokensCombined[key]);
        }
        return Object.assign(Object.assign({}, CSSTokens), { 'index.scss': getIndexFileContent(tokensCombined) });
    });
}
function getIndexFileContent(tokens) {
    let fileContent = '';
    for (const key of Object.keys(tokens)) {
        fileContent += `@import './${key.replace('.scss', '')}';\n`;
    }
    return fileContent;
}
function getCSSTokensFileContent(token) {
    const cssTokensString = getCSSTokensString(token);
    const modeName = getCSSTokenModeString(token);
    const additionalImports = getAdditionalImportsString(token);
    const fileContent = `${additionalImports}:root${modeName} {\n${cssTokensString}\n}`;
    return fileContent;
}
function getCSSTokensString(token) {
    const sortedToken = getSortedTokens(token);
    const cssTokensString = sortedToken
        .map((key) => getCSSTokensStringItem(key, token[key].value))
        .join('\n');
    return cssTokensString;
}
function getSortedTokens(tokens) {
    return Object.keys(tokens).sort((a, b) => {
        const aBreakpoint = replaceBreakpointByValue(a);
        const bBreakpoint = replaceBreakpointByValue(b);
        return aBreakpoint.localeCompare(bBreakpoint);
    });
}
function replaceBreakpointByValue(name) {
    let replacedName = name;
    for (const breakpoint of Object.keys(_constants__WEBPACK_IMPORTED_MODULE_2__.BREAKPOINTS_SORT_ORDER)) {
        replacedName = replacedName.replace(breakpoint, _constants__WEBPACK_IMPORTED_MODULE_2__.BREAKPOINTS_SORT_ORDER[breakpoint].toString());
    }
    return replacedName;
}
//get the css token string item
function getCSSTokensStringItem(key, value) {
    var _a, _b, _c;
    const reBreakpoints = /-\[[\w-]+\]$/;
    //get the breakpoint name from the key
    const breakpointName = (_c = (_b = (_a = key.match(reBreakpoints)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.replace(/(-\[|\])/g, '')) !== null && _c !== void 0 ? _c : '';
    //get the variable name from the key
    const variableName = key.replace(reBreakpoints, '');
    //get the css token string
    const cssTokenString = `\t--${variableName}: ${getCSSTokenValueString(value)};`;
    //if there is a breakpoint, return the css token string with the breakpoint
    if (breakpointName) {
        return `\t@media (min-width: $${breakpointName}) {\n\t${cssTokenString}\n\t}`;
    }
    //if there is no breakpoint, return the css token string
    return cssTokenString;
}
function getCSSTokenValueString(tokenValue) {
    if (typeof tokenValue !== 'string') {
        return tokenValue;
    }
    return tokenValue.replace(/\{([\w\s-]+)(-\[[\w\s-]+\])?\}/g, 'var(--$1)');
}
//get the css token mode string
function getCSSTokenModeString(token) {
    var _a;
    const modeName = (_a = Object.values(token)[0]) === null || _a === void 0 ? void 0 : _a.mode;
    return modeName ? `[data-theme='${modeName}']` : '';
}
function getAdditionalImportsString(token) {
    const reBreakpoints = /\[[\w-]+\]$/;
    const isThereBreakpoints = Object.keys(token).some((key) => reBreakpoints.test(key));
    return isThereBreakpoints ? "@import '~styles/variables/breakpoints';\n\n" : '';
}



/***/ }),

/***/ "./src/export/export-json/index.ts":
/*!*****************************************!*\
  !*** ./src/export/export-json/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exportJSONTokens: () => (/* binding */ exportJSONTokens)
/* harmony export */ });
/* harmony import */ var _utils_styles_tokens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/styles-tokens */ "./src/export/utils/styles-tokens.ts");
/* harmony import */ var _utils_variables_tokens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/variables-tokens */ "./src/export/utils/variables-tokens.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function exportJSONTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const styles = yield (0,_utils_styles_tokens__WEBPACK_IMPORTED_MODULE_0__.getStylesTokens)({ filePath: 'styles/style.json' });
        const variables = yield (0,_utils_variables_tokens__WEBPACK_IMPORTED_MODULE_1__.getVariablesTokens)({ fileExtension: 'json' });
        const tokensCombined = Object.assign(Object.assign({}, styles), variables);
        //create a new object with the file path and the json tokens
        const JSONTokens = {};
        for (const key of Object.keys(tokensCombined)) {
            JSONTokens[key] = JSON.stringify(tokensCombined[key], null, 2);
        }
        return JSONTokens;
    });
}



/***/ }),

/***/ "./src/export/utils/color.ts":
/*!***********************************!*\
  !*** ./src/export/utils/color.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rgbToHex: () => (/* binding */ rgbToHex),
/* harmony export */   rgbaToHex: () => (/* binding */ rgbaToHex),
/* harmony export */   toHex: () => (/* binding */ toHex)
/* harmony export */ });
// Helper function to convert RGB to Hex
function rgbToHex(r, g, b) {
    const toHex = (n) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}
function rgbaToHex({ r, g, b, a, }) {
    if (typeof a !== 'number')
        return null;
    if (a !== 1) {
        const alpha = a === 0 ? 0 : a.toFixed(2);
        return `rgba(${[r, g, b].map((n) => Math.round(n * 255)).join(', ')}, ${alpha})`;
    }
    const hex = [toHex(r), toHex(g), toHex(b)].join('');
    return `#${hex}`;
}
function toHex(value) {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}


/***/ }),

/***/ "./src/export/utils/styles-tokens.ts":
/*!*******************************************!*\
  !*** ./src/export/utils/styles-tokens.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStylesTokens: () => (/* binding */ getStylesTokens)
/* harmony export */ });
/* harmony import */ var _utils_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/color */ "./src/export/utils/color.ts");
/* harmony import */ var _utils_variable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/variable */ "./src/export/utils/variable.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const FILE_PATH = 'styles/style.json';
function getStylesTokens(_a) {
    return __awaiter(this, arguments, void 0, function* ({ filePath = FILE_PATH, }) {
        //paint styles and effect styles
        const paintStylesTokens = yield getPaintStyles();
        //const effectStylesTokens = await getEffectStyles();
        return { [filePath]: paintStylesTokens };
    });
}
//get paint styles
function getPaintStyles() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Get all paint styles (colors and gradients)
        const paintStyles = yield figma.getLocalPaintStylesAsync();
        const variables = yield figma.variables.getLocalVariablesAsync();
        // Initialize the tokens object
        const tokens = {};
        // Create a map of variable IDs to names for quick lookup
        const variableMap = new Map();
        variables.forEach((variable) => {
            variableMap.set(variable.id, variable.name);
        });
        // Process each paint style
        for (const style of paintStyles) {
            const styleName = (0,_utils_variable__WEBPACK_IMPORTED_MODULE_1__.prepareVariableName)(style.name);
            const paints = style.paints;
            if (paints.length === 0)
                continue;
            const paint = paints[0];
            // Handle different paint types
            if (paint.type === 'SOLID') {
                // Check if this is a variable reference
                if ('boundVariables' in paint && ((_a = paint.boundVariables) === null || _a === void 0 ? void 0 : _a.color)) {
                    const variableId = paint.boundVariables.color.id;
                    const variableName = variableMap.get(variableId);
                    if (variableName) {
                        // Use variable name instead of color value
                        tokens[styleName] = {
                            value: `{${(0,_utils_variable__WEBPACK_IMPORTED_MODULE_1__.prepareVariableName)(variableName)}}`,
                            type: 'color',
                        };
                    }
                }
                // Handle regular solid colors
                const color = paint.color;
                const opacity = paint.opacity || 1;
                const hexColor = (0,_utils_color__WEBPACK_IMPORTED_MODULE_0__.rgbToHex)(color.r, color.g, color.b);
                // Add to tokens with opacity
                const value = opacity < 1
                    ? `${hexColor}${Math.round(opacity * 255)
                        .toString(16)
                        .padStart(2, '0')}`
                    : hexColor;
                tokens[styleName] = {
                    value,
                    type: 'color',
                };
            }
            else if (paint.type === 'GRADIENT_LINEAR') {
                // Handle linear gradients
                const gradient = paint;
                const stops = gradient.gradientStops
                    .map((stop) => {
                    var _a;
                    // Check if this stop is a variable reference
                    if ('boundVariables' in stop && ((_a = stop.boundVariables) === null || _a === void 0 ? void 0 : _a.color)) {
                        const variableId = stop.boundVariables.color.id;
                        const variableName = variableMap.get(variableId);
                        if (variableName) {
                            return `{${(0,_utils_variable__WEBPACK_IMPORTED_MODULE_1__.prepareVariableName)(variableName)}} ${Math.round(stop.position * 100)}%`;
                        }
                    }
                    // Regular color stop
                    const color = stop.color;
                    const hexColor = (0,_utils_color__WEBPACK_IMPORTED_MODULE_0__.rgbToHex)(color.r, color.g, color.b);
                    return `${hexColor} ${Math.round(stop.position * 100)}%`;
                })
                    .join(', ');
                // Calculate gradient angle from transform matrix
                const transform = gradient.gradientTransform;
                // Get the direction vector from the transform matrix
                const dx = transform[0][0];
                const dy = transform[1][0];
                // Calculate the angle in radians
                const angleRad = Math.atan2(dy, dx);
                // Convert to degrees and normalize to 0-360
                let angleDeg = ((angleRad * 180) / Math.PI) % 360;
                if (angleDeg < 0)
                    angleDeg += 360;
                // Convert to CSS angle (0deg is right, 90deg is up)
                // For Figma gradients, we need to invert the angle and add 90 degrees
                const cssAngle = (360 - angleDeg + 90) % 360;
                const value = `linear-gradient(${Math.round(cssAngle)}deg, ${stops})`;
                tokens[styleName] = {
                    value,
                    type: 'color',
                };
            }
        }
        return tokens;
    });
}
// async function getEffectStyles() {
//   // Get effect styles (shadows)
//   const effectStyles = await figma.getLocalEffectStylesAsync();
//   const variables = await figma.variables.getLocalVariablesAsync();
//   // Initialize the tokens object
//   const tokens: TTokens = {};
//   // Create a map of variable IDs to names for quick lookup
//   const variableMap = new Map<string, string>();
//   variables.forEach((variable) => {
//     variableMap.set(variable.id, variable.name);
//   });
//   for (const style of effectStyles) {
//     const styleName = prepareVariableName(style.name);
//     const effects = style.effects;
//     if (effects.length === 0) continue;
//     const effect = effects[0];
//     if (effect.type === 'DROP_SHADOW') {
//       // Check if shadow color is a variable reference
//       let colorValue: string;
//       if ('boundVariables' in effect && effect.boundVariables?.color) {
//         const variableId = effect.boundVariables.color.id;
//         const variableName = variableMap.get(variableId);
//         colorValue = variableName
//           ? `{${variableName}}`
//           : rgbToHex(effect.color.r, effect.color.g, effect.color.b);
//       } else {
//         colorValue = rgbToHex(effect.color.r, effect.color.g, effect.color.b);
//       }
//       const shadowValue: IShadowValue = {
//         color: colorValue,
//         type: 'dropShadow',
//         x: effect.offset.x,
//         y: effect.offset.y,
//         blur: effect.radius,
//         spread: effect.spread || 0,
//       };
//       // Add the shadow to the shadows group
//       tokens[styleName] = {
//         value: shadowValue,
//         type: 'boxShadow',
//       };
//     }
//   }
//   return tokens;
// }


/***/ }),

/***/ "./src/export/utils/variable.ts":
/*!**************************************!*\
  !*** ./src/export/utils/variable.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getOriginalStyleName: () => (/* binding */ getOriginalStyleName),
/* harmony export */   getOriginalVariableName: () => (/* binding */ getOriginalVariableName),
/* harmony export */   getVariableName: () => (/* binding */ getVariableName),
/* harmony export */   prepareVariableName: () => (/* binding */ prepareVariableName)
/* harmony export */ });
function getOriginalVariableName(variable) {
    return variable.name.replace(/\//g, '-');
}
function getOriginalStyleName(style) {
    return style.name.replace(/\//g, '-');
}
//prepare the variable name for the token key
function getVariableName(variable) {
    return prepareVariableName(variable.name);
}
function prepareVariableName(name) {
    return name.toLowerCase().replace(/[/. ]/g, '-');
}


/***/ }),

/***/ "./src/export/utils/variables-tokens.ts":
/*!**********************************************!*\
  !*** ./src/export/utils/variables-tokens.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getVariablesTokens: () => (/* binding */ getVariablesTokens)
/* harmony export */ });
/* harmony import */ var _utils_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/color */ "./src/export/utils/color.ts");
/* harmony import */ var _utils_variable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/variable */ "./src/export/utils/variable.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const DEFAULT_COLLECTION_NAME = 'variables';
function getVariablesTokens(_a) {
    return __awaiter(this, arguments, void 0, function* ({ fileExtension = 'json', }) {
        //get all local variables
        const variables = yield figma.variables.getLocalVariablesAsync();
        let tokens = {};
        //get variable tokens for each variable
        for (const variable of variables) {
            tokens = yield getVariableTokens(variable, tokens, fileExtension);
        }
        return tokens;
    });
}
function getVariableTokens(variable, tokens, fileExtension) {
    return __awaiter(this, void 0, void 0, function* () {
        //variable collection
        const collection = yield figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
        if (!collection) {
            return {};
        }
        //get collection name for path
        const collectionName = collection.name
            ? collection.name.toLowerCase().replace(/\./g, '/')
            : DEFAULT_COLLECTION_NAME;
        //get modes from collection, not variable
        const collectionModes = collection.modes;
        //get variable tokens for each mode
        let modeNumber = 0;
        for (const mode of collectionModes) {
            const modeName = modeNumber > 0 ? mode.name : undefined;
            //get path for token
            const path = collectionName + '/' + (0,_utils_variable__WEBPACK_IMPORTED_MODULE_1__.prepareVariableName)(mode.name) + '.' + fileExtension;
            //get variable token for mode
            const token = yield getVariableToken(variable, mode.modeId, Object.assign({}, tokens[path]), modeName);
            //merge token into tokens object
            tokens[path] = Object.assign(Object.assign({}, tokens[path]), token);
            modeNumber++;
        }
        return tokens;
    });
}
//get the variable value by mode
function getVariableValueByMode(variable, modeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const variableValueByMode = variable === null || variable === void 0 ? void 0 : variable.valuesByMode[modeId];
        //if the variable value is a VARIABLE_ALIAS, get the referenced variable
        if (typeof variableValueByMode === 'object' &&
            'type' in variableValueByMode &&
            variableValueByMode.type === 'VARIABLE_ALIAS' &&
            'id' in variableValueByMode &&
            variableValueByMode.id) {
            const referencedVariable = yield figma.variables.getVariableByIdAsync(variableValueByMode.id);
            if (referencedVariable) {
                //return the referenced variable name wrapped in curly braces
                return `{${(0,_utils_variable__WEBPACK_IMPORTED_MODULE_1__.getVariableName)(referencedVariable)}}`;
            }
        }
        //if the variable type is a COLOR, return the color value
        if (variable.resolvedType === 'COLOR') {
            const colorObject = variable.valuesByMode[modeId];
            return (0,_utils_color__WEBPACK_IMPORTED_MODULE_0__.rgbaToHex)(Object.assign({}, colorObject));
        }
        //if the variable type is a FLOAT, return the float value in px
        if (variable.resolvedType === 'FLOAT') {
            return getFloatValue(variable.name, variable.valuesByMode[modeId]);
        }
        //return the variable value by mode
        return variable.valuesByMode[modeId];
    });
}
//get the float value in px or without px
function getFloatValue(name, value) {
    //if the name includes 'font-weight', return the value without px
    if (name.includes('font-weight')) {
        return value.toString();
    }
    //if the name includes 'opacity', return the value divided by 100
    if (name.includes('opacity')) {
        return (value / 100).toString();
    }
    return value + 'px';
}
function getVariableToken(variable_1, modeId_1) {
    return __awaiter(this, arguments, void 0, function* (variable, modeId, existingTokens = {}, modeName) {
        //get the variable value by mode
        const tokenValue = {
            value: (yield getVariableValueByMode(variable, modeId)),
            type: variable.resolvedType,
            mode: modeName,
        };
        //add the token to the existing tokens
        existingTokens[(0,_utils_variable__WEBPACK_IMPORTED_MODULE_1__.getVariableName)(variable)] = tokenValue;
        return existingTokens;
    });
}


/***/ }),

/***/ "./src/validation/index.ts":
/*!*********************************!*\
  !*** ./src/validation/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStyleNames: () => (/* binding */ getStyleNames),
/* harmony export */   getVariableNames: () => (/* binding */ getVariableNames),
/* harmony export */   validateTokens: () => (/* binding */ validateTokens)
/* harmony export */ });
/* harmony import */ var _export_utils_variable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../export/utils/variable */ "./src/export/utils/variable.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const ERRORS_MESSAGES = {
    errorsDoubleTokens: 'Double tokens names found',
    errorsIncorrectNames: 'Incorrect name found. The name must contain only lowercase letters, numbers, and hyphens',
    errorsIncorrectReferences: 'Incorrect reference found',
};
function validateTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        //get all local variables
        const variables = yield figma.variables.getLocalVariablesAsync();
        //get all local styles
        const styles = yield figma.getLocalPaintStylesAsync();
        //variable names
        const variableNames = getVariableNames(variables);
        //style names
        const styleNames = getStyleNames(styles);
        //combined names
        const combinedNames = [...variableNames, ...styleNames];
        //get errors of double tokens
        const errorsDoubleTokens = getErrorsDoubleTokens(combinedNames);
        //get errors of incorrect names
        const errorsIncorrectNames = getErrorsIncorrectNames(combinedNames);
        //get errors of incorrect references
        const errorsIncorrectReferences = yield getErrorsIncorrectReferences(variables, styles, variableNames);
        const fileContent = getFileContent({
            errorsDoubleTokens,
            errorsIncorrectNames,
            errorsIncorrectReferences,
        });
        if (!fileContent) {
            return {
                success: true,
                message: 'Validation completed successfully',
            };
        }
        return {
            success: false,
            message: 'Validation completed with errors',
            fileContent,
        };
    });
}
//get file content
function getFileContent(props) {
    let fileContent = '';
    Object.entries(props).forEach(([key, value]) => {
        if (value.length > 0) {
            fileContent += `${ERRORS_MESSAGES[key]}: \n\t${value.join('\n\t')}\n`;
        }
    });
    return fileContent;
}
//get variable names
function getVariableNames(variables) {
    //get variable names
    return variables.map((variable) => (0,_export_utils_variable__WEBPACK_IMPORTED_MODULE_0__.getOriginalVariableName)(variable));
}
//get styles names
function getStyleNames(styles) {
    //get style names
    return styles.map((style) => (0,_export_utils_variable__WEBPACK_IMPORTED_MODULE_0__.getOriginalStyleName)(style));
}
// Get the errors of double tokens
function getErrorsDoubleTokens(tokens) {
    return tokens.filter((token, index, self) => self.indexOf(token) !== index);
}
// Get the errors of incorrect names
function getErrorsIncorrectNames(tokens) {
    const reCorrectName = /^[a-zA-Z0-9-]+(\[[\w-]+\])?$/;
    console.log(tokens);
    return tokens.filter((token) => !reCorrectName.test(token));
}
// Get the errors of incorrect references
function getErrorsIncorrectReferences(variables, styles, variableNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = [];
        //check variable references
        for (const variable of variables) {
            //check the variable reference
            const errorReferences = yield checkVariableReference(variable, variableNames);
            //if there are errors, add to errors
            if (errorReferences.length > 0) {
                errors.push(...errorReferences);
            }
        }
        for (const style of styles) {
            //check the style reference
            const errorReferences = yield checkStyleReference(style, variableNames);
            //if there are errors, add to errors
            if (errorReferences.length > 0) {
                errors.push(...errorReferences);
            }
        }
        return errors;
    });
}
// Check the variable reference
function checkVariableReference(variable, variableNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const variableValues = variable.valuesByMode;
        const variableName = (0,_export_utils_variable__WEBPACK_IMPORTED_MODULE_0__.getOriginalVariableName)(variable);
        const errorReferences = [];
        for (const modeId in variableValues) {
            //get the value by mode
            const value = variableValues[modeId];
            const errorReference = yield checkReference(variableName, value, variableNames);
            if (errorReference) {
                errorReferences.push(errorReference);
            }
        }
        return errorReferences;
    });
}
// Check the style reference
function checkStyleReference(style, variableNames) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const styleName = (0,_export_utils_variable__WEBPACK_IMPORTED_MODULE_0__.prepareVariableName)(style.name);
        const errorReferences = [];
        //if the style has no bound variables or paints, return empty array
        if (!(style === null || style === void 0 ? void 0 : style.boundVariables) || !((_a = style === null || style === void 0 ? void 0 : style.boundVariables) === null || _a === void 0 ? void 0 : _a.paints)) {
            return errorReferences;
        }
        //check the paint references
        for (const paint of style.boundVariables.paints) {
            //check the paint reference
            const errorReference = yield checkReference(styleName, paint, variableNames);
            //if there are errors, add to errors
            if (errorReference) {
                errorReferences.push(errorReference);
            }
        }
        //return the errors
        return errorReferences;
    });
}
function checkReference(variableName, reference, variableNames) {
    return __awaiter(this, void 0, void 0, function* () {
        //if the reference is not an object, return null
        if (!reference ||
            typeof reference !== 'object' ||
            !('type' in reference) ||
            !('id' in reference)) {
            return null;
        }
        //if the reference is not a variable alias, return null
        if (reference.type !== 'VARIABLE_ALIAS') {
            return null;
        }
        //get the referenced variable
        const referencedVariable = yield figma.variables.getVariableByIdAsync(reference.id);
        //if the referenced variable is not found, add to errors
        if (!referencedVariable) {
            return `${variableName} references an invalid variable id: ${reference.id}`;
        }
        //get the referenced variable name
        const referencedVariableName = (0,_export_utils_variable__WEBPACK_IMPORTED_MODULE_0__.getOriginalVariableName)(referencedVariable);
        //if the referenced variable name is not in the variable names, add to errors
        if (!variableNames.includes(referencedVariableName)) {
            return `${variableName} references an invalid variable name: ${referencedVariableName}`;
        }
        return null;
    });
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
/* harmony import */ var _export_export_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./export/export-json */ "./src/export/export-json/index.ts");
/* harmony import */ var _export_export_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./export/export-css */ "./src/export/export-css/index.ts");
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./validation */ "./src/validation/index.ts");
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
    if (msg.type === 'export-tokens') {
        const tokens = yield (0,_export_export_json__WEBPACK_IMPORTED_MODULE_0__.exportJSONTokens)();
        figma.ui.postMessage({
            type: 'export-files',
            tokens,
        });
    }
    if (msg.type === 'export-css') {
        const tokens = yield (0,_export_export_css__WEBPACK_IMPORTED_MODULE_1__.exportCSSTokens)();
        figma.ui.postMessage({
            type: 'export-files',
            tokens,
        });
    }
    if (msg.type === 'validate-tokens') {
        const validation = yield (0,_validation__WEBPACK_IMPORTED_MODULE_2__.validateTokens)();
        figma.ui.postMessage({
            type: 'validation-result',
            validation,
        });
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDeUQ7QUFDTTtBQUNOO0FBQ3pEO0FBQ0E7QUFDQSxrQ0FBa0MscUVBQWUsR0FBRywrQkFBK0I7QUFDbkYsc0NBQXNDLDJFQUFrQixHQUFHLHVCQUF1QjtBQUNsRiw2REFBNkQ7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxnQkFBZ0IsbURBQW1EO0FBQ2hILEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx5QkFBeUIsRUFBRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixrQkFBa0IsT0FBTyxXQUFXLElBQUksZ0JBQWdCLEdBQUc7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsOERBQXNCO0FBQy9ELHdEQUF3RCw4REFBc0I7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGFBQWEsSUFBSSwrQkFBK0I7QUFDbEY7QUFDQTtBQUNBLHdDQUF3QyxlQUFlLEdBQUcsTUFBTSxlQUFlLEtBQUs7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyw0QkFBNEI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxTQUFTO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFO0FBQ3pFO0FBQzJCOzs7Ozs7Ozs7Ozs7Ozs7OztBQzlGM0IsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ3lEO0FBQ007QUFDL0Q7QUFDQTtBQUNBLDZCQUE2QixxRUFBZSxHQUFHLCtCQUErQjtBQUM5RSxnQ0FBZ0MsMkVBQWtCLEdBQUcsdUJBQXVCO0FBQzVFLDZEQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDNEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEI1QjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08scUJBQXFCLGFBQWE7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscURBQXFELElBQUksTUFBTTtBQUN0RjtBQUNBO0FBQ0EsZUFBZSxJQUFJO0FBQ25CO0FBQ087QUFDUDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckJBLGlCQUFpQixTQUFJLElBQUksU0FBSTtBQUM3Qiw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUMwQztBQUNjO0FBQ3hEO0FBQ087QUFDUCwyREFBMkQsdUJBQXVCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsOEJBQThCLG9FQUFtQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxFQUFFLG9FQUFtQixnQkFBZ0I7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsc0RBQVE7QUFDekM7QUFDQTtBQUNBLHlCQUF5QixTQUFTLEVBQUU7QUFDcEM7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxFQUFFLG9FQUFtQixpQkFBaUIsRUFBRSxnQ0FBZ0M7QUFDN0c7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsc0RBQVE7QUFDN0MsOEJBQThCLFVBQVUsRUFBRSxnQ0FBZ0M7QUFDMUUsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxxQkFBcUIsT0FBTyxNQUFNO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLEVBQUUsY0FBYztBQUNqQztBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUpPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1pBLGlCQUFpQixTQUFJLElBQUksU0FBSTtBQUM3Qiw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUMyQztBQUM4QjtBQUN6RTtBQUNPO0FBQ1AsMkRBQTJELHlCQUF5QjtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELG9FQUFtQjtBQUNuRTtBQUNBLHdGQUF3RjtBQUN4RjtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixFQUFFLGdFQUFlLHNCQUFzQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHVEQUFTLGlCQUFpQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEZBQThGO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGdFQUFlO0FBQ3RDO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6R0EsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQytHO0FBQy9HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixxQkFBcUIsUUFBUSxtQkFBbUI7QUFDOUU7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLHVDQUF1QywrRUFBdUI7QUFDOUQ7QUFDQTtBQUNPO0FBQ1A7QUFDQSxpQ0FBaUMsNEVBQW9CO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLCtFQUF1QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDJFQUFtQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsY0FBYyxxQ0FBcUMsYUFBYTtBQUN0RjtBQUNBO0FBQ0EsdUNBQXVDLCtFQUF1QjtBQUM5RDtBQUNBO0FBQ0Esc0JBQXNCLGNBQWMsdUNBQXVDLHVCQUF1QjtBQUNsRztBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7O1VDNUtBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05BLGlCQUFpQixTQUFJLElBQUksU0FBSTtBQUM3Qiw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUN3RDtBQUNGO0FBQ1I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHlCQUF5QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHFFQUFnQjtBQUM3QztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLDZCQUE2QixtRUFBZTtBQUM1QztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGlDQUFpQywyREFBYztBQUMvQztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzLy4vc3JjL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvLi9zcmMvZXhwb3J0L2V4cG9ydC1jc3MvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzLy4vc3JjL2V4cG9ydC9leHBvcnQtanNvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvLi9zcmMvZXhwb3J0L3V0aWxzL2NvbG9yLnRzIiwid2VicGFjazovL0V4cG9ydCB0ZXh0IHN0eWxlcy8uL3NyYy9leHBvcnQvdXRpbHMvc3R5bGVzLXRva2Vucy50cyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvLi9zcmMvZXhwb3J0L3V0aWxzL3ZhcmlhYmxlLnRzIiwid2VicGFjazovL0V4cG9ydCB0ZXh0IHN0eWxlcy8uL3NyYy9leHBvcnQvdXRpbHMvdmFyaWFibGVzLXRva2Vucy50cyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvLi9zcmMvdmFsaWRhdGlvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vRXhwb3J0IHRleHQgc3R5bGVzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9FeHBvcnQgdGV4dCBzdHlsZXMvLi9zcmMvY29kZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgQlJFQUtQT0lOVFMgPSB7XG4gICAgc2NyZWVuU206ICdzY3JlZW4tc20nLFxuICAgIHNjcmVlbk1kOiAnc2NyZWVuLW1kJyxcbiAgICBzY3JlZW5MZzogJ3NjcmVlbi1sZycsXG4gICAgc2NyZWVuWGw6ICdzY3JlZW4teGwnLFxuICAgIHNjcmVlblh4bDogJ3NjcmVlbi14eGwnLFxufTtcbmV4cG9ydCBjb25zdCBCUkVBS1BPSU5UU19TT1JUX09SREVSID0ge1xuICAgIFtCUkVBS1BPSU5UUy5zY3JlZW5TbV06IDEsXG4gICAgW0JSRUFLUE9JTlRTLnNjcmVlbk1kXTogMixcbiAgICBbQlJFQUtQT0lOVFMuc2NyZWVuTGddOiAzLFxuICAgIFtCUkVBS1BPSU5UUy5zY3JlZW5YbF06IDQsXG4gICAgW0JSRUFLUE9JTlRTLnNjcmVlblh4bF06IDUsXG59O1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBnZXRTdHlsZXNUb2tlbnMgfSBmcm9tICcuLi91dGlscy9zdHlsZXMtdG9rZW5zJztcbmltcG9ydCB7IGdldFZhcmlhYmxlc1Rva2VucyB9IGZyb20gJy4uL3V0aWxzL3ZhcmlhYmxlcy10b2tlbnMnO1xuaW1wb3J0IHsgQlJFQUtQT0lOVFNfU09SVF9PUkRFUiB9IGZyb20gJy4uLy4uL2NvbnN0YW50cyc7XG5mdW5jdGlvbiBleHBvcnRDU1NUb2tlbnMoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVUb2tlbnMgPSB5aWVsZCBnZXRTdHlsZXNUb2tlbnMoeyBmaWxlUGF0aDogJ3N0eWxlcy9zdHlsZS5zY3NzJyB9KTtcbiAgICAgICAgY29uc3QgdmFyaWFibGVzVG9rZW5zID0geWllbGQgZ2V0VmFyaWFibGVzVG9rZW5zKHsgZmlsZUV4dGVuc2lvbjogJ3Njc3MnIH0pO1xuICAgICAgICBjb25zdCB0b2tlbnNDb21iaW5lZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgc3R5bGVUb2tlbnMpLCB2YXJpYWJsZXNUb2tlbnMpO1xuICAgICAgICAvL2NyZWF0ZSBhIG5ldyBvYmplY3Qgd2l0aCB0aGUgZmlsZSBwYXRoIGFuZCB0aGUgY3NzIHRva2Vuc1xuICAgICAgICBjb25zdCBDU1NUb2tlbnMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModG9rZW5zQ29tYmluZWQpKSB7XG4gICAgICAgICAgICBDU1NUb2tlbnNba2V5XSA9IGdldENTU1Rva2Vuc0ZpbGVDb250ZW50KHRva2Vuc0NvbWJpbmVkW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIENTU1Rva2VucyksIHsgJ2luZGV4LnNjc3MnOiBnZXRJbmRleEZpbGVDb250ZW50KHRva2Vuc0NvbWJpbmVkKSB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEluZGV4RmlsZUNvbnRlbnQodG9rZW5zKSB7XG4gICAgbGV0IGZpbGVDb250ZW50ID0gJyc7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModG9rZW5zKSkge1xuICAgICAgICBmaWxlQ29udGVudCArPSBgQGltcG9ydCAnLi8ke2tleS5yZXBsYWNlKCcuc2NzcycsICcnKX0nO1xcbmA7XG4gICAgfVxuICAgIHJldHVybiBmaWxlQ29udGVudDtcbn1cbmZ1bmN0aW9uIGdldENTU1Rva2Vuc0ZpbGVDb250ZW50KHRva2VuKSB7XG4gICAgY29uc3QgY3NzVG9rZW5zU3RyaW5nID0gZ2V0Q1NTVG9rZW5zU3RyaW5nKHRva2VuKTtcbiAgICBjb25zdCBtb2RlTmFtZSA9IGdldENTU1Rva2VuTW9kZVN0cmluZyh0b2tlbik7XG4gICAgY29uc3QgYWRkaXRpb25hbEltcG9ydHMgPSBnZXRBZGRpdGlvbmFsSW1wb3J0c1N0cmluZyh0b2tlbik7XG4gICAgY29uc3QgZmlsZUNvbnRlbnQgPSBgJHthZGRpdGlvbmFsSW1wb3J0c306cm9vdCR7bW9kZU5hbWV9IHtcXG4ke2Nzc1Rva2Vuc1N0cmluZ31cXG59YDtcbiAgICByZXR1cm4gZmlsZUNvbnRlbnQ7XG59XG5mdW5jdGlvbiBnZXRDU1NUb2tlbnNTdHJpbmcodG9rZW4pIHtcbiAgICBjb25zdCBzb3J0ZWRUb2tlbiA9IGdldFNvcnRlZFRva2Vucyh0b2tlbik7XG4gICAgY29uc3QgY3NzVG9rZW5zU3RyaW5nID0gc29ydGVkVG9rZW5cbiAgICAgICAgLm1hcCgoa2V5KSA9PiBnZXRDU1NUb2tlbnNTdHJpbmdJdGVtKGtleSwgdG9rZW5ba2V5XS52YWx1ZSkpXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICByZXR1cm4gY3NzVG9rZW5zU3RyaW5nO1xufVxuZnVuY3Rpb24gZ2V0U29ydGVkVG9rZW5zKHRva2Vucykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0b2tlbnMpLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYUJyZWFrcG9pbnQgPSByZXBsYWNlQnJlYWtwb2ludEJ5VmFsdWUoYSk7XG4gICAgICAgIGNvbnN0IGJCcmVha3BvaW50ID0gcmVwbGFjZUJyZWFrcG9pbnRCeVZhbHVlKGIpO1xuICAgICAgICByZXR1cm4gYUJyZWFrcG9pbnQubG9jYWxlQ29tcGFyZShiQnJlYWtwb2ludCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiByZXBsYWNlQnJlYWtwb2ludEJ5VmFsdWUobmFtZSkge1xuICAgIGxldCByZXBsYWNlZE5hbWUgPSBuYW1lO1xuICAgIGZvciAoY29uc3QgYnJlYWtwb2ludCBvZiBPYmplY3Qua2V5cyhCUkVBS1BPSU5UU19TT1JUX09SREVSKSkge1xuICAgICAgICByZXBsYWNlZE5hbWUgPSByZXBsYWNlZE5hbWUucmVwbGFjZShicmVha3BvaW50LCBCUkVBS1BPSU5UU19TT1JUX09SREVSW2JyZWFrcG9pbnRdLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVwbGFjZWROYW1lO1xufVxuLy9nZXQgdGhlIGNzcyB0b2tlbiBzdHJpbmcgaXRlbVxuZnVuY3Rpb24gZ2V0Q1NTVG9rZW5zU3RyaW5nSXRlbShrZXksIHZhbHVlKSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3QgcmVCcmVha3BvaW50cyA9IC8tXFxbW1xcdy1dK1xcXSQvO1xuICAgIC8vZ2V0IHRoZSBicmVha3BvaW50IG5hbWUgZnJvbSB0aGUga2V5XG4gICAgY29uc3QgYnJlYWtwb2ludE5hbWUgPSAoX2MgPSAoX2IgPSAoX2EgPSBrZXkubWF0Y2gocmVCcmVha3BvaW50cykpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVswXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlcGxhY2UoLygtXFxbfFxcXSkvZywgJycpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAnJztcbiAgICAvL2dldCB0aGUgdmFyaWFibGUgbmFtZSBmcm9tIHRoZSBrZXlcbiAgICBjb25zdCB2YXJpYWJsZU5hbWUgPSBrZXkucmVwbGFjZShyZUJyZWFrcG9pbnRzLCAnJyk7XG4gICAgLy9nZXQgdGhlIGNzcyB0b2tlbiBzdHJpbmdcbiAgICBjb25zdCBjc3NUb2tlblN0cmluZyA9IGBcXHQtLSR7dmFyaWFibGVOYW1lfTogJHtnZXRDU1NUb2tlblZhbHVlU3RyaW5nKHZhbHVlKX07YDtcbiAgICAvL2lmIHRoZXJlIGlzIGEgYnJlYWtwb2ludCwgcmV0dXJuIHRoZSBjc3MgdG9rZW4gc3RyaW5nIHdpdGggdGhlIGJyZWFrcG9pbnRcbiAgICBpZiAoYnJlYWtwb2ludE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGBcXHRAbWVkaWEgKG1pbi13aWR0aDogJCR7YnJlYWtwb2ludE5hbWV9KSB7XFxuXFx0JHtjc3NUb2tlblN0cmluZ31cXG5cXHR9YDtcbiAgICB9XG4gICAgLy9pZiB0aGVyZSBpcyBubyBicmVha3BvaW50LCByZXR1cm4gdGhlIGNzcyB0b2tlbiBzdHJpbmdcbiAgICByZXR1cm4gY3NzVG9rZW5TdHJpbmc7XG59XG5mdW5jdGlvbiBnZXRDU1NUb2tlblZhbHVlU3RyaW5nKHRva2VuVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHRva2VuVmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB0b2tlblZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdG9rZW5WYWx1ZS5yZXBsYWNlKC9cXHsoW1xcd1xccy1dKykoLVxcW1tcXHdcXHMtXStcXF0pP1xcfS9nLCAndmFyKC0tJDEpJyk7XG59XG4vL2dldCB0aGUgY3NzIHRva2VuIG1vZGUgc3RyaW5nXG5mdW5jdGlvbiBnZXRDU1NUb2tlbk1vZGVTdHJpbmcodG9rZW4pIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgbW9kZU5hbWUgPSAoX2EgPSBPYmplY3QudmFsdWVzKHRva2VuKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1vZGU7XG4gICAgcmV0dXJuIG1vZGVOYW1lID8gYFtkYXRhLXRoZW1lPScke21vZGVOYW1lfSddYCA6ICcnO1xufVxuZnVuY3Rpb24gZ2V0QWRkaXRpb25hbEltcG9ydHNTdHJpbmcodG9rZW4pIHtcbiAgICBjb25zdCByZUJyZWFrcG9pbnRzID0gL1xcW1tcXHctXStcXF0kLztcbiAgICBjb25zdCBpc1RoZXJlQnJlYWtwb2ludHMgPSBPYmplY3Qua2V5cyh0b2tlbikuc29tZSgoa2V5KSA9PiByZUJyZWFrcG9pbnRzLnRlc3Qoa2V5KSk7XG4gICAgcmV0dXJuIGlzVGhlcmVCcmVha3BvaW50cyA/IFwiQGltcG9ydCAnfnN0eWxlcy92YXJpYWJsZXMvYnJlYWtwb2ludHMnO1xcblxcblwiIDogJyc7XG59XG5leHBvcnQgeyBleHBvcnRDU1NUb2tlbnMgfTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgZ2V0U3R5bGVzVG9rZW5zIH0gZnJvbSAnLi4vdXRpbHMvc3R5bGVzLXRva2Vucyc7XG5pbXBvcnQgeyBnZXRWYXJpYWJsZXNUb2tlbnMgfSBmcm9tICcuLi91dGlscy92YXJpYWJsZXMtdG9rZW5zJztcbmZ1bmN0aW9uIGV4cG9ydEpTT05Ub2tlbnMoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0geWllbGQgZ2V0U3R5bGVzVG9rZW5zKHsgZmlsZVBhdGg6ICdzdHlsZXMvc3R5bGUuanNvbicgfSk7XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IHlpZWxkIGdldFZhcmlhYmxlc1Rva2Vucyh7IGZpbGVFeHRlbnNpb246ICdqc29uJyB9KTtcbiAgICAgICAgY29uc3QgdG9rZW5zQ29tYmluZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHN0eWxlcyksIHZhcmlhYmxlcyk7XG4gICAgICAgIC8vY3JlYXRlIGEgbmV3IG9iamVjdCB3aXRoIHRoZSBmaWxlIHBhdGggYW5kIHRoZSBqc29uIHRva2Vuc1xuICAgICAgICBjb25zdCBKU09OVG9rZW5zID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRva2Vuc0NvbWJpbmVkKSkge1xuICAgICAgICAgICAgSlNPTlRva2Vuc1trZXldID0gSlNPTi5zdHJpbmdpZnkodG9rZW5zQ29tYmluZWRba2V5XSwgbnVsbCwgMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEpTT05Ub2tlbnM7XG4gICAgfSk7XG59XG5leHBvcnQgeyBleHBvcnRKU09OVG9rZW5zIH07XG4iLCIvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udmVydCBSR0IgdG8gSGV4XG5leHBvcnQgZnVuY3Rpb24gcmdiVG9IZXgociwgZywgYikge1xuICAgIGNvbnN0IHRvSGV4ID0gKG4pID0+IHtcbiAgICAgICAgY29uc3QgaGV4ID0gTWF0aC5yb3VuZChuICogMjU1KS50b1N0cmluZygxNik7XG4gICAgICAgIHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xuICAgIH07XG4gICAgcmV0dXJuICcjJyArIHRvSGV4KHIpICsgdG9IZXgoZykgKyB0b0hleChiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZ2JhVG9IZXgoeyByLCBnLCBiLCBhLCB9KSB7XG4gICAgaWYgKHR5cGVvZiBhICE9PSAnbnVtYmVyJylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgaWYgKGEgIT09IDEpIHtcbiAgICAgICAgY29uc3QgYWxwaGEgPSBhID09PSAwID8gMCA6IGEudG9GaXhlZCgyKTtcbiAgICAgICAgcmV0dXJuIGByZ2JhKCR7W3IsIGcsIGJdLm1hcCgobikgPT4gTWF0aC5yb3VuZChuICogMjU1KSkuam9pbignLCAnKX0sICR7YWxwaGF9KWA7XG4gICAgfVxuICAgIGNvbnN0IGhleCA9IFt0b0hleChyKSwgdG9IZXgoZyksIHRvSGV4KGIpXS5qb2luKCcnKTtcbiAgICByZXR1cm4gYCMke2hleH1gO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvSGV4KHZhbHVlKSB7XG4gICAgY29uc3QgaGV4ID0gTWF0aC5yb3VuZCh2YWx1ZSAqIDI1NSkudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyByZ2JUb0hleCB9IGZyb20gJy4uL3V0aWxzL2NvbG9yJztcbmltcG9ydCB7IHByZXBhcmVWYXJpYWJsZU5hbWUgfSBmcm9tICcuLi91dGlscy92YXJpYWJsZSc7XG5jb25zdCBGSUxFX1BBVEggPSAnc3R5bGVzL3N0eWxlLmpzb24nO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0eWxlc1Rva2VucyhfYSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uKiAoeyBmaWxlUGF0aCA9IEZJTEVfUEFUSCwgfSkge1xuICAgICAgICAvL3BhaW50IHN0eWxlcyBhbmQgZWZmZWN0IHN0eWxlc1xuICAgICAgICBjb25zdCBwYWludFN0eWxlc1Rva2VucyA9IHlpZWxkIGdldFBhaW50U3R5bGVzKCk7XG4gICAgICAgIC8vY29uc3QgZWZmZWN0U3R5bGVzVG9rZW5zID0gYXdhaXQgZ2V0RWZmZWN0U3R5bGVzKCk7XG4gICAgICAgIHJldHVybiB7IFtmaWxlUGF0aF06IHBhaW50U3R5bGVzVG9rZW5zIH07XG4gICAgfSk7XG59XG4vL2dldCBwYWludCBzdHlsZXNcbmZ1bmN0aW9uIGdldFBhaW50U3R5bGVzKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gR2V0IGFsbCBwYWludCBzdHlsZXMgKGNvbG9ycyBhbmQgZ3JhZGllbnRzKVxuICAgICAgICBjb25zdCBwYWludFN0eWxlcyA9IHlpZWxkIGZpZ21hLmdldExvY2FsUGFpbnRTdHlsZXNBc3luYygpO1xuICAgICAgICBjb25zdCB2YXJpYWJsZXMgPSB5aWVsZCBmaWdtYS52YXJpYWJsZXMuZ2V0TG9jYWxWYXJpYWJsZXNBc3luYygpO1xuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSB0b2tlbnMgb2JqZWN0XG4gICAgICAgIGNvbnN0IHRva2VucyA9IHt9O1xuICAgICAgICAvLyBDcmVhdGUgYSBtYXAgb2YgdmFyaWFibGUgSURzIHRvIG5hbWVzIGZvciBxdWljayBsb29rdXBcbiAgICAgICAgY29uc3QgdmFyaWFibGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIHZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZSkgPT4ge1xuICAgICAgICAgICAgdmFyaWFibGVNYXAuc2V0KHZhcmlhYmxlLmlkLCB2YXJpYWJsZS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFByb2Nlc3MgZWFjaCBwYWludCBzdHlsZVxuICAgICAgICBmb3IgKGNvbnN0IHN0eWxlIG9mIHBhaW50U3R5bGVzKSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZU5hbWUgPSBwcmVwYXJlVmFyaWFibGVOYW1lKHN0eWxlLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgcGFpbnRzID0gc3R5bGUucGFpbnRzO1xuICAgICAgICAgICAgaWYgKHBhaW50cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCBwYWludCA9IHBhaW50c1swXTtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBkaWZmZXJlbnQgcGFpbnQgdHlwZXNcbiAgICAgICAgICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIHZhcmlhYmxlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIGlmICgnYm91bmRWYXJpYWJsZXMnIGluIHBhaW50ICYmICgoX2EgPSBwYWludC5ib3VuZFZhcmlhYmxlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNvbG9yKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZUlkID0gcGFpbnQuYm91bmRWYXJpYWJsZXMuY29sb3IuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlTmFtZSA9IHZhcmlhYmxlTWFwLmdldCh2YXJpYWJsZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXNlIHZhcmlhYmxlIG5hbWUgaW5zdGVhZCBvZiBjb2xvciB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5zW3N0eWxlTmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGB7JHtwcmVwYXJlVmFyaWFibGVOYW1lKHZhcmlhYmxlTmFtZSl9fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIHJlZ3VsYXIgc29saWQgY29sb3JzXG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSBwYWludC5jb2xvcjtcbiAgICAgICAgICAgICAgICBjb25zdCBvcGFjaXR5ID0gcGFpbnQub3BhY2l0eSB8fCAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhleENvbG9yID0gcmdiVG9IZXgoY29sb3IuciwgY29sb3IuZywgY29sb3IuYik7XG4gICAgICAgICAgICAgICAgLy8gQWRkIHRvIHRva2VucyB3aXRoIG9wYWNpdHlcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG9wYWNpdHkgPCAxXG4gICAgICAgICAgICAgICAgICAgID8gYCR7aGV4Q29sb3J9JHtNYXRoLnJvdW5kKG9wYWNpdHkgKiAyNTUpXG4gICAgICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAgICAgICAgICAgICAucGFkU3RhcnQoMiwgJzAnKX1gXG4gICAgICAgICAgICAgICAgICAgIDogaGV4Q29sb3I7XG4gICAgICAgICAgICAgICAgdG9rZW5zW3N0eWxlTmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChwYWludC50eXBlID09PSAnR1JBRElFTlRfTElORUFSJykge1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBsaW5lYXIgZ3JhZGllbnRzXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSBwYWludDtcbiAgICAgICAgICAgICAgICBjb25zdCBzdG9wcyA9IGdyYWRpZW50LmdyYWRpZW50U3RvcHNcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgc3RvcCBpcyBhIHZhcmlhYmxlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICBpZiAoJ2JvdW5kVmFyaWFibGVzJyBpbiBzdG9wICYmICgoX2EgPSBzdG9wLmJvdW5kVmFyaWFibGVzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY29sb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZUlkID0gc3RvcC5ib3VuZFZhcmlhYmxlcy5jb2xvci5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlTmFtZSA9IHZhcmlhYmxlTWFwLmdldCh2YXJpYWJsZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYHske3ByZXBhcmVWYXJpYWJsZU5hbWUodmFyaWFibGVOYW1lKX19ICR7TWF0aC5yb3VuZChzdG9wLnBvc2l0aW9uICogMTAwKX0lYDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBSZWd1bGFyIGNvbG9yIHN0b3BcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSBzdG9wLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoZXhDb2xvciA9IHJnYlRvSGV4KGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7aGV4Q29sb3J9ICR7TWF0aC5yb3VuZChzdG9wLnBvc2l0aW9uICogMTAwKX0lYDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuam9pbignLCAnKTtcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgZ3JhZGllbnQgYW5nbGUgZnJvbSB0cmFuc2Zvcm0gbWF0cml4XG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gZ3JhZGllbnQuZ3JhZGllbnRUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBkaXJlY3Rpb24gdmVjdG9yIGZyb20gdGhlIHRyYW5zZm9ybSBtYXRyaXhcbiAgICAgICAgICAgICAgICBjb25zdCBkeCA9IHRyYW5zZm9ybVswXVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBkeSA9IHRyYW5zZm9ybVsxXVswXTtcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGFuZ2xlIGluIHJhZGlhbnNcbiAgICAgICAgICAgICAgICBjb25zdCBhbmdsZVJhZCA9IE1hdGguYXRhbjIoZHksIGR4KTtcbiAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRvIGRlZ3JlZXMgYW5kIG5vcm1hbGl6ZSB0byAwLTM2MFxuICAgICAgICAgICAgICAgIGxldCBhbmdsZURlZyA9ICgoYW5nbGVSYWQgKiAxODApIC8gTWF0aC5QSSkgJSAzNjA7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ2xlRGVnIDwgMClcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVEZWcgKz0gMzYwO1xuICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdG8gQ1NTIGFuZ2xlICgwZGVnIGlzIHJpZ2h0LCA5MGRlZyBpcyB1cClcbiAgICAgICAgICAgICAgICAvLyBGb3IgRmlnbWEgZ3JhZGllbnRzLCB3ZSBuZWVkIHRvIGludmVydCB0aGUgYW5nbGUgYW5kIGFkZCA5MCBkZWdyZWVzXG4gICAgICAgICAgICAgICAgY29uc3QgY3NzQW5nbGUgPSAoMzYwIC0gYW5nbGVEZWcgKyA5MCkgJSAzNjA7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBgbGluZWFyLWdyYWRpZW50KCR7TWF0aC5yb3VuZChjc3NBbmdsZSl9ZGVnLCAke3N0b3BzfSlgO1xuICAgICAgICAgICAgICAgIHRva2Vuc1tzdHlsZU5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfSk7XG59XG4vLyBhc3luYyBmdW5jdGlvbiBnZXRFZmZlY3RTdHlsZXMoKSB7XG4vLyAgIC8vIEdldCBlZmZlY3Qgc3R5bGVzIChzaGFkb3dzKVxuLy8gICBjb25zdCBlZmZlY3RTdHlsZXMgPSBhd2FpdCBmaWdtYS5nZXRMb2NhbEVmZmVjdFN0eWxlc0FzeW5jKCk7XG4vLyAgIGNvbnN0IHZhcmlhYmxlcyA9IGF3YWl0IGZpZ21hLnZhcmlhYmxlcy5nZXRMb2NhbFZhcmlhYmxlc0FzeW5jKCk7XG4vLyAgIC8vIEluaXRpYWxpemUgdGhlIHRva2VucyBvYmplY3Rcbi8vICAgY29uc3QgdG9rZW5zOiBUVG9rZW5zID0ge307XG4vLyAgIC8vIENyZWF0ZSBhIG1hcCBvZiB2YXJpYWJsZSBJRHMgdG8gbmFtZXMgZm9yIHF1aWNrIGxvb2t1cFxuLy8gICBjb25zdCB2YXJpYWJsZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4vLyAgIHZhcmlhYmxlcy5mb3JFYWNoKCh2YXJpYWJsZSkgPT4ge1xuLy8gICAgIHZhcmlhYmxlTWFwLnNldCh2YXJpYWJsZS5pZCwgdmFyaWFibGUubmFtZSk7XG4vLyAgIH0pO1xuLy8gICBmb3IgKGNvbnN0IHN0eWxlIG9mIGVmZmVjdFN0eWxlcykge1xuLy8gICAgIGNvbnN0IHN0eWxlTmFtZSA9IHByZXBhcmVWYXJpYWJsZU5hbWUoc3R5bGUubmFtZSk7XG4vLyAgICAgY29uc3QgZWZmZWN0cyA9IHN0eWxlLmVmZmVjdHM7XG4vLyAgICAgaWYgKGVmZmVjdHMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbi8vICAgICBjb25zdCBlZmZlY3QgPSBlZmZlY3RzWzBdO1xuLy8gICAgIGlmIChlZmZlY3QudHlwZSA9PT0gJ0RST1BfU0hBRE9XJykge1xuLy8gICAgICAgLy8gQ2hlY2sgaWYgc2hhZG93IGNvbG9yIGlzIGEgdmFyaWFibGUgcmVmZXJlbmNlXG4vLyAgICAgICBsZXQgY29sb3JWYWx1ZTogc3RyaW5nO1xuLy8gICAgICAgaWYgKCdib3VuZFZhcmlhYmxlcycgaW4gZWZmZWN0ICYmIGVmZmVjdC5ib3VuZFZhcmlhYmxlcz8uY29sb3IpIHtcbi8vICAgICAgICAgY29uc3QgdmFyaWFibGVJZCA9IGVmZmVjdC5ib3VuZFZhcmlhYmxlcy5jb2xvci5pZDtcbi8vICAgICAgICAgY29uc3QgdmFyaWFibGVOYW1lID0gdmFyaWFibGVNYXAuZ2V0KHZhcmlhYmxlSWQpO1xuLy8gICAgICAgICBjb2xvclZhbHVlID0gdmFyaWFibGVOYW1lXG4vLyAgICAgICAgICAgPyBgeyR7dmFyaWFibGVOYW1lfX1gXG4vLyAgICAgICAgICAgOiByZ2JUb0hleChlZmZlY3QuY29sb3IuciwgZWZmZWN0LmNvbG9yLmcsIGVmZmVjdC5jb2xvci5iKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIGNvbG9yVmFsdWUgPSByZ2JUb0hleChlZmZlY3QuY29sb3IuciwgZWZmZWN0LmNvbG9yLmcsIGVmZmVjdC5jb2xvci5iKTtcbi8vICAgICAgIH1cbi8vICAgICAgIGNvbnN0IHNoYWRvd1ZhbHVlOiBJU2hhZG93VmFsdWUgPSB7XG4vLyAgICAgICAgIGNvbG9yOiBjb2xvclZhbHVlLFxuLy8gICAgICAgICB0eXBlOiAnZHJvcFNoYWRvdycsXG4vLyAgICAgICAgIHg6IGVmZmVjdC5vZmZzZXQueCxcbi8vICAgICAgICAgeTogZWZmZWN0Lm9mZnNldC55LFxuLy8gICAgICAgICBibHVyOiBlZmZlY3QucmFkaXVzLFxuLy8gICAgICAgICBzcHJlYWQ6IGVmZmVjdC5zcHJlYWQgfHwgMCxcbi8vICAgICAgIH07XG4vLyAgICAgICAvLyBBZGQgdGhlIHNoYWRvdyB0byB0aGUgc2hhZG93cyBncm91cFxuLy8gICAgICAgdG9rZW5zW3N0eWxlTmFtZV0gPSB7XG4vLyAgICAgICAgIHZhbHVlOiBzaGFkb3dWYWx1ZSxcbi8vICAgICAgICAgdHlwZTogJ2JveFNoYWRvdycsXG4vLyAgICAgICB9O1xuLy8gICAgIH1cbi8vICAgfVxuLy8gICByZXR1cm4gdG9rZW5zO1xuLy8gfVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldE9yaWdpbmFsVmFyaWFibGVOYW1lKHZhcmlhYmxlKSB7XG4gICAgcmV0dXJuIHZhcmlhYmxlLm5hbWUucmVwbGFjZSgvXFwvL2csICctJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0T3JpZ2luYWxTdHlsZU5hbWUoc3R5bGUpIHtcbiAgICByZXR1cm4gc3R5bGUubmFtZS5yZXBsYWNlKC9cXC8vZywgJy0nKTtcbn1cbi8vcHJlcGFyZSB0aGUgdmFyaWFibGUgbmFtZSBmb3IgdGhlIHRva2VuIGtleVxuZXhwb3J0IGZ1bmN0aW9uIGdldFZhcmlhYmxlTmFtZSh2YXJpYWJsZSkge1xuICAgIHJldHVybiBwcmVwYXJlVmFyaWFibGVOYW1lKHZhcmlhYmxlLm5hbWUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVWYXJpYWJsZU5hbWUobmFtZSkge1xuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy8uIF0vZywgJy0nKTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgcmdiYVRvSGV4IH0gZnJvbSAnLi4vdXRpbHMvY29sb3InO1xuaW1wb3J0IHsgZ2V0VmFyaWFibGVOYW1lLCBwcmVwYXJlVmFyaWFibGVOYW1lIH0gZnJvbSAnLi4vdXRpbHMvdmFyaWFibGUnO1xuY29uc3QgREVGQVVMVF9DT0xMRUNUSU9OX05BTUUgPSAndmFyaWFibGVzJztcbmV4cG9ydCBmdW5jdGlvbiBnZXRWYXJpYWJsZXNUb2tlbnMoX2EpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiogKHsgZmlsZUV4dGVuc2lvbiA9ICdqc29uJywgfSkge1xuICAgICAgICAvL2dldCBhbGwgbG9jYWwgdmFyaWFibGVzXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IHlpZWxkIGZpZ21hLnZhcmlhYmxlcy5nZXRMb2NhbFZhcmlhYmxlc0FzeW5jKCk7XG4gICAgICAgIGxldCB0b2tlbnMgPSB7fTtcbiAgICAgICAgLy9nZXQgdmFyaWFibGUgdG9rZW5zIGZvciBlYWNoIHZhcmlhYmxlXG4gICAgICAgIGZvciAoY29uc3QgdmFyaWFibGUgb2YgdmFyaWFibGVzKSB7XG4gICAgICAgICAgICB0b2tlbnMgPSB5aWVsZCBnZXRWYXJpYWJsZVRva2Vucyh2YXJpYWJsZSwgdG9rZW5zLCBmaWxlRXh0ZW5zaW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0VmFyaWFibGVUb2tlbnModmFyaWFibGUsIHRva2VucywgZmlsZUV4dGVuc2lvbikge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vdmFyaWFibGUgY29sbGVjdGlvblxuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0geWllbGQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQ29sbGVjdGlvbkJ5SWRBc3luYyh2YXJpYWJsZS52YXJpYWJsZUNvbGxlY3Rpb25JZCk7XG4gICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgICAgIC8vZ2V0IGNvbGxlY3Rpb24gbmFtZSBmb3IgcGF0aFxuICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb24ubmFtZVxuICAgICAgICAgICAgPyBjb2xsZWN0aW9uLm5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXC4vZywgJy8nKVxuICAgICAgICAgICAgOiBERUZBVUxUX0NPTExFQ1RJT05fTkFNRTtcbiAgICAgICAgLy9nZXQgbW9kZXMgZnJvbSBjb2xsZWN0aW9uLCBub3QgdmFyaWFibGVcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbk1vZGVzID0gY29sbGVjdGlvbi5tb2RlcztcbiAgICAgICAgLy9nZXQgdmFyaWFibGUgdG9rZW5zIGZvciBlYWNoIG1vZGVcbiAgICAgICAgbGV0IG1vZGVOdW1iZXIgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IG1vZGUgb2YgY29sbGVjdGlvbk1vZGVzKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RlTmFtZSA9IG1vZGVOdW1iZXIgPiAwID8gbW9kZS5uYW1lIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgLy9nZXQgcGF0aCBmb3IgdG9rZW5cbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBjb2xsZWN0aW9uTmFtZSArICcvJyArIHByZXBhcmVWYXJpYWJsZU5hbWUobW9kZS5uYW1lKSArICcuJyArIGZpbGVFeHRlbnNpb247XG4gICAgICAgICAgICAvL2dldCB2YXJpYWJsZSB0b2tlbiBmb3IgbW9kZVxuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSB5aWVsZCBnZXRWYXJpYWJsZVRva2VuKHZhcmlhYmxlLCBtb2RlLm1vZGVJZCwgT2JqZWN0LmFzc2lnbih7fSwgdG9rZW5zW3BhdGhdKSwgbW9kZU5hbWUpO1xuICAgICAgICAgICAgLy9tZXJnZSB0b2tlbiBpbnRvIHRva2VucyBvYmplY3RcbiAgICAgICAgICAgIHRva2Vuc1twYXRoXSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdG9rZW5zW3BhdGhdKSwgdG9rZW4pO1xuICAgICAgICAgICAgbW9kZU51bWJlcisrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfSk7XG59XG4vL2dldCB0aGUgdmFyaWFibGUgdmFsdWUgYnkgbW9kZVxuZnVuY3Rpb24gZ2V0VmFyaWFibGVWYWx1ZUJ5TW9kZSh2YXJpYWJsZSwgbW9kZUlkKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgdmFyaWFibGVWYWx1ZUJ5TW9kZSA9IHZhcmlhYmxlID09PSBudWxsIHx8IHZhcmlhYmxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB2YXJpYWJsZS52YWx1ZXNCeU1vZGVbbW9kZUlkXTtcbiAgICAgICAgLy9pZiB0aGUgdmFyaWFibGUgdmFsdWUgaXMgYSBWQVJJQUJMRV9BTElBUywgZ2V0IHRoZSByZWZlcmVuY2VkIHZhcmlhYmxlXG4gICAgICAgIGlmICh0eXBlb2YgdmFyaWFibGVWYWx1ZUJ5TW9kZSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICd0eXBlJyBpbiB2YXJpYWJsZVZhbHVlQnlNb2RlICYmXG4gICAgICAgICAgICB2YXJpYWJsZVZhbHVlQnlNb2RlLnR5cGUgPT09ICdWQVJJQUJMRV9BTElBUycgJiZcbiAgICAgICAgICAgICdpZCcgaW4gdmFyaWFibGVWYWx1ZUJ5TW9kZSAmJlxuICAgICAgICAgICAgdmFyaWFibGVWYWx1ZUJ5TW9kZS5pZCkge1xuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlZFZhcmlhYmxlID0geWllbGQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQnlJZEFzeW5jKHZhcmlhYmxlVmFsdWVCeU1vZGUuaWQpO1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZWRWYXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRoZSByZWZlcmVuY2VkIHZhcmlhYmxlIG5hbWUgd3JhcHBlZCBpbiBjdXJseSBicmFjZXNcbiAgICAgICAgICAgICAgICByZXR1cm4gYHske2dldFZhcmlhYmxlTmFtZShyZWZlcmVuY2VkVmFyaWFibGUpfX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vaWYgdGhlIHZhcmlhYmxlIHR5cGUgaXMgYSBDT0xPUiwgcmV0dXJuIHRoZSBjb2xvciB2YWx1ZVxuICAgICAgICBpZiAodmFyaWFibGUucmVzb2x2ZWRUeXBlID09PSAnQ09MT1InKSB7XG4gICAgICAgICAgICBjb25zdCBjb2xvck9iamVjdCA9IHZhcmlhYmxlLnZhbHVlc0J5TW9kZVttb2RlSWRdO1xuICAgICAgICAgICAgcmV0dXJuIHJnYmFUb0hleChPYmplY3QuYXNzaWduKHt9LCBjb2xvck9iamVjdCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vaWYgdGhlIHZhcmlhYmxlIHR5cGUgaXMgYSBGTE9BVCwgcmV0dXJuIHRoZSBmbG9hdCB2YWx1ZSBpbiBweFxuICAgICAgICBpZiAodmFyaWFibGUucmVzb2x2ZWRUeXBlID09PSAnRkxPQVQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RmxvYXRWYWx1ZSh2YXJpYWJsZS5uYW1lLCB2YXJpYWJsZS52YWx1ZXNCeU1vZGVbbW9kZUlkXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9yZXR1cm4gdGhlIHZhcmlhYmxlIHZhbHVlIGJ5IG1vZGVcbiAgICAgICAgcmV0dXJuIHZhcmlhYmxlLnZhbHVlc0J5TW9kZVttb2RlSWRdO1xuICAgIH0pO1xufVxuLy9nZXQgdGhlIGZsb2F0IHZhbHVlIGluIHB4IG9yIHdpdGhvdXQgcHhcbmZ1bmN0aW9uIGdldEZsb2F0VmFsdWUobmFtZSwgdmFsdWUpIHtcbiAgICAvL2lmIHRoZSBuYW1lIGluY2x1ZGVzICdmb250LXdlaWdodCcsIHJldHVybiB0aGUgdmFsdWUgd2l0aG91dCBweFxuICAgIGlmIChuYW1lLmluY2x1ZGVzKCdmb250LXdlaWdodCcpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgIH1cbiAgICAvL2lmIHRoZSBuYW1lIGluY2x1ZGVzICdvcGFjaXR5JywgcmV0dXJuIHRoZSB2YWx1ZSBkaXZpZGVkIGJ5IDEwMFxuICAgIGlmIChuYW1lLmluY2x1ZGVzKCdvcGFjaXR5JykpIHtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSAvIDEwMCkudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlICsgJ3B4Jztcbn1cbmZ1bmN0aW9uIGdldFZhcmlhYmxlVG9rZW4odmFyaWFibGVfMSwgbW9kZUlkXzEpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiogKHZhcmlhYmxlLCBtb2RlSWQsIGV4aXN0aW5nVG9rZW5zID0ge30sIG1vZGVOYW1lKSB7XG4gICAgICAgIC8vZ2V0IHRoZSB2YXJpYWJsZSB2YWx1ZSBieSBtb2RlXG4gICAgICAgIGNvbnN0IHRva2VuVmFsdWUgPSB7XG4gICAgICAgICAgICB2YWx1ZTogKHlpZWxkIGdldFZhcmlhYmxlVmFsdWVCeU1vZGUodmFyaWFibGUsIG1vZGVJZCkpLFxuICAgICAgICAgICAgdHlwZTogdmFyaWFibGUucmVzb2x2ZWRUeXBlLFxuICAgICAgICAgICAgbW9kZTogbW9kZU5hbWUsXG4gICAgICAgIH07XG4gICAgICAgIC8vYWRkIHRoZSB0b2tlbiB0byB0aGUgZXhpc3RpbmcgdG9rZW5zXG4gICAgICAgIGV4aXN0aW5nVG9rZW5zW2dldFZhcmlhYmxlTmFtZSh2YXJpYWJsZSldID0gdG9rZW5WYWx1ZTtcbiAgICAgICAgcmV0dXJuIGV4aXN0aW5nVG9rZW5zO1xuICAgIH0pO1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBnZXRPcmlnaW5hbFZhcmlhYmxlTmFtZSwgZ2V0T3JpZ2luYWxTdHlsZU5hbWUsIHByZXBhcmVWYXJpYWJsZU5hbWUsIH0gZnJvbSAnLi4vZXhwb3J0L3V0aWxzL3ZhcmlhYmxlJztcbmNvbnN0IEVSUk9SU19NRVNTQUdFUyA9IHtcbiAgICBlcnJvcnNEb3VibGVUb2tlbnM6ICdEb3VibGUgdG9rZW5zIG5hbWVzIGZvdW5kJyxcbiAgICBlcnJvcnNJbmNvcnJlY3ROYW1lczogJ0luY29ycmVjdCBuYW1lIGZvdW5kLiBUaGUgbmFtZSBtdXN0IGNvbnRhaW4gb25seSBsb3dlcmNhc2UgbGV0dGVycywgbnVtYmVycywgYW5kIGh5cGhlbnMnLFxuICAgIGVycm9yc0luY29ycmVjdFJlZmVyZW5jZXM6ICdJbmNvcnJlY3QgcmVmZXJlbmNlIGZvdW5kJyxcbn07XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVUb2tlbnMoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy9nZXQgYWxsIGxvY2FsIHZhcmlhYmxlc1xuICAgICAgICBjb25zdCB2YXJpYWJsZXMgPSB5aWVsZCBmaWdtYS52YXJpYWJsZXMuZ2V0TG9jYWxWYXJpYWJsZXNBc3luYygpO1xuICAgICAgICAvL2dldCBhbGwgbG9jYWwgc3R5bGVzXG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IHlpZWxkIGZpZ21hLmdldExvY2FsUGFpbnRTdHlsZXNBc3luYygpO1xuICAgICAgICAvL3ZhcmlhYmxlIG5hbWVzXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlTmFtZXMgPSBnZXRWYXJpYWJsZU5hbWVzKHZhcmlhYmxlcyk7XG4gICAgICAgIC8vc3R5bGUgbmFtZXNcbiAgICAgICAgY29uc3Qgc3R5bGVOYW1lcyA9IGdldFN0eWxlTmFtZXMoc3R5bGVzKTtcbiAgICAgICAgLy9jb21iaW5lZCBuYW1lc1xuICAgICAgICBjb25zdCBjb21iaW5lZE5hbWVzID0gWy4uLnZhcmlhYmxlTmFtZXMsIC4uLnN0eWxlTmFtZXNdO1xuICAgICAgICAvL2dldCBlcnJvcnMgb2YgZG91YmxlIHRva2Vuc1xuICAgICAgICBjb25zdCBlcnJvcnNEb3VibGVUb2tlbnMgPSBnZXRFcnJvcnNEb3VibGVUb2tlbnMoY29tYmluZWROYW1lcyk7XG4gICAgICAgIC8vZ2V0IGVycm9ycyBvZiBpbmNvcnJlY3QgbmFtZXNcbiAgICAgICAgY29uc3QgZXJyb3JzSW5jb3JyZWN0TmFtZXMgPSBnZXRFcnJvcnNJbmNvcnJlY3ROYW1lcyhjb21iaW5lZE5hbWVzKTtcbiAgICAgICAgLy9nZXQgZXJyb3JzIG9mIGluY29ycmVjdCByZWZlcmVuY2VzXG4gICAgICAgIGNvbnN0IGVycm9yc0luY29ycmVjdFJlZmVyZW5jZXMgPSB5aWVsZCBnZXRFcnJvcnNJbmNvcnJlY3RSZWZlcmVuY2VzKHZhcmlhYmxlcywgc3R5bGVzLCB2YXJpYWJsZU5hbWVzKTtcbiAgICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSBnZXRGaWxlQ29udGVudCh7XG4gICAgICAgICAgICBlcnJvcnNEb3VibGVUb2tlbnMsXG4gICAgICAgICAgICBlcnJvcnNJbmNvcnJlY3ROYW1lcyxcbiAgICAgICAgICAgIGVycm9yc0luY29ycmVjdFJlZmVyZW5jZXMsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWZpbGVDb250ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ1ZhbGlkYXRpb24gY29tcGxldGVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdWYWxpZGF0aW9uIGNvbXBsZXRlZCB3aXRoIGVycm9ycycsXG4gICAgICAgICAgICBmaWxlQ29udGVudCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vZ2V0IGZpbGUgY29udGVudFxuZnVuY3Rpb24gZ2V0RmlsZUNvbnRlbnQocHJvcHMpIHtcbiAgICBsZXQgZmlsZUNvbnRlbnQgPSAnJztcbiAgICBPYmplY3QuZW50cmllcyhwcm9wcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmaWxlQ29udGVudCArPSBgJHtFUlJPUlNfTUVTU0FHRVNba2V5XX06IFxcblxcdCR7dmFsdWUuam9pbignXFxuXFx0Jyl9XFxuYDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaWxlQ29udGVudDtcbn1cbi8vZ2V0IHZhcmlhYmxlIG5hbWVzXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFyaWFibGVOYW1lcyh2YXJpYWJsZXMpIHtcbiAgICAvL2dldCB2YXJpYWJsZSBuYW1lc1xuICAgIHJldHVybiB2YXJpYWJsZXMubWFwKCh2YXJpYWJsZSkgPT4gZ2V0T3JpZ2luYWxWYXJpYWJsZU5hbWUodmFyaWFibGUpKTtcbn1cbi8vZ2V0IHN0eWxlcyBuYW1lc1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0eWxlTmFtZXMoc3R5bGVzKSB7XG4gICAgLy9nZXQgc3R5bGUgbmFtZXNcbiAgICByZXR1cm4gc3R5bGVzLm1hcCgoc3R5bGUpID0+IGdldE9yaWdpbmFsU3R5bGVOYW1lKHN0eWxlKSk7XG59XG4vLyBHZXQgdGhlIGVycm9ycyBvZiBkb3VibGUgdG9rZW5zXG5mdW5jdGlvbiBnZXRFcnJvcnNEb3VibGVUb2tlbnModG9rZW5zKSB7XG4gICAgcmV0dXJuIHRva2Vucy5maWx0ZXIoKHRva2VuLCBpbmRleCwgc2VsZikgPT4gc2VsZi5pbmRleE9mKHRva2VuKSAhPT0gaW5kZXgpO1xufVxuLy8gR2V0IHRoZSBlcnJvcnMgb2YgaW5jb3JyZWN0IG5hbWVzXG5mdW5jdGlvbiBnZXRFcnJvcnNJbmNvcnJlY3ROYW1lcyh0b2tlbnMpIHtcbiAgICBjb25zdCByZUNvcnJlY3ROYW1lID0gL15bYS16QS1aMC05LV0rKFxcW1tcXHctXStcXF0pPyQvO1xuICAgIGNvbnNvbGUubG9nKHRva2Vucyk7XG4gICAgcmV0dXJuIHRva2Vucy5maWx0ZXIoKHRva2VuKSA9PiAhcmVDb3JyZWN0TmFtZS50ZXN0KHRva2VuKSk7XG59XG4vLyBHZXQgdGhlIGVycm9ycyBvZiBpbmNvcnJlY3QgcmVmZXJlbmNlc1xuZnVuY3Rpb24gZ2V0RXJyb3JzSW5jb3JyZWN0UmVmZXJlbmNlcyh2YXJpYWJsZXMsIHN0eWxlcywgdmFyaWFibGVOYW1lcykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgICAvL2NoZWNrIHZhcmlhYmxlIHJlZmVyZW5jZXNcbiAgICAgICAgZm9yIChjb25zdCB2YXJpYWJsZSBvZiB2YXJpYWJsZXMpIHtcbiAgICAgICAgICAgIC8vY2hlY2sgdGhlIHZhcmlhYmxlIHJlZmVyZW5jZVxuICAgICAgICAgICAgY29uc3QgZXJyb3JSZWZlcmVuY2VzID0geWllbGQgY2hlY2tWYXJpYWJsZVJlZmVyZW5jZSh2YXJpYWJsZSwgdmFyaWFibGVOYW1lcyk7XG4gICAgICAgICAgICAvL2lmIHRoZXJlIGFyZSBlcnJvcnMsIGFkZCB0byBlcnJvcnNcbiAgICAgICAgICAgIGlmIChlcnJvclJlZmVyZW5jZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKC4uLmVycm9yUmVmZXJlbmNlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBzdHlsZSBvZiBzdHlsZXMpIHtcbiAgICAgICAgICAgIC8vY2hlY2sgdGhlIHN0eWxlIHJlZmVyZW5jZVxuICAgICAgICAgICAgY29uc3QgZXJyb3JSZWZlcmVuY2VzID0geWllbGQgY2hlY2tTdHlsZVJlZmVyZW5jZShzdHlsZSwgdmFyaWFibGVOYW1lcyk7XG4gICAgICAgICAgICAvL2lmIHRoZXJlIGFyZSBlcnJvcnMsIGFkZCB0byBlcnJvcnNcbiAgICAgICAgICAgIGlmIChlcnJvclJlZmVyZW5jZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKC4uLmVycm9yUmVmZXJlbmNlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVycm9ycztcbiAgICB9KTtcbn1cbi8vIENoZWNrIHRoZSB2YXJpYWJsZSByZWZlcmVuY2VcbmZ1bmN0aW9uIGNoZWNrVmFyaWFibGVSZWZlcmVuY2UodmFyaWFibGUsIHZhcmlhYmxlTmFtZXMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCB2YXJpYWJsZVZhbHVlcyA9IHZhcmlhYmxlLnZhbHVlc0J5TW9kZTtcbiAgICAgICAgY29uc3QgdmFyaWFibGVOYW1lID0gZ2V0T3JpZ2luYWxWYXJpYWJsZU5hbWUodmFyaWFibGUpO1xuICAgICAgICBjb25zdCBlcnJvclJlZmVyZW5jZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBtb2RlSWQgaW4gdmFyaWFibGVWYWx1ZXMpIHtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSB2YWx1ZSBieSBtb2RlXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhcmlhYmxlVmFsdWVzW21vZGVJZF07XG4gICAgICAgICAgICBjb25zdCBlcnJvclJlZmVyZW5jZSA9IHlpZWxkIGNoZWNrUmVmZXJlbmNlKHZhcmlhYmxlTmFtZSwgdmFsdWUsIHZhcmlhYmxlTmFtZXMpO1xuICAgICAgICAgICAgaWYgKGVycm9yUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JSZWZlcmVuY2VzLnB1c2goZXJyb3JSZWZlcmVuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvclJlZmVyZW5jZXM7XG4gICAgfSk7XG59XG4vLyBDaGVjayB0aGUgc3R5bGUgcmVmZXJlbmNlXG5mdW5jdGlvbiBjaGVja1N0eWxlUmVmZXJlbmNlKHN0eWxlLCB2YXJpYWJsZU5hbWVzKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBzdHlsZU5hbWUgPSBwcmVwYXJlVmFyaWFibGVOYW1lKHN0eWxlLm5hbWUpO1xuICAgICAgICBjb25zdCBlcnJvclJlZmVyZW5jZXMgPSBbXTtcbiAgICAgICAgLy9pZiB0aGUgc3R5bGUgaGFzIG5vIGJvdW5kIHZhcmlhYmxlcyBvciBwYWludHMsIHJldHVybiBlbXB0eSBhcnJheVxuICAgICAgICBpZiAoIShzdHlsZSA9PT0gbnVsbCB8fCBzdHlsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc3R5bGUuYm91bmRWYXJpYWJsZXMpIHx8ICEoKF9hID0gc3R5bGUgPT09IG51bGwgfHwgc3R5bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHN0eWxlLmJvdW5kVmFyaWFibGVzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFpbnRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yUmVmZXJlbmNlcztcbiAgICAgICAgfVxuICAgICAgICAvL2NoZWNrIHRoZSBwYWludCByZWZlcmVuY2VzXG4gICAgICAgIGZvciAoY29uc3QgcGFpbnQgb2Ygc3R5bGUuYm91bmRWYXJpYWJsZXMucGFpbnRzKSB7XG4gICAgICAgICAgICAvL2NoZWNrIHRoZSBwYWludCByZWZlcmVuY2VcbiAgICAgICAgICAgIGNvbnN0IGVycm9yUmVmZXJlbmNlID0geWllbGQgY2hlY2tSZWZlcmVuY2Uoc3R5bGVOYW1lLCBwYWludCwgdmFyaWFibGVOYW1lcyk7XG4gICAgICAgICAgICAvL2lmIHRoZXJlIGFyZSBlcnJvcnMsIGFkZCB0byBlcnJvcnNcbiAgICAgICAgICAgIGlmIChlcnJvclJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgIGVycm9yUmVmZXJlbmNlcy5wdXNoKGVycm9yUmVmZXJlbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL3JldHVybiB0aGUgZXJyb3JzXG4gICAgICAgIHJldHVybiBlcnJvclJlZmVyZW5jZXM7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjaGVja1JlZmVyZW5jZSh2YXJpYWJsZU5hbWUsIHJlZmVyZW5jZSwgdmFyaWFibGVOYW1lcykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vaWYgdGhlIHJlZmVyZW5jZSBpcyBub3QgYW4gb2JqZWN0LCByZXR1cm4gbnVsbFxuICAgICAgICBpZiAoIXJlZmVyZW5jZSB8fFxuICAgICAgICAgICAgdHlwZW9mIHJlZmVyZW5jZSAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgICAgICEoJ3R5cGUnIGluIHJlZmVyZW5jZSkgfHxcbiAgICAgICAgICAgICEoJ2lkJyBpbiByZWZlcmVuY2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvL2lmIHRoZSByZWZlcmVuY2UgaXMgbm90IGEgdmFyaWFibGUgYWxpYXMsIHJldHVybiBudWxsXG4gICAgICAgIGlmIChyZWZlcmVuY2UudHlwZSAhPT0gJ1ZBUklBQkxFX0FMSUFTJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy9nZXQgdGhlIHJlZmVyZW5jZWQgdmFyaWFibGVcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlZFZhcmlhYmxlID0geWllbGQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQnlJZEFzeW5jKHJlZmVyZW5jZS5pZCk7XG4gICAgICAgIC8vaWYgdGhlIHJlZmVyZW5jZWQgdmFyaWFibGUgaXMgbm90IGZvdW5kLCBhZGQgdG8gZXJyb3JzXG4gICAgICAgIGlmICghcmVmZXJlbmNlZFZhcmlhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dmFyaWFibGVOYW1lfSByZWZlcmVuY2VzIGFuIGludmFsaWQgdmFyaWFibGUgaWQ6ICR7cmVmZXJlbmNlLmlkfWA7XG4gICAgICAgIH1cbiAgICAgICAgLy9nZXQgdGhlIHJlZmVyZW5jZWQgdmFyaWFibGUgbmFtZVxuICAgICAgICBjb25zdCByZWZlcmVuY2VkVmFyaWFibGVOYW1lID0gZ2V0T3JpZ2luYWxWYXJpYWJsZU5hbWUocmVmZXJlbmNlZFZhcmlhYmxlKTtcbiAgICAgICAgLy9pZiB0aGUgcmVmZXJlbmNlZCB2YXJpYWJsZSBuYW1lIGlzIG5vdCBpbiB0aGUgdmFyaWFibGUgbmFtZXMsIGFkZCB0byBlcnJvcnNcbiAgICAgICAgaWYgKCF2YXJpYWJsZU5hbWVzLmluY2x1ZGVzKHJlZmVyZW5jZWRWYXJpYWJsZU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dmFyaWFibGVOYW1lfSByZWZlcmVuY2VzIGFuIGludmFsaWQgdmFyaWFibGUgbmFtZTogJHtyZWZlcmVuY2VkVmFyaWFibGVOYW1lfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgZXhwb3J0SlNPTlRva2VucyB9IGZyb20gJy4vZXhwb3J0L2V4cG9ydC1qc29uJztcbmltcG9ydCB7IGV4cG9ydENTU1Rva2VucyB9IGZyb20gJy4vZXhwb3J0L2V4cG9ydC1jc3MnO1xuaW1wb3J0IHsgdmFsaWRhdGVUb2tlbnMgfSBmcm9tICcuL3ZhbGlkYXRpb24nO1xuLy8gVGhpcyBwbHVnaW4gZXhwb3J0cyBGaWdtYSBkZXNpZ24gdG9rZW5zICh2YXJpYWJsZXMgYW5kIHN0eWxlcykgdG8gSlNPTiBmb3JtYXRcbi8vIFRoaXMgZmlsZSBob2xkcyB0aGUgbWFpbiBjb2RlIGZvciBwbHVnaW5zLiBDb2RlIGluIHRoaXMgZmlsZSBoYXMgYWNjZXNzIHRvXG4vLyB0aGUgKmZpZ21hIGRvY3VtZW50KiB2aWEgdGhlIGZpZ21hIGdsb2JhbCBvYmplY3QuXG4vLyBZb3UgY2FuIGFjY2VzcyBicm93c2VyIEFQSXMgaW4gdGhlIDxzY3JpcHQ+IHRhZyBpbnNpZGUgXCJ1aS5odG1sXCIgd2hpY2ggaGFzIGFcbi8vIGZ1bGwgYnJvd3NlciBlbnZpcm9ubWVudCAoU2VlIGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9wbHVnaW4tZG9jcy9ob3ctcGx1Z2lucy1ydW4pLlxuLy8gVGhpcyBzaG93cyB0aGUgSFRNTCBwYWdlIGluIFwidWkuaHRtbFwiLlxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA0MDAsIGhlaWdodDogNDAwIH0pO1xuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXG4vLyBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgcGFzc2VkIHRoZSBcInBsdWdpbk1lc3NhZ2VcIiBwcm9wZXJ0eSBvZiB0aGVcbi8vIHBvc3RlZCBtZXNzYWdlLlxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnZXhwb3J0LXRva2VucycpIHtcbiAgICAgICAgY29uc3QgdG9rZW5zID0geWllbGQgZXhwb3J0SlNPTlRva2VucygpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnZXhwb3J0LWZpbGVzJyxcbiAgICAgICAgICAgIHRva2VucyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2V4cG9ydC1jc3MnKSB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IHlpZWxkIGV4cG9ydENTU1Rva2VucygpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnZXhwb3J0LWZpbGVzJyxcbiAgICAgICAgICAgIHRva2VucyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3ZhbGlkYXRlLXRva2VucycpIHtcbiAgICAgICAgY29uc3QgdmFsaWRhdGlvbiA9IHlpZWxkIHZhbGlkYXRlVG9rZW5zKCk7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICd2YWxpZGF0aW9uLXJlc3VsdCcsXG4gICAgICAgICAgICB2YWxpZGF0aW9uLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnY2FuY2VsJykge1xuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9