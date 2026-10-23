import {MAP,MODES,JUNCTIONS,WAYS,PLACES,BUS_LINES,STOP_NAMES} from './city-data.mjs?v=eb9c0d202332';

const coordinateKey = p=>`${p[0]},${p[1]}`;
const vertices=new Map(),edges=[],adjacency=new Map();
for(const way of WAYS){
 for(let i=1;i<way.points.length;i++){
  const a=way.points[i-1],b=way.points[i];
  if(!a||!b)throw Error(`Missing coordinate in ${way.name}`);
  const u=coordinateKey(a),v=coordinateKey(b);if(u===v)continue;
  vertices.set(u,a);vertices.set(v,b);
  const edge={id:edges.length,u,v,a,b,name:way.name,kind:way.kind,bridge:way.bridge||null,distance:Math.hypot(a[0]-b[0],a[1]-b[1])*MAP.kmPerPixel};
  edges.push(edge);
  for(const [from,to] of [[u,v],[v,u]]){if(!adjacency.has(from))adjacency.set(from,[]);adjacency.get(from).push({to,edge});}
 }
}
const aliases=Object.fromEntries(Object.entries(JUNCTIONS).map(([id,p])=>[id,coordinateKey(p)]));
const placeById=Object.fromEntries(PLACES.map(p=>[p.id,p]));
const modeById=Object.fromEntries(MODES.map(m=>[m.id,m]));
const cache=new Map();

