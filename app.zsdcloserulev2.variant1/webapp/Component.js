jQuery.sap.declare("customer.app.zsdcloserulev2.variant1.Component");

// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "customer.porky.zsdcloserulev2",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/ZSDCLOSERULE_V2"

	// we use a URL relative to our own component
	// extension application is deployed with customer namespace
});

customer.porky.zsdcloserulev2.Component.extend("customer.app.zsdcloserulev2.variant1.Component", {
	metadata: {
		manifest: "json"
	}	
});
