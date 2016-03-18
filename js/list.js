daa.RegisterClasses(

// *****************************************************************************
// @class List daa.list @groupname view

function List() {
   this.path = "daa";
   this.name = "list";
   this.ancestors = "daa.items, daa.view";

    // ***
    // @object daa.list.styles

   this.styles = {
      name:         "List",
      list:         "",
      listgroup:    "",
      listitemwrp:  "",
      listitem:     "padding: 2px 4px; overflow: hidden; white-space: nowrap;",
      "listitem a": "text-decoration: none; color: inherit;",
      "listitem a:hover": "color: red;"
   };

    // ***
    // @object daa.list.templates

   this.templates = {
      group: "<ul id='%vnid%_ul/%id%' daa_isgroup class='listgroup'></ul>",
      item:  "<li id='%vnid%_li/%id%' daa_isitemwrp class='listitemwrp'>" +
                "<div id='%vnid%_it/%id%' daa_isitem class='listitem'>" +
                   "<span id='%vnid%_data/%id%' daa_isdata>{{'%title%' || '%value%' || '%name%' || '&nbsp;'}}</span>" +
                "</div>" +
             "</li>",
      link: "<a href='%link%'></a>"
   };

    // ***
    // @object daa.list.events

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      if (AE.button != "left") { return; }
      var xNode = daa.m.Args(AE, "node"); if (!xNode) { return; }
      if (xNode.daa_isgroup) { return; }
      xNode = this.GetItemNode({node: xNode}); if (!xNode) { return; }
      daa.e.Send({name: "wantselectitem", node: xNode});
   };

   this.TouchStart = function(AE) { if (daa.n.GetStyle(AE.node, "cursor") != "pointer") { this.MouseDown(AE); } };

   this.MouseOver = function(AE) {
      if (!AE.vn || !AE.vn.daa_ismoveselect) { return; }
      this.MouseDown(AE);
   };

   this.Click = function(AE) {
      if (AE.button != "left") { return; }
      if (AE.vn.daa_onselecteditem) { daa.e.Cancel(); }
   };

   this.ChangedModel = function(AE) {
      if (!AE.modelpath) { return null; }
      if (AE.modelpath == AE.vn.daa_modelpath) {
         //alertEvent(daa.model.MMT);
         return this.Fill(AE); }
      var xItemNode = this.GetModelNode(AE); if (!xItemNode) { return; }
       // Get model and append it with ItemNode daa-data
      var xObj      = daa.o.Get(AE.modelpath, null, "");
      if (!daa.IsEnum(xObj)) { xObj = {value: xObj}; }
      xObj          = daa.o.Merge(daa.n.GetProps(xItemNode), xObj);
       // Get inner template of ItemNode
      var xTempName = xItemNode.daa_templatename || "item";
      var xTemp     = daa.n.ExtractFromTemplate(daa.n.GetTemplate(this, AE.vn, xTempName) || "", "daa_isitem");
       // Change ItemNode inner
      xItemNode.innerHTML = daa.pattern.Fill(xTemp, xObj);
      daa.app.EventHandler({name: "changedmodel", node: xItemNode}, AE);
   };

   // **************************************************************************
   // Behavior

   this.SelectItem = function(AE) {
      if (!AE.vn || !AE.node || AE.node == AE.vn) { return; }
      if (!AE.vn.daa_isitemselectable) { return; }
      var xNode = AE.node;
      var xVN = AE.vn;
      if (xVN.daa_selectedid == xNode.id) { return; }
      daa.e.Send({name: "wantunselectitem", vn: xVN});
      daa.n.Select(xNode, xVN);
      daa.e.Send({name: "selecteditem", node: xNode, vn: xVN}, AE);
   };

   this.UnselectItem = function(AE) {
      if (!AE.vn || !AE.vn.daa_selectedid) { return; }
      var xVN   = AE.vn;
      var xNode = (AE.node != AE.vn && AE.node) || daa.n.Get(xVN.daa_selectedid); if (!xNode) { return; }
      daa.n.Unselect(xNode, xVN);
      daa.e.Send({name: "unselecteditem", node: xNode, vn: xVN});
   };

   // **************************************************************************
   // Filling

    // ***
    // @method daa.list.CreateItem

   this.CreateItem = function(AObj, AModel) {
       // Shorthand to the std tree item iterator object
      var xTreeItem = AObj.treeitem || {};

       // Construct an unique part of the node id as a combination of
       // .groupid (that is required for tree/tables processing) and a name of the
       // model item.
      AObj.id         = daa.p.Concat(AObj.groupid, AObj.key);
       // Provide these values for a Group callback method, if processing a tree
       //    Also it is needed to assign correct style/img-src to tree item icons
       //    such as [+], [-] ect.
       //    This means nothing for a simple lists processing
      AObj.isitems    = Number(xTreeItem.vcount > 0);
      AObj.isexpanded = 0;

       // Create an independent conglomerate object to fill the template with all
       //    values that might be needed.
       //    - AObj generally contains 'vnid' and 'id' props to set unique ID for nodes.
       //       Also it may contain class specific flags and props such as 'isitems', 'isexpanded' etc.
       //       Classes may pass a variety of such values througn AObj.
       //    - xTreeItem contains tree and path/name information, that might be required
       //       to construct appropriate values, assign classNames and styles to the nodes.
       //    - AModel, finally, contains values of the model, needed to create end-user viewed
       //       content. If the model is an object - merge in to the conglomerate, pass it as
       //       'value' otherwise.
      var xObj  = daa.o.Merge(daa.o.CopyOne(AObj), xTreeItem);
      (AObj.isitems && AModel != xTreeItem) ? daa.o.Merge(xObj, AModel) : xObj.value = AModel;

       // Create item node from template
       //    Template might be passed as:
       //    - AObj.template, if specified by .Fill method of Group callback method
       //    - TreeItem.template, if tree is a layout
       //    - nothing, so using the default
      var xTempName = AObj.templatename || xTreeItem.templatename || "item";
      var xTemp     = (AObj.templates && AObj.templates[xTempName]) || this.templates[xTempName] || "<div></div>";
      if (AObj.vd.templatereplace) { xTemp = daa.n.TemplateReplace(xTemp, AObj.vd.templatereplace); }
      if ("value" in xTreeItem) { xTemp = xTemp.replace(/%value%/g, xTreeItem.value); }
      var xID = daa.pattern.Fill(daa.n.ExtractFromTemplate(xTemp, "id", daa.RET_VALUE), xObj);
      var xNode = daa.n.Get(xID) || daa.n.CreateFromTemplate(daa.pattern.Fill(xTemp, xObj), AObj.itemnest);

       // Provide parent node for Group callback method, if processing a tree
      AObj.groupnest = xNode;

       // Set required props to the item node
       // TODO MUST REVALIDATE:
       //    - Props settings. daa.n.SetProps should be used instead!
      var xItemNode = daa.n.GetLower(xNode, {daa_isitem: 1});
      if (xItemNode) {
         xItemNode.daa_modelpath    = daa.p.Concat(xTreeItem.path, xTreeItem.name);
         xItemNode.daa_vlevel       = xTreeItem.vlevel || 0;
         xItemNode.daa_isitems      = AObj.isitems;
         xItemNode.daa_isexpanded   = AObj.isexpanded;
         xItemNode.daa_templatename = xTempName;
         AObj.vn.daa_modelindex[xItemNode.daa_modelpath] = xItemNode.id;
          // Auto-select by condition
         var xCond = AObj.vn.daa_selecteditem || AObj.vd.selecteditem || "";
         if (xCond && daa.Condition(xCond, xObj)) {
            daa.n.Select(xItemNode, AObj.vn);
            if (AObj.vn.daa_islistselectable) { daa.e.ManageLastVN(daa.e.Format({node: xItemNode, vn: AObj.vn})); }
         }
          // Text post-processing
         var xProc = xTreeItem.textprocessor || AObj.vn.daa_textprocessor || AObj.vd.textprocessor || null;
         if (xProc) { xItemNode.innerHTML = daa.m.Call(xProc, {value: xItemNode.innerHTML}); }
      }

       // Post-processing
      if (daa.IsLayoutItem(AModel)) {
          // AModel is a layout item while some meta- nodes, like table headers, are being built.
         daa.css.SetProps(xItemNode, AModel);
      } else if (xTreeItem.include || AObj.vd.iteminclude) {
          // Include another page into xItemNode
         xItemNode.daa_include = xTreeItem.include || AObj.vd.iteminclude;
         if (daa.IsLayoutItem(xTreeItem)) { xItemNode.daa_modelpath = xTreeItem.path; }
         xItemNode.daa_isstaticmodel = 1;
         daa.app.Include(xItemNode);
      } else if (("link" in xObj || "link" in AObj.vd) && !daa.IsZero(AObj.vd.isitemlinkable)) {
          // Wrap the whole value into <a></a>
         if (!("link" in xObj) && "link" in AObj.vd) { xObj.link = AObj.vd.link; }
         if (/%/.test(xObj.link)) { xObj.link = daa.pattern.Fill(xObj.link, xObj); }
         var xDataNode = daa.n.GetLower(xItemNode, {daa_isdata: 1}) || xItemNode;
         daa.n.Move(daa.n.CreateFromTemplate(daa.pattern.Fill((AObj.templates && AObj.templates.link) || this.templates.link || "<a></a>", xObj), xDataNode), xDataNode);
      }
      return xNode;
   };

    // ***
    // @method daa.list.CreateItems

   this.CreateItems = function(AObj, AModel) {
      AObj.treeitem = AObj.treeitem || {vlevel: 0};
      var xTreeItem = AObj.treeitem;

       // Create group node
      var xTemp = (AObj.templates && AObj.templates.group) || this.templates.group;
      if (AObj.vd.templatereplace) { xTemp = daa.n.TemplateReplace(xTemp, AObj.vd.templatereplace); }
      var xObj  = daa.o.Merge(daa.o.CopyOne(AObj), xTreeItem);

      var xID = daa.pattern.Fill(daa.n.ExtractFromTemplate(xTemp, "id", daa.RET_VALUE), xObj);
      var xNode = daa.n.Get(xID) || daa.n.CreateFromTemplate(
         daa.pattern.Fill(xTemp, xObj),          // Fill the template with actual values
         AObj.groupnest                          // Append to groupnest
      );

       // Create a copy of Obj to avoid conflicts between groups local counters
      xObj = daa.o.CopyOne(AObj);
      xObj.groupid   = (!AObj.isvirtual && this.LastID(AObj)); // group part of the ID for real trees, not needed for lists and vtrees
      xObj.groupnest = "";                       // parent node for groups, set it for trees only
      xObj.itemnest  = xNode;                    // parent node for items, set it to just created node
      xObj.sortby    = xObj.sortby || AObj.vd.sortby || "";     // sortby for iterator:
                                                 //    ""     means default
                                                 //    "_key" means sortby keys
                                                 //    "_value" means sortby values
                                                 //    all other values mean sort by property
      xObj.filter    = xObj.filter || AObj.vd.filter || "";     // filter for iterator:
      xObj.limit     = xObj.limit  || AObj.vd.limit  || 0;     // limit for iterator:
      if (AObj.vd.isemptyitem && !AObj.index && AObj.groupnest == AObj.vn) { this.CreateItem(xObj, ""); }

       // Support both object (.o) and vobject (.vo) iteration
      var xIterator    = (AObj.isvirtual && daa.vo.Iterate) || daa.o.Iterate;
      var xGroupMethod = (AObj.istree && this.CreateItems) || null;
      xIterator.call(this,
         xObj,                                   // iterator reference object, see daa.o.Iterate
         AModel,                                 // model to iterate through
         xGroupMethod,                           // method for groups, i.e. child objects for .o and virtually-child objects for .vo
         this.CreateItem                         // method for items,  i.e. non-objects for .o   and daa-objects for .vo
      );

       // Return new index for .vo, because it goes throughout all virtual tree branches of any level!
       //    This means nothing for .o
      AObj.index = xObj.index;
      return xNode;
   };

   this.FillPrepare = function(AObj) {
      var xObj = this.inherited.FillPrepare(AObj); if (!xObj) { return null; }
      xObj.id        = "view_root";     // subID for group
      xObj.groupnest = xObj.vn;         // parent node for group
      return xObj;
   };

   this.Fill = function(AObj) {
      var xObj = this.FillPrepare(AObj); if (!xObj) { return; }
       // Clear previous content
      this.Clear(xObj.vn);
       // Create new content
      this.CreateItems(xObj, xObj.model);
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "list";
      if (!("istextselectable" in AVD)) { AVD.istextselectable = 1; }
      if (!("isitemselectable" in AVD)) { AVD.isitemselectable = 1; }
      if (!("islistselectable" in AVD)) { AVD.islistselectable = AVD.isitemselectable; }
      if (!("isitemmovable" in AVD))    { AVD.isitemmovable = 0; }
      this.inherited.Init(AVD, AVN);
   };
},

