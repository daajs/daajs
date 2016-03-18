daa.RegisterClasses(

// *****************************************************************************
// @class Mover daa.mover @groupname util
// @classdesc
//    Implements movement for views.
//    Service class. 

function Mover() {
   this.path = "daa";
   this.name = "mover";
   this.requires = "daa.movebox, daa.moveplaceholder";

   var E = null;

   this.events = {
      onmousemove:   "MouseMove",
      onmouseup:     "MouseUp",
      ontouchend:    "TouchEnd",
      ontouchmove:   "TouchMove"
   };

   this.styles = {
      name: "Utility",
      "#daa_mover": "display: none; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; background-color: black; opacity: 0.0; z-index: 9999;",
      name1: "Blah:priority=1",
      "foo": "display: block"
   };

   this.Nop = function(AE) { };

   // **************************************************************************
   // Event handlers

   this.MouseMove = function(AE) {
      //statusEvent(AE);
      daa.o.Merge(AE, E, daa.IS_OVERRIDE);
      AE.offsetx = AE.pagex - AE.startx;
      AE.offsety = AE.pagey - AE.starty;
      daa.movebox.Moving(AE);
      daa.moveplaceholder.Moving(AE);
      daa.e.Send(daa.o.Merge({name: "moving"}, AE));
   };

   this.TouchMove = function(AE) {
      this.MouseMove(AE);
      daa.e.Cancel();
   };

   this.MouseUp = function(AE) {
      //statusEvent(AE);
      daa.o.Merge(AE, E, daa.IS_OVERRIDE);
      AE.offsetx = AE.pagex - AE.startx;
      AE.offsety = AE.pagey - AE.starty;
      daa.movebox.Moving(AE);
      daa.movebox.Close();
      daa.moveplaceholder.Moving(AE);
      daa.moveplaceholder.Close();
      var xMover = daa.n.Get("daa_mover"); if (!xMover) { return; }
      xMover.style.display = "none";
      daa.e.Send(daa.o.Merge({name: "moved"}, AE));
      E = null;
   };

   this.TouchEnd = function(AE) {
      this.MouseUp(AE);
      daa.e.Cancel();
   };

   // **************************************************************************
   // Behavior

   this.GetExtents = function(AE) {
      var xVN    = daa.m.Args(AE, "vn");   if (!xVN) { return; }
      var xVD    = xVN.vd || {};
      var xNode  = daa.m.Args(AE, "node"); if (!xNode) { return; }
      var xName  = AE.extentname || "_move";
      if (!AE.extentname && /_move|_size/.test(xNode.id)) { xName = xNode.id; }
      var xLimit = {left: xVD.minLeft || -100000000, top: xVD.minTop || -100000000, width: xVD.minWidth || 0, height: xVD.minHeight || 0};
      var xExt   = {};
      if (/_move|_sizenw|_sizesw|_sizene|_sizew|_sizen/.test(xName)) {
         if (/_move|_sizenw|_sizesw|_sizew/.test(xName)) { xExt.left = daa.MostInt(AE.left + AE.offsetx, xLimit.left); }
         if (/_move|_sizenw|_sizene|_sizen/.test(xName)) { xExt.top  = daa.MostInt(AE.top  + AE.offsety, xLimit.top);  }
      }
      if (/_size/.test(xName)) {
         if (/_sizenw|_sizesw|_sizew/.test(xName)) { xExt.width  = daa.MostInt(AE.width  - AE.offsetx, xLimit.width);  }
         if (/_sizene|_sizese|_sizee/.test(xName)) { xExt.width  = daa.MostInt(AE.width  + AE.offsetx, xLimit.width);  }
         if (/_sizenw|_sizene|_sizen/.test(xName)) { xExt.height = daa.MostInt(AE.height - AE.offsety, xLimit.height); }
         if (/_sizesw|_sizese|_sizes/.test(xName)) { xExt.height = daa.MostInt(AE.height + AE.offsety, xLimit.height); }
      }
      return xExt;
   };

   this.GetDistanceX = function(AE) {
      if (!AE.vn || !E) { return; }
      return Math.abs((AE.pagex || 0) - (E.startx || 0));
   };

   this.GetDistanceY = function(AE) {
      if (!AE.vn || !E) { return; }
      return Math.abs((AE.pagey || 0) - (E.starty || 0));
   };

   this.GetDistance = function(AE) {
      return daa.MostInt(this.GetDistanceX(AE), this.GetDistanceY(AE));
   };

   this.IsPrepared = function(AE) {
      if (E && E.vn == AE.vn) { return 1; }
      return 0;
   };

   this.GetReference = function() {
      return E;
   };

   // **************************************************************************
   // Initialization

   this.CreateNode = function() {
      var xNode = document.createElement("div");
      xNode.id = "daa_mover";
      xNode.vcid = "mover";
      //xNode.style.opacity = 0.2;
      document.body.appendChild(xNode);
      return xNode;
   };

   function Prepare(AE) {
      if (!E) {
         var xOr = AE.moveorientation || "";
         if (xOr) {
             // Lock orientation dependent extent
            var xNode = AE[AE.moveitemname || "vn"];
            var xXY = daa.n.GetXY(xNode, "", daa.REL_PAGE);
            var xWH = daa.n.GetWH(xNode, "ipbm");
            if (xOr == "h") { AE.nodey = Math.round(xWH.height / 2); AE.pagey = xXY.top  + AE.nodey; }
            if (xOr == "v") { AE.nodex = Math.round(xWH.width  / 2); AE.pagex = xXY.left + AE.nodex; }
         }
         E = {
            node: AE.node, vn: AE.vn, vnid: AE.vnid || "", vcid: AE.vcid || "",
            startleft: AE.pagex - AE.nodex, starttop: AE.pagey - AE.nodey,
            startx:    AE.pagex,            starty:   AE.pagey
         };
      }
   }

   this.Prepare = function(AE) {
      if (!AE.vn || !AE.node) { return; }
      E = null;
      Prepare(AE);
      daa.e.Cancel();
   };

   this.Clear = function() {
      daa.movebox.Close();
      daa.moveplaceholder.Close();
      E = null;
   };

   this.Create = function(AE) {
      if (!AE.vn || !AE.node) { return; }
      Prepare(AE);
      daa.o.Merge(E, daa.n.GetExtents(E[AE.moveitemname || "vn"], "parent,ipbm"));
      daa.o.Merge(AE, E, daa.IS_OVERRIDE);
      AE.offsetx = AE.pagex - AE.startx;
      AE.offsety = AE.pagey - AE.starty;

      for (var xkey in AE) { if (/^movesave/.test(xkey)) { E[xkey] = AE[xkey]; } }

      var xMoverNode = daa.n.Get("daa_mover") || this.CreateNode();
      daa.e.Cancel();
       // Recapture mouse to the Mover self
      if (daa.IsMobile) { daa.e.TouchStart(daa.e.Format({node: xMoverNode})); }
      else              { daa.e.MouseDown(daa.e.Format({node: xMoverNode})); }
      xMoverNode.style.cursor  = (AE.node != AE.vn && daa.n.GetStyle(AE.node, "cursor")) || daa.n.GetStyle(AE.vn, "cursor") || "default";
      xMoverNode.style.display = "block";
   };
},

// *****************************************************************************
// @class MoveBox daa.movebox @groupname util
// @classdesc
//    Container for displaying moving nodes.
//    Service class for daa.mover.

function MoveBox() {
   this.path = "daa";
   this.name = "movebox";

   this.styles = {
      name: "Utility",
      "#daa_movebox": "display: none; position: absolute; opacity: 0.5; z-index: 9998;"
   };

   var Names = {
      "h": {x: "x", "!x": "y"},
      "v": {x: "y", "!x": "x"}
   };

   // **************************************************************************
   // Event handlers

   this.Moving = function(AE) {
      var xMoveBox = daa.n.Get("daa_movebox");         if (!xMoveBox || xMoveBox.style.display != "block") { return; }
      var xHolder  = daa.n.Get("daa_moveplaceholder"); if (xHolder && xHolder.style.display != "block") { xHolder = null; }
      var xMover   = daa.n.Get("daa_mover");
      var xOr  = xMoveBox.daa_orientation   || "";        // Orientation
      var xIsF = xMoveBox.daa_isoffsetfixed || "";        // Is oriented offset fixed
      var xN   = (xOr && Names[xOr])        || null;      // Names[Orientation], just shorthand

      if (xIsF) {
          // Translate
         AE[xN["!x"]]            -= AE["offset" + xN["!x"]];
         AE["node"   + xN["!x"]] -= AE["offset" + xN["!x"]];
         AE["page"   + xN["!x"]] -= AE["offset" + xN["!x"]];
         AE["client" + xN["!x"]] -= AE["offset" + xN["!x"]];
         AE["offset" + xN["!x"]] = 0;
      }

       // Detecting underlaying node and view
      xMoveBox.style.display = "none"; if (xHolder) { xHolder.style.display = "none"; } if (xMover) { xMover.style.display  = "none"; }
      var xDest = document.elementFromPoint(AE.clientx, AE.clienty);
      if (xMover) { xMover.style.display  = "block"; } if (xHolder) { xHolder.style.display = "block"; } xMoveBox.style.display = "block";
      if (xDest) {
         AE.destination = daa.e.Format({node: xDest});
         if (AE.destination.node && xMoveBox.daa_translate) {
            daa.o.Merge(
               AE.destination,
               daa.e.To(
                  {node: xMover, x: AE.x, y: AE.y, nodex: AE.nodex, nodey: AE.nodey},
                  {node: xDest, translate: xMoveBox.daa_translate}
               ),
               daa.IS_OVERRIDE
            );
         }
         //statusEvent(AE.destination);
         if (xMoveBox.daa_condition) {
            if (!daa.Condition(xMoveBox.daa_condition, AE)) { AE.destination.isomitted = 1; }
            AE.destination.isconditioned = xMoveBox.daa_condition;
         }
      } else { AE.destination = {}; }
      if (!("node" in AE.destination) || AE.destination.isomitted) { return; }

       // Updating position
      var xSl = xMoveBox.style;
      (!xOr || xOr == "h") ? xSl.left = (AE.startleft + AE.offsetx) + "px" : xOr;
      (!xOr || xOr == "v") ? xSl.top  = (AE.starttop  + AE.offsety) + "px" : xOr;
   };

   // **************************************************************************
   // Behavior

   this.SetProps = function(AE) {
      var xMoveBox = daa.n.Get("daa_movebox"); if (!xMoveBox) { return; }
      for (var xkey in AE) { xMoveBox["daa_" + xkey.replace(/^move/, "")] = AE[xkey]; }
   };

   // **************************************************************************
   // Initialization

   this.CreateNode = function() {
      var xNode = document.createElement("div");
      xNode.id = "daa_movebox";
      xNode.vcid = "movebox";
      //xNode.style.opacity = 0.2;
      document.body.appendChild(xNode);
      return xNode;
   };

   this.Close = function() {
      var xMoveBox = daa.n.Get("daa_movebox"); if (!xMoveBox) { return; }
      xMoveBox.innerHTML = "";
      xMoveBox.style.display = "none";
   };

   this.Create = function(AE) {
      var xVN   = AE.vn;                       if (!xVN)   { return null; }
      var xNode = AE[AE.moveitemname || "vn"]; if (!xNode) { return null; }

       // Create a clone of moving node
      var xMoveBox = daa.n.Get("daa_movebox") || this.CreateNode();
      xMoveBox.innerHTML = "";
      var xClone = daa.n.Clone(xNode);
      var xCt = xClone.style;
      if (daa.n.GetStyle(xClone, "display") != "flex") { xCt.display = "block"; }
      if (daa.View(xClone).RestoreExtents) { daa.View(xClone).RestoreExtents(xClone); }
      xCt.left = "auto"; xCt.top = "auto"; xCt.right = "auto"; xCt.bottom = "auto";
      xMoveBox.appendChild(xClone);

       // Save options to MoveBox
      xMoveBox.daa_orientation   = AE.moveorientation   || "";
      xMoveBox.daa_isoffsetfixed = AE.moveisoffsetfixed || "";
      xMoveBox.daa_translate     = AE.movetranslate     || "";
      xMoveBox.daa_condition     = AE.movecondition     || "";

       // Set coords and size
      var xW = daa.n.GetWidth(xNode, "ipbm"), yW = daa.n.GetWidth(xNode, "o");
      if (xW == yW) { xW = 200; } // Protection from zero width, especially if xNode is hidden inside a container with display=none

      var xOr = xMoveBox.daa_orientation;
      var xSl = xMoveBox.style;
      (!xOr || xOr == "h") ? xSl.left = (AE.startleft + AE.offsetx) + "px" : xSl.left = AE.startleft + "px";
      (!xOr || xOr == "v") ? xSl.top  = (AE.starttop  + AE.offsety) + "px" : xSl.top  = AE.starttop  + "px";
      xSl.width  = xW  + "px";
       // Show MoveBox
      xSl.display = "block";
   };
},

// *****************************************************************************
// @class MovePlaceholder daa.moveplaceholder @groupname util
// @classdesc
//    Displays placeholders for moving nodes.
//    Service class for daa.mover.

function MovePlaceholder() {
   this.path = "daa";
   this.name = "moveplaceholder";

   this.styles = {
      name: "Utility",
      "#daa_moveplaceholder": "display: none; position: absolute; z-index: 9997;",
      moveplaceholderlineh: "position: absolute; border: 0px; border-left: 1px dashed black; width:  0px; height: 100%;",
      moveplaceholderlinev: "position: absolute; border: 0px; border-top:  1px dashed black; width: 100%; height: 0px;",
      moveplaceholderover:  "position: absolute; background-color: grey; opacity: 0.8; width: 100%; height: 100%"
   };

   this.templates = {
      item: "<div id='daa_moveplaceholder_over' class='moveplaceholderover'></div><div id='daa_moveplaceholder_line'></div>"
   };

   // **************************************************************************
   // Event handlers

   var Names = {
      "h": {x: "x", left: "left", right: "right",  width: "width",  height: "height", center: "center"},
      "v": {x: "y", left: "top",  right: "bottom", width: "height", height: "width",  center: "center"}
   };

   this.Moving = function(AE) {
       // Validation
      if (!AE.destination) { return; }
      var xHolder  = daa.n.Get("daa_moveplaceholder"); if (!xHolder || xHolder.style.display != "block") { return; }
      if (xHolder.daa_condition && AE.destination.isconditioned != xHolder.daa_condition) {
         if (!daa.Condition(xHolder.daa_condition, AE)) { xHolder.style.visibility = "hidden"; return; }
         else { xHolder.style.visibility = "visible"; }
      }
      if (!("x" in AE.destination) || AE.destination.isomitted) { return; }

       // Initialization
      var xLine    = daa.n.Get(xHolder.id + "_line") || {style: {}};
      var xOr   = xHolder.daa_orientation || "v";              // Orientation
      var xN    = Names[xOr];                                  // Names[Orientation], just shorthand
      var xCode = xHolder.daa_placeholdercode || "lr";         // Code
      var xCoef = 1 / xCode.length;

       // Acquire needed vars from destination node
      var xNode = AE.destination.node || null;
      var xXY   = daa.n.GetXY(xNode, "", daa.REL_PAGE);
      var xWH   = daa.n.GetWH(xNode, "ipbm");
      var xX    = AE.destination[xN.x];
      var xMin  = Math.round(xWH[xN.width] * xCoef);
      var xMax  = xWH[xN.width] - xMin;
      var xHalf = Math.round(xWH[xN.width] / 2);

       // Detect left-center-right position
      var xPos = "l";
      if      (xCode.length == 1) { xPos = xCode; }
      else if (xCode.length == 2) {
         if      (xX < xMin) { xPos = xCode.split("")[0]; } else { xPos = xCode.split("")[1]; }
      } else {
         if      (xX < xMin)                { xPos = "l"; }
         else if (xX >= xMin && xX <= xMax) { xPos = "c"; }
         else if (xX > xMax)                { xPos = "r"; }
      }

       // Find sibling node to determine before-first/after-last half-width mode
      var eSiblingNode = AE.node, xSiblingNode = xNode;
      if (xHolder.daa_siblingtranslate) {
         eSiblingNode = daa.n.GetUpper(AE.node, xHolder.daa_siblingtranslate) || {};
         xSiblingNode = daa.n.GetUpper(xNode,   xHolder.daa_siblingtranslate) || {};
      }
      var xIsSibling = (xHolder.daa_siblingcondition && daa.Condition(xHolder.daa_siblingcondition, AE)) || daa.n.IsSibling(eSiblingNode, xSiblingNode);

      if (!xIsSibling) { xPos = "c"; }

       // Calculate left and width
      if      (xPos == "l") {
         if (!xSiblingNode.previousSibling) { xWH[xN.width] = xHalf; xXY["_" + xN.left] = 0; }
         else                               { xXY[xN.left] -= xHalf; xXY["_" + xN.left] = xHalf; }
      }
      else if (xPos == "c") {                 xXY[xN.left] += Math.round(xHalf / 2); xWH[xN.width] = xHalf; xXY["_" + xN.left] = -10000; }
      else if (xPos == "r") {
                                              xXY[xN.left] += xHalf - 1; xXY["_" + xN.left] = xHalf;
         if (!xSiblingNode.nextSibling)     { xWH[xN.width] = xHalf; }
      }

      AE.destination.position = xPos;

       // Display it
      var xSl = xHolder.style;
      xSl.left   = xXY.left   + "px";
      xSl.top    = xXY.top    + "px";
      xSl.width  = xWH.width  + "px";
      xSl.height = xWH.height + "px";
      xLine.style[xN.left] = xXY["_" + xN.left] + "px";
   };

   // **************************************************************************
   // Initialization

   this.IsActive = function() {
      var xHolder  = daa.n.Get("daa_moveplaceholder"); if (!xHolder || xHolder.style.display != "block") { return 0; }
      return 1;
   };

   this.CreateNode = function() {
      var xNode = document.createElement("div");
      xNode.id   = "daa_moveplaceholder";
      xNode.vcid = "moveplaceholder";
      xNode.innerHTML = this.templates.item;
      document.body.appendChild(xNode);
      return xNode;
   };

   this.Close = function() {
      var xHolder = daa.n.Get("daa_moveplaceholder"); if (!xHolder) { return; }
      xHolder.style.display = "none";
   };

   this.Create = function(AE) {

       // Create the placeholder
      var xHolder = daa.n.Get("daa_moveplaceholder") || this.CreateNode();
      var xLine   = daa.n.Get(xHolder.id + "_line") || {style: {}};
      var xOr   = AE.moveorientation || "v";
      var xCode = (AE.moveplaceholder && AE.moveplaceholder.replace(/t/, "l").replace(/b/, "r").replace(/m/, "c")) || "lr";
      xHolder.daa_placeholdercode  = xCode;
      xHolder.daa_orientation      = xOr;
      xHolder.daa_condition        = AE.movecondition        || "";
      xHolder.daa_siblingtranslate = AE.movesiblingtranslate || "";
      xHolder.daa_siblingcondition = AE.movesiblingcondition || "";

       // Reset line
      xLine.className = "moveplaceholderline" + xOr;
      xLine.style.left = "auto"; xLine.style.top = "auto";

       // Set extents
      var xSl = xHolder.style;
      xSl.width   = "0px";
      xSl.height  = "0px";
       // Show MovePlaceHolder
      xSl.visibility = "visible";
      xSl.display    = "block";
   };
},

// *****************************************************************************
// @class DropdownBox daa.dropdownbox @groupname util
// @classdesc
//    Provides methods to determine an adequate position
//    for dropdown boxes, sub-menus, floating editors etc. and to
//    open/close dropdown boxes.
//    Service class.

function DropdownBox() {
   this.path = "daa";
   this.name = "dropdownbox";

   this.properties = {
      isdropdownbox: 0
   };

   this.GetExtents = function(AE) {
      var xNode = daa.m.Args(AE, "node"); if (!xNode || !xNode.parentNode) { return; }
      var xPos  = AE.dropdownposition || xNode.daa_dropdownposition || "bottom left";
      var xExt  = daa.n.TestWH(xNode, "ipbm");
      var yWH   = daa.n.GetWH(xNode.parentNode, "ip");
       // Spaces for first and second position's directive correspondingly
      var xSP   = [
         {nleft: AE.left - xExt.width, ntop: AE.top - xExt.height, nright: AE.left + AE.width,              nbottom: AE.top + AE.height,
          sleft: AE.left,              stop: AE.top,               sright: yWH.width - AE.left - AE.width,  sbottom: yWH.height - AE.top - AE.height},
         {nleft: AE.left,              ntop: AE.top,               nright: AE.left + AE.width - xExt.width, nbottom: AE.top + AE.height - xExt.height,
          sleft: yWH.width - AE.left,  stop: yWH.height - AE.top,  sright: AE.left + AE.width,              sbottom: AE.top + AE.height             }
      ];
      xLi = xPos.indexOf("left");   if (xLi > 0) { xLi = 1; }
      xTi = xPos.indexOf("top");    if (xTi > 0) { xTi = 1; }
      xRi = xPos.indexOf("right");  if (xRi > 0) { xRi = 1; }
      xBi = xPos.indexOf("bottom"); if (xBi > 0) { xBi = 1; }
      if (xLi >= 0) {
         xExt.left = xSP[xLi].nleft;  if (xExt.width  > xSP[xLi].sleft && xExt.width    <= xSP[xLi].sright)  { xExt.left = xSP[xLi].nright; }
      }
      if (xRi >= 0) {
         xExt.left = xSP[xRi].nright; if (xExt.width  > xSP[xRi].sright && xExt.width   <= xSP[xRi].sleft)   { xExt.left = xSP[xRi].nleft;  }
      }
      if (xTi >= 0) {
         xExt.top = xSP[xTi].ntop;    if (xExt.height > xSP[xTi].stop && xExt.height    <= xSP[xTi].sbottom) { xExt.top  = xSP[xTi].nbottom; }
      }
      if (xBi >= 0) {
         xExt.top = xSP[xBi].nbottom; if (xExt.height > xSP[xBi].sbottom && xExt.height <= xSP[xBi].stop)    { xExt.top  = xSP[xBi].ntop;    }
      }
      return xExt;
   };

   this.Open = function(AE) {
      if (!AE.node || !AE.opener) { return; }
      daa.o.Merge(AE, daa.n.GetXY(AE.opener, "", daa.REL_PAGE));
      daa.o.Merge(AE, daa.n.GetWH(AE.opener, "ipbm"));
      var xXY = this.GetExtents(AE);
      AE.node.style.left    = xXY.left + "px";
      AE.node.style.top     = xXY.top  + "px";
      AE.node.style.display = "block";
      AE.node.style.zIndex  = daa.zorder.fw;
   };
},

// *****************************************************************************
// @class ViewLayout daa.viewlayout @groupname util
// @classdesc
//    Provides methods to manipulate Layout objects.
//    Service class.

function ViewLayout() {
   this.path = "daa";
   this.name = "viewlayout";

   this.Create = function(AContainer, AObj) {
      AContainer = AContainer || {};
      AObj = AObj || {};
      AObj.name = AObj.name || "layout";
      var xPath = daa.p.Concat(AContainer.path, AContainer.name);
      var xObj = {
         path: xPath,
         name: AObj.name,
         isvtree: 1, isviewlayout: 1,
         lastid: 0,
         proto: {
            path: daa.p.Concat(xPath, AObj.name),
            name: "proto",
            isproto: 1, isvtreeitem: 1, isviewdata: 1,
            vindex: 0, vlevel: 0, vcount: 0, vparent: "",
            vnid: "", vcid: ""
         },
      };
      daa.o.Merge(xObj, AObj, daa.IS_OVERRIDE);
      return xObj;
   };
},


// *****************************************************************************
// @class ViewData daa.viewdata @groupname util
// @classdesc
//    Provides methods to manipulate View Data objects.
//    Service class.

function ViewData() {
   this.path = "daa";
   this.name = "viewdata";

   this.Create = function(AContainer, AObj) {
      AContainer = AContainer || {};
      if (!("lastid" in AContainer)) { AContainer.lastid = 0; }
      AObj = AObj || {};
      AObj.name = AObj.name || "view";
      if (AContainer[AObj.name]) { AObj.name += AContainer.lastid; AContainer.lastid++; }
      var xObj = {
         path: daa.p.Concat(AContainer.path, AContainer.name),
         name: AObj.name,
         isproto: 1, isvtreeitem: 1, isviewdata: 1,
         vindex: 0, vlevel: 0, vcount: 0, vparent: ""
      };
      daa.o.Merge(xObj, AObj, daa.IS_OVERRIDE);
      return xObj;
   };
}
);

