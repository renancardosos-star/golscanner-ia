"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Brain, CalendarDays, Crown, Flame, History, LayoutDashboard, ListPlus, Lock, Plus, Rocket, ShieldCheck, Sparkles, Star, Target, Trophy, Wallet, Zap } from "lucide-react";
import { grafico, historicoInicial, jogosRanking } from "@/lib/mock";

type Aba = "ranking" | "manual" | "historico" | "adm";
type BilheteManual = { id: number; jogo: string; mercado: string; odd: number };

const mercados = ["Mais de 0.5 gols", "Mais de 1.5 gols", "Mais de 2.5 gols", "Ambas marcam"];
const ligas = ["Todas", "Liga Portugal", "Bundesliga", "Brasil Série A", "Eredivisie", "Serie A"];

export default function Home() {
  const [aba, setAba] = useState<Aba>("ranking");
  const [stake, setStake] = useState(100);
  const [liga, setLiga] = useState("Todas");
  const [notaMinima, setNotaMinima] = useState(8.5);
  const [bilheteManual, setBilheteManual] = useState<BilheteManual[]>([]);
  const [historico, setHistorico] = useState(historicoInicial);
  const [novoJogo, setNovoJogo] = useState("Corinthians x Palmeiras");
  const [novoMercado, setNovoMercado] = useState("Mais de 0.5 gols");
  const [novaOdd, setNovaOdd] = useState(1.1);

  const jogos = useMemo(() => jogosRanking.filter((j) => (liga === "Todas" || j.liga === liga) && j.nota >= notaMinima), [liga, notaMinima]);
  const multiplaIA = jogos.slice(0, 5);
  const oddIA = multiplaIA.reduce((acc, j) => acc * j.odd, 1);
  const mediaIA = multiplaIA.length ? multiplaIA.reduce((acc, j) => acc + j.nota, 0) / multiplaIA.length : 0;
  const oddManual = bilheteManual.reduce((acc, item) => acc * item.odd, 1);
  const lucroPeriodo = Math.round(grafico[grafico.length - 1].lucro * (stake / 100));
  const graficoStake = grafico.map((g) => ({ ...g, lucro: Math.round(g.lucro * (stake / 100)) }));

  function salvarIA() {
    setHistorico((atual) => [{ id: Date.now(), tipo: "IA", nome: "Múltipla IA — Top 5 do ranking", data: "Hoje", jogos: multiplaIA.length, odd: Number(oddIA.toFixed(2)), stake, status: "Em andamento", lucro: 0 }, ...atual]);
    setAba("historico");
  }
  function adicionarManual() {
    if (!novoJogo || !novaOdd) return;
    setBilheteManual((atual) => [...atual, { id: Date.now(), jogo: novoJogo, mercado: novoMercado, odd: Number(novaOdd) }]);
  }
  function salvarManual() {
    if (!bilheteManual.length) return;
    setHistorico((atual) => [{ id: Date.now(), tipo: "Manual", nome: "Bilhete manual criado por Renan", data: "Hoje", jogos: bilheteManual.length, odd: Number(oddManual.toFixed(2)), stake, status: "Em andamento", lucro: 0 }, ...atual]);
    setBilheteManual([]);
    setAba("historico");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute right-0 top-20 h-[32rem] w-[32rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />
      </div>

      <div className="relative mx-auto max-w-[1360px] px-3 py-4 sm:px-4 lg:px-6 text-[0.92rem]">
        <header className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-emerald-300/30 bg-emerald-300/10 shadow-[0_0_45px_rgba(52,211,153,.25)]"><span className="text-2xl">⚽</span></div>
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200"><Sparkles className="h-3 w-3" /> IA + Estatística para mercados de gols</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-4xl">GolScanner <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">IA</span></h1>
              </div>
              <div className="hidden h-12 w-px bg-white/10 md:block" />
              <div className="rounded-2xl border border-emerald-300/20 bg-slate-950/50 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">by</p>
                <p className="text-sm font-black uppercase tracking-[0.2em]"><span>Renan</span> <span className="text-emerald-300">Cardoso</span></p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-1.5">
              <Tab id="ranking" aba={aba} setAba={setAba} icon={<LayoutDashboard className="h-4 w-4" />} label="Ranking" />
              <Tab id="manual" aba={aba} setAba={setAba} icon={<ListPlus className="h-4 w-4" />} label="Bilhete manual" />
              <Tab id="historico" aba={aba} setAba={setAba} icon={<History className="h-4 w-4" />} label="Histórico" />
              <Tab id="adm" aba={aba} setAba={setAba} icon={<Lock className="h-4 w-4" />} label="ADM" />
            </nav>
          </div>
        </header>

        <section className="mt-4 grid gap-3 xl:grid-cols-[1.25fr_0.75fr]">
          <Panel className="p-4">
            <div className="grid gap-2 md:grid-cols-4">
              <div>
                <Label icon={<CalendarDays className="h-4 w-4" />}>Data</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Hoje','Amanhã','+2 dias'].map((d, i) => <button key={d} className={`h-10 rounded-xl text-sm font-black ${i === 0 ? 'bg-sky-400 text-slate-950' : 'bg-slate-950/70 text-slate-300 hover:bg-white/10'}`}>{d}</button>)}
                </div>
              </div>
              <div>
                <Label icon={<Trophy className="h-4 w-4" />}>Liga</Label>
                <select value={liga} onChange={(e) => setLiga(e.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 text-sm font-bold outline-none focus:border-emerald-300">{ligas.map((l) => <option key={l}>{l}</option>)}</select>
              </div>
              <div>
                <Label icon={<Star className="h-4 w-4" />}>Nota mínima</Label>
                <div className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-4"><input type="range" min="8" max="9.5" step="0.1" value={notaMinima} onChange={(e) => setNotaMinima(Number(e.target.value))} className="w-full accent-emerald-400" /><span className="rounded-xl bg-emerald-400 px-3 py-1 text-sm font-black text-slate-950">{notaMinima.toFixed(1)}</span></div>
              </div>
              <button onClick={salvarIA} className="h-10 self-end rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 px-5 font-black text-slate-950 shadow-[0_0_40px_rgba(52,211,153,.25)] hover:scale-[1.02]">Salvar IA</button>
            </div>
          </Panel>
          <Panel className="bg-gradient-to-br from-emerald-400/15 via-sky-400/10 to-violet-500/15 p-4">
            <div className="flex items-center justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200"><ShieldCheck className="h-4 w-4" /> Múltipla segura</p><p className="mt-2 text-2xl font-black">{mediaIA.toFixed(1)} <span className="text-sm text-slate-300">confiança</span></p></div><div className="rounded-3xl bg-slate-950/60 p-4 text-right"><p className="text-xs text-slate-400">Odd IA</p><p className="text-2xl font-black text-emerald-300">{oddIA.toFixed(2)}</p></div></div>
          </Panel>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_1fr]">
          <div>
            {aba === "ranking" && <Ranking jogos={jogos} salvarIA={salvarIA} />}
            {aba === "manual" && <Manual bilheteManual={bilheteManual} novoJogo={novoJogo} setNovoJogo={setNovoJogo} novoMercado={novoMercado} setNovoMercado={setNovoMercado} novaOdd={novaOdd} setNovaOdd={setNovaOdd} adicionar={adicionarManual} salvar={salvarManual} oddManual={oddManual} stake={stake} />}
            {aba === "historico" && <Historico historico={historico} />}
            {aba === "adm" && <Adm stake={stake} setStake={setStake} lucroPeriodo={lucroPeriodo} graficoStake={graficoStake} />}
          </div>
          <aside className="space-y-4">
            <Panel className="bg-gradient-to-br from-emerald-300/15 to-sky-500/10 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-black"><ShieldCheck className="text-emerald-300" /> Múltipla IA</h3>
              <div className="mb-4 grid grid-cols-2 gap-3"><Mini label="Confiança" value={mediaIA.toFixed(1)} /><Mini label="Odd" value={oddIA.toFixed(2)} /></div>
              <div className="space-y-2">{multiplaIA.map((j) => <div key={j.id} className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-3 py-2 text-sm"><span className="truncate font-bold">{j.jogo}</span><span className="text-emerald-300">{j.nota}</span></div>)}</div>
              <button onClick={salvarIA} className="mt-4 w-full rounded-2xl bg-white px-5 py-4 font-black text-slate-950"><Zap className="mr-2 inline h-4 w-4" />Salvar histórico</button>
            </Panel>
            <Panel className="p-4"><h3 className="mb-3 flex items-center gap-2 text-xl font-black"><Brain className="text-violet-300" /> Resumo da IA</h3><p className="text-xs leading-5 text-slate-300">O ranking encontrou jogos com boa tendência para gols. A múltipla prioriza mercados conservadores, nota alta e baixo risco de 0x0.</p></Panel>
            <Panel className="p-4"><h3 className="mb-4 flex items-center gap-2 text-xl font-black"><Target className="text-sky-300" /> Mercados liberados</h3><div className="space-y-3">{mercados.map((m, i) => <div key={m} className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3"><span className="font-bold">{m}</span><Badge tone={i < 2 ? 'green' : 'amber'}>{i < 2 ? 'Ativo' : 'Cautela'}</Badge></div>)}</div></Panel>
            <Panel className="bg-violet-300/10 p-4"><h3 className="mb-4 flex items-center gap-2 text-xl font-black"><Wallet className="text-violet-300" /> Histórico ADM</h3><Stake stake={stake} setStake={setStake} /><div className="mt-4 grid grid-cols-2 gap-3"><Mini label="Acerto" value="73%" /><Mini label="Lucro" value={`R$${lucroPeriodo}`} /></div><div className="mt-4 h-40 rounded-3xl border border-white/10 bg-slate-950/60 p-3"><ResponsiveContainer width="100%" height="100%"><AreaChart data={graficoStake}><Area type="monotone" dataKey="lucro" stroke="#a78bfa" fill="#7c3aed" fillOpacity={0.25} strokeWidth={3} /><Tooltip contentStyle={{ background: '#020617', border: '1px solid #334155', borderRadius: 14, color: '#fff' }} /></AreaChart></ResponsiveContainer></div></Panel>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Ranking({ jogos, salvarIA }: { jogos: typeof jogosRanking; salvarIA: () => void }) {
  return <Panel className="p-3">
    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-black"><Flame className="h-5 w-5 text-orange-300" /> Ranking de Gols — Hoje</h2>
        <p className="mt-0.5 text-xs text-slate-400">Versão compacta: top jogos com nota acima de 8.5.</p>
      </div>
      <button onClick={salvarIA} className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-2 text-sm font-black text-slate-950">
        <Rocket className="mr-1 inline h-3.5 w-3.5" />Gerar IA
      </button>
    </div>
    <div className="space-y-2">{jogos.map((j, idx) => <RankingCard key={j.id} jogo={j} index={idx} />)}</div>
  </Panel>;
}
function RankingCard({ jogo, index }: { jogo: (typeof jogosRanking)[number]; index: number }) {
  const grade = jogo.nota >= 9.3 ? 'from-emerald-300 to-lime-300' : jogo.nota >= 8.8 ? 'from-sky-300 to-cyan-300' : 'from-amber-300 to-orange-300';
  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-lg shadow-black/20 hover:border-emerald-300/40">
    <div className="grid items-stretch lg:grid-cols-[58px_1fr_145px_95px]">
      <div className={`flex items-center justify-between bg-gradient-to-br ${grade} px-3 py-2 text-slate-950 lg:flex-col lg:justify-center`}>
        <p className="text-[10px] font-black uppercase">#{index + 1}</p>
        <p className="text-2xl font-black leading-none">{jogo.nota}</p>
        <p className="text-[10px] font-black">Nota</p>
      </div>
      <div className="p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <Badge tone={jogo.nota >= 9.3 ? 'green' : jogo.nota >= 8.8 ? 'blue' : 'amber'}>{jogo.status}</Badge>
          <Badge>{jogo.liga}</Badge>
          <Badge>{jogo.horario}</Badge>
        </div>
        <h3 className="text-base font-black leading-tight">{jogo.jogo}</h3>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
          <Quick label="Casa O0.5" value={jogo.casa05} />
          <Quick label="H2H" value={jogo.h2h} />
          <Quick label="Média" value={String(jogo.media)} />
        </div>
      </div>
      <div className="border-t border-white/10 p-3 lg:border-l lg:border-t-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Mercado</p>
        <p className="mt-1 text-sm font-black leading-tight text-emerald-300">{jogo.mercado}</p>
        <p className="mt-2 text-[10px] text-slate-500">Risco: <b className="text-white">{jogo.nota >= 9 ? 'Baixo' : 'Médio'}</b></p>
      </div>
      <div className="flex flex-col justify-between gap-2 border-t border-white/10 p-3 lg:border-l lg:border-t-0">
        <div className="rounded-xl bg-white/5 p-2 text-center">
          <p className="text-[10px] text-slate-400">Odd</p>
          <p className="text-xl font-black leading-none">{jogo.odd.toFixed(2)}</p>
        </div>
        <button className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-2 py-2 text-xs font-black text-emerald-200">+ Add</button>
      </div>
    </div>
  </div>;
}
function Manual(p: any) { return <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"><Panel className="p-4"><h2 className="flex items-center gap-2 text-2xl font-black"><ListPlus className="text-emerald-300" /> Bilhete manual</h2><p className="mt-2 text-sm text-slate-400">Crie um bilhete independente da IA.</p><div className="mt-6 space-y-4"><Input label="Jogo" value={p.novoJogo} setValue={p.setNovoJogo} /><div><Label icon={<Target className="h-4 w-4" />}>Mercado</Label><select value={p.novoMercado} onChange={(e) => p.setNovoMercado(e.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 font-bold outline-none">{mercados.map((m) => <option key={m}>{m}</option>)}</select></div><Input label="Odd" value={p.novaOdd} setValue={p.setNovaOdd} type="number" /><button onClick={p.adicionar} className="w-full rounded-xl bg-emerald-400 px-5 py-4 font-black text-slate-950"><Plus className="mr-2 inline h-5 w-5" />Adicionar seleção</button></div></Panel><Panel className="p-4"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-2xl font-black">Meu bilhete</h3><p className="text-sm text-slate-400">Seleções manuais.</p></div><div className="rounded-3xl bg-slate-950/70 px-5 py-3 text-right"><p className="text-xs text-slate-400">Odd total</p><p className="text-2xl font-black text-emerald-300">{p.oddManual ? p.oddManual.toFixed(2) : '0.00'}</p></div></div><div className="space-y-3">{p.bilheteManual.length === 0 && <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-8 text-center text-slate-400">Nenhuma seleção adicionada.</div>}{p.bilheteManual.map((item: BilheteManual, idx: number) => <div key={item.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/60 p-4"><div><p className="font-black">{idx + 1}. {item.jogo}</p><p className="text-sm text-slate-400">{item.mercado}</p></div><p className="text-2xl font-black">{item.odd.toFixed(2)}</p></div>)}</div><div className="mt-5 grid grid-cols-2 gap-3"><Mini label="Stake" value={`R$${p.stake}`} /><Mini label="Tipo" value="Manual" /></div><button onClick={p.salvar} className="mt-4 w-full rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 px-5 py-4 font-black text-white">Salvar no histórico</button></Panel></section>; }
function Historico({ historico }: { historico: typeof historicoInicial }) { return <Panel className="p-4"><h2 className="mb-5 flex items-center gap-2 text-2xl font-black"><History className="text-violet-300" /> Histórico de bilhetes</h2><div className="space-y-3">{historico.map((item) => <div key={item.id} className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 md:grid-cols-[1fr_100px_100px_140px] md:items-center"><div><div className="mb-2 flex gap-2"><Badge tone={item.tipo === 'IA' ? 'green' : 'blue'}>{item.tipo}</Badge><Badge>{item.data}</Badge></div><p className="text-lg font-black">{item.nome}</p><p className="text-sm text-slate-400">{item.jogos} jogos</p></div><Mini label="Odd" value={item.odd.toFixed(2)} compact /><Mini label="Stake" value={`R$${item.stake}`} compact /><span className={`rounded-xl px-3 py-2 text-center font-black ${item.status === 'Green' ? 'bg-emerald-400/15 text-emerald-300' : item.status === 'Red' ? 'bg-red-400/15 text-red-300' : 'bg-sky-400/15 text-sky-300'}`}>{item.status}</span></div>)}</div></Panel>; }
function Adm({ stake, setStake, lucroPeriodo, graficoStake }: any) { return <Panel className="p-4"><h2 className="mb-5 flex items-center gap-2 text-2xl font-black"><Crown className="text-amber-300" /> Painel ADM</h2><div className="mb-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"><Stake stake={stake} setStake={setStake} /><div className="grid grid-cols-2 gap-3 md:grid-cols-4"><Mini label="Acerto" value="73%" /><Mini label="Lucro" value={`R$${lucroPeriodo}`} /><Mini label="Melhor liga" value="Bundesliga" /><Mini label="Mercado top" value="O0.5" /></div></div><div className="grid gap-4 lg:grid-cols-2"><Chart title="Lucro acumulado"><ResponsiveContainer width="100%" height="100%"><AreaChart data={graficoStake}><CartesianGrid strokeDasharray="3 3" opacity={0.15}/><XAxis dataKey="periodo" tick={{ fill: '#94a3b8', fontSize: 11 }}/><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}/><Tooltip contentStyle={{background:'#020617',border:'1px solid #334155',borderRadius:14,color:'#fff'}}/><Area type="monotone" dataKey="lucro" stroke="#a78bfa" fill="#7c3aed" fillOpacity={0.28} strokeWidth={3}/></AreaChart></ResponsiveContainer></Chart><Chart title="Greens x Reds"><ResponsiveContainer width="100%" height="100%"><BarChart data={grafico}><CartesianGrid strokeDasharray="3 3" opacity={0.15}/><XAxis dataKey="periodo" tick={{ fill: '#94a3b8', fontSize: 11 }}/><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}/><Tooltip contentStyle={{background:'#020617',border:'1px solid #334155',borderRadius:14,color:'#fff'}}/><Bar dataKey="greens" fill="#22c55e" radius={[8,8,0,0]}/><Bar dataKey="reds" fill="#ef4444" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></Chart></div></Panel>; }
function Stake({ stake, setStake }: { stake: number; setStake: (v: number) => void }) { return <div className="rounded-[1.7rem] border border-emerald-300/20 bg-emerald-300/10 p-4"><div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Stake da múltipla</p><p className="text-sm text-slate-400">Altere o valor para simulação.</p></div><p className="rounded-2xl bg-slate-950/70 px-4 py-2 text-lg font-black text-emerald-300">R${stake}</p></div><input type="range" min="10" max="1000" step="10" value={stake} onChange={(e) => setStake(Number(e.target.value))} className="w-full accent-emerald-400" /></div>; }
function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <section className={`rounded-[1.5rem] border border-white/10 bg-white/[0.06] shadow-xl shadow-black/30 backdrop-blur-2xl ${className}`}>{children}</section>; }
function Tab({ id, aba, setAba, icon, label }: { id: Aba; aba: Aba; setAba: (a: Aba) => void; icon: React.ReactNode; label: string }) { return <button onClick={() => setAba(id)} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition ${aba === id ? 'bg-emerald-400 text-slate-950 shadow-[0_0_30px_rgba(52,211,153,.25)]' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>{icon}{label}</button>; }
function Label({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) { return <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{icon}{children}</label>; }
function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'green' | 'blue' | 'amber' }) { const cls = tone === 'green' ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200' : tone === 'blue' ? 'border-sky-300/30 bg-sky-300/10 text-sky-200' : tone === 'amber' ? 'border-amber-300/30 bg-amber-300/10 text-amber-200' : 'border-white/10 bg-white/5 text-slate-300'; return <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${cls}`}>{children}</span>; }
function Quick({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-0.5 text-sm font-black">{value}</p></div>; }
function Mini({ label, value, compact }: { label: string; value: string; compact?: boolean }) { return <div className={`rounded-xl border border-white/10 bg-slate-950/70 ${compact ? 'p-3' : 'p-4'}`}><p className="text-xs text-slate-400">{label}</p><p className="truncate text-lg font-black text-emerald-300">{value}</p></div>; }
function Input({ label, value, setValue, type = 'text' }: { label: string; value: any; setValue: (v: any) => void; type?: string }) { return <div><Label icon={<Target className="h-4 w-4" />}>{label}</Label><input type={type} value={value} onChange={(e) => setValue(type === 'number' ? Number(e.target.value) : e.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 font-bold outline-none focus:border-emerald-300" /></div>; }
function Chart({ title, children }: { title: string; children: React.ReactNode }) { return <div className="h-60 rounded-[1.7rem] border border-white/10 bg-slate-950/60 p-4"><p className="mb-3 font-black">{title}</p><div className="h-[175px]">{children}</div></div>; }
