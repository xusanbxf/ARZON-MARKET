import { useState, useEffect } from "react";

const P = { HOME: "home", SHOP: "shop", PRODUCT: "product", CART: "cart", ORDER: "order", SUCCESS: "success", ADMIN: "admin" };
const BOT_TOKEN = "8754873465:AAFezETbX84Cwnj_lmxmBpSluIA8xG1KSZM";
const CHAT_ID = "627785337";
const DELIVERY_FEE = 35000;

function serviceFee(price) {
  const steps = Math.floor(price / 100000);
  return 15000 + steps * 10000;
}
function fmt(n) { return Number(n).toLocaleString("uz-UZ") + " so'm"; }

// REAL MAHSULOTLAR — Xitoy narxi (so'm), O'zbek bozor narxi, Kargo
const PRODUCTS = [
  {
    id: 1,
    nameUz: "Sport krossovka erkaklar uchun",
    nameRu: "Мужские спортивные кроссовки",
    source: "pinduoduo",
    cnPrice: 95000,      // ~50 yuan
    uzBozorPrice: 650000, // O'zbekistonda bozorda
    cargo: 128000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Kiyim",
    rating: 4.8, sold: 12400, weight: "~800g",
  },
  {
    id: 2,
    nameUz: "Ayollar sport krossovkasi",
    nameRu: "Женские спортивные кроссовки",
    source: "pinduoduo",
    cnPrice: 76000,
    uzBozorPrice: 520000,
    cargo: 128000,
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
    category: "Kiyim",
    rating: 4.7, sold: 9800, weight: "~700g",
  },
  {
    id: 3,
    nameUz: "TWS simsiz naushnik",
    nameRu: "TWS беспроводные наушники",
    source: "pinduoduo",
    cnPrice: 38000,
    uzBozorPrice: 280000,
    cargo: 25000,
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    category: "Elektronika",
    rating: 4.6, sold: 34000, weight: "~200g",
  },
  {
    id: 4,
    nameUz: "Aqlli soat Smart Watch",
    nameRu: "Умные часы Smart Watch",
    source: "pinduoduo",
    cnPrice: 152000,
    uzBozorPrice: 980000,
    cargo: 45000,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Elektronika",
    rating: 4.5, sold: 7600, weight: "~350g",
  },
  {
    id: 5,
    nameUz: "Erkaklar futbolkasi (5 ta to'plam)",
    nameRu: "Мужские футболки (набор 5 шт)",
    source: "taobao",
    cnPrice: 57000,
    uzBozorPrice: 350000,
    cargo: 90000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Kiyim",
    rating: 4.7, sold: 28000, weight: "~700g",
  },
  {
    id: 6,
    nameUz: "Bluetooth kalonka portativ",
    nameRu: "Портативная Bluetooth колонка",
    source: "taobao",
    cnPrice: 95000,
    uzBozorPrice: 580000,
    cargo: 64000,
    img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "Elektronika",
    rating: 4.8, sold: 15600, weight: "~500g",
  },
  {
    id: 7,
    nameUz: "Elektr choynак 1.8L po'lat",
    nameRu: "Электрический чайник 1.8L сталь",
    source: "taobao",
    cnPrice: 76000,
    uzBozorPrice: 420000,
    cargo: 128000,
    img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
    category: "Uy jihozlari",
    rating: 4.9, sold: 8900, weight: "~1kg",
  },
  {
    id: 8,
    nameUz: "Termos po'lat 500ml",
    nameRu: "Стальной термос 500мл",
    source: "pinduoduo",
    cnPrice: 38000,
    uzBozorPrice: 220000,
    cargo: 64000,
    img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    category: "Uy jihozlari",
    rating: 4.9, sold: 45000, weight: "~500g",
  },
  {
    id: 9,
    nameUz: "Erkaklar shortiki sport",
    nameRu: "Мужские спортивные шорты",
    source: "taobao",
    cnPrice: 28500,
    uzBozorPrice: 180000,
    cargo: 45000,
    img: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&h=400&fit=crop",
    category: "Kiyim",
    rating: 4.6, sold: 19000, weight: "~350g",
  },
  {
    id: 10,
    nameUz: "Qurilma uchun umumiy zaryadlovchi",
    nameRu: "Универсальный зарядный кабель",
    source: "pinduoduo",
    cnPrice: 9500,
    uzBozorPrice: 75000,
    cargo: 19000,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "Elektronika",
    rating: 4.7, sold: 67000, weight: "~150g",
  },
  {
    id: 11,
    nameUz: "Bolalar velosipedi 16 dyuym",
    nameRu: "Детский велосипед 16 дюймов",
    source: "pinduoduo",
    cnPrice: 380000,
    uzBozorPrice: 1800000,
    cargo: 384000,
    img: "https://images.unsplash.com/photo-1575585269294-7d28bb912db8?w=400&h=400&fit=crop",
    category: "Bolalar",
    rating: 4.8, sold: 4300, weight: "~3kg",
  },
  {
    id: 12,
    nameUz: "Ayollar sport shimи yoga",
    nameRu: "Женские спортивные леггинсы yoga",
    source: "taobao",
    cnPrice: 47500,
    uzBozorPrice: 320000,
    cargo: 64000,
    img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop",
    category: "Kiyim",
    rating: 4.8, sold: 22000, weight: "~500g",
  },
];

