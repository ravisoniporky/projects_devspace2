sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zsdcloserule.controller.View1", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.getRoute("CloseRuleMaint").attachMatched(this._onRouteMatched, this);

        },

        onBeforeRebindTable: function(oEvent){
            var binding = oEvent.getParameter("bindingParams");

            var oFilter = new sap.ui.model.Filter("Zrule", sap.ui.model.FilterOperator.EQ,this.rule);
            binding.filters.push(oFilter);
        },

        _onRouteMatched: function (oEvent) {

            this.rule = oEvent.mParameters.arguments.rule;
           // debugger;
        }
    });
});
