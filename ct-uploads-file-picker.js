import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";

import { clDefaultTemplate } from "cl-polymer-element-helpers/cl-default-template.js";
import { clDefaultStyle } from "cl-polymer-element-helpers/cl-default-style.js";

import "cl-polymer-element-helpers/ct-element-style.js";

import { __decorate, query, symbolIterator } from "cl-polymer-element-helpers/cl-helpers.js";
import { property, computed, observe, customElement } from "@polymer/decorators";

import { clPolymerButton } from "cl-polymer-button/cl-polymer-button.js";

import { ctUploadsFilePickerAnimation } from "ct-uploads-file-picker-animation/ct-uploads-file-picker-animation.js";

const WXb = function(a, b, c) {
    return a.call.apply(a.bind, arguments)
};

const XXb = function(a, b, c) {
    if (!a)
        throw Error();
    if (2 < arguments.length) {
        var e = Array.prototype.slice.call(arguments, 2);
        return function() {
            var h = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(h, e);
            return a.apply(b, h)
        }
    }
    return function() {
        return a.apply(b, arguments)
    }
};

let Nd = function(a, b, c) {
    Nd = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? WXb : XXb;
    return Nd.apply(null, arguments)
};

var D7c = function(a) {
    this.name_ = a;
    this.files_ = [];
    this.directories_ = [];
    this.directoryMap_ = {}
};

D7c.prototype.getDirectory = function(a) {
    return this.directoryMap_[a]
};

D7c.prototype.getName = function() {
    return this.name_
};

var G7c = function(a, b) {
    this.callback_ = b;
    this.hasError_ = !1;
    this.unscannedDirectories_ = [];
    this.maxConcurrentScans_ = 5;
    this.fileOps_ = this.directoryOps_ = 0;
    this.rootDirectory_ = new D7c("");
    E7c(this, a, this.rootDirectory_);
    F7c(this)
}, 
E7c = function(a, b, c) {
    for (var e = 0; e < b.length; e++) {
        var h = b[e];
        h.isFile ? (a.fileOps_++,
        h.file((0,
        Nd)(a.handleFileSuccess_, a, c), (0,
        Nd)(a.handleFileError_, a))) : a.unscannedDirectories_.push(new H7c(h,c))
    }
}, 
F7c = function(a) {
    if (0 < a.unscannedDirectories_.length && a.directoryOps_ < a.maxConcurrentScans_ && !a.hasError_) {
        a.directoryOps_++;
        var b = a.unscannedDirectories_.shift()
          , c = b.entry
          , e = new D7c(c.name);
        b = b.parent;
        b.directoryMap_[e.getName()] = e;
        b.directories_.push(e);
        c = c.createReader();
        c.readEntries((0,
        Nd)(a.handleDirectorySuccess_, a, c, e), (0,
        Nd)(a.handleDirectoryError_, a))
    }
    0 != a.directoryOps_ || 0 != a.fileOps_ || 0 != a.unscannedDirectories_.length && !a.hasError_ || a.callback_(a.rootDirectory_.files_, a.rootDirectory_.directories_, a.hasError_)
};
G7c.prototype.handleDirectorySuccess_ = function(a, b, c) {
    E7c(this, c, b);
    0 == c.length ? (this.directoryOps_--,
    F7c(this)) : a.readEntries((0,
    Nd)(this.handleDirectorySuccess_, this, a, b), (0,
    Nd)(this.handleDirectoryError_, this))
}
;
G7c.prototype.handleDirectoryError_ = function() {
    this.hasError_ = !0;
    this.directoryOps_--;
    F7c(this)
}
;
G7c.prototype.handleFileSuccess_ = function(a, b) {
    a.files_.push(b);
    this.fileOps_--;
    F7c(this)
}
;
G7c.prototype.handleFileError_ = function() {
    this.hasError_ = !0;
    this.fileOps_--;
    F7c(this)
}
;
var H7c = function(a, b) {
    this.entry = a;
    this.parent = b
};

/**/
let HO = {
    TOO_MANY_FILES: {
        shortMessage: "",
        detailMessage: "You cannot upload more than 1000 files at a time"
    },
    INVALID_FILETYPE: {
        shortMessage: "",
        detailMessage: ""
    }
};

