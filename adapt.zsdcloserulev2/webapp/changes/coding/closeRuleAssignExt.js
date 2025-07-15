/***
@controller Name:sap.suite.ui.generic.template.ObjectPage.view.Details,
*@viewId:customer.porky.zsdcloserulev2::sap.suite.ui.generic.template.ObjectPage.view.Details::ZCSD_CLOSERULEASSIGN
*/
/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
		'sap/ui/core/mvc/ControllerExtension'
		// ,'sap/ui/core/mvc/OverrideExecution'
	],
	function (
		ControllerExtension
		// ,OverrideExecution
	) {
		"use strict";
		return ControllerExtension.extend("customer.adapt.zsdcloserulev2.closeRuleAssignExt", {
			// metadata: {
			// 	// extension can declare the public methods
			// 	// in general methods that start with "_" are private
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
			// 		couldBePrivate: {
			// 			public: false
			// 		}
			// 	}
			// },

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
			// 	 * @memberOf customer.adapt.zsdcloserulev2.closeRuleAssignExt
			// 	 */
				onInit: function() {
				//	debugger;
					//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					//oRouter.getRoute("RouteCreateContact").attachMatched(this._onRouteMatched, this);

					
				},

			// 	/**
			// 	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			// 	 * (NOT before the first rendering! onInit() is used for that one!).
			// 	 * @memberOf customer.adapt.zsdcloserulev2.closeRuleAssignExt
			// 	 */
			// 	onBeforeRendering: function() {
			// 	},

			// 	/**
			// 	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			// 	 * This hook is the same one that SAPUI5 controls get after being rendered.
			// 	 * @memberOf customer.adapt.zsdcloserulev2.closeRuleAssignExt
			// 	 */
				onAfterRendering: function() {
				//	debugger;
					var that = this;
					
					this.getView().getModel().attachRequestCompleted(function(oEvent){
					//	debugger;
						if(!that.getView().getBindingContext() || typeof that.getView().getBindingContext().getObject().Zrule === 'undefined' || typeof that.getView().getBindingContext().getObject().Zrule === '0'){
							return;
						}
						console.log("Rule - "+that.getView().getBindingContext().getObject().Zrule);
						try{
							if(that.getView().getBindingContext().getObject().Zrule === '1'){
						that.getView().byId("customer.porky.zsdcloserulev2::sap.suite.ui.generic.template.ObjectPage.view.Details::ZCSD_CLOSERULEASSIGN--MaterialData::Ph01::GroupElement").setLabel("Max Fill Quantity");

							}else if(that.getView().getBindingContext().getObject().Zrule === '3'){
								that.getView().byId("customer.porky.zsdcloserulev2::sap.suite.ui.generic.template.ObjectPage.view.Details::ZCSD_CLOSERULEASSIGN--MaterialData::Ph01::GroupElement").setLabel("% of Order Quantity");
		
									}else{
										that.getView().byId("customer.porky.zsdcloserulev2::sap.suite.ui.generic.template.ObjectPage.view.Details::ZCSD_CLOSERULEASSIGN--MaterialData::Ph01::GroupElement").setLabel("Quantity");

									}

								

						}catch(e){

						}
						// try{
						// 	if( location.href.includes("ZCSD_CloserRule('6')") ){
						// 		that.getView().byId("customer.porky.zsdcloserulev2::sap.suite.ui.generic.template.ObjectPage.view.Details::ZCSD_CLOSERULEASSIGN--MaterialData::Ph02::GroupElement").setVisible(true);

						// 	}else{
						// 		that.getView().byId("customer.porky.zsdcloserulev2::sap.suite.ui.generic.template.ObjectPage.view.Details::ZCSD_CLOSERULEASSIGN--MaterialData::Ph02::GroupElement").setVisible(false);

						// 	}
						// }catch(e){

						// }
						
					});
					//this.getView().byId("customer.porky.zsdcloserulev2::sap.suite.ui.generic.template.ObjectPage.view.Details::ZCSD_CLOSERULEASSIGN--MaterialData::Ph01::GroupElement").setLabel("abc")debugger
				},

			// 	/**
			// 	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			// 	 * @memberOf customer.adapt.zsdcloserulev2.closeRuleAssignExt
			// 	 */
			// 	onExit: function() {
			// 	},

			// 	// override public method of the base controller
			// 	basePublicMethod: function() {
			// 	}
			}
		});
	});