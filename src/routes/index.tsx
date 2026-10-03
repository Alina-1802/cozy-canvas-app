import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Heart, Home,
  MessageCircle, Search, Send, SlidersHorizontal, Sparkles, UserRound, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import girls from "@/assets/techbestie-girls.png";
import amara from "@/assets/mentor-amara.jpg";
import maya from "@/assets/mentor-maya.jpg";
import lena from "@/assets/mentor-lena.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "TechBestie | Znajdź swoją TechBestie" },
    { name: "description", content: "Poznaj studentki kierunków technologicznych, przeczytaj ich historie i znajdź osobę, która rozumie Twoje pytania." },
    { property: "og:title", content: "TechBestie | Znajdź swoją TechBestie" },
    { property: "og:description", content: "Poznaj studentki kierunków technologicznych, przeczytaj ich historie i znajdź osobę, która rozumie Twoje pytania." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const fields = ["Informatyka", "Sztuczna inteligencja", "Inżynieria", "UX / design", "Analiza danych", "Jeszcze nie wiem"];
const subjects = ["Matematyka", "Informatyka", "Fizyka", "Plastyka / projektowanie", "Biologia", "Nie mam jeszcze ulubionego"];
const universities = ["Politechnika Warszawska", "AGH", "Uniwersytet Warszawski", "Politechnika Wrocławska", "Inna uczelnia", "Jeszcze nie wiem"];
const doubts = ["Czy sobie poradzę?", "Czy znajdę tam swoje miejsce?", "Który kierunek wybrać?", "Jak wyglądają studia?", "Co można robić po studiach?"];

type Answers = { fields: string[]; subjects: string[]; universities: string[]; doubts: string[] };
type AnswerKey = keyof Answers;
const initialAnswers: Answers = { fields: [], subjects: [], universities: [], doubts: [] };
const questions: { key: AnswerKey; eyebrow: string; title: string; hint: string; choices: string[] }[] = [
  { key: "fields", eyebrow: "01 / KIERUNKI", title: "Co Cię ciekawi?", hint: "Wybierz kierunki, które bierzesz pod uwagę.", choices: fields },
  { key: "subjects", eyebrow: "02 / PRZEDMIOTY", title: "Co lubisz w szkole?", hint: "Nie musisz być w tym najlepsza — wystarczy, że Cię interesuje.", choices: subjects },
  { key: "universities", eyebrow: "03 / UCZELNIE", title: "Myślisz o jakiejś uczelni?", hint: "Możesz wybrać kilka albo zostawić to otwarte.", choices: universities },
  { key: "doubts", eyebrow: "04 / TWOJE PYTANIA", title: "Co chodzi Ci po głowie?", hint: "O to właśnie możesz zapytać studentkę.", choices: doubts },
];

const mentors = [
  { name: "Maja", image: maya, field: "Inżynieria", university: "Politechnika Warszawska", subject: "Fizyka", quote: "Myślałam, że nie pasuję. Teraz projektuję rzeczy, z których jestem dumna.", story: "Na początku bałam się, że wszyscy będą wiedzieli więcej ode mnie. Okazało się, że prawie każdy zaczynał z podobnymi pytaniami. Na zajęciach znalazłam osoby, z którymi mogę eksperymentować, mylić się i próbować od nowa. Nie trzeba mieć gotowego planu, żeby zrobić pierwszy krok.", about: "Studentka inżynierii, która lubi prototypować, rozkładać rzeczy na części i opowiadać o prawdziwym życiu na uczelni.", color: "bg-blush" },
  { name: "Amara", image: amara, field: "Sztuczna inteligencja", university: "Uniwersytet Warszawski", subject: "Matematyka", quote: "Bałam się pierwszej linijki kodu. Dziś tworzę własne projekty.", story: "Zanim poszłam na studia, byłam przekonana, że trzeba programować od dziecka. Nie trzeba. Zaczęłam od małych projektów i pytałam o wszystko, czego nie rozumiałam. Najbardziej pomogły mi rozmowy z dziewczynami, które były trochę dalej na tej samej drodze.", about: "Studentka AI, która chętnie rozmawia o nauce programowania od zera i przełamywaniu obaw.", color: "bg-secondary" },
  { name: "Lena", image: lena, field: "UX / design", university: "AGH", subject: "Plastyka / projektowanie", quote: "Nie wiedziałam, że kreatywność i technologia mogą iść razem.", story: "Lubiłam rysować i rozwiązywać problemy, ale nie wiedziałam, że mogę połączyć te dwie rzeczy. Projektowanie produktów cyfrowych dało mi taką możliwość. Moja droga nie była prosta i właśnie dlatego lubię o niej opowiadać.", about: "Studentka projektowania, która łączy kreatywność z technologią i lubi pokazywać różne drogi do branży.", color: "bg-accent" },
];

type Screen = "welcome" | "survey" | "home" | "story" | "chat";
type Tab = "home" | "stories" | "matches";
type ChatMessage = { text: string; from: "me" };

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-baseline whitespace-nowrap leading-none" aria-label="TechBestie"><span className={`${compact ? "text-[25px]" : "text-[38px]"} font-extrabold`}>Tech</span><span className={`${compact ? "text-[34px]" : "text-[52px]"} font-script font-bold text-primary`}>Bestie</span><Heart aria-hidden="true" className="ml-1 size-3.5 rotate-[-20deg] fill-coral text-coral" /></div>;
}

