daa.RegisterClasses(

// *****************************************************************************
// @class HTML daa.html
// @classdesc
//    Provides methods to work with HTML attributes.

function HTML() {
   this.path = "daa";
   this.name = "html";
   this.iscoreclass = 1;

   this.Properties = {
      htmlclassName: 1,
      htmlmaxLength: 1,
      htmlname: 1,
      htmlplaceholder: 1,
      htmltype: 1,
      htmlvalue: 1
   };

   this.Subst = {
      For: "htmlFor"
   };

    // ***
    // @method daa.html.SetProp
    // @desc Assigns the given HTML-attribute value to the given node.
    //    All the attributes names must have `html` prefix.
    // @param {node} ANode - DOM node.
    // @param {object} AKey - Attribute name.
    // @param {int|string} AValue - Value to be assigned.
    // @returns {undefined} No return value.
    // @example ex1 
    //    var xNode = document.createElement("div");
    //    daa.css.SetProps(xNode, "htmlclassName", "item");
    //    console.log(xNode.className); // Prints 'item'

   this.SetProp = function(ANode, AKey, AValue) {
      AKey = AKey.replace(/^html/, ""); if (this.Subst[AKey]) { AKey = this.Subst[AKey]; }
      if (/{{[\s\S]+?}}/.test(AValue)) { AValue = daa.pattern.Fill(AValue, daa.o.Get(ANode.daa_modelpath)); }
      ANode[AKey] = AValue;
   };

    // ***
    // @method daa.html.SetProps
    // @desc Assigns the given HTML-attributes values to the given node.
    //    All the attributes names must have `html` prefix.
    // @param {node} ANode - DOM node.
    // @param {object} AObj - View Data or View Data-like object, containing HTML-attributes and values to
    //    to be assigned.
    // @returns {undefined} No return value.
    // @example ex1 
    //    var xNode = document.createElement("div");
    //    daa.css.SetProps(xNode, {htmlclassName: "item"});
    //    console.log(xNode.className); // Prints 'item'

   this.SetProps = function(ANode, AObj) {
      for (var xkey in AObj) {
         if (!/^html/.test(xkey)) { continue; }
         this.SetProp(ANode, xkey, AObj[xkey]);
      }
   };
},

// *****************************************************************************
// @class CSSP daa.cssp
// @classdesc
//    Provides methods for CSS 'auto-prefixing'.
//    'CSSP' is an abbreviation for 'CSS Prefixer'.

function CSSP() {
   this.path = "daa";
   this.name = "cssp";
   this.iscoreclass = 1;

    // Non-standard properties
   var nsP = {
      appearance:    "appearance; MozAppearance; webkitAppearance; WebkitAppearance;",
      flex:          "flex; webkitBoxFlex; WebkitBoxFlex; webkitFlex; WebkitFlex; msFlex;",
      flexTranslatorFn: "webkitBoxFlex: webkitBoxFlex; WebkitBoxFlex: WebkitBoxFlex;",
      flexGrow:      "flexGrow; webkitBoxFlex; WebkitBoxFlex; webkitFlexGrow; WebkitFlexGrow; msFlexPositive",
      flexShrink:    "flexShrink; webkitFlexShrink; WebkitFlexShrink; msFlexNegative",
      flexBasis:     "flexBasis; webkitFlexBasis; WebkitFlexBasis; msFlexPreferredSize",
      flexDirection: "flexDirection; webkitBoxDirection; WebkitBoxDirection; webkitFlexDirection; WebkitFlexDirection; msFlexDirection",
      flexDirectionTranslatorFn: "webkitBoxDirection: webkitBoxDirection; WebkitBoxDirection: WebkitBoxDirection;",
      flexFlow:      "flexFlow; webkitFlexFlow; WebkitFlexFlow; msFlexFlow",
      flexWrap:      "flexWrap; webkitFlexWrap; WebkitFlexWrap; msFlexWrap"
   };

    // Non-standard values
   var nsV = {
      display: {
         flex: "flex; -webkit-box; -webkit-flex; -ms-flexbox;"
      },
      background: {
         "linear-gradient": "linear-gradient(black, white); -webkit-linear-gradient(black, white); -o-linear-gradient(black, white); -moz-linear-gradient(black, white);",
         "radial-gradient": "radial-gradient(black, white); -webkit-radial-gradient(black, white); -o-radial-gradient(black, white); -moz-radial-gradient(black, white);",
         TranslatorFn: "Default: BackgroundGradient;"
      },
      backgroundImage: {
         "linear-gradient": "linear-gradient(black, white); -webkit-linear-gradient(black, white); -o-linear-gradient(black, white); -moz-linear-gradient(black, white);",
         "radial-gradient": "radial-gradient(black, white); -webkit-radial-gradient(black, white); -o-radial-gradient(black, white); -moz-radial-gradient(black, white);",
         TranslatorFn: "Default: BackgroundGradient;"
      }
   };

    // Prefixer data in the following format:
    //    std-Key: ns-Key
    //    std-Key: TranslatorFn
    //    std-Key: {Value: ns-Value, ns-Value: Value, [ValueFn: TranslatorFn, ns-ValueFn: TranslatorFn]}
   var Data  = { };
   this.interface = Data;

   var DIV = document.createElement("div");
   DIV ? DIV = DIV.style : DIV = {};

   this._GetTranslatorFn = function(ADecl, AKey) {
      var xFnName = "";
      ADecl = ADecl.replace(/-/g, "_");
      if (new RegExp("\\b" + AKey.replace(/-/g, "_") + "[\\s]*:").test(ADecl)) {
         xFnName = ADecl.replace(new RegExp("[\\s\\S]*\\b" + AKey.replace(/-/g, "_") + "[\\s]*:[\\s]*"), "").replace(/[\s]*?;[\s\S]*$/, "");
      } else if (/\bDefault:/.test(ADecl)) {
         xFnName = ADecl.replace(/\bDefault[\s]*:[\s]*/, "").replace(/[\s]*?;[\s\S]*$/, "");
      }
      if (xFnName && this[xFnName]) { return this[xFnName]; }
      return null;
   };

   this.InitClass = function() {
       // *** Values
       // Build non-standard values model as
       // Data.stdPropName: { value: ns-value, ns-value: value, [valueFn: TranslatorFn, ns-valueFn: TranslatorFn]}
      var xProp, xVals, xRes, xFn;
      for (var xKey in nsV) {
          // For each property having non-standard values.
          // xKey is a name of the property
         Data[xKey] = {};
         xProp = nsV[xKey];
         for (var xVal in xProp) {
             // Skip translator method reference
            if (/TranslatorFn/.test(xVal)) { continue; }
             // For each standard value.
             // xRes is a correct value
            xVals = daa.csv.Split(xProp[xVal], ";");
            for (var xkey in xVals) {
                // For each standard and non-standard value, testing which of them is valid
               xRes = xVals[xkey].replace(/\([\s\S]+/, "");
               DIV[xKey] = xVals[xkey];
               if (new RegExp(xRes).test(DIV[xKey])) {
                  Data[xKey][xVal] = xRes;
                  Data[xKey][xRes] = xVal;
                  if (xkey != "0" && xProp.TranslatorFn) {
                      // Add translator method, if present
                     xFn = this._GetTranslatorFn(xProp.TranslatorFn, xRes);
                     if (xFn) {
                        Data[xKey][xVal + "Fn"] = xFn;
                        Data[xKey][xRes + "Fn"] = xFn;
                     }
                  }
                  break;
               }
            }
         }
      }
       // *** Properties
       // Build non-standard properties model as
       // Data.std-Key: ns-Key || TranslatorFn
      var xKeys;
      for (var xKey in nsP) {
          // Skip translator method reference
         if (/TranslatorFn/.test(xKey)) { continue; }
          // For each property having non-standard values.
          // xKey is a name of the property
         Data[xKey] = null;
         xKeys = daa.csv.SplitAsKeys(nsP[xKey], ";");
         for (xRes in xKeys) {
             // For each non-standard (prefixed) property name, testing which of them exists
            if (xRes in DIV) {
               xRes != xKey && nsP[xKey + "TranslatorFn"] ? xFn = this._GetTranslatorFn(nsP[xKey + "TranslatorFn"], xRes) : xFn = null;
               xFn ? Data[xKey] = xFn : Data[xKey] = (xRes == xKey && xRes) || "-" + xRes;
               break;
            }
         }
      }
      //alertEvent(Data);
   };

   // **************************************************************************
   // Non-Standard Values Handlers

    // background: []-gradient
   this.BackgroundGradient = function(AObj, AKey, AValue) {
      if (!Data.background) { return ""; }
      if (arguments.length < 3) {
          // Get
         var yValue = daa.css.GetExactValue(AObj, AKey) || "";
         var xVal = yValue.replace(/\([\s\S]+/, "");
         var xPar = yValue.replace(/^[\s\S]+?\(/, "(");
         var xRes = Data.background[xVal] || ""; if (!xRes) { return yValue; }
         if (/webkit/i.test(xVal)) {
            xPar = xPar.replace(/\([\s]*(left|top|right|bottom)/, "(to $1").replace(/(left|top|right|bottom)/g, function(a) { return a == "left" ? "right" : a == "top" ? "bottom" : a == "right" ? "left" : a == "bottom" ? "top" : a; });
         } else {
            xPar = xPar.replace(/\([\s]*(left|top|right|bottom)/, "(to $1");
         }
         return xRes + xPar;
      } else {
          // Set
         var xVal = AValue.replace(/\([\s\S]+/, "");
         var xPar = AValue.replace(/^[\s\S]+?\(/, "(");
         var xRes = Data.background[xVal] || ""; if (!xRes) { return; }
         if (/webkit/i.test(xRes)) {
            xPar = xPar.replace(/\([\s]*to[\s]*/, "(").replace(/(left|top|right|bottom)/g, function(a) { return a == "left" ? "right" : a == "top" ? "bottom" : a == "right" ? "left" : a == "bottom" ? "top" : a; });
         } else {
            xPar = xPar.replace(/\([\s]*to[\s]*/, "(");
         }
         Set(AObj, AKey, xRes + xPar);
      }
   };

   // **************************************************************************
   // Non-Standard Properties Handlers

   var WebkitPrefix = "-webkit";

    // flex: partial support, only flexGrow value
   this.webkitBoxFlex = function(AObj, AKey, AValue) {
      if (arguments.length < 3) {
          // Get
         return daa.css.GetExactValue(AObj, WebkitPrefix + "BoxFlex") || "";
      } else {
          // Set
         AValue = daa.String(AValue).replace(/ [\s\S]*/, "");
         Set(AObj, WebkitPrefix + "BoxFlex", AValue);
      }
   };

    // flex:
   this.WebkitBoxFlex = function(AObj, AKey, AValue) {
      WebkitPrefix = "-Webkit"; return this.webkitBoxFlex(AObj, AKey, AValue);
   };

    // flexDirection
   this.webkitBoxDirection = function(AObj, AKey, AValue) {
      if (arguments.length < 3) {
          // Get
         var xRes;
         var xDir = daa.css.GetExactValue(AObj, WebkitPrefix + "BoxDirection") || "";
         var xOri = daa.css.GetExactValue(AObj, WebkitPrefix + "BoxOrient")    || "";
         /horizontal/.test(xOri) ? xRes = "row" : /vertical/.test(xOri) ? xRes = "column" : xRes = "";
         if (!xRes) { return xRes; }
         /reverse/.test(xDir) ? xRes += "-reverse" : xRes;
         return xRes;
      } else {
          // Set
         var xDir = "normal";     if (/reverse/.test(AValue)) { xDir = "reverse"; }
         var xOri = "horizontal"; if (/column/.test(AValue))  { xOri = "vertical"; }
         Set(AObj, WebkitPrefix + "BoxDirection", xDir);
         Set(AObj, WebkitPrefix + "BoxOrient", xOri);
      }
   };

    // flexDirection
   this.WebkitBoxDirection = function(AObj, AKey, AValue) {
      WebkitPrefix = "-Webkit"; return this.webkitBoxDirection(AObj, AKey, AValue);
   };

   // **************************************************************************
   // Public Methods

    // ***
    // @method daa.cssp.SetDeclaration
    // @desc
    //    Translates a CSS declaration from the standard to the prefixed form for
    //    current browser, if needed.
    // @param {string} AValue - CSS declaration string, not enclosed in either `{...}` or `"..."`.
    // @returns {string} Returns the converted declaration.

   this.SetDeclaration = function(AValue) {
      var xObj = daa.qs.Split(AValue, ";", ":"), yObj = {};
      var xKey = "";
      for (var xkey in xObj) {
         xKey = daa.lc.ToCamel(xkey);
         if (!Data[xKey]) { yObj[xkey] = xObj[xkey]; continue; }
         this.Set(yObj, xKey, daa.Trim(xObj[xkey]));
      }
      return daa.qs.Join(yObj, "; ", ": ");
   };

    // ***
    // @method daa.cssp.Get
    // @desc
    //    Returns a standardized value of the given prefixed property taken from the given object.
    // @param {node|object} AObj - DOM Node or CSS declaration or `style` object.
    //    If AObj is a node, `AObj.style` object is used to obtain the property
    //    from. Otherwise the whole object is used.
    // @param {string} AKey - CSS property name, standardized.
    // @returns
    //    {string} Returns AKey's CSS property value of AObj.

   this.Get = function(AObj, AKey) {
      if (!Data[AKey]) { return daa.css.GetExactValue(AObj, AKey) || daa.css.GetAssignedValue(AObj, AKey, 1) || ""; }
      if (daa.IsFunction(Data[AKey])) {
          // ns-Key and get-set method, call the TranslatorFn to get the value
         return Data[AKey](AObj, AKey);
      }
      else if (daa.IsObject(Data[AKey])) {
          // std-Key, ns-Value, get exact value and reduce it to std, if needed
         var yValue = daa.css.GetExactValue(AObj, AKey) || daa.css.GetAssignedValue(AObj, AKey, 1) || "";
         var xValue = yValue.replace(/\([\s\S]+/, ""); // Reduce the value to its main form, throwing possible value params in ()
         if (Data[AKey][xValue]) {
            if (Data[AKey][xValue + "Fn"]) { return Data[AKey][xValue + "Fn"](AObj, AKey); }
            else if (/\(/.test(yValue)) { return yValue.replace(new RegExp("^" + xValue), Data[AKey][xValue]); }
            else { return Data[AKey][xValue]; }
         } else { return yValue; }
      }
      else {
          // ns-Key, simply get the value from prefixed key
         return daa.css.GetExactValue(AObj, Data[AKey]) || daa.css.GetAssignedValue(AObj, AKey, 1) || "";
      }
   };

    // AKey MUST be in camelCase/PascalCase, prefixed keys must have leading "-"
   function Set(AObj, AKey, AValue) {
      AObj.style ? AKey = AKey.replace(/^-/, "") : AKey = AKey.replace(/[a-z]/ig, "") + daa.lc.ToKebab(AKey);
      AObj.style ? AObj.style[AKey] = AValue : AObj[AKey] = AValue;
   }

    // ***
    // @method daa.cssp.Set
    // @desc
    //    Sets the prefixed property to the given object.
    // @param {node|object} AObj - DOM Node or CSS declaration or `style` object.
    //    If AObj is a node, `AObj.style` object is used to obtain the property
    //    from. Otherwise the whole object is used.
    // @param {string} AKey - CSS property name to assign AValue to, standardized.
    // @param {string|int} AValue - Value to assign, standardized.
    // @returns {undefined} No return value.

   this.Set = function(AObj, AKey, AValue) {
      if (!Data[AKey]) { Set(AObj, AKey, AValue); return; }
      if (daa.IsFunction(Data[AKey])) {
          // ns-Key and get-set method, call the TranslatorFn to set the value
         Data[AKey](AObj, AKey, AValue);
      }
      else if (daa.IsObject(Data[AKey])) {
          // std-Key, ns-Value, set exact value or call the TranslatorFn
         var xValue = AValue.replace(/\([\s\S]+/, ""); // Reduce the value to its main form, throwing possible value params in ()
         if (Data[AKey][xValue]) {
            if (Data[AKey][xValue + "Fn"]) { Data[AKey][xValue + "Fn"](AObj, AKey, AValue); }
            else if (/\(/.test(AValue)) { Set(AObj, AKey, AValue.replace(new RegExp("^" + xValue), Data[AKey][xValue])); }
            else { Set(AObj, AKey, Data[AKey][xValue]); }
         } else { Set(AObj, AKey, AValue); }
      }
      else {
          // ns-Key, simply set the value to prefixed key
         Set(AObj, Data[AKey], AValue);
      }
   };
},

// *****************************************************************************
// @class CSS daa.css
// @classdesc
//    Provides methods to work with CSS rules and inline styles.

function CSS() {
   this.path = "daa";
   this.name = "css";
   this.iscoreclass = 1;

   // ***
   // @object daa.css.Properties
   // @desc
   //    Complete list of the all known CSS properties.

   // TODO Set to zero all the properties that doesn't accept "px" after a number
   this.Properties = {
      alignContent: 1,
      alignItems: 1,
      alignSelf: 1,
      all: 1,
      animation: 1,
      animationDelay: 1,
      animationDirection: 1,
      animationDuration: 1,
      animationFillMode: 1,
      animationIterationCount: 1,
      animationName: 1,
      animationPlayState: 1,
      animationTimingFunction: 1,
      appearance: 0,
      backfaceVisibility: 1,
      background: 1,
      backgroundAttachment: 1,
      backgroundBlendMode: 1,
      backgroundClip: 1,
      backgroundColor: 1,
      backgroundImage: 1,
      backgroundOrigin: 1,
      backgroundPosition: 1,
      backgroundRepeat: 1,
      backgroundSize: 1,
      border: 1,
      borderBottom: 1,
      borderBottomColor: 1,
      borderBottomLeftRadius: 1,
      borderBottomRightRadius: 1,
      borderBottomStyle: 1,
      borderBottomWidth: 1,
      borderCollapse: 1,
      borderColor: 1,
      borderImage: 1,
      borderImageOutset: 1,
      borderImageRepeat: 1,
      borderImageSlice: 1,
      borderImageSource: 1,
      borderImageWidth: 1,
      borderLeft: 1,
      borderLeftColor: 1,
      borderLeftStyle: 1,
      borderLeftWidth: 1,
      borderRadius: 1,
      borderRight: 1,
      borderRightColor: 1,
      borderRightStyle: 1,
      borderRightWidth: 1,
      borderSpacing: 1,
      borderStyle: 1,
      borderTop: 1,
      borderTopColor: 1,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
      borderTopStyle: 1,
      borderTopWidth: 1,
      borderWidth: 1,
      bottom: 1,
      boxShadow: 1,
      boxSizing: 1,
      captionSide: 1,
      clear: 1,
      clip: 1,
      color: 1,
      columnCount: 1,
      columnFill: 1,
      columnGap: 1,
      columnRule: 1,
      columnRuleColor: 1,
      columnRuleStyle: 1,
      columnRuleWidth: 1,
      columnSpan: 1,
      columnWidth: 1,
      columns: 1,
      content: 1,
      counterIncrement: 1,
      counterReset: 1,
      cursor: 1,
      direction: 1,
      display: 1,
      emptyCells: 1,
      filter: 1,
      flex: 1,
      flexBasis: 1,
      flexDirection: 0,
      flexFlow: 1,
      flexGrow: 0,
      flexShrink: 0,
      flexWrap: 1,
      float: 1,
      font: 1,
      "@fontFace": 1,
      fontFamily: 1,
      fontSize: 1,
      fontSizeAdjust: 1,
      fontStretch: 1,
      fontStyle: 1,
      fontVariant: 1,
      fontWeight: 1,
      hangingPunctuation: 1,
      height: 1,
      justifyContent: 1,
      "@keyframes": 1,
      left: 1,
      letterSpacing: 1,
      lineHeight: 1,
      listStyle: 1,
      listStyleImage: 1,
      listStylePosition: 1,
      listStyleType: 1,
      margin: 1,
      marginBottom: 1,
      marginLeft: 1,
      marginRight: 1,
      marginTop: 1,
      maxHeight: 1,
      maxWidth: 1,
      "@media": 1,
      minHeight: 1,
      minWidth: 1,
      navDown: 1,
      navIndex: 1,
      navLeft: 1,
      navRight: 1,
      navUp: 1,
      opacity: 0,
      order: 1,
      outline: 1,
      outlineColor: 1,
      outlineOffset: 1,
      outlineStyle: 1,
      outlineWidth: 1,
      overflow: 1,
      overflowX: 1,
      overflowY: 1,
      padding: 1,
      paddingBottom: 1,
      paddingLeft: 1,
      paddingRight: 1,
      paddingTop: 1,
      pageBreakAfter: 1,
      pageBreakBefore: 1,
      pageBreakInside: 1,
      perspective: 1,
      perspectiveOrigin: 1,
      position: 1,
      quotes: 1,
      resize: 1,
      right: 1,
      tabSize: 1,
      tableLayout: 1,
      textAlign: 1,
      textAlignLast: 1,
      textDecoration: 1,
      textDecorationColor: 1,
      textDecorationLine: 1,
      textDecorationStyle: 1,
      textIndent: 1,
      textJustify: 1,
      textOverflow: 1,
      textShadow: 1,
      textTransform: 1,
      top: 1,
      transform: 1,
      transformOrigin: 1,
      transformStyle: 1,
      transition: 1,
      transitionDelay: 1,
      transitionDuration: 1,
      transitionProperty: 1,
      transitionTimingFunction: 1,
      unicodeBidi: 1,
      verticalAlign: 1,
      visibility: 1,
      whiteSpace: 1,
      width: 1,
      wordBreak: 1,
      wordSpacing: 1,
      wordWrap: 1,
      zIndex: 0
   };

   // **************************************************************************
   // CSS Declarations management

   var Container = document.styleSheets[0]["cssRules"] || document.styleSheets[0]["rules"] || [];

   this.GetRuleIndex = function(AName) {
      if (!Container.length) { return -1; }
      for (var xi = 0; xi < Container.length; xi++) {
         if (Container[xi].selectorText == AName) { return xi; }
      }
      return -1;
   };

   this.DeleteRule = function(AName) {
      if (!Container.length) { return; }
      if (daa.IsString(AName)) {
         if (AName.indexOf(".") != 0) { AName = "." + AName; }
         AName = this.GetRuleIndex(AName);
      }
      if (AName < 0 ) { return; }
      if (document.styleSheets[0].deleteRule) {
         document.styleSheets[0].deleteRule(AName);
      } else if (document.styleSheets[0].removeRule) {
         document.styleSheets[0].removeRule(AName);
      }
   };

   this.AddRule = function(AName, AValue) {
      if (!Container.length) { return; }
      if (!/^[\.#@]/.test(AName)) { AName = "." + AName; }
      this.DeleteRule(AName);
      AValue = daa.cssp.SetDeclaration(AValue);
      var xLen = Container.length;
      if (document.styleSheets[0].insertRule) {
         if (AValue.indexOf("{") < 0) { AValue = " {" + AValue + "}"; }
         document.styleSheets[0].insertRule(AName + AValue, xLen - 1);
      } else if (document.styleSheets[0].addRule) {
         if (AValue.indexOf("{") >= 0) { AValue = AValue.replace(/^[\s\{]+|[\}\s]+$/g, ""); }
         document.styleSheets[0].addRule(AName, AValue, xLen);
      }
   };

    // ***
    // @method daa.css.Apply
    // @desc
    //    Applies the given set of CSS rules to zero-level CSS rules container.
    // @param {object} AObj - Object, containing a set of objects - class-defined CSS styles.
    //    Each object must be a DAA VItem and should have the following fields:
    //    `rulename: {
    //        ...
    //        name: rulename, // CSS Rule name, CSS selector
    //        isstyle: 1,     // Flag indicating the object is a CSS rule declaration
    //        value: "..."    // CSS definitions string
    //    }`
    // @returns {undefined} No return value.

   this.Apply = function(AObj) {
      var xArr = daa.o.Sort(AObj, "priority");
      var xkey = "";
      for (var xi = 0; xi < xArr.length; xi++) {
         xkey = xArr[xi];
         if ((!AObj[xkey].isstyle) || (!AObj[xkey].value)) { continue; }
         this.AddRule(xkey, daa.variable.Fill(AObj[xkey].value));
      }
   };

    // ***
    // @method daa.css.IsRule
    // @desc
    //    Checks if the given CSS rule exists at zero CSS rules layer.
    // @param {string} AName - CSS rule name.
    // @returns {number} Returns 1 if CSS rule AName is defined.

   this.IsRule = function(AName) {
      if (this.GetRuleIndex("." + AName) >= 0) { return 1; }
      return 0;
   };

   // **************************************************************************
   // Properties Getters and Setters

    // ***
    // @method daa.css.GetExactValue
    // @desc
    //    Retrieves and returns the given CSS property value of the given node AS IS.
    //    Unlike other methods, both AKey and the result supposed to be 'as is', not
    //    standardized, how they are defined by the current browser, with or without prefixes.
    //    Use this method to retrieve the exact value of the exact [prefixed] key.
    //    AKey MUST be passed in camelCase, prefixed keys MUST have leading "-",
    //    like in daa.cssp Data.
    //    Accepts keys as they defined in current browser.
    // @note This method is 'low-level'. Use it if you are aware of what you do.
    // @param {node|string|object} AObj - Object containing CSS keys and values.
    //    If AObj is:
    //    @value Node - Returns value from Node.style or from getComputedStyle.
    //    @value String - Assumes the string is a CSS declaration and returns
    //       what is assigned to AKey.
    //    @value Object - Returns the value of `AObj[AKey]`.
    // @param {string} AKey - CSS key in `camelCase`, non-standard-Keys must have
    //    leading "-". AKey must not be stardardized for this function!
    // @returns
    //    {string} Returns AKey's CSS property value of ANode.

   this.GetExactValue = function(AObj, AKey) {
      var xUndef = undefined;
      if (!AObj) { return xUndef; }
      if (AObj.style) {
          // *** AObj seems to be a DOM Node
          // If something is assigned directly to AObj.style[AKey] - simply return it
         if (AObj.style[AKey]) { return AObj.style[AKey]; }
          // Otherwise we need to get computed style
         else {
             // Get Node's view for getComputedStyle
            var xView = AObj.ownerDocument && AObj.ownerDocument.defaultView ? AObj.ownerDocument.defaultView : window;
            if (xView.getComputedStyle) {
                // getComputedStyle understands kebab-case only, remain leading "-" and convert other to kebab-case.
               AKey = AKey.replace(/[a-z]/ig, "") + daa.lc.ToKebab(AKey);
               return xView.getComputedStyle(AObj, "").getPropertyValue(AKey);
            }
            else if (AObj.currentStyle) {
                // currentStyle understands camelCase, just remove "-" prefix if exists.
               AKey = AKey.replace(/^-/, "");
               return  AObj.currentStyle[AKey];
            }
            else { return xUndef; }
         }
      } else {
          // *** AObj seems to be a string or an object
          // Expand string css declaration to an object
         if (daa.IsString(AObj))  { AObj = daa.qs.Split(AObj, ";", ":"); }
          // Otherwise, if AObj is not an object - return undefined, we cannot determine what it is.
         if (!daa.IsObject(AObj)) { return xUndef; }
          // We have to test three different versions of AKey: cssp-data, kebab, camel
         var xKey = AKey.replace(/[a-z]/ig, "") + daa.lc.ToKebab(AKey); // kebab version
         var yKey = AKey.replace(/^-/, "");                             // camel version
         if      (AKey in AObj) { return AObj[AKey]; }
         else if (xKey in AObj) { return AObj[xKey]; }
         else if (yKey in AObj) { return AObj[yKey]; }
         else { return xUndef; }
      }
      return xUndef;
   };

    // ***
    // @method daa.css.GetAssignedValue
    // @desc
    //    Retrieves and returns the given CSS property value of the given node only if
    //    it is explicitly assigned to the node via inline-style or a CSS rule, applied to ANode.
    // @param {node} ANode - DOM node.
    // @param {object} AKey - CSS property name.
    // @returns
    //    {string} Returns AKey's CSS property value of ANode.
    // @example ex1 
    //    // Somewhere in CSS: 'div { color: white; }'
    //    var xNode = document.createElement("div");
    //    daa.css.SetProp(xNode, "backgroundColor", "red");
    //    daa.css.GetProp(xNode, "backgroundColor"); // Returns 'rgb(255,0,0)'
    //    daa.css.GetProp(xNode, "color");           // Returns '', because 'color' wasn't set to the node explicitly

   function GetAssignedValue(AObj, AKey, AIsP) {
      if (!AIsP && daa.cssp.interface[AKey]) { return daa.cssp.Get(AObj, AKey); }
      else if (AObj[AKey])                   { return AObj[AKey]; }
      return "";
   }

   this.GetAssignedValue = function(ANode, AKey, AIsP) {
      var xVal = ""; if (!ANode) { return ""; }
      if (ANode.style) {
          // Try to get assigned value from ANode.style
         xVal = GetAssignedValue(ANode.style, AKey, AIsP);
          // If none, try to get it from ANode.id's css rule
         if (!xVal && ANode.id) {
            xIndex = this.GetRuleIndex("#" + ANode.id);
            if (xIndex >= 0 && Container[xIndex] && Container[xIndex].style) {
               xVal = GetAssignedValue(Container[xIndex].style, AKey, AIsP);
            }
         }
          // If none, try to get it from ANode.className's classes
         if (!xVal && ANode.className) {
            var xIndex = "", xArr = daa.csv.Split(ANode.className, " ").reverse();
            for (var xi = 0; xi < xArr.length; xi++) {
               xIndex = this.GetRuleIndex("." + xArr[xi]);
               if (xIndex < 0 || !Container[xIndex] || !Container[xIndex].style) { continue; }
               xVal = GetAssignedValue(Container[xIndex].style, AKey, AIsP);
               if (xVal) { break; }
            }
         }
      }
      return xVal;
   };

    // ***
    // @method daa.css.IsSet
    // @desc
    //    Checks if the given CSS property value is assigned to the given node by either `style`
    //    object or a CSS class.
    //    All the properties names and values will be returned as standardized.
    // @param {node} ANode - DOM node.
    // @param {object} AKey - CSS property name.
    // @returns
    //    {string} Returns `1` if AKey's CSS property value is assigned to ANode. Returns `0` otherwise.

   this.IsSet = function(ANode, AKey) {
      var xVal = this.GetAssignedValue(ANode, AKey);
      if (!daa.IsEmptyString(xVal) && !/auto|initial|inherit/.test(xVal)) { return 1; }
      return 0;
   };

    // ***
    // @method daa.css.GetProp
    // @desc
    //    Retrieves the given CSS property value of the given node.
    //    All the properties names and values will be returned as standardized.
    // @param {node} ANode - DOM node.
    // @param {object} AKey - CSS property name.
    // @returns
    //    {string} Returns AKey's CSS property value of ANode.
    // @example ex1 
    //    var xNode = document.createElement("div");
    //    daa.css.SetProp(xNode, "backgroundColor", "red");
    //    daa.css.GetProp(xNode, "backgroundColor"); // Returns 'rgb(255,0,0)'

   this.GetProp = function(ANode, AKey) {
      if (daa.cssp.interface[AKey]) { return daa.cssp.Get(ANode, AKey); }
      else                          { return this.GetExactValue(ANode, AKey) || ""; }
   };

    // ***
    // @method daa.css.SetProp
    // @desc Assigns the given CSS-property value to the given node's `style` object.
    //    All the properties names and values must be standardized.
    // @param {node} ANode - DOM node.
    // @param {object} AKey - CSS property name.
    // @param {object} AValue - CSS property value.
    // @returns {undefined} No return value.
    // @example ex1 
    //    var xNode = document.createElement("div");
    //    daa.css.SetProp(xNode, "backgroundColor", "red");
    //    console.log(xNode.style.backgroundColor); // Prints 'rgb(255,0,0)'

   this.SetProp = function(ANode, AKey, AValue) {
      AValue = daa.variable.Fill(AValue);
      if (daa.cssp.interface[AKey])                        { daa.cssp.Set(ANode, AKey, AValue); }
      else if (this.Properties[AKey] && daa.IsInt(AValue)) { ANode.style[AKey] = AValue + "px"; }
      else                                                 { ANode.style[AKey] = AValue; }
   };

    // ***
    // @method daa.css.SetProps
    // @desc Assigns the given CSS-properties values to the given node's `style` object.
    //    All the properties names and values must be standardized.
    // @param {node} ANode - DOM node.
    // @param {object} AObj - View Data or View Data-like object, containing CSS properties and values to
    //    to be assigned.
    // @returns {undefined} No return value.
    // @example ex1 
    //    var xNode = document.createElement("div");
    //    daa.css.SetProps(xNode, {backgroundColor: "red"});
    //    console.log(xNode.style.backgroundColor); // Prints 'rgb(255,0,0)'

   this.SetProps = function(ANode, AObj) {
      for (var xkey in AObj) {
         if (!(xkey in this.Properties)) { continue; }
         this.SetProp(ANode, xkey, AObj[xkey]);
      }
   };

    // ***
    // @method daa.css.GetProps
    // @desc
    //    Constructs and returns an object, containing listed CSS-properties of the given node.
    //    All the properties names and values will be returned as standardized.
    // @param {node} ANode - DOM node.
    // @param {*} [AProps] - List of the properties to retrieve.
    //    If AProps is a string, it is supposed to be a CSV-string, containing CSS properties names.
    //    If AProps is an array, it is supposed to contain CSS properties names.
    //    If AProps is an object, its keys must be CSS properties names.
    //    If this argument is omitted, the method will retrieve all the known
    //    CSS properties values.
    // @returns
    //    {object} Returns an object filled with CSS-properties of ANode.
    // @example ex1 
    //    var xNode = document.createElement("div");
    //    daa.css.SetProps(xNode, {backgroundColor: "red"});
    //    daa.css.GetProps(xNode, "backgroundColor"); // Returns {backgroundColor: rgb(255,0,0)}

   this.GetProps = function(ANode, AProps) {
      if (!ANode) { return {}; }
      var xProps = AProps || this.Properties;
      daa.IsArray(xProps) ? xProps = daa.csv.Join(xProps) : xProps;
      daa.IsString(xProps) ? xProps = daa.csv.SplitAsKeys(xProps) : xProps;
      for (var xkey in xProps) {
         xProps[xkey] = this.GetProp(ANode, xkey);
      }
      return xProps;
   };

   // **************************************************************************
   // Nodes className management

});

