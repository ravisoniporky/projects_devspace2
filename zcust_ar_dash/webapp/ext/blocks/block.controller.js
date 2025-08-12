(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define(["sap/ui/core/IconPool",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/library",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/Text"], function(IconPool, Dialog, Button, mobileLibrary, List, StandardListItem, Text) {
        return {
            onInit: function () {

                var that = this;
                this.getModel().attachRequestCompleted(function(oEvent){

                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_CONTACTS")){
                        return;
                    } 
                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_ARBAL")){
                        return;
                    }
                    if(!oEvent.mParameters.url.includes("ZCFI_CUSTARDASH")){
                        return;
                    }
                    var response = JSON.parse(oEvent.getParameter("response").responseText).d.results[0];
                    if(typeof response === 'undefined')
                        {
                            that.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerData");
                            return;
                        }
               

                    that.getView().setModel(new sap.ui.model.json.JSONModel(response), "customerData");
                });

                this.getView().setModel(new sap.ui.model.json.JSONModel({"editMode": false}), "blockModel");
                this.getView().setModel(new sap.ui.model.json.JSONModel({"creditNote": '',"creditNoteNotify":true}), "creditNoteModel");


                this.GloabalEventBus = sap.ui.getCore().getEventBus();
                this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", this.onGlobalfilterApply.bind(this));

            },

            onGlobalfilterApply: function(oEvent){

                var that = this;
                this.getModel().attachRequestCompleted(function(oEvent){

                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_CONTACTS")){
                        return;
                    } 
                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_ARBAL")){
                        return;
                    }
                    if(!oEvent.mParameters.url.includes("ZCFI_CUSTARDASH")){
                        return;
                    }
                    var response = JSON.parse(oEvent.getParameter("response").responseText).d.results[0];
                    if(typeof response === 'undefined')
                        {
                            that.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerData");
                            return;
                        }
               

                    that.getView().setModel(new sap.ui.model.json.JSONModel(response), "customerData");
                });

                this.getView().setModel(new sap.ui.model.json.JSONModel({"editMode": false}), "blockModel");
                this.getView().setModel(new sap.ui.model.json.JSONModel({"creditNote": '',"creditNoteNotify":true}), "creditNoteModel");


               
            },
    
            onAfterRendering: function (oEvent) {
            //    debugger;
            },

            onExit: function () {},
            setRelevantFilters: function (oFilters) {
                debugger;
                var oView = this.getView().byId("cardView");
                if (oFilters[0] && oFilters[0].aFilters && oFilters[0].aFilters.length > 0) {
                    // Apply filters to the card
                    oView.getBinding("items").filter(oFilters);
                } else {
                    oView.getBinding("items").filter([]);
                }
            },
            pressBlockButton: function(oEvent){
                

                var source = oEvent.getSource().getParent().getCells()[1];
            var blockDetails =     oEvent.getSource().getParent().getCells()[0].getTitle();
            var blockField;
            if(blockDetails === 'Central Block'){

                blockField = 'CBLOCK';
            }else if(blockDetails === 'Co Code Block'){

                blockField = 'CCBLOCK';
            }else if(blockDetails === 'Sales Org Block'){

                blockField = 'ORGBLOCK';
            }else if(blockDetails === 'Central Order Block'){

                blockField = 'CORDBLOCK';
            }else if(blockDetails === 'Central Posting Block'){

                blockField = 'CPOSTBLOCK';
            }else if(blockDetails === 'Archiving Block'){

                blockField = 'ARCHBLOCK';
            }else if(blockDetails === 'Co Code Posting Block'){

                blockField = 'CCPOSTBLOCK';
            }else if(blockDetails === 'Sales Org Order Block'){

                blockField = 'ORGORDBLOCK';
            }else if(blockDetails === 'Credit Block'){

                blockField = 'CREDITBLOCK';
            }

            let defaultModel1 = this.getOwnerComponent().getModel("ZODATA_CUSTOMER_BLOCKS_SRV");

            var blockedValue = '';

            if(oEvent.getSource().getParent().getCells()[1].getText() === 'Unblocked'){
                blockedValue = '';

            }else{
                blockedValue = 'X';
            }
            


            var obj = {
                "Customer" : this.getView().getModel("customerData").getData().Customer                ,
                "Cocode" : this.getView().getModel("customerData").getData().CompanyCode,
                "Salesorg" : this.getView().getModel("customerData").getData().SalesOrg,
                "Blockfield" : blockField,
                "Blockvalin" : blockedValue
                } 
                var that = this;
            defaultModel1.create("/customerblocksSet",obj, {
                
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
                sap.m.MessageBox("There is an error ")
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "lowestValuePO"));
              }
            });

            },

            pressBlockButton_Credit: function(oEvent){
                
                //     if (!this.oDefaultDialog) {
                //         this.oDefaultDialog = new Dialog({
                //             title: "Available Products",
                //             content: new sap.m.VBox({
                //                 items: [new sap.m.TextArea({
                //                 value:"{creditNoteModel>/creditNote}",
                //                 class:'sapUiMediumMarginBegin'
                //             }), sap.m.CheckBox()],
                //             height:'200px'}) ,
                //             beginButton: new Button({
                //                 type: sap.m.ButtonType.Emphasized,
                //                 text: "OK",
                //                 press: function () {
                //                     this.oDefaultDialog.close();
                //                     this.creditBlockReason();
                //                 }.bind(this)
                //             }),
                //             endButton: new Button({
                //                 text: "Close",
                //                 press: function () {
                //                     this.oDefaultDialog.close();
                //                 }.bind(this)
                //             })
                //         });
        
                //         // to get access to the controller's model
                //         this.getView().addDependent(this.oDefaultDialog);
                //     }
        
                //     this.oDefaultDialog.open();
                // //    this.getView().addDependent(this.oDefaultDialog);
                
                this.getView().setModel(new sap.ui.model.json.JSONModel({"creditNote": '',"creditNoteNotify":true}), "creditNoteModel");

                this.blockedValue = '';

                if(oEvent.getSource().getParent().getCells()[1].getText() === 'Unblocked'){
                    this.blockedValue = '';
    
                }else{
                    this.blockedValue = 'X';
                }
                if (!this.pDialogKeyPeople) {
                    this.pDialogKeyPeople = this.loadFragment({
                      name: "customer.porky.zcustardash.ext.blocks.creditReason"
                    });
                  } else {
          
                  }
                  var that = this;
          
                 
          
                 
          
          
                  this.pDialogKeyPeople.then(function (oDialog) {
          
          
                    oDialog.open();
                    that.addNewKeyPeopleDialog = oDialog;
                    that.getView().addDependent(oDialog);

          
          
                  });
                  this.getView().addDependent(this.pDialogKeyPeople);
            },




            creditBlockReason: function (oEvent){

              //  debugger;
              if(this.getView().getModel("creditNoteModel").getProperty("/creditNote").trim() === ''){

                sap.m.MessageBox.error("Please enter reason");
                return;
              }
                oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().close()

                this.getView().setBusy(true);
                var reason = this.getView().getModel("creditNoteModel").getProperty("/creditNote");
                var notifyUser = this.getView().getModel("creditNoteModel").getProperty("/creditNoteNotify");
                var notify ="";

                if(notifyUser){
                    notify="X";
                }

                var blockField = 'CREDITBLOCK';
            

            let defaultModel1 = this.getOwnerComponent().getModel("ZODATA_CUSTOMER_BLOCKS_SRV");

           


            var obj = {
                "Customer" : this.getView().getModel("customerData").getData().Customer                ,
                "Cocode" : this.getView().getModel("customerData").getData().CompanyCode,
                "Salesorg" : this.getView().getModel("customerData").getData().SalesOrg,
                "Blockfield" : blockField,
                "Blockvalin" : this.blockedValue,
                "Blockreason":reason,
                "Blocknotify": notify
                } 
                var that = this;
            defaultModel1.create("/customerblocksSet",obj, {
                
              success: function (oData, oResponse) {
                // var plant = oData.results.find(element => element.parid === "WRK");
               // var oDataResults = oData;
             //   debugger;
                that.getView().setBusy(false);


                if(oData.Success === ''){

                    sap.m.MessageBox.error(oData.Errormessage);
                    return;
                }else{
                //    sap.m.MessageBox.success("Changes are saved successfully");
               that.getView().getModel("customerData").setProperty("/CreditBlock",oData.Blockvalout);

                }
            }
        
        });
    }
}


});
})();;