'use client';

import { useEffect, useState } from 'react';
import FantasyNav, { FantasyTarget } from './FantasyNav';
import './weapons-tablet.css';
import './unified-fantasy-nav.css';

const notes = [
  { id: 'old-sword', title: 'Silberschwert', lines: ['1W8 +0 · Aktionsbonus +2', '+1 auf Trefferwürfe', '+1 auf Charismawürfe bei Oberschicht'] },
  { id: 'silver', title: 'Sebrus altes Langschwert', lines: ['1W8 +0 · Aktionsbonus +2'] },
  { id: 'bracelet', title: 'Wabernder Armreif', lines: ['Bonusaktion · 1/Tag', 'Im Schatten einer Person im Umkreis', 'von 30 m auftauchen'] },
  { id: 'ring', title: 'Ring', lines: ['Fluch: Jeder 4. Treffer misslingt', 'automatisch. Er kann nicht', 'ausgelassen werden.'] },
  { id: 'spears', title: '5 Speere', lines: ['1W6 bei Wurf · 1W8 bei Stoß', 'Aktionsbonus +4'] },
  { id: 'armor', title: 'Kettenrüstung', lines: ['Starker Schutz und', 'gute Beweglichkeit'] },
  { id: 'stone', title: 'Heiliger Stein', lines: ['Stärkt seinen Glauben und hilft', 'beim Zauberwirken', 'Inschrift unbekannt'] },
];

export default function WeaponsTablet({onBack,onNavigate}:{onBack:()=>void;onNavigate:(target:FantasyTarget)=>void}) {
  const [sessionNote,setSessionNote]=useState('');
  const [saved,setSaved]=useState(false);
  useEffect(()=>{setSessionNote(localStorage.getItem('thartos-session-note')||'')},[]);
  const saveSessionNote=()=>{localStorage.setItem('thartos-session-note',sessionNote);setSaved(true);window.setTimeout(()=>setSaved(false),1800)};
  return <main className="weaponsPage">
    <img className="weaponsArt" src="/thartos-waffen.png" alt="Thartos in Kettenrüstung mit zwei Schwertern, Speeren, Ring, Armreif und heiligem Stein" />
    <div className="weaponsShade" aria-hidden="true" />
    <header className="weaponsNav"><button className="statsBack" onClick={onBack} aria-label="Zur Startseite">‹</button><FantasyNav active="Waffen" onSelect={onNavigate}/></header>
    <h1 className="weaponsTitle">THARTOS <span>· WAFFEN &amp; RÜSTUNG ·</span></h1>
    <section className="weaponAnnotations" aria-label="Waffen und Ausrüstung">
      {notes.map(note=><article className={`weaponNote ${note.id}`} key={note.id}><h2>{note.title}</h2>{note.lines.map(line=><p key={line}>{line}</p>)}</article>)}
    </section>
    <section className="sessionParchment" aria-label="Notiz für diese Session">
      <h2>Diese Session</h2>
      <textarea value={sessionNote} onChange={event=>{setSessionNote(event.target.value);setSaved(false)}} placeholder="Was geschieht in dieser Session?" aria-label="Session-Notiz" />
      <button onClick={saveSessionNote}>{saved?'✓ Gespeichert':'Notiz speichern'}</button>
    </section>
  </main>;
}
