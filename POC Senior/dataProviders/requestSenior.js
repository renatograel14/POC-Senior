'use strict';

(function() {
    app.data.requestSenior = {
        url: 'http://localhost:8081/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_est_requisicoespendentes'
    }

    app.data.dataSourceAprove = new kendo.data.DataSource({
        offlineStorage: 'requestsAproved',
        transport: {
            read: function(options){
                console.log('read', options.data);
                options.success({});
            },
            create: function(options) {
				var requestToAprove = options.data;
                app.mobileApp.showLoading();
                $.ajax({
                    url: 'http://localhost:8081/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_est_aprovarrequisicoes',
                    type: 'POST',
                    contentType: "text/xml",
                    dataType: "xml",
                    data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br"> \
                    <soapenv:Header/> \
                    <soapenv:Body> \
                    <ser:AprovarRequisicoes> \
                    <user>senior</user> \
                    <password>senior</password> \
                    <encryption>0</encryption> \
                    <parameters> \
                    <gridRequisicoes> \
                    <codEmp>' + requestToAprove.codEmp + '</codEmp> \
                    <codUsu>' + requestToAprove.codUsu + '</codUsu> \
                    <numEme>' + requestToAprove.numEme + '</numEme> \
                    <qtdEme>' + requestToAprove.qtdEme + '</qtdEme> \
                    <seqEme>' + requestToAprove.seqEme + '</seqEme> \
                    </gridRequisicoes> \
                    </parameters> \
                    </ser:AprovarRequisicoes> \
                    </soapenv:Body> \
                    </soapenv:Envelope>',
                    success: function(result) {
                        console.log('Aprove', result);
                        app.mobileApp.hideLoading();
                        options.success(result);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(thrownError);
                        app.mobileApp.hideLoading();
                        options.error(thrownError);
                    }
                });
            }
        },
        error: function(err){
            navigator.notification.alert(err.errors, null, 'Erro', 'OK');
        },
        schema: {
            type: 'xml',
             data: 'S:Envelope/S:Body/ns2:AprovarRequisicoesResponse/result/',
            errors: function(response){
                var errPath =  response['S:Envelope']['S:Body']['ns2:AprovarRequisicoesResponse']['result']['erroExecucao']['#text'];
                return errPath;
            },
            model: {
                id: 'ID'
            }
        }
    });

    app.data.dataSourceRefuse = new kendo.data.DataSource({
        offlineStorage: 'requestsRefused',
        transport: {
            read: function(options){
                options.success({});
            },
            create: function(options) {
                var requestToAprove = options.data;
                console.log(options);
                app.mobileApp.showLoading();
                $.ajax({
                    url: 'http://localhost:8081/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_est_requisicoes',
                    type: 'POST',
                    contentType: "text/xml",
                    dataType: "xml",
                    data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br"> \
                    <soapenv:Header/> \
                    <soapenv:Body> \
                    <ser:Cancelar> \
                    <user>senior</user> \
                    <password>senior</password> \
                    <encryption>0</encryption> \
                    <parameters> \
                    <requisicoes> \
                    <codEmp>' + requestToAprove.codEmp + '</codEmp> \
                    <numEme>' + requestToAprove.numEme + '</numEme> \
                    <seqEme>' + requestToAprove.seqEme + '</seqEme> \
                    </requisicoes> \
                    </parameters> \
                    </ser:Cancelar> \
                    </soapenv:Body> \
                    </soapenv:Envelope>',
                    success: function(result) {
                        console.log('Refuse', result);
                        app.mobileApp.hideLoading();
                        options.success(result);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(thrownError);
                        app.mobileApp.hideLoading();
                        options.error(thrownError);
                    }
                });
            }
        },
        error: function(err){
            navigator.notification.alert(err.errors, null, 'Erro', 'OK');
        },
        schema: {
            type: 'xml',
            data: 'S:Envelope/S:Body/ns2:CancelarResponse/result/',
            errors: function(response){
                var errPath =  response['S:Envelope']['S:Body']['ns2:CancelarResponse']['result']['erroExecucao']['#text'];
                return errPath;
            },
            model: {
                id: 'ID'
            }
        }
    });


    document.addEventListener('online', function _appOnline() {
        app.data.dataSourceAprove.online(true);
        app.data.dataSourceAprove.sync();

        app.data.dataSourceRefuse.online(true);
        app.data.dataSourceRefuse.sync();
    });

    document.addEventListener('offline', function _appOffline() {
        app.data.dataSourceAprove.online(false);        
        app.data.dataSourceRefuse.online(false);
    });
}());

// START_CUSTOM_CODE_requestSenior
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_requestSenior