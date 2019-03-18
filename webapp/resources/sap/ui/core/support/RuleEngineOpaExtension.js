/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global",'sap/ui/base/Object',"sap/base/util/UriParameters","sap/ui/thirdparty/jquery","sap/ui/support/RuleAnalyzer","sap/ui/support/library"],function(q,B,U,Q,R,l){"use strict";var E=B.extend("sap.ui.core.support.RuleEngineOpaExtension",{metadata:{publicMethods:["getAssertions"]},onAfterInit:function(){var L=sap.ui.getCore().getLoadedLibraries()["sap.ui.support"],d=Q.Deferred();if(!L){sap.ui.require(["sap/ui/support/Bootstrap"],function(b){b.initSupportRules(["true","silent"],{onReady:function(){d.resolve();}});});}else{d.resolve();}return d.promise();},getAssertions:function(){var s=function(){return new U(window.location.href).get('sap-skip-rules-issues')=='true';};var g=function(){var o=window.parent;o._$files=o._$files||[];return o;};var r={noRuleFailures:function(o){var a=Q.Deferred(),o=o[0]||{},f=o["failOnAnyIssues"],b=o["failOnHighIssues"],c=o.rules,p=o.preset,m=o.metadata,e=o.executionScope;R.analyze(e,c||p,m).then(function(){var d=R.getAnalysisHistory(),h={issues:[]};if(d.length){h=d[d.length-1];}var i=h.issues.reduce(function(k,n){k[n.severity.toLowerCase()]+=1;return k;},{high:0,medium:0,low:0});var j=h.issues.length===0;if(b){j=i.high===0;}else if(f===false||b===false){j=true;}if(s()){j=true;}a.resolve({result:j,message:"Support Assistant issues found: [High: "+i.high+", Medium: "+i.medium+", Low: "+i.low+"]",expected:"0 high 0 medium 0 low",actual:i.high+" high "+i.medium+" medium "+i.low+" low"});});return a.promise();},getFinalReport:function(){var a=Q.Deferred(),h=R.getFormattedAnalysisHistory(),b=R.getAnalysisHistory(),t=b.reduce(function(e,f){return e+f.issues.length;},0),c=t===0,m="Support Assistant Analysis History",d=m;if(c){m+=" - no issues found";}else if(s()){c=true;m+=' - issues are found. To see them remove the "sap-skip-rules-issues=true" URI parameter';}a.resolve({result:c,message:m,actual:d,expected:h});return a.promise();},getReportAsFileInFormat:function(o){var c,h,o=o[0]||{},a=Q.Deferred(),H=o["historyFormat"],f=o["fileName"];switch(H){case l.HistoryFormats.Abap:if(!f){f="abap-report.json";}h=R.getFormattedAnalysisHistory(H);break;case l.HistoryFormats.String:if(!f){f="string-report.json";}h=R.getFormattedAnalysisHistory(H);break;default:if(!f){f="report.json";}h=R.getAnalysisHistory();}c=g();c._$files.push({name:f,content:JSON.stringify(h)});a.resolve({result:true,message:"Support Assistant Analysis History was stored in window._$files with following name "+f,actual:true,expected:true});return a.promise();}};return r;}});return E;});
