var wsURL = "";

function registryAS() {
	/*
	var di = FABridge.DI;
	if(di == undefined) {
		setTimeout("registryAS()",1250);
		return;
	}
	var flexApp = FABridge.DI.root();

	var callback = function(event) {

		var request = event.getExecutionRequest();
		var groupId = request.getGroupId();
		var program = request.getProgram();
		var path = request.getPath();
		var user = request.getUser();
		var password = request.getPassword();
		var userExternal = request.getUserExternal();
		var remoteServer  = request.getRemoteServer();
		var webServerPort = request.getWebServerPort();
		var serviceContext = request.getServiceContext();
		var sessionId = request.getSessionId();
		var params = "";

		window.setTimeout("executeProgram('"+groupId+"', '"+path+"', '"+program+"', '"+user+"', '"+password+"', '"+userExternal+"', '" + remoteServer+"', '"+webServerPort+"', '"+serviceContext+"', '"+sessionId+"','');", 0);
	}
	flexApp.getInvoker().addEventListener("invokeEvent", callback);
	*/
}

function executeProgram(groupId, path, program, user, password, userExternal, remoteServer , webServerPort, serviceContext, sessionId, domain, clientIpAddress, port, licenseId, ambientType, lsServerIP, lsServerPort) {
	executeProgram(groupId, path, program, user, password, userExternal,remoteServer , webServerPort, serviceContext, sessionId, "", domain, clientIpAddress, port, licenseId, ambientType, lsServerIP, lsServerPort);
}

function executeProgram(groupId, path, program, user, password, userExternal, remoteServer, webServerPort, serviceContext, sessionId, params, domain, clientIpAddress, port, licenseId, ambientType, lsServerIP, lsServerPort) {
	executeProgram(groupId, path, program, user, password, userExternal, remoteServer, webServerPort, serviceContext, sessionId, params, "", domain, clientIpAddress, port, licenseId, ambientType, lsServerIP, lsServerPort);
}

function executeProgram(groupId, path, program, user, password, userExternal, remoteServer, webServerPort, serviceContext, sessionId, params, domain, clientIpAddress, port, licenseId, ambientType, lsServerIP, lsServerPort) {
    window.setTimeout("executeProgramDelay('" + groupId + "', '" + path + "', '" + program + "', '" + user + "', '" + password + "', '" + userExternal + "','" + remoteServer + "', '" + webServerPort + "', '" + serviceContext + "', '" + sessionId + "', '" + params + "', '" + domain + "', '" + clientIpAddress + "', '" + port + "', '" + licenseId + "', '" + ambientType + "', '" + lsServerIP + "', '" + lsServerPort + "');", 0);
}

function executeProgramDelay(groupId, path, program, user, password,
	userExternal, remoteServer, webServerPort, serviceContext, sessionId,
		params, domain, clientIpAddress, port, licenseId, ambientType, 
		lsServerIP, lsServerPort) {
	var invoker = document.getElementById("invoker");
	if (invoker == null) {
		alert("DI Applet n�o inicializado. Verifique a disponibilidade do Java nesta esta��o.");
	} else {
		invoker.executeProgram(groupId, path, program, user, password,
				userExternal, remoteServer, webServerPort, serviceContext,
				sessionId, params, domain, clientIpAddress, port, 
				licenseId, ambientType, lsServerIP, lsServerPort);
	}
}

function pingInvokerApplet() {
    var msg = "Problemas ao inicializar o Datasul Interactive!\n O Datasul Interactive � necess�rio para execu��o de programas Progress.\n\n" + 
              "Verifique se o Java 6(ou superior) foi corretamente instalado\n ou contate o suporte.";    
    try {
        var resp = document.invoker.ping(); 
    } catch (e) {
        alert(msg);
    }
    if (resp != "pong") {
       alert(msg);
    }
}

function verifyTimeout() {
	var invoker = document.getElementById("invoker");
	if (invoker != null) {
		invoker.verifyTimeout();
	}
}

