sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ndc/BarcodeScanner",
    "sap/ui/mdc/p13n/StateUtil"
], function(MessageToast, Filter, FilterOperator, BarcodeScanner, StateUtil) {
    'use strict';

    function onScanSuccess(oController, mResult) {
        if (mResult.cancelled) {
            MessageToast.show("Scan cancelled", { duration: 1000 });
            return;
        }

        var sBarcode = mResult.text;
        if (!sBarcode) {
            MessageToast.show("No barcode text received", { duration: 1000 });
            return;
        }

        var sServiceUrl = "/sap/opu/odata/sap/ZODATA_MATVERIFY_SRV/";
        var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);
        var sPath = "/ZBARCODESet('" + sBarcode + "')";
        var oView = oController._view;

        oModel.read(sPath, {
            success: function (oData) {
                var sEan = oData.Ean;
                MessageToast.show("EAN: " + sEan, { duration: 3000 });

                oModel.read("/ZI_ProductEan", {
                    filters: [new Filter("EAN", FilterOperator.EQ, sEan)],
                    success: function (oEanData) {
                        var aProducts = oEanData.results.map(function (oItem) {
                            return oItem.Product;
                        });

                        var oFilterBar = oView.findAggregatedObjects(true, function(o) {
                            return o.isA("sap.ui.mdc.FilterBar");
                        })[0];

                        if (oFilterBar) {
                            StateUtil.applyExternalState(oFilterBar, {
                                filter: {
                                    "Product": aProducts.map(function (sProduct) {
                                        return { operator: "EQ", values: [sProduct] };
                                    })
                                }
                            }).then(function () {
                                oFilterBar.triggerSearch();
                            });
                        }
                    },
                    error: function () {
                        MessageToast.show("Error fetching products for EAN", { duration: 2000 });
                    }
                });
            },
            error: function () {
                MessageToast.show("Error reading barcode data", { duration: 2000 });
            }
        });
    }

    return {
        onScanBarcode: function(oContext, aSelectedContexts) {
            var oController = this;
            BarcodeScanner.scan(
                function(mResult) { onScanSuccess(oController, mResult); },
                function(oEvent) { MessageToast.show("Scan failed: " + oEvent, { duration: 1000 }); },
                function() { /* live update */ }
            );
        }
    };
});
