import{c as M,r as f,j as e,C as U,a as H,m as a,S as R,P as G,U as K,t as T,A as P,s as Z,u as J,b as Q,N as ee,L as te}from"./index-BgtLIF6L.js";import{Footer as ie}from"./Footer-Cdxc1tz_.js";import{u as re,a as ae}from"./useCalendar-DTiMvFHx.js";import{C as ne,a as oe}from"./chevron-right-C2sZLmp-.js";import{C as q}from"./clock-BQXwyWkb.js";import{S as se}from"./sunset-C2Kot0cF.js";import{C as _}from"./check-Ds-CQaI1.js";import{I as V}from"./info-CE_2Kfyg.js";import{U as le}from"./user-Dq_SOtvA.js";import{M as de}from"./message-square-58zFesG-.js";import{L as ce}from"./loader-circle-Dd0VitYI.js";import{C as me}from"./circle-alert-CdMdOBmK.js";import{u as pe}from"./usePackages-CotYPbJ7.js";import{A as ge}from"./arrow-left-CqFJ1Keu.js";import{H as ue}from"./house-CE1JIjXO.js";import{F as xe}from"./file-text-DQibtGRX.js";import"./mail-BvXl1A_y.js";import"./logger-DwKo-Kyg.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],be=M("briefcase",he);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=[["path",{d:"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",key:"1ptgy4"}],["path",{d:"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",key:"1sl1rz"}]],fe=M("droplets",ye);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],je=M("moon",ke);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],Ce=M("sun",ve);function Se({selectedDate:d,onDateSelect:S,minDate:j=new Date}){const[u,x]=f.useState(new Date),b=t=>{const l=t.getFullYear(),m=t.getMonth(),p=new Date(l,m,1),E=new Date(l,m+1,0),A=E.getDate(),k=p.getDay();return{daysInMonth:A,startingDayOfWeek:k,year:l,month:m,firstDay:p,lastDay:E}},{year:r,month:g,daysInMonth:o,startingDayOfWeek:v}=b(u),{data:s={},isLoading:F,error:C}=re(r,g+1);console.log("[PublicBookingCalendar] Render state:",{year:r,month:g+1,isLoading:F,hasError:!!C,errorMessage:C?.message,dataKeyCount:Object.keys(s).length,dataKeys:Object.keys(s).slice(0,10),sampleData:Object.entries(s).slice(0,5),fullData:s});const y=()=>{const t=new Date(r,g-1);console.log("[PublicBookingCalendar] Previous month clicked",{from:`${r}-${g+1}`,to:`${t.getFullYear()}-${t.getMonth()+1}`}),x(t)},c=()=>{const t=new Date(r,g+1);console.log("[PublicBookingCalendar] Next month clicked",{from:`${r}-${g+1}`,to:`${t.getFullYear()}-${t.getMonth()+1}`}),x(t)},I=t=>`${r}-${String(g+1).padStart(2,"0")}-${String(t).padStart(2,"0")}`,h=(t,l)=>{const m=new Date;if(m.setHours(0,0,0,0),l<m)return console.log(`[PublicBookingCalendar] Date ${t} is in the past`),"past";const p=s[t];return console.log(`[PublicBookingCalendar] getDateStatus for ${t}:`,{hasDayData:!!p,dayData:p}),p?p.full_day?(console.log(`[PublicBookingCalendar] ${t} is full_day → full`),"full"):p.morning||p.evening||p.night||p.short_duration?(console.log(`[PublicBookingCalendar] ${t} has partial bookings → partial`,{morning:p.morning,evening:p.evening,night:p.night,short_duration:p.short_duration}),"partial"):(console.log(`[PublicBookingCalendar] ${t} all slots free → available`),"available"):(console.log(`[PublicBookingCalendar] ${t} has no data → available`),"available")},D=(t,l)=>new Date(r,g,t)<j||l==="full"||l==="past",i=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];return F?(console.log("[PublicBookingCalendar] Showing loading state"),e.jsx("div",{style:{background:"white",borderRadius:"16px",padding:"2rem",boxShadow:"0 4px 20px rgba(0, 0, 0, 0.08)"},children:e.jsx(U,{size:"md"})})):C?(console.error("[PublicBookingCalendar] Error state:",C),e.jsxs("div",{style:{background:"white",borderRadius:"16px",padding:"2rem",boxShadow:"0 4px 20px rgba(0, 0, 0, 0.08)",textAlign:"center"},children:[e.jsx(H,{size:48,style:{color:"#9ca3af",margin:"0 auto 16px"}}),e.jsx("p",{style:{color:"#ef4444",marginBottom:"16px"},children:"Error loading calendar"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#6b7280"},children:C.message})]})):(console.log("[PublicBookingCalendar] Rendering calendar grid"),e.jsxs("div",{style:{background:"white",borderRadius:"16px",padding:"1.5rem",boxShadow:"0 4px 20px rgba(0, 0, 0, 0.08)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"},children:[e.jsx(a.button,{onClick:y,whileHover:{scale:1.1},whileTap:{scale:.9},style:{width:"36px",height:"36px",borderRadius:"8px",border:"2px solid #E0E0E0",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s ease"},children:e.jsx(ne,{size:20})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:600,fontSize:"1.125rem"},children:[e.jsx(H,{size:20,style:{color:"#B6F500"}}),e.jsx("span",{children:u.toLocaleDateString("en-US",{month:"long",year:"numeric"})})]}),e.jsx(a.button,{onClick:c,whileHover:{scale:1.1},whileTap:{scale:.9},style:{width:"36px",height:"36px",borderRadius:"8px",border:"2px solid #E0E0E0",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s ease"},children:e.jsx(oe,{size:20})})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",gap:"0.5rem",marginBottom:"0.75rem"},children:i.map(t=>e.jsx("div",{style:{textAlign:"center",fontSize:"0.75rem",fontWeight:600,color:"#666",padding:"0.5rem 0"},children:t},t))}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",gap:"0.5rem"},children:[Array.from({length:v}).map((t,l)=>e.jsx("div",{},`empty-${l}`)),Array.from({length:o}).map((t,l)=>{const m=l+1,p=I(m),E=new Date(r,g,m),A=d===p,k=h(p,E),w=D(m,k);let z="white",B="#E0E0E0",n="#2D2D2D";return A?(z="#B6F500",B="#B6F500",n="white"):k==="full"?(z="#FFE5E5",B="#FF6B6B",n="#721c24"):k==="partial"?(z="#FFF8E1",B="#FFD97D",n="#856404"):k==="available"?(z="#E8F5E9",B="#B6F500",n="#2D5016"):k==="past"&&(z="#F5F5F5",B="#E0E0E0",n="#999"),e.jsx(a.button,{onClick:()=>{w||(console.log(`[PublicBookingCalendar] Date selected: ${p}`,{status:k,dayData:s[p]}),S(p))},whileHover:w?{}:{scale:1.1},whileTap:w?{}:{scale:.9},disabled:w,title:k==="full"?"Fully booked":k==="partial"?"Partially available":k==="available"?"Available":"",style:{padding:"0.75rem",borderRadius:"10px",border:`2px solid ${B}`,background:z,cursor:w?"not-allowed":"pointer",fontWeight:A?600:400,color:n,opacity:w?.5:1,transition:"all 0.2s ease",position:"relative"},children:m},m)})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",marginTop:"1.5rem",fontSize:"0.75rem",justifyContent:"center",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx("div",{style:{width:"12px",height:"12px",borderRadius:"4px",background:"#E8F5E9",border:"2px solid #B6F500"}}),e.jsx("span",{children:"Available"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx("div",{style:{width:"12px",height:"12px",borderRadius:"4px",background:"#FFF8E1",border:"2px solid #FFD97D"}}),e.jsx("span",{children:"Partial"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx("div",{style:{width:"12px",height:"12px",borderRadius:"4px",background:"#FFE5E5",border:"2px solid #FF6B6B"}}),e.jsx("span",{children:"Full"})]})]})]}))}const N=[{key:"full_day",label:"Full Day",time:"10 AM – 6 PM",discount:0,icon:q,color:"#B6F500",bgColor:"rgba(182, 245, 0, 0.1)"},{key:"half_day_morning",label:"Half Day (Morning)",time:"10 AM – 2 PM",discount:0,icon:Ce,color:"#FFD97D",bgColor:"rgba(255, 217, 125, 0.1)"},{key:"half_day_evening",label:"Half Day (Evening)",time:"2 PM – 6 PM",discount:0,icon:se,color:"#FFAB73",bgColor:"rgba(255, 171, 115, 0.1)"},{key:"night",label:"Night",time:"6 PM – 10 PM",discount:0,icon:je,color:"#D5C6FF",bgColor:"rgba(213, 198, 255, 0.1)"}],we={key:"short_duration",label:"Short Duration",time:"4-5 Hours (Flexible)",discount:0,icon:q,color:"#FF6B9D",bgColor:"rgba(255, 107, 157, 0.1)"},Fe=["birthday","meeting","get-together","awareness-class"];function Be({selectedSlot:d,onSlotChange:S,basePrice:j,eventType:u}){const x=u&&Fe.includes(u),b=x?[we,...N]:N;return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"1.5rem"},children:[e.jsx("h3",{style:{fontSize:"1.125rem",fontWeight:600,marginBottom:"0.5rem"},children:"Select Your Time Slot"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",margin:0},children:"Choose the time period that best fits your event schedule"}),x&&e.jsxs(a.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},style:{marginTop:"0.75rem",padding:"0.75rem 1rem",background:"linear-gradient(135deg, rgba(255, 107, 157, 0.15), rgba(255, 107, 157, 0.05))",borderRadius:"8px",borderLeft:"3px solid #FF6B9D",fontSize:"0.8125rem",color:"#343A40"},children:["✨ ",e.jsx("strong",{children:"Special Offer:"})," Short Duration slot available at ₹26,000 for your ",u.replace("-"," ")," event!"]})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))",gap:"1rem"},className:"slot-grid",children:b.map((r,g)=>{const o=d===r.key,v=r.icon;return e.jsxs(a.button,{onClick:()=>S(r.key),initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:g*.1},whileHover:{scale:1.02},whileTap:{scale:.98},style:{position:"relative",padding:"1.25rem",background:o?r.bgColor:"white",border:o?`3px solid ${r.color}`:"2px solid rgba(224, 224, 224, 0.5)",borderRadius:"16px",cursor:"pointer",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",boxShadow:o?`0 8px 24px ${r.color}40`:"0 2px 8px rgba(0, 0, 0, 0.05)",overflow:"hidden"},children:[o&&e.jsx(a.div,{initial:{opacity:0},animate:{opacity:[.3,.6,.3]},transition:{duration:2,repeat:1/0},style:{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%, ${r.color}30, transparent 70%)`,pointerEvents:"none"}}),o&&e.jsx(a.div,{initial:{scale:0},animate:{scale:1},transition:{type:"spring",duration:.5},style:{position:"absolute",top:"12px",right:"12px",width:"28px",height:"28px",borderRadius:"50%",background:r.color,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px ${r.color}60`,zIndex:2},children:e.jsx(_,{size:16,color:"white"})}),e.jsxs("div",{style:{position:"relative",zIndex:1},children:[e.jsx("div",{style:{width:"56px",height:"56px",borderRadius:"12px",background:o?`${r.color}30`:"rgba(240, 240, 240, 0.8)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem",border:`2px solid ${o?r.color:"transparent"}`,transition:"all 0.3s ease"},children:e.jsx(v,{size:28,style:{color:o?r.color:"#666"}})}),e.jsx("h4",{style:{fontSize:"1rem",fontWeight:600,marginBottom:"0.25rem",color:o?"#2D2D2D":"#4A4A4A",transition:"color 0.3s ease"},children:r.label}),e.jsx("p",{style:{fontSize:"0.8125rem",color:"#666",marginBottom:"0.75rem"},children:r.time}),e.jsx("div",{style:{padding:"0.5rem",background:o?"rgba(255, 255, 255, 0.8)":"rgba(250, 249, 246, 1)",borderRadius:"8px",marginTop:"0.75rem"},children:e.jsx("div",{style:{fontSize:"1.125rem",fontWeight:600,color:o?r.color:"#2D2D2D"},children:r.key==="short_duration"?"₹26,000":`₹${j.toLocaleString("en-IN")}`})})]})]},r.key)})})]})}function ze({selectedDate:d,selectedSlot:S,selectedPackageId:j,selectedPackageName:u,onContinue:x,isLoading:b=!1}){const[r,g]=f.useState({fullName:"",mobile:"",guestCount:"",message:"",packageId:null,eventType:""}),[o,v]=f.useState({}),[s,F]=f.useState({});f.useEffect(()=>{const i={};if(o.fullName){const t=r.fullName.trim();t?t.length<2?i.fullName={isValid:!1,message:"Name too short"}:/^[a-zA-Z\s]+$/.test(t)?i.fullName={isValid:!0,message:"Looks good!"}:i.fullName={isValid:!1,message:"Only letters allowed"}:i.fullName={isValid:!1,message:"Name is required"}}if(o.mobile){const t=r.mobile;t?t.length<10?i.mobile={isValid:!1,message:`${10-t.length} more digits needed`}:t.length===10?i.mobile={isValid:!0,message:"Valid mobile number"}:i.mobile={isValid:!1,message:"Max 10 digits"}:i.mobile={isValid:!1,message:"Mobile number is required"}}if(o.guestCount){const t=parseInt(r.guestCount);r.guestCount?isNaN(t)||t<1?i.guestCount={isValid:!1,message:"Must be at least 1"}:t>1e3?i.guestCount={isValid:!1,message:"Please contact us for large events"}:i.guestCount={isValid:!0,message:`${t} guest${t!==1?"s":""}`}:i.guestCount={isValid:!1,message:"Guest count required"}}F(i)},[r,o]);const C=i=>{const t=i.replace(/\D/g,"");let l=t.startsWith("91")?t.slice(2):t;l=l.slice(0,10),g(m=>({...m,mobile:l}))},y=i=>{const{name:t,value:l}=i.target;t==="mobile"?C(l):g(m=>({...m,[t]:l}))},c=i=>{v(t=>({...t,[i]:!0}))},I=i=>{i.preventDefault(),v({fullName:!0,mobile:!0,guestCount:!0});const t=[];if(j||t.push("Please select a package first"),(!r.fullName||r.fullName.trim().length<2)&&t.push("Valid name required"),(!r.mobile||r.mobile.length!==10)&&t.push("Valid 10-digit mobile number required"),(!r.guestCount||parseInt(r.guestCount)<1)&&t.push("Valid guest count required"),r.eventType||t.push("Event type is required"),t.length>0){T.error("Please complete all required fields",{description:t.join(" • "),duration:5e3});return}x({...r,packageId:j})},h=i=>{if(!o[i])return{};const t=s[i];return t?{borderColor:t.isValid?"#10b981":"#ef4444",borderWidth:"2px"}:{}},D=()=>r.mobile?`+91 ${r.mobile}`:"";return e.jsxs(a.form,{onSubmit:I,initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},style:{background:"rgba(255, 255, 255, 0.95)",backdropFilter:"blur(10px)",borderRadius:"24px",padding:"2.5rem",border:"1px solid rgba(224, 192, 151, 0.3)",boxShadow:"0 12px 48px rgba(0, 0, 0, 0.1)",maxWidth:"100%",boxSizing:"border-box",className:"enhanced-booking-form"},children:[e.jsxs("div",{style:{marginBottom:"2.5rem"},children:[e.jsxs(a.h3,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:.1},style:{fontSize:"1.875rem",fontWeight:700,color:"#343A40",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.75rem",letterSpacing:"-0.01em"},children:[e.jsx(R,{size:28,style:{color:"#C8D46B"}}),"Your Details"]}),e.jsx("p",{style:{color:"#6c757d",fontSize:"0.9375rem",lineHeight:"1.5"},children:"Fill in your information to continue with the booking"}),u&&e.jsxs(a.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},transition:{delay:.2},style:{marginTop:"1.25rem",padding:"1rem 1.25rem",background:"linear-gradient(135deg, rgba(200, 212, 107, 0.15), rgba(224, 192, 151, 0.15))",borderRadius:"12px",borderLeft:"4px solid #C8D46B",display:"flex",alignItems:"center",gap:"0.75rem"},children:[e.jsx(V,{size:20,style:{color:"#C8D46B",flexShrink:0}}),e.jsxs("span",{style:{fontSize:"0.9375rem",color:"#343A40"},children:["Selected Package: ",e.jsx("strong",{children:u})]})]})]}),e.jsxs("div",{style:{display:"grid",gap:"1.75rem"},children:[e.jsx($,{icon:e.jsx(le,{size:20}),label:"Full Name",required:!0,value:r.fullName,name:"fullName",placeholder:"Enter your full name",onChange:y,onBlur:()=>c("fullName"),style:h("fullName"),validation:s.fullName,touched:o.fullName}),e.jsx($,{icon:e.jsx(G,{size:20}),label:"Mobile Number",required:!0,value:r.mobile,name:"mobile",placeholder:"10-digit mobile number",type:"tel",onChange:y,onBlur:()=>c("mobile"),style:h("mobile"),validation:s.mobile,touched:o.mobile,helperText:r.mobile?D():"Will be formatted as +91 XXXXXXXXXX"}),e.jsx($,{icon:e.jsx(K,{size:20}),label:"Number of Guests",required:!0,value:r.guestCount,name:"guestCount",type:"number",placeholder:"Expected number of guests",onChange:y,onBlur:()=>c("guestCount"),style:h("guestCount"),validation:s.guestCount,touched:o.guestCount}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem",fontSize:"0.9375rem",fontWeight:600,color:"#343A40"},children:[e.jsx(be,{size:20,style:{color:"#E0C097"}}),"Event Type",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsxs("select",{name:"eventType",value:r.eventType,onChange:i=>g(t=>({...t,eventType:i.target.value})),required:!0,style:{width:"100%",padding:"0.875rem 1rem",border:"2px solid #E0E0E0",borderRadius:"12px",fontSize:"0.9375rem",fontFamily:"inherit",transition:"all 0.3s ease",background:"white",color:"#343A40",cursor:"pointer"},onFocus:i=>{i.target.style.borderColor="#C8D46B",i.target.style.boxShadow="0 0 0 4px rgba(200, 212, 107, 0.1)"},onBlur:i=>{i.target.style.borderColor="#E0E0E0",i.target.style.boxShadow="none"},children:[e.jsx("option",{value:"",children:"Select Event Type"}),e.jsx("option",{value:"birthday",children:"Birthday"}),e.jsx("option",{value:"get_together",children:"Get Together"}),e.jsx("option",{value:"meeting_conference",children:"Meeting / Conference"}),e.jsx("option",{value:"awareness_class",children:"Awareness Class"}),e.jsx("option",{value:"normal",children:"Wedding/Reception"})]})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem",fontSize:"0.9375rem",fontWeight:600,color:"#343A40"},children:[e.jsx(de,{size:20,style:{color:"#E0C097"}}),"Special Requests",e.jsx("span",{style:{color:"#6c757d",fontWeight:400},children:"(Optional)"})]}),e.jsx("textarea",{name:"message",value:r.message,onChange:y,placeholder:"Any special requirements or questions?",rows:4,style:{width:"100%",padding:"0.875rem 1rem",border:"2px solid #E0E0E0",borderRadius:"12px",fontSize:"0.9375rem",fontFamily:"inherit",resize:"vertical",transition:"all 0.3s ease"},onFocus:i=>{i.target.style.borderColor="#C8D46B",i.target.style.boxShadow="0 0 0 4px rgba(200, 212, 107, 0.1)"},onBlur:i=>{i.target.style.borderColor="#E0E0E0",i.target.style.boxShadow="none"}})]}),e.jsxs(a.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.3},style:{padding:"1.75rem",background:"linear-gradient(135deg, rgba(200, 212, 107, 0.08), rgba(224, 192, 151, 0.08))",borderRadius:"16px",border:"2px solid rgba(200, 212, 107, 0.2)",className:"services-section"},children:[e.jsxs("h4",{style:{fontSize:"1.125rem",fontWeight:700,color:"#343A40",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(R,{size:20,style:{color:"#C8D46B"}}),"Included Services & Policies"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"1rem 1.25rem",background:"linear-gradient(135deg, rgba(200, 212, 107, 0.15), rgba(224, 192, 151, 0.15))",borderRadius:"12px",border:"2px solid #C8D46B",marginBottom:"1rem"},children:[e.jsx("div",{style:{width:"40px",height:"40px",borderRadius:"10px",background:"linear-gradient(135deg, #C8D46B, #B6F500)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:e.jsx(fe,{size:22,style:{color:"#343A40"}})}),e.jsxs("div",{style:{flex:1},children:[e.jsx("span",{style:{fontSize:"1rem",color:"#343A40",fontWeight:700,display:"block"},children:"Floor Cleaning Service"}),e.jsx("div",{style:{fontSize:"0.8125rem",color:"#666",marginTop:"2px"},children:"Mandatory • Included in all bookings"})]}),e.jsx("span",{style:{fontSize:"1.125rem",fontWeight:700,color:"#343A40"},children:"₹3,000"})]}),e.jsxs("div",{style:{padding:"1rem 1.25rem",background:"rgba(255, 255, 255, 0.6)",borderRadius:"12px",border:"1px solid rgba(200, 212, 107, 0.2)"},children:[e.jsxs("h5",{style:{fontSize:"0.9375rem",fontWeight:700,color:"#343A40",marginBottom:"0.875rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(V,{size:18,style:{color:"#C8D46B"}}),"Additional Services & Policies"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:[e.jsxs("div",{style:{display:"flex",gap:"0.625rem",alignItems:"start"},children:[e.jsx("div",{style:{width:"6px",height:"6px",borderRadius:"50%",background:"linear-gradient(135deg, #C8D46B, #B6F500)",marginTop:"6px",flexShrink:0}}),e.jsxs("span",{style:{fontSize:"0.875rem",color:"#343A40",lineHeight:"1.6"},children:[e.jsx("strong",{style:{color:"#343A40"},children:"Post-Event Services:"})," Cooking gas and garbage disposal can be added after your event based on actual usage."]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.625rem",alignItems:"start"},children:[e.jsx("div",{style:{width:"6px",height:"6px",borderRadius:"50%",background:"linear-gradient(135deg, #C8D46B, #B6F500)",marginTop:"6px",flexShrink:0}}),e.jsxs("span",{style:{fontSize:"0.875rem",color:"#343A40",lineHeight:"1.6"},children:[e.jsx("strong",{style:{color:"#343A40"},children:"Eco-Friendly Policy:"})," We strictly prohibit the use of plastic products (glasses, plates, etc.) to maintain our green venue standards."]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.625rem",alignItems:"start"},children:[e.jsx("div",{style:{width:"6px",height:"6px",borderRadius:"50%",background:"linear-gradient(135deg, #C8D46B, #B6F500)",marginTop:"6px",flexShrink:0}}),e.jsxs("div",{style:{fontSize:"0.875rem",color:"#343A40",lineHeight:"1.6",flex:1},children:[e.jsx("strong",{style:{color:"#343A40"},children:"Eco-Friendly Plates Available:"})," We provide sustainable plates for rent:",e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",marginTop:"0.5rem",marginLeft:"1rem"},children:[e.jsx("span",{style:{padding:"0.375rem 0.75rem",background:"rgba(200, 212, 107, 0.15)",borderRadius:"6px",fontSize:"0.8125rem",fontWeight:600,border:"1px solid rgba(200, 212, 107, 0.3)",width:"fit-content"},children:"Large • ₹3.50/plate"}),e.jsx("span",{style:{padding:"0.375rem 0.75rem",background:"rgba(200, 212, 107, 0.15)",borderRadius:"6px",fontSize:"0.8125rem",fontWeight:600,border:"1px solid rgba(200, 212, 107, 0.3)",width:"fit-content"},children:"Small • ₹2.50/plate"})]})]})]})]})]})]}),e.jsx(a.button,{type:"submit",disabled:b,whileHover:b?{}:{scale:1.02,y:-2},whileTap:b?{}:{scale:.98},style:{width:"100%",padding:"1rem",background:b?"linear-gradient(135deg, #9CA3AF, #6B7280)":"linear-gradient(135deg, #B6F500, #C8D46B)",color:"#343A40",border:"none",borderRadius:"12px",fontSize:"1.0625rem",fontWeight:700,cursor:b?"not-allowed":"pointer",boxShadow:b?"none":"0 4px 16px rgba(182, 245, 0, 0.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",marginTop:"0.5rem",transition:"all 0.3s ease"},children:b?e.jsxs(e.Fragment,{children:[e.jsx(ce,{size:20,style:{animation:"spin 1s linear infinite"}}),e.jsx("span",{children:"Processing..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"Continue to Date & Slot Selection"}),e.jsx(_,{size:20})]})})]})]})}function $({icon:d,label:S,required:j,value:u,name:x,type:b="text",placeholder:r,onChange:g,onBlur:o,style:v={},validation:s,touched:F,helperText:C}){const y=F&&s;return e.jsxs(a.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.4},children:[e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem",fontSize:"0.9375rem",fontWeight:600,color:"#343A40"},children:[e.jsx("span",{style:{color:"#E0C097"},children:d}),S,j&&e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx("input",{type:b,name:x,value:u,onChange:g,onBlur:o,placeholder:r,style:{width:"100%",padding:"0.875rem 1rem",paddingRight:y?"3rem":"1rem",border:"2px solid #E0E0E0",borderRadius:"12px",fontSize:"0.9375rem",transition:"all 0.3s ease",...v},onFocus:c=>{v.borderColor||(c.target.style.borderColor="#C8D46B",c.target.style.boxShadow="0 0 0 4px rgba(200, 212, 107, 0.1)")},onBlur:c=>{o(),v.borderColor||(c.target.style.borderColor="#E0E0E0",c.target.style.boxShadow="none")}}),e.jsx(P,{children:y&&e.jsx(a.div,{initial:{scale:0,opacity:0},animate:{scale:1,opacity:1},exit:{scale:0,opacity:0},transition:{type:"spring",stiffness:500,damping:30},style:{position:"absolute",right:"1rem",top:"50%",transform:"translateY(-50%)"},children:s.isValid?e.jsx(_,{size:20,style:{color:"#10b981"}}):e.jsx(me,{size:20,style:{color:"#ef4444"}})})})]}),e.jsxs(P,{mode:"wait",children:[y&&s.message&&e.jsx(a.p,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.2},style:{marginTop:"0.5rem",fontSize:"0.8125rem",color:s.isValid?"#10b981":"#ef4444",fontWeight:500},children:s.message},s.message),!y&&C&&e.jsx(a.p,{initial:{opacity:0},animate:{opacity:1},style:{marginTop:"0.5rem",fontSize:"0.8125rem",color:"#6c757d"},children:C})]})]})}const O=document.createElement("style");O.textContent=`
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 410px) {
    .enhanced-booking-form {
      padding: 1rem !important;
    }
    .enhanced-booking-form h3 {
      font-size: 1.5rem !important;
    }
    .enhanced-booking-form .services-section {
      padding: 1rem !important;
    }
  }

  @media (max-width: 375px) {
    .enhanced-booking-form {
      padding: 0.875rem !important;
    }
    .enhanced-booking-form input,
    .enhanced-booking-form select,
    .enhanced-booking-form textarea {
      padding: 0.75rem !important;
      font-size: 0.875rem !important;
    }
  }
