import {MAP,MODES,PLACES} from './city-data.mjs';
import {estimateAll,rangeLabel,distanceLabel,routeNames} from './router.mjs';
const $=id=>document.getElementById(id),origin=$('origin'),destination=$('destination'),viewport=$('viewport'),stage=$('stage'),overlay=$('route');
const state={mode:'walk',from:'bianca',to:'fisio',scale:1,x:0,y:0,showCity:false,trips:null,pointers:new Map()};
const NS='http://www.w3.org/2000/svg';
for(const place of PLACES)for(const select of [origin,destination]){const option=document.createElement('option');option.value=place.id;option.textContent=place.name;select.append(option);}
try{const saved=JSON.parse(localStorage.getItem('amor-amizade-trip')||'null');if(saved&&PLACES.some(p=>p.id===saved.from)&&PLACES.some(p=>p.id===saved.to)&&MODES.some(m=>m.id===saved.mode))Object.assign(state,{from:saved.from,to:saved.to,mode:saved.mode});}catch{}
origin.value=state.from;destination.value=state.to;
const name=id=>PLACES.find(p=>p.id===id).name;
function update(refit=true){
 state.from=origin.value;state.to=destination.value;
 try{state.trips=estimateAll(state.from,state.to);}catch(error){$('result-time').textContent='Trajeto indisponível';$('result-context').textContent='Escolha outros locais para continuar.';console.error(error);return;}
 const trip=state.trips[state.mode],mode=MODES.find(m=>m.id===state.mode),same=state.from===state.to;
 $('result-mode').textContent=mode.name;$('result-time').textContent=rangeLabel(trip);$('result-distance').textContent=same?'Mesmo lugar':`${distanceLabel(trip)} no trajeto`;
 $('trip-heading').textContent=`${name(state.from)} → ${name(state.to)}`;
 document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===state.mode)));
 let context='';
 if(same)context='Vocês já estão no mesmo local.';
 else if(state.mode==='bus')context=`${trip.lines.join(' → ')} · espera de ${trip.waitLow}–${trip.waitHigh} min${trip.transfer?' · 1 troca de linha':''}.`;
 else if(state.mode==='car')context='Inclui estacionamento e caminhada até a entrada.';
 else if(state.mode==='moto')context='Inclui preparação, estacionamento e acesso à entrada.';
 else if(state.mode==='bike')context='Inclui 2 minutos para guardar a bicicleta.';
 else if(trip.path.bridges.length)context=`Pelas vias do mapa, usando ${trip.path.bridges.length===1?'a ponte':'as pontes'} do trajeto.`;
 $('result-context').textContent=context;
 const breakdown=[];
 if(!same){if(trip.walkMinutes>0)breakdown.push(`${Math.round(trip.walkMinutes)} min a pé`);if(trip.rideMinutes>0)breakdown.push(`${Math.round(trip.rideMinutes)} min em deslocamento`);if(trip.overhead)breakdown.push(`${trip.overhead} min para ${state.mode==='bike'?'guardar a bicicleta':'preparação e estacionamento'}`);if(state.mode==='bus')breakdown.push(`${trip.waitLow}–${trip.waitHigh} min de espera${trip.transfer?' · troca em '+trip.transfer:''}`);}
 $('breakdown').textContent=same?'Nenhum deslocamento necessário.':breakdown.join(' + ');
 $('streets').replaceChildren(...routeNames(trip).map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 $('comparison').replaceChildren(...MODES.map(m=>{const button=document.createElement('button');button.className='compare-row';button.type='button';button.setAttribute('aria-pressed',String(m.id===state.mode));const label=document.createElement('span');label.textContent=m.name;const time=document.createElement('strong');time.textContent=rangeLabel(state.trips[m.id]);button.append(label,time);button.addEventListener('click',()=>{state.mode=m.id;update();});return button;}));
 $('walk-legend').hidden=!['bus','car','moto'].includes(state.mode)||same;
 for(const [id,point] of [['pin-a',PLACES.find(p=>p.id===state.from).point],['pin-b',PLACES.find(p=>p.id===state.to).point]]){$(id).style.left=`${point[0]}px`;$(id).style.top=`${point[1]}px`;}
 $('pin-b').hidden=same;drawRoute();if(refit){state.showCity=false;fit();}
 try{localStorage.setItem('amor-amizade-trip',JSON.stringify({from:state.from,to:state.to,mode:state.mode}));}catch{}
}
function drawRoute(){
 overlay.replaceChildren();if(!state.trips)return;
 for(const leg of state.trips[state.mode].legs){if(leg.path.points.length<2)continue;const points=leg.path.points.map(p=>p.join(',')).join(' '),dashed=leg.kind==='walk'&&['car','moto','bus'].includes(state.mode);
  for(const halo of [true,false]){const line=document.createElementNS(NS,'polyline');line.setAttribute('points',points);line.setAttribute('fill','none');line.setAttribute('stroke',halo?'#ffffff':dashed?'#675279':'#7450ad');line.setAttribute('stroke-width',String((halo?10:5)/state.scale));line.setAttribute('stroke-linecap','round');line.setAttribute('stroke-linejoin','round');if(dashed)line.setAttribute('stroke-dasharray',`${6/state.scale} ${8/state.scale}`);overlay.append(line);}
 }
}
const minScale=()=>Math.min(viewport.clientWidth/MAP.width,viewport.clientHeight/MAP.height)*.7;
function transform(){
 stage.style.transform=`translate(${state.x}px,${state.y}px) scale(${state.scale})`;stage.style.setProperty('--inverse-scale',String(1/state.scale));drawRoute();
 const max=80/state.scale*MAP.kmPerPixel;let distance=.05;for(const d of [.05,.1,.2,.5,1,2])if(d<=max)distance=d;
 $('scale-label').textContent=distance<1?`${Math.round(distance*1000)} m`:`${distance} km`;$('scale-bar').style.width=`${distance/MAP.kmPerPixel*state.scale}px`;$('fit').textContent=state.showCity?'Enquadrar trajeto':'Ver cidade inteira';
}
function fit(){
 const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h||!state.trips)return;
 let x0=0,y0=0,x1=MAP.width,y1=MAP.height;
 if(!state.showCity){const points=state.trips[state.mode].path.points;x0=Math.min(...points.map(p=>p[0]));x1=Math.max(...points.map(p=>p[0]));y0=Math.min(...points.map(p=>p[1]));y1=Math.max(...points.map(p=>p[1]));const cx=(x0+x1)/2,cy=(y0+y1)/2,spanX=Math.max(390,x1-x0),spanY=Math.max(260,y1-y0);x0=cx-spanX/2;x1=cx+spanX/2;y0=cy-spanY/2;y1=cy+spanY/2;}
 const pad=state.showCity?16:55;state.scale=Math.max(minScale(),Math.min((w-pad*2)/(x1-x0),(h-pad*2)/(y1-y0),minScale()/.7*5));state.x=w/2-(x0+x1)/2*state.scale;state.y=h/2-(y0+y1)/2*state.scale;transform();
}
function zoom(factor,x=viewport.clientWidth/2,y=viewport.clientHeight/2){const next=Math.max(minScale(),Math.min(minScale()/.7*6,state.scale*factor)),ratio=next/state.scale;state.x=x-(x-state.x)*ratio;state.y=y-(y-state.y)*ratio;state.scale=next;transform();}
origin.addEventListener('change',()=>update());destination.addEventListener('change',()=>update());$('swap').addEventListener('click',()=>{[origin.value,destination.value]=[destination.value,origin.value];update();});
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{state.mode=button.dataset.mode;update();}));
$('zoom-in').addEventListener('click',()=>zoom(1.4));$('zoom-out').addEventListener('click',()=>zoom(1/1.4));$('fit').addEventListener('click',()=>{state.showCity=!state.showCity;fit();});
$('expand').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('map-shell').requestFullscreen();}catch{state.showCity=false;fit();}});
document.addEventListener('fullscreenchange',()=>{$('expand').setAttribute('aria-label',document.fullscreenElement?'Sair da tela cheia':'Mapa em tela cheia');fit();});
viewport.addEventListener('wheel',event=>{if(!event.ctrlKey&&!event.metaKey)return;event.preventDefault();const rect=viewport.getBoundingClientRect();zoom(Math.exp(-event.deltaY*.002),event.clientX-rect.left,event.clientY-rect.top);},{passive:false});
viewport.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;viewport.setPointerCapture(event.pointerId);state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});viewport.classList.add('dragging');});
viewport.addEventListener('pointermove',event=>{if(!state.pointers.has(event.pointerId))return;const old=[...state.pointers.values()];state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});const fresh=[...state.pointers.values()];if(fresh.length===1){state.x+=fresh[0].x-old[0].x;state.y+=fresh[0].y-old[0].y;transform();}else if(fresh.length===2&&old.length===2){const previous=Math.hypot(old[0].x-old[1].x,old[0].y-old[1].y),next=Math.hypot(fresh[0].x-fresh[1].x,fresh[0].y-fresh[1].y),rect=viewport.getBoundingClientRect(),cx=(fresh[0].x+fresh[1].x)/2,cy=(fresh[0].y+fresh[1].y)/2;if(previous>0)zoom(next/previous,cx-rect.left,cy-rect.top);state.x+=cx-(old[0].x+old[1].x)/2;state.y+=cy-(old[0].y+old[1].y)/2;transform();}});
function release(event){state.pointers.delete(event.pointerId);if(!state.pointers.size)viewport.classList.remove('dragging');}viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);
viewport.addEventListener('keydown',event=>{if(event.key==='+'||event.key==='='){event.preventDefault();zoom(1.4);}else if(event.key==='-'){event.preventDefault();zoom(1/1.4);}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();state.x+=event.key==='ArrowLeft'?45:event.key==='ArrowRight'?-45:0;state.y+=event.key==='ArrowUp'?45:event.key==='ArrowDown'?-45:0;transform();}});
new ResizeObserver(()=>fit()).observe(viewport);update();
