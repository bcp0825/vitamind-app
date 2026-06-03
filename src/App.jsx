import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Apple,
  Utensils,
  BarChart3,
  Brain,
  CalendarDays,
  CreditCard,
  Dumbbell,
  Home,
  MessageCircle,
  Moon,
  Send,
  ShieldCheck,
  Mail,
  Smile,
  Sparkles,
  TrendingUp,
  Users,
  Waves,
} from "lucide-react";

const NAVY = "#071E4A";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white/95 shadow-sm border border-blue-100 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", className = "", type = "button" }) {
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-blue-50 text-blue-700 hover:bg-blue-100";

  return (
    <button type={type} onClick={onClick} className={`rounded-2xl px-4 py-3 font-semibold transition ${styles} ${className}`}>
      {children}
    </button>
  );
}

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200">
        <div className="relative text-white font-black text-3xl leading-none">V</div>
      </div>

      {!compact && (
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: NAVY }}>
            Vitamind
          </h1>
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
    note: "Low-pressure movement for stressful, anxious, or low-energy days.",
  },
  balanced: {
    title: "Balanced Body",
    time: "32 min",
    items: ["Bodyweight squats", "Push-ups", "Dumbbell rows", "Incline walk"],
    note: "A steady workout that builds consistency without overwhelming you.",
  },
  push: {
    title: "Strong Day Push",
    time: "45 min",
    items: ["Full-body strength", "Intervals", "Core finisher", "Cooldown"],
    note: "For high-energy days when you are ready to challenge yourself.",
  },
};

function buildNutritionPlan({ depression, anxiety, stress, motivation, energy, sleep }) {
  if (anxiety >= 7 || stress >= 7) {
    return {
      title: "Calm & Recovery Nutrition Plan",
      focus: "Lower stress, support calm, and stabilize energy.",
      meals: [
        "Breakfast: Greek yogurt, berries, oats, and water",
        "Lunch: Salmon or chicken, sweet potato, and greens",
        "Snack: Almonds, banana, or dark chocolate square",
        "Dinner: Turkey, rice, vegetables, and herbal tea",
      ],
      avoid: "Limit excess caffeine, skipped meals, and high-sugar snacks today.",
      hydration: "Aim for steady water intake throughout the day.",
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
        "Dinner: Lean protein, potatoes, and colorful vegetables",
      ],
      avoid: "Avoid skipping meals. Keep food simple and realistic today.",
      hydration: "Add one extra glass of water with each meal.",
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
        "Dinner: Chicken soup, rice, and vegetables",
      ],
      avoid: "Avoid heavy late meals and too much caffeine late in the day.",
      hydration: "Focus on hydration early in the day.",
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
        "Dinner: Steak or chicken, potatoes, greens, and water",
      ],
      avoid: "Avoid under-eating on high-output days.",
      hydration: "Add electrolytes if sweating heavily.",
    };
  }

  return {
    title: "Balanced Wellness Nutrition Plan",
    focus: "Maintain stable mood, energy, and wellness habits.",
    meals: [
      "Breakfast: Protein, fruit, and whole-grain carbs",
      "Lunch: Lean protein, vegetables, and healthy carbs",
      "Snack: Nuts, yogurt, or fruit",
      "Dinner: Balanced plate with protein, greens, and water",
    ],
    avoid: "Avoid all-or-nothing eating. Keep meals consistent.",
    hydration: "Aim for regular water intake through the day.",
  };
}

