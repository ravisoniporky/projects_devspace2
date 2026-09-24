sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], (Controller, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    // Each entry is one hypothesis to test for why the scanner doesn't respond.
    // The Scan button cycles through these one at a time (see onSoftwareScanPress),
    // so a single deployed build can be used to test all of them without redeploying.
    var A_STRATEGIES = [
        { api: "EB", propertyMap: { allDecoders: true } },
        { api: "EB", propertyMap: { allDecoders: true, aimType: "presentation" } },
        { api: "EB", propertyMap: { allDecoders: true, aimType: "continuousRead" } },
        { api: "EB", propertyMap: { code128: true, code39: true, ean13: true, ean8: true, upca: true, upce: true } },
        { api: "Rho", propertyMap: {} }
    ];

    return Controller.extend("customer.porky.zmatverapp.controller.View1", {
        onInit: function () {
            // On-screen log so we can see what's happening on devices without a dev console
            this._oLogModel = new JSONModel({ text: "" });
            this.getView().setModel(this._oLogModel, "logModel");

            // Context binding for the persistent scan callback
            this._oScanHandler = this.onScanCallback.bind(this);

            this._iStrategyIndex = -1;

            this._log("onInit");
        },

        _log: function (sMessage) {
            var sTimestamp = new Date().toISOString().substr(11, 12);
            var sLine = "[" + sTimestamp + "] " + sMessage;

            var sExisting = this._oLogModel.getProperty("/text");
            this._oLogModel.setProperty("/text", sExisting ? sExisting + "\n" + sLine : sLine);
        },

        onClearLog: function () {
            this._oLogModel.setProperty("/text", "");
        },

        // Whatever the Rho/EB API throws is not always a standard Error - capture its full shape
        _describeError: function (e) {
            var aParts = [];
            aParts.push("typeof=" + typeof e);
            try {
                aParts.push("String()=" + String(e));
            } catch { /* ignore */ }
            if (e && typeof e === "object") {
                aParts.push("keys=" + Object.keys(e).join(","));
                try {
                    aParts.push("JSON=" + JSON.stringify(e));
                } catch { /* not serializable */ }
            }
            return aParts.join(" | ");
        },

        onAfterRendering: function () {
            this._log("Environment: document.hasFocus=" + document.hasFocus() +
                " visibilityState=" + document.visibilityState +
                " | window.EB=" + !!window.EB + " window.EB.Barcode=" + !!(window.EB && window.EB.Barcode) +
                " | window.Rho=" + !!window.Rho + " window.Rho.Barcode=" + !!(window.Rho && window.Rho.Barcode));
            this._log("Tap Scan to run strategy 1/" + A_STRATEGIES.length + " (repeated taps cycle through all strategies)");
        },

        /**
         * Disables the currently active barcode object (if any) so a new strategy
         * can be enabled cleanly, without leftover state from a previous attempt.
         */
        _disableCurrent: function () {
            if (this._oBarcode && typeof this._oBarcode.disable === "function") {
                try {
                    this._oBarcode.disable(() => {});
                    this._log("Disabled previous barcode session");
                } catch (e) {
                    this._log("disable() threw (ignored): " + this._describeError(e));
                }
            }
            this._oBarcode = null;
        },

        /**
         * Resolves a strategy's declared API ("EB" or "Rho") to the actual object to call,
         * instantiating Rho.Barcode only if it turns out to be a real constructor and not
         * already a ready-to-use namespace.
         */
        _resolveApi: function (sApi) {
            if (sApi === "EB") {
                return window.EB && window.EB.Barcode ? window.EB.Barcode : null;
            }
            var RhoBarcode = window.Rho && window.Rho.Barcode;
            if (!RhoBarcode) {
                return null;
            }
            if (typeof RhoBarcode === "function") {
                try {
                    var oInstance = new RhoBarcode();
                    if (oInstance && typeof oInstance.enable === "function" && typeof oInstance.start === "function") {
                        return oInstance;
                    }
                } catch { /* fall through to static namespace */ }
            }
            return RhoBarcode;
        },

        /**
         * Triggered by an on-screen SAPUI5 Button (press="onSoftwareScanPress").
         * Each press advances to the next strategy in A_STRATEGIES, enables the
         * scanner with that strategy's config, then calls start(). Elapsed time from
         * start() to the callback firing distinguishes an instant rejection (config/
         * permission problem) from a real scan attempt (hardware waiting for a beam).
         */
        onSoftwareScanPress: function () {
            this._iStrategyIndex = (this._iStrategyIndex + 1) % A_STRATEGIES.length;
            var oStrategy = A_STRATEGIES[this._iStrategyIndex];
            this._log("=== Strategy " + (this._iStrategyIndex + 1) + "/" + A_STRATEGIES.length +
                ": api=" + oStrategy.api + " propertyMap=" + JSON.stringify(oStrategy.propertyMap) + " ===");

            this._disableCurrent();

            var oApi = this._resolveApi(oStrategy.api);
            if (!oApi) {
                this._log(oStrategy.api + " API not available on this device - skipping, tap Scan again for next strategy");
                MessageBox.warning(oStrategy.api + " API not available. Tap Scan again to try the next option.");
                return;
            }

            try {
                this._log("typeof enable=" + typeof oApi.enable + " start=" + typeof oApi.start + " disable=" + typeof oApi.disable);

                if (oStrategy.api === "EB") {
                    oApi.enable(oStrategy.propertyMap, this._oScanHandler);
                } else {
                    // Legacy Rho signature: enable(properties, persistentCallback, persistentCallbackParams, valueCallback)
                    oApi.enable(oStrategy.propertyMap, this._oScanHandler, "", (oResult) => {
                        this._log("Rho enable() valueCallback: " + JSON.stringify(oResult));
                    });
                }
                this._oBarcode = oApi;
                this._log("enable() issued");

                this._dStartCallTime = Date.now();
                if (oStrategy.api === "EB") {
                    oApi.start(this._oScanHandler);
                } else {
                    oApi.start();
                }
                this._log("start() called - waiting for callback");
            } catch (e) {
                this._log("EXCEPTION in strategy " + (this._iStrategyIndex + 1) + ": " + this._describeError(e));
                MessageBox.error("Strategy " + (this._iStrategyIndex + 1) + " threw - see log. Tap Scan again for next strategy.");
            }
        },

        /**
         * Callback triggered whenever a barcode is scanned (Hardware trigger or Software start)
         */
        onScanCallback: function (oResult) {
            var iElapsed = this._dStartCallTime ? (Date.now() - this._dStartCallTime) : null;
            this._log("onScanCallback fired (" + (iElapsed !== null ? iElapsed + "ms after start()" : "not from start()") +
                "): " + JSON.stringify(oResult));

            if (oResult && oResult.data) {
                var sScannedData = oResult.data;

                var oInput = this.byId("barcodeInput");
                if (oInput) {
                    oInput.setValue(sScannedData);
                }

                MessageBox.success("Scanned with strategy " + (this._iStrategyIndex + 1) + ": " + sScannedData);
            } else if (iElapsed !== null && iElapsed < 100) {
                this._log("Instant null (<100ms) - this strategy was rejected immediately, not a real scan attempt");
            } else {
                this._log("Scan failed or canceled - no data in result.");
            }
        },

        onExit: function () {
            this._log("onExit");
            // Clean up hardware resources when navigating away to prevent memory leaks
            this._disableCurrent();
        }
    });
});
