daa.RegisterClasses(

// *****************************************************************************
// @class App daa.app @groupname util

function App() {
   this.path = "daa";
   this.name = "app";
   this.iscoreclass = 1;

   this.rootevents = {
      onmousedown: "MouseDown",
      ontouchstart: "TouchStart"
   };

   this.fillproperties = {modelpath: 1, model: 1};

   var VNID = 0;
   var FloatEditorID = 0;
   var floatingviews = {};
   var fv = floatingviews;

    // ***
    // @method daa.app.NewID

   this.NewID = function() { VNID++; return VNID; };

    // ***
    // @method daa.app.NewFloatID

   this.NewFloatID = function() { FloatEditorID++; return FloatEditorID; };

   // **************************************************************************
   // Initialization

   function Input() {
      var xInput = daa.o.Ensure("input");
      var xQS = "";
      if (/\?/.test(location)) { xQS = location.toString().replace(/[\s\S]*?\?/, "").replace(/#[\s\S]*$/, ""); }
      else if (daa.Conf.inputprocessor) { xQS = daa.m.Call(daa.Conf.inputprocessor); }
      var xID = xQS.replace(/&[\s\S]*?/, ""); if (!/=/.test(xID)) { xQS = "id=" + xQS; }
      daa.o.Merge(xInput, daa.qs.Split(xQS));
   }

    // Get daa_app attribute values from all the loaded HTML

   function _GetApps(ANode, AApps) {
      var xObj = null;
      if (ANode.daa_app) {
         xObj = daa.qs.Split(ANode.daa_app, ";", ":", daa.RET_TRIMMED);
         xObj.path = "";
         xObj.name = xObj.name || "app";        // Ensure app name if not specified
         ANode.id ? ANode.id : xObj.source == "this" ? ANode.id = "page" + daa.app.NewID() : ANode.id = xObj.source;
         ANode.id  = ANode.id  || xObj.source;  // Ensure node id
         xObj.source = xObj.source || ANode.id; // Ensure primary View Tree name
         if (AApps[xObj.name]) { return daa.m.Escape("", "daa:error:app:NameAlreadyExists:" + xObj.name); }
         AApps[xObj.name] = xObj;               // Save to ref obj
         xObj.sourceid = ANode.id;
      }
      if (xObj && xObj.source == "this") { return; }
      var xNodes = ANode.childNodes;
      for (var xi = 0; xi < xNodes.length; xi++) { _GetApps(xNodes[xi], AApps); }
   }

   function GetApps() {
      daa.n.SetPropsFromTemplate(document.body);
      var xApps = {}; _GetApps(document.body, xApps);
      return xApps;
   }

    // Inits app model section, inits conf and views, loads required pages.
    // AApps is an object of format: {appname: {parameters passed to app via daa_app}}

   function InitApp(AApp) {
       // Init app model
      var xApp   = daa.o.Ensure(AApp.name);
      xApp.isapp = 1;
      xApp.conf  = daa.o.Set(daa.p.Concat(AApp.name, "conf"), AApp); // set AApp as a conf
       // Create app/views
      var xPath  = daa.p.Concat(xApp.name, "views");                 // path to app/views
      daa.o.Ensure(xPath, null, daa.protos.vtreecomplex);
      xApp.views.proto = daa.o.Create(daa.protos.viewtree, daa.p.Concat(xPath, "proto"));
       // Load required pages
      if (AApp.source) {
         EnsurePage(daa.p.Concat(xPath, AApp.source), AApp.sourceid);
         AApp.source = AApp.sourceid;
      }
      if (AApp.require) {
         var xPages = daa.csv.SplitAsKeys(AApp.require);
         for (var xkey in xPages) { EnsurePage(daa.p.Concat(xPath, xkey)); }
      }
   }

   function Init(AApps) {
      for (var xkey in AApps) { InitApp(AApps[xkey]); }
   }

    // ***
    // @method daa.app.Run

   this.Run = function() {
      daa.css.Apply(daa.o.Get("base/styles"));
      Input();
      Init(GetApps());
      var xApp = null;
      for (var xkey in daa.GlobalModel) {
         xApp = daa.GlobalModel[xkey];
         if (typeof(xApp) != "object" || !xApp.isapp || !xApp.conf || !xApp.conf.source) { continue; }
         this.Create(daa.p.Concat(xApp.path, xApp.name, "views", xApp.conf.source));
      }
   };

   // **************************************************************************
   // Pages Loading

   function MakeViews(ANode, ATree, AItem) {
      var xItem = AItem;
      if (ANode.daa_view) {
         var xObj = daa.qs.Split(ANode.daa_view, ";", ":", daa.RET_TRIMMED | daa.RET_NUMERIC);
         if (xObj.vcid) {
            if (ANode.id) { xObj.vnid = ANode.id; }
            else {
               xObj.vnid = xObj.vcid + daa.app.NewID();
               ANode.id = xObj.vnid;
            }
            xItem = daa.vo.Add(ATree, daa.o.Create(ATree.proto, daa.p.Concat(AItem.path, xObj.vnid)), AItem);
            xItem.vnid = xObj.vnid; xItem.vcid = xObj.vcid; xItem.isstaticid = 1;
            daa.o.Merge(xItem, xObj);
         }
      }
      var xNodes = ANode.childNodes;
      for (var xi = 0; xi < xNodes.length; xi++) { MakeViews(xNodes[xi], ATree, xItem); }
   }

   function MakePage(APath, AID) {
      var xNode = daa.n.Get(AID);
      var xPath = daa.p.GetPath(APath);
      var xViews = daa.o.Ensure(xPath);
      var xTree  = daa.vo.Add(xViews, daa.o.Create(daa.protos.viewtree, daa.p.Concat(xPath, AID)));
      var xItem  = daa.vo.Add(xTree, daa.o.Create(xTree.proto, daa.p.Concat(xPath, AID, AID)));
      xItem.vnid = AID; xItem.vcid = "page"; xItem.isstaticid = 1;
      daa.o.Merge(xItem, daa.o.Get(daa.p.Concat(daa.p.GetAppName(APath), "conf")));
      var xNodes = xNode.childNodes;
      for (var xi = 0; xi < xNodes.length; xi++) { MakeViews(xNodes[xi], xTree, xItem); }
      var xRet = {path: "", name: "views"}; xRet[xTree.name] = xTree;
      return xRet;
   }

   function AppendPage(APath, AObj) {
      var xPath = daa.p.GetPath(APath);
      var xViews = daa.o.Ensure(xPath);
      for (var xkey in AObj) {
         if (!daa.IsVItem(AObj[xkey])) { continue; }
         if (AObj[xkey].isviewtree) {
            if (xViews[AObj[xkey]]) { daa.o.Set(daa.p.Concat(xPath, xkey), AObj[xkey]); }
            else { daa.vo.Add(xViews, AObj[xkey]); }
         }
      }
   }
   this.AppendPage = AppendPage;

   function LoadPage(APath) {
      var xName = daa.p.GetName(APath);
      var xObj = daa.http.PostSync(daa.p.Concat("pages", xName) + ".json?rid=" + daa.Rand(0, 1000));
      if (!daa.IsObject(xObj)) { return null; }
      AppendPage(APath, xObj);
      return xObj;
   }

   function EnsurePage(APath, AID) {
      var xObj = daa.o.Get(APath); if (xObj) { return xObj; }      // Return here the object itself, for it is a page
      if (daa.p.GetName(APath) == "this" && AID) { xObj = MakePage(APath, AID); }
      else { xObj = LoadPage(APath); }
      if (!xObj) { return null; }
      var yObj = null;
      for (var xkey in xObj) {
         if (!daa.IsVItem(xObj[xkey]) || !xObj[xkey].isviewtree) { continue; }
         yObj = daa.vo.GetRoot(xObj[xkey]);
         if (yObj.models) { EnsureModels(yObj.models); }
      }
      return xObj[daa.p.GetName(APath)] || null;                   // Return here object[name], for it is a 'views' objects, just loaded
   }

   // **************************************************************************
   // Models Loading

   function EnsureModel(AObj) {
      if (!AObj.modelpath || !AObj.source) { return; }
      AObj = daa.o.Copy(AObj);
      for (var xkey in AObj) {
         if (/%/.test(AObj[xkey])) { AObj[xkey] = daa.pattern.Fill(AObj[xkey]); }
      }
      var xProj  = daa.p.GetAppName(AObj.path);
      var xPath  = daa.p.SetAppName(AObj.modelpath, xProj);
      var xModel = daa.o.Get(xPath); if (xModel && !AObj.isinvalidate) { return xModel; }
      var xObj   = null;
      if (AObj.type == "json") {
         var xName = daa.p.Concat("models", AObj.source) + ".json";
         xObj = daa.http.PostSync(xName + "?rid=" + daa.Rand(0, 1000));
         if (!daa.IsObject(xObj)) { alert("Error: " + xObj); return null; }
      } else {
         xObj = daa.http.PostSync((xObj.method || daa.Conf.restmethod) + "?path=" + AObj.source + "&type=" + AObj.type);
         if (!daa.IsObject(xObj)) { alert("Error: " + xObj); return null; }
      }
      daa.o.Set(xPath, xObj);
      daa.model.Invalidate(daa.p.GetPath(xPath));
   }

   function EnsureModels(AObj) {
      for (var xkey in AObj) {
         if (!daa.IsVItem(AObj[xkey])) { continue; }
         EnsureModel(AObj[xkey]);
      }
   }

   // **************************************************************************
   //
   // Public section
   //
   // **************************************************************************

   // **************************************************************************
   // Event handlers

    // *** @undocumented
    // @method daa.app.MouseDown
    // @desc
    //    Global `mousedown` event handler.
    //    Manages floating views. See [Floating Views]{@link guide?Applications#FloatingViews} section
    //    for more info on floating views.
    // @returns {undefined} No return value

   this.MouseDown = function(AE) {
      //statusEvent(AE);
      if (AE.button != "left") { return; }
      var xVN = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      if (xVN.mvnid) { xVN = daa.n.Get(xVN.mvnid); } if (!xVN) { return; }
      var yVN = null;
      var xIsMenu  = daa.class.Is(xVN, "menu");             // Check if xVN is a menu or its descendant
      var xIsChain = daa.n.GetVNChain(xVN, "daa_openerid"); // Chain includes xVN itself!
      for (var xkey in fv) {
          // This prevents from closing non-menu FVs, that allows to expand menu groups for opened editors
         if (xIsMenu && xkey != "menu") { continue; }
         for (var ykey in fv[xkey]) {
             // This prevents from closing xVN itself and the chain of its openers
            if (xIsChain[ykey]) { continue; }
            if (fv[xkey][ykey] == ykey) { daa.View({vnid: ykey}).Close(daa.e.Format({vnid: ykey, source: AE, isglobalevent: 1})); }
            else                        { daa.View({vnid: ykey}).CollapseAll(daa.e.Format({vnid: ykey, source: AE, isglobalevent: 1})); }
         }
      }
   };

   this.TouchStart = function(AE) { this.MouseDown(AE); };

   // **************************************************************************
   // Floating views management

    // ***
    // @method daa.app.AddFloatingView

   this.AddFloatingView = function(AName, AObj) {
      var xNode = daa.m.Args(AObj, "node"); if (!xNode) { return; }
      var xVN   = daa.n.GetVN(xNode);       if (!xVN)   { return; }
      if (!fv[AName]) { fv[AName] = {}; }
      fv[AName][xVN.id] = xNode.id;
   };
   this.AddFV = this.AddFloatingView;

    // ***
    // @method daa.app.DeleteFloatingView

   this.DeleteFloatingView = function(AName, AObj) {
      var xVN   = daa.m.Args(AObj, "vn"); if (!xVN)   { return; }
      if (!fv[AName] || !fv[AName][xVN.id]) { return; }
      delete fv[AName][xVN.id];
   };
   this.DeleteFV = this.DeleteFloatingView;

   // **************************************************************************
   // Floating editors management

    // ***
    // @method daa.app.OpenEditor

   this.OpenEditor = function(AE) {
      var xNode = daa.m.Args(AE, "node"); if (!xNode) { return; }
      if (!AE.isevent) { daa.e.Format(AE); }
      AE.vd = {vcid: "input"};
      if (AE.editorvcid) { AE.vd.vcid = AE.editorvcid; }
      else if (xNode.daa_modelpath) {
         var xModel = daa.o.Get(xNode.daa_modelpath);
         if (daa.IsEnum(xModel)) { AE.vd.vcid = "proplist"; }
      }
      var xVN = daa.View(AE.vd).Open(AE);
      daa.e.ManageLastVN(daa.e.Format({name: "focus", node: xVN}));
      daa.model.ClearHolders();
      daa.n.ClearFVs();
      daa.e.CancelSelection();
   };

    // ***
    // @method daa.app.CloseEditor

   this.CloseEditor = function(AE) {
      var xVN = daa.m.Args(AE, "vn"); if (!xVN || !xVN.editorid) { return; }
      var xEditor = daa.n.Get(xVN.editorid); if (!xEditor) { return; }
      daa.View(xEditor).Close(xEditor);
   };

   // **************************************************************************
   // Filling

    // ***
    // @method daa.app.SelectedItem

   this.SelectedItem = function(AE) {
      if (!AE.node || !AE.vn || AE.ishistoryevent) { return; }
      if (AE.history && window.history && window.history.pushState) {
         var xNode = daa.n.GetLower(AE.node, {tagName: "A"});
         if (xNode) { history.pushState({name: AE.name, nodeid: AE.node.id, vnid: AE.vn.id}, "", xNode.href); }
      }
   };

    // ***
    // @method daa.app.Fill

   this.Fill = function(AObj) {
      var xVN = daa.n.Get(AObj.vnid || ""); if (!xVN) { return; }
      var xRef = {vn: xVN}; for (var xkey in this.fillproperties) { if (xkey in AObj) { xRef[xkey] = AObj[xkey]; } }
      daa.View(xVN).Fill(xRef);
      var yVN = null;
      for (var xkey in daa.model.MMT) {
         if (xkey == xVN.id) { continue; }
         yVN = daa.n.Get(xkey); if (!yVN) { delete daa.model.MMT[xkey]; continue; }
         if (!daa.n.IsIn(yVN, xVN)) { continue; }
         daa.View(yVN).Fill(yVN);
         if (yVN.vd.include && !yVN.daa_isillconditioned) { this.Include(yVN); }
      }
      daa.n.ClearFVs();
   };

   this.SetExtents = function(AObj) {
      var xVN = daa.n.Get(AObj.vnid || ""); if (!xVN) { return; }
      var xWH = {left: 1, top: 1, width: 1, height: 1};
      for (var xkey in xWH) { if ("scroll" + xkey in AObj) { daa.n.SetScroll(xVN, "scroll" + xkey, AObj["scroll" + xkey]); } }
      for (var xkey in xWH) { if (xkey in AObj) { daa.n.SetExtent(xVN, xkey, AObj[xkey]); } }
   };

    // ***
    // @method daa.app.Terminate

   this.Terminate = function(AObj) {
      location = AObj.location || "about:blank";
   };

    // ***
    // @method daa.app.EventHandler

   this.EventHandler = function(AE) {
      if (!AE.name || !AE.vn || !AE.vn["daa_on" + AE.name]) { return; }
      var xObj = daa.o.Copy(AE.vn["daa_on" + AE.name]);
      daa.pattern.FillObject(xObj, (AE.modelpath && daa.o.Get(AE.modelpath)) || AE.model || "");
      if (/^this/.test(xObj.modelpath)) { xObj.modelpath = daa.EvalExpr(xObj.modelpath, AE); }
      if (xObj.model && /^Path:/.test(xObj.model)) { xObj.model = daa.EvalExpr(xObj.model.replace(/^Path:/, ""), AE); }
      if (xObj.models) { daa.app.EnsureModels(xObj.models); }
      daa.o.Merge(xObj, AE);
      var xMethods = daa.qs.Split(xObj.method, ",", null, daa.RET_TRIMMED);
      for (var xi = 0; xi < xMethods.length; xi++) { daa.m.Call(xMethods[xi], xObj); }
      return xObj;
   };

   // **************************************************************************
   // Create

    // ***
    // @method daa.app.CreateViewNode

   this.CreateViewNode = function(AVD, ARef) {
      if (!AVD) { return null; }
      var xSaveID = AVD.vnid || "";   // Save original vnid, for the VD may be used many times to create views and we need to remain it non-prefixed with 'pagename'.
      AVD.vnid = AVD.vnid || AVD.vcid + this.NewID();
      ARef     = ARef || {pagename: ""};
      ARef.pagename = ARef.pagename || "";
      var xIsStatic = AVD.isstaticid || 0; if (ARef.ignorestaticid) { xIsStatic = 0; }
      if (!xIsStatic ||      (ARef.isincluded && !AVD.vparent)) { AVD.vnid = ARef.pagename + AVD.vnid; } // Add pagename prefix to all non-static ids.
      var xID = AVD.vnid; if (ARef.isincluded && !AVD.vparent)  { xID = ARef.pagename; }  // Use pagename instead of node.id, for node would be bound to the include container.
      var xVN = daa.n.Get(xID);
      if (xVN) { xVN = daa.Class(AVD).Bind(AVD, xVN); }
      else     { xVN = daa.Class(AVD).Create(AVD); }
      AVD.vnid = xSaveID;
      return xVN;
   };
   this.CreateVN = this.CreateViewNode;

    // ***
    // @method daa.app.Include

   this.Include = function(AVN) {
      var xVN = AVN; if (!AVN.vcid) { xVN = daa.n.GetVN(AVN); } if (!xVN) { return; }
      var xVD = xVN.vd || null; if (!xVD || !xVD.path) { return; }
      var xPath = daa.p.GetPath(xVD.path);
      var xName = AVN.daa_include || xVD.include; if (!xName) { return; }
      if (/%/.test(xName)) {
         var xApp = daa.o.Get(daa.p.Concat(daa.p.GetAppName(xVD.path), "conf"));
         xName = daa.pattern.Fill(xName, xApp);
      }
      var xView = this.EnsurePage(daa.p.Concat(xPath, xName)); if (!xView) { alert("No view: " + daa.p.Concat(xPath, xName)); return; }
      this.Create(xView, AVN);
   };

    // ***
    // @method daa.app.IncludeBranch

   this.IncludeBranch = function(AVD, ANode) {
      if (!AVD || !AVD.path || !AVD.name || !AVD.vcount) { return; }
      this.Create(daa.o.Get(AVD.path), ANode, AVD);
   };

    // ***
    // @method daa.app.Create

   this.Create = function(AObj, ANode, ARef) {
      AObj = daa.m.Args(AObj, "model"); if (!AObj) { return; }
      var xVDNames = daa.o.Sort(AObj, "vindex"); // Properly ordered VD names of the page
      var xVNs = {};                             // Created VNs must be collected since cannot be get by VD itself, because of multiple including's mode...
      var xVDName = "", xVD = null;              // Shortcuts
       // xRef contain pagename to be added before non-static ids.
       // While including, the container id, that includes, is passed instead.
      var xRef = {pagename: AObj.name}; if (ANode) { xRef.pagename = ANode.id; xRef.isincluded = 1; }
      if (ARef) { xRef.ignorestaticid = 1; }     // If include branches, staticid must be ignored
       // Create
      var xCnt = -1;
      for (var xi = 0; xi < xVDNames.length; xi++) {
         xVDName = xVDNames[xi]; xVD = AObj[xVDName];
         if (ARef) {
            if (xCnt < 0) { if (ARef.name == xVDName) { xCnt = 0; } continue; } // signal to open the branch, if ARef (VD that opens the branch) passed
            else if (xCnt >= ARef.vcount) { break; }                            // signal to stop further processing of View Tree
         }
         xVNs[xVDName] = this.CreateVN(xVD, xRef); if (!xVNs[xVDName]) { continue; }
         if (!xVNs[xVDName].parentNode) {
            if (xVD.vparent && xVNs[xVD.vparent]) {
               if (xVNs[xVD.vparent] == "none") { xVNs[xVDName] = "none"; }
               else if (!daa.View(xVNs[xVD.vparent]).AddNode(xVNs[xVD.vparent], xVNs[xVDName])) { xVNs[xVDName] = "none"; }
            } else if (ANode) { ANode.appendChild(xVNs[xVDName]); }
         }
         if (xCnt >= 0 ) { xCnt++; }
      }
       // Fill and Include
      var xVN = null;
      for (var xkey in xVNs) {
         xVN = xVNs[xkey]; if (xVN == "none") { continue; }
         daa.View(xVNs[xkey]).Fill(xVNs[xkey]);
         if (xVN.vd.include && !xVN.daa_isillconditioned) { this.Include(xVN); }
      }
   };

   // **************************************************************************
   // Common methods

    // ***
    // @method daa.app.EnsureModels

   this.EnsureModels = function(AObj) { return EnsureModels(AObj); };

    // ***
    // @method daa.app.EnsurePage

   this.EnsurePage = function(APath) { return EnsurePage(APath); };

},

// *****************************************************************************
// @class View daa.view @groupname view

function View() {
   this.path = "daa";
   this.name = "view";
   this.requires = "daa.dropdownbox";

    // ***
    // @object daa.view.events

   this.events = {
      onclick:       "Click",
      ondblclick:    "DblClick",
      onmousedown:   "MouseDown",
      onmouseup:     "MouseUp",
      onmousemove:   "MouseMove",
      onmouseover:   "MouseOver",
      onmouseout:    "MouseOut",
      onmouseenter:  "MouseEnter",
      onmouseleave:  "MouseLeave",

      ontouchstart:  "TouchStart",
      ontouchlong:   "TouchLong",
      ontouchend:    "TouchEnd",
      ontouchmove:   "TouchMove",
      ontouchcancel: "TouchCancel",

      onkeydown:     "KeyDown",
      onkeyup:       "KeyUp",
      onkeypress:    "KeyPress",

      onerror:       "Error",

      onscroll:      "Scroll",
      onresize:      "Resize",
      onwantresize:  "WantResize",
      onresized:     "Resized",

      onselectedview:   "SelectedView",
      onunselectedview: "UnselectedView",

      onchangedmodel:   "ChangedModel"
   };

    // ***
    // @object daa.view.properties

   this.properties = {
      onselectedview:   1,
      onunselectedview: 1,
      onwantresize:     1,
      onresized:        1,
      onchangedmodel:   1,
      dropdownposition: 1,
      orientation:      1,
      condition:        1,
      templatename:     1,
      prevdisplay:      0,
      isstaticid:       1,
      isselected:       1,
      isexpanded:       1,
      isresizable:      0,
      ismovable:        0,
      isitem:           0,
      isclone:          0,
      islostownership:  0,
      ispseudo:         0,
      istemporary:      0,
      itemcount:        0,
      isstaticmodel:    0,
      istextselectable: 1
   };

    // ***
    // @object daa.view.styles

   this.styles = {
      name: "Common",
      flexboxrow:    "display: flex; flex-direction: row;",
      flexboxcolumn: "display: flex; flex-direction: column;",
      flexclient:    "flex: 1 1 0%;",
      name1: "CommonOver:priority=1",
      hidden:        "display: none;"
   };

   this.fillproperties = {
      templates: 1
   };

   this.Error      = function(AE) { };

    // Mouse Event Handlers
   this.Click      = function(AE) { };
   this.DblClick   = function(AE) { };
   this.MouseDown  = function(AE) { };
   this.MouseUp    = function(AE) { };
   this.MouseMove  = function(AE) { };
   this.MouseOver  = function(AE) { };
   this.MouseOut   = function(AE) { };
   this.MouseEnter = function(AE) { };
   this.MouseLeave = function(AE) { };

   this.TouchStart  = function(AE) { };
   this.TouchLong   = function(AE) { };
   this.TouchEnd    = function(AE) { };
   this.TouchMove   = function(AE) { };
   this.TouchCancel = function(AE) { };

   this.KeyDown  = function(AE) { };
   this.KeyUp    = function(AE) { };
   this.KeyPress = function(AE) { };

   this.Scroll = function(AE) { };
   this.Resize = function(AE) { };
   this.Resized = function(AE) { daa.app.EventHandler(AE); };

   // **************************************************************************
   // DAA defined events handlers

   this.WantResize = function(AE) {
      var xNode = daa.m.Args(AE, "node"); if (!xNode) { return; }
      daa.n.SetExtent(xNode, AE.extentname, AE.extentvalue || 0);
      daa.e.Send({name: "resized", node: xNode, vn: AE.vn || null});
   };

   this.SelectedView = function(AE) { daa.app.EventHandler(AE); };
   this.UnselectedView = function(AE) { daa.app.EventHandler(AE); };

   // **************************************************************************
   // Models

   this.ChangedModel = function(AE) { delete AE.modelpath; daa.app.EventHandler(AE); };
   this.GetModelNode = function(AE) { return daa.m.Args(AE, "vn"); };

   // **************************************************************************
   // Opening Closing

   this.OpenPrepare = function(AObj) {
      var xObj  = (AObj.isviewdata && AObj) || {};
      xObj.vn   = daa.m.Args(AObj, "vn");   if (!xObj.vn) { return null; }
      xObj.node = daa.m.Args(AObj, "node"); if (!xObj.node) { return null; }
      xObj.vd   = AObj.vd || {};
      xObj.vd.isviewdata = 1;
      var xWHO = "ip"; if (xObj.node == xObj.vn) { xWHO = "ipbm"; }
      daa.o.Merge(xObj, daa.n.GetXY(xObj.node, "", daa.REL_PAGE));
      daa.o.Merge(xObj, daa.n.GetWH(xObj.node, xWHO));
      return xObj;
   };

    // ***
    // @method daa.view.Open

   this.Open = function(AObj) {
      var xObj = this.OpenPrepare(AObj); if (!xObj) { return; }
      daa.o.Merge(xObj.vd, {
         vnid: "floateditor" + daa.app.NewFloatID(), vcid: xObj.vd.vcid || "input",
         modelpath: xObj.node.daa_modelpath,
         isstaticid: 1,
         left: 0, top: 0, zIndex: 10,
         overflow: "auto",
         position: "absolute",
         border: "0px solid orange"
      });
      var xVN = daa.app.CreateVN(xObj.vd);
      document.body.appendChild(xVN);
      if (xObj.node.daa_modelpath) { daa.View(xVN).Fill({vn: xVN}); }
      if (xObj.vd.dropdownposition) { daa.o.Merge(xObj, daa.dropdownbox.GetExtents(daa.o.Merge({node: xVN}, xObj)), daa.IS_OVERRIDE); }
      xVN.style.left = xObj.left + "px";
      xVN.style.top  = xObj.top + "px";
      daa.n.SetWidth (xVN, xObj.width);
      daa.n.SetHeight(xVN, xObj.height);
      xObj.vn.daa_editorid = xVN.id;
      xVN.daa_openerid     = xObj.vn.id;
      daa.app.AddFV("editor", xVN);
      return xVN;
   };

    // ***
    // @method daa.view.Close

   this.Close = function(AObj) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN || !xVN.parentNode) { return; }
      if (xVN.daa_editorid) { daa.View(xVN.daa_editorid).Close(xVN.daa_editorid); }
      daa.app.DeleteFV("editor", xVN);
      xVN.parentNode.removeChild(xVN);
   };

   // **************************************************************************
   // Collapse

   this.CollapseAll      = function(AE) { };

   // **************************************************************************
   // Behavior

   this.LastID = function(AObj) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return 0; }
      if (!("daa_lastid" in xVN)) { xVN.daa_lastid = 0; return 0; }
      else { xVN.daa_lastid++; return xVN.daa_lastid; }
   };

   this.AddNode = function(AObj, ANode) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return null; }
       // Check the hierarchy to avoid inserting parent of xVN to xVN
      var xHier = daa.n.GetVNHierarchy(xVN);
      if (xHier[ANode.id]) { return ANode; }
       // Add
      xVN.appendChild(ANode);
      return ANode;
   };

   this.InsertNode = function(AObj, ANode, BNode) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return null; }
      if (!BNode || BNode.parentNode != xVN) { return this.AddNode(AObj, ANode); }
      xVN.insertBefore(ANode, BNode);
      return ANode;
   };

   this.DeleteNode = function(AObj, ANode) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return null; }
      if (!ANode || ANode.parentNode != xVN) { return; }
      xVN.removeChild(ANode);
      return ANode;
   };

   this.CreateNode = function(AObj) {
      var xNode = document.createElement(AObj.tagname || "div");
      if (AObj.vnid) { xNode.id = AObj.vnid; }
      daa.html.SetProps(xNode, AObj);
      daa.css.SetProps(xNode, AObj);
      return xNode;
   };

   // **************************************************************************
   // Filling

   this.Clear = function(AObj) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return; }
      xVN.innerHTML = "";
      xVN.daa_modelindex = {};
      if (xVN.daa_selectedid) { xVN.daa_selectedid = ""; }
      if (xVN.daa_expandedid) { xVN.daa_expandedid = ""; }
   };

    // ***
    // @method daa.view.FillPrepare

   this.FillPrepare = function(AObj) {
       // Get VN and VD
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return null; }
      var xVD = xVN.vd || {};

       // Ensure modelpath
      var xModelPath; if ("modelpath" in AObj) { xModelPath = AObj.modelpath; } else { xModelPath = xVD.modelpath || "this"; }
      if (xVN.daa_modelpath && xVN.daa_isstaticmodel) { daa.model.AddHolder(xVN); return null; }
      xModelPath = daa.n.ResolvePath(xVN, xModelPath);
      if (/%/.test(xModelPath)) { xModelPath = daa.pattern.Fill(xModelPath, xVD); }
      var xPrevModelPath = xVN.daa_modelpath || "";
      xVN.daa_modelpath = xModelPath;

       // Get Model
      var xModel = null; if (!("modelpath" in AObj) && "model" in AObj) { xModel = AObj.model; xModelPath = "*"; }
      else if (xModelPath) { xModel = daa.o.Get(xModelPath); }

      if ((!xModelPath && !xModel) || (xPrevModelPath == xModelPath && !daa.model.IsChanged(xVN))) { daa.model.AddHolder(xVN); return null; }
      daa.model.AddHolder(xVN);

      if (xVN.daa_condition) {
         if (!daa.Condition(xVN.daa_condition, xModel)) { daa.n.Hide(xVN); xVN.daa_isillconditioned = 1; return null; }
         else { daa.n.Show(xVN); xVN.daa_isillconditioned = 0; }
      }

       // Return the object, formatted for Fill
      var xRef = {vn: xVN, vd: xVD, vnid: xVN.id, vcid: xVN.vcid, model: xModel};
      for (var xkey in this.fillproperties) { if (xVD[xkey]) { xRef[xkey] = xVD[xkey]; } }
      return xRef;
   };

    // ***
    // @method daa.view.Fill

   this.Fill  = function(AObj) { };

   // **************************************************************************
   // Initialization

    // ***
    // @method daa.view.Init

   this.Init = function(AVD, AVN) {
      if (!AVD) { return null; }
      if (!AVN) { return null; }
      AVN.id   = AVD.vnid;
      AVN.vcid = AVD.vcid;
      daa.node.SetProps(AVN, AVD);
      daa.html.SetProps(AVN, AVD);
      daa.css.SetProps(AVN, AVD);
      daa.e.Subscribe(AVN, ["scroll"]);
   };

    // ***
    // @method daa.view.Bind

   this.Bind = function(AVD, AVN) {
      if (!AVD) { return null; }
      if (!AVN) { return null; }
      this.Init(AVD, AVN);
      return AVN;
   };

    // ***
    // @method daa.view.Create

   this.Create = function(AVD) {
      if (!AVD) { return null; }
      AVD.tagname = AVD.tagname || "div";
      AVD.vcid    = AVD.vcid || this.name;
      AVD.vnid    = AVD.vnid || AVD.vcid + daa.app.NewID();
      var xVN = document.createElement(AVD.tagname);
      this.Init(AVD, xVN);
      return xVN;
   };
},