const CATS = ["Barchasi", "Kiyim", "Elektronika", "Uy jihozlari", "Bolalar"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#f7f5f2;
  --white:#ffffff;
  --dark:#111111;
  --mid:#888;
  --light:#e8e4de;
  --border:#e0dbd3;
  --gold:#c8973a;
  --gold-light:#fdf3e3;
  --red:#d94f3d;
  --green:#22863a;
  --pdd:#e53935;
  --tao:#f57c00;
}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--dark);}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background:var(--light);border-radius:10px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes shimmer{0%{opacity:0.6}50%{opacity:1}100%{opacity:0.6}}
.fadeUp{animation:fadeUp 0.55s ease both;}
.fadeUp2{animation:fadeUp 0.55s 0.1s ease both;}
.fadeUp3{animation:fadeUp 0.55s 0.2s ease both;}
.hover-lift{transition:transform 0.22s ease,box-shadow 0.22s ease;}
.hover-lift:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(0,0,0,0.1);}
input:focus,select:focus{outline:none;border-color:var(--dark)!important;}
`;

async function sendTelegram(order) {
  const items = order.items.map(i => `  • ${i.nameUz} x${i.qty} — ${fmt((i.cnPrice + i.cargo) * i.qty)}`).join("\n");
  const payLabel = order.payment === "click" ? "💳 Click" : order.payment === "payme" ? "🟢 Payme" : "💵 Naqd";
  const text = `🛍 *YANGI ZAKAZ!*\n\n👤 *Mijoz:* ${order.name}\n📞 *Tel:* ${order.phone}\n📍 *Manzil:* ${order.address}\n💳 *To'lov:* ${payLabel}\n\n📦 *Tovarlar:*\n${items}\n\n🔧 Xizmat: ${fmt(order.svc)}\n🚚 Yetkazish: ${fmt(DELIVERY_FEE)}\n💰 *Jami: ${fmt(order.total)}*\n🕐 ${order.date}`;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown" })
    });
  } catch (e) {}
}

