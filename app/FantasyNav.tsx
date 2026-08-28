import './fantasy-nav.css';
import './scattered-nav-arrow.css';

export type FantasyTarget='Stats'|'Waffen'|'Kampf'|'Inventar'|'Zauber'|'Übersicht'|'Notizen';
const items:[string,FantasyTarget,string][]=[['Stats','Stats','stats'],['Waffen','Waffen','waffen'],['Items','Inventar','items'],['Zauber','Zauber','zauber'],['Können','Übersicht','koennen'],['Story','Notizen','story']];

export default function FantasyNav({onSelect,active}:{onSelect:(target:FantasyTarget)=>void;active?:string}){
 return <nav className="floatingFantasyNav" aria-label="Charakterbereiche">{items.map(([label,target,file])=><button key={label} aria-label={label} className={active===label?'active':''} onClick={()=>onSelect(target)}><img src={`/nav/${file}.png`} alt="" aria-hidden="true"/></button>)}</nav>;
}
