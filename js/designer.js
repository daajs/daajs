daa.RegisterClasses(

// *****************************************************************************
// @class Designer daa.designer @groupname view
// @classdesc
//    Creates `designed` view.
//    Documentation is being prepared.

function Designer() {
   this.path = "daa";
   this.name = "designer";
   this.ancestors = "daa.editor";
   this.requires = "daa.mover";

    // ***
    // @object daa.designer.events

   this.events = {
      onmoving:  "Moving"
   };

    // ***
    // @object daa.designer.styles

   this.styles = {
      name:            "Editor",
      designer:        "position: absolute",
      designerbox:     "background-color: #aaa; opacity: 0.4; width: 100%; height: 100%; position: absolute; box-sizing: border-box; border: 1px solid grey",
      designertable:   "width: 100%; height: 100%; position: absolute;",
      designerpoint:   "background-color: black; width: 5px; height: 5px;",
      designerpointn:  "cursor: n-resize",
      designerpointw:  "cursor: w-resize",
      designerpointnw: "cursor: nw-resize",
      designerpointne: "cursor: ne-resize"
   };

    // ***
    // @object daa.designer.templates

   this.templates = {
      item: "<div id='%vnid%_background' class='designerbox'></div>" +
            "<table id='%vnid%_sizebox' class='designertable'>" +
               "<tr>" +
                   "<td id='%vnid%_sizenw' class='designerpoint designerpointnw'></td>" +
                   "<td align='center'><div id='%vnid%_sizen' class='designerpoint designerpointn'></div></td>" +
                   "<td id='%vnid%_sizene' class='designerpoint designerpointne'></td>" +
               "</tr>" +
               "<tr>" +
                   "<td valign='middle'><div id='%vnid%_sizew' class='designerpoint designerpointw'></div></td>" +
                   "<td id='%vnid%_move'></td>" +
                   "<td valign='middle'><div id='%vnid%_sizee' class='designerpoint designerpointw'></div></td>" +
               "</tr>" +
               "<tr>" +
                   "<td id='%vnid%_sizesw' class='designerpoint designerpointne'></td>" +
                   "<td align='center'><div id='%vnid%_sizes' class='designerpoint designerpointn'></div></td>" +
                   "<td id='%vnid%_sizese' class='designerpoint designerpointnw'></td>" +
               "</tr>" +
            "</table>"
   };

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      daa.mover.Create(AE);
   };

   this.Moving = function(AE) {
      var xE = daa.mover.GetExtents(AE);
      if (daa.IsEmpty(xE)) { return; }
      xE.vn = AE.vn || null;
      this.SetExtents(xE);
   };

   // **************************************************************************
   // Behavior

   this.SetExtents = function(AE) {
      var xVN = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      var xOpVN = daa.n.Get(xVN.daa_openerid) || {};
      var xOpVD = xOpVN.vd || {left: 1, top: 1, width: 1, height: 1};
      if ("left"   in AE && daa.IsInt(xOpVD.left))   { xVN.style.left = AE.left + "px"; }
      if ("top"    in AE && daa.IsInt(xOpVD.top))    { xVN.style.top  = AE.top  + "px"; }
      if ("width"  in AE && daa.IsInt(xOpVD.width))  { daa.n.SetWidth(xVN, AE.width); }
      if ("height" in AE && daa.IsInt(xOpVD.height)) { daa.n.SetHeight(xVN, AE.height); }
      if (!xVN.daa_openerid) { return; }
      ("left"   in AE) ? AE.left   += xVN.daa_offsetleft || 0 : AE;
      ("top"    in AE) ? AE.top    += xVN.daa_offsettop  || 0 : AE;
      ("width"  in AE) ? AE.width  -= daa.n.GetW(xOpVN, "o")  : AE;
      ("height" in AE) ? AE.height -= daa.n.GetH(xOpVN, "o")  : AE;
      if ("left"   in AE && daa.IsInt(xOpVD.left))   { xOpVN.style.left   = AE.left   + "px"; xOpVD.left    = AE.left;   }
      if ("top"    in AE && daa.IsInt(xOpVD.top))    { xOpVN.style.top    = AE.top    + "px"; xOpVD.top     = AE.top;    }
      if ("width"  in AE && daa.IsInt(xOpVD.width))  { xOpVN.style.width  = AE.width  + "px"; xOpVD.width   = AE.width;  }
      if ("height" in AE && daa.IsInt(xOpVD.height)) { xOpVN.style.height = AE.height + "px"; xOpVD.height  = AE.height; }
      //statusEvent(xOpVD);
   };

   // **************************************************************************
   // Opening

   this.OpenPrepare = function(AE) {
      var xVN = daa.m.Args(AE, "vn");          if (!xVN) { return; }
      var xE = this.inherited.OpenPrepare(AE); if (!xE) { return; }
      var xXY = daa.n.GetXY(xVN, "parent");
      xE.vd.offsetleft = xXY.left - xE.left;
      xE.vd.offsettop  = xXY.top  - xE.top;
      return xE;
   };

   // **************************************************************************
   // Filling

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.minWidth  = 15;
      AVD.minHeight = 15;
      AVD.htmlclassName = AVD.htmlclassName || "designer";
      this.inherited.Init(AVD, AVN);
   };
}
);

