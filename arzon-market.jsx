import React from 'react';
import { useState, useEffect } from "react";
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

// Эски маҳсулотлар ўчирилди. Энди рўйхат фақат жадвалдан тўлади.
const SPREADSHEET_ID = "113Ju9cv51_2zh5a1-DUOKBk5mZcb1fXNh4_12ZSOV1E";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

export default function App() {
  const [page, setPage] = useState(P.HOME);
  const [cart, setCart] = useState([]);
  const [selProd, setSelProd] = useState(null);
  const [lang, setLang] = useState("uz");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        try {
          const jsonText = text.substring(47, text.length - 2);
          const json = JSON.parse(jsonText);
          const rows = json.table.rows;

          const fetched = rows.map((r, i) => {
            const c = r.c;
            const cnPrice = c[4] ? Number(c[4].v) : 0;
            const uzBozorPrice = c[5] ? Number(c[5].v) : 0;
            const cargo = c[6] ? Number(c[6].v) : 0;

            return {
              id: i + 100,
              nameUz: c[1] ? c[1].v : "",
              nameRu: c[2] ? c[2].v : "",
              source: c[3] ? c[3].v : "pinduoduo",
              cnPrice,
              uzBozorPrice,
              cargo,
              img: c[7] ? c[7].v : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop",
              descUz: c[8] ? c[8].v : "",
              descRu: c[9] ? c[9].v : "",
            };
          });

          setProducts(fetched);
        } catch (e) {
          console.error("Xatolik:", e);
        } finally {
          setLoading(false);
        }
      })
      .error(() => setLoading(false));
  }, []);

  const t = {
    uz: { title: "Xitoy narxida uyingizgacha", sub: "Do'kon va bozorlardan 3-5 baravar arzon. To'g'ridan-to'g'ri yetkazib berish.", shopNow: "Do'konni ko'rish", how: "Qanday ishlaydi?", menuShop: "Do'kon", menuCart: "Savat", menuAdmin: "Admin", back: "Orqaga", buy: "Sotib olish", size: "O'lcham", color: "Rang", link: "Xitoy saytidagi havola", original: "Asl havola", calc: "Narx qanday hisoblanadi?", cn: "Xitoydagi narxi", crg: "Kargo (vazn uchun)", srv: "Xizmat haqi", del: "O'zbekiston ichida yetkazib berish", tot: "Jami siz to'laydigan narx", saved: "Sizning foydangiz", market: "Bozordagi narxi", addCart: "Savatga qo'shish", inCart: "Savatda", empty: "Savat bo'sh", orderTitle: "Buyurtma berish", name: "Ismingiz", phone: "Telefon raqamingiz", address: "Viloyat, shahar, tuman", send: "Buyurtmani tasdiqlash", successTitle: "Rahmat! Buyurtmangiz qabul qilindi.", successSub: "Tez orada operatorimiz aloqaga chiqadi.", goHome: "Bosh sahifaga", cartTot: "Savatdagi jami:", checkout: "O'chirish", remove: "O'chirish", totalShort: "Jami", kargoNotice: "Kargo og'irlik kelganda o'lchab aniq hisoblanadi (taxminiy ko'rsatilgan)." },
    ru: { title: "Из Китая по первой цене до дома", sub: "В 3-5 раз дешевле магазинов и базаров. Прямая доставка без переплат.", shopNow: "В магазин", how: "Как это работает?", menuShop: "Магазин", menuCart: "Корзина", menuAdmin: "Админ", back: "Назад", buy: "Купить", size: "Размер", color: "Цвет", link: "Ссылка на товар", original: "Оригинал ссылка", calc: "Как считается цена?", cn: "Цена в Китае", crg: "Карго (за вес)", srv: "Услуга сервиса", del: "Доставка по Узбекистану", tot: "Итого к оплате", saved: "Ваша выгода", market: "Цена на базаре", addCart: "В корзину", inCart: "В корзине", empty: "Корзина пуста", orderTitle: "Оформление заказа", name: "Ваше имя", phone: "Номер телефона", address: "Область, город, район", send: "Подтвердить заказ", successTitle: "Спасибо! Заказ принят.", successSub: "Скоро наш оператор свяжется с вами.", goHome: "На главную", cartTot: "Итого в корзине:", checkout: "Оформить", remove: "Удалить", totalShort: "Итого", kargoNotice: "Карго рассчитывается точно по прибытию веса (указано примерно)." }
  }[lang];

  const toggleCart = (p) => {
    if (cart.find((x) => x.id === p.id)) {
      setCart(cart.filter((x) => x.id !== p.id));
    } else {
      setCart([...cart, { ...p, _size: "M", _color: "Black" }]);
    }
  };

  const submitOrder = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name");
    const phone = fd.get("phone");
    const address = fd.get("address");

    let itemsPrice = 0;
    let text = `🛍️ **YANGI BUYURTMA**\n👤 Ism: ${name}\n📞 Tel: ${phone}\n📍 Manzil: ${address}\n\n📦 **Mahsulotlar:**\n`;

    cart.forEach((c) => {
      const itemPrice = c.cnPrice + serviceFee(c.cnPrice) + c.cargo;
      itemsPrice += itemPrice;
      text += `• ${lang === "uz" ? c.nameUz : c.nameRu} (Rang: ${c._color}, Razmer: ${c._size}) — ${fmt(itemPrice)}\n`;
    });

    const finalTotal = itemsPrice + DELIVERY_FEE;
    text += `\n🚚 Yetkazib berish: ${fmt(DELIVERY_FEE)}\n💰 **JAMI TO'LOV: ${fmt(finalTotal)}**`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown" })
    });

    setOrders([{ id: Date.now(), name, phone, address, total: finalTotal, date: new Date().toLocaleString(), items: [...cart] }, ...orders]);
    setCart([]);
    setPage(P.SUCCESS);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "var(--bg)", color: "var(--dark)", minHeight: "100vh" }}>
      <style>{`
        :root { --bg: #0d0d0c; --dark: #f5f5f3; --mid: #a1a1aa; --white: #141413; --accent: #cca43b; --accent-hover: #b38f32; --border: #27272a; --saved: #22c55e; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-p { background: var(--accent); color: #000; font-weight: 700; border: none; padding: 12px 24px; borderRadius: 12px; cursor: pointer; transition: 0.2s; font-family: 'Syne', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; fontSize: 14px; }
        .btn-p:hover { background: var(--accent-hover); transform: translateY(-1px); }
        .btn-s { background: transparent; color: var(--dark); border: 1px solid var(--border); padding: 12px 24px; borderRadius: 12px; cursor: pointer; transition: 0.2s; font-weight: 600; fontSize: 14px; }
        .btn-s:hover { background: var(--border); }
        .input { background: #1c1c1b; border: 1px solid var(--border); padding: 14px; borderRadius: 12px; color: var(--dark); width: 100%; fontSize: 15px; outline: none; transition: 0.2s; }
        .input:focus { border-color: var(--accent); }
      `}</style>

      {/* ШАПКА */}
      <header style={{ position: "sticky", top: 0, background: "rgba(13,13,12,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div onClick={() => setPage(P.HOME)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px", color: "var(--dark)" }}>ARZON<span style={{ color: "var(--accent)" }}>MARKET</span></span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span onClick={() => setPage(P.SHOP)} style={{ cursor: "pointer", fontWeight: 600, color: page === P.SHOP ? "var(--accent)" : "var(--dark)" }}>{t.menuShop}</span>
            <span onClick={() => setPage(P.CART)} style={{ cursor: "pointer", fontWeight: 600, color: page === P.CART ? "var(--accent)" : "var(--dark)", display: "flex", alignItems: "center", gap: 6 }}>
              {t.menuCart} {cart.length > 0 && <span style={{ background: "var(--accent)", color: "#000", fontSize: 12, padding: "2px 6px", borderRadius: 20, fontWeight: 700 }}>{cart.length}</span>}
            </span>
            <span onClick={() => setPage(P.ADMIN)} style={{ cursor: "pointer", fontWeight: 600, color: page === P.ADMIN ? "var(--accent)" : "var(--dark)" }}>{t.menuAdmin}</span>
            <div style={{ display: "flex", background: "#1c1c1b", padding: 2, borderRadius: 8, border: "1px solid var(--border)" }}>
              <button onClick={() => setLang("uz")} style={{ background: lang === "uz" ? "var(--accent)" : "transparent", color: lang === "uz" ? "#000" : "var(--dark)", border: "none", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>UZ</button>
              <button onClick={() => setLang("ru")} style={{ background: lang === "ru" ? "var(--accent)" : "transparent", color: lang === "ru" ? "#000" : "var(--dark)", border: "none", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>RU</button>
            </div>
          </nav>
        </div>
      </header>

      {/* БОШ САҲИФА */}
      {page === P.HOME && (
        <main>
          <section style={{ padding: "100px 20px 80px", textAlign: "center", background: "radial-gradient(circle at center, #23231f 0%, #0d0d0c 100%)" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 24 }}>{t.title}</h1>
              <p style={{ color: "var(--mid)", fontSize: "clamp(16px, 3vw, 20px)", marginBottom: 40, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 40px" }}>{t.sub}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                <button className="btn-p" onClick={() => setPage(P.SHOP)}>{t.shopNow}</button>
                <button className="btn-s" onClick={() => { const el = document.getElementById("how-it-works"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>{t.how}</button>
              </div>
            </div>
          </section>

          <section id="how-it-works" style={{ padding: "80px 20px", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30 }}>
              <div style={{ background: "var(--white)", padding: 32, borderRadius: 20, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🎯</div>
                <h3 style={{ fontSize: 20, marginBottom: 12, fontFamily: "'Syne', sans-serif" }}>1. Birinchi qo'l narx</h3>
                <p style={{ color: "var(--mid)", lineHeight: 1.5 }}>Xitoy zavodlari va Pinduoduo platformasidagi eng arzon ulgurji narxlar.</p>
              </div>
              <div style={{ background: "var(--white)", padding: 32, borderRadius: 20, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🛡️</div>
                <h3 style={{ fontSize: 20, marginBottom: 12, fontFamily: "'Syne', sans-serif" }}>2. Shaffof hisob</h3>
                <p style={{ color: "var(--mid)", lineHeight: 1.5 }}>Har bir tiyin qayerga ketayotganini ko'rib turasiz. Yashirin to'lovlar yo'q.</p>
              </div>
              <div style={{ background: "var(--white)", padding: 32, borderRadius: 20, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🚀</div>
                <h3 style={{ fontSize: 20, marginBottom: 12, fontFamily: "'Syne', sans-serif" }}>3. Tez yetkazish</h3>
                <p style={{ color: "var(--mid)", lineHeight: 1.5 }}>Kargo orqali Toshkent va viloyatlardagi uyingizgacha xavfsiz yetib keladi.</p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ДЎКОН (ТОВАРЛАР) */}
      {page === P.SHOP && (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--mid)", fontSize: 18 }}>Yuklanmoqda...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 30 }}>
              {products.map((p) => {
                const total = p.cnPrice + serviceFee(p.cnPrice) + p.cargo;
                const saved = p.uzBozorPrice - total;
                return (
                  <div key={p.id} style={{ background: "var(--white)", borderRadius: 24, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column", transition: "0.3s" }}>
                    <div onClick={() => { setSelProd(p); setPage(P.PRODUCT); }} style={{ cursor: "pointer", position: "relative", paddingTop: "100%", background: "#1c1c1b" }}>
                      <img src={p.img} alt={p.nameUz} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", color: "var(--dark)", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, textTransform: "uppercase" }}>{p.source}</span>
                    </div>
                    <div style={{ padding: 20, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <h3 onClick={() => { setSelProd(p); setPage(P.PRODUCT); }} style={{ cursor: "pointer", fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, height: 44, overflow: "hidden" }}>{lang === "uz" ? p.nameUz : p.nameRu}</h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)", fontFamily: "'Syne', sans-serif" }}>{fmt(total)}</span>
                        <span style={{ fontSize: 13, color: "var(--mid)", textDecoration: "line-through" }}>{fmt(p.uzBozorPrice)}</span>
                      </div>
                      <div style={{ background: "rgba(34,197,94,0.1)", color: "var(--saved)", padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 16 }}>
                        {t.saved}: {fmt(saved)}
                      </div>
                      <button className="btn-p" style={{ width: "100%", marginTop: "auto" }} onClick={() => toggleCart(p)}>
                        {cart.find((x) => x.id === p.id) ? t.inCart : t.addCart}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* ТОВАР ИЧИ (DETAILS) */}
      {page === P.PRODUCT && selProd && (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
          <button className="btn-s" onClick={() => setPage(P.SHOP)} style={{ marginBottom: 30 }}>← {t.back}</button>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 50, alignItems: "start" }}>
            <div style={{ background: "var(--white)", borderRadius: 24, overflow: "hidden", border: "1px solid var(--border)" }}>
              <img src={selProd.img} alt={selProd.nameUz} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>{lang === "uz" ? selProd.nameUz : selProd.nameRu}</h1>
              <p style={{ color: "var(--mid)", lineHeight: 1.6, marginBottom: 24 }}>{lang === "uz" ? selProd.descUz : selProd.descRu}</p>

              <div style={{ background: "var(--white)", padding: 24, borderRadius: 20, border: "1px solid var(--border)", marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontFamily: "'Syne', sans-serif", marginBottom: 16, textTransform: "uppercase", color: "var(--mid)" }}>{t.calc}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--mid)" }}>{t.cn}</span><span>{fmt(selProd.cnPrice)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--mid)" }}>{t.srv}</span><span>{fmt(serviceFee(selProd.cnPrice))}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--mid)" }}>{t.crg}</span><span>{fmt(selProd.cargo)}</span></div>
                  <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700 }}>{t.tot}</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)", fontFamily: "'Syne', sans-serif" }}>{fmt(selProd.cnPrice + serviceFee(selProd.cnPrice) + selProd.cargo)}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--mid)", marginTop: 6 }}>*{t.kargoNotice}</p>
                </div>
              </div>

              <button className="btn-p" style={{ width: "100%", padding: 16, fontSize: 16 }} onClick={() => toggleCart(selProd)}>
                {cart.find((x) => x.id === selProd.id) ? t.inCart : t.addCart}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* САВАТ (CART) */}
      {page === P.CART && (
        <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, marginBottom: 30 }}>{t.menuCart}</h2>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, background: "var(--white)", borderRadius: 20, border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--mid)", fontSize: 16 }}>{t.empty}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {cart.map((c) => {
                const itemPrice = c.cnPrice + serviceFee(c.cnPrice) + c.cargo;
                return (
                  <div key={c.id} style={{ background: "var(--white)", padding: 16, borderRadius: 20, border: "1px solid var(--border)", display: "flex", gap: 16, alignItems: "center" }}>
                    <img src={c.img} alt={c.nameUz} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12 }} />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{lang === "uz" ? c.nameUz : c.nameRu}</h4>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>{fmt(itemPrice)}</span>
                    </div>
                    <button className="btn-s" style={{ padding: "8px 12px", fontSize: 12 }} onClick={() => toggleCart(c)}>{t.remove}</button>
                  </div>
                );
              })}

              <div style={{ background: "var(--white)", padding: 24, borderRadius: 20, border: "1px solid var(--border)", marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{t.cartTot}</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)", fontFamily: "'Syne', sans-serif" }}>
                    {fmt(cart.reduce((a, c) => a + c.cnPrice + serviceFee(c.cnPrice) + c.cargo, 0) + DELIVERY_FEE)}
                  </span>
                </div>
                <button className="btn-p" style={{ width: "100%", padding: 16 }} onClick={() => setPage(P.ORDER)}>{t.checkout}</button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ОФОРМЛЕНИЕ ЗАКАЗА */}
      {page === P.ORDER && (
        <main style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px" }}>
          <div style={{ background: "var(--white)", padding: 30, borderRadius: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, marginBottom: 24 }}>{t.orderTitle}</h2>
            <form onSubmit={submitOrder} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><input className="input" name="name" placeholder={t.name} required /></div>
              <div><input className="input" name="phone" placeholder={t.phone} required /></div>
              <div><input className="input" name="address" placeholder={t.address} required /></div>
              <button type="submit" className="btn-p" style={{ width: "100%", padding: 14, marginTop: 10 }}>{t.send}</button>
            </form>
          </div>
        </main>
      )}

      {/* SUCCESS СТРАНИЦА */}
      {page === P.SUCCESS && (
        <main style={{ maxWidth: 500, margin: "40px auto", padding: "40px 20px", textAlign: "center" }}>
          <div style={{ background: "var(--white)", padding: 40, borderRadius: 24, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, marginBottom: 12 }}>{t.successTitle}</h2>
            <p style={{ color: "var(--mid)", marginBottom: 30 }}>{t.successSub}</p>
            <button className="btn-p" onClick={() => setPage(P.HOME)}>{t.goHome}</button>
          </div>
        </main>
      )}

      {/* АДМИН ПАНЕЛЬ */}
      {page === P.ADMIN && (
        <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, marginBottom: 30 }}>{t.menuAdmin}</h2>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
