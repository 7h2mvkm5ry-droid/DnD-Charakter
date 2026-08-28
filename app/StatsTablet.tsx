'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import './unified-fantasy-nav.css';
import FantasyNav from './FantasyNav';

type Values=Record<string,number>;
type Nav='Waffen'|'Kampf'|'Inventar'|'Zauber'|'Übersicht'|'Notizen';
const defaults:Values={str:11,dex:14,con:16,int:13,wis:9,cha:15,ac:16,initiative:2,speed:10,hp:29,hpMax:29,tempHp:5,tempHpMax:5,spellDc:12,spellAttack:4,proficiency:2,passive:9};
const abilityMeta=[['str','Stärke','STR','str','ember'],['dex','Geschicklichkeit','DEX','dex','moss'],['con','Konstitution','CON','constitution','ocean'],['int','Intelligenz','INT','int','violet'],['wis','Weisheit','WIS','wis','umber'],['cha','Charisma','CHA','cha','gold']];
const saves=[['str','Stärke'],['dex','Geschicklichkeit'],['con','Konstitution'],['int','Intelligenz'],['wis','Weisheit'],['cha','Charisma']];
const skills=[['Acrobatics','Dex',2,false],['Animal Handling','Wis',-1,false],['Arcana','Int',3,true],['Athletics','Str',2,true],['Deception','Cha',2,false],['History','Int',1,false],['Insight','Wis',1,true],['Intimidation','Cha',2,false],['Investigation','Int',1,false],['Medicine','Wis',-1,false],['Nature','Int',1,false],['Perception','Wis',-1,false],['Performance','Cha',2,false],['Persuasion','Cha',4,true],['Religion','Int',1,false],['Sleight of Hand','Dex',2,false],['Stealth','Dex',2,false],['Survival','Wis',-1,false]];
const mod=(score:number)=>Math.floor((score-10)/2);
const signed=(value:number)=>value>=0?`+${value}`:`${value}`;