export default function App() {
  const [page, setPage] = useState(P.HOME);
  const [sel, setSel] = useState(null);
  const [cart, setCart] = useState([]);
  const [cat, setCat] = useState("Barchasi");
  const [src, setSrc] = useState("Barchasi");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [lang, setLang] = useState("uz");

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartGoods = cart.reduce((s, i) => s + (i.cnPrice + i.cargo) * i.qty, 0);
  const cartSvc = serviceFee(cartGoods);
  const cartTotal = cartGoods + cartSvc + DELIVERY_FEE;

  const addToCart = (p) => setCart(prev => {
    const ex = prev.find(i => i.id === p.id);
    return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
  });
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => qty < 1 ? removeFromCart(id) : setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));

  const placeOrder = async (info) => {
    const order = { id: Date.now(), ...info, items: cart, svc: cartSvc, total: cartTotal, date: new Date().toLocaleString(), status: "Yangi" };
    setOrders(prev => [order, ...prev]);
    await sendTelegram(order);
    setCart([]);
    setPage(P.SUCCESS);
  };

  const filtered = PRODUCTS.filter(p => {
    const cOk = cat === "Barchasi" || p.category === cat;
    const sOk = src === "Barchasi" || p.source === src;
    const qOk = !search || p.nameUz.toLowerCase().includes(search.toLowerCase()) || p.nameRu.toLowerCase().includes(search.toLowerCase());
    return cOk && sOk && qOk;
  });

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Nav page={page} setPage={setPage} cartCount={cartCount} lang={lang} setLang={setLang} />
        {page === P.HOME && <Home setPage={setPage} lang={lang} />}
        {page === P.SHOP && <Shop products={filtered} cat={cat} setCat={setCat} src={src} setSrc={setSrc} search={search} setSearch={setSearch} lang={lang} addToCart={addToCart} cart={cart} onProd={p => { setSel(p); setPage(P.PRODUCT); }} />}
        {page === P.PRODUCT && sel && <ProductPage p={sel} lang={lang} addToCart={addToCart} setPage={setPage} cart={cart} />}
        {page === P.CART && <CartPage cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} setPage={setPage} cartGoods={cartGoods} cartSvc={cartSvc} cartTotal={cartTotal} />}
        {page === P.ORDER && <OrderPage cartTotal={cartTotal} cartSvc={cartSvc} cart={cart} placeOrder={placeOrder} setPage={setPage} />}
        {page === P.SUCCESS && <SuccessPage setPage={setPage} />}
        {page === P.ADMIN && <AdminPage orders={orders} />}
      </div>
    </>
  );
}

