/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/@googlemaps+js-api-loader@2.0.1/node_modules/@googlemaps/js-api-loader/dist/index.js":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@googlemaps+js-api-loader@2.0.1/node_modules/@googlemaps/js-api-loader/dist/index.js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Loader: () => (/* binding */ Loader),
/* harmony export */   importLibrary: () => (/* binding */ importLibrary),
/* harmony export */   setOptions: () => (/* binding */ setOptions)
/* harmony export */ });
/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function setScriptSrc(script, src) {
    script.src = src;
}

/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


const bootstrap = bootstrapParams => {
  var bootstrapPromise;
  var script;
  var bootstrapParamsKey;
  var PRODUCT_NAME = "The Google Maps JavaScript API";
  var GOOGLE = "google";
  var IMPORT_API_NAME = "importLibrary";
  var PENDING_BOOTSTRAP_KEY = "__ib__";
  var doc = document;
  var global_ = window;
  var google_ = global_[GOOGLE] || (global_[GOOGLE] = {});
  var namespace = google_.maps || (google_.maps = {});
  var libraries = new Set();
  var searchParams = new URLSearchParams();
  var triggerBootstrap = () => bootstrapPromise || (bootstrapPromise = new Promise(async(resolve, reject) => {
    await (script = doc.createElement("script"));
    searchParams.set("libraries", [...libraries] + "");
    for (bootstrapParamsKey in bootstrapParams) {
      searchParams.set(bootstrapParamsKey.replace(/[A-Z]/g, g => "_" + g[0].toLowerCase()), bootstrapParams[bootstrapParamsKey]);
    }
    searchParams.set("callback", GOOGLE + ".maps." + PENDING_BOOTSTRAP_KEY);
    setScriptSrc(script, "https://maps.googleapis.com/maps/api/js?" + searchParams);
    namespace[PENDING_BOOTSTRAP_KEY] = resolve;
    script.onerror = () => bootstrapPromise = reject(Error(PRODUCT_NAME + " could not load."));
    script.nonce = doc.querySelector("script[nonce]")?.nonce || "";
    doc.head.append(script);
  }));
  namespace[IMPORT_API_NAME] ? console.warn(PRODUCT_NAME + " only loads once. Ignoring:", bootstrapParams) : namespace[IMPORT_API_NAME] = (libraryName, ...args) => libraries.add(libraryName) && triggerBootstrap().then(() => namespace[IMPORT_API_NAME](libraryName, ...args));
};

const MSG_DEPRECATED_LOADER = "The Loader class is no longer available in this version." +
    "\nPlease use the new functional API: setOptions() and importLibrary()." +
    "\nFor more information, see the updated documentation at: " +
    "https://github.com/googlemaps/js-api-loader/blob/main/README.md";
const MSG_REPEATED_SET_OPTIONS = (options) => `The setOptions() function should only be called once. The options passed ` +
    `to the additional call (${JSON.stringify(options)}) will be ignored.`;
const MSG_IMPORT_LIBRARY_EXISTS = (options) => `The google.maps.importLibrary() function is already defined, and ` +
    `@googlemaps/js-api-loader will use the existing function instead of ` +
    `overwriting it. The options passed to setOptions ` +
    `(${JSON.stringify(options)}) will be ignored.`;
const MSG_SET_OPTIONS_NOT_CALLED = "No options were set before calling importLibrary. Make sure to configure " +
    "the loader using setOptions().";
const MSG_SCRIPT_ELEMENT_EXISTS = "There already is a script loading the Google Maps JavaScript " +
    "API, and no google.maps.importLibrary function is defined. " +
    "@googlemaps/js-api-loader will proceed to bootstrap the API " +
    "with the specified options, but the existing script might cause " +
    "problems using the API. Make sure to remove the script " +
    "loading the API.";
const logDevWarning =  true
    ? (message) => {
        console.warn(`[@googlemaps/js-api-loader] ${message}`);
    }
    : 0;
const logDevNotice =  true
    ? (message) => {
        console.info(`[@googlemaps/js-api-loader] ${message}`);
    }
    : 0;

/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * @deprecated Use the new functional API: `setOptions()` and `importLibrary()`.
 * See the migration guide for more details: MIGRATION.md
 */
class Loader {
    constructor(...args) {
        throw new Error(`[@googlemaps/js-api-loader]: ${MSG_DEPRECATED_LOADER}`);
    }
}

/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let setOptionsWasCalled_ = false;
/**
 * Sets the options for the Maps JavaScript API.
 *
 * Has to be called before any library is loaded.
 *
 * See https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters
 * for the full documentation of available options.
 *
 * @param options The options to set.
 */
function setOptions(options) {
    if (setOptionsWasCalled_) {
        logDevWarning(MSG_REPEATED_SET_OPTIONS(options));
        return;
    }
    installImportLibrary_(options);
    setOptionsWasCalled_ = true;
}
async function importLibrary(libraryName) {
    if (!setOptionsWasCalled_) {
        logDevWarning(MSG_SET_OPTIONS_NOT_CALLED);
    }
    if (!window?.google?.maps?.importLibrary) {
        throw new Error("google.maps.importLibrary is not installed.");
    }
    return (await google.maps.importLibrary(libraryName));
}
/**
 * The installImportLibrary_ function makes sure that a usable version of the
 * `google.maps.importLibrary` function exists.
 */
function installImportLibrary_(options) {
    const importLibraryExists = Boolean(window.google?.maps?.importLibrary);
    if (importLibraryExists) {
        logDevNotice(MSG_IMPORT_LIBRARY_EXISTS(options));
    }
    else if (true) {
        const scriptEl = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
        if (scriptEl) {
            logDevWarning(MSG_SCRIPT_ELEMENT_EXISTS);
        }
    }
    // If the google.maps.importLibrary function already exists, bootstrap()
    // won't do anything, so we won't call it
    if (!importLibraryExists) {
        bootstrap(options);
    }
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./src/js/account.js":
/*!***************************!*\
  !*** ./src/js/account.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  get: function () {
    // Get account
    const account = JSON.parse(localStorage.getItem('hj-account'));

    // If account is object, return account; else, return empty object
    return underscore__WEBPACK_IMPORTED_MODULE_0___default().isObject(account) ? account : {};
  },
  set: function (data) {
    localStorage.setItem('hj-account', JSON.stringify(data));
  },
  save: function (data) {
    // Get account
    const account = this.get();

    // Apply data to account and set
    this.set(underscore__WEBPACK_IMPORTED_MODULE_0___default().extend(account, data));
  },
  isPropertyInSentList: function (building_id, unit_id) {
    // Get account
    const account = this.get();

    // If account has sent list
    if (account.sent) {
      // Check if inquiry already sent for property ID
      return account.sent.indexOf(`${building_id},${unit_id || ''}`) !== -1;
    } else {
      return false;
    }
  },
  addPropertyToSentList: function (building_id, unit_id) {
    // Get account
    const account = this.get();

    // Ensure sent list is initialized
    if (!account.sent) {
      account.sent = [];
    }

    // Add property ID
    account.sent.push(`${building_id},${unit_id || ''}`);

    // Set account
    this.set(account);
  }
});

/***/ }),

/***/ "./src/js/config.js":
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  resultsLimit: 50,
  icons: {
    // Source: http://mapicons.nicolasmollet.com/
    url_base_out: '/wp-content/themes/hj-wp/images/map-icons/27A9E1',
    url_base_over: '/wp-content/themes/hj-wp/images/map-icons/652C90',
    url_base_infobox: '/wp-content/themes/hj-wp/images/map-icons/8CC63E',
    information: {
      over: 'information.png',
      out: 'information.png'
    },
    building: {
      over: 'office-building.png',
      out: 'office-building.png'
    },
    land: {
      over: 'grass.png',
      out: 'grass.png'
    },
    house: {
      over: 'townhouse.png',
      out: 'townhouse.png'
    },
    unit: {
      over: 'apartment-3.png',
      out: 'apartment-3.png'
    },
    dot: {
      over: 'dot.png',
      out: 'dot.png'
    }
  }
});

/***/ }),

/***/ "./src/js/form-helper.js":
/*!*******************************!*\
  !*** ./src/js/form-helper.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFormData: () => (/* binding */ getFormData),
/* harmony export */   putFormData: () => (/* binding */ putFormData)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Form helper
 */

function getFormData(form, allowEmpty = false) {
  const query = {};
  underscore__WEBPACK_IMPORTED_MODULE_1___default().each(jquery__WEBPACK_IMPORTED_MODULE_0___default()(form).serializeArray(), f => {
    if ('id' === f.name && f.value.length > 2 && isNaN(Number(f.value.substring(0, 2)))) {
      f.value = f.value.substring(2);
    }

    // If value is empty, and empty not allowed; skip
    if (underscore__WEBPACK_IMPORTED_MODULE_1___default().isEmpty(f.value) && !allowEmpty) {
      return;
    }

    // If field name already string; convert to array
    if ('string' === typeof query[f.name]) {
      query[f.name] = [query[f.name]];
    }
    if (query[f.name] instanceof Array) {
      query[f.name].push(f.value);
    } else {
      query[f.name] = f.value;
    }
  });
  return query;
}
function putFormData(form, data, trigger = false) {
  const fields = [];
  const maxDepth = 10;
  const process = function (data, parentField, currentField, depth) {
    parentField = parentField || '';
    currentField = currentField || '';
    depth = depth || 0;

    // If maxDepth exceeded, return
    if (depth > maxDepth) {
      return;
    }

    // If data is array
    if (data instanceof Array) {
      for (let i = data.length - 1; i >= 0; i--) {
        process(data[i], parentField, currentField, depth + 1);
      }
    }
    // Else if data is object
    else if (data instanceof Object) {
      // Set current field to parent field
      parentField = parentField ? parentField + '[' + currentField + ']' : currentField;
      // Loop through fields in data
      let field;
      for (field in data) {
        // Recursively process data
        process(data[field], parentField, field, depth + 1);
      }
    }
    // Else data is value
    else {
      // Push data
      fields.push({
        name: parentField ? parentField + '[' + currentField + ']' : currentField,
        value: data
      });
    }
  };
  process(data);
  let inputs;
  form = jquery__WEBPACK_IMPORTED_MODULE_0___default()(form);
  for (let i = fields.length - 1; i >= 0; i--) {
    inputs = form.find('[name="' + fields[i].name + '"]');
    if (inputs.length) {
      _setFieldValue(inputs, fields[i].value, trigger);
    }
  }
  if (trigger) {
    form.trigger('change');
  }
}
function _setFieldValue(inputs, v, trigger = false) {
  if ('undefined' !== typeof v) {
    if (null !== v) {
      if ('radio' === inputs.prop('type')) {
        inputs.filter('[value="' + v + '"]').prop('checked', true);
      } else if ('checkbox' === inputs.prop('type')) {
        inputs.filter('[value="' + (typeof v === 'boolean' ? v ? 1 : 0 : v) + '"]').prop('checked', true);
      } else {
        inputs.val(v);
      }
    }

    // Trigger "change" event on element
    if (trigger) {
      inputs.trigger('change');
    }
  }
}

/***/ }),

/***/ "./src/js/helper.js":
/*!**************************!*\
  !*** ./src/js/helper.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addressText: () => (/* binding */ addressText),
/* harmony export */   bathroomIcon: () => (/* binding */ bathroomIcon),
/* harmony export */   bedroomIcon: () => (/* binding */ bedroomIcon),
/* harmony export */   bedroomNo: () => (/* binding */ bedroomNo),
/* harmony export */   bedroomText: () => (/* binding */ bedroomText),
/* harmony export */   buildingUrl: () => (/* binding */ buildingUrl),
/* harmony export */   cardTitleUrl: () => (/* binding */ cardTitleUrl),
/* harmony export */   currency: () => (/* binding */ currency),
/* harmony export */   determinePropertyType: () => (/* binding */ determinePropertyType),
/* harmony export */   flatUnitDetailsUrl: () => (/* binding */ flatUnitDetailsUrl),
/* harmony export */   getCost: () => (/* binding */ getCost),
/* harmony export */   getFlatPhotoUrl: () => (/* binding */ getFlatPhotoUrl),
/* harmony export */   getPhotoUrl: () => (/* binding */ getPhotoUrl),
/* harmony export */   getSize: () => (/* binding */ getSize),
/* harmony export */   isMembersOnly: () => (/* binding */ isMembersOnly),
/* harmony export */   moneyFormat: () => (/* binding */ moneyFormat),
/* harmony export */   propertyAlias: () => (/* binding */ propertyAlias),
/* harmony export */   roomNumberText: () => (/* binding */ roomNumberText),
/* harmony export */   round_down_inc: () => (/* binding */ round_down_inc),
/* harmony export */   structureDetailsUrl: () => (/* binding */ structureDetailsUrl),
/* harmony export */   structureTypeText: () => (/* binding */ structureTypeText),
/* harmony export */   t: () => (/* binding */ t),
/* harmony export */   trainInfo: () => (/* binding */ trainInfo),
/* harmony export */   unitDetailsUrl: () => (/* binding */ unitDetailsUrl)
/* harmony export */ });
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__);


function propertyAlias(p) {
  if (p.structure_type === 'building' && underscore__WEBPACK_IMPORTED_MODULE_1___default().isArray(p.units)) {
    return p.location.x_neighborhood + ' ' + t('unit');
  } else {
    return p.location.x_neighborhood + ' ' + structureTypeText(p);
  }
}
function determinePropertyType(p) {
  if (p.price > 0) {
    return 'sales';
  } else if (p.rent > 0) {
    return 'rent';
  } else if (p.monthly_rate > 0) {
    return 'monthly';
  } else if (p.weekly_rate > 0) {
    return 'weekly';
  } else {
    return '';
  }
}
function addressText(p) {
  if (p.location.prefecture === '東京都' && p.location.neighborhood !== null && p.location.city !== null) {
    return t('short_location', {
      city: p.location.x_city,
      neighborhood: p.location.x_neighborhood
    });
  } else {
    return p.location.x_city;
  }
}
function roomNumberText(p) {
  return p.room_no ? t('unit_no', {
    room_no: p.room_no
  }) : structureTypeText(p);
}
function getSize(p) {
  if (isMembersOnly(p)) {
    return round_down_inc(p.size, 10) + '+';
  } else {
    return p.size;
  }
}
function getCost(p) {
  if (p.rent > 0) {
    return p.rent;
  } else if (p.monthly_rate > 0) {
    return p.monthly_rate;
  } else if (p.weekly_rate > 0) {
    return p.weekly_rate;
  } else if (p.price > 0) {
    return p.price;
  }
  return 0;
}
function isMembersOnly(p) {
  return p.members_only;
}
function structureTypeText(p) {
  switch (p.structure_type) {
    case 'unit':
      return t('unit');
    case 'house':
      return t('house');
    case 'land':
      return t('land');
    case 'building':
      return t('building');
    default:
      return p.structure_type;
  }
}
function bedroomNo(p) {
  if (p.bedroom_no === null) {
    return '';
  }
  const floorplan_type = bedroomSuffix(p.bedroom_no, p.floorplan_type);
  return p.bedroom_no === 0 ? t('studio') : t('bedroom_no', {
    bedroom_no: p.bedroom_no,
    floorplan_type
  });
}
function bedroomSuffix(bedroomNo, floorplanType) {
  if (bedroomNo === 0) {
    return 'R';
  } else if (floorplanType) {
    return floorplanType;
  } else {
    return 'LDK';
  }
}
function bedroomText(p) {
  if (p.bedroom_no === null) {
    return '';
  }
  const floorplan_type = bedroomSuffix(p.bedroom_no, p.floorplan_type);
  return p.bedroom_no === 0 ? t('studio') : t('bedroom_no', {
    bedroom_no: p.bedroom_no,
    floorplan_type
  });
}
function bedroomIcon(p) {
  if (p.bedroom_no === null) {
    return '';
  }
  const floorplan_type = bedroomSuffix(p.bedroom_no, p.floorplan_type);
  return p.bedroom_no === 0 ? t('studio') : t('bedroom_icon', {
    bedroom_no: p.bedroom_no,
    floorplan_type
  });
}
function bathroomIcon(p) {
  if (p.bathroom_no === null) {
    return '';
  }
  return t('bathroom_icon', {
    bathroom_no: p.bathroom_no
  });
}
function buildingUrl(p, prefix) {
  if (p.structure_type === 'building') {
    return '/' + prefix + '/' + (p.structure_name_slug || '-') + '/';
  } else {
    // Return URL to building page
    return '/' + prefix + '/' + (p.structure_name_slug || '-') + '/';
  }
}
function structureDetailsUrl(p, prefix, key) {
  const basePath = `/${prefix}/${p.structure_name_slug || '-'}/b${p.id}-`;
  const floors = p.structure_type === 'land' ? '' : `${p.total_floors}floors-`;
  const size = `${Math.floor(p.size)}sqm-`;
  const type = `${p.structure_type}-`;
  const location = `${p.location.neighborhood_slug}/`;
  const linkKey = key ? `?key=${key}` : '';
  return basePath + floors + size + type + location + linkKey;
}
function unitDetailsUrl(p, unit, prefix, key) {
  // Return unit URL
  return '/' + prefix + '/' + (p.structure_name_slug || '-') + '/' + unit.id + '-' + `${unit.bedroom_no}bed` + '-' + `${unit.bathroom_no}bath` + '-' + `${Math.floor(unit.size)}sqm` + '-' + 'unit' + '-' + p.location.neighborhood_slug + '/' + (key ? '?key=' + key : '');
}
function flatUnitDetailsUrl(p, prefix, key) {
  // Return unit URL
  return '/' + prefix + '/' + (p.structure_name_slug || '-') + '/' + p.id + '-' + `${p.bedroom_no}bed` + '-' + `${p.bathroom_no}bath` + '-' + `${Math.floor(p.size)}sqm` + '-' + 'unit' + '-' + p.location.neighborhood_slug + '/' + (key ? '?key=' + key : '');
}
function cardTitleUrl(p, section, key) {
  let cardTitleUrl = '';
  if (p.structure_type === 'house' && p.unit) {
    cardTitleUrl = unitDetailsUrl(p, p.unit, section, key);
  } else if (p.structure_type === 'land') {
    cardTitleUrl = structureDetailsUrl(p, section, key);
  } else if (p.structure_type === 'building') {
    if (p.units === undefined || p.units.length === 0) {
      cardTitleUrl = structureDetailsUrl(p, section, key);
    } else if (p.units.length === 1) {
      cardTitleUrl = unitDetailsUrl(p, p.units[0], section, key);
    } else {
      cardTitleUrl = buildingUrl(p, section);
    }
  } else {
    cardTitleUrl = buildingUrl(p, section);
  }
  return cardTitleUrl;
}
function getPhotoUrl(p) {
  if (p.image) {
    if (p.structure_type === 'unit') {
      // Prepend property ID to filename and return
      return (HJ__WEBPACK_IMPORTED_MODULE_0___default().Config).img_url + '/u/' + p.id + '/' + p.image.filename;
    } else {
      // Prepend building ID to filename and return
      return (HJ__WEBPACK_IMPORTED_MODULE_0___default().Config).img_url + '/b/' + p.id + '/' + p.image.filename;
    }
  } else {
    return null;
  }
}
function getFlatPhotoUrl(p) {
  if (p.image) {
    if (p.structure_type === 'unit' || p.structure_type === 'house') {
      // Prepend property ID to filename and return
      return (HJ__WEBPACK_IMPORTED_MODULE_0___default().Config).img_url + '/b/' + p.building_id + '/' + p.image.filename;
    } else {
      // Prepend building ID to filename and return
      return (HJ__WEBPACK_IMPORTED_MODULE_0___default().Config).img_url + '/b/' + p.id + '/' + p.image.filename;
    }
  } else {
    return null;
  }
}
function moneyFormat(num, shorten_num = false) {
  if (num === null) {
    return 0;
  }
  let formatted = '';

  // Convert to string
  num = num.toString();
  if ((HJ__WEBPACK_IMPORTED_MODULE_0___default().Config).language === 'ja') {
    // If 100万 or more
    if (num >= 1000000) {
      // Divide by 10000, convert to string
      formatted = Math.round(num / 10000).toString();

      // If length is >=5, need to inject 億
      if (formatted.length >= 5) {
        const oku = Number(formatted.slice(0, -4));
        const man = Number(formatted.slice(-4));
        formatted = oku.toString() + '億';
        if (man) {
          formatted += man.toString() + '万';
        }
      } else {
        formatted += '万';
      }
    } else {
      const man = num / 10000;

      // If integer, simply append 万
      if (man % 1 === 0) {
        // JS only has Number type, so need to do (n % 1) to check if integer
        formatted = man + '万';
      }
      // Else, format to 1dp and append 万
      else {
        formatted = man.toFixed(1) + '万';
      }
    }
    return formatted;
  } else {
    if (shorten_num) {
      const maxDigits = num < 1000000000 ? 2 : 3;
      formatted = Number(num).toLocaleString('en-US', {
        maximumFractionDigits: maxDigits,
        notation: 'compact',
        compactDisplay: 'short'
      });
    } else {
      let pos = 0;
      // Add comma after every 3rd number
      for (let i = num.length; i >= 0; i--) {
        if (3 === pos && i !== 0) {
          formatted = ',' + num.charAt(i) + formatted;
          pos = 1;
        } else {
          formatted = num.charAt(i) + formatted;
          pos++;
        }
      }
    }
    return shorten_num ? `${currency()} ${formatted}` : t('cost', {
      cost: formatted
    });
  }
}
function currency() {
  return '&yen;';
}
function trainInfo(p, i) {
  if (p.stations && p.stations[i]) {
    if (isMembersOnly(p)) {
      return p.stations[i].x_station_name;
    } else {
      return t('station_min', {
        station: p.stations[i].x_station_name,
        min: p.stations[i].distance
      });
    }
  }
  return '';
}
function round_down_inc(value, inc) {
  return Math.floor(value / inc) * inc;
}
function t(key, placeholderList) {
  let translatedText = (HJ__WEBPACK_IMPORTED_MODULE_0___default().translations)[key];
  if (translatedText === undefined) {
    console.warn(`Translation for key:"${key}" not found.`);
    return key;
  }
  if (placeholderList) {
    const placeholderKeyList = Object.keys(placeholderList);
    for (const placeholderKey of placeholderKeyList) {
      translatedText = translatedText.replace('${' + placeholderKey + '}', placeholderList[placeholderKey]);
    }
  }
  return translatedText;
}


