import{p as C,h as F,j as a,c as y,s as d,r as W,Y as z,ad as $,ae as q,H as L,D as N,E as K,K as Q,F as U,Q as Y,t as G}from"./index-47b4a022.js";import{m as D,u as E}from"./useRender-5142e326.js";import{m as J,u as X,b as Z,I as p,M as _}from"./user-7a776cf7.js";function ee(e){return{aspectStyles:y(()=>{const o=Number(e.aspectRatio);return o?{paddingBottom:String(1/o*100)+"%"}:void 0})}}const j=C({aspectRatio:[String,Number],contentClass:String,inline:Boolean,...D(),...J()},"VResponsive"),B=F()({name:"VResponsive",props:j(),setup(e,o){let{slots:u}=o;const{aspectStyles:i}=ee(e),{dimensionStyles:m}=X(e);return E(()=>{var r;return a("div",{class:["v-responsive",{"v-responsive--inline":e.inline},e.class],style:[m.value,e.style]},[a("div",{class:"v-responsive__sizer",style:i.value},null),(r=u.additional)==null?void 0:r.call(u),u.default&&a("div",{class:["v-responsive__content",e.contentClass]},[u.default()])])}),{}}}),te=C({alt:String,cover:Boolean,eager:Boolean,gradient:String,lazySrc:String,options:{type:Object,default:()=>({root:void 0,rootMargin:void 0,threshold:void 0})},sizes:String,src:{type:[String,Object],default:""},srcset:String,...j(),...D(),...Z()},"VImg"),le=F()({name:"VImg",directives:{intersect:p},props:te(),emits:{loadstart:e=>!0,load:e=>!0,error:e=>!0},setup(e,o){let{emit:u,slots:i}=o;const m=d(""),r=W(),l=d(e.eager?"loading":"idle"),g=d(),f=d(),s=y(()=>e.src&&typeof e.src=="object"?{src:e.src.src,srcset:e.srcset||e.src.srcset,lazySrc:e.lazySrc||e.src.lazySrc,aspect:Number(e.aspectRatio||e.src.aspect||0)}:{src:e.src,srcset:e.srcset,lazySrc:e.lazySrc,aspect:Number(e.aspectRatio||0)}),v=y(()=>s.value.aspect||g.value/f.value||0);z(()=>e.src,()=>{h(l.value!=="idle")}),z(v,(t,n)=>{!t&&n&&r.value&&S(r.value)}),$(()=>h());function h(t){if(!(e.eager&&t)&&!(q&&!t&&!e.eager)){if(l.value="loading",s.value.lazySrc){const n=new Image;n.src=s.value.lazySrc,S(n,null)}s.value.src&&L(()=>{var n,c;if(u("loadstart",((n=r.value)==null?void 0:n.currentSrc)||s.value.src),(c=r.value)!=null&&c.complete){if(r.value.naturalWidth||b(),l.value==="error")return;v.value||S(r.value,null),R()}else v.value||S(r.value),I()})}}function R(){var t;I(),l.value="loaded",u("load",((t=r.value)==null?void 0:t.currentSrc)||s.value.src)}function b(){var t;l.value="error",u("error",((t=r.value)==null?void 0:t.currentSrc)||s.value.src)}function I(){const t=r.value;t&&(m.value=t.currentSrc||t.src)}let P=-1;function S(t){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:100;const c=()=>{clearTimeout(P);const{naturalHeight:k,naturalWidth:w}=t;k||w?(g.value=w,f.value=k):!t.complete&&l.value==="loading"&&n!=null?P=window.setTimeout(c,n):(t.currentSrc.endsWith(".svg")||t.currentSrc.startsWith("data:image/svg+xml"))&&(g.value=1,f.value=1)};c()}const V=y(()=>({"v-img__img--cover":e.cover,"v-img__img--contain":!e.cover})),H=()=>{var c;if(!s.value.src||l.value==="idle")return null;const t=a("img",{class:["v-img__img",V.value],src:s.value.src,srcset:s.value.srcset,alt:e.alt,sizes:e.sizes,ref:r,onLoad:R,onError:b},null),n=(c=i.sources)==null?void 0:c.call(i);return a(_,{transition:e.transition,appear:!0},{default:()=>[N(n?a("picture",{class:"v-img__picture"},[n,t]):t,[[Y,l.value==="loaded"]])]})},M=()=>a(_,{transition:e.transition},{default:()=>[s.value.lazySrc&&l.value!=="loaded"&&a("img",{class:["v-img__img","v-img__img--preload",V.value],src:s.value.lazySrc,alt:e.alt},null)]}),O=()=>i.placeholder?a(_,{transition:e.transition,appear:!0},{default:()=>[(l.value==="loading"||l.value==="error"&&!i.error)&&a("div",{class:"v-img__placeholder"},[i.placeholder()])]}):null,x=()=>i.error?a(_,{transition:e.transition,appear:!0},{default:()=>[l.value==="error"&&a("div",{class:"v-img__error"},[i.error()])]}):null,A=()=>e.gradient?a("div",{class:"v-img__gradient",style:{backgroundImage:`linear-gradient(${e.gradient})`}},null):null,T=d(!1);{const t=z(v,n=>{n&&(requestAnimationFrame(()=>{requestAnimationFrame(()=>{T.value=!0})}),t())})}return E(()=>{const[t]=B.filterProps(e);return N(a(B,U({class:["v-img",{"v-img--booting":!T.value},e.class],style:e.style},t,{aspectRatio:v.value,"aria-label":e.alt,role:e.alt?"img":void 0}),{additional:()=>a(Q,null,[a(H,null,null),a(M,null,null),a(A,null,null),a(O,null,null),a(x,null,null)]),default:i.default}),[[K("intersect"),{handler:h,options:e.options},null,{once:!0}]])}),{currentSrc:m,image:r,state:l,naturalWidth:g,naturalHeight:f}}}),se=G("userPanel",()=>({mode:W("")}),{persist:!0});export{le as V,se as u};