// *****************************************************************************
// @class Zone daa.zone @groupname view

function Zone() {
   this.path = "daa";
   this.name = "zone";
   this.ancestors = "daa.view";

   this.isdaavclitem = 1;
   this.daavclicon = "R0lGODdhEQARAJEAAP///8jIyAAAAAAAACwAAAAAEQARAAACIoSPqcvhDx8K7FBbzdUZbN993yKGk4llpXqyaSVG8tjVTAEAOw==";

    // ***
    // @object daa.zone.styles

   this.styles = {
      name:  "Zone",
      zone: "overflow: hidden"
   };

    // ***
    // @object daa.zone.events

   // **************************************************************************
   // Event handlers

   this.ChangedModel = function(AE) { delete AE.modelpath; daa.app.EventHandler(AE); this.Fill(AE); };

   // **************************************************************************
   // Filling

   this.Fill  = function(AObj) { this.FillPrepare(AObj); };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "zone";
      this.inherited.Init(AVD, AVN);
   };
},

// *****************************************************************************
// @class Page daa.page @groupname view

function Page() {
   this.path = "daa";
   this.name = "page";
   this.ancestors = "daa.zone";

},

// *****************************************************************************
// @class Split daa.split @groupname view

function Split() {
   this.path = "daa";
   this.name = "split";
   this.ancestors = "daa.view";
   this.requires = "daa.mover";

   this.isdaavclitem = 1;
   this.daavclicon = "R0lGODdhEQARAJEAAP///8jIyKCgoAAAACwAAAAAEQARAAACK4QPosgsIZpMcLYXLcJ6V5tRYWiQ3DEqC6cupWc66JdoZyfiJd3dPW9zMQoAOw==";

    // ***
    // @object daa.split.events

   this.events = {
      onmoving:  "Moving"
   };

    // ***
    // @object daa.split.properties

   this.properties = {
      ismovable:    1
   };

    // ***
    // @object daa.split.styles

   this.styles = {
      name:         "Split",
      splitv:       "cursor: w-resize; width:  5px; background-color: #ddd",
      splith:       "cursor: n-resize; height: 5px; background-color: #ddd",
      splitmobileh: "width:  15px",
      splitmobilev: "height: 15px"
   };

   var Names = {
      v: {x: "x", width: "width"},
      h: {x: "y", width: "height"}
   };

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      if (!AE.vn || !AE.vn.daa_ismovable) { return; }
      var xE  = this.ToOperated(AE); if (!xE.node) { return; }
      var xWH = daa.n.GetWH(xE.node, "ipbm");
      AE.movesavewidth = xWH.width; AE.movesaveheight = xWH.height;
      daa.mover.Create(AE);
   };

   this.TouchStart  = function(AE)  { this.MouseDown(AE); };

   this.Moving = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN)     { return; }
      var xE   = this.ToOperated(xVN); if (!xE.node) { return; }
      var xN   = Names[xVN.daa_orientation || "v"];      // Names[Orientation], just shortens reference
      var xOft = AE["offset" + xN.x]; if (xE.code == "next") { xOft = 0 - xOft; }
      daa.e.Send({
         name: "wantresize",
         node: xE.node,
         source: daa.o.CopyOne(AE),
         extentname: xN.width,
         extentvalue: xOft + (AE["movesave" + xN.width] || 0)
      });
   };

   // **************************************************************************
   // Behavior

   this.ToOperated = function(AE) {
      var xE   = {node: null, code: ""};
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      var xNode = daa.n.GetPrevVN(xVN);
      if (!xNode || daa.n.GetStyle(xNode, "flexGrow", daa.RET_NUMERIC)) {
         xNode = daa.n.GetNextVN(xVN);
         if (!xNode || daa.n.GetStyle(xNode, "flexGrow", daa.RET_NUMERIC)) {
            xNode = daa.n.GetParentVN(xVN);
            if (!xNode || daa.n.GetStyle(xNode, "flexGrow", daa.RET_NUMERIC)) { return xE; }
            else { xE.code = "parent"; }
         } else { xE.code = "next"; }
      } else { xE.code = "prev"; }
      xE.node = xNode;
      return xE;
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.orientation     = AVD.orientation   || "v";
      AVD.htmlclassName   = AVD.htmlclassName || "split" + AVD.orientation;
      ("ismovable" in AVD) ? AVD : AVD.ismovable = 1;
      this.inherited.Init(AVD, AVN);
   };
},


