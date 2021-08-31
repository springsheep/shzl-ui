(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["shzl-ui"] = factory();
	else
		root["shzl-ui"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "112a");
/******/ })
/************************************************************************/
/******/ ({

/***/ "032e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");
var settle = __webpack_require__("4a86");
var cookies = __webpack_require__("ca6e");
var buildURL = __webpack_require__("4367");
var buildFullPath = __webpack_require__("aafc");
var parseHeaders = __webpack_require__("7868");
var isURLSameOrigin = __webpack_require__("d335");
var createError = __webpack_require__("a505");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "0353":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("6bf8");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "0451":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("9cff");
var isArray = __webpack_require__("d1cb");
var SPECIES = __webpack_require__("839a")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "0479":
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__("5454");
exports = module.exports = __webpack_require__("690e")(false);
// imports


// module
exports.push([module.i, "@font-face{font-family:iconfont;src:url(" + escape(__webpack_require__("06da")) + ");src:url(" + escape(__webpack_require__("06da")) + "#iefix) format(\"embedded-opentype\"),url(\"data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAABlcAAsAAAAAMDwAABkOAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCJFArIVLl8ATYCJAOBMAtaAAQgBYRtB4QCG8AnVUaFjQMg2+y7Rfb/pwQ6BuxA7iBlEYIxqKczB65GG3ai5V7ElKxVhy+NIEABir8I8UH3RxYXH+mlvKSMc/6Jl82ecNJy1hzjwk52T5ybUIDThlLy8P/7fdv3yf/v24h5Yk1CJUHCM4lEJHmmZNIQGiFZ9XjG4+Q3PD+3/3N3t3GX9y4IHbExGMPaHCMHvVEiPUYtMIaIYA/tEWWiTSnvCwYqRn5pI6cigoXIsAJndQC0+f/5wCOd1m4sOZ9Z4b0gjN0TdFjd3e9KAWQ3Uiu1ZDtITwB2sj81v9lOa8PCsNiXX+pa2ljXPBkEyMHIX4hrbX4+nh7FidYoe3AH5/S3mz0AOlLmu0XhkGxnk+KBuiUZUuFuBA/47472CUMP4kxzfcdaUjsj4O+npVRyLcxm1+T62Hm4nTI8jOl9bXv6kk//+pfcdjdltVd1bqu02lDGKOnS7bn0XXel1AYdQA5lgsNQKA0KgCCQNueXY3JpQgGV2WNs/nuwauZAm7LibfaPPDIJbXN2pJtfY5IBonAzE2zxkrKzAOLpUEjmJ9XqBmefBQWqUqqyysyE+ET/+HSMzqUKyJQ5uB3VgxeKaSA4wCF3b2rneV7oTXoSm32RYwcF2RtuMb0+gC3aobzN+2EWKfYAOG9BYSpAEMlMPBNJ+QsWSiFDlhnyLVckdOBN7/l3f/i5tffDwfVzawUIApGOSxRvcuBEzWlZNsHpqrjJ5Py99UVXyYWLnhw7Mfm0pPyvecCAQV1TRsybkOvZNGdSYUtLZtiyMaUlDUO2jdqwqs+6fjM6Zi0YlzStaJu2qLJGagDYvAvZCO7fJgABBggCMEgQgS5BA6YIOjBCoMA8YQ1MEDZATtgCPYILbBI8YI4QAZOEGCiIicAWIQVahD+QEYHAMBEELBPBwBgRCpSEAlgiMoAGoQGGCK3RNpYOgFEiC9ggZgCrRD7QRywD1onlQD9RBMwQW4AOsROYJQ4CC8RRYJy4BST2WUCT/Vxghf12oM3+eWCag1BgkUMnoaIWF/qtYSLaK48BP4HOHn2f3cwU5N7jxpVSxvDDT01EvDMP4xC2JXjLCVvCY48E8FImUamEIBuaYjmiZ8FmacxzdKUol+LER6Rirj2ZAEdXlEW7gTlJSnAiIRpwVVWKUfX1eA5qa9lsaxouzyW1KXHXI8dblJZAL1V4tGrGrNnUIkEo5jQFo0tYKDcwDCrERQpwqozFIrSguomJ6QOjMWB4ipCvhtJ7aUpowi63DHAxxvJPJBwoQuFTVr1CWExySTPRVEKNW09zM4ZCyrJjPYrAggCgZHOYilJz0PqJ6g7U50ismLFQ3Y0yV+98gwqtG8GP9fNT7Z2jvNTkFJPzywmWpxtRqPrarnsY8RXTZjTQdHZIpzjxtzxEwuBO1hj2frcUj2DeDTWpTRjhjWjbQ86Vf+NeE5Z0TuHU5RhqlIXAsKIXcyQ2NRoEzJ54kIXP2++UbNpWdIVdB8CzEABAwTtdiuj/QzzB8yKFKYmXB6GT9EABSQ1PjA6nNjHbkrbVTTmljI1p4yP6qDHSHEjGeNrlidivtySKpzpmegNgPLFVNgdiRX98CxwbVVBbTbsU1KaljOVHsCtnGwAIOJBU+Nqw95SGbsi47ErVvdS8QjbndMiK12vcD++fovrdpZQskwJISYiGFxC6LWTyWbLJi1g4RcWcg3URj4gPaSXEhMSGmzXAQ0PCOboionsdFTz7Pd5+nk3c8MCHX3HhKE3jJvshtSfijP4gfNOodZ+NWgMEkUGd9diHdgUy9nzSqcT7zhOAycduFT5wF3hyz3587x63ypUQEJtPoh0C7vSxc+lduzfApoh+T8INEU8yhDMiDRBlj1uWyDqNwqlVXJCxGwgGjyzgtLQgeARrI0ojS0QRW0qhuirzUi/sJAggiSNbyrlTyu+4TeKZXeIAL8IRgfoSapndEDWETgCe7MamH0pNEpC4Jk5FGAl9VfYL0lY/xA9iV/FDHZ2nE99aXReJHzK5JQTS1gYC4wSMcEFIxCIKQGeIIS04wPa6eHvsf9puYHkdDbmsk+/6joKNKIKxFoUJglJG52ogIym24T5ekQoEm5vZgAg/vyv49U4VKSniR94AOF/4ZcbpM6qn51nDFXGf7/peGbzwm4RcLP46ezTjaGcXO9jlsZ/twCa5iL0F4C39Nuf2u/3+/UxrDpv86baOwnn0bUL85d/nT+Zc4+Isg4w05pMtbV5mUfaHYwUnVLHMrDIJJY2m73KH5i+7+/bt27yVdWc7T5ZDj9WkbJPfgvWwyjhBRCzQnGzb+s92zrtrvpcrz/uU5WFZoYeWUj7o2HN7XU/11L8Tv99b5IaI2g1O4AxPyYH+gcd+4qVbAdKUrcTAV8zzZxGll/PU55/xrDvm4T+g+oipzmzni586Xr6eKxptR0WE7ppv1flLQlD4UhbHmu6mbvdv82tld768EhTAZGPUupa+cFpYaBJ/fOLmpTUr2VKaPnfEFHIOR8Yf88WOBZLnYN51iezbqEBI2BLXlpAlF9fdFmyw8DTXgG9sMCBmjxUZ5ogdmzobCjWNdoWqNuwPMmsMLAxZNJi0ygPUju+ynVygJChtmJE0wChxJHkAjsMiOOaFe37KIIR+7EZeYJnjowWWKpDrLL/sreNy2Nel3NJdZdk11A1HrN8Xd8PDHu2b2XH9L4/azdxjrAGtExjT+6rz4H9119hZ1dPWM8YXbhcl820+4RbivXGhI2OS+APfqveE92C4QvS2kH012KgnSpT7a/SKrW95ooHTr5J32bjcnXKKEHBwg7payU0wzhILAgVC/NDAWtOleCdFpTLZGYfBU8ZyIG39/GwYR2Q+dkeP+v28UHhiTGY+BQJMzCUERMkSEaJGnYzogHIdX59UCzdHlfYe0nhsLL4/Tijif8Kg3B0A/J7WIiBQGzr/JLm82EEgzbIFFSt4EnSREc4VtkjZJFnPYskrfvUW5k9EhPwja7hDmlKf0hTLZqOu2mPflN2f3/fZTFMw3YlBlFxx2JvuH732gjSE8XtMIf7sKhyPi/ZkL2bLNrcd0no0g7aIh0UO79ek4DUAgr5IqMd3qNsa/FzGvGsQ5pu1mZ4SRuCMkIh+srcmi94bsiibl7KiTYAAE1+ZeMoBJKSgldCOfdZZqJhYLAAPGOfym3YsAyQaBaHvJXXNvXpcBf2ACr+gRpaSkIvihZ4P/TeuYRmgsjGRTa5880UAA7aT4MmiA5GhIekp6p54xLW7FLiPSuEvAILAiQIPC0ueV33GfEpWPC46AaFQz0ZRekHZPYZ3Dii2CQd2T2xg11jsgGsYWz310QSAgDBjHAiaF96PV9vPyUxqCRSoiB3sfaSTIGq2X6rE7lAUMM7DyiLVtuzjpbT44Wg46Po1PTOC0q+X9Vd4rwQ5Kto+ULy3QfaWtKtfj0XvGBNkjPhlcbY7zkZG46oA4DnhJ9V+KhzNlIQXYFVSOSH6x/YBYc2JYw/OcgxWpiuzqw+NtCt3X6NvEdwFK1STP9WUklSHx22mpFseMbqFznT6s/2ymbeF76ebU5nX+uBU7E7dJJ+wRnjfupaaaecalX4Qb2FXI3S36W0n5H7YdhxBX8/Dy3gFs86lemofJFst++M2x2aZpicbhW81sFjnws7lAKfy23PIWXgjgu9YRwyRJKTYx5GfNNB0OhWz5Jb1DdjGuhgrZiIaoGy6JCbcBEeyIQSdUyWmVb/CtmNdQWi56cz1OuB71glqv9vLVPjsL4hABjeIWMDu35fTxKf7c53IfwTPrd5O2CLkpC0jhL04IuIEFxM1SrY8aUaoPDGK/LtRtIUY/y25LCnPIYoTFwR46OdNuRrvRHI0e4dU9Sn206u4OLuQNGywRaJsicW/EseyZWnsMNZOafLf2M+f92aQ4cA0ZZ/k3UjwPSyyJ2xTBIyo2P4jsX2NdaIW8YUTFvT405zpVlXj6p9u3lFYLZCJuXrWdtaLoTOR2ys9xyouuF/7AvZe2JbpdXr5G8MjVX1tfZ3qkaGxUULiz1qgsnNf+T4VcTc56f29fJJz261hMLuuvq4uG1w+mcdfyP9NovMGoqLyJTUeDyV7pflfDfxZAJr1d8MDl40ukVER0IOok353B6KAVJddZChq/9HubpBt+Mkrru0x+AFpvH8pEpZVItqVscRqk9IwiiCXe1z7VOA9wsM9gE5nUqIKMkmBhylNclRhzv0MKdBJGX1m24tZvlmzbJm3bMFSeaktGVUOxYBZiSa3RQyBV/LykBrkFEnThU/ykWqdNARdevOQZuQkpOHWXDq0fZfb+cg+btc+BN0av1d6a/yO+LfGv53DtT3VDka25wkUAkDS9GMGXoXhu1oar1714HiIE8qA5LfHb0/GeSIaBO/zDJ3mESyRi5vxMszqWbLXhYda7wfYR6EC4cNhi53l8Acqg56nBo4ODPVhyygLZWU/w8GB0c/ftdTy/tr+A3fuDMFK5ghPCf/5TkD+a2IF67dcsmvsuF19d1sh04gJa42IWLqUYUckGhvAixfxGboMmTDMBF3Geas7oGEvhfHCPVqdCYBeLHBNTHmsS0NYAU/vrOcVVDFdHQmM19viFYCVK7k0HGpEgcyl4szc4OAGD7KO7NHQtQ4EN1C5f/MhLTbUUP3SoQQCgY6S827c2PSeFXAW02iLA2UbNsiAT49QaKlGm9Bqi9ZcjZJama0kGoOmpTPoTaRdaPQxDhmP6kkqANMRC8RRnwriKSdl59oOxilhZQqNSe+wvKj1jEjESIsfSzR8DK1e4kRqJfus5+tIbaSLovg4H0tHB+mxHM2YhDJkenp6CqOVsY7RM0ydALnGSMkIcBMkAl6WpTkzA/bsCQCTHexN4N7nLwFE4jjGEoxAZNeIM2s9e86/rDx2u+/Q6tJS/+7u1d7eVr23ev19LXHgjEd/fXhxCxbIqv/zO+x5GKBJ+kwbdqj12p4WLd3Hh3o8dWEvJRra3G63CcbPDZ9m3jHDymrWY2rQyo11PTOetb6mY5RpW9o6dXNP13Q6GPAurROUxjPotcrlSILNC5XnjFOfDzodTJhVz62v778NuLDuGp5Ox1fuWkfIOhXUc7n74OFhmNy+hpDFZdS6SUvsPu8iw448sYSfeDDnxak/B8Eo7sXpkwWJ/iSl68OG2nauVkkbcNJdFMTMdI1Zf+YeOiXTeFP/31Dr8pCuTPGfLGibrloV+ITxkXhnwkY8S0fDBKa0K40GRBL5tLLiDH6TIDlUnhTi6Z4VHBwSK7FIgx9QwTdIF6Cua4x26AmeHb5QtygmIYtYOMVbmY2FhjIZ1zQGbxqEq0Vy1MiQ8DBoIgNAXqfxX77Ap+V8+fzqyM+f8a9df/5C2STcie+7DTfAO/v6dsLoE5+ffkPfbU2hlsH2gMYr4xoCwsbFEcIi8UmQtSanzFW3BF5CJOcRw1djUj8peKIOCKis5U2QT2AevFCxiDT6Q3Y280QNixe87+GGheF6cLRxrecGmyI4gNNDIsD7xeaZ0Jq1uBzp8xYzIVfFPbMWt2IFpAk9bq7FocqcwT0gXKMOh0Kq1dCLq51vqUYNfjcRE39XEMqeF4uCmDc699d/dOGV/Fluzpv/15n/cW3rQMc4uv/TLtJZq8QHBrcRh+2t//vqeCtz2sC8gdzun/aHG6vHe70Znh8KPDceOGqMiUGikWozWtsZdRP6pySxfz/p3siFg7XscNrRUkq3p4zY3teVkDl2OQbz9PHsiLvbBL2t9y33rvS2yc7JybZhSct9699Cm3SRLeXlLZFEeFoB1LFyQt64/HHDScnJScNGLXkTVnZABXDjg/uNK9pwYmWqZIr11aa3RgdoJFrpt5iuN6vWzjfqCzJUlUcPoYv9KoNL/RaBZYg8UZ5EIsfKjsMWE1wL11gu89uVxFDepgrXS+jJwDGcIxeOZZn7S87vtOr6yoe3WK6c+KsGzbIQWaiPS7SLInUsc7KtiyTYMcS72a8V7PcP8Qv1idqqgkJPdNkMjt3C0ilpU6pa8fpy70wgOybTYGFMhBmGaYj/tXIICNF2j2AyJmfEMuXMyRCIZcgrizWMrOD5NQw5ZJUg3yaQMDrqkmIN8WjzWDzClDP0ng3ZP3eRWwpxQFjX4tfytkXWUkEqwMU09YCT03I7Axpi1L5qboqTb6BvkNFrCDwsCgJhmOg5rL/4zq5OPLwyMCAQmFSLyIPsQbJ5fXCnO/ysTOH0lhePnl0uxV3SeXTF5XPkVset5HNMQTCVwa5mm4gPC8XCQuhYLlfqks8DWh48CcDLqOuxO8Lg2PWrqPyjqf6pGe+Li588GbseypAcMxqPHVOpeABrhsC9pz7g0avHoR7oCJEttVXZ9QMRFXR4c1BE0FFQhYYEYv1Y+U5eeMJI2HlOM+ahzo7OqOnU0HuvxMGZfrqzg6QGOOo/TPOai3JkTfzrCYCvuGjh0yE63+JpTnGczePHUy3U14DqSBG7TgCjp3pEEyuI5Nq+e+8I/Ed4SCCQV16zWLKJGEujxRJ9+Ytr+MjT8vWJTRKBiaCOYgLaliiPxTXOiLNUZxfgqeEbpnAXA1O7xpAFidZYn4oh3MWkcFPnuGmio9UCzwfiM+xT+ncCk+DRksVhTYW6WyGJ05csGXS7Jng3vaxZAakzIQWOWk2vWAw2ZV4x6ADFjZir+YgTiJuFzWJPtSA62k2T46YG4fMut1W1sc+wJcQfzaniLPaozToVI3GyxEQ/iV/lZO+EBJ0K8KwIw7lBWK+A3HBTa6dF5fi/S39RvyvrZHpuGZXkhXKIgdSwfXISMA32shxvVJuh/lmxesepaw5Vxv4Fq7/+Lw8ei/CQOGLq7JObnU7r3V/UTyBYpdu2KpHDh6fQZNO9HZZwK4znrzkYb4472jyp2dWFM5nqR+xZmKsz9CGLqBIETO+2bxTbnuxdWaFr0xRZ+033stWJDquS6HoKGq/i5ZL4lHSg1V4e6ScE83sfa/gevcAcbC6g91DzcsALuGkONUzP/VCXywAv55AODPBcD1WBAcOtI6bjyspwlZsOwsWcYQcSoNxciFxCQ8jiqD+uZP3hIwbWCMuwTkDPegScM8+0t9/6D4zaVSAVS6s7nV1DQ4cepz5/BcBbLMSq8ufTthfQNq8oel4SabZJcJobTPAbKvnq02i7zb96Bgj4cHJ1UMQr3rAuc8ZtUZhoRl+Grvc1zytu9b4meYDwlVTv2JN30eHirTzHFKnbq/GrqlMLAkN43S3pQ2E3qxZud0JswdrKcxx8yjvVkZQj71LwJyaAUoEpeUqsgoF2A6I/Plc/9+zxVNsO2j4nafrln6EKvYTAm59t1SSPP5s5F5yGSUP8Q6N7KFNIV+wcFp7evALKANsSRRFXSeS3FC35YdWGKhNpA+k6WUu5YctPECjXGh+StSSTTu8G8iAvjfyIjDQq4rszkgsDnzA8IqwQhpM0rtdtN2LDbmV/st7PzsI3B5dkJU1k77f+5Jdg5b/b9J4VqGvthaejxiFmmNu4UROc33jMABzfeF4X7Fq8NWLcH3WL+UPYG6r14q4DUL9zB7b2embcS4jrggFSNxiGdUbfXfdgFm/+fZylr9p3OFs20exvHgFcCI2DhmD+0644CYthKfI3uKUDd9yC3fOgA2CvTdt9r79sCN5reArIe7gLoO5UtQN1zsOpaVEWNDbpgNX+dcdgD9xc4zmsnzjQ+GC+wALaX6erI3VgcVmcxj4H4El9u/2AE+pmPiqTqH+lYRP+92MsdP/9Cmct6p/KWUX+ReRhv2omU1Eb0z+Xi0rmtibxfx0XKTMOQP1vzrYZ1LlTHC+DXJ97vFNL12dX78pErIRXCKX/76TwZcDNz9C+34z//1g/5H8d7VFtZlLlSW20TNOslqusqMXkHa3Usas1VK5obdvuVOsY9gosFaS//NsfQUsG7GmZPl+13IBvajH5H5Vgn4LWMJByre1hYtXY2VeQ6DxMEBSdGXeGLGfvbj1nW/7CUBOIO0Mb/qEUOtu8GB79g98wo6Sxm7IOL1W98cKz+WocHabEZhGe0OoQVZePq5XnJRgszwfnYYKg6IxxZ7Ymy9nfu54HTv4vDDWBSC711PofSqFtN14YPGqo33jWutSyhMs6vKRIekMuKDwbX5HEdO9jY+FXm9DqIMbwl49W6Nq8Lh/yt+c+9jho3/aM2cGlaWvv6Oz6Y8K/RXdPb18/g8liW9vY2o0azbF3cHTi8pz5Lq4CN6H7mLHjBO1bmxDkYoM0ErDS67edw4SKjYexPvynHJ45h1ipRK77CLmx7LBVGBPeOtr1bzG+V9wqCMLVnpw27RQPr061mQrny4kSQd5WyHvsXnFPNnHGuw3mKZRKcjLYKAqeecwBt8H8hdblRbtPcGRulGY822AOa4p24WfegOuD9TMnpeXMRrTP/cjbrmxIbTxZyoCJveGW8lL1UsAR92CV1thaTixdSeRQUg09jSDlytfi5EaL53r4CxoHikdkWxUosQ1Crm+cQDgvLLVNoXOeLtd5RGl3oa5gQquXqdC+ATbDfaT+tBjyxdWvcIwYn/ATL7u27LJ90TSiWw4A\") format(\"woff2\"),url(" + escape(__webpack_require__("9074")) + ") format(\"woff\"),url(" + escape(__webpack_require__("fa2d")) + ") format(\"truetype\"),url(" + escape(__webpack_require__("3783")) + "#iconfont) format(\"svg\")}.iconfont{font-family:iconfont!important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.icon-clear:before{content:\"\\E6D1\"}.icon-weibiaoti46:before{content:\"\\E63C\"}.icon-delete:before{content:\"\\E616\"}.icon-fabu:before{content:\"\\E630\"}.icon-qingkonghuishouzhan:before{content:\"\\E642\"}.icon-code:before{content:\"\\E65B\"}.icon-table:before{content:\"\\E713\"}.icon-diy-com-textarea:before{content:\"\\E91F\"}.icon-zidingyishuju:before{content:\"\\E634\"}.icon-json:before{content:\"\\E7BD\"}.icon-jilianxuanze:before{content:\"\\E695\"}.icon-icon_clone:before{content:\"\\E606\"}.icon-wenjianshangchuan:before{content:\"\\E617\"}.icon-fengexian:before{content:\"\\E66E\"}.icon-tupianyulan:before{content:\"\\E67D\"}.icon-time:before{content:\"\\E600\"}.icon-icon-test:before{content:\"\\E605\"}.icon-tupian:before{content:\"\\E65E\"}.icon-ad-icon-tooltip:before{content:\"\\E63E\"}.icon-check-box:before{content:\"\\E60E\"}.icon-switch:before{content:\"\\E660\"}.icon-pingfen:before{content:\"\\E640\"}.icon-input:before{content:\"\\E6B2\"}.icon-radio-active:before{content:\"\\E615\"}.icon-color:before{content:\"\\E62F\"}.icon-slider:before{content:\"\\E60D\"}.icon-icon_bars:before{content:\"\\E7C4\"}.icon-fuwenbenkuang:before{content:\"\\E682\"}.icon-date:before{content:\"\\E69F\"}.icon-ic:before{content:\"\\E621\"}.icon-trash:before{content:\"\\E60F\"}.icon-grid-:before{content:\"\\E6AD\"}.icon-drag:before{content:\"\\E842\"}.icon-shangchuan:before{content:\"\\E645\"}.icon-zhage:before{content:\"\\E63F\"}.icon-number:before{content:\"\\E76B\"}.icon-yulan:before{content:\"\\E668\"}.icon-select:before{content:\"\\E920\"}.icon-wenzishezhi-:before{content:\"\\E67C\"}.icon-pingfen1:before{content:\"\\E661\"}.icon-RectangleCopy:before{content:\"\\E620\"}.icon-sync1:before{content:\"\\E631\"}.icon-tabs:before{content:\"\\E65F\"}", ""]);

// exports


/***/ }),

/***/ "04ff":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "05fd":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("baa7")('native-function-to-string', Function.toString);


/***/ }),

/***/ "065d":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("bb8b");
var createDesc = __webpack_require__("5edc");
module.exports = __webpack_require__("26df") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "065e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "0677":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "06d4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");
var transformData = __webpack_require__("e067");
var isCancel = __webpack_require__("5816");
var defaults = __webpack_require__("7723");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "06da":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/iconfont.8efbc988.eot";

/***/ }),

/***/ "078c":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("0b34");
var core = __webpack_require__("76e3");
var LIBRARY = __webpack_require__("3d8a");
var wksExt = __webpack_require__("1a58");
var defineProperty = __webpack_require__("bb8b").f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),

/***/ "0808":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("3c75");
var hiddenKeys = __webpack_require__("69ac").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "0926":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "0b34":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "0c29":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "0c84":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__("1663")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__("120f")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "0cb2":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("597a");
var createDesc = __webpack_require__("d48a");
module.exports = __webpack_require__("5e9e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "0cc5":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "100d":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "10a3":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("f263");

/***/ }),

/***/ "112a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@3.12.1@@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("e67d")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es7.object.get-own-property-descriptors.js
var es7_object_get_own_property_descriptors = __webpack_require__("ac67");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("1bc7");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("25ba");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("32ea");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("a450");

// EXTERNAL MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__("c1a2");

// EXTERNAL MODULE: ./node_modules/_vue-i18n@5.0.3@vue-i18n/dist/vue-i18n.common.js
var vue_i18n_common = __webpack_require__("d4f1");
var vue_i18n_common_default = /*#__PURE__*/__webpack_require__.n(vue_i18n_common);

// CONCATENATED MODULE: ./packages/shzl-genrator-form/lang/en-US.js
/* harmony default export */ var en_US = ({
  fm: {
    components: {
      fields: {
        input: 'Input',
        textarea: 'Textarea',
        number: 'Number',
        radio: 'Radio',
        checkbox: 'Checkbox',
        time: 'Time',
        date: 'Date',
        rate: 'Rate',
        color: 'Color',
        select: 'Select',
        switch: 'Switch',
        slider: 'Slider',
        text: 'Text',
        blank: 'Custom',
        fileupload: 'File',
        imgupload: 'Image',
        editor: 'Editor',
        cascader: 'Cascader',
        table: 'Sub-table',
        grid: 'Grid',
        tabs: 'Tabs',
        divider: 'Divider'
      },
      basic: {
        title: 'Basic Component'
      },
      advance: {
        title: 'Advance Component'
      },
      layout: {
        title: 'Layout'
      }
    },
    description: {
      containerEmpty: 'You can drag and drop the item from the left to add components',
      configEmpty: 'Please add a component',
      tableEmpty: 'You can drag and drop the item from the left to add components',
      uploadJsonInfo: 'There is the format of JSON below，you can overwrite it with you own JSON code'
    },
    message: {
      copySuccess: 'Copy Successed',
      validError: 'Form data validation failed'
    },
    actions: {
      import: 'Import JSON',
      clear: 'Clear',
      preview: 'Preview',
      json: 'Generate JSON',
      code: 'Generate Code',
      getData: 'Get Data',
      reset: 'Reset',
      copyData: 'Copy Data',
      cancel: 'Cancel',
      confirm: 'Confirm',
      addOption: 'Add Option',
      addColumn: 'Add Column',
      addTab: 'Add Tab',
      upload: 'Upload',
      add: 'Add'
    },
    config: {
      form: {
        title: 'Form Attribute',
        labelPosition: {
          title: 'Label Position',
          left: 'Left',
          right: 'Right',
          top: 'Top'
        },
        labelWidth: 'Label Width',
        size: 'Size',
        customClass: 'Custom Class'
      },
      widget: {
        title: 'Component Attribute',
        model: 'ID',
        name: 'Name',
        width: 'Width',
        height: 'Height',
        size: 'Size',
        labelWidth: 'Label Width',
        custom: 'Custom',
        placeholder: 'Placeholder',
        layout: 'Layout',
        block: 'Block',
        inline: 'Inline',
        contentPosition: 'Content Position',
        left: 'Left',
        right: 'Right',
        center: 'Center',
        showInput: 'Display Input Box',
        min: 'Minimum',
        max: 'Maximum',
        step: 'Step',
        multiple: 'Multiple',
        filterable: 'Searchable',
        allowHalf: 'Allow Half',
        showAlpha: 'Support transparency options',
        showLabel: 'Show lable',
        option: 'Option',
        staticData: 'Static Data',
        remoteData: 'Remote Date',
        remoteFunc: 'Remote Function',
        value: 'Value',
        label: 'Label',
        childrenOption: 'Sub-Option',
        defaultValue: 'Default Value',
        showType: 'Display type',
        isRange: 'Range Time',
        isTimestamp: 'Get time stamp',
        startPlaceholder: 'Placeholder of start time',
        endPlaceholder: 'Placeholder of end time',
        format: 'Format',
        limit: 'Maximum Upload Count',
        isQiniu: 'Upload with Qiniu Cloud',
        tokenFunc: 'A funchtin to get Qiniu Uptoken',
        imageAction: 'Picture upload address',
        tip: 'Text Prompt',
        action: 'Upload Address',
        defaultType: 'Data Type',
        string: 'String',
        object: 'Object',
        array: 'Array',
        number: 'Number',
        boolean: 'Boolean',
        integer: 'Integer',
        float: 'Float',
        url: 'URL',
        email: 'E-mail',
        hex: 'Hexadecimal',
        gutter: 'Grid Spacing',
        columnOption: 'Column Configuration',
        span: 'Grid spans',
        justify: 'Horizontal Arrangement',
        justifyStart: 'Start',
        justifyEnd: 'End',
        justifyCenter: 'Center',
        justifySpaceAround: 'Space Around',
        justifySpaceBetween: 'Space Between',
        align: 'Vertical Arrangement',
        alignTop: 'Top',
        alignMiddle: 'Middle',
        alignBottom: 'Bottom',
        type: 'Type',
        default: 'Default',
        card: 'Tabs',
        borderCard: 'Border-Card',
        tabPosition: 'Tab Position',
        top: 'Tob',
        bottom: 'Bottom',
        tabOption: 'Label Configuration',
        tabName: 'Tab Name',
        customClass: 'Custom Class',
        attribute: 'Attribute Action',
        dataBind: 'Data Binding',
        hidden: 'Hidden',
        readonly: 'Read Only',
        disabled: 'Disabled',
        editable: 'Text box is editable',
        clearable: 'Display Clear Button',
        arrowControl: 'Use the arrow for time selection',
        isDelete: 'Deletable',
        isEdit: 'Editable',
        showPassword: 'Display Password',
        validate: 'Validation',
        required: 'Required',
        patternPlaceholder: 'Fill in the regular expressions',
        newOption: 'New Option',
        tab: 'Tab',
        validatorRequired: 'Required',
        validatorType: 'Invaild format',
        validatorPattern: 'Unmatched pattern'
      }
    },
    upload: {
      preview: 'preview',
      edit: 'replace',
      delete: 'delete'
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/lang/zh-CN.js
/* harmony default export */ var zh_CN = ({
  fm: {
    components: {
      fields: {
        input: '单行文本',
        textarea: '多行文本',
        number: '计数器',
        radio: '单选框组',
        checkbox: '多选框组',
        time: '时间选择器',
        date: '日期选择器',
        rate: '评分',
        color: '颜色选择器',
        select: '下拉选择框',
        switch: '开关',
        slider: '滑块',
        text: '文字',
        blank: '自定义区域',
        fileupload: '文件',
        imgupload: '图片',
        editor: '编辑器',
        cascader: '级联选择器',
        table: '子表单',
        grid: '栅格布局',
        tabs: '标签页',
        divider: '分割线'
      },
      basic: {
        title: '基础字段'
      },
      advance: {
        title: '高级字段'
      },
      layout: {
        title: '布局字段'
      }
    },
    description: {
      containerEmpty: '从左侧拖拽来添加字段',
      configEmpty: '请添加字段',
      tableEmpty: '从左侧拖拽来添加字段',
      uploadJsonInfo: 'JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可'
    },
    message: {
      copySuccess: '复制成功',
      validError: '表单数据校验失败'
    },
    actions: {
      import: '导入JSON',
      clear: '清空',
      preview: '预览',
      json: '生成JSON',
      code: '生成代码',
      getData: '获取数据',
      reset: '重置',
      copyData: '复制数据',
      cancel: '取 消',
      confirm: '确 定',
      addOption: '添加选项',
      addColumn: '添加列',
      addTab: '添加标签',
      upload: '点击上传',
      add: '添加'
    },
    config: {
      form: {
        title: '表单属性',
        labelPosition: {
          title: '标签对齐方式',
          left: '左对齐',
          right: '右对齐',
          top: '顶部对齐'
        },
        labelWidth: '表单标签宽度',
        size: '组件尺寸',
        customClass: '自定义Class'
      },
      widget: {
        title: '字段属性',
        model: '字段标识',
        name: '标题',
        width: '宽度',
        height: '高度',
        size: '大小',
        labelWidth: '标签宽度',
        custom: '自定义',
        placeholder: '占位内容',
        layout: '布局方式',
        block: '块级',
        inline: '行内',
        contentPosition: '文案位置',
        left: '左侧',
        right: '右侧',
        center: '居中',
        showInput: '显示输入框',
        min: '最小值',
        max: '最大值',
        step: '步长',
        multiple: '是否多选',
        filterable: '是否可搜索',
        allowHalf: '允许半选',
        showAlpha: '支持透明度选择',
        showLabel: '是否显示标签',
        option: '选项',
        staticData: '静态数据',
        remoteData: '远端数据',
        remoteFunc: '远端方法',
        value: '值',
        label: '标签',
        childrenOption: '子选项',
        defaultValue: '默认值',
        showType: '显示类型',
        isRange: '是否为范围选择',
        isTimestamp: '是否获取时间戳',
        startPlaceholder: '开始时间占位内容',
        endPlaceholder: '结束时间占位内容',
        format: '格式',
        limit: '最大上传数',
        isQiniu: '使用七牛上传',
        tokenFunc: '获取七牛Token方法',
        imageAction: '图片上传地址',
        tip: '提示说明文字',
        action: '上传地址',
        defaultType: '绑定数据类型',
        string: '字符串',
        object: '对象',
        array: '数组',
        number: '数字',
        boolean: '布尔值',
        integer: '整数',
        float: '浮点数',
        url: 'URL地址',
        email: '邮箱地址',
        hex: '十六进制',
        gutter: '栅格间隔',
        columnOption: '列配置项',
        span: '栅格值',
        justify: '水平排列方式',
        justifyStart: '左对齐',
        justifyEnd: '右对齐',
        justifyCenter: '居中',
        justifySpaceAround: '两侧间隔相等',
        justifySpaceBetween: '两端对齐',
        align: '垂直排列方式',
        alignTop: '顶部对齐',
        alignMiddle: '居中',
        alignBottom: '底部对齐',
        type: '风格类型',
        default: '默认',
        card: '选项卡',
        borderCard: '卡片化',
        tabPosition: '选项卡位置',
        top: '顶部',
        bottom: '底部',
        tabOption: '标签配置项',
        tabName: '标签名称',
        customClass: '自定义Class',
        attribute: '操作属性',
        dataBind: '数据绑定',
        hidden: '隐藏',
        readonly: '完全只读',
        disabled: '禁用',
        editable: '文本框可输入',
        clearable: '显示清除按钮',
        arrowControl: '使用箭头进行时间选择',
        isDelete: '删除',
        isEdit: '编辑',
        showPassword: '显示密码',
        validate: '校验',
        required: '必填',
        patternPlaceholder: '填写正则表达式',
        newOption: '新选项',
        tab: '标签页',
        validatorRequired: '必须填写',
        validatorType: '格式不正确',
        validatorPattern: '格式不匹配'
      }
    },
    upload: {
      preview: '预览',
      edit: '替换',
      delete: '删除'
    }
  }
});
// EXTERNAL MODULE: ./packages/shzl-genrator-form/iconfont/iconfont.css
var iconfont = __webpack_require__("c4c4");

// EXTERNAL MODULE: ./packages/shzl-genrator-form/styles/cover.scss
var cover = __webpack_require__("1828");

// EXTERNAL MODULE: ./packages/shzl-genrator-form/styles/index.scss
var styles = __webpack_require__("223c");

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-color-picker/src/shzl-color-picker.vue?vue&type=template&id=65e1f49a&scoped=true&lang=html&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:(_vm.closePanel),expression:"closePanel"}],ref:"colorPicker",staticClass:"m-colorPicker",on:{"click":function (event) {
         event.stopPropagation();
      }}},[_c('div',{staticClass:"colorBtn",class:{ disabled: _vm.disabled },style:(("background-color: " + _vm.showColor)),on:{"click":_vm.openPanel}}),_c('div',{staticClass:"box",class:{ open: _vm.openStatus }},[_c('div',{staticClass:"hd"},[_c('div',{staticClass:"colorView",style:(("background-color: " + _vm.showPanelColor))}),_c('div',{staticClass:"defaultColor",on:{"click":_vm.handleDefaultColor,"mouseover":function($event){_vm.hoveColor = _vm.defaultColor},"mouseout":function($event){_vm.hoveColor = null}}},[_vm._v("\n            默认颜色\n         ")])]),_c('div',{staticClass:"bd"},[_c('h3',[_vm._v("主题颜色")]),_c('ul',{staticClass:"tColor"},_vm._l((_vm.tColor),function(color,index){return _c('li',{key:index,style:({ backgroundColor: color }),on:{"mouseover":function($event){_vm.hoveColor = color},"mouseout":function($event){_vm.hoveColor = null},"click":function($event){return _vm.updataValue(color)}}})}),0),_c('ul',{staticClass:"bColor"},_vm._l((_vm.colorPanel),function(item,index){return _c('li',{key:index},[_c('ul',_vm._l((item),function(color,cindex){return _c('li',{key:cindex,style:({ backgroundColor: color }),on:{"mouseover":function($event){_vm.hoveColor = color},"mouseout":function($event){_vm.hoveColor = null},"click":function($event){return _vm.updataValue(color)}}})}),0)])}),0),_c('h3',[_vm._v("标准颜色")]),_c('ul',{staticClass:"tColor"},_vm._l((_vm.bColor),function(color,index){return _c('li',{key:index,style:({ backgroundColor: color }),on:{"mouseover":function($event){_vm.hoveColor = color},"mouseout":function($event){_vm.hoveColor = null},"click":function($event){return _vm.updataValue(color)}}})}),0),_c('h3',{on:{"click":_vm.triggerHtml5Color}},[_vm._v("更多颜色...")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.html5Color),expression:"html5Color"}],ref:"html5Color",attrs:{"type":"color"},domProps:{"value":(_vm.html5Color)},on:{"change":function($event){return _vm.updataValue(_vm.html5Color)},"input":function($event){if($event.target.composing){ return; }_vm.html5Color=$event.target.value}}})])])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-color-picker/src/shzl-color-picker.vue?vue&type=template&id=65e1f49a&scoped=true&lang=html&

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es7.symbol.async-iterator.js
var es7_symbol_async_iterator = __webpack_require__("9f60");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.symbol.js
var es6_symbol = __webpack_require__("94f0");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.string.iterator.js
var es6_string_iterator = __webpack_require__("0c84");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.from.js
var es6_array_from = __webpack_require__("2843");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__("4057");

// CONCATENATED MODULE: ./packages/directive/clickoutside.js
var nodeList = [];
var ctx = '@@clickoutsideContext';
var startClick;
var seed = 0;
document.addEventListener('mousedown', function (e) {
  return startClick = e;
});
document.addEventListener('mouseup', function (e) {
  nodeList.forEach(function (node) {
    return node[ctx].documentHandler(e, startClick);
  });
});

function createDocumentHandler(el, binding, vnode) {
  return function () {
    var mouseup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var mousedown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!vnode || !vnode.context || !mouseup.target || !mousedown.target || el.contains(mouseup.target) || el.contains(mousedown.target) || el === mouseup.target || vnode.context.popperElm && (vnode.context.popperElm.contains(mouseup.target) || vnode.context.popperElm.contains(mousedown.target))) return;

    if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}
/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */


/* harmony default export */ var clickoutside = ({
  bind: function bind(el, binding, vnode) {
    nodeList.push(el);
    var id = seed++;
    el[ctx] = {
      id: id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },
  update: function update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },
  unbind: function unbind(el) {
    var len = nodeList.length;

    for (var i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }

    delete el[ctx];
  }
});
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-color-picker/src/shzl-color-picker.vue?vue&type=script&lang=js&







function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var shzl_color_pickervue_type_script_lang_js_ = ({
  name: 'shzlColorPicker',
  directives: {
    clickoutside: clickoutside
  },
  props: {
    // 当前颜色值
    value: {
      type: String,
      required: true
    },
    // 默认颜色
    defaultColor: {
      type: String,
      default: '#000000'
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      // 面板打开状态
      openStatus: false,
      // 鼠标经过的颜色块
      hoveColor: null,
      // 主题颜色
      tColor: ['#000000', '#ffffff', '#eeece1', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c'],
      // 颜色面板
      colorConfig: [['#7f7f7f', '#f2f2f2'], ['#0d0d0d', '#808080'], ['#1c1a10', '#ddd8c3'], ['#0e243d', '#c6d9f0'], ['#233f5e', '#dae5f0'], ['#632623', '#f2dbdb'], ['#4d602c', '#eaf1de'], ['#3f3150', '#e6e0ec'], ['#1e5867', '#d9eef3'], ['#99490f', '#fee9da']],
      // 标准颜色
      bColor: ['#c21401', '#ff1e02', '#ffc12a', '#ffff3a', '#90cf5b', '#00af57', '#00afee', '#0071be', '#00215f', '#72349d'],
      html5Color: this.value
    };
  },
  computed: {
    // 显示面板颜色
    showPanelColor: function showPanelColor() {
      if (this.hoveColor) {
        return this.hoveColor;
      } else {
        return this.showColor;
      }
    },
    // 显示颜色
    showColor: function showColor() {
      if (this.value) {
        return this.value;
      } else {
        return this.defaultColor;
      }
    },
    // 颜色面板
    colorPanel: function colorPanel() {
      var colorArr = [];

      var _iterator = _createForOfIteratorHelper(this.colorConfig),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var color = _step.value;
          colorArr.push(this.gradient(color[1], color[0], 5));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return colorArr;
    }
  },
  methods: {
    openPanel: function openPanel() {
      this.openStatus = !this.disabled;
    },
    closePanel: function closePanel() {
      this.openStatus = false;
    },
    triggerHtml5Color: function triggerHtml5Color() {
      this.$refs.html5Color.click();
    },
    // 更新组件的值 value
    updataValue: function updataValue(value) {
      this.$emit('input', value);
      this.$emit('change', value);
      this.openStatus = false;
    },
    // 设置默认颜色
    handleDefaultColor: function handleDefaultColor() {
      this.updataValue(this.defaultColor);
    },
    // 格式化 hex 颜色值
    parseColor: function parseColor(hexStr) {
      if (hexStr.length === 4) {
        hexStr = '#' + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + hexStr[3] + hexStr[3];
      } else {
        return hexStr;
      }
    },
    // RGB 颜色 转 HEX 颜色
    rgbToHex: function rgbToHex(r, g, b) {
      var hex = (r << 16 | g << 8 | b).toString(16);
      return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
    },
    // HEX 转 RGB 颜色
    hexToRgb: function hexToRgb(hex) {
      hex = this.parseColor(hex);
      var rgb = [];

      for (var i = 1; i < 7; i += 2) {
        rgb.push(parseInt('0x' + hex.slice(i, i + 2)));
      }

      return rgb;
    },
    // 计算渐变过渡颜色
    gradient: function gradient(startColor, endColor, step) {
      // 讲 hex 转换为 rgb
      var sColor = this.hexToRgb(startColor);
      var eColor = this.hexToRgb(endColor); // 计算R\G\B每一步的差值

      var rStep = (eColor[0] - sColor[0]) / step;
      var gStep = (eColor[1] - sColor[1]) / step;
      var bStep = (eColor[2] - sColor[2]) / step;
      var gradientColorArr = []; // 计算每一步的hex值

      for (var i = 0; i < step; i++) {
        gradientColorArr.push(this.rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])));
      }

      return gradientColorArr;
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-color-picker/src/shzl-color-picker.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_shzl_color_pickervue_type_script_lang_js_ = (shzl_color_pickervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/shzl-color-picker/src/shzl-color-picker.vue?vue&type=style&index=0&id=65e1f49a&lang=scss&scoped=true&
var shzl_color_pickervue_type_style_index_0_id_65e1f49a_lang_scss_scoped_true_ = __webpack_require__("9a66");

// EXTERNAL MODULE: ./node_modules/_vue-loader@15.9.8@vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("cba8");

// CONCATENATED MODULE: ./packages/shzl-color-picker/src/shzl-color-picker.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_shzl_color_pickervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "65e1f49a",
  null
  
)

/* harmony default export */ var shzl_color_picker = (component.exports);
// CONCATENATED MODULE: ./packages/shzl-color-picker/index.js


/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-30 15:46:00
 */
// 导入组件
 // 为组件提供 install 安装方法，供按需引入

shzl_color_picker.install = function (Vue) {
  Vue.component(shzl_color_picker.name, shzl_color_picker);
}; // 默认导出组件


/* harmony default export */ var packages_shzl_color_picker = (shzl_color_picker);
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/Container.vue?vue&type=template&id=1c667be1&
var Containervue_type_template_id_1c667be1_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"fm-style"},[_c('el-header',{staticStyle:{"padding":"0px"},attrs:{"height":"45px"}},[_c('el-button',{attrs:{"icon":"el-icon-back"},on:{"click":function($event){return _vm.$emit('back')}}},[_vm._v("返回列表")]),_c('el-button-group',{staticStyle:{"margin":"5px"}},[(_vm.upload)?_c('el-button',{attrs:{"icon":"el-icon-upload2"},on:{"click":_vm.handleUpload}},[_vm._v(_vm._s(_vm.$t('fm.actions.import')))]):_vm._e(),(_vm.clearable)?_c('el-button',{attrs:{"icon":"el-icon-delete"},on:{"click":_vm.handleClear}},[_vm._v(_vm._s(_vm.$t('fm.actions.clear')))]):_vm._e(),(_vm.preview)?_c('el-button',{attrs:{"icon":"el-icon-view"},on:{"click":_vm.handlePreview}},[_vm._v(_vm._s(_vm.$t('fm.actions.preview')))]):_vm._e(),(_vm.generateJson)?_c('el-button',{attrs:{"icon":"el-icon-tickets"},on:{"click":_vm.handleGenerateJson}},[_vm._v(_vm._s(_vm.$t('fm.actions.json')))]):_vm._e(),(_vm.generateCode)?_c('el-button',{attrs:{"icon":"el-icon-document"},on:{"click":_vm.handleGenerateCode}},[_vm._v(_vm._s(_vm.$t('fm.actions.code')))]):_vm._e()],1),_c('el-button',{on:{"click":_vm.saveJson}},[_vm._v("保存")])],1),_c('el-container',{staticClass:"fm2-container"},[_c('el-main',{staticClass:"fm2-main"},[_c('el-container',[_c('el-aside',{attrs:{"width":"250px"}},[_c('div',{staticClass:"components-list"},[(_vm.basicFields.length)?[_c('div',{staticClass:"widget-cate"},[_vm._v("\n                        "+_vm._s(_vm.$t('fm.components.basic.title'))+"\n                     ")]),_c('draggable',_vm._b({attrs:{"tag":"ul","list":_vm.basicComponents,"move":_vm.handleMove},on:{"end":_vm.handleMoveEnd,"start":_vm.handleMoveStart}},'draggable',{
                           group: { name: 'people', pull: 'clone', put: false },
                           sort: false,
                           ghostClass: 'ghost',
                        },false),_vm._l((_vm.basicComponents),function(item,index){return (_vm.basicFields.indexOf(item.type) >= 0)?_c('li',{key:index,staticClass:"form-edit-widget-label",class:{ 'no-put': item.type == 'divider' }},[_c('a',[_c('i',{staticClass:"icon iconfont",class:item.icon}),_c('span',[_vm._v(_vm._s(item.name))])])]):_vm._e()}),0)]:_vm._e(),(_vm.advanceFields.length)?[_c('div',{staticClass:"widget-cate"},[_vm._v("\n                        "+_vm._s(_vm.$t('fm.components.advance.title'))+"\n                     ")]),_c('draggable',_vm._b({attrs:{"tag":"ul","list":_vm.advanceComponents,"move":_vm.handleMove},on:{"end":_vm.handleMoveEnd,"start":_vm.handleMoveStart}},'draggable',{
                           group: { name: 'people', pull: 'clone', put: false },
                           sort: false,
                           ghostClass: 'ghost',
                        },false),_vm._l((_vm.advanceComponents),function(item,index){return (_vm.advanceFields.indexOf(item.type) >= 0)?_c('li',{key:index,staticClass:"form-edit-widget-label",class:{ 'no-put': item.type == 'table' }},[_c('a',[_c('i',{staticClass:"icon iconfont",class:item.icon}),_c('span',[_vm._v(_vm._s(item.name))])])]):_vm._e()}),0)]:_vm._e(),(_vm.layoutFields.length)?[_c('div',{staticClass:"widget-cate"},[_vm._v("\n                        "+_vm._s(_vm.$t('fm.components.layout.title'))+"\n                     ")]),_c('draggable',_vm._b({attrs:{"tag":"ul","list":_vm.layoutComponents,"move":_vm.handleMove},on:{"end":_vm.handleMoveEnd,"start":_vm.handleMoveStart}},'draggable',{
                           group: { name: 'people', pull: 'clone', put: false },
                           sort: false,
                           ghostClass: 'ghost',
                        },false),_vm._l((_vm.layoutComponents),function(item,index){return (_vm.layoutFields.indexOf(item.type) >= 0)?_c('li',{key:index,staticClass:"form-edit-widget-label no-put"},[_c('a',[_c('i',{staticClass:"icon iconfont",class:item.icon}),_c('span',[_vm._v(_vm._s(item.name))])])]):_vm._e()}),0)]:_vm._e()],2)]),_c('el-container',{staticClass:"center-container",attrs:{"direction":"vertical"}},[_c('el-main',{class:{ 'widget-empty': _vm.widgetForm.list.length == 0 }},[(!_vm.resetJson)?_c('widget-form',{ref:"widgetForm",attrs:{"data":_vm.widgetForm,"select":_vm.widgetFormSelect},on:{"update:select":function($event){_vm.widgetFormSelect=$event}}}):_vm._e()],1)],1),_c('el-aside',{staticClass:"widget-config-container"},[_c('el-container',[_c('el-header',{attrs:{"height":"45px"}},[_c('div',{staticClass:"config-tab",class:{ active: _vm.configTab == 'widget' },on:{"click":function($event){return _vm.handleConfigSelect('widget')}}},[_vm._v("\n                        "+_vm._s(_vm.$t('fm.config.widget.title'))+"\n                     ")]),_c('div',{staticClass:"config-tab",class:{ active: _vm.configTab == 'form' },on:{"click":function($event){return _vm.handleConfigSelect('form')}}},[_vm._v("\n                        "+_vm._s(_vm.$t('fm.config.form.title'))+"\n                     ")])]),_c('el-main',{staticClass:"config-content"},[_c('widget-config',{directives:[{name:"show",rawName:"v-show",value:(_vm.configTab == 'widget'),expression:"configTab == 'widget'"}],attrs:{"data":_vm.widgetFormSelect}}),_c('form-config',{directives:[{name:"show",rawName:"v-show",value:(_vm.configTab == 'form'),expression:"configTab == 'form'"}],attrs:{"data":_vm.widgetForm.config}})],1)],1)],1),_c('cus-dialog',{ref:"widgetPreview",attrs:{"visible":_vm.previewVisible,"width":"1000px","form":""},on:{"on-close":function($event){_vm.previewVisible = false}}},[(_vm.previewVisible)?_c('generate-form',{ref:"generateForm",attrs:{"insite":"true","data":_vm.widgetForm,"value":_vm.widgetModels,"remote":_vm.remoteFuncs},on:{"on-change":_vm.handleDataChange},scopedSlots:_vm._u([{key:"blank",fn:function(scope){return [_vm._v("\n                     Width\n                     "),_c('el-input',{staticStyle:{"width":"100px"},model:{value:(scope.model.blank.width),callback:function ($$v) {_vm.$set(scope.model.blank, "width", $$v)},expression:"scope.model.blank.width"}}),_vm._v("\n                     Height\n                     "),_c('el-input',{staticStyle:{"width":"100px"},model:{value:(scope.model.blank.height),callback:function ($$v) {_vm.$set(scope.model.blank, "height", $$v)},expression:"scope.model.blank.height"}})]}}],null,false,2440911029)}):_vm._e(),_c('template',{slot:"action"},[_c('el-button',{attrs:{"type":"primary"},on:{"click":_vm.handleTest}},[_vm._v(_vm._s(_vm.$t('fm.actions.getData')))]),_c('el-button',{on:{"click":_vm.handleReset}},[_vm._v(_vm._s(_vm.$t('fm.actions.reset')))])],1)],2),_c('cus-dialog',{ref:"uploadJson",attrs:{"visible":_vm.uploadVisible,"width":"800px","form":""},on:{"on-close":function($event){_vm.uploadVisible = false},"on-submit":_vm.handleUploadJson}},[_c('el-alert',{attrs:{"type":"info","title":_vm.$t('fm.description.uploadJsonInfo')}}),_c('div',{staticStyle:{"height":"400px","width":"100%"},attrs:{"id":"uploadeditor"}},[_vm._v("\n                  "+_vm._s(_vm.jsonEg)+"\n               ")])],1),_c('cus-dialog',{ref:"jsonPreview",attrs:{"visible":_vm.jsonVisible,"width":"800px","form":""},on:{"on-close":function($event){_vm.jsonVisible = false}}},[_c('div',{staticStyle:{"height":"400px","width":"100%"},attrs:{"id":"jsoneditor"}},[_vm._v("\n                  "+_vm._s(_vm.jsonTemplate)+"\n               ")]),_c('template',{slot:"action"},[_c('el-button',{staticClass:"json-btn",attrs:{"type":"primary","data-clipboard-text":_vm.jsonCopyValue}},[_vm._v(_vm._s(_vm.$t('fm.actions.copyData')))])],1)],2),_c('cus-dialog',{ref:"codePreview",attrs:{"visible":_vm.codeVisible,"width":"800px","form":"","action":false},on:{"on-close":function($event){_vm.codeVisible = false}}},[_c('el-tabs',{staticStyle:{"box-shadow":"none"},attrs:{"type":"border-card"},model:{value:(_vm.codeActiveName),callback:function ($$v) {_vm.codeActiveName=$$v},expression:"codeActiveName"}},[_c('el-tab-pane',{attrs:{"label":"Vue Component","name":"vue"}},[_c('div',{staticStyle:{"height":"500px","width":"100%"},attrs:{"id":"vuecodeeditor"}},[_vm._v("\n                        "+_vm._s(_vm.vueTemplate)+"\n                     ")])]),_c('el-tab-pane',{attrs:{"label":"HTML","name":"html"}},[_c('div',{staticStyle:{"height":"500px","width":"100%"},attrs:{"id":"codeeditor"}},[_vm._v("\n                        "+_vm._s(_vm.htmlTemplate)+"\n                     ")])])],1)],1)],1)],1),_c('el-footer',{staticStyle:{"font-weight":"600"},attrs:{"height":"30px"}},[_vm._v("Powered by "),_c('a',{attrs:{"target":"_blank","href":"https://github.com/GavinZhuLei/vue-form-making"}},[_vm._v("vue-form-making")])])],1)],1)}
var Containervue_type_template_id_1c667be1_staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/Container.vue?vue&type=template&id=1c667be1&

// EXTERNAL MODULE: ./node_modules/_vuedraggable@2.24.3@vuedraggable/dist/vuedraggable.umd.js
var vuedraggable_umd = __webpack_require__("3335");
var vuedraggable_umd_default = /*#__PURE__*/__webpack_require__.n(vuedraggable_umd);

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/WidgetConfig.vue?vue&type=template&id=5db93db4&
var WidgetConfigvue_type_template_id_5db93db4_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.show)?_c('div',[_c('el-form',{attrs:{"label-position":"top"}},[(_vm.data.type != 'grid')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.model')}},[_c('el-input',{model:{value:(_vm.data.model),callback:function ($$v) {_vm.$set(_vm.data, "model", $$v)},expression:"data.model"}})],1):_vm._e(),(_vm.data.type != 'grid')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.name')}},[_c('el-input',{model:{value:(_vm.data.name),callback:function ($$v) {_vm.$set(_vm.data, "name", $$v)},expression:"data.name"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('width') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.width')}},[_c('el-input',{model:{value:(_vm.data.options.width),callback:function ($$v) {_vm.$set(_vm.data.options, "width", $$v)},expression:"data.options.width"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('height') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.height')}},[_c('el-input',{model:{value:(_vm.data.options.height),callback:function ($$v) {_vm.$set(_vm.data.options, "height", $$v)},expression:"data.options.height"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('size') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.size')}},[_vm._v("\n         "+_vm._s(_vm.$t('fm.config.widget.width'))+" "),_c('el-input',{staticStyle:{"width":"90px"},attrs:{"type":"number"},model:{value:(_vm.data.options.size.width),callback:function ($$v) {_vm.$set(_vm.data.options.size, "width", _vm._n($$v))},expression:"data.options.size.width"}}),_vm._v("\n         "+_vm._s(_vm.$t('fm.config.widget.height'))+" "),_c('el-input',{staticStyle:{"width":"90px"},attrs:{"type":"number"},model:{value:(_vm.data.options.size.height),callback:function ($$v) {_vm.$set(_vm.data.options.size, "height", _vm._n($$v))},expression:"data.options.size.height"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('placeholder') >= 0 && (_vm.data.type != 'time' || _vm.data.type != 'date'))?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.placeholder')}},[_c('el-input',{model:{value:(_vm.data.options.placeholder),callback:function ($$v) {_vm.$set(_vm.data.options, "placeholder", $$v)},expression:"data.options.placeholder"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('inline') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.layout')}},[_c('el-radio-group',{model:{value:(_vm.data.options.inline),callback:function ($$v) {_vm.$set(_vm.data.options, "inline", $$v)},expression:"data.options.inline"}},[_c('el-radio-button',{attrs:{"label":false}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.block')))]),_c('el-radio-button',{attrs:{"label":true}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.inline')))])],1)],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('showInput') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.showInput')}},[_c('el-switch',{model:{value:(_vm.data.options.showInput),callback:function ($$v) {_vm.$set(_vm.data.options, "showInput", $$v)},expression:"data.options.showInput"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('min') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.min')}},[_c('el-input-number',{attrs:{"min":0,"max":100,"step":1},model:{value:(_vm.data.options.min),callback:function ($$v) {_vm.$set(_vm.data.options, "min", $$v)},expression:"data.options.min"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('max') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.max')}},[_c('el-input-number',{attrs:{"min":0,"max":100,"step":1},model:{value:(_vm.data.options.max),callback:function ($$v) {_vm.$set(_vm.data.options, "max", $$v)},expression:"data.options.max"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('step') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.step')}},[_c('el-input-number',{attrs:{"min":0,"max":100,"step":1},model:{value:(_vm.data.options.step),callback:function ($$v) {_vm.$set(_vm.data.options, "step", $$v)},expression:"data.options.step"}})],1):_vm._e(),(_vm.data.type == 'select' || _vm.data.type == 'imgupload')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.multiple')}},[_c('el-switch',{on:{"change":_vm.handleSelectMuliple},model:{value:(_vm.data.options.multiple),callback:function ($$v) {_vm.$set(_vm.data.options, "multiple", $$v)},expression:"data.options.multiple"}})],1):_vm._e(),(_vm.data.type == 'select')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.filterable')}},[_c('el-switch',{model:{value:(_vm.data.options.filterable),callback:function ($$v) {_vm.$set(_vm.data.options, "filterable", $$v)},expression:"data.options.filterable"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('allowHalf') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.allowHalf')}},[_c('el-switch',{model:{value:(_vm.data.options.allowHalf),callback:function ($$v) {_vm.$set(_vm.data.options, "allowHalf", $$v)},expression:"data.options.allowHalf"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('showAlpha') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.showAlpha')}},[_c('el-switch',{model:{value:(_vm.data.options.showAlpha),callback:function ($$v) {_vm.$set(_vm.data.options, "showAlpha", $$v)},expression:"data.options.showAlpha"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('showLabel') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.showLabel')}},[_c('el-switch',{model:{value:(_vm.data.options.showLabel),callback:function ($$v) {_vm.$set(_vm.data.options, "showLabel", $$v)},expression:"data.options.showLabel"}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('options') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.option')}},[_c('el-radio-group',{staticStyle:{"margin-bottom":"10px"},attrs:{"size":"mini"},model:{value:(_vm.data.options.remote),callback:function ($$v) {_vm.$set(_vm.data.options, "remote", $$v)},expression:"data.options.remote"}},[_c('el-radio-button',{attrs:{"label":false}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.staticData')))]),_c('el-radio-button',{attrs:{"label":true}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.remoteData')))])],1),(_vm.data.options.remote)?[_c('div',[_c('el-input',{attrs:{"size":"mini"},model:{value:(_vm.data.options.remoteFunc),callback:function ($$v) {_vm.$set(_vm.data.options, "remoteFunc", $$v)},expression:"data.options.remoteFunc"}},[_c('template',{slot:"prepend"},[_vm._v(_vm._s(_vm.$t('fm.config.widget.remoteFunc')))])],2),_c('el-input',{attrs:{"size":"mini"},model:{value:(_vm.data.options.props.value),callback:function ($$v) {_vm.$set(_vm.data.options.props, "value", $$v)},expression:"data.options.props.value"}},[_c('template',{slot:"prepend"},[_vm._v(_vm._s(_vm.$t('fm.config.widget.value')))])],2),_c('el-input',{attrs:{"size":"mini"},model:{value:(_vm.data.options.props.label),callback:function ($$v) {_vm.$set(_vm.data.options.props, "label", $$v)},expression:"data.options.props.label"}},[_c('template',{slot:"prepend"},[_vm._v(_vm._s(_vm.$t('fm.config.widget.label')))])],2)],1)]:[(_vm.data.type == 'radio' || (_vm.data.type == 'select' && !_vm.data.options.multiple))?[_c('el-radio-group',{model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}},[_c('draggable',_vm._b({attrs:{"tag":"ul","list":_vm.data.options.options,"handle":".drag-item"}},'draggable',{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' },false),_vm._l((_vm.data.options.options),function(item,index){return _c('li',{key:index},[_c('el-radio',{staticStyle:{"margin-right":"5px"},attrs:{"label":item.value}},[_c('el-input',{style:({ width: _vm.data.options.showLabel ? '90px' : '180px' }),attrs:{"size":"mini"},model:{value:(item.value),callback:function ($$v) {_vm.$set(item, "value", $$v)},expression:"item.value"}}),(_vm.data.options.showLabel)?_c('el-input',{staticStyle:{"width":"90px"},attrs:{"size":"mini"},model:{value:(item.label),callback:function ($$v) {_vm.$set(item, "label", $$v)},expression:"item.label"}}):_vm._e()],1),_c('i',{staticClass:"drag-item",staticStyle:{"font-size":"16px","margin":"0 5px","cursor":"move"}},[_c('i',{staticClass:"iconfont icon-icon_bars"})]),_c('el-button',{staticStyle:{"padding":"4px","margin-left":"5px"},attrs:{"circle":"","plain":"","type":"danger","size":"mini","icon":"el-icon-minus"},on:{"click":function($event){return _vm.handleOptionsRemove(index)}}})],1)}),0)],1)]:_vm._e(),(_vm.data.type == 'checkbox' || (_vm.data.type == 'select' && _vm.data.options.multiple))?[_c('el-checkbox-group',{model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}},[_c('draggable',_vm._b({attrs:{"tag":"ul","list":_vm.data.options.options,"handle":".drag-item"}},'draggable',{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' },false),_vm._l((_vm.data.options.options),function(item,index){return _c('li',{key:index},[_c('el-checkbox',{staticStyle:{"margin-right":"5px"},attrs:{"label":item.value}},[_c('el-input',{style:({ width: _vm.data.options.showLabel ? '90px' : '180px' }),attrs:{"size":"mini"},model:{value:(item.value),callback:function ($$v) {_vm.$set(item, "value", $$v)},expression:"item.value"}}),(_vm.data.options.showLabel)?_c('el-input',{staticStyle:{"width":"90px"},attrs:{"size":"mini"},model:{value:(item.label),callback:function ($$v) {_vm.$set(item, "label", $$v)},expression:"item.label"}}):_vm._e()],1),_c('i',{staticClass:"drag-item",staticStyle:{"font-size":"16px","margin":"0 5px","cursor":"move"}},[_c('i',{staticClass:"iconfont icon-icon_bars"})]),_c('el-button',{staticStyle:{"padding":"4px","margin-left":"5px"},attrs:{"circle":"","plain":"","type":"danger","size":"mini","icon":"el-icon-minus"},on:{"click":function($event){return _vm.handleOptionsRemove(index)}}})],1)}),0)],1)]:_vm._e(),_c('div',{staticStyle:{"margin-left":"22px"}},[_c('el-button',{attrs:{"type":"text"},on:{"click":_vm.handleAddOption}},[_vm._v(_vm._s(_vm.$t('fm.actions.addOption')))])],1)]],2):_vm._e(),(_vm.data.type == 'cascader')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.remoteData')}},[_c('div',[_c('el-input',{attrs:{"size":"mini"},model:{value:(_vm.data.options.remoteFunc),callback:function ($$v) {_vm.$set(_vm.data.options, "remoteFunc", $$v)},expression:"data.options.remoteFunc"}},[_c('template',{slot:"prepend"},[_vm._v(_vm._s(_vm.$t('fm.config.widget.remoteFunc')))])],2),_c('el-input',{attrs:{"size":"mini"},model:{value:(_vm.data.options.props.value),callback:function ($$v) {_vm.$set(_vm.data.options.props, "value", $$v)},expression:"data.options.props.value"}},[_c('template',{slot:"prepend"},[_vm._v(_vm._s(_vm.$t('fm.config.widget.value')))])],2),_c('el-input',{attrs:{"size":"mini"},model:{value:(_vm.data.options.props.label),callback:function ($$v) {_vm.$set(_vm.data.options.props, "label", $$v)},expression:"data.options.props.label"}},[_c('template',{slot:"prepend"},[_vm._v(_vm._s(_vm.$t('fm.config.widget.label')))])],2),_c('el-input',{attrs:{"size":"mini"},model:{value:(_vm.data.options.props.children),callback:function ($$v) {_vm.$set(_vm.data.options.props, "children", $$v)},expression:"data.options.props.children"}},[_c('template',{slot:"prepend"},[_vm._v(_vm._s(_vm.$t('fm.config.widget.childrenOption')))])],2)],1)]):_vm._e(),(
            Object.keys(_vm.data.options).indexOf('defaultValue') >= 0 &&
               (_vm.data.type == 'textarea' || _vm.data.type == 'input' || _vm.data.type == 'rate' || _vm.data.type == 'color' || _vm.data.type == 'switch')
         )?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.defaultValue')}},[(_vm.data.type == 'textarea')?_c('el-input',{attrs:{"type":"textarea","rows":5},model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}}):_vm._e(),(_vm.data.type == 'input')?_c('el-input',{model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}}):_vm._e(),(_vm.data.type == 'rate')?_c('el-rate',{staticStyle:{"display":"inline-block","vertical-align":"middle"},attrs:{"max":_vm.data.options.max,"allow-half":_vm.data.options.allowHalf},model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}}):_vm._e(),(_vm.data.type == 'rate')?_c('el-button',{staticStyle:{"display":"inline-block","vertical-align":"middle","margin-left":"10px"},attrs:{"type":"text"},on:{"click":function($event){_vm.data.options.defaultValue = 0}}},[_vm._v(_vm._s(_vm.$t('fm.actions.clear')))]):_vm._e(),(_vm.data.type == 'color')?_c('el-color-picker',{attrs:{"show-alpha":_vm.data.options.showAlpha},model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}}):_vm._e(),(_vm.data.type == 'switch')?_c('el-switch',{model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}}):_vm._e()],1):_vm._e(),(_vm.data.type == 'time' || _vm.data.type == 'date')?[(_vm.data.type == 'date')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.showType')}},[_c('el-select',{model:{value:(_vm.data.options.type),callback:function ($$v) {_vm.$set(_vm.data.options, "type", $$v)},expression:"data.options.type"}},[_c('el-option',{attrs:{"value":"year"}}),_c('el-option',{attrs:{"value":"month"}}),_c('el-option',{attrs:{"value":"date"}}),_c('el-option',{attrs:{"value":"dates"}}),_c('el-option',{attrs:{"value":"datetime"}}),_c('el-option',{attrs:{"value":"datetimerange"}}),_c('el-option',{attrs:{"value":"daterange"}})],1)],1):_vm._e(),(_vm.data.type == 'time')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.isRange')}},[_c('el-switch',{model:{value:(_vm.data.options.isRange),callback:function ($$v) {_vm.$set(_vm.data.options, "isRange", $$v)},expression:"data.options.isRange"}})],1):_vm._e(),(_vm.data.type == 'date')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.isTimestamp')}},[_c('el-switch',{model:{value:(_vm.data.options.timestamp),callback:function ($$v) {_vm.$set(_vm.data.options, "timestamp", $$v)},expression:"data.options.timestamp"}})],1):_vm._e(),(
               (!_vm.data.options.isRange && _vm.data.type == 'time') ||
                  (_vm.data.type != 'time' && _vm.data.options.type != 'datetimerange' && _vm.data.options.type != 'daterange')
            )?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.placeholder')}},[_c('el-input',{model:{value:(_vm.data.options.placeholder),callback:function ($$v) {_vm.$set(_vm.data.options, "placeholder", $$v)},expression:"data.options.placeholder"}})],1):_vm._e(),(_vm.data.options.isRange || _vm.data.options.type == 'datetimerange' || _vm.data.options.type == 'daterange')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.startPlaceholder')}},[_c('el-input',{model:{value:(_vm.data.options.startPlaceholder),callback:function ($$v) {_vm.$set(_vm.data.options, "startPlaceholder", $$v)},expression:"data.options.startPlaceholder"}})],1):_vm._e(),(_vm.data.options.isRange || _vm.data.options.type == 'datetimerange' || _vm.data.options.type == 'daterange')?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.endPlaceholder')}},[_c('el-input',{model:{value:(_vm.data.options.endPlaceholder),callback:function ($$v) {_vm.$set(_vm.data.options, "endPlaceholder", $$v)},expression:"data.options.endPlaceholder"}})],1):_vm._e(),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.format')}},[_c('el-input',{model:{value:(_vm.data.options.format),callback:function ($$v) {_vm.$set(_vm.data.options, "format", $$v)},expression:"data.options.format"}})],1),(_vm.data.type == 'time' && Object.keys(_vm.data.options).indexOf('isRange') >= 0)?_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.defaultValue')}},[(!_vm.data.options.isRange)?_c('el-time-picker',{key:"1",staticStyle:{"width":"100%"},attrs:{"arrowControl":_vm.data.options.arrowControl,"value-format":_vm.data.options.format},model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}}):_vm._e(),(_vm.data.options.isRange)?_c('el-time-picker',{key:"2",staticStyle:{"width":"100%"},attrs:{"is-range":"","arrowControl":_vm.data.options.arrowControl,"value-format":_vm.data.options.format},model:{value:(_vm.data.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultValue", $$v)},expression:"data.options.defaultValue"}}):_vm._e()],1):_vm._e()]:_vm._e(),(_vm.data.type == 'imgupload')?[_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.limit')}},[_c('el-input',{attrs:{"type":"number"},model:{value:(_vm.data.options.length),callback:function ($$v) {_vm.$set(_vm.data.options, "length", _vm._n($$v))},expression:"data.options.length"}})],1),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.isQiniu')}},[_c('el-switch',{model:{value:(_vm.data.options.isQiniu),callback:function ($$v) {_vm.$set(_vm.data.options, "isQiniu", $$v)},expression:"data.options.isQiniu"}})],1),(_vm.data.options.isQiniu)?[_c('el-form-item',{attrs:{"label":"Domain","required":true}},[_c('el-input',{model:{value:(_vm.data.options.domain),callback:function ($$v) {_vm.$set(_vm.data.options, "domain", $$v)},expression:"data.options.domain"}})],1),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.tokenFunc'),"required":true}},[_c('el-input',{model:{value:(_vm.data.options.tokenFunc),callback:function ($$v) {_vm.$set(_vm.data.options, "tokenFunc", $$v)},expression:"data.options.tokenFunc"}})],1)]:[_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.imageAction'),"required":true}},[_c('el-input',{model:{value:(_vm.data.options.action),callback:function ($$v) {_vm.$set(_vm.data.options, "action", $$v)},expression:"data.options.action"}})],1)]]:_vm._e(),(_vm.data.type == 'blank')?[_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.defaultType')}},[_c('el-select',{model:{value:(_vm.data.options.defaultType),callback:function ($$v) {_vm.$set(_vm.data.options, "defaultType", $$v)},expression:"data.options.defaultType"}},[_c('el-option',{attrs:{"value":"String","label":_vm.$t('fm.config.widget.string')}}),_c('el-option',{attrs:{"value":"Object","label":_vm.$t('fm.config.widget.object')}}),_c('el-option',{attrs:{"value":"Array","label":_vm.$t('fm.config.widget.array')}})],1)],1)]:_vm._e(),(_vm.data.type == 'grid')?[_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.gutter')}},[_c('el-input',{attrs:{"type":"number"},model:{value:(_vm.data.options.gutter),callback:function ($$v) {_vm.$set(_vm.data.options, "gutter", _vm._n($$v))},expression:"data.options.gutter"}})],1),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.columnOption')}},[_c('draggable',_vm._b({attrs:{"tag":"ul","list":_vm.data.columns,"handle":".drag-item"}},'draggable',{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' },false),_vm._l((_vm.data.columns),function(item,index){return _c('li',{key:index},[_c('i',{staticClass:"drag-item",staticStyle:{"font-size":"16px","margin":"0 5px","cursor":"move"}},[_c('i',{staticClass:"iconfont icon-icon_bars"})]),_c('el-input',{staticStyle:{"width":"100px"},attrs:{"placeholder":_vm.$t('fm.config.widget.span'),"size":"mini","type":"number"},model:{value:(item.span),callback:function ($$v) {_vm.$set(item, "span", _vm._n($$v))},expression:"item.span"}}),_c('el-button',{staticStyle:{"padding":"4px","margin-left":"5px"},attrs:{"circle":"","plain":"","type":"danger","size":"mini","icon":"el-icon-minus"},on:{"click":function($event){return _vm.handleOptionsRemove(index)}}})],1)}),0),_c('div',{staticStyle:{"margin-left":"22px"}},[_c('el-button',{attrs:{"type":"text"},on:{"click":_vm.handleAddColumn}},[_vm._v(_vm._s(_vm.$t('fm.actions.addColumn')))])],1)],1),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.justify')}},[_c('el-select',{model:{value:(_vm.data.options.justify),callback:function ($$v) {_vm.$set(_vm.data.options, "justify", $$v)},expression:"data.options.justify"}},[_c('el-option',{attrs:{"value":"start","label":_vm.$t('fm.config.widget.justifyStart')}}),_c('el-option',{attrs:{"value":"end","label":_vm.$t('fm.config.widget.justifyEnd')}}),_c('el-option',{attrs:{"value":"center","label":_vm.$t('fm.config.widget.justifyCenter')}}),_c('el-option',{attrs:{"value":"space-around","label":_vm.$t('fm.config.widget.justifySpaceAround')}}),_c('el-option',{attrs:{"value":"space-between","label":_vm.$t('fm.config.widget.justifySpaceBetween')}})],1)],1),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.align')}},[_c('el-select',{model:{value:(_vm.data.options.align),callback:function ($$v) {_vm.$set(_vm.data.options, "align", $$v)},expression:"data.options.align"}},[_c('el-option',{attrs:{"value":"top","label":_vm.$t('fm.config.widget.alignTop')}}),_c('el-option',{attrs:{"value":"middle","label":_vm.$t('fm.config.widget.alignMiddle')}}),_c('el-option',{attrs:{"value":"bottom","label":_vm.$t('fm.config.widget.alignBottom')}})],1)],1)]:_vm._e(),(_vm.data.type != 'grid')?[_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.attribute')}},[(Object.keys(_vm.data.options).indexOf('readonly') >= 0)?_c('el-checkbox',{model:{value:(_vm.data.options.readonly),callback:function ($$v) {_vm.$set(_vm.data.options, "readonly", $$v)},expression:"data.options.readonly"}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.readonly')))]):_vm._e(),(Object.keys(_vm.data.options).indexOf('disabled') >= 0)?_c('el-checkbox',{model:{value:(_vm.data.options.disabled),callback:function ($$v) {_vm.$set(_vm.data.options, "disabled", $$v)},expression:"data.options.disabled"}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.disabled'))+"\n            ")]):_vm._e(),(Object.keys(_vm.data.options).indexOf('editable') >= 0)?_c('el-checkbox',{model:{value:(_vm.data.options.editable),callback:function ($$v) {_vm.$set(_vm.data.options, "editable", $$v)},expression:"data.options.editable"}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.editable')))]):_vm._e(),(Object.keys(_vm.data.options).indexOf('clearable') >= 0)?_c('el-checkbox',{model:{value:(_vm.data.options.clearable),callback:function ($$v) {_vm.$set(_vm.data.options, "clearable", $$v)},expression:"data.options.clearable"}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.clearable'))+"\n            ")]):_vm._e(),(Object.keys(_vm.data.options).indexOf('arrowControl') >= 0)?_c('el-checkbox',{model:{value:(_vm.data.options.arrowControl),callback:function ($$v) {_vm.$set(_vm.data.options, "arrowControl", $$v)},expression:"data.options.arrowControl"}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.arrowControl')))]):_vm._e(),(Object.keys(_vm.data.options).indexOf('isDelete') >= 0)?_c('el-checkbox',{model:{value:(_vm.data.options.isDelete),callback:function ($$v) {_vm.$set(_vm.data.options, "isDelete", $$v)},expression:"data.options.isDelete"}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.isDelete')))]):_vm._e(),(Object.keys(_vm.data.options).indexOf('isEdit') >= 0)?_c('el-checkbox',{model:{value:(_vm.data.options.isEdit),callback:function ($$v) {_vm.$set(_vm.data.options, "isEdit", $$v)},expression:"data.options.isEdit"}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.isEdit')))]):_vm._e()],1),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.widget.validate')}},[(Object.keys(_vm.data.options).indexOf('required') >= 0)?_c('div',[_c('el-checkbox',{model:{value:(_vm.data.options.required),callback:function ($$v) {_vm.$set(_vm.data.options, "required", $$v)},expression:"data.options.required"}},[_vm._v(_vm._s(_vm.$t('fm.config.widget.required')))])],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('dataType') >= 0)?_c('el-select',{attrs:{"size":"mini"},model:{value:(_vm.data.options.dataType),callback:function ($$v) {_vm.$set(_vm.data.options, "dataType", $$v)},expression:"data.options.dataType"}},[_c('el-option',{attrs:{"value":"string","label":_vm.$t('fm.config.widget.string')}}),_c('el-option',{attrs:{"value":"number","label":_vm.$t('fm.config.widget.number')}}),_c('el-option',{attrs:{"value":"boolean","label":_vm.$t('fm.config.widget.boolean')}}),_c('el-option',{attrs:{"value":"integer","label":_vm.$t('fm.config.widget.integer')}}),_c('el-option',{attrs:{"value":"float","label":_vm.$t('fm.config.widget.float')}}),_c('el-option',{attrs:{"value":"url","label":_vm.$t('fm.config.widget.url')}}),_c('el-option',{attrs:{"value":"email","label":_vm.$t('fm.config.widget.email')}}),_c('el-option',{attrs:{"value":"hex","label":_vm.$t('fm.config.widget.hex')}})],1):_vm._e(),(Object.keys(_vm.data.options).indexOf('pattern') >= 0)?_c('div',[_c('el-input',{staticStyle:{"width":"240px"},attrs:{"size":"mini","placeholder":_vm.$t('fm.config.widget.patternPlaceholder')},model:{value:(_vm.data.options.pattern),callback:function ($$v) {_vm.$set(_vm.data.options, "pattern", $$v)},expression:"data.options.pattern"}})],1):_vm._e()],1)]:_vm._e()],2)],1):_vm._e()}
var WidgetConfigvue_type_template_id_5db93db4_staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetConfig.vue?vue&type=template&id=5db93db4&

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/WidgetConfig.vue?vue&type=script&lang=js&




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var WidgetConfigvue_type_script_lang_js_ = ({
  components: {
    Draggable: vuedraggable_umd_default.a
  },
  props: ['data'],
  data: function data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    };
  },
  computed: {
    show: function show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true;
      }

      return false;
    }
  },
  methods: {
    handleOptionsRemove: function handleOptionsRemove(index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1);
      } else {
        this.data.options.options.splice(index, 1);
      }
    },
    handleAddOption: function handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: this.$t('fm.config.widget.newOption'),
          label: this.$t('fm.config.widget.newOption')
        });
      } else {
        this.data.options.options.push({
          value: this.$t('fm.config.widget.newOption')
        });
      }
    },
    handleAddColumn: function handleAddColumn() {
      this.data.columns.push({
        span: '',
        list: []
      });
    },
    generateRule: function generateRule() {
      var _this = this;

      this.data.rules = [];
      Object.keys(this.validator).forEach(function (key) {
        if (_this.validator[key]) {
          _this.data.rules.push(_this.validator[key]);
        }
      });
    },
    handleSelectMuliple: function handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue];
        } else {
          this.data.options.defaultValue = [];
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = this.data.options.defaultValue[0];
        } else {
          this.data.options.defaultValue = '';
        }
      }
    },
    validateRequired: function validateRequired(val) {
      var _this2 = this;

      if (val) {
        this.validator.required = {
          required: true,
          message: "".concat(this.data.name).concat(this.$t('fm.config.widget.validatorRequired'))
        };
      } else {
        this.validator.required = null;
      }

      this.$nextTick(function () {
        _this2.generateRule();
      });
    },
    validateDataType: function validateDataType(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.type = {
          type: val,
          message: this.data.name + this.$t('fm.config.widget.validatorType')
        };
      } else {
        this.validator.type = null;
      }

      this.generateRule();
    },
    valiatePattern: function valiatePattern(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.pattern = {
          pattern: val,
          message: this.data.name + this.$t('fm.config.widget.validatorPattern')
        };
      } else {
        this.validator.pattern = null;
      }

      this.generateRule();
    }
  },
  watch: {
    'data.options.isRange': function dataOptionsIsRange(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null;
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue') >= 0) this.data.options.defaultValue = '';
        }
      }
    },
    'data.options.required': function dataOptionsRequired(val) {
      this.validateRequired(val);
    },
    'data.options.dataType': function dataOptionsDataType(val) {
      this.validateDataType(val);
    },
    'data.options.pattern': function dataOptionsPattern(val) {
      this.valiatePattern(val);
    },
    'data.name': function dataName() {
      if (this.data.options) {
        this.validateRequired(this.data.options.required);
        this.validateDataType(this.data.options.dataType);
        this.valiatePattern(this.data.options.pattern);
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetConfig.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_WidgetConfigvue_type_script_lang_js_ = (WidgetConfigvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetConfig.vue





/* normalize component */

var WidgetConfig_component = Object(componentNormalizer["a" /* default */])(
  components_WidgetConfigvue_type_script_lang_js_,
  WidgetConfigvue_type_template_id_5db93db4_render,
  WidgetConfigvue_type_template_id_5db93db4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var WidgetConfig = (WidgetConfig_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/FormConfig.vue?vue&type=template&id=25bf9976&
var FormConfigvue_type_template_id_25bf9976_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"form-config-container"},[_c('el-form',{attrs:{"label-position":"top"}},[_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.form.labelPosition.title')}},[_c('el-radio-group',{model:{value:(_vm.data.labelPosition),callback:function ($$v) {_vm.$set(_vm.data, "labelPosition", $$v)},expression:"data.labelPosition"}},[_c('el-radio-button',{attrs:{"label":"left"}},[_vm._v(_vm._s(_vm.$t('fm.config.form.labelPosition.left')))]),_c('el-radio-button',{attrs:{"label":"right"}},[_vm._v(_vm._s(_vm.$t('fm.config.form.labelPosition.right')))]),_c('el-radio-button',{attrs:{"label":"top"}},[_vm._v(_vm._s(_vm.$t('fm.config.form.labelPosition.top')))])],1)],1),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.form.labelWidth')}},[_c('el-input-number',{attrs:{"min":0,"max":200,"step":10},model:{value:(_vm.data.labelWidth),callback:function ($$v) {_vm.$set(_vm.data, "labelWidth", $$v)},expression:"data.labelWidth"}})],1),_c('el-form-item',{attrs:{"label":_vm.$t('fm.config.form.size')}},[_c('el-radio-group',{model:{value:(_vm.data.size),callback:function ($$v) {_vm.$set(_vm.data, "size", $$v)},expression:"data.size"}},[_c('el-radio-button',{attrs:{"label":"medium"}},[_vm._v("medium")]),_c('el-radio-button',{attrs:{"label":"small"}},[_vm._v("small")]),_c('el-radio-button',{attrs:{"label":"mini"}},[_vm._v("mini")])],1)],1)],1)],1)}
var FormConfigvue_type_template_id_25bf9976_staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/FormConfig.vue?vue&type=template&id=25bf9976&

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/FormConfig.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var FormConfigvue_type_script_lang_js_ = ({
  props: ['data']
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/FormConfig.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FormConfigvue_type_script_lang_js_ = (FormConfigvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/FormConfig.vue





/* normalize component */

var FormConfig_component = Object(componentNormalizer["a" /* default */])(
  components_FormConfigvue_type_script_lang_js_,
  FormConfigvue_type_template_id_25bf9976_render,
  FormConfigvue_type_template_id_25bf9976_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var FormConfig = (FormConfig_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/WidgetForm.vue?vue&type=template&id=7e852fae&
var WidgetFormvue_type_template_id_7e852fae_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"widget-form-container"},[(_vm.data.list.length == 0)?_c('div',{staticClass:"form-empty"},[_vm._v(_vm._s(_vm.$t('fm.description.containerEmpty')))]):_vm._e(),_c('el-form',{attrs:{"size":_vm.data.config.size,"label-suffix":":","label-position":_vm.data.config.labelPosition,"label-width":_vm.data.config.labelWidth + 'px'}},[_c('draggable',_vm._b({on:{"end":_vm.handleMoveEnd,"add":_vm.handleWidgetAdd},model:{value:(_vm.data.list),callback:function ($$v) {_vm.$set(_vm.data, "list", $$v)},expression:"data.list"}},'draggable',{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'},false),[_c('transition-group',{staticClass:"widget-form-list",attrs:{"name":"fade","tag":"div"}},[_vm._l((_vm.data.list),function(element,index){return [(element.type == 'grid')?[(element && element.key)?_c('el-row',{key:element.key,staticClass:"widget-col widget-view",class:{active: _vm.selectWidget.key == element.key},attrs:{"type":"flex","gutter":element.options.gutter ? element.options.gutter : 0,"justify":element.options.justify,"align":element.options.align},nativeOn:{"click":function($event){return _vm.handleSelectWidget(index)}}},[_vm._l((element.columns),function(col,colIndex){return _c('el-col',{key:colIndex,attrs:{"span":col.span ? col.span : 0}},[_c('draggable',_vm._b({attrs:{"no-transition-on-drag":true},on:{"end":_vm.handleMoveEnd,"add":function($event){return _vm.handleWidgetColAdd($event, element, colIndex)}},model:{value:(col.list),callback:function ($$v) {_vm.$set(col, "list", $$v)},expression:"col.list"}},'draggable',{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'},false),[_c('transition-group',{staticClass:"widget-col-list",attrs:{"name":"fade","tag":"div"}},_vm._l((col.list),function(el,i){return (el.key)?_c('widget-form-item',{key:el.key,attrs:{"element":el,"select":_vm.selectWidget,"index":i,"data":col},on:{"update:select":function($event){_vm.selectWidget=$event}}}):_vm._e()}),1)],1)],1)}),(_vm.selectWidget.key == element.key)?_c('div',{staticClass:"widget-view-action widget-col-action"},[_c('i',{staticClass:"iconfont icon-trash",on:{"click":function($event){$event.stopPropagation();return _vm.handleWidgetDelete(index)}}})]):_vm._e(),(_vm.selectWidget.key == element.key)?_c('div',{staticClass:"widget-view-drag widget-col-drag"},[_c('i',{staticClass:"iconfont icon-drag drag-widget"})]):_vm._e()],2):_vm._e()]:[(element && element.key)?_c('widget-form-item',{key:element.key,attrs:{"element":element,"select":_vm.selectWidget,"index":index,"data":_vm.data},on:{"update:select":function($event){_vm.selectWidget=$event}}}):_vm._e()]]})],2)],1)],1)],1)}
var WidgetFormvue_type_template_id_7e852fae_staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetForm.vue?vue&type=template&id=7e852fae&

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/WidgetFormItem.vue?vue&type=template&id=5ffa2f8e&
var WidgetFormItemvue_type_template_id_5ffa2f8e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.element && _vm.element.key)?_c('el-form-item',{staticClass:"widget-view ",class:{active: _vm.selectWidget.key == _vm.element.key, 'is_req': _vm.element.options.required},attrs:{"label":_vm.element.name},nativeOn:{"click":function($event){$event.stopPropagation();return _vm.handleSelectWidget(_vm.index)}}},[(_vm.element.type == 'input')?[_c('el-input',{style:({width: _vm.element.options.width}),attrs:{"placeholder":_vm.element.options.placeholder,"disabled":_vm.element.options.disabled},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'textarea')?[_c('el-input',{style:({width: _vm.element.options.width}),attrs:{"type":"textarea","rows":5,"disabled":_vm.element.options.disabled,"placeholder":_vm.element.options.placeholder},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'number')?[_c('el-input-number',{style:({width: _vm.element.options.width}),attrs:{"disabled":_vm.element.options.disabled,"controls-position":_vm.element.options.controlsPosition},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'radio')?[_c('el-radio-group',{style:({width: _vm.element.options.width}),attrs:{"disabled":_vm.element.options.disabled},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}},_vm._l((_vm.element.options.options),function(item,index){return _c('el-radio',{key:item.value + index,style:({display: _vm.element.options.inline ? 'inline-block' : 'block'}),attrs:{"label":item.value}},[_vm._v("\n            "+_vm._s(_vm.element.options.showLabel ? item.label : item.value)+"\n          ")])}),1)]:_vm._e(),(_vm.element.type == 'checkbox')?[_c('el-checkbox-group',{style:({width: _vm.element.options.width}),attrs:{"disabled":_vm.element.options.disabled},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}},_vm._l((_vm.element.options.options),function(item,index){return _c('el-checkbox',{key:item.value + index,style:({display: _vm.element.options.inline ? 'inline-block' : 'block'}),attrs:{"label":item.value}},[_vm._v("\n            "+_vm._s(_vm.element.options.showLabel ? item.label : item.value)+"\n          ")])}),1)]:_vm._e(),(_vm.element.type == 'time')?[_c('el-time-picker',{style:({width: _vm.element.options.width}),attrs:{"is-range":_vm.element.options.isRange,"placeholder":_vm.element.options.placeholder,"start-placeholder":_vm.element.options.startPlaceholder,"end-placeholder":_vm.element.options.endPlaceholder,"readonly":_vm.element.options.readonly,"disabled":_vm.element.options.disabled,"editable":_vm.element.options.editable,"clearable":_vm.element.options.clearable,"arrowControl":_vm.element.options.arrowControl},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'date')?[_c('el-date-picker',{style:({width: _vm.element.options.width}),attrs:{"type":_vm.element.options.type,"is-range":_vm.element.options.isRange,"placeholder":_vm.element.options.placeholder,"start-placeholder":_vm.element.options.startPlaceholder,"end-placeholder":_vm.element.options.endPlaceholder,"readonly":_vm.element.options.readonly,"disabled":_vm.element.options.disabled,"editable":_vm.element.options.editable,"clearable":_vm.element.options.clearable},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'rate')?[_c('el-rate',{attrs:{"max":_vm.element.options.max,"disabled":_vm.element.options.disabled,"allow-half":_vm.element.options.allowHalf},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'color')?[_c('el-color-picker',{attrs:{"disabled":_vm.element.options.disabled,"show-alpha":_vm.element.options.showAlpha},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'select')?[_c('el-select',{style:({width: _vm.element.options.width}),attrs:{"disabled":_vm.element.options.disabled,"multiple":_vm.element.options.multiple,"clearable":_vm.element.options.clearable,"placeholder":_vm.element.options.placeholder},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}},_vm._l((_vm.element.options.options),function(item){return _c('el-option',{key:item.value,attrs:{"value":item.value,"label":_vm.element.options.showLabel?item.label:item.value}})}),1)]:_vm._e(),(_vm.element.type=='switch')?[_c('el-switch',{attrs:{"disabled":_vm.element.options.disabled},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type=='slider')?[_c('el-slider',{style:({width: _vm.element.options.width}),attrs:{"min":_vm.element.options.min,"max":_vm.element.options.max,"disabled":_vm.element.options.disabled,"step":_vm.element.options.step,"show-input":_vm.element.options.showInput,"range":_vm.element.options.range},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type=='imgupload')?[_c('fm-upload',{style:({'width': _vm.element.options.width}),attrs:{"disabled":_vm.element.options.disabled,"width":_vm.element.options.size.width,"height":_vm.element.options.size.height,"token":"xxx","domain":"xxx"},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'cascader')?[_c('el-cascader',{style:({width: _vm.element.options.width}),attrs:{"disabled":_vm.element.options.disabled,"clearable":_vm.element.options.clearable,"placeholder":_vm.element.options.placeholder,"options":_vm.element.options.remoteOptions},model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type == 'editor')?[_c('vue-editor',{style:({width: _vm.element.options.width}),model:{value:(_vm.element.options.defaultValue),callback:function ($$v) {_vm.$set(_vm.element.options, "defaultValue", $$v)},expression:"element.options.defaultValue"}})]:_vm._e(),(_vm.element.type=='blank')?[_c('div',{staticStyle:{"height":"50px","color":"#999","background":"#eee","line-height":"50px","text-align":"center"}},[_vm._v(_vm._s(_vm.$t('fm.components.fields.blank')))])]:_vm._e(),(_vm.element.type == 'text')?[_c('span',[_vm._v(_vm._s(_vm.element.options.defaultValue))])]:_vm._e(),(_vm.selectWidget.key == _vm.element.key)?_c('div',{staticClass:"widget-view-action"},[_c('i',{staticClass:"iconfont icon-icon_clone",on:{"click":function($event){$event.stopPropagation();return _vm.handleWidgetClone(_vm.index)}}}),_c('i',{staticClass:"iconfont icon-trash",on:{"click":function($event){$event.stopPropagation();return _vm.handleWidgetDelete(_vm.index)}}})]):_vm._e(),(_vm.selectWidget.key == _vm.element.key)?_c('div',{staticClass:"widget-view-drag"},[_c('i',{staticClass:"iconfont icon-drag drag-widget"})]):_vm._e()],2):_vm._e()}
var WidgetFormItemvue_type_template_id_5ffa2f8e_staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetFormItem.vue?vue&type=template&id=5ffa2f8e&

// EXTERNAL MODULE: ./packages/shzl-genrator-form/components/Upload/index.vue + 24 modules
var Upload = __webpack_require__("3bce");

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/WidgetFormItem.vue?vue&type=script&lang=js&






function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var WidgetFormItemvue_type_script_lang_js_ = ({
  props: ['element', 'select', 'index', 'data'],
  components: {
    FmUpload: Upload["a" /* default */]
  },
  data: function data() {
    return {
      selectWidget: this.select
    };
  },
  mounted: function mounted() {},
  methods: {
    handleSelectWidget: function handleSelectWidget(index) {
      this.selectWidget = this.data.list[index];
    },
    handleWidgetDelete: function handleWidgetDelete(index) {
      var _this = this;

      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.list[index - 1];
        }
      } else {
        this.selectWidget = this.data.list[index + 1];
      }

      this.$nextTick(function () {
        _this.data.list.splice(index, 1);
      });
    },
    handleWidgetClone: function handleWidgetClone(index) {
      var _this2 = this;

      var cloneData = _objectSpread(_objectSpread({}, this.data.list[index]), {}, {
        options: _objectSpread({}, this.data.list[index].options),
        key: Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      });

      if (this.data.list[index].type === 'radio' || this.data.list[index].type === 'checkbox' || this.data.list[index].type === 'select') {
        cloneData = _objectSpread(_objectSpread({}, cloneData), {}, {
          options: _objectSpread(_objectSpread({}, cloneData.options), {}, {
            options: cloneData.options.options.map(function (item) {
              return _objectSpread({}, item);
            })
          })
        });
      }

      this.data.list.splice(index, 0, cloneData);
      this.$nextTick(function () {
        _this2.selectWidget = _this2.data.list[index + 1];
      });
    }
  },
  watch: {
    select: function select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler: function handler(val) {
        this.$emit('update:select', val);
      },
      deep: true
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetFormItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_WidgetFormItemvue_type_script_lang_js_ = (WidgetFormItemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetFormItem.vue





/* normalize component */

var WidgetFormItem_component = Object(componentNormalizer["a" /* default */])(
  components_WidgetFormItemvue_type_script_lang_js_,
  WidgetFormItemvue_type_template_id_5ffa2f8e_render,
  WidgetFormItemvue_type_template_id_5ffa2f8e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var WidgetFormItem = (WidgetFormItem_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/WidgetForm.vue?vue&type=script&lang=js&






function WidgetFormvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function WidgetFormvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { WidgetFormvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { WidgetFormvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var WidgetFormvue_type_script_lang_js_ = ({
  components: {
    Draggable: vuedraggable_umd_default.a,
    WidgetFormItem: WidgetFormItem
  },
  props: ['data', 'select'],
  data: function data() {
    return {
      selectWidget: this.select
    };
  },
  mounted: function mounted() {
    document.body.ondrop = function (event) {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },
  methods: {
    handleMoveEnd: function handleMoveEnd(_ref) {
      var newIndex = _ref.newIndex,
          oldIndex = _ref.oldIndex;
      console.log('index', newIndex, oldIndex);
    },
    handleSelectWidget: function handleSelectWidget(index) {
      console.log(index, '#####');
      this.selectWidget = this.data.list[index];
    },
    handleWidgetAdd: function handleWidgetAdd(evt) {
      console.log('add', evt);
      console.log('end', evt);
      var newIndex = evt.newIndex;
      var to = evt.to;
      console.log(to); //为拖拽到容器的元素添加唯一 key

      var key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
      this.$set(this.data.list, newIndex, WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, this.data.list[newIndex]), {}, {
        options: WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, this.data.list[newIndex].options), {}, {
          remoteFunc: 'func_' + key
        }),
        key: key,
        // 绑定键值
        model: this.data.list[newIndex].type + '_' + key,
        rules: []
      }));

      if (this.data.list[newIndex].type === 'radio' || this.data.list[newIndex].type === 'checkbox' || this.data.list[newIndex].type === 'select') {
        this.$set(this.data.list, newIndex, WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, this.data.list[newIndex]), {}, {
          options: WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, this.data.list[newIndex].options), {}, {
            options: this.data.list[newIndex].options.options.map(function (item) {
              return WidgetFormvue_type_script_lang_js_objectSpread({}, item);
            })
          })
        }));
      }

      if (this.data.list[newIndex].type === 'grid') {
        this.$set(this.data.list, newIndex, WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, this.data.list[newIndex]), {}, {
          columns: this.data.list[newIndex].columns.map(function (item) {
            return WidgetFormvue_type_script_lang_js_objectSpread({}, item);
          })
        }));
      }

      this.selectWidget = this.data.list[newIndex];
    },
    handleWidgetColAdd: function handleWidgetColAdd($event, row, colIndex) {
      console.log('coladd', $event, row, colIndex);
      var newIndex = $event.newIndex;
      var oldIndex = $event.oldIndex;
      var item = $event.item; // 防止布局元素的嵌套拖拽

      if (item.className.indexOf('data-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex]);
        row.columns[colIndex].list.splice(newIndex, 1);
        return false;
      }

      console.log('from', item);
      var key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
      this.$set(row.columns[colIndex].list, newIndex, WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, row.columns[colIndex].list[newIndex]), {}, {
        options: WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, row.columns[colIndex].list[newIndex].options), {}, {
          remoteFunc: 'func_' + key
        }),
        key: key,
        // 绑定键值
        model: row.columns[colIndex].list[newIndex].type + '_' + key,
        rules: []
      }));

      if (row.columns[colIndex].list[newIndex].type === 'radio' || row.columns[colIndex].list[newIndex].type === 'checkbox' || row.columns[colIndex].list[newIndex].type === 'select') {
        this.$set(row.columns[colIndex].list, newIndex, WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, row.columns[colIndex].list[newIndex]), {}, {
          options: WidgetFormvue_type_script_lang_js_objectSpread(WidgetFormvue_type_script_lang_js_objectSpread({}, row.columns[colIndex].list[newIndex].options), {}, {
            options: row.columns[colIndex].list[newIndex].options.options.map(function (item) {
              return WidgetFormvue_type_script_lang_js_objectSpread({}, item);
            })
          })
        }));
      }

      this.selectWidget = row.columns[colIndex].list[newIndex];
    },
    handleWidgetDelete: function handleWidgetDelete(index) {
      var _this = this;

      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.list[index - 1];
        }
      } else {
        this.selectWidget = this.data.list[index + 1];
      }

      this.$nextTick(function () {
        _this.data.list.splice(index, 1);
      });
    }
  },
  watch: {
    select: function select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler: function handler(val) {
        this.$emit('update:select', val);
      },
      deep: true
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetForm.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_WidgetFormvue_type_script_lang_js_ = (WidgetFormvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/WidgetForm.vue





/* normalize component */

var WidgetForm_component = Object(componentNormalizer["a" /* default */])(
  components_WidgetFormvue_type_script_lang_js_,
  WidgetFormvue_type_template_id_7e852fae_render,
  WidgetFormvue_type_template_id_7e852fae_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var WidgetForm = (WidgetForm_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/CusDialog.vue?vue&type=template&id=4e334ee2&
var CusDialogvue_type_template_id_4e334ee2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-dialog',{ref:"elDialog",staticClass:"cus-dialog-container",attrs:{"title":_vm.title,"visible":_vm.dialogVisible,"close-on-click-modal":false,"append-to-body":"","center":"","width":_vm.width,"id":_vm.id},on:{"update:visible":function($event){_vm.dialogVisible=$event}}},[(_vm.show)?_c('span',[_vm._t("default")],2):_vm._e(),(_vm.action)?_c('span',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"dialog-footer",attrs:{"slot":"footer","element-loading-text":_vm.loadingText},slot:"footer"},[_vm._t("action",function(){return [_c('el-button',{on:{"click":_vm.close}},[_vm._v(_vm._s(_vm.$t('fm.actions.cancel')))]),_c('el-button',{attrs:{"type":"primary"},on:{"click":_vm.submit}},[_vm._v(_vm._s(_vm.$t('fm.actions.confirm')))])]})],2):_vm._e()])}
var CusDialogvue_type_template_id_4e334ee2_staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/CusDialog.vue?vue&type=template&id=4e334ee2&

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/CusDialog.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var CusDialogvue_type_script_lang_js_ = ({
  props: {
    visible: Boolean,
    loadingText: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '600px'
    },
    form: {
      type: Boolean,
      default: true
    },
    action: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    show: function show() {
      if (this.form) {
        return this.showForm;
      } else {
        return true;
      }
    }
  },
  data: function data() {
    return {
      loading: false,
      dialogVisible: this.visible,
      id: 'dialog_' + new Date().getTime(),
      showForm: false
    };
  },
  methods: {
    close: function close() {
      this.dialogVisible = false;
    },
    submit: function submit() {
      this.loading = true;
      this.$emit('on-submit');
    },
    end: function end() {
      this.loading = false;
    }
  },
  mounted: function mounted() {},
  watch: {
    dialogVisible: function dialogVisible(val) {
      var _this = this;

      if (!val) {
        this.loading = false;
        this.$emit('on-close');
        setTimeout(function () {
          _this.showForm = false;
        }, 300);
      } else {
        this.showForm = true;
      }
    },
    visible: function visible(val) {
      this.dialogVisible = val;
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/CusDialog.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_CusDialogvue_type_script_lang_js_ = (CusDialogvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/shzl-genrator-form/components/CusDialog.vue?vue&type=style&index=0&lang=scss&
var CusDialogvue_type_style_index_0_lang_scss_ = __webpack_require__("3cc6");

// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/CusDialog.vue






/* normalize component */

var CusDialog_component = Object(componentNormalizer["a" /* default */])(
  components_CusDialogvue_type_script_lang_js_,
  CusDialogvue_type_template_id_4e334ee2_render,
  CusDialogvue_type_template_id_4e334ee2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var CusDialog = (CusDialog_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/GenerateForm.vue?vue&type=template&id=7bed07eb&
var GenerateFormvue_type_template_id_7bed07eb_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"fm-style"},[_c('el-form',{ref:"generateForm",attrs:{"disabled":_vm.forbidden,"label-suffix":":","size":_vm.data.config.size,"model":_vm.models,"rules":_vm.rules,"label-position":_vm.data.config.labelPosition,"label-width":_vm.data.config.labelWidth + 'px'}},[_vm._l((_vm.data.list),function(item){return [(item.type == 'grid')?[_c('el-row',{key:item.key,attrs:{"type":"flex","gutter":item.options.gutter ? item.options.gutter : 0,"justify":item.options.justify,"align":item.options.align}},_vm._l((item.columns),function(col,colIndex){return _c('el-col',{key:colIndex,attrs:{"span":col.span}},[_vm._l((col.list),function(citem){return [(citem.type == 'blank')?_c('el-form-item',{key:citem.key,attrs:{"label":citem.name,"prop":citem.model}},[_vm._t(citem.model,null,{"model":_vm.models})],2):_c('genetate-form-item',{key:citem.key,attrs:{"models":_vm.models,"remote":_vm.remote,"rules":_vm.rules,"widget":citem},on:{"update:models":function($event){_vm.models=$event},"input-change":_vm.onInputChange}})]})],2)}),1)]:(item.type == 'blank')?[_c('el-form-item',{key:item.key,attrs:{"label":item.name,"prop":item.model}},[_vm._t(item.model,null,{"model":_vm.models})],2)]:[_c('genetate-form-item',{key:item.key,attrs:{"models":_vm.models,"rules":_vm.rules,"widget":item,"remote":_vm.remote},on:{"update:models":function($event){_vm.models=$event},"input-change":_vm.onInputChange}})]]})],2)],1)}
var GenerateFormvue_type_template_id_7bed07eb_staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/GenerateForm.vue?vue&type=template&id=7bed07eb&

// EXTERNAL MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/GenerateForm.vue?vue&type=script&lang=js&
var GenerateFormvue_type_script_lang_js_ = __webpack_require__("2969");

// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/GenerateForm.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_GenerateFormvue_type_script_lang_js_ = (GenerateFormvue_type_script_lang_js_["a" /* default */]); 
// EXTERNAL MODULE: ./packages/shzl-genrator-form/components/GenerateForm.vue?vue&type=style&index=0&lang=scss&
var GenerateFormvue_type_style_index_0_lang_scss_ = __webpack_require__("af83");

// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/GenerateForm.vue






/* normalize component */

var GenerateForm_component = Object(componentNormalizer["a" /* default */])(
  components_GenerateFormvue_type_script_lang_js_,
  GenerateFormvue_type_template_id_7bed07eb_render,
  GenerateFormvue_type_template_id_7bed07eb_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var GenerateForm = (GenerateForm_component.exports);
// EXTERNAL MODULE: ./node_modules/_clipboard@2.0.8@clipboard/dist/clipboard.js
var clipboard = __webpack_require__("7094");
var clipboard_default = /*#__PURE__*/__webpack_require__.n(clipboard);

// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/componentsConfig.js
var basicComponents = [{
  type: 'input',
  icon: 'icon-input',
  options: {
    width: '100%',
    defaultValue: '',
    required: false,
    dataType: 'string',
    pattern: '',
    placeholder: '',
    disabled: false
  }
}, {
  type: 'textarea',
  icon: 'icon-diy-com-textarea',
  options: {
    width: '100%',
    defaultValue: '',
    required: false,
    disabled: false,
    pattern: '',
    placeholder: ''
  }
}, {
  type: 'number',
  icon: 'icon-number',
  options: {
    width: '',
    required: false,
    defaultValue: 0,
    min: '',
    max: '',
    step: 1,
    disabled: false,
    controlsPosition: ''
  }
}, {
  type: 'radio',
  icon: 'icon-radio-active',
  options: {
    inline: false,
    defaultValue: '',
    showLabel: false,
    options: [{
      value: 'Option 1',
      label: 'Option 1'
    }, {
      value: 'Option 2',
      label: 'Option 2'
    }],
    required: false,
    width: '',
    remote: false,
    remoteOptions: [],
    props: {
      value: 'value',
      label: 'label'
    },
    remoteFunc: '',
    disabled: false
  }
}, {
  type: 'checkbox',
  icon: 'icon-check-box',
  options: {
    inline: false,
    defaultValue: [],
    showLabel: false,
    options: [{
      value: 'Option 1'
    }, {
      value: 'Option 2'
    }, {
      value: 'Option 3'
    }],
    required: false,
    width: '',
    remote: false,
    remoteOptions: [],
    props: {
      value: 'value',
      label: 'label'
    },
    remoteFunc: '',
    disabled: false
  }
}, {
  type: 'time',
  icon: 'icon-time',
  options: {
    defaultValue: '21:19:56',
    readonly: false,
    disabled: false,
    editable: true,
    clearable: true,
    placeholder: '',
    startPlaceholder: '',
    endPlaceholder: '',
    isRange: false,
    arrowControl: true,
    format: 'HH:mm:ss',
    required: false,
    width: ''
  }
}, {
  type: 'date',
  icon: 'icon-date',
  options: {
    defaultValue: '',
    readonly: false,
    disabled: false,
    editable: true,
    clearable: true,
    placeholder: '',
    startPlaceholder: '',
    endPlaceholder: '',
    type: 'date',
    format: 'yyyy-MM-dd',
    timestamp: false,
    required: false,
    width: ''
  }
}, {
  type: 'rate',
  icon: 'icon-pingfen1',
  options: {
    defaultValue: null,
    max: 5,
    disabled: false,
    allowHalf: false,
    required: false
  }
}, {
  type: 'color',
  icon: 'icon-color',
  options: {
    defaultValue: '',
    disabled: false,
    showAlpha: false,
    required: false
  }
}, {
  type: 'select',
  icon: 'icon-select',
  options: {
    defaultValue: '',
    multiple: false,
    disabled: false,
    clearable: false,
    placeholder: '',
    required: false,
    showLabel: false,
    width: '',
    options: [{
      value: 'Option 1',
      label: 'Option 1'
    }],
    remote: false,
    filterable: false,
    remoteOptions: [{
      value: 'Option 1',
      label: 'Option 1'
    }, {
      value: 'Option 2',
      label: 'Option 2'
    }],
    props: {
      value: 'value',
      label: 'label'
    },
    remoteFunc: ''
  }
}, {
  type: 'switch',
  icon: 'icon-switch',
  options: {
    defaultValue: false,
    required: false,
    disabled: false
  }
}, {
  type: 'slider',
  icon: 'icon-slider',
  options: {
    defaultValue: 0,
    disabled: false,
    required: false,
    min: 0,
    max: 100,
    step: 1,
    showInput: false,
    range: false,
    width: ''
  }
}, {
  type: 'text',
  icon: 'icon-wenzishezhi-',
  options: {
    defaultValue: 'This is a text',
    customClass: ''
  }
}];
var advanceComponents = [{
  type: 'blank',
  icon: 'icon-zidingyishuju',
  options: {
    defaultType: 'String'
  }
}, {
  type: 'imgupload',
  icon: 'icon-tupian',
  options: {
    defaultValue: [],
    size: {
      width: 100,
      height: 100
    },
    width: '',
    tokenFunc: 'funcGetToken',
    token: '',
    domain: 'http://pfp81ptt6.bkt.clouddn.com/',
    disabled: false,
    length: 8,
    multiple: false,
    isQiniu: false,
    isDelete: false,
    min: 0,
    isEdit: false,
    action: 'https://jsonplaceholder.typicode.com/photos/'
  }
}, {
  type: 'editor',
  icon: 'icon-fuwenbenkuang',
  options: {
    defaultValue: '',
    width: ''
  }
}, {
  type: 'cascader',
  icon: 'icon-jilianxuanze',
  options: {
    defaultValue: [],
    width: '',
    placeholder: '',
    disabled: false,
    clearable: false,
    remote: true,
    remoteOptions: [],
    props: {
      value: 'value',
      label: 'label',
      children: 'children'
    },
    remoteFunc: ''
  }
}];
var layoutComponents = [{
  type: 'grid',
  icon: 'icon-grid-',
  columns: [{
    span: 12,
    list: []
  }, {
    span: 12,
    list: []
  }],
  options: {
    gutter: 0,
    justify: 'start',
    align: 'top'
  }
}];
// EXTERNAL MODULE: ./packages/shzl-genrator-form/util/index.js
var util = __webpack_require__("bd4d");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("5f1c");

// EXTERNAL MODULE: /Users/zhangpeng/node_modules/axios/index.js
var axios = __webpack_require__("8206");
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);

// CONCATENATED MODULE: ./packages/shzl-genrator-form/util/request.js


var request = axios_default.a.create({
  withCredentials: false
});
request.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  console.log('error', error);
  return Promise.reject(new Error(error).message);
});
request.interceptors.response.use(function (response) {
  console.log('.....', response);
  return response.data;
}, function (error) {
  console.log('error', error);
  return Promise.reject(new Error(error).message);
});
/* harmony default export */ var util_request = (request);
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/generateCode.js



function findRemoteFunc(list, funcList, tokenFuncList, blankList) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].type == 'grid') {
      list[i].columns.forEach(function (item) {
        findRemoteFunc(item.list, funcList, tokenFuncList, blankList);
      });
    } else {
      if (list[i].type == 'blank') {
        if (list[i].model) {
          blankList.push({
            name: list[i].model,
            label: list[i].name
          });
        }
      } else if (list[i].type == 'imgupload') {
        if (list[i].options.tokenFunc) {
          tokenFuncList.push({
            func: list[i].options.tokenFunc,
            label: list[i].name,
            model: list[i].model
          });
        }
      } else {
        if (list[i].options.remote && list[i].options.remoteFunc) {
          funcList.push({
            func: list[i].options.remoteFunc,
            label: list[i].name,
            model: list[i].model
          });
        }
      }
    }
  }
}

/* harmony default export */ var generateCode = (function (data) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'vue';
  var funcList = [];
  var tokenFuncList = [];
  var blankList = [];
  findRemoteFunc(JSON.parse(data).list, funcList, tokenFuncList, blankList);
  var funcTemplate = '';
  var blankTemplate = '';

  for (var i = 0; i < funcList.length; i++) {
    funcTemplate += "\n            ".concat(funcList[i].func, " (resolve) {\n              // ").concat(funcList[i].label, " ").concat(funcList[i].model, "\n              // Call callback function once get the data from remote server\n              // resolve(data)\n            },\n    ");
  }

  for (var _i = 0; _i < tokenFuncList.length; _i++) {
    funcTemplate += "\n            ".concat(tokenFuncList[_i].func, " (resolve) {\n              // ").concat(tokenFuncList[_i].label, " ").concat(tokenFuncList[_i].model, "\n              // Call callback function once get the token\n              // resolve(token)\n            },\n    ");
  }

  for (var _i2 = 0; _i2 < blankList.length; _i2++) {
    blankTemplate += "\n        <template slot=\"".concat(blankList[_i2].name, "\" slot-scope=\"scope\">\n          <!-- ").concat(blankList[_i2].label, " -->\n          <!-- use v-model=\"scope.model.").concat(blankList[_i2].name, "\" to bind data -->\n        </template>\n    ");
  }

  if (type == 'vue') {
    return "<template>\n  <div>\n    <fm-generate-form :data=\"jsonData\" :remote=\"remoteFuncs\" :value=\"editData\" ref=\"generateForm\">\n      ".concat(blankTemplate, "\n    </fm-generate-form>\n    <el-button type=\"primary\" @click=\"handleSubmit\">\u63D0\u4EA4</el-button>\n  </div>\n</template>\n\n<script>\n  export default {\n    data () {\n      return {\n        jsonData: ").concat(data, ",\n        editData: {},\n        remoteFuncs: {\n          ").concat(funcTemplate, "\n        }\n      }\n    },\n    methods: {\n      handleSubmit () {\n        this.$refs.generateForm.getData().then(data => {\n          // data check success\n          // data - form data\n        }).catch(e => {\n          // data check failed\n        })\n      }\n    }\n  }\n</script>");
  } else {
    return "<!DOCTYPE html>\n  <html>\n  <head>\n    <meta charset=\"UTF-8\">\n    <link rel=\"stylesheet\" href=\"https://unpkg.com/element-ui/lib/theme-chalk/index.css\">\n    <link rel=\"stylesheet\" href=\"https://unpkg.com/form-making/dist/FormMaking.css\">\n  </head>\n  <body>\n    <div id=\"app\">\n      <fm-generate-form :data=\"jsonData\" :remote=\"remoteFuncs\" :value=\"editData\" ref=\"generateForm\">\n        ".concat(blankTemplate, "\n      </fm-generate-form>\n      <el-button type=\"primary\" @click=\"handleSubmit\">\u63D0\u4EA4</el-button>\n    </div>\n    <script src=\"https://unpkg.com/vue/dist/vue.js\"></script>\n    <script src=\"https://unpkg.com/element-ui/lib/index.js\"></script>\n    <script src=\"https://unpkg.com/form-making/dist/FormMaking.umd.js\"></script>\n    <script>\n      new Vue({\n        el: '#app',\n        data: {\n          jsonData: ").concat(data, ",\n          editData: {},\n          remoteFuncs: {\n            ").concat(funcTemplate, "\n          }\n        },\n        methods: {\n          handleSubmit () {\n            this.$refs.generateForm.getData().then(data => {\n              // data check success\n              // data - form data\n            }).catch(e => {\n              // data check failed\n            })\n          }\n        }\n      })\n    </script>\n  </body>\n  </html>");
  }
});
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/Container.vue?vue&type=script&lang=js&






function Containervue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function Containervue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Containervue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Containervue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//











/* harmony default export */ var Containervue_type_script_lang_js_ = ({
  name: 'shzl-making-form',
  components: {
    Draggable: vuedraggable_umd_default.a,
    WidgetConfig: WidgetConfig,
    FormConfig: FormConfig,
    WidgetForm: WidgetForm,
    CusDialog: CusDialog,
    GenerateForm: GenerateForm
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    },
    basicFields: {
      type: Array,
      default: function _default() {
        return ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text'];
      }
    },
    advanceFields: {
      type: Array,
      default: function _default() {
        return ['blank', 'imgupload', 'editor', 'cascader'];
      }
    },
    layoutFields: {
      type: Array,
      default: function _default() {
        return ['grid'];
      }
    }
  },
  data: function data() {
    return {
      basicComponents: basicComponents,
      layoutComponents: layoutComponents,
      advanceComponents: advanceComponents,
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        }
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {
        func_test: function func_test(resolve) {
          setTimeout(function () {
            var options = [{
              id: '1',
              name: '1111'
            }, {
              id: '2',
              name: '2222'
            }, {
              id: '3',
              name: '3333'
            }];
            resolve(options);
          }, 2000);
        },
        funcGetToken: function funcGetToken(resolve) {
          util_request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(function (res) {
            resolve(res.uptoken);
          });
        },
        upload_callback: function upload_callback(response, file, fileList) {
          console.log('callback', response, file, fileList);
        }
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      vueTemplate: '',
      jsonTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: "{\n  \"list\": [],\n  \"config\": {\n    \"labelWidth\": 100,\n    \"labelPosition\": \"top\",\n    \"size\": \"small\"\n  }\n}",
      codeActiveName: 'vue'
    };
  },
  mounted: function mounted() {
    this._loadComponents();
  },
  methods: {
    _loadComponents: function _loadComponents() {
      var _this = this;

      this.basicComponents = this.basicComponents.map(function (item) {
        return Containervue_type_script_lang_js_objectSpread(Containervue_type_script_lang_js_objectSpread({}, item), {}, {
          name: _this.$t("fm.components.fields.".concat(item.type))
        });
      });
      this.advanceComponents = this.advanceComponents.map(function (item) {
        return Containervue_type_script_lang_js_objectSpread(Containervue_type_script_lang_js_objectSpread({}, item), {}, {
          name: _this.$t("fm.components.fields.".concat(item.type))
        });
      });
      this.layoutComponents = this.layoutComponents.map(function (item) {
        return Containervue_type_script_lang_js_objectSpread(Containervue_type_script_lang_js_objectSpread({}, item), {}, {
          name: _this.$t("fm.components.fields.".concat(item.type))
        });
      });
    },
    handleGoGithub: function handleGoGithub() {
      window.location.href = 'https://github.com/GavinZhuLei/vue-form-making';
    },
    handleConfigSelect: function handleConfigSelect(value) {
      this.configTab = value;
    },
    handleMoveEnd: function handleMoveEnd(evt) {
      console.log('end', evt);
    },
    handleMoveStart: function handleMoveStart(_ref) {
      var oldIndex = _ref.oldIndex;
      console.log('start', oldIndex, this.basicComponents);
    },
    handleMove: function handleMove() {
      return true;
    },
    handlePreview: function handlePreview() {
      console.log(this.widgetForm);
      this.previewVisible = true;
    },
    handleTest: function handleTest() {
      var _this2 = this;

      this.$refs.generateForm.getData().then(function (data) {
        _this2.$alert(data, '').catch(function (e) {});

        _this2.$refs.widgetPreview.end();
      }).catch(function (e) {
        _this2.$refs.widgetPreview.end();
      });
    },
    handleReset: function handleReset() {
      this.$refs.generateForm.reset();
    },
    saveJson: function saveJson() {
      this.$emit('getJson', JSON.stringify(this.widgetForm));
    },
    handleGenerateJson: function handleGenerateJson() {
      var _this3 = this;

      this.jsonVisible = true;
      this.jsonTemplate = this.widgetForm;
      this.$nextTick(function () {
        var editor = ace.edit('jsoneditor');
        editor.session.setMode('ace/mode/json');

        if (!_this3.jsonClipboard) {
          _this3.jsonClipboard = new clipboard_default.a('.json-btn');

          _this3.jsonClipboard.on('success', function (e) {
            _this3.$message.success(_this3.$t('fm.message.copySuccess'));
          });
        }

        _this3.jsonCopyValue = JSON.stringify(_this3.widgetForm);
      });
    },
    handleGenerateCode: function handleGenerateCode() {
      this.codeVisible = true;
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html');
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue');
      this.$nextTick(function () {
        var editor = ace.edit('codeeditor');
        editor.session.setMode('ace/mode/html');
        var vueeditor = ace.edit('vuecodeeditor');
        vueeditor.session.setMode('ace/mode/html');
      });
    },
    handleUpload: function handleUpload() {
      var _this4 = this;

      this.uploadVisible = true;
      this.$nextTick(function () {
        _this4.uploadEditor = ace.edit('uploadeditor');

        _this4.uploadEditor.session.setMode('ace/mode/json');
      });
    },
    handleUploadJson: function handleUploadJson() {// try {
      //   this.setJSON(JSON.parse(this.uploadEditor.getValue()));
      //   this.uploadVisible = false;
      // } catch (e) {
      //   this.$message.error(e.message);
      //   this.$refs.uploadJson.end();
      // }
    },
    handleClear: function handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: ''
        }
      };
      this.widgetFormSelect = {};
    },
    clear: function clear() {
      this.handleClear();
    },
    getJSON: function getJSON() {
      return this.widgetForm;
    },
    getHtml: function getHtml() {
      return generateCode(JSON.stringify(this.widgetForm));
    },
    setJSON: function setJSON(json) {
      this.widgetForm = json;

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0];
      }
    },
    handleInput: function handleInput(val) {
      console.log(val);
      this.blank = val;
    },
    handleDataChange: function handleDataChange(field, value, data) {
      console.log(field, value, data);
    }
  },
  watch: {
    $lang: function $lang(val) {
      this._loadComponents();
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/Container.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Containervue_type_script_lang_js_ = (Containervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/Container.vue





/* normalize component */

var Container_component = Object(componentNormalizer["a" /* default */])(
  components_Containervue_type_script_lang_js_,
  Containervue_type_template_id_1c667be1_render,
  Containervue_type_template_id_1c667be1_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Container = (Container_component.exports);
// CONCATENATED MODULE: ./packages/shzl-genrator-form/index.js







function shzl_genrator_form_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function shzl_genrator_form_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { shzl_genrator_form_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { shzl_genrator_form_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/*
 * @Author: your name
 * @Date: 2021-07-26 17:26:21
 * @LastEditTime: 2021-08-31 11:01:39
 * @LastEditors: 张鹏
 * @Description: In User Settings Edit
 * @FilePath: /sgup-admin/src/component/genform/index.js
 */
 // import "normalize.css/normalize.css";









var shzl_genrator_form_loadLang = function loadLang(Vue, lang, locale, i18n) {
  if (locale) {
    locale('en-US', shzl_genrator_form_objectSpread(shzl_genrator_form_objectSpread({}, locale('en-US')), en_US));
    locale('zh-CN', shzl_genrator_form_objectSpread(shzl_genrator_form_objectSpread({}, locale('zh-CN')), zh_CN));
    Vue.config.lang = lang;
  } else if (i18n) {
    i18n.setLocaleMessage('en-US', shzl_genrator_form_objectSpread(shzl_genrator_form_objectSpread({}, i18n.messages['en-US']), en_US));
    i18n.setLocaleMessage('zh-CN', shzl_genrator_form_objectSpread(shzl_genrator_form_objectSpread({}, i18n.messages['zh-CN']), zh_CN));
    i18n.locale = lang;
  } else {
    Vue.use(vue_i18n_common_default.a);
    Vue.locale('en-US', shzl_genrator_form_objectSpread(shzl_genrator_form_objectSpread({}, Vue.locale('en-US')), en_US));
    Vue.locale('zh-CN', shzl_genrator_form_objectSpread(shzl_genrator_form_objectSpread({}, Vue.locale('zh-CN')), zh_CN));
    Vue.config.lang = lang;
  }
};

Container.install = function (Vue) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    lang: 'zh-CN',
    locale: null,
    i18n: null
  };
  shzl_genrator_form_loadLang(Vue, opts.lang, opts.locale, opts.i18n);
  Vue.component(Container.name, Container);
};

GenerateForm.install = function (Vue) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    lang: 'zh-CN',
    locale: null,
    i18n: null
  };
  shzl_genrator_form_loadLang(Vue, opts.lang, opts.locale, opts.i18n);
  Vue.component(GenerateForm.name, GenerateForm);
}; // const components = [shzlMakingForm, GenerateForm];
// const install = function(
//    Vue,
//    opts = {
//       lang: 'zh-CN',
//       locale: null,
//       i18n: null,
//    }
// ) {
//    loadLang(Vue, opts.lang, opts.locale, opts.i18n);
//    components.forEach((component) => {
//       Vue.component(component.name, component);
//    });
// };
// if (typeof window !== 'undefined' && window.Vue) {
//    install(window.Vue);
// }
// export { install, shzlMakingForm, GenerateForm };


/* harmony default export */ var shzl_genrator_form = ({
  shzlMakingForm: Container,
  shzlGenerateForm: GenerateForm
});
// CONCATENATED MODULE: ./packages/index.js







function packages_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function packages_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { packages_ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { packages_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 11:02:14
 */







var packages_loadLang = function loadLang(Vue, lang, locale, i18n) {
  if (locale) {
    locale('en-US', packages_objectSpread(packages_objectSpread({}, locale('en-US')), en_US));
    locale('zh-CN', packages_objectSpread(packages_objectSpread({}, locale('zh-CN')), zh_CN));
    Vue.config.lang = lang;
  } else if (i18n) {
    i18n.setLocaleMessage('en-US', packages_objectSpread(packages_objectSpread({}, i18n.messages['en-US']), en_US));
    i18n.setLocaleMessage('zh-CN', packages_objectSpread(packages_objectSpread({}, i18n.messages['zh-CN']), zh_CN));
    i18n.locale = lang;
  } else {
    Vue.use(vue_i18n_common_default.a);
    Vue.locale('en-US', packages_objectSpread(packages_objectSpread({}, Vue.locale('en-US')), en_US));
    Vue.locale('zh-CN', packages_objectSpread(packages_objectSpread({}, Vue.locale('zh-CN')), zh_CN));
    Vue.config.lang = lang;
  }
}; // 导入颜色选择器组件




var shzlMakingForm = shzl_genrator_form.shzlMakingForm;
var shzlGenerateForm = shzl_genrator_form.shzlGenerateForm; // 存储组件列表

var components = [packages_shzl_color_picker, shzlMakingForm, shzlGenerateForm]; // 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册

var install = function install(Vue) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    lang: 'zh-CN',
    locale: null,
    i18n: null
  };
  // 判断是否可以安装
  if (install.installed) return;
  packages_loadLang(Vue, opts.lang, opts.locale, opts.i18n); // 遍历注册全局组件

  components.map(function (component) {
    return Vue.component(component.name, component);
  });
}; // 判断是否是直接引入文件


if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

/* harmony default export */ var packages_0 = ({
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install: install,
  // 以下是具体的组件列表
  shzlColorPicker: packages_shzl_color_picker,
  shzlMakingForm: shzlMakingForm,
  shzlGenerateForm: shzlGenerateForm
});
// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@3.12.1@@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (packages_0);



/***/ }),

/***/ "120f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("3d8a");
var $export = __webpack_require__("e99b");
var redefine = __webpack_require__("84e8");
var hide = __webpack_require__("065d");
var Iterators = __webpack_require__("953d");
var $iterCreate = __webpack_require__("3460");
var setToStringTag = __webpack_require__("bac3");
var getPrototypeOf = __webpack_require__("addc");
var ITERATOR = __webpack_require__("839a")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "12c7":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("690e")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ "12cb":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("3a08");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "1374":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__("bb8b");
var createDesc = __webpack_require__("5edc");

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ "13b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "1586":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "1663":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("212e");
var defined = __webpack_require__("3ab0");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "1694":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("f30a");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("5925").default
var update = add("9ad776c0", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "1705":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("eeeb")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "1828":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("f7c9");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("5925").default
var update = add("2b88d6c2", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "19aa":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("3a08");
var defined = __webpack_require__("100d");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "1a58":
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__("839a");


/***/ }),

/***/ "1a9a":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("839a")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "1b0b":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("a86f");
var aFunction = __webpack_require__("3250");
var SPECIES = __webpack_require__("839a")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "1b75":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("3bc4");

/***/ }),

/***/ "1b96":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("cea2");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "1bc7":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("25ba");
var getKeys = __webpack_require__("93ca");
var redefine = __webpack_require__("84e8");
var global = __webpack_require__("0b34");
var hide = __webpack_require__("065d");
var Iterators = __webpack_require__("953d");
var wks = __webpack_require__("839a");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "1da5":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("8334");
var TAG = __webpack_require__("eeeb")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "1e4d":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("3250");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "201c":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("212e");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "20e0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "212e":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "21d9":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("3a4c");
var hiddenKeys = __webpack_require__("065e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "223c":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("67e6");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("5925").default
var update = add("a49f9468", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "234a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/GenerateFormItem.vue?vue&type=template&id=4d7c22a9&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-form-item',{attrs:{"label":_vm.widget.name,"prop":_vm.widget.model}},[(_vm.widget.type == 'input')?[(_vm.widget.options.dataType == 'number' || _vm.widget.options.dataType == 'integer' || _vm.widget.options.dataType == 'float')?_c('el-input',{style:({ width: _vm.widget.options.width }),attrs:{"type":"number","placeholder":_vm.widget.options.placeholder,"disabled":_vm.widget.options.disabled},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=_vm._n($$v)},expression:"dataModel"}}):_c('el-input',{style:({ width: _vm.widget.options.width }),attrs:{"type":_vm.widget.options.dataType,"disabled":_vm.widget.options.disabled,"placeholder":_vm.widget.options.placeholder},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'textarea')?[_c('el-input',{style:({ width: _vm.widget.options.width }),attrs:{"type":"textarea","rows":5,"disabled":_vm.widget.options.disabled,"placeholder":_vm.widget.options.placeholder},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'number')?[_c('el-input-number',{style:({ width: _vm.widget.options.width }),attrs:{"step":_vm.widget.options.step,"controls-position":"right","disabled":_vm.widget.options.disabled,"min":_vm.widget.options.min,"max":_vm.widget.options.max},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'radio')?[_c('el-radio-group',{style:({ width: _vm.widget.options.width }),attrs:{"disabled":_vm.widget.options.disabled},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}},_vm._l((_vm.widget.options.remote ? _vm.widget.options.remoteOptions : _vm.widget.options.options),function(item,index){return _c('el-radio',{key:index,style:({ display: _vm.widget.options.inline ? 'inline-block' : 'block' }),attrs:{"label":item.value}},[(_vm.widget.options.remote)?[_vm._v(_vm._s(item.label))]:[_vm._v(_vm._s(_vm.widget.options.showLabel ? item.label : item.value))]],2)}),1)]:_vm._e(),(_vm.widget.type == 'checkbox')?[_c('el-checkbox-group',{style:({ width: _vm.widget.options.width }),attrs:{"disabled":_vm.widget.options.disabled},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}},_vm._l((_vm.widget.options.remote ? _vm.widget.options.remoteOptions : _vm.widget.options.options),function(item,index){return _c('el-checkbox',{key:index,style:({ display: _vm.widget.options.inline ? 'inline-block' : 'block' }),attrs:{"label":item.value}},[(_vm.widget.options.remote)?[_vm._v(_vm._s(item.label))]:[_vm._v(_vm._s(_vm.widget.options.showLabel ? item.label : item.value))]],2)}),1)]:_vm._e(),(_vm.widget.type == 'time')?[_c('el-time-picker',{style:({ width: _vm.widget.options.width }),attrs:{"is-range":_vm.widget.options.isRange,"placeholder":_vm.widget.options.placeholder,"start-placeholder":_vm.widget.options.startPlaceholder,"end-placeholder":_vm.widget.options.endPlaceholder,"readonly":_vm.widget.options.readonly,"disabled":_vm.widget.options.disabled,"editable":_vm.widget.options.editable,"clearable":_vm.widget.options.clearable,"arrowControl":_vm.widget.options.arrowControl,"value-format":_vm.widget.options.format},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'date')?[_c('el-date-picker',{style:({ width: _vm.widget.options.width }),attrs:{"type":_vm.widget.options.type,"placeholder":_vm.widget.options.placeholder,"start-placeholder":_vm.widget.options.startPlaceholder,"end-placeholder":_vm.widget.options.endPlaceholder,"readonly":_vm.widget.options.readonly,"disabled":_vm.widget.options.disabled,"editable":_vm.widget.options.editable,"clearable":_vm.widget.options.clearable,"value-format":_vm.widget.options.timestamp ? 'timestamp' : _vm.widget.options.format,"format":_vm.widget.options.format},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'rate')?[_c('el-rate',{attrs:{"max":_vm.widget.options.max,"disabled":_vm.widget.options.disabled,"allow-half":_vm.widget.options.allowHalf},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'color')?[_c('el-color-picker',{attrs:{"disabled":_vm.widget.options.disabled,"show-alpha":_vm.widget.options.showAlpha},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'select')?[_c('el-select',{style:({ width: _vm.widget.options.width }),attrs:{"disabled":_vm.widget.options.disabled,"multiple":_vm.widget.options.multiple,"clearable":_vm.widget.options.clearable,"placeholder":_vm.widget.options.placeholder,"filterable":_vm.widget.options.filterable},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}},_vm._l((_vm.widget.options.remote ? _vm.widget.options.remoteOptions : _vm.widget.options.options),function(item){return _c('el-option',{key:item.value,attrs:{"value":item.value,"label":_vm.widget.options.showLabel || _vm.widget.options.remote ? item.label : item.value}})}),1)]:_vm._e(),(_vm.widget.type == 'switch')?[_c('el-switch',{attrs:{"disabled":_vm.widget.options.disabled},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'slider')?[_c('el-slider',{style:({ width: _vm.widget.options.width }),attrs:{"min":_vm.widget.options.min,"max":_vm.widget.options.max,"disabled":_vm.widget.options.disabled,"step":_vm.widget.options.step,"show-input":_vm.widget.options.showInput,"range":_vm.widget.options.range},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'imgupload')?[_c('fm-upload',{style:({ width: _vm.widget.options.width }),attrs:{"disabled":_vm.widget.options.disabled,"width":_vm.widget.options.size.width,"height":_vm.widget.options.size.height,"token":_vm.widget.options.token,"domain":_vm.widget.options.domain,"multiple":_vm.widget.options.multiple,"length":_vm.widget.options.length,"is-qiniu":_vm.widget.options.isQiniu,"is-delete":_vm.widget.options.isDelete,"min":_vm.widget.options.min,"is-edit":_vm.widget.options.isEdit,"action":_vm.widget.options.action},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'editor')?[_c('vue-editor',{style:({ width: _vm.widget.options.width }),model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'cascader')?[_c('el-cascader',{style:({ width: _vm.widget.options.width }),attrs:{"disabled":_vm.widget.options.disabled,"clearable":_vm.widget.options.clearable,"placeholder":_vm.widget.options.placeholder,"options":_vm.widget.options.remoteOptions},model:{value:(_vm.dataModel),callback:function ($$v) {_vm.dataModel=$$v},expression:"dataModel"}})]:_vm._e(),(_vm.widget.type == 'text')?[_c('span',[_vm._v(_vm._s(_vm.dataModel))])]:_vm._e()],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/GenerateFormItem.vue?vue&type=template&id=4d7c22a9&

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es7.object.get-own-property-descriptors.js
var es7_object_get_own_property_descriptors = __webpack_require__("ac67");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("1bc7");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("25ba");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("32ea");

// EXTERNAL MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__("c1a2");

// EXTERNAL MODULE: ./packages/shzl-genrator-form/components/Upload/index.vue + 24 modules
var Upload = __webpack_require__("3bce");

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/GenerateFormItem.vue?vue&type=script&lang=js&






function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var GenerateFormItemvue_type_script_lang_js_ = ({
  props: ['widget', 'models', 'rules', 'remote'],
  components: {
    FmUpload: Upload["a" /* default */]
  },
  data: function data() {
    return {
      dataModel: this.models[this.widget.model]
    };
  },
  created: function created() {
    var _this = this;

    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc](function (data) {
        _this.widget.options.remoteOptions = data.map(function (item) {
          return {
            value: item[_this.widget.options.props.value],
            label: item[_this.widget.options.props.label],
            children: item[_this.widget.options.props.children]
          };
        });
      });
    }

    if (this.widget.type === 'imgupload' && this.widget.options.isQiniu) {
      this.remote[this.widget.options.tokenFunc](function (data) {
        _this.widget.options.token = data;
      });
    }
  },
  methods: {},
  watch: {
    dataModel: {
      deep: true,
      handler: function handler(val) {
        this.models[this.widget.model] = val;
        this.$emit('update:models', _objectSpread(_objectSpread({}, this.models), {}, Object(defineProperty["a" /* default */])({}, this.widget.model, val)));
        this.$emit('input-change', val, this.widget.model);
      }
    },
    models: {
      deep: true,
      handler: function handler(val) {
        this.dataModel = val[this.widget.model];
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/GenerateFormItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_GenerateFormItemvue_type_script_lang_js_ = (GenerateFormItemvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/_vue-loader@15.9.8@vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("cba8");

// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/GenerateFormItem.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_GenerateFormItemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var GenerateFormItem = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ "245c":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("4e6a")('keys');
var uid = __webpack_require__("f6cf");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "2480":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiDrag", function() { return MultiDragPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sortable", function() { return Sortable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Swap", function() { return SwapPlugin; });
/**!
 * Sortable 1.10.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var version = "1.10.2";

function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !!
    /*@__PURE__*/
    navigator.userAgent.match(pattern);
  }
}

var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

var captureMode = {
  capture: false,
  passive: false
};

function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

function matches(
/**HTMLElement*/
el,
/**String*/
selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}

function closest(
/**HTMLElement*/
el,
/**String*/
selector,
/**HTMLElement*/
ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }

  return null;
}

var R_SPACE = /\s+/g;

function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}

function css(el, prop, val) {
  var style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

function matrix(el, selfOnly) {
  var appliedTransforms = '';

  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, 'transform');

      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */

    } while (!selfOnly && (el = el.parentNode));
  }

  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */

  return matrixFn && new matrixFn(appliedTransforms);
}

function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
        i = 0,
        n = list.length;

    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }

    return list;
  }

  return [];
}

function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */


function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;

  if (el !== window && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }

  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11

    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */

      } while (container = container.parentNode);
    }
  }

  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;

    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }

  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}
/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */


function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
      elSideVal = getRect(el)[elSide];
  /* jshint boss:true */

  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
        visible = void 0;

    if (parentSide === 'top' || parentSide === 'left') {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }

  return false;
}
/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */


function getChild(el, childNum, options) {
  var currentChild = 0,
      i = 0,
      children = el.children;

  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && children[i] !== Sortable.dragged && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }

      currentChild++;
    }

    i++;
  }

  return null;
}
/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */


function lastChild(el, selector) {
  var last = el.lastElementChild;

  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }

  return last || null;
}
/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */


function index(el, selector) {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }
  /* jshint boss:true */


  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }

  return index;
}
/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */


function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
      offsetTop = 0,
      winScroller = getWindowScrollingElement();

  if (el) {
    do {
      var elMatrix = matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }

  return [offsetLeft, offsetTop];
}
/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */


function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }

  return -1;
}

function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;

  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);

      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */

  } while (elem = elem.parentNode);

  return getWindowScrollingElement();
}

function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}

var _throttleTimeout;

function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
          _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}

function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}

function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;

  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}

function setRect(el, rect) {
  css(el, 'position', 'absolute');
  css(el, 'top', rect.top);
  css(el, 'left', rect.left);
  css(el, 'width', rect.width);
  css(el, 'height', rect.height);
}

function unsetRect(el) {
  css(el, 'position', '');
  css(el, 'top', '');
  css(el, 'left', '');
  css(el, 'width', '');
  css(el, 'height', '');
}

var expando = 'Sortable' + new Date().getTime();

function AnimationStateManager() {
  var animationStates = [],
      animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });

        var fromRect = _objectSpread({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;

      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }

      var animating = false,
          animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
            target = state.target,
            fromRect = target.fromRect,
            toRect = getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        } // if fromRect != toRect: animate


        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = _this.options.animation;
          }

          _this.animate(target, animatingRect, toRect, time);
        }

        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);

      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }

      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, 'transition', '');
        css(target, 'transform', '');
        var elMatrix = matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        repaint(target); // repaint

        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, 'transition', '');
          css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}

function repaint(target) {
  return target.offsetWidth;
}

function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }

    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;

    this.eventCanceled = false;

    evt.cancel = function () {
      _this.eventCanceled = true;
    };

    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread({
          sortable: sortable
        }, evt));
      } // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined


      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized; // Add default options from plugin

      _extends(defaults, initialized.defaults);
    });

    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);

      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;

      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
      rootEl = _ref.rootEl,
      name = _ref.name,
      targetEl = _ref.targetEl,
      cloneEl = _ref.cloneEl,
      toEl = _ref.toEl,
      fromEl = _ref.fromEl,
      oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex,
      oldDraggableIndex = _ref.oldDraggableIndex,
      newDraggableIndex = _ref.newDraggableIndex,
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }

  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

  var allEventProperties = _objectSpread({}, extraEventProperties, PluginManager.getEventProperties(name, sortable));

  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = _objectWithoutProperties(_ref, ["evt"]);

  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};

function _dispatchEvent(info) {
  dispatchEvent(_objectSpread({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}

var dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    oldIndex,
    newIndex,
    oldDraggableIndex,
    newDraggableIndex,
    activeGroup,
    putSortable,
    awaitingDragStarted = false,
    ignoreNextClick = false,
    sortables = [],
    tapEvt,
    touchEvt,
    lastDx,
    lastDy,
    tapDistanceLeft,
    tapDistanceTop,
    moved,
    lastTarget,
    lastDirection,
    pastFirstInvertThresh = false,
    isCircumstantialInvert = false,
    targetMoveDistance,
    // For positioning ghost absolutely
ghostRelativeParent,
    ghostRelativeParentInitialScroll = [],
    // (left, top)
_silent = false,
    savedInputChecked = [];
/** @const */

var documentExists = typeof document !== 'undefined',
    PositionGhostAbsolutely = IOS,
    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
    supportCssPointerEvents = function () {
  if (!documentExists) return; // false when <= IE11

  if (IE11OrLess) {
    return false;
  }

  var el = document.createElement('x');
  el.style.cssText = 'pointer-events:auto';
  return el.style.pointerEvents === 'auto';
}(),
    _detectDirection = function _detectDirection(el, options) {
  var elCSS = css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

  if (elCSS.display === 'flex') {
    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
  }

  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
    var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
  }

  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
},
    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
},

/**
 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @return {HTMLElement}   Element of the first found nearest Sortable
 */
_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
  var ret;
  sortables.some(function (sortable) {
    if (lastChild(sortable)) return;
    var rect = getRect(sortable),
        threshold = sortable[expando].options.emptyInsertThreshold,
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

    if (threshold && insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
},
    _prepareGroup = function _prepareGroup(options) {
  function toFn(value, pull) {
    return function (to, from, dragEl, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

      if (value == null && (pull || sameGroup)) {
        // Default pull value
        // Default pull and put value if same group
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === 'clone') {
        return value;
      } else if (typeof value === 'function') {
        return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }

  var group = {};
  var originalGroup = options.group;

  if (!originalGroup || _typeof(originalGroup) != 'object') {
    originalGroup = {
      name: originalGroup
    };
  }

  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
},
    _hideGhostForTarget = function _hideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', 'none');
  }
},
    _unhideGhostForTarget = function _unhideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', '');
  }
}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


if (documentExists) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}

var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;

    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

    if (nearest) {
      // Create imitation event
      var event = {};

      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }

      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;

      nearest[expando]._onDragOver(event);
    }
  }
};

var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */


function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }

  this.el = el; // root element

  this.options = options = _extends({}, options); // Export instance

  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults); // Set default options

  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  _prepareGroup(options); // Bind all private methods


  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  } // Setup drag mode


  this.nativeDraggable = options.forceFallback ? false : supportDraggable;

  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  } // Bind events


  if (options.supportPointer) {
    on(el, 'pointerdown', this._onTapStart);
  } else {
    on(el, 'mousedown', this._onTapStart);
    on(el, 'touchstart', this._onTapStart);
  }

  if (this.nativeDraggable) {
    on(el, 'dragover', this);
    on(el, 'dragenter', this);
  }

  sortables.push(this.el); // Restore sorting

  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

  _extends(this, AnimationStateManager());
}

Sortable.prototype =
/** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(
  /** Event|TouchEvent */
  evt) {
    if (!evt.cancelable) return;

    var _this = this,
        el = this.el,
        options = this.options,
        preventOnFilter = options.preventOnFilter,
        type = evt.type,
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;

    _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


    if (dragEl) {
      return;
    }

    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    } // cancel dnd if original target is content editable


    if (originalTarget.isContentEditable) {
      return;
    }

    target = closest(target, options.draggable, el, false);

    if (target && target.animated) {
      return;
    }

    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    } // Get the index of the dragged element within its parent


    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable); // Check filter

    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });

        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });

          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });

      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    }

    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    } // Prepare `dragstart`


    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(
  /** Event */
  evt,
  /** Touch */
  touch,
  /** HTMLElement */
  target) {
    var _this = this,
        el = _this.el,
        options = _this.options,
        ownerDocument = el.ownerDocument,
        dragStartFn;

    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';

      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });

        if (Sortable.eventCanceled) {
          _this._onDrop();

          return;
        } // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove


        _this._disableDelayedDragEvents();

        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        } // Bind the events: dragstart/dragend


        _this._triggerDragStart(evt, touch); // Drag start event


        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        }); // Chosen item


        toggleClass(dragEl, options.chosenClass, true);
      }; // Disable "draggable"


      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mouseup', _this._onDrop);
      on(ownerDocument, 'touchend', _this._onDrop);
      on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }

      pluginEvent('delayStart', this, {
        evt: evt
      }); // Delay is impossible for native DnD in Edge or IE

      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();

          return;
        } // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag


        on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
        on(ownerDocument, 'touchend', _this._disableDelayedDrag);
        on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
  /** TouchEvent|PointerEvent **/
  e) {
    var touch = e.touches ? e.touches[0] : e;

    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);

    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off(ownerDocument, 'touchend', this._disableDelayedDrag);
    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(
  /** Event */
  evt,
  /** Touch */
  touch) {
    touch = touch || evt.pointerType == 'touch' && evt;

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on(document, 'touchmove', this._onTouchMove);
      } else {
        on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on(dragEl, 'dragend', this);
      on(rootEl, 'dragstart', this._onDragStart);
    }

    try {
      if (document.selection) {
        // Timeout neccessary for IE9
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {

    awaitingDragStarted = false;

    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });

      if (this.nativeDraggable) {
        on(document, 'dragover', _checkOutsideTargetEl);
      }

      var options = this.options; // Apply effect

      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost(); // Drag start event

      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;

      _hideGhostForTarget();

      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }

      dragEl.parentNode[expando]._isOutsideThisEl(target);

      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });

            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }

          target = parent; // store last element
        }
        /* jshint boss:true */
        while (parent = parent.parentNode);
      }

      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(
  /**TouchEvent*/
  evt) {
    if (tapEvt) {
      var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = ghostEl && matrix(ghostEl, true),
          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }

        this._onDragStart(evt, true);
      }

      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }

        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, 'webkitTransform', cssMatrix);
        css(ghostEl, 'mozTransform', cssMatrix);
        css(ghostEl, 'msTransform', cssMatrix);
        css(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }

      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
          options = this.options; // Position absolutely

      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;

        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }

        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }

        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }

      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, 'transition', '');
      css(ghostEl, 'transform', '');
      css(ghostEl, 'box-sizing', 'border-box');
      css(ghostEl, 'margin', 0);
      css(ghostEl, 'top', rect.top);
      css(ghostEl, 'left', rect.left);
      css(ghostEl, 'width', rect.width);
      css(ghostEl, 'height', rect.height);
      css(ghostEl, 'opacity', '0.8');
      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css(ghostEl, 'zIndex', '100000');
      css(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl); // Set transform-origin

      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart(
  /**Event*/
  evt,
  /**boolean*/
  fallback) {
    var _this = this;

    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });

    if (Sortable.eventCanceled) {
      this._onDrop();

      return;
    }

    pluginEvent('setupClone', this);

    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';

      this._hideClone();

      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    } // #1143: IFrame support workaround


    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }

      _this._hideClone();

      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, 'mouseup', _this._onDrop);
      off(document, 'touchend', _this._onDrop);
      off(document, 'touchcancel', _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }

      on(document, 'drop', _this); // #1276 fix:

      css(dragEl, 'transform', 'translateZ(0)');
    }

    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, 'selectstart', _this);
    moved = true;

    if (Safari) {
      css(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(
  /**Event*/
  evt) {
    var el = this.el,
        target = evt.target,
        dragRect,
        targetRect,
        revert,
        options = this.options,
        group = options.group,
        activeSortable = Sortable.active,
        isOwner = activeGroup === group,
        canSort = options.sort,
        fromSortable = putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;

    if (_silent) return;

    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    } // Capture animation state


    function capture() {
      dragOverEvent('dragOverAnimationCapture');

      _this.captureAnimationState();

      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    } // Return invocation when dragEl is inserted (or completed)


    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }

        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        } // Animation


        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }

        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });

        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      } // Null lastTarget if it is not inside a previously swapped element


      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      } // no bubbling and not fallback


      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


        !insertion && nearestEmptyInsertDetectEvent(evt);
      }

      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    } // Call when dragEl has been inserted


    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);

      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;

    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }

    ignoreNextClick = false;

    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;

      if (revert) {
        parentEl = rootEl; // actualization

        capture();

        this._hideClone();

        dragOverEvent('revert');

        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }

        return completed(true);
      }

      var elLastChild = lastChild(el, options.draggable);

      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        } // assign target only if condition is true


        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }

        if (target) {
          targetRect = getRect(target);
        }

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          el.appendChild(dragEl);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = dragEl.parentNode !== el,
            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }

        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;

        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);

          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
        } // If dragEl is already beside target: Do not insert


        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
            after = false;
        after = direction === 1;

        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }

          _silent = true;
          setTimeout(_unsilent, 30);
          capture();

          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          } // Undo chrome's scroll adjustment (has no effect on other browsers)


          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }

          parentEl = dragEl.parentNode; // actualization
          // must be done before animation

          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }

          changed();
          return completed(true);
        }
      }

      if (el.contains(dragEl)) {
        return completed(false);
      }
    }

    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, 'mousemove', this._onTouchMove);
    off(document, 'touchmove', this._onTouchMove);
    off(document, 'pointermove', this._onTouchMove);
    off(document, 'dragover', nearestEmptyInsertDetectEvent);
    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._onDrop);
    off(ownerDocument, 'touchend', this._onDrop);
    off(ownerDocument, 'pointerup', this._onDrop);
    off(ownerDocument, 'touchcancel', this._onDrop);
    off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(
  /**Event*/
  evt) {
    var el = this.el,
        options = this.options; // Get the index of the dragged element within its parent

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);

    if (Sortable.eventCanceled) {
      this._nulling();

      return;
    }

    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);

    _cancelNextTick(this.cloneId);

    _cancelNextTick(this._dragStartId); // Unbind events


    if (this.nativeDraggable) {
      off(document, 'drop', this);
      off(el, 'dragstart', this._onDragStart);
    }

    this._offMoveEvents();

    this._offUpEvents();

    if (Safari) {
      css(document.body, 'user-select', '');
    }

    css(dragEl, 'transform', '');

    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }

      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, 'dragend', this);
        }

        _disableDraggable(dragEl);

        dragEl.style['will-change'] = ''; // Remove classes
        // ghostClass is added in dragStarted

        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }

        toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });

        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            }); // Remove event


            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            }); // drag from one list and drop into another


            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }

          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }

        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }

          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          }); // Save sorting


          this.save();
        }
      }
    }

    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(
  /**Event*/
  evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);

        break;

      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);

          _globalDragOver(evt);
        }

        break;

      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },

  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length,
        options = this.options;

    for (; i < n; i++) {
      el = children[i];

      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }

    return order;
  },

  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order) {
    var items = {},
        rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];

      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
  },

  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },

  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;

    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);

      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off(el, 'mousedown', this._onTapStart);
    off(el, 'touchstart', this._onTapStart);
    off(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      off(el, 'dragover', this);
      off(el, 'dragenter', this);
    } // Remove draggable attributes


    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, 'display', 'none');

      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }

      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();

      return;
    }

    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return; // show clone at dragEl or original position

      if (rootEl.contains(dragEl) && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }

      css(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};

function _globalDragOver(
/**Event*/
evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }

  evt.cancelable && evt.preventDefault();
}

function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
      sortable = fromEl[expando],
      onMoveFn = sortable.options.onMove,
      retVal; // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }

  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);

  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }

  return retVal;
}

function _disableDraggable(el) {
  el.draggable = false;
}

function _unsilent() {
  _silent = false;
}

function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}

function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }

      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }

  invert = invert || invertSwap;

  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }

  return 0;
}
/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */


function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */


function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;

  while (i--) {
    sum += str.charCodeAt(i);
  }

  return sum.toString(36);
}

function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;

  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}

function _nextTick(fn) {
  return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
  return clearTimeout(id);
} // Fixed #973:


if (documentExists) {
  on(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
} // Export utils


Sortable.utils = {
  on: on,
  off: off,
  css: css,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild
};
/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */

Sortable.get = function (element) {
  return element[expando];
};
/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */


Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }

    if (plugin.utils) Sortable.utils = _objectSpread({}, Sortable.utils, plugin.utils);
    PluginManager.mount(plugin);
  });
};
/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */


Sortable.create = function (el, options) {
  return new Sortable(el, options);
}; // Export


Sortable.version = version;

var autoScrolls = [],
    scrollEl,
    scrollRootEl,
    scrolling = false,
    lastAutoScrollX,
    lastAutoScrollY,
    touchEvt$1,
    pointerElemChangedInterval;

function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    }; // Bind all private methods

    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;

      if (this.sortable.nativeDraggable) {
        on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;

      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off(document, 'dragover', this._handleAutoScroll);
      } else {
        off(document, 'pointermove', this._handleFallbackAutoScroll);
        off(document, 'touchmove', this._handleFallbackAutoScroll);
        off(document, 'mousemove', this._handleFallbackAutoScroll);
      }

      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;

      var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt; // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good

      if (fallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

        var ogElemScroller = getParentAutoScrollElement(elem, true);

        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }

            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }

        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}

function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}

function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}

var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
      scrollCustomFn; // New scroll root, set scrollEl

  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }

  var layersOut = 0;
  var currentParent = scrollEl;

  do {
    var el = currentParent,
        rect = getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = css(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }

    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }

    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */

        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely

          }

          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }

          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }

    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();

  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};

function Revert() {}

Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();

    if (putSortable) {
      putSortable.captureAnimationState();
    }

    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }

    this.sortable.animateAll();

    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};

_extends(Revert, {
  pluginName: 'revertOnSpill'
});

function Remove() {}

Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};

_extends(Remove, {
  pluginName: 'removeOnSpill'
});

var lastSwapEl;

function SwapPlugin() {
  function Swap() {
    this.defaults = {
      swapClass: 'sortable-swap-highlight'
    };
  }

  Swap.prototype = {
    dragStart: function dragStart(_ref) {
      var dragEl = _ref.dragEl;
      lastSwapEl = dragEl;
    },
    dragOverValid: function dragOverValid(_ref2) {
      var completed = _ref2.completed,
          target = _ref2.target,
          onMove = _ref2.onMove,
          activeSortable = _ref2.activeSortable,
          changed = _ref2.changed,
          cancel = _ref2.cancel;
      if (!activeSortable.options.swap) return;
      var el = this.sortable.el,
          options = this.options;

      if (target && target !== el) {
        var prevSwapEl = lastSwapEl;

        if (onMove(target) !== false) {
          toggleClass(target, options.swapClass, true);
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          toggleClass(prevSwapEl, options.swapClass, false);
        }
      }

      changed();
      completed(true);
      cancel();
    },
    drop: function drop(_ref3) {
      var activeSortable = _ref3.activeSortable,
          putSortable = _ref3.putSortable,
          dragEl = _ref3.dragEl;
      var toSortable = putSortable || this.sortable;
      var options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);

      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
        if (dragEl !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          swapNodes(dragEl, lastSwapEl);
          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling: function nulling() {
      lastSwapEl = null;
    }
  };
  return _extends(Swap, {
    pluginName: 'swap',
    eventProperties: function eventProperties() {
      return {
        swapItem: lastSwapEl
      };
    }
  });
}

function swapNodes(n1, n2) {
  var p1 = n1.parentNode,
      p2 = n2.parentNode,
      i1,
      i2;
  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
  i1 = index(n1);
  i2 = index(n2);

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }

  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}

var multiDragElements = [],
    multiDragClones = [],
    lastMultiDragSelect,
    // for selection with modifier key down (SHIFT)
multiDragSortable,
    initialFolding = false,
    // Initial multi-drag fold when drag started
folding = false,
    // Folding any other time
dragStarted = false,
    dragEl$1,
    clonesFromRect,
    clonesHidden;

function MultiDragPlugin() {
  function MultiDrag(sortable) {
    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    if (sortable.options.supportPointer) {
      on(document, 'pointerup', this._deselectMultiDrag);
    } else {
      on(document, 'mouseup', this._deselectMultiDrag);
      on(document, 'touchend', this._deselectMultiDrag);
    }

    on(document, 'keydown', this._checkKeyDown);
    on(document, 'keyup', this._checkKeyUp);
    this.defaults = {
      selectedClass: 'sortable-selected',
      multiDragKey: null,
      setData: function setData(dataTransfer, dragEl) {
        var data = '';

        if (multiDragElements.length && multiDragSortable === sortable) {
          multiDragElements.forEach(function (multiDragElement, i) {
            data += (!i ? '' : ', ') + multiDragElement.textContent;
          });
        } else {
          data = dragEl.textContent;
        }

        dataTransfer.setData('Text', data);
      }
    };
  }

  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,
    delayStartGlobal: function delayStartGlobal(_ref) {
      var dragged = _ref.dragEl;
      dragEl$1 = dragged;
    },
    delayEnded: function delayEnded() {
      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
    },
    setupClone: function setupClone(_ref2) {
      var sortable = _ref2.sortable,
          cancel = _ref2.cancel;
      if (!this.isMultiDrag) return;

      for (var i = 0; i < multiDragElements.length; i++) {
        multiDragClones.push(clone(multiDragElements[i]));
        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
        multiDragClones[i].draggable = false;
        multiDragClones[i].style['will-change'] = '';
        toggleClass(multiDragClones[i], this.options.selectedClass, false);
        multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
      }

      sortable._hideClone();

      cancel();
    },
    clone: function clone(_ref3) {
      var sortable = _ref3.sortable,
          rootEl = _ref3.rootEl,
          dispatchSortableEvent = _ref3.dispatchSortableEvent,
          cancel = _ref3.cancel;
      if (!this.isMultiDrag) return;

      if (!this.options.removeCloneOnHide) {
        if (multiDragElements.length && multiDragSortable === sortable) {
          insertMultiDragClones(true, rootEl);
          dispatchSortableEvent('clone');
          cancel();
        }
      }
    },
    showClone: function showClone(_ref4) {
      var cloneNowShown = _ref4.cloneNowShown,
          rootEl = _ref4.rootEl,
          cancel = _ref4.cancel;
      if (!this.isMultiDrag) return;
      insertMultiDragClones(false, rootEl);
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', '');
      });
      cloneNowShown();
      clonesHidden = false;
      cancel();
    },
    hideClone: function hideClone(_ref5) {
      var _this = this;

      var sortable = _ref5.sortable,
          cloneNowHidden = _ref5.cloneNowHidden,
          cancel = _ref5.cancel;
      if (!this.isMultiDrag) return;
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', 'none');

        if (_this.options.removeCloneOnHide && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
      cloneNowHidden();
      clonesHidden = true;
      cancel();
    },
    dragStartGlobal: function dragStartGlobal(_ref6) {
      var sortable = _ref6.sortable;

      if (!this.isMultiDrag && multiDragSortable) {
        multiDragSortable.multiDrag._deselectMultiDrag();
      }

      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.sortableIndex = index(multiDragElement);
      }); // Sort multi-drag elements

      multiDragElements = multiDragElements.sort(function (a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      dragStarted = true;
    },
    dragStarted: function dragStarted(_ref7) {
      var _this2 = this;

      var sortable = _ref7.sortable;
      if (!this.isMultiDrag) return;

      if (this.options.sort) {
        // Capture rects,
        // hide multi drag elements (by positioning them absolute),
        // set multi drag elements rects to dragRect,
        // show multi drag elements,
        // animate to rects,
        // unset rects & remove from DOM
        sortable.captureAnimationState();

        if (this.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            css(multiDragElement, 'position', 'absolute');
          });
          var dragRect = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRect);
          });
          folding = true;
          initialFolding = true;
        }
      }

      sortable.animateAll(function () {
        folding = false;
        initialFolding = false;

        if (_this2.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
        } // Remove all auxiliary multidrag items from el, if sorting enabled


        if (_this2.options.sort) {
          removeMultiDragElements();
        }
      });
    },
    dragOver: function dragOver(_ref8) {
      var target = _ref8.target,
          completed = _ref8.completed,
          cancel = _ref8.cancel;

      if (folding && ~multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },
    revert: function revert(_ref9) {
      var fromSortable = _ref9.fromSortable,
          rootEl = _ref9.rootEl,
          sortable = _ref9.sortable,
          dragRect = _ref9.dragRect;

      if (multiDragElements.length > 1) {
        // Setup unfold animation
        multiDragElements.forEach(function (multiDragElement) {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: folding ? getRect(multiDragElement) : dragRect
          });
          unsetRect(multiDragElement);
          multiDragElement.fromRect = dragRect;
          fromSortable.removeAnimationState(multiDragElement);
        });
        folding = false;
        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref10) {
      var sortable = _ref10.sortable,
          isOwner = _ref10.isOwner,
          insertion = _ref10.insertion,
          activeSortable = _ref10.activeSortable,
          parentEl = _ref10.parentEl,
          putSortable = _ref10.putSortable;
      var options = this.options;

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        }

        initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
          var dragRectAbsolute = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

            parentEl.appendChild(multiDragElement);
          });
          folding = true;
        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


        if (!isOwner) {
          // Only remove if not folding (folding will remove them anyways)
          if (!folding) {
            removeMultiDragElements();
          }

          if (multiDragElements.length > 1) {
            var clonesHiddenBefore = clonesHidden;

            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
              multiDragClones.forEach(function (clone) {
                activeSortable.addAnimationState({
                  target: clone,
                  rect: clonesFromRect
                });
                clone.fromRect = clonesFromRect;
                clone.thisAnimationDuration = null;
              });
            }
          } else {
            activeSortable._showClone(sortable);
          }
        }
      }
    },
    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
      var dragRect = _ref11.dragRect,
          isOwner = _ref11.isOwner,
          activeSortable = _ref11.activeSortable;
      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.thisAnimationDuration = null;
      });

      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
        clonesFromRect = _extends({}, dragRect);
        var dragMatrix = matrix(dragEl$1, true);
        clonesFromRect.top -= dragMatrix.f;
        clonesFromRect.left -= dragMatrix.e;
      }
    },
    dragOverAnimationComplete: function dragOverAnimationComplete() {
      if (folding) {
        folding = false;
        removeMultiDragElements();
      }
    },
    drop: function drop(_ref12) {
      var evt = _ref12.originalEvent,
          rootEl = _ref12.rootEl,
          parentEl = _ref12.parentEl,
          sortable = _ref12.sortable,
          dispatchSortableEvent = _ref12.dispatchSortableEvent,
          oldIndex = _ref12.oldIndex,
          putSortable = _ref12.putSortable;
      var toSortable = putSortable || this.sortable;
      if (!evt) return;
      var options = this.options,
          children = parentEl.children; // Multi-drag selection

      if (!dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }

        toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

        if (!~multiDragElements.indexOf(dragEl$1)) {
          multiDragElements.push(dragEl$1);
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'select',
            targetEl: dragEl$1,
            originalEvt: evt
          }); // Modifier activated, select from last to dragEl

          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
            var lastIndex = index(lastMultiDragSelect),
                currentIndex = index(dragEl$1);

            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
              // (but previous selection existed)
              var n, i;

              if (currentIndex > lastIndex) {
                i = lastIndex;
                n = currentIndex;
              } else {
                i = currentIndex;
                n = lastIndex + 1;
              }

              for (; i < n; i++) {
                if (~multiDragElements.indexOf(children[i])) continue;
                toggleClass(children[i], options.selectedClass, true);
                multiDragElements.push(children[i]);
                dispatchEvent({
                  sortable: sortable,
                  rootEl: rootEl,
                  name: 'select',
                  targetEl: children[i],
                  originalEvt: evt
                });
              }
            }
          } else {
            lastMultiDragSelect = dragEl$1;
          }

          multiDragSortable = toSortable;
        } else {
          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
          lastMultiDragSelect = null;
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'deselect',
            targetEl: dragEl$1,
            originalEvt: evt
          });
        }
      } // Multi-drag drop


      if (dragStarted && this.isMultiDrag) {
        // Do not "unfold" after around dragEl if reverted
        if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
          var dragRect = getRect(dragEl$1),
              multiDragIndex = index(dragEl$1, ':not(.' + this.options.selectedClass + ')');
          if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
          toSortable.captureAnimationState();

          if (!initialFolding) {
            if (options.animation) {
              dragEl$1.fromRect = dragRect;
              multiDragElements.forEach(function (multiDragElement) {
                multiDragElement.thisAnimationDuration = null;

                if (multiDragElement !== dragEl$1) {
                  var rect = folding ? getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect; // Prepare unfold animation

                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect: rect
                  });
                }
              });
            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
            // properly they must all be removed


            removeMultiDragElements();
            multiDragElements.forEach(function (multiDragElement) {
              if (children[multiDragIndex]) {
                parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
              } else {
                parentEl.appendChild(multiDragElement);
              }

              multiDragIndex++;
            }); // If initial folding is done, the elements may have changed position because they are now
            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
            // must be fired here as Sortable will not.

            if (oldIndex === index(dragEl$1)) {
              var update = false;
              multiDragElements.forEach(function (multiDragElement) {
                if (multiDragElement.sortableIndex !== index(multiDragElement)) {
                  update = true;
                  return;
                }
              });

              if (update) {
                dispatchSortableEvent('update');
              }
            }
          } // Must be done after capturing individual rects (scroll bar)


          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
          toSortable.animateAll();
        }

        multiDragSortable = toSortable;
      } // Remove clones if necessary


      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        multiDragClones.forEach(function (clone) {
          clone.parentNode && clone.parentNode.removeChild(clone);
        });
      }
    },
    nullingGlobal: function nullingGlobal() {
      this.isMultiDrag = dragStarted = false;
      multiDragClones.length = 0;
    },
    destroyGlobal: function destroyGlobal() {
      this._deselectMultiDrag();

      off(document, 'pointerup', this._deselectMultiDrag);
      off(document, 'mouseup', this._deselectMultiDrag);
      off(document, 'touchend', this._deselectMultiDrag);
      off(document, 'keydown', this._checkKeyDown);
      off(document, 'keyup', this._checkKeyUp);
    },
    _deselectMultiDrag: function _deselectMultiDrag(evt) {
      if (typeof dragStarted !== "undefined" && dragStarted) return; // Only deselect if selection is in this sortable

      if (multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

      if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

      if (evt && evt.button !== 0) return;

      while (multiDragElements.length) {
        var el = multiDragElements[0];
        toggleClass(el, this.options.selectedClass, false);
        multiDragElements.shift();
        dispatchEvent({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: 'deselect',
          targetEl: el,
          originalEvt: evt
        });
      }
    },
    _checkKeyDown: function _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },
    _checkKeyUp: function _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    }
  };
  return _extends(MultiDrag, {
    // Static methods & properties
    pluginName: 'multiDrag',
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select: function select(el) {
        var sortable = el.parentNode[expando];
        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

        if (multiDragSortable && multiDragSortable !== sortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();

          multiDragSortable = sortable;
        }

        toggleClass(el, sortable.options.selectedClass, true);
        multiDragElements.push(el);
      },

      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect: function deselect(el) {
        var sortable = el.parentNode[expando],
            index = multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index) return;
        toggleClass(el, sortable.options.selectedClass, false);
        multiDragElements.splice(index, 1);
      }
    },
    eventProperties: function eventProperties() {
      var _this3 = this;

      var oldIndicies = [],
          newIndicies = [];
      multiDragElements.forEach(function (multiDragElement) {
        oldIndicies.push({
          multiDragElement: multiDragElement,
          index: multiDragElement.sortableIndex
        }); // multiDragElements will already be sorted if folding

        var newIndex;

        if (folding && multiDragElement !== dragEl$1) {
          newIndex = -1;
        } else if (folding) {
          newIndex = index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
        } else {
          newIndex = index(multiDragElement);
        }

        newIndicies.push({
          multiDragElement: multiDragElement,
          index: newIndex
        });
      });
      return {
        items: _toConsumableArray(multiDragElements),
        clones: [].concat(multiDragClones),
        oldIndicies: oldIndicies,
        newIndicies: newIndicies
      };
    },
    optionListeners: {
      multiDragKey: function multiDragKey(key) {
        key = key.toLowerCase();

        if (key === 'ctrl') {
          key = 'Control';
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }

        return key;
      }
    }
  });
}

function insertMultiDragElements(clonesInserted, rootEl) {
  multiDragElements.forEach(function (multiDragElement, i) {
    var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(multiDragElement, target);
    } else {
      rootEl.appendChild(multiDragElement);
    }
  });
}
/**
 * Insert multi-drag clones
 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
 * @param  {HTMLElement} rootEl
 */


function insertMultiDragClones(elementsInserted, rootEl) {
  multiDragClones.forEach(function (clone, i) {
    var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(clone, target);
    } else {
      rootEl.appendChild(clone);
    }
  });
}

function removeMultiDragElements() {
  multiDragElements.forEach(function (multiDragElement) {
    if (multiDragElement === dragEl$1) return;
    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
  });
}

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

/* harmony default export */ __webpack_exports__["default"] = (Sortable);



/***/ }),

/***/ "25ba":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("87b2");
var step = __webpack_require__("6fef");
var Iterators = __webpack_require__("953d");
var toIObject = __webpack_require__("3471");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("120f")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "2641":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("948d");

/***/ }),

/***/ "26df":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("0926")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "273d":
/***/ (function(module, exports) {



/***/ }),

/***/ "275a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("1586");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "2843":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__("1e4d");
var $export = __webpack_require__("e99b");
var toObject = __webpack_require__("8078");
var call = __webpack_require__("b1d4");
var isArrayIter = __webpack_require__("dcea");
var toLength = __webpack_require__("201c");
var createProperty = __webpack_require__("1374");
var getIterFn = __webpack_require__("e3bb");

$export($export.S + $export.F * !__webpack_require__("1a9a")(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "285b":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("35d4");
var createDesc = __webpack_require__("5edc");
var toIObject = __webpack_require__("3471");
var toPrimitive = __webpack_require__("5d10");
var has = __webpack_require__("4fd4");
var IE8_DOM_DEFINE = __webpack_require__("83d3");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("26df") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "2969":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ac67");
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5f1c");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Users_zhangpeng_Desktop_shzl_ui_node_modules_babel_runtime_corejs2_7_15_3_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c1a2");
/* harmony import */ var _Users_zhangpeng_Desktop_shzl_ui_node_modules_babel_runtime_corejs2_7_15_3_babel_runtime_corejs2_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e7e6");
/* harmony import */ var core_js_modules_es6_array_iterator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("25ba");
/* harmony import */ var core_js_modules_es6_array_iterator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_iterator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("32ea");
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1bc7");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _GenerateFormItem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("234a");
/* harmony import */ var _util_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("bd4d");








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(_Users_zhangpeng_Desktop_shzl_ui_node_modules_babel_runtime_corejs2_7_15_3_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = (Object(_Users_zhangpeng_Desktop_shzl_ui_node_modules_babel_runtime_corejs2_7_15_3_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])({
  name: 'shzl-generate-form',
  components: {
    GenetateFormItem: _GenerateFormItem__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"]
  },
  props: ['data', 'remote', 'value', 'insite', 'forbidden'],
  data: function data() {
    return {
      models: {},
      rules: {}
    };
  },
  watch: {
    forbidden: function forbidden(e) {
      console.log(e);
    }
  },
  created: function created() {
    console.log(this.forbidden, this.insite);
    this.generateModle(this.data.list);
  },
  mounted: function mounted() {},
  methods: {
    generateModle: function generateModle(genList) {
      var _this = this;

      for (var i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(function (item) {
            _this.generateModle(item.list);
          });
        } else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model];
          } else {
            if (genList[i].type === 'blank') {
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === 'String' ? '' : genList[i].options.defaultType === 'Object' ? {} : []);
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue;
            }
          }

          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [].concat(Object(_Users_zhangpeng_Desktop_shzl_ui_node_modules_babel_runtime_corejs2_7_15_3_babel_runtime_corejs2_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(this.rules[genList[i].model]), Object(_Users_zhangpeng_Desktop_shzl_ui_node_modules_babel_runtime_corejs2_7_15_3_babel_runtime_corejs2_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(genList[i].rules.map(function (item) {
              if (item.pattern) {
                return _objectSpread(_objectSpread({}, item), {}, {
                  pattern: eval(item.pattern)
                });
              } else {
                return _objectSpread({}, item);
              }
            })));
          } else {
            this.rules[genList[i].model] = Object(_Users_zhangpeng_Desktop_shzl_ui_node_modules_babel_runtime_corejs2_7_15_3_babel_runtime_corejs2_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(genList[i].rules.map(function (item) {
              if (item.pattern) {
                return _objectSpread(_objectSpread({}, item), {}, {
                  pattern: eval(item.pattern)
                });
              } else {
                return _objectSpread({}, item);
              }
            }));
          }
        }
      }
    },
    getData: function getData() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.$refs.generateForm.validate(function (valid) {
          if (valid) {
            resolve(_this2.models);
          } else {
            reject(new Error(_this2.$t('fm.message.validError')).message);
          }
        });
      });
    },
    reset: function reset() {
      this.$refs.generateForm.resetFields();
    },
    onInputChange: function onInputChange(value, field) {
      this.$emit('on-change', field, value, this.models);
    },
    refresh: function refresh() {}
  }
}, "watch", {
  data: {
    deep: true,
    handler: function handler(val) {
      this.generateModle(val.list);
    }
  },
  value: {
    deep: true,
    handler: function handler(val) {
      console.log(JSON.stringify(val));
      this.models = _objectSpread(_objectSpread({}, this.models), val);
    }
  }
}));

/***/ }),

/***/ "2b37":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("1e4d");
var call = __webpack_require__("b1d4");
var isArrayIter = __webpack_require__("dcea");
var anObject = __webpack_require__("a86f");
var toLength = __webpack_require__("201c");
var getIterFn = __webpack_require__("e3bb");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "2bb8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ "2c3d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__("728a");
var $export = __webpack_require__("7c2b");
var toObject = __webpack_require__("3212");
var call = __webpack_require__("406a");
var isArrayIter = __webpack_require__("5baf");
var toLength = __webpack_require__("f861");
var createProperty = __webpack_require__("fdf9");
var getIterFn = __webpack_require__("acc0");

$export($export.S + $export.F * !__webpack_require__("1705")(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "2d39":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("0b34");
var macrotask = __webpack_require__("edec").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("cea2")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "3212":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("100d");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "3250":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "32ea":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("8078");
var $keys = __webpack_require__("93ca");

__webpack_require__("b2be")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "3335":
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__("2480"));
	else {}
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE_a352__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "02f4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var defined = __webpack_require__("be13");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "0390":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("02f4")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("b0c5");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");
var regexpExec = __webpack_require__("520a");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var $toString = __webpack_require__("fa5b");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2fdb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__("5ca1");
var context = __webpack_require__("d2c8");
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__("5147")(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "5147":
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),

/***/ "520a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("0bfb");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "5f1b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("23c6");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6762":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__("5ca1");
var $includes = __webpack_require__("c366")(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__("9c6c")('includes');


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7333":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
var toObject = __webpack_require__("4bf8");
var IObject = __webpack_require__("626a");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("79e5")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a352":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_a352__;

/***/ }),

/***/ "a481":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var toInteger = __webpack_require__("4588");
var advanceStringIndex = __webpack_require__("0390");
var regExpExec = __webpack_require__("5f1b");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "b0c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("520a");
__webpack_require__("5ca1")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c649":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return insertNodeAt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return camelize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return console; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return removeNode; });
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a481");
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0__);


function getConsole() {
  if (typeof window !== "undefined") {
    return window.console;
  }

  return global.console;
}

var console = getConsole();

function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

var regex = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(regex, function (_, c) {
    return c ? c.toUpperCase() : "";
  });
});

function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node);
  }
}

function insertNodeAt(fatherNode, node, position) {
  var refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
  fatherNode.insertBefore(node, refNode);
}


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "c8ba":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d2c8":
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__("aae3");
var defined = __webpack_require__("be13");

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "f559":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__("5ca1");
var toLength = __webpack_require__("9def");
var context = __webpack_require__("d2c8");
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__("5147")(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "f751":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("5ca1");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("7333") });


/***/ }),

/***/ "fa5b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("f751");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.starts-with.js
var es6_string_starts_with = __webpack_require__("f559");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.array.includes.js
var es7_array_includes = __webpack_require__("6762");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.includes.js
var es6_string_includes = __webpack_require__("2fdb");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: external {"commonjs":"sortablejs","commonjs2":"sortablejs","amd":"sortablejs","root":"Sortable"}
var external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_ = __webpack_require__("a352");
var external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_);

// EXTERNAL MODULE: ./src/util/helper.js
var helper = __webpack_require__("c649");

// CONCATENATED MODULE: ./src/vuedraggable.js












function buildAttribute(object, propName, value) {
  if (value === undefined) {
    return object;
  }

  object = object || {};
  object[propName] = value;
  return object;
}

function computeVmIndex(vnodes, element) {
  return vnodes.map(function (elt) {
    return elt.elm;
  }).indexOf(element);
}

function _computeIndexes(slots, children, isTransition, footerOffset) {
  if (!slots) {
    return [];
  }

  var elmFromNodes = slots.map(function (elt) {
    return elt.elm;
  });
  var footerIndex = children.length - footerOffset;

  var rawIndexes = _toConsumableArray(children).map(function (elt, idx) {
    return idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt);
  });

  return isTransition ? rawIndexes.filter(function (ind) {
    return ind !== -1;
  }) : rawIndexes;
}

function emit(evtName, evtData) {
  var _this = this;

  this.$nextTick(function () {
    return _this.$emit(evtName.toLowerCase(), evtData);
  });
}

function delegateAndEmit(evtName) {
  var _this2 = this;

  return function (evtData) {
    if (_this2.realList !== null) {
      _this2["onDrag" + evtName](evtData);
    }

    emit.call(_this2, evtName, evtData);
  };
}

function isTransitionName(name) {
  return ["transition-group", "TransitionGroup"].includes(name);
}

function vuedraggable_isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false;
  }

  var _slots = _slicedToArray(slots, 1),
      componentOptions = _slots[0].componentOptions;

  if (!componentOptions) {
    return false;
  }

  return isTransitionName(componentOptions.tag);
}

function getSlot(slot, scopedSlot, key) {
  return slot[key] || (scopedSlot[key] ? scopedSlot[key]() : undefined);
}

function computeChildrenAndOffsets(children, slot, scopedSlot) {
  var headerOffset = 0;
  var footerOffset = 0;
  var header = getSlot(slot, scopedSlot, "header");

  if (header) {
    headerOffset = header.length;
    children = children ? [].concat(_toConsumableArray(header), _toConsumableArray(children)) : _toConsumableArray(header);
  }

  var footer = getSlot(slot, scopedSlot, "footer");

  if (footer) {
    footerOffset = footer.length;
    children = children ? [].concat(_toConsumableArray(children), _toConsumableArray(footer)) : _toConsumableArray(footer);
  }

  return {
    children: children,
    headerOffset: headerOffset,
    footerOffset: footerOffset
  };
}

function getComponentAttributes($attrs, componentData) {
  var attributes = null;

  var update = function update(name, value) {
    attributes = buildAttribute(attributes, name, value);
  };

  var attrs = Object.keys($attrs).filter(function (key) {
    return key === "id" || key.startsWith("data-");
  }).reduce(function (res, key) {
    res[key] = $attrs[key];
    return res;
  }, {});
  update("attrs", attrs);

  if (!componentData) {
    return attributes;
  }

  var on = componentData.on,
      props = componentData.props,
      componentDataAttrs = componentData.attrs;
  update("on", on);
  update("props", props);
  Object.assign(attributes.attrs, componentDataAttrs);
  return attributes;
}

var eventsListened = ["Start", "Add", "Remove", "Update", "End"];
var eventsToEmit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
var readonlyProperties = ["Move"].concat(eventsListened, eventsToEmit).map(function (evt) {
  return "on" + evt;
});
var draggingElement = null;
var props = {
  options: Object,
  list: {
    type: Array,
    required: false,
    default: null
  },
  value: {
    type: Array,
    required: false,
    default: null
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: false
  },
  clone: {
    type: Function,
    default: function _default(original) {
      return original;
    }
  },
  element: {
    type: String,
    default: "div"
  },
  tag: {
    type: String,
    default: null
  },
  move: {
    type: Function,
    default: null
  },
  componentData: {
    type: Object,
    required: false,
    default: null
  }
};
var draggableComponent = {
  name: "draggable",
  inheritAttrs: false,
  props: props,
  data: function data() {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false
    };
  },
  render: function render(h) {
    var slots = this.$slots.default;
    this.transitionMode = vuedraggable_isTransition(slots);

    var _computeChildrenAndOf = computeChildrenAndOffsets(slots, this.$slots, this.$scopedSlots),
        children = _computeChildrenAndOf.children,
        headerOffset = _computeChildrenAndOf.headerOffset,
        footerOffset = _computeChildrenAndOf.footerOffset;

    this.headerOffset = headerOffset;
    this.footerOffset = footerOffset;
    var attributes = getComponentAttributes(this.$attrs, this.componentData);
    return h(this.getTag(), attributes, children);
  },
  created: function created() {
    if (this.list !== null && this.value !== null) {
      helper["b" /* console */].error("Value and list props are mutually exclusive! Please set one or another.");
    }

    if (this.element !== "div") {
      helper["b" /* console */].warn("Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props");
    }

    if (this.options !== undefined) {
      helper["b" /* console */].warn("Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props");
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    this.noneFunctionalComponentMode = this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase() && !this.getIsFunctional();

    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error("Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ".concat(this.getTag()));
    }

    var optionsAdded = {};
    eventsListened.forEach(function (elt) {
      optionsAdded["on" + elt] = delegateAndEmit.call(_this3, elt);
    });
    eventsToEmit.forEach(function (elt) {
      optionsAdded["on" + elt] = emit.bind(_this3, elt);
    });
    var attributes = Object.keys(this.$attrs).reduce(function (res, key) {
      res[Object(helper["a" /* camelize */])(key)] = _this3.$attrs[key];
      return res;
    }, {});
    var options = Object.assign({}, this.options, attributes, optionsAdded, {
      onMove: function onMove(evt, originalEvent) {
        return _this3.onDragMove(evt, originalEvent);
      }
    });
    !("draggable" in options) && (options.draggable = ">*");
    this._sortable = new external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default.a(this.rootContainer, options);
    this.computeIndexes();
  },
  beforeDestroy: function beforeDestroy() {
    if (this._sortable !== undefined) this._sortable.destroy();
  },
  computed: {
    rootContainer: function rootContainer() {
      return this.transitionMode ? this.$el.children[0] : this.$el;
    },
    realList: function realList() {
      return this.list ? this.list : this.value;
    }
  },
  watch: {
    options: {
      handler: function handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true
    },
    $attrs: {
      handler: function handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true
    },
    realList: function realList() {
      this.computeIndexes();
    }
  },
  methods: {
    getIsFunctional: function getIsFunctional() {
      var fnOptions = this._vnode.fnOptions;
      return fnOptions && fnOptions.functional;
    },
    getTag: function getTag() {
      return this.tag || this.element;
    },
    updateOptions: function updateOptions(newOptionValue) {
      for (var property in newOptionValue) {
        var value = Object(helper["a" /* camelize */])(property);

        if (readonlyProperties.indexOf(value) === -1) {
          this._sortable.option(value, newOptionValue[property]);
        }
      }
    },
    getChildrenNodes: function getChildrenNodes() {
      if (this.noneFunctionalComponentMode) {
        return this.$children[0].$slots.default;
      }

      var rawNodes = this.$slots.default;
      return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes;
    },
    computeIndexes: function computeIndexes() {
      var _this4 = this;

      this.$nextTick(function () {
        _this4.visibleIndexes = _computeIndexes(_this4.getChildrenNodes(), _this4.rootContainer.children, _this4.transitionMode, _this4.footerOffset);
      });
    },
    getUnderlyingVm: function getUnderlyingVm(htmlElt) {
      var index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);

      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null;
      }

      var element = this.realList[index];
      return {
        index: index,
        element: element
      };
    },
    getUnderlyingPotencialDraggableComponent: function getUnderlyingPotencialDraggableComponent(_ref) {
      var vue = _ref.__vue__;

      if (!vue || !vue.$options || !isTransitionName(vue.$options._componentTag)) {
        if (!("realList" in vue) && vue.$children.length === 1 && "realList" in vue.$children[0]) return vue.$children[0];
        return vue;
      }

      return vue.$parent;
    },
    emitChanges: function emitChanges(evt) {
      var _this5 = this;

      this.$nextTick(function () {
        _this5.$emit("change", evt);
      });
    },
    alterList: function alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }

      var newList = _toConsumableArray(this.value);

      onList(newList);
      this.$emit("input", newList);
    },
    spliceList: function spliceList() {
      var _arguments = arguments;

      var spliceList = function spliceList(list) {
        return list.splice.apply(list, _toConsumableArray(_arguments));
      };

      this.alterList(spliceList);
    },
    updatePosition: function updatePosition(oldIndex, newIndex) {
      var updatePosition = function updatePosition(list) {
        return list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
      };

      this.alterList(updatePosition);
    },
    getRelatedContextFromMoveEvent: function getRelatedContextFromMoveEvent(_ref2) {
      var to = _ref2.to,
          related = _ref2.related;
      var component = this.getUnderlyingPotencialDraggableComponent(to);

      if (!component) {
        return {
          component: component
        };
      }

      var list = component.realList;
      var context = {
        list: list,
        component: component
      };

      if (to !== related && list && component.getUnderlyingVm) {
        var destination = component.getUnderlyingVm(related);

        if (destination) {
          return Object.assign(destination, context);
        }
      }

      return context;
    },
    getVmIndex: function getVmIndex(domIndex) {
      var indexes = this.visibleIndexes;
      var numberIndexes = indexes.length;
      return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
    },
    getComponent: function getComponent() {
      return this.$slots.default[0].componentInstance;
    },
    resetTransitionData: function resetTransitionData(index) {
      if (!this.noTransitionOnDrag || !this.transitionMode) {
        return;
      }

      var nodes = this.getChildrenNodes();
      nodes[index].data = null;
      var transitionContainer = this.getComponent();
      transitionContainer.children = [];
      transitionContainer.kept = undefined;
    },
    onDragStart: function onDragStart(evt) {
      this.context = this.getUnderlyingVm(evt.item);
      evt.item._underlying_vm_ = this.clone(this.context.element);
      draggingElement = evt.item;
    },
    onDragAdd: function onDragAdd(evt) {
      var element = evt.item._underlying_vm_;

      if (element === undefined) {
        return;
      }

      Object(helper["d" /* removeNode */])(evt.item);
      var newIndex = this.getVmIndex(evt.newIndex);
      this.spliceList(newIndex, 0, element);
      this.computeIndexes();
      var added = {
        element: element,
        newIndex: newIndex
      };
      this.emitChanges({
        added: added
      });
    },
    onDragRemove: function onDragRemove(evt) {
      Object(helper["c" /* insertNodeAt */])(this.rootContainer, evt.item, evt.oldIndex);

      if (evt.pullMode === "clone") {
        Object(helper["d" /* removeNode */])(evt.clone);
        return;
      }

      var oldIndex = this.context.index;
      this.spliceList(oldIndex, 1);
      var removed = {
        element: this.context.element,
        oldIndex: oldIndex
      };
      this.resetTransitionData(oldIndex);
      this.emitChanges({
        removed: removed
      });
    },
    onDragUpdate: function onDragUpdate(evt) {
      Object(helper["d" /* removeNode */])(evt.item);
      Object(helper["c" /* insertNodeAt */])(evt.from, evt.item, evt.oldIndex);
      var oldIndex = this.context.index;
      var newIndex = this.getVmIndex(evt.newIndex);
      this.updatePosition(oldIndex, newIndex);
      var moved = {
        element: this.context.element,
        oldIndex: oldIndex,
        newIndex: newIndex
      };
      this.emitChanges({
        moved: moved
      });
    },
    updateProperty: function updateProperty(evt, propertyName) {
      evt.hasOwnProperty(propertyName) && (evt[propertyName] += this.headerOffset);
    },
    computeFutureIndex: function computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0;
      }

      var domChildren = _toConsumableArray(evt.to.children).filter(function (el) {
        return el.style["display"] !== "none";
      });

      var currentDOMIndex = domChildren.indexOf(evt.related);
      var currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
      var draggedInList = domChildren.indexOf(draggingElement) !== -1;
      return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
    },
    onDragMove: function onDragMove(evt, originalEvent) {
      var onMove = this.move;

      if (!onMove || !this.realList) {
        return true;
      }

      var relatedContext = this.getRelatedContextFromMoveEvent(evt);
      var draggedContext = this.context;
      var futureIndex = this.computeFutureIndex(relatedContext, evt);
      Object.assign(draggedContext, {
        futureIndex: futureIndex
      });
      var sendEvt = Object.assign({}, evt, {
        relatedContext: relatedContext,
        draggedContext: draggedContext
      });
      return onMove(sendEvt, originalEvent);
    },
    onDragEnd: function onDragEnd() {
      this.computeIndexes();
      draggingElement = null;
    }
  }
};

if (typeof window !== "undefined" && "Vue" in window) {
  window.Vue.component("draggable", draggableComponent);
}

/* harmony default export */ var vuedraggable = (draggableComponent);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (vuedraggable);



/***/ })

/******/ })["default"];
});
//# sourceMappingURL=vuedraggable.umd.js.map

/***/ }),

/***/ "338e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "3460":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("7ee3");
var descriptor = __webpack_require__("5edc");
var setToStringTag = __webpack_require__("bac3");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("065d")(IteratorPrototype, __webpack_require__("839a")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "3471":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("1b96");
var defined = __webpack_require__("3ab0");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "348f":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("690e")(false);
// imports


// module
exports.push([module.i, ".fm-uplaod-container .is-disabled{position:relative}.fm-uplaod-container .is-disabled:after{position:absolute;top:0;bottom:0;left:0;right:0;content:\"\";display:block;cursor:not-allowed}.fm-uplaod-container .upload-file{margin:0 10px 10px 0;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow:hidden;background-color:#fff;border:1px solid #c0ccda;border-radius:6px;-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;vertical-align:top}.fm-uplaod-container .upload-file:hover .uplaod-action{display:-webkit-box;display:-ms-flexbox;display:flex}.fm-uplaod-container .upload-file .uplaod-action{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.6);display:none;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.fm-uplaod-container .upload-file .uplaod-action i{color:#fff;cursor:pointer;margin:0 5px}.fm-uplaod-container .upload-file.is-success .item-status{position:absolute;right:-15px;top:-6px;width:40px;height:24px;background:#13ce66;text-align:center;-webkit-transform:rotate(45deg);transform:rotate(45deg);-webkit-box-shadow:0 0 1pc 1px rgba(0,0,0,.2);box-shadow:0 0 1pc 1px rgba(0,0,0,.2)}.fm-uplaod-container .upload-file.is-success .item-status>i{font-size:12px;margin-top:11px;color:#fff;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.fm-uplaod-container .upload-file.uploading:before{display:block;content:\"\";position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.3)}.fm-uplaod-container .upload-file .upload-progress{position:absolute}.fm-uplaod-container .upload-file .upload-progress .el-progress__text{color:#fff;font-size:16px!important}.fm-uplaod-container .upload-file img{max-width:100%;max-height:100%;vertical-align:middle}.fm-uplaod-container .el-upload--picture-card{position:relative;overflow:hidden}.fm-uplaod-container .el-upload--picture-card .el-icon-plus{position:absolute;top:50%;left:50%}.fm-uplaod-container .upload-input{position:absolute;top:0;left:0;right:0;bottom:0;display:block;opacity:0;cursor:pointer}.fm-uplaod-container .drag-img-list{display:inline}.fm-uplaod-container .drag-img-list .ghost{position:relative}.fm-uplaod-container .drag-img-list .ghost:after{width:100%;height:100%;display:block;content:\"\";background:#fbfdff;position:absolute;top:0;bottom:0;left:0;right:0;border:1px dashed #3bb3c2}.fm-uplaod-container .drag-img-list>div{cursor:move}.viewer-container{z-index:9999!important}", ""]);

// exports


/***/ }),

/***/ "35d4":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "3783":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/iconfont.f0e930ef.svg";

/***/ }),

/***/ "37b4":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("0cc5");
var createDesc = __webpack_require__("d48a");
var toIObject = __webpack_require__("8a8a");
var toPrimitive = __webpack_require__("5d61");
var has = __webpack_require__("dce3");
var IE8_DOM_DEFINE = __webpack_require__("4a92");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("5e9e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "37fe":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "383f":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("582e");
var global = __webpack_require__("a4cf");
var hide = __webpack_require__("0cb2");
var Iterators = __webpack_require__("43ce");
var TO_STRING_TAG = __webpack_require__("eeeb")('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),

/***/ "3a08":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "3a0d":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("baa7")('keys');
var uid = __webpack_require__("d8b3");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "3a4c":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("4fd4");
var toIObject = __webpack_require__("3471");
var arrayIndexOf = __webpack_require__("52a4")(false);
var IE_PROTO = __webpack_require__("3a0d")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "3ab0":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "3abc":
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),

/***/ "3b70":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "3bc4":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("f4aa");
__webpack_require__("273d");
__webpack_require__("6239");
__webpack_require__("a96d");
module.exports = __webpack_require__("ce99").Symbol;


/***/ }),

/***/ "3bce":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5a9ff1a3-vue-loader-template"}!./node_modules/_vue-loader@15.9.8@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/Upload/index.vue?vue&type=template&id=676b2a28&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"fm-uplaod-container",attrs:{"id":_vm.uploadId}},[_c('draggable',_vm._b({staticClass:"drag-img-list",attrs:{"no-transition-on-drag":true},model:{value:(_vm.fileList),callback:function ($$v) {_vm.fileList=$$v},expression:"fileList"}},'draggable',{group: _vm.uploadId, ghostClass: 'ghost', animation: 200},false),_vm._l((_vm.fileList),function(item){return _c('div',{key:item.key,staticClass:"upload-file",class:{uploading: item.status=='uploading', 'is-success': item.status=='success', 'is-diabled': _vm.disabled},style:({width: _vm.width+'px', height: _vm.height+'px'}),attrs:{"id":item.key}},[_c('img',{attrs:{"src":item.url}}),(item.status=='uploading')?_c('el-progress',{staticClass:"upload-progress",attrs:{"width":_vm.miniWidth*0.9,"type":"circle","percentage":item.percent}}):_vm._e(),(item.status=='success')?_c('label',{staticClass:"item-status"},[_c('i',{staticClass:"el-icon-upload-success el-icon-check"})]):_vm._e(),(!_vm.disabled)?_c('div',{staticClass:"uplaod-action",style:({height: _vm.miniWidth / 4 + 'px'})},[_c('i',{staticClass:"iconfont icon-tupianyulan",style:({'font-size': _vm.miniWidth/8+'px'}),attrs:{"title":_vm.$t('fm.upload.preview')},on:{"click":function($event){return _vm.handlePreviewFile(item.key)}}}),(_vm.isEdit)?_c('i',{staticClass:"iconfont icon-sync1",style:({'font-size': _vm.miniWidth/8+'px'}),attrs:{"title":_vm.$t('fm.upload.edit')},on:{"click":function($event){return _vm.handleEdit(item.key)}}}):_vm._e(),(_vm.isDelete && _vm.fileList.length > _vm.min)?_c('i',{staticClass:"iconfont icon-delete",style:({'font-size': _vm.miniWidth/8+'px'}),attrs:{"title":_vm.$t('fm.upload.delete')},on:{"click":function($event){return _vm.handleRemove(item.key)}}}):_vm._e()]):_vm._e()],1)}),0),_c('div',{directives:[{name:"show",rawName:"v-show",value:((!_vm.isQiniu || (_vm.isQiniu && _vm.token)) && _vm.fileList.length < _vm.length),expression:"(!isQiniu || (isQiniu && token)) && fileList.length < length"}],staticClass:"el-upload el-upload--picture-card",class:{'is-disabled': _vm.disabled},style:({width: _vm.width+'px', height: _vm.height+'px'}),on:{"click":function($event){if($event.target !== $event.currentTarget){ return null; }return _vm.handleAdd.apply(null, arguments)}}},[_c('i',{staticClass:"el-icon-plus",style:({fontSize:_vm.miniWidth/4+'px',marginTop: (-_vm.miniWidth/8)+'px', marginLeft: (-_vm.miniWidth/8)+'px'}),on:{"click":function($event){if($event.target !== $event.currentTarget){ return null; }return _vm.handleAdd.apply(null, arguments)}}}),(_vm.multiple)?_c('input',{ref:"uploadInput",staticClass:"el-upload__input upload-input",style:({width: 0, height: 0}),attrs:{"accept":"image/*","multiple":"","type":"file","name":"file"},on:{"change":_vm.handleChange}}):_c('input',{ref:"uploadInput",staticClass:"el-upload__input upload-input",style:({width:0, height: 0}),attrs:{"accept":"image/*","type":"file","name":"file"},on:{"change":_vm.handleChange}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/Upload/index.vue?vue&type=template&id=676b2a28&

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es7.object.get-own-property-descriptors.js
var es7_object_get_own_property_descriptors = __webpack_require__("ac67");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("1bc7");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("25ba");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("32ea");

// EXTERNAL MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__("c1a2");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.find-index.js
var es6_array_find_index = __webpack_require__("a7e5");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("e680");

// EXTERNAL MODULE: ./node_modules/_viewerjs@1.10.1@viewerjs/dist/viewer.js
var viewer = __webpack_require__("407a");
var viewer_default = /*#__PURE__*/__webpack_require__.n(viewer);

// EXTERNAL MODULE: ./node_modules/_vuedraggable@2.24.3@vuedraggable/dist/vuedraggable.umd.js
var vuedraggable_umd = __webpack_require__("3335");
var vuedraggable_umd_default = /*#__PURE__*/__webpack_require__.n(vuedraggable_umd);

// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/errors/index.js
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var QiniuErrorName;
(function (QiniuErrorName) {
    // 输入错误
    QiniuErrorName["InvalidFile"] = "InvalidFile";
    QiniuErrorName["InvalidToken"] = "InvalidToken";
    QiniuErrorName["InvalidMetadata"] = "InvalidMetadata";
    QiniuErrorName["InvalidChunkSize"] = "InvalidChunkSize";
    QiniuErrorName["InvalidCustomVars"] = "InvalidCustomVars";
    QiniuErrorName["NotAvailableUploadHost"] = "NotAvailableUploadHost";
    // 缓存相关
    QiniuErrorName["ReadCacheFailed"] = "ReadCacheFailed";
    QiniuErrorName["InvalidCacheData"] = "InvalidCacheData";
    QiniuErrorName["WriteCacheFailed"] = "WriteCacheFailed";
    QiniuErrorName["RemoveCacheFailed"] = "RemoveCacheFailed";
    // 图片压缩模块相关
    QiniuErrorName["GetCanvasContextFailed"] = "GetCanvasContextFailed";
    QiniuErrorName["UnsupportedFileType"] = "UnsupportedFileType";
    // 运行环境相关
    QiniuErrorName["FileReaderReadFailed"] = "FileReaderReadFailed";
    QiniuErrorName["NotAvailableXMLHttpRequest"] = "NotAvailableXMLHttpRequest";
    QiniuErrorName["InvalidProgressEventTarget"] = "InvalidProgressEventTarget";
    // 请求错误
    QiniuErrorName["RequestError"] = "RequestError";
})(QiniuErrorName || (QiniuErrorName = {}));
var QiniuError = /** @class */ (function () {
    function QiniuError(name, message) {
        this.name = name;
        this.message = message;
        this.stack = new Error().stack;
    }
    return QiniuError;
}());

var QiniuRequestError = /** @class */ (function (_super) {
    __extends(QiniuRequestError, _super);
    function QiniuRequestError(code, reqId, message, data) {
        var _this = _super.call(this, QiniuErrorName.RequestError, message) || this;
        _this.code = code;
        _this.reqId = reqId;
        /**
         * @description 标记当前的 error 类型是一个 QiniuRequestError
         * @deprecated 下一个大版本将会移除，不推荐使用，推荐直接使用 instanceof 进行判断
         */
        _this.isRequestError = true;
        _this.data = data;
        return _this;
    }
    return QiniuRequestError;
}(QiniuError));

/**
 * @description 由于跨域、证书错误、断网、host 解析失败、系统拦截等原因导致的错误
 */
var QiniuNetworkError = /** @class */ (function (_super) {
    __extends(QiniuNetworkError, _super);
    function QiniuNetworkError(message, reqId) {
        if (reqId === void 0) { reqId = ''; }
        return _super.call(this, 0, reqId, message) || this;
    }
    return QiniuNetworkError;
}(QiniuRequestError));

//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/utils/pool.js
var Pool = /** @class */ (function () {
    function Pool(runTask, limit) {
        this.runTask = runTask;
        this.limit = limit;
        this.queue = [];
        this.processing = [];
    }
    Pool.prototype.enqueue = function (task) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.queue.push({
                task: task,
                resolve: resolve,
                reject: reject
            });
            _this.check();
        });
    };
    Pool.prototype.run = function (item) {
        var _this = this;
        this.queue = this.queue.filter(function (v) { return v !== item; });
        this.processing.push(item);
        this.runTask(item.task).then(function () {
            _this.processing = _this.processing.filter(function (v) { return v !== item; });
            item.resolve();
            _this.check();
        }, function (err) { return item.reject(err); });
    };
    Pool.prototype.check = function () {
        var _this = this;
        var processingNum = this.processing.length;
        var availableNum = this.limit - processingNum;
        this.queue.slice(0, availableNum).forEach(function (item) {
            _this.run(item);
        });
    };
    return Pool;
}());

//# sourceMappingURL=pool.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/utils/observable.js
var observable_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/** 表示可清理的资源，比如 Observable 的执行 */
var Subscription = /** @class */ (function () {
    function Subscription() {
        /** 用来标示该 Subscription 是否被取消订阅的标示位 */
        this.closed = false;
    }
    /** 取消 observer 的订阅 */
    Subscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    };
    /** 添加一个 tear down 在该 Subscription 的 unsubscribe() 期间调用 */
    Subscription.prototype.add = function (teardown) {
        this._unsubscribe = teardown;
    };
    return Subscription;
}());
/**
 * 实现 Observer 接口并且继承 Subscription 类，Observer 是消费 Observable 值的公有 API
 * 所有 Observers 都转化成了 Subscriber，以便提供类似 Subscription 的能力，比如 unsubscribe
*/
var Subscriber = /** @class */ (function (_super) {
    observable_extends(Subscriber, _super);
    function Subscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (observerOrNext && typeof observerOrNext === 'object') {
            _this.destination = observerOrNext;
        }
        else {
            _this.destination = __assign(__assign(__assign({}, observerOrNext && { next: observerOrNext }), error && { error: error }), complete && { complete: complete });
        }
        return _this;
    }
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped && this.destination.next) {
            this.destination.next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped && this.destination.error) {
            this.isStopped = true;
            this.destination.error(err);
        }
    };
    Subscriber.prototype.complete = function (result) {
        if (!this.isStopped && this.destination.complete) {
            this.isStopped = true;
            this.destination.complete(result);
        }
    };
    return Subscriber;
}(Subscription));

/** 可观察对象，当前的上传事件的集合 */
var Observable = /** @class */ (function () {
    function Observable(_subscribe) {
        this._subscribe = _subscribe;
    }
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var sink = new Subscriber(observerOrNext, error, complete);
        sink.add(this._subscribe(sink));
        return sink;
    };
    return Observable;
}());

//# sourceMappingURL=observable.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/utils/base64.js
/* eslint-disable */
// https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_encode.js
function utf8Encode(argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // +   improved by: kirilloid
    // +   bugfixed by: kirilloid
    // *     example 1: this.utf8Encode('Kevin van Zonneveld')
    // *     returns 1: 'Kevin van Zonneveld'
    if (argString === null || typeof argString === 'undefined') {
        return '';
    }
    var string = argString + ''; // .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    var utftext = '', start, end, stringl = 0;
    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;
        if (c1 < 128) {
            end++;
        }
        else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        }
        else if ((c1 & 0xf800 ^ 0xd800) > 0) {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        else {
            // surrogate pairs
            if ((c1 & 0xfc00 ^ 0xd800) > 0) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xfc00 ^ 0xdc00) > 0) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3ff) << 10) + (c2 & 0x3ff) + 0x10000;
            enc = String.fromCharCode((c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }
    if (end > start) {
        utftext += string.slice(start, stringl);
    }
    return utftext;
}
// https://github.com/locutusjs/locutus/blob/master/src/php/xml/utf8_decode.js
function utf8Decode(strData) {
    // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/utf8_decode/
    // original by: Webtoolkit.info (https://www.webtoolkit.info/)
    //    input by: Aman Gupta
    //    input by: Brett Zamir (https://brett-zamir.me)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Norman "zEh" Fuchs
    // bugfixed by: hitwork
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: kirilloid
    // bugfixed by: w35l3y (https://www.wesley.eti.br)
    //   example 1: utf8_decode('Kevin van Zonneveld')
    //   returns 1: 'Kevin van Zonneveld'
    var tmpArr = [];
    var i = 0;
    var c1 = 0;
    var seqlen = 0;
    strData += '';
    while (i < strData.length) {
        c1 = strData.charCodeAt(i) & 0xFF;
        seqlen = 0;
        // https://en.wikipedia.org/wiki/UTF-8#Codepage_layout
        if (c1 <= 0xBF) {
            c1 = (c1 & 0x7F);
            seqlen = 1;
        }
        else if (c1 <= 0xDF) {
            c1 = (c1 & 0x1F);
            seqlen = 2;
        }
        else if (c1 <= 0xEF) {
            c1 = (c1 & 0x0F);
            seqlen = 3;
        }
        else {
            c1 = (c1 & 0x07);
            seqlen = 4;
        }
        for (var ai = 1; ai < seqlen; ++ai) {
            c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F));
        }
        if (seqlen === 4) {
            c1 -= 0x10000;
            tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)));
            tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
        }
        else {
            tmpArr.push(String.fromCharCode(c1));
        }
        i += seqlen;
    }
    return tmpArr.join('');
}
function base64Encode(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: this.utf8Encode
    // *     example 1: this.base64Encode('Kevin van Zonneveld')
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    // if (typeof this.window['atob'] == 'function') {
    //    return atob(data)
    // }
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];
    if (!data) {
        return data;
    }
    data = utf8Encode(data + '');
    do {
        // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);
        bits = (o1 << 16) | (o2 << 8) | o3;
        h1 = (bits >> 18) & 0x3f;
        h2 = (bits >> 12) & 0x3f;
        h3 = (bits >> 6) & 0x3f;
        h4 = bits & 0x3f;
        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] =
            b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
    enc = tmp_arr.join('');
    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }
    return enc;
}
function base64Decode(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==')
    // *     returns 1: 'Kevin van Zonneveld'
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    // if (typeof this.window['atob'] == 'function') {
    //    return atob(data)
    // }
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = '', tmp_arr = [];
    if (!data) {
        return data;
    }
    data += '';
    do { // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        if (h3 === 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        }
        else if (h4 === 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        }
        else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);
    dec = tmp_arr.join('');
    return utf8Decode(dec);
}
function urlSafeBase64Encode(v) {
    v = base64Encode(v);
    // 参考 https://tools.ietf.org/html/rfc4648#section-5
    return v.replace(/\//g, '_').replace(/\+/g, '-');
}
function urlSafeBase64Decode(v) {
    v = v.replace(/_/g, '/').replace(/-/g, '+');
    return base64Decode(v);
}
//# sourceMappingURL=base64.js.map
// EXTERNAL MODULE: ./node_modules/_spark-md5@3.0.2@spark-md5/spark-md5.js
var spark_md5 = __webpack_require__("d988");
var spark_md5_default = /*#__PURE__*/__webpack_require__.n(spark_md5);

// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/utils/helper.js
var helper_assign = (undefined && undefined.__assign) || function () {
    helper_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return helper_assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var MB = Math.pow(1024, 2);
// 文件分块
function getChunks(file, blockSize) {
    var chunkByteSize = blockSize * MB; // 转换为字节
    // 如果 chunkByteSize 比文件大，则直接取文件的大小
    if (chunkByteSize > file.size) {
        chunkByteSize = file.size;
    }
    else {
        // 因为最多 10000 chunk，所以如果 chunkSize 不符合则把每片 chunk 大小扩大两倍
        while (file.size > chunkByteSize * 10000) {
            chunkByteSize *= 2;
        }
    }
    var chunks = [];
    var count = Math.ceil(file.size / chunkByteSize);
    for (var i = 0; i < count; i++) {
        var chunk = file.slice(chunkByteSize * i, i === count - 1 ? file.size : chunkByteSize * (i + 1));
        chunks.push(chunk);
    }
    return chunks;
}
function isMetaDataValid(params) {
    return Object.keys(params).every(function (key) { return key.indexOf('x-qn-meta-') === 0; });
}
function isCustomVarsValid(params) {
    return Object.keys(params).every(function (key) { return key.indexOf('x:') === 0; });
}
function sum(list) {
    return list.reduce(function (data, loaded) { return data + loaded; }, 0);
}
function setLocalFileInfo(localKey, info, logger) {
    try {
        localStorage.setItem(localKey, JSON.stringify(info));
    }
    catch (err) {
        logger.warn(new QiniuError(QiniuErrorName.WriteCacheFailed, "setLocalFileInfo failed: " + localKey));
    }
}
function createLocalKey(name, key, size) {
    var localKey = key == null ? '_' : "_key_" + key + "_";
    return "qiniu_js_sdk_upload_file_name_" + name + localKey + "size_" + size;
}
function removeLocalFileInfo(localKey, logger) {
    try {
        localStorage.removeItem(localKey);
    }
    catch (err) {
        logger.warn(new QiniuError(QiniuErrorName.RemoveCacheFailed, "removeLocalFileInfo failed. key: " + localKey));
    }
}
function getLocalFileInfo(localKey, logger) {
    var localInfoString = null;
    try {
        localInfoString = localStorage.getItem(localKey);
    }
    catch (_a) {
        logger.warn(new QiniuError(QiniuErrorName.ReadCacheFailed, "getLocalFileInfo failed. key: " + localKey));
    }
    if (localInfoString == null) {
        return null;
    }
    var localInfo = null;
    try {
        localInfo = JSON.parse(localInfoString);
    }
    catch (_b) {
        // 本地信息已被破坏，直接删除
        removeLocalFileInfo(localKey, logger);
        logger.warn(new QiniuError(QiniuErrorName.InvalidCacheData, "getLocalFileInfo failed to parse. key: " + localKey));
    }
    return localInfo;
}
function getAuthHeaders(token) {
    var auth = 'UpToken ' + token;
    return { Authorization: auth };
}
function getHeadersForChunkUpload(token) {
    var header = getAuthHeaders(token);
    return helper_assign({ 'content-type': 'application/octet-stream' }, header);
}
function getHeadersForMkFile(token) {
    var header = getAuthHeaders(token);
    return helper_assign({ 'content-type': 'application/json' }, header);
}
function createXHR() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
        return new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    throw new QiniuError(QiniuErrorName.NotAvailableXMLHttpRequest, 'the current environment does not support.');
}
function computeMd5(data) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, spark;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readAsArrayBuffer(data)];
                case 1:
                    buffer = _a.sent();
                    spark = new spark_md5_default.a.ArrayBuffer();
                    spark.append(buffer);
                    return [2 /*return*/, spark.end()];
            }
        });
    });
}
function readAsArrayBuffer(data) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        // evt 类型目前存在问题 https://github.com/Microsoft/TypeScript/issues/4163
        reader.onload = function (evt) {
            if (evt.target) {
                var body = evt.target.result;
                resolve(body);
            }
            else {
                reject(new QiniuError(QiniuErrorName.InvalidProgressEventTarget, 'progress event target is undefined'));
            }
        };
        reader.onerror = function () {
            reject(new QiniuError(QiniuErrorName.FileReaderReadFailed, 'fileReader read failed'));
        };
        reader.readAsArrayBuffer(data);
    });
}
function request(url, options) {
    return new Promise(function (resolve, reject) {
        var xhr = createXHR();
        xhr.open(options.method, url);
        if (options.onCreate) {
            options.onCreate(xhr);
        }
        if (options.headers) {
            var headers_1 = options.headers;
            Object.keys(headers_1).forEach(function (k) {
                xhr.setRequestHeader(k, headers_1[k]);
            });
        }
        xhr.upload.addEventListener('progress', function (evt) {
            if (evt.lengthComputable && options.onProgress) {
                options.onProgress({
                    loaded: evt.loaded,
                    total: evt.total
                });
            }
        });
        xhr.onreadystatechange = function () {
            var responseText = xhr.responseText;
            if (xhr.readyState !== 4) {
                return;
            }
            var reqId = xhr.getResponseHeader('x-reqId') || '';
            if (xhr.status === 0) {
                // 发生 0 基本都是网络错误，常见的比如跨域、断网、host 解析失败、系统拦截等等
                reject(new QiniuNetworkError('network error.', reqId));
                return;
            }
            if (xhr.status !== 200) {
                var message = "xhr request failed, code: " + xhr.status;
                if (responseText) {
                    message += " response: " + responseText;
                }
                var data = void 0;
                try {
                    data = JSON.parse(responseText);
                }
                catch (_a) {
                    // 无需处理该错误、可能拿到非 json 格式的响应是预期的
                }
                reject(new QiniuRequestError(xhr.status, reqId, message, data));
                return;
            }
            try {
                resolve({
                    data: JSON.parse(responseText),
                    reqId: reqId
                });
            }
            catch (err) {
                reject(err);
            }
        };
        xhr.send(options.body);
    });
}
function getPortFromUrl(url) {
    if (url && url.match) {
        var groups = url.match(/(^https?)/);
        if (!groups) {
            return '';
        }
        var type = groups[1];
        groups = url.match(/^https?:\/\/([^:^/]*):(\d*)/);
        if (groups) {
            return groups[2];
        }
        if (type === 'http') {
            return '80';
        }
        return '443';
    }
    return '';
}
function getDomainFromUrl(url) {
    if (url && url.match) {
        var groups = url.match(/^https?:\/\/([^:^/]*)/);
        return groups ? groups[1] : '';
    }
    return '';
}
function getPutPolicy(token) {
    if (!token)
        throw new QiniuError(QiniuErrorName.InvalidToken, 'invalid token.');
    var segments = token.split(':');
    if (segments.length === 1)
        throw new QiniuError(QiniuErrorName.InvalidToken, 'invalid token segments.');
    // token 构造的差异参考：https://github.com/qbox/product/blob/master/kodo/auths/UpToken.md#admin-uptoken-authorization
    var assessKey = segments.length > 3 ? segments[1] : segments[0];
    if (!assessKey)
        throw new QiniuError(QiniuErrorName.InvalidToken, 'missing assess key field.');
    var putPolicy = null;
    try {
        putPolicy = JSON.parse(urlSafeBase64Decode(segments[segments.length - 1]));
    }
    catch (error) {
        throw new QiniuError(QiniuErrorName.InvalidToken, 'token parse failed.');
    }
    if (putPolicy == null) {
        throw new QiniuError(QiniuErrorName.InvalidToken, 'putPolicy is null.');
    }
    if (putPolicy.scope == null) {
        throw new QiniuError(QiniuErrorName.InvalidToken, 'scope field is null.');
    }
    var bucketName = putPolicy.scope.split(':')[0];
    if (!bucketName) {
        throw new QiniuError(QiniuErrorName.InvalidToken, 'resolve bucketName failed.');
    }
    return { assessKey: assessKey, bucketName: bucketName, scope: putPolicy.scope };
}
function createObjectURL(file) {
    var URL = window.URL || window.webkitURL || window.mozURL;
    // FIXME:  需要 revokeObjectURL
    return URL.createObjectURL(file);
}
//# sourceMappingURL=helper.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/config/region.js
var region_a;
/** 上传区域 */
var region = {
    z0: 'z0',
    z1: 'z1',
    z2: 'z2',
    na0: 'na0',
    as0: 'as0',
    cnEast2: 'cn-east-2'
};
/** 上传区域对应的 host */
var regionUphostMap = (region_a = {},
    region_a[region.z0] = {
        srcUphost: ['up.qiniup.com'],
        cdnUphost: ['upload.qiniup.com']
    },
    region_a[region.z1] = {
        srcUphost: ['up-z1.qiniup.com'],
        cdnUphost: ['upload-z1.qiniup.com']
    },
    region_a[region.z2] = {
        srcUphost: ['up-z2.qiniup.com'],
        cdnUphost: ['upload-z2.qiniup.com']
    },
    region_a[region.na0] = {
        srcUphost: ['up-na0.qiniup.com'],
        cdnUphost: ['upload-na0.qiniup.com']
    },
    region_a[region.as0] = {
        srcUphost: ['up-as0.qiniup.com'],
        cdnUphost: ['upload-as0.qiniup.com']
    },
    region_a[region.cnEast2] = {
        srcUphost: ['up-cn-east-2.qiniup.com'],
        cdnUphost: ['upload-cn-east-2.qiniup.com']
    },
    region_a);
//# sourceMappingURL=region.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/config/index.js

//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ./node_modules/_querystring-es3@0.2.1@querystring-es3/index.js
var _querystring_es3_0_2_1_querystring_es3 = __webpack_require__("5ee4");

// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/api/index.js
var api_assign = (undefined && undefined.__assign) || function () {
    api_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return api_assign.apply(this, arguments);
};
var api_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var api_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



function getUpHosts(accessKey, bucketName, protocol) {
    return api_awaiter(this, void 0, void 0, function () {
        var params, url;
        return api_generator(this, function (_a) {
            params = Object(_querystring_es3_0_2_1_querystring_es3["stringify"])({ ak: accessKey, bucket: bucketName });
            url = protocol + "://api.qiniu.com/v2/query?" + params;
            return [2 /*return*/, request(url, { method: 'GET' })];
        });
    });
}
/**
 * @param bucket 空间名
 * @param key 目标文件名
 * @param uploadInfo 上传信息
 */
function getBaseUrl(bucket, key, uploadInfo) {
    var url = uploadInfo.url, id = uploadInfo.id;
    return url + "/buckets/" + bucket + "/objects/" + (key != null ? urlSafeBase64Encode(key) : '~') + "/uploads/" + id;
}
/**
 * @param token 上传鉴权凭证
 * @param bucket 上传空间
 * @param key 目标文件名
 * @param uploadUrl 上传地址
 */
function initUploadParts(token, bucket, key, uploadUrl) {
    var url = uploadUrl + "/buckets/" + bucket + "/objects/" + (key != null ? urlSafeBase64Encode(key) : '~') + "/uploads";
    return request(url, {
        method: 'POST',
        headers: getAuthHeaders(token)
    });
}
/**
 * @param token 上传鉴权凭证
 * @param index 当前 chunk 的索引
 * @param uploadInfo 上传信息
 * @param options 请求参数
 */
function uploadChunk(token, key, index, uploadInfo, options) {
    var bucket = getPutPolicy(token).bucketName;
    var url = getBaseUrl(bucket, key, uploadInfo) + ("/" + index);
    return request(url, api_assign(api_assign({}, options), { method: 'PUT', headers: getHeadersForChunkUpload(token) }));
}
/**
 * @param token 上传鉴权凭证
 * @param key 目标文件名
 * @param uploadInfo 上传信息
 * @param options 请求参数
 */
function uploadComplete(token, key, uploadInfo, options) {
    var bucket = getPutPolicy(token).bucketName;
    var url = getBaseUrl(bucket, key, uploadInfo);
    return request(url, api_assign(api_assign({}, options), { method: 'POST', headers: getHeadersForMkFile(token) }));
}
/**
 * @param token 上传鉴权凭证
 * @param key 目标文件名
 * @param uploadInfo 上传信息
 */
function deleteUploadedChunks(token, key, uploadinfo) {
    var bucket = getPutPolicy(token).bucketName;
    var url = getBaseUrl(bucket, key, uploadinfo);
    return request(url, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
    });
}
/**
 * @param  {string} url
 * @param  {FormData} data
 * @param  {Partial<utils.RequestOptions>} options
 * @returns Promise
 * @description 直传接口
 */
function direct(url, data, options) {
    return request(url, api_assign({ method: 'POST', body: data }, options));
}
/**
 * @param  {UploadUrlConfig} config
 * @param  {string} token
 * @returns Promise
 * @description 获取上传 url
 */
function getUploadUrl(_config, token) {
    return api_awaiter(this, void 0, void 0, function () {
        var config, protocol, putPolicy, res, hosts;
        return api_generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = normalizeUploadConfig(_config);
                    protocol = config.upprotocol;
                    if (config.uphost.length > 0) {
                        return [2 /*return*/, protocol + "://" + config.uphost[0]];
                    }
                    putPolicy = getPutPolicy(token);
                    return [4 /*yield*/, getUpHosts(putPolicy.assessKey, putPolicy.bucketName, protocol)];
                case 1:
                    res = _a.sent();
                    hosts = res.data.up.acc.main;
                    return [2 /*return*/, protocol + "://" + hosts[0]];
            }
        });
    });
}
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/upload/base.js
var base_assign = (undefined && undefined.__assign) || function () {
    base_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return base_assign.apply(this, arguments);
};
var base_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var base_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};


var DEFAULT_CHUNK_SIZE = 4; // 单位 MB
// code 信息地址 https://developer.qiniu.com/kodo/3928/error-responses
var FREEZE_CODE_LIST = [0, 502, 503, 504, 599]; // 将会冻结当前 host 的 code
var RETRY_CODE_LIST = __spread(FREEZE_CODE_LIST, [612]); // 会进行重试的 code
var GB = Math.pow(1024, 3);
var base_Base = /** @class */ (function () {
    function Base(options, handlers, hostPool, logger) {
        this.hostPool = hostPool;
        this.logger = logger;
        this.aborted = false;
        this.retryCount = 0;
        this.xhrList = [];
        this.config = options.config;
        logger.info('config inited.', this.config);
        this.putExtra = base_assign({ fname: '' }, options.putExtra);
        logger.info('putExtra inited.', this.putExtra);
        this.key = options.key;
        this.file = options.file;
        this.token = options.token;
        this.onData = handlers.onData;
        this.onError = handlers.onError;
        this.onComplete = handlers.onComplete;
        try {
            var putPolicy = getPutPolicy(this.token);
            this.bucketName = putPolicy.bucketName;
            this.assessKey = putPolicy.assessKey;
        }
        catch (error) {
            logger.error('get putPolicy from token failed.', error);
            this.onError(error);
        }
    }
    // 检查并更新 upload host
    Base.prototype.checkAndUpdateUploadHost = function () {
        return base_awaiter(this, void 0, void 0, function () {
            var newHost;
            return base_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 从 hostPool 中获取一个可用的 host 挂载在 this
                        this.logger.info('get available upload host.');
                        return [4 /*yield*/, this.hostPool.getUp(this.assessKey, this.bucketName, this.config.upprotocol)];
                    case 1:
                        newHost = _a.sent();
                        if (newHost == null) {
                            throw new QiniuError(QiniuErrorName.NotAvailableUploadHost, 'no available upload host.');
                        }
                        if (this.uploadHost != null && this.uploadHost.host !== newHost.host) {
                            this.logger.warn("host switches from " + this.uploadHost.host + " to " + newHost.host + ".");
                        }
                        else {
                            this.logger.info("use host " + newHost.host + ".");
                        }
                        this.uploadHost = newHost;
                        return [2 /*return*/];
                }
            });
        });
    };
    // 检查并解冻当前的 host
    Base.prototype.checkAndUnfreezeHost = function () {
        this.logger.info('check unfreeze host.');
        if (this.uploadHost != null && this.uploadHost.isFrozen()) {
            this.logger.warn(this.uploadHost.host + " will be unfrozen.");
            this.uploadHost.unfreeze();
        }
    };
    // 检查并更新冻结当前的 host
    Base.prototype.checkAndFreezeHost = function (error) {
        this.logger.info('check freeze host.');
        if (error instanceof QiniuRequestError && this.uploadHost != null) {
            if (FREEZE_CODE_LIST.includes(error.code)) {
                this.logger.warn(this.uploadHost.host + " will be temporarily frozen.");
                this.uploadHost.freeze();
            }
        }
    };
    Base.prototype.handleError = function (error) {
        this.logger.error(error.message);
        this.onError(error);
    };
    /**
     * @returns Promise 返回结果与上传最终状态无关，状态信息请通过 [Subscriber] 获取。
     * @description 上传文件，状态信息请通过 [Subscriber] 获取。
     */
    Base.prototype.putFile = function () {
        return base_awaiter(this, void 0, void 0, function () {
            var result, err_1, reqId, code, notReachRetryCount, needRetry;
            return base_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.aborted = false;
                        if (!this.putExtra.fname) {
                            this.logger.info('use file.name as fname.');
                            this.putExtra.fname = this.file.name;
                        }
                        if (this.file.size > 10000 * GB) {
                            this.handleError(new QiniuError(QiniuErrorName.InvalidFile, 'file size exceed maximum value 10000G'));
                            return [2 /*return*/];
                        }
                        if (this.putExtra.customVars) {
                            if (!isCustomVarsValid(this.putExtra.customVars)) {
                                this.handleError(new QiniuError(QiniuErrorName.InvalidCustomVars, 
                                // FIXME: width => with
                                'customVars key should start width x:'));
                                return [2 /*return*/];
                            }
                        }
                        if (this.putExtra.metadata) {
                            if (!isMetaDataValid(this.putExtra.metadata)) {
                                this.handleError(new QiniuError(QiniuErrorName.InvalidMetadata, 'metadata key should start with x-qn-meta-'));
                                return [2 /*return*/];
                            }
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        this.uploadAt = new Date().getTime();
                        return [4 /*yield*/, this.checkAndUpdateUploadHost()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.run()];
                    case 3:
                        result = _a.sent();
                        this.onComplete(result.data);
                        this.checkAndUnfreezeHost();
                        this.sendLog(result.reqId, 200);
                        return [2 /*return*/];
                    case 4:
                        err_1 = _a.sent();
                        this.logger.error(err_1);
                        this.clear();
                        if (err_1 instanceof QiniuRequestError) {
                            reqId = this.aborted ? '' : err_1.reqId;
                            code = this.aborted ? -2 : err_1.code;
                            this.sendLog(reqId, code);
                            // 检查并冻结当前的 host
                            this.checkAndFreezeHost(err_1);
                            notReachRetryCount = ++this.retryCount <= this.config.retryCount;
                            needRetry = !this.aborted && RETRY_CODE_LIST.includes(err_1.code);
                            // 以下条件满足其中之一则会进行重新上传：
                            // 1. 满足 needRetry 的条件且 retryCount 不为 0
                            // 2. uploadId 无效时在 resume 里会清除本地数据，并且这里触发重新上传
                            if (needRetry && notReachRetryCount) {
                                this.logger.warn("error auto retry: " + this.retryCount + "/" + this.config.retryCount + ".");
                                this.putFile();
                                return [2 /*return*/];
                            }
                        }
                        this.onError(err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Base.prototype.clear = function () {
        this.logger.info('start cleaning all xhr.');
        this.xhrList.forEach(function (xhr) {
            xhr.onreadystatechange = null;
            xhr.abort();
        });
        this.logger.info('cleanup completed.');
        this.xhrList = [];
    };
    Base.prototype.stop = function () {
        this.logger.info('stop.');
        this.clear();
        this.aborted = true;
    };
    Base.prototype.addXhr = function (xhr) {
        this.xhrList.push(xhr);
    };
    Base.prototype.sendLog = function (reqId, code) {
        var _a, _b;
        this.logger.report({
            code: code,
            reqId: reqId,
            remoteIp: '',
            upType: 'jssdk-h5',
            size: this.file.size,
            time: Math.floor(this.uploadAt / 1000),
            port: getPortFromUrl((_a = this.uploadHost) === null || _a === void 0 ? void 0 : _a.getUrl()),
            host: getDomainFromUrl((_b = this.uploadHost) === null || _b === void 0 ? void 0 : _b.getUrl()),
            bytesSent: this.progress ? this.progress.total.loaded : 0,
            duration: Math.floor((new Date().getTime() - this.uploadAt) / 1000)
        });
    };
    Base.prototype.getProgressInfoItem = function (loaded, size, fromCache) {
        return base_assign({ size: size,
            loaded: loaded, percent: loaded / size * 100 }, (fromCache == null ? {} : { fromCache: fromCache }));
    };
    return Base;
}());
/* harmony default export */ var base = (base_Base);
//# sourceMappingURL=base.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/upload/resume.js
var resume_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var resume_assign = (undefined && undefined.__assign) || function () {
    resume_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return resume_assign.apply(this, arguments);
};
var resume_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var resume_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




/** 是否为正整数 */
function isPositiveInteger(n) {
    var re = /^[1-9]\d*$/;
    return re.test(String(n));
}
var resume_Resume = /** @class */ (function (_super) {
    resume_extends(Resume, _super);
    function Resume() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @returns  {Promise<ResponseSuccess<any>>}
     * @description 实现了 Base 的 run 接口，处理具体的分片上传事务，并抛出过程中的异常。
     */
    Resume.prototype.run = function () {
        return resume_awaiter(this, void 0, void 0, function () {
            var pool, mkFileResponse, localKey, uploadChunks, error_1;
            var _this = this;
            return resume_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info('start run Resume.');
                        if (!this.config.chunkSize || !isPositiveInteger(this.config.chunkSize)) {
                            throw new QiniuError(QiniuErrorName.InvalidChunkSize, 'chunkSize must be a positive integer');
                        }
                        if (this.config.chunkSize > 1024) {
                            throw new QiniuError(QiniuErrorName.InvalidChunkSize, 'chunkSize maximum value is 1024');
                        }
                        return [4 /*yield*/, this.initBeforeUploadChunks()];
                    case 1:
                        _a.sent();
                        pool = new Pool(function (chunkInfo) { return _this.uploadChunk(chunkInfo); }, this.config.concurrentRequestLimit);
                        mkFileResponse = null;
                        localKey = this.getLocalKey();
                        uploadChunks = this.chunks.map(function (chunk, index) { return pool.enqueue({ chunk: chunk, index: index }); });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, Promise.all(uploadChunks)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.mkFileReq()];
                    case 4:
                        mkFileResponse = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        // uploadId 无效，上传参数有误（多由于本地存储信息的 uploadId 失效）
                        if (error_1 instanceof QiniuRequestError && (error_1.code === 612 || error_1.code === 400)) {
                            removeLocalFileInfo(localKey, this.logger);
                        }
                        throw error_1;
                    case 6:
                        // 上传成功，清理本地缓存数据
                        removeLocalFileInfo(localKey, this.logger);
                        return [2 /*return*/, mkFileResponse];
                }
            });
        });
    };
    Resume.prototype.uploadChunk = function (chunkInfo) {
        return resume_awaiter(this, void 0, void 0, function () {
            var index, chunk, cachedInfo, shouldCheckMD5, reuseSaved, md5, onProgress, requestOptions, response;
            var _this = this;
            return resume_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = chunkInfo.index, chunk = chunkInfo.chunk;
                        cachedInfo = this.cachedUploadedList[index];
                        this.logger.info("upload part " + index + ", cache:", cachedInfo);
                        shouldCheckMD5 = this.config.checkByMD5;
                        reuseSaved = function () {
                            _this.usedCacheList[index] = true;
                            _this.updateChunkProgress(chunk.size, index);
                            _this.uploadedList[index] = cachedInfo;
                            _this.updateLocalCache();
                        };
                        // FIXME: 至少判断一下 size
                        if (cachedInfo && !shouldCheckMD5) {
                            reuseSaved();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, computeMd5(chunk)];
                    case 1:
                        md5 = _a.sent();
                        this.logger.info('computed part md5.', md5);
                        if (cachedInfo && md5 === cachedInfo.md5) {
                            reuseSaved();
                            return [2 /*return*/];
                        }
                        // 没有使用缓存设置标记为 false
                        this.usedCacheList[index] = false;
                        onProgress = function (data) {
                            _this.updateChunkProgress(data.loaded, index);
                        };
                        requestOptions = {
                            body: chunk,
                            onProgress: onProgress,
                            onCreate: function (xhr) { return _this.addXhr(xhr); }
                        };
                        this.logger.info("part " + index + " start uploading.");
                        return [4 /*yield*/, uploadChunk(this.token, this.key, chunkInfo.index + 1, this.getUploadInfo(), requestOptions)];
                    case 2:
                        response = _a.sent();
                        this.logger.info("part " + index + " upload completed.");
                        // 在某些浏览器环境下，xhr 的 progress 事件无法被触发，progress 为 null，这里在每次分片上传完成后都手动更新下 progress
                        onProgress({
                            loaded: chunk.size,
                            total: chunk.size
                        });
                        this.uploadedList[index] = {
                            etag: response.data.etag,
                            md5: response.data.md5,
                            size: chunk.size
                        };
                        this.updateLocalCache();
                        return [2 /*return*/];
                }
            });
        });
    };
    Resume.prototype.mkFileReq = function () {
        return resume_awaiter(this, void 0, void 0, function () {
            var data, result;
            var _this = this;
            return resume_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = resume_assign(resume_assign(resume_assign({ parts: this.uploadedList.map(function (value, index) { return ({
                                etag: value.etag,
                                // 接口要求 index 需要从 1 开始，所以需要整体 + 1
                                partNumber: index + 1
                            }); }), fname: this.putExtra.fname }, this.putExtra.mimeType && { mimeType: this.putExtra.mimeType }), this.putExtra.customVars && { customVars: this.putExtra.customVars }), this.putExtra.metadata && { metadata: this.putExtra.metadata });
                        this.logger.info('parts upload completed, make file.', data);
                        return [4 /*yield*/, uploadComplete(this.token, this.key, this.getUploadInfo(), {
                                onCreate: function (xhr) { return _this.addXhr(xhr); },
                                body: JSON.stringify(data)
                            })];
                    case 1:
                        result = _a.sent();
                        this.logger.info('finish Resume Progress.');
                        this.updateMkFileProgress(1);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Resume.prototype.initBeforeUploadChunks = function () {
        return resume_awaiter(this, void 0, void 0, function () {
            var cachedInfo, res, infoMessage;
            return resume_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.uploadedList = [];
                        this.usedCacheList = [];
                        cachedInfo = getLocalFileInfo(this.getLocalKey(), this.logger);
                        if (!!cachedInfo) return [3 /*break*/, 2];
                        this.logger.info('init upload parts from api.');
                        return [4 /*yield*/, initUploadParts(this.token, this.bucketName, this.key, this.uploadHost.getUrl())];
                    case 1:
                        res = _a.sent();
                        this.logger.info("initd upload parts of id: " + res.data.uploadId + ".");
                        this.uploadId = res.data.uploadId;
                        this.cachedUploadedList = [];
                        return [3 /*break*/, 3];
                    case 2:
                        infoMessage = [
                            'resume upload parts from local cache,',
                            "total " + cachedInfo.data.length + " part,",
                            "id is " + cachedInfo.id + "."
                        ];
                        this.logger.info(infoMessage.join(' '));
                        this.cachedUploadedList = cachedInfo.data;
                        this.uploadId = cachedInfo.id;
                        _a.label = 3;
                    case 3:
                        this.chunks = getChunks(this.file, this.config.chunkSize);
                        this.loaded = {
                            mkFileProgress: 0,
                            chunks: this.chunks.map(function (_) { return 0; })
                        };
                        this.notifyResumeProgress();
                        return [2 /*return*/];
                }
            });
        });
    };
    Resume.prototype.getUploadInfo = function () {
        return {
            id: this.uploadId,
            url: this.uploadHost.getUrl()
        };
    };
    Resume.prototype.getLocalKey = function () {
        return createLocalKey(this.file.name, this.key, this.file.size);
    };
    Resume.prototype.updateLocalCache = function () {
        setLocalFileInfo(this.getLocalKey(), {
            id: this.uploadId,
            data: this.uploadedList
        }, this.logger);
    };
    Resume.prototype.updateChunkProgress = function (loaded, index) {
        this.loaded.chunks[index] = loaded;
        this.notifyResumeProgress();
    };
    Resume.prototype.updateMkFileProgress = function (progress) {
        this.loaded.mkFileProgress = progress;
        this.notifyResumeProgress();
    };
    Resume.prototype.notifyResumeProgress = function () {
        var _this = this;
        this.progress = {
            total: this.getProgressInfoItem(sum(this.loaded.chunks) + this.loaded.mkFileProgress, 
            // FIXME: 不准确的 fileSize
            this.file.size + 1 // 防止在 complete 未调用的时候进度显示 100%
            ),
            chunks: this.chunks.map(function (chunk, index) {
                var fromCache = _this.usedCacheList[index];
                return _this.getProgressInfoItem(_this.loaded.chunks[index], chunk.size, fromCache);
            }),
            uploadInfo: {
                id: this.uploadId,
                url: this.uploadHost.getUrl()
            }
        };
        this.onData(this.progress);
    };
    return Resume;
}(base));
/* harmony default export */ var resume = (resume_Resume);
//# sourceMappingURL=resume.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/upload/direct.js
var direct_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var direct_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var direct_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var direct_Direct = /** @class */ (function (_super) {
    direct_extends(Direct, _super);
    function Direct() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Direct.prototype.run = function () {
        return direct_awaiter(this, void 0, void 0, function () {
            var formData, customVars_1, result;
            var _this = this;
            return direct_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info('start run Direct.');
                        formData = new FormData();
                        formData.append('file', this.file);
                        formData.append('token', this.token);
                        if (this.key != null) {
                            formData.append('key', this.key);
                        }
                        formData.append('fname', this.putExtra.fname);
                        if (this.putExtra.customVars) {
                            this.logger.info('init customVars.');
                            customVars_1 = this.putExtra.customVars;
                            Object.keys(customVars_1).forEach(function (key) { return formData.append(key, customVars_1[key].toString()); });
                            this.logger.info('customVars inited.');
                        }
                        this.logger.info('formData inited.');
                        return [4 /*yield*/, direct(this.uploadHost.getUrl(), formData, {
                                onProgress: function (data) {
                                    _this.updateDirectProgress(data.loaded, data.total);
                                },
                                onCreate: function (xhr) { return _this.addXhr(xhr); }
                            })];
                    case 1:
                        result = _a.sent();
                        this.logger.info('Direct progress finish.');
                        this.finishDirectProgress();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Direct.prototype.updateDirectProgress = function (loaded, total) {
        // 当请求未完成时可能进度会达到100，所以total + 1来防止这种情况出现
        this.progress = { total: this.getProgressInfoItem(loaded, total + 1) };
        this.onData(this.progress);
    };
    Direct.prototype.finishDirectProgress = function () {
        // 在某些浏览器环境下，xhr 的 progress 事件无法被触发，progress 为 null，这里 fake 下
        if (!this.progress) {
            this.logger.warn('progress is null.');
            this.progress = { total: this.getProgressInfoItem(this.file.size, this.file.size) };
            this.onData(this.progress);
            return;
        }
        var total = this.progress.total;
        this.progress = { total: this.getProgressInfoItem(total.loaded + 1, total.size) };
        this.onData(this.progress);
    };
    return Direct;
}(base));
/* harmony default export */ var upload_direct = (direct_Direct);
//# sourceMappingURL=direct.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/logger/report-v3.js

/**
 * @param  {string} token 上传使用的 token
 * @param  {V3LogInfo} data 上报的统计数据
 * @param  {number} retry 重试的次数，默认值 3
 * @description v3 版本的日志上传接口，参考文档 https://github.com/qbox/product/blob/master/kodo/uplog.md#%E7%89%88%E6%9C%AC-3。
 */
function reportV3(token, data, retry) {
    if (retry === void 0) { retry = 3; }
    var xhr = createXHR();
    xhr.open('POST', 'https://uplog.qbox.me/log/3');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', getAuthHeaders(token).Authorization);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status !== 200 && retry > 0) {
            reportV3(token, data, retry - 1);
        }
    };
    // 顺序参考：https://github.com/qbox/product/blob/master/kodo/uplog.md#%E7%89%88%E6%9C%AC-3
    var stringifyData = [
        data.code || '',
        data.reqId || '',
        data.host || '',
        data.remoteIp || '',
        data.port || '',
        data.duration || '',
        data.time || '',
        data.bytesSent || '',
        data.upType || '',
        data.size || ''
    ].join(',');
    xhr.send(stringifyData);
}
//# sourceMappingURL=report-v3.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/logger/index.js
var logger_read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var logger_spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(logger_read(arguments[i]));
    return ar;
};

var logger_Logger = /** @class */ (function () {
    function Logger(token, disableReport, level, prefix) {
        if (disableReport === void 0) { disableReport = true; }
        if (level === void 0) { level = 'OFF'; }
        if (prefix === void 0) { prefix = 'UPLOAD'; }
        this.token = token;
        this.disableReport = disableReport;
        this.level = level;
        this.prefix = prefix;
        // 为每个类分配一个 id
        // 用以区分不同的上传任务
        this.id = ++Logger.id;
    }
    Logger.prototype.getPrintPrefix = function (level) {
        return "Qiniu-JS-SDK [" + level + "][" + this.prefix + "#" + this.id + "]:";
    };
    /**
     * @param  {V3LogInfo} data 上报的数据。
     * @param  {boolean} retry 重试次数，可选，默认为 3。
     * @description 向服务端上报统计信息。
     */
    Logger.prototype.report = function (data, retry) {
        if (this.disableReport)
            return;
        try {
            reportV3(this.token, data, retry);
        }
        catch (error) {
            this.warn(error);
        }
    };
    /**
     * @param  {unknown[]} ...args
     * @description 输出 info 级别的调试信息。
     */
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var allowLevel = ['INFO'];
        if (allowLevel.includes(this.level)) {
            // eslint-disable-next-line no-console
            console.log.apply(console, logger_spread([this.getPrintPrefix('INFO')], args));
        }
    };
    /**
     * @param  {unknown[]} ...args
     * @description 输出 warn 级别的调试信息。
     */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var allowLevel = ['INFO', 'WARN'];
        if (allowLevel.includes(this.level)) {
            // eslint-disable-next-line no-console
            console.warn.apply(console, logger_spread([this.getPrintPrefix('WARN')], args));
        }
    };
    /**
     * @param  {unknown[]} ...args
     * @description 输出 error 级别的调试信息。
     */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var allowLevel = ['INFO', 'WARN', 'ERROR'];
        if (allowLevel.includes(this.level)) {
            // eslint-disable-next-line no-console
            console.error.apply(console, logger_spread([this.getPrintPrefix('ERROR')], args));
        }
    };
    Logger.id = 0;
    return Logger;
}());
/* harmony default export */ var esm_logger = (logger_Logger);
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/upload/hosts.js
var hosts_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var hosts_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var hosts_read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var hosts_spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(hosts_read(arguments[i]));
    return ar;
};

/**
  * @description 解冻时间，key 是 host，value 为解冻时间
  */
var unfreezeTimeMap = new Map();
var Host = /** @class */ (function () {
    function Host(host, protocol) {
        this.host = host;
        this.protocol = protocol;
    }
    /**
     * @description 当前 host 是否为冻结状态
     */
    Host.prototype.isFrozen = function () {
        var currentTime = new Date().getTime();
        var unfreezeTime = unfreezeTimeMap.get(this.host);
        return unfreezeTime != null && unfreezeTime >= currentTime;
    };
    /**
     * @param  {number} time 单位秒，默认 20s
     * @description 冻结该 host 对象，该 host 将在指定时间内不可用
     */
    Host.prototype.freeze = function (time) {
        if (time === void 0) { time = 20; }
        var unfreezeTime = new Date().getTime() + (time * 1000);
        unfreezeTimeMap.set(this.host, unfreezeTime);
    };
    /**
     * @description 解冻该 host
     */
    Host.prototype.unfreeze = function () {
        unfreezeTimeMap["delete"](this.host);
    };
    /**
     * @description 获取当前 host 的完整 url
     */
    Host.prototype.getUrl = function () {
        return this.protocol + "://" + this.host;
    };
    /**
     * @description 获取解冻时间
     */
    Host.prototype.getUnfreezeTime = function () {
        return unfreezeTimeMap.get(this.host);
    };
    return Host;
}());

var hosts_HostPool = /** @class */ (function () {
    /**
     * @param  {string[]} initHosts
     * @description 如果在构造时传入 initHosts，则该 host 池始终使用传入的 initHosts 做为可用的数据
     */
    function HostPool(initHosts) {
        if (initHosts === void 0) { initHosts = []; }
        this.initHosts = initHosts;
        /**
         * @description 缓存的 host 表，以 bucket 和 accessKey 作为 key
         */
        this.cachedHostsMap = new Map();
    }
    /**
     * @param  {string} accessKey
     * @param  {string} bucketName
     * @param  {string[]} hosts
     * @param  {InternalConfig['upprotocol']} protocol
     * @returns  {void}
     * @description 注册可用 host
     */
    HostPool.prototype.register = function (accessKey, bucketName, hosts, protocol) {
        this.cachedHostsMap.set(accessKey + "@" + bucketName, hosts.map(function (host) { return new Host(host, protocol); }));
    };
    /**
     * @param  {string} accessKey
     * @param  {string} bucketName
     * @param  {InternalConfig['upprotocol']} protocol
     * @returns  {Promise<void>}
     * @description 刷新最新的 host 数据，如果用户在构造时该类时传入了 host 或者已经存在缓存则不会发起请求
     */
    HostPool.prototype.refresh = function (accessKey, bucketName, protocol) {
        var _a, _b, _c, _d;
        return hosts_awaiter(this, void 0, void 0, function () {
            var cachedHostList, response, stashHosts;
            return hosts_generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        cachedHostList = this.cachedHostsMap.get(accessKey + "@" + bucketName) || [];
                        if (cachedHostList.length > 0)
                            return [2 /*return*/];
                        if (this.initHosts.length > 0) {
                            this.register(accessKey, bucketName, this.initHosts, protocol);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, getUpHosts(accessKey, bucketName, protocol)];
                    case 1:
                        response = _e.sent();
                        if ((response === null || response === void 0 ? void 0 : response.data) != null) {
                            stashHosts = hosts_spread((((_b = (_a = response.data.up) === null || _a === void 0 ? void 0 : _a.acc) === null || _b === void 0 ? void 0 : _b.main) || []), (((_d = (_c = response.data.up) === null || _c === void 0 ? void 0 : _c.acc) === null || _d === void 0 ? void 0 : _d.backup) || []));
                            this.register(accessKey, bucketName, stashHosts, protocol);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param  {string} accessKey
     * @param  {string} bucketName
     * @param  {InternalConfig['upprotocol']} protocol
     * @returns  {Promise<Host | null>}
     * @description 获取一个可用的上传 Host，排除已冻结的
     */
    HostPool.prototype.getUp = function (accessKey, bucketName, protocol) {
        return hosts_awaiter(this, void 0, void 0, function () {
            var cachedHostList, availableHostList, priorityQueue;
            return hosts_generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.refresh(accessKey, bucketName, protocol)];
                    case 1:
                        _a.sent();
                        cachedHostList = this.cachedHostsMap.get(accessKey + "@" + bucketName) || [];
                        if (cachedHostList.length === 0)
                            return [2 /*return*/, null];
                        availableHostList = cachedHostList.filter(function (host) { return !host.isFrozen(); });
                        if (availableHostList.length > 0)
                            return [2 /*return*/, availableHostList[0]
                                // 无可用的，去取离解冻最近的 host
                            ];
                        priorityQueue = cachedHostList
                            .slice().sort(function (hostA, hostB) { return (hostA.getUnfreezeTime() || 0) - (hostB.getUnfreezeTime() || 0); });
                        return [2 /*return*/, priorityQueue[0]];
                }
            });
        });
    };
    return HostPool;
}());

//# sourceMappingURL=hosts.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/upload/index.js







function createUploadManager(options, handlers, hostPool, logger) {
    if (options.config && options.config.forceDirect) {
        logger.info('ues forceDirect mode.');
        return new upload_direct(options, handlers, hostPool, logger);
    }
    if (options.file.size > 4 * MB) {
        logger.info('file size over 4M, use Resume.');
        return new resume(options, handlers, hostPool, logger);
    }
    logger.info('file size less or equal than 4M, use Direct.');
    return new upload_direct(options, handlers, hostPool, logger);
}
/**
 * @param file 上传文件
 * @param key 目标文件名
 * @param token 上传凭证
 * @param putExtra 上传文件的相关资源信息配置
 * @param config 上传任务的配置
 * @returns 返回用于上传任务的可观察对象
 */
function upload(file, key, token, putExtra, config) {
    // 为每个任务创建单独的 Logger
    var logger = new esm_logger(token, config === null || config === void 0 ? void 0 : config.disableStatisticsReport, config === null || config === void 0 ? void 0 : config.debugLogLevel, file.name);
    var options = {
        file: file,
        key: key,
        token: token,
        putExtra: putExtra,
        config: normalizeUploadConfig(config, logger)
    };
    // 创建 host 池
    var hostPool = new hosts_HostPool(options.config.uphost);
    return new Observable(function (observer) {
        var manager = createUploadManager(options, {
            onData: function (data) { return observer.next(data); },
            onError: function (err) { return observer.error(err); },
            onComplete: function (res) { return observer.complete(res); }
        }, hostPool, logger);
        manager.putFile();
        return manager.stop.bind(manager);
    });
}
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/utils/config.js
var config_assign = (undefined && undefined.__assign) || function () {
    config_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return config_assign.apply(this, arguments);
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
var config_read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var config_spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(config_read(arguments[i]));
    return ar;
};


function normalizeUploadConfig(config, logger) {
    var _a = config_assign({}, config), upprotocol = _a.upprotocol, uphost = _a.uphost, otherConfig = __rest(_a, ["upprotocol", "uphost"]);
    var normalizeConfig = config_assign({ uphost: [], retryCount: 3, checkByMD5: false, forceDirect: false, useCdnDomain: true, concurrentRequestLimit: 3, chunkSize: DEFAULT_CHUNK_SIZE, upprotocol: 'https', debugLogLevel: 'OFF', disableStatisticsReport: false }, otherConfig);
    // 兼容原来的 http: https: 的写法
    if (upprotocol) {
        normalizeConfig.upprotocol = upprotocol
            .replace(/:$/, '');
    }
    var hostList = [];
    if (logger && (config === null || config === void 0 ? void 0 : config.uphost) != null && (config === null || config === void 0 ? void 0 : config.region) != null) {
        logger.warn('do not use both the uphost and region config.');
    }
    // 如果同时指定了 uphost 参数，添加到可用 host 列表
    if (uphost) {
        if (Array.isArray(uphost)) {
            hostList.push.apply(hostList, config_spread(uphost));
        }
        else {
            hostList.push(uphost);
        }
        // 否则如果用户传了 region，添加指定 region 的 host 到可用 host 列表
    }
    else if (normalizeConfig === null || normalizeConfig === void 0 ? void 0 : normalizeConfig.region) {
        var hostMap = regionUphostMap[normalizeConfig === null || normalizeConfig === void 0 ? void 0 : normalizeConfig.region];
        if (normalizeConfig.useCdnDomain) {
            hostList.push.apply(hostList, config_spread(hostMap.cdnUphost));
        }
        else {
            hostList.push.apply(hostList, config_spread(hostMap.srcUphost));
        }
    }
    return config_assign(config_assign({}, normalizeConfig), { uphost: hostList.filter(Boolean) });
}
//# sourceMappingURL=config.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/utils/compress.js
var compress_assign = (undefined && undefined.__assign) || function () {
    compress_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return compress_assign.apply(this, arguments);
};
var compress_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var compress_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var compress_mimeTypes = {
    PNG: 'image/png',
    JPEG: 'image/jpeg',
    WEBP: 'image/webp',
    BMP: 'image/bmp'
};
var maxSteps = 4;
var scaleFactor = Math.log(2);
var supportMimeTypes = Object.keys(compress_mimeTypes).map(function (type) { return compress_mimeTypes[type]; });
var defaultType = compress_mimeTypes.JPEG;
function isSupportedType(type) {
    return supportMimeTypes.includes(type);
}
var compress_Compress = /** @class */ (function () {
    function Compress(file, config) {
        this.file = file;
        this.config = config;
        this.config = compress_assign({ quality: 0.92, noCompressIfLarger: false }, this.config);
    }
    Compress.prototype.process = function () {
        return compress_awaiter(this, void 0, void 0, function () {
            var srcDimension, originImage, canvas, scale, scaleCanvas, distBlob;
            return compress_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.outputType = this.file.type;
                        srcDimension = {};
                        if (!isSupportedType(this.file.type)) {
                            throw new QiniuError(QiniuErrorName.UnsupportedFileType, "unsupported file type: " + this.file.type);
                        }
                        return [4 /*yield*/, this.getOriginImage()];
                    case 1:
                        originImage = _a.sent();
                        return [4 /*yield*/, this.getCanvas(originImage)];
                    case 2:
                        canvas = _a.sent();
                        scale = 1;
                        if (this.config.maxWidth) {
                            scale = Math.min(1, this.config.maxWidth / canvas.width);
                        }
                        if (this.config.maxHeight) {
                            scale = Math.min(1, scale, this.config.maxHeight / canvas.height);
                        }
                        srcDimension.width = canvas.width;
                        srcDimension.height = canvas.height;
                        return [4 /*yield*/, this.doScale(canvas, scale)];
                    case 3:
                        scaleCanvas = _a.sent();
                        distBlob = this.toBlob(scaleCanvas);
                        if (distBlob.size > this.file.size && this.config.noCompressIfLarger) {
                            return [2 /*return*/, {
                                    dist: this.file,
                                    width: srcDimension.width,
                                    height: srcDimension.height
                                }];
                        }
                        return [2 /*return*/, {
                                dist: distBlob,
                                width: scaleCanvas.width,
                                height: scaleCanvas.height
                            }];
                }
            });
        });
    };
    Compress.prototype.clear = function (ctx, width, height) {
        // jpeg 没有 alpha 通道，透明区间会被填充成黑色，这里把透明区间填充为白色
        if (this.outputType === defaultType) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, width, height);
        }
        else {
            ctx.clearRect(0, 0, width, height);
        }
    };
    /** 通过 file 初始化 image 对象 */
    Compress.prototype.getOriginImage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = createObjectURL(_this.file);
            var img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                reject('image load error');
            };
            img.src = url;
        });
    };
    Compress.prototype.getCanvas = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            if (!context) {
                reject(new QiniuError(QiniuErrorName.GetCanvasContextFailed, 'context is null'));
                return;
            }
            var width = img.width, height = img.height;
            canvas.height = height;
            canvas.width = width;
            _this.clear(context, width, height);
            context.drawImage(img, 0, 0);
            resolve(canvas);
        });
    };
    Compress.prototype.doScale = function (source, scale) {
        return compress_awaiter(this, void 0, void 0, function () {
            var sctx, steps, factor, mirror, mctx, width, height, originWidth, originHeight, src, context, i, dw, dh, canvas, data;
            return compress_generator(this, function (_a) {
                if (scale === 1) {
                    return [2 /*return*/, source];
                }
                sctx = source.getContext('2d');
                steps = Math.min(maxSteps, Math.ceil((1 / scale) / scaleFactor));
                factor = Math.pow(scale, (1 / steps));
                mirror = document.createElement('canvas');
                mctx = mirror.getContext('2d');
                width = source.width, height = source.height;
                originWidth = width;
                originHeight = height;
                mirror.width = width;
                mirror.height = height;
                if (!mctx || !sctx) {
                    throw new QiniuError(QiniuErrorName.GetCanvasContextFailed, "mctx or sctx can't be null");
                }
                for (i = 0; i < steps; i++) {
                    dw = width * factor | 0 // eslint-disable-line no-bitwise
                    ;
                    dh = height * factor | 0 // eslint-disable-line no-bitwise
                    ;
                    // 到最后一步的时候 dw, dh 用目标缩放尺寸，否则会出现最后尺寸偏小的情况
                    if (i === steps - 1) {
                        dw = originWidth * scale;
                        dh = originHeight * scale;
                    }
                    if (i % 2 === 0) {
                        src = source;
                        context = mctx;
                    }
                    else {
                        src = mirror;
                        context = sctx;
                    }
                    // 每次画前都清空，避免图像重叠
                    this.clear(context, width, height);
                    context.drawImage(src, 0, 0, width, height, 0, 0, dw, dh);
                    width = dw;
                    height = dh;
                }
                canvas = src === source ? mirror : source;
                data = context.getImageData(0, 0, width, height);
                // resize
                canvas.width = width;
                canvas.height = height;
                // store image data
                context.putImageData(data, 0, 0);
                return [2 /*return*/, canvas];
            });
        });
    };
    /** 这里把 base64 字符串转为 blob 对象 */
    Compress.prototype.toBlob = function (result) {
        var dataURL = result.toDataURL(this.outputType, this.config.quality);
        var buffer = atob(dataURL.split(',')[1]).split('').map(function (char) { return char.charCodeAt(0); });
        var blob = new Blob([new Uint8Array(buffer)], { type: this.outputType });
        return blob;
    };
    return Compress;
}());
var compressImage = function (file, options) { return new compress_Compress(file, options).process(); };
/* harmony default export */ var compress = (compressImage);
//# sourceMappingURL=compress.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/utils/index.js






//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/image/index.js

function getImageUrl(key, domain) {
    key = encodeURIComponent(key);
    if (domain.slice(domain.length - 1) !== '/') {
        domain += '/';
    }
    return domain + key;
}
function imageView2(op, key, domain) {
    if (!/^\d$/.test(String(op.mode))) {
        throw 'mode should be number in imageView2';
    }
    var mode = op.mode, w = op.w, h = op.h, q = op.q, format = op.format;
    if (!w && !h) {
        throw 'param w and h is empty in imageView2';
    }
    var imageUrl = 'imageView2/' + encodeURIComponent(mode);
    imageUrl += w ? '/w/' + encodeURIComponent(w) : '';
    imageUrl += h ? '/h/' + encodeURIComponent(h) : '';
    imageUrl += q ? '/q/' + encodeURIComponent(q) : '';
    imageUrl += format ? '/format/' + encodeURIComponent(format) : '';
    if (key && domain) {
        imageUrl = getImageUrl(key, domain) + '?' + imageUrl;
    }
    return imageUrl;
}
// invoke the imageMogr2 api of Qiniu
function imageMogr2(op, key, domain) {
    var autoOrient = op['auto-orient'];
    var thumbnail = op.thumbnail, strip = op.strip, gravity = op.gravity, crop = op.crop, quality = op.quality, rotate = op.rotate, format = op.format, blur = op.blur;
    var imageUrl = 'imageMogr2';
    imageUrl += autoOrient ? '/auto-orient' : '';
    imageUrl += thumbnail ? '/thumbnail/' + encodeURIComponent(thumbnail) : '';
    imageUrl += strip ? '/strip' : '';
    imageUrl += gravity ? '/gravity/' + encodeURIComponent(gravity) : '';
    imageUrl += quality ? '/quality/' + encodeURIComponent(quality) : '';
    imageUrl += crop ? '/crop/' + encodeURIComponent(crop) : '';
    imageUrl += rotate ? '/rotate/' + encodeURIComponent(rotate) : '';
    imageUrl += format ? '/format/' + encodeURIComponent(format) : '';
    imageUrl += blur ? '/blur/' + encodeURIComponent(blur) : '';
    if (key && domain) {
        imageUrl = getImageUrl(key, domain) + '?' + imageUrl;
    }
    return imageUrl;
}
// invoke the watermark api of Qiniu
function watermark(op, key, domain) {
    var mode = op.mode;
    if (!mode) {
        throw "mode can't be empty in watermark";
    }
    var imageUrl = 'watermark/' + mode;
    if (mode !== 1 && mode !== 2) {
        throw 'mode is wrong';
    }
    if (mode === 1) {
        var image = op.image;
        if (!image) {
            throw "image can't be empty in watermark";
        }
        imageUrl += image ? '/image/' + urlSafeBase64Encode(image) : '';
    }
    if (mode === 2) {
        var text = op.text, font = op.font, fontsize = op.fontsize, fill = op.fill;
        if (!text) {
            throw "text can't be empty in watermark";
        }
        imageUrl += text ? '/text/' + urlSafeBase64Encode(text) : '';
        imageUrl += font ? '/font/' + urlSafeBase64Encode(font) : '';
        imageUrl += fontsize ? '/fontsize/' + fontsize : '';
        imageUrl += fill ? '/fill/' + urlSafeBase64Encode(fill) : '';
    }
    var dissolve = op.dissolve, gravity = op.gravity, dx = op.dx, dy = op.dy;
    imageUrl += dissolve ? '/dissolve/' + encodeURIComponent(dissolve) : '';
    imageUrl += gravity ? '/gravity/' + encodeURIComponent(gravity) : '';
    imageUrl += dx ? '/dx/' + encodeURIComponent(dx) : '';
    imageUrl += dy ? '/dy/' + encodeURIComponent(dy) : '';
    if (key && domain) {
        imageUrl = getImageUrl(key, domain) + '?' + imageUrl;
    }
    return imageUrl;
}
// invoke the imageInfo api of Qiniu
function imageInfo(key, domain) {
    var url = getImageUrl(key, domain) + '?imageInfo';
    return request(url, { method: 'GET' });
}
// invoke the exif api of Qiniu
function exif(key, domain) {
    var url = getImageUrl(key, domain) + '?exif';
    return request(url, { method: 'GET' });
}
function pipeline(arr, key, domain) {
    var isArray = Object.prototype.toString.call(arr) === '[object Array]';
    var option;
    var errOp = false;
    var imageUrl = '';
    if (isArray) {
        for (var i = 0, len = arr.length; i < len; i++) {
            option = arr[i];
            if (!option.fop) {
                throw "fop can't be empty in pipeline";
            }
            switch (option.fop) {
                case 'watermark':
                    imageUrl += watermark(option) + '|';
                    break;
                case 'imageView2':
                    imageUrl += imageView2(option) + '|';
                    break;
                case 'imageMogr2':
                    imageUrl += imageMogr2(option) + '|';
                    break;
                default:
                    errOp = true;
                    break;
            }
            if (errOp) {
                throw 'fop is wrong in pipeline';
            }
        }
        if (key && domain) {
            imageUrl = getImageUrl(key, domain) + '?' + imageUrl;
            var length_1 = imageUrl.length;
            if (imageUrl.slice(length_1 - 1) === '|') {
                imageUrl = imageUrl.slice(0, length_1 - 1);
            }
        }
        return imageUrl;
    }
    throw "pipeline's first param should be array";
}
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./node_modules/_qiniu-js@3.3.3@qiniu-js/esm/index.js






//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.8@vue-loader/lib??vue-loader-options!./packages/shzl-genrator-form/components/Upload/index.vue?vue&type=script&lang=js&








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(defineProperty["a" /* default */])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




__webpack_require__("1694");

/* harmony default export */ var Uploadvue_type_script_lang_js_ = ({
  components: {
    Draggable: vuedraggable_umd_default.a
  },
  props: {
    value: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    token: {
      type: String,
      default: ''
    },
    domain: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 9
    },
    isQiniu: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    meitu: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      fileList: this.value.map(function (item) {
        return {
          key: item.key ? item.key : new Date().getTime() + '_' + Math.ceil(Math.random() * 99999),
          url: item.url,
          percent: item.percent ? item.percent : 100,
          status: item.status ? item.status : 'success'
        };
      }),
      viewer: null,
      uploadId: 'upload_' + new Date().getTime(),
      editIndex: -1,
      meituIndex: -1
    };
  },
  computed: {
    miniWidth: function miniWidth() {
      if (this.width > this.height) {
        return this.height;
      } else {
        return this.width;
      }
    }
  },
  mounted: function mounted() {
    this.$emit('input', this.fileList);
  },
  methods: {
    handleChange: function handleChange() {
      var _this2 = this;

      console.log(this.$refs.uploadInput.files);
      var files = this.$refs.uploadInput.files;

      var _loop = function _loop(i) {
        var file = files[i];
        var reader = new FileReader();
        var key = new Date().getTime() + '_' + Math.ceil(Math.random() * 99999);
        reader.readAsDataURL(file);

        reader.onload = function () {
          if (_this2.editIndex >= 0) {
            _this2.$set(_this2.fileList, _this2.editIndex, {
              key: key,
              url: reader.result,
              percent: 0,
              status: 'uploading'
            });

            _this2.editIndex = -1;
          } else {
            _this2.fileList.push({
              key: key,
              url: reader.result,
              percent: 0,
              status: 'uploading'
            });
          }

          _this2.$nextTick(function () {
            if (_this2.isQiniu) {
              _this2.uplaodAction2(reader.result, file, key);
            } else {
              _this2.uplaodAction(reader.result, file, key);
            }
          });
        };
      };

      for (var i = 0; i < files.length; i++) {
        _loop(i);
      }

      this.$refs.uploadInput.value = [];
    },
    uplaodAction: function uplaodAction(res, file, key) {
      var _this3 = this;

      var changeIndex = this.fileList.findIndex(function (item) {
        return item.key === key;
      });
      console.log(this.fileList.findIndex(function (item) {
        return item.key === key;
      }));
      var xhr = new XMLHttpRequest();
      var url = this.action;
      xhr.open('POST', url, true); // xhr.setRequestHeader('Content-Type', 'multipart/form-data')

      var formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);

      xhr.onreadystatechange = function () {
        console.log(xhr);

        if (xhr.readyState === 4) {
          var resData = JSON.parse(xhr.response);

          if (resData && resData.url) {
            _this3.$set(_this3.fileList, _this3.fileList.findIndex(function (item) {
              return item.key === key;
            }), _objectSpread(_objectSpread({}, _this3.fileList[_this3.fileList.findIndex(function (item) {
              return item.key === key;
            })]), {}, {
              url: resData.url,
              percent: 100
            }));

            setTimeout(function () {
              _this3.$set(_this3.fileList, _this3.fileList.findIndex(function (item) {
                return item.key === key;
              }), _objectSpread(_objectSpread({}, _this3.fileList[_this3.fileList.findIndex(function (item) {
                return item.key === key;
              })]), {}, {
                status: 'success'
              }));

              _this3.$emit('input', _this3.fileList);
            }, 200);
          } else {
            _this3.$set(_this3.fileList, _this3.fileList.findIndex(function (item) {
              return item.key === key;
            }), _objectSpread(_objectSpread({}, _this3.fileList[_this3.fileList.findIndex(function (item) {
              return item.key === key;
            })]), {}, {
              status: 'error'
            }));

            _this3.fileList.splice(_this3.fileList.findIndex(function (item) {
              return item.key === key;
            }), 1);
          }
        }
      };

      xhr.onprogress = function (res) {
        console.log('progress', res);

        if (res.total && res.loaded) {
          _this3.$set(_this3.fileList[_this3.fileList.findIndex(function (item) {
            return item.key === key;
          })], 'percent', res.loaded / res.total * 100);
        }
      };
    },
    uplaodAction2: function uplaodAction2(res, file, key) {
      var _this = this;

      var observable = upload(file, key, this.token, {
        fname: key,
        mimeType: []
      }, {
        useCdnDomain: true,
        region: region.z2
      });
      observable.subscribe({
        next: function next(res) {
          _this.$set(_this.fileList[_this.fileList.findIndex(function (item) {
            return item.key === key;
          })], 'percent', parseInt(res.total.percent));
        },
        error: function error(err) {
          _this.$set(_this.fileList, _this.fileList.findIndex(function (item) {
            return item.key === key;
          }), _objectSpread(_objectSpread({}, _this.fileList[_this.fileList.findIndex(function (item) {
            return item.key === key;
          })]), {}, {
            status: 'error'
          }));

          _this.fileList.splice(_this.fileList.findIndex(function (item) {
            return item.key === key;
          }), 1);
        },
        complete: function complete(res) {
          _this.$set(_this.fileList, _this.fileList.findIndex(function (item) {
            return item.key === key;
          }), _objectSpread(_objectSpread({}, _this.fileList[_this.fileList.findIndex(function (item) {
            return item.key === key;
          })]), {}, {
            url: _this.domain + res.key,
            percent: 100
          }));

          setTimeout(function () {
            _this.$set(_this.fileList, _this.fileList.findIndex(function (item) {
              return item.key === key;
            }), _objectSpread(_objectSpread({}, _this.fileList[_this.fileList.findIndex(function (item) {
              return item.key === key;
            })]), {}, {
              status: 'success'
            }));

            _this.$emit('input', _this.fileList);
          }, 200);
        }
      });
    },
    handleRemove: function handleRemove(key) {
      this.fileList.splice(this.fileList.findIndex(function (item) {
        return item.key === key;
      }), 1);
    },
    handleEdit: function handleEdit(key) {
      this.editIndex = this.fileList.findIndex(function (item) {
        return item.key === key;
      });
      this.$refs.uploadInput.click();
    },
    handleMeitu: function handleMeitu(key) {
      this.$emit('on-meitu', this.fileList.findIndex(function (item) {
        return item.key === key;
      }));
    },
    handleAdd: function handleAdd() {
      if (!this.disabled) {
        this.editIndex = -1;
        this.$refs.uploadInput.click();
      }
    },
    handlePreviewFile: function handlePreviewFile(key) {
      var _this4 = this;

      this.viewer && this.viewer.destroy();
      this.uploadId = 'upload_' + new Date().getTime();
      console.log(this.viewer);
      this.$nextTick(function () {
        _this4.viewer = new viewer_default.a(document.getElementById(_this4.uploadId));

        _this4.viewer.view(_this4.fileList.findIndex(function (item) {
          return item.key === key;
        }));
      });
    }
  },
  watch: {
    'fileList': {
      deep: true,
      handler: function handler(val) {// this.$emit('input', this.fileList)
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/Upload/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Uploadvue_type_script_lang_js_ = (Uploadvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/shzl-genrator-form/components/Upload/index.vue?vue&type=style&index=0&lang=scss&
var Uploadvue_type_style_index_0_lang_scss_ = __webpack_require__("924c");

// EXTERNAL MODULE: ./node_modules/_vue-loader@15.9.8@vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("cba8");

// CONCATENATED MODULE: ./packages/shzl-genrator-form/components/Upload/index.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_Uploadvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Upload = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ "3c56":
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__("93ca");
var gOPS = __webpack_require__("0c29");
var pIE = __webpack_require__("35d4");
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),

/***/ "3c75":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("dce3");
var toIObject = __webpack_require__("8a8a");
var arrayIndexOf = __webpack_require__("f3cc")(false);
var IE_PROTO = __webpack_require__("245c")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "3cc6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_CusDialog_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8c56");
/* harmony import */ var _node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_CusDialog_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_CusDialog_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "3d8a":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "3f48":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("bdf1");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "3f9e":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("bb8b");
var anObject = __webpack_require__("a86f");
var getKeys = __webpack_require__("93ca");

module.exports = __webpack_require__("26df") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "3fa6":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "4057":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("de49");
var anObject = __webpack_require__("a86f");
var $flags = __webpack_require__("6bf8");
var DESCRIPTORS = __webpack_require__("26df");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__("84e8")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__("0926")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "406a":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("970b");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "407a":
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Viewer.js v1.10.1
 * https://fengyuanchen.github.io/viewerjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2021-08-01T13:35:49.731Z
 */

(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var DEFAULTS = {
    /**
     * Enable a modal backdrop, specify `static` for a backdrop
     * which doesn't close the modal on click.
     * @type {boolean}
     */
    backdrop: true,

    /**
     * Show the button on the top-right of the viewer.
     * @type {boolean}
     */
    button: true,

    /**
     * Show the navbar.
     * @type {boolean | number}
     */
    navbar: true,

    /**
     * Specify the visibility and the content of the title.
     * @type {boolean | number | Function | Array}
     */
    title: true,

    /**
     * Show the toolbar.
     * @type {boolean | number | Object}
     */
    toolbar: true,

    /**
     * Custom class name(s) to add to the viewer's root element.
     * @type {string}
     */
    className: '',

    /**
     * Define where to put the viewer in modal mode.
     * @type {string | Element}
     */
    container: 'body',

    /**
     * Filter the images for viewing. Return true if the image is viewable.
     * @type {Function}
     */
    filter: null,

    /**
     * Enable to request fullscreen when play.
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions}
     * @type {boolean|FullscreenOptions}
     */
    fullscreen: true,

    /**
     * Define the extra attributes to inherit from the original image.
     * @type {Array}
     */
    inheritedAttributes: ['crossOrigin', 'decoding', 'isMap', 'loading', 'referrerPolicy', 'sizes', 'srcset', 'useMap'],

    /**
     * Define the initial index of image for viewing.
     * @type {number}
     */
    initialViewIndex: 0,

    /**
     * Enable inline mode.
     * @type {boolean}
     */
    inline: false,

    /**
     * The amount of time to delay between automatically cycling an image when playing.
     * @type {number}
     */
    interval: 5000,

    /**
     * Enable keyboard support.
     * @type {boolean}
     */
    keyboard: true,

    /**
     * Focus the viewer when initialized.
     * @type {boolean}
     */
    focus: true,

    /**
     * Indicate if show a loading spinner when load image or not.
     * @type {boolean}
     */
    loading: true,

    /**
     * Indicate if enable loop viewing or not.
     * @type {boolean}
     */
    loop: true,

    /**
     * Min width of the viewer in inline mode.
     * @type {number}
     */
    minWidth: 200,

    /**
     * Min height of the viewer in inline mode.
     * @type {number}
     */
    minHeight: 100,

    /**
     * Enable to move the image.
     * @type {boolean}
     */
    movable: true,

    /**
     * Enable to rotate the image.
     * @type {boolean}
     */
    rotatable: true,

    /**
     * Enable to scale the image.
     * @type {boolean}
     */
    scalable: true,

    /**
     * Enable to zoom the image.
     * @type {boolean}
     */
    zoomable: true,

    /**
     * Enable to zoom the current image by dragging on the touch screen.
     * @type {boolean}
     */
    zoomOnTouch: true,

    /**
     * Enable to zoom the image by wheeling mouse.
     * @type {boolean}
     */
    zoomOnWheel: true,

    /**
     * Enable to slide to the next or previous image by swiping on the touch screen.
     * @type {boolean}
     */
    slideOnTouch: true,

    /**
     * Indicate if toggle the image size between its natural size
     * and initial size when double click on the image or not.
     * @type {boolean}
     */
    toggleOnDblclick: true,

    /**
     * Show the tooltip with image ratio (percentage) when zoom in or zoom out.
     * @type {boolean}
     */
    tooltip: true,

    /**
     * Enable CSS3 Transition for some special elements.
     * @type {boolean}
     */
    transition: true,

    /**
     * Define the CSS `z-index` value of viewer in modal mode.
     * @type {number}
     */
    zIndex: 2015,

    /**
     * Define the CSS `z-index` value of viewer in inline mode.
     * @type {number}
     */
    zIndexInline: 0,

    /**
     * Define the ratio when zoom the image by wheeling mouse.
     * @type {number}
     */
    zoomRatio: 0.1,

    /**
     * Define the min ratio of the image when zoom out.
     * @type {number}
     */
    minZoomRatio: 0.01,

    /**
     * Define the max ratio of the image when zoom in.
     * @type {number}
     */
    maxZoomRatio: 100,

    /**
     * Define where to get the original image URL for viewing.
     * @type {string | Function}
     */
    url: 'src',

    /**
     * Event shortcuts.
     * @type {Function}
     */
    ready: null,
    show: null,
    shown: null,
    hide: null,
    hidden: null,
    view: null,
    viewed: null,
    move: null,
    moved: null,
    rotate: null,
    rotated: null,
    scale: null,
    scaled: null,
    zoom: null,
    zoomed: null,
    play: null,
    stop: null
  };

  var TEMPLATE = '<div class="viewer-container" tabindex="-1" touch-action="none">' + '<div class="viewer-canvas"></div>' + '<div class="viewer-footer">' + '<div class="viewer-title"></div>' + '<div class="viewer-toolbar"></div>' + '<div class="viewer-navbar">' + '<ul class="viewer-list" role="navigation"></ul>' + '</div>' + '</div>' + '<div class="viewer-tooltip" role="alert" aria-hidden="true"></div>' + '<div class="viewer-button" data-viewer-action="mix" role="button"></div>' + '<div class="viewer-player"></div>' + '</div>';

  var IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  var WINDOW = IS_BROWSER ? window : {};
  var IS_TOUCH_DEVICE = IS_BROWSER && WINDOW.document.documentElement ? 'ontouchstart' in WINDOW.document.documentElement : false;
  var HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
  var NAMESPACE = 'viewer'; // Actions

  var ACTION_MOVE = 'move';
  var ACTION_SWITCH = 'switch';
  var ACTION_ZOOM = 'zoom'; // Classes

  var CLASS_ACTIVE = "".concat(NAMESPACE, "-active");
  var CLASS_CLOSE = "".concat(NAMESPACE, "-close");
  var CLASS_FADE = "".concat(NAMESPACE, "-fade");
  var CLASS_FIXED = "".concat(NAMESPACE, "-fixed");
  var CLASS_FULLSCREEN = "".concat(NAMESPACE, "-fullscreen");
  var CLASS_FULLSCREEN_EXIT = "".concat(NAMESPACE, "-fullscreen-exit");
  var CLASS_HIDE = "".concat(NAMESPACE, "-hide");
  var CLASS_HIDE_MD_DOWN = "".concat(NAMESPACE, "-hide-md-down");
  var CLASS_HIDE_SM_DOWN = "".concat(NAMESPACE, "-hide-sm-down");
  var CLASS_HIDE_XS_DOWN = "".concat(NAMESPACE, "-hide-xs-down");
  var CLASS_IN = "".concat(NAMESPACE, "-in");
  var CLASS_INVISIBLE = "".concat(NAMESPACE, "-invisible");
  var CLASS_LOADING = "".concat(NAMESPACE, "-loading");
  var CLASS_MOVE = "".concat(NAMESPACE, "-move");
  var CLASS_OPEN = "".concat(NAMESPACE, "-open");
  var CLASS_SHOW = "".concat(NAMESPACE, "-show");
  var CLASS_TRANSITION = "".concat(NAMESPACE, "-transition"); // Native events

  var EVENT_CLICK = 'click';
  var EVENT_DBLCLICK = 'dblclick';
  var EVENT_DRAG_START = 'dragstart';
  var EVENT_FOCUSIN = 'focusin';
  var EVENT_KEY_DOWN = 'keydown';
  var EVENT_LOAD = 'load';
  var EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
  var EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
  var EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
  var EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
  var EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
  var EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
  var EVENT_RESIZE = 'resize';
  var EVENT_TRANSITION_END = 'transitionend';
  var EVENT_WHEEL = 'wheel'; // Custom events

  var EVENT_READY = 'ready';
  var EVENT_SHOW = 'show';
  var EVENT_SHOWN = 'shown';
  var EVENT_HIDE = 'hide';
  var EVENT_HIDDEN = 'hidden';
  var EVENT_VIEW = 'view';
  var EVENT_VIEWED = 'viewed';
  var EVENT_MOVE = 'move';
  var EVENT_MOVED = 'moved';
  var EVENT_ROTATE = 'rotate';
  var EVENT_ROTATED = 'rotated';
  var EVENT_SCALE = 'scale';
  var EVENT_SCALED = 'scaled';
  var EVENT_ZOOM = 'zoom';
  var EVENT_ZOOMED = 'zoomed';
  var EVENT_PLAY = 'play';
  var EVENT_STOP = 'stop'; // Data keys

  var DATA_ACTION = "".concat(NAMESPACE, "Action"); // RegExps

  var REGEXP_SPACES = /\s\s*/; // Misc

  var BUTTONS = ['zoom-in', 'zoom-out', 'one-to-one', 'reset', 'prev', 'play', 'next', 'rotate-left', 'rotate-right', 'flip-horizontal', 'flip-vertical'];

  /**
   * Check if the given value is a string.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a string, else `false`.
   */

  function isString(value) {
    return typeof value === 'string';
  }
  /**
   * Check if the given value is not a number.
   */

  var isNaN = Number.isNaN || WINDOW.isNaN;
  /**
   * Check if the given value is a number.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a number, else `false`.
   */

  function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }
  /**
   * Check if the given value is undefined.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
   */

  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  /**
   * Check if the given value is an object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is an object, else `false`.
   */

  function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * Check if the given value is a plain object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
   */

  function isPlainObject(value) {
    if (!isObject(value)) {
      return false;
    }

    try {
      var _constructor = value.constructor;
      var prototype = _constructor.prototype;
      return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
    } catch (error) {
      return false;
    }
  }
  /**
   * Check if the given value is a function.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a function, else `false`.
   */

  function isFunction(value) {
    return typeof value === 'function';
  }
  /**
   * Iterate the given data.
   * @param {*} data - The data to iterate.
   * @param {Function} callback - The process function for each element.
   * @returns {*} The original data.
   */

  function forEach(data, callback) {
    if (data && isFunction(callback)) {
      if (Array.isArray(data) || isNumber(data.length)
      /* array-like */
      ) {
        var length = data.length;
        var i;

        for (i = 0; i < length; i += 1) {
          if (callback.call(data, data[i], i, data) === false) {
            break;
          }
        }
      } else if (isObject(data)) {
        Object.keys(data).forEach(function (key) {
          callback.call(data, data[key], key, data);
        });
      }
    }

    return data;
  }
  /**
   * Extend the given object.
   * @param {*} obj - The object to be extended.
   * @param {*} args - The rest objects which will be merged to the first object.
   * @returns {Object} The extended object.
   */

  var assign = Object.assign || function assign(obj) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (isObject(obj) && args.length > 0) {
      args.forEach(function (arg) {
        if (isObject(arg)) {
          Object.keys(arg).forEach(function (key) {
            obj[key] = arg[key];
          });
        }
      });
    }

    return obj;
  };
  var REGEXP_SUFFIX = /^(?:width|height|left|top|marginLeft|marginTop)$/;
  /**
   * Apply styles to the given element.
   * @param {Element} element - The target element.
   * @param {Object} styles - The styles for applying.
   */

  function setStyle(element, styles) {
    var style = element.style;
    forEach(styles, function (value, property) {
      if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
        value += 'px';
      }

      style[property] = value;
    });
  }
  /**
   * Escape a string for using in HTML.
   * @param {String} value - The string to escape.
   * @returns {String} Returns the escaped string.
   */

  function escapeHTMLEntities(value) {
    return isString(value) ? value.replace(/&(?!amp;|quot;|#39;|lt;|gt;)/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
  }
  /**
   * Check if the given element has a special class.
   * @param {Element} element - The element to check.
   * @param {string} value - The class to search.
   * @returns {boolean} Returns `true` if the special class was found.
   */

  function hasClass(element, value) {
    if (!element || !value) {
      return false;
    }

    return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
  }
  /**
   * Add classes to the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be added.
   */

  function addClass(element, value) {
    if (!element || !value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        addClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.add(value);
      return;
    }

    var className = element.className.trim();

    if (!className) {
      element.className = value;
    } else if (className.indexOf(value) < 0) {
      element.className = "".concat(className, " ").concat(value);
    }
  }
  /**
   * Remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be removed.
   */

  function removeClass(element, value) {
    if (!element || !value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        removeClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.remove(value);
      return;
    }

    if (element.className.indexOf(value) >= 0) {
      element.className = element.className.replace(value, '');
    }
  }
  /**
   * Add or remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be toggled.
   * @param {boolean} added - Add only.
   */

  function toggleClass(element, value, added) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        toggleClass(elem, value, added);
      });
      return;
    } // IE10-11 doesn't support the second parameter of `classList.toggle`


    if (added) {
      addClass(element, value);
    } else {
      removeClass(element, value);
    }
  }
  var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
  /**
   * Transform the given string from camelCase to kebab-case
   * @param {string} value - The value to transform.
   * @returns {string} The transformed value.
   */

  function hyphenate(value) {
    return value.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
  }
  /**
   * Get data from the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to get.
   * @returns {string} The data value.
   */

  function getData(element, name) {
    if (isObject(element[name])) {
      return element[name];
    }

    if (element.dataset) {
      return element.dataset[name];
    }

    return element.getAttribute("data-".concat(hyphenate(name)));
  }
  /**
   * Set data to the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to set.
   * @param {string} data - The data value.
   */

  function setData(element, name, data) {
    if (isObject(data)) {
      element[name] = data;
    } else if (element.dataset) {
      element.dataset[name] = data;
    } else {
      element.setAttribute("data-".concat(hyphenate(name)), data);
    }
  }

  var onceSupported = function () {
    var supported = false;

    if (IS_BROWSER) {
      var once = false;

      var listener = function listener() {};

      var options = Object.defineProperty({}, 'once', {
        get: function get() {
          supported = true;
          return once;
        },

        /**
         * This setter can fix a `TypeError` in strict mode
         * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
         * @param {boolean} value - The value to set
         */
        set: function set(value) {
          once = value;
        }
      });
      WINDOW.addEventListener('test', listener, options);
      WINDOW.removeEventListener('test', listener, options);
    }

    return supported;
  }();
  /**
   * Remove event listener from the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */


  function removeListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (!onceSupported) {
        var listeners = element.listeners;

        if (listeners && listeners[event] && listeners[event][listener]) {
          handler = listeners[event][listener];
          delete listeners[event][listener];

          if (Object.keys(listeners[event]).length === 0) {
            delete listeners[event];
          }

          if (Object.keys(listeners).length === 0) {
            delete element.listeners;
          }
        }
      }

      element.removeEventListener(event, handler, options);
    });
  }
  /**
   * Add event listener to the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */

  function addListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (options.once && !onceSupported) {
        var _element$listeners = element.listeners,
            listeners = _element$listeners === void 0 ? {} : _element$listeners;

        _handler = function handler() {
          delete listeners[event][listener];
          element.removeEventListener(event, _handler, options);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          listener.apply(element, args);
        };

        if (!listeners[event]) {
          listeners[event] = {};
        }

        if (listeners[event][listener]) {
          element.removeEventListener(event, listeners[event][listener], options);
        }

        listeners[event][listener] = _handler;
        element.listeners = listeners;
      }

      element.addEventListener(event, _handler, options);
    });
  }
  /**
   * Dispatch event on the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Object} data - The additional event data.
   * @param {Object} options - The additional event options.
   * @returns {boolean} Indicate if the event is default prevented or not.
   */

  function dispatchEvent(element, type, data, options) {
    var event; // Event and CustomEvent on IE9-11 are global objects, not constructors

    if (isFunction(Event) && isFunction(CustomEvent)) {
      event = new CustomEvent(type, _objectSpread2({
        bubbles: true,
        cancelable: true,
        detail: data
      }, options));
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, data);
    }

    return element.dispatchEvent(event);
  }
  /**
   * Get the offset base on the document.
   * @param {Element} element - The target element.
   * @returns {Object} The offset data.
   */

  function getOffset(element) {
    var box = element.getBoundingClientRect();
    return {
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      top: box.top + (window.pageYOffset - document.documentElement.clientTop)
    };
  }
  /**
   * Get transforms base on the given object.
   * @param {Object} obj - The target object.
   * @returns {string} A string contains transform values.
   */

  function getTransforms(_ref) {
    var rotate = _ref.rotate,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        translateX = _ref.translateX,
        translateY = _ref.translateY;
    var values = [];

    if (isNumber(translateX) && translateX !== 0) {
      values.push("translateX(".concat(translateX, "px)"));
    }

    if (isNumber(translateY) && translateY !== 0) {
      values.push("translateY(".concat(translateY, "px)"));
    } // Rotate should come first before scale to match orientation transform


    if (isNumber(rotate) && rotate !== 0) {
      values.push("rotate(".concat(rotate, "deg)"));
    }

    if (isNumber(scaleX) && scaleX !== 1) {
      values.push("scaleX(".concat(scaleX, ")"));
    }

    if (isNumber(scaleY) && scaleY !== 1) {
      values.push("scaleY(".concat(scaleY, ")"));
    }

    var transform = values.length ? values.join(' ') : 'none';
    return {
      WebkitTransform: transform,
      msTransform: transform,
      transform: transform
    };
  }
  /**
   * Get an image name from an image url.
   * @param {string} url - The target url.
   * @example
   * // picture.jpg
   * getImageNameFromURL('https://domain.com/path/to/picture.jpg?size=1280×960')
   * @returns {string} A string contains the image name.
   */

  function getImageNameFromURL(url) {
    return isString(url) ? decodeURIComponent(url.replace(/^.*\//, '').replace(/[?&#].*$/, '')) : '';
  }
  var IS_SAFARI = WINDOW.navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(WINDOW.navigator.userAgent);
  /**
   * Get an image's natural sizes.
   * @param {string} image - The target image.
   * @param {Object} options - The viewer options.
   * @param {Function} callback - The callback function.
   * @returns {HTMLImageElement} The new image.
   */

  function getImageNaturalSizes(image, options, callback) {
    var newImage = document.createElement('img'); // Modern browsers (except Safari)

    if (image.naturalWidth && !IS_SAFARI) {
      callback(image.naturalWidth, image.naturalHeight);
      return newImage;
    }

    var body = document.body || document.documentElement;

    newImage.onload = function () {
      callback(newImage.width, newImage.height);

      if (!IS_SAFARI) {
        body.removeChild(newImage);
      }
    };

    forEach(options.inheritedAttributes, function (name) {
      var value = image.getAttribute(name);

      if (value !== null) {
        newImage.setAttribute(name, value);
      }
    });
    newImage.src = image.src; // iOS Safari will convert the image automatically
    // with its orientation once append it into DOM

    if (!IS_SAFARI) {
      newImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
      body.appendChild(newImage);
    }

    return newImage;
  }
  /**
   * Get the related class name of a responsive type number.
   * @param {string} type - The responsive type.
   * @returns {string} The related class name.
   */

  function getResponsiveClass(type) {
    switch (type) {
      case 2:
        return CLASS_HIDE_XS_DOWN;

      case 3:
        return CLASS_HIDE_SM_DOWN;

      case 4:
        return CLASS_HIDE_MD_DOWN;

      default:
        return '';
    }
  }
  /**
   * Get the max ratio of a group of pointers.
   * @param {string} pointers - The target pointers.
   * @returns {number} The result ratio.
   */

  function getMaxZoomRatio(pointers) {
    var pointers2 = _objectSpread2({}, pointers);

    var ratios = [];
    forEach(pointers, function (pointer, pointerId) {
      delete pointers2[pointerId];
      forEach(pointers2, function (pointer2) {
        var x1 = Math.abs(pointer.startX - pointer2.startX);
        var y1 = Math.abs(pointer.startY - pointer2.startY);
        var x2 = Math.abs(pointer.endX - pointer2.endX);
        var y2 = Math.abs(pointer.endY - pointer2.endY);
        var z1 = Math.sqrt(x1 * x1 + y1 * y1);
        var z2 = Math.sqrt(x2 * x2 + y2 * y2);
        var ratio = (z2 - z1) / z1;
        ratios.push(ratio);
      });
    });
    ratios.sort(function (a, b) {
      return Math.abs(a) < Math.abs(b);
    });
    return ratios[0];
  }
  /**
   * Get a pointer from an event object.
   * @param {Object} event - The target event object.
   * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
   * @returns {Object} The result pointer contains start and/or end point coordinates.
   */

  function getPointer(_ref2, endOnly) {
    var pageX = _ref2.pageX,
        pageY = _ref2.pageY;
    var end = {
      endX: pageX,
      endY: pageY
    };
    return endOnly ? end : _objectSpread2({
      timeStamp: Date.now(),
      startX: pageX,
      startY: pageY
    }, end);
  }
  /**
   * Get the center point coordinate of a group of pointers.
   * @param {Object} pointers - The target pointers.
   * @returns {Object} The center point coordinate.
   */

  function getPointersCenter(pointers) {
    var pageX = 0;
    var pageY = 0;
    var count = 0;
    forEach(pointers, function (_ref3) {
      var startX = _ref3.startX,
          startY = _ref3.startY;
      pageX += startX;
      pageY += startY;
      count += 1;
    });
    pageX /= count;
    pageY /= count;
    return {
      pageX: pageX,
      pageY: pageY
    };
  }

  var render = {
    render: function render() {
      this.initContainer();
      this.initViewer();
      this.initList();
      this.renderViewer();
    },
    initBody: function initBody() {
      var ownerDocument = this.element.ownerDocument;
      var body = ownerDocument.body || ownerDocument.documentElement;
      this.body = body;
      this.scrollbarWidth = window.innerWidth - ownerDocument.documentElement.clientWidth;
      this.initialBodyPaddingRight = body.style.paddingRight;
      this.initialBodyComputedPaddingRight = window.getComputedStyle(body).paddingRight;
    },
    initContainer: function initContainer() {
      this.containerData = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    initViewer: function initViewer() {
      var options = this.options,
          parent = this.parent;
      var viewerData;

      if (options.inline) {
        viewerData = {
          width: Math.max(parent.offsetWidth, options.minWidth),
          height: Math.max(parent.offsetHeight, options.minHeight)
        };
        this.parentData = viewerData;
      }

      if (this.fulled || !viewerData) {
        viewerData = this.containerData;
      }

      this.viewerData = assign({}, viewerData);
    },
    renderViewer: function renderViewer() {
      if (this.options.inline && !this.fulled) {
        setStyle(this.viewer, this.viewerData);
      }
    },
    initList: function initList() {
      var _this = this;

      var element = this.element,
          options = this.options,
          list = this.list;
      var items = []; // initList may be called in this.update, so should keep idempotent

      list.innerHTML = '';
      forEach(this.images, function (image, index) {
        var src = image.src;
        var alt = image.alt || getImageNameFromURL(src);

        var url = _this.getImageURL(image);

        if (src || url) {
          var item = document.createElement('li');
          var img = document.createElement('img');
          forEach(options.inheritedAttributes, function (name) {
            var value = image.getAttribute(name);

            if (value !== null) {
              img.setAttribute(name, value);
            }
          });
          img.src = src || url;
          img.alt = alt;
          img.setAttribute('data-original-url', url || src);
          item.setAttribute('data-index', index);
          item.setAttribute('data-viewer-action', 'view');
          item.setAttribute('role', 'button');

          if (options.keyboard) {
            item.setAttribute('tabindex', 0);
          }

          item.appendChild(img);
          list.appendChild(item);
          items.push(item);
        }
      });
      this.items = items;
      forEach(items, function (item) {
        var image = item.firstElementChild;
        setData(image, 'filled', true);

        if (options.loading) {
          addClass(item, CLASS_LOADING);
        }

        addListener(image, EVENT_LOAD, function (event) {
          if (options.loading) {
            removeClass(item, CLASS_LOADING);
          }

          _this.loadImage(event);
        }, {
          once: true
        });
      });

      if (options.transition) {
        addListener(element, EVENT_VIEWED, function () {
          addClass(list, CLASS_TRANSITION);
        }, {
          once: true
        });
      }
    },
    renderList: function renderList() {
      var index = this.index;
      var item = this.items[index];
      var next = item.nextElementSibling;
      var gutter = parseInt(window.getComputedStyle(next || item).marginLeft, 10);
      var offsetWidth = item.offsetWidth;
      var outerWidth = offsetWidth + gutter; // Place the active item in the center of the screen

      setStyle(this.list, assign({
        width: outerWidth * this.length - gutter
      }, getTransforms({
        translateX: (this.viewerData.width - offsetWidth) / 2 - outerWidth * index
      })));
    },
    resetList: function resetList() {
      var list = this.list;
      list.innerHTML = '';
      removeClass(list, CLASS_TRANSITION);
      setStyle(list, getTransforms({
        translateX: 0
      }));
    },
    initImage: function initImage(done) {
      var _this2 = this;

      var options = this.options,
          image = this.image,
          viewerData = this.viewerData;
      var footerHeight = this.footer.offsetHeight;
      var viewerWidth = viewerData.width;
      var viewerHeight = Math.max(viewerData.height - footerHeight, footerHeight);
      var oldImageData = this.imageData || {};
      var sizingImage;
      this.imageInitializing = {
        abort: function abort() {
          sizingImage.onload = null;
        }
      };
      sizingImage = getImageNaturalSizes(image, options, function (naturalWidth, naturalHeight) {
        var aspectRatio = naturalWidth / naturalHeight;
        var width = viewerWidth;
        var height = viewerHeight;
        _this2.imageInitializing = false;

        if (viewerHeight * aspectRatio > viewerWidth) {
          height = viewerWidth / aspectRatio;
        } else {
          width = viewerHeight * aspectRatio;
        }

        width = Math.min(width * 0.9, naturalWidth);
        height = Math.min(height * 0.9, naturalHeight);
        var left = (viewerWidth - width) / 2;
        var top = (viewerHeight - height) / 2;
        var imageData = {
          left: left,
          top: top,
          x: left,
          y: top,
          width: width,
          height: height,
          oldRatio: 1,
          ratio: width / naturalWidth,
          aspectRatio: aspectRatio,
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight
        };
        var initialImageData = assign({}, imageData);

        if (options.rotatable) {
          imageData.rotate = oldImageData.rotate || 0;
          initialImageData.rotate = 0;
        }

        if (options.scalable) {
          imageData.scaleX = oldImageData.scaleX || 1;
          imageData.scaleY = oldImageData.scaleY || 1;
          initialImageData.scaleX = 1;
          initialImageData.scaleY = 1;
        }

        _this2.imageData = imageData;
        _this2.initialImageData = initialImageData;

        if (done) {
          done();
        }
      });
    },
    renderImage: function renderImage(done) {
      var _this3 = this;

      var image = this.image,
          imageData = this.imageData;
      setStyle(image, assign({
        width: imageData.width,
        height: imageData.height,
        // XXX: Not to use translateX/Y to avoid image shaking when zooming
        marginLeft: imageData.x,
        marginTop: imageData.y
      }, getTransforms(imageData)));

      if (done) {
        if ((this.viewing || this.moving || this.rotating || this.scaling || this.zooming) && this.options.transition && hasClass(image, CLASS_TRANSITION)) {
          var onTransitionEnd = function onTransitionEnd() {
            _this3.imageRendering = false;
            done();
          };

          this.imageRendering = {
            abort: function abort() {
              removeListener(image, EVENT_TRANSITION_END, onTransitionEnd);
            }
          };
          addListener(image, EVENT_TRANSITION_END, onTransitionEnd, {
            once: true
          });
        } else {
          done();
        }
      }
    },
    resetImage: function resetImage() {
      // this.image only defined after viewed
      if (this.viewing || this.viewed) {
        var image = this.image;

        if (this.viewing) {
          this.viewing.abort();
        }

        image.parentNode.removeChild(image);
        this.image = null;
      }
    }
  };

  var events = {
    bind: function bind() {
      var options = this.options,
          viewer = this.viewer,
          canvas = this.canvas;
      var document = this.element.ownerDocument;
      addListener(viewer, EVENT_CLICK, this.onClick = this.click.bind(this));
      addListener(viewer, EVENT_DRAG_START, this.onDragStart = this.dragstart.bind(this));
      addListener(canvas, EVENT_POINTER_DOWN, this.onPointerDown = this.pointerdown.bind(this));
      addListener(document, EVENT_POINTER_MOVE, this.onPointerMove = this.pointermove.bind(this));
      addListener(document, EVENT_POINTER_UP, this.onPointerUp = this.pointerup.bind(this));
      addListener(document, EVENT_KEY_DOWN, this.onKeyDown = this.keydown.bind(this));
      addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));

      if (options.zoomable && options.zoomOnWheel) {
        addListener(viewer, EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
          passive: false,
          capture: true
        });
      }

      if (options.toggleOnDblclick) {
        addListener(canvas, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
      }
    },
    unbind: function unbind() {
      var options = this.options,
          viewer = this.viewer,
          canvas = this.canvas;
      var document = this.element.ownerDocument;
      removeListener(viewer, EVENT_CLICK, this.onClick);
      removeListener(viewer, EVENT_DRAG_START, this.onDragStart);
      removeListener(canvas, EVENT_POINTER_DOWN, this.onPointerDown);
      removeListener(document, EVENT_POINTER_MOVE, this.onPointerMove);
      removeListener(document, EVENT_POINTER_UP, this.onPointerUp);
      removeListener(document, EVENT_KEY_DOWN, this.onKeyDown);
      removeListener(window, EVENT_RESIZE, this.onResize);

      if (options.zoomable && options.zoomOnWheel) {
        removeListener(viewer, EVENT_WHEEL, this.onWheel, {
          passive: false,
          capture: true
        });
      }

      if (options.toggleOnDblclick) {
        removeListener(canvas, EVENT_DBLCLICK, this.onDblclick);
      }
    }
  };

  var handlers = {
    click: function click(event) {
      var options = this.options,
          imageData = this.imageData;
      var target = event.target;
      var action = getData(target, DATA_ACTION);

      if (!action && target.localName === 'img' && target.parentElement.localName === 'li') {
        target = target.parentElement;
        action = getData(target, DATA_ACTION);
      } // Cancel the emulated click when the native click event was triggered.


      if (IS_TOUCH_DEVICE && event.isTrusted && target === this.canvas) {
        clearTimeout(this.clickCanvasTimeout);
      }

      switch (action) {
        case 'mix':
          if (this.played) {
            this.stop();
          } else if (options.inline) {
            if (this.fulled) {
              this.exit();
            } else {
              this.full();
            }
          } else {
            this.hide();
          }

          break;

        case 'hide':
          this.hide();
          break;

        case 'view':
          this.view(getData(target, 'index'));
          break;

        case 'zoom-in':
          this.zoom(0.1, true);
          break;

        case 'zoom-out':
          this.zoom(-0.1, true);
          break;

        case 'one-to-one':
          this.toggle();
          break;

        case 'reset':
          this.reset();
          break;

        case 'prev':
          this.prev(options.loop);
          break;

        case 'play':
          this.play(options.fullscreen);
          break;

        case 'next':
          this.next(options.loop);
          break;

        case 'rotate-left':
          this.rotate(-90);
          break;

        case 'rotate-right':
          this.rotate(90);
          break;

        case 'flip-horizontal':
          this.scaleX(-imageData.scaleX || -1);
          break;

        case 'flip-vertical':
          this.scaleY(-imageData.scaleY || -1);
          break;

        default:
          if (this.played) {
            this.stop();
          }

      }
    },
    dblclick: function dblclick(event) {
      event.preventDefault();

      if (this.viewed && event.target === this.image) {
        // Cancel the emulated double click when the native dblclick event was triggered.
        if (IS_TOUCH_DEVICE && event.isTrusted) {
          clearTimeout(this.doubleClickImageTimeout);
        }

        this.toggle(event);
      }
    },
    load: function load() {
      var _this = this;

      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = false;
      }

      var element = this.element,
          options = this.options,
          image = this.image,
          index = this.index,
          viewerData = this.viewerData;
      removeClass(image, CLASS_INVISIBLE);

      if (options.loading) {
        removeClass(this.canvas, CLASS_LOADING);
      }

      image.style.cssText = 'height:0;' + "margin-left:".concat(viewerData.width / 2, "px;") + "margin-top:".concat(viewerData.height / 2, "px;") + 'max-width:none!important;' + 'position:relative;' + 'width:0;';
      this.initImage(function () {
        toggleClass(image, CLASS_MOVE, options.movable);
        toggleClass(image, CLASS_TRANSITION, options.transition);

        _this.renderImage(function () {
          _this.viewed = true;
          _this.viewing = false;

          if (isFunction(options.viewed)) {
            addListener(element, EVENT_VIEWED, options.viewed, {
              once: true
            });
          }

          dispatchEvent(element, EVENT_VIEWED, {
            originalImage: _this.images[index],
            index: index,
            image: image
          }, {
            cancelable: false
          });
        });
      });
    },
    loadImage: function loadImage(event) {
      var image = event.target;
      var parent = image.parentNode;
      var parentWidth = parent.offsetWidth || 30;
      var parentHeight = parent.offsetHeight || 50;
      var filled = !!getData(image, 'filled');
      getImageNaturalSizes(image, this.options, function (naturalWidth, naturalHeight) {
        var aspectRatio = naturalWidth / naturalHeight;
        var width = parentWidth;
        var height = parentHeight;

        if (parentHeight * aspectRatio > parentWidth) {
          if (filled) {
            width = parentHeight * aspectRatio;
          } else {
            height = parentWidth / aspectRatio;
          }
        } else if (filled) {
          height = parentWidth / aspectRatio;
        } else {
          width = parentHeight * aspectRatio;
        }

        setStyle(image, assign({
          width: width,
          height: height
        }, getTransforms({
          translateX: (parentWidth - width) / 2,
          translateY: (parentHeight - height) / 2
        })));
      });
    },
    keydown: function keydown(event) {
      var options = this.options;

      if (!options.keyboard) {
        return;
      }

      var keyCode = event.keyCode || event.which || event.charCode;

      switch (keyCode) {
        // Enter
        case 13:
          if (this.viewer.contains(event.target)) {
            this.click(event);
          }

          break;
      }

      if (!this.fulled) {
        return;
      }

      switch (keyCode) {
        // Escape
        case 27:
          if (this.played) {
            this.stop();
          } else if (options.inline) {
            if (this.fulled) {
              this.exit();
            }
          } else {
            this.hide();
          }

          break;
        // Space

        case 32:
          if (this.played) {
            this.stop();
          }

          break;
        // ArrowLeft

        case 37:
          this.prev(options.loop);
          break;
        // ArrowUp

        case 38:
          // Prevent scroll on Firefox
          event.preventDefault(); // Zoom in

          this.zoom(options.zoomRatio, true);
          break;
        // ArrowRight

        case 39:
          this.next(options.loop);
          break;
        // ArrowDown

        case 40:
          // Prevent scroll on Firefox
          event.preventDefault(); // Zoom out

          this.zoom(-options.zoomRatio, true);
          break;
        // Ctrl + 0

        case 48: // Fall through
        // Ctrl + 1
        // eslint-disable-next-line no-fallthrough

        case 49:
          if (event.ctrlKey) {
            event.preventDefault();
            this.toggle();
          }

          break;
      }
    },
    dragstart: function dragstart(event) {
      if (event.target.localName === 'img') {
        event.preventDefault();
      }
    },
    pointerdown: function pointerdown(event) {
      var options = this.options,
          pointers = this.pointers;
      var buttons = event.buttons,
          button = event.button;

      if (!this.viewed || this.showing || this.viewing || this.hiding // Handle mouse event and pointer event and ignore touch event
      || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && ( // No primary button (Usually the left button)
      isNumber(buttons) && buttons !== 1 || isNumber(button) && button !== 0 // Open context menu
      || event.ctrlKey)) {
        return;
      } // Prevent default behaviours as page zooming in touch devices.


      event.preventDefault();

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          pointers[touch.identifier] = getPointer(touch);
        });
      } else {
        pointers[event.pointerId || 0] = getPointer(event);
      }

      var action = options.movable ? ACTION_MOVE : false;

      if (options.zoomOnTouch && options.zoomable && Object.keys(pointers).length > 1) {
        action = ACTION_ZOOM;
      } else if (options.slideOnTouch && (event.pointerType === 'touch' || event.type === 'touchstart') && this.isSwitchable()) {
        action = ACTION_SWITCH;
      }

      if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
        removeClass(this.image, CLASS_TRANSITION);
      }

      this.action = action;
    },
    pointermove: function pointermove(event) {
      var pointers = this.pointers,
          action = this.action;

      if (!this.viewed || !action) {
        return;
      }

      event.preventDefault();

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          assign(pointers[touch.identifier] || {}, getPointer(touch, true));
        });
      } else {
        assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
      }

      this.change(event);
    },
    pointerup: function pointerup(event) {
      var _this2 = this;

      var options = this.options,
          action = this.action,
          pointers = this.pointers;
      var pointer;

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          pointer = pointers[touch.identifier];
          delete pointers[touch.identifier];
        });
      } else {
        pointer = pointers[event.pointerId || 0];
        delete pointers[event.pointerId || 0];
      }

      if (!action) {
        return;
      }

      event.preventDefault();

      if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
        addClass(this.image, CLASS_TRANSITION);
      }

      this.action = false; // Emulate click and double click in touch devices to support backdrop and image zooming (#210).

      if (IS_TOUCH_DEVICE && action !== ACTION_ZOOM && pointer && Date.now() - pointer.timeStamp < 500) {
        clearTimeout(this.clickCanvasTimeout);
        clearTimeout(this.doubleClickImageTimeout);

        if (options.toggleOnDblclick && this.viewed && event.target === this.image) {
          if (this.imageClicked) {
            this.imageClicked = false; // This timeout will be cleared later when a native dblclick event is triggering

            this.doubleClickImageTimeout = setTimeout(function () {
              dispatchEvent(_this2.image, EVENT_DBLCLICK);
            }, 50);
          } else {
            this.imageClicked = true; // The default timing of a double click in Windows is 500 ms

            this.doubleClickImageTimeout = setTimeout(function () {
              _this2.imageClicked = false;
            }, 500);
          }
        } else {
          this.imageClicked = false;

          if (options.backdrop && options.backdrop !== 'static' && event.target === this.canvas) {
            // This timeout will be cleared later when a native click event is triggering
            this.clickCanvasTimeout = setTimeout(function () {
              dispatchEvent(_this2.canvas, EVENT_CLICK);
            }, 50);
          }
        }
      }
    },
    resize: function resize() {
      var _this3 = this;

      if (!this.isShown || this.hiding) {
        return;
      }

      if (this.fulled) {
        this.close();
        this.initBody();
        this.open();
      }

      this.initContainer();
      this.initViewer();
      this.renderViewer();
      this.renderList();

      if (this.viewed) {
        this.initImage(function () {
          _this3.renderImage();
        });
      }

      if (this.played) {
        if (this.options.fullscreen && this.fulled && !(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
          this.stop();
          return;
        }

        forEach(this.player.getElementsByTagName('img'), function (image) {
          addListener(image, EVENT_LOAD, _this3.loadImage.bind(_this3), {
            once: true
          });
          dispatchEvent(image, EVENT_LOAD);
        });
      }
    },
    wheel: function wheel(event) {
      var _this4 = this;

      if (!this.viewed) {
        return;
      }

      event.preventDefault(); // Limit wheel speed to prevent zoom too fast

      if (this.wheeling) {
        return;
      }

      this.wheeling = true;
      setTimeout(function () {
        _this4.wheeling = false;
      }, 50);
      var ratio = Number(this.options.zoomRatio) || 0.1;
      var delta = 1;

      if (event.deltaY) {
        delta = event.deltaY > 0 ? 1 : -1;
      } else if (event.wheelDelta) {
        delta = -event.wheelDelta / 120;
      } else if (event.detail) {
        delta = event.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, true, event);
    }
  };

  var methods = {
    /** Show the viewer (only available in modal mode)
     * @param {boolean} [immediate=false] - Indicates if show the viewer immediately or not.
     * @returns {Viewer} this
     */
    show: function show() {
      var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var element = this.element,
          options = this.options;

      if (options.inline || this.showing || this.isShown || this.showing) {
        return this;
      }

      if (!this.ready) {
        this.build();

        if (this.ready) {
          this.show(immediate);
        }

        return this;
      }

      if (isFunction(options.show)) {
        addListener(element, EVENT_SHOW, options.show, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_SHOW) === false || !this.ready) {
        return this;
      }

      if (this.hiding) {
        this.transitioning.abort();
      }

      this.showing = true;
      this.open();
      var viewer = this.viewer;
      removeClass(viewer, CLASS_HIDE);
      viewer.setAttribute('role', 'dialog');
      viewer.setAttribute('aria-labelledby', this.title.id);
      viewer.setAttribute('aria-modal', true);
      viewer.removeAttribute('aria-hidden');

      if (options.transition && !immediate) {
        var shown = this.shown.bind(this);
        this.transitioning = {
          abort: function abort() {
            removeListener(viewer, EVENT_TRANSITION_END, shown);
            removeClass(viewer, CLASS_IN);
          }
        };
        addClass(viewer, CLASS_TRANSITION); // Force reflow to enable CSS3 transition

        viewer.initialOffsetWidth = viewer.offsetWidth;
        addListener(viewer, EVENT_TRANSITION_END, shown, {
          once: true
        });
        addClass(viewer, CLASS_IN);
      } else {
        addClass(viewer, CLASS_IN);
        this.shown();
      }

      return this;
    },

    /**
     * Hide the viewer (only available in modal mode)
     * @param {boolean} [immediate=false] - Indicates if hide the viewer immediately or not.
     * @returns {Viewer} this
     */
    hide: function hide() {
      var _this = this;

      var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var element = this.element,
          options = this.options;

      if (options.inline || this.hiding || !(this.isShown || this.showing)) {
        return this;
      }

      if (isFunction(options.hide)) {
        addListener(element, EVENT_HIDE, options.hide, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_HIDE) === false) {
        return this;
      }

      if (this.showing) {
        this.transitioning.abort();
      }

      this.hiding = true;

      if (this.played) {
        this.stop();
      } else if (this.viewing) {
        this.viewing.abort();
      }

      var viewer = this.viewer,
          image = this.image;

      var hideImmediately = function hideImmediately() {
        removeClass(viewer, CLASS_IN);

        _this.hidden();
      };

      if (options.transition && !immediate) {
        var onViewerTransitionEnd = function onViewerTransitionEnd(event) {
          // Ignore all propagating `transitionend` events (#275).
          if (event && event.target === viewer) {
            removeListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);

            _this.hidden();
          }
        };

        var onImageTransitionEnd = function onImageTransitionEnd() {
          // In case of show the viewer by `viewer.show(true)` previously (#407).
          if (hasClass(viewer, CLASS_TRANSITION)) {
            addListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
            removeClass(viewer, CLASS_IN);
          } else {
            hideImmediately();
          }
        };

        this.transitioning = {
          abort: function abort() {
            if (_this.viewed && hasClass(image, CLASS_TRANSITION)) {
              removeListener(image, EVENT_TRANSITION_END, onImageTransitionEnd);
            } else if (hasClass(viewer, CLASS_TRANSITION)) {
              removeListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
            }
          }
        }; // In case of hiding the viewer when holding on the image (#255),
        // note that the `CLASS_TRANSITION` class will be removed on pointer down.

        if (this.viewed && hasClass(image, CLASS_TRANSITION)) {
          addListener(image, EVENT_TRANSITION_END, onImageTransitionEnd, {
            once: true
          });
          this.zoomTo(0, false, null, true);
        } else {
          onImageTransitionEnd();
        }
      } else {
        hideImmediately();
      }

      return this;
    },

    /**
     * View one of the images with image's index
     * @param {number} index - The index of the image to view.
     * @returns {Viewer} this
     */
    view: function view() {
      var _this2 = this;

      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.initialViewIndex;
      index = Number(index) || 0;

      if (this.hiding || this.played || index < 0 || index >= this.length || this.viewed && index === this.index) {
        return this;
      }

      if (!this.isShown) {
        this.index = index;
        return this.show();
      }

      if (this.viewing) {
        this.viewing.abort();
      }

      var element = this.element,
          options = this.options,
          title = this.title,
          canvas = this.canvas;
      var item = this.items[index];
      var img = item.querySelector('img');
      var url = getData(img, 'originalUrl');
      var alt = img.getAttribute('alt');
      var image = document.createElement('img');
      forEach(options.inheritedAttributes, function (name) {
        var value = img.getAttribute(name);

        if (value !== null) {
          image.setAttribute(name, value);
        }
      });
      image.src = url;
      image.alt = alt;

      if (isFunction(options.view)) {
        addListener(element, EVENT_VIEW, options.view, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_VIEW, {
        originalImage: this.images[index],
        index: index,
        image: image
      }) === false || !this.isShown || this.hiding || this.played) {
        return this;
      }

      var activeItem = this.items[this.index];

      if (activeItem) {
        removeClass(activeItem, CLASS_ACTIVE);
        activeItem.removeAttribute('aria-selected');
      }

      addClass(item, CLASS_ACTIVE);
      item.setAttribute('aria-selected', true);

      if (options.focus) {
        item.focus();
      }

      this.image = image;
      this.viewed = false;
      this.index = index;
      this.imageData = {};
      addClass(image, CLASS_INVISIBLE);

      if (options.loading) {
        addClass(canvas, CLASS_LOADING);
      }

      canvas.innerHTML = '';
      canvas.appendChild(image); // Center current item

      this.renderList(); // Clear title

      title.innerHTML = ''; // Generate title after viewed

      var onViewed = function onViewed() {
        var imageData = _this2.imageData;
        var render = Array.isArray(options.title) ? options.title[1] : options.title;
        title.innerHTML = escapeHTMLEntities(isFunction(render) ? render.call(_this2, image, imageData) : "".concat(alt, " (").concat(imageData.naturalWidth, " \xD7 ").concat(imageData.naturalHeight, ")"));
      };

      var onLoad;
      addListener(element, EVENT_VIEWED, onViewed, {
        once: true
      });
      this.viewing = {
        abort: function abort() {
          removeListener(element, EVENT_VIEWED, onViewed);

          if (image.complete) {
            if (_this2.imageRendering) {
              _this2.imageRendering.abort();
            } else if (_this2.imageInitializing) {
              _this2.imageInitializing.abort();
            }
          } else {
            // Cancel download to save bandwidth.
            image.src = '';
            removeListener(image, EVENT_LOAD, onLoad);

            if (_this2.timeout) {
              clearTimeout(_this2.timeout);
            }
          }
        }
      };

      if (image.complete) {
        this.load();
      } else {
        addListener(image, EVENT_LOAD, onLoad = this.load.bind(this), {
          once: true
        });

        if (this.timeout) {
          clearTimeout(this.timeout);
        } // Make the image visible if it fails to load within 1s


        this.timeout = setTimeout(function () {
          removeClass(image, CLASS_INVISIBLE);
          _this2.timeout = false;
        }, 1000);
      }

      return this;
    },

    /**
     * View the previous image
     * @param {boolean} [loop=false] - Indicate if view the last one
     * when it is the first one at present.
     * @returns {Viewer} this
     */
    prev: function prev() {
      var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var index = this.index - 1;

      if (index < 0) {
        index = loop ? this.length - 1 : 0;
      }

      this.view(index);
      return this;
    },

    /**
     * View the next image
     * @param {boolean} [loop=false] - Indicate if view the first one
     * when it is the last one at present.
     * @returns {Viewer} this
     */
    next: function next() {
      var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var maxIndex = this.length - 1;
      var index = this.index + 1;

      if (index > maxIndex) {
        index = loop ? 0 : maxIndex;
      }

      this.view(index);
      return this;
    },

    /**
     * Move the image with relative offsets.
     * @param {number} x - The moving distance in the horizontal direction.
     * @param {number} [y=x] The moving distance in the vertical direction.
     * @returns {Viewer} this
     */
    move: function move(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var imageData = this.imageData;
      this.moveTo(isUndefined(x) ? x : imageData.x + Number(x), isUndefined(y) ? y : imageData.y + Number(y));
      return this;
    },

    /**
     * Move the image to an absolute point.
     * @param {number} x - The new position in the horizontal direction.
     * @param {number} [y=x] - The new position in the vertical direction.
     * @param {Event} [_originalEvent=null] - The original event if any.
     * @returns {Viewer} this
     */
    moveTo: function moveTo(x) {
      var _this3 = this;

      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

      var _originalEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var element = this.element,
          options = this.options,
          imageData = this.imageData;
      x = Number(x);
      y = Number(y);

      if (this.viewed && !this.played && options.movable) {
        var oldX = imageData.x;
        var oldY = imageData.y;
        var changed = false;

        if (isNumber(x)) {
          changed = true;
        } else {
          x = oldX;
        }

        if (isNumber(y)) {
          changed = true;
        } else {
          y = oldY;
        }

        if (changed) {
          if (isFunction(options.move)) {
            addListener(element, EVENT_MOVE, options.move, {
              once: true
            });
          }

          if (dispatchEvent(element, EVENT_MOVE, {
            x: x,
            y: y,
            oldX: oldX,
            oldY: oldY,
            originalEvent: _originalEvent
          }) === false) {
            return this;
          }

          imageData.x = x;
          imageData.y = y;
          imageData.left = x;
          imageData.top = y;
          this.moving = true;
          this.renderImage(function () {
            _this3.moving = false;

            if (isFunction(options.moved)) {
              addListener(element, EVENT_MOVED, options.moved, {
                once: true
              });
            }

            dispatchEvent(element, EVENT_MOVED, {
              x: x,
              y: y,
              oldX: oldX,
              oldY: oldY,
              originalEvent: _originalEvent
            }, {
              cancelable: false
            });
          });
        }
      }

      return this;
    },

    /**
     * Rotate the image with a relative degree.
     * @param {number} degree - The rotate degree.
     * @returns {Viewer} this
     */
    rotate: function rotate(degree) {
      this.rotateTo((this.imageData.rotate || 0) + Number(degree));
      return this;
    },

    /**
     * Rotate the image to an absolute degree.
     * @param {number} degree - The rotate degree.
     * @returns {Viewer} this
     */
    rotateTo: function rotateTo(degree) {
      var _this4 = this;

      var element = this.element,
          options = this.options,
          imageData = this.imageData;
      degree = Number(degree);

      if (isNumber(degree) && this.viewed && !this.played && options.rotatable) {
        var oldDegree = imageData.rotate;

        if (isFunction(options.rotate)) {
          addListener(element, EVENT_ROTATE, options.rotate, {
            once: true
          });
        }

        if (dispatchEvent(element, EVENT_ROTATE, {
          degree: degree,
          oldDegree: oldDegree
        }) === false) {
          return this;
        }

        imageData.rotate = degree;
        this.rotating = true;
        this.renderImage(function () {
          _this4.rotating = false;

          if (isFunction(options.rotated)) {
            addListener(element, EVENT_ROTATED, options.rotated, {
              once: true
            });
          }

          dispatchEvent(element, EVENT_ROTATED, {
            degree: degree,
            oldDegree: oldDegree
          }, {
            cancelable: false
          });
        });
      }

      return this;
    },

    /**
     * Scale the image on the x-axis.
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @returns {Viewer} this
     */
    scaleX: function scaleX(_scaleX) {
      this.scale(_scaleX, this.imageData.scaleY);
      return this;
    },

    /**
     * Scale the image on the y-axis.
     * @param {number} scaleY - The scale ratio on the y-axis.
     * @returns {Viewer} this
     */
    scaleY: function scaleY(_scaleY) {
      this.scale(this.imageData.scaleX, _scaleY);
      return this;
    },

    /**
     * Scale the image.
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
     * @returns {Viewer} this
     */
    scale: function scale(scaleX) {
      var _this5 = this;

      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;
      var element = this.element,
          options = this.options,
          imageData = this.imageData;
      scaleX = Number(scaleX);
      scaleY = Number(scaleY);

      if (this.viewed && !this.played && options.scalable) {
        var oldScaleX = imageData.scaleX;
        var oldScaleY = imageData.scaleY;
        var changed = false;

        if (isNumber(scaleX)) {
          changed = true;
        } else {
          scaleX = oldScaleX;
        }

        if (isNumber(scaleY)) {
          changed = true;
        } else {
          scaleY = oldScaleY;
        }

        if (changed) {
          if (isFunction(options.scale)) {
            addListener(element, EVENT_SCALE, options.scale, {
              once: true
            });
          }

          if (dispatchEvent(element, EVENT_SCALE, {
            scaleX: scaleX,
            scaleY: scaleY,
            oldScaleX: oldScaleX,
            oldScaleY: oldScaleY
          }) === false) {
            return this;
          }

          imageData.scaleX = scaleX;
          imageData.scaleY = scaleY;
          this.scaling = true;
          this.renderImage(function () {
            _this5.scaling = false;

            if (isFunction(options.scaled)) {
              addListener(element, EVENT_SCALED, options.scaled, {
                once: true
              });
            }

            dispatchEvent(element, EVENT_SCALED, {
              scaleX: scaleX,
              scaleY: scaleY,
              oldScaleX: oldScaleX,
              oldScaleY: oldScaleY
            }, {
              cancelable: false
            });
          });
        }
      }

      return this;
    },

    /**
     * Zoom the image with a relative ratio.
     * @param {number} ratio - The target ratio.
     * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
     * @param {Event} [_originalEvent=null] - The original event if any.
     * @returns {Viewer} this
     */
    zoom: function zoom(ratio) {
      var hasTooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _originalEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var imageData = this.imageData;
      ratio = Number(ratio);

      if (ratio < 0) {
        ratio = 1 / (1 - ratio);
      } else {
        ratio = 1 + ratio;
      }

      this.zoomTo(imageData.width * ratio / imageData.naturalWidth, hasTooltip, _originalEvent);
      return this;
    },

    /**
     * Zoom the image to an absolute ratio.
     * @param {number} ratio - The target ratio.
     * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
     * @param {Event} [_originalEvent=null] - The original event if any.
     * @param {Event} [_zoomable=false] - Indicates if the current zoom is available or not.
     * @returns {Viewer} this
     */
    zoomTo: function zoomTo(ratio) {
      var _this6 = this;

      var hasTooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _originalEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var _zoomable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var element = this.element,
          options = this.options,
          pointers = this.pointers,
          imageData = this.imageData;
      var x = imageData.x,
          y = imageData.y,
          width = imageData.width,
          height = imageData.height,
          naturalWidth = imageData.naturalWidth,
          naturalHeight = imageData.naturalHeight;
      ratio = Math.max(0, ratio);

      if (isNumber(ratio) && this.viewed && !this.played && (_zoomable || options.zoomable)) {
        if (!_zoomable) {
          var minZoomRatio = Math.max(0.01, options.minZoomRatio);
          var maxZoomRatio = Math.min(100, options.maxZoomRatio);
          ratio = Math.min(Math.max(ratio, minZoomRatio), maxZoomRatio);
        }

        if (_originalEvent && options.zoomRatio >= 0.055 && ratio > 0.95 && ratio < 1.05) {
          ratio = 1;
        }

        var newWidth = naturalWidth * ratio;
        var newHeight = naturalHeight * ratio;
        var offsetWidth = newWidth - width;
        var offsetHeight = newHeight - height;
        var oldRatio = imageData.ratio;

        if (isFunction(options.zoom)) {
          addListener(element, EVENT_ZOOM, options.zoom, {
            once: true
          });
        }

        if (dispatchEvent(element, EVENT_ZOOM, {
          ratio: ratio,
          oldRatio: oldRatio,
          originalEvent: _originalEvent
        }) === false) {
          return this;
        }

        this.zooming = true;

        if (_originalEvent) {
          var offset = getOffset(this.viewer);
          var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
            pageX: _originalEvent.pageX,
            pageY: _originalEvent.pageY
          }; // Zoom from the triggering point of the event

          imageData.x -= offsetWidth * ((center.pageX - offset.left - x) / width);
          imageData.y -= offsetHeight * ((center.pageY - offset.top - y) / height);
        } else {
          // Zoom from the center of the image
          imageData.x -= offsetWidth / 2;
          imageData.y -= offsetHeight / 2;
        }

        imageData.left = imageData.x;
        imageData.top = imageData.y;
        imageData.width = newWidth;
        imageData.height = newHeight;
        imageData.oldRatio = oldRatio;
        imageData.ratio = ratio;
        this.renderImage(function () {
          _this6.zooming = false;

          if (isFunction(options.zoomed)) {
            addListener(element, EVENT_ZOOMED, options.zoomed, {
              once: true
            });
          }

          dispatchEvent(element, EVENT_ZOOMED, {
            ratio: ratio,
            oldRatio: oldRatio,
            originalEvent: _originalEvent
          }, {
            cancelable: false
          });
        });

        if (hasTooltip) {
          this.tooltip();
        }
      }

      return this;
    },

    /**
     * Play the images
     * @param {boolean|FullscreenOptions} [fullscreen=false] - Indicate if request fullscreen or not.
     * @returns {Viewer} this
     */
    play: function play() {
      var _this7 = this;

      var fullscreen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.isShown || this.played) {
        return this;
      }

      var element = this.element,
          options = this.options;

      if (isFunction(options.play)) {
        addListener(element, EVENT_PLAY, options.play, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_PLAY) === false) {
        return this;
      }

      var player = this.player;
      var onLoad = this.loadImage.bind(this);
      var list = [];
      var total = 0;
      var index = 0;
      this.played = true;
      this.onLoadWhenPlay = onLoad;

      if (fullscreen) {
        this.requestFullscreen(fullscreen);
      }

      addClass(player, CLASS_SHOW);
      forEach(this.items, function (item, i) {
        var img = item.querySelector('img');
        var image = document.createElement('img');
        image.src = getData(img, 'originalUrl');
        image.alt = img.getAttribute('alt');
        image.referrerPolicy = img.referrerPolicy;
        total += 1;
        addClass(image, CLASS_FADE);
        toggleClass(image, CLASS_TRANSITION, options.transition);

        if (hasClass(item, CLASS_ACTIVE)) {
          addClass(image, CLASS_IN);
          index = i;
        }

        list.push(image);
        addListener(image, EVENT_LOAD, onLoad, {
          once: true
        });
        player.appendChild(image);
      });

      if (isNumber(options.interval) && options.interval > 0) {
        var play = function play() {
          _this7.playing = setTimeout(function () {
            removeClass(list[index], CLASS_IN);
            index += 1;
            index = index < total ? index : 0;
            addClass(list[index], CLASS_IN);
            play();
          }, options.interval);
        };

        if (total > 1) {
          play();
        }
      }

      return this;
    },
    // Stop play
    stop: function stop() {
      var _this8 = this;

      if (!this.played) {
        return this;
      }

      var element = this.element,
          options = this.options;

      if (isFunction(options.stop)) {
        addListener(element, EVENT_STOP, options.stop, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_STOP) === false) {
        return this;
      }

      var player = this.player;
      this.played = false;
      clearTimeout(this.playing);
      forEach(player.getElementsByTagName('img'), function (image) {
        removeListener(image, EVENT_LOAD, _this8.onLoadWhenPlay);
      });
      removeClass(player, CLASS_SHOW);
      player.innerHTML = '';
      this.exitFullscreen();
      return this;
    },
    // Enter modal mode (only available in inline mode)
    full: function full() {
      var _this9 = this;

      var options = this.options,
          viewer = this.viewer,
          image = this.image,
          list = this.list;

      if (!this.isShown || this.played || this.fulled || !options.inline) {
        return this;
      }

      this.fulled = true;
      this.open();
      addClass(this.button, CLASS_FULLSCREEN_EXIT);

      if (options.transition) {
        removeClass(list, CLASS_TRANSITION);

        if (this.viewed) {
          removeClass(image, CLASS_TRANSITION);
        }
      }

      addClass(viewer, CLASS_FIXED);
      viewer.setAttribute('role', 'dialog');
      viewer.setAttribute('aria-labelledby', this.title.id);
      viewer.setAttribute('aria-modal', true);
      viewer.removeAttribute('style');
      setStyle(viewer, {
        zIndex: options.zIndex
      });

      if (options.focus) {
        this.enforceFocus();
      }

      this.initContainer();
      this.viewerData = assign({}, this.containerData);
      this.renderList();

      if (this.viewed) {
        this.initImage(function () {
          _this9.renderImage(function () {
            if (options.transition) {
              setTimeout(function () {
                addClass(image, CLASS_TRANSITION);
                addClass(list, CLASS_TRANSITION);
              }, 0);
            }
          });
        });
      }

      return this;
    },
    // Exit modal mode (only available in inline mode)
    exit: function exit() {
      var _this10 = this;

      var options = this.options,
          viewer = this.viewer,
          image = this.image,
          list = this.list;

      if (!this.isShown || this.played || !this.fulled || !options.inline) {
        return this;
      }

      this.fulled = false;
      this.close();
      removeClass(this.button, CLASS_FULLSCREEN_EXIT);

      if (options.transition) {
        removeClass(list, CLASS_TRANSITION);

        if (this.viewed) {
          removeClass(image, CLASS_TRANSITION);
        }
      }

      if (options.focus) {
        this.clearEnforceFocus();
      }

      viewer.removeAttribute('role');
      viewer.removeAttribute('aria-labelledby');
      viewer.removeAttribute('aria-modal');
      removeClass(viewer, CLASS_FIXED);
      setStyle(viewer, {
        zIndex: options.zIndexInline
      });
      this.viewerData = assign({}, this.parentData);
      this.renderViewer();
      this.renderList();

      if (this.viewed) {
        this.initImage(function () {
          _this10.renderImage(function () {
            if (options.transition) {
              setTimeout(function () {
                addClass(image, CLASS_TRANSITION);
                addClass(list, CLASS_TRANSITION);
              }, 0);
            }
          });
        });
      }

      return this;
    },
    // Show the current ratio of the image with percentage
    tooltip: function tooltip() {
      var _this11 = this;

      var options = this.options,
          tooltipBox = this.tooltipBox,
          imageData = this.imageData;

      if (!this.viewed || this.played || !options.tooltip) {
        return this;
      }

      tooltipBox.textContent = "".concat(Math.round(imageData.ratio * 100), "%");

      if (!this.tooltipping) {
        if (options.transition) {
          if (this.fading) {
            dispatchEvent(tooltipBox, EVENT_TRANSITION_END);
          }

          addClass(tooltipBox, CLASS_SHOW);
          addClass(tooltipBox, CLASS_FADE);
          addClass(tooltipBox, CLASS_TRANSITION);
          tooltipBox.removeAttribute('aria-hidden'); // Force reflow to enable CSS3 transition

          tooltipBox.initialOffsetWidth = tooltipBox.offsetWidth;
          addClass(tooltipBox, CLASS_IN);
        } else {
          addClass(tooltipBox, CLASS_SHOW);
          tooltipBox.removeAttribute('aria-hidden');
        }
      } else {
        clearTimeout(this.tooltipping);
      }

      this.tooltipping = setTimeout(function () {
        if (options.transition) {
          addListener(tooltipBox, EVENT_TRANSITION_END, function () {
            removeClass(tooltipBox, CLASS_SHOW);
            removeClass(tooltipBox, CLASS_FADE);
            removeClass(tooltipBox, CLASS_TRANSITION);
            tooltipBox.setAttribute('aria-hidden', true);
            _this11.fading = false;
          }, {
            once: true
          });
          removeClass(tooltipBox, CLASS_IN);
          _this11.fading = true;
        } else {
          removeClass(tooltipBox, CLASS_SHOW);
          tooltipBox.setAttribute('aria-hidden', true);
        }

        _this11.tooltipping = false;
      }, 1000);
      return this;
    },

    /**
     * Toggle the image size between its current size and natural size
     * @param {Event} [_originalEvent=null] - The original event if any.
     * @returns {Viewer} this
     */
    toggle: function toggle() {
      var _originalEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (this.imageData.ratio === 1) {
        this.zoomTo(this.imageData.oldRatio, true, _originalEvent);
      } else {
        this.zoomTo(1, true, _originalEvent);
      }

      return this;
    },
    // Reset the image to its initial state
    reset: function reset() {
      if (this.viewed && !this.played) {
        this.imageData = assign({}, this.initialImageData);
        this.renderImage();
      }

      return this;
    },
    // Update viewer when images changed
    update: function update() {
      var _this12 = this;

      var element = this.element,
          options = this.options,
          isImg = this.isImg; // Destroy viewer if the target image was deleted

      if (isImg && !element.parentNode) {
        return this.destroy();
      }

      var images = [];
      forEach(isImg ? [element] : element.querySelectorAll('img'), function (image) {
        if (isFunction(options.filter)) {
          if (options.filter.call(_this12, image)) {
            images.push(image);
          }
        } else if (_this12.getImageURL(image)) {
          images.push(image);
        }
      });

      if (!images.length) {
        return this;
      }

      this.images = images;
      this.length = images.length;

      if (this.ready) {
        var changedIndexes = [];
        forEach(this.items, function (item, i) {
          var img = item.querySelector('img');
          var image = images[i];

          if (image && img) {
            if (image.src !== img.src // Title changed (#408)
            || image.alt !== img.alt) {
              changedIndexes.push(i);
            }
          } else {
            changedIndexes.push(i);
          }
        });
        setStyle(this.list, {
          width: 'auto'
        });
        this.initList();

        if (this.isShown) {
          if (this.length) {
            if (this.viewed) {
              var changedIndex = changedIndexes.indexOf(this.index);

              if (changedIndex >= 0) {
                this.viewed = false;
                this.view(Math.max(Math.min(this.index - changedIndex, this.length - 1), 0));
              } else {
                var activeItem = this.items[this.index]; // Reactivate the current viewing item after reset the list.

                addClass(activeItem, CLASS_ACTIVE);
                activeItem.setAttribute('aria-selected', true);
              }
            }
          } else {
            this.image = null;
            this.viewed = false;
            this.index = 0;
            this.imageData = {};
            this.canvas.innerHTML = '';
            this.title.innerHTML = '';
          }
        }
      } else {
        this.build();
      }

      return this;
    },
    // Destroy the viewer
    destroy: function destroy() {
      var element = this.element,
          options = this.options;

      if (!element[NAMESPACE]) {
        return this;
      }

      this.destroyed = true;

      if (this.ready) {
        if (this.played) {
          this.stop();
        }

        if (options.inline) {
          if (this.fulled) {
            this.exit();
          }

          this.unbind();
        } else if (this.isShown) {
          if (this.viewing) {
            if (this.imageRendering) {
              this.imageRendering.abort();
            } else if (this.imageInitializing) {
              this.imageInitializing.abort();
            }
          }

          if (this.hiding) {
            this.transitioning.abort();
          }

          this.hidden();
        } else if (this.showing) {
          this.transitioning.abort();
          this.hidden();
        }

        this.ready = false;
        this.viewer.parentNode.removeChild(this.viewer);
      } else if (options.inline) {
        if (this.delaying) {
          this.delaying.abort();
        } else if (this.initializing) {
          this.initializing.abort();
        }
      }

      if (!options.inline) {
        removeListener(element, EVENT_CLICK, this.onStart);
      }

      element[NAMESPACE] = undefined;
      return this;
    }
  };

  var others = {
    getImageURL: function getImageURL(image) {
      var url = this.options.url;

      if (isString(url)) {
        url = image.getAttribute(url);
      } else if (isFunction(url)) {
        url = url.call(this, image);
      } else {
        url = '';
      }

      return url;
    },
    enforceFocus: function enforceFocus() {
      var _this = this;

      this.clearEnforceFocus();
      addListener(document, EVENT_FOCUSIN, this.onFocusin = function (event) {
        var viewer = _this.viewer;
        var target = event.target;

        if (target !== document && target !== viewer && !viewer.contains(target) // Avoid conflicts with other modals (#474)
        && (target.getAttribute('tabindex') === null || target.getAttribute('aria-modal') !== 'true')) {
          viewer.focus();
        }
      });
    },
    clearEnforceFocus: function clearEnforceFocus() {
      if (this.onFocusin) {
        removeListener(document, EVENT_FOCUSIN, this.onFocusin);
        this.onFocusin = null;
      }
    },
    open: function open() {
      var body = this.body;
      addClass(body, CLASS_OPEN);
      body.style.paddingRight = "".concat(this.scrollbarWidth + (parseFloat(this.initialBodyComputedPaddingRight) || 0), "px");
    },
    close: function close() {
      var body = this.body;
      removeClass(body, CLASS_OPEN);
      body.style.paddingRight = this.initialBodyPaddingRight;
    },
    shown: function shown() {
      var element = this.element,
          options = this.options,
          viewer = this.viewer;
      this.fulled = true;
      this.isShown = true;
      this.render();
      this.bind();
      this.showing = false;

      if (options.focus) {
        viewer.focus();
        this.enforceFocus();
      }

      if (isFunction(options.shown)) {
        addListener(element, EVENT_SHOWN, options.shown, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_SHOWN) === false) {
        return;
      }

      if (this.ready && this.isShown && !this.hiding) {
        this.view(this.index);
      }
    },
    hidden: function hidden() {
      var element = this.element,
          options = this.options,
          viewer = this.viewer;

      if (options.fucus) {
        this.clearEnforceFocus();
      }

      this.fulled = false;
      this.viewed = false;
      this.isShown = false;
      this.close();
      this.unbind();
      addClass(viewer, CLASS_HIDE);
      viewer.removeAttribute('role');
      viewer.removeAttribute('aria-labelledby');
      viewer.removeAttribute('aria-modal');
      viewer.setAttribute('aria-hidden', true);
      this.resetList();
      this.resetImage();
      this.hiding = false;

      if (!this.destroyed) {
        if (isFunction(options.hidden)) {
          addListener(element, EVENT_HIDDEN, options.hidden, {
            once: true
          });
        }

        dispatchEvent(element, EVENT_HIDDEN, null, {
          cancelable: false
        });
      }
    },
    requestFullscreen: function requestFullscreen(options) {
      var document = this.element.ownerDocument;

      if (this.fulled && !(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
        var documentElement = document.documentElement; // Element.requestFullscreen()

        if (documentElement.requestFullscreen) {
          // Avoid TypeError when convert `options` to dictionary
          if (isPlainObject(options)) {
            documentElement.requestFullscreen(options);
          } else {
            documentElement.requestFullscreen();
          }
        } else if (documentElement.webkitRequestFullscreen) {
          documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (documentElement.mozRequestFullScreen) {
          documentElement.mozRequestFullScreen();
        } else if (documentElement.msRequestFullscreen) {
          documentElement.msRequestFullscreen();
        }
      }
    },
    exitFullscreen: function exitFullscreen() {
      var document = this.element.ownerDocument;

      if (this.fulled && (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
        // Document.exitFullscreen()
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    change: function change(event) {
      var options = this.options,
          pointers = this.pointers;
      var pointer = pointers[Object.keys(pointers)[0]]; // In the case of the `pointers` object is empty (#421)

      if (!pointer) {
        return;
      }

      var offsetX = pointer.endX - pointer.startX;
      var offsetY = pointer.endY - pointer.startY;

      switch (this.action) {
        // Move the current image
        case ACTION_MOVE:
          this.move(offsetX, offsetY, event);
          break;
        // Zoom the current image

        case ACTION_ZOOM:
          this.zoom(getMaxZoomRatio(pointers), false, event);
          break;

        case ACTION_SWITCH:
          {
            this.action = 'switched';
            var absoluteOffsetX = Math.abs(offsetX);

            if (absoluteOffsetX > 1 && absoluteOffsetX > Math.abs(offsetY)) {
              // Empty `pointers` as `touchend` event will not be fired after swiped in iOS browsers.
              this.pointers = {};

              if (offsetX > 1) {
                this.prev(options.loop);
              } else if (offsetX < -1) {
                this.next(options.loop);
              }
            }

            break;
          }
      } // Override


      forEach(pointers, function (p) {
        p.startX = p.endX;
        p.startY = p.endY;
      });
    },
    isSwitchable: function isSwitchable() {
      var imageData = this.imageData,
          viewerData = this.viewerData;
      return this.length > 1 && imageData.x >= 0 && imageData.y >= 0 && imageData.width <= viewerData.width && imageData.height <= viewerData.height;
    }
  };

  var AnotherViewer = WINDOW.Viewer;

  var getUniqueID = function (id) {
    return function () {
      id += 1;
      return id;
    };
  }(-1);

  var Viewer = /*#__PURE__*/function () {
    /**
     * Create a new Viewer.
     * @param {Element} element - The target element for viewing.
     * @param {Object} [options={}] - The configuration options.
     */
    function Viewer(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Viewer);

      if (!element || element.nodeType !== 1) {
        throw new Error('The first argument is required and must be an element.');
      }

      this.element = element;
      this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
      this.action = false;
      this.fading = false;
      this.fulled = false;
      this.hiding = false;
      this.imageClicked = false;
      this.imageData = {};
      this.index = this.options.initialViewIndex;
      this.isImg = false;
      this.isShown = false;
      this.length = 0;
      this.moving = false;
      this.played = false;
      this.playing = false;
      this.pointers = {};
      this.ready = false;
      this.rotating = false;
      this.scaling = false;
      this.showing = false;
      this.timeout = false;
      this.tooltipping = false;
      this.viewed = false;
      this.viewing = false;
      this.wheeling = false;
      this.zooming = false;
      this.id = getUniqueID();
      this.init();
    }

    _createClass(Viewer, [{
      key: "init",
      value: function init() {
        var _this = this;

        var element = this.element,
            options = this.options;

        if (element[NAMESPACE]) {
          return;
        }

        element[NAMESPACE] = this; // The `focus` option requires the `keyboard` option set to `true`.

        if (options.focus && !options.keyboard) {
          options.focus = false;
        }

        var isImg = element.localName === 'img';
        var images = [];
        forEach(isImg ? [element] : element.querySelectorAll('img'), function (image) {
          if (isFunction(options.filter)) {
            if (options.filter.call(_this, image)) {
              images.push(image);
            }
          } else if (_this.getImageURL(image)) {
            images.push(image);
          }
        });
        this.isImg = isImg;
        this.length = images.length;
        this.images = images;
        this.initBody(); // Override `transition` option if it is not supported

        if (isUndefined(document.createElement(NAMESPACE).style.transition)) {
          options.transition = false;
        }

        if (options.inline) {
          var count = 0;

          var progress = function progress() {
            count += 1;

            if (count === _this.length) {
              var timeout;
              _this.initializing = false;
              _this.delaying = {
                abort: function abort() {
                  clearTimeout(timeout);
                }
              }; // build asynchronously to keep `this.viewer` is accessible in `ready` event handler.

              timeout = setTimeout(function () {
                _this.delaying = false;

                _this.build();
              }, 0);
            }
          };

          this.initializing = {
            abort: function abort() {
              forEach(images, function (image) {
                if (!image.complete) {
                  removeListener(image, EVENT_LOAD, progress);
                }
              });
            }
          };
          forEach(images, function (image) {
            if (image.complete) {
              progress();
            } else {
              addListener(image, EVENT_LOAD, progress, {
                once: true
              });
            }
          });
        } else {
          addListener(element, EVENT_CLICK, this.onStart = function (_ref) {
            var target = _ref.target;

            if (target.localName === 'img' && (!isFunction(options.filter) || options.filter.call(_this, target))) {
              _this.view(_this.images.indexOf(target));
            }
          });
        }
      }
    }, {
      key: "build",
      value: function build() {
        if (this.ready) {
          return;
        }

        var element = this.element,
            options = this.options;
        var parent = element.parentNode;
        var template = document.createElement('div');
        template.innerHTML = TEMPLATE;
        var viewer = template.querySelector(".".concat(NAMESPACE, "-container"));
        var title = viewer.querySelector(".".concat(NAMESPACE, "-title"));
        var toolbar = viewer.querySelector(".".concat(NAMESPACE, "-toolbar"));
        var navbar = viewer.querySelector(".".concat(NAMESPACE, "-navbar"));
        var button = viewer.querySelector(".".concat(NAMESPACE, "-button"));
        var canvas = viewer.querySelector(".".concat(NAMESPACE, "-canvas"));
        this.parent = parent;
        this.viewer = viewer;
        this.title = title;
        this.toolbar = toolbar;
        this.navbar = navbar;
        this.button = button;
        this.canvas = canvas;
        this.footer = viewer.querySelector(".".concat(NAMESPACE, "-footer"));
        this.tooltipBox = viewer.querySelector(".".concat(NAMESPACE, "-tooltip"));
        this.player = viewer.querySelector(".".concat(NAMESPACE, "-player"));
        this.list = viewer.querySelector(".".concat(NAMESPACE, "-list"));
        viewer.id = "".concat(NAMESPACE).concat(this.id);
        title.id = "".concat(NAMESPACE, "Title").concat(this.id);
        addClass(title, !options.title ? CLASS_HIDE : getResponsiveClass(Array.isArray(options.title) ? options.title[0] : options.title));
        addClass(navbar, !options.navbar ? CLASS_HIDE : getResponsiveClass(options.navbar));
        toggleClass(button, CLASS_HIDE, !options.button);

        if (options.keyboard) {
          button.setAttribute('tabindex', 0);
        }

        if (options.backdrop) {
          addClass(viewer, "".concat(NAMESPACE, "-backdrop"));

          if (!options.inline && options.backdrop !== 'static') {
            setData(canvas, DATA_ACTION, 'hide');
          }
        }

        if (isString(options.className) && options.className) {
          // In case there are multiple class names
          options.className.split(REGEXP_SPACES).forEach(function (className) {
            addClass(viewer, className);
          });
        }

        if (options.toolbar) {
          var list = document.createElement('ul');
          var custom = isPlainObject(options.toolbar);
          var zoomButtons = BUTTONS.slice(0, 3);
          var rotateButtons = BUTTONS.slice(7, 9);
          var scaleButtons = BUTTONS.slice(9);

          if (!custom) {
            addClass(toolbar, getResponsiveClass(options.toolbar));
          }

          forEach(custom ? options.toolbar : BUTTONS, function (value, index) {
            var deep = custom && isPlainObject(value);
            var name = custom ? hyphenate(index) : value;
            var show = deep && !isUndefined(value.show) ? value.show : value;

            if (!show || !options.zoomable && zoomButtons.indexOf(name) !== -1 || !options.rotatable && rotateButtons.indexOf(name) !== -1 || !options.scalable && scaleButtons.indexOf(name) !== -1) {
              return;
            }

            var size = deep && !isUndefined(value.size) ? value.size : value;
            var click = deep && !isUndefined(value.click) ? value.click : value;
            var item = document.createElement('li');

            if (options.keyboard) {
              item.setAttribute('tabindex', 0);
            }

            item.setAttribute('role', 'button');
            addClass(item, "".concat(NAMESPACE, "-").concat(name));

            if (!isFunction(click)) {
              setData(item, DATA_ACTION, name);
            }

            if (isNumber(show)) {
              addClass(item, getResponsiveClass(show));
            }

            if (['small', 'large'].indexOf(size) !== -1) {
              addClass(item, "".concat(NAMESPACE, "-").concat(size));
            } else if (name === 'play') {
              addClass(item, "".concat(NAMESPACE, "-large"));
            }

            if (isFunction(click)) {
              addListener(item, EVENT_CLICK, click);
            }

            list.appendChild(item);
          });
          toolbar.appendChild(list);
        } else {
          addClass(toolbar, CLASS_HIDE);
        }

        if (!options.rotatable) {
          var rotates = toolbar.querySelectorAll('li[class*="rotate"]');
          addClass(rotates, CLASS_INVISIBLE);
          forEach(rotates, function (rotate) {
            toolbar.appendChild(rotate);
          });
        }

        if (options.inline) {
          addClass(button, CLASS_FULLSCREEN);
          setStyle(viewer, {
            zIndex: options.zIndexInline
          });

          if (window.getComputedStyle(parent).position === 'static') {
            setStyle(parent, {
              position: 'relative'
            });
          }

          parent.insertBefore(viewer, element.nextSibling);
        } else {
          addClass(button, CLASS_CLOSE);
          addClass(viewer, CLASS_FIXED);
          addClass(viewer, CLASS_FADE);
          addClass(viewer, CLASS_HIDE);
          setStyle(viewer, {
            zIndex: options.zIndex
          });
          var container = options.container;

          if (isString(container)) {
            container = element.ownerDocument.querySelector(container);
          }

          if (!container) {
            container = this.body;
          }

          container.appendChild(viewer);
        }

        if (options.inline) {
          this.render();
          this.bind();
          this.isShown = true;
        }

        this.ready = true;

        if (isFunction(options.ready)) {
          addListener(element, EVENT_READY, options.ready, {
            once: true
          });
        }

        if (dispatchEvent(element, EVENT_READY) === false) {
          this.ready = false;
          return;
        }

        if (this.ready && options.inline) {
          this.view(this.index);
        }
      }
      /**
       * Get the no conflict viewer class.
       * @returns {Viewer} The viewer class.
       */

    }], [{
      key: "noConflict",
      value: function noConflict() {
        window.Viewer = AnotherViewer;
        return Viewer;
      }
      /**
       * Change the default options.
       * @param {Object} options - The new default options.
       */

    }, {
      key: "setDefaults",
      value: function setDefaults(options) {
        assign(DEFAULTS, isPlainObject(options) && options);
      }
    }]);

    return Viewer;
  }();

  assign(Viewer.prototype, render, events, handlers, methods, others);

  return Viewer;

})));


/***/ }),

/***/ "4367":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "43ce":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "43ec":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("1663")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "4409":
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__("4b9f");
var gOPS = __webpack_require__("946b");
var pIE = __webpack_require__("0cc5");
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),

/***/ "4441":
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__("3471");
var gOPN = __webpack_require__("21d9").f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "45cf":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("8334");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "4836":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("a86f");
var isObject = __webpack_require__("9cff");
var newPromiseCapability = __webpack_require__("d4c9");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "49f2":
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__("d8b3")('meta');
var isObject = __webpack_require__("9cff");
var has = __webpack_require__("4fd4");
var setDesc = __webpack_require__("bb8b").f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__("0926")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "4a86":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("a505");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "4a92":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("5e9e") && !__webpack_require__("99fe")(function () {
  return Object.defineProperty(__webpack_require__("e7e0")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "4b9f":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("3c75");
var enumBugKeys = __webpack_require__("69ac");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "4c39":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "4e6a":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("ce99");
var global = __webpack_require__("a4cf");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("bf84") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "4fc1":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("348f");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("5925").default
var update = add("72ece2a8", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "4fd4":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "52a4":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("3471");
var toLength = __webpack_require__("201c");
var toAbsoluteIndex = __webpack_require__("732b");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "5454":
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),

/***/ "55e0":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("8dd6");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("5925").default
var update = add("24739138", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "578b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("cff4");

/***/ }),

/***/ "5816":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "582e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("3abc");
var step = __webpack_require__("3fa6");
var Iterators = __webpack_require__("43ce");
var toIObject = __webpack_require__("8a8a");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("7745")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "5925":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ addStylesClient; });

// CONCATENATED MODULE: ./node_modules/_vue-style-loader@4.1.3@vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/_vue-style-loader@4.1.3@vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "597a":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("970b");
var IE8_DOM_DEFINE = __webpack_require__("4a92");
var toPrimitive = __webpack_require__("5d61");
var dP = Object.defineProperty;

exports.f = __webpack_require__("5e9e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "5baf":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("43ce");
var ITERATOR = __webpack_require__("eeeb")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "5d10":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("9cff");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "5d61":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("0677");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "5dc3":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "5e9e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("99fe")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "5edc":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "5ee4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__("a2d3");
exports.encode = exports.stringify = __webpack_require__("2bb8");


/***/ }),

/***/ "5f1c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("3d8a");
var global = __webpack_require__("0b34");
var ctx = __webpack_require__("1e4d");
var classof = __webpack_require__("d445");
var $export = __webpack_require__("e99b");
var isObject = __webpack_require__("9cff");
var aFunction = __webpack_require__("3250");
var anInstance = __webpack_require__("8b5a");
var forOf = __webpack_require__("2b37");
var speciesConstructor = __webpack_require__("1b0b");
var task = __webpack_require__("edec").set;
var microtask = __webpack_require__("2d39")();
var newPromiseCapabilityModule = __webpack_require__("d4c9");
var perform = __webpack_require__("fb49");
var userAgent = __webpack_require__("aeb8");
var promiseResolve = __webpack_require__("4836");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("839a")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__("6f45")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("bac3")($Promise, PROMISE);
__webpack_require__("f966")(PROMISE);
Wrapper = __webpack_require__("76e3")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("1a9a")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "6239":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("8af7")('asyncIterator');


/***/ }),

/***/ "62c0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");
var buildURL = __webpack_require__("4367");
var InterceptorManager = __webpack_require__("3b70");
var dispatchRequest = __webpack_require__("06d4");
var mergeConfig = __webpack_require__("37fe");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "66b1":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__("7c2b");

$export($export.S, 'Array', { isArray: __webpack_require__("45cf") });


/***/ }),

/***/ "67e6":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("690e")(false);
// imports


// module
exports.push([module.i, ".fm-style *,.fm-style :after,.fm-style :before{-webkit-box-sizing:border-box;box-sizing:border-box}.fm-style .fa-icon{width:auto;height:1em;max-width:100%;max-height:100%;vertical-align:middle}.fm-style .fm2-container{background:#fff;height:100%;border:1px solid #e0e0e0}.fm-style .fm2-container .el-container{height:100%!important}.fm-style .fm2-container>.el-container{background:#fff}.fm-style .fm2-container .fm2-main{position:relative}.fm-style .fm2-container .fm2-main>.el-container{position:absolute;top:0;bottom:0;left:0;right:0}.fm-style .fm2-container main{padding:0}.fm-style .fm2-container footer{height:30px;line-height:30px;border-top:1px solid #e0e0e0;font-size:12px;text-align:right;color:#409eff;background:#fafafa}.fm-style .fm2-container footer a{color:#409eff}.fm-style .center-container{border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0}.fm-style .center-container .btn-bar{height:45px;line-height:45px;font-size:18px;border-bottom:2px solid #e4e7ed;text-align:right}.fm-style .center-container .el-main{padding:0;position:relative;background:#fafafa}.fm-style .components-list{padding:8px 0;width:100%;height:100%}.fm-style .components-list .widget-cate{padding:8px 12px;font-size:13px}.fm-style .components-list ul{position:relative;overflow:hidden;padding:0 10px 10px;margin:0}.fm-style .components-list .form-edit-widget-label{font-size:12px;display:block;width:48%;line-height:26px;position:relative;float:left;left:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:1%;color:#333;border:1px solid #f4f6fc}.fm-style .components-list .form-edit-widget-label:hover{color:#409eff;border:1px dashed #409eff}.fm-style .components-list .form-edit-widget-label>a{display:block;cursor:move;background:#f4f6fc;border:1px solid #f4f6fc}.fm-style .components-list .form-edit-widget-label>a .icon{margin-right:6px;margin-left:8px;font-size:14px;display:inline-block;vertical-align:middle}.fm-style .components-list .form-edit-widget-label>a span{display:inline-block;vertical-align:middle}.fm-style .widget-form-container{position:absolute;top:0;left:0;right:0;bottom:0}.fm-style .widget-form-container .widget-form-list{background:#fff;border:1px dashed #999;min-height:600px;margin:10px}.fm-style .widget-form-container .widget-form-list .widget-col-list{min-height:50px;border:1px dashed #ccc;background:#fff}.fm-style .widget-form-container .widget-form-list .widget-view{padding-bottom:18px;position:relative;border:1px dashed hsla(0,0%,66.7%,.7);background-color:rgba(236,245,255,.3);margin:2px}.fm-style .widget-form-container .widget-form-list .widget-view .el-form-item__content{position:unset}.fm-style .widget-form-container .widget-form-list .widget-view.is_req .el-form-item__label:before{content:\"*\";color:#f56c6c;margin-right:4px}.fm-style .widget-form-container .widget-form-list .widget-view .widget-view-description{height:15px;line-height:15px;font-size:13px;margin-top:6px;color:#909399}.fm-style .widget-form-container .widget-form-list .widget-view .widget-view-action{position:absolute;right:0;bottom:0;height:28px;line-height:28px;background:#409eff;z-index:9}.fm-style .widget-form-container .widget-form-list .widget-view .widget-view-action i{font-size:14px;color:#fff;margin:0 5px;cursor:pointer}.fm-style .widget-form-container .widget-form-list .widget-view .widget-view-drag{position:absolute;left:-2px;top:-2px;bottom:-18px;height:28px;line-height:28px;background:#409eff;z-index:9}.fm-style .widget-form-container .widget-form-list .widget-view .widget-view-drag i{font-size:14px;color:#fff;margin:0 5px;cursor:move}.fm-style .widget-form-container .widget-form-list .widget-view:after{position:absolute;left:0;right:0;top:0;bottom:0;display:block}.fm-style .widget-form-container .widget-form-list .widget-view:hover{background:#ecf5ff;outline:1px solid #409eff;outline-offset:0}.fm-style .widget-form-container .widget-form-list .widget-view:hover.active{outline:2px solid #409eff;border:1px solid #409eff;outline-offset:0}.fm-style .widget-form-container .widget-form-list .widget-view:hover .widget-view-drag{display:block}.fm-style .widget-form-container .widget-form-list .widget-view.active{outline:2px solid #409eff;border:1px solid #409eff}.fm-style .widget-form-container .widget-form-list .widget-view.ghost{background:#f56c6c;border:2px solid #f56c6c;outline-width:0;height:3px;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:0;content:\"\";overflow:hidden;padding:0}.fm-style .widget-form-container .widget-form-list .widget-table{padding-bottom:0;padding:5px;background-color:rgba(253,246,236,.3)}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper{min-height:50px;background:#fff;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-row td{border-bottom:0}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-left{width:51px;border-left:1px solid #ebeef5;border-right:1px solid #ebeef5;border-top:1px solid #ebeef5;-webkit-box-flex:0;-ms-flex:none;flex:none}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view{border:1px solid #ebeef5;width:200px;float:left;height:100%;position:relative;display:block}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .el-table{height:100%}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view.is_req .el-form-item__label:before{content:\"*\";color:#f56c6c;margin-right:4px}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-description{height:15px;line-height:15px;font-size:13px;margin-top:6px;color:#909399}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-action{position:absolute;right:0;bottom:0;height:28px;line-height:28px;background:#409eff;z-index:9}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-action i{font-size:14px;color:#fff;margin:0 5px;cursor:pointer}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-drag{position:absolute;left:-2px;top:-2px;bottom:-18px;height:28px;line-height:28px;background:#409eff;z-index:9}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-drag i{font-size:14px;color:#fff;margin:0 5px;cursor:move}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view:after{position:absolute;left:0;right:0;top:0;bottom:0;display:block;content:\"\"}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view:before{display:none}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view:hover{background:#ecf5ff;outline:1px solid #409eff;outline-offset:-1px}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view:hover.active{border:1px solid #409eff;outline:1px solid #409eff;outline-offset:-1px}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view:hover .widget-view-drag{display:block}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view.active{outline:1px solid #409eff;border:1px solid #409eff;outline-offset:-1px}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view.ghost{background:#f56c6c;outline-width:0;width:5px!important;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:0;content:\"\";overflow:hidden;padding:0;position:relative;outline:none!important;border:0!important}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view.ghost:after{background:#f56c6c;position:absolute;top:0;left:0;bottom:0;right:0;z-index:9999;content:\"\";outline:none}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content{width:100%;outline:1px dashed #ccc;background:#fff;-webkit-box-flex:1;-ms-flex:1;flex:1;margin:0 1px;overflow:auto}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content .widget-table-col,.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content>div{height:100%}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content .widget-table-col .ghost{background:#f56c6c;position:relative;content:\"\";float:left;height:100%;width:5px!important;list-style:none;font-size:0;overflow:hidden;outline:none}.fm-style .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content .widget-table-col .ghost:after{background:#f56c6c;position:absolute;top:0;left:0;bottom:0;right:0;z-index:9999;content:\"\";outline:none}.fm-style .widget-form-container .widget-form-list .widget-table.active{outline:2px solid #e6a23c;border:1px solid #e6a23c}.fm-style .widget-form-container .widget-form-list .widget-table:hover{background:#fdf6ec;outline:1px solid #e6a23c;outline-offset:0}.fm-style .widget-form-container .widget-form-list .widget-table:hover.active{outline:2px solid #e6a23c;border:1px solid #e6a23c;outline-offset:0}.fm-style .widget-form-container .widget-form-list .widget-table .widget-view-action.widget-col-action,.fm-style .widget-form-container .widget-form-list .widget-table .widget-view-drag.widget-col-drag{background:#e6a23c}.fm-style .widget-form-container .widget-form-list .widget-table:after{display:none}.fm-style .widget-form-container .widget-form-list .widget-table.ghost{background:#f56c6c;outline-width:0;height:5px;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:0;content:\"\";overflow:hidden;padding:0;position:relative;outline:none;border:0}.fm-style .widget-form-container .widget-form-list .widget-table.ghost:after{background:#f56c6c;position:absolute;top:0;left:0;right:0;bottom:0;content:\"\";display:block;z-index:999}.fm-style .widget-form-container .widget-form-list .widget-col{padding-bottom:0;padding:5px;background-color:rgba(253,246,236,.3)}.fm-style .widget-form-container .widget-form-list .widget-col.active{outline:2px solid #e6a23c;border:1px solid #e6a23c}.fm-style .widget-form-container .widget-form-list .widget-col:hover{background:#fdf6ec;outline:1px solid #e6a23c;outline-offset:0}.fm-style .widget-form-container .widget-form-list .widget-col:hover.active{outline:2px solid #e6a23c;border:1px solid #e6a23c;outline-offset:0}.fm-style .widget-form-container .widget-form-list .widget-col .el-col{min-height:50px}.fm-style .widget-form-container .widget-form-list .widget-col.ghost{background:#f56c6c;border:2px solid #f56c6c;outline-width:0;height:3px;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:0;content:\"\";overflow:hidden;padding:0}.fm-style .widget-form-container .widget-form-list .widget-col .widget-view-action.widget-col-action,.fm-style .widget-form-container .widget-form-list .widget-col .widget-view-drag.widget-col-drag{background:#e6a23c}.fm-style .widget-form-container .widget-form-list .widget-col:after{display:none}.fm-style .widget-form-container .widget-form-list .ghost{background:#f56c6c;border:2px solid #f56c6c;outline-width:0;height:3px;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:0;content:\"\";overflow:hidden;padding:0}.fm-style .widget-form-container .widget-grid{background:#f4f6fc;position:relative;border-left:5px solid transparent;padding:5px;margin:0!important}.fm-style .widget-form-container .widget-grid.active{border-left:5px solid #409eff;background:#b3d8ff}.fm-style .widget-form-container .widget-grid-container.ghost{background:#f56c6c;border:2px solid #f56c6c;outline-width:0;height:3px;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:0;content:\"\";overflow:hidden;padding:0}.fm-style .widget-form-container .ghost{background:#f56c6c;border:2px solid #f56c6c;position:relative}.fm-style .widget-form-container .ghost:after{background:#f56c6c}.fm-style .widget-form-container li.ghost{height:5px;list-style:none;font-size:0;overflow:hidden}.fm-style .widget-config-container{position:relative}.fm-style .widget-config-container .el-header{border-bottom:2px solid #e4e7ed;padding:0 5px}.fm-style .widget-config-container .config-tab{height:45px;line-height:45px;display:inline-block;width:145px;text-align:center;font-size:14px;font-weight:500;position:relative;cursor:pointer}.fm-style .widget-config-container .config-tab.active{border-bottom:2px solid #409eff}.fm-style .widget-config-container .config-content{padding:10px}.fm-style .widget-config-container .config-content .el-form-item__label{padding:0;font-weight:500}.fm-style .widget-config-container .config-content .el-form-item{border-bottom:1px solid #e1e1e1;padding-bottom:10px}.fm-style .widget-config-container .ghost{background:#fff;border:1px dashed #409eff}.fm-style .widget-config-container .ghost:after{background:#fff;display:block;content:\"\";position:absolute;top:0;left:0;right:0;bottom:0}.fm-style .widget-config-container ul{margin:0;padding:0}.fm-style .widget-config-container li.ghost{list-style:none;font-size:0;display:block;position:relative}.fm-style .viewer-container{z-index:99999!important}.fm-style .form-empty{position:absolute;text-align:center;width:300px;font-size:20px;top:200px;left:50%;margin-left:-150px;color:#ccc}.fm-style .widget-empty{background-position:50%}", ""]);

// exports


/***/ }),

/***/ "690e":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "69ac":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "6bf8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("a86f");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "6c09":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("8334");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6f45":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("84e8");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "6fef":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "708a":
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__("eeeb");


/***/ }),

/***/ "7094":
/***/ (function(module, exports, __webpack_require__) {

/*!
 * clipboard.js v2.0.8
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 134:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ clipboard; }
});

// EXTERNAL MODULE: ./node_modules/tiny-emitter/index.js
var tiny_emitter = __webpack_require__(279);
var tiny_emitter_default = /*#__PURE__*/__webpack_require__.n(tiny_emitter);
// EXTERNAL MODULE: ./node_modules/good-listener/src/listen.js
var listen = __webpack_require__(370);
var listen_default = /*#__PURE__*/__webpack_require__.n(listen);
// EXTERNAL MODULE: ./node_modules/select/src/select.js
var src_select = __webpack_require__(817);
var select_default = /*#__PURE__*/__webpack_require__.n(src_select);
;// CONCATENATED MODULE: ./src/clipboard-action.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * Inner class which performs selection from either `text` or `target`
 * properties and then executes copy or cut operations.
 */

var ClipboardAction = /*#__PURE__*/function () {
  /**
   * @param {Object} options
   */
  function ClipboardAction(options) {
    _classCallCheck(this, ClipboardAction);

    this.resolveOptions(options);
    this.initSelection();
  }
  /**
   * Defines base properties passed from constructor.
   * @param {Object} options
   */


  _createClass(ClipboardAction, [{
    key: "resolveOptions",
    value: function resolveOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.action = options.action;
      this.container = options.container;
      this.emitter = options.emitter;
      this.target = options.target;
      this.text = options.text;
      this.trigger = options.trigger;
      this.selectedText = '';
    }
    /**
     * Decides which selection strategy is going to be applied based
     * on the existence of `text` and `target` properties.
     */

  }, {
    key: "initSelection",
    value: function initSelection() {
      if (this.text) {
        this.selectFake();
      } else if (this.target) {
        this.selectTarget();
      }
    }
    /**
     * Creates a fake textarea element, sets its value from `text` property,
     */

  }, {
    key: "createFakeElement",
    value: function createFakeElement() {
      var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      this.fakeElem = document.createElement('textarea'); // Prevent zooming on iOS

      this.fakeElem.style.fontSize = '12pt'; // Reset box model

      this.fakeElem.style.border = '0';
      this.fakeElem.style.padding = '0';
      this.fakeElem.style.margin = '0'; // Move element out of screen horizontally

      this.fakeElem.style.position = 'absolute';
      this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px'; // Move element to the same position vertically

      var yPosition = window.pageYOffset || document.documentElement.scrollTop;
      this.fakeElem.style.top = "".concat(yPosition, "px");
      this.fakeElem.setAttribute('readonly', '');
      this.fakeElem.value = this.text;
      return this.fakeElem;
    }
    /**
     * Get's the value of fakeElem,
     * and makes a selection on it.
     */

  }, {
    key: "selectFake",
    value: function selectFake() {
      var _this = this;

      var fakeElem = this.createFakeElement();

      this.fakeHandlerCallback = function () {
        return _this.removeFake();
      };

      this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;
      this.container.appendChild(fakeElem);
      this.selectedText = select_default()(fakeElem);
      this.copyText();
      this.removeFake();
    }
    /**
     * Only removes the fake element after another click event, that way
     * a user can hit `Ctrl+C` to copy because selection still exists.
     */

  }, {
    key: "removeFake",
    value: function removeFake() {
      if (this.fakeHandler) {
        this.container.removeEventListener('click', this.fakeHandlerCallback);
        this.fakeHandler = null;
        this.fakeHandlerCallback = null;
      }

      if (this.fakeElem) {
        this.container.removeChild(this.fakeElem);
        this.fakeElem = null;
      }
    }
    /**
     * Selects the content from element passed on `target` property.
     */

  }, {
    key: "selectTarget",
    value: function selectTarget() {
      this.selectedText = select_default()(this.target);
      this.copyText();
    }
    /**
     * Executes the copy operation based on the current selection.
     */

  }, {
    key: "copyText",
    value: function copyText() {
      var succeeded;

      try {
        succeeded = document.execCommand(this.action);
      } catch (err) {
        succeeded = false;
      }

      this.handleResult(succeeded);
    }
    /**
     * Fires an event based on the copy operation result.
     * @param {Boolean} succeeded
     */

  }, {
    key: "handleResult",
    value: function handleResult(succeeded) {
      this.emitter.emit(succeeded ? 'success' : 'error', {
        action: this.action,
        text: this.selectedText,
        trigger: this.trigger,
        clearSelection: this.clearSelection.bind(this)
      });
    }
    /**
     * Moves focus away from `target` and back to the trigger, removes current selection.
     */

  }, {
    key: "clearSelection",
    value: function clearSelection() {
      if (this.trigger) {
        this.trigger.focus();
      }

      document.activeElement.blur();
      window.getSelection().removeAllRanges();
    }
    /**
     * Sets the `action` to be performed which can be either 'copy' or 'cut'.
     * @param {String} action
     */

  }, {
    key: "destroy",

    /**
     * Destroy lifecycle.
     */
    value: function destroy() {
      this.removeFake();
    }
  }, {
    key: "action",
    set: function set() {
      var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';
      this._action = action;

      if (this._action !== 'copy' && this._action !== 'cut') {
        throw new Error('Invalid "action" value, use either "copy" or "cut"');
      }
    }
    /**
     * Gets the `action` property.
     * @return {String}
     */
    ,
    get: function get() {
      return this._action;
    }
    /**
     * Sets the `target` property using an element
     * that will be have its content copied.
     * @param {Element} target
     */

  }, {
    key: "target",
    set: function set(target) {
      if (target !== undefined) {
        if (target && _typeof(target) === 'object' && target.nodeType === 1) {
          if (this.action === 'copy' && target.hasAttribute('disabled')) {
            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
          }

          if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
          }

          this._target = target;
        } else {
          throw new Error('Invalid "target" value, use a valid Element');
        }
      }
    }
    /**
     * Gets the `target` property.
     * @return {String|HTMLElement}
     */
    ,
    get: function get() {
      return this._target;
    }
  }]);

  return ClipboardAction;
}();

/* harmony default export */ var clipboard_action = (ClipboardAction);
;// CONCATENATED MODULE: ./src/clipboard.js
function clipboard_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { clipboard_typeof = function _typeof(obj) { return typeof obj; }; } else { clipboard_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return clipboard_typeof(obj); }

function clipboard_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function clipboard_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function clipboard_createClass(Constructor, protoProps, staticProps) { if (protoProps) clipboard_defineProperties(Constructor.prototype, protoProps); if (staticProps) clipboard_defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (clipboard_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




/**
 * Helper function to retrieve attribute value.
 * @param {String} suffix
 * @param {Element} element
 */

function getAttributeValue(suffix, element) {
  var attribute = "data-clipboard-".concat(suffix);

  if (!element.hasAttribute(attribute)) {
    return;
  }

  return element.getAttribute(attribute);
}
/**
 * Base class which takes one or more elements, adds event listeners to them,
 * and instantiates a new `ClipboardAction` on each click.
 */


var Clipboard = /*#__PURE__*/function (_Emitter) {
  _inherits(Clipboard, _Emitter);

  var _super = _createSuper(Clipboard);

  /**
   * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
   * @param {Object} options
   */
  function Clipboard(trigger, options) {
    var _this;

    clipboard_classCallCheck(this, Clipboard);

    _this = _super.call(this);

    _this.resolveOptions(options);

    _this.listenClick(trigger);

    return _this;
  }
  /**
   * Defines if attributes would be resolved using internal setter functions
   * or custom functions that were passed in the constructor.
   * @param {Object} options
   */


  clipboard_createClass(Clipboard, [{
    key: "resolveOptions",
    value: function resolveOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
      this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
      this.text = typeof options.text === 'function' ? options.text : this.defaultText;
      this.container = clipboard_typeof(options.container) === 'object' ? options.container : document.body;
    }
    /**
     * Adds a click event listener to the passed trigger.
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     */

  }, {
    key: "listenClick",
    value: function listenClick(trigger) {
      var _this2 = this;

      this.listener = listen_default()(trigger, 'click', function (e) {
        return _this2.onClick(e);
      });
    }
    /**
     * Defines a new `ClipboardAction` on each click event.
     * @param {Event} e
     */

  }, {
    key: "onClick",
    value: function onClick(e) {
      var trigger = e.delegateTarget || e.currentTarget;

      if (this.clipboardAction) {
        this.clipboardAction = null;
      }

      this.clipboardAction = new clipboard_action({
        action: this.action(trigger),
        target: this.target(trigger),
        text: this.text(trigger),
        container: this.container,
        trigger: trigger,
        emitter: this
      });
    }
    /**
     * Default `action` lookup function.
     * @param {Element} trigger
     */

  }, {
    key: "defaultAction",
    value: function defaultAction(trigger) {
      return getAttributeValue('action', trigger);
    }
    /**
     * Default `target` lookup function.
     * @param {Element} trigger
     */

  }, {
    key: "defaultTarget",
    value: function defaultTarget(trigger) {
      var selector = getAttributeValue('target', trigger);

      if (selector) {
        return document.querySelector(selector);
      }
    }
    /**
     * Returns the support of the given action, or all actions if no action is
     * given.
     * @param {String} [action]
     */

  }, {
    key: "defaultText",

    /**
     * Default `text` lookup function.
     * @param {Element} trigger
     */
    value: function defaultText(trigger) {
      return getAttributeValue('text', trigger);
    }
    /**
     * Destroy lifecycle.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.listener.destroy();

      if (this.clipboardAction) {
        this.clipboardAction.destroy();
        this.clipboardAction = null;
      }
    }
  }], [{
    key: "isSupported",
    value: function isSupported() {
      var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];
      var actions = typeof action === 'string' ? [action] : action;
      var support = !!document.queryCommandSupported;
      actions.forEach(function (action) {
        support = support && !!document.queryCommandSupported(action);
      });
      return support;
    }
  }]);

  return Clipboard;
}((tiny_emitter_default()));

/* harmony default export */ var clipboard = (Clipboard);

/***/ }),

/***/ 828:
/***/ (function(module) {

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;


/***/ }),

/***/ 438:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var closest = __webpack_require__(828);

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),

/***/ 879:
/***/ (function(__unused_webpack_module, exports) {

/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};


/***/ }),

/***/ 370:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var is = __webpack_require__(879);
var delegate = __webpack_require__(438);

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),

/***/ 817:
/***/ (function(module) {

function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;


/***/ }),

/***/ 279:
/***/ (function(module) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;
module.exports.TinyEmitter = E;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(134);
/******/ })()
.default;
});

/***/ }),

/***/ "70f2":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("0451");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "717b":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("597a");
var anObject = __webpack_require__("970b");
var getKeys = __webpack_require__("4b9f");

module.exports = __webpack_require__("5e9e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "728a":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("96d8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "732b":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("212e");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "73e1":
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__("f6cf")('meta');
var isObject = __webpack_require__("0677");
var has = __webpack_require__("dce3");
var setDesc = __webpack_require__("597a").f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__("99fe")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "76e3":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "7723":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("3f48");
var normalizeHeaderName = __webpack_require__("ac54");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("032e");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__("032e");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("4c39")))

/***/ }),

/***/ "7745":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("bf84");
var $export = __webpack_require__("7c2b");
var redefine = __webpack_require__("de85");
var hide = __webpack_require__("0cb2");
var Iterators = __webpack_require__("43ce");
var $iterCreate = __webpack_require__("d5b9");
var setToStringTag = __webpack_require__("b849");
var getPrototypeOf = __webpack_require__("f411");
var ITERATOR = __webpack_require__("eeeb")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "7868":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "7c2b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("a4cf");
var core = __webpack_require__("ce99");
var ctx = __webpack_require__("728a");
var hide = __webpack_require__("0cb2");
var has = __webpack_require__("dce3");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "7ee3":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("a86f");
var dPs = __webpack_require__("3f9e");
var enumBugKeys = __webpack_require__("065e");
var IE_PROTO = __webpack_require__("3a0d")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("e8d7")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("bbcc").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "8078":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("3ab0");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "813f":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("690e")(false);
// imports


// module
exports.push([module.i, ".cus-dialog-container .el-dialog__footer{margin:0 20px;padding:15px 0 16px;text-align:center;position:relative}.cus-dialog-container .el-dialog__footer .dialog-footer{display:block}.cus-dialog-container .el-dialog__footer .dialog-footer .circular{display:inline-block;vertical-align:middle;margin-right:5px;width:24px;height:24px}.cus-dialog-container .el-dialog__footer .dialog-footer .el-loading-text{display:inline-block;vertical-align:middle}.cus-dialog-container .el-dialog__footer .dialog-footer .el-loading-spinner{margin-top:-12px}", ""]);

// exports


/***/ }),

/***/ "8206":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("f1d8");

/***/ }),

/***/ "8334":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "839a":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("baa7")('wks');
var uid = __webpack_require__("d8b3");
var Symbol = __webpack_require__("0b34").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "83d3":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("26df") && !__webpack_require__("0926")(function () {
  return Object.defineProperty(__webpack_require__("e8d7")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "84e8":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("0b34");
var hide = __webpack_require__("065d");
var has = __webpack_require__("4fd4");
var SRC = __webpack_require__("d8b3")('src');
var $toString = __webpack_require__("05fd");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("76e3").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "87a4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__("19aa")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__("7745")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "87b2":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("839a")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("065d")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "8a8a":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("6c09");
var defined = __webpack_require__("100d");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "8af7":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("a4cf");
var core = __webpack_require__("ce99");
var LIBRARY = __webpack_require__("bf84");
var wksExt = __webpack_require__("708a");
var defineProperty = __webpack_require__("597a").f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),

/***/ "8b5a":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "8c56":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("813f");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("5925").default
var update = add("6691be1e", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "8dd6":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("690e")(false);
// imports


// module
exports.push([module.i, ".m-colorPicker[data-v-65e1f49a]{position:relative;text-align:left;font-size:14px;display:inline-block;outline:none}.m-colorPicker li[data-v-65e1f49a],.m-colorPicker ol[data-v-65e1f49a],.m-colorPicker ul[data-v-65e1f49a]{list-style:none;margin:0;padding:0}.m-colorPicker .colorBtn[data-v-65e1f49a]{width:15px;height:15px}.m-colorPicker .colorBtn.disabled[data-v-65e1f49a]{cursor:no-drop}.m-colorPicker .box[data-v-65e1f49a]{position:absolute;width:190px;background:#fff;border:1px solid #ddd;visibility:hidden;border-radius:2px;margin-top:2px;padding:10px;padding-bottom:5px;-webkit-box-shadow:0 0 5px rgba(0,0,0,.15);box-shadow:0 0 5px rgba(0,0,0,.15);opacity:0;-webkit-transition:all .3s ease;transition:all .3s ease;-webkit-box-sizing:content-box;box-sizing:content-box}.m-colorPicker .box h3[data-v-65e1f49a]{margin:0;font-size:14px;font-weight:400;margin-top:10px;margin-bottom:5px;line-height:1;color:#333}.m-colorPicker .box input[data-v-65e1f49a]{visibility:hidden;position:absolute;left:0;bottom:0}.m-colorPicker .box.open[data-v-65e1f49a]{visibility:visible;opacity:1;z-index:1}.m-colorPicker .hd[data-v-65e1f49a]{overflow:hidden;line-height:29px}.m-colorPicker .hd .colorView[data-v-65e1f49a]{width:100px;height:30px;float:left;-webkit-transition:background-color .3s ease;transition:background-color .3s ease}.m-colorPicker .hd .defaultColor[data-v-65e1f49a]{width:80px;float:right;text-align:center;border:1px solid #ddd;cursor:pointer;color:#333}.m-colorPicker .tColor li[data-v-65e1f49a]{width:15px;height:15px;display:inline-block;margin:0 2px;-webkit-transition:all .3s ease;transition:all .3s ease}.m-colorPicker .tColor li[data-v-65e1f49a]:hover{-webkit-box-shadow:0 0 5px rgba(0,0,0,.4);box-shadow:0 0 5px rgba(0,0,0,.4);-webkit-transform:scale(1.3);transform:scale(1.3)}.m-colorPicker .bColor li[data-v-65e1f49a]{width:15px;display:inline-block;margin:0 2px}.m-colorPicker .bColor li li[data-v-65e1f49a]{display:block;width:15px;height:15px;-webkit-transition:all .3s ease;transition:all .3s ease;margin:0}.m-colorPicker .bColor li li[data-v-65e1f49a]:hover{-webkit-box-shadow:0 0 5px rgba(0,0,0,.4);box-shadow:0 0 5px rgba(0,0,0,.4);-webkit-transform:scale(1.3);transform:scale(1.3)}", ""]);

// exports


/***/ }),

/***/ "8dee":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("a86f");
var toObject = __webpack_require__("8078");
var toLength = __webpack_require__("201c");
var toInteger = __webpack_require__("212e");
var advanceStringIndex = __webpack_require__("43ec");
var regExpExec = __webpack_require__("f417");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__("c46f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "8ed0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "9074":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/iconfont.34ea3475.woff";

/***/ }),

/***/ "924c":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4fc1");
/* harmony import */ var _node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "93ca":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("3a4c");
var enumBugKeys = __webpack_require__("065e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "946b":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "948d":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("87a4");
__webpack_require__("383f");
module.exports = __webpack_require__("708a").f('iterator');


/***/ }),

/***/ "94f0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__("0b34");
var has = __webpack_require__("4fd4");
var DESCRIPTORS = __webpack_require__("26df");
var $export = __webpack_require__("e99b");
var redefine = __webpack_require__("84e8");
var META = __webpack_require__("49f2").KEY;
var $fails = __webpack_require__("0926");
var shared = __webpack_require__("baa7");
var setToStringTag = __webpack_require__("bac3");
var uid = __webpack_require__("d8b3");
var wks = __webpack_require__("839a");
var wksExt = __webpack_require__("1a58");
var wksDefine = __webpack_require__("078c");
var enumKeys = __webpack_require__("3c56");
var isArray = __webpack_require__("d1cb");
var anObject = __webpack_require__("a86f");
var isObject = __webpack_require__("9cff");
var toObject = __webpack_require__("8078");
var toIObject = __webpack_require__("3471");
var toPrimitive = __webpack_require__("5d10");
var createDesc = __webpack_require__("5edc");
var _create = __webpack_require__("7ee3");
var gOPNExt = __webpack_require__("4441");
var $GOPD = __webpack_require__("285b");
var $GOPS = __webpack_require__("0c29");
var $DP = __webpack_require__("bb8b");
var $keys = __webpack_require__("93ca");
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__("21d9").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__("35d4").f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__("3d8a")) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__("065d")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ "953d":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "96d8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "970b":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("0677");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "99fe":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "9a66":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_shzl_color_picker_vue_vue_type_style_index_0_id_65e1f49a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("55e0");
/* harmony import */ var _node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_shzl_color_picker_vue_vue_type_style_index_0_id_65e1f49a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_shzl_color_picker_vue_vue_type_style_index_0_id_65e1f49a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "9cff":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "9f60":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("078c")('asyncIterator');


/***/ }),

/***/ "a2d3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "a450":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("bb8b").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("26df") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "a4cf":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "a505":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("338e");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "a618":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "a7e5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__("e99b");
var $find = __webpack_require__("e9aa")(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("87b2")(KEY);


/***/ }),

/***/ "a83a":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("9cff");
var setPrototypeOf = __webpack_require__("e0ff").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "a86f":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("9cff");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "a8f3":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("970b");
var dPs = __webpack_require__("717b");
var enumBugKeys = __webpack_require__("69ac");
var IE_PROTO = __webpack_require__("245c")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("e7e0")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("b758").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "a96d":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("8af7")('observable');


/***/ }),

/***/ "aafc":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__("04ff");
var combineURLs = __webpack_require__("13b8");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "ac54":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "ac67":
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__("e99b");
var ownKeys = __webpack_require__("e7c8");
var toIObject = __webpack_require__("3471");
var gOPD = __webpack_require__("285b");
var createProperty = __webpack_require__("1374");

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),

/***/ "acc0":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("1da5");
var ITERATOR = __webpack_require__("eeeb")('iterator');
var Iterators = __webpack_require__("43ce");
module.exports = __webpack_require__("ce99").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "addc":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("4fd4");
var toObject = __webpack_require__("8078");
var IE_PROTO = __webpack_require__("3a0d")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "aeb8":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("0b34");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "af83":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_GenerateForm_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f91d");
/* harmony import */ var _node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_GenerateForm_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_4_1_3_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_15_9_8_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_7_3_1_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_2_0_1_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_8_vue_loader_lib_index_js_vue_loader_options_GenerateForm_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "b1d4":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("a86f");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "b2be":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("e99b");
var core = __webpack_require__("76e3");
var fails = __webpack_require__("0926");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "b758":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("a4cf").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "b849":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("597a").f;
var has = __webpack_require__("dce3");
var TAG = __webpack_require__("eeeb")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "baa7":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("76e3");
var global = __webpack_require__("0b34");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("3d8a") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "bac3":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("bb8b").f;
var has = __webpack_require__("4fd4");
var TAG = __webpack_require__("839a")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "bb8b":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("a86f");
var IE8_DOM_DEFINE = __webpack_require__("83d3");
var toPrimitive = __webpack_require__("5d10");
var dP = Object.defineProperty;

exports.f = __webpack_require__("26df") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "bbcc":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("0b34").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "bd4d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export loadJs */
/* unused harmony export loadCss */
/* unused harmony export generateUUID */
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4057");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8dee");
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5f1c");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_2__);




/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-08-31 09:22:03
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 09:38:13
 */
var loadJs = function loadJs(url) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    script.onload = function () {
      resolve();
    };
  });
};
var loadCss = function loadCss(url) {
  return new Promise(function (resolve) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);

    link.onload = function () {
      resolve();
    };
  });
};
var generateUUID = function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
  });
  return uuid;
};

/***/ }),

/***/ "bdf1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "bf73":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("0353");
__webpack_require__("e99b")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "bf84":
/***/ (function(module, exports) {

module.exports = true;


/***/ }),

/***/ "c1a2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _defineProperty; });
/* harmony import */ var _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("10a3");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default()(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "c236":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("66b1");
module.exports = __webpack_require__("ce99").Array.isArray;


/***/ }),

/***/ "c46f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("bf73");
var redefine = __webpack_require__("84e8");
var hide = __webpack_require__("065d");
var fails = __webpack_require__("0926");
var defined = __webpack_require__("3ab0");
var wks = __webpack_require__("839a");
var regexpExec = __webpack_require__("0353");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "c4c4":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("0479");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("5925").default
var update = add("1e1d85ca", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "ca6e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "caa7":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("c236");

/***/ }),

/***/ "cba8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "ce99":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "cea2":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "cff4":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("87a4");
__webpack_require__("2c3d");
module.exports = __webpack_require__("ce99").Array.from;


/***/ }),

/***/ "d1cb":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("cea2");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "d335":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "d445":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("cea2");
var TAG = __webpack_require__("839a")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "d48a":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "d4c9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("3250");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "d4f1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * vue-i18n v5.0.3 
 * (c) 2017 kazuya kawaguchi
 * Released under the MIT License.
 */


/**
 * warn
 *
 * @param {String} msg
 * @param {Error} [err]
 *
 */

function warn (msg, err) {
  if (window.console) {
    console.warn('[vue-i18n] ' + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}

var Asset = function (Vue, langVM) {
  /**
   * Register or retrieve a global locale definition.
   *
   * @param {String} id
   * @param {Object | Function | Promise} definition
   * @param {Function} cb
   */

  Vue.locale = function (id, definition, cb) {
    if (definition === undefined) { // getter
      return langVM.locales[id]
    } else { // setter
      if (definition === null) {
        langVM.locales[id] = undefined;
        delete langVM.locales[id];
      } else {
        setLocale(id, definition, function (locale) {
          if (locale) {
            langVM.$set(langVM.locales, id, locale);
          } else {
            warn('failed set `' + id + '` locale');
          }
          cb && cb();
        });
      }
    }
  };
};


function setLocale (id, definition, cb) {
  if (typeof definition === 'object') { // sync
    cb(definition);
  } else {
    var future = definition.call(this);
    if (typeof future === 'function') {
      if (future.resolved) {
        // cached
        cb(future.resolved);
      } else if (future.requested) {
        // pool callbacks
        future.pendingCallbacks.push(cb);
      } else {
        future.requested = true;
        var cbs = future.pendingCallbacks = [cb];
        future(function (locale) { // resolve
          future.resolved = locale;
          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i](locale);
          }
        }, function () { // reject
          cb();
        });
      }
    } else if (isPromise(future)) { // promise
      future.then(function (locale) { // resolve
        cb(locale);
      }, function () { // reject
        cb();
      }).catch(function (err) {
        console.error(err);
        cb();
      });
    }
  }
}

/**
 * Forgiving check for a promise
 *
 * @param {Object} p
 * @return {Boolean}
 */

function isPromise (p) {
  return p && typeof p.then === 'function'
}

var Override = function (Vue, langVM) {
  // override _init
  var init = Vue.prototype._init;
  Vue.prototype._init = function (options) {
    var this$1 = this;

    init.call(this, options);

    if (!this.$parent) { // root
      this._$lang = langVM;
      this._langUnwatch = this._$lang.$watch('$data', function (val, old) {
        this$1.$forceUpdate();
      }, { deep: true });
    }
  };

  // override _destroy
  var destroy = Vue.prototype._destroy;
  Vue.prototype._destroy = function () {
    if (!this.$parent && this._langUnwatch) {
      this._langUnwatch();
      this._langUnwatch = null;
      this._$lang = null;
    }

    destroy.apply(this, arguments);
  };
};

/**
 * Observer
 */

var Watcher;
/**
 * getWatcher
 *
 * @param {Vue} vm
 * @return {Watcher}
 */

function getWatcher (vm) {
  if (!Watcher) {
    var unwatch = vm.$watch('__watcher__', function (a) {});
    Watcher = vm._watchers[0].constructor;
    unwatch();
  }
  return Watcher
}

var Dep;
/**
 * getDep
 *
 * @param {Vue} vm
 * @return {Dep}
 */

function getDep (vm) {
  if (!Dep && vm && vm._data && vm._data.__ob__ && vm._data.__ob__.dep) {
    Dep = vm._data.__ob__.dep.constructor;
  }
  return Dep
}

/**
 * utilites
 */

/**
 * isNil
 *
 * @param {*} val
 * @return Boolean
 */
function isNil (val) {
  return val === null || val === undefined
}

/**
 * Simple bind, faster than native
 *
 * @param {Function} fn
 * @param {Object} ctx
 * @return Function
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {Object} obj
 * @return Boolean
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {Object} obj
 * @return Boolean
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Check whether the object has the property.
 *
 * @param {Object} obj
 * @param {String} key
 * @return Boolean
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

var fallback; // fallback lang
var missingHandler = null; // missing handler
var i18nFormatter = null; // custom formatter

var Config = function (Vue, langVM, lang) {
  var Watcher = getWatcher(langVM);
  var Dep = getDep(langVM);

  function makeComputedGetter (getter, owner) {
    var watcher = new Watcher(owner, getter, null, {
      lazy: true
    });

    return function computedGetter () {
      watcher.dirty && watcher.evaluate();
      Dep && Dep.target && watcher.depend();
      return watcher.value
    }
  }

  // define Vue.config.lang configration
  Object.defineProperty(Vue.config, 'lang', {
    enumerable: true,
    configurable: true,
    get: makeComputedGetter(function () { return langVM.lang }, langVM),
    set: bind(function (val) { langVM.lang = val; }, langVM)
  });

  // define Vue.config.fallbackLang configration
  fallback = lang;
  Object.defineProperty(Vue.config, 'fallbackLang', {
    enumerable: true,
    configurable: true,
    get: function () { return fallback },
    set: function (val) { fallback = val; }
  });

  // define Vue.config.missingHandler configration
  Object.defineProperty(Vue.config, 'missingHandler', {
    enumerable: true,
    configurable: true,
    get: function () { return missingHandler },
    set: function (val) { missingHandler = val; }
  });

  // define Vue.config.i18Formatter configration
  Object.defineProperty(Vue.config, 'i18nFormatter', {
    enumerable: true,
    configurable: true,
    get: function () { return i18nFormatter },
    set: function (val) { i18nFormatter = val; }
  });
};

/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */

var RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;


var Format = function (Vue) {
  /**
   * template
   *
   * @param {String} string
   * @param {Array} ...args
   * @return {String}
   */

  function template (string) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0];
    } else {
      args = {};
    }

    if (!args || !args.hasOwnProperty) {
      args = {};
    }

    return string.replace(RE_NARGS, function (match, prefix, i, index) {
      var result;

      if (string[index - 1] === '{' &&
        string[index + match.length] === '}') {
        return i
      } else {
        result = hasOwn(args, i) ? args[i] : match;
        if (isNil(result)) {
          return ''
        }

        return result
      }
    })
  }

  return template
};

/**
 *  Path paerser
 *  - Inspired:
 *    Vue.js Path parser
 */

// cache
var pathCache = Object.create(null);

// actions
var APPEND = 0;
var PUSH = 1;
var INC_SUB_PATH_DEPTH = 2;
var PUSH_SUB_PATH = 3;

// states
var BEFORE_PATH = 0;
var IN_PATH = 1;
var BEFORE_IDENT = 2;
var IN_IDENT = 3;
var IN_SUB_PATH = 4;
var IN_SINGLE_QUOTE = 5;
var IN_DOUBLE_QUOTE = 6;
var AFTER_PATH = 7;
var ERROR = 8;

var pathStateMachine = [];

pathStateMachine[BEFORE_PATH] = {
  'ws': [BEFORE_PATH],
  'ident': [IN_IDENT, APPEND],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[IN_PATH] = {
  'ws': [IN_PATH],
  '.': [BEFORE_IDENT],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[BEFORE_IDENT] = {
  'ws': [BEFORE_IDENT],
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND]
};

pathStateMachine[IN_IDENT] = {
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND],
  'ws': [IN_PATH, PUSH],
  '.': [BEFORE_IDENT, PUSH],
  '[': [IN_SUB_PATH, PUSH],
  'eof': [AFTER_PATH, PUSH]
};

pathStateMachine[IN_SUB_PATH] = {
  "'": [IN_SINGLE_QUOTE, APPEND],
  '"': [IN_DOUBLE_QUOTE, APPEND],
  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
  ']': [IN_PATH, PUSH_SUB_PATH],
  'eof': ERROR,
  'else': [IN_SUB_PATH, APPEND]
};

pathStateMachine[IN_SINGLE_QUOTE] = {
  "'": [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_SINGLE_QUOTE, APPEND]
};

pathStateMachine[IN_DOUBLE_QUOTE] = {
  '"': [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_DOUBLE_QUOTE, APPEND]
};

/**
 * Check if an expression is a literal value.
 *
 * @param {String} exp
 * @return {Boolean}
 */

var literalValueRE = /^\s?(true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral (exp) {
  return literalValueRE.test(exp)
}

/**
 * Strip quotes from a string
 *
 * @param {String} str
 * @return {String | false}
 */

function stripQuotes (str) {
  var a = str.charCodeAt(0);
  var b = str.charCodeAt(str.length - 1);
  return a === b && (a === 0x22 || a === 0x27)
    ? str.slice(1, -1)
    : str
}

/**
 * Determine the type of a character in a keypath.
 *
 * @param {Char} ch
 * @return {String} type
 */

function getPathCharType (ch) {
  if (ch === undefined) { return 'eof' }

  var code = ch.charCodeAt(0);

  switch (code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30: // 0
      return ch

    case 0x5F: // _
    case 0x24: // $
    case 0x2D: // -
      return 'ident'

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0:  // No-break space
    case 0xFEFF:  // Byte Order Mark
    case 0x2028:  // Line Separator
    case 0x2029:  // Paragraph Separator
      return 'ws'
  }

  // a-z, A-Z
  if ((code >= 0x61 && code <= 0x7A) || (code >= 0x41 && code <= 0x5A)) {
    return 'ident'
  }

  // 1-9
  if (code >= 0x31 && code <= 0x39) { return 'number' }

  return 'else'
}

/**
 * Format a subPath, return its plain form if it is
 * a literal string or number. Otherwise prepend the
 * dynamic indicator (*).
 *
 * @param {String} path
 * @return {String}
 */

function formatSubPath (path) {
  var trimmed = path.trim();
  // invalid leading 0
  if (path.charAt(0) === '0' && isNaN(path)) { return false }

  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed
}

/**
 * Parse a string path into an array of segments
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parse (path) {
  var keys = [];
  var index = -1;
  var mode = BEFORE_PATH;
  var subPathDepth = 0;
  var c, newChar, key, type, transition, action, typeMap;

  var actions = [];

  actions[PUSH] = function () {
    if (key !== undefined) {
      keys.push(key);
      key = undefined;
    }
  };

  actions[APPEND] = function () {
    if (key === undefined) {
      key = newChar;
    } else {
      key += newChar;
    }
  };

  actions[INC_SUB_PATH_DEPTH] = function () {
    actions[APPEND]();
    subPathDepth++;
  };

  actions[PUSH_SUB_PATH] = function () {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = IN_SUB_PATH;
      actions[APPEND]();
    } else {
      subPathDepth = 0;
      key = formatSubPath(key);
      if (key === false) {
        return false
      } else {
        actions[PUSH]();
      }
    }
  };

  function maybeUnescapeQuote () {
    var nextChar = path[index + 1];
    if ((mode === IN_SINGLE_QUOTE && nextChar === "'") ||
      (mode === IN_DOUBLE_QUOTE && nextChar === '"')) {
      index++;
      newChar = '\\' + nextChar;
      actions[APPEND]();
      return true
    }
  }

  while (mode != null) {
    index++;
    c = path[index];

    if (c === '\\' && maybeUnescapeQuote()) {
      continue
    }

    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap['else'] || ERROR;

    if (transition === ERROR) {
      return // parse error
    }

    mode = transition[0];
    action = actions[transition[1]];
    if (action) {
      newChar = transition[2];
      newChar = newChar === undefined
        ? c
        : newChar;
      if (action() === false) {
        return
      }
    }

    if (mode === AFTER_PATH) {
      keys.raw = path;
      return keys
    }
  }
}

/**
 * External parse that check for a cache hit first
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parsePath (path) {
  var hit = pathCache[path];
  if (!hit) {
    hit = parse(path);
    if (hit) {
      pathCache[path] = hit;
    }
  }
  return hit
}

var Path = function (Vue) {
  function empty (target) {
    if (target === null || target === undefined) { return true }

    if (Array.isArray(target)) {
      if (target.length > 0) { return false }
      if (target.length === 0) { return true }
    } else if (isPlainObject(target)) {
      /* eslint-disable prefer-const */
      for (var key in target) {
        if (hasOwn(target, key)) { return false }
      }
      /* eslint-enable prefer-const */
    }

    return true
  }

  /**
   * Get value from path string
   *
   * @param {Object} obj
   * @param {String} path
   * @return value
   */

  function getValue (obj, path) {
    if (!isObject(obj)) { return null }

    var paths = parsePath(path);
    if (empty(paths)) { return null }

    var length = paths.length;
    var ret = null;
    var last = obj;
    var i = 0;
    while (i < length) {
      var value = last[paths[i]];
      if (value === undefined) {
        last = null;
        break
      }
      last = value;
      i++;
    }

    ret = last;
    return ret
  }

  return getValue
};

/**
 * extend
 *
 * @param {Vue} Vue
 * @return {Vue}
 */

var Extend = function (Vue) {
  var format = Format(Vue);
  var getValue = Path(Vue);

  function parseArgs () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var lang = Vue.config.lang;
    var fallback = Vue.config.fallbackLang;

    if (args.length === 1) {
      if (isObject(args[0]) || Array.isArray(args[0])) {
        args = args[0];
      } else if (typeof args[0] === 'string') {
        lang = args[0];
      }
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        lang = args[0];
      }
      if (isObject(args[1]) || Array.isArray(args[1])) {
        args = args[1];
      }
    }

    return { lang: lang, fallback: fallback, params: args }
  }

  function exist (locale, key) {
    if (!locale || !key) { return false }
    return !isNil(getValue(locale, key))
  }

  function interpolate (locale, key, args) {
    if (!locale) { return null }

    var val = getValue(locale, key);
    if (Array.isArray(val)) { return val }
    if (isNil(val)) { val = locale[key]; }
    if (isNil(val)) { return null }
    if (typeof val !== 'string') { warn("Value of key '" + key + "' is not a string!"); return null }

    // Check for the existance of links within the translated string
    if (val.indexOf('@:') >= 0) {
      // Match all the links within the local
      // We are going to replace each of
      // them with its translation
      var matches = val.match(/(@:[\w|.]+)/g);
      for (var idx in matches) {
        var link = matches[idx];
        // Remove the leading @:
        var linkPlaceholder = link.substr(2);
        // Translate the link
        var translatedstring = interpolate(locale, linkPlaceholder, args);
        // Replace the link with the translated string
        val = val.replace(link, translatedstring);
      }
    }

    return !args
      ? val
      : Vue.config.i18nFormatter
        ? Vue.config.i18nFormatter.apply(null, [val].concat(args))
        : format(val, args)
  }

  function translate (getter, lang, fallback, key, params) {
    var res = null;
    res = interpolate(getter(lang), key, params);
    if (!isNil(res)) { return res }

    res = interpolate(getter(fallback), key, params);
    if (!isNil(res)) {
      if (false) {}
      return res
    } else {
      return null
    }
  }


  function warnDefault (lang, key, vm, result) {
    if (!isNil(result)) { return result }
    if (Vue.config.missingHandler) {
      Vue.config.missingHandler.apply(null, [lang, key, vm]);
    } else {
      if (false) {}
    }
    return key
  }

  function getAssetLocale (lang) {
    return Vue.locale(lang)
  }

  function getComponentLocale (lang) {
    return this.$options.locales[lang]
  }

  function getOldChoiceIndexFixed (choice) {
    return choice ? choice > 1 ? 1 : 0 : 1
  }

  function getChoiceIndex (choice, choicesLength) {
    choice = Math.abs(choice);

    if (choicesLength === 2) { return getOldChoiceIndexFixed(choice) }

    return choice ? Math.min(choice, 2) : 0
  }

  function fetchChoice (locale, choice) {
    if (!locale && typeof locale !== 'string') { return null }
    var choices = locale.split('|');

    choice = getChoiceIndex(choice, choices.length);
    if (!choices[choice]) { return locale }
    return choices[choice].trim()
  }

  /**
   * Vue.t
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {String}
   */

  Vue.t = function (key) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    if (!key) { return '' }
    var ref = parseArgs.apply(void 0, args);
    var lang = ref.lang;
    var fallback = ref.fallback;
    var params = ref.params;
    return warnDefault(lang, key, null, translate(getAssetLocale, lang, fallback, key, params))
  };

  /**
   * Vue.tc
   *
   * @param {String} key
   * @param {number|undefined} choice
   * @param {Array} ...args
   * @return {String}
   */

  Vue.tc = function (key, choice) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    return fetchChoice(Vue.t.apply(Vue, [ key ].concat( args )), choice)
  };

  /**
   * Vue.te
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {Boolean}
   */

  Vue.te = function (key) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var ref = parseArgs.apply(void 0, args);
    var lang = ref.lang;
    return exist(getAssetLocale(lang), key)
  };

  /**
   * $t
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {String}
   */

  Vue.prototype.$t = function (key) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    if (!key) { return '' }
    var ref = parseArgs.apply(void 0, args);
    var lang = ref.lang;
    var fallback = ref.fallback;
    var params = ref.params;
    var res = null;
    if (this.$options.locales) {
      res = translate(
        bind(getComponentLocale, this), lang, fallback, key, params
      );
      if (res) { return res }
    }
    return warnDefault(lang, key, this, translate(getAssetLocale, lang, fallback, key, params))
  };

  /**
   * $tc
   *
   * @param {String} key
   * @param {number|undefined} choice
   * @param {Array} ...args
   * @return {String}
   */

  Vue.prototype.$tc = function (key, choice) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    if (typeof choice !== 'number' && typeof choice !== 'undefined') {
      return key
    }
    return fetchChoice((ref = this).$t.apply(ref, [ key ].concat( args )), choice)
    var ref;
  };

  /**
   * $te
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {Boolean}
   *
   */

  Vue.prototype.$te = function (key) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var ref = parseArgs.apply(void 0, args);
    var lang = ref.lang;
    var found = false;
    if (this.$options.locales) { // exist component locale
      found = exist(bind(getComponentLocale)(lang), key);
    }
    if (!found) {
      found = exist(getAssetLocale(lang), key);
    }
    return found
  };

  Vue.mixin({
    computed: {
      $lang: function $lang () {
        return Vue.config.lang
      }
    }
  });

  return Vue
};

var langVM; // singleton


/**
 * plugin
 *
 * @param {Object} Vue
 * @param {Object} opts
 */

function plugin (Vue, opts) {
  if ( opts === void 0 ) opts = {};

  var version = (Vue.version && Number(Vue.version.split('.')[0])) || -1;

  if (false) {}

  if (false) {}

  var lang = 'en';
  setupLangVM(Vue, lang);

  Asset(Vue, langVM);
  Override(Vue, langVM);
  Config(Vue, langVM, lang);
  Extend(Vue);
}

function setupLangVM (Vue, lang) {
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  if (!langVM) {
    langVM = new Vue({ data: { lang: lang, locales: {} } });
  }
  Vue.config.silent = silent;
}

plugin.version = '__VERSION__';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

module.exports = plugin;


/***/ }),

/***/ "d5b9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("a8f3");
var descriptor = __webpack_require__("d48a");
var setToStringTag = __webpack_require__("b849");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("0cb2")(IteratorPrototype, __webpack_require__("eeeb")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "d8b3":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "d988":
/***/ (function(module, exports, __webpack_require__) {

(function (factory) {
    if (true) {
        // Node/CommonJS
        module.exports = factory();
    } else { var glob; }
}(function (undefined) {

    'use strict';

    /*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */
    var add32 = function (a, b) {
        return (a + b) & 0xFFFFFFFF;
    },
        hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];


    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;

        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;

        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;

        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b  = (b << 21 | b >>> 11) + c | 0;

        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    }

    function md5blk(s) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    function md5blk_array(a) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);
        return state;
    }

    function md51_array(a) {
        var n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
        }

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);

        return state;
    }

    function rhex(n) {
        var s = '',
            j;
        for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        }
        return s;
    }

    function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
        }
        return x.join('');
    }

    // In some cases the fast add32 function cannot be used..
    if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
        add32 = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
    }

    // ---------------------------------------------------

    /**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */

    if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
        (function () {
            function clamp(val, length) {
                val = (val | 0) || 0;

                if (val < 0) {
                    return Math.max(val + length, 0);
                }

                return Math.min(val, length);
            }

            ArrayBuffer.prototype.slice = function (from, to) {
                var length = this.byteLength,
                    begin = clamp(from, length),
                    end = length,
                    num,
                    target,
                    targetArray,
                    sourceArray;

                if (to !== undefined) {
                    end = clamp(to, length);
                }

                if (begin > end) {
                    return new ArrayBuffer(0);
                }

                num = end - begin;
                target = new ArrayBuffer(num);
                targetArray = new Uint8Array(target);

                sourceArray = new Uint8Array(this, begin, num);
                targetArray.set(sourceArray);

                return target;
            };
        })();
    }

    // ---------------------------------------------------

    /**
     * Helpers.
     */

    function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        return str;
    }

    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length,
           buff = new ArrayBuffer(length),
           arr = new Uint8Array(buff),
           i;

        for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
        }

        return returnUInt8Array ? arr : buff;
    }

    function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);

        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);

        return returnUInt8Array ? result : result.buffer;
    }

    function hexToBinaryString(hex) {
        var bytes = [],
            length = hex.length,
            x;

        for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
        }

        return String.fromCharCode.apply(String, bytes);
    }

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */

    function SparkMD5() {
        // call reset to init the instance
        this.reset();
    }

    /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.append = function (str) {
        // Converts the string to utf8 bytes if necessary
        // Then append as binary
        this.appendBinary(toUtf8(str));

        return this;
    };

    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.appendBinary = function (contents) {
        this._buff += contents;
        this._length += contents.length;

        var length = this._buff.length,
            i;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }

        this._buff = this._buff.substring(i - 64);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            i,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.reset = function () {
        this._buff = '';
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.prototype.getState = function () {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash.slice()
        };
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.setState = function (state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */
    SparkMD5.prototype.destroy = function () {
        delete this._hash;
        delete this._buff;
        delete this._length;
    };

    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */
    SparkMD5.prototype._finish = function (tail, length) {
        var i = length,
            tmp,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
    };

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} [raw] True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hash = function (str, raw) {
        // Converts the string to utf8 bytes if necessary
        // Then compute it using the binary function
        return SparkMD5.hashBinary(toUtf8(str), raw);
    };

    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} [raw]     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hashBinary = function (content, raw) {
        var hash = md51(content),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */
    SparkMD5.ArrayBuffer = function () {
        // call reset to init the instance
        this.reset();
    };

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.append = function (arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }

        this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.reset = function () {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.ArrayBuffer.prototype.getState = function () {
        var state = SparkMD5.prototype.getState.call(this);

        // Convert buffer to a string
        state.buff = arrayBuffer2Utf8Str(state.buff);

        return state;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.setState = function (state) {
        // Convert string to buffer
        state.buff = utf8Str2ArrayBuffer(state.buff, true);

        return SparkMD5.prototype.setState.call(this, state);
    };

    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;

    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     [raw] True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.hash = function (arr, raw) {
        var hash = md51_array(new Uint8Array(arr)),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    return SparkMD5;
}));


/***/ }),

/***/ "dae0":
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__("8a8a");
var gOPN = __webpack_require__("0808").f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "dce3":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "dcea":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("953d");
var ITERATOR = __webpack_require__("839a")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "de49":
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__("26df") && /./g.flags != 'g') __webpack_require__("bb8b").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__("6bf8")
});


/***/ }),

/***/ "de85":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("0cb2");


/***/ }),

/***/ "e067":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "e0ff":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("9cff");
var anObject = __webpack_require__("a86f");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("1e4d")(Function.call, __webpack_require__("285b").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "e3bb":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("d445");
var ITERATOR = __webpack_require__("839a")('iterator');
var Iterators = __webpack_require__("953d");
module.exports = __webpack_require__("76e3").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "e67d":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "e680":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("0b34");
var has = __webpack_require__("4fd4");
var cof = __webpack_require__("cea2");
var inheritIfRequired = __webpack_require__("a83a");
var toPrimitive = __webpack_require__("5d10");
var fails = __webpack_require__("0926");
var gOPN = __webpack_require__("21d9").f;
var gOPD = __webpack_require__("285b").f;
var dP = __webpack_require__("bb8b").f;
var $trim = __webpack_require__("eb34").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("7ee3")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("26df") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("84e8")(global, NUMBER, $Number);
}


/***/ }),

/***/ "e7c8":
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__("21d9");
var gOPS = __webpack_require__("0c29");
var anObject = __webpack_require__("a86f");
var Reflect = __webpack_require__("0b34").Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),

/***/ "e7e0":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("0677");
var document = __webpack_require__("a4cf").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "e7e6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ _toConsumableArray; });

// EXTERNAL MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/core-js/array/is-array.js
var is_array = __webpack_require__("caa7");
var is_array_default = /*#__PURE__*/__webpack_require__.n(is_array);

// CONCATENATED MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/arrayWithoutHoles.js


function _arrayWithoutHoles(arr) {
  if (is_array_default()(arr)) return _arrayLikeToArray(arr);
}
// EXTERNAL MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/core-js/symbol.js
var symbol = __webpack_require__("1b75");
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol);

// EXTERNAL MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/core-js/symbol/iterator.js
var iterator = __webpack_require__("2641");
var iterator_default = /*#__PURE__*/__webpack_require__.n(iterator);

// EXTERNAL MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/core-js/array/from.js
var from = __webpack_require__("578b");
var from_default = /*#__PURE__*/__webpack_require__.n(from);

// CONCATENATED MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/iterableToArray.js



function _iterableToArray(iter) {
  if (typeof symbol_default.a !== "undefined" && iter[iterator_default.a] != null || iter["@@iterator"] != null) return from_default()(iter);
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/unsupportedIterableToArray.js


function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return from_default()(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime-corejs2@7.15.3@@babel/runtime-corejs2/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

/***/ }),

/***/ "e8d7":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("9cff");
var document = __webpack_require__("0b34").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "e99b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("0b34");
var core = __webpack_require__("76e3");
var hide = __webpack_require__("065d");
var redefine = __webpack_require__("84e8");
var ctx = __webpack_require__("1e4d");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "e9aa":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("1e4d");
var IObject = __webpack_require__("1b96");
var toObject = __webpack_require__("8078");
var toLength = __webpack_require__("201c");
var asc = __webpack_require__("70f2");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "eb34":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("e99b");
var defined = __webpack_require__("3ab0");
var fails = __webpack_require__("0926");
var spaces = __webpack_require__("5dc3");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "edec":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("1e4d");
var invoke = __webpack_require__("a618");
var html = __webpack_require__("bbcc");
var cel = __webpack_require__("e8d7");
var global = __webpack_require__("0b34");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("cea2")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "ee68":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("7c2b");
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__("5e9e"), 'Object', { defineProperty: __webpack_require__("597a").f });


/***/ }),

/***/ "eeeb":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("4e6a")('wks');
var uid = __webpack_require__("f6cf");
var Symbol = __webpack_require__("a4cf").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "f1d8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("3f48");
var bind = __webpack_require__("bdf1");
var Axios = __webpack_require__("62c0");
var mergeConfig = __webpack_require__("37fe");
var defaults = __webpack_require__("7723");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("1586");
axios.CancelToken = __webpack_require__("275a");
axios.isCancel = __webpack_require__("5816");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("20e0");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__("8ed0");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "f263":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("ee68");
var $Object = __webpack_require__("ce99").Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ "f30a":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("690e")(false);
// imports


// module
exports.push([module.i, "/*!\n * Viewer.js v1.10.1\n * https://fengyuanchen.github.io/viewerjs\n *\n * Copyright 2015-present Chen Fengyuan\n * Released under the MIT license\n *\n * Date: 2021-08-01T13:35:44.576Z\n */.viewer-close:before,.viewer-flip-horizontal:before,.viewer-flip-vertical:before,.viewer-fullscreen-exit:before,.viewer-fullscreen:before,.viewer-next:before,.viewer-one-to-one:before,.viewer-play:before,.viewer-prev:before,.viewer-reset:before,.viewer-rotate-left:before,.viewer-rotate-right:before,.viewer-zoom-in:before,.viewer-zoom-out:before{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC\");background-repeat:no-repeat;background-size:280px;color:transparent;display:block;font-size:0;height:20px;line-height:0;width:20px}.viewer-zoom-in:before{background-position:0 0;content:\"Zoom In\"}.viewer-zoom-out:before{background-position:-20px 0;content:\"Zoom Out\"}.viewer-one-to-one:before{background-position:-40px 0;content:\"One to One\"}.viewer-reset:before{background-position:-60px 0;content:\"Reset\"}.viewer-prev:before{background-position:-80px 0;content:\"Previous\"}.viewer-play:before{background-position:-100px 0;content:\"Play\"}.viewer-next:before{background-position:-120px 0;content:\"Next\"}.viewer-rotate-left:before{background-position:-140px 0;content:\"Rotate Left\"}.viewer-rotate-right:before{background-position:-160px 0;content:\"Rotate Right\"}.viewer-flip-horizontal:before{background-position:-180px 0;content:\"Flip Horizontal\"}.viewer-flip-vertical:before{background-position:-200px 0;content:\"Flip Vertical\"}.viewer-fullscreen:before{background-position:-220px 0;content:\"Enter Full Screen\"}.viewer-fullscreen-exit:before{background-position:-240px 0;content:\"Exit Full Screen\"}.viewer-close:before{background-position:-260px 0;content:\"Close\"}.viewer-container{bottom:0;direction:ltr;font-size:0;left:0;line-height:0;overflow:hidden;position:absolute;right:0;-webkit-tap-highlight-color:transparent;top:0;-ms-touch-action:none;touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.viewer-container::-moz-selection,.viewer-container ::-moz-selection{background-color:transparent}.viewer-container::selection,.viewer-container ::selection{background-color:transparent}.viewer-container:focus{outline:0}.viewer-container img{display:block;height:auto;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;width:100%}.viewer-canvas{bottom:0;left:0;overflow:hidden;position:absolute;right:0;top:0}.viewer-canvas>img{height:auto;margin:15px auto;max-width:90%!important;width:auto}.viewer-footer{bottom:0;left:0;overflow:hidden;position:absolute;right:0;text-align:center}.viewer-navbar{background-color:rgba(0,0,0,.5);overflow:hidden}.viewer-list{-webkit-box-sizing:content-box;box-sizing:content-box;height:50px;margin:0;overflow:hidden;padding:1px 0}.viewer-list>li{color:transparent;cursor:pointer;float:left;font-size:0;height:50px;line-height:0;opacity:.5;overflow:hidden;-webkit-transition:opacity .15s;transition:opacity .15s;width:30px}.viewer-list>li:focus,.viewer-list>li:hover{opacity:.75}.viewer-list>li:focus{outline:0}.viewer-list>li+li{margin-left:1px}.viewer-list>.viewer-loading{position:relative}.viewer-list>.viewer-loading:after{border-width:2px;height:20px;margin-left:-10px;margin-top:-10px;width:20px}.viewer-list>.viewer-active,.viewer-list>.viewer-active:focus,.viewer-list>.viewer-active:hover{opacity:1}.viewer-player{background-color:#000;bottom:0;cursor:none;display:none;right:0;z-index:1}.viewer-player,.viewer-player>img{left:0;position:absolute;top:0}.viewer-toolbar>ul{display:inline-block;margin:0 auto 5px;overflow:hidden;padding:6px 3px}.viewer-toolbar>ul>li{background-color:rgba(0,0,0,.5);border-radius:50%;cursor:pointer;float:left;height:24px;overflow:hidden;-webkit-transition:background-color .15s;transition:background-color .15s;width:24px}.viewer-toolbar>ul>li:focus,.viewer-toolbar>ul>li:hover{background-color:rgba(0,0,0,.8)}.viewer-toolbar>ul>li:focus{-webkit-box-shadow:0 0 3px #fff;box-shadow:0 0 3px #fff;outline:0;position:relative;z-index:1}.viewer-toolbar>ul>li:before{margin:2px}.viewer-toolbar>ul>li+li{margin-left:1px}.viewer-toolbar>ul>.viewer-small{height:18px;margin-bottom:3px;margin-top:3px;width:18px}.viewer-toolbar>ul>.viewer-small:before{margin:-1px}.viewer-toolbar>ul>.viewer-large{height:30px;margin-bottom:-3px;margin-top:-3px;width:30px}.viewer-toolbar>ul>.viewer-large:before{margin:5px}.viewer-tooltip{background-color:rgba(0,0,0,.8);border-radius:10px;color:#fff;display:none;font-size:12px;height:20px;left:50%;line-height:20px;margin-left:-25px;margin-top:-10px;position:absolute;text-align:center;top:50%;width:50px}.viewer-title{color:#ccc;display:inline-block;font-size:12px;line-height:1;margin:0 5% 5px;max-width:90%;opacity:.8;overflow:hidden;text-overflow:ellipsis;-webkit-transition:opacity .15s;transition:opacity .15s;white-space:nowrap}.viewer-title:hover{opacity:1}.viewer-button{background-color:rgba(0,0,0,.5);border-radius:50%;cursor:pointer;height:80px;overflow:hidden;position:absolute;right:-40px;top:-40px;-webkit-transition:background-color .15s;transition:background-color .15s;width:80px}.viewer-button:focus,.viewer-button:hover{background-color:rgba(0,0,0,.8)}.viewer-button:focus{-webkit-box-shadow:0 0 3px #fff;box-shadow:0 0 3px #fff;outline:0}.viewer-button:before{bottom:15px;left:15px;position:absolute}.viewer-fixed{position:fixed}.viewer-open{overflow:hidden}.viewer-show{display:block}.viewer-hide{display:none}.viewer-backdrop{background-color:rgba(0,0,0,.5)}.viewer-invisible{visibility:hidden}.viewer-move{cursor:move;cursor:-webkit-grab;cursor:grab}.viewer-fade{opacity:0}.viewer-in{opacity:1}.viewer-transition{-webkit-transition:all .3s;transition:all .3s}@-webkit-keyframes viewer-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes viewer-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.viewer-loading:after{-webkit-animation:viewer-spinner 1s linear infinite;animation:viewer-spinner 1s linear infinite;border:4px solid hsla(0,0%,100%,.1);border-left-color:hsla(0,0%,100%,.5);border-radius:50%;content:\"\";display:inline-block;height:40px;left:50%;margin-left:-20px;margin-top:-20px;position:absolute;top:50%;width:40px;z-index:1}@media (max-width:767px){.viewer-hide-xs-down{display:none}}@media (max-width:991px){.viewer-hide-sm-down{display:none}}@media (max-width:1199px){.viewer-hide-md-down{display:none}}", ""]);

// exports


/***/ }),

/***/ "f3cc":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("8a8a");
var toLength = __webpack_require__("f861");
var toAbsoluteIndex = __webpack_require__("12cb");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "f411":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("dce3");
var toObject = __webpack_require__("3212");
var IE_PROTO = __webpack_require__("245c")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "f417":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("d445");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "f4aa":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__("a4cf");
var has = __webpack_require__("dce3");
var DESCRIPTORS = __webpack_require__("5e9e");
var $export = __webpack_require__("7c2b");
var redefine = __webpack_require__("de85");
var META = __webpack_require__("73e1").KEY;
var $fails = __webpack_require__("99fe");
var shared = __webpack_require__("4e6a");
var setToStringTag = __webpack_require__("b849");
var uid = __webpack_require__("f6cf");
var wks = __webpack_require__("eeeb");
var wksExt = __webpack_require__("708a");
var wksDefine = __webpack_require__("8af7");
var enumKeys = __webpack_require__("4409");
var isArray = __webpack_require__("45cf");
var anObject = __webpack_require__("970b");
var isObject = __webpack_require__("0677");
var toObject = __webpack_require__("3212");
var toIObject = __webpack_require__("8a8a");
var toPrimitive = __webpack_require__("5d61");
var createDesc = __webpack_require__("d48a");
var _create = __webpack_require__("a8f3");
var gOPNExt = __webpack_require__("dae0");
var $GOPD = __webpack_require__("37b4");
var $GOPS = __webpack_require__("946b");
var $DP = __webpack_require__("597a");
var $keys = __webpack_require__("4b9f");
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__("0808").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__("0cc5").f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__("bf84")) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__("0cb2")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ "f6cf":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "f7c9":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("690e")(false);
// imports


// module
exports.push([module.i, ".fm-style .el-radio+.el-radio{margin-left:0!important}.fm-style .el-radio{margin-right:30px}.fm-style .el-checkbox+.el-checkbox{margin-left:0!important}.fm-style .el-checkbox{margin-right:30px}.fm-style .el-form-item--small .el-radio{line-height:32px!important}.fm-style .el-form-item--small .el-rate{margin-top:6px}.fm-style .el-form-item--mini .el-radio{line-height:28px!important}.fm-style .el-form-item--mini .el-rate{margin-top:4px}.fm-style .el-form-item--medium .el-radio{line-height:36px!important}.fm-style .el-form-item--medium .el-rate{margin-top:8px}", ""]);

// exports


/***/ }),

/***/ "f861":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("3a08");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "f91d":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("12c7");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("5925").default
var update = add("b26948a2", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "f966":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("0b34");
var dP = __webpack_require__("bb8b");
var DESCRIPTORS = __webpack_require__("26df");
var SPECIES = __webpack_require__("839a")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "fa2d":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/iconfont.4d5a9051.ttf";

/***/ }),

/***/ "fb49":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "fdf9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__("597a");
var createDesc = __webpack_require__("d48a");

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ })

/******/ });
});
//# sourceMappingURL=shzl-ui.umd.js.map