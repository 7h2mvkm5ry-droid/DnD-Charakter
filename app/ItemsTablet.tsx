'use client';

import { useEffect, useState } from 'react';
import FantasyNav, { FantasyTarget } from './FantasyNav';
import './items-tablet.css';
import './unified-fantasy-nav.css';

type ItemValues=Record<string,number>;
const defaults:ItemValues={torches:10,days:13,liters:2,rope:15,potions:2,drops:5,dropMinutes:30,healing:4,healingDie:8,luckStone:1};
const counters=[
  ['torches','Fackeln','torches'],['days','Tage Proviant','days'],['liters','Liter Wasser','liters'],['rope','Meter Hanfseil','rope'],['potions','Tränke','potions'],
  ['drops','Nachtsichttropfen','drops'],['dropMinutes','Minuten Nachtsicht','drop-minutes'],['healing','Heiltränke','healing'],['healingDie','Heilwürfel W','healing-die'],['luckStone','Glücksstein','luck-stone'],
] as const;

export default function ItemsTablet({onBack,onNavigate}:{onBack:()=>void;onNavigate:(target:FantasyTarget)=>void}){
  const[values,setValues]=useState<ItemValues>(defaults);const[editing,setEditing]=useState<{key:string;label:string}|null>(null);const[draft,setDraft]=useState(0);
  const[session,setSession]=useState('');const[noteSaved,setNoteSaved]=useState(false);
  useEffect(()=>{try{setValues({...defaults,...JSON.parse(localStorage.getItem('thartos-items-values')||'{}')})}catch{}setSession(localStorage.getItem('thartos-items-session')||'')},[]);
  const open=(key:string,label:string)=>{setEditing({key,label});setDraft(values[key])};
  const saveValue=()=>{if(!editing)return;const next={...values,[editing.key]:Math.max(0,draft)};setValues(next);localStorage.setItem('thartos-items-values',JSON.stringify(next));setEditing(null)};
  const saveNote=()=>{localStorage.setItem('thartos-items-session',session);setNoteSaved(true);window.setTimeout(()=>setNoteSaved(false),1800)};
  return <main className="itemsPage">
    <div className="itemsBackdrop" aria-hidden="true"/>
    <div className="itemsCanvas">
      <img src="/thartos-items.png" alt="Thartos mit seinem Explorer's Pack und seiner Ausrüstung"/>
      {counters.map(([key,label,position])=><button key={key} className={`itemNumber ${position}`} onClick={()=>open(key,label)} aria-label={`${label}: ${values[key]}. Ändern`}>{values[key]}</button>)}
      <section className="itemsSession" aria-label="Notiz für diese Session"><h2>Diese Session</h2><textarea value={session} onChange={event=>{setSession(event.target.value);setNoteSaved(false)}} aria-label="Session-Notiz"/><button onClick={saveNote}>{noteSaved?'✓ Gespeichert':'Notiz speichern'}</button></section>
    </div>
    <header className="itemsNav"><button className="statsBack" onClick={onBack} aria-label="Zur Startseite">‹</button><FantasyNav active="Items" onSelect={onNavigate}/></header>
    {editing&&<div className="itemEditorShade" onClick={()=>setEditing(null)}><section className="itemEditor" role="dialog" aria-modal="true" aria-label={`${editing.label} bearbeiten`} onClick={event=>event.stopPropagation()}><span>MENGE BEARBEITEN</span><h2>{editing.label}</h2><div><button onClick={()=>setDraft(Math.max(0,draft-1))} aria-label="Verringern">−</button><strong>{draft}</strong><button onClick={()=>setDraft(draft+1)} aria-label="Erhöhen">+</button></div><button className="saveItemValue" onClick={saveValue}>✓ Speichern</button></section></div>}
  </main>;
}
