sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  'sap/ui/core/Fragment'
],
function (Controller,JSONModel,Filter,FilterOperator,MessageBox,Fragment) {
    "use strict";

    return Controller.extend("customer.porky.zsdorderentry.controller.View1", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onRouteMatched, this);
      
      if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0]){

        this.getOwnerComponent().getModel("userValues").setProperty("/SalesOrganization",this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0]);

        this.fetchDeliveryDate();
        this.fetchPlants();
      }  

      if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.Plant && this.getOwnerComponent().getComponentData().startupParameters.Plant[0]){

        this.getOwnerComponent().getModel("userValues").setProperty("/Plant",this.getOwnerComponent().getComponentData().startupParameters.Plant[0]);
      } 

      if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.Customer && this.getOwnerComponent().getComponentData().startupParameters.Customer[0]){

        this.getOwnerComponent().getModel("userValues").setProperty("/Customer",this.getOwnerComponent().getComponentData().startupParameters.Customer[0]);
      } 

      this.readDefaultValues();

        },



        handlePopoverPress: function (oEvent) {
          var oButton = oEvent.getSource(),
            oView = this.getView();
    
          // create popover
          if (!this._pPopover) {
            this._pPopover = Fragment.load({
              id: oView.getId(),
              name: "customer.porky.zsdorderentry.view.settings",
              controller: this
            }).then(function(oPopover) {
              oView.addDependent(oPopover);
              oPopover.bindElement("/ProductCollection/0");
              return oPopover;
            });
          }
          this._pPopover.then(function(oPopover) {
            oPopover.openBy(oButton);
          });
        },



        _onRouteMatched: function(oEvent){

          if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0]){

            this.getOwnerComponent().getModel("userValues").setProperty("/SalesOrganization",this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0]);
          }  

          if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.Plant && this.getOwnerComponent().getComponentData().startupParameters.Plant[0]){

            this.getOwnerComponent().getModel("userValues").setProperty("/Plant",this.getOwnerComponent().getComponentData().startupParameters.Plant[0]);
          } 

          if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.Customer && this.getOwnerComponent().getComponentData().startupParameters.Customer[0]){

            this.getOwnerComponent().getModel("userValues").setProperty("/Customer",this.getOwnerComponent().getComponentData().startupParameters.Customer[0]);
          } 

        },
        showAddMaterials: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("detail");


            if( this.getView().byId("idInputSalesOrg").getSelectedKey() && this.getView().byId("idInputCustomer").getValue() ){

              // if(typeof this.getView().byId("idInputPlant").getValue() === 'undefined'){

              //   this.getOwnerComponent().getModel("userValues").setProperty("/Plant", "");
              // }
            
            this.getView().byId("idInputSalesOrg").setEditable(false);
            this.getView().byId("idInputCustomer").setEditable(false);
            // this.getView().byId("idInputPlant").setEditable(false);
            this.getView().byId("idPonumber").setEditable(false);
            this.getView().byId("idDelDate").setEditable(false);
            this.getOwnerComponent().getModel("userValues").setProperty("/layout","TwoColumnsMidExpanded");
          // this.getView().getParent().getParent().getCurrentMidColumnPage().byId("gridList1")
            this.getView().getParent().getParent().getCurrentMidColumnPage().getController().readGridListProposed();
            this.getView().getParent().getParent().getCurrentMidColumnPage().getController().readGridListItemSearch();
          
          //  this.getView().getParent().getParent().getCurrentMidColumnPage().byId("smartListAllItems").rebindList();
            }else{

              MessageBox.error("Please enter all values");
            }



        },

        ResetMaterialSelection: function(oEvent){
          this.getView().byId("idInputSalesOrg").setEditable(true);
          this.getView().byId("idInputCustomer").setEditable(true);
          this.getView().byId("idInputPlant").setEditable(true);
          this.getView().byId("idPonumber").setEditable(true);
          this.getView().byId("idDelDate").setEditable(true);

          this.getOwnerComponent().getModel("userValues").setProperty("/Customer","");
          this.getOwnerComponent().getModel("userValues").setProperty("/SalesOrganization","");
          this.getOwnerComponent().getModel("userValues").setProperty("/salesorgname","");

          this.getOwnerComponent().getModel("userValues").setProperty("/Plant","");
          this.getOwnerComponent().getModel("userValues").setProperty("/plantname","");
          this.getOwnerComponent().getModel("userValues").setProperty("/customername","");

          this.getOwnerComponent().getModel("userValues").setProperty("/layout","OneColumn");

        },
        handleSelectCustomer: function(oEvent){

          var cust = oEvent.mParameters.listItem.getBindingContext().getObject().Customer;
          var custname = oEvent.mParameters.listItem.getBindingContext().getObject().CustomerName;

          this.getOwnerComponent().getModel("userValues").setProperty("/Customer", cust);
          this.getOwnerComponent().getModel("userValues").setProperty("/customername", custname);

          oEvent.getSource().getParent().getParent().close();
        },
        _onRouteMatched1: function(oEvent) {
		
            this.getOwnerComponent().getModel("userValues").setProperty("/SalesOrganization","");
            
		},
        onSelectSalesOrg: function(oEvent){
            var salesorg = oEvent.mParameters.value;
            this.getOwnerComponent().getModel("userValues").setProperty("/SalesOrganization",salesorg);
            if(salesorg === ''){
                this.getView().byId("idInputCustomer").setEnabled(false);
                this.getOwnerComponent().getModel("userValues").setProperty("/Customer",'');
            }else{
            this.getView().byId("idInputCustomer").setEnabled(true);
            this.getView().byId("idSalesOrg").setValue(salesorg);

            }
            this.fetchDeliveryDate()
            this.fetchPlants();
        },
        onSelectPlant: function(oEvent){
            var plant = oEvent.mParameters.value;
            this.getOwnerComponent().getModel("userValues").setProperty("/Plant",plant);
        },
        onSelectCustomer: function(oEvent){

            var customer = oEvent.mParameters.value;


        },
        onBeforeRebindCustomerF4: function(oEvent){

        },
        onSuggestCustomer: function(oEvent){
          //  debugger;

            var suggestedRows = oEvent.getSource().getBinding("suggestionRows");
            var query = oEvent.getSource().getValue().trim();
            var aFilters = [];
                        // if (this.getView().byId("idSalesOrg").getValue() !== '' && typeof this.getView().byId("idSalesOrg").getValue() !== 'undefined') {
                            aFilters.push(new Filter({path:'SalesOrg',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization")}));
                        // }
                        var filterArray = [];


                        filterArray.push(new Filter({path:'Customer',  operator:'Contains',value1:query}));
                        filterArray.push(new Filter({path:'CustomerName',  operator:'Contains',value1:query}));
                        filterArray.push(new Filter({path:'PrevAcct',  operator:'Contains',value1:query}));
                        filterArray.push(new Filter({path:'Street',  operator:'Contains',value1:query}));

                        var farrayobj = new sap.ui.model.Filter({
                          filters:  filterArray ,
                          and: false,
                        });
                        aFilters.push(farrayobj);

            suggestedRows.filter(aFilters);
        },
        onSuggestionItemSelectedPlant: function(oEvent){

          var plant =  oEvent.mParameters.selectedItem.getKey();;
           var plantName =  oEvent.mParameters.selectedItem.getText().split("-")[1].trim();
          
           this.getOwnerComponent().getModel("userValues").setProperty("/Plant",plant);
           this.getOwnerComponent().getModel("userValues").setProperty("/plantname",plantName);
        },
        onSuggestionItemSelected: function(oEvent){

           var customer =  oEvent.mParameters.selectedRow.getBindingContext().getObject().Customer;
           var customername =  oEvent.mParameters.selectedRow.getBindingContext().getObject().CustomerName;
          
           this.getOwnerComponent().getModel("userValues").setProperty("/Customer",customer);
           this.getOwnerComponent().getModel("userValues").setProperty("/customername",customername);
        },






        onSuggestSalesOrg: function(oEvent){
          //  debugger;

          var suggestedRows = oEvent.getSource().getBinding("suggestionRows");
          var query = oEvent.getSource().getValue().trim();
                 
                      var filterArray = [];


                      filterArray.push(new Filter({path:'SalesOrganization',  operator:'Contains',value1:query}));
                      filterArray.push(new Filter({path:'SalesOrganization_Text',  operator:'Contains',value1:query}));
                   
                      var farrayobj = new sap.ui.model.Filter({
                        filters:  filterArray ,
                        and: false,
                      });

          suggestedRows.filter([farrayobj]);

        
        },
        onSuggestionItemSelectedSalesOrg: function(oEvent){

          var salesorg = oEvent.mParameters.selectedItem.getKey();
          var salesorgname = oEvent.mParameters.selectedItem.getText();
          //  var salesorg =  oEvent.mParameters.selectedRow.getBindingContext("mainService").getObject().SalesOrganization;
          //  var salesorgname =  oEvent.mParameters.selectedRow.getBindingContext("mainService").getObject().SalesOrganization_Text;
          
           this.getOwnerComponent().getModel("userValues").setProperty("/SalesOrganization",salesorg);
           this.getOwnerComponent().getModel("userValues").setProperty("/salesorgname",salesorgname);
           this.getOwnerComponent().getModel("userValues").setProperty("/Customer","");
           this.getOwnerComponent().getModel("userValues").setProperty("/customername","");


           
           this.getView().byId("idInputCustomer").setEnabled(true);

           this.fetchDeliveryDate();
           this.fetchPlants();

        },






        onCloseDialogBox: function(oEvent){

           // debugger;
            oEvent.getSource().getParent().close()

        },
        onBeforeRebindCustomerF4: function(oEvent){

            var oBindingParams = oEvent.getParameter( "bindingParams" );
   

        
          
        
                var oFilter = new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization"));
                oBindingParams.filters.push(oFilter);              
            
        },
        openCustomerF4: function(oEvent){
                // create dialog lazily
                if (!this.pDialogUser) {
                  this.pDialogUser = this.loadFragment({
                    name: "customer.porky.zsdorderentry.view.customerF4"
                  });
                } else {
        
                  if (this.pDialogUser1) {
                    this.pDialogUser1.destroy();
                    this.pDialogUser = undefined;
                    this.pDialogUser1 = undefined;
                    this.pDialogUser = this.loadFragment({
                      name: "customer.porky.zsdorderentry.view.customerF4"
                    });
                  }
                }
                var that = this;
                this.pDialogUser.then(function (oDialog) {
        
                  that.pDialogUser1 = oDialog;
        
                  oDialog.open();
                  var oFilter = [];
                  oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.vkorg));
        
                  oDialog.getBinding("items").filter(oFilter);
                  //  that.getView().byId("mapSlider").setValue(3);
        
                  //   var oMap = that.getView().byId("vbi");
                  // that.getLocation();
        
                });
                var that = this;
        
                // setTimeout(() => {
                //   var oFilter = [];
                //   oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, that.vkorg));
        
                //   that.pDialogUser.getBinding("items").filter(oFilter);
                // }, 1000);
                this.getView().addDependent(this.pDialogUser);
        
        
              
        },

        fetchDeliveryDate: function(){



          let defaultModel1 = this.getOwnerComponent().getModel();
          var that = this;
          
         

          // var path = oEvent.getSource().getBindingContext("cartModel").sPath;

          var filters = [];
          filters.push(new sap.ui.model.Filter({path:'SalesOrganization',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization")}));
          // if(this.getOwnerComponent().getModel("userValues").getProperty("/Plant") && this.getOwnerComponent().getModel("userValues").getProperty("/Plant").trim() !== '')
          // filters.push(new sap.ui.model.Filter({path:'Plant',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/Plant")}));
         
          // var filterArray = [];
          // filterArray.push(
          //   new sap.ui.model.Filter({path:'Material',  operator:'EQ',value1:oEvent.getSource().getValue().trim()}));
          //   filterArray.push(
          //     new sap.ui.model.Filter({path:'SalesOrgMaterial',  operator:'EQ',value1:oEvent.getSource().getValue().trim()})); 
          //     filterArray.push(
          //       new sap.ui.model.Filter({path:'OldMaterial',  operator:'EQ',value1:oEvent.getSource().getValue().trim()}));

          //       var farrayobj = new sap.ui.model.Filter({
          //         filters:  filterArray ,
          //         and: false,
          //       });

          //      filters.push(farrayobj);

          defaultModel1.read("/ZCSD_NEXTDELIVERYDATE", {
              
           
            filters: filters  ,
              success: function (oData, oResponse) {
           
              //  debugger;

              if(oData.results[0] && oData.results[0].NextDeliveryDate){
                var nextdelivDate = oData.results[0].NextDeliveryDate;

                // that.getView().byId("idDelDate").setDateValue(nextdelivDate);
                that.getOwnerComponent().getModel("userValues").setProperty("/deldate",nextdelivDate);
              }else{
                // that.getView().byId("idDelDate").setDateValue(null);
                that.getOwnerComponent().getModel("userValues").setProperty("/deldate",null);

              }
                // if(oData.results.length >0){
                //   that.getView().getModel("cartModel").setProperty(path+"/Material",oData.results[0].Material)

                // that.getView().getModel("cartModel").setProperty(path+"/OldMaterial",oData.results[0].OldMaterial)
                // that.getView().getModel("cartModel").setProperty(path+"/MaterialDescription",oData.results[0].MaterialDescription)
                // // that.getView().getModel("cartModel").setProperty(path+"/SalesUnit",'')

                // oEvent.getSource().getParent().getCells()[4].getBinding("items").filter([new Filter({path:'Material',  operator:'EQ',value1:oData.results[0].Material})]);


                // }else{
                //   that.getView().getModel("cartModel").setProperty(path+"/Material","")
                
                //   that.getView().getModel("cartModel").setProperty(path+"/OldMaterial","")
                //   that.getView().getModel("cartModel").setProperty(path+"/MaterialDescription","")
                //   that.getView().getModel("cartModel").setProperty(path+"/Quantity","1")
                //   that.getView().getModel("cartModel").setProperty(path+"/SalesUnit","CS")

                // }
  

      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "customerData1"));
              }
            });


        },

        fetchPlants: function(){

          let defaultModel1 = this.getOwnerComponent().getModel();
          var that = this;
          
         


          var filters = [];
          filters.push(new sap.ui.model.Filter({path:'SalesOrganization',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization")}));


          defaultModel1.read("/zcsd_oent_sorgplants", {
              
           
            filters: filters  ,
              success: function (oData, oResponse) {
           
                debugger;
                var result = JSON.parse(JSON.stringify(oData.results));

                that.getView().setModel(new sap.ui.model.json.JSONModel({plants: result}), "plantModel");

      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "customerData1"));
              }
            });


        },
        onCollapseExpandPress() {
          const oSideNavigation = this.byId("sideNavigation"),
            bExpanded = oSideNavigation.getExpanded();
    
          oSideNavigation.setExpanded(!bExpanded);
        },
    
        onHideShowWalkedPress() {
          const oNavListItem = this.byId("walked");
          oNavListItem.setVisible(!oNavListItem.getVisible());
        },
        onItemSelect: function(oEvent){
          var oItem = oEvent.getParameter("item");
          if(oItem.getKey() === '2'){
            this.byId("pageContainer").to(this.getView().createId("root2"));
          }else{
            this.byId("pageContainer").to(this.getView().createId("root1"));
          }
        },

        readDefaultValues: function(oEvent){
             let defaultModel1 = this.getOwnerComponent().getModel();
          var that = this;
          
         


          var filters = [];


          defaultModel1.read("/ZBSD_OENT_USERSETTINGS", {
              
           
            filters: filters  ,
              success: function (oData, oResponse) {
           
                debugger;
                var result = JSON.parse(JSON.stringify(oData.results))[0];

                that.getView().setModel(new sap.ui.model.json.JSONModel( result), "settingsModel");

      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "customerData1"));
              }
            });
        },

        onSaveDefaults: function(){
          var data = this.getView().getModel("settingsModel").getData();
let defaultModel1 = this.getOwnerComponent().getModel("ZODATA_ORDER_ENTRY_SRV");
          var that = this;
          
         
delete data.__metadata;

          var filters = [];


          defaultModel1.create("/UserSettingsSet", data,{
              
           
            filters: filters  ,
              success: function (oData, oResponse) {
           
              
       
                sap.m.MessageBox.success("Default values are saved successfully");
      
    
              },
    
              error: function (oError) {
                 
    
              }
            });

        }

    });
});