function lock(enable){
	var flexApp = FABridge.DI.root();
	if (flexApp != null) {
		flexApp.lock(enable);
	}
}

function setFlexParam(prog,par,value) {
	if( FABridge.DI ){		
	var flexApp = FABridge.DI.root();
	flexApp.setFlexParam(prog, par, value);
	}
}

function timeout() {
	/* Para o Applet do DI */
	try {
		var invoker = document.getElementById("invoker");
		invoker.stop();
	} catch (err) {}

	/* Para o Applet do ABL */
	try {
		var abl = document.getElementById("ABLApplet");
		abl.stop();
	} catch (err) {}

	/* Fecha todas as janelas webSpeed abertas */
	closeWebspeedWindows();	
	if (wsURL != null && wsURL != "") {
		logoff(wsURL);
	}
	wsURL = "";
}

function pauseLogoff(Pause) {
	// pausa necessaria para dar tempo ao browser poder eliminar o cookie do webspeed
	setTimeout( function() {
		/* Rediciona para a pagina de logout */
		window.location = "jsp/logout.jsp";
	/* O codigo comum as duas funcoes ficou centralizado na timeout */
	timeout();

	/* Para o SWF, para solucao da solicitacao DTSFRWK-2130 */
	try {
		var swf = document.getElementById("index-flex");
		swf.parentNode.removeChild(swf);
	} catch (err) {}
	}, Pause );
}

function logoff(pathWebSpeed) {
	/* elimina o token do webspeed */
	if(pathWebSpeed != null && pathWebSpeed != '') {
		try {
			// Simula uma requisicao POST gerando um Form dinamicamente e forcando o envio
			var windowHnd = window.open('','_logoff');
			webspeedWindows[webspeedWindows.length] = windowHnd; // Registra o handle da nova janela para remover ao finalizar o Datasul 11
			windowHnd.document.writeln('<h2>Efetuando logoff...</h2>');
			windowHnd.document.writeln('<form id="wsRunForm" method="POST" action="' + pathWebSpeed + '/web/men/wlogoff.r">');
			windowHnd.document.writeln('</form>');
			windowHnd.document.getElementById('wsRunForm').submit();
		} catch (err) { }
	}
	pauseLogoff(500);
}

function setSegment(seg) {
	window.document.title = seg;
}

/*
 * Registra todas as janelas abertas para execucao de programas Webspeed.
 * Ao encerrar uma sessao do Datasul 11, todas as janelas registradas devem
 * ser fechadas.
 */
var webspeedWindows = new Array();

/* Chama o programa Webspeed a partir do menu Flex
 * Recebe um objeto contendo os dados necessarios para realizar a chamada.
 */
function executeWebspeed(urlRequest) {
	if (urlRequest) {
		if (urlRequest.data) {

		    try {
				wsURL = urlRequest.url;
				wsURL = wsURL.substring(0, wsURL.indexOf("/web/men/wrun"));
			} catch (err) {}
			
			// Simula uma requisicao POST gerando um Form dinamicamente e forcando o envio
			var windowHnd = window.open('','_blank');
						
			webspeedWindows[webspeedWindows.length] = windowHnd; // Registra o handle da nova janela para remover ao finalizar o Datasul 11

			windowHnd.document.writeln('<h2>Aguarde, carregando programa...</h2>');
			windowHnd.document.writeln('<form id="wsRunForm" method="POST" action="' + urlRequest.url + '">');
			windowHnd.document.writeln('   <input type="hidden" name="program" value="' + urlRequest.data.program + '"/>');
			windowHnd.document.writeln('   <input type="hidden" name="module" value="' + urlRequest.data.module + '"/>');
			windowHnd.document.writeln('   <input type="hidden" name="user" value="' + urlRequest.data.user + '"/>');
			windowHnd.document.writeln('   <input type="hidden" name="password" value="' + urlRequest.data.password + '"/>');
			windowHnd.document.writeln('   <input type="hidden" name="sessionID" value="' + urlRequest.data.sessionID + '"/>');
            /* Chamado THRBDA - inicio */
			windowHnd.document.writeln('   <input type="hidden" name="execution" value="' + urlRequest.data.execution + '"/>');
			/* Chamado THRBDA - fim */
			windowHnd.document.writeln('</form>');
			windowHnd.document.getElementById('wsRunForm').submit();
		}
	}
}