function Nav({ page, setPage, cartCount, lang, setLang }) {
  const [sc, setSc] = useState(false);
  useEffect(() => { const fn = () => setSc(window.scrollY > 20); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 300, background: sc ? "rgba(247,245,242,0.96)" : "var(--bg)", backdropFilter: "blur(12px)", borderBottom: sc ? "1px solid var(--border)" : "1px solid transparent", transition: "all 0.3s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => setPage(P.HOME)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "var(--dark)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏪</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: "var(--dark)", letterSpacing: -0.3 }}>ARZON<span style={{ color: "var(--gold)" }}>MARKET</span></div>
            <div style={{ fontSize: 9, color: "var(--mid)", letterSpacing: 1.2, textTransform: "uppercase" }}>Xitoydan to'g'ridan-to'g'ri</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setLang(lang === "uz" ? "ru" : "uz")} style={{ background: "var(--light)", border: "none", color: "var(--dark)", borderRadius: 7, padding: "5px 10px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>{lang === "uz" ? "RU" : "UZ"}</button>
          {[[P.HOME, "Bosh sahifa"], [P.SHOP, "Do'kon"]].map(([pg, label]) => (
            <button key={pg} onClick={() => setPage(pg)} style={{ background: page === pg ? "var(--dark)" : "transparent", color: page === pg ? "#fff" : "var(--mid)", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}>{label}</button>
          ))}
          <button onClick={() => setPage(P.CART)} style={{ position: "relative", background: "var(--dark)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            🛒 Savat
            {cartCount > 0 && <span style={{ background: "var(--red)", color: "#fff", borderRadius: "50%", width: 19, height: 19, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{cartCount}</span>}
          </button>
          <button onClick={() => setPage(P.ADMIN)} style={{ background: "var(--light)", border: "none", color: "var(--dark)", borderRadius: 9, padding: "8px 12px", fontSize: 13, cursor: "pointer" }}>📊</button>
        </div>
      </div>
    </nav>
  );
}

function Home({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "var(--dark)", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: "15%", left: "8%", width: 380, height: 380, background: "radial-gradient(circle, rgba(200,151,58,0.13) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 260, height: 260, background: "radial-gradient(circle, rgba(217,79,61,0.09) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        </div>
        <div style={{ position: "relative", textAlign: "center", maxWidth: 780, padding: "0 24px" }}>
          <div className="fadeUp" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,151,58,0.13)", border: "1px solid rgba(200,151,58,0.28)", borderRadius: 50, padding: "6px 18px", marginBottom: 30 }}>
            <span style={{ width: 6, height: 6, background: "var(--gold)", borderRadius: "50%", display: "inline-block", animation: "shimmer 2s infinite" }} />
            <span style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: 1.5 }}>PINDUODUO & TAOBAO — RASMIY NARXLAR</span>
          </div>
          <h1 className="fadeUp2" style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(38px,6.5vw,68px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 22, letterSpacing: -2 }}>
            Xitoy narxida<br /><span style={{ color: "var(--gold)" }}>uyingizgacha</span>
          </h1>
          <p className="fadeUp3" style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            O'zbek bozoridan <strong style={{ color: "rgba(255,255,255,0.75)" }}>3–5 baravar arzon</strong>.<br />
            Hech qanday yashirin to'lov yo'q.
          </p>
          <div className="fadeUp3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage(P.SHOP)} style={{ background: "var(--gold)", color: "var(--dark)", border: "none", borderRadius: 50, padding: "15px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
              Xarid qilish →
            </button>
            <button style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 50, padding: "15px 32px", fontSize: 15, cursor: "pointer" }}>
              Qanday ishlaydi?
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "var(--gold)", padding: "18px 24px", display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap" }}>
        {[["3–5x", "Bozordan arzon"], ["10 kun", "Yetkazish"], ["0%", "Yashirin to'lov"], ["24/7", "Qo'llab-quvvatlash"]].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "var(--dark)" }}>{v}</div>
            <div style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 500, marginTop: 1 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tanlangan mahsulotlar */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "70px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 38 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Mashhur</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "var(--dark)", letterSpacing: -1 }}>Trend mahsulotlar</h2>
          </div>
          <button onClick={() => setPage(P.SHOP)} style={{ background: "var(--dark)", color: "#fff", border: "none", borderRadius: 50, padding: "10px 24px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Barchasi →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {PRODUCTS.slice(0, 4).map(p => <HomeCard key={p.id} p={p} onClick={() => setPage(P.SHOP)} />)}
        </div>
      </div>

      {/* Narx tushuntirish */}
      <div style={{ background: "var(--dark)", padding: "70px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>Shaffoflik</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>Nima uchun bizda arzon?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))", gap: 14 }}>
            {[
              ["🇨🇳", "Xitoy narxi", "To'g'ridan-to'g'ri zavod narxi", "#fbbf24"],
              ["✈️", "Kargo", "Tovar og'irligiga qarab hisob", "#60a5fa"],
              ["🔧", "Xizmat haqqi", "100 mingdan 15 000\nHar 100 ming uchun +10 000", "#34d399"],
              ["🚚", "Yetkazish", "35 000 so'm Toshkent bo'ylab", "#f472b6"],
            ].map(([icon, t, d, c]) => (
              <div key={t} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: c, marginBottom: 6, fontSize: 14 }}>{t}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--dark)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>ARZON<span style={{ color: "var(--gold)" }}>MARKET</span></div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>Xitoydan to'g'ridan-to'g'ri • O'zbekiston 🇺🇿</div>
      </div>
    </div>
  );
}

function HomeCard({ p, onClick }) {
  const myPrice = p.cnPrice + p.cargo;
  const saved = p.uzBozorPrice - myPrice;
  return (
    <div onClick={onClick} className="hover-lift" style={{ background: "var(--white)", borderRadius: 18, overflow: "hidden", cursor: "pointer", border: "1px solid var(--border)" }}>
      <div style={{ position: "relative" }}>
        <img src={p.img} alt="" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", top: 10, left: 10, background: p.source === "pinduoduo" ? "var(--pdd)" : "var(--tao)", color: "#fff", fontSize: 10, borderRadius: 6, padding: "3px 8px", fontWeight: 800 }}>
          {p.source === "pinduoduo" ? "拼多多" : "淘宝"}
        </div>
        <div style={{ position: "absolute", top: 10, right: 10, background: "#22c55e", color: "#fff", fontSize: 10, borderRadius: 6, padding: "3px 8px", fontWeight: 800 }}>
          -{Math.round((saved / p.uzBozorPrice) * 100)}%
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)", marginBottom: 8, lineHeight: 1.4 }}>{p.nameUz}</div>
        <div style={{ fontSize: 12, color: "var(--mid)", textDecoration: "line-through", marginBottom: 2 }}>Bozorda: {fmt(p.uzBozorPrice)}</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 800, color: "var(--dark)" }}>{fmt(myPrice)}</div>
        <div style={{ fontSize: 11, color: "#22863a", fontWeight: 600, marginTop: 2 }}>Tejash: {fmt(saved)}</div>
      </div>
    </div>
  );
}

