import{t as g,r as e,Y as m}from"./index-47b4a022.js";function f(a,t){let n;return function(...o){clearTimeout(n),n=window.setTimeout(()=>a.apply(o),t)}}const w=g("map",()=>{const a=e({}),t=e({}),n=e({}),o=e(""),s=e(""),l=e(!1),d=e(!1),u=e(!1),r=e(null);function c(M){r.value=M,console.log(r.value),u.value=!u.value}function i(){l.value=!l.value}const v=f(c,200),p=f(i,200);return m(t,()=>{o.value=t.value.name},{immediate:!0}),m(n,()=>{s.value=n.value.name},{immediate:!0}),{point:a,pointA:t,pointB:n,pointAName:o,pointBName:s,rerenderMap:l,triggerRerender:i,showLoader:d,triggerCenterMap:c,centerMapPoint:r,centerMap:u,debouncedCenterMap:v,debouncedRerender:p}}),A=g("order",()=>{const a=e(null),t=e(null),n=e({}),o=e({}),s=e(""),l=e(""),d=e({}),u=e({}),r=e(!1),c=e(null),i=e(null),v=e(null);function p(){a.value=null,t.value=null,n.value={},o.value={},s.value="",l.value="",d.value={},u.value={},r.value=!1,c.value=null,i.value=null,v.value=null}return{timeEstimate:s,distanceEstimate:l,bookingId:a,price:t,driver:n,order:o,pointA:d,pointB:u,isRated:r,rating:c,areaId:i,$reset:p,carId:v}},{persist:!0});export{A as a,f as d,w as u};