// *****************************************************************************
// @class Line daa.line @groupname view

function Line() {
   this.path = "daa";
   this.name = "line";
   this.ancestors = "daa.zone";

    // ***
    // @object daa.line.styles

   this.styles = {
      name: "Line",
      line: "border-top: 1px solid #ddd; margin: 10px 0px;"
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "line";
      this.inherited.Init(AVD, AVN);
   };

},

// *****************************************************************************
// @class Items daa.items @groupname abstract

function Items() {
   this.path = "daa";
   this.name = "items";

    // ***
    // @object daa.items.properties
    // @desc
    //    The object defines class properties.

   this.properties = {
      onwantselectitem:   1,
      onwantunselectitem: 1,
      onwantunselectall:  1,
      onselecteditem:     1,
      onunselecteditem:   1,
      onselectedlist:     1,
      onunselectedlist:   1,
      islistselectable:   1,
      isitemsselectable:  1,
      isitemselectable:   1,
      isitemmovable:      1,
      issystemkeys:       1,
      ismoveselect:       1,
      iskeyselect:        1
   };

    // ***
    // @object daa.items.events
    // @desc
    //    The object defines general items related event handlers.
    // @value onkeydown - Overrides `KeyDown` handler. Supports arrow keys navigation.

   this.events = {
      onwantselectitem:   "WantSelectItem",
      onwantunselectitem: "WantUnselectItem",
      onwantunselectall:  "WantUnselectAll",
      onselecteditem:     "SelectedItem",
      onunselecteditem:   "UnselectedItem",
      onselectedlist:     "SelectedList",
      onunselectedlist:   "UnselectedList"
   };

    // ***
    // @object daa.items.styles

   this.styles = {
      name: "Item:priority=1",
      itemselected: "color: white; background-color: #4466AA;", //#002080";
      itemgreyed:   "color: white; background-color: #bbb;",
      "itemselected a": "color: inherit;",
      "itemgreyed a":   "color: inherit;"
   };

   // **************************************************************************
   // Event handlers

   this.KeyDown = function(AE) {
      if (!AE.vn.daa_iskeyselect) { return; }
      var xNode = null;
      if (/^38$/.test(AE.key)) { xNode = this.GetPrevIN(AE); }
      else if (/^40$/.test(AE.key)) { xNode = this.GetNextIN(AE); }
      if (xNode) { this.SelectItem({node: xNode, vn: AE.vn}); }
   };

   this.WantSelectItem   = function(AE) { daa.app.EventHandler(AE); this.SelectItem(AE); };
   this.WantUnselectItem = function(AE) { daa.app.EventHandler(AE); this.UnselectItem(AE); };
   this.WantUnselectAll  = function(AE) { daa.app.EventHandler(AE); this.UnselectAll(AE); };

    // ***
    // @method daa.items.SelectedItem

   this.SelectedItem   = function(AE) {
      if (!AE.node || !AE.node.daa_isitem || !AE.vn || !AE.vn.daa_onselecteditem) { return; }
      var xRef = {name: "selecteditem", node: AE.node, vn: AE.vn};
      if (AE.node.daa_modelpath) { xRef.modelpath = AE.node.daa_modelpath; }
      var xObj = daa.app.EventHandler(xRef); if (!xObj) { return; }
      //daa.app.SelectedItem(daa.o.Merge(daa.o.Merge({name: "wantselectitem"}, AE), xObj));
   };

   this.UnselectedItem = function(AE) {
      if (!AE.node || !AE.node.daa_isitem || !AE.vn || !AE.vn.daa_onunselecteditem) { return; }
      daa.app.EventHandler({name: "unselecteditem", node: AE.node, vn: AE.vn, modelpath: AE.node.daa_modelpath});
   };

    // ***
    // @method daa.items.SelectedList

   this.SelectedList = function(AE) {
      if (!AE.vn || !AE.vn.daa_selectedid) { return; }
      var xNode = daa.n.Get(AE.vn.daa_selectedid); if (!xNode || !xNode.daa_isgreyed) { return; }
      var yNode = this.GetItemNode({node: AE.node || null});
      if (!yNode || xNode == yNode) { daa.e.Send({name: "selecteditem", node: xNode, vn: AE.vn}, AE); }
      daa.n.Ungrey(xNode);
      daa.app.EventHandler(AE);
   };

    // ***
    // @method daa.items.UnselectedList

   this.UnselectedList = function(AE) {
      if (!AE.vn || !AE.vn.daa_selectedid) { return; }
      var xNode = daa.n.Get(AE.vn.daa_selectedid); if (!xNode || !xNode.daa_isselected) { return; }
      daa.n.Grey(xNode);
      daa.app.EventHandler(AE);
   };

   // **************************************************************************
   // Behavior

    // ***
    // @method daa.items.SelectItem

   this.SelectItem       = function(AE) { };

    // ***
    // @method daa.items.UnselectItem

   this.UnselectItem     = function(AE) { };

    // ***
    // @method daa.items.UnselectAll

   this.UnselectAll      = function(AE) { };

    // ***
    // @method daa.items.GetItemNode

   this.GetItemNode      = function(AE) { return daa.n.GetItemNode(AE.node || null); };
   this.GetIN = this.GetItemNode;

    // ***
    // @method daa.items.GetModelNode

   this.GetModelNode = function(AE) {
      if (!("modelpath" in AE)) { return null; }
      var xVN = daa.m.Args(AE, "vn"); if (!xVN || !xVN.daa_modelindex) { return null; }
      if (!xVN.daa_modelindex[AE.modelpath]) { return null; }
      return daa.n.Get(xVN.daa_modelindex[AE.modelpath]);
   };
   this.GetMN = this.GetModelNode;

    // ***
    // @method daa.items.GetFirstItemNode

   this.GetFirstItemNode = function(AE) {
      if (!AE.vn.daa_modelindex) { return null; }
      for (var xkey in AE.vn.daa_modelindex) { return daa.n.Get(AE.vn.daa_modelindex[xkey]); }
      return null;
   };
   this.GetFirstIN = this.GetFirstItemNode;

    // ***
    // @method daa.items.GetLastItemNode

   this.GetLastItemNode = function(AE) {
      if (!AE.vn.daa_modelindex) { return null; }
      for (var xkey in AE.vn.daa_modelindex) { }
      if (AE.vn.daa_modelindex[xkey]) { return daa.n.Get(AE.vn.daa_modelindex[xkey]); }
      return null;
   };
   this.GetLastIN = this.GetLastItemNode;

    // ***
    // @method daa.items.GetNextItemNode

   this.GetNextItemNode = function(AE) {
      if (!AE.vn.daa_modelindex) { return null; }
      if (!AE.vn.daa_selectedid) { return this.GetFirstIN(AE); }
      var xIs = 0, xSel = AE.vn.daa_selectedid, xMI = AE.vn.daa_modelindex;
      for (var xkey in xMI) {
         if (xIs) { return daa.n.Get(xMI[xkey]); }
         if (xMI[xkey] == xSel) { xIs = 1; }
      }
      return null;
   };
   this.GetNextIN = this.GetNextItemNode;

    // ***
    // @method daa.items.GetPrevItemNode

   this.GetPrevItemNode = function(AE) {
      if (!AE.vn.daa_modelindex) { return null; }
      if (!AE.vn.daa_selectedid) { return this.GetFirstIN(AE); }
      var xIs = 0, xSel = AE.vn.daa_selectedid, xMI = AE.vn.daa_modelindex, xPrev = "";
      for (var xkey in xMI) {
         if (xMI[xkey] == xSel) { if (xPrev) { return daa.n.Get(xPrev); } else { break; } }
         xPrev = xMI[xkey];
      }
      return null;
   };
   this.GetPrevIN = this.GetPrevItemNode;
},

