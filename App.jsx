import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, Baby, Plane, Mail, Phone, MapPin, CheckCircle2, Clock, Tag as TagIcon, Globe2, Coins, X, Calendar as CalIcon, Instagram, ChevronLeft, ChevronRight, Star, ShoppingCart, Plus, Minus, Trash2, ArrowDown, FlaskConical, Palette } from "lucide-react";

/**
 * WE MET — Пространство для событий и творчества (Многостраничная версия)
 * - ИСПРАВЛЕНИЕ: Устранена ошибка 'ReferenceError: Spinner is not defined' путем повторного добавления компонента Spinner.
 * - ИСПРАВЛЕНИЕ: Полностью удалена зависимость от React Three Fiber, чтобы устранить постоянную ошибку рендеринга. 3D-загрузчик заменен на стабильную CSS-анимацию.
 * - ОБНОВЛЕНИЕ: Сайт реструктурирован в многостраничное приложение с помощью внутреннего роутера.
 * - ОБНОВЛЕНИЕ: Созданы отдельные "страницы" для главной, студии керамики и научных шоу.
 * - ОБНОВЛЕНИЕ: SEO-теги (title, description) теперь уникальны для каждой страницы.
 */

// ---------------- SEO Helper ----------------
const SeoManager = ({ title, description, jsonLd }) => {
  useEffect(() => {
    if (title) document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    if (description) metaDesc.setAttribute('content', description);

    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) existingScript.remove();
    
    if (jsonLd) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(jsonLd);
        document.head.appendChild(script);
        return () => {
            if (document.head.contains(script)) document.head.removeChild(script);
        };
    }
  }, [title, description, jsonLd]);
  return null;
};

