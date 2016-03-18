daa.RegisterClasses(

// *****************************************************************************
// @class CheckElement daa.checkelement @groupname view

function CheckElement() {
   this.path = "daa";
   this.name = "checkelement";
   this.ancestors = "daa.view";

    // ***
    // @object daa.checkelement.events

   this.events = {
      onchange:  "Change",
      onchanged: "Changed"
   };

    // ***
    // @object daa.checkelement.styles

   this.styles = {
      name:  "Editor",
      check:          "display: inline-block; width: 11px; height: 11px; background-position: center center; background-repeat: no-repeat; overflow: hidden; cursor: pointer;",
      checknative:    "vertical-align: text-bottom;",
      checkchecked:   "background-image: url('data:image/gif;base64,R0lGODdhCwALAJEAAP///6qqqgAAAAAAACwAAAAACwALAAACHIyPBsusvQR4TUglo50BbJthYMZpZBlBFMQlSQEAOw==');",
      checkunchecked: "background-image: url('data:image/gif;base64,R0lGODdhCwALAJEAAP///6qqqgAAAAAAACwAAAAACwALAAACFIyPBsus3R5cclZ4Y5huc5B1SVIAADs=');",
      checkempty:     "background-image: url('data:image/gif;base64,R0lGODlhCwALAJEAAP///7y/wgAAAAAAACH5BAEAAAEALAAAAAALAAsAQAIKjI+py+0Po5yhAAA7');",
      radio:          "display: inline-block; width: 11px; height: 11px; background-position: center center; background-repeat: no-repeat; overflow: hidden; cursor: pointer;",
      radionative:    "vertical-align: text-bottom;",
      radiochecked:   "background-image: url('data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEnSURBVHjadJGxagJBGIS/XK6wSCEsLCheuj+dbbjaJzgINtfc2fkKeQLfwSadxULAJ7A+BOuAf2EhrBy4T2Cxae4kFhmYYphhppgn5xwdPoASeAdGwAXYAxvgGyDtgp/AQkRkPB5jjCGEMPHeT1R1CrwBq7RrXMxmMzHG9CtYa7HWkmWZ7Ha7BXBMgFJExBhD0zTUdc1wOKSua5qmwRiDiAhQ4pw7t20bY4yxqqoI3FlVVYwxxrZto3PunACjfn673fIXve78UQJcQggAFEXxEO51519SYO+9n1hrWS6X98aiKO7aew+wT4GNqk6zLJM8z8nz/KE9hICqKrB5ns/nP8DL6XR6vd1uJkkSBoMB1+sVVeVwOCjwBaz7U1bAUVVLVf33wd8BAC+Vf9oQ+fn3AAAAAElFTkSuQmCC');",
      radiounchecked: "background-image: url('data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADfSURBVHjafJEhboRAGIW/Tlcg6iaZhMlS99fVcgCusMHgOEZPsHeoqUOQ9AocgATdZH+BGwxzAsya2WQr4Nn35XvivfR9T8oFaIASyIEFGIEO+AU4JfALaEVEvPdYa4kxnkMIZ1X9BD6A6ykZ26qqxFr7WME5h3OOoihkGIYWuBmgEZF/4HOstYiIAI0BSu89R0l9aYB8z/psB3IDLDHGQzj1iwHGEMIhnPrRAJ2q6p49xoiqKtC91nX9B7zN8/y+bZs1xpBlGeu6oqpM06TAD/D9OOUK3FS1UdXdB+8DAFFYUzhqoJwrAAAAAElFTkSuQmCC');",
      radioempty:     "background-image: url('data:image/gif;base64,R0lGODlhCwALAJEAAP///7y/wgAAAAAAACH5BAEAAAEALAAAAAALAAsAQAIKjI+py+0Po5yhAAA7');",
      checkhidden:    "display: block; margin-top: -20px",
   };

   // **************************************************************************
   // Event handlers

   this.MouseDown = function(AE) {
      if (AE.vn.tagName != "INPUT") {
         var xEdit = AE.vn.childNodes[0] || AE.vn;
         if (xEdit.checked && AE.vn.type != "radio") { xEdit.checked = false; } else { xEdit.checked = true; }
         this.Change(daa.o.Merge({name: "change"}, AE));
         if (document.activeElement != xEdit) { xEdit.focus(); daa.e.Cancel(); }
      }
   };

   this.Change = function(AE) {
      this.SetValue(AE);
      if (AE.vn.mvnid && !AE.iscall) { daa.e.Send(daa.e.ToMasterVN(AE)); }
      else if (!AE.iscall) { daa.e.Send({name: "changed"}, AE); }
   };

   this.Changed = function(AE) {
      daa.app.EventHandler({name: "changed", vn: AE.vn, model: {value: Number(AE.vn.value)}});
   };

   // **************************************************************************
   // Behavior

   this.SetValue = function(AE) {
      var xEdit = this.GetItemNode(AE); if (!xEdit) { return; }
      if ("value" in AE) { xEdit.checked = (AE.value && true) || false; }
      if (AE.vn != xEdit) {
         var xCls = (AE.vn.vcid != "checkelement" && AE.vn.vcid) || AE.vn.vd.htmltype.replace(/box/, "");
         if (xEdit.checked) { daa.n.ReplaceClassName(AE.vn, xCls + "unchecked", xCls + "checked"); }
         else { daa.n.ReplaceClassName(AE.vn, xCls + "checked", xCls + "unchecked"); }
      }
      AE.vn.value = (xEdit.checked && 1) || 0;
   };

   this.GetItemNode = function(AObj) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN || !xVN.id) { return null; }
      if (xVN.tagName != "INPUT") { return xVN.childNodes[0] || null; }
      return xVN;
   };

   // **************************************************************************
   // Filling

   this.Fill = function(AObj) {
      var xObj = this.FillPrepare(AObj); if (!xObj) { return; }
      if (xObj.vd.modelpath && !daa.IsEnum(xObj.model)) {
         var xVal = (xObj.model && 1) || 0;
         this.SetValue({vn: xObj.vn, value: xVal});
      }
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      this.inherited.Init(AVD, AVN);
      if (AVD.tagname != "input") {
         var xInput = document.createElement("input");
         xInput.id = AVN.id.replace(/_icon$/, ""); xInput.type = AVD.htmltype; xInput.name = AVD.htmlname || ""; xInput.className = "checkhidden";
         AVN.appendChild(xInput);
      }
      if ("htmlvalue" in AVD) { this.SetValue({vn: AVN, value: AVD.htmlvalue}); }
   };

   this.Create = function(AVD) {
      AVD.tagname  = AVD.tagname  || "input";
      AVD.htmltype = AVD.htmltype || "checkbox";
      var xType = AVD.htmltype.replace(/box/, ""); var xCls = (AVD.vcid != "checkelement" && AVD.vcid) || xType;
      if (AVD.tagname == "input") { AVD.htmlclassName = daa.csv.OR(AVD.htmlclassName || "", "check checknative", " "); }
      else {
         AVD.vnid = (AVD.vnid || AVD.vcid + daa.app.NewID()) + "_icon";
         AVD.htmlclassName = daa.csv.OR(AVD.htmlclassName || "", xCls + " " + xCls + "unchecked", " ");
      }
      return this.inherited.Create(AVD);
   };
},


