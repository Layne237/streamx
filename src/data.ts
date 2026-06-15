/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Show, HistoryItem, User } from './types';

export const currentUser: User = {
  username: "Alex Rivera",
  email: "premium.user@streamx.com",
  plan: "Premium Ultra HD",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIJ98n4DdyhqkjLPZ2z8rzYulhpzB0pGOWOKx1mrO8IXlFV8sG9EiphTq6kjQs725sOD1oEIbl6fFK3AVItnc01-LVY216l9tR5rJaBJAr31BUMpTr4LQxW2fDbcX0VqQDMzKBmCEg2XSb0YlxTxgCF5M_7rK_0x_G-0DoQEGYC2feO_H_uZ4iJ_-BlHR5ecogHbQr93dk-sCHUXb9H_oWr_q7iBzYomelmAvFMiKrgSt02VSG7qeU5mCTxhBgGAweUM_ubKkzc9k",
  coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPeUF4Dhbx4XgSDX4lRw4XslKljBAqNVTAgsTi3N6KCThRgDRbB9Q0KUyL3KnPQFyv4zqKeZoBnvuhXm0cexaESDkzu-ZIlLhyk4J5daQhnnlAuNWTQjLJoFElJeg9ooW9RcYadZwmHj9nuW39MLEYpmejCO-IPkOiJ9OhxYjUWvYIRcqkjr39gE5EmkC_jX-aElZWA75xA-PPwH_VAcqTxaKs-WA_JhZybfnxT-zfP7oDCDOJf4JcUWHfdoxmPEvmd6Fa_glXd_8",
  isPremium: true,
  bio: "Cinephile, coffee lover, and occasional reviewer."
};

