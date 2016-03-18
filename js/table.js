daa.RegisterClasses(

// *****************************************************************************
// @class Table daa.table @groupname view
// @classdesc
//    Creates `table` view.

function Table() {
   this.path = "daa";
   this.name = "table";
   this.ancestors = "daa.list";
   this.requires = "daa.mover, daa.viewlayout";

    // ***
    // @object daa.table.styles

   this.styles = {
      name:      "Table",
      table:      "",
      tableddv:   "width: 250px; height: auto; overflow: auto; box-shadow: 0px 0px 4px grey; opacity: 0.9;",
      grouptable: "border-collapse: collapse; table-layout: fixed; width: 100%; border: 1px solid #bbb;",
      rowhead:    "",
      rowdata:    "",
      cell:       "color: #333; padding: 3px 4px; overflow: hidden; white-space: nowrap; border: 1px solid #bbb;",
      cellhead:   "background-color: #d6d6d6; vertical-align: top;",
      cellfixed:  "background-color: #e6e6e6; vertical-align: top;",
      celldata:   "background-color: #f8f8f8; vertical-align: top;"
   };

    // ***
    // @object daa.table.templates

   this.templates = {
      table:     "<table id='%vnid%_tb/%id%' class='grouptable'><tbody></tbody></table>",
      grouphead: "<tr id='%vnid%_tr/%id%' class='rowhead'></tr>",
      groupdata: "<tr id='%vnid%_tr/%id%' class='rowdata'></tr>",
      headitem:  "<td id='%vnid%_ht/%id%' daa_isitem daa_isheaditem daa_istextselectable='0' class='cell cellhead'>{{'%title%' || '%name%'}}</td>",
      fixeditem: "<td id='%vnid%_hl/%id%' class='cell cellfixed'>%value%</td>",
      item:      "<td id='%vnid%_td/%id%' daa_iscell daa_isitem class='cell celldata'>%value%</td>"
   };

    // ***
    // @object daa.table.events

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      xNode = this.GetItemNode(AE); if (!xNode) { return; }
      if (xNode.daa_isheaditem) {
         if (AE.vn.daa_isitemmovable && (AE.islongtap || !daa.e.IsTouchDown(AE))) { daa.mover.Prepare(daa.e.ToItemNode(AE)); }
      }
      else { daa.e.Send({name: "wantselectitem", node: xNode}); }

   };

   this.MouseUp = function(AE) {
      daa.mover.Clear();
   };

   this.MouseOver = function(AE) {
      if (AE.node && AE.node.daa_isheaditem) { return; }
      this.inherited.MouseOver(AE);
   };

   this.MouseMove = function(AE) {
      if (!daa.e.IsMouseDown(AE)) { return; }
      if (daa.mover.IsPrepared(AE) && daa.mover.GetDistance(AE) >= 5) {
         daa.o.Merge(AE,
            {
            moveitemname:          "node",
            movetranslate:         "ToItemNode",
            movecondition:         "this/destination/node/parentNode/id == this/node/parentNode/id",
            moveorientation:       "h",
            moveisoffsetfixed:     1,
            moveplaceholder:       "lr"
            }
         );
         daa.mover.Create(AE);
         daa.movebox.Create(AE);
         daa.moveplaceholder.Create(AE);
      }
   };

   // **************************************************************************
   // Behavior

   // TODO move to the corresponding class!!! f.e. daa.layout ?
   this.LayoutFromModel = function(AModel, AVD) {
      AVD = AVD || {};
      var xLayout = daa.viewlayout.Create();
      if (AModel.proto) {
         var xKey = "";
         for (var xkey in AModel.proto) {
            if (!AVD.issystemkeys && (/^(path|name|proto|lastid|lastids)$/.test(xkey) || /^is[a-z]+$/.test(xkey))) { continue; }
            xKey = xkey; if (xkey in xLayout) { xKey = "_" + xkey; }
            xLayout[xKey] = daa.o.AddPrepare(xLayout, {name: xKey,   title: xkey});
         }
      } else {
         xLayout._name = daa.o.AddPrepare(xLayout, {name: "_name",   title: "Name"});
      }
      return xLayout;
   };

   // **************************************************************************
   // Opening

   this.OpenPrepare = function(AObj) {
      var xObj = this.inherited.OpenPrepare(AObj); if (!xObj) { return; }
      xObj.vd.dropdownposition = "right top";
      xObj.vd.htmlclassName = "tableddv";
      return xObj;
   };

   // **************************************************************************
   // Filling

   this.CreateRow = function(AObj, AModel) {
      AObj.id      = AObj.key;
      AObj.groupid = AObj.key;

      var xTemp = daa.n.GetTemplate(this, AObj, "groupdata");
      if (AObj.vd.templatereplace) { xTemp = daa.n.TemplateReplace(xTemp, AObj.vd.templatereplace); }
      var xNode = daa.n.CreateFromTemplate(daa.pattern.Fill(xTemp, AObj), AObj.itemnest);

      var xObj = daa.o.CopyOne(AObj);
      xObj.itemnest = xNode;
      if (!daa.IsEnum(AModel)) {
          // AModel is a simple value, so we are building table from a simple object - reset to IterateLayout
         AObj.canceliteration = 1;
         daa.vo.IterateLayout.call(this, xObj, AObj.model, null, this.CreateItem);
      } else {
          // AModel is an object, so, create cells from this objects' properties
         xObj.model = AModel;
         daa.vo.IterateLayout.call(this, xObj, AModel, null, this.CreateItem);
      }
      return xNode;
   };

   this.CreateHead = function(AObj, AModel) {
      AObj.id      = "view_head";
      AObj.groupid = "view_head";

      var xTemp = daa.n.GetTemplate(this, AObj, "grouphead");
      if (AObj.vd.templatereplace) { xTemp = daa.n.TemplateReplace(xTemp, AObj.vd.templatereplace); }
      var xNode = daa.n.CreateFromTemplate(daa.pattern.Fill(xTemp, AObj), AObj.itemnest);

      var xObj = daa.o.CopyOne(AObj);
      xObj.itemnest = xNode;
      xObj.templatename = "headitem";
      daa.vo.Iterate.call(this, xObj, AModel, null, this.CreateItem);
      return xNode;
   };

   this.CreateItems = function(AObj, AModel) {
       // Create table node
      var xTemp = daa.n.GetTemplate(this, AObj, "table");
      if (AObj.vd.templatereplace) { xTemp = daa.n.TemplateReplace(xTemp, AObj.vd.templatereplace); }
      var xNode = daa.n.CreateFromTemplate(daa.pattern.Fill(xTemp, AObj), AObj.groupnest);

       // AObj.itemnest
      (xNode.firstChild && xNode.firstChild.tagName == "TBODY") ? AObj.itemnest = xNode.firstChild : AObj.itemnest = xNode;

      this.CreateHead(AObj, AObj.layout);
      daa.o.Iterate.call(this, AObj, AModel, null, this.CreateRow);
      return xNode;
   };

   this.FillPrepare = function(AObj) {
      var xObj = this.inherited.FillPrepare(AObj); if (!xObj) { return; }
      xObj.layout = (!daa.vo.IsEmpty(xObj.vd.layout) && xObj.vd.layout) || daa.table.LayoutFromModel(xObj.model, xObj.vd);
      ("sortby" in xObj.vd) ? xObj.sortby = xObj.vd.sortby : xObj.sortby = "name";
      ("issystemkeys" in xObj.vd) ? xObj.issystemkeys = xObj.vd.issystemkeys : xObj;
      return xObj;
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "table";
      this.inherited.Init(AVD, AVN);
       // Create or verify layout
      AVD.layout = AVD.layout || daa.viewlayout.Create(AVD, {proto: {isviewdata: 0, islayoutitem: 1}});
   };

},