const Psb = function( filename, type, allowedFileTypes, useType ) {
    "string" === typeof allowedFileTypes && ( allowedFileTypes = allowedFileTypes.split(",") );

    void 0 === useType && ( useType = true );
    if ( useType )
        return allowedFileTypes.includes(String(type));

    let fileExtension = filename.lastIndexOf(".");
    return 0 <= fileExtension ? (filename = filename.substr(fileExtension + 1).toLowerCase().trim(),
    allowedFileTypes.includes(filename)) : false;
};

let swc = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

const $D = function() {
    for (var a = Array(36), b = 0, c, e = 0; 36 > e; e++)
        8 == e || 13 == e || 18 == e || 23 == e ? a[e] = "-" : 14 == e ? a[e] = "4" : (2 >= b && (b = 33554432 + 16777216 * Math.random() | 0),
        c = b & 15,
        b >>= 4,
        a[e] = swc[19 == e ? c & 3 | 8 : c]);
    return a.join("")
};

class frontendIdGenerator {
    constructor ( idLabel ) {
        this.idLabel = void 0 === idLabel ? "frontend_id_generated" : idLabel;
        this.reset();
    }

    next () {
        let sessionId = this.sessionId, 
        nextIndex = this.nextIndex++;
        return this.idLabel + ":" + sessionId + ":" + nextIndex
    }

    reset () {
        this.sessionId = $D();
        this.nextIndex = 0
    }
}

let ctUploadsFilePickerTemplate;
let ctUploadsFilePickerTemplateDefault;
let ctUploadsFilePickerBase = mixinBehaviors([], PolymerElement);
class ctUploadsFilePicker extends ctUploadsFilePickerBase {
    constructor () {
        super();
        this.disabled = false;
        this.dragEnterCounter = 0;
        this.labelMessage = "Drag and drop files to upload";
        this.sublabelMessage = "";
        this.selectFileButtonLabel = "Select files";
        this.maxFilesUploadPerChunk = 30;
        this.frontendIdGenerator = new frontendIdGenerator;
    }

    connectedCallback () {
        super.connectedCallback();
        this.addEventListener("drop", this.onDrop.bind(this));
        this.addEventListener("dragenter", this.onDragEnter.bind(this));
        this.addEventListener("dragover", this.onDragover.bind(this));
        this.addEventListener("dragleave", this.onDragLeave.bind(this));
        this.fire("attached")
    }

    disconnectedCallback () {
        super.disconnectedCallback();
        this.removeEventListener("drop", this.onDrop.bind(this));
        this.removeEventListener("dragenter", this.onDragEnter.bind(this));
        this.removeEventListener("dragover", this.onDragover.bind(this));
        this.removeEventListener("dragleave", this.onDragLeave.bind(this));
    }

    onDrop ( event ) {
        event.preventDefault();
        let base = this,
        data = event.dataTransfer;
        data && data.files && !this.disabled && this.onFilesSelected(data.files, true);
    }

    onDragEnter ( event ) {
        event.preventDefault();
        this.dragEnterCounter++;
        !this.disabled && 0 < this.dragEnterCounter && (this.animation.state = "drag-in")
    }
    
    onDragover ( event ) {
        event.preventDefault();
    }

    onDragLeave ( event ) {
        event.preventDefault();
        this.dragEnterCounter--;
        !this.disabled && 0 >= this.dragEnterCounter && (this.animation.state = "drag-out")
    }
    
    onSelectFilesButtonTap () {
        this.disabled || this.inputFileSelector.click();
    }

    onFileSelectionChange ( event ) {
        this.onFilesSelected(event.target.files, false)
    }

