daa.RegisterClasses(

// *****************************************************************************
// @class TreeItems daa.treeitems @groupname abstract
// @classdesc
//    Provides methods to create and maintain
//    Tree Item Nodes and to handle related events.

function TreeItems() {
   this.path = "daa";
   this.name = "treeitems";

    // ***
    // @object daa.treeitems.events

   this.events = {
      onwantexpanditem:   "WantExpandItem",
      onwantcollapseitem: "WantCollapseItem",
      onwantcollapseall:  "WantCollapseAll",
      onexpandeditem:     "ExpandedItem",
      oncollapseditem:    "CollapsedItem"
   };

    // ***
    // @object daa.treeitems.properties

   this.properties = {
      onwantexpanditem:   1,
      onwantcollapseitem: 1,
      onwantcollapseall:  1,
      onexpandeditem:     1,
      oncollapseditem:    1,
      isitemexpandable:   1,
      isenterexpand:      1,
      isspaceexpand:      1
   };

   this.WantExpandItem   = function(AE) { daa.app.EventHandler(AE); this.ExpandItem({node: AE.node, vn: AE.vn}); };
   this.WantCollapseItem = function(AE) { daa.app.EventHandler(AE); this.CollapseItem({node: AE.node, vn: AE.vn}); };
   this.WantCollapseAll  = function(AE) { daa.app.EventHandler(AE); this.CollapseAll({vn: AE.vn}); };
   this.ExpandedItem     = function(AE) { daa.app.EventHandler(AE); };
   this.CollapsedItem    = function(AE) { daa.app.EventHandler(AE); };

    // ***
    // @method daa.treeitems.ExpandItem

   this.ExpandItem       = function(AE) { };

    // ***
    // @method daa.treeitems.CollapseItem

   this.CollapseItem     = function(AE) { };

    // ***
    // @method daa.treeitems.CollapseAll

   this.CollapseAll      = function(AE) { };

},

// *****************************************************************************
// @class Tree daa.tree @groupname view

function Tree() {
   this.path = "daa";
   this.name = "tree";
   this.ancestors = "daa.treeitems, daa.list";
   this.requires = "daa.mover";

    // ***
    // @object daa.tree.styles

   this.styles = {
      name:      "Tree",
      tree:           "",
      treegroup:      "",
      treeitemwrp:    "",
      treeitem:       "padding: 2px 4px; overflow: hidden; white-space: nowrap;",
      "treeitem a":   "text-decoration: none; color: inherit;",
      "treeitem a:hover": "color: red;",
      treeitemicon:   "background-position: center center; background-repeat: no-repeat; display: inline-block; width: 11px; height: 11px; vertical-align: -1px; margin-right: 4px",
      treeitemicon00: "background-image: url('data:image/gif;base64,R0lGODlhCwALAJEAAAAAAKysrP///wAAACH5BAEAAAEALAAAAAALAAsAQAIYjI8Hy4AgYnSqrSdn2rzDTBmfFAaj1iEFADs=');",
      treeitemicon01: "cursor: pointer; background-image: url('data:image/gif;base64,R0lGODlhCwALAJEAAAAAAKysrP///wAAACH5BAEAAAEALAAAAAALAAsAQAIYjI8Hy4AgYnSqrSdn2rzDTBmfFAaj1iEFADs=');",
      treeitemicon10: "cursor: pointer; background-image: url('data:image/gif;base64,R0lGODdhCwALAIAAAP///wAAACwAAAAACwALAAACFYyPBsus3d4Kkbo6UY74OgttYZYkBQA7');",
      treeitemicon11: "cursor: pointer; background-image: url('data:image/gif;base64,R0lGODdhCwALAIAAAP///wAAACwAAAAACwALAAACFIyPBsus3R5ccr5Ew3R6gwqBUUIWADs=');"
   };

    // ***
    // @object daa.tree.templates

   this.templates = {
      group: "<ul id='%vnid%_group/%id%' daa_isgroup class='treegroup'></ul>",
      item:  "<li id='%vnid%_wrp/%id%' daa_isitemwrp class='treeitemwrp'>" +
                "<div id='%vnid%_item/%id%' daa_isitem class='treeitem' style='padding-left: {{4 + 15 * %vlevel%}}px'>" +
                   "<span id='%vnid%_btnexpand/%id%' daa_isbtnexpand class='treeitemicon treeitemicon%isitems%%isexpanded%'></span>" +
                   "<span id='%vnid%_data/%id%' daa_isdata>{{'%name%' || '&nbsp;'}}{{\"%value%\" && \": %value%\"}}</span>" +
                "</div>" +
             "</li>"
   };

    // ***
    // @object daa.tree.events

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      if (AE.button != "left") { return; }
      if (!AE.node) { return; }
      var xNode = AE.node;
      if (xNode.daa_isgroup || xNode.daa_isitemwrp || xNode.daa_isbtnexpand) { return; }
      if (AE.vn.daa_isitemmovable && (AE.islongtap || !daa.e.IsTouchDown(AE))) { daa.mover.Prepare(daa.e.ToItemNode(AE)); }
      this.inherited.MouseDown(AE);
   };

   this.MouseUp = function(AE) {
      if (AE.button != "left") { return; }
      daa.mover.Clear();
   };

   this.MouseMove = function(AE) {
      if (!AE.node || !daa.e.IsMouseDown(AE)) { return; }
      var xNode = AE.node;
      if (xNode.daa_isgroup || xNode.daa_isitemwrp || xNode.daa_isbtnexpand) { return; }
      if (daa.mover.IsPrepared(AE) && daa.mover.GetDistance(AE) >= 5) {
         daa.o.Merge(AE,
            {
            moveitemname:          "node",
            movetranslate:         "ToItemNode",
            movecondition:         "this/destination/vn/id == this/vn/id",
            movesiblingtranslate:  "ToUpper where this/daa_isitemwrp == 1",
            movesiblingcondition:  "this/destination/node/daa_isitem == 1",
            moveorientation:       "v",
            moveisoffsetfixed:     1,
            moveplaceholder:       "tcb"
            }
         );
         daa.mover.Create(AE);
         daa.movebox.Create(AE);
         daa.moveplaceholder.Create(AE);
      }
   };

   this.Click = function(AE) {
      if (AE.button != "left") { return; }
      if (!AE.node) { return; }
      if (AE.node.daa_isbtnexpand && AE.vn.daa_isitemexpandable) { this.ExpandCollapse({node: this.GetItemNode({node: AE.node})}); }
      if (AE.vn.daa_onselecteditem) { daa.e.Cancel(); }
   };

   // **************************************************************************
   // Behavior

   this.GatherItemEnv = function(AE) {
      if (!AE.node || !AE.node.daa_isitem) { return; }
      AE.nodewrp = daa.n.GetUpper(AE.node,    {daa_isitemwrp: 1});
      AE.nodegrp = daa.n.GetLower(AE.nodewrp, {daa_isgroup: 1});
      AE.nodebtn = daa.n.GetLower(AE.node,    {daa_isbtnexpand: 1});
   };

   this.ExpandItem = function(AE) {
      if (!AE.node || !AE.node.daa_isitem || !AE.node.daa_isitems) { return; }
      this.GatherItemEnv(AE);
      AE.node.daa_isexpanded = 1;
      if (AE.nodebtn) { AE.nodebtn.className     = "treeitemicon treeitemicon11"; }
      if (AE.nodegrp) { AE.nodegrp.style.display = "block"; }
      daa.e.Send({name: "expandeditem", node: AE.node});
   };

   this.CollapseItem = function(AE) {
      if (!AE.node || !AE.node.daa_isitem) { return; }
      this.GatherItemEnv(AE);
      AE.node.daa_isexpanded = 0;
      if (AE.nodebtn) { AE.nodebtn.className     = "treeitemicon treeitemicon10"; }
      if (AE.nodegrp) { AE.nodegrp.style.display = "none"; }
      daa.e.Send({name: "collapseditem", node: AE.node});
   };

   this.ExpandCollapse = function(AE) {
      if (!AE.node || !AE.node.daa_isitem) { return; }
      if (AE.node.daa_isexpanded) { daa.e.Send({name: "wantcollapseitem", node: AE.node}); }
      else                        { daa.e.Send({name: "wantexpanditem",   node: AE.node}); }
   };

   // **************************************************************************
   // Filling

   this.CreateItems = function(AObj, AModel) {
      var xNode = this.inherited.CreateItems(AObj, AModel); if (!xNode) { return null; }
      if (!AObj.isexpanded) { xNode.style.display = "none"; }
      return xNode;
   };

   this.FillPrepare = function(AObj) {
      var xObj = this.inherited.FillPrepare(AObj); if (!xObj) { return; }
      xObj.istree = 1;
      xObj.isexpanded = 1;
      return xObj;
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "tree";
      ("isitemexpandable" in AVD) ? AVD : AVD.isitemexpandable = 1;
      this.inherited.Init(AVD, AVN);
   };
},


