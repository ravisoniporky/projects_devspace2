sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheZCSD_CUSTOMERMATERIALList.iSeeThisPage();

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheZCSD_CUSTOMERMATERIALList.onFilterBar().iExecuteSearch();
            
            Then.onTheZCSD_CUSTOMERMATERIALList.onTable().iCheckRows();

            When.onTheZCSD_CUSTOMERMATERIALList.onTable().iPressRow(0);
            Then.onTheZCSD_CUSTOMERMATERIALObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});