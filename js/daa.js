// *****************************************************************************
// DAA CORE MODULE
//
// (c) Mikaella Klyueva, DAA Systems, 2013-2016
// http://daajs.org
// Developer Guide: http://daajs.org/guide
// API Reference: http://daajs.org/api
// *****************************************************************************

// *****************************************************************************
// Ensure 'name' in Function.prototype and define 'daa_name', that is strongly
// required for daa classes inheritance implementation.

if (!("name" in Function.prototype)) {
   Object.defineProperty(Function.prototype, "name", {
      get: function() { return this.toString().replace(/^[\s]*function[\s]*|\([\s\S]*$/g, ""); }
   });
}
Object.defineProperty(Function.prototype, "daa_name", {writable: true});


// *****************************************************************************
// @class daa

var daa = new function() {
   this.path = "";
   this.name = "daa";
   this.classname = "DAA";
   this.version = "0.9.2";

// ***
// @constant daa.Constants

   this.RET_ASIS    = 1;   // @value daa.RET_ASIS - Return value AS IS.
   this.RET_NUMERIC = 2;   // @value daa.RET_NUMERIC - Return numeric value.
   this.RET_ROUNDED = 4;   // @value daa.RET_ROUNDED - Return rounded numeric value.
   this.RET_STRING  = 8;   // @value daa.RET_STRING - Return string value.
   this.RET_ARRAY   = 16;  // @value daa.RET_ARRAY - Return array value.
   this.RET_OBJECT  = 32;  // @value daa.RET_OBJECT - Return object value.
   this.RET_TRIMMED = 64;  // @value daa.RET_TRIMMED - Return trimmed string value.
   this.RET_VALUE   = 128; // @value daa.RET_VALUE - Return a value of something
   
   this.IS_LOGICAL      = 1; // @value daa.IS_LOGICAL - Logical operation is to be performed.
   this.IS_ARITHMETICAL = 2; // @value daa.IS_ARITHMETICAL - Arithmetical operation is to be performed.
   this.IS_OVERRIDE     = 1; // @value daa.IS_OVERRIDE - Forces to override properties.
   
   this.REL_NONE   = 0;  // @value daa.REL_NONE - Relative to nothing.
   this.REL_PAGE   = 1;  // @value daa.REL_PAGE - Relative to page.
   this.REL_CLIENT = 2;  // @value daa.REL_CLIENT - Relative to window client.
   this.REL_PARENT = 3;  // @value daa.REL_PARENT - Relative to parent.

// *****************************************************************************
//
//
// IMPLEMENTATION
//
//
// *****************************************************************************


   // **************************************************************************
   //
   // PRIVATE SECTION
   //
   // **************************************************************************

   // ***
   // @object {object} daa.Conf

   var _Conf = {
      errorhandlingstyle: "",
      errormessagemethod: "",
      crlf: "\r\n",
      inputprocessor: "",
      restmethod: "daasrv.php"
   };
   this.Conf = _Conf;

   // ***
   // @object {object} daa.GlobalModel

   var _Model = { };
   this.GlobalModel = _Model;

   this.variables = {};

   this.zorder = {
      wnd: 500,
      fw: 1000
   };

   // **************************************************************************
   //
   // PUBLIC SECTION
   //
   // **************************************************************************

   // **************************************************************************
   // Models prototypes

    // ***
    // @object daa.protos

   this.protos = {
      object:       {
                       path: "", name: "model"
                    },
      vobject:      {
                       path: "", name: "model", lastid: 0,
                       proto: {path: "model", name: "proto", isproto: 1}
                    },
      vtreesimple:  {
                       path: "", name: "model", isvtree: 1, lastid: 0,
                       proto: {path: "model", name: "proto", isproto: 1, isvtreeitem: 1, vparent: ""}
                    },
      vtreecomplex: {
                       path: "", name: "model", isvtree: 1, lastid: 0,
                       proto: {
                          path: "model", name: "proto", isproto: 1, isvtreeitem: 1,
                          vindex: 0, vlevel: 0, vcount: 0, vparent: ""
                       }
                    },
      viewtree:     {
                       path: "", name: "model", isproto: 1, isvtree: 1, isvtreeitem: 1, isviewtree: 1, lastid: 0, lastids: {},
                       vindex: 0, vlevel: 0, vcount: 0, vparent: "",
                       proto: {
                          path: "model", name: "proto", isproto: 1, isvtreeitem: 1, isviewdata: 1,
                          vindex: 0, vlevel: 0, vcount: 0, vparent: "",
                          vnid: "", vcid: ""
                       }
                    }
   };
   this.protos.vtree = this.protos.vtreecomplex;

   // **************************************************************************
   // Environment

    // ***
    // @object {number} daa.IsClient

   this.IsClient   = Number(typeof(window) != "undefined" && typeof(window.navigator) != "undefined");

    // ***
    // @object {number} daa.IsServer

   this.IsServer   = Number(!this.IsClient && typeof(process) != "undefined");

    // ***
    // @object {number} daa.IsMobile

   this.IsMobile   = (this.IsClient && Number(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent))) || 0;
   this.DBr        = function(a){var b=navigator.userAgent,c=/Version[ \/]+\w+\.\w+/i,e=/Safari\/\w+\.\w+/i,d=[],k=/[ \/\.]/i;c=b.match(c);var g=b.match(/Firefox\/\w+\.\w+/i),h=b.match(/Chrome\/\w+\.\w+/i),i=b.match(/Version\/\w+\.\w+/i);e=b.match(e);var j=b.match(/MSIE *\d+\.\w+/i);b=b.match(/Opera[ \/]+\w+\.\w+/i);if(!b==""&!c=="")d[0]=c[0].replace(/Version/,"Opera");else if(!b=="")d[0]=b[0];else if(!j=="")d[0]=j[0];else if(!g=="")d[0]=g[0];else if(!h=="")d[0]=h[0];else if(!i==""&&!e=="")d[0]=i[0].replace("Version","Safari");var f;if(d[0]!=null)f=d[0].split(k);if((a==null|a==0)&f!=null){a=f[2].length;f[2]=f[2].substring(0,a);return f}else if(a!=null){f[2]=f[2].substr(0,a);return f}else return ["none",0,0]};
   this.DJS        = function(){var a=[];if(window.opera){a[0]="Opera";a[1]=window.opera.version()}else if(window.chrome)a[0]="Chrome";else if(window.sidebar)a[0]="Firefox";else if(!window.external&&a[0]!=="Opera")a[0]="Safari";else if(window.ActiveXObject){a[0]="MSIE";a[1]=window.navigator.userProfile?"6":window.Storage?"8":!window.Storage&&!window.navigator.userProfile?"7":"Unknown"}else if(typeof(navigator.msPointerEnabled)!="undefined"){a[0]="MSIE";a[1]=11;}return a?a:["none",0,0]};
   this.GetBrowser = function(a,b){a=this.DBr(),b=this.DJS();return a[0]==b[0]?a:b};
   this.GetNJSVer  = function (){var a=["nodejs", 0, 0]; var x=process.version.split(".");a[1]=(x[0] && x[0].replace(/[a-z]/g, "")) || 0;a[2]=x[1] || 0;return a;};
   //this.GetSBW = function(){var a=document.createElement("div");var b=document.createElement("div");var t=el.Get("tester");if((!a)||(!b)||(!t)){return;}a.style.width="100px";a.style.height="100px";a.style.overflow="scroll";b.style.height="200px";a.appendChild(b);t.appendChild(a);this.ScrollBarSize=100-el.GetW(b);t.removeChild(a);delete a;};

    // ***
    // @object {array} daa.Browser

   this.Browser    = (this.IsClient && this.GetBrowser()) || (this.IsServer && this.GetNJSVer()) || ["none", 0, 0];
   this.Browser[0] = this.Browser[0].toLowerCase();

   // **************************************************************************
   // Utils

   // *************************
   // Private Type Info Services

   // Types descriptor
   // Consequence of items in the object is important, because GetType looks
   // through it to find a first match. Some types, such as "number" or "nan",
   // would override more specific types if placed before them.

    // ***
    // @object {object} daa.Types

   var Types = {
      IsNull:      "null",         // @value {string} IsNull - {null}
      IsUndefined: "undefined",    // @value {string} IsUndefined - {undefined}
      IsBoolean:   "boolean",      // @value {string} IsBoolean - {boolean}
      IsString:    "string",       // @value {string} IsString - {string}
      IsFloat:     "float",        // @value {string} IsFloat - {float}
      IsInt:       "int",          // @value {string} IsInt - {int}
      IsNumber:    "number",       // @value {string} IsNumber - {number}
      IsArray:     "array",        // @value {string} IsArray - {array}
      IsObject:    "object",       // @value {string} IsObject - {object}
      IsFunction:  "function",     // @value {string} IsFunction - {function}
      IsNaN:       "nan"           // @value {string} IsNaN - {nan}
   };

   var ToString = Object.prototype.toString;

   // *************************
   // Public Type Info Services

    // ***
    // @method daa.IsNull @groupname rtti

   this.IsNull = function(AObj) { return Number(typeof(AObj) == "object" && AObj == null); };

    // ***
    // @method daa.IsUndefined @groupname rtti

   this.IsUndefined = function(AObj) { return Number(typeof(AObj) == "undefined"); };

    // ***
    // @method daa.IsBoolean @groupname rtti

   this.IsBoolean = function(AObj)   { return Number(typeof(AObj) == "boolean"); };

    // ***
    // @method daa.IsString @groupname rtti

   this.IsString = function(AObj)    { return Number(typeof(AObj) == "string"); };

    // ***
    // @method daa.IsFloat @groupname rtti

   this.IsFloat = function(AObj)     { return Number(typeof(AObj) == "number" && AObj != ~~AObj && !isNaN(AObj)); };

    // ***
    // @method daa.IsInt @groupname rtti

   this.IsInt = function(AObj)       { return Number(typeof(AObj) == "number" && AObj == ~~AObj && !isNaN(AObj)); };

    // ***
    // @method daa.IsNumber @groupname rtti

   this.IsNumber = function(AObj)    { return Number(typeof(AObj) == "number" && !isNaN(AObj)); };

    // ***
    // @method daa.IsArray @groupname rtti

   this.IsArray = function(AObj)     { return Number(ToString.apply(AObj) == "[object Array]"); };

    // ***
    // @method daa.IsObject @groupname rtti

   this.IsObject = function(AObj)    { return Number(typeof(AObj) == "object" && AObj != null && ToString.apply(AObj) != "[object Array]"); };

    // ***
    // @method daa.IsEnum @groupname rtti

   this.IsEnum = function(AObj)      { return Number(this.IsObject(AObj) || this.IsArray(AObj)); };

    // ***
    // @method daa.IsFunction @groupname rtti

   this.IsFunction = function(AObj)  { return Number(typeof(AObj) == "function"); };

    // ***
    // @method daa.IsNaN @groupname rtti

   this.IsNaN = function(AObj)       { return Number(isNaN(AObj)); };

    // ***
    // @method daa.GetType

   function GetType(AObj) {
      for (var xkey in Types) {
         if (daa[xkey](AObj)) { return Types[xkey]; }
      }
      return "unknown";
   }
   this.GetType = GetType;

   // *************************
   // Value Info Services

    // ***
    // @method daa.IsNumeric @groupname rtti

   this.IsNumeric = function(AObj) {
      if ((this.IsNull(AObj)) || (this.IsBoolean(AObj)) || (this.IsNumber(AObj))) { return 1; }
      if (this.IsString(AObj)) { return Number(!isNaN(AObj) && Trim(AObj) != ""); }
      return 0;
   };

    // ***
    // @method daa.IsZero @groupname rtti

   this.IsZero = function(AObj) { return Number(typeof(AObj) == "number" && AObj == 0); };

    // ***
    // @method daa.IsZeroString @groupname rtti

   this.IsZeroString = function(AObj) { return Number(typeof(AObj)=="string" && Trim(AObj)=="0"); };

    // ***
    // @method daa.IsEmpty @groupname rtti

   this.IsEmpty = function(AObj) {
      if (this.IsFunction(AObj)) {
         return Number(AObj.toString().replace(/^[\s\S]*function[\s\S]*\([\s\S]*\)\s*{\s*/, "").replace(/\s*}\s*$/, "") == "");
      }
      if (this.IsArray(AObj)) {
         return Number(AObj.length <= 0);
      }
      if (this.IsObject(AObj)) {
         for (var xkey in AObj) { return 0; }
         return 1;
      }
      if (!AObj) {
         return 1;
      }
      return 0;
   };

    // ***
    // @method daa.IsEmptyString @groupname rtti

   this.IsEmptyString = function(AObj) {
      if (this.IsString(AObj) && !AObj) { return 1; }
      return 0;
   };

    // ***
    // @method daa.IsNode @groupname rtti

   this.IsNode = function(AObj) {
      return Number(ToString.apply(AObj).indexOf("[object HTML") >= 0);
   };

    // ***
    // @method daa.IsBrowserObject @groupname rtti

   this.IsBrowserObject = function(AObj) {
      return Number(ToString.apply(AObj).indexOf("[object Object") < 0);
   };

    // ***
    // @method daa.IsPath @groupname rtti

   this.IsPath = function(AObj) {
      return Number(this.IsString(AObj) && AObj.indexOf("/") > 0 && !/[^A-Za-z0-9_\/]/.test(AObj));
   };

    // ***
    // @method daa.IsVObject @groupname rtti

   this.IsVObject = function(AObj) {
      if (!AObj || typeof(AObj) != "object" || !("path" in AObj) || !AObj.name || AObj.name == "proto" || !AObj.proto) { return 0; }
      return 1;
   };

    // ***
    // @method daa.IsVTree @groupname rtti

   this.IsVTree = function(AObj) {
      if (!daa.IsVObject(AObj) || !AObj.isvtree) { return 0; }
      return 1;
   };

    // ***
    // @method daa.IsVItem @groupname rtti

   this.IsVItem = function(AObj) {
      if (!AObj || typeof(AObj) != "object" || !("path" in AObj) || !AObj.name || AObj.name == "proto" || !AObj.isproto) { return 0; }
      return 1;
   };

    // ***
    // @method daa.IsVTreeItem @groupname rtti

   this.IsVTreeItem = function(AObj) {
      if (!daa.IsVItem(AObj) || !AObj.isvtreeitem || !("vparent" in AObj)) { return 0; }
      return 1;
   };

    // ***
    // @method daa.IsLayoutItem @groupname rtti

   this.IsLayoutItem = function(AObj) {
      if (!AObj || typeof(AObj) != "object" || !AObj.islayoutitem) { return 0; }
      return 1;
   };

    // ***
    // @method daa.IsError @groupname rtti

   this.IsError = function(AObj) {
      if (!this.IsString(AObj)) { return 0; }
      if (/^daa:error:/.test(AObj)) { return 1; }
      return 0;
   };

   // *************************
   // Type Convertion Services

   // Undocumented private conversion services
   // Return source-code string representation of the object

   this.nullToCode      = function(AObj) { return "null"; };
   this.undefinedToCode = function(AObj) { return "undefined"; };
   this.booleanToCode   = function(AObj) { return AObj.toString(); };
   this.stringToCode    = function(AObj) { return "\"" + AObj.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "") + "\""; };
   this.floatToCode     = function(AObj) { return AObj.toString(); };
   this.intToCode       = function(AObj) { return AObj.toString(); };
   this.numberToCode    = function(AObj) { return AObj.toString(); };
   this.arrayToCode     = function(AObj) { return daa.Serialize(AObj); };
   this.objectToCode    = function(AObj) { return daa.Serialize(AObj); };
   this.functionToCode  = function(AObj) { return AObj.toString(); };
   this.nanToCode       = function(AObj) { return "NaN"; };

   // **************************************************************************
   // Condition

   this.expr = new function() {
       // Types csv for EvalTypeExpr fast typecasting.
      var TypesStr = ","; for (var xkey in Types) { TypesStr += Types[xkey] + ","; }

      function MExpr(AExpr, AObj, AOp) {
         var xArr, yArr, xMtd, xExpr = "", xVal = "";
         switch (AOp) {
            case daa.IS_LOGICAL:
               xArr = AExpr.match(/[^\&\&|\|\|]+/g);
               yArr = AExpr.match(/[\&\&|\|\|]+/g);
               xMtd = EvalExpr;
               break;
            case daa.IS_ARITHMETICAL:
               AExpr = AExpr.replace(/ \/ /g, "").replace(/^[\s]*-/g, "").replace(/(\+|\*|\-||%)[\s]*-/g, "$1");
               xArr = AExpr.match(/[^\+|\*|\-||%]+/g) || [];
               yArr = AExpr.match(/[\+|\*|\-||%]+/g) || [];
               xMtd = FormatExpr;
               break;
            default: return 0;
         }
         var xExpr = "", xVal = "";
         for (var xi = 0; xi < xArr.length; xi++) {
            xArr[xi] = xArr[xi].replace(//g, "-");
            xVal = xArr[xi].replace(/^[\s]+|[\s]+$/g, "");
            if (!daa.IsNumeric(xVal)) {
               xExpr += daa.Replace(new RegExp(xVal.replace(daa.EscapeRE, "\\$1")), xArr[xi], xMtd(xVal, AObj, daa.RET_ASIS));
            } else {
               xExpr += xArr[xi];
            }
            if (yArr[xi]) { xExpr += yArr[xi]; }
         }
         switch (AOp) {
            case daa.IS_LOGICAL:      return eval(xExpr);
            case daa.IS_ARITHMETICAL: return eval(xExpr.replace(//g, " / "));
            default:                  return 0;
         }
      }
   
      function EvalQuotes(AExpr, AObj) {
         var xObj = daa.ParseQuotes(AExpr, "(", ")");
         if (!xObj.value) { return AExpr; }
         var xVal = xObj.value.replace(/^\(|\)$/g, "");
         AExpr = daa.Replace(new RegExp(xObj.value.replace(daa.EscapeRE, "\\$1")), AExpr, EvalExpr(xVal, AObj));
         if (/\([\s\S]*?\)/.test(AExpr)) { return EvalQuotes(AExpr, AObj); }
         else { return AExpr; }
      }

      function FormatExpr(AExpr, AObj, AFmt) {
         if (/[\+\*\-%]| \/ /.test(AExpr)) { return MExpr(AExpr, AObj, daa.IS_ARITHMETICAL); }
         if (daa.IsPath(AExpr)) {
            var xRoot = _Model; if (AExpr.search(/^this\//) == 0) { xRoot = AObj; AExpr = AExpr.replace(/^this\//, ""); }
            AExpr = daa.o.Get(AExpr, xRoot, null);
            if (!(AFmt & daa.RET_OBJECT)) {
               if (daa.IsArray(AExpr)) { AExpr = AExpr.toString(); }
               else if (daa.IsObject(AExpr)) { AExpr = AExpr.toString(); }
            }
         } else if (/^'[\s\S]*?'$/.test(AExpr)) { AExpr = AExpr.replace(/^'|'$/g, ""); }
         if (AExpr == "null" || AExpr == "undefined") { AExpr = null; }
         else if (AFmt & daa.RET_STRING) { daa.IsObject(AExpr) ? AExpr = daa.csv.JoinKeys(AExpr) : AExpr = String(AExpr); }
         else if (!daa.IsNumeric(AExpr) && !(AFmt & daa.RET_OBJECT)) { AExpr = daa.stringToCode(AExpr); }
         return AExpr;
      }

      function EvalEnumExpr(AExpr, AObj) {
         var xSign  = (/ in /i.test(AExpr) && "==") || "!=", xSep=",";
         AExpr = AExpr.replace(/ !*?in /g, "");
         var xLeft  = AExpr.replace(/[\s\S]*$/, "").replace(/^[\s]+|[\s]+$/g, "");
         var xRight = AExpr.replace(/^[\s\S]+/, "").replace(/^[\s]+|[\s]+$/g, "");
         xLeft  = FormatExpr(xLeft, AObj, daa.RET_STRING);
         if (/^RegExp:/.test(xLeft)) { xLeft = xLeft.replace(/^RegExp:/, ""); xSep = ""; } else { xLeft = xSep + xLeft + xSep; }
         if (daa.IsPath(xRight)) { xRight = FormatExpr(xRight, AObj, daa.RET_STRING | daa.RET_OBJECT) || ""; }
         xRight = xSep + xRight.replace(/^\[|\]$/g, "").replace(/,[\s]*/g, ",") + xSep;
         if (!xSep) { return Number(new RegExp(xLeft, "i").test(xRight)); }
         else { return Number(xRight.indexOf(xLeft) >= 0); }
      }
   
      function EvalTypeExpr(AExpr, AObj) {
         var xSign  = (/ is /i.test(AExpr) && "==") || "!=";
         AExpr = AExpr.replace(/ !*?is /g, "");
         var xLeft  = AExpr.replace(/[\s\S]*$/, "").replace(/^[\s]+|[\s]+$/g, "");
         var xRight = AExpr.replace(/^[\s\S]+/, "").replace(/^[\s]+|[\s]+$/g, "");
         if (/^class /.test(xRight)) {
            xSign == "==" ? xSign = 1 : xSign = 0;
            var yLeft  = FormatExpr(xLeft, AObj, daa.RET_OBJECT);
            if (daa.IsString(yLeft) && /vnid$/.test(xLeft)) { yLeft = daa.n.Get(yLeft); }
            return Number(xSign == daa.class.Is(yLeft, xRight.replace(/^class /, "")));
         } else if (TypesStr.indexOf("," + xRight + ",") >= 0) {
            xLeft  = FormatExpr(xLeft, AObj, daa.RET_OBJECT);
            if (/number|int|float/.test(xRight) && daa.IsNumeric(xLeft) && daa.IsString(xLeft)) { xLeft = Number(xLeft); }
            return eval("(\"" + GetType(xLeft) + "\"" + xSign + "\"" + xRight + "\")");
         } else { return 0; }
         return 1;
      }
   
       // ***
       // @method daa.EvalExpr
   
      function EvalExpr(AExpr, AObj, AFmt) {
         if (/\([\s\S]*?\)/.test(AExpr)) { AExpr = EvalQuotes(AExpr, AObj); }
         if (/\&\&|\|\|/.test(AExpr)) { return MExpr(AExpr, AObj, daa.IS_LOGICAL); }
         if (/ !*?is /i.test(AExpr))  { return EvalTypeExpr(AExpr, AObj); }
         if (/ !*?in /i.test(AExpr))  { return EvalEnumExpr(AExpr, AObj); }
         if (!/[=><!]/.test(AExpr))   { return FormatExpr(AExpr, AObj, AFmt || daa.RET_OBJECT); }
         var xSign  = AExpr.replace(/[^=><!]+/g, "");
         var xLeft  = AExpr.replace(/[=><!]+[\s\S]*$/, "").replace(/^[\s]+|[\s]+$/g, "");
         var xRight = AExpr.replace(/^[\s\S]+[=><!]/, "").replace(/^[\s]+|[\s]+$/g, "");
         xLeft  = FormatExpr(xLeft, AObj);
         xRight = FormatExpr(xRight, AObj);
         if (!xLeft && !xRight) { xRight = xLeft; }
         if (typeof(xLeft) == "string" && xLeft == "\"\"") { xLeft = null; }
         return eval(xLeft + xSign + xRight);
      }

      this.Eval = function(AExpr, AObj, AFmt) {
         AExpr = daa.variable.Fill(AExpr);
         return EvalExpr(AExpr, AObj, AFmt);
      };

   };

   this.EvalExpr = this.expr.Eval;

    // ***
    // @method daa.Condition

   this.Condition = function(AExpr, AObj) {
      AExpr = String(AExpr);
      return (this.EvalExpr(AExpr, AObj) && 1) || 0;
   };

   // **************************************************************************
   // String Methods

   this.srlz = new function() {

      var ObjectFormat = {
         json: {
            array: ["[", "]"],
            object: ["{", "}", ":", "", "\""]
         },
         jsonquoted: {
            array: ["[", "]"],
            object: ["{", "}", ":", "\"", "\""]
         },
         php: {
            array: ["array(", ")"],
            object: ["array(", ")", "=>", "\"", "\""]
         }
      };
   
       // Undocumented private subservice of Serialize
       // Do not ever call it directly.
   
      function ToStringSerialize(AObj, AOpt, AType, ALevel, AFmt) {
         switch (AType) {
            case "array": return AFmt[AType][0] + arraySerialize(AObj, AOpt, AType, ALevel + 1) + AFmt[AType][1];
            case "object": if (daa.IsBrowserObject(AObj)) { return AObj.toString(); }
               else { return AFmt[AType][0] + objectSerialize(AObj, AOpt, AType, ALevel + 1) + AFmt[AType][1]; }
            default:
               if (daa[AType + "ToCode"]) { return daa[AType + "ToCode"](AObj); }
               else { return AObj; }
         }
      }
   
       // Undocumented private subservice of Serialize
       // Do not ever call it directly
   
      function arraySerialize(AObj, AOpt, AType, ALevel) {
         AType ? AType : AType = GetType(AObj);
         var xFmt = ObjectFormat[AOpt.format];
         var xSep = "", xValSep = "", xInd = "", xOptInd = "", xLastInd = "", ySep;
         var xS = "";
         var xType = "";
   
         switch (AOpt.style) {
            case "optimized":
               xValSep = " ";
               xOptInd = " ";
               break;
            case "expanded":
               xSep = _Conf.crlf;
               xValSep = " ";
               xInd = daa.StrRepeat(" ", ALevel * 3);
               xLastInd = daa.StrRepeat(" ", (ALevel - 1) * 3);
               break;
         }
   
          // Processing
         for (var xkey in AObj) {
            ((xType == "array") || (xType == "object")) ? ySep = xSep + xInd + xOptInd : ySep = xValSep;
            xS ? xS += "," + ySep : xS;
            xType = GetType(AObj[xkey]);
            xS += ToStringSerialize(AObj[xkey], AOpt, xType, ALevel, xFmt);
         }
         return xSep + xInd + xS + xSep + xLastInd;
      }
   
       // Undocumented private subservice of Serialize
       // Do not ever call it directly
   
      function objectSerialize(AObj, AOpt, AType, ALevel) {
         AType ? AType : AType = GetType(AObj);
         var xFmt = ObjectFormat[AOpt.format];
         var xStyle = AOpt.style;
         var xSep = "", xValSep = "", xInd = "", xLastSep = "", xLastInd = "";
         var xS = "";
         var xTypes = {}, xIsCompex = 0;
   
          // Determine object complexity and save types
         for (var xkey in AObj) {
            xTypes[xkey] = GetType(AObj[xkey]);
            if ((xTypes[xkey] == "array") || (xTypes[xkey] == "object")) { xIsCompex = 1; }
         }
         if ((xIsCompex) && (xStyle == "optimized")) {  xStyle = "expanded"; }
   
         switch (xStyle) {
            case "optimized":
               xSep = " ";
               xValSep = " ";
               break;
            case "expanded":
               xSep = _Conf.crlf;
               xValSep = " ";
               xInd = daa.StrRepeat(" ", ALevel * 3);
               xLastSep = _Conf.crlf;
               xLastInd = daa.StrRepeat(" ", (ALevel - 1) * 3);
               break;
         }
   
          // Processing
         for (var xkey in AObj) {
            xS ? xS += "," + xSep + xInd : xS;
            xS += KeyString(xkey, xFmt[AType][3], xFmt[AType][4]) + xFmt[AType][2] + xValSep;
            xS += ToStringSerialize(AObj[xkey], AOpt, xTypes[xkey] || "", ALevel, xFmt);
         }
         return xLastSep + xInd + xS + xLastSep + xLastInd;
      }
   
      function KeyString(AObj, AQDesired, AQRequired) {
         var xKey = String(AObj);
         if ((AQDesired == AQRequired) || (/^[0-9a-z_]+$/i.test(xKey))) { return AQDesired + xKey + AQDesired; }
         return AQRequired + xKey + AQRequired;
      }

       // Head serialization service
   
      function Serialize(AObj, AOpt, AType, ALevel) {
          // Validation
         AOpt ? AOpt : AOpt = {};
         AOpt.format ? AOpt : AOpt.format = "json";
         ObjectFormat[AOpt.format] ? AOpt : AOpt.format = "json";
         AOpt.style ? AOpt : AOpt.style = "minimized";
         AOpt.codetypes ? AOpt : AOpt.codetypes = "string, function";
         AType ? AType : AType = GetType(AObj);
         daa.IsUndefined(ALevel) ? ALevel = 0 : ALevel++;
   
          // Call type related serializer
         return ToStringSerialize(AObj, AOpt, AType, ALevel, ObjectFormat[AOpt.format]);
      }
      this.Serialize = Serialize;
   };

    // ***
    // @method daa.Serialize

   this.Serialize = this.srlz.Serialize;

    // ***
    // @method daa.Unserialize

   this.Unserialize = function(AObj) {
      var xObj = String(AObj);
      try {
         if (!/\[|{|\"|'/.test(xObj) && !daa.IsNumeric(xObj)) { xObj = "'" + xObj + "'"; }
         eval("var xObj=" + xObj);
         return xObj;
      } catch(errobj) {
         return null;
      }
   };

    // ***
    // @method daa.Chr

   this.Chr = function(AValue) { return window.String.fromCharCode(AValue); };

    // ***
    // @method daa.String

   function String(AObj) {
      var xType = GetType(AObj);
      switch (xType) {
         case "boolean": if (AObj) { return "1"; } else { return ""; }
         case "string": return AObj;
         case "float": return AObj.toString();
         case "int": return AObj.toString();
         case "number": return AObj.toString();
         case "array": return daa.Serialize(AObj);
         case "object": return daa.Serialize(AObj);
         case "function": return AObj.toString();
         default: return "";
      }
   }
   this.String = String;

    // ***
    // @method daa.StrToLower @groupname string

   this.StrToLower = function(AObj) { return String(AObj).toLowerCase(); };

    // ***
    // @method daa.StrToUpper @groupname string

   this.StrToUpper = function(AObj) { return String(AObj).toUpperCase(); };

    // ***
    // @method daa.StrPos @groupname string

   this.StrPos = function(AObj, ASubObj) { return String(AObj).indexOf(String(ASubObj)); };

    // ***
    // @method daa.StrRPos @groupname string

   this.StrRPos = function(AObj, ASubObj) { return String(AObj).lastIndexOf(String(ASubObj)); };

    // ***
    // @method daa.StrRepeat @groupname string

   this.StrRepeat = function(AObj, ACount) {
      var xStr = "", yStr = String(AObj);
      for (var xi = 0; xi < ACount; xi++) { xStr += yStr; }
      return xStr;
   };

    // ***
    // @method daa.Trim @groupname string

   function Trim(AObj) {
      return String(AObj).replace(/^[\s]+|[\s]+$/g, "");
   }
   this.Trim = Trim;

    // *** @undocumented
    // @method daa.GetQuotes
    // @desc
    //    Returnes text inside the specified marks AMark/BMark, found in the
    //    given string AObj.
    // @param {*} AObj - Value to proceed with.
    // @param {string} AMark - Opening mark
    // @param {string} BMark - Closing mark
    // @returns {object} Returns the object of the following format:
    //    `{value: [Value matched], pre: [Preceding part of the string AObj], post: [Posterior part of the string AObj]}`.

   this.ParseQuotes = function(AObj, AMark, BMark) {
      AObj = String(AObj);
      var xObj = {pre: "", post: AObj, value: ""};
      var xLen = AObj.length, xN = -999, xCh = "", xSt = 0;
      for (var xi = 0; xi < xLen; xi++) {
         xCh = AObj.charAt(xi);
         if      (xCh == AMark) { if (xN == -999) { xN = 1; xSt = xi; xObj.pre = AObj.substr(0, xi);  } else { xN++; } }
         else if (xCh == BMark) { xN--; }
         if (xN == 0) { xObj.value = AObj.substr(xSt, xi - xSt + 1); xObj.post = AObj.substr(xi + 1); break; }
      }
      return xObj;
   };

    // *** @undocumented
    // @method daa.ReplaceQuotes
    // @desc
    //    Replaces text inside quotes and regexps, found in the
    //    given string AObj, with the specified function AFn's return value.
    // @param {*} AObj - Value to proceed with.
    // @param {function} AFn - Callback function to replace matches.
    // @param {function} [BFn] - Callback function to replace possible source-code comments.
    //    If this parameter is omitted, no comments will be interpreted or replaced.
    // @returns {string} Returns the string with replaced matches.

   this.ReplaceQuotes = function(AObj, AFn, BFn) {
      AObj = String(AObj);
      var xValue = "";
      var xCh = "", yCh = "", xStr = "";
      var xIsOp = "", xIsCmt = "", xIsEsc = 0;
      var xLen = AObj.length;
      for (var xi = 0; xi < xLen; xi++) {
         xCh = AObj.charAt(xi);
         if (xIsOp) {
            xStr += xCh;
            if (BFn) {
               if      (xStr == "/*") { xIsOp = "", xIsCmt = "*/"; yCh = xCh; continue; }
               else if (xStr == "//") { xIsOp = "", xIsCmt = "\n"; yCh = xCh; continue; }
            }
            if (xCh == "\\") { xIsEsc ? xIsEsc = 0 : xIsEsc = 1; yCh = xCh; continue; }
            if (xIsEsc) { xIsEsc = 0; yCh = xCh; continue; }
            if (xCh == xIsOp) {
               xValue += AFn(xStr);
               xIsOp = ""; xStr = "";
            //} else if (xIsOp == "/" && yCh == "/" && !/(\(|=|{|;)[\s]*$/.test(xValue)) {
            } else if (xIsOp == "/" && yCh == "/" && !/[\(\?!=\+\-\*\/&\|^}{:;#][\s]*$/.test(xValue)) {
               xValue += xStr;
               xIsOp = ""; xStr = "";
            }
         } else if (xIsCmt) {
            xStr += xCh;
            if (xCh == xIsCmt || (yCh + xCh) == xIsCmt) {
               xValue += BFn(xStr);
               xIsCmt = ""; xStr = "";
            }
         } else {
            if (/\"|'|\//.test(xCh)) { xIsOp = xCh; xStr = xCh; }
            else { xValue += xCh; }
         }
         yCh = xCh;
      }
      return xValue;
   };

   this.EscapeRE = /(\[|\]|\(|\)|\{|\}|\.|\?|\+|\*|\\|\/|\^|\$|\|)/g;

   this.Replace = function(ARE, AStr, BStr) {
      if (/\$/.test(BStr)) { BStr = BStr.replace(/\$/g, "$$$$"); }
      return AStr.replace(ARE, BStr);
   };

    // ***
    // @method daa.Rand

   this.Rand = function(AMin, AMax) {
      if (AMax) { return Math.floor(Math.random() * (AMax - AMin + 1)) + AMin; }
      else { return Math.floor(Math.random() * (AMin + 1)); }
   };

   this.Time = function() {
      var x=new Date();
      return Math.round((x/1000) - (x.getTimezoneOffset() * 60));
   };

   // **************************************************************************
   // Some utils methods

   this.LessInt = function(a,b){a=Number(a);b=Number(b);if(a<=b){return a;}else{return b;}};
   this.MostInt = function(a,b){a=Number(a);b=Number(b);if(a>=b){return a;}else{return b;}};
   this.Neg = function(a){if(!a){return 1;}else{return 0;}};
   this.PosVal = function(a){if(a>0){return a;}else{return 0;}};
   this.Swap = function(a){
      if(daa.IsString(a)){
          // Orientation
         if (a == "v") { return "h"; } if (a=="h") { return "v"; }
          // Display
         if (this.StrPos(a, "display:") == 0) {
           a = a.replace(/display:\s*/, "");
           if (a == "block") { return "none"; } else { return "block"; }
         }
      }else{
         if(a){return 0;}return 1;
      }
   };

   // **************************************************************************
   // Core SubClasses


   // **************************************************************************
   //
   //                            CLASS CSV
   //
   // **************************************************************************

   // **************************************************************************
   // @class CSV daa.csv

   this.csv = new function() {
      this.path = "daa";
      this.name = "csv";
      this.classname = "CSV";
      this.requires  = "daa";

       // ***
       // @method daa.csv.Split

      this.Split = function(AObj, ASeparator) {
         ASeparator = ASeparator || ",";
         var xArr = String(AObj).split(ASeparator);
         var xRes = [];
         for (var xi = 0; xi < xArr.length; xi++) {
            xArr[xi] = Trim(xArr[xi]);
            if (daa.IsEmptyString(xArr[xi])) { continue; }
            xRes.push(xArr[xi]);
         }
         return xRes;
      };

       // ***
       // @method daa.csv.SplitAsKeys

      this.SplitAsKeys = function(AObj, ASeparator, AProto) {
         ASeparator = ASeparator || ",";
         var xArr = String(AObj).split(ASeparator);
         var xRes = {};
         for (var xi = 0; xi < xArr.length; xi++) {
            xArr[xi] = Trim(xArr[xi]);
            if (daa.IsEmptyString(xArr[xi])) { continue; }
            if (AProto) {
               xRes[xArr[xi]] = AProto;
            }
            else {
               xRes[xArr[xi]] = 1;
            }
         }
         return xRes;
      };

       // ***
       // @method daa.csv.Join

       // AIsNU - undocumented IsNonUnique param. Used only internally by daa.path.Join
       //    to remain non unique values in the result string.

      this.Join = function(AObj, ASeparator, AIsNU) {
         AIsNU = AIsNU || 0;
         var xSep = ASeparator || ",";
         var xRes = xSep;
         var xVal = "";
         if (daa.IsEnum(AObj)) {
            for (var xkey in AObj) {
               xVal = Trim(AObj[xkey]); if (daa.IsEmptyString(xVal)) { continue; }
               if (!AIsNU) { if (xRes.indexOf(xSep + xVal + xSep) >= 0) { continue; } }
               xRes += xVal + xSep;
            }
         }
         else if (AObj.toString) { xRes = xSep + (daa && Trim(AObj) || AObj) + xSep; }
         return xRes.replace(new RegExp("^" + xSep + "|" + xSep + "$", "g"), "");
      };

       // ***
       // @method daa.csv.JoinKeys

      this.JoinKeys = function(AObj, ASeparator) {
         if (!daa.IsEnum(AObj)) { return "0"; }
         var xSep = ASeparator || ",";
         var xRes = "";
         for (var xkey in AObj) {
            if (daa.IsEmptyString(xkey)) { continue; }
            xRes ? xRes += xSep : xRes;
            xRes += Trim(xkey);
         }
         return xRes;
      };

       // ***
       // @method daa.csv.Count

      this.Count = function(AObj, ASeparator) {
         return String(AObj).split(ASeparator || ",").length;
      };

       // ***
       // @method daa.csv.Get

      this.Get = function(AObj, AIndex, ASeparator) {
         var xArr = this.Split(AObj, ASeparator);
         return xArr[AIndex] || "";
      };

       // ***
       // @method daa.csv.Set

      this.Set = function(AObj, AIndex, AValue, ASeparator) {
         var xArr = this.Split(AObj, ASeparator);
         AIndex = Math.abs(AIndex);
         AIndex > xArr.length ? AIndex = xArr.length : AIndex;
         xArr[AIndex] = String(AValue);
         return this.Join(xArr, ASeparator);
      };

      function Args(AObj, AValue, ASeparator) {
         var xSep = ASeparator || ",";
         var xStr = xSep;
         if      (daa.IsString(AObj)) { xStr += daa.csv.JoinKeys(daa.csv.SplitAsKeys(AObj, xSep), xSep); }
         else if (daa.IsArray(AObj))  { xStr += daa.csv.Join(AObj, xSep); }
         else if (daa.IsObject(AObj)) { xStr += daa.csv.JoinKeys(AObj, xSep); }
         if (xStr != xSep) { xStr += xSep; }
         return {
            s: xSep,
            v: (daa.IsEnum(AValue) && AValue) || daa.csv.Split(AValue, xSep),
            o: xStr
         };
      }

      function RE(AValue, ASep) {
         ASep = ASep.replace(daa.EscapeRE, "\\$1");
         return new RegExp(ASep + "[\\s]*?" + AValue.replace(daa.EscapeRE, "\\$1") + "[\\s]*?" + ASep); }

      function Ret(AValue, ASep) {
         ASep = ASep.replace(daa.EscapeRE, "\\$1");
         return AValue.replace(new RegExp("^" + ASep + "|" + ASep + "$", "g"), "");
      }

       // ***
       // @method daa.csv.HAS @groupname bitwise

      this.HAS = function(AObj, AValue, ASeparator) {
         var xA = Args(AObj, AValue, ASeparator);
         for (var xi = 0; xi < xA.v.length; xi++) {
            if (!RE(xA.v[xi], xA.s).test(xA.o)) { return 0; }
         }
         return 1;
      };

       // ***
       // @method daa.csv.EQV @groupname bitwise

      this.EQV = function(AObj, AValue, ASeparator) {
         var xSep = ASeparator || ",";
         return Number(this.HAS(AObj, AValue, xSep) && this.HAS(AValue, AObj, xSep));
      };

       // ***
       // @method daa.csv.AND @groupname bitwise

      this.AND = function(AObj, AValue, ASeparator) {
         var xA = Args(AObj, AValue, ASeparator), xRe;
         var xR = xA.s;
         for (var xi = 0; xi < xA.v.length; xi++) {
            xRe = RE(xA.v[xi], xA.s);
            if (xRe.test(xA.o) && !xRe.test(xR)) {
               xR += xA.v[xi] + xA.s;
            }
         }
         return Ret(xR, xA.s);
      };

       // ***
       // @method daa.csv.OR @groupname bitwise

      this.OR  = function(AObj, AValue, ASeparator)  {
         var xA = Args(AObj, AValue, ASeparator);
         for (var xi = 0; xi < xA.v.length; xi++) {
            if (!RE(xA.v[xi], xA.s).test(xA.o)) {
               xA.o += xA.v[xi] + xA.s;
            }
         }
         return Ret(xA.o, xA.s);
      };

       // ***
       // @method daa.csv.XOR @groupname bitwise

      this.XOR = function(AObj, AValue, ASeparator) {
         var xA = Args(AObj, AValue, ASeparator), xRe;
         for (var xi = 0; xi < xA.v.length; xi++) {
            xRe = RE(xA.v[xi], xA.s);
            if (xRe.test(xA.o)) {
               xA.o = xA.o.replace(xRe, xA.s);
            } else { xA.o += xA.v[xi] + xA.s; }
         }
         return Ret(xA.o, xA.s);
      };

       // ***
       // @method daa.csv.NOT @groupname bitwise

      this.NOT = function(AObj, AValue, ASeparator) {
         var xA = Args(AObj, AValue, ASeparator), xRe;
         for (var xi = 0; xi < xA.v.length; xi++) {
            xRe = RE(xA.v[xi], xA.s);
            if (xRe.test(xA.o)) {
               xA.o = xA.o.replace(xRe, xA.s);
            }
         }
         return Ret(xA.o, xA.s);
      };
   };

   // **************************************************************************
   //
   //                            CLASS QS
   //
   // **************************************************************************

   // **************************************************************************
   // @class QS daa.qs

   this.qs = new function () {
      this.path = "daa";
      this.name = "qs";
      this.classname = "QS";

       // ***
       // @method daa.qs.Split

      this.Split = function(AObj, ASeparator, BSeparator, AFormat) {
         AObj = String(AObj);
         var xSep = (ASeparator && ASeparator) || "&", ySep = (BSeparator && BSeparator) || "=", zSep = (xSep == "#" && "") || "#"; zSep = zSep + "DAA_SEP" + zSep;

         var xRO = {n: 0, f: function(a) { return a.replace(new RegExp(xSep, "g"), zSep); } };
         var xRF = function(a) {
            xRO.n > 0 ? a = xRO.f(a) : a = a.replace(new RegExp(xRO.se + "[\\s\\S]+$"), xRO.f);
            xRO.n = xRO.n + a.split(xRO.s).length - 2;
            return a;
         };
         xRO.s = "{"; xRO.se = "{";   AObj = AObj.replace(/[\s\S]*?}/g,  xRF);
         xRO.s = "<"; xRO.se = "<";   AObj = AObj.replace(/[\s\S]*?>/g,  xRF);
         xRO.s = "("; xRO.se = "\\("; AObj = AObj.replace(/[\s\S]*?\)/g, xRF);
         xRO.s = "["; xRO.se = "\\["; AObj = AObj.replace(/[\s\S]*?\]/g, xRF);
   
         AObj = daa.ReplaceQuotes(AObj, xRO.f);

         var xObj = {}, xArr = AObj.split(xSep), xKey, xValue;
         if (arguments.length > 2 && daa.IsNull(BSeparator)) {
            for (var xi = 0; xi < xArr.length; xi++) {
               xArr[xi] = xArr[xi].replace(new RegExp(zSep, "g"), xSep);
               if (AFormat & daa.RET_TRIMMED) { xArr[xi] = Trim(xArr[xi]); }
               if (AFormat & daa.RET_NUMERIC && daa.IsNumeric(xArr[xi])) { xArr[xi] = Number(xArr[xi]); }
            }
            return xArr;
         }
         for (var xi = 0; xi < xArr.length; xi++) {
            if (!xArr[xi]) { continue; }
            xArr[xi] = xArr[xi].replace(new RegExp(zSep, "g"), xSep);
            xKey   = xArr[xi].replace(new RegExp(ySep + "[\\s\\S]*$"), "").replace(/^[\s]+|[\s]+$/g, "");
            xArr[xi].indexOf(ySep) >= 0 ? xValue = xArr[xi].replace(new RegExp("^[\\s\\S]*?" + ySep), "") : xValue = "";
            if (AFormat & daa.RET_TRIMMED) { xValue = Trim(xValue); }
            if ((AFormat & daa.RET_NUMERIC) && daa.IsNumeric(xValue)) { xValue = Number(xValue); }
            xObj[xKey] = xValue;
         }
         return xObj;
      };

       // ***
       // @method daa.qs.Join

      this.Join = function(AObj, ASeparator, BSeparator) {
         var xSep = (ASeparator && ASeparator) || "&", ySep = (BSeparator && BSeparator) || "=";
         var xStr = "";
         for (var xkey in AObj) {
            xStr ? xStr += xSep : xStr;
            xStr += xkey + ySep + AObj[xkey] || "";
         }
         return xStr;
      };
   };


   // **************************************************************************
   //
   //                            CLASS LC
   //
   // **************************************************************************

   // **************************************************************************
   // @class LC daa.lc

   this.lc = new function () {
      this.path = "daa";
      this.name = "lc";
      this.classname = "LC";

       // ***
       // @method daa.lc.ToSnake

      function ToSnakeA(a, b, c) { return (c ? "_" : "") + b.toLowerCase(); }
      function ToSnakeB(a, c)    { return (c ? "_" : "") + a.toLowerCase(); }
      this.ToSnake = function(AValue) {
         AValue = String(AValue);
         if      (/-/.test(AValue)) { return AValue.replace(/-(\S)/g, ToSnakeA).replace(/[A-Z]/g, ToSnakeB); }
         else if (/_/.test(AValue)) { return AValue.replace(/_(\S)/g, ToSnakeA).replace(/[A-Z]/g, ToSnakeB); }
         else                       { return AValue.replace(/[A-Z]/g, ToSnakeB); }
      };

       // ***
       // @method daa.lc.ToCamel

      function ToCamelA(a, b, c) { return c ? b.toUpperCase() : b.toLowerCase(); }
      function ToCamelB(a)       { return a.toLowerCase(); }
      this.ToCamel = function(AValue) {
         AValue = String(AValue);
         if      (/_/.test(AValue)) { return AValue.replace(/_(\S)/g, ToCamelA).replace(/^[A-Z]/, ToCamelB); }
         else if (/-/.test(AValue)) { return AValue.replace(/-(\S)/g, ToCamelA).replace(/^[A-Z]/, ToCamelB); }
         else                       { return AValue.replace(/^[A-Z]/, ToCamelB); }
      };

       // ***
       // @method daa.lc.ToPascal

      function ToPascalA(a, b)   { return b.toUpperCase(); }
      function ToPascalB(a)      { return a.toUpperCase(); }
      this.ToPascal = function(AValue) {
         AValue = String(AValue);
         if      (/_/.test(AValue)) { return AValue.replace(/_(\S)/g, ToPascalA).replace(/^[a-z]/, ToPascalB); }
         else if (/-/.test(AValue)) { return AValue.replace(/-(\S)/g, ToPascalA).replace(/^[a-z]/, ToPascalB); }
         else                       { return AValue.replace(/^[a-z]/, ToPascalB); }
      };

       // ***
       // @method daa.lc.ToKebab

      function ToKebabA(a, b, c) { return (c ? "-" : "") + b.toLowerCase(); }
      function ToKebabB(a, c)    { return (c ? "-" : "") + a.toLowerCase(); }
      this.ToKebab = function(AValue) {
         AValue = String(AValue);
         if      (/-/.test(AValue)) { return AValue.replace(/-(\S)/g, ToKebabA).replace(/[A-Z]/g, ToKebabB); }
         else if (/_/.test(AValue)) { return AValue.replace(/_(\S)/g, ToKebabA).replace(/[A-Z]/g, ToKebabB); }
         else                       { return AValue.replace(/[A-Z]/g, ToKebabB); }
      };

       // ***
       // @method daa.lc.ToTrain

      function ToTrainA(a, b, c) { return (c ? "-" : "") + b.toUpperCase(); }
      function ToTrainB(a, c)    { return (c ? "-" : "") + a.toUpperCase(); }
      this.ToTrain = function(AValue) {
         AValue = String(AValue);
         if      (/-/.test(AValue)) { return AValue.replace(/-(\S)/g, ToTrainA).replace(/^[a-z]/, ToPascalB); }
         else if (/_/.test(AValue)) { return AValue.replace(/_(\S)/g, ToTrainA).replace(/^[a-z]/, ToPascalB); }
         else                       { return AValue.replace(/[A-Z]/g, ToTrainB).replace(/^[a-z]/, ToPascalB); }
      };

   };

   // **************************************************************************
   //
   //                            CLASS VARIABLE
   //
   // **************************************************************************

   // **************************************************************************
   // @class Variable daa.variable

   this.variable = new function () {
      this.path = "daa";
      this.name = "variable";
      this.classname = "Variable";

       // ***
       // @method daa.variable.Fill

      this.Fill = function(AValue) {
         if (!AValue || !/\$/.test(AValue)) { return AValue; }
         AValue = daa.String(AValue);
         var xRE1, yRE1, xRE2, yRE2;
         for (var xkey in daa.variables) {
            if (!/^\$/.test(xkey)) { continue; }
            xRE1 = new RegExp(xkey.replace(/\$/, "\\$") + "\\b"); yRE1 = new RegExp("\\\\(" + xkey.replace(/\$/, "\\$") + ")\\b");
            xRE2 = new RegExp("{" + xkey.replace(/\$/, "\\$") + "}"); yRE2 = new RegExp("{{" + xkey.replace(/\$/, "\\$") + "}}");
            if (xRE2.test(AValue) && !yRE2.test(AValue)) { AValue = AValue.replace(xRE2, daa.variables[xkey]); }
            if (xRE1.test(AValue) && !yRE1.test(AValue)) { AValue = AValue.replace(xRE1, daa.variables[xkey]); }
            if (yRE1.test(AValue)) { AValue = AValue.replace(yRE1, "$1"); }
            if (!/\$/.test(AValue)) { break; }
         }
         return AValue;
      };

   };

   // **************************************************************************
   //
   //                            CLASS PATTERN
   //
   // **************************************************************************

   // **************************************************************************
   // @class Pattern daa.pattern

   this.pattern = new function () {
      this.path = "daa";
      this.name = "pattern";
      this.classname = "Pattern";

      function Validate(AExpr) {
         AExpr = AExpr.replace(/([{\(])[\s]*?([&\|\^\+\-\*\/=!\?])/g, "$1 0 $2")
                      .replace(/([&\|\^\+\-\*\/=!\?])[\s]*?([}\)])/g, "$1 0 $2")
                      .replace(/([&\|\^\+\-\*\/=!\?])[\s]+?([&\|\^\+\-\*\/=!\?])/g, "$1 0 $2");
         return AExpr;
      }

      function EvalExpr(AExpr, AObj) {
         var xVal = undefined, xDefault = "";
         if (/\?/.test(AExpr)) { xDefault = AExpr.replace(/^[\s\S]*?\?/, ""); AExpr = AExpr.replace(/\?[\s\S]*$/, ""); }
         if (/\"|'/.test(AExpr)) { xVal = AExpr.replace(/[\"']/g, ""); }
         else {
            if (!daa.IsEnum(AObj)) { if (AExpr == "value") { xVal = AObj; } }
            else {
               if (xVal == undefined && AExpr in AObj) { xVal = AObj[AExpr]; }
               if (xVal == undefined) { xVal = daa.o.Get(AExpr, AObj, undefined); }
               if (xVal == undefined && AObj != _Model) { xVal = daa.o.Get(AExpr, null, undefined); }
            }
         }
         if (xVal == undefined || daa.IsEmptyString(xVal)) { xVal = xDefault; }
         return xVal;
      }

       // ***
       // @method daa.pattern.Fill

      this.Fill = function(APattern, AObj) {
         if (!AObj) { AObj = _Model; }
         if (APattern == AObj) { if (daa.Conf.isdesigning) { return APattern; } else { return APattern.replace(/%[\s\S]*?%/g, "").replace(/{{[\s\S]*?}}/g, ""); } }
         var xPat = String(APattern).replace(/\\\%/g, "#DAA_PRC#");
         xPat = daa.variable.Fill(xPat);

          // Replace keys
         var xArr = xPat.match(/%[\s\S]*?%/g) || [];
         var xKey = "", xVal = "", yKey = "";
         for (var xi = 0; xi < xArr.length; xi++) {
            xVal = undefined;
            xKey = xArr[xi].replace(/%/g, "");
             // Get possible object key or conditional expressions
             // f.e. %path/to/object[path/to/key]%, %path/to/object[path/to/key?default]%, %[path/to/value?default]%
            if (/\[/.test(xKey)) {
               yKey = EvalExpr(xKey.replace(/^[\s\S]*?\[/, "").replace(/\][\s\S]*$/, ""), AObj); xKey = xKey.replace(/\[[\s\S]*$/, "");
               if (!xKey) { xVal = yKey; }  // For %[some/path?default]% exprs
            }
            if (xVal == undefined) {
                // Get Value
               if (!daa.IsEnum(AObj)) { if (xKey == "value") { xVal = AObj; } }
               else {
                  if (xVal == undefined && xKey in AObj) { xVal = AObj[xKey]; }
                  if (xVal == undefined) { xVal = daa.o.Get(xKey, AObj, undefined); }
                  if (xVal == undefined && AObj != _Model) { xVal = daa.o.Get(xKey, null, undefined); }
               }
               if (xVal == undefined) { xVal = ""; }
                // Is Value is an object and we have yKey - get from this object
               if (daa.IsObject(xVal) && yKey) { xVal = xVal[yKey] || ""; }
            }
             // If xVal contains other masks - hide them from further replacement.
            if (/%|{{/.test(xVal)) { xVal = xVal.replace(/%/g, "#DAA_PRC#").replace(/{{/g, "#DAA_EXPA#").replace(/}}/g, "#DAA_EXPB#"); }
             // Finally, set the result to the pattern
            xPat = daa.Replace(new RegExp(xArr[xi].replace(daa.EscapeRE, "\\$1"), "g"), xPat, xVal);
         }

          // Eval expressions
         var xExprs = xPat.match(/{{[\s\S]*?}}/g) || [];
         var xVal;
         for (var xi = 0; xi < xExprs.length; xi++) {
            try {
               xVal = eval(Validate(xExprs[xi].replace(/%.*?%/g, "")).replace(/{{/, "").replace(/}}/, ""));
            } catch(errobj) {
               xVal = ""; daa.m.Error("daa:error:core:IllegalFormat:" + errobj.message);
            }
            xPat = daa.Replace(new RegExp(xExprs[xi].replace(daa.EscapeRE, "\\$1"), "g"), xPat, xVal);
         }
         return xPat.replace(/%.*?%/g, "").replace(/#DAA_PRC#/g, "%").replace(/#DAA_EXPA#/g, "{{").replace(/#DAA_EXPB#/g, "}}");
      };

       // ***
       // @method daa.pattern.FillObject

      this.FillObject = function(APatternObj, AObj) {
         var xObj = APatternObj;
         if (!daa.IsEnum(xObj)) { return this.Fill(xObj, AObj); }
         for (var xkey in xObj) {
            if (daa.IsEnum(xObj[xkey])) {
               this.FillObject(xObj[xkey], AObj);
            } else if (/%/.test(xObj[xkey])) {
               xObj[xkey] = this.Fill(xObj[xkey], AObj);
            }
         }
         return xObj;
      };
   };


   // **************************************************************************
   //
   //                            CLASS PATH
   //
   // **************************************************************************

   // **************************************************************************
   // @class Path daa.path

   this.path = new function() {
      this.path = "daa";
      this.name = "path";
      this.classname = "Path";

       // ***
       // @method daa.path.Concat

      this.Concat = function(APath) {
         var xPath = "";
         for (var xi = 0; xi < arguments.length; xi++) {
            arguments[xi] = String(arguments[xi]).replace(/\/$/, "");
            if (daa.IsEmptyString(arguments[xi])) { continue; }
            xPath ? xPath += "/" : xPath;
            xPath += arguments[xi];
         }
         return xPath;
      };

       // ***
       // @method daa.path.GetAppName

      this.GetAppName = function(APath) {
         APath = String(APath);
         if (APath.indexOf("/") < 0) { return APath; }
         return APath.substr(0, APath.indexOf("/"));
      };

       // ***
       // @method daa.path.SetAppName

      this.SetAppName = function(APath, BPath) {
         var xProj = this.GetAppName(BPath);
         if (this.GetAppName(APath) == xProj) { return APath; }
         APath = String(APath);
         if (APath.indexOf("/") < 0) { return xProj; }
         return this.Concat(xProj, APath.substr(APath.indexOf("/") + 1));
      };

       // ***
       // @method daa.path.GetPath

      this.GetPath = function(APath) {
         APath = String(APath);
         if (APath.indexOf("/") < 0) { return ""; }
         return APath.substr(0, APath.lastIndexOf("/"));
      };

       // ***
       // @method daa.path.GetName

      this.GetName = function(APath) {
         APath = String(APath);
         if (APath.indexOf("/") < 0) { return APath; }
         return APath.substr(APath.lastIndexOf("/") + 1);
      };

       // ***
       // @method daa.path.Split

      this.Split = function(APath) {
         return daa.csv.Split(APath, "/");
      };

       // ***
       // @method daa.path.Join

      this.Join = function(AObj) {
         return daa.csv.Join(AObj, "/", 1);
      };

   };
   this.p = this.path;


   // **************************************************************************
   //
   //                            CLASS ERROR
   //
   // **************************************************************************

   // Exceptions and Errors
   var errobj  = null;
   this.errobj = errobj;

   function Exception(AStr, ACaller) {
      this.name = "daa.Exception";
      this.message = AStr;
      this.value = AStr;
      this.caller = null;
      this.isdaaerror = 1;
      if (ACaller && (ACaller.name || ACaller.daa_name)) {
         var xName = ACaller.name || ACaller.daa_name;
         this.caller = xName.replace(/__/, "._").replace(/[^\.]_/g, ".");
      }
   }

   // **************************************************************************
   // @class Error daa.error

   this.error = new function() {
      this.path = "daa";
      this.name = "error";
      this.classname = "Error";

      function TranslateStdError(AObj, AFormat) {
         var xObj = {name: AObj.name, message: AObj.message, value: AObj.message};
         if ("stack" in AObj) { xObj.stack = AObj.stack; }
         if (AFormat == "string") { return xObj.name + ": " + xObj.message; }
         return xObj;
      };

      function TranslateDAAError(AObj, AFormat) {
         AObj.value = TranslateString(AObj.value);
         if (AFormat == "string") { return AObj.value; }
         return AObj;
      };

      function TranslateString(AObj) {
         // !Reset error handling style to avoid recursive calls to error system
         var xEHS = _Conf.errorhandlingstyle || "";
         _Conf.errorhandlingstyle = "";

         var xS = "";
         AObj = String(AObj);
         if (AObj.indexOf("daa:error:") >= 0) {
            if (AObj.indexOf("\n") >= 0) { AObj = AObj.split("\n"); }
            else { AObj = [AObj]; }
            for (var xi = 0; xi < AObj.length; xi++) {
               xS ? xS += "\n" : xS;
               xS += TranslateErrorCode(AObj[xi]);
            }
         }
         else {
            xS = AObj;
         }

         // Restore previous error handling style
         _Conf.errorhandlingstyle = xEHS;
         return xS;
      };

       // Translates error code to human readable format, localized

      function TranslateErrorCode(AObj) {
         AObj = String(AObj);
         if (AObj.indexOf("daa:error:") < 0) { return AObj; }
         AObj = AObj.split(":");
         var xMsg = daa.obj.Get(daa.p.Concat("base/errors", AObj[2], AObj[3]), null, "");
         var xMasks = xMsg.match(/\$[0-9]/g) || [];
         var xUserMsg = "";
         if (AObj.length > 4) {
            for (var xi = 4; xi < AObj.length; xi++) {
               if (xMasks.length) {
                  xMsg = daa.Replace(new RegExp("\\" + xMasks.shift()), xMsg, AObj[xi]);
               }
               else {
                  xUserMsg ? xUserMsg += ":" : xUserMsg;
                  xUserMsg += AObj[xi];
               }
            }
         }
         xUserMsg ? xMsg += ": " + xUserMsg : xUserMsg;
         return xMsg;
      };

       // ***
       // @method daa.error.Translate

      this.Translate = function(AObj, AFormat) {
         AFormat = AFormat || "string";
         if (AObj instanceof Error) {
            return TranslateStdError(AObj, AFormat);
         }
         if (typeof(AObj) == "object") {
            return TranslateDAAError(AObj, AFormat);
         }
         return TranslateString(AObj);
      };

       // ***
       // @method daa.error.GetMessageMethod

      this.GetMessageMethod = function() {
         var xEMM = _Conf.errormessagemethod || "";   // E[rror]M[essage]M[ethod]
         if (xEMM && xEMM != "console.log" && xEMM != "console.dir") {
            if (xEMM == this.Message || xEMM == "daa.error.Message") { return alert; }
            try {
               if (typeof(xEMM) == "function") { return xEMM; }
               else if (typeof(eval(xEMM)) == "function") { return eval(xEMM); }
               xEMM = "console.log";
            } catch(err) {
               xEMM = "console.log";
            }
         }
         if (xEMM == "console.log") { return function(arg) { console.log(arg) }; }
         if (xEMM == "console.dir") { return function(arg) { console.dir(arg) }; }
         return alert;
      };

       // ***
       // @method daa.error.Message

      this.Message = function(AObj) {
         var xMethod = this.GetMessageMethod();
         var xFormat; _Conf.errormessagemethod ? xFormat = "object" : xFormat = "string";
         xMethod(this.Translate(AObj, xFormat));
      };
   };

   // **************************************************************************
   //
   //                            CLASS METHOD
   //
   // **************************************************************************

   // **************************************************************************
   // @class Method daa.method

   this.method = new function() {
      this.path = "daa";
      this.name = "method";
      this.classname = "Method";

      function Call(AMethod, AObj) {
         AObj = AObj || {};
          // Parse method description string
         AMethod = AMethod.toString();
         if (AMethod.indexOf("(") > 0) {
            var xArgs = AMethod.replace(/^[\s\S]*\(\s*/, "").replace(/\s*\)\s*$/, "");
            AMethod = AMethod.replace(/^\s*/, "").replace(/\s*\([\s\S]*$/, "");
            eval("xArgs = " + xArgs);
            if (typeof(xArgs) == "object") {
               for (var xkey in xArgs) {
                  //if (xkey in AObj) { continue; }
                  AObj[xkey] = xArgs[xkey];
               }
            }
         }
         return eval(AMethod + "(AObj)");
      };

       // ***
       // @method daa.method.Call

      this.Call = function(AMethod, AObj) {
         if (typeof(AMethod) == "function") { return AMethod(AObj); }
         if (!AMethod || typeof(AMethod.toString) != "function") { return this.Escape(null, "daa:error:method:NoMethod:" + AMethod); }
         return Call(AMethod, AObj);
      };

      this.HandleErrors =    function(AStyle, AMethod) {
         if (typeof(AStyle) != "undefined") { _Conf.errorhandlingstyle = AStyle; }
         if (typeof(AMethod) != "undefined") { _Conf.errormessagemethod = AMethod; }
      };

       // ***
       // @method daa.method.Error

      this.Error = function(AError) {
         return this.Escape(null, AError);
      };

       // ***
       // @method daa.method.Escape

      this.Escape = function(ADefault, AError) {
         var xEHS = _Conf.errorhandlingstyle || "";       // E[rror]H[andling]S[tyle]
         if (xEHS) {
            if (xEHS == "exception") {
               throw new Exception(AError || "daa:error:core:Error", this.Escape.caller);
            }
            else if (xEHS == "message") {
               daa.error.Message(AError || "daa:error:core:Error");
               if (arguments.length) { return arguments[0]; } else { return null; }
            }
            else {
               return Call(xEHS, {default: ADefault, message: AError, caller: this.Escape.caller});
            }
         }
         else {
            if (arguments.length) { return arguments[0]; } else { return null; }
         }
      };

       // ***
       // @method daa.method.Args

       //  Event object:
       //  {
       //     name:     // name of the event
       //     node:     // node that has fired the event
       //     vn:       // view node - parent of 'node' or 'node' itself
       //     vnid:     // view node id
       //     vcid:     // view class id
       //  };

      // TODO daa.IsPath may cause a conflict with node IDs which ma contain '/'

      this.Args = function(AObj, AKeyword) {
         switch(AKeyword) {
            case "vd":
               // In: ?; Out: vd
                // Path to ViewData object
               if (daa.IsPath(AObj)) { AObj = daa.o.Get(AObj); }
                // node
               if (daa.IsNode(AObj)) {
                  if (AObj.vd) { return AObj.vd; }
                  else { return this.Agrs(daa.n.GetVN(AObj), AKeyword); }
               }
                // Event or ViewData object
               if (daa.IsObject(AObj)) {
                  if (AObj.isviewdata) { return AObj; }
                  if ((AObj.vn) && (AObj.vn.vd)) { return AObj.vn.vd; }
               }
               break;
            case "vcid":
               // In: ?; Out: vcid
                // path to viewdata object
               if (daa.IsPath(AObj)) { AObj = daa.o.Get(AObj); }
                // vcid itself
               else if (daa.IsString(AObj)) { return AObj; }
                // node
               if (daa.IsNode(AObj)) {
                  if (AObj.vcid) { return AObj.vcid; }
                  else { return this.Args(daa.n.GetVN(AObj), AKeyword); }
               }
                // event or viewdata object
               if (daa.IsObject(AObj)) {
                  if (AObj.vcid) { return AObj.vcid; }
                  if (AObj.isclass) { return AObj.name; }
                  if (AObj.vnid) { return this.Args(daa.n.Get(AObj.vnid), AKeyword); }
               }
               break;
            case "model":
               // In: [ object | path ]; Out: object
               if (daa.IsObject(AObj)) { return AObj; }
               if (daa.IsString(AObj)) { return daa.o.Get(AObj); }
               break;
            case "vn":
               if (daa.IsNode(AObj)) { return daa.n.GetVN(AObj); }
               if (daa.IsObject(AObj)) {
                  if (AObj.vn)   { return AObj.vn; }
                  if (AObj.vnid) { return daa.n.Get(AObj.vnid); }
               }
               break;
            case "node":
               // In: [ node | id | path/name | object]; Out: node
               if (daa.IsNode(AObj)) { return AObj; }
               if (daa.IsPath(AObj)) { AObj = daa.o.Get(AObj); }
               else if (daa.IsString(AObj)) { return daa.n.Get(AObj); }
               if (daa.IsObject(AObj)) {
                  if (AObj.node) { return AObj.node; }
                  else if (AObj.vd) { return this.Args(AObj.vd, AKeyword); }
                  else if (AObj.vnid) { return daa.n.Get(AObj.vnid); }
                  else if (AObj.vdpath) { return this.Args(AObj.vdpath, AKeyword); }
               }
               break;
         }
         return null;
      };

   };
   // Shorthands for method
   this.m = this.method;


   // **************************************************************************
   //
   //                            CLASS OBJECT
   //
   // **************************************************************************

   // **************************************************************************
   // @class Object daa.object

   this.object = new function() {
      this.path = "daa";
      this.name = "object";
      this.classname = "Object";

      // *
      // PROTECTED SECTION
      // *

      function New(AObj, APath, AName, AProto) {
         if (daa.IsFunction(AProto)) {
            AObj[AName]=new AProto;
            AObj[AName].path = APath;
            AObj[AName].name = AName;
         }
         else if (daa.IsArray(AProto)) {
            AObj[AName] = [];
            for (var xi = 0; xi < AProto.length; xi++) { AObj[AName].push(AProto[xi]); }
         }
         else {
            AObj[AName] = {};
            for (var key in AProto) {
               if (daa.IsObject(AProto[key]) && !daa.IsBrowserObject(AProto[key])) {
                  AObj[AName][key] = New(AObj[AName], daa.p.Concat(APath, AName), key, AProto[key]);
               } else { AObj[AName][key] = AProto[key]; }
            }
            if ("path" in AObj[AName]) { AObj[AName].path = APath; }
            if ("name" in AObj[AName]) { AObj[AName].name = AName; }
         }
         return AObj[AName];
      }

      function Explore(AArr, AObj, AProto, AIsEnsure) {
         var xPath = "";
         for (var xi = 0; xi < AArr.length; xi++) {
            if (!AArr[xi]) { continue; }
            //if (!(AArr[xi] in AObj)) {
            if (AObj[AArr[xi]] == null) {
               if (AProto && AIsEnsure) { New(AObj, xPath, AArr[xi], AProto); }
               else { return AProto; }
            }
            AObj = AObj[AArr[xi]];
            if (xPath != "") { xPath = xPath + "/"; }
            xPath = xPath + AArr[xi];
         }
         return AObj;
      }

      function Merge(AObj, BObj, AProto, APath, AIsOverride) {
         APath = APath || "";
         for (var xkey in BObj) {
            if (typeof(BObj[xkey]) == "object" && !daa.IsBrowserObject(BObj[xkey])) {
               if (!AObj[xkey] || !daa.IsObject(AObj[xkey])) { New(AObj, APath, xkey, AProto); }
               Merge(AObj[xkey], BObj[xkey], AProto, daa.p.Concat(APath, xkey), AIsOverride);
            }
            else if (!(xkey in AObj) || AIsOverride) { AObj[xkey] = BObj[xkey]; }
         }
         return AObj;
      }

      function SetPath(AObj, APath, AName) {
         if (typeof(AObj) != "object" || !("path" in AObj) || !AObj.name) { return AObj; }
         AObj.path = APath;
         if (AName) { AObj.name = AName; }
         var xPath = daa.p.Concat(APath, AObj.name);
         for (var xkey in AObj) {
            if (typeof(AObj[xkey]) != "object") { continue; }
            SetPath(AObj[xkey], xPath);
         }
         return AObj;
      }

      // *
      // PUBLIC SECTION
      // *

       // ***
       // @method daa.object.SetPath

      this.SetPath = function(AObj, APath, AName) {
         return SetPath(AObj, APath, AName);
      };

       // ***
       // @method daa.object.Get

      this.Get = function(APath, AObj, ADefault) {
         arguments.length < 3 ? ADefault = null : ADefault;
         return Explore(String(APath).split("/"), AObj || _Model, ADefault, 0);
      };

       // ***
       // @method daa.object.Set

      this.Set = function(APath, AValue, AObj) {
         if (!APath && AValue && "path" in AValue && "name" in AValue) { APath = daa.p.Concat(AValue.path, AValue.name); }
         if (!APath) { return daa.m.Escape({}, "daa:error:method:NoArg:APath"); }
         var xPN = {path: daa.p.GetPath(APath), name: daa.p.GetName(APath)};
         if (AValue || daa.IsZero(AValue)) { return this.Ensure(xPN.path, AObj)[xPN.name] = SetPath(AValue, xPN.path, xPN.name); }
         else { delete this.Ensure(xPN.path, AObj)[xPN.name]; return AValue; }
      };

       // ***
       // @method daa.object.Ensure

      this.Ensure = function(APath, AObj, AProto) {
         return Explore(String(APath).split("/"), AObj || _Model, AProto || {path: "", name: ""}, 1);
      };

       // ***
       // @method daa.object.Merge

      this.Merge = function(AObj, BObj, AIsOverride) {
         if (!AObj) { return {};   }
         if (!BObj) { return AObj; }
         AIsOverride = AIsOverride || 0;
         return Merge(AObj, BObj, {path: "", name: ""}, daa.p.Concat(AObj.path, AObj.name), AIsOverride);
      };

       // ***
       // @method daa.object.MergePlain

      this.MergePlain = function(AObj, BObj, AIsOverride) {
         if (!AObj) { return {};   }
         if (!BObj) { return AObj; }
         AIsOverride = AIsOverride || 0;
         return Merge(AObj, BObj, {}, "", AIsOverride);
      };

       // ***
       // @method daa.object.MergeCopy

      this.MergeCopy = function(AObj, BObj, AIsOverride) {
         if (!AObj) { return {};   }
         var xPath = daa.p.Concat(AObj.path, AObj.name);
         var xObj = Merge({}, AObj, {path: "", name: ""}, xPath);
         if (!BObj) { return xObj; }
         AIsOverride = AIsOverride || 0;
         return Merge(xObj, BObj, {}, {path: "", name: ""}, xPath, AIsOverride);
      };

       // ***
       // @method daa.object.Copy

      this.Copy = function(AObj) {
         if (!AObj) { return {}; }
         return Merge({}, AObj, {path: "", name: ""}, daa.p.Concat(AObj.path, AObj.name));
      };

       // ***
       // @method daa.object.Create

      this.Create = function(AProto, APath) {
         if (!AProto) { return {}; }
         APath = String(APath) || "model";
         return Merge({path: daa.p.GetPath(APath), name: daa.p.GetName(APath)}, AProto, {path: "", name: ""}, APath);
      };

       // ***
       // @method daa.object.Copy

       // ***
       // @method daa.object.CopyOne

      this.CopyOne = function(AObj) {
         if (!AObj) { return daa.m.Escape({}, "daa:error:method:NoArg:AObj"); }
         var xObj = {};
         for (var xkey in AObj) { xObj[xkey] = AObj[xkey]; }
         return xObj;
      };

       // *** @undocumented
       // @method daa.object.AddPrepare
       // @desc
       //    The pre- method for .Add, that is not implemented yet.

       // TODO Complete Add, Delete and Insert methods

      this.AddPrepare = function(AObj, AProto) {
         if (!AObj) { return AProto; }
         var xObj = {}; if (AObj.proto) { xObj = this.Copy(AObj.proto); }
         this.Merge(xObj, AProto, daa.IS_OVERRIDE);
         if (("vindex" in xObj) && (daa.vo)) { xObj.vindex = daa.vo.GetLastIndex(AObj) + 1; }
         return xObj;
      };

       // ***
       // @method daa.object.GetFirstKey

      this.GetFirstKey = function(AObj) {
         for (var xkey in AObj) { return xkey; } return "";
      };

       // ***
       // @method daa.object.GetLastKey

      this.GetLastKey = function(AObj) {
         var xkey = ""; for (var xkey in AObj) { } return xkey;
      };

       // ***
       // @method daa.object.ADD @groupname bitwise

      this.ADD = function(AObj, BObj, AIsRounded) {
         var xIsNum = daa.IsNumber(BObj);
         var xVal   = 0;
         for (var xkey in AObj) {
            if (!daa.IsNumber(AObj[xkey])) { continue; }
            xIsNum ? xVal = BObj : xVal = BObj[xkey] || 0;
            AObj[xkey] += xVal;
            if (AIsRounded) { AObj[xkey] = Math.round(AObj[xkey]); }
         }
         return AObj;
      };

       // ***
       // @method daa.object.SUB @groupname bitwise

      this.SUB = function(AObj, BObj, AIsRounded) {
         var xIsNum = daa.IsNumber(BObj);
         var xVal   = 0;
         for (var xkey in AObj) {
            if (!daa.IsNumber(AObj[xkey])) { continue; }
            xIsNum ? xVal = BObj : xVal = BObj[xkey] || 0;
            AObj[xkey] -= xVal;
            if (AIsRounded) { AObj[xkey] = Math.round(AObj[xkey]); }
         }
         return AObj;
      };

       // ***
       // @method daa.object.MUL @groupname bitwise

      this.MUL = function(AObj, BObj, AIsRounded) {
         var xIsNum = daa.IsNumber(BObj);
         var xVal   = 0;
         for (var xkey in AObj) {
            if (!daa.IsNumber(AObj[xkey])) { continue; }
            xIsNum ? xVal = BObj : xVal = BObj[xkey] || 0;
            AObj[xkey] = AObj[xkey] * xVal;
            if (AIsRounded) { AObj[xkey] = Math.round(AObj[xkey]); }
         }
         return AObj;
      };

       // ***
       // @method daa.object.DIV @groupname bitwise

      this.DIV = function(AObj, BObj, AIsRounded) {
         var xIsNum = daa.IsNumber(BObj);
         var xVal   = 0;
         for (var xkey in AObj) {
            if (!daa.IsNumber(AObj[xkey])) { continue; }
            xIsNum ? xVal = BObj : xVal = BObj[xkey] || 0;
            xVal   ? AObj[xkey] = AObj[xkey] / xVal : AObj[xkey] = 0;
            if (AIsRounded) { AObj[xkey] = Math.round(AObj[xkey]); }
         }
         return AObj;
      };

       // ***
       // @method daa.object.EQV @groupname bitwise

      function _EQVEnum(AObj, AValue) {
         for (var xkey in AObj) {
            if (!(xkey in AValue)) { return 0; }
            if (daa.IsEnum(AObj[xkey])) {
               if (!EQVEnum(AObj[xkey], AValue[xkey])) { return 0; }
            } else if (AObj[xkey] != AValue[xkey]) {
               return 0;
            }
         }
         return 1;
      }

      function EQVEnum(AObj, AValue) {
         if (daa.IsBrowserObject(AObj) || daa.IsBrowserObject(AValue)) {
            if (AObj == AValue) { return 1; } else { return 0; }
         }
         if (!_EQVEnum(AObj, AValue)) { return 0; }
         if (!_EQVEnum(AValue, AObj)) { return 0; }
         return 1;
      }

      this.EQV = function(AObj, AValue) {
         if (daa.IsEnum(AObj)) { return EQVEnum(AObj, AValue); }
         return Number(AObj == AValue);
      };

       // ***
       // @method daa.object.HAS @groupname bitwise

      this.HAS = function(AObj, AValue) {
         if (!daa.IsEnum(AObj)) { return Number(AObj == AValue); }
         if (!daa.IsEnum(AValue)) { return 0; }
         for (var xkey in AValue) {
            if (!(xkey in AObj)) { return 0; }
            if (AValue[xkey] == undefined || AValue[xkey] == "*") { continue; }
            if (AObj[xkey] != AValue[xkey]) { return 0; }
         }
         return 1;
      };

      // **************************************************************************
      // Pseudo SQL

       // ***
       // @method daa.object.Assign

      this.Assign = function(AObj, AValue) {
         AValue = AValue || {}; if (daa.IsString(AValue)) { AValue = daa.qs.Split(AValue.replace(/^ *set +?/, ""), ",", "=", daa.RET_TRIMMED); }
         var xVal = "";
         for (var xkey in AValue) {
            xVal = AValue[xkey];
            if (/%[\s\S]+?%/.test(xVal)) {
               try { xVal = daa.pattern.Fill(xVal, AObj); xVal = eval(xVal); }
               catch(errobj) { xVal = ""; daa.m.Error("daa:error:core:IllegalFormat:" + errobj.message); }
            }
            if ((xkey in AObj && daa.IsNumber(AObj[xkey])) || (daa.IsNumeric(xVal))) { xVal = Number(xVal); }
            AObj[xkey] = xVal;
         }
         return AObj;
      };

       // ***
       // @method daa.object.Update

      this.Update = function(AObj, AValue, AWhere) {
         AValue = AValue || {}; if (daa.IsString(AValue)) { AValue = daa.qs.Split(AValue.replace(/^ *set +?/, ""), ",", "=", daa.RET_TRIMMED); }
         AWhere = AWhere || "";
         var xIsWhere = daa.IsString(AWhere); if (xIsWhere) { AWhere = AWhere.replace(/^ *where */, ""); }
         for (var xkey in AObj) {
            if (xkey == "proto" || typeof(AObj[xkey]) != "object" || !AObj[xkey].isproto) { continue; }
            if (xIsWhere) { if (!daa.Condition(AWhere, AObj[xkey])) { continue; } }
            else { if (!this.HAS(AObj[xkey], AWhere)) { continue; } }
            this.Assign(AObj[xkey], AValue);
         }
         return AObj;
      };

       // ***
       // @method daa.object.Delete

      this.Delete = function(AObj, AWhere) {
         AWhere = AWhere || "";
         var xIsWhere = daa.IsString(AWhere); if (xIsWhere) { AWhere = AWhere.replace(/^ *where */, ""); }
         for (var xkey in AObj) {
            if (xkey == "proto" || typeof(AObj[xkey]) != "object" || !AObj[xkey].isproto) { continue; }
            if (xIsWhere) { if (!daa.Condition(AWhere, AObj[xkey])) { continue; } }
            else { if (!this.HAS(AObj[xkey], AWhere)) { continue; } }
            delete AObj[xkey];
         }
         return AObj;
      };

       // ***
       // @method daa.object.Select

      this.Select = function(AObj, AColumns, AWhere) {
         if (!AObj) { return null; }
         var xObj = {};
         var xCols = null;
         if (daa.IsString(AColumns) && daa.Trim(AColumns) != "*") { xCols = daa.csv.SplitAsKeys(AColumns); }
         else if (daa.IsObject(AColumns) && !daa.IsEmpty(AColumns)) { xCols = AColumns; }
         AWhere = AWhere || "";
         var xIsWhere = daa.IsString(AWhere); if (xIsWhere) { AWhere = AWhere.replace(/^ *where */, ""); }
         for (var xkey in AObj) {
            if (xkey == "proto" || typeof(AObj[xkey]) != "object" || !AObj[xkey].isproto) { continue; }
            if (xIsWhere) { if (!daa.Condition(AWhere, AObj[xkey])) { continue; } }
            else { if (!this.HAS(AObj[xkey], AWhere)) { continue; } }
            if (!xCols) { xObj[xkey] = AObj[xkey]; }
            else {
               xObj[xkey] = {};
               for (var ykey in xCols) {
                  if (!(ykey in AObj[xkey])) { continue; }
                  else { xObj[xkey][ykey] = AObj[xkey][ykey]; }
               }
            }
         }
         return xObj;
      };

      // **************************************************************************
      // Sort

      function _Sort(a,b,p){
         var m=1,l=-1;if(p.m){m=-1;l=1;}
         if(typeof(p.o[a][p.p])!="undefined"){a=p.o[a][p.p];}if(typeof(p.o[b][p.p])!="undefined"){b=p.o[b][p.p];}
         if ((typeof(a)!=typeof(b))){if(typeof(a)!="string"){a=a.toString();}if(typeof(b)!="string"){b=b.toString();}}
         if ((typeof(a)=="string")&&(typeof(b)=="string")){
            var xI=0;
            if(!a.length){return l;}else if(!b.length){return m;}
            while((xI<a.length)&&(xI<b.length)){
                if(a.charCodeAt(xI)<b.charCodeAt(xI)){return l;}
                else if(a.charCodeAt(xI)>b.charCodeAt(xI)){return m;}
                else{xI++;}
            }
            if(a.length<b.length){return l;}else if(a.length>b.length){return m;}else{return 0;}
         }else if((typeof(a)=="number")&&(typeof(b)=="number")){if(p.m){return b-a;}else{return a-b;}
         }else{return 0;}
      }

       // ***
       // @method daa.object.Sort

      this.Sort = function(AObj, AOpt) {
          // Validation
         !AOpt ? AOpt = {} : AOpt;
         daa.IsString(AOpt) ? AOpt = {sortby: AOpt} : AOpt;
         var xProps = daa.csv.Split(AOpt.sortby);
         if (!xProps.length || xProps[0] == "_key") { return SSort(AObj, AOpt); }
         if (xProps[0] == "_value") { var xObj = {}; for (var xkey in AObj) { xObj[xkey] = {_value: AObj[xkey]}; } AObj = xObj; }
         if (xProps[0] == "_unsorted") { xProps[0] = "path"; AOpt.isunsorted = 1; }

          // Initialization
         var xArr = [], xDirs = [];
   
          // Remember sort directions for each property and remove directions
          // from properties names
         for (var xkey in xProps) {
            (/ desc/.test(xProps[xkey]) || AOpt.order == "desc") ? xDirs[xkey] = 1 : xDirs[xkey] = 0;
            xProps[xkey] = xProps[xkey].replace(/ desc/, "").replace(/ asc/, "");
         }

           // Processing
         var xDo;
         for (var xkey in AObj) {
            if ((xkey == "proto") || (!AObj[xkey]) || (typeof(AObj[xkey]) != "object")) { continue; }
            xDo = 1;
            for (var ykey in xProps) {
               if (!(xProps[ykey] in AObj[xkey])) { xDo = 0; break; }
            }
            if (xDo) { xArr.push(xkey); }
         }
         if (AOpt.isunsorted) { return xArr; }
         return MSort(AObj, xArr, xProps, xDirs, 0, xProps.length);
      };
   
      function SSort(AObj, AOpt) {
         var x=[];
         for (var k in AObj) {
            if (!AOpt.issystemkeys && (/^(path|name|proto|lastid|lastids)$/.test(k) || /^is[a-z]+$/.test(k))) { continue; }
            x.push(k);
         }
         if(AOpt.isunsorted){return x;}
         x.sort();
         if(AOpt.order == "desc"){return x.reverse();}
         else{return x;}
      }
   
      function MSort(AObj, AArr, AProps, ADirs, ALevel, ACount) {
         if (!AProps[ALevel]) { return AArr; }
         AArr.sort(function(AA, AB) {
            return _Sort(AA, AB, {"o": AObj, "p": AProps[ALevel], "m": ADirs[ALevel]});
         });
         if (ALevel >= ACount - 1) { return AArr; }
         var w="";
         var xVal = "", xPrevVal = "", xArr = [], yArr = [];
         for (var xkey in AArr) {
            xVal = AObj[AArr[xkey]][AProps[ALevel]];
            if (xVal != xPrevVal) {
              if (xArr.length>1) {
                 xArr = MSort(AObj, xArr, AProps, ADirs, ALevel + 1, ACount);
              }
              for (var ykey in xArr) {
                 yArr.push(xArr[ykey]);
              }
              xArr = [AArr[xkey]];
              xPrevVal = xVal;
            } else {
               xArr.push(AArr[xkey]);
            }
         }
         if (xArr.length > 1) {
            xArr = MSort(AObj, xArr, AProps, ADirs, ALevel + 1, ACount);
         }
         for (var xkey in xArr) { yArr.push(xArr[xkey]); }
         return yArr;
      }

       // ***
       // @method daa.object.Iterate

      this.Iterate = function(AObj, AModel, ACBGroup, ACBItem) {
         if (!AModel) { return; }
         !("level" in AObj) ? AObj.level = 0 : AObj.level++;
         var xOpt = {};
         AObj.sortby ? xOpt.sortby = AObj.sortby : xOpt.isunsorted = 1;
         AObj.issystemkeys ? xOpt.issystemkeys = AObj.issystemkeys : xOpt;
         AObj.sort  = daa.o.Sort(AModel, xOpt);
         AObj.tree  = {};
         AObj.index = 0;
         AObj.count = 0;
         if (AObj.layout && daa.vo && !AObj.sortl) { daa.vo.IterateLayoutPrepare(AObj, AModel); }

         var xItem, xIsObject, xFlt, xPath = daa.p.Concat(AModel.path, AModel.name);
         var xLen = AObj.sort.length;
         for (var index = 0; index < xLen; index++) {
             // Name of the model item
            AObj.key            = AObj.sort[index];
             // Model item itself, a simple value or an object
            xItem               = AModel[AObj.key];
            xIsObject           = Number(daa.IsObject(xItem) && !daa.IsBrowserObject(xItem));
             // Create tree item, that shows tree info of the item.
             // Unlike in .vo, tree item is totally virtual for .o
             //    - path:    global daa-path to the item
             //    - name:    name of the item
             //    - vindex:  number of the iteration, i.e. position number of the item in the model
             //    - vcount:  = 0 for simple values, = 1 for objects. It isn't a real count, only a flag! N
             //                  Name 'vcount' is for compatibility with .vo
             //    - vlevel:  deepness level of the item in the iterated objects tree, see @arguments
             //    - vparent: name of the model, if exists
             // xTreeItem = AObj.tree[AObj.key] - analogous .vo code
            AObj.tree[AObj.key] = {path: xPath, name: AObj.key, vindex: index, vcount: xIsObject, vlevel: AObj.level, vparent: AModel.name || ""};
            AObj.treeitem = AObj.tree[AObj.key];
             // Filter
            if (AObj.filter && !daa.Condition(AObj.filter, AObj.treeitem)) { continue; }
             // Call Item method
            if (ACBItem) { ACBItem.call(this, AObj, xItem); AObj.count++; }
             // Call Group method
            if (ACBGroup && xIsObject) { ACBGroup.call(this, AObj, xItem); continue; }
            if (AObj.canceliteration || (AObj.limit && AObj.count >= AObj.limit)) { break; }
         }
      };
   };
   // Shorthands for object
   this.obj = this.object;
   this.o = this.object;


   // **************************************************************************
   //
   //                            CLASS VOBJECT
   //
   // **************************************************************************

   // **************************************************************************
   // @class VObject daa.vobject

   this.vobject = new function() {
      this.path = "daa";
      this.name = "vobject";
      this.classname = "VObject";

      this.IterateLayoutPrepare = function(AObj, AModel) {
         if (!AModel) { return; }
         AObj.sortl = daa.o.Sort(AObj.layout, "vindex");
         AObj.layout = daa.o.Merge({path: AModel.path, name: AModel.name}, AObj.layout);
      };

       // ***
       // @method daa.vobject.IterateLayout

      this.IterateLayout = function(AObj, AModel, ACBGroup, ACBItem) {
         AObj.sort  = AObj.sortl;
         AObj.tree  = AObj.layout;
         AObj.index = 0;
         AObj.count = 0;
         return daa.vo.Iterate.call(this, AObj, AModel, ACBGroup, ACBItem);
      };

       // ***
       // @method daa.vobject.Iterate

      this.Iterate = function(AObj, AModel, ACBGroup, ACBItem) {
         if (!AModel) { return; }
         var xModel = AModel;
         if (!AObj.sort) {
            if (AModel.isvtree && !("vindex" in AModel.proto) && "vparent" in AModel.proto) { xModel = daa.vo.MakeTree(AModel, AObj.sortby || "name"); }
            AObj.sort  = daa.o.Sort(xModel, (AModel.isvtree && "vindex") || AObj.sortby || "name");
            AObj.tree  = xModel; // this might be not the model, but a tree made by daa.vo.MakeTree
                                 // this also might be a layout
            AObj.index = 0;
            AObj.count = 0;
            if ((AObj.layout) && (!AObj.sortl)) { daa.vo.IterateLayoutPrepare(AObj, AModel); }
         }
         var xItem, xTreeItem, index, xkey, xLevel = -1, xPath = daa.p.Concat(AModel.path, AModel.name);
         var xLen = AObj.sort.length;
         while (AObj.index < xLen) {
             // Name of the model item OR layout item
            AObj.key  = AObj.sort[AObj.index];
             // Model item itself, a simple value or an object. It might be a simpe value
             //    in the layout iteration mode only.
             //    IMPORTANT: Replace leading "_" because layouts might want to reference
             //    to 'path', 'name' or other names, that originally are the format required
             //    props of layout vtree object itself, so, layout builders add "_" at the
             //    beginning of such layout items keys.
             //    Special names are '_key' and '_value', that reference to key and value of
             //    an item directly.
             AObj.sort == AObj.sortl ? xkey = AObj.key.replace(/^_/, "") : xkey = AObj.key;
             xItem = AModel[xkey];
             // Tree item OR layout item
             //    We take it from .tree because the model item can be either a simple value or
             //    an object of the simple vtree style.
             //    IMPORTANT: But NOT make "_" replacement here, unlike the above, since if
             //    .tree is the layout - appropriate layout items are referenced by keys with "_"
            xTreeItem      = AObj.tree[AObj.key];
            xTreeItem.name = xkey;
            AObj.treeitem  = xTreeItem;

             // If we are in the layout iteration mode - set special path and name for a tree item
            if (AObj.sortl && AObj.sort == AObj.sortl) {
               xTreeItem.path = xPath; if (AObj.key == "_key" || AObj.key == "_value") { xTreeItem.name = ""; }
            }

             // Determine initial level, might be on any real depth of the vtree
            if (xLevel == -1) { xLevel = xTreeItem.vlevel; }

             // If we are in the deeper vlevel than started from - call Group method
            if (xTreeItem.vlevel > xLevel) {
               if (ACBGroup) {
                  index = AObj.index;
                  ACBGroup.call(this, AObj, AModel);
                   // Protect from infinite recursion
                  if (AObj.index <= index) { alert("ERROR: An infinite recursion in daa.vo.Iterate, called from " + daa.vo.Iterate.caller.daa_name); break; }
                  continue;
               }
            }
             // If we are in the higher vlevel than started from - stop iteartion
            else if (xTreeItem.vlevel < xLevel) { break; }

            if (AObj.filter && !daa.Condition(AObj.filter, AObj.treeitem)) { AObj.index++; continue; }

             // Call item method
            if (ACBItem) { ACBItem.call(this, AObj, xItem); AObj.count++; }
            AObj.index++;
            if (AObj.canceliteration || (AObj.limit && AObj.count >= AObj.limit)) { break; }
         }
      };

      // ***********************************************************************
      // Make ComplexVTree of SimpleVTree

      function CountPItem(AObj, AName) {
         AObj[AName].vcount++;
         if (AObj[AName].vparent) { return CountPItem(AObj, AObj[AName].vparent) + 1; } else { return 1; }
      }

      function MakePItem(AObj, AName) {
         for (var xkey in AObj) {
            if (AObj[xkey].vparent != AName) { continue; }
            AObj[xkey].vindex = AObj[AName].last; AObj[xkey].last = AObj[xkey].vindex + 1;
            AObj[AName].last = AObj[xkey].vindex + AObj[xkey].vcount + 1;
            MakePItem(AObj, xkey);
         }
      }

       // *** @undocumented
       // @method daa.vobject.MakeTree

      this.MakeTree = function(AObj, ASort) {
         var xObj = {}, xItem = "";
          // We need to sort previously, for we're about to set strong unique vindexes to each item,
          // so that it couldn'd be sorted anymore by additional fields, if it's desired somehow.
         ASort = daa.csv.NOT(ASort, "vindex,vlevel,vcount") || "_unsorted";
         var xArr = daa.o.Sort(AObj, ASort); var xkey = "";
          // Make the general reference object first and set all vindexes to '-1',
          // to signalize that the item isn't yet positioned.
         for (var xi = 0; xi < xArr.length; xi++) {
            xkey = xArr[xi];
            xItem = AObj[xkey];
            if (!xObj[xkey]) { xObj[xkey] = {path: xItem.path, name: xkey, vindex: -1, vlevel: 0, vcount: 0, vparent: "", last: 0}; }
            if (xItem.vparent && AObj[xItem.vparent]) { xObj[xkey].vparent = xItem.vparent; }
         }
          // Count all the children wherever.
         for (var xkey in xObj) {
            if (!xObj[xkey].vparent) { continue; }
            xObj[xkey].vlevel = CountPItem(xObj, xObj[xkey].vparent);
         }
          // Finally, set vindexes, starting from the topmost parents.
         var xLast = 0;
         for (var xkey in xObj) {
            if (xObj[xkey].vparent) { continue; }
            xObj[xkey].vindex = xLast; xObj[xkey].last = xLast + 1;
            xLast = xObj[xkey].vindex + xObj[xkey].vcount + 1;
            MakePItem(xObj, xkey);
         }
         return xObj;
      };

      // ***********************************************************************
      // VO Add/Insert/Delete/Move

      function UpdateVCount(AObj, AName, ACount) {
         if (!AObj[AName]) { return; }
         AObj[AName].vcount += ACount;
         AObj[AName].vparent ? UpdateVCount(AObj, AObj[AName].vparent, ACount) : ACount;
      }

      function EnterVOItems(AObj, AItem, BItem, APosition, AIsEx) {
         var x = {obj: null, pid: ""};
         var xPath = daa.p.Concat(AObj.path, AObj.name);
         if (AItem) {
            daa.IsString(AItem) ? (AObj[AItem] && AIsEx) ? x.obj = AObj[AItem] : x.obj = daa.o.Merge({path: xPath, name: AItem}, AObj.proto) :
            daa.IsVItem(AItem) ? x.obj = AItem : x;
         }
         x.obj ? x.obj : x.obj = daa.o.Copy(AObj.proto);
         x.obj.path != xPath ? daa.o.SetPath(x.obj, xPath) : x.obj;
         if (BItem) {
            daa.IsString(BItem) ? x.pid = BItem :
            daa.IsVItem(BItem) ? x.pid = BItem.name : x;
         }
         (x.pid && daa.IsVItem(AObj[x.pid])) ? x.pid : x.pid = "";
         (x.pid != x.obj.name) ? x.pid : x.pid = "";
         if (x.pid && "vparent" in x.obj && !AObj[x.obj.name]) {
            APosition ? x.obj.vparent = AObj[x.pid].vparent || "" : x.obj.vparent = x.pid;
         }
         return x;
      }

       // ***
       // @method daa.vobject.Add
   
       // TODO Remove or revalidate daa.o.AddPrepare

      this.Add = function(AObj, AItem, BItem) {
         if (!daa.IsVObject(AObj)) { return null; }
         var xRef = EnterVOItems(AObj, AItem, BItem);
         if (AObj[xRef.obj.name]) { this.Delete(AObj, xRef.obj.name); }
         if (!("vindex" in AObj.proto)) { AObj[xRef.obj.name] = xRef.obj; return xRef.obj; }
         xRef.index = this.GetLastIndex(AObj, xRef.pid);
         if (xRef.pid) {
            UpdateVCount(AObj, xRef.pid, 1);
            daa.o.Update(AObj, {vindex: "%vindex% + 1"}, "this/vindex > " + xRef.index);
         }
         xRef.obj.vindex = xRef.index + 1;
         xRef.obj.vlevel = (xRef.pid && (AObj[xRef.pid].vlevel + 1)) || 0;
         AObj[xRef.obj.name] = xRef.obj;
         return xRef.obj;
      };

       // ***
       // @method daa.vobject.Insert
   
      this.Insert = function(AObj, AItem, BItem, APosition) {
         if (!daa.IsVObject(AObj)) { return null; }
         if (!APosition) { APosition = "c"; }
         if (APosition == "c") { return this.Add(AObj, AItem, BItem); }
         else { APosition = daa.String(APosition).replace(/t/, "l").replace(/b/, "r"); }
         var xRef = EnterVOItems(AObj, AItem, BItem, APosition);
         if (AObj[xRef.obj.name]) { this.Delete(AObj, xRef.obj.name); }
         if (!xRef.pid) { return this.Add(AObj, AItem); }
         if (!("vindex" in AObj.proto)) { AObj[xRef.obj.name] = xRef.obj; return xRef.obj; }
         if (APosition == "l") {
            xRef.index = AObj[xRef.pid].vindex - 1;
         } else {
            xRef.index = AObj[xRef.pid].vindex + AObj[xRef.pid].vcount;
         }
         xRef.obj.vindex = xRef.index + 1;
         xRef.obj.vlevel = AObj[xRef.pid].vlevel;
         UpdateVCount(AObj, xRef.obj.vparent, 1);
         daa.o.Update(AObj, {vindex: "%vindex% + 1"}, "this/vindex > " + xRef.index);
         AObj[xRef.obj.name] = xRef.obj;
         return xRef.obj;
      };

       // ***
       // @method daa.vobject.Delete

      function DeleteSimple(AObj, AName) {
         for (var xkey in AObj) {
            if (xkey == "proto" || typeof(AObj[xkey]) != "object" || !AObj[xkey].isproto) { continue; }
            if (AObj[xkey].vparent == AName) { DeleteSimple(AObj, xkey); }
         }
         delete AObj[AName];
      }
   
      this.Delete = function(AObj, AItem) {
         if (!daa.IsVObject(AObj)) { return null; }
         var xRef = EnterVOItems(AObj, AItem, null, "", 1); if (!AObj[xRef.obj.name]) { return null; }
         if (!("vindex" in AObj.proto)) { DeleteSimple(AObj, xRef.obj.name); return xRef.obj; }
         UpdateVCount(AObj, xRef.obj.vparent, 0 - (1 + xRef.obj.vcount));
         daa.o.Delete(AObj, "this/vindex >= " + xRef.obj.vindex + " && this/vindex < " + (xRef.obj.vindex + xRef.obj.vcount + 1));
         daa.o.Update(AObj, {vindex: "%vindex% - " + (xRef.obj.vcount + 1)}, "this/vindex > " + xRef.obj.vindex);
         return xRef.obj;
      };

       // ***
       // @method daa.vobject.Move
   
      function IsWithin(AObj, AName, BName) {
         if (!AObj[AName] || !AObj[AName].vparent) { return 0; }
         if (AObj[AName].vparent == BName) { return 1; }
         else { return IsWithin(AObj, AObj[AName].vparent, BName); }
      }

      this.Move = function(AObj, AItem, BItem, APosition) {
         if (!daa.IsVObject(AObj)) { return null; }
         var xRef = EnterVOItems(AObj, AItem, BItem, "", 1); if (!xRef || !AObj[xRef.obj.name]) { return null; }
         if (!APosition) { APosition = "c"; }
         APosition = daa.String(APosition).replace(/t/, "l").replace(/b/, "r");
         if (!xRef.pid) { APosition = "c"; }
         if (!("vindex" in AObj.proto)) {
            if (IsWithin(AObj, xRef.pid, xRef.obj.name)) { return null; }
            APosition == "c" ? AObj[xRef.obj.name].vparent = xRef.pid : AObj[xRef.obj.name].vparent = AObj[xRef.pid].vparent;
            return xRef.obj;
         }
         if (xRef.pid && AObj[xRef.pid].vindex >= xRef.obj.vindex && AObj[xRef.pid].vindex <= xRef.obj.vindex + xRef.obj.vcount) { return null; }
         xRef.index = xRef.obj.vindex;
         xRef.lastindex = this.GetLastIndex(AObj);
         xRef.previndex = xRef.lastindex + xRef.obj.vcount + 1;
         xRef.prevlevel = xRef.obj.vlevel;
          // Move the source branch to the end of the tree
         daa.o.Update(AObj, {vindex: "%vindex% + " + xRef.previndex}, "this/vindex >= " + xRef.obj.vindex + " && this/vindex < " + (xRef.obj.vindex + xRef.obj.vcount + 1));
          // Remove it from parents counts
         UpdateVCount(AObj, xRef.obj.vparent, 0 - (xRef.obj.vcount + 1));
          // Move down items below
         daa.o.Update(AObj, {vindex: "%vindex% - " + (xRef.obj.vcount + 1)}, "this/vindex > " + xRef.index + " && this/vindex < " + xRef.previndex);
          // Setup source item to the destination place
         xRef.previndex = xRef.obj.vindex;
         if (APosition == "l") {
            xRef.index = (xRef.pid && AObj[xRef.pid].vindex - 1) || 0;
         } else {
            xRef.index = (xRef.pid && (AObj[xRef.pid].vindex + AObj[xRef.pid].vcount)) || (xRef.lastindex - xRef.obj.vcount - 1);
         }
         if (APosition == "c") {
            xRef.level = (xRef.pid && AObj[xRef.pid].vlevel + 1) || 0;
            xRef.obj.vparent = xRef.pid;
         } else {
            xRef.level = (xRef.pid && AObj[xRef.pid].vlevel) || 0;
            xRef.obj.vparent = (xRef.pid && AObj[xRef.pid].vparent) || "";
         }
          // Set the source branch to the new parent
         UpdateVCount(AObj, xRef.obj.vparent, xRef.obj.vcount + 1);
          // Move Down items below
         daa.o.Update(AObj, {vindex: "%vindex% + " + (xRef.obj.vcount + 1)}, "this/vindex > " + xRef.index + " && this/vindex < " + xRef.previndex);
          // Move the source items to the right place
         daa.o.Update(AObj, {vindex: "%vindex% - " + (xRef.previndex - (xRef.index + 1)),
                             vlevel: "%vlevel% - " + (xRef.prevlevel - xRef.level)},
                             "this/vindex >= " + xRef.previndex);
         return xRef.obj;
      };

       // *** @undocumented
       // @method daa.vobject.GetRoot
       // @desc
       //    Returns the root item of daa-vtree object

      this.GetRoot = function(AObj) {
         for (var xkey in AObj) {
            if (xkey == "proto" || typeof(AObj[xkey]) != "object" || !AObj[xkey].isproto) { continue; }
            if (!AObj[xkey].vparent) { return AObj[xkey]; }
         }
         return null;
      };

       // ***
       // @method daa.vobject.GetLastIndex

       // TODO Must revalidate while making .Add, .Delete and .Insert methods.

      this.GetLastIndex = function(AObj, AItem) {
         if (!daa.IsVObject(AObj) || !("vindex" in AObj.proto)) { return -1; }
         var xIndex = -1;
         var xID = "", xLevel = 0;
         if (AItem) { daa.IsObject(AItem) ? xID = AItem.name : daa.IsString(AItem) ? xID = AItem : xID = ""; }
         if (xID && (!AObj[xID] || !daa.IsVItem(AObj[xID]))) { xID = ""; }
         if (xID) { return AObj[xID].vindex + AObj[xID].vcount; }
         for (var xkey in AObj) {
            if (xkey == "proto" || !AObj[xkey].isproto) { continue; }
            xIndex < AObj[xkey].vindex ? xIndex = AObj[xkey].vindex : xIndex;
         }
         return xIndex;
      };

       // ***
       // @method daa.vobject.Count

      this.Count = function(AObj) {
         var xCount = 0;
         for (var xkey in AObj) {
            if (xkey == "proto" || typeof(AObj[xkey]) != "object" || !AObj[xkey].isproto || !("path" in AObj[xkey]) || !AObj[xkey].name) { continue; }
            xCount++;
         }
         return xCount;
      };

       // ***
       // @method daa.vobject.IsEmpty

      this.IsEmpty = function(AObj) {
         return Number(this.Count(AObj) == 0);
      };

   };
   // Shorthands for vobject
   this.vobj = this.vobject;
   this.vo = this.vobject;


   // **************************************************************************
   //
   //                            CLASS NODE
   //
   // **************************************************************************

   // **************************************************************************
   // @class Node daa.node

   this.node = new function() {
      this.path = "daa";
      this.name = "node";
      this.classname = "Node";

      this.properties = {
         offsetleft:        1,
         offsettop:         1,
         isdesigning:       1
      };

      this.TempProps = {
         modelpath:         1,
         editorid:          1,
         expandedid:        1,

         isitems:           1,
         isitem:            1,

         lastid:            1,
         left:              1,
         modelindex:        1,
         openerid:          1,
         prevdisplay:       1,
         prevselectedstyle: 1,
         prevselectedclass: 1,
         selectedid:        1,
         startx:            1,
         starty:            1,
         top:               1,
         vlevel:            1
      };

       // Floating View Table
       // CreateFromTemplate gathers FVs appended to .body to clear
       // them if views are refilled and their parents lost.

      var FVT = {};

       // ***
       // @method daa.node.SetProps

      this.SetProps = function(ANode, AObj) {
         ANode.vd = AObj;
         if (AObj.mvnid) { ANode.mvnid = AObj.mvnid; }
         if (AObj.pvnid) { ANode.pvnid = AObj.pvnid; }
         for (var xkey in this.properties) {
            if (xkey in AObj) { ANode["daa_" + xkey] = AObj[xkey]; }
         }
      };

       // ***
       // @method daa.node.GetProps

      this.GetProps = function(ANode) {
         var xObj = {};
         for (var xkey in this.properties) {
            if ("daa_" + xkey in ANode) { xObj[xkey] = ANode["daa_" + xkey]; }
         }
         return xObj;
      };

       // ***
       // @method daa.node.ResolvePath

      this.ResolvePath = function(ANode, APath) {
         if (!ANode) { return APath; }
         if (/^this/.test(APath)) {
            var xParVN = this.GetUpper(ANode.parentNode, {daa_modelpath: "*"});
            if (xParVN && xParVN.daa_modelpath) { APath = APath.replace(/^this/, xParVN.daa_modelpath); }
         }
         if (/^self/.test(APath) && ANode.vd) { APath = APath.replace(/^self/, daa.p.Concat(ANode.vd.path, ANode.vd.name)); }
         return APath;
      };


      // ***********************************************************************
      // UI

       // ***
       // @method daa.node.AddClassName @groupname ui

      this.AddClassName = function(ANode, AName) {
         ANode ? ANode.className = daa.csv.OR(ANode.className, AName, " ") : ANode;
      };
      this.AddCN = this.AddClassName;

       // ***
       // @method daa.node.DeleteClassName @groupname ui

      this.DeleteClassName = function(ANode, AName) {
         ANode ? ANode.className = daa.csv.NOT(ANode.className, AName, " ") : ANode;
      };
      this.DeleteCN = this.DeleteClassName;

       // ***
       // @method daa.node.ReplaceClassName @groupname ui

      this.ReplaceClassName = function(ANode, AName, BName) {
         ANode ? ANode.className = daa.csv.OR(daa.csv.NOT(ANode.className, AName, " "), BName, " ") : ANode;
      };
      this.ReplaceCN = this.ReplaceClassName;

       // ***
       // @method daa.node.Show @groupname ui

      this.Show = function(ANode) {
         if (!ANode) { return; }
         this.DeleteClassName(ANode, "hidden");
      };

       // ***
       // @method daa.node.Hide @groupname ui

      this.Hide = function(ANode) {
         if (!ANode) { return; }
         this.AddClassName(ANode, "hidden");
      };

       // ***
       // @method daa.node.ShowHide @groupname ui

      this.ShowHide = function(ANode) {
         var xDisp = daa.n.GetStyle(ANode, "display");
         if (xDisp == "none") { this.Show(ANode); }
         else                 { this.Hide(ANode); }
      };

       // ***
       // @method daa.node.Select @groupname ui

      this.Select = function(ANode, AVN) {
         AVN = AVN || this.GetParentVN(ANode); if (!AVN) { return; }
         if (AVN.daa_selectedid) {
            if (AVN.daa_selectedid == ANode.id) { return; }
            this.Unselect(this.Get(AVN.daa_selectedid), AVN);
         }
         ANode.daa_prevstyle = daa.css.GetProps(ANode, "color, backgroundColor");
         if (daa.css.IsRule("itemselected")) { this.ReplaceClassName(ANode, "itemgreyed", "itemselected"); }
         else { daa.css.SetProps(ANode, {color: "white", backgroundColor: "#4466AA"}); }
         ANode.daa_isselected = 1;
         AVN.daa_selectedid = ANode.id;
      };

       // ***
       // @method daa.node.Unselect @groupname ui

      this.Unselect = function(ANode, AVN) {
         if (!ANode || !ANode.daa_isselected) { return; }
         AVN = AVN || this.GetParentVN(ANode); if (!AVN) { return; }
         if (daa.css.IsRule("itemselected")) { this.DeleteClassName(ANode, "itemselected itemgreyed"); }
         else { daa.css.SetProps(ANode, ANode.daa_prevstyle || {color: "black", backgroundColor: "transparent"}); }
         ANode.daa_isselected = 0;
         AVN.daa_selectedid = "";
      };

       // ***
       // @method daa.node.Grey @groupname ui

      this.Grey = function(ANode) {
         if (!ANode || !ANode.daa_isselected) { return; }
         ANode.daa_prevselstyle = daa.css.GetProps(ANode, "color, backgroundColor");
         if (daa.css.IsRule("itemgreyed")) { this.ReplaceClassName(ANode, "itemselected", "itemgreyed"); }
         else { daa.css.SetProps(ANode, {color: "white", backgroundColor: "#bbb"}); }
         ANode.daa_isgreyed = 1;
      };

       // ***
       // @method daa.node.Ungrey @groupname ui

      this.Ungrey = function(ANode) {
         if (!ANode || !ANode.daa_isselected) { return; }
         if (daa.css.IsRule("itemgreyed")) { this.ReplaceClassName(ANode, "itemgreyed", "itemselected"); }
         else { daa.css.SetProps(ANode, ANode.daa_prevselstyle || {color: "white", backgroundColor: "#4466AA"}); }
         ANode.daa_isgreyed = 0;
      };

       // ***
       // @method daa.node.SelectUnselect @groupname ui

      this.SelectUnselect = function(ANode, AVN) {
         AVN = AVN || this.GetParentVN(ANode); if (!AVN) { return; }
         if (ANode.daa_isselected) { this.Unselect(ANode, AVN); }
         else                      { this.Select(ANode, AVN); }
      };

      // ***********************************************************************
      // Checkers

       // ***
       // @method daa.node.IsIn @groupname check

      this.IsIn = function(ANode, BNode) {
         if (!ANode || !ANode.parentNode)               { return 0; }  // No node OR no parentNode - not in
         BNode = daa.m.Args(BNode, "node"); if (!BNode) { return 0; }  // No node supposed to be a parent - not in
         if (ANode == BNode)                            { return 0; }  // Cannot be within itself
         ANode = ANode.parentNode;
         while (ANode) {
            if (ANode == BNode) { return 1; }
            ANode = ANode.parentNode;
         }
         return 0;
      };

       // ***
       // @method daa.node.IsSibling @groupname check

      this.IsSibling = function(ANode, BNode) {
         if (ANode.parentNode == BNode.parentNode) { return 1; }
         return 0;
      };

       // ***
       // @method daa.node.IsVisible @groupname check

      this.IsVisible = function(ANode) {
         while (ANode && ANode != document.body && ANode != document.documentElement) {
            if (this.GetStyle(ANode, "display") == "none" || this.GetStyle(ANode, "visibility") == "collapse") { return 0; }
            ANode = ANode.parentNode;
         }
         if (!ANode) { return 0; }
         return 1;
      };

      // ***********************************************************************
      // Getters

       // ***
       // @method daa.node.Get @groupname nav

      this.Get = function(AID) {
         if (!AID) { return null; }
         return document.getElementById(AID) || null;
      };

       // ***
       // @method daa.node.GetUpper @groupname nav

      this.GetUpper = function(ANode, AObj, AStopProp) {
         if (!ANode || !AObj) { return null; }
         var xWhere = ""; if (daa.IsString(AObj)) { xWhere = AObj.replace(/^[\s\S]*?where[\s]*?/i, ""); }
         while (ANode) {
            if      (xWhere  && daa.Condition(xWhere, ANode)) { return ANode; }
            else if (!xWhere && daa.o.HAS(ANode, AObj))       { return ANode; }
            if (AStopProp && AStopProp in ANode) { break; }
            ANode = ANode.parentNode;
         }
         return null;
      };

       // ***
       // @method daa.node.GetLower @groupname nav

      function GetLower(ANode, AObj, AWhere, AStopProp) {
         var xNodes = ANode.childNodes || [];
         var xNode  = null;
          // First we're looking for a node among nearest level
         for (var xi = 0; xi < xNodes.length; xi++) {
            if (AStopProp && AStopProp in xNodes[xi]) { break; }
            if      (AWhere  && daa.Condition(AWhere, xNodes[xi])) { return xNodes[xi]; }
            else if (!AWhere && daa.o.HAS(xNodes[xi], AObj))       { return xNodes[xi]; }
            xNode = GetLower(xNodes[xi], AObj, AWhere, AStopProp); if (xNode) { return xNode; }
         }
         return null;
      }

      this.GetLower = function(ANode, AObj, AStopProp) {
         if (!ANode || !AObj) { return null; }
         if (AStopProp && AStopProp in ANode) { return null; }
         var xWhere = ""; if (daa.IsString(AObj)) { xWhere = AObj.replace(/^[\s\S]*?where[\s]*?/i, ""); }
         if      (xWhere  && daa.Condition(xWhere, ANode)) { return ANode; }
         else if (!xWhere && daa.o.HAS(ANode, AObj))       { return ANode; }
         return GetLower(ANode, AObj, xWhere, AStopProp);
      };

       // ***
       // @method daa.node.GetUpperByTagName @groupname nav

      this.GetUpperByTagName = function(ANode, AValue) {
         return this.GetUpper(ANode, {tagName: String(AValue).toUpperCase()});
      };

       // ***
       // @method daa.node.GetLowerByTagName @groupname nav

      this.GetLowerByTagName = function(ANode, AValue) {
         return this.GetLower(ANode, {tagName: String(AValue).toUpperCase()});
      };

       // ***
       // @method daa.node.GetItemNode @groupname nav

      this.GetItemNode = function(ANode, AProp) {
         AProp = AProp || "daa_isitem";
         var xObj = {}; xObj[AProp] = undefined;
         var xNode = null; //this.GetLower(ANode, xObj, "vcid");   // 2016_01_15 Decided to exclude lower search
         if (!xNode) {
            xNode = this.GetUpper(ANode, xObj, "vcid");
         }
         return xNode;
      };
      this.GetIN = this.GetItemNode;

       // ***
       // @method daa.node.GetViewNode @groupname nav

      this.GetViewNode = function(ANode, AProp) {
         AProp = AProp || "parentNode";
         while (ANode) {
            if (ANode.vcid) { return ANode; }
            if (ANode.pvnid && AProp == "parentNode") { return this.Get(ANode.pvnid); }
            ANode = ANode[AProp];
         }
         return null;
      };
      this.GetVN = this.GetViewNode;

       // ***
       // @method daa.node.GetParentViewNode @groupname nav

      this.GetParentViewNode = function(ANode) {
         return this.GetVN(ANode.parentNode || null);
      };
      this.GetParentVN = this.GetParentViewNode;

       // ***
       // @method daa.node.GetMasterViewNode @groupname nav

      this.GetMasterViewNode = function(ANode) {
         while (ANode) {
            if (ANode.mvnid) { return this.Get(ANode.mvnid) || this.GetUpper(ANode, {id: ANode.mvnid}); }
            if (ANode.pvnid) { xVN = this.GetMasterViewNode(this.Get(ANode.pvnid)); }
            ANode = ANode.parentNode;
         }
         return null;
      };
      this.GetMasterVN = this.GetMasterViewNode;

       // ***
       // @method daa.node.GetPrevViewNode @groupname nav

      this.GetPrevViewNode = function(ANode) {
         return this.GetVN(ANode.previousSibling || null, "previousSibling");
      };
      this.GetPrevVN = this.GetPrevViewNode;

       // ***
       // @method daa.node.GetNextViewNode @groupname nav

      this.GetNextViewNode = function(ANode) {
         return this.GetVN(ANode.nextSibling, "nextSibling");
      };
      this.GetNextVN = this.GetNextViewNode;

       // ***
       // @method daa.node.GetFirstViewNode @groupname nav

      this.GetFirstViewNode = function(ANode) {
         return this.GetVN(ANode.firstChild, "nextSibling");
      };
      this.GetFirstVN = this.GetFirstViewNode;

       // ***
       // @method daa.node.GetLastViewNode @groupname nav

      this.GetLastViewNode = function(ANode) {
         return this.GetVN(ANode.lastChild, "previousSibling");
      };
      this.GetLastVN = this.GetLastViewNode;

       // ***
       // @method daa.node.GetViewNodeHierarchy @groupname nav

      this.GetViewNodeHierarchy = function(ANode) {
         var xH = {};
         while (ANode) {
            if ((ANode.id) && (ANode.vcid)) { xH[ANode.id] = ANode; }
            ANode = ANode.parentNode;
         }
         return xH;
      };
      this.GetVNHierarchy = this.GetViewNodeHierarchy;

       // ***
       // @method daa.node.GetViewNodeChain @groupname nav

      this.GetViewNodeChain = function(ANode, AProp) {
         var xObj = {};
         var xCheck = ",";
         while (ANode && ANode.id && AProp) {
             // Infinite 'while' protection
            if (xCheck.indexOf("," + ANode.id + ",") >= 0) { break; } xCheck += ANode.id + ",";
             // Add node ID
            xObj[ANode.id] = 1;
            ANode = (ANode[AProp] && this.Get(ANode[AProp])) || null;
         }
         return xObj;
      };
      this.GetVNChain = this.GetViewNodeChain;

      // ***********************************************************************
      // Move/Clone

       // *** @undocumented
       // @method daa.node.CloneProperties

      this.CloneProperties = function(ANode, BNode) {
         if (ANode.vcid)  { BNode.vcid = ANode.vcid; }
         if (ANode.pvcid) { BNode.pvcid = ANode.pvcid; }
         if (ANode.mvcid) { BNode.mvcid = ANode.mvcid; }
         for (var xkey in ANode) {
            if (/^daa_/.test(xkey)) { BNode[xkey] = ANode[xkey]; }
         }
         var xNodes = ANode.childNodes || [];
         var yNode  = null;
          // First we're looking for a node among nearest level
         for (var xi = 0; xi < xNodes.length; xi++) {
            yNode = BNode.childNodes[xi] || null; if (!yNode) { continue; }
            this.CloneProperties(xNodes[xi], yNode);
         }
      };

       // ***
       // @method daa.node.Clone

      function AddID(ANode, AID) {
         if (ANode.id) { ANode.id += AID; }
         var xNodes = ANode.childNodes;
         for (var xi = 0; xi < xNodes.length; xi++) { AddID(xNodes[xi], AID); }
         return ANode;
      };

      this.Clone = function(ANode, ASuffix) {
         if (!ANode) { return null; }
         ASuffix = ASuffix || "_clone";
         var xClone = ANode.cloneNode(1);
         this.CloneProperties(ANode, xClone);
         xClone.daa_isclone = 1;
         if (xClone.daa_islostownership && daa.View(xClone).RegainOwnership) {
            xClone = daa.View(xClone).RegainOwnership(xClone);
            xClone.daa_islostownership = 0;
         }
         AddID(xClone, ASuffix);
         return xClone;
      };

       // ***
       // @method daa.node.Move

      this.Move = function(ANode, BNode) {
         if (!ANode) { return null; }
         if (!BNode || !BNode.childNodes.length) { return ANode; }
         var xNodes = BNode.childNodes, xNode = null;
         for (var xi = 0; xi < xNodes.length; xi++) {
            xNode = xNodes[xi];
            if (xNode == ANode) { continue; }
            if (ANode.vcid) { daa.View(ANode).AddNode(xNode); }
            else { ANode.appendChild(xNode); }
            if (xNode != xNodes[xi]) { xi--; }
         }
         return ANode;
      };

      // ***********************************************************************
      // Extents

      this.GetPageScroll = function(AName) {
         if (/right|bottom/i.test(AName)) { return 0; }
         var xVal = 0 + (document.documentElement["scroll" + AName] || (document.body && document.body["scroll" + AName]) || 0);
         if (/left|top/i.test(AName)) { xVal -= document.documentElement["client" + AName] || 0; }
         return xVal;
      };

       // *** @undocumented
       // @method daa.node.GetScrollSum

      this.GetScrollSum = function(ANode, BNode, AName) {
         if (ANode == BNode) { return 0; }
         var xValue = 0;
         ANode = ANode.parentNode;
         while (ANode) {
            xValue += ANode["scroll" + AName] || 0;
            if (ANode == BNode) { break; }
            ANode = ANode.parentNode;
         }
         if (ANode != BNode) { xValue = 0; }   // 2016_01_12 try to return 0 if ANode isn't inside BNode
         return xValue;
      };

       // ***
       // @method daa.node.GetXY @groupname extent

      this.GetXY = function(ANode, BNode, AIsRelative) {
         var xR_RND = daa.RET_ROUNDED;
         var xRect = {left: 0, top: 0, right: 0, bottom: 0};
         if (!ANode || !ANode.getBoundingClientRect) { return xRect; }
         BNode = BNode || "";
         AIsRelative = AIsRelative || daa.REL_NONE;
         var yRect = null;

         var xNode = document.body || document.documentElement;
         if      (daa.IsNode(BNode)) { xNode = BNode; }
         else if (BNode) {
            if (BNode == "parent") { xNode = (this.GetStyle(ANode, "position") != "absolute" && ANode.parentNode) || ANode.offsetParent; }
            else { xNode = this.Get(BNode); }
         }

         var xScrollLeft = 0;
         var xScrollTop  = 0;
         if (xNode) {
            if (xNode == ANode) { return xRect; }
            xScrollLeft = 0 + (AIsRelative == daa.REL_NONE && this.GetScrollSum(ANode, xNode, "Left")) - (AIsRelative == daa.REL_CLIENT && this.GetPageScroll("Left"));
            xScrollTop  = 0 + (AIsRelative == daa.REL_NONE && this.GetScrollSum(ANode, xNode, "Top"))  - (AIsRelative == daa.REL_CLIENT && this.GetPageScroll("Top"));
            xRect = xNode.getBoundingClientRect();
            xRect = {
               left:   xRect.left   + this.GetStyle(xNode, "borderLeftWidth",   xR_RND) - xScrollLeft,
               top:    xRect.top    + this.GetStyle(xNode, "borderTopWidth",    xR_RND) - xScrollTop,
               right:  xRect.right  - this.GetStyle(xNode, "borderRightWidth",  xR_RND) - xScrollLeft,
               bottom: xRect.bottom - this.GetStyle(xNode, "borderBottomWidth", xR_RND) - xScrollTop
            };
         }

         yRect = ANode.getBoundingClientRect();
         yRect = {
            left:   Math.round(               (yRect.left   - this.GetStyle(ANode, "marginLeft",   xR_RND)) - xRect.left),
            top:    Math.round(               (yRect.top    - this.GetStyle(ANode, "marginTop",    xR_RND)) - xRect.top),
            right:  Math.round(xRect.right  - (yRect.right  + this.GetStyle(ANode, "marginRight",  xR_RND))),
            bottom: Math.round(xRect.bottom - (yRect.bottom + this.GetStyle(ANode, "marginBottom", xR_RND)))
         };

         return yRect;
      };

      function CreateTester() {
         var xNode = document.createElement("div");
         xNode.id = "daa_tester";
         xNode.vcid = "view";
         xNode.style.position = "absolute";
         xNode.style.position = "absolute";
         document.body.appendChild(xNode);
         return xNode;
      };

       // ***
       // @method daa.node.TestXY @groupname extent

      this.TestXY = function(ANode, BNode, AIsRelative) {
         xNode = document.body || document.documentElement;
         if      (daa.IsNode(BNode)) { xNode = BNode; }
         else if (BNode) {
            if (BNode == "parent") { xNode = (this.GetStyle(ANode, "position") != "absolute" && ANode.parentNode) || ANode.offsetParent; }
            else { xNode = this.Get(BNode); }
         }
          // Return default GetXY if ANode is visible OR ANode doesn't belong to BNode
         if (this.IsVisible(ANode) || !this.IsIn(ANode, xNode)) { return this.GetXY(ANode, xNode, AIsRelative); }
         var xTester = this.Get("daa_tester") || CreateTester();
          // Save previous DOM structure pointers
         var xParent = xNode.parentNode;
         var xNext   = xNode.nextSibling;
          // Get XY
         xTester.appendChild(xNode);
         var xXY = this.GetXY(ANode, xNode, AIsRelative);
          // Restore previous DOM structure
         if (xParent) {
            if (xNext) { xParent.insertBefore(xNode, xNext); }
            else       { xParent.appendChild(xNode); }
         } else { xTester.removeChild(xNode); }
         return xXY;
      };

      var XYNames = {left: "Left", top: "Top", right: "Right", bottom: "Bottom"};
      this.XYNames = XYNames;

       // ***
       // @method daa.node.GetXYOrigin @groupname extent

      this.GetXYOrigin = function(ANode, AOpt) {
         var xR_RND = daa.RET_ROUNDED;
         var xRect = {left: 0, top: 0, right: 0, bottom: 0};
         if (!ANode) { return xRect; }
         AOpt = String(AOpt) || "bm";
         for (var xkey in xRect) {
            if (/m/.test(AOpt)) { xRect[xkey] += this.GetStyle(ANode, "margin"  + XYNames[xkey], xR_RND); }
            if (/b/.test(AOpt)) { xRect[xkey] += this.GetStyle(ANode, "border"  + XYNames[xkey] + "Width", xR_RND); }
            if (/p/.test(AOpt)) { xRect[xkey] += this.GetStyle(ANode, "padding" + XYNames[xkey], xR_RND); }
         }
         return xRect;
      };

       // ***
       // @method daa.node.GetXYRelativeOffset @groupname extent

      this.GetXYRelativeOffset = function(ANode) {
         var xR_RND = daa.RET_ROUNDED;
         var xRect = {left: 0, top: 0, right: 0, bottom: 0};
         var xXY = null, xWH  = null;
         var xParent = ANode.parentNode; if (!xParent) { return xRect; }
         var xSib = ANode.previousSibling;
         while (xSib) {
            if (this.GetStyle(xSib, "position") != "absolute") {
               xXY = this.GetXY(xSib, xParent);
               xWH = this.GetWH(xSib, "ipbm");
               if (/flex/i.test(this.GetStyle(xParent, "display")) && /row/i.test(this.GetStyle(xParent, "flexDirection"))) {
                  xWH.height = 0;
               } else { xWH.width = 0; }
               xRect.left = xXY.left + xWH.width  - this.GetStyle(xParent, "paddingLeft", xR_RND);
               xRect.top  = xXY.top  + xWH.height - this.GetStyle(xParent, "paddingTop",  xR_RND);
               break;
            }
            xSib = xSib.previousSibling;
         }
         var xSib = ANode.nextSibling;
         while (xSib) {
            if (this.GetStyle(xSib, "position") != "absolute") {
               xXY = this.GetXY(xSib, xParent);
               xRect.right  = xXY.left - this.GetStyle(xParent, "paddingLeft", xR_RND);
               xRect.bottom = xXY.top  - this.GetStyle(xParent, "paddingTop",  xR_RND);
               break;
            }
            xSib = xSib.nextSibling;
         }
         return xRect;
      };

       // ***
       // @method daa.node.GetStyle @groupname extent

      this.GetStyle = function(ANode, AKey, AFormat) {
         var xVal = daa.css.GetProp(ANode, AKey);
         if (AFormat) {
            if (/%/.test(xVal) && ANode.parentNode) {
               var yVal = this.GetStyle(ANode.parentNode, AKey, AFormat);
               xVal = Math.round((Number(xVal.replace(/%/g, "")) * yVal) / 100);
            }
            if (/px/.test(xVal)) { xVal = xVal.replace(/px/g, ""); }
            daa.IsNumeric(xVal) ? xVal = Number(xVal) : xVal = 0;
            AFormat == daa.RET_ROUNDED ? xVal = Math.round(xVal) : xVal;
         }
         return xVal;
      };

      var WHNames = {
         "width":  ["Left", "Right",  "Width"],
         "height": ["Top",  "Bottom", "Height"]
      };

      this.GetClientExtent = function(AName) {
         if (!/width|height/i.test(AName)) { return 0; }
         var xName = WHNames[AName][2];
         return window["inner" + xName] || document.documentElement["client" + xName] || (document.body && document.body["client" + xName]);
      };

      this.GetPageExtent = function(AName, AOpt) {
         var xR_RND = daa.RET_ROUNDED;
         var xNode = document.body || document.documentElement;
         AOpt ? AOpt = String(AOpt) : AOpt = "i";
         if (/o/.test(AOpt)) { AOpt = "pbm"; }
         var xValue = (/width|height/i.test(AName) && daa.n.GetPageScroll(WHNames[AName][2])) || 0;
         var xName = WHNames[AName][0];
         var xO = {
            p: this.GetStyle(xNode, "padding" + xName, xR_RND),
            b: this.GetStyle(xNode, "border"  + xName + "Width", xR_RND),
            m: this.GetStyle(xNode, "margin"  + xName, xR_RND)
         };
         if (!/i/.test(AOpt)) { xValue -= xValue - xO.p - xO.b - xO.m;  }
         if (!/p/.test(AOpt)) { xValue -= xO.p; }
         if (!/b/.test(AOpt)) { xValue -= xO.b; }
         if (!/m/.test(AOpt)) { xValue -= xO.m; }
         return xValue;
      };

       // ***
       // @method daa.node.GetScroll @groupname extent

      this.GetScroll = function(ANode, AName) {
         AName = AName.replace(/left$/, "Left").replace(/top$/, "Top").replace(/width$/, "Width").replace(/height$/, "Height");
         if (ANode == document.body) { return ANode[AName] || document.documentElement[AName] || 0; }
         return ANode[AName] || 0;
      };

       // ***
       // @method daa.node.GetExtent @groupname extent

      this.GetExtent = function(ANode, AName, AOpt) {
         if (/left|top|right|bottom/.test(AName)) { var xObj = this.GetXY(ANode); return xObj[AName] || 0; }
         var xR_RND = daa.RET_ROUNDED;
         if (ANode == window)        { return this.GetClientExtent(AName); }
         if (ANode == document.body) { return this.GetPageExtent(AName, AOpt); }
         AOpt ? AOpt = String(AOpt) : AOpt = "i";
         var xIsBB = (this.GetStyle(ANode, "boxSizing") == "border-box");
         if (/o/.test(AOpt)) { xIsBB  ? AOpt = "m" : AOpt = "pbm"; }
         else if (xIsBB) { AOpt = AOpt.replace(/p|b/g, ""); }
         var xValue = 0;
         var xNameL = WHNames[AName][0], xNameR = WHNames[AName][1];
         if (/i/.test(AOpt)) { xValue += this.GetStyle(ANode, AName, xR_RND); }
         if (/p/.test(AOpt)) { xValue += this.GetStyle(ANode, "padding" + xNameL, xR_RND) +           this.GetStyle(ANode, "padding" + xNameR, xR_RND); }
         if (/b/.test(AOpt)) { xValue += this.GetStyle(ANode, "border"  + xNameL + "Width", xR_RND) + this.GetStyle(ANode, "border"  + xNameR + "Width", xR_RND); }
         if (/m/.test(AOpt)) { xValue += this.GetStyle(ANode, "margin"  + xNameL, xR_RND) +           this.GetStyle(ANode, "margin"  + xNameR, xR_RND); }
         return xValue;
      };

       // ***
       // @method daa.node.GetExtents @groupname extent

      this.GetExtents = function(ANode, AOpt) {
         AOpt ? AOpt = String(AOpt) : AOpt = "i";
         var xXYOpt = ""; var xWHOpt = "";
         if      (/,/.test(AOpt)) {
            xXYOpt = AOpt.replace(/,[\s\S]*?$/, "").replace(/^[\s]+|[\s]+$/g, "");
            xWHOpt = AOpt.replace(/^[\s\S]*?,/, "").replace(/^[\s]+|[\s]+$/g, "");
         }
         else { xWHOpt = AOpt; }
         return daa.o.Merge(this.GetXY(ANode, xXYOpt), this.GetWH(ANode, xWHOpt));
      };

       // ***
       // @method daa.node.GetWidthHeight @groupname extent

      this.GetWidthHeight = function(ANode, AOpt) {
         return {width: this.GetExtent(ANode, "width", AOpt), height: this.GetExtent(ANode, "height", AOpt)};
      };
      this.GetWH = this.GetWidthHeight;

       // ***
       // @method daa.node.GetWidth @groupname extent

      this.GetWidth = function(ANode, AOpt) { return this.GetExtent(ANode, "width", AOpt); };
      this.GetW = this.GetWidth;

       // ***
       // @method daa.node.GetHeight @groupname extent

      this.GetHeight = function(ANode,AOpt) { return this.GetExtent(ANode, "height", AOpt); };
      this.GetH = this.GetHeight;

       // ***
       // @method daa.node.SetScroll @groupname extent

      this.SetScroll = function(ANode, AName, AValue) {
         AName = AName.replace(/left$/, "Left").replace(/top$/, "Top").replace(/width$/, "Width").replace(/height$/, "Height");
         ANode[AName] = AValue;
         if (ANode == document.body) { document.documentElement[AName] = AValue; }
      };

       // ***
       // @method daa.node.SetExtent @groupname extent

      this.SetExtent = function(ANode, AName, AValue) {
         if (daa.IsEmptyString(AValue)) { ANode.style[AName] = "auto"; return; }
         if (/width|height/.test(AName)) { ANode.style[AName] = (AValue - this.GetExtent(ANode, AName, "o")) + "px"; }
         else { ANode.style[AName] = AValue + "px"; }
      };

       // ***
       // @method daa.node.SetExtents @groupname extent

      this.SetExtents = function(ANode, AValue) {
         for (var xkey in AValue) {
            this.SetExtent(ANode, xkey, AValue[xkey]);
         }
      };

       // ***
       // @method daa.node.SetWidthHeight @groupname extent

      this.SetWidthHeight = function(ANode, AValue) {
         this.SetExtent(ANode, "width",  AValue.width);
         this.SetExtent(ANode, "height", AValue.height);
      };
      this.SetWH = this.SetWidthHeight;

       // ***
       // @method daa.node.SetWidth @groupname extent

      this.SetWidth = function(ANode, AValue) {
         this.SetExtent(ANode, "width", AValue);
      };
      this.SetW = this.SetWidth;

       // ***
       // @method daa.node.SetHeight @groupname extent

      this.SetHeight = function(ANode, AValue) {
         this.SetExtent(ANode, "height", AValue);
      };
      this.SetH = this.SetHeight;

       // ***
       // @method daa.node.SaveExtents @groupname extent

      this.SaveExtents = function(ANode, AOpt) {
         var xExt = this.GetExtents(ANode, AOpt);
         var xIsVis = this.IsVisible(ANode);
         for (var xkey in xExt) {
            if (!daa.css.IsSet(ANode, xkey)) { continue; }
            (!xIsVis && !xExt[xkey]) ? xExt[xkey] = this.GetStyle(ANode, xkey, daa.RET_ROUNDED) : xExt;
            ANode["daa_prev" + xkey] = xExt[xkey];
         }
      };

       // ***
       // @method daa.node.RestoreExtents @groupname extent

      this.RestoreExtents = function(ANode) {
         var xObj = {left: 1, top: 1, right: 1, bottom: 1, width: 1, height: 1};
         for (var xkey in xObj) {
            if (!("daa_prev" + xkey in ANode)) { ANode.style[xkey] = ""; continue; }
            this.SetExtent(ANode, xkey, ANode["daa_prev" + xkey]);
         }
      };

       // TODO display and visibility might be defined by a css class and should be set and reset back as a class somehow

       // ***
       // @method daa.node.TestWidthHeight @groupname extent

      this.TestWidthHeight = function(ANode, AOpt) {
         if (this.IsVisible(ANode) && this.IsIn(ANode, document.body)) { return this.GetWH(ANode, AOpt); }
         var xTester = this.Get("daa_tester") || CreateTester();
          // Save previous DOM structure pointers and visibility
         var xParent = ANode.parentNode;
         var xNext   = ANode.nextSibling;
         var xDisp   = this.GetStyle(ANode, "display");     if (xDisp != "none")     { xDisp = ""; }
         var xVisi   = this.GetStyle(ANode, "visibility");  if (xVisi != "collapse") { xVisi = ""; }
          // Get WH
         xTester.appendChild(ANode);
         if (xDisp) { ANode.style.display    = "block";   }
         if (xVisi) { ANode.style.visibility = "visible"; }
         var xWH = this.GetWH(ANode, AOpt);
          // Restore previous DOM structure
         if (xVisi) { daa.css.SetProp(ANode, "visibility", xVisi); }
         if (xDisp) { daa.css.SetProp(ANode, "display", xDisp); }
         if (xParent) {
            if (xNext) { xParent.insertBefore(ANode, xNext); }
            else       { xParent.appendChild(ANode); }
         } else { xTester.removeChild(BNode); }
         return xWH;
      };
      this.TestWH = this.TestWidthHeight;

      // ***********************************************************************
      // Templates

      this.GetTemplate = function(AInst, AObj, AName) {
         if (AObj && AObj.vd && AObj.vd.templates && AObj.vd.templates[AName]) { return AObj.vd.templates[AName]; }
         else if (AInst.templates && AInst.templates[AName]) { return AInst.templates[AName]; }
         else { return ""; }
      };

       // ***
       // @method daa.node.TemplateReplace

      this.TemplateReplace = function(AValue, AExpr) {
         var xObj = daa.qs.Split(AExpr, ";", "=", daa.RET_TRIMMED);
         for (var xkey in xObj) {
            AValue = daa.Replace(new RegExp(xkey.replace(daa.EscapeRE, "\\$1")), AValue, xObj[xkey]);
         }
         return AValue;
      };

       // ***
       // @method daa.node.ExtractFromTemplate

      this.ExtractFromTemplate = function(AObj, AExpr, AIsValue) {
         if (daa.IsNode(AObj)) { AObj = AObj.outerHTML; }
         var xTrail = "";
          // Remove spaces and cr-lf
         AExpr = AExpr.replace(daa.EscapeRE, "\\$1");
         AObj  = String(AObj).replace(/^[\s]+|[\s]+$/g, "").replace(/>[\s]+</g, "><");
         if (AIsValue & daa.RET_VALUE) {
            AObj = AObj.replace(new RegExp("^.+?\\b" + AExpr + " *= *"), ""); if (!/^('|\")/.test(AObj)) { return ""; }
            AObj = AObj.replace(/{{[\s\S]*?}}/g, function(a){return a.replace(/'/g, "#Q" + daa.Chr(1) + "#").replace(/\"/g, "#Q" + daa.Chr(2) + "#")});
            return AObj.replace(/^'/, "").replace(/'.*/, "").replace(new RegExp("#Q" + daa.Chr(1) + "#", "g"), "'").replace(new RegExp("#Q" + daa.Chr(2) + "#", "g"), "\"");
         } else {
             // Match leading tags, included target - that contains attr AExpr
            xTrail = AObj.replace(new RegExp(AExpr + "(=| |>).*"), "").match(/<[a-z]+/g) || [];
             // Build trailing tags pattern
            xTrail = xTrail.reverse().join(">").replace(/</g, "</");
            if (xTrail) { AObj = AObj.replace(new RegExp(xTrail + ">"), "").replace(new RegExp("^.+?" + AExpr + "((=| )[^>]*>|>)"), ""); }
            return AObj;
         }
      };

       // *** @undocumented
       // @method daa.node.SetPropsFromTemplate

       this.SetPropsFromTemplate = function(ANode) {
          if (!ANode || !ANode.outerHTML) { return; }
           // Match daa_ properties defined in node's HTML
          var xProps = ANode.outerHTML.replace(/>[\s\S]*/, ">").match(/daa_[A-Za-z0-9_]+=['\"][^'\"]*['\"][^ >]*/g) || [];
          var xName = "", xValue = "";
          for (var xi = 0; xi < xProps.length; xi++) {
             var xName = xProps[xi].replace(/=.*$/, "");
             var xValue = xProps[xi].replace(/^.*=['\"]|['\"]$/g, ""); if (!xValue && !daa.IsNumeric(xValue)) { xValue = 1; }
             if (daa.IsNumeric(xValue)) { xValue = Number(xValue); }
             xName = xName.replace(/daa_vcid/, "vcid").replace(/daa_pvnid/, "pvnid").replace(/daa_mvnid/, "mvnid");
             ANode[xName] = xValue;
          }
           // Set children props
          var xNodes = ANode.childNodes;
          for (var xi = 0; xi < xNodes.length; xi++) { this.SetPropsFromTemplate(xNodes[xi]); }
       };

       // ***
       // @method daa.node.CreateFromTemplate

      this.CreateFromTemplate = function(ATemplate, AParent) {
          // Determine TagName
         var xTagName = ATemplate.replace(/^\s*</, "").replace(/[\s|>][\s\S]*$/, "") || "div";
         ATemplate = ATemplate.replace(/\r/g, "");
   
          // Create the node from html code. Operation with a kinda non-intuitive behavior!
         var xNode = document.createElement(xTagName);  // Node must be created first and then reassigned.
         AParent.appendChild(xNode);         // outerHTML cannot be assigned to a node without .parentNode.
         xNode.outerHTML = ATemplate;        // Assignment.
         xNode = AParent.lastChild;          // After assignment xNode is NOT our Node, added to AParent -
                                             //    it's a something another! So we need to get our Node
                                             //    right back to return appropriate one.
                                             // !WARNING! Multy-thread unsafe code!
         this.SetPropsFromTemplate(xNode);
         if (xNode.id && xNode.pvnid && AParent == document.body) { FVT[xNode.id] = 1; }
         return xNode;
      };

       // *** @undocumented
       // @method daa.node.ClearFVs

      this.ClearFVs = function() {
         var xVN = null;
         for (var xkey in FVT) {
            xVN = daa.n.Get(xkey); if (!xVN) { delete FVT[xkey]; continue; }
            if (!this.Get(xVN.pvnid)) { document.body.removeChild(xVN); delete FVT[xkey]; }
         }
      };

   };
   this.n = this.node;
   this.properties = this.node.properties;

   // **************************************************************************
   //
   //                            CLASS MODEL
   //
   // **************************************************************************


   // **************************************************************************
   // @class Event daa.model

   this.model = new function() {
      this.path = "daa";
      this.name = "model";
      this.classname = "Model";

      // ***
      // @object daa.model.MMT

      var MMT  = {};
      this.MMT = MMT;

      this.ModelEvent = function(AE) {
         if (!AE.name || !AE.modelpath) { return; }
         var xE = daa.o.CopyOne(AE);
         var xPath = AE.modelpath + "/";
         for (var xkey in MMT) {
            if (xPath.indexOf(MMT[xkey][0] + "/") != 0) { continue; }
            xE.node = daa.n.Get(xkey); if (!xE.node || !xE.node.vcid) { delete MMT[xkey]; continue; } else { MMT[xkey][1] = 1; }
            xE.vn = xE.node; xE.vcid = xE.node.vcid;
            if (xE.vcid && daa[xE.vcid] && daa[xE.vcid].__events && daa[xE.vcid].__events["on" + xE.name]) {
               daa.e.Format(xE);
               daa[xE.vcid].__events["on" + xE.name](xE);
            }
         }
      };

       // ***
       // @method daa.model.Assign

      this.Assign = function(AObj) {
         if (!AObj.modelpath || !("value" in AObj)) { return; }
         daa.o.Set(AObj.modelpath, AObj.value);
         this.Invalidate(AObj.modelpath);
         daa.e.Send({name: "changedmodel", modelpath: AObj.modelpath});
      };

       // ***
       // @method daa.model.Invalidate

      this.Invalidate = function(APath) {
         APath = APath + "/";
         for (var xkey in MMT) {
            if (APath.indexOf(MMT[xkey][0] + "/") != 0) { continue; }
            MMT[xkey][1] = 1;
         }
      };

       // ***
       // @method daa.model.InvalidateView

      this.InvalidateView = function(AObj) {
         var xID = AObj;
         if (daa.IsNode(AObj)) { xID = AObj.id || ""; }
         else if (daa.IsObject(AObj)) { AObj = daa.m.Args(AObj, "vn"); if (AObj) { xID = AObj.id || ""; } }
         if (MMT[xID]) { MMT[xID][1] = 1; }
      };

       // ***
       // @method daa.model.IsChanged

      this.IsChanged = function(AE) {
         var xVN = daa.m.Args(AE, "vn"); if (!xVN || !xVN.id || !MMT[xVN.id]) { return 0; }
         return MMT[xVN.id][1];
      };

       // ***
       // @method daa.model.AddHolder

      this.AddHolder = function(AE) {
         var xVN = daa.m.Args(AE, "vn"); if (!xVN || !xVN.id) { return; }
         if (!("daa_modelpath" in xVN)) { return this.DeleteHolder(AE); }
         MMT[xVN.id] = [xVN.daa_modelpath, 0];
      };

       // ***
       // @method daa.model.DeleteHolder

      this.DeleteHolder = function(AE) {
         var xVN = daa.m.Args(AE, "vn"); if (!xVN || !xVN.id) { return; }
         if (MMT[xVN.id]) { delete MMT[xVN.id]; }
      };

       // ***
       // @method daa.model.ClearHolders

      this.ClearHolders = function() {
         var xVN = null;
         for (var xkey in MMT) {
            xVN = daa.n.Get(xkey); if (!xVN) { delete MMT[xkey]; }
         }
      };

   };

   // **************************************************************************
   //
   //                            CLASS EVENT
   //
   // **************************************************************************


   // **************************************************************************
   // @class Event daa.event

   this.event = new function() {
      this.path = "daa";
      this.name = "event";
      this.classname = "Event";

      var KEY_E = {keydown: 1, keyup: 1, keypress: 1};
      var EXT_E = {x: 1, y: 1, nodex: 1, nodey: 1, pagex: 1, pagey: 1, clientx: 1, clienty: 1};
      var MS_BUTTONS = ["left", "left", "middle", "right"];

      var Queue              = [];    // Queue of fired daa events
      var QueueHT            = null;  // Timer handle of queue monitoring, got from setInterval
      var IsRunning          = 1;     // DAA events dispatching systen is running.
      var IsDispatching      = 0;     // We are currently within Dispatch.
      var IsDispatchingQueue = 0;     // We are currently within MonitorQueue and dispatching the Queue.
      var ResetEvent         = 0;     // Dispatch flag to reset event, i.e. to stop further processing of the whole events chain (browser event and its slave and root subhandlers).
      var CancelEvent        = 0;     // Dispatch flag to cancel browser event. Reset on each event.
      var CancelSelection    = 0;     // Dispatch flag to cancel browser selection for one event. Reset on each event.
      var DenySelection      = 0;     // Dispatch flag to cancel selection until reset. Reset on mouseup.
      var MouseVNID          = "";    // VNID of event. Set on mousedown, reset on mouseup.
      var TouchVNID          = "";    // VNID of event. Set on touchstart, reset on touchend.
      var LastVNID           = "";    // VNID of the last clicked or touched VN. Used to send onselectedview event.
      var LastListVNID       = "";    // VNID of the last clicked or touched list VN. Used to send onselectedlist event. 'list' is determined by daa_islistselectable property of VN
      var TouchHT            = null;  // Timer handle for LongTap emulation
      var TouchTime          = 0;     // Time when the last touch occurred. Used to fire dblclick.

      this.CtrlKeys = {shift: 0, ctrl: 0, alt: 0};

      this.DebugInfo = function(AE) {
         //statusEvent(AE);
      };

      this.Run = function(AE) {
         daa.app.Run();
      };

      this.Event = function(AE) {
         if (AE.vcid && daa[AE.vcid] && daa[AE.vcid].__events && daa[AE.vcid].__events["on" + AE.name]) {
            daa[AE.vcid].__events["on" + AE.name](AE);
         }
         else if (!AE.vcid && AE.modelpath) {
            daa.model.ModelEvent(AE);
         }
      };

      this.ManageLastVN = function(AE) {
         if (!AE.vn) { return; }
         var xID = AE.vn.id; if (AE.vn.mvnid) { xID = AE.vn.mvnid; AE = this.ToMasterVN(AE); }
         if (LastVNID != xID) {
            this.Dispatch({name: "unselectedview", node: daa.n.Get(LastVNID), isevent: 1});
            this.Dispatch(daa.o.Merge({name: "selectedview"}, AE));
         }
         LastVNID  = xID;
         if (AE.vn.daa_islistselectable) {
            if (LastListVNID != xID) {
               this.Dispatch({name: "unselectedlist", node: daa.n.Get(LastListVNID), isevent: 1});
               this.Dispatch(daa.o.Merge({name: "selectedlist"}, AE));
            }
            LastListVNID  = xID;
         }
      };

      this.MouseDown = function(AE) {
          // Prevent the default selection
         if ((AE.vn   && ("daa_istextselectable" in AE.vn)   && !AE.vn.daa_istextselectable) ||
             (AE.node && ("daa_istextselectable" in AE.node) && !AE.node.daa_istextselectable)) {
            this.CancelSelection();
         }
         MouseVNID = AE.vnid;
         this.ManageLastVN(AE);
      };

      this.MouseUp = function(AE) {
          // Send mouseup to the node on which mousedown event was previously fired
         if (MouseVNID && AE.vnid != MouseVNID) {
            this.Event(this.ToNode(AE, daa.n.Get(MouseVNID)));
         }
         if (DenySelection) { CancelSelection = 1; }
         MouseVNID = "";
      };

      this.MouseMove = function(AE) {
         if (DenySelection) { CancelSelection = 1; }
      };

      this.TouchStart = function(AE) {
         TouchVNID = AE.vnid;
         this.ManageLastVN(AE);
         var xTime=new Date().getTime();
         if (Math.abs(xTime - TouchTime) < 1000) {
            this.Dispatch(daa.o.Merge({name: "dblclick"}, AE)); TouchTime = 0; this.Cancel();
         } else { TouchTime = xTime;
            if (!TouchHT) { TouchHT = setTimeout(function() { daa.e.FireTouchLong(daa.o.CopyOne(AE)); }, 500); }
         }
      };

      this.TouchEnd = function(AE) {
         if (TouchHT) { clearTimeout(TouchHT); TouchHT = null; }
         if (TouchVNID && TouchVNID != AE.vnid) { daa.o.Merge(AE, this.ToNode(AE, daa.n.Get(TouchVNID)), daa.IS_OVERRIDE); }
         TouchVNID = "";
      };

      this.TouchMove = function(AE) {
         if (TouchHT) { clearTimeout(TouchHT); TouchHT = null; }
         if (TouchVNID && TouchVNID != AE.vnid) { daa.o.Merge(AE, this.ToNode(AE, daa.n.Get(TouchVNID)), daa.IS_OVERRIDE); }
      };

      this.TouchCancel = function(AE) { };

      this.TouchLong = function(AE) {
         if (TouchHT) { clearTimeout(TouchHT); TouchHT = null; }
      };

      this.FireTouchLong = function(AE) {
         if (TouchHT) { clearTimeout(TouchHT); TouchHT = null; }
         AE.name = "touchlong";
         this.Dispatch(AE);
      };

      this.KeyUp = function(AE) {
         if (/^9$/.test(AE.key)) {
            this.ManageLastVN(this.Format({name: "focus", node: document.activeElement}));
         }
      };

      this.SelectStart = function(AE) {
         if (DenySelection) { CancelEvent = 1; }
      };

      this.PopState = function(AE) {
         if (!AE.state ||  !AE.state.name || !AE.state.vnid) { return; }
         var xE = this.Format({name: AE.state.name, vnid: AE.state.vnid});
         xE.ishistoryevent = 1;
         if (AE.state.nodeid && AE.state.nodeid != xE.vnid) {
            xE.node = daa.n.Get(AE.state.nodeid);
         }
         this.ManageLastVN(xE);
         this.Dispatch(xE);
      };

      var events = {
         onclick:       [this.Event],
         ondblclick:    [this.Event],
         onmousedown:   [this.MouseDown, this.Event],
         onmouseup:     [this.MouseUp,   this.Event],
         onmousemove:   [this.MouseMove, this.Event],
         onmouseover:   [this.Event],
         onmouseout:    [this.Event],
         onmouseenter:  [this.Event],
         onmouseleave:  [this.Event],
         onselectstart: [this.SelectStart],

         ontouchstart:  [this.TouchStart,  this.Event],
         ontouchlong:   [this.TouchLong,   this.Event],
         ontouchend:    [this.TouchEnd,    this.Event],
         ontouchmove:   [this.TouchMove,   this.Event],
         ontouchcancel: [this.TouchCancel, this.Event],

         onkeydown:    [this.Event],
         onkeyup:      [this.KeyUp, this.Event],
         onkeypress:   [this.Event],

         onfocus:      [this.Event],

         onpopstate:   [this.PopState],
         onload:       [this.Run],
         onresize:     [this.Event, this.DebugInfo]
      };

      this.rootevents  = {};
      this.slaveevents = {};

       // *** @undocumented
       // @method daa.event.PreventSelection

      this.PreventSelection = function(AE) {
         switch (AE.name) {
            case "mouseup":
               DenySelection = 0;
               break;
            case "mousemove":
               if (window.getSelection) { window.getSelection().removeAllRanges(); }
               else if (document.selection && document.selection.clear) { document.selection.clear(); }  // For MSIE, but onselectstart cancels this itself
               break;
         }
      };

       // ***
       // @method daa.event.IsMouseDown

      this.IsMouseDown = function(AE) {
         if (!AE.vnid || AE.vnid != MouseVNID) { return 0; }
         return 1;
      };

       // ***
       // @method daa.event.IsTouchDown

      this.IsTouchDown = function(AE) {
         if (!AE.vnid || AE.vnid != TouchVNID) { return 0; }
         return 1;
      };

       // *** @undocumented
       // @method daa.event.RegisterSlave

      this.RegisterSlave = function(AObj) {
         if (!AObj.name || !AObj.mastername) { return; }
         var xMName = AObj.mastername;
         if (!this.slaveevents["on" + xMName]) { this.slaveevents["on" + xMName] = {}; }
         var xGroup = this.slaveevents["on" + xMName];
         if (xGroup[AObj.name]) { return; }
         xGroup[AObj.name] = {condition: AObj.condition || 1};
         for (var xkey in AObj) {
            if (/^name|^mastername|^condition/.test(xkey)) { continue; }
            xGroup[AObj.name][xkey] = AObj[xkey];
         }
      };

       // *** @undocumented
       // @method daa.event.SubscribeOne

      this.SubscribeOne = function(ANode, AName, AMethod) {
         if (ANode.addEventListener) { ANode.addEventListener(AName, AMethod, false); }
         else if (ANode.attachEvent) { ANode.attachEvent("on" + AName, AMethod); }
      };

       // ***
       // @method daa.event.Subscribe

      this.Subscribe = function(ANode, AEvents) {
         if (daa.IsString(AEvents)) { AEvents = daa.csv.Split(AEvents); }
         else if (daa.IsObject(AEvents)) { AEvents = daa.csv.Split(daa.csv.JoinKeys(AEvents)); }
         if (!daa.IsArray(AEvents)) { return alert("Fatal error: unknown type of Events agrument"); }
         for (var xi = 0; xi < AEvents.length; xi++) { this.SubscribeOne(ANode, AEvents[xi], this.Dispatch); }
      };

       // *** @undocumented
       // @method daa.event.Start
       // @desc
       //    Starts daa.event engine. By defult it starts automatically on document
       //    ready. Use this method to restore daa.event working state after a call
       //    to {@link daa.event.Stop}.
       // @returns {undefined} No return value.

      this.Start = function() {
         IsRunning = 1;
      };

        // *** @undocumented
       // @method daa.event.Stop
       // @desc
       //    Stops daa.event engine.
       // @returns {undefined} No return value.

      this.Stop = function() {
         IsRunning = 0;
      };

       // ***
       // @method daa.event.ToParentViewNode

      this.ToParentViewNode = function(AE) {
         return this.ToNode(AE, daa.n.GetParentVN(AE.node || null));
      };
      this.ToParentVN = this.ToParentViewNode;

       // ***
       // @method daa.event.ToMasterViewNode

      this.ToMasterViewNode = function(AE) {
         return this.ToNode(AE, daa.n.GetMasterVN(AE.node || null));
      };
      this.ToMasterVN = this.ToMasterViewNode;

       // ***
       // @method daa.event.ToItemNode

      this.ToItemNode = function(AE) {
         return this.ToNode(AE, daa.n.GetIN(AE.node || null));
      };
      this.ToIN = this.ToItemNode;

       // ***
       // @method daa.event.ToNode

      this.ToNode = function(AE, ANode) {
          // Initialization
         if (!ANode) { return {}; }
         var xE = {};
         if (AE) { for (var xkey in AE) { xE[xkey] = AE[xkey]; } }
         else { AE = {node: ANode}; }
         xE.node = ANode;
         xE.isevent = 1;

          // Setting vn, vnid, vcid
         xE.vn = daa.n.GetVN(xE.node);
         if (xE.vn) { xE.vnid = xE.vn.id; xE.vcid = xE.vn.vcid; }

         if (xE.node == AE.node) { return xE; }

          // Updating structure-related coords
         var xXY = daa.n.GetXY(xE.node, AE.node);
         xE.x = xE.x || 0; xE.y = xE.y || 0; xE.nodex = xE.nodex || 0; xE.nodey = xE.nodey || 0;
         xE.x -= xXY.left;
         xE.y -= xXY.top;
         xE.nodex -= xXY.left;
         xE.nodey -= xXY.top;
         return xE;
      };

       // ***
       // @method daa.event.To

      this.To = function(AE, AObj) {
         if (daa.IsNode(AObj)) { return this.ToNode(AE, AObj); }
         var xName = (daa.IsObject(AObj) && AObj.translate) || String(AObj);
         var xNode = (daa.IsObject(AObj) && AObj.node) || AE.node || null;
         var yNode = null;
         var xObj  = {};
         if      (/ToParent/.test(xName))                    { yNode = xNode.parentNode || null; }
         else if (/ToParentVN|ToParentViewNode/.test(xName)) { yNode = daa.n.GetParentVN(xNode); }
         else if (/ToMasterVN|ToMasterViewNode/.test(xName)) { yNode = daa.n.GetMasterVN(xNode); }
         else if (/ToVN|ToViewNode/.test(xName))             { yNode = daa.n.GetVN(xNode); }
         else if (/ToIN|ToItemNode/.test(xName))             { yNode = daa.n.GetIN(xNode); }
         else if (/ToClass/.test(xName)) {
            yNode = daa.n.GetUpper(xNode, {vcid: xName.replace(/^[\s]*ToClass[\s]*/, "")});
         }
         else if (/ToUpper|ToLower/.test(xName)) {
            var xIsUpper = /ToUpper/.test(xName);
            xName = xName.replace(/^[\s]*ToUpper|ToLower[\s]*/, "").replace(/^[\s]*?where[\s]*?/i, "");
            if (xIsUpper) { yNode = daa.n.GetUpper(xNode, xName); }
            else          { yNode = daa.n.GetLower(xNode, xName); }
         }
         return this.ToNode(AE, yNode);
      };

       // ***
       // @method daa.event.Post

      this.Post = function(AE, APrevE) {
         if (!daa.IsObject(AE)) { return; }
         AE.isevent = 1;
         if (APrevE) { daa.o.Merge(AE, APrevE); }
         Queue.push(AE);
         this.CheckMonitorQueue();
      };

       // ***
       // @method daa.event.Send

      this.Send = function(AE, APrevE) {
         AE.isevent = 1;
         if (APrevE) { daa.o.Merge(AE, APrevE); }
         this.Dispatch(AE);
      };

       // ***
       // @method daa.event.Format

      this.Format = function(AE) {
         if (!AE) { return {}; }
          // Get the node
         if (!AE.node) { AE.node = daa.m.Args(AE, "node"); }

          // Get the view node
         AE.vn = AE.vn || daa.n.GetVN(AE.node);
         if (AE.vn) { AE.vnid = AE.vn.id; AE.vcid = AE.vn.vcid; }

         AE.isevent = 1;
         return AE;
      };

       // *** @undocumented
       // @method daa.event.Translate
       // @desc
       //    Creates DAA event data object of the browser event data object.

      this.FormatE = function(AE) {
         if (AE.isevent) { return this.Format(AE); }
         var xE = {
            name:     AE.type,       // name of the event
            node:     null,          // node that has fired the event
            vn:       null,          // view node - parent of 'node' or 'node' itself
            vnid:     "",            // view node id
            vcid:     "",            // view class id
            key: 0, button: "",  // key code and mouse button
            x: 0, y: 0,              // inside the node
            nodex: 0, nodey: 0,      // inside the node bounding box, including margins
            pagex: 0, pagey: 0,      // relative to the page, i.e. document
            clientx: 0, clienty: 0,  // relative to the window
            isevent:  1              // flag indicating that it's the inner daa event descriptor
         };

          // Detecting target node
         if (AE.target) { xE.node = AE.target; } else { xE.node = AE.srcElement; }
         if (xE.node == window || xE.node == document) { xE.node = document.body || null; }
         if (/^key/.test(xE.name) && LastVNID) { xE.node = daa.n.Get(LastVNID); }

          // Detecting target view node and view class id
         if (xE.node) {
            xE.vn = daa.n.GetVN(xE.node);
            if (xE.vn) { xE.vnid = xE.vn.id; xE.vcid = xE.vn.vcid; }
         }

          // Detecting mouse button affected
         var xVal = 0;
         if ((!AE.which) && (AE.button)) { AE.button & 1 ? xVal=1 : AE.button & 4 ? xVal=2 : AE.button & 2 ? xVal=3 : xVal; }
         else if ((AE.which) && (typeof(AE.button) == "number")) { xVal = AE.which; }
         xE.button = MS_BUTTONS[xVal];

          // Detecting key affected
         if (xE.name in KEY_E) { xE.key = AE.keyCode || AE.which || 0; }
         if (AE.shiftKey) { xE.isshift = Number(AE.shiftKey); }
         if (AE.altKey) { xE.isalt = Number(AE.altKey); }
         if (AE.ctrlKey || AE.metaKey) { xE.isctrl = Number(AE.ctrlKey || AE.metaKey); }
         if (AE.propertyName) { xE.propname = AE.propertyName; }

         var xAE = AE; if (AE.changedTouches && AE.changedTouches[0]) { xAE = AE.changedTouches[0]; }

          // Detecting extents
         if ("clientX" in xAE) {
            xE.clientx = xAE.clientX;
            xE.clienty = xAE.clientY;
         } else if ("layerX" in xAE) {
            var xXY = daa.n.GetXY(xE.node, "", daa.REL_CLIENT);
            xE.clientx = xAE.layerX + xXY.left;
            xE.clienty = xAE.layerY + xXY.top;
         }
         if ("pageX" in xAE) {
            xE.pagex = xAE.pageX || 0;
            xE.pagey = xAE.pageY || 0;
         } else {
            var xHtml = document.documentElement, xBody = document.body;
            xE.pagex = xE.clientx + (xHtml.scrollLeft || xBody && xBody.scrollLeft || 0) - (xHtml.clientLeft || 0);
            xE.pagey = xE.clienty + (xHtml.scrollTop  || xBody && xBody.scrollTop  || 0) - (xHtml.clientTop  || 0);
         }
         if (xE.node) {
            var xXY = daa.n.GetXY(xE.node, "", daa.REL_PAGE);
            xE.nodex = xE.pagex - xXY.left;
            xE.nodey = xE.pagey - xXY.top;
            xE.x = xE.nodex - daa.n.GetStyle(xE.node, "borderLeftWidth", daa.RET_ROUNDED) - daa.n.GetStyle(xE.node, "marginLeft", daa.RET_ROUNDED);
            xE.y = xE.nodey - daa.n.GetStyle(xE.node, "borderTopWidth",  daa.RET_ROUNDED) - daa.n.GetStyle(xE.node, "marginTop",  daa.RET_ROUNDED);
         }
         if (xE.name == "scroll") {
            if (xE.vn == document.body) { xE.scrollx = xE.vn.scrollLeft || document.documentElement.scrollLeft; xE.scrolly = xE.vn.scrollTop || document.documentElement.scrollTop; }
            else { xE.scrollx = xE.vn.scrollLeft; xE.scrolly = xE.vn.scrollTop; }
         }
         if (AE.state) { xE.state = AE.state; }
         return xE;
      };

      this.CheckMonitorQueue = function() {
         if (QueueHT && !Queue.length) { clearInterval(QueueHT); QueueHT = null;  return; }
         if (QueueHT) { return; }
         QueueHT = setInterval(this.MonitorQueue.bind(this), 10);
      };

      this.MonitorQueue = function() {
         if (IsDispatching || IsDispatchingQueue) { return; }
         IsDispatchingQueue = 1;
         this.DispatchQueue();
         this.CheckMonitorQueue();
         IsDispatchingQueue = 0;
      };

       // *** @undocumented
       // @method daa.event.DispatchQueue
       // @desc
       //    Dispatches event queue made by .Post method.

      this.DispatchQueue = function() {
         if (IsDispatching) { return; }
         var xLen = Queue.length;
         for (var xi = 0; xi < xLen; xi++) {
            this.Dispatch(Queue.shift());
         }
      };

       // *** @undocumented
       // @method daa.event.DispatchSlaves
       // @desc
       //    Dispatches slave events, i.e. user defnied events, attached to
       //    general events

       // ASlaves struc: {eventname: { decl }} where 'eventname' without 'on' prefix

      this.DispatchSlaves = function(AE, ASlaves, AIsBefore) {
         var xE = daa.o.CopyOne(AE);
         var xIsTranslated = 0;
         for (var xkey in ASlaves) {
            if (AIsBefore && !ASlaves[xkey].order) { continue; }
            if (!AIsBefore && ASlaves[xkey].order) { continue; }
            if (ASlaves[xkey].translate) {
               if (this[ASlaves[xkey].translate]) { xE = this[ASlaves[xkey].translate](AE); xIsTranslated = 1; }
               else { alert("Error: Traslation method doesn't supported yet: " + ASlaves[xkey].translate); }
            }
            if (ASlaves[xkey].condition == 1 || daa.Condition(ASlaves[xkey].condition, xE)) {
               xE.name = xkey;
               this.Dispatch(xE);
            }
            if (xIsTranslated) { xE = daa.o.CopyOne(AE); xIsTranslated = 0; }
         }
      };

       //    !Note!: this == window

       // ***
       // @method daa.event.Dispatch

      this.Dispatch = function(AE) {
         IsDispatching++;
         AE = AE || window.event;
         var xE = daa.e.FormatE(AE);
         if (!AE.isevent) { CancelEvent = 0; CancelSelection = 0; ResetEvent = 0; }

          // Processing slave 'before' events, attached to this event
         if (!ResetEvent && daa.e.slaveevents["on" + xE.name]) { daa.e.DispatchSlaves(xE, daa.e.slaveevents["on" + xE.name], 1); }

          // Passing event to global subscribers
         if (!ResetEvent && daa.e.rootevents["on" + xE.name]) {
            for (var xkey in daa.e.rootevents["on" + xE.name]) {
               daa.e.rootevents["on" + xE.name][xkey](xE);
            }
         }

          // Passing event
         if (!ResetEvent) {
            if (events["on" + xE.name]) {
               for (var xkey in events["on" + xE.name]) { events["on" + xE.name][xkey].call(daa.e, xE); if (ResetEvent) { break; } }
            }
            else {
               daa.e.Event(xE);
            }
         }

          // Processing slave 'after' events, attached to this event
         if (!ResetEvent && daa.e.slaveevents["on" + xE.name]) { daa.e.DispatchSlaves(xE, daa.e.slaveevents["on" + xE.name]); }

         if (CancelSelection)    { daa.e.PreventSelection(xE); }
         if (CancelEvent)        { if (AE.preventDefault) { AE.preventDefault(); } else { AE.returnValue = false; } }
         if (AE.stopPropagation) { AE.stopPropagation(); } else { AE.cancelBubble=true; }
         IsDispatching--;
      };

      this.Reset = function() { ResetEvent = 1; };

       // ***
       // @method daa.event.Cancel

      this.Cancel = function() { CancelEvent = 1; };

       // ***
       // @method daa.event.CancelSelection

      this.CancelSelection = function() { CancelSelection = 1; CancelEvent = 1; };
   };
   this.e = this.event;


   // **************************************************************************
   //
   //                            CLASS CLASS
   //
   // **************************************************************************

   // **************************************************************************
   // @class Class daa.class

   this.class = new function() {
      this.path = "daa";
      this.name = "class";
      this.classname = "Class";

       // *** @undocumented
       // @method daa.class.EnsureContainer
       // @desc
       //    Ensures that a container for class instance, specified by
       //    instance.path, exists.
       //    Returns the container.

      function EnsureContainer(AName) {
         var xRef = daa.obj.Get("base/classes/" + AName);
         if ((!xRef) || (!xRef.instance)) { return daa.m.Escape(); }
         return daa.obj.Ensure(xRef.instance.path || "", window, new function() {});
      };

       // *** @undocumented
       // @method daa.class.Get
       // @desc
       //    Returns class constructor {function} of the given class `AObj`,
       //    so the following would be a valid code:
       //    `var MyInstance = new daa.class.Get(MyObj);`
       //    Result is always a {function} unless redefined by ADefault or user
       //    specific error handling. See {@link daa.method.Escape} for more info.
       // @param {*} AObj - Value that specifies the class/instance.
       //                  AObj is being overloaded as:
       //                  - Class
       //                  - Class reference from base/classes
       //                  - Instance
       //                  - ClassName
       //                  - Class reference path as "base/classes/ClassName"
       //                  - Instance path/name
       //                  - Instance path.name
       // @param {function} [ADefault] - Value to return if no class exists. Default is
       //    the empty class constructor `function() {}`.
       // @returns {function} Returns class constructor of `AObj`.

      this.Get = function(AObj, ADefault) {
         ADefault = ADefault || function() {};
         var xCls;

          // 1. assume AObj as the desired class
         if (typeof(AObj) == "function") {
            xCls = AObj;
         }

          // 3. by path to reference as "base/classes/[ClassName]" or "base/classes/[ClassName]/constructor"
         else if (typeof(AObj) == "string" && AObj.indexOf("base/classes/") >= 0) {
            AObj = AObj.replace(/\/instance\b/).replace(/\/declaration\b/);
            if (AObj.indexOf("/constructor") < 0) { AObj += "/constructor"; }
            xCls = daa.obj.Get(AObj);
         }

          // 4. by classname, assuming at least one letter is upperacase as "Class"
         else if (typeof(AObj) == "string" && AObj.toLowerCase() != AObj) {
            xCls = daa.obj.Get("base/classes/" + AObj + "/constructor");
         }

          // 5. by instance reference as used in program code, as "daa.cls1.cls2"
         else if (typeof(AObj) == "string" && AObj.indexOf(".") >= 0) {
            xCls = daa.obj.Get(AObj.replace(/\./g, "/"), window);
            if ((xCls) && (xCls.classname)) { return this.Get(xCls.classname, ADefault); }
         }

          // 6. by class reference object in base/classes
         else if (typeof(AObj) == "object" && AObj && AObj.constructor) {
            xCls = AObj.constructor;
         }

          // 7. assume AObj as the primary instance of the class
         else if (typeof(AObj) == "object" && AObj && AObj.classname) {
            return this.Get(AObj.classname, ADefault);
         }


          // Return class or error
         if (xCls) { return xCls; }
         return daa.m.Escape(ADefault, "daa:error:class:NoClass");
      };

       // *** @undocumented
       // @method daa.class.GetInstance
       // @desc
       //    Returns a primary instance of the class, specified in AObj.
       //    If no instance exists returns null, unless redefined by ADefault
       //    or user specific error handling. See @link daa.method.Escape for
       //    more info.
       // @param {*} AObj - Value that specifies the class/instance
       //                  AObj is being overloaded as:
       //                  - Class
       //                  - Class reference from base/classes
       //                  - Instance
       //                  - ClassName
       //                  - Class reference path as "base/classes/ClassName"
       //                  - Instance path/name
       //                  - Instance path.name
       //                  - VN
       // @param {function} [ADefault]  The value to return if no class exists. Default is
       //                  empty class constructor ~function() {}~

      this.GetInstance = function(AObj, ADefault) {
         ADefault = ADefault || null;
         var xIns;

          // 1. by Class.name, if not anonymous
         if (typeof(AObj) == "function" && AObj.name) {
            if (AObj.name) { return this.GetInstance(AObj.name, ADefault); }
         }

          // 2. by anonymous Class function, creating temporary instance
         else if (typeof(AObj) == "function") {
            xIns = new AObj;
            xIns = daa.obj.Get((daa.p.Concat(xIns.path, xIns.name)), window);
         }

          // 3. by path to reference as "base/classes/[ClassName]" or "base/classes/[ClassName]/instance"
         else if (typeof(AObj) == "string" && AObj.indexOf("base/classes/") >= 0) {
            if (AObj.indexOf("/instance") < 0) { AObj += "/instance"; }
            xIns = daa.obj.Get(AObj);
         }

          // 4. by classname, assuming at least one letter is upperacase as "Class"
         else if (typeof(AObj) == "string" && AObj.toLowerCase() != AObj) {
            xIns = daa.obj.Get("base/classes/" + AObj + "/instance");
         }

          // 5. by instance reference as used in program code, as "daa.cls1.cls2"
         else if (typeof(AObj) == "string" && AObj.indexOf(".") >= 0) {
            xIns = daa.obj.Get(AObj.replace(/\./g, "/"), window);
         }

          // 5. by instance vcid
         else if (typeof(AObj) == "string" && AObj && daa[AObj]) {
            xIns = daa[AObj];
         }

         else if (daa.IsNode(AObj)) {
            var xVN = daa.n.GetVN(AObj) || {};
            return this.GetInstance(xVN.vcid, ADefault);
         }

          // 6. by class reference object in base/classes
         else if (typeof(AObj) == "object" && AObj && AObj.instance) {
            xIns = AObj.instance;
         }

          // 7. assume AObj as the desired instance
         else if (typeof(AObj) == "object" && AObj && AObj.classname) {
            xIns = AObj;
         }

          // Return instance or error
         if (xIns) { return xIns; }
         return daa.m.Escape(ADefault, "daa:error:class:NoInstance");
      };

       // ***
       // @method daa.class.Is

      this.Is = function(AObj, AName) {
         if (AObj == AName) { return 1; }
         var xIns = this.GetInstance(AObj, {}); if (!xIns) { return 0; }
         if (xIns.name == AName) { return 1; }
         if (!xIns.ancestors) { return 0; }
         var xAncs = daa.csv.SplitAsKeys(xIns.ancestors);
         for (var xkey in xAncs) {
            if (this.Is(xkey, AName)) { return 1; }
         };
         return 0;
      };

       // *** @undocumented
       // @method daa.class.VerifyMethods
       // @desc
       //    Verifies if method names are the valid ones, required for correct
       //    inheritance

      this.VerifyMethods = function(AObj) {
         var xIns = this.GetInstance(AObj, {});
         var xName = daa.p.Concat(xIns.path, xIns.name).replace(/\//g, "_");
         var yName = "";
         var xDefined = {};
         for (var xkey in xIns) {
            if (!daa.IsFunction(xIns[xkey])) { continue; }
            if (xkey.indexOf("_") == 0) { continue; }
            yName = xName + "_" + xkey;
            if (xDefined[yName]) { continue; }
            xIns[xkey].daa_name = yName;
            //if (xIns[xkey].name != yName) {
            //   alert("Error: Method name doesn't match DAA inheritance specifications.\n\nclass: " + xIns.classname + "\nmethod: " + xkey + "\n\nexpected: " + yName + "\ndeclared:  " + xIns[xkey].name);
            //   continue;
            //}
            xDefined[yName] = 1;
         }
         //alertEvent(xDefined);
      };

       // *** @undocumented
       // @method daa.class.GetAncestors
       // @desc
       //    Returns the list of ancestors as {"full.name": instance object}
       // @param {*} AObj - Value that specifies the class/instance.
       //                  See @link daa.class.Get for more info.

      this.GetAncestors = function(AObj) {

         var xIns = this.GetInstance(AObj, {});

          // Aquire the list of ancestors in both object and array-Index formats
         var xList = daa.csv.SplitAsKeys(xIns.ancestors);
         var xListI = daa.csv.Split(xIns.ancestors);

          // Build the inheritance hierarchy
         var xAncs = {}, xAncIns = null, xAncList = null;
         var xkey;
         for (var xi = 0; xi < xListI.length; xi++) {
            xkey = xListI[xi];
            xAncIns = daa.obj.Get(xkey.replace(/\./g, "/"), window);
            if (!xAncIns) { alert("Error: No ancestor instance: '" + xkey + "' for '" + xIns.name + "'"); daa.m.Error("daa:error:class:NoInstance:" + xkey + "," + xIns.name); continue; }
            if (xAncIns.ancestors) {
               xAncList = daa.csv.SplitAsKeys(xAncIns.ancestors);
               for (var ykey in xAncList) {
                  if (xList[ykey]) { xList[ykey]++; }
                  else { xList[ykey] = 2; xListI.push(ykey); }
               }
            }
            xAncs[xkey] = xAncIns;
         }

          // Delete non top-level ancestors because they are already inherited
          //    by higher-level classes
         for (var xkey in xList) {
            if ((xList[xkey] > 1) && (xAncs[xkey])) { delete xAncs[xkey]; }
         }
         return xAncs;
      };

      this.__mt = {}; // Method Table as {class_name_MethodName: AncestorMethod}

       // *** @undocumented
       // @method daa.class.Inherit
       // @desc
       //   Updates Class referenced by AObj with all the members of ancestors
       //   that not overrided by AObj
       // @param {*} AObj - Class reference.
       //   See {@link daa.class.Is} for more info on acceptable values.
       // @returns {undefined} No return value

      this.Inherit = function(AObj) {

         var xAncs = this.GetAncestors(AObj);
         if (daa.IsEmpty(xAncs)) { return; }

         var xIns = this.GetInstance(AObj, {});

          // Initialize 'inherited' - the container for inherited methods to
          //    call it from a descendant like: this.inherited.Method();
          //    'inherited' is a getters list like:
          //    {MethodName: function Get() { return AncestorMethod.call() }}
         xIns.inherited = {};
         var xInhName = "";

          // Inherit objects and methods
          //    xkey - the ancestor instance name
          //    xAncs[xkey] - the primary instance of the ancestor class
          //    xAncs[xkey][ykey] - an object or method
         for (var xkey in xAncs) {
            for (var ykey in xAncs[xkey]) {
               if (ykey == "inherited")  { continue; }
               if (ykey == "rootevents") { continue; }
               if (ykey == "styles")     { continue; }
               if (ykey == "properties") { continue; }
               if (ykey == "variables") { continue; }
               if (ykey == "InitClass")  { continue; }
               if (daa.IsFunction(xAncs[xkey][ykey])) {
                  (ykey in xIns) ? xInhName = xIns[ykey].daa_name : xInhName = xAncs[xkey][ykey].daa_name;
                  if (!xIns.inherited[ykey]) { xIns.inherited[ykey] = function Inherited() {
                     return daa.class.__mt[Inherited.caller.daa_name].apply(xIns, arguments)
                  } }
                  if ((xInhName != xAncs[xkey][ykey].daa_name) && (!this.__mt[xInhName])) { this.__mt[xInhName] = xAncs[xkey][ykey]; }
               }

               if (ykey in xIns) {
                  if (daa.IsObject(xAncs[xkey][ykey])) { daa.o.Merge(xIns[ykey], xAncs[xkey][ykey]); }
               }
               else {
                  xIns[ykey] = xAncs[xkey][ykey];
               }
            }
         }
      };

       // ***
       // @method daa.class.Register

      this.Register = function(AClass) {

          // Validate class name and its uniqueness
         if (!AClass) { return daa.m.Escape(null, "daa:error:method:NoArg:AClass"); }
         var xClsName, xInsName, xIsClass = 0;
         if (typeof(AClass) == "function") {
            xClsName = String(AClass.name);
            xIsClass = 1;
         }
         else {
            xClsName = String(AClass.classname);
         }
         xInsName = xClsName.toLowerCase();
         if (!xClsName) { alert("Error: No class name specified: '" + AClass + "'"); return daa.m.Escape(null, "daa:error:class:NoName"); }
         var xLib = daa.obj.Ensure("base/classes");
         if (xLib[xClsName]) { alert("Error: Class '" + xClsName + "' already registered"); return daa.m.Escape(null, "daa:error:class:Exists"); }

          // Define Class and Instance to assign to the library descriptor
          //    If AClass is a class we have both declaration and instance,
          //    otherwise we have an instance only, declaration is null
         var xCls; xIsClass ? xCls = AClass     : xCls = null;
         var xIns; xIsClass ? xIns = new AClass : xIns = AClass;

          // Create class reference record
         xLib[xClsName] = {
            path: "base/classes",
            name: xClsName,
            isitem: 1,
            isclassreference: 1,
            constructor: function(){},          // class constructor
            declaration: xCls,                  // class declaration
            instance: xIns                      // primary instance
         };
         xIns.name = xInsName;
         xIns.classname = xClsName;
         xIns.isclass = 1;

          // Initialize the abstract constructor with actual class instance.
          //    We need to start from the abstract, not from the AClass, to make
          //    it possible to update descendants complex objects with inherited
          //    properties, i.e to modify objects that were declared in AClass.
          //    Using AClass itself it couldn't been overridden.
         xLib[xClsName].constructor.prototype = xIns;

         this.VerifyMethods(xLib[xClsName]);

          // Create inheritance, if referenced by instance.ancestors.
         this.Inherit(xLib[xClsName]);

          // Register event handlers, if exist
         if (!daa.IsEmpty(xIns.events))      { this.RegisterEvents(xLib[xClsName]); }

          // Register root event handlers, if exist
         if (!daa.IsEmpty(xIns.rootevents))  { this.RegisterRootEvents(xLib[xClsName]); }

          // Register root event handlers, if exist
         if (!daa.IsEmpty(xIns.slaveevents)) { this.RegisterSlaveEvents(xLib[xClsName]); }

          // Register styles, if exist
         if (!daa.IsEmpty(xIns.styles))      { this.RegisterStyles(xLib[xClsName]); }

          // Register properties, if exist
         if (!daa.IsEmpty(xIns.properties))  { this.RegisterProperties(xLib[xClsName]); }

          // Register variable, if exist
         if (!daa.IsEmpty(xIns.variables))  { this.RegisterVariables(xLib[xClsName]); }

          // Registed VCL class
         if (xIns.daavclicon) { this.RegisterVCLItem(xLib[xClsName]); }

          // Call class initializer
         if (xIns.InitClass) { xIns.InitClass(); }

          // No class declatation provided, nothing to do anymore
         if (!xIsClass) { return xLib[xClsName]; }

          // Add the instance to its container, referenced by instance.path
         EnsureContainer(xClsName)[xInsName] = xIns;

         return xLib[xClsName];
      };

       // ***
       // @method daa.class.RegisterEvents

      this.RegisterEvents = function(AObj) {
         var xIns = this.GetInstance(AObj, {}); if (!xIns.events) { return; }
         xIns.__events = {};
         var xName = "";
         for (var xkey in xIns.events) {
            xName = xIns.events[xkey];
            if ((xIns[xName]) && (typeof(xIns[xName]) == "function")) {
               xIns.__events[xkey] = xIns[xName].bind(xIns);
            }
            else {
               try { xIns.__events[xkey] = daa.o.Get(xName.replace(/\./g, "/"), window, new function() {}).bind(xIns); }
               catch(errobj) { alert("Error: Event handler '" + xName + "' doesn't exist in the class '" + xIns.name + "'"); }
            }
         }
      };

       // ***
       // @method daa.class.RegisterRootEvents

      this.RegisterRootEvents = function(AObj) {
         var xIns = this.GetInstance(AObj, {}); if (!xIns.rootevents) { return; }
         var xName = "";
         for (var xkey in xIns.rootevents) {
            if (!daa.e.rootevents[xkey]) { daa.e.rootevents[xkey] = []; }
            xName = xIns.rootevents[xkey];
            if ((xIns[xName]) && (typeof(xIns[xName]) == "function")) {
               daa.e.rootevents[xkey].push(xIns[xName].bind(xIns));
            }
            else {
               daa.e.rootevents[xkey].push(daa.o.Get(xName.replace(/\./g, "/"), window, new function() {}).bind(xIns));
            }
         }
      };

       // ***
       // @method daa.class.RegisterSlaveEvents

      this.RegisterSlaveEvents = function(AObj) {
         var xIns = this.GetInstance(AObj, {}); if (!xIns.slaveevents) { return; }
         var xIsObject = daa.IsObject(xIns.slaveevents);
         var xName     = "";
         for (var xkey in xIns.slaveevents) {
            if (daa.IsString(xIns.slaveevents[xkey])) { xIns.slaveevents[xkey] = {mastername: xIns.slaveevents[xkey]}; }
            if (xIsObject) { xIns.slaveevents[xkey].name = xkey.replace(/^on/, ""); }
            daa.e.RegisterSlave(xIns.slaveevents[xkey]);
         }
      };

       // ***
       // @method daa.class.RegisterStyles

      this.RegisterStyles = function(AObj) {
         var xIns = this.GetInstance(AObj, {}); if (!xIns.styles) { return; }
         if (!xIns.styles.name) { alert("Error: No styles group name specified in: '" + xIns.classname + ".styles'"); return; }
         var xStyles = daa.o.Ensure("base/styles", null, daa.protos.vtreesimple);
         var xStyle =null, xGrpName = "", xPrior = 0, xQS = "";
         for (var xkey in xIns.styles) {
            if (/^name[0-9]*$/.test(xkey)) {
               xGrpName = xIns.styles[xkey]; xQS = ""; xPrior = 0;
               if (/:/.test(xGrpName)) { xQS = xGrpName.replace(/^[\s\S]*?:/, ""); xGrpName = xGrpName.replace(/:[\s\S]*$/, ""); }
               if (/priority[\s]*?=[0-9]+/.test(xQS)) { xPrior = Number(xQS.replace(/^[\s\S]*?=/, "").replace(/[^0-9]*$/, "")); }
               if (!xStyles[xGrpName]) {
                  xStyle = daa.o.Ensure(xGrpName, xStyles, xStyles.proto);
                  xStyle.isgroup = 1;
               }
               continue;
            }
            if (!xGrpName) { continue; }
            xStyle = daa.o.Ensure(xkey, xStyles, xStyles.proto);
            xStyle.isstyle  = 1;
            xStyle.priority = xPrior;
            xStyle.vparent  = xGrpName;
            xStyle.value    = xIns.styles[xkey];
         }
      };

       // ***
       // @method daa.class.RegisterProperties

      this.RegisterProperties = function(AObj) {
         if (!daa.node) { return; }
         var xIns = this.GetInstance(AObj, {}); if (!xIns.properties || xIns.name == "node") { return; }
         var xProps = daa.o.Ensure("base/properties", null, daa.protos.object);
         for (var xkey in xIns.properties) {
            daa.properties[xkey] = xIns.properties[xkey];
            xProps[xkey] = xIns.properties[xkey];
         }
      };

       // *** @undocumented
       // @method daa.class.RegisterVariables

      this.RegisterVariables = function(AObj) {
         var xIns = this.GetInstance(AObj, {}); if (!xIns.variables) { return; }
         var xVars = daa.o.Ensure("base/variables", null, daa.protos.object);
         for (var xkey in xIns.variables) {
            daa.variables[xkey] = xIns.variables[xkey];
            xVars[xkey] = xIns.variables[xkey];
         }
      };

      this.RegisterVCLItem = function(AObj) {
         var xIns = this.GetInstance(AObj, null); if (!xIns) { return; }
         var xVCL = daa.o.Ensure("base/vcl", null, daa.protos.vtreecomplex);
         var xItem = daa.vo.Add(xVCL, daa.o.Create(xVCL.proto, daa.p.Concat(xVCL.path, xVCL.name, xIns.name)));
         daa.o.Merge(xItem, {classname: xIns.name, title: xIns.name, icon: xIns.daavclicon});
      };

   };


   // **************************************************************************
   // DAA Core
   // **************************************************************************

   // **************************************************************************
   // Class Management

    // ***
    // @method daa.RegisterClasses

   this.RegisterClasses = function(AClasses) {
      for (var xi = 0; xi < arguments.length; xi++) {
         this.class.Register(arguments[xi]);
      }
   };

    // ***
    // @method daa.Class @groupname classmtd

   this.Class = function(AObj, ADefault) {
      ADefault = ADefault || this.class;
      var xVCID = this.m.Args(AObj, "vcid");
      if (daa[xVCID]) { return daa[xVCID]; }
      return ADefault;
   };

    // ***
    // @method daa.View @groupname classmtd

   this.View = function(AObj, ADefault) {
      ADefault ? ADefault : this.view ? ADefault = this.view : ADefault;
      return this.Class(AObj, ADefault);
   };

    // ***
    // @method daa.MasterView @groupname classmtd

   this.MasterView = function(AObj, ADefault) {
      var xVN = this.m.Args(AObj, "node") || {};
      var xVD = this.m.Args(AObj, "vd") || {};
      AObj = daa.n.Get(xVD.mvnid) || daa.n.GetParentVN(xVN) || null;
      return this.View(AObj, ADefault);
   };

    // ***
    // @method daa.PseudoView @groupname classmtd

   this.PseudoView = function(AObj, ADefault) {
      return this.View(this.m.Args(AObj, "vcid") + "pseudo");
   };

};

daa.RegisterClasses(
   daa.csv,
   daa.pattern,
   daa.path,
   daa.error,
   daa.method,
   daa.object,
   daa.vobject,
   daa.node,
   daa.model,
   daa.event,
   daa.class
);

if (daa.IsClient) {
   daa.e.Subscribe(document, [
      "click",
      "dblclick",
      "mousedown",
      "mouseup",
      "mousemove",
      "mouseover",
      "mouseout",
      "mouseenter",
      "mouseleave",
      "touchstart",
      "touchend",
      "touchmove",
      "touchcancel",
      "keydown",
      "keyup",
      "keypress",
      "scroll",
      "focus",
      "blur",
      "change",
      "copy",
      "cut",
      "paste",
      "selectstart",
      "contextmenu",
      "dragstart",
      "drag"
   ]);
   daa.e.Subscribe(window, [
      "focus",
      "popstate",
      "resize",
      "orientationchange",
      "beforeunload",
      "load"
   ]);
} else {
   var window = {daa: daa, String: String};
   var document = {createElement:function(a){return{tagName:a,style:{}}},styleSheets:[{cssRules:{}}]};
   global.alert = function(a) { console.log(a); };
   module.exports = daa;
}

