'use strict';

(function() {
    //var host = '189.16.40.94:8080';
    var host = 'localhost:8081';
    
    //Datasource de acesso à leitura das requisições
    app.data.requestSenior = new kendo.data.DataSource({
            offlineStorage: 'requestSenior',
			transport: {
        		read: {
                    //Dados do Post para a leitura
                    url: 'http://localhost:8081/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_est_requisicoespendentes',
                    type: 'POST',
                    contentType: "text/xml",
                    dataType: "xml",
    			},
                parameterMap: function(data){
                    //Definição do corpo do request
                    return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">\
                                <soapenv:Header/> \
                                <soapenv:Body>\
                                <ser:RequisicoesPendentes_2>\
                                <user>senior</user>\
                                <password>senior</password>\
                                <encryption>0</encryption>\
                                <parameters>\
                                </parameters>\
                                </ser:RequisicoesPendentes_2>\
                                </soapenv:Body>\
                                </soapenv:Envelope>';
                }
        	},
        	// definição do schema dos dados
    		schema: {
        		type: "xml", //tipo do corpo do request possivel também - json
        		data: "S:Envelope/S:Body/ns2:RequisicoesPendentes_2Response/result/gridRequisicoes", //caminho da leitura dos dados
       		    model: {
                    fields: { //campos do request (dados)
                        codEmp: "codDer/text()",
                        numEme: "numEme/text()",
                        qtdEme: "qtdEme/text()"
                    }
                }
            }
		});
    
    //Definição dos datasource do envio de aprovações
    app.data.dataSourceAprove = new kendo.data.DataSource({
        offlineStorage: 'requestsAproved', 
        transport: {
            create: {
                url: 'http://' + host + '/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_est_aprovarrequisicoes',
                type: 'POST',
                contentType: "text/xml",
                dataType: "xml"
            },
        	parameterMap: function(data, type){
                console.log(data);
                var requestToAprove = data, //captura os dados da requisição que será enviada
                    request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br"> \
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
                    </soapenv:Envelope>';
                return request;
            }
        },
        batch: true,
        requestStart: function(e) {
			app.mobileApp.showLoading();
        },
        requestEnd: function(e) {
            app.mobileApp.hideLoading();
        },
        error: function(err){
            navigator.notification.alert(err.errors, null, 'Erro', 'OK');
        },
        //Schema dos dados recebido, note que é declarado o schema da mensagem de erro de lógica, caso o retorno seja 200 com erro    
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


	//data source contém as mesmas propriedades definidas dos da aprovação
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
                    url: 'http://' + host + '/g5-senior-services/sapiens_Synccom_senior_g5_co_mcm_est_requisicoes',
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

	// Listeners para a verificação do device online ou offline
    document.addEventListener('online', function _appOnline() {
       app.data.dataSourceAprove.online(true);
       app.data.dataSourceAprove.sync(); //sincronização dos dados

       app.data.dataSourceRefuse.online(true);
       app.data.dataSourceRefuse.sync(); //sincronização dos dados
   });

    document.addEventListener('offline', function _appOffline() {
       app.data.dataSourceAprove.online(false);        
       app.data.dataSourceRefuse.online(false);
   });
}());

// START_CUSTOM_CODE_requestSenior
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_requestSenior