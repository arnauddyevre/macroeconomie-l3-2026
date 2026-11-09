
(function () {
  'use strict';
  const cache = new WeakMap();
  const BLUE = '#001F5F', ORANGE = '#B45309', BLUE_GREY = '#526780';
  const DEFAULT_YAW = Math.PI / 4, DEFAULT_TILT = 0.22;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const production = (K, L, A, alpha) => A * K ** alpha * L ** (1 - alpha);
  const fmt = value => value.toLocaleString('fr-FR', {maximumFractionDigits: 2});
  const color = A => A === 1 ? BLUE : ORANGE;
  const element = (tag, attrs, parent) => Charts.el(tag, attrs, parent);
  function text(parent, x, y, content, attrs = {}) {
    const node = element('text', {x, y, 'font-size': 19, fill: '#111', ...attrs}, parent);
    node.textContent = content;
    return node;
  }
  function mathLabel(parent, x, y, label, variable, attrs = {}) {
    const node = text(parent, x, y, label + ' ', {'font-weight': 700, ...attrs});
    const span = element('tspan', {'font-style': 'italic'}, node);
    span.textContent = variable;
    return node;
  }
  function init(container) {
    container.classList.add('chart', 'sf-surface3d');
    Object.assign(container.style, {position: 'relative', touchAction: 'none'});
    const state = {container, yaw: DEFAULT_YAW, tilt: DEFAULT_TILT, K: 4, L: 4, activeA: 1,
      static: false, slice: null, sliceKey: '', gradient: null, gradientKey: '', key: '', frame: 0, progress: 1, drag: null, cells: [], samples: []};
    state.finish = () => {
      cancelAnimationFrame(state.frame);
      state.frame = 0; state.progress = 1;
      state.cells.forEach(cell => cell.node.style.removeProperty('display'));
      state.labels?.setAttribute('opacity', '1');
      state.sliceLayer?.setAttribute('opacity', '1');
    };
    state.getState = () => ({yaw: state.yaw, tilt: state.tilt, K: state.K, L: state.L,
      A: state.activeA, values: [...state.values], static: state.static, progress: state.progress, slice: state.slice ? {...state.slice} : null, gradient: state.gradient ? {...state.gradient} : null});
    state.destroy = () => {state.finish(); container.replaceChildren(); cache.delete(container);};
    container.addEventListener('click',event=>event.stopPropagation());
    container.addEventListener('pointerdown',event=>{
      if(state.static||event.button!==0||!state.svg)return;
      event.preventDefault();event.stopPropagation();state.finish();state.svg.focus({preventScroll:true});
      state.drag={x:event.clientX,y:event.clientY,yaw:state.yaw,tilt:state.tilt};
      container.setPointerCapture(event.pointerId);state.svg.style.cursor='grabbing';
    });
    container.addEventListener('pointermove',event=>{
      if(state.static||!state.svg)return;
      if(state.drag){
        const drag=state.drag;
        state.yaw=clamp(drag.yaw+(event.clientX-drag.x)*.006,Math.PI/9,Math.PI*7/18);
        state.tilt=clamp(drag.tilt+(event.clientY-drag.y)*.001,0.12,0.29);
        draw(state,false);state.svg.style.cursor='grabbing';
        return;
      }
      if(state.progress<1)return;
      const box=state.svg.getBoundingClientRect();
      const x=(event.clientX-box.left)*state.width/box.width,y=(event.clientY-box.top)*state.height/box.height;
      let nearest=null,distance=28*28;
      for(const point of state.samples){const d=(point.x-x)**2+(point.y-y)**2;if(d<distance){distance=d;nearest=point;}}
      if(nearest)state.showPoint(nearest);else state.hidePoint();
    });
    const release=event=>{
      if(!state.drag)return;
      state.drag=null;state.svg.style.cursor='grab';
      if(container.hasPointerCapture(event.pointerId))container.releasePointerCapture(event.pointerId);
    };
    container.addEventListener('pointerup',release);container.addEventListener('pointercancel',release);
    container.addEventListener('pointerleave',()=>{if(!state.drag)state.hidePoint?.();});
    cache.set(container, state);
    return state;
  }
  function draw(state, animate) {
    const {container, width: W, height: H, values, alpha} = state;
    state.finish();
    container.replaceChildren();
    const yaw = state.static ? DEFAULT_YAW : state.yaw;
    const tilt = state.static ? DEFAULT_TILT : state.tilt;
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const scale = (W - 166) / (c + s), baseDepth = (H - 60) * tilt, zScale = (H - 60) * 0.44;
    const originX = W / 2 - (c - s) * scale / 2, originY = H - 82;
    const project = (K, L, Y) => ({
      x: originX + scale * (c * K / 8 - s * L / 8),
      y: originY - baseDepth * (s * K / 8 + c * L / 8) - zScale * Y / 16,
      depth: s * K / 8 + c * L / 8 - 0.35 * Y / 16
    });
    state.project = project;
    const svg = element('svg', {width: W, height: H, viewBox: `0 0 ${W} ${H}`,
      role: state.static ? 'img' : 'group', tabindex: state.static ? null : '0', 'data-keys': '',
      'aria-label': 'Production Cobb–Douglas en trois dimensions. Capital K et travail L de 0 à 8, production Y de 0 à 16. Glisser pour tourner. Flèches pour consulter K et L, Maj plus flèches pour tourner, touche A pour changer de surface, origine pour réinitialiser.'}, container);
    Object.assign(svg.style, {fontFamily: 'Palatino,"Palatino Linotype",serif', touchAction: 'none', cursor: state.static ? 'default' : 'grab', overflow: 'hidden'});
    state.svg = svg;
    const floor = element('g', {}, svg);
    const corners = [[0,0,0],[8,0,0],[8,8,0],[0,8,0]].map(p => project(...p));
    element('polygon', {points: corners.map(p => `${p.x},${p.y}`).join(' '), fill: '#F7F8FA', stroke: '#D9DDE3', 'stroke-width': 1}, floor);
    for (const value of [2,4,6]) {
      for (const points of [[[value,0,0],[value,8,0]],[[0,value,0],[8,value,0]]]) {
        const [a,b] = points.map(p => project(...p));
        element('line', {x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'#D9DDE3','stroke-width':.8}, floor);
      }
    }
    const mesh = element('g', {'class': 'sf-surface-mesh'}, svg);
    const cells = [], count = 28, step = 8 / count;
    state.samples = [];
    values.forEach(A => {
      for (let i=0; i<count; i++) for (let j=0; j<count; j++) {
        const vertices = [[i,j],[i+1,j],[i+1,j+1],[i,j+1]].map(([k,l]) => {
          const K=k*step, L=l*step;
          return project(K,L,production(K,L,A,alpha));
        });
        cells.push({A, column:i, vertices, depth:vertices.reduce((sum,p)=>sum+p.depth,0)/4});
      }
      for (let i=0;i<=32;i++) for (let j=0;j<=32;j++) {
        const K=i/4,L=j/4,Y=production(K,L,A,alpha);
        state.samples.push({A,K,L,Y,...project(K,L,Y)});
      }
    });
    cells.sort((a,b)=>b.depth-a.depth);
    cells.forEach(cell => {
      cell.node = element('polygon', {points:cell.vertices.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '),
        fill:color(cell.A),'fill-opacity':values.length>1?.18:.26,stroke:color(cell.A),'stroke-opacity':.34,'stroke-width':.65,
        'data-a':cell.A,'data-k-column':cell.column}, mesh);
    });
    state.cells=cells;
    const axes=element('g',{},svg);
    const line=(a,b,attrs={})=>element('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'#111','stroke-width':2,...attrs},axes);
    const origin=project(0,0,0), kEnd=project(8,0,0), lEnd=project(0,8,0), yEnd=project(0,8,16);
    line(origin,kEnd);line(origin,lEnd);line(lEnd,yEnd);
    text(axes,origin.x,origin.y+25,'0',{'text-anchor':'middle'});
    for (const value of [2,4,6,8]) {
      const k=project(value,0,0),l=project(0,value,0);
      line(k,{x:k.x+3,y:k.y+6},{'stroke-width':1.3});
      line(l,{x:l.x-3,y:l.y+6},{'stroke-width':1.3});
      text(axes,k.x+7,k.y+25,String(value),{'text-anchor':'middle'});
      text(axes,l.x-7,l.y+25,String(value),{'text-anchor':'middle'});
    }
    for (const value of [0,4,8,12,16]) {
      const p=project(0,8,value);
      line({x:p.x-6,y:p.y},p,{'stroke-width':1.3});
      text(axes,p.x-11,p.y+6,String(value),{'text-anchor':'end'});
    }
    mathLabel(axes,kEnd.x-5,originY+52,'Capital','K',{'text-anchor':'end'});
    mathLabel(axes,lEnd.x-5,originY+52,'Travail','L',{'text-anchor':'start'});
    mathLabel(axes,yEnd.x-14,yEnd.y-17,'Production','Y',{'text-anchor':'start'});
    const labels=element('g',{'class':'sf-surface-labels'},svg);state.labels=labels;
    values.forEach(A=>{
      const p=project(7.5,8,production(7.5,8,A,alpha));
      text(labels,p.x+14,p.y-8,'A = '+A,{'font-size':22,'font-weight':700,'font-style':'italic',fill:color(A),stroke:'#fff','stroke-width':4,'paint-order':'stroke fill'});
    });
    state.sliceLayer=element('g',{'class':'sf-surface-slice','pointer-events':'none'},svg);
    updateSlice(state);
    const marker=element('g',{'visibility':'hidden','pointer-events':'none'},svg);state.marker=marker;
    const guide=element('line',{'class':'ch-guide'},marker);
    const dot=element('circle',{r:5,fill:BLUE,stroke:'#fff','stroke-width':2},marker);
    const readout=document.createElement('div');readout.className='ch-readout';readout.setAttribute('role','status');
    Object.assign(readout.style,{top:'8px',right:'12px',fontFamily:'Palatino,"Palatino Linotype",serif',fontSize:'19px',zIndex:2,borderColor:'#D9DDE3'});
    container.append(readout);state.readout=readout;
    const show=(point)=>{
      const ground=project(point.K,point.L,0),p=project(point.K,point.L,point.Y);
      marker.setAttribute('visibility','visible');
      guide.setAttribute('x1',ground.x);guide.setAttribute('y1',ground.y);guide.setAttribute('x2',p.x);guide.setAttribute('y2',p.y);
      dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);dot.setAttribute('fill',color(point.A));
      readout.innerHTML=`<span style="color:${color(point.A)}"><i>A</i> = ${fmt(point.A)}</span><br><i>K</i> = ${fmt(point.K)} &nbsp; <i>L</i> = ${fmt(point.L)}<br><strong><i>Y</i> = ${fmt(point.Y)}</strong>`;
      readout.classList.add('on');
      state.K=point.K;state.L=point.L;state.activeA=point.A;
    };
    const hide=()=>{marker.setAttribute('visibility','hidden');readout.classList.remove('on');};
    const current=()=>({K:state.K,L:state.L,A:state.activeA,Y:production(state.K,state.L,state.activeA,alpha)});
    state.showCurrent=()=>show(current());state.showPoint=show;state.hidePoint=hide;
    if (!state.static) {
      text(svg,W/2,H-6,'Glisser : tourner. Flèches : K / L. Maj + flèches : tourner.',{'text-anchor':'middle','font-size':15,fill:'#536078'});
      svg.addEventListener('click',event=>event.stopPropagation());
      svg.addEventListener('focus',()=>{if(!state.drag)show(current());});
      svg.addEventListener('blur',hide);
      svg.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','a','A','Escape'].includes(event.key))return;
        event.preventDefault();event.stopPropagation();state.finish();
        if(event.key==='Escape'){svg.blur();return;}
        if(event.key==='Home'){state.yaw=DEFAULT_YAW;state.tilt=DEFAULT_TILT;state.K=4;state.L=4;draw(state,false);state.svg.focus({preventScroll:true});return;}
        if(event.shiftKey){
          if(event.key==='ArrowLeft')state.yaw=clamp(state.yaw-.08,Math.PI/9,Math.PI*7/18);
          if(event.key==='ArrowRight')state.yaw=clamp(state.yaw+.08,Math.PI/9,Math.PI*7/18);
          if(event.key==='ArrowUp')state.tilt=clamp(state.tilt-.02,.12,.29);
          if(event.key==='ArrowDown')state.tilt=clamp(state.tilt+.02,.12,.29);
          draw(state,false);state.svg.focus({preventScroll:true});return;
        }
        if(event.key==='ArrowLeft')state.K=clamp(state.K-.5,0,8);
        if(event.key==='ArrowRight')state.K=clamp(state.K+.5,0,8);
        if(event.key==='ArrowUp')state.L=clamp(state.L+.5,0,8);
        if(event.key==='ArrowDown')state.L=clamp(state.L-.5,0,8);
        if(event.key.toLowerCase()==='a')state.activeA=values[(values.indexOf(state.activeA)+1)%values.length];
        show(current());
      });
    }

    if(animate && !state.static && !matchMedia('(prefers-reduced-motion: reduce)').matches){
      state.progress=0;labels.setAttribute('opacity','0');state.sliceLayer.setAttribute('opacity','0');cells.forEach(cell=>cell.node.style.display='none');
      let start=null;
      const tick=now=>{
        if(start==null)start=now;
        state.progress=Math.min(1,(now-start)/1450);
        const visibleColumns=Math.ceil(state.progress*count);
        cells.forEach(cell=>cell.node.style.display=cell.column<visibleColumns?'':'none');
        if(state.progress<1)state.frame=requestAnimationFrame(tick);else state.finish();
      };
      state.frame=requestAnimationFrame(tick);
    }
  }


  function updateSlice(state) {
    const {slice, gradient, sliceLayer: layer, project, alpha, width: W} = state;
    if(!layer||!project)return;
    layer.replaceChildren();
    state.cells.forEach(cell=>{
      cell.node.setAttribute('fill-opacity',(slice||gradient)?.14:(state.values.length>1?.18:.26));
      cell.node.setAttribute('stroke-opacity',(slice||gradient)?.22:.34);
    });
    layer.classList.toggle('sf-surface-gradient',!!gradient);
    if(gradient){updateGradient(state);return;}
    if(!slice)return;
    const {fixed:L,value:K,tangent}=slice;
    const A=1, Y=production(K,L,A,alpha), point=project(K,L,Y);
    const points=Array.from({length:101},(_,i)=>{
      const k=8*i/100;
      return project(k,L,production(k,L,A,alpha));
    });
    const path=points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');
    element('path',{d:path,fill:'none',stroke:'#fff','stroke-width':7,'stroke-linejoin':'round'},layer);
    element('path',{d:path,fill:'none',stroke:BLUE,'stroke-width':3.5,'stroke-linejoin':'round','class':'sf-surface-slice-curve','data-fixed-l':L},layer);
    if(tangent && K>0) {
      const slope=alpha*A*K**(alpha-1)*L**(1-alpha);
      const lo=0,hi=slope>0?Math.min(8,K+(16-Y)/slope):8;
      const start=project(lo,L,Y+slope*(lo-K)),end=project(hi,L,Y+slope*(hi-K));
      element('line',{x1:start.x,y1:start.y,x2:end.x,y2:end.y,stroke:'#fff','stroke-width':6},layer);
      element('line',{x1:start.x,y1:start.y,x2:end.x,y2:end.y,stroke:ORANGE,'stroke-width':3,'stroke-dasharray':'8 5','class':'sf-surface-tangent','data-slope':slope},layer);

      const anchorK=Math.max(0.5,K-1.2),anchor=project(anchorK,L,Y+slope*(anchorK-K));
      text(layer,clamp(anchor.x-8,75,W-95),anchor.y-22,'Tangente',{'font-size':19,'font-weight':600,fill:ORANGE,stroke:'#fff','stroke-width':4,'paint-order':'stroke fill','text-anchor':'end'});
    }
    element('circle',{cx:point.x,cy:point.y,r:6,fill:ORANGE,stroke:'#fff','stroke-width':2,'class':'sf-surface-slice-point','data-k':K,'data-l':L,'data-y':Y},layer);
    const labelPoint=points[points.length-1];
    text(layer,clamp(labelPoint.x+10,30,W-82),labelPoint.y-12,'L = '+fmt(L),{'font-size':21,'font-weight':700,'font-style':'italic',fill:BLUE,stroke:'#fff','stroke-width':4,'paint-order':'stroke fill'});
    layer.setAttribute('opacity',state.progress<1?'0':'1');
  }


  function updateGradient(state) {
    const {gradient, sliceLayer:layer, project, alpha, width:W, height:H}=state;
    const {K,L,tangent}=gradient,Y=production(K,L,1,alpha);
    const dK=alpha*Y/K,dL=(1-alpha)*Y/L;
    const labels=[];
    const halo={stroke:'#fff','stroke-width':4,'paint-order':'stroke fill'};
    const placeLabel=(anchor,content,ink,size=19,preferredOffset=-22)=>{
      const node=text(layer,anchor.x,anchor.y+preferredOffset,content,{
        'font-size':size,'font-weight':600,'font-style':'italic',fill:ink,...halo,'text-anchor':'middle'});
      const initial=node.getBBox();
      const x=clamp(anchor.x,initial.width/2+10,W-initial.width/2-10);
      node.setAttribute('x',x);
      for(const offset of [preferredOffset,preferredOffset-25,preferredOffset+30,preferredOffset-50,preferredOffset+55]){
        node.setAttribute('y',clamp(anchor.y+offset,24,H-52));
        const box=node.getBBox();
        const collision=labels.some(b=>box.x<b.x+b.width+5&&box.x+box.width+5>b.x&&box.y<b.y+b.height+5&&box.y+box.height+5>b.y);
        if(!collision)break;
      }
      labels.push(node.getBBox());
      return node;
    };
    const sections=[
      {axis:'K',fixed:L,ink:BLUE,point:t=>[t,L,production(t,L,1,alpha)],caption:'L = '+fmt(L)},
      {axis:'L',fixed:K,ink:BLUE_GREY,point:t=>[K,t,production(K,t,1,alpha)],caption:'K = '+fmt(K)}
    ];
    sections.forEach(section=>{
      const points=Array.from({length:101},(_,i)=>project(...section.point(8*i/100)));
      const d=points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');
      element('path',{d,fill:'none',stroke:'#fff','stroke-width':7,'stroke-linejoin':'round'},layer);
      element('path',{d,fill:'none',stroke:section.ink,'stroke-width':3.4,'stroke-linejoin':'round',
        'class':'sf-surface-gradient-curve','data-axis':section.axis,'data-fixed':section.fixed},layer);

      const p=points[points.length-1];
      placeLabel({x:p.x+(section.axis==='K'?28:-28),y:p.y},section.caption,section.ink,20,25);
    });
    if(tangent){
      for(const direction of [
        {axis:'K',value:K,slope:dK,ink:ORANGE,dash:'9 5',point:t=>[t,L,Y+dK*(t-K)]},
        {axis:'L',value:L,slope:dL,ink:BLUE_GREY,dash:'3 4',point:t=>[K,t,Y+dL*(t-L)]}
      ]){
        const hi=direction.slope>0?Math.min(8,direction.value+(16-Y)/direction.slope):8;
        const start=project(...direction.point(0)),end=project(...direction.point(hi));
        element('line',{x1:start.x,y1:start.y,x2:end.x,y2:end.y,stroke:'#fff','stroke-width':6},layer);
        element('line',{x1:start.x,y1:start.y,x2:end.x,y2:end.y,stroke:direction.ink,'stroke-width':3,
          'stroke-dasharray':direction.dash,'class':'sf-surface-tangent sf-surface-gradient-tangent',
          'data-axis':direction.axis,'data-slope':direction.slope},layer);

        const t=Math.min(hi,direction.value<=4?6.8:1.2),anchor=project(...direction.point(t));
        const derivative=direction.slope.toLocaleString('fr-FR',{minimumFractionDigits:3,maximumFractionDigits:3});
        const label=placeLabel(anchor,'∂Y/∂'+direction.axis+' = '+derivative,direction.ink,19,-24);
        label.setAttribute('data-axis',direction.axis);
      }
    }
    const point=project(K,L,Y);
    element('circle',{cx:point.x,cy:point.y,r:6,fill:ORANGE,stroke:'#fff','stroke-width':2,
      'class':'sf-surface-gradient-point','data-k':K,'data-l':L,'data-y':Y,'data-dk':dK,'data-dl':dL},layer);
    layer.setAttribute('opacity',state.progress<1?'0':'1');
  }
  function normalizeGradient(input) {
    if(!input)return null;
    const K=Number(input.K),L=Number(input.L);
    if(!Number.isFinite(K)||K<=0||K>8||!Number.isFinite(L)||L<=0||L>8)
      throw new Error('Le gradient exige K et L strictement positifs, au plus égaux à 8.');
    return {K,L,tangent:!!input.tangent};
  }
  function normalizeSlice(input) {
    if(!input)return null;
    if(input.axis!=='K')throw new Error('La coupe de production utilise uniquement la direction K.');
    const fixed=Number(input.fixed),value=Number(input.value);
    if(!Number.isFinite(fixed)||fixed<0||fixed>8||!Number.isFinite(value)||value<0||value>8)
      throw new Error('La coupe exige K et L compris entre 0 et 8.');
    return {axis:'K',fixed,value,tangent:!!input.tangent};
  }
  function render(container, options={}) {
    if(typeof container==='string')container=document.getElementById(container);
    if(!container)return null;
    const state=cache.get(container)||init(container);
    const width=container.clientWidth,height=container.clientHeight||440;
    if(width<20)return state;
    const values=[...new Set(options.values||[1])].filter(x=>x===1||x===2).sort();
    if(!values.length)values.push(1);
    const alpha=options.alpha??1/3;
    if(!(alpha>0&&alpha<1))throw new Error('La surface de Solow exige 0 < α < 1.');
    const gradient=normalizeGradient(options.gradient),gradientKey=JSON.stringify(gradient);
    const gradientChanged=state.gradientKey!==gradientKey;
    state.gradient=gradient;state.gradientKey=gradientKey;
    const slice=gradient?null:normalizeSlice(options.slice),sliceKey=JSON.stringify(slice);
    const sliceChanged=state.sliceKey!==sliceKey;
    state.slice=slice;state.sliceKey=sliceKey;
    const key=JSON.stringify({width,height,values,alpha,static:!!options.static});
    if(state.key===key && container.contains(state.svg)){
      if(options.static)state.finish();
      if(sliceChanged||gradientChanged)updateSlice(state);
      return state;
    }
    state.key=key;Object.assign(state,{width,height,values,alpha,static:!!options.static});
    if(!values.includes(state.activeA))state.activeA=values[0];
    draw(state,!!options.animate);
    return state;
  }
  window.SolowSurface3D={render};
})();