export default function StatsTablet({onBack,onNavigate}:{onBack:()=>void;onNavigate:(tab:Nav)=>void}){
 const[values,setValues]=useState<Values>(defaults);const[edit,setEdit]=useState<{key:string;label:string}|null>(null);const[draft,setDraft]=useState(0);const tempTimer=useRef<ReturnType<typeof setTimeout>|null>(null);const tempLong=useRef(false);
 // Restore client-only game state after hydration; defaults remain the server-rendered fallback.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{const raw=localStorage.getItem('thartos-tablet-stats');if(raw){try{setValues({...defaults,...JSON.parse(raw)})}catch{}}},[]);
 const save=(next:Values)=>{setValues(next);localStorage.setItem('thartos-tablet-stats',JSON.stringify(next))};
 const open=(key:string,label:string,fallback?:number)=>{setEdit({key,label});setDraft(values[key]??fallback??0)};
 const confirm=()=>{if(edit){const next=edit.key==='tempHp'?{...values,tempHp:Math.max(0,draft),tempHpMax:Math.max(0,draft)}:edit.key==='hp'?{...values,hp:Math.max(0,Math.min(values.hpMax,draft))}:{...values,[edit.key]:draft};save(next);setEdit(null)}};
 const reduceTemp=()=>{if(values.tempHp>0)save({...values,tempHp:values.tempHp-1})};
 const startTempPress=()=>{tempLong.current=false;tempTimer.current=setTimeout(()=>{tempLong.current=true;open('tempHp','Temporäre Trefferpunkte')},650)};
 const endTempPress=()=>{if(tempTimer.current)clearTimeout(tempTimer.current);if(!tempLong.current)reduceTemp()};
 const hpPercent=useMemo(()=>Math.max(0,Math.min(100,values.hp/Math.max(1,values.hpMax)*100)),[values.hp,values.hpMax]);
 return <main className="tabletStats">
  <header className="statsFantasyNav"><button className="statsBack" onClick={onBack} aria-label="Zur Startseite">‹</button><FantasyNav active="Stats" onSelect={(target)=>{if(target==='Stats')return;onNavigate(target)}}/></header>
  <section className="tabletBody"><h1>THARTOS</h1><div className="titleRule"><span/>STATS<span/></div>
   <div className="abilityGrid">{abilityMeta.map(([key,label,,icon,tone])=><button className={`abilityCard ${tone}`} key={key} onClick={()=>open(key,label)}><img className="abilityIcon" src={`/stats-icons/${icon}.png`} alt=""/><span className="abilityName">{label}</span><strong>{values[key]}</strong><em>{signed(mod(values[key]))}</em><i>›</i></button>)}</div>
   <div className="combatStrip"><SmallStat primary icon="" label="Rüstungsklasse" value={values.ac} onClick={()=>open('ac','Rüstungsklasse')}/><SmallStat primary icon="" label="Initiative" value={signed(values.initiative)} onClick={()=>open('initiative','Initiative')}/><SmallStat primary icon="" label="Bewegung" value={values.speed} onClick={()=>open('speed','Bewegung')}/>
    <button className="hpPanel" onClick={()=>open('hp','Aktuelle Trefferpunkte')} aria-label="Aktuelle Trefferpunkte ändern"><span className="hpContent"><span className="hpLabel">Trefferpunkte</span><span className="hpValue"><strong>{values.hp}</strong> <span>/ {values.hpMax}</span></span><span className="hpTrack"><i style={{width:`${hpPercent}%`}}/></span></span></button>
    <button className={`tempPanel ${values.tempHp===0?'empty':''}`} onPointerDown={startTempPress} onPointerUp={endTempPress} onPointerLeave={()=>tempTimer.current&&clearTimeout(tempTimer.current)} onContextMenu={e=>e.preventDefault()}><label>Temp. Trefferpunkte</label><strong>{values.tempHp}</strong><small>{values.tempHp>0?'Tippen −1 · Halten ändern':'Halten zum Ändern'}</small></button>
   </div>
   <div className="hpSlider"><label htmlFor="hp-slider">Aktuelle Trefferpunkte</label><input id="hp-slider" type="range" min="0" max={values.hpMax} value={Math.min(values.hp,values.hpMax)} disabled={values.tempHp>0} onChange={e=>save({...values,hp:Number(e.target.value)})}/><output>{values.hp}</output><span>{values.tempHp>0?'Erst temporäre TP auf 0 reduzieren':'Regler freigeschaltet'}</span></div>
   <div className="magicStrip"><SmallStat icon="✧" label="Spell Save DC" value={values.spellDc} onClick={()=>open('spellDc','Spell Save DC')}/><SmallStat wide icon="†" label="Spell Attack Bonus" value={signed(values.spellAttack)} onClick={()=>open('spellAttack','Spell Attack Bonus')}/><SmallStat icon="✥" label="Übungsbonus" value={signed(values.proficiency)} onClick={()=>open('proficiency','Übungsbonus')}/><SmallStat icon="◉" label="Passive Wahrnehmung" value={values.passive} onClick={()=>open('passive','Passive Wahrnehmung')}/></div>
   <div className="lowerGrid"><section className="listPanel saves"><h2>Rettungswürfe</h2>{saves.map(([key,label])=><button key={key} onClick={()=>open(key,label)}><b>{key.toUpperCase()}</b><span>{label}</span><strong>{signed(key==='wis'||key==='cha'?mod(values[key])+2:mod(values[key]))}</strong><em>{key==='wis'||key==='cha'?'★':'○'}</em></button>)}<footer>★ geübt &nbsp;&nbsp; ○ nicht geübt</footer></section><section className="listPanel skillPanel"><h2>Fertigkeiten</h2><div>{skills.map(([name,,value,trained],index)=><button key={String(name)} onClick={()=>open(`skill${index}`,String(name),Number(value))}><span>{name}</span><strong>{signed(values[`skill${index}`]??Number(value))}</strong><em>{trained?'★':'○'}</em></button>)}</div></section></div>
   <button className="statsCombatLaunch" onClick={()=>onNavigate('Kampf')}><span>KAMPF</span><i aria-hidden="true">↓</i></button>
  </section>
  {edit&&<div className="editorShade" role="presentation" onClick={()=>setEdit(null)}><section className="valueEditor" role="dialog" aria-modal="true" aria-label={`${edit.label} bearbeiten`} onClick={e=>e.stopPropagation()}><span>WERT BEARBEITEN</span><h2>{edit.label}</h2><div><button onClick={()=>setDraft(draft-1)} aria-label="Wert verringern">−</button><strong>{signed(draft)}</strong><button onClick={()=>setDraft(draft+1)} aria-label="Wert erhöhen">+</button></div><button className="confirmValue" onClick={confirm}>✓ Speichern</button></section></div>}
 </main>
}
function SmallStat({icon,label,value,onClick,wide=false,primary=false}:{icon:string;label:string;value:string|number;onClick:()=>void;wide?:boolean;primary?:boolean}){return <button className={`smallStat ${wide?'wide':''} ${primary?'primaryCombatStat':''}`} onClick={onClick}>{icon&&<span>{icon}</span>}<label className={label==='Rüstungsklasse'?'noWrap':''}>{label}</label><strong>{value}</strong><i>›</i></button>}