    onFilesSelected (files, uploadType ) {
        let base = this;
        setTimeout(function() {
            let fileSelector;
            null == (fileSelector = base.fileSelector) || fileSelector.hideOverlay()
        }, 0);

        this.error = void 0;
        this.dragEnterCounter = 0;
        files = Array.from(files || []).filter(function(file) {
            return !!file
        });
        if (0 !== files.length) {
            this.frontendIdGenerator.reset();
            uploadType = 1 < files.length ? "UPLOAD_INTENT_TYPE_BULK" : uploadType ? "UPLOAD_INTENT_TYPE_DRAG_AND_DROP" : "UPLOAD_INTENT_TYPE_FILE_SELECTED";
            let filesByFrontendId = {}, 
            frontendIdsForInvalidFiles = [], 
            error,
            filesIterator = symbolIterator(files);

            for ( let file = filesIterator.next(); !file.done; file = filesIterator.next() ) {
                file = file.value;
                let fileId = this.frontendIdGenerator.next();
                files.length > this.maxFilesUploadPerChunk ? error = HO.TOO_MANY_FILES : Psb(file.name, file.type, this.acceptFileTypes) ? filesByFrontendId[fileId] = file : (
                1 < files.length ? frontendIdsForInvalidFiles.push(fileId) : error = HO.INVALID_FILETYPE);
            }

            error ? (this.animation.state = "idle",
            this.disabled = false,
            this.error = error) : (this.onUploadStart(),
            window.setTimeout(function() {
                base.onFileCreated();
                window.setTimeout(function () {
                    base.fire("ct-files-selected", {
                        filesByFrontendId,
                        frontendIdsForInvalidFiles
                    });

                    window.setTimeout(function () {
                        base.onUploadDone();
                    }, 200);
                }, 867);
            }, 1500));
        }
    }
    
    onUploadStart () {
        this.animation.state = "launch";
        this.disabled = true
    }
    
    onUploadDone () {
        this.animation.state = "idle";
        this.disabled = false
    }

    onFileCreated () {
        this.animation.state = "fly-out"
    }
    
    setError () {
        /*var a, b, c = $x(null != (b = null == (a = this.error) ? void 0 : a.detailsHtml) ? b : "");
        _g.pc(this.errorMessage, c)*/
    }
    
    get hasError () {
        return !!this.error
    }

    get errorDetailsFormattedString () {
        let error;
        return null == (error = this.error) ? void 0 : error.detailsFormattedString
    }

  	static get template() {
    	if ( void 0 === ctUploadsFilePickerTemplate || null === ctUploadsFilePickerTemplate) {
            
            let template = document.createElement("template");
            template.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                    color: var(--ct-primary-text-color);
                } 

                #content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 370px;
                    padding: 16px 50px 0;
                } 

                ct-uploads-file-picker-animation {
                    margin-top: auto;
                } 

                .label {
                    font-family: var(--ct-primary-font-family);
                    font-weight: 400;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    font-size: 15px;
                    line-height: 24px;
                    margin-top: 23px;
                } 

                .sublabel {
                    font-family: var(--ct-primary-font-family);
                    font-weight: 400;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    font-size: 13px;
                    line-height: 20px;
                    color: var(--ct-secondary-text-color);
                    margin-top: 2px;
                } 

                :host([disabled]) .label,
                :host([disabled]) .disclaimer {
                    color: var(--ct-text-disabled);
                } 

                :host(:not([disabled])) ct-uploads-file-picker-animation {
                    cursor: pointer;
                } 

