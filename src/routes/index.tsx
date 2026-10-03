import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Heart, Home, Sparkles, UserRound, X, Code2, CircuitBoard, PenTool, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import girls from "@/assets/techbestie-girls.png";
import amara from "@/assets/mentor-amara.jpg";
import maya from "@/assets/mentor-maya.jpg";
import lena from "@/assets/mentor-lena.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechBestie | Find your tech bestie" },
      { name: "description", content: "Meet women in tech who have been where you are. Explore their stories and find a TechBestie who gets you." },
      { property: "og:title", content: "TechBestie | Find your tech bestie" },
      { property: "og:description", content: "Meet women in tech who have been where you are. Explore their stories and find a TechBestie who gets you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const concerns = [
  { question: "Will I be able to do it?", answer: "You don't need to have it all figured out. Every TechBestie started somewhere, and they'll help you take that first step.", icon: Sparkles },
  { question: "Will I be the only girl?", answer: "Not a chance. There are so many girls building, designing and discovering in tech. Come meet your people.", icon: Heart },
  { question: "Is it really for me?", answer: "Tech has room for every kind of curious mind. Let's find the part that feels like you.", icon: Code2 },
];

const mentors = [
  { name: "Amara", school: "Computer Science · UCL", field: "AI & CODE", quote: "I was terrified. Now I'm thriving 💻", image: amara, icon: Code2, story: "I thought everyone else knew more than me when I started. Finding friends who were learning too changed everything. Now I get to build things I really care about." },
  { name: "Maya", school: "Engineering · Imperial", field: "ENGINEERING", quote: "Turns out, I belong here too. ✨", image: maya, icon: CircuitBoard, story: "I had never met a woman engineer before university. One conversation with a student mentor helped me picture myself there. I hope I can be that person for someone else." },
  { name: "Lena", school: "Product Design · Loughborough", field: "DESIGN", quote: "There isn't just one way into tech. 🎨", image: lena, icon: PenTool, story: "I loved drawing and solving problems, but didn't realise both could be my career. Design helped me bring those two sides together." },
];

const quiz = [
  { title: "What sounds most like you?", choices: ["Making things work", "Creating how things look", "Figuring out big ideas"] },
  { title: "What would you love help with?", choices: ["Getting started", "Feeling like I belong", "Choosing my path"] },
  { title: "How do you like to learn?", choices: ["By trying it out", "By hearing someone’s story", "By asking lots of questions"] },
];

