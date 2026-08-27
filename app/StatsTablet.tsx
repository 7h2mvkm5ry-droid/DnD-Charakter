'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

type Values=Record<string,number>;
type Nav='Kampf'|'Inventar'|'Zauber'|'Übersicht'|'Notizen';
const defaults:Values={str:11,dex:14,con:16,int:13,wis:9,cha:15,ac:16,initiative:2,speed:10,hp:29,hpMax:29,tempHp:5,tempHpMax:5,spellDc:12,spellAttack:4,proficiency:2,passive:9};
const abilityMeta=[['str','Stärke','STR','✊','ember'],['dex','Geschicklichkeit','DEX','⚔','moss'],['con','Konstitution','CON','✥','ocean'],['int','Intelligenz','INT','▤','violet'],['wis','Weisheit','WIS','◉','umber'],['cha','Charisma','CHA','☀','gold']];
const saves=[['str','Stärke'],['dex','Geschicklichkeit'],['con','Konstitution'],['int','Intelligenz'],['wis','Weisheit'],['cha','Charisma']];
const skills=[['Akrobatik','Dex',2,false],['Tierhandlung','Wis',-1,false],['Arcana','Int',3,true],['Athletik','Str',2,true],['Motiv erkennen','Wis',1,false],['Überzeugen','Cha',4,true],['Täuschung','Cha',2,false],['Einschüchtern','Cha',2,false],['Wahrnehmung','Wis',-1,false],['Geschichte','Int',1,false],['Nachforschungen','Int',1,false],['Medizin','Wis',-1,false],['Naturkunde','Int',1,false],['Leistung','Cha',2,false],['Religion','Int',1,false],['Fingerfertigkeit','Dex',2,false],['Heimlichkeit','Dex',2,false]];
const mod=(score:number)=>Math.floor((score-10)/2);
const signed=(value:number)=>value>=0?`+${value}`:`${value}`;

