'use strict';

(function() {
    app.data.requestSenior = {
        url: 'http://localhost:8081/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_est_requisicoespendentes'
    }

    app.data.dataSourceAprove = new kendo.data.DataSource({
        transport: {
            create: function(options) {
				var requestToAprove = options.data;
                console.log('create', requestToAprove);
            }
        },
        schema: {
            type: "xml",
            model: {
				id: 'ID'
            }
        }
    });
}());

// START_CUSTOM_CODE_requestSenior
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_requestSenior