export const initialShows: Show[] = [
  {
    id: "cyberpunk-revenge",
    title: "Cyberpunk Revenge",
    genres: ["Action", "Sci-Fi", "Thrillers"],
    year: 2024,
    ratingScore: 4.9,
    maturity: "18+",
    duration: "2h 15m",
    matchPercentage: 98,
    isOriginal: true,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZEwLInme3k-4VajGowaHLdnh_GYiK-8d49eRjD3suaLYpkd5sw6PefT5MoT_8nXIrYiMe3RWYZjsUvZf_5B6DEcY3srwURi2w4-4EoumxDeJ-dLBcSltHn8iH0uaFmkMZdOjZngGdcG3aC5FdzI6pBX0OYemmKMMgrnoK5J4NpLWy3tyARNbP5gXmVyzefYjPrL-o8E9eIAMooBcb2P8RGKOKG3aestysSLPUnywXwhuNPsZkzxe0kGzGtdOgkj_8YUkIJFjBjg8",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZEwLInme3k-4VajGowaHLdnh_GYiK-8d49eRjD3suaLYpkd5sw6PefT5MoT_8nXIrYiMe3RWYZjsUvZf_5B6DEcY3srwURi2w4-4EoumxDeJ-dLBcSltHn8iH0uaFmkMZdOjZngGdcG3aC5FdzI6pBX0OYemmKMMgrnoK5J4NpLWy3tyARNbP5gXmVyzefYjPrL-o8E9eIAMooBcb2P8RGKOKG3aestysSLPUnywXwhuNPsZkzxe0kGzGtdOgkj_8YUkIJFjBjg8",
    description: "In a world where memories can be bought and sold, a disgraced detective hunts for his daughter's killer through the neon-lit underworld of Neo-Seoul. Episode 1 follows Kai as he discovers a corrupted data chip that holds the key to a conspiracy reaching the highest levels of the CorTech Corporation.",
    episodes: [
      {
        id: "cpr-ep-01",
        episodeNumber: 1,
        title: "The Memory Broker",
        duration: "45m",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDStRTjsAxHCrXByReYNPjIxk6q6WvsTHoAZp2YE7UuxEn1G5q_nuyODYs21dcLwJpXoOcmYMByc1GGp2FIm1AnCeH74unr5zWD2H6o5po2DifysgREuanlOvpEEDozfBsLuCDOwhVHnb5M4mwYnG08SO6zYeq8GebbMDhNjY8pzRRVT63I5uLb8kvTVqKza9t2UDaMrpZqKs71R3-7PIC8rS9G8F9wZOYaBCbWFj8bd6q5_pwp3Kfg2yMezVva-8lUx_UvMtniMc4",
        description: "In a world where memories can be bought and sold, a disgraced detective hunts for his daughter's killer through the neon-lit underworld of Neo-Seoul. Episode 1 follows Kai as he discovers a corrupted data chip."
      },
      {
        id: "cpr-ep-02",
        episodeNumber: 2,
        title: "Ghost in the Machine",
        duration: "42m",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAogxhgblkdcYX-I6T-3btczyCfzRjgJEAwHWRGw2bhUnujPN93lW1qb8EkbHk0fjv8XD6u7D84FhVNkwQap1pGK3kIxs-UFPeymeJm8rtYY8En2RvTedFSXwJ_IMCyoSyvAbGqvHXUUrlbyMO5i8U0-VLS0JIflP1NjjXbjhoxPCIsD0CDZ6IIVV5Al6FPtdv9OzygBOioSnI5mToy75WD-v2SKkV2oHZ2g9ffFes_B1lwIDEpseq6ggZfhmB9uM8SGeIZp9qn3m8",
        description: "Kai infiltrates the CorTech data center but discovers that his own memories might have been tampered with by the Memory Broker."
      },
      {
        id: "cpr-ep-03",
        episodeNumber: 3,
        title: "The CorTech Files",
        duration: "48m",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl1YsIqPzI4NJziuesMT33pOkRZPAvPYMFOjjbU4EUV01QPe1F9P35PGq_r8qkbl6A7xUAQp_DrICdi5v3dNt8Zvx9UQAf4KloQWwD9zDnWymMcuV_iV7KA_8CHG5jiphMaLKS6pHoy2U9-htTIb-gsmxNZhIs09PdAkBOXSBrE9mMhEa34dYU1dUBZK9VLgoou1LaXo0V7TM_7SzumNporAkLtUa_5JvlBlErj_oTLc3nGM_5ddAzUq7VqyvI0-hYfEf5zqP18BY",
        description: "A ghost in the machine starts sending messages to Kai. Is it his daughter, or a sophisticated AI trap designed to break him?"
      }
    ]
  },
  {
    id: "solar-winds",
    title: "Solar Winds",
    genres: ["Sci-Fi", "Action"],
    year: 2023,
    ratingScore: 4.8,
    maturity: "13+",
    duration: "2h 02m",
    matchPercentage: 88,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHKdlQaith1UA7mGMzDPNUaxeLYC2yWWtCw2h1P4WIEw7OQdz-XU-S4oQgiKlMkrb08HPdrRlThVQPBgFXeFwsOggJf5DdmmraPd461MoicOoxPZqdtIP-s4H-IaMFdTIUcxm4kOgATt37sEJ5rnYPO01UjCG2SnwFKiFflXp-4akNpt-HLJot0VpueREb00Wgunrsm5OSwIV9A4z6Npt5k81iUmhq3H49ia3x-kVgdn6JHDoMbn8A5XYLmBU0D5y3qS4LoZ4Qlz0",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHKdlQaith1UA7mGMzDPNUaxeLYC2yWWtCw2h1P4WIEw7OQdz-XU-S4oQgiKlMkrb08HPdrRlThVQPBgFXeFwsOggJf5DdmmraPd461MoicOoxPZqdtIP-s4H-IaMFdTIUcxm4kOgATt37sEJ5rnYPO01UjCG2SnwFKiFflXp-4akNpt-HLJot0VpueREb00Wgunrsm5OSwIV9A4z6Npt5k81iUmhq3H49ia3x-kVgdn6JHDoMbn8A5XYLmBU0D5y3qS4LoZ4Qlz0",
    description: "An astronaut stranded on the outer rings of Saturn must harness volatile solar phenomena to power a makeshift escape pod or fade into cosmic darkness."
  },
  {
    id: "void-walker",
    title: "Void Walker",
    genres: ["Sci-Fi", "Thrillers"],
    year: 2024,
    ratingScore: 4.9,
    maturity: "18+",
    duration: "1h 55m",
    matchPercentage: 92,
    isOriginal: true,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDye9K2N6_TWhS7f5EllHmQoo2klC2dYMp0vLzymT3wK7KRXgMFFCdhuDGxlgyyfpN54A8mXtoMFaHvaoJWW3il8eHS0OuBE5ZHMg0GkjR6da3KyHlghvoq3fLJ0TVJDa0UebTquXAygCtAIJiXhGrutNBvhHKi2L5igUFMgiHiyTdRTxML5d88EXmeGZbnV4S0YN1g5L42fir0EXkAzo6sMDBWXraHK33CTTlgmKqIIPcqwA871NM1Y84OXEzsIVN4ttMBsxB0Atw",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuDye9K2N6_TWhS7f5EllHmQoo2klC2dYMp0vLzymT3wK7KRXgMFFCdhuDGxlgyyfpN54A8mXtoMFaHvaoJWW3il8eHS0OuBE5ZHMg0GkjR6da3KyHlghvoq3fLJ0TVJDa0UebTquXAygCtAIJiXhGrutNBvhHKi2L5igUFMgiHiyTdRTxML5d88EXmeGZbnV4S0YN1g5L42fir0EXkAzo6sMDBWXraHK33CTTlgmKqIIPcqwA871NM1Y84OXEzsIVN4ttMBsxB0Atw",
    description: "Navigating deep-space anomalies, a lone explorer discovers that the voids between worlds contain sentient and hostile electrical consciousness."
  },
  {
    id: "midnight-pulse",
    title: "Midnight Pulse",
    genres: ["Thrillers", "Action"],
    year: 2023,
    ratingScore: 4.6,
    maturity: "16+",
    duration: "2h 10m",
    matchPercentage: 85,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLova42HkmjX2TLNd373bjl2p3EHpyV-ARRerFFZtFPv1RzWWzgW3p0GZJ4WyAuLmsFmbEXQTdyIx7WmB-IjZ8d5BSHxhWBEcJ6FZjRk6uvAN0BmoFSld3XxVi-q9tWlBCpuM6Gxc-xMwhPcoaeFY_uFnZ7hr_zMyHrzTKaYkrTC07gDBTL5xWOm63btHxl8Jfxf9CMQeNLJcwTtYmHypCwQDr5BHH2sw6y3XLiEwYDygounXuTYrKFvJXPC-PI54FhcizrlSzCic",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLova42HkmjX2TLNd373bjl2p3EHpyV-ARRerFFZtFPv1RzWWzgW3p0GZJ4WyAuLmsFmbEXQTdyIx7WmB-IjZ8d5BSHxhWBEcJ6FZjRk6uvAN0BmoFSld3XxVi-q9tWlBCpuM6Gxc-xMwhPcoaeFY_uFnZ7hr_zMyHrzTKaYkrTC07gDBTL5xWOm63btHxl8Jfxf9CMQeNLJcwTtYmHypCwQDr5BHH2sw6y3XLiEwYDygounXuTYrKFvJXPC-PI54FhcizrlSzCic",
    description: "In the neon shadows of futuristic Neo-Tokyo, a synth rhythm engineer is sucked into high-stakes corporate espionage after translating a code hidden inside a soundwave."
  },
  {
    id: "neon-odyssey",
    title: "Neon Odyssey",
    genres: ["Sci-Fi", "Action"],
    year: 24, // Let's use 2024
    ratingScore: 4.8,
    maturity: "TV-MA",
    duration: "2h 15m",
    matchPercentage: 95,
    isOriginal: true,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6HmUX0RAGPqoX6gs6YSVmFsL1XQybJW1cHB9oki9iu34e8_dtxudOv2Rqw9has33Y7n4_HrzrgYn_IEmGiLkTqfbo0yJ4Gt03uSgHHrLYplBM639btGFvFopoVf8MMgz3tWEiIuITltqErt41av1SDY0ZM7Gwevc87534YkNMFJfi35WsF_twHxajLD2zZ3ofmyOp-qoz1YcQDSMAZBzadcgrNzFwEp2f__f5eaZs0-A4tCuXw_EpB5n4NaPXl2lIBbd0prKt27c",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6HmUX0RAGPqoX6gs6YSVmFsL1XQybJW1cHB9oki9iu34e8_dtxudOv2Rqw9has33Y7n4_HrzrgYn_IEmGiLkTqfbo0yJ4Gt03uSgHHrLYplBM639btGFvFopoVf8MMgz3tWEiIuITltqErt41av1SDY0ZM7Gwevc87534YkNMFJfi35WsF_twHxajLD2zZ3ofmyOp-qoz1YcQDSMAZBzadcgrNzFwEp2f__f5eaZs0-A4tCuXw_EpB5n4NaPXl2lIBbd0prKt27c",
    description: "An astronaut stands on the banks of a red-glowing fluid sea on an alien planet, staring into a giant neon horizon of futuristic architectures."
  },
  {
    id: "last-grid",
    title: "The Last Grid",
    genres: ["Action", "Sci-Fi", "Thrillers"],
    year: 2023,
    ratingScore: 4.6,
    maturity: "TV-MA",
    duration: "Series - S2 • E8",
    matchPercentage: 90,
    isOriginal: true,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDppMajAXRCszYQBq9XazCmuFA3cMAszQ0zXaLVsn7kjwW0tpUpSvAdOKE06bFvEyVgdtg-5_MYMi4QeBbacj3RgzQl3zfchKmBRYUBMsUCHgUX-6Tcd5ttt4BwWyFY4XduVfUjNSw2h2hjz5ms5wR5WryMsjZk9LO6-CmazaF6pgWJQynXz66GWrZXg4pABYF272be1uIERLy9oH3sMoxESH2804gJ-JuC2JIM7EdwQgAKVERw0w4fV7MOEq6-_lCdu_n5Yg07_gc",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuDppMajAXRCszYQBq9XazCmuFA3cMAszQ0zXaLVsn7kjwW0tpUpSvAdOKE06bFvEyVgdtg-5_MYMi4QeBbacj3RgzQl3zfchKmBRYUBMsUCHgUX-6Tcd5ttt4BwWyFY4XduVfUjNSw2h2hjz5ms5wR5WryMsjZk9LO6-CmazaF6pgWJQynXz66GWrZXg4pABYF272be1uIERLy9oH3sMoxESH2804gJ-JuC2JIM7EdwQgAKVERw0w4fV7MOEq6-_lCdu_n5Yg07_gc",
    description: "In the ultimate grid metropolis, a hacker must stay connected to a failing matrix server to save thousands from neurological deletion."
  },
  {
    id: "void-horizon",
    title: "Void Horizon",
    genres: ["Sci-Fi", "Thrillers"],
    year: 2024,
    ratingScore: 4.8,
    maturity: "18+",
    duration: "1h 48m",
    matchPercentage: 93,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMutRwov8J7jn5Y1i869x_NOyhVLiOU6hEUsjbv9tvI0tX04tN8qPK4-QVPU3pLlAOhJ1ZvDYL70RdF0hq2RlACFZYM0ENfPcimoA-Q0XuH-tM4i8rl54g-SzZuFYksv9QlST0kTNM83V2OsRdEwBuxAxh6YgV_1y-R_zVoFVGbOfgKbRZ00yuWFKIaWX87BrwZLmcerBVh_DzHxnoCcIWlP8UFMKWjc7HWz6P-w77xbSKHUeqzjTepZzndh5dgejkFPGiJnXEXaw",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMutRwov8J7jn5Y1i869x_NOyhVLiOU6hEUsjbv9tvI0tX04tN8qPK4-QVPU3pLlAOhJ1ZvDYL70RdF0hq2RlACFZYM0ENfPcimoA-Q0XuH-tM4i8rl54g-SzZuFYksv9QlST0kTNM83V2OsRdEwBuxAxh6YgV_1y-R_zVoFVGbOfgKbRZ00yuWFKIaWX87BrwZLmcerBVh_DzHxnoCcIWlP8UFMKWjc7HWz6P-w77xbSKHUeqzjTepZzndh5dgejkFPGiJnXEXaw",
    description: "A colossal explosion occurs on a dark active volcano peak. Beautiful deep orange lava blends with deep purple night skies."
  },
  {
    id: "crimson-blade",
    title: "Crimson Blade",
    genres: ["Anime", "Action"],
    year: 2024,
    ratingScore: 4.9,
    maturity: "18+",
    duration: "S1 • E24",
    matchPercentage: 96,
    isOriginal: true,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuANvd5tPiUd2rBn6C7diJNxIwrwHWllHr-ybwLIoRaVtCRYxPMgUcm8EQ1074jCuahk4eznaP9V6doF2jfkOKddpneBzkutCzdSrhxpS9XQxd9jtofqvgtBds4u7nGrJ4H2llMWRjeGPEQT2evpjtkZ0vx-v-QAFno399uZcuQtKKsOi5lZy9cR3c4p5AxF_VhFVtKWT8bh3iJw6sa1hRObRrDD2QerG1ER52Gvhg5vXNnpFtL7apA28RfhkUudHdidbU2Q2TMlpUk",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuANvd5tPiUd2rBn6C7diJNxIwrwHWllHr-ybwLIoRaVtCRYxPMgUcm8EQ1074jCuahk4eznaP9V6doF2jfkOKddpneBzkutCzdSrhxpS9XQxd9jtofqvgtBds4u7nGrJ4H2llMWRjeGPEQT2evpjtkZ0vx-v-QAFno399uZcuQtKKsOi5lZy9cR3c4p5AxF_VhFVtKWT8bh3iJw6sa1hRObRrDD2QerG1ER52Gvhg5vXNnpFtL7apA28RfhkUudHdidbU2Q2TMlpUk",
    description: "A lone samurai with a sleek longsword stands silhouetted against a brilliant blood-red circular full moon."
  },
  {
    id: "whispers",
    title: "Whispers in the Dark",
    genres: ["Thrillers", "Mystery"],
    year: 2023,
    ratingScore: 4.5,
    maturity: "TV-MA",
    duration: "2h 05m",
    matchPercentage: 86,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcZRBGeTK844xQIfpn0yLhpECebDataxoeE3H_MFGP6_jD36i7PgjtE3e4i0Qfl8Lio8brU-z9zm5O4fFDFfsE9FSgeh9_PlRy41qlQINBVAN29q1LplHXFq69JGO7Tk2HccARdjXR3wcmq1m2rIQsu-RJvYUTWUHMlM3Jz6qy7lMiIXnyFuJhyqbWQgOluda4qXMFHwCC_kfIQwaaZbQuRwbA6-cVCNax_j6nRmPplbzuLsYdG_hrmaEEeiaD-zl7hQtcydg_8QI",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcZRBGeTK844xQIfpn0yLhpECebDataxoeE3H_MFGP6_jD36i7PgjtE3e4i0Qfl8Lio8brU-z9zm5O4fFDFfsE9FSgeh9_PlRy41qlQINBVAN29q1LplHXFq69JGO7Tk2HccARdjXR3wcmq1m2rIQsu-RJvYUTWUHMlM3Jz6qy7lMiIXnyFuJhyqbWQgOluda4qXMFHwCC_kfIQwaaZbQuRwbA6-cVCNax_j6nRmPplbzuLsYdG_hrmaEEeiaD-zl7hQtcydg_8QI",
    description: "A mysterious traveler wanders through a deeply forested twilight fog, illuminated by a warm organic orb light in the center."
  },
  {
    id: "velocity-zero",
    title: "Velocity Zero",
    genres: ["Action", "Thrillers"],
    year: 2024,
    ratingScore: 4.2,
    maturity: "13+",
    duration: "1h 55m",
    matchPercentage: 82,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP5DAS7kx8o8Dg08WQ9DORZbx42IRRLR8xsRVhhbVB3EjSadWbIGlZUbW36XWDcGg2LKJ66wE04CPpTumapCxhEmjVpC7j67mEZC2HVev6K7gzZBymZ6CuuO1GOXEepI9MnmCcovtf1Bb6pA8_UQ8EGNo13NKGAanuFwp-UWC-85uW77CoHP-4KPcInAiy18zcEoroTBWUwO4P7V72dfytGibTkV1_MD9kPjRbc83KFHtBnsd24fWGRMgA3xLXrbR8NFsdv52yDGQ",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP5DAS7kx8o8Dg08WQ9DORZbx42IRRLR8xsRVhhbVB3EjSadWbIGlZUbW36XWDcGg2LKJ66wE04CPpTumapCxhEmjVpC7j67mEZC2HVev6K7gzZBymZ6CuuO1GOXEepI9MnmCcovtf1Bb6pA8_UQ8EGNo13NKGAanuFwp-UWC-85uW77CoHP-4KPcInAiy18zcEoroTBWUwO4P7V72dfytGibTkV1_MD9kPjRbc83KFHtBnsd24fWGRMgA3xLXrbR8NFsdv52yDGQ",
    description: "A luxury sports car cockpit speeding through futuristic neon-light tunnels with dynamic radial blur motion blur."
  },
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    genres: ["Sci-Fi", "Action"],
    year: 2024,
    ratingScore: 4.9,
    maturity: "TV-MA",
    duration: "2h 10m",
    matchPercentage: 97,
    isOriginal: true,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2KldTDWcKrGqgWMA-PsbhMUmd7J1WsNOIb-XzPXbmnwAkmJXHMTLXbbLAoGnbIs_cP_v5YLdajGUWyiN0OgULz2M4N3IU1fqnj76VU0mYiNFWD6W3EDqR33gvCHsgx2uhRAz422PBLHy_nGi_fpzC54KEmiSx0ZTLN7t2coAfgLqS8Qxe7h7Wi6r5wndEkmcNZ23Vij5GnVUfVzRvUUPxrnSrOdS7YH1gjqxKPKZf9Him0okSYxLmrDZVeCZh9KiUgr0dvUYH5Q",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2KldTDWcKrGqgWMA-PsbhMUmd7J1WsNOIb-XzPXbmnwAkmJXHMTLXbbLAoGnbIs_cP_v5YLdajGUWyiN0OgULz2M4N3IU1fqnj76VU0mYiNFWD6W3EDqR33gvCHsgx2uhRAz422PBLHy_nGi_fpzC54KEmiSx0ZTLN7t2coAfgLqS8Qxe7h7Wi6r5wndEkmcNZ23Vij5GnVUfVzRvUUPxrnSrOdS7YH1gjqxKPKZf9Him0okSYxLmrDZVeCZh9KiUgr0dvUYH5Q",
    description: "Behold the golden sun rising in a desert of neon structures with a solitary traveller standing on a high sand ridge."
  },
  {
    id: "shadow-city",
    title: "Shadow City",
    genres: ["Mystery", "Thrillers"],
    year: 2024,
    ratingScore: 4.7,
    maturity: "TV-MA",
    duration: "1h 50m",
    matchPercentage: 91,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmam-yGgKSRTbbvMeTHIsUAdViqtrP5EPOOijE6HVb_2IxERoU-aQzp_V0LhqyljvLdu7kJw_xD9luvRfV-EEp-hH40GAiNPYmH5Aknip1tQ5BqVjCEsJd1hznjhyTZj3HVARo3SWCP8Ay2hTertFtDTquwb0M_GEmBGxGNzQxiyxBu7epvTYr0sylqua9l4V_LYO3wfZ1YHoQKwzjD8LlfaYdQCfRM3tlOnHVmu9Z1HRc7Fd45GiCuEpGFh0uWhsqATjkXuqR5ek",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmam-yGgKSRTbbvMeTHIsUAdViqtrP5EPOOijE6HVb_2IxERoU-aQzp_V0LhqyljvLdu7kJw_xD9luvRfV-EEp-hH40GAiNPYmH5Aknip1tQ5BqVjCEsJd1hznjhyTZj3HVARo3SWCP8Ay2hTertFtDTquwb0M_GEmBGxGNzQxiyxBu7epvTYr0sylqua9l4V_LYO3wfZ1YHoQKwzjD8LlfaYdQCfRM3tlOnHVmu9Z1HRc7Fd45GiCuEpGFh0uWhsqATjkXuqR5ek",
    description: "A lone investigator wanders through rain-drenched dark alleys reflecting bright magenta and cyan commercial screens."
  },
  {
    id: "last-frontier",
    title: "The Last Frontier",
    genres: ["Adventure", "Drama"],
    year: 2023,
    ratingScore: 4.5,
    maturity: "13+",
    duration: "2h 40m",
    matchPercentage: 85,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHaDU2fP5S-x6Os-9WPO17QYpb3acHHKDUk2kGgBJTvAlGE5SFkuTxY6Bf5nAZLP0O_q9icFtmbdpk0AP8h3fHvmucMqtFLEb_X3KkS9N2W5XYHUm3zFgcFkqXsqoaAzmHqLxHBJ6FVPuDUNSTc_QIgv0ZYw1OzaHovWkaciS-oUdlzK7Q5XiYSme-Af6IB6Ub2YIzgCNBhxy4M0ty_Gfche1DR9hUr-NDnQ-KUZUaB-YZkKBZhhPKCnUXmPvdX7WKjJNe_OZRWNw",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHaDU2fP5S-x6Os-9WPO17QYpb3acHHKDUk2kGgBJTvAlGE5SFkuTxY6Bf5nAZLP0O_q9icFtmbdpk0AP8h3fHvmucMqtFLEb_X3KkS9N2W5XYHUm3zFgcFkqXsqoaAzmHqLxHBJ6FVPuDUNSTc_QIgv0ZYw1OzaHovWkaciS-oUdlzK7Q5XiYSme-Af6IB6Ub2YIzgCNBhxy4M0ty_Gfche1DR9hUr-NDnQ-KUZUaB-YZkKBZhhPKCnUXmPvdX7WKjJNe_OZRWNw",
    description: "A gorgeous scenic fantasy shot where massive rock spires touch gold clouds with a pack of travellers following a stream path."
  },
  {
    id: "cipher-protocol",
    title: "Cipher Protocol",
    genres: ["Thrillers", "Sci-Fi"],
    year: 2024,
    ratingScore: 4.8,
    maturity: "18+",
    duration: "1h 50m",
    matchPercentage: 94,
    isOriginal: true,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsAO_3ldsyntoi7FS6UAJcQfl2ls6m8V_nwdPJvtZ7d7MMkIxKvZU_Ptye72FRShhacxDgGYRgOG7wJtO2hzWjyqJeAZ7v3LoR3VPxYdDGu2NiFEsoVU5J0UuxP41In9NF2MWILlaMzDeYmyC4iqgBq6MrBp6i5ablJxQLaB9RL_c_PPKLdJn_wlWGyTmo2tT62p3Q4uH1FlmoyrU83uNI4rbd4KbVpagXDFOssYokOPccQNtsZ8LiLoCORdJii03hpzHxRviWgsk",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsAO_3ldsyntoi7FS6UAJcQfl2ls6m8V_nwdPJvtZ7d7MMkIxKvZU_Ptye72FRShhacxDgGYRgOG7wJtO2hzWjyqJeAZ7v3LoR3VPxYdDGu2NiFEsoVU5J0UuxP41In9NF2MWILlaMzDeYmyC4iqgBq6MrBp6i5ablJxQLaB9RL_c_PPKLdJn_wlWGyTmo2tT62p3Q4uH1FlmoyrU83uNI4rbd4KbVpagXDFOssYokOPccQNtsZ8LiLoCORdJii03hpzHxRviWgsk",
    description: "An interactive high tech hardware microchip glowing with electric cyan digital laser grids and light rays."
  },
  {
    id: "spirit-of-echoes",
    title: "Spirit of Echoes",
    genres: ["Animation", "Comedy"],
    year: 2023,
    ratingScore: 4.6,
    maturity: "All",
    duration: "1h 35m",
    matchPercentage: 88,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmEH7oJogo0TkL18dNUvFeT_eFMtDCXys3-_j1k65vI2ryOT5IIgMQac8i0460vdxQXrYJu-YBBz0uNNepivKoK6msO9DLTNjGdXVexqmLJu6JPO6Oz-S11KKKZL8JDCpeau_WbkRnlrTS39USQsVUmobmYhUZlZEX-lr_Bc4p_tk0uuRDRc3S2Xn89YgeBRsUH2Jffp24F5mh3dcMqT5uU9w604oF_5lPR-etHKMYVCbdavjxdU5DrB7KmPmYA8B3OaYAb-qu06Y",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmEH7oJogo0TkL18dNUvFeT_eFMtDCXys3-_j1k65vI2ryOT5IIgMQac8i0460vdxQXrYJu-YBBz0uNNepivKoK6msO9DLTNjGdXVexqmLJu6JPO6Oz-S11KKKZL8JDCpeau_WbkRnlrTS39USQsVUmobmYhUZlZEX-lr_Bc4p_tk0uuRDRc3S2Xn89YgeBRsUH2Jffp24F5mh3dcMqT5uU9w604oF_5lPR-etHKMYVCbdavjxdU5DrB7KmPmYA8B3OaYAb-qu06Y",
    description: "An animated fairytale landscape with glowing neon mushrooms and bioluminescent plants beneath a large crescent moon."
  },
  {
    id: "full-throttle",
    title: "Full Throttle",
    genres: ["Action", "Thrillers"],
    year: 2023,
    ratingScore: 4.2,
    maturity: "13+",
    duration: "2h 00m",
    matchPercentage: 81,
    isOriginal: false,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaaAW359dpPafCNlpkA0ST864zvwJWnLDob74-E7s2--bYsooRYX8sPUcefcFtoH4NeZcU74a9A_xjYAZHMbl4sUdHipG5v-eVjsFW9uifCfasqmyeAo9Yo_jYUGt_YBdmibppc6ibNsU2PHBhvJtb1WoNJWKummRj546WVRtxVf5Owtc7wuyF6sla9czJia796GNQgxe4wYvNRSkcjXPaRVxwfiohz2SGu6U7_7P_3zIlaGDCeEniXMPiK6xfTcLQ_PuLNYzOxr4",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaaAW359dpPafCNlpkA0ST864zvwJWnLDob74-E7s2--bYsooRYX8sPUcefcFtoH4NeZcU74a9A_xjYAZHMbl4sUdHipG5v-eVjsFW9uifCfasqmyeAo9Yo_jYUGt_YBdmibppc6ibNsU2PHBhvJtb1WoNJWKummRj546WVRtxVf5Owtc7wuyF6sla9czJia796GNQgxe4wYvNRSkcjXPaRVxwfiohz2SGu6U7_7P_3zIlaGDCeEniXMPiK6xfTcLQ_PuLNYzOxr4",
    description: "Sleek obsidian sports cars race through hyper-fast metallic storm drains, throwing off sparks under automated warning arrays."
  },
  {
    id: "gits-2045",
    title: "GHOST IN THE SHELL: SAC_2045",
    genres: ["Anime", "Sci-Fi", "Action"],
    year: 2024,
    ratingScore: 4.9,
    maturity: "TV-MA",
    duration: "Series - S1 • E12",
    matchPercentage: 99,
    isOriginal: true,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM7sNbMJ8SKMgJduAsGjSis-0Up7L7cKC3mzm17ds1NqoNeU2KPinfQy1Tr38IvSsGnjDCFhhueib3ZNFlysfB9ArJOF07fjBrf22CRre4NrvthOW_q2lwM9tmgPwEKxNgz8mKpukJnm62Xg_UybLUKIY0AXc2hHeaHT4xyc_rFwu2JnJZC8wE9X__KzrYjOqZjWGu0pOxqBIxP1ImNzAOpQ8Fy06nkof2KLxabMaaMzeK1IamEn5rKU15sDn_5uwNnaPQ1FrAa-c",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM7sNbMJ8SKMgJduAsGjSis-0Up7L7cKC3mzm17ds1NqoNeU2KPinfQy1Tr38IvSsGnjDCFhhueib3ZNFlysfB9ArJOF07fjBrf22CRre4NrvthOW_q2lwM9tmgPwEKxNgz8mKpukJnm62Xg_UybLUKIY0AXc2hHeaHT4xyc_rFwu2JnJZC8wE9X__KzrYjOqZjWGu0pOxqBIxP1ImNzAOpQ8Fy06nkof2KLxabMaaMzeK1IamEn5rKU15sDn_5uwNnaPQ1FrAa-c",
    description: "In a world where cybernetics have become the norm, Major Motoko Kusanagi leads Section 9 into a digital frontier against a new global threat. Witness the fusion of humanity and machine in this stunning anime odyssey."
  },
  {
    id: "the-batman",
    title: "The Batman",
    genres: ["Action", "Thrillers"],
    year: 2022,
    ratingScore: 4.8,
    maturity: "18+",
    duration: "2h 45m",
    matchPercentage: 89,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEByd84QMY9HFa4DGquJ-Kp_dF4ssM9wK-GnjOj1oUEH0S4gtDZyLM4SZ47CuvabDBPzuvo1iYlc3oQjrC9T4UJMSlJekwMXBx4YWoqMpv-4U7WwlLGP3RMI2kHZXYQOLxpgWhD5YnpnXwSpKFAFtKD-CIW_-MHHzbufvWVCNOSeemJERWD45krKZOR4t5kXa5a8x3XE_pP80q67uHXuJDb8qw7YmtqdhHcrSu2QY-pzMmH34wwRmNYSP48RfSm6XdLQtRlyrQs0I",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEByd84QMY9HFa4DGquJ-Kp_dF4ssM9wK-GnjOj1oUEH0S4gtDZyLM4SZ47CuvabDBPzuvo1iYlc3oQjrC9T4UJMSlJekwMXBx4YWoqMpv-4U7WwlLGP3RMI2kHZXYQOLxpgWhD5YnpnXwSpKFAFtKD-CIW_-MHHzbufvWVCNOSeemJERWD45krKZOR4t5kXa5a8x3XE_pP80q67uHXuJDb8qw7YmtqdhHcrSu2QY-pzMmH34wwRmNYSP48RfSm6XdLQtRlyrQs0I",
    description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues."
  },
  {
    id: "gran-turismo",
    title: "Gran Turismo",
    genres: ["Action", "Drama"],
    year: 2023,
    ratingScore: 4.5,
    maturity: "13+",
    duration: "2h 10m",
    matchPercentage: 75,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhWOkcfFyYBQ3lU7arzIV0kNRjq0W6c-8AbooOsdZDjYJu3up1Z03dUG3tQTTlKsmPgPUg81oJJMm82rLlp2I59veF3I8WYld1amt_BCFmwivkr1O8Ou74WI6ScaxtbW7i8zgz_5RcMYbIB24l_MoryHTst1uSUA4CxUPXz095050csdm0V-wM1KvRe1d21mVxQUMFOi8b8i9AECrELY9zn3furSJLKzTCBIEv7Sg3zLELPclmBUD85CjAoat3-dasbtmt323iozQ",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhWOkcfFyYBQ3lU7arzIV0kNRjq0W6c-8AbooOsdZDjYJu3up1Z03dUG3tQTTlKsmPgPUg81oJJMm82rLlp2I59veF3I8WYld1amt_BCFmwivkr1O8Ou74WI6ScaxtbW7i8zgz_5RcMYbIB24l_MoryHTst1uSUA4CxUPXz095050csdm0V-wM1KvRe1d21mVxQUMFOi8b8i9AECrELY9zn3furSJLKzTCBIEv7Sg3zLELPclmBUD85CjAoat3-dasbtmt323iozQ",
    description: "The ultimate wish-fulfillment tale of a teenage Gran Turismo player whose gaming skills won a series of Nissan competitions."
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    genres: ["Drama", "Documentary"],
    year: 2023,
    ratingScore: 4.9,
    maturity: "18+",
    duration: "3h 05m",
    matchPercentage: 92,
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0y2uCEPXpIEh3Urfkay2aFcGV89R6SzfvOTBuUa8go9P99ctPHbf4x73eLdgnRmzFbahhJ3HpNiipImN81C2gUwSG5mSZ_EmfoSYzheKyd3tk7yVW9Lk4g2Vh5Ch0409MxLudK0stED7vQSCMgUSpU_xUa5oJ0RMyGHYu9Yx7qNJETIpbBHaqk7y3xgZv3tfCHdFkKOoWr_zD6GUuZfCu6qwKph87UFX1arvDGZhWokr61qYXnv5LNcE7vWaVRXEeb9ofkUuLC8Y",
    backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0y2uCEPXpIEh3Urfkay2aFcGV89R6SzfvOTBuUa8go9P99ctPHbf4x73eLdgnRmzFbahhJ3HpNiipImN81C2gUwSG5mSZ_EmfoSYzheKyd3tk7yVW9Lk4g2Vh5Ch0409MxLudK0stED7vQSCMgUSpU_xUa5oJ0RMyGHYu9Yx7qNJETIpbBHaqk7y3xgZv3tfCHdFkKOoWr_zD6GUuZfCu6qwKph87UFX1arvDGZhWokr61qYXnv5LNcE7vWaVRXEeb9ofkUuLC8Y",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb."
  }
];

