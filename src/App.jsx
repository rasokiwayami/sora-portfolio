import React, { useEffect, useRef, useState } from "react";

const floors = [
  { code: "1F", name: "ロビー", guide: '"ポートフォリオの入口です。制作物と制作過程は下の階に置いています。"' },
  { code: "B1", name: "制作物", guide: '"GitHubに置いている制作物を並べています。"' },
  { code: "B2", name: "制作過程", guide: '"作る流れを短いリプレイで見られます。"' },
  { code: "B3", name: "活動ログ", guide: '"記録を短く残していく階です。"' },
  { code: "B4", name: "保管庫", guide: '"学校や仕事に近い制作を、短い説明で並べています。"' },
  { code: "B5", name: "次の棚", guide: '"次に追加する展示のための棚です。"' },
];

const FLOOR_DISTANCE_M = 3.5;
const githubProfileUrl = "https://github.com/rasokiwayami";
const entranceTimeline = {
  openDoors: 280,
  boardLift: 1500,
  closeDoors: 2450,
  switchFloor: 3300,
  jolt: 4200,
  arrivalDing: 4420,
  openArrival: 4620,
  cleanup: 5350,
};

const statusLabels = {
  public: "GitHub",
  localDraft: "制作中",
  draft: "準備中",
  sketch: "下書き",
  summaryOnly: "概要",
  sanitizedDraft: "概要",
  practiced: "実践中",
  boundary: "未掲載",
  pr: "PR参加",
  localPatch: "ローカル検証",
};

function getStatusLabel(status) {
  return statusLabels[status] ?? status;
}

const lobbyRows = [
  ["所属", "横浜国立大学 1年"],
  ["GitHub", "@rasokiwayami"],
  ["このサイト", "制作ポートフォリオ"],
  ["展示室", "B1 - B5"],
];

const majorRepos = [
  {
    acc: "REPO · 01",
    type: "PORTFOLIO",
    title: "LP制作",
    desc:
      "このポートフォリオ自体。自己紹介、制作物、制作過程をどう見せるかを作りながら直しています。",
    status: "public",
    githubUrl: "https://github.com/rasokiwayami/sora-portfolio",
    chips: ["React", "Portfolio", "Design"],
    replay: true,
    feature: true,
  },
  {
    acc: "REPO · 02",
    type: "PDF TOOL",
    title: "openlongpdf-translator",
    desc:
      "長いPDFを読む・翻訳する作業を支えるためのツール。読みづらい資料を扱いやすくするために作りました。",
    status: "public",
    githubUrl: "https://github.com/rasokiwayami/openlongpdf-translator",
    chips: ["PDF", "Translation", "Reading"],
  },
  {
    acc: "REPO · 03",
    type: "WRITING TOOL",
    title: "proposal-forge",
    desc:
      "提案文の下書きを作る小さなツール。質で主役にするより、デプロイまで試した経験として置いています。",
    status: "public",
    githubUrl: "https://github.com/rasokiwayami/proposal-forge",
    chips: ["Writing", "Deploy", "Small Tool"],
  },
  {
    acc: "REPO · 04",
    type: "WORKFLOW",
    title: "unknowns-workflow",
    desc:
      "作る前に分からない点を切り出し、計画と見直しへつなぐためのワークフローです。READMEは今後整えます。",
    status: "public",
    githubUrl: "https://github.com/rasokiwayami/unknowns-workflow",
    chips: ["Workflow", "Review", "Planning"],
  },
  {
    acc: "REPO · 05",
    type: "CHROME EXTENSION",
    title: "Assignment Manager for YNU LMS",
    desc:
      "Lumosの制作物に、改善PRとして参加しました。既存のChrome拡張を読み、差分を小さくまとめる経験になりました。",
    status: "pr",
    githubUrl: "https://github.com/Lumos-Programming/Assignment-Manager-for-YNU-LMS",
    chips: ["Pull Request", "Chrome Extension", "YNU"],
  },
  {
    acc: "REPO · 06",
    type: "INPUT METHOD",
    title: "karukan",
    desc:
      "日本語入力システムの公開repoを読み、手元で入力まわりの修正を試した記録です。主制作としてではなく、RustとIMEまわりを読む練習として置いています。",
    status: "localPatch",
    chips: ["Rust", "IME", "Local Patch"],
  },
];

const overviewWorks = [
  {
    acc: "SUMMARY · 01",
    type: "DISCORD BOT",
    title: "discord-codex-reader",
    desc:
      "Discord上でAIに質問できるBot。チャンネルごとの文脈を使って返答し、長い返答の分割やPDF添付の読み取り、クラウド実行まで試しました。",
    status: "summaryOnly",
    chips: ["Discord", "Bot", "Cloud"],
  },
  {
    acc: "SUMMARY · 02",
    type: "LOCAL SYSTEM",
    title: "Jinsei",
    desc:
      "長く作り続けるためのローカル開発環境。計画、実装、見直し、記録を分けて回すための土台です。",
    status: "summaryOnly",
    chips: ["開発環境", "記録", "見直し"],
  },
  {
    acc: "SUMMARY · 03",
    type: "STUDENT TOOL",
    title: "YNU-LMS-Agent",
    desc:
      "授業や課題まわりの作業を手元で扱うための学生向けツール群。確認、整理、記録を同じ流れで扱えるように作っています。",
    status: "summaryOnly",
    chips: ["YNU", "学生向け", "整理"],
  },
  {
    acc: "SUMMARY · 04",
    type: "WORK SUPPORT",
    title: "CrowdWorks Agent",
    desc:
      "CrowdWorksの案件探しから提案、返信、納品準備までを扱うローカル作業台。案件の保存、スコア付け、下書き、作業メモをまとめるために作っています。",
    status: "summaryOnly",
    chips: ["案件整理", "提案準備", "Web UI"],
  },
];