/***/ }),

/***/ "./src/js/inquiry/form.js":
/*!********************************!*\
  !*** ./src/js/inquiry/form.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InquiryFormView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var nprogress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! nprogress */ "nprogress");
/* harmony import */ var nprogress__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _account__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../account */ "./src/js/account.js");
/* harmony import */ var _spinner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../spinner */ "./src/js/spinner.js");








class InquiryFormView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize() {
    this.spinner = new _spinner__WEBPACK_IMPORTED_MODULE_7__["default"]();
    this.events = {
      'focus .has-error': this.handleFocusErrorField,
      'change #field-date_from': this.handleChangeDateFrom,
      'click [data-action="back"]': this.handleClickBack,
      'change #source-select': this.handleOtherSourceSelect,
      'change #inquiry-type-select': this.handleInquiryTypeChange,
      submit: this.handleSubmit
    };
  }
  initialize(options) {
    this.inquiry_type = options.inquiry_type || null;
    this.building_id = Number(options.building_id) || null;
    this.unit_id = Number(options.unit_id) || null;
    this.notification_email = options.notification_email || null;
    this.page_url = options.page_url || null;
    this.page_title = options.page_title || null;
    this.is_contact = options.is_contact || false;
    this.google_site_key = options.google_site_key || null;
    this.api_client_id = options.api_client_id || null;
    if (this.api_client_id === null) {
      throw Error('Parameter api_client_id not set');
    }

    // Define message box
    this.msgBox = this.el.querySelector('[data-part="msg"]');
    if (this.msgBox === null) {
      console.warn('Container for messages not found');
    }

    // Populate inquiry form with Account data
    this.populateForm(_account__WEBPACK_IMPORTED_MODULE_6__["default"].get());

    // If inquiry already sent for this building/unit; display message
    if (this.building_id && _account__WEBPACK_IMPORTED_MODULE_6__["default"].isPropertyInSentList(this.building_id, this.unit_id)) {
      this.$el.find('form').empty();
      this.showMessageAlreadyReceived();
    }
  }
  handleFocusErrorField($e) {
    this.clearFieldError($e.currentTarget);
  }
  clearFieldError(field) {
    // Remove error class for this field
    field.classList.remove('has-error');

    // Hide any error messages
    this.clearMessages();
  }
  handleChangeDateFrom($e) {
    const date_start = moment__WEBPACK_IMPORTED_MODULE_3___default()($e.currentTarget.value);

    // If date is not valid, clear "date to" field
    if (!date_start.isValid()) {
      this.el.querySelector('#field-date_to').value = '';
      return;
    }

    // Set date_to to 30 days (29 nights) after date_from
    this.el.querySelector('#field-date_to').value = date_start.add(29, 'days').format('YYYY-MM-DD');
  }
  handleInquiryTypeChange(e) {
    const investmentPropertyTypeInput = this.el.querySelector('#investment-property-type');
    if (e.target.value === 'investment') {
      investmentPropertyTypeInput.classList.remove('d-none');
    } else {
      investmentPropertyTypeInput.classList.add('d-none');
    }
  }
  handleSubmit($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }
    this.inquire();
  }
  inquire() {
    // Hide any error messages
    this.clearMessages();

    // Remove error class
    this.$el.find('.has-error').removeClass('has-error');
    const formData = {
      first_name: this.el.querySelector('[name="first_name"]').value,
      last_name: this.el.querySelector('[name="last_name"]').value,
      email: this.el.querySelector('[name="email"]').value,
      telephone: this.el.querySelector('[name="telephone"]').value,
      message: this.el.querySelector('[name="message"]').value,
      custom: {},
      meta: {}
    };
    const alertOk = this.el.querySelector('[name="alert_ok"]');
    if (alertOk) {
      formData.alert_ok = alertOk.checked ? 1 : 0;
    }

    // Optionally add source field
    const source = this.el.querySelector('[name="source"]');
    if (source) {
      // Check if 'other' source is selected
      if (source.value === 'other') {
        formData.custom.source = this.el.querySelector('[name="other_source"]').value;
      } else {
        formData.custom.source = source.value;
      }
    }

    // Optionally add property name field
    const property_name = this.el.querySelector('[name="property_name"]');
    if (property_name) {
      formData.custom.property_name = property_name.value;
    }

    // Optionally add property location field
    const property_location = this.el.querySelector('[name="property_location"]');
    if (property_location) {
      formData.custom.property_location = property_location.value;
    }

    // Optionally add date_from and date_to fields
    const date_from = this.el.querySelector('[name="date_from"]');
    const date_to = this.el.querySelector('[name="date_to"]');
    if (date_from) {
      formData.custom.date_from = date_from.value;
    }
    if (date_to) {
      formData.custom.date_to = date_to.value;
    }
    const contactInquiryType = this.el.querySelector('#inquiry-type-select');

    // Add data initialized from view
    formData.type = contactInquiryType ? contactInquiryType.value : this.inquiry_type;
    formData.building_id = this.building_id;
    formData.unit_id = this.unit_id;
    formData.meta.lang = (HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).language;
    formData.meta.page_url = this.page_url;
    formData.meta.page_title = this.page_title;
    formData.meta.api_client_id = this.api_client_id;
    if (this.is_contact) {
      if (formData.type === 'investment') {
        const investmentType = this.el.querySelector('input[name="investment_property_type"]:checked');
        const investmentTypeError = this.el.querySelector('#investment-property-type__error');
        if (!investmentType) {
          investmentTypeError.classList.remove('d-none');
          return;
        } else {
          formData.custom.property_type = investmentType.value;
        }
      }
    }
    if (this.notification_email) {
      formData.meta.notification_email = this.notification_email;
    }

    // If Google Analytics is available
    if (window.ga && window.ga.getAll) {
      // Loop through trackers
      for (const tracker of window.ga.getAll()) {
        // If tracker has clientID; set in form data and break loop
        if (tracker.get('clientId')) {
          formData.meta.ga_client_id = tracker.get('clientId');
          break;
        }
      }
    }

    // If current URL has query string
    if (window.location.search) {
      // Parse URL query string
      const queryString = new URLSearchParams(window.location.search);

      // Add UTM source, medium, and campaign (if available)
      if (queryString.get('utm_source')) {
        formData.meta.utm_source = queryString.get('utm_source');
      }
      if (queryString.get('utm_medium')) {
        formData.meta.utm_medium = queryString.get('utm_medium');
      }
      if (queryString.get('utm_campaign')) {
        formData.meta.utm_campaign = queryString.get('utm_campaign');
      }
    }

    /**
     * Send inquiry
     */

    const submitBtn = this.el.querySelector('#submit');
    nprogress__WEBPACK_IMPORTED_MODULE_4___default().start();
    submitBtn.disabled = true;
    this.spinner.spin(submitBtn);
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(this.google_site_key, {
        action: 'inquiry_submit'
      }).then(token => {
        formData.recaptcha_token = token;

        // Proceed with fetch as usual
        fetch((HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).api_url + '/inquiries', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }).then(response => {
          if (response.ok) {
            return response.json().then(data => {
              nprogress__WEBPACK_IMPORTED_MODULE_4___default().inc();

              // If top of inquiry form is not visible; scroll to top of inquiry form
              const offsetInquiryForm = this.$el.offset().top;
              if (offsetInquiryForm < jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scrollTop() + 70) {
                jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scrollTop(offsetInquiryForm - 70);
              }

              // Save form field data for future use
              _account__WEBPACK_IMPORTED_MODULE_6__["default"].save(underscore__WEBPACK_IMPORTED_MODULE_5___default().pick(formData, ['first_name', 'last_name', 'email', 'telephone', 'date_from', 'date_to']));
              _account__WEBPACK_IMPORTED_MODULE_6__["default"].addPropertyToSentList(this.building_id, this.unit_id);

              // Send inquiry event to Google Analytics
              window.dataLayer && window.dataLayer.push({
                event: 'inquiry',
                event_category: 'Inquiries',
                event_label: this.inquiry_type + ' inquiry',
                'phoenix.inquiry_type': this.inquiry_type,
                'phoenix.building_id': formData.building_id || undefined,
                'phoenix.unit_id': formData.unit_id || undefined
              });

              // Send conversion event to Google AdWords
              window.dataLayer && window.dataLayer.push({
                event: 'conversion',
                send_to: 'AW-1045793590/ymC0CMzy5QkQtpbW8gM'
              });

              // Send inquiry event to Meta
              window.fbq && window.fbq('trackCustom', 'Inquiry', {
                source_page: window.location.href,
                'phoenix.inquiry_type': this.inquiry_type,
                'phoenix.building_id': formData.building_id || undefined,
                'phoenix.unit_id': formData.unit_id || undefined
              });

              // Remove form
              this.$el.find('form').empty();

              // Show success message
              const showBack = sessionStorage.getItem('lastSearchId') > 0;
              this.showMessageSuccess(showBack);
              nprogress__WEBPACK_IMPORTED_MODULE_4___default().done();
              return data;
            });
          } else {
            return response.json().then(data => {
              // Create and throw error
              const e = new Error(data.exception[0].message);
              e.name = data.exception[0].type;
              throw e;
            });
          }
        }).catch(e => {
          console.error(e);

          // Show error message
          this.showMessageErrorSend();
        }).finally(() => {
          nprogress__WEBPACK_IMPORTED_MODULE_4___default().done();
          submitBtn.disabled = false;
          this.spinner.stop();
        });
      });
    });
  }
  handleClickBack() {
    window.history.back();
  }
  handleOtherSourceSelect() {
    const sourceValue = this.el.querySelector('#source-select').value;
    const otherSourceInput = this.el.querySelector('#other-source');
    const otherTextInput = this.el.querySelector('[name="other_source"]');
    if (sourceValue === 'other') {
      otherSourceInput.classList.remove('d-none');
      otherTextInput.required = true;
    } else {
      otherSourceInput.classList.add('d-none');
      otherTextInput.required = false;
    }
  }
  populateForm(data) {
    this.el.querySelector('[name="first_name"]').value = data.first_name || '';
    this.el.querySelector('[name="last_name"]').value = data.last_name || '';
    this.el.querySelector('[name="email"]').value = data.email || '';
    this.el.querySelector('[name="telephone"]').value = data.telephone || '';
    const dateFrom = this.el.querySelector('[name="date_from"]');
    const dateTo = this.el.querySelector('[name="date_to"]');
    if (dateFrom) {
      dateFrom.value = data.date_from || '';
    }
    if (dateTo) {
      dateTo.value = data.date_to || '';
    }
  }
  showMessageErrorSend() {
    this.msgBox.innerHTML = this.el.querySelector('#tmpl-msg-error-send').innerHTML;
  }
  showMessageErrorField() {
    this.msgBox.innerHTML = this.el.querySelector('#tmpl-msg-error-field').innerHTML;
  }
  showMessageAlreadyReceived() {
    this.msgBox.innerHTML = this.el.querySelector('#tmpl-msg-info-already-received').innerHTML;
  }
  showMessageSuccess(showBack) {
    this.msgBox.innerHTML = this.el.querySelector('#tmpl-msg-success-send').innerHTML;
    const backButton = this.msgBox.querySelector('[data-action="back"]');

    // Show or hide back button
    if (backButton) {
      if (showBack) {
        backButton.style.display = '';
      } else {
        backButton.style.display = 'none';
      }
    }
  }
  clearMessages() {
    this.msgBox.innerHTML = '';
  }
}

/***/ }),

/***/ "./src/js/listing-gallery.js":
/*!***********************************!*\
  !*** ./src/js/listing-gallery.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ListingGalleryView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _templates_partial_property_gallery_listing_html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../templates/partial.property_gallery_listing.html */ "./src/templates/partial.property_gallery_listing.html");
/* harmony import */ var _templates_partial_property_gallery_listing_html__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_property_gallery_listing_html__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../templates/partial.search.expired.html */ "./src/templates/partial.search.expired.html");
/* harmony import */ var _templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../templates/partial.search.no_results.html */ "./src/templates/partial.search.no_results.html");
/* harmony import */ var _templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helper */ "./src/js/helper.js");








class ListingGalleryView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize(options) {
    // Set "API client ID"
    this.api_client_id = options.api_client_id || null;
    if (this.api_client_id === null) {
      throw Error('Parameter api_client_id not set');
    }

    // Set "section"
    this.section = options.section || 'buy';
    if (!this.section) {
      throw 'Parameter "section" cannot be empty';
    }
    this.gallery_type = options.gallery_type;
    this.api_offset = 0;
    this.limit = options.limit;