// ---------------- CSS Preloader ----------------
const Preloader = ({ onLoaded }) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onLoaded, 500);
        }, 2000);
        return () => clearTimeout(timer);
    }, [onLoaded]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 bg-[#121212] z-[2000] flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="mt-4 text-white/80 font-serif">WE MET</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// ---------------- Animation Variants ----------------
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
};
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.5 };
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", once: true } }
};
const staggeredContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const staggeredItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ---------------- i18n & SEO ----------------
const I18N = {
  ru: {
    // SEO
    homeTitle: "WE MET — Пространство для событий и творчества в Тель-Авиве",
    homeDescription: "Откройте для себя мир творчества и науки в WE MET. Проводим мастер-классы по керамике для всех возрастов и захватывающие научные шоу для детей.",
    ceramicsTitle: "Студия Керамики WE MET | Мастер-классы в Тель-Авиве",
    ceramicsDescription: "Научитесь гончарному мастерству в нашей уютной студии. Мастер-классы для взрослых, детей, пар и туристов. Забронируйте свое место!",
    scienceTitle: "Научные Шоу WE MET | Детские праздники в Тель-Авиве",
    scienceDescription: "Увлекательные и интерактивные научные шоу для детей. Идеально для дней рождений и школьных мероприятий. Скоро открытие!",
    // UI
    brand: "WE MET",
    brandSubtitle: "События и творчество",
    heroTitle: "Пространство, где рождаются впечатления",
    heroSubtitle: "Откройте для себя магию керамики или погрузитесь в мир захватывающих научных экспериментов. У нас есть занятия для каждого.",
    ceramicsBtn: "Студия Керамики",
    scienceBtn: "Научные Шоу",
    ourActivities: "Наши направления",
    aboutUs: "О нас",
    aboutUsTitle: "Где идеи встречаются с воплощением",
    aboutUsText: "WE MET — это не просто студия, это пространство для творчества, познания и теплых встреч. Мы верим, что создание нового — будь то глиняная чашка или химический эксперимент — помогает найти связь с собой и другими. Наша миссия — дарить радость созидания и создавать яркие воспоминания.",
    formats: "Форматы мастер‑классов",
    adults: "Взрослые",
    adultsDesc: "Откройте в себе художника, даже если никогда не держали глину в руках. Идеально для отдыха от рутины и освоения нового хобби.",
    kids: "Дети",
    kidsDesc: "Развиваем моторику и воображение в веселой обстановке. Дети в восторге от возможности создать свой первый шедевр.",
    tourists: "Туристы",
    touristsDesc: "Увезите с собой не просто сувенир, а частичку Тель-Авива, сделанную своими руками. Уникальный опыт и памятный подарок.",
    couples: "Пары",
    couplesDesc: "Идеальное свидание, чтобы создать что-то вместе. Медитативный процесс, который сближает, и уникальные изделия на память.",
    calendar: "Календарь событий",
    noEvents: "Нет событий на выбранную дату.",
    send: "Отправить заявку",
    address: "Пространство для событий и творчества в Тель‑Авиве.",
    testimonials: "Что говорят наши гости",
    loading: "Загрузка...",
    shop: "Магазин изделий",
    addToCart: "В корзину",
    addedToCart: "Добавлено!",
    cartTitle: "Ваша корзина",
    cartEmpty: "Ваша корзина пуста.",
    total: "Итого",
    checkout: "Оформить заказ",
    scienceShowTitle: "Научные Шоу",
    scienceShowDesc: "Скоро здесь появится информация о наших увлекательных научных шоу для детей! Готовьтесь к зрелищным экспериментам, интерактивным открытиям и взрыву эмоций. Следите за обновлениями!",
    contact: "Контакты",
  },
  en: {
    // SEO
    homeTitle: "WE MET — Event & Creativity Space in Tel Aviv",
    homeDescription: "Discover a world of creativity and science at WE MET. We host pottery workshops for all ages and exciting science shows for kids.",
    ceramicsTitle: "WE MET Ceramics Studio | Workshops in Tel Aviv",
    ceramicsDescription: "Learn pottery in our cozy studio. Workshops for adults, kids, couples, and tourists. Book your spot!",
    scienceTitle: "WE MET Science Shows | Kids' Parties in Tel Aviv",
    scienceDescription: "Engaging and interactive science shows for children. Perfect for birthdays and school events. Coming soon!",
    // UI
    brand: "WE MET",
    brandSubtitle: "Events & Creativity",
    heroTitle: "A Space Where Experiences Are Born",
    heroSubtitle: "Discover the magic of ceramics or dive into the world of exciting science experiments. We have activities for everyone.",
    ceramicsBtn: "Ceramics Studio",
    scienceBtn: "Science Shows",
    ourActivities: "Our Activities",
    aboutUs: "About Us",
    aboutUsTitle: "Where Ideas Meet Creation",
    aboutUsText: "WE MET is more than just a studio; it's a space for creativity, learning, and warm connections. We believe that creating something new—whether it's a clay cup or a chemical experiment—helps connect with oneself and others. Our mission is to share the joy of creation and make lasting memories.",
    formats: "Workshop formats",
    adults: "Adults",
    adultsDesc: "Discover your inner artist, even if you've never touched clay before. Perfect for a relaxing break from routine and learning a new hobby.",
    kids: "Kids",
    kidsDesc: "We develop motor skills and imagination in a fun atmosphere. Kids are thrilled to create their first masterpiece.",
    tourists: "Tourists",
    touristsDesc: "Take home more than a souvenir – a piece of Tel Aviv made by you. A unique experience and a memorable gift.",
    couples: "Couples",
    couplesDesc: "The perfect date to create something together. A meditative process that brings you closer, with unique pieces to remember the day.",
    calendar: "Events calendar",
    noEvents: "No events on this date.",
    send: "Send request",
    address: "An event and creativity space in Tel Aviv.",
    testimonials: "What our guests say",
    loading: "Loading...",
    shop: "Handmade Shop",
    addToCart: "Add to Cart",
    addedToCart: "Added!",
    cartTitle: "Your Cart",
    cartEmpty: "Your cart is empty.",
    total: "Total",
    checkout: "Checkout",
    scienceShowTitle: "Science Shows",
    scienceShowDesc: "Information about our exciting science shows for kids is coming soon! Get ready for spectacular experiments, interactive discoveries, and a blast of fun. Stay tuned for updates!",
    contact: "Contact",
  },
  he: {
    // SEO
    homeTitle: "WE MET — מרחב לאירועים ויצירה בתל אביב",
    homeDescription: "גלו עולם של יצירתיות ומדע ב-WE MET. אנו מארחים סדנאות קרמיקה לכל הגילאים ומופעי מדע מרתקים לילדים.",
    ceramicsTitle: "WE MET סטודיו לקרמיקה | סדנאות בתל אביב",
    ceramicsDescription: "למדו קדרות בסטודיו הנעים שלנו. סדנאות למבוגרים, ילדים, זוגות ותיירים. הזמינו מקום!",
    scienceTitle: "WE MET מופעי מדע | ימי הולדת לילדים בתל אביב",
    scienceDescription: "מופעי מדע מרתקים ואינטראקטיביים לילדים. מושלם לימי הולדת ואירועי בית ספר. בקרוב!",
    // UI
    brand: "WE MET",
    brandSubtitle: "אירועים ויצירה",
    heroTitle: "מרחב שבו חוויות נולדות",
    heroSubtitle: "גלו את קסם הקרמיקה או צללו לעולם של ניסויים מדעיים מרתקים. יש לנו פעילויות לכולם.",
    ceramicsBtn: "סטודיו לקרמיקה",
    scienceBtn: "מופעי מדע",
    ourActivities: "הפעילויות שלנו",
    aboutUs: "אודותינו",
    aboutUsTitle: "איפה שרעיונות פוגשים יצירה",
    aboutUsText: "WE MET הוא יותר מסתם סטודיו; זהו מרחב ליצירתיות, למידה וחיבורים חמים. אנו מאמינים שיצירת משהו חדש - בין אם זה ספל חימר או ניסוי כימי - עוזרת להתחבר לעצמך ולאחרים. המשימה שלנו היא לחלוק את שמחת היצירה וליצור זיכרונות מתמשכים.",
    formats: "פורמטי סדנאות",
    adults: "מבוגרים",
    adultsDesc: "גלו את האמן שבכם, גם אם מעולם לא נגעתם בחימר. מושלם להפסקה מרגיעה מהשגרה וללימוד תחביב חדש.",
    kids: "ילדים",
    kidsDesc: "אנו מפתחים מיומנויות מוטוריות ודמיון באווירה מהנה. ילדים מתלהבים ליצור את יצירת המופת הראשונה שלהם.",
    tourists: "תיירים",
    touristsDesc: "קחו הביתה יותר ממזכרת – חתיכה מתל אביב שיצרתם בעצמכם. חוויה ייחודית ומתנה בלתי נשכחת.",
    couples: "זוגות",
    couplesDesc: "הדייט המושלם ליצור משהו יחד. תהליך מדיטטיבי שמקרב, עם יצירות ייחודיות למזכרת מהיום.",
    calendar: "לוח אירועים",
    noEvents: "אין אירועים בתאריך הזה.",
    send: "שלח בקשה",
    address: "מרחב לאירועים ויצירה בתל אביב.",
    testimonials: "מה אומרים האורחים שלנו",
    loading: "טוען...",
    shop: "חנות",
    addToCart: "הוסף לעגלה",
    addedToCart: "נוסף!",
    cartTitle: "העגלה שלך",
    cartEmpty: "העגלה שלך ריקה.",
    total: "סה״כ",
    checkout: "לתשלום",
    scienceShowTitle: "מופעי מדע",
    scienceShowDesc: "מידע על מופעי המדע המרתקים שלנו לילדים יגיע בקרוב! התכוננו לניסויים מרהיבים, תגליות אינטראקטיביות והמון כיף. הישארו מעודכנים!",
    contact: "צור קשר",
  },
};

