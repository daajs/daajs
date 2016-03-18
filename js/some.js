daa.RegisterClasses(

function DAACmd() {
   this.path = "daa";
   this.name = "daacmd";

   this.Run = function() {
      console.log("CMD Run. Current directory: " + process.cwd() + " : " + __filename);
   };
}
);