    // limited  - click to load
    // infinite - load on scroll
    this.loading_type = options.type;
    this.events = {
      'click #viewMore': this.handleMoreClick
    };
  }
  async initialize() {
    // Initialize spinner
    this.Spinner = this.$el.find('.spinner');
    this.Spinner.hide();
    this.propertyList = this.$el.find('#propertyList');
    this.propertyList.empty();
    this.loadMoreBtn = this.el.querySelector('#viewMore');
    this.viewAllBtn = this.el.querySelector('#viewAll');
    this.loadingScroll = this.el.querySelector('#loadingScroll');
    await this.getPropertyListings();
    if (this.loadMoreBtn) {
      this.loadMoreBtn.classList.remove('d-none');
    }

    // Allow for infinite scrolling
    if (this.loading_type === 'infinite') {
      const intersectionObserver = new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio <= 0) return;

        // load more content;
        this.getPropertyListings();
      }, {
        threshold: 0
      });
      intersectionObserver.observe(this.loadingScroll);
    }
  }
  async handleMoreClick() {
    this.loadMoreBtn.classList.add('d-none');
    await this.getPropertyListings();
    this.loadMoreBtn.classList.remove('d-none');
  }
  async fetchProperties(options) {
    const response = await fetch((HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).api_url + '/search?' + jquery__WEBPACK_IMPORTED_MODULE_2___default().param(options), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      data: options
    });
    if (!response.ok) {
      if (response.status === 410) {
        // Search has expired
        this.propertyList.html(_templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_5___default()({
          t: _helper__WEBPACK_IMPORTED_MODULE_7__.t
        }));
        return;
      }
      const responseData = await response.json();

      // Create and throw error
      const e = new Error(responseData.exception[0].message);
      e.name = responseData.exception[0].type;
      throw e;
    }
    const responseData = await response.json();
    return responseData;
  }
  setPropertiesList(exclusiveListings, luxuryListings) {
    // Remove duplicates from luxury listings
    const filteredLuxuryListings = luxuryListings.filter(property => !exclusiveListings.some(exclusive => exclusive.id === property.id));

    // Combine exclusive listings with filtered luxury listings
    const combinedListings = [...exclusiveListings, ...filteredLuxuryListings.slice(0, exclusiveListings.length)];

    // Sort by price
    return combinedListings.sort((a, b) => b.price - a.price);
  }
  async getPropertyListings() {
    const options = {
      api_client_id: this.api_client_id,
      property_type: 'sales',
      structure_type: ['unit', 'house'],
      published: 1,
      sort_key: 'updated_at',
      sort_order: 'DESC',
      limit: this.limit,
      offset: this.api_offset,
      include: ['location'],
      language: (HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).language,
      result_format: 'flat'
    };
    options['!availability_status'] = 'unavailable';
    if (this.gallery_type === 'featured') {
      options.brokerage_type = ['専属', '専任', '一般'];
      options.limit = 6;
      options.sort_key = 'price';
    } else if (this.gallery_type === 'rent') {
      options.property_type = 'rent';
    } else if (this.gallery_type === 'invest') {
      options.campaign = 'investment_properties';
      options.structure_type.push('land', 'building');
    }
    if (this.section !== 'rent') {
      options.prefecture = '東京都';
    }
    this.api_offset += this.limit;

    // Show spinner
    this.Spinner.show();

    // Load search results
    const responseData = await this.fetchProperties(options);
    let featuredResponseData;
    if (this.gallery_type === 'featured') {
      delete options.brokerage_type;
      options.limit = 12;
      featuredResponseData = await this.fetchProperties(options);
    }

    // If no results found
    if (this.api_offset === 0 && typeof responseData.results !== 'undefined' && responseData.results.length === 0) {
      this.propertyList.html(_templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_6___default()({
        t: _helper__WEBPACK_IMPORTED_MODULE_7__.t
      }));
    }
    // Else results
    else {
      /**
       * Append items
       */

      let properties;
      if (typeof featuredResponseData !== 'undefined' && featuredResponseData.results.length > 0) {
        properties = this.setPropertiesList(responseData.results, featuredResponseData.results);
      } else {
        properties = responseData.results;
      }
      let items = '';
      underscore__WEBPACK_IMPORTED_MODULE_3___default().each(properties, property => {
        // Determine property title
        let title;
        if ((0,_helper__WEBPACK_IMPORTED_MODULE_7__.isMembersOnly)(property)) {
          title = (0,_helper__WEBPACK_IMPORTED_MODULE_7__.propertyAlias)(property);
        } else if (property.x_tagline) {
          title = property.x_tagline;
        } else {
          title = property.x_structure_name;
        }

        // Render listing template and pass variables
        items += _templates_partial_property_gallery_listing_html__WEBPACK_IMPORTED_MODULE_4___default()({
          featured: property.featured,
          coverphoto: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.getFlatPhotoUrl)(property),
          title,
          key: this.key,
          section: this.section,
          structure_type: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.structureTypeText)(property),
          address: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.addressText)(property),
          isMembersOnly: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.isMembersOnly)(property),
          buildingUrl: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.flatUnitDetailsUrl)(property, this.section),
          structureDetailsUrl: _helper__WEBPACK_IMPORTED_MODULE_7__.structureDetailsUrl,
          trainInfo: _helper__WEBPACK_IMPORTED_MODULE_7__.trainInfo,
          price: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.getCost)(property),
          size: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.getSize)(property),
          bathrooms: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.bathroomIcon)(property),
          bedrooms: (0,_helper__WEBPACK_IMPORTED_MODULE_7__.bedroomIcon)(property),
          moneyFormat: _helper__WEBPACK_IMPORTED_MODULE_7__.moneyFormat,
          structure: property,
          gallery_type: this.gallery_type,
          type: this.loading_type,
          t: _helper__WEBPACK_IMPORTED_MODULE_7__.t
        });
      });

      // Hide spinner
      this.Spinner.hide();

      // Append items to property list
      this.propertyList.append(items);
      if (this.loading_type === 'infinite') {
        this.el.querySelector('#loadingScroll').classList.remove('d-none');
      }
      if (this.loading_type === 'limited' && this.api_offset === 12 && this.gallery_type !== 'featured' || responseData.results.length < 6) {
        this.loadMoreBtn.remove();
        this.viewAllBtn.classList.remove('d-none');
      }
    }
    return responseData;
  }
}

/***/ }),

/***/ "./src/js/newsletterform.js":
/*!**********************************!*\
  !*** ./src/js/newsletterform.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewsLetterFormView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var nprogress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! nprogress */ "nprogress");
/* harmony import */ var nprogress__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _account__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./account */ "./src/js/account.js");
/* harmony import */ var _spinner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./spinner */ "./src/js/spinner.js");






class NewsLetterFormView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize() {
    this.spinner = new _spinner__WEBPACK_IMPORTED_MODULE_5__["default"]();
    this.events = {
      'focus .has-error': this.handleFocusError,
      submit: this.handleSubmit
    };
  }
  initialize(options) {
    // Set list name from options
    this.list = options.list;
    this.google_site_key = options.google_site_key || null;

    // Set platform from options
    this.platform = options.platform;

    // Define message box
    this.msgBox = this.el.querySelector('[data-part="msg"]');
    if (this.msgBox === null) {
      console.warn('Container for messages not found');
    }

    // Populate newsletter form with Account data
    this.populateForm(_account__WEBPACK_IMPORTED_MODULE_4__["default"].get());
  }
  handleFocusError($e) {
    this.clearFieldError($e.currentTarget);
  }
  clearFieldError(field) {
    // Remove error class for this field
    field.classList.remove('has-error');
  }
  handleSubmit($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }
    const newsletterInterestInputs = this.el.querySelectorAll('input[name="newsletter-interest"]');
    let interestsChecked = 0;
    newsletterInterestInputs.forEach(el => {
      el.checked ? interestsChecked++ : null;
    });
    if (interestsChecked > 0) {
      return this.subscribe();
    } else {
      this.el.querySelector('#interestError').classList.remove('d-none');
    }
  }
  subscribe() {
    // Remove any error messages
    this.$el.find('[id^="msg-error-"]').remove();

    // Remove error class
    this.$el.find('.has-error').removeClass('has-error');
    const emailField = this.el.querySelector('[name="email"]');
    const nameField = this.el.querySelector('[name="name"]');
    const newsletterInterestFields = this.el.querySelectorAll('input[name="newsletter-interest"]');
    const interests = [];
    newsletterInterestFields.forEach(input => {
      if (input.checked) {
        interests.push(input.value);
      }
    });
    const formData = {
      email: emailField.value,
      interests
    };
    if (nameField) {
      formData.name = nameField.value;
    }

    // Add data initialized from view
    formData.list = this.list;
    formData.lang = (HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).language;
    formData.platform = this.platform;

    /**
     * Subscribe
     */

    const submitBtn = this.el.querySelector('.newsletterSubmit');
    nprogress__WEBPACK_IMPORTED_MODULE_2___default().start();
    submitBtn.disabled = true;
    this.spinner.spin(submitBtn);
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(this.google_site_key, {
        action: 'newsletter_subscribe'
      }).then(token => {
        formData.recaptcha_token = token;
        fetch((HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).api_url + '/newsletter', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }).then(response => {
          if (response.ok) {
            return response.json().then(data => {
              nprogress__WEBPACK_IMPORTED_MODULE_2___default().inc();

              // Remove form
              this.$el.find('form').empty();

              // Show success message
              this.showMessageSuccess();

              // Save form field data for future use
              _account__WEBPACK_IMPORTED_MODULE_4__["default"].save(underscore__WEBPACK_IMPORTED_MODULE_3___default().pick(formData, ['email']));

              // Record signup
              window.dataLayer && window.dataLayer.push({
                event: 'signup',
                event_category: 'Newsletter',
                event_label: this.list + ' signup',
                'edm.list': this.list
              });
              window.fbq && window.fbq('trackCustom', 'NewsletterSignup', {
                source_page: window.location.href
              });
              nprogress__WEBPACK_IMPORTED_MODULE_2___default().done();
              return data;
            });
          } else {
            return response.json().then(data => {
              // Create and throw error
              const e = new Error(data.exception[0].message);
              e.name = data.exception[0].type;
              throw e;
            });
          }
        }).catch(e => {
          console.error(e);

          // Show error message
          this.showMessageErrorSend();
        }).finally(() => {
          nprogress__WEBPACK_IMPORTED_MODULE_2___default().done();
          submitBtn.disabled = false;
          this.spinner.stop();
        });
      });
    });
  }
  populateForm(data) {
    this.el.querySelector('[name="email"]').value = data.email || '';
  }
  showMessageErrorSend() {
    this.msgBox.innerHTML = this.el.querySelector('#tmpl-msg-error-send').innerHTML;
  }
  showMessageSuccess() {
    this.msgBox.innerHTML = this.el.querySelector('#tmpl-msg-success-send').innerHTML;
  }
  clearMessages() {
    this.msgBox.innerHTML = '';
  }
}

/***/ }),

/***/ "./src/js/property/alertmodal.js":
/*!***************************************!*\
  !*** ./src/js/property/alertmodal.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PropertyAlertModalView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var nprogress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! nprogress */ "nprogress");
/* harmony import */ var nprogress__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _templates_modal_property_alert_html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../templates/modal.property_alert.html */ "./src/templates/modal.property_alert.html");
/* harmony import */ var _templates_modal_property_alert_html__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_templates_modal_property_alert_html__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _account__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../account */ "./src/js/account.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helper */ "./src/js/helper.js");






class PropertyAlertModalView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize() {
    this.lastSearchId = undefined;
    this.id = 'modal-property-alert';
    this.className = 'modal fade';
    this.events = {
      'focus .has-error': this.handleFocusError,
      'submit form': this.handleSubmit
    };
  }
  initialize() {
    this.render();

    // Populate alert form with Account data
    this.populateForm(_account__WEBPACK_IMPORTED_MODULE_4__["default"].get());
    this.alertSaveButton = this.el.querySelector('#alert-save');
  }
  render() {
    // Render modal
    this.$el.html(_templates_modal_property_alert_html__WEBPACK_IMPORTED_MODULE_3___default()({
      t: _helper__WEBPACK_IMPORTED_MODULE_5__.t
    }));

    // Setup modal
    this.$el.modal({
      backdrop: true,
      keyboard: true,
      show: false
    });
    return this;
  }
  handleFocusError($e) {
    this.clearFieldError($e.currentTarget);
  }
  clearFieldError(field) {
    // Remove error class for this field
    field.classList.remove('has-error');
  }
  showAlertForm() {
    this.el.querySelector('#hj-create_alert_body').classList.remove('d-none');
    this.el.querySelector('#hj-create_alert_error').classList.add('d-none');
    this.alertSaveButton.disabled = false;
    this.alertSaveButton.classList.remove('d-none');
  }
  showAlertError() {
    this.el.querySelector('#hj-create_alert_body').classList.add('d-none');
    this.el.querySelector('#hj-create_alert_error').classList.remove('d-none');
    this.alertSaveButton.disabled = true;
    this.alertSaveButton.classList.add('d-none');
  }
  handleSubmit($e) {
    $e.preventDefault();
    return this.createAlert();
  }
  createAlert() {
    // Hide any messages
    this.$el.find('[data-msg]').hide();
    const fieldEmailAddress = this.el.querySelector('[name="email_address"]');

    // Validate form data
    if (fieldEmailAddress.value === '') {
      fieldEmailAddress.parent().addClass('has-error');
      this.$el.find('[data-msg="error-field"]').show();
      return false;
    }
    const query = {
      search_id: this.lastSearchId,
      email_address: fieldEmailAddress.value,
      lang: (HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).language
    };
    nprogress__WEBPACK_IMPORTED_MODULE_2___default().start();
    fetch((HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).api_url + '/property_alert', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    }).then(response => {
      if (response.ok) {
        return response.json().then(data => {
          // Hide form
          this.$el.find('.form-group, .btn-primary').hide();

          // Show success message
          this.$el.find('[data-msg="success"]').show();

          // Hide button
          this.$el.find('#btn-create_alert').hide();

          // Save form field data for future use
          _account__WEBPACK_IMPORTED_MODULE_4__["default"].save({
            email: query.email_address
          });
          nprogress__WEBPACK_IMPORTED_MODULE_2___default().done();
          return data;
        });
      } else {
        return response.json().then(data => {
          // Create and throw error
          const e = new Error(data.exception[0].message);
          e.name = data.exception[0].type;
          throw e;
        });
      }
    }).catch(e => {
      console.error(e);

      // Show error message
      this.$el.find('[data-msg="error-create"]').show();
      nprogress__WEBPACK_IMPORTED_MODULE_2___default().done();
    });
  }
  populateForm(data) {
    this.el.querySelector('[name="email_address"]').value = data.email || '';
  }
  show(lastSearchId) {
    // Set last search ID
    this.lastSearchId = lastSearchId;

    // Show modal
    this.$el.modal('show');
  }
}

/***/ }),

/***/ "./src/js/property/infinite-search.js":
/*!********************************************!*\
  !*** ./src/js/property/infinite-search.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InfinitePropertySearchView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _templates_partial_property_gallery_listing_html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../templates/partial.property_gallery_listing.html */ "./src/templates/partial.property_gallery_listing.html");
/* harmony import */ var _templates_partial_property_gallery_listing_html__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_property_gallery_listing_html__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../templates/partial.search.expired.html */ "./src/templates/partial.search.expired.html");
/* harmony import */ var _templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../templates/partial.search.no_results.html */ "./src/templates/partial.search.no_results.html");
/* harmony import */ var _templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _form_helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../form-helper */ "./src/js/form-helper.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helper */ "./src/js/helper.js");
/* harmony import */ var _station_typeahead__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../station/typeahead */ "./src/js/station/typeahead.js");
/* harmony import */ var _alertmodal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./alertmodal */ "./src/js/property/alertmodal.js");











const criteriaMap = {
  'r[l]': 'rent[low]',
  'r[h]': 'rent[high]',
  'p[l]': 'price[low]',
  'p[h]': 'price[high]',
  'mr[l]': 'monthly_rate[low]',
  'mr[h]': 'monthly_rate[high]',
  df: 'date_from',
  dt: 'date_to',
  lm: 'landmark',
  st: 'structure_type',
  'sz[l]': 'size[low]',
  'sz[h]': 'size[high]',
  bed: 'bedroom_no',
  new: 'new_development',
  pet: 'pet_friendly',
  pk: 'parking_type',
  ff: 'fully_furnished',
  nkm: 'no_key_money',
  hr: 'high_rise',
  reno: 'renovated',
  v: 'vintage',
  lb: 'large_balcony',
  cnr: 'corner_room',
  name: 'structure_name',
  key: 'hash_id'
};

/**
 * Map fields to API parameters
 * @param {object} criteria
 * @returns {object}
 */
function mapFieldsToApiParams(criteria) {
  const mappedCriteria = {};

  // Loop through criteria
  underscore__WEBPACK_IMPORTED_MODULE_3___default().each(criteria, (value, key) => {
    // If key has entry in criteria map, use it
    if (criteriaMap[key]) {
      mappedCriteria[criteriaMap[key]] = value;
    }
    // Else use key as-is
    else {
      mappedCriteria[key] = value;
    }
  });
  return mappedCriteria;
}
function buildQuery(criteria, options) {
  // Create query by extending criteria, sort, and options
  const query = underscore__WEBPACK_IMPORTED_MODULE_3___default().extend({
    sort_key: 'updated_at',
    sort_order: 'desc',
    limit: 6,
    offset: 0
  }, mapFieldsToApiParams(criteria), options);
  if (query.bedroom_no) {
    // If not array, convert to array
    if (!underscore__WEBPACK_IMPORTED_MODULE_3___default().isArray(query.bedroom_no)) {
      query.bedroom_no = [query.bedroom_no];
    }

    // If "4" chosen, add "5" to "10"
    if (-1 !== query.bedroom_no.indexOf(4)) {
      query.bedroom_no = underscore__WEBPACK_IMPORTED_MODULE_3___default().union(query.bedroom_no, [5, 6, 7, 8, 9, 10]);
    }
  }

  // Extend defaults and return
  return query;
}
class InfinitePropertySearchView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize(options) {
    // Set "API client ID"
    this.api_client_id = options.api_client_id || null;
    if (this.api_client_id === null) {
      throw Error('Parameter api_client_id not set');
    }

    // Set "section"
    this.section = options.section || 'buy';
    if (!this.section) {
      throw 'Parameter "section" cannot be empty';
    }
    this.events = {
      'submit .search-criteria form': this.handleSubmit,
      'change .sort-menu form select': this.handleChangeSort,
      'click #criteria-toggle': this.handleCriteriaToggle,
      'click #criteria-clear': this.handleCriteriaClear
    };

    // Initialize station typeahead
    this.subviews = {
      typeaheadStation: new _station_typeahead__WEBPACK_IMPORTED_MODULE_9__["default"]({
        el: document.getElementById('cntr-station')
      })
    };