function Shop({ products, cat, setCat, src, setSrc, search, setSearch, lang, addToCart, cart, onProd }) {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "30px 24px" }}>
      <div style={{ marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Mahsulot qidirish..."
          style={{ width: "100%", padding: "13px 20px", borderRadius: 50, border: "1.5px solid var(--border)", background: "var(--white)", fontSize: 15, fontFamily: "inherit", transition: "border 0.2s" }} />
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? "var(--dark)" : "var(--white)", color: cat === c ? "#fff" : "var(--mid)", border: "1px solid " + (cat === c ? "var(--dark)" : "var(--border)"), borderRadius: 50, padding: "7px 16px", fontSize: 13, cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 26, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 7 }}>
          {[["Barchasi", "var(--dark)"], ["pinduoduo", "var(--pdd)"], ["taobao", "var(--tao)"]].map(([s, color]) => (
            <button key={s} onClick={() => setSrc(s)} style={{ background: src === s ? color : "var(--white)", color: src === s ? "#fff" : "var(--mid)", border: "1px solid " + (src === s ? color : "var(--border)"), borderRadius: 50, padding: "7px 16px", fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>
              {s === "pinduoduo" ? "🔴 Pinduoduo" : s === "taobao" ? "🟠 Taobao" : "Barchasi"}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: "var(--mid)" }}>{products.length} ta mahsulot</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
        {products.map(p => <ProdCard key={p.id} p={p} lang={lang} addToCart={addToCart} cart={cart} onClick={() => onProd(p)} />)}
      </div>
    </div>
  );
}

function ProdCard({ p, lang, addToCart, cart, onClick }) {
  const inCart = cart.find(i => i.id === p.id);
  const myPrice = p.cnPrice + p.cargo;
  const saved = p.uzBozorPrice - myPrice;
  const savePct = Math.round((saved / p.uzBozorPrice) * 100);

  return (
    <div className="hover-lift" style={{ background: "var(--white)", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", cursor: "pointer" }} onClick={onClick}>
        <img src={p.img} alt="" style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", top: 11, left: 11, background: p.source === "pinduoduo" ? "var(--pdd)" : "var(--tao)", color: "#fff", fontSize: 10, borderRadius: 6, padding: "3px 9px", fontWeight: 800 }}>
          {p.source === "pinduoduo" ? "拼多多 Pinduoduo" : "淘宝 Taobao"}
        </div>
        <div style={{ position: "absolute", top: 11, right: 11, background: "#16a34a", color: "#fff", fontSize: 11, borderRadius: 20, padding: "3px 10px", fontWeight: 800 }}>
          -{savePct}%
        </div>
        <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 10, borderRadius: 20, padding: "3px 9px" }}>
          ⭐ {p.rating} · {p.sold.toLocaleString()}+
        </div>
      </div>

      <div style={{ padding: "16px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: 14, lineHeight: 1.4, marginBottom: 2 }}>{lang === "uz" ? p.nameUz : p.nameRu}</div>
          <div style={{ fontSize: 11, color: "var(--mid)" }}>{lang === "uz" ? p.nameRu : p.nameUz}</div>
        </div>

        {/* 3 ta narx */}
        <div style={{ background: "var(--bg)", borderRadius: 12, padding: "11px 13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: "var(--mid)" }}>🇨🇳 Xitoyda:</span>
            <span style={{ color: "var(--mid)", fontWeight: 600 }}>{fmt(p.cnPrice)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
            <span style={{ color: "var(--mid)" }}>🇺🇿 Bozorda:</span>
            <span style={{ color: "var(--red)", fontWeight: 600, textDecoration: "line-through" }}>{fmt(p.uzBozorPrice)}</span>
          </div>
          <div style={{ borderTop: "1px dashed var(--border)", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--dark)", fontWeight: 700 }}>Bizda:</span>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--dark)" }}>{fmt(myPrice)}</span>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#16a34a", fontWeight: 600, marginTop: 3 }}>
            💰 Tejash: {fmt(saved)}
          </div>
        </div>

        <button onClick={() => addToCart(p)} style={{ padding: "11px 0", background: inCart ? "var(--dark)" : "var(--gold)", color: inCart ? "var(--gold)" : "var(--dark)", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s", marginTop: "auto" }}>
          {inCart ? `✓ Savatda (${inCart.qty} ta)` : "+ Savatga"}
        </button>
      </div>
    </div>
  );
}

function ProductPage({ p, lang, addToCart, setPage, cart }) {
  const inCart = cart.find(i => i.id === p.id);
  const myPrice = p.cnPrice + p.cargo;
  const svc = serviceFee(myPrice);
  const total = myPrice + svc + DELIVERY_FEE;
  const saved = p.uzBozorPrice - myPrice;
  const savePct = Math.round((saved / p.uzBozorPrice) * 100);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 24px" }}>
      <button onClick={() => setPage(P.SHOP)} style={{ background: "none", border: "none", color: "var(--mid)", fontSize: 14, cursor: "pointer", marginBottom: 22, fontFamily: "inherit" }}>← Orqaga</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, background: "var(--white)", borderRadius: 22, padding: 32, border: "1px solid var(--border)" }}>
        <div style={{ position: "relative" }}>
          <img src={p.img} alt="" style={{ width: "100%", borderRadius: 16, objectFit: "cover", aspectRatio: "4/5" }} />
          <div style={{ position: "absolute", top: 12, right: 12, background: "#16a34a", color: "#fff", fontSize: 14, borderRadius: 10, padding: "5px 12px", fontWeight: 800 }}>-{savePct}%</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: p.source === "pinduoduo" ? "#fee2e2" : "#fff7ed", borderRadius: 8, padding: "5px 12px", width: "fit-content" }}>
            <span style={{ color: p.source === "pinduoduo" ? "var(--pdd)" : "var(--tao)", fontSize: 12, fontWeight: 700 }}>
              {p.source === "pinduoduo" ? "拼多多 Pinduoduo" : "淘宝 Taobao"}
            </span>
          </div>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "var(--dark)", lineHeight: 1.3, marginBottom: 4 }}>{lang === "uz" ? p.nameUz : p.nameRu}</h1>
            <div style={{ fontSize: 13, color: "var(--mid)" }}>{lang === "uz" ? p.nameRu : p.nameUz}</div>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ color: "var(--gold)" }}>{"★".repeat(Math.floor(p.rating))}</span>
            <span style={{ fontSize: 12, color: "var(--mid)" }}>{p.rating} · {p.sold.toLocaleString()}+ sotilgan</span>
          </div>

          {/* Narx taqqoslash */}
          <div style={{ background: "var(--bg)", borderRadius: 16, padding: 18, border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 12, fontSize: 13 }}>Narx taqqoslanishi</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
              <span style={{ color: "var(--mid)" }}>🇨🇳 Xitoyda (zavod narxi):</span>
              <span style={{ color: "var(--mid)", fontWeight: 600 }}>{fmt(p.cnPrice)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
              <span style={{ color: "var(--mid)" }}>✈️ Kargo:</span>
              <span style={{ color: "var(--mid)", fontWeight: 600 }}>{fmt(p.cargo)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
              <span style={{ color: "var(--mid)" }}>🔧 Xizmat haqqi:</span>
              <span style={{ color: "var(--mid)", fontWeight: 600 }}>{fmt(svc)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 12 }}>
              <span style={{ color: "var(--mid)" }}>🚚 Yetkazish:</span>
              <span style={{ color: "var(--mid)", fontWeight: 600 }}>{fmt(DELIVERY_FEE)}</span>
            </div>
            <div style={{ background: "var(--white)", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--mid)", textDecoration: "line-through" }}>O'zbek bozori: {fmt(p.uzBozorPrice)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <span style={{ fontWeight: 700, color: "var(--dark)", fontSize: 14 }}>Bizda jami:</span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "var(--dark)" }}>{fmt(total)}</span>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "#16a34a", fontWeight: 700, marginTop: 2 }}>💰 Tejash: {fmt(p.uzBozorPrice - myPrice)}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--mid)", flexWrap: "wrap" }}>
            <span>📦 {p.weight}</span><span>•</span><span>🚚 10 kunda yetkazish</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
            <button onClick={() => addToCart(p)} style={{ flex: 1, padding: "13px 0", background: inCart ? "var(--dark)" : "var(--gold)", color: inCart ? "var(--gold)" : "var(--dark)", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
              {inCart ? `✓ Savatda (${inCart.qty} ta)` : "🛒 Savatga"}
            </button>
            <button onClick={() => { addToCart(p); setPage(P.CART); }} style={{ padding: "13px 20px", background: "var(--dark)", color: "#fff", border: "none", borderRadius: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Zakaz →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, removeFromCart, updateQty, setPage, cartGoods, cartSvc, cartTotal }) {
  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: "90px 24px" }}>
      <div style={{ fontSize: 60, display: "inline-block", animation: "float 3s infinite" }}>🛒</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "var(--dark)", marginTop: 18, marginBottom: 8 }}>Savat bo'sh</div>
      <div style={{ color: "var(--mid)", marginBottom: 24 }}>Do'kondan mahsulot qo'shing</div>
      <button onClick={() => setPage(P.SHOP)} style={{ background: "var(--dark)", color: "#fff", border: "none", borderRadius: 50, padding: "12px 30px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Do'konga o'tish</button>
    </div>
  );
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "30px 24px" }}>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "var(--dark)", marginBottom: 22, letterSpacing: -0.5 }}>Savatingiz</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 22 }}>
        {cart.map(item => {
          const ip = item.cnPrice + item.cargo;
          return (
            <div key={item.id} style={{ background: "var(--white)", borderRadius: 15, padding: 15, display: "flex", gap: 14, alignItems: "center", border: "1px solid var(--border)" }}>
              <img src={item.img} alt="" style={{ width: 68, height: 68, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "var(--dark)", fontSize: 14, marginBottom: 3 }}>{item.nameUz}</div>
                <div style={{ fontSize: 11, color: "var(--mid)" }}>🇨🇳 {fmt(item.cnPrice)} + ✈️ {fmt(item.cargo)}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "var(--dark)", fontSize: 15, marginTop: 2 }}>{fmt(ip * item.qty)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
                <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 30, height: 30, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 7, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>−</button>
                <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 30, height: 30, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 7, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>+</button>
                <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "var(--red)", fontSize: 17, cursor: "pointer", marginLeft: 2 }}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "var(--white)", borderRadius: 18, padding: 22, border: "1px solid var(--border)" }}>
        {[["Tovarlar + Kargo", fmt(cartGoods)], ["Xizmat haqqi", fmt(cartSvc)], ["Yetkazish", fmt(DELIVERY_FEE)]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--mid)", marginBottom: 9 }}><span>{l}</span><span>{v}</span></div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 13, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--dark)" }}>Jami</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "var(--dark)" }}>{fmt(cartTotal)}</span>
        </div>
        <button onClick={() => setPage(P.ORDER)} style={{ width: "100%", padding: "14px 0", background: "var(--dark)", color: "#fff", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>Zakaz berish →</button>
      </div>
    </div>
  );
}