// *****************************************************************************
// @class TextElement daa.textelement @groupname view

function TextElement() {
   this.path = "daa";
   this.name = "textelement";
   this.ancestors = "daa.view";

    // ***
    // @object daa.textelement.templates

   this.templates = {
      link: "<a href='%link%'></a>"
   };

    // ***
    // @object daa.textelement.events

   // **************************************************************************
   // Event handlers

   this.ChangedModel = function(AE) { delete AE.modelpath; daa.app.EventHandler(AE); this.Fill(AE); };

   // **************************************************************************
   // Filling

   this.GetText = function(AObj, AModel) {
      var xText;
      if (/_key/.test(AObj.vn.daa_modelpath)) { AModel = daa.p.GetName(daa.p.GetPath(AObj.vn.daa_modelpath)); }
      if (/%/.test(AObj.vd.text)) { xText = daa.pattern.Fill(AObj.vd.text, AModel); }
      else if (AObj.vd.text) { xText = AObj.vd.text; if (daa.IsPath(xText)) { xText = daa.o.Get(xText) || ""; } }
      else { xText = (daa.IsObject(AModel) && AModel.name) || AModel; }
      return xText;
   };

   this.CreateItem = function(AObj, AModel) {
      var xText = this.GetText(AObj, AModel);
      var xIncs = null;
      if (/<\?daa/.test(xText) && daa.compiler) { xIncs = []; xText = daa.compiler.Prepare(xText, xIncs); }
      if (AObj.vd.textprocessor) { xText = daa.m.Call(AObj.vd.textprocessor, {value: xText}); }
      if ("link" in AObj.vd) {
         var xLink = AObj.vd.link; if (/%/.test(xLink)) { xLink = daa.pattern.Fill(xLink, AModel); }
         var xNode = daa.n.CreateFromTemplate(daa.pattern.Fill(daa.n.GetTemplate(this, AObj, "link") || "<a></a>", {link: xLink}), AObj.vn);
         xNode.innerHTML = xText;
      } else {
         AObj.vn.innerHTML = xText;
      }
      if (xIncs) { daa.compiler.Accomplish(AObj.vn, xIncs); }
      return AObj.vn;
   };

   this.Fill  = function(AObj) {
      var xObj = this.FillPrepare(AObj); if (!xObj) { return null; }
      this.Clear(xObj.vn);
      this.CreateItem(xObj, xObj.model);
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      this.inherited.Init(AVD, AVN);
      var xText = AVD.text || (daa.Conf.isdesigning && AVD.vnid) || "";
      if (/%/.test(xText) && AVD.modelpath) { var yText = daa.o.Get(daa.n.ResolvePath(AVN, AVD.modelpath)); if (yText) { xText = yText; } }
      this.CreateItem({vn: AVN, vd: AVD}, xText);
   };
},

