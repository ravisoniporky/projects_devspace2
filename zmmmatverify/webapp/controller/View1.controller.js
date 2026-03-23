sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("customer.porky.zmmmatverify.controller.View1", {
        onInit: function () {

        },

        onScanBarcode: function () {

        },

        onScanSuccess: function (oEvent) {
            if (oEvent.getParameter("cancelled")) {
                MessageToast.show("Scan cancelled", { duration: 1000 });
                return;
            }

            var sBarcode = oEvent.getParameter("text");
            if (!sBarcode) {
                MessageToast.show("No barcode text received", { duration: 1000 });
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/ZBARCODESet('" + sBarcode + "')";

            var oView = this.getView();

            oModel.read(sPath, {
                success: function (oData) {
                    var sEan = oData.Ean;
                    MessageToast.show("EAN: " + sEan, { duration: 3000 });

                    // Query ZI_ProductEan to get materials linked to this EAN
                    oModel.read("/ZI_ProductEan", {
                        filters: [new Filter("EAN", FilterOperator.EQ, sEan)],
                        success: function (oEanData) {
                            var aItems = oEanData.results.map(function (oItem) {
                                return { key: oItem.Product };
                            });

                            var oFilterData = { Product: { items: aItems } };

                            var oSmartFilterBar = oView.byId("smartFilter_visitF4");
                            var oSmartTable = oView.byId("smartTable_visitF4");

                            oSmartFilterBar.setFilterData(oFilterData);
                                
                            oSmartTable.rebindTable();
                        },
                        error: function (_oError) {
                            MessageToast.show("Error fetching products for EAN", { duration: 2000 });
                        }
                    });
                },
                error: function (_oError) {
                    MessageToast.show("Error reading barcode data", { duration: 2000 });
                }
            });
        },

        onSmartTableInit: function () {
            var oInnerTable = this.byId("smartTable_visitF4").getTable();
            oInnerTable.attachUpdateFinished(function () {
                oInnerTable.getItems().forEach(function (oItem) {
                    oItem.setType("Navigation");
                });
            });
            oInnerTable.attachItemPress(this.onProductRowPress.bind(this));
        },

        onProductRowPress: function (oEvent) {
            var oObject = oEvent.getParameter("listItem").getBindingContext().getObject();
            var sProduct = oObject.Product;
            var sDraftUUID = oObject.DraftUUID;
            var bIsActiveEntity = true;

            var sAppRoute = "&/C_Product(Product='" + sProduct + "',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=" + bIsActiveEntity + ")";

            sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
                target: { semanticObject: "Material", action: "manage" },
                appSpecificRoute: sAppRoute
            });
        },

        onScanError: function (oEvent) {
            MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
        },

        onScanLiveupdate: function (_oEvent) {
            // User can implement the validation about inputting value
        },
    });
});