function OrderPage({ cartTotal, cartSvc, cart, placeOrder, setPage }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("click");
  const [loading, setLoading] = useState(false);
  const ok = name && phone && address;
  const inp = { width: "100%", padding: "12px 15px", borderRadius: 11, border: "1.5px solid var(--border)", fontSize: 15, fontFamily: "inherit", background: "var(--bg)", marginBottom: 11, transition: "border 0.2s" };
  const handle = async () => { if (!ok || loading) return; setLoading(true); await placeOrder({ name, phone, address, payment }); setLoading(false); };
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "30px 24px" }}>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "var(--dark)", marginBottom: 26, letterSpacing: -0.5 }}>Zakaz rasmiylash</h2>
      <div style={{ background: "var(--white)", borderRadius: 18, padding: 22, border: "1px solid var(--border)", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 14 }}>Shaxsiy ma'lumotlar</div>
        <input style={inp} placeholder="Ism va familiya" value={name} onChange={e => setName(e.target.value)} />
        <input style={inp} placeholder="+998 90 000 00 00" value={phone} onChange={e => setPhone(e.target.value)} />
        <input style={{ ...inp, marginBottom: 0 }} placeholder="Manzil: tuman, ko'cha, uy" value={address} onChange={e => setAddress(e.target.value)} />
      </div>
      <div style={{ background: "var(--white)", borderRadius: 18, padding: 22, border: "1px solid var(--border)", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 13 }}>To'lov usuli</div>
        <div style={{ display: "flex", gap: 9 }}>
          {[["click", "💳 Click"], ["payme", "🟢 Payme"], ["cash", "💵 Naqd"]].map(([v, l]) => (
            <button key={v} onClick={() => setPayment(v)} style={{ flex: 1, padding: "10px 0", background: payment === v ? "var(--dark)" : "var(--bg)", color: payment === v ? "#fff" : "var(--mid)", border: "1.5px solid " + (payment === v ? "var(--dark)" : "var(--border)"), borderRadius: 11, fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--gold-light)", border: "1.5px solid var(--gold)", borderRadius: 14, padding: 18, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--dark)", fontSize: 14, fontWeight: 600 }}>Jami to'lov</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "var(--dark)" }}>{fmt(cartTotal)}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--mid)", marginTop: 5 }}>🚚 10 kun ichida yetkaziladi</div>
      </div>
      <button disabled={!ok || loading} onClick={handle} style={{ width: "100%", padding: "15px 0", background: ok ? "var(--dark)" : "var(--light)", color: ok ? "#fff" : "var(--mid)", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: ok ? "pointer" : "not-allowed", fontFamily: "'Syne',sans-serif", transition: "all 0.2s" }}>
        {loading ? "Yuborilmoqda..." : "✅ Zakazni tasdiqlash"}
      </button>
    </div>
  );
}

