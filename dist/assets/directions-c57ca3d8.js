import{t as S,r as e}from"./index-47b4a022.js";import{a as A,d}from"./order-65aed67f.js";import{U as B}from"./user-7a776cf7.js";const C=S("directions",()=>{const r=A(),t=e({}),n=e({}),i=e(!1),a=e(!1),v=e(1),g=e(1),c=e(null),f=e(!1),s=e(!1);async function p(){try{const o=await B.getBookingDetails(r.bookingId);t.value.coordinates=[Number(o.data.data.driver.current_longitude),Number(o.data.data.driver.current_latitude)]}catch(o){console.log(o)}}function D(o){t.value.coordinates[0]=o.coords.longitude,t.value.coordinates[1]=o.coords.latitude,console.log("GEO",o),console.log("pointA",t)}function m(){console.log("errorGeo")}function l(o){o==="driver-position"?(p(),n.value.coordinates=r.pointA.coordinates):o==="my-position"?(navigator.geolocation.getCurrentPosition(D,m),n.value.coordinates=r.pointB.coordinates):(t.value.coordinates=r.pointA.coordinates,n.value.coordinates=r.pointB.coordinates)}function I(o){c.value=setInterval(()=>{l(o),u()},5e3)}function w(){clearInterval(c.value)}function b(){i.value=!i.value}function E(){a.value=!a.value}function G(){console.log("triggerPositionMap"),s.value=!s.value}const u=d(b,200),P=d(E,200);return{pointA:t,pointB:n,drawDirection:i,clearDirection:a,timeEstimate:v,distanceEstimate:g,debouncedDrawDirection:u,debouncedClearDirection:P,startDrawInterval:I,stopDrawInterval:w,zoom:f,updatePoints:l,triggerPositionMap:G,positionMap:s}},{persist:!0});export{C as u};