function App() {
  const [screen, setScreen] = useState("website");
  const [depression, setDepression] = useState(4);
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [ptsd, setPtsd] = useState(5);
  const [traumaStress, setTraumaStress] = useState(5);
  const [motivation, setMotivation] = useState(6);
  const [inattention, setInattention] = useState(5);
  const [impulsivity, setImpulsivity] = useState(5);
  const [hyperactivity, setHyperactivity] = useState(5);
  const [energy, setEnergy] = useState(6);
  const [sleep, setSleep] = useState(7);
  const [exercise, setExercise] = useState(5);

  // Set this to true only after you add real Stripe login/subscription verification.
  // For now, false locks premium features and sends users to Stripe.
  const HAS_ACCESS = true;
  const [subscribed, setSubscribed] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "coach",
      text: "Welcome to Vitamind. Complete your check-in, then I’ll help guide your mind-body plan.",
    },
  ]);

  const [foodEntry, setFoodEntry] = useState({
    meal: "Breakfast",
    food: "",
    mood: "Neutral",
    energyAfter: 5,
    notes: "",
  });

  const [foodLog, setFoodLog] = useState([
    {
      date: "Today",
      meal: "Breakfast",
      food: "Greek yogurt, berries, oats, and water",
      mood: "Focused",
      energyAfter: 7,
      notes: "Felt steady and less hungry later.",
    },
    {
      date: "Yesterday",
      meal: "Dinner",
      food: "Chicken, rice, and vegetables",
      mood: "Calm",
      energyAfter: 6,
      notes: "Good balanced meal.",
    },
  ]);

  const [posts, setPosts] = useState([
    { name: "Maya", topic: "Mental Health", text: "What helps you reset when anxiety is high?", replies: 18, time: "20m ago" },
    { name: "Jordan", topic: "Fitness", text: "Today I chose a 15-minute walk instead of skipping movement completely.", replies: 9, time: "1h ago" },
    { name: "Chris", topic: "Nutrition", text: "Share your favorite mood-supporting meal ideas.", replies: 14, time: "2h ago" },
  ]);

  const [history, setHistory] = useState([
    { date: "Mon", depression: 5, anxiety: 6, stress: 7, motivation: 4, energy: 5, sleep: 6 },
    { date: "Tue", depression: 4, anxiety: 5, stress: 6, motivation: 5, energy: 6, sleep: 7 },
    { date: "Wed", depression: 6, anxiety: 7, stress: 7, motivation: 4, energy: 4, sleep: 5 },
    { date: "Thu", depression: 4, anxiety: 4, stress: 5, motivation: 6, energy: 7, sleep: 7 },
    { date: "Fri", depression: 3, anxiety: 4, stress: 4, motivation: 7, energy: 7, sleep: 8 },
  ]);

  const mode = useMemo(() => {
    if (stress >= 7 || anxiety >= 7 || depression >= 7 || energy <= 4 || sleep <= 5) return "recovery";
    if (motivation >= 8 && energy >= 8 && stress <= 4) return "push";
    return "balanced";
  }, [depression, anxiety, stress, motivation, energy, sleep]);

  const plan = workouts[mode];

  const nutritionPlan = useMemo(
    () => buildNutritionPlan({ depression, anxiety, stress, motivation, energy, sleep }),
    [depression, anxiety, stress, motivation, energy, sleep]
  );

  function saveCheckin() {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const entry = {
      date: today,
      depression,
      anxiety,
      stress,
      ptsd,
      traumaStress,
      motivation,
      inattention,
      impulsivity,
      hyperactivity,
      energy,
      sleep,
      exercise,
    };

    setHistory((prev) => [entry, ...prev.filter((item) => item.date !== today)]);
    setScreen("home");
  }

  function addFoodEntry() {
    if (!foodEntry.food.trim()) return;

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    setFoodLog((prev) => [
      {
        date: today,
        meal: foodEntry.meal,
        food: foodEntry.food.trim(),
        mood: foodEntry.mood,
        energyAfter: foodEntry.energyAfter,
        notes: foodEntry.notes.trim(),
      },
      ...prev,
    ]);

    setFoodEntry({
      meal: "Breakfast",
      food: "",
      mood: "Neutral",
      energyAfter: 5,
      notes: "",
    });
  }

  async function send() {
    if (!input.trim()) return;

    const text = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ]);

    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: text,
          checkin: {
            depression,
            anxiety,
            stress,
            ptsd,
            traumaStress,
            motivation,
            inattention,
            impulsivity,
            hyperactivity,
            energy,
            sleep,
            exercise,
          },
          history,
          foodLog,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: data.reply || "I’m having trouble responding right now. Try again.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: "The AI coach is having trouble connecting right now.",
        },
      ]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-sky-100 text-slate-900">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <Logo />
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white border border-blue-100 px-4 py-2 shadow-sm text-sm text-slate-600">
            <Sparkles size={16} className="text-blue-600" /> AI wellness platform
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
              ["foodlog", Utensils, "Food Log"],
              ["coach", MessageCircle, "AI Coach"],
              ["community", Users, "Community"],
              ["pricing", CreditCard, "Subscription"],
              ["support", Mail, "Support"],
            ].map(([key, Icon, label]) => (
              <button
                key={key}
                onClick={() => setScreen(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 font-semibold transition ${
                  screen === key
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-blue-50"
                }`}
              >
                <Icon size={19} /> {label}
              </button>
            ))}
          </nav>

          <main className="md:col-span-3">
            {screen === "website" && <Website setScreen={setScreen} />}
            {screen === "home" && HAS_ACCESS && (
              <HomeScreen
                depression={depression}
                anxiety={anxiety}
                stress={stress}
                motivation={motivation}
                sleep={sleep}
                plan={plan}
                nutritionPlan={nutritionPlan}
                setScreen={setScreen}
              />
            )}
            {screen === "checkin" && HAS_ACCESS && (
              <Checkin
                depression={depression}
                setDepression={setDepression}
                anxiety={anxiety}
                setAnxiety={setAnxiety}
                stress={stress}
                setStress={setStress}
                ptsd={ptsd}
                setPtsd={setPtsd}
                traumaStress={traumaStress}
                setTraumaStress={setTraumaStress}
                motivation={motivation}
                setMotivation={setMotivation}
                inattention={inattention}
                setInattention={setInattention}
                impulsivity={impulsivity}
                setImpulsivity={setImpulsivity}
                hyperactivity={hyperactivity}
                setHyperactivity={setHyperactivity}
                energy={energy}
                setEnergy={setEnergy}
                sleep={sleep}
                setSleep={setSleep}
                exercise={exercise}
                setExercise={setExercise}
                saveCheckin={saveCheckin}
              />
            )}
            {screen === "progress" && HAS_ACCESS && <Progress history={history} />}
            {screen === "fitness" && HAS_ACCESS && (
              <Fitness
                plan={plan}
                mode={mode}
                depression={depression}
                anxiety={anxiety}
                stress={stress}
                motivation={motivation}
                energy={energy}
                sleep={sleep}
              />
            )}
            {screen === "nutrition" && HAS_ACCESS && (
              <Nutrition
                nutritionPlan={nutritionPlan}
                depression={depression}
                anxiety={anxiety}
                stress={stress}
                motivation={motivation}
                energy={energy}
                sleep={sleep}
              />
            )}
            {screen === "foodlog" && HAS_ACCESS && (
              <FoodLog
                foodEntry={foodEntry}
                setFoodEntry={setFoodEntry}
                foodLog={foodLog}
                addFoodEntry={addFoodEntry}
              />
            )}
            {screen === "coach" && HAS_ACCESS && <Coach messages={messages} input={input} setInput={setInput} send={send} />}
            {screen === "community" && HAS_ACCESS && <Community posts={posts} setPosts={setPosts} />}
            {screen === "pricing" && <Pricing subscribed={subscribed} setSubscribed={setSubscribed} />}
            {screen === "support" && <Support />}

            {!HAS_ACCESS &&
              screen !== "website" &&
              screen !== "pricing" && (
                <Card className="p-10 text-center">
                  <h2 className="text-4xl font-black mb-4 text-blue-700">
                    Unlock Vitamind Premium
                  </h2>

                  <p className="text-slate-600 mb-8 text-lg">
                    Subscribe to access AI coaching, wellness tracking, fitness plans,
                    nutrition guidance, and community features.
                  </p>

                  <a
                    href="https://buy.stripe.com/6oUfZ96bR60Vb1963h83C01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-2xl px-8 py-4 font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Start 7-Day Free Trial
                  </a>
                </Card>
              )}
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
        <div className="max-w-3xl relative z-10">
          <p className="font-bold text-blue-100 mb-3">Vitamind Wellness Platform</p>

          <h2 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            Your mind and body work together. Your wellness app should too.
          </h2>

          <p className="text-lg md:text-xl text-blue-50 mb-5 leading-relaxed">
            Vitamind connects mental health, fitness, nutrition, AI coaching, and community support into one daily wellness experience.
          </p>

          <p className="text-blue-50 mb-8 leading-relaxed">
            Start with a quick mental health check-in. Vitamind uses your anxiety, stress, depression, energy, motivation, sleep, ADHD, and trauma-stress ratings to guide your day with a personalized workout, food suggestions, progress tracking, and AI wellness support.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setScreen("pricing")} variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
              Start 7-Day Free Trial
            </Button>

            <Button onClick={() => setScreen("checkin")} variant="secondary" className="bg-blue-900/30 text-white hover:bg-blue-900/40">
              Preview Check-In
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <FeatureCard icon={Brain} color="text-blue-600" bg="bg-blue-50" title="Mental Health Check-In">
          Rate anxiety, depression, stress, ADHD symptoms, trauma stress, motivation, energy, and sleep so your plan matches how you actually feel.
        </FeatureCard>

        <FeatureCard icon={Dumbbell} color="text-sky-600" bg="bg-sky-50" title="Adaptive Fitness">
          Vitamind adjusts workouts based on your ratings. High stress or low sleep creates a recovery plan. High energy creates a stronger training day.
        </FeatureCard>

        <FeatureCard icon={Apple} color="text-teal-600" bg="bg-teal-50" title="Mood-Based Nutrition">
          Get food suggestions that support calm, focus, energy, recovery, and consistency based on your daily check-in.
        </FeatureCard>
      </div>

      <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-blue-600 font-black uppercase text-sm mb-2">
              Smart Food Tracking
            </p>

            <h3 className="text-3xl font-black mb-4">
              Understand how food affects your mood, energy, and mental health
            </h3>

            <p className="text-slate-600 mb-4 leading-relaxed">
              Vitamind includes a personalized food tracking system designed to connect nutrition with emotional and physical wellness.
            </p>

            <p className="text-slate-600 mb-4 leading-relaxed">
              Users can log meals, snacks, drinks, mood after eating, energy levels, cravings, and notes. Over time, Vitamind can identify patterns between nutrition, anxiety, depression, motivation, focus, sleep, exercise, PTSD symptoms, trauma stress, and overall wellness.
            </p>

            <p className="text-slate-600 leading-relaxed">
              The AI Coach can use this information to create more personalized meal recommendations, identify foods that improve energy or worsen symptoms, and help users build healthier long-term habits.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-blue-100 p-4 shadow-sm">
              <p className="font-black text-blue-700 mb-1">Breakfast Log</p>
              <p className="text-slate-700">
                Eggs, oatmeal, berries, coffee, water
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Mood: Focused • Energy: 8/10
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-blue-100 p-4 shadow-sm">
              <p className="font-black text-teal-700 mb-1">
                AI Nutrition Insight
              </p>

              <p className="text-slate-700 text-sm">
                Higher-protein breakfasts appear to improve your energy and focus while lowering afternoon cravings.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-600 text-white p-4 shadow-sm">
              <p className="font-black mb-1">Vitamind Goal</p>

              <p className="text-sm text-blue-50">
                Build healthier nutrition habits that support mental clarity, emotional regulation, recovery, and long-term wellness.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-blue-600 font-black uppercase text-sm mb-2">How Vitamind Works</p>
            <h3 className="text-3xl font-black mb-4">A simple daily flow for better wellness</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0">1</div>
                <div>
                  <h4 className="font-black">Complete your check-in</h4>
                  <p className="text-slate-600">Track mental and physical wellness ratings in under a minute.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0">2</div>
                <div>
                  <h4 className="font-black">Get a personalized plan</h4>
                  <p className="text-slate-600">Receive movement, nutrition, and recovery recommendations based on your scores.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0">3</div>
                <div>
                  <h4 className="font-black">Talk with the AI Coach</h4>
                  <p className="text-slate-600">Ask for motivation, stress support, fitness ideas, nutrition help, or a simple next step.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0">4</div>
                <div>
                  <h4 className="font-black">Track your progress weekly</h4>
                  <p className="text-slate-600">Review your ratings over time and notice patterns in mood, stress, energy, and sleep.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-sky-100 p-5 border border-blue-100">
            <div className="rounded-2xl bg-white p-4 shadow-sm mb-3">
              <p className="font-black">Today’s Check-In</p>
              <p className="text-sm text-slate-500">Anxiety 7/10 • Stress 8/10 • Sleep 5 hrs</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm mb-3">
              <p className="font-black text-blue-700">Suggested Fitness Plan</p>
              <p className="text-sm text-slate-500">Recovery Reset: 10-minute walk, stretch, and breathing.</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm mb-3">
              <p className="font-black text-teal-700">Suggested Nutrition Plan</p>
              <p className="text-sm text-slate-500">Calm-support meal with protein, complex carbs, hydration, and magnesium-rich snacks.</p>
            </div>

            <div className="rounded-2xl bg-blue-600 text-white p-4 shadow-sm">
              <p className="font-black">AI Coach</p>
              <p className="text-sm text-blue-50">“Today is a recovery day, not a failure day. Let’s focus on one small win.”</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-blue-50">
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <h3 className="text-2xl font-black mb-2">Built for real life</h3>
            <p className="text-slate-600">
              Vitamind is designed for busy people who need simple, practical support without feeling overwhelmed.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-black mb-2">Supportive community</h3>
            <p className="text-slate-600">
              Share wellness wins, ask questions, encourage others, and connect around mental health, fitness, and nutrition.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-black mb-2">Premium access</h3>
            <p className="text-slate-600">
              Unlock AI coaching, check-ins, adaptive plans, progress tracking, and community tools with Vitamind Premium.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:p-8 text-center border-2 border-blue-200">
        <h3 className="text-3xl font-black mb-3">Start your connected wellness journey</h3>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          Try Vitamind Premium free for 7 days and begin connecting your mental health, movement, nutrition, and daily support in one place.
        </p>

        <a
          href="https://buy.stripe.com/6oUfZ96bR60Vb1963h83C01"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-2xl px-8 py-4 font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Start 7-Day Free Trial
        </a>
      </Card>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, color, bg, title, children }) {
  return (
    <Card className="p-6">
      <div className={`h-12 w-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
        <Icon className={color} />
      </div>
      <h3 className="text-xl font-black mb-2">{title}</h3>
      <p className="text-slate-600">{children}</p>
    </Card>
  );
}

function HomeScreen({ depression, anxiety, stress, motivation, sleep, plan, nutritionPlan, setScreen }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-semibold mb-2">Today’s Vitamind Plan</p>
        <h2 className="text-3xl md:text-5xl font-black mb-3">{plan.title}</h2>
        <p className="max-w-2xl text-blue-50">Based on your mental health check-in, today’s focus is: {plan.note}</p>
        <Button onClick={() => setScreen("checkin")} variant="secondary" className="mt-5 bg-white text-blue-700 hover:bg-blue-50">
          Update Check-In
        </Button>
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
        <Action title="Mood Nutrition" icon={Apple} text={nutritionPlan.focus} onClick={() => setScreen("nutrition")} />
        <Action title="Talk to AI Coach" icon={MessageCircle} text="Ask for support based on your mood and stress." onClick={() => setScreen("coach")} />
      </div>
    </motion.div>
  );
}

function Metric({ icon: Icon, label, value, color = "text-blue-600", bg = "bg-blue-50" }) {
  return (
    <Card className="p-5 hover:-translate-y-1 transition">
      <div className={`h-11 w-11 rounded-2xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={color} />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </Card>
  );
}

function Action({ title, icon: Icon, text, onClick }) {
  return (
    <Card className="p-5 hover:shadow-md transition cursor-pointer" onClick={onClick}>
      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center mb-4">
        <Icon className="text-blue-600" />
      </div>
      <h3 className="text-xl font-black mb-1">{title}</h3>
      <p className="text-slate-500">{text}</p>
    </Card>
  );
}

function Checkin({
  depression,
  setDepression,
  anxiety,
  setAnxiety,
  stress,
  setStress,
  ptsd,
  setPtsd,
  traumaStress,
  setTraumaStress,
  motivation,
  setMotivation,
  inattention,
  setInattention,
  impulsivity,
  setImpulsivity,
  hyperactivity,
  setHyperactivity,
  energy,
  setEnergy,
  sleep,
  setSleep,
  exercise,
  setExercise,
  saveCheckin,
}) {
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
          <Slider label="Inattention" value={inattention} setValue={setInattention} />
          <Slider label="Impulsivity" value={impulsivity} setValue={setImpulsivity} />
          <Slider label="Hyperactivity" value={hyperactivity} setValue={setHyperactivity} />
        </CheckCard>

        <CheckCard title="PTSD Symptoms" text="Track flashbacks, nightmares, hypervigilance, emotional triggers, and intrusive trauma-related thoughts.">
          <Slider label="PTSD Symptoms" value={ptsd} setValue={setPtsd} />
        </CheckCard>

        <CheckCard title="Trauma Stress" text="Track emotional overwhelm, stress reactions, panic, tension, and difficulty emotionally regulating after stressful experiences.">
          <Slider label="Trauma Stress" value={traumaStress} setValue={setTraumaStress} />
        </CheckCard>

        <CheckCard title="Sleep & Recovery" text="Sleep quality strongly affects mood, anxiety, energy, and emotional resilience.">
          <Slider label="Sleep hours" value={sleep} setValue={setSleep} min={3} max={10} suffix=" hrs" />
        </CheckCard>

        <CheckCard title="Exercise & Physical Activity" text="Track workouts, walking, stretching, movement, and how consistent you have been with physical activity.">
          <Slider label="Exercise Consistency" value={exercise} setValue={setExercise} />
        </CheckCard>

        <Button onClick={saveCheckin} className="w-full mt-2">
          Save Check-In & Generate My Wellness Plan
        </Button>
      </Card>
    </motion.div>
  );
}

function CheckCard({ title, text, children }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-100 p-5 mb-6">
      <h3 className="font-black text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-3">{text}</p>
      {children}
    </div>
  );
}

function Slider({ label, value, setValue, min = 1, max = 10, suffix = "/10" }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-bold">{label}</span>
        <span className="font-black text-blue-700">
          {value}
          {suffix}
        </span>
      </div>
      <input className="w-full accent-blue-600" type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </div>
  );
}

function Progress({ history }) {
  const weekly = history.slice(0, 7);
  const average = (key) => Math.round(weekly.reduce((sum, item) => sum + item[key], 0) / weekly.length);

  const rows = [
    ["Depression", "depression", "text-indigo-600"],
    ["Anxiety", "anxiety", "text-sky-600"],
    ["Stress", "stress", "text-purple-600"],
    ["Motivation", "motivation", "text-teal-600"],
    ["Energy", "energy", "text-blue-600"],
    ["Sleep", "sleep", "text-slate-700"],
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-semibold mb-2">Weekly Wellness Tracking</p>
        <h2 className="text-4xl font-black mb-3">Your Check-In History</h2>
        <p className="text-blue-50 max-w-2xl">Review daily ratings, compare weekly patterns, and look back at past mental and physical wellness scores.</p>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5">
          <CalendarDays className="text-blue-600 mb-3" />
          <p className="text-sm text-slate-500">Latest Check-In</p>
          <p className="text-2xl font-black">{history[0]?.date || "No history"}</p>
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

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">7-Day Rating Overview</h3>
        <div className="space-y-5">
          {rows.map(([label, key, color]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <span className="font-bold">{label}</span>
                <span className={`font-black ${color}`}>
                  {average(key)}
                  {key === "sleep" ? " hrs" : "/10"}
                </span>
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
                <th className="py-3 pr-4">Inattention</th>
                <th className="py-3 pr-4">Impulsivity</th>
                <th className="py-3 pr-4">Hyperactivity</th>
                <th className="py-3 pr-4">Energy</th>
                <th className="py-3 pr-4">Sleep</th>
                <th className="py-3 pr-4">Exercise</th>
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
                  <td className="py-3 pr-4">{item.inattention ?? "-"}</td>
                  <td className="py-3 pr-4">{item.impulsivity ?? "-"}</td>
                  <td className="py-3 pr-4">{item.hyperactivity ?? "-"}</td>
                  <td className="py-3 pr-4">{item.energy}/10</td>
                  <td className="py-3 pr-4">{item.sleep} hrs</td>
                  <td className="py-3 pr-4">{item.exercise ?? "-"}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

function Fitness({ plan, mode, stress, energy, sleep }) {
  const reason =
    mode === "recovery"
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

function Nutrition({ nutritionPlan, anxiety, stress, energy }) {
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


function FoodLog({ foodEntry, setFoodEntry, foodLog, addFoodEntry }) {
  const averageEnergy =
    foodLog.length > 0
      ? Math.round(foodLog.reduce((sum, item) => sum + Number(item.energyAfter || 0), 0) / foodLog.length)
      : 0;

  const highEnergyFoods = foodLog
    .filter((item) => Number(item.energyAfter) >= 7)
    .slice(0, 3);

  const lowEnergyFoods = foodLog
    .filter((item) => Number(item.energyAfter) <= 4)
    .slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-semibold mb-2">Food Tracking</p>
        <h2 className="text-4xl font-black mb-3">Daily Food Log</h2>
        <p className="text-blue-50 max-w-2xl">
          Track what you eat, how it affects your mood, and your energy after meals. Vitamind can use this pattern to help improve your nutrition suggestions.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">Add a Meal or Snack</h3>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-bold mb-2">Meal Type</label>
            <select
              value={foodEntry.meal}
              onChange={(e) => setFoodEntry({ ...foodEntry, meal: e.target.value })}
              className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
              <option>Drink</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-2">Mood After Eating</label>
            <select
              value={foodEntry.mood}
              onChange={(e) => setFoodEntry({ ...foodEntry, mood: e.target.value })}
              className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>Calm</option>
              <option>Focused</option>
              <option>Neutral</option>
              <option>Tired</option>
              <option>Sluggish</option>
              <option>Anxious</option>
              <option>Energized</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">What did you eat?</label>
          <textarea
            value={foodEntry.food}
            onChange={(e) => setFoodEntry({ ...foodEntry, food: e.target.value })}
            placeholder="Example: eggs, toast, berries, coffee, water..."
            className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]"
          />
        </div>

        <div className="mb-4">
          <Slider
            label="Energy After Eating"
            value={foodEntry.energyAfter}
            setValue={(value) => setFoodEntry({ ...foodEntry, energyAfter: value })}
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold mb-2">Notes</label>
          <input
            value={foodEntry.notes}
            onChange={(e) => setFoodEntry({ ...foodEntry, notes: e.target.value })}
            placeholder="Example: felt full, cravings later, stomach felt off, better focus..."
            className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <Button onClick={addFoodEntry} className="w-full">
          Save Food Entry
        </Button>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Metric icon={Utensils} label="Food Entries" value={foodLog.length} color="text-blue-600" bg="bg-blue-50" />
        <Metric icon={TrendingUp} label="Avg Food Energy" value={`${averageEnergy}/10`} color="text-teal-600" bg="bg-teal-50" />
        <Metric icon={Apple} label="Nutrition Pattern" value={averageEnergy >= 7 ? "Strong" : averageEnergy <= 4 ? "Needs Work" : "Balanced"} color="text-sky-600" bg="bg-sky-50" />
      </div>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">Food Pattern Insights</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
            <h4 className="font-black text-green-700 mb-2">Meals that supported energy</h4>
            {highEnergyFoods.length > 0 ? (
              <ul className="space-y-2 text-slate-700">
                {highEnergyFoods.map((item, i) => (
                  <li key={i}>✓ {item.meal}: {item.food}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600">Add more entries to identify helpful foods.</p>
            )}
          </div>

          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4">
            <h4 className="font-black text-orange-700 mb-2">Meals to review</h4>
            {lowEnergyFoods.length > 0 ? (
              <ul className="space-y-2 text-slate-700">
                {lowEnergyFoods.map((item, i) => (
                  <li key={i}>• {item.meal}: {item.food}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600">No low-energy meal patterns yet.</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">Recent Food Log</h3>

        <div className="space-y-3">
          {foodLog.map((item, i) => (
            <div key={`${item.date}-${i}`} className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className="font-black text-blue-700">{item.meal}</p>
                <p className="text-sm text-slate-500">{item.date}</p>
              </div>

              <p className="font-semibold text-slate-800">{item.food}</p>
              <p className="text-sm text-slate-600 mt-1">Mood: {item.mood} • Energy After: {item.energyAfter}/10</p>
              {item.notes && <p className="text-sm text-slate-500 mt-1">Notes: {item.notes}</p>}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}


function Coach({ messages, input, setInput, send }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 md:p-6">
        <h2 className="text-3xl font-black mb-1">AI Wellness Coach</h2>
        <p className="text-slate-500 mb-5">Ask for motivation, stress support, fitness ideas, or nutrition help.</p>

        <div className="h-[420px] overflow-y-auto rounded-2xl bg-slate-50 p-4 space-y-3 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-blue-100 text-slate-700"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Try: I feel stressed today..."
            className="flex-1 rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
          <Button onClick={send} className="px-4">
            <Send size={18} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}


function Support() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <Card className="p-8 bg-gradient-to-r from-blue-700 via-sky-500 to-teal-400 text-white border-none shadow-xl shadow-blue-100">
        <p className="text-blue-100 font-semibold mb-2">
          Vitamind Customer Support
        </p>

        <h2 className="text-5xl font-black mb-4">
          We’re here to help
        </h2>

        <p className="text-blue-50 text-lg max-w-3xl leading-relaxed">
          Need help with your account, subscription, AI Coach, wellness tracking,
          billing, food logs, fitness plans, or community support? Reach out anytime.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h3 className="text-2xl font-black mb-3">
            Contact Support
          </h3>

          <a
            href="mailto:customerservicethevitamind@gmail.com"
            className="block rounded-2xl bg-blue-600 text-white text-center font-bold px-5 py-4 hover:bg-blue-700 transition"
          >
            customerservicethevitamind@gmail.com
          </a>

          <p className="text-slate-500 text-sm mt-4">
            Typical response time: 24–48 hours.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
          <h3 className="text-2xl font-black mb-4">
            Common Support Topics
          </h3>

          <div className="space-y-3 text-slate-700">
            <p>✓ Subscription & billing support</p>
            <p>✓ AI Coach issues</p>
            <p>✓ Wellness tracking help</p>
            <p>✓ Food log support</p>
            <p>✓ Fitness and nutrition questions</p>
            <p>✓ Community support</p>
            <p>✓ Account access help</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 text-center border-2 border-blue-200">
        <h3 className="text-3xl font-black mb-3">
          Vitamind Support Mission
        </h3>

        <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Our goal is to provide a supportive, safe, and helpful experience while helping users connect
          mental health, fitness, nutrition, recovery, movement, and long-term wellness in one platform.
        </p>
      </Card>
    </motion.div>
  );
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
          <span className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-black px-4 py-2 mb-4">
            7 Day Free Trial
          </span>
          <h3 className="text-4xl font-black mb-2">Vitamind Premium</h3>
          <p className="text-slate-500 mb-6 text-lg">Personalized mind-body wellness coaching designed to improve mental and physical health.</p>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-6xl font-black">$19.99</span>
            <span className="text-slate-500 font-semibold mb-2">/month</span>
          </div>
          <p className="text-blue-700 font-semibold mb-6">Start free for 7 days. Cancel anytime.</p>
          <ul className="space-y-3 text-slate-700 mb-8 text-lg">
            <li>✓ Full mental health assessments</li>
            <li>✓ Personalized mood-based workouts</li>
            <li>✓ Mood-supportive nutrition plans</li>
            <li>✓ AI wellness coach</li>
            <li>✓ Wellness community access</li>
            <li>✓ Progress tracking and insights</li>
          </ul>
          <a
            href="https://buy.stripe.com/6oUfZ96bR60Vb1963h83C01"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center rounded-2xl px-4 py-4 font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Start 7-Day Free Trial
          </a>
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
    setPosts((prev) => [{ name: "You", topic, text: postText.trim(), replies: 0, time: "Just now" }, ...prev]);
    setPostText("");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur rounded-3xl border border-blue-100 shadow-sm p-4 flex items-center justify-between">
        <Logo compact />
        <div className="hidden md:flex items-center gap-3 bg-slate-50 rounded-full px-4 py-2 w-[420px]">
          <input placeholder="Search Vitamind community" className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-black">B</div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        <div className="space-y-4 lg:col-span-1">
          <Card className="p-5">
            <h3 className="font-black text-lg mb-3">Community</h3>
            <div className="space-y-3 text-sm font-semibold text-slate-700">
              <p>👥 Feed</p>
              <p>🧠 Mental Health</p>
              <p>💪 Fitness</p>
              <p>🍎 Nutrition</p>
              <p>✨ Wellness Wins</p>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <ShieldCheck className="text-blue-600 mt-0.5" size={18} />
              <p>Supportive conversation only. No bullying, shaming, diagnosis, or crisis counseling.</p>
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-black">B</div>
              <div className="flex-1">
                <input
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share your wellness journey, ask a question, or encourage someone..."
                  className="w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                  <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-xl border border-blue-100 px-3 py-2 text-sm outline-none">
                    <option>Mental Health</option>
                    <option>Fitness</option>
                    <option>Nutrition</option>
                    <option>Wellness Wins</option>
                  </select>
                  <Button onClick={addPost}>Create Post</Button>
                </div>
              </div>
            </div>
          </Card>

          {posts.map((post, i) => (
            <Card key={i} className="p-5 rounded-3xl">
              <div className="flex justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black">
                    {post.name[0]}
                  </div>
                  <div>
                    <p className="font-black">{post.name}</p>
                    <p className="text-xs font-bold text-blue-600 uppercase">{post.topic}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">{post.time}</p>
              </div>
              <p className="text-slate-700">{post.text}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <button className="text-slate-600 hover:text-blue-600 font-semibold">👍 Encourage</button>
                <button className="text-slate-600 hover:text-blue-600 font-semibold">💬 Reply ({post.replies})</button>
                <button className="text-slate-600 hover:text-blue-600 font-semibold">↗ Share</button>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Card className="p-5">
            <h3 className="font-black text-lg mb-4">Trending Topics</h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl bg-blue-50 p-3">
                <p className="font-black text-sky-700">#AnxietySupport</p>
                <p className="text-slate-500">1.2k discussions</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3">
                <p className="font-black text-teal-700">#WeightLossJourney</p>
                <p className="text-slate-500">840 discussions</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3">
                <p className="font-black text-indigo-700">#ADHDTips</p>
                <p className="text-slate-500">610 discussions</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-black text-lg mb-3">Suggested Groups</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Mindful Weight Loss</p>
                  <p className="text-xs text-slate-500">4.3k members</p>
                </div>
                <Button variant="secondary" className="py-2 px-3">
                  Join
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Anxiety Recovery</p>
                  <p className="text-xs text-slate-500">2.1k members</p>
                </div>
                <Button variant="secondary" className="py-2 px-3">
                  Join
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
