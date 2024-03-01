function e(e){if(!e)return;if("undefined"==typeof window)return;const t=document.createElement("style");return t.setAttribute("type","text/css"),t.innerHTML=e,document.head.appendChild(t),e}import t,{useCallback as r,useEffect as n,useState as a,forwardRef as o,useRef as l}from"react";import{DOMEventHandlers as i,EditorMode as m,PageMode as c,RowFlex as s,ListType as d,ListStyle as u}from"@mindfiredigital/canvas-editor";import{useDispatch as f,useSelector as p,Provider as g}from"react-redux";import{useParams as b}from"react-router-dom";import h from"@mui/material/Stack";import{createSlice as x,configureStore as E}from"@reduxjs/toolkit";import{styled as C}from"@mui/material/styles";import y,{SliderThumb as S}from"@mui/material/Slider";import v from"@mui/icons-material/ArrowRight";import k from"@mui/icons-material/ArrowDropDownTwoTone";import I from"@mui/material/Box";import T from"@mui/material/AppBar";import z from"@mui/icons-material/FormatBold";import w from"@mui/material/Tooltip";import L from"@mui/material/IconButton";import R from"@mui/icons-material/FormatItalic";import{Tooltip as A,Box as M,Popover as O,Grid as N,Typography as F,IconButton as H,TextField as D,ClickAwayListener as j,Paper as B,Input as _,Stack as G}from"@mui/material";import P from"@mui/icons-material/FormatAlignLeft";import U from"@mui/icons-material/FormatAlignCenter";import W from"@mui/icons-material/FormatAlignRight";import $ from"@mui/icons-material/FormatAlignJustify";import J from"@mui/icons-material/Undo";import Y from"@mui/icons-material/Redo";import q from"@mui/icons-material/FormatUnderlined";import X from"@mui/icons-material/Subscript";import K from"@mui/icons-material/Superscript";import Q from"@mui/icons-material/StrikethroughS";import V from"@mui/icons-material/FormatListBulleted";import Z from"@mui/icons-material/FormatListNumbered";import ee from"@mui/material/MenuItem";import te from"@mui/material/FormControl";import re from"@mui/material/Select";import ne from"@mui/material/Table";import ae from"@mui/material/TableBody";import oe from"@mui/material/TableCell";import le from"@mui/material/TableRow";import ie from"@mui/material/Typography";import me from"@mui/icons-material/BackupTable";import ce from"@mui/icons-material/Close";import se from"@mui/icons-material/FormatColorText";import de from"@mui/icons-material/ColorLens";import{PhotoshopPicker as ue}from"react-color";import fe from"@mui/icons-material/Check";import pe from"@mui/icons-material/Colorize";import{Remove as ge,Add as be}from"@mui/icons-material";import he from"@mui/icons-material/InsertLink";import xe from"@mui/icons-material/InsertPhoto";import Ee from"@mui/material/Divider";import Ce from"@mui/material/Toolbar";import ye from"@mui/icons-material/DocumentScannerOutlined";import Se from"@mui/material/Dialog";import ve from"@mui/material/DialogActions";import ke from"@mui/material/DialogContent";import Ie from"@mui/material/DialogTitle";import Te from"@mui/material/Button";import ze from"@mui/material/TextField";import we from"@mui/material/Grid";import Le from"@r2wc/react-to-web-component";e(".editor > div {\n  margin: auto;\n}\n\n.canvas-editor {\n  position: relative;\n  border-left: 1px solid rgba(0, 0, 0, 0.3);\n  border-top: 1px solid rgba(0, 0, 0, 0.3);\n  padding-top: 10px;\n}\n\n.canvas-editor-main {\n  padding: 70px 30px 80px;\n  margin: auto;\n}");const Re=(e,t)=>{const[r,o]=a(e);return n((()=>{const r=setTimeout((()=>{o(e)}),t);return()=>{clearTimeout(r)}}),[e,t]),r},Ae=x({name:"document",initialState:{documentId:"",title:"",reloadRecentDoc:!1,margins:[]},reducers:{setDocumentTitle:(e,t)=>{e.title=t.payload.title},reloadRecentDoc:(e,t)=>{e.reloadRecentDoc=t.payload.reloadRecentDoc},setDocumentMargins:(e,t)=>{e.margins=t.payload.margins},setDocumentId:(e,t)=>{e.documentId=t.payload.documentId}}}),{setDocumentTitle:Me,reloadRecentDoc:Oe,setDocumentId:Ne,setDocumentMargins:Fe}=Ae.actions;var He=Ae.reducer;const De=C(y)((()=>({width:1,padding:"0",color:"#0000004d",borderRadius:0,border:"none","& .MuiSlider-rail":{opacity:1,backgroundColor:"#0000004d",left:"-2px",transform:"translateX(0%)"},"& .MuiSlider-track":{width:1,left:-2,border:"none",backgroundColor:"white"},"& .MuiSlider-mark":{backgroundColor:"#0000004d",height:1,width:11,left:-8},"& .MuiSlider-markLabel":{fontSize:12,fontWeight:"normal",left:-22},"& .MuiSlider-thumb":{backgroundColor:"transparent","&:hover":{backgroundColor:"transparent",boxShadow:"none"}}}))),je=C(y)((()=>({height:1,padding:"0",color:"#0000004d",borderRadius:0,border:"none",top:0,"& .MuiSlider-rail":{opacity:1,backgroundColor:"#0000004d",transform:"translateY(0%)"},"& .MuiSlider-track":{height:1,border:"none",backgroundColor:"white"},"& .MuiSlider-mark":{backgroundColor:"#0000004d",height:11,width:1,top:-4},"& .MuiSlider-markLabel":{fontSize:12,fontWeight:"normal",top:-27},"& .MuiSlider-thumb":{backgroundColor:"transparent",top:3,"&:hover":{backgroundColor:"transparent",boxShadow:"none"}}}))),Be=new Array(12).fill(0).map(((e,t)=>({value:96*-t,label:t}))),_e=new Array(9).fill(0).map(((e,t)=>({value:96*t,label:t})));function Ge(e){const{children:r,...n}=e;return t.createElement(S,{...n},r,t.createElement(v,{color:"primary",fontSize:"large"}))}function Pe(e){const{children:r,...n}=e;return t.createElement(S,{...n},r,t.createElement(k,{color:"primary",fontSize:"large"}))}function Ue({documentId:e}){const r=f(),o=p((e=>e.document)),[l,m]=a([]),[c,s]=a([]),d=Re(o.margins,500),u=(e,t)=>{let[n,a]=t;m(t);let o=[...d];o[0]=Math.abs(a),o[1]=1056-Math.abs(n),i.setPaperMargins(o),r(Fe({margins:o}))},g=(e,t)=>{let[n,a]=t;s(t);let o=[...d];o[2]=n,o[3]=816-a,i.setPaperMargins(o),r(Fe({margins:o}))};return n((()=>{d?.length&&e&&(m([-1*Math.abs(1056-d[1]),-1*d[0]]),s([d[2],816-d[3]]),l.length||c.length||i.setPaperMargins(d))}),[d,e]),t.createElement(t.Fragment,null,t.createElement(h,{sx:{height:"1056px",position:"absolute",left:"0px"},direction:"row"},t.createElement(De,{orientation:"vertical",value:l.length?l:[-956,-100],min:-1056,max:0,marks:Be,onChange:e=>u,step:24,track:"inverted",scale:e=>-1056,size:"small",slots:{thumb:Ge},valueLabelDisplay:"off"})),t.createElement(h,{sx:{height:"1px",position:"absolute",top:"-1px",width:"816px",left:"calc((100% - 811px) / 2)"},direction:"row"},t.createElement(je,{orientation:"horizontal",value:c.length?c:[120,696],min:0,max:816,marks:_e,onChange:e=>g,step:24,size:"small",scale:e=>816,slots:{thumb:Pe},valueLabelDisplay:"off"})))}const We=o((function(e,o){const[l,s]=a({left:1180,top:250,visiblity:!1}),[d,u]=a([]),[p,g]=a(""),{documentId:h}=b();((e,t)=>{const a=r((()=>{const r=i.getSelectedText(),n=r?.toString().trim();n?(e(n),t((e=>({...e,visiblity:!0})))):t((e=>({...e,visiblity:!1})))}),[t,e]);n((()=>(document.addEventListener("mouseup",a),()=>{document.removeEventListener("mouseup",a)})),[a])})(g,s);const x=f();return n((()=>{const t=document.querySelector(".canvas-editor");if(t.querySelector('[editor-component="main"]'))return;const r={height:1056,width:816,mode:m.EDIT,pageMode:c.PAGING,pageNumber:{format:"{pageNo}/{pageCount}"},minSize:1,maxSize:72};t.addEventListener("mouseup",(t=>{e.onSelect&&e?.onSelect(i.getSelectedText())})),t.addEventListener("keydown",(t=>{const r=i.getContent()?.data?.main;u(r),e?.onChange&&e?.onChange(r[0].value)})),i.register(t,d,r)}),[]),n((()=>{e?.data&&(u(e?.data),i.setContent({main:[{value:e?.data}]}))}),[h,x,e?.data]),t.createElement("div",{className:"canvas-editor-main",style:e?.style?.editorMain},t.createElement("div",{className:"canvas-editor editor",ref:o,style:e?.style?.margin},t.createElement(Ue,{documentId:h})))}));function $e(e){return t.createElement(w,{title:e.title},t.createElement(L,{size:"small",edge:"start","aria-label":e.title,sx:{mr:1,borderRadius:0,...e.sx},onClick:e.handleClick},e.children))}var Je,Ye;!function(e){e.ARIAL="Arial",e.CALIBRI="Calibri",e.TIMES_NEW_ROMAN="Times New Roman",e.ROBOTO="Roboto",e.IMPACT="IMPACT",e.RALEWAY="Raleway",e.LATO="Lato",e.COURIER_NEW="Courier New",e.COMIC_SANS="Comic Sans MS",e.CONSTANTIA="Constantia",e.GEORGIA="Georgia",e.PACIFICO="Pacifico"}(Je||(Je={})),function(e){e.Normal="normal",e["Heading 1"]="first",e["Heading 2"]="second",e["Heading 3"]="third",e["Heading 4"]="fourth",e["Heading 5"]="fifth",e["Heading 6"]="sixth"}(Ye||(Ye={}));const qe=[6,7,8,10,12,14,16,18,20,21,24,29,32,34,48,56,72],Xe=["#000000","#434343","#666666","#999999","#b7b7b7","#cccccc","#d9d9d9","#efefef","#f3f3f3","#ffffff","#980000","#ff0000","#ff9900","#ffff00","#00ff00","#00ffff","#4a86e8","#0000ff","#9900ff","#ff00ff","#e6b8af","#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#c9daf8","#cfe2f3","#d9d2e9","#ead1dc","#dd7e6b","#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#a4c2f4","#9fc5e8","#b4a7d6","#d5a6bd","#cc4125","#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6d9eeb","#6fa8dc","#8e7cc3","#c27ba0","#a61c00","#cc0000","#e69138","#f1c232","#6aa84f","#45818e","#3c78d8","#3d85c6","#674ea7","#a64d79","#85200c","#990000","#b45f06","#bf9000","#38761d","#134f5c","#1155cc","#0b5394","#351c75","#741b47","#5b0f00","#660000","#783f04","#7f6000","#274e13","#0c343d","#1c4587","#073763","#20124d","#4c1130"];var Ke;function Qe(e){const[r,n]=a("Arial");return t.createElement("div",null,t.createElement(A,{title:"Font"},t.createElement(te,{sx:{m:1,minWidth:80,width:120},size:"small",variant:"standard"},t.createElement(re,{sx:Object.assign({fontSize:"0.8rem"},e.style),value:r,onChange:e=>{n(e.target.value),i.handleFontFamily(e.target.value)},inputProps:{"aria-label":"font family"}},Object.values(Je).map((e=>t.createElement(ee,{key:e,value:e,sx:{fontSize:"0.8rem",fontFamily:e}},e)))))))}!function(e){e.COLOR="color",e.HIGHLIGHT="highlight"}(Ke||(Ke={})),e(".activeCell {\n  border: 1px solid rgba(73, 145, 242, 0.2) !important;\n  background: rgba(73, 145, 242, 0.15) !important;\n}\n\n.tableCollapse {\n  width: 17.25rem;\n  height: 19.375;\n  background: #fff;\n  box-shadow: 0 0.125rem 0.75rem 0 rgba(56, 56, 56, 0.2);\n  border: 0.063rem solid #e2e6ed;\n  box-sizing: border-box;\n  border-radius: 0.125rem;\n  position: absolute;\n  z-index: 99;\n  padding: 0.875rem 1.688rem;\n  cursor: auto;\n}\n\n.tableTitle {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-bottom: 5px;\n  border-bottom: 1px solid #e2e6ed;\n  color: black;\n}\n\n.tableContainer {\n  position: relative;\n}");const Ve=e=>{const[r,o]=a(-1),[l,m]=a(-1),[c,s]=a(!1),[d,u]=a("Insert table");n((()=>{l>-1&&r>-1&&u(`${l}×${r}`)}),[l,r]);const f=()=>{s(!1),o(-1),m(-1),u("Insert table")};return t.createElement(I,{className:"tableContainer"},t.createElement($e,{title:"Insert table",handleClick:()=>{s(!0)},sx:Object.assign({height:"100%"},e.style)},t.createElement(me,{style:{fontSize:"large"}})),c&&t.createElement(I,{className:"tableCollapse"},t.createElement(I,{className:"ableTitle"},t.createElement(ie,{sx:{fontSize:"0.8rem"}},d),t.createElement($e,{title:"Close table",sx:{cursor:"pointer"},handleClick:f},t.createElement(ce,{sx:{width:"0.8rem",height:"0.8rem"}}))),t.createElement(ne,{onMouseMove:e=>{const{offsetX:t,offsetY:r}=e.nativeEvent;o(Math.ceil(t/22)||1),m(Math.ceil(r/20)||1)},onClick:()=>{i.createTable({rowIndex:l,colIndex:r}),f()},sx:{borderCollapse:"separate",borderSpacing:"0.25rem"}},t.createElement(ae,null,[...Array(10)].map(((e,n)=>t.createElement(le,{key:n},[...Array(10)].map(((e,a)=>t.createElement(oe,{className:n<l&&a<r?"activeCell":"",key:a,sx:{padding:"6px",width:"16px",height:"16px",boxSizing:"border-box",border:"1px solid #e2e6ed",background:"#fff",marginRight:"6px",pointerEvents:"none"}}))))))))))},Ze=({colorPickerHandleClose:e,colorPickerAnchor:r,color:n,feature:o})=>{p((e=>e.document));const[l,i]=a(null==n?void 0:n),m=Boolean(r),c=m?"font-color-popover":void 0;return t.createElement(M,null,t.createElement(O,{id:c,open:m,anchorEl:r,onClose:e,anchorOrigin:{vertical:"center",horizontal:"center"},transformOrigin:{vertical:"center",horizontal:"center"},className:"custom-popover-paper"},t.createElement(ue,{color:l,onChangeComplete:e=>{i(e.hex)},onAccept:async()=>{e()},onCancel:()=>{e()},header:"Pick Your Color"})))},et=({anchorEl:e,handleClose:r,definedColor:n,feature:o})=>{const[l,m]=a([]),[c,s]=a(null);p((e=>e.document));const d=e=>{o===Ke.HIGHLIGHT?i.highlightText(e):o===Ke.COLOR&&i.setFontColor(e)};return t.createElement(t.Fragment,null,t.createElement(M,null,t.createElement(O,{open:Boolean(e),anchorEl:e,onClose:r,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"}},t.createElement(N,{container:!0,sx:{width:"14.1rem",height:"auto",display:"flex",margin:"10px 10px 4px 10px",justifyContent:"flex-start"}},Xe?.map(((e,r)=>t.createElement(N,{item:!0,key:r,sx:{display:"flex",justifyContent:"center",alignItems:"center",height:"1.4rem",width:"1.4rem"}},t.createElement(M,{sx:{width:".7rem",height:".7rem",backgroundColor:e,borderRadius:"50%",cursor:"pointer",padding:"4px",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:e===n?"0px 2px 4px rgba(0, 0, 0, 0.5)":""},onClick:()=>{d(e)}},e===n?t.createElement(fe,{fontSize:"inherit"}):""))))),t.createElement(M,{sx:{margin:"0 10px 0 17px"}},t.createElement(F,{variant:"body2",sx:{fontSize:"12px",fontWeight:"bold"}},"CUSTOM")),t.createElement(M,{sx:{margin:"8px 10px 10px 10px",display:"flex"}},l?.map(((e,r)=>t.createElement(M,{key:r,sx:{width:".7rem",height:".7rem",backgroundColor:e,borderRadius:"50%",cursor:"pointer",padding:"4px",margin:"2px",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:e===n?"0px 2px 4px rgba(0, 0, 0, 0.5)":""},onClick:()=>d(e)},e===n?t.createElement(fe,{fontSize:"inherit"}):""))),t.createElement(H,{onClick:e=>{s(e.currentTarget)},sx:{padding:"1px",marginBottom:"2px"}},t.createElement(A,{title:"Add a custom color"},t.createElement(de,{fontSize:"small"})))))),c?t.createElement(Ze,{colorPickerHandleClose:()=>{s(null)},colorPickerAnchor:c,color:n,feature:o}):null)},tt=({textColor:e,style:r})=>{const[n,o]=a(null),l=Boolean(n)?"font-color-popover":void 0;return t.createElement(M,null,t.createElement(A,{title:"Text color"},t.createElement(L,{size:"small","aria-describedby":l,sx:Object.assign({mr:1,borderRadius:0},r),onClick:e=>{o(e.currentTarget)}},t.createElement(se,{style:{fontSize:"large"}}))),t.createElement(et,{anchorEl:n,handleClose:()=>{o(null)},definedColor:e,feature:Ke.COLOR}))},rt=({color:e,style:r})=>{const[n,o]=a(null),l=Boolean(n)?"font-color-popover":void 0;return t.createElement(M,null,t.createElement(w,{title:"Highlight color"},t.createElement(L,{size:"small","aria-describedby":l,sx:Object.assign({mr:1,borderRadius:0},r),onClick:e=>{o(e.currentTarget)}},t.createElement(pe,{style:{fontSize:"large"}}))),t.createElement(et,{anchorEl:n,handleClose:()=>{o(null)},definedColor:e,feature:Ke.HIGHLIGHT}))},nt=({onChange:e,onClose:r})=>t.createElement(j,{onClickAway:r},t.createElement(B,{sx:{position:"absolute",zIndex:9999,margin:"0 37px"}},qe.map(((r,n)=>t.createElement(at,{key:n,onClick:()=>e(r)},r))))),at=({onClick:e,children:r})=>t.createElement("div",{onClick:e,style:{cursor:"pointer",padding:"8px"}},r),ot=({size:e=16,style:r})=>{const[o,l]=a(e),[m,c]=a(!1);n((()=>{l(e)}),[e]);const s=()=>{c(!1)};return t.createElement(M,{sx:r},t.createElement(L,{onClick:()=>{o>1&&(l((e=>e-2)),i.decreaseFontSize())},sx:[Object.assign({mr:1,borderRadius:0},r),{padding:"1px",margin:"8px 0"}]},t.createElement(A,{title:"Decrease font size"},t.createElement(ge,{style:{fontSize:"large"}}))),t.createElement(A,{title:"Font size"},t.createElement(D,{type:"text",value:o,onClick:()=>{c(!0)},onChange:e=>{const t=Number(e.target.value);l(t),i.setSize(Number(t))},style:{width:"50px",margin:"7px 0",cursor:"pointer"},inputProps:{style:{textAlign:"center",padding:"1px 1px",fontSize:14}}})),m&&t.createElement(nt,{onChange:e=>{l(e),s(),i.setSize(Number(e))},onClose:s}),t.createElement(L,{onClick:()=>{o<72&&(l((e=>e+2)),i.increaseFontSize())},sx:[Object.assign({mr:1,borderRadius:0},r),{padding:"1px",margin:"8px 0"}]},t.createElement(A,{title:"Increase font size"},t.createElement(be,{style:{fontSize:"large"}}))))},lt=e=>{const[r,n]=a(null);return t.createElement(M,{sx:Object.assign({display:"flex",justifyContentt:"center",alignItems:"center",margin:"0 0.5rem"},e.style)},t.createElement(A,{title:"Styles"},t.createElement(te,{sx:{m:1,minWidth:80,width:120},size:"small",variant:"standard"},t.createElement(re,{labelId:"heading-label",sx:{fontSize:"0.8rem"},value:r||"Normal"},Object.keys(Ye).map((e=>t.createElement(ee,{key:e,value:e,sx:{fontSize:("Normal"===e?14:26-2*Number(e.charAt(e.length-1)))+"px",fontWeight:""+("Normal"===e?"":"bold")},onClick:()=>(e=>{n(e);const t=e?Ye[e]:null;i.setTitle(t)})("Normal"===e?null:e)},e)))))))},it=e=>{const r=l(null),[o,m]=a(""),[c,s]=a(0),[d,u]=a(0);n((()=>{o&&i.setImage({value:o,height:c,width:d})}),[o,c,d]);return t.createElement(t.Fragment,null,t.createElement(_,{type:"file",inputRef:r,style:{display:"none"},inputProps:{accept:"image/*"},onChange:e=>{const t=e.target.files;if(t&&t.length>0){const e=t[0],r=new FileReader;r.onloadend=()=>{const e=r.result;m(e);const t=new Image;t.onload=()=>{s(t.height),u(t.width)},t.src=e},r.readAsDataURL(e)}}}),t.createElement(H,{size:"small",sx:Object.assign({mr:1,borderRadius:0},e.style),onClick:()=>{r.current&&r.current.click()}},t.createElement(A,{title:"Image",style:e.style},t.createElement(xe,{style:{fontSize:"large"}}))))},mt=o((function(e,r){const[o,l]=a(),[m,c]=a(s.LEFT),[f,p]=a(""),[g,b]=a([]),h={color:void 0!==e?.toolbarClass?.item?.selectedToolbarItemColor?.color?e?.toolbarClass?.item?.selectedToolbarItemColor?.color:"#1a73e8"},x=e=>{let t;t=-1===g.indexOf(e)?[...g,e]:g.filter((t=>t!==e)),b(t)};return n((()=>{let e;const t=setTimeout((()=>{e=setInterval((()=>{const e=i.getContentStyles();l(e)}),100)}),1e3);return()=>{clearInterval(e),clearTimeout(t)}}),[]),t.createElement(I,{sx:{flexGrow:1}},t.createElement(T,{position:"fixed",sx:e?.toolbarClass?.container},t.createElement(G,{sx:e?.toolbarClass?.primaryToolbar},(!e?.toolbar||e?.toolbar?.undo)&&t.createElement($e,{sx:e?.toolbarClass?.item?.undo,title:"Undo",handleClick:i.handleUndo},t.createElement(J,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.redo)&&t.createElement($e,{sx:e?.toolbarClass?.item?.redo,title:"Redo",handleClick:i.handleRedo},t.createElement(Y,{style:{fontSize:"large"}})),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:-5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.bold)&&t.createElement($e,{sx:g.indexOf("Bold")>-1&&h,title:"Bold",handleClick:()=>{i.handleBold(),x("Bold")}},t.createElement(z,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.italic)&&t.createElement($e,{sx:g.indexOf("Italic")>-1&&h,title:"Italic",handleClick:()=>{i.handleItalic(),x("Italic")}},t.createElement(R,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.underline)&&t.createElement($e,{sx:g.indexOf("Underline")>-1&&h,title:"Underline",handleClick:()=>{i.handleUnderline(),x("Underline")}},t.createElement(q,{style:{fontSize:"large"}})),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:-5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.subscript)&&t.createElement($e,{sx:e?.toolbarClass?.item?.subscript,title:"Subscript",handleClick:i.handleSubscript},t.createElement(X,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.superscript)&&t.createElement($e,{sx:e?.toolbarClass?.item?.superscript,title:"Superscript",handleClick:i.handleSuperscript},t.createElement(K,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.strikethrough)&&t.createElement($e,{sx:e?.toolbarClass?.item?.strikethrough,title:"Strikethrough",handleClick:i.handleStrikeout},t.createElement(Q,{style:{fontSize:"large"}})),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:-5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.leftAlign)&&t.createElement($e,{sx:m===s.LEFT&&h,title:"Left align",handleClick:()=>{i.handleAlign(s.LEFT),c(s.LEFT)}},t.createElement(P,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.centerAlign)&&t.createElement($e,{sx:m===s.CENTER&&h,title:"Center align",handleClick:()=>{i.handleAlign(s.CENTER),c(s.CENTER)}},t.createElement(U,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.rightAlign)&&t.createElement($e,{sx:m===s.RIGHT&&h,title:"Right align",handleClick:()=>{i.handleAlign(s.RIGHT),c(s.RIGHT)}},t.createElement(W,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.justify)&&t.createElement($e,{sx:m===s.ALIGNMENT&&h,title:"Justify",handleClick:()=>{i.handleAlign(s.ALIGNMENT),c(s.ALIGNMENT)}},t.createElement($,{style:{fontSize:"large"}})),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:-5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.bulletList)&&t.createElement($e,{sx:f===d.UL&&h,title:"Bullet list",handleClick:()=>{i.handleList(d.UL,u.DECIMAL),f===d.UL?p(""):p(d.UL)}},t.createElement(V,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.numberedList)&&t.createElement($e,{sx:f===d.OL&&h,title:"Numbered list",handleClick:()=>{i.handleList(d.OL,u.DECIMAL),f===d.OL?p(""):p(d.OL)}},t.createElement(Z,{style:{fontSize:"large"}})),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:-5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.fontType)&&t.createElement(Qe,{style:e?.toolbarClass?.item?.fontType}),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.table)&&t.createElement(Ve,{style:e?.toolbarClass?.item?.table}),(!e?.toolbar||e?.toolbar?.fontColor)&&t.createElement(tt,{style:e?.toolbarClass?.item?.fontColor,textColor:o?.color}),(!e?.toolbar||e?.toolbar?.highlight)&&t.createElement(rt,{style:e?.toolbarClass?.item?.highlight,color:o?.highlight}),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:-5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.fontSize)&&t.createElement(ot,{style:e?.toolbarClass?.item?.fontSize,size:o?.size}),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.heading)&&t.createElement(lt,{style:e?.toolbarClass?.item?.heading}),t.createElement(Ee,{flexItem:!0,orientation:"vertical",sx:{mx:.5,my:1},style:{marginLeft:-5,marginRight:5}}),(!e?.toolbar||e?.toolbar?.hyperlink)&&t.createElement($e,{sx:e?.toolbarClass?.item?.hyperlink,title:"Hyperlink",handleClick:()=>i.createHyperLink()},t.createElement(he,{style:{fontSize:"large"}})),(!e?.toolbar||e?.toolbar?.image)&&t.createElement(it,{style:e?.toolbarClass?.item?.image}))))})),ct=()=>{f(),b();const e=p((e=>e.document)),r=Re(e.margins,500),[o,l]=a(!1),[i,m]=a([]),c=()=>l(!1),s=(e,t)=>{const{value:r}=e.target;let n=[...i];n[t]=r?parseInt(r):"",m(n)},d=async()=>{[...i].map((e=>e||0))};return n((()=>{r?.length&&m(r)}),[r]),t.createElement(t.Fragment,null,t.createElement($e,{title:"Margin",handleClick:()=>l(!0)},t.createElement(ye,{sx:{fontSize:20}})),t.createElement(Se,{open:o,onClose:c,maxWidth:"xs"},t.createElement(Ie,null,"Margins",t.createElement(L,{"aria-label":"close",onClick:c,sx:{position:"absolute",right:8,top:8,color:e=>e.palette.grey[500]}},t.createElement(ce,null))),t.createElement(ke,null,t.createElement(I,{sx:{display:"flex",flexDirection:"column",m:"auto",width:"fit-content"}},t.createElement(we,{container:!0,spacing:2},t.createElement(we,{container:!0,item:!0},t.createElement(we,{item:!0,xs:3},"Top :"),t.createElement(we,{item:!0,xs:9},t.createElement(ze,{type:"number",inputProps:{inputMode:"numeric",pattern:"[0-9]"},size:"small",variant:"outlined",value:i?.[0],onChange:e=>s(e,0)}))),t.createElement(we,{container:!0,item:!0,spacing:1},t.createElement(we,{item:!0,xs:3},"Bottom :"),t.createElement(we,{item:!0,xs:9},t.createElement(ze,{type:"number",inputProps:{inputMode:"numeric",pattern:"[0-9]"},size:"small",variant:"outlined",value:i?.[1],onChange:e=>s(e,1)}))),t.createElement(we,{container:!0,item:!0,spacing:1},t.createElement(we,{item:!0,xs:3},"Left :"),t.createElement(we,{item:!0,xs:9},t.createElement(ze,{type:"number",inputProps:{inputMode:"numeric",pattern:"[0-9]"},size:"small",variant:"outlined",value:i?.[2],onChange:e=>s(e,2)}))),t.createElement(we,{container:!0,item:!0,spacing:1},t.createElement(we,{item:!0,xs:3},"Right :"),t.createElement(we,{item:!0,xs:9},t.createElement(ze,{type:"number",inputProps:{inputMode:"numeric",pattern:"[0-9]"},size:"small",variant:"outlined",value:i?.[3],onChange:e=>s(e,3)})))))),t.createElement(ve,null,t.createElement(Te,{onClick:c},"Close"),t.createElement(Te,{autoFocus:!0,onClick:()=>{d()}},"Save changes"))))};function st(){return t.createElement(I,{sx:{flexGrow:1}},t.createElement(T,{position:"fixed",sx:{top:"auto",bottom:0,backgroundColor:"#edf2fa"}},t.createElement(Ce,{variant:"dense",sx:{height:"30px",minHeight:"30px"}},t.createElement(I,{sx:{flexGrow:1}}),t.createElement(I,{sx:{display:{xs:"none",md:"flex"}}},t.createElement(ct,null)))))}const dt=E({reducer:{document:He}}),ut={container:{},primaryToolbar:{justifyContent:"center"},item:{undo:{},redo:{},bold:{},italic:{},underline:{},image:{},fontType:{},table:{},fontColor:{},highlight:{},fontSize:{},heading:{},selectedToolbarItemColor:{}}},ft={editorMain:{},margin:{}};function pt(e){console.log(`test -> ${e}`)}function gt(e){console.log(`select->, ${e}`)}const bt="Hello world",ht=({toolbar:e,toolbar_class:r=c,canvas_class:n=ft,on_change:a=pt,on_select:o=gt,value:i=bt})=>{const m={container:{backgroundColor:"#edf2fa",border:"none",minHeight:"40px",boxShadow:"none"},primaryToolbar:{display:"flex",flexDirection:"row",minHeight:"40px",justifyContent:"center",alignItems:"center"}},c=r&&Object.keys(r).length?{container:{...m.container,...r?.container},primaryToolbar:{...m.primaryToolbar,...r?.primaryToolbar},item:{...r?.item}}:m,s=l(null);return t.createElement(g,{store:dt},t.createElement(t.Fragment,null,t.createElement(mt,{ref:s,toolbar:e,toolbarClass:c}),t.createElement(We,{ref:s,style:n,onChange:a,onSelect:o,data:i}),t.createElement(st,null)))},xt=Le(ht,{props:{value:"string",toolbar:"json",toolbar_class:"json",canvas_class:"json",on_change:"function",on_select:"function"}});customElements.define("web-doc",xt);const Et=e=>{window.handleChange=!e||e&&!e.on_change?e.on_change:pt,window.handleSelectedText=!e||e&&!e.on_select?e.on_select:gt,setTimeout((()=>{document.getElementById("document-editor").innerHTML=`<web-doc \n      value='${e&&e.value?e.value:bt}'\n      toolbar_class='${e&&e.toolbar_class?JSON.stringify(e.toolbar_class):JSON.stringify(ut)}' \n      canvas_class='${e&&e.canvas_class?JSON.stringify(e.canvas_class):JSON.stringify(ft)}'\n      on_change='handleChange'\n      on_select='handleSelectedText'\n    />`}),1e3)};export{We as CanvasEditor,ht as DocumentEditor,Et as DocumentEditorWebComponent};