// *****************************************************************************
// @class VTree daa.vtree @groupname view

function VTree() {
   this.path = "daa";
   this.name = "vtree";
   this.ancestors = "daa.tree";

    // ***
    // @object daa.vtree.templates

   this.templates = {
      item: "<li id='%vnid%_wrp/%id%' daa_isitemwrp class='treeitemwrp'>" +
               "<div id='%vnid%_item/%id%' daa_isitem class='treeitem' style='padding-left: {{4 + 15 * %vlevel%}}px;'>" +
                  "<span id='%vnid%_btnexpand/%id%' daa_isbtnexpand class='treeitemicon treeitemicon%isitems%%isexpanded%'></span>" +
                  "<span id='%vnid%_data/%id%' daa_isdata>{{'%title%' || '%name%' || '&nbsp;'}}</span>" +
               "</div>" +
            "</li>"
   };

   // **************************************************************************
   // Filling

   this.FillPrepare = function(AObj) {
      var xObj = this.inherited.FillPrepare(AObj); if (!xObj) { return; }
      xObj.isvirtual = 1;             // Tells CreateItems to use vo.Iterate instead of o.Iterate
      return xObj;
   };
},

// *****************************************************************************
// @class Menu daa.menu @groupname view

function Menu() {
   this.path = "daa";
   this.name = "menu";
   this.ancestors = "daa.vtree";
   this.requires = "daa.dropdownbox";

    // ***
    // @object daa.menu.events

   this.events = {
      onsubmit:    "Submit"
   };

    // ***
    // @object daa.menu.properties

   this.properties = {
      onsubmit: 1
   };

    // ***
    // @object daa.menu.styles

   this.styles = {
      name:         "Menu",
      menu:         "",
      menugrouph:   "",
      menuitemwrph: "display: inline-block",
      menugroupv:   "position: absolute; background-color: white; opacity: 0.9;",
      menugroupvv:  "box-shadow: 0px 2px 3px -1px #888",
      menugroupvh:  "box-shadow: 2px 2px 3px -1px #888",
      menuitemwrpv: "border-bottom: 1px solid #ccc",
      "menuitemwrpv:last-child": "border-bottom: 0px",
      menuitem:     "padding: 6px 10px; cursor: default;",
      menuitemh:    "",
      menuitemv:    ""
   };

    // ***
    // @object daa.menu.templates

   this.templates = {
      group: "<ul id='%vnid%_group/%id%' daa_pvnid='%vnid%' daa_isgroup class='menugroup%orientation% menugroup%orientation%{{(%vlevel% > 1 && \'h\') || \'v\'}}'></ul>",
      item:  "<li id='%vnid%_wrp/%id%' daa_isitemwrp class='menuitemwrp%orientation%'>" +
                "<div id='%vnid%_item/%id%' daa_isitem class='menuitem menuitem%orientation%'>" +
                   "<span id='%vnid%_data/%id%' daa_isdata>{{'%title%' || '%name%' || '&nbsp;'}}</span>" +
                "</div>" +
             "</li>"
   };

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      if (AE.button != "left") { return; }
      var xNode = this.GetItemNode(AE); if (!xNode) { return; }
      if (!xNode.daa_isexpanded) { daa.e.Send({name: "wantexpanditem", node: xNode}); }
      if (!xNode.daa_isselected) { daa.e.Send({name: "wantselectitem", node: xNode}); }
   };

   this.MouseOver = function(AE) {
      if (!AE.vn || !AE.vn.daa_selectedid) { return; }
      this.MouseDown(AE);
   };

   this.MouseUp = function(AE) {
      if (AE.button != "left") { return; }
      var xNode = this.GetItemNode(AE); if (!xNode) { return; }
      var xLink = daa.n.GetLower(xNode, {tagName: "A"});
      if (xNode.daa_isitems) { return; }
      if (xNode.daa_vlevel || AE.vn.daa_onsubmit) {
         daa.e.Send({name: "submit", node: xNode, vn: AE.vn}, AE);
         daa.e.Send({name: "wantcollapseall", vn: AE.vn});
      }
      if (xLink && !AE.vn.daa_onselecteditem) { window.location = xLink.href; }
   };

   this.Submit = function(AE) { daa.app.EventHandler(AE); };

   // **************************************************************************
   // Behavior

   this.SelectItem = function(AE) {
      if (!AE.vn || !AE.node || AE.node == AE.vn) { return; }
      var xNode = AE.node;
      var xVN   = daa.n.GetVN(xNode); if (!xVN) { return; }
      if (xVN.daa_selectedid == xNode.id) { return; }
      var xParGrp = xVN; if (xNode.daa_vlevel) { xParGrp = daa.n.GetUpper(xNode, {daa_isgroup: 1}); }
      if (xParGrp.daa_selectedid) { daa.e.Send({name: "wantunselectitem", node: daa.n.Get(xParGrp.daa_selectedid), vn: xVN}); }
      daa.n.Select(xNode, xParGrp || xVN);
      daa.e.Send({name: "selecteditem", node: xNode, vn: xVN}, AE);
   };

   this.UnselectItem = function(AE) {
      if (!AE.vn || !AE.vn.daa_selectedid) { return; }
      var xVN   = AE.vn;
      var xNode = (AE.node != AE.vn && AE.node) || daa.n.Get(xVN.daa_selectedid); if (!xNode) { return; }
      var xParGrp = xVN; if (xNode.daa_vlevel) { xParGrp = daa.n.GetUpper(xNode, {daa_isgroup: 1}); }
      daa.n.Unselect(xNode, xParGrp);
      daa.e.Send({name: "unselecteditem", node: xNode, vn: xVN});
   };

   this.ExpandItem = function(AE) {
      if (!AE.node || !AE.node.daa_isitem) { return; }
      var xNode = AE.node;
      var xVN   = AE.vn || daa.n.GetVN(xNode) || {};
      var xParGrp = daa.n.GetUpper(xNode, {daa_isgroup: 1}); if (!xParGrp) { return; }
       // Collapse groups that belong to other item
      if (xParGrp.daa_expandedid && xParGrp.daa_expandedid != xNode.id) {
         daa.e.Send({name: "wantcollapseitem", node: daa.n.Get(xParGrp.daa_expandedid)});
      }
       // Register form's Floating View
      daa.app.AddFV("menu", xNode);
      xParGrp.daa_expandedid = xNode.id;
       // Get group to expand || we are done
      var xGrp = daa.n.Get(xNode.id.replace(/_item/, "_group")); if (!xGrp) { return; }
       // Set dropdown extents
      var xDDPos = xVN.daa_dropdownposition; if (xNode.daa_vlevel) { xDDPos = "right top"; }
      daa.dropdownbox.Open({node: xGrp, opener: xNode, dropdownposition: xDDPos});
      daa.e.Send({name: "expandeditem", node: xNode});
   };

   this.CollapseItem = function(AE) {
      if (!AE.node || !AE.node.daa_isitem) { return; }
       // Get nodes
      var xNode = AE.node;
      var xParGrp = daa.n.GetUpper(xNode, {daa_isgroup: 1}); if (!xParGrp) { return; }
      var xGrp = daa.n.Get(xNode.id.replace(/_item/, "_group")); if (!xGrp) { return; }
       // Collapse children
      if (xGrp.daa_expandedid) { daa.e.Send({name: "wantcollapseitem", node: daa.n.Get(xGrp.daa_expandedid)}); }
       // Change states
      xNode.daa_isexpanded = 0;
      xGrp.style.display   = "none";
      xParGrp.daa_expandedid = "";
       // Unregister form's Floating View since it's collapsed
      daa.app.DeleteFV("menu", xNode);
      daa.e.Send({name: "collapseditem", node: xNode});
   };

   this.CollapseAll = function(AE) {
      if (!AE.vn) { return; }
      var xGrp = daa.n.GetLower(AE.vn, {daa_isgroup: 1}); if (!xGrp) { return; }
      var xNode = daa.n.Get(xGrp.daa_expandedid); if (!xNode) { return; }
      daa.e.Send({name: "wantunselectitem", node: xNode});
      daa.e.Send({name: "wantcollapseitem", node: xNode});
   };

   // **************************************************************************
   // Filling

   this.CreateItems = function(AObj, AModel) {
      AObj.treeitem = AObj.treeitem || {vlevel: 0};
      var xTreeItem = AObj.treeitem;

       // Must make a copy, because items use 'orientation' to set className
      var xObj = daa.o.CopyOne(AObj);
      if (xTreeItem.vlevel > 0) { xObj.groupnest = document.body; xObj.orientation = "v"; }
      var xNode = this.inherited.CreateItems(xObj, AModel); if (!xNode) { return null; }

       // Set 'pvnid' because child groups don't belong physically to the menu, they are children of the body!
      if (!xTreeItem.vlevel) { xNode.pvnid = ""; }
      else { AObj.vn.groupindex = daa.csv.OR(AObj.vn.groupindex, xNode.id); }

       // Update index because we've sent a copy of AObj to inherited method!
      AObj.index = xObj.index;
      return xNode;
   };

   this.FillPrepare = function(AObj) {
      var xObj = this.inherited.FillPrepare(AObj); if (!xObj) { return; }
      xObj.orientation = xObj.vd.orientation || "h";
      return xObj;
   };

   this.Clear = function(AObj) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return; }
      var xArr = daa.csv.SplitAsKeys(xVN.groupindex);
      var xNode = null;
      for (var xkey in xArr) {
         xNode = daa.n.Get(xkey); if (!xNode) { continue; }
         document.body.removeChild(xNode);
      }
      xVN.groupindex = "";
      return this.inherited.Clear(AObj);
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.dropdownposition  = AVD.dropdownposition || "bottom left";
      AVD.htmlclassName     = AVD.htmlclassName    || "menu";
      AVD.istextselectable  = 0;
      AVD.islistselectable  = 0;
      this.inherited.Init(AVD, AVN);
   };
}

);

