/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// This file replaces `index.js` in bundlers like webpack or Rollup,

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in the production bundle.
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    typeof crypto === 'undefined'
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
        'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
        'For secure IDs, import `react-native-get-random-values` ' +
        'before Nano ID.'
    )
  }
  if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
    throw new Error(
      'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
        ' before importing Nano ID to fix IE 11 support'
    )
  }
  if (typeof crypto === 'undefined') {
    throw new Error(
      'Your browser does not have secure random generator. ' +
        'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

let nanoid = (size = 21) => {
  let id = '';
  let bytes = crypto.getRandomValues(new Uint8Array(size));

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63;
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36);
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte < 63) {
      id += '_';
    } else {
      id += '-';
    }
  }
  return id
};

const pluginName = "obsidian-gist";
const obsidianAppOrigin = 'app://obsidian.md';
class GistProcessor {
    constructor(settings) {
        this.messageEventHandler = (messageEvent) => {
            if (messageEvent.origin !== 'null') {
                // a message received from the iFrame with `srcdoc` attribute, the `origin` will be `null`.
                return;
            }
            const sender = messageEvent.data.sender;
            // only process message coming from this plugin
            if (sender === pluginName) {
                const gistUUID = messageEvent.data.gistUUID;
                const contentHeight = messageEvent.data.contentHeight;
                const gistContainer = document.querySelector('iframe#' + gistUUID);
                gistContainer.setAttribute('height', contentHeight);
            }
        };
        this.processor = (sourceString, el) => __awaiter(this, void 0, void 0, function* () {
            const gists = sourceString.trim().split("\n");
            return Promise.all(gists.map((gist) => __awaiter(this, void 0, void 0, function* () {
                return this._processGist(el, gist);
            })));
        });
        this.settings = settings;
    }
    // private
    _processGist(el, gistString) {
        return __awaiter(this, void 0, void 0, function* () {
            const pattern = /(?<protocol>https?:\/\/)?(?<host>gist\.github\.com\/)?((?<username>\w+)\/)?(?<gistID>\w+)(\#(?<filename>.+))?/;
            const matchResult = gistString.match(pattern).groups;
            const gistID = matchResult.gistID;
            if (gistID === undefined) {
                return this._showError(el, gistString, `Could not found a valid Gist ID, please make sure your content and format is correct.`);
            }
            let gistURL = `https://gist.github.com/${gistID}.json`;
            if (matchResult.filename !== undefined) {
                gistURL = `${gistURL}?file=${matchResult.filename}`;
            }
            try {
                const response = yield fetch(gistURL);
                if (response.ok) {
                    const gistJSON = yield response.json();
                    return this._insertGistElement(el, gistID, gistJSON);
                }
                else {
                    return this._showError(el, gistString, `Could not fetch the Gist info from GitHub server. (Code: ${response.status})`);
                }
            }
            catch (error) {
                return this._showError(el, gistString, `Could not fetch the Gist from GitHub server. (Error: ${error})`);
            }
        });
    }
    _insertGistElement(el, gistID, gistJSON) {
        return __awaiter(this, void 0, void 0, function* () {
            // generate an uuid for each gist element
            const gistUUID = `${pluginName}-${gistID}-${nanoid()}`;
            // container
            const container = document.createElement('iframe');
            container.id = gistUUID;
            container.classList.add(`${pluginName}-container`);
            container.setAttribute('sandbox', 'allow-scripts allow-top-navigation-by-user-activation');
            container.setAttribute('loading', 'lazy');
            // reset the default things on HTML
            const resetStylesheet = `
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
        }
      </style>
    `;
            // height adjustment script
            const heightAdjustmentScript = `
      <script>
        deliverHeightMessage = () => {
          const contentHeight = document.body.scrollHeight;

          top.postMessage({
            sender: '${pluginName}',
            gistUUID: '${gistUUID}',
            contentHeight: contentHeight
          }, '${obsidianAppOrigin}');
        }

        window.addEventListener('load', () => {
          deliverHeightMessage();
        })
      </script>
    `;
            // build stylesheet link
            const stylesheetLink = document.createElement('link');
            stylesheetLink.rel = "stylesheet";
            stylesheetLink.href = gistJSON.stylesheet;
            // hack to make links open in the parent 
            const parentLinkHack = document.createElement('base');
            parentLinkHack.target = "_parent";
            // custom stylesheet
            let customStylesheet = "";
            if (this.settings.styleSheet && this.settings.styleSheet.length > 0) {
                customStylesheet = this.settings.styleSheet;
            }
            // Inject content into the iframe
            container.srcdoc = `
      <html>
        <head>
          <!-- hack -->
          ${resetStylesheet}
          ${parentLinkHack.outerHTML}
          ${heightAdjustmentScript}

          <!-- gist style -->
          ${stylesheetLink.outerHTML}

          <!-- custom style -->
          <style>
            ${customStylesheet}
          </style>
        </head>

        <body>
          ${gistJSON.div}
        </body>
      </html>
    `;
            // insert container into the DOM
            el.appendChild(container);
        });
    }
    _showError(el, gistIDAndFilename, errorMessage = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = `
Failed to load the Gist (${gistIDAndFilename}).

Error:

  ${errorMessage}
    `.trim();
            el.createEl('pre', { text: errorText });
        });
    }
}

const DEFAULT_SETTINGS = {
    styleSheet: null
};
class GistPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            // Settings
            yield this.loadSettings();
            this.addSettingTab(new GistSettingTab(this.app, this));
            // Load the Gist processor
            const gistProcessor = new GistProcessor(this.settings);
            // Register the processor to Obsidian
            this.registerDomEvent(window, "message", gistProcessor.messageEventHandler);
            this.registerMarkdownCodeBlockProcessor("gist", gistProcessor.processor);
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
class GistSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Gist Plugin.' });
        new obsidian.Setting(containerEl)
            .setName('Custom Stylesheet')
            .setDesc('Override the default stylesheet')
            .addTextArea(text => text
            .setPlaceholder('Paste your custom stylesheet here')
            .setValue(this.plugin.settings.styleSheet)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.styleSheet = value;
            yield this.plugin.saveSettings();
        })));
    }
}

module.exports = GistPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5vZGVfbW9kdWxlcy9uYW5vaWQvaW5kZXguYnJvd3Nlci5qcyIsInNyYy9naXN0X3Byb2Nlc3Nvci50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW4iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxP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
