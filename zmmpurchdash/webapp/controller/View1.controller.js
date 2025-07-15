sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zmmpurchdash.controller.View1", {
        onInit: function () {


       //     this.fetchHighestPO();
       //      this.fetchLowestPO();
       //      this.fetchHighestQty();
        //     this.fetchLowestQty();
        //     this.fetchOpenPOs();
        //     this.fetchClosePOs();

             this.getView().setModel(new sap.ui.model.json.JSONModel({'OpenPOs':0, 'ClosePOs':0}), "POComparisonChartModel");


             this.getView().setModel(new sap.ui.model.json.JSONModel({Plant:''}
            ), "subTitlePlant");
            this.getView().setModel(new sap.ui.model.json.JSONModel({Time:''}
        ), "subTitleTime");


      //  this.getView().setModel(new sap.ui.model.json.JSONModel({"PO": '0'}, "closePOsModel"));
     //   this.getView().setModel(new sap.ui.model.json.JSONModel({"PO": '0'}, "openPOsModel"));

            // this.fetchHighestCSPO();
            // this.fetchLowestCSPO();
            var that = this;
            setTimeout(() => {
              // if(that.getView().byId("smartFilterBar").getCurrentVariantId() === '')
                {

                var filterData = {};
                var startupdata = that.getOwnerComponent().getComponentData().startupParameters;
                if(startupdata.Plant && startupdata.Plant.length >0 && that.getView().byId("smartFilterBar").getControlByKey("Plant").getValue() === ''){
                filterData.Plant = startupdata.Plant[0];
                }
                if(startupdata.Time && startupdata.Time.length >0 && that.getView().byId("smartFilterBar").getControlByKey("Time").getValue() === ''){

                filterData.Time = startupdata.Time[0];
                }
                if(startupdata.CompanyCode && startupdata.CompanyCode.length >0 && that.getView().byId("smartFilterBar").getControlByKey("CompanyCode").getTokens().length  === ''){

                filterData.CompanyCode = startupdata.CompanyCode[0];
                that.getView().byId("smartFilterBar").addFieldToAdvancedArea("CompanyCode")
               
                }

                if(startupdata.Material && startupdata.Material.length >0 && that.getView().byId("smartFilterBar").getControlByKey("Material").getTokens().length === 0){
                  filterData.Material = startupdata.Material[0];
                  that.getView().byId("smartFilterBar").addFieldToAdvancedArea("Material")

                }

                if(startupdata.MaterialGroup && startupdata.MaterialGroup.length >0 && that.getView().byId("smartFilterBar").getControlByKey("MaterialGroup").getTokens().length  === ''){

                filterData.MaterialGroup = startupdata.MaterialGroup[0];
                that.getView().byId("smartFilterBar").addFieldToAdvancedArea("MaterialGroup")


                }
           
                that.getView().byId("smartFilterBar").setFilterData(filterData);
              }


            }, 1500 );

        },
        onFilterApply: function(oEvent){
        //    debugger;
         //   this.getView().setModel(new sap.ui.model.json.JSONModel({}), "highestValuePO");

            this.resetValuesCard();
            this.fetchHighestPO();
            this.fetchLowestPO();
            this.fetchHighestQty();
            this.fetchLowestQty();
            this.getView().setModel(new sap.ui.model.json.JSONModel({'OpenPOs':0, 'ClosePOs':0}), "POComparisonChartModel");

            this.fetchOpenPOs();
            this.fetchClosePOs();


           
        },
        resetValuesCard: function(){
            this.getView().setModel(new sap.ui.model.json.JSONModel({}
            ), "highestValuePO");

            this.getView().setModel(new sap.ui.model.json.JSONModel({}
            ), "lowestValuePO");

            this.getView().setModel(new sap.ui.model.json.JSONModel({}
            ), "lowestValueQty");

            this.getView().setModel(new sap.ui.model.json.JSONModel({}
            ), "highestValueQty");
        },

        fetchHighestPO(){

            var that = this;
            let defaultModel1 = this.getOwnerComponent().getModel();
            var filterArray =  [];
            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Plant ){
              
             //   this.getView().byId("POSubHeader").setSubtitle("Plant - "+this.getView().byId("smartFilterBar").getFilterData().Plant.value)
             if(this.getView().byId("smartFilterBar").getFilterData().Plant === null){
                return;
            }
            var plantArray = this.getView().byId("smartFilterBar").getFilterData().Plant.items;
            plantArray.forEach(element => {
              filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, element.key));

            });

            }

            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Time ){
                if(this.getView().byId("smartFilterBar").getFilterData().Time === null){
                    return;
                }
             //   this.getView().byId("POSubHeader").setSubtitle("Plant - "+this.getView().byId("smartFilterBar").getFilterData().Time.value)
                filterArray.push( new sap.ui.model.Filter("Time", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Time));
            }

            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Rundt ){
              if(this.getView().byId("smartFilterBar").getFilterData().Rundt === null){
                  return;
              }
       
              filterArray.push( new sap.ui.model.Filter("Rundt", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Rundt));
          }
    
            defaultModel1.read("/ZCMM_POITEMMONI1", {
                filters: filterArray,
              urlParameters: {
                "$select" : "PurchaseOrder,NetAmount",
                "$orderby" : "NetAmount desc",
                "$top" : "1"
    
              },
              success: function (oData, oResponse) {
                // var plant = oData.results.find(element => element.parid === "WRK");
               // var oDataResults = oData;
                that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]
                ), "highestValuePO");
    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({"authCustomer":false}
              ), "authCustomerModel");
              }
            });
        },

        fetchLowestPO(){

            var that = this;
            let defaultModel1 = this.getOwnerComponent().getModel();
            var filterArray =  [];
            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Plant ){
                if(this.getView().byId("smartFilterBar").getFilterData().Plant === null){
                    return;
                }
            //    this.getView().byId("POSubHeader").setSubtitle("Plant - "+this.getView().byId("smartFilterBar").getFilterData().Plant.value);
                that.getView().setModel(new sap.ui.model.json.JSONModel({Plant:"Plant(s) Applied" }
            ), "subTitlePlant");
              //  filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Plant));
              var plantArray = this.getView().byId("smartFilterBar").getFilterData().Plant.items;
            plantArray.forEach(element => {
              filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, element.key));

            });
            }


            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Time ){
                if(this.getView().byId("smartFilterBar").getFilterData().Time === null){
                    return;
                }
                that.getView().setModel(new sap.ui.model.json.JSONModel({Time:"Time Rollup - " +this.getView().byId("smartFilterBar").getFilterData().Time}
                ), "subTitleTime");
              //  this.getView().byId("POSubHeader").setSubtitle("Plant - "+this.getView().byId("smartFilterBar").getFilterData().Time.value)
                
                filterArray.push( new sap.ui.model.Filter("Time", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Time));
            }

            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Rundt ){
              if(this.getView().byId("smartFilterBar").getFilterData().Rundt === null){
                  return;
              }
       
              filterArray.push( new sap.ui.model.Filter("Rundt", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Rundt));
          }
    
            defaultModel1.read("/ZCMM_POITEMMONI1", {
                filters: filterArray,
              urlParameters: {
                "$select" : "PurchaseOrder,NetAmount",
                "$orderby" : "NetAmount asc",
                "$top" : "1"
    
              },
              success: function (oData, oResponse) {
                // var plant = oData.results.find(element => element.parid === "WRK");
               // var oDataResults = oData;
                that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]
                ), "lowestValuePO");
    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "lowestValuePO"));
              }
            });
        },

        fetchLowestQty(){

            var that = this;
            let defaultModel1 = this.getOwnerComponent().getModel();
            var filterArray =  [];
            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Plant ){
                if(this.getView().byId("smartFilterBar").getFilterData().Plant === null){
                    return;
                }
               
             //   filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Plant));
             var plantArray = this.getView().byId("smartFilterBar").getFilterData().Plant.items;
            plantArray.forEach(element => {
              filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, element.key));

            });
            }


            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Time ){
                if(this.getView().byId("smartFilterBar").getFilterData().Time === null){
                    return;
                }
         
                filterArray.push( new sap.ui.model.Filter("Time", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Time));
            }

            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Rundt ){
              if(this.getView().byId("smartFilterBar").getFilterData().Rundt === null){
                  return;
              }
       
              filterArray.push( new sap.ui.model.Filter("Rundt", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Rundt));
          }
    
            defaultModel1.read("/ZCMM_POITEMMONI1", {
                filters: filterArray,
              urlParameters: {
                "$select" : "PurchaseOrder,QuantityInCS",
                "$orderby" : "QuantityInCS asc",
                "$top" : "1"
    
              },
              success: function (oData, oResponse) {
                // var plant = oData.results.find(element => element.parid === "WRK");
               // var oDataResults = oData;
               oData.results[0].OrderQuantity = oData.results[0].QuantityInCS;
                that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]
                ), "lowestValueQty");
    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "lowestValueQty"));
              }
            });
        },


        fetchHighestQty(){

            var that = this;
            let defaultModel1 = this.getOwnerComponent().getModel();
            var filterArray =  [];
            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Plant ){
                if(this.getView().byId("smartFilterBar").getFilterData().Plant === null){
                    return;
                }
               
              //  filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Plant));
              var plantArray = this.getView().byId("smartFilterBar").getFilterData().Plant.items;
            plantArray.forEach(element => {
              filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, element.key));

            });
            }


            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Time ){
                if(this.getView().byId("smartFilterBar").getFilterData().Time === null){
                    return;
                }
         
                filterArray.push( new sap.ui.model.Filter("Time", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Time));
            }

            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Rundt ){
              if(this.getView().byId("smartFilterBar").getFilterData().Rundt === null){
                  return;
              }
       
              filterArray.push( new sap.ui.model.Filter("Rundt", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Rundt));
          }
    
            defaultModel1.read("/ZCMM_POITEMMONI1", {
                filters: filterArray,
              urlParameters: {
                "$select" : "PurchaseOrder,QuantityInCS",
                "$orderby" : "QuantityInCS desc",
                "$top" : "1"
    
              },
              success: function (oData, oResponse) {
                oData.results[0].OrderQuantity = oData.results[0].QuantityInCS;

                // var plant = oData.results.find(element => element.parid === "WRK");
               // var oDataResults = oData;
                that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]
                ), "highestValueQty");
    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "lowestValuePO"));
              }
            });
        },

        fetchOpenPOs(){

            var that = this;
            let defaultModel1 = this.getOwnerComponent().getModel();
            var filterArray =  [];
            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Plant ){
                if(this.getView().byId("smartFilterBar").getFilterData().Plant === null){
                    return;
                }
               
             //   filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Plant));
             var plantArray = this.getView().byId("smartFilterBar").getFilterData().Plant.items;
            plantArray.forEach(element => {
              filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, element.key));

            });
            }


            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Time ){
                if(this.getView().byId("smartFilterBar").getFilterData().Time === null){
                    return;
                }
         
                filterArray.push( new sap.ui.model.Filter("Time", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Time));
            }

            filterArray.push( new sap.ui.model.Filter("IsCompleted", sap.ui.model.FilterOperator.EQ, false));
            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Rundt ){
              if(this.getView().byId("smartFilterBar").getFilterData().Rundt === null){
                  return;
              }
       
              filterArray.push( new sap.ui.model.Filter("Rundt", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Rundt));
          }
    
            defaultModel1.read("/ZCMM_POITEMMONI1/$count", {
                filters: filterArray,
              urlParameters: {
    
              },
              success: function (oData, oResponse) {
                // var plant = oData.results.find(element => element.parid === "WRK");
               // var oDataResults = oData;
           //     that.getView().setModel(new sap.ui.model.json.JSONModel({PO: oData+""}, "openPOsModel"));
           that.getView().getModel("POComparisonChartModel").setProperty("/OpenPOs",oData)

    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "lowestValuePO"));
              }
            });
        },

        fetchClosePOs(){

            var that = this;
            let defaultModel1 = this.getOwnerComponent().getModel();
            var filterArray =  [];
            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Plant ){
                if(this.getView().byId("smartFilterBar").getFilterData().Plant === null){
                    return;
                }
               
              //  filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Plant));
              var plantArray = this.getView().byId("smartFilterBar").getFilterData().Plant.items;
            plantArray.forEach(element => {
              filterArray.push( new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, element.key));

            });
            }


            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Time ){
                if(this.getView().byId("smartFilterBar").getFilterData().Time === null){
                    return;
                }
         
                filterArray.push( new sap.ui.model.Filter("Time", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Time));
            }

            if(this.getView().byId("smartFilterBar").getFilterData() && this.getView().byId("smartFilterBar").getFilterData().Rundt ){
              if(this.getView().byId("smartFilterBar").getFilterData().Rundt === null){
                  return;
              }
       
              filterArray.push( new sap.ui.model.Filter("Rundt", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilterBar").getFilterData().Rundt));
          }

            filterArray.push( new sap.ui.model.Filter("IsCompleted", sap.ui.model.FilterOperator.EQ, true));

    
            defaultModel1.read("/ZCMM_POITEMMONI1/$count", {
                filters: filterArray,
              urlParameters: {
               
    
              },
              success: function (oData, oResponse) {
                // var plant = oData.results.find(element => element.parid === "WRK");
               // var oDataResults = oData;
             //  that.getView().setModel(new sap.ui.model.json.JSONModel({'PO': oData+""}, "closePOsModel"));
               that.getView().getModel("POComparisonChartModel").setProperty("/ClosePOs",oData)

    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "lowestValuePO"));
              }
            });
        }
    });
});