function useI18n() {
  const [lang, setLang] = useState('ru');
  const t = useCallback((key, ...args) => {
    const value = I18N[lang][key];
    return typeof value === 'function' ? value(...args) : value;
  }, [lang]);
  const dir = lang === 'he' ? 'rtl' : 'ltr';
  const locale = lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US';
  return { lang, setLang, t, dir, locale };
}

// ---------------- Data ----------------
const INSTAGRAM_URL = "https://www.instagram.com/we_met_il/";
const STUDIO_ADDRESS = "Dizengoff St 99, Tel Aviv-Yafo, Israel";

const MOCK_PRODUCTS_DATA = [
    { id: 'p1', name: { ru: 'Чашка "Туман"', en: 'Misty Mug', he: 'ספל ערפילי' }, price: 120, image: 'https://images.unsplash.com/photo-1593461331573-f93a7f8fac93?q=80&w=800&auto=format&fit=crop' },
    { id: 'p2', name: { ru: 'Миска "Земля"', en: 'Earthen Bowl', he: 'קערת אדמה' }, price: 150, image: 'https://images.unsplash.com/photo-1565193569049-3c827f30b2b8?q=80&w=800&auto=format&fit=crop' },
    { id: 'p3', name: { ru: 'Ваза "Волна"', en: 'Wave Vase', he: 'אגרטל גל' }, price: 280, image: 'https://images.unsplash.com/photo-1610011503435-73c812c1a0e0?q=80&w=800&auto=format&fit=crop' },
    { id: 'p4', name: { ru: 'Тарелка "Луна"', en: 'Lunar Plate', he: 'צלחת ירח' }, price: 180, image: 'https://images.unsplash.com/photo-1621282243755-33b0018b323a?q=80&w=800&auto=format&fit=crop' },
];