// *****************************************************************************
// @class Label daa.label @groupname view

function Label() {
   this.path = "daa";
   this.name = "label";
   this.ancestors = "daa.items, daa.textelement";

   this.isdaavclitem = 1;
   this.daavclicon = "R0lGODdhEQARAKIAAP///8jIyKCgoCpIcAAAAAAAAAAAAAAAACwAAAAAEQARAAADIQi63P4wykmfuDjrG7r/4DeM5BCeaFiuZepucFbNdG1LCQA7";

    // ***
    // @object daa.label.properties

   this.properties = {
      textprocessor: 1
   };

    // ***
    // @object daa.label.styles

   this.styles = {
      name:      "Text",
      label:     "padding: 4px; white-space: pre-line;",
      "label a": "text-decoration: none; color: inherit;",
      "label a:hover": "color: red;",
   };

    // ***
    // @object daa.label.events

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      if (AE.button != "left") { return; }
      if (AE.vn && AE.vn.daa_onselecteditem) {
         daa.e.Send({name: "wantselectitem", node: AE.node, vn: AE.vn});
      }
   };

   this.Click = function(AE) {
      if (AE.button != "left") { return; }
      if (AE.vn.daa_onselecteditem) { daa.e.Cancel(); }
   };

   // **************************************************************************
   // Behavior

   this.SelectItem = function(AE) {
      if (!AE.vn || AE.daa_selectedid) { return; }
      if (!AE.vn.daa_isitemselectable) { return; }
      daa.e.Send({name: "wantunselectitem", vn: AE.vn});
      daa.n.Select(AE.vn, AE.vn);
      daa.e.Send({name: "selecteditem", node: AE.vn, vn: AE.vn}, AE);
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "label";
      AVD.isitemselectable ? AVD.isitem = 1 : AVD;
      this.inherited.Init(AVD, AVN);
   };
}

);