    // Hide footer (page has infinite scroll)
    // $('footer').hide();
  }
  initialize(options) {
    // Initialize spinner
    this.Spinner = this.$el.find('.spinner');
    this.Spinner.hide();

    // Get search criteria
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const previousCriteria = JSON.parse(urlParams.get('c')) || {};
    const previousSortKey = urlParams.get('sk');
    const previousSortOrder = urlParams.get('so');
    this.criteriaElOpen = false;

    // Prepopulate search filters with saved data
    if (underscore__WEBPACK_IMPORTED_MODULE_3___default().isEmpty(this.key)) {
      if (underscore__WEBPACK_IMPORTED_MODULE_3___default().size(previousCriteria) > 0) {
        // Put form data
        (0,_form_helper__WEBPACK_IMPORTED_MODULE_7__.putFormData)(this.$el.find('.search-criteria form'), previousCriteria, false);
        if (previousCriteria.lm instanceof Array) {
          // Loop through landmarks
          previousCriteria.lm.forEach(landmark => {
            // Restore each landmark
            this.subviews.typeaheadStation.select(undefined, landmark);
          });
        }
      }

      // Set sort key
      if (previousSortKey) {
        this.el.querySelector('.sort-menu form [name="sk"]').value = previousSortKey;
      }

      // Set sort order
      if (previousSortOrder) {
        this.el.querySelector('.sort-menu form [name="so"]').value = previousSortOrder;
      }
    }

    // Google Analytics Client ID
    const ga_client_id = document.cookie.match(/_ga=(.+?);/);
    if (ga_client_id) {
      this.gaClientID = ga_client_id[1].split('.').slice(-2).join('.');
    }
    this.api_offset = 0;

    // Initialize property list
    this.propertyList = this.$el.find('#propertyList');
    this.clearPropertyList();
    this.loadingScroll = options.loadingScroll;
    const intersectionObserver = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) return;

      // load more content;
      this.search();
    }, {
      threshold: 0
    });
    intersectionObserver.observe(this.loadingScroll);

    // Search properties
    this.handleSubmit();
  }
  clearPropertyList() {
    this.propertyList.empty();
  }
  handleCriteriaToggle() {
    const criteriaDiv = document.getElementById('hidden-criteria');
    const criteriaButton = document.getElementById('criteria-toggle');
    criteriaDiv.classList.toggle('d-none');
    criteriaButton.innerText = criteriaDiv.classList.contains('d-none') ? (0,_helper__WEBPACK_IMPORTED_MODULE_8__.t)('Filter') : (0,_helper__WEBPACK_IMPORTED_MODULE_8__.t)('Hide Filter');
    this.criteriaElOpen = !this.criteriaElOpen;
  }
  handleCriteriaClear() {
    const criteriaForm = this.$el.find('.search-criteria form')[0];
    criteriaForm.reset();
    this.subviews.typeaheadStation.clearList();
  }
  handleChangeSort() {
    this.api_offset = 0;
    this.clearPropertyList();

    // Scroll to top
    jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scrollTop(0);

    // Search properties
    this.search();
  }
  async handleSubmit($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }
    this.clearPropertyList();

    // Scroll to top
    jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scrollTop(0);

    // Close criteria div if open
    const criteriaButton = document.getElementById('criteria-toggle');
    if (this.criteriaElOpen) {
      criteriaButton.click();
    }

    // Get form data
    this.currentCriteria = (0,_form_helper__WEBPACK_IMPORTED_MODULE_7__.getFormData)(this.$el.find('.search-criteria form'));

    // Get landmarks
    const landmarks = this.subviews.typeaheadStation.collection.toJSON();
    if (landmarks.length > 0) {
      // Attach landmarks
      this.currentCriteria.lm = landmarks;
    }
    this.api_offset = 0;

    // Search properties
    await this.search();

    // Record search
    window.dataLayer && window.dataLayer.push({
      event: 'search',
      event_category: 'Searches',
      event_label: this.section + ' search'
    });
  }
  async search() {
    this.loadingScroll.classList.add('d-none');
    const currentSortKey = this.el.querySelector('.sort-menu form [name="sk"]').value;
    const currentSortOrder = this.el.querySelector('.sort-menu form [name="so"]').value;

    // Store search criteria
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '#c=' + JSON.stringify(this.currentCriteria) + '&sk=' + currentSortKey + '&so=' + currentSortOrder;
    window.history.pushState({
      path: newUrl
    }, '', newUrl);

    // Recreate property alert modal
    this.subviews.modalPropertyAlert = new _alertmodal__WEBPACK_IMPORTED_MODULE_10__["default"]();
    const options = {};
    options.resort = 0;
    switch (this.section) {
      case 'rent':
        options.property_type = 'rent';
        break;
      case 'buy':
        options.property_type = 'sales';
        break;
      case 'short-term':
        options.property_type = 'monthly';
        break;
      case 'resort':
        options.property_type = 'sales';
        options.campaign = ['resorts_hakuba', 'resorts_other'];
        options.resort = 1;
        break;
      default:
        throw new Error('Unknown section');
    }
    options.api_client_id = this.api_client_id;
    options.hash_id = this.key;
    options.sort_key = currentSortKey;
    options.sort_order = currentSortOrder;
    options.ga_client_id = this.gaClientID;
    options.result_format = 'flat';
    options.offset = this.api_offset;

    // Convert into query
    this.query = buildQuery(this.currentCriteria, options);

    // Set language parameter
    this.query.language = (HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).language;
    this.api_offset += 6;

    // Show spinner
    this.Spinner.show();

    // Load search results
    const response = await fetch((HJ__WEBPACK_IMPORTED_MODULE_1___default().Config).api_url + '/search?' + jquery__WEBPACK_IMPORTED_MODULE_2___default().param(this.query), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });
    if (!response.ok) {
      if (response.status === 410) {
        // Search has expired
        this.propertyList.html(_templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_5___default()({
          t: _helper__WEBPACK_IMPORTED_MODULE_8__.t
        }));
        return;
      }
      const responseData = await response.json();

      // Create and throw error
      const e = new Error(responseData.exception[0].message);
      e.name = responseData.exception[0].type;
      throw e;
    }
    const responseData = await response.json();
    this.lastSearchId = responseData.search_id;
    sessionStorage.setItem('lastSearchId', responseData.search_id);

    // If no results found
    if (this.query.offset === 0 && typeof responseData.results !== 'undefined' && responseData.results.length === 0) {
      this.propertyList.html(_templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_6___default()({
        t: _helper__WEBPACK_IMPORTED_MODULE_8__.t
      }));
    } else if (this.query.offset > 0 && responseData.results.length === 0) {
      this.loadingScroll.classList.add('d-none');

      // Hide spinner
      this.Spinner.hide();
    }
    // Else results
    else {
      /**
       * Append items
       */
      const properties = responseData.results;
      let items = '';
      underscore__WEBPACK_IMPORTED_MODULE_3___default().each(properties, property => {
        // Determine property title
        let title;
        if ((0,_helper__WEBPACK_IMPORTED_MODULE_8__.isMembersOnly)(property)) {
          title = (0,_helper__WEBPACK_IMPORTED_MODULE_8__.propertyAlias)(property);
        } else if (property.x_tagline) {
          title = property.x_tagline;
        } else {
          title = property.x_structure_name;
        }

        // Render listing template and pass variables
        items += _templates_partial_property_gallery_listing_html__WEBPACK_IMPORTED_MODULE_4___default()({
          featured: property.featured,
          coverphoto: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.getFlatPhotoUrl)(property),
          title,
          key: this.key,
          section: this.section,
          structure_type: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.structureTypeText)(property),
          address: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.addressText)(property),
          isMembersOnly: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.isMembersOnly)(property),
          buildingUrl: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.flatUnitDetailsUrl)(property, this.section),
          structureDetailsUrl: _helper__WEBPACK_IMPORTED_MODULE_8__.structureDetailsUrl,
          trainInfo: _helper__WEBPACK_IMPORTED_MODULE_8__.trainInfo,
          price: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.getCost)(property),
          size: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.getSize)(property),
          bathrooms: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.bathroomIcon)(property),
          bedrooms: (0,_helper__WEBPACK_IMPORTED_MODULE_8__.bedroomIcon)(property),
          moneyFormat: _helper__WEBPACK_IMPORTED_MODULE_8__.moneyFormat,
          structure: property,
          gallery_type: this.gallery_type,
          type: this.loading_type,
          t: _helper__WEBPACK_IMPORTED_MODULE_8__.t
        });
      });

      // Hide spinner
      this.Spinner.hide();

      // Append items to property list
      this.propertyList.append(items);
      this.loadingScroll.classList.remove('d-none');
    }
    return responseData;
  }
}

/***/ }),

/***/ "./src/js/property/landing-search.js":
/*!*******************************************!*\
  !*** ./src/js/property/landing-search.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LandingSearchView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _form_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../form-helper */ "./src/js/form-helper.js");
/* harmony import */ var _station_station__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../station/station */ "./src/js/station/station.js");



// import Bloodhound from "bloodhound";

class LandingSearchView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize() {
    this.station = {};
    // this.dataset = null;

    this.events = {
      submit: this.search,
      'change select[name=station]': this.handleStationSelect
      // "typeahead:selected": this.handleStationSelect,
    };
  }
  initialize(options) {
    // Set "section" option
    this.section = options.section;
    if (!this.section) {
      throw 'Option "section" cannot be empty';
    }

    // Set "search_url" option
    this.search_url = options.search_url;
    if (!(this.search_url instanceof Object)) {
      throw 'Option "search_url" must be an Object';
    }

    // Create dataset
    // this.dataset = new Bloodhound({
    //   datumTokenizer: function (datum) {
    //     return datum.name.split(/[\s,\-()]+/);
    //   },

    //   queryTokenizer: function (query) {
    //     return query.split(/[\s,\-()]+/);
    //   },

    //   prefetch: {
    //     url:
    //       HJ.Config.api_url +
    //       "/datasource/station_groups?language=" +
    //       HJ.Config.language,
    //     cache: false,
    //   },

    //   identify: function (obj) {
    //     return obj.id;
    //   },
    // });

    // Initialize typeahead
    // this.$el.find(".typeahead").typeahead(
    //   {
    //     hint: true,
    //     highlight: false,
    //     minLength: 1,
    //     autoselect: true,
    //   },
    //   {
    //     name: "stations",
    //     display: (datum) => {
    //       if (datum.prefecture) {
    //         return datum.name + " (" + datum.prefecture + ")";
    //       } else {
    //         return datum.name;
    //       }
    //     },
    //     source: this.dataset,
    //     templates: {
    //       empty:
    //         '<div class="empty-message">Unable to find any train station that matches your search</div>',
    //     },
    //   }
    // );
  }
  search($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }

    // Get criteria
    const criteria = (0,_form_helper__WEBPACK_IMPORTED_MODULE_1__.getFormData)(this.$el);
    if (Object.keys(this.station).length === 0) {
      this.setStation();
    }

    // Attach landmarks
    criteria.lm = this.station;
    const sectionString = this.section === 'landing' ? '/buy/search/' : this.search_url['this.section'];

    // Redirect to search page
    window.location.href = window.location.protocol + '//' + window.location.host + sectionString + '#c=' + JSON.stringify(criteria);
  }
  handleStationSelect() {
    this.setStation();
  }
  setStation() {
    const stationEl = this.$el.find("[name='station']");
    const stationId = stationEl.val();
    const stationName = stationEl[0].selectedOptions[0].dataset.name;
    this.station = stationId === 'all' ? {} : [new _station_station__WEBPACK_IMPORTED_MODULE_2__["default"](stationId, stationName, 'station')];
  }

  // handleStationSelect($e, datum) {
  //   // Create station instance and assign to class station
  //   this.station = [new Station(datum.id, datum.name, datum.type)];

  //   this.$el.find(".typeahead").val("").typeahead("val", datum.name);
  // }
}

/***/ }),

/***/ "./src/js/property/minisearch.js":
/*!***************************************!*\
  !*** ./src/js/property/minisearch.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PropertyMiniSearchView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _form_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../form-helper */ "./src/js/form-helper.js");
/* harmony import */ var _station_typeahead__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../station/typeahead */ "./src/js/station/typeahead.js");





class PropertyMiniSearchView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize() {
    this.events = {
      submit: this.search,
      'change #field-property_type': this.changePropertyType,
      'click #btn-show-calendar': this.showCalendar,
      'click #btn-clear-calendar': this.clearCalendar
    };
  }
  initialize(options) {
    // Set "section" option
    this.section = options.section;
    if (!this.section) {
      throw 'Option "section" cannot be empty';
    }

    // Set "search_url" option
    this.search_url = options.search_url;
    if (!(this.search_url instanceof Object)) {
      throw 'Option "search_url" must be an Object';
    }

    // Initialize station typeahead
    this.subviews = {
      typeaheadStation: new _station_typeahead__WEBPACK_IMPORTED_MODULE_4__["default"]({
        el: document.getElementById('cntr-station')
      })
    };

    // Initialize date range
    const dateRangePicker = this.$el.find('input[data-action="date-range"]');
    const aDay = 86400000;
    dateRangePicker.mobiscroll().range({
      theme: 'windows',
      showSelector: false,
      buttons: [{
        text: 'Set',
        handler: 'set',
        cssClass: 'mbsc-fr-btn mbsc-green-bg'
      }, 'clear'],
      cssClass: 'md-range',
      dateFormat: 'M d, yy',
      defaultValue: [],
      display: 'center',
      min: new Date(),
      // minRange: 30 * aDay,
      months: 'auto',
      max: moment__WEBPACK_IMPORTED_MODULE_2___default()().add(6, 'months').endOf('month').toDate(),
      // Max 6 months ahead
      onDayChange: function (e, inst) {
        // Get currently chosen start/end dates
        const [startDate] = inst.getVal(true);
        if (e.active === 'start') {
          // Set start date, and end date to 30 days (29 nights) later
          inst.setVal([e.date, moment__WEBPACK_IMPORTED_MODULE_2___default()(e.date).add(29, 'days').toDate()]);
          inst.setActiveDate('end');
          return false;
        } else if (e.active === 'end') {
          // If end date chosen is before current start date; reset
          if (startDate instanceof Date && e.date < startDate) {
            inst.setVal([e.date, undefined]);
            inst.setActiveDate('end');
            return false;
          }

          // Make sure at least 30 days (29 nights) are selected
          if ((e.date - startDate) / aDay < 29) {
            alert('Minimum 30 days required');
            return false;
          }
        }
      },
      onSet: function (e, inst) {
        const [startDate, endDate] = inst.getVal();

        // Set date on date_from hidden field
        jquery__WEBPACK_IMPORTED_MODULE_1___default()('[name="df"]').val(moment__WEBPACK_IMPORTED_MODULE_2___default()(startDate).format('YYYY-MM-DD'));

        // Set date on date_to hidden field
        jquery__WEBPACK_IMPORTED_MODULE_1___default()('[name="dt"]').val(moment__WEBPACK_IMPORTED_MODULE_2___default()(endDate).format('YYYY-MM-DD'));
      },
      onClear: function () {
        // Clear date on hidden fields
        jquery__WEBPACK_IMPORTED_MODULE_1___default()('[name="df"], [name="dt"]').val('');
      }
    });

    // Show elements for current property type
    this.$el.find('[data-property-type="' + this.section + '"]').show();
  }
  changePropertyType($e) {
    // Hide elements for current property type
    this.$el.find('[data-property-type="' + this.section + '"]').hide();

    // Set new property type
    this.section = $e.target.value;

    // Show elements for new property type
    this.$el.find('[data-property-type="' + this.section + '"]').show();
  }
  showCalendar($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }

    // Show calendar
    this.$el.find('[data-action="date-range"]').mobiscroll('show');
  }
  clearCalendar($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }

    // Clear calendar
    this.$el.find('[data-action="date-range"]').mobiscroll('clear');
  }
  search($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }

    // Get criteria
    const criteria = (0,_form_helper__WEBPACK_IMPORTED_MODULE_3__.getFormData)(this.$el);

    // Attach landmarks
    criteria.lm = this.subviews.typeaheadStation.collection.toJSON();
    const getSectionString = section => {
      if (section === 'short-term') {
        return '/short-term/search';
      } else if (section === 'rent') {
        return '/rent/search';
      } else {
        return '/buy/search';
      }
    };
    const sectionString = this.section === 'landing' ? '/buy/search/' : getSectionString(this.section);

    // Redirect to search page
    window.location.href = window.location.protocol + '//' + window.location.host + sectionString + '#c=' + JSON.stringify(criteria);
  }
}

/***/ }),

/***/ "./src/js/property/page-view.js":
/*!**************************************!*\
  !*** ./src/js/property/page-view.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PropertyDetailsViewTracker)
/* harmony export */ });
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_0__);

class PropertyDetailsViewTracker {
  pageUrl;
  gaClientId;
  constructor(pageTitle, pageUrl) {
    this.pageTitle = pageTitle;
    this.pageUrl = pageUrl;
    const ga_client_id = document.cookie.match(/_ga=(.+?);/);
    if (ga_client_id) {
      this.gaClientId = ga_client_id[1].split('.').slice(-2).join('.');
    }
  }
  async sendPageViewDetails() {
    if (this.gaClientId) {
      const options = {
        page_title: this.pageTitle,
        page_url: this.pageUrl,
        ga_client_id: this.gaClientId
      };
      await fetch((HJ__WEBPACK_IMPORTED_MODULE_0___default().Config).api_url + '/ppv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      });
    }
  }
}

/***/ }),

/***/ "./src/js/property/search.js":
/*!***********************************!*\
  !*** ./src/js/property/search.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PropertySearchView)
/* harmony export */ });
/* harmony import */ var _googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @googlemaps/js-api-loader */ "./node_modules/.pnpm/@googlemaps+js-api-loader@2.0.1/node_modules/@googlemaps/js-api-loader/dist/index.js");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _templates_partial_property_info_window_html__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../templates/partial.property_info_window.html */ "./src/templates/partial.property_info_window.html");
/* harmony import */ var _templates_partial_property_info_window_html__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_property_info_window_html__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _templates_partial_property_listing_html__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../templates/partial.property_listing.html */ "./src/templates/partial.property_listing.html");
/* harmony import */ var _templates_partial_property_listing_html__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_property_listing_html__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../templates/partial.search.expired.html */ "./src/templates/partial.search.expired.html");
/* harmony import */ var _templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../templates/partial.search.no_results.html */ "./src/templates/partial.search.no_results.html");
/* harmony import */ var _templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _form_helper__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../form-helper */ "./src/js/form-helper.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../helper */ "./src/js/helper.js");
/* harmony import */ var _property_alertmodal__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../property/alertmodal */ "./src/js/property/alertmodal.js");
/* harmony import */ var _station_typeahead__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../station/typeahead */ "./src/js/station/typeahead.js");














const criteriaMap = {
  'r[l]': 'rent[low]',
  'r[h]': 'rent[high]',
  'p[l]': 'price[low]',
  'p[h]': 'price[high]',
  'mr[l]': 'monthly_rate[low]',
  'mr[h]': 'monthly_rate[high]',
  'cry[l]': 'current_rent_yield[low]',
  'cry[h]': 'current_rent_yield[high]',
  df: 'date_from',
  dt: 'date_to',
  lm: 'landmark',
  st: 'structure_type',
  'sz[l]': 'size[low]',
  'sz[h]': 'size[high]',
  'st_sz[l]': 'structure_size[low]',
  'st_sz[h]': 'structure_size[high]',
  bed: 'bedroom_no',
  new: 'new_development',
  pet: 'pet_friendly',
  pk: 'parking_type',
  ff: 'fully_furnished',
  nkm: 'no_key_money',
  hr: 'high_rise',
  reno: 'renovated',
  v: 'vintage',
  lb: 'large_balcony',
  cnr: 'corner_room',
  name: 'structure_name',
  key: 'hash_id'
};

/**
 * Map fields to API parameters
 * @param {object} criteria
 * @returns {object}
 */
