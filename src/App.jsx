import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
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

const NAVY = "#FFFFFF";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[2rem] bg-white shadow-xl shadow-blue-950/10 border border-white/60 ring-1 ring-white/40 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", className = "", type = "button" }) {
  const styles =
    variant === "primary"
      ? "bg-[#1D7CFF] text-white hover:bg-[#0B63CE] shadow-lg shadow-blue-900/20"
      : "bg-white text-[#003C8F] hover:bg-blue-50 shadow-sm";

  return (
    <button type={type} onClick={onClick} className={`rounded-full px-5 py-3 font-semibold transition active:scale-[0.98] ${styles} ${className}`}>
      {children}
    </button>
  );
}

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#1D7CFF] to-[#003C8F] flex items-center justify-center shadow-lg shadow-blue-900/30">
        <div className="relative text-white font-black text-3xl leading-none">V</div>
      </div>

      {!compact && (
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: NAVY }}>
            Vitamind
          </h1>
          <p className="text-sm text-blue-100">Mental and physical wellness connected.</p>
        </div>
      )}
    </div>
  );
}

const recommendationPools = {
  fitness: {
    anxiety: [
      {
        title: "Calm Walk Reset",
        time: "20 min",
        focus: "Lower anxiety and release physical tension.",
        items: ["8-min easy walk", "4-min box breathing", "5-min shoulder/neck mobility", "3-min slow cooldown"],
        note: "Keep intensity low. The goal is nervous-system regulation, not performance.",
      },
      {
        title: "Grounding Mobility Flow",
        time: "16 min",
        focus: "Reconnect with your body and reduce racing thoughts.",
        items: ["Cat-cow stretch", "Child's pose breathing", "Standing hamstring stretch", "Slow wall push-ups"],
        note: "Move slowly and name what you feel in your body as you stretch.",
      },
      {
        title: "Anxiety Release Circuit",
        time: "22 min",
        focus: "Use gentle movement to discharge stress energy.",
        items: ["March in place", "Bodyweight squats", "Wall push-ups", "Slow breathing between rounds"],
        note: "Stop before exhaustion. Finish feeling steadier, not drained.",
      },
    ],
    depression: [
      {
        title: "Mood Activation Walk",
        time: "15 min",
        focus: "Use small movement to support mood and motivation.",
        items: ["Put on shoes", "Walk 5 minutes out", "Walk 5 minutes back", "Stretch 5 minutes"],
        note: "Behavioral activation means action comes before motivation.",
      },
      {
        title: "Low-Motivation Strength Start",
        time: "18 min",
        focus: "Build momentum with a very simple routine.",
        items: ["Chair squats", "Incline push-ups", "Light rows", "Gentle core brace"],
        note: "Completing a small workout counts as success today.",
      },
      {
        title: "Energy Builder",
        time: "25 min",
        focus: "Increase energy with steady movement.",
        items: ["10-min walk", "2 rounds bodyweight strength", "5-min stretch", "Hydration break"],
        note: "Choose consistency over intensity.",
      },
    ],
    adhd: [
      {
        title: "Focus Burst Workout",
        time: "12 min",
        focus: "Short structured movement for ADHD restlessness.",
        items: ["2-min jumping jacks or marching", "10 squats", "10 wall push-ups", "Repeat 3 rounds"],
        note: "Short workouts can help reset attention without feeling overwhelming.",
      },
      {
        title: "Dopamine Movement Stack",
        time: "20 min",
        focus: "Use variety to keep the brain engaged.",
        items: ["5-min walk", "5-min strength", "5-min mobility", "5-min music cooldown"],
        note: "Changing stations helps reduce boredom and improves follow-through.",
      },
      {
        title: "Restless Energy Reset",
        time: "18 min",
        focus: "Channel hyperactivity into useful movement.",
        items: ["Fast walk", "Bodyweight lunges", "Plank hold", "Breathing cooldown"],
        note: "Use movement as a regulation tool, not a punishment.",
      },
    ],
    trauma: [
      {
        title: "Trauma-Informed Safety Flow",
        time: "15 min",
        focus: "Support safety, grounding, and body awareness.",
        items: ["Feet on floor grounding", "Gentle seated stretch", "Slow walk", "Orient to the room"],
        note: "Stay within your window of tolerance. You can stop anytime.",
      },
      {
        title: "Body Safety Walk",
        time: "18 min",
        focus: "Pair movement with environmental safety cues.",
        items: ["Notice 5 safe things", "Walk slowly", "Relax jaw/shoulders", "Name one supportive next step"],
        note: "This is about feeling present and safe in your body.",
      },
      {
        title: "Gentle Reset Routine",
        time: "20 min",
        focus: "Reduce physical tension connected to trauma stress.",
        items: ["Breathing", "Neck mobility", "Hip stretch", "Slow walk"],
        note: "No forced intensity. Gentle consistency is the goal.",
      },
    ],
    sleep: [
      {
        title: "Low-Sleep Recovery Plan",
        time: "14 min",
        focus: "Protect recovery after poor sleep.",
        items: ["Easy walk", "Light stretching", "Hydration", "Early bedtime plan"],
        note: "Avoid hard training today if your body is under-recovered.",
      },
      {
        title: "Evening Wind-Down Movement",
        time: "12 min",
        focus: "Prepare the body for better sleep.",
        items: ["Slow breathing", "Hamstring stretch", "Chest opener", "Screen-free cooldown"],
        note: "Make this calm and repeatable.",
      },
    ],
    balanced: [
      {
        title: "Balanced Body Plan",
        time: "32 min",
        focus: "Build strength, mood stability, and consistency.",
        items: ["Bodyweight squats", "Push-ups", "Rows", "Incline walk"],
        note: "A steady workout that builds consistency without overwhelming you.",
      },
      {
        title: "Mind-Body Strength",
        time: "35 min",
        focus: "Combine strength training with stress regulation.",
        items: ["Warm-up walk", "Strength circuit", "Core work", "Breathing cooldown"],
        note: "Train the body while keeping the nervous system calm.",
      },
      {
        title: "Consistency Builder",
        time: "28 min",
        focus: "Maintain momentum with realistic movement.",
        items: ["Walk", "Squats", "Push movement", "Pull movement", "Stretch"],
        note: "This is a sustainable plan for normal-energy days.",
      },
    ],
    push: [
      {
        title: "Strong Day Push",
        time: "45 min",
        focus: "Use high energy for a stronger training day.",
        items: ["Full-body strength", "Intervals", "Core finisher", "Cooldown"],
        note: "Challenge yourself while staying mindful of recovery.",
      },
      {
        title: "Performance Builder",
        time: "40 min",
        focus: "Build strength and conditioning.",
        items: ["Warm-up", "Strength blocks", "Cardio intervals", "Mobility cooldown"],
        note: "Good for high-energy, low-stress days.",
      },
    ],
  },
  nutrition: {
    anxiety: [
      {
        title: "Calm & Recovery Nutrition Plan",
        focus: "Lower stress, support calm, and stabilize energy.",
        meals: ["Breakfast: Greek yogurt, berries, oats, and water", "Lunch: Chicken, sweet potato, and greens", "Snack: Almonds, banana, or dark chocolate square", "Dinner: Turkey, rice, vegetables, and herbal tea"],
        avoid: "Limit excess caffeine, skipped meals, and high-sugar snacks today.",
        hydration: "Aim for steady water intake throughout the day.",
      },
      {
        title: "Steady Blood Sugar Plan",
        focus: "Reduce anxiety spikes by avoiding long gaps without food.",
        meals: ["Breakfast: Eggs, toast, and fruit", "Lunch: Protein bowl with rice and vegetables", "Snack: Apple with peanut butter", "Dinner: Salmon or chicken with potatoes and greens"],
        avoid: "Avoid energy drinks and large caffeine doses.",
        hydration: "Sip water consistently instead of waiting until you feel drained.",
      },
    ],
    depression: [
      {
        title: "Mood-Lift Nutrition Plan",
        focus: "Support mood, energy, and motivation with simple meals.",
        meals: ["Breakfast: Eggs, toast, fruit, and water", "Lunch: Chicken bowl with rice, beans, and vegetables", "Snack: Protein smoothie or peanut butter with apple", "Dinner: Lean protein, potatoes, and colorful vegetables"],
        avoid: "Avoid skipping meals. Keep food simple and realistic today.",
        hydration: "Add one extra glass of water with each meal.",
      },
      {
        title: "Simple Fuel Plan",
        focus: "Use easy meals when motivation is low.",
        meals: ["Breakfast: Oatmeal with protein", "Lunch: Turkey wrap and fruit", "Snack: Greek yogurt", "Dinner: Rotisserie chicken, rice, and vegetables"],
        avoid: "Avoid all-or-nothing eating. Something simple is better than nothing.",
        hydration: "Keep a water bottle visible as a reminder cue.",
      },
    ],
    adhd: [
      {
        title: "Focus Support Nutrition Plan",
        focus: "Support attention with protein, hydration, and steady meals.",
        meals: ["Breakfast: Eggs or Greek yogurt with oats", "Lunch: Chicken wrap with vegetables", "Snack: Cheese stick, nuts, or protein shake", "Dinner: Lean protein, rice, and greens"],
        avoid: "Avoid relying only on sugar or caffeine for focus.",
        hydration: "Drink water before and after stimulant/caffeine use if applicable.",
      },
      {
        title: "ADHD Meal Simplicity Plan",
        focus: "Reduce decision fatigue with repeatable meals.",
        meals: ["Breakfast: Same easy protein breakfast", "Lunch: Pre-made bowl or wrap", "Snack: Grab-and-go protein", "Dinner: One-pan protein and vegetables"],
        avoid: "Avoid complicated meal plans when executive functioning is low.",
        hydration: "Use phone reminders for water and meals.",
      },
    ],
    trauma: [
      {
        title: "Grounded Recovery Nutrition",
        focus: "Use steady, comforting foods to support regulation.",
        meals: ["Breakfast: Warm oats with protein", "Lunch: Soup, rice, and lean protein", "Snack: Banana or yogurt", "Dinner: Chicken, potatoes, and vegetables"],
        avoid: "Avoid long periods without eating, which can increase body stress.",
        hydration: "Warm tea or water can be part of a grounding routine.",
      },
    ],
    sleep: [
      {
        title: "Sleep Recovery Meal Plan",
        focus: "Support low energy and recovery after poor sleep.",
        meals: ["Breakfast: Oatmeal, banana, and protein", "Lunch: Turkey wrap, fruit, and water", "Snack: Greek yogurt or boiled eggs", "Dinner: Chicken soup, rice, and vegetables"],
        avoid: "Avoid heavy late meals and too much caffeine late in the day.",
        hydration: "Focus on hydration early in the day.",
      },
    ],
    performance: [
      {
        title: "Performance Fuel Nutrition Plan",
        focus: "Fuel strength, movement, and consistency.",
        meals: ["Breakfast: Eggs, oats, berries, and water", "Lunch: Lean protein, rice, vegetables, and avocado", "Snack: Protein shake or cottage cheese with fruit", "Dinner: Steak or chicken, potatoes, greens, and water"],
        avoid: "Avoid under-eating on high-output days.",
        hydration: "Add electrolytes if sweating heavily.",
      },
    ],
    balanced: [
      {
        title: "Balanced Wellness Nutrition Plan",
        focus: "Maintain stable mood, energy, and wellness habits.",
        meals: ["Breakfast: Protein, fruit, and whole-grain carbs", "Lunch: Lean protein, vegetables, and healthy carbs", "Snack: Nuts, yogurt, or fruit", "Dinner: Balanced plate with protein, greens, and water"],
        avoid: "Avoid all-or-nothing eating. Keep meals consistent.",
        hydration: "Aim for regular water intake through the day.",
      },
      {
        title: "Mind-Body Maintenance Plan",
        focus: "Support steady mood and daily energy.",
        meals: ["Breakfast: Protein plus fiber", "Lunch: Colorful protein bowl", "Snack: Fruit and protein", "Dinner: Lean protein with vegetables"],
        avoid: "Avoid skipping meals when the day gets busy.",
        hydration: "Use water with meals as an anchor habit.",
      },
    ],
  },
};

function recommendationIndex(values, length) {
  const day = Math.floor(Date.now() / 86400000);
  const score = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return Math.abs(day + score) % length;
}

function getRecommendationCategory({ depression, anxiety, stress, motivation, energy, sleep, inattention, impulsivity, hyperactivity, ptsd, traumaStress }) {
  if (ptsd >= 7 || traumaStress >= 7) return "trauma";
  if (anxiety >= 7 || stress >= 7) return "anxiety";
  if (depression >= 7 || motivation <= 4) return "depression";
  if (inattention >= 7 || impulsivity >= 7 || hyperactivity >= 7) return "adhd";
  if (energy <= 4 || sleep <= 5) return "sleep";
  if (motivation >= 8 && energy >= 8 && stress <= 4) return "push";
  return "balanced";
}

