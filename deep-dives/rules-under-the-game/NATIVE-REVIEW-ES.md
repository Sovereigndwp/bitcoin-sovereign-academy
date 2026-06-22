# Spanish native-review notes

> For Dalia (native LATAM Spanish). A native-reader pass has now been applied to the Spanish data file and the Spanish half of the teacher guide. Parity with the English file is preserved, there are no em dashes, and the safety language around recovery codes and seed phrases is unchanged. What remains below is global/stylistic judgment a native speaker should make, plus a couple of cross-language consistency items.

## What the native-reader pass changed (applied)

About two dozen targeted fixes in `data/rules-under-the-game.es.json`, each for naturalness, a calque, a regionalism, or consistency, not re-polishing good Spanish:

- Removed a Colombia-only regionalism ("se vuelve corredera" became "se te va en ponerte al día").
- De-calqued literal translations: "un rango de cosas" became "alcanza para varias cosas"; "Eso no vuelve barato" became "Ese tiempo no vuelve"; "espera por más" became "espera para tener más"; "El protocolo carga las reglas" became "Las reglas viven en el protocolo."
- Fixed false friends / clarity: "preciosa" (which reads as pretty) became "valiosísima"; "Una sudadera con capucha" became "Una chaqueta con capucha" (in Colombia "sudadera" means sweatpants); "responder a golpes" became "responder a imprevistos"; "el pasillo no cabría" became "no cabrían todos en el pasillo."
- Fixed grammar/orthography: "el multifirma colaborativo" became "la multifirma colaborativa" (firma is feminine); "Auto custodia" became "La autocustodia."
- Made "cambia de largo" (a literal "changes length") into "se estira o se encoge" across Module 4 and the glossary, matching the wording used elsewhere.
- LATAM-natural term swaps: "autobús" became "bus"; "Tú guardando tus propias llaves" became "Tú mismo guardas tus llaves"; the exchange and bus-pass labels reworded plainly.
- Consistency: the hub start text and the teacher guide now match the Module 1 Monday-deadline and the Module 5 title, and the teacher guide now correctly says the seed-phrase example lives in Module 5 (not Module 2).

## Left for your decision (global, not applied to avoid over-polishing)

1. **"regla de medir"** vs **"vara de medir"** for the measuring-stick metaphor (Module 4, Module 6, glossary). Both work; "regla de medir" was kept because it matches the on-page wording. If you prefer "vara de medir," it is a clean global swap.
2. **"guardián / guardianes"** vs **"quién guarda / el que guarda"** in the Trust Map. The tool mixes both. Say which you want and I will make it consistent.
3. **"contrapartida"** (tradeoff). Correct and neutral, slightly formal for a teen; "lo que ganas y lo que pierdes" is warmer in prose, though the button label is hard to soften.
4. **"deep dive"** is left in English in the hub eyebrow and a few notes, since BSA uses it as a product name. Confirm, or I can use "exploración a fondo."
5. **Currency.** The scenario uses "veinte dólares." For a Colombia/LATAM teen you may prefer a local or neutral framing; not changed, to avoid over-localizing.
6. **"frase semilla"** vs **"frase de recuperación."** Now cleaner: Module 2 uses "código de recuperación" (a non-Bitcoin account recovery code), and "frase semilla" appears only in Module 5 as the Bitcoin self-custody safety note. Keep as-is unless you want one shared term.

## Needs a separate pass (out of scope here)

- **Engine UI strings** (button and hint text rendered by the tools, e.g. "Ver cómo salió la noche," "Aplicar la regla") live in `js/rules-under-the-game.js`, not the data file. They were reviewed read-only and read fine; none are blocking. They were not edited because this pass does not touch JS.
- **English teacher guide drift.** The English half of `TEACHER-GUIDE.md` still says "Trust, Verify, or Get Played" and "Module 2 uses a seed phrase," both now stale after the content audit. Left untouched because this pass is Spanish-only. Authorize it and I will correct the two English lines to match.