                #select-files-button {
                    margin-top: 26px;
                    margin-bottom: auto;
                } 

                .disclaimer {
                    font-family: var(--ct-primary-font-family);
                    font-weight: 400;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    letter-spacing: 0.011em;
                    font-size: 12px;
                    line-height: 16px;
                    color: var(--ct-secondary-text-color);
                    text-align: center;
                    line-height: 24px;
                } 

                .disclaimer:last-of-type {
                    margin-bottom: 4px;
                } 

                .error-area {
                    display: none;
                    margin-top: 18px;
                } 

                :host([has-error]) .error-area {
                    display: flex;
                } 

                .error-area iron-icon {
                    color: var(--ct-primary-error-color);
                    margin-right: 12px;
                } 

                .error-details {
                    font-family: var(--ct-primary-font-family);
                    font-weight: 400;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    font-size: 13px;
                    line-height: 20px;
                } 

                .link-placeholder {
                    color: var(--ct-call-to-action);
                    text-decoration: none;
                } 
            </style>
            <div id="content">
                <ct-uploads-file-picker-animation id="animation" on-tap="onSelectFilesButtonTap"></ct-uploads-file-picker-animation>
                <p class="label">[[labelMessage]]</p>
                <p class="sublabel">[[sublabelMessage]]</p>
                <div class="error-area">
                    <iron-icon class="warning-icon" compact="" icon="icons:warning"></iron-icon>
                    <div class="error-details" id="error-message">[[errorDetailsFormattedString]]</div>
                </div>
                <cl-polymer-button id="select-files-button" disabled="[[disabled]]" label="[[selectFileButtonLabel]]" type="filled" on-tap="onSelectFilesButtonTap"></cl-polymer-button>
                
                <p class="disclaimer" id="disclaimer-html" hidden=""></p>
                <p class="disclaimer" hidden="">
                    <template is="dom-if" restamp="" if="[[legalNotice]]">
                        <span>[[legalNotice]]</span>
                    </template>
                    <span>[[messages.doNotViolateCopyright]]</span>
                    <a href="[[copyrightUrl]]" target="_blank">Learn more</a>
                </p>
            </div>
            <input id="input-file-selector" accept$="[[acceptFileTypes]]" hidden="" type="file" on-change="onFileSelectionChange" onclick="this.value=null;" multiple$="[[multiple]]">
            `;
            template.content.insertBefore(clDefaultStyle().content.cloneNode(true), template.content.firstChild);
            let templateContent = template.content;
            let templateInsertBefore = templateContent.insertBefore;
            let defaultTemplate;
            if (void 0 == ctUploadsFilePickerTemplateDefault || null == ctUploadsFilePickerTemplateDefault) {
                defaultTemplate = clDefaultTemplate();
                ctUploadsFilePickerTemplateDefault = defaultTemplate
            }
            defaultTemplate = ctUploadsFilePickerTemplateDefault;
            templateInsertBefore.call(templateContent, defaultTemplate.content.cloneNode(true), template.content.firstChild);

            return ctUploadsFilePickerTemplate = template;
        }

        return ctUploadsFilePickerTemplate;
  	}
}


ctUploadsFilePicker.prototype.setError = ctUploadsFilePicker.prototype.setError;

__decorate(
    [
        property({ type: clPolymerButton }),
        query("#select-files-button")
    ], 
    ctUploadsFilePicker.prototype, 
    "fileSelectButton", 
    void 0
);

__decorate(
    [
        property({ type: HTMLInputElement }),
        query("#input-file-selector")
    ], 
    ctUploadsFilePicker.prototype, 
    "inputFileSelector", 
    void 0
);

__decorate(
    [
        property({ type:  Boolean, reflectToAttribute: true })
    ], 
    ctUploadsFilePicker.prototype, 
    "disabled", 
    void 0
);

__decorate(
    [
        property({ type: String })
    ], 
    ctUploadsFilePicker.prototype, 
    "acceptFileTypes", 
    void 0
);

__decorate(
    [
        property({ type: Number })
    ], 
    ctUploadsFilePicker.prototype, 
    "maxFilesUploadPerChunk", 
    void 0
);

__decorate(
    [
        property({ type: Object })
    ], 
    ctUploadsFilePicker.prototype, 
    "error", 
    void 0
);

__decorate(
    [
        property({ type: Boolean, reflectToAttribute: true }),
        computed("error")
    ], 
    ctUploadsFilePicker.prototype, 
    "hasError", 
    null
);

__decorate(
    [
        property({ type: String })
    ], 
    ctUploadsFilePicker.prototype, 
    "labelMessage", 
    void 0
);

__decorate(
    [
        property({ type: String })
    ], 
    ctUploadsFilePicker.prototype, 
    "sublabelMessage", 
    void 0
);

__decorate(
    [
        property({ type: String })
    ], 
    ctUploadsFilePicker.prototype, 
    "selectFileButtonLabel", 
    void 0
);

__decorate(
    [
        property({ type: ctUploadsFilePickerAnimation }),
        query("#animation")
    ], 
    ctUploadsFilePicker.prototype, 
    "animation", 
    void 0
);

__decorate(
    [
        property({ type: Function }),
        observe("error")
    ], 
    ctUploadsFilePicker.prototype, 
    "setError", 
    null
);

__decorate(
    [
        property({ type: String }),
        computed("error")
    ], 
    ctUploadsFilePicker.prototype, 
    "errorDetailsFormattedString", 
    null
);

__decorate(
    [
        property({ type: Boolean, reflectToAttribute: true })
    ], 
    ctUploadsFilePicker.prototype, 
    "multiple", 
    void 0
);

ctUploadsFilePicker = __decorate([
    customElement("ct-uploads-file-picker")
], ctUploadsFilePicker);

export { ctUploadsFilePicker };