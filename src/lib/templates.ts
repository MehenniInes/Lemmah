export type TemplateType = "doors" | "wax" | "curtains";

export type Template = {
  id: string;
  type: TemplateType;
  doorBg: string;
  name:  { ar: string; fr: string; en: string };
  desc:  { ar: string; fr: string; en: string };
  badge: { ar: string; fr: string; en: string };
  music: { ar: string; fr: string; en: string };
};

export const TEMPLATES: Template[] = [
  {
    id: "el-mahroussa",
    type: "doors",
    doorBg: "linear-gradient(135deg, #2c1b12 0%, #4a3222 100%)",
    name: {
      ar: "القصر الجزائري (المحروسة)",
      fr: "Palais Algérien (El Mahroussa)",
      en: "Algerian Palace (El Mahroussa)",
    },
    desc: {
      ar: "أبواب من الخشب المنقوش والزليج التقليدي تفتح على باحة القصر.",
      fr: "Portes en bois sculpté et zellige s'ouvrant sur la cour du palais.",
      en: "Carved wooden doors and zellige opening to a palace courtyard.",
    },
    badge: {
      ar: "أبواب خشبية • زليج",
      fr: "Portes sculptées • Zellige",
      en: "Carved doors • Zellige",
    },
    music: {
      ar: "موسيقى أندلسية",
      fr: "Musique andalouse",
      en: "Andalusian music",
    },
  },
  {
    id: "bab-el-farah",
    type: "doors",
    doorBg: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    name: {
      ar: "الباب الملكي",
      fr: "Porte Royale",
      en: "Royal Gate",
    },
    desc: {
      ar: "باب قوس إسلامي عتيق مع مطرقة نحاسية فاخرة.",
      fr: "Porte en arc traditionnel avec marteau en laiton.",
      en: "Traditional arched door with brass knocker.",
    },
    badge: {
      ar: "مطرق نحاسي • قوس",
      fr: "Marteau • Arc",
      en: "Brass knocker • Arch",
    },
    music: {
      ar: "تقاسيم عود",
      fr: "Taquasim de oud",
      en: "Oud taqsim",
    },
  },
  {
    id: "rose-wax",
    type: "wax",
    doorBg: "#FCE7F0",
    name: {
      ar: "ختم الشمع الورد",
      fr: "Sceau de Cire Rose",
      en: "Blush Rose Wax Seal",
    },
    desc: {
      ar: "ظرف وردي فاخر يغلقه ختم شمعي ذهبي ينكسر بعناية.",
      fr: "Enveloppe rose au sceau de cire dorée.",
      en: "Blush envelope sealed with embossed gold wax.",
    },
    badge: {
      ar: "ظرف • ختم شمعي",
      fr: "Enveloppe • Sceau",
      en: "Envelope • Wax seal",
    },
    music: {
      ar: "عزف هارب",
      fr: "Harpe",
      en: "Harp",
    },
  },
  {
    id: "velvet-curtain",
    type: "curtains",
    doorBg: "linear-gradient(135deg, #881337 0%, #4c0519 100%)",
    name: {
      ar: "ستارة الفخامة",
      fr: "Rideau de Velours",
      en: "Velvet Curtain Luxury",
    },
    desc: {
      ar: "ستائر مخملية عنابية تنزاح جانباً مع فوانيس مضاءة.",
      fr: "Rideaux de velours bordeaux s'écartant avec lanternes.",
      en: "Deep crimson velvet curtains drawing apart with lanterns.",
    },
    badge: {
      ar: "مخمل • إضاءة",
      fr: "Velours • Lumières",
      en: "Velvet • Lights",
    },
    music: {
      ar: "بيانو هادئ",
      fr: "Piano calme",
      en: "Calm piano",
    },
  },
  {
    id: "sage-botanical",
    type: "wax",
    doorBg: "#E6EFE9",
    name: {
      ar: "حدائق المريمية",
      fr: "Jardin Botanique Sauge",
      en: "Sage Botanical Garden",
    },
    desc: {
      ar: "ظرف أخضر مريمي مع أوراق ذهبية وختم فخاري.",
      fr: "Enveloppe vert sauge aux feuillages dorés et sceau terre cuite.",
      en: "Sage envelope framed with golden vines and terracotta seal.",
    },
    badge: {
      ar: "نباتي • أوراق ذهب",
      fr: "Botanique • Feuilles d'or",
      en: "Botanical • Gold leaves",
    },
    music: {
      ar: "قانون وناي",
      fr: "Qanun & ney",
      en: "Qanun & ney",
    },
  },
  {
    id: "diamond-marble",
    type: "doors",
    doorBg: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    name: {
      ar: "الحلم الماسي",
      fr: "Rêve de Marbre",
      en: "Diamond Marble Dream",
    },
    desc: {
      ar: "خلفية رخام أبيض مع بوابات هندسية ذهبية تنزلق.",
      fr: "Marbre blanc avec grilles géométriques dorées.",
      en: "White marble with sliding golden geometric gates.",
    },
    badge: {
      ar: "رخام • هندسي ذهبي",
      fr: "Marbre • Filigrane or",
      en: "Marble • Gold filigree",
    },
    music: {
      ar: "كلاسيكي راقٍ",
      fr: "Classique",
      en: "Classical",
    },
  },
];