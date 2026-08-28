'use client';

import { useState } from 'react';
import './landing-reference-tabs.css';
import './landing-overlay-nav.css';
import FantasyNav from './FantasyNav';

type Tab = 'Übersicht' | 'Waffen' | 'Kampf' | 'Zauber' | 'Inventar' | 'Notizen';

export default function LandingTablet({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [notice, setNotice] = useState('');
  const rest = (kind: 'short' | 'long') => {
    if (kind === 'long') {
      let data: Record<string, number> = {};
      try { data = JSON.parse(localStorage.getItem('thartos-tablet-stats') || '{}'); } catch {}
      const hpMax = data.hpMax ?? 29;
      const tempHpMax = data.tempHpMax ?? 5;
      localStorage.setItem('thartos-tablet-stats', JSON.stringify({ ...data, hpMax, hp: hpMax, tempHpMax, tempHp: tempHpMax }));
      setNotice(`Lange Rast: TP ${hpMax}/${hpMax}, temporäre TP ${tempHpMax}`);
    } else setNotice('Kurze Rast vorgemerkt – Regeln folgen später.');
    window.setTimeout(() => setNotice(''), 3200);
  };

  return <main className="tabletLanding">
    <img className="landingArt" src="/thartos-startseite.png" alt="Thartos und seine Gefährten kämpfen in einer lebhaften Stadt gegen Orks" />
    <div className="landingVeil" />
    <header className="landingNav">
      <FantasyNav onSelect={(target)=>onNavigate(target==='Stats'?'Übersicht':target)} />
    </header>
    <button className="storyArea" onClick={() => onNavigate('Notizen')} aria-label="Abenteuer und Story öffnen"><span>Abenteuer öffnen</span></button>
    <div className="combatPointer" aria-hidden="true"><img src="/kampf-pfeil.png" alt="" /></div>
    <section className="landingFooter" aria-label="Charakter und Rast">
      <div className="fightLaunch">
        <button className="portraitMedallion" onClick={() => onNavigate('Kampf')} aria-label="In den Kampf"><img src="/thartos-portrait.png" alt="Thartos" /><span aria-hidden="true">⚔</span></button>
      </div>
      <div className="landingIdentity">
        <h1>THARTOS</h1>
        <div className="identityFacts"><p><i>♙</i> Alter 22</p><p><i>♜</i> Mensch-Paladin</p><p><i>✥</i> Stufe 3</p></div>
        <div className="identityLore"><span>† &nbsp; Orden der stillen Wacht</span><span>✺ &nbsp; Gott der Dichtung „Adahr“</span></div>
      </div>
      <div className="restButtons">
        <button onClick={() => rest('short')}><i className="beerIcon" aria-hidden="true">🍺</i><span><b>Short Rest</b><small>Kurze Rast</small></span></button>
        <button className="longRest" onClick={() => rest('long')}><i className="moonIcon" aria-hidden="true">☾</i><span><b>Long Rest</b><small>TP vollständig auffüllen</small></span></button>
      </div>
    </section>
    {notice && <div className="restToast" role="status">✓ {notice}</div>}
  </main>;
}
