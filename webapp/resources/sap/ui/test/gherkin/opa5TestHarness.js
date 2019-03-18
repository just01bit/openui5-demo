/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if(!window.QUnit){jQuery.sap.require("sap.ui.thirdparty.qunit");}sap.ui.define(["jquery.sap.global","sap/ui/test/opaQunit","sap/ui/test/Opa5","sap/ui/test/gherkin/GherkinTestGenerator","sap/ui/test/gherkin/dataTableUtils","sap/ui/test/gherkin/StepDefinitions","sap/ui/test/launchers/componentLauncher","sap/ui/test/launchers/iFrameLauncher","sap/ui/qunit/qunit-css","sap/ui/qunit/qunit-junit","sap/ui/qunit/qunit-coverage"],function($,opaTest,Opa5,GherkinTestGenerator,dataTableUtils,StepDefinitions,componentLauncher,iFrameLauncher){"use strict";QUnit.config.urlConfig.splice(0,0,{id:"closeFrame",label:"Close Frame",tooltip:"Closes the application-under-test's frame after all tests have executed",value:"true"});QUnit.done(function(){if(jQuery.sap.getUriParameters().get("closeFrame")){sap.ui.test.Opa5.emptyQueue();}});var opa5TestHarness={_oOpa5:new Opa5(),_opaTest:opaTest,_fnAlternateTestStepGenerator:function(oStep){var sToEval=oStep.keyword+".";var sFinalFunction=oStep.text;var aMatch=oStep.text.match(/(.*?)\s*:\s*(.*)/);if(aMatch){sToEval+=dataTableUtils.normalization.camelCase(aMatch[1])+".";sFinalFunction=aMatch[2];}sToEval+=dataTableUtils.normalization.camelCase(sFinalFunction)+"();";return{isMatch:true,text:oStep.text,regex:/Generated Step/,parameters:[],func:function(Given,When,Then){$.sap.log.info("[GHERKIN] Generated Step: "+sToEval);eval(sToEval);},_sToEval:sToEval};},test:function(a){if($.type(a)!=="object"){throw new Error("opa5TestHarness.test: input all arguments via a single object");}if($.type(a.featurePath)!=="string"){throw new Error("opa5TestHarness.test: parameter 'featurePath' must be a valid string");}if(a.steps&&(($.type(a.steps)!=="function")||!((new a.steps())._generateTestStep))){throw new Error("opa5TestHarness.test: if specified, parameter 'steps' must be a valid StepDefinitions constructor");}if(!a.steps&&(a.generateMissingSteps!==true)){throw new Error("opa5TestHarness.test: if parameter 'generateMissingSteps' is not true then parameter 'steps' must be a valid StepDefinitions constructor");}if(a.generateMissingSteps&&($.type(a.generateMissingSteps)!=="boolean")){throw new Error("opa5TestHarness.test: if specified, parameter 'generateMissingSteps' must be a valid boolean");}if(!a.steps){a.steps=StepDefinitions;}var t=(a.generateMissingSteps)?this._fnAlternateTestStepGenerator:null;var T=new GherkinTestGenerator(a.featurePath,a.steps,t);var f=T.generate();QUnit.module(f.name,{beforeEach:function(){T.setUp();},afterEach:function(){if(this._oOpa5.hasAppStarted()){this._oOpa5.iTeardownMyApp();}T.tearDown();}.bind(this)});$.sap.log.info("[GHERKIN] Running feature: '"+f.name+"'");f.testScenarios.forEach(function(o){var b=(!f.skip&&!o.skip)?this._opaTest:QUnit.skip;b(o.name,function(G,W,c){$.sap.log.info("[GHERKIN] Running scenario: '"+o.name+"'");o.testSteps.forEach(function(d){this._oOpa5.waitFor({viewName:"",success:function(){$.sap.log.info("[GHERKIN] Running step: text='"+d.text+"' regex='"+d.regex+"'");Opa5.assert.ok(d.isMatch,d.text);if(d.isMatch){QUnit.config.current.assertions.pop();}d.parameters=(d.parameters||[]).concat([G,W,c]);T.execute(d,Opa5.assert);}});}.bind(this));}.bind(this));}.bind(this));}};return opa5TestHarness;},true);
