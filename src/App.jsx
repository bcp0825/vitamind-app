import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Apple, Brain, CreditCard, Dumbbell, Home, MessageCircle, Moon, Send, ShieldCheck, Smile, Sparkles, TrendingUp, Users, Waves, CalendarDays, BarChart3 } from "lucide-react";

const NAVY = "#071E4A";


function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-white/95 shadow-sm border border-blue-100 ${className}`}>{children}</div>;
}

function Button({ children, onClick, variant = "primary", className = "" }) {
  const styles = variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100";
  return <button onClick={onClick} className={`rounded-2xl px-4 py-3 font-semibold transition ${styles} ${className}`}>{children}</button>;
}

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200">
        <div className="relative text-white font-black text-3xl leading-none">V</div>
      </div>
      {!compact && (
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: NAVY }}>Vitamind</h1>
          <p className="text-sm text-slate-500">Mental and physical wellness connected.</p>
        </div>
      )}
    </div>
  );
}

const workouts = {
  recovery: {
    title: "Recovery Reset",
    time: "18 min",
    items: ["10-min walk", "5-min stretch", "3-min breathing"],
    note: "Low-pressure movement for stressful, anxious, or low-energy days."
  },
  balanced: {
    title: "Balanced Body",
    time: "32 min",
    items: ["Bodyweight squats", "Push-ups", "Dumbbell rows", "Incline walk"],
    note: "A steady workout that builds consistency without overwhelming you."
  },
  push: {
    title: "Strong Day Push",
    time: "45 min",
    items: ["Full-body strength", "Intervals", "Core finisher", "Cooldown"],
    note: "For high-energy days when you are ready to challenge yourself."
  }
};

const meals = [
  { title: "Stress-Support Plate", desc: "Salmon, greens, sweet potato, almonds, and water.", tag: "Anxiety" },
  { title: "Mood Energy Bowl", desc: "Eggs or Greek yogurt, oats, berries, and nuts.", tag: "Depression" },
  { title: "Focus Fuel Meal", desc: "Lean protein, rice, vegetables, and hydration reminder.", tag: "ADHD" }
];

function buildNutritionPlan({ depression, anxiety, stress, motivation, energy, sleep }) {
  if (anxiety >= 7 || stress >= 7) {
    return {
      title: "Calm & Recovery Nutrition Plan",
      focus: "Lower stress, support calm, and stabilize energy.",
      meals: [
        "Breakfast: Greek yogurt, berries, oats, and water",
        "Lunch: Salmon or chicken, sweet potato, and greens",
        "Snack: Almonds, banana, or dark chocolate square",
        "Dinner: Turkey, rice, vegetables, and herbal tea"
      ],
      avoid: "Limit excess caffeine, skipped meals, and high-sugar snacks today.",
      hydration: "Aim for steady water intake throughout the day."
    };
  }

  if (depression >= 7 || motivation <= 4) {
    return {
      title: "Mood-Lift Nutrition Plan",
      focus: "Support mood, energy, and motivation with simple meals.",
      meals: [
        "Breakfast: Eggs, toast, fruit, and water",
        "Lunch: Chicken bowl with rice, beans, and vegetables",
        "Snack: Protein smoothie or peanut butter with apple",
        "Dinner: Lean protein, potatoes, and colorful vegetables"
      ],
      avoid: "Avoid skipping meals. Keep food simple and realistic today.",
      hydration: "Add one extra glass of water with each meal."
    };
  }

  if (energy <= 4 || sleep <= 5) {
    return {
      title: "Low-Energy Recovery Meal Plan",
      focus: "Refuel the body without overloading it.",
      meals: [
        "Breakfast: Oatmeal, banana, and protein",
        "Lunch: Turkey wrap, fruit, and water",
        "Snack: Greek yogurt or boiled eggs",
        "Dinner: Chicken soup, rice, and vegetables"
      ],
      avoid: "Avoid heavy late meals and too much caffeine late in the day.",
      hydration: "Focus on hydration early in the day."
    };
  }

  if (motivation >= 8 && energy >= 8) {
    return {
      title: "Performance Fuel Nutrition Plan",
      focus: "Fuel strength, movement, and consistency.",
      meals: [
        "Breakfast: Eggs, oats, berries, and water",
        "Lunch: Lean protein, rice, vegetables, and avocado",
        "Snack: Protein shake or cottage cheese with fruit",
        "Dinner: Steak or chicken, potatoes, greens, and water"
      ],
      avoid: "Avoid under-eating on high-output days.",
      hydration: "Add electrolytes if sweating heavily."
    };
  }

  return {
    title: "Balanced Wellness Nutrition Plan",
    focus: "Maintain stable mood, energy, and wellness habits.",
    meals: [
      "Breakfast: Protein, fruit, and whole-grain carbs",
      "Lunch: Lean protein, vegetables, and healthy carbs",
      "Snack: Nuts, yogurt, or fruit",
      "Dinner: Balanced plate with protein, greens, and water"
    ],
    avoid: "Avoid all-or-nothing eating. Keep meals consistent.",
    hydration: "Aim for regular water intake through the day."
  };
}

function App() {
  const [screen, setScreen] = useState("checkin");
  const [depression, setDepression] = useState(4);
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [motivation, setMotivation] = useState(6);
  const [energy, setEnergy] = useState(6);
  const [sleep, setSleep] = useState(7);
  const [subscribed, setSubscribed] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "coach", text: "Welcome to Vitamind. Complete your check-in, then I’ll help guide your mind-body plan." }
  ]);
  const [posts, setPosts] = useState([
    { name: "Maya", topic: "Mental Health", text: "What helps you reset when anxiety is high?", replies: 18, time: "20m ago" },
    { name: "Jordan", topic: "Fitness", text: "Today I chose a 15-minute walk instead of skipping movement completely.", replies: 9, time: "1h ago" },
    { name: "Chris", topic: "Nutrition", text: "Share your favorite mood-supporting meal ideas.", replies: 14, time: "2h ago" }
  ]);
  const [history, setHistory] = useState([
    { date: "Mon", depression: 5, anxiety: 6, stress: 7, motivation: 4, energy: 5, sleep: 6 },
    { date: "Tue", depression: 4, anxiety: 5, stress: 6, motivation: 5, energy: 6, sleep: 7 },
    { date: "Wed", depression: 6, anxiety: 7, stress: 7, motivation: 4, energy: 4, sleep: 5 },
    { date: "Thu", depression: 4, anxiety: 4, stress: 5, motivation: 6, energy: 7, sleep: 7 },
    { date: "Fri", depression: 3, anxiety: 4, stress: 4, motivation: 7, energy: 7, sleep: 8 }
  ]);

  const mode = useMemo(() => {
    if (stress >= 7 || anxiety >= 7 || depression >= 7 || energy <= 4 || sleep <= 5) return "recovery";
    if (motivation >= 8 && energy >= 8 && stress <= 4) return "push";
    return "balanced";
  }, [depression, anxiety, stress, motivation, energy, sleep]);

  const plan = workouts[mode];
  const nutritionPlan = useMemo(() => buildNutritionPlan({ depression, anxiety, stress, motivation, energy, sleep }), [depression, anxiety, stress, motivation, energy, sleep]);

  function saveCheckin() {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const entry = { date: today, depression, anxiety, stress, motivation, energy, sleep };
    setHistory(prev => [entry, ...prev.filter(item => item.date !== today)]);
    setScreen("home");
  }

  function send() {
    if (!input.trim()) return;
    const text = input.trim();
    const lower = text.toLowerCase();
    let reply = "Let’s keep it simple today: move your body, hydrate, eat protein, and take one mental reset break.";
    if (lower.includes("stress") || lower.includes("anxious") || lower.includes("overwhelmed")) reply = "Stress sounds high. Try the Recovery Reset: a 10-minute walk, 3 minutes of breathing, and one balanced meal. Small wins count.";
    if (lower.includes("tired") || lower.includes("sleep")) reply = "Low energy means recovery matters. Aim for light movement, water, and a protein-focused meal. No need to overdo it.";
    if (lower.includes("weight") || lower.includes("lose")) reply = "For weight loss today, focus on protein, walking, hydration, and consistency instead of perfection.";
    setMessages(prev => [...prev, { role: "user", text }, { role: "coach", text: reply }]);
    setInput("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-sky-100 text-slate-900">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <Logo />
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white border border-blue-100 px-4 py-2 shadow-sm text-sm text-slate-600">
            <Sparkles size={16} className="text-blue-600" /> AI wellness prototype
          </div>
        </header>

        <div className="grid md:grid-cols-4 gap-5">
          <nav className="bg-white rounded-3xl border border-blue-100 p-3 shadow-sm h-fit md:col-span-1">
            {[
              ["website", Sparkles, "Website"],
              ["home", Home, "Dashboard"],
              ["checkin", Smile, "Check-In"],
              ["progress", BarChart3, "Progress"],
              ["fitness", Dumbbell, "Fitness"],
              ["nutrition", Apple, "Nutrition"],
              ["coach", MessageCircle, "AI Coach"],
              ["community", Users, "Community"],
              ["pricing", CreditCard, "Subscription"],
            ].map(([key, Icon, label]) => (
              <button key={key} onClick={() => setScreen(key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 font-semibold transition ${screen === key ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-100" : "text-slate-600 hover:bg-blue-50"}`}>
                <Icon size={19} /> {label}
              </button>
            ))}
          </nav>

          <main className="md:col-span-3">
            {screen === "website" && <Website setScreen={setScreen} />}
            {screen === "home" && <HomeScreen depression={depression} anxiety={anxiety} stress={stress} motivation={motivation} sleep={sleep} plan={plan} nutritionPlan={nutritionPlan} setScreen={setScreen} />}
            {screen === "checkin" && <Checkin depression={depression} setDepression={setDepression} anxiety={anxiety} setAnxiety={setAnxiety} stress={stress} setStress={setStress} motivation={motivation} setMotivation={setMotivation} energy={energy} setEnergy={setEnergy} sleep={sleep} setSleep={setSleep} saveCheckin={saveCheckin} />}
            {screen === "progress" && <Progress history={history} />}
            {screen === "fitness" && <Fitness plan={plan} mode={mode} depression={depression} anxiety={anxiety} stress={stress} motivation={motivation} energy={energy} sleep={sleep} />}
            {screen === "nutrition" && <Nutrition nutritionPlan={nutritionPlan} depression={depression} anxiety={anxiety} stress={stress} motivation={motivation} energy={energy} sleep={sleep} />}
            {screen === "coach" && <Coach messages={messages} input={input} setInput={setInput} send={send} />}
            {screen === "community" && <Community posts={posts} setPosts={setPosts} />}
            {screen === "pricing" && <Pricing subscribed={subscribed} setSubscribed={setSubscribed} />}
          </main>
        </div>
      </div>
    </div>
  );
}

