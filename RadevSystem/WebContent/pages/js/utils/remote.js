String.prototype.replaceAll = function(de, para){
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1){
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
    return (str);
}
var popup;

/* Variaveis usadas pelo Goglobal, Citrix e Terminal Server */
var _user;
var _fndUser;
var _password;
var _frwkpassword;
var _networkDomain;
var _path;
var _webServerPort;
var _remoteServer;
var _remoteServerPort;
var _sessionId;
var _serviceContext;
var _userExternal;
var _metaframeServer;
var _metaframeServerLibURL;
var _urlASPHttpServer;
var _metaframeServerId;
var _ipAddress;
var _serverName;
var _hostName;

function invokeGoGlobal(user, fndUser, password, frwkpassword, networkDomain, path, webServerPort, remoteServer, remoteServerPort,
		sessionId, serviceContext, userExternal, remoteConnectionType, metaframeServer, metaframeServerLibURL, url,
		urlASPHttpServer, metaframeServerId) {
	
	invokeGoGlobal(user, fndUser, password, frwkpassword, networkDomain, path, webServerPort, remoteServer, remoteServerPort,
			sessionId, serviceContext, userExternal, remoteConnectionType, metaframeServer, metaframeServerLibURL, url,
			urlASPHttpServer, metaframeServerId,"","","");
}

function invokeGoGlobal(user, fndUser, password, frwkpassword, networkDomain, path, webServerPort, remoteServer, remoteServerPort,
	sessionId, serviceContext, userExternal, remoteConnectionType, metaframeServer, metaframeServerLibURL, url,
	urlASPHttpServer, metaframeServerId, ipAddress, serverName, hostName) {
	
	if (popup) {
		if (popup != null) {
			if (!popup.closed) {
				bringNavigatorToTop();
				return;
			}
		}
	}

	// retira a version e utiliza 3 como versao caso nao venha informado
	var connTypeVersion = "3,2,0,4158";
	var sConnType = remoteConnectionType.split("#");
	remoteConnectionType = sConnType[0];
	if (sConnType.length > 1) {
		connTypeVersion = sConnType[1];
	}
	var ggVersion = connTypeVersion.split(",");
	
	if (document.all && remoteConnectionType == 'goglobal') {
		path = unescape(path);
		path = path.replaceAll('"',"&quot;");
		
		var userLost, passwordLost = '';
		
		if (userExternal == 'false') {
			userLost = user;
			passwordLost = frwkpassword;
			
			user = '';
			password = '';
			networkDomain = '';
		} else {
			userLost = user;
			passwordLost = frwkpassword;
			
			// caso seja informado o networkDomain concatena com o user para login no goglobal
			if (networkDomain) {
				user = networkDomain+"\\"+user;
			}
		}
		
		var args = path + ' &quot;,,'+remoteServerPort+','+userLost+','+passwordLost+',0,,DI,'+
					webServerPort+','+sessionId+','+remoteServer+ ',' + serviceContext + ',' + 
					userExternal + ',true,' + networkDomain + ','+ipAddress+','+serverName+','+hostName+ '&quot;';
		
		/* 
			caso seja diferente do padrao entra no 
			if tratado caso contrario vai parar sempre
			no padrao else que sera versao 3
		*/
		var objectTag = '<OBJECT ID="Control1" NAME="Control1" WIDTH=0 HEIGHT=0 ';
		if (ggVersion.length > 0 && ggVersion[0] >= 4){
			objectTag += 'CLASSID="CLSID:1241F20B-0688-45A5-ADB2-208AFE4A5DDC" CODEBASE="' + 
						metaframeServerLibURL + '/plugins/gg-activex.cab#Version='+connTypeVersion+'"> '
		} else {
			objectTag += 'CLASSID="CLSID:76850F2A-FCAA-454F-82D3-BD46CB186EF5" CODEBASE="' +
						metaframeServerLibURL + '/ggw-activex.cab#Version='+connTypeVersion+'"> '
		}		
		
		objectTag += '<PARAM NAME="user" VALUE="'+ user +'">' +
			'<PARAM NAME="password" VALUE="' + password + '">' +
			'<PARAM NAME="host" VALUE="' + metaframeServer + '">' +
			'<PARAM NAME="application" VALUE="' + metaframeServerId + '">' +
			'<PARAM NAME="isembeddedwin" VALUE="false">' +
			'<PARAM NAME="args" VALUE="'+args+'">' +
			'<PARAM NAME="compression" VALUE="true">' +
			'<PARAM NAME="hostport" VALUE="">' + // caso a porta do host tenha sido alterada de 491 para outra coisa tem que colocar aqui.
			'<PARAM NAME="inbrowserprocess" VALUE="true">' +
			'<PARAM NAME="autoclosebrowser" VALUE="false">' +
			'<PARAM NAME="autoconfigprinters" VALUE="default"></OBJECT>';
		document.getElementById('goglobal').innerHTML = '<div id="goglobal_1" width="0" height="0">' + objectTag + '</div>';
	} else {
		_user = user;
		_fndUser = fndUser;
		_password = password;
		_frwkpassword = frwkpassword;
		_networkDomain = networkDomain;
		_path = path;
		_webServerPort = webServerPort;
		_remoteServer = remoteServer;
		_sessionId = sessionId;
		_remoteServerPort = remoteServerPort;
		_serviceContext = serviceContext;
		_userExternal = userExternal;
		_metaframeServer = metaframeServer;
		_metaframeServerLibURL = metaframeServerLibURL;
		_urlASPHttpServer = urlASPHttpServer;
		_metaframeServerId = metaframeServerId;
		_ipAddress = ipAddress; 
		_serverName = serverName;
		_hostName = hostName;
		
		var w = 800;
		var h = 600;
		if (window.screen) {
			w = window.screen.availWidth;
			h = window.screen.availHeight - 50;
		} 
		
		if (remoteConnectionType == 'goglobal') {
			if (ggVersion.length > 0 && ggVersion[0] >= 4){
				document.getElementById('_remote').src = 'jsp/goGlobalNetscape.jsp';
			} else {
				document.getElementById('_remote').src = 'jsp/goGlobal3Netscape.jsp'; // default version 3.
			}
	    } else if (remoteConnectionType == 'citrix') {
			document.getElementById('_remote').src = 'jsp/citrixForm.jsp';
		} else if (remoteConnectionType == 'terminalserver') {
			popup = window.open(
				'jsp/terminalServer.jsp',
					'terminalServerSession',
						'width=' + w + ',height=' + h + ',top=0,left=0,status=no,screenX=0,screenY=0,location=no');
		}
	}
}

function bringNavigatorToTop() {
	if (popup) {
		popup.focus();
	}
}

function closeSessionGoglobal(serviceContext, sessionId) {
	window.open("../" + serviceContext + "/signal/EIPFlexSessionSignal?sessionId=" + sessionId + "&enabled=false", "_remote");
}