function mapFieldsToApiParams(criteria) {
  const mappedCriteria = {};

  // Loop through criteria
  underscore__WEBPACK_IMPORTED_MODULE_5___default().each(criteria, (value, key) => {
    // If key has entry in criteria map, use it
    if (criteriaMap[key]) {
      mappedCriteria[criteriaMap[key]] = value;
    }
    // Else use key as-is
    else {
      mappedCriteria[key] = value;
    }
  });
  return mappedCriteria;
}
function buildQuery(criteria, options) {
  // Create query by extending criteria, sort, and options
  const query = underscore__WEBPACK_IMPORTED_MODULE_5___default().extend({}, mapFieldsToApiParams(criteria), options);

  // If date_from and date_to specified; calculate nights_stay
  if (query.date_from && query.date_to) {
    query.nights_stay = moment__WEBPACK_IMPORTED_MODULE_4___default()(query.date_to).diff(moment__WEBPACK_IMPORTED_MODULE_4___default()(query.date_from), 'days');
  }

  // If no hash_id
  if (underscore__WEBPACK_IMPORTED_MODULE_5___default().isEmpty(query.hash_id)) {
    // Add NOT resort to query conditions
    query.resort = 0;
  }
  if (query.bedroom_no) {
    // If not array, convert to array
    if (!underscore__WEBPACK_IMPORTED_MODULE_5___default().isArray(query.bedroom_no)) {
      query.bedroom_no = [query.bedroom_no];
    }

    // If "4" chosen, add "5" to "10"
    if (-1 !== query.bedroom_no.indexOf(4)) {
      query.bedroom_no = underscore__WEBPACK_IMPORTED_MODULE_5___default().union(query.bedroom_no, [5, 6, 7, 8, 9, 10]);
    }
  }

  // Extend defaults and return
  return underscore__WEBPACK_IMPORTED_MODULE_5___default().extend({
    sort_key: 'updated_at',
    sort_order: 'desc',
    limit: (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).resultsLimit,
    offset: 0
  }, query);
}
class PropertySearchView extends (backbone__WEBPACK_IMPORTED_MODULE_1___default().View) {
  preinitialize(options) {
    // Set "API client ID"
    this.api_client_id = options.api_client_id || null;
    if (this.api_client_id === null) {
      throw Error('Parameter api_client_id not set');
    }

    // Set "section"
    this.section = options.section;
    if (!this.section) {
      throw 'Parameter "section" cannot be empty';
    }

    // Set search key
    this.key = options.key;
    this.locale = options.locale;
    this.Markers = {};
    Promise.all([(0,_googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__.importLibrary)('core'), (0,_googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__.importLibrary)('maps')]).then(([CoreLibrary, MapsLibrary]) => {
      // Initialize map canvas
      this.MapCanvas = new MapsLibrary.Map(document.getElementById('map-canvas'), {
        mapId: '7812172cc40544ecc082ee2a',
        // Styling controlled via Google Cloud Console
        center: new CoreLibrary.LatLng(35.655553, 139.736392),
        zoom: 12,
        minZoom: 5,
        scaleControl: true,
        cameraControl: false,
        zoomControl: true,
        scrollWheel: true,
        streetViewControl: false,
        clickableLabels: false,
        mapTypeControl: false,
        gestureHandling: 'greedy'
      });

      /** For some reason we can't directly pass the close() function to addListener() */
      this.MapCanvas.addListener('click', () => {
        this.infoWindow.close();
      });

      // Create marker bounds object for use in Google maps
      this.MarkerBounds = new CoreLibrary.LatLngBounds();
      this.clickedMarkers = localStorage.getItem('clickedMarkers') ? JSON.parse(localStorage.getItem('clickedMarkers')) : [];

      // Initialize info window
      this.infoWindow = new MapsLibrary.InfoWindow({
        maxWidth: 350
      });
    });

    // Set search state properties
    this.lastSearchId = undefined;
    this.events = {
      'click .toggle-search-list-map button': this.handleClickSearchListMap,
      'submit .search-criteria form': this.handleSubmit,
      'change .sort-menu form select': this.handleChangeSort,
      'mouseenter .property-listing': this.highlightMap,
      'mouseleave .property-listing': this.highlightMap,
      'click .btn-create_alert': this.handleClickCreateAlert,
      'click #btn-show-calendar': this.showCalendar,
      'click #btn-clear-calendar': this.clearCalendar,
      'click .dropdown': this.handleCriteriaClick,
      'click #criteria-toggle': this.handleCriteriaToggle,
      'click #criteria-clear': this.handleCriteriaClear,
      'change .criteria__filter': this.search,
      'change .criteria-dropdown': this.setCriteriaLabels,
      'change input[name="bed"]': this.setBedroomInputValues
    };
    this.stationCollection = new (backbone__WEBPACK_IMPORTED_MODULE_1___default().Collection)();

    // Initialize station typeahead
    this.subviews = {
      typeaheadStation: new _station_typeahead__WEBPACK_IMPORTED_MODULE_13__["default"]({
        el: document.getElementById('cntr-station'),
        collection: this.stationCollection
      }),
      typeaheadStationMobile: new _station_typeahead__WEBPACK_IMPORTED_MODULE_13__["default"]({
        el: document.getElementById('cntr-station-mobile'),
        collection: this.stationCollection
      }),
      modalPropertyAlert: new _property_alertmodal__WEBPACK_IMPORTED_MODULE_12__["default"]()
    };

    // Hide footer (page has infinite scroll)
    jquery__WEBPACK_IMPORTED_MODULE_3___default()('footer').hide();
  }
  initialize() {
    // Initialize spinner
    this.Spinner = this.$el.find('.spinner');
    this.Spinner.hide();

    // Initialize property list
    this.propertyList = this.$el.find('.property-listings');
    this.propertyList.empty();

    // Initialize date range
    const dateRangePicker = this.$el.find('input[data-action="date-range"]');
    const aDay = 86400000;
    dateRangePicker.mobiscroll().range({
      theme: 'windows',
      showSelector: false,
      buttons: [{
        text: 'Set',
        handler: 'set',
        cssClass: 'mbsc-fr-btn mbsc-green-bg'
      }, 'clear'],
      cssClass: 'md-range',
      dateFormat: 'M d, yy',
      defaultValue: [],
      display: 'center',
      min: new Date(),
      // minRange: 30 * aDay,
      months: 'auto',
      max: moment__WEBPACK_IMPORTED_MODULE_4___default()().add(6, 'months').endOf('month').toDate(),
      // Max 6 months ahead
      onDayChange: function (e, inst) {
        // Get currently chosen start/end dates
        const [startDate] = inst.getVal(true);
        if (e.active === 'start') {
          // Set start date, and end date to 30 days (29 nights) later
          inst.setVal([e.date, moment__WEBPACK_IMPORTED_MODULE_4___default()(e.date).add(29, 'days').toDate()]);
          inst.setActiveDate('end');
          return false;
        } else if (e.active === 'end') {
          // If end date chosen is before current start date; reset
          if (startDate instanceof Date && e.date < startDate) {
            inst.setVal([e.date, undefined]);
            inst.setActiveDate('end');
            return false;
          }

          // Make sure at least 30 days (29 nights) are selected
          if ((e.date - startDate) / aDay < 29) {
            alert('Minimum 30 days required');
            return false;
          }
        }
      },
      onSet: function (e, inst) {
        const [startDate, endDate] = inst.getVal();

        // Set date on date_from hidden field
        jquery__WEBPACK_IMPORTED_MODULE_3___default()('[name="df"]').val(moment__WEBPACK_IMPORTED_MODULE_4___default()(startDate).format('YYYY-MM-DD'));

        // Set date on date_to hidden field
        jquery__WEBPACK_IMPORTED_MODULE_3___default()('[name="dt"]').val(moment__WEBPACK_IMPORTED_MODULE_4___default()(endDate).format('YYYY-MM-DD'));
      },
      onClear: function () {
        // Clear date on hidden fields
        jquery__WEBPACK_IMPORTED_MODULE_3___default()('[name="df"], [name="dt"]').val('');
      }
    });

    // Get search criteria
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const previousCriteria = JSON.parse(urlParams.get('c')) || {};
    const previousSortKey = urlParams.get('sk');
    const previousSortOrder = urlParams.get('so');
    this.currentCriteria = {};
    this.criteriaElOpen = false;

    // Prepopulate search filters with saved data
    if (underscore__WEBPACK_IMPORTED_MODULE_5___default().isEmpty(this.key)) {
      if (underscore__WEBPACK_IMPORTED_MODULE_5___default().size(previousCriteria) > 0) {
        // Put form data
        (0,_form_helper__WEBPACK_IMPORTED_MODULE_10__.putFormData)(this.$el.find('.search-criteria form'), previousCriteria, false);
        if (previousCriteria.lm instanceof Array) {
          // Loop through landmarks
          previousCriteria.lm.forEach(landmark => {
            // Restore each landmark
            this.subviews.typeaheadStation.select(undefined, landmark);
            this.subviews.typeaheadStationMobile.select(undefined, landmark);
          });
        }

        // Set date range picker using date_from and date_to
        if (this.section === 'short-term' && previousCriteria.df && previousCriteria.dt) {
          dateRangePicker.mobiscroll('setVal', [moment__WEBPACK_IMPORTED_MODULE_4___default()(previousCriteria.df, 'YYYY-MM-DD').toDate(), moment__WEBPACK_IMPORTED_MODULE_4___default()(previousCriteria.dt, 'YYYY-MM-DD').toDate()], true);
        }
        this.setCriteriaLabels();
      }

      // Set sort key and order
      if (previousSortKey && previousSortOrder) {
        this.el.querySelector('.sort-menu form [name="sort_criteria"]').value = `${previousSortKey}_${previousSortOrder}`;
      } else {
        this.el.querySelector('.sort-menu form [name="sort_criteria"]').value = 'updated_at_desc';
      }
    }

    // Toggle list mode as default to highlight properties
    this.toggleSearchListMap('list');

    // Check active button on window resize and simulate click on "list" button if in "search" mode
    jquery__WEBPACK_IMPORTED_MODULE_3___default()(window).on('resize', this.checkSearchListMapMode);
    this.listenTo(this.subviews.typeaheadStation.collection, 'update', this.setStationCriteriaLabel);
    this.listenTo(this.subviews.typeaheadStation.collection, 'update', this.search);

    // Google Analytics Client ID
    const ga_client_id = document.cookie.match(/_ga=(.+?);/);
    if (ga_client_id) {
      this.gaClientID = ga_client_id[1].split('.').slice(-2).join('.');
    }

    // Search properties
    this.search();
  }
  handleClickSearchListMap($e) {
    // Toggle search/list/map based on button value
    this.toggleSearchListMap($e.currentTarget.value);
  }

