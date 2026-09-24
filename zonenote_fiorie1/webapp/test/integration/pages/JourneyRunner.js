sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zonenotefiorie1/test/integration/pages/ZC_MaterialVerifyOneNoteList.gen",
	"customer/porky/zonenotefiorie1/test/integration/pages/ZC_MaterialVerifyOneNoteObjectPage.gen"
], function (JourneyRunner, ZC_MaterialVerifyOneNoteListGenerated, ZC_MaterialVerifyOneNoteObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zonenotefiorie1') + '/test/flp.html#app-preview',
        pages: {
			onTheZC_MaterialVerifyOneNoteListGenerated: ZC_MaterialVerifyOneNoteListGenerated,
			onTheZC_MaterialVerifyOneNoteObjectPageGenerated: ZC_MaterialVerifyOneNoteObjectPageGenerated
        },
        async: true
    });

    return runner;
});

