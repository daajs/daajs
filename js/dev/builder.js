daa.RegisterClasses(

// *****************************************************************************
// @class Builder daa.builder
// @desc
//    Provides methods to build daa applications

function Builder() {
   this.path    = "daa";
   this.name    = "builder";
   this.require = "daa.js";

   var BEnv = {};
   var QS = "#QS";

    // Minimize CSS
   function MinimizeCSS(AValue) {
      var xObj = {
         qs: []
      };
      AValue = AValue.replace(/\r/g, "").replace(/\\\n/g, "");
      AValue = daa.ReplaceQuotes(AValue, function(a) { xObj.qs.push(a); return QS + (xObj.qs.length - 1) + "#"; },
                                         function(a) { if (/\n$/.test(a)) { return "\n"; } else { return ""; }} );
      AValue = AValue.replace(/\n[ \t\v]*|[ \t\v]*\n/g, "\n")
                     .replace(/[ \t\v]*({|}|:|;|,)[ \t\v]*/g, "$1");
      AValue = AValue.replace(/\n/g, "");
      for (var xi = 0; xi < xObj.qs.length; xi++) {
         AValue = AValue.replace(new RegExp(QS + xi + "#"), xObj.qs[xi]);
      }
      return AValue;
   }

    // Parse Modules

   function ParseModules(AObj, AConf) {
      var xModules = {};
      var xName = "", xRef = null, xText = "";
      var xIsParse = 1;
       // Read and parse modules
      for (var xkey in AObj) {
         xName = xkey.replace(/\.[A-Za-z0-9_]+$/, "");
         xIsParse = 1;
         if (xName == "daa" && !AConf.isjoined) { xText = ""; xRef = {}; xIsParse = 0; }
         if (xIsParse) {
            xText = daa.fs.ReadFile(daa.p.Concat(AObj[xkey].modulepath, xkey)); if (!xText) { continue; }
            xRef = daa.js.Parse(xText); if (daa.IsError(xRef)) { return xRef + ";\nModuleName: " + xkey; }
         }
         xModules[xName]      = AObj[xkey];
         xModules[xName].ref  = xRef;
         xModules[xName].text = xText;
      }
      return xModules;
   }

    // Order Modules

   function VerClsItem(AItem, AList, AStr) {
      var xAncs = {};
      var xCode = "";
      for (var xkey in AItem.ancestors) {
         if (daa.csv.HAS(AStr, xkey)) { return "daa:error:TooMuchRecursion:" + xkey + " for " + AItem.name; }
         if (!AList[xkey]) { return "daa:error:NoAncestor:" + xkey + " for " + AItem.name; }
         if (!AList[xkey].isver) {
            xCode = VerClsItem(AList[xkey], AList, daa.csv.OR(AStr, xkey)); if (daa.IsError(xCode)) { return xCode; }
         }
         daa.o.Merge(xAncs, AList[xkey].ancestors);
      }
      daa.o.Merge(AItem.ancestors, xAncs);
      AItem.isver = 1;
      for (var xkey in AItem.ancestors) {
         if (AList[xkey].modulename == AItem.modulename) { continue; }
         AItem.isver = Math.max(AItem.isver, AList[xkey].isver + 1);
      }
      return xCode;
   }

   function VerClsList(AList) {
      var xCode = "";
      for (var xkey in AList) {
         if (AList[xkey].isver) { continue; }
         xCode = VerClsItem(AList[xkey], AList, xkey); if (daa.IsError(xCode)) { return xCode; }
      }
   }

   function VerReqItem(AList, AKey, AStr) {
      if (!AList[AKey]) { return; }
      var xArr = daa.csv.SplitAsKeys(AList[AKey]);
      for (var xkey in xArr) {
         if (daa.csv.HAS(AStr, xkey) || !AList[xkey]) { continue; }
         VerReqItem(AList, xkey, daa.csv.OR(AStr, xkey));
         AList[AKey] = daa.csv.OR(AList[AKey], AList[xkey]);
      }
   };

   function VerReqList(AList) {
      for (var xkey in AList) { VerReqItem(AList, xkey, xkey); }
   };

   function OrderModules(AObj, AConf) {
      var xList = {};                   // Sorted list of classes as {classname: {vindex: Number, name: modulename}}
      var xReqs = {};                   // List of required classes as {classname: 1}
      var xReqList = {};                // List of inheritance as {classname: 'anc,req,..'}
      var xVCls = BEnv.vclasses || null; // Views list extracted from pages
      var xCls = null;
      var xIdx = 0, yIdx = 0, zIdx = 0;
       // Include daa-dev modules, if found by 'exclude' conf statement
      for (var xkey in AObj) {
         if (xkey == "daa") { continue; }
         if ((!AObj[xkey].ref || !AObj[xkey].ref.classes) && /\/\/ @daa-dev/.test(AObj[xkey].text)) {
            xList[xkey] = {index: xIdx, name: xkey}; xIdx++;
         }
      }
      if (AObj.daa) { xList.daa = {index: xIdx, name: "daa"}; xIdx++; }

       // Build the hierarchy
      var xClsList = {};
      for (var xkey in AObj) {
         if (xkey == "daa") { continue; }
         if (!AObj[xkey].ref || !AObj[xkey].ref.classes) { continue; }
         AObj[xkey].classescnt = 0;
         for (var ykey in AObj[xkey].ref.classes) {
            xCls = AObj[xkey].ref.classes[ykey];
            if (xCls.iscoreclass) { AObj[xkey].classescnt++; }
            for (var zkey in xCls.requires)  { xReqs[zkey] = 1; }
            xReqList[ykey] = daa.csv.OR(daa.csv.JoinKeys(xCls.ancestors), daa.csv.JoinKeys(xCls.requires));

            xClsList[ykey] = {name: ykey, modulename: xkey, isver: 0, ancestors: daa.o.Copy(xCls.ancestors)};
         }
      }
      var xCode = VerClsList(xClsList); if (daa.IsError(xCode)) { return xCode; }

       // Build the list of all, including daa-dev and daa. Update xReqList
      for (var xkey in xClsList) {
         xList[xkey] = {index: xIdx + xClsList[xkey].isver, name: xClsList[xkey].modulename};
         xReqList[xkey] = daa.csv.OR(xReqList[xkey], daa.csv.JoinKeys(xClsList[xkey].ancestors));
      }
      for (var xkey in xReqs) { if (!xList[xkey]) { return "daa:error:builder:NoClass:" + xkey; } }
      VerReqList(xReqList);

       // Set vindexes to Modules
      var xName = "";
      var xArr = null;
      for (var xkey in xList) {
         xName = xList[xkey].name;
         ("vindex" in AObj[xName]) ? AObj[xName].vindex = Math.max(AObj[xName].vindex, xList[xkey].index) : AObj[xName].vindex = xList[xkey].index;
      }
       // Remain only required classes, if xVCls - list of classes actually used is not null.
      //log(xReqList);
      if (xVCls) {
         var xAllCls = daa.csv.JoinKeys(xVCls);
         for (var xkey in xReqList) {
            if (xkey in xVCls) { xAllCls = daa.csv.OR(xAllCls, xReqList[xkey]); }
         }
         xAllCls = daa.csv.SplitAsKeys(xAllCls);
         //log(xAllCls);
         for (var xkey in xAllCls) {
            if (xkey == "daa") { continue; }
            if (!xList[xkey]) { return "daa:error:builder:NoClass:" + xkey; }
            xName = xList[xkey].name;
            if (!AObj[xName]) { return "daa:error:builder:ModulesListError:Module=" + xName + ";\nClass=" + xkey; }
            if (!AObj[xName].ref || !AObj[xName].ref.classes) { continue; }
            if (!AObj[xName].ref.classes[xkey]) { return "daa:error:builder:ModulesListError:Module=" + xName + ";\nClass=" + xkey; }
            AObj[xName].classescnt++;
            AObj[xName].ref.classes[xkey].isrequired = 1;
         }
         for (var xkey in AObj) {
            if (!AObj[xkey].classescnt) { continue; }
            var xBody = AObj[xkey].ref.body;
            for (var ykey in AObj[xkey].ref.classes) {
               xCls = AObj[xkey].ref.classes[ykey];
               if (!xCls.isrequired && !xCls.iscoreclass) {
                  xBody = xBody.replace(new RegExp(",[\\s]*?" + xCls.fnid), "");
               }
            }
            if (AObj[xkey].ref.body != xBody) { AObj[xkey].ref.body = xBody; }
         }
      }
      return AObj;
   }

   function TunePath(APath, APartName, AConf) {
      var xConf = AConf[APartName];
      var xSrcPath = APath  || "";
      var xRlsPath = xConf.releasepath || ""; if (!xConf.isjoined) { xRlsPath = xSrcPath; }
      var xTmpPath = ""; if (AConf.templates) { xTmpPath = AConf.templates.releasepath || ""; }
      var xRls = daa.p.Split(xRlsPath);
      var xTmp = daa.p.Split(xTmpPath);
      var xIsInside = 0;
      for (var xi = 0; xi < xTmp.length; xi++) {
         if (xRls[xi] == xTmp[xi]) { xRls[xi] = ""; xTmp[xi] = ""; xIsInside = 1; }
         else { xIsInside = 0; break; }
      }
      xTmp = daa.p.Split(daa.p.Join(xTmp));
      xRlsPath = daa.p.Join(xRls);
      if (!xIsInside) {
          // If Modules path points to the working directory or upper and not reside in the Template dirs - add required number of 'ups'
         xRlsPath = daa.p.Concat(daa.StrRepeat("../", xTmp.length), xRlsPath);
      }
      return xRlsPath;
   }

   // ***
   // @method daa.builder.ListPageClasses
   this.ListPagesClasses = function(AConf) {
      if (!AConf.pages)   { return "daa:error:builder:NoPages"; }
      var xConf = AConf.pages;
      var xClasses = {};
      var xSrcPath = xConf.sourcepath  || "";
      var xModules = daa.fs.ListFiles(xSrcPath, xConf.include || "", xConf.exclude || ""); if (daa.IsError(xModules)) { return xModules; }
      var xText = "", xObj = null, xPage = null;
      for (var xkey in xModules) {
         xText = daa.fs.ReadFile(daa.p.Concat(xModules[xkey], xkey)); if (daa.IsError(xText)) { return xText; }
         xObj = daa.Unserialize(xText);
         for (var xkey in xObj) {
            if (!daa.IsVTree(xObj[xkey])) { continue; }
            xPage = xObj[xkey];
            for (var ykey in xPage) {
               if (!daa.IsVItem(xPage[ykey]) || !xPage[ykey].vcid) { continue; }
               xClasses[xPage[ykey].vcid] = 1;
            }
         }
      }
      if (AConf.modules && AConf.modules.requires) {
         var xReqs = daa.csv.SplitAsKeys(AConf.modules.requires);
         daa.o.Merge(xClasses, xReqs);
      }
      return xClasses;
   };


   // ***
   // @method daa.builder.BuildModule

   this.BuildModule = function(AName, AConf) {
      if (!AConf.modules)   { return "daa:error:builder:NoModules"; }
      var xCrLf = daa.Conf.crlf;
      var xConf = AConf.modules;
      var xRlsPath = xConf.releasepath || "";
      var xSrcPath = xConf.sourcepath  || "";
      xSrcArr = daa.csv.SplitAsKeys(xSrcPath);
      var xFound = 0;
      for (var xkey in xSrcArr) { if (daa.fs.Exists(daa.p.Concat(xkey, AName))) { AName = daa.p.Concat(xkey, AName); xFound = 1; break; } }
      if (!xFound) { return "daa:error:builder:NoModule:" + AName; }
      var xText = daa.fs.ReadFile(AName); if (!xText) { return "daa:error:builder:NoModule:" + AName; }
      if (xConf.isminimized) {
         var xIsFullMin = 1; if (xConf.islines) { xIsFullMin = 0; }
         var xRef = daa.js.Parse(xText); if (daa.IsError(xRef)) { return xRef; }
         xText = daa.js.Minimize(xRef, xIsFullMin);
         if (!xIsFullMin) { xText = xText.replace(/\r*\n/g, xCrLf); }
         if (xConf.releasetext) { xText = xConf.releasetext.replace(/\r*\n/g, xCrLf) + xText; }
      }
      var xName = daa.p.GetName(AName);
      if (xConf.releasesuffix) {
         xName = xName.replace(/(\.[A-Za-z0-9_]+)$/, "." + xConf.releasesuffix + "$1");
      }
      daa.fs.WriteFile(daa.p.Concat(xRlsPath, xName), xText);
   };

   // ***
   // @method daa.builder.BuildModules

   this.BuildModules = function(AConf) {
       // Initialization
      if (!AConf.modules)   { return "daa:error:builder:NoModules"; }
      var xConf = AConf.modules;
      if (xConf.isjoined && !xConf.releasename) { return "daa:error:builder:NoReleaseName:modules"; }
      var xCrLf = daa.Conf.crlf;
      var xSrcPath = xConf.sourcepath  || "";
      xSrcArr = daa.csv.SplitAsKeys(xSrcPath);
      if (/^[\s]*?,|,[\s]*?$|,[\s]*?,/.test(xSrcPath) || daa.Trim(xSrcPath) == "") { xSrcArr[""] = ""; }
       // Read modules
      var xModules = {}, yModules;
      for (var xkey in xSrcArr) {
         xSrcArr[xkey] = TunePath(xkey, "modules", AConf);
         yModules = daa.fs.ListFiles(xkey, xConf.include || "", xConf.exclude || ""); if (daa.IsError(yModules)) { return yModules; }
         for (var ykey in yModules) {
            if (xModules[ykey]) { return "daa:error:builder:NameAlreadyExists:" + daa.p.Concat(yModules[ykey], ykey) + " as " + daa.p.Concat(xModules[ykey].modulepath, ykey); }
            xModules[ykey] = {sourcepath: xkey, releasepath: xSrcArr[xkey], modulepath: yModules[ykey], modulename: ykey};
         }
      }

      //log(daa.Serialize(xModules, {style: "optimized"}));

       // Parse and order modules
      xModules = ParseModules(xModules, xConf); if (daa.IsError(xModules)) { return xModules; }
      xModules = OrderModules(xModules, xConf); if (daa.IsError(xModules)) { return xModules; }

       // Join, minimize modules or simply combine a <script> string, depending on Conf
      var xModStr = "";
      var xText = "";
      if (xConf.isjoined) {
         var xRlsPath = TunePath("", "modules", AConf);
         xModStr = '<script src="' + daa.p.Concat(xRlsPath, xConf.releasename) + '"></script>\n';
         if (xConf.releasetext) { xText += xConf.releasetext.replace(/\r*\n/g, xCrLf); }
      }
      var xArr = daa.o.Sort(xModules, "vindex");
      var xIsFullMin = 1; if (xConf.islines) { xIsFullMin = 0; }
      var xMod = null;
      for (var xi = 0; xi < xArr.length; xi++) {
         xMod = xModules[xArr[xi]];
         if (xConf.isjoined) {
            if (xArr[xi] != "daa" && !xMod.classescnt) { continue; }
            //log(xMod.modulename);
            xConf.isminimized ? xText += daa.js.Minimize(xMod.ref, xIsFullMin) : xText += xMod.text;
            xText += xCrLf;
         } else {
            xModStr += '<script src="' +
               daa.p.Concat(
                  xMod.releasepath,
                  xMod.modulepath.replace(new RegExp("^" + xMod.sourcepath + "\\/*"), ""),
                  xMod.modulename) +
               '"></script>\n';
         }
      }
      if (xConf.isjoined) { daa.fs.WriteFile(daa.p.Concat(xConf.releasepath, xConf.releasename), xText); }
      //log(xModStr);
      return xModStr;
   };

   this.BuildCSS = function(AConf) {
       // Initialization
      if (!AConf.css)   { return "daa:error:builder:NoModules"; }
      var xConf = AConf.css;
      if (xConf.isjoined && !xConf.releasename) { return "daa:error:builder:NoReleaseName:css"; }
      var xCrLf = daa.Conf.crlf;
      var xSrcPath = xConf.sourcepath  || "";
      xSrcArr = daa.csv.SplitAsKeys(xSrcPath);
      if (/^[\s]*?,|,[\s]*?$|,[\s]*?,/.test(xSrcPath) || daa.Trim(xSrcPath) == "") { xSrcArr[""] = ""; }
       // Read modules
      var xModules = {}, yModules;
      for (var xkey in xSrcArr) {
         xSrcArr[xkey] = TunePath(xkey, "css", AConf);
         yModules = daa.fs.ListFiles(xkey, xConf.include || "", xConf.exclude || ""); if (daa.IsError(yModules)) { return yModules; }
         for (var ykey in yModules) {
            if (xModules[ykey]) { return "daa:error:builder:NameAlreadyExists:" + daa.p.Concat(yModules[ykey], ykey) + " as " + daa.p.Concat(xModules[ykey].modulepath, ykey); }
            xModules[ykey] = {sourcepath: xkey, releasepath: xSrcArr[xkey], modulepath: yModules[ykey], modulename: ykey};
         }
      }
       // Join, minimize modules or simply combine a <style> string, depending on Conf
      var xModStr = "";
      var xText = "";
      if (xConf.isjoined) {
         var xRlsPath = TunePath("", "css", AConf);
         xModStr = '<link href="' + daa.p.Concat(xRlsPath, xConf.releasename) + '" rel="stylesheet">\n';
         if (xConf.releasetext) { xText += xConf.releasetext.replace(/\r*\n/g, xCrLf); }
      }
      var xMod = null;
      for (var xkey in xModules) {
         xMod = xModules[xkey];
         xMod.text = daa.fs.ReadFile(daa.p.Concat(xMod.modulepath, xMod.modulename)); if (daa.IsError(xMod.text)) { return xMod.text; }
         if (xConf.isjoined) {
            xConf.isminimized ? xText += MinimizeCSS(xMod.text) : xText += xMod.text;
            xText += xCrLf;
         } else {
            xModStr += '<link href="' +
               daa.p.Concat(
                  xMod.releasepath,
                  xMod.modulepath.replace(new RegExp("^" + xMod.sourcepath + "\\/*"), ""),
                  xMod.modulename) +
               '" rel="stylesheet">\n';
         }
      }
      if (xConf.isjoined) { daa.fs.WriteFile(daa.p.Concat(xConf.releasepath, xConf.releasename), xText); }
      return xModStr;
   };

   this.BuildTemplates = function(AConf, AName, AModStr, ACssStr) {
       // Initialization
      if (!AConf.templates) { return "daa:error:builder:NoTemplates"; }
      var xCrLf = daa.Conf.crlf;
      var xConf = AConf.templates;
      var xPageConf = AConf.pages || {};
       // Paths
      var xSrcPath = xConf.sourcepath  || "";  // From where to get templates
      var xRlsPath = xConf.releasepath || "";  // Where to place builded files
      var xSubPath = "";                       // Relative path for templates residing deeper than xSrcPath itself
      AModStr = AModStr || ""; AModStr = AModStr.replace(/\n$/, "");
      ACssStr = ACssStr || ""; ACssStr = ACssStr.replace(/\n$/, "");
      var xModStr, xCssStr;                   // Strs should be changed corresponding to xSubPath, so we need a temp var for it
       // List templates to build
      var xTemps;
      if (AName != "*") {
         var xName = daa.p.GetName(AName);
         xTemps = {}; xTemps[xName] = daa.p.Concat(xSrcPath, daa.p.GetPath(AName));
      } else {
         xTemps = daa.fs.ListFiles(xSrcPath, xConf.include || "", xConf.exclude || ""); if (daa.IsError(xTemps)) { return xTemps; }
      }
       // Process templates
      var xSpaces = "";
      var xPath = "", xName = "";
      for (var xkey in xTemps) {
         xModStr = AModStr; xCssStr = ACssStr;
         xPath = daa.p.Concat(xTemps[xkey], xkey);
         xName = xkey.replace(/\.[A-Za-z0-9_]+$/, "");
         if (!daa.fs.Exists(xPath)) {
            xPath = daa.p.Concat(xSrcPath, "_." + xkey.substr(xkey.lastIndexOf(".") + 1));
            if (!daa.fs.Exists(xPath)) { return "daa:error:builder:NoTemplate:" + xPath; }
         }
          // Read template file
         xText = daa.fs.ReadFile(xPath); if (!xText) { continue; }
          // Find spaces before <daa_modules> to make the result appropriately formatted.
         xText.replace(/<daa_modules>[\s\S]*$/, "").replace(/\n[ \t]*$/, function(a) { xSpaces = a.replace(/\n/, ""); return a; });
          // Get sub-path
         xSubPath = xTemps[xkey].replace(new RegExp("^" + xSrcPath + "\\/*"), "");
          // Append mod str with 'ups' if sub path is not empty
         if (xSubPath) {
            xModStr = xModStr.replace(/=\"/g, "=\"" + daa.StrRepeat("../", daa.p.Split(xSubPath).length));
            xCssStr = xCssStr.replace(/=\"/g, "=\"" + daa.StrRepeat("../", daa.p.Split(xSubPath).length));
         }
          // Finally, replace <daa_modules> with mod str...
         xText = xText.replace(/<daa_modules>\r*\n/, xModStr.replace(/\n/g, xCrLf + xSpaces) + xCrLf)
                      .replace(/<daa_css>\r*\n/, xCssStr.replace(/\n/g, xCrLf + xSpaces) + xCrLf)
                      .replace(/%pagename%/g, xName);
          // ...And write the result
         daa.fs.WriteFile(daa.p.Concat(xRlsPath, xSubPath, xkey), xText);
          // ***
          // Ensure page.json
         if (xPageConf.releasepath && xPageConf.releasepath != xPageConf.sourcepath) {
            xPath = daa.p.Concat(xPageConf.sourcepath, xName + ".json");
            if (!daa.fs.Exists(xPath)) { return "daa:error:builder:NoPage:" + xPath; }
            xText = daa.fs.ReadFile(xPath); if (daa.IsError(xText)) { return "daa:error:builder:NoPage:" + xPath; }
            daa.fs.WriteFile(daa.p.Concat(xPageConf.releasepath, xName + ".json"), xText);
         }
      }
   };

   // ***
   // @method daa.builder.Build
   // @desc Builds templates found in AConf.templates directory or specified
   //    by AName parameter.

   this.Build = function(AName, AConf) {
      BEnv.vclasses = this.ListPagesClasses(AConf); if (daa.IsError(BEnv.vclasses)) { return BEnv.vclasses; }
      var xModStr  = this.BuildModules(AConf);     if (daa.IsError(xModStr)) { return xModStr; }
      if (!AName) { return ""; }
      var xCssStr  = this.BuildCSS(AConf);         if (daa.IsError(xCssStr)) { return xCssStr; }
      var xCode    = this.BuildTemplates(AConf, AName, xModStr, xCssStr); if (daa.IsError(xCode)) { return xCode; }
      return "";
   };
}

);

