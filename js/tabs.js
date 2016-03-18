daa.RegisterClasses(

// *****************************************************************************
// @class Tab daa.tab @groupname view

function Tab() {
   this.path = "daa";
   this.name = "tab";
   this.ancestors = "daa.zone";
   this.requires = "daa.caption, daa.split, daa.mover";

    // ***
    // @object daa.tab.events

   this.events = {
       // Sent from class caption
      onwantmove:    "WantMove",
      onwantcaption: "WantCaption",
       // Sent from class split
      onwantresize:  "WantResize",
       // Self fired
      onwantexpand:   "WantExpand",
      onwantcollapse: "WantCollapse",
      onexpanded:     "Expanded",
      oncollapsed:    "Collapsed"
   };

    // ***
    // @object daa.tab.properties

   this.properties = {
      onwantexpand:   1,
      onwantcollapse: 1,
      onexpanded:     1,
      oncollapsed:    1,
      isexpandable:   1,
      ismovable:      1,
      isresizable:    1,
      istabcaption:   0,
      istabbox:       0,
      istabsplit:     0
   };

    // ***
    // @object daa.tab.styles

   this.styles = {
      name: "Tabs",
      tab:    "",
      tabbox: "overflow: hidden; position: relative;"
   };

   var Names = {
      h: {left: "left", top: "top",  width: "width",  height: "height", flexdirection: "column"},
      v: {left: "top",  top: "left", width: "height", height: "width",  flexdirection: "row"}
   };

   // **************************************************************************
   // Event handlers

   this.WantMove = function(AE) {
      if (!AE.vn || !AE.vn.daa_ismovable) { return; }
      if (!daa.mover.IsPrepared(AE)) { daa.mover.Prepare(AE); }
      else if (daa.mover.GetDistance(AE) >= 5) {
         daa.mover.Create(AE);
         daa.movebox.Create(AE);
      }
   };

   this.WantCaption = function(AE) {
      if (!AE.vn || !AE.vn.daa_isexpandable) { return; }
      this.ExpandCollapse(AE);
   };

   this.WantResize = function(AE) {
      var xVN    = daa.m.Args(AE, "vn"); if (!xVN || !AE.extentname) { return; }
      var xCap   = daa.n.GetLower(xVN, {daa_istabcaption: 1});
      var xSplit = daa.n.GetLower(xVN, {daa_istabsplit: 1});
      var xMin   = daa.n.GetExtent(xVN, AE.extentname, "o") +
                   (xCap && daa.n.GetExtent(xCap, AE.extentname, "ipbm")) +
                   (xSplit && daa.n.GetExtent(xSplit, AE.extentname, "ipbm"));
      daa.n.SetExtent(xVN, AE.extentname, daa.MostInt(AE.extentvalue || 0, xMin));
      daa.e.Send({name: "resized", node: xVN, vn: xVN});
   };

   this.WantExpand   = function(AE) { daa.app.EventHandler(AE); };
   this.WantCollapse = function(AE) { daa.app.EventHandler(AE); };
   this.Expanded     = function(AE) { daa.app.EventHandler(AE); };
   this.Collapsed    = function(AE) { daa.app.EventHandler(AE); };

   // **************************************************************************
   // Behavior

   this.AddNode = function(AObj, ANode) {
      var xVN  = daa.m.Args(AObj, "vn");        if (!xVN) { return null; }
      var xBox = daa.n.Get(xVN.id + "_tabbox"); if (!xBox) { return null; }
      xBox.appendChild(ANode);
      return ANode;
   };

   this.RegainOwnership = function(AObj) {
      var xVN    = daa.m.Args(AObj, "vn"); if (!xVN) { return null; }
      if (xVN.daa_ispseudo) {
         if (daa.PseudoView(xVN).RegainOwnership) { return daa.PseudoView(xVN).RegainOwnership(xVN); }
         else                                     { return xVN; }
      }
      var xSplit = daa.n.GetLower(xVN, {daa_istabsplit: 1});   // Use GetLower because we might work with a clone of the tab, that has no parent yet
      var xBox   = daa.n.Get(xVN.id + "_tabbox"); if (xVN.daa_isclone) { var yBox = xBox.cloneNode(1); daa.n.CloneProperties(xBox, yBox); xBox = yBox; }
      if (xBox && xBox.parentNode != xVN) { if (xSplit) { xVN.insertBefore(xBox, xSplit); } else { xVN.appendChild(xBox); } }
      if (xBox && "daa_lostclassName" in xBox) { xBox.className = xBox.daa_lostclassName; delete xBox.daa_lostclassName; }
      return xVN;
   };

   this.ExpandCollapse = function(AObj) {
      var xVN  = daa.m.Args(AObj, "vn"); if (!xVN) { return; }
      var xCap = daa.n.GetLower(xVN, {daa_istabcaption: 1}); if (!xCap) { return; }
      if (xVN.daa_isexpanded) { daa.e.Send({name: "wantcollapse", node: xCap, vn: xVN}); }
      else { daa.e.Send({name: "wantexpand", node: xCap, vn: xVN}); }
      if (!xVN.daa_isexpandable) { return; }
      var xNodes = xVN.childNodes;
       // Find caption and show/hide other views
      for (var xi = 0; xi < xNodes.length; xi++) {
         if (xNodes[xi] == xCap) { continue; }
         daa.n.ShowHide(xNodes[xi]);
      }
      xVN.daa_isexpanded = daa.Swap(xVN.daa_isexpanded);
      if (xVN.daa_isexpanded) { daa.e.Send({name: "expanded", node: xCap, vn: xVN}); }
      else { daa.e.Send({name: "collapsed", node: xCap, vn: xVN}); }

       // Check if it is needed to change width/height of the tab
      var xN = Names[xVN.daa_orientation || "h"];
      if (!daa.css.IsSet(xVN, xN.height)) { return; }

       // Get Caption WH
      var xWH = daa.n.GetWH(xCap, "ipbm");
       // Set self WH according to !isexpanded and caption WH
      if (!xVN.daa_isexpanded) {
         xVN["daa_prev" + xN.height] = daa.n.GetExtent(xVN, xN.height, "ipbm");
         daa.n.SetExtent(xVN, xN.height, xWH[xN.height] + daa.n.GetExtent(xVN, xN.height, "o"));
      } else {
         daa.n.SetExtent(xVN, xN.height, xVN["daa_prev" + xN.height] || (xWH[xN.height] * 2 + daa.n.GetExtent(xVN, xN.height, "o")));
      }
   };

   // **************************************************************************
   // Filling

   this.Fill = function(AObj) {
      var xVN  = daa.m.Args(AObj, "vn"); if (!xVN) { return; }
      var xCap = daa.n.GetLower(xVN, {daa_istabcaption: 1}); if (!xCap) { return; }
      var xRef = {vn: xCap}; for (var xkey in daa.app.fillproperties) { if (xkey in AObj) { xRef[xkey] = AObj[xkey]; } }
      daa.View(xCap).Fill(xRef);
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
       // Initialize properties
      AVD.text          = AVD.text          || "Tab";
      AVD.buttons       = AVD.buttons       || "";
      AVD.orientation   = AVD.orientation   || "h";
      AVD.htmlclassName = AVD.htmlclassName || "tab";
      ("height" in AVD) ? AVD.isflex = 1 : AVD.isflex = 0;
      AVD.isflex ? AVD.htmlclassName = daa.csv.OR(AVD.htmlclassName, "flexboxcolumn", " ") : AVD;
      !AVD.isflex && AVD.isresizable ? AVD.isresizable = 0 : AVD;
      ("isexpanded" in AVD) ? AVD : AVD.isexpanded = 1;

      this.inherited.Init(AVD, AVN);

      var xCap = daa.caption.Create({vnid: AVN.id + "_tabcaption", mvnid: AVN.id, istabcaption: 1,
         orientation: AVD.orientation, buttons: AVD.buttons,
         text: AVD.text || "", modelpath: daa.n.ResolvePath(AVN, AVD.modelpath || "")}); AVN.appendChild(xCap);
      var xBox = daa.zone.Create({vnid: AVN.id + "_tabbox", mvnid: AVN.id, istabbox: 1,
         htmlclassName: daa.csv.OR("tabbox", (AVD.isflex && "flexboxcolumn flexclient") || "", " ")}); AVN.appendChild(xBox);
      if (AVD.isresizable) {
         var xSpl = daa.split.Create({vnid: AVN.id + "_tabsplit", mvnid: AVN.id, istabsplit: 1, orientation: AVD.orientation}); AVN.appendChild(xSpl);
      };
   };
},

// *****************************************************************************
// @class TabPseudo daa.tabpseudo @groupname view

function TabPseudo() {
   this.path = "daa";
   this.name = "tabpseudo";
   this.ancestors = "daa.view";

   this.RegainOwnership = function(AObj) {
      var xVN   = daa.m.Args(AObj, "vn");                    if (!xVN) { return null; }
      var xNode = daa.n.Get(xVN.id.replace(/_pseudo$/, "")); if (!xNode) { return null; }
      if (xVN.daa_isclone) { xNode = xNode.cloneNode(1); xNode.daa_isclone = 1; }
      return xNode;
   };

   this.Init = function(AVD, AVN) {
      AVD.ispseudo = 1;
      AVD.vcid     = "tab";
      this.inherited.Init(AVD, AVN);
      AVN.innerHTML = "Pseudo";
   };
},

// *****************************************************************************
// @class Tabs daa.tabs @groupname view

function Tabs() {
   this.path = "daa";
   this.name = "tabs";
   this.ancestors = "daa.items, daa.zone";
   this.requires = "daa.caption, daa.mover, daa.tabpseudo, daa.tab";

    // ***
    // @object daa.tabs.events

   this.events = {
      onwantmove: "WantMove",
   };

   this.rootevents = {
       // slaves after onmoved/onmoving, Sent by class mover
       // these events are declared as 'root' to catch other views moving over the tabs
      onmovedinside:   "MovedInside",
      onmovinginside:  "MovingInside",
      onmovingoutside: "MovingOutside"
   };

   this.slaveevents = {
      onmovedinside: {
         mastername: "moved",
         condition:  "this/destination/vn/daa_tabownerid != null || this/destination/node/daa_istabshead == 1"
      },
      onmovinginside: {
         mastername: "moving",
         condition:  "this/destination/vn/daa_tabownerid != null || this/destination/node/daa_istabshead == 1"
      },
      onmovingoutside: {
         mastername: "moving",
         condition:  "this/destination/vn/daa_tabownerid == null && this/destination/node/daa_istabshead != 1"
      },
   };

    // ***
    // @object daa.tabs.properties

   this.properties = {
      isitemalienable: 1,
      istabsctrl:      0,
      istabshead:      0,
      istabsbox:       0,
      tabownerid:      0
   };

    // ***
    // @object daa.tabs.styles

   this.styles = {
      name: "Tabs",
      tabs:             "overflow: hidden;",
      tabsctrl:         "display: none;",
      tabshead:         "display: flex; flex-direction: row; overflow: hidden; border-bottom: 1px solid #ddd;",
      "tabshead:empty": "min-height: 20px;",
      tabsbox:          "flex: 1 1 0%; display: flex; flex-direction: column; overflow: hidden;",
   };

    // ***
    // @object daa.tabs.templates

   this.templates = {
      tabsctrl:    "<div id='%vnid%_tabsctrl' daa_istabsctrl class='tabsctrl'></div>",
      tabshead:    "<div id='%vnid%_tabshead' daa_istabshead class='tabshead'></div>",
      tabsbox:     "<div id='%vnid%_tabsbox'  daa_istabsbox  class='tabsbox'></div>"
   };

   var Names = {
      h: {left: "left", top: "top",  width: "width",  height: "height", flexdirection: "column"},
      v: {left: "top",  top: "left", width: "height", height: "width",  flexdirection: "row"}
   };

   // **************************************************************************
   // Event handlers

   this.MovedInside = function(AE) {

       // Since the event is conditioned as 'inside', we suppose:
       //    - AE.vn should be a class caption, having daa_tabownerid, pointing to its tab.
       //         It also might be a real caption (while changing items positions) or
       //         a temporary caption (if the tab is moved here from outside the tabs).
       //    - AE.destination.vn might be a tabs.caption or the tabs.tabshead.
      if (!AE.vn) { return; }
      var xDest = AE.destination; if (!xDest.vn || !xDest.position) { return; }
       // Get the destination Tabs vn. If moved over a caption, tabs should be acquired as a MasterVN of the caption
      var xVN   = xDest.vn; if (xVN.vcid && xVN.mvnid) { xVN = daa.n.GetMasterVN(xVN); } if (!xVN) { return; }
       // Get the tabs caption to insert before. If moved over the tabshead - xCap should be null
      var xCap  = (xDest.vn.vcid && xDest.vn) || null;
      var xPos  = xDest.position;
      if (xPos == "r") {
          // Translate 'r' position to 'l', getting next caption. If no next - select 'c' position and null the xCap
         xCap = daa.n.GetNextVN(xCap);
         xCap ? xPos = "l" : xPos = "c";
      }
      if (AE.vn.daa_istemporary) {
          // Insert the node from outside
         var xNode = daa.n.Get(AE.vn.daa_tabownerid);
         this.ClearTemporaryItems(xVN);
         var xNewCap = this.InsertNode(xVN, xNode, xCap);
         daa.e.Send({name: "wantselectitem", node: xNewCap, vn: xVN});
      } else {
          // Change caption position
         this.MoveItem(xVN, AE.vn, xCap);
      }
   };

   this.MovingInside = function(AE) {
       // Tab is coming if moving an independent tab or the tab was already 'alienated' from its native Tabs while moving outside.
       // Caption is coming if moving within the same Tabs or if there's no meaning screen interval between different tabs,
       //    so, the caption has no reason yet to be 'alienated' from its native Tabs to the 'virtual moving tab'.
      var xClassName = (daa.class.Is(AE.vn, "tab") && "tab") || (daa.class.Is(AE.vn, "caption") && "caption") || "";
      if (xClassName == "tab" || (xClassName == "caption" && AE.vn.daa_tabownerid)) {
          // Get Tabs we are moving over
         var xVN   = AE.destination.vn; if (xVN.mvnid) { xVN = daa.n.GetMasterVN(xVN); }
         var xNode = AE.vn;  // Tab or Caption, see xClassName
         var xTab  = null, xCap = null;
         if (xClassName == "caption") {
            xCap = xNode;
            var xMVN = daa.n.GetMasterVN(xCap);
             // If the moving caption belongs to the Tabs we are currently moving over, we must exit without doing anything.
            if (xMVN == xVN) { return; }
             // Else we have to clear possible temporary captions from tabs whose caption is moving
            else if (daa.class.Is(xMVN, "tabs")) { this.ClearTemporaryItems(xMVN); }
             // Acquire the tab from the caption
            xTab = daa.n.Get(xCap.daa_tabownerid);
         } else {
            xTab = xNode;
             // Acquire the caption from the tab
            xCap = daa.n.GetLower(xTab, {daa_istabcaption: 1});
         }
         var yCap  = this.CreateTemporaryItem(xVN, xTab); if (!yCap) { return; }

          // Translate moving event from moving element to the tabs caption
         var xE    = daa.e.ToNode(AE, yCap);
          // Modify extents to save the current mouse position relative to the caption's content
         var xXY = daa.n.GetXYOrigin(yCap, "pbm");
         if (xClassName == "tab") {
             // We do not need to add this offset if moving has come from another Tabs directly
            daa.o.SUB(xXY, daa.n.TestXY(xCap, xTab));
            daa.o.SUB(xXY, daa.n.GetXYOrigin(xTab));
         }
         daa.o.SUB(xXY, daa.n.GetXYOrigin(xCap, "pbm"));
         xE.nodex = AE.startx - AE.startleft + xXY.left;
         xE.nodey = AE.starty - AE.starttop  + xXY.top;

          // Recapture moving to the tabs caption
         daa.mover.Clear();
         this.ActivateItemMoving(xE);
      }
   };

   this.MovingOutside = function(AE) {
      if (AE.vn && AE.vn.daa_tabownerid) {
          // Alienate the tab, create a 'virtual moving tab', using caption's 'daa_tabownerid'
         var xTab = daa.n.Get(AE.node.daa_tabownerid);
         var xCap = daa.n.GetLower(xTab, {daa_istabcaption: 1}) || xTab;  // Acquire real tab caption to determine XY offset
         var xMVN = daa.n.Get(AE.vn.mvnid); if (xMVN && daa.n.GetParentVN(xTab) == xMVN && !xMVN.daa_isitemalienable) { return; }

          // Translate moving event from tabs caption to the tab
         var xE    = daa.e.ToNode(AE, xTab);
          // Modify extents to save the current mouse position relative to the caption's content
         var xXY = daa.n.GetXYOrigin(AE.vn, "pbm");
         if (xCap != xTab) {
             // We do not need to add this if we're about to extract a non-tab-class vn from tabs, f.e. a label or tree resided in tabs :)
            daa.o.SUB(xXY, daa.n.TestXY(xCap, xTab));
            daa.o.SUB(xXY, daa.n.GetXYOrigin(xTab));
         }
         daa.o.SUB(xXY, daa.n.GetXYOrigin(xCap,  "pbm"));
         xE.nodex = AE.startx - AE.startleft - xXY.left;
         xE.nodey = AE.starty - AE.starttop  - xXY.top;

          // Clear temporary captions, if those were created before
         if (AE.node.daa_istemporary) { this.ClearTemporaryItems(daa.n.GetMasterVN(AE.node)); }
          // Recapture moving to the 'virtual moving tab'
         daa.mover.Clear();
         daa.mover.Create(xE);
         daa.movebox.Create(xE);
      }
   };

   this.WantMove = function(AE) {
      if (!AE.source || !AE.source.vn) { return; }
      if (!AE.vn || !AE.vn.daa_isitemmovable) { return; }
      var xE = daa.e.ToNode(AE.source, AE.source.vn);
      if (!daa.mover.IsPrepared(xE)) { daa.mover.Prepare(xE); }
      else if (daa.mover.GetDistance(xE) >= 5) {
         this.ActivateItemMoving(xE);
      }
   };

   // **************************************************************************
   // Behavior

   this.SelectItem = function(AE) {
      if (!AE.vn || !AE.node) { return; }
      var xVN   = AE.vn;
      var xNode = AE.node;
      if (xVN.daa_selectedid == xNode.id) { return; }
      daa.e.Send({name: "wantunselectitem", vn: xVN});
      daa.n.Select(xNode, xVN);
      var xItemBox = daa.n.Get(xNode.id.replace(/_itemcaption/, "") + "_tabbox");
      if (xItemBox) { daa.n.Show(xItemBox); }
      daa.e.Send({name: "selecteditem", node: xNode, vn: xVN}, AE);
   };

   this.UnselectItem = function(AE) {
      if (!AE.vn || !AE.vn.daa_selectedid) { return; }
      var xVN   = AE.vn;
      var xNode = AE.node || daa.n.GetLower(xVN, {id: xVN.daa_selectedid}); if (!xNode) { return; }
      var xBox  = daa.n.GetLower(xVN, {daa_istabsbox: 1}); if (!xBox) { return; }
      daa.n.Unselect(xNode, xVN);
       // Find itembox if it's still residing in tabs's box only. This prevents
       //    from hiding itembox if a tab is being deleted from the tabs and it
       //    is about to regain ownership of this itembox.
      var xItemBox = daa.n.GetLower(xBox, {id: xNode.id.replace(/_itemcaption/, "") + "_tabbox"});
      if (xItemBox) { daa.n.Hide(xItemBox); }
      daa.e.Send({name: "unselecteditem", node: xNode, vn: xVN});
   };

   this.ActivateItemMoving = function(AE) {
      daa.o.Merge(AE,
         {
         moveitemname:          "node",
         movetranslate:         "ToUpper where this/daa_tabownerid != null || this/daa_istabshead == 1",
         movecondition:         "this/destination/node/daa_tabownerid != null || this/destination/node/daa_istabshead == 1",
         movesiblingcondition:  "this/destination/node/daa_isitem == 1",
         moveorientation:       "h",
         moveplaceholder:       "lr"
         }
      );
      daa.mover.Create(AE);
      daa.movebox.Create(AE);
      daa.moveplaceholder.Create(AE);
   };

   this.CreateTemporaryItem = function(AObj, ANode) {
       // Initialization
      var xVN      = daa.m.Args(AObj, "vn");                    if (!xVN)   { return; }
      var xHead    = daa.n.GetLower(xVN, {daa_istabshead: 1});  if (!xHead) { return; }
      var xID      = (ANode.id && ANode.id.replace(/_pseudo/, "")) || "";
       // Try to get the real caption within the same Tabs
      var xItemCap = daa.n.Get(xID + "_itemcaption");           if (xItemCap && xItemCap.parentNode == xHead) { return xItemCap; }
       // Try to get a temporary caption within the same Tabs
      xItemCap     = daa.n.Get(xID + "_itemcaption/" + xVN.id); if (xItemCap) { return xItemCap; }
       // No caption, so create it
      xItemCap     = daa.caption.Create({
         vnid: xID + "_itemcaption/" + xVN.id,
         mvnid: xVN.id, tabownerid: ANode.id, isitem: 1, istemporary: 1,
         text: (ANode.vd && ANode.vd.text) || "Tab", htmlclassName: "caption tabsitemcaption"});
      xHead.appendChild(xItemCap);
      if (!xVN.daa_temporaryitems) { xVN.daa_temporaryitems = []; }
      xVN.daa_temporaryitems.push(xItemCap.id);
      return xItemCap;
   };

   this.ClearTemporaryItems = function(AObj) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN || !xVN.daa_temporaryitems) { return; }
      var xNode = null, xTemp = xVN.daa_temporaryitems;
      while (xTemp.length) {
         xNode = daa.n.Get(xTemp.shift());
         if (xNode && xNode.parentNode) { xNode.parentNode.removeChild(xNode); }
      }
   };

   this.AddNode = function(AObj, ANode) {
       // Initialization
      var xVN   = daa.m.Args(AObj, "vn"); if (!xVN) { return null; }
      var xCtrl = daa.n.GetLower(xVN, {daa_istabsctrl: 1}); if (!xCtrl) { return null; }
      var xHead = daa.n.GetLower(xVN, {daa_istabshead: 1}); if (!xHead) { return null; }
      var xBox  = daa.n.GetLower(xVN, {daa_istabsbox:  1}); if (!xBox)  { return null; }

       // Check the hierarchy to avoid inserting parent of xVN to xVN
      var xHier = daa.n.GetVNHierarchy(xVN);
      if (xHier[ANode.id]) { return null; }

       // Fish ANode out of its previous parent
      if (ANode.parentNode) { ANode = daa.View(ANode.parentNode).DeleteNode(ANode.parentNode, ANode); }

       // Determine if adding a class Tab
      var xIsTab   = 1;                  // Default is 'adding a class Tab'
      var xMVNID   = ANode.id;           // Default master vn id for alienated blocks (caption, tabbox) of the Tab
      var xItemBox = daa.n.GetLower(ANode, {daa_istabbox: 1});
      if (!xItemBox) {
          // It doesn't seem to be a Tab, so, create 'pseudo' Tab blocks
         xIsTab = 0;                     // Set to 'adding not a class Tab'
         xMVNID = ANode.id + "_pseudo";  // Master vn id should be appended with '_pseudo' postfix
         xItemBox = daa.zone.Create({vnid: ANode.id + "_tabbox", mvnid: xMVNID, htmlclassName: "tabbox"});
         xItemBox.appendChild(ANode);    // Add the whole ANode to the tabbox, because ANode is not a tab
          // Add a 'pseudo' tab to the Control block
         xCtrl.appendChild(daa.tabpseudo.Create({vnid: xMVNID, islostownership: 1}));
      } else {
          // Add the real tab to the Control block and point that it has lost ownership over its blocks (caption and tabbox)
         xCtrl.appendChild(ANode); ANode.daa_islostownership = 1;
      }
      if (!("daa_lostclassName" in xItemBox)) { xItemBox.daa_lostclassName = xItemBox.className; }
      if (!xVN.vd.isflex) {
          // Remove flex- classes if the tabs has no height and no flex class assigned to itself.
         xItemBox.className = daa.csv.NOT(xItemBox.className, "flexboxcolumn flexboxrow flexclient", " ");
      } else {
         xItemBox.className = daa.csv.OR(xItemBox.className, "flexboxcolumn flexclient", " ");
      }

       // Add the tabbox
      if (xVN.daa_itemcount) { daa.n.Hide(xItemBox); }
      xBox.appendChild(xItemBox);

       // Create special Tabs caption, for the reason the Tab's own caption may look different and have other set of caption's buttons
      var xPath = daa.n.ResolvePath(ANode, ANode.vd.modelpath || "");
      var xItemCap = daa.caption.Create({
         vnid: ANode.id + "_itemcaption",
         mvnid: xVN.id,             // Link the caption to the Tabs, not to a Tab added!
         tabownerid: xMVNID,        // Special Tabs caption property, pointing to the Tab
         isitem: 1,
         text: ANode.vd.text || "Tab",
         modelpath: xPath,
         htmlclassName: "caption tabsitemcaption" // TODO remove hardcoded className!
      }); xItemCap.daa_modelpath = xPath;

       // Add the caption
      if (AObj.insertid) {
         var xInsCap = daa.n.Get(AObj.insertid);
         (xInsCap && xInsCap.parentNode == xHead) ? xHead.insertBefore(xItemCap, xInsCap) : xHead.appendChild(xItemCap);
      } else { xHead.appendChild(xItemCap); }

      if (!xVN.daa_itemcount) { daa.e.Send({name: "wantselectitem", node: xItemCap, vn: xVN}); }

      xVN.daa_itemcount++;

      return xItemCap;
   };

   this.InsertNode = function(AObj, ANode, BNode) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return null; }
      return this.AddNode({vn: xVN, insertid: (daa.IsNode(BNode) && BNode.id) || BNode}, ANode);
   };

   this.DeleteNode = function(AObj, ANode) {
      var xVN       = daa.m.Args(AObj, "vn"); if (!xVN) { return null; }
      var xCtrl     = daa.n.Get(xVN.id + "_tabsctrl"); if (!xCtrl) { return null; }
      var xIsPseudo = ANode.daa_ispseudo || 0;
       // Regain ANode ownership of its original parts. Note, that 'pseudo' items
       //    are turned into an original class and ANode doesn't remain the same!
       //    This is why xIsPseudo var is initialized before regain ownership.
      if (daa.View(ANode).RegainOwnership) { ANode = daa.View(ANode).RegainOwnership(ANode); }
      ANode.daa_islostownership = 0;

        // Free ANode general VN from residing in xCtrl block of tabs.
      if (ANode.parentNode == xCtrl) { xCtrl.removeChild(ANode); }

       // Delete tabs's item caption and unselect/select items
      var xItemCap = daa.n.Get(ANode.id + "_itemcaption");
      if (xItemCap && xItemCap.parentNode) {
         daa.e.Send({name: "wantunselectitem", node: xItemCap, vn: xVN});
         var xNext = this.GetNextItem(xVN, xItemCap); if (!xNext) { xNext = this.GetPrevItem(xVN, xItemCap); }
         if (xNext) { daa.e.Send({name: "wantselectitem", node: xNext, vn: xVN}); }
         xItemCap.parentNode.removeChild(xItemCap);
      }
       // Delete 'pseudo' elements if needed.
      if (xIsPseudo) {
         var xItemPse = daa.n.Get(ANode.id + "_pseudo"); if (xItemPse && xItemPse.parentNode) { xItemPse.parentNode.removeChild(xItemPse); }
         var xItemBox = daa.n.Get(ANode.id + "_tabbox"); if (xItemBox && xItemBox.parentNode) { xItemBox.parentNode.removeChild(xItemBox); }
      }

      xVN.daa_itemcount--;
      return ANode;
   };

   this.MoveItem = function(AObj, ANode, BNode) {
      if (!ANode) { return; }
      var xHead  = daa.n.GetLower(daa.m.Args(AObj, "vn"), {daa_istabshead:   1}); if (!xHead) { return; }
      var xBNode = daa.m.Args(BNode, "node");
      if (xBNode && xBNode.parentNode == xHead) { xHead.insertBefore(ANode, xBNode); }
      else { xHead.appendChild(ANode); }
   };

   this.GetHeadNode  = function(AObj)        { return daa.n.GetLower(daa.m.Args(AObj, "vn"), {daa_istabshead: 1}); };
   this.GetFirstItem = function(AObj)        { return daa.n.GetFirstVN(this.GetHeadNode(AObj)); };
   this.GetLastItem  = function(AObj)        { return daa.n.GetLastVN(this.GetHeadNode(AObj)); };
   this.GetNextItem  = function(AObj, ANode) { return daa.n.GetNextVN(ANode); };
   this.GetPrevItem  = function(AObj, ANode) { return daa.n.GetPrevVN(ANode); };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
       // Initialize properties
      AVD.orientation     = AVD.orientation || "h";
      AVD.htmlclassName   = AVD.htmlclassName || "tabs";
      ("height" in AVD) ? AVD.isflex = 1 : AVD.isflex = 0;
      AVD.isflex ? AVD.htmlclassName = daa.csv.OR(AVD.htmlclassName, "flexboxcolumn", " ") : AVD;

      this.inherited.Init(AVD, AVN);
      AVN.daa_itemcount = 0;

      daa.n.CreateFromTemplate(daa.pattern.Fill((AVD.templates && AVD.templates.tabsctrl) || this.templates.tabsctrl, AVD), AVN);
      daa.n.CreateFromTemplate(daa.pattern.Fill((AVD.templates && AVD.templates.tabshead) || this.templates.tabshead, AVD), AVN);
      daa.n.CreateFromTemplate(daa.pattern.Fill((AVD.templates && AVD.templates.tabsbox) || this.templates.tabsbox,  AVD), AVN);
   };
}

);

