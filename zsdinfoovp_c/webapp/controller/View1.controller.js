sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zsdinfoovpc.controller.View1", {
        onInit: function () {

            var that = this;
            setTimeout(() => {
                // if(that.getView().byId("smartFilterBar").getCurrentVariantId() === '')
                  {
  
                  var filterData = {};
                  var startupdata = that.getOwnerComponent().getComponentData().startupParameters;
                  if(startupdata.TimeRollup && startupdata.TimeRollup.length >0 && that.getView().byId("smartFilterBar").getControlByKey("TimeRollup").getValue() === ''){
                  filterData.TimeRollup = startupdata.TimeRollup[0];
                  }

                  if(startupdata.SalesOrganization && startupdata.SalesOrganization.length >0 && that.getView().byId("smartFilterBar").getControlByKey("SalesOrganization").getValue() === ''){
                    filterData.SalesOrganization = startupdata.SalesOrganization[0];
                    }


                    if(startupdata.SoldToParty && startupdata.SoldToParty.length >0 && that.getView().byId("smartFilterBar").getControlByKey("SoldToParty").getValue() === ''){
                        filterData.SoldToParty = startupdata.SoldToParty[0];
                        }


                        if(startupdata.SalesLead && startupdata.SalesLead.length >0 && that.getView().byId("smartFilterBar").getControlByKey("SalesLead").getValue() === ''){
                            filterData.SalesLead = startupdata.SalesLead[0];
                            }

                          
             
             
                  that.getView().byId("smartFilterBar").setFilterData(filterData);

                  that.getView().byId("LineItemsSmartTable").rebindTable();
                  that.getView().byId("blockedOrders").rebindTable();
                  that.getView().byId("openOrders").rebindTable();



                }
  
  
              }, 1500 );
        },
        onBeforeOrdersThisWeek: function(oEvent){
            var binding = oEvent.getParameter("bindingParams");
          

            if(binding.filters[0]            ){
            var filterArray = binding.filters[0].aFilters;
            // filterArray.forEach(element => {
                
            //   if(  element.aFilters[0].sPath === 'TimeRollup'){
                
            //   }
            // });



            for (var i = 0; i < filterArray.length; i++) {
               
               
                if(!filterArray[i].aFilters                ){
                    return;
                }
                if(filterArray.length >1){
                    if(  filterArray[i].aFilters[0].sPath === 'TimeRollup'){
                        filterArray.splice(i--, 1);
                    }
                }else{
                    if(  filterArray[i].sPath === 'TimeRollup'){
                        filterArray.splice(i--, 1);
                    }
                }
            }
                var oFilter = new sap.ui.model.Filter("TimeRollup", sap.ui.model.FilterOperator.EQ,'WTD');
            binding.filters.push(oFilter);
        }
            
        },

        onFilterApply: function(){
            this.getView().byId("LineItemsSmartTable").rebindTable();
            this.getView().byId("blockedOrders").rebindTable();
            this.getView().byId("openOrders").rebindTable();
        }
    });
});