const b3Logs = [
  { date: "日付未設定", label: "制作メモ", kind: "準備中" },
  { date: "日付未設定", label: "見直し", kind: "準備中" },
  { date: "日付未設定", label: "記録", kind: "準備中" },
];

const replayBackLabels = {
  B1: "制作物へ戻る",
  B2: "制作過程へ戻る",
  B3: "活動ログへ戻る",
};

function getFloorIndex(code) {
  return Math.max(0, floors.findIndex((floor) => floor.code === code));
}

function getElevatorTravel(from, to) {
  const fromIndex = getFloorIndex(from);
  const toIndex = getFloorIndex(to);
  const delta = Math.max(1, Math.abs(toIndex - fromIndex));
  const distanceM = delta * FLOOR_DISTANCE_M;
  const direction = toIndex > fromIndex ? "DESCENDING" : "ASCENDING";
  const travelMs = 520 + distanceM * 90;

  return {
    from,
    to,
    delta,
    distanceM,
    direction,
    scroll: Math.round(520 + travelMs),
    open: Math.round(950 + travelMs),
    settle: Math.round(2200 + travelMs),
    done: Math.round(2500 + travelMs + delta * 50),
  };
}

const replaySteps = [
  {
    id: "audience",
    kicker: "STEP 01 · AUDIENCE",
    title: "見せる相手を決める",
    paperTitle: "誰に見せるか",
    paperType: "BRIEF",
    body:
      "企業、採用担当、協業相手、学校まわりの人に見せる前提にした。実績集ではなく、作りながら伸びていることが伝わるページに寄せる。",
    summary: "読者を先に絞った。実績自慢ではなく、作りながら伸びていることを見せる。",
    caption: "読者が決まると、盛りすぎた言葉を避けやすくなる。",
  },
  {
    id: "avoid",
    kicker: "STEP 02 · CUT",
    title: "先に消すものを決める",
    paperTitle: "出さないもの",
    paperType: "COPY NOTE",
    body:
      "数字ダッシュボードを先頭にしない。1年生なのに大きく見せない。AIの話を前面に出さない。内輪の運用説明も前に出さない。",
    summary: "数字、盛った肩書き、AIの話、内輪の運用説明を先に外した。",
    caption: "何を言わないかを決める方が、最初のコピーは締まる。",
  },
  {
    id: "copy",
    kicker: "STEP 03 · COPY",
    title: "ヒーローコピーを比べる",
    paperTitle: "言葉の候補",
    paperType: "DRAFT",
    body:
      "「学びながら、作る」「まだ実績より、伸び方を見せる段階です」「小さく作り、速く学び、次に進む」を比べた。最後は地下展示の構造に合う言葉を残した。",
    summary: "複数の言い方を比べて、地下展示の構造に合う方向へ寄せた。",
    caption: "コピーだけで決めず、画面の構造と合わせて選んだ。",
  },
  {
    id: "floors",
    kicker: "STEP 04 · FLOORS",
    title: "階を分ける",
    paperTitle: "地下展示にする",
    paperType: "MAP",
    body:
      "制作物、制作過程、活動ログ、保管庫、次の棚に分けた。全部が一気に見えると弱いので、階を移動して見る形にした。",
    summary: "制作物、制作過程、活動ログ、保管庫、次の棚に分けた。",
    caption: "一枚の長いLPより、見に行く順番がある方がこの案には合った。",
  },
  {
    id: "lobby",
    kicker: "STEP 05 · LOBBY",
    title: "1Fを自己紹介に戻す",
    paperTitle: "最初はロビー",
    paperType: "REVISION",
    body:
      "いきなりエレベーターだと、誰のサイトか分かりにくかった。1Fは名前、所属、GitHub、このサイトの役割だけを置くロビーに戻した。",
    summary: "最初に地下へ入れるのではなく、まず誰のサイトか分かるロビーにした。",
    caption: "入口で迷わせると、その後の凝った演出も効かない。",
  },
  {
    id: "claude",
    kicker: "STEP 06 · DESIGN",
    title: "Claude Designで形を探す",
    paperTitle: "案を並べる",
    paperType: "DESIGN PASS",
    body:
      "複数案を出して、ロビーとエレベーター演出の良い部分を選んだ。床、扉、音、ズームはClaude側の方が自然だったので、そこを軸にした。",
    summary: "複数案から、ロビーとエレベーター演出の良い部分を選んだ。",
    caption: "デザインは無理に自前で押し切らず、良い案を採用した。",
  },
  {
    id: "clone",
    kicker: "STEP 07 · MOVE",
    title: "HTMLをReactへ移す",
    paperTitle: "1Fを移す",
    paperType: "IMPLEMENT",
    body:
      "Claude DesignのHTMLを1Fとして移した。既存の地下階とぶつからないように、ロビー専用のclassへ分け、共通の扉表示も入館前は出さないようにした。",
    summary: "ClaudeのHTMLをReactへ移し、1F専用の構造として分けた。",
    caption: "ここは作り直しではなく、良いHTMLをそのまま活かす作業だった。",
  },
  {
    id: "language",
    kicker: "STEP 08 · EDIT",
    title: "説明を削る",
    paperTitle: "画面に出す言葉を減らす",
    paperType: "EDIT",
    body:
      "制作方針や公開範囲の説明が、そのまま画面に出ていた。読者は設計メモを読みに来ていないので、見れば分かる部分は消した。",
    summary: "設計メモのような言葉を消し、読者に見せる言葉だけ残した。",
    caption: "方針は画面の中で説明するより、画面の見え方で伝えたい。",
  },
  {
    id: "boundary",
    kicker: "STEP 09 · PUBLIC",
    title: "出せる制作を分ける",
    paperTitle: "公開できる範囲",
    paperType: "BOUNDARY",
    body:
      "自分のrepoとして前に出せるもの、PR参加として出すもの、ローカル検証に留めるものを分けた。Jinsei、YNU-LMS-Agent、CrowdWorks Agent、discord-codex-readerは、短い説明で並べる。",
    summary: "前に出すもの、PR参加、ローカル検証、概要だけの制作を分けた。",
    caption: "強い制作でも、出し方を間違えると信頼を削る。",
  },
  {
    id: "motion",
    kicker: "STEP 10 · MOTION",
    title: "入館の動きを直す",
    paperTitle: "扉と音を整える",
    paperType: "MOTION",
    body:
      "エレベーターの扉が開き、そこへ入っていく流れにした。音は控えめにし、ズームや扉の動きは少し長めにして、かくつきに見えにくくした。",
    summary: "扉、音、ズームを調整して、地下展示へ入る流れにした。",
    caption: "演出は派手さより、入館の理屈が通ることを優先した。",
  },
];