/* 
 * Fecha todas as janelas abertas por chamadas a programas Webspeed.
 */
function closeWebspeedWindows() {
	for (var i=0; i<webspeedWindows.length; i++) {
		if (webspeedWindows[i] && !webspeedWindows[i].closed) {
			webspeedWindows[i].close();
		}
	}
	
	// Reseta o array, so para garantir...
	webspeedWindows = new Array();	
}

/*
 *  Centraliza as operacoes que devem ser executadas ao fechar uma janela onde foi executado o Datasul 11.
 *  Operacoes deste genero podem ser: fechar janelas filhas, liberar recursos, etc.
 *  A chamada a esta funcao ocorre no evento "onunload" da tag "body" do index.html.
 */
function finalize(){
	closeWebspeedWindows();
	if (wsURL != null && wsURL != "") {
		logoff(wsURL);
	}
	wsURL = "";
}

var Cookies = {
	init: function () {
		var allCookies = document.cookie.split('; ');
		for (var i=0;i<allCookies.length;i++) {
			var cookiePair = allCookies[i].split('=');
			this[cookiePair[0]] = cookiePair[1];				
		}
	},
	create: function (name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		} else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
		this[name] = value;
	},
	erase: function (name) {
		this.create(name,'',-1);
		this[name] = undefined;
	}
};
Cookies.init();

function getCookie(cookieName) {
	return Cookies[cookieName];		
}

function getIpAddress() {
	var invoker = document.getElementById("invoker");
	var ip = invoker.getIpAddress();
	return ip;
}
function handleBeforeUnload(e) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "./servlets/unprotected/license/FlexLicenseServlet?line=" + e.type, false);
	xhr.send(null);
	
	var xhr2 = new XMLHttpRequest();
	xhr2.open("POST", "./execute/EIPFlexExecuteProgram?quit=true");
	xhr2.send(null);
	
	setTimeout("timeout()", 3000);
}
/**
 * Objeto responsavel por detectar navegador e versao.
 * e possivel recuperar os seguintes parametros:
 * BrowserDetect.browser - Nome do navegador utilizado
 * BrowserDetect.version - Versao do navegador utilizado
 */
var BrowserDetect = {
	// Inicializa os atributos do objeto
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "unknown version";
	},
	// Metodo responsavel por capturar o nome do navegador
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	// Metodo responsavel por capturar a versao do navegador
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) {
			return;
		}
		dataString = dataString.substring(index+this.versionSearchString.length+1);
		if ((space = dataString.indexOf(" ")) != -1) {
			dataString=dataString.substring(0,space);
		}
		
		return dataString;
	},
	/**
	 * Lista de navegadores
	 * string - String utilizada para obter os dados do navegador
	 * subString - Deve estar presente em string para que o navegador seja identificado
	 * identity - Nome do navegador
	 * versionSearch - Palavra que precede o numero da versao em string
	 */
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Mozilla Firefox",
			versionSearch: "Firefox"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Internet Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Google Chrome",
			versionSearch: "Chrome"
		},
		{
			string: navigator.userAgent,
			subString: "Chromium",
			identity: "Chromium",
			versionSearch: "Chromium"
		},
		{
			string: navigator.userAgent,
			subString: "Trident",
			identity: "Internet Explorer",
			versionSearch: "rv"
		}
	]
};
// Coleta os dados do navegador
BrowserDetect.init();
// Adiciona o evento de beforeunload
if (typeof window.addEventListener === "undefined") {
	window.addEventListener = function(e, callback) {
		return window.attachEvent("on" + e, callback);
	}
}
window.addEventListener("beforeunload", function(e) {
	handleBeforeUnload(e);
	window.location = "./logout.jsp";
});
