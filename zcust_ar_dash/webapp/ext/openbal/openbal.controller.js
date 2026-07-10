(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {

                var that = this;

                this._handleRequestCompleted = function(oEvent) {
                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_CONTACTS")) return;

                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH") && !oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_ARBAL")) {
                        var sUrl = decodeURI(oEvent.mParameters.url);
                        if (!sUrl.includes("$filter=")) { return; }

                        var sRawFilter = sUrl.split("$filter=")[1].split("&")[0];
                        var aFilterParts = [];
                        var oMatch;

                        oMatch = sRawFilter.match(/CompanyCode\s+eq\s+'([^']+)'/);
                        if (oMatch) { aFilterParts.push("CompanyCode eq '" + oMatch[1] + "'"); }

                        oMatch = sRawFilter.match(/Customer\s+eq\s+'([^']+)'/);
                        if (oMatch) { aFilterParts.push("Customer eq '" + oMatch[1] + "'"); }

                        oMatch = sRawFilter.match(/ProfitCenter\s+eq\s+'([^']+)'/);
                        if (oMatch) { aFilterParts.push("ProfitCenter eq '" + oMatch[1] + "'"); }

                        if (aFilterParts.length === 0) { return; }

                        var filters = aFilterParts.join(" and ");
                        var defaultModel1 = that.getOwnerComponent().getModel();

                        defaultModel1.read("/ZCFI_CUSTARDASH_ARBAL", {
                            urlParameters: { "$filter": filters },
                            success: function (oData) {
                                that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]), "customerData1");
                            },
                            error: function () {
                                that.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerData1");
                            }
                        });
                    }
                };

                this.GloabalEventBus = sap.ui.getCore().getEventBus();
                this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", this.onGlobalfilterApply.bind(this));

            },

               onGlobalfilterApply: function(sChannelId, sEventId, oGlobalFilter){ // eslint-disable-line no-unused-vars

                var that = this;
                var oFilterData = {};

                try {
                    oFilterData = oGlobalFilter && oGlobalFilter.getFilterData ? oGlobalFilter.getFilterData() : {};
                } catch (e) {
                    return;
                }

                var aFilterParts = [];

                if (oFilterData.CompanyCode && oFilterData.CompanyCode.items && oFilterData.CompanyCode.items.length > 0) {
                    aFilterParts.push("CompanyCode eq '" + oFilterData.CompanyCode.items[0].key + "'");
                }
                if (oFilterData.Customer && oFilterData.Customer.items && oFilterData.Customer.items.length > 0) {
                    aFilterParts.push("Customer eq '" + oFilterData.Customer.items[0].key + "'");
                }
                if (oFilterData.ProfitCenter && oFilterData.ProfitCenter.items && oFilterData.ProfitCenter.items.length > 0) {
                    aFilterParts.push("ProfitCenter eq '" + oFilterData.ProfitCenter.items[0].key + "'");
                }

                if (aFilterParts.length === 0) { return; }

                var sFilter = aFilterParts.join(" and ");
                var defaultModel1 = that.getOwnerComponent().getModel();

                defaultModel1.read("/ZCFI_CUSTARDASH_ARBAL", {
                  urlParameters: {
                    "$filter": sFilter
                  },
                  success: function (oData) {
                    that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]), "customerData1");
                  },
                  error: function () {
                    that.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerData1");
                  }
                });

               },

            onAfterRendering: function () {
                if(!this._handlerAttached && this.getModel()) {
                    this.getModel().attachRequestCompleted(this._handleRequestCompleted);
                    this._handlerAttached = true;
                }
            },

            onExit: function () {},
            setRelevantFilters: function (oFilters) {
                var oView = this.getView().byId("cardView");
                                if(oView)

                if (oFilters[0] && oFilters[0].aFilters && oFilters[0].aFilters.length > 0) {
                    // Apply filters to the card
                    oView.getBinding("items").filter(oFilters);
                } else {
                    oView.getBinding("items").filter([]);
                }
            },
            onClickHeader: function(){
                var mParams = {

                    "DD_KUNNR" : this.getView().getModel("customerData1").getData().Customer,
                    "DD_BUKRS": this.getView().getModel("customerData1").getData().CompanyCode


                };

                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                    oService.hrefForExternalAsync({
                        target: {
                            semanticObject: "Launch_Tcodes",
                            action: "tcode_fbl5n"
                        },
                        params: mParams
                    }).then(function (sHref) {
                        oService.toExternal({
                            target: {
                                shellHash: sHref
                            }
                        });
                    });

                });
            }
        }
    });
})();
