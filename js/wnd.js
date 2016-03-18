daa.RegisterClasses(

// *****************************************************************************
// @class Caption daa.caption @groupname view

function Caption() {
   this.path = "daa";
   this.name = "caption";
   this.ancestors = "daa.label";
   this.requires = "daa.mover";

    // ***
    // @object daa.caption.events

   this.events = {
      onchangestate: "ChangeState"
   };

    // ***
    // @object daa.caption.styles

   this.styles = {
      name: "Caption",
      caption:             "cursor: default; font-weight: bold; background-color: #E6D2D8; color: #666; padding: 4px; overflow: hidden;",
      windowcaption:       "text-align: center;",
      tabsitemcaption:     "margin: 1px 2px 0px 0px; border-top-left-radius: 5px; border-top-right-radius: 5px; box-shadow: 2px 2px 5px -2px #888",
      captionbtn:          "width: 11px; height: 11px; background-position: center center; background-repeat: no-repeat; cursor: pointer; float: right; margin: 1px 0px 0px 1px; opacity: 0.6",
      captionbtnclose:     "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIRhI+pF9n4QIRymemqirjbvxQAOw==');",
      captionbtnmaximize:  "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIThI+pF+2BYJzUSFZtBpe/toRiAQA7');",
      captionbtnminimize:  "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIMhI+py+0PYZg0xFcAADs=');",
      captionbtnrestore:   "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIUhI+pGd0aTpQuTnMtyk96Vi3iaBQAOw==');",
      captionbtndock:      "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIShI+pa8HgUIQqTklXuGn7By4FADs=');",
      captionbtnundock:    "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIShI+pGd1r3gqAKmtRzhFWD4YFADs=');",
      captionbtnexpandh:   "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIPhI+pu5GOIJBxMnuz3qoAADs=');",
      captionbtnexpandv:   "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIPhI+pGMt+GgRyVXVTnvwUADs=');",
      captionbtncollapseh: "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIPhI+pyxb9npKAumSb3rwAADs=');",
      captionbtncollapsev: "background-image: url('data:image/gif;base64,R0lGODlhCwALAIAAAP///wAAACH5BAEAAAAALAAAAAALAAsAAAIOhI+pG2vtIHNHRvqwTgUAOw==');"
   };

    // ***
    // @object daa.caption.properties

   this.properties = {
      iscaption:     0,
      isbtnclose:    0,
      isbtnmaximize: 0,
      isbtnminimize: 0,
      isbtndock:     0,
      isbtnexpand:   0,
      isclosed:      1,
      ismaximized:   1,
      isminimized:   1,
      isdocked:      1,
      isexpanded:    1
   };

    // ***
    // @object daa.caption.templates

   this.templates = {
      close:    "<div id='%vnid%_btnclose'    daa_isbtnclose    class='captionbtn captionbtnclose'></div>",
      maximize: "<div id='%vnid%_btnmaximize' daa_isbtnmaximize class='captionbtn captionbtnmaximize'></div>",
      minimize: "<div id='%vnid%_btnminimize' daa_isbtnminimize class='captionbtn captionbtnminimize'></div>",
      dock:     "<div id='%vnid%_btndock'     daa_isbtndock     class='captionbtn captionbtndock'></div>",
      expand:   "<div id='%vnid%_btnexpand'   daa_isbtnexpand   class='captionbtn captionbtnexpandh'></div>"
   };

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      var xNode = daa.m.Args(AE, "node");
      if (!xNode || /_btn/.test(xNode.id)) { return; }
      var xE = daa.e.ToMasterVN(AE);
      xE.node = daa.m.Args(AE, "vn");
      xE.source = daa.o.CopyOne(AE);
      xE.name = "wantselectitem"; daa.e.Send(xE);
      xE.name = "wantmove"; daa.e.Send(xE);
   };

   this.TouchStart = function(AE) { this.MouseDown(AE); daa.e.Cancel(); };

   this.MouseMove = function(AE) {
      if (!daa.e.IsMouseDown(AE) && !daa.e.IsTouchDown(AE)) { return; }
      var xNode = daa.m.Args(AE, "node");
      if (!xNode || /_btn/.test(xNode.id)) { return; }
      var xE = daa.e.ToMasterVN(AE);
      xE.node = daa.m.Args(AE, "vn");
      xE.source = daa.o.CopyOne(AE);
      xE.name = "wantmove"; daa.e.Send(xE);
   };

   this.TouchMove = function(AE) { this.MouseMove(AE); daa.e.Cancel(); };

   this.MouseUp = function(AE) {
      daa.mover.Clear();
   };

   this.TouchEnd = function(AE) { this.MouseUp(AE); this.Click(AE); };

   this.Click = function(AE) {
      var xNode = daa.m.Args(AE, "node");
      var xE = daa.e.ToMasterVN(AE); xE.name = "";
      for (var xkey in this.templates) {
         if (xNode["daa_isbtn" + xkey]) { xE.name = "want" + xkey; break; }
      }
      if (!xE.name && !/_btn/.test(xNode.id)) { xE.name = "wantcaption"; }
      if (xE.name) {
         xE.node = daa.m.Args(AE, "vn");
         xE.source = daa.o.CopyOne(AE);
         daa.e.Send(xE);
      }
   };

   this.ChangeState = function(AE) {
      this.CheckBtnStates(AE);
   };

   // **************************************************************************
   // Behavior

   this.CheckBtnState = function(AE) {
      if (!AE.btnname || !AE.statename || !AE.htmlclassName) { return; }
      var xVN   = daa.m.Args(AE, "vn");   if (!xVN) { return; }
      var xMVN  = AE.mvn || daa.n.GetMasterVN(xVN); if (!xMVN) { return; }
      var xBtn  = daa.n.GetLower(xVN, "this/daa_" + AE.btnname + " == 1"); if (!xBtn) { return; }
      var xCls  = (daa.IsArray(AE.htmlclassName) && AE.htmlclassName) || [daa.String(AE.htmlclassName) + "yes", daa.String(AE.htmlclassName) + "no"];
      var xCode = Number(xMVN["daa_" + AE.statename]);
      daa.n.ReplaceClassName(xBtn, xCls[xCode], xCls[daa.Swap(xCode)]);
      if (AE.btnname == "isbtndock") {
         xBtn  = daa.n.GetLower(xVN, {daa_isbtnclose: 1});    xCode ? daa.n.Hide(xBtn) : daa.n.Show(xBtn);
         xBtn  = daa.n.GetLower(xVN, {daa_isbtnmaximize: 1}); xCode ? daa.n.Hide(xBtn) : daa.n.Show(xBtn);
         xBtn  = daa.n.GetLower(xVN, {daa_isbtnminimize: 1}); xCode ? daa.n.Hide(xBtn) : daa.n.Show(xBtn);
      }
   };

   this.CheckBtnStates = function(AE) {
      var xVN  = daa.m.Args(AE, "vn");   if (!xVN) { return; }
      var xMVN = daa.n.GetMasterVN(xVN); if (!xMVN) { return; }
      var xBtn = null;
      if ("daa_ismaximized" in xMVN) { this.CheckBtnState({vn: xVN, mvn: xMVN, btnname: "isbtnmaximize", statename: "ismaximized", htmlclassName: ["captionbtnrestore", "captionbtnmaximize"]}); }
      if ("daa_isminimized" in xMVN) { this.CheckBtnState({vn: xVN, mvn: xMVN, btnname: "isbtnminimize", statename: "isminimized", htmlclassName: ["captionbtnrestore", "captionbtnminimize"]}); }
      if ("daa_isdocked" in xMVN)    { this.CheckBtnState({vn: xVN, mvn: xMVN, btnname: "isbtndock", statename: "isdocked", htmlclassName: ["captionbtnundock", "captionbtndock"]}); }
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.orientation      = AVD.orientation      || "h";
      AVD.htmlclassName    = AVD.htmlclassName    || "caption";
      AVD.istextselectable = AVD.istextselectable || 0;
      AVD.iscaption        = 1;
      this.inherited.Init(AVD, AVN);
      if (AVD.buttons) {
         var xBtn = daa.csv.SplitAsKeys(AVD.buttons);
         for (var xkey in xBtn) {
            if (this.templates[xkey]) { daa.n.CreateFromTemplate(daa.pattern.Fill((AVD.templates && AVD.templates[xkey]) || this.templates[xkey], AVD), AVN); }
         }
      }
   };
},

