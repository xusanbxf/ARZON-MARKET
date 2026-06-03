import { useState, useEffect } from "react";

const P = { HOME: "home", SHOP: "shop", PRODUCT: "product", CART: "cart", ORDER: "order", SUCCESS: "success", ADMIN: "admin" };
const DELIVERY_FEE = 35000;

// ХАВФСИЗЛИК УЧУН ТОКЕНЛАР СОХТАЛАШТИРИЛДИ (GITHUB УЧУН ХАВФСИЗ)
const BOT_TOKEN = "8754873465:AAFezETbX84Cwnj_lmxmBpSluIA8xG1KSZM";
const CHAT_ID = "627785337";

function serviceFee(price) {
  const steps = Math.floor(price / 100000);
  return 15000 + steps * 10000;
}
function fmt(n) { return Number(n).toLocaleString("uz-UZ") + " so'm"; }

// GOOGLE SHEETS ИД-СИНИ ШУ ЕРГА ҚЎЙИНГ:
const SPREADSHEET_ID = "113Ju9cv51_2zh5a1-DUOK8k5mZcb1fXNh4_12ZSBVIE";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

export default function App() {
  const [page, setPage] = useState(P.HOME);
  const [cart, setCart] = useState([]);
  const [selProd, setSelProd] = useState(null);
  const [lang, setLang] = useState("uz");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


    fetch(SHEET_URL)
      .then(res => res.text())
      .then(text => {
        try {
          const jsonText = text.substring(47, text.length - 2);
          const json = JSON.parse(jsonText);
          const rows = json.table.rows;
          
          const parsed = rows.map((r, i) => ({
            id: i + 1,
            nameUz: r.c[0]?.v || "",
            nameRu: r.c[1]?.v || "",
            source: r.c[2]?.v || "pinduoduo",
            cnPrice: Number(r.c[3]?.v || 0),
            uzBozorPrice: Number(r.c[4]?.v || 0),
            cargo: Number(r.c[5]?.v || 0),
            img1: r.c[6]?.v || "",
            img2: r.c[7]?.v || "",
            img3: r.c[8]?.v || "",
            category: r.c[9]?.v || "boshqa",
            rating: Number(r.c[10]?.v || 5),
            sold: Math.floor(Math.random() * 500) + 100 
          }));
          setProducts(parsed);
        } catch (e) {
          console.error("Xatolik:", e);
        } finally {
          setLoading(false);
        }
      });
  }, []);

  const addToCart = (p) => {
    if (!cart.some(item => item.id === p.id)) setCart([...cart, p]);
  };
  const rmFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--dark)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{CSS}</style>
      
      <nav style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div onClick={() => setPage(P.HOME)} style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: "var(--dark)", cursor: "pointer" }}>
            ARZON<span style={{ color: "var(--gold)" }}>.</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => setLang(lang === "uz" ? "ru" : "uz")} style={{ border: "none", background: "var(--bg)", padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "var(--mid)" }}>
              {lang === "uz" ? "RU" : "UZ"}
            </button>
            <div onClick={() => setPage(P.CART)} style={{ position: "relative", cursor: "pointer", background: "var(--dark)", color: "var(--white)", width: 40, height: 40, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              🛒 {cart.length > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "var(--gold)", color: "var(--dark)", fontSize: 11, width: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>}
            </div>
          </div>
        </div>
      </nav>

      {loading ? (
        <div style={{ textAlign: "center", padding: 100, fontSize: 16, color: "var(--mid)" }}>Yuklanmoqda...</div>
      ) : (
        <>
          {page === P.HOME && <Home setPage={setPage} products={products} lang={lang} setSelProd={setSelProd} />}
          {page === P.SHOP && <Shop setPage={setPage} products={products} lang={lang} setSelProd={setSelProd} />}
          {page === P.PRODUCT && <ProductPage p={selProd} lang={lang} addToCart={addToCart} setPage={setPage} cart={cart} />}
          {page === P.CART && <CartPage cart={cart} rmFromCart={rmFromCart} setPage={setPage} lang={lang} />}
          {page === P.ORDER && <OrderPage cart={cart} setCart={setCart} setPage={setPage} lang={lang} setOrders={setOrders} orders={orders} />}
          {page === P.SUCCESS && <SuccessPage setPage={setPage} lang={lang} />}
          {page === P.ADMIN && <AdminPage orders={orders} />}
        </>
      )}

      <footer style={{ background: "var(--white)", borderTop: "1px solid var(--border)", padding: "24px 16px", marginTop: 40, textAlign: "center", fontSize: 13, color: "var(--mid)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          © 2026 ARZON MARKET. {lang === "uz" ? "Barcha huquqlar himoyalangan." : "Все права защищены."}
          <div onClick={() => setPage(P.ADMIN)} style={{ marginTop: 8, cursor: "pointer", opacity: 0.5 }}>Admin Panel</div>
        </div>
      </footer>
    </div>
  );
}

function Home({ setPage, products, lang, setSelProd }) {
  const topProds = products.slice(0, 3);
  return (
    <div className="fade-up" style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ background: "linear-gradient(135deg, #111 0%, #222 100%)", borderRadius: 28, padding: "32px 24px", color: "var(--white)", position: "relative", overflow: "hidden", marginBottom: 30 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, lineHeghit: 1.1, marginBottom: 12 }}>
          {lang === "uz" ? "Xitoydan To'g'ridan-To'g'ri" : "Напрямую из Китая"}
        </h2>
        <p style={{ fontSize: 15, color: "#aaa", marginBottom: 24 }}>
          {lang === "uz" ? "Pinduoduo va Taobao narxlarida sotib oling." : "Покупайте по ценам Pinduoduo и Taobao."}
        </p>
        <button onClick={() => setPage(P.SHOP)} style={{ background: "var(--white)", color: "var(--dark)", border: "none", padding: "12px 24px", borderRadius: 20, fontWeight: 700, cursor: "pointer" }}>
          {lang === "uz" ? "Do'konni ko'rish →" : "В магазин →"}
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800 }}>{lang === "uz" ? "Ommabop mahsulotlar" : "Популярные товары"}</h3>
        <span onClick={() => setPage(P.SHOP)} style={{ color: "var(--gold)", fontWeight: 700, cursor: "pointer" }}>{lang === "uz" ? "Hammasi" : "Все"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {topProds.map(p => <ProdCard key={p.id} p={p} lang={lang} setPage={setPage} setSelProd={setSelProd} />)}
      </div>
    </div>
  );
}

function Shop({ products, lang, setSelProd, setPage }) {
  const [cats, setCats] = useState("all");
  const filtered = cats === "all" ? products : products.filter(