// *****************************************************************************
// @class PropList daa.proplist @groupname view

function PropList() {
   this.path = "daa";
   this.name = "proplist";
   this.ancestors = "daa.table";

    // ***
    // @object daa.proplist.templates

   this.templates = {
      fixeditem: "<td id='%vnid%_hl/%id%' class='cell cellfixed'>%value%</td>"
   };

   // **************************************************************************
   // Filling

   this.CreateRow = function(AObj, AModel) {
      var xTreeItem = AObj.treeitem;
       // Replace the real model with virtual one, that contains 'key' and 'value' properties, referenced by the view layout.
      var xNode = this.inherited.CreateRow(AObj, {path: xTreeItem.path, name: xTreeItem.name, key: xTreeItem.name, value: AModel});
      return xNode;
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      this.inherited.Init(AVD, AVN);
      AVD.sortby       = AVD.sortby || "";
      ("issystemkeys" in AVD) ? AVD : AVD.issystemkeys = 1;
       // Create or verify layout
      AVD.layout._key   = AVD.layout._key   || daa.o.AddPrepare(AVD.layout, {name: "_key",   title: "Name", isfixed: 1, templatename: "fixeditem"});
      AVD.layout._value = AVD.layout._value || daa.o.AddPrepare(AVD.layout, {name: "_value", title: "Value"});
   };
}

);