export const initialHistory: HistoryItem[] = [
  {
    id: "neon-protocol-item",
    title: "Neon Protocol",
    progress: 85,
    info: "S2 • E8",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4vdRs846QdWoMynoz6Ln6-YVyEWqbAvhlc_SLil8l5FBNM6pHZZCt6y-cpUJeMSCtUXKU0MFuvbrB7-LV2sF6erFHwXiCQjkpJdGB0VuSOklPNiDmK3RcaE_HHdYpWUmNP4GrC7GEVB_U9UH0ClNtFlY0ZJs1J_K8KQd6jprUwo-LarDgiMAoF0LAgS0rsiqE1Z0zGsepz0IqYLJjZL9kzl6hT55LRpgdJjdQUwIaOFPpN3IVat1EvAsCESWS1YypzIkgVqt6cTE",
    timestamp: "Today",
    remaining: "12m left"
  },
  {
    id: "beyond-void-item",
    title: "Beyond the Void",
    progress: 100,
    info: "Feature Film",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpIzXRU8YyEmr9GuMAOT5hqWDyaGlpvVo9Neyaa2HcEIYm1x6sjA3Re3Hp4GzUB8DR6T9zIntlxadwvNM5JwTcyYnEFRlWglxL2XttC1dgWDt93SeVj1GozUYyL7KelhB00APgjS-QyzU4jwwWh51kW8Eve1dpjOCgTMlnPsGZ20SNmVvjccsw8P6MlvMcY_VmTxXk87aOwcbXfLaNgBH3DOwlyNapktsNlQ4ASELHhm8AzB5VenDp4ZniiIj0fCi2yrMhQ1HeAMI",
    timestamp: "Today"
  },
  {
    id: "last-encore-item",
    title: "The Last Encore",
    progress: 15,
    info: "Docuseries",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi2Itb8l3iJqYkVRoQCJRiJY0icCXuqTUsuta3NO1apqHLfLFdiePVmphqHmEPRT7ekdwLydXRqR69IFFJqVAH9uQK42r-jZNqPVfOac-mGgUheY1er5vQgn0GjF8-Efrj3ZpWEzIXfjKPvoE48pp952A8V8Bx-0wR3za9EGeVPs-srcucO1IeBOjDyFV70P8IDRMkpkwAgyDqb_CSS6L9PdlXd91pX-nFooTSAGkrRBKR0LB72pcDoKopHVy8nBHROrTyol5xHxc",
    timestamp: "Today",
    remaining: "12m left"
  },
  {
    id: "cinema-paradiso-item",
    title: "Cinema Paradiso",
    progress: 45,
    info: "Classic Collection",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHpsasezI1JOyeNojgCyUEd2PXOOpTqMWTY2QIG5u-ASlb7vpmrYyLuM8zN7DC-j5TY7dem7wDam2TPxvx9sASa9Z9plQMd0-EHVS-ImxoXkW8tKAuKDmtbyuhvLlyL1VY8QQYCqvEU7bh0iPpGS2Vz-_yEevsyYjrpng6vzAx5QlgGxfapvebjblm3xsYTZsuLkYDPXUeFmDfNuqqq5jwMmXXzSP3KxCvMpjV54VYPQ5n-oYFGCHMElBmO8nkCX2OwXaUoXsAg4Y",
    timestamp: "Yesterday"
  },
  {
    id: "data-breach-item",
    title: "Data Breach",
    progress: 100,
    info: "Tech Series",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYMQoSplB6xwhlY4FJwVV4xvqNlaMOT6Iae6gVfdQcZExDfWJA22ZTfot1Vjwv56CYpEgzQi6AyQehtEdV0ibNvBWbVNIRZz3WLYMb33LdXeFH6ZkHYWy-Y3Hxmk874LIR_2tKON4kSta9OIKvV8FXjf0Jk9IcBneqJGrqeSkodZJ7jtLfH20a4pewcPORy_hghkQHEOaAqoFUNYKbG0olim-mlJSXRN_Sx3gC6Uz2a1xDvHicfwOyMKhhmHSBxMyqUKnLlXrzJUc",
    timestamp: "Yesterday"
  }
];