function Index() {
  const [activeConcern, setActiveConcern] = useState<number | null>(null);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [showAllStories, setShowAllStories] = useState(false);
  const [quizStep, setQuizStep] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState("");
  const storiesRef = useRef<HTMLElement>(null);

  const startQuiz = () => { setSelectedStory(null); setAnswers([]); setQuizStep(0); };
  const pickAnswer = (answer: number) => {
    setAnswers((previous) => [...previous.slice(0, quizStep ?? 0), answer]);
    setQuizStep((previous) => previous === null ? 0 : previous + 1);
  };
  const recommendation = answers[0] === 1 ? 2 : answers[0] === 2 ? 0 : 1;
  const activeAnswer = activeConcern !== null ? concerns[activeConcern]?.answer : null;
  const story = selectedStory !== null ? mentors[selectedStory] : undefined;
  const currentQuestion = quizStep !== null ? quiz[quizStep] : undefined;
  const suggestedMentor = mentors[recommendation] ?? mentors[0];
  const closeOverlay = () => { setSelectedStory(null); setQuizStep(null); setShowProfile(false); };

  return (
    <div className="min-h-screen bg-stage px-0 text-foreground sm:px-5 sm:py-8">
      <main className="app-shell relative mx-auto min-h-screen w-full max-w-[460px] overflow-hidden bg-background pb-28 sm:min-h-[900px] sm:rounded-[36px]">
        <div className="relative overflow-hidden bg-gradient-to-b from-blush/60 via-background to-background px-6 pt-9 dark:from-secondary/50 md:px-8">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <div className="flex items-baseline whitespace-nowrap leading-none" aria-label="TechBestie">
                <span className="text-[28px] font-extrabold text-foreground">Tech</span><span className="font-script text-[38px] font-bold text-primary">Bestie</span><Heart aria-hidden="true" className="ml-0.5 size-3.5 rotate-[-20deg] fill-coral text-coral" />
              </div>
              <p className="mt-1 text-[13px] font-medium text-ink-soft">Find your tech bestie</p>
            </div>
            <Button variant="secondary" size="icon" className="mt-1 size-10 shrink-0 rounded-full border border-primary/10" aria-label="Open profile" onClick={() => setShowProfile(true)}><UserRound className="text-primary" /></Button>
          </header>

          <div className="mt-8 mb-5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-primary"><Sparkles className="size-3.5 text-coral" /> YOUR SPACE TO GROW</div>
              <h1 className="text-[25px] font-extrabold leading-tight">Hey {name.trim() || "you"}, <span className="font-script text-[29px] font-bold text-primary">ready to find your mentor?</span></h1>
            </div>
          </div>

          <section className="hero-panel relative overflow-hidden rounded-[28px] px-5 pb-5 pt-6" aria-labelledby="concern-heading">
            <div className="relative z-10">
              <div className="relative h-[136px]">
                <div className="relative z-10 max-w-[210px]">
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-card/70 px-2.5 py-1 text-[10px] font-extrabold uppercase text-primary"><Heart className="size-3 fill-coral text-coral" /> Real talk</span>
                  <h2 id="concern-heading" className="text-[26px] font-extrabold leading-[1.08]">What's holding<br />you back?</h2>
                  <p className="mt-2 text-xs font-medium text-ink-soft">Whatever it is, you're not alone.</p>
                </div>
                <img src={girls} width={1024} height={1024} alt="Three friends in tech smiling together" className="absolute -right-12 -top-7 h-[169px] w-[169px] object-contain" />
              </div>
              <div className="space-y-2">
                {concerns.map((concern, index) => {
                  const Icon = concern.icon;
                  return <Button key={concern.question} variant="choice" aria-expanded={activeConcern === index} onClick={() => setActiveConcern(activeConcern === index ? null : index)} className="group h-auto min-h-[55px] w-full px-3.5 py-2.5 text-left transition-all duration-200">
                    <span className="flex min-w-0 items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-4" /></span><span className="text-[13px] font-bold leading-snug">{concern.question}</span></span><ChevronRight className={`size-4 shrink-0 text-primary transition-transform ${activeConcern === index ? "rotate-90" : ""}`} />
                  </Button>;
                })}
              </div>
              {activeAnswer && <div className="mt-3 rounded-2xl bg-card/80 px-4 py-3 text-[13px] leading-relaxed text-foreground" role="status">{activeAnswer}</div>}
            </div>
          </section>
        </div>

        <section ref={storiesRef} className="pt-8" aria-labelledby="stories-heading">
          <div className="flex items-end justify-between gap-3 px-6 md:px-8">
            <div><div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-coral"><span className="size-1.5 rounded-full bg-coral" /> STORIES THAT INSPIRE</div><h2 id="stories-heading" className="text-[23px] font-extrabold leading-tight">Meet your TechBesties</h2></div>
            <Button variant="plain" className="h-auto shrink-0 gap-1 p-0 pb-0.5 text-[11px] font-bold" onClick={() => setShowAllStories(!showAllStories)}>{showAllStories ? "Show less" : "See all stories"}<ArrowRight className="size-3.5" /></Button>
          </div>
          <div className={`mt-5 flex gap-3 overflow-x-auto px-6 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-8 ${showAllStories ? "flex-wrap" : "snap-x snap-mandatory"}`}>
            {mentors.map((mentor, index) => {
              const Icon = mentor.icon;
              return <button key={mentor.name} type="button" onClick={() => setSelectedStory(index)} className={`story-card group flex shrink-0 flex-col items-start rounded-[23px] border border-border/70 bg-card p-4 text-left transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${showAllStories ? "w-full" : "w-[218px] snap-start"}`} aria-label={`Read ${mentor.name}'s story`}>
                <div className="flex w-full items-start justify-between"><div className="avatar-ring rounded-full p-[3px]"><img src={mentor.image} width={816} height={816} loading="lazy" alt={mentor.name} className="size-[66px] rounded-full border-[3px] border-card object-cover" /></div><span className="grid size-7 place-items-center rounded-full bg-secondary text-primary"><Icon className="size-3.5" /></span></div>
                <div className="mt-3 text-base font-extrabold">{mentor.name}</div><div className="mt-0.5 text-[11px] font-medium text-muted-foreground">{mentor.school}</div>
                <p className="mt-3 min-h-[42px] text-[13px] font-bold leading-snug">“{mentor.quote}”</p>
                <span className="mt-3 rounded-full bg-accent px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-primary">{mentor.field}</span>
              </button>;
            })}
          </div>
          <div className="flex justify-center gap-1.5" aria-hidden="true"><span className="h-1.5 w-5 rounded-full bg-primary" /><span className="size-1.5 rounded-full bg-lilac" /><span className="size-1.5 rounded-full bg-lilac" /></div>
        </section>

        <section className="px-6 pt-8 md:px-8" aria-label="Find a mentor">
          <div className="rounded-[24px] bg-secondary/70 px-5 py-6 text-center">
            <div className="font-script text-[25px] font-bold text-primary">Your people are here ♡</div>
            <Button variant="glow" className="mt-3 h-14 w-full text-[15px] font-extrabold" onClick={startQuiz}>Find Your TechBestie <ArrowRight className="ml-1 size-5" /></Button>
            <p className="mt-2.5 text-xs font-medium text-ink-soft">Answer 3 quick questions</p>
          </div>
        </section>

        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto grid h-[77px] w-full max-w-[460px] grid-cols-4 border-t border-border/70 bg-background/95 px-3 pb-2 backdrop-blur-md sm:absolute" aria-label="Main navigation">
          <Button variant="nav" data-active="true" className="h-full text-[10px] font-bold" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Home className="size-5 fill-current" />Home</Button>
          <Button variant="nav" className="h-full text-[10px] font-bold" onClick={() => storiesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}><Heart className="size-5" />Stories</Button>
          <Button variant="nav" className="h-full text-[10px] font-bold" onClick={startQuiz}><Sparkles className="size-5" />Match</Button>
          <Button variant="nav" className="h-full text-[10px] font-bold" onClick={() => setShowProfile(true)}><UserRound className="size-5" />Profile</Button>
        </nav>
      </main>

      {(selectedStory !== null || quizStep !== null || showProfile) && <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/35 p-0 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeOverlay(); }}>
        <div role="dialog" aria-modal="true" aria-label={story ? `${story.name}'s story` : quizStep !== null ? "Find your TechBestie" : "Your profile"} className="w-full max-w-[420px] rounded-t-[28px] bg-background px-6 pb-9 pt-5 shadow-2xl sm:rounded-[28px]">
          <div className="mb-5 flex items-center justify-between"><span className="text-[11px] font-extrabold uppercase text-primary">TECH<span className="font-script text-lg normal-case">Bestie</span></span><Button variant="ghost" size="icon" aria-label="Close" className="rounded-full" onClick={closeOverlay}><X /></Button></div>
          {story && <div><div className="avatar-ring inline-block rounded-full p-[3px]"><img src={story.image} width={816} height={816} alt={story.name} className="size-20 rounded-full border-[3px] border-card object-cover" /></div><h2 className="mt-3 text-2xl font-extrabold">Meet {story.name}</h2><p className="mt-1 text-sm text-muted-foreground">{story.school}</p><p className="mt-5 text-lg font-bold leading-snug">“{story.quote}”</p><p className="mt-4 text-sm leading-relaxed text-ink-soft">{story.story}</p><Button variant="glow" className="mt-7 h-12 w-full font-bold" onClick={startQuiz}>Find someone like {story.name}<ArrowRight /></Button></div>}
          {quizStep !== null && currentQuestion && <div><div className="mb-4 flex items-center justify-between"><span className="text-xs font-bold text-primary">QUESTION {quizStep + 1} OF 3</span><div className="flex gap-1">{quiz.map((_, index) => <span key={index} className={`h-1.5 w-6 rounded-full ${index <= quizStep ? "bg-primary" : "bg-secondary"}`} />)}</div></div><h2 className="mb-6 text-[26px] font-extrabold leading-tight">{currentQuestion.title}</h2><div className="space-y-3">{currentQuestion.choices.map((choice, index) => <Button key={choice} variant="choice" className="h-14 w-full px-4 text-left text-sm font-bold" onClick={() => pickAnswer(index)}>{choice}<ArrowRight className="size-4 text-primary" /></Button>)}</div>{quizStep > 0 && <Button variant="plain" className="mt-6 p-0 text-xs" onClick={() => setQuizStep(quizStep - 1)}><ArrowLeft className="size-4" /> Back</Button>}</div>}
          {quizStep !== null && quizStep >= quiz.length && suggestedMentor && <div><div className="mb-3 grid size-12 place-items-center rounded-full bg-secondary text-primary"><Check /></div><h2 className="text-[26px] font-extrabold">Meet your TechBestie</h2><p className="mt-2 text-sm leading-relaxed text-ink-soft">Based on your answers, you might connect with {suggestedMentor.name}.</p><div className="mt-6 flex items-center gap-4 rounded-2xl bg-secondary p-4"><img src={suggestedMentor.image} width={816} height={816} alt={suggestedMentor.name} className="size-16 rounded-full object-cover" /><div><div className="font-extrabold">{suggestedMentor.name}</div><div className="text-xs text-muted-foreground">{suggestedMentor.school}</div></div></div><Button variant="glow" className="mt-6 h-12 w-full font-bold" onClick={() => { setQuizStep(null); setSelectedStory(recommendation); }}>Read her story <ArrowRight /></Button><p className="mt-3 text-center text-xs text-muted-foreground">A real introduction isn't available yet.</p></div>}
          {showProfile && <div><div className="mb-4 grid size-14 place-items-center rounded-full bg-secondary text-primary"><UserRound className="size-7" /></div><h2 className="text-2xl font-extrabold">Make it yours</h2><p className="mt-2 text-sm text-ink-soft">What should we call you?</p><label htmlFor="name" className="mt-5 block text-xs font-bold">Your first name</label><input id="name" type="text" maxLength={24} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring" /><Button variant="glow" className="mt-5 h-12 w-full font-bold" onClick={() => setShowProfile(false)}>Save name <Check /></Button></div>}
        </div>
      </div>}
    </div>
  );
}