const cardChips = {
  "このサイトが今の形になるまで": ["React", "Copy", "Review"],
  Marginalia: ["React", "PDF.js", "IndexedDB"],
  Cadence: ["Go", "TUI"],
  Fieldnotes: ["Node", "Markdown"],
  Relay: ["Deno", "Webhooks"],
  Plot: ["TypeScript", "SVG"],
};

function getAudioContext(audioRef) {
  if (typeof window === "undefined") return null;
  if (!audioRef.current) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioRef.current = new AudioContext();
  }
  return audioRef.current;
}

function shapeGain(gain, start, points) {
  gain.gain.cancelScheduledValues(start);
  points.forEach(([time, value], index) => {
    if (index === 0) gain.gain.setValueAtTime(value, start + time);
    else gain.gain.exponentialRampToValueAtTime(Math.max(value, 0.0001), start + time);
  });
}

function playTone(ctx, destination, { frequency, type = "sine", start, duration, gain = 0.08, detune = 0 }) {
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  osc.detune.setValueAtTime(detune, start);
  shapeGain(amp, start, [
    [0, 0.0001],
    [0.015, gain],
    [duration, 0.0001],
  ]);
  osc.connect(amp).connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.04);
}

async function unlockElevatorAudio(audioRef) {
  const ctx = getAudioContext(audioRef);
  if (!ctx) return null;
  if (ctx.state === "suspended") await ctx.resume();
  return ctx;
}

function playFilteredNoise(ctx, destination, { start, duration, gainValue, frequency, q, type = "bandpass" }) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    const progress = index / length;
    const envelope = Math.sin(progress * Math.PI) * Math.pow(1 - progress, 0.62);
    data[index] = (Math.random() * 2 - 1) * envelope;
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = type;
  filter.frequency.setValueAtTime(frequency, start);
  filter.Q.setValueAtTime(q, start);
  shapeGain(gain, start, [
    [0, 0.0001],
    [0.035, gainValue],
    [duration, 0.0001],
  ]);
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(destination);
  source.start(start);
  source.stop(start + duration + 0.04);
}

function playArrivalDing(audioRef, soundEnabled) {
  if (!soundEnabled) return;
  const ctx = getAudioContext(audioRef);
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  const master = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  master.gain.setValueAtTime(0.78, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4200, now);
  filter.Q.setValueAtTime(0.42, now);
  master.connect(filter).connect(ctx.destination);
  playTone(ctx, master, { frequency: 1244, type: "sine", start: now, duration: 0.32, gain: 0.075 });
  playTone(ctx, master, { frequency: 2489, type: "sine", start: now + 0.016, duration: 0.24, gain: 0.032 });
  playTone(ctx, master, { frequency: 3733, type: "sine", start: now + 0.022, duration: 0.18, gain: 0.016 });
  window.setTimeout(() => master.disconnect(), 900);
}

function playAirReleaseSound(audioRef, soundEnabled) {
  if (!soundEnabled) return;
  const ctx = getAudioContext(audioRef);
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  const master = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  master.gain.setValueAtTime(0.58, now);
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2600, now);
  filter.frequency.exponentialRampToValueAtTime(900, now + 0.62);
  filter.Q.setValueAtTime(0.8, now);
  master.connect(filter).connect(ctx.destination);
  playFilteredNoise(ctx, master, {
    start: now,
    duration: 0.78,
    gainValue: 0.052,
    frequency: 1800,
    q: 0.95,
    type: "bandpass",
  });
  window.setTimeout(() => master.disconnect(), 1050);
}