function Website({ setScreen }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="p-8 md:p-12 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100 overflow-hidden relative">
        <div className="max-w-2xl relative z-10">
          <p className="font-bold text-blue-100 mb-3">Vitamind Wellness Platform</p>
          <h2 className="text-4xl md:text-6xl font-black mb-5 leading-tight">Mental and physical wellness connected.</h2>
          <p className="text-lg text-blue-50 mb-8">Start with a mental health check-in, get a personalized workout and nutrition plan, then talk with your AI wellness coach.</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setScreen("checkin")} variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">Start Check-In</Button>
            <Button onClick={() => setScreen("pricing")} variant="secondary" className="bg-blue-900/30 text-white hover:bg-blue-900/40">View Subscription</Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4"><Brain className="text-blue-600" /></div>
          <h3 className="text-xl font-black mb-2">Mental Health Check-In</h3>
          <p className="text-slate-600">Track anxiety, depression, ADHD symptoms, trauma stress, sleep, and motivation.</p>
        </Card>
        <Card className="p-6">
          <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4"><Dumbbell className="text-sky-600" /></div>
          <h3 className="text-xl font-black mb-2">Workout + Meal Plan</h3>
          <p className="text-slate-600">Receive movement and food suggestions based on how you feel that day.</p>
        </Card>
        <Card className="p-6">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center mb-4"><MessageCircle className="text-teal-600" /></div>
          <h3 className="text-xl font-black mb-2">AI Coach + Community</h3>
          <p className="text-slate-600">Ask for support and connect with others around mental health, fitness, and wellness.</p>
        </Card>
      </div>

      <Card className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-3xl font-black mb-3">Built for daily wellness support</h3>
            <p className="text-slate-600 mb-5">Vitamind helps users connect their emotional state to real-world action: movement, food, coaching, and community encouragement.</p>
            <Button onClick={() => setScreen("community")}>Explore Community</Button>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-sky-100 p-5 border border-blue-100">
            <div className="rounded-2xl bg-white p-4 shadow-sm mb-3"><p className="font-black">Today’s Check-In</p><p className="text-sm text-slate-500">Anxiety 7/10 • Sleep 5 hrs</p></div>
            <div className="rounded-2xl bg-white p-4 shadow-sm mb-3"><p className="font-black text-blue-700">Suggested Plan</p><p className="text-sm text-slate-500">10-minute walk + stress-support meal</p></div>
            <div className="rounded-2xl bg-blue-600 text-white p-4 shadow-sm"><p className="font-black">AI Coach</p><p className="text-sm text-blue-50">Let’s focus on one small win today.</p></div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function HomeScreen({ depression, anxiety, stress, motivation, sleep, plan, nutritionPlan, setScreen }) {
  const suggestedMeal = nutritionPlan.focus;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-semibold mb-2">Today’s Vitamind Plan</p>
        <h2 className="text-3xl md:text-5xl font-black mb-3">{plan.title}</h2>
        <p className="max-w-2xl text-blue-50">Based on your mental health check-in, today’s focus is: {plan.note}</p>
        <Button onClick={() => setScreen("checkin")} variant="secondary" className="mt-5 bg-white text-blue-700 hover:bg-blue-50">Update Check-In</Button>
      </Card>

      <div className="grid md:grid-cols-5 gap-4">
        <Metric icon={Brain} label="Depression" value={`${depression}/10`} color="text-indigo-600" bg="bg-indigo-50" />
        <Metric icon={Waves} label="Anxiety" value={`${anxiety}/10`} color="text-sky-600" bg="bg-sky-50" />
        <Metric icon={Activity} label="Stress" value={`${stress}/10`} color="text-purple-600" bg="bg-purple-50" />
        <Metric icon={TrendingUp} label="Motivation" value={`${motivation}/10`} color="text-teal-600" bg="bg-teal-50" />
        <Metric icon={Moon} label="Sleep" value={`${sleep} hrs`} color="text-blue-600" bg="bg-blue-50" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Action title="Suggested Workout" icon={Dumbbell} text={`${plan.time}: ${plan.items[0]}`} onClick={() => setScreen("fitness")} />
        <Action title="Mood Nutrition" icon={Apple} text={suggestedMeal} onClick={() => setScreen("nutrition")} />
        <Action title="Talk to AI Coach" icon={MessageCircle} text="Ask for support based on your mood and stress." onClick={() => setScreen("coach")} />
      </div>
    </motion.div>
  );
}