// *****************************************************************************
// @class Switch daa.switch @groupname view

function Switch() {
   this.path = "daa";
   this.name = "switch";
   this.ancestors = "daa.checkelement";

    // ***
    // @object daa.switch.styles

   this.styles = {
      name:  "Editor",
      switch:          "display: inline-block; width: 22px; height: 11px; background-position: center center; background-repeat: no-repeat; overflow: hidden; cursor: pointer;",
      switchchecked:   "background-image: url('data:image/gif;base64,R0lGODdhFgALAKIAAP///+bm5s7OzqqqqgAAAAAAAAAAAAAAACwAAAAAFgALAAADOji63K4iyjkHuBeGzfsWFgZoXgmK4yBsBMG23ClqbuDWtYzRrN0Huozq9cuFdsOSJ5iiOCVH4WPqSAAAOw==');",
      switchunchecked: "background-image: url('data:image/gif;base64,R0lGODdhFgALAKIAAP///+bm5s7OzqqqqgAAAAAAAAAAAAAAACwAAAAAFgALAAADOzi63K4gxiGqvRdKQIP/oCdoUhcGhJeOw8YJaoqqIjnBckroq/3Os1yttTHtaECWy3QCKYuYqOVBpSYAADs=');",
      switchempty:     "background-image: url('data:image/gif;base64,R0lGODlhCwALAJEAAP///7y/wgAAAAAAACH5BAEAAAEALAAAAAALAAsAQAIKjI+py+0Po5yhAAA7');"
   };

   this.Create = function(AVD) {
      AVD.tagname = "div";
      return this.inherited.Create(AVD);
   };
},


// *****************************************************************************
// @class Editor daa.editor @groupname view

function Editor() {
   this.path = "daa";
   this.name = "editor";
   this.ancestors = "daa.view";

    // ***
    // @object daa.editor.events

   this.events = {
      oncut:       "Change",
      onpaste:     "Change",
      onsubmit:    "Submit",
      onchanged:   "Changed",
      onfocused:   "Focused",
      onunfocused: "Unfocused"
   };

    // ***
    // @object daa.editor.properties

   this.properties = {
      onsubmit:     1,
      onchanged:    1,
      onfocused:    1,
      onunfocused:  1
   };

    // ***
    // @object daa.editor.styles

   this.styles = {
      name:         "Editor",
      editor:          "border: 1px solid #bbb; box-sizing: border-box; overflow: hidden;",
      editorfocused:   "",
      editorraised:    "background-color: #ccc; border-radius: 2px; box-shadow: 0px 0px 3px #fff inset;",
      editorsunken:    "background-color: white; border-radius: 2px; box-shadow: 0px 0px 3px #ccc inset;",
      editorcomposite: "box-sizing: border-box; overflow: hidden;"
   };

   this.htmlproperties = {
      htmlname: 1,
      htmlplaceholder: 1,
      htmlmaxLength: 1
   };

   // **************************************************************************
   // Event handlers

   this.KeyUp = function(AE) {
      if (/^13$/.test(AE.key) && AE.vn) {
         daa.e.Send({name: "submit"}, AE); //16|17|18|
      } else if (!/^(9|13|27|33|34|35|36|37|38|39|40|45)$/.test(AE.key)) {
         this.Change(AE);
      }
   };

   this.Submit = function(AE) {
      daa.app.EventHandler({name: "submit", vn: AE.vn, model: {value: AE.vn.value}});
      if (AE.vn && AE.vn.daa_openerid) { this.Close(AE); }
   };

   this.Change = function(AE) {
      if (!AE.iscall) { daa.e.Send({name: "changed"}, AE); }
   };

   this.Changed = function(AE) {
      daa.app.EventHandler({name: "changed", vn: AE.vn, model: {value: AE.vn.value}});
   };

   this.Focused = function(AE) {
      daa.app.EventHandler({name: "focused", vn: AE.vn, model: {value: AE.vn.value}});
   };

   this.Unfocused = function(AE) {
      daa.app.EventHandler({name: "unfocused", vn: AE.vn, model: {value: AE.vn.value}});
   };

   this.SelectedView = function(AE) {
      var xEdit = this.GetItemNode(AE); if (!xEdit) { return; }
      xEdit.focus();
      daa.n.AddClassName(AE.vn, "editorfocused");
      daa.app.EventHandler(AE);
      daa.e.Send({name: "focused"}, AE);
       // Prevent from unfocusing the input by the browser if the clicked
       // element is a something another than the input itself.
      if (AE.node != xEdit) { daa.e.Cancel(); }
   };

   this.UnselectedView = function(AE) {
      var xEdit = this.GetItemNode(AE); if (!xEdit) { return; }
      xEdit.blur();
      daa.n.DeleteClassName(AE.vn, "editorfocused");
      daa.app.EventHandler(AE);
      daa.e.Send({name: "unfocused"}, AE);
   };

   // **************************************************************************
   // Behavior

   this.GetItemNode = function(AObj) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN || !xVN.id) { return null; }
      return daa.n.GetLower(xVN, {id: xVN.id + "_editor"});
   };

   // **************************************************************************
   // Opening Closing

   this.Open = function(AObj) {
      var xVN    = this.inherited.Open(AObj); if (!xVN) { return; }
      var xInput = this.GetItemNode(xVN);     if (!xInput) { return; }
      if (xInput.select) { xInput.select(); }
      if (xInput.focus)  { xInput.focus(); }
      return xVN;
   };

   this.Close = function(AObj) {
      var xVN = daa.m.Args(AObj, "vn"); if (!xVN) { return; }
      if (xVN.daa_modelpath) {
         var xInput = this.GetItemNode(xVN) || {value: ""};
         if (!daa.o.EQV(daa.o.Get(xVN.daa_modelpath), xInput.value)) {
            daa.e.Post({name: "wantchangemodel", modelpath: xVN.daa_modelpath, value: xInput.value, isediting: 0});
         }
      }
      this.inherited.Close(AObj);
   };

   // **************************************************************************
   // Filling

   this.FillPrepare = function(AObj) {
      var xObj   = this.inherited.FillPrepare(AObj); if (!xObj) { return null; }
      if (/%/.test(xObj.vd.htmlvalue)) { xObj.model = daa.pattern.Fill(xObj.vd.htmlvalue, xObj.model); }
      else if ("htmlvalue" in xObj.vd && !xObj.vd.modelpath) { xObj.model = xObj.vd.htmlvalue; }
      else if (daa.IsEnum(xObj.model)) { xObj.model = ""; }
      return xObj;
   };

   this.Fill = function(AObj) {
      var xObj   = this.FillPrepare(AObj); if (!xObj) { return; }
      xObj.vn.value = xObj.model;
      var xEdit = this.GetItemNode(xObj); if (!xEdit) { return; }
      xEdit.value = xObj.model;
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "editor editorsunken";
      AVD.htmlname = AVD.htmlname || AVD.vnid;
      this.inherited.Init(AVD, AVN);
      var xTemp = (AVD.templates && AVD.templates.editor) || this.templates.editor; if (!xTemp) { return; }
      var xEdit = daa.n.CreateFromTemplate(daa.pattern.Fill(xTemp, AVD), AVN);
      xEdit.daa_prevvalue = xEdit.value;
      for (var xkey in this.htmlproperties) { if (xkey in AVD) { daa.html.SetProp(xEdit, xkey, AVD[xkey]); } }
   };
},


