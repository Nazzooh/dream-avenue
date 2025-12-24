import{c as r,o as y,e as s,D as p,s as o,g as f,f as u,q as d,t as c}from"./index-BgtLIF6L.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],S=r("car",h);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],C=r("music",g);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z",key:"1l6gj6"}],["path",{d:"M7 16v6",key:"1a82de"}],["path",{d:"M13 19v3",key:"13sx9i"}],["path",{d:"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",key:"1sj9kv"}]],x=r("trees",m);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]],E=r("utensils",F);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M12.8 19.6A2 2 0 1 0 14 16H2",key:"148xed"}],["path",{d:"M17.5 8a2.5 2.5 0 1 1 2 4H2",key:"1u4tom"}],["path",{d:"M9.8 4.4A2 2 0 1 1 11 8H2",key:"75valh"}]],j=r("wind",v),l=y({id:s().uuid().optional(),title:s().min(1,"Facility title is required"),description:s().optional().nullable(),icon:s().optional().nullable(),image_url:s().optional().nullable(),image:s().optional().nullable(),is_active:p().optional().default(!0),created_at:s().optional()}),k=l.omit({id:!0,created_at:!0});k.partial();const q=async()=>{console.log("🏢 Fetching facilities via direct Supabase...");const{data:a,error:e}=await o.from("facilities").select("*").eq("is_active",!0).order("created_at",{ascending:!1});if(e)throw console.error("❌ Supabase error:",e),new Error(e.message);return console.log("✅ Facilities loaded:",a?.length||0),l.array().parse(a||[])},_=async a=>{console.log("➕ Creating facility via direct Supabase...");const{data:e,error:t}=await o.from("facilities").insert([a]).select().single();if(t)throw console.error("❌ Supabase error:",t),new Error(t.message);return console.log("✅ Facility created:",e?.id),l.parse(e)},b=async(a,e)=>{console.log("✏️ Updating facility via direct Supabase:",a);const{data:t,error:n}=await o.from("facilities").update(e).eq("id",a).select().single();if(n)throw console.error("❌ Supabase error:",n),new Error(n.message);return console.log("✅ Facility updated:",t?.id),l.parse(t)},M=async a=>{console.log("🗑️ Deleting facility via direct Supabase:",a);const{error:e}=await o.from("facilities").delete().eq("id",a);if(e)throw console.error("❌ Supabase error:",e),new Error(e.message);console.log("✅ Facility deleted:",a)},i={all:["facilities"],lists:()=>[...i.all,"list"],list:a=>[...i.lists(),a],details:()=>[...i.all,"detail"],detail:a=>[...i.details(),a]},K=()=>f({queryKey:i.lists(),queryFn:q}),Q=()=>{const a=u();return d({mutationFn:e=>_(e),onSuccess:()=>{a.invalidateQueries({queryKey:i.all}),c.success("Facility created successfully")},onError:e=>{c.error(e.message||"Failed to create facility")}})},H=()=>{const a=u();return d({mutationFn:({id:e,data:t})=>b(e,t),onSuccess:(e,t)=>{a.invalidateQueries({queryKey:i.all}),a.invalidateQueries({queryKey:i.detail(t.id)}),c.success("Facility updated successfully")},onError:e=>{c.error(e.message||"Failed to update facility")}})},N=()=>{const a=u();return d({mutationFn:e=>M(e),onSuccess:()=>{a.invalidateQueries({queryKey:i.all}),c.success("Facility deleted successfully")},onError:e=>{c.error(e.message||"Failed to delete facility")}})};export{S as C,C as M,x as T,E as U,j as W,Q as a,H as b,N as c,K as u};