  /**
   * @param {string} mode
   */
  toggleSearchListMap(mode) {
    const searchCriteria = this.$el.find('.search-criteria');
    const searchListings = this.$el.find('.search-listings');
    const searchMap = this.$el.find('.search-map');

    // Remove class "active" from all buttons
    this.$el.find('.toggle-search-list-map button').removeClass('active');

    // Add class "active" to desired
    this.$el.find('button[value="' + mode + '"]').addClass('active');

    // If "search" mode
    if (mode === 'search') {
      // Hide listings and sidebar
      searchListings.addClass('d-none');
      searchMap.addClass('d-none');

      // Show criteria
      searchCriteria.removeClass('d-none');
    }
    // Else If "map" mode
    else if (mode === 'map') {
      // Hide criteria and listings
      searchCriteria.addClass('d-none');
      searchListings.addClass('d-none');

      // Show map
      searchMap.removeClass('d-none');

      // Recenter map now that it's visible
      this.recenterMap();
    }
    // Else if "list" mode
    else if (mode === 'list') {
      // Hide criteria and map
      searchCriteria.addClass('d-none');
      searchMap.addClass('d-none');

      // Show listings
      searchListings.removeClass('d-none');
    }
  }
  recenterMap() {
    // Fit map to bounds of all markers
    if (!this.MarkerBounds.isEmpty()) {
      this.MapCanvas.fitBounds(this.MarkerBounds);
    }
  }
  checkSearchListMapMode() {
    const searchSelector = document.querySelector('.toggle-search-list-map').children[0];
    const listSelector = document.querySelector('[value="list"]');

    // If currently in search mode and new window width is >=768px (tablet and above)
    if (searchSelector.classList.contains('active') && window.innerWidth >= 768) {
      // Simulate click on "list" mode (otherwise page remains in search mode, which is not available for tablet width and above)
      listSelector.click();
    }
  }
  handleCriteriaToggle() {
    const criteriaDiv = document.getElementById('hidden-criteria');
    const criteriaButton = document.getElementById('criteria-toggle');
    const toggleClasses = ['d-md-none', 'd-md-flex', 'flex-wrap', 'justify-content-center'];
    toggleClasses.map(classToToggle => criteriaDiv.classList.toggle(classToToggle));
    criteriaButton.innerText = criteriaDiv.classList.contains('d-md-none') ? (0,_helper__WEBPACK_IMPORTED_MODULE_11__.t)('more_criteria') : (0,_helper__WEBPACK_IMPORTED_MODULE_11__.t)('hide_criteria');
    this.criteriaElOpen = !this.criteriaElOpen;
  }
  handleCriteriaClear() {
    const criteriaForm = this.$el.find('.search-criteria form')[0];
    const hasStationInput = !!this.el.querySelector('#station_selection');
    criteriaForm.reset();
    if (hasStationInput) {
      this.subviews.typeaheadStation.clearList();
      this.subviews.typeaheadStationMobile.clearList();
    }
    this.setCriteriaLabels();
    this.search();
  }
  handleChangeSort() {
    // Scroll to top
    jquery__WEBPACK_IMPORTED_MODULE_3___default()(window).scrollTop(0);

    // Search properties
    this.search();
  }
  async handleSubmit($e) {
    $e.preventDefault();

    // Scroll to top
    jquery__WEBPACK_IMPORTED_MODULE_3___default()(window).scrollTop(0);

    // Switch to map mode
    this.toggleSearchListMap('list');

    // Close criteria div if open
    const criteriaButton = document.getElementById('criteria-toggle');
    if (this.criteriaElOpen) {
      criteriaButton.click();
    }

    // Record search
    window.dataLayer && window.dataLayer.push({
      event: 'search',
      event_category: 'Searches',
      event_label: this.section + ' search'
    });
  }
  async search() {
    // Clear property list & map markers
    this.propertyList.empty();
    this.clearAllMarkers();

    // Close any info windows
    if (this.infoWindow) {
      this.infoWindow.close();
    }

    // Get form data
    const currentCriteria = (0,_form_helper__WEBPACK_IMPORTED_MODULE_10__.getFormData)(this.$el.find('.search-criteria form'));

    // Reduce criteria added from multiples of same input
    for (let [key, value] of Object.entries(currentCriteria)) {
      if (Array.isArray(value) && value.length > 0) {
        const resetValue = value.filter((value, index, array) => array.indexOf(value) === index);
        if (resetValue.length > 1) {
          currentCriteria[key] = resetValue;
        } else {
          currentCriteria[key] = resetValue[0];
        }
      }
    }
    const sortCriteria = this.el.querySelector('.sort-menu form [name="sort_criteria"]').value;
    const {
      currentSortKey,
      currentSortOrder
    } = this.setSortCriteria(sortCriteria);

    // Get landmarks
    this.landmarks = [...this.subviews.typeaheadStation.collection.toJSON(), ...this.subviews.typeaheadStationMobile.collection.toJSON()];
    this.landmarks = [...new Map(this.landmarks.map(station => [station['id'], station])).values()];
    if (this.landmarks.length > 0) {
      // Attach landmarks
      currentCriteria.lm = this.landmarks;
    }
    this.currentCriteria = currentCriteria;

    // Store search criteria
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '#c=' + JSON.stringify(currentCriteria) + '&sk=' + currentSortKey + '&so=' + currentSortOrder;
    window.history.pushState({
      path: newUrl
    }, '', newUrl);

    // Recreate property alert modal
    this.subviews.modalPropertyAlert = new _property_alertmodal__WEBPACK_IMPORTED_MODULE_12__["default"]();
    const options = {};
    switch (this.section) {
      case 'rent':
        options.property_type = 'rent';
        break;
      case 'buy':
        options.property_type = 'sales';
        options.investment = 0;
        break;
      case 'short-term':
        options.property_type = 'monthly';
        break;
      case 'investment-properties':
        options.property_type = 'sales';
        options.investment = 1;
        break;
      default:
        throw new Error('Unknown section');
    }
    options.api_client_id = this.api_client_id;
    options.hash_id = this.key;
    options.sort_key = currentSortKey;
    options.sort_order = currentSortOrder;
    options.ga_client_id = this.gaClientID;

    // Convert into query
    this.query = buildQuery(currentCriteria, options);

    // Set language parameter
    this.query.language = (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).language;

    // Show spinner
    this.Spinner.show();

    // Load search results
    const response = await fetch((HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).api_url + '/search?' + jquery__WEBPACK_IMPORTED_MODULE_3___default().param(this.query), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    // Hide spinner
    this.Spinner.hide();
    if (!response.ok) {
      if (response.status === 410) {
        // Search has expired
        this.propertyList.html(_templates_partial_search_expired_html__WEBPACK_IMPORTED_MODULE_8___default()({
          t: _helper__WEBPACK_IMPORTED_MODULE_11__.t
        }));
        return;
      }
      const responseData = await response.json();

      // Create and throw error
      const e = new Error(responseData.exception[0].message);
      e.name = responseData.exception[0].type;
      throw e;
    }
    const responseData = await response.json();
    this.lastSearchId = responseData.search_id;
    sessionStorage.setItem('lastSearchId', responseData.search_id);

    // If no results found
    if (this.query.offset === 0 && typeof responseData.results !== 'undefined' && responseData.results.length === 0) {
      this.propertyList.html(_templates_partial_search_no_results_html__WEBPACK_IMPORTED_MODULE_9___default()({
        t: _helper__WEBPACK_IMPORTED_MODULE_11__.t
      }));
    }
    // Else results
    else {
      /**
       * Append items
       */
      const structures = responseData.results;
      let items = '';
      Promise.all([(0,_googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__.importLibrary)('core'), (0,_googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__.importLibrary)('marker')]).then(([CoreLibrary, MarkerLibrary]) => {
        underscore__WEBPACK_IMPORTED_MODULE_5___default().each(structures, structure => {
          // Determine property title
          let title;
          if ((0,_helper__WEBPACK_IMPORTED_MODULE_11__.isMembersOnly)(structure)) {
            title = (0,_helper__WEBPACK_IMPORTED_MODULE_11__.propertyAlias)(structure);
          } else if (structure.x_tagline) {
            title = structure.x_tagline;
          } else {
            title = structure.x_structure_name;
          }

          // If no marker for current location, and latitude and longitude are valid
          if (!(structure.location.id in this.Markers) && Number(structure.location.longitude) > 0 && Number(structure.location.latitude) > 0) {
            const previouslyClicked = this.clickedMarkers.includes(structure.location.id);
            const iconUrl = previouslyClicked ? (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).icons.url_base_over + '/dot.png' : (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).icons.url_base_out + '/dot.png';
            const hjDot = document.createElement('img');
            hjDot.src = iconUrl;
            hjDot.width = 25;
            hjDot.height = 25;

            // Create advanced marker element
            const marker = new MarkerLibrary.AdvancedMarkerElement({
              map: this.MapCanvas,
              position: new CoreLibrary.LatLng(structure.location.latitude, structure.location.longitude),
              title: title,
              content: hjDot
            });

            // If user has specified search criteria
            if (Object.keys(this.currentCriteria).length !== 0) {
              // Extend the bounds by the marker
              this.MarkerBounds.extend(marker.position);
            }
            // Else, no criteria (default view)
            else {
              // Only extend the bounds to include current marker if marker position is within bounds of central Tokyo (roughly)
              const isWithinBounds = marker.position.lat < 35.69111 && marker.position.lat > 35.62747 && marker.position.lng < 139.75657 && marker.position.lng > 139.673662;
              if (isWithinBounds) {
                this.MarkerBounds.extend(marker.position);
              }
            }

            // Add click listener
            marker.addListener('click', () => {
              // If window >= desktop width
              if (window.innerWidth >= 992) {
                // Scroll to property card in search results
                if (jquery__WEBPACK_IMPORTED_MODULE_3___default()('[data-location="' + structure.location.id + '"]').length) {
                  const el = jquery__WEBPACK_IMPORTED_MODULE_3___default()('[data-location="' + structure.location.id + '"]');
                  const prevEl = this.el.querySelector('.clicked-property');
                  if (prevEl) {
                    prevEl.classList.remove('clicked-property');
                  }
                  const listingsEl = jquery__WEBPACK_IMPORTED_MODULE_3___default()('.search-listings');
                  const elOffsetTop = el.position().top;
                  const navHeight = jquery__WEBPACK_IMPORTED_MODULE_3___default()('.navbar').height();
                  listingsEl.scrollTop(listingsEl.scrollTop() + elOffsetTop - navHeight);
                  el.addClass('clicked-property');
                }
              } else {
                // Display info window
                const content = _templates_partial_property_info_window_html__WEBPACK_IMPORTED_MODULE_6___default()({
                  language: (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).language,
                  badge: 'badge-for-' + ('buy' === this.section ? 'sale' : 'rent'),
                  coverphoto: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.getPhotoUrl)(structure),
                  title: title,
                  key: this.key,
                  section: this.section,
                  structure_type: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.structureTypeText)(structure),
                  address: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.addressText)(structure),
                  isMembersOnly: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.isMembersOnly)(structure),
                  buildingUrl: _helper__WEBPACK_IMPORTED_MODULE_11__.buildingUrl,
                  structureDetailsUrl: _helper__WEBPACK_IMPORTED_MODULE_11__.structureDetailsUrl,
                  unitDetailsUrl: _helper__WEBPACK_IMPORTED_MODULE_11__.unitDetailsUrl,
                  cardTitleUrl: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.cardTitleUrl)(structure, this.section, this.key),
                  getCost: _helper__WEBPACK_IMPORTED_MODULE_11__.getCost,
                  getSize: _helper__WEBPACK_IMPORTED_MODULE_11__.getSize,
                  bathrooms: _helper__WEBPACK_IMPORTED_MODULE_11__.bathroomIcon,
                  bedroomNo: _helper__WEBPACK_IMPORTED_MODULE_11__.bedroomNo,
                  moneyFormat: _helper__WEBPACK_IMPORTED_MODULE_11__.moneyFormat,
                  structure,
                  t: _helper__WEBPACK_IMPORTED_MODULE_11__.t
                });
                this.infoWindow.setContent(content);
                this.infoWindow.setPosition(marker.position);
                this.infoWindow.open(this.MapCanvas, marker);
              }
              if (!this.clickedMarkers.includes(structure.location.id)) {
                this.clickedMarkers.push(structure.location.id);
                localStorage.setItem('clickedMarkers', JSON.stringify(this.clickedMarkers));
                marker.content.src = (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).icons.url_base_over + '/dot.png';
                jquery__WEBPACK_IMPORTED_MODULE_3___default()('[data-location="' + structure.location.id + '"]').addClass('mapIconOver');
              }
            });

            // Add mouseover listener
            marker.addListener('mouseover', function () {
              marker.content.src = (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).icons.url_base_over + '/dot.png';
              jquery__WEBPACK_IMPORTED_MODULE_3___default()('[data-location="' + structure.location.id + '"]').addClass('mapIconOver');
            });

            // Add mouseout listener
            marker.addListener('mouseout', function () {
              const storedMarkers = localStorage.getItem('clickedMarkers') ? JSON.parse(localStorage.getItem('clickedMarkers')) : [];
              if (!storedMarkers.includes(structure.location.id)) {
                marker.content.src = (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).icons.url_base_out + '/dot.png';
                jquery__WEBPACK_IMPORTED_MODULE_3___default()('[data-location="' + structure.location.id + '"]').removeClass('mapIconOver');
              }
            });

            // Add marker to list
            this.Markers[structure.location.id] = marker;
          }
          items += _templates_partial_property_listing_html__WEBPACK_IMPORTED_MODULE_7___default()({
            language: (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).language,
            featured: structure.featured,
            coverphoto: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.getPhotoUrl)(structure),
            title,
            key: this.key,
            section: this.section,
            structure_type: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.structureTypeText)(structure),
            address: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.addressText)(structure),
            isMembersOnly: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.isMembersOnly)(structure),
            buildingUrl: _helper__WEBPACK_IMPORTED_MODULE_11__.buildingUrl,
            structureDetailsUrl: _helper__WEBPACK_IMPORTED_MODULE_11__.structureDetailsUrl,
            unitDetailsUrl: _helper__WEBPACK_IMPORTED_MODULE_11__.unitDetailsUrl,
            cardTitleUrl: (0,_helper__WEBPACK_IMPORTED_MODULE_11__.cardTitleUrl)(structure, this.section, this.key),
            trainInfo: _helper__WEBPACK_IMPORTED_MODULE_11__.trainInfo,
            getCost: _helper__WEBPACK_IMPORTED_MODULE_11__.getCost,
            getSize: _helper__WEBPACK_IMPORTED_MODULE_11__.getSize,
            bathroomIcon: _helper__WEBPACK_IMPORTED_MODULE_11__.bathroomIcon,
            bedroomNo: _helper__WEBPACK_IMPORTED_MODULE_11__.bedroomNo,
            moneyFormat: _helper__WEBPACK_IMPORTED_MODULE_11__.moneyFormat,
            structure,
            t: _helper__WEBPACK_IMPORTED_MODULE_11__.t
          });
        });

        // Append items to property list
        this.propertyList.append(items);
        this.setCriteriaLabels();

        // Recenter map
        this.recenterMap();
      });
    }
  }
  clearAllMarkers() {
    // Remove all markers from map
    Object.entries(this.Markers).forEach(([, marker]) => marker.setMap(null));

    // Reset markers list
    this.Markers = {};
    (0,_googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__.importLibrary)('core').then(CoreLibrary => {
      this.MarkerBounds = new CoreLibrary.LatLngBounds();
    });
  }
  highlightMap($e) {
    const location = $e.currentTarget.dataset.location;
    // const structure_type = $e.currentTarget.dataset.structureType;
    let type = '';
    const storedMarkers = localStorage.getItem('clickedMarkers') ? JSON.parse(localStorage.getItem('clickedMarkers')) : [];
    if (!storedMarkers.includes(Number(location))) {
      type = $e.type === 'mouseenter' ? 'over' : 'out';
    } else {
      type = 'over';
    }
    const marker = this.Markers[location];
    if ('over' === type) {
      marker.zIndex = 99;
    } else {
      marker.zIndex = 0;
    }
    const icon_url = (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).icons['url_base_' + type] + '/dot.png';
    if (marker.content.src != icon_url && !storedMarkers.includes(Number(location))) {
      marker.content.src = icon_url;
    }
  }
  handleClickCreateAlert(e) {
    e.preventDefault();
    const hasCriteria = Object.keys(this.currentCriteria).length;

    // If minimum requirements have been met; show modal with form
    if (hasCriteria) {
      this.subviews.modalPropertyAlert.showAlertForm();
    } else {
      this.subviews.modalPropertyAlert.showAlertError();
    }
    this.showModalPropertyAlert();
  }
  showModalPropertyAlert() {
    if (this.lastSearchId) {
      // Show property alert modal, with last search ID
      this.subviews.modalPropertyAlert.show(this.lastSearchId);
    } else {
      throw 'Last search ID is not set';
    }
  }
  showCalendar($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }

    // Show calendar
    this.$el.find('[data-action="date-range"]').mobiscroll('show');
  }
  clearCalendar($e) {
    if ($e instanceof Object) {
      $e.preventDefault();
    }

    // Clear calendar
    this.$el.find('[data-action="date-range"]').mobiscroll('clear');
  }
  setSortCriteria(sortString) {
    const stringElements = sortString.split('_');
    let currentSortKey;
    const currentSortOrder = stringElements.pop();
    if (stringElements.length > 1) {
      currentSortKey = stringElements.join('_');
    } else {
      currentSortKey = stringElements[0];
    }
    return {
      currentSortKey,
      currentSortOrder
    };
  }
  handleCriteriaClick($e) {
    const dropdownToggle = $e.target;
    const searchCriteriaInputs = dropdownToggle.nextElementSibling;
    searchCriteriaInputs.classList.toggle('d-none');
    const handleInputGroupClick = event => {
      const clickedElement = event.target;
      if (!searchCriteriaInputs.contains(clickedElement)) {
        if (clickedElement !== dropdownToggle) {
          searchCriteriaInputs.classList.add('d-none');
          this.el.removeEventListener('click', handleInputGroupClick);
        }
      }
    };
    this.el.addEventListener('click', handleInputGroupClick);
  }
  setCriteriaLabels(e) {
    this.setStationCriteriaLabel();
    this.setPriceCriteriaLabel(e);
    this.setSizeCriteriaLabel(e);
  }
  setStationCriteriaLabel() {
    console.debug('PropertySearchView#setStationCriteriaLabel');
    const DEFAULT_LABEL = this.locale === 'ja' ? '駅' : 'Any Station';
    const stationLabel = this.el.querySelector('#station-select');
    const stationList = this.subviews.typeaheadStation.collection.models;
    const stationListMobile = this.subviews.typeaheadStation.collection.models;
    if (stationLabel) {
      if (stationList) {
        if (stationList.length > 0) {
          if (stationList.length === 1) {
            stationLabel.innerText = `${stationList[0].attributes.name}`;
          } else if (stationList.length > 1) {
            stationLabel.innerText = `${stationList.length} stations`;
          }
        } else {
          stationLabel.innerText = DEFAULT_LABEL;
        }
      } else if (stationListMobile) {
        if (stationListMobile.length > 0) {
          if (stationListMobile.length === 1) {
            stationLabel.innerText = `${stationListMobile[0].attributes.name}`;
          } else if (stationListMobile.length > 1) {
            stationLabel.innerText = `${stationListMobile.length} stations`;
          }
        } else {
          stationLabel.innerText = DEFAULT_LABEL;
        }
      }
    }
  }
  setPriceCriteriaLabel(e) {
    console.debug('PropertySearchView#SetPriceCriteriaLabel');
    const allMaxRateInputs = this.el.querySelectorAll('[name="mr[h]"]');
    const allRentMinInputs = this.el.querySelectorAll('[name="r[l]"]');
    const allRentMaxInputs = this.el.querySelectorAll('[name="r[h]"]');
    const allPriceMinInputs = this.el.querySelectorAll('[name="p[l]"]');
    const allPriceMaxInputs = this.el.querySelectorAll('[name="p[h]"]');
    const isShortTerm = allMaxRateInputs.length > 0;
    const isRent = allRentMinInputs.length > 0 && allRentMaxInputs.length > 0;
    const isBuy = allPriceMinInputs.length > 0 && allPriceMaxInputs.length > 0;
    const priceRangeLabel = this.el.querySelector('#price-range');

    // Short-term Apartments
    if (isShortTerm) {
      console.debug('setPriceCriteriaLabel#isShortTerm');
      const {
        maxValue
      } = this.setPriceInputValues(e, 'mr[h]', allMaxRateInputs);

      // Short term only has max price input - minValue = null
      priceRangeLabel.innerText = this.setPriceInputLabels(null, maxValue);
    }

    // Rent
    if (isRent) {
      console.debug('setPriceCriteriaLabel#isRent');
      let {
        minValue
      } = this.setPriceInputValues(e, 'r[l]', allRentMinInputs);
      let {
        maxValue
      } = this.setPriceInputValues(e, 'r[h]', allRentMaxInputs);
      priceRangeLabel.innerText = this.setPriceInputLabels(minValue, maxValue);
    }

    // Price
    if (isBuy) {
      console.debug('setPriceCriteriaLabel#isBuy');
      let {
        minValue
      } = this.setPriceInputValues(e, 'p[l]', allPriceMinInputs);
      let {
        maxValue
      } = this.setPriceInputValues(e, 'p[h]', allPriceMaxInputs);
      priceRangeLabel.innerText = this.setPriceInputLabels(minValue, maxValue);
    }
  }
  setPriceInputLabels(minValue, maxValue) {
    const numberStringFormatter = value => {
      return Number(value).toLocaleString('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
      });
    };
    const DEFAULT_LABEL = this.locale === 'ja' ? '価格' : 'Any Price';
    let displayValue = '';
    let label = '';
    if (minValue && !maxValue) {
      displayValue = numberStringFormatter(minValue);
      label = `¥${displayValue}+`;
    } else if (maxValue && !minValue) {
      displayValue = numberStringFormatter(maxValue);
      label = `Up to ¥${displayValue}`;
    } else if (minValue && maxValue) {
      const minDisplayValue = numberStringFormatter(minValue);
      const maxDisplayValue = numberStringFormatter(maxValue);
      label = `¥${minDisplayValue} - ¥${maxDisplayValue}`;
    } else {
      label = DEFAULT_LABEL;
    }
    return label;
  }
  setPriceInputValues(event, inputName, inputsArray) {
    const INPUT_NAMES = {
      rentLow: 'r[l]',
      rentHigh: 'r[h]',
      priceLow: 'p[l]',
      priceHigh: 'p[h]',
      rateHigh: 'mr[h]'
    };
    let minValue, maxValue;
    if (inputName === INPUT_NAMES.rentLow) {
      if (event && event.target.name === INPUT_NAMES.rentLow) {
        minValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = minValue > 0 ? minValue : '';
        });
      } else {
        minValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.rentLow}"]`).value);
      }
    } else if (inputName === INPUT_NAMES.rentHigh) {
      if (event && event.target.name === INPUT_NAMES.rentHigh) {
        maxValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = maxValue > 0 ? maxValue : '';
        });
      } else {
        maxValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.rentHigh}"]`).value);
      }
    } else if (inputName === INPUT_NAMES.priceLow) {
      if (event && event.target.name === INPUT_NAMES.priceLow) {
        minValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = minValue > 0 ? minValue : '';
        });
      } else {
        minValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.priceLow}"]`).value);
      }
    } else if (inputName === INPUT_NAMES.priceHigh) {
      if (event && event.target.name === INPUT_NAMES.priceHigh) {
        maxValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = maxValue > 0 ? maxValue : '';
        });
      } else {
        maxValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.priceHigh}"]`).value);
      }
    } else if (inputName === INPUT_NAMES.rateHigh) {
      if (event && event.target.name === INPUT_NAMES.rateHigh) {
        maxValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = maxValue > 0 ? maxValue : '';
        });
      } else {
        maxValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.rateHigh}"]`).value);
      }
    }
    return {
      minValue,
      maxValue
    };
  }
  setSizeCriteriaLabel(e) {
    console.debug('PropertySearchView#setSizeCriteriaLabel');
    const allSizeMinInputs = this.el.querySelectorAll('[name="sz[l]"]');
    const allSizeMaxInputs = this.el.querySelectorAll('[name="sz[h]"]');
    const allStructureSizeMinInputs = this.el.querySelectorAll('[name="st_sz[l]"]');
    const allStructureSizeMaxInputs = this.el.querySelectorAll('[name="st_sz[h]"]');
    const sizeRangeLabel = this.el.querySelector('#size-range');
    if (allSizeMinInputs.length > 0 && allSizeMaxInputs.length > 0) {
      const isUnitSize = !!this.el.querySelector('#criteria-bar__size').querySelector('select[name="sz[l]"]');
      if (isUnitSize) {
        let {
          minValue
        } = this.setSizeInputValues(e, 'sz[l]', allSizeMinInputs);
        let {
          maxValue
        } = this.setSizeInputValues(e, 'sz[h]', allSizeMaxInputs);
        sizeRangeLabel.innerText = this.setSizeInputLabels(minValue, maxValue);
      }
    }
    if (allStructureSizeMinInputs.length > 0 && allStructureSizeMaxInputs.length > 0) {
      const isStructureSize = !!this.el.querySelector('#criteria-bar__size').querySelector('select[name="st_sz[l]"]');
      if (isStructureSize) {
        let {
          minValue
        } = this.setSizeInputValues(e, 'st_sz[l]', allStructureSizeMinInputs);
        let {
          maxValue
        } = this.setSizeInputValues(e, 'st_sz[h]', allStructureSizeMaxInputs);
        sizeRangeLabel.innerText = this.setSizeInputLabels(minValue, maxValue);
      }
    }
  }
  setSizeInputLabels(minValue, maxValue) {
    const DEFAULT_LABEL = this.locale === 'ja' ? '広さ' : 'Any Size';
    let label = '';
    if (minValue && !maxValue) {
      label = `${minValue}m²+`;
    } else if (maxValue && !minValue) {
      label = `Up to ${maxValue}m²`;
    } else if (minValue && maxValue) {
      label = `${minValue}m² - ${maxValue}m²`;
    } else {
      label = DEFAULT_LABEL;
    }
    return label;
  }
  setSizeInputValues(event, inputName, inputsArray) {
    const INPUT_NAMES = {
      sizeLow: 'sz[l]',
      sizeHigh: 'sz[h]',
      structureSizeLow: 'st_sz[l]',
      structureSizeHigh: 'st_sz[h]'
    };
    let minValue, maxValue;
    if (inputName === INPUT_NAMES.sizeLow) {
      if (event && event.target.name === INPUT_NAMES.sizeLow) {
        minValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = minValue > 0 ? minValue : '';
        });
      } else {
        minValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.sizeLow}"]`).value);
      }
    } else if (inputName === INPUT_NAMES.sizeHigh) {
      if (event && event.target.name === INPUT_NAMES.sizeHigh) {
        maxValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = maxValue > 0 ? maxValue : '';
        });
      } else {
        maxValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.sizeHigh}"]`).value);
      }
    } else if (inputName === INPUT_NAMES.structureSizeLow) {
      if (event && event.target.name === INPUT_NAMES.structureSizeLow) {
        minValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = minValue > 0 ? minValue : '';
        });
      } else {
        minValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.structureSizeLow}"]`).value);
      }
    } else if (inputName === INPUT_NAMES.structureSizeHigh) {
      if (event && event.target.name === INPUT_NAMES.structureSizeHigh) {
        maxValue = Number(event.target.value);
        inputsArray.forEach(input => {
          input.value = maxValue > 0 ? maxValue : '';
        });
      } else {
        maxValue = Number(this.el.querySelector(`[name="${INPUT_NAMES.structureSizeHigh}"]`).value);
      }
    }
    return {
      minValue,
      maxValue
    };
  }
  setBedroomInputValues(e) {
    const bedroomInputs = Array.from(document.querySelectorAll("input[name='bed']")).filter(input => input !== e.target);
    bedroomInputs.forEach(input => {
      if (input.value === e.target.value) {
        input.checked = e.target.checked;
      }
    });
  }
}

/***/ }),