function Index() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [tab, setTab] = useState<Tab>("home");
  const [mentorIndex, setMentorIndex] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterField, setFilterField] = useState("Wszystkie kierunki");
  const [filterUniversity, setFilterUniversity] = useState("Wszystkie uczelnie");
  const [draftField, setDraftField] = useState(filterField);
  const [draftUniversity, setDraftUniversity] = useState(filterUniversity);
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [messageText, setMessageText] = useState("");

  const matches = useMemo(() => [...mentors].map((mentor, index) => {
    let score = 0;
    if (answers.fields.includes(mentor.field)) score += 2;
    if (answers.fields.includes("Informatyka") && mentor.name === "Amara") score += 2;
    if (answers.fields.includes("Analiza danych") && mentor.name === "Amara") score += 2;
    if (answers.subjects.includes(mentor.subject)) score += 1;
    if (answers.universities.includes(mentor.university)) score += 2;
    return { ...mentor, index, score };
  }).sort((a, b) => b.score - a.score), [answers]);

  const visibleMentors = matches.filter((mentor) =>
    (filterField === "Wszystkie kierunki" || mentor.field === filterField) &&
    (filterUniversity === "Wszystkie uczelnie" || mentor.university === filterUniversity)
  );
  const mentor = mentors[mentorIndex];
  const question = questions[step];
  const isFiltered = filterField !== "Wszystkie kierunki" || filterUniversity !== "Wszystkie uczelnie";

  const toggleChoice = (key: AnswerKey, value: string) => setAnswers((current) => ({
    ...current,
    [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
  }));
  const openStory = (index: number) => { setMentorIndex(index); setScreen("story"); window.scrollTo(0, 0); };
  const openChat = (index: number) => { setMentorIndex(index); setMessageText(""); setScreen("chat"); window.scrollTo(0, 0); };
  const goHome = (nextTab: Tab = "home") => { setTab(nextTab); setScreen("home"); window.scrollTo(0, 0); };
  const sendMessage = () => {
    const text = messageText.trim();
    if (!text) return;
    setMessages((current) => ({ ...current, [mentorIndex]: [...(current[mentorIndex] ?? []), { text, from: "me" }] }));
    setMessageText("");
  };

  return <div className="min-h-screen bg-stage text-foreground sm:px-5 sm:py-8">
    <main className="app-shell relative mx-auto flex min-h-dvh w-full max-w-[460px] flex-col overflow-hidden bg-background sm:min-h-[900px] sm:rounded-[36px]">
      {screen === "welcome" && <div className="intro-scene relative flex min-h-dvh flex-col overflow-hidden px-7 pt-14 sm:min-h-[900px]">
        <div className="intro-reveal relative z-10"><Brand /><p className="mt-2 text-sm font-medium text-ink-soft">Technologia jest też Twoim miejscem.</p></div>
        <div className="relative mt-10 flex min-h-[305px] flex-1 items-center justify-center"><div className="intro-halo absolute size-[280px] rounded-full bg-card/50" /><img src={girls} width={1024} height={1024} alt="Trzy uśmiechnięte dziewczyny zainteresowane technologią" className="intro-people relative z-10 w-full max-w-[370px] object-contain" /></div>
        <div className="intro-reveal relative z-10 pb-12"><span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-card/75 px-3 py-1.5 text-[11px] font-bold text-primary"><Sparkles className="size-3.5" /> JESTEŚ WE WŁAŚCIWYM MIEJSCU</span><h1 className="max-w-[340px] text-[34px] font-extrabold leading-[1.12]">Znajdź kogoś, kto <span className="font-script text-[42px] text-primary">był tam, gdzie Ty.</span></h1><p className="mt-4 max-w-[340px] text-[15px] leading-relaxed text-ink-soft">Poznaj studentki kierunków technologicznych, przeczytaj ich historie i zapytaj o to, co naprawdę Cię ciekawi.</p><Button variant="glow" className="mt-8 h-14 w-full rounded-2xl text-base font-bold" onClick={() => { setScreen("survey"); window.scrollTo(0, 0); }}>Dalej <ArrowRight /></Button><p className="mt-4 text-center text-xs text-muted-foreground">Kilka pytań i poznasz swoje TechBesties</p></div>
      </div>}

      {screen === "survey" && question && <div className="flex min-h-dvh flex-col px-6 pb-8 pt-8 sm:min-h-[900px]">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><Button variant="secondary" size="icon" className="size-10 rounded-full" aria-label="Wróć" onClick={() => { if (step === 0) setScreen("welcome"); else setStep(step - 1); }}><ArrowLeft /></Button><span className="text-xs font-bold text-muted-foreground">{step + 1} z {questions.length}</span></header>
        <div className="mt-8 flex gap-1.5" aria-hidden="true">{questions.map((item, index) => <span key={item.key} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-primary" : "bg-secondary"}`} />)}</div>
        <div className="mt-12"><span className="text-xs font-extrabold tracking-wider text-coral">{question.eyebrow}</span><h1 className="mt-3 text-[31px] font-extrabold leading-tight">{question.title}</h1><p className="mt-3 text-sm leading-relaxed text-ink-soft">{question.hint}</p><p className="mt-5 text-xs font-semibold text-muted-foreground">Możesz zaznaczyć więcej niż jedną odpowiedź</p></div>
        <div className="mt-5 grid gap-2.5">{question.choices.map((choice) => { const selected = answers[question.key].includes(choice); return <Button key={choice} variant="choice" aria-pressed={selected} className={`h-auto min-h-[58px] w-full rounded-2xl border px-4 py-3 text-left text-[14px] font-bold transition-all ${selected ? "border-primary bg-secondary text-primary" : "border-border/70 bg-card"}`} onClick={() => toggleChoice(question.key, choice)}><span className="min-w-0">{choice}</span><span className={`grid size-6 shrink-0 place-items-center rounded-full border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>{selected && <Check className="size-3.5" />}</span></Button>; })}</div>
        <div className="mt-auto pt-8"><Button variant="glow" className="h-14 w-full rounded-2xl text-[15px] font-bold" onClick={() => { if (step < questions.length - 1) setStep(step + 1); else goHome(); }}>{step === questions.length - 1 ? "Pokaż moje TechBesties" : "Dalej"}<ArrowRight /></Button><p className="mt-3 text-center text-xs text-muted-foreground">Nie musisz mieć wszystkich odpowiedzi już teraz.</p></div>
      </div>}

      {screen === "home" && <>
        <div className="bg-gradient-to-b from-blush/60 via-background to-background px-6 pb-1 pt-8 dark:from-secondary/50">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><div className="min-w-0"><Brand compact /><p className="mt-1 text-xs text-ink-soft">Małe kroki. Wielkie możliwości.</p></div><div className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/10 bg-secondary text-primary"><UserRound className="size-5" /></div></header>
          <section className="hero-panel relative mt-7 overflow-hidden rounded-[26px] px-5 pb-5 pt-5"><div className="relative z-10 max-w-[210px]"><span className="text-[11px] font-extrabold uppercase text-primary">CZEŚĆ! ✦</span><h1 className="mt-2 text-[22px] font-extrabold leading-tight">Twoja droga do tech zaczyna się tutaj.</h1><p className="mt-2 text-xs leading-relaxed text-ink-soft">Nie musisz iść nią sama.</p></div><img src={girls} width={1024} height={1024} alt="Dziewczyny w świecie technologii" className="absolute -bottom-8 -right-8 h-[155px] w-[155px] object-contain" /><div className="relative z-10 mt-6 inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5 text-[11px] font-semibold text-primary"><Heart className="size-3.5 fill-coral text-coral" /> Tu możesz pytać o wszystko</div></section>
        </div>
        <div className="flex-1 px-6 pb-28 pt-6">
          <div className="flex items-end justify-between gap-3"><div className="min-w-0"><div className="text-[10px] font-extrabold uppercase tracking-wider text-coral">WYBRANE DLA CIEBIE</div><h2 className="mt-1 text-[23px] font-extrabold leading-tight">Twoje TechBesties</h2></div><Button variant="secondary" size="icon" className="size-10 shrink-0 rounded-xl" aria-label="Filtruj studentki" onClick={() => { setDraftField(filterField); setDraftUniversity(filterUniversity); setFilterOpen(true); }}><SlidersHorizontal /></Button></div>
          {isFiltered && <p className="mt-2 text-xs text-primary">Aktywne filtry: {[filterField, filterUniversity].filter((item) => !item.startsWith("Wszystkie")).join(" · ")}</p>}
          <div className="mt-5 flex flex-col gap-3">{visibleMentors.length ? visibleMentors.map((person) => <article key={person.name} className="story-card rounded-[20px] border border-border/70 bg-card p-4"><div className="flex items-start gap-3"><div className="avatar-ring shrink-0 rounded-full p-[2px]"><img src={person.image} width={816} height={816} loading="lazy" alt={person.name} className="size-14 rounded-full border-2 border-card object-cover" /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h3 className="font-extrabold">{person.name}</h3>{person.score > 0 && <span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-primary">Pasuje do Ciebie ✦</span>}</div><p className="mt-0.5 text-[11px] text-muted-foreground">{person.field} · {person.university}</p></div></div><p className="mt-3 text-[13px] font-semibold leading-relaxed">„{person.quote}”</p><div className="mt-4 flex gap-2"><Button variant="secondary" className="h-9 flex-1 rounded-xl text-xs font-bold" onClick={() => openStory(person.index)}><BookOpen className="size-3.5" /> Historia</Button><Button variant="glow" className="h-9 flex-1 rounded-xl text-xs font-bold" onClick={() => openChat(person.index)}><MessageCircle className="size-3.5" /> Napisz</Button></div></article>) : <div className="rounded-2xl bg-secondary/60 px-5 py-7 text-center"><Search className="mx-auto mb-2 size-6 text-primary" /><p className="text-sm font-bold">Nie ma studentek dla tych filtrów.</p><p className="mt-1 text-xs text-ink-soft">Spróbuj wybrać inny kierunek lub uczelnię.</p><Button variant="plain" className="mt-3 text-xs font-bold" onClick={() => { setFilterField("Wszystkie kierunki"); setFilterUniversity("Wszystkie uczelnie"); }}>Wyczyść filtry</Button></div>}</div>
          <div className="mt-8 flex items-center justify-between"><div><div className="text-[10px] font-extrabold uppercase tracking-wider text-coral">PRAWDZIWE PERSPEKTYWY</div><h2 className="mt-1 text-[23px] font-extrabold">Historie studentek</h2></div><Heart className="size-5 text-coral" /></div>
          <div className="-mx-6 mt-4 flex snap-x gap-3 overflow-x-auto px-6 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{mentors.map((person, index) => <Button key={person.name} variant="choice" onClick={() => openStory(index)} className={`story-card h-auto w-[190px] shrink-0 snap-start flex-col items-start rounded-[20px] border border-border/70 ${person.color} p-4 text-left`}><img src={person.image} width={816} height={816} loading="lazy" alt="" className="size-12 rounded-full object-cover" /><span className="mt-3 text-sm font-extrabold">{person.name}</span><span className="mt-1 text-xs leading-relaxed text-ink-soft">„{person.quote}”</span><span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-primary">Czytaj historię <ArrowRight className="size-3" /></span></Button>)}</div>
          <Button variant="plain" className="mt-3 h-auto px-0 text-xs font-bold" onClick={() => { setStep(0); setScreen("survey"); window.scrollTo(0, 0); }}>Zmień odpowiedzi w ankiecie <ArrowRight className="size-3" /></Button>
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto grid h-[75px] w-full max-w-[460px] grid-cols-3 border-t border-border/70 bg-background/95 px-4 pb-2 backdrop-blur-md sm:absolute" aria-label="Nawigacja główna"><Button variant="nav" data-active={tab === "home"} className="h-full text-[10px] font-bold" onClick={() => { setTab("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Home className="size-5" />Główna</Button><Button variant="nav" data-active={tab === "stories"} className="h-full text-[10px] font-bold" onClick={() => { setTab("stories"); document.querySelector("h2:last-of-type")?.scrollIntoView({ behavior: "smooth" }); }}><BookOpen className="size-5" />Historie</Button><Button variant="nav" data-active={tab === "matches"} className="h-full text-[10px] font-bold" onClick={() => { setTab("matches"); window.scrollTo({ top: 320, behavior: "smooth" }); }}><Heart className="size-5" />Dopasowane</Button></nav>
      </>}

      {screen === "story" && mentor && <div className="flex min-h-dvh flex-col pb-8 sm:min-h-[900px]"><header className="flex items-center justify-between px-6 pt-8"><Button variant="secondary" size="icon" className="size-10 rounded-full" aria-label="Wróć do strony głównej" onClick={() => goHome()}><ArrowLeft /></Button><span className="text-xs font-bold text-primary">JEJ HISTORIA</span><div className="size-10" /></header><div className="px-6 pt-8"><div className="avatar-ring inline-block rounded-full p-[3px]"><img src={mentor.image} width={816} height={816} alt={mentor.name} className="size-24 rounded-full border-[3px] border-card object-cover" /></div><h1 className="mt-5 text-[30px] font-extrabold">Poznaj {mentor.name}</h1><p className="mt-1 text-sm text-ink-soft">{mentor.field} · {mentor.university}</p><div className="mt-7 rounded-[24px] bg-secondary/70 p-5"><Heart className="mb-3 size-5 fill-coral text-coral" /><p className="text-xl font-bold leading-snug">„{mentor.quote}”</p></div><h2 className="mt-8 text-lg font-extrabold">Moja historia</h2><p className="mt-3 text-[15px] leading-7 text-ink-soft">{mentor.story}</p><h2 className="mt-7 text-lg font-extrabold">O czym możemy porozmawiać?</h2><p className="mt-2 text-sm leading-relaxed text-ink-soft">{mentor.about}</p></div><div className="mt-auto px-6 pt-8"><Button variant="glow" className="h-14 w-full text-[15px] font-bold" onClick={() => openChat(mentorIndex)}><MessageCircle /> Napisz do {mentor.name} <ArrowRight /></Button></div></div>}

      {screen === "chat" && mentor && <div className="flex min-h-dvh flex-col sm:min-h-[900px]"><header className="flex items-center gap-3 border-b border-border px-5 py-5"><Button variant="secondary" size="icon" className="size-10 shrink-0 rounded-full" aria-label="Wróć do historii" onClick={() => setScreen("story")}><ArrowLeft /></Button><img src={mentor.image} width={816} height={816} alt="" className="size-11 rounded-full object-cover" /><div className="min-w-0"><h1 className="font-extrabold">{mentor.name}</h1><p className="truncate text-xs text-ink-soft">{mentor.field} · {mentor.university}</p></div></header><div className="flex-1 px-5 py-7"><div className="rounded-[20px] bg-secondary/70 p-4 text-center"><Sparkles className="mx-auto mb-2 size-5 text-primary" /><p className="text-sm font-bold">Rozmowa z {mentor.name}</p><p className="mt-1 text-xs leading-relaxed text-ink-soft">Możesz tutaj napisać wiadomość. To podgląd rozmowy — wiadomości nie są wysyłane.</p></div><div className="mt-6 space-y-3" aria-live="polite">{(messages[mentorIndex] ?? []).map((item, index) => <div key={index} className="ml-auto w-fit max-w-[85%] rounded-[18px] rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">{item.text}</div>)}</div></div><form className="sticky bottom-0 flex items-end gap-2 border-t border-border bg-background px-4 py-4" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}><label className="sr-only" htmlFor="message">Twoja wiadomość</label><textarea id="message" rows={1} maxLength={1000} value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Napisz wiadomość..." className="min-h-12 max-h-28 flex-1 resize-none rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /><Button variant="glow" size="icon" type="submit" disabled={!messageText.trim()} aria-label="Dodaj wiadomość do podglądu" className="size-12 shrink-0 rounded-2xl"><Send /></Button></form></div>}

      {filterOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/35 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setFilterOpen(false); }}><div role="dialog" aria-modal="true" aria-label="Filtry studentek" className="max-h-[90dvh] w-full max-w-[420px] overflow-y-auto rounded-t-[28px] bg-background px-6 pb-8 pt-6 sm:rounded-[28px]"><div className="flex items-center justify-between"><h2 className="text-xl font-extrabold">Filtruj studentki</h2><Button variant="ghost" size="icon" className="rounded-full" aria-label="Zamknij filtry" onClick={() => setFilterOpen(false)}><X /></Button></div><p className="mt-2 text-sm text-ink-soft">Znajdź osobę, z którą chcesz porozmawiać.</p><label htmlFor="filter-field" className="mt-7 block text-sm font-bold">Kierunek</label><select id="filter-field" value={draftField} onChange={(event) => setDraftField(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground"><option>Wszystkie kierunki</option>{[...new Set(mentors.map((item) => item.field))].map((item) => <option key={item}>{item}</option>)}</select><label htmlFor="filter-university" className="mt-5 block text-sm font-bold">Uczelnia</label><select id="filter-university" value={draftUniversity} onChange={(event) => setDraftUniversity(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground"><option>Wszystkie uczelnie</option>{[...new Set(mentors.map((item) => item.university))].map((item) => <option key={item}>{item}</option>)}</select><Button variant="glow" className="mt-8 h-12 w-full font-bold" onClick={() => { setFilterField(draftField); setFilterUniversity(draftUniversity); setFilterOpen(false); }}>Pokaż studentki <ChevronRight /></Button><Button variant="plain" className="mt-2 h-10 w-full text-xs font-bold" onClick={() => { setDraftField("Wszystkie kierunki"); setDraftUniversity("Wszystkie uczelnie"); setFilterField("Wszystkie kierunki"); setFilterUniversity("Wszystkie uczelnie"); setFilterOpen(false); }}>Wyczyść filtry</Button></div></div>}
    </main>
  </div>;
}