// *****************************************************************************
// @class Input daa.input @groupname view

function Input() {
   this.path = "daa";
   this.name = "input";
   this.ancestors = "daa.editor";

    // ***
    // @object daa.input.styles

   this.styles = {
      name:  "Editor",
      input: "box-sizing: border-box; width: 100%; height: 100%; padding: 3px 4px; border: 0px; background-color: transparent; color: inherit;",
   };

    // ***
    // @object daa.input.templates

   this.templates = {
      editor: "<input id='%vnid%_editor' type='text' class='input'>"
   };

   // **************************************************************************
   // Event handlers

   this.Change = function(AE) {
      var xEdit = this.GetItemNode(AE); if (!xEdit) { return; }
      AE.vn.value = xEdit.value;
      this.inherited.Change(AE);
   };
},


// *****************************************************************************
// @class Button daa.button @groupname view

function Button() {
   this.path = "daa";
   this.name = "button";
   this.ancestors = "daa.editor";

    // ***
    // @object daa.button.styles

   this.styles = {
      name:  "Editor",
      button: "box-sizing: border-box; width: 100%; height: 100%; padding: 4px 4px; border: 0px; background-color: transparent; color: inherit; cursor: pointer",
      buttonpressed: "box-shadow: 0px 0px 3px #666 inset;"
   };

    // ***
    // @object daa.button.templates

   this.templates = {
      editor: "<button id='%vnid%_editor' type='button' class='button'>{{'%text%' || '%title%' || '%name%'}}</button>"
   };

    // ***
    // @object daa.button.events

   // **************************************************************************
   // Event handlers

   this.KeyUp = function(AE) {
      if (!/^(9|13|27|37|38|39|40)$/.test(AE.key)) { this.Change(AE); }
   };

   this.MouseDown = function(AE) {
      daa.n.AddClassName(AE.vn, "buttonpressed");
   };

   this.MouseUp = function(AE) {
      daa.n.DeleteClassName(AE.vn, "buttonpressed");
   };

   this.Click = function(AE) { daa.e.Send({name: "submit"}, AE); };

   // **************************************************************************
   // Filling

   this.Fill = function(AObj) {
      var xObj  = this.FillPrepare(AObj); if (!xObj) { return; }
      var xEdit = this.GetItemNode(xObj); if (!xEdit) { return; }
      xEdit.innerHTML = xObj.model;
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "editor editorraised";
      (AVD.text && !("htmlvalue" in AVD)) ? AVD.htmlvalue = AVD.text : AVD;
      this.inherited.Init(AVD, AVN);
   };
},

// *****************************************************************************
// @class CheckBox daa.checkbox @groupname view
// @classdesc
//    Creates `checkbox` view.

