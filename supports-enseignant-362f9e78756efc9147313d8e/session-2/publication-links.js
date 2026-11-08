(() => {
  const allowed=new Set(["index.html","cours.pdf","sources/citations_monde_fini_2026-11-03/Kenneth_E._Boulding.jpg","sources/limits_to_growth_1972/couverture_capture.png","sources/citations_monde_fini_2026-11-03/camille_etienne.png","sources/corees_espace_2012/8249377151_692e248e6b_o.jpg","sources/portrait_solow_2026-11-03/Robert_Solow_by_Olaf_Storbeck.jpg","sources/pgf_2026-11-09/images/solow.jpg","sources/pgf_2026-11-09/images/romer.jpg","sources/pgf_2026-11-09/images/education.jpg","sources/pgf_2026-11-09/figures/education_niveau.png","sources/pgf_2026-11-09/images/recherche.jpg","sources/pgf_2026-11-09/images/automatisation.png","sources/pgf_2026-11-09/images/automatisation_travail.png","sources/pgf_2026-11-09/images/institutions.jpg","sources/pgf_2026-11-09/figures/institutions_propriete.png","sources/pgf_2026-11-09/figures/institutions_corruption.png","sources/pgf_2026-11-09/figures/management_liens.png","sources/pgf_2026-11-09/images/pesticides.jpg"].map(p=>new URL(p,location.href).pathname));
  const published=new Map([].map(([local,url])=>[new URL(local,location.href).pathname,url]));
  const publicSource=url => {
  if(url.includes('19340104_nationalinc.pdf'))return 'https://fraser.stlouisfed.org/title/national-income-1929-1932-971';
  if(url.includes('094000427.pdf'))return 'https://www.insee.fr/fr/information/2550927';
  return null;
};
  const clean=html=>{
    if(typeof html!=='string')return html;
    const t=document.createElement('template'); t.innerHTML=html;
    for(const a of t.content.querySelectorAll('a[href]')){
      const href=a.getAttribute('href');
      const external=publicSource(href);
      if(external){a.href=external;continue;}
      if(href.startsWith('#')||/^(https?:|mailto:|tel:)/i.test(href))continue;
      const u=new URL(href,location.href);
      if(u.protocol!=='file:'&&u.origin!==location.origin){a.replaceWith(...a.childNodes);continue;}
      const publicURL=published.get(u.pathname);
      if(publicURL){a.href=publicURL+u.search+u.hash;continue;}
      if(!allowed.has(u.pathname))a.replaceWith(...a.childNodes);
    }
    return t.innerHTML;
  };
  for(const s of [...(window.SLIDES||[]),...(window.SLIDES_ENSEIGNANT||[])]){
    s.html=clean(s.html);s.source=clean(s.source);if(s.notes)s.notes=clean(s.notes);
    for(const x of s.extensions||[])x.html=clean(x.html);
  }
  for(const id of Object.keys(window.NOTES||{}))window.NOTES[id]=clean(window.NOTES[id]);
  if(window.SOURCES_HTML)window.SOURCES_HTML=clean(window.SOURCES_HTML);
})();