const MOCK_GALLERY_DATA = [
  { src: "https://images.unsplash.com/photo-1554224220-745a2d61f185?q=80&w=1200&auto=format&fit=crop", alt: "Руки лепят глину на гончарном круге" },
  { src: "https://images.unsplash.com/photo-1610122993843-2e0f39118c5b?q=80&w=1200&auto=format&fit=crop", alt: "Пара наслаждается уроком гончарного мастерства" },
  { src: "https://images.unsplash.com/photo-1565339389201-c301c237a627?q=80&w=1200&auto=format&fit=crop", alt: "Детские руки в глине создают маленький горшок" },
  { src: "https://images.unsplash.com/photo-1578780909913-c3486a241b2c?q=80&w=1200&auto=format&fit=crop", alt: "Художник расписывает керамическую вазу" },
  { src: "https://images.unsplash.com/photo-1533611689535-3093950a7c29?q=80&w=1200&auto=format&fit=crop", alt: "Готовые керамические кружки ручной работы на полке" },
  { src: "https://images.unsplash.com/photo-1605200980296-16f04aa46a0c?q=80&w=1200&auto=format&fit=crop", alt: "Уютный интерьер керамической студии" },
];

const MOCK_EVENTS_DATA = [
  { id: 1, type: 'couples', title: { ru: 'Свидание за гончарным кругом', en: 'Date Night: Pottery Wheel', he: 'דייט נייט: אבניים' }, date: new Date(2025, 9, 6, 19, 0), duration: 120, spots: 6, price: 240, level: 'Beginner', langs: ['RU', 'HE', 'EN'] },
  { id: 2, type: 'adults', title: { ru: 'Интенсив: первая ваза', en: 'Intensive: First Vase', he: 'אינטנסיב: האגרטל הראשון' }, date: new Date(2025, 9, 11, 10, 0), duration: 180, spots: 10, price: 320, level: 'All', langs: ['RU', 'EN'] },
  { id: 3, type: 'kids', title: { ru: 'Дети 7–12: лепим кружку', en: 'Kids 7–12: Mug Making', he: 'ילדים 7–12: הכנת ספל' }, date: new Date(2025, 9, 12, 16, 0), duration: 90, spots: 12, price: 140, level: 'Beginner', langs: ['HE', 'RU'] },
  { id: 4, type: 'tourists', title: { ru: 'Сувенир из Израиля своими руками', en: 'Tourist: Make an Israeli Souvenir', he: 'חווית תיירים: מזכרת ישראלית' }, date: new Date(2025, 9, 9, 14, 30), duration: 90, spots: 14, price: 210, level: 'Beginner', langs: ['EN', 'RU', 'HE'] },
  { id: 5, type: 'adults', title: { ru: 'Открытая студия + глазуровка', en: 'Open Studio + Glazing Party', he: 'אופן סטודיו + זיגוג' }, date: new Date(2025, 9, 13, 18, 30), duration: 120, spots: 18, price: 180, level: 'All', langs: ['RU', 'HE', 'EN'] },
  { id: 6, type: 'couples', title: { ru: 'Романтическая лепка: парные тарелки', en: 'Romantic Sculpting: Matching Plates', he: 'פיסול רומנטי: צלחות תואמות' }, date: new Date(2025, 9, 20, 20, 0), duration: 120, spots: 4, price: 250, level: 'Beginner', langs: ['HE', 'EN'] },
];

