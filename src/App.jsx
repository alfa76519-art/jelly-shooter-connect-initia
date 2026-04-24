import {
  InterwovenKitProvider,
  TESTNET,
  initiaPrivyWalletConnector,
  useInterwovenKit,
  injectStyles,
} from '@initia/interwovenkit-react'
import interwovenKitStyles from '@initia/interwovenkit-react/styles.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { useEffect, useState } from 'react'

const queryClient = new QueryClient()
const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
})

const GAME_URL = 'https://jelly-raffle-jangkung.vercel.app/'

/* ─────────────────────────────────────────
   STYLES — pastel candy jelly world 🍬
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --pink:    #ff8fab;
    --pink2:   #ffb3c6;
    --purple:  #c77dff;
    --blue:    #90e0ef;
    --blue2:   #caf0f8;
    --yellow:  #ffd166;
    --green:   #b7e4c7;
    --bg:      #fff0f5;
    --bg2:     #fce4ec;
    --white:   #ffffff;
    --text:    #6d3b6e;
    --muted:   #c9a4ca;
  }

  html, body { min-height: 100vh; }

  body {
    background: var(--bg);
    font-family: 'Nunito', sans-serif;
    overflow-x: hidden;
  }
    /* ── 1. TEMBAK JANTUNG PRIVY (CORE OVERRIDE) ── */
  [class*="privy"], [class*="interwoven"] {
    --privy-color-background: rgba(255, 240, 245, 0.85) !important;
    --privy-color-background-2: rgba(255, 255, 255, 0.9) !important;
  }

  /* ── 2. MODAL & DIALOG (BIAR JADI GLASSMORPHISM) ── */
  /* ── JURUS TEMBUS DIMENSI ── */
  :host, :root, body, html {
    --privy-color-background: rgba(255, 240, 245, 0.85) !important;
  }
  div[class*="privy-dialog"], 
  div[class*="privy-modal"],
  section[class*="privy-section"],
  .privy-modal-content {
    background: rgba(255, 240, 245, 0.85) !important; 
    backdrop-filter: blur(15px) !important;
    border: 3px solid var(--pink2) !important;
    border-radius: 32px !important;
    box-shadow: 0 12px 40px rgba(255, 143, 171, 0.2) !important;
  }

  /* ── 3. TEMBAK TEXT & BUTTON BIAR SINKRON ── */
  div[class*="privy"] h1, 
  div[class*="privy"] div, 
  div[class*="privy"] span,
  div[class*="privy"] p {
    color: var(--text) !important; 
    font-family: 'Fredoka One', cursive !important;
  }

  .privy-button {
    background: var(--pink) !important;
    border-radius: 20px !important;
    color: white !important;
    box-shadow: 0 4px 0 #d44d8b !important;
  }

  /* ── animated pastel mesh background ── */
  .jbg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 15% 20%, rgba(255,143,171,0.28) 0%, transparent 70%),
      radial-gradient(ellipse 50% 60% at 85% 15%, rgba(199,125,255,0.22) 0%, transparent 70%),
      radial-gradient(ellipse 70% 40% at 50% 85%, rgba(144,224,239,0.3) 0%, transparent 70%),
      radial-gradient(ellipse 40% 50% at 80% 70%, rgba(255,209,102,0.2) 0%, transparent 70%),
      linear-gradient(160deg, #fff0f8 0%, #f0f4ff 40%, #f5fff8 100%);
    animation: bgShift 12s ease-in-out infinite alternate;
  }
  @keyframes bgShift {
    0%   { filter: hue-rotate(0deg) brightness(1); }
    50%  { filter: hue-rotate(8deg) brightness(1.03); }
    100% { filter: hue-rotate(-6deg) brightness(1.01); }
  }

  /* ── floating blobs ── */
  .blob {
    position: fixed; border-radius: 50%; pointer-events: none;
    filter: blur(40px); opacity: 0.35;
    animation: blobFloat ease-in-out infinite alternate;
  }
  @keyframes blobFloat {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(20px, -30px) scale(1.08); }
  }

  /* ── polka dot overlay ── */
  .dots {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.06;
    background-image: radial-gradient(circle, #ff8fab 1.5px, transparent 1.5px);
    background-size: 28px 28px;
  }

  /* ── floating candies ── */
  .candy {
    position: fixed; pointer-events: none; font-size: 1.4rem; z-index: 0;
    animation: candyFloat linear infinite;
    filter: drop-shadow(0 4px 8px rgba(255,143,171,0.3));
  }
  @keyframes candyFloat {
    0%   { transform: translateY(105vh) rotate(0deg); opacity: 0; }
    5%   { opacity: 0.7; }
    90%  { opacity: 0.5; }
    100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }

  /* ── CARD ── */
  .jcard {
    position: relative; z-index: 1;
    background: rgba(255,255,255,0.72);
    border: 2.5px solid rgba(255,143,171,0.35);
    border-radius: 32px;
    padding: 48px 52px 44px;
    text-align: center;
    backdrop-filter: blur(24px);
    box-shadow:
      0 8px 32px rgba(255,143,171,0.18),
      0 2px 0 rgba(255,255,255,0.9) inset,
      0 -1px 0 rgba(255,143,171,0.12) inset;
    animation: cardPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
    max-width: 400px; width: 100%;
  }
  @keyframes cardPop {
    from { opacity: 0; transform: scale(0.8) translateY(30px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* ── wobble deco ring ── */
  .deco-ring {
    position: absolute; border-radius: 50%; pointer-events: none;
    border: 2px dashed rgba(255,143,171,0.25);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    animation: ringSpин 18s linear infinite;
  }
  @keyframes ringSpин {
    from { transform: translate(-50%,-50%) rotate(0deg); }
    to   { transform: translate(-50%,-50%) rotate(360deg); }
  }

  /* ── title ── */
  .jtitle {
    font-family: 'Fredoka One', cursive;
    font-size: clamp(3rem, 8vw, 4.8rem);
    line-height: 0.95;
    letter-spacing: -0.01em;
    background: linear-gradient(160deg, #ff6b9d 0%, #c77dff 50%, #90e0ef 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 4px 16px rgba(255,107,157,0.35));
    animation: titleWobble 2.8s ease-in-out infinite;
  }
  @keyframes titleWobble {
    0%,100% { transform: rotate(-1.5deg) scale(1); }
    50%      { transform: rotate(1.5deg) scale(1.02); }
  }

  /* ── subtitle ── */
  .jsub {
    font-family: 'Nunito', sans-serif; font-weight: 700;
    font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted); margin-top: 10px;
  }

  /* ── divider ── */
  .divider {
    display: flex; align-items: center; gap: 10px; margin: 20px 0;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(255,143,171,0.35), transparent);
  }
  .divider span { font-size: 1.1rem; }

  /* ── address pill ── */
  .addr-pill {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Nunito', sans-serif; font-size: 0.75rem; font-weight: 800;
    background: linear-gradient(135deg, rgba(255,143,171,0.15), rgba(199,125,255,0.12));
    border: 1.5px solid rgba(255,143,171,0.4);
    border-radius: 999px; padding: 8px 20px;
    color: var(--text);
    animation: pillPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .addr-pill .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #5edc8a; box-shadow: 0 0 8px #5edc8a;
    animation: blink 1.8s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes pillPop {
    from { opacity:0; transform: scale(0.7); }
    to   { opacity:1; transform: scale(1); }
  }

  /* ── awaiting state ── */
  .await-text {
    font-family: 'Nunito', sans-serif; font-weight: 700;
    font-size: 0.75rem; letter-spacing: 0.1em;
    color: var(--muted); text-transform: uppercase;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  /* ── connect button ── */
  .btn-conn {
    font-family: 'Fredoka One', cursive;
    font-size: 1.05rem; letter-spacing: 0.04em;
    background: linear-gradient(135deg, #ff8fab, #c77dff);
    color: white; border: none; border-radius: 999px;
    padding: 16px 44px; cursor: pointer;
    box-shadow: 0 8px 24px rgba(255,143,171,0.45), 0 2px 0 rgba(255,255,255,0.4) inset;
    transition: transform .2s, box-shadow .2s;
    position: relative; overflow: hidden;
  }
  .btn-conn::after {
    content:''; position:absolute; inset:0; border-radius:inherit;
    background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
  }
  .btn-conn:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 14px 32px rgba(255,143,171,0.55), 0 2px 0 rgba(255,255,255,0.4) inset; }
  .btn-conn:active { transform: scale(0.96); }

  /* ── start game button ── */
  .btn-start {
    font-family: 'Fredoka One', cursive;
    font-size: 1.2rem; letter-spacing: 0.03em;
    background: linear-gradient(135deg, #ff6b9d, #ff8fab 50%, #ffb3c6);
    color: white; border: none; border-radius: 999px;
    padding: 20px 56px; cursor: pointer;
    box-shadow: 0 10px 30px rgba(255,107,157,0.5), 0 2px 0 rgba(255,255,255,0.5) inset;
    transition: transform .2s, box-shadow .2s;
    position: relative; overflow: hidden;
    animation: btnBounce 2s ease-in-out infinite;
  }
  .btn-start::after {
    content:''; position:absolute; inset:0; border-radius:inherit;
    background: linear-gradient(135deg, rgba(255,255,255,0.35), transparent 60%);
  }
  .btn-start:hover { transform: translateY(-4px) scale(1.06) rotate(-1deg); box-shadow: 0 18px 40px rgba(255,107,157,0.6), 0 2px 0 rgba(255,255,255,0.5) inset; animation: none; }
  .btn-start:active { transform: scale(0.95); }
  @keyframes btnBounce {
    0%,100%{ transform: translateY(0) rotate(0deg); }
    50%    { transform: translateY(-5px) rotate(0.8deg); }
  }

  /* ── disconnect ── */
  .btn-disc {
    font-family: 'Nunito', sans-serif; font-weight: 700;
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); background: none; border: none; cursor: pointer;
    transition: color .2s; padding: 4px;
  }
  .btn-disc:hover { color: var(--pink); }

  /* ── TOPBAR ── */
  .topbar {
    position: absolute; top: 0; left: 0; right: 0; z-index: 10; height: 46px;
    background: rgba(255,255,255,0.85);
    border-bottom: 2px solid rgba(255,143,171,0.3);
    backdrop-filter: blur(16px);
    display: flex; align-items: center; gap: 10px; padding: 0 18px;
    font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 0.72rem;
    color: var(--muted); letter-spacing: 0.08em;
    box-shadow: 0 2px 12px rgba(255,143,171,0.15);
  }
  .topbar-logo {
    font-family: 'Fredoka One', cursive; font-size: 1rem;
    background: linear-gradient(135deg, #ff6b9d, #c77dff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .topbar-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #5edc8a; box-shadow: 0 0 7px #5edc8a;
    animation: blink 1.8s ease-in-out infinite; flex-shrink: 0;
  }
  .topbar-addr {
    background: linear-gradient(135deg, rgba(255,143,171,0.15), rgba(199,125,255,0.1));
    border: 1.5px solid rgba(255,143,171,0.3);
    border-radius: 999px; padding: 3px 14px;
    color: var(--text); font-size: 0.68rem;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;
  }
  .topbar-exit {
    margin-left: auto;
    font-family: 'Fredoka One', cursive; font-size: 0.82rem; letter-spacing: 0.04em;
    background: linear-gradient(135deg, rgba(255,143,171,0.15), rgba(255,143,171,0.08));
    border: 1.5px solid rgba(255,143,171,0.4);
    color: var(--pink); border-radius: 999px;
    padding: 6px 18px; cursor: pointer; transition: all .2s;
  }
  .topbar-exit:hover { background: linear-gradient(135deg, #ff8fab, #ffb3c6); color: white; border-color: transparent; box-shadow: 0 4px 14px rgba(255,143,171,0.4); }

  /* ─── Topbar Sync ─── */
.topbar-synced {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 16px;
  border-radius: 999px;
  border: 2px solid var(--yellow);
  background: rgba(255, 209, 102, 0.15);
  color: var(--yellow);
  font-family: 'Fredoka One', cursive;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(255, 217, 0, 0.2);
  transition: all 0.2s ease;
}

.topbar-synced:hover {
  transform: scale(1.05);
  background: rgba(255, 209, 102, 0.3) !important;
}

  /* ── GAME WRAPPER ── */
  .game-wrap {
    position: fixed; inset: 0; z-index: 200;
    animation: slideUp .5s cubic-bezier(.34,1.3,.64,1) both;
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
    /* ... kodingan CSS Sultan yang lain ... */

  /* ─── INVENTORY MODAL (Jelly Bag) ─── */
  .inv-ov {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(255, 235, 248, 0.6);
    backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    animation: modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* 🔀 FIX INPUT SWAP - PUTIH BERSIH */
  .inv-card input {
    background: #ffffff !important; /* Putih pekat biar gak ireng */
    color: var(--text) !important;
    border: 2px solid var(--pink2) !important;
    border-radius: 12px;
    padding: 12px;
    outline: none;
    font-family: 'Fredoka One', cursive;
    width: 100%;
    margin-bottom: 15px;
    text-align: center;
  }

  .inv-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .inv-title {
    font-family: 'Fredoka One', cursive; font-size: 1.8rem;
    background: linear-gradient(135deg, #ff6b9d, #c77dff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .inv-close {
    background: none; border: none; font-size: 1.5rem; color: var(--muted);
    cursor: pointer; transition: color 0.2s;
  }
  .inv-close:hover { color: var(--pink); }

  .inv-body {
    display: flex; gap: 24px; flex: 1; overflow: hidden;
  }

  /* 📦 KIRI: Grid Item (3 Vertikal x 3 Horizontal) */
  .inv-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 Horizontal */
    grid-template-rows: repeat(3, 1fr);    /* 3 Vertikal */
    gap: 12px;
    width: 60%;
    aspect-ratio: 1; /* Biar tetep kotak kayak contoh Sultan */
  }

  .inv-item {
    background: rgba(255, 255, 255, 0.6);
    border: 2px solid rgba(255, 143, 171, 0.25);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .inv-item:hover {
    transform: translateY(-3px) scale(1.05);
    border-color: var(--pink);
    background: rgba(255, 143, 171, 0.1);
  }
  .inv-item.active {
    border-color: var(--pink);
    background: rgba(255, 143, 171, 0.15);
    box-shadow: 0 0 15px rgba(255, 143, 171, 0.3);
  }

  /* 🖼️ KANAN: Preview Item (Detail) */
  .inv-preview {
    width: 40%;
    background: rgba(255, 255, 255, 0.7);
    border: 2px dashed rgba(255, 143, 171, 0.3);
    border-radius: 18px;
    padding: 20px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
  }
  .inv-prev-emoji {
    font-size: 4rem !important; /* Balik ke 4rem sesuai selera Sultan! */
    color: initial !important; /* RESET WARNA: Biar warna aslinya balik jek! */
    margin: 10px 0;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
  }
  .inv-prev-name {
    font-family: 'Fredoka One', cursive;
    font-size: 1.1rem; 
    color: var(--text);
    margin-top: 5px;
    white-space: nowrap;
  }
 .inv-prev-desc {
    font-size: 0.8rem !important;
    color: var(--muted);
    line-height: 1.4;
    overflow: visible !important; /* JANGAN KECROP! */
    white-space: normal !important;
  }

  iframe { position: absolute; top: 46px; left: 0; width: 100%; height: calc(100% - 46px); border: none; }
`

/* ─── Candy emojis floating up ─── */
const CANDIES = ['🍬', '🍭', '🫧', '🌸', '✨', '💗', '🍡', '🗿', '⭐', '🫐']
const FLOATERS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  emoji: CANDIES[i % CANDIES.length],
  left: `${3 + (i / 18) * 94}%`,
  delay: `${(i / 18) * 16}s`,
  duration: `${12 + (i % 5) * 3}s`,
  size: 0.9 + (i % 4) * 0.35,
}))

/* ─── Main UI ─── */
function JellyShooterUI() {
  const kit = useInterwovenKit()

  // ── Semua useState HARUS di atas, sebelum early return apapun ──
  const [gameActive, setGameActive] = useState(false)
  const [keplrAddress, setKeplrAddress] = useState('')
  // keplrReady = false selama Keplr popup belum di-approve
  // Ini yang BLOCK init15 dari muncul saat handshake berlangsung
  const [keplrReady, setKeplrReady] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [showInv, setShowInv] = useState(false)
  const [selectedItemIdx, setSelectedItemIdx] = useState(null)

  // 🍬 DATA ITEM (Inventory Sultan yang Gagah)
  const inventoryItems = [
    { id: 1, name: "STRAWBERRY", icon: "🍓", desc: "Starter Skin (Unlocked!)" },
    { id: 2, name: "BLUEBERRY", icon: "🫐", desc: "Unlocked from Mission 3" },
    { id: 3, name: "MINT", icon: "🌿", desc: "Unlocked from Mission 5" },
    { id: 4, name: "LEMON", icon: "🍋", desc: "Unlocked from Mission 6" },
    { id: 5, name: "DONUT", icon: "🍩", desc: "Slayer of Donut Bosses" },
    { id: 6, name: "RAINBOW", icon: "🌈", desc: "Legendary Jelly Master" },
    { id: 7, name: "GEM", icon: "💎", desc: "Bonus Raffle Item" },
    { id: 8, name: "TICKET", icon: "🎫", desc: "Free Entry Pass" },
    { id: 9, name: "MOAI", icon: "🗿", desc: "Secret Jangkung Item" },
  ]

  // Optional chaining — kit bisa null di render pertama,
  // tapi hooks tetap dipanggil (tidak boleh ada early return sebelum useEffect)
  const ikAddress = kit?.address ?? ''
  const openConnect = kit?.openConnect
  const disconnect = kit?.disconnect

  // 🛡️ SYNC KEPLR — Keplr adalah PRIORITAS MUTLAK
  // keplrReady tetap FALSE selama popup Keplr belum di-approve,
  // sehingga finalAddr tidak akan menampilkan init15 sama sekali.
  useEffect(() => {
    if (!ikAddress) {
      // Disconnect: reset semua
      setKeplrAddress('')
      setKeplrReady(false)
      localStorage.removeItem('jlySesAddr')
      return
    }

    // Mulai handshake — kunci finalAddr dulu
    setKeplrReady(false)
    let cancelled = false

    const fetchKeplr = async () => {
      try {
        if (window.keplr) {
          await window.keplr.enable('initiation-2')
          const signer = window.keplr.getOfflineSigner('initiation-2')
          const accounts = await signer.getAccounts()
          if (!cancelled && accounts?.[0]?.address) {
            setKeplrAddress(accounts[0].address)
            localStorage.setItem('jlySesAddr', accounts[0].address)
          } else if (!cancelled) {
            // Keplr ada tapi akun kosong — fallback ke ikAddress
            setKeplrAddress(ikAddress)
            localStorage.setItem('jlySesAddr', ikAddress)
          }
        } else {
          // Keplr tidak terinstall — pakai ikAddress
          if (!cancelled) {
            setKeplrAddress(ikAddress)
            localStorage.setItem('jlySesAddr', ikAddress)
          }
        }
      } catch {
        // User reject / error — fallback ke ikAddress
        if (!cancelled) {
          setKeplrAddress(ikAddress)
          localStorage.setItem('jlySesAddr', ikAddress)
        }
      } finally {
        // Baru unlock finalAddr setelah semuanya selesai
        if (!cancelled) setKeplrReady(true)
      }
    }

    fetchKeplr()
    return () => { cancelled = true } // cleanup kalau re-render/unmount
  }, [ikAddress])

  const handleDisconnect = () => {
    setGameActive(false)
    setKeplrAddress('')
    setKeplrReady(false)
    localStorage.removeItem('jlySesAddr')
    disconnect?.()
  }

  const finalAddr = !kit ? '' : keplrReady ? keplrAddress : ''

  return (
    <>
      <div className="jbg" />
      <div className="dots" />
      <div className="blob" style={{ width: 420, height: 420, background: '#ffb3c6', top: '-80px', left: '-60px' }} />
      <div className="blob" style={{ width: 300, height: 300, background: '#90e0ef', bottom: '-60px', left: '20%' }} />

      {FLOATERS.map(f => (
        <div key={f.id} className="candy" style={{ left: f.left, fontSize: `${f.size}rem`, animationDelay: f.delay, animationDuration: f.duration }}>{f.emoji}</div>
      ))}

      {/* ── CONNECT SCREEN ── */}
      {!gameActive && (
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="jcard">
            <div className="jtitle">JELLY<br />SHOOTER</div>
            <div className="jsub">🍬 Initia L2 · Powered by $JLY</div>
            <div className="divider"><span>🪼</span></div>

            {/* ─── ADDRESS PILL JANGKUNG (NASA EDITION) ─── */}
            <div style={{ minHeight: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              {finalAddr ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '1.5px solid var(--pink2)',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  boxShadow: '0 4px 15px rgba(255, 143, 171, 0.12)',
                  backdropFilter: 'blur(4px)'
                }}>
                  {/* Indikator Ijo Kedip */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#5edc8a',
                    boxShadow: '0 0 10px #5edc8a',
                    animation: 'pulse 2s infinite'
                  }} />

                  {/* Alamat Keplr init12 */}
                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'var(--text)',
                    letterSpacing: '0.02em'
                  }}>
                    {finalAddr.slice(0, 10)}...{finalAddr.slice(-6)}
                  </span>

                  {/* Label Synced */}
                  <span style={{
                    fontSize: '0.6rem',
                    color: 'var(--muted)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    background: 'rgba(255, 143, 171, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    letterSpacing: '0.05em'
                  }}>
                    SYNCED
                  </span>
                </div>
              ) : (
                <div className="await-text" style={{ fontSize: '0.75rem', letterSpacing: '0.12em', fontWeight: 700 }}>
                  Waiting for wallet ✨
                </div>
              )}
            </div>

            {/* ─── TOMBOL AKSI ─── */}

            {!finalAddr ? (
              <button className="btn-conn" onClick={() => openConnect?.()}>🍭 Connect Wallet</button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <button className="btn-start" onClick={() => setGameActive(true)}>🔫 START GAME!</button>
                <button className="btn-disc" onClick={handleDisconnect}>disconnect</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── GAME SCREEN ── */}
      {gameActive && (
        <div className="game-wrap">
          {/* ... kodingan topbar & iframe Sultan ... */}
          <div className="topbar">
            {/* 🔗 GENG KIRI: Swap dulu baru Bag/Inventory */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="topbar-synced" onClick={() => setShowSwap(true)} style={{ cursor: 'pointer', border: '2px solid var(--yellow)', padding: '4px 14px' }}>
                🔀 Swap $JLY
              </div>

              <span className="topbar-logo" onClick={() => setShowInv(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🎒 <span style={{ fontSize: '0.8rem', fontWeight: '900' }}>Inventory</span>
              </span>
            </div>

            <div className="topbar-dot" />

            {/* ✕ KANAN: Exit doang */}
            <button className="topbar-exit" onClick={() => setGameActive(false)}>
              ✕ Exit
            </button>
          </div>

          <iframe
            key={finalAddr}
            src={`${GAME_URL}?address=${encodeURIComponent(finalAddr)}`}
            title="Jelly Shooter Game"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
          />
        </div>
      )}

      {/* 🎒 JANGKUNG: TARUH DI SINI JEK! (STEP 3) */}
      {showInv && (
        <div className="inv-ov" onClick={() => setShowInv(false)}>
          <div className="inv-card" onClick={(e) => e.stopPropagation()}>

            <div className="inv-header">
              <div className="inv-title">Jelly Bag 🎒</div>
              <button className="inv-close" onClick={() => setShowInv(false)}>✕</button>
            </div>

            <div className="inv-body">
              {/* 📦 KIRI: Grid 3x3 */}
              <div className="inv-grid">
                {inventoryItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`inv-item ${selectedItemIdx === index ? 'active' : ''}`}
                    onClick={() => setSelectedItemIdx(index)}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>

              {/* 🖼️ KANAN: Preview Section */}
              <div className="inv-preview">
                {selectedItemIdx !== null ? (
                  <>
                    <div className="inv-prev-emoji">{inventoryItems[selectedItemIdx].icon}</div>
                    <div className="inv-prev-name">{inventoryItems[selectedItemIdx].name}</div>
                    <div className="inv-prev-desc">{inventoryItems[selectedItemIdx].desc}</div>
                    <button className="btn-conn" style={{ marginTop: 'auto', padding: '8px 20px', fontSize: '0.8rem' }} onClick={() => alert('Skin Equipped! 🍭')}>
                      Equip
                    </button>
                  </>
                ) : (
                  <div style={{ color: 'var(--muted)', fontSize: '.7rem', textAlign: 'center', marginTop: '40px' }}>
                    👈 Tap an item<br />to preview!
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🔀 JANGKUNG: SWAP MODAL SIMPEL (BIAR GAK ALERT DOANG) */}
      {showSwap && (
        <div className="inv-ov" onClick={() => setShowSwap(false)}>
          <div className="inv-card" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="inv-header">
              <div className="inv-title">Swap $JLY</div>
              <button className="inv-close" onClick={() => setShowSwap(false)}>✖️</button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: '15px', fontWeight: '800' }}>Convert $INIT to $JLY</div>
              <input type="number" placeholder="0.0" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid var(--pink2)', textAlign: 'center', marginBottom: '15px' }} />
              <button className="btn-start" style={{ width: '100%', fontSize: '1rem' }} onClick={() => alert('Initiating Swap on Chain... ⛓️')}>Execute Swap</button>
            </div>
          </div>
        </div>
      )}
    </> // <-- Penutup paling akhir
  )
}


/* ─── Root ─── */
export default function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    injectStyles(interwovenKitStyles)
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    return () => document.head.removeChild(tag)
  }, [])

  if (!mounted) return null

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <InterwovenKitProvider {...TESTNET} defaultChainId="initiation-2">
          <JellyShooterUI />
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}