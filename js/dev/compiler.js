daa.RegisterClasses(

// *****************************************************************************
// @class Compiler daa.compiler
// @classdesc
//    Compiles DAA-scripts

function Compiler() {
   this.path = "daa";
   this.name = "compiler";

    // Creates an object of string values.

   function MakeSubObject(AValue, AKey, AObj) {
      AKey = AKey || "group";
      var xPath = daa.p.Concat(AObj.path, AObj.name, AKey), xName = "";
       // Determine object type
      var xType = "object";
      if (/^vtree|vobject/.test(AValue)) {
         if      (/^vtreesimple/.test(AValue)) { xType = "vtreesimple"; }
         else if (/^vtree/.test(AValue))       { xType = "vtreecomplex"; }
         else if (/^vobject/.test(AValue))     { xType = "vobject"; }
      }
       // Clean AValue from type declaration and {} symbols
      AValue = daa.Trim(AValue.replace(/^(vtreesimple|vtreecomplex|vobject|vtree)/, "")).replace(/^{|}$/g, "");
      if (/^\[.*?\]$/.test(AValue)) { AValue = "name=" + AValue.replace(/^\[|\]$/g, "").replace(/,/g, "; name=") + ";"; }
       // Create the objects of the specified type
      var xObj = daa.o.Create(daa.protos[xType], xPath);
      if (AKey == "layout") { xObj.islayout = 1; }

      var xItem = null, yItem = null, xVal = null;

       // Return simple object, if no special type specified
      if (xType == "object") {
         xVal = MakeObject(AValue, AKey, xObj); if (daa.IsError(xVal)) { return xVal; }
         return daa.o.Merge(xObj, xVal);
      }

       // Split string of items, separated by ';' and process all the items
      var xArr = daa.qs.Split(AValue.replace(/^[\s]+|[\s]+$/g, "").replace(/;$/, ""), ";", null, daa.RET_TRIMMED);

       // Create items
      for (var xi = 0; xi < xArr.length; xi++) {
         if (!xArr[xi]) { continue; }
          // Pre-parse item string to determine its Name
         xVal = daa.qs.Split(xArr[xi].replace(/;$/, ""), ",", "=", daa.RET_TRIMMED);
         if (xVal.name) { xName = xVal.name; }
         else { if (!("lastid" in xObj)) { xObj.lastid = 0; } xName = "item" + xObj.lastid; xObj.lastid++; }
          // Create the item from proto template
         xItem = daa.vo.Add(xObj, daa.o.Create(xObj.proto, daa.p.Concat(xPath, xName)), xVal.vparent || "");
         if (xObj.islayout) { xItem.islayoutitem = 1; }
          // Merge specified values to the item
         xVal = MakeObject(xArr[xi], xName, xItem); if (daa.IsError(xVal)) { return xVal; }
         daa.o.Merge(xItem, xVal);
      }
       // Returns complete object, to be assigned to a key!
      return xObj;
   }

    // Creates an object of string values.

   function MakeObject(AValue, AKey, AObj) {
       // Split value str to an object of key/value pairs
      var xObj = daa.qs.Split(AValue.replace(/;$/, ""), ",", "=", daa.RET_TRIMMED);

       // Process the object
      var xIsStr = 0;
      for (var xkey in xObj) {
         if (/[^A-Za-z0-9_]/g.test(xkey)) { return "daa:error::compiler:SyntaxError" + xkey; }
         /^'|^\"/.test(xObj[xkey]) ? xIsStr = 1 : xIsStr = 0;
         xVal = xObj[xkey].replace(/^'|^\"|'$|\"$/g, "");
         if (!xIsStr) {
            if (/^(|vtreesimple|vtreecomplex|vobject|vtree)[\s]*?{[\s\S]*?}$/.test(xVal)) {
               xVal = MakeSubObject(xVal, xkey, AObj); if (daa.IsError(xVal)) { return xVal; }
            }
            else if (daa.IsNumeric(xVal)) { xVal = Number(xVal); }
            else { xVal = xVal.replace(/\\n/g, "\n"); }
         }
         if (xkey == "classname") { delete xObj[xkey]; xkey = "htmlclassName"; }
         if (xkey == "model" && !xVal) { delete xObj[xkey]; xkey = "modelpath"; xVal = "this"; }
         xObj[xkey] = xVal;
      }
       // Returns object of only the values, to be merged to a complete object!
      return xObj;
   }

    // Closes opened VD object, i.e. fills it with all the values,
    //    remaining after parsing VCID and VNID

   function CloseVD(AObj, AValue) {
      var xObj = MakeObject(AValue.replace(/;$/, ""), AObj.name, AObj);
      if (daa.IsError(xObj)) { return xObj; }
      daa.o.Merge(AObj, xObj);
   }

    // Rolls the path, filled with a chain of 'vparents' back to ALevel items
    //    ALevel in fact is a difference between last processed level and the
    //    current level, that is surely less than processed.

   function RollBack(APath, ALevel) {
      var xArr = APath.split("/").reverse();
      for (var xi = 0; xi < ALevel; xi++) { xArr.shift(); }
      xArr.reverse();
      return xArr.join("/");
   }

    // Compiles daa-lang text to a JSON object

   function CompileJSON(AArr, AModel) {
      var xObj = null, xItem = null;
      var xVal = "", xRest = "", xResult = "";
      var xPPath = daa.p.Concat(AModel.path, AModel.name), xPName = "";
      var xPath = "", xName = "", yName = "";
      var yPath = "";
      var xLS = "", yLS = "";
      var xIsStatic = 0, xIndex = 0, xLevel = 0, xPrevLevel = 0;
      var xVCID = "", xVNID = "";
      var xIsCmt = 0, xLastClsLine = 0;;
      var xTempName = "viewtree";
      var xIsModel = 0;
      for (var xi = 0; xi < AArr.length; xi ++) {
         xVal = AArr[xi];

          // Detect comments
         if (/^[\s]*?\/\*/.test(xVal)) { xIsCmt = 1; }
         if (xIsCmt && /\*\//.test(xVal)) { xIsCmt = 0; }
         xVal = daa.Trim(xVal.replace(/\/\*[\s\S]*\*\//g, "").replace(/\/\*|\*\//g, "").replace(/^ *?\/\/[\s\S]+$/, "").replace(/[,;{\\] *?\/\/[\s\S]+$/, ""));
         if (!xVal || xIsCmt) { continue; }

         if (/^@/.test(xVal)) {
             // *** Parse @class
            if (xRest && xItem) { xResult = CloseVD(xItem, xRest); xRest = ""; if (xResult) { return xResult + ":" + (xLastClsLine + 1); } }

            xLastClsLine = xi;

             // Detect level
            yLS   = AArr[xi].replace(/@[\s\S]+$/, "");
            if (!xLS && yLS) { xLS = yLS; }
            xLevel = daa.PosVal(yLS.split(xLS).length - 1);

             // Return on level mismatch
            if (xLevel > xPrevLevel + 1) { return "daa:error:compiler:LevelError:" + (xi + 1); }

             // Detect names
            xVCID = daa.Trim(xVal.replace(/[ ;][\s\S]*$/, "").replace(/^@/, "")) || "zone";
            xVNID = daa.Trim(xVal.replace(/^@[A-Za-z0-9]+?\b[\s]*/, "").replace(/[ ;][\s\S]*$/, ""));

             // Check whether a page or a model is being opened.
            if (!xLevel && /^(page|root)$/.test(xVCID)) {
               if (xVCID == "page") { xTempName = "viewtree"; xIsModel = 0; }
               else { xTempName = "vtreecomplex"; xIsModel = 1; }
            }

             // Return on page level mismatch or no pagename
            if (!xVCID) { return "daa:error:compiler:ClassError:" + (xi + 1); }
            if (!xLevel && !/^(page|root)$/.test(xVCID)) { return "daa:error:compiler:LevelError:" + (xi + 1); }
            if (!xVNID  && xVCID == "page") { return "daa:error:compiler:NameError:" + (xi + 1); }

             // Obtain and verify the rest of the string
            xRest = daa.Trim(xVal.replace(new RegExp("^@" + xVCID + "[\\s]*?" + xVNID.replace(/\*/, "\\*")), ""));
            if (!/(,|;|{|\\)$/.test(xRest)) { return "daa:error:compiler:SyntaxError:" + (xi + 1); }

             // Verify VNID
            if (!xVNID || xVNID == "*") {
               xObj.lastids[xVCID] ? xObj.lastids[xVCID]++ : xObj.lastids[xVCID] = 1;
               xVNID = xVCID + daa.String(xObj.lastids[xVCID]);
               xIsStatic = 0;
            } else { xIsStatic = 1; }

             // Create page group
            if (/^(page|root)$/.test(xVCID)) {
               xPName = xVNID; xPath = daa.p.Concat(xPPath, xPName); xName = "";
               xLevel = 0; xPrevLevel = 0; yPath = "";
               AModel[xPName] = daa.o.Create(daa.protos[xTempName], xPath);
               xObj = AModel[xPName];
            }

             // Update hierarchy path
            if (xLevel > xPrevLevel) { yPath = daa.p.Concat(yPath, yName); }
            else if (xLevel < xPrevLevel) { yPath = RollBack(yPath, xPrevLevel - xLevel); }

             // Create VD
            xName = xVNID;

            if (xVCID != "root") {
               xItem = daa.vo.Add(
                  xObj,
                  daa.o.Create(daa.protos[xTempName].proto, daa.p.Concat(xPath, xName)),
                  daa.p.GetName(yPath)
                  );
               if (!xIsModel) {
                  daa.o.Merge(xItem, {vnid: xVNID, vcid: xVCID}, daa.IS_OVERRIDE);
                  xIsStatic ? xItem.isstaticid = 1 : 0;
               }
            }
             // Save prev level and name
            xPrevLevel = xLevel;
            yName = xName; if (xVCID == "root") { yName = ""; }
            //if (daa.p.GetName(yPath)) { break; }
         } else {
             // *** Save the rest of the block for further processing
            if (/\\$/.test(xRest)) { xRest = xRest.replace(/ *?\\$/, " ").replace(/\\n/g, "\n"); xVal = xVal.replace(/\\n/g, "\n"); }
            xRest += xVal;
         }
      }
      if (xRest && xItem) { xResult = CloseVD(xItem, xRest); if (xResult) { return xResult + ":" + (xLastClsLine + 1); } }
      return "";
   }

   // **************************************************************************
   // PUBLIC SECTION
   // **************************************************************************

    // ***
    // @method daa.compiler.Prepare

   this.Prepare = function(AValue, ARef) {
      AValue = daa.String(AValue).replace(/<\?daa[\s\S]*?\?>/g, function(a) {
         ARef.push(a.replace(/<\?daa[\s]*|[\s]*\?>/g, ""));
         return "#DAASCR" + daa.Chr(5) + ARef.length + "#";
      });
      return AValue;
   };

    // ***
    // @method daa.compiler.Accomplish

   this.Accomplish = function(ANode, ARef) {
      var xArr  = ANode.innerHTML.split("#DAASCR" + daa.Chr(5));
      var xVD   = daa.m.Args(ANode, "vd") || null;
      var xPath = ""; if (xVD) { xPath = xVD.path; }
      ANode.innerHTML = "";
      var xNode, yNode, xCode, xObj, yObj;
      for (var xi = 0; xi < xArr.length; xi++) {
          // Get inclusion code and remove this code from text part.
         xCode = ""; if (xi > 0) { xCode = Number(xArr[xi].replace(/#[\s\S]*$/, "")); xArr[xi] = xArr[xi].replace(/^[0-9]+#/, ""); }
          // Create node for text.
         xNode = document.createElement("span"); xNode.innerHTML = xArr[xi];
          // Append node and return if either code or path is invalid
         if (!xCode || !ARef[xCode - 1] || !xPath) { ANode.appendChild(xNode); continue; }
          // Create inclusion node
         yNode = document.createElement("div");
         yNode.id = "inc" + daa.app.NewID();
         ANode.appendChild(yNode);
          // Create view tree
         xObj = this.Compile(ARef[xCode - 1]); yObj = null;
         daa.app.AppendPage(xPath, xObj);
         for (var xkey in xObj) {
            if (!daa.IsVItem(xObj[xkey]) || !xObj[xkey].isviewtree) { continue; }
            yObj = daa.vo.GetRoot(xObj[xkey]);
            if (yObj.models) { daa.app.EnsureModels(yObj.models); }
         }
          // Include view
         if (yObj) {
            yNode.daa_include = yObj.name;
            daa.app.Include(yNode);
         }
         ANode.appendChild(xNode);
      }
   };

    // ***
    // @method daa.compiler.Compile

   this.Compile = function(AValue) {
      AValue = AValue.replace(/\r/, "");
      var xModel = {path: "", name: "views"};
      var xArr = AValue.split("\n");
      var xResult = CompileJSON(xArr, xModel);
      if (daa.IsError(xResult)) { return xResult; }
      return xModel;
   };
}

);