// *****************************************************************************
// @class VList daa.vlist @groupname view

function VList() {
   this.path = "daa";
   this.name = "vlist";
   this.ancestors = "daa.list";

    // ***
    // @object daa.vlist.templates

   this.templates = {
      item:  "<li id='%vnid%_li/%id%' daa_isitemwrp class='listitemwrp'>" +
                "<div id='%vnid%_it/%id%' daa_isitem class='listitem'>" +
                  "<span id='%vnid%_data/%id%'  daa_isdata>{{'%title%' || '%name%' || '&nbsp;'}}</span>" +
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
// @class VIterator daa.viterator @groupname view

function VIterator() {
   this.path = "daa";
   this.name = "viterator";
   this.ancestors = "daa.view";

    // ***
    // @object daa.viterator.styles

   this.styles = {
      name:         "Iterator",
      iter:         "",
      iteritem:     "border-bottom: 1px solid #ddd;",
      "iteritem:last-child": "border-bottom: 0px"
   };

    // ***
    // @object daa.viterator.templates

   this.templates = {
      item:  "<div id='%vnid%/%id%' class='iteritem'></div>"
   };

   // **************************************************************************
   // Behavior

   this.AddNode = function(AObj, ANode) {
      return null;
   };

   this.InsertNode = function(AObj, ANode, BNode) {
      return null;
   };

   // **************************************************************************
   // Filling

   this.CreateItem = function(AObj, AModel) {
      if (!AModel) { return null; }
      var xTreeItem = AObj.treeitem || {};
      AObj.id   = AObj.key;
      var xTemp = daa.n.GetTemplate(this, AObj, "item") || "<div></div>";
      if (AObj.vd.templatereplace) { xTemp = daa.n.TemplateReplace(xTemp, AObj.vd.templatereplace); }
      var xNode = daa.n.CreateFromTemplate(daa.pattern.Fill(xTemp, AObj), AObj.itemnest);
      xNode.daa_modelpath = daa.p.Concat(xTreeItem.path, xTreeItem.name);
      daa.app.IncludeBranch(AObj.vd, xNode);
      return xNode;
   };

   this.CreateItems = function(AObj, AModel) {
      var xObj  = daa.o.CopyOne(AObj);
      xObj = daa.o.CopyOne(AObj);
      xObj.itemnest  = AObj.vn;
      var xIterator  = (AObj.layout && daa.vo.IterateLayout) || (AObj.isvirtual && daa.vo.Iterate) || daa.o.Iterate;
      if (AObj.layout) { daa.vo.IterateLayoutPrepare(xObj, AModel); }
      xIterator.call(this, xObj, AModel, null, this.CreateItem);
      AObj.index = xObj.index;
      return AObj.vn;
   };

   this.FillPrepare = function(AObj) {
      var xObj = this.inherited.FillPrepare(AObj); if (!xObj) { return; }
      xObj.isvirtual = 1;
      xObj.layout = (!daa.vo.IsEmpty(xObj.vd.layout) && xObj.vd.layout) || null;
      ("sortby" in xObj.vd) ? xObj.sortby = xObj.vd.sortby : xObj.sortby = "";
      return xObj;
   };

   this.Fill = function(AObj) {
      var xObj = this.FillPrepare(AObj); if (!xObj) { return; }
       // Clear previous content
      this.Clear(xObj.vn);
       // Create new content
      this.CreateItems(xObj, xObj.model);
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "iter";
      this.inherited.Init(AVD, AVN);
   };
},

// *****************************************************************************
// @class BtnBar daa.btnbar @groupname view

function BtnBar() {
   this.path = "daa";
   this.name = "btnbar";
   this.ancestors = "daa.vlist";
   this.requires = "daa.mover";

    // ***
    // @object daa.btnbar.styles

   this.styles = {
      name: "Bars",
      btnbar:        "",
      btnbargroup:   "",
      btnbaritemwrp: "display: inline-block; margin-right: 4px; height: 17px; line-height: 21px;",
      btnbaritem:    "background-position: center center; background-repeat: no-repeat; min-width: 17px; height: 17px;"
   };

    // ***
    // @object daa.btnbar.templates

   this.templates = {
      group: "<ul id='%vnid%_ul/%id%' class='btnbargroup'></ul>",
      item: "<li id='%vnid%_wrp/%id%' daa_isitemwrp class='btnbaritemwrp'>" +
               "<div id='%vnid%_item/%id%' daa_isitem class='btnbaritem' style='background-image: url(\"data:image/gif;base64,%icon%\");'>" +
               "</div>" +
            "</li>"
   };

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      if (!AE.node) { return; }
      var xNode = AE.node;
      if (xNode.daa_isgroup || xNode.daa_isitemwrp) { return; }
      daa.mover.Prepare(daa.e.ToItemNode(AE));
      this.inherited.MouseDown(AE);
   };

   this.TouchStart = function(AE) { this.MouseDown(AE); };

   this.MouseUp = function(AE) {
      daa.mover.Clear();
   };

   this.TouchEnd = function(AE) { this.MouseUp(AE); this.Click(AE); };

   this.MouseMove = function(AE) {
      if (!AE.node || !daa.e.IsMouseDown(AE)) { return; }
      var xNode = AE.node;
      if (xNode.daa_isgroup || xNode.daa_isitemwrp) { return; }

      if (daa.mover.IsPrepared(AE) && daa.mover.GetDistance(AE) >= 5) {
         daa.o.Merge(AE,
            {
            moveitemname:  "node",
            movetranslate: "ToItemNode"
            }
         );
         daa.mover.Create(AE);
         daa.movebox.Create(AE);
      }
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "btnbar";
      AVD.isitemselectable = 0;
      AVD.islistselectable = 0;
      this.inherited.Init(AVD, AVN);
   };
}
);

