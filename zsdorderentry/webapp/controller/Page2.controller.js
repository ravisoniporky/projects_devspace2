sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
],
function (Controller,JSONModel,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("customer.porky.zsdorderentry.controller.Page2", {
        onInit: function () {



            this.readGridListProposed();
            this.readGridListItemSearch();


         //   this.searchText = 'wwe232wew';
            this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched, this);

            

            var fastentrylist = [];
            for(var count =0; count<10; count++){

              fastentrylist.push({
                Material: "",
                MaterialDescription: "",
                OldMaterial: "",
                Quantity: "",
                price: "",
                SalesUnit: "CS",
                ItemNotes : ''
               
              })
            }

                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
                {
                    
                    "materials": fastentrylist
                }
            ), "cartModel");
       //     this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({cartItemsCount: 0}), "countModel");
            this.getOwnerComponent().getModel("countModel").setProperty("/cartItemsCount",0);

          //  this.onSuggestItems_all();

        },


      

      

        onStateChange: function(oEvent){

          debugger;
        },
        onNavButtonPress: function(oEvent){
          this.getOwnerComponent().getModel("userValues").setProperty("/layout","ThreeColumnsBeginExpandedEndHidden");
        },

        isMaterialInCartProposed: function(oEvent){


          var proposedItems = this.getView().getModel("proposedModel").getData().results;

          if(proposedItems.length === 0){
            return;
          }
          var cartItems = this.getOwnerComponent().getModel("cartModel").getData().materials;
          if(!cartItems){
            return;
          }
          if(cartItems && cartItems.length === 0){
            return;
          }

          proposedItems.forEach(proposedItem => {
            
            var isMaterialFound = false;
            var cartObj ; 
            cartItems.forEach(cartItem => {
              

              if(cartItem.Material === proposedItem.Material){
                isMaterialFound = true;
                cartObj = cartItem;
              }
            });
            if(isMaterialFound){
              proposedItem.isAddedToCart = true;
              proposedItem.CartQuantity = Number(cartObj.Quantity);

            }
          });
          this.getView().getModel("proposedModel").setData({"results":proposedItems});

      //    debugger;
        },


        isMaterialInCartSearch: function(oEvent){


          if(!this.getView().getModel("itemSearchModel")){
            return;
          }
          var searchItems = this.getView().getModel("itemSearchModel").getData().results;
          if(searchItems.length === 0){
            return;
          }
          var cartItems = this.getOwnerComponent().getModel("cartModel").getData().materials;
          if(!cartItems){
            return;
          }
          if(cartItems && cartItems.length === 0){
            return;
          }

          searchItems.forEach(proposedItem => {
            
            var isMaterialFound = false;
            var cartObj ; 
            cartItems.forEach(cartItem => {
              

              if(cartItem.Material === proposedItem.Material){
                isMaterialFound = true;
                cartObj = cartItem;
              }
            });
            if(isMaterialFound){
              proposedItem.isAddedToCart = true;
              proposedItem.CartQuantity = Number(cartObj.Quantity);

            }
          });
          this.getView().getModel("itemSearchModel").setData({"results":searchItems});

      //    debugger;
        },
        
        onAddToCart: function(oEvent){

     //     debugger;

          var materialObj = {}
          if(oEvent.getSource().getBindingContext("proposedModel") && oEvent.getSource().getBindingContext("proposedModel").getObject()){

            // materialObj = oEvent.getSource().getBindingContext("proposedModel").getObject();
            materialObj = JSON.parse( JSON.stringify( oEvent.getSource().getBindingContext("proposedModel").getObject()));
            materialObj.source = "P";
            

            var spath = oEvent.getSource().getBindingContext("proposedModel").sPath;

            if(materialObj.Quantity === "0" || typeof materialObj.Quantity  == "undefined" || materialObj.Quantity === "0.00" ){

              sap.m.MessageBox.error("Please select quantity");
              return;
            }
            this.getView().getModel("proposedModel").setProperty(spath+"/isAddedToCart",true);


          }else if(oEvent.getSource().getBindingContext("itemSearchModel").getObject() ) {
            

            materialObj = JSON.parse( JSON.stringify( oEvent.getSource().getBindingContext("itemSearchModel").getObject()));
            materialObj.source = "S";
            var spath = oEvent.getSource().getBindingContext("itemSearchModel").sPath;

            if(materialObj.Quantity === "0" || typeof materialObj.Quantity  == "undefined" || materialObj.Quantity === "0.00" ){

              sap.m.MessageBox.error("Please select quantity");
              return;
            }
            this.getView().getModel("itemSearchModel").setProperty(spath+"/isAddedToCart",true);

          }



          if(materialObj.Quantity && Number(materialObj.Quantity) >1){

          }else{
            materialObj.Quantity = "1";
          }
         
          if(!this.getOwnerComponent().getModel("cartModel").getProperty("/materials")){
           
            this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
              {
                 
                  "materials": [materialObj]
              }
          ), "cartModel");
          }else{
          var materials =   this.getOwnerComponent().getModel("cartModel").getProperty("/materials");

          var isMatFound = false;
          materials.forEach(element => {
            
            if(element.Material === materialObj.Material && !materialObj.isFastEntry  && element.ItemNotes === materialObj.ItemNotes
               && element.SalesUnit === materialObj.SalesUnit && element.CurrentPrice === materialObj.CurrentPrice){
              isMatFound = true;
              element.Quantity = Number( element.Quantity) +Number(materialObj.Quantity);

            }
          });
          if(!materialObj.CurrentPrice_F){
materialObj.CurrentPrice_F =materialObj.CurrentPrice;
          }
          if(!isMatFound){
            materials.unshift(materialObj);
          } 
          
          // this.getOwnerComponent().setModel("cartModel").setProperty("/materials",materials);
          this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
            {
               
                "materials": materials
            }
        ), "cartModel");

          }


        this.isMaterialInCartProposed();
        this.isMaterialInCartSearch();
        this.calculateCountCart();
        },



        _onRouteMatched: function(oEvent){

          this.readGridListProposed();
          // this.getView().byId("smartListAllItems").setModel(this.getOwnerComponent().getModel("mainService"));
          // this.getView().byId("smartListAllItems").rebindList();
        },
        readGridListProposed: function(){


            let defaultModel1 = this.getOwnerComponent().getModel();
            var that = this;
            
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                pattern: "yyyy-MM-ddTHH:mm:ss"
            });



            var pwkenddate = oDateFormat.format(new Date());
            var customer =  this.getOwnerComponent().getModel("userValues").getProperty("/Customer");
            var salesorg= this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization");

            if(!customer){
              return;
            }

            if(!salesorg){
              return;
            }
   

            defaultModel1.read("" + ("/ZCSD_OENT_ITEMPROPOSAL(ValidityDate=datetime'"
            + encodeURIComponent(pwkenddate) + "',Customer='" + customer + "',SalesOrganization='" + salesorg + "')/Set"), {
                   urlParameters:{
                '$expand' : 'to_SalesUnit'
              },
                success: function (oData, oResponse) {
             
                  // oData.results.forEach(element => {
                    
                  // });
                  that.getView().setModel(new sap.ui.model.json.JSONModel(oData                   ), "proposedModel");
                  that.isMaterialInCartProposed();
                  that.isMaterialInCartSearch();
                
        
      
                },
      
                error: function (oError) {
      
                  that.getView().setModel(new sap.ui.model.json.JSONModel({}, "customerData1"));
                }
              });
              


        },

        onSearchItemSearch:function(oEvent){

          var searchText =  oEvent.getSource().getValue();

         var filterarr  = [
              new sap.ui.model.Filter({path:'Material', operator:sap.ui.model.FilterOperator.Contains, value1:searchText}),
              new sap.ui.model.Filter({path:'OldMaterial', operator:sap.ui.model.FilterOperator.Contains,  value1:searchText}),
              new sap.ui.model.Filter({path:'MaterialDescription', operator:sap.ui.model.FilterOperator.Contains,  value1:searchText})

              //,
              // new sap.ui.model.Filter({path:'FilterString', operator:sap.ui.model.FilterOperator.Contains,  value1:searchText})
  
            ];
          var farrayobj = new sap.ui.model.Filter({
              filters:  filterarr ,
              and: false,
            });
            // this.getView().byId("gridList1").getBinding("items").filter(farrayobj);

           

            if(searchText === '' || typeof searchText === 'undefined'){
              farrayobj = null;
            }


            this.getView().byId("gridList2").getBinding("items").filter(farrayobj);





            // let defaultModel1 = this.getOwnerComponent().getModel();
            // var that = this;
            
            // var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

            //     pattern: "yyyy-MM-ddTHH:mm:ss"
            // });



            // var pwkenddate = oDateFormat.format(new Date());
            // var customer =  this.getOwnerComponent().getModel("userValues").getProperty("/customer");
            // var salesorg= this.getOwnerComponent().getModel("userValues").getProperty("/salesorg");
            // var plant= this.getOwnerComponent().getModel("userValues").getProperty("/plant");
  

            // defaultModel1.read("" + ("/ZCSD_OENT_AVAILABLETOSELL(ValidityDate=datetime'"
            // + encodeURIComponent(pwkenddate) + "',Plant='" + plant + "',SalesOrganization='" + salesorg + "')/Set"), {
            //   urlParameters:{
            //     '$top' : '9999'
            //   },
            //   filters: [farrayobj],
            //     success: function (oData, oResponse) {
             
            //       // oData.results.forEach(element => {
                    
            //       // });
            //       that.getView().setModel(new sap.ui.model.json.JSONModel(oData                   ), "itemSearchModel");
      
            //       that.isMaterialInCartProposed();
            //       that.isMaterialInCartSearch();
      
            //     },
      
            //     error: function (oError) {
      
            //       that.getView().setModel(new sap.ui.model.json.JSONModel({}, "itemSearchModel"));
            //     }
            //   });
        },

        readGridListItemSearch: function(oEvent){

          let defaultModel1 = this.getOwnerComponent().getModel();
            var that = this;
            
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                pattern: "yyyy-MM-ddTHH:mm:ss"
            });



            var pwkenddate = oDateFormat.format(new Date());
            var customer =  this.getOwnerComponent().getModel("userValues").getProperty("/Customer");
            var salesorg= this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization");
            var plant= this.getOwnerComponent().getModel("userValues").getProperty("/Plant");

          

            if(!plant){
              return;
            }
  

            defaultModel1.read("" + ("/ZCSD_OENT_AVAILABLETOSELL(ValidityDate=datetime'"
            + encodeURIComponent(pwkenddate) + "',Plant='" + plant + "',SalesOrganization='" + salesorg + "')/Set"), {
              urlParameters:{
                '$top' : '9999'
              },
                success: function (oData, oResponse) {
             
                  // oData.results.forEach(element => {
                    
                  // });
                  that.getView().setModel(new sap.ui.model.json.JSONModel(oData                   ), "itemSearchModel");
                  that.isMaterialInCartProposed();
                  that.isMaterialInCartSearch();
        
      
                },
      
                error: function (oError) {
      
                  that.getView().setModel(new sap.ui.model.json.JSONModel({}, "itemSearchModel"));
                }
              });
        },

        onBeforeRebindList:function(oEvent){

            var oSmartTable = oEvent.getSource();
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                pattern: "yyyy-MM-ddTHH:mm:ss"
            });



            var pwkenddate = oDateFormat.format(new Date());
            var customer =  this.getOwnerComponent().getModel("userValues").getProperty("/Customer");
            var salesorg= this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization");
            



            oSmartTable.setListBindingPath("" + ("/ZCSD_OENT_ITEMPROPOSAL(ValidityDate=datetime'"
            + encodeURIComponent(pwkenddate) + "',Customer='" + customer + "',SalesOrganization='" + salesorg + "')/Set"));

            var oBindingParams = oEvent.getParameter( "bindingParams" );
   
            if( !oBindingParams.filters){
                oBindingParams.filters = [];
            }
        
          
            if(this.searchText){
            this._oGlobalFilter = [
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                new sap.ui.model.Filter({path:'Material', operator:sap.ui.model.FilterOperator.Contains, value1:""+this.searchText+""}),
                new sap.ui.model.Filter({path:'OldMaterial', operator:sap.ui.model.FilterOperator.Contains,  value1:""+this.searchText+""}),
                new sap.ui.model.Filter({path:'MaterialDescription', operator:sap.ui.model.FilterOperator.Contains,  value1:""+this.searchText+""})
    
              ];
            var farrayobj = new sap.ui.model.Filter({
                filters:  this._oGlobalFilter ,
                and: false,
              });
             

              oBindingParams.filters.push(farrayobj);
              this.searchText = undefined;
            }
         //     oBindingParams.filters.push( new Filter("SalesOrganization", FilterOperator.EQ, '4000'));
   
        },
        onBeforeRebindList1:function(oEvent){

            var oSmartTable = oEvent.getSource();
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                pattern: "yyyy-MM-ddTHH:mm:ss"
            });



            var pwkenddate = oDateFormat.format(new Date());
            var plant = this.getOwnerComponent().getModel("userValues").getProperty("/Plant");
            var salesorg= this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization");
            
            // var oBindingParams = oEvent.getParameter( "bindingParams" );
   
            // if( !oBindingParams.filters){
            //     oBindingParams.filters = [];
            // }
        
          
            // if(this.searchText){
            // this._oGlobalFilter = [
            //     //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            //     new sap.ui.model.Filter({path:'Material', operator:sap.ui.model.FilterOperator.Contains, value1:this.searchText}),
            //     new sap.ui.model.Filter({path:'OldMaterial', operator:sap.ui.model.FilterOperator.Contains,  value1:this.searchText}),
            //     new sap.ui.model.Filter({path:'MaterialDescription', operator:sap.ui.model.FilterOperator.Contains,  value1:this.searchText})
    
            //   ];
            // var farrayobj = new sap.ui.model.Filter({
            //     filters:  this._oGlobalFilter ,
            //     and: false,
            //   });
             

            //   oBindingParams.filters.push(farrayobj);
            //   this.searchText = undefined;
            // }
            //   oBindingParams.filters.push( new Filter("SalesOrganization", FilterOperator.EQ, this.getOwnerComponent().getModel("userValues").getProperty("/salesorg")));
            // //   oBindingParams.filters.push( new Filter("CustomerAccountGroup", FilterOperator.EQ, 'ZPR'));


            oSmartTable.setListBindingPath("" + ("/ZCSD_OENT_AVAILABLETOSELL(ValidityDate=datetime'"
            + encodeURIComponent(pwkenddate) + "',Plant='" + plant + "',SalesOrganization='" + salesorg + "')/Set"));
   
        },

        onSuggestItems: function(oEvent){

            // this.searchText =  oEvent.getSource().getValue();
            // this.getView().byId("smartListAllItems").rebindList();

           
            this.searchText =  oEvent.getSource().getValue();

            this._oGlobalFilter = [
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                new sap.ui.model.Filter({path:'Material', operator:sap.ui.model.FilterOperator.Contains, value1:this.searchText}),
                new sap.ui.model.Filter({path:'OldMaterial', operator:sap.ui.model.FilterOperator.Contains,  value1:this.searchText}),
                new sap.ui.model.Filter({path:'MaterialDescription', operator:sap.ui.model.FilterOperator.Contains,  value1:this.searchText})
    
              ];
            var farrayobj = new sap.ui.model.Filter({
                filters:  this._oGlobalFilter ,
                and: false,
              });
              this.getView().byId("gridList2").getBinding("items").filter(farrayobj);

             

              if(this.searchText === '' || typeof this.searchText === 'undefined'){
                this.getView().byId("gridList2").getBinding("items").filter([]);
              }
        },

        onSuggestItemsProposed: function(oEvent){
            this.searchText =  oEvent.getSource().getValue();

            this._oGlobalFilter = [
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                new sap.ui.model.Filter({path:'Material', operator:sap.ui.model.FilterOperator.Contains, value1:this.searchText}),
                new sap.ui.model.Filter({path:'OldMaterial', operator:sap.ui.model.FilterOperator.Contains,  value1:this.searchText}),
                new sap.ui.model.Filter({path:'MaterialDescription', operator:sap.ui.model.FilterOperator.Contains,  value1:this.searchText})
    
              ];
            var farrayobj = new sap.ui.model.Filter({
                filters:  this._oGlobalFilter ,
                and: false,
              });
              this.getView().byId("gridList1").getBinding("items").filter(farrayobj);

             

              if(this.searchText === '' || typeof this.searchText === 'undefined'){
                this.getView().byId("gridList1").getBinding("items").filter([]);
              }


            // this.getView().byId("smartListAllItemsProposal").rebindList();
        },



        onSuggestionItemSelected: function(oEvent){

          // var customer =  oEvent.mParameters.selectedRow.getBindingContext().getObject().Customer;
          // var customername =  oEvent.mParameters.selectedRow.getBindingContext().getObject().CustomerName;
         
          // this.getView().getModel("userValues").setProperty("/customer",customer);
          // this.getView().getModel("userValues").setProperty("/customername",customername);
         var obj = oEvent.mParameters.selectedRow.getBindingContext("mainService").getObject()
          var path = oEvent.getSource().getBindingContext("cartModel").sPath;

          this.getView().getModel("cartModel").setProperty(path+"/Material",obj.Material)
          this.getView().getModel("cartModel").setProperty(path+"/MaterialDescription",obj.MaterialDescription)
          this.getView().getModel("cartModel").setProperty(path+"/OldMaterial",obj.OldMaterial)
         // this.getView().getModel("cartModel").setProperty(path+"/qty",'1')
          this.getView().getModel("cartModel").setProperty(path+"/SalesUnit","CS")

     //     debugger;
     oEvent.getSource().getParent().getCells()[4].getItems()[1].getBinding("items").filter([new Filter({path:'Material',  operator:'EQ',value1:obj.Material})]);
     oEvent.getSource().getParent().getCells()[6].getItems()[1].getBinding("items").filter([new Filter({path:'Material',  operator:'EQ',value1:obj.Material})]);


          this.calculateCountCart();
       },
        onSuggestMaterials: function(oEvent){
          //  debugger;

          var query = oEvent.getSource().getValue();
            var suggestedRows = oEvent.getSource().getBinding("suggestionRows");
            var aFilters = [];
            var aFilters1 = [];
           
                            aFilters.push(new Filter({path:'OldMaterial',  operator:'Contains',value1:query}));
                            aFilters.push(new Filter({path:'Material',  operator:'Contains',value1:query}));
                            aFilters.push(new Filter({path:'SalesOrgMaterial',  operator:'Contains',value1:query}));

                            
                            aFilters.push(new Filter({path:'MaterialDescription',  operator:'Contains',value1:query}));
                            var farrayobj = new sap.ui.model.Filter({
                              filters:  aFilters ,
                              and: false,
                            });
                            var farrayobj1 = new sap.ui.model.Filter({
                              filters:  [farrayobj,
                                new Filter({path:'SalesOrganization',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization")}),
                                new Filter({path:'Plant',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/Plant")}),
   
                              
                              ] ,
                              and: true,
                            });
            suggestedRows.filter(farrayobj1);
        },


        onClearValues: function(oEvent){
          debugger;

          var spath = oEvent.getSource().getBindingContext("cartModel").sPath
          this.getView().getModel("cartModel").setProperty(spath+"/Material",'')
          this.getView().getModel("cartModel").setProperty(spath+"/OldMaterial",undefined)
          this.getView().getModel("cartModel").setProperty(spath+"/MaterialDescription",undefined)
          this.getView().getModel("cartModel").setProperty(spath+"/SalesUnit",undefined)
          this.getView().getModel("cartModel").setProperty(spath+"/Quantity",undefined)

        },
        openCart: function(){
          this.getOwnerComponent().getModel("userValues").setProperty("/layout","ThreeColumnsMidExpanded");

        },
        onAddTwo: function(oEvent){


          var fastentrylist = this.getOwnerComponent().getModel("cartModel").getData().materials;
          for(var count =0; count<2; count++){

            fastentrylist.push({
              Material: "",
              MaterialDescription: "",
              OldMaterial: "",
              Quantity: "",
              price: "",
              SalesUnit: "CS",
              
                ItemNotes : ''
             
            })
          }

                  this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
              {
                  
                  "materials": fastentrylist
              }
          ), "cartModel");

        },
        onAddOne: function(oEvent){


          var fastentrylist = this.getOwnerComponent().getModel("cartModel").getData().materials;
          for(var count =0; count<1; count++){

            fastentrylist.push({
              Material: "",
              MaterialDescription: "",
              OldMaterial: "",
              Quantity: "",
              price: "",
              SalesUnit: "CS",
              
                ItemNotes : ''
             
            })
          }

                  this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
              {
                  
                  "materials": fastentrylist
              }
          ), "cartModel");

        },
        AddFastItemsToCart: function(oEvent){

          var finalArray = [];
          var materials_a =  JSON.parse(JSON.stringify(this.getView().getModel("cartModel").getData().materials));

        var fastMaterialArray = [];

        materials_a.forEach(element => {
          
          if(element.Material){
            element.isFastEntry = true;
            fastMaterialArray.unshift(element);
          }
        });
          if(!this.getOwnerComponent().getModel("cartModel").getProperty("/materials")){
           
            this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
              {
                 
                  "materials": fastMaterialArray
              }
          ), "cartModel");
          }else{
          var cartmaterials =   this.getOwnerComponent().getModel("cartModel").getProperty("/materials");

        
          cartmaterials = JSON.parse(JSON.stringify(cartmaterials));
          fastMaterialArray.forEach(fastMaterial => {

            // var isMatFound = false;

            // cartmaterials.forEach(cartmaterial =>{
            //   if(cartmaterial.Material === fastMaterial.Material){
               
            //     if(fastMaterial.Quantity){
            //       cartmaterial.Quantity = Number(cartmaterial.Quantity) + Number(fastMaterial.Quantity);
            //     }
            //     isMatFound = true;
  
            //   }
            // })
            // if(!isMatFound){
              finalArray.unshift(fastMaterial);
            // } 
            
          });

          finalArray.forEach(element => {
            
            cartmaterials.unshift(element)
          });
         
          
          // this.getOwnerComponent().setModel("cartModel").setProperty("/materials",materials);
          this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
            {
               
                "materials": cartmaterials
            }
        ), "cartModel");

          }
          sap.m.MessageBox.success("All Items have been added to cart");
          
          // this.getOwnerComponent().getModel("userValues").setProperty("/layout","ThreeColumnsMidExpanded");

        },
        onChangeMaterial: function(oEvent){

          let defaultModel1 = this.getOwnerComponent().getModel();
          var that = this;
          
         

          var path = oEvent.getSource().getBindingContext("cartModel").sPath;
          var Filter = new sap.ui.model.Filter('Customer', 'EQ', customer);

          var filters = [];
          filters.push(new sap.ui.model.Filter({path:'SalesOrganization',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization")}));
          if(this.getOwnerComponent().getModel("userValues").getProperty("/Plant") && this.getOwnerComponent().getModel("userValues").getProperty("/Plant").trim() !== '')
          filters.push(new sap.ui.model.Filter({path:'Plant',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/Plant")}));
         
          var filterArray = [];
          filterArray.push(
            new sap.ui.model.Filter({path:'Material',  operator:'EQ',value1:oEvent.getSource().getValue().trim()}));
            filterArray.push(
              new sap.ui.model.Filter({path:'SalesOrgMaterial',  operator:'EQ',value1:oEvent.getSource().getValue().trim()})); 
              filterArray.push(
                new sap.ui.model.Filter({path:'OldMaterial',  operator:'EQ',value1:oEvent.getSource().getValue().trim()}));

                var farrayobj = new sap.ui.model.Filter({
                  filters:  filterArray ,
                  and: false,
                });

                filters.push(farrayobj);

          defaultModel1.read("/ZI_MATERIAL_VALUEHELP", {
              
           
            filters: filters  ,
              success: function (oData, oResponse) {
           
                if(oData.results.length >0){
                  that.getView().getModel("cartModel").setProperty(path+"/Material",oData.results[0].Material)

                that.getView().getModel("cartModel").setProperty(path+"/OldMaterial",oData.results[0].OldMaterial)
                that.getView().getModel("cartModel").setProperty(path+"/MaterialDescription",oData.results[0].MaterialDescription)
                // that.getView().getModel("cartModel").setProperty(path+"/SalesUnit",'')

                oEvent.getSource().getParent().getCells()[4].getBinding("items").filter([new Filter({path:'Material',  operator:'EQ',value1:oData.results[0].Material})]);


                }else{
                  that.getView().getModel("cartModel").setProperty(path+"/Material","")
                
                  that.getView().getModel("cartModel").setProperty(path+"/OldMaterial","")
                  that.getView().getModel("cartModel").setProperty(path+"/MaterialDescription","")
                  that.getView().getModel("cartModel").setProperty(path+"/Quantity","1")
                  that.getView().getModel("cartModel").setProperty(path+"/SalesUnit","CS")

                }
  

      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "customerData1"));
              }
            });
          
        },

        calculateCountCart: function(){

          var matList = this.getOwnerComponent().getModel("cartModel").getProperty("/materials");

          var count = 0;
          matList.forEach(element => {
            if(element.Material !== ''){

              count++;
            }
            
          });
          // this.getView().setModel(new sap.ui.model.json.JSONModel({cartItemsCount: count}), "countModel");
        //  this.getView().setModel(new sap.ui.model.json.JSONModel({cartItemsCount: 0}), "countModel");
        //  this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({cartItemsCount: count}), "countModel");
          this.getOwnerComponent().getModel("countModel").setProperty("/cartItemsCount",count)

          this.onAddOne();
        }

    });
});