function Metric({ icon: Icon, label, value, color = "text-blue-600", bg = "bg-blue-50" }) {
  return <Card className="p-5 hover:-translate-y-1 transition"><div className={`h-11 w-11 rounded-2xl ${bg} flex items-center justify-center mb-3`}><Icon className={color} /></div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-black text-slate-900">{value}</p></Card>;
}

function Action({ title, icon: Icon, text, onClick }) {
  return <Card className="p-5 hover:shadow-md transition cursor-pointer" onClick={onClick}><div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center mb-4"><Icon className="text-blue-600" /></div><h3 className="text-xl font-black mb-1">{title}</h3><p className="text-slate-500">{text}</p></Card>;
}

function Checkin({ depression, setDepression, anxiety, setAnxiety, stress, setStress, motivation, setMotivation, energy, setEnergy, sleep, setSleep, saveCheckin }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6">
        <h2 className="text-3xl font-black mb-2">Mental Health Check-In</h2>
        <p className="text-slate-500 mb-6">Vitamind creates a personalized wellness plan based on your emotional and physical health.</p>

        <CheckCard title="Anxiety Symptoms" text="Track excessive worry, tension, panic, restlessness, and feeling overwhelmed.">
          <Slider label="Anxiety" value={anxiety} setValue={setAnxiety} />
        </CheckCard>

        <CheckCard title="Depressive Symptoms" text="Track sadness, fatigue, lack of motivation, sleep changes, and emotional heaviness.">
          <Slider label="Depression" value={depression} setValue={setDepression} />
          <Slider label="Motivation" value={motivation} setValue={setMotivation} />
        </CheckCard>

        <CheckCard title="ADHD Symptoms" text="Track inattention, impulsivity, hyperactivity, focus issues, disorganization, restlessness, and difficulty completing tasks.">
          <Slider label="Inattention" value={energy} setValue={setEnergy} />
          <Slider label="Impulsivity" value={motivation} setValue={setMotivation} />
          <Slider label="Hyperactivity" value={energy} setValue={setEnergy} />
        </CheckCard>

        <CheckCard title="PTSD & Trauma Stress" text="Track flashbacks, emotional triggers, hypervigilance, nightmares, intrusive thoughts, and emotional overwhelm.">
          <Slider label="Trauma Stress" value={stress} setValue={setStress} />
        </CheckCard>

        <CheckCard title="Sleep & Recovery" text="Sleep quality strongly affects mood, anxiety, energy, and emotional resilience.">
          <Slider label="Sleep hours" value={sleep} setValue={setSleep} min={3} max={10} suffix=" hrs" />
        </CheckCard>

        <Button onClick={saveCheckin} className="w-full mt-2">Save Check-In & Generate My Wellness Plan</Button>
      </Card>
    </motion.div>
  );
}