/***/ "./src/js/spinner.js":
/*!***************************!*\
  !*** ./src/js/spinner.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Spinner)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);

class Spinner extends backbone__WEBPACK_IMPORTED_MODULE_0__.View {
  constructor(options) {
    let color = '',
      top = 'calc(50% - 1rem)';
    if (options) {
      color = options.color;
      if (options.top) {
        top = '1rem';
      }
    }
    const props = {
      className: `spinner-border${color ? ` ${color}` : ''}`,
      attributes: {
        style: `top:${top}; left:calc(50% - 1rem); position:absolute; z-index:2000000000`,
        role: 'status'
      }
    };
    super(props);
    this.el.innerHTML = '<span class="sr-only">Loading...</span>';
  }
  spin(el) {
    this.containerEl = el;
    if (this.containerEl) {
      this.containerElPosition = this.containerEl.style.position;
      this.containerEl.style.position = 'relative';
    }
    el.appendChild(this.el);
  }
  stop() {
    if (this.containerEl) {
      this.containerEl.style.position = this.containerElPosition;
    }
    this.remove();
  }
}

/***/ }),

/***/ "./src/js/station/item.js":
/*!********************************!*\
  !*** ./src/js/station/item.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StationItemView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _templates_partial_station_item_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../templates/partial.station_item.html */ "./src/templates/partial.station_item.html");
/* harmony import */ var _templates_partial_station_item_html__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_templates_partial_station_item_html__WEBPACK_IMPORTED_MODULE_1__);


class StationItemView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize() {
    this.className = 'train_station';
    this.events = {
      'click [data-action=close]': this.delete
    };
  }
  render() {
    this.$el.html(_templates_partial_station_item_html__WEBPACK_IMPORTED_MODULE_1___default()(this.model.toJSON()));
    return this;
  }
  delete($e) {
    $e.stopPropagation();

    // Remove this model from it's collection
    this.model.collection.remove(this.model.id);
  }
}

/***/ }),

/***/ "./src/js/station/model.js":
/*!*********************************!*\
  !*** ./src/js/station/model.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StationModel)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);

class StationModel extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().Model) {
  preinitialize() {
    this.defaults = {
      id: null,
      name: null,
      type: null,
      d: 15,
      u: 'min'
    };
  }
}

/***/ }),

/***/ "./src/js/station/station.js":
/*!***********************************!*\
  !*** ./src/js/station/station.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Station {
  constructor(id, name, type) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.d = 15;
    this.u = 'min';
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Station);

/***/ }),

/***/ "./src/js/station/typeahead.js":
/*!*************************************!*\
  !*** ./src/js/station/typeahead.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StationTypeaheadView)
/* harmony export */ });
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "backbone");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bloodhound__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bloodhound */ "bloodhound");
/* harmony import */ var bloodhound__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bloodhound__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! HJ */ "HJ");
/* harmony import */ var HJ__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(HJ__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./item */ "./src/js/station/item.js");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model */ "./src/js/station/model.js");





class StationTypeaheadView extends (backbone__WEBPACK_IMPORTED_MODULE_0___default().View) {
  preinitialize() {
    this.dataset = null;
    this.events = {
      'typeahead:selected': this.select
    };
  }
  initialize(options) {
    if (options.collection) {
      this.collection = options.collection;
    } else {
      // Initialize collection with data
      this.collection = new (backbone__WEBPACK_IMPORTED_MODULE_0___default().Collection)();
    }

    // When collection updates, render list
    this.listenTo(this.collection, 'update', this.renderList);

    // Create dataset
    this.dataset = new (bloodhound__WEBPACK_IMPORTED_MODULE_1___default())({
      datumTokenizer: function (datum) {
        return datum.name.split(/[\s,\-()]+/);
      },
      queryTokenizer: function (query) {
        return query.split(/[\s,\-()]+/);
      },
      prefetch: {
        url: (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).api_url + '/datasource/station_groups?language=' + (HJ__WEBPACK_IMPORTED_MODULE_2___default().Config).language,
        cache: false
      },
      identify: function (obj) {
        return obj.id;
      }
    });

    // Initialize typeahead
    this.$el.find('.typeahead').typeahead({
      hint: true,
      highlight: false,
      minLength: 1,
      autoselect: true
    }, {
      name: 'stations',
      display: datum => {
        if (datum.prefecture) {
          return datum.name + ' (' + datum.prefecture + ')';
        } else {
          return datum.name;
        }
      },
      source: this.dataset,
      templates: {
        empty: '<div class="empty-message">Unable to find any train station that matches your search</div>'
      }
    });
    this.listenTo(this.collection, 'update', () => {
      this.renderList;
    });
  }
  select($e, datum) {
    // Create station model and add to collection
    this.collection.push(new _model__WEBPACK_IMPORTED_MODULE_4__["default"]({
      id: datum.id,
      name: datum.name,
      type: datum.type
    }));
    this.$el.find('.typeahead').val('').typeahead('val', '');
  }
  renderList() {
    this.el.querySelector('#station_selection').innerHTML = '';
    this.collection.each(station => {
      // Create station item
      const stationItemView = new _item__WEBPACK_IMPORTED_MODULE_3__["default"]({
        model: station
      });

      // Add to station selection list
      this.$el.find('#station_selection').append(stationItemView.render().el);
    });
  }
  clearList() {
    this.el.querySelector('#station_selection').innerHTML = '';
    this.collection.reset();
  }
}

/***/ }),

/***/ "./src/templates/modal.property_alert.html":
/*!*************************************************!*\
  !*** ./src/templates/modal.property_alert.html ***!
  \*************************************************/
/***/ ((module) => {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="modal-dialog modal-sm">\n	<div class="modal-content">\n		<form role="form" name="hj-create_alert_form" id="hj-create_alert_form">\n			<div class="modal-header align-items-center">\n				<h4 class="modal-title" id="alert_modal_label">'+
((__t=( t('create_email_alert') ))==null?'':__t)+
'</h4>\n				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\n			</div>\n			<div class="modal-body">\n				<div id="hj-create_alert_body" class="d-none">\n					<p>'+
((__t=( t('property_alert_message') ))==null?'':__t)+
'</p>\n					<div class="form-group">\n						<label class="control-label" for="field-email_address">'+
((__t=( t('email') ))==null?'':__t)+
'</label>\n						<input type="email" class="form-control" id="field-email_address" name="email_address" maxlength="255" autocomplete="email">\n					</div>\n					<div data-msg="success" style="display: none">\n						<div class="alert alert-success">'+
((__t=( t('alert_created') ))==null?'':__t)+
'</div>\n					</div>\n					<div data-msg="error-field" style="display: none;" class="alert alert-warning">'+
((__t=( t('error_field') ))==null?'':__t)+
'</div>\n					<div data-msg="error-create" style="display: none" class="alert alert-danger">'+
((__t=( t('property_alert_error_create') ))==null?'':__t)+
'</div>\n				</div>\n				<p id="hj-create_alert_error" class="text-danger">'+
((__t=( t('select_criteria') ))==null?'':__t)+
'</p>\n			</div>\n			<div class="modal-footer">\n				<button type="button" class="btn" data-dismiss="modal">'+
((__t=( t('close') ))==null?'':__t)+
'</button>\n				<button type="submit" id="alert-save" class="btn btn-primary">'+
((__t=( t('save') ))==null?'':__t)+
'</button>\n			</div>\n		</form>\n	</div>\n</div>';
}
return __p;
};


/***/ }),

/***/ "./src/templates/partial.property_gallery_listing.html":
/*!*************************************************************!*\
  !*** ./src/templates/partial.property_gallery_listing.html ***!
  \*************************************************************/
/***/ ((module) => {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="col-12 col-sm-6 col-lg-4 gallery__listing">\n    ';
 if (isMembersOnly) { 
__p+='\n    <div class="private-listing">Private Listing</div>\n    ';
 } 
__p+='\n    <a href="'+
((__t=( buildingUrl ))==null?'':__t)+
'">\n        ';
 if (coverphoto) { 
__p+='\n        <picture>\n            <source\n                type="image/webp"\n                media="(min-width: 1200px)"\n                data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=500&h=350&f=webp"\n            />\n            <source\n                type="image/webp"\n                data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=360&h=270&f=webp"\n            />\n            <source\n                media="(min-width: 1200px)"\n                data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=500&h=350&f&f=jpg"\n            />\n            <source\n                media="(min-width: 992px)"\n                data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'w=360&h=270&f=jpg"\n            />\n            <img\n                class="lazyload"\n                data-src="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=270&h=203&f=jpg"\n                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"\n                alt="'+
((__t=( title ))==null?'':__t)+
' - '+
((__t=( structure.location.x_city ))==null?'':__t)+
' - '+
((__t=( moneyFormat(price) ))==null?'':__t)+
' - '+
((__t=( size ))==null?'':__t)+
'm&sup2 - luxury property for sale with Housing Japan"\n                style="height: 320px"\n            />\n        </picture>\n        ';
 } else { 
__p+='\n        <div class="cntr-photo-placeholder" style="height: 320px; border: 1px solid #d3d3d3;">\n            <div class="photo-placeholder text-center">\n                <i class="fa fa-2x fa-lock"></i>\n                <p class="mt-3">Contact for more <br />information</p>\n            </div>\n        </div>\n        ';
 } 
__p+='\n    </a>\n    ';
 if (structure.investment && structure.current_rent && structure.current_rent_yield) { 
__p+='\n    <div class="investment-tag--container d-flex d-md-block d-xl-flex">\n        <div class="d-flex">\n            <p class="mr-3 mb-0 investment-tag">\n                Rent: '+
((__t=( moneyFormat(structure.current_rent) ))==null?'':__t)+
'\n            </p>\n            <p class="mr-3 mb-0 investment-tag">\n                Yield: '+
((__t=( structure.current_rent_yield ))==null?'':__t)+
'%\n            </p>\n        </div>\n    </div>\n    ';
 } 
__p+='\n    <div class="property-details d-flex flex-column justify-content-around">\n        <div>\n            <a href="'+
((__t=( buildingUrl ))==null?'':__t)+
'" class="property-url">\n                <p class="property-title h3 m-0 font-weight-normal">\n                    '+
((__t=( title ))==null?'':__t)+
'\n                </p>\n            </a>\n            <p class="property-details__address m-0">'+
((__t=( address ))==null?'':__t)+
'</p>\n        </div>\n        <div class="d-flex d-md-block d-xl-flex">\n            <div class="d-flex">\n                ';
 if (structure.structure_type === 'house' ||
                structure.structure_type === 'unit') { 
__p+='\n                <p class="mr-3 mb-0">'+
((__t=( bedrooms ))==null?'':__t)+
'</p>\n                <p class="mr-3 mb-0">'+
((__t=( bathrooms ))==null?'':__t)+
'</p>\n                ';
 } 
__p+='\n                <p class="mb-0 d-flex align-items-center">\n                    <svg\n                        xmlns="http://www.w3.org/2000/svg"\n                        class="mr-2"\n                        width="18"\n                        height="18"\n                        viewBox="0 0 24 24"\n                    >\n                        <path\n                            fill="none"\n                            stroke="currentColor"\n                            stroke-linecap="round"\n                            stroke-linejoin="round"\n                            stroke-width="1"\n                            d="M19.875 12c.621 0 1.125.512 1.125 1.143v5.714c0 .631-.504 1.143-1.125 1.143H4a1 1 0 0 1-1-1v-5.857C3 12.512 3.504 12 4.125 12h15.75zM9 12v2m-3-2v3m6-3v3m6-3v3m-3-3v2M3 3v4m0-2h18m0-2v4"\n                        />\n                    </svg>\n                    '+
((__t=( size ))==null?'':__t)+
' m&sup2\n                </p>\n            </div>\n        </div>\n\n        <p class="h3 text-primary font-weight-normal m-0">\n            '+
((__t=( moneyFormat(price) ))==null?'':__t)+
'\n        </p>\n    </div>\n</div>\n';
}
return __p;
};


/***/ }),

/***/ "./src/templates/partial.property_info_window.html":
/*!*********************************************************!*\
  !*** ./src/templates/partial.property_info_window.html ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="info-window">\n    <div class="thumbnail">\n        ';
 if (isMembersOnly) { 
__p+='\n        <span class="badge mo-icon pull-left">'+
((__t=( t('private_listing') ))==null?'':__t)+
'</span>\n        ';
 } 
__p+='\n        <a href="'+
((__t=( cardTitleUrl ))==null?'':__t)+
'">\n            ';
 if (coverphoto) { 
__p+='\n            <picture>\n                <source\n                    type="image/webp"\n                    srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=314&h=196&f=webp"\n                />\n                <img src="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=314&h=196&f=jpg" />\n            </picture>\n            ';
 } else { 
__p+='\n            <div class="cntr-photo-placeholder">\n                <div class="photo-placeholder text-center">\n                    <i class="fa fa-2x fa-lock"></i>\n                    <p>Contact for more <br />information</p>\n                </div>\n            </div>\n            ';
 } 
__p+='\n        </a>\n    </div>\n\n    <h2 class="title">\n        <a href="'+
((__t=( cardTitleUrl ))==null?'':__t)+
'">'+
((__t=( title ))==null?'':__t)+
'</a>\n    </h2>\n\n    <p class="address">'+
((__t=( address ))==null?'':__t)+
'</p>\n\n    <table class="table table-sm table-hover">\n        ';
 if (_.isArray(structure.units)) { 
__p+='\n        <thead>\n            <tr>\n                <th>'+
((__t=( t('title_unit') ))==null?'':__t)+
'</th>\n                <th>'+
((__t=( t('title_bedrooms') ))==null?'':__t)+
'</th>\n                <th>'+
((__t=( t('title_bathrooms') ))==null?'':__t)+
'</th>\n                <th>'+
((__t=( t('title_size') ))==null?'':__t)+
'</th>\n                ';
 if (section === 'rent') { 
__p+='\n                <th>'+
((__t=( t('title_rent') ))==null?'':__t)+
'</th>\n                ';
 } else if (section === 'buy') { 
__p+='\n                <th>'+
((__t=( t('title_price') ))==null?'':__t)+
'</th>\n                ';
 } else if (section === 'monthly') { 
__p+='\n                <th>'+
((__t=( t('title_monthly_rate') ))==null?'':__t)+
'</th>\n                ';
 } 
__p+='\n                <th></th>\n            </tr>\n        </thead>\n        <tbody>\n            ';
 for (const unit of structure.units) { 
__p+='\n            <tr>\n                <td>\n                    '+
((__t=( language === 'en' ? unit.room_no : unit.floor_no + 'F'
                    ))==null?'':__t)+
'\n                </td>\n                <td>'+
((__t=( bedroomNo(unit) ))==null?'':__t)+
'</td>\n                <td>'+
((__t=( unit.bathroom_no ))==null?'':__t)+
'</td>\n                <td>\n                    '+
((__t=( getSize(unit) ))==null?'':__t)+
' '+
((__t=( language === 'en' ? 'm&sup2;' : ''
                    ))==null?'':__t)+
'\n                </td>\n                <td class="cost">\n                    '+
((__t=( moneyFormat(getCost(unit), true) ))==null?'':__t)+
' ';
 if
                    (unit.starting_price) { 
__p+='~';
 } 
__p+='\n                </td>\n                <td>\n                    <a\n                        href="'+
((__t=( unitDetailsUrl(structure, unit, section, key) ))==null?'':__t)+
'"\n                        class="btn btn-primary btn-view"\n                        >'+
((__t=( t('view') ))==null?'':__t)+
'</a\n                    >\n                </td>\n            </tr>\n            ';
 } 
__p+='\n        </tbody>\n        ';
 } else if (structure.structure_type === 'house' && structure.unit) {
        
__p+='\n        <thead>\n            <tr>\n                <th>'+
((__t=( t('title_type') ))==null?'':__t)+
'</th>\n                <th>'+
((__t=( t('title_bedrooms') ))==null?'':__t)+
'</th>\n                <th>'+
((__t=( t('title_bathrooms') ))==null?'':__t)+
'</th>\n                <th>'+
((__t=( t('title_size') ))==null?'':__t)+
'</th>\n                ';
 if (section === 'rent') { 
__p+='\n                <th>'+
((__t=( t('title_rent') ))==null?'':__t)+
'</th>\n                ';
 } else if (section === 'buy') { 
__p+='\n                <th>'+
((__t=( t('title_price') ))==null?'':__t)+
'</th>\n                ';
 } else if (section === 'monthly') { 
__p+='\n                <th>'+
((__t=( t('title_monthly_rate') ))==null?'':__t)+
'</th>\n                ';
 } 
__p+='\n                <th></th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td>'+
((__t=( structure_type ))==null?'':__t)+
'</td>\n                <td>'+
((__t=( bedroomNo(structure.unit) ))==null?'':__t)+
'</td>\n                <td>'+
((__t=( structure.bathroom_no ))==null?'':__t)+
'</td>\n                <td>\n                    '+
((__t=( getSize(structure.unit) ))==null?'':__t)+
' '+
((__t=( language === 'en' ?
                    'm&sup2;' : '' ))==null?'':__t)+
'\n                </td>\n                <td class="cost">\n                    '+
((__t=( section === 'rent' ?
                    moneyFormat(getCost(structure.unit)) :
                    moneyFormat(getCost(structure.unit), true) ))==null?'':__t)+
' ';
 if
                    (structure.unit.starting_price) { 
__p+='~';
 } 
__p+='\n                </td>\n                <td>\n                    <a\n                        href="'+
((__t=( unitDetailsUrl(structure, structure.unit, section, key) ))==null?'':__t)+
'"\n                        class="btn btn-primary btn-view"\n                        >'+
((__t=( t('view') ))==null?'':__t)+
'</a\n                    >\n                </td>\n            </tr>\n        </tbody>\n        ';
 } else if (structure.structure_type === 'land') { 
__p+='\n        <thead>\n            <tr>\n                <th>'+
((__t=( t('title_type') ))==null?'':__t)+
'</th>\n                <th>'+
((__t=( t('title_land_size') ))==null?'':__t)+
'</th>\n                ';
 if (section === 'rent') { 
__p+='\n                <th>'+
((__t=( t('title_rent') ))==null?'':__t)+
'</th>\n                ';
 } else if (section === 'buy') { 
__p+='\n                <th>'+
((__t=( t('title_price') ))==null?'':__t)+
'</th>\n                ';
 } else if (section === 'monthly') { 
__p+='\n                <th>'+
((__t=( t('title_monthly_rate') ))==null?'':__t)+
'</th>\n                ';
 } 
__p+='\n                <th></th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td>'+
((__t=( structure_type ))==null?'':__t)+
'</td>\n                <td>\n                    '+
((__t=( getSize(structure) ))==null?'':__t)+
' '+
((__t=( language === 'en' ? 'm&sup2;'
                    : '' ))==null?'':__t)+
'\n                </td>\n                <td class="cost">\n                    '+
((__t=( section === 'rent' ? moneyFormat(getCost(structure)) :
                    moneyFormat(getCost(structure), true) ))==null?'':__t)+
' ';
 if
                    (structure.starting_price) { 
__p+='~';
 } 
__p+='\n                </td>\n                <td>\n                    <a\n                        href="'+
((__t=( buildingUrl(structure, section) ))==null?'':__t)+
'"\n                        class="btn btn-primary btn-view"\n                        >'+
((__t=( t('view') ))==null?'':__t)+
'</a\n                    >\n                </td>\n            </tr>\n        </tbody>\n        ';
 } else { 
__p+='\n        <thead>\n            <tr>\n                <th>'+
((__t=( t('title_type') ))==null?'':__t)+
'</th>\n                <th>'+
((__t=( t('title_building_size') ))==null?'':__t)+
'</th>\n                ';
 if (section === 'rent') { 
__p+='\n                <th>'+
((__t=( t('title_rent') ))==null?'':__t)+
'</th>\n                ';
 } else if (section === 'buy') { 
__p+='\n                <th>'+
((__t=( t('title_price') ))==null?'':__t)+
'</th>\n                ';
 } else if (section === 'monthly') { 
__p+='\n                <th>'+
((__t=( t('title_monthly_rate') ))==null?'':__t)+
'</th>\n                ';
 } 
__p+='\n                <th></th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td>'+
((__t=( structure_type ))==null?'':__t)+
'</td>\n                <td>\n                    '+
((__t=( getSize(structure) ))==null?'':__t)+
' '+
((__t=( language === 'en' ? 'm&sup2;'
                    : '' ))==null?'':__t)+
'\n                </td>\n                <td class="cost">\n                    '+
((__t=( section === 'rent' ? moneyFormat(getCost(structure))
                    : moneyFormat(getCost(structure), true) ))==null?'':__t)+
' ';
 if
                    (structure.starting_price) { 
__p+='~';
 } 
__p+='\n                </td>\n                <td>\n                    <a\n                        href="'+
((__t=( buildingUrl(structure, section) ))==null?'':__t)+
'"\n                        class="btn btn-primary btn-view"\n                        >'+
((__t=( t('view') ))==null?'':__t)+
'</a\n                    >\n                </td>\n            </tr>\n        </tbody>\n        ';
 } 
__p+='\n    </table>\n</div>\n';
}
return __p;
};


/***/ }),

