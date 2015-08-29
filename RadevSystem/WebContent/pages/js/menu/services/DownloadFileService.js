define(['index'], function (index) {
    'use strict';

    index.register.service('ServiceDownloadFile',['$rootScope', '$http', '$filter', 'messageHolder', function ($rootScope, $http, $filter, messageHolder) {
        var i18n = $filter('i18n');
        this.download = function (filename, type, data) {  
            
            var blob = new Blob([data], { type: type });

            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);

                if (filename) {
                    // use HTML5 a[download] attribute to specify filename
                    var a = document.createElement("a");
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        window.location = downloadUrl;
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    window.location = downloadUrl;
                }

                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
            }                            
        };
        
        this.quickDownload = function (filename, downloadUrl) {
            var a = document.createElement("a");
            $http.get(downloadUrl).
              success(function() {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
              }).
              error(function(data, status) {
                var msgTitle = i18n('error-download-file');
                var msgDesc = i18n('error-download-file-desc');
                var msgDetail = 'HTTP Status error: ' + status;
                messageHolder.showMsg(msgTitle, msgDesc, messageHolder.ERROR, msgDetail)
                });
              }
    }]);
    
});