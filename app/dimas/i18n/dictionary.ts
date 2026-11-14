export const en = {
  nav: { about: "About", work: "Selected work", contact: "Contact", portfolio: "Portfolio", label: "Main navigation" },
  hero: {
    subtitle: "Developer & digital creative — Indonesia",
    description: "I create thoughtful digital experiences for the web, mobile, and user interfaces, guided by curiosity, clarity, and care.",
    download: "Download CV",
    contact: "Get in touch",
    scroll: "Scroll to explore",
    marquee: "Design with purpose · Build with curiosity",
    localTime: "Local time",
  },
  about: {
    section: "01 / About me",
    heading: ["Curious by nature.", "Builder by choice."],
    paragraph: "I'm a software development student at SMK Telkom Makassar, exploring how design and technology can make everyday digital experiences more useful and human-centered. My interests span web and mobile development, software engineering, and UI/UX design.",
    portraitAlt: "Portrait of Dimas Iman Ismail",
    location: "Makassar, Indonesia",
  },
  academic: {
    section: "02 / Academic background",
    levels: { senior: "Vocational high school", junior: "Junior high school", elementary: "Elementary school" },
    onboarding: {
      title: "Explore my academic journey",
      description: "Select a school name to see photos and memories from my time there.",
      close: "Close notification",
    },
  },
  skills: { section: "03 / Skills & tools", categories: { frontend: "Frontend", backend: "Backend", mobile: "Mobile", database: "Database", design: "UI / UX", developmentTools: "Development tools" }, marqueeLabel: "Technologies and tools" },
  work: {
    section: "04 / Selected work",
    heading: "Made with intent",
    description: "A selection of web, mobile, and product design projects. Each one is a chance to learn by making.",
    view: "View",
    openProject: "Open project",
    types: ["Company website", "Personal portfolio", "Inventory system", "Mobile app", "Learning platform"],
    descriptions: [
      "A modern, responsive company website that presents the brand clearly and professionally.",
      "A modern personal portfolio designed with AI and built for the web.",
      "A Roblox inventory website with a modern interface and data powered by Supabase.",
      "A mobile app concept for organizing Makassar traditional wedding ceremonies, designed to be simple to use.",
      "A digital learning experience that brings lessons, exercises, and study resources together.",
    ],
  },
  certificates: { section: "05 / Certificates", heading: "Learning through practice.", view: "View certificate" },
  contact: {
    section: "06 / Get in touch",
    heading: ["Let's create", "something great."],
    prompt: "Have a project in mind?",
  },
  footer: { portfolio: "Back to portfolio", name: "Dimas Iman Ismail" },
  gallery: {
    schoolTitle: "Photo gallery",
    certificateTitle: "Certificate gallery",
    photoAlt: "Photo",
    back: "Return to CV page",
    backgroundBlur: "Background blur",
    closeGallery: "Close gallery",
    certificateAltPrefix: "Certificate",
    faceRing: "BACK · BACK · BACK · BACK · ",
  },
  menu: { back: "Back", reload: "Reload", language: "Language", english: "English", indonesian: "Bahasa Indonesia", label: "Page actions", open: "Open menu", close: "Close menu" },
  language: { switchEnglish: "Switch to English", switchIndonesian: "Switch to Indonesian" },
  introLabel: "Welcome intro",
  greetings: ["Hello", "Ciao", "Marhaba", "Nǐ hǎo", "Privet", "Konnichiwa", "Annyeonghaseyo", "Bonjour", "Sawasdee", "Guten Tag"],
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? Widen<Item>[]
    : T extends object
      ? { [Key in keyof T]: Widen<T[Key]> }
      : T;

export type Language = "en" | "id";
export type Dictionary = Widen<typeof en>;

export const id: Dictionary = {
  nav: { about: "Tentang", work: "Karya pilihan", contact: "Kontak", portfolio: "Portofolio", label: "Navigasi utama" },
  hero: {
    subtitle: "Developer & kreator digital — Indonesia",
    description: "Saya merancang pengalaman digital yang bermakna untuk web, mobile, dan tampilan visual dan elemen interaktif pada sebuah perangkat lunak, aplikasi, dan situs web, dengan rasa ingin tahu, kejelasan, dan perhatian pada detail.",
    download: "Unduh CV",
    contact: "Hubungi saya",
    scroll: "Gulir untuk menjelajah",
    marquee: "Desain dengan tujuan · Berkarya dengan rasa ingin tahu",
    localTime: "Waktu setempat",
  },
  about: {
    section: "01 / Tentang saya",
    heading: ["Penuh rasa ingin tahu.", "Gemar menciptakan sesuatu."],
    paragraph: "Saya merupakan siswa Rekayasa Perangkat Lunak di SMK Telkom Makassar yang tertarik mengeksplorasi perpaduan antara desain dan teknologi untuk menciptakan pengalaman digital yang lebih bermanfaat dan mudah digunakan. Saya memiliki ketertarikan pada pengembangan web dan aplikasi mobile, rekayasa perangkat lunak, serta desain UI/UX.",
    portraitAlt: "Foto Dimas Iman Ismail",
    location: "Makassar, Indonesia",
  },
  academic: {
    section: "02 / Latar belakang pendidikan",
    levels: { senior: "Sekolah menengah kejuruan", junior: "Sekolah menengah pertama", elementary: "Sekolah dasar" },
    onboarding: {
      title: "Jelajahi perjalanan pendidikan saya",
      description: "Pilih nama sekolah untuk melihat foto dan kenangan selama bersekolah di sana.",
      close: "Tutup notifikasi",
    },
  },
  skills: { section: "03 / Keahlian & tools", categories: { frontend: "Frontend", backend: "Backend", mobile: "Mobile", database: "Database", design: "Desain UI/UX", developmentTools: "Tools pengembangan" }, marqueeLabel: "Teknologi dan tools" },
  work: {
    section: "04 / Karya pilihan",
    heading: "Setiap karya punya tujuan",
    description: "Pilihan proyek web, mobile, dan desain produk. Setiap proyek menjadi kesempatan untuk belajar sambil berkarya.",
    view: "Lihat",
    openProject: "Buka proyek",
    types: ["Situs perusahaan", "Portofolio pribadi", "Sistem inventaris", "Aplikasi mobile", "Platform belajar"],
    descriptions: [
      "Situs perusahaan modern dan responsif yang menampilkan identitas merek secara jelas dan profesional.",
      "Portofolio pribadi modern yang dirancang dengan AI dan dibuat untuk web.",
      "Situs inventaris Roblox dengan antarmuka modern dan data yang dikelola melalui Supabase.",
      "Konsep aplikasi mobile untuk mengatur rangkaian prosesi pernikahan adat Makassar dengan pengalaman yang mudah digunakan.",
      "Platform belajar digital yang menyatukan materi, latihan, dan sumber belajar.",
    ],
  },
  certificates: { section: "05 / Sertifikat", heading: "Belajar lewat praktik.", view: "Lihat sertifikat" },
  contact: {
    section: "06 / Mari terhubung",
    heading: ["Mari ciptakan", "sesuatu yang hebat."],
    prompt: "Punya proyek yang ingin diwujudkan?",
  },
  footer: { portfolio: "Kembali ke portofolio", name: "Dimas Iman Ismail" },
  gallery: {
    schoolTitle: "Galeri foto",
    certificateTitle: "Galeri sertifikat",
    photoAlt: "Foto",
    back: "Kembali ke halaman CV",
    backgroundBlur: "Buramkan latar belakang",
    closeGallery: "Tutup galeri",
    certificateAltPrefix: "Sertifikat",
    faceRing: "KEMBALI · KEMBALI · KEMBALI · KEMBALI · ",
  },
  menu: { back: "Kembali", reload: "Muat ulang", language: "Bahasa", english: "English", indonesian: "Bahasa Indonesia", label: "Aksi halaman", open: "Buka menu", close: "Tutup menu" },
  language: { switchEnglish: "Ganti ke bahasa Inggris", switchIndonesian: "Ganti ke bahasa Indonesia" },
  introLabel: "Intro sambutan",
  greetings: ["Halo", "Ciao", "Marhaban", "Nǐ hǎo", "Privet", "Konnichiwa", "Annyeonghaseyo", "Bonjour", "Sawasdee", "Guten Tag"],
};
