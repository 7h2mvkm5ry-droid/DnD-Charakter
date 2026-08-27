import './fantasy-nav.css';
import './scattered-nav-arrow.css';

export type FantasyTarget='Stats'|'Kampf'|'Inventar'|'Zauber'|'Übersicht'|'Notizen';
const items:[string,FantasyTarget][]=[['Stats','Stats'],['Waffen','Kampf'],['Items','Inventar'],['Zauber','Zauber'],['Können','Übersicht'],['Story','Notizen']];

export default function FantasyNav({onSelect,active}:{onSelect:(target:FantasyTarget)=>void;active?:string}){
 return <nav className="floatingFantasyNav" aria-label="Charakterbereiche">{items.map(([label,target],index)=><button key={label} aria-label={label} className={active===label?'active':''} onClick={()=>onSelect(target)}><span className="fantasyTileCrop" aria-hidden="true"><img src="/thartos-startseite.png" alt="" style={{'--tile':index} as React.CSSProperties}/></span></button>)}</nav>;
}