function buildFitnessRecommendation(scores) {
  const category = getRecommendationCategory(scores);
  const poolKey = category === "push" ? "push" : category;
  const pool = recommendationPools.fitness[poolKey] || recommendationPools.fitness.balanced;
  const selected = pool[recommendationIndex(Object.values(scores), pool.length)];
  return { ...selected, category: poolKey };
}

function buildNutritionPlan(scores) {
  const category = getRecommendationCategory(scores);
  const poolKey = category === "push" ? "performance" : category;
  const pool = recommendationPools.nutrition[poolKey] || recommendationPools.nutrition.balanced;
  const selected = pool[recommendationIndex(Object.values(scores), pool.length)];
  return { ...selected, category: poolKey };
}

const therapyLibrary = [
  {
    therapy: "CBT",
    bestFor: "Anxiety, depression, negative thinking, overthinking",
    skills: ["Thought reframing", "Evidence testing", "Thought records", "Behavioral experiments"],
  },
  {
    therapy: "DBT-Informed Skills",
    bestFor: "Emotional reactivity, impulsivity, stress, conflict",
    skills: ["STOP skill", "TIPP skill", "Wise Mind", "Opposite action"],
  },
  {
    therapy: "ACT",
    bestFor: "Avoidance, shame, life direction, getting unstuck",
    skills: ["Values-based action", "Defusion", "Acceptance", "Committed action"],
  },
  {
    therapy: "Mindfulness",
    bestFor: "Overthinking, sleep, body tension, anxiety",
    skills: ["Body scan", "Breath awareness", "Present-moment noticing", "Grounding"],
  },
  {
    therapy: "Trauma-Informed Care",
    bestFor: "PTSD symptoms, triggers, trauma stress, shutdown",
    skills: ["Safety scan", "Window of tolerance", "Orienting", "5-4-3-2-1 grounding"],
  },
  {
    therapy: "ADHD Skills Coaching",
    bestFor: "Inattention, impulsivity, hyperactivity, task avoidance",
    skills: ["Task chunking", "External reminders", "Timers", "Reward loops"],
  },
  {
    therapy: "Behavioral Activation",
    bestFor: "Low motivation, low mood, isolation, fatigue",
    skills: ["Small action first", "Pleasure/mastery planning", "Routine building", "Activity scheduling"],
  },
  {
    therapy: "Motivational Interviewing",
    bestFor: "Ambivalence, habit change, fitness/nutrition consistency",
    skills: ["Change talk", "Confidence scaling", "Values connection", "Next-step planning"],
  },
];

function buildTherapeuticSuggestion({ depression, anxiety, stress, motivation, inattention, impulsivity, hyperactivity, ptsd, traumaStress, energy, sleep, exercise }) {
  const highAdhd = inattention >= 7 || impulsivity >= 7 || hyperactivity >= 7;
  const highTrauma = ptsd >= 7 || traumaStress >= 7;
  const highAnxiety = anxiety >= 7 || stress >= 7;
  const lowMood = depression >= 7 || motivation <= 4;
  const lowRecovery = energy <= 4 || sleep <= 5;

  if (highTrauma) {
    return {
      primaryConcern: "PTSD / Trauma Stress",
      planTitle: "Safety & Grounding Plan",
      therapy: "Trauma-Informed Care",
      skill: "Window of Tolerance + 5-4-3-2-1 Grounding",
      why: "Your PTSD or trauma-stress score is elevated, so the priority is helping your body feel safer before problem-solving.",
      steps: ["Pause and place both feet on the floor", "Name 5 things you see", "Name 4 things you feel", "Name 3 things you hear", "Name 2 things you smell", "Name 1 thing you taste", "Ask: am I in danger right now, or am I remembering danger?"],
      actionStep: "Take a 10-minute low-stimulation reset: water, quiet space, slow breathing, and no major decisions for 20 minutes.",
      reflection: "What helped my body feel even 5% safer today?",
      prompt: "I can slow down, notice safety cues, and choose one next step.",
      library: therapyLibrary.filter((item) => ["Trauma-Informed Care", "Mindfulness", "ACT"].includes(item.therapy)),
    };
  }

  if (highAnxiety) {
    return {
      primaryConcern: "Anxiety / Stress",
      planTitle: "Calm Thoughts + Calm Body Plan",
      therapy: "CBT + DBT-Informed Regulation",
      skill: "Thought Reframing + STOP Skill",
      why: "Your anxiety or stress score is elevated, so this plan targets both racing thoughts and body tension.",
      steps: ["STOP: Stop, Take a step back, Observe, Proceed mindfully", "Write the main anxious thought", "Ask what evidence supports it", "Ask what evidence challenges it", "Create one balanced thought", "Do 4 rounds of box breathing"],
      actionStep: "Do one calming action before checking your phone again: walk, stretch, drink water, or breathe for 2 minutes.",
      reflection: "What thought felt intense today, and what balanced thought could I practice?",
      prompt: "A thought can feel true without being the whole truth.",
      library: therapyLibrary.filter((item) => ["CBT", "DBT-Informed Skills", "Mindfulness"].includes(item.therapy)),
    };
  }

  if (lowMood) {
    return {
      primaryConcern: "Low Mood / Low Motivation",
      planTitle: "Behavioral Activation Plan",
      therapy: "Behavioral Activation + CBT",
      skill: "Action Before Motivation",
      why: "Low mood and low motivation often improve after small action begins, not before.",
      steps: ["Choose one task that takes under 5 minutes", "Make it specific and visible", "Start before judging your mood", "Mark it as a win", "Choose one pleasant or meaningful activity later today"],
      actionStep: "Complete one 5-minute task: shower, walk outside, clean one surface, prep one meal, or text one supportive person.",
      reflection: "What small action gave me even a little momentum today?",
      prompt: "I do not have to feel motivated to take one helpful step.",
      library: therapyLibrary.filter((item) => ["Behavioral Activation", "CBT", "Motivational Interviewing"].includes(item.therapy)),
    };
  }

  if (highAdhd) {
    return {
      primaryConcern: "ADHD Symptoms",
      planTitle: "Focus & Follow-Through Plan",
      therapy: "ADHD Skills Coaching",
      skill: "Externalize the Plan",
      why: "Your ADHD ratings are elevated, so the goal is to reduce memory load and make the next step obvious.",
      steps: ["Write only the next 3 tasks", "Circle the easiest one", "Set a 10-minute timer", "Remove one distraction", "Reward yourself after the timer", "Restart without shame if you drift"],
      actionStep: "Set a 10-minute timer and do the easiest task first. Stop when the timer ends or continue if momentum starts.",
      reflection: "What helped me start today: timer, list, music, body doubling, or reward?",
      prompt: "I do not need the whole plan. I only need the next visible step.",
      library: therapyLibrary.filter((item) => ["ADHD Skills Coaching", "DBT-Informed Skills", "Motivational Interviewing"].includes(item.therapy)),
    };
  }

  if (lowRecovery) {
    return {
      primaryConcern: "Low Energy / Poor Sleep",
      planTitle: "Recovery & Self-Compassion Plan",
      therapy: "Self-Compassion + Recovery Planning",
      skill: "Lower the Bar, Keep the Routine",
      why: "Low energy or poor sleep means your body may need a recovery-based plan instead of a high-pressure plan.",
      steps: ["Choose the lighter version of today's task", "Hydrate", "Do 5-10 minutes of gentle movement", "Plan an earlier wind-down", "Avoid negative self-talk about needing rest"],
      actionStep: "Pick one recovery anchor: water, sunlight, 10-minute walk, simple meal, or earlier bedtime.",
      reflection: "What is one way I respected my limits today without giving up on myself?",
      prompt: "Recovery is productive when my body is under-resourced.",
      library: therapyLibrary.filter((item) => ["Mindfulness", "Behavioral Activation", "Motivational Interviewing"].includes(item.therapy)),
    };
  }

  return {
    primaryConcern: "Habit Growth / Wellness Maintenance",
    planTitle: "Values-Based Wellness Plan",
    therapy: "ACT + Motivational Interviewing",
    skill: "Choose One Value-Aligned Step",
    why: "Your scores are in a workable range, so this is a strong time to build intentional habits and prevent relapse.",
    steps: ["Pick one value: health, family, faith, growth, peace, or discipline", "Choose one small action that matches it", "Do it for 10 minutes", "Notice feelings without needing them to disappear", "Repeat tomorrow"],
    actionStep: "Choose one value-aligned action today and schedule it on purpose.",
    reflection: "What value did I move toward today?",
    prompt: "I can move toward what matters even when my feelings are imperfect.",
    library: therapyLibrary.filter((item) => ["ACT", "Motivational Interviewing", "Mindfulness"].includes(item.therapy)),
  };
}

const workouts = {
  recovery: recommendationPools.fitness.anxiety[0],
  balanced: recommendationPools.fitness.balanced[0],
  push: recommendationPools.fitness.push[0],
};


function MobileNavButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`min-h-[82px] rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition ${
        active ? "bg-white text-[#003C8F] shadow-md" : "text-white/85"
      }`}
    >
      <Icon size={30} strokeWidth={2.5} />
      <span className="text-sm font-black leading-none">{label}</span>
    </button>
  );
}

