/* Section IA : exemples normalisés, jamais une calibration de l'économie.
 * Le système continu est intégré en logarithmes par RK4 ; le pas n'est pas une période économique.
 * Dérivation et sources : plan_section_4_ia.md, sources/litterature_ia/. */
(function(root,factory){
  const model=factory();
  if(typeof module==='object'&&module.exports)module.exports=model;
  else root.IACroissance=model;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const BASE=Object.freeze({alpha:1/3,phi:1/2,c:1,d:2/3,delta:0});
  const gamma=(eta,alpha=BASE.alpha,phi=BASE.phi)=>eta/((1-alpha)*(1-phi));
  const production=(k,alpha)=>k**alpha;
  const research=(k,eta)=>k**eta;
  const bottleneck=(x1,x2=1)=>2*x1*x2/(x1+x2);
  function rates(u,v,eta,p){
    return [p.c*Math.exp(v-(1-p.alpha)*u)-p.delta,
      p.d*Math.exp(eta*u-(1-p.phi)*v)];
  }
  function trajectory(eta,{horizon=6,step=.005,params={}}={}){
    const p={...BASE,...params};
    if(!(eta>=0&&eta<1&&p.alpha>0&&p.alpha<1&&p.phi<1&&p.c>0&&p.d>0&&p.delta>=0&&step>0&&horizon>=0))throw new RangeError('Paramètres IA invalides');
    let u=0,v=0,t=0;
    const rows=[];
    const snapshot=()=>{const [gK,gA]=rates(u,v,eta,p);return {t,K:Math.exp(u),A:Math.exp(v),Y:Math.exp(v+p.alpha*u),gY:gA+p.alpha*gK};};
    rows.push(snapshot());
    const n=Math.ceil(horizon/step);
    for(let i=0;i<n;i++){
      const h=Math.min(step,horizon-t),a=rates(u,v,eta,p),b=rates(u+h*a[0]/2,v+h*a[1]/2,eta,p),
        c=rates(u+h*b[0]/2,v+h*b[1]/2,eta,p),d=rates(u+h*c[0],v+h*c[1],eta,p);
      u+=h*(a[0]+2*b[0]+2*c[0]+d[0])/6;
      v+=h*(a[1]+2*b[1]+2*c[1]+d[1])/6;
      t=Math.min(horizon,(i+1)*step);
      if(!Number.isFinite(u+v)||Math.abs(u)+Math.abs(v)>500)throw new RangeError('Horizon trop proche de la divergence');
      rows.push(snapshot());
    }
    return rows;
  }
  return Object.freeze({BASE,gamma,production,research,bottleneck,trajectory});
});
