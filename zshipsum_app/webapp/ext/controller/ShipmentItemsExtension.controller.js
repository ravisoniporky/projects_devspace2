sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/model/odata/v4/ODataUtils",
    "sap/ui/core/Component",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType"
], function (ControllerExtension, ODataUtils, Component, Filter, FilterOperator, FilterType) {
    "use strict";

    var SEARCHABLE_FIELDS = ["Stop", "Delivery", "ShipToParty", "Shiptoname", "Shiptostreet", "Shiptocity"];

    return ControllerExtension.extend("customer.porky.zshipsumapp.ext.controller.ShipmentItemsExtension", {
        onShipmentItemsSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oInnerTable = this.base.getView().byId("shipmentItemsFilterableTable-content");

            if (!oInnerTable) {
                return;
            }

            var oBinding = oInnerTable.getBinding("rows") || oInnerTable.getBinding("items");

            if (!oBinding) {
                return;
            }

            if (!sQuery) {
                oBinding.filter([], FilterType.Application);
                return;
            }

            var aFieldFilters = SEARCHABLE_FIELDS.map(function (sField) {
                return new Filter(sField, FilterOperator.Contains, sQuery);
            });

            oBinding.filter(new Filter({ filters: aFieldFilters, and: false }), FilterType.Application);
        },

        onShipmentItemRowPress: function (oEvent) {
            var oRowContext = oEvent.getParameter("bindingContext");

            if (!oRowContext) {
                return;
            }

            var sShipment = oRowContext.getProperty("Shipment");
            var sTransportPlanningPoint = oRowContext.getProperty("TransportPlanningPoint");
            var sStop = oRowContext.getProperty("Stop");

            var oHeaderContext = this.base.getView().getBindingContext();
            var oListBinding = oHeaderContext.getModel().bindList("_ShipmentItem", oHeaderContext, undefined, undefined, {
                $select: "Shipment,TransportPlanningPoint,Stop,Delivery",
                $filter: this._buildFilter({
                    Shipment: sShipment,
                    TransportPlanningPoint: sTransportPlanningPoint,
                    Stop: sStop
                })
            });

            var that = this;

            oListBinding.requestContexts(0, 1).then(function (aContexts) {
                if (!aContexts.length) {
                    return;
                }

                var oItem = aContexts[0].getObject();

                var sKey = that._buildKeyPredicate({
                    Shipment: oItem.Shipment,
                    TransportPlanningPoint: oItem.TransportPlanningPoint
                });

                var sKey2 = that._buildKeyPredicate({
                    Shipment: oItem.Shipment,
                    TransportPlanningPoint: oItem.TransportPlanningPoint,
                    Stop: oItem.Stop,
                    Delivery: oItem.Delivery
                });

                that._getAppComponent().getRouter().navTo("ZC_ShipmentBlotter_ItemObjectPage", {
                    key: sKey,
                    key2: sKey2
                });
            });
        },

        _getAppComponent: function () {
            var oComponent = Component.getOwnerComponentFor(this.base.getView());

            while (oComponent && Component.getOwnerComponentFor(oComponent)) {
                oComponent = Component.getOwnerComponentFor(oComponent);
            }

            return oComponent;
        },

        _buildFilter: function (oValues) {
            return Object.keys(oValues).map(function (sProperty) {
                return sProperty + " eq " + ODataUtils.formatLiteral(oValues[sProperty], "Edm.String");
            }).join(" and ");
        },

        _buildKeyPredicate: function (oKeyValues) {
            return Object.keys(oKeyValues).map(function (sProperty) {
                return sProperty + "=" + ODataUtils.formatLiteral(oKeyValues[sProperty], "Edm.String");
            }).join(",");
        }
    });
});