`;document.head.appendChild(O);function De(d){switch(d){case"morning":return{start:"10:00",end:"14:00"};case"evening":return{start:"14:00",end:"18:00"};case"night":return{start:"18:00",end:"22:00"};case"full_day":return{start:"10:00",end:"18:00"};case"short_duration":return{start:"10:00",end:"18:00"};default:return{start:null,end:null}}}async function Ee(d){const S={full_name:d.full_name,mobile:d.mobile,booking_date:d.booking_date,start_time:d.start_time,end_time:d.end_time,guest_count:d.guest_count??0,package_id:d.package_id??null,special_requests:d.special_requests??null,email:null,additional_notes:d.additional_notes??null,user_id:null,status:"pending"};console.log("[CREATE BOOKING] final payload:",S);const{data:j,error:u}=await Z.from("bookings").insert([S]).select().single();if(u)throw console.error("[createBooking] ERROR:",u),u;return j}const Ae=`
  @media (min-width: 1024px) {
    .booking-split-container {
      grid-template-columns: 1fr 1fr !important;
    }
  }
  
  @media (max-width: 1023px) {
    .booking-split-container {
      grid-template-columns: 1fr !important;
    }
    
    .packages-panel {
      border-right: none !important;
      border-bottom: 2px solid rgba(224, 192, 151, 0.2) !important;
      padding: 2rem 1.5rem !important;
      min-height: auto !important;
    }
    
    .form-panel {
      padding: 2rem 1.5rem !important;
    }
  }
  
  @media (max-width: 768px) {
    .nav-buttons {
      top: 80px !important;
      left: 10px !important;
      gap: 0.5rem !important;
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    
    .nav-buttons button {
      padding: 0.5rem 1rem !important;
      font-size: 0.875rem !important;
    }
    
    .packages-panel {
      padding: 1.5rem 1rem !important;
    }
    
    .form-panel {
      padding: 1.5rem 1rem !important;
    }
    
    .package-carousel {
      gap: 1rem !important;
    }
    
    .calendar-section {
      padding: 2rem 1rem !important;
    }
    
    .package-card {
      min-height: auto !important;
    }
  }
  
  @media (max-width: 480px) {
    .nav-buttons {
      position: static !important;
      margin: 0 1rem 1rem !important;
      padding: 0 !important;
    }
    
    .booking-page-container {
      padding-top: 70px !important;
    }
    
    .package-carousel {
      gap: 0.75rem !important;
    }
    
    .package-card-image {
      height: 140px !important;
    }
    
    .package-card-content {
      padding: 1.25rem !important;
    }
    
    .calendar-section {
      padding: 1.5rem 0.75rem !important;
    }
    
    .calendar-container {
      padding: 1.25rem !important;
    }
    
    .slot-grid {
      gap: 0.75rem !important;
    }
    
    .price-summary {
      padding: 1.25rem !important;
    }
  }

  @media (max-width: 410px) {
    .packages-panel {
      padding: 1rem 0.75rem !important;
    }
    
    .form-panel {
      padding: 1rem 0.75rem !important;
    }
    
    .package-carousel {
      gap: 0.625rem !important;
    }
    
    .package-card-image {
      height: 120px !important;
    }
    
    .package-card-content {
      padding: 1rem !important;
    }
    
    .package-card-title {
      font-size: 1.125rem !important;
    }
    
    .package-card-description {
      font-size: 0.8125rem !important;
    }
    
    .package-card-price {
      font-size: 1.25rem !important;
    }
    
    .calendar-section {
      padding: 1.25rem 0.5rem !important;
    }
    
    .calendar-container {
      padding: 1rem !important;
      border-radius: 16px !important;
    }
    
    .slot-grid {
      gap: 0.625rem !important;
      grid-template-columns: 1fr !important;
    }
    
    .price-summary {
      padding: 1rem !important;
    }
    
    .form-wrapper {
      padding: 1rem !important;
    }
  }

  @media (max-width: 375px) {
    .packages-panel {
      padding: 0.75rem 0.5rem !important;
    }
    
    .form-panel {
      padding: 0.75rem 0.5rem !important;
    }
    
    .package-card-content {
      padding: 0.875rem !important;
    }
    
    .package-card-title {
      font-size: 1rem !important;
    }
    
    .section-title {
      font-size: 1.5rem !important;
    }
    
    .calendar-container {
      padding: 0.875rem !important;
    }
    
    .price-summary {
      padding: 0.875rem !important;
    }
  }
`;function Ke(){const d=J(),[S]=Q(),j=S.get("package"),u=f.useRef(null),[x,b]=f.useState(j),[r,g]=f.useState(!1),[o,v]=f.useState(""),[s,F]=f.useState("full_day"),[C,y]=f.useState(!1),[c,I]=f.useState(null),[h,D]=f.useState(!1),[i,t]=f.useState(!1),{data:l=[]}=pe(),m=l.find(n=>n.id===x),{data:p}=ae(o,!!o),E=n=>{I(n),g(!0),setTimeout(()=>{u.current?.scrollIntoView({behavior:"smooth",block:"start"})},100)},A=n=>{v(n),F("full_day")},k=async()=>{if(!o){T.error("Please select a date");return}if(!c){T.error("Form data missing. Please go back and fill the form.");return}if(!i){T.error("Please accept the Terms and Conditions to continue");return}D(!0);try{const n=c.eventType?`Event Type: ${c.eventType}`:"";let W=n;c.message&&(W=n?`${n}
${c.message}`:c.message);const{start:L,end:X}=De(s);await Ee({full_name:c.fullName.trim(),mobile:c.mobile,booking_date:o,start_time:L,end_time:X,guest_count:parseInt(c.guestCount),package_id:c.packageId,special_requests:W||null,email:null,additional_notes:`Smart Slot Booking - ${N.find(Y=>Y.key===s)?.label||s}`,user_id:null}),T.success("Booking created successfully"),y(!0)}catch(n){T.error("Booking Failed",{description:n.message||"Failed to create booking",duration:5e3})}finally{D(!1)}};N.find(n=>n.key===s);let w;s==="short_duration"?w=26e3:w=m?m.price:0;const B=w+3e3;return e.jsxs("div",{style:{minHeight:"100vh",background:"#FAF9F6",paddingTop:"80px",overflowX:"hidden",maxWidth:"100vw"},className:"booking-page-container",children:[e.jsx(ee,{}),e.jsxs(a.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.6},style:{position:"fixed",top:"100px",left:"20px",zIndex:50,display:"flex",gap:"1rem"},className:"nav-buttons",children:[e.jsxs(a.button,{onClick:()=>d(-1),whileHover:{scale:1.05,x:-5},whileTap:{scale:.95},style:{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.75rem 1.25rem",background:"rgba(255, 255, 255, 0.95)",backdropFilter:"blur(10px)",color:"#343A40",border:"2px solid rgba(224, 192, 151, 0.5)",borderRadius:"50px",fontWeight:600,fontSize:"0.9375rem",cursor:"pointer",boxShadow:"0 4px 12px rgba(0, 0, 0, 0.1)"},children:[e.jsx(ge,{size:18}),e.jsx("span",{children:"Back"})]}),e.jsxs(a.button,{onClick:()=>d("/"),whileHover:{scale:1.05},whileTap:{scale:.95},style:{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.75rem 1.25rem",background:"linear-gradient(135deg, #B6F500, #E0C097)",color:"#343A40",border:"none",borderRadius:"50px",fontWeight:600,fontSize:"0.9375rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(182, 245, 0, 0.3)"},children:[e.jsx(ue,{size:18}),e.jsx("span",{children:"Home"})]})]}),e.jsxs("div",{style:{minHeight:"90vh",display:"grid",gridTemplateColumns:"1fr",gap:0,maxWidth:"100%",width:"100%",boxSizing:"border-box"},className:"booking-split-container",children:[e.jsx(a.div,{initial:{opacity:0,x:-50},animate:{opacity:1,x:0},transition:{duration:.8},style:{position:"relative",padding:"4rem 2.5rem",background:"linear-gradient(135deg, #FAF9F6 0%, #FFFFFF 100%)",borderRight:"1px solid rgba(224, 192, 151, 0.2)",display:"flex",flexDirection:"column",justifyContent:"center"},className:"packages-panel",children:e.jsxs("div",{style:{maxWidth:"720px",margin:"0 auto",width:"100%"},children:[e.jsxs(a.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{delay:.3},style:{textAlign:"center",marginBottom:"3rem"},children:[e.jsx(R,{size:40,style:{color:"#B6F500",display:"inline-block",marginBottom:"1rem"}}),e.jsx("h2",{style:{fontSize:"2.25rem",marginBottom:"0.75rem",background:"linear-gradient(135deg, #B6F500, #E0C097)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:"-0.02em"},children:"Select Your Package"}),e.jsx("div",{style:{width:"80px",height:"4px",background:"linear-gradient(90deg, #B6F500, #E0C097)",margin:"0 auto",borderRadius:"2px"}})]}),e.jsx("div",{style:{position:"relative"},children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem",maxWidth:"800px",margin:"0 auto"},className:"package-carousel",children:l.map((n,W)=>e.jsxs(a.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{duration:.4,delay:W*.1},onClick:()=>b(n.id),whileHover:{scale:1.02,y:-4},whileTap:{scale:.98},style:{width:"100%",cursor:"pointer",border:x===n.id?"3px solid #B6F500":"2px solid rgba(224, 192, 151, 0.3)",borderRadius:"24px",background:x===n.id?"linear-gradient(135deg, rgba(182, 245, 0, 0.08), rgba(224, 192, 151, 0.08))":"white",overflow:"hidden",transition:"all 0.3s ease",boxShadow:x===n.id?"0 16px 40px rgba(182, 245, 0, 0.25), 0 0 0 4px rgba(182, 245, 0, 0.1)":"0 4px 16px rgba(0, 0, 0, 0.08)"},children:[e.jsx("div",{style:{height:"180px",backgroundImage:`url(${n.image_url})`,backgroundSize:"cover",backgroundPosition:"center",position:"relative"},children:x===n.id&&e.jsxs(a.div,{initial:{scale:0},animate:{scale:1},style:{position:"absolute",top:"16px",right:"16px",background:"#B6F500",color:"#343A40",padding:"0.625rem 1.25rem",borderRadius:"50px",fontSize:"0.875rem",fontWeight:600,display:"flex",alignItems:"center",gap:"0.375rem",boxShadow:"0 4px 16px rgba(182, 245, 0, 0.4)"},children:[e.jsx(_,{size:16}),"Selected"]})}),e.jsxs("div",{style:{padding:"1.75rem"},children:[e.jsx("h3",{style:{fontSize:"1.375rem",marginBottom:"0.75rem",color:"#343A40",letterSpacing:"-0.01em"},children:n.name}),e.jsx("p",{style:{fontSize:"0.9375rem",color:"#666",marginBottom:"1.25rem",lineHeight:"1.6",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"},children:n.description}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"1rem",borderTop:"1px solid rgba(224, 192, 151, 0.2)"},children:[e.jsx("span",{style:{fontSize:"0.875rem",color:"#999"},children:"Base Price"}),e.jsxs("span",{style:{fontSize:"1.5rem",fontWeight:700,background:"linear-gradient(135deg, #B6F500, #E0C097)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},children:["₹",n.price.toLocaleString("en-IN")]})]})]})]},n.id))})}),l.length===0&&e.jsxs("div",{style:{textAlign:"center",padding:"3rem 1rem",color:"#999"},children:[e.jsx(R,{size:48,style:{color:"#E0C097",marginBottom:"1rem"}}),e.jsx("p",{children:"No packages available at the moment."})]})]})}),e.jsx(a.div,{initial:{opacity:0,x:50},animate:{opacity:1,x:0},transition:{duration:.8,delay:.2},style:{position:"relative",padding:"3rem 2rem",background:"linear-gradient(135deg, rgba(250, 249, 246, 0.8), rgba(255, 255, 255, 0.9))",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",justifyContent:"center"},className:"form-panel",children:e.jsx("div",{style:{maxWidth:"540px",margin:"0 auto",width:"100%"},children:e.jsx(ze,{selectedPackageId:x,selectedPackageName:m?.name,onContinue:E,isLoading:h})})})]}),e.jsx(P,{children:r&&e.jsx(a.div,{ref:u,initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},transition:{duration:.6},style:{padding:"4rem 2rem",background:"linear-gradient(180deg, #FFFFFF, #FAF9F6)",borderTop:"2px solid rgba(224, 192, 151, 0.2)"},className:"calendar-section",children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto"},children:[e.jsxs(a.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{delay:.2},style:{marginBottom:"3rem",textAlign:"center"},children:[e.jsx("h2",{style:{fontSize:"2rem",marginBottom:"1rem",background:"linear-gradient(135deg, #B6F500, #E0C097)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},children:"Select Your Date"}),e.jsx("div",{style:{width:"60px",height:"3px",background:"linear-gradient(90deg, #B6F500, #E0C097)",margin:"0 auto 2rem",borderRadius:"2px"}}),e.jsx("div",{style:{maxWidth:"600px",margin:"0 auto",background:"white",borderRadius:"20px",padding:"2rem",boxShadow:"0 8px 24px rgba(0, 0, 0, 0.08)",border:"2px solid rgba(224, 192, 151, 0.2)"},children:e.jsx(Se,{selectedDate:o,onDateSelect:A})})]}),e.jsxs(a.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.4},style:{marginBottom:"3rem"},children:[e.jsx("h2",{style:{fontSize:"2rem",marginBottom:"1rem",textAlign:"center",background:"linear-gradient(135deg, #E0C097, #B6F500)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},children:"Choose Time Slot"}),e.jsx("div",{style:{width:"60px",height:"3px",background:"linear-gradient(90deg, #E0C097, #B6F500)",margin:"0 auto 2rem",borderRadius:"2px"}}),e.jsx(Be,{selectedSlot:s,onSlotChange:F,basePrice:m?.price||0})]}),e.jsxs(a.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.8},style:{maxWidth:"500px",margin:"0 auto",textAlign:"center"},children:[e.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(182, 245, 0, 0.1), rgba(224, 192, 151, 0.1))",borderRadius:"16px",padding:"1.5rem",marginBottom:"2rem",border:"2px solid rgba(182, 245, 0, 0.3)"},children:[e.jsxs("div",{style:{marginBottom:"1rem",paddingBottom:"1rem",borderBottom:"1px solid rgba(200, 212, 107, 0.3)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"0.5rem",fontSize:"0.875rem",color:"#666"},children:[e.jsx("span",{children:"Base Price:"}),e.jsxs("span",{children:["₹",w.toLocaleString("en-IN")]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"0.5rem",fontSize:"0.875rem",color:"#666"},children:[e.jsx("span",{children:"Floor Cleaning (Included):"}),e.jsx("span",{children:"₹3,000"})]})]}),e.jsx("div",{style:{marginBottom:"0.5rem",color:"#666",fontSize:"0.9375rem"},children:"Total Amount"}),e.jsxs("div",{style:{fontSize:"2.5rem",fontWeight:700,background:"linear-gradient(135deg, #B6F500, #E0C097)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},children:["₹",B.toLocaleString("en-IN")]}),s==="short_duration"&&e.jsx(a.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},style:{marginTop:"0.75rem",padding:"0.5rem 1rem",background:"rgba(255, 107, 157, 0.1)",borderRadius:"8px",fontSize:"0.8125rem",color:"#343A40"},children:"🎉 Special rate for 4-5 hour event"})]}),e.jsx(a.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{delay:.9},style:{marginBottom:"1.5rem",padding:"1rem",background:i?"linear-gradient(135deg, rgba(182, 245, 0, 0.05), rgba(224, 192, 151, 0.05))":"rgba(255, 107, 157, 0.05)",borderRadius:"12px",border:i?"2px solid rgba(182, 245, 0, 0.3)":"2px solid rgba(255, 107, 157, 0.3)"},children:e.jsxs("label",{style:{display:"flex",alignItems:"flex-start",gap:"0.75rem",cursor:"pointer",userSelect:"none"},children:[e.jsx("input",{type:"checkbox",checked:i,onChange:n=>t(n.target.checked),style:{width:"20px",height:"20px",marginTop:"2px",cursor:"pointer",accentColor:"#B6F500",flexShrink:0}}),e.jsxs("span",{style:{fontSize:"0.9375rem",lineHeight:"1.5",color:"#343A40",textAlign:"left"},children:["I have read and agree to the"," ",e.jsx(te,{to:"/terms-and-conditions",target:"_blank",rel:"noopener noreferrer",style:{color:"#B6F500",textDecoration:"underline",fontWeight:600},children:"Hall Rules and Guidelines"})," ","of Dream Avenue Convention Center"]})]})}),e.jsx(a.button,{onClick:k,whileHover:i&&!h?{scale:1.03,boxShadow:"0 16px 40px rgba(182, 245, 0, 0.4)"}:{},whileTap:i&&!h?{scale:.98}:{},disabled:h||!i,style:{width:"100%",padding:"1.5rem 3rem",background:i&&!h?"linear-gradient(135deg, #B6F500, #E0C097)":"#E0E0E0",color:i&&!h?"#343A40":"#999",border:"none",borderRadius:"50px",fontSize:"1.25rem",fontWeight:700,cursor:h||!i?"not-allowed":"pointer",boxShadow:i&&!h?"0 12px 32px rgba(182, 245, 0, 0.35)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.75rem",transition:"all 0.3s ease",opacity:h||!i?.6:1},children:h?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{width:"20px",height:"20px",border:"3px solid #343A40",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}),"Processing..."]}):e.jsxs(e.Fragment,{children:[e.jsx(R,{size:24}),"Confirm Booking"]})}),!i&&e.jsxs(a.p,{initial:{opacity:0},animate:{opacity:1},style:{marginTop:"0.75rem",fontSize:"0.8125rem",color:"#FF6B9D",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"},children:[e.jsx(xe,{size:14}),"Please accept the terms and conditions to proceed"]})]})]})})}),e.jsx(P,{children:C&&e.jsx(a.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{position:"fixed",inset:0,background:"rgba(0, 0, 0, 0.6)",backdropFilter:"blur(8px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"},onClick:()=>y(!1),children:e.jsxs(a.div,{initial:{scale:.8,y:50},animate:{scale:1,y:0},exit:{scale:.8,y:50},onClick:n=>n.stopPropagation(),style:{background:"linear-gradient(135deg, rgba(182, 245, 0, 0.95), rgba(224, 192, 151, 0.95))",borderRadius:"24px",padding:"3rem",maxWidth:"500px",textAlign:"center",boxShadow:"0 20px 60px rgba(0, 0, 0, 0.3)"},children:[e.jsx(a.div,{initial:{scale:0},animate:{scale:1},transition:{delay:.2,type:"spring",stiffness:200},style:{width:"80px",height:"80px",background:"#343A40",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 2rem"},children:e.jsx(_,{size:48,style:{color:"#B6F500"}})}),e.jsx("h2",{style:{fontSize:"2rem",marginBottom:"1rem",color:"#343A40"},children:"Booking Confirmed! 🎉"}),e.jsx("p",{style:{fontSize:"1.125rem",marginBottom:"2rem",color:"#343A40",opacity:.9},children:"Your booking has been successfully submitted. We'll contact you shortly via WhatsApp!"}),e.jsx(a.button,{onClick:()=>{y(!1),d("/")},whileHover:{scale:1.05},whileTap:{scale:.95},style:{padding:"1rem 2.5rem",background:"#343A40",color:"#B6F500",border:"none",borderRadius:"50px",fontSize:"1.125rem",fontWeight:600,cursor:"pointer"},children:"Back to Home"})]})})}),e.jsx(ie,{}),e.jsx("style",{children:`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .package-carousel::-webkit-scrollbar {
          height: 8px;
        }

        .package-carousel::-webkit-scrollbar-track {
          background: rgba(224, 192, 151, 0.1);
          border-radius: 10px;
        }

        .package-carousel::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #B6F500, #E0C097);
          border-radius: 10px;
        }

        .package-carousel::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #E0C097, #B6F500);
        }

        ${Ae}
      `})]})}export{Ke as default};
