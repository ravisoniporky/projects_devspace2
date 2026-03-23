sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheZC_ParisMaterialCrossRefList.iSeeThisPage();
            Then.onTheZC_ParisMaterialCrossRefList.onTable().iCheckColumns(34, {"Pariscode":{"header":"Paris Code"},"Pariscodedesc":{"header":"Paris Code Description"},"Uom1":{"header":"Paris UOM1"},"Uom2":{"header":"Paris UOM2"},"Uom3":{"header":"Paris UOM3"},"Vrkme":{"header":"Sales Unit"},"Bprme":{"header":"Purchase Unit"},"Umrez":{"header":"Sales Units per Purchase Unit"},"Mcsize":{"header":"Master Case Size"},"McsizeDesc":{"header":"Master Case Size Description"},"Suszie":{"header":"Sales Unit Size"},"SusizeDesc":{"header":"Sales Unit Size Description"},"Mcweight":{"header":"Master Case Weight"},"Gewei":{"header":"Weight Unit"},"Csimage":{"header":"Picture of Master Case"},"Eaimage":{"header":"Picture of Sales Unit"},"Hoehe":{"header":"Pallet Hi (Height)"},"Meabm":{"header":"Unit of Dimension"},"Block":{"header":"Pallet Ti (Block)"},"Csean":{"header":"Case Barcode"},"MaterialDescription":{"header":"Material Description"},"Material":{"header":"Material"},"Eaean":{"header":"Each Barcode"},"Notes":{"header":"Notes"},"Mfrpn":{"header":"MPN"},"Paktx":{"header":"Picking Description"},"Mclaeng":{"header":"Master Case Length"},"Mcbreit":{"header":"Master Case Width"},"Mchoehe":{"header":"Master Case Height"},"Mcmeabm":{"header":"Master Case Unit of Dimension"},"Sulaeng":{"header":"Sales Unit Length"},"Subreit":{"header":"Sales Unit Width"},"Suhoehe":{"header":"Sales Unit Height"},"Sumeabm":{"header":"Sales Unit Unit of Dimension"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheZC_ParisMaterialCrossRefList.onFilterBar().iExecuteSearch();
            
            Then.onTheZC_ParisMaterialCrossRefList.onTable().iCheckRows();

            When.onTheZC_ParisMaterialCrossRefList.onTable().iPressRow(0);
            Then.onTheZC_ParisMaterialCrossRefObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});