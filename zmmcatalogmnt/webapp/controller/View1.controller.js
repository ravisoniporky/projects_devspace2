const delay = ms => new Promise(res => setTimeout(res, ms));

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller,Dialog,JSONModel,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("customer.porky.zmmcatalogmnt.controller.View1", {
        onInit: function () {

          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteView1").attachMatched(this._onRouteMatched, this);


        },
        onPressExcludeCOMMODITY: function(oEvent){
          var table = this.getView().byId("smartTable_custF4_map");
          var that = this;

          var index = table.getTable().getSelectedIndices()[0];

          var object = table.getTable().getBinding("rows").getContextByIndex(index).getObject()

          // that.exitDialog = new Dialog({
          //   type: sap.m.DialogType.Message,
          //   title: "Confirm",
          //   content: new sap.m.Text({ text: "Are you sure you want to exclude commodity " +object.COMMODITY+" ?" }),
          //   buttons: [new sap.m.Button({
          //     width:"100px",
              
          //     type: sap.m.ButtonType.Emphasized,
          //     text: "Yes",
          //     press: function () {
           
              
          //       that.exitDialog.close();
          //       that.createExclusinBrandRecord(object,"COMMODITY",object.COMMODITY)
                
          //     }.bind(that)
          //   }),new sap.m.Button({
          //     width:"100px",
          //     type: 'Negative',
          //     text: "No",
          //     press: function () {
          //       that.exitDialog.close();
          //     }.bind(that)
          //   })
          // ]
          // });
          // this.exitDialog.open();







          var that = this;
          this.exitDialog = new Dialog({
            type: sap.m.DialogType.Message,
            title: "Confirm",
            content: new sap.m.Text({ text: "Do you want to take this action for all materials under commodity - "+object.COMMODITY+" or select materials ?" }),
            buttons: [new sap.m.Button({
              width:"100px",
              
              type: sap.m.ButtonType.Emphasized,
              text: "COMMODITY",
              press: function () {
           
              
                that.exitDialog.close();
                // selectedIndices.forEach(element => {
                //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                //   });

                that.createExclusinBrandRecord(object,"COMMODITY",object.COMMODITY)
                
              }.bind(that)
            }),new sap.m.Button({
              width:"200px",
              
              type: sap.m.ButtonType.Emphasized,
              text: "Specific Materials",
              press: function () {
           
              
                that.exitDialog.close();
                this.getView().byId("smartFilter_custF4_map").setFilterData({
                  "COMMODITY":object.COMMODITY
      
                })   ;
                // debugger;
                this.getView().byId("smartFilter_custF4_map").getControlByKey("COMMODITY").setVisible(true);
                this.getView().byId("smartTable_custF4_map").rebindTable();
                setTimeout(() => {
                  that.getView().byId("smartTable_custF4_map").getTable().selectAll();
                  
                }, 1000);
                // selectedIndices.forEach(element => {
                //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                //   });
                
              }.bind(that)
            }),new sap.m.Button({
              width:"100px",
              type: 'Negative',
              text: "No",
              press: function () {
                that.exitDialog.close();
              }.bind(that)
            })
          ]
          });
          this.exitDialog.open();



        },
        onPressExcludeMat: function(oEvent){

          var table = this.getView().byId("smartTable_custF4_map");
          // var selectedIndex =table.getTable().getSelectedIndices()[0];
          var that = this;

          var index = table.getTable().getSelectedIndices()[0];

          var object = table.getTable().getBinding("rows").getContextByIndex(index).getObject()

          that.exitDialog = new Dialog({
            type: sap.m.DialogType.Message,
            title: "Confirm",
            content: new sap.m.Text({ text: "Are you sure you want to exclude material " +object.MATNR+" ?" }),
            buttons: [new sap.m.Button({
              width:"100px",
              
              type: sap.m.ButtonType.Emphasized,
              text: "Yes",
              press: function () {
           
              
                that.exitDialog.close();
                that.createExclusinBrandRecord(object,"MATNR",object.MATNR)
                
              }.bind(that)
            }),new sap.m.Button({
              width:"100px",
              type: 'Negative',
              text: "No",
              press: function () {
                that.exitDialog.close();
              }.bind(that)
            })
          ]
          });
          this.exitDialog.open();

        },
        onPressExcludeOldMat: function(oEvent){

          var table = this.getView().byId("smartTable_custF4_map");
          // var selectedIndex =table.getTable().getSelectedIndices()[0];
          var that = this;

 var index = table.getTable().getSelectedIndices()[0];

          var object = table.getTable().getBinding("rows").getContextByIndex(index).getObject()
          that.exitDialog = new Dialog({
            type: sap.m.DialogType.Message,
            title: "Confirm",
            content: new sap.m.Text({ text: "Are you sure you want to exclude old material " +object.BISMT+" ?" }),
            buttons: [new sap.m.Button({
              width:"100px",
              
              type: sap.m.ButtonType.Emphasized,
              text: "Yes",
              press: function () {
           
              
                that.exitDialog.close();
                that.createExclusinBrandRecord(object,"BISMT",object.BISMT)
                
              }.bind(that)
            }),new sap.m.Button({
              width:"100px",
              type: 'Negative',
              text: "No",
              press: function () {
                that.exitDialog.close();
              }.bind(that)
            })
          ]
          });
          this.exitDialog.open();

        },
        OnExcludeBrand: function(oEvent){
          debugger;

          var table = this.getView().byId("smartTable_custF4_map");
          // var selectedIndex =table.getTable()/.getSelectedIndices()[0];
          var that = this;

          var index = table.getTable().getSelectedIndices()[0];

          var object = table.getTable().getBinding("rows").getContextByIndex(index).getObject()
          // that.exitDialog = new Dialog({
          //   type: sap.m.DialogType.Message,
          //   title: "Confirm",
          //   content: new sap.m.Text({ text: "Are you sure you want to exclude brand " +object.BRAND+" ?" }),
          //   buttons: [new sap.m.Button({
          //     width:"100px",
              
          //     type: sap.m.ButtonType.Emphasized,
          //     text: "Yes",
          //     press: function () {
           
              
          //       that.exitDialog.close();
          //       that.createExclusinBrandRecord(object,"BRAND",object.BRAND)
                
          //     }.bind(that)
          //   }),new sap.m.Button({
          //     width:"100px",
          //     type: 'Negative',
          //     text: "No",
          //     press: function () {
          //       that.exitDialog.close();
          //     }.bind(that)
          //   })
          // ]
          // });

          // this.exitDialog.open();












          var that = this;
          this.exitDialog = new Dialog({
            type: sap.m.DialogType.Message,
            title: "Confirm",
            content: new sap.m.Text({ text: "Do you want to take this action for all materials under brand - "+object.BRAND+" or select materials ?" }),
            buttons: [new sap.m.Button({
              width:"100px",
              
              type: sap.m.ButtonType.Emphasized,
              text: "Brand",
              press: function () {
           
              
                that.exitDialog.close();
                // selectedIndices.forEach(element => {
                //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                //   });

                that.createExclusinBrandRecord(object,"BRAND",object.BRAND)
                
              }.bind(that)
            }),new sap.m.Button({
              width:"200px",
              
              type: sap.m.ButtonType.Emphasized,
              text: "Specific Materials",
              press: function () {
           
              
                that.exitDialog.close();
                this.getView().byId("smartFilter_custF4_map").setFilterData({
                  "BRAND":object.BRAND
      
                })   ;
                debugger;
                this.getView().byId("smartFilter_custF4_map").getControlByKey("BRAND").setVisible(true);
                this.getView().byId("smartTable_custF4_map").rebindTable();
                setTimeout(() => {
                  that.getView().byId("smartTable_custF4_map").getTable().selectAll();
                  
                }, 1000);
                // selectedIndices.forEach(element => {
                //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                //   });
                
              }.bind(that)
            }),new sap.m.Button({
              width:"100px",
              type: 'Negative',
              text: "No",
              press: function () {
                that.exitDialog.close();
              }.bind(that)
            })
          ]
          });
          this.exitDialog.open();



          
        },
        onApplyBrandExclusion: function(oEvent){

          var table = this.getView().byId("st_brandtable");
          var selectedIndices =table.getTable().getSelectedIndices();

     //     table.getTable().getBinding("rows").getContextByIndex(table.getTable().getSelectedIndices()[0])


          selectedIndices.forEach(element => {
            
            this.createExclusinBrandRecord( table.getTable().getBinding("rows").getContextByIndex(element).getObject());
          });
        },
        createExclusinBrandRecord: function (object,field,fieldvalue){

          var newObj = {};

          newObj.CatalogField = field;
          newObj.SalesOrganization = object.SalesOrganization;
          newObj.CatalogFieldValue = fieldvalue;
          newObj.CatalogId = object.ZCATALOG;
          // newObj.Material = object.MATNR;
          // newObj.OldMaterialNumber = object.BISMT;
          // newObj.Brand = object.BRAND;

          // if(field === 'BRAND'){
          //   newObj.Brand = fieldvalue;
          // }
          // if(field === 'MATNR'){
          //   newObj.Material = fieldvalue;
          // }
          // if(field === 'BISMT'){
          //   newObj.OldMaterialNumber = fieldvalue;
          // }
          
          newObj.LineId = '99';
          var that = this;

          // {"CatalogId":"KRASDALE",
          //   "SalesOrganization":"3000",
          //   "CatalogField":"BRAND","LineId":"000099","Department":"E","CatalogFieldValue":"Prdu","__metadata":{"type":"cds_zsv_c_mobilecatalog.ZCSD_MOBILECATALOGExclusionType"}}

          



          let prodSet = this.getOwnerComponent().getModel();


          prodSet.create("/ZCSD_MOBILECATALOGExclusion", newObj, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              sap.m.MessageBox.success("The exclusion by "+field+" - "+fieldvalue+" is successfully completed" );
    
              that.getView().byId("smartTable_custF4_map").rebindTable();
  
            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);
            
  
              if(JSON.parse(err.responseText).error.message.value){
                sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value );
  
              }else{
                sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
              }
  
              
  
            }
          }
  
          );

          



         
        },
        _onRouteMatched: async function(oEvent){

          var obj = this.getOwnerComponent().getModel("shiptoUserModel").getData();

          await delay(500);
          this.getView().byId("smartFilter_custF4_map").setFilterData({
            "$Parameter.p_kunwe":obj.Shipto,
            "$Parameter.p_vkorg":obj.SalesOrganization,
            "ZCATALOG":obj.CatalogId,
            "$Parameter.p_ats":obj.ATS,
            "$Parameter.p_itemproposal":"Y"

          })   ;
          this.getView().byId("smartTable_custF4_map").rebindTable();
          this.getView().byId("smartFilter_custF4_map").validateMandatoryFields();


        },
        onBeforeRebindTable: function(oEvent){




            var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData()            ;
            var p_kunwe = filterData['$Parameter.p_kunwe'];
            var p_vkorg = filterData['SalesOrganization'];
            var ZCATALOG = filterData['ZCATALOG'];
            var p_ats = filterData['$Parameter.p_ats'];
            var p_itemproposal = filterData['$Parameter.p_itemproposal'];

            this.setEorIFlag(p_vkorg,ZCATALOG);





            
            // var stringPath = "/ZCSD_E_MobileItemList(p_vkorg='" + p_vkorg +"',p_kunwe='"+p_kunwe+"',p_ats='"+p_ats+"',p_itemproposal='"+p_itemproposal+"')/Set";

            // stringPath= (stringPath);
            // oEvent.getSource().setTableBindingPath(stringPath);


        },





        setEorIFlag: function(vkorg,zcatalog){

       //   /sap/opu/odata/sap/ZSB_C_MOBILECATALOG/ZI_MobileCatalogVH(SalesOrganization='3000',CatalogName='')


       let prodSet = this.getOwnerComponent().getModel();
          var that = this;

          if(typeof zcatalog === 'undefined'){
            zcatalog = "";
          }

       prodSet.read("/ZI_MobileCatalogVH(SalesOrganization='"+vkorg+"',CatalogName='"+zcatalog+"')", {
        success: function (oData, oResponse) {
          debugger;

          var cataflag = oData.IeFlag;


          var model = that.getOwnerComponent().getModel("GlobalModel");
			model.setProperty("/CatalogType",cataflag);
          


        
            


            


        },

        error: function (oError) {

        }
    });
        },


        onRemoveExclusionList: function(oEvent){

       //   debugger;

        

          let prodSet = this.getOwnerComponent().getModel();
          var that = this;

          if(oEvent.getSource().getBindingContext().getObject().CatalogField === "BRAND"){

            this.onExcludeRemoveBrand(oEvent.getSource().getBindingContext().getObject().CatalogFieldValue,oEvent.getSource().getBindingContext().getPath());
            return;
          }


          prodSet.remove(oEvent.getSource().getBindingContext().getPath(), {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              sap.m.MessageBox.success("The exclusion is successfully removed" );
              that.getView().byId("sfTableExclude").rebindTable();
  
  
            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);
            
  
              if(JSON.parse(err.responseText).error.message.value){
                sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value );
  
              }else{
                sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
              }
  
              
  
            }
          }
  
          );
        },


        onRemoveExclusionListByObject: function(path){

          //   debugger;
   
           
   
             let prodSet = this.getOwnerComponent().getModel();
             var that = this;
   
   
             prodSet.remove(path, {
               success: function (result) {
                 // everything is OK 
                 that.getView().setBusy(false);
               //  sap.m.MessageBox.success("The exclusion is successfully removed" );
                 that.getView().byId("sfTableExclude").rebindTable();
     
     
               },
               error: function (err) {
                 // some error occuerd 
                 that.getView().setBusy(false);
               
     
                 if(JSON.parse(err.responseText).error.message.value){
                   sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value );
     
                 }else{
                   sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
                 }
     
                 
     
               }
             }
     
             );
           },

        onShowExcludingList : function(oEvent){
            var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData()            ;
            // var p_kunwe = filterData['$Parameter.p_kunwe'];
            var p_vkorg = filterData.SalesOrganization            ;
            var p_catalog = filterData['ZCATALOG'];
            // var p_ats = filterData['$Parameter.p_ats'];
            // var p_itemproposal = filterData['$Parameter.p_itemproposal'];

            if(p_vkorg && p_catalog){

                this.salesorg = p_vkorg;
                this.catalog = p_catalog;
                this.onOpenExlusionList();

            }else{

                sap.m.MessageBox.error("Please select Catalog and Sales Organization");
            }

        },

        onOpenExlusionList: function () {
            // create dialog lazily
            if (!this.pDialogUser) {
              this.pDialogUser = this.loadFragment({
                name: "customer.porky.zmmcatalogmnt.view.exclusionF4"
              });
            } else {
    
              if (this.pDialogUser1) {
                this.pDialogUser1.destroy();
                this.pDialogUser = undefined;
                this.pDialogUser1 = undefined;
                this.pDialogUser = this.loadFragment({
                  name: "customer.porky.zmmcatalogmnt.view.exclusionF4"
                });
              }
            }
            var that = this;
            this.pDialogUser.then(function (oDialog) {
    
              that.pDialogUser1 = oDialog;
    
              oDialog.open();
              var oFilter = [];
              oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.salesorg));
              oFilter.push(new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, that.catalog));
   
              oDialog.getBinding("items").filter(oFilter);
         
    
            });
            var that = this;
            this.getView().addDependent(this.pDialogUser);
          },



          onOpenInlusionList: function (oEvent) {
            // create dialog lazily

            if(this.getView().byId("smartTable_custF4_map").getTable().getSelectedItems().length !==1            ){
              sap.m.MessageBox.error("Please select only one item")
              return;
            }else{
             this.selectedBrand = this.getView().byId("smartTable_custF4_map").getTable().getSelectedContexts()[0].getObject().BRAND;

            }
            if (!this.pDialogUser_2) {
              this.pDialogUser_2 = this.loadFragment({
                name: "customer.porky.zmmcatalogmnt.view.inclusionF4"
              });
            } else {
    
              if (this.pDialogUser2) {
                this.pDialogUser2.destroy();
                this.pDialogUser_2 = undefined;
                this.pDialogUser2 = undefined;
                this.pDialogUser_2 = this.loadFragment({
                  name: "customer.porky.zmmcatalogmnt.view.inclusionF4"
                });
              }
            }
            var that = this;
            this.pDialogUser_2.then(function (oDialog) {
    
              that.pDialogUser2 = oDialog;
    
              oDialog.open();
              // var oFilter = [];
              // oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.salesorg));
              // oFilter.push(new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, that.catalog));
   
              // oDialog.getBinding("items").filter(oFilter);
         
    
            });
            var that = this;
            this.getView().addDependent(this.pDialogUser_2);
          },

          onBeforeRebindExclusion: function(oEvent){


            var oBindingParams = oEvent.getParameter( "bindingParams" );
   

        
          
             
  
                var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.salesorg);
                oBindingParams.filters.push(oFilter);    
                var oFilter = new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, this.catalog);
                oBindingParams.filters.push(oFilter);

            
        
          },



          onBeforeRebindInclusion: function(oEvent){


            var oBindingParams = oEvent.getParameter( "bindingParams" );
   
                // var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.salesorg);
                // oBindingParams.filters.push(oFilter);    
               


                var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData()            ;
                var p_kunwe = filterData['$Parameter.p_kunwe'];
                var p_vkorg = filterData['$Parameter.p_vkorg'];
                var p_catalog = filterData['ZCATALOG'];
                var p_ats = filterData['$Parameter.p_ats'];
                var p_itemproposal = filterData['$Parameter.p_itemproposal'];
                
    
    
             
    
    
                
                var stringPath = "/ZCSD_E_MobileItemList(p_vkorg='" + p_vkorg +"',p_kunwe='"+p_kunwe+"',p_ats='"+p_ats+"',p_itemproposal='"+p_itemproposal+"')/Set";
    
                stringPath= (stringPath);
                oEvent.getSource().setTableBindingPath(stringPath);


                if(p_catalog){
                var oFilter = new sap.ui.model.Filter("ZCATALOG", sap.ui.model.FilterOperator.EQ, p_catalog);
                oBindingParams.filters.push(oFilter);


                this.selectedBrand =     this.getView().byId("smartTable_custF4_map").getTable().getSelectedContexts()[0].getObject().BRAND;

    
                }


                if(this.selectedBrand){
                  var oFilter = new sap.ui.model.Filter("BRAND", sap.ui.model.FilterOperator.EQ, this.selectedBrand);
                  oBindingParams.filters.push(oFilter);
  
  
  
      
                  }


        
          },

          onExcludeRemoveBrand: function(brand,path){


            var that = this;
            this.exitDialog = new Dialog({
              type: sap.m.DialogType.Message,
              title: "Confirm",
              content: new sap.m.Text({ text: "Do you want to take this action for all materials under brand or select materials ?" }),
              buttons: [new sap.m.Button({
                width:"100px",
                
                type: sap.m.ButtonType.Emphasized,
                text: "Brand",
                press: function () {
             
                
                  that.exitDialog.close();
                  // selectedIndices.forEach(element => {
                  //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                  //   });

                  that.onRemoveExclusionListByObject(path);
                  
                }.bind(that)
              }),new sap.m.Button({
                width:"200px",
                
                type: sap.m.ButtonType.Emphasized,
                text: "Specific Materials",
                press: function () {
             
                
                  that.exitDialog.close();
                  this.getView().byId("exclusionSF").setFilterData({
                    "Brand":brand
        
                  })   ;
                  this.getView().byId("sfTableExclude").rebindTable();
                  setTimeout(() => {
                    that.getView().byId("sfTableExclude").getTable().selectAll();
                    
                  }, 1000);
                  // selectedIndices.forEach(element => {
                  //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                  //   });
                  
                }.bind(that)
              }),new sap.m.Button({
                width:"100px",
                type: 'Negative',
                text: "No",
                press: function () {
                  that.exitDialog.close();
                }.bind(that)
              })
            ]
            });
            this.exitDialog.open();


           
          },

          applyMassRemoval: function(oEvent){

            debugger;
            var table = this.getView().byId("sfTableExclude");
            var selectedIndices =table.getTable().getSelectedIndices();
            var that = this;

            that.exitDialog = new Dialog({
              type: sap.m.DialogType.Message,
              title: "Confirm",
              content: new sap.m.Text({ text: "Are you sure you want to remove selected items from exclusion list ?" }),
              buttons: [new sap.m.Button({
                width:"100px",
                
                type: sap.m.ButtonType.Emphasized,
                text: "Yes",
                press: function () {
             
                
                  that.exitDialog.close();
                  selectedIndices.forEach(element => {
                    that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                    });
                  
                }.bind(that)
              }),new sap.m.Button({
                width:"100px",
                type: 'Negative',
                text: "No",
                press: function () {
                  that.exitDialog.close();
                }.bind(that)
              })
            ]
            });
            this.exitDialog.open();

          

            
          },



          onCloseDialogBox: function(oEvent){
            this.pDialogUser1.close();
          },

          onMassExclude: function(){


            var table = this.getView().byId("smartTable_custF4_map");
          var that = this;

          var objects = table.getTable().getSelectedIndices();

          objects.forEach(element => {
            

            that.createExclusinBrandRecord(table.getTable().getBinding("rows").getContextByIndex(element).getObject(),"MATNR",table.getTable().getBinding("rows").getContextByIndex(element).getObject().MATNR);
          });

          }
    });
});