// *****************************************************************************
// @class Window daa.window @groupname view

function Window() {
   this.path = "daa";
   this.name = "window";
   this.ancestors = "daa.view";
   this.requires = "daa.zone, daa.caption, daa.mover";

    // ***
    // @object daa.window.events

   this.events = {
       // Sent from class caption
      onwantclose:    "WantClose",
      onwantmaximize: "WantMaximize",
      onwantminimize: "WantMinimize",
      onwantdock:     "WantDock",
      onwantmove:     "WantMove",
       // Sent from class mover
      onmoving:       "Moving"
   };

    // ***
    // @object daa.window.properties

   this.properties = {
      iswindowleftborder:   0,
      iswindowtopborder:    0,
      iswindowrightborder:  0,
      iswindowbottomborder: 0,
      iswindowbox:          0,
      dockid:               0
   };

    // ***
    // @object daa.window.styles

   this.styles = {
      name: "Window",
      window:         "position: absolute; overflow: hidden; border-radius: 5px; box-shadow: 0px 0px 5px #888;",
      windowbox:      "flex: 1 1 0%; display: flex; flex-direction: column; overflow: hidden; background-color: #eee;",
      windowmiddle:   "flex: 1 1 0%; display: flex; flex-direction: row; overflow: hidden;",
      windowborder:   "opacity: 0.5; background-color: silver;",
      windowbordern:  "cursor: n-resize;  height: 5px;",
      windowborderw:  "cursor: w-resize;  width: 5px;",
      windowcornernw: "cursor: nw-resize; width: 5px; height: 5px; position: absolute;",
      windowcornerne: "cursor: ne-resize; width: 5px; height: 5px; position: absolute;",
      "windowcornernw:last-child": "right: 0px;",
      "windowcornerne:last-child": "right: 0px;"
   };

    // ***
    // @object daa.window.templates

   this.templates = {
      top:    "<div id='%vnid%_sizen' daa_iswindowtopborder class='windowborder windowbordern'>" +
                 "<div id='%vnid%_sizenw' class='windowcornernw'></div>" +
                 "<div id='%vnid%_sizene' class='windowcornerne'></div>" +
              "</div>",
      middle: "<div class='windowmiddle'>" +
                 "<div id='%vnid%_sizew' daa_iswindowleftborder class='windowborder windowborderw'></div>" +
                 "<div id='%vnid%_windowbox' daa_iswindowbox class='windowbox'></div>" +
                 "<div id='%vnid%_sizee' daa_iswindowrightborder class='windowborder windowborderw'></div>" +
              "</div>",
      bottom: "<div id='%vnid%_sizes' daa_iswindowbottomborder class='windowborder windowbordern'>" +
                 "<div id='%vnid%_sizesw' class='windowcornerne'></div>" +
                 "<div id='%vnid%_sizese' class='windowcornernw'></div>" +
              "</div>"
   };

   // **************************************************************************
   // Event handlers

   var Names = {
      h: {left: "left", top: "top",  width: "width",  height: "height", flexdirection: "column"},
      v: {left: "top",  top: "left", width: "height", height: "width",  flexdirection: "row"}
   };

   this.MouseDown = function(AE) {
      var xVN   = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      if (xVN.daa_ismaximized || xVN.daa_isminimized || xVN.daa_isdocked) { daa.e.Cancel(); return; }
      var xNode = daa.m.Args(AE, "node"); if (!xNode) { return; }
      if (daa.StrPos(xNode.id, "_box") < 0) { daa.mover.Create(AE); }
   };

   this.WantClose = function(AE) {
      var xVN = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      xVN.style.display = "none";
      daa.e.Send({name: "changestate", node: daa.n.GetLower(xVN, {daa_istabcaption: 1})});
   };

   this.WantMaximize = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      if (!xVN.daa_ismaximized) { this.Maximize(xVN); }
      else { this.RestoreExtents(AE); }
      daa.e.Send({name: "changestate", node: daa.n.GetLower(xVN, {daa_istabcaption: 1})});
   };

   this.WantMinimize = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      if (!xVN.daa_isminimized) { this.Minimize(AE); }
      else { this.RestoreExtents(AE); }
      daa.e.Send({name: "changestate", node: daa.n.GetLower(xVN, {daa_istabcaption: 1})});
   };

   this.WantDock = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      if (!xVN.daa_isdocked) { this.Dock(AE); }
      else { this.Undock(AE); }
      daa.e.Send({name: "changestate", node: daa.n.GetLower(xVN, {daa_istabcaption: 1})});
   };

   this.WantMove = function(AE) {
      var xVN   = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      if (xVN.daa_ismaximized || xVN.daa_isminimized || xVN.daa_isdocked) { daa.e.Cancel(); return; }
      daa.mover.Create(AE);
   };

   this.Moving = function(AE) {
      if (!AE.vn || AE.vn.daa_islostownership) { return; }
      var xE = daa.mover.GetExtents(AE);
      if (daa.IsEmpty(xE)) { return; }
      xE.vn = AE.vn || null;
      this.SetExtents(xE);
   };

   // **************************************************************************
   // Behavior

   this.SetExtents = function(AE) {
      var xVN = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      var xWH = this.GetMinWH(xVN);
      if ("left"   in AE) { xVN.style.left = AE.left + "px"; }
      if ("top"    in AE) { xVN.style.top  = AE.top  + "px"; }
      if ("width"  in AE) { daa.n.SetWidth(xVN,  daa.MostInt(AE.width,  xWH.width)); }
      if ("height" in AE) {
         daa.n.SetHeight(xVN, daa.MostInt(AE.height, xWH.height));
         daa.n.AddClassName(xVN, "flexboxcolumn flexclient");
         var xBox = daa.n.GetLower(xVN, {daa_istabbox: 1}); if (xBox) { daa.n.AddClassName(xBox, "flexboxcolumn flexclient"); }
      }
   };

   this.Maximize = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN || xVN.daa_ismaximized) { return; }
      if (!xVN.daa_isminimized) { daa.n.SaveExtents(xVN, "parent,ipbm"); }
      xVN.daa_ismaximized = 1;
      xVN.daa_isminimized = 0;
      this.ShowHideBorders(xVN);
      xVN.style.left   = "0px";
      xVN.style.top    = "0px";
      xVN.style.bottom = "auto";
      xVN.style.width  = "100%";
      xVN.style.height = "100%";
   };

   this.Minimize = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN || xVN.daa_isminimized) { return; }
      if (!xVN.daa_ismaximized) { daa.n.SaveExtents(xVN, "parent,ipbm"); }
      xVN.daa_isminimized = 1;
      xVN.daa_ismaximized = 0;
      this.ShowHideBorders(xVN);
      var xWH = this.GetMinWH(xVN);
      xVN.style.left   = "0px";
      xVN.style.top    = "auto";
      xVN.style.bottom = "0px";
      daa.n.SetWidth (xVN, 200 + xWH.width);
      daa.n.SetHeight(xVN, xWH.height);
   };

   this.RestoreExtents = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      xVN.daa_ismaximized = 0;
      xVN.daa_isminimized = 0;
      this.ShowHideBorders(xVN);
      daa.n.RestoreExtents(xVN);
   };

   this.Dock = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN || xVN.daa_isdocked) { return; }
      var xNextPVN = (xVN.daa_dockid && daa.n.Get(xVN.daa_dockid)) || null;
      var xPrevPVN = daa.n.GetParentVN(xVN) || null;
      xVN.daa_isdocked = 1;
      if (!xVN.daa_ismaximized && !xVN.daa_isminimized) { daa.n.SaveExtents(xVN, "parent,ipbm"); }
      if (xNextPVN && xNextPVN != xPrevPVN && !daa.n.IsIn(xVN, xNextPVN)) {
         xVN.daa_dockid = xNextPVN.id;
         if (xPrevPVN) { xVN = daa.View(xPrevPVN).DeleteNode(xPrevPVN, xVN); }
         var xNode = daa.View(xNextPVN).AddNode(xNextPVN, xVN);
         if (xNode) { daa.e.Send({name: "wantselectitem", node: xNode, vn: xNextPVN}); }
      }
      this.Maximize(xVN);
   };

   this.Undock = function(AE) {
      var xVN  = daa.m.Args(AE, "vn"); if (!xVN || !xVN.daa_isdocked) { return; }
      var xPrevPVN = daa.n.GetParentVN(xVN);
      xVN.daa_isdocked = 0;
      if (xPrevPVN) {
         xVN.daa_dockid = xPrevPVN.id;
         xVN = daa.View(xPrevPVN).DeleteNode(xPrevPVN, xVN); if (!xVN) { return; }
      }
      document.body.appendChild(xVN);
      this.RestoreExtents(xVN);
   };

   this.ShowHideBorders = function(AE) {
      var xVN   = daa.m.Args(AE, "vn"); if (!xVN) { return; }
      var xDisp = (xVN.daa_ismaximized && "none") || "block";
      var xNode = null;
      for (var xkey in daa.n.XYNames) {
         xNode = daa.n.GetLower(xVN, "this/daa_iswindow" + xkey + "border == 1"); if (!xNode) { continue; }
         xNode.style.display = xDisp;
      }
   };

   this.GetMinWH = function(AE) {
      var xRect = {width: 0, height: 0};
      var xVN   = daa.m.Args(AE, "vn"); if (!xVN) { return xRect; }
      var xBox  = daa.n.GetLower(xVN, {daa_iswindowbox:  1});
      var xCap  = daa.n.GetLower(xVN, {daa_istabcaption: 1});
      var xXY   = daa.n.TestXY(xBox, xVN);
      var xWH   = daa.n.TestWH(xCap, "ipbm");
      xRect.width  = xXY.left + xXY.right;
      xRect.height = xXY.top  + xXY.bottom;
      xVN.daa_orientation == "h" ? xRect : xRect.width  += xWH.width;
      xVN.daa_orientation == "v" ? xRect : xRect.height += xWH.height;
      return xRect;
   };

   this.AddNode = function(AObj, ANode) {
      var xVN  = daa.m.Args(AObj, "node");   if (!xVN) { return null; }
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
      var xWndBox = daa.n.GetLower(xVN, {daa_iswindowbox: 1}); if (!xWndBox) { return xVN; }
      var xBox   = daa.n.Get(xVN.id + "_tabbox"); if (xVN.daa_isclone) { var yBox = xBox.cloneNode(1); daa.n.CloneProperties(xBox, yBox); xBox = yBox; }
      if (xBox && "daa_lostclassName" in xBox) { xBox.className = xBox.daa_lostclassName; delete xBox.daa_lostclassName; }
      xWndBox.appendChild(xBox);
      return xVN;
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.text          = AVD.text          || "Window";
      AVD.orientation   = AVD.orientation   || "h";
      AVD.buttons       = AVD.buttons       || "close, maximize, minimize, dock";
      AVD.htmlclassName = AVD.htmlclassName || "window";
      ("height" in AVD) ? AVD.isflex = 1 : AVD.isflex = 0;
      AVD.isflex ? AVD.htmlclassName = daa.csv.OR(AVD.htmlclassName, "flexboxcolumn flexclient", " ") : AVD;

       // Do init properties
      this.inherited.Init(AVD, AVN);

      AVN.style.zIndex = daa.zorder.wnd;
      var xTop    = daa.n.CreateFromTemplate(daa.pattern.Fill(this.templates.top,    AVD), AVN);
      var xMiddle = daa.n.CreateFromTemplate(daa.pattern.Fill(this.templates.middle, AVD), AVN);
      var xBottom = daa.n.CreateFromTemplate(daa.pattern.Fill(this.templates.bottom, AVD), AVN);

      var xWndBox = daa.n.GetLower(xMiddle, {daa_iswindowbox: 1}); if (!xWndBox) { return; }

      var xCap = daa.caption.Create({
         vnid: AVN.id + "_tabcaption", mvnid: AVN.id, istabcaption: 1,
         orientation: AVD.orientation,
         text: AVD.text,
         buttons: AVD.buttons,
         htmlclassName: "caption windowcaption"
      }); xWndBox.appendChild(xCap);
      var xBox = daa.zone.Create({
         vnid: AVN.id + "_tabbox",     mvnid: AVN.id, istabbox: 1,
         htmlclassName: "tabbox"
      }); xWndBox.appendChild(xBox);
      AVD.isflex ? daa.n.AddClassName(xBox, "flexboxcolumn flexclient") : xBox;

      var xIsMod = 0;
      if      (AVN.daa_ismaximized) { AVN.daa_ismaximized = 0; xIsMod = 1; this.Maximize(AVN); }
      else if (AVN.daa_isminimized) { AVN.daa_isminimized = 0; xIsMod = 1; this.Minimize(AVN); }
      else if (AVN.daa_isdocked)    { AVN.daa_isdocked    = 0; xIsMod = 1; this.Dock(AVN); }
      if (xIsMod) { daa.e.Send({name: "changestate", node: daa.n.GetLower(AVN, {daa_istabcaption: 1})}); }
   };
}
);

