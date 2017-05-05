{
        var require_bkup = window.require;
    };
/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.8.1(91da4276775da6adafaed44281946344f57800cd)
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
var _amdLoaderGlobal=this,AMDLoader;!function(e){e.global=_amdLoaderGlobal,e.isNode="undefined"!=typeof module&&!!module.exports,e.isWindows=function(){return!!("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.indexOf("Windows")>=0)||"undefined"!=typeof process&&"win32"===process.platform}(),e.isWebWorker="function"==typeof e.global.importScripts,e.isElectronRenderer="undefined"!=typeof process&&"undefined"!=typeof process.versions&&"undefined"!=typeof process.versions.electron&&"renderer"===process.type,e.isElectronMain="undefined"!=typeof process&&"undefined"!=typeof process.versions&&"undefined"!=typeof process.versions.electron&&"browser"===process.type,e.hasPerformanceNow=e.global.performance&&"function"==typeof e.global.performance.now}(AMDLoader||(AMDLoader={}));var AMDLoader;!function(e){function t(){return e.hasPerformanceNow?e.global.performance.now():Date.now()}var r;!function(e){e[e.LoaderAvailable=1]="LoaderAvailable",e[e.BeginLoadingScript=10]="BeginLoadingScript",e[e.EndLoadingScriptOK=11]="EndLoadingScriptOK",e[e.EndLoadingScriptError=12]="EndLoadingScriptError",e[e.BeginInvokeFactory=21]="BeginInvokeFactory",e[e.EndInvokeFactory=22]="EndInvokeFactory",e[e.NodeBeginEvaluatingScript=31]="NodeBeginEvaluatingScript",e[e.NodeEndEvaluatingScript=32]="NodeEndEvaluatingScript",e[e.NodeBeginNativeRequire=33]="NodeBeginNativeRequire",e[e.NodeEndNativeRequire=34]="NodeEndNativeRequire"}(r=e.LoaderEventType||(e.LoaderEventType={})),e.getHighPerformanceTimestamp=t;var n=function(){function e(e,t,r){this.type=e,this.detail=t,this.timestamp=r}return e}();e.LoaderEvent=n;var o=function(){function e(e){this._events=[new n(r.LoaderAvailable,"",e)]}return e.prototype.record=function(e,r){this._events.push(new n(e,r,t()))},e.prototype.getEvents=function(){return this._events},e}();e.LoaderEventRecorder=o;var i=function(){function e(){}return e.prototype.record=function(e,t){},e.prototype.getEvents=function(){return[]},e}();i.INSTANCE=new i,e.NullLoaderEventRecorder=i}(AMDLoader||(AMDLoader={}));var AMDLoader;!function(e){var t=function(){function t(){}return t.fileUriToFilePath=function(t){if(t=decodeURI(t),e.isWindows){if(/^file:\/\/\//.test(t))return t.substr(8);if(/^file:\/\//.test(t))return t.substr(5)}else if(/^file:\/\//.test(t))return t.substr(7);return t},t.startsWith=function(e,t){return e.length>=t.length&&e.substr(0,t.length)===t},t.endsWith=function(e,t){return e.length>=t.length&&e.substr(e.length-t.length)===t},t.containsQueryString=function(e){return/^[^\#]*\?/gi.test(e)},t.isAbsolutePath=function(e){return/^((http:\/\/)|(https:\/\/)|(file:\/\/)|(\/))/.test(e)},t.forEachProperty=function(e,t){if(e){var r=void 0;for(r in e)e.hasOwnProperty(r)&&t(r,e[r])}},t.isEmpty=function(e){var r=!0;return t.forEachProperty(e,function(){r=!1}),r},t.recursiveClone=function(e){if(!e||"object"!=typeof e)return e;var r=Array.isArray(e)?[]:{};return t.forEachProperty(e,function(e,n){n&&"object"==typeof n?r[e]=t.recursiveClone(n):r[e]=n}),r},t.generateAnonymousModule=function(){return"===anonymous"+t.NEXT_ANONYMOUS_ID++ +"==="},t.isAnonymousModule=function(e){return/^===anonymous/.test(e)},t}();t.NEXT_ANONYMOUS_ID=1,e.Utilities=t}(AMDLoader||(AMDLoader={}));var AMDLoader;!function(e){var t=function(){function t(){}return t.validateConfigurationOptions=function(t){function r(e){return"load"===e.errorCode?(console.error('Loading "'+e.moduleId+'" failed'),console.error("Detail: ",e.detail),e.detail&&e.detail.stack&&console.error(e.detail.stack),console.error("Here are the modules that depend on it:"),void console.error(e.neededBy)):"factory"===e.errorCode?(console.error('The factory method of "'+e.moduleId+'" has thrown an exception'),console.error(e.detail),void(e.detail&&e.detail.stack&&console.error(e.detail.stack))):void 0}return t=t||{},"string"!=typeof t.baseUrl&&(t.baseUrl=""),"boolean"!=typeof t.isBuild&&(t.isBuild=!1),"object"!=typeof t.paths&&(t.paths={}),"object"!=typeof t.config&&(t.config={}),"undefined"==typeof t.catchError&&(t.catchError=e.isWebWorker),"string"!=typeof t.urlArgs&&(t.urlArgs=""),"function"!=typeof t.onError&&(t.onError=r),"object"==typeof t.ignoreDuplicateModules&&Array.isArray(t.ignoreDuplicateModules)||(t.ignoreDuplicateModules=[]),t.baseUrl.length>0&&(e.Utilities.endsWith(t.baseUrl,"/")||(t.baseUrl+="/")),Array.isArray(t.nodeModules)||(t.nodeModules=[]),("number"!=typeof t.nodeCachedDataWriteDelay||t.nodeCachedDataWriteDelay<0)&&(t.nodeCachedDataWriteDelay=7e3),"function"!=typeof t.onNodeCachedDataError&&(t.onNodeCachedDataError=function(e){"cachedDataRejected"===e.errorCode?console.warn("Rejected cached data from file: "+e.path):"unlink"!==e.errorCode&&"writeFile"!==e.errorCode||(console.error("Problems writing cached data file: "+e.path),console.error(e.detail))}),t},t.mergeConfigurationOptions=function(r,n){void 0===r&&(r=null),void 0===n&&(n=null);var o=e.Utilities.recursiveClone(n||{});return e.Utilities.forEachProperty(r,function(t,r){"ignoreDuplicateModules"===t&&"undefined"!=typeof o.ignoreDuplicateModules?o.ignoreDuplicateModules=o.ignoreDuplicateModules.concat(r):"paths"===t&&"undefined"!=typeof o.paths?e.Utilities.forEachProperty(r,function(e,t){return o.paths[e]=t}):"config"===t&&"undefined"!=typeof o.config?e.Utilities.forEachProperty(r,function(e,t){return o.config[e]=t}):o[t]=e.Utilities.recursiveClone(r)}),t.validateConfigurationOptions(o)},t}();e.ConfigurationOptionsUtil=t;var r=function(){function r(r){if(this.options=t.mergeConfigurationOptions(r),this._createIgnoreDuplicateModulesMap(),this._createNodeModulesMap(),this._createSortedPathsRules(),""===this.options.baseUrl){if(e.isNode&&this.options.nodeRequire&&this.options.nodeRequire.main&&this.options.nodeRequire.main.filename){var n=this.options.nodeRequire.main.filename,o=Math.max(n.lastIndexOf("/"),n.lastIndexOf("\\"));this.options.baseUrl=n.substring(0,o+1)}if(e.isNode&&this.options.nodeMain){var n=this.options.nodeMain,o=Math.max(n.lastIndexOf("/"),n.lastIndexOf("\\"));this.options.baseUrl=n.substring(0,o+1)}}}return r.prototype._createIgnoreDuplicateModulesMap=function(){this.ignoreDuplicateModulesMap={};for(var e=0;e<this.options.ignoreDuplicateModules.length;e++)this.ignoreDuplicateModulesMap[this.options.ignoreDuplicateModules[e]]=!0},r.prototype._createNodeModulesMap=function(){this.nodeModulesMap=Object.create(null);for(var e=0,t=this.options.nodeModules;e<t.length;e++){var r=t[e];this.nodeModulesMap[r]=!0}},r.prototype._createSortedPathsRules=function(){var t=this;this.sortedPathsRules=[],e.Utilities.forEachProperty(this.options.paths,function(e,r){Array.isArray(r)?t.sortedPathsRules.push({from:e,to:r}):t.sortedPathsRules.push({from:e,to:[r]})}),this.sortedPathsRules.sort(function(e,t){return t.from.length-e.from.length})},r.prototype.cloneAndMerge=function(e){return new r(t.mergeConfigurationOptions(e,this.options))},r.prototype.getOptionsLiteral=function(){return this.options},r.prototype._applyPaths=function(t){for(var r,n=0,o=this.sortedPathsRules.length;n<o;n++)if(r=this.sortedPathsRules[n],e.Utilities.startsWith(t,r.from)){for(var i=[],s=0,d=r.to.length;s<d;s++)i.push(r.to[s]+t.substr(r.from.length));return i}return[t]},r.prototype._addUrlArgsToUrl=function(t){return e.Utilities.containsQueryString(t)?t+"&"+this.options.urlArgs:t+"?"+this.options.urlArgs},r.prototype._addUrlArgsIfNecessaryToUrl=function(e){return this.options.urlArgs?this._addUrlArgsToUrl(e):e},r.prototype._addUrlArgsIfNecessaryToUrls=function(e){if(this.options.urlArgs)for(var t=0,r=e.length;t<r;t++)e[t]=this._addUrlArgsToUrl(e[t]);return e},r.prototype.moduleIdToPaths=function(t){if(this.nodeModulesMap[t]===!0)return this.isBuild()?["empty:"]:["node|"+t];var r,n=t;if(e.Utilities.endsWith(n,".js")||e.Utilities.isAbsolutePath(n))e.Utilities.endsWith(n,".js")||e.Utilities.containsQueryString(n)||(n+=".js"),r=[n];else{r=this._applyPaths(n);for(var o=0,i=r.length;o<i;o++)this.isBuild()&&"empty:"===r[o]||(e.Utilities.isAbsolutePath(r[o])||(r[o]=this.options.baseUrl+r[o]),e.Utilities.endsWith(r[o],".js")||e.Utilities.containsQueryString(r[o])||(r[o]=r[o]+".js"))}return this._addUrlArgsIfNecessaryToUrls(r)},r.prototype.requireToUrl=function(t){var r=t;return e.Utilities.isAbsolutePath(r)||(r=this._applyPaths(r)[0],e.Utilities.isAbsolutePath(r)||(r=this.options.baseUrl+r)),this._addUrlArgsIfNecessaryToUrl(r)},r.prototype.isBuild=function(){return this.options.isBuild},r.prototype.isDuplicateMessageIgnoredFor=function(e){return this.ignoreDuplicateModulesMap.hasOwnProperty(e)},r.prototype.getConfigForModule=function(e){if(this.options.config)return this.options.config[e]},r.prototype.shouldCatchError=function(){return this.options.catchError},r.prototype.shouldRecordStats=function(){return this.options.recordStats},r.prototype.onError=function(e){this.options.onError(e)},r}();e.Configuration=r}(AMDLoader||(AMDLoader={}));var AMDLoader;!function(e){var t=function(){function e(e){this.actualScriptLoader=e,this.callbackMap={}}return e.prototype.load=function(e,t,r,n){var o=this,i={callback:r,errorback:n};return this.callbackMap.hasOwnProperty(t)?void this.callbackMap[t].push(i):(this.callbackMap[t]=[i],void this.actualScriptLoader.load(e,t,function(){return o.triggerCallback(t)},function(e){return o.triggerErrorback(t,e)}))},e.prototype.triggerCallback=function(e){var t=this.callbackMap[e];delete this.callbackMap[e];for(var r=0;r<t.length;r++)t[r].callback()},e.prototype.triggerErrorback=function(e,t){var r=this.callbackMap[e];delete this.callbackMap[e];for(var n=0;n<r.length;n++)r[n].errorback(t)},e}(),r=function(){function e(){}return e.prototype.attachListeners=function(e,t,r){var n=function(){e.removeEventListener("load",o),e.removeEventListener("error",i)},o=function(e){n(),t()},i=function(e){n(),r(e)};e.addEventListener("load",o),e.addEventListener("error",i)},e.prototype.load=function(e,t,r,n){var o=document.createElement("script");o.setAttribute("async","async"),o.setAttribute("type","text/javascript"),this.attachListeners(o,r,n),o.setAttribute("src",t),document.getElementsByTagName("head")[0].appendChild(o)},e}(),n=function(){function e(){}return e.prototype.load=function(e,t,r,n){try{importScripts(t),r()}catch(e){n(e)}},e}(),o=function(){function t(){this._initialized=!1}return t.prototype._init=function(e){this._initialized||(this._initialized=!0,this._fs=e("fs"),this._vm=e("vm"),this._path=e("path"),this._crypto=e("crypto"))},t.prototype.load=function(r,n,o,i){var s=this,d=r.getConfig().getOptionsLiteral(),a=d.nodeRequire||e.global.nodeRequire,u=d.nodeInstrumenter||function(e){return e};this._init(a);var l=r.getRecorder();if(/^node\|/.test(n)){var c=n.split("|"),f=null;try{f=a(c[1])}catch(e){return void i(e)}r.enqueueDefineAnonymousModule([],function(){return f}),o()}else n=e.Utilities.fileUriToFilePath(n),this._fs.readFile(n,{encoding:"utf8"},function(a,c){if(a)return void i(a);var f=s._path.normalize(n);if(e.isElectronRenderer){var p=f.match(/^([a-z])\:(.*)/i);p&&(f=p[1].toUpperCase()+":"+p[2]),f="file:///"+f.replace(/\\/g,"/")}var h,g="(function (require, define, __filename, __dirname) { ",v="\n});";if(h=c.charCodeAt(0)===t._BOM?g+c.substring(1)+v:g+c+v,h=u(h,f),d.nodeCachedDataDir){var _=s._getCachedDataPath(d.nodeCachedDataDir,n);s._fs.readFile(_,function(e,i){var a={filename:f,produceCachedData:"undefined"==typeof i,cachedData:i},u=s._loadAndEvalScript(n,f,h,a,l);o(),u.cachedDataRejected?(d.onNodeCachedDataError({errorCode:"cachedDataRejected",path:_}),t._runSoon(function(){return s._fs.unlink(_,function(e){e&&r.getConfig().getOptionsLiteral().onNodeCachedDataError({errorCode:"unlink",path:_,detail:e})})},d.nodeCachedDataWriteDelay)):u.cachedDataProduced&&t._runSoon(function(){return s._fs.writeFile(_,u.cachedData,function(e){e&&r.getConfig().getOptionsLiteral().onNodeCachedDataError({errorCode:"writeFile",path:_,detail:e})})},d.nodeCachedDataWriteDelay)})}else s._loadAndEvalScript(n,f,h,{filename:f},l),o()})},t.prototype._loadAndEvalScript=function(t,r,n,o,i){i.record(e.LoaderEventType.NodeBeginEvaluatingScript,t);var s=new this._vm.Script(n,o),d=s.runInThisContext(o);return d.call(e.global,e.RequireFunc,e.DefineFunc,r,this._path.dirname(t)),i.record(e.LoaderEventType.NodeEndEvaluatingScript,t),s},t.prototype._getCachedDataPath=function(e,t){var r=this._crypto.createHash("md5").update(t,"utf8").digest("hex"),n=this._path.basename(t).replace(/\.js$/,"");return this._path.join(e,r+"-"+n+".code")},t._runSoon=function(e,t){var r=t+Math.ceil(Math.random()*t);setTimeout(e,r)},t}();o._BOM=65279,e.scriptLoader=new t(e.isWebWorker?new n:e.isNode?new o:new r)}(AMDLoader||(AMDLoader={}));var AMDLoader;!function(e){var t=function(){function t(e){var t=e.lastIndexOf("/");t!==-1?this.fromModulePath=e.substr(0,t+1):this.fromModulePath=""}return t._normalizeModuleId=function(e){var t,r=e;for(t=/\/\.\//;t.test(r);)r=r.replace(t,"/");for(r=r.replace(/^\.\//g,""),t=/\/(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//;t.test(r);)r=r.replace(t,"/");return r=r.replace(/^(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//,"")},t.prototype.resolveModule=function(r){var n=r;return e.Utilities.isAbsolutePath(n)||(e.Utilities.startsWith(n,"./")||e.Utilities.startsWith(n,"../"))&&(n=t._normalizeModuleId(this.fromModulePath+n)),n},t}();t.ROOT=new t(""),e.ModuleIdResolver=t;var r=function(){function t(e,t,r,n,o,i){this.id=e,this.strId=t,this.dependencies=r,this._callback=n,this._errorback=o,this.moduleIdResolver=i,this.exports={},this.exportsPassedIn=!1,this.unresolvedDependenciesCount=this.dependencies.length,this._isComplete=!1}return t._safeInvokeFunction=function(t,r){try{return{returnedValue:t.apply(e.global,r),producedError:null}}catch(e){return{returnedValue:null,producedError:e}}},t._invokeFactory=function(t,r,n,o){return t.isBuild()&&!e.Utilities.isAnonymousModule(r)?{returnedValue:null,producedError:null}:t.shouldCatchError()?this._safeInvokeFunction(n,o):{returnedValue:n.apply(e.global,o),producedError:null}},t.prototype.complete=function(r,n,o){this._isComplete=!0;var i=null;if(this._callback)if("function"==typeof this._callback){r.record(e.LoaderEventType.BeginInvokeFactory,this.strId);var s=t._invokeFactory(n,this.strId,this._callback,o);i=s.producedError,r.record(e.LoaderEventType.EndInvokeFactory,this.strId),i||"undefined"==typeof s.returnedValue||this.exportsPassedIn&&!e.Utilities.isEmpty(this.exports)||(this.exports=s.returnedValue)}else this.exports=this._callback;i&&n.onError({errorCode:"factory",moduleId:this.strId,detail:i}),this.dependencies=null,this._callback=null,this._errorback=null,this.moduleIdResolver=null},t.prototype.onDependencyError=function(e){return!!this._errorback&&(this._errorback(e),!0)},t.prototype.isComplete=function(){return this._isComplete},t}();e.Module=r;var n=function(){function e(){this._nextId=0,this._strModuleIdToIntModuleId=new Map,this._intModuleIdToStrModuleId=[],this.getModuleId("exports"),this.getModuleId("module"),this.getModuleId("require")}return e.prototype.getMaxModuleId=function(){return this._nextId},e.prototype.getModuleId=function(e){var t=this._strModuleIdToIntModuleId.get(e);return"undefined"==typeof t&&(t=this._nextId++,this._strModuleIdToIntModuleId.set(e,t),this._intModuleIdToStrModuleId[t]=e),t},e.prototype.getStrModuleId=function(e){return this._intModuleIdToStrModuleId[e]},e}(),o=function(){function e(e){this.id=e}return e}();o.EXPORTS=new o(0),o.MODULE=new o(1),o.REQUIRE=new o(2),e.RegularDependency=o;var i=function(){function e(e,t,r){this.id=e,this.pluginId=t,this.pluginParam=r}return e}();e.PluginDependency=i;var s=function(){function s(t,r){void 0===r&&(r=0),this._recorder=null,this._loaderAvailableTimestamp=r,this._moduleIdProvider=new n,this._config=new e.Configuration,this._scriptLoader=t,this._modules2=[],this._knownModules2=[],this._inverseDependencies2=[],this._inversePluginDependencies2=new Map,this._currentAnnonymousDefineCall=null,this._buildInfoPath=[],this._buildInfoDefineStack=[],this._buildInfoDependencies=[]}return s._findRelevantLocationInStack=function(e,t){for(var r=function(e){return e.replace(/\\/g,"/")},n=r(e),o=t.split(/\n/),i=0;i<o.length;i++){var s=o[i].match(/(.*):(\d+):(\d+)\)?$/);if(s){var d=s[1],a=s[2],u=s[3],l=Math.max(d.lastIndexOf(" ")+1,d.lastIndexOf("(")+1);if(d=d.substr(l),d=r(d),d===n){var c={line:parseInt(a,10),col:parseInt(u,10)};return 1===c.line&&(c.col-="(function (require, define, __filename, __dirname) { ".length),c}}}throw new Error("Could not correlate define call site for needle "+e)},s.prototype.getBuildInfo=function(){if(!this._config.isBuild())return null;for(var e=[],t=0,r=0,n=this._modules2.length;r<n;r++){var o=this._modules2[r];if(o){var i=this._buildInfoPath[o.id]||null,d=this._buildInfoDefineStack[o.id]||null,a=this._buildInfoDependencies[o.id];e[t++]={id:o.strId,path:i,defineLocation:i&&d?s._findRelevantLocationInStack(i,d):null,dependencies:a,shim:null,exports:o.exports}}}return e},s.prototype.getRecorder=function(){return this._recorder||(this._config.shouldRecordStats()?this._recorder=new e.LoaderEventRecorder(this._loaderAvailableTimestamp):this._recorder=e.NullLoaderEventRecorder.INSTANCE),this._recorder},s.prototype.getLoaderEvents=function(){return this.getRecorder().getEvents()},s.prototype.enqueueDefineAnonymousModule=function(e,t){if(null!==this._currentAnnonymousDefineCall)throw new Error("Can only have one anonymous define call per script file");var r=null;this._config.isBuild()&&(r=new Error("StackLocation").stack),this._currentAnnonymousDefineCall={stack:r,dependencies:e,callback:t}},s.prototype.defineModule=function(e,n,o,i,s,d){var a=this;void 0===d&&(d=new t(e));var u=this._moduleIdProvider.getModuleId(e);if(this._modules2[u])return void(this._config.isDuplicateMessageIgnoredFor(e)||console.warn("Duplicate definition of module '"+e+"'"));var l=new r(u,e,this._normalizeDependencies(n,d),o,i,d);this._modules2[u]=l,this._config.isBuild()&&(this._buildInfoDefineStack[u]=s,this._buildInfoDependencies[u]=l.dependencies.map(function(e){return a._moduleIdProvider.getStrModuleId(e.id)})),this._resolve(l)},s.prototype._normalizeDependency=function(e,t){if("exports"===e)return o.EXPORTS;if("module"===e)return o.MODULE;if("require"===e)return o.REQUIRE;var r=e.indexOf("!");if(r>=0){var n=t.resolveModule(e.substr(0,r)),s=t.resolveModule(e.substr(r+1)),d=this._moduleIdProvider.getModuleId(n+"!"+s),a=this._moduleIdProvider.getModuleId(n);return new i(d,a,s)}return new o(this._moduleIdProvider.getModuleId(t.resolveModule(e)))},s.prototype._normalizeDependencies=function(e,t){for(var r=[],n=0,o=0,i=e.length;o<i;o++)r[n++]=this._normalizeDependency(e[o],t);return r},s.prototype._relativeRequire=function(t,r,n,o){return"string"==typeof r?this.synchronousRequire(r,t):void this.defineModule(e.Utilities.generateAnonymousModule(),r,n,o,null,t)},s.prototype.synchronousRequire=function(e,r){void 0===r&&(r=new t(e));var n=this._normalizeDependency(e,r),o=this._modules2[n.id];if(!o)throw new Error("Check dependency list! Synchronous require cannot resolve module '"+e+"'. This is the first mention of this module!");if(!o.isComplete())throw new Error("Check dependency list! Synchronous require cannot resolve module '"+e+"'. This module has not been resolved completely yet.");return o.exports},s.prototype.configure=function(t,r){var n=this._config.shouldRecordStats();r?this._config=new e.Configuration(t):this._config=this._config.cloneAndMerge(t),this._config.shouldRecordStats()&&!n&&(this._recorder=null)},s.prototype.getConfig=function(){return this._config},s.prototype._onLoad=function(e){if(null!==this._currentAnnonymousDefineCall){var t=this._currentAnnonymousDefineCall;this._currentAnnonymousDefineCall=null,this.defineModule(this._moduleIdProvider.getStrModuleId(e),t.dependencies,t.callback,null,t.stack)}},s.prototype._createLoadError=function(e,t){var r=this,n=this._moduleIdProvider.getStrModuleId(e),o=(this._inverseDependencies2[e]||[]).map(function(e){return r._moduleIdProvider.getStrModuleId(e)});return{errorCode:"load",moduleId:n,neededBy:o,detail:t}},s.prototype._onLoadError=function(e,t){for(var r=this._createLoadError(e,t),n=[],o=0,i=this._moduleIdProvider.getMaxModuleId();o<i;o++)n[o]=!1;var s=!1,d=[];for(d.push(e),n[e]=!0;d.length>0;){var a=d.shift(),u=this._modules2[a];u&&(s=u.onDependencyError(r)||s);var l=this._inverseDependencies2[a];if(l)for(var o=0,i=l.length;o<i;o++){var c=l[o];n[c]||(d.push(c),n[c]=!0)}}s||this._config.onError(r)},s.prototype._hasDependencyPath=function(e,t){var r=this._modules2[e];if(!r)return!1;for(var n=[],o=0,i=this._moduleIdProvider.getMaxModuleId();o<i;o++)n[o]=!1;var s=[];for(s.push(r),n[e]=!0;s.length>0;){var d=s.shift(),a=d.dependencies;if(a)for(var o=0,i=a.length;o<i;o++){var u=a[o];if(u.id===t)return!0;var l=this._modules2[u.id];l&&!n[u.id]&&(n[u.id]=!0,s.push(l))}}return!1},s.prototype._findCyclePath=function(e,t,r){if(e===t||50===r)return[e];var n=this._modules2[e];if(!n)return null;for(var o=n.dependencies,i=0,s=o.length;i<s;i++){var d=this._findCyclePath(o[i].id,t,r+1);if(null!==d)return d.push(e),d}return null},s.prototype._createRequire=function(t){var r=this,n=function(e,n,o){return r._relativeRequire(t,e,n,o)};return n.toUrl=function(e){return r._config.requireToUrl(t.resolveModule(e))},n.getStats=function(){return r.getLoaderEvents()},n.__$__nodeRequire=e.global.nodeRequire,n},s.prototype._loadModule=function(t){var r=this;if(!this._modules2[t]&&!this._knownModules2[t]){this._knownModules2[t]=!0;var n=this._moduleIdProvider.getStrModuleId(t),o=this._config.moduleIdToPaths(n);e.isNode&&n.indexOf("/")===-1&&o.push("node|"+n);var i=-1,s=function(n){if(i++,i>=o.length)r._onLoadError(t,n);else{var d=o[i],a=r.getRecorder();if(r._config.isBuild()&&"empty:"===d)return r._buildInfoPath[t]=d,r.defineModule(r._moduleIdProvider.getStrModuleId(t),[],null,null,null),void r._onLoad(t);a.record(e.LoaderEventType.BeginLoadingScript,d),r._scriptLoader.load(r,d,function(){r._config.isBuild()&&(r._buildInfoPath[t]=d),a.record(e.LoaderEventType.EndLoadingScriptOK,d),r._onLoad(t)},function(t){a.record(e.LoaderEventType.EndLoadingScriptError,d),s(t)})}};s(null)}},s.prototype._loadPluginDependency=function(e,r){var n=this;if(!this._modules2[r.id]&&!this._knownModules2[r.id]){this._knownModules2[r.id]=!0;var o=function(e){n.defineModule(n._moduleIdProvider.getStrModuleId(r.id),[],e,null,null)};o.error=function(e){n._config.onError(n._createLoadError(r.id,e))},e.load(r.pluginParam,this._createRequire(t.ROOT),o,this._config.getOptionsLiteral())}},s.prototype._resolve=function(e){for(var t=this,r=e.dependencies,n=0,s=r.length;n<s;n++){var d=r[n];if(d!==o.EXPORTS)if(d!==o.MODULE)if(d!==o.REQUIRE){var a=this._modules2[d.id];if(a&&a.isComplete())e.unresolvedDependenciesCount--;else if(this._hasDependencyPath(d.id,e.id)){console.warn("There is a dependency cycle between '"+this._moduleIdProvider.getStrModuleId(d.id)+"' and '"+this._moduleIdProvider.getStrModuleId(e.id)+"'. The cyclic path follows:");var u=this._findCyclePath(d.id,e.id,0);u.reverse(),u.push(d.id),console.warn(u.map(function(e){return t._moduleIdProvider.getStrModuleId(e)}).join(" => \n")),e.unresolvedDependenciesCount--}else if(this._inverseDependencies2[d.id]=this._inverseDependencies2[d.id]||[],this._inverseDependencies2[d.id].push(e.id),d instanceof i){var l=this._modules2[d.pluginId];if(l&&l.isComplete()){this._loadPluginDependency(l.exports,d);continue}var c=this._inversePluginDependencies2.get(d.pluginId);c||(c=[],this._inversePluginDependencies2.set(d.pluginId,c)),c.push(d),this._loadModule(d.pluginId)}else this._loadModule(d.id)}else e.unresolvedDependenciesCount--;else e.unresolvedDependenciesCount--;else e.exportsPassedIn=!0,e.unresolvedDependenciesCount--}0===e.unresolvedDependenciesCount&&this._onModuleComplete(e)},s.prototype._onModuleComplete=function(e){var t=this,r=this.getRecorder();if(!e.isComplete()){for(var n=e.dependencies,i=[],s=0,d=n.length;s<d;s++){var a=n[s];if(a!==o.EXPORTS)if(a!==o.MODULE)if(a!==o.REQUIRE){var u=this._modules2[a.id];u?i[s]=u.exports:i[s]=null}else i[s]=this._createRequire(e.moduleIdResolver);else i[s]={id:e.strId,config:function(){return t._config.getConfigForModule(e.strId)}};else i[s]=e.exports}e.complete(r,this._config,i);var l=this._inverseDependencies2[e.id];if(this._inverseDependencies2[e.id]=null,l)for(var s=0,d=l.length;s<d;s++){var c=l[s],f=this._modules2[c];f.unresolvedDependenciesCount--,0===f.unresolvedDependenciesCount&&this._onModuleComplete(f)}var p=this._inversePluginDependencies2.get(e.id);if(p){this._inversePluginDependencies2.delete(e.id);for(var s=0,d=p.length;s<d;s++)this._loadPluginDependency(e.exports,p[s])}}},s}();e.ModuleManager=s}(AMDLoader||(AMDLoader={}));var define,AMDLoader;!function(e){function t(){if(r=new e.ModuleManager(e.scriptLoader,n),e.isNode){var t=e.global.require||require,s=function(n){r.getRecorder().record(e.LoaderEventType.NodeBeginNativeRequire,n);try{return t(n)}finally{r.getRecorder().record(e.LoaderEventType.NodeEndNativeRequire,n)}};e.global.nodeRequire=s,i.nodeRequire=s}e.isNode&&!e.isElectronRenderer?(module.exports=i,define=function(){o.apply(null,arguments)},require=i):("undefined"!=typeof e.global.require&&"function"!=typeof e.global.require&&i.config(e.global.require),e.isElectronRenderer?define=function(){o.apply(null,arguments)}:e.global.define=define=o,e.global.require=i,e.global.require.__$__nodeRequire=s)}var r,n,o=function(){function e(e,t,n){"string"!=typeof e&&(n=t,t=e,e=null),"object"==typeof t&&Array.isArray(t)||(n=t,t=null),t||(t=["require","exports","module"]),e?r.defineModule(e,t,n,null,null):r.enqueueDefineAnonymousModule(t,n)}return e}();o.amd={jQuery:!0},e.DefineFunc=o;var i=function(){function t(){if(1===arguments.length){if(arguments[0]instanceof Object&&!Array.isArray(arguments[0]))return void t.config(arguments[0]);if("string"==typeof arguments[0])return r.synchronousRequire(arguments[0])}if((2===arguments.length||3===arguments.length)&&Array.isArray(arguments[0]))return void r.defineModule(e.Utilities.generateAnonymousModule(),arguments[0],arguments[1],arguments[2],null);throw new Error("Unrecognized require call")}return t.config=function(e,t){void 0===t&&(t=!1),r.configure(e,t)},t.getConfig=function(){return r.getConfig().getOptionsLiteral()},t.reset=function(){r=new e.ModuleManager(e.scriptLoader,n)},t.getBuildInfo=function(){return r.getBuildInfo()},t.getStats=function(){return r.getLoaderEvents()},t}();e.RequireFunc=i,"function"==typeof e.global.define&&e.global.define.amd||(t(),n=e.getHighPerformanceTimestamp())}(AMDLoader||(AMDLoader={}));
//# sourceMappingURL=../../min-maps/vs/loader.js.map;
{
        monaco_require = require;
        window.require = require_bkup;
    };
/*
 * jsTree 1.0-rc3
 * http://jstree.com/
 *
 * Copyright (c) 2010 Ivan Bozhanov (vakata.com)
 *
 * Licensed same as jquery - under the terms of either the MIT License or the GPL Version 2 License
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Date: 2011-02-09 01:17:14 +0200 (ср, 09 февр 2011) $
 * $Revision: 236 $
 */

/*jslint browser: true, onevar: true, undef: true, bitwise: true, strict: true */
/*global window : false, clearInterval: false, clearTimeout: false, document: false, setInterval: false, setTimeout: false, jQuery: false, navigator: false, XSLTProcessor: false, DOMParser: false, XMLSerializer: false*/

"use strict";

// top wrapper to prevent multiple inclusion (is this OK?)
(function () { if(jQuery && jQuery.jstree) { return; }
	var is_ie6 = false, is_ie7 = false, is_ff2 = false;

/* 
 * jsTree core
 */
(function ($) {
	// Common functions not related to jsTree 
	// decided to move them to a `vakata` "namespace"
	$.vakata = {};
	// CSS related functions
	$.vakata.css = {
		get_css : function(rule_name, delete_flag, sheet) {
			rule_name = rule_name.toLowerCase();
			var css_rules = sheet.cssRules || sheet.rules,
				j = 0;
			do {
				if(css_rules.length && j > css_rules.length + 5) { return false; }
				if(css_rules[j].selectorText && css_rules[j].selectorText.toLowerCase() == rule_name) {
					if(delete_flag === true) {
						if(sheet.removeRule) { sheet.removeRule(j); }
						if(sheet.deleteRule) { sheet.deleteRule(j); }
						return true;
					}
					else { return css_rules[j]; }
				}
			}
			while (css_rules[++j]);
			return false;
		},
		add_css : function(rule_name, sheet) {
			if($.jstree.css.get_css(rule_name, false, sheet)) { return false; }
			if(sheet.insertRule) { sheet.insertRule(rule_name + ' { }', 0); } else { sheet.addRule(rule_name, null, 0); }
			return $.vakata.css.get_css(rule_name);
		},
		remove_css : function(rule_name, sheet) { 
			return $.vakata.css.get_css(rule_name, true, sheet); 
		},
		add_sheet : function(opts) {
			var tmp = false, is_new = true;
			if(opts.str) {
				if(opts.title) { tmp = $("style[id='" + opts.title + "-stylesheet']")[0]; }
				if(tmp) { is_new = false; }
				else {
					tmp = document.createElement("style");
					tmp.setAttribute('type',"text/css");
					if(opts.title) { tmp.setAttribute("id", opts.title + "-stylesheet"); }
				}
				if(tmp.styleSheet) {
					if(is_new) { 
						document.getElementsByTagName("head")[0].appendChild(tmp); 
						tmp.styleSheet.cssText = opts.str; 
					}
					else {
						tmp.styleSheet.cssText = tmp.styleSheet.cssText + " " + opts.str; 
					}
				}
				else {
					tmp.appendChild(document.createTextNode(opts.str));
					document.getElementsByTagName("head")[0].appendChild(tmp);
				}
				return tmp.sheet || tmp.styleSheet;
			}
			if(opts.url) {
				if(document.createStyleSheet) {
					try { tmp = document.createStyleSheet(opts.url); } catch (e) { }
				}
				else {
					tmp			= document.createElement('link');
					tmp.rel		= 'stylesheet';
					tmp.type	= 'text/css';
					tmp.media	= "all";
					tmp.href	= opts.url;
					document.getElementsByTagName("head")[0].appendChild(tmp);
					return tmp.styleSheet;
				}
			}
		}
	};

	// private variables 
	var instances = [],			// instance array (used by $.jstree.reference/create/focused)
		focused_instance = -1,	// the index in the instance array of the currently focused instance
		plugins = {},			// list of included plugins
		prepared_move = {};		// for the move_node function

	// jQuery plugin wrapper (thanks to jquery UI widget function)
	$.fn.jstree = function (settings) {
		var isMethodCall = (typeof settings == 'string'), // is this a method call like $().jstree("open_node")
			args = Array.prototype.slice.call(arguments, 1), 
			returnValue = this;

		// if a method call execute the method on all selected instances
		if(isMethodCall) {
			if(settings.substring(0, 1) == '_') { return returnValue; }
			this.each(function() {
				var instance = instances[$.data(this, "jstree_instance_id")],
					methodValue = (instance && $.isFunction(instance[settings])) ? instance[settings].apply(instance, args) : instance;
					if(typeof methodValue !== "undefined" && (settings.indexOf("is_") === 0 || (methodValue !== true && methodValue !== false))) { returnValue = methodValue; return false; }
			});
		}
		else {
			this.each(function() {
				// extend settings and allow for multiple hashes and $.data
				var instance_id = $.data(this, "jstree_instance_id"),
					a = [],
					b = settings ? $.extend({}, true, settings) : {},
					c = $(this), 
					s = false, 
					t = [];
				a = a.concat(args);
				if(c.data("jstree")) { a.push(c.data("jstree")); }
				b = a.length ? $.extend.apply(null, [true, b].concat(a)) : b;

				// if an instance already exists, destroy it first
				if(typeof instance_id !== "undefined" && instances[instance_id]) { instances[instance_id].destroy(); }
				// push a new empty object to the instances array
				instance_id = parseInt(instances.push({}),10) - 1;
				// store the jstree instance id to the container element
				$.data(this, "jstree_instance_id", instance_id);
				// clean up all plugins
				b.plugins = $.isArray(b.plugins) ? b.plugins : $.jstree.defaults.plugins.slice();
				b.plugins.unshift("core");
				// only unique plugins
				b.plugins = b.plugins.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");

				// extend defaults with passed data
				s = $.extend(true, {}, $.jstree.defaults, b);
				s.plugins = b.plugins;
				$.each(plugins, function (i, val) { 
					if($.inArray(i, s.plugins) === -1) { s[i] = null; delete s[i]; } 
					else { t.push(i); }
				});
				s.plugins = t;

				// push the new object to the instances array (at the same time set the default classes to the container) and init
				instances[instance_id] = new $.jstree._instance(instance_id, $(this).addClass("jstree jstree-" + instance_id), s); 
				// init all activated plugins for this instance
				$.each(instances[instance_id]._get_settings().plugins, function (i, val) { instances[instance_id].data[val] = {}; });
				$.each(instances[instance_id]._get_settings().plugins, function (i, val) { if(plugins[val]) { plugins[val].__init.apply(instances[instance_id]); } });
				// initialize the instance
				setTimeout(function() { if(instances[instance_id]) { instances[instance_id].init(); } }, 0);
			});
		}
		// return the jquery selection (or if it was a method call that returned a value - the returned value)
		return returnValue;
	};
	// object to store exposed functions and objects
	$.jstree = {
		defaults : {
			plugins : []
		},
		_focused : function () { return instances[focused_instance] || null; },
		_reference : function (needle) { 
			// get by instance id
			if(instances[needle]) { return instances[needle]; }
			// get by DOM (if still no luck - return null
			var o = $(needle); 
			if(!o.length && typeof needle === "string") { o = $("#" + needle); }
			if(!o.length) { return null; }
			return instances[o.closest(".jstree").data("jstree_instance_id")] || null; 
		},
		_instance : function (index, container, settings) { 
			// for plugins to store data in
			this.data = { core : {} };
			this.get_settings	= function () { return $.extend(true, {}, settings); };
			this._get_settings	= function () { return settings; };
			this.get_index		= function () { return index; };
			this.get_container	= function () { return container; };
			this.get_container_ul = function () { return container.children("ul:eq(0)"); };
			this._set_settings	= function (s) { 
				settings = $.extend(true, {}, settings, s);
			};
		},
		_fn : { },
		plugin : function (pname, pdata) {
			pdata = $.extend({}, {
				__init		: $.noop, 
				__destroy	: $.noop,
				_fn			: {},
				defaults	: false
			}, pdata);
			plugins[pname] = pdata;

			$.jstree.defaults[pname] = pdata.defaults;
			$.each(pdata._fn, function (i, val) {
				val.plugin		= pname;
				val.old			= $.jstree._fn[i];
				$.jstree._fn[i] = function () {
					var rslt,
						func = val,
						args = Array.prototype.slice.call(arguments),
						evnt = new $.Event("before.jstree"),
						rlbk = false;

					if(this.data.core.locked === true && i !== "unlock" && i !== "is_locked") { return; }

					// Check if function belongs to the included plugins of this instance
					do {
						if(func && func.plugin && $.inArray(func.plugin, this._get_settings().plugins) !== -1) { break; }
						func = func.old;
					} while(func);
					if(!func) { return; }

					// context and function to trigger events, then finally call the function
					if(i.indexOf("_") === 0) {
						rslt = func.apply(this, args);
					}
					else {
						rslt = this.get_container().triggerHandler(evnt, { "func" : i, "inst" : this, "args" : args, "plugin" : func.plugin });
						if(rslt === false) { return; }
						if(typeof rslt !== "undefined") { args = rslt; }

						rslt = func.apply(
							$.extend({}, this, { 
								__callback : function (data) { 
									this.get_container().triggerHandler( i + '.jstree', { "inst" : this, "args" : args, "rslt" : data, "rlbk" : rlbk });
								},
								__rollback : function () { 
									rlbk = this.get_rollback();
									return rlbk;
								},
								__call_old : function (replace_arguments) {
									return func.old.apply(this, (replace_arguments ? Array.prototype.slice.call(arguments, 1) : args ) );
								}
							}), args);
					}

					// return the result
					return rslt;
				};
				$.jstree._fn[i].old = val.old;
				$.jstree._fn[i].plugin = pname;
			});
		},
		rollback : function (rb) {
			if(rb) {
				if(!$.isArray(rb)) { rb = [ rb ]; }
				$.each(rb, function (i, val) {
					instances[val.i].set_rollback(val.h, val.d);
				});
			}
		}
	};
	// set the prototype for all instances
	$.jstree._fn = $.jstree._instance.prototype = {};

	// load the css when DOM is ready
	$(function() {
		// code is copied from jQuery ($.browser is deprecated + there is a bug in IE)
		var u = navigator.userAgent.toLowerCase(),
			v = (u.match( /.+?(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
			css_string = '' + 
				'.jstree ul, .jstree li { display:block; margin:0 0 0 0; padding:0 0 0 0; list-style-type:none; } ' + 
				'.jstree li { display:block; min-height:18px; line-height:18px; white-space:nowrap; margin-left:18px; min-width:18px; } ' + 
				'.jstree-rtl li { margin-left:0; margin-right:18px; } ' + 
				'.jstree > ul > li { margin-left:0px; } ' + 
				'.jstree-rtl > ul > li { margin-right:0px; } ' + 
				'.jstree ins { display:inline-block; text-decoration:none; width:18px; height:18px; margin:0 0 0 0; padding:0; } ' + 
				'.jstree a { display:inline-block; line-height:16px; height:16px; color:black; white-space:nowrap; text-decoration:none; padding:1px 2px; margin:0; } ' + 
				'.jstree a:focus { outline: none; } ' + 
				'.jstree a > ins { height:16px; width:16px; } ' + 
				'.jstree a > .jstree-icon { margin-right:3px; } ' + 
				'.jstree-rtl a > .jstree-icon { margin-left:3px; margin-right:0; } ' + 
				'li.jstree-open > ul { display:block; } ' + 
				'li.jstree-closed > ul { display:none; } ';
		// Correct IE 6 (does not support the > CSS selector)
		if(/msie/.test(u) && parseInt(v, 10) == 6) { 
			is_ie6 = true;

			// fix image flicker and lack of caching
			try {
				document.execCommand("BackgroundImageCache", false, true);
			} catch (err) { }

			css_string += '' + 
				'.jstree li { height:18px; margin-left:0; margin-right:0; } ' + 
				'.jstree li li { margin-left:18px; } ' + 
				'.jstree-rtl li li { margin-left:0px; margin-right:18px; } ' + 
				'li.jstree-open ul { display:block; } ' + 
				'li.jstree-closed ul { display:none !important; } ' + 
				'.jstree li a { display:inline; border-width:0 !important; padding:0px 2px !important; } ' + 
				'.jstree li a ins { height:16px; width:16px; margin-right:3px; } ' + 
				'.jstree-rtl li a ins { margin-right:0px; margin-left:3px; } ';
		}
		// Correct IE 7 (shifts anchor nodes onhover)
		if(/msie/.test(u) && parseInt(v, 10) == 7) { 
			is_ie7 = true;
			css_string += '.jstree li a { border-width:0 !important; padding:0px 2px !important; } ';
		}
		// correct ff2 lack of display:inline-block
		if(!/compatible/.test(u) && /mozilla/.test(u) && parseFloat(v, 10) < 1.9) {
			is_ff2 = true;
			css_string += '' + 
				'.jstree ins { display:-moz-inline-box; } ' + 
				'.jstree li { line-height:12px; } ' + // WHY??
				'.jstree a { display:-moz-inline-box; } ' + 
				'.jstree .jstree-no-icons .jstree-checkbox { display:-moz-inline-stack !important; } ';
				/* this shouldn't be here as it is theme specific */
		}
		// the default stylesheet
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});

	// core functions (open, close, create, update, delete)
	$.jstree.plugin("core", {
		__init : function () {
			this.data.core.locked = false;
			this.data.core.to_open = this.get_settings().core.initially_open;
			this.data.core.to_load = this.get_settings().core.initially_load;
		},
		defaults : { 
			html_titles	: false,
			animation	: 500,
			initially_open : [],
			initially_load : [],
			open_parents : true,
			notify_plugins : true,
			rtl			: false,
			load_open	: false,
			strings		: {
				loading		: "Loading ...",
				new_node	: "New node",
				multiple_selection : "Multiple selection"
			}
		},
		_fn : { 
			init	: function () { 
				this.set_focus(); 
				if(this._get_settings().core.rtl) {
					this.get_container().addClass("jstree-rtl").css("direction", "rtl");
				}
				this.get_container().html("<ul><li class='jstree-last jstree-leaf'><ins>&#160;</ins><a class='jstree-loading' href='#'><ins class='jstree-icon'>&#160;</ins>" + this._get_string("loading") + "</a></li></ul>");
				this.data.core.li_height = this.get_container_ul().find("li.jstree-closed, li.jstree-leaf").eq(0).height() || 18;

				this.get_container()
					.delegate("li > ins", "click.jstree", $.proxy(function (event) {
							var trgt = $(event.target);
							// if(trgt.is("ins") && event.pageY - trgt.offset().top < this.data.core.li_height) { this.toggle_node(trgt); }
							this.toggle_node(trgt);
						}, this))
					.bind("mousedown.jstree", $.proxy(function () { 
							this.set_focus(); // This used to be setTimeout(set_focus,0) - why?
						}, this))
					.bind("dblclick.jstree", function (event) { 
						var sel;
						if(document.selection && document.selection.empty) { document.selection.empty(); }
						else {
							if(window.getSelection) {
								sel = window.getSelection();
								try { 
									sel.removeAllRanges();
									sel.collapse();
								} catch (err) { }
							}
						}
					});
				if(this._get_settings().core.notify_plugins) {
					this.get_container()
						.bind("load_node.jstree", $.proxy(function (e, data) { 
								var o = this._get_node(data.rslt.obj),
									t = this;
								if(o === -1) { o = this.get_container_ul(); }
								if(!o.length) { return; }
								o.find("li").each(function () {
									var th = $(this);
									if(th.data("jstree")) {
										$.each(th.data("jstree"), function (plugin, values) {
											if(t.data[plugin] && $.isFunction(t["_" + plugin + "_notify"])) {
												t["_" + plugin + "_notify"].call(t, th, values);
											}
										});
									}
								});
							}, this));
				}
				if(this._get_settings().core.load_open) {
					this.get_container()
						.bind("load_node.jstree", $.proxy(function (e, data) { 
								var o = this._get_node(data.rslt.obj),
									t = this;
								if(o === -1) { o = this.get_container_ul(); }
								if(!o.length) { return; }
								o.find("li.jstree-open:not(:has(ul))").each(function () {
									t.load_node(this, $.noop, $.noop);
								});
							}, this));
				}
				this.__callback();
				this.load_node(-1, function () { this.loaded(); this.reload_nodes(); });
			},
			destroy	: function () { 
				var i,
					n = this.get_index(),
					s = this._get_settings(),
					_this = this;

				$.each(s.plugins, function (i, val) {
					try { plugins[val].__destroy.apply(_this); } catch(err) { }
				});
				this.__callback();
				// set focus to another instance if this one is focused
				if(this.is_focused()) { 
					for(i in instances) { 
						if(instances.hasOwnProperty(i) && i != n) { 
							instances[i].set_focus(); 
							break; 
						} 
					}
				}
				// if no other instance found
				if(n === focused_instance) { focused_instance = -1; }
				// remove all traces of jstree in the DOM (only the ones set using jstree*) and cleans all events
				this.get_container()
					.unbind(".jstree")
					.undelegate(".jstree")
					.removeData("jstree_instance_id")
					.find("[class^='jstree']")
						.andSelf()
						.attr("class", function () { return this.className.replace(/jstree[^ ]*|$/ig,''); });
				$(document)
					.unbind(".jstree-" + n)
					.undelegate(".jstree-" + n);
				// remove the actual data
				instances[n] = null;
				delete instances[n];
			},

			_core_notify : function (n, data) {
				if(data.opened) {
					this.open_node(n, false, true);
				}
			},

			lock : function () {
				this.data.core.locked = true;
				this.get_container().children("ul").addClass("jstree-locked").css("opacity","0.7");
				this.__callback({});
			},
			unlock : function () {
				this.data.core.locked = false;
				this.get_container().children("ul").removeClass("jstree-locked").css("opacity","1");
				this.__callback({});
			},
			is_locked : function () { return this.data.core.locked; },
			save_opened : function () {
				var _this = this;
				this.data.core.to_open = [];
				this.get_container_ul().find("li.jstree-open").each(function () { 
					if(this.id) { _this.data.core.to_open.push("#" + this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")); }
				});
				this.__callback(_this.data.core.to_open);
			},
			save_loaded : function () { },
			reload_nodes : function (is_callback) {
				var _this = this,
					done = true,
					current = [],
					remaining = [];
				if(!is_callback) { 
					this.data.core.reopen = false; 
					this.data.core.refreshing = true; 
					this.data.core.to_open = $.map($.makeArray(this.data.core.to_open), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					this.data.core.to_load = $.map($.makeArray(this.data.core.to_load), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					if(this.data.core.to_open.length) {
						this.data.core.to_load = this.data.core.to_load.concat(this.data.core.to_open);
					}
				}
				if(this.data.core.to_load.length) {
					$.each(this.data.core.to_load, function (i, val) {
						if(val == "#") { return true; }
						if($(val).length) { current.push(val); }
						else { remaining.push(val); }
					});
					if(current.length) {
						this.data.core.to_load = remaining;
						$.each(current, function (i, val) { 
							if(!_this._is_loaded(val)) {
								_this.load_node(val, function () { _this.reload_nodes(true); }, function () { _this.reload_nodes(true); });
								done = false;
							}
						});
					}
				}
				if(this.data.core.to_open.length) {
					$.each(this.data.core.to_open, function (i, val) {
						_this.open_node(val, false, true); 
					});
				}
				if(done) { 
					// TODO: find a more elegant approach to syncronizing returning requests
					if(this.data.core.reopen) { clearTimeout(this.data.core.reopen); }
					this.data.core.reopen = setTimeout(function () { _this.__callback({}, _this); }, 50);
					this.data.core.refreshing = false;
					this.reopen();
				}
			},
			reopen : function () {
				var _this = this;
				if(this.data.core.to_open.length) {
					$.each(this.data.core.to_open, function (i, val) {
						_this.open_node(val, false, true); 
					});
				}
				this.__callback({});
			},
			refresh : function (obj) {
				var _this = this;
				this.save_opened();
				if(!obj) { obj = -1; }
				obj = this._get_node(obj);
				if(!obj) { obj = -1; }
				if(obj !== -1) { obj.children("UL").remove(); }
				else { this.get_container_ul().empty(); }
				this.load_node(obj, function () { _this.__callback({ "obj" : obj}); _this.reload_nodes(); });
			},
			// Dummy function to fire after the first load (so that there is a jstree.loaded event)
			loaded	: function () { 
				this.__callback(); 
			},
			// deal with focus
			set_focus	: function () { 
				if(this.is_focused()) { return; }
				var f = $.jstree._focused();
				if(f) { f.unset_focus(); }

				this.get_container().addClass("jstree-focused"); 
				focused_instance = this.get_index(); 
				this.__callback();
			},
			is_focused	: function () { 
				return focused_instance == this.get_index(); 
			},
			unset_focus	: function () {
				if(this.is_focused()) {
					this.get_container().removeClass("jstree-focused"); 
					focused_instance = -1; 
				}
				this.__callback();
			},

			// traverse
			_get_node		: function (obj) { 
				var $obj = $(obj, this.get_container()); 
				if(obj==-1 || $obj.is(".jstree")) { return -1; } 
				$obj = $obj.closest("li", this.get_container()); 
				return $obj.length ? $obj : false; 
			},
			_get_next		: function (obj, strict) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().find("> ul > li:first-child"); }
				if(!obj.length) { return false; }
				if(strict) { return (obj.nextAll("li").size() > 0) ? obj.nextAll("li:eq(0)") : false; }

				if(obj.hasClass("jstree-open")) { return obj.find("li:eq(0)"); }
				else if(obj.nextAll("li").size() > 0) { return obj.nextAll("li:eq(0)"); }
				else { return obj.parentsUntil(".jstree","li").next("li").eq(0); }
			},
			_get_prev		: function (obj, strict) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().find("> ul > li:last-child"); }
				if(!obj.length) { return false; }
				if(strict) { return (obj.prevAll("li").length > 0) ? obj.prevAll("li:eq(0)") : false; }

				if(obj.prev("li").length) {
					obj = obj.prev("li").eq(0);
					while(obj.hasClass("jstree-open")) { obj = obj.children("ul:eq(0)").children("li:last"); }
					return obj;
				}
				else { var o = obj.parentsUntil(".jstree","li:eq(0)"); return o.length ? o : false; }
			},
			_get_parent		: function (obj) {
				obj = this._get_node(obj);
				if(obj == -1 || !obj.length) { return false; }
				var o = obj.parentsUntil(".jstree", "li:eq(0)");
				return o.length ? o : -1;
			},
			_get_children	: function (obj) {
				obj = this._get_node(obj);
				if(obj === -1) { return this.get_container().children("ul:eq(0)").children("li"); }
				if(!obj.length) { return false; }
				return obj.children("ul:eq(0)").children("li");
			},
			get_path		: function (obj, id_mode) {
				var p = [],
					_this = this;
				obj = this._get_node(obj);
				if(obj === -1 || !obj || !obj.length) { return false; }
				obj.parentsUntil(".jstree", "li").each(function () {
					p.push( id_mode ? this.id : _this.get_text(this) );
				});
				p.reverse();
				p.push( id_mode ? obj.attr("id") : this.get_text(obj) );
				return p;
			},

			// string functions
			_get_string : function (key) {
				return this._get_settings().core.strings[key] || key;
			},

			is_open		: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-open"); },
			is_closed	: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-closed"); },
			is_leaf		: function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-leaf"); },
			correct_state	: function (obj) {
				obj = this._get_node(obj);
				if(!obj || obj === -1) { return false; }
				obj.removeClass("jstree-closed jstree-open").addClass("jstree-leaf").children("ul").remove();
				this.__callback({ "obj" : obj });
			},
			// open/close
			open_node	: function (obj, callback, skip_animation) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(!obj.hasClass("jstree-closed")) { if(callback) { callback.call(); } return false; }
				var s = skip_animation || is_ie6 ? 0 : this._get_settings().core.animation,
					t = this;
				if(!this._is_loaded(obj)) {
					obj.children("a").addClass("jstree-loading");
					this.load_node(obj, function () { t.open_node(obj, callback, skip_animation); }, callback);
				}
				else {
					if(this._get_settings().core.open_parents) {
						obj.parentsUntil(".jstree",".jstree-closed").each(function () {
							t.open_node(this, false, true);
						});
					}
					if(s) { obj.children("ul").css("display","none"); }
					obj.removeClass("jstree-closed").addClass("jstree-open").children("a").removeClass("jstree-loading");
					if(s) { obj.children("ul").stop(true, true).slideDown(s, function () { this.style.display = ""; t.after_open(obj); }); }
					else { t.after_open(obj); }
					this.__callback({ "obj" : obj });
					if(callback) { callback.call(); }
				}
			},
			after_open	: function (obj) { this.__callback({ "obj" : obj }); },
			close_node	: function (obj, skip_animation) {
				obj = this._get_node(obj);
				var s = skip_animation || is_ie6 ? 0 : this._get_settings().core.animation,
					t = this;
				if(!obj.length || !obj.hasClass("jstree-open")) { return false; }
				if(s) { obj.children("ul").attr("style","display:block !important"); }
				obj.removeClass("jstree-open").addClass("jstree-closed");
				if(s) { obj.children("ul").stop(true, true).slideUp(s, function () { this.style.display = ""; t.after_close(obj); }); }
				else { t.after_close(obj); }
				this.__callback({ "obj" : obj });
			},
			after_close	: function (obj) { this.__callback({ "obj" : obj }); },
			toggle_node	: function (obj) {
				obj = this._get_node(obj);
				if(obj.hasClass("jstree-closed")) { return this.open_node(obj); }
				if(obj.hasClass("jstree-open")) { return this.close_node(obj); }
			},
			open_all	: function (obj, do_animation, original_obj) {
				obj = obj ? this._get_node(obj) : -1;
				if(!obj || obj === -1) { obj = this.get_container_ul(); }
				if(original_obj) { 
					obj = obj.find("li.jstree-closed");
				}
				else {
					original_obj = obj;
					if(obj.is(".jstree-closed")) { obj = obj.find("li.jstree-closed").andSelf(); }
					else { obj = obj.find("li.jstree-closed"); }
				}
				var _this = this;
				obj.each(function () { 
					var __this = this; 
					if(!_this._is_loaded(this)) { _this.open_node(this, function() { _this.open_all(__this, do_animation, original_obj); }, !do_animation); }
					else { _this.open_node(this, false, !do_animation); }
				});
				// so that callback is fired AFTER all nodes are open
				if(original_obj.find('li.jstree-closed').length === 0) { this.__callback({ "obj" : original_obj }); }
			},
			close_all	: function (obj, do_animation) {
				var _this = this;
				obj = obj ? this._get_node(obj) : this.get_container();
				if(!obj || obj === -1) { obj = this.get_container_ul(); }
				obj.find("li.jstree-open").andSelf().each(function () { _this.close_node(this, !do_animation); });
				this.__callback({ "obj" : obj });
			},
			clean_node	: function (obj) {
				obj = obj && obj != -1 ? $(obj) : this.get_container_ul();
				obj = obj.is("li") ? obj.find("li").andSelf() : obj.find("li");
				obj.removeClass("jstree-last")
					.filter("li:last-child").addClass("jstree-last").end()
					.filter(":has(li)")
						.not(".jstree-open").removeClass("jstree-leaf").addClass("jstree-closed");
				obj.not(".jstree-open, .jstree-closed").addClass("jstree-leaf").children("ul").remove();
				this.__callback({ "obj" : obj });
			},
			// rollback
			get_rollback : function () { 
				this.__callback();
				return { i : this.get_index(), h : this.get_container().children("ul").clone(true), d : this.data }; 
			},
			set_rollback : function (html, data) {
				this.get_container().empty().append(html);
				this.data = data;
				this.__callback();
			},
			// Dummy functions to be overwritten by any datastore plugin included
			load_node	: function (obj, s_call, e_call) { this.__callback({ "obj" : obj }); },
			_is_loaded	: function (obj) { return true; },

			// Basic operations: create
			create_node	: function (obj, position, js, callback, is_loaded) {
				obj = this._get_node(obj);
				position = typeof position === "undefined" ? "last" : position;
				var d = $("<li />"),
					s = this._get_settings().core,
					tmp;

				if(obj !== -1 && !obj.length) { return false; }
				if(!is_loaded && !this._is_loaded(obj)) { this.load_node(obj, function () { this.create_node(obj, position, js, callback, true); }); return false; }

				this.__rollback();

				if(typeof js === "string") { js = { "data" : js }; }
				if(!js) { js = {}; }
				if(js.attr) { d.attr(js.attr); }
				if(js.metadata) { d.data(js.metadata); }
				if(js.state) { d.addClass("jstree-" + js.state); }
				if(!js.data) { js.data = this._get_string("new_node"); }
				if(!$.isArray(js.data)) { tmp = js.data; js.data = []; js.data.push(tmp); }
				$.each(js.data, function (i, m) {
					tmp = $("<a />");
					if($.isFunction(m)) { m = m.call(this, js); }
					if(typeof m == "string") { tmp.attr('href','#')[ s.html_titles ? "html" : "text" ](m); }
					else {
						if(!m.attr) { m.attr = {}; }
						if(!m.attr.href) { m.attr.href = '#'; }
						tmp.attr(m.attr)[ s.html_titles ? "html" : "text" ](m.title);
						if(m.language) { tmp.addClass(m.language); }
					}
					tmp.prepend("<ins class='jstree-icon'>&#160;</ins>");
					if(!m.icon && js.icon) { m.icon = js.icon; }
					if(m.icon) { 
						if(m.icon.indexOf("/") === -1) { tmp.children("ins").addClass(m.icon); }
						else { tmp.children("ins").css("background","url('" + m.icon + "') center center no-repeat"); }
					}
					d.append(tmp);
				});
				d.prepend("<ins class='jstree-icon'>&#160;</ins>");
				if(obj === -1) {
					obj = this.get_container();
					if(position === "before") { position = "first"; }
					if(position === "after") { position = "last"; }
				}
				switch(position) {
					case "before": obj.before(d); tmp = this._get_parent(obj); break;
					case "after" : obj.after(d);  tmp = this._get_parent(obj); break;
					case "inside":
					case "first" :
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						obj.children("ul").prepend(d);
						tmp = obj;
						break;
					case "last":
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						obj.children("ul").append(d);
						tmp = obj;
						break;
					default:
						if(!obj.children("ul").length) { obj.append("<ul />"); }
						if(!position) { position = 0; }
						tmp = obj.children("ul").children("li").eq(position);
						if(tmp.length) { tmp.before(d); }
						else { obj.children("ul").append(d); }
						tmp = obj;
						break;
				}
				if(tmp === -1 || tmp.get(0) === this.get_container().get(0)) { tmp = -1; }
				this.clean_node(tmp);
				this.__callback({ "obj" : d, "parent" : tmp });
				if(callback) { callback.call(this, d); }
				return d;
			},
			// Basic operations: rename (deal with text)
			get_text	: function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				var s = this._get_settings().core.html_titles;
				obj = obj.children("a:eq(0)");
				if(s) {
					obj = obj.clone();
					obj.children("INS").remove();
					return obj.html();
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					return obj.nodeValue;
				}
			},
			set_text	: function (obj, val) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				obj = obj.children("a:eq(0)");
				if(this._get_settings().core.html_titles) {
					var tmp = obj.children("INS").clone();
					obj.html(val).prepend(tmp);
					this.__callback({ "obj" : obj, "name" : val });
					return true;
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					this.__callback({ "obj" : obj, "name" : val });
					return (obj.nodeValue = val);
				}
			},
			rename_node : function (obj, val) {
				obj = this._get_node(obj);
				this.__rollback();
				if(obj && obj.length && this.set_text.apply(this, Array.prototype.slice.call(arguments))) { this.__callback({ "obj" : obj, "name" : val }); }
			},
			// Basic operations: deleting nodes
			delete_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				this.__rollback();
				var p = this._get_parent(obj), prev = $([]), t = this;
				obj.each(function () {
					prev = prev.add(t._get_prev(this));
				});
				obj = obj.detach();
				if(p !== -1 && p.find("> ul > li").length === 0) {
					p.removeClass("jstree-open jstree-closed").addClass("jstree-leaf");
				}
				this.clean_node(p);
				this.__callback({ "obj" : obj, "prev" : prev, "parent" : p });
				return obj;
			},
			prepare_move : function (o, r, pos, cb, is_cb) {
				var p = {};

				p.ot = $.jstree._reference(o) || this;
				p.o = p.ot._get_node(o);
				p.r = r === - 1 ? -1 : this._get_node(r);
				p.p = (typeof pos === "undefined" || pos === false) ? "last" : pos; // TODO: move to a setting
				if(!is_cb && prepared_move.o && prepared_move.o[0] === p.o[0] && prepared_move.r[0] === p.r[0] && prepared_move.p === p.p) {
					this.__callback(prepared_move);
					if(cb) { cb.call(this, prepared_move); }
					return;
				}
				p.ot = $.jstree._reference(p.o) || this;
				p.rt = $.jstree._reference(p.r) || this; // r === -1 ? p.ot : $.jstree._reference(p.r) || this
				if(p.r === -1 || !p.r) {
					p.cr = -1;
					switch(p.p) {
						case "first":
						case "before":
						case "inside":
							p.cp = 0; 
							break;
						case "after":
						case "last":
							p.cp = p.rt.get_container().find(" > ul > li").length; 
							break;
						default:
							p.cp = p.p;
							break;
					}
				}
				else {
					if(!/^(before|after)$/.test(p.p) && !this._is_loaded(p.r)) {
						return this.load_node(p.r, function () { this.prepare_move(o, r, pos, cb, true); });
					}
					switch(p.p) {
						case "before":
							p.cp = p.r.index();
							p.cr = p.rt._get_parent(p.r);
							break;
						case "after":
							p.cp = p.r.index() + 1;
							p.cr = p.rt._get_parent(p.r);
							break;
						case "inside":
						case "first":
							p.cp = 0;
							p.cr = p.r;
							break;
						case "last":
							p.cp = p.r.find(" > ul > li").length; 
							p.cr = p.r;
							break;
						default: 
							p.cp = p.p;
							p.cr = p.r;
							break;
					}
				}
				p.np = p.cr == -1 ? p.rt.get_container() : p.cr;
				p.op = p.ot._get_parent(p.o);
				p.cop = p.o.index();
				if(p.op === -1) { p.op = p.ot ? p.ot.get_container() : this.get_container(); }
				if(!/^(before|after)$/.test(p.p) && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp++; }
				//if(p.p === "before" && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp--; }
				p.or = p.np.find(" > ul > li:nth-child(" + (p.cp + 1) + ")");
				prepared_move = p;
				this.__callback(prepared_move);
				if(cb) { cb.call(this, prepared_move); }
			},
			check_move : function () {
				var obj = prepared_move, ret = true, r = obj.r === -1 ? this.get_container() : obj.r;
				if(!obj || !obj.o || obj.or[0] === obj.o[0]) { return false; }
				if(obj.op && obj.np && obj.op[0] === obj.np[0] && obj.cp - 1 === obj.o.index()) { return false; }
				obj.o.each(function () { 
					if(r.parentsUntil(".jstree", "li").andSelf().index(this) !== -1) { ret = false; return false; }
				});
				return ret;
			},
			move_node : function (obj, ref, position, is_copy, is_prepared, skip_check) {
				if(!is_prepared) { 
					return this.prepare_move(obj, ref, position, function (p) {
						this.move_node(p, false, false, is_copy, true, skip_check);
					});
				}
				if(is_copy) { 
					prepared_move.cy = true;
				}
				if(!skip_check && !this.check_move()) { return false; }

				this.__rollback();
				var o = false;
				if(is_copy) {
					o = obj.o.clone(true);
					o.find("*[id]").andSelf().each(function () {
						if(this.id) { this.id = "copy_" + this.id; }
					});
				}
				else { o = obj.o; }

				if(obj.or.length) { obj.or.before(o); }
				else { 
					if(!obj.np.children("ul").length) { $("<ul />").appendTo(obj.np); }
					obj.np.children("ul:eq(0)").append(o); 
				}

				try { 
					obj.ot.clean_node(obj.op);
					obj.rt.clean_node(obj.np);
					if(!obj.op.find("> ul > li").length) {
						obj.op.removeClass("jstree-open jstree-closed").addClass("jstree-leaf").children("ul").remove();
					}
				} catch (e) { }

				if(is_copy) { 
					prepared_move.cy = true;
					prepared_move.oc = o; 
				}
				this.__callback(prepared_move);
				return prepared_move;
			},
			_get_move : function () { return prepared_move; }
		}
	});
})(jQuery);
//*/

/* 
 * jsTree ui plugin
 * This plugins handles selecting/deselecting/hovering/dehovering nodes
 */
(function ($) {
	var scrollbar_width, e1, e2;
	$(function() {
		if (/msie/.test(navigator.userAgent.toLowerCase())) {
			e1 = $('<textarea cols="10" rows="2"></textarea>').css({ position: 'absolute', top: -1000, left: 0 }).appendTo('body');
			e2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>').css({ position: 'absolute', top: -1000, left: 0 }).appendTo('body');
			scrollbar_width = e1.width() - e2.width();
			e1.add(e2).remove();
		} 
		else {
			e1 = $('<div />').css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: 0 })
					.prependTo('body').append('<div />').find('div').css({ width: '100%', height: 200 });
			scrollbar_width = 100 - e1.width();
			e1.parent().remove();
		}
	});
	$.jstree.plugin("ui", {
		__init : function () { 
			this.data.ui.selected = $(); 
			this.data.ui.last_selected = false; 
			this.data.ui.hovered = null;
			this.data.ui.to_select = this.get_settings().ui.initially_select;

			this.get_container()
				.delegate("a", "click.jstree", $.proxy(function (event) {
						event.preventDefault();
						event.currentTarget.blur();
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.select_node(event.currentTarget, true, event);
						}
					}, this))
				.delegate("a", "mouseenter.jstree", $.proxy(function (event) {
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.hover_node(event.target);
						}
					}, this))
				.delegate("a", "mouseleave.jstree", $.proxy(function (event) {
						if(!$(event.currentTarget).hasClass("jstree-loading")) {
							this.dehover_node(event.target);
						}
					}, this))
				.bind("reopen.jstree", $.proxy(function () { 
						this.reselect();
					}, this))
				.bind("get_rollback.jstree", $.proxy(function () { 
						this.dehover_node();
						this.save_selected();
					}, this))
				.bind("set_rollback.jstree", $.proxy(function () { 
						this.reselect();
					}, this))
				.bind("close_node.jstree", $.proxy(function (event, data) { 
						var s = this._get_settings().ui,
							obj = this._get_node(data.rslt.obj),
							clk = (obj && obj.length) ? obj.children("ul").find("a.jstree-clicked") : $(),
							_this = this;
						if(s.selected_parent_close === false || !clk.length) { return; }
						clk.each(function () { 
							_this.deselect_node(this);
							if(s.selected_parent_close === "select_parent") { _this.select_node(obj); }
						});
					}, this))
				.bind("delete_node.jstree", $.proxy(function (event, data) { 
						var s = this._get_settings().ui.select_prev_on_delete,
							obj = this._get_node(data.rslt.obj),
							clk = (obj && obj.length) ? obj.find("a.jstree-clicked") : [],
							_this = this;
						clk.each(function () { _this.deselect_node(this); });
						if(s && clk.length) { 
							data.rslt.prev.each(function () { 
								if(this.parentNode) { _this.select_node(this); return false; /* if return false is removed all prev nodes will be selected */}
							});
						}
					}, this))
				.bind("move_node.jstree", $.proxy(function (event, data) { 
						if(data.rslt.cy) { 
							data.rslt.oc.find("a.jstree-clicked").removeClass("jstree-clicked");
						}
					}, this));
		},
		defaults : {
			select_limit : -1, // 0, 1, 2 ... or -1 for unlimited
			select_multiple_modifier : "ctrl", // on, or ctrl, shift, alt
			select_range_modifier : "shift",
			selected_parent_close : "select_parent", // false, "deselect", "select_parent"
			selected_parent_open : true,
			select_prev_on_delete : true,
			disable_selecting_children : false,
			initially_select : []
		},
		_fn : { 
			_get_node : function (obj, allow_multiple) {
				if(typeof obj === "undefined" || obj === null) { return allow_multiple ? this.data.ui.selected : this.data.ui.last_selected; }
				var $obj = $(obj, this.get_container()); 
				if(obj==-1 || $obj.is(".jstree")) { return -1; } 
				$obj = $obj.closest("li", this.get_container()); 
				return $obj.length ? $obj : false; 
			},
			_ui_notify : function (n, data) {
				if(data.selected) {
					this.select_node(n, false);
				}
			},
			save_selected : function () {
				var _this = this;
				this.data.ui.to_select = [];
				this.data.ui.selected.each(function () { if(this.id) { _this.data.ui.to_select.push("#" + this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")); } });
				this.__callback(this.data.ui.to_select);
			},
			reselect : function () {
				var _this = this,
					s = this.data.ui.to_select;
				s = $.map($.makeArray(s), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
				// this.deselect_all(); WHY deselect, breaks plugin state notifier?
				$.each(s, function (i, val) { if(val && val !== "#") { _this.select_node(val); } });
				this.data.ui.selected = this.data.ui.selected.filter(function () { return this.parentNode; });
				this.__callback();
			},
			refresh : function (obj) {
				this.save_selected();
				return this.__call_old();
			},
			hover_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				//if(this.data.ui.hovered && obj.get(0) === this.data.ui.hovered.get(0)) { return; }
				if(!obj.hasClass("jstree-hovered")) { this.dehover_node(); }
				this.data.ui.hovered = obj.children("a").addClass("jstree-hovered").parent();
				this._fix_scroll(obj);
				this.__callback({ "obj" : obj });
			},
			dehover_node : function () {
				var obj = this.data.ui.hovered, p;
				if(!obj || !obj.length) { return false; }
				p = obj.children("a").removeClass("jstree-hovered").parent();
				if(this.data.ui.hovered[0] === p[0]) { this.data.ui.hovered = null; }
				this.__callback({ "obj" : obj });
			},
			select_node : function (obj, check, e) {
				obj = this._get_node(obj);
				if(obj == -1 || !obj || !obj.length) { return false; }
				var s = this._get_settings().ui,
					is_multiple = (s.select_multiple_modifier == "on" || (s.select_multiple_modifier !== false && e && e[s.select_multiple_modifier + "Key"])),
					is_range = (s.select_range_modifier !== false && e && e[s.select_range_modifier + "Key"] && this.data.ui.last_selected && this.data.ui.last_selected[0] !== obj[0] && this.data.ui.last_selected.parent()[0] === obj.parent()[0]),
					is_selected = this.is_selected(obj),
					proceed = true,
					t = this;
				if(check) {
					if(s.disable_selecting_children && is_multiple && 
						(
							(obj.parentsUntil(".jstree","li").children("a.jstree-clicked").length) ||
							(obj.children("ul").find("a.jstree-clicked:eq(0)").length)
						)
					) {
						return false;
					}
					proceed = false;
					switch(!0) {
						case (is_range):
							this.data.ui.last_selected.addClass("jstree-last-selected");
							obj = obj[ obj.index() < this.data.ui.last_selected.index() ? "nextUntil" : "prevUntil" ](".jstree-last-selected").andSelf();
							if(s.select_limit == -1 || obj.length < s.select_limit) {
								this.data.ui.last_selected.removeClass("jstree-last-selected");
								this.data.ui.selected.each(function () {
									if(this !== t.data.ui.last_selected[0]) { t.deselect_node(this); }
								});
								is_selected = false;
								proceed = true;
							}
							else {
								proceed = false;
							}
							break;
						case (is_selected && !is_multiple): 
							this.deselect_all();
							is_selected = false;
							proceed = true;
							break;
						case (!is_selected && !is_multiple): 
							if(s.select_limit == -1 || s.select_limit > 0) {
								this.deselect_all();
								proceed = true;
							}
							break;
						case (is_selected && is_multiple): 
							this.deselect_node(obj);
							break;
						case (!is_selected && is_multiple): 
							if(s.select_limit == -1 || this.data.ui.selected.length + 1 <= s.select_limit) { 
								proceed = true;
							}
							break;
					}
				}
				if(proceed && !is_selected) {
					if(!is_range) { this.data.ui.last_selected = obj; }
					obj.children("a").addClass("jstree-clicked");
					if(s.selected_parent_open) {
						obj.parents(".jstree-closed").each(function () { t.open_node(this, false, true); });
					}
					this.data.ui.selected = this.data.ui.selected.add(obj);
					this._fix_scroll(obj.eq(0));
					this.__callback({ "obj" : obj, "e" : e });
				}
			},
			_fix_scroll : function (obj) {
				var c = this.get_container()[0], t;
				if(c.scrollHeight > c.offsetHeight) {
					obj = this._get_node(obj);
					if(!obj || obj === -1 || !obj.length || !obj.is(":visible")) { return; }
					t = obj.offset().top - this.get_container().offset().top;
					if(t < 0) { 
						c.scrollTop = c.scrollTop + t - 1; 
					}
					if(t + this.data.core.li_height + (c.scrollWidth > c.offsetWidth ? scrollbar_width : 0) > c.offsetHeight) { 
						c.scrollTop = c.scrollTop + (t - c.offsetHeight + this.data.core.li_height + 1 + (c.scrollWidth > c.offsetWidth ? scrollbar_width : 0)); 
					}
				}
			},
			deselect_node : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(this.is_selected(obj)) {
					obj.children("a").removeClass("jstree-clicked");
					this.data.ui.selected = this.data.ui.selected.not(obj);
					if(this.data.ui.last_selected.get(0) === obj.get(0)) { this.data.ui.last_selected = this.data.ui.selected.eq(0); }
					this.__callback({ "obj" : obj });
				}
			},
			toggle_select : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return false; }
				if(this.is_selected(obj)) { this.deselect_node(obj); }
				else { this.select_node(obj); }
			},
			is_selected : function (obj) { return this.data.ui.selected.index(this._get_node(obj)) >= 0; },
			get_selected : function (context) { 
				return context ? $(context).find("a.jstree-clicked").parent() : this.data.ui.selected; 
			},
			deselect_all : function (context) {
				var ret = context ? $(context).find("a.jstree-clicked").parent() : this.get_container().find("a.jstree-clicked").parent();
				ret.children("a.jstree-clicked").removeClass("jstree-clicked");
				this.data.ui.selected = $([]);
				this.data.ui.last_selected = false;
				this.__callback({ "obj" : ret });
			}
		}
	});
	// include the selection plugin by default
	$.jstree.defaults.plugins.push("ui");
})(jQuery);
//*/

/* 
 * jsTree CRRM plugin
 * Handles creating/renaming/removing/moving nodes by user interaction.
 */
(function ($) {
	$.jstree.plugin("crrm", { 
		__init : function () {
			this.get_container()
				.bind("move_node.jstree", $.proxy(function (e, data) {
					if(this._get_settings().crrm.move.open_onmove) {
						var t = this;
						data.rslt.np.parentsUntil(".jstree").andSelf().filter(".jstree-closed").each(function () {
							t.open_node(this, false, true);
						});
					}
				}, this));
		},
		defaults : {
			input_width_limit : 200,
			move : {
				always_copy			: false, // false, true or "multitree"
				open_onmove			: true,
				default_position	: "last",
				check_move			: function (m) { return true; }
			}
		},
		_fn : {
			_show_input : function (obj, callback) {
				obj = this._get_node(obj);
				var rtl = this._get_settings().core.rtl,
					w = this._get_settings().crrm.input_width_limit,
					w1 = obj.children("ins").width(),
					w2 = obj.find("> a:visible > ins").width() * obj.find("> a:visible > ins").length,
					t = this.get_text(obj),
					h1 = $("<div />", { css : { "position" : "absolute", "top" : "-200px", "left" : (rtl ? "0px" : "-1000px"), "visibility" : "hidden" } }).appendTo("body"),
					h2 = obj.css("position","relative").append(
					$("<input />", { 
						"value" : t,
						"class" : "jstree-rename-input",
						// "size" : t.length,
						"css" : {
							"padding" : "0",
							"border" : "1px solid silver",
							"position" : "absolute",
							"left"  : (rtl ? "auto" : (w1 + w2 + 4) + "px"),
							"right" : (rtl ? (w1 + w2 + 4) + "px" : "auto"),
							"top" : "0px",
							"height" : (this.data.core.li_height - 2) + "px",
							"lineHeight" : (this.data.core.li_height - 2) + "px",
							"width" : "150px" // will be set a bit further down
						},
						"blur" : $.proxy(function () {
							var i = obj.children(".jstree-rename-input"),
								v = i.val();
							if(v === "") { v = t; }
							h1.remove();
							i.remove(); // rollback purposes
							this.set_text(obj,t); // rollback purposes
							this.rename_node(obj, v);
							callback.call(this, obj, v, t);
							obj.css("position","");
						}, this),
						"keyup" : function (event) {
							var key = event.keyCode || event.which;
							if(key == 27) { this.value = t; this.blur(); return; }
							else if(key == 13) { this.blur(); return; }
							else {
								h2.width(Math.min(h1.text("pW" + this.value).width(),w));
							}
						},
						"keypress" : function(event) {
							var key = event.keyCode || event.which;
							if(key == 13) { return false; }
						}
					})
				).children(".jstree-rename-input"); 
				this.set_text(obj, "");
				h1.css({
						fontFamily		: h2.css('fontFamily')		|| '',
						fontSize		: h2.css('fontSize')		|| '',
						fontWeight		: h2.css('fontWeight')		|| '',
						fontStyle		: h2.css('fontStyle')		|| '',
						fontStretch		: h2.css('fontStretch')		|| '',
						fontVariant		: h2.css('fontVariant')		|| '',
						letterSpacing	: h2.css('letterSpacing')	|| '',
						wordSpacing		: h2.css('wordSpacing')		|| ''
				});
				h2.width(Math.min(h1.text("pW" + h2[0].value).width(),w))[0].select();
			},
			rename : function (obj) {
				obj = this._get_node(obj);
				this.__rollback();
				var f = this.__callback;
				this._show_input(obj, function (obj, new_name, old_name) { 
					f.call(this, { "obj" : obj, "new_name" : new_name, "old_name" : old_name });
				});
			},
			create : function (obj, position, js, callback, skip_rename) {
				var t, _this = this;
				obj = this._get_node(obj);
				if(!obj) { obj = -1; }
				this.__rollback();
				t = this.create_node(obj, position, js, function (t) {
					var p = this._get_parent(t),
						pos = $(t).index();
					if(callback) { callback.call(this, t); }
					if(p.length && p.hasClass("jstree-closed")) { this.open_node(p, false, true); }
					if(!skip_rename) { 
						this._show_input(t, function (obj, new_name, old_name) { 
							_this.__callback({ "obj" : obj, "name" : new_name, "parent" : p, "position" : pos });
						});
					}
					else { _this.__callback({ "obj" : t, "name" : this.get_text(t), "parent" : p, "position" : pos }); }
				});
				return t;
			},
			remove : function (obj) {
				obj = this._get_node(obj, true);
				var p = this._get_parent(obj), prev = this._get_prev(obj);
				this.__rollback();
				obj = this.delete_node(obj);
				if(obj !== false) { this.__callback({ "obj" : obj, "prev" : prev, "parent" : p }); }
			},
			check_move : function () {
				if(!this.__call_old()) { return false; }
				var s = this._get_settings().crrm.move;
				if(!s.check_move.call(this, this._get_move())) { return false; }
				return true;
			},
			move_node : function (obj, ref, position, is_copy, is_prepared, skip_check) {
				var s = this._get_settings().crrm.move;
				if(!is_prepared) { 
					if(typeof position === "undefined") { position = s.default_position; }
					if(position === "inside" && !s.default_position.match(/^(before|after)$/)) { position = s.default_position; }
					return this.__call_old(true, obj, ref, position, is_copy, false, skip_check);
				}
				// if the move is already prepared
				if(s.always_copy === true || (s.always_copy === "multitree" && obj.rt.get_index() !== obj.ot.get_index() )) {
					is_copy = true;
				}
				this.__call_old(true, obj, ref, position, is_copy, true, skip_check);
			},

			cut : function (obj) {
				obj = this._get_node(obj, true);
				if(!obj || !obj.length) { return false; }
				this.data.crrm.cp_nodes = false;
				this.data.crrm.ct_nodes = obj;
				this.__callback({ "obj" : obj });
			},
			copy : function (obj) {
				obj = this._get_node(obj, true);
				if(!obj || !obj.length) { return false; }
				this.data.crrm.ct_nodes = false;
				this.data.crrm.cp_nodes = obj;
				this.__callback({ "obj" : obj });
			},
			paste : function (obj) { 
				obj = this._get_node(obj);
				if(!obj || !obj.length) { return false; }
				var nodes = this.data.crrm.ct_nodes ? this.data.crrm.ct_nodes : this.data.crrm.cp_nodes;
				if(!this.data.crrm.ct_nodes && !this.data.crrm.cp_nodes) { return false; }
				if(this.data.crrm.ct_nodes) { this.move_node(this.data.crrm.ct_nodes, obj); this.data.crrm.ct_nodes = false; }
				if(this.data.crrm.cp_nodes) { this.move_node(this.data.crrm.cp_nodes, obj, false, true); }
				this.__callback({ "obj" : obj, "nodes" : nodes });
			}
		}
	});
	// include the crr plugin by default
	// $.jstree.defaults.plugins.push("crrm");
})(jQuery);
//*/

/* 
 * jsTree themes plugin
 * Handles loading and setting themes, as well as detecting path to themes, etc.
 */
(function ($) {
	var themes_loaded = [];
	// this variable stores the path to the themes folder - if left as false - it will be autodetected
	$.jstree._themes = false;
	$.jstree.plugin("themes", {
		__init : function () { 
			this.get_container()
				.bind("init.jstree", $.proxy(function () {
						var s = this._get_settings().themes;
						this.data.themes.dots = s.dots; 
						this.data.themes.icons = s.icons; 
						this.set_theme(s.theme, s.url);
					}, this))
				.bind("loaded.jstree", $.proxy(function () {
						// bound here too, as simple HTML tree's won't honor dots & icons otherwise
						if(!this.data.themes.dots) { this.hide_dots(); }
						else { this.show_dots(); }
						if(!this.data.themes.icons) { this.hide_icons(); }
						else { this.show_icons(); }
					}, this));
		},
		defaults : { 
			theme : "default", 
			url : false,
			dots : true,
			icons : true
		},
		_fn : {
			set_theme : function (theme_name, theme_url) {
				if(!theme_name) { return false; }
				if(!theme_url) { theme_url = $.jstree._themes + theme_name + '/style.css'; }
				if($.inArray(theme_url, themes_loaded) == -1) {
					$.vakata.css.add_sheet({ "url" : theme_url });
					themes_loaded.push(theme_url);
				}
				if(this.data.themes.theme != theme_name) {
					this.get_container().removeClass('jstree-' + this.data.themes.theme);
					this.data.themes.theme = theme_name;
				}
				this.get_container().addClass('jstree-' + theme_name);
				if(!this.data.themes.dots) { this.hide_dots(); }
				else { this.show_dots(); }
				if(!this.data.themes.icons) { this.hide_icons(); }
				else { this.show_icons(); }
				this.__callback();
			},
			get_theme	: function () { return this.data.themes.theme; },

			show_dots	: function () { this.data.themes.dots = true; this.get_container().children("ul").removeClass("jstree-no-dots"); },
			hide_dots	: function () { this.data.themes.dots = false; this.get_container().children("ul").addClass("jstree-no-dots"); },
			toggle_dots	: function () { if(this.data.themes.dots) { this.hide_dots(); } else { this.show_dots(); } },

			show_icons	: function () { this.data.themes.icons = true; this.get_container().children("ul").removeClass("jstree-no-icons"); },
			hide_icons	: function () { this.data.themes.icons = false; this.get_container().children("ul").addClass("jstree-no-icons"); },
			toggle_icons: function () { if(this.data.themes.icons) { this.hide_icons(); } else { this.show_icons(); } }
		}
	});
	// autodetect themes path
	$(function () {
		if($.jstree._themes === false) {
			$("script").each(function () { 
				if(this.src.toString().match(/jquery\.jstree[^\/]*?\.js(\?.*)?$/)) { 
					$.jstree._themes = this.src.toString().replace(/jquery\.jstree[^\/]*?\.js(\?.*)?$/, "") + 'themes/'; 
					return false; 
				}
			});
		}
		if($.jstree._themes === false) { $.jstree._themes = "themes/"; }
	});
	// include the themes plugin by default
	$.jstree.defaults.plugins.push("themes");
})(jQuery);
//*/

/*
 * jsTree hotkeys plugin
 * Enables keyboard navigation for all tree instances
 * Depends on the jstree ui & jquery hotkeys plugins
 */
(function ($) {
	var bound = [];
	function exec(i, event) {
		var f = $.jstree._focused(), tmp;
		if(f && f.data && f.data.hotkeys && f.data.hotkeys.enabled) { 
			tmp = f._get_settings().hotkeys[i];
			if(tmp) { return tmp.call(f, event); }
		}
	}
	$.jstree.plugin("hotkeys", {
		__init : function () {
			if(typeof $.hotkeys === "undefined") { throw "jsTree hotkeys: jQuery hotkeys plugin not included."; }
			if(!this.data.ui) { throw "jsTree hotkeys: jsTree UI plugin not included."; }
			$.each(this._get_settings().hotkeys, function (i, v) {
				if(v !== false && $.inArray(i, bound) == -1) {
					$(document).bind("keydown", i, function (event) { return exec(i, event); });
					bound.push(i);
				}
			});
			this.get_container()
				.bind("lock.jstree", $.proxy(function () {
						if(this.data.hotkeys.enabled) { this.data.hotkeys.enabled = false; this.data.hotkeys.revert = true; }
					}, this))
				.bind("unlock.jstree", $.proxy(function () {
						if(this.data.hotkeys.revert) { this.data.hotkeys.enabled = true; }
					}, this));
			this.enable_hotkeys();
		},
		defaults : {
			"up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"ctrl+up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"shift+up" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_prev(o));
				return false; 
			},
			"down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"ctrl+down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"shift+down" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
				this.hover_node(this._get_next(o));
				return false;
			},
			"left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"ctrl+left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"shift+left" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o) {
					if(o.hasClass("jstree-open")) { this.close_node(o); }
					else { this.hover_node(this._get_prev(o)); }
				}
				return false;
			},
			"right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"ctrl+right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"shift+right" : function () { 
				var o = this.data.ui.hovered || this.data.ui.last_selected;
				if(o && o.length) {
					if(o.hasClass("jstree-closed")) { this.open_node(o); }
					else { this.hover_node(this._get_next(o)); }
				}
				return false;
			},
			"space" : function () { 
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").click(); } 
				return false; 
			},
			"ctrl+space" : function (event) { 
				event.type = "click";
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").trigger(event); } 
				return false; 
			},
			"shift+space" : function (event) { 
				event.type = "click";
				if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").trigger(event); } 
				return false; 
			},
			"f2" : function () { this.rename(this.data.ui.hovered || this.data.ui.last_selected); },
			"del" : function () { this.remove(this.data.ui.hovered || this._get_node(null)); }
		},
		_fn : {
			enable_hotkeys : function () {
				this.data.hotkeys.enabled = true;
			},
			disable_hotkeys : function () {
				this.data.hotkeys.enabled = false;
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree JSON plugin
 * The JSON data store. Datastores are build by overriding the `load_node` and `_is_loaded` functions.
 */
(function ($) {
	$.jstree.plugin("json_data", {
		__init : function() {
			var s = this._get_settings().json_data;
			if(s.progressive_unload) {
				this.get_container().bind("after_close.jstree", function (e, data) {
					data.rslt.obj.children("ul").remove();
				});
			}
		},
		defaults : { 
			// `data` can be a function:
			//  * accepts two arguments - node being loaded and a callback to pass the result to
			//  * will be executed in the current tree's scope & ajax won't be supported
			data : false, 
			ajax : false,
			correct_state : true,
			progressive_render : false,
			progressive_unload : false
		},
		_fn : {
			load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_json(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
			_is_loaded : function (obj) { 
				var s = this._get_settings().json_data;
				obj = this._get_node(obj); 
				return obj == -1 || !obj || (!s.ajax && !s.progressive_render && !$.isFunction(s.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").length > 0;
			},
			refresh : function (obj) {
				obj = this._get_node(obj);
				var s = this._get_settings().json_data;
				if(obj && obj !== -1 && s.progressive_unload && ($.isFunction(s.data) || !!s.ajax)) {
					obj.removeData("jstree_children");
				}
				return this.__call_old();
			},
			load_node_json : function (obj, s_call, e_call) {
				var s = this.get_settings().json_data, d,
					error_func = function () {},
					success_func = function () {};
				obj = this._get_node(obj);

				if(obj && obj !== -1 && (s.progressive_render || s.progressive_unload) && !obj.is(".jstree-open, .jstree-leaf") && obj.children("ul").children("li").length === 0 && obj.data("jstree_children")) {
					d = this._parse_json(obj.data("jstree_children"), obj);
					if(d) {
						obj.append(d);
						if(!s.progressive_unload) { obj.removeData("jstree_children"); }
					}
					this.clean_node(obj);
					if(s_call) { s_call.call(this); }
					return;
				}

				if(obj && obj !== -1) {
					if(obj.data("jstree_is_loading")) { return; }
					else { obj.data("jstree_is_loading",true); }
				}
				switch(!0) {
					case (!s.data && !s.ajax): throw "Neither data nor ajax settings supplied.";
					// function option added here for easier model integration (also supporting async - see callback)
					case ($.isFunction(s.data)):
						s.data.call(this, obj, $.proxy(function (d) {
							d = this._parse_json(d, obj);
							if(!d) { 
								if(obj === -1 || !obj) {
									if(s.correct_state) { this.get_container().children("ul").empty(); }
								}
								else {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { this.correct_state(obj); }
								}
								if(e_call) { e_call.call(this); }
							}
							else {
								if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
								else { obj.append(d).children("a.jstree-loading").removeClass("jstree-loading"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
						}, this));
						break;
					case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
						if(!obj || obj == -1) {
							d = this._parse_json(s.data, obj);
							if(d) {
								this.get_container().children("ul").empty().append(d.children());
								this.clean_node();
							}
							else { 
								if(s.correct_state) { this.get_container().children("ul").empty(); }
							}
						}
						if(s_call) { s_call.call(this); }
						break;
					case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
						error_func = function (x, t, e) {
							var ef = this.get_settings().json_data.ajax.error; 
							if(ef) { ef.call(this, x, t, e); }
							if(obj != -1 && obj.length) {
								obj.children("a.jstree-loading").removeClass("jstree-loading");
								obj.removeData("jstree_is_loading");
								if(t === "success" && s.correct_state) { this.correct_state(obj); }
							}
							else {
								if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
							}
							if(e_call) { e_call.call(this); }
						};
						success_func = function (d, t, x) {
							var sf = this.get_settings().json_data.ajax.success; 
							if(sf) { d = sf.call(this,d,t,x) || d; }
							if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "") || (!$.isArray(d) && !$.isPlainObject(d))) {
								return error_func.call(this, x, t, "");
							}
							d = this._parse_json(d, obj);
							if(d) {
								if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
								else { obj.append(d).children("a.jstree-loading").removeClass("jstree-loading"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
							else {
								if(obj === -1 || !obj) {
									if(s.correct_state) { 
										this.get_container().children("ul").empty(); 
										if(s_call) { s_call.call(this); }
									}
								}
								else {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { 
										this.correct_state(obj);
										if(s_call) { s_call.call(this); } 
									}
								}
							}
						};
						s.ajax.context = this;
						s.ajax.error = error_func;
						s.ajax.success = success_func;
						if(!s.ajax.dataType) { s.ajax.dataType = "json"; }
						if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
						if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
						$.ajax(s.ajax);
						break;
				}
			},
			_parse_json : function (js, obj, is_callback) {
				var d = false, 
					p = this._get_settings(),
					s = p.json_data,
					t = p.core.html_titles,
					tmp, i, j, ul1, ul2;

				if(!js) { return d; }
				if(s.progressive_unload && obj && obj !== -1) { 
					obj.data("jstree_children", d);
				}
				if($.isArray(js)) {
					d = $();
					if(!js.length) { return false; }
					for(i = 0, j = js.length; i < j; i++) {
						tmp = this._parse_json(js[i], obj, true);
						if(tmp.length) { d = d.add(tmp); }
					}
				}
				else {
					if(typeof js == "string") { js = { data : js }; }
					if(!js.data && js.data !== "") { return d; }
					d = $("<li />");
					if(js.attr) { d.attr(js.attr); }
					if(js.metadata) { d.data(js.metadata); }
					if(js.state) { d.addClass("jstree-" + js.state); }
					if(!$.isArray(js.data)) { tmp = js.data; js.data = []; js.data.push(tmp); }
					$.each(js.data, function (i, m) {
						tmp = $("<a />");
						if($.isFunction(m)) { m = m.call(this, js); }
						if(typeof m == "string") { tmp.attr('href','#')[ t ? "html" : "text" ](m); }
						else {
							if(!m.attr) { m.attr = {}; }
							if(!m.attr.href) { m.attr.href = '#'; }
							tmp.attr(m.attr)[ t ? "html" : "text" ](m.title);
							if(m.language) { tmp.addClass(m.language); }
						}
						tmp.prepend("<ins class='jstree-icon'>&#160;</ins>");
						if(!m.icon && js.icon) { m.icon = js.icon; }
						if(m.icon) { 
							if(m.icon.indexOf("/") === -1) { tmp.children("ins").addClass(m.icon); }
							else { tmp.children("ins").css("background","url('" + m.icon + "') center center no-repeat"); }
						}
						d.append(tmp);
					});
					d.prepend("<ins class='jstree-icon'>&#160;</ins>");
					if(js.children) { 
						if(s.progressive_render && js.state !== "open") {
							d.addClass("jstree-closed").data("jstree_children", js.children);
						}
						else {
							if(s.progressive_unload) { d.data("jstree_children", js.children); }
							if($.isArray(js.children) && js.children.length) {
								tmp = this._parse_json(js.children, obj, true);
								if(tmp.length) {
									ul2 = $("<ul />");
									ul2.append(tmp);
									d.append(ul2);
								}
							}
						}
					}
				}
				if(!is_callback) {
					ul1 = $("<ul />");
					ul1.append(d);
					d = ul1;
				}
				return d;
			},
			get_json : function (obj, li_attr, a_attr, is_callback) {
				var result = [], 
					s = this._get_settings(), 
					_this = this,
					tmp1, tmp2, li, a, t, lang;
				obj = this._get_node(obj);
				if(!obj || obj === -1) { obj = this.get_container().find("> ul > li"); }
				li_attr = $.isArray(li_attr) ? li_attr : [ "id", "class" ];
				if(!is_callback && this.data.types) { li_attr.push(s.types.type_attr); }
				a_attr = $.isArray(a_attr) ? a_attr : [ ];

				obj.each(function () {
					li = $(this);
					tmp1 = { data : [] };
					if(li_attr.length) { tmp1.attr = { }; }
					$.each(li_attr, function (i, v) { 
						tmp2 = li.attr(v); 
						if(tmp2 && tmp2.length && tmp2.replace(/jstree[^ ]*/ig,'').length) {
							tmp1.attr[v] = (" " + tmp2).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,""); 
						}
					});
					if(li.hasClass("jstree-open")) { tmp1.state = "open"; }
					if(li.hasClass("jstree-closed")) { tmp1.state = "closed"; }
					if(li.data()) { tmp1.metadata = li.data(); }
					a = li.children("a");
					a.each(function () {
						t = $(this);
						if(
							a_attr.length || 
							$.inArray("languages", s.plugins) !== -1 || 
							t.children("ins").get(0).style.backgroundImage.length || 
							(t.children("ins").get(0).className && t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').length)
						) { 
							lang = false;
							if($.inArray("languages", s.plugins) !== -1 && $.isArray(s.languages) && s.languages.length) {
								$.each(s.languages, function (l, lv) {
									if(t.hasClass(lv)) {
										lang = lv;
										return false;
									}
								});
							}
							tmp2 = { attr : { }, title : _this.get_text(t, lang) }; 
							$.each(a_attr, function (k, z) {
								tmp2.attr[z] = (" " + (t.attr(z) || "")).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
							});
							if($.inArray("languages", s.plugins) !== -1 && $.isArray(s.languages) && s.languages.length) {
								$.each(s.languages, function (k, z) {
									if(t.hasClass(z)) { tmp2.language = z; return true; }
								});
							}
							if(t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"").length) {
								tmp2.icon = t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
							}
							if(t.children("ins").get(0).style.backgroundImage.length) {
								tmp2.icon = t.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")","");
							}
						}
						else {
							tmp2 = _this.get_text(t);
						}
						if(a.length > 1) { tmp1.data.push(tmp2); }
						else { tmp1.data = tmp2; }
					});
					li = li.find("> ul > li");
					if(li.length) { tmp1.children = _this.get_json(li, li_attr, a_attr, true); }
					result.push(tmp1);
				});
				return result;
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree languages plugin
 * Adds support for multiple language versions in one tree
 * This basically allows for many titles coexisting in one node, but only one of them being visible at any given time
 * This is useful for maintaining the same structure in many languages (hence the name of the plugin)
 */
(function ($) {
	$.jstree.plugin("languages", {
		__init : function () { this._load_css();  },
		defaults : [],
		_fn : {
			set_lang : function (i) { 
				var langs = this._get_settings().languages,
					st = false,
					selector = ".jstree-" + this.get_index() + ' a';
				if(!$.isArray(langs) || langs.length === 0) { return false; }
				if($.inArray(i,langs) == -1) {
					if(!!langs[i]) { i = langs[i]; }
					else { return false; }
				}
				if(i == this.data.languages.current_language) { return true; }
				st = $.vakata.css.get_css(selector + "." + this.data.languages.current_language, false, this.data.languages.language_css);
				if(st !== false) { st.style.display = "none"; }
				st = $.vakata.css.get_css(selector + "." + i, false, this.data.languages.language_css);
				if(st !== false) { st.style.display = ""; }
				this.data.languages.current_language = i;
				this.__callback(i);
				return true;
			},
			get_lang : function () {
				return this.data.languages.current_language;
			},
			_get_string : function (key, lang) {
				var langs = this._get_settings().languages,
					s = this._get_settings().core.strings;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
				}
				if(s[lang] && s[lang][key]) { return s[lang][key]; }
				if(s[key]) { return s[key]; }
				return key;
			},
			get_text : function (obj, lang) {
				obj = this._get_node(obj) || this.data.ui.last_selected;
				if(!obj.size()) { return false; }
				var langs = this._get_settings().languages,
					s = this._get_settings().core.html_titles;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
					obj = obj.children("a." + lang);
				}
				else { obj = obj.children("a:eq(0)"); }
				if(s) {
					obj = obj.clone();
					obj.children("INS").remove();
					return obj.html();
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					return obj.nodeValue;
				}
			},
			set_text : function (obj, val, lang) {
				obj = this._get_node(obj) || this.data.ui.last_selected;
				if(!obj.size()) { return false; }
				var langs = this._get_settings().languages,
					s = this._get_settings().core.html_titles,
					tmp;
				if($.isArray(langs) && langs.length) {
					lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
					obj = obj.children("a." + lang);
				}
				else { obj = obj.children("a:eq(0)"); }
				if(s) {
					tmp = obj.children("INS").clone();
					obj.html(val).prepend(tmp);
					this.__callback({ "obj" : obj, "name" : val, "lang" : lang });
					return true;
				}
				else {
					obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
					this.__callback({ "obj" : obj, "name" : val, "lang" : lang });
					return (obj.nodeValue = val);
				}
			},
			_load_css : function () {
				var langs = this._get_settings().languages,
					str = "/* languages css */",
					selector = ".jstree-" + this.get_index() + ' a',
					ln;
				if($.isArray(langs) && langs.length) {
					this.data.languages.current_language = langs[0];
					for(ln = 0; ln < langs.length; ln++) {
						str += selector + "." + langs[ln] + " {";
						if(langs[ln] != this.data.languages.current_language) { str += " display:none; "; }
						str += " } ";
					}
					this.data.languages.language_css = $.vakata.css.add_sheet({ 'str' : str, 'title' : "jstree-languages" });
				}
			},
			create_node : function (obj, position, js, callback) {
				var t = this.__call_old(true, obj, position, js, function (t) {
					var langs = this._get_settings().languages,
						a = t.children("a"),
						ln;
					if($.isArray(langs) && langs.length) {
						for(ln = 0; ln < langs.length; ln++) {
							if(!a.is("." + langs[ln])) {
								t.append(a.eq(0).clone().removeClass(langs.join(" ")).addClass(langs[ln]));
							}
						}
						a.not("." + langs.join(", .")).remove();
					}
					if(callback) { callback.call(this, t); }
				});
				return t;
			}
		}
	});
})(jQuery);
//*/

/*
 * jsTree cookies plugin
 * Stores the currently opened/selected nodes in a cookie and then restores them
 * Depends on the jquery.cookie plugin
 */
(function ($) {
	$.jstree.plugin("cookies", {
		__init : function () {
			if(typeof $.cookie === "undefined") { throw "jsTree cookie: jQuery cookie plugin not included."; }

			var s = this._get_settings().cookies,
				tmp;
			if(!!s.save_loaded) {
				tmp = $.cookie(s.save_loaded);
				if(tmp && tmp.length) { this.data.core.to_load = tmp.split(","); }
			}
			if(!!s.save_opened) {
				tmp = $.cookie(s.save_opened);
				if(tmp && tmp.length) { this.data.core.to_open = tmp.split(","); }
			}
			if(!!s.save_selected) {
				tmp = $.cookie(s.save_selected);
				if(tmp && tmp.length && this.data.ui) { this.data.ui.to_select = tmp.split(","); }
			}
			this.get_container()
				.one( ( this.data.ui ? "reselect" : "reopen" ) + ".jstree", $.proxy(function () {
					this.get_container()
						.bind("open_node.jstree close_node.jstree select_node.jstree deselect_node.jstree", $.proxy(function (e) { 
								if(this._get_settings().cookies.auto_save) { this.save_cookie((e.handleObj.namespace + e.handleObj.type).replace("jstree","")); }
							}, this));
				}, this));
		},
		defaults : {
			save_loaded		: "jstree_load",
			save_opened		: "jstree_open",
			save_selected	: "jstree_select",
			auto_save		: true,
			cookie_options	: {}
		},
		_fn : {
			save_cookie : function (c) {
				if(this.data.core.refreshing) { return; }
				var s = this._get_settings().cookies;
				if(!c) { // if called manually and not by event
					if(s.save_loaded) {
						this.save_loaded();
						$.cookie(s.save_loaded, this.data.core.to_load.join(","), s.cookie_options);
					}
					if(s.save_opened) {
						this.save_opened();
						$.cookie(s.save_opened, this.data.core.to_open.join(","), s.cookie_options);
					}
					if(s.save_selected && this.data.ui) {
						this.save_selected();
						$.cookie(s.save_selected, this.data.ui.to_select.join(","), s.cookie_options);
					}
					return;
				}
				switch(c) {
					case "open_node":
					case "close_node":
						if(!!s.save_opened) { 
							this.save_opened(); 
							$.cookie(s.save_opened, this.data.core.to_open.join(","), s.cookie_options); 
						}
						if(!!s.save_loaded) { 
							this.save_loaded(); 
							$.cookie(s.save_loaded, this.data.core.to_load.join(","), s.cookie_options); 
						}
						break;
					case "select_node":
					case "deselect_node":
						if(!!s.save_selected && this.data.ui) { 
							this.save_selected(); 
							$.cookie(s.save_selected, this.data.ui.to_select.join(","), s.cookie_options); 
						}
						break;
				}
			}
		}
	});
	// include cookies by default
	// $.jstree.defaults.plugins.push("cookies");
})(jQuery);
//*/

/*
 * jsTree sort plugin
 * Sorts items alphabetically (or using any other function)
 */
(function ($) {
	$.jstree.plugin("sort", {
		__init : function () {
			this.get_container()
				.bind("load_node.jstree", $.proxy(function (e, data) {
						var obj = this._get_node(data.rslt.obj);
						obj = obj === -1 ? this.get_container().children("ul") : obj.children("ul");
						this.sort(obj);
					}, this))
				.bind("rename_node.jstree create_node.jstree create.jstree", $.proxy(function (e, data) {
						this.sort(data.rslt.obj.parent());
					}, this))
				.bind("move_node.jstree", $.proxy(function (e, data) {
						var m = data.rslt.np == -1 ? this.get_container() : data.rslt.np;
						this.sort(m.children("ul"));
					}, this));
		},
		defaults : function (a, b) { return this.get_text(a) > this.get_text(b) ? 1 : -1; },
		_fn : {
			sort : function (obj) {
				var s = this._get_settings().sort,
					t = this;
				obj.append($.makeArray(obj.children("li")).sort($.proxy(s, t)));
				obj.find("> li > ul").each(function() { t.sort($(this)); });
				this.clean_node(obj);
			}
		}
	});
})(jQuery);
//*/

/*
 * jsTree DND plugin
 * Drag and drop plugin for moving/copying nodes
 */
(function ($) {
	var o = false,
		r = false,
		m = false,
		ml = false,
		sli = false,
		sti = false,
		dir1 = false,
		dir2 = false,
		last_pos = false;
	$.vakata.dnd = {
		is_down : false,
		is_drag : false,
		helper : false,
		scroll_spd : 10,
		init_x : 0,
		init_y : 0,
		threshold : 5,
		helper_left : 5,
		helper_top : 10,
		user_data : {},

		drag_start : function (e, data, html) { 
			if($.vakata.dnd.is_drag) { $.vakata.drag_stop({}); }
			try {
				e.currentTarget.unselectable = "on";
				e.currentTarget.onselectstart = function() { return false; };
				if(e.currentTarget.style) { e.currentTarget.style.MozUserSelect = "none"; }
			} catch(err) { }
			$.vakata.dnd.init_x = e.pageX;
			$.vakata.dnd.init_y = e.pageY;
			$.vakata.dnd.user_data = data;
			$.vakata.dnd.is_down = true;
			$.vakata.dnd.helper = $("<div id='vakata-dragged' />").html(html); //.fadeTo(10,0.25);
			$(document).bind("mousemove", $.vakata.dnd.drag);
			$(document).bind("mouseup", $.vakata.dnd.drag_stop);
			return false;
		},
		drag : function (e) { 
			if(!$.vakata.dnd.is_down) { return; }
			if(!$.vakata.dnd.is_drag) {
				if(Math.abs(e.pageX - $.vakata.dnd.init_x) > 5 || Math.abs(e.pageY - $.vakata.dnd.init_y) > 5) { 
					$.vakata.dnd.helper.appendTo("body");
					$.vakata.dnd.is_drag = true;
					$(document).triggerHandler("drag_start.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
				}
				else { return; }
			}

			// maybe use a scrolling parent element instead of document?
			if(e.type === "mousemove") { // thought of adding scroll in order to move the helper, but mouse poisition is n/a
				var d = $(document), t = d.scrollTop(), l = d.scrollLeft();
				if(e.pageY - t < 20) { 
					if(sti && dir1 === "down") { clearInterval(sti); sti = false; }
					if(!sti) { dir1 = "up"; sti = setInterval(function () { $(document).scrollTop($(document).scrollTop() - $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sti && dir1 === "up") { clearInterval(sti); sti = false; }
				}
				if($(window).height() - (e.pageY - t) < 20) {
					if(sti && dir1 === "up") { clearInterval(sti); sti = false; }
					if(!sti) { dir1 = "down"; sti = setInterval(function () { $(document).scrollTop($(document).scrollTop() + $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sti && dir1 === "down") { clearInterval(sti); sti = false; }
				}

				if(e.pageX - l < 20) {
					if(sli && dir2 === "right") { clearInterval(sli); sli = false; }
					if(!sli) { dir2 = "left"; sli = setInterval(function () { $(document).scrollLeft($(document).scrollLeft() - $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sli && dir2 === "left") { clearInterval(sli); sli = false; }
				}
				if($(window).width() - (e.pageX - l) < 20) {
					if(sli && dir2 === "left") { clearInterval(sli); sli = false; }
					if(!sli) { dir2 = "right"; sli = setInterval(function () { $(document).scrollLeft($(document).scrollLeft() + $.vakata.dnd.scroll_spd); }, 150); }
				}
				else { 
					if(sli && dir2 === "right") { clearInterval(sli); sli = false; }
				}
			}

			$.vakata.dnd.helper.css({ left : (e.pageX + $.vakata.dnd.helper_left) + "px", top : (e.pageY + $.vakata.dnd.helper_top) + "px" });
			$(document).triggerHandler("drag.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
		},
		drag_stop : function (e) {
			if(sli) { clearInterval(sli); }
			if(sti) { clearInterval(sti); }
			$(document).unbind("mousemove", $.vakata.dnd.drag);
			$(document).unbind("mouseup", $.vakata.dnd.drag_stop);
			$(document).triggerHandler("drag_stop.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
			$.vakata.dnd.helper.remove();
			$.vakata.dnd.init_x = 0;
			$.vakata.dnd.init_y = 0;
			$.vakata.dnd.user_data = {};
			$.vakata.dnd.is_down = false;
			$.vakata.dnd.is_drag = false;
		}
	};
	$(function() {
		var css_string = '#vakata-dragged { display:block; margin:0 0 0 0; padding:4px 4px 4px 24px; position:absolute; top:-2000px; line-height:16px; z-index:10000; } ';
		$.vakata.css.add_sheet({ str : css_string, title : "vakata" });
	});

	$.jstree.plugin("dnd", {
		__init : function () {
			this.data.dnd = {
				active : false,
				after : false,
				inside : false,
				before : false,
				off : false,
				prepared : false,
				w : 0,
				to1 : false,
				to2 : false,
				cof : false,
				cw : false,
				ch : false,
				i1 : false,
				i2 : false,
				mto : false
			};
			this.get_container()
				.bind("mouseenter.jstree", $.proxy(function (e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(this.data.themes) {
								m.attr("class", "jstree-" + this.data.themes.theme); 
								if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
								$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme);
							}
							//if($(e.currentTarget).find("> ul > li").length === 0) {
							if(e.currentTarget === e.target && $.vakata.dnd.user_data.obj && $($.vakata.dnd.user_data.obj).length && $($.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0] !== e.target) { // node should not be from the same tree
								var tr = $.jstree._reference(e.target), dc;
								if(tr.data.dnd.foreign) {
									dc = tr._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
									if(dc === true || dc.inside === true || dc.before === true || dc.after === true) {
										$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
									}
								}
								else {
									tr.prepare_move(o, tr.get_container(), "last");
									if(tr.check_move()) {
										$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
									}
								}
							}
						}
					}, this))
				.bind("mouseup.jstree", $.proxy(function (e) {
						//if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && $(e.currentTarget).find("> ul > li").length === 0) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && e.currentTarget === e.target && $.vakata.dnd.user_data.obj && $($.vakata.dnd.user_data.obj).length && $($.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0] !== e.target) { // node should not be from the same tree
							var tr = $.jstree._reference(e.currentTarget), dc;
							if(tr.data.dnd.foreign) {
								dc = tr._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
								if(dc === true || dc.inside === true || dc.before === true || dc.after === true) {
									tr._get_settings().dnd.drag_finish.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
								}
							}
							else {
								tr.move_node(o, tr.get_container(), "last", e[tr._get_settings().dnd.copy_modifier + "Key"]);
							}
						}
					}, this))
				.bind("mouseleave.jstree", $.proxy(function (e) {
						if(e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id === "jstree-marker-line") {
							return false; 
						}
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
							if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
							if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
							if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
							if($.vakata.dnd.helper.children("ins").hasClass("jstree-ok")) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
							}
						}
					}, this))
				.bind("mousemove.jstree", $.proxy(function (e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							var cnt = this.get_container()[0];

							// Horizontal scroll
							if(e.pageX + 24 > this.data.dnd.cof.left + this.data.dnd.cw) {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
								this.data.dnd.i1 = setInterval($.proxy(function () { this.scrollLeft += $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else if(e.pageX - 24 < this.data.dnd.cof.left) {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
								this.data.dnd.i1 = setInterval($.proxy(function () { this.scrollLeft -= $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else {
								if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
							}

							// Vertical scroll
							if(e.pageY + 24 > this.data.dnd.cof.top + this.data.dnd.ch) {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
								this.data.dnd.i2 = setInterval($.proxy(function () { this.scrollTop += $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else if(e.pageY - 24 < this.data.dnd.cof.top) {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
								this.data.dnd.i2 = setInterval($.proxy(function () { this.scrollTop -= $.vakata.dnd.scroll_spd; }, cnt), 100);
							}
							else {
								if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
							}

						}
					}, this))
				.bind("scroll.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && m && ml) {
							m.hide();
							ml.hide();
						}
					}, this))
				.delegate("a", "mousedown.jstree", $.proxy(function (e) { 
						if(e.which === 1) {
							this.start_drag(e.currentTarget, e);
							return false;
						}
					}, this))
				.delegate("a", "mouseenter.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							this.dnd_enter(e.currentTarget);
						}
					}, this))
				.delegate("a", "mousemove.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(!r || !r.length || r.children("a")[0] !== e.currentTarget) {
								this.dnd_enter(e.currentTarget);
							}
							if(typeof this.data.dnd.off.top === "undefined") { this.data.dnd.off = $(e.target).offset(); }
							this.data.dnd.w = (e.pageY - (this.data.dnd.off.top || 0)) % this.data.core.li_height;
							if(this.data.dnd.w < 0) { this.data.dnd.w += this.data.core.li_height; }
							this.dnd_show();
						}
					}, this))
				.delegate("a", "mouseleave.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							if(e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id === "jstree-marker-line") {
								return false; 
							}
								if(m) { m.hide(); }
								if(ml) { ml.hide(); }
							/*
							var ec = $(e.currentTarget).closest("li"), 
								er = $(e.relatedTarget).closest("li");
							if(er[0] !== ec.prev()[0] && er[0] !== ec.next()[0]) {
								if(m) { m.hide(); }
								if(ml) { ml.hide(); }
							}
							*/
							this.data.dnd.mto = setTimeout( 
								(function (t) { return function () { t.dnd_leave(e); }; })(this),
							0);
						}
					}, this))
				.delegate("a", "mouseup.jstree", $.proxy(function (e) { 
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
							this.dnd_finish(e);
						}
					}, this));

			$(document)
				.bind("drag_stop.vakata", $.proxy(function () {
						if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
						if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
						if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
						if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
						this.data.dnd.after		= false;
						this.data.dnd.before	= false;
						this.data.dnd.inside	= false;
						this.data.dnd.off		= false;
						this.data.dnd.prepared	= false;
						this.data.dnd.w			= false;
						this.data.dnd.to1		= false;
						this.data.dnd.to2		= false;
						this.data.dnd.i1		= false;
						this.data.dnd.i2		= false;
						this.data.dnd.active	= false;
						this.data.dnd.foreign	= false;
						if(m) { m.css({ "top" : "-2000px" }); }
						if(ml) { ml.css({ "top" : "-2000px" }); }
					}, this))
				.bind("drag_start.vakata", $.proxy(function (e, data) {
						if(data.data.jstree) { 
							var et = $(data.event.target);
							if(et.closest(".jstree").hasClass("jstree-" + this.get_index())) {
								this.dnd_enter(et);
							}
						}
					}, this));
				/*
				.bind("keydown.jstree-" + this.get_index() + " keyup.jstree-" + this.get_index(), $.proxy(function(e) {
						if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && !this.data.dnd.foreign) {
							var h = $.vakata.dnd.helper.children("ins");
							if(e[this._get_settings().dnd.copy_modifier + "Key"] && h.hasClass("jstree-ok")) {
								h.parent().html(h.parent().html().replace(/ \(Copy\)$/, "") + " (Copy)");
							} 
							else {
								h.parent().html(h.parent().html().replace(/ \(Copy\)$/, ""));
							}
						}
					}, this)); */



			var s = this._get_settings().dnd;
			if(s.drag_target) {
				$(document)
					.delegate(s.drag_target, "mousedown.jstree-" + this.get_index(), $.proxy(function (e) {
						o = e.target;
						$.vakata.dnd.drag_start(e, { jstree : true, obj : e.target }, "<ins class='jstree-icon'></ins>" + $(e.target).text() );
						if(this.data.themes) { 
							if(m) { m.attr("class", "jstree-" + this.data.themes.theme); }
							if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
							$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme); 
						}
						$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
						var cnt = this.get_container();
						this.data.dnd.cof = cnt.offset();
						this.data.dnd.cw = parseInt(cnt.width(),10);
						this.data.dnd.ch = parseInt(cnt.height(),10);
						this.data.dnd.foreign = true;
						e.preventDefault();
					}, this));
			}
			if(s.drop_target) {
				$(document)
					.delegate(s.drop_target, "mouseenter.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active && this._get_settings().dnd.drop_check.call(this, { "o" : o, "r" : $(e.target), "e" : e })) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
							}
						}, this))
					.delegate(s.drop_target, "mouseleave.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active) {
								$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
							}
						}, this))
					.delegate(s.drop_target, "mouseup.jstree-" + this.get_index(), $.proxy(function (e) {
							if(this.data.dnd.active && $.vakata.dnd.helper.children("ins").hasClass("jstree-ok")) {
								this._get_settings().dnd.drop_finish.call(this, { "o" : o, "r" : $(e.target), "e" : e });
							}
						}, this));
			}
		},
		defaults : {
			copy_modifier	: "ctrl",
			check_timeout	: 100,
			open_timeout	: 500,
			drop_target		: ".jstree-drop",
			drop_check		: function (data) { return true; },
			drop_finish		: $.noop,
			drag_target		: ".jstree-draggable",
			drag_finish		: $.noop,
			drag_check		: function (data) { return { after : false, before : false, inside : true }; }
		},
		_fn : {
			dnd_prepare : function () {
				if(!r || !r.length) { return; }
				this.data.dnd.off = r.offset();
				if(this._get_settings().core.rtl) {
					this.data.dnd.off.right = this.data.dnd.off.left + r.width();
				}
				if(this.data.dnd.foreign) {
					var a = this._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : r });
					this.data.dnd.after = a.after;
					this.data.dnd.before = a.before;
					this.data.dnd.inside = a.inside;
					this.data.dnd.prepared = true;
					return this.dnd_show();
				}
				this.prepare_move(o, r, "before");
				this.data.dnd.before = this.check_move();
				this.prepare_move(o, r, "after");
				this.data.dnd.after = this.check_move();
				if(this._is_loaded(r)) {
					this.prepare_move(o, r, "inside");
					this.data.dnd.inside = this.check_move();
				}
				else {
					this.data.dnd.inside = false;
				}
				this.data.dnd.prepared = true;
				return this.dnd_show();
			},
			dnd_show : function () {
				if(!this.data.dnd.prepared) { return; }
				var o = ["before","inside","after"],
					r = false,
					rtl = this._get_settings().core.rtl,
					pos;
				if(this.data.dnd.w < this.data.core.li_height/3) { o = ["before","inside","after"]; }
				else if(this.data.dnd.w <= this.data.core.li_height*2/3) {
					o = this.data.dnd.w < this.data.core.li_height/2 ? ["inside","before","after"] : ["inside","after","before"];
				}
				else { o = ["after","inside","before"]; }
				$.each(o, $.proxy(function (i, val) { 
					if(this.data.dnd[val]) {
						$.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
						r = val;
						return false;
					}
				}, this));
				if(r === false) { $.vakata.dnd.helper.children("ins").attr("class","jstree-invalid"); }
				
				pos = rtl ? (this.data.dnd.off.right - 18) : (this.data.dnd.off.left + 10);
				switch(r) {
					case "before":
						m.css({ "left" : pos + "px", "top" : (this.data.dnd.off.top - 6) + "px" }).show();
						if(ml) { ml.css({ "left" : (pos + 8) + "px", "top" : (this.data.dnd.off.top - 1) + "px" }).show(); }
						break;
					case "after":
						m.css({ "left" : pos + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height - 6) + "px" }).show();
						if(ml) { ml.css({ "left" : (pos + 8) + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height - 1) + "px" }).show(); }
						break;
					case "inside":
						m.css({ "left" : pos + ( rtl ? -4 : 4) + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height/2 - 5) + "px" }).show();
						if(ml) { ml.hide(); }
						break;
					default:
						m.hide();
						if(ml) { ml.hide(); }
						break;
				}
				last_pos = r;
				return r;
			},
			dnd_open : function () {
				this.data.dnd.to2 = false;
				this.open_node(r, $.proxy(this.dnd_prepare,this), true);
			},
			dnd_finish : function (e) {
				if(this.data.dnd.foreign) {
					if(this.data.dnd.after || this.data.dnd.before || this.data.dnd.inside) {
						this._get_settings().dnd.drag_finish.call(this, { "o" : o, "r" : r, "p" : last_pos });
					}
				}
				else {
					this.dnd_prepare();
					this.move_node(o, r, last_pos, e[this._get_settings().dnd.copy_modifier + "Key"]);
				}
				o = false;
				r = false;
				m.hide();
				if(ml) { ml.hide(); }
			},
			dnd_enter : function (obj) {
				if(this.data.dnd.mto) { 
					clearTimeout(this.data.dnd.mto);
					this.data.dnd.mto = false;
				}
				var s = this._get_settings().dnd;
				this.data.dnd.prepared = false;
				r = this._get_node(obj);
				if(s.check_timeout) { 
					// do the calculations after a minimal timeout (users tend to drag quickly to the desired location)
					if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
					this.data.dnd.to1 = setTimeout($.proxy(this.dnd_prepare, this), s.check_timeout); 
				}
				else { 
					this.dnd_prepare(); 
				}
				if(s.open_timeout) { 
					if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
					if(r && r.length && r.hasClass("jstree-closed")) { 
						// if the node is closed - open it, then recalculate
						this.data.dnd.to2 = setTimeout($.proxy(this.dnd_open, this), s.open_timeout);
					}
				}
				else {
					if(r && r.length && r.hasClass("jstree-closed")) { 
						this.dnd_open();
					}
				}
			},
			dnd_leave : function (e) {
				this.data.dnd.after		= false;
				this.data.dnd.before	= false;
				this.data.dnd.inside	= false;
				$.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
				m.hide();
				if(ml) { ml.hide(); }
				if(r && r[0] === e.target.parentNode) {
					if(this.data.dnd.to1) {
						clearTimeout(this.data.dnd.to1);
						this.data.dnd.to1 = false;
					}
					if(this.data.dnd.to2) {
						clearTimeout(this.data.dnd.to2);
						this.data.dnd.to2 = false;
					}
				}
			},
			start_drag : function (obj, e) {
				o = this._get_node(obj);
				if(this.data.ui && this.is_selected(o)) { o = this._get_node(null, true); }
				var dt = o.length > 1 ? this._get_string("multiple_selection") : this.get_text(o),
					cnt = this.get_container();
				if(!this._get_settings().core.html_titles) { dt = dt.replace(/</ig,"&lt;").replace(/>/ig,"&gt;"); }
				$.vakata.dnd.drag_start(e, { jstree : true, obj : o }, "<ins class='jstree-icon'></ins>" + dt );
				if(this.data.themes) { 
					if(m) { m.attr("class", "jstree-" + this.data.themes.theme); }
					if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
					$.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme); 
				}
				this.data.dnd.cof = cnt.offset();
				this.data.dnd.cw = parseInt(cnt.width(),10);
				this.data.dnd.ch = parseInt(cnt.height(),10);
				this.data.dnd.active = true;
			}
		}
	});
	$(function() {
		var css_string = '' + 
			'#vakata-dragged ins { display:block; text-decoration:none; width:16px; height:16px; margin:0 0 0 0; padding:0; position:absolute; top:4px; left:4px; ' + 
			' -moz-border-radius:4px; border-radius:4px; -webkit-border-radius:4px; ' +
			'} ' + 
			'#vakata-dragged .jstree-ok { background:green; } ' + 
			'#vakata-dragged .jstree-invalid { background:red; } ' + 
			'#jstree-marker { padding:0; margin:0; font-size:12px; overflow:hidden; height:12px; width:8px; position:absolute; top:-30px; z-index:10001; background-repeat:no-repeat; display:none; background-color:transparent; text-shadow:1px 1px 1px white; color:black; line-height:10px; } ' + 
			'#jstree-marker-line { padding:0; margin:0; line-height:0%; font-size:1px; overflow:hidden; height:1px; width:100px; position:absolute; top:-30px; z-index:10000; background-repeat:no-repeat; display:none; background-color:#456c43; ' + 
			' cursor:pointer; border:1px solid #eeeeee; border-left:0; -moz-box-shadow: 0px 0px 2px #666; -webkit-box-shadow: 0px 0px 2px #666; box-shadow: 0px 0px 2px #666; ' + 
			' -moz-border-radius:1px; border-radius:1px; -webkit-border-radius:1px; ' +
			'}' + 
			'';
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
		m = $("<div />").attr({ id : "jstree-marker" }).hide().html("&raquo;")
			.bind("mouseleave mouseenter", function (e) { 
				m.hide();
				ml.hide();
				e.preventDefault(); 
				e.stopImmediatePropagation(); 
				return false; 
			})
			.appendTo("body");
		ml = $("<div />").attr({ id : "jstree-marker-line" }).hide()
			.bind("mouseup", function (e) { 
				if(r && r.length) { 
					r.children("a").trigger(e); 
					e.preventDefault(); 
					e.stopImmediatePropagation(); 
					return false; 
				} 
			})
			.bind("mouseleave", function (e) { 
				var rt = $(e.relatedTarget);
				if(rt.is(".jstree") || rt.closest(".jstree").length === 0) {
					if(r && r.length) { 
						r.children("a").trigger(e); 
						m.hide();
						ml.hide();
						e.preventDefault(); 
						e.stopImmediatePropagation(); 
						return false; 
					}
				}
			})
			.appendTo("body");
		$(document).bind("drag_start.vakata", function (e, data) {
			if(data.data.jstree) { m.show(); if(ml) { ml.show(); } }
		});
		$(document).bind("drag_stop.vakata", function (e, data) {
			if(data.data.jstree) { m.hide(); if(ml) { ml.hide(); } }
		});
	});
})(jQuery);
//*/

/*
 * jsTree checkbox plugin
 * Inserts checkboxes in front of every node
 * Depends on the ui plugin
 * DOES NOT WORK NICELY WITH MULTITREE DRAG'N'DROP
 */
(function ($) {
	$.jstree.plugin("checkbox", {
		__init : function () {
			this.data.checkbox.noui = this._get_settings().checkbox.override_ui;
			if(this.data.ui && this.data.checkbox.noui) {
				this.select_node = this.deselect_node = this.deselect_all = $.noop;
				this.get_selected = this.get_checked;
			}

			this.get_container()
				.bind("open_node.jstree create_node.jstree clean_node.jstree refresh.jstree", $.proxy(function (e, data) { 
						this._prepare_checkboxes(data.rslt.obj);
					}, this))
				.bind("loaded.jstree", $.proxy(function (e) {
						this._prepare_checkboxes();
					}, this))
				.delegate( (this.data.ui && this.data.checkbox.noui ? "a" : "ins.jstree-checkbox") , "click.jstree", $.proxy(function (e) {
						e.preventDefault();
						if(this._get_node(e.target).hasClass("jstree-checked")) { this.uncheck_node(e.target); }
						else { this.check_node(e.target); }
						if(this.data.ui && this.data.checkbox.noui) {
							this.save_selected();
							if(this.data.cookies) { this.save_cookie("select_node"); }
						}
						else {
							e.stopImmediatePropagation();
							return false;
						}
					}, this));
		},
		defaults : {
			override_ui : false,
			two_state : false,
			real_checkboxes : false,
			checked_parent_open : true,
			real_checkboxes_names : function (n) { return [ ("check_" + (n[0].id || Math.ceil(Math.random() * 10000))) , 1]; }
		},
		__destroy : function () {
			this.get_container()
				.find("input.jstree-real-checkbox").removeClass("jstree-real-checkbox").end()
				.find("ins.jstree-checkbox").remove();
		},
		_fn : {
			_checkbox_notify : function (n, data) {
				if(data.checked) {
					this.check_node(n, false);
				}
			},
			_prepare_checkboxes : function (obj) {
				obj = !obj || obj == -1 ? this.get_container().find("> ul > li") : this._get_node(obj);
				if(obj === false) { return; } // added for removing root nodes
				var c, _this = this, t, ts = this._get_settings().checkbox.two_state, rc = this._get_settings().checkbox.real_checkboxes, rcn = this._get_settings().checkbox.real_checkboxes_names;
				obj.each(function () {
					t = $(this);
					c = t.is("li") && (t.hasClass("jstree-checked") || (rc && t.children(":checked").length)) ? "jstree-checked" : "jstree-unchecked";
					t.find("li").andSelf().each(function () {
						var $t = $(this), nm;
						$t.children("a" + (_this.data.languages ? "" : ":eq(0)") ).not(":has(.jstree-checkbox)").prepend("<ins class='jstree-checkbox'>&#160;</ins>").parent().not(".jstree-checked, .jstree-unchecked").addClass( ts ? "jstree-unchecked" : c );
						if(rc) {
							if(!$t.children(":checkbox").length) {
								nm = rcn.call(_this, $t);
								$t.prepend("<input type='checkbox' class='jstree-real-checkbox' id='" + nm[0] + "' name='" + nm[0] + "' value='" + nm[1] + "' />");
							}
							else {
								$t.children(":checkbox").addClass("jstree-real-checkbox");
							}
						}
						if(!ts) {
							if(c === "jstree-checked" || $t.hasClass("jstree-checked") || $t.children(':checked').length) {
								$t.find("li").andSelf().addClass("jstree-checked").children(":checkbox").prop("checked", true);
							}
						}
						else {
							if($t.hasClass("jstree-checked") || $t.children(':checked').length) {
								$t.addClass("jstree-checked").children(":checkbox").prop("checked", true);
							}
						}
					});
				});
				if(!ts) {
					obj.find(".jstree-checked").parent().parent().each(function () { _this._repair_state(this); }); 
				}
			},
			change_state : function (obj, state) {
				obj = this._get_node(obj);
				var coll = false, rc = this._get_settings().checkbox.real_checkboxes;
				if(!obj || obj === -1) { return false; }
				state = (state === false || state === true) ? state : obj.hasClass("jstree-checked");
				if(this._get_settings().checkbox.two_state) {
					if(state) { 
						obj.removeClass("jstree-checked").addClass("jstree-unchecked"); 
						if(rc) { obj.children(":checkbox").prop("checked", false); }
					}
					else { 
						obj.removeClass("jstree-unchecked").addClass("jstree-checked"); 
						if(rc) { obj.children(":checkbox").prop("checked", true); }
					}
				}
				else {
					if(state) { 
						coll = obj.find("li").andSelf();
						if(!coll.filter(".jstree-checked, .jstree-undetermined").length) { return false; }
						coll.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked"); 
						if(rc) { coll.children(":checkbox").prop("checked", false); }
					}
					else { 
						coll = obj.find("li").andSelf();
						if(!coll.filter(".jstree-unchecked, .jstree-undetermined").length) { return false; }
						coll.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked"); 
						if(rc) { coll.children(":checkbox").prop("checked", true); }
						if(this.data.ui) { this.data.ui.last_selected = obj; }
						this.data.checkbox.last_selected = obj;
					}
					obj.parentsUntil(".jstree", "li").each(function () {
						var $this = $(this);
						if(state) {
							if($this.children("ul").children("li.jstree-checked, li.jstree-undetermined").length) {
								$this.parentsUntil(".jstree", "li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
								if(rc) { $this.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
								return false;
							}
							else {
								$this.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked");
								if(rc) { $this.children(":checkbox").prop("checked", false); }
							}
						}
						else {
							if($this.children("ul").children("li.jstree-unchecked, li.jstree-undetermined").length) {
								$this.parentsUntil(".jstree", "li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
								if(rc) { $this.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
								return false;
							}
							else {
								$this.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked");
								if(rc) { $this.children(":checkbox").prop("checked", true); }
							}
						}
					});
				}
				if(this.data.ui && this.data.checkbox.noui) { this.data.ui.selected = this.get_checked(); }
				this.__callback(obj);
				return true;
			},
			check_node : function (obj) {
				if(this.change_state(obj, false)) { 
					obj = this._get_node(obj);
					if(this._get_settings().checkbox.checked_parent_open) {
						var t = this;
						obj.parents(".jstree-closed").each(function () { t.open_node(this, false, true); });
					}
					this.__callback({ "obj" : obj }); 
				}
			},
			uncheck_node : function (obj) {
				if(this.change_state(obj, true)) { this.__callback({ "obj" : this._get_node(obj) }); }
			},
			check_all : function () {
				var _this = this, 
					coll = this._get_settings().checkbox.two_state ? this.get_container_ul().find("li") : this.get_container_ul().children("li");
				coll.each(function () {
					_this.change_state(this, false);
				});
				this.__callback();
			},
			uncheck_all : function () {
				var _this = this,
					coll = this._get_settings().checkbox.two_state ? this.get_container_ul().find("li") : this.get_container_ul().children("li");
				coll.each(function () {
					_this.change_state(this, true);
				});
				this.__callback();
			},

			is_checked : function(obj) {
				obj = this._get_node(obj);
				return obj.length ? obj.is(".jstree-checked") : false;
			},
			get_checked : function (obj, get_all) {
				obj = !obj || obj === -1 ? this.get_container() : this._get_node(obj);
				return get_all || this._get_settings().checkbox.two_state ? obj.find(".jstree-checked") : obj.find("> ul > .jstree-checked, .jstree-undetermined > ul > .jstree-checked");
			},
			get_unchecked : function (obj, get_all) { 
				obj = !obj || obj === -1 ? this.get_container() : this._get_node(obj);
				return get_all || this._get_settings().checkbox.two_state ? obj.find(".jstree-unchecked") : obj.find("> ul > .jstree-unchecked, .jstree-undetermined > ul > .jstree-unchecked");
			},

			show_checkboxes : function () { this.get_container().children("ul").removeClass("jstree-no-checkboxes"); },
			hide_checkboxes : function () { this.get_container().children("ul").addClass("jstree-no-checkboxes"); },

			_repair_state : function (obj) {
				obj = this._get_node(obj);
				if(!obj.length) { return; }
				if(this._get_settings().checkbox.two_state) {
					obj.find('li').andSelf().not('.jstree-checked').removeClass('jstree-undetermined').addClass('jstree-unchecked').children(':checkbox').prop('checked', true);
					return;
				}
				var rc = this._get_settings().checkbox.real_checkboxes,
					a = obj.find("> ul > .jstree-checked").length,
					b = obj.find("> ul > .jstree-undetermined").length,
					c = obj.find("> ul > li").length;
				if(c === 0) { if(obj.hasClass("jstree-undetermined")) { this.change_state(obj, false); } }
				else if(a === 0 && b === 0) { this.change_state(obj, true); }
				else if(a === c) { this.change_state(obj, false); }
				else { 
					obj.parentsUntil(".jstree","li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
					if(rc) { obj.parentsUntil(".jstree", "li").andSelf().children(":checkbox").prop("checked", false); }
				}
			},
			reselect : function () {
				if(this.data.ui && this.data.checkbox.noui) { 
					var _this = this,
						s = this.data.ui.to_select;
					s = $.map($.makeArray(s), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
					this.deselect_all();
					$.each(s, function (i, val) { _this.check_node(val); });
					this.__callback();
				}
				else { 
					this.__call_old(); 
				}
			},
			save_loaded : function () {
				var _this = this;
				this.data.core.to_load = [];
				this.get_container_ul().find("li.jstree-closed.jstree-undetermined").each(function () {
					if(this.id) { _this.data.core.to_load.push("#" + this.id); }
				});
			}
		}
	});
	$(function() {
		var css_string = '.jstree .jstree-real-checkbox { display:none; } ';
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});
})(jQuery);
//*/

/* 
 * jsTree XML plugin
 * The XML data store. Datastores are build by overriding the `load_node` and `_is_loaded` functions.
 */
(function ($) {
	$.vakata.xslt = function (xml, xsl, callback) {
		var rs = "", xm, xs, processor, support;
		// TODO: IE9 no XSLTProcessor, no document.recalc
		if(document.recalc) {
			xm = document.createElement('xml');
			xs = document.createElement('xml');
			xm.innerHTML = xml;
			xs.innerHTML = xsl;
			$("body").append(xm).append(xs);
			setTimeout( (function (xm, xs, callback) {
				return function () {
					callback.call(null, xm.transformNode(xs.XMLDocument));
					setTimeout( (function (xm, xs) { return function () { $(xm).remove(); $(xs).remove(); }; })(xm, xs), 200);
				};
			})(xm, xs, callback), 100);
			return true;
		}
		if(typeof window.DOMParser !== "undefined" && typeof window.XMLHttpRequest !== "undefined" && typeof window.XSLTProcessor === "undefined") {
			xml = new DOMParser().parseFromString(xml, "text/xml");
			xsl = new DOMParser().parseFromString(xsl, "text/xml");
			// alert(xml.transformNode());
			// callback.call(null, new XMLSerializer().serializeToString(rs));
			
		}
		if(typeof window.DOMParser !== "undefined" && typeof window.XMLHttpRequest !== "undefined" && typeof window.XSLTProcessor !== "undefined") {
			processor = new XSLTProcessor();
			support = $.isFunction(processor.transformDocument) ? (typeof window.XMLSerializer !== "undefined") : true;
			if(!support) { return false; }
			xml = new DOMParser().parseFromString(xml, "text/xml");
			xsl = new DOMParser().parseFromString(xsl, "text/xml");
			if($.isFunction(processor.transformDocument)) {
				rs = document.implementation.createDocument("", "", null);
				processor.transformDocument(xml, xsl, rs, null);
				callback.call(null, new XMLSerializer().serializeToString(rs));
				return true;
			}
			else {
				processor.importStylesheet(xsl);
				rs = processor.transformToFragment(xml, document);
				callback.call(null, $("<div />").append(rs).html());
				return true;
			}
		}
		return false;
	};
	var xsl = {
		'nest' : '<' + '?xml version="1.0" encoding="utf-8" ?>' + 
			'<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >' + 
			'<xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" standalone="no" indent="no" media-type="text/html" />' + 
			'<xsl:template match="/">' + 
			'	<xsl:call-template name="nodes">' + 
			'		<xsl:with-param name="node" select="/root" />' + 
			'	</xsl:call-template>' + 
			'</xsl:template>' + 
			'<xsl:template name="nodes">' + 
			'	<xsl:param name="node" />' + 
			'	<ul>' + 
			'	<xsl:for-each select="$node/item">' + 
			'		<xsl:variable name="children" select="count(./item) &gt; 0" />' + 
			'		<li>' + 
			'			<xsl:attribute name="class">' + 
			'				<xsl:if test="position() = last()">jstree-last </xsl:if>' + 
			'				<xsl:choose>' + 
			'					<xsl:when test="@state = \'open\'">jstree-open </xsl:when>' + 
			'					<xsl:when test="$children or @hasChildren or @state = \'closed\'">jstree-closed </xsl:when>' + 
			'					<xsl:otherwise>jstree-leaf </xsl:otherwise>' + 
			'				</xsl:choose>' + 
			'				<xsl:value-of select="@class" />' + 
			'			</xsl:attribute>' + 
			'			<xsl:for-each select="@*">' + 
			'				<xsl:if test="name() != \'class\' and name() != \'state\' and name() != \'hasChildren\'">' + 
			'					<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' + 
			'				</xsl:if>' + 
			'			</xsl:for-each>' + 
			'	<ins class="jstree-icon"><xsl:text>&#xa0;</xsl:text></ins>' + 
			'			<xsl:for-each select="content/name">' + 
			'				<a>' + 
			'				<xsl:attribute name="href">' + 
			'					<xsl:choose>' + 
			'					<xsl:when test="@href"><xsl:value-of select="@href" /></xsl:when>' + 
			'					<xsl:otherwise>#</xsl:otherwise>' + 
			'					</xsl:choose>' + 
			'				</xsl:attribute>' + 
			'				<xsl:attribute name="class"><xsl:value-of select="@lang" /> <xsl:value-of select="@class" /></xsl:attribute>' + 
			'				<xsl:attribute name="style"><xsl:value-of select="@style" /></xsl:attribute>' + 
			'				<xsl:for-each select="@*">' + 
			'					<xsl:if test="name() != \'style\' and name() != \'class\' and name() != \'href\'">' + 
			'						<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' + 
			'					</xsl:if>' + 
			'				</xsl:for-each>' + 
			'					<ins>' + 
			'						<xsl:attribute name="class">jstree-icon ' + 
			'							<xsl:if test="string-length(attribute::icon) > 0 and not(contains(@icon,\'/\'))"><xsl:value-of select="@icon" /></xsl:if>' + 
			'						</xsl:attribute>' + 
			'						<xsl:if test="string-length(attribute::icon) > 0 and contains(@icon,\'/\')"><xsl:attribute name="style">background:url(<xsl:value-of select="@icon" />) center center no-repeat;</xsl:attribute></xsl:if>' + 
			'						<xsl:text>&#xa0;</xsl:text>' + 
			'					</ins>' + 
			'					<xsl:copy-of select="./child::node()" />' + 
			'				</a>' + 
			'			</xsl:for-each>' + 
			'			<xsl:if test="$children or @hasChildren"><xsl:call-template name="nodes"><xsl:with-param name="node" select="current()" /></xsl:call-template></xsl:if>' + 
			'		</li>' + 
			'	</xsl:for-each>' + 
			'	</ul>' + 
			'</xsl:template>' + 
			'</xsl:stylesheet>',

		'flat' : '<' + '?xml version="1.0" encoding="utf-8" ?>' + 
			'<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >' + 
			'<xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" standalone="no" indent="no" media-type="text/xml" />' + 
			'<xsl:template match="/">' + 
			'	<ul>' + 
			'	<xsl:for-each select="//item[not(@parent_id) or @parent_id=0 or not(@parent_id = //item/@id)]">' + /* the last `or` may be removed */
			'		<xsl:call-template name="nodes">' + 
			'			<xsl:with-param name="node" select="." />' + 
			'			<xsl:with-param name="is_last" select="number(position() = last())" />' + 
			'		</xsl:call-template>' + 
			'	</xsl:for-each>' + 
			'	</ul>' + 
			'</xsl:template>' + 
			'<xsl:template name="nodes">' + 
			'	<xsl:param name="node" />' + 
			'	<xsl:param name="is_last" />' + 
			'	<xsl:variable name="children" select="count(//item[@parent_id=$node/attribute::id]) &gt; 0" />' + 
			'	<li>' + 
			'	<xsl:attribute name="class">' + 
			'		<xsl:if test="$is_last = true()">jstree-last </xsl:if>' + 
			'		<xsl:choose>' + 
			'			<xsl:when test="@state = \'open\'">jstree-open </xsl:when>' + 
			'			<xsl:when test="$children or @hasChildren or @state = \'closed\'">jstree-closed </xsl:when>' + 
			'			<xsl:otherwise>jstree-leaf </xsl:otherwise>' + 
			'		</xsl:choose>' + 
			'		<xsl:value-of select="@class" />' + 
			'	</xsl:attribute>' + 
			'	<xsl:for-each select="@*">' + 
			'		<xsl:if test="name() != \'parent_id\' and name() != \'hasChildren\' and name() != \'class\' and name() != \'state\'">' + 
			'		<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' + 
			'		</xsl:if>' + 
			'	</xsl:for-each>' + 
			'	<ins class="jstree-icon"><xsl:text>&#xa0;</xsl:text></ins>' + 
			'	<xsl:for-each select="content/name">' + 
			'		<a>' + 
			'		<xsl:attribute name="href">' + 
			'			<xsl:choose>' + 
			'			<xsl:when test="@href"><xsl:value-of select="@href" /></xsl:when>' + 
			'			<xsl:otherwise>#</xsl:otherwise>' + 
			'			</xsl:choose>' + 
			'		</xsl:attribute>' + 
			'		<xsl:attribute name="class"><xsl:value-of select="@lang" /> <xsl:value-of select="@class" /></xsl:attribute>' + 
			'		<xsl:attribute name="style"><xsl:value-of select="@style" /></xsl:attribute>' + 
			'		<xsl:for-each select="@*">' + 
			'			<xsl:if test="name() != \'style\' and name() != \'class\' and name() != \'href\'">' + 
			'				<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>' + 
			'			</xsl:if>' + 
			'		</xsl:for-each>' + 
			'			<ins>' + 
			'				<xsl:attribute name="class">jstree-icon ' + 
			'					<xsl:if test="string-length(attribute::icon) > 0 and not(contains(@icon,\'/\'))"><xsl:value-of select="@icon" /></xsl:if>' + 
			'				</xsl:attribute>' + 
			'				<xsl:if test="string-length(attribute::icon) > 0 and contains(@icon,\'/\')"><xsl:attribute name="style">background:url(<xsl:value-of select="@icon" />) center center no-repeat;</xsl:attribute></xsl:if>' + 
			'				<xsl:text>&#xa0;</xsl:text>' + 
			'			</ins>' + 
			'			<xsl:copy-of select="./child::node()" />' + 
			'		</a>' + 
			'	</xsl:for-each>' + 
			'	<xsl:if test="$children">' + 
			'		<ul>' + 
			'		<xsl:for-each select="//item[@parent_id=$node/attribute::id]">' + 
			'			<xsl:call-template name="nodes">' + 
			'				<xsl:with-param name="node" select="." />' + 
			'				<xsl:with-param name="is_last" select="number(position() = last())" />' + 
			'			</xsl:call-template>' + 
			'		</xsl:for-each>' + 
			'		</ul>' + 
			'	</xsl:if>' + 
			'	</li>' + 
			'</xsl:template>' + 
			'</xsl:stylesheet>'
	},
	escape_xml = function(string) {
		return string
			.toString()
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	};
	$.jstree.plugin("xml_data", {
		defaults : { 
			data : false,
			ajax : false,
			xsl : "flat",
			clean_node : false,
			correct_state : true,
			get_skip_empty : false,
			get_include_preamble : true
		},
		_fn : {
			load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_xml(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
			_is_loaded : function (obj) { 
				var s = this._get_settings().xml_data;
				obj = this._get_node(obj);
				return obj == -1 || !obj || (!s.ajax && !$.isFunction(s.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").size() > 0;
			},
			load_node_xml : function (obj, s_call, e_call) {
				var s = this.get_settings().xml_data,
					error_func = function () {},
					success_func = function () {};

				obj = this._get_node(obj);
				if(obj && obj !== -1) {
					if(obj.data("jstree_is_loading")) { return; }
					else { obj.data("jstree_is_loading",true); }
				}
				switch(!0) {
					case (!s.data && !s.ajax): throw "Neither data nor ajax settings supplied.";
					case ($.isFunction(s.data)):
						s.data.call(this, obj, $.proxy(function (d) {
							this.parse_xml(d, $.proxy(function (d) {
								if(d) {
									d = d.replace(/ ?xmlns="[^"]*"/ig, "");
									if(d.length > 10) {
										d = $(d);
										if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
										else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d); obj.removeData("jstree_is_loading"); }
										if(s.clean_node) { this.clean_node(obj); }
										if(s_call) { s_call.call(this); }
									}
									else {
										if(obj && obj !== -1) { 
											obj.children("a.jstree-loading").removeClass("jstree-loading");
											obj.removeData("jstree_is_loading");
											if(s.correct_state) { 
												this.correct_state(obj);
												if(s_call) { s_call.call(this); } 
											}
										}
										else {
											if(s.correct_state) { 
												this.get_container().children("ul").empty();
												if(s_call) { s_call.call(this); } 
											}
										}
									}
								}
							}, this));
						}, this));
						break;
					case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
						if(!obj || obj == -1) {
							this.parse_xml(s.data, $.proxy(function (d) {
								if(d) {
									d = d.replace(/ ?xmlns="[^"]*"/ig, "");
									if(d.length > 10) {
										d = $(d);
										this.get_container().children("ul").empty().append(d.children());
										if(s.clean_node) { this.clean_node(obj); }
										if(s_call) { s_call.call(this); }
									}
								}
								else { 
									if(s.correct_state) { 
										this.get_container().children("ul").empty(); 
										if(s_call) { s_call.call(this); }
									}
								}
							}, this));
						}
						break;
					case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
						error_func = function (x, t, e) {
							var ef = this.get_settings().xml_data.ajax.error; 
							if(ef) { ef.call(this, x, t, e); }
							if(obj !== -1 && obj.length) {
								obj.children("a.jstree-loading").removeClass("jstree-loading");
								obj.removeData("jstree_is_loading");
								if(t === "success" && s.correct_state) { this.correct_state(obj); }
							}
							else {
								if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
							}
							if(e_call) { e_call.call(this); }
						};
						success_func = function (d, t, x) {
							d = x.responseText;
							var sf = this.get_settings().xml_data.ajax.success; 
							if(sf) { d = sf.call(this,d,t,x) || d; }
							if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "")) {
								return error_func.call(this, x, t, "");
							}
							this.parse_xml(d, $.proxy(function (d) {
								if(d) {
									d = d.replace(/ ?xmlns="[^"]*"/ig, "");
									if(d.length > 10) {
										d = $(d);
										if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
										else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d); obj.removeData("jstree_is_loading"); }
										if(s.clean_node) { this.clean_node(obj); }
										if(s_call) { s_call.call(this); }
									}
									else {
										if(obj && obj !== -1) { 
											obj.children("a.jstree-loading").removeClass("jstree-loading");
											obj.removeData("jstree_is_loading");
											if(s.correct_state) { 
												this.correct_state(obj);
												if(s_call) { s_call.call(this); } 
											}
										}
										else {
											if(s.correct_state) { 
												this.get_container().children("ul").empty();
												if(s_call) { s_call.call(this); } 
											}
										}
									}
								}
							}, this));
						};
						s.ajax.context = this;
						s.ajax.error = error_func;
						s.ajax.success = success_func;
						if(!s.ajax.dataType) { s.ajax.dataType = "xml"; }
						if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
						if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
						$.ajax(s.ajax);
						break;
				}
			},
			parse_xml : function (xml, callback) {
				var s = this._get_settings().xml_data;
				$.vakata.xslt(xml, xsl[s.xsl], callback);
			},
			get_xml : function (tp, obj, li_attr, a_attr, is_callback) {
				var result = "", 
					s = this._get_settings(), 
					_this = this,
					tmp1, tmp2, li, a, lang;
				if(!tp) { tp = "flat"; }
				if(!is_callback) { is_callback = 0; }
				obj = this._get_node(obj);
				if(!obj || obj === -1) { obj = this.get_container().find("> ul > li"); }
				li_attr = $.isArray(li_attr) ? li_attr : [ "id", "class" ];
				if(!is_callback && this.data.types && $.inArray(s.types.type_attr, li_attr) === -1) { li_attr.push(s.types.type_attr); }

				a_attr = $.isArray(a_attr) ? a_attr : [ ];

				if(!is_callback) { 
					if(s.xml_data.get_include_preamble) { 
						result += '<' + '?xml version="1.0" encoding="UTF-8"?' + '>'; 
					}
					result += "<root>"; 
				}
				obj.each(function () {
					result += "<item";
					li = $(this);
					$.each(li_attr, function (i, v) { 
						var t = li.attr(v);
						if(!s.xml_data.get_skip_empty || typeof t !== "undefined") {
							result += " " + v + "=\"" + escape_xml((" " + (t || "")).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"")) + "\""; 
						}
					});
					if(li.hasClass("jstree-open")) { result += " state=\"open\""; }
					if(li.hasClass("jstree-closed")) { result += " state=\"closed\""; }
					if(tp === "flat") { result += " parent_id=\"" + escape_xml(is_callback) + "\""; }
					result += ">";
					result += "<content>";
					a = li.children("a");
					a.each(function () {
						tmp1 = $(this);
						lang = false;
						result += "<name";
						if($.inArray("languages", s.plugins) !== -1) {
							$.each(s.languages, function (k, z) {
								if(tmp1.hasClass(z)) { result += " lang=\"" + escape_xml(z) + "\""; lang = z; return false; }
							});
						}
						if(a_attr.length) { 
							$.each(a_attr, function (k, z) {
								var t = tmp1.attr(z);
								if(!s.xml_data.get_skip_empty || typeof t !== "undefined") {
									result += " " + z + "=\"" + escape_xml((" " + t || "").replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"")) + "\"";
								}
							});
						}
						if(tmp1.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"").length) {
							result += ' icon="' + escape_xml(tmp1.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"")) + '"';
						}
						if(tmp1.children("ins").get(0).style.backgroundImage.length) {
							result += ' icon="' + escape_xml(tmp1.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")","").replace(/'/ig,"").replace(/"/ig,"")) + '"';
						}
						result += ">";
						result += "<![CDATA[" + _this.get_text(tmp1, lang) + "]]>";
						result += "</name>";
					});
					result += "</content>";
					tmp2 = li[0].id || true;
					li = li.find("> ul > li");
					if(li.length) { tmp2 = _this.get_xml(tp, li, li_attr, a_attr, tmp2); }
					else { tmp2 = ""; }
					if(tp == "nest") { result += tmp2; }
					result += "</item>";
					if(tp == "flat") { result += tmp2; }
				});
				if(!is_callback) { result += "</root>"; }
				return result;
			}
		}
	});
})(jQuery);
//*/

/*
 * jsTree search plugin
 * Enables both sync and async search on the tree
 * DOES NOT WORK WITH JSON PROGRESSIVE RENDER
 */
(function ($) {
	$.expr[':'].jstree_contains = function(a,i,m){
		return (a.textContent || a.innerText || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
	};
	$.expr[':'].jstree_title_contains = function(a,i,m) {
		return (a.getAttribute("title") || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
	};
	$.jstree.plugin("search", {
		__init : function () {
			this.data.search.str = "";
			this.data.search.result = $();
			if(this._get_settings().search.show_only_matches) {
				this.get_container()
					.bind("search.jstree", function (e, data) {
						$(this).children("ul").find("li").hide().removeClass("jstree-last");
						data.rslt.nodes.parentsUntil(".jstree").andSelf().show()
							.filter("ul").each(function () { $(this).children("li:visible").eq(-1).addClass("jstree-last"); });
					})
					.bind("clear_search.jstree", function () {
						$(this).children("ul").find("li").css("display","").end().end().jstree("clean_node", -1);
					});
			}
		},
		defaults : {
			ajax : false,
			search_method : "jstree_contains", // for case insensitive - jstree_contains
			show_only_matches : false
		},
		_fn : {
			search : function (str, skip_async) {
				if($.trim(str) === "") { this.clear_search(); return; }
				var s = this.get_settings().search, 
					t = this,
					error_func = function () { },
					success_func = function () { };
				this.data.search.str = str;

				if(!skip_async && s.ajax !== false && this.get_container_ul().find("li.jstree-closed:not(:has(ul)):eq(0)").length > 0) {
					this.search.supress_callback = true;
					error_func = function () { };
					success_func = function (d, t, x) {
						var sf = this.get_settings().search.ajax.success; 
						if(sf) { d = sf.call(this,d,t,x) || d; }
						this.data.search.to_open = d;
						this._search_open();
					};
					s.ajax.context = this;
					s.ajax.error = error_func;
					s.ajax.success = success_func;
					if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, str); }
					if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, str); }
					if(!s.ajax.data) { s.ajax.data = { "search_string" : str }; }
					if(!s.ajax.dataType || /^json/.exec(s.ajax.dataType)) { s.ajax.dataType = "json"; }
					$.ajax(s.ajax);
					return;
				}
				if(this.data.search.result.length) { this.clear_search(); }
				this.data.search.result = this.get_container().find("a" + (this.data.languages ? "." + this.get_lang() : "" ) + ":" + (s.search_method) + "(" + this.data.search.str + ")");
				this.data.search.result.addClass("jstree-search").parent().parents(".jstree-closed").each(function () {
					t.open_node(this, false, true);
				});
				this.__callback({ nodes : this.data.search.result, str : str });
			},
			clear_search : function (str) {
				this.data.search.result.removeClass("jstree-search");
				this.__callback(this.data.search.result);
				this.data.search.result = $();
			},
			_search_open : function (is_callback) {
				var _this = this,
					done = true,
					current = [],
					remaining = [];
				if(this.data.search.to_open.length) {
					$.each(this.data.search.to_open, function (i, val) {
						if(val == "#") { return true; }
						if($(val).length && $(val).is(".jstree-closed")) { current.push(val); }
						else { remaining.push(val); }
					});
					if(current.length) {
						this.data.search.to_open = remaining;
						$.each(current, function (i, val) { 
							_this.open_node(val, function () { _this._search_open(true); }); 
						});
						done = false;
					}
				}
				if(done) { this.search(this.data.search.str, true); }
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree contextmenu plugin
 */
(function ($) {
	$.vakata.context = {
		hide_on_mouseleave : false,

		cnt		: $("<div id='vakata-contextmenu' />"),
		vis		: false,
		tgt		: false,
		par		: false,
		func	: false,
		data	: false,
		rtl		: false,
		show	: function (s, t, x, y, d, p, rtl) {
			$.vakata.context.rtl = !!rtl;
			var html = $.vakata.context.parse(s), h, w;
			if(!html) { return; }
			$.vakata.context.vis = true;
			$.vakata.context.tgt = t;
			$.vakata.context.par = p || t || null;
			$.vakata.context.data = d || null;
			$.vakata.context.cnt
				.html(html)
				.css({ "visibility" : "hidden", "display" : "block", "left" : 0, "top" : 0 });

			if($.vakata.context.hide_on_mouseleave) {
				$.vakata.context.cnt
					.one("mouseleave", function(e) { $.vakata.context.hide(); });
			}

			h = $.vakata.context.cnt.height();
			w = $.vakata.context.cnt.width();
			if(x + w > $(document).width()) { 
				x = $(document).width() - (w + 5); 
				$.vakata.context.cnt.find("li > ul").addClass("right"); 
			}
			if(y + h > $(document).height()) { 
				y = y - (h + t[0].offsetHeight); 
				$.vakata.context.cnt.find("li > ul").addClass("bottom"); 
			}

			$.vakata.context.cnt
				.css({ "left" : x, "top" : y })
				.find("li:has(ul)")
					.bind("mouseenter", function (e) { 
						var w = $(document).width(),
							h = $(document).height(),
							ul = $(this).children("ul").show(); 
						if(w !== $(document).width()) { ul.toggleClass("right"); }
						if(h !== $(document).height()) { ul.toggleClass("bottom"); }
					})
					.bind("mouseleave", function (e) { 
						$(this).children("ul").hide(); 
					})
					.end()
				.css({ "visibility" : "visible" })
				.show();
			$(document).triggerHandler("context_show.vakata");
		},
		hide	: function () {
			$.vakata.context.vis = false;
			$.vakata.context.cnt.attr("class","").css({ "visibility" : "hidden" });
			$(document).triggerHandler("context_hide.vakata");
		},
		parse	: function (s, is_callback) {
			if(!s) { return false; }
			var str = "",
				tmp = false,
				was_sep = true;
			if(!is_callback) { $.vakata.context.func = {}; }
			str += "<ul>";
			$.each(s, function (i, val) {
				if(!val) { return true; }
				$.vakata.context.func[i] = val.action;
				if(!was_sep && val.separator_before) {
					str += "<li class='vakata-separator vakata-separator-before'></li>";
				}
				was_sep = false;
				str += "<li class='" + (val._class || "") + (val._disabled ? " jstree-contextmenu-disabled " : "") + "'><ins ";
				if(val.icon && val.icon.indexOf("/") === -1) { str += " class='" + val.icon + "' "; }
				if(val.icon && val.icon.indexOf("/") !== -1) { str += " style='background:url(" + val.icon + ") center center no-repeat;' "; }
				str += ">&#160;</ins><a href='#' rel='" + i + "'>";
				if(val.submenu) {
					str += "<span style='float:" + ($.vakata.context.rtl ? "left" : "right") + ";'>&raquo;</span>";
				}
				str += val.label + "</a>";
				if(val.submenu) {
					tmp = $.vakata.context.parse(val.submenu, true);
					if(tmp) { str += tmp; }
				}
				str += "</li>";
				if(val.separator_after) {
					str += "<li class='vakata-separator vakata-separator-after'></li>";
					was_sep = true;
				}
			});
			str = str.replace(/<li class\='vakata-separator vakata-separator-after'\><\/li\>$/,"");
			str += "</ul>";
			$(document).triggerHandler("context_parse.vakata");
			return str.length > 10 ? str : false;
		},
		exec	: function (i) {
			if($.isFunction($.vakata.context.func[i])) {
				// if is string - eval and call it!
				$.vakata.context.func[i].call($.vakata.context.data, $.vakata.context.par);
				return true;
			}
			else { return false; }
		}
	};
	$(function () {
		var css_string = '' + 
			'#vakata-contextmenu { display:block; visibility:hidden; left:0; top:-200px; position:absolute; margin:0; padding:0; min-width:180px; background:#ebebeb; border:1px solid silver; z-index:10000; *width:180px; } ' + 
			'#vakata-contextmenu ul { min-width:180px; *width:180px; } ' + 
			'#vakata-contextmenu ul, #vakata-contextmenu li { margin:0; padding:0; list-style-type:none; display:block; } ' + 
			'#vakata-contextmenu li { line-height:20px; min-height:20px; position:relative; padding:0px; } ' + 
			'#vakata-contextmenu li a { padding:1px 6px; line-height:17px; display:block; text-decoration:none; margin:1px 1px 0 1px; } ' + 
			'#vakata-contextmenu li ins { float:left; width:16px; height:16px; text-decoration:none; margin-right:2px; } ' + 
			'#vakata-contextmenu li a:hover, #vakata-contextmenu li.vakata-hover > a { background:gray; color:white; } ' + 
			'#vakata-contextmenu li ul { display:none; position:absolute; top:-2px; left:100%; background:#ebebeb; border:1px solid gray; } ' + 
			'#vakata-contextmenu .right { right:100%; left:auto; } ' + 
			'#vakata-contextmenu .bottom { bottom:-1px; top:auto; } ' + 
			'#vakata-contextmenu li.vakata-separator { min-height:0; height:1px; line-height:1px; font-size:1px; overflow:hidden; margin:0 2px; background:silver; /* border-top:1px solid #fefefe; */ padding:0; } ';
		$.vakata.css.add_sheet({ str : css_string, title : "vakata" });
		$.vakata.context.cnt
			.delegate("a","click", function (e) { e.preventDefault(); })
			.delegate("a","mouseup", function (e) {
				if(!$(this).parent().hasClass("jstree-contextmenu-disabled") && $.vakata.context.exec($(this).attr("rel"))) {
					$.vakata.context.hide();
				}
				else { $(this).blur(); }
			})
			.delegate("a","mouseover", function () {
				$.vakata.context.cnt.find(".vakata-hover").removeClass("vakata-hover");
			})
			.appendTo("body");
		$(document).bind("mousedown", function (e) { if($.vakata.context.vis && !$.contains($.vakata.context.cnt[0], e.target)) { $.vakata.context.hide(); } });
		if(typeof $.hotkeys !== "undefined") {
			$(document)
				.bind("keydown", "up", function (e) { 
					if($.vakata.context.vis) { 
						var o = $.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").prevAll("li:not(.vakata-separator)").first();
						if(!o.length) { o = $.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").last(); }
						o.addClass("vakata-hover");
						e.stopImmediatePropagation(); 
						e.preventDefault();
					} 
				})
				.bind("keydown", "down", function (e) { 
					if($.vakata.context.vis) { 
						var o = $.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").nextAll("li:not(.vakata-separator)").first();
						if(!o.length) { o = $.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").first(); }
						o.addClass("vakata-hover");
						e.stopImmediatePropagation(); 
						e.preventDefault();
					} 
				})
				.bind("keydown", "right", function (e) { 
					if($.vakata.context.vis) { 
						$.vakata.context.cnt.find(".vakata-hover").children("ul").show().children("li:not(.vakata-separator)").removeClass("vakata-hover").first().addClass("vakata-hover");
						e.stopImmediatePropagation(); 
						e.preventDefault();
					} 
				})
				.bind("keydown", "left", function (e) { 
					if($.vakata.context.vis) { 
						$.vakata.context.cnt.find(".vakata-hover").children("ul").hide().children(".vakata-separator").removeClass("vakata-hover");
						e.stopImmediatePropagation(); 
						e.preventDefault();
					} 
				})
				.bind("keydown", "esc", function (e) { 
					$.vakata.context.hide(); 
					e.preventDefault();
				})
				.bind("keydown", "space", function (e) { 
					$.vakata.context.cnt.find(".vakata-hover").last().children("a").click();
					e.preventDefault();
				});
		}
	});

	$.jstree.plugin("contextmenu", {
		__init : function () {
			this.get_container()
				.delegate("a", "contextmenu.jstree", $.proxy(function (e) {
						e.preventDefault();
						if(!$(e.currentTarget).hasClass("jstree-loading")) {
							this.show_contextmenu(e.currentTarget, e.pageX, e.pageY);
						}
					}, this))
				.delegate("a", "click.jstree", $.proxy(function (e) {
						if(this.data.contextmenu) {
							$.vakata.context.hide();
						}
					}, this))
				.bind("destroy.jstree", $.proxy(function () {
						// TODO: move this to descruct method
						if(this.data.contextmenu) {
							$.vakata.context.hide();
						}
					}, this));
			$(document).bind("context_hide.vakata", $.proxy(function () { this.data.contextmenu = false; }, this));
		},
		defaults : { 
			select_node : false, // requires UI plugin
			show_at_node : true,
			items : { // Could be a function that should return an object like this one
				"create" : {
					"separator_before"	: false,
					"separator_after"	: true,
					"label"				: "Create",
					"action"			: function (obj) { this.create(obj); }
				},
				"rename" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"label"				: "Rename",
					"action"			: function (obj) { this.rename(obj); }
				},
				"remove" : {
					"separator_before"	: false,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Delete",
					"action"			: function (obj) { if(this.is_selected(obj)) { this.remove(); } else { this.remove(obj); } }
				},
				"ccp" : {
					"separator_before"	: true,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Edit",
					"action"			: false,
					"submenu" : { 
						"cut" : {
							"separator_before"	: false,
							"separator_after"	: false,
							"label"				: "Cut",
							"action"			: function (obj) { this.cut(obj); }
						},
						"copy" : {
							"separator_before"	: false,
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "Copy",
							"action"			: function (obj) { this.copy(obj); }
						},
						"paste" : {
							"separator_before"	: false,
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "Paste",
							"action"			: function (obj) { this.paste(obj); }
						}
					}
				}
			}
		},
		_fn : {
			show_contextmenu : function (obj, x, y) {
				obj = this._get_node(obj);
				var s = this.get_settings().contextmenu,
					a = obj.children("a:visible:eq(0)"),
					o = false,
					i = false;
				if(s.select_node && this.data.ui && !this.is_selected(obj)) {
					this.deselect_all();
					this.select_node(obj, true);
				}
				if(s.show_at_node || typeof x === "undefined" || typeof y === "undefined") {
					o = a.offset();
					x = o.left;
					y = o.top + this.data.core.li_height;
				}
				i = obj.data("jstree") && obj.data("jstree").contextmenu ? obj.data("jstree").contextmenu : s.items;
				if($.isFunction(i)) { i = i.call(this, obj); }
				this.data.contextmenu = true;
				$.vakata.context.show(i, a, x, y, this, obj, this._get_settings().core.rtl);
				if(this.data.themes) { $.vakata.context.cnt.attr("class", "jstree-" + this.data.themes.theme + "-context"); }
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree types plugin
 * Adds support types of nodes
 * You can set an attribute on each li node, that represents its type.
 * According to the type setting the node may get custom icon/validation rules
 */
(function ($) {
	$.jstree.plugin("types", {
		__init : function () {
			var s = this._get_settings().types;
			this.data.types.attach_to = [];
			this.get_container()
				.bind("init.jstree", $.proxy(function () { 
						var types = s.types, 
							attr  = s.type_attr, 
							icons_css = "", 
							_this = this;

						$.each(types, function (i, tp) {
							$.each(tp, function (k, v) { 
								if(!/^(max_depth|max_children|icon|valid_children)$/.test(k)) { _this.data.types.attach_to.push(k); }
							});
							if(!tp.icon) { return true; }
							if( tp.icon.image || tp.icon.position) {
								if(i == "default")	{ icons_css += '.jstree-' + _this.get_index() + ' a > .jstree-icon { '; }
								else				{ icons_css += '.jstree-' + _this.get_index() + ' li[' + attr + '="' + i + '"] > a > .jstree-icon { '; }
								if(tp.icon.image)	{ icons_css += ' background-image:url(' + tp.icon.image + '); '; }
								if(tp.icon.position){ icons_css += ' background-position:' + tp.icon.position + '; '; }
								else				{ icons_css += ' background-position:0 0; '; }
								icons_css += '} ';
							}
						});
						if(icons_css !== "") { $.vakata.css.add_sheet({ 'str' : icons_css, title : "jstree-types" }); }
					}, this))
				.bind("before.jstree", $.proxy(function (e, data) { 
						var s, t, 
							o = this._get_settings().types.use_data ? this._get_node(data.args[0]) : false, 
							d = o && o !== -1 && o.length ? o.data("jstree") : false;
						if(d && d.types && d.types[data.func] === false) { e.stopImmediatePropagation(); return false; }
						if($.inArray(data.func, this.data.types.attach_to) !== -1) {
							if(!data.args[0] || (!data.args[0].tagName && !data.args[0].jquery)) { return; }
							s = this._get_settings().types.types;
							t = this._get_type(data.args[0]);
							if(
								( 
									(s[t] && typeof s[t][data.func] !== "undefined") || 
									(s["default"] && typeof s["default"][data.func] !== "undefined") 
								) && this._check(data.func, data.args[0]) === false
							) {
								e.stopImmediatePropagation();
								return false;
							}
						}
					}, this));
			if(is_ie6) {
				this.get_container()
					.bind("load_node.jstree set_type.jstree", $.proxy(function (e, data) {
							var r = data && data.rslt && data.rslt.obj && data.rslt.obj !== -1 ? this._get_node(data.rslt.obj).parent() : this.get_container_ul(),
								c = false,
								s = this._get_settings().types;
							$.each(s.types, function (i, tp) {
								if(tp.icon && (tp.icon.image || tp.icon.position)) {
									c = i === "default" ? r.find("li > a > .jstree-icon") : r.find("li[" + s.type_attr + "='" + i + "'] > a > .jstree-icon");
									if(tp.icon.image) { c.css("backgroundImage","url(" + tp.icon.image + ")"); }
									c.css("backgroundPosition", tp.icon.position || "0 0");
								}
							});
						}, this));
			}
		},
		defaults : {
			// defines maximum number of root nodes (-1 means unlimited, -2 means disable max_children checking)
			max_children		: -1,
			// defines the maximum depth of the tree (-1 means unlimited, -2 means disable max_depth checking)
			max_depth			: -1,
			// defines valid node types for the root nodes
			valid_children		: "all",

			// whether to use $.data
			use_data : false, 
			// where is the type stores (the rel attribute of the LI element)
			type_attr : "rel",
			// a list of types
			types : {
				// the default type
				"default" : {
					"max_children"	: -1,
					"max_depth"		: -1,
					"valid_children": "all"

					// Bound functions - you can bind any other function here (using boolean or function)
					//"select_node"	: true
				}
			}
		},
		_fn : {
			_types_notify : function (n, data) {
				if(data.type && this._get_settings().types.use_data) {
					this.set_type(data.type, n);
				}
			},
			_get_type : function (obj) {
				obj = this._get_node(obj);
				return (!obj || !obj.length) ? false : obj.attr(this._get_settings().types.type_attr) || "default";
			},
			set_type : function (str, obj) {
				obj = this._get_node(obj);
				var ret = (!obj.length || !str) ? false : obj.attr(this._get_settings().types.type_attr, str);
				if(ret) { this.__callback({ obj : obj, type : str}); }
				return ret;
			},
			_check : function (rule, obj, opts) {
				obj = this._get_node(obj);
				var v = false, t = this._get_type(obj), d = 0, _this = this, s = this._get_settings().types, data = false;
				if(obj === -1) { 
					if(!!s[rule]) { v = s[rule]; }
					else { return; }
				}
				else {
					if(t === false) { return; }
					data = s.use_data ? obj.data("jstree") : false;
					if(data && data.types && typeof data.types[rule] !== "undefined") { v = data.types[rule]; }
					else if(!!s.types[t] && typeof s.types[t][rule] !== "undefined") { v = s.types[t][rule]; }
					else if(!!s.types["default"] && typeof s.types["default"][rule] !== "undefined") { v = s.types["default"][rule]; }
				}
				if($.isFunction(v)) { v = v.call(this, obj); }
				if(rule === "max_depth" && obj !== -1 && opts !== false && s.max_depth !== -2 && v !== 0) {
					// also include the node itself - otherwise if root node it is not checked
					obj.children("a:eq(0)").parentsUntil(".jstree","li").each(function (i) {
						// check if current depth already exceeds global tree depth
						if(s.max_depth !== -1 && s.max_depth - (i + 1) <= 0) { v = 0; return false; }
						d = (i === 0) ? v : _this._check(rule, this, false);
						// check if current node max depth is already matched or exceeded
						if(d !== -1 && d - (i + 1) <= 0) { v = 0; return false; }
						// otherwise - set the max depth to the current value minus current depth
						if(d >= 0 && (d - (i + 1) < v || v < 0) ) { v = d - (i + 1); }
						// if the global tree depth exists and it minus the nodes calculated so far is less than `v` or `v` is unlimited
						if(s.max_depth >= 0 && (s.max_depth - (i + 1) < v || v < 0) ) { v = s.max_depth - (i + 1); }
					});
				}
				return v;
			},
			check_move : function () {
				if(!this.__call_old()) { return false; }
				var m  = this._get_move(),
					s  = m.rt._get_settings().types,
					mc = m.rt._check("max_children", m.cr),
					md = m.rt._check("max_depth", m.cr),
					vc = m.rt._check("valid_children", m.cr),
					ch = 0, d = 1, t;

				if(vc === "none") { return false; } 
				if($.isArray(vc) && m.ot && m.ot._get_type) {
					m.o.each(function () {
						if($.inArray(m.ot._get_type(this), vc) === -1) { d = false; return false; }
					});
					if(d === false) { return false; }
				}
				if(s.max_children !== -2 && mc !== -1) {
					ch = m.cr === -1 ? this.get_container().find("> ul > li").not(m.o).length : m.cr.find("> ul > li").not(m.o).length;
					if(ch + m.o.length > mc) { return false; }
				}
				if(s.max_depth !== -2 && md !== -1) {
					d = 0;
					if(md === 0) { return false; }
					if(typeof m.o.d === "undefined") {
						// TODO: deal with progressive rendering and async when checking max_depth (how to know the depth of the moved node)
						t = m.o;
						while(t.length > 0) {
							t = t.find("> ul > li");
							d ++;
						}
						m.o.d = d;
					}
					if(md - m.o.d < 0) { return false; }
				}
				return true;
			},
			create_node : function (obj, position, js, callback, is_loaded, skip_check) {
				if(!skip_check && (is_loaded || this._is_loaded(obj))) {
					var p  = (typeof position == "string" && position.match(/^before|after$/i) && obj !== -1) ? this._get_parent(obj) : this._get_node(obj),
						s  = this._get_settings().types,
						mc = this._check("max_children", p),
						md = this._check("max_depth", p),
						vc = this._check("valid_children", p),
						ch;
					if(typeof js === "string") { js = { data : js }; }
					if(!js) { js = {}; }
					if(vc === "none") { return false; } 
					if($.isArray(vc)) {
						if(!js.attr || !js.attr[s.type_attr]) { 
							if(!js.attr) { js.attr = {}; }
							js.attr[s.type_attr] = vc[0]; 
						}
						else {
							if($.inArray(js.attr[s.type_attr], vc) === -1) { return false; }
						}
					}
					if(s.max_children !== -2 && mc !== -1) {
						ch = p === -1 ? this.get_container().find("> ul > li").length : p.find("> ul > li").length;
						if(ch + 1 > mc) { return false; }
					}
					if(s.max_depth !== -2 && md !== -1 && (md - 1) < 0) { return false; }
				}
				return this.__call_old(true, obj, position, js, callback, is_loaded, skip_check);
			}
		}
	});
})(jQuery);
//*/

/* 
 * jsTree HTML plugin
 * The HTML data store. Datastores are build by replacing the `load_node` and `_is_loaded` functions.
 */
(function ($) {
	$.jstree.plugin("html_data", {
		__init : function () { 
			// this used to use html() and clean the whitespace, but this way any attached data was lost
			this.data.html_data.original_container_html = this.get_container().find(" > ul > li").clone(true);
			// remove white space from LI node - otherwise nodes appear a bit to the right
			this.data.html_data.original_container_html.find("li").andSelf().contents().filter(function() { return this.nodeType == 3; }).remove();
		},
		defaults : { 
			data : false,
			ajax : false,
			correct_state : true
		},
		_fn : {
			load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_html(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
			_is_loaded : function (obj) { 
				obj = this._get_node(obj); 
				return obj == -1 || !obj || (!this._get_settings().html_data.ajax && !$.isFunction(this._get_settings().html_data.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").size() > 0;
			},
			load_node_html : function (obj, s_call, e_call) {
				var d,
					s = this.get_settings().html_data,
					error_func = function () {},
					success_func = function () {};
				obj = this._get_node(obj);
				if(obj && obj !== -1) {
					if(obj.data("jstree_is_loading")) { return; }
					else { obj.data("jstree_is_loading",true); }
				}
				switch(!0) {
					case ($.isFunction(s.data)):
						s.data.call(this, obj, $.proxy(function (d) {
							if(d && d !== "" && d.toString && d.toString().replace(/^[\s\n]+$/,"") !== "") {
								d = $(d);
								if(!d.is("ul")) { d = $("<ul />").append(d); }
								if(obj == -1 || !obj) { this.get_container().children("ul").empty().append(d.children()).find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); }
								else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d).children("ul").find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
							else {
								if(obj && obj !== -1) {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { 
										this.correct_state(obj);
										if(s_call) { s_call.call(this); } 
									}
								}
								else {
									if(s.correct_state) { 
										this.get_container().children("ul").empty();
										if(s_call) { s_call.call(this); } 
									}
								}
							}
						}, this));
						break;
					case (!s.data && !s.ajax):
						if(!obj || obj == -1) {
							this.get_container()
								.children("ul").empty()
								.append(this.data.html_data.original_container_html)
								.find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end()
								.filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon");
							this.clean_node();
						}
						if(s_call) { s_call.call(this); }
						break;
					case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
						if(!obj || obj == -1) {
							d = $(s.data);
							if(!d.is("ul")) { d = $("<ul />").append(d); }
							this.get_container()
								.children("ul").empty().append(d.children())
								.find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end()
								.filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon");
							this.clean_node();
						}
						if(s_call) { s_call.call(this); }
						break;
					case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
						obj = this._get_node(obj);
						error_func = function (x, t, e) {
							var ef = this.get_settings().html_data.ajax.error; 
							if(ef) { ef.call(this, x, t, e); }
							if(obj != -1 && obj.length) {
								obj.children("a.jstree-loading").removeClass("jstree-loading");
								obj.removeData("jstree_is_loading");
								if(t === "success" && s.correct_state) { this.correct_state(obj); }
							}
							else {
								if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
							}
							if(e_call) { e_call.call(this); }
						};
						success_func = function (d, t, x) {
							var sf = this.get_settings().html_data.ajax.success; 
							if(sf) { d = sf.call(this,d,t,x) || d; }
							if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "")) {
								return error_func.call(this, x, t, "");
							}
							if(d) {
								d = $(d);
								if(!d.is("ul")) { d = $("<ul />").append(d); }
								if(obj == -1 || !obj) { this.get_container().children("ul").empty().append(d.children()).find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); }
								else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d).children("ul").find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); obj.removeData("jstree_is_loading"); }
								this.clean_node(obj);
								if(s_call) { s_call.call(this); }
							}
							else {
								if(obj && obj !== -1) {
									obj.children("a.jstree-loading").removeClass("jstree-loading");
									obj.removeData("jstree_is_loading");
									if(s.correct_state) { 
										this.correct_state(obj);
										if(s_call) { s_call.call(this); } 
									}
								}
								else {
									if(s.correct_state) { 
										this.get_container().children("ul").empty();
										if(s_call) { s_call.call(this); } 
									}
								}
							}
						};
						s.ajax.context = this;
						s.ajax.error = error_func;
						s.ajax.success = success_func;
						if(!s.ajax.dataType) { s.ajax.dataType = "html"; }
						if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
						if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
						$.ajax(s.ajax);
						break;
				}
			}
		}
	});
	// include the HTML data plugin by default
	$.jstree.defaults.plugins.push("html_data");
})(jQuery);
//*/

/* 
 * jsTree themeroller plugin
 * Adds support for jQuery UI themes. Include this at the end of your plugins list, also make sure "themes" is not included.
 */
(function ($) {
	$.jstree.plugin("themeroller", {
		__init : function () {
			var s = this._get_settings().themeroller;
			this.get_container()
				.addClass("ui-widget-content")
				.addClass("jstree-themeroller")
				.delegate("a","mouseenter.jstree", function (e) {
					if(!$(e.currentTarget).hasClass("jstree-loading")) {
						$(this).addClass(s.item_h);
					}
				})
				.delegate("a","mouseleave.jstree", function () {
					$(this).removeClass(s.item_h);
				})
				.bind("init.jstree", $.proxy(function (e, data) { 
						data.inst.get_container().find("> ul > li > .jstree-loading > ins").addClass("ui-icon-refresh");
						this._themeroller(data.inst.get_container().find("> ul > li"));
					}, this))
				.bind("open_node.jstree create_node.jstree", $.proxy(function (e, data) { 
						this._themeroller(data.rslt.obj);
					}, this))
				.bind("loaded.jstree refresh.jstree", $.proxy(function (e) {
						this._themeroller();
					}, this))
				.bind("close_node.jstree", $.proxy(function (e, data) {
						this._themeroller(data.rslt.obj);
					}, this))
				.bind("delete_node.jstree", $.proxy(function (e, data) {
						this._themeroller(data.rslt.parent);
					}, this))
				.bind("correct_state.jstree", $.proxy(function (e, data) {
						data.rslt.obj
							.children("ins.jstree-icon").removeClass(s.opened + " " + s.closed + " ui-icon").end()
							.find("> a > ins.ui-icon")
								.filter(function() { 
									return this.className.toString()
										.replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
										.indexOf("ui-icon-") === -1; 
								}).removeClass(s.item_open + " " + s.item_clsd).addClass(s.item_leaf || "jstree-no-icon");
					}, this))
				.bind("select_node.jstree", $.proxy(function (e, data) {
						data.rslt.obj.children("a").addClass(s.item_a);
					}, this))
				.bind("deselect_node.jstree deselect_all.jstree", $.proxy(function (e, data) {
						this.get_container()
							.find("a." + s.item_a).removeClass(s.item_a).end()
							.find("a.jstree-clicked").addClass(s.item_a);
					}, this))
				.bind("dehover_node.jstree", $.proxy(function (e, data) {
						data.rslt.obj.children("a").removeClass(s.item_h);
					}, this))
				.bind("hover_node.jstree", $.proxy(function (e, data) {
						this.get_container()
							.find("a." + s.item_h).not(data.rslt.obj).removeClass(s.item_h);
						data.rslt.obj.children("a").addClass(s.item_h);
					}, this))
				.bind("move_node.jstree", $.proxy(function (e, data) {
						this._themeroller(data.rslt.o);
						this._themeroller(data.rslt.op);
					}, this));
		},
		__destroy : function () {
			var s = this._get_settings().themeroller,
				c = [ "ui-icon" ];
			$.each(s, function (i, v) {
				v = v.split(" ");
				if(v.length) { c = c.concat(v); }
			});
			this.get_container()
				.removeClass("ui-widget-content")
				.find("." + c.join(", .")).removeClass(c.join(" "));
		},
		_fn : {
			_themeroller : function (obj) {
				var s = this._get_settings().themeroller;
				obj = !obj || obj == -1 ? this.get_container_ul() : this._get_node(obj).parent();
				obj
					.find("li.jstree-closed")
						.children("ins.jstree-icon").removeClass(s.opened).addClass("ui-icon " + s.closed).end()
						.children("a").addClass(s.item)
							.children("ins.jstree-icon").addClass("ui-icon")
								.filter(function() { 
									return this.className.toString()
										.replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
										.indexOf("ui-icon-") === -1; 
								}).removeClass(s.item_leaf + " " + s.item_open).addClass(s.item_clsd || "jstree-no-icon")
								.end()
							.end()
						.end()
					.end()
					.find("li.jstree-open")
						.children("ins.jstree-icon").removeClass(s.closed).addClass("ui-icon " + s.opened).end()
						.children("a").addClass(s.item)
							.children("ins.jstree-icon").addClass("ui-icon")
								.filter(function() { 
									return this.className.toString()
										.replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
										.indexOf("ui-icon-") === -1; 
								}).removeClass(s.item_leaf + " " + s.item_clsd).addClass(s.item_open || "jstree-no-icon")
								.end()
							.end()
						.end()
					.end()
					.find("li.jstree-leaf")
						.children("ins.jstree-icon").removeClass(s.closed + " ui-icon " + s.opened).end()
						.children("a").addClass(s.item)
							.children("ins.jstree-icon").addClass("ui-icon")
								.filter(function() { 
									return this.className.toString()
										.replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
										.indexOf("ui-icon-") === -1; 
								}).removeClass(s.item_clsd + " " + s.item_open).addClass(s.item_leaf || "jstree-no-icon");
			}
		},
		defaults : {
			"opened"	: "ui-icon-triangle-1-se",
			"closed"	: "ui-icon-triangle-1-e",
			"item"		: "ui-state-default",
			"item_h"	: "ui-state-hover",
			"item_a"	: "ui-state-active",
			"item_open"	: "ui-icon-folder-open",
			"item_clsd"	: "ui-icon-folder-collapsed",
			"item_leaf"	: "ui-icon-document"
		}
	});
	$(function() {
		var css_string = '' + 
			'.jstree-themeroller .ui-icon { overflow:visible; } ' + 
			'.jstree-themeroller a { padding:0 2px; } ' + 
			'.jstree-themeroller .jstree-no-icon { display:none; }';
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});
})(jQuery);
//*/

/* 
 * jsTree unique plugin
 * Forces different names amongst siblings (still a bit experimental)
 * NOTE: does not check language versions (it will not be possible to have nodes with the same title, even in different languages)
 */
(function ($) {
	$.jstree.plugin("unique", {
		__init : function () {
			this.get_container()
				.bind("before.jstree", $.proxy(function (e, data) { 
						var nms = [], res = true, p, t;
						if(data.func == "move_node") {
							// obj, ref, position, is_copy, is_prepared, skip_check
							if(data.args[4] === true) {
								if(data.args[0].o && data.args[0].o.length) {
									data.args[0].o.children("a").each(function () { nms.push($(this).text().replace(/^\s+/g,"")); });
									res = this._check_unique(nms, data.args[0].np.find("> ul > li").not(data.args[0].o), "move_node");
								}
							}
						}
						if(data.func == "create_node") {
							// obj, position, js, callback, is_loaded
							if(data.args[4] || this._is_loaded(data.args[0])) {
								p = this._get_node(data.args[0]);
								if(data.args[1] && (data.args[1] === "before" || data.args[1] === "after")) {
									p = this._get_parent(data.args[0]);
									if(!p || p === -1) { p = this.get_container(); }
								}
								if(typeof data.args[2] === "string") { nms.push(data.args[2]); }
								else if(!data.args[2] || !data.args[2].data) { nms.push(this._get_string("new_node")); }
								else { nms.push(data.args[2].data); }
								res = this._check_unique(nms, p.find("> ul > li"), "create_node");
							}
						}
						if(data.func == "rename_node") {
							// obj, val
							nms.push(data.args[1]);
							t = this._get_node(data.args[0]);
							p = this._get_parent(t);
							if(!p || p === -1) { p = this.get_container(); }
							res = this._check_unique(nms, p.find("> ul > li").not(t), "rename_node");
						}
						if(!res) {
							e.stopPropagation();
							return false;
						}
					}, this));
		},
		defaults : { 
			error_callback : $.noop
		},
		_fn : { 
			_check_unique : function (nms, p, func) {
				var cnms = [];
				p.children("a").each(function () { cnms.push($(this).text().replace(/^\s+/g,"")); });
				if(!cnms.length || !nms.length) { return true; }
				cnms = cnms.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");
				if((cnms.length + nms.length) != cnms.concat(nms).sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",").length) {
					this._get_settings().unique.error_callback.call(null, nms, p, func);
					return false;
				}
				return true;
			},
			check_move : function () {
				if(!this.__call_old()) { return false; }
				var p = this._get_move(), nms = [];
				if(p.o && p.o.length) {
					p.o.children("a").each(function () { nms.push($(this).text().replace(/^\s+/g,"")); });
					return this._check_unique(nms, p.np.find("> ul > li").not(p.o), "check_move");
				}
				return true;
			}
		}
	});
})(jQuery);
//*/

/*
 * jsTree wholerow plugin
 * Makes select and hover work on the entire width of the node
 * MAY BE HEAVY IN LARGE DOM
 */
(function ($) {
	$.jstree.plugin("wholerow", {
		__init : function () {
			if(!this.data.ui) { throw "jsTree wholerow: jsTree UI plugin not included."; }
			this.data.wholerow.html = false;
			this.data.wholerow.to = false;
			this.get_container()
				.bind("init.jstree", $.proxy(function (e, data) { 
						this._get_settings().core.animation = 0;
					}, this))
				.bind("open_node.jstree create_node.jstree clean_node.jstree loaded.jstree", $.proxy(function (e, data) { 
						this._prepare_wholerow_span( data && data.rslt && data.rslt.obj ? data.rslt.obj : -1 );
					}, this))
				.bind("search.jstree clear_search.jstree reopen.jstree after_open.jstree after_close.jstree create_node.jstree delete_node.jstree clean_node.jstree", $.proxy(function (e, data) { 
						if(this.data.to) { clearTimeout(this.data.to); }
						this.data.to = setTimeout( (function (t, o) { return function() { t._prepare_wholerow_ul(o); }; })(this,  data && data.rslt && data.rslt.obj ? data.rslt.obj : -1), 0);
					}, this))
				.bind("deselect_all.jstree", $.proxy(function (e, data) { 
						this.get_container().find(" > .jstree-wholerow .jstree-clicked").removeClass("jstree-clicked " + (this.data.themeroller ? this._get_settings().themeroller.item_a : "" ));
					}, this))
				.bind("select_node.jstree deselect_node.jstree ", $.proxy(function (e, data) { 
						data.rslt.obj.each(function () { 
							var ref = data.inst.get_container().find(" > .jstree-wholerow li:visible:eq(" + ( parseInt((($(this).offset().top - data.inst.get_container().offset().top + data.inst.get_container()[0].scrollTop) / data.inst.data.core.li_height),10)) + ")");
							// ref.children("a")[e.type === "select_node" ? "addClass" : "removeClass"]("jstree-clicked");
							ref.children("a").attr("class",data.rslt.obj.children("a").attr("class"));
						});
					}, this))
				.bind("hover_node.jstree dehover_node.jstree", $.proxy(function (e, data) { 
						this.get_container().find(" > .jstree-wholerow .jstree-hovered").removeClass("jstree-hovered " + (this.data.themeroller ? this._get_settings().themeroller.item_h : "" ));
						if(e.type === "hover_node") {
							var ref = this.get_container().find(" > .jstree-wholerow li:visible:eq(" + ( parseInt(((data.rslt.obj.offset().top - this.get_container().offset().top + this.get_container()[0].scrollTop) / this.data.core.li_height),10)) + ")");
							// ref.children("a").addClass("jstree-hovered");
							ref.children("a").attr("class",data.rslt.obj.children(".jstree-hovered").attr("class"));
						}
					}, this))
				.delegate(".jstree-wholerow-span, ins.jstree-icon, li", "click.jstree", function (e) {
						var n = $(e.currentTarget);
						if(e.target.tagName === "A" || (e.target.tagName === "INS" && n.closest("li").is(".jstree-open, .jstree-closed"))) { return; }
						n.closest("li").children("a:visible:eq(0)").click();
						e.stopImmediatePropagation();
					})
				.delegate("li", "mouseover.jstree", $.proxy(function (e) {
						e.stopImmediatePropagation();
						if($(e.currentTarget).children(".jstree-hovered, .jstree-clicked").length) { return false; }
						this.hover_node(e.currentTarget);
						return false;
					}, this))
				.delegate("li", "mouseleave.jstree", $.proxy(function (e) {
						if($(e.currentTarget).children("a").hasClass("jstree-hovered").length) { return; }
						this.dehover_node(e.currentTarget);
					}, this));
			if(is_ie7 || is_ie6) {
				$.vakata.css.add_sheet({ str : ".jstree-" + this.get_index() + " { position:relative; } ", title : "jstree" });
			}
		},
		defaults : {
		},
		__destroy : function () {
			this.get_container().children(".jstree-wholerow").remove();
			this.get_container().find(".jstree-wholerow-span").remove();
		},
		_fn : {
			_prepare_wholerow_span : function (obj) {
				obj = !obj || obj == -1 ? this.get_container().find("> ul > li") : this._get_node(obj);
				if(obj === false) { return; } // added for removing root nodes
				obj.each(function () {
					$(this).find("li").andSelf().each(function () {
						var $t = $(this);
						if($t.children(".jstree-wholerow-span").length) { return true; }
						$t.prepend("<span class='jstree-wholerow-span' style='width:" + ($t.parentsUntil(".jstree","li").length * 18) + "px;'>&#160;</span>");
					});
				});
			},
			_prepare_wholerow_ul : function () {
				var o = this.get_container().children("ul").eq(0), h = o.html();
				o.addClass("jstree-wholerow-real");
				if(this.data.wholerow.last_html !== h) {
					this.data.wholerow.last_html = h;
					this.get_container().children(".jstree-wholerow").remove();
					this.get_container().append(
						o.clone().removeClass("jstree-wholerow-real")
							.wrapAll("<div class='jstree-wholerow' />").parent()
							.width(o.parent()[0].scrollWidth)
							.css("top", (o.height() + ( is_ie7 ? 5 : 0)) * -1 )
							.find("li[id]").each(function () { this.removeAttribute("id"); }).end()
					);
				}
			}
		}
	});
	$(function() {
		var css_string = '' + 
			'.jstree .jstree-wholerow-real { position:relative; z-index:1; } ' + 
			'.jstree .jstree-wholerow-real li { cursor:pointer; } ' + 
			'.jstree .jstree-wholerow-real a { border-left-color:transparent !important; border-right-color:transparent !important; } ' + 
			'.jstree .jstree-wholerow { position:relative; z-index:0; height:0; } ' + 
			'.jstree .jstree-wholerow ul, .jstree .jstree-wholerow li { width:100%; } ' + 
			'.jstree .jstree-wholerow, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li, .jstree .jstree-wholerow a { margin:0 !important; padding:0 !important; } ' + 
			'.jstree .jstree-wholerow, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li { background:transparent !important; }' + 
			'.jstree .jstree-wholerow ins, .jstree .jstree-wholerow span, .jstree .jstree-wholerow input { display:none !important; }' + 
			'.jstree .jstree-wholerow a, .jstree .jstree-wholerow a:hover { text-indent:-9999px; !important; width:100%; padding:0 !important; border-right-width:0px !important; border-left-width:0px !important; } ' + 
			'.jstree .jstree-wholerow-span { position:absolute; left:0; margin:0px; padding:0; height:18px; border-width:0; padding:0; z-index:0; }';
		if(is_ff2) {
			css_string += '' + 
				'.jstree .jstree-wholerow a { display:block; height:18px; margin:0; padding:0; border:0; } ' + 
				'.jstree .jstree-wholerow-real a { border-color:transparent !important; } ';
		}
		if(is_ie7 || is_ie6) {
			css_string += '' + 
				'.jstree .jstree-wholerow, .jstree .jstree-wholerow li, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow a { margin:0; padding:0; line-height:18px; } ' + 
				'.jstree .jstree-wholerow a { display:block; height:18px; line-height:18px; overflow:hidden; } ';
		}
		$.vakata.css.add_sheet({ str : css_string, title : "jstree" });
	});
})(jQuery);
//*/

/*
* jsTree model plugin
* This plugin gets jstree to use a class model to retrieve data, creating great dynamism
*/
(function ($) {
	var nodeInterface = ["getChildren","getChildrenCount","getAttr","getName","getProps"],
		validateInterface = function(obj, inter) {
			var valid = true;
			obj = obj || {};
			inter = [].concat(inter);
			$.each(inter, function (i, v) {
				if(!$.isFunction(obj[v])) { valid = false; return false; }
			});
			return valid;
		};
	$.jstree.plugin("model", {
		__init : function () {
			if(!this.data.json_data) { throw "jsTree model: jsTree json_data plugin not included."; }
			this._get_settings().json_data.data = function (n, b) {
				var obj = (n == -1) ? this._get_settings().model.object : n.data("jstree_model");
				if(!validateInterface(obj, nodeInterface)) { return b.call(null, false); }
				if(this._get_settings().model.async) {
					obj.getChildren($.proxy(function (data) {
						this.model_done(data, b);
					}, this));
				}
				else {
					this.model_done(obj.getChildren(), b);
				}
			};
		},
		defaults : {
			object : false,
			id_prefix : false,
			async : false
		},
		_fn : {
			model_done : function (data, callback) {
				var ret = [], 
					s = this._get_settings(),
					_this = this;

				if(!$.isArray(data)) { data = [data]; }
				$.each(data, function (i, nd) {
					var r = nd.getProps() || {};
					r.attr = nd.getAttr() || {};
					if(nd.getChildrenCount()) { r.state = "closed"; }
					r.data = nd.getName();
					if(!$.isArray(r.data)) { r.data = [r.data]; }
					if(_this.data.types && $.isFunction(nd.getType)) {
						r.attr[s.types.type_attr] = nd.getType();
					}
					if(r.attr.id && s.model.id_prefix) { r.attr.id = s.model.id_prefix + r.attr.id; }
					if(!r.metadata) { r.metadata = { }; }
					r.metadata.jstree_model = nd;
					ret.push(r);
				});
				callback.call(null, ret);
			}
		}
	});
})(jQuery);
//*/

})();;
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};;
/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

/*
 * One small change is: now keys are passed by object { keys: '...' }
 * Might be useful, when you want to pass some other data to your handler
 */

(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 10: "return", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 186: ";", 191: "/",
			220: "\\", 222: "'", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		if ( typeof handleObj.data === "string" ) {
			handleObj.data = { keys: handleObj.data };
		}

		// Only care when a possible input has been specified
		if ( !handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string" ) {
			return;
		}

		var origHandler = handleObj.handler,
			keys = handleObj.data.keys.toLowerCase().split(" "),
			textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color", "tel"];
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1 ) ) {
				return;
			}

			var special = jQuery.hotkeys.specialKeys[ event.keyCode ],
				// character codes are available only in keypress
				character = String.fromCharCode( event.which ).toLowerCase(),
				modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;
			}

			if ( character ) {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( this.jQuery );;
/*
 * jsTree storage plugin
 * Stores the currently opened/selected nodes in a dayside.storage and then restores them
 */
(function ($) {
	$.jstree.plugin("storage", {
		__init : function () {
			var s = this._get_settings().storage,
				tmp;
			if(!!s.save_loaded) {
				tmp = dayside.storage.get(s.save_loaded);
				if(tmp && tmp.length) { this.data.core.to_load = tmp.split(","); }
			}
			if(!!s.save_opened) {
				tmp = dayside.storage.get(s.save_opened);
				if(tmp && tmp.length) { this.data.core.to_open = tmp.split(","); }
			}
			if(!!s.save_selected) {
				tmp = dayside.storage.get(s.save_selected);
				if(tmp && tmp.length && this.data.ui) { this.data.ui.to_select = tmp.split(","); }
			}
			this.get_container()
				.one( ( this.data.ui ? "reselect" : "reopen" ) + ".jstree", $.proxy(function () {
					this.get_container()
						.bind("open_node.jstree close_node.jstree select_node.jstree deselect_node.jstree", $.proxy(function (e) { 
								if(this._get_settings().storage.auto_save) { this.save_storage((e.handleObj.namespace + e.handleObj.type).replace("jstree","")); }
							}, this));
				}, this));
		},
		defaults : {
			save_loaded		: "jstree_load_"+location.href,
			save_opened		: "jstree_open_"+location.href,
			save_selected	: "jstree_select_"+location.href,
			auto_save		: true
		},
		_fn : {
			save_storage : function (c) {
				if(this.data.core.refreshing) { return; }
				var s = this._get_settings().storage;
				if(!c) { // if called manually and not by event
					if(s.save_loaded) {
						this.save_loaded();
						dayside.storage.set(s.save_loaded, this.data.core.to_load.join(","));
					}
					if(s.save_opened) {
						this.save_opened();
						dayside.storage.set(s.save_opened, this.data.core.to_open.join(","));
					}
					if(s.save_selected && this.data.ui) {
						this.save_selected();
						dayside.storage.set(s.save_selected, this.data.ui.to_select.join(","));
					}
					return;
				}
				switch(c) {
					case "open_node":
					case "close_node":
						if(!!s.save_opened) { 
							this.save_opened(); 
							dayside.storage.set(s.save_opened, this.data.core.to_open.join(",")); 
						}
						if(!!s.save_loaded) { 
							this.save_loaded(); 
							dayside.storage.set(s.save_loaded, this.data.core.to_load.join(",")); 
						}
						break;
					case "select_node":
					case "deselect_node":
						if(!!s.save_selected && this.data.ui) { 
							this.save_selected(); 
							dayside.storage.set(s.save_selected, this.data.ui.to_select.join(",")); 
						}
						break;
				}
			}
		}
	});
})(jQuery);
//*/;
(function(){
    var cache = {
        files: {},
        modules: {},
        defined: {}
    };
    
    function path_string(path) {
        return "'"+path.replace(/\\?("|')/g,'\\$1')+"'";
    }
    
    var extensions = {
        js: {
            pre: function (path,callback,async) {
                if (cache.files[path]) return callback();
                getFile(path,function(text){
                    if (text===false) {
                        throw "Could not load module on path "+path;
                        callback(false);
                        return;
                    }
                    var m,r = /require\(\s*('|")(.*?)('|")\s*\)/g;
                    var deps = {}, count = 0;
                    
                    while (m=r.exec(text)) {
                        if (m[1]==m[3]) {
                            deps[resolve(m[2],path)] = 1;
                            count++;
                        }
                    }

                    var loaded = 0;
                    for (var key in deps) {
                        extensions.js.pre(key,function(){
                            loaded++;
                            if (loaded==count) callback(text);
                        },async);
                    }
                    if (count==0) callback(text);
                },async);
            },
            wrap: function (path) {
                var js = "";
                js += "(function(path){";
                js += "var require = window.require.factory(path);";
                js += "var module = { exports: false };";
                js += "var exports = {};\n";
                
                js += cache.files[path];
                
                js += "\n"+"return module.exports || exports;";
                js += "})";
                return js;
            },
            get: function (path,callback) {
                var path_s = path_string(path);
                var js = this.wrap(path);
                js += "("+path_s+");//# sourceURL="+path;
                
                var res = eval(js);
                callback(res);
            },
            build: function (path,callback) {
                var path_s = path_string(path);
                var js = 'require.define('+path_s+','+this.wrap(path)+')\n';
                callback({js:js});
            }
        },
        css: {
            get: function (path,callback) {
                var head = document.getElementsByTagName("head")[0];
                var append = document.createElement("link");
                append.type = "text/css";
                append.rel = "stylesheet";
                append.href = path;
                head.appendChild(append);
                callback(true);
            },
            build: function (path,callback) {
                var path_s = path_string(path);
                var js = 'require.define('+path_s+',true)\n';
                
                getFile(path,function(text){
                    callback({js:js,css:text});
                },true);
            }
        },
        tea: {
            get: function (path,callback,async) {
                if (!async) throw "Can't load tea file synchronously";
                teacss.process(
                    path,
                    function(){
                        teacss.tea.Style.insert(document);
                        teacss.tea.Script.insert(document,callback);
                    },
                    document
                );
            }
        }
    }
    
    function build() {
        var args = Array.prototype.slice.call(arguments);
        var callback = args[args.length-1];
        
        if (callback!==true && (!callback || !callback.call)) {
            args.push(callback=false);
        };
        
        var pathes = [];
        var loaded = 0;
        var result = {
            css: "",
            js: "var require_min = function(f){\n"
        };
        
        args[args.length-1] = function(){
            for (var path in cache.modules) {
                var mod = cache.modules[path];
                var ext = mod.ext;
                if (extensions[ext] && extensions[ext].build) {
                    pathes.push({ext:extensions[ext],path:path});
                }
            }
            
            for (var i=0;i<pathes.length;i++) {
                var one = pathes[i];
                one.ext.build(one.path,function(res){
                    if (res.css) result.css += res.css;
                    if (res.js) result.js += res.js;
                    done_cb();
                });
            }
        };
        
        function done_cb() {
            loaded++;
            if (loaded>=pathes.length && callback) {
                var out_path = [];
                for (var i=0;i<args.length;i++) {
                    var arg = args[i];
                    if (arg!==true && !arg.call) out_path.push(path_string(arg));
                }
                out_path.push('f || function(){}');
                
                result.js += 'require('+out_path.join(", ")+')\n';
                result.js += "}\n";
                setTimeout(function(){ callback(result); },1);
                
            }
        }
        window.require.apply(window.required,args);
    }
    
    function define(path,f) {
        cache.files[path] = "defined";
        cache.defined[path] = f;
        return f;
    }
    
    function resolve(what,base) {
        var root = require.root.replace(/\/$/,'');
        if (/^\.{1,2}\//.test(what)) {
            if (base===undefined) base = require.base;
            if (base===undefined) base = require.root;
            
            var path = base.split("/");
            path.pop(); 
            path.push(what);
            path = path.join("/");
        } 
        else if (what[0]=='/' || /^http/.test(what)) {
            path = what;
        }
        else {
            path = require.root + "/" + what;
        }
        
        var a = document.createElement('a');
        a.href = path;
        return a.href;
    }
        
    function getFile(path,callback,async) {
        if (cache.files[path]) {
            callback(cache.files[path]);
            return;
        }
        var xhr = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : (XMLHttpRequest && new XMLHttpRequest()) || null;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var text = cache.files[path] = xhr.status==200 ? xhr.responseText:false;
                callback(text);
            }
        }
        xhr.open('GET', path, async);
        xhr.send();
    }
        
    var factory = function (base) {
        var r = function () {
            var old = window.require.base;
            window.require.base = base;
            
            var args = Array.prototype.slice.call(arguments);
            var last = args[args.length-1];
            var async = (last && (last.call || last===true)) ? args.pop() : false;
            
            var pathes = [];
            var exts = [];
            var loaded = 0;
            var result = [];
            
            for (var i=0;i<args.length;i++) {
                var path,ext;
                if (args[i].ext!==undefined) {
                    path = resolve(args[i].path);
                    ext = args[i].ext;
                } else {
                    path = resolve(args[i]);
                    ext = (path.match(/[^\\\/]\.([^.\\\/]+)$/) || [null]).pop();
                    if (!ext) {
                        path = path + ".js";
                        ext = "js";
                    }
                }
                pathes.push(path);
                exts.push(ext);
            }
            for (var i=0;i<pathes.length;i++) {
                var path = pathes[i];
                var ext = exts[i];
                if (cache.modules[path] || cache.defined[path]) { loaded_cb(); continue; }
                
                var pre = extensions[ext].pre;
                if (pre)
                    pre(path,loaded_cb,async);
                else
                    loaded_cb();
            }
            if (pathes.length==0) loaded_cb();
            
            function loaded_cb() {
                loaded++;
                if (loaded>=args.length) {
                    var got = 0;
                    function next() {
                        if (got<pathes.length) {
                            var path = pathes[got];
                            var ext = exts[got];
                            if (!cache.modules[path]) {
                                
                                function get_cb(res) {
                                    cache.modules[path] = {result:res,ext:ext};
                                    result.push(res);
                                    got++; next();
                                }
                                
                                var defined = cache.defined[path];
                                if (defined) {
                                    get_cb(defined.call ? defined(path) : defined);
                                } else {
                                    extensions[ext].get(path,get_cb,async);
                                }
                            } else {
                                result.push(cache.modules[path].result);
                                got++; next();
                            }
                        } else {
                            if (result.length==0) result = false;
                            else if (result.length==1) result = result[0];
                            if (async && async.call) async.call(this,result);
                            window.require.base = old;
                        }
                    }
                    next();
                }
            }
            return result;
        }
        r.path = base;
        r.dir = r.path ? r.path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') : r.path;
        r.define = define;
        return r;
    }
    
    if (!window.require) {
        window.require = factory();
        window.require.root = ".";
        window.require.extensions = extensions;
        window.require.factory = factory;
        window.require.cache = cache;
        window.require.getFile = getFile;
        window.require.build = build;
    }
})();;
/**
 * mOxie - multi-runtime File API & XMLHttpRequest L2 Polyfill
 * v1.2.0
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Date: 2014-01-16
 */
!function(e,t){"use strict";function n(e,t){for(var n,i=[],r=0;r<e.length;++r){if(n=s[e[r]]||o(e[r]),!n)throw"module definition dependecy not found: "+e[r];i.push(n)}t.apply(null,i)}function i(e,i,r){if("string"!=typeof e)throw"invalid module definition, module id must be defined and be a string";if(i===t)throw"invalid module definition, dependencies must be specified";if(r===t)throw"invalid module definition, definition function must be specified";n(i,function(){s[e]=r.apply(null,arguments)})}function r(e){return!!s[e]}function o(t){for(var n=e,i=t.split(/[.\/]/),r=0;r<i.length;++r){if(!n[i[r]])return;n=n[i[r]]}return n}function a(n){for(var i=0;i<n.length;i++){for(var r=e,o=n[i],a=o.split(/[.\/]/),u=0;u<a.length-1;++u)r[a[u]]===t&&(r[a[u]]={}),r=r[a[u]];r[a[a.length-1]]=s[o]}}var s={},u="moxie/core/utils/Basic",c="moxie/core/I18n",l="moxie/core/utils/Mime",d="moxie/core/utils/Env",f="moxie/core/utils/Dom",p="moxie/core/Exceptions",h="moxie/core/EventTarget",m="moxie/core/utils/Encode",g="moxie/runtime/Runtime",v="moxie/runtime/RuntimeClient",y="moxie/file/Blob",w="moxie/file/File",E="moxie/file/FileInput",_="moxie/file/FileDrop",x="moxie/runtime/RuntimeTarget",R="moxie/file/FileReader",b="moxie/core/utils/Url",T="moxie/file/FileReaderSync",S="moxie/xhr/FormData",A="moxie/xhr/XMLHttpRequest",O="moxie/runtime/Transporter",I="moxie/image/Image",D="moxie/runtime/html5/Runtime",N="moxie/runtime/html5/file/Blob",L="moxie/core/utils/Events",M="moxie/runtime/html5/file/FileInput",C="moxie/runtime/html5/file/FileDrop",F="moxie/runtime/html5/file/FileReader",H="moxie/runtime/html5/xhr/XMLHttpRequest",P="moxie/runtime/html5/utils/BinaryReader",k="moxie/runtime/html5/image/JPEGHeaders",U="moxie/runtime/html5/image/ExifParser",B="moxie/runtime/html5/image/JPEG",z="moxie/runtime/html5/image/PNG",G="moxie/runtime/html5/image/ImageInfo",q="moxie/runtime/html5/image/MegaPixel",X="moxie/runtime/html5/image/Image",j="moxie/runtime/flash/Runtime",V="moxie/runtime/flash/file/Blob",W="moxie/runtime/flash/file/FileInput",Y="moxie/runtime/flash/file/FileReader",$="moxie/runtime/flash/file/FileReaderSync",J="moxie/runtime/flash/xhr/XMLHttpRequest",Z="moxie/runtime/flash/runtime/Transporter",K="moxie/runtime/flash/image/Image",Q="moxie/runtime/silverlight/Runtime",et="moxie/runtime/silverlight/file/Blob",tt="moxie/runtime/silverlight/file/FileInput",nt="moxie/runtime/silverlight/file/FileDrop",it="moxie/runtime/silverlight/file/FileReader",rt="moxie/runtime/silverlight/file/FileReaderSync",ot="moxie/runtime/silverlight/xhr/XMLHttpRequest",at="moxie/runtime/silverlight/runtime/Transporter",st="moxie/runtime/silverlight/image/Image",ut="moxie/runtime/html4/Runtime",ct="moxie/runtime/html4/file/FileInput",lt="moxie/runtime/html4/file/FileReader",dt="moxie/runtime/html4/xhr/XMLHttpRequest",ft="moxie/runtime/html4/image/Image";i(u,[],function(){var e=function(e){var t;return e===t?"undefined":null===e?"null":e.nodeType?"node":{}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()},t=function(i){var r;return n(arguments,function(o,s){s>0&&n(o,function(n,o){n!==r&&(e(i[o])===e(n)&&~a(e(n),["array","object"])?t(i[o],n):i[o]=n)})}),i},n=function(e,t){var n,i,r,o;if(e){try{n=e.length}catch(a){n=o}if(n===o){for(i in e)if(e.hasOwnProperty(i)&&t(e[i],i)===!1)return}else for(r=0;n>r;r++)if(t(e[r],r)===!1)return}},i=function(t){var n;if(!t||"object"!==e(t))return!0;for(n in t)return!1;return!0},r=function(t,n){function i(r){"function"===e(t[r])&&t[r](function(e){++r<o&&!e?i(r):n(e)})}var r=0,o=t.length;"function"!==e(n)&&(n=function(){}),t&&t.length||n(),i(r)},o=function(e,t){var i=0,r=e.length,o=new Array(r);n(e,function(e,n){e(function(e){if(e)return t(e);var a=[].slice.call(arguments);a.shift(),o[n]=a,i++,i===r&&(o.unshift(null),t.apply(this,o))})})},a=function(e,t){if(t){if(Array.prototype.indexOf)return Array.prototype.indexOf.call(t,e);for(var n=0,i=t.length;i>n;n++)if(t[n]===e)return n}return-1},s=function(t,n){var i=[];"array"!==e(t)&&(t=[t]),"array"!==e(n)&&(n=[n]);for(var r in t)-1===a(t[r],n)&&i.push(t[r]);return i.length?i:!1},u=function(e,t){var i=[];return n(e,function(e){-1!==a(e,t)&&i.push(e)}),i.length?i:null},c=function(e){var t,n=[];for(t=0;t<e.length;t++)n[t]=e[t];return n},l=function(){var e=0;return function(t){var n=(new Date).getTime().toString(32),i;for(i=0;5>i;i++)n+=Math.floor(65535*Math.random()).toString(32);return(t||"o_")+n+(e++).toString(32)}}(),d=function(e){return e?String.prototype.trim?String.prototype.trim.call(e):e.toString().replace(/^\s*/,"").replace(/\s*$/,""):e},f=function(e){if("string"!=typeof e)return e;var t={t:1099511627776,g:1073741824,m:1048576,k:1024},n;return e=/^([0-9]+)([mgk]?)$/.exec(e.toLowerCase().replace(/[^0-9mkg]/g,"")),n=e[2],e=+e[1],t.hasOwnProperty(n)&&(e*=t[n]),e};return{guid:l,typeOf:e,extend:t,each:n,isEmptyObj:i,inSeries:r,inParallel:o,inArray:a,arrayDiff:s,arrayIntersect:u,toArray:c,trim:d,parseSizeStr:f}}),i(c,[u],function(e){var t={};return{addI18n:function(n){return e.extend(t,n)},translate:function(e){return t[e]||e},_:function(e){return this.translate(e)},sprintf:function(t){var n=[].slice.call(arguments,1);return t.replace(/%[a-z]/g,function(){var t=n.shift();return"undefined"!==e.typeOf(t)?t:""})}}}),i(l,[u,c],function(e,t){var n="application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mp3 mpga mpega mp2,audio/x-wav,wav,audio/x-m4a,m4a,audio/ogg,oga ogg,audio/aiff,aiff aif,audio/flac,flac,audio/aac,aac,audio/ac3,ac3,audio/x-ms-wma,wma,image/bmp,bmp,image/gif,gif,image/jpeg,jpg jpeg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gpp 3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,video/ogg,ogv,video/x-matroska,mkv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe",i={mimes:{},extensions:{},addMimeType:function(e){var t=e.split(/,/),n,i,r;for(n=0;n<t.length;n+=2){for(r=t[n+1].split(/ /),i=0;i<r.length;i++)this.mimes[r[i]]=t[n];this.extensions[t[n]]=r}},extList2mimes:function(t,n){var i=this,r,o,a,s,u=[];for(o=0;o<t.length;o++)for(r=t[o].extensions.split(/\s*,\s*/),a=0;a<r.length;a++){if("*"===r[a])return[];if(s=i.mimes[r[a]])-1===e.inArray(s,u)&&u.push(s);else{if(!n||!/^\w+$/.test(r[a]))return[];u.push("."+r[a])}}return u},mimes2exts:function(t){var n=this,i=[];return e.each(t,function(t){if("*"===t)return i=[],!1;var r=t.match(/^(\w+)\/(\*|\w+)$/);r&&("*"===r[2]?e.each(n.extensions,function(e,t){new RegExp("^"+r[1]+"/").test(t)&&[].push.apply(i,n.extensions[t])}):n.extensions[t]&&[].push.apply(i,n.extensions[t]))}),i},mimes2extList:function(n){var i=[],r=[];return"string"===e.typeOf(n)&&(n=e.trim(n).split(/\s*,\s*/)),r=this.mimes2exts(n),i.push({title:t.translate("Files"),extensions:r.length?r.join(","):"*"}),i.mimes=n,i},getFileExtension:function(e){var t=e&&e.match(/\.([^.]+)$/);return t?t[1].toLowerCase():""},getFileMime:function(e){return this.mimes[this.getFileExtension(e)]||""}};return i.addMimeType(n),i}),i(d,[u],function(e){function t(e,t,n){var i=0,r=0,o=0,a={dev:-6,alpha:-5,a:-5,beta:-4,b:-4,RC:-3,rc:-3,"#":-2,p:1,pl:1},s=function(e){return e=(""+e).replace(/[_\-+]/g,"."),e=e.replace(/([^.\d]+)/g,".$1.").replace(/\.{2,}/g,"."),e.length?e.split("."):[-8]},u=function(e){return e?isNaN(e)?a[e]||-7:parseInt(e,10):0};for(e=s(e),t=s(t),r=Math.max(e.length,t.length),i=0;r>i;i++)if(e[i]!=t[i]){if(e[i]=u(e[i]),t[i]=u(t[i]),e[i]<t[i]){o=-1;break}if(e[i]>t[i]){o=1;break}}if(!n)return o;switch(n){case">":case"gt":return o>0;case">=":case"ge":return o>=0;case"<=":case"le":return 0>=o;case"==":case"=":case"eq":return 0===o;case"<>":case"!=":case"ne":return 0!==o;case"":case"<":case"lt":return 0>o;default:return null}}var n=function(e){var t="",n="?",i="function",r="undefined",o="object",a="major",s="model",u="name",c="type",l="vendor",d="version",f="architecture",p="console",h="mobile",m="tablet",g={has:function(e,t){return-1!==t.toLowerCase().indexOf(e.toLowerCase())},lowerize:function(e){return e.toLowerCase()}},v={rgx:function(){for(var t,n=0,a,s,u,c,l,d,f=arguments;n<f.length;n+=2){var p=f[n],h=f[n+1];if(typeof t===r){t={};for(u in h)c=h[u],typeof c===o?t[c[0]]=e:t[c]=e}for(a=s=0;a<p.length;a++)if(l=p[a].exec(this.getUA())){for(u=0;u<h.length;u++)d=l[++s],c=h[u],typeof c===o&&c.length>0?2==c.length?t[c[0]]=typeof c[1]==i?c[1].call(this,d):c[1]:3==c.length?t[c[0]]=typeof c[1]!==i||c[1].exec&&c[1].test?d?d.replace(c[1],c[2]):e:d?c[1].call(this,d,c[2]):e:4==c.length&&(t[c[0]]=d?c[3].call(this,d.replace(c[1],c[2])):e):t[c]=d?d:e;break}if(l)break}return t},str:function(t,i){for(var r in i)if(typeof i[r]===o&&i[r].length>0){for(var a=0;a<i[r].length;a++)if(g.has(i[r][a],t))return r===n?e:r}else if(g.has(i[r],t))return r===n?e:r;return t}},y={browser:{oldsafari:{major:{1:["/8","/1","/3"],2:"/4","?":"/"},version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2000:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",RT:"ARM"}}}},w={browser:[[/(opera\smini)\/((\d+)?[\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/((\d+)?[\w\.-]+)/i,/(opera).+version\/((\d+)?[\w\.]+)/i,/(opera)[\/\s]+((\d+)?[\w\.]+)/i],[u,d,a],[/\s(opr)\/((\d+)?[\w\.]+)/i],[[u,"Opera"],d,a],[/(kindle)\/((\d+)?[\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?((\d+)?[\w\.]+)*/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?((\d+)?[\w\.]*)/i,/(?:ms|\()(ie)\s((\d+)?[\w\.]+)/i,/(rekonq)((?:\/)[\w\.]+)*/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron)\/((\d+)?[\w\.-]+)/i],[u,d,a],[/(trident).+rv[:\s]((\d+)?[\w\.]+).+like\sgecko/i],[[u,"IE"],d,a],[/(yabrowser)\/((\d+)?[\w\.]+)/i],[[u,"Yandex"],d,a],[/(comodo_dragon)\/((\d+)?[\w\.]+)/i],[[u,/_/g," "],d,a],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?((\d+)?[\w\.]+)/i],[u,d,a],[/(dolfin)\/((\d+)?[\w\.]+)/i],[[u,"Dolphin"],d,a],[/((?:android.+)crmo|crios)\/((\d+)?[\w\.]+)/i],[[u,"Chrome"],d,a],[/((?:android.+))version\/((\d+)?[\w\.]+)\smobile\ssafari/i],[[u,"Android Browser"],d,a],[/version\/((\d+)?[\w\.]+).+?mobile\/\w+\s(safari)/i],[d,a,[u,"Mobile Safari"]],[/version\/((\d+)?[\w\.]+).+?(mobile\s?safari|safari)/i],[d,a,u],[/webkit.+?(mobile\s?safari|safari)((\/[\w\.]+))/i],[u,[a,v.str,y.browser.oldsafari.major],[d,v.str,y.browser.oldsafari.version]],[/(konqueror)\/((\d+)?[\w\.]+)/i,/(webkit|khtml)\/((\d+)?[\w\.]+)/i],[u,d,a],[/(navigator|netscape)\/((\d+)?[\w\.-]+)/i],[[u,"Netscape"],d,a],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?((\d+)?[\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/((\d+)?[\w\.-]+)/i,/(mozilla)\/((\d+)?[\w\.]+).+rv\:.+gecko\/\d+/i,/(uc\s?browser|polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|qqbrowser)[\/\s]?((\d+)?[\w\.]+)/i,/(links)\s\(((\d+)?[\w\.]+)/i,/(gobrowser)\/?((\d+)?[\w\.]+)*/i,/(ice\s?browser)\/v?((\d+)?[\w\._]+)/i,/(mosaic)[\/\s]((\d+)?[\w\.]+)/i],[u,d,a]],engine:[[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[u,d],[/rv\:([\w\.]+).*(gecko)/i],[d,u]],os:[[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[u,[d,v.str,y.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[u,"Windows"],[d,v.str,y.os.windows.version]],[/\((bb)(10);/i],[[u,"BlackBerry"],d],[/(blackberry)\w*\/?([\w\.]+)*/i,/(tizen)\/([\w\.]+)/i,/(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego)[\/\s-]?([\w\.]+)*/i],[u,d],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],[[u,"Symbian"],d],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[u,"Firefox OS"],d],[/(nintendo|playstation)\s([wids3portablevu]+)/i,/(mint)[\/\s\(]?(\w+)*/i,/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)[\/\s-]?([\w\.-]+)*/i,/(hurd|linux)\s?([\w\.]+)*/i,/(gnu)\s?([\w\.]+)*/i],[u,d],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[u,"Chromium OS"],d],[/(sunos)\s?([\w\.]+\d)*/i],[[u,"Solaris"],d],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],[u,d],[/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],[[u,"iOS"],[d,/_/g,"."]],[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i],[u,[d,/_/g,"."]],[/(haiku)\s(\w+)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,/(macintosh|mac(?=_powerpc)|plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos)/i,/(unix)\s?([\w\.]+)*/i],[u,d]]},E=function(e){var n=e||(window&&window.navigator&&window.navigator.userAgent?window.navigator.userAgent:t);this.getBrowser=function(){return v.rgx.apply(this,w.browser)},this.getEngine=function(){return v.rgx.apply(this,w.engine)},this.getOS=function(){return v.rgx.apply(this,w.os)},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS()}},this.getUA=function(){return n},this.setUA=function(e){return n=e,this},this.setUA(n)};return(new E).getResult()}(),i=function(){var t={define_property:function(){return!1}(),create_canvas:function(){var e=document.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))}(),return_response_type:function(t){try{if(-1!==e.inArray(t,["","text","document"]))return!0;if(window.XMLHttpRequest){var n=new XMLHttpRequest;if(n.open("get","/"),"responseType"in n)return n.responseType=t,n.responseType!==t?!1:!0}}catch(i){}return!1},use_data_uri:function(){var e=new Image;return e.onload=function(){t.use_data_uri=1===e.width&&1===e.height},setTimeout(function(){e.src="data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="},1),!1}(),use_data_uri_over32kb:function(){return t.use_data_uri&&("IE"!==r.browser||r.version>=9)},use_data_uri_of:function(e){return t.use_data_uri&&33e3>e||t.use_data_uri_over32kb()},use_fileinput:function(){var e=document.createElement("input");return e.setAttribute("type","file"),!e.disabled}};return function(n){var i=[].slice.call(arguments);return i.shift(),"function"===e.typeOf(t[n])?t[n].apply(this,i):!!t[n]}}(),r={can:i,browser:n.browser.name,version:parseFloat(n.browser.major),os:n.os.name,osVersion:n.os.version,verComp:t,swf_url:"../flash/Moxie.swf",xap_url:"../silverlight/Moxie.xap",global_event_dispatcher:"moxie.core.EventTarget.instance.dispatchEvent"};return r.OS=r.os,r}),i(f,[d],function(e){var t=function(e){return"string"!=typeof e?e:document.getElementById(e)},n=function(e,t){if(!e.className)return!1;var n=new RegExp("(^|\\s+)"+t+"(\\s+|$)");return n.test(e.className)},i=function(e,t){n(e,t)||(e.className=e.className?e.className.replace(/\s+$/,"")+" "+t:t)},r=function(e,t){if(e.className){var n=new RegExp("(^|\\s+)"+t+"(\\s+|$)");e.className=e.className.replace(n,function(e,t,n){return" "===t&&" "===n?" ":""})}},o=function(e,t){return e.currentStyle?e.currentStyle[t]:window.getComputedStyle?window.getComputedStyle(e,null)[t]:void 0},a=function(t,n){function i(e){var t,n,i=0,r=0;return e&&(n=e.getBoundingClientRect(),t="CSS1Compat"===s.compatMode?s.documentElement:s.body,i=n.left+t.scrollLeft,r=n.top+t.scrollTop),{x:i,y:r}}var r=0,o=0,a,s=document,u,c;if(t=t,n=n||s.body,t&&t.getBoundingClientRect&&"IE"===e.browser&&(!s.documentMode||s.documentMode<8))return u=i(t),c=i(n),{x:u.x-c.x,y:u.y-c.y};for(a=t;a&&a!=n&&a.nodeType;)r+=a.offsetLeft||0,o+=a.offsetTop||0,a=a.offsetParent;for(a=t.parentNode;a&&a!=n&&a.nodeType;)r-=a.scrollLeft||0,o-=a.scrollTop||0,a=a.parentNode;return{x:r,y:o}},s=function(e){return{w:e.offsetWidth||e.clientWidth,h:e.offsetHeight||e.clientHeight}};return{get:t,hasClass:n,addClass:i,removeClass:r,getStyle:o,getPos:a,getSize:s}}),i(p,[u],function(e){function t(e,t){var n;for(n in e)if(e[n]===t)return n;return null}return{RuntimeError:function(){function n(e){this.code=e,this.name=t(i,e),this.message=this.name+": RuntimeError "+this.code}var i={NOT_INIT_ERR:1,NOT_SUPPORTED_ERR:9,JS_ERR:4};return e.extend(n,i),n.prototype=Error.prototype,n}(),OperationNotAllowedException:function(){function t(e){this.code=e,this.name="OperationNotAllowedException"}return e.extend(t,{NOT_ALLOWED_ERR:1}),t.prototype=Error.prototype,t}(),ImageError:function(){function n(e){this.code=e,this.name=t(i,e),this.message=this.name+": ImageError "+this.code}var i={WRONG_FORMAT:1,MAX_RESOLUTION_ERR:2};return e.extend(n,i),n.prototype=Error.prototype,n}(),FileException:function(){function n(e){this.code=e,this.name=t(i,e),this.message=this.name+": FileException "+this.code}var i={NOT_FOUND_ERR:1,SECURITY_ERR:2,ABORT_ERR:3,NOT_READABLE_ERR:4,ENCODING_ERR:5,NO_MODIFICATION_ALLOWED_ERR:6,INVALID_STATE_ERR:7,SYNTAX_ERR:8};return e.extend(n,i),n.prototype=Error.prototype,n}(),DOMException:function(){function n(e){this.code=e,this.name=t(i,e),this.message=this.name+": DOMException "+this.code}var i={INDEX_SIZE_ERR:1,DOMSTRING_SIZE_ERR:2,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,INVALID_CHARACTER_ERR:5,NO_DATA_ALLOWED_ERR:6,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INUSE_ATTRIBUTE_ERR:10,INVALID_STATE_ERR:11,SYNTAX_ERR:12,INVALID_MODIFICATION_ERR:13,NAMESPACE_ERR:14,INVALID_ACCESS_ERR:15,VALIDATION_ERR:16,TYPE_MISMATCH_ERR:17,SECURITY_ERR:18,NETWORK_ERR:19,ABORT_ERR:20,URL_MISMATCH_ERR:21,QUOTA_EXCEEDED_ERR:22,TIMEOUT_ERR:23,INVALID_NODE_TYPE_ERR:24,DATA_CLONE_ERR:25};return e.extend(n,i),n.prototype=Error.prototype,n}(),EventException:function(){function t(e){this.code=e,this.name="EventException"}return e.extend(t,{UNSPECIFIED_EVENT_TYPE_ERR:0}),t.prototype=Error.prototype,t}()}}),i(h,[p,u],function(e,t){function n(){var n={};t.extend(this,{uid:null,init:function(){this.uid||(this.uid=t.guid("uid_"))},addEventListener:function(e,i,r,o){var a=this,s;return e=t.trim(e),/\s/.test(e)?(t.each(e.split(/\s+/),function(e){a.addEventListener(e,i,r,o)}),void 0):(e=e.toLowerCase(),r=parseInt(r,10)||0,s=n[this.uid]&&n[this.uid][e]||[],s.push({fn:i,priority:r,scope:o||this}),n[this.uid]||(n[this.uid]={}),n[this.uid][e]=s,void 0)},hasEventListener:function(e){return e?!(!n[this.uid]||!n[this.uid][e]):!!n[this.uid]},removeEventListener:function(e,i){e=e.toLowerCase();var r=n[this.uid]&&n[this.uid][e],o;if(r){if(i){for(o=r.length-1;o>=0;o--)if(r[o].fn===i){r.splice(o,1);break}}else r=[];r.length||(delete n[this.uid][e],t.isEmptyObj(n[this.uid])&&delete n[this.uid])}},removeAllEventListeners:function(){n[this.uid]&&delete n[this.uid]},dispatchEvent:function(i){var r,o,a,s,u={},c=!0,l;if("string"!==t.typeOf(i)){if(s=i,"string"!==t.typeOf(s.type))throw new e.EventException(e.EventException.UNSPECIFIED_EVENT_TYPE_ERR);i=s.type,s.total!==l&&s.loaded!==l&&(u.total=s.total,u.loaded=s.loaded),u.async=s.async||!1}if(-1!==i.indexOf("::")?function(e){r=e[0],i=e[1]}(i.split("::")):r=this.uid,i=i.toLowerCase(),o=n[r]&&n[r][i]){o.sort(function(e,t){return t.priority-e.priority}),a=[].slice.call(arguments),a.shift(),u.type=i,a.unshift(u);var d=[];t.each(o,function(e){a[0].target=e.scope,u.async?d.push(function(t){setTimeout(function(){t(e.fn.apply(e.scope,a)===!1)},1)}):d.push(function(t){t(e.fn.apply(e.scope,a)===!1)})}),d.length&&t.inSeries(d,function(e){c=!e})}return c},bind:function(){this.addEventListener.apply(this,arguments)},unbind:function(){this.removeEventListener.apply(this,arguments)},unbindAll:function(){this.removeAllEventListeners.apply(this,arguments)},trigger:function(){return this.dispatchEvent.apply(this,arguments)},convertEventPropsToHandlers:function(e){var n;"array"!==t.typeOf(e)&&(e=[e]);for(var i=0;i<e.length;i++)n="on"+e[i],"function"===t.typeOf(this[n])?this.addEventListener(e[i],this[n]):"undefined"===t.typeOf(this[n])&&(this[n]=null)}})}return n.instance=new n,n}),i(m,[],function(){var e=function(e){return unescape(encodeURIComponent(e))},t=function(e){return decodeURIComponent(escape(e))},n=function(e,n){if("function"==typeof window.atob)return n?t(window.atob(e)):window.atob(e);var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r,o,a,s,u,c,l,d,f=0,p=0,h="",m=[];if(!e)return e;e+="";do s=i.indexOf(e.charAt(f++)),u=i.indexOf(e.charAt(f++)),c=i.indexOf(e.charAt(f++)),l=i.indexOf(e.charAt(f++)),d=s<<18|u<<12|c<<6|l,r=255&d>>16,o=255&d>>8,a=255&d,m[p++]=64==c?String.fromCharCode(r):64==l?String.fromCharCode(r,o):String.fromCharCode(r,o,a);while(f<e.length);return h=m.join(""),n?t(h):h},i=function(t,n){if(n&&e(t),"function"==typeof window.btoa)return window.btoa(t);var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r,o,a,s,u,c,l,d,f=0,p=0,h="",m=[];if(!t)return t;do r=t.charCodeAt(f++),o=t.charCodeAt(f++),a=t.charCodeAt(f++),d=r<<16|o<<8|a,s=63&d>>18,u=63&d>>12,c=63&d>>6,l=63&d,m[p++]=i.charAt(s)+i.charAt(u)+i.charAt(c)+i.charAt(l);while(f<t.length);h=m.join("");var g=t.length%3;return(g?h.slice(0,g-3):h)+"===".slice(g||3)};return{utf8_encode:e,utf8_decode:t,atob:n,btoa:i}}),i(g,[u,f,h],function(e,t,n){function i(n,r,a,s,u){var c=this,l,d=e.guid(r+"_"),f=u||"browser";n=n||{},o[d]=this,a=e.extend({access_binary:!1,access_image_binary:!1,display_media:!1,do_cors:!1,drag_and_drop:!1,filter_by_extension:!0,resize_image:!1,report_upload_progress:!1,return_response_headers:!1,return_response_type:!1,return_status_code:!0,send_custom_headers:!1,select_file:!1,select_folder:!1,select_multiple:!0,send_binary_string:!1,send_browser_cookies:!0,send_multipart:!0,slice_blob:!1,stream_upload:!1,summon_file_dialog:!1,upload_filesize:!0,use_http_method:!0},a),n.preferred_caps&&(f=i.getMode(s,n.preferred_caps,f)),l=function(){var t={};return{exec:function(e,n,i,r){return l[n]&&(t[e]||(t[e]={context:this,instance:new l[n]}),t[e].instance[i])?t[e].instance[i].apply(this,r):void 0},removeInstance:function(e){delete t[e]},removeAllInstances:function(){var n=this;e.each(t,function(t,i){"function"===e.typeOf(t.instance.destroy)&&t.instance.destroy.call(t.context),n.removeInstance(i)})}}}(),e.extend(this,{initialized:!1,uid:d,type:r,mode:i.getMode(s,n.required_caps,f),shimid:d+"_container",clients:0,options:n,can:function(t,n){var r=arguments[2]||a;if("string"===e.typeOf(t)&&"undefined"===e.typeOf(n)&&(t=i.parseCaps(t)),"object"===e.typeOf(t)){for(var o in t)if(!this.can(o,t[o],r))return!1;return!0}return"function"===e.typeOf(r[t])?r[t].call(this,n):n===r[t]},getShimContainer:function(){var n,i=t.get(this.shimid);return i||(n=this.options.container?t.get(this.options.container):document.body,i=document.createElement("div"),i.id=this.shimid,i.className="moxie-shim moxie-shim-"+this.type,e.extend(i.style,{position:"absolute",top:"0px",left:"0px",width:"1px",height:"1px",overflow:"hidden"}),n.appendChild(i),n=null),i},getShim:function(){return l},shimExec:function(e,t){var n=[].slice.call(arguments,2);return c.getShim().exec.call(this,this.uid,e,t,n)},exec:function(e,t){var n=[].slice.call(arguments,2);return c[e]&&c[e][t]?c[e][t].apply(this,n):c.shimExec.apply(this,arguments)},destroy:function(){if(c){var e=t.get(this.shimid);e&&e.parentNode.removeChild(e),l&&l.removeAllInstances(),this.unbindAll(),delete o[this.uid],this.uid=null,d=c=l=e=null}}}),this.mode&&n.required_caps&&!this.can(n.required_caps)&&(this.mode=!1)}var r={},o={};return i.order="html5,flash,silverlight,html4",i.getRuntime=function(e){return o[e]?o[e]:!1},i.addConstructor=function(e,t){t.prototype=n.instance,r[e]=t},i.getConstructor=function(e){return r[e]||null},i.getInfo=function(e){var t=i.getRuntime(e);return t?{uid:t.uid,type:t.type,mode:t.mode,can:function(){return t.can.apply(t,arguments)}}:null},i.parseCaps=function(t){var n={};return"string"!==e.typeOf(t)?t||{}:(e.each(t.split(","),function(e){n[e]=!0}),n)},i.can=function(e,t){var n,r=i.getConstructor(e),o;return r?(n=new r({required_caps:t}),o=n.mode,n.destroy(),!!o):!1},i.thatCan=function(e,t){var n=(t||i.order).split(/\s*,\s*/);for(var r in n)if(i.can(n[r],e))return n[r];return null},i.getMode=function(t,n,i){var r=null;if("undefined"===e.typeOf(i)&&(i="browser"),n&&!e.isEmptyObj(t)){if(e.each(n,function(n,i){if(t.hasOwnProperty(i)){var o=t[i](n);if("string"==typeof o&&(o=[o]),r){if(!(r=e.arrayIntersect(r,o)))return r=!1}else r=o}}),r)return-1!==e.inArray(i,r)?i:r[0];if(r===!1)return!1}return i},i.capTrue=function(){return!0},i.capFalse=function(){return!1},i.capTest=function(e){return function(){return!!e}},i}),i(v,[p,u,g],function(e,t,n){return function i(){var i;t.extend(this,{connectRuntime:function(r){function o(t){var s,u;return t.length?(s=t.shift(),(u=n.getConstructor(s))?(i=new u(r),i.bind("Init",function(){i.initialized=!0,setTimeout(function(){i.clients++,a.trigger("RuntimeInit",i)},1)}),i.bind("Error",function(){i.destroy(),o(t)}),i.mode?(i.init(),void 0):(i.trigger("Error"),void 0)):(o(t),void 0)):(a.trigger("RuntimeError",new e.RuntimeError(e.RuntimeError.NOT_INIT_ERR)),i=null,void 0)}var a=this,s;if("string"===t.typeOf(r)?s=r:"string"===t.typeOf(r.ruid)&&(s=r.ruid),s){if(i=n.getRuntime(s))return i.clients++,i;throw new e.RuntimeError(e.RuntimeError.NOT_INIT_ERR)}o((r.runtime_order||n.order).split(/\s*,\s*/))},getRuntime:function(){return i&&i.uid?i:(i=null,null)},disconnectRuntime:function(){i&&--i.clients<=0&&(i.destroy(),i=null)}})}}),i(y,[u,m,v],function(e,t,n){function i(o,a){function s(t,n,o){var a,s=r[this.uid];return"string"===e.typeOf(s)&&s.length?(a=new i(null,{type:o,size:n-t}),a.detach(s.substr(t,a.size)),a):null}n.call(this),o&&this.connectRuntime(o),a?"string"===e.typeOf(a)&&(a={data:a}):a={},e.extend(this,{uid:a.uid||e.guid("uid_"),ruid:o,size:a.size||0,type:a.type||"",slice:function(e,t,n){return this.isDetached()?s.apply(this,arguments):this.getRuntime().exec.call(this,"Blob","slice",this.getSource(),e,t,n)},getSource:function(){return r[this.uid]?r[this.uid]:null},detach:function(e){this.ruid&&(this.getRuntime().exec.call(this,"Blob","destroy",r[this.uid]),this.disconnectRuntime(),this.ruid=null),e=e||"";var n=e.match(/^data:([^;]*);base64,/);n&&(this.type=n[1],e=t.atob(e.substring(e.indexOf("base64,")+7))),this.size=e.length,r[this.uid]=e},isDetached:function(){return!this.ruid&&"string"===e.typeOf(r[this.uid])},destroy:function(){this.detach(),delete r[this.uid]}}),a.data?this.detach(a.data):r[this.uid]=a}var r={};return i}),i(w,[u,l,y],function(e,t,n){function i(i,r){var o,a;if(r||(r={}),a=r.type&&""!==r.type?r.type:t.getFileMime(r.name),r.name)o=r.name.replace(/\\/g,"/"),o=o.substr(o.lastIndexOf("/")+1);else{var s=a.split("/")[0];o=e.guid((""!==s?s:"file")+"_"),t.extensions[a]&&(o+="."+t.extensions[a][0])}n.apply(this,arguments),e.extend(this,{type:a||"",name:o||e.guid("file_"),lastModifiedDate:r.lastModifiedDate||(new Date).toLocaleString()})}return i.prototype=n.prototype,i}),i(E,[u,l,f,p,h,c,w,g,v],function(e,t,n,i,r,o,a,s,u){function c(r){var c=this,d,f,p;if(-1!==e.inArray(e.typeOf(r),["string","node"])&&(r={browse_button:r}),f=n.get(r.browse_button),!f)throw new i.DOMException(i.DOMException.NOT_FOUND_ERR);p={accept:[{title:o.translate("All Files"),extensions:"*"}],name:"file",multiple:!1,required_caps:!1,container:f.parentNode||document.body},r=e.extend({},p,r),"string"==typeof r.required_caps&&(r.required_caps=s.parseCaps(r.required_caps)),"string"==typeof r.accept&&(r.accept=t.mimes2extList(r.accept)),d=n.get(r.container),d||(d=document.body),"static"===n.getStyle(d,"position")&&(d.style.position="relative"),d=f=null,u.call(c),e.extend(c,{uid:e.guid("uid_"),ruid:null,shimid:null,files:null,init:function(){c.convertEventPropsToHandlers(l),c.bind("RuntimeInit",function(t,i){c.ruid=i.uid,c.shimid=i.shimid,c.bind("Ready",function(){c.trigger("Refresh")},999),c.bind("Change",function(){var t=i.exec.call(c,"FileInput","getFiles");c.files=[],e.each(t,function(e){return 0===e.size?!0:(c.files.push(new a(c.ruid,e)),void 0)})},999),c.bind("Refresh",function(){var t,o,a,s;a=n.get(r.browse_button),s=n.get(i.shimid),a&&(t=n.getPos(a,n.get(r.container)),o=n.getSize(a),s&&e.extend(s.style,{top:t.y+"px",left:t.x+"px",width:o.w+"px",height:o.h+"px"})),s=a=null}),i.exec.call(c,"FileInput","init",r)}),c.connectRuntime(e.extend({},r,{required_caps:{select_file:!0}}))},disable:function(t){var n=this.getRuntime();n&&n.exec.call(this,"FileInput","disable","undefined"===e.typeOf(t)?!0:t)},refresh:function(){c.trigger("Refresh")},destroy:function(){var t=this.getRuntime();t&&(t.exec.call(this,"FileInput","destroy"),this.disconnectRuntime()),"array"===e.typeOf(this.files)&&e.each(this.files,function(e){e.destroy()}),this.files=null}})}var l=["ready","change","cancel","mouseenter","mouseleave","mousedown","mouseup"];return c.prototype=r.instance,c}),i(_,[c,f,p,u,w,v,h,l],function(e,t,n,i,r,o,a,s){function u(n){var a=this,u;"string"==typeof n&&(n={drop_zone:n}),u={accept:[{title:e.translate("All Files"),extensions:"*"}],required_caps:{drag_and_drop:!0}},n="object"==typeof n?i.extend({},u,n):u,n.container=t.get(n.drop_zone)||document.body,"static"===t.getStyle(n.container,"position")&&(n.container.style.position="relative"),"string"==typeof n.accept&&(n.accept=s.mimes2extList(n.accept)),o.call(a),i.extend(a,{uid:i.guid("uid_"),ruid:null,files:null,init:function(){a.convertEventPropsToHandlers(c),a.bind("RuntimeInit",function(e,t){a.ruid=t.uid,a.bind("Drop",function(){var e=t.exec.call(a,"FileDrop","getFiles");a.files=[],i.each(e,function(e){a.files.push(new r(a.ruid,e))})},999),t.exec.call(a,"FileDrop","init",n),a.dispatchEvent("ready")}),a.connectRuntime(n)},destroy:function(){var e=this.getRuntime();e&&(e.exec.call(this,"FileDrop","destroy"),this.disconnectRuntime()),this.files=null}})}var c=["ready","dragenter","dragleave","drop","error"];return u.prototype=a.instance,u}),i(x,[u,v,h],function(e,t,n){function i(){this.uid=e.guid("uid_"),t.call(this),this.destroy=function(){this.disconnectRuntime(),this.unbindAll()}}return i.prototype=n.instance,i}),i(R,[u,m,p,h,y,w,x],function(e,t,n,i,r,o,a){function s(){function i(e,i){function l(e){o.readyState=s.DONE,o.error=e,o.trigger("error"),d()}function d(){c.destroy(),c=null,o.trigger("loadend")}function f(t){c.bind("Error",function(e,t){l(t)}),c.bind("Progress",function(e){o.result=t.exec.call(c,"FileReader","getResult"),o.trigger(e)}),c.bind("Load",function(e){o.readyState=s.DONE,o.result=t.exec.call(c,"FileReader","getResult"),o.trigger(e),d()}),t.exec.call(c,"FileReader","read",e,i)}if(c=new a,this.convertEventPropsToHandlers(u),this.readyState===s.LOADING)return l(new n.DOMException(n.DOMException.INVALID_STATE_ERR));if(this.readyState=s.LOADING,this.trigger("loadstart"),i instanceof r)if(i.isDetached()){var p=i.getSource();switch(e){case"readAsText":case"readAsBinaryString":this.result=p;break;case"readAsDataURL":this.result="data:"+i.type+";base64,"+t.btoa(p)}this.readyState=s.DONE,this.trigger("load"),d()}else f(c.connectRuntime(i.ruid));else l(new n.DOMException(n.DOMException.NOT_FOUND_ERR))}var o=this,c;e.extend(this,{uid:e.guid("uid_"),readyState:s.EMPTY,result:null,error:null,readAsBinaryString:function(e){i.call(this,"readAsBinaryString",e)},readAsDataURL:function(e){i.call(this,"readAsDataURL",e)},readAsText:function(e){i.call(this,"readAsText",e)
},abort:function(){this.result=null,-1===e.inArray(this.readyState,[s.EMPTY,s.DONE])&&(this.readyState===s.LOADING&&(this.readyState=s.DONE),c&&c.getRuntime().exec.call(this,"FileReader","abort"),this.trigger("abort"),this.trigger("loadend"))},destroy:function(){this.abort(),c&&(c.getRuntime().exec.call(this,"FileReader","destroy"),c.disconnectRuntime()),o=c=null}})}var u=["loadstart","progress","load","abort","error","loadend"];return s.EMPTY=0,s.LOADING=1,s.DONE=2,s.prototype=i.instance,s}),i(b,[],function(){var e=function(t,n){for(var i=["source","scheme","authority","userInfo","user","pass","host","port","relative","path","directory","file","query","fragment"],r=i.length,o={http:80,https:443},a={},s=/^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/,u=s.exec(t||"");r--;)u[r]&&(a[i[r]]=u[r]);if(!a.scheme){n&&"string"!=typeof n||(n=e(n||document.location.href)),a.scheme=n.scheme,a.host=n.host,a.port=n.port;var c="";/^[^\/]/.test(a.path)&&(c=n.path,/(\/|\/[^\.]+)$/.test(c)?c+="/":c=c.replace(/\/[^\/]+$/,"/")),a.path=c+(a.path||"")}return a.port||(a.port=o[a.scheme]||80),a.port=parseInt(a.port,10),a.path||(a.path="/"),delete a.source,a},t=function(t){var n={http:80,https:443},i=e(t);return i.scheme+"://"+i.host+(i.port!==n[i.scheme]?":"+i.port:"")+i.path+(i.query?i.query:"")},n=function(t){function n(e){return[e.scheme,e.host,e.port].join("/")}return"string"==typeof t&&(t=e(t)),n(e())===n(t)};return{parseUrl:e,resolveUrl:t,hasSameOrigin:n}}),i(T,[u,v,m],function(e,t,n){return function(){function i(e,t){if(!t.isDetached()){var i=this.connectRuntime(t.ruid).exec.call(this,"FileReaderSync","read",e,t);return this.disconnectRuntime(),i}var r=t.getSource();switch(e){case"readAsBinaryString":return r;case"readAsDataURL":return"data:"+t.type+";base64,"+n.btoa(r);case"readAsText":for(var o="",a=0,s=r.length;s>a;a++)o+=String.fromCharCode(r[a]);return o}}t.call(this),e.extend(this,{uid:e.guid("uid_"),readAsBinaryString:function(e){return i.call(this,"readAsBinaryString",e)},readAsDataURL:function(e){return i.call(this,"readAsDataURL",e)},readAsText:function(e){return i.call(this,"readAsText",e)}})}}),i(S,[p,u,y],function(e,t,n){function i(){var e,i=[];t.extend(this,{append:function(r,o){var a=this,s=t.typeOf(o);o instanceof n?e={name:r,value:o}:"array"===s?(r+="[]",t.each(o,function(e){a.append(r,e)})):"object"===s?t.each(o,function(e,t){a.append(r+"["+t+"]",e)}):"null"===s||"undefined"===s||"number"===s&&isNaN(o)?a.append(r,"false"):i.push({name:r,value:o.toString()})},hasBlob:function(){return!!this.getBlob()},getBlob:function(){return e&&e.value||null},getBlobName:function(){return e&&e.name||null},each:function(n){t.each(i,function(e){n(e.value,e.name)}),e&&n(e.value,e.name)},destroy:function(){e=null,i=[]}})}return i}),i(A,[u,p,h,m,b,g,x,y,T,S,d,l],function(e,t,n,i,r,o,a,s,u,c,l,d){function f(){this.uid=e.guid("uid_")}function p(){function n(e,t){return y.hasOwnProperty(e)?1===arguments.length?l.can("define_property")?y[e]:v[e]:(l.can("define_property")?y[e]=t:v[e]=t,void 0):void 0}function u(t){function i(){k.destroy(),k=null,s.dispatchEvent("loadend"),s=null}function r(r){k.bind("LoadStart",function(e){n("readyState",p.LOADING),s.dispatchEvent("readystatechange"),s.dispatchEvent(e),I&&s.upload.dispatchEvent(e)}),k.bind("Progress",function(e){n("readyState")!==p.LOADING&&(n("readyState",p.LOADING),s.dispatchEvent("readystatechange")),s.dispatchEvent(e)}),k.bind("UploadProgress",function(e){I&&s.upload.dispatchEvent({type:"progress",lengthComputable:!1,total:e.total,loaded:e.loaded})}),k.bind("Load",function(t){n("readyState",p.DONE),n("status",Number(r.exec.call(k,"XMLHttpRequest","getStatus")||0)),n("statusText",h[n("status")]||""),n("response",r.exec.call(k,"XMLHttpRequest","getResponse",n("responseType"))),~e.inArray(n("responseType"),["text",""])?n("responseText",n("response")):"document"===n("responseType")&&n("responseXML",n("response")),U=r.exec.call(k,"XMLHttpRequest","getAllResponseHeaders"),s.dispatchEvent("readystatechange"),n("status")>0?(I&&s.upload.dispatchEvent(t),s.dispatchEvent(t)):(N=!0,s.dispatchEvent("error")),i()}),k.bind("Abort",function(e){s.dispatchEvent(e),i()}),k.bind("Error",function(e){N=!0,n("readyState",p.DONE),s.dispatchEvent("readystatechange"),D=!0,s.dispatchEvent(e),i()}),r.exec.call(k,"XMLHttpRequest","send",{url:E,method:_,async:w,user:R,password:b,headers:x,mimeType:S,encoding:T,responseType:s.responseType,withCredentials:s.withCredentials,options:P},t)}var s=this;M=(new Date).getTime(),k=new a,"string"==typeof P.required_caps&&(P.required_caps=o.parseCaps(P.required_caps)),P.required_caps=e.extend({},P.required_caps,{return_response_type:s.responseType}),t instanceof c&&(P.required_caps.send_multipart=!0),L||(P.required_caps.do_cors=!0),P.ruid?r(k.connectRuntime(P)):(k.bind("RuntimeInit",function(e,t){r(t)}),k.bind("RuntimeError",function(e,t){s.dispatchEvent("RuntimeError",t)}),k.connectRuntime(P))}function g(){n("responseText",""),n("responseXML",null),n("response",null),n("status",0),n("statusText",""),M=C=null}var v=this,y={timeout:0,readyState:p.UNSENT,withCredentials:!1,status:0,statusText:"",responseType:"",responseXML:null,responseText:null,response:null},w=!0,E,_,x={},R,b,T=null,S=null,A=!1,O=!1,I=!1,D=!1,N=!1,L=!1,M,C,F=null,H=null,P={},k,U="",B;e.extend(this,y,{uid:e.guid("uid_"),upload:new f,open:function(o,a,s,u,c){var l;if(!o||!a)throw new t.DOMException(t.DOMException.SYNTAX_ERR);if(/[\u0100-\uffff]/.test(o)||i.utf8_encode(o)!==o)throw new t.DOMException(t.DOMException.SYNTAX_ERR);if(~e.inArray(o.toUpperCase(),["CONNECT","DELETE","GET","HEAD","OPTIONS","POST","PUT","TRACE","TRACK"])&&(_=o.toUpperCase()),~e.inArray(_,["CONNECT","TRACE","TRACK"]))throw new t.DOMException(t.DOMException.SECURITY_ERR);if(a=i.utf8_encode(a),l=r.parseUrl(a),L=r.hasSameOrigin(l),E=r.resolveUrl(a),(u||c)&&!L)throw new t.DOMException(t.DOMException.INVALID_ACCESS_ERR);if(R=u||l.user,b=c||l.pass,w=s||!0,w===!1&&(n("timeout")||n("withCredentials")||""!==n("responseType")))throw new t.DOMException(t.DOMException.INVALID_ACCESS_ERR);A=!w,O=!1,x={},g.call(this),n("readyState",p.OPENED),this.convertEventPropsToHandlers(["readystatechange"]),this.dispatchEvent("readystatechange")},setRequestHeader:function(r,o){var a=["accept-charset","accept-encoding","access-control-request-headers","access-control-request-method","connection","content-length","cookie","cookie2","content-transfer-encoding","date","expect","host","keep-alive","origin","referer","te","trailer","transfer-encoding","upgrade","user-agent","via"];if(n("readyState")!==p.OPENED||O)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(/[\u0100-\uffff]/.test(r)||i.utf8_encode(r)!==r)throw new t.DOMException(t.DOMException.SYNTAX_ERR);return r=e.trim(r).toLowerCase(),~e.inArray(r,a)||/^(proxy\-|sec\-)/.test(r)?!1:(x[r]?x[r]+=", "+o:x[r]=o,!0)},getAllResponseHeaders:function(){return U||""},getResponseHeader:function(t){return t=t.toLowerCase(),N||~e.inArray(t,["set-cookie","set-cookie2"])?null:U&&""!==U&&(B||(B={},e.each(U.split(/\r\n/),function(t){var n=t.split(/:\s+/);2===n.length&&(n[0]=e.trim(n[0]),B[n[0].toLowerCase()]={header:n[0],value:e.trim(n[1])})})),B.hasOwnProperty(t))?B[t].header+": "+B[t].value:null},overrideMimeType:function(i){var r,o;if(~e.inArray(n("readyState"),[p.LOADING,p.DONE]))throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(i=e.trim(i.toLowerCase()),/;/.test(i)&&(r=i.match(/^([^;]+)(?:;\scharset\=)?(.*)$/))&&(i=r[1],r[2]&&(o=r[2])),!d.mimes[i])throw new t.DOMException(t.DOMException.SYNTAX_ERR);F=i,H=o},send:function(n,r){if(P="string"===e.typeOf(r)?{ruid:r}:r?r:{},this.convertEventPropsToHandlers(m),this.upload.convertEventPropsToHandlers(m),this.readyState!==p.OPENED||O)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(n instanceof s)P.ruid=n.ruid,S=n.type||"application/octet-stream";else if(n instanceof c){if(n.hasBlob()){var o=n.getBlob();P.ruid=o.ruid,S=o.type||"application/octet-stream"}}else"string"==typeof n&&(T="UTF-8",S="text/plain;charset=UTF-8",n=i.utf8_encode(n));this.withCredentials||(this.withCredentials=P.required_caps&&P.required_caps.send_browser_cookies&&!L),I=!A&&this.upload.hasEventListener(),N=!1,D=!n,A||(O=!0),u.call(this,n)},abort:function(){if(N=!0,A=!1,~e.inArray(n("readyState"),[p.UNSENT,p.OPENED,p.DONE]))n("readyState",p.UNSENT);else{if(n("readyState",p.DONE),O=!1,!k)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);k.getRuntime().exec.call(k,"XMLHttpRequest","abort",D),D=!0}},destroy:function(){k&&("function"===e.typeOf(k.destroy)&&k.destroy(),k=null),this.unbindAll(),this.upload&&(this.upload.unbindAll(),this.upload=null)}})}var h={100:"Continue",101:"Switching Protocols",102:"Processing",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",306:"Reserved",307:"Temporary Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Request Entity Too Large",414:"Request-URI Too Long",415:"Unsupported Media Type",416:"Requested Range Not Satisfiable",417:"Expectation Failed",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",426:"Upgrade Required",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",510:"Not Extended"};f.prototype=n.instance;var m=["loadstart","progress","abort","error","load","timeout","loadend"],g=1,v=2;return p.UNSENT=0,p.OPENED=1,p.HEADERS_RECEIVED=2,p.LOADING=3,p.DONE=4,p.prototype=n.instance,p}),i(O,[u,m,v,h],function(e,t,n,i){function r(){function i(){l=d=0,c=this.result=null}function o(t,n){var i=this;u=n,i.bind("TransportingProgress",function(t){d=t.loaded,l>d&&-1===e.inArray(i.state,[r.IDLE,r.DONE])&&a.call(i)},999),i.bind("TransportingComplete",function(){d=l,i.state=r.DONE,c=null,i.result=u.exec.call(i,"Transporter","getAsBlob",t||"")},999),i.state=r.BUSY,i.trigger("TransportingStarted"),a.call(i)}function a(){var e=this,n,i=l-d;f>i&&(f=i),n=t.btoa(c.substr(d,f)),u.exec.call(e,"Transporter","receive",n,l)}var s,u,c,l,d,f;n.call(this),e.extend(this,{uid:e.guid("uid_"),state:r.IDLE,result:null,transport:function(t,n,r){var a=this;if(r=e.extend({chunk_size:204798},r),(s=r.chunk_size%3)&&(r.chunk_size+=3-s),f=r.chunk_size,i.call(this),c=t,l=t.length,"string"===e.typeOf(r)||r.ruid)o.call(a,n,this.connectRuntime(r));else{var u=function(e,t){a.unbind("RuntimeInit",u),o.call(a,n,t)};this.bind("RuntimeInit",u),this.connectRuntime(r)}},abort:function(){var e=this;e.state=r.IDLE,u&&(u.exec.call(e,"Transporter","clear"),e.trigger("TransportingAborted")),i.call(e)},destroy:function(){this.unbindAll(),u=null,this.disconnectRuntime(),i.call(this)}})}return r.IDLE=0,r.BUSY=1,r.DONE=2,r.prototype=i.instance,r}),i(I,[u,f,p,T,A,g,v,O,d,h,y,w,m],function(e,t,n,i,r,o,a,s,u,c,l,d,f){function p(){function i(e){e||(e=this.getRuntime().exec.call(this,"Image","getInfo")),this.size=e.size,this.width=e.width,this.height=e.height,this.type=e.type,this.meta=e.meta,""===this.name&&(this.name=e.name)}function c(t){var i=e.typeOf(t);try{if(t instanceof p){if(!t.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);m.apply(this,arguments)}else if(t instanceof l){if(!~e.inArray(t.type,["image/jpeg","image/png"]))throw new n.ImageError(n.ImageError.WRONG_FORMAT);g.apply(this,arguments)}else if(-1!==e.inArray(i,["blob","file"]))c.call(this,new d(null,t),arguments[1]);else if("string"===i)/^data:[^;]*;base64,/.test(t)?c.call(this,new l(null,{data:t}),arguments[1]):v.apply(this,arguments);else{if("node"!==i||"img"!==t.nodeName.toLowerCase())throw new n.DOMException(n.DOMException.TYPE_MISMATCH_ERR);c.call(this,t.src,arguments[1])}}catch(r){this.trigger("error",r)}}function m(t,n){var i=this.connectRuntime(t.ruid);this.ruid=i.uid,i.exec.call(this,"Image","loadFromImage",t,"undefined"===e.typeOf(n)?!0:n)}function g(t,n){function i(e){r.ruid=e.uid,e.exec.call(r,"Image","loadFromBlob",t)}var r=this;r.name=t.name||"",t.isDetached()?(this.bind("RuntimeInit",function(e,t){i(t)}),n&&"string"==typeof n.required_caps&&(n.required_caps=o.parseCaps(n.required_caps)),this.connectRuntime(e.extend({required_caps:{access_image_binary:!0,resize_image:!0}},n))):i(this.connectRuntime(t.ruid))}function v(e,t){var n=this,i;i=new r,i.open("get",e),i.responseType="blob",i.onprogress=function(e){n.trigger(e)},i.onload=function(){g.call(n,i.response,!0)},i.onerror=function(e){n.trigger(e)},i.onloadend=function(){i.destroy()},i.bind("RuntimeError",function(e,t){n.trigger("RuntimeError",t)}),i.send(null,t)}a.call(this),e.extend(this,{uid:e.guid("uid_"),ruid:null,name:"",size:0,width:0,height:0,type:"",meta:{},clone:function(){this.load.apply(this,arguments)},load:function(){this.bind("Load Resize",function(){i.call(this)},999),this.convertEventPropsToHandlers(h),c.apply(this,arguments)},downsize:function(t,i,r,o){try{if(!this.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);if(this.width>p.MAX_RESIZE_WIDTH||this.height>p.MAX_RESIZE_HEIGHT)throw new n.ImageError(n.ImageError.MAX_RESOLUTION_ERR);(!t&&!i||"undefined"===e.typeOf(r))&&(r=!1),t=t||this.width,i=i||this.height,o="undefined"===e.typeOf(o)?!0:!!o,this.getRuntime().exec.call(this,"Image","downsize",t,i,r,o)}catch(a){this.trigger("error",a)}},crop:function(e,t,n){this.downsize(e,t,!0,n)},getAsCanvas:function(){if(!u.can("create_canvas"))throw new n.RuntimeError(n.RuntimeError.NOT_SUPPORTED_ERR);var e=this.connectRuntime(this.ruid);return e.exec.call(this,"Image","getAsCanvas")},getAsBlob:function(e,t){if(!this.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);return e||(e="image/jpeg"),"image/jpeg"!==e||t||(t=90),this.getRuntime().exec.call(this,"Image","getAsBlob",e,t)},getAsDataURL:function(e,t){if(!this.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);return this.getRuntime().exec.call(this,"Image","getAsDataURL",e,t)},getAsBinaryString:function(e,t){var n=this.getAsDataURL(e,t);return f.atob(n.substring(n.indexOf("base64,")+7))},embed:function(i){function r(){if(u.can("create_canvas")){var t=a.getAsCanvas();if(t)return i.appendChild(t),t=null,a.destroy(),o.trigger("embedded"),void 0}var r=a.getAsDataURL(c,l);if(!r)throw new n.ImageError(n.ImageError.WRONG_FORMAT);if(u.can("use_data_uri_of",r.length))i.innerHTML='<img src="'+r+'" width="'+a.width+'" height="'+a.height+'" />',a.destroy(),o.trigger("embedded");else{var d=new s;d.bind("TransportingComplete",function(){v=o.connectRuntime(this.result.ruid),o.bind("Embedded",function(){e.extend(v.getShimContainer().style,{top:"0px",left:"0px",width:a.width+"px",height:a.height+"px"}),v=null},999),v.exec.call(o,"ImageView","display",this.result.uid,m,g),a.destroy()}),d.transport(f.atob(r.substring(r.indexOf("base64,")+7)),c,e.extend({},h,{required_caps:{display_media:!0},runtime_order:"flash,silverlight",container:i}))}}var o=this,a,c,l,d,h=arguments[1]||{},m=this.width,g=this.height,v;try{if(!(i=t.get(i)))throw new n.DOMException(n.DOMException.INVALID_NODE_TYPE_ERR);if(!this.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);if(this.width>p.MAX_RESIZE_WIDTH||this.height>p.MAX_RESIZE_HEIGHT)throw new n.ImageError(n.ImageError.MAX_RESOLUTION_ERR);if(c=h.type||this.type||"image/jpeg",l=h.quality||90,d="undefined"!==e.typeOf(h.crop)?h.crop:!1,h.width)m=h.width,g=h.height||m;else{var y=t.getSize(i);y.w&&y.h&&(m=y.w,g=y.h)}return a=new p,a.bind("Resize",function(){r.call(o)}),a.bind("Load",function(){a.downsize(m,g,d,!1)}),a.clone(this,!1),a}catch(w){this.trigger("error",w)}},destroy:function(){this.ruid&&(this.getRuntime().exec.call(this,"Image","destroy"),this.disconnectRuntime()),this.unbindAll()}})}var h=["progress","load","error","resize","embedded"];return p.MAX_RESIZE_WIDTH=6500,p.MAX_RESIZE_HEIGHT=6500,p.prototype=c.instance,p}),i(D,[u,p,g,d],function(e,t,n,i){function r(t){var r=this,s=n.capTest,u=n.capTrue,c=e.extend({access_binary:s(window.FileReader||window.File&&window.File.getAsDataURL),access_image_binary:function(){return r.can("access_binary")&&!!a.Image},display_media:s(i.can("create_canvas")||i.can("use_data_uri_over32kb")),do_cors:s(window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest),drag_and_drop:s(function(){var e=document.createElement("div");return("draggable"in e||"ondragstart"in e&&"ondrop"in e)&&("IE"!==i.browser||i.version>9)}()),filter_by_extension:s(function(){return"Chrome"===i.browser&&i.version>=28||"IE"===i.browser&&i.version>=10}()),return_response_headers:u,return_response_type:function(e){return"json"===e&&window.JSON?!0:i.can("return_response_type",e)},return_status_code:u,report_upload_progress:s(window.XMLHttpRequest&&(new XMLHttpRequest).upload),resize_image:function(){return r.can("access_binary")&&i.can("create_canvas")},select_file:function(){return i.can("use_fileinput")&&window.File},select_folder:function(){return r.can("select_file")&&"Chrome"===i.browser&&i.version>=21},select_multiple:function(){return!(!r.can("select_file")||"Safari"===i.browser&&"Windows"===i.os||"iOS"===i.os&&i.verComp(i.osVersion,"7.0.4","<"))},send_binary_string:s(window.XMLHttpRequest&&((new XMLHttpRequest).sendAsBinary||window.Uint8Array&&window.ArrayBuffer)),send_custom_headers:s(window.XMLHttpRequest),send_multipart:function(){return!!(window.XMLHttpRequest&&(new XMLHttpRequest).upload&&window.FormData)||r.can("send_binary_string")},slice_blob:s(window.File&&(File.prototype.mozSlice||File.prototype.webkitSlice||File.prototype.slice)),stream_upload:function(){return r.can("slice_blob")&&r.can("send_multipart")},summon_file_dialog:s(function(){return"Firefox"===i.browser&&i.version>=4||"Opera"===i.browser&&i.version>=12||"IE"===i.browser&&i.version>=10||!!~e.inArray(i.browser,["Chrome","Safari"])}()),upload_filesize:u},arguments[2]);n.call(this,t,arguments[1]||o,c),e.extend(this,{init:function(){this.trigger("Init")},destroy:function(e){return function(){e.call(r),e=r=null}}(this.destroy)}),e.extend(this.getShim(),a)}var o="html5",a={};return n.addConstructor(o,r),a}),i(N,[D,y],function(e,t){function n(){function e(e,t,n){var i;if(!window.File.prototype.slice)return(i=window.File.prototype.webkitSlice||window.File.prototype.mozSlice)?i.call(e,t,n):null;try{return e.slice(),e.slice(t,n)}catch(r){return e.slice(t,n-t)}}this.slice=function(){return new t(this.getRuntime().uid,e.apply(this,arguments))}}return e.Blob=n}),i(L,[u],function(e){function t(){this.returnValue=!1}function n(){this.cancelBubble=!0}var i={},r="moxie_"+e.guid(),o=function(o,a,s,u){var c,l;a=a.toLowerCase(),o.addEventListener?(c=s,o.addEventListener(a,c,!1)):o.attachEvent&&(c=function(){var e=window.event;e.target||(e.target=e.srcElement),e.preventDefault=t,e.stopPropagation=n,s(e)},o.attachEvent("on"+a,c)),o[r]||(o[r]=e.guid()),i.hasOwnProperty(o[r])||(i[o[r]]={}),l=i[o[r]],l.hasOwnProperty(a)||(l[a]=[]),l[a].push({func:c,orig:s,key:u})},a=function(t,n,o){var a,s;if(n=n.toLowerCase(),t[r]&&i[t[r]]&&i[t[r]][n]){a=i[t[r]][n];for(var u=a.length-1;u>=0&&(a[u].orig!==o&&a[u].key!==o||(t.removeEventListener?t.removeEventListener(n,a[u].func,!1):t.detachEvent&&t.detachEvent("on"+n,a[u].func),a[u].orig=null,a[u].func=null,a.splice(u,1),o===s));u--);if(a.length||delete i[t[r]][n],e.isEmptyObj(i[t[r]])){delete i[t[r]];try{delete t[r]}catch(c){t[r]=s}}}},s=function(t,n){t&&t[r]&&e.each(i[t[r]],function(e,i){a(t,i,n)})};return{addEvent:o,removeEvent:a,removeAllEvents:s}}),i(M,[D,u,f,L,l,d],function(e,t,n,i,r,o){function a(){var e=[],a;t.extend(this,{init:function(s){var u=this,c=u.getRuntime(),l,d,f,p,h,m;a=s,e=[],f=a.accept.mimes||r.extList2mimes(a.accept,c.can("filter_by_extension")),d=c.getShimContainer(),d.innerHTML='<input id="'+c.uid+'" type="file" style="font-size:999px;opacity:0;"'+(a.multiple&&c.can("select_multiple")?"multiple":"")+(a.directory&&c.can("select_folder")?"webkitdirectory directory":"")+(f?' accept="'+f.join(",")+'"':"")+" />",l=n.get(c.uid),t.extend(l.style,{position:"absolute",top:0,left:0,width:"100%",height:"100%"}),p=n.get(a.browse_button),c.can("summon_file_dialog")&&("static"===n.getStyle(p,"position")&&(p.style.position="relative"),h=parseInt(n.getStyle(p,"z-index"),10)||1,p.style.zIndex=h,d.style.zIndex=h-1,i.addEvent(p,"click",function(e){var t=n.get(c.uid);t&&!t.disabled&&t.click(),e.preventDefault()},u.uid)),m=c.can("summon_file_dialog")?p:d,i.addEvent(m,"mouseover",function(){u.trigger("mouseenter")},u.uid),i.addEvent(m,"mouseout",function(){u.trigger("mouseleave")},u.uid),i.addEvent(m,"mousedown",function(){u.trigger("mousedown")},u.uid),i.addEvent(n.get(a.container),"mouseup",function(){u.trigger("mouseup")},u.uid),l.onchange=function g(){if(e=[],a.directory?t.each(this.files,function(t){"."!==t.name&&e.push(t)}):e=[].slice.call(this.files),"IE"!==o.browser)this.value="";else{var n=this.cloneNode(!0);this.parentNode.replaceChild(n,this),n.onchange=g}u.trigger("change")},u.trigger({type:"ready",async:!0}),d=null},getFiles:function(){return e},disable:function(e){var t=this.getRuntime(),i;(i=n.get(t.uid))&&(i.disabled=!!e)},destroy:function(){var t=this.getRuntime(),r=t.getShim(),o=t.getShimContainer();i.removeAllEvents(o,this.uid),i.removeAllEvents(a&&n.get(a.container),this.uid),i.removeAllEvents(a&&n.get(a.browse_button),this.uid),o&&(o.innerHTML=""),r.removeInstance(this.uid),e=a=o=r=null}})}return e.FileInput=a}),i(C,[D,u,f,L,l],function(e,t,n,i,r){function o(){function e(e){for(var n=[],i=0;i<e.length;i++)[].push.apply(n,e[i].extensions.split(/\s*,\s*/));return-1===t.inArray("*",n)?n:[]}function o(e){var n=r.getFileExtension(e.name);return!n||!d.length||-1!==t.inArray(n,d)}function a(e,n){var i=[];t.each(e,function(e){var t=e.webkitGetAsEntry();if(t)if(t.isFile){var n=e.getAsFile();o(n)&&l.push(n)}else i.push(t)}),i.length?s(i,n):n()}function s(e,n){var i=[];t.each(e,function(e){i.push(function(t){u(e,t)})}),t.inSeries(i,function(){n()})}function u(e,t){e.isFile?e.file(function(e){o(e)&&l.push(e),t()},function(){t()}):e.isDirectory?c(e,t):t()}function c(e,t){function n(e){r.readEntries(function(t){t.length?([].push.apply(i,t),n(e)):e()},e)}var i=[],r=e.createReader();n(function(){s(i,t)})}var l=[],d=[],f;t.extend(this,{init:function(n){var r=this,s;f=n,d=e(f.accept),s=f.container,i.addEvent(s,"dragover",function(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="copy"},r.uid),i.addEvent(s,"drop",function(e){e.preventDefault(),e.stopPropagation(),l=[],e.dataTransfer.items&&e.dataTransfer.items[0].webkitGetAsEntry?a(e.dataTransfer.items,function(){r.trigger("drop")}):(t.each(e.dataTransfer.files,function(e){o(e)&&l.push(e)}),r.trigger("drop"))},r.uid),i.addEvent(s,"dragenter",function(e){e.preventDefault(),e.stopPropagation(),r.trigger("dragenter")},r.uid),i.addEvent(s,"dragleave",function(e){e.preventDefault(),e.stopPropagation(),r.trigger("dragleave")},r.uid)},getFiles:function(){return l},destroy:function(){i.removeAllEvents(f&&n.get(f.container),this.uid),l=d=f=null}})}return e.FileDrop=o}),i(F,[D,m,u],function(e,t,n){function i(){function e(e){return t.atob(e.substring(e.indexOf("base64,")+7))}var i,r=!1;n.extend(this,{read:function(e,t){var o=this;i=new window.FileReader,i.addEventListener("progress",function(e){o.trigger(e)}),i.addEventListener("load",function(e){o.trigger(e)}),i.addEventListener("error",function(e){o.trigger(e,i.error)}),i.addEventListener("loadend",function(){i=null}),"function"===n.typeOf(i[e])?(r=!1,i[e](t.getSource())):"readAsBinaryString"===e&&(r=!0,i.readAsDataURL(t.getSource()))},getResult:function(){return i&&i.result?r?e(i.result):i.result:null},abort:function(){i&&i.abort()},destroy:function(){i=null}})}return e.FileReader=i}),i(H,[D,u,l,b,w,y,S,p,d],function(e,t,n,i,r,o,a,s,u){function c(){function e(e,t){var n=this,i,r;i=t.getBlob().getSource(),r=new window.FileReader,r.onload=function(){t.append(t.getBlobName(),new o(null,{type:i.type,data:r.result})),f.send.call(n,e,t)},r.readAsBinaryString(i)}function c(){return!window.XMLHttpRequest||"IE"===u.browser&&u.version<8?function(){for(var e=["Msxml2.XMLHTTP.6.0","Microsoft.XMLHTTP"],t=0;t<e.length;t++)try{return new ActiveXObject(e[t])}catch(n){}}():new window.XMLHttpRequest}function l(e){var t=e.responseXML,n=e.responseText;return"IE"===u.browser&&n&&t&&!t.documentElement&&/[^\/]+\/[^\+]+\+xml/.test(e.getResponseHeader("Content-Type"))&&(t=new window.ActiveXObject("Microsoft.XMLDOM"),t.async=!1,t.validateOnParse=!1,t.loadXML(n)),t&&("IE"===u.browser&&0!==t.parseError||!t.documentElement||"parsererror"===t.documentElement.tagName)?null:t}function d(e){var t="----moxieboundary"+(new Date).getTime(),n="--",i="\r\n",r="",a=this.getRuntime();if(!a.can("send_binary_string"))throw new s.RuntimeError(s.RuntimeError.NOT_SUPPORTED_ERR);return p.setRequestHeader("Content-Type","multipart/form-data; boundary="+t),e.each(function(e,a){r+=e instanceof o?n+t+i+'Content-Disposition: form-data; name="'+a+'"; filename="'+unescape(encodeURIComponent(e.name||"blob"))+'"'+i+"Content-Type: "+(e.type||"application/octet-stream")+i+i+e.getSource()+i:n+t+i+'Content-Disposition: form-data; name="'+a+'"'+i+i+unescape(encodeURIComponent(e))+i}),r+=n+t+n+i}var f=this,p,h;t.extend(this,{send:function(n,r){var s=this,l="Mozilla"===u.browser&&u.version>=4&&u.version<7,f="Android Browser"===u.browser,m=!1;if(h=n.url.replace(/^.+?\/([\w\-\.]+)$/,"$1").toLowerCase(),p=c(),p.open(n.method,n.url,n.async,n.user,n.password),r instanceof o)r.isDetached()&&(m=!0),r=r.getSource();else if(r instanceof a){if(r.hasBlob())if(r.getBlob().isDetached())r=d.call(s,r),m=!0;else if((l||f)&&"blob"===t.typeOf(r.getBlob().getSource())&&window.FileReader)return e.call(s,n,r),void 0;if(r instanceof a){var g=new window.FormData;r.each(function(e,t){e instanceof o?g.append(t,e.getSource()):g.append(t,e)}),r=g}}p.upload?(n.withCredentials&&(p.withCredentials=!0),p.addEventListener("load",function(e){s.trigger(e)}),p.addEventListener("error",function(e){s.trigger(e)}),p.addEventListener("progress",function(e){s.trigger(e)}),p.upload.addEventListener("progress",function(e){s.trigger({type:"UploadProgress",loaded:e.loaded,total:e.total})})):p.onreadystatechange=function v(){switch(p.readyState){case 1:break;case 2:break;case 3:var e,t;try{i.hasSameOrigin(n.url)&&(e=p.getResponseHeader("Content-Length")||0),p.responseText&&(t=p.responseText.length)}catch(r){e=t=0}s.trigger({type:"progress",lengthComputable:!!e,total:parseInt(e,10),loaded:t});break;case 4:p.onreadystatechange=function(){},0===p.status?s.trigger("error"):s.trigger("load")}},t.isEmptyObj(n.headers)||t.each(n.headers,function(e,t){p.setRequestHeader(t,e)}),""!==n.responseType&&"responseType"in p&&(p.responseType="json"!==n.responseType||u.can("return_response_type","json")?n.responseType:"text"),m?p.sendAsBinary?p.sendAsBinary(r):function(){for(var e=new Uint8Array(r.length),t=0;t<r.length;t++)e[t]=255&r.charCodeAt(t);p.send(e.buffer)}():p.send(r),s.trigger("loadstart")},getStatus:function(){try{if(p)return p.status}catch(e){}return 0},getResponse:function(e){var t=this.getRuntime();try{switch(e){case"blob":var i=new r(t.uid,p.response),o=p.getResponseHeader("Content-Disposition");if(o){var a=o.match(/filename=([\'\"'])([^\1]+)\1/);a&&(h=a[2])}return i.name=h,i.type||(i.type=n.getFileMime(h)),i;case"json":return u.can("return_response_type","json")?p.response:200===p.status&&window.JSON?JSON.parse(p.responseText):null;case"document":return l(p);default:return""!==p.responseText?p.responseText:null}}catch(s){return null}},getAllResponseHeaders:function(){try{return p.getAllResponseHeaders()}catch(e){}return""},abort:function(){p&&p.abort()},destroy:function(){f=h=null}})}return e.XMLHttpRequest=c}),i(P,[],function(){return function(){function e(e,t){var n=r?0:-8*(t-1),i=0,a;for(a=0;t>a;a++)i|=o.charCodeAt(e+a)<<Math.abs(n+8*a);return i}function n(e,t,n){n=3===arguments.length?n:o.length-t-1,o=o.substr(0,t)+e+o.substr(n+t)}function i(e,t,i){var o="",a=r?0:-8*(i-1),s;for(s=0;i>s;s++)o+=String.fromCharCode(255&t>>Math.abs(a+8*s));n(o,e,i)}var r=!1,o;return{II:function(e){return e===t?r:(r=e,void 0)},init:function(e){r=!1,o=e},SEGMENT:function(e,t,i){switch(arguments.length){case 1:return o.substr(e,o.length-e-1);case 2:return o.substr(e,t);case 3:n(i,e,t);break;default:return o}},BYTE:function(t){return e(t,1)},SHORT:function(t){return e(t,2)},LONG:function(n,r){return r===t?e(n,4):(i(n,r,4),void 0)},SLONG:function(t){var n=e(t,4);return n>2147483647?n-4294967296:n},STRING:function(t,n){var i="";for(n+=t;n>t;t++)i+=String.fromCharCode(e(t,1));return i}}}}),i(k,[P],function(e){return function t(n){var i=[],r,o,a,s=0;if(r=new e,r.init(n),65496===r.SHORT(0)){for(o=2;o<=n.length;)if(a=r.SHORT(o),a>=65488&&65495>=a)o+=2;else{if(65498===a||65497===a)break;s=r.SHORT(o+2)+2,a>=65505&&65519>=a&&i.push({hex:a,name:"APP"+(15&a),start:o,length:s,segment:r.SEGMENT(o,s)}),o+=s}return r.init(null),{headers:i,restore:function(e){var t,n;for(r.init(e),o=65504==r.SHORT(2)?4+r.SHORT(4):2,n=0,t=i.length;t>n;n++)r.SEGMENT(o,0,i[n].segment),o+=i[n].length;return e=r.SEGMENT(),r.init(null),e},strip:function(e){var n,i,o;for(i=new t(e),n=i.headers,i.purge(),r.init(e),o=n.length;o--;)r.SEGMENT(n[o].start,n[o].length,"");return e=r.SEGMENT(),r.init(null),e},get:function(e){for(var t=[],n=0,r=i.length;r>n;n++)i[n].name===e.toUpperCase()&&t.push(i[n].segment);return t},set:function(e,t){var n=[],r,o,a;for("string"==typeof t?n.push(t):n=t,r=o=0,a=i.length;a>r&&(i[r].name===e.toUpperCase()&&(i[r].segment=n[o],i[r].length=n[o].length,o++),!(o>=n.length));r++);},purge:function(){i=[],r.init(null),r=null}}}}}),i(U,[u,P],function(e,n){return function i(){function i(e,n){var i=a.SHORT(e),r,o,s,u,d,f,p,h,m=[],g={};for(r=0;i>r;r++)if(p=f=e+12*r+2,s=n[a.SHORT(p)],s!==t){switch(u=a.SHORT(p+=2),d=a.LONG(p+=2),p+=4,m=[],u){case 1:case 7:for(d>4&&(p=a.LONG(p)+c.tiffHeader),o=0;d>o;o++)m[o]=a.BYTE(p+o);break;case 2:d>4&&(p=a.LONG(p)+c.tiffHeader),g[s]=a.STRING(p,d-1);continue;case 3:for(d>2&&(p=a.LONG(p)+c.tiffHeader),o=0;d>o;o++)m[o]=a.SHORT(p+2*o);break;case 4:for(d>1&&(p=a.LONG(p)+c.tiffHeader),o=0;d>o;o++)m[o]=a.LONG(p+4*o);break;case 5:for(p=a.LONG(p)+c.tiffHeader,o=0;d>o;o++)m[o]=a.LONG(p+4*o)/a.LONG(p+4*o+4);break;case 9:for(p=a.LONG(p)+c.tiffHeader,o=0;d>o;o++)m[o]=a.SLONG(p+4*o);break;case 10:for(p=a.LONG(p)+c.tiffHeader,o=0;d>o;o++)m[o]=a.SLONG(p+4*o)/a.SLONG(p+4*o+4);break;default:continue}h=1==d?m[0]:m,g[s]=l.hasOwnProperty(s)&&"object"!=typeof h?l[s][h]:h}return g}function r(){var e=c.tiffHeader;return a.II(18761==a.SHORT(e)),42!==a.SHORT(e+=2)?!1:(c.IFD0=c.tiffHeader+a.LONG(e+=2),u=i(c.IFD0,s.tiff),"ExifIFDPointer"in u&&(c.exifIFD=c.tiffHeader+u.ExifIFDPointer,delete u.ExifIFDPointer),"GPSInfoIFDPointer"in u&&(c.gpsIFD=c.tiffHeader+u.GPSInfoIFDPointer,delete u.GPSInfoIFDPointer),!0)}function o(e,t,n){var i,r,o,u=0;if("string"==typeof t){var l=s[e.toLowerCase()];for(var d in l)if(l[d]===t){t=d;break}}i=c[e.toLowerCase()+"IFD"],r=a.SHORT(i);for(var f=0;r>f;f++)if(o=i+12*f+2,a.SHORT(o)==t){u=o+8;break}return u?(a.LONG(u,n),!0):!1}var a,s,u,c={},l;return a=new n,s={tiff:{274:"Orientation",270:"ImageDescription",271:"Make",272:"Model",305:"Software",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer"},exif:{36864:"ExifVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",36867:"DateTimeOriginal",33434:"ExposureTime",33437:"FNumber",34855:"ISOSpeedRatings",37377:"ShutterSpeedValue",37378:"ApertureValue",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37386:"FocalLength",41986:"ExposureMode",41987:"WhiteBalance",41990:"SceneCaptureType",41988:"DigitalZoomRatio",41992:"Contrast",41993:"Saturation",41994:"Sharpness"},gps:{0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude"}},l={ColorSpace:{1:"sRGB",0:"Uncalibrated"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{1:"Daylight",2:"Fliorescent",3:"Tungsten",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 -5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire.",1:"Flash fired.",5:"Strobe return light not detected.",7:"Strobe return light detected.",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},ExposureMode:{0:"Auto exposure",1:"Manual exposure",2:"Auto bracket"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},GPSLatitudeRef:{N:"North latitude",S:"South latitude"},GPSLongitudeRef:{E:"East longitude",W:"West longitude"}},{init:function(e){return c={tiffHeader:10},e!==t&&e.length?(a.init(e),65505===a.SHORT(0)&&"EXIF\0"===a.STRING(4,5).toUpperCase()?r():!1):!1
},TIFF:function(){return u},EXIF:function(){var t;if(t=i(c.exifIFD,s.exif),t.ExifVersion&&"array"===e.typeOf(t.ExifVersion)){for(var n=0,r="";n<t.ExifVersion.length;n++)r+=String.fromCharCode(t.ExifVersion[n]);t.ExifVersion=r}return t},GPS:function(){var t;return t=i(c.gpsIFD,s.gps),t.GPSVersionID&&"array"===e.typeOf(t.GPSVersionID)&&(t.GPSVersionID=t.GPSVersionID.join(".")),t},setExif:function(e,t){return"PixelXDimension"!==e&&"PixelYDimension"!==e?!1:o("exif",e,t)},getBinary:function(){return a.SEGMENT()},purge:function(){a.init(null),a=u=null,c={}}}}}),i(B,[u,p,k,P,U],function(e,t,n,i,r){function o(o){function a(){for(var e=0,t,n;e<=u.length;){if(t=c.SHORT(e+=2),t>=65472&&65475>=t)return e+=5,{height:c.SHORT(e),width:c.SHORT(e+=2)};n=c.SHORT(e+=2),e+=n-2}return null}function s(){d&&l&&c&&(d.purge(),l.purge(),c.init(null),u=f=l=d=c=null)}var u,c,l,d,f,p;if(u=o,c=new i,c.init(u),65496!==c.SHORT(0))throw new t.ImageError(t.ImageError.WRONG_FORMAT);l=new n(o),d=new r,p=!!d.init(l.get("app1")[0]),f=a.call(this),e.extend(this,{type:"image/jpeg",size:u.length,width:f&&f.width||0,height:f&&f.height||0,setExif:function(t,n){return p?("object"===e.typeOf(t)?e.each(t,function(e,t){d.setExif(t,e)}):d.setExif(t,n),l.set("app1",d.getBinary()),void 0):!1},writeHeaders:function(){return arguments.length?l.restore(arguments[0]):u=l.restore(u)},stripHeaders:function(e){return l.strip(e)},purge:function(){s.call(this)}}),p&&(this.meta={tiff:d.TIFF(),exif:d.EXIF(),gps:d.GPS()})}return o}),i(z,[p,u,P],function(e,t,n){function i(i){function r(){var e,t;return e=a.call(this,8),"IHDR"==e.type?(t=e.start,{width:u.LONG(t),height:u.LONG(t+=4)}):null}function o(){u&&(u.init(null),s=d=c=l=u=null)}function a(e){var t,n,i,r;return t=u.LONG(e),n=u.STRING(e+=4,4),i=e+=4,r=u.LONG(e+t),{length:t,type:n,start:i,CRC:r}}var s,u,c,l,d;s=i,u=new n,u.init(s),function(){var t=0,n=0,i=[35152,20039,3338,6666];for(n=0;n<i.length;n++,t+=2)if(i[n]!=u.SHORT(t))throw new e.ImageError(e.ImageError.WRONG_FORMAT)}(),d=r.call(this),t.extend(this,{type:"image/png",size:s.length,width:d.width,height:d.height,purge:function(){o.call(this)}}),o.call(this)}return i}),i(G,[u,p,B,z],function(e,t,n,i){return function(r){var o=[n,i],a;a=function(){for(var e=0;e<o.length;e++)try{return new o[e](r)}catch(n){}throw new t.ImageError(t.ImageError.WRONG_FORMAT)}(),e.extend(this,{type:"",size:0,width:0,height:0,setExif:function(){},writeHeaders:function(e){return e},stripHeaders:function(e){return e},purge:function(){}}),e.extend(this,a),this.purge=function(){a.purge(),a=null}}}),i(q,[],function(){function e(e,i,r){var o=e.naturalWidth,a=e.naturalHeight,s=r.width,u=r.height,c=r.x||0,l=r.y||0,d=i.getContext("2d");t(e)&&(o/=2,a/=2);var f=1024,p=document.createElement("canvas");p.width=p.height=f;for(var h=p.getContext("2d"),m=n(e,o,a),g=0;a>g;){for(var v=g+f>a?a-g:f,y=0;o>y;){var w=y+f>o?o-y:f;h.clearRect(0,0,f,f),h.drawImage(e,-y,-g);var E=y*s/o+c<<0,_=Math.ceil(w*s/o),x=g*u/a/m+l<<0,R=Math.ceil(v*u/a/m);d.drawImage(p,0,0,w,v,E,x,_,R),y+=f}g+=f}p=h=null}function t(e){var t=e.naturalWidth,n=e.naturalHeight;if(t*n>1048576){var i=document.createElement("canvas");i.width=i.height=1;var r=i.getContext("2d");return r.drawImage(e,-t+1,0),0===r.getImageData(0,0,1,1).data[3]}return!1}function n(e,t,n){var i=document.createElement("canvas");i.width=1,i.height=n;var r=i.getContext("2d");r.drawImage(e,0,0);for(var o=r.getImageData(0,0,1,n).data,a=0,s=n,u=n;u>a;){var c=o[4*(u-1)+3];0===c?s=u:a=u,u=s+a>>1}i=null;var l=u/n;return 0===l?1:l}return{isSubsampled:t,renderTo:e}}),i(X,[D,u,p,m,w,G,q,l,d],function(e,t,n,i,r,o,a,s,u){function c(){function e(){if(!E&&!y)throw new n.ImageError(n.DOMException.INVALID_STATE_ERR);return E||y}function c(e){return i.atob(e.substring(e.indexOf("base64,")+7))}function l(e,t){return"data:"+(t||"")+";base64,"+i.btoa(e)}function d(e){var t=this;y=new Image,y.onerror=function(){g.call(this),t.trigger("error",new n.ImageError(n.ImageError.WRONG_FORMAT))},y.onload=function(){t.trigger("load")},y.src=/^data:[^;]*;base64,/.test(e)?e:l(e,x.type)}function f(e,t){var i=this,r;return window.FileReader?(r=new FileReader,r.onload=function(){t(this.result)},r.onerror=function(){i.trigger("error",new n.FileException(n.FileException.NOT_READABLE_ERR))},r.readAsDataURL(e),void 0):t(e.getAsDataURL())}function p(n,i,r,o){var a=this,s,u,c=0,l=0,d,f,p,g;if(b=o,g=this.meta&&this.meta.tiff&&this.meta.tiff.Orientation||1,-1!==t.inArray(g,[5,6,7,8])){var v=n;n=i,i=v}return d=e(),u=r?Math.max:Math.min,s=u(n/d.width,i/d.height),s>1&&(!r||o)?(this.trigger("Resize"),void 0):(E||(E=document.createElement("canvas")),f=Math.round(d.width*s),p=Math.round(d.height*s),r?(E.width=n,E.height=i,f>n&&(c=Math.round((f-n)/2)),p>i&&(l=Math.round((p-i)/2))):(E.width=f,E.height=p),b||m(E.width,E.height,g),h.call(this,d,E,-c,-l,f,p),this.width=E.width,this.height=E.height,R=!0,a.trigger("Resize"),void 0)}function h(e,t,n,i,r,o){if("iOS"===u.OS)a.renderTo(e,t,{width:r,height:o,x:n,y:i});else{var s=t.getContext("2d");s.drawImage(e,n,i,r,o)}}function m(e,t,n){switch(n){case 5:case 6:case 7:case 8:E.width=t,E.height=e;break;default:E.width=e,E.height=t}var i=E.getContext("2d");switch(n){case 2:i.translate(e,0),i.scale(-1,1);break;case 3:i.translate(e,t),i.rotate(Math.PI);break;case 4:i.translate(0,t),i.scale(1,-1);break;case 5:i.rotate(.5*Math.PI),i.scale(1,-1);break;case 6:i.rotate(.5*Math.PI),i.translate(0,-t);break;case 7:i.rotate(.5*Math.PI),i.translate(e,-t),i.scale(-1,1);break;case 8:i.rotate(-.5*Math.PI),i.translate(-e,0)}}function g(){w&&(w.purge(),w=null),_=y=E=x=null,R=!1}var v=this,y,w,E,_,x,R=!1,b=!0;t.extend(this,{loadFromBlob:function(e){var t=this,i=t.getRuntime(),r=arguments.length>1?arguments[1]:!0;if(!i.can("access_binary"))throw new n.RuntimeError(n.RuntimeError.NOT_SUPPORTED_ERR);return x=e,e.isDetached()?(_=e.getSource(),d.call(this,_),void 0):(f.call(this,e.getSource(),function(e){r&&(_=c(e)),d.call(t,e)}),void 0)},loadFromImage:function(e,t){this.meta=e.meta,x=new r(null,{name:e.name,size:e.size,type:e.type}),d.call(this,t?_=e.getAsBinaryString():e.getAsDataURL())},getInfo:function(){var t=this.getRuntime(),n;return!w&&_&&t.can("access_image_binary")&&(w=new o(_)),n={width:e().width||0,height:e().height||0,type:x.type||s.getFileMime(x.name),size:_&&_.length||x.size||0,name:x.name||"",meta:w&&w.meta||this.meta||{}}},downsize:function(){p.apply(this,arguments)},getAsCanvas:function(){return E&&(E.id=this.uid+"_canvas"),E},getAsBlob:function(e,t){return e!==this.type&&p.call(this,this.width,this.height,!1),new r(null,{name:x.name||"",type:e,data:v.getAsBinaryString.call(this,e,t)})},getAsDataURL:function(e){var t=arguments[1]||90;if(!R)return y.src;if("image/jpeg"!==e)return E.toDataURL("image/png");try{return E.toDataURL("image/jpeg",t/100)}catch(n){return E.toDataURL("image/jpeg")}},getAsBinaryString:function(e,t){if(!R)return _||(_=c(v.getAsDataURL(e,t))),_;if("image/jpeg"!==e)_=c(v.getAsDataURL(e,t));else{var n;t||(t=90);try{n=E.toDataURL("image/jpeg",t/100)}catch(i){n=E.toDataURL("image/jpeg")}_=c(n),w&&(_=w.stripHeaders(_),b&&(w.meta&&w.meta.exif&&w.setExif({PixelXDimension:this.width,PixelYDimension:this.height}),_=w.writeHeaders(_)),w.purge(),w=null)}return R=!1,_},destroy:function(){v=null,g.call(this),this.getRuntime().getShim().removeInstance(this.uid)}})}return e.Image=c}),i(j,[u,d,f,p,g],function(e,t,n,i,r){function o(){var e;try{e=navigator.plugins["Shockwave Flash"],e=e.description}catch(t){try{e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")}catch(n){e="0.0"}}return e=e.match(/\d+/g),parseFloat(e[0]+"."+e[1])}function a(a){var c=this,l;a=e.extend({swf_url:t.swf_url},a),r.call(this,a,s,{access_binary:function(e){return e&&"browser"===c.mode},access_image_binary:function(e){return e&&"browser"===c.mode},display_media:r.capTrue,do_cors:r.capTrue,drag_and_drop:!1,report_upload_progress:function(){return"client"===c.mode},resize_image:r.capTrue,return_response_headers:!1,return_response_type:function(t){return"json"===t&&window.JSON?!0:!e.arrayDiff(t,["","text","document"])||"browser"===c.mode},return_status_code:function(t){return"browser"===c.mode||!e.arrayDiff(t,[200,404])},select_file:r.capTrue,select_multiple:r.capTrue,send_binary_string:function(e){return e&&"browser"===c.mode},send_browser_cookies:function(e){return e&&"browser"===c.mode},send_custom_headers:function(e){return e&&"browser"===c.mode},send_multipart:r.capTrue,slice_blob:r.capTrue,stream_upload:function(e){return e&&"browser"===c.mode},summon_file_dialog:!1,upload_filesize:function(t){return e.parseSizeStr(t)<=2097152||"client"===c.mode},use_http_method:function(t){return!e.arrayDiff(t,["GET","POST"])}},{access_binary:function(e){return e?"browser":"client"},access_image_binary:function(e){return e?"browser":"client"},report_upload_progress:function(e){return e?"browser":"client"},return_response_type:function(t){return e.arrayDiff(t,["","text","json","document"])?"browser":["client","browser"]},return_status_code:function(t){return e.arrayDiff(t,[200,404])?"browser":["client","browser"]},send_binary_string:function(e){return e?"browser":"client"},send_browser_cookies:function(e){return e?"browser":"client"},send_custom_headers:function(e){return e?"browser":"client"},stream_upload:function(e){return e?"client":"browser"},upload_filesize:function(t){return e.parseSizeStr(t)>=2097152?"client":"browser"}},"client"),o()<10&&(this.mode=!1),e.extend(this,{getShim:function(){return n.get(this.uid)},shimExec:function(e,t){var n=[].slice.call(arguments,2);return c.getShim().exec(this.uid,e,t,n)},init:function(){var n,r,o;o=this.getShimContainer(),e.extend(o.style,{position:"absolute",top:"-8px",left:"-8px",width:"9px",height:"9px",overflow:"hidden"}),n='<object id="'+this.uid+'" type="application/x-shockwave-flash" data="'+a.swf_url+'" ',"IE"===t.browser&&(n+='classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '),n+='width="100%" height="100%" style="outline:0"><param name="movie" value="'+a.swf_url+'" />'+'<param name="flashvars" value="uid='+escape(this.uid)+"&target="+t.global_event_dispatcher+'" />'+'<param name="wmode" value="transparent" />'+'<param name="allowscriptaccess" value="always" />'+"</object>","IE"===t.browser?(r=document.createElement("div"),o.appendChild(r),r.outerHTML=n,r=o=null):o.innerHTML=n,l=setTimeout(function(){c&&!c.initialized&&c.trigger("Error",new i.RuntimeError(i.RuntimeError.NOT_INIT_ERR))},5e3)},destroy:function(e){return function(){e.call(c),clearTimeout(l),a=l=e=c=null}}(this.destroy)},u)}var s="flash",u={};return r.addConstructor(s,a),u}),i(V,[j,y],function(e,t){var n={slice:function(e,n,i,r){var o=this.getRuntime();return 0>n?n=Math.max(e.size+n,0):n>0&&(n=Math.min(n,e.size)),0>i?i=Math.max(e.size+i,0):i>0&&(i=Math.min(i,e.size)),e=o.shimExec.call(this,"Blob","slice",n,i,r||""),e&&(e=new t(o.uid,e)),e}};return e.Blob=n}),i(W,[j],function(e){var t={init:function(e){this.getRuntime().shimExec.call(this,"FileInput","init",{name:e.name,accept:e.accept,multiple:e.multiple}),this.trigger("ready")}};return e.FileInput=t}),i(Y,[j,m],function(e,t){function n(e,n){switch(n){case"readAsText":return t.atob(e,"utf8");case"readAsBinaryString":return t.atob(e);case"readAsDataURL":return e}return null}var i="",r={read:function(e,t){var r=this,o=r.getRuntime();return"readAsDataURL"===e&&(i="data:"+(t.type||"")+";base64,"),r.bind("Progress",function(t,r){r&&(i+=n(r,e))}),o.shimExec.call(this,"FileReader","readAsBase64",t.uid)},getResult:function(){return i},destroy:function(){i=null}};return e.FileReader=r}),i($,[j,m],function(e,t){function n(e,n){switch(n){case"readAsText":return t.atob(e,"utf8");case"readAsBinaryString":return t.atob(e);case"readAsDataURL":return e}return null}var i={read:function(e,t){var i,r=this.getRuntime();return(i=r.shimExec.call(this,"FileReaderSync","readAsBase64",t.uid))?("readAsDataURL"===e&&(i="data:"+(t.type||"")+";base64,"+i),n(i,e,t.type)):null}};return e.FileReaderSync=i}),i(J,[j,u,y,w,T,S,O],function(e,t,n,i,r,o,a){var s={send:function(e,i){function r(){e.transport=l.mode,l.shimExec.call(c,"XMLHttpRequest","send",e,i)}function s(e,t){l.shimExec.call(c,"XMLHttpRequest","appendBlob",e,t.uid),i=null,r()}function u(e,t){var n=new a;n.bind("TransportingComplete",function(){t(this.result)}),n.transport(e.getSource(),e.type,{ruid:l.uid})}var c=this,l=c.getRuntime();if(t.isEmptyObj(e.headers)||t.each(e.headers,function(e,t){l.shimExec.call(c,"XMLHttpRequest","setRequestHeader",t,e.toString())}),i instanceof o){var d;if(i.each(function(e,t){e instanceof n?d=t:l.shimExec.call(c,"XMLHttpRequest","append",t,e)}),i.hasBlob()){var f=i.getBlob();f.isDetached()?u(f,function(e){f.destroy(),s(d,e)}):s(d,f)}else i=null,r()}else i instanceof n?i.isDetached()?u(i,function(e){i.destroy(),i=e.uid,r()}):(i=i.uid,r()):r()},getResponse:function(e){var n,o,a=this.getRuntime();if(o=a.shimExec.call(this,"XMLHttpRequest","getResponseAsBlob")){if(o=new i(a.uid,o),"blob"===e)return o;try{if(n=new r,~t.inArray(e,["","text"]))return n.readAsText(o);if("json"===e&&window.JSON)return JSON.parse(n.readAsText(o))}finally{o.destroy()}}return null},abort:function(e){var t=this.getRuntime();t.shimExec.call(this,"XMLHttpRequest","abort"),this.dispatchEvent("readystatechange"),this.dispatchEvent("abort")}};return e.XMLHttpRequest=s}),i(Z,[j,y],function(e,t){var n={getAsBlob:function(e){var n=this.getRuntime(),i=n.shimExec.call(this,"Transporter","getAsBlob",e);return i?new t(n.uid,i):null}};return e.Transporter=n}),i(K,[j,u,O,y,T],function(e,t,n,i,r){var o={loadFromBlob:function(e){function t(e){r.shimExec.call(i,"Image","loadFromBlob",e.uid),i=r=null}var i=this,r=i.getRuntime();if(e.isDetached()){var o=new n;o.bind("TransportingComplete",function(){t(o.result.getSource())}),o.transport(e.getSource(),e.type,{ruid:r.uid})}else t(e.getSource())},loadFromImage:function(e){var t=this.getRuntime();return t.shimExec.call(this,"Image","loadFromImage",e.uid)},getAsBlob:function(e,t){var n=this.getRuntime(),r=n.shimExec.call(this,"Image","getAsBlob",e,t);return r?new i(n.uid,r):null},getAsDataURL:function(){var e=this.getRuntime(),t=e.Image.getAsBlob.apply(this,arguments),n;return t?(n=new r,n.readAsDataURL(t)):null}};return e.Image=o}),i(Q,[u,d,f,p,g],function(e,t,n,i,r){function o(e){var t=!1,n=null,i,r,o,a,s,u=0;try{try{n=new ActiveXObject("AgControl.AgControl"),n.IsVersionSupported(e)&&(t=!0),n=null}catch(c){var l=navigator.plugins["Silverlight Plug-In"];if(l){for(i=l.description,"1.0.30226.2"===i&&(i="2.0.30226.2"),r=i.split(".");r.length>3;)r.pop();for(;r.length<4;)r.push(0);for(o=e.split(".");o.length>4;)o.pop();do a=parseInt(o[u],10),s=parseInt(r[u],10),u++;while(u<o.length&&a===s);s>=a&&!isNaN(a)&&(t=!0)}}}catch(d){t=!1}return t}function a(a){var c=this,l;a=e.extend({xap_url:t.xap_url},a),r.call(this,a,s,{access_binary:r.capTrue,access_image_binary:r.capTrue,display_media:r.capTrue,do_cors:r.capTrue,drag_and_drop:!1,report_upload_progress:r.capTrue,resize_image:r.capTrue,return_response_headers:function(e){return e&&"client"===c.mode},return_response_type:function(e){return"json"!==e?!0:!!window.JSON},return_status_code:function(t){return"client"===c.mode||!e.arrayDiff(t,[200,404])},select_file:r.capTrue,select_multiple:r.capTrue,send_binary_string:r.capTrue,send_browser_cookies:function(e){return e&&"browser"===c.mode},send_custom_headers:function(e){return e&&"client"===c.mode},send_multipart:r.capTrue,slice_blob:r.capTrue,stream_upload:!0,summon_file_dialog:!1,upload_filesize:r.capTrue,use_http_method:function(t){return"client"===c.mode||!e.arrayDiff(t,["GET","POST"])}},{return_response_headers:function(e){return e?"client":"browser"},return_status_code:function(t){return e.arrayDiff(t,[200,404])?"client":["client","browser"]},send_browser_cookies:function(e){return e?"browser":"client"},send_custom_headers:function(e){return e?"client":"browser"},use_http_method:function(t){return e.arrayDiff(t,["GET","POST"])?"client":["client","browser"]}}),o("2.0.31005.0")&&"Opera"!==t.browser||(this.mode=!1),e.extend(this,{getShim:function(){return n.get(this.uid).content.Moxie},shimExec:function(e,t){var n=[].slice.call(arguments,2);return c.getShim().exec(this.uid,e,t,n)},init:function(){var e;e=this.getShimContainer(),e.innerHTML='<object id="'+this.uid+'" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;">'+'<param name="source" value="'+a.xap_url+'"/>'+'<param name="background" value="Transparent"/>'+'<param name="windowless" value="true"/>'+'<param name="enablehtmlaccess" value="true"/>'+'<param name="initParams" value="uid='+this.uid+",target="+t.global_event_dispatcher+'"/>'+"</object>",l=setTimeout(function(){c&&!c.initialized&&c.trigger("Error",new i.RuntimeError(i.RuntimeError.NOT_INIT_ERR))},"Windows"!==t.OS?1e4:5e3)},destroy:function(e){return function(){e.call(c),clearTimeout(l),a=l=e=c=null}}(this.destroy)},u)}var s="silverlight",u={};return r.addConstructor(s,a),u}),i(et,[Q,u,V],function(e,t,n){return e.Blob=t.extend({},n)}),i(tt,[Q],function(e){var t={init:function(e){function t(e){for(var t="",n=0;n<e.length;n++)t+=(""!==t?"|":"")+e[n].title+" | *."+e[n].extensions.replace(/,/g,";*.");return t}this.getRuntime().shimExec.call(this,"FileInput","init",t(e.accept),e.name,e.multiple),this.trigger("ready")}};return e.FileInput=t}),i(nt,[Q,f,L],function(e,t,n){var i={init:function(){var e=this,i=e.getRuntime(),r;return r=i.getShimContainer(),n.addEvent(r,"dragover",function(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="copy"},e.uid),n.addEvent(r,"dragenter",function(e){e.preventDefault();var n=t.get(i.uid).dragEnter(e);n&&e.stopPropagation()},e.uid),n.addEvent(r,"drop",function(e){e.preventDefault();var n=t.get(i.uid).dragDrop(e);n&&e.stopPropagation()},e.uid),i.shimExec.call(this,"FileDrop","init")}};return e.FileDrop=i}),i(it,[Q,u,Y],function(e,t,n){return e.FileReader=t.extend({},n)}),i(rt,[Q,u,$],function(e,t,n){return e.FileReaderSync=t.extend({},n)}),i(ot,[Q,u,J],function(e,t,n){return e.XMLHttpRequest=t.extend({},n)}),i(at,[Q,u,Z],function(e,t,n){return e.Transporter=t.extend({},n)}),i(st,[Q,u,K],function(e,t,n){return e.Image=t.extend({},n,{getInfo:function(){var e=this.getRuntime(),n=["tiff","exif","gps"],i={meta:{}},r=e.shimExec.call(this,"Image","getInfo");return r.meta&&t.each(n,function(e){var t=r.meta[e],n,o,a,s;if(t&&t.keys)for(i.meta[e]={},o=0,a=t.keys.length;a>o;o++)n=t.keys[o],s=t[n],s&&(/^(\d|[1-9]\d+)$/.test(s)?s=parseInt(s,10):/^\d*\.\d+$/.test(s)&&(s=parseFloat(s)),i.meta[e][n]=s)}),i.width=parseInt(r.width,10),i.height=parseInt(r.height,10),i.size=parseInt(r.size,10),i.type=r.type,i.name=r.name,i}})}),i(ut,[u,p,g,d],function(e,t,n,i){function r(t){var r=this,s=n.capTest,u=n.capTrue;n.call(this,t,o,{access_binary:s(window.FileReader||window.File&&File.getAsDataURL),access_image_binary:!1,display_media:s(a.Image&&(i.can("create_canvas")||i.can("use_data_uri_over32kb"))),do_cors:!1,drag_and_drop:!1,filter_by_extension:s(function(){return"Chrome"===i.browser&&i.version>=28||"IE"===i.browser&&i.version>=10}()),resize_image:function(){return a.Image&&r.can("access_binary")&&i.can("create_canvas")},report_upload_progress:!1,return_response_headers:!1,return_response_type:function(t){return"json"===t&&window.JSON?!0:!!~e.inArray(t,["text","document",""])},return_status_code:function(t){return!e.arrayDiff(t,[200,404])},select_file:function(){return i.can("use_fileinput")},select_multiple:!1,send_binary_string:!1,send_custom_headers:!1,send_multipart:!0,slice_blob:!1,stream_upload:function(){return r.can("select_file")},summon_file_dialog:s(function(){return"Firefox"===i.browser&&i.version>=4||"Opera"===i.browser&&i.version>=12||!!~e.inArray(i.browser,["Chrome","Safari"])}()),upload_filesize:u,use_http_method:function(t){return!e.arrayDiff(t,["GET","POST"])}}),e.extend(this,{init:function(){this.trigger("Init")},destroy:function(e){return function(){e.call(r),e=r=null}}(this.destroy)}),e.extend(this.getShim(),a)}var o="html4",a={};return n.addConstructor(o,r),a}),i(ct,[ut,u,f,L,l,d],function(e,t,n,i,r,o){function a(){function e(){var r=this,l=r.getRuntime(),d,f,p,h,m,g;g=t.guid("uid_"),d=l.getShimContainer(),a&&(p=n.get(a+"_form"),p&&t.extend(p.style,{top:"100%"})),h=document.createElement("form"),h.setAttribute("id",g+"_form"),h.setAttribute("method","post"),h.setAttribute("enctype","multipart/form-data"),h.setAttribute("encoding","multipart/form-data"),t.extend(h.style,{overflow:"hidden",position:"absolute",top:0,left:0,width:"100%",height:"100%"}),m=document.createElement("input"),m.setAttribute("id",g),m.setAttribute("type","file"),m.setAttribute("name",c.name||"Filedata"),m.setAttribute("accept",u.join(",")),t.extend(m.style,{fontSize:"999px",opacity:0}),h.appendChild(m),d.appendChild(h),t.extend(m.style,{position:"absolute",top:0,left:0,width:"100%",height:"100%"}),"IE"===o.browser&&o.version<10&&t.extend(m.style,{filter:"progid:DXImageTransform.Microsoft.Alpha(opacity=0)"}),m.onchange=function(){var t;this.value&&(t=this.files?this.files[0]:{name:this.value},s=[t],this.onchange=function(){},e.call(r),r.bind("change",function i(){var e=n.get(g),t=n.get(g+"_form"),o;r.unbind("change",i),r.files.length&&e&&t&&(o=r.files[0],e.setAttribute("id",o.uid),t.setAttribute("id",o.uid+"_form"),t.setAttribute("target",o.uid+"_iframe")),e=t=null},998),m=h=null,r.trigger("change"))},l.can("summon_file_dialog")&&(f=n.get(c.browse_button),i.removeEvent(f,"click",r.uid),i.addEvent(f,"click",function(e){m&&!m.disabled&&m.click(),e.preventDefault()},r.uid)),a=g,d=p=f=null}var a,s=[],u=[],c;t.extend(this,{init:function(t){var o=this,a=o.getRuntime(),s;c=t,u=t.accept.mimes||r.extList2mimes(t.accept,a.can("filter_by_extension")),s=a.getShimContainer(),function(){var e,r,u;e=n.get(t.browse_button),a.can("summon_file_dialog")&&("static"===n.getStyle(e,"position")&&(e.style.position="relative"),r=parseInt(n.getStyle(e,"z-index"),10)||1,e.style.zIndex=r,s.style.zIndex=r-1),u=a.can("summon_file_dialog")?e:s,i.addEvent(u,"mouseover",function(){o.trigger("mouseenter")},o.uid),i.addEvent(u,"mouseout",function(){o.trigger("mouseleave")},o.uid),i.addEvent(u,"mousedown",function(){o.trigger("mousedown")},o.uid),i.addEvent(n.get(t.container),"mouseup",function(){o.trigger("mouseup")},o.uid),e=null}(),e.call(this),s=null,o.trigger({type:"ready",async:!0})},getFiles:function(){return s},disable:function(e){var t;(t=n.get(a))&&(t.disabled=!!e)},destroy:function(){var e=this.getRuntime(),t=e.getShim(),r=e.getShimContainer();i.removeAllEvents(r,this.uid),i.removeAllEvents(c&&n.get(c.container),this.uid),i.removeAllEvents(c&&n.get(c.browse_button),this.uid),r&&(r.innerHTML=""),t.removeInstance(this.uid),a=s=u=c=r=t=null}})}return e.FileInput=a}),i(lt,[ut,F],function(e,t){return e.FileReader=t}),i(dt,[ut,u,f,b,p,L,y,S],function(e,t,n,i,r,o,a,s){function u(){function e(e){var t=this,i,r,a,s,u=!1;if(l){if(i=l.id.replace(/_iframe$/,""),r=n.get(i+"_form")){for(a=r.getElementsByTagName("input"),s=a.length;s--;)switch(a[s].getAttribute("type")){case"hidden":a[s].parentNode.removeChild(a[s]);break;case"file":u=!0}a=[],u||r.parentNode.removeChild(r),r=null}setTimeout(function(){o.removeEvent(l,"load",t.uid),l.parentNode&&l.parentNode.removeChild(l);var n=t.getRuntime().getShimContainer();n.children.length||n.parentNode.removeChild(n),n=l=null,e()},1)}}var u,c,l;t.extend(this,{send:function(d,f){function p(){var n=m.getShimContainer()||document.body,r=document.createElement("div");r.innerHTML='<iframe id="'+g+'_iframe" name="'+g+'_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>',l=r.firstChild,n.appendChild(l),o.addEvent(l,"load",function(){var n;try{n=l.contentWindow.document||l.contentDocument||window.frames[l.id].document,/^4(0[0-9]|1[0-7]|2[2346])\s/.test(n.title)?u=n.title.replace(/^(\d+).*$/,"$1"):(u=200,c=t.trim(n.body.innerHTML),h.trigger({type:"progress",loaded:c.length,total:c.length}),w&&h.trigger({type:"uploadprogress",loaded:w.size||1025,total:w.size||1025}))}catch(r){if(!i.hasSameOrigin(d.url))return e.call(h,function(){h.trigger("error")}),void 0;u=404}e.call(h,function(){h.trigger("load")})},h.uid)}var h=this,m=h.getRuntime(),g,v,y,w;if(u=c=null,f instanceof s&&f.hasBlob()){if(w=f.getBlob(),g=w.uid,y=n.get(g),v=n.get(g+"_form"),!v)throw new r.DOMException(r.DOMException.NOT_FOUND_ERR)}else g=t.guid("uid_"),v=document.createElement("form"),v.setAttribute("id",g+"_form"),v.setAttribute("method",d.method),v.setAttribute("enctype","multipart/form-data"),v.setAttribute("encoding","multipart/form-data"),v.setAttribute("target",g+"_iframe"),m.getShimContainer().appendChild(v);f instanceof s&&f.each(function(e,n){if(e instanceof a)y&&y.setAttribute("name",n);else{var i=document.createElement("input");t.extend(i,{type:"hidden",name:n,value:e}),y?v.insertBefore(i,y):v.appendChild(i)}}),v.setAttribute("action",d.url),p(),v.submit(),h.trigger("loadstart")},getStatus:function(){return u},getResponse:function(e){if("json"===e&&"string"===t.typeOf(c)&&window.JSON)try{return JSON.parse(c.replace(/^\s*<pre[^>]*>/,"").replace(/<\/pre>\s*$/,""))}catch(n){return null}return c},abort:function(){var t=this;l&&l.contentWindow&&(l.contentWindow.stop?l.contentWindow.stop():l.contentWindow.document.execCommand?l.contentWindow.document.execCommand("Stop"):l.src="about:blank"),e.call(this,function(){t.dispatchEvent("abort")})}})}return e.XMLHttpRequest=u}),i(ft,[ut,X],function(e,t){return e.Image=t}),a([u,c,l,d,f,p,h,m,g,v,y,w,E,_,x,R,b,T,S,A,O,I,L])}(this);;(function(){"use strict";var e={},t=moxie.core.utils.Basic.inArray;return function n(r){var i,s;for(i in r)s=typeof r[i],s==="object"&&!~t(i,["Exceptions","Env","Mime"])?n(r[i]):s==="function"&&(e[i]=r[i])}(window.moxie),e.Env=window.moxie.core.utils.Env,e.Mime=window.moxie.core.utils.Mime,e.Exceptions=window.moxie.core.Exceptions,window.mOxie=e,window.o||(window.o=e),e})();
/**
 * Plupload - multi-runtime File Uploader
 * v2.1.1
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Date: 2014-01-16
 */
;(function(e,t,n){function s(e){function r(e,t,r){var i={chunks:"slice_blob",jpgresize:"send_binary_string",pngresize:"send_binary_string",progress:"report_upload_progress",multi_selection:"select_multiple",dragdrop:"drag_and_drop",drop_element:"drag_and_drop",headers:"send_custom_headers",canSendBinary:"send_binary",triggerDialog:"summon_file_dialog"};i[e]?n[i[e]]=t:r||(n[e]=t)}var t=e.required_features,n={};return typeof t=="string"?o.each(t.split(/\s*,\s*/),function(e){r(e,!0)}):typeof t=="object"?o.each(t,function(e,t){r(t,e)}):t===!0&&(e.multipart||(n.send_binary_string=!0),e.chunk_size>0&&(n.slice_blob=!0),e.resize.enabled&&(n.send_binary_string=!0),o.each(e,function(e,t){r(t,!!e,!0)})),n}var r=e.setTimeout,i={},o={VERSION:"2.1.1",STOPPED:1,STARTED:2,QUEUED:1,UPLOADING:2,FAILED:4,DONE:5,GENERIC_ERROR:-100,HTTP_ERROR:-200,IO_ERROR:-300,SECURITY_ERROR:-400,INIT_ERROR:-500,FILE_SIZE_ERROR:-600,FILE_EXTENSION_ERROR:-601,FILE_DUPLICATE_ERROR:-602,IMAGE_FORMAT_ERROR:-700,IMAGE_MEMORY_ERROR:-701,IMAGE_DIMENSIONS_ERROR:-702,mimeTypes:t.mimes,ua:t.ua,typeOf:t.typeOf,extend:t.extend,guid:t.guid,get:function(n){var r=[],i;t.typeOf(n)!=="array"&&(n=[n]);var s=n.length;while(s--)i=t.get(n[s]),i&&r.push(i);return r.length?r:null},each:t.each,getPos:t.getPos,getSize:t.getSize,xmlEncode:function(e){var t={"<":"lt",">":"gt","&":"amp",'"':"quot","'":"#39"},n=/[<>&\"\']/g;return e?(""+e).replace(n,function(e){return t[e]?"&"+t[e]+";":e}):e},toArray:t.toArray,inArray:t.inArray,addI18n:t.addI18n,translate:t.translate,isEmptyObj:t.isEmptyObj,hasClass:t.hasClass,addClass:t.addClass,removeClass:t.removeClass,getStyle:t.getStyle,addEvent:t.addEvent,removeEvent:t.removeEvent,removeAllEvents:t.removeAllEvents,cleanName:function(e){var t,n;n=[/[\300-\306]/g,"A",/[\340-\346]/g,"a",/\307/g,"C",/\347/g,"c",/[\310-\313]/g,"E",/[\350-\353]/g,"e",/[\314-\317]/g,"I",/[\354-\357]/g,"i",/\321/g,"N",/\361/g,"n",/[\322-\330]/g,"O",/[\362-\370]/g,"o",/[\331-\334]/g,"U",/[\371-\374]/g,"u"];for(t=0;t<n.length;t+=2)e=e.replace(n[t],n[t+1]);return e=e.replace(/\s+/g,"_"),e=e.replace(/[^a-z0-9_\-\.]+/gi,""),e},buildUrl:function(e,t){var n="";return o.each(t,function(e,t){n+=(n?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(e)}),n&&(e+=(e.indexOf("?")>0?"&":"?")+n),e},formatSize:function(e){function t(e,t){return Math.round(e*Math.pow(10,t))/Math.pow(10,t)}if(e===n||/\D/.test(e))return o.translate("N/A");var r=Math.pow(1024,4);return e>r?t(e/r,1)+" "+o.translate("tb"):e>(r/=1024)?t(e/r,1)+" "+o.translate("gb"):e>(r/=1024)?t(e/r,1)+" "+o.translate("mb"):e>1024?Math.round(e/1024)+" "+o.translate("kb"):e+" "+o.translate("b")},parseSize:t.parseSizeStr,predictRuntime:function(e,n){var r,i;return r=new o.Uploader(e),i=t.Runtime.thatCan(r.getOption().required_features,n||e.runtimes),r.destroy(),i},addFileFilter:function(e,t){i[e]=t}};o.addFileFilter("mime_types",function(e,t,n){e.length&&!e.regexp.test(t.name)?(this.trigger("Error",{code:o.FILE_EXTENSION_ERROR,message:o.translate("File extension error."),file:t}),n(!1)):n(!0)}),o.addFileFilter("max_file_size",function(e,t,n){var r;e=o.parseSize(e),t.size!==r&&e&&t.size>e?(this.trigger("Error",{code:o.FILE_SIZE_ERROR,message:o.translate("File size error."),file:t}),n(!1)):n(!0)}),o.addFileFilter("prevent_duplicates",function(e,t,n){if(e){var r=this.files.length;while(r--)if(t.name===this.files[r].name&&t.size===this.files[r].size){this.trigger("Error",{code:o.FILE_DUPLICATE_ERROR,message:o.translate("Duplicate file error."),file:t}),n(!1);return}}n(!0)}),o.Uploader=function(e){function g(){var e,t=0,n;if(this.state==o.STARTED){for(n=0;n<f.length;n++)!e&&f[n].status==o.QUEUED?(e=f[n],this.trigger("BeforeUpload",e)&&(e.status=o.UPLOADING,this.trigger("UploadFile",e))):t++;t==f.length&&(this.state!==o.STOPPED&&(this.state=o.STOPPED,this.trigger("StateChanged")),this.trigger("UploadComplete",f))}}function y(e){e.percent=e.size>0?Math.ceil(e.loaded/e.size*100):100,b()}function b(){var e,t;d.reset();for(e=0;e<f.length;e++)t=f[e],t.size!==n?(d.size+=t.origSize,d.loaded+=t.loaded*t.origSize/t.size):d.size=n,t.status==o.DONE?d.uploaded++:t.status==o.FAILED?d.failed++:d.queued++;d.size===n?d.percent=f.length>0?Math.ceil(d.uploaded/f.length*100):0:(d.bytesPerSec=Math.ceil(d.loaded/((+(new Date)-p||1)/1e3)),d.percent=d.size>0?Math.ceil(d.loaded/d.size*100):0)}function w(){var e=c[0]||h[0];return e?e.getRuntime().uid:!1}function E(e,n){if(e.ruid){var r=t.Runtime.getInfo(e.ruid);if(r)return r.can(n)}return!1}function S(){this.bind("FilesAdded",C),this.bind("CancelUpload",M),this.bind("BeforeUpload",k),this.bind("UploadFile",L),this.bind("UploadProgress",A),this.bind("StateChanged",O),this.bind("QueueChanged",b),this.bind("Error",D),this.bind("FileUploaded",_),this.bind("Destroy",P)}function x(e,n){var r=this,i=0,s=[],u={accept:e.filters.mime_types,runtime_order:e.runtimes,required_caps:e.required_features,preferred_caps:l,swf_url:e.flash_swf_url,xap_url:e.silverlight_xap_url};o.each(e.runtimes.split(/\s*,\s*/),function(t){e[t]&&(u[t]=e[t])}),e.browse_button&&o.each(e.browse_button,function(n){s.push(function(s){var a=new t.FileInput(o.extend({},u,{name:e.file_data_name,multiple:e.multi_selection,container:e.container,browse_button:n}));a.onready=function(){var e=t.Runtime.getInfo(this.ruid);t.extend(r.features,{chunks:e.can("slice_blob"),multipart:e.can("send_multipart"),multi_selection:e.can("select_multiple")}),i++,c.push(this),s()},a.onchange=function(){r.addFile(this.files)},a.bind("mouseenter mouseleave mousedown mouseup",function(r){v||(e.browse_button_hover&&("mouseenter"===r.type?t.addClass(n,e.browse_button_hover):"mouseleave"===r.type&&t.removeClass(n,e.browse_button_hover)),e.browse_button_active&&("mousedown"===r.type?t.addClass(n,e.browse_button_active):"mouseup"===r.type&&t.removeClass(n,e.browse_button_active)))}),a.bind("error runtimeerror",function(){a=null,s()}),a.init()})}),e.drop_element&&o.each(e.drop_element,function(e){s.push(function(n){var s=new t.FileDrop(o.extend({},u,{drop_zone:e}));s.onready=function(){var e=t.Runtime.getInfo(this.ruid);r.features.dragdrop=e.can("drag_and_drop"),i++,h.push(this),n()},s.ondrop=function(){r.addFile(this.files)},s.bind("error runtimeerror",function(){s=null,n()}),s.init()})}),t.inSeries(s,function(){typeof n=="function"&&n(i)})}function T(e,n,r){var i=new t.Image;try{i.onload=function(){i.downsize(n.width,n.height,n.crop,n.preserve_headers)},i.onresize=function(){r(this.getAsBlob(e.type,n.quality)),this.destroy()},i.onerror=function(){r(e)},i.load(e)}catch(s){r(e)}}function N(e,n,r){function f(e,t,n){var r=a[e];switch(e){case"max_file_size":e==="max_file_size"&&(a.max_file_size=a.filters.max_file_size=t);break;case"chunk_size":if(t=o.parseSize(t))a[e]=t;break;case"filters":o.typeOf(t)==="array"&&(t={mime_types:t}),n?o.extend(a.filters,t):a.filters=t,t.mime_types&&(a.filters.mime_types.regexp=function(e){var t=[];return o.each(e,function(e){o.each(e.extensions.split(/,/),function(e){/^\s*\*\s*$/.test(e)?t.push("\\.*"):t.push("\\."+e.replace(new RegExp("["+"/^$.*+?|()[]{}\\".replace(/./g,"\\$&")+"]","g"),"\\$&"))})}),new RegExp("("+t.join("|")+")$","i")}(a.filters.mime_types));break;case"resize":n?o.extend(a.resize,t,{enabled:!0}):a.resize=t;break;case"prevent_duplicates":a.prevent_duplicates=a.filters.prevent_duplicates=!!t;break;case"browse_button":case"drop_element":t=o.get(t);case"container":case"runtimes":case"multi_selection":case"flash_swf_url":case"silverlight_xap_url":a[e]=t,n||(u=!0);break;default:a[e]=t}n||i.trigger("OptionChanged",e,t,r)}var i=this,u=!1;typeof e=="object"?o.each(e,function(e,t){f(t,e,r)}):f(e,n,r),r?(a.required_features=s(o.extend({},a)),l=s(o.extend({},a,{required_features:!0}))):u&&(i.trigger("Destroy"),x.call(i,a,function(e){e?(i.runtime=t.Runtime.getInfo(w()).type,i.trigger("Init",{runtime:i.runtime}),i.trigger("PostInit")):i.trigger("Error",{code:o.INIT_ERROR,message:o.translate("Init error.")})}))}function C(e,t){[].push.apply(f,t),e.trigger("QueueChanged"),e.refresh()}function k(e,t){if(a.unique_names){var n=t.name.match(/\.([^.]+)$/),r="part";n&&(r=n[1]),t.target_name=t.id+"."+r}}function L(e,n){function h(){u-->0?r(p,1e3):(n.loaded=f,e.trigger("Error",{code:o.HTTP_ERROR,message:o.translate("HTTP Error."),file:n,response:m.responseText,status:m.status,responseHeaders:m.getAllResponseHeaders()}))}function p(){var d,v,g,y;if(n.status==o.DONE||n.status==o.FAILED||e.state==o.STOPPED)return;g={name:n.target_name||n.name},s&&a.chunks&&c.size>s?(y=Math.min(s,c.size-f),d=c.slice(f,f+y)):(y=c.size,d=c),s&&a.chunks&&(e.settings.send_chunk_number?(g.chunk=Math.ceil(f/s),g.chunks=Math.ceil(c.size/s)):(g.offset=f,g.total=c.size)),m=new t.XMLHttpRequest,m.upload&&(m.upload.onprogress=function(t){n.loaded=Math.min(n.size,f+t.loaded),e.trigger("UploadProgress",n)}),m.onload=function(){if(m.status>=400){h();return}u=e.settings.max_retries,y<c.size?(d.destroy(),f+=y,n.loaded=Math.min(f,c.size),e.trigger("ChunkUploaded",n,{offset:n.loaded,total:c.size,response:m.responseText,status:m.status,responseHeaders:m.getAllResponseHeaders()}),t.Env.browser==="Android Browser"&&e.trigger("UploadProgress",n)):n.loaded=n.size,d=v=null,!f||f>=c.size?(n.size!=n.origSize&&(c.destroy(),c=null),e.trigger("UploadProgress",n),n.status=o.DONE,e.trigger("FileUploaded",n,{response:m.responseText,status:m.status,responseHeaders:m.getAllResponseHeaders()})):r(p,1)},m.onerror=function(){h()},m.onloadend=function(){this.destroy(),m=null},e.settings.multipart&&a.multipart?(g.name=n.target_name||n.name,m.open("post",i,!0),o.each(e.settings.headers,function(e,t){m.setRequestHeader(t,e)}),v=new t.FormData,o.each(o.extend(g,e.settings.multipart_params),function(e,t){v.append(t,e)}),v.append(e.settings.file_data_name,d),m.send(v,{runtime_order:e.settings.runtimes,required_caps:e.settings.required_features,preferred_caps:l,swf_url:e.settings.flash_swf_url,xap_url:e.settings.silverlight_xap_url})):(i=o.buildUrl(e.settings.url,o.extend(g,e.settings.multipart_params)),m.open("post",i,!0),m.setRequestHeader("Content-Type","application/octet-stream"),o.each(e.settings.headers,function(e,t){m.setRequestHeader(t,e)}),m.send(d,{runtime_order:e.settings.runtimes,required_caps:e.settings.required_features,preferred_caps:l,swf_url:e.settings.flash_swf_url,xap_url:e.settings.silverlight_xap_url}))}var i=e.settings.url,s=e.settings.chunk_size,u=e.settings.max_retries,a=e.features,f=0,c;n.loaded&&(f=n.loaded=s*Math.floor(n.loaded/s)),c=n.getSource(),e.settings.resize.enabled&&E(c,"send_binary_string")&&!!~t.inArray(c.type,["image/jpeg","image/png"])?T.call(this,c,e.settings.resize,function(e){c=e,n.size=e.size,p()}):p()}function A(e,t){y(t)}function O(e){if(e.state==o.STARTED)p=+(new Date);else if(e.state==o.STOPPED)for(var t=e.files.length-1;t>=0;t--)e.files[t].status==o.UPLOADING&&(e.files[t].status=o.QUEUED,b())}function M(){m&&m.abort()}function _(e){b(),r(function(){g.call(e)},1)}function D(e,t){t.file&&(t.file.status=o.FAILED,y(t.file),e.state==o.STARTED&&(e.trigger("CancelUpload"),r(function(){g.call(e)},1)))}function P(e){e.stop(),o.each(f,function(e){e.destroy()}),f=[],c.length&&(o.each(c,function(e){e.destroy()}),c=[]),h.length&&(o.each(h,function(e){e.destroy()}),h=[]),l={},v=!1,p=m=null,d.reset()}var u=o.guid(),a,f=[],l={},c=[],h=[],p,d,v=!1,m;a={runtimes:t.Runtime.order,max_retries:0,chunk_size:0,multipart:!0,multi_selection:!0,file_data_name:"file",flash_swf_url:"js/Moxie.swf",silverlight_xap_url:"js/Moxie.xap",filters:{mime_types:[],prevent_duplicates:!1,max_file_size:0},resize:{enabled:!1,preserve_headers:!0,crop:!1},send_chunk_number:!0},N.call(this,e,null,!0),d=new o.QueueProgress,o.extend(this,{id:u,uid:u,state:o.STOPPED,features:{},runtime:null,files:f,settings:a,total:d,init:function(){var e=this;typeof a.preinit=="function"?a.preinit(e):o.each(a.preinit,function(t,n){e.bind(n,t)});if(!a.browse_button||!a.url){this.trigger("Error",{code:o.INIT_ERROR,message:o.translate("Init error.")});return}S.call(this),x.call(this,a,function(n){typeof a.init=="function"?a.init(e):o.each(a.init,function(t,n){e.bind(n,t)}),n?(e.runtime=t.Runtime.getInfo(w()).type,e.trigger("Init",{runtime:e.runtime}),e.trigger("PostInit")):e.trigger("Error",{code:o.INIT_ERROR,message:o.translate("Init error.")})})},setOption:function(e,t){N.call(this,e,t,!this.runtime)},getOption:function(e){return e?a[e]:a},refresh:function(){c.length&&o.each(c,function(e){e.trigger("Refresh")}),this.trigger("Refresh")},start:function(){this.state!=o.STARTED&&(this.state=o.STARTED,this.trigger("StateChanged"),g.call(this))},stop:function(){this.state!=o.STOPPED&&(this.state=o.STOPPED,this.trigger("StateChanged"),this.trigger("CancelUpload"))},disableBrowse:function(){v=arguments[0]!==n?arguments[0]:!0,c.length&&o.each(c,function(e){e.disable(v)}),this.trigger("DisableBrowse",v)},getFile:function(e){var t;for(t=f.length-1;t>=0;t--)if(f[t].id===e)return f[t]},addFile:function(e,n){function l(e,n){var r=[];t.each(s.settings.filters,function(t,n){i[n]&&r.push(function(r){i[n].call(s,t,e,function(e){r(!e)})})}),t.inSeries(r,n)}function c(e){var i=t.typeOf(e);if(e instanceof t.File){if(!e.ruid&&!e.isDetached()){if(!f)return!1;e.ruid=f,e.connectRuntime(f)}c(new o.File(e))}else e instanceof t.Blob?(c(e.getSource()),e.destroy()):e instanceof o.File?(n&&(e.name=n),u.push(function(t){l(e,function(n){n||(a.push(e),s.trigger("FileFiltered",e)),r(t,1)})})):t.inArray(i,["file","blob"])!==-1?c(new t.File(null,e)):i==="node"&&t.typeOf(e.files)==="filelist"?t.each(e.files,c):i==="array"&&(n=null,t.each(e,c))}var s=this,u=[],a=[],f;f=w(),c(e),u.length&&t.inSeries(u,function(){a.length&&s.trigger("FilesAdded",a)})},removeFile:function(e){var t=typeof e=="string"?e:e.id;for(var n=f.length-1;n>=0;n--)if(f[n].id===t)return this.splice(n,1)[0]},splice:function(e,t){var r=f.splice(e===n?0:e,t===n?f.length:t),i=!1;return this.state==o.STARTED&&(i=!0,this.stop()),this.trigger("FilesRemoved",r),o.each(r,function(e){e.destroy()}),this.trigger("QueueChanged"),this.refresh(),i&&this.start(),r},bind:function(e,t,n){var r=this;o.Uploader.prototype.bind.call(this,e,function(){var e=[].slice.call(arguments);return e.splice(0,1,r),t.apply(this,e)},0,n)},destroy:function(){this.trigger("Destroy"),a=d=null,this.unbindAll()}})},o.Uploader.prototype=t.EventTarget.instance,o.File=function(){function n(n){o.extend(this,{id:o.guid(),name:n.name||n.fileName,type:n.type||"",size:n.size||n.fileSize,origSize:n.size||n.fileSize,loaded:0,percent:0,status:o.QUEUED,lastModifiedDate:n.lastModifiedDate||(new Date).toLocaleString(),getNative:function(){var e=this.getSource().getSource();return t.inArray(t.typeOf(e),["blob","file"])!==-1?e:null},getSource:function(){return e[this.id]?e[this.id]:null},destroy:function(){var t=this.getSource();t&&(t.destroy(),delete e[this.id])}}),e[this.id]=n}var e={};return n}(),o.QueueProgress=function(){var e=this;e.size=0,e.loaded=0,e.uploaded=0,e.failed=0,e.queued=0,e.percent=0,e.bytesPerSec=0,e.reset=function(){e.size=e.loaded=e.uploaded=e.failed=e.queued=e.percent=e.bytesPerSec=0}},e.plupload=o})(window,mOxie);;
/**
 * jquery.ui.plupload.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.button.js
 *	jquery.ui.progressbar.js
 *	
 * Optionally:
 *	jquery.ui.sortable.js
 */

 /* global jQuery:true */

/**
jQuery UI based implementation of the Plupload API - multi-runtime file uploading API.

To use the widget you must include _jQuery_ and _jQuery UI_ bundle (including `ui.core`, `ui.widget`, `ui.button`, 
`ui.progressbar` and `ui.sortable`).

In general the widget is designed the way that you do not usually need to do anything to it after you instantiate it. 
But! You still can intervenue, to some extent, in case you need to. Although, due to the fact that widget is based on 
_jQuery UI_ widget factory, there are some specifics. See examples below for more details.

@example
	<!-- Instantiating: -->
	<div id="uploader">
		<p>Your browser doesn't have Flash, Silverlight or HTML5 support.</p>
	</div>

	<script>
		$('#uploader').plupload({
			url : '../upload.php',
			filters : [
				{title : "Image files", extensions : "jpg,gif,png"}
			],
			rename: true,
			sortable: true,
			flash_swf_url : '../../js/Moxie.swf',
			silverlight_xap_url : '../../js/Moxie.xap',
		});
	</script>

@example
	// Invoking methods:
	$('#uploader').plupload(options);

	// Display welcome message in the notification area
	$('#uploader').plupload('notify', 'info', "This might be obvious, but you need to click 'Add Files' to add some files.");

@example
	// Subscribing to the events...
	// ... on initialization:
	$('#uploader').plupload({ 
		...
		viewchanged: function(event, args) {
			// stuff ...
		}
	});
	// ... or after initialization
	$('#uploader').on("viewchanged", function(event, args) {
		// stuff ...
	});

@class UI.Plupload
@constructor
@param {Object} settings For detailed information about each option check documentation.
	@param {String} settings.url URL of the server-side upload handler.
	@param {Number|String} [settings.chunk_size=0] Chunk size in bytes to slice the file into. Shorcuts with b, kb, mb, gb, tb suffixes also supported. `e.g. 204800 or "204800b" or "200kb"`. By default - disabled.
	@param {String} [settings.file_data_name="file"] Name for the file field in Multipart formated message.
	@param {Array} [settings.filters=[]] Set of file type filters, each one defined by hash of title and extensions. `e.g. {title : "Image files", extensions : "jpg,jpeg,gif,png"}`. Dispatches `plupload.FILE_EXTENSION_ERROR`
	@param {String} [settings.flash_swf_url] URL of the Flash swf.
	@param {Object} [settings.headers] Custom headers to send with the upload. Hash of name/value pairs.
	@param {Number|String} [settings.max_file_size] Maximum file size that the user can pick, in bytes. Optionally supports b, kb, mb, gb, tb suffixes. `e.g. "10mb" or "1gb"`. By default - not set. Dispatches `plupload.FILE_SIZE_ERROR`.
	@param {Number} [settings.max_retries=0] How many times to retry the chunk or file, before triggering Error event.
	@param {Boolean} [settings.multipart=true] Whether to send file and additional parameters as Multipart formated message.
	@param {Object} [settings.multipart_params] Hash of key/value pairs to send with every file upload.
	@param {Boolean} [settings.multi_selection=true] Enable ability to select multiple files at once in file dialog.
	@param {Boolean} [settings.prevent_duplicates=false] Do not let duplicates into the queue. Dispatches `plupload.FILE_DUPLICATE_ERROR`.
	@param {String|Object} [settings.required_features] Either comma-separated list or hash of required features that chosen runtime should absolutely possess.
	@param {Object} [settings.resize] Enable resizng of images on client-side. Applies to `image/jpeg` and `image/png` only. `e.g. {width : 200, height : 200, quality : 90, crop: true}`
		@param {Number} [settings.resize.width] If image is bigger, it will be resized.
		@param {Number} [settings.resize.height] If image is bigger, it will be resized.
		@param {Number} [settings.resize.quality=90] Compression quality for jpegs (1-100).
		@param {Boolean} [settings.resize.crop=false] Whether to crop images to exact dimensions. By default they will be resized proportionally.
	@param {String} [settings.runtimes="html5,flash,silverlight,html4"] Comma separated list of runtimes, that Plupload will try in turn, moving to the next if previous fails.
	@param {String} [settings.silverlight_xap_url] URL of the Silverlight xap.
	@param {Boolean} [settings.unique_names=false] If true will generate unique filenames for uploaded files.

	@param {Boolean} [settings.autostart=false] Whether to auto start uploading right after file selection.
	@param {Boolean} [settings.dragdrop=true] Enable ability to add file to the queue by drag'n'dropping them from the desktop.
	@param {Boolean} [settings.rename=false] Enable ability to rename files in the queue.
	@param {Boolean} [settings.sortable=false] Enable ability to sort files in the queue, changing their uploading priority.
	@param {Object} [settings.buttons] Control the visibility of functional buttons. 
		@param {Boolean} [settings.buttons.browse=true] Display browse button.
		@param {Boolean} [settings.buttons.start=true] Display start button.
		@param {Boolean} [settings.buttons.stop=true] Display stop button. 
	@param {Object} [settings.views] Control various views of the file queue.
		@param {Boolean} [settings.views.list=true] Enable list view.
		@param {Boolean} [settings.views.thumbs=false] Enable thumbs view.
		@param {String} [settings.views.default='list'] Default view.
		@param {Boolean} [settings.views.remember=true] Whether to remember the current view (requires jQuery Cookie plugin).
	@param {Boolean} [settings.multiple_queues=true] Re-activate the widget after each upload procedure.
	@param {Number} [settings.max_file_count=0] Limit the number of files user is able to upload in one go, autosets _multiple_queues_ to _false_ (default is 0 - no limit).
*/
(function(window, document, plupload, o, $) {

/**
Dispatched when the widget is initialized and ready.

@event ready
@param {plupload.Uploader} uploader Uploader instance sending the event.
*/

/**
Dispatched when file dialog is closed.

@event selected
@param {plupload.Uploader} uploader Uploader instance sending the event.
@param {Array} files Array of selected files represented by plupload.File objects
*/

/**
Dispatched when file dialog is closed.

@event removed
@param {plupload.Uploader} uploader Uploader instance sending the event.
@param {Array} files Array of removed files represented by plupload.File objects
*/

/**
Dispatched when upload is started.

@event start
@param {plupload.Uploader} uploader Uploader instance sending the event.
*/

/**
Dispatched when upload is stopped.

@event stop
@param {plupload.Uploader} uploader Uploader instance sending the event.
*/

/**
Dispatched during the upload process.

@event progress
@param {plupload.Uploader} uploader Uploader instance sending the event.
@param {plupload.File} file File that is being uploaded (includes loaded and percent properties among others).
	@param {Number} size Total file size in bytes.
	@param {Number} loaded Number of bytes uploaded of the files total size.
	@param {Number} percent Number of percentage uploaded of the file.
*/

/**
Dispatched when file is uploaded.

@event uploaded
@param {plupload.Uploader} uploader Uploader instance sending the event.
@param {plupload.File} file File that was uploaded.
	@param {Enum} status Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
*/

/**
Dispatched when upload of the whole queue is complete.

@event complete
@param {plupload.Uploader} uploader Uploader instance sending the event.
@param {Array} files Array of uploaded files represented by plupload.File objects
*/

/**
Dispatched when the view is changed, e.g. from `list` to `thumbs` or vice versa.

@event viewchanged
@param {plupload.Uploader} uploader Uploader instance sending the event.
@param {String} type Current view type.
*/

/**
Dispatched when error of some kind is detected.

@event error
@param {plupload.Uploader} uploader Uploader instance sending the event.
@param {String} error Error message.
@param {plupload.File} file File that was uploaded.
	@param {Enum} status Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
*/

var uploaders = {};	
	
function _(str) {
	return plupload.translate(str) || str;
}

function renderUI(obj) {		
	obj.id = obj.attr('id');

	obj.html(
		'<div class="plupload_wrapper">' +
			'<div class="ui-widget-content plupload_container">' +
				'<div class="ui-state-default ui-widget-header plupload_header">' +
					'<div class="plupload_header_content">' +
						'<div class="plupload_logo"> </div>' +
						'<div class="plupload_header_title">' + _('Select files') + '</div>' +
						'<div class="plupload_header_text">' + _('Add files to the upload queue and click the start button.') + '</div>' +
						'<div class="plupload_view_switch">' +
							'<input type="radio" id="'+obj.id+'_view_list" name="view_mode_'+obj.id+'" checked="checked" /><label class="plupload_button" for="'+obj.id+'_view_list" data-view="list">' + _('List') + '</label>' +
							'<input type="radio" id="'+obj.id+'_view_thumbs" name="view_mode_'+obj.id+'" /><label class="plupload_button"  for="'+obj.id+'_view_thumbs" data-view="thumbs">' + _('Thumbnails') + '</label>' +
						'</div>' +
					'</div>' +
				'</div>' +

				'<table class="plupload_filelist plupload_filelist_header ui-widget-header">' +
				'<tr>' +
					'<td class="plupload_cell plupload_file_name">' + _('Filename') + '</td>' +
					'<td class="plupload_cell plupload_file_status">' + _('Status') + '</td>' +
					'<td class="plupload_cell plupload_file_size">' + _('Size') + '</td>' +
					'<td class="plupload_cell plupload_file_action">&nbsp;</td>' +
				'</tr>' +
				'</table>' +

				'<div class="plupload_content">' +
					'<div class="plupload_droptext">' + _("Drag files here.") + '</div>' +
					'<ul class="plupload_filelist_content"> </ul>' +
					'<div class="plupload_clearer">&nbsp;</div>' +
				'</div>' +
					
				'<table class="plupload_filelist plupload_filelist_footer ui-widget-header">' +
				'<tr>' +
					'<td class="plupload_cell plupload_file_name">' +
						'<div class="plupload_buttons"><!-- Visible -->' +
							'<a class="plupload_button plupload_add">' + _('Add Files') + '</a>&nbsp;' +
							'<a class="plupload_button plupload_start">' + _('Start Upload') + '</a>&nbsp;' +
							'<a class="plupload_button plupload_stop plupload_hidden">'+_('Stop Upload') + '</a>&nbsp;' +
						'</div>' +

						'<div class="plupload_started plupload_hidden"><!-- Hidden -->' +
							'<div class="plupload_progress plupload_right">' +
								'<div class="plupload_progress_container"></div>' +
							'</div>' +

							'<div class="plupload_cell plupload_upload_status"></div>' +

							'<div class="plupload_clearer">&nbsp;</div>' +
						'</div>' +
					'</td>' +
					'<td class="plupload_file_status"><span class="plupload_total_status">0%</span></td>' +
					'<td class="plupload_file_size"><span class="plupload_total_file_size">0 kb</span></td>' +
					'<td class="plupload_file_action"></td>' +
				'</tr>' +
				'</table>' +

			'</div>' +
			'<input class="plupload_count" value="0" type="hidden">' +
		'</div>'
	);
}
    
$.widget("ui.plupload", {

	widgetEventPrefix: '',
	
	contents_bak: '',
		
	options: {
		browse_button_hover: 'ui-state-hover',
		browse_button_active: 'ui-state-active',
		
		// widget specific
		dragdrop : true, 
		multiple_queues: true, // re-use widget by default
		buttons: {
			browse: true,
			start: true,
			stop: true	
		},
		views: {
			list: true,
			thumbs: false,
			active: 'list',
			remember: true // requires: https://github.com/carhartl/jquery-cookie, otherwise disabled even if set to true
		},
		autostart: false,
		sortable: false,
		rename: false,
		max_file_count: 0 // unlimited
	},
	
	FILE_COUNT_ERROR: -9001,
	
	_create: function() {
		var id = this.element.attr('id');
		if (!id) {
			id = plupload.guid();
			this.element.attr('id', id);
		}
		this.id = id;
				
		// backup the elements initial state
		this.contents_bak = this.element.html();
		renderUI(this.element);
		
		// container, just in case
		this.container = $('.plupload_container', this.element).attr('id', id + '_container');	

		this.content = $('.plupload_content', this.element);
		
		if ($.fn.resizable) {
			this.container.resizable({ 
				handles: 's',
				minHeight: 300
			});
		}
		
		// list of files, may become sortable
		this.filelist = $('.plupload_filelist_content', this.container)
			.attr({
				id: id + '_filelist',
				unselectable: 'on'
			});
		

		// buttons
		this.browse_button = $('.plupload_add', this.container).attr('id', id + '_browse');
		this.start_button = $('.plupload_start', this.container).attr('id', id + '_start');
		this.stop_button = $('.plupload_stop', this.container).attr('id', id + '_stop');
		this.thumbs_switcher = $('#' + id + '_view_thumbs');
		this.list_switcher = $('#' + id + '_view_list');
		
		if ($.ui.button) {
			this.browse_button.button({
				icons: { primary: 'ui-icon-circle-plus' },
				disabled: true
			});
			
			this.start_button.button({
				icons: { primary: 'ui-icon-circle-arrow-e' },
				disabled: true
			});
			
			this.stop_button.button({
				icons: { primary: 'ui-icon-circle-close' }
			});
      
			this.list_switcher.button({
				text: false,
				icons: { secondary: "ui-icon-grip-dotted-horizontal" }
			});

			this.thumbs_switcher.button({
				text: false,
				icons: { secondary: "ui-icon-image" }
			});
		}
		
		// progressbar
		this.progressbar = $('.plupload_progress_container', this.container);		
		
		if ($.ui.progressbar) {
			this.progressbar.progressbar();
		}
		
		// counter
		this.counter = $('.plupload_count', this.element)
			.attr({
				id: id + '_count',
				name: id + '_count'
			});
					
		// initialize uploader instance
		this._initUploader();
	},

	_initUploader: function() {
		var self = this
		, id = this.id
		, uploader
		, options = { 
			container: id + '_buttons',
			browse_button: id + '_browse'
		}
		;

		$('.plupload_buttons', this.element).attr('id', id + '_buttons');

		if (self.options.dragdrop) {
			this.filelist.parent().attr('id', this.id + '_dropbox');
			options.drop_element = this.id + '_dropbox';
		}

		uploader = this.uploader = uploaders[id] = new plupload.Uploader($.extend(this.options, options));

		if (self.options.views.thumbs) {
			uploader.settings.required_features.display_media = true;
		}


		uploader.bind('Error', function(up, err) {			
			var message, details = "";

			message = '<strong>' + err.message + '</strong>';
				
			switch (err.code) {
				case plupload.FILE_EXTENSION_ERROR:
					details = o.sprintf(_("File: %s"), err.file.name);
					break;
				
				case plupload.FILE_SIZE_ERROR:
					details = o.sprintf(_("File: %s, size: %d, max file size: %d"), err.file.name, err.file.size, plupload.parseSize(self.options.max_file_size));
					break;

				case plupload.FILE_DUPLICATE_ERROR:
					details = o.sprintf(_("%s already present in the queue."), err.file.name);
					break;
					
				case self.FILE_COUNT_ERROR:
					details = o.sprintf(_("Upload element accepts only %d file(s) at a time. Extra files were stripped."), self.options.max_file_count);
					break;
				
				case plupload.IMAGE_FORMAT_ERROR :
					details = _("Image format either wrong or not supported.");
					break;	
				
				case plupload.IMAGE_MEMORY_ERROR :
					details = _("Runtime ran out of available memory.");
					break;
				
				/* // This needs a review
				case plupload.IMAGE_DIMENSIONS_ERROR :
					details = o.sprintf(_('Resoultion out of boundaries! <b>%s</b> runtime supports images only up to %wx%hpx.'), up.runtime, up.features.maxWidth, up.features.maxHeight);
					break;	*/
											
				case plupload.HTTP_ERROR:
					details = _("Upload URL might be wrong or doesn't exist.");
					break;
			}

			message += " <br /><i>" + details + "</i>";

			self._trigger('error', null, { up: up, error: err } );

			// do not show UI if no runtime can be initialized
			if (err.code === plupload.INIT_ERROR) {
				setTimeout(function() {
					self.destroy();
				}, 1);
			} else {
				self.notify('error', message);
			}
		});

		
		uploader.bind('PostInit', function(up) {	
			// all buttons are optional, so they can be disabled and hidden
			if (!self.options.buttons.browse) {
				self.browse_button.button('disable').hide();
				up.disableBrowse(true);
			} else {
				self.browse_button.button('enable');
			}
			
			if (!self.options.buttons.start) {
				self.start_button.button('disable').hide();
			} 
			
			if (!self.options.buttons.stop) {
				self.stop_button.button('disable').hide();
			}
				
			if (!self.options.unique_names && self.options.rename) {
				self._enableRenaming();	
			}

			if (self.options.dragdrop && up.features.dragdrop) {
				self.filelist.parent().addClass('plupload_dropbox');
			}

			self._enableViewSwitcher();
			
			self.start_button.click(function(e) {
				if (!$(this).button('option', 'disabled')) {
					self.start();
				}
				e.preventDefault();
			});

			self.stop_button.click(function(e) {
				self.stop();
				e.preventDefault();
			});

			self._trigger('ready', null, { up: up });
		});
		
		
		// check if file count doesn't exceed the limit
		if (self.options.max_file_count) {
			self.options.multiple_queues = false; // one go only

			uploader.bind('FilesAdded', function(up, selectedFiles) {
				var selectedCount = selectedFiles.length
				, extraCount = up.files.length + selectedCount - self.options.max_file_count
				;
				
				if (extraCount > 0) {
					selectedFiles.splice(selectedCount - extraCount, extraCount);
					
					up.trigger('Error', {
						code : self.FILE_COUNT_ERROR,
						message : _('File count error.')
					});
				}
			});
		}
		
		// uploader internal events must run first 
		uploader.init();

		uploader.bind('FileFiltered', function(up, file) {
			self._addFiles(file);
		});
		
		uploader.bind('FilesAdded', function(up, files) {
			self._trigger('selected', null, { up: up, files: files } );

			// re-enable sortable
			if (self.options.sortable && $.ui.sortable) {
				self._enableSortingList();	
			}

			self._trigger('updatelist', null, { filelist: self.filelist });
			
			if (self.options.autostart) {
				// set a little delay to make sure that QueueChanged triggered by the core has time to complete
				setTimeout(function() {
					self.start();
				}, 10);
			}
		});
		
		uploader.bind('FilesRemoved', function(up, files) {
			self._trigger('removed', null, { up: up, files: files } );
		});
		
		uploader.bind('QueueChanged StateChanged', function() {
			self._handleState();
		});
		
		uploader.bind('UploadFile', function(up, file) {
			self._handleFileStatus(file);
		});
		
		uploader.bind('FileUploaded', function(up, file) {
			self._handleFileStatus(file);
			self._trigger('uploaded', null, { up: up, file: file } );
		});
		
		uploader.bind('UploadProgress', function(up, file) {
			self._handleFileStatus(file);
			self._updateTotalProgress();
			self._trigger('progress', null, { up: up, file: file } );
		});
		
		uploader.bind('UploadComplete', function(up, files) {
			self._addFormFields();		
			self._trigger('complete', null, { up: up, files: files } );
		});
	},

	
	_setOption: function(key, value) {
		var self = this;

		if (key == 'buttons' && typeof(value) == 'object') {	
			value = $.extend(self.options.buttons, value);
			
			if (!value.browse) {
				self.browse_button.button('disable').hide();
				self.uploader.disableBrowse(true);
			} else {
				self.browse_button.button('enable').show();
				self.uploader.disableBrowse(false);
			}
			
			if (!value.start) {
				self.start_button.button('disable').hide();
			} else {
				self.start_button.button('enable').show();
			}
			
			if (!value.stop) {
				self.stop_button.button('disable').hide();
			} else {
				self.start_button.button('enable').show();	
			}
		}
		
		self.uploader.settings[key] = value;	
	},

	
	/**
	Start upload. Triggers `start` event.

	@method start
	*/
	start: function() {
		this.uploader.start();
		this._trigger('start', null, { up: this.uploader });
	},

	
	/**
	Stop upload. Triggers `stop` event.

	@method stop
	*/
	stop: function() {
		this.uploader.stop();
		this._trigger('stop', null, { up: this.uploader });
	},


	/**
	Enable browse button.

	@method enable
	*/
	enable: function() {
		this.browse_button.button('enable');
		this.uploader.disableBrowse(false);
	},


	/**
	Disable browse button.

	@method disable
	*/
	disable: function() {
		this.browse_button.button('disable');
		this.uploader.disableBrowse(true);
	},

	
	/**
	Retrieve file by it's unique id.

	@method getFile
	@param {String} id Unique id of the file
	@return {plupload.File}
	*/
	getFile: function(id) {
		var file;
		
		if (typeof id === 'number') {
			file = this.uploader.files[id];	
		} else {
			file = this.uploader.getFile(id);	
		}
		return file;
	},

	/**
	Return array of files currently in the queue.
	
	@method getFiles
	@return {Array} Array of files in the queue represented by plupload.File objects
	*/
	getFiles: function() {
		return this.uploader.files;
	},

	
	/**
	Remove the file from the queue.

	@method removeFile
	@param {plupload.File|String} file File to remove, might be specified directly or by it's unique id
	*/
	removeFile: function(file) {
		if (plupload.typeOf(file) === 'string') {
			file = this.getFile(file);
		}
		this._removeFiles(file);
	},

	
	/**
	Clear the file queue.

	@method clearQueue
	*/
	clearQueue: function() {
		this.uploader.splice();
	},


	/**
	Retrieve internal plupload.Uploader object (usually not required).

	@method getUploader
	@return {plupload.Uploader}
	*/
	getUploader: function() {
		return this.uploader;
	},


	/**
	Trigger refresh procedure, specifically browse_button re-measure and re-position operations.
	Might get handy, when UI Widget is placed within the popup, that is constantly hidden and shown
	again - without calling this method after each show operation, dialog trigger might get displaced
	and disfunctional.

	@method refresh
	*/
	refresh: function() {
		this.uploader.refresh();
	},


	/**
	Display a message in notification area.

	@method notify
	@param {Enum} type Type of the message, either `error` or `info`
	@param {String} message The text message to display.
	*/
	notify: function(type, message) {
		var popup = $(
			'<div class="plupload_message">' + 
				'<span class="plupload_message_close ui-icon ui-icon-circle-close" title="'+_('Close')+'"></span>' +
				'<p><span class="ui-icon"></span>' + message + '</p>' +
			'</div>'
		);
					
		popup
			.addClass('ui-state-' + (type === 'error' ? 'error' : 'highlight'))
			.find('p .ui-icon')
				.addClass('ui-icon-' + (type === 'error' ? 'alert' : 'info'))
				.end()
			.find('.plupload_message_close')
				.click(function() {
					popup.remove();	
				})
				.end();
		
		$('.plupload_header', this.container).append(popup);
	},

	
	/**
	Destroy the widget, the uploader, free associated resources and bring back original html.

	@method destroy
	*/
	destroy: function() {
		this._removeFiles([].slice.call(this.uploader.files));
		
		// destroy uploader instance
		this.uploader.destroy();

		// unbind all button events
		$('.plupload_button', this.element).unbind();
		
		// destroy buttons
		if ($.ui.button) {
			$('.plupload_add, .plupload_start, .plupload_stop', this.container)
				.button('destroy');
		}
		
		// destroy progressbar
		if ($.ui.progressbar) {
			this.progressbar.progressbar('destroy');	
		}
		
		// destroy sortable behavior
		if ($.ui.sortable && this.options.sortable) {
			$('tbody', this.filelist).sortable('destroy');
		}
		
		// restore the elements initial state
		this.element
			.empty()
			.html(this.contents_bak);
		this.contents_bak = '';

		$.Widget.prototype.destroy.apply(this);
	},
	
	
	_handleState: function() {
		var up = this.uploader;
						
		if (up.state === plupload.STARTED) {
			$(this.start_button).button('disable');
								
			$([])
				.add(this.stop_button)
				.add('.plupload_started')
					.removeClass('plupload_hidden');
							
			$('.plupload_upload_status', this.element).html(o.sprintf(_('Uploaded %d/%d files'), up.total.uploaded, up.files.length));
			$('.plupload_header_content', this.element).addClass('plupload_header_content_bw');
		} else if (up.state === plupload.STOPPED) {
			$([])
				.add(this.stop_button)
				.add('.plupload_started')
					.addClass('plupload_hidden');
			
			if (this.options.multiple_queues) {
				$('.plupload_header_content', this.element).removeClass('plupload_header_content_bw');
			} else {
				$([])
					.add(this.browse_button)
					.add(this.start_button)
						.button('disable');

				up.disableBrowse();
			}

			if (up.files.length === (up.total.uploaded + up.total.failed)) {
				this.start_button.button('disable');
			} else {
				this.start_button.button('enable');
			}

			this._updateTotalProgress();
		}

		if (up.total.queued === 0) {
			$('.ui-button-text', this.browse_button).html(_('Add Files'));
		} else {
			$('.ui-button-text', this.browse_button).html(o.sprintf(_('%d files queued'), up.total.queued));
		}

		up.refresh();
	},
	
	
	_handleFileStatus: function(file) {
		var self = this, actionClass, iconClass;
		
		// since this method might be called asynchronously, file row might not yet be rendered
		if (!$('#' + file.id).length) {
			return;	
		}

		switch (file.status) {
			case plupload.DONE: 
				actionClass = 'plupload_done';
				iconClass = 'ui-icon ui-icon-circle-check';
				break;
			
			case plupload.FAILED:
				actionClass = 'ui-state-error plupload_failed';
				iconClass = 'ui-icon ui-icon-alert';
				break;

			case plupload.QUEUED:
				actionClass = 'plupload_delete';
				iconClass = 'ui-icon ui-icon-circle-minus';
				break;

			case plupload.UPLOADING:
				actionClass = 'ui-state-highlight plupload_uploading';
				iconClass = 'ui-icon ui-icon-circle-arrow-w';
				
				// scroll uploading file into the view if its bottom boundary is out of it
				var scroller = $('.plupload_scroll', this.container)
				, scrollTop = scroller.scrollTop()
				, scrollerHeight = scroller.height()
				, rowOffset = $('#' + file.id).position().top + $('#' + file.id).height()
				;
					
				if (scrollerHeight < rowOffset) {
					scroller.scrollTop(scrollTop + rowOffset - scrollerHeight);
				}		

				// Set file specific progress
				$('#' + file.id)
					.find('.plupload_file_percent')
						.html(file.percent + '%')
						.end()
					.find('.plupload_file_progress')
						.css('width', file.percent + '%')
						.end()
					.find('.plupload_file_size')
						.html(plupload.formatSize(file.size));			
				break;
		}
		actionClass += ' ui-state-default plupload_file';

		$('#' + file.id)
			.attr('class', actionClass)
			.find('.ui-icon')
				.attr('class', iconClass)
				.end()
			.filter('.plupload_delete, .plupload_done, .plupload_failed')
				.find('.ui-icon')
					.click(function(e) {
						self._removeFiles(file);
						e.preventDefault();
					});
	},
	
	
	_updateTotalProgress: function() {
		var up = this.uploader;

		// Scroll to end of file list
		this.filelist[0].scrollTop = this.filelist[0].scrollHeight;
		
		this.progressbar.progressbar('value', up.total.percent);
		
		this.element
			.find('.plupload_total_status')
				.html(up.total.percent + '%')
				.end()
			.find('.plupload_total_file_size')
				.html(plupload.formatSize(up.total.size))
				.end()
			.find('.plupload_upload_status')
				.html(o.sprintf(_('Uploaded %d/%d files'), up.total.uploaded, up.files.length));
	},


	_displayThumbs: function() {
		var self = this
		, tw, th // thumb width/height
		, cols
		, num = 0 // number of simultaneously visible thumbs
		, thumbs = [] // array of thumbs to preload at any given moment
		, loading = false
		;

		if (!this.options.views.thumbs) {
			return;
		}


		function onLast(el, eventName, cb) {
			var timer;
			
			el.on(eventName, function() {
				clearTimeout(timer);
				timer = setTimeout(function() {
					clearTimeout(timer);
					cb();
				}, 300);
			});
		}


		// calculate number of simultaneously visible thumbs
		function measure() {
			if (!tw || !th) {
				var wrapper = $('.plupload_file:eq(0)', self.filelist);
				tw = wrapper.outerWidth(true);
				th = wrapper.outerHeight(true);
			}

			var aw = self.content.width(), ah = self.content.height();
			cols = Math.floor(aw / tw);
			num =  cols * (Math.ceil(ah / th) + 1);
		}


		function pickThumbsToLoad() {
			// calculate index of virst visible thumb
			var startIdx = Math.floor(self.content.scrollTop() / th) * cols;
			// get potentially visible thumbs that are not yet visible
			thumbs = $('.plupload_file', self.filelist)
				.slice(startIdx, startIdx + num)
				.filter(':not(.plupload_file_thumb_loaded)')
				.get();
		}
		

		function init() {
			function mpl() {
				if (self.view_mode !== 'thumbs') {
					return;
				}
				measure();
				pickThumbsToLoad();
				lazyLoad();
			}

			if ($.fn.resizable) {
				onLast(self.container, 'resize', mpl);
			}

			// onLast(self.window, 'resize', mpl);
			onLast(self.content, 'scroll',  mpl);

			self.element.on('viewchanged selected', mpl);

			mpl();
		}


		function preloadThumb(file, cb) {
			var img = new o.Image();

			img.onload = function() {
				var thumb = $('#' + file.id + ' .plupload_file_thumb', self.filelist).html('');
				this.embed(thumb[0], { 
					width: 100, 
					height: 60, 
					crop: true,
					swf_url: o.resolveUrl(self.options.flash_swf_url),
					xap_url: o.resolveUrl(self.options.silverlight_xap_url)
				});
			};

			img.bind("embedded error", function() {
				$('#' + file.id, self.filelist).addClass('plupload_file_thumb_loaded');
				this.destroy();
				setTimeout(cb, 1); // detach, otherwise ui might hang (in SilverLight for example)
			});

			img.load(file.getSource());
		}


		function lazyLoad() {
			if (self.view_mode !== 'thumbs' || loading) {
				return;
			}	

			pickThumbsToLoad();
			if (!thumbs.length) {
				return;
			}

			loading = true;

			preloadThumb(self.getFile($(thumbs.shift()).attr('id')), function() {
				loading = false;
				lazyLoad();
			});
		}

		// this has to run only once to measure structures and bind listeners
		this.element.on('selected', function onselected() {
			self.element.off('selected', onselected);
			init();
		});
	},


	_addFiles: function(files) {
		var self = this, file_html;

		file_html = '<li class="plupload_file ui-state-default" id="%id%">' +
			'<div class="plupload_file_thumb">' +
				'<div class="plupload_file_dummy ui-widget-content"><span class="ui-state-disabled">%ext%</span></div>' +
			'</div>' +
			'<div class="plupload_file_name" title="%name%"><span class="plupload_file_namespan">%name%</span></div>' +						
			'<div class="plupload_file_action"><div class="ui-icon"> </div></div>' +
			'<div class="plupload_file_size">%size% </div>' +
			'<div class="plupload_file_status">' +
				'<div class="plupload_file_progress ui-widget-header" style="width: 0%"> </div>' + 
				'<span class="plupload_file_percent">%percent% </span>' +
			'</div>' +
			'<div class="plupload_file_fields"> </div>' +
		'</li>';

		if (plupload.typeOf(files) !== 'array') {
			files = [files];
		}

		$.each(files, function(i, file) {
			var ext = o.Mime.getFileExtension(file.name) || 'none';

			self.filelist.append(file_html.replace(/%(\w+)%/g, function($0, $1) {
				if ('size' === $1) {
					return plupload.formatSize(file.size);
				} else if ('ext' === $1) {
					return ext;
				} else {
					return file[$1] || '';
				}
			}));

			self._handleFileStatus(file);
		});
	},


	_removeFiles: function(files) {
		var self = this, up = this.uploader;

		if (plupload.typeOf(files) !== 'array') {
			files = [files];
		}

		// destroy sortable if enabled
		if ($.ui.sortable && this.options.sortable) {
			$('tbody', self.filelist).sortable('destroy');	
		}

		$.each(files, function(i, file) {
			$('#' + file.id).toggle("highlight", function() {
				this.remove();
			});
			up.removeFile(file);
		});

		
		if (up.files.length) {
			// re-initialize sortable
			if (this.options.sortable && $.ui.sortable) {
				this._enableSortingList();	
			}
		}

		this._trigger('updatelist', null, { filelist: this.filelist });
	},


	_addFormFields: function() {
		var self = this;

		// re-add from fresh
		$('.plupload_file_fields', this.filelist).html('');

		plupload.each(this.uploader.files, function(file, count) {
			var fields = ''
			, id = self.id + '_' + count
			;

			if (file.target_name) {
				fields += '<input type="hidden" name="' + id + '_tmpname" value="'+plupload.xmlEncode(file.target_name)+'" />';
			}
			fields += '<input type="hidden" name="' + id + '_name" value="'+plupload.xmlEncode(file.name)+'" />';
			fields += '<input type="hidden" name="' + id + '_status" value="' + (file.status === plupload.DONE ? 'done' : 'failed') + '" />';

			$('#' + file.id).find('.plupload_file_fields').html(fields);
		});

		this.counter.val(this.uploader.files.length);
	},
	

	_viewChanged: function(view) {
		// update or write a new cookie
		if (this.options.views.remember && $.cookie) {
			$.cookie('plupload_ui_view', view, { expires: 7, path: '/' });
		} 
	
		// ugly fix for IE6 - make content area stretchable
		if (o.Env.browser === 'IE' && o.Env.version < 7) {
			this.content.attr('style', 'height:expression(document.getElementById("' + this.id + '_container' + '").clientHeight - ' + (view === 'list' ? 133 : 103) + ');');
		}

		this.container.removeClass('plupload_view_list plupload_view_thumbs').addClass('plupload_view_' + view); 
		this.view_mode = view;
		this._trigger('viewchanged', null, { view: view });
	},


	_enableViewSwitcher: function() {
		var self = this
		, view
		, switcher = $('.plupload_view_switch', this.container)
		, buttons
		, button
		;

		plupload.each(['list', 'thumbs'], function(view) {
			if (!self.options.views[view]) {
				switcher.find('[for="' + self.id + '_view_' + view + '"], #'+ self.id +'_view_' + view).remove();
			}
		});

		// check if any visible left
		buttons = switcher.find('.plupload_button');

		if (buttons.length === 1) {
			switcher.hide();
			view = buttons.eq(0).data('view');
			this._viewChanged(view);
		} else if ($.ui.button && buttons.length > 1) {
			if (this.options.views.remember && $.cookie) {
				view = $.cookie('plupload_ui_view');
			}

			// if wierd case, bail out to default
			if (!~plupload.inArray(view, ['list', 'thumbs'])) {
				view = this.options.views.active;
			}

			switcher
				.show()
				.buttonset()
				.find('.ui-button')
					.click(function(e) {
						view = $(this).data('view');
						self._viewChanged(view);
						e.preventDefault(); // avoid auto scrolling to widget in IE and FF (see #850)
					});

			// if view not active - happens when switcher wasn't clicked manually
			button = switcher.find('[for="' + self.id + '_view_'+view+'"]');
			if (button.length) {
				button.trigger('click');
			}
		} else {
			switcher.show();
			this._viewChanged(this.options.views.active);
		}

		// initialize thumb viewer if requested
		if (this.options.views.thumbs) {
			this._displayThumbs();
		}
	},
	
	
	_enableRenaming: function() {
		var self = this;

		this.filelist.dblclick(function(e) {
			var nameSpan = $(e.target), nameInput, file, parts, name, ext = "";

			if (!nameSpan.hasClass('plupload_file_namespan')) {
				return;
			}
		
			// Get file name and split out name and extension
			file = self.uploader.getFile(nameSpan.closest('.plupload_file')[0].id);
			name = file.name;
			parts = /^(.+)(\.[^.]+)$/.exec(name);
			if (parts) {
				name = parts[1];
				ext = parts[2];
			}

			// Display input element
			nameInput = $('<input class="plupload_file_rename" type="text" />').width(nameSpan.width()).insertAfter(nameSpan.hide());
			nameInput.val(name).blur(function() {
				nameSpan.show().parent().scrollLeft(0).end().next().remove();
			}).keydown(function(e) {
				var nameInput = $(this);

				if ($.inArray(e.keyCode, [13, 27]) !== -1) {
					e.preventDefault();

					// Rename file and glue extension back on
					if (e.keyCode === 13) {
						file.name = nameInput.val() + ext;
						nameSpan.html(file.name);
					}
					nameInput.blur();
				}
			})[0].focus();
		});
	},
	
	
	_enableSortingList: function() {
		var self = this;
		
		if ($('.plupload_file', this.filelist).length < 2) {
			return;	
		}

		// destroy sortable if enabled
		$('tbody', this.filelist).sortable('destroy');	
		
		// enable		
		this.filelist.sortable({
			items: '.plupload_delete',
			
			cancel: 'object, .plupload_clearer',

			stop: function() {
				var files = [];
				
				$.each($(this).sortable('toArray'), function(i, id) {
					files[files.length] = self.uploader.getFile(id);
				});				
				
				files.unshift(files.length);
				files.unshift(0);
				
				// re-populate files array				
				Array.prototype.splice.apply(self.uploader.files, files);	
			}
		});		
	}
});

} (window, document, plupload, mOxie, jQuery)); ;
teacss.ui.codeTab = (function($){
    return teacss.ui.Panel.extend("teacss.ui.codeTab",{
        tabs: [],
        serialize: function (tab) {
            return tab.options.file;
        },
        deserialize: function (data) {
            return new this({file:data,closable:true});
        },
        languageFromFilename: function (file) {
            var parts = file.split(".");
            var ext = parts[parts.length-1];
            var lang = undefined;
            if (ext=='css') lang = 'css';
            if (ext=='tea') lang = 'teacss';
            if (ext=='php') lang = 'php';
            if (ext=='phtml') lang = 'php';
            if (ext=='js')  lang = 'javascript';
            if (ext=='ts')  lang = 'typescript';
            if (ext=='py')  lang = 'python';
            if (ext=='htm' || ext=='html' || ext=='tpl') lang = 'php';
            return lang;            
        }
    },{
        init: function (options) {
            this._super(options);

            if (!this.options.label) {
                var label = this.options.file.split("/").pop().split("\\").pop();
                this.options.label = label;
            }
            
            this.tabs = new teacss.ui.tabPanel({width:'100%',height:'100%'});
            this.tabs.element
                .css({position:'absolute',left:0,right:0,top:0,bottom:0})
                .appendTo(this.element);
            
            this.codeTab = teacss.ui.panel("Code");
            this.tabs.addTab(this.codeTab);
            
            this.editorElement = this.codeTab.element;

            var file = this.options.file;
            var me = this;
            var parts = file.split(".");
            var ext = parts[parts.length-1];
            if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='gif') {
                this.element.html("");
                this.element.append($("<img>").attr("src",file+"?t="+Math.floor(Math.random()*0x10000).toString(16)));
                
                var colorPicker = this.colorPicker = new teacss.ui.colorPicker({width:40,height:30});
                colorPicker.change(function(){
                    me.element.css({ background: this.value });
                    me.saveState();
                });
                this.element.append(
                    colorPicker.element.css({
                        position:'absolute',
                        left: 5,
                        bottom: 5
                    })
                );
                this.restoreState();
            } else {
                me.editorElement.append("<div style='padding:10px'>Loading...</div>");
                FileApi.file(file,function (answer){
                    var data = answer.error || answer.data;
                    me.createEditor();
                });
            }
            
            this.tabs.showNavigation(false);
            this.trigger("init");
            this.changed = false;
            
            this.bind("close",function(o,e){
                if (this.changed) {
                    e.cancel = !confirm(this.options.label+" is not saved. Sure to close?");
                }
                if (!e.cancel) {
                    var index = this.Class.tabs.indexOf(this);
                    if (index!=-1) this.Class.tabs.splice(index, 1);
                }
            });
            
            FileApi.events.bind("move",function(o,e){
                if (e.path==me.options.file) me.options.file = e.new_path;
            });
            FileApi.events.bind("rename",function(o,e){
                if (e.path==me.options.file) {
                    me.options.file = e.new_path;
                    var caption = e.new_path.split("/").pop();
                    var id = me.element.parent().attr("id");
                    me.element.parent().parent().find("a[href=#"+id+"]").html(caption);
                }
            });
            FileApi.events.bind("remove",function(o,e){
                if (e.path==me.options.file) {
                    if (me.tabPanel) me.tabPanel.closeTab(me,true);
                }
            });
            
            this.Class.tabs.push(this);
            
            this.editorPanel = dayside.editor;
            dayside.editor.trigger("codeTabCreated",this);
        },
        
        createEditor: function() {
            var me = this;
            var file = this.options.file;
            var data = FileApi.cache[file];

            this.editorElement.html("");
            
            var lang = this.Class.languageFromFilename(file);
            var editorOptions = {
                value:data,
                lineNumbers:true,
                language: lang,
                theme:'vs',
                fontFamily: 'monospace',
                automaticLayout: true,
                autoClosingBrackets: false
            };
            
            var args = {options:editorOptions,tab:me};
            dayside.editor.trigger("editorOptions",args);
            editorOptions = args.options;            
            
            function makeEditor() {
                
                var tabs = me.element.parent().parent();
                var tab = tabs.find("a[href=#"+me.options.id+"]").parent();
                tab.attr("title",me.options.file);
                
                monaco_require.config({ paths: { 'vs': dayside.url + '/client/lib/monaco/dev/vs' }});
                monaco_require(['vs/editor/editor.main'], function() {
                    
                    me.editor = monaco.editor.create(me.editorElement[0], editorOptions, editorOptions.overrideOptions);
                    me.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function() {
                        if (me.changed) {
                            setTimeout(function(){
                                me.saveFile();
                            },100);
                        }
                    });                    

                    var model = me.editor.getModel();
                    model.setEOL('\n');
                    model.setValue(data);
                    model.onDidChangeContent(function(){ me.editorChange(); });
                    if (editorOptions.modelOptions) model.updateOptions(editorOptions.modelOptions);
                    me.restoreState();
                    
                    dayside.editor.trigger("editorCreated",{editor:me.editor,tab:me});
                    me.trigger("editorCreated",{editor:me.editor,tab:me});
                });            
            }
            
            if (this.editorElement.is(":visible") || me.options.invisibleEditorCreate) {
                makeEditor();
            } else {
                var f = this.bind("select",function(){
                    setTimeout(makeEditor);
                    me.unbind("select",f);
                });
            }            
        },
        saveState: function () {
            var me = this;
            var data = dayside.storage.get("codeTabState");
            if (!data) data = {};
            if (this.editor) {
                data[me.options.file] = {viewState:this.editor.saveViewState()};
            } else {
                data[me.options.file] = this.colorPicker.value;
            }
            dayside.storage.set("codeTabState",data);
            
        },
        restoreState: function () {
            var me = this;
            var stateData = dayside.storage.get("codeTabState");
            if (stateData && stateData[me.options.file]) {
                var data = stateData[me.options.file];
                if (this.editor) {
                    if (data.viewState) me.editor.restoreViewState(data.viewState);
                } else {
                    this.colorPicker.setValue(data);
                    this.colorPicker.trigger("change");
                }
            }
            if (this.editor) {
                this.editor.onDidScrollChange(function(){me.saveState()});
            }
        },
        editorReady: function (callback) {
            var me = this;
            if (me.editor) {
                callback.call(me,me.editor);
            } else {
                this.bind("editorCreated",function(){
                    callback.call(me,me.editor);
                });
            }
        },
        editorChange: function() {
            if (!this.editor) return;
            
            var text = this.editor.getValue();
            var tabs = this.element.parent().parent();
            var tab = tabs.find("a[href=#"+this.options.id+"]").parent();
            
            var changed = (text!=FileApi.cache[this.options.file]);
            this.changed = changed;
            
            if (!changed)
                tab.removeClass("changed");
            else
                tab.addClass("changed");
            this.editorPanel.trigger("codeChanged",this);
        },
        saveFile: function(cb) {
            var me = this;
            var tabs = this.element.parent().parent();
            var tab = tabs.find("a[href=#"+this.options.id+"]").parent();
            var text = this.editor.getValue();

            var saving_event = {text:text,cancel:false};
            this.trigger("saving",saving_event);
            if (saving_event.cancel) return;

            FileApi.save(this.options.file,text,function(answer){
                var data = answer.error || answer.data;
                if (data=="ok") {
                    me.changed = false;
                    tab.removeClass("changed");
                    me.editorPanel.trigger("codeSaved",me);
                    me.trigger("codeSaved");
                    if (me.callback) me.callback();
                    if (cb) cb(true);
                } else {
                    if (cb) 
                        cb(false);
                    else
                        alert(data);
                }
            });
        },
        onSelect: function () {
            var me = this;
        }
    });
})(teacss.jQuery);;
teacss.ui.filePanel = (function($){
    return teacss.ui.Panel.extend({},{
        init: function (options) {
            var me = this;
            this._super(options);
            
            var add_sheet = function (opts) {
                if (opts.url) return;
                return orig.call(this,opts);
            }
            if ($.vakata.css.add_sheet!=add_sheet) {
                var orig = $.vakata.css.add_sheet;
                $.vakata.css.add_sheet = add_sheet;
            }
            
            this.tree = $("<div>").css({position:'absolute',left:0,right:0,top:0,bottom:0,overflow:'auto'}).appendTo(this.element);
            this.tree
                .bind("open_node.jstree create_node.jstree clean_node.jstree refresh.jstree",function (e,data) {
                    var obj = data.rslt.obj;
                    var inst = data.inst;
                    obj = !obj || obj == -1 ? inst.get_container().find("> ul > li") : inst._get_node(obj);
                    if(obj === false) { return; }
                    obj.each(function(n,node){
                        if (node.ondragover) return;
                        if (!$(node).data("folder")) return;
                        
                        node.ondragover = function() { return false; };
                        node.ondragleave = function() { return false; };
                        node.ondrop = function(event) {
                            if (me.droppingFile) return;
                            me.droppingFile = true;
                            setTimeout(function(){
                                me.droppingFile = false;
                            });
                            
                            var path = $(node).attr("rel");
                            if (!me.uploadDialog) {
                                me.uploadDialog = teacss.ui.uploadDialog({
                                    jupload: me.options.jupload,
                                    jupload_data: me.options.jupload_data
                                });
                            }
                            
                            if (event && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
                                var files = [];
                                for (var i = 0; i < event.dataTransfer.files.length; i++) {
                                    files.push(event.dataTransfer.files.item(i));
                                }
                                me.uploadDialog.open(path,me.tree,$(node),files);
                            }
                            return false;
                        };            
                    });
                    
                })
                .bind("dblclick.jstree", function (e, data) {
                    var link = $(e.target).closest("a");
                    if (link.length) {
                        var li = link.parent();
                        if (li.data("folder")) {
                            me.tree.jstree("toggle_node",li);
                        } else {
                            if (me.options.onSelect)
                                me.options.onSelect(li.attr("rel"));
                        }
                    }
                })
                .bind("rename.jstree", function(e, data){
                    var path = data.rslt.obj.attr("rel");
                    if (data.rslt.new_name==data.rslt.old_name) return;
                    FileApi.rename(path,data.rslt.new_name,function(answer){
                        var res = answer.error || answer.data;
                        if (res!="ok") {
                            $.jstree.rollback(data.rlbk);
                            alert(res);
                        } else {
                            var rel = path.split("/"); 
                            rel.pop(); rel.push(data.rslt.new_name); 
                            rel = rel.join("/");
                            
                            var obj = data.rslt.obj;
                            obj.attr("rel",rel).attr("id",rel.replace(/[^A-Za-z0-9_-]/g,'_'));
                            
                            $(obj).find("li").each(function(){
                                var sub = $(this).attr("rel");
                                if (sub.substring(0,path.length)==path)
                                    sub = rel + sub.substring(path.length);
                                $(this).attr("rel",sub).attr("id",sub.replace(/[^A-Za-z0-9_-]/g,'_'));
                            });
                        }
                    });
                })
                .bind("delete_node.jstree", function (e,data){
                    var pathes = [];
                    data.rslt.obj.each(function(){
                        pathes.push($(this).attr("rel"));
                    });                        
                    FileApi.remove(pathes,function(answer){
                        var res = answer.error || answer.data;
                        if (res!="ok") {
                            $.jstree.rollback(data.rlbk);
                            alert(res);
                        }
                    });
                })
                .bind("move_node.jstree", function (e,data){
                    var pathes = [];
                    var dest = data.rslt.np.attr("rel");
                    var dest_pathes = [];
                    
                    data.rslt.o.each(function(){
                        var path = $(this).attr("rel");
                        pathes.push(path);
                        var name = path.split("/").pop();
                        dest_pathes.push(dest + "/" + name);
                    });
                    
                    var is_copy = data.args[3];
                    var dest_nodes = is_copy ? data.rslt.oc : data.rslt.o;
                    var func_name = is_copy ? "copy" : "move";
                    
                    if (!is_copy && pathes.length && pathes[0]==dest_pathes[0]) return;
                    var answer = FileApi[func_name](pathes,dest_pathes,function(answer){
                        var res = answer.error || answer.data;
                        if (res!="ok") {
                            $.jstree.rollback(data.rlbk);
                            alert(res);
                        } else {
                            dest_nodes.each(function(){
                                var path = $(this).attr("rel");
                                // save initial name, without "copyN" addon
                                var blank_name;
                                var name = blank_name = path.split("/").pop();
                                var rel = dest + "/" + name;
                                
                                // split to extension and basename because copyN is added in between
                                var parts = name.split(".");
                                var ext = "";
                                if (parts.length>1) ext = "."+parts.pop();
                                var base = parts.join(".");
                                
                                var all_lis = me.tree.find("li");
                                var N = 1;
                                // while name is busy goto next one
                                while (all_lis.filter(function(){return $(this).attr("rel")==rel;}).length>0) {
                                    name = base + "-copy" + (N>1?N:"") + ext;
                                    rel = dest + "/" + name;
                                    N++;
                                }
                                $(this).attr("rel",rel).attr("id",rel.replace(/[^A-Za-z0-9_-]/g,'_'));
                                
                                // if name was busy at least once, correct the copied noed state
                                if (name!=blank_name) {
                                    // rename it
                                    me.tree.jstree('set_text', this, name);
                                    // an resort parent
                                    me.tree.jstree('sort',$(this).parent());
                                }
                                
                                // rename all node children
                                $(this).find("li").each(function(){
                                    var sub = $(this).attr("rel");
                                    if (sub.substring(0,path.length)==path)
                                        sub = rel + sub.substring(path.length);
                                    $(this).attr("rel",sub).attr("id",sub.replace(/[^A-Za-z0-9_-]/g,'_'));
                                });
                            });
                        }
                    });
                })
                .jstree({
                    core: {
                        animation: 100
                    },
                    json_data: {
                        data: function (node,after) {
                            var rel = node==-1 ? FileApi.root.replace(/\/$/,'') : node.attr("rel");
                            FileApi.dir(rel,function(answer){
                                var list, children, data;
                                if (!answer.error) {
                                    data = answer.data;
                                    if (node==-1) {
                                        list = [{
                                            data: {title:"/",icon:'project'},
                                            attr: { rel: rel },
                                            state: "open",
                                            metadata: {folder:true},
                                            children: []
                                        }];
                                        children = list[0].children;
                                    } else {
                                        children = list = [];
                                    }
                                    for (var i=0;i<data.length;i++) {
                                        var item = {data:{}};
                                        item.data.title = data[i].name;
                                        item.attr = { rel: data[i].path };
                                        if (data[i].folder) {
                                            item.data.icon = 'folder';
                                            item.state = "closed";
                                        } else {
                                            var ext = data[i].path.split(".").pop();
                                            if (ext.indexOf('/')!=-1) ext = "";
                                            item.data.icon = 'file '+ext;
                                        }
                                        if (data[i].cls)
                                            item.attr['class'] = data[i].cls;
                                        
                                        item.metadata = data[i];
                                        item.attr.id = data[i].path.replace(/[^A-Za-z0-9_-]/g,'_');
                                        children.push(item);
                                    }
                                    
                                    var e = {data:list,node:node};
                                    me.trigger("json_data",e);
                                    list = e.data;
                                    
                                    after(list);
                                }
                            });
                        }
                    },
                    contextmenu: {
                        select_node: true,
                        items : function (node) {
                            var path = node.attr("rel");
                            var file;
                            var res = {};
                            res["link"] = {label:"Open web location",action:function(){
                                window.open(path);
                            }}

                            res["download"] = { label: 'Download', action: function(e){
                                var array_path = [];
                                var obj = this.data.ui.selected;
                                for (i = 0; i < obj.length; i++) { 
                                    array_path[i] = this.data.ui.selected[i].getAttribute("rel");
                                }
                                window.open(window.FileApi.ajax_url + '?' + $.param({path : array_path, _type: 'download'}));
                            }}                                
                            
                            if (node.data("folder")) {
                                res = $.extend(res,{
                                    "refresh": {label:"Refresh",separator_before:true,action:function(){
                                         me.tree.jstree('refresh',node);
                                    }},
                                    "search": {
                                        label:'Search files',
                                        separator_before: false,
                                        action: function () {
                                            if (!me.searchDialog) {
                                                me.searchDialog = teacss.ui.searchDialog();
                                            }
                                            me.searchDialog.open(path,me.tree,node);                                            
                                        }
                                    },

                                    "upload": {label:"Upload",separator_before:true,action:function(){
                                        if (!me.uploadDialog) {
                                            me.uploadDialog = teacss.ui.uploadDialog({
                                                jupload: me.options.jupload,
                                                jupload_data: me.options.jupload_data
                                            });
                                        }
                                        me.uploadDialog.open(path,me.tree,node);

                                    }},
                                    "create": {
                                        label: 'Create',
                                        separator_before: true,
                                        submenu: {
                                            "createFile": {label:"Create file",action:function(){
                                                if (file = prompt('Enter filename')) {
                                                    FileApi.createFile(path,file,function(answer){
                                                        // refresh
                                                        me.tree.jstree('refresh',node);
                                                    });
                                                }
                                            }},
                                            "createFolder": {label:"Create folder",action:function(){
                                                if (file = prompt('Enter folder name')) {
                                                    FileApi.createFolder(path,file,function(answer){
                                                        // refresh
                                                        me.tree.jstree('refresh',node);
                                                    })
                                                }
                                            }}
                                        }
                                    }
                                });
                            }
                            
                            if (path!=FileApi.root) {
                                if (path.split(".").pop()=='zip') res['unzip'] = {label:"Unpack",action:function(){
                                    if (confirm('Unpack to current folder?')) {
                                        FileApi.unpack(path,function(answer){
                                            me.tree.jstree("refresh",node.parent().parent());
                                        });
                                    }
                                }}
                                
                                res["rename"] = {label: "Rename",separator_before:true, action:function(){
                                    me.tree.jstree("rename");
                                }}
                                res["delete"] = {label: "Delete",action:function(){
                                    if (confirm('Sure to delete files?'))
                                        me.tree.jstree("remove");
                                }}
                            }
                                
                            var data = {
                                menu: res,
                                path: path,
                                node: node,
                                inject: function(object, newKey, newVal, fn, bind){
                                    var prevKey=null, prevVal=null, inserted=false, newobject={};
                                    for(var currKey in object){
                                        if (object.hasOwnProperty(currKey)){
                                            var currVal = object[currKey];
                                            if( !inserted && fn.call(bind, prevKey, prevVal, currKey, currVal) ){
                                                newobject[newKey] = newVal;
                                                inserted=true;
                                            }
                                            newobject[currKey] = currVal;
                                            prevKey = currKey;
                                            prevVal = currVal;
                                        } 
                                    }
                                    if(!inserted) newobject[newKey] = newVal;
                                    return newobject;
                                }
                            };
                            me.trigger("contextMenu",data);
                            return data.menu;
                        }
                    },
                    themes: {
                        url: FileApi.base_url+"dev/editor/lib/jstree/themes/default/style.css"
                    },
                    hotkeys: {
                        "return": function () {
                            var o = this.data.ui.hovered || this.data.ui.last_selected;
                            if(o && o.length) {
                                var li = $(o[0]);
                                if (li.data("folder")) {
                                    me.tree.jstree("toggle_node",li);
                                } else {
                                    if (me.options.onSelect)
                                        me.options.onSelect(li.attr("rel"));
                                }
                            }
                            return false;                            
                        },
                        "del": function () {
                            if (confirm('Sure to delete files?')) {
                                me.tree.jstree("remove");
                            }
                        }
                    },
                    crrm: {
                        move: {
                            check_move: function (m) {
                                var valid = true;
                                var parent = false;
                                m.o.each(function(){
                                    var rel = $(this).attr("rel").split("/");
                                    rel.pop();rel=rel.join("/");
                                    if (rel=="") rel = "/";
                                    if (!parent) 
                                        parent = rel;
                                    else
                                        if (parent!=rel) valid = false;
                                });
                                var dest = m.np.attr("rel");
                                if (!valid) return false;
                                if (dest==undefined) return false;
                                return true;
                            }
                        }
                    },
                    sort: function (a,b) {
                        var fa = $(a).data("folder")
                        var fb = $(b).data("folder");
                        if (fa==fb) {
                            return this.get_text(a) > this.get_text(b) ? 1 : -1;
                        } else {
                            return fb ? 1 : -1;
                        }
                    },
                    plugins : ["themes","json_data","ui","contextmenu","storage","hotkeys","dnd","crrm","sort"]
                })
        }
    });
})(teacss.jQuery);;
(function($,ui){
    
var themes = [
    'vs',
    'vs-dark dark-ui',
    'hc-black dark-ui'
];    
    
ui.optionsButton = teacss.ui.Button.extend({
    init: function (options) {
        this.defaults = {
            fontSize: 14,
            tabSize: 4,
            useTab: false
        }

        var ui = teacss.ui;
        var me = this;
        var panel,check;
        
        var themeOptions = {};
        $.each(themes,function(t,theme){ themeOptions[theme] = theme.split(" ")[0]; });
        
        this.loadValue();
        this.updateOptions();
        
        me.form = ui.form(function(){
            panel = ui.tabPanel({width:"100%",height:'auto',margin:0,padding:0});
            var editorTab = ui.panel({label:"Editor",padding:"1em"}).push(
                ui.label({template:'Font size: ${value}px',name:'fontSize',margin:"5px 0"}),
                ui.slider({min:10,max:24,margin:"0px 15px 0px",name:'fontSize'}),
                ui.label({template:'Tab size: ${value}',name:'tabSize',margin:"5px 0"}),
                ui.slider({min:1,max:16,margin:"0px 15px 0px",name:'tabSize'}),
                check = ui.check({margin:"10px 15px 5px 15px",width:'100%',label:'Use tab character',name:'useTab'}),
                ui.label({template:'Theme:',margin:"5px 0"}),
                ui.select({name: 'theme', items: themeOptions,width:"100%", comboDirection: 'bottom', comboHeight: 1000, margin: "-3px 0 0 0" })
            );
            panel.addTab(editorTab);
            dayside.core.trigger("configTabsCreated",{tabs:panel});
        });

        me.form.setValue(me.value);
        me.form.bind("change",function(){
            me.value = me.form.value;
            me.updateOptions();
            me.trigger("change");
            me.saveValue();
        });

        this.dialog = ui.dialog({
            title: options.label,
            width: 300,
            resizable: false,
            draggable: true,
            dialogClass: "dayside-config-dialog",
            items: [panel]
        });
        
        this._super($.extend({
            click: function () {
                me.dialog.open();
            }
        },options));
    },
    saveValue: function () {
        dayside.storage.set("options",this.value);
    },
    loadValue: function () {
        dayside.core.trigger("configDefaults",{value:this.defaults});
        this.value = $.extend({},this.defaults,dayside.storage.get("options",{}));
    },
    updateOptions: function () {
        var ui = teacss.ui;
        var value = this.value;
        var me = this;
        
        dayside.core.trigger("configUpdate",{value:this.value});

        $("body").attr("class","theme-"+value.theme);
        
        this.editorOptions = {
            fontSize: value.fontSize,
            lineHeight: value.fontSize,
            theme: (value.theme || "").split(" ")[0],
            modelOptions: {
                insertSpaces: !value.useTab,
                tabSize: value.tabSize
            }
        }
        
        if (!this.editorOptionsHandler) {
            this.editorOptionsHandler = function (b,e){
                e.options = $.extend(e.options,me.editorOptions);
            }
            dayside.editor.bind("editorOptions",this.editorOptionsHandler);
        }
        
        for (var t=0;t<ui.codeTab.tabs.length;t++) {
            var e = ui.codeTab.tabs[t].editor;
            if (e) {
                e.updateOptions(this.editorOptions);
                e.getModel().updateOptions(this.editorOptions.modelOptions);
            }
        }         

        // create dynamic CSS node to reflect fontSize changes for CodeMirror
        var styles = $("#ideStyles");
        if (styles.length==0) {
            styles = $("<style>").attr({type:"text/css",id:"ideStyles"}).appendTo("head");
        }
        styles.html(".code-text {font-size:"+value.fontSize+"px !important; }");
    }  
});
    
})(teacss.jQuery,teacss.ui);;
teacss.ui.dockPanel = (function($){
    return teacss.ui.panel.extend({
        init: function (options) {
            var ui = teacss.ui;
            var me = this;
            
            this.centerArea = ui.panel({items:[
                this.centerPanel = ui.tabPanel({width:"100%",height:"100%",margin:0,padding:0}),
                this.statusBar = ui.panel({margin:0,padding:"0 10px"})
            ]});
            this.centerPanel.element.css({ position: 'absolute', left: 0, right: 0, top: 0, bottom: 24, height: "" });
            this.statusBar.element.css({ position: 'absolute', left: 0, right: 0, height: 24, lineHeight: "24px", bottom: 0 }).addClass("dayside-statusbar");
            
            var lc = ui.panel({items:[
                this.leftPanel = ui.tabPanel(),
                this.centerArea,
                this.leftSplitter = ui.splitter({panels:[this.leftPanel,this.centerArea ],align:'left',size:2})
            ]});
            var lcr = ui.panel({items:[
                lc,
                this.rightPanel = ui.tabPanel(),
                this.rightSplitter = ui.splitter({panels:[this.rightPanel,lc],align:'right',size:2})
            ]});
            this._super($.extend({},options,{margin:0,items:[
                lcr,
                this.bottomPanel = ui.tabPanel(),
                this.bottomSplitter = ui.splitter({panels:[this.bottomPanel,lcr],align:'bottom',size:2})
            ]}));
            
            this.linkSplitter(this.leftPanel,this.leftSplitter);
            this.linkSplitter(this.rightPanel,this.rightSplitter);
            this.linkSplitter(this.bottomPanel,this.bottomSplitter);
            
            this.dropDiv = $("<div>").addClass("ui-drop-icons").hide().append(
                $("<div>").html("◄").data("tabPanel",this.leftPanel),
                $("<div>").html("▼").data("tabPanel",this.bottomPanel),
                $("<div>").html("►").data("tabPanel",this.rightPanel)
            )
            .appendTo(this.centerPanel.element);
            
            this.dropDiv.children().droppable({
                hoverClass: "hover",
                drop: function (e,ui) {
                    var sel = ui.draggable.find("a").attr("href");
                    var panel = $(sel);
                    var tab = panel.data("tab");
                    me.reorderTab($(this).data("tabPanel"),tab);
                    ui.draggable.data("dropped",true);
                }
            })
        },
        linkSplitter: function (panel,splitter) {
            function hide() {
                splitter.hidden = false;
                var val = splitter.getValue();
                splitter.setValue(-splitter.options.size);
                splitter.value = val;
                splitter.element.hide();
                splitter.hidden = true;
                panel.element.hide();
            }
            function show() {
                splitter.hidden = false;
                splitter.setValue(splitter.value);
                splitter.element.show();
                panel.element.show();
            }
            panel.element.data("tabPanel",panel);
            
            var old_setValue = splitter.setValue;
            splitter.setValue = function (val) {
                this.value = val;
                if (!splitter.hidden) old_setValue.call(this,val);
            }
                
            var me = this;
            splitter.change(function(){me.trigger("change")});
            
            hide();
            panel.bind("refresh",function(){
                if (this.count()) show(); else hide();
            })
            
            var cls = 'dock-nav';
            panel.element.find(".ui-tabs-nav").addClass(cls).sortable("destroy").sortable({
                connectWith: "."+cls,
                placeholder: 'ui-state-highlight ui-sortable-placeholder',
                forcePlaceholderSize: true,
                distance: 3,
                sort: function (event, ui) {
                    var that = $(ui.placeholder).parent();
                    var x = ui.offset.left;
                    that.children().each(function () {
                        if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder')) return true;
                        var x2 = $(this).offset().left;
                        var w2 = $(this).width();
                        if (x>=x2 && x<=x2+w2) {
                            var holder = $('.ui-sortable-placeholder', that);
                            if (holder.index()<$(this).index())
                                holder.insertAfter(this);
                            else
                                holder.insertBefore(this);
                            return false;
                        }
                    });
                },
                helper: function(e, item) {
                    var h = item;
                    h.width(item.width()+2);
                    return h;
                },                    
                start: function (e,ui) {
                    $(this).css("overflow","visible").height($(this).height());
                    $(".ui-drop-icons").show();
                },
                stop: function (e,ui) {
                    $(this).css({overflow:"",height:""});
                    $(".ui-drop-icons").hide();
                    ui.item.css('width','');
                },
                receive: function (e,ui) {
                    var sel = ui.item.find("a").attr("href");
                    var panel = $(sel);
                    var tab = panel.data("tab");
                    var idx = ui.item.index();
                    $(ui.sender).sortable("cancel");
                    if (ui.item.data("dropped")) return;
                    me.reorderTab($(this).parent().data("tabPanel"),tab,idx);
                }
            });
        },      
        reorderTab: function (panel,tab,idx) {
            if (tab && panel) {
                var sel = $("#"+tab.options.id);
                setTimeout(function(){
                    tab.element.detach();
                    if (tab.tabPanel) tab.tabPanel.closeTab(tab,true);
                    panel.addTab(tab,idx);
                    panel.selectTab(tab);
                    
                    setTimeout(function(){
                        tab.element.find(".ui-accordion").accordion("resize");
                    },1);
                },1);
                
                if (tab.dockId) {
                    var pos = "left";
                    if (panel==this.rightPanel) pos = "right";
                    if (panel==this.bottomPanel) pos = "bottom";
                    
                    this.value = this.getValue();
                    this.value.tabs[tab.dockId] = pos;
                    this.trigger("change");
                }
            }
        },
        addTab: function (tab,id,defaultPos) {
            id = id || tab.element.attr("id");
            defaultPos = defaultPos || "left";
            
            var panel = this[defaultPos+"Panel"];
            this.value = this.getValue();
            if (id) {
                if (this.value.tabs[id]) {
                    var name = this.value.tabs[id]+"Panel";
                    panel = this[name];
                } else {
                    this.value.tabs[id] = defaultPos;
                    this.trigger("change");
                }
                tab.dockId = id;
            }
            panel.addTab(tab);
            return tab;
        },
        getValue: function () {
            return {
                left: this.leftSplitter.value,
                right: this.rightSplitter.value,
                bottom: this.bottomSplitter.value,
                tabs: (this.value && this.value.tabs) ? this.value.tabs : {}
            }
        },
        setValue: function (value) {
            this._super(value);
            if (value && value.left!==undefined && value.right!==undefined && value.bottom!==undefined) {
                this.leftSplitter.setValue(value.left);
                this.rightSplitter.setValue(value.right);
                this.bottomSplitter.setValue(value.bottom);
            }
        }
    })
})(teacss.jQuery);

teacss.ui.editorPanel = (function($){
    return teacss.ui.panel.extend({
        
        selectFile: function (file) {
            var tab = this.openFile(file,true);
            this.tabsForFiles.selectTab(tab);
            return tab;
        },

        openFile: function (file) {
            var me = this;
            var ui = teacss.ui;
            var tab;
            for (var i=0;i<ui.codeTab.tabs.length;i++) {
                if (ui.codeTab.tabs[i].options.file==file)
                    tab = ui.codeTab.tabs[i];
            }
            if (!tab) {
                tab = ui.codeTab({file:file,closable:true,editorPanel:me,invisibleEditorCreate:true});
                me.tabsForFiles.addTab(tab);
            }
            return tab;
        },
        
        setStatus: function (msg,icon,timeout) {
            var me = this;
            clearTimeout(me.statusTimeout);
            me.mainPanel.statusBar.element.text(msg);
            if (msg) setTimeout(function(){
                me.mainPanel.statusBar.element.text("");
            },timeout || 20000);
        },
        
        init : function (options) {
            var me = this;
            var ui = teacss.ui;
            
            window.dayside.editor = me;
            
            this.mainPanel = ui.dockPanel({});
            this.mainPanel.element.css({position:'absolute',left:0,right:0,top:27,bottom:0,'z-index':1});
            
            this.mainPanel.bind("change",function(){
                dayside.storage.set("mainLayout",this.getValue());
            });
            this.mainPanel.setValue(dayside.storage.get("mainLayout"));
            
            this.sidebarTabs = this.tabs = this.mainPanel.leftPanel;
            this.contentTabs = this.tabs2 = this.mainPanel.centerPanel;
            this.tabsForFiles = this.tabs2;
            
            // file tree tab
            this.filesTab = this.mainPanel.addTab(ui.panel("Files"),"filesTab");
            this.filePanel = ui.filePanel({
                jupload: options.jupload,
                onSelect: function (file) {
                    me.selectFile(file);
                }
            });
            this.filesTab.element.append(this.filePanel.element);
            
            // toolbar
            this.toolbar = new ui.panel({margin:0})
            this.toolbar.element
                .css({position:'absolute',left:0,right:0,top:0,padding:""})
                .addClass("editorPanel-toolbar");
            
            this.loadTabs();
            
            this._super($.extend({items:[this.toolbar,this.mainPanel],margin:0},options||{}));
            this.element.css({position:'fixed',left:0,top:0,right:0,bottom:0});
            
            // config button
            this.optionsButton = new ui.optionsButton({
                label:"Config",
                icons:{primary:'ui-icon-gear'},
                margin: 0
            });
            this.optionsButton.element
                .appendTo(this.toolbar.element);
            
            this.element.appendTo("body").addClass("teacss-ui");
            
            // tabs state save
            var old_addTab = this.tabsForFiles.addTab;
            this.tabsForFiles.addTab = function (tab) {
                old_addTab.apply(this,arguments);
                if (!me.loadingTabs) setTimeout(me.saveTabs,1);
                tab.bind("close",function(){setTimeout(me.saveTabs,1)});
            }
            this.tabsForFiles.bind("select",function(){ me.saveTabs() });
            this.tabsForFiles.bind("sortstop",function(){ me.saveTabs() });
            
            // context menu for tabs
            $(document).on("contextmenu",".ui-tabs-nav > li",function(e){
                if (e.which==3) {
                    var li = this;
                    var id = $(this).find("a:first").attr("href");
                    var tab = $(this).parents(".ui-tabs").eq(0).find(id).data("tab");
                    if (tab) {
                        var items = {
                            close: {
                                label: "Close",
                                action: function () {
                                    me.tabsForFiles.closeTab(tab);
                                }
                            },
                            closeAll: {
                                label: "Close all",
                                action: function () {
                                    items.closeOthers.action();
                                    items.close.action();
                                }
                            },
                            closeOthers: {
                                label: "Close others",
                                action: function () {
                                    var tabs = $(li).parents(".ui-tabs").eq(0);
                                    $(li).siblings().each(function(){
                                        var id = $(this).find("a").attr("href");
                                        var other = tabs.find(id).data("tab");
                                        if (tab) me.tabsForFiles.closeTab(other);
                                    });                                    
                                }
                            },
                            save: {
                                label: "Save",
                                separator_before: true,
                                action: function () {
                                    tab.saveFile();
                                }
                            }
                        }
                            
                        if (!tab.options.closable) delete items.close;
                        if ($(this).siblings().length==0) {
                            delete items.closeOthers;
                            delete items.closeAll;
                        }
                        if (!$(this).hasClass("changed")) delete items.save;
                        
                        var pos = $(this).offset();
                        $.vakata.context.show(items,false,pos.left,pos.top+$(this).height());
                        $("#vakata-contextmenu").addClass("jstree-default-context");
                    }
                    e.preventDefault();
                }
            });
        },
        saveTabs: function () {
            if (this.loadingTabs) return;
            var list = [];
            teacss.jQuery(".ui-tabs-panel").each(function(){
                var tab = teacss.jQuery(this).data("tab");
                var id = tab.options.id;
                var active_href = $(this).parent().find("> .ui-tabs-nav .ui-tabs-active a").attr("href");
                var selected = ("#"+id)==active_href;
                
                if (tab && tab.Class.serialize) {
                    list.push({cls:tab.Class.fullName,data:tab.Class.serialize(tab),selected:selected});
                }
            });
            dayside.storage.set("tabs",list);
        },
        loadTabs: function () {
            this.loadingTabs = true;
            var me = this;
            var list = dayside.storage.get("tabs");
            if (list && $.isArray(list)) setTimeout(function () {
                $.each(list,function(){
                    var cls = $.Class.getObject(this.cls);
                    if (cls && cls.deserialize) {
                        var tab = cls.deserialize(this.data);
                        if (tab) {
                            me.tabsForFiles.addTab(tab);
                            if (this.selected) {
                                me.tabsForFiles.selectTab(tab);
                            }
                        }
                    }
                });
            },1);
            this.loadingTabs = false;
        }
        
    });
})(teacss.jQuery);;
teacss.ui.uploadDialog = teacss.ui.dialog.extend({
    init: function (o) {
        var $ = teacss.jQuery;
        this._super($.extend({
            autoOpen: false,
            resizable: false,
            width: 650, 
            height: 'auto',
            modal: true,
            title: "Upload files"
        },o));
        
        this.panel = teacss.ui.panel({label:"Upload"});
        this.java_panel = teacss.ui.panel({label:"Java Upload"});
        
        this.tabs = teacss.ui.tabPanel({height: 400,width:"100%",margin:0});
        this.tabs.push(this.panel);
        this.tabs.push(this.java_panel);
        this.push(this.tabs);
        
        this.element.css({padding:0,border:'none'});
        this.tabs.element.css({border:"none"});
        
        var me = this;
        setTimeout(function(){
            me.panel.element.plupload({
                runtimes : 'html5',
                url : "http://no-url-set",
                max_file_size : '10000mb',
                chunk_size: '500kb',
                views: {
                    list: true,
                    thumbs: true, // Show thumbs
                    active: 'list'
                },
                resize: false,
                flash_swf_url : 'http://rawgithub.com/moxiecode/moxie/master/bin/flash/Moxie.cdn.swf',
                silverlight_xap_url : 'http://rawgithub.com/moxiecode/moxie/master/bin/silverlight/Moxie.cdn.xap',
                complete: function () {
                    me.tree.jstree('refresh',me.node);
                },
                init: {
                    Init: function () {
                        me.initParams();
                    }
                },
                multipart_params: {_csrf:FileApi.getCSRFToken()}
            });
        },1);
        
        this.java_panel.bind("select",function(){
            setTimeout(function(){
                me.createJavaApplet();
            },1);
        });
    },
    
    createJavaApplet: function () {
        var me = this;
        var $ = teacss.jQuery;
        
        if (me.uploadPanel) return;
        
        var formdata = me.options.jupload_data || {};
        formdata = $.extend(formdata,{path:FileApi.root,_type:"upload",_csrf:FileApi.getCSRFToken()});
        var inputs = "";
        for (var key in formdata)
            inputs += '<input type="hidden" name="'+key+'" value="'+formdata[key]+'">';
        me.uploadPanel = teacss.jQuery([
            '<div>',
                '<form id="uploadForm">',
                    inputs,
                '</form>',
                '<APPLET',
                '        CODE="wjhk.jupload2.JUploadApplet"',
                '        NAME="JUpload"',
                '        ARCHIVE="'+me.options.jupload+'"',
                '        WIDTH="100%"',
                '        HEIGHT="370px"',
                '        MAYSCRIPT="true"',
                '        ALT="The java pugin must be installed.">',
                '    <param name="postURL" value="'+FileApi.ajax_url+'" />',
                '    <param name="lookAndFeel" value="system" />',
                '    <param name="formdata" value="uploadForm" />',
                '    <param name="afterUploadURL" value="javascript:window.afterJUpload()" />',
                '    <param name="showLogWindow" value="false" />',
                '    <param name="debugLevel" value="100" />',
                '    <param name="lang" value="en" />',
                '    Java 1.5 or higher plugin required.',
                '</APPLET>',
            '</div>'
        ].join("\n"));
        me.uploadPanel.appendTo(me.java_panel.element);
        me.initJavaParams();
    },
    
    initParams: function () {
        var data = this.panel.element.data("uiPlupload");
        if (data) {
            data.uploader.setOption("url",
                FileApi.ajax_url+"?"+teacss.jQuery.param({path:this.path,_type:"upload"})
            );
            if (this.filesToAdd) {
                data.uploader.addFile(this.filesToAdd);
                this.filesToAdd = false;
            }
        }
    },
    
    initJavaParams: function () {
        var me = this;
        if (me.uploadPanel) {
            me.uploadPanel.find("input[name=path]").val(me.path);
            window.afterJUpload = function () {
                me.tree.jstree('refresh',me.node);
            }
        }
    },
    
    open: function (path,tree,node,filesToAdd) {
        this._super();
    
        this.path = path;
        this.tree = tree;
        this.node = node;
        this.filesToAdd = filesToAdd;
        
        this.initJavaParams();
        this.initParams();
    }
});
(function($,ui){
teacss.ui.searchDialog = teacss.ui.dialog.extend({
    init: function (o) {
        var $ = teacss.jQuery;
        var me = this;
        this._super($.extend({
            autoOpen: false,
            resizable: false,
            width: 650, 
            height: 'auto',
            modal: true,
            title: "Search for files",
            buttons: {
                "Search": function () {
                    me.search();
                }
            }
        },o));
        
        me.maskInput = teacss.ui.text({width:"100%",margin:"0px 0"});
        me.textInput = teacss.ui.text({width:"100%",margin:"0px 0"});
        
        this.element.append(
            me.form = $("<form>").append(
                teacss.ui.label({value:"Search mask:",width:"100%",margin:"10px 0 5px"}).element,
                me.maskInput.element,
                teacss.ui.label({value:"Contains text:",width:"100%",margin:"10px 0 5px"}).element,
                me.textInput.element,
                $("<input type='submit'>").css({display:"none"})
            )
            .submit(function(e){
                e.preventDefault();
                me.search();
                return false;
            })
        );
        
        me.maskInput.setValue(dayside.storage.get("file-search-mask")||"*.php");
        me.textInput.setValue(dayside.storage.get("file-search-text")||"");
        
        me.currentSearch = 0;
    },

    open: function (path,tree,node) {
        this.path = path;
        this._super();
    },
    
    search: function () {
        var me = this;
        if (!me.searchTab) {
            me.searchTab = teacss.ui.panel({label:"Search",closable:true,padding:"5px 0"});
            me.searchTab.element.addClass("file-search-tab");
            me.searchTab.bind("close",function(){
                me.currentSearch++;
            });
            
            $(document).on("click",".file-search-tab a",function(e){
                e.preventDefault();
                var link = $(this).attr("data-url");
                if (!link) return;
                
                var tab = dayside.editor.selectFile(link);
                var text = me.currentParams.text;
                
                if (text) {
                    function editorCreated() {
                        monaco_require(['vs/editor/contrib/find/common/findController'],function(fc){
                            var efc = fc.CommonFindController.get(tab.editor);
                            efc.setSearchString(text);
                            if (!efc.getState().matchCase) efc.toggleCaseSensitive();
                            efc.start({});
                            efc.moveToNextMatch();
                        })
                    }

                    if (tab.editor) 
                        editorCreated();
                    else
                        tab.bind("editorCreated",editorCreated);
                }
            }); 
        }
        me.close();
        
        me.searchTab.element.empty();
        me.searchTab.element.append($("<a>").text("-- Searching --"));
        
        var rel = this.path.substring(FileApi.root.length);
        if (rel[0]=='/') rel = rel.substring(1);
        me.searchTab.options.label = "Search: /" + rel;
        
        dayside.editor.mainPanel.addTab(me.searchTab,"file_search","bottom");
        
        dayside.storage.set("file-search-text",me.textInput.getValue());
        dayside.storage.set("file-search-mask",me.maskInput.getValue());

        me.searchRequest(me.currentParams = {
            id: me.currentSearch,
            path: me.path,
            mask: me.maskInput.getValue(),
            text: me.textInput.getValue(),
            from: false
        });
    },
    
    searchRequest: function (params) {
        var me = this;
        FileApi.request('fileSearch',params,true,function(data){
            if (me.currentSearch!=params.id) return;
            
            var res = data.data;
            
            me.searchTab.element.empty();
            $.each(res.files,function(){
                var rel = this.substring(me.path.length);
                if (rel[0]=='/') rel = rel.substring(1);
                me.searchTab.element.append($("<a href='#'>").attr("data-url",this).text(rel));
            });
            
            if (!res.finished) {
                me.searchRequest($.extend(params,{from:res.from}));
            } else {
                if (me.searchTab.element.children().length==0) {
                    me.searchTab.element.append($("<a>").text("-- Nothing found --"));
                }
            }
        });

    }
})
})(teacss.jQuery,teacss.ui);;
var FileApi = window.FileApi = window.FileApi || function () {
    var FileApi = {};
    
    FileApi.ajax_url = '/api';
    FileApi.root = "/";
    FileApi.auth_error = function () {
        alert('Authorization failed');
        throw 'Authorization failed';
        return {};
    }

    if (teacss.ui.eventTarget)
        FileApi.events = new teacss.ui.eventTarget;

    FileApi._async = true;
    
    FileApi.requestCounter = 0;
    FileApi.request = function (type,data,json,callback) {
        var $ = window.jQuery || teacss.jQuery;
        var requestID = ++FileApi.requestCounter;
        
        if (data.path) {
            if (data.path.substring(0,4)!="http") {
                var href = location.protocol + "//" +location.host;
                data.path = href + data.path;
            }
        }
        
        $.ajax({
            url: FileApi.ajax_url,
            data: $.extend(data,{type:type,_type:type}),
            async: this._async,
            type: "POST",
            success: function (answer) {
                FileApi.requestID = requestID;
                res = {data:answer};
                if (answer=="auth_error" || answer=="auth_empty") {
                    return res = FileApi.auth_error(answer,type,data,json,callback);
                }
                try {
                    if (json) {
                        var hash = eval('('+answer+')');
                        res = {data:hash};
                    }
                } catch (e) {
                    alert(answer);
                    res = {error:answer};
                }
                if (callback) callback(res);
            },
            error: function (xhr,answer,text) {
                alert(text);
                res = {error:text};
                if (callback) callback(res);
            }
        });
    }
        
    FileApi.cache = {};
        
    FileApi.dir = function (path,callback) {
        FileApi.request('dir',{path:path},true,callback);
    }
        
    FileApi.file = function (path,callback) {
        FileApi.request('file',{path:path},false,function(answer){
            if (!answer.error) FileApi.cache[path] = answer.data;
            if (callback) callback(answer);
        });
    }
        
    FileApi.save = function (path,text,callback) {
        FileApi.request('save',{path:path,text:text},false,function(answer){
            if (!answer.error && answer.data=="ok") FileApi.cache[path] = text;
            if (callback) callback(answer);
        });
    }
        
    FileApi.createFile = function (path,file,callback) {
        FileApi.request('createFile',{path:path,newFile:file},false,function(answer){
            if (!answer.error && answer.data=="ok") FileApi.cache[path] = "";
            if (callback) callback(answer);
        });
    }

    FileApi.createFolder = function (path,folder,callback) {
        FileApi.request('createFolder',{path:path,newFolder:folder},false,callback);
    }
        
    FileApi.rename = function (path,name,callback) {
        FileApi.request('rename',{path:path,name:name},false,function(answer){
            if (!answer.error && answer.data=="ok") {
                var new_path = path.split("/"); 
                new_path.pop();
                new_path.push(name);
                new_path = new_path.join("/");
                if (new_path!=path) {
                    FileApi.cache[new_path] = FileApi.cache[path];
                    delete FileApi.cache[path];
                    
                    if (FileApi.events) 
                        FileApi.events.trigger("rename",{path:path,new_path:new_path});
                }
            }
            if (callback) callback(answer);
        });
    }
        
    FileApi.remove = function (pathes,callback) {
        FileApi.request('remove',{pathes:pathes},false,function(answer){
            if (!answer.error && answer.data=="ok") {
                for (var i=0;i<pathes.length;i++) {
                    delete FileApi.cache[pathes[i]];
                    if (FileApi.events) 
                        FileApi.events.trigger("remove",{path:pathes[i]});
                }
            }
            if (callback) callback(answer);
        });
    }
        
    FileApi.moveOrCopy = function (pathes,dest,is_copy,callback) {
        var type = is_copy ? "copy" : "move";
        FileApi.request(type,{pathes:pathes,dest:dest},false,function(answer){
            if (!answer.error && answer.data=="ok") {
                var moving = [];
                var moving_dest = [];
                for (var path in FileApi.cache) {
                    for (var i=0;i<pathes.length;i++) {
                        if (path.indexOf(pathes[i])===0) {
                            moving.push({path:path,base:pathes[i],dest_base:dest[i]});
                            break;
                        }
                    }
                }
                for (var i=0;i<moving.length;i++) {
                    var path = moving[i].path;
                    var base = moving[i].base;
                    var new_base = moving[i].dest_base;
                    var new_path = new_base + path.substring(base.length);
                    
                    if (new_path!=path) {
                        FileApi.cache[new_path] = FileApi.cache[path];
                        if (!is_copy) delete FileApi.cache[path];
                        if (FileApi.events) 
                            FileApi.events.trigger(type,{path:path,new_path:new_path});
                    }
                }
            }
            if (callback) callback(answer);
        });
    }
        
    FileApi.move = function (pathes,dest,callback) {
        FileApi.moveOrCopy(pathes,dest,false,callback);
    }
        
    FileApi.copy = function (pathes,dest,callback) {
        FileApi.moveOrCopy(pathes,dest,true,callback);
    }
        
    FileApi.batch = function (path,callback) {
        FileApi.request('batch',{path:path},true,function(answer){
            if (!answer.error) {
                for (var path in answer.data) {
                    var info = answer.data[path];
                    if (!info.directory)
                        FileApi.cache[path] = info.content;
                }
            }
            if (callback) callback(answer);
        });
    }
        
    FileApi.unpack = function (path,callback) {
        FileApi.request('unpack',{path:path},false,function(answer){
            if (callback) callback(answer);
        });        
    }
    
    FileApi.getCSRFToken = function() {
        return (document.cookie.match('(^|; )editor_csrf=([^;]*)') || [])[2] || '';
    }
        
    for (var key in FileApi) {
        var f = FileApi[key];
        if (f && f.call && f.apply) {
            FileApi[key+"Sync"] = (function(f){
                return function () {
                    FileApi._async = false;
                    f.apply(FileApi,arguments);
                    FileApi._async = true;
                };
            })(f);
        }
    }
    
    return FileApi;
}();;
window.dayside = window.dayside || (function(){
    var dir = "/dayside";
    var res;

    var $ = teacss.jQuery;
    $("script").each(function(){
        var src = $(this).attr("src");
        if (!src) return;
        if (res = src.match(/^(.*?)client\/src\/app\.js$/)) dir = res[1];
        if (res = src.match(/^(.*?)client\/dayside\.js$/)) dir = res[1];
    });
    
    if (typeof(tea)!="undefined") {
        if (tea.path) {
            if (res = tea.path.match(/^(.*?)client\/src\/app\.js$/)) dir = res[1];
            if (res = tea.path.match(/^(.*?)client\/dayside\.js$/)) dir = res[1];
        }
    }
    
    var link = document.createElement("a");
    link.href = dir=="" ? "." : dir; 
    dir = link.href.replace(/\/$/,'');
    
    var dayside = function (options) {
        if (dayside.editor) return;

        var authWait = false;
        var defaults = {
            root: dir.substring(0,dir.lastIndexOf('/')),
            ajax_url: dir + "/server/demo.php",
            jupload_url: dir + "/server/assets/jupload/jupload.jar",
            auth_error: function (auth_type,type,data,json,callback) {
                if (authWait && !data.password) {
                    authWait.push({type:type,data:data,json:json,callback:callback});
                } else {
                    if (!data.password) authWait = [];
                    var password = prompt(auth_type=='auth_error' ? 'Enter password':'No password is set. Enter one');
                    return FileApi.request(type,$.extend(data||{},{password:password}),json,function(answer){
                        for (var i=0;i<authWait.length;i++) {
                            var it = authWait[i];
                            FileApi.request(it.type,it.data,it.json,it.callback);
                        }
                        authWait = false;
                        if (callback) callback(answer);
                    });
                }
            },
            preview: true
        }
        dayside.options = options = $.extend(defaults,options);
        
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            if (options.type.toLowerCase() === "post") {
                if (options.data instanceof FormData) {
                    options.data.append('_csrf', FileApi.getCSRFToken());
                } else {
                    options.data = options.data || "";
                    options.data += options.data ? "&" : "";
                    options.data += '_csrf' + "=" + FileApi.getCSRFToken();
                }
            }
        });
        
        teacss.jQuery(function ($){
            FileApi.root = options.root;
            FileApi.ajax_url = options.ajax_url;
            FileApi.auth_error = options.auth_error;
            
            dayside.loaded = false;
            var editor = new teacss.ui.editorPanel({
                jupload: options.jupload_url
            });
            dayside.loaded = true;
            onLoaded();
        });        
    }
    
    // for early events
    dayside.core = teacss.ui.Control();
    
    dayside.storage = {
        key: function (key) {
            return "dayside_"+location.href;
        },
        get: function (key,def) {
            if (typeof(localStorage)!='undefined') {
                var gkey = this.key();
                var item = localStorage.getItem(gkey);
                if (item) {
                    try {
                        item = eval('('+item+')');
                    } catch (e) {
                        return def;
                    }
                    return item[key];
                }
            }
            return def;
        },
        set: function (key,value) {
            if (typeof(localStorage)!='undefined') {
                var gkey = this.key();
                var item = localStorage.getItem(gkey);
                if (item) {
                    try {
                        item = eval('('+item+')'); 
                    } catch (e) {
                        item = {};
                    }
                } else {
                    item = {};
                }
                item[key] = value;
                localStorage.setItem(gkey,JSON.stringify(item));
            }
        }
    }    
        
    var load_list = [];
    function onLoaded() {
        for (var i=0;i<load_list.length;i++) load_list[i]();
        load_list = [];
    }
    dayside.ready = function (f) {
        if (dayside.loaded) f(); else load_list.push(f);
    }
    dayside.url = dir;
    dayside.plugins = {};
    return dayside;
})();