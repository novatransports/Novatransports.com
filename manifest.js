(function () {
  "use strict";

  /* ============================================================
     NOVA — Transportación Ejecutiva
     Brand data. All dynamic content lives here.
     Bilingual: every user-facing string has { es, en }.
     ============================================================ */

  window.__BRAND__ = {
    name: "NOVA",
    tagline: { es: "Transportación Ejecutiva", en: "Executive Transportation" },

    // ---- Cities & fleet -------------------------------------
    cities: [
      {
        id: "gdl",
        flag: "🇲🇽",
        name: "Guadalajara",
        region: { es: "Jalisco, México", en: "Jalisco, Mexico" },
        role: { es: "Base de operaciones", en: "Headquarters" },
        blurb: {
          es: "Nuestra casa. La flotilla completa opera desde Guadalajara, con servicio dedicado a los huéspedes del JW Marriott.",
          en: "Our home base. The full fleet operates from Guadalajara, with dedicated service for JW Marriott guests."
        },
        fleet: [
          { model: "BYD King", type: { es: "Sedán ejecutivo", en: "Executive sedan" }, electric: true, seats: 4, photo: "assets/img/byd-king.webp" },
          { model: "Chevrolet Tahoe", type: { es: "SUV ejecutiva", en: "Executive SUV" }, electric: false, seats: 6, photo: "assets/img/chevrolet-tahoe.webp" },
          { model: "Mazda CX-30", type: { es: "Crossover ejecutivo", en: "Executive crossover" }, electric: false, seats: 4, photo: "assets/img/mazda-cx30.webp" },
          { model: "Ford Transit", type: { es: "Van de lujo", en: "Luxury van" }, electric: false, seats: 12, photo: "assets/img/ford-transit.webp" },
          { model: "Mercedes Sprinter", type: { es: "Grupos", en: "Group transfers" }, electric: false, seats: 14, photo: "assets/img/mercedes-sprinter.webp" }
        ]
      },
      {
        id: "tij",
        flag: "🇲🇽",
        name: "Tijuana",
        region: { es: "Baja California, México", en: "Baja California, Mexico" },
        role: { es: "Flotilla 100% eléctrica", en: "100% electric fleet" },
        blurb: {
          es: "Tres unidades BYD King, totalmente eléctricas, y aliados oficiales del Westin Tijuana. El punto de partida ideal para el cruce binacional vía CBX.",
          en: "Three fully-electric BYD King units, and official partners of the Westin Tijuana. The ideal starting point for the binational crossing via CBX."
        },
        fleet: [
          { model: "BYD King", type: { es: "Sedán ejecutivo eléctrico", en: "Electric executive sedan" }, electric: true, seats: 4, units: 3, photo: "assets/img/byd-king.webp" }
        ]
      },
      {
        id: "san",
        flag: "🇺🇸",
        name: "San Diego",
        region: { es: "California, EE. UU.", en: "California, USA" },
        role: { es: "Flotilla 100% eléctrica", en: "100% electric fleet" },
        blurb: {
          es: "Tres Tesla Model Y, SUV eléctricas premium. Conexión directa con Tijuana para turismo médico, negocios y placer.",
          en: "Three Tesla Model Y premium electric SUVs. Direct connection with Tijuana for medical tourism, business and leisure."
        },
        fleet: [
          { model: "Tesla Model Y", type: { es: "SUV eléctrica premium", en: "Premium electric SUV" }, electric: true, seats: 5, units: 3, photo: "assets/img/tesla-model-y.webp" }
        ]
      },
      {
        id: "col",
        flag: "🇨🇴",
        name: "Colombia",
        region: { es: "Próximamente", en: "Coming soon" },
        role: { es: "En evaluación", en: "Under evaluation" },
        soon: true,
        blurb: {
          es: "Estamos evaluando nuestra próxima expansión. Pronto, el estándar Nova en una nueva geografía.",
          en: "We're evaluating our next expansion. Soon, the Nova standard in a new geography."
        },
        fleet: []
      }
    ],

    // ---- Services -------------------------------------------
    services: [
      {
        id: "airport",
        title: { es: "Aeropuerto ↔ Hotel", en: "Airport ↔ Hotel" },
        desc: {
          es: "Recepción privada, monitoreo de vuelo y traslado directo. Sin esperas, sin fricciones.",
          en: "Private meet-and-greet, flight tracking and direct transfer. No waiting, no friction."
        }
      },
      {
        id: "hourly",
        title: { es: "Disposición por horas", en: "Hourly chauffeur" },
        desc: {
          es: "Un chofer y un vehículo ejecutivo a tu disposición. Tú marcas la agenda; nosotros, el ritmo.",
          en: "A chauffeur and an executive vehicle at your command. You set the agenda; we set the pace."
        }
      },
      {
        id: "executive",
        title: { es: "Traslados ejecutivos", en: "Executive transfers" },
        desc: {
          es: "Punto a punto para reuniones, eventos y agendas corporativas. Puntualidad medida en segundos.",
          en: "Point-to-point for meetings, events and corporate agendas. Punctuality measured in seconds."
        }
      },
      {
        id: "jw",
        title: { es: "Huéspedes de hotel", en: "Hotel guests" },
        desc: {
          es: "Servicio dedicado para huéspedes del JW Marriott Guadalajara y el Westin Tijuana, como aliados oficiales de ambos hoteles.",
          en: "Dedicated service for JW Marriott Guadalajara and Westin Tijuana guests, as official partners of both hotels."
        }
      }
    ],

    // ---- Contact --------------------------------------------
    contact: {
      email: "transportsnova@gmail.com",
      phoneDisplay: "+52 56 5492 8661",
      phoneHref: "+525654928661",
      base: { es: "Guadalajara · Jalisco · México", en: "Guadalajara · Jalisco · Mexico" }
    },

    founder: "Santiago Favier"
  };
})();
