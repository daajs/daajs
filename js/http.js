daa.RegisterClasses(

// *****************************************************************************
// @class HTTP daa.http
// @desc
//    Provides methods to access objects and/or REST API via http.
//    The class is at development stage, so that, only two methods provided
//    and documented yet.

function HTTP() {
   this.path = "daa";
   this.name = "http";
   this.iscoreclass = 1;

   var HTTP = null;
   var Busy = 0;

   // **************************************************************************
   // Initialization

   function CreateHTTP() {
      if (daa.IsServer) { return; }
      daa.Browser[0] == "msie" ? HTTP = new ActiveXObject('Microsoft.XMLHTTP') : HTTP = new XMLHttpRequest();
   };

   function Nop() { }

   this.InitClass = function() { CreateHTTP(); };

   // **************************************************************************
   // Private section

   function Prepare(AURL) {
      if (!AURL) {return null; }
      AURL = daa.String(AURL);
      var xObj = { name: AURL, qs: "" };
      if (/\?/.test(AURL)) { xObj.name = AURL.substr(0, AURL.indexOf("?")); xObj.qs = AURL.substr(AURL.indexOf("?") + 1 ); }
      return xObj;
   }

   function Sync(AURL, AType) {
      var xObj = Prepare(AURL);
      try {
         daa.Browser[0] == "opera" && Busy ? HTTP = CreateHTTP() : HTTP;
         HTTP.open(AType, xObj.name, false);
         HTTP.onreadystatechange=Nop;
         HTTP.setRequestHeader("Content-type","application/x-www-form-urlencoded");
         HTTP.send(xObj.qs);
         var xS  = daa.Trim(HTTP.responseText);
         var xCT = HTTP.getResponseHeader("Content-Type");
         var xIsJSON = 0;
         if (/application\/json|text\/plain/.test(xCT) && /^{[\s\S]*?}|^\[[\s\S]*?\]/.test(xS)) {
            xS = daa.Unserialize(xS);
         }
         return xS;
      } catch(errobj) {
         return "daa:error:http:Failed:" + errobj.message;
      }
   }

   // **************************************************************************
   // API

    // ***
    // @method daa.http.GetSync
    // @desc
    //    Sends GET Synchronous HTTP request and returnes the result.
    //    If the server returns JSON string, the method unserializes it
    //    and returns an object made of JSON.
    // @param {string} AURL - URL to be retrieved. May contain
    //    standard URL query string.
    // @returns {string|object} Returns the request result.

   this.GetSync = function(AURL) { return Sync(AURL, "GET") };

    // ***
    // @method daa.http.PostSync
    // @desc
    //    Sends POST Synchronous HTTP request and returnes the result.
    //    If the server returns JSON string, the method unserializes it
    //    and returns an object made of JSON.
    // @param {string} AURL - URL to be retrieved. May contain
    //    standard URL query string.
    // @returns {string|object} Returns the request result.

   this.PostSync = function(AURL) { return Sync(AURL, "POST") };

}
);

