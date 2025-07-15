sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    "use strict";

    var Journey = {
        run: function() {
            QUnit.module("First journey");

            opaTest("Start application", function (Given, When, Then) {
                Given.iStartMyApp();

                Then.onTheZCSD_PreOrderSingletonList.iSeeThisPage();

            });


            opaTest("Navigate to ObjectPage", function (Given, When, Then) {
                // Note: this test will fail if the ListReport page doesn't show any data
                
                When.onTheZCSD_PreOrderSingletonList.onFilterBar().iExecuteSearch();
                
                Then.onTheZCSD_PreOrderSingletonList.onTable().iCheckRows();

                When.onTheZCSD_PreOrderSingletonList.onTable().iPressRow(0);
                Then.onTheZCSD_PreOrderSingletonObjectPage.iSeeThisPage();

            });

            opaTest("Teardown", function (Given, When, Then) { 
                // Cleanup
                Given.iTearDownMyApp();
            });
        }
    }

    return Journey;
});