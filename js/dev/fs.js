if (daa.IsServer) { const fs = require("fs"); }

daa.RegisterClasses(

// *****************************************************************************
// @class FS daa.fs
// @desc
//    Provides interface to file system on both client and server sides.
//    While on client side, the class requires DAA system server-side working.
//    All the methods are synchronous.

function FS() {
   this.path = "daa";
   this.name = "fs";

   this.EnsurePath = function(APath) {
      if (!APath) { return; }
      if (daa.IsServer) {
         var xPath = "";
         var xArr  = daa.path.Split(APath);
         for (var xi = 0; xi < xArr.length; xi++) {
            xPath = daa.p.Concat(xPath, xArr[xi]);
            if (!fs.existsSync(xPath)) { fs.mkdirSync(xPath); }
         }
      }
   };

   this.Exists = function(APath) {
      if (daa.IsServer) {
         return Number(fs.existsSync(APath));
      }
   };

   this.ReadDir = function(AName) {
      var xObj = {};
      if (daa.IsServer) {
         AName = AName || "./"; if (!this.Exists(AName)) { return xObj; }
         var xArr  = fs.readdirSync(AName || "./");
         var xStat = null;
         for (var xi = 0; xi < xArr.length; xi++) {
            xObj[xArr[xi]] = 0;
            xStat = fs.statSync(daa.p.Concat(AName, xArr[xi]));
            if (xStat.isDirectory()) { xObj[xArr[xi]] = 1; }
            else if (xStat.isFile()) { xObj[xArr[xi]] = 2; }
         }
      }
      return xObj;
   };


   function ListFiles(APath, BPath, ARE, BRE, AFiles) {
      var xDir = daa.fs.ReadDir(daa.p.Concat(APath, BPath));
      var xIsMatch = 0;
      for (var xkey in xDir) {
          // Exclude unknown file types
         if (!xDir[xkey]) { continue; }
          // Exclude file or dir matching exclude RE
         if (BRE) { if (BRE.test(xkey)) { continue; } }
          // Process subdir
         if (xDir[xkey] == 1) { ListFiles(daa.p.Concat(APath, BPath), xkey, ARE, BRE, AFiles); continue; }
          // Exclude files doesn't matching include RE
         if (ARE) { if (!ARE.test(xkey)) { continue; } }
         AFiles[xkey] = daa.p.Concat(APath, BPath);
      }
   }

   this.ListFiles = function(AName, AInclude, AExclude) {
      var xFiles = {};
      var xPaths = AName || "";
      daa.IsArray(xPaths) ? xPaths : xPaths = [xPaths];
      var xRE = null; if (AInclude) { xRE = new RegExp(AInclude); }
      var yRE = null; if (AExclude) { yRE = new RegExp(AExclude); }
      for (var xi = 0; xi < xPaths.length; xi++) {
         ListFiles("", xPaths[xi], xRE, yRE, xFiles);
      }
      return xFiles;
   };

   this.ReadFile = function(AName) {
      var xText = "";
      if (daa.IsServer) {
         if (fs.existsSync(AName)) { xText = fs.readFileSync(AName, "utf8"); }
         else { xText = "daa:error:file:NotExists"; }
      }
      return xText;
   };

   this.WriteFile = function(AName, AValue) {
      this.EnsurePath(daa.p.GetPath(AName));
      if (daa.IsServer) {
         fs.writeFileSync(AName, AValue, "utf8");
      }
   };
}

);

