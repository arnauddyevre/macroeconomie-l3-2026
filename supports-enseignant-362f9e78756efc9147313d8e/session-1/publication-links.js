(() => {
  const allowed=new Set(["index.html","cours.pdf","exercices/rattrapage_correction_enseignant.pdf","exercices/niveau_vie_exercice_corrige.pdf"].map(p=>new URL(p,location.href).pathname));
  const published=new Map([["exercices/niveau_vie_exercice_etudiant.pdf","https://arnauddyevre.github.io/macroeconomie-l3-2026/chapitre-1/exercices/niveau_vie_exercice_etudiant.pdf"]].map(([local,url])=>[new URL(local,location.href).pathname,url]));
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