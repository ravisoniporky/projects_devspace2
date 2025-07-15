sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zmmmatlist.controller.View1", {
        onInit: function () {

           
            var that = this;
             setTimeout(() => {
               var filterData = {"Plant":{"value":that.getOwnerComponent().oComponentData.startupParameters.Plant[0],"ranges":[]}};
                that.getView().byId("sm_matlist").setFilterData(filterData);

                var filterData = {"SalesOrganization":{"value":that.getOwnerComponent().oComponentData.startupParameters.SalesOrganization[0],"ranges":[]}};
                that.getView().byId("sm_matlist").setFilterData(filterData);
  
             }, 1000);
        },

        onRowSelectionChange: function(oEvent){
          //  debugger;

            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service

            var salesorg = oEvent.mParameters.rowContext.getObject().SalesOrganization;
            var material = oEvent.mParameters.rowContext.getObject().Material
            var plant = oEvent.mParameters.rowContext.getObject().Plant

            var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
            target: {
            semanticObject: "ZMATDASH",
            action: "ZOVP"
            },
            params: {
            "SalesOrganization": salesorg,
            "Material": material,
            "Plant": plant
            }
            })) || ""; // generate the Hash to display a Supplier
            oCrossAppNavigator.toExternal({
            target: {
            shellHash: hash
            }
            }); // navigate to Supplier application
        }
    });
});
