sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zmmxref.controller.View1", {
        onInit: function () {

            // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // oRouter.getRoute("RouteView1").attachMatched(this._onRouteMatched, this);

            var that = this;
             setTimeout(() => {

                if(that.getView().byId("smartFilterBar")._oSmartVariantManagement.mProperties.defaultVariantKey === '*standard*'){

                if(that.getOwnerComponent().oComponentData.startupParameters.SAPSalesOrganization){

               var filterData = {"SAPSalesOrganization":that.getOwnerComponent().oComponentData.startupParameters.SAPSalesOrganization[0]};
                that.getView().byId("smartFilterBar").setFilterData(filterData);
                }

                if(that.getOwnerComponent().oComponentData.startupParameters.Plant){
                var filterData = {"Werks":that.getOwnerComponent().oComponentData.startupParameters.Plant[0]};
                that.getView().byId("smartFilterBar").setFilterData(filterData);
                }

                if(that.getOwnerComponent().oComponentData.startupParameters.Vkorg){

                var filterData = {"Vkorg":that.getOwnerComponent().oComponentData.startupParameters.Vkorg[0]};
                that.getView().byId("smartFilterBar").setFilterData(filterData);
                }
                
            }
  
             }, 1000);

        },
        onSelectMaterial: function(oEvent){
         //   debugger;
        },

        onSelectEmptyMaterials: function(oEvent){

         //   debugger;
            var selectedValue = oEvent.mParameters.selected;
            if(selectedValue === true){
            // this.getView().byId("smartFilterBar").setFilterData({"Material": ''});
            this.getView().setModel(new sap.ui.model.json.JSONModel({ empty: true })
            , "materialModel");
            }else{
                this.getView().setModel(new sap.ui.model.json.JSONModel({ empty: false })
                , "materialModel");
            }
            this.getView().byId("LineItemSmartTable").rebindTable();

        },
        onBeforeRebindTable: function(oEvent){

            var oBindingParams = oEvent.getParameter( "bindingParams" );
   

        
          
            if(this.getView().getModel("materialModel")){
            var emptyMat = this.getView().getModel("materialModel").getProperty("/empty");
             
  
            if(emptyMat){
                var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, '');
                oBindingParams.filters.push(oFilter);   
            }else{
                this.getView().byId("smartFilterBar").getControlByKey("Material").removeAllTokens();

            }
        }
             
        },








        onSaveMaterial: function(oEvent) {
          //  MessageToast.show("Custom handler invoked.");
       //     debugger;
            var that = this;
            var obj = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
       
            obj.Matnr = oEvent.getSource().getParent().getItems()[0].getValue();
            if(!oEvent.getSource().getParent().getParent().getBindingContext() || !obj.Matnr){

                sap.m.MessageBox.error("Please select material");
                return;
            }

            this.sendXREFReqMaterial(obj.Product,obj.Vkorg,obj.Matnr,obj.Cimage,obj.Werks            );
        },
        onSaveNote: function(oEvent){
            var that = this;
            var obj = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
        
            this.sendXREFReqNote(obj.Product,obj.Vkorg,oEvent.getSource().getParent().getItems()[0].getValue().trim()        );
        },

        sendXREFReqMaterial: function (product,vkorg,matnr,cimage,werks) {

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.porky.com/sap/zws_bc_bapi/ZBAPI_BCZbapiUpdCoXref', true);

            if(window.location.href.includes("DE2") || window.location.href.includes("de2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'DE2');
            }else if(window.location.href.includes("QA2") || window.location.href.includes("qa2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'QA2');
            }else{
            xhr.setRequestHeader('X-PORKY-SYSID', 'PRD');
            }
         //   xhr.setRequestHeader('X-PORKY-SYSID', 'PRD');

            xhr.setRequestHeader('X-PORKY-AUTH', 'cm1lbGxveTpsdWNreW1l');
            xhr.withCredentials = true;
            xhr.setRequestHeader('X-PORKY-APPID', 'XREF Tool');
            xhr.setRequestHeader('X-PORKY-APIKEY', '6bb0b04a-0466-490e-a8a5-53278b3df025');
            xhr.setRequestHeader('Authorization', 'Basic cm1lbGxveTpsdWNreW1l');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            var that = this;
            this.xhr = xhr;
            xhr.onload = function (e) {
                // do something to response
                //   console.log(that.xhr);
            //     console.log("Success -" + this.responseText);
            //  //   that.getView().byId("page").setTitle(this.responseText);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //         JSON.parse(this.responseText)
            //     ), "orderInfoModel");
            // debugger;

            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var res = JSON.parse(xhr.response);
                    console.log(that.xhr);
                    console.log(res);
                    if(res.return.type === 'E'                    ){
                        sap.m.MessageBox.error("There is an error submitting this material. '"+res.return.message+"'"
                        );

                        return;
                    }
                    // debugger;
                    sap.m.MessageBox.show("Material is updated successfully");
                    that.getView().byId("LineItemSmartTable").rebindTable();
                }else{
                   // sap.m.MessageBox.error("There is an error updating material");

                }
            };
            var data = {
                "product": product, // product ID from above call
                "vkorg": vkorg, //same as above get from user parm
                "matnr" : matnr,
                "cimage": cimage, // copy from getdetail call,
                "werks": werks
                };
            xhr.send(JSON.stringify(data));
        },

        sendXREFReqNote: function (product,vkorg,notes) {

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.porky.com/sap/zws_bc_bapi/ZBAPI_BCZbapiUpdNotesXref', true);

            if(window.location.href.includes("DE2") || window.location.href.includes("de2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'DE2');
            }else if(window.location.href.includes("QA2") || window.location.href.includes("qa2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'QA2');
            }else{
            xhr.setRequestHeader('X-PORKY-SYSID', 'PRD');
            }
           // xhr.setRequestHeader('X-PORKY-SYSID', 'PRD');
            xhr.setRequestHeader('X-PORKY-AUTH', 'cm1lbGxveTpsdWNreW1l');
            xhr.withCredentials = true;
            xhr.setRequestHeader('X-PORKY-APPID', 'XREF Tool');
            xhr.setRequestHeader('X-PORKY-APIKEY', '6bb0b04a-0466-490e-a8a5-53278b3df025');
            xhr.setRequestHeader('Authorization', 'Basic cm1lbGxveTpsdWNreW1l');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            var that = this;
            this.xhr = xhr;
            xhr.onload = function (e) {
                // do something to response
                //   console.log(that.xhr);
            //     console.log("Success -" + this.responseText);
            //  //   that.getView().byId("page").setTitle(this.responseText);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //         JSON.parse(this.responseText)
            //     ), "orderInfoModel");
            // debugger;

            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var res = JSON.parse(xhr.response);
                    console.log(that.xhr);
                    console.log(res);
                    // debugger;

                    if(res.return.type === 'E'                    ){
                        sap.m.MessageBox.error("There is an error submitting this note. '"+res.return.message+"'"
                        );

                        return;
                    }
                    sap.m.MessageBox.show("Note has been submitted successfully");
                    that.getView().byId("LineItemSmartTable").rebindTable();

                }else{
                //    sap.m.MessageBox.error("There is an error submitting this note");
                }
            };
            var notesArray = notes.split(0,255);
            var notePush = [];
            notesArray.forEach(element => {
                notePush.push({'Line' :element})
            });
            var data = {
                "product": product, // product ID from above call
                "vkorg": vkorg, //same as above get from user parm
                "notes" : notePush,
                };
            xhr.send(JSON.stringify(data));
        },
    });
});