/***/ "./src/templates/partial.property_listing.html":
/*!*****************************************************!*\
  !*** ./src/templates/partial.property_listing.html ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div\n    class="col-12 col-md-6 col-lg-12 col-xxl-6 d-flex flex-column property-listing separator '+
((__t=( featured ? 'featured px-0' : '' ))==null?'':__t)+
'"\n    data-location="'+
((__t=( structure.location.id ))==null?'':__t)+
'"\n    data-structure-type="'+
((__t=( structure.structure_type ))==null?'':__t)+
'"\n>\n    ';
 if (featured) { 
__p+='\n    <div class="heading px-3">'+
((__t=( t('featured') ))==null?'':__t)+
'</div>\n    ';
 } 
__p+='\n    <div class="order-lg-2 '+
((__t=( featured ? 'px-3' : '' ))==null?'':__t)+
'">\n        <div class="thumbnail">\n            <a href="'+
((__t=( cardTitleUrl ))==null?'':__t)+
'">\n                ';
 if (coverphoto) { 
__p+='\n                <picture>\n                    <source\n                        type="image/webp"\n                        media="(min-width: 992px)"\n                        data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=450&h=338&f=webp"\n                    />\n                    <source\n                        type="image/webp"\n                        media="(min-width: 768px)"\n                        data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=690&h=518&f=webp"\n                    />\n                    <source\n                        type="image/webp"\n                        media="(min-width: 576px)"\n                        data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=510&h=383&f=webp"\n                    />\n                    <source type="image/webp" data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=575&h=431&f=webp" />\n                    <source media="(min-width: 992px)" data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=450&h=338&f=jpg" />\n                    <source media="(min-width: 768px)" data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=690&h=518&f=jpg" />\n                    <source media="(min-width: 576px)" data-srcset="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=510&h=383&f=jpg" />\n                    <img\n                        class="lazyload w-100 h-100"\n                        data-src="'+
((__t=( coverphoto ))==null?'':__t)+
'?w=575&h=431&f=jpg"\n                        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"\n                    />\n                </picture>\n                ';
 } else { 
__p+='\n                <div class="cntr-photo-placeholder">\n                    <div class="photo-placeholder text-center">\n                        <i class="fa fa-2x fa-lock"></i>\n                        <p class="mt-3">Contact for more <br />information</p>\n                    </div>\n                </div>\n                ';
 } 
__p+='\n            </a>\n        </div>\n    </div>\n\n    <div class="order-lg-1 '+
((__t=( featured ? 'px-3' : '' ))==null?'':__t)+
'">\n        <h2 class="title mt-3">\n            <a href="'+
((__t=( cardTitleUrl ))==null?'':__t)+
'">'+
((__t=( title ))==null?'':__t)+
'</a>\n        </h2>\n    </div>\n\n    <div class="mt-3 order-lg-3 '+
((__t=( featured ? 'px-3' : '' ))==null?'':__t)+
'">\n        <p class="address">'+
((__t=( address ))==null?'':__t)+
'</p>\n\n        <div class="row">\n            <p class="train-station col-6">\n                <strong>'+
((__t=( t('nearest_station') ))==null?'':__t)+
':</strong><br />\n                '+
((__t=( trainInfo(structure, 0) ))==null?'':__t)+
'<br />\n                '+
((__t=( trainInfo(structure, 1) ))==null?'':__t)+
'\n            </p>\n\n            ';
 if (structure.structure_type === 'building' || structure.structure_type === 'house') { 
__p+='\n            <p class="year-built col-6"><strong>'+
((__t=( t('year_built') ))==null?'':__t)+
':</strong> '+
((__t=( structure.completion_year ))==null?'':__t)+
'</p>\n            ';
 } else if (structure.structure_type === 'land') { 
__p+='\n            <p class="land-right col-6"><strong>'+
((__t=( t('Land right') ))==null?'':__t)+
':</strong> '+
((__t=( structure.x_land_right ))==null?'':__t)+
'</p>\n            ';
 } 
__p+='\n        </div>\n    </div>\n\n    <div class="order-lg-4 '+
((__t=( featured ? 'px-3' : '' ))==null?'':__t)+
'">\n        <table class="table table-sm table-hover">\n            ';
 if (structure.structure_type === 'building' && _.isArray(structure.units)) { 
__p+='\n            <thead>\n                <tr>\n                    <th>'+
((__t=( t('title_unit') ))==null?'':__t)+
'</th>\n                    <th>'+
((__t=( t('title_bedrooms') ))==null?'':__t)+
'</th>\n                    <th>'+
((__t=( t('title_bathrooms') ))==null?'':__t)+
'</th>\n                    <th>'+
((__t=( t('title_size') ))==null?'':__t)+
'</th>\n                    ';
 if (section === 'rent') { 
__p+='\n                    <th>'+
((__t=( t('title_rent') ))==null?'':__t)+
'</th>\n                    ';
 } else if (section === 'buy') { 
__p+='\n                    <th>'+
((__t=( t('title_price') ))==null?'':__t)+
'</th>\n                    ';
 } else if (section === 'short-term') { 
__p+='\n                    <th>'+
((__t=( t('title_monthly_rate') ))==null?'':__t)+
'</th>\n                    ';
 } 
__p+='\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                ';
 for (const unit of structure.units) { 
__p+='\n                <tr>\n                    ';
 if (section === 'short-term') { 
__p+='\n                    <td>'+
((__t=( unit.room_no ))==null?'':__t)+
'</td>\n                    ';
 } else { 
__p+='\n                    <td>'+
((__t=( language === 'en' ? unit.room_no : unit.floor_no + 'F' ))==null?'':__t)+
'</td>\n                    ';
 } 
__p+='\n                    <td>'+
((__t=( bedroomNo(unit) ))==null?'':__t)+
'</td>\n                    <td>'+
((__t=( unit.bathroom_no ))==null?'':__t)+
'</td>\n                    <td>'+
((__t=( getSize(unit) ))==null?'':__t)+
' '+
((__t=( language === 'en' ? 'm&sup2;' : '' ))==null?'':__t)+
'</td>\n                    <td class="cost">\n                        '+
((__t=( section === 'rent' ? moneyFormat(getCost(unit)) : moneyFormat(getCost(unit), true) ))==null?'':__t)+
' ';
 if
                        (unit.starting_price) { 
__p+='~';
 } 
__p+='\n                    </td>\n                    <td>\n                        <a\n                            href="'+
((__t=( unitDetailsUrl(structure, unit, section, key) ))==null?'':__t)+
'"\n                            class="btn text-uppercase btn-primary btn-view"\n                            >'+
((__t=( t('view') ))==null?'':__t)+
'</a\n                        >\n                    </td>\n                </tr>\n                ';
 } 
__p+='\n            </tbody>\n            ';
 } else if (structure.structure_type === 'house' && structure.unit) { 
__p+='\n            <thead>\n                <tr>\n                    <th>'+
((__t=( t('title_type') ))==null?'':__t)+
'</th>\n                    <th>'+
((__t=( t('title_bedrooms') ))==null?'':__t)+
'</th>\n                    <th>'+
((__t=( t('title_bathrooms') ))==null?'':__t)+
'</th>\n                    <th>'+
((__t=( t('title_size') ))==null?'':__t)+
'</th>\n                    ';
 if (section === 'rent') { 
__p+='\n                    <th>'+
((__t=( t('title_rent') ))==null?'':__t)+
'</th>\n                    ';
 } else if (section === 'buy') { 
__p+='\n                    <th>'+
((__t=( t('title_price') ))==null?'':__t)+
'</th>\n                    ';
 } else if (section === 'short-term') { 
__p+='\n                    <th>'+
((__t=( t('title_monthly_rate') ))==null?'':__t)+
'</th>\n                    ';
 } 
__p+='\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td>'+
((__t=( structure_type ))==null?'':__t)+
'</td>\n                    <td>'+
((__t=( bedroomNo(structure.unit) ))==null?'':__t)+
'</td>\n                    <td>'+
((__t=( structure.unit.bathroom_no ))==null?'':__t)+
'</td>\n                    <td>'+
((__t=( getSize(structure.unit) ))==null?'':__t)+
' '+
((__t=( language === 'en' ? 'm&sup2;' : '' ))==null?'':__t)+
'</td>\n                    <td class="cost">\n                        '+
((__t=( section === 'rent' ? moneyFormat(getCost(structure.unit)) :
                        moneyFormat(getCost(structure.unit), true) ))==null?'':__t)+
' ';
 if (structure.unit.starting_price) { 
__p+='~';
 } 
__p+='\n                    </td>\n                    <td>\n                        <a\n                            href="'+
((__t=( unitDetailsUrl(structure, structure.unit, section, key) ))==null?'':__t)+
'"\n                            class="btn text-uppercase btn-primary btn-view"\n                            >'+
((__t=( t('view') ))==null?'':__t)+
'</a\n                        >\n                    </td>\n                </tr>\n            </tbody>\n            ';
 } else if (structure.structure_type === 'land') { 
__p+='\n            <thead>\n                <tr>\n                    <th>'+
((__t=( t('title_type') ))==null?'':__t)+
'</th>\n                    <th>'+
((__t=( t('title_land_size') ))==null?'':__t)+
'</th>\n                    ';
 if (section === 'rent') { 
__p+='\n                    <th>'+
((__t=( t('title_rent') ))==null?'':__t)+
'</th>\n                    ';
 } else if (section === 'buy') { 
__p+='\n                    <th>'+
((__t=( t('title_price') ))==null?'':__t)+
'</th>\n                    ';
 } else if (section === 'short-term') { 
__p+='\n                    <th>'+
((__t=( t('title_monthly_rate') ))==null?'':__t)+
'</th>\n                    ';
 } 
__p+='\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td>'+
((__t=( structure_type ))==null?'':__t)+
'</td>\n                    <td>'+
((__t=( getSize(structure) ))==null?'':__t)+
' '+
((__t=( language === 'en' ? 'm&sup2;' : '' ))==null?'':__t)+
'</td>\n                    <td class="cost">\n                        '+
((__t=( section === 'rent' ? moneyFormat(getCost(structure)) : moneyFormat(getCost(structure), true)
                        ))==null?'':__t)+
' ';
 if (structure.starting_price) { 
__p+='~';
 } 
__p+='\n                    </td>\n                    <td>\n                        <a\n                            href="'+
((__t=( structureDetailsUrl(structure, section, key) ))==null?'':__t)+
'"\n                            class="btn text-uppercase btn-primary btn-view"\n                            >'+
((__t=( t('view') ))==null?'':__t)+
'</a\n                        >\n                    </td>\n                </tr>\n            </tbody>\n            ';
 } else if (structure.structure_type === 'building') { 
__p+='\n            <thead>\n                <tr>\n                    <th>'+
((__t=( t('title_type') ))==null?'':__t)+
'</th>\n                    <th>'+
((__t=( t('title_building_size') ))==null?'':__t)+
'</th>\n                    ';
 if (section === 'rent') { 
__p+='\n                    <th>'+
((__t=( t('title_rent') ))==null?'':__t)+
'</th>\n                    ';
 } else if (section === 'buy') { 
__p+='\n                    <th>'+
((__t=( t('title_price') ))==null?'':__t)+
'</th>\n                    ';
 } else if (section === 'short-term') { 
__p+='\n                    <th>'+
((__t=( t('title_monthly_rate') ))==null?'':__t)+
'</th>\n                    ';
 } 
__p+='\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td>'+
((__t=( structure_type ))==null?'':__t)+
'</td>\n                    <td>'+
((__t=( getSize(structure) ))==null?'':__t)+
' '+
((__t=( language === 'en' ? 'm&sup2;' : '' ))==null?'':__t)+
'</td>\n                    <td class="cost">\n                        '+
((__t=( section === 'rent' ? moneyFormat(getCost(structure)) : moneyFormat(getCost(structure), true)
                        ))==null?'':__t)+
' ';
 if (structure.starting_price) { 
__p+='~';
 } 
__p+='\n                    </td>\n                    <td>\n                        <a\n                            href="'+
((__t=( structureDetailsUrl(structure, section, key) ))==null?'':__t)+
'"\n                            class="btn text-uppercase btn-primary btn-view"\n                            >'+
((__t=( t('view') ))==null?'':__t)+
'</a\n                        >\n                    </td>\n                </tr>\n            </tbody>\n            ';
 } else { console.warn('Malformed property: ', structure); } 
__p+='\n        </table>\n    </div>\n</div>\n';
}
return __p;
};


/***/ }),

/***/ "./src/templates/partial.search.expired.html":
/*!***************************************************!*\
  !*** ./src/templates/partial.search.expired.html ***!
  \***************************************************/
/***/ ((module) => {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="search-expired text-center">\n	<h1><i class="fa fa-clock-o"></i></h1>\n	<h2>'+
((__t=( t('search_expired') ))==null?'':__t)+
'</h2>\n	<p>'+
((__t=( t('search_expired_message') ))==null?'':__t)+
'</p>\n</div>';
}
return __p;
};


/***/ }),

/***/ "./src/templates/partial.search.no_results.html":
/*!******************************************************!*\
  !*** ./src/templates/partial.search.no_results.html ***!
  \******************************************************/
/***/ ((module) => {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="no-results text-center w-100">\n	<h1><i class="fa fa-meh-o"></i></h1>\n	<h2>'+
((__t=( t('search_no_result') ))==null?'':__t)+
'</h2>\n	<p>'+
((__t=( t('search_no_result_message') ))==null?'':__t)+
'</p>\n</div>';
}
return __p;
};


/***/ }),

/***/ "./src/templates/partial.station_item.html":
/*!*************************************************!*\
  !*** ./src/templates/partial.station_item.html ***!
  \*************************************************/
/***/ ((module) => {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+=''+
((__t=( name ))==null?'':__t)+
'<i class="fa fa-close" data-action="close"></i>';
}
return __p;
};


/***/ }),

/***/ "HJ":
/*!*********************!*\
  !*** external "HJ" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = HJ;

/***/ }),

/***/ "backbone":
/*!***************************!*\
  !*** external "Backbone" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = Backbone;

/***/ }),

/***/ "bloodhound":
/*!*****************************!*\
  !*** external "Bloodhound" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = Bloodhound;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = jQuery;

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = moment;

/***/ }),

/***/ "nprogress":
/*!****************************!*\
  !*** external "NProgress" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = NProgress;

/***/ }),

/***/ "underscore":
/*!********************!*\
  !*** external "_" ***!
  \********************/
/***/ ((module) => {

"use strict";
module.exports = _;

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/js/hj.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @googlemaps/js-api-loader */ "./node_modules/.pnpm/@googlemaps+js-api-loader@2.0.1/node_modules/@googlemaps/js-api-loader/dist/index.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/js/config.js");
/* harmony import */ var _inquiry_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inquiry/form */ "./src/js/inquiry/form.js");
/* harmony import */ var _listing_gallery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./listing-gallery */ "./src/js/listing-gallery.js");
/* harmony import */ var _newsletterform__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./newsletterform */ "./src/js/newsletterform.js");
/* harmony import */ var _property_infinite_search__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./property/infinite-search */ "./src/js/property/infinite-search.js");
/* harmony import */ var _property_landing_search__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./property/landing-search */ "./src/js/property/landing-search.js");
/* harmony import */ var _property_minisearch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./property/minisearch */ "./src/js/property/minisearch.js");
/* harmony import */ var _property_page_view__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./property/page-view */ "./src/js/property/page-view.js");
/* harmony import */ var _property_search__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./property/search */ "./src/js/property/search.js");











// Define global HJ object
window.HJ = window.HJ || {};

// Define global HJ config and assign theme config
window.HJ.Config = window.HJ.Config || {};
Object.assign(window.HJ.Config, _config__WEBPACK_IMPORTED_MODULE_1__["default"]);

// Set Google Maps API loader options
(0,_googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__.setOptions)({
  key: window.HJ.Config.gmaps_api_key,
  region: window.HJ.Config.language
});

// Define global HJ views and assign theme views
window.HJ.Views = window.HJ.Views || {};
Object.assign(window.HJ.Views, {
  InquiryForm: _inquiry_form__WEBPACK_IMPORTED_MODULE_2__["default"],
  MiniSearch: _property_minisearch__WEBPACK_IMPORTED_MODULE_7__["default"],
  LandingSearch: _property_landing_search__WEBPACK_IMPORTED_MODULE_6__["default"],
  NewsletterForm: _newsletterform__WEBPACK_IMPORTED_MODULE_4__["default"],
  PropertySearch: _property_search__WEBPACK_IMPORTED_MODULE_9__["default"],
  InfinitePropertySearch: _property_infinite_search__WEBPACK_IMPORTED_MODULE_5__["default"],
  ListingGallery: _listing_gallery__WEBPACK_IMPORTED_MODULE_3__["default"]
});

// Define global HJ utils
window.HJ.Utils = window.HJ.Utils || {};
Object.assign(window.HJ.Utils, {
  PropertyDetailsViewTracker: _property_page_view__WEBPACK_IMPORTED_MODULE_8__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=hj.js.map