class MinHeap {
 constructor(){this.items=[];}
 push(value){let i=this.items.length;this.items.push(value);while(i>0){const p=(i-1)>>1;if(this.items[p][0]<=value[0])break;this.items[i]=this.items[p];i=p;}this.items[i]=value;}
 pop(){const first=this.items[0],last=this.items.pop();if(this.items.length){let i=0;while(true){let c=i*2+1;if(c>=this.items.length)break;if(c+1<this.items.length&&this.items[c+1][0]<this.items[c][0])c++;if(last[0]<=this.items[c][0])break;this.items[i]=this.items[c];i=c;}this.items[i]=last;}return first;}
 get size(){return this.items.length;}
}
function edgeSpeed(edge,mode){
 if(mode==='walk')return 4.5;
 if(mode==='bike')return edge.kind==='access'?4.5:14;
 if(edge.kind!=='road')return 0;
 return mode==='bus'?18:22;
}
export function shortestPath(from,to,mode='walk'){
 const start=aliases[from]||from,end=aliases[to]||to,key=`${start}|${end}|${mode}`;
 if(cache.has(key))return cache.get(key);
 if(!vertices.has(start)||!vertices.has(end))throw Error(`Unknown routing node: ${from} / ${to}`);
 const dist=new Map([[start,0]]),previous=new Map(),heap=new MinHeap();heap.push([0,start]);
 while(heap.size){const [cost,u]=heap.pop();if(cost!==dist.get(u))continue;if(u===end)break;
  for(const {to:v,edge} of adjacency.get(u)||[]){const speed=edgeSpeed(edge,mode);if(!speed)continue;const d=cost+edge.distance/speed*60;if(d<(dist.get(v)??Infinity)){dist.set(v,d);previous.set(v,{from:u,edge});heap.push([d,v]);}}
 }
 if(!dist.has(end))throw Error(`Unreachable route: ${from} / ${to} / ${mode}`);
 const segments=[];let at=end;
 while(at!==start){const p=previous.get(at);segments.unshift({...p.edge,from:vertices.get(p.from),to:vertices.get(at)});at=p.from;}
 const points=[vertices.get(start),...segments.map(s=>s.to)];
 const path={points,segments,distance:segments.reduce((sum,e)=>sum+e.distance,0),minutes:dist.get(end),bridges:[...new Set(segments.map(s=>s.bridge).filter(Boolean))]};
 cache.set(key,path);return path;
}
function combine(paths){
 const nonempty=paths.filter(Boolean),segments=nonempty.flatMap(p=>p.segments);
 return {points:nonempty.flatMap((p,i)=>i?p.points.slice(1):p.points),segments,distance:nonempty.reduce((s,p)=>s+p.distance,0),minutes:nonempty.reduce((s,p)=>s+p.minutes,0),bridges:[...new Set(nonempty.flatMap(p=>p.bridges))]};
}
function basicTrip(a,b,mode){
 const config=modeById[mode];
 if(mode==='walk'||mode==='bike'){
  const path=shortestPath(a.node,b.node,mode),time=path.minutes+config.overhead;
  return {mode,path,legs:[{kind:mode,path}],low:time*.9,high:time*1.15,walkMinutes:mode==='walk'?path.minutes:0,rideMinutes:mode==='bike'?path.minutes:0,overhead:config.overhead};
 }
 const access=shortestPath(a.node,a.parking),ride=shortestPath(a.parking,b.parking,mode),exit=shortestPath(b.parking,b.node);
 const walkMinutes=access.minutes+exit.minutes,time=walkMinutes+ride.minutes+config.overhead;
 return {mode,path:combine([access,ride,exit]),legs:[{kind:'walk',path:access},{kind:mode,path:ride},{kind:'walk',path:exit}].filter(l=>l.path.distance>0),low:time*.9,high:time*1.25,walkMinutes,rideMinutes:ride.minutes,overhead:config.overhead};
}
const rides=[];
for(const line of BUS_LINES){
 for(let i=0;i<line.stops.length;i++)for(let j=0;j<line.stops.length;j++){
  if(i===j)continue;const direction=j>i?1:-1,paths=[];
  for(let k=i;k!==j;k+=direction)paths.push(shortestPath(line.stops[k],line.stops[k+direction],'bus'));
  const path=combine(paths);rides.push({line:line.id,from:line.stops[i],to:line.stops[j],path,minutes:path.minutes+Math.abs(i-j)*.75});
 }
}
const itineraries=rides.map(r=>[r]);
for(const first of rides)for(const second of rides){if(first.line!==second.line&&first.to===second.from&&first.from!==second.to)itineraries.push([first,second]);}
function busTrip(a,b){
 let best=null;
 for(const itinerary of itineraries){
  const first=itinerary[0],last=itinerary.at(-1),access=shortestPath(a.node,first.from),exit=shortestPath(last.to,b.node);
  const walkMinutes=access.minutes+exit.minutes,rideMinutes=itinerary.reduce((s,r)=>s+r.minutes,0),nominal=walkMinutes+rideMinutes+itinerary.length*8;
  if(best&&nominal>=best.nominal)continue;
  const legs=[{kind:'walk',path:access},...itinerary.map(r=>({kind:'bus',path:r.path,line:r.line})),{kind:'walk',path:exit}].filter(l=>l.path.distance>0);
  best={mode:'bus',nominal,path:combine(legs.map(l=>l.path)),legs,walkMinutes,rideMinutes,waitLow:itinerary.length*5,waitHigh:itinerary.length*12,lines:itinerary.map(r=>r.line),transfer:itinerary.length>1?(STOP_NAMES[first.to]||'ponto de integração'):null,low:walkMinutes*.9+rideMinutes*.9+itinerary.length*5,high:walkMinutes*1.1+rideMinutes*1.2+itinerary.length*12};
 }
 return best;
}
export function estimateTrip(from,to,mode='walk'){
 if(!placeById[from]||!placeById[to]||!modeById[mode])throw Error('Invalid trip selection');
 if(from===to){const path=shortestPath(placeById[from].node,placeById[to].node);return {mode,path,legs:[],low:0,high:0,walkMinutes:0,rideMinutes:0,overhead:0,lines:[]};}
 return mode==='bus'?busTrip(placeById[from],placeById[to]):basicTrip(placeById[from],placeById[to],mode);
}
export function estimateAll(from,to){return Object.fromEntries(MODES.map(m=>[m.id,estimateTrip(from,to,m.id)]));}
export function rangeLabel(trip){if(!trip.high)return '0 min';if(trip.high<1)return 'Menos de 1 min';const lo=Math.max(1,Math.round(trip.low)),hi=Math.max(lo,Math.round(trip.high));return lo===hi?`${lo} min`:`${lo}–${hi} min`;}
export function distanceLabel(trip){const d=trip.path.distance;return d<1?`${Math.round(d*1000/10)*10} m`:`${d.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})} km`;}
export function routeNames(trip){return [...new Set(trip.path.segments.map(e=>e.name))];}
export const NETWORK={vertices,edges,placeById,aliases};