const MOCK_TESTIMONIALS_DATA = [
    { id: 1, name: 'Анна', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', text: {ru: "Потрясающее свидание! Очень медитативный процесс, ушли с красивыми чашками и тёплыми воспоминаниями.", en: "Amazing date night! A very meditative process, we left with beautiful cups and warm memories.", he: "דייט מדהים! תהליך מדיטטיבי, יצאנו עם ספלים יפים וזכרונות חמים."}, type: 'couples' },
    { id: 2, name: 'Michael', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', text: {ru: "Отличный интенсив. За 3 часа действительно сделал свою первую вазу. Преподаватель всё объясняет очень доступно.", en: "Great intensive workshop. In 3 hours, I really made my first vase. The instructor explains everything very clearly.", he: "סדנה אינטנסיבית מעולה. תוך 3 שעות באמת הכנתי את האגרטל הראשון שלי. המדריך מסביר הכל בצורה ברורה."}, type: 'adults' },
    { id: 3, name: 'Ольга и сын Марк', avatar: 'https://images.unsplash.com/photo-1544465498-07a3c7d0d247?q=80&w=200&auto=format&fit=crop', text: {ru: "Сын в восторге! Не хотел уходить. Очень дружелюбная атмосфера, для детей – идеально.", en: "My son is thrilled! He didn't want to leave. Very friendly atmosphere, perfect for kids.", he: "הבן שלי היה מאושר! הוא לא רצה לעזוב. אווירה ידידותית מאוד, מושלם לילדים."}, type: 'kids' },
];

const TYPE_META = {
  adults: { icon: Users },
  kids: { icon: Baby },
  tourists: { icon: Plane },
  couples: { icon: Heart },
};

// ---------------- Helpers & Hooks ----------------
const Spinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
    </div>
);

// ---------------- UI Blocks (Shared & Page-Specific) ----------------
const LangSwitcher = ({ lang, setLang }) => (
  <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 p-1 backdrop-blur">
    {['ru', 'he', 'en'].map(l => (
      <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 text-xs rounded-lg transition ${lang === l ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`}>{l.toUpperCase()}</button>
    ))}
  </div>
);

const Notification = ({ message, isVisible }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-[1500]">
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

const Header = ({ t, lang, setLang, onCartClick, cartItemCount, navigateTo, currentPage }) => (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto">
            <div className="cursor-pointer" onClick={() => navigateTo('home')}>
                <div className="font-serif text-xl tracking-tight">{t('brand')}</div>
                <div className="text-xs text-white/70 tracking-widest">{t('brandSubtitle')}</div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
                <button onClick={() => navigateTo('ceramics')} className={`transition-colors ${currentPage === 'ceramics' ? 'text-white' : 'text-white/70 hover:text-white'}`}>{t('ceramicsBtn')}</button>
                <button onClick={() => navigateTo('science')} className={`transition-colors ${currentPage === 'science' ? 'text-white' : 'text-white/70 hover:text-white'}`}>{t('scienceBtn')}</button>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className={`transition-colors text-white/70 hover:text-white`}>{t('contact')}</button>
            </nav>
            <div className="flex items-center gap-4">
                <LangSwitcher lang={lang} setLang={setLang} />
                <button onClick={onCartClick} className="relative p-2 rounded-full border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
                    <ShoppingCart size={18} />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-black bg-white rounded-full">{cartItemCount}</span>
                    )}
                </button>
            </div>
        </div>
    </motion.header>
);

const Footer = ({ t }) => (
    <footer id="contact" className="py-12 px-4 text-center text-white/60 border-t border-white/10">
        <p className="font-serif text-lg mb-2">{t('brand')}</p>
        <p className="max-w-md mx-auto mb-4">{t('address')}</p>
        <div className="flex justify-center gap-4 mb-6">
            <a href="mailto:hello@wemet.com" className="hover:text-white transition-colors"><Mail size={20} /></a>
            <a href="tel:+9720000000" className="hover:text-white transition-colors"><Phone size={20} /></a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram size={20} /></a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} WE MET. All rights reserved.</p>
    </footer>
);

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, t, lang }) => {
    const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-[1000] flex justify-end" onClick={onClose}>
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-[#121212] w-full max-w-md h-full flex flex-col border-l border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="p-6 flex items-center justify-between border-b border-white/10">
                            <h2 className="text-2xl font-semibold">{t('cartTitle')}</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                        </div>
                        {cartItems.length === 0 ? (
                            <div className="flex-grow flex items-center justify-center"><p className="text-white/60">{t('cartEmpty')}</p></div>
                        ) : (
                            <div className="flex-grow overflow-y-auto p-6 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name[lang]} className="w-20 h-20 object-cover rounded-lg" />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.name[lang]}</p>
                                            <p className="text-sm text-white/70">₪{item.price}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-white/10 hover:bg-white/20"><Minus size={14} /></button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-white/10 hover:bg-white/20"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                        <button onClick={() => onRemoveItem(item.id)} className="p-1 text-white/50 hover:text-white"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-white/10">
                                <div className="flex justify-between items-center mb-4 text-lg">
                                    <span>{t('total')}</span>
                                    <span className="font-bold">₪{total}</span>
                                </div>
                                <button className="w-full py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors">{t('checkout')}</button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CustomCalendar = ({ value, onChange, tileContent, locale }) => {
    const [currentDate, setCurrentDate] = useState(value || new Date());
    const changeMonth = (offset) => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    const { startDay, daysInMonth } = useMemo(() => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = endOfMonth.getDate();
        let startDay = startOfMonth.getDay();
        if (locale === 'ru-RU' || locale === 'he-IL') startDay = (startDay === 0) ? 6 : startDay - 1;
        return { startDay, daysInMonth };
    }, [currentDate, locale]);
    const dayNames = useMemo(() => {
        const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
        const daysOfWeek = Array.from({ length: 7 }, (_, i) => formatter.format(new Date(2023, 0, i + 1)));
        if (locale === 'ru-RU' || locale === 'he-IL') daysOfWeek.push(daysOfWeek.shift());
        return daysOfWeek;
    }, [locale]);

    const calendarGrid = [];
    for (let i = 0; i < startDay; i++) calendarGrid.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const isSelected = value && date.toDateString() === value.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();
        calendarGrid.push(
            <div key={i} className="relative flex flex-col items-center justify-center">
                <button onClick={() => onChange(date)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors text-sm ${isSelected ? 'bg-white text-black font-bold' : ''} ${!isSelected && isToday ? 'bg-white/20' : ''} ${!isSelected ? 'hover:bg-white/10' : ''}`}>{i}</button>
                {tileContent({ date, view: 'month' })}
            </div>
        );
    }
    
    return (
        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft size={18} /></button>
                <span className="font-semibold text-lg capitalize">{new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(currentDate)}</span>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-white/10 transition-colors"><ChevronRight size={18} /></button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-white/60">{dayNames.map(day => <div key={day}>{day}</div>)}</div>
            <div className="grid grid-cols-7 gap-y-2 mt-2">{calendarGrid}</div>
        </div>
    );
};

const BookingModal = ({ isOpen, onClose, event, t, lang }) => {
    if (!event) return null;
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1c1c1c] rounded-2xl p-8 w-full max-w-md border border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">{t('modalTitle')}</h2>
                                <p className="text-white/80">{event.title[lang]}</p>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                        </div>
                        <form className="mt-6 space-y-4">
                            <input type="text" placeholder={t('yourName')} className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50" />
                            <input type="tel" placeholder={t('phone')} className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50" />
                            <input type="email" placeholder={t('email')} className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50" />
                            <input type="number" placeholder={t('persons')} min="1" max={event.spots} className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50" />
                            <button type="submit" className="w-full py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors">{t('send')}</button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CalendarSection = ({ t, lang, locale }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 6));
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setEvents(MOCK_EVENTS_DATA);
            setLoading(false);
        }, 1000);
    }, []);

    const eventsOnSelectedDate = useMemo(() => events.filter(e => e.date.toDateString() === selectedDate.toDateString()), [events, selectedDate]);
    const eventsByDay = useMemo(() => events.reduce((acc, event) => {
        const dateStr = event.date.toDateString();
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(event);
        return acc;
    }, {}), [events]);

    const handleBookClick = (event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };

    return (
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-20 px-4">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">{t('calendar')}</h2>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CustomCalendar value={selectedDate} onChange={setSelectedDate} locale={locale} tileContent={({ date }) => eventsByDay[date.toDateString()] ? <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-white rounded-full"></div> : null} />
                </div>
                <div className="min-h-[300px]">
                    <h3 className="text-xl font-semibold mb-4">{selectedDate.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                    {loading ? <Spinner /> : (
                        <AnimatePresence mode="wait">
                            <motion.div key={selectedDate.toDateString()} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-4">
                                {eventsOnSelectedDate.length > 0 ? eventsOnSelectedDate.map(event => (
                                    <div key={event.id} className="p-4 rounded-xl border border-white/10 bg-white/5">
                                        <p className="font-bold text-lg">{event.title[lang]}</p>
                                        <div className="flex items-center gap-4 text-sm text-white/70 mt-2 flex-wrap">
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {event.date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="flex items-center gap-1.5"><TagIcon size={14} /> {t('priceFrom', event.price)}</span>
                                            <span className="flex items-center gap-1.5"><Users size={14} /> {t('spotsLeft', event.spots)}</span>
                                        </div>
                                        <button onClick={() => handleBookClick(event)} className="mt-4 w-full py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors">{t('bookNow')}</button>
                                    </div>
                                )) : <p className="text-white/60">{t('noEvents')}</p>}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
            <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} event={selectedEvent} t={t} lang={lang} />
        </motion.section>
    );
};

const FormatsSection = ({ t }) => {
    const types = ['couples', 'adults', 'kids', 'tourists'];
    return (
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="py-20 px-4">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">{t('formats')}</h2>
            <motion.div variants={staggeredContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {types.map(type => {
                    const Icon = TYPE_META[type].icon;
                    return (
                        <motion.div key={type} variants={staggeredItem} className="relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition-transform hover:-translate-y-2 h-full flex flex-col text-center">
                            <div className="flex-grow">
                                <div className="flex justify-center mb-4"><div className="p-4 rounded-full bg-white/10"><Icon size={24} /></div></div>
                                <h3 className="text-xl font-semibold mb-2">{t(type)}</h3>
                                <p className="text-sm text-white/70">{t(`${type}Desc`)}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.section>
    );
};

const TestimonialsSection = ({ t, lang }) => {
    const [testimonials, setTestimonials] = useState([]);
    useEffect(() => { setTimeout(() => setTestimonials(MOCK_TESTIMONIALS_DATA), 200); }, []);
    return (
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="py-20 px-4 bg-white/5">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">{t('testimonials')}</h2>
            <motion.div variants={staggeredContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonials.map(testimonial => (
                    <motion.div key={testimonial.id} variants={staggeredItem} className="p-6 rounded-2xl border border-white/10 bg-white/5">
                        <div className="flex items-center mb-4">
                            <img src={testimonial.avatar} alt={`Фото ${testimonial.name}`} className="w-12 h-12 rounded-full object-cover mr-4" />
                            <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <div className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                            </div>
                        </div>
                        <p className="text-white/80">"{testimonial.text[lang]}"</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
};

const ShopSection = ({ t, lang, onAddToCart }) => {
    const [products, setProducts] = useState([]);
    useEffect(() => { setTimeout(() => setProducts(MOCK_PRODUCTS_DATA), 100); }, []);
    return (
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="py-20 px-4">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">{t('shop')}</h2>
            <motion.div variants={staggeredContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {products.map(product => (
                    <motion.div key={product.id} variants={staggeredItem} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <img src={product.image} alt={product.name[lang]} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="p-4">
                            <h3 className="font-semibold text-lg">{product.name[lang]}</h3>
                            <p className="text-white/70">₪{product.price}</p>
                            <button onClick={() => onAddToCart(product)} className="mt-4 w-full py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors">{t('addToCart')}</button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
};

const InstagramSection = ({ t }) => {
    const [gallery, setGallery] = useState([]);
    useEffect(() => { setTimeout(() => setGallery(MOCK_GALLERY_DATA), 500); }, []);
    return (
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-20">
            <motion.div variants={staggeredContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {gallery.length === 0 ? [...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-white/5 animate-pulse"></div>) : gallery.map((item, index) => (
                    <motion.a key={index} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" variants={staggeredItem} className="group relative block aspect-square overflow-hidden">
                        <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Instagram size={32} /></div>
                    </motion.a>
                ))}
            </motion.div>
        </motion.section>
    );
};

// ---------------- Page Components ----------------

const HomePage = ({ t, navigateTo }) => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
        <SeoManager title={t('homeTitle')} description={t('homeDescription')} />
        <section className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden px-4">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-potter-making-a-clay-pot-4621-large.mp4" type="video/mp4" />
            </video>
            <motion.div variants={staggeredContainer} initial="hidden" animate="visible" className="relative z-20 flex flex-col items-center">
                <motion.h1 variants={staggeredItem} className="text-4xl md:text-6xl lg:text-7xl font-serif max-w-3xl leading-tight">{t('heroTitle')}</motion.h1>
                <motion.p variants={staggeredItem} className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl">{t('heroSubtitle')}</motion.p>
                <motion.div variants={staggeredItem} className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onClick={() => navigateTo('ceramics')} className="px-8 py-3 bg-white text-black rounded-full font-semibold transition hover:bg-gray-200 flex items-center gap-2"><Palette size={20}/> {t('ceramicsBtn')}</button>
                    <button onClick={() => navigateTo('science')} className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-semibold backdrop-blur transition hover:bg-white/20 flex items-center gap-2"><FlaskConical size={20}/> {t('scienceBtn')}</button>
                </motion.div>
            </motion.div>
        </section>
    </motion.div>
);

const CeramicsPage = ({ t, lang, locale, onAddToCart }) => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="pt-24">
        <SeoManager title={t('ceramicsTitle')} description={t('ceramicsDescription')} />
        <FormatsSection t={t} />
        <CalendarSection t={t} lang={lang} locale={locale} />
        <TestimonialsSection t={t} lang={lang} />
        <ShopSection t={t} lang={lang} onAddToCart={onAddToCart} />
        <InstagramSection t={t} />
    </motion.div>
);

const SciencePage = ({ t }) => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="pt-24">
        <SeoManager title={t('scienceTitle')} description={t('scienceDescription')} />
        <motion.section id="science-section" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="py-20 px-4 min-h-[60vh] flex items-center">
            <div className="max-w-3xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-5 rounded-full bg-white/10"><FlaskConical size={40} className="text-cyan-300"/></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif mb-6">{t('scienceShowTitle')}</h2>
                <p className="text-lg text-white/80 leading-relaxed">{t('scienceShowDesc')}</p>
            </div>
        </motion.section>
    </motion.div>
);

// ---------------- Main App Component (Router) ----------------

export default function App() {
    const { lang, setLang, t, dir, locale } = useI18n();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', isVisible: false });
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('home');

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        window.scrollTo(0, 0);
    }, [lang, dir, currentPage]);

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    const showNotification = (message) => {
        setNotification({ message, isVisible: true });
        setTimeout(() => setNotification({ message: '', isVisible: false }), 2000);
    };

    const handleAddToCart = (product) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(item => item.id === product.id);
            if (exist) {
                return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        showNotification(t('addedToCart'));
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity === 0) {
            handleRemoveItem(productId);
        } else {
            setCartItems(prevItems => prevItems.map(item => item.id === productId ? { ...item, quantity } : item));
        }
    };

    const handleRemoveItem = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };
    
    const cartItemCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage t={t} navigateTo={navigateTo} />;
            case 'ceramics':
                return <CeramicsPage t={t} lang={lang} locale={locale} onAddToCart={handleAddToCart} />;
            case 'science':
                return <SciencePage t={t} />;
            case 'contact':
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                return <HomePage t={t} navigateTo={navigateTo} />;
            default:
                return <HomePage t={t} navigateTo={navigateTo} />;
        }
    };

    if (isLoading) {
        return <Preloader onLoaded={() => setIsLoading(false)} />;
    }

    return (
        <div className="bg-[#121212] text-white font-sans antialiased">
            <Header t={t} lang={lang} setLang={setLang} onCartClick={() => setIsCartOpen(true)} cartItemCount={cartItemCount} navigateTo={navigateTo} currentPage={currentPage} />
            <main>
                <AnimatePresence mode="wait">
                    {renderPage()}
                </AnimatePresence>
            </main>
            <Footer t={t} />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} t={t} lang={lang} />
            <Notification message={notification.message} isVisible={notification.isVisible} />
        </div>
    );
}