function CheckBox() {
   this.path = "daa";
   this.name = "checkbox";
   this.ancestors = "daa.editor";
   this.requires = "daa.checkelement, daa.textelement";

    // ***
    // @object daa.checkbox.events

   this.events = {
      onchange: "Change"
   };

    // ***
    // @object daa.checkbox.styles

   this.styles = {
      name:  "Editor",
      checkbox:      "",
      checkboxlabel: "display: inline-block; padding: 3px 4px;"
   };

    // ***
    // @object daa.checkbox.properties

   this.properties = {
      inputclass:   1,
      labelclass:   1,
      inputtagname: 1,
      labeltagname: 1
   };

    // ***
    // @object daa.checkbox.templates

   this.templates = {
      editor: ""       // MUST be empty to prevent from editor creation from template
   };

   // **************************************************************************
   // Event handlers

   this.Submit = function(AE) {
      if (AE.vn && AE.vn.pvnid) { daa.e.Send({node: AE.vn, vn: daa.n.Get(AE.vn.pvnid)}, AE); }
      else { this.inherited.Submit(AE); }
   };

   this.Change = function(AE) {
      var xEdit = this.GetItemNode(AE); if (!xEdit) { return; }
       // Change edit 'checked' if method is called (not fired by env) with a value specified.
      if ("value" in AE && AE.iscall) { daa.e.Send({node: xEdit, vn: daa.n.GetVN(xEdit)}, AE); }

       // Assign value to the VN
      AE.vn.value = Number(xEdit.checked);
      if (xEdit.checked) { daa.e.Send({name: "selecteditem", node: xEdit, vn: AE.vn}, AE); }
      else { daa.e.Send({name: "unselecteditem", node: xEdit, vn: AE.vn}, AE); }

       // Notify group view if event is fired by env.
       // Note that the browser fires 'onchange' event for the only input
       // that was checked, but unchecked one suffers 'onchange' event loss.
      if (AE.vn.pvnid && !AE.iscall) {
         daa.e.Send({name: "change", node: AE.vn, vn: daa.n.Get(AE.vn.pvnid)});
          // Handle checking in check- or radio-groups with arrow keys. The browser
          // by default allows to navigate through inputs in the group using arrow
          // keys, not tab! But the only tab key is supported by daa.e to catch
          // focus changing. So that, we have to manage focus and active view
          // change ourselves.
         daa.e.ManageLastVN(daa.e.Format({name: "focus", node: xEdit}));
      } else if (!AE.iscall) { daa.e.Send({name: "changed"}, AE); }
   };

   this.MouseDown = function(AE) {
       // Return focus to the input element. If the user clicks
       // on this view itself after an editor have been focused, the editor
       // loses the focus, because the browser doesn't conside our 'views'.
      this.SelectedView(AE);
   };

   this.Focused = function(AE) {
      this.inherited.Focused(AE);
      if (AE.vn && AE.vn.pvnid) { daa.e.Send({node: AE.vn, vn: daa.n.Get(AE.vn.pvnid)}, AE); }
   };

   this.Unfocused = function(AE) {
      this.inherited.Unfocused(AE);
      if (AE.vn && AE.vn.pvnid) { daa.e.Send({node: AE.vn, vn: daa.n.Get(AE.vn.pvnid)}, AE); }
   };

   // **************************************************************************
   // Filling

   this.Fill = function(AObj) {
      var xObj   = this.FillPrepare(AObj);
      if (xObj) {
         var xEdit  = daa.n.GetVN(this.GetItemNode(xObj));
         if (xEdit)  { daa.View(xEdit).Fill({vn: xEdit, modelpath: xObj.vn.daa_modelpath}); }
      }
      if (!xObj) { xObj = {vn: daa.m.Args(AObj, "vn")}; if (!xObj.vn) { return; } }
      var xLabel = daa.n.GetLower(xObj.vn, {id: xObj.vn.id + "_label"});
      if (xLabel) {
         var xRef = {vn: xLabel};
         var xPath = daa.n.ResolvePath(xObj.vn, xLabel.vd.modelpath);
         if (xPath) { xRef.modelpath = xPath; } else if (!xLabel.vd.text) { xRef.model = "&nbsp;"; }
         daa.View(xLabel).Fill(xRef);
      }
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "editorcomposite";
      AVD.inputclass    = AVD.inputclass    || "checkelement";
      AVD.labelclass    = AVD.labelclass    || "textelement";
      AVD.htmlvalue     = AVD.htmlvalue     || 0;
      this.inherited.Init(AVD, AVN);
      var xVD = {
         vnid: AVN.id + "_editor", vcid: AVD.inputclass, mvnid: AVN.id, tagname: AVD.inputtagname || "input",
         modelpath: AVD.modelpath || "", htmlvalue: AVD.htmlvalue || 0,
         htmltype: AVD.htmltype || "checkbox", htmlname: AVD.htmlname, htmlclassName: AVD.vcid
      };
      var xEdit = daa.View(xVD).Create(xVD); if (xEdit) { AVN.appendChild(xEdit); }
      var yVD = {
         vnid: AVN.id + "_label",  vcid: AVD.labelclass, mvnid: AVN.id, tagname: AVD.labeltagname || "label",
         modelpath: AVD.itempath || "", text: AVD.text || "", 
         htmlFor: AVN.id + "_editor", htmlclassName: AVD.vcid + "label"
      };
      var xLabel = daa.View(yVD).Create(yVD); if (xLabel) { AVN.appendChild(xLabel); }
   };
},


// *****************************************************************************
// @class RadioButton daa.radiobutton @groupname view

function RadioButton() {
   this.path = "daa";
   this.name = "radiobutton";
   this.ancestors = "daa.checkbox";

    // ***
    // @object daa.radiobutton.styles

   this.styles = {
      name:  "Editor",
      radiobutton:      "",
      radiobuttonlabel: "display: inline-block; padding: 3px 4px;"
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmltype = AVD.htmltype || "radio";
      this.inherited.Init(AVD, AVN);
   };
},


// *****************************************************************************
// @class ListEditor daa.listeditor @groupname view

function ListEditor() {
   this.path = "daa";
   this.name = "listeditor";
   this.ancestors = "daa.editor";

    // ***
    // @object daa.listeditor.events

   this.events = {
      onchange: "Change"
   };

    // ***
    // @object daa.listeditor.properties

   this.properties = {
      isclicksubmit: 1
   };

   this.listproperties = {
      sortby:          "",
      filter:          "",
      limit:           0,
      isemptyitem:     0
   };

   // **************************************************************************
   // Event handlers

   this.Change = function(AE) {
      this.SelectItem(AE);
      if (!AE.iscall) { daa.e.Send({name: "changed"}, AE); }
   };

   // **************************************************************************
   // Behavior

   this.SelectItem = function(AE) { };

   // **************************************************************************
   // Filling

   this.CreateItems = function(AObj) { };

   this.Fill = function(AObj) {
      var xObj  = this.FillPrepare(AObj); if (!xObj) { return; }
      xObj.vn.value = xObj.model;
      this.CreateItems(xObj);
      this.SelectItem({vn: xObj.vn, iscall: 1});
   };

   // **************************************************************************
   // Initialization

   this.CreateList = function(AVD, AVN, ARefVD, ARefVN) {
      var xRef = ARefVD || {vcid: "view", display: "none"};
      xRef.vnid = xRef.vnid || (AVN.id + "_list");
      for (var xkey in this.listproperties) { xRef[xkey] = AVD[xkey] || this.listproperties[xkey]; }
      var xCont = ARefVN || AVN; xCont.appendChild(daa.View(xRef).Create(xRef));
   };

},


// *****************************************************************************
// @class RadioGroup daa.radiogroup @groupname view

