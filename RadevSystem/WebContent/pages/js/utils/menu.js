/**
 * Dispara uma mensagem de POST executadas pelo LISTENER do MainController.
 *
 * @param data   Objeto JSON com as informações que serão enviadas.
 * @param target Local do destinatário que irá receber estas informações (padrão *).
 * @param iframe Verdadeiro se a mensagem está sendo enviada através de um IFRAME.
 */
function menuPostMessage(data, target, iframe) {
    // No IE9 o postMessage funciona apenas com strings.
    if (typeof data !== 'string') {
        data = JSON.stringify(data);
    }
    
    if (iframe) {
        iframe.contentWindow.postMessage(data, target || '*');
    } else {
        window.postMessage(data, target || '*');
    }
}

/**
 * Executa o DESKTOPLAUNCHER para posteriormente executar o programa PROGRESS informado.
 *
 * @param appPath   Caminho completo do programa PROGRESS (conforme preferência de acesso).
 */
function executeDesktopLauncher(appPath) {
    var strExec = 'fluigidentity://appName=' + appPath.replace('.exe','.exe&args=').replace(/\s/g,'%20'),
        a, linkText;

    a = document.createElement('a');
    linkText = document.createTextNode('ExecutingProgram');
    a.appendChild(linkText);
    a.href = strExec;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); }, 500);
}


/**
 * Recupera o nome externo da aplicação Datasul conforme a URL informada.
 *
 * @param url URL da execução Datasul.
 */
function getExternalProgramByUrl(url) {
    var nomProgExt, lastPos, uris, lenUris;
    
    // Verifica se não é uma URL do menu.
    if (url !== '/' && url !== '/loading') {
        // Verifica a estrutura da URL e retira "/" extras do Angular (ex.: #/html-sample/country).
        if (url.indexOf('/') >= 0 && url.indexOf('/') < 2) {
            if (url.indexOf('/') == 0) {
                url = url.substr(1);
            } else {
                url = url.substr(2);
            }
        }

        // Verifica se a última posição da URL é "/" e retira da mesma.
        lastPos = url.length - 1;
        url = (url.lastIndexOf('/') == lastPos) ? url.substring(0, lastPos) : url;

        // Verifica se a URL possui URIs a mais, o máximo é de 2 por projeto (ex.: html-sample/country/new).
        uris = url.split('/');
        lenUris = uris.length;

        nomProgExt = uris[0] + '/' + uris[1];
    }

    return nomProgExt;
}

function processPromise(call, callback) {
    if (call && call.hasOwnProperty('$then')) {
        call.$then(function (result) {
            if (callback) {
                callback(result.data);
            }
        });
    } else {
        call.$promise.then(function (result) {
            if (callback) {
                if (result && result.data) {
                    callback(result.data);
                } else {
                    callback(result);
                }
            }
        });
    }
}