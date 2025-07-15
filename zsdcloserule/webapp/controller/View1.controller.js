sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zsdcloserule.controller.View1", {
        onInit: function () {

        },

        OnDeleteRule: function(oEvent){

            var ruleid = oEvent.getSource().getParent().getParent().getTable().getSelectedItem().getBindingContext().getObject().zrule            ;
            this.deleteRule(ruleid);
        },

        deleteRule: function(ruleid){

            ruleid = ruleid+"";
            let defaultModel1 = this.getOwnerComponent().getModel();

            defaultModel1.create("/setdeletionH",{}, {
                urlParameters: {
                    "zrule": "'"+ruleid+"'",
        
                  },
                success: function (oData, oResponse) {
                  // var plant = oData.results.find(element => element.parid === "WRK");
                 // var oDataResults = oData;
                  debugger;
  
                  if(oData.Success === ''){
  
                      sap.m.MessageBox.error(oData.Errormessage);
                      return;
                  }else{
                  //    sap.m.MessageBox.success("Changes are saved successfully");
                 that.getView().getModel("customerData").setProperty("/"+oData.Blockfield.toLowerCase(),oData.Blockvalout);
  
                  }
                  
      
        
      
                },
      
                error: function (oError) {
  
                      debugger;
                  sap.m.MessageBox("There is error")
      
                  that.getView().setModel(new sap.ui.model.json.JSONModel({}, "lowestValuePO"));
                }
              });
        },

        onItemPress: function(oEvent){


            var rule = oEvent.mParameters.listItem.getBindingContext().getObject().zrule;

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("CloseRuleMaint", {
                rule: rule
            });

        }

    });
});
