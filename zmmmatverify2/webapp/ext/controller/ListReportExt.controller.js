sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ndc/BarcodeScanner"
], function(MessageToast, Filter, FilterOperator, BarcodeScanner) {
    'use strict';

    return {
        barcode2: function(oEvent) {
            this.onScanBarcode()
        },


          onScanBarcode: function () {
            BarcodeScanner.scan(
                this.onScanSuccess.bind(this),
                this.onScanError.bind(this),
                this.onScanLiveupdate.bind(this)
            );
        },

        onScanSuccess: function (mResult) {
            if (mResult.cancelled) {
                MessageToast.show("Scan cancelled", { duration: 1000 });
                return;
            }

            var sBarcode = mResult.text;
            if (!sBarcode) {
                MessageToast.show("No barcode text received", { duration: 1000 });
                return;
            }

            var oModel = this.getOwnerComponent().getModel();// ZODATA_MATVERIFY_SRV  "uri": "/sap/opu/odata/sap/ZODATA_MATVERIFY_SRV/",
            var sServiceUrl = "/sap/opu/odata/sap/ZODATA_MATVERIFY_SRV/";

            // Create the new model instance
            var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);

            var sPath = "/ZBARCODESet('" + sBarcode + "')";
            var oView = this.getView();

            oModel.read(sPath, {
                success: function (oData) {
                    var sEan = oData.Ean;
                    MessageToast.show("EAN: " + sEan, { duration: 3000 });

                    oModel.read("/ZI_ProductEan", {
                        filters: [new Filter("EAN", FilterOperator.EQ, sEan)],
                        success: function (oEanData) {
                            var aItems = oEanData.results.map(function (oItem) {
                                return { key: oItem.Product };
                            });

                            var oFilterData = { Product: { items: aItems } };

                            var oSmartFilterBar = oView.byId("listReportFilter");
                            var oSmartTable = oView.byId("listReport");

                            oSmartFilterBar.setFilterData(oFilterData);
                            oSmartTable.rebindTable();
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
        },

        onScanError: function (oEvent) {
            MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
        },

        onScanLiveupdate: function () {
            // User can implement validation about the scanned value,
       
    }
    }
});
