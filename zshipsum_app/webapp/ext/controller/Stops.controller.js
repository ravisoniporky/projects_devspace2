sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Component",
    "sap/ui/model/odata/v4/ODataUtils"
], function (Controller, JSONModel, Component, ODataUtils) {
    "use strict";

    return Controller.extend("customer.porky.zshipsumapp.ext.controller.Stops", {

        onInit: function () {
            this.getView().setModel(new JSONModel({ stops: [] }), "stopsModel");
            this.getView().attachModelContextChange(this._onContextChange, this);
        },

        _onContextChange: function () {
            var oContext = this.getView().getBindingContext();

            if (!oContext) {
                return;
            }

            var oItemsBinding = oContext.getModel().bindList("_ShipmentItem", oContext, undefined, undefined, {
                $select: "Shipment,TransportPlanningPoint,Stop,Delivery,ShipToParty,Shiptoname,Shiptostreet,Shiptocity,Shiptotelephone,Shiptopostalcode,ActualCases,ActualEaches,ActualOthers,NetWeight"
            });

            oItemsBinding.requestContexts(0, 1000).then(function (aContexts) {
                var aItems = aContexts.map(function (oItemContext) {
                    return oItemContext.getObject();
                });

                this.getView().getModel("stopsModel").setData({
                    stops: this._groupByStop(aItems)
                });
            }.bind(this));
        },

        _groupByStop: function (aItems) {
            var mStops = {};

            aItems.forEach(function (oItem) {
                var sStop = oItem.Stop;

                if (!mStops[sStop]) {
                    mStops[sStop] = {
                        stop: sStop,
                        text: "Stop " + sStop,
                        count: 0,
                        items: []
                    };
                }

                mStops[sStop].count++;
                mStops[sStop].items.push(oItem);
            });

            return Object.keys(mStops).map(function (sKey) {
                return mStops[sKey];
            }).sort(function (oA, oB) {
                return parseInt(oA.stop, 10) - parseInt(oB.stop, 10);
            });
        },

        onItemPress: function (oEvent) {
            var oItem = oEvent.getSource().getBindingContext("stopsModel").getObject();

            var sKey = this._buildKeyPredicate({
                Shipment: oItem.Shipment,
                TransportPlanningPoint: oItem.TransportPlanningPoint
            });

            var sKey2 = this._buildKeyPredicate({
                Shipment: oItem.Shipment,
                TransportPlanningPoint: oItem.TransportPlanningPoint,
                Stop: oItem.Stop,
                Delivery: oItem.Delivery
            });

            this._getAppComponent().getRouter().navTo("ZC_ShipmentBlotter_ItemObjectPage", {
                key: sKey,
                key2: sKey2
            });
        },

        _buildKeyPredicate: function (oKeyValues) {
            return Object.keys(oKeyValues).map(function (sProperty) {
                return sProperty + "=" + ODataUtils.formatLiteral(oKeyValues[sProperty], "Edm.String");
            }).join(",");
        },

        _getAppComponent: function () {
            var oComponent = Component.getOwnerComponentFor(this.getView());

            while (oComponent && Component.getOwnerComponentFor(oComponent)) {
                oComponent = Component.getOwnerComponentFor(oComponent);
            }

            return oComponent;
        }
    });
});
