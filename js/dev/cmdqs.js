daa.RegisterClasses(

// *****************************************************************************
// @class CmdQS daa.cmdqs
// @desc
//    Provides method to convert command line 'query string' to an object, that contains key/value pairs.

function CmdQS() {
   this.path = "daa";
   this.name = "cmdqs";

   // TODO MUST DESCRIBE IT in daadoc-supported format!
   // @object
    //    Supported command line formats are:
    // @value {string} -key - If only a key passed, it will be returned as `key: 1`.
    // @value {string} -key=value - Will be returned as `key: 'value'` for string values and `key: value` for numeric.
    // @value {string} -key value1 value2 - Will be returned as `key: 'value1 value2'`.

    // ***
    // @object daa.cmdqs.synonyms
    // @desc
    //    Describes synonyms for query string keys. Object format:
    //    `key: 'synonym1,synonym2,...,synonymn'`.
    //    `key` - is the key, that will be
    //    returned be {@link daa.cmdqs.Split} in the result array, whatever its synonyms
    //    were actually passed in the query string.
    //    Application should add values to this object, if needed, before any call
    //    of {@link daa.cmdqs.Split}.
    //    Default synonym is: `help: "h,?"`, that means all the `-help`, `-h`, `-?` will be returned
    //    as `help` key.

   var synonyms = {
      help:  "h,?"
   };
   this.synonyms = synonyms;

   function Close(AObj, AName, AValue) {
      var xName = AName, xArr = null;
      for (var xkey in synonyms) {
         xSyns = daa.csv.SplitAsKeys(synonyms[xkey]);
         for (var xsyn in xSyns) { if (AName == xsyn) { xName = xkey; break; } }
      }
      AValue = daa.Trim(AValue); if (daa.IsEmptyString(AValue)) { AValue = 1; }
      if (daa.IsNumeric(AValue)) { AValue = Number(AValue); }
      AObj[xName] = AValue;
   }

    // ***
    // @method daa.cmdqs.Split
    // @desc
    //    Splits command line 'query string' to an object, containing key/value pairs.
    // @returns {object} Returns object of query string key/value pairs.

   this.Split = function() {
      if (!daa.IsServer) { return {}; }
      var xArr = process.argv;
      var xObj = {};
      var xName = "", xVal = "";
      for (var xi = 0; xi < xArr.length; xi++) {
         if (/^-/.test(xArr[xi])) {
            if (xName) { Close(xObj, xName, xVal); xName = ""; xVal = ""; }
            xName = xArr[xi].replace(/^-/, "");
            if (/=/.test(xName)) { xVal = xName.replace(/^[\s\S]*?=/, ""); xName = xName.replace(/=[\s\S]*?$/, ""); }
         }
         else if (xName) {
            xVal += " " + xArr[xi];
        }
      }
      if (xName) { Close(xObj, xName, xVal); }
      return xObj;
   };
}

);

