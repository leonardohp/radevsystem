/**
 * Classe com todas as propriedades do produto.
 */
(function () {
    'use strict';

    var Properties = {
        data: {},

        PROPERTIES: 'properties',
        ACCESS_PREFERENCES: 'preferences',
        COMPANY: 'company',
        MENU: 'menu',
        USER: 'user',
        LICENSE: 'license',
        FILTER_OPTIONS: 'filterOptions',
        SYSINFO: 'sysInfo',
        FLEX: 'flex',
        PROCESSES: 'processes',
        SMART_CLIENT: 'smartClient',
        CENTRAL_DOCUMENTS: 'centralDocuments',
        OPENED_PROGRAMS: 'openedPrograms',

        setProperty: function (key, value) {
            var properties = Properties.getProperties();

            try {
                properties[key] = value;
                Properties.data = properties;
            } catch (e) {
                console.error('Não foi possível definir valor para a propriedade do menu [' + e.message + '].');
            }
        },

        setProperties: function (data) {
            Properties.data = data;
        },
        
        setObjectProperty: function (property, key, value) {
        	var properties = Properties.getProperty(property);
        	try {
                properties[key] = value;
                Properties.data[property] = properties;
            } catch (e) {
                console.error('Não foi possível definir valor para a propriedade do menu [' + e.message + '].');
            }
        },

        addProperty: function (key, attr, value) {
            var properties = Properties.getProperties();

            try {
                properties[key][attr] = value;
                Properties.setProperties(properties);
            } catch (e) {
                console.error('Não foi possível definir valor para a propriedade do menu [' + e.message + '].');
            }
        },

        getProperty: function (key, attr, def) {
            var properties, obj, value = null;

            try {
                properties = Properties.getProperties();
            } catch (e) {
                console.error('Não foi possível recuperar o valor da propriedade do menu [' + e.message + '].');
            }

            obj = (properties.hasOwnProperty(key) && properties[key]) ? properties[key] : null;

            if (obj !== null && typeof attr !== 'undefined' && attr !== null) {
                value = (obj.hasOwnProperty(attr) && obj[attr] !== null) ? obj[attr] : null;
            } else {
                value = obj;
            }

            if (value === null) value = def;

            return value;
        },

        getProperties: function () {
            var properties;

            try {
                properties = Properties.data;
            } catch (e) {
                console.error('Não foi possível recuperar as propriedades do menu [' + e.message + '].');
            }

            return properties;
        },

        isPropertiesLoaded: function (loaded) {
            if (typeof loaded === 'undefined') return Properties.getProperty('loaded', null, false);
            
            Properties.setProperty('loaded', loaded);
        
            /**
             * Verifica se está definindo que as propriedades foram carregadas
             * e salva os dados na variável window.name.
             */
            if (loaded === true) window.name = JSON.stringify(Properties.getProperties());

            return loaded;
        },
        
        loadProperties: function (href) {
            /**
             * A classe Properties vai utilizar a variável window.name para
             * poder salvar temporariamente as propriedade do produto durante a
             * navegação entre o menu e o inicializador.
             */
            try {
                Properties.setProperties((window.name !== '') ? JSON.parse(window.name) : {});
            } catch (e) {
                Properties.setProperties({});
            }
            
            /**
             * Zera a variável window.name para recarregar as propriedades em
             * caso de REFRESH.
             */
            window.name = '';
            
            /**
             * Se as propriedades ainda não foram carregadas, deve-se executar
             * a página de inicialização.
             */
			if (!Properties.isPropertiesLoaded()) window.location.href = 'initialize.html?redirect=' + encodeURI(Base64.encode(href));
        }
    };
    
    /**
     * Torna a variável Properties uma global.
     */
    window.Properties = Properties;
}());

window.BrowserUtil = (function () {
    var osName,
        browserName,
        browserVersion;
            
    if (navigator.userAgent.indexOf("Windows NT 6.2")!=-1)      osName = 'Windows 8';
    else if (navigator.userAgent.indexOf("Windows NT 6.1")!=-1) osName = 'Windows 7';
    else if (navigator.userAgent.indexOf("Windows NT 6.0")!=-1) osName = 'Windows Vista';
    else if (navigator.userAgent.indexOf("Windows NT 5.1")!=-1) osName = 'Windows XP';
    else if (navigator.userAgent.indexOf("Windows NT 5.0")!=-1) osName = 'Windows 2000';
    else if (navigator.userAgent.indexOf("Mac")!=-1)            osName = 'Mac/iOS';
    else if (navigator.userAgent.indexOf("X11")!=-1)            osName = 'UNIX';
    else if (navigator.userAgent.indexOf("Linux")!=-1)          osName = 'Linux';
    else osName = navigator.platform;

    if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        browserName = 'Safari';
        browserVersion = new String(RegExp.$1).replace('"','');
    }
    
    if (/MSIE (\d+\.\d+)/.test(navigator.userAgent)	|| navigator.userAgent.indexOf("Trident/")!=-1) {               
        browserName = 'Internet Explorer';
        
        if(!(/MSIE (\d+\.\d+)/.test(navigator.userAgent))) {
            browserVersion = '11.0';
        } else {				
            browserVersion = new String(RegExp.$1).replace('"','');
        }
    }
    
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        browserName = 'Firefox';
        browserVersion = new String(RegExp.$1).replace('"','');
    }
    
    if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        browserName = 'Chrome';
        browserVersion = new String(RegExp.$1).replace('"','');
    }
    
    if (/OPR[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        browserName = 'Opera';
        browserVersion = new String(RegExp.$1).replace('"','');
    }
            
    return {OS_NAME: osName, BROWSER_NAME: browserName, BROWSER_VERSION: browserVersion, IE: 'Internet Explorer', IE9: '9.0'};
}());

//Cria o objeto de Base64.
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

//Verifica se a global console existe no navegador.
window.console = window.console || {error:function(){},info:function(){},log:function(){},warn:function(){},debug:function(){}};