export default function StatsTablet({onBack,onNavigate}:{onBack:()=>void;onNavigate:(tab:Nav)=>void}){
 const[values,setValues]=useState<Values>(defaults);const[edit,setEdit]=useState<{key:string;label:string}|null>(null);const[draft,setDraft]=useState(0);const tempTimer=useRef<ReturnType<typeof setTimeout>|null>(null);const tempLong=useRef(false);
 // Restore client-only game state after hydration; defaults remain the server-rendered fallback.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{const raw=localStorage.getItem('thartos-tablet-stats');if(raw){try{setValues({...defaults,...JSON.parse(raw)})}catch{}}},[]);
 const save=(next:Values)=>{setValues(next);localStorage.setItem('thartos-tablet-stats',JSON.stringify(next))};
 const open=(key:string,label:string)=>{setEdit({key,label});setDraft(values[key])};
 const confirm=()=>{if(edit){save(edit.key==='tempHp'?{...values,tempHp:Math.max(0,draft),tempHpMax:Math.max(0,draft)}:{...values,[edit.key]:draft});setEdit(null)}};
 const reduceTemp=()=>{if(values.tempHp>0)save({...values,tempHp:values.tempHp-1})};
 const startTempPress=()=>{tempLong.current=false;tempTimer.current=setTimeout(()=>{tempLong.current=true;open('tempHp','Temporäre Trefferpunkte')},650)};
 const endTempPress=()=>{if(tempTimer.current)clearTimeout(tempTimer.current);if(!tempLong.current)reduceTemp()};
 const hpPercent=useMemo(()=>Math.max(0,Math.min(100,values.hp/Math.max(1,values.hpMax)*100)),[values.hp,values.hpMax]);
 return <main className="tabletStats">
  <header className="rpgNav"><button onClick={onBack} aria-label="Zur Startseite">‹</button><NavButton active icon="♜" label="Stats"/><NavButton icon="⚔" label="Waffen" onClick={()=>onNavigate('Kampf')}/><NavButton icon="♨" label="Items" onClick={()=>onNavigate('Inventar')}/><NavButton icon="▤" label="Zauber" onClick={()=>onNavigate('Zauber')}/><NavButton icon="♞" label="Können" onClick={()=>onNavigate('Übersicht')}/><NavButton icon="▥" label="Story" onClick={()=>onNavigate('Notizen')}/><button aria-label="Einstellungen">⚙</button></header>
  <section className="tabletBody"><h1>THARTOS</h1><div className="titleRule"><span/>STATS<span/></div>
   <div className="abilityGrid">{abilityMeta.map(([key,label,,icon,tone])=><button className={`abilityCard ${tone}`} key={key} onClick={()=>open(key,label)}><span className="abilityIcon">{icon}</span><span className="abilityName">{label}</span><strong>{signed(mod(values[key]))}</strong><em>{values[key]}</em><small>Tippen zum Ändern</small><i>›</i></button>)}</div>
   <div className="combatStrip"><SmallStat icon="✥" label="Rüstungsklasse" value={values.ac} onClick={()=>open('ac','Rüstungsklasse')}/><SmallStat icon="ϟ" label="Initiative" value={signed(values.initiative)} onClick={()=>open('initiative','Initiative')}/><SmallStat icon="♟" label="Bewegung" value={values.speed} onClick={()=>open('speed','Bewegung')}/>
    <section className="hpPanel"><span className="heart">♥</span><div><label>Trefferpunkte</label><button onClick={()=>open('hpMax','Maximale Trefferpunkte')}><strong>{values.hp}</strong> / {values.hpMax}</button><div className="hpTrack"><i style={{width:`${hpPercent}%`}}/></div></div></section>
    <button className={`tempPanel ${values.tempHp===0?'empty':''}`} onPointerDown={startTempPress} onPointerUp={endTempPress} onPointerLeave={()=>tempTimer.current&&clearTimeout(tempTimer.current)} onContextMenu={e=>e.preventDefault()}><span>⌛</span><label>Temporäre TP</label><strong>{values.tempHp}</strong><small>{values.tempHp>0?'Tippen −1 · Halten ändern':'Halten zum Ändern'}</small></button>
   </div>
   <div className="hpSlider"><label htmlFor="hp-slider">Aktuelle Trefferpunkte</label><input id="hp-slider" type="range" min="0" max={values.hpMax} value={Math.min(values.hp,values.hpMax)} disabled={values.tempHp>0} onChange={e=>save({...values,hp:Number(e.target.value)})}/><output>{values.hp}</output><span>{values.tempHp>0?'Erst temporäre TP auf 0 reduzieren':'Regler freigeschaltet'}</span></div>
   <div className="magicStrip"><SmallStat icon="✧" label="Spell Save DC" value={values.spellDc} onClick={()=>open('spellDc','Spell Save DC')}/><SmallStat wide icon="†" label="Spell Attack Bonus" value={signed(values.spellAttack)} onClick={()=>open('spellAttack','Spell Attack Bonus')}/><SmallStat icon="✥" label="Übungsbonus" value={signed(values.proficiency)} onClick={()=>open('proficiency','Übungsbonus')}/><SmallStat icon="◉" label="Passive Wahrnehmung" value={values.passive} onClick={()=>open('passive','Passive Wahrnehmung')}/></div>
   <div className="lowerGrid"><section className="listPanel saves"><h2>Rettungswürfe</h2>{saves.map(([key,label])=><button key={key} onClick={()=>open(key,label)}><b>{key.toUpperCase()}</b><span>{label}</span><strong>{signed(key==='wis'||key==='cha'?mod(values[key])+2:mod(values[key]))}</strong><em>{key==='wis'||key==='cha'?'★':'○'}</em></button>)}<footer>★ geübt &nbsp;&nbsp; ○ nicht geübt</footer></section><section className="listPanel skillPanel"><h2>Fertigkeiten</h2><div>{skills.map(([name,ability,value,trained],index)=><button key={String(name)} onClick={()=>open(`skill${index}`,String(name))}><span>{name} <i>({ability})</i></span><strong>{signed(values[`skill${index}`]??Number(value))}</strong><em>{trained?'★':'○'}</em></button>)}</div></section></div>
  </section>
  {edit&&<div className="editorShade" role="presentation" onClick={()=>setEdit(null)}><section className="valueEditor" role="dialog" aria-modal="true" aria-label={`${edit.label} bearbeiten`} onClick={e=>e.stopPropagation()}><span>WERT BEARBEITEN</span><h2>{edit.label}</h2><div><button onClick={()=>setDraft(draft-1)} aria-label="Wert verringern">−</button><strong>{signed(draft)}</strong><button onClick={()=>setDraft(draft+1)} aria-label="Wert erhöhen">+</button></div><button className="confirmValue" onClick={confirm}>✓ Speichern</button></section></div>}
 </main>
}
function NavButton({icon,label,active=false,onClick}:{icon:string;label:string;active?:boolean;onClick?:()=>void}){return <button className={active?'active':''} onClick={onClick}><span>{icon}</span>{label}</button>}
function SmallStat({icon,label,value,onClick,wide=false}:{icon:string;label:string;value:string|number;onClick:()=>void;wide?:boolean}){return <button className={`smallStat ${wide?'wide':''}`} onClick={onClick}><span>{icon}</span><label>{label}</label><strong>{value}</strong><i>›</i></button>}
