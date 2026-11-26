const AMEN=["Parking","Gym","Swimming Pool","Garden","Lift","24x7 Security","Clubhouse","Power Backup"];
// [title, city, area, type, price(lakh), beds, baths, sqft, year, amenity indices, hue]
const P=[
["Skyline Heights 3BHK","Pune","Baner","Apartment",135,3,3,1450,2022,[0,1,2,4,5,6],200],
["Green Valley Villa","Pune","Hinjewadi","Villa",320,4,4,3200,2021,[0,2,3,5,7],140],
["Compact Studio Flat","Mumbai","Andheri East","Apartment",85,1,1,520,2019,[4,5,7],30],
["Sea Breeze 2BHK","Mumbai","Powai","Apartment",290,2,2,980,2023,[0,1,2,4,5,6,7],210],
["Lakeview Row House","Nashik","Gangapur Road","Row House",98,3,3,1700,2020,[0,3,5],160],
["Heritage Bungalow","Nanded","Vazirabad","Villa",150,4,3,2800,2018,[0,3,5,7],20],
["Urban Nest 2BHK","Nanded","Shivaji Nagar","Apartment",42,2,2,1050,2022,[0,4,5],260],
["Prime Commercial Shop","Nagpur","Sitabuldi","Commercial",110,0,1,650,2017,[0,5,7],50],
["Residential Plot 2400","Aurangabad","Beed Bypass","Plot",60,0,0,2400,2024,[5],100],
["Orchid Park 3BHK","Nagpur","Dharampeth","Apartment",95,3,2,1320,2021,[0,1,4,5,6],300],
["Riverside Penthouse","Pune","Koregaon Park","Apartment",460,4,5,3600,2023,[0,1,2,4,5,6,7],190],
["Smart Office Space","Mumbai","BKC","Commercial",480,0,2,1800,2022,[0,4,5,7],230]
].map((a,i)=>({id:i,title:a[0],city:a[1],area:a[2],type:a[3],price:a[4],beds:a[5],baths:a[6],sqft:a[7],year:a[8],am:a[9].map(k=>AMEN[k]),hue:a[10]}));

// Generated SVG "photos" (no external images needed)
function pic(h,v){
  const w=[...Array(6)].map((_,i)=>`<rect x="${50+(i%3)*50}" y="${70+Math.floor(i/3)*45}" width="28" height="30" fill="hsl(${h},80%,${v==1?85:92}%)"/>`).join('');
  const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h+v*25},65%,${v==2?35:75}%)"/><stop offset="1" stop-color="hsl(${h},50%,92%)"/></linearGradient></defs><rect width="300" height="200" fill="url(#g)"/><rect y="165" width="300" height="35" fill="hsl(${h},35%,45%)"/>${v==0?`<rect x="35" y="45" width="170" height="125" fill="hsl(${h},45%,40%)"/><polygon points="25,45 120,10 215,45" fill="hsl(${h},50%,28%)"/>${w}<rect x="105" y="125" width="30" height="45" fill="hsl(${h},40%,22%)"/><circle cx="250" cy="45" r="20" fill="#fde68a"/>`:v==1?`<rect x="20" y="95" width="180" height="55" rx="10" fill="hsl(${h},40%,35%)"/><rect x="30" y="75" width="160" height="30" rx="8" fill="hsl(${h},40%,45%)"/><rect x="215" y="40" width="65" height="80" fill="hsl(${h},70%,90%)" stroke="hsl(${h},30%,30%)" stroke-width="4"/>`:`<rect x="40" y="105" width="220" height="50" rx="8" fill="hsl(${h},35%,80%)"/><rect x="40" y="85" width="60" height="25" rx="6" fill="#fff"/><rect x="110" y="85" width="60" height="25" rx="6" fill="#fff"/><rect x="200" y="30" width="60" height="45" fill="#fde68a" opacity=".8"/>`}</svg>`;
  return "data:image/svg+xml;utf8,"+encodeURIComponent(s);
}
const $=id=>document.getElementById(id);
const money=l=>l>=100?"₹"+(l/100).toFixed(2).replace(/\.?0+$/,"")+" Cr":"₹"+l+" L";
let favs=new Set(),cmp=[],favOnly=false,inquiries=[];
try{favs=new Set(JSON.parse(localStorage.getItem("nf_favs")||"[]"));inquiries=JSON.parse(localStorage.getItem("nf_inq")||"[]")}catch(e){}
const save=()=>{try{localStorage.setItem("nf_favs",JSON.stringify([...favs]))}catch(e){}};

