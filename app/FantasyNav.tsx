import './fantasy-nav.css';
import './scattered-nav-arrow.css';

export type FantasyTarget='Stats'|'Kampf'|'Inventar'|'Zauber'|'Übersicht'|'Notizen';
const items:[string,FantasyTarget,string][]=[['Stats','Stats','-23.65%'],['Waffen','Kampf','-124.32%'],['Items','Inventar','-225.68%'],['Zauber','Zauber','-326.35%'],['Können','Übersicht','-427.03%'],['Story','Notizen','-527.03%']];

export default function FantasyNav({onSelect,active}:{onSelect:(target:FantasyTarget)=>void;active?:string}){
 return <nav className="floatingFantasyNav" aria-label="Charakterbereiche">{items.map(([label,target,left])=><button key={label} aria-label={label} className={active===label?'active':''} onClick={()=>onSelect(target)}><span className="fantasyTileCrop" aria-hidden="true"><img src="/thartos-startseite.png" alt="" style={{'--crop-left':left} as React.CSSProperties}/></span></button>)}</nav>;
}