function RadioGroup() {
   this.path = "daa";
   this.name = "radiogroup";
   this.ancestors = "daa.listeditor";
   this.requires = "daa.checkbox, daa.radiobutton";

    // ***
    // @object daa.radiogroup.templates

   this.templates = {
      editor: ""       // MUST be empty to prevent from editor creation from template
   };

    // ***
    // @object daa.radiogroup.styles

   this.styles = {
      name:  "Editor",
      radiogroup:     "",
      radiogroupitem: ""
   };

    // ***
    // @object daa.radiogroup.events

   // **************************************************************************
   // Event handlers

   this.SelectedView = function(AE) {
      daa.n.AddClassName(AE.vn, "editorfocused");
      daa.e.Send({name: "focused"}, AE);
   };

   this.UnselectedView = function(AE) {
      daa.n.DeleteClassName(AE.vn, "editorfocused");
      daa.e.Send({name: "unfocused"}, AE);
   };

   // **************************************************************************
   // Behavior

   this.SelectItem = function(AE) {
      var xVN = AE.vn;
      var xNode = null;
      if (AE.node && AE.node.id != xVN.daa_selectedid && !xVN.daa_isitemsselectable) {
         xNode = daa.n.Get(xVN.daa_selectedid);
         daa.e.Send({name: "change", node: xNode, value: 0, iscall: 1});
         daa.e.Send({name: "unselecteditem", node: xNode, vn: xVN});
      }
      if (AE.node) { xNode = AE.node; }
      else {
         var xList = daa.n.Get(xVN.id + "_list") || {};
         var xVals = daa.csv.Split(xVN.value);
         for (var xi = 0; xi < xVals.length; xi++) {
            xNode = daa.list.GetModelNode({vn: xList, modelpath: (xVals[xi] && daa.p.Concat(xList.daa_modelpath, xVals[xi])) || ""}) || {id: ""};
            daa.e.Send({name: "change", node: xNode, value: 1, iscall: 1});
         }
      }
      if (AE.node) {
         var xVal = daa.p.GetName(xNode.daa_modelpath);
         if (xVN.daa_isitemsselectable) {
            if (xNode.value) { xVN.value = daa.csv.OR(xVN.value, xVal); } else { xVN.value = daa.csv.NOT(xVN.value, xVal); }
         } else { xVN.value = xVal; }
      }
      if (!xNode) { return; }
      xVN.daa_selectedid = xNode.id;
      daa.e.Send({name: "selecteditem", node: xNode, vn: xVN}, AE);
   };

   // **************************************************************************
   // Filling

   this.CreateItem = function(AObj, AModel) {
      AObj.id   = AObj.key || "";
      var xPath = (AObj.key && daa.p.Concat(AObj.vn.daa_modelpath, AObj.key)) || "";
      var xText = AObj.mvd.text || ""; if (!xPath) { xText = "&nbsp;"; }
      var xVD = {
         vnid: AObj.vn.id + "/" + AObj.id, vcid: AObj.mvd.itemclass || "radiobutton", pvnid: AObj.mvn.id,
         itempath: xPath, text: xText,
         inputclass: AObj.mvd.inputclass || "", inputtagname: AObj.mvd.inputtagname || "",
         labelclass: AObj.mvd.labelclass || "", labeltagname: AObj.mvd.labeltagname || "",
         htmlname: AObj.mvn.name || AObj.mvn.id
      };
      var xBtn = daa.View(xVD).Create(xVD);
      AObj.mvn.appendChild(xBtn);
      daa.View(xBtn).Fill({vn: xBtn, modelpath: xPath});
      AObj.vn.daa_modelindex[xPath] = xBtn.id;
      return xBtn;
   };

   this.CreateItems = function(AObj) {
      var xList = daa.n.Get(AObj.vn.id + "_list");
      var xObj = daa.view.FillPrepare({vn: xList, modelpath: daa.n.ResolvePath(AObj.vn, AObj.vd.itemspath)}); if (!xObj) { return; }
      if (!xObj.model) { xObj.model = {}; }
      this.Clear({vn: xObj.vn});
      xObj.mvn = AObj.vn;
      xObj.mvd = AObj.vd;
      if (!("isvirtual" in AObj)) { xObj.isvirtual = (xObj.model.proto && 1) || 0; }
      if (AObj.vd.isemptyitem) { this.CreateItem(xObj, ""); }
      var xIterator = (xObj.isvirtual && daa.vo.Iterate) || daa.o.Iterate;
      xIterator.call(this, xObj, xObj.model, null, this.CreateItem);
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName = AVD.htmlclassName || "editorcomposite";
      this.inherited.Init(AVD, AVN);
      this.CreateList(AVD, AVN);
   };
},


// *****************************************************************************
// @class Select daa.select @groupname view

function Select() {
   this.path = "daa";
   this.name = "select";
   this.ancestors = "daa.listeditor";
   this.requires = "daa.list";

    // ***
    // @object daa.select.styles

   this.styles = {
      name:   "Editor",
      select: "box-sizing: border-box; width: 100%; height: 100%; padding: 2px 0px; border: 0px; background-color: transparent; color: inherit;",
   };

    // ***
    // @object daa.select.templates

   this.templates = {
      editor: "<select id='%vnid%_editor' class='select'></select>",
      item:   "<option id='%vnid%/%id%' daa_isitem value='%key%'>{{'%title%' || '%name%' || '&nbsp;'}}</option>"
   };

   this.listproperties = {
      isitemlinkable:  0,
      templatereplace: ""
   };

    // ***
    // @object daa.select.events

   // **************************************************************************
   // Event handlers

   this.KeyUp = function(AE) {
      if (/^13$/.test(AE.key) && AE.vn) {
         daa.e.Send({name: "submit"}, AE);
      } else  if (/^(37|38|39|40)$/.test(AE.key) && AE.vn) {
         var xEdit = this.GetItemNode(AE); if (!xEdit) { return; }
         this.Change(daa.o.Merge({name: "change", node: xEdit}, AE));
      }
   };

   this.Change = function(AE) {
      if (!AE.node || AE.node.tagName != "SELECT") { return; }
      this.SelectItem({node: AE.node.options[AE.node.selectedIndex] || null, vn: AE.vn});
      if (!AE.iscall) { daa.e.Send({name: "changed"}, AE); }
   };

   // **************************************************************************
   // Behavior

   this.SelectItem = function(AE) {
      var xVN = AE.vn;
      if (AE.node && AE.node.id != xVN.daa_selectedid) { daa.e.Send({name: "unselecteditem", node: daa.n.Get(xVN.daa_selectedid), vn: xVN}); }
      var xEdit = this.GetItemNode(xVN); if (!xEdit || xEdit.tagName != "SELECT") { return; }
      var xNode = null;
      if (AE.node) { xNode = AE.node; }
      else {
         xNode = xEdit.options.namedItem(xVN.id + "_list/" + xVN.value);
         if (xNode) { xNode.selected = true; }
         else { xNode = xEdit.options[xEdit.selectedIndex]; if (xNode) { AE.node = xNode; } else { xNode = {id: "", value: ""}; } }
      }
      if (AE.node) { xVN.value = xNode.value; }
      xVN.daa_selectedid = xNode.id;
      daa.e.Send({name: "selecteditem", node: xNode, vn: xVN}, AE);
   };

   // **************************************************************************
   // Filling

   this.CreateItems = function(AObj) {
      var xList = daa.n.Get(AObj.vn.id + "_list");
      var xObj = daa.view.FillPrepare({vn: xList, modelpath: daa.n.ResolvePath(AObj.vn, AObj.vd.itemspath)}); if (!xObj) { return; }
      if (!xObj.model) { xObj.model = {}; }
      xObj.vn.daa_modelindex = {};
      xObj.itemnest = this.GetItemNode(AObj); if (!xObj.itemnest) { return; }
      this.Clear({vn: xObj.itemnest});
      if (!("isvirtual" in AObj)) { xObj.isvirtual = (xObj.model.proto && 1) || 0; }
      if (AObj.vd.isemptyitem) { daa.list.CreateItem.call(this, xObj, ""); }
      var xIterator = (xObj.isvirtual && daa.vo.Iterate) || daa.o.Iterate;
      xIterator.call(this, xObj, xObj.model, null, daa.list.CreateItem);
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      this.inherited.Init(AVD, AVN);
      this.CreateList(AVD, AVN);
   };
},


