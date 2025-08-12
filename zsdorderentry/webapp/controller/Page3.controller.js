sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zsdorderentry.controller.Page3", {
        onInit: function () {

            // Final Cart screen
            // All items selected and Qty with price(per item) which user can change

        },
        
        closeCart: function(oEvent){
            this.getOwnerComponent().getModel("userValues").setProperty("/layout","TwoColumnsMidExpanded");

        },
        removeCartItem : function(oEvent){

            var spath = oEvent.getSource().getParent().getBindingContext("cartModel").sPath;

            var materials =  this.getOwnerComponent().getModel("cartModel").getData().materials;
           var finalArray =  materials.splice(spath.split("materials/")[1].trim(),1);
           this.getOwnerComponent().getModel("cartModel").setData({"materials":materials});

        },

        placeOrder: async function(oEvent){

      var isDelDateDifferet =    await this.triggerDeliveryDateFetch();
      if(isDelDateDifferet){
        sap.m.MessageBox.error("Delivery Date is different than initially set. Please check the revised delivery date again")
      }
      console.log("Del Date Different " + isDelDateDifferet);
            var varray = [];
            var that = this;

            var materials =  this.getOwnerComponent().getModel("cartModel").getData().materials;

            materials.forEach(element => {
                var obj1 = {};

              
                obj1.Matnr = element.Material;
                obj1.Kwmeng = element.Quantity+""; //Order quantity
                obj1.Vrkme =  element.SalesUnit+""; //Sales Unit
                obj1.Kbetr =  element.CurrentPrice+""; //Amount
                obj1.Kmein =  element.CurrentPriceUnit; // Price Unit
                obj1.Inotes =  element.ItemNotes; //Item Notes
                if(element.Material!== "")
                varray.push(obj1);





            });

            var isQtyEmpty = false;
            var isMatEmpty = "";

            varray.forEach(element => {
              
              if(element.Kwmeng === 0 || element.Kwmeng === "" ||  element.Kwmeng === "0"){

                isQtyEmpty = true;
                isMatEmpty = element.Matnr;

               
               
               
              }
            });

            if(isQtyEmpty){
              sap.m.MessageBox.error("Please enter quantity for material "+isMatEmpty);
              return;
            }
            

            var obj1 = {
                "Vkorg": this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization"),
                "Werks" :this.getOwnerComponent().getModel("userValues").getProperty("/Plant"),
                "Kunnr" : this.getOwnerComponent().getModel("userValues").getProperty("/Plant"),
                "DeliveryDate": this.getOwnerComponent().getModel("userValues").getProperty("/deldate"),
                "Bstnk" :this.getOwnerComponent().getModel("userValues").getProperty("/ponumber"),
                "OrdDetInSet" : varray,
                "Bstnk": "Test PO",
                "Deptmnt": "",
                "Emode": "S",
                "Mattyp": "N",
                "ProcessMode": "SP",
                "OrderOut": [{}],
"OrderReturn": [{}]
            };


            let prodSet = this.getOwnerComponent().getModel("ZODATA_ORDER_ENTRY_SRV");


            prodSet.create("/OrdHeadInSet", obj1, {
                success: function (result) {
                  // everything is OK 
                  that.getView().setBusy(false);
                 
      
                  sap.m.MessageBox.success("Order " + result.OrderOut.results[0].Entryno + " was created successfully");
                  that.reset();
                  
      
      
                },
                error: function (err) {
                  // some error occuerd 
                  that.getView().setBusy(false);
                
      
      
      
                  if(JSON.parse(err.responseText).error.message.value){
                    sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value );
      
                  }else{
                    sap.m.MessageBox.error("There is an issue in creating new order. Please check data and try again." );
                  }
      
                  
      
                }
              }
      
              );
        },

        reset: function(){

          this.getOwnerComponent().getModel("cartModel").setData({"materials":[]});
          this.getOwnerComponent().getModel("userValues").setProperty("/layout","TwoColumnsMidExpanded");
          this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({cartItemsCount: 0}), "countModel");

          this.getOwnerComponent().getModel("userValues").setProperty("/Customer","");
           this.getOwnerComponent().getModel("userValues").setProperty("/customername","");
           this.getOwnerComponent().getModel("userValues").setProperty("/Plant","");
           this.getOwnerComponent().getModel("userValues").setProperty("/plantname","");
           this.getOwnerComponent().getModel("userValues").setProperty("/SalesOrganization","");


           this.getView().getParent().getParent().getCurrentBeginColumnPage().getController().ResetMaterialSelection();





        },

        triggerDeliveryDateFetch: function(){



          return new Promise((resolve) => {
             
         

            let defaultModel1 = this.getOwnerComponent().getModel();
            var that = this;
            
           
  
  
            var filters = [];
            filters.push(new sap.ui.model.Filter({path:'SalesOrganization',  operator:'EQ',value1:this.getOwnerComponent().getModel("userValues").getProperty("/SalesOrganization")}));

  
            defaultModel1.read("/ZCSD_NEXTDELIVERYDATE", {
                
             
              filters: filters  ,
                success: function (oData, oResponse) {
             
  
                if(oData.results[0] && oData.results[0].NextDeliveryDate){
                  var nextdelivDate = oData.results[0].NextDeliveryDate;

                  if(nextdelivDate.toDateString() !== that.getOwnerComponent().getModel("userValues").getProperty("/deldate").toDateString()){

                    sap.m.MessageBox.error("Delivery Date is different");
                    that.getOwnerComponent().getModel("userValues").setProperty("/deldate",nextdelivDate);

                    resolve(true);
                  }else{
                    resolve(false);
                  }
  
                 
                }else{
                  that.getOwnerComponent().getModel("userValues").setProperty("/deldate",null);
                  resolve(false);
  
                }
              
 
                },
      
                error: function (oError) {
      
                  that.getView().setModel(new sap.ui.model.json.JSONModel({}, "customerData1"));
                  resolve(x);
                }
              });
  
            });
          
        }
    });
});
