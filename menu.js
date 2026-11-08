/* =========================================================
   BINGSU RENO — MENU & PRICING
   ---------------------------------------------------------
   Edit this file to update the menu. Nothing else needs to change.
   • price: a number like 13.95  → shows "$13.95"
   • price: null                → shows "Ask at the truck"
   • tag:   optional little badge ("Customer favorite", "New", …)
   • soldOut: true              → greys the item out
   ========================================================= */

window.BINGSU_MENU = {
  updated: "November 2026",

  categories: [
    {
      id: "bingsu",
      title: "Signature Bingsu",
      korean: "빙수",
      note: "Every bowl starts with our fluffy milk snow ice, shaved to order.",
      items: [
        {
          name: "Strawberry Cheesecake Bingsu",
          korean: "딸기 치즈케이크",
          price: 13.95,
          tag: "Customer favorite",
          desc: "Signature milk snow ice topped with fresh strawberry slices, rich cheesecake pieces, a taiyaki fish and Pocky sticks.",
          img: "assets/img/strawberry-cheesecake.webp"
        },
        {
          name: "Mango Cheesecake Bingsu",
          korean: "망고 치즈케이크",
          price: 13.95,
          desc: "Sweet tropical mango paired with decadent cheesecake chunks over our fluffy snow ice base.",
          img: "assets/video/mango-drizzle.jpg"
        },
        {
          name: "Oreo Bingsu",
          korean: "오레오",
          price: 12.95,
          tag: "Crowd favorite",
          desc: "Crushed Oreo cookies, chocolate drizzle and creamy snow ice, finished with cookies & cream Pocky.",
          img: "assets/img/oreo-bingsu.webp"
        },
        {
          name: "Mango Bingsu",
          korean: "망고",
          price: 12.95,
          desc: "Fresh, ripe mango served over a delicate bed of refreshing milk snow ice, with chewy rice cakes.",
          img: "assets/img/mango-cheesecake-flyer.webp"
        },
        {
          name: "Injeolmi Bingsu",
          korean: "인절미",
          price: 11.95,
          tag: "Traditional",
          desc: "A Korean classic — roasted soybean powder, chewy rice cakes and toasted sliced almonds.",
          img: "assets/img/injeolmi-red-bean.webp"
        },
        {
          name: "Melon Bingsu",
          korean: "메론",
          price: null,
          tag: "Showstopper",
          desc: "Served in a real melon bowl — piled with melon pearls, milk snow, a melon popsicle and a taiyaki fish.",
          img: "assets/img/melon-bingsu.webp"
        }
      ]
    },
    {
      id: "drinks",
      title: "Drinks",
      korean: "음료",
      note: "Iced, layered and made to order.",
      items: [
        {
          name: "Mango Sticky Rice Matcha",
          korean: "망고 찹쌀 말차",
          price: 6.95,
          size: "16 oz",
          tag: "New",
          desc: "Layers of matcha, mango and a sticky rice blend. Comes with a FREE lip charm — while supplies last.",
          img: "assets/img/mango-sticky-rice-matcha.webp"
        }
      ]
    },
    {
      id: "addons",
      title: "Add-ons",
      korean: "추가",
      note: "Make your bowl your own.",
      items: [
        {
          name: "Sweet Red Bean",
          korean: "팥",
          price: null,
          tag: "New",
          desc: "Slow-cooked sweet red bean (pat) for a traditional Korean twist on any bingsu.",
          img: "assets/img/injeolmi-red-bean.webp"
        }
      ]
    }
  ]
};
