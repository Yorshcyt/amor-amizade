import {CAMPUS_MAP,CAMPUS_WAYS,CAMPUS_PLACES} from './campus-data.mjs';
const key=p=>p.join(','),vertices=new Map(),adjacency=new Map(),edges=[];
for(const way of CAMPUS_WAYS)for(let i=1;i<way.points.length;i++){
 const a=way.points[i-1],b=way.points[i],u=key(a),v=key(b);if(u===v)continue;
 const edge={a,b,u,v,name:way.name,kind:'shared',bridge:null,distance:Math.hypot(a[0]-b[0],a[1]-b[1])*CAMPUS_MAP.kmPerPixel};edges.push(edge);vertices.set(u,a);vertices.set(v,b);
 for(const [from,to]of [[u,v],[v,u]]){if(!adjacency.has(from))adjacency.set(from,[]);adjacency.get(from).push({to,edge});}
}
const places=new Map(CAMPUS_PLACES.map(p=>[p.id,p])),cache=new Map();
export function estimateCampus(from,to,mode='walk'){
 if(mode!=='walk')throw Error('No campus, os trajetos são apenas a pé.');
 if(!places.has(from)||!places.has(to))throw Error('Escolha dois setores do campus.');
 const cacheKey=from+'|'+to;if(cache.has(cacheKey))return cache.get(cacheKey);
 const start=key(places.get(from).point),end=key(places.get(to).point),dist=new Map([[start,0]]),previous=new Map(),open=new Set([start]);
 while(open.size){let u=null;for(const v of open)if(u===null||dist.get(v)<dist.get(u))u=v;open.delete(u);if(u===end)break;
  for(const {to:v,edge}of adjacency.get(u)||[]){const cost=dist.get(u)+edge.distance;if(cost<(dist.get(v)??Infinity)){dist.set(v,cost);previous.set(v,{from:u,edge});open.add(v);}}
 }
 if(!dist.has(end))throw Error('Não há caminho entre esses setores.');
 const segments=[];let at=end;while(at!==start){const p=previous.get(at);segments.unshift({...p.edge,from:vertices.get(p.from),to:vertices.get(at)});at=p.from;}
 const path={points:[vertices.get(start),...segments.map(s=>s.to)],segments,distance:dist.get(end),minutes:dist.get(end)/4.5*60,bridges:[]};
 const trip={mode:'walk',path,legs:path.distance?[{kind:'walk',path}]:[],walkMinutes:path.minutes,rideMinutes:0,overhead:0,low:path.minutes*.9,high:path.minutes*1.15};cache.set(cacheKey,trip);return trip;
}
export const CAMPUS_NETWORK={vertices,edges};