// *****************************************************************************
// @class ComboBox daa.combobox @groupname view

function ComboBox() {
   this.path = "daa";
   this.name = "combobox";
   this.ancestors = "daa.listeditor";
   this.requires = "daa.vlist, daa.vtree, daa.dropdownbox";

   this.rootevents = {
      oncomboboxclickitem: "ClickItem",
      oncomboboxselectingitem: "SelectingItem"
   };

   this.slaveevents = {
      oncomboboxclickitem: {
         mastername: "click",
         condition:  "this/vn/mvnid is class combobox && this/node/daa_isbtnexpand != 1"
      },
      oncomboboxselectingitem: {
         mastername: "selecteditem",
         condition:  "this/vn/mvnid is class combobox"
      }
   };

    // ***
    // @object daa.combobox.properties

   this.properties = {
      listclass: 1   // @value listclass - Specifies the View Class for the list.
   };

    // ***
    // @object daa.combobox.styles

   this.styles = {
      name:            "Editor",
      combobox:        "box-sizing: border-box; padding: 3px 4px; border: 0px; background-color: transparent; color: inherit;",
      comboboxbtn:     "width: 16px; background-color: #ddd; box-shadow: 0px 0px 3px #aaa; background-position: center center; background-repeat: no-repeat; cursor: pointer;",
      comboboxbtnicon: "background-image: url('data:image/gif;base64,R0lGODlhBwAHAJEAAAAAAObm5v///wAAACH5BAEAAAEALAAAAAAHAAcAAAILjI8IyxDtDEsxnQIAOw==');",
      comboboxbox:     "position: absolute; display: none; background-color: white; opacity: 0.9; box-shadow: 0px 2px 3px -1px #888"
   };

    // ***
    // @object daa.combobox.templates

   this.templates = {
      editor: "<input id='%vnid%_editor' type='text' class='combobox flexclient' value='{{'%title%' || '%name%'}}'>",
      btn: "<div id='%vnid%_btn' daa_isbtn class='comboboxbtn comboboxbtnicon'></div>",
      box: "<div id='%vnid%_box' daa_isdropdownbox daa_pvnid='%vnid%' class='comboboxbox'></div>"
   };

   this.listproperties = {
      istextselectable: 0,
      islistselectable: 0,
      isitemlinkable:   0,
      isitemmovable:    0,
      ismoveselect:     1,
      iskeyselect:      1,
      templatereplace:  "",
      templates:        null,
      layout:           null
   };

    // ***
    // @object daa.combobox.events

   // **************************************************************************
   // Event handlers

   this.Submit = function(AE) {
      if (!AE.vn.daa_isexpanded) { this.inherited.Submit(AE); }
   };

   this.Change = function(AE) { };

   this.KeyDown = function(AE) {
      if (/^(38|40)$/.test(AE.key) && AE.vn) {
         var xList = daa.n.Get(AE.vn.id + "_list"); if (!xList) { return; }
         daa.e.Send(daa.e.To(AE, xList));
         var xNode = daa.n.Get(xList.daa_selectedid);
         this.SelectItem({node: xNode, vn: AE.vn, iscall: 1});
         if (!AE.iscall) { daa.e.Send({name: "changed", node: xNode, vn: AE.vn}, AE); }
         daa.e.Cancel();
      } else if (/^13$/.test(AE.key)) {
         if (AE.vn.daa_isexpanded) { this.CollapseAll(AE); }
         else if (AE.vn.daa_isenterexpand) { this.Expand(AE); }
      } else if (/^27$/.test(AE.key) && AE.vn.daa_isexpanded) {
         this.CollapseAll(AE); daa.e.Cancel();
      }
   };

   this.UnselectedView = function(AE) {
      this.inherited.UnselectedView(AE);
      if (AE.vn.daa_isexpanded) { this.CollapseAll(AE); }
   };

   this.MouseDown = function(AE) {
      if (AE.button != "left") { return; }
      if (AE.vn.daa_isexpanded) { this.CollapseAll(AE); }
      else { this.Expand(AE); }
   };

    // Saves the results of selecting for those cases, when the user
    // presses-moves-releases mouse to select an item, within a single thread.

   this.MouseUp = function(AE) {
      if (AE.button != "left") { return; }
      if (AE.vn && AE.vn.daa_isselecting) {
         this.CollapseAll(AE);
         var xList = daa.n.Get(AE.vn.id + "_list") || {};
         var xNode = daa.n.Get(xList.daa_selectedid);
         this.SelectItem({node: xNode, vn: AE.vn});
         if (!AE.iscall) { daa.e.Send({name: "changed", node: xNode, vn: AE.vn}, AE); }
         if (AE.vn.daa_isclicksubmit) { daa.e.Send({name: "submit", node: xNode, vn: AE.vn}, AE); }
      }
      AE.vn.daa_isselecting = 0;
   };

    // Translates `mousemove` event to `mouseover` event for the list. It proceeds
    // if `istextselectable` is set to 1 and no `mouseover` is fired by the environment
    // for the list. And vice versa, If `istextselectable` is set to 0, the environment
    // doesn't fire `mousemove` for the combobox itself when moving goes outside of it (and this
    // method is not called at all, `mouseover` of the list works itself).

   this.MouseMove = function(AE) {
      if (!daa.e.IsMouseDown(AE)) { return; }
      var xList = daa.n.Get(AE.vn.id + "_list"); if (!xList) { return; }
      var xNode = xList;
      if ("clientx" in AE) {
         xNode = document.elementFromPoint(AE.clientx, AE.clienty);
         if (daa.n.GetVN(xNode) != xList) { xNode = xList; }
      }
      var xE = daa.e.To(AE, xNode); xE.name = "mouseover";
      daa.e.Send(xE);
   };

    // Catches list's items selecting from mouseover and sets a flag that is used by this.MouseUp
    // to collapse the list and write down the final result.

   this.SelectingItem = function(AE) {
      var xMVN = daa.n.GetMasterVN(AE.vn); if (!xMVN || !daa.e.IsMouseDown({vnid: xMVN.id})) { return; }
      xMVN.daa_isselecting = 1;
   };

    // Catches list's items clicks, that signals that the used have chosen an item, so that
    // it should be written down.

   this.ClickItem = function(AE) {
      var xMVN = daa.n.GetMasterVN(AE.vn); if (!xMVN) { return; }
      this.CollapseAll({vn: xMVN});
      this.SelectItem({node: AE.node, vn: xMVN});
      if (!AE.iscall) { daa.e.Send({name: "changed", node: AE.node, vn: xMVN}, AE); }
      if (xMVN.daa_isclicksubmit) { daa.e.Send({name: "submit", node: AE.node, vn: xMVN}, AE); }
   };

   // **************************************************************************
   // Behavior

   this.SelectItem = function(AE) {
      var xVN = AE.vn;
      if (AE.node && AE.node.id != xVN.daa_selectedid) { daa.e.Send({name: "unselecteditem", node: daa.n.Get(xVN.daa_selectedid), vn: xVN}); }
      var xEdit = this.GetItemNode(xVN); if (!xEdit) { return; }
      var xNode = null;
      if (AE.node) {
          // Event caught from List
         xNode = daa.n.GetIN(AE.node) || {id: ""};
      } else {
          // Direct selection
         var xList = daa.n.Get(xVN.id + "_list") || {};
         var xVal = xVN.value; if ("value" in AE) { xVal = AE.value; }
         if (xVal == "_first") { xNode = daa.View(xList).GetFirstIN({vn: xList}) || {id: ""}; AE.node = xNode; }
         else { xNode = daa.View(xList).GetModelNode({vn: xList, modelpath: daa.p.Concat(xList.daa_modelpath, xVal)}) || {id: ""}; }
         daa.View(xList).SelectItem({node: xNode, vn: xList, iscall: 1});
      }

      var xPath = xNode.daa_modelpath || ""; if (xNode.daa_iscell) { xPath = daa.p.GetPath(xPath); }
      var xModel = xPath && daa.o.Get(xPath); if (!xModel && !daa.IsZero(xModel)) { xModel = ""; }
      if (!daa.IsObject(xModel)) { xModel = {name: daa.p.GetName(xPath), title: xModel}; }
      var xTemp = daa.n.ExtractFromTemplate(daa.n.GetTemplate(this, xVN, "editor"), "value", daa.RET_VALUE);
      if (xVN.vd && xVN.vd.templatereplace) { xTemp = daa.n.TemplateReplace(xTemp, xVN.vd.templatereplace); }
      xModel = daa.pattern.Fill(xTemp, xModel);
      if (!AE.issearch) { xEdit.value = xModel; }
      if (AE.node) { xVN.value = daa.p.GetName(xPath); }
      else if ("value" in AE && AE.iscall) { xVN.value = AE.value; }
      xVN.daa_selectedid = xNode.id;
      daa.e.Send({name: "selecteditem", node: xNode, vn: xVN}, AE);
   };

   this.Expand = function(AE) {
      if (!AE.vn) { return; }
      var xBox = daa.n.Get(AE.vn.id + "_box"); if (!xBox) { return; }
       // Register form's Floating View
      daa.app.AddFV("combobox", xBox);
       // Open dropdown box
      xBox.style.minWidth = daa.n.GetW(AE.vn, "ipbm") + "px";
      daa.dropdownbox.Open({node: xBox, opener: AE.vn, dropdownposition: AE.vn.daa_dropdownposition});
      AE.vn.daa_isexpanded = 1;
   };

   this.CollapseAll = function(AE) {
      if (!AE.vn || !AE.vn.daa_isexpanded) { return; }
      var xBox = daa.n.Get(AE.vn.id + "_box"); if (!xBox) { return; }
      xBox.style.display = "none";
      daa.app.DeleteFV("combobox", xBox);
      AE.vn.daa_isexpanded = 0;
   };

   // **************************************************************************
   // Filling

   this.CreateItems = function(AObj) {
      var xList = daa.n.Get(AObj.vn.id + "_list"); if (!xList) { return; }
      daa.View(xList).Fill({vn: xList, modelpath: daa.n.ResolvePath(AObj.vn, AObj.vd.itemspath)});
   };

   // **************************************************************************
   // Initialization

   this.CreateList = function(AVD, AVN) {
      daa.n.CreateFromTemplate(daa.pattern.Fill((AVD.templates && AVD.templates.btn) || this.templates.btn, AVD), AVN);
      var xBox  = daa.n.CreateFromTemplate(daa.pattern.Fill((AVD.templates && AVD.templates.box) || this.templates.box, AVD), document.body);
      this.inherited.CreateList(AVD, AVN, {vcid: AVD.listclass, mvnid: AVN.id}, xBox);
   };

   this.Init = function(AVD, AVN) {
      AVD.htmlclassName    = daa.csv.OR(AVD.htmlclassName || "editor", "flexboxrow", " ");
      AVD.listclass        = AVD.listclass        || "vlist";
      AVD.istextselectable = AVD.istextselectable || 0;
      this.inherited.Init(AVD, AVN);
      this.CreateList(AVD, AVN);
      var xEdit = this.GetItemNode(AVN); xEdit.readOnly = !AVD.istextselectable;
   };
},


