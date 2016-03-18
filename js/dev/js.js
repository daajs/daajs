daa.RegisterClasses(

// *****************************************************************************
// @class JS daa.js
// @desc
//    Provides methods to parse and minimize JS code

function JS() {
   this.path = "daa";
   this.name = "js";

   var QS = "#QS";
   var FN = "#FN";
   var TK = "#TK";
   var VR = "#VR";

   // **************************************************************************
   // DAA-classes parse

    // Temporary implementation till full parse will be complete.
   function _GetStrItem(AName, AText, ARef) {
      var xArr  = AText.match(new RegExp("this\\." + AName + "[\\s]*=[\\s]*" + QS + "[0-9]+?#[\\s]*;")); if (!xArr || !xArr[0]) { return ""; }
      var xName = xArr[0].replace(new RegExp("this\\." + AName + "[\\s]*=[\\s]*"), "").replace(/[\\s]*;/, "");
      return _GetObject(xName, "qs", ARef).replace(/^\"|^'|'$|\"$/g, "");
   }


   function ParseClasses(ARef) {
      var xClasses = {};
      var xValue = ARef.body, xBlock = null, xFns = null, xFn = null;
      var xName = "", xIsCore = 0;
      var xRE = /daa\.RegisterClasses/;
      var xArr = xValue.match(xRE);
      while (xArr) {
         xValue = xValue.replace(/^[\s\S]*?daa\.RegisterClasses/, "");
         xBlock = daa.ParseQuotes(xValue, "(", ")");
         xValue = xBlock.post;
         xFns = daa.qs.Split(xBlock.value.replace(/^\(|\)$/g, ""), ",", null, daa.RET_TRIMMED);
         for (var xkey in xFns) {
            if (!new RegExp(FN + "[0-9]+?#").test(xFns[xkey])) { continue; }
            xFn   = _GetObject(xFns[xkey], "fn", ARef);  if (!xFn) { continue; }
            xName = _GetStrItem("name", xFn.body, ARef); if (!xName) { continue; }
            xIsCore = Number(/this\.iscoreclass[\s]*?=[\s]*?1/.test(xFn.body));
            xClasses[xName] = {
               ancestors: daa.csv.SplitAsKeys(_GetStrItem("ancestors", xFn.body, ARef).replace(/\bdaa\./g, "")),
               requires:  daa.csv.SplitAsKeys(_GetStrItem("requires", xFn.body, ARef).replace(/\bdaa\./g, "")),
               iscoreclass: xIsCore,
               fnid: xFns[xkey]
            };
         }
         xArr = xValue.match(xRE);
      }
      return xClasses;
   }


   // **************************************************************************
   // Parser

   function ListArgs(AValue) {
      var xArgs = [];
      var xName = "", xValue = "";
      var xArr = daa.qs.Split(AValue, ",", null, daa.RET_TRIMMED);
      for (var xi = 0; xi < xArr.length; xi++) {
         xName = daa.Trim(xArr[xi]); xValue = undefined;
         if      (/^{/.test(xName)) { xValue = xName; xName = ""; }
         else if (/=/.test(xName)) { xValue = xName.replace(/^[\s\S]*?=[\s]*/, ""); xName = xName.replace(/[\s]*=[\s\S]*$/, ""); }
         xArgs.push({name: xName, value: xValue});
      }
      return xArgs;
   }

   function ListEvls(AValue) {
      if (!/\beval[\s]*?\(/.test(AValue)) { return []; }
      var xValue = AValue, xBlock = null;
      var xEvls = [], xStrs = "";
      var xArr = AValue.match(/\beval[\s]*?\(/g); if (!xArr) { return []; }
      for (var xi = 0; xi < xArr.length; xi++) {
         xValue = xValue.replace(/^[\s\S]*?\beval[\s]*?\(/, "(");
         xBlock = daa.ParseQuotes(xValue, "(", ")");
         xValue = xBlock.post;
         xStrs = xBlock.value.match(new RegExp(QS + "[0-9]+?#", "g")); if (!xStrs) { continue; }
         for (var yi = 0; yi < xStrs.length; yi++) { xEvls.push(xStrs[yi]); }
      }
      return xEvls;
   }

   function ListVars(AValue) {
      if (!/\bvar\b/.test(AValue)) { return {}; }
       // Match all up to ';', ' in ' or the line end.
      var xArr = AValue.match(/\bvar\b[\s\S]*?(;| in |$)/g); if (!xArr) { return {}; }
      var xVars = {}, yVars = "", yVar = "";
      for (var xi = 0; xi < xArr.length; xi++) {
          // Remain only inner content.
         yVars = xArr[xi].replace(/^var[\s]+?/, "").replace(/;[\s]*$/, "").replace(/ in $/, "");
         yVars = MinimizeSpaces(yVars, 1);
          // Split by ","
         yVars = daa.qs.Split(yVars, ",", null);
         for (var yi = 0; yi < yVars.length; yi++) {
            yVar = daa.Trim(yVars[yi].replace(/=[\s\S]*$/, ""));
            if (/[^A-Za-z0-9_\$]/.test(yVar)) { return "daa:error:js:SyntaxError:" + yVars; }
            xVars[yVar] = 1;
         }
      }
      return xVars;
   }

   function ReplaceFunction(AValue, AIndex, ARef) {
      var xValue = AValue.substr(AIndex);
       // Create function reference object
      var xObj = {
         name: xValue.replace(/^function[\s]*/, "").replace(/[\s]*\([\s\S]*$/, ""),
         args: "",
         body: xValue
      };
      var xBlock;
       // Get function args
      xBlock = daa.ParseQuotes(xValue, "(", ")");
      xObj.body = xBlock.post;
      xObj.args = ListArgs(xBlock.value.replace(/^\([\s]*|[\s]*\)$/g, ""));
       // Get function body
      xBlock = daa.ParseQuotes(xObj.body, "{", "}");
      xObj.body = xBlock.value.replace(/^{[\s]*|[\s]*}$/g, "");
      var xPost = xBlock.post;
       // Determine if the function is a method or param.
      var xPre = AValue.substr(0, AIndex);
      if (xObj.name && /\.[A-Za-z0-9_\$]+?[\s]*?=[\s]*?$/.test(xPre)) { xObj.ismethod = 1; }
      if (xObj.name && /(\(|,)[\s]*?$/.test(xPre)) { xObj.isparam = 1; }
       // Save function reference to RefObj and replace it in the Value
      ARef.fn.push(xObj);
      AValue = xPre + FN + (ARef.fn.length - 1) + "#" + xPost;
       // Parse inner functions
      xObj.body = ReplaceFunctions(xObj.body, ARef); if (daa.IsError(xObj.body)) { return xObj.body; }
       // Create functions, vars and evals symbols indexes
      xObj.funs  = xObj.body.match(new RegExp(FN + "[0-9]+?#", "g"));
      xObj.vars = ListVars(xObj.body); if (daa.IsError(xObj.vars)) { return xObj.vars; }
      xObj.evls = ListEvls(xObj.body);
      return AValue;
   }

   function ReplaceFunctions(AValue, ARef) {
      var xRE = /\bfunction[\s]*[A-Za-z0-9_\$]*?[\s]*\(/;
      var xArr = AValue.match(xRE);
      while (xArr) {
         AValue = ReplaceFunction(AValue, xArr.index, ARef); if (daa.IsError(AValue)) { return AValue; }
         xArr = AValue.match(xRE);
      }
      return AValue;
   }

   // **************************************************************************
   // Minimizer

   function AddScopeItem(AName, AScope) {
      AScope.tk[AName] = AScope.pre + daa.Chr(AScope.id);
      AScope.id++; if (AScope.id == 91) { AScope.id = 97; AScope.pre += "_"; } else if (AScope.id == 123) { AScope.id = 65; }
   }

   function CreateScope(AFnRef, ARef, AScope) {
      var xScope = daa.o.MergePlain({}, AScope);
      if (AFnRef.args) {
         var xAr = "";
         for (var xi = 0; xi < AFnRef.args.length; xi++) {
            xAr = AFnRef.args[xi];
            if (!xAr.name) { continue; }
            AddScopeItem(xAr.name, xScope);
         }
      }
      if (AFnRef.vars) { for (var xkey in AFnRef.vars) { AddScopeItem(xkey, xScope); } }
      if (AFnRef.funs) {
         var xFn = "";
         for (var xi = 0; xi < AFnRef.funs.length; xi++) {
            xFn = _GetObject(AFnRef.funs[xi], "fn", ARef); if (!xFn) { return "daa:error:js:InvalidRef:" + AFnRef.funs[xi]; }
            if (!xFn.name || xFn.ismethod || xFn.isparam) { continue; }
            AddScopeItem(xFn.name, xScope);
         }
      }
      return xScope;
   }

   function CreateArgs(AValue) {
      var xArgs = "";
      var xAr = null, xVal = "";
      for (var xi = 0; xi < AValue.length; xi++) {
         xAr = AValue[xi];
         xAr.name ? xVal = xAr.name : xVal = "";
         if (xAr.value != undefined) { if (xVal) { xVal += "="} xVal += xAr.value; }
         if (xArgs) { xArgs += ","; }
         xArgs += xVal;
      }
      return xArgs;
   }

   function MinimizeSymbols(AValue, AScope) {
      var xPreDot    = "#" + daa.Chr(1) + daa.Chr(1) + "#";
      var xPreSlh    = "#" + daa.Chr(1) + daa.Chr(2) + "#";
      var xPostDD    = "#" + daa.Chr(1) + daa.Chr(3) + "#";
      var xPreDotRE  = new RegExp(xPreDot, "g");
      var xPreSlhRE  = new RegExp(xPreSlh, "g");
      var xPostDDRE  = new RegExp(xPostDD, "g");
      var xCnt = 1;
      for (var xkey in AScope.tk) {
         AValue = AValue.replace(new RegExp("\\.[\\s]*" + xkey, "g"), xPreDot)
                        .replace(new RegExp("(" + QS + "[0-9]+?#)" + xkey, "g"), "$1" + xPreSlh)
                        .replace(new RegExp("(,|{)[\\s]*\\b" + xkey + "[\\s]*:", "g"), "$1" + xPostDD);
         AValue = AValue.replace(new RegExp("\\b" + xkey + "\\b", "g"), TK + xCnt + "#");
         AValue = AValue.replace(xPreDotRE, "." + xkey)
                        .replace(xPreSlhRE, xkey)
                        .replace(xPostDDRE, xkey + ":");
         xCnt++;
      }
      var xCnt = 1;
      for (var xkey in AScope.tk) {
         AValue = daa.Replace(new RegExp(TK + xCnt + "#", "g"), AValue, AScope.tk[xkey]);
         xCnt++;
      }
      return AValue;
   }

   function MinimizeEvls(AEvls, ARef, AScope) {
      var xIdx = 0;
      for (var xi = 0; xi < AEvls.length; xi++) {
         xIdx = _GetObjectIndex(AEvls[xi]);
         if (!(xIdx in ARef.qs)) { continue; }
         ARef.qs[xIdx] = MinimizeSymbols(ARef.qs[xIdx], AScope);
      }
   }

   function MinimizeVars(AValue) {
      AValue = AValue.replace(/(\bvar\b[\s\S]*?;)/g, "$1" + VR + "#")
                     .replace(new RegExp(";" + VR + "#[\\s]*var ", "g"), ",")
                     .replace(new RegExp(VR + "#", "g"), "");
      return AValue;
   }

   function MinimizeFunction(AFnRef, ARef, AScope) {
      var xScope = CreateScope(AFnRef, ARef, AScope);
      var xName = AFnRef.name; if (xName && AScope.tk[xName]) { xName = AScope.tk[xName]; }
      // TODO Switch the next line to ON after revalidating daa Inheritance
      // if (AFnRef.ismethod) { xName = ""; }
      var xBody = MinimizeVars(AFnRef.body);
      var xValue = "(" + CreateArgs(AFnRef.args) + "){" + xBody + "}";
      xValue = MinimizeSymbols(xValue, xScope);
      if (!daa.IsEmpty(AFnRef.evls)) { MinimizeEvls(AFnRef.evls, ARef, xScope); }
      xValue = MinimizeFunctions(xValue, AFnRef, ARef, xScope);
      xValue = "function" + (xName && " ") + xName + xValue;
      return xValue;
   }

   function MinimizeFunctions(AValue, AFnRef, ARef, AScope) {
      if (AFnRef.funs) {
         var xFn = "", xFnCode = "";
         for (var xi = 0; xi < AFnRef.funs.length; xi++) {
            xFnCode = AFnRef.funs[xi];
            xFn = _GetObject(xFnCode, "fn", ARef); if (!xFn) { return "daa:error:js:InvalidRef:" + AFnRef.funs[xi]; }
            AValue = AValue.replace(xFnCode, MinimizeFunction(xFn, ARef, AScope));
         }
      }
      return AValue;
   }

   function MinimizeSpaces(AValue, AFormat) {
      if (AFormat) {
         AValue = AValue.replace(/[\s]*(,|;|:|!|=|\+|\-|\*|\/|>|<|\?|\)|\(|\]|\[|}|{|&|\||\^|~)[\s]*/g, function(a){return a.replace(/[\s]*/g, "");});
         AValue = AValue.replace(/[\s]+/g, " ");
      } else {
         AValue = AValue.replace(/[ \t\v]*(,|;|:|!|=|\+|\-|\*|\/|>|<|\?|\)|\(|\]|\[|}|{|&|\||\^|~)[ \t\v]*/g, function(a){return a.replace(/[\s]*/g, "");});
         AValue = AValue.replace(/[ \t\v]+/g, " ").replace(/\r*\n/g, daa.Conf.crlf || "\n");
      }
      AValue = AValue.replace(/(,|;)}/g, "}").replace(/^[\s]+|[\s]+$/g, "");
      return AValue;
   }

   function RestoreQuotes(AValue, ARef) {
      for (var xi = 0; xi < ARef.qs.length; xi++) {
         AValue = daa.Replace(new RegExp(QS + xi + "#"), AValue, ARef.qs[xi]);
      }
      return AValue;
   }

   // **************************************************************************
   // Getter

   function _GetObjectIndex(AName) {
      return Number(AName.replace(/[^0-9]/g, ""));
   }

   function _GetObject(AName, AType, ARef) {
      var xIdx = Number(AName.replace(/[^0-9]/g, ""));
      if (!(xIdx in ARef[AType])) { return null; }
      return ARef[AType][xIdx];
   }

   // **************************************************************************
   // Public section

   this.GetObject = function(AName, ARef) {
      var xType = "";
      if      (new RegExp("^" + QS).test(AName)) { xType = "qs"; }
      else if (new RegExp("^" + FN).test(AName)) { xType = "fn"; }
      else { return null; }
      return _GetObject(AName, xType, ARef);
   };

   this.Minimize = function(ARef, AFormat) {
      var xScope = CreateScope(ARef, ARef, {id: 97, pre: "", tk: {}});
      var xValue = MinimizeFunctions(ARef.body, ARef, ARef, xScope);
      xValue = MinimizeSpaces(xValue, AFormat);
      xValue = RestoreQuotes(xValue, ARef);
      return xValue;
   };

   this.Parse = function(AValue) {
      var xObj = {
         qs: [],
         fn: [],
         body: ""
      };
      AValue = AValue.replace(/\r/g, "").replace(/\\\n/g, "");
      AValue = daa.ReplaceQuotes(AValue, function(a) { xObj.qs.push(a); return QS + (xObj.qs.length - 1) + "#"; },
                                         function(a) { if (/\n$/.test(a)) { return "\n"; } else { return ""; }} );
      AValue = AValue.replace(/\n[ \t\v]+/g, "\n").replace(/\n+/g, "\n").replace(/[ \t\v]+/g, " ");
      AValue = ReplaceFunctions(AValue, xObj);
      if (daa.IsError(AValue)) { return AValue; }
      xObj.body = AValue;
      xObj.funs  = AValue.match(new RegExp(FN + "[0-9]+?#", "g"));
      if (/daa\.RegisterClasses/.test(AValue)) { xObj.classes = ParseClasses(xObj); }
      return xObj;
   };

}
);

