define(['index'], function (index) {
    'use strict';

    index.register.service('ServCheckLicense', ['$rootScope', '$filter', 'License', 'messageHolder', 'ServDoLogout', function ($rootScope, $filter, License, messageHolder, ServDoLogout) {
        var i18n = $filter('i18n');
        this.check = function (confirm, cancel) {  
        
            /** Check Licença **/
            var licenseStatus = License.checkLicense($rootScope.sessionID, function(result) {
            
                var segmentDesc = "";
                
                switch(result.ls_segmentCode) {
                    case
                        "1": segmentDesc = i18n("manufacture-segment");
                         break;
                    case
                        "2": segmentDesc = i18n("agribusiness-segment");
                         break;
                    case
                        "3": segmentDesc = i18n("education-segment");
                         break;
                    case
                        "4": segmentDesc = i18n("health-segment");
                         break;
                    case
                        "5": segmentDesc = i18n("construction-projects-segment");
                         break;     
                    case
                        "6": segmentDesc = i18n("financial-services-segment");
                         break;  
                    case
                        "7": segmentDesc = i18n("juridical-segment");
                         break;  
                    case
                        "8": segmentDesc = i18n("distribuition-logistics-segment");
                         break;  
                    case
                        "9": segmentDesc = i18n("retail-segment");
                         break;  
                    case
                        "10": segmentDesc = i18n("services-segment");
                         break;  
                    case
                        "11": segmentDesc = i18n("services-segment");
                         break;  
                    default:
                        segmentDesc = "";
                }
            
                var license = {
                    segmentCode: (result.ls_segmentCode<10)?"0"+result.ls_segmentCode:result.ls_segmentCode,
                    segmentDesc: segmentDesc
                };
                
                Properties.setProperty(Properties.LICENSE, license);
                
                $rootScope.$broadcast('menuSegmentChange', Properties.getProperty(Properties.LICENSE, "segmentCode"), Properties.getProperty(Properties.LICENSE, "segmentDesc"));

                // Erro ao utilizar o servidor de licenças //
                if (result.returnStatus === 'NOK') {
                    var msgTitle = '',msgDesc = '',msgDetail = '';
                    
                    if(typeof result.returnErrorResult === "string") result.returnErrorResult = parseInt(result.returnErrorResult);
                    
                    switch(result.returnErrorResult) {
                        case -1:
                            msgTitle  = i18n("error-license-sever");
                            msgDetail = i18n("error-license-sever-1-detail");
                            msgDesc   = i18n("error-license-sever-1-desc");
                            break;
                        case -2: 
                            msgTitle  = i18n("error-license-sever");
                            
                            if (result.codeErrorConsume !== undefined && result.codeErrorConsume !== null) {
                                msgDesc   = i18n("error-license-sever-2-desc");
                                msgDetail = i18n("error-license-sever-2-detail") + result.codeErrorConsume + ' - ' + result.descErrorConsume + ".";
                            } else {
                                msgDetail = i18n("error-license-sever-1-detail");
                                msgDesc   = i18n("error-license-sever-1-desc");
                            }
                            
                            break; 
                        case 101:
                            msgTitle  = i18n("error-license-sever");
                            msgDesc   = i18n("error-license-sever-101-desc");
                            msgDetail = i18n("error-license-sever-generic-detail");
                            break;  
                        case 102:
                            msgTitle  = i18n("error-license-sever");
                            msgDesc   = i18n("error-license-sever-102-desc");
                            msgDetail = i18n("error-license-sever-102-detail") + result.returnVersionResult + ".";                                
                            break; 
                        default:
                            msgTitle  = i18n("error-license-sever");
                            msgDesc   = i18n("error-license-sever-generic-desc");
                            msgDetail = i18n("error-license-sever-generic-detail");
                            break
                    }
                    
                    if (BrowserUtil.BROWSER_NAME === BrowserUtil.IE) {
                        alert(msgTitle + "\n\n" + msgDesc + "\n" + msgDetail);
                        cancel();
                    } else {
                        messageHolder.showMsg(msgTitle, msgDesc, messageHolder.ERROR, msgDetail, function() {cancel();});
                    }
                } else {
                    confirm();
                }
            });            
        };
    }]);
    
});