// *****************************************************************************
// @class SearchBox daa.searchbox @groupname view

function SearchBox() {
   this.path = "daa";
   this.name = "searchbox";
   this.ancestors = "daa.combobox";

   this.rootevents = {
      oncomboboxclickitem: "ClickItem",
      oncomboboxselectingitem: "SelectingItem"
   };

    // ***
    // @object daa.searchbox.events

   this.events = {
      onchange: "Nop"
   };

    // ***
    // @object daa.searchbox.styles

   this.styles = {
      name:     "Editor",
      searchboxbtn:     "width: 16px; background-color: #ddd; box-shadow: 0px 0px 3px #aaa; background-position: center center; background-repeat: no-repeat; cursor: pointer;",
      searchboxbtnicon: "background-image: url('data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABhSURBVHjalJHdCcAwCITPDulM2bErdIMUri8aDhGSCvegfoo/RhLHRnIpbACgaKx8gRP08B3AnQUVVhBSwBbWkWr8qjuYmUvX5XcLns0c4Lu9RgBTE50SfnYgSdifD34DAK4YuAlQih4PAAAAAElFTkSuQmCC');"
   };

    // ***
    // @object daa.searchbox.templates

   this.templates = {
      btn: "<div id='%vnid%_btn' daa_isbtn class='searchboxbtn searchboxbtnicon'></div>"
   };

   this.listproperties = {
      limit: 5
   };

   // **************************************************************************
   // Event handlers

   this.KeyDown = function(AE) {
      if (/^13$/.test(AE.key)) {
         this.SelectItem({vn: AE.vn, iscall: 1});
      } else if (/^27$/.test(AE.key)) {
         this.SelectItem({vn: AE.vn, value: "", issearch: 1, iscall: 1});
      }
      this.inherited.KeyDown(AE);
   };

   this.Nop = function(AE) { };

   this.Change = function(AE) {
      this.FilterItems(AE);
   };

   // **************************************************************************
   // Filling

   this.FilterItems = function(AE) {
      var xEdit = this.GetItemNode(AE.vn); if (!xEdit) { return; }
      if (xEdit.value == xEdit.da_prevvalue) { return; }
      xEdit.da_prevvalue = xEdit.value;
      if (!xEdit.value) {
         this.CollapseAll(AE);
         this.SelectItem({vn: AE.vn, value: "", issearch: 1, iscall: 1});
      } else {
         var xFilter = xEdit.value.replace(daa.EscapeRE, "\\$1");
         if (AE.vn.vd.filter) { xFilter = AE.vn.vd.filter.replace(/%value%/, xFilter); }
         else { xFilter = "RegExp:^" + xFilter + " in (this/title || this/name)"; }
         this.CreateItems({vn: AE.vn, vd: AE.vn.vd, isfilter: 1, filter: xFilter});
         this.Expand(AE);
         this.SelectItem({vn: AE.vn, value: "_first", issearch: 1, iscall: 1});
      }
      if (!AE.iscall) { daa.e.Send({name: "changed"}, AE); }
   };

   this.CreateItems = function(AObj) {
      if (!AObj.isfilter || !AObj.filter) { return; }
      var xList = daa.n.Get(AObj.vn.id + "_list"); if (!xList) { return; }
      xList.vd.filter = AObj.filter;
      daa.model.InvalidateView(xList.id);
      daa.View(xList).Fill({vn: xList, modelpath: AObj.vd.daa_itemspath || AObj.vd.itemspath});
   };

   // **************************************************************************
   // Initialization

   this.Init = function(AVD, AVN) {
      AVD.istextselectable = 1;
      AVD.isemptyitem = 0;
      this.inherited.Init(AVD, AVN);
   };
},

// *****************************************************************************
// @class TextArea daa.textarea @groupname view

function TextArea() {
   this.path = "daa";
   this.name = "textarea";
   this.ancestors = "daa.input";

    // ***
    // @object daa.textarea.styles

   this.styles = {
      name:        "Editor",
      textarea:    "box-sizing: border-box; width: 100%; height: 100%; max-width: 100%; max-height: 100%; padding: 3px 4px; border: 0px; background-color: transparent; color: inherit;",
   };

    // ***
    // @object daa.textarea.templates

   this.templates = {
      editor: "<textarea id='%vnid%_editor' class='textarea'>view</textarea>"
   };

    // ***
    // @object daa.textarea.events

   // **************************************************************************
   // Event handlers

   this.KeyUp = function(AE) {
      if (!/^(9|27|37|38|39|40)$/.test(AE.key)) {
         this.Change(AE);
      }
   };

   this.MouseMove = function(AE) {
      this.Resize(AE);
   };

   // **************************************************************************
   // Behavior

   this.SaveExtents = function(AE) {
      var xEdit = this.GetItemNode(AE); if (!xEdit) { return; }
      var xWH = {width: 0, height: 0};
      for (var xkey in xWH) {
         if (!daa.css.IsSet(AE.vn, xkey)) { continue; }
         xWH[xkey] = daa.n.GetExtent(AE.vn, xkey, "ipbm");
         xEdit["daa_view" + xkey] = xWH[xkey];
         xEdit["daa_save" + xkey] = daa.n.GetExtent(xEdit, xkey, "ipbm");
         xEdit["daa_" + xkey + "diff"] = xWH[xkey] - xEdit["daa_save" + xkey];
      }
      xEdit.daa_issavedextents = 1;
   };

   this.Resize = function(AE) {
      var xEdit = this.GetItemNode(AE); if (!xEdit) { return; }
      if (!xEdit.daa_issavedextents) { return this.SaveExtents(AE); }
      var xWH = {}; if (xEdit.daa_savewidth) { xWH.width = 0; } if (xEdit.daa_saveheight) { xWH.height = 0; }
      for (var xkey in xWH) {
         xWH[xkey] = daa.n.GetExtent(xEdit, xkey, "ipbm");
         if (xWH[xkey] == xEdit["daa_save" + xkey]) { continue; }
         xEdit["daa_save" + xkey] = xWH[xkey];
         daa.n.SetExtent(AE.vn, xkey, Math.min(xEdit["daa_view" + xkey], xWH[xkey] + xEdit["daa_" + xkey + "diff"]));
      }
   };

   this.Init = function(AVD, AVN) {
      this.inherited.Init(AVD, AVN);
      ("isresizable" in AVD) ? AVD : AVD.isresizable = 1;
      if (!AVD.isresizable) { AVN.style.resize = "none"; }
   };

}

);