function SuccessPage({ setPage }) {
  return (
    <div style={{ textAlign: "center", padding: "90px 24px", animation: "scaleIn 0.5s ease" }}>
      <div style={{ fontSize: 70, display: "inline-block", animation: "float 3s infinite" }}>🎉</div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: "var(--dark)", marginTop: 22, marginBottom: 10, letterSpacing: -1 }}>Zakaz qabul qilindi!</h2>
      <p style={{ fontSize: 16, color: "var(--mid)", lineHeight: 1.8, maxWidth: 400, margin: "0 auto 30px" }}>
        Xitoydan avtomatik buyurtma berildi.<br />
        <strong style={{ color: "var(--dark)" }}>10 kun ichida</strong> uyingizga yetkaziladi.<br />
        Telegramda xabar yuborildi 📱
      </p>
      <button onClick={() => setPage(P.SHOP)} style={{ background: "var(--dark)", color: "#fff", border: "none", borderRadius: 50, padding: "13px 36px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Yana xarid qilish →</button>
    </div>
  );
}

function AdminPage({ orders }) {
  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const totalSvc = orders.reduce((s, o) => s + o.svc, 0);
  const totalDel = orders.length * DELIVERY_FEE;
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "30px 24px" }}>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "var(--dark)", marginBottom: 22, letterSpacing: -0.5 }}>📊 Admin paneli</h2>
      <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 14, padding: 18, marginBottom: 22 }}>
        <div style={{ fontWeight: 700, color: "#1d4ed8", marginBottom: 6 }}>📱 @Ciromarketbot — Ulangan ✅</div>
        <div style={{ fontSize: 13, color: "#1e40af" }}>Har bir zakazda Telegramga avtomatik xabar keladi</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))", gap: 14, marginBottom: 26 }}>
        {[["📦", "Jami zakazlar", orders.length + " ta", "var(--dark)"], ["💵", "Jami tushum", fmt(totalRev), "#15803d"], ["🔧", "Xizmat daromadi", fmt(totalSvc), "#1d4ed8"], ["🚚", "Yetkazish daromadi", fmt(totalDel), "#b45309"]].map(([icon, title, val, color]) => (
          <div key={title} style={{ background: "var(--white)", borderRadius: 14, padding: 18, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 22, marginBottom: 7 }}>{icon}</div>
            <div style={{ fontSize: 12, color: "var(--mid)", marginBottom: 4 }}>{title}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 21, fontWeight: 800, color }}>{val}</div>
          </div>
        ))}
      </div>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 56, color: "var(--mid)", background: "var(--white)", borderRadius: 18, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>Hali zakazlar yo'q
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o, i) => (
            <div key={o.id} style={{ background: "var(--white)", borderRadius: 14, padding: "16px 20px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 3 }}>#{orders.length - i} — {o.name}</div>
                <div style={{ fontSize: 13, color: "var(--mid)" }}>{o.phone} · {o.address}</div>
                <div style={{ fontSize: 12, color: "var(--mid)", marginTop: 2 }}>{o.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--dark)" }}>{fmt(o.total)}</div>
                <div style={{ display: "inline-block", background: "#dcfce7", color: "#15803d", fontSize: 11, borderRadius: 20, padding: "2px 11px", marginTop: 4, fontWeight: 700 }}>✓ {o.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