// Build filter controls
[...new Set(P.map(p=>p.city))].sort().forEach(c=>$("city").add(new Option(c,c)));
[...new Set(P.map(p=>p.type))].sort().forEach(c=>$("type").add(new Option(c,c)));
$("am").innerHTML=AMEN.map((a,i)=>`<label><input type="checkbox" value="${a}">${a}</label>`).join("");

function filtered(){
  const q=$("q").value.toLowerCase().trim(),c=$("city").value,t=$("type").value,mp=+$("price").value,b=+$("beds").value,ar=+$("area").value||0;
  const am=[...document.querySelectorAll("#am input:checked")].map(x=>x.value);
  let r=P.filter(p=>(!q||(p.title+p.city+p.area).toLowerCase().includes(q))&&(!c||p.city==c)&&(!t||p.type==t)&&p.price<=mp&&p.beds>=b&&p.sqft>=ar&&am.every(a=>p.am.includes(a))&&(!favOnly||favs.has(p.id)));
  const s=$("sort").value;
  if(s=="pa")r.sort((x,y)=>x.price-y.price);if(s=="pd")r.sort((x,y)=>y.price-x.price);
  if(s=="sd")r.sort((x,y)=>y.sqft-x.sqft);if(s=="nw")r.sort((x,y)=>y.year-x.year);
  return r;
}
function render(){
  $("pv").textContent=+$("price").value>=500?"Any":money(+$("price").value);
  const r=filtered();
  $("count").textContent=r.length+" propert"+(r.length==1?"y":"ies")+(favOnly?" (favorites)":"")+" found";
  $("favCount").textContent=favs.size;
  $("grid").innerHTML=r.length?r.map(p=>`<article class="card"><div class="ph"><img src="${pic(p.hue,0)}" alt="${p.title}" data-open="${p.id}"><span class="tag">${p.type}</span><button class="fav ${favs.has(p.id)?"on":""}" data-fav="${p.id}" aria-label="Favorite">♥</button></div>
  <div class="cb"><div class="price">${money(p.price)}</div><h3>${p.title}</h3><div class="loc">📍 ${p.area}, ${p.city}</div>
  <div class="specs">${p.beds?`<span>🛏 ${p.beds}</span><span>🛁 ${p.baths}</span>`:""}<span>📐 ${p.sqft} sq ft</span></div>
  <div class="acts"><label><input type="checkbox" data-cmp="${p.id}" ${cmp.includes(p.id)?"checked":""}>Compare</label><button class="btn" data-open="${p.id}">Details</button></div></div></article>`).join(""):`<div class="empty" style="grid-column:1/-1">No properties match your filters. Try widening your search.</div>`;
  $("bar").classList.toggle("show",cmp.length>0);
  $("cmpTxt").textContent=cmp.length+" of 3 selected"+(cmp.length<2?" – pick at least 2":"");
}
const modal=h=>{$("mb").innerHTML=`<button class="x" data-close>&times;</button>`+h;$("m").classList.add("show")};
function details(id){
  const p=P[id];
  modal(`<h2 style="margin:0">${p.title}</h2><div class="loc">📍 ${p.area}, ${p.city} · <b style="color:var(--brand)">${money(p.price)}</b></div>
  <div class="gal"><img src="${pic(p.hue,0)}" alt=""><div><img src="${pic(p.hue,1)}" alt=""><img src="${pic(p.hue,2)}" alt=""></div></div>
  <div class="sp"><div><b>Type</b>${p.type}</div><div><b>Bedrooms</b>${p.beds||"–"}</div><div><b>Bathrooms</b>${p.baths||"–"}</div><div><b>Area</b>${p.sqft} sq ft</div><div><b>Price / sq ft</b>₹${Math.round(p.price*1e5/p.sqft).toLocaleString("en-IN")}</div><div><b>Built</b>${p.year}</div></div>
  <p><b>Amenities</b><br>${p.am.map(a=>`<span class="pill">${a}</span>`).join("")}</p>
  <button class="btn" data-inq="${id}">Send inquiry</button> <button class="btn alt" data-fav="${id}">${favs.has(id)?"Remove favorite":"♥ Add to favorites"}</button>`);
}
function compare(){
  const L=cmp.map(i=>P[i]);
  const row=(n,f,best)=>{const v=L.map(f);const b=best?best(v):null;return `<tr><th>${n}</th>${v.map(x=>`<td class="${b!==null&&x===b?"best":""}">${x}</td>`).join("")}</tr>`};
  modal(`<h2 style="margin-top:0">Compare properties</h2><div class="tw"><table><tr><th></th>${L.map(p=>`<th>${p.title}</th>`).join("")}</tr>
  <tr><th>Photo</th>${L.map(p=>`<td><img src="${pic(p.hue,0)}" style="width:130px;border-radius:6px" alt=""></td>`).join("")}</tr>
  ${row("Price",p=>p.price,v=>Math.min(...v)).replace(/<td class="(best)?">(\d+)/g,(m,b,n)=>`<td class="${b||""}">${money(+n)}`)}
  ${row("Location",p=>p.area+", "+p.city)}${row("Type",p=>p.type)}
  ${row("Area (sq ft)",p=>p.sqft,v=>Math.max(...v))}
  ${row("Price / sq ft",p=>"₹"+Math.round(p.price*1e5/p.sqft).toLocaleString("en-IN"))}
  ${row("Bedrooms",p=>p.beds,v=>Math.max(...v))}${row("Bathrooms",p=>p.baths)}${row("Year built",p=>p.year,v=>Math.max(...v))}
  ${row("Amenities",p=>p.am.length+": "+p.am.join(", "))}</table></div><p class="loc">Highlighted cells show the lowest price and the largest area, bedroom count and newest build.</p>`);
}
function inquiry(id){
  const p=P[id];
  modal(`<h2 style="margin-top:0">Inquire about ${p.title}</h2><form id="f" novalidate>
  <label>Full name</label><input id="fn"><div class="err" id="e1"></div>
  <label>Email</label><input id="fe" type="email"><div class="err" id="e2"></div>
  <label>Phone (10 digits)</label><input id="fp" inputmode="numeric"><div class="err" id="e3"></div>
  <label>Message</label><textarea id="fm" rows="3">I am interested in ${p.title}. Please share more details.</textarea><div class="err" id="e4"></div>
  <button class="btn" type="submit">Submit inquiry</button></form><div id="res"></div>`);
  $("f").onsubmit=e=>{e.preventDefault();
    const n=$("fn").value.trim(),em=$("fe").value.trim(),ph=$("fp").value.trim(),m=$("fm").value.trim();
    const er=[n.length<3?"Enter your full name (min 3 characters).":"",/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)?"":"Enter a valid email address.",/^[6-9]\d{9}$/.test(ph)?"":"Enter a valid 10-digit Indian mobile number.",m.length<10?"Message must be at least 10 characters.":""];
    er.forEach((t,i)=>$("e"+(i+1)).textContent=t);
    if(er.some(Boolean))return;
    inquiries.push({property:p.title,name:n,email:em,phone:ph,message:m,date:new Date().toISOString()});
    try{localStorage.setItem("nf_inq",JSON.stringify(inquiries))}catch(x){}
    $("f").style.display="none";
    $("res").innerHTML=`<div class="ok">✅ Thank you, ${n.replace(/</g,"&lt;")}! Your inquiry for <b>${p.title}</b> was sent. An agent will contact you at ${em.replace(/</g,"&lt;")} shortly.</div>`;
  };
}
// Events
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-open],[data-fav],[data-inq],[data-close]");
  if(e.target.id=="m"||(t&&"close" in t.dataset))return $("m").classList.remove("show");
  if(!t)return;
  const d=t.dataset;
  if(d.open!==undefined)details(+d.open);
  else if(d.inq!==undefined)inquiry(+d.inq);
  else if(d.fav!==undefined){const i=+d.fav;favs.has(i)?favs.delete(i):favs.add(i);save();
    if($("m").classList.contains("show"))details(i);render();}
});
document.addEventListener("change",e=>{
  if(e.target.dataset.cmp!==undefined){const i=+e.target.dataset.cmp;
    if(e.target.checked){if(cmp.length>=3){e.target.checked=false;alert("You can compare up to 3 properties.");return}cmp.push(i)}
    else cmp=cmp.filter(x=>x!=i);render();}
});
["q","city","type","price","beds","area","sort"].forEach(i=>$(i).addEventListener("input",render));
$("am").addEventListener("change",render);
$("reset").onclick=()=>{["q","area"].forEach(i=>$(i).value="");["city","type","sort"].forEach(i=>$(i).value="");$("beds").value=0;$("price").value=500;document.querySelectorAll("#am input").forEach(c=>c.checked=false);favOnly=false;render()};
$("favToggle").onclick=()=>{favOnly=!favOnly;render()};
$("cmpClear").onclick=()=>{cmp=[];render()};
$("cmpGo").onclick=()=>cmp.length<2?alert("Select at least 2 properties to compare."):compare();
render();
