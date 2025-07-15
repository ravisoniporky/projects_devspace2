sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zpgprojection.controller.View1", {
        onInit: function () {

         //   this.fetchTimeline();
         this.getView().setModel(new sap.ui.model.json.JSONModel({}), "calendarData");
         let pgProjSet = this.getOwnerComponent().getModel("ZCSD_PG_PROJECTON_CDS");
         this.getView().byId("smartFilterBar").setModel(pgProjSet);
         this.getView().byId("LineItemsSmartTable1").setModel(pgProjSet);


        },
        onFilterApply: function(oEvent){

        //    debugger;
            var year = oEvent.getSource().getFilterData().Gjahr;
            this.fetchTimeline(year);
        },
        fetchTimeline: function(year){
            let prodSet = this.getOwnerComponent().getModel('ZBXA_PG_PROJECTIONCALENDAR_CDS');
            var that = this;
            var filterArray =  [];
            filterArray.push( new sap.ui.model.Filter("Gjahr", sap.ui.model.FilterOperator.EQ, year));
            filterArray.push( new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, '3000'));

    
            prodSet.read("/ZBXA_PG_ProjectionCalendar", {
                filters: filterArray,
                urlParameters: {
                    "$orderby" : "Zwkend asc",
                    
        
                  },
                success: function (result) {
           //       debugger;
                 
  
             //    debugger;
                     that.getView().setModel(new sap.ui.model.json.JSONModel(result), "calendarData");
  
                
                },
                error: function (err) {
                  // some error occuerd 
                  that.getView().setBusy(false);
                  
    
                }
              });
        }

    });
});