function playElevatorMotor(audioRef, soundEnabled, duration = 0.9) {
  if (!soundEnabled) return;
  const ctx = getAudioContext(audioRef);
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  const master = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  master.gain.setValueAtTime(0.7, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(520, now);
  filter.frequency.exponentialRampToValueAtTime(220, now + duration);
  filter.Q.setValueAtTime(0.65, now);
  master.connect(filter).connect(ctx.destination);
  playTone(ctx, master, { frequency: 67, type: "sawtooth", start: now, duration, gain: 0.03, detune: -8 });
  playTone(ctx, master, { frequency: 92, type: "sine", start: now + 0.04, duration: duration * 0.92, gain: 0.022 });
  playFilteredNoise(ctx, master, {
    start: now + 0.02,
    duration,
    gainValue: 0.018,
    frequency: 360,
    q: 0.6,
    type: "lowpass",
  });
  window.setTimeout(() => master.disconnect(), (duration + 0.25) * 1000);
}

function playElevatorJolt(audioRef, soundEnabled) {
  if (!soundEnabled) return;
  const ctx = getAudioContext(audioRef);
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  const master = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  master.gain.setValueAtTime(0.9, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(430, now);
  filter.frequency.exponentialRampToValueAtTime(120, now + 0.22);
  filter.Q.setValueAtTime(0.72, now);
  master.connect(filter).connect(ctx.destination);
  playTone(ctx, master, { frequency: 120, type: "sine", start: now, duration: 0.18, gain: 0.07 });
  playTone(ctx, master, { frequency: 46, type: "triangle", start: now + 0.045, duration: 0.22, gain: 0.035 });
  playFilteredNoise(ctx, master, {
    start: now,
    duration: 0.24,
    gainValue: 0.024,
    frequency: 280,
    q: 0.4,
    type: "lowpass",
  });
  window.setTimeout(() => master.disconnect(), 650);
}

function playElevatorSound(audioRef, soundEnabled, kind) {
  if (!soundEnabled) return;
  if (kind === "depart") return;
  const ctx = getAudioContext(audioRef);
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  const master = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  master.gain.setValueAtTime(1.05, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(kind === "press" ? 820 : kind === "enable" ? 2200 : 780, now);
  filter.Q.setValueAtTime(kind === "press" ? 1.2 : 0.65, now);
  master.connect(filter).connect(ctx.destination);

  if (kind === "enable") {
    playTone(ctx, master, { frequency: 880, type: "sine", start: now, duration: 0.14, gain: 0.082 });
    playTone(ctx, master, { frequency: 1320, type: "sine", start: now + 0.1, duration: 0.2, gain: 0.064 });
  } else if (kind === "press") {
    playTone(ctx, master, { frequency: 196, type: "sine", start: now, duration: 0.22, gain: 0.095 });
    playTone(ctx, master, { frequency: 294, type: "triangle", start: now + 0.012, duration: 0.18, gain: 0.045 });
    playTone(ctx, master, { frequency: 392, type: "sine", start: now + 0.025, duration: 0.14, gain: 0.022 });
  }

  window.setTimeout(() => master.disconnect(), 900);
}

function Chips({ items = [] }) {
  return (
    <div className="chips mono">
      {items.map((chip) => (
        <span className="chip" key={chip}>
          {chip}
        </span>
      ))}
    </div>
  );
}

function ExhibitCard({
  acc,
  type,
  title,
  desc,
  status,
  draft = false,
  link = false,
  feature = false,
  onReplay,
  githubUrl,
  chips,
}) {
  return (
    <article className={`card${draft ? " draft" : ""}${githubUrl || onReplay ? " has-actions" : ""}${feature ? " feature" : ""}`}>
      {feature && <span className="feat-tag mono">FEATURED EXHIBIT</span>}
      <div className="card-acc mono">
        <span>{acc}</span>
        {type && <span className="type">{type}</span>}
      </div>
      <h3 className="card-title serif">{title}</h3>
      <p className="card-desc">{desc}</p>
      <Chips items={chips ?? cardChips[title]} />
      {feature && (
        <>
          <div className="specimen" aria-hidden="true">
            {[38, 64, 30, 82, 52, 70, 44, 60].map((height) => (
              <span style={{ height: `${height}%` }} key={height} />
            ))}
          </div>
          <span className="specimen-cap mono">DAILY LEDGER · SAMPLE MONTH</span>
        </>
      )}
      <div className="card-foot">
        <span className={`status mono${draft ? " wip" : ""}${status === "internal" ? " internal" : ""}`}>
          {getStatusLabel(status)}
        </span>
        <span className="card-actions mono">
          {githubUrl && (
            <a className="card-action" href={githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {onReplay && (
            <button className="card-action" type="button" onClick={onReplay}>
              {feature ? "制作過程" : "過程"}
            </button>
          )}
        </span>
      </div>
    </article>
  );
}

function Threshold({ label, depth }) {
  return (
    <div className="threshold mono">
      <span className="th-line" />
      <span className="th-label">
        <span className="th-arrow">▼</span>
        {label}
        <span className="th-depth">{depth}</span>
      </span>
      <span className="th-line" />
    </div>
  );
}

function Plate({ code, kicker, title }) {
  return (
    <header className="plate">
      <span className="plate-code mono">{code}</span>
      <span className="plate-line" />
      <span className="plate-txt">
        <span className="plate-kicker mono">{kicker}</span>
        <span className="plate-title serif">{title}</span>
      </span>
    </header>
  );
}

function SpeakerMark() {
  return (
    <span className="speaker-mark" aria-hidden="true">
      <span className="speaker-box" />
      <span className="speaker-cone" />
      <span className="speaker-wave one" />
      <span className="speaker-wave two" />
    </span>
  );
}

function FloorNavigator({ activeFloor, onSelect, doors, settling, soundEnabled, onToggleSound, travel }) {
  const current = floors.find((floor) => floor.code === activeFloor) ?? floors[0];
  const moving = Boolean(travel);
  const directionLabel = moving ? travel.direction : activeFloor === "1F" ? "GROUND FLOOR" : "DESCENDING";
  const directionArrows = moving ? (travel.direction === "DESCENDING" ? "▼ ▼ ▼" : "▲ ▲ ▲") : activeFloor === "1F" ? "- · -" : "▼ ▼ ▼";
  const readoutFloor = moving ? travel.to : activeFloor;

  return (
    <aside className={`elevator${doors === "shut" ? " jolt" : ""}${settling ? " settle" : ""}${moving ? " moving" : ""}`}>
      <div className="ev-head">
        <span className="ev-brand mono">SORA · MUSEUM LIFT</span>
        <button className="sound-toggle mono" type="button" onClick={onToggleSound} aria-pressed={soundEnabled}>
          <SpeakerMark />
          <span>{soundEnabled ? "音あり" : "音なし"}</span>
        </button>
      </div>
      <div className="ev-body">
        <div className="ev-readout">
          <div className="ev-dir">
            <span className="ev-dir-label">{directionLabel}</span>
            <span className="ev-dir-arrows">{directionArrows}</span>
          </div>
          <span className="ev-floor">{readoutFloor}</span>
        </div>
        {moving && (
          <div className="ev-motion mono">
            {travel.from} {"->"} {travel.to} · {travel.distanceM.toFixed(1)} M · {travel.delta} LEVELS
          </div>
        )}
        <div className="ev-shaft">
          <div className="ev-pips-row">
            {floors.map((floor) => (
              <button
                className={`ev-pip${floor.code === activeFloor ? " on" : ""}`}
                key={floor.code}
                type="button"
                onClick={() => onSelect(floor.code)}
              >
                <span className="ev-node" />
                <span className="ev-labels">
                  <span className="ev-code">{floor.code}</span>
                  <span className="ev-name">{floor.name}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="ev-guide">{moving ? '"移動中です。扉が開くまで少しお待ちください。"' : current.guide}</div>
      </div>
    </aside>
  );
}

function DoorOverlay({ doors, arriving, settling, travel }) {
  const current = floors.find((floor) => floor.code === arriving) ?? floors[0];
  const moving = Boolean(travel);

  return (
    <div className={`doors${doors === "shut" ? " shut jolt" : ""}${settling ? " settle" : ""}${moving ? " moving" : ""}`} aria-hidden="true">
      <div className="door door-l" />
      <div className="door door-r" />
      <div className="door-glow" />
      <div className="door-seam" />
      <div className="door-plate">
        <div className="dp-lamp">{moving ? `${travel.direction} · ${travel.distanceM.toFixed(1)} M` : "▼ ARRIVING ▼"}</div>
        <div className="dp-floor">{arriving}</div>
        <div className="dp-dir">{current.name.toUpperCase()}</div>
      </div>
    </div>
  );
}

function EntrancePage({ onEnter, soundEnabled, onToggleSound, entrancePhase, doors, arriving, settling, travel }) {
  const isCalling = entrancePhase === "calling";
  const isOpen = entrancePhase === "opening" || entrancePhase === "boarding";
  const isBoarding = entrancePhase === "boarding";
  const hallFloor = entrancePhase === "idle" ? "1F" : arriving;
  const overlayClosed = doors === "shut" || Boolean(travel);
  const overlayFloor = floors.find((floor) => floor.code === arriving) ?? floors[1];

  return (
    <section className={`lobby entrance-floor ft-charcoal${isCalling ? " is-calling" : ""}${isOpen ? " is-open" : ""}${isBoarding ? " boarding" : ""}`}>
      <div className="lobby-floor" aria-hidden="true" />
      <div className="wall-tex" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <button className={`snd mono${soundEnabled ? " is-on" : ""}`} type="button" onClick={onToggleSound} aria-pressed={soundEnabled}>
        ♪ {soundEnabled ? "ON" : "OFF"}
      </button>

      <div className="scene">
        <section className="intro" aria-label="プロフィール">
          <p className="kicker mono">ポートフォリオ</p>
          <p className="p-label mono">PROFILE</p>
          <h1 className="name serif">宮脇蒼空</h1>
          <p className="lede">作ったものと、作っている途中のもの、手元で使っている道具を並べています。</p>
          <div className="meta">
            {lobbyRows.map(([label, value]) => (
              <div className="m-row" key={label}>
                <span className="m-k mono">{label}</span>
                {label === "GitHub" ? (
                  <a className="m-v mono" href={githubProfileUrl} target="_blank" rel="noreferrer">
                    {value}
                  </a>
                ) : (
                  <span className={label === "展示室" ? "m-v mono" : "m-v"}>{value}</span>
                )}
              </div>
            ))}
          </div>
          <a className="gh" href={githubProfileUrl} target="_blank" rel="noreferrer" aria-label="GitHubを見る">
            <svg className="gh-ico" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.05c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.03 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.74.11 3.03.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.35.77 1.04.77 2.1v3.09c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                fill="currentColor"
              />
            </svg>
            <span>GitHubを見る</span>
            <span className="ar">↗</span>
          </a>
        </section>

        <section className="hall" aria-label="地下展示への入口">
          <div className="hall-fx" aria-hidden="true">
            <div className="fx-reflect" />
            <div className="fx-contact" />
          </div>
          <div className="hall-group">
            <div className={`hall-side${isCalling ? " calling" : ""}`}>
              <div className="dir" aria-label="展示階層">
                <div className="dir-head mono">
                  <span>下の階へ</span>
                  <span>ARCHIVE</span>
                </div>
                {floors.map((floor) => (
                  <div className={floor.code === "1F" ? "dir-row now" : "dir-row"} key={floor.code}>
                    <span>{floor.code}</span>
                    <b>{floor.name}</b>
                    <em>{floor.code === "1F" ? "NOW" : ""}</em>
                  </div>
                ))}
              </div>
              <button className="call" type="button" onClick={onEnter}>
                <span className="call-lamp">▽</span>
                <span className="call-t">地下展示へ降りる</span>
                <span className="call-s mono">CALL · DESCEND</span>
              </button>
            </div>

            <div className={`lift${isOpen ? " op" : ""}`} aria-hidden="true">
              <div className={`lantern${entrancePhase !== "idle" ? " act" : ""}`}>
                <span className="lantern-dir">▽</span>
                <span className="lantern-fl mono">{hallFloor}</span>
              </div>
              <div className="frame">
                <div className="opening">
                  <div className="interior">
                    <span className="int-arrow">▼</span>
                    <span className="int-rail" />
                  </div>
                  <div className="leaf leaf-l" />
                  <div className="leaf leaf-r" />
                  <div className="seam" />
                </div>
              </div>
              <div className="sill" />
            </div>
          </div>
        </section>
      </div>

      <div className={`descent${overlayClosed ? " shut" : ""}${settling ? " jolt" : ""}`} aria-hidden="true">
        <div className="d-left" />
        <div className="d-right" />
        <div className="d-glow" />
        <div className="d-seam" />
        <div className="d-panel">
          <p className="mono">{travel ? `${travel.direction} · ${travel.distanceM.toFixed(1)} M` : "▼ DESCENDING ▼"}</p>
          <b>{arriving}</b>
          <span>{overlayFloor.name}</span>
        </div>
      </div>
      <div className="lobby-grain" aria-hidden="true" />
    </section>
  );
}

function MuseumPage({ activeFloor, openReplay }) {
  return <FloorSection code={activeFloor} openReplay={openReplay} />;
}

function FloorSection({ code, openReplay }) {
  if (code === "B1") {
    return (
      <section className="floor f-b1 f-active">
        <div className="wrap">
          <Threshold label="ELEVATOR ACCESS ONLY" depth="ELEV. -3.5 M · SUBLEVEL 01" />
          <Plate code="B1" kicker="WORKS / REPOS" title="制作物" />
          <p className="floor-intro">
            いま前に出せる制作物です。GitHubで見られるものと、PR参加したものを分けて置いています。
          </p>
          <div className="b1-grid">
            {majorRepos.map((repo) => (
              <ExhibitCard key={repo.title} {...repo} onReplay={repo.replay ? () => openReplay("B1") : undefined} />
            ))}
          </div>
        </div>
        <span className="floor-ghost mono">B1</span>
      </section>
    );
  }

  if (code === "B2") {
    return (
      <section className="floor f-b2 f-deep f-active">
        <div className="wrap">
          <Threshold label="ELEVATOR ACCESS ONLY" depth="ELEV. -7.0 M · SUBLEVEL 02" />
          <Plate code="B2" kicker="PROCESS" title="制作過程" />
          <p className="floor-intro">
            このサイトを作る中で、実際に迷って直した順番です。工程表ではなく、判断の跡だけを短く置いています。
          </p>
          <ol className="replay-steps">
            {replaySteps.map((step, index) => (
              <li key={step.id}>
                <span className="rs-num mono">{String(index + 1).padStart(2, "0")} · {step.kicker.split(" · ")[1]}</span>
                <h4 className="serif">{step.title}</h4>
                <p>{step.summary}</p>
              </li>
            ))}
          </ol>
          <button className="replay-entry" type="button" onClick={() => openReplay("B2")}>
            <span className="re-l">
              <span className="re-k mono">BUILD REPLAY</span>
              <span className="re-t serif">LP制作の過程を見る</span>
            </span>
            <span className="re-arrow">→</span>
          </button>
        </div>
        <span className="floor-ghost mono">B2</span>
      </section>
    );
  }

  if (code === "B3") {
    return (
      <section className="floor f-b3 f-deep f-active">
        <div className="wrap">
          <Threshold label="ELEVATOR ACCESS ONLY" depth="ELEV. -10.5 M · SUBLEVEL 03" />
          <Plate code="B3" kicker="LOG" title="活動ログ" />
          <p className="floor-intro">
            活動の記録を短く残していきます。
          </p>
          <div className="log-list mono">
            {b3Logs.map((log) => (
              <div className="log-row" key={`${log.date}-${log.label}`}>
                <span>{log.date}</span>
                <span>{log.label}</span>
                <span>{log.kind}</span>
              </div>
            ))}
          </div>
        </div>
        <span className="floor-ghost mono">B3</span>
      </section>
    );
  }

  if (code === "B4") {
    return (
      <section className="floor f-b4 f-deep f-active">
        <div className="wrap">
          <Threshold label="ELEVATOR ACCESS ONLY" depth="ELEV. -14.0 M · SUBLEVEL 04" />
          <Plate code="B4" kicker="ARCHIVE" title="保管庫" />
          <p className="floor-intro">
            学校や仕事に近い制作を、短い説明で並べています。
          </p>
          <div className="exhibits private-systems">
            {overviewWorks.map((item) => (
              <ExhibitCard key={item.title} {...item} draft />
            ))}
          </div>
        </div>
        <span className="floor-ghost mono">B4</span>
      </section>
    );
  }

  return (
    <section className="floor f-b5 f-deep f-active">
      <div className="wrap">
        <Threshold label="DEEPEST LEVEL" depth="ELEV. -17.5 M · SUBLEVEL 05" />
        <Plate code="B5" kicker="NEXT SHELF" title="次の棚" />
        <p className="floor-intro">
          次に追加する展示のための棚です。
        </p>
        <div className="exhibits">
          <ExhibitCard
            acc="NEXT · 01"
            type="IOS APP"
            title="study app"
            desc="Xcodeで作り直す予定のiOSアプリ。設計、実機確認、配布まで進めて、前に出せる制作にします。"
            status="draft"
            draft
            chips={["Xcode", "Swift", "iOS"]}
          />
          <ExhibitCard
            acc="NEXT · 02"
            type="REPOSITORY"
            title="READMEを整える"
            desc="前に出すrepoから順に、日本語で読めるREADMEと公開用の説明へ直していきます。"
            status="draft"
            draft
            chips={["README", "日本語", "公開準備"]}
          />
          <ExhibitCard
            acc="NEXT · 03"
            type="PROCESS"
            title="制作過程を増やす"
            desc="前に出せる制作から、作った流れを短いリプレイとして残していきます。"
            status="sketch"
            draft
            chips={["Replay", "記録", "追加"]}
          />
        </div>
      </div>
      <span className="floor-ghost mono">B5</span>
    </section>
  );
}

function Note({ title, children, spec = false }) {
  return (
    <article className={`note${spec ? " spec-note" : ""}`}>
      <h4>{title}</h4>
      {children}
    </article>
  );
}

function ReplayPage({ onBack, returnFloor = "B1" }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);
  const activeStep = replaySteps[active];
  const backLabel = replayBackLabels[returnFloor] ?? "展示室へ戻る";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const next = Number(entry.target.dataset.stepIndex);
            if (!Number.isNaN(next)) setActive(next);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    stepRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="replay">
      <div className="topbar mono">
        <button className="back" type="button" onClick={onBack}>
          ↑ {returnFloor} · {backLabel}
        </button>
        <span className="tb-title">BUILD REPLAY</span>
      </div>

      <div className="replay-wrap">
        <header className="exhibit-head">
          <span className="eh-kicker mono">
            <span className="line" />
            制作過程 · LP制作
          </span>
          <h1 className="eh-title serif">このサイトが今の形になるまで</h1>
          <p className="eh-sub">
            誰に見せるかを決めるところから、1Fロビーの移植、言葉の削り込み、入館アニメーションの調整までを短くたどります。
          </p>
        </header>

        <div className="stage-col">
          <div className="stage newspaper-stage">
            <div className="stage-top">
              <span className="stage-label">THE BUILD DAILY</span>
              <div className="stage-counter">
                <div className="segs">
                  {replaySteps.map((step, index) => (
                    <span className={`seg${index === active ? " on" : index < active ? " done" : ""}`} key={step.id} />
                  ))}
                </div>
                <span className="stage-count">{String(active + 1).padStart(2, "0")} / {String(replaySteps.length).padStart(2, "0")}</span>
              </div>
            </div>
            <div className="stage-body">
              <article className={`build-paper paper-${activeStep.id}`}>
                <header className="build-paper-head">
                  <div className="paper-name serif">
                    The Build
                    <br />
                    Daily
                  </div>
                  <div className="paper-date mono">
                    LP-YOLO
                    <br />
                    PROCESS REPLAY
                  </div>
                </header>
                <span className="paper-type mono">{activeStep.paperType}</span>
                <h2 className="paper-headline serif">{activeStep.paperTitle}</h2>
                <div className="paper-grid">
                  <div className="paper-photo" aria-hidden="true">
                    <span>{String(active + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="paper-copy">{activeStep.body}</p>
                </div>
                <p className="paper-note">{activeStep.caption}</p>
              </article>
              <span className="mount-tag">PAPER · {String(active + 1).padStart(2, "0")} / {String(replaySteps.length).padStart(2, "0")}</span>
            </div>
            <div className="stage-cap">{activeStep.caption}</div>
          </div>
        </div>

        <div className="steps-col">
          {replaySteps.map((step, index) => (
            <div
              className={`step${index === active ? " on" : index < active ? " done" : ""}`}
              data-step-index={index}
              key={step.id}
              ref={(node) => {
                stepRefs.current[index] = node;
              }}
            >
              <span className="step-kicker">{step.kicker}</span>
              <h3 className="serif">{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>

        <footer className="replay-foot">
          <span className="rf-note">ここでは、公開できる範囲の制作判断だけを残しています。</span>
          <button className="ghost-btn" type="button" onClick={onBack}>
            ← 展示室へ戻る
          </button>
        </footer>
      </div>
    </div>
  );
}

function StageLayer({ active, children }) {
  return <div className={`stage-layer${active ? " on" : ""}`}>{children}</div>;
}

function App() {
  const [activeFloor, setActiveFloor] = useState("1F");
  const [entered, setEntered] = useState(false);
  const [doors, setDoors] = useState("open");
  const [arriving, setArriving] = useState("1F");
  const [settling, setSettling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("lp-yolo-elevator-sound") === "on";
  });
  const [travel, setTravel] = useState(null);
  const [route, setRoute] = useState("museum");
  const [replayReturnFloor, setReplayReturnFloor] = useState("B1");
  const [entrancePhase, setEntrancePhase] = useState("idle");
  const animatingRef = useRef(false);
  const audioRef = useRef(null);
  const timersRef = useRef([]);

  function clearTravelTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function scheduleTravel(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }

  useEffect(() => clearTravelTimers, []);

  function goToFloor(code) {
    if (code === activeFloor && !animatingRef.current) return;
    if (animatingRef.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEntrancePhase("idle");
      setActiveFloor(code);
      setEntered(code !== "1F");
      window.scrollTo(0, 0);
      return;
    }

    const nextTravel = getElevatorTravel(activeFloor, code);
    clearTravelTimers();
    animatingRef.current = true;
    setEntrancePhase("idle");
    setArriving(code);
    setSettling(false);
    setTravel(nextTravel);
    setDoors("shut");
    playElevatorSound(audioRef, soundEnabled, "press");
    scheduleTravel(() => {
      setActiveFloor(code);
      setEntered(code !== "1F");
      window.scrollTo(0, 0);
    }, nextTravel.scroll);
    scheduleTravel(() => {
      setDoors("open");
      playArrivalDing(audioRef, soundEnabled);
      playAirReleaseSound(audioRef, soundEnabled);
    }, nextTravel.open);
    scheduleTravel(() => {
      setSettling(true);
      setTravel(null);
    }, nextTravel.settle);
    scheduleTravel(() => {
      animatingRef.current = false;
      setSettling(false);
    }, nextTravel.done);
  }

  async function enterMuseum() {
    if (activeFloor !== "1F" || animatingRef.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEntrancePhase("idle");
      setArriving("B1");
      setActiveFloor("B1");
      setEntered(true);
      window.scrollTo(0, 0);
      return;
    }

    clearTravelTimers();
    animatingRef.current = true;
    setArriving("B1");
    setSettling(false);
    setTravel(null);
    setDoors("open");
    setEntrancePhase("calling");
    await unlockElevatorAudio(audioRef);
    playArrivalDing(audioRef, soundEnabled);

    scheduleTravel(() => {
      setEntrancePhase("opening");
      playAirReleaseSound(audioRef, soundEnabled);
    }, entranceTimeline.openDoors);
    scheduleTravel(() => {
      setEntrancePhase("boarding");
    }, entranceTimeline.boardLift);
    scheduleTravel(() => {
      setDoors("shut");
      setTravel(getElevatorTravel("1F", "B1"));
      playElevatorMotor(audioRef, soundEnabled, 1.25);
    }, entranceTimeline.closeDoors);
    scheduleTravel(() => {
      setActiveFloor("B1");
      setEntered(true);
      window.scrollTo(0, 0);
    }, entranceTimeline.switchFloor);
    scheduleTravel(() => {
      setSettling(true);
      playElevatorJolt(audioRef, soundEnabled);
    }, entranceTimeline.jolt);
    scheduleTravel(() => {
      playArrivalDing(audioRef, soundEnabled);
    }, entranceTimeline.arrivalDing);
    scheduleTravel(() => {
      setDoors("open");
      playAirReleaseSound(audioRef, soundEnabled);
    }, entranceTimeline.openArrival);
    scheduleTravel(() => {
      setEntrancePhase("idle");
      setTravel(null);
      setSettling(false);
      animatingRef.current = false;
    }, entranceTimeline.cleanup);
  }

  function openReplay(returnFloor = activeFloor) {
    setReplayReturnFloor(returnFloor);
    setRoute("replay");
    window.scrollTo(0, 0);
  }

  function closeReplay() {
    setRoute("museum");
    setEntered(true);
    setActiveFloor(replayReturnFloor);
    setArriving(replayReturnFloor);
    window.scrollTo(0, 0);
  }

  async function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    window.localStorage.setItem("lp-yolo-elevator-sound", next ? "on" : "off");
    if (next) {
      await unlockElevatorAudio(audioRef);
      playElevatorSound(audioRef, true, "enable");
    }
  }

  if (route === "replay") {
    return <ReplayPage onBack={closeReplay} returnFloor={replayReturnFloor} />;
  }

  const atEntrance = activeFloor === "1F" || !entered;
  const showElevator = !atEntrance;

  return (
    <main className={`museum${showElevator ? " entered" : " at-entrance"}${settling ? " settling" : ""}${travel ? " moving" : ""}`}>
      {showElevator && <div className="grain" />}
      {showElevator && (
        <div className="masthead mono">
          <span className="mh-name">SORA</span>
          <span className="mh-sub">UNDERGROUND MUSEUM</span>
        </div>
      )}
      {showElevator ? (
        <MuseumPage activeFloor={activeFloor} openReplay={openReplay} />
      ) : (
        <EntrancePage
          onEnter={enterMuseum}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          entrancePhase={entrancePhase}
          doors={doors}
          arriving={arriving}
          settling={settling}
          travel={travel}
        />
      )}
      {showElevator && (
        <FloorNavigator
          activeFloor={activeFloor}
          onSelect={goToFloor}
          doors={doors}
          settling={settling}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          travel={travel}
        />
      )}
      {showElevator && <DoorOverlay doors={doors} arriving={arriving} settling={settling} travel={travel} />}
    </main>
  );
}

export default App;
