export const translations = {
  en: {
    menu: {
      items: [
       { label: "Index", href: "/" },              
        { label: "About", href: "/about" },     
        { label: "Cases", href: "/cases" },   
        { label: "Playground", href: "/playground" },
        { label: "Source", href: "/source" },
        { label: "Contact", href: "/contact" }
      ],
      location: {
        title: "Location",
        value: "Bangalore, India",
      },
      contact: {
        title: "Contact",
        value: "farhumaid@gmail.com",
      },
    },
  },
  jp: {
    menu: {
      items: [
        { label: "ホーム", href: "/" },              
        { label: "について。", href: "/about" },     
        { label: "プロジェクト", href: "/cases" },   
        { label: "プレイグラウンド", href: "/playground" },
        { label: "ソース", href: "/source" },
        { label: "リーチアウト", href: "/contact" }
      ],
      location: {
        title: "場所",
        value: "バンガロール、インド",
      },
      contact: {
        title: "連絡先",
        value: "farhumaid@gmail.com",
      },
    },
  },
} as const;

