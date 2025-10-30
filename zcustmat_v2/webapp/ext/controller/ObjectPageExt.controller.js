sap.ui.define([
    "sap/m/MessageToast",
    	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function(MessageToast,Filter,FilterOperator,JSONModel) {
    'use strict';

    return {
     
     
        createCustomItemCreate: function(oEvent) {

                    if (!this.pDialogKeyPeople) {
          this.pDialogKeyPeople = this.loadFragment({
            name: "customer.porky.zcustmatv2.ext.view.createView"
          });
        } else {

        }
        var that = this;
       
    
        this.pDialogKeyPeople.then(function (oDialog) {

            that.currentDialog = oDialog;

            var model = that.getOwnerComponent().getModel();
             that.currentDialog.setModel(model);
          oDialog.open();



        });
        this.getView().addDependent(this.pDialogKeyPeople);
        MessageToast.show("Custom handler invoked.");
        },
        onCloseCurrentDialog: function(oEvent){
            this.currentDialog.close();

        },
       onSuggest: function(oEvent){
        	var sTerm = oEvent.getParameter("suggestValue");
			var filter ;
			if (sTerm) {
        filter= new sap.ui.model.Filter({
    filters: [
    new sap.ui.model.Filter({
          path: "maktx",
      operator: sap.ui.model.FilterOperator.Contains,
      sTerm
        }),

   new sap.ui.model.Filter({
          path: "matnr",
      operator: sap.ui.model.FilterOperator.Contains,
      value1: sTerm,
        })
    ],
    and: false
})
// 				aFilters.push(new sap.ui.model.Filter({
//           path: "maktx",
//       operator: sap.ui.model.FilterOperator.Contains,
//       sTerm
//         }));
//         				aFilters.push(new sap.ui.model.Filter({
//           path: "matnr",
//       operator: sap.ui.model.FilterOperator.Contains,
//       value1: sTerm,
//         }));
//         				aFilters.push(new sap.ui.model.Filter({
//           path: "bismt",
//       operator: sap.ui.model.FilterOperator.Contains,
//       value1: sTerm,
//         }));
//         				aFilters.push(new sap.ui.model.Filter({
//           path: "mfrpn",
//       operator: sap.ui.model.FilterOperator.Contains,
//       value1: sTerm,
//         }))

        				

			}

			oEvent.getSource().getBinding("suggestionRows").filter([filter]);
	
       }
    };
});