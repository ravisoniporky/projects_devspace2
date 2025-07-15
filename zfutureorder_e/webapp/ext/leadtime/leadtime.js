sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
       

	leadtime: function(oEvent) {
        
        debugger;
            var that = this;
          


            if(this._controller.getView().byId("customer.porky.zfutureordere::ZCSD_PREORDERList--fe::table::ZCSD_PREORDER::LineItem::Table").getSelectedContexts()                .length < 1){

              sap.m.MessageBox.error("Please select material(s)");
              return;
            }

            
            this._controller.getView().setModel(new sap.ui.model.json.JSONModel({"LeadTimeSun":0,
            "LeadTimeMon":0,
            "LeadTimeTue":0,
            "LeadTimeWed":0,
            "LeadTimeThu":0,
            "LeadTimeFri":0,
            "LeadTimeSat":0,
           
            "CutOffTimeSun":null,
            "CutOffTimeMon":null,
            "CutOffTimeTue":null,
            "CutOffTimeWed":null,
            "CutOffTimeThu":null,
            "CutOffTimeFri":null,
            "CutOffTimeSat":null,
            "Plant":'',
            "Material" : 'All Materials',
            "validated": false
          }
          ), "calendarWeekModel");
          
        
          this._controller.getView().setModel(new sap.ui.model.json.JSONModel({"selectedMaterial":'All Selcted Materials', "selectedPlant":''}
            ), "selectedModel");
            

                if (!this.pDialogKeyPeople1) {
                  this.pDialogKeyPeople1 = this.loadFragment({
                    name: "customer.porky.zfutureordere.ext.leadtime.leadTime"
                  });
                } else {
        
                }
                var that = this;
        
               
        
              
                this.pDialogKeyPeople1.then(function (oDialog) {
        
        
                  oDialog.open();
                  that.futureLeadTimeDialog = oDialog;
        
        
        
                });
                this.getView().addDependent(this.pDialogKeyPeople1);
        
        }
    };
});
