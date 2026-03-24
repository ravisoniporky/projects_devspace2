sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    var sServiceUrl = "/sap/opu/odata/sap/ZODATA_MATVERIFY_SRV/";
    var sUploadUrl  = sServiceUrl + "VerifyImagesSet";

    function uploadFile(oFile, sSlug) {
        // Step 1: fetch CSRF token
        var oXhrToken = new XMLHttpRequest();
        oXhrToken.open("GET", sServiceUrl, true);
        oXhrToken.setRequestHeader("x-csrf-token", "Fetch");
        oXhrToken.onload = function() {
            var sToken = oXhrToken.getResponseHeader("x-csrf-token");

            // Step 2: read file and POST
            var oReader = new FileReader();
            oReader.onload = function(oEvent) {
                var oXhr = new XMLHttpRequest();
                oXhr.open("POST", sUploadUrl, true);
                oXhr.setRequestHeader("x-csrf-token", sToken);
                oXhr.setRequestHeader("Slug", sSlug);
                oXhr.setRequestHeader("Content-Type", oFile.type || "application/octet-stream");
                oXhr.onload = function() {
                    if (oXhr.status >= 200 && oXhr.status < 300) {
                        MessageToast.show("Photo uploaded successfully");
                    } else {
                        MessageToast.show("Upload failed: " + oXhr.status);
                    }
                };
                oXhr.onerror = function() {
                    MessageToast.show("Upload error");
                };
                oXhr.send(oEvent.target.result);
            };
            oReader.readAsArrayBuffer(oFile);
        };
        oXhrToken.send();
    }

    return {
        onUploadPhoto: function(oContext) {
            var sProduct = oContext.getProperty("Product").padStart(18, "0");
            var sBaseUnit = oContext.getProperty("BaseUnit");
            var sPlant    = oContext.getProperty("Plant");
            var sSlug     = sProduct + ";" + sBaseUnit + ";" + sPlant;

            var oInput = document.createElement("input");
            oInput.type = "file";
            oInput.accept = "image/*";
            oInput.onchange = function(oEvent) {
                var oFile = oEvent.target.files[0];
                if (oFile) {
                    uploadFile(oFile, sSlug);
                }
            };
            oInput.click();
        }
    };
});
