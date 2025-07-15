sap.ui.define(
    [
        'sap/ui/core/mvc/ControllerExtension'
        // ,'sap/ui/core/mvc/OverrideExecution'
    ],
    function (
        ControllerExtension
        // ,OverrideExecution
    ) {
        'use strict';
        return ControllerExtension.extend("customer.zfutureorderea1.leadtime", {
            // metadata: {
            // // 	// extension can declare the public methods
            // // 	// in general methods that start with "_" are private
            // 	methods: {
            // 		publicMethod: {
            // 			public: true /*default*/ ,
            // 			final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.Instead /*default*/
            // 		},
            // 		finalPublicMethod: {
            // 			final: true
            // 		},
            // 		onMyHook: {
            // 			public: true /*default*/ ,
            // 			final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.After
            // 		},
            // 		// couldBePrivate: {
            // 		// 	public: false
            // 		// },
            //         setLeadtime : {
            //             public : true,
            //             final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.Instead /*default*/
            //         }
            // 	}
               
            // },
            setLeadtime: function(oEvent){
                // debugger;
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
                  this.pDialogKeyPeople1 = this.base.getView().getController().loadFragment({
                    name: "customer.zfutureorderea1.changes.fragments.leadTime"
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
            // // adding a private method, only accessible from this controller extension
            // _privateMethod: function() {},
            // // adding a public method, might be called from or overridden by other controller extensions as well
            // publicMethod: function() {},
            // // adding final public method, might be called from, but not overridden by other controller extensions as well
            // finalPublicMethod: function() {},
            // // adding a hook method, might be called by or overridden from other controller extensions
            // // override these method does not replace the implementation, but executes after the original method
            // onMyHook: function() {},
            // // method public per default, but made private via metadata
            // couldBePrivate: function() {},
            // // this section allows to extend lifecycle hooks or override public methods of the base controller
            override: {
            // 	/**
            // 	 * Called when a controller is instantiated and its View controls (if available) are already created.
            // 	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
            // 	 * @memberOf {{controllerExtPath}}
            // 	 */
            	// onInit: function() {
            	// },
            // 	/**
            // 	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
            // 	 * (NOT before the first rendering! onInit() is used for that one!).
            // 	 * @memberOf {{controllerExtPath}}
            // 	 */
            //     setLeadtime: function(){
            //         sap.m.MessageBox.error("error");
            //     },
            // 	onBeforeRendering: function() {
            // 	},
            // 	/**
            // 	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
            // 	 * This hook is the same one that SAPUI5 controls get after being rendered.
            // 	 * @memberOf {{controllerExtPath}}
            // 	 */
            // 	onAfterRendering: function() {
            // 	},
            // 	/**
            // 	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
            // 	 * @memberOf {{controllerExtPath}}
            // 	 */
            // 	onExit: function() {
            // 	},
            // 	// override public method of the base controller
            // 	basePublicMethod: function() {
            // 	}
            }
        });
    }
);
