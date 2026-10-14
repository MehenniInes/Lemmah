export const LANGS = ["ar", "fr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (v: string): v is Lang =>
  (LANGS as readonly string[]).includes(v);

export const DIR: Record<Lang, "rtl" | "ltr"> = { ar: "rtl", fr: "ltr", en: "ltr" };
export const LANG_LABEL: Record<Lang, string> = { ar: "عربي", fr: "FR", en: "EN" };

// ── NEW: typed occasion keys ─────────────────────────────
export type OccasionKey =
  | "wedding"
  | "engagement"
  | "henna"
  | "birthday"
  | "baby"
  | "business"
  | "eid";

type Dict = {
  brand: string;
  nav: {
    designs: string;
    how: string;
    packages: string;
    faq: string;
    contact: string;
    cta: string;
  };
  hero: {
    promo: string;
    tagline: string;
    sub: string;
    ctaDesigns: string;
    ctaOrder: string;
    sample: { names: string; date: string; rsvp: string };
  };
  strip: string[];
  // ── CHANGED: key is now OccasionKey instead of string ──
  occasions: { title: string; items: { key: OccasionKey; name: string }[] };
  featured: {
    title: string;
    demoName: string;
    demoHint: string;
    order: string;
    soon: string;
  };
  // inside type Dict = { ... }, after `occasions:`
templates: {
  subtitle: string;
  title: string;
  desc: string;
  preview: string;
  order: string;
  rsvp: string;
};
customizer: {
  badge: string;
  title: string;
  labels: {
    template: string;
    font: string;
    groom: string;
    bride: string;
    date: string;
    hall: string;
    welcome: string;
  };
  live: string;
  applied: string;
  launch: string;
  fonts: { amiri: string; ruqaa: string; kufi: string };
};
reviews: {
  badge: string;
  title: string;
  subtitle: string;
  empty: string;
};
pricing: {
  title: string;
  currency: { dzd: string; usd: string };
  plans: {
    name: string;
    priceDZD: string;
    priceUSD: string;
    features: string[];
    cta: string;
    highlight?: boolean;
  }[];
};
  how: { title: string; steps: { title: string; text: string }[] };
  features: { title: string; items: { title: string; text: string }[] };
  packages: {
    title: string;
    note: string;
    cta: string;
    tiers: { name: string; price: string; features: string[]; highlight?: boolean }[];
  };
  faq: { title: string; items: { q: string; a: string }[] };
  footer: { line: string; whatsapp: string; rights: string };
};

export const dict: Record<Lang, Dict> = {
  ar: {
    brand: "فرحة",
    nav: {
      designs: "التصاميم",
      how: "كيف تعمل",
      packages: "الباقات",
      faq: "أسئلة شائعة",
      contact: "تواصل",
      cta: "اطلبوا الآن",
    },
    hero: {
      promo: "🎁 جرّبوا العرض التجريبي قبل أي التزام",
      tagline: "دعوات رقمية تليق بأجمل لحظاتكم",
      sub: "اختاروا التصميم، أضيفوا تفاصيلكم، وشاركوا رابطًا واحدًا مع ضيوفكم.",
      ctaDesigns: "شاهدوا التصاميم",
      ctaOrder: "اطلبوا دعوتكم",
      sample: {
        names: "سارة و ياسين",
        date: "الجمعة 20 نوفمبر 2026",
        rsvp: "أؤكد حضوري",
      },
    },
    strip: [
      "رابط واحد لكل ضيوفكم",
      "بدون تطبيق ولا تحميل",
      "تأكيد الحضور يصلكم مباشرة",
    ],
    occasions: {
      title: "لكل مناسبة دعوتها",
      items: [
        { key: "wedding", name: "زفاف" },
        { key: "engagement", name: "خطوبة" },
        { key: "henna", name: "ليلة الحنّة" },
        { key: "birthday", name: "عيد ميلاد" },
        { key: "baby", name: "مولود جديد" },
        { key: "business", name: "فعاليات وأعمال" },
        { key: "eid", name: "الأعياد والمناسبات" },
      ],
    },
    featured: {
      title: "تصاميم مختارة",
      demoName: "الأنيق",
      demoHint: "جرّبوا العرض التجريبي",
      order: "اطلبوا هذا التصميم",
      soon: "قريبًا",
    },
    templates: {
      subtitle: "أحدث التصاميم",
      title: "اختروا تصميمكم",
      desc: "تخصّصوا العناصر وشاركوا رابطًا واحدًا مع الضيوف.",
      preview: "معاينة",
      order: "اطلب هذا القالب",
      rsvp: "تأكيد الحضور",
    },
    customizer: {
      badge: "محرر مباشر",
      title: "خصّصوا دعوتكم",
      labels: {
        template: "القالب",
        font: "الخط",
        groom: "اسم العريس",
        bride: "اسم العروس",
        date: "التاريخ",
        hall: "اسم القاعة",
        welcome: "نص الترحيب",
      },
      live: "تحديثات مباشرة",
      applied: "تم تطبيق التغييرات",
      launch: "أطلقوا الدعوة",
      fonts: { amiri: "أميري", ruqaa: "رقعة", kufi: "كوفي" },
    },
    reviews: {
      badge: "آراء الضيوف",
      title: "ماذا يقول عملاؤنا؟",
      subtitle: "تجربة بسيطة، ومصممة بعناية.",
      empty: "لا توجد مراجعات بعد.",
    },
    pricing: {
      title: "الأسعار",
      currency: { dzd: "دج", usd: "دولار" },
      plans: [
        {
          name: "الأساسية",
          priceDZD: "— دج",
          priceUSD: "— $",
          features: [
            "قالب واحد من المجموعة",
            "رابط واحد لجميع الضيوف",
            "عدّاد تنازلي وموقع القاعة",
            "حفظ الموعد في التقويم",
          ],
          cta: "اطلبوا هذه الباقة",
        },
        {
          name: "المتكاملة",
          priceDZD: "— دج",
          priceUSD: "— $",
          features: [
            "كل مزايا الباقة الأساسية",
            "تأكيد الحضور وقائمة الضيوف",
            "معرض الصور وقصتنا",
            "الموسيقى وقواعد اللباس",
          ],
          cta: "اختروا هذه الباقة",
          highlight: true,
        },
        {
          name: "الملكية",
          priceDZD: "— دج",
          priceUSD: "— $",
          features: [
            "كل مزايا الباقة المتكاملة",
            "ألوان وخطوط مخصّصة",
            "روابط شخصية لكل ضيف",
            "دخول بالـ QR ودعم بالأولوية",
          ],
          cta: "احصلوا على هذه الباقة",
        },
      ],
    },
    how: {
      title: "كيف تعمل؟",
      steps: [
        { title: "شاهدوا العرض التجريبي", text: "جرّبوا التصميم بأسماء تجريبية قبل أي التزام." },
        { title: "أتمّوا الطلب والدفع", text: "تأكيد الدفع يتم عبر واتساب." },
        { title: "استلموا رابط التعديل الخاص بكم", text: "بعد التأكيد يُفتح لكم محرّر خاص بدعوتكم." },
        { title: "شاركوا دعوتكم", text: "رابط واحد لكل ضيوفكم، وتأكيد الحضور يصلكم مباشرة." },
      ],
    },
    features: {
      title: "كل شيء في رابط واحد",
      items: [
        { title: "يُفتح على أي هاتف", text: "يصل الضيف برابط واحد، دون تطبيق ودون تحميل." },
        { title: "تأكيد الحضور", text: "يؤكد الضيف بضغطة، وتُحدَّث قائمة الضيوف لديكم." },
        { title: "عدّاد تنازلي وخريطة", text: "يعرف الضيف الموعد والمكان بنظرة واحدة." },
        { title: "رابط تعديل خاص بكم", text: "غيّروا التفاصيل بأنفسكم في أي وقت." },
      ],
    },
    packages: {
      title: "الباقات",
      note: "الأسعار النهائية تُضاف قريبًا",
      cta: "اطلبوا هذه الباقة",
      tiers: [
        {
          name: "الأساسية",
          price: "— دج",
          features: [
            "قالب واحد من المجموعة",
            "رابط واحد لجميع الضيوف",
            "عدّاد تنازلي وموقع القاعة على الخريطة",
            "حفظ الموعد في التقويم",
          ],
        },
        {
          name: "المتكاملة",
          price: "— دج",
          highlight: true,
          features: [
            "كل مزايا الباقة الأساسية",
            "تأكيد الحضور وقائمة الضيوف",
            "معرض الصور وقصتنا",
            "الموسيقى وقواعد اللباس",
          ],
        },
        {
          name: "الملكية",
          price: "— دج",
          features: [
            "كل مزايا الباقة المتكاملة",
            "ألوان وخطوط مخصّصة",
            "روابط شخصية لكل ضيف",
            "دخول بالـ QR ودعم بالأولوية",
          ],
        },
      ],
    },
    faq: {
      title: "أسئلة شائعة",
      items: [
        {
          q: "هل أستطيع رؤية التصميم قبل الطلب؟",
          a: "نعم، جرّبوا العرض التجريبي بأسماء تجريبية قبل أي التزام.",
        },
        {
          q: "كيف أدفع؟",
          a: "يتم تأكيد الدفع عبر واتساب، وبعده يصلكم رابط التعديل الخاص بدعوتكم.",
        },
        {
          q: "كيف أعدّل الأسماء والتفاصيل؟",
          a: "من رابط التعديل الخاص بكم، وفيه تغيّرون التفاصيل بأنفسكم.",
        },
        {
          q: "كيف يؤكد الضيوف حضورهم؟",
          a: "عبر نموذج بسيط داخل الدعوة، وتصلكم قائمة بمن أكّد حضوره.",
        },
      ],
    },
    footer: {
      line: "فرحة — دعوات رقمية من الجزائر",
      whatsapp: "تواصلوا معنا عبر واتساب",
      rights: "جميع الحقوق محفوظة",
    },
  },

  fr: {
    brand: "Farha",
    nav: {
      designs: "Modèles",
      how: "Comment ça marche",
      packages: "Formules",
      faq: "Questions",
      contact: "Contact",
      cta: "Commander",
    },
    hero: {
      promo: "🎁 Essayez la démo, sans aucun engagement",
      tagline: "Des invitations numériques à la hauteur de vos plus beaux moments",
      sub: "Choisissez un modèle, ajoutez vos détails, partagez un seul lien avec vos invités.",
      ctaDesigns: "Découvrir les modèles",
      ctaOrder: "Commander mon invitation",
      sample: {
        names: "Sara & Yacine",
        date: "Vendredi 20 novembre 2026",
        rsvp: "Je confirme",
      },
    },
    strip: [
      "Un seul lien pour tous vos invités",
      "Aucune application à installer",
      "Les réponses arrivent chez vous",
    ],
    occasions: {
      title: "Une invitation pour chaque occasion",
      items: [
        { key: "wedding", name: "Mariage" },
        { key: "engagement", name: "Fiançailles" },
        { key: "henna", name: "Soirée du henné" },
        { key: "birthday", name: "Anniversaire" },
        { key: "baby", name: "Naissance" },
        { key: "business", name: "Événements pro" },
        { key: "eid", name: "Aïd et fêtes" },
      ],
    },
    featured: {
      title: "Modèles à l'honneur",
      demoName: "Élégant",
      demoHint: "Essayez la démo",
      order: "Commander ce modèle",
      soon: "Bientôt",
    },
    templates: {
  subtitle: "Derniers modèles",
  title: "Choisissez votre modèle",
  desc: "Personnalisez les éléments et partagez un seul lien avec vos invités.",
  preview: "Aperçu",
  order: "Commander ce modèle",
  rsvp: "Confirmation de présence",
},
customizer: {
  badge: "Éditeur en direct",
  title: "Personnalisez votre invitation",
  labels: {
    template: "Modèle",
    font: "Police",
    groom: "Nom du marié",
    bride: "Nom de la mariée",
    date: "Date",
    hall: "Nom de la salle",
    welcome: "Texte d'accueil",
  },
  live: "Aperçu en direct",
  applied: "Modifications appliquées",
  launch: "Lancer l'invitation",
  fonts: { amiri: "Amiri", ruqaa: "Ruqaa", kufi: "Kufi" },
},
reviews: {
  badge: "Avis des invités",
  title: "Que disent nos clients ?",
  subtitle: "Une expérience simple, soigneusement conçue.",
  empty: "Aucun avis pour le moment.",
},
pricing: {
  title: "Tarifs",
  currency: { dzd: "DA", usd: "USD" },
  plans: [
    {
      name: "Essentiel",
      priceDZD: "— DA",
      priceUSD: "— $",
      features: [
        "Un modèle de la collection",
        "Un lien unique pour tous les invités",
        "Compte à rebours et carte du lieu",
        "Ajout de la date à l'agenda",
      ],
      cta: "Choisir cette formule",
    },
    {
      name: "Complet",
      priceDZD: "— DA",
      priceUSD: "— $",
      features: [
        "Tout l'Essentiel",
        "Confirmations de présence et liste d'invités",
        "Galerie photos et notre histoire",
        "Musique et code vestimentaire",
      ],
      cta: "Choisir cette formule",
      highlight: true,
    },
    {
      name: "Royal",
      priceDZD: "— DA",
      priceUSD: "— $",
      features: [
        "Tout le Complet",
        "Couleurs et polices sur mesure",
        "Liens personnels pour chaque invité",
        "Entrée par QR code et assistance prioritaire",
      ],
      cta: "Choisir cette formule",
    },
  ],
},
    how: {
      title: "Comment ça marche ?",
      steps: [
        { title: "Découvrez la démo", text: "Essayez le modèle avec des noms d'exemple, sans engagement." },
        { title: "Passez commande et réglez", text: "La confirmation du paiement se fait par WhatsApp." },
        { title: "Recevez votre lien privé", text: "Un éditeur réservé à votre invitation s'ouvre après confirmation." },
        { title: "Partagez votre invitation", text: "Un seul lien pour tous vos invités, les réponses arrivent directement chez vous." },
      ],
    },
    features: {
      title: "Tout tient dans un seul lien",
      items: [
        { title: "S'ouvre sur tout téléphone", text: "Vos invités reçoivent un lien, sans application ni téléchargement." },
        { title: "Confirmation de présence", text: "Vos invités répondent en un geste et votre liste se met à jour." },
        { title: "Compte à rebours et carte", text: "Date et lieu, visibles d'un coup d'œil." },
        { title: "Un lien d'édition à vous", text: "Modifiez les détails vous-même, à tout moment." },
      ],
    },
    packages: {
      title: "Formules",
      note: "Tarifs définitifs bientôt disponibles",
      cta: "Choisir cette formule",
      tiers: [
        {
          name: "Essentiel",
          price: "— DA",
          features: [
            "Un modèle de la collection",
            "Un lien unique pour tous les invités",
            "Compte à rebours et carte du lieu",
            "Ajout de la date à l'agenda",
          ],
        },
        {
          name: "Complet",
          price: "— DA",
          highlight: true,
          features: [
            "Tout l'Essentiel",
            "Confirmations de présence et liste d'invités",
            "Galerie photos et notre histoire",
            "Musique et code vestimentaire",
          ],
        },
        {
          name: "Royal",
          price: "— DA",
          features: [
            "Tout le Complet",
            "Couleurs et polices sur mesure",
            "Liens personnels pour chaque invité",
            "Entrée par QR code et assistance prioritaire",
          ],
        },
      ],
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        {
          q: "Puis-je voir le modèle avant de commander ?",
          a: "Oui, essayez la démo avec des noms d'exemple, sans aucun engagement.",
        },
        {
          q: "Comment payer ?",
          a: "Le paiement est confirmé par WhatsApp, puis vous recevez votre lien d'édition.",
        },
        {
          q: "Comment modifier les noms et les détails ?",
          a: "Depuis votre lien d'édition privé, où vous changez tout vous-même.",
        },
        {
          q: "Comment les invités confirment-ils leur présence ?",
          a: "Par un formulaire simple dans l'invitation, et vous recevez la liste des confirmés.",
        },
      ],
    },
    footer: {
      line: "Farha — invitations numériques d'Algérie",
      whatsapp: "Nous écrire sur WhatsApp",
      rights: "Tous droits réservés",
    },
  },

  en: {
    brand: "Farha",
    nav: {
      designs: "Designs",
      how: "How it works",
      packages: "Packages",
      faq: "FAQ",
      contact: "Contact",
      cta: "Order now",
    },
    hero: {
      promo: "🎁 Try the live demo before you commit",
      tagline: "Digital invitations worthy of your most beautiful moments",
      sub: "Pick a design, add your details, share one link with your guests.",
      ctaDesigns: "Browse designs",
      ctaOrder: "Order your invitation",
      sample: {
        names: "Sara & Yacine",
        date: "Friday, 20 November 2026",
        rsvp: "I'll be there",
      },
    },
    strip: [
      "One link for all your guests",
      "No app, no download",
      "RSVPs come straight to you",
    ],
    occasions: {
      title: "An invitation for every occasion",
      items: [
        { key: "wedding", name: "Wedding" },
        { key: "engagement", name: "Engagement" },
        { key: "henna", name: "Henna night" },
        { key: "birthday", name: "Birthday" },
        { key: "baby", name: "New baby" },
        { key: "business", name: "Business events" },
        { key: "eid", name: "Eid & holidays" },
      ],
    },
    featured: {
      title: "Featured designs",
      demoName: "Elegant",
      demoHint: "Try the live demo",
      order: "Order this design",
      soon: "Coming soon",
    },
    templates: {
  subtitle: "Latest designs",
  title: "Choose your design",
  desc: "Customize elements and share one link with your guests.",
  preview: "Preview",
  order: "Order this template",
  rsvp: "RSVP",
},
customizer: {
  badge: "Live editor",
  title: "Customize your invitation",
  labels: {
    template: "Template",
    font: "Font",
    groom: "Groom's name",
    bride: "Bride's name",
    date: "Date",
    hall: "Venue name",
    welcome: "Welcome text",
  },
  live: "Live updates",
  applied: "Changes applied",
  launch: "Launch invitation",
  fonts: { amiri: "Amiri", ruqaa: "Ruqaa", kufi: "Kufi" },
},
reviews: {
  badge: "Guest reviews",
  title: "What our clients say",
  subtitle: "A simple experience, carefully crafted.",
  empty: "No reviews yet.",
},
pricing: {
  title: "Pricing",
  currency: { dzd: "DZD", usd: "USD" },
  plans: [
    {
      name: "Basic",
      priceDZD: "— DZD",
      priceUSD: "— $",
      features: [
        "One template from the collection",
        "One link for all your guests",
        "Countdown and venue map",
        "Save-the-date calendar link",
      ],
      cta: "Choose this plan",
    },
    {
      name: "Complete",
      priceDZD: "— DZD",
      priceUSD: "— $",
      features: [
        "Everything in Basic",
        "RSVP and guest list",
        "Photo gallery and our story",
        "Music and dress code",
      ],
      cta: "Choose this plan",
      highlight: true,
    },
    {
      name: "Royal",
      priceDZD: "— DZD",
      priceUSD: "— $",
      features: [
        "Everything in Complete",
        "Custom colors and fonts",
        "Personal links for each guest",
        "QR check-in and priority support",
      ],
      cta: "Choose this plan",
    },
  ],
},
    how: {
      title: "How it works",
      steps: [
        { title: "See the demo", text: "Try the design with sample names before you commit to anything." },
        { title: "Order and pay", text: "Payment is confirmed over WhatsApp." },
        { title: "Get your private edit link", text: "Once confirmed, an editor for your invitation opens." },
        { title: "Share your invitation", text: "One link for all your guests, and RSVPs come straight to you." },
      ],
    },
    features: {
      title: "Everything in one link",
      items: [
        { title: "Opens on any phone", text: "Guests get one link. No app, no download." },
        { title: "RSVP in one tap", text: "Guests confirm in a tap and your guest list updates." },
        { title: "Countdown and map", text: "Date and venue, clear at a glance." },
        { title: "Your own edit link", text: "Change any detail yourself, any time." },
      ],
    },
    packages: {
      title: "Packages",
      note: "Final prices coming soon",
      cta: "Choose this package",
      tiers: [
        {
          name: "Basic",
          price: "— DZD",
          features: [
            "One template from the collection",
            "One link for all your guests",
            "Countdown and venue map",
            "Save-the-date calendar link",
          ],
        },
        {
          name: "Complete",
          price: "— DZD",
          highlight: true,
          features: [
            "Everything in Basic",
            "RSVP and guest list",
            "Photo gallery and our story",
            "Music and dress code",
          ],
        },
        {
          name: "Royal",
          price: "— DZD",
          features: [
            "Everything in Complete",
            "Custom colors and fonts",
            "Personal links for each guest",
            "QR check-in and priority support",
          ],
        },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          q: "Can I see the design before I order?",
          a: "Yes. Try the live demo with sample names before you commit to anything.",
        },
        {
          q: "How do I pay?",
          a: "Payment is confirmed over WhatsApp, then you receive your private edit link.",
        },
        {
          q: "How do I change the names and details?",
          a: "From your private edit link, where you change everything yourself.",
        },
        {
          q: "How do guests confirm they're coming?",
          a: "Through a simple form inside the invitation, and you receive the list of confirmed guests.",
        },
      ],
    },
    footer: {
      line: "Farha — digital invitations from Algeria",
      whatsapp: "Message us on WhatsApp",
      rights: "All rights reserved",
    },
  },
};