function App() {
  const [screen, setScreen] = useState("website");
  const [session, setSession] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
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
  const HAS_ACCESS = subscriptionStatus === "active";
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
    {
      name: "Maya",
      topic: "Mental Health",
      text: "What helps you reset when anxiety is high?",
      likes: 3,
      liked: false,
      shares: 1,
      replies: [
        { name: "Jordan", text: "A short walk outside and slow breathing helps me reset.", time: "10m ago" }
      ],
      time: "20m ago",
    },
    {
      name: "Jordan",
      topic: "Fitness",
      text: "Today I chose a 15-minute walk instead of skipping movement completely.",
      likes: 5,
      liked: false,
      shares: 2,
      replies: [
        { name: "Maya", text: "That is a real win. Small steps count.", time: "45m ago" }
      ],
      time: "1h ago",
    },
    {
      name: "Chris",
      topic: "Nutrition",
      text: "Share your favorite mood-supporting meal ideas.",
      likes: 4,
      liked: false,
      shares: 0,
      replies: [
        { name: "Maya", text: "Greek yogurt, berries, oats, and water is my go-to.", time: "1h ago" }
      ],
      time: "2h ago",
    },
  ]);

  const [history, setHistory] = useState([
    { date: "Mon", depression: 5, anxiety: 6, stress: 7, motivation: 4, energy: 5, sleep: 6 },
    { date: "Tue", depression: 4, anxiety: 5, stress: 6, motivation: 5, energy: 6, sleep: 7 },
    { date: "Wed", depression: 6, anxiety: 7, stress: 7, motivation: 4, energy: 4, sleep: 5 },
    { date: "Thu", depression: 4, anxiety: 4, stress: 5, motivation: 6, energy: 7, sleep: 7 },
    { date: "Fri", depression: 3, anxiety: 4, stress: 4, motivation: 7, energy: 7, sleep: 8 },
  ]);

  const wellnessScores = useMemo(
    () => ({
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
    }),
    [depression, anxiety, stress, ptsd, traumaStress, motivation, inattention, impulsivity, hyperactivity, energy, sleep, exercise]
  );

  const mode = useMemo(() => getRecommendationCategory(wellnessScores), [wellnessScores]);

  const plan = useMemo(() => buildFitnessRecommendation(wellnessScores), [wellnessScores]);

  const nutritionPlan = useMemo(() => buildNutritionPlan(wellnessScores), [wellnessScores]);

  const therapeuticSuggestion = useMemo(
    () => buildTherapeuticSuggestion(wellnessScores),
    [wellnessScores]
  );


  async function logAppError(source, message, details = {}) {
    try {
      await fetch("/api/log-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: session?.user?.id || null,
          email: session?.user?.email || null,
          source,
          message,
          details,
          page: screen,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.error("Error monitoring failed:", error);
    }
  }

  async function loadAdminStats(currentSession) {
    if (!currentSession?.user?.id) return;

    setAdminLoading(true);
    setAdminError("");

    try {
      const response = await fetch("/api/admin-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: currentSession.user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setAdminError(data.error || "Admin dashboard failed.");
        await logAppError("admin-stats", data.error || "Admin dashboard failed.", data);
        setAdminLoading(false);
        return;
      }

      setAdminStats(data);
    } catch (error) {
      console.error("Admin dashboard connection failed:", error);
      setAdminError("Admin dashboard connection failed.");
      await logAppError("admin-stats", error.message, {});
    }

    setAdminLoading(false);
  }

  async function loadProfile(currentSession) {
    if (!currentSession?.user?.id) {
      setSubscriptionStatus("inactive");
      setIsAdmin(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("subscription_status, is_admin")
      .eq("id", currentSession.user.id)
      .single();

    if (error || !data) {
      setSubscriptionStatus("inactive");
      setIsAdmin(false);
      return;
    }

    setSubscriptionStatus(data.subscription_status || "inactive");
    setIsAdmin(Boolean(data.is_admin));
  }

  async function loadCheckins(currentSession) {
    if (!currentSession?.user?.id) return;

    const { data, error } = await supabase
      .from("checkins")
      .select("*")
      .eq("user_id", currentSession.user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error loading check-ins:", error);
      return;
    }

    if (data && data.length > 0) {
      const formatted = data.map((item) => ({
        date: new Date(item.created_at).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        depression: item.depression ?? 0,
        anxiety: item.anxiety ?? 0,
        stress: item.stress ?? 0,
        ptsd: item.ptsd ?? 0,
        traumaStress: item.trauma_stress ?? 0,
        motivation: item.motivation ?? 0,
        inattention: item.inattention ?? 0,
        impulsivity: item.impulsivity ?? 0,
        hyperactivity: item.hyperactivity ?? 0,
        energy: item.energy ?? 0,
        sleep: item.sleep ?? 0,
        exercise: item.exercise ?? 0,
      }));

      setHistory(formatted);
    }
  }

  async function loadFoodLogs(currentSession) {
    if (!currentSession?.user?.id) return;

    const { data, error } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", currentSession.user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error loading food logs:", error);
      return;
    }

    if (data && data.length > 0) {
      const formatted = data.map((item) => ({
        date: new Date(item.created_at).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        meal: item.meal || "Meal",
        food: item.food || "",
        mood: item.mood || item.mood_after || "Neutral",
        energyAfter: item.energy_after ?? 5,
        notes: item.notes || "",
      }));

      setFoodLog(formatted);
    }
  }

  async function loadCommunityPosts() {
    const { data: postsData, error: postsError } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (postsError) {
      console.error("Error loading community posts:", postsError);
      return;
    }

    const postsWithReplies = await Promise.all(
      (postsData || []).map(async (post) => {
        const { data: repliesData, error: repliesError } = await supabase
          .from("community_replies")
          .select("*")
          .eq("post_id", post.id)
          .order("created_at", { ascending: true });

        if (repliesError) {
          console.error("Error loading replies:", repliesError);
        }

        return {
          id: post.id,
          user_id: post.user_id,
          name: post.name || "User",
          topic: post.topic || "Mental Health",
          text: post.text || "",
          likes: post.likes || 0,
          liked: false,
          shares: post.shares || 0,
          replies: (repliesData || []).map((reply) => ({
            id: reply.id,
            name: reply.name || "User",
            text: reply.text || "",
            time: new Date(reply.created_at).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
          })),
          time: new Date(post.created_at).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
        };
      })
    );

    if (postsWithReplies.length > 0) {
      setPosts(postsWithReplies);
    }
  }

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      await loadProfile(data.session);
      await loadAdminStats(data.session);
      await loadCheckins(data.session);
      await loadFoodLogs(data.session);
      await loadCommunityPosts();
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);

      if (_event === "PASSWORD_RECOVERY") {
        setScreen("auth");
        setAuthMode("updatePassword");
        setAuthMessage("Enter your new password below.");
      }

      await loadProfile(currentSession);
      await loadAdminStats(currentSession);
      await loadCheckins(currentSession);
      await loadFoodLogs(currentSession);
      await loadCommunityPosts();
    });

    return () => subscription.unsubscribe();
  }, []);


  async function handlePasswordResetRequest() {
    setAuthMessage("");

    if (!authEmail) {
      setAuthMessage("Enter your email address first, then click Forgot Password again.");
      return;
    }

    setAuthLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
      redirectTo: "https://www.the-vitamind.com",
    });

    if (error) {
      setAuthMessage(error.message);
    } else {
      setAuthMessage("Password reset email sent. Check your inbox and follow the link.");
    }

    setAuthLoading(false);
  }

  async function handleUpdatePassword() {
    setAuthMessage("");

    if (!newPassword || newPassword.length < 6) {
      setAuthMessage("Enter a new password with at least 6 characters.");
      return;
    }

    setAuthLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setAuthMessage(error.message);
    } else {
      setAuthMessage("Password updated successfully. You can now log in.");
      setNewPassword("");
      setAuthMode("login");
      setScreen("auth");
    }

    setAuthLoading(false);
  }

  async function handleAuth() {
    setAuthMessage("");
    setAuthLoading(true);

    try {
      if (!authEmail || !authPassword) {
        setAuthMessage("Please enter your email and password.");
        setAuthLoading(false);
        return;
      }

      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });

        if (error) {
          setAuthMessage(error.message);
        } else {
          setAuthMessage("Account created. Check your email if confirmation is required, then log in.");
          setAuthMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) {
          setAuthMessage(error.message);
        } else {
          setAuthMessage("");
          const { data } = await supabase.auth.getSession();
          await loadProfile(data.session);

          const { data: profileData } = await supabase
            .from("profiles")
            .select("subscription_status, is_admin")
            .eq("id", data.session?.user?.id)
            .single();

          if (profileData?.subscription_status === "active") {
            setScreen("home");
          } else {
            setScreen("pricing");
          }
        }
      }
    } catch (error) {
      setAuthMessage("Login connection failed.");
    }

    setAuthLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setSubscriptionStatus("inactive");
    setIsAdmin(false);
    setAdminStats(null);
    setScreen("website");
  }

  async function startCheckout() {
    if (!session) {
      setScreen("auth");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Unable to start checkout.");
      }
    } catch (error) {
      alert("Checkout connection failed.");
    }
  }

  async function manageSubscription() {
    if (!session) {
      setScreen("auth");
      return;
    }

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Unable to open billing portal.");
      }
    } catch (error) {
      alert("Billing portal connection failed.");
    }
  }

  async function saveCheckin() {
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

    setHistory((prev) => [entry, ...prev]);

    if (session?.user?.id) {
      const { error } = await supabase.from("checkins").insert({
        user_id: session.user.id,
        depression,
        anxiety,
        stress,
        ptsd,
        trauma_stress: traumaStress,
        motivation,
        inattention,
        impulsivity,
        hyperactivity,
        energy,
        sleep,
        exercise,
      });

      if (error) {
        console.error("Error saving check-in:", error);
        alert("Check-in saved on screen, but it did not save to Supabase.");
      } else {
        await loadCheckins(session);
      }
    }

    setScreen("insights");
  }

  async function addFoodEntry() {
    if (!foodEntry.food.trim()) return;

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const newEntry = {
      date: today,
      meal: foodEntry.meal,
      food: foodEntry.food.trim(),
      mood: foodEntry.mood,
      energyAfter: foodEntry.energyAfter,
      notes: foodEntry.notes.trim(),
    };

    setFoodLog((prev) => [newEntry, ...prev]);

    if (session?.user?.id) {
      const { error } = await supabase.from("food_logs").insert({
        user_id: session.user.id,
        meal: foodEntry.meal,
        food: foodEntry.food.trim(),
        mood: foodEntry.mood,
        mood_after: foodEntry.mood,
        energy_after: foodEntry.energyAfter,
        notes: foodEntry.notes.trim(),
      });

      if (error) {
        console.error("Error saving food log:", error);
        await logAppError("food-log-save", error.message, { foodEntry });
        alert("Food entry saved on screen, but it did not save to Supabase.");
      } else {
        await loadFoodLogs(session);
      }
    }

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
      await logAppError("ai-coach", error.message, { input: text });

      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: "The AI coach is having trouble connecting right now.",
        },
      ]);
    }
  }

  const navItems = [
    ["website", Sparkles, "Home"],
    ["auth", Users, session ? "Account" : "Login"],
    ...(isAdmin ? [["admin", BarChart3, "Admin"]] : []),
    ["home", Home, "Dashboard"],
    ["checkin", Smile, "Check-In"],
    ["progress", BarChart3, "Progress"],
    ["insights", TrendingUp, "Insights"],
    ["foodlog", Utensils, "Food Log"],
    ["coach", MessageCircle, "AI Coach"],
    ["community", Users, "Community"],
    ["pricing", CreditCard, "Subscription"],
    ["support", Mail, "Support"],
    ["legal", ShieldCheck, "Legal"],
  ];

  const bottomTabs = [
    ["home", Home, "Home"],
    ["foodlog", Utensils, "Food"],
    ["checkin", Smile, "Check-In"],
    ["insights", TrendingUp, "Insights"],
    ["community", Users, "Community"],
  ];

  const activeBottomScreen = screen === "website" ? "home" : screen;

  return (
    <div className="min-h-screen bg-[#001B44] text-slate-900 md:bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_28%),linear-gradient(135deg,#001B44,#002B6B,#0047AB)]">
      <div className="mx-auto max-w-6xl px-3 pb-28 pt-3 md:p-8">
        <header className="sticky top-0 z-30 mb-4 rounded-b-[2rem] border border-white/20 bg-[#001B44]/90 px-3 py-3 text-white shadow-lg shadow-blue-950/30 backdrop-blur md:static md:mb-6 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo compact />
              <div>
                <h1 className="text-xl font-black leading-tight md:text-3xl" style={{ color: NAVY }}>
                  Vitamind
                </h1>
                <p className="text-xs text-blue-100 md:text-sm">
                  {session ? "Your wellness dashboard" : "Wellness connected"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreen(session ? "auth" : "auth")}
                className="rounded-full border border-white/30 bg-white/15 px-3 py-2 text-xs font-bold text-white backdrop-blur hover:bg-white/25 md:px-4 md:text-sm"
              >
                {session ? "Account" : "Login"}
              </button>
              {session && (
                <button
                  onClick={handleLogout}
                  className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-[#003C8F] shadow-sm hover:bg-blue-50 md:block"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-4">
          <nav className="hidden h-fit rounded-[2rem] border border-white/30 bg-[#003C8F]/90 p-3 shadow-xl shadow-blue-950/30 backdrop-blur ring-1 ring-white/20 md:col-span-1 md:block">
            {navItems.map(([key, Icon, label]) => (
              <button
                key={key}
                onClick={() => setScreen(key)}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                  screen === key
                    ? "bg-white text-[#003C8F] shadow-md shadow-blue-950/20"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <Icon size={19} /> {label}
              </button>
            ))}
          </nav>

          <main className="md:col-span-3 pb-36 md:pb-0">
            <div className="space-y-5 rounded-[2rem] md:rounded-none">
              {screen === "website" && <Website setScreen={setScreen} startCheckout={startCheckout}
                  manageSubscription={manageSubscription} />}
              {screen === "auth" && (
                <AuthScreen
                  session={session}
                  authMode={authMode}
                  setAuthMode={setAuthMode}
                  authEmail={authEmail}
                  setAuthEmail={setAuthEmail}
                  authPassword={authPassword}
                  setAuthPassword={setAuthPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  authMessage={authMessage}
                  authLoading={authLoading}
                  handleAuth={handleAuth}
                  handleLogout={handleLogout}
                  subscriptionStatus={subscriptionStatus}
                  startCheckout={startCheckout}
                  manageSubscription={manageSubscription}
                  handlePasswordResetRequest={handlePasswordResetRequest}
                  handleUpdatePassword={handleUpdatePassword}
                />
              )}
              {screen === "admin" && isAdmin && (
                <AdminDashboard
                  adminStats={adminStats}
                  adminLoading={adminLoading}
                  adminError={adminError}
                  loadAdminStats={() => loadAdminStats(session)}
                />
              )}
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
              {screen === "insights" && HAS_ACCESS && (
                <Insights
                  history={history}
                  foodLog={foodLog}
                  setScreen={setScreen}
                  fitnessPlan={plan}
                  nutritionPlan={nutritionPlan}
                  therapeuticSuggestion={therapeuticSuggestion}
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
              {screen === "community" && HAS_ACCESS && <Community posts={posts} setPosts={setPosts} session={session} loadCommunityPosts={loadCommunityPosts} history={history} foodLog={foodLog} />}
              {screen === "pricing" && <Pricing subscribed={subscribed} setSubscribed={setSubscribed} startCheckout={startCheckout} manageSubscription={manageSubscription} session={session} subscriptionStatus={subscriptionStatus} />}
              {screen === "legal" && <LegalHub setScreen={setScreen} />}
              {screen === "privacy" && <PrivacyPolicy />}
              {screen === "terms" && <TermsOfService />}
              {screen === "disclaimer" && <MedicalDisclaimer />}
              {screen === "subscriptionPolicy" && <SubscriptionPolicy />}
              {screen === "support" && <Support />}

              {!HAS_ACCESS &&
                screen !== "website" &&
                screen !== "pricing" &&
                screen !== "auth" &&
                screen !== "legal" &&
                screen !== "privacy" &&
                screen !== "terms" &&
                screen !== "disclaimer" &&
                screen !== "subscriptionPolicy" &&
                screen !== "admin" && (
                  <Card className="p-8 text-center md:p-10">
                    <h2 className="mb-4 text-3xl font-black text-blue-700 md:text-4xl">
                      Unlock Vitamind Premium
                    </h2>

                    <p className="mb-8 text-base text-slate-600 md:text-lg">
                      Log in and subscribe to access AI coaching, wellness tracking, personalized insights,
                      food logs, therapeutic suggestions, and community features.
                    </p>

                    <button
                      onClick={startCheckout}
                      className="inline-block rounded-full bg-[#1D7CFF] px-8 py-4 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#0B63CE]"
                    >
                      Start 7-Day Free Trial
                    </button>
                  </Card>
                )}
            </div>
          </main>
        </div>

        <div className="hidden md:block">
          <Footer setScreen={setScreen} />
        </div>
      </div>

      <div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
        <div
          className="rounded-[28px] border border-white/20 bg-[#001B44]/95 shadow-2xl shadow-blue-950/40 backdrop-blur"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
        >
          <div className="grid grid-cols-5 items-end gap-1 px-2 pt-3">
            <MobileNavButton
              active={activeBottomScreen === "home"}
              onClick={() => setScreen("home")}
              icon={Home}
              label="Home"
            />

            <MobileNavButton
              active={activeBottomScreen === "foodlog"}
              onClick={() => setScreen("foodlog")}
              icon={Utensils}
              label="Food"
            />

            <button
              onClick={() => setScreen("checkin")}
              className="-mt-10 flex flex-col items-center justify-center active:scale-95 transition"
              aria-label="Start check-in"
            >
              <div className="h-20 w-20 rounded-full bg-[#1D7CFF] text-white flex items-center justify-center shadow-2xl shadow-blue-900/40 border-4 border-white">
                <Smile size={36} strokeWidth={2.6} />
              </div>

              <span className="mt-1 text-sm font-black text-white">Check-In</span>
            </button>

            <MobileNavButton
              active={activeBottomScreen === "insights"}
              onClick={() => setScreen("insights")}
              icon={TrendingUp}
              label="Insights"
            />

            <MobileNavButton
              active={activeBottomScreen === "community"}
              onClick={() => setScreen("community")}
              icon={Users}
              label="Community"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


function AdminDashboard({ adminStats, adminLoading, adminError, loadAdminStats }) {
  const stats = adminStats || {
    totalUsers: 0,
    activeSubscribers: 0,
    monthlyRevenue: 0,
    checkinsToday: 0,
    foodLogsToday: 0,
    communityPostsToday: 0,
    errorsToday: 0,
    latestErrors: [],
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-8 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
        <p className="text-blue-100 font-semibold mb-2">Vitamind Admin</p>
        <h2 className="text-5xl font-black mb-4">Admin Dashboard</h2>
        <p className="text-blue-50 text-lg max-w-3xl">
          Monitor users, subscribers, activity, estimated revenue, and app errors.
        </p>

        <button
          onClick={loadAdminStats}
          className="mt-5 rounded-2xl bg-white text-blue-700 px-5 py-3 font-bold hover:bg-blue-50 transition"
        >
          {adminLoading ? "Refreshing..." : "Refresh Stats"}
        </button>
      </Card>

      {adminError && (
        <Card className="p-5 border-red-200 bg-red-50">
          <p className="font-black text-red-700">Admin Error</p>
          <p className="text-red-600">{adminError}</p>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Metric icon={Users} label="Total Users" value={stats.totalUsers} color="text-blue-600" bg="bg-blue-50" />
        <Metric icon={CreditCard} label="Active Subscribers" value={stats.activeSubscribers} color="text-teal-600" bg="bg-teal-50" />
        <Metric icon={TrendingUp} label="Est. Monthly Revenue" value={`$${Number(stats.monthlyRevenue || 0).toFixed(2)}`} color="text-green-600" bg="bg-green-50" />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Metric icon={Smile} label="Check-ins Today" value={stats.checkinsToday} color="text-indigo-600" bg="bg-indigo-50" />
        <Metric icon={Utensils} label="Food Logs Today" value={stats.foodLogsToday} color="text-orange-600" bg="bg-orange-50" />
        <Metric icon={MessageCircle} label="Community Posts Today" value={stats.communityPostsToday} color="text-purple-600" bg="bg-purple-50" />
        <Metric icon={ShieldCheck} label="Errors Today" value={stats.errorsToday} color="text-red-600" bg="bg-red-50" />
      </div>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">Latest Error Reports</h3>

        {stats.latestErrors && stats.latestErrors.length > 0 ? (
          <div className="space-y-3">
            {stats.latestErrors.map((error, i) => (
              <div key={error.id || i} className="rounded-2xl bg-red-50 border border-red-100 p-4">
                <div className="flex flex-wrap justify-between gap-2 mb-1">
                  <p className="font-black text-red-700">{error.source || "App Error"}</p>
                  <p className="text-xs text-slate-500">
                    {error.created_at ? new Date(error.created_at).toLocaleString() : ""}
                  </p>
                </div>

                <p className="text-sm text-slate-700">{error.message}</p>
                {error.email && <p className="text-xs text-slate-500 mt-1">User: {error.email}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No error reports yet.</p>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-3">Admin Notes</h3>
        <p className="text-slate-600">
          Monthly revenue is estimated from active subscribers multiplied by $19.99/month.
          Stripe remains the source of truth for exact revenue, refunds, trials, and cancellations.
        </p>
      </Card>
    </motion.div>
  );
}


function AuthScreen({
  session,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  newPassword,
  setNewPassword,
  authMessage,
  authLoading,
  handleAuth,
  handleLogout,
  subscriptionStatus,
  startCheckout,
  manageSubscription,
  handlePasswordResetRequest,
  handleUpdatePassword,
}) {
  if (authMode === "updatePassword") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <Card className="p-8 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
          <p className="text-blue-100 font-semibold mb-2">Reset Password</p>
          <h2 className="text-5xl font-black mb-4">Create a new password</h2>
          <p className="text-blue-50 text-lg max-w-3xl">
            Enter a new password for your Vitamind account.
          </p>
        </Card>

        <Card className="p-6 max-w-xl mx-auto">
          <label className="block font-bold mb-2">New Password</label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="Enter new password"
            className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 mb-5"
          />

          <Button onClick={handleUpdatePassword} className="w-full">
            {authLoading ? "Updating..." : "Update Password"}
          </Button>

          <button
            onClick={() => setAuthMode("login")}
            className="block mx-auto mt-4 text-sm font-bold text-blue-600 hover:underline"
          >
            Back to login
          </button>

          {authMessage && (
            <p className="mt-4 text-center text-sm font-semibold text-blue-700">
              {authMessage}
            </p>
          )}
        </Card>
      </motion.div>
    );
  }

  if (session) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-8 text-center">
          <h2 className="text-4xl font-black mb-3 text-blue-700">Account Active</h2>
          <p className="text-slate-600 mb-3">
            You are logged in as <strong>{session.user.email}</strong>.
          </p>

          <p className="text-slate-600 mb-6">
            Subscription status: <strong>{subscriptionStatus}</strong>
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {subscriptionStatus !== "active" && (
              <Button onClick={startCheckout}>
                Subscribe Now
              </Button>
            )}

            {subscriptionStatus === "active" && (
              <Button onClick={manageSubscription} variant="secondary">
                Manage / Cancel Subscription
              </Button>
            )}

            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-8 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
        <p className="text-blue-100 font-semibold mb-2">Vitamind Account</p>
        <h2 className="text-5xl font-black mb-4">
          {authMode === "signup" ? "Create your account" : authMode === "forgot" ? "Reset your password" : "Welcome back"}
        </h2>
        <p className="text-blue-50 text-lg max-w-3xl">
          {authMode === "forgot"
            ? "Enter your email address and we will send you a password reset link."
            : "Log in to access Vitamind Premium features, save your wellness history, food logs, and AI coaching experience."}
        </p>
      </Card>

      <Card className="p-6 max-w-xl mx-auto">
        <div className="flex gap-2 mb-6 rounded-2xl bg-blue-50 p-2">
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 rounded-xl px-4 py-3 font-bold transition ${
              authMode === "login" ? "bg-blue-600 text-white" : "text-blue-700"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setAuthMode("signup")}
            className={`flex-1 rounded-xl px-4 py-3 font-bold transition ${
              authMode === "signup" ? "bg-blue-600 text-white" : "text-blue-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <label className="block font-bold mb-2">Email</label>
        <input
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 mb-4"
        />

        {authMode !== "forgot" && (
          <>
            <label className="block font-bold mb-2">Password</label>
            <input
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 mb-3"
            />

            {authMode === "login" && (
              <button
                onClick={() => {
                  setAuthMode("forgot");
                }}
                className="mb-5 text-sm font-bold text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            )}
          </>
        )}

        {authMode === "forgot" ? (
          <>
            <Button onClick={handlePasswordResetRequest} className="w-full">
              {authLoading ? "Sending..." : "Send Password Reset Email"}
            </Button>

            <button
              onClick={() => setAuthMode("login")}
              className="block mx-auto mt-4 text-sm font-bold text-blue-600 hover:underline"
            >
              Back to login
            </button>
          </>
        ) : (
          <Button onClick={handleAuth} className="w-full">
            {authLoading ? "Please wait..." : authMode === "signup" ? "Create Account" : "Login"}
          </Button>
        )}

        {authMessage && (
          <p className="mt-4 text-center text-sm font-semibold text-blue-700">
            {authMessage}
          </p>
        )}

        <p className="text-xs text-slate-500 mt-5 text-center">
          Need help? Contact customerservicethevitamind@gmail.com.
        </p>
      </Card>
    </motion.div>
  );
}


function Website({ setScreen, startCheckout }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="p-8 md:p-12 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20 overflow-hidden relative">
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

      <Card className="p-6 md:p-8 bg-white border border-white/30">
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

      <Card className="p-6 md:p-8 bg-white">
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

        <button
          onClick={startCheckout}
          className="inline-block rounded-2xl px-8 py-4 font-bold bg-[#1D7CFF] text-white hover:bg-[#0B63CE] shadow-lg shadow-blue-900/20 transition"
        >
          Start 7-Day Free Trial
        </button>
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
      <Card className="p-6 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
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
        <Action title="Fitness Insight" icon={Dumbbell} text={`${plan.time}: ${plan.items[0]}`} onClick={() => setScreen("insights")} />
        <Action title="Nutrition Insight" icon={Apple} text={nutritionPlan.focus} onClick={() => setScreen("insights")} />
        <Action title="Talk to AI Coach" icon={MessageCircle} text="Ask for support based on your mood and stress." onClick={() => setScreen("coach")} />
        <Action title="Insights Dashboard" icon={TrendingUp} text="See trends from check-ins, sleep, exercise, and food logs." onClick={() => setScreen("insights")} />
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


function Insights({ history, foodLog, setScreen, fitnessPlan, nutritionPlan, therapeuticSuggestion }) {
  const safeHistory = Array.isArray(history) ? history : [];
  const safeFoodLog = Array.isArray(foodLog) ? foodLog : [];

  const recent = safeHistory.slice(0, 7);

  const avg = (key) => {
    const valid = recent
      .map((item) => Number(item[key]))
      .filter((value) => !Number.isNaN(value));

    if (!valid.length) return 0;

    return Math.round((valid.reduce((sum, value) => sum + value, 0) / valid.length) * 10) / 10;
  };

  const latest = recent[0] || {};
  const oldest = recent[recent.length - 1] || {};

  const trend = (key, lowerIsBetter = false) => {
    if (!latest[key] || !oldest[key] || recent.length < 2) return "Not enough data yet";

    const change = Number(latest[key]) - Number(oldest[key]);

    if (change === 0) return "Stable";

    const improved = lowerIsBetter ? change < 0 : change > 0;

    return improved
      ? `Improved by ${Math.abs(change)}`
      : `Changed by ${Math.abs(change)}`;
  };

  const highEnergyFoods = safeFoodLog
    .filter((item) => Number(item.energyAfter) >= 7)
    .slice(0, 5);

  const lowEnergyFoods = safeFoodLog
    .filter((item) => Number(item.energyAfter) <= 4)
    .slice(0, 5);

  const averageFoodEnergy =
    safeFoodLog.length > 0
      ? Math.round(
          (safeFoodLog.reduce((sum, item) => sum + Number(item.energyAfter || 0), 0) /
            safeFoodLog.length) *
            10
        ) / 10
      : 0;

  const percentChange = (key, lowerIsBetter = false) => {
    if (!latest[key] || !oldest[key] || recent.length < 2) return null;

    const start = Number(oldest[key]);
    const end = Number(latest[key]);

    if (!start || Number.isNaN(start) || Number.isNaN(end)) return null;

    const rawChange = ((end - start) / start) * 100;
    const improved = lowerIsBetter ? rawChange < 0 : rawChange > 0;

    return {
      percent: Math.round(Math.abs(rawChange)),
      improved,
      direction: rawChange > 0 ? "increased" : rawChange < 0 ? "decreased" : "stayed stable",
    };
  };

  const compareAverage = (items, key, filterKey, threshold, comparison = "gte") => {
    const filtered = items.filter((item) => {
      const filterValue = Number(item[filterKey]);
      return comparison === "gte" ? filterValue >= threshold : filterValue <= threshold;
    });

    if (!filtered.length) return null;

    const values = filtered
      .map((item) => Number(item[key]))
      .filter((value) => !Number.isNaN(value));

    if (!values.length) return null;

    return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
  };

  const anxietyChange = percentChange("anxiety", true);
  const depressionChange = percentChange("depression", true);
  const stressChange = percentChange("stress", true);
  const sleepChange = percentChange("sleep", false);
  const exerciseChange = percentChange("exercise", false);

  const avgAnxietyHighSleep = compareAverage(recent, "anxiety", "sleep", 7, "gte");
  const avgAnxietyLowSleep = compareAverage(recent, "anxiety", "sleep", 6, "lte");
  const avgStressHighExercise = compareAverage(recent, "stress", "exercise", 6, "gte");
  const avgStressLowExercise = compareAverage(recent, "stress", "exercise", 4, "lte");

  const foodMoodCounts = safeFoodLog.reduce((acc, item) => {
    const mood = item.mood || "Neutral";
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const topFoodMood = Object.entries(foodMoodCounts).sort((a, b) => b[1] - a[1])[0];

  const sleepInsight =
    avg("sleep") >= 7
      ? "Your recent sleep average is in a strong range. Keep protecting your sleep routine."
      : avg("sleep") > 0
      ? "Your recent sleep average is below 7 hours. Recovery, mood, and energy may improve with more consistent sleep."
      : "Add more check-ins to generate sleep insights.";

  const exerciseInsight =
    avg("exercise") >= 6
      ? "Your recent exercise consistency is strong. This may support mood, energy, and stress regulation."
      : avg("exercise") > 0
      ? "Your exercise consistency has room to grow. Start small with walks, stretching, or short workouts."
      : "Add exercise ratings in check-ins to generate activity insights.";

  const stressInsight =
    avg("stress") >= 7 || avg("anxiety") >= 7
      ? "Stress or anxiety has been elevated recently. Recovery-based workouts, steady meals, and breathing skills may help."
      : avg("stress") > 0
      ? "Your recent stress and anxiety averages are not in the highest range. Keep tracking patterns."
      : "Add more check-ins to generate stress insights.";

  const trendCards = [
    {
      title: "Anxiety Trend",
      text: anxietyChange
        ? `Your anxiety ${anxietyChange.direction} by about ${anxietyChange.percent}% across your recent check-ins.`
        : "Add more check-ins to calculate anxiety trend changes.",
      status: anxietyChange?.improved ? "Improving" : anxietyChange ? "Watch" : "Needs Data",
    },
    {
      title: "Mood Trend",
      text: depressionChange
        ? `Your depression rating ${depressionChange.direction} by about ${depressionChange.percent}% across your recent check-ins.`
        : "Add more check-ins to calculate mood trend changes.",
      status: depressionChange?.improved ? "Improving" : depressionChange ? "Watch" : "Needs Data",
    },
    {
      title: "Stress Trend",
      text: stressChange
        ? `Your stress ${stressChange.direction} by about ${stressChange.percent}% across your recent check-ins.`
        : "Add more check-ins to calculate stress trend changes.",
      status: stressChange?.improved ? "Improving" : stressChange ? "Watch" : "Needs Data",
    },
    {
      title: "Sleep Trend",
      text: sleepChange
        ? `Your sleep ${sleepChange.direction} by about ${sleepChange.percent}% across your recent check-ins.`
        : "Add more check-ins to calculate sleep trend changes.",
      status: sleepChange?.improved ? "Improving" : sleepChange ? "Watch" : "Needs Data",
    },
    {
      title: "Exercise Trend",
      text: exerciseChange
        ? `Your exercise rating ${exerciseChange.direction} by about ${exerciseChange.percent}% across your recent check-ins.`
        : "Add more check-ins to calculate exercise trend changes.",
      status: exerciseChange?.improved ? "Improving" : exerciseChange ? "Watch" : "Needs Data",
    },
    {
      title: "Food Energy Pattern",
      text:
        averageFoodEnergy > 0
          ? `Your average energy after meals is ${averageFoodEnergy}/10. High-energy foods are being tracked for better nutrition suggestions.`
          : "Add food logs to calculate food and energy patterns.",
      status: averageFoodEnergy >= 7 ? "Strong" : averageFoodEnergy > 0 ? "Building" : "Needs Data",
    },
  ];

  const correlationNotes = [
    avgAnxietyHighSleep !== null && avgAnxietyLowSleep !== null
      ? `On higher-sleep days, your average anxiety was ${avgAnxietyHighSleep}/10 compared with ${avgAnxietyLowSleep}/10 on lower-sleep days.`
      : "Add more sleep ratings to compare sleep and anxiety patterns.",
    avgStressHighExercise !== null && avgStressLowExercise !== null
      ? `On higher-exercise days, your average stress was ${avgStressHighExercise}/10 compared with ${avgStressLowExercise}/10 on lower-exercise days.`
      : "Add more exercise ratings to compare exercise and stress patterns.",
    topFoodMood
      ? `Your most common mood after eating is ${topFoodMood[0]}, appearing in ${topFoodMood[1]} food log entries.`
      : "Add food logs to identify your most common mood after eating.",
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
        <p className="text-blue-100 font-semibold mb-2">Vitamind Insights</p>
        <h2 className="text-4xl md:text-5xl font-black mb-3">Your Wellness Patterns</h2>
        <p className="text-blue-50 max-w-3xl">
          Insights use your saved check-ins and food logs to help you understand patterns in mood, sleep, exercise, energy, and nutrition.
        </p>

        <div className="flex flex-wrap gap-3 mt-5">
          <Button onClick={() => setScreen("checkin")} variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
            Add Check-In
          </Button>
          <Button onClick={() => setScreen("foodlog")} variant="secondary" className="bg-blue-900/30 text-white hover:bg-blue-900/40">
            Add Food Log
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Metric icon={Waves} label="Avg Anxiety" value={`${avg("anxiety")}/10`} color="text-sky-600" bg="bg-sky-50" />
        <Metric icon={Brain} label="Avg Depression" value={`${avg("depression")}/10`} color="text-indigo-600" bg="bg-indigo-50" />
        <Metric icon={Moon} label="Avg Sleep" value={`${avg("sleep")} hrs`} color="text-blue-600" bg="bg-blue-50" />
        <Metric icon={Activity} label="Avg Exercise" value={`${avg("exercise")}/10`} color="text-teal-600" bg="bg-teal-50" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 border-2 border-blue-100">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Dumbbell className="text-blue-600" />
          </div>
          <p className="text-blue-600 font-black uppercase text-sm mb-1">Fitness Recommendation</p>
          <h3 className="text-2xl font-black mb-2">{fitnessPlan?.title}</h3>
          <p className="text-slate-600 mb-3">{fitnessPlan?.focus || fitnessPlan?.note}</p>
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 mb-3">
            <p className="font-black text-blue-700 mb-2">Today’s Movement Plan • {fitnessPlan?.time}</p>
            <ul className="space-y-1 text-sm text-slate-700">
              {(fitnessPlan?.items || []).map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-slate-500">{fitnessPlan?.note}</p>
        </Card>

        <Card className="p-6 border-2 border-blue-100">
          <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
            <Apple className="text-sky-600" />
          </div>
          <p className="text-blue-600 font-black uppercase text-sm mb-1">Nutrition Recommendation</p>
          <h3 className="text-2xl font-black mb-2">{nutritionPlan?.title}</h3>
          <p className="text-slate-600 mb-3">{nutritionPlan?.focus}</p>
          <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4 mb-3">
            <p className="font-black text-sky-700 mb-2">Suggested Meals</p>
            <ul className="space-y-1 text-sm text-slate-700">
              {(nutritionPlan?.meals || []).slice(0, 4).map((meal, i) => (
                <li key={i}>• {meal}</li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-slate-500">{nutritionPlan?.hydration}</p>
        </Card>

        <Card className="p-6 border-2 border-blue-100 md:col-span-1">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <Brain className="text-indigo-600" />
          </div>
          <p className="text-blue-600 font-black uppercase text-sm mb-1">Expanded Therapeutic Plan</p>
          <h3 className="text-2xl font-black mb-1">{therapeuticSuggestion?.planTitle}</h3>
          <p className="text-sm font-bold text-indigo-700 mb-2">
            {therapeuticSuggestion?.therapy} • {therapeuticSuggestion?.primaryConcern}
          </p>
          <p className="text-slate-600 mb-3">{therapeuticSuggestion?.why}</p>

          <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 mb-3">
            <p className="font-black text-indigo-700 mb-2">Skill: {therapeuticSuggestion?.skill}</p>
            <ul className="space-y-1 text-sm text-slate-700">
              {(therapeuticSuggestion?.steps || []).map((step, i) => (
                <li key={i}>• {step}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 mb-3">
            <p className="font-black text-blue-700 mb-1">Action Step</p>
            <p className="text-sm text-slate-700">{therapeuticSuggestion?.actionStep}</p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 p-4 mb-3">
            <p className="font-black text-slate-900 mb-1">Reflection Question</p>
            <p className="text-sm text-slate-700">{therapeuticSuggestion?.reflection}</p>
          </div>

          <p className="text-sm italic text-slate-600 mb-4">“{therapeuticSuggestion?.prompt}”</p>
          <Button onClick={() => setScreen("coach")} variant="secondary" className="w-full">
            Ask AI Coach for More
          </Button>
        </Card>
      </div>

      <Card className="p-6 border-2 border-indigo-100 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-blue-600 font-black uppercase text-sm mb-1">Therapy Library</p>
            <h3 className="text-3xl font-black">Recommended Techniques for This Check-In</h3>
          </div>
          <span className="rounded-full bg-indigo-50 text-indigo-700 px-4 py-2 text-xs font-black">
            Personalized
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {(therapeuticSuggestion?.library || []).map((item) => (
            <div key={item.therapy} className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <p className="font-black text-indigo-700 mb-1">{item.therapy}</p>
              <p className="text-sm text-slate-600 mb-3">{item.bestFor}</p>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-white text-slate-700 border border-indigo-100 px-3 py-1 text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-2 border-blue-200 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-blue-600 font-black uppercase text-sm mb-1">AI Trend Intelligence</p>
            <h3 className="text-3xl font-black">Automatic Pattern Detection</h3>
          </div>

          <Button onClick={() => setScreen("coach")} variant="secondary">
            Ask AI About Trends
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {trendCards.map((card, i) => (
            <div key={i} className="rounded-2xl bg-white border border-blue-100 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-black text-slate-900">{card.title}</h4>
                <span className={`text-xs font-black rounded-full px-3 py-1 ${
                  card.status === "Improving"
                    ? "bg-green-100 text-green-700"
                    : card.status === "Watch"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {card.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-blue-600 text-white p-5">
          <h4 className="text-xl font-black mb-3">Pattern Connections</h4>
          <div className="space-y-2 text-blue-50">
            {correlationNotes.map((note, i) => (
              <p key={i}>• {note}</p>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-2xl font-black mb-4">7-Day Trend Snapshot</h3>

          <div className="space-y-3">
            <InsightRow label="Anxiety" value={trend("anxiety", true)} />
            <InsightRow label="Depression" value={trend("depression", true)} />
            <InsightRow label="Stress" value={trend("stress", true)} />
            <InsightRow label="Sleep" value={trend("sleep", false)} />
            <InsightRow label="Exercise" value={trend("exercise", false)} />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-white/30">
          <h3 className="text-2xl font-black mb-4">Personalized Wellness Notes</h3>

          <div className="space-y-3 text-slate-700">
            <p>💤 {sleepInsight}</p>
            <p>🏃 {exerciseInsight}</p>
            <p>🧠 {stressInsight}</p>
            <p>
              🍎 {averageFoodEnergy > 0
                ? `Your average food-related energy rating is ${averageFoodEnergy}/10.`
                : "Add food logs to generate nutrition energy insights."}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-2xl font-black mb-4">Check-In Pattern Grid</h3>

        {recent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {recent.map((item, i) => (
              <div key={`${item.date}-${i}`} className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-center">
                <p className="text-xs text-slate-500 font-bold mb-2">{item.date}</p>
                <p className="text-sm text-slate-700">Anx {item.anxiety ?? "-"}</p>
                <p className="text-sm text-slate-700">Mood {item.depression ?? "-"}</p>
                <p className="text-sm text-slate-700">Sleep {item.sleep ?? "-"}</p>
                <p className="text-sm text-slate-700">Ex {item.exercise ?? "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No check-ins yet. Add a check-in to begin building insights.</p>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-2xl font-black mb-4 text-green-700">Foods Supporting Energy</h3>

          {highEnergyFoods.length > 0 ? (
            <div className="space-y-3">
              {highEnergyFoods.map((item, i) => (
                <div key={`${item.date}-high-${i}`} className="rounded-2xl bg-green-50 border border-green-100 p-4">
                  <p className="font-black">{item.meal}</p>
                  <p className="text-slate-700">{item.food}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Mood: {item.mood} • Energy: {item.energyAfter}/10
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No high-energy food patterns yet. Keep logging meals.</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-black mb-4 text-orange-700">Foods to Review</h3>

          {lowEnergyFoods.length > 0 ? (
            <div className="space-y-3">
              {lowEnergyFoods.map((item, i) => (
                <div key={`${item.date}-low-${i}`} className="rounded-2xl bg-orange-50 border border-orange-100 p-4">
                  <p className="font-black">{item.meal}</p>
                  <p className="text-slate-700">{item.food}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Mood: {item.mood} • Energy: {item.energyAfter}/10
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No low-energy meal patterns yet.</p>
          )}
        </Card>
      </div>

      <Card className="p-6 text-center border-2 border-blue-200">
        <h3 className="text-2xl font-black mb-3">Ask AI About These Insights</h3>
        <p className="text-slate-600 mb-5">
          Your AI Coach can now use recent check-ins, food logs, trend changes, sleep patterns, and exercise ratings to explain patterns and suggest practical next steps.
        </p>
        <Button onClick={() => setScreen("coach")}>
          Ask AI Coach
        </Button>
      </Card>
    </motion.div>
  );
}

function InsightRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3">
      <span className="font-bold text-slate-700">{label}</span>
      <span className="font-black text-blue-700">{value}</span>
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
      <Card className="p-6 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
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
      <Card className="p-6 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
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
      <Card className="p-6 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
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



function buildFoodMoodSuggestions(foodLog = [], currentMood = "Neutral") {
  const mood = currentMood || "Neutral";
  const normalized = mood.toLowerCase();

  const suggestionMap = {
    calm: {
      title: "Keep the Calm Going",
      foods: ["Salmon or turkey with rice and greens", "Greek yogurt with berries", "Chamomile tea and a magnesium-rich snack"],
      avoid: "Try not to overload caffeine or high-sugar snacks if you are already feeling balanced.",
      why: "Your mood entry suggests your body responded well to steady, balanced fuel."
    },
    focused: {
      title: "Focus-Supporting Food Ideas",
      foods: ["Eggs with oatmeal and berries", "Chicken bowl with rice, vegetables, and avocado", "Cottage cheese or Greek yogurt with fruit"],
      avoid: "Avoid skipping your next meal, because low blood sugar can make focus harder.",
      why: "Protein plus slow-digesting carbs can help keep energy and attention more stable."
    },
    neutral: {
      title: "Balanced Mood Meal Suggestions",
      foods: ["Lean protein, colorful vegetables, and a healthy carb", "Turkey wrap with fruit and water", "Smoothie with protein, berries, and oats"],
      avoid: "Avoid all-or-nothing eating. Aim for consistency instead of perfection.",
      why: "A neutral mood is a good time to build repeatable habits that support tomorrow’s energy."
    },
    tired: {
      title: "Low-Energy Food Support",
      foods: ["Oatmeal with banana and protein", "Chicken soup with rice and vegetables", "Eggs, toast, fruit, and water"],
      avoid: "Limit heavy greasy meals and late caffeine if sleep has been low.",
      why: "Tired mood entries often pair well with hydration, protein, and gentle complex carbs."
    },
    sluggish: {
      title: "Beat Sluggish Energy",
      foods: ["Grilled chicken salad with sweet potato", "Tuna or turkey wrap with fruit", "Protein smoothie with spinach and berries"],
      avoid: "Review large high-sugar or high-fat meals if they repeatedly show up before sluggish entries.",
      why: "Your log can help identify meals that weigh you down versus meals that keep energy steady."
    },
    anxious: {
      title: "Anxiety-Calming Food Ideas",
      foods: ["Turkey, rice, vegetables, and water", "Greek yogurt with berries and oats", "Banana with peanut butter or almonds"],
      avoid: "Consider reducing excess caffeine, energy drinks, and skipped meals on anxious days.",
      why: "Steady meals may help reduce physical stress signals that can intensify anxiety."
    },
    energized: {
      title: "Fuel the Momentum",
      foods: ["Lean protein bowl with rice, vegetables, and avocado", "Eggs, oats, berries, and water", "Protein snack before or after movement"],
      avoid: "Avoid under-eating on high-output days. Energy needs fuel to stay stable.",
      why: "When energy is strong, balanced nutrition can help sustain it without a crash."
    },
  };

  const base = suggestionMap[normalized] || suggestionMap.neutral;

  const supportiveFoods = foodLog
    .filter((item) => Number(item.energyAfter) >= 7 || ["Calm", "Focused", "Energized"].includes(item.mood))
    .slice(0, 3);

  const reviewFoods = foodLog
    .filter((item) => Number(item.energyAfter) <= 4 || ["Tired", "Sluggish", "Anxious"].includes(item.mood))
    .slice(0, 3);

  return {
    ...base,
    supportiveFoods,
    reviewFoods,
  };
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

  const moodFoodSuggestion = buildFoodMoodSuggestions(foodLog, foodEntry.mood);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
        <p className="text-blue-100 font-semibold mb-2">Food Tracking</p>
        <h2 className="text-4xl font-black mb-3">Daily Food Log</h2>
        <p className="text-blue-50 max-w-2xl">
          Track what you eat, how it affects your mood, and your energy after meals. Vitamind can use this pattern to help improve your nutrition suggestions.
        </p>
      </Card>

      <Card className="p-6 border-2 border-white bg-white">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
            <Apple className="text-blue-600" />
          </div>
          <div>
            <p className="text-blue-600 font-black uppercase text-sm mb-1">Mood-Based Food Suggestion</p>
            <h3 className="text-2xl font-black mb-2">{moodFoodSuggestion.title}</h3>
            <p className="text-slate-600">{moodFoodSuggestion.why}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {moodFoodSuggestion.foods.map((food, i) => (
            <div key={i} className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
              <p className="font-bold text-slate-800">{food}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-white border border-blue-100 p-4 shadow-sm">
          <p className="font-black text-blue-700 mb-1">Helpful Reminder</p>
          <p className="text-sm text-slate-600">{moodFoodSuggestion.avoid}</p>
        </div>
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

      <Card className="p-6 bg-white border-2 border-blue-100">
        <h3 className="text-2xl font-black mb-4">Food Tracking Summary</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <h4 className="font-black text-blue-700 mb-2">Foods that may support you</h4>
            {moodFoodSuggestion.supportiveFoods.length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-700">
                {moodFoodSuggestion.supportiveFoods.map((item, i) => (
                  <li key={i}>✓ {item.food} — Mood: {item.mood}, Energy: {item.energyAfter}/10</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 text-sm">Add more food logs to find your best supportive meals.</p>
            )}
          </div>
          <div className="rounded-2xl bg-white border border-blue-100 p-4 shadow-sm">
            <h4 className="font-black text-blue-700 mb-2">Foods to watch for patterns</h4>
            {moodFoodSuggestion.reviewFoods.length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-700">
                {moodFoodSuggestion.reviewFoods.map((item, i) => (
                  <li key={i}>• {item.food} — Mood: {item.mood}, Energy: {item.energyAfter}/10</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 text-sm">No concerning food patterns yet. Keep tracking meals and mood.</p>
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
      <Card className="p-8 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
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

        <Card className="p-6 bg-white border border-white/30">
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




function LegalHub({ setScreen }) {
  const legalPages = [
    {
      title: "Privacy Policy",
      description: "How Vitamind collects, uses, protects, and manages user information.",
      screen: "privacy",
      icon: ShieldCheck,
    },
    {
      title: "Terms of Service",
      description: "Rules, account responsibilities, acceptable use, and community standards.",
      screen: "terms",
      icon: ShieldCheck,
    },
    {
      title: "Medical Disclaimer",
      description: "Important information explaining that Vitamind is not medical care or crisis support.",
      screen: "disclaimer",
      icon: Brain,
    },
    {
      title: "Subscription Policy",
      description: "Free trial, billing, cancellation, refunds, and subscription access information.",
      screen: "subscriptionPolicy",
      icon: CreditCard,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-8 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
        <p className="text-blue-100 font-semibold mb-2">Vitamind Legal Center</p>
        <h2 className="text-5xl font-black mb-4">Legal Information</h2>
        <p className="text-blue-50 text-lg max-w-3xl">
          Review Vitamind's policies, terms, subscription information, and wellness disclaimer in one place.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {legalPages.map((page) => {
          const Icon = page.icon;

          return (
            <Card key={page.screen} className="p-6 hover:shadow-md transition">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Icon className="text-blue-600" />
              </div>

              <h3 className="text-2xl font-black mb-2">{page.title}</h3>
              <p className="text-slate-600 mb-5">{page.description}</p>

              <Button onClick={() => setScreen(page.screen)} className="w-full">
                View {page.title}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 text-center border-2 border-blue-200">
        <h3 className="text-2xl font-black mb-2">Need Help?</h3>
        <p className="text-slate-600 mb-4">
          Contact Vitamind support for questions about accounts, subscriptions, billing, or policies.
        </p>
        <Button onClick={() => setScreen("support")} variant="secondary">
          Contact Support
        </Button>
      </Card>
    </motion.div>
  );
}


function LegalPage({ title, subtitle, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-8 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
        <p className="text-blue-100 font-semibold mb-2">Vitamind Legal Information</p>
        <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
        <p className="text-blue-50 text-lg max-w-3xl">{subtitle}</p>
      </Card>

      <Card className="p-6 md:p-8">
        <div className="prose prose-slate max-w-none">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}

function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How Vitamind collects, uses, protects, and manages user information."
    >
      <p className="text-sm text-slate-500 mb-6">
        <strong>Effective Date:</strong> June 2026
      </p>

      <h3 className="text-2xl font-black mb-3">Information We Collect</h3>
      <p className="text-slate-700 mb-4">
        Vitamind may collect account information such as name, email address, login details,
        mental wellness check-in responses, fitness information, food log entries, community
        posts, support requests, and subscription information.
      </p>

      <h3 className="text-2xl font-black mb-3">How We Use Information</h3>
      <p className="text-slate-700 mb-4">
        We use information to provide personalized wellness recommendations, AI coaching,
        progress tracking, food pattern insights, customer support, subscription access,
        and platform improvements.
      </p>

      <h3 className="text-2xl font-black mb-3">Payments</h3>
      <p className="text-slate-700 mb-4">
        Payment information is processed by Stripe. Vitamind does not store full credit card
        information on its servers.
      </p>

      <h3 className="text-2xl font-black mb-3">Third-Party Services</h3>
      <p className="text-slate-700 mb-4">
        Vitamind may use third-party services including Supabase, Stripe, OpenAI, and hosting
        providers to operate the platform.
      </p>

      <h3 className="text-2xl font-black mb-3">Data Requests</h3>
      <p className="text-slate-700 mb-4">
        Users may request account deletion, data correction, or data removal by contacting
        customer support.
      </p>

      <p className="font-bold text-blue-700">
        Contact: customerservicethevitamind@gmail.com
      </p>
    </LegalPage>
  );
}

function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="Rules and expectations for using the Vitamind platform."
    >
      <p className="text-sm text-slate-500 mb-6">
        <strong>Effective Date:</strong> June 2026
      </p>

      <h3 className="text-2xl font-black mb-3">Eligibility</h3>
      <p className="text-slate-700 mb-4">
        Users must be at least 18 years old to use Vitamind.
      </p>

      <h3 className="text-2xl font-black mb-3">Account Responsibility</h3>
      <p className="text-slate-700 mb-4">
        Users are responsible for maintaining account security and all activity that occurs
        under their account.
      </p>

      <h3 className="text-2xl font-black mb-3">Acceptable Use</h3>
      <p className="text-slate-700 mb-4">
        Users may not harass others, post harmful or illegal content, misuse AI features,
        attempt unauthorized access, or disrupt platform operations.
      </p>

      <h3 className="text-2xl font-black mb-3">Community Guidelines</h3>
      <p className="text-slate-700 mb-4">
        Community spaces are intended for respectful, supportive conversation. Vitamind may
        remove content or restrict accounts that violate community standards.
      </p>

      <h3 className="text-2xl font-black mb-3">Service Changes</h3>
      <p className="text-slate-700 mb-4">
        Vitamind may modify, update, suspend, or discontinue features at any time.
      </p>

      <h3 className="text-2xl font-black mb-3">Limitation of Liability</h3>
      <p className="text-slate-700 mb-4">
        Vitamind is provided as-is without warranties of any kind. To the fullest extent
        permitted by law, Vitamind is not liable for indirect, incidental, or consequential damages.
      </p>

      <p className="font-bold text-blue-700">
        Contact: customerservicethevitamind@gmail.com
      </p>
    </LegalPage>
  );
}

function MedicalDisclaimer() {
  return (
    <LegalPage
      title="Medical Disclaimer"
      subtitle="Important information about the wellness and AI guidance provided by Vitamind."
    >
      <h3 className="text-2xl font-black mb-3">Not Medical Advice</h3>
      <p className="text-slate-700 mb-4">
        Vitamind is not a healthcare provider. Information, check-ins, food suggestions,
        fitness recommendations, and AI responses are for educational and wellness support
        purposes only and are not medical advice.
      </p>

      <h3 className="text-2xl font-black mb-3">No Clinical Relationship</h3>
      <p className="text-slate-700 mb-4">
        Use of Vitamind does not create a therapist-client, physician-patient, dietitian-client,
        or other licensed healthcare relationship.
      </p>

      <h3 className="text-2xl font-black mb-3">Emergency Situations</h3>
      <p className="text-slate-700 mb-4">
        If you are experiencing suicidal thoughts, thoughts of harming yourself or others, a
        medical emergency, or a mental health crisis, call 911, your local emergency number,
        or the 988 Suicide & Crisis Lifeline immediately.
      </p>

      <h3 className="text-2xl font-black mb-3">Professional Guidance</h3>
      <p className="text-slate-700 mb-4">
        Always consult qualified healthcare professionals before making medical, psychiatric,
        fitness, or nutrition decisions.
      </p>

      <h3 className="text-2xl font-black mb-3">AI Limitations</h3>
      <p className="text-slate-700 mb-4">
        AI-generated responses may contain errors or incomplete information and should not
        be used as a sole source of health guidance.
      </p>
    </LegalPage>
  );
}

function SubscriptionPolicy() {
  return (
    <LegalPage
      title="Subscription & Cancellation Policy"
      subtitle="Information about Vitamind Premium billing, cancellation, and access."
    >
      <h3 className="text-2xl font-black mb-3">Free Trial</h3>
      <p className="text-slate-700 mb-4">
        New users may receive a 7-day free trial when offered during checkout.
      </p>

      <h3 className="text-2xl font-black mb-3">Subscription Pricing</h3>
      <p className="text-slate-700 mb-4">
        Current pricing is displayed during Stripe checkout and may be updated periodically.
      </p>

      <h3 className="text-2xl font-black mb-3">Automatic Renewal</h3>
      <p className="text-slate-700 mb-4">
        Subscriptions automatically renew unless canceled before the next billing cycle.
      </p>

      <h3 className="text-2xl font-black mb-3">Cancellation</h3>
      <p className="text-slate-700 mb-4">
        Users may request cancellation support by emailing customerservicethevitamind@gmail.com.
        Active subscribers can manage or cancel billing directly through the Stripe customer portal from the Subscription page.
      </p>

      <h3 className="text-2xl font-black mb-3">Refunds</h3>
      <p className="text-slate-700 mb-4">
        Unless otherwise required by law, subscription payments are non-refundable.
      </p>

      <h3 className="text-2xl font-black mb-3">Access After Cancellation</h3>
      <p className="text-slate-700 mb-4">
        Users may retain access through the end of the paid billing period. After expiration,
        premium features may become unavailable.
      </p>

      <p className="font-bold text-blue-700">
        Contact: customerservicethevitamind@gmail.com
      </p>
    </LegalPage>
  );
}

function Footer({ setScreen }) {
  return (
    <footer className="mt-8 rounded-3xl bg-white border border-blue-100 p-5 shadow-sm text-center">
      <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-blue-700 mb-3">
        <button onClick={() => setScreen("legal")} className="hover:underline">Legal Center</button>
        <button onClick={() => setScreen("support")} className="hover:underline">Contact Support</button>
      </div>

      <p className="text-xs text-slate-500">
        Vitamind is a wellness support platform and does not replace medical, mental health, fitness, or nutrition care from qualified professionals.
      </p>

      <p className="text-xs text-slate-500 mt-2">
        Support: customerservicethevitamind@gmail.com
      </p>
    </footer>
  );
}


function Pricing({ subscribed, setSubscribed, startCheckout, manageSubscription, session, subscriptionStatus }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 text-white border-none shadow-2xl shadow-blue-950/20">
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
          <button
            onClick={startCheckout}
            className="block w-full text-center rounded-2xl px-4 py-4 font-semibold bg-[#1D7CFF] text-white hover:bg-[#0B63CE] shadow-lg shadow-blue-900/20 transition"
          >
            {session ? "Start 7-Day Free Trial" : "Login to Start Free Trial"}
          </button>

          {session && subscriptionStatus === "active" && (
            <button
              onClick={manageSubscription}
              className="mt-3 block w-full text-center rounded-2xl px-4 py-4 font-semibold bg-white text-[#003C8F] hover:bg-blue-50 shadow-sm transition border border-blue-200"
            >
              Manage / Cancel Subscription
            </button>
          )}
          {subscribed && <p className="mt-4 text-center text-sm font-bold text-blue-700">Free trial active in prototype.</p>}
        </Card>
      </div>
    </motion.div>
  );
}

function Community({ posts, setPosts, session, loadCommunityPosts, history = [], foodLog = [] }) {
  const [postText, setPostText] = useState("");
  const [topic, setTopic] = useState("Mental Health");
  const [postType, setPostType] = useState("Discussion");
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [openReplies, setOpenReplies] = useState({});
  const [shareNotice, setShareNotice] = useState("");
  const [moderationNotice, setModerationNotice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTopic, setActiveTopic] = useState("Feed");
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [dailyAnswer, setDailyAnswer] = useState("");
  const [showDailyAnswerBox, setShowDailyAnswerBox] = useState(false);

  const communityCategories = [
    "Feed",
    "Mental Health",
    "Anxiety",
    "Depression",
    "ADHD",
    "PTSD & Trauma",
    "Fitness",
    "Nutrition",
    "Relationships",
    "Faith",
    "Success Stories",
    "Questions & Support",
    "Wellness Wins",
    "Challenges",
  ];

  const dailyQuestions = [
    "What coping skill helped you today?",
    "What is one small win you can celebrate today?",
    "What helped your anxiety, stress, or mood feel even 1% better?",
    "What healthy meal or snack gave you better energy today?",
    "What is one thing you are proud of this week?",
    "What helped you stay consistent when motivation was low?",
    "What is one supportive thing you can tell yourself today?",
  ];

  const todayQuestion = dailyQuestions[Math.floor(Date.now() / 86400000) % dailyQuestions.length];

  const challenges = [
    { name: "7-Day Check-In Challenge", emoji: "🧠", goal: "Complete one mental health check-in daily.", topic: "Challenges" },
    { name: "7-Day Walking Challenge", emoji: "🚶", goal: "Walk at least 10 minutes each day.", topic: "Fitness" },
    { name: "7-Day Hydration Challenge", emoji: "💧", goal: "Drink water with each meal.", topic: "Nutrition" },
    { name: "7-Day Gratitude Challenge", emoji: "🙏", goal: "Write one gratitude statement daily.", topic: "Mental Health" },
    { name: "7-Day Sleep Reset", emoji: "🌙", goal: "Create a calmer wind-down routine.", topic: "Challenges" },
  ];

  const wellnessWins = [
    "I completed my check-in today.",
    "I practiced a coping skill today.",
    "I moved my body even when I did not feel like it.",
    "I ate something that supported my energy today.",
    "I chose progress over perfection today.",
  ];

  const reactions = [
    { key: "support", label: "Support", emoji: "❤️" },
    { key: "strong", label: "Strong Work", emoji: "💪" },
    { key: "relate", label: "Relate", emoji: "🤝" },
    { key: "celebrate", label: "Celebrate", emoji: "🎉" },
    { key: "helpful", label: "Helpful", emoji: "🧠" },
    { key: "encourage", label: "Encouraging", emoji: "🙏" },
  ];

  const trendingTopics = [
    { tag: "#AnxietySupport", label: "Anxiety", description: "Tools for anxious days", search: "anxiety" },
    { tag: "#ADHDTips", label: "ADHD", description: "Focus, planning, and routines", search: "ADHD" },
    { tag: "#TraumaRecovery", label: "PTSD & Trauma", description: "Grounding and safety skills", search: "grounding" },
    { tag: "#WellnessWins", label: "Wellness Wins", description: "Celebrate small progress", search: "win" },
    { tag: "#MoodMeals", label: "Nutrition", description: "Food and mood patterns", search: "meal" },
  ];

  const suggestedGroups = [
    { name: "Anxiety Support", topic: "Anxiety", members: "2.1k members" },
    { name: "ADHD Success", topic: "ADHD", members: "1.8k members" },
    { name: "Trauma Recovery", topic: "PTSD & Trauma", members: "1.2k members" },
    { name: "Fitness Accountability", topic: "Fitness", members: "4.3k members" },
    { name: "Mood-Based Nutrition", topic: "Nutrition", members: "1.4k members" },
    { name: "Faith & Wellness", topic: "Faith", members: "900 members" },
  ];

  const checkinStreak = Array.isArray(history) ? Math.min(history.length, 30) : 0;
  const foodLogStreak = Array.isArray(foodLog) ? Math.min(foodLog.length, 30) : 0;
  const communityStreak = Array.isArray(posts) ? Math.min(posts.filter((p) => p.name === (session?.user?.email?.split("@")[0] || "You")).length, 30) : 0;

  const filteredPosts = posts.filter((post) => {
    const matchesTopic = activeTopic === "Feed" || post.topic === activeTopic || post.postType === activeTopic;
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      post.text?.toLowerCase().includes(search) ||
      post.topic?.toLowerCase().includes(search) ||
      post.name?.toLowerCase().includes(search) ||
      post.postType?.toLowerCase().includes(search) ||
      (Array.isArray(post.replies) && post.replies.some((reply) => reply.text?.toLowerCase().includes(search)));
    return matchesTopic && matchesSearch;
  });

  function moderateText(text) {
    const lower = text.toLowerCase();
    const crisisTerms = ["kill myself", "suicide", "end my life", "hurt myself", "self harm", "self-harm"];
    const abuseTerms = ["idiot", "stupid", "hate you", "shut up", "loser"];
    const spamTerms = ["buy now", "click here", "free money", "crypto"];

    if (crisisTerms.some((term) => lower.includes(term))) {
      return {
        allowed: false,
        message: "This post may include crisis language. If you or someone else may be in danger, call 911 or 988 now. Please reach out for immediate support.",
      };
    }

    if (abuseTerms.some((term) => lower.includes(term))) {
      return { allowed: false, message: "AI moderation blocked this post because it may be hurtful or attacking. Please rewrite it with supportive language." };
    }

    if (spamTerms.some((term) => lower.includes(term))) {
      return { allowed: false, message: "AI moderation blocked this post because it looks like spam or promotion." };
    }

    return { allowed: true, message: "AI moderation passed: supportive and safe to post." };
  }

  async function addPost(customText = null, customTopic = null, customType = null) {
    const finalText = (customText || postText).trim();
    const finalTopic = customTopic || topic;
    const finalType = customType || postType;

    if (!finalText) return;

    const moderation = moderateText(finalText);
    setModerationNotice(moderation.message);

    if (!moderation.allowed) return;

    const displayName = postAnonymously ? "Anonymous Member" : session?.user?.email?.split("@")[0] || "You";

    const newPost = {
      name: displayName,
      topic: finalTopic,
      postType: finalType,
      text: finalText,
      likes: 0,
      liked: false,
      shares: 0,
      reactions: {},
      userReaction: null,
      anonymous: postAnonymously,
      replies: [],
      time: "Just now",
    };

    setPosts((prev) => [newPost, ...prev]);

    if (session?.user?.id) {
      const { error } = await supabase.from("community_posts").insert({
        user_id: session.user.id,
        name: displayName,
        topic: finalTopic,
        text: finalType === "Discussion" ? finalText : `[${finalType}] ${finalText}`,
        likes: 0,
        shares: 0,
      });

      if (error) {
        console.error("Error saving community post:", error);
        alert("Post showed on screen, but did not save to Supabase.");
      } else {
        await loadCommunityPosts();
      }
    }

    setPostText("");
    setPostType("Discussion");
    setPostAnonymously(false);
    setActiveTopic("Feed");
  }

  async function reactToPost(post, reactionKey) {
    const originalIndex = posts.findIndex((item) => item.id === post.id || item === post);
    if (originalIndex === -1) return;

    const reaction = reactions.find((item) => item.key === reactionKey);
    const previousReaction = post.userReaction;
    const nextReactions = { ...(post.reactions || {}) };

    if (previousReaction) {
      nextReactions[previousReaction] = Math.max((nextReactions[previousReaction] || 1) - 1, 0);
    }

    const sameReaction = previousReaction === reactionKey;
    const newReaction = sameReaction ? null : reactionKey;

    if (!sameReaction) {
      nextReactions[reactionKey] = (nextReactions[reactionKey] || 0) + 1;
    }

    const reactionTotal = Object.values(nextReactions).reduce((sum, value) => sum + Number(value || 0), 0);

    setPosts((prev) =>
      prev.map((item, i) =>
        i === originalIndex
          ? {
              ...item,
              reactions: nextReactions,
              userReaction: newReaction,
              likes: reactionTotal,
              liked: Boolean(newReaction),
            }
          : item
      )
    );

    if (post.id) {
      await supabase.from("community_posts").update({ likes: reactionTotal }).eq("id", post.id);
    }

    if (reaction && !sameReaction) {
      setShareNotice(`${reaction.emoji} ${reaction.label} reaction added`);
      setTimeout(() => setShareNotice(""), 1800);
    }
  }

  function toggleReplies(postKey) {
    setOpenReplies((prev) => ({ ...prev, [postKey]: !prev[postKey] }));
  }

  async function addReply(postKey, post) {
    const text = replyText[postKey];
    if (!text || !text.trim()) return;

    const moderation = moderateText(text);
    setModerationNotice(moderation.message);
    if (!moderation.allowed) return;

    const newReply = {
      name: session?.user?.email?.split("@")[0] || "You",
      text: text.trim(),
      time: "Just now",
    };

    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id || item === post
          ? { ...item, replies: [...(Array.isArray(item.replies) ? item.replies : []), newReply] }
          : item
      )
    );

    if (session?.user?.id && post.id) {
      const { error } = await supabase.from("community_replies").insert({
        post_id: post.id,
        user_id: session.user.id,
        name: session.user.email?.split("@")[0] || "User",
        text: text.trim(),
      });

      if (error) {
        console.error("Error saving reply:", error);
        alert("Reply showed on screen, but did not save to Supabase.");
      } else {
        await loadCommunityPosts();
      }
    }

    setReplyText((prev) => ({ ...prev, [postKey]: "" }));
  }

  async function sharePost(post) {
    const originalIndex = posts.findIndex((item) => item.id === post.id || item === post);
    const newShares = (post.shares || 0) + 1;

    if (originalIndex !== -1) {
      setPosts((prev) => prev.map((item, i) => (i === originalIndex ? { ...item, shares: newShares } : item)));
    }

    if (post.id) {
      await supabase.from("community_posts").update({ shares: newShares }).eq("id", post.id);
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: "Vitamind Community", text: post.text, url: window.location.href });
      } catch (error) {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${post.text}\n\nShared from Vitamind Community`);
    }

    setShareNotice("Post shared/copied successfully.");
    setTimeout(() => setShareNotice(""), 2500);
  }

  function selectTrendingTopic(item) {
    setActiveTopic(item.label);
    setSearchTerm(item.search);
  }

  function toggleJoinGroup(groupName) {
    setJoinedGroups((prev) => (prev.includes(groupName) ? prev.filter((item) => item !== groupName) : [...prev, groupName]));
  }

  function toggleChallenge(challengeName) {
    setJoinedChallenges((prev) =>
      prev.includes(challengeName) ? prev.filter((item) => item !== challengeName) : [...prev, challengeName]
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card className="p-6 bg-gradient-to-br from-[#0047AB] via-[#0067D8] to-[#003C8F] text-white border-none shadow-2xl shadow-blue-950/20">
        <p className="text-blue-100 font-semibold mb-2">Vitamind Community</p>
        <h2 className="text-4xl font-black mb-3">Support, wins, challenges, and accountability</h2>
        <p className="text-blue-50 max-w-3xl">
          Connect with others around mental health, fitness, nutrition, relationships, faith, coping skills, and daily wellness wins.
        </p>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 border-2 border-blue-100">
          <p className="text-blue-600 font-black uppercase text-xs mb-1">Daily Wellness Question</p>
          <h3 className="text-xl font-black mb-3">{todayQuestion}</h3>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setShowDailyAnswerBox(true);
              setPostType("Question Response");
              setTopic("Questions & Support");
            }}
          >
            Answer Today’s Question
          </Button>

          {showDailyAnswerBox && (
            <div className="mt-4 space-y-3">
              <textarea
                value={dailyAnswer}
                onChange={(e) => setDailyAnswer(e.target.value)}
                placeholder="Share your answer with the community..."
                className="w-full min-h-[120px] rounded-2xl border border-blue-100 px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
              />

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!dailyAnswer.trim()) {
                      setModerationNotice("Please write an answer before continuing.");
                      return;
                    }

                    setPostText(`${todayQuestion}

${dailyAnswer.trim()}`);
                    setPostType("Question Response");
                    setTopic("Questions & Support");
                    setActiveTopic("Questions & Support");
                    setDailyAnswer("");
                    setShowDailyAnswerBox(false);

                    setTimeout(() => {
                      const composer = document.getElementById("community-post-composer");
                      if (composer) {
                        composer.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, 100);
                  }}
                >
                  Continue
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setDailyAnswer("");
                    setShowDailyAnswerBox(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-5 border-2 border-green-100">
          <p className="text-green-600 font-black uppercase text-xs mb-1">Streak System</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-green-50 p-3"><p className="text-2xl font-black">🔥{checkinStreak}</p><p className="text-xs text-slate-600">Check-ins</p></div>
            <div className="rounded-2xl bg-blue-50 p-3"><p className="text-2xl font-black">🥗{foodLogStreak}</p><p className="text-xs text-slate-600">Food logs</p></div>
            <div className="rounded-2xl bg-purple-50 p-3"><p className="text-2xl font-black">🤝{communityStreak}</p><p className="text-xs text-slate-600">Posts</p></div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-indigo-100">
          <p className="text-indigo-600 font-black uppercase text-xs mb-1">AI Moderation</p>
          <h3 className="text-xl font-black mb-2">Safety Scan Active</h3>
          <p className="text-sm text-slate-600">Posts and replies are checked for crisis language, bullying, harassment, and spam before posting.</p>
        </Card>
      </div>

      {moderationNotice && (
        <div className="rounded-2xl bg-white border border-blue-100 px-5 py-3 font-semibold text-slate-700 shadow-sm">
          {moderationNotice}
        </div>
      )}

      {shareNotice && (
        <div className="rounded-2xl bg-blue-600 text-white px-5 py-3 font-semibold shadow-sm">
          {shareNotice}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-5">
        <div className="space-y-4 lg:col-span-1">
          <Card className="p-5">
            <h3 className="font-black text-lg mb-3">Categories</h3>
            <div className="space-y-2 text-sm font-semibold text-slate-700 max-h-[430px] overflow-auto pr-1">
              {communityCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => { setActiveTopic(item); setSearchTerm(""); }}
                  className={`w-full text-left rounded-xl px-3 py-2 transition ${activeTopic === item ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
                >
                  {item === "Feed" && "👥 "}
                  {item === "Anxiety" && "🌊 "}
                  {item === "Depression" && "☁️ "}
                  {item === "ADHD" && "⚡ "}
                  {item === "PTSD & Trauma" && "🛡️ "}
                  {item === "Fitness" && "💪 "}
                  {item === "Nutrition" && "🍎 "}
                  {item === "Relationships" && "💬 "}
                  {item === "Faith" && "🙏 "}
                  {item === "Success Stories" && "🌟 "}
                  {item === "Questions & Support" && "❓ "}
                  {item === "Wellness Wins" && "🏆 "}
                  {item === "Challenges" && "🔥 "}
                  {item === "Mental Health" && "🧠 "}
                  {item}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-black text-lg mb-3">Wellness Wins</h3>
            <div className="space-y-2">
              {wellnessWins.map((win) => (
                <button
                  key={win}
                  onClick={() => addPost(win, "Wellness Wins", "Wellness Win")}
                  className="w-full text-left rounded-2xl bg-green-50 hover:bg-green-100 border border-green-100 p-3 text-sm font-semibold text-slate-700"
                >
                  🏆 {win}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-black">
                {postAnonymously ? "A" : session?.user?.email?.[0]?.toUpperCase() || "V"}
              </div>
              <div className="flex-1">
                <textarea
                  id="community-post-composer"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share a wellness win, ask for support, answer the daily question, or check in on a challenge..."
                  className="w-full min-h-[110px] rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-xl border border-blue-100 px-3 py-2 text-sm outline-none">
                    {communityCategories.filter((item) => item !== "Feed").map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <select value={postType} onChange={(e) => setPostType(e.target.value)} className="rounded-xl border border-blue-100 px-3 py-2 text-sm outline-none">
                    <option>Discussion</option>
                    <option>Question</option>
                    <option>Wellness Win</option>
                    <option>Challenge Check-In</option>
                    <option>Support Request</option>
                  </select>
                </div>
                <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <input type="checkbox" checked={postAnonymously} onChange={(e) => setPostAnonymously(e.target.checked)} />
                    Post anonymously
                  </label>
                  <Button onClick={() => addPost()}>Create Post</Button>
                </div>
              </div>
            </div>
          </Card>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search community..."
            className="w-full rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white/90">
              Showing {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"}
              {activeTopic !== "Feed" ? ` in ${activeTopic}` : ""}
              {searchTerm ? ` matching "${searchTerm}"` : ""}
            </p>
            {(activeTopic !== "Feed" || searchTerm) && (
              <button onClick={() => { setActiveTopic("Feed"); setSearchTerm(""); }} className="text-sm font-bold text-white hover:underline">
                Reset feed
              </button>
            )}
          </div>

          {filteredPosts.length === 0 && (
            <Card className="p-6 text-center">
              <h3 className="text-2xl font-black mb-2">No posts found</h3>
              <p className="text-slate-600">Try another category, search term, or create the first post.</p>
            </Card>
          )}

          {filteredPosts.map((post, i) => {
            const repliesArray = Array.isArray(post.replies) ? post.replies : [];
            const postKey = post.id || `${post.name}-${post.time}-${i}`;
            const postReactions = post.reactions || {};
            const totalReactions = Object.values(postReactions).reduce((sum, value) => sum + Number(value || 0), Number(post.likes || 0));

            return (
              <Card key={postKey} className="p-5 rounded-3xl">
                <div className="flex justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black">
                      {post.anonymous ? "A" : post.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="font-black">{post.anonymous ? "Anonymous Member" : post.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs font-bold text-blue-600 uppercase">{post.topic}</span>
                        <span className="text-xs font-bold text-slate-500">{post.postType || "Discussion"}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{post.time}</p>
                </div>

                <p className="text-slate-700 whitespace-pre-wrap">{post.text}</p>

                <div className="mt-3 text-sm text-slate-500">
                  {totalReactions} reactions • {repliesArray.length} replies • {(post.shares || 0)} shares
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.key}
                      onClick={() => reactToPost(post, reaction.key)}
                      className={`rounded-full px-3 py-2 text-xs font-bold border transition ${
                        post.userReaction === reaction.key
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50"
                      }`}
                    >
                      {reaction.emoji} {reaction.label} {postReactions[reaction.key] ? `(${postReactions[reaction.key]})` : ""}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <button onClick={() => toggleReplies(postKey)} className="text-slate-600 hover:text-blue-600 font-semibold">
                    💬 Reply ({repliesArray.length})
                  </button>
                  <button onClick={() => sharePost(post)} className="text-slate-600 hover:text-blue-600 font-semibold">
                    ↗ Share ({post.shares || 0})
                  </button>
                </div>

                {openReplies[postKey] && (
                  <div className="mt-4 space-y-3">
                    {repliesArray.map((reply, replyIndex) => (
                      <div key={`${reply.id || reply.name}-${replyIndex}`} className="rounded-2xl bg-blue-50 p-3">
                        <p className="font-bold text-sm">{reply.name}</p>
                        <p className="text-slate-700 text-sm">{reply.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{reply.time}</p>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        value={replyText[postKey] || ""}
                        onChange={(e) => setReplyText((prev) => ({ ...prev, [postKey]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") addReply(postKey, post); }}
                        placeholder="Write a supportive reply..."
                        className="flex-1 rounded-2xl border border-blue-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <Button onClick={() => addReply(postKey, post)}>Reply</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Card className="p-5">
            <h3 className="font-black text-lg mb-4">Community Challenges</h3>
            <div className="space-y-3">
              {challenges.map((challenge) => {
                const joined = joinedChallenges.includes(challenge.name);
                return (
                  <div key={challenge.name} className="rounded-2xl bg-blue-50 border border-blue-100 p-3">
                    <p className="font-black">{challenge.emoji} {challenge.name}</p>
                    <p className="text-sm text-slate-600 mb-3">{challenge.goal}</p>
                    <div className="flex gap-2">
                      <Button variant={joined ? "primary" : "secondary"} className="py-2 px-3" onClick={() => toggleChallenge(challenge.name)}>
                        {joined ? "Joined" : "Join"}
                      </Button>
                      <Button variant="secondary" className="py-2 px-3" onClick={() => addPost(`Checking in for: ${challenge.name}. ${challenge.goal}`, "Challenges", "Challenge Check-In")}>
                        Check In
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-black text-lg mb-4">Trending Topics</h3>
            <div className="space-y-3 text-sm">
              {trendingTopics.map((item) => (
                <button key={item.tag} onClick={() => selectTrendingTopic(item)} className="w-full text-left rounded-2xl bg-blue-50 p-3 hover:bg-blue-100 transition">
                  <p className="font-black text-sky-700">{item.tag}</p>
                  <p className="text-slate-500">{item.description}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-black text-lg mb-3">Suggested Groups</h3>
            <div className="space-y-3">
              {suggestedGroups.map((group) => {
                const joined = joinedGroups.includes(group.name);
                return (
                  <div key={group.name} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{group.name}</p>
                      <p className="text-xs text-slate-500">{group.members}</p>
                      <p className="text-xs text-blue-600 font-bold">{group.topic}</p>
                    </div>
                    <Button variant={joined ? "primary" : "secondary"} className="py-2 px-3" onClick={() => toggleJoinGroup(group.name)}>
                      {joined ? "Joined" : "Join"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
