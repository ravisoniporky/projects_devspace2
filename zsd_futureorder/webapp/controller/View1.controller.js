sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat"

],
function (Controller,DateFormat) {
    "use strict";

    return Controller.extend("customer.porky.zsdfutureorder.controller.View1", {
        onInit: function () {

         this.model1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSB_R_PREORDERV2/", true);

          this.getView().setModel(new sap.ui.model.json.JSONModel({"LeadTimeSun":'',
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
            "CutOffTimeFri ":null,
            "CutOffTimeSat":null,
            "Plant":'',
            "validated": false
          }
          ), "calendarWeekModel");

         // this.setDefaultValues ();
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("RouteView1").attachMatched(this._onRouteMatched, this);

        },
        _onRouteMatched: function(oEvent){

          var that = this;
          setTimeout(() => {
            //console.log(that.getOwnerComponent().getComponentData());
            if(that.getOwnerComponent().getComponentData().startupParameters.Plant && that.getOwnerComponent().getComponentData().startupParameters.Plant[0])
            that.getView().byId("sm_matlist").setFilterData({"Plant":that.getOwnerComponent().getComponentData().startupParameters.Plant[0]})

            if(that.getOwnerComponent().getComponentData().startupParameters.PurchasingGroup && that.getOwnerComponent().getComponentData().startupParameters.PurchasingGroup[0])
            that.getView().byId("sm_matlist").setFilterData({"PurchasingGroup":that.getOwnerComponent().getComponentData().startupParameters.PurchasingGroup[0]})

           // "PurchasingGroup":that.getOwnerComponent().getComponentData().startupParameters.PurchasingGroup[0]})
            

         //   debugger;
          }, 1000);
       //   debugger;
        },
        onChangeLeadTime: function(oEvent){

          var day = oEvent.getSource().getCustomData()[0].mProperties.value;
          if(day === 'wed'){

            this.getView().getModel("calendarWeekModel").setProperty("/FlagWed", true);

          }else  if(day === 'mon'){

            this.getView().getModel("calendarWeekModel").setProperty("/FlagMon", true);


          }else  if(day === 'tue'){
            this.getView().getModel("calendarWeekModel").setProperty("/FlagTue", true);


          }else  if(day === 'thu'){
            this.getView().getModel("calendarWeekModel").setProperty("/FlagThu", true);


          }else  if(day === 'fri'){
            this.getView().getModel("calendarWeekModel").setProperty("/FlagFri", true);


          }else  if(day === 'sat'){
            this.getView().getModel("calendarWeekModel").setProperty("/FlagSat", true);


          }else  if(day === 'sun'){
            this.getView().getModel("calendarWeekModel").setProperty("/FlagSun", true);


          }
    //      debugger;
        },
        onChangeDateRange: function(oEvent){

     //     debugger;

          var LeadTime = Math.round(Math.abs((oEvent.getSource().getSelectedDates()[0].mProperties.endDate
          - oEvent.getSource().getSelectedDates()[0].mProperties.startDate
        ) / (24 * 60 * 60 * 1000)));;
          this.QuickViewEventSource.setValue(LeadTime);

          this.getView().setModel(new sap.ui.model.json.JSONModel({"leadTime":LeadTime, "Day" : day}
          ), "dateRangeModel");

        },
        onOpenDateRangeSelection: function (oEvent) {


     //     debugger;
          var that = this;
          this.dayCal = '';

          this.dayCal = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1].split("LeadTime")[1];
          


          this.QuickViewEventSource = oEvent.getSource();

          if (!that._pPopover_quickView) {
              that._pPopover_quickView = sap.ui.core.Fragment.load({
                  id: that.getView().getId() + "253",
                  name: "customer.porky.zsdfutureorder.view.dateRange",
                  controller: that
              }).then(function (oPopover) {
                  that.getView().addDependent(oPopover);

                  return oPopover;
              });
          } else {

          }
          that._pPopover_quickView.then(function (oPopover) {
              oPopover.openBy(that.QuickViewEventSource);

          });

      },
        openUpdateLeadTimeDialogn: function(oEvent){
        
            var that = this;
            if(oEvent.getSource().getBindingContext() ||      oEvent.getSource().getBindingContext("newMaterialModel")     ){



            if(!oEvent.getSource().getBindingContext()){

             var obj = oEvent.getSource().getBindingContext("newMaterialModel").getObject();
            }else{
              var obj = oEvent.getSource().getBindingContext().getObject();

            }


            obj.validated = false;
            this.getView().setModel(new sap.ui.model.json.JSONModel(obj
            ), "calendarWeekModel");

          }else{


            if(this.getView().byId("sm_matlist_smarttable").getTable().getSelectedItems().length < 1){

              sap.m.MessageBox.error("Please select material(s)");
              return;
            }

            
          this.getView().setModel(new sap.ui.model.json.JSONModel({"LeadTimeSun":0,
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
          }
            if(oEvent.getSource().getBindingContext()){
            var obj = oEvent.getSource().getBindingContext().getObject();

            this.getView().setModel(new sap.ui.model.json.JSONModel({"selectedMaterial":obj.Material, "selectedPlant":obj.Plant}
            ), "selectedModel");

          }else{
            this.getView().setModel(new sap.ui.model.json.JSONModel({"selectedMaterial":'All Selcted Materials', "selectedPlant":''}
            ), "selectedModel");
          }
                if (!this.pDialogKeyPeople1) {
                  this.pDialogKeyPeople1 = this.loadFragment({
                    name: "customer.porky.zsdfutureorder.view.leadTime"
                  });
                } else {
        
                }
                var that = this;
        
               
        
              
                this.pDialogKeyPeople1.then(function (oDialog) {
        
        
                  oDialog.open();
                  that.futureLeadTimeDialog = oDialog;
        
        
        
                });
                this.getView().addDependent(this.pDialogKeyPeople1);
        },

        onDialogCloseKeyPeople:function(oEvent){

            if(this.futureLeadTimeDialog)
            this.futureLeadTimeDialog.close();
        },
        onUpdateMaterialLeadTime: function(oEvent){



          var varray = this.getView().byId("sm_matlist_smarttable").getTable().getSelectedItems();

          varray.forEach(element => {
            this.updateMaterial(element.getBindingContext().getObject() );
          });

           
        },


        updateMaterial1 : function(itemObject){


          var that = this;
          var obj = itemObject

      

          let defaultModel1 = this.getOwnerComponent().getModel();
          var tableItemObject = itemObject          ;

          this.getView().setBusy(true);
          var obj1 = this.getView().getModel("calendarWeekModel").getData();

             obj.LeadTimeSun = Number(obj1.LeadTimeSun);
             obj.LeadTimeMon = Number(obj1.LeadTimeMon);
             obj.LeadTimeTue = Number(obj1.LeadTimeTue);
             obj.LeadTimeWed = Number(obj1.LeadTimeWed);
             obj.LeadTimeThu = Number(obj1.LeadTimeThu);
             obj.LeadTimeFri = Number(obj1.LeadTimeFri);
             obj.LeadTimeSat = Number(obj1.LeadTimeSat);

             obj.CutOffTimeSun =obj1.CutOffTimeSun;
             obj.CutOffTimeMon =obj1.CutOffTimeMon;
             obj.CutOffTimeTue =obj1.CutOffTimeTue;
             obj.CutOffTimeWed =obj1.CutOffTimeWed;
             obj.CutOffTimeThu =obj1.CutOffTimeThu;
             obj.CutOffTimeFri =obj1.CutOffTimeFri;
             obj.CutOffTimeSat =obj1.CutOffTimeSat;


             obj.FlagSun =obj1.FlagSun;
             obj.FlagMon =obj1.FlagMon;
             obj.FlagTue =obj1.FlagTue;
             obj.FlagWed =obj1.FlagWed;
             obj.FlagThu =obj1.FlagThu;
             obj.FlagFri =obj1.FlagFri;
             obj.FlagSat =obj1.FlagSat;


  

          defaultModel1.update("/ZCSD_PREORDER(Material='"+obj.Material+"',Plant='"+obj.Plant+"',IsActiveEntity=true)",obj, {
              success: function (oData, oResponse) {
                that.getView().setBusy(false);
                that.futureLeadTimeDialog.close();
                that.itemsSelectedIndex --;
                if( that.itemsSelectedIndex === 0){
                  sap.m.MessageBox.success("Update of selected materials is successful");

                }

 //
              },
  
              error: function (oError) {
        //        sap.m.MessageBox.error("There in issue with this action. -"+JSON.parse(oError.responseText).error.message.value have);
                that.getView().setBusy(false);
                that.itemsSelectedIndex --;
                if( that.itemsSelectedIndex === 0){
                  sap.m.MessageBox.success("Update of selected materials is successful");

                }
              }
            });

        },


        updateMaterial : function(itemObject){


          var that = this;
          var obj = this.getView().getModel("calendarWeekModel").getData();

          if(obj.validated){
            delete obj.validated;
          }

          if(obj.Material === "All Materials"){

           // sap.m.MessageBox.error("errr");
            this.updateAllMaterials();
            return;
          }

          let defaultModel1 = this.getOwnerComponent().getModel();
          var tableItemObject = itemObject          ;

          this.getView().setBusy(true);
 
             obj.LeadTimeSun = Number(obj.LeadTimeSun);
             obj.LeadTimeMon = Number(obj.LeadTimeMon);
             obj.LeadTimeTue = Number(obj.LeadTimeTue);
             obj.LeadTimeWed = Number(obj.LeadTimeWed);
             obj.LeadTimeThu = Number(obj.LeadTimeThu);
             obj.LeadTimeFri = Number(obj.LeadTimeFri);
             obj.LeadTimeSat = Number(obj.LeadTimeSat);

  

          defaultModel1.update("/ZCSD_PREORDER(Material='"+obj.Material+"',Plant='"+obj.Plant+"',IsActiveEntity=true)",obj, {
              success: function (oData, oResponse) {
                that.getView().setBusy(false);
                that.futureLeadTimeDialog.close();

 sap.m.MessageBox.success("Update is successful");

              },
  
              error: function (oError) {
                sap.m.MessageBox.error("There in issue with this action. -"+JSON.parse(oError.responseText).error.message.value
              );
                that.getView().setBusy(false);

              }
            });

        },



  



        updateAllMaterials: function(oEvent){
          var varray = this.getView().byId("sm_matlist_smarttable").getTable().getSelectedItems();

          this.itemsSelectedIndex = varray.length;
          varray.forEach(element => {
            this.updateMaterial1(element.getBindingContext().getObject() );
          });


        },
        onPaste: function(oEvent) {
          function handlePaste(aData, oCellInfo) {
            MessageToast.show("Pasted Data (on " + (oCellInfo ? "Cell (" + (oCellInfo.from.rowIndex + "/" + oCellInfo.from.colIndex) + ")" : "Table") + " Level):\n\n" + aData);
          }
    
          const aData = oEvent.getParameter("data");
          var dataArray = [];

          aData.forEach(element => {
            
            dataArray.push({"Material": element[0], "Plant": element[1], "ScheduleExists" : 'NA'});
          });

          this.getView().setModel(new sap.ui.model.json.JSONModel({materials: dataArray}
          ), "newMaterialModel");


       //   const oRange = oCellSelector.getSelectionRange();
    
          // if (oRange) {
          //   MessageBox.confirm("Do you want to paste at position " + (oRange.from.rowIndex + "/" + oRange.from.colIndex) + "?", {onClose: function(sAction) {
          //     handlePaste(aData, sAction === "OK" ? oRange : null);
          //   }});
          // } else {
          //   handlePaste(aData, null);
          // }
        },

        validateData: async function (){

          var dataArray = this.getView().getModel("newMaterialModel").getData().materials;

          
         var materials = [];
          var index = 0;
          for (const item of dataArray) {
            var response = await this.validateMaterial(item.Material, item.Plant);
            console.log(response);
            if(response.results.length >0){
            item.materialInfo = response.results[0];
            item.MaterialDescription =  response.results[0].MaterialDescription;
            item.ScheduleExists =  response.results[0].ScheduleExists;

            
            item.LeadTimeSun = Number(response.results[0].LeadTimeSun);
            item.LeadTimeMon = Number(response.results[0].LeadTimeMon);
            item.LeadTimeTue = Number(response.results[0].LeadTimeTue);
            item.LeadTimeWed = Number(response.results[0].LeadTimeWed);
            item.LeadTimeThu = Number(response.results[0].LeadTimeThu);
            item.LeadTimeFri = Number(response.results[0].LeadTimeFri);
            item.LeadTimeSat = Number(response.results[0].LeadTimeSat);



            item.CutOffTimeSun =response.results[0].CutOffTimeSun;
            item.CutOffTimeMon =response.results[0].CutOffTimeMon;
            item.CutOffTimeTue =response.results[0].CutOffTimeTue;
            item.CutOffTimeWed =response.results[0].CutOffTimeWed;
            item.CutOffTimeThu =response.results[0].CutOffTimeThu;
            item.CutOffTimeFri =response.results[0].CutOffTimeFri;
            item.CutOffTimeSat =response.results[0].CutOffTimeSat;
           
            materials.push(item);
            }else{
              item.materialInfo = 'NA';
              item.ScheduleExists =  'No Material Found';
              item.MaterialDescription =  'No Material Found';
            materials.push(item);
            }
            index++;
          }
         // this.getView().getModel("newMaterialModel").setData({'materials':materials });
          this.getView().setModel(new sap.ui.model.json.JSONModel({materials: materials}
          ), "newMaterialModel");

        },

        validateMaterial: async function(material,plant){

          var that = this;

          return new Promise(function(resolve, reject) {
         

            let defaultModel = that.getOwnerComponent().getModel();

            var salesOrgFilters = [];

     
            salesOrgFilters.push(new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, material));
          
         
          
          salesOrgFilters.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, plant));

          var salesOrgFilters_1 = new sap.ui.model.Filter({
            filters: salesOrgFilters,
            and: true,
          });
        //  sal



          defaultModel.read("/ZCSD_PREORDER", {
            filters: [salesOrgFilters_1],
            success: function (oData, oResponse) {

             
       //    debugger;

              resolve(oData);
  
            },
  
            error: function (oError) {
  
              sap.m.MessageBox.error("There in issue with this action.");
              resolve();
            }
          });
        });

        },

        updateMaterialValidate: function(oEvent){

          var that = this;
          var obj = this.getView().getModel("calendarWeekModel").getData();

       

          let defaultModel1 = this.getOwnerComponent().getModel();

          this.getView().setBusy(true);
 
             obj.LeadTimeSun = Number(obj.LeadTimeSun);
             obj.LeadTimeMon = Number(obj.LeadTimeMon);
             obj.LeadTimeTue = Number(obj.LeadTimeTue);
             obj.LeadTimeWed = Number(obj.LeadTimeWed);
             obj.LeadTimeThu = Number(obj.LeadTimeThu);
             obj.LeadTimeFri = Number(obj.LeadTimeFri);
             obj.LeadTimeSat = Number(obj.LeadTimeSat);

             obj.FlagSun = typeof (obj.FlagSun) === 'undefined' ?  false : obj.FlagSun;
             obj.FlagFri = typeof (obj.FlagFri) === 'undefined' ?  false : obj.FlagFri;
             obj.FlagMon = typeof (obj.FlagMon) === 'undefined' ?  false : obj.FlagMon;
             obj.FlagTue = typeof (obj.FlagTue) === 'undefined' ?  false : obj.FlagTue;
             obj.FlagWed = typeof (obj.FlagWed) === 'undefined' ?  false : obj.FlagWed;
             obj.FlagThu = typeof (obj.FlagThu) === 'undefined' ?  false : obj.FlagThu;
             obj.FlagSat = typeof (obj.FlagSat) === 'undefined' ?  false : obj.FlagSat;

  

          defaultModel1.read("/ZRSD_CE_PreOrderGet(p_weekday='1',p_LeadTimeMon="+obj.LeadTimeMon+",p_LeadTimeTue="
            +obj.LeadTimeTue+",p_LeadTimeWed="+obj.LeadTimeWed+",p_LeadTimeThu="+obj.LeadTimeThu+",p_LeadTimeFri="+obj.LeadTimeFri+",p_LeadTimeSat="
            +obj.LeadTimeSat+",p_LeadTimeSun="+obj.LeadTimeSun+",p_flagfri="+obj.FlagFri+",p_flagsat="+obj.FlagSat+",p_flagsun="
            +obj.FlagSun+",p_flagmon="+obj.FlagMon+",p_flagtue="+obj.FlagTue+",p_flagwed="+obj.FlagWed+",p_flagthu="
      
            +obj.FlagThu
            +")/Set", {
              success: function (oData, oResponse) {
                that.getView().setBusy(false);
          //      debugger;
                that.getView().getModel("calendarWeekModel").setProperty("/LeadTimeSun",oData.results[0].LeadTimeSun);
                that.getView().getModel("calendarWeekModel").setProperty("/LeadTimeMon",oData.results[0].LeadTimeMon);
                that.getView().getModel("calendarWeekModel").setProperty("/LeadTimeTue",oData.results[0].LeadTimeTue);
                that.getView().getModel("calendarWeekModel").setProperty("/LeadTimeWed",oData.results[0].LeadTimeWed);
                that.getView().getModel("calendarWeekModel").setProperty("/LeadTimeThu",oData.results[0].LeadTimeThu);
                that.getView().getModel("calendarWeekModel").setProperty("/LeadTimeFri",oData.results[0].LeadTimeFri);
                that.getView().getModel("calendarWeekModel").setProperty("/LeadTimeSat",oData.results[0].LeadTimeSat);
                that.getView().getModel("calendarWeekModel").setProperty("/validated",true);
              

              },
  
              error: function (oError) {
                sap.m.MessageBox.error("There in issue with this action. -"+JSON.parse(oError.responseText).error.message.value
              );
                that.getView().setBusy(false);

              }
            });
        },

        updateMaterialValidateChange: function(oEvent){
          this.getView().getModel("calendarWeekModel").setProperty("/validated",false);

          
        }

    });
});