function CheckCard({ title, text, children }) {
  return <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-100 p-5 mb-6"><h3 className="font-black text-lg text-slate-900 mb-2">{title}</h3><p className="text-sm text-slate-600 mb-3">{text}</p>{children}</div>;
}

function Slider({ label, value, setValue, min = 1, max = 10, suffix = "/10" }) {
  return <div className="mb-6"><div className="flex justify-between mb-2"><span className="font-bold">{label}</span><span className="font-black text-blue-700">{value}{suffix}</span></div><input className="w-full accent-blue-600" type="range" min={min} max={max} value={value} onChange={e => setValue(Number(e.target.value))} /></div>;
}

function Progress({ history }) {
  const latest = history[0];
  const weekly = history.slice(0, 7);
  const average = key => Math.round(weekly.reduce((sum, item) => sum + item[key], 0) / weekly.length);

  const rows = [
    ["Depression", "depression", "text-indigo-600"],
    ["Anxiety", "anxiety", "text-sky-600"],
    ["Stress", "stress", "text-purple-600"],
    ["Motivation", "motivation", "text-teal-600"],
    ["Energy", "energy", "text-blue-600"],
    ["Sleep", "sleep", "text-slate-700"]
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-semibold mb-2">Weekly Wellness Tracking</p>
        <h2 className="text-4xl font-black mb-3">Your Check-In History</h2>
        <p className="text-blue-50 max-w-2xl">Review daily ratings, compare weekly patterns, and look back at past mental and physical wellness scores.</p>
      </Card>

      {latest && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-5">
            <CalendarDays className="text-blue-600 mb-3" />
            <p className="text-sm text-slate-500">Latest Check-In</p>
            <p className="text-2xl font-black">{latest.date}</p>
          </Card>
          <Card className="p-5">
            <Brain className="text-sky-600 mb-3" />
            <p className="text-sm text-slate-500">Weekly Anxiety Avg</p>
            <p className="text-2xl font-black">{average("anxiety")}/10</p>
          </Card>
          <Card className="p-5">
            <Moon className="text-indigo-600 mb-3" />
            <p className="text-sm text-slate-500">Weekly Sleep Avg</p>
            <p className="text-2xl font-black">{average("sleep")} hrs</p>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">7-Day Rating Overview</h3>
        <div className="space-y-5">
          {rows.map(([label, key, color]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <span className="font-bold">{label}</span>
                <span className={`font-black ${color}`}>{average(key)}{key === "sleep" ? " hrs" : "/10"}</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekly.map((item, i) => (
                  <div key={`${key}-${i}`} className="rounded-xl bg-blue-50 p-2 text-center border border-blue-100">
                    <div className="text-xs text-slate-500 mb-1">{item.date.split(" ")[0]}</div>
                    <div className={`text-lg font-black ${color}`}>{item[key]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">Past Check-Ins</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-100 text-slate-500 text-sm">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Depression</th>
                <th className="py-3 pr-4">Anxiety</th>
                <th className="py-3 pr-4">Stress</th>
                <th className="py-3 pr-4">Motivation</th>
                <th className="py-3 pr-4">Energy</th>
                <th className="py-3 pr-4">Sleep</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={`${item.date}-${i}`} className="border-b border-blue-50">
                  <td className="py-3 pr-4 font-bold">{item.date}</td>
                  <td className="py-3 pr-4">{item.depression}/10</td>
                  <td className="py-3 pr-4">{item.anxiety}/10</td>
                  <td className="py-3 pr-4">{item.stress}/10</td>
                  <td className="py-3 pr-4">{item.motivation}/10</td>
                  <td className="py-3 pr-4">{item.energy}/10</td>
                  <td className="py-3 pr-4">{item.sleep} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

function Fitness({ plan, mode, depression, anxiety, stress, motivation, energy, sleep }) {
  const reason = mode === "recovery"
    ? "Your check-in showed higher stress, anxiety, depression, lower energy, or lower sleep. Vitamind adjusted your workout to recovery mode."
    : mode === "push"
    ? "Your check-in showed strong motivation, high energy, and lower stress. Vitamind adjusted your workout to a stronger training day."
    : "Your check-in showed a balanced range, so Vitamind created a steady workout focused on consistency.";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-bold uppercase text-sm">{mode} mode</p>
        <h2 className="text-4xl font-black mb-2">{plan.title}</h2>
        <p className="text-blue-50 mb-5">{plan.note}</p>
        <p className="text-sm bg-white/20 rounded-2xl p-4">{reason}</p>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Metric icon={Activity} label="Stress" value={`${stress}/10`} color="text-purple-600" bg="bg-purple-50" />
        <Metric icon={TrendingUp} label="Energy" value={`${energy}/10`} color="text-blue-600" bg="bg-blue-50" />
        <Metric icon={Moon} label="Sleep" value={`${sleep} hrs`} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">Today's Workout Steps</h3>
        <div className="space-y-3">
          {plan.items.map((item, i) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">{i + 1}</div>
              <span className="font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

function Nutrition({ nutritionPlan, depression, anxiety, stress, motivation, energy, sleep }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-semibold mb-2">Nutrition Based on Your Check-In</p>
        <h2 className="text-4xl font-black mb-3">{nutritionPlan.title}</h2>
        <p className="text-blue-50 max-w-2xl">{nutritionPlan.focus}</p>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Metric icon={Brain} label="Anxiety" value={`${anxiety}/10`} color="text-sky-600" bg="bg-sky-50" />
        <Metric icon={Activity} label="Stress" value={`${stress}/10`} color="text-purple-600" bg="bg-purple-50" />
        <Metric icon={TrendingUp} label="Energy" value={`${energy}/10`} color="text-teal-600" bg="bg-teal-50" />
      </div>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">Today's Meal Suggestions</h3>
        <div className="grid gap-3">
          {nutritionPlan.meals.map((meal, i) => (
            <div key={meal} className="rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 p-4 border border-blue-100 flex gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0">{i + 1}</div>
              <p className="font-semibold text-slate-700">{meal}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-xl font-black mb-2">Avoid Today</h3>
          <p className="text-slate-600">{nutritionPlan.avoid}</p>
        </Card>
        <Card className="p-5">
          <h3 className="text-xl font-black mb-2">Hydration Goal</h3>
          <p className="text-slate-600">{nutritionPlan.hydration}</p>
        </Card>
      </div>
    </motion.div>
  );
}

function Coach({ messages, input, setInput, send }) {
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Card className="p-4 md:p-6"><h2 className="text-3xl font-black mb-1">AI Wellness Coach</h2><p className="text-slate-500 mb-5">Ask for motivation, stress support, fitness ideas, or nutrition help.</p><div className="h-[420px] overflow-y-auto rounded-2xl bg-slate-50 p-4 space-y-3 mb-4">{messages.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-blue-100 text-slate-700"}`}>{m.text}</div></div>)}</div><div className="flex gap-2"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Try: I feel stressed today..." className="flex-1 rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" /><Button onClick={send} className="px-4"><Send size={18} /></Button></div></Card></motion.div>;
}

function Pricing({ subscribed, setSubscribed }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-semibold mb-2">Vitamind Premium</p>
        <h2 className="text-4xl font-black mb-3">Unlock your full wellness transformation</h2>
        <p className="text-blue-50 max-w-2xl">Daily mental health check-ins, adaptive workouts, mood-based nutrition, AI coaching, and a supportive wellness community.</p>
      </Card>

      <div className="max-w-2xl mx-auto">
        <Card className="p-8 border-2 border-blue-500 shadow-lg relative overflow-hidden">
          <span className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-black px-4 py-2 mb-4">7 Day Free Trial</span>
          <h3 className="text-4xl font-black mb-2">Vitamind Premium</h3>
          <p className="text-slate-500 mb-6 text-lg">Personalized mind-body wellness coaching designed to improve mental and physical health.</p>
          <div className="flex items-end gap-2 mb-6"><span className="text-6xl font-black">$19.99</span><span className="text-slate-500 font-semibold mb-2">/month</span></div>
          <p className="text-blue-700 font-semibold mb-6">Start free for 7 days. Cancel anytime.</p>
          <ul className="space-y-3 text-slate-700 mb-8 text-lg"><li>✓ Full mental health assessments</li><li>✓ Personalized mood-based workouts</li><li>✓ Mood-supportive nutrition plans</li><li>✓ AI wellness coach</li><li>✓ Wellness community access</li><li>✓ Progress tracking and insights</li></ul>
          <Button onClick={() => setSubscribed(true)} className="w-full text-lg py-4">Start Free Trial</Button>
          {subscribed && <p className="mt-4 text-center text-sm font-bold text-blue-700">Free trial active in prototype.</p>}
        </Card>
      </div>
    </motion.div>
  );
}

function Community({ posts, setPosts }) {
  const [postText, setPostText] = useState("");
  const [topic, setTopic] = useState("Mental Health");

  function addPost() {
    if (!postText.trim()) return;
    setPosts(prev => [{ name: "You", topic, text: postText.trim(), replies: 0, time: "Just now" }, ...prev]);
    setPostText("");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur rounded-3xl border border-blue-100 shadow-sm p-4 flex items-center justify-between">
        <Logo compact />
        <div className="hidden md:flex items-center gap-3 bg-slate-50 rounded-full px-4 py-2 w-[420px]"><input placeholder="Search Vitamind community" className="bg-transparent outline-none flex-1 text-sm" /></div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-black">B</div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        <div className="space-y-4 lg:col-span-1">
          <Card className="p-5"><h3 className="font-black text-lg mb-3">Community</h3><div className="space-y-3 text-sm font-semibold text-slate-700"><p>👥 Feed</p><p>🧠 Mental Health</p><p>💪 Fitness</p><p>🍎 Nutrition</p><p>✨ Wellness Wins</p></div></Card>
          <Card className="p-5"><div className="flex items-start gap-2 text-sm text-slate-600"><ShieldCheck className="text-blue-600 mt-0.5" size={18} /><p>Supportive conversation only. No bullying, shaming, diagnosis, or crisis counseling.</p></div></Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-black">B</div>
              <div className="flex-1">
                <input value={postText} onChange={e => setPostText(e.target.value)} placeholder="Share your wellness journey, ask a question, or encourage someone..." className="w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-200" />
                <div className="flex flex-wrap items-center justify-between mt-4 gap-3"><select value={topic} onChange={e => setTopic(e.target.value)} className="rounded-xl border border-blue-100 px-3 py-2 text-sm outline-none"><option>Mental Health</option><option>Fitness</option><option>Nutrition</option><option>Wellness Wins</option></select><Button onClick={addPost}>Create Post</Button></div>
              </div>
            </div>
          </Card>

          {posts.map((post, i) => <Card key={i} className="p-5 rounded-3xl"><div className="flex justify-between gap-3 mb-2"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black">{post.name[0]}</div><div><p className="font-black">{post.name}</p><p className="text-xs font-bold text-blue-600 uppercase">{post.topic}</p></div></div><p className="text-sm text-slate-500">{post.time}</p></div><p className="text-slate-700">{post.text}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><button className="text-slate-600 hover:text-blue-600 font-semibold">👍 Encourage</button><button className="text-slate-600 hover:text-blue-600 font-semibold">💬 Reply ({post.replies})</button><button className="text-slate-600 hover:text-blue-600 font-semibold">↗ Share</button></div></Card>)}
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Card className="p-5"><h3 className="font-black text-lg mb-4">Trending Topics</h3><div className="space-y-3 text-sm"><div className="rounded-2xl bg-blue-50 p-3"><p className="font-black text-sky-700">#AnxietySupport</p><p className="text-slate-500">1.2k discussions</p></div><div className="rounded-2xl bg-blue-50 p-3"><p className="font-black text-teal-700">#WeightLossJourney</p><p className="text-slate-500">840 discussions</p></div><div className="rounded-2xl bg-blue-50 p-3"><p className="font-black text-indigo-700">#ADHDTips</p><p className="text-slate-500">610 discussions</p></div></div></Card>
          <Card className="p-5"><h3 className="font-black text-lg mb-3">Suggested Groups</h3><div className="space-y-3"><div className="flex items-center justify-between"><div><p className="font-semibold">Mindful Weight Loss</p><p className="text-xs text-slate-500">4.3k members</p></div><Button variant="secondary" className="py-2 px-3">Join</Button></div><div className="flex items-center justify-between"><div><p className="font-semibold">Anxiety Recovery</p><p className="text-xs text-slate-500">2.1k members</p></div><Button variant="secondary" className="py-2 px-3">Join</Button></div></div></Card>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
