sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    'use strict';

    // TODO: replace with the real default plant code for this app, or swap this
    // constant out later if a proper Plant source becomes available on
    // ZC_MaterialVerifyOneNote (it currently has no Plant field at all).
    var DEFAULT_PLANT = "3000";

    var S_SERVICE_BASE = "/sap/opu/odata/sap/ZODATA_MATVERIFY_SRV/";

    var Extension = {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        addPhotosToMatApp: function (oContext, aSelectedContexts) {
            if (!oContext) {
                MessageToast.show("No record context available.");
                return;
            }

            var oData = oContext.getObject();
            var sMatnr = oData.Matnr;
            var sImageitem = oData.Imageitem;
            var bIsActive = oData.IsActiveEntity;

            if (!sMatnr || sImageitem === undefined || sImageitem === null) {
                MessageToast.show("Missing key fields (Matnr/Imageitem) on this record.");
                return;
            }

            // Product is already zero-padded to 18 digits in the source data (see
            // screenshot: "000000000000051660") - use as-is rather than re-padding,
            // since re-padding an already-padded value would double the leading zeros.
            var sProduct = String(sMatnr);
            var sBaseUnit = oData.WeightUnit || "";
            var sBarcode = oData.BarcodeValue || "NO BARCODE";
            // eslint-disable-next-line no-nested-ternary
            var sSlug = (sProduct ? sProduct.length !== 18 ? sProduct.padStart(18, "0") : sProduct : "") + ";" + (sBaseUnit ? sBaseUnit : "CS") + ";" + DEFAULT_PLANT + ";" + sBarcode;

            Extension._fetchAttachmentStream(oContext, sMatnr, sImageitem, bIsActive)
                .then(function (oStreamResult) {
                    return Extension._uploadBinary(oStreamResult.buffer, oStreamResult.contentType, sSlug, "VerifyImagesLabelSet");
                })
                .then(function () {
                    MessageToast.show("Photo copied to Verification successfully.");
                })
                .catch(function (oError) {
                    MessageBox.error("Copy failed: " + (oError && oError.message ? oError.message : oError));
                });
        },

        onUploadLabelButtonPress: function () {
            var oData = this._oVerifyDialog.getModel("verifyModel").getData();
            var sBarcode = oData.barcode;
            if (!sBarcode) { MessageToast.show("Barcode is required."); return; }

            var sProduct = String(this._sVerifyProduct || "").padStart(18, "0");
            var sBaseUnit = oData.unitOfMeasure;
            var sPlant = this._sVerifyPlant || "";
            var sSlug = sProduct + ";" + sBaseUnit + ";" + sPlant + ";" + sBarcode;

            var oInput = document.createElement("input");
            oInput.type = "file";
            oInput.accept = "image/*";
            oInput.onchange = function (oEvt) {
                var oFile = oEvt.target.files && oEvt.target.files[0];
                if (!oFile) {
                    return;
                }

                var oReader = new FileReader();
                oReader.onload = function (oLoadEvt) {
                    Extension._uploadBinary(oLoadEvt.target.result, oFile.type || "application/octet-stream", sSlug, "VerifyImagesLabelSet")
                        .then(function () {
                            MessageToast.show("Label uploaded successfully.");
                            this._loadLabelImage();
                        }.bind(this))
                        .catch(function (oError) {
                            MessageBox.error("Upload failed: " + (oError && oError.message ? oError.message : oError));
                        });
                }.bind(this);
                oReader.onerror = function () { MessageBox.error("Could not read file."); };
                oReader.readAsArrayBuffer(oFile);
            }.bind(this);
            oInput.click();
        },

        /**
         * Fetches the V4 Attachment media stream for a ZC_MaterialVerifyOneNote row as
         * raw binary. Built directly from the record's own key fields rather than
         * assuming any particular base URL, so this works regardless of which system/
         * client the extension is running against.
         */
        _fetchAttachmentStream: function (oContext, sMatnr, sImageitem, bIsActive) {
            var oModel = oContext.getModel();
            var sServiceUrl = oModel.getServiceUrl ? oModel.getServiceUrl() : oModel.sServiceUrl;

            var sKeyPredicate = "Matnr='" + encodeURIComponent(sMatnr) + "',Imageitem=" + sImageitem +
                ",IsActiveEntity=" + (bIsActive ? "true" : "false");
            var sStreamUrl = sServiceUrl.replace(/\/$/, "") + "/ZC_MaterialVerifyOneNote(" + sKeyPredicate + ")/Attachment";

            return fetch(sStreamUrl, { credentials: "same-origin" })
                .then(function (oResponse) {
                    if (!oResponse.ok) {
                        throw new Error("Could not fetch source image (" + oResponse.status + ").");
                    }
                    var sContentType = oResponse.headers.get("Content-Type") || "application/octet-stream";
                    return oResponse.arrayBuffer().then(function (oBuffer) {
                        return { buffer: oBuffer, contentType: sContentType };
                    });
                });
        },

        /**
         * Shared V2 media-entity upload: fetches a CSRF token against the service root,
         * then POSTs the given binary (an ArrayBuffer) to the given entity set with the
         * required Slug header. Used both by the manual file-picker upload
         * (onUploadLabelButtonPress) and the copy-from-V4 flow (addPhotosToMatApp), so
         * both paths share one implementation instead of duplicating XHR wiring.
         */
        _uploadBinary: function (oArrayBuffer, sContentType, sSlug, sEntitySet) {
            var sUploadUrl = S_SERVICE_BASE + sEntitySet;

            return new Promise(function (resolve, reject) {
                var oXhrToken = new XMLHttpRequest();
                oXhrToken.open("GET", S_SERVICE_BASE, true);
                oXhrToken.setRequestHeader("x-csrf-token", "Fetch");
                oXhrToken.onload = function () {
                    var sToken = oXhrToken.getResponseHeader("x-csrf-token");
                    if (!sToken) {
                        reject(new Error("Unable to fetch CSRF token."));
                        return;
                    }

                    var oXhr = new XMLHttpRequest();
                    oXhr.open("POST", sUploadUrl, true);
                    oXhr.setRequestHeader("x-csrf-token", sToken);
                    oXhr.setRequestHeader("Slug", sSlug);
                    oXhr.setRequestHeader("Content-Type", sContentType || "application/octet-stream");
                    oXhr.onload = function () {
                        if (oXhr.status >= 200 && oXhr.status < 300) {
                            resolve();
                        } else {
                            reject(new Error("Upload failed (" + oXhr.status + ")."));
                        }
                    };
                    oXhr.onerror = function () { reject(new Error("Upload error.")); };
                    oXhr.send(oArrayBuffer);
                };
                oXhrToken.onerror = function () { reject(new Error("Failed to connect to upload service.")); };
                oXhrToken.send();
            });
        }
    };

    return Extension;
});