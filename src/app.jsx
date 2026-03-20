import { useState, useEffect, useCallback, useRef } from "react";

const PHASES = {
  PRE: "pre",
  SURGERY: "surgery",
  POST1: "post1",
  POST2: "post2",
  DONE: "done",
  FUTURE: "future",
};

const PHASE_META = {
  [PHASES.PRE]: { label: "Preoperatorio", color: "#7F77DD", bg: "#EEEDFE", dark: "#3C3489", emoji: "🍲" },
  [PHASES.SURGERY]: { label: "Cirugía", color: "#E24B4A", bg: "#FCEBEB", dark: "#791F1F", emoji: "🏥" },
  [PHASES.POST1]: { label: "Post-op Fase 1", color: "#1D9E75", bg: "#E1F5EE", dark: "#085041", emoji: "💧" },
  [PHASES.POST2]: { label: "Post-op Fase 2", color: "#378ADD", bg: "#E6F1FB", dark: "#0C447C", emoji: "🥛" },
  [PHASES.DONE]: { label: "Completado", color: "#639922", bg: "#EAF3DE", dark: "#27500A", emoji: "✅" },
  [PHASES.FUTURE]: { label: "Próximamente", color: "#888780", bg: "#F1EFE8", dark: "#444441", emoji: "📅" },
};

const PRE_MEALS = [
  { time: "08:00", name: "Desayuno", desc: "Yoghurt/Leche Protein + huevo o quesillo (80g)", icon: "🥚" },
  { time: "10:30", name: "Colación AM", desc: "Batido proteico o 2 jaleas proteicas", icon: "🥤" },
  { time: "13:00", name: "Almuerzo", desc: "Papilla 200-250cc (proteína + verduras + caldo)", icon: "🍲" },
  { time: "16:00", name: "Once", desc: "Compota de fruta licuada + jalea proteica", icon: "🍎" },
  { time: "19:00", name: "Cena", desc: "Papilla 200-250cc (similar al almuerzo)", icon: "🍲" },
  { time: "21:30", name: "Colación PM", desc: "Yoghurt / Leche / Jalea Protein", icon: "🥛" },
];

const POST1_MEALS = [
  { time: "08:00", name: "Desayuno", desc: "100cc Té clarito (NO cargado)", icon: "🍵" },
  { time: "10:00", name: "Colación", desc: "100cc Jalea sin azúcar", icon: "🟢" },
  { time: "12:00", name: "Colación", desc: "100cc Té de hierbas", icon: "🌿" },
  { time: "14:00", name: "Almuerzo", desc: "100-150cc Consomé filtrado", icon: "🍲" },
  { time: "16:00", name: "Colación", desc: "100cc Jalea sin azúcar", icon: "🟢" },
  { time: "18:00", name: "Once", desc: "100cc Té clarito", icon: "🍵" },
  { time: "20:00", name: "Cena", desc: "100-150cc Consomé filtrado", icon: "🍲" },
  { time: "22:00", name: "Colación nocturna", desc: "100cc Jalea sin azúcar", icon: "🟢" },
];

const POST2_MEALS = [
  { time: "08:00", name: "Desayuno", desc: "100-150cc Leche descremada sin lactosa Protein", icon: "🥛" },
  { time: "10:00", name: "Colación", desc: "100cc Batido proteico (½ scoop)", icon: "🥤" },
  { time: "12:00", name: "Colación", desc: "100cc Leche descremada sin lactosa Protein", icon: "🥛" },
  { time: "14:00", name: "Almuerzo", desc: "100-150cc Consomé filtrado", icon: "🍲" },
  { time: "16:00", name: "Colación", desc: "100-150cc Shot o Leche Protein", icon: "🥛" },
  { time: "18:00", name: "Once", desc: "100-150cc Leche descremada sin lactosa Protein", icon: "🥛" },
  { time: "20:00", name: "Cena", desc: "100-150cc Consomé filtrado", icon: "🍲" },
  { time: "22:00", name: "Colación nocturna", desc: "100cc Batido proteico (½ scoop)", icon: "🥤" },
];

const HYDRATION_TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"];

function getDaysBetween(d1, d2) {
  const a = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const b = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((b - a) / 86400000);
}

function getPhaseForDay(dayOffset) {
  if (dayOffset >= -5 && dayOffset <= -1) return PHASES.PRE;
  if (dayOffset === 0) return PHASES.SURGERY;
  if (dayOffset >= 1 && dayOffset <= 2) return PHASES.POST1;
  if (dayOffset >= 3 && dayOffset <= 7) return PHASES.POST2;
  if (dayOffset > 7) return PHASES.DONE;
  return PHASES.FUTURE;
}

function getMealsForPhase(phase) {
  if (phase === PHASES.PRE) return PRE_MEALS;
  if (phase === PHASES.POST1) return POST1_MEALS;
  if (phase === PHASES.POST2) return POST2_MEALS;
  return [];
}

function getDayLabel(offset) {
  if (offset < 0) return `Día ${offset}`;
  if (offset === 0) return "Cirugía";
  return `Día +${offset}`;
}

function formatDate(d) {
  const days = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function getStorageKey(surgeryDate, dayOffset, type) {
  return `gabi_${surgeryDate}_d${dayOffset}_${type}`;
}

export default function App() {
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [dateInput, setDateInput] = useState("");
  const [view, setView] = useState("today");
  const [checkedMeals, setCheckedMeals] = useState({});
  const [checkedHydration, setCheckedHydration] = useState({});
  const [notes, setNotes] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [notifPermission, setNotifPermission] = useState("default");
  const [remindersActive, setRemindersActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage?.getItem?.("gabi_surgery_date");
      if (saved) { setSurgeryDate(saved); setDateInput(saved); }
    } catch {}
  }, []);

  useEffect(() => {
    if (!surgeryDate) return;
    try {
      for (let d = -5; d <= 7; d++) {
        const mk = getStorageKey(surgeryDate, d, "meals");
        const hk = getStorageKey(surgeryDate, d, "hydration");
        const nk = getStorageKey(surgeryDate, d, "notes");
        const ms = localStorage?.getItem?.(mk);
        const hs = localStorage?.getItem?.(hk);
        const ns = localStorage?.getItem?.(nk);
        if (ms) setCheckedMeals((p) => ({ ...p, [d]: JSON.parse(ms) }));
        if (hs) setCheckedHydration((p) => ({ ...p, [d]: JSON.parse(hs) }));
        if (ns) setNotes((p) => ({ ...p, [d]: ns }));
      }
    } catch {}
  }, [surgeryDate]);

  const persist = useCallback((dayOffset, type, data) => {
    if (!surgeryDate) return;
    try {
      const key = getStorageKey(surgeryDate, dayOffset, type);
      localStorage?.setItem?.(key, typeof data === "string" ? data : JSON.stringify(data));
    } catch {}
  }, [surgeryDate]);

  const today = new Date();
  const dayOffset = surgeryDate ? getDaysBetween(new Date(surgeryDate + "T12:00:00"), today) : null;
  const currentPhase = dayOffset !== null ? getPhaseForDay(dayOffset) : null;
  const activeDayOffset = selectedDay !== null ? selectedDay : dayOffset;
  const activePhase = activeDayOffset !== null ? getPhaseForDay(activeDayOffset) : null;
  const activeMeals = activePhase ? getMealsForPhase(activePhase) : [];

  function toggleMeal(dayOff, idx) {
    setCheckedMeals((prev) => {
      const dayData = { ...(prev[dayOff] || {}) };
      dayData[idx] = !dayData[idx];
      persist(dayOff, "meals", dayData);
      return { ...prev, [dayOff]: dayData };
    });
  }

  function toggleHydration(dayOff, idx) {
    setCheckedHydration((prev) => {
      const dayData = { ...(prev[dayOff] || {}) };
      dayData[idx] = !dayData[idx];
      persist(dayOff, "hydration", dayData);
      return { ...prev, [dayOff]: dayData };
    });
  }

  function updateNote(dayOff, text) {
    setNotes((prev) => {
      persist(dayOff, "notes", text);
      return { ...prev, [dayOff]: text };
    });
  }

  function handleSetDate() {
    if (!dateInput) return;
    setSurgeryDate(dateInput);
    try { localStorage?.setItem?.("gabi_surgery_date", dateInput); } catch {}
    setView("today");
  }

  function startReminders() {
    if (!("Notification" in window)) { alert("Tu navegador no soporta notificaciones"); return; }
    Notification.requestPermission().then((p) => {
      setNotifPermission(p);
      if (p === "granted") {
        setRemindersActive(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          const now = new Date();
          const h = String(now.getHours()).padStart(2, "0");
          const m = String(now.getMinutes()).padStart(2, "0");
          const timeStr = `${h}:${m}`;
          if (!surgeryDate || activeDayOffset === null) return;
          const meals = getMealsForPhase(getPhaseForDay(activeDayOffset));
          const match = meals.find((ml) => ml.time === timeStr);
          if (match) {
            new Notification(`🍽️ ${match.name}`, { body: match.desc, icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍽️</text></svg>" });
          }
          if (HYDRATION_TIMES.includes(timeStr)) {
            new Notification("💧 Hora de hidratarse", { body: "Tomar agua a sorbos pequeños (100cc)" });
          }
        }, 60000);
      }
    });
  }

  function stopReminders() {
    setRemindersActive(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }

  const mealsDone = checkedMeals[activeDayOffset] ? Object.values(checkedMeals[activeDayOffset]).filter(Boolean).length : 0;
  const mealsTotal = activeMeals.length;
  const hydDone = checkedHydration[activeDayOffset] ? Object.values(checkedHydration[activeDayOffset]).filter(Boolean).length : 0;
  const hydTotal = HYDRATION_TIMES.length;

  const allDays = [];
  for (let d = -5; d <= 7; d++) allDays.push(d);

  const font = `'Outfit', sans-serif`;
  const fontMono = `'JetBrains Mono', monospace`;

  const phaseColors = activePhase ? PHASE_META[activePhase] : PHASE_META[PHASES.FUTURE];

  // Setup screen
  if (!surgeryDate) {
    return (
      <div style={{ fontFamily: font, maxWidth: 480, margin: "0 auto", padding: "2rem 1rem" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🫶</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.5px" }}>Seguimiento Bariátrico</h1>
          <p style={{ fontSize: 15, color: "#888", margin: 0 }}>Acompañando a Gabriela en cada paso</p>
        </div>
        <div style={{ background: "#FAFAF8", borderRadius: 16, padding: "28px 24px", border: "1px solid #EEEEE8" }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#666", display: "block", marginBottom: 8 }}>Fecha de la cirugía</label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", fontSize: 16, fontFamily: font, border: "1.5px solid #DDD", borderRadius: 10, outline: "none", boxSizing: "border-box", marginBottom: 16, background: "#FFF" }}
          />
          <button
            onClick={handleSetDate}
            disabled={!dateInput}
            style={{ width: "100%", padding: "14px", fontSize: 15, fontWeight: 600, fontFamily: font, border: "none", borderRadius: 10, background: dateInput ? "#7F77DD" : "#CCC", color: "#FFF", cursor: dateInput ? "pointer" : "default", transition: "all 0.2s" }}
          >
            Comenzar seguimiento
          </button>
        </div>
        <div style={{ marginTop: 24, padding: "16px 20px", background: "#EEEDFE", borderRadius: 12, fontSize: 13, color: "#534AB7", lineHeight: 1.6 }}>
          <strong>IMC 35 → 5 días preoperatorios</strong><br />
          La app calculará automáticamente todas las fases y comidas según la fecha de cirugía.
        </div>
      </div>
    );
  }

  const surgDateObj = new Date(surgeryDate + "T12:00:00");

  return (
    <div style={{ fontFamily: font, maxWidth: 520, margin: "0 auto", padding: "0.5rem 0.5rem 2rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>Gabriela 🫶</h1>
          <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0" }}>Cirugía: {formatDate(surgDateObj)}</p>
        </div>
        <button
          onClick={() => { setSurgeryDate(null); setDateInput(""); try { localStorage?.removeItem?.("gabi_surgery_date"); } catch {} }}
          style={{ fontSize: 11, padding: "6px 12px", borderRadius: 8, border: "1px solid #E0E0E0", background: "#FFF", cursor: "pointer", fontFamily: font, color: "#999" }}
        >
          Cambiar fecha
        </button>
      </div>

      {/* Phase banner */}
      <div style={{ background: phaseColors.bg, borderRadius: 14, padding: "16px 20px", marginBottom: 16, border: `1px solid ${phaseColors.color}22` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>{phaseColors.emoji}</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: phaseColors.dark }}>{phaseColors.label}</span>
          {activeDayOffset !== null && activePhase !== PHASES.DONE && activePhase !== PHASES.FUTURE && (
            <span style={{ fontSize: 13, color: phaseColors.color, marginLeft: "auto", fontFamily: fontMono, fontWeight: 500 }}>
              {getDayLabel(activeDayOffset)}
            </span>
          )}
        </div>
        {activePhase === PHASES.PRE && <p style={{ fontSize: 12, color: phaseColors.dark, margin: 0, opacity: 0.8, lineHeight: 1.5 }}>Dieta de papilla rica en proteínas. Objetivo: reducir el hígado graso.</p>}
        {activePhase === PHASES.SURGERY && <p style={{ fontSize: 12, color: phaseColors.dark, margin: 0, opacity: 0.8, lineHeight: 1.5 }}>Seguir instrucciones del equipo quirúrgico.</p>}
        {activePhase === PHASES.POST1 && <p style={{ fontSize: 12, color: phaseColors.dark, margin: 0, opacity: 0.8, lineHeight: 1.5 }}>Solo líquidos claros: té, jaleas sin azúcar, consomé colado. Máx 100-150cc por toma.</p>}
        {activePhase === PHASES.POST2 && <p style={{ fontSize: 12, color: phaseColors.dark, margin: 0, opacity: 0.8, lineHeight: 1.5 }}>Se incorporan lácteos descremados sin lactosa y batido proteico. Consomé en almuerzo y cena.</p>}
        {activePhase === PHASES.DONE && <p style={{ fontSize: 12, color: phaseColors.dark, margin: 0, opacity: 0.8, lineHeight: 1.5 }}>Régimen líquido completado. Consultar a la nutricionista para la siguiente etapa.</p>}
      </div>

      {/* Navigation tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[
          { key: "today", label: "Hoy" },
          { key: "calendar", label: "Calendario" },
          { key: "reminders", label: "Recordatorios" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setView(tab.key); if (tab.key === "today") setSelectedDay(null); }}
            style={{
              flex: 1, padding: "10px 8px", fontSize: 13, fontWeight: view === tab.key ? 600 : 400,
              fontFamily: font, border: view === tab.key ? `1.5px solid ${phaseColors.color}` : "1.5px solid #E8E8E4",
              borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
              background: view === tab.key ? phaseColors.bg : "#FAFAF8",
              color: view === tab.key ? phaseColors.dark : "#888",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TODAY VIEW */}
      {(view === "today" || (view === "calendar" && selectedDay !== null)) && activeMeals.length > 0 && (
        <div>
          {/* Progress cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "#FAFAF8", borderRadius: 12, padding: "14px 16px", border: "1px solid #EEEEE8" }}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginBottom: 4 }}>Comidas</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: mealsDone === mealsTotal && mealsTotal > 0 ? "#1D9E75" : "#333" }}>{mealsDone}/{mealsTotal}</div>
              <div style={{ marginTop: 8, height: 4, background: "#EEEEE8", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: mealsTotal ? `${Math.round(mealsDone / mealsTotal * 100)}%` : "0%", background: mealsDone === mealsTotal && mealsTotal > 0 ? "#1D9E75" : phaseColors.color, borderRadius: 2, transition: "width 0.3s" }} />
              </div>
            </div>
            <div style={{ background: "#FAFAF8", borderRadius: 12, padding: "14px 16px", border: "1px solid #EEEEE8" }}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginBottom: 4 }}>Hidratación</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: hydDone === hydTotal ? "#1D9E75" : "#378ADD" }}>{hydDone}/{hydTotal}</div>
              <div style={{ marginTop: 8, height: 4, background: "#EEEEE8", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round(hydDone / hydTotal * 100)}%`, background: hydDone === hydTotal ? "#1D9E75" : "#378ADD", borderRadius: 2, transition: "width 0.3s" }} />
              </div>
            </div>
          </div>

          {/* Meal checklist */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "#555" }}>Comidas del día</h3>
            {activeMeals.map((meal, i) => {
              const done = checkedMeals[activeDayOffset]?.[i];
              return (
                <div
                  key={i}
                  onClick={() => toggleMeal(activeDayOffset, i)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", marginBottom: 6,
                    borderRadius: 12, border: `1px solid ${done ? "#1D9E7533" : "#EEEEE8"}`, cursor: "pointer",
                    background: done ? "#E1F5EE" : "#FFF", transition: "all 0.2s", opacity: done ? 0.7 : 1,
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? "#1D9E75" : "#CCC"}`,
                    background: done ? "#1D9E75" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2, transition: "all 0.15s",
                  }}>
                    {done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: fontMono, fontSize: 12, color: "#999", fontWeight: 500 }}>{meal.time}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: done ? "#1D9E75" : "#333", textDecoration: done ? "line-through" : "none" }}>{meal.name}</span>
                    </div>
                    <p style={{ fontSize: 12, color: done ? "#1D9E7599" : "#888", margin: "3px 0 0", lineHeight: 1.4 }}>{meal.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hydration */}
          {(activePhase === PHASES.POST1 || activePhase === PHASES.POST2) && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "#555" }}>
                Hidratación entre comidas
                <span style={{ fontSize: 11, fontWeight: 400, color: "#999", marginLeft: 6 }}>15-20 min antes/después</span>
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {HYDRATION_TIMES.map((t, i) => {
                  const done = checkedHydration[activeDayOffset]?.[i];
                  return (
                    <button
                      key={i}
                      onClick={() => toggleHydration(activeDayOffset, i)}
                      style={{
                        padding: "8px 14px", borderRadius: 10, fontSize: 13, fontFamily: fontMono, fontWeight: 500,
                        border: `1.5px solid ${done ? "#378ADD" : "#E0E0E0"}`, cursor: "pointer",
                        background: done ? "#E6F1FB" : "#FFF", color: done ? "#185FA5" : "#999",
                        transition: "all 0.15s", textDecoration: done ? "none" : "none",
                      }}
                    >
                      💧 {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: "#555" }}>Notas del día</h3>
            <textarea
              placeholder="¿Cómo se siente Gabriela? ¿Alguna observación?"
              value={notes[activeDayOffset] || ""}
              onChange={(e) => updateNote(activeDayOffset, e.target.value)}
              style={{
                width: "100%", minHeight: 70, padding: "12px 14px", fontSize: 13, fontFamily: font,
                border: "1.5px solid #E8E8E4", borderRadius: 10, outline: "none", resize: "vertical",
                background: "#FAFAF8", boxSizing: "border-box", lineHeight: 1.5,
              }}
            />
          </div>

          {selectedDay !== null && (
            <button
              onClick={() => { setSelectedDay(null); setView("today"); }}
              style={{ width: "100%", padding: 12, fontSize: 13, fontFamily: font, fontWeight: 500, border: "1.5px solid #E0E0E0", borderRadius: 10, background: "#FFF", cursor: "pointer", color: "#666" }}
            >
              ← Volver a hoy
            </button>
          )}
        </div>
      )}

      {/* SURGERY DAY VIEW */}
      {(view === "today" || (view === "calendar" && selectedDay !== null)) && activePhase === PHASES.SURGERY && (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px" }}>Día de la cirugía</h2>
          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
            Seguir todas las indicaciones del equipo quirúrgico sobre ayuno y preparación.
          </p>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" && selectedDay === null && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px", color: "#555" }}>Progreso completo</h3>
          {allDays.map((d) => {
            const phase = getPhaseForDay(d);
            const meta = PHASE_META[phase];
            const dayDate = new Date(surgDateObj);
            dayDate.setDate(dayDate.getDate() + d);
            const isToday = d === dayOffset;
            const dayMeals = getMealsForPhase(phase);
            const doneMeals = checkedMeals[d] ? Object.values(checkedMeals[d]).filter(Boolean).length : 0;
            const totalMeals = dayMeals.length;
            const pct = totalMeals > 0 ? Math.round(doneMeals / totalMeals * 100) : (phase === PHASES.SURGERY ? 100 : 0);

            return (
              <div
                key={d}
                onClick={() => { if (phase !== PHASES.SURGERY && phase !== PHASES.DONE && phase !== PHASES.FUTURE) { setSelectedDay(d); } }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", marginBottom: 4,
                  borderRadius: 10, border: isToday ? `2px solid ${meta.color}` : "1px solid #EEEEE8",
                  background: isToday ? meta.bg : "#FFF", cursor: totalMeals > 0 ? "pointer" : "default",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: pct === 100 ? "#1D9E75" : (d <= dayOffset ? meta.color : "#DDD"),
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: isToday ? 600 : 500, color: isToday ? meta.dark : "#333" }}>
                      {getDayLabel(d)}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: 10, fontWeight: 600, background: meta.color, color: "#FFF", padding: "1px 7px", borderRadius: 6 }}>HOY</span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: "#999" }}>{formatDate(dayDate)} · {meta.label}</span>
                </div>
                {totalMeals > 0 && (
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, fontFamily: fontMono, color: pct === 100 ? "#1D9E75" : meta.color }}>{pct}%</span>
                  </div>
                )}
                {phase === PHASES.SURGERY && <span style={{ fontSize: 16 }}>🏥</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* REMINDERS VIEW */}
      {view === "reminders" && (
        <div>
          <div style={{ background: "#FAFAF8", borderRadius: 14, padding: "24px 20px", border: "1px solid #EEEEE8", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{remindersActive ? "🔔" : "🔕"}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>
              {remindersActive ? "Recordatorios activos" : "Recordatorios de comidas"}
            </h3>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, maxWidth: 320, margin: "0 auto 16px" }}>
              {remindersActive
                ? "Recibirás notificaciones en cada horario de comida e hidratación mientras tengas esta página abierta."
                : "Activa las notificaciones para recibir un recordatorio en cada horario de comida y de hidratación."
              }
            </p>
            {!remindersActive ? (
              <button
                onClick={startReminders}
                style={{
                  padding: "12px 28px", fontSize: 14, fontWeight: 600, fontFamily: font, border: "none",
                  borderRadius: 10, background: "#7F77DD", color: "#FFF", cursor: "pointer",
                }}
              >
                Activar recordatorios
              </button>
            ) : (
              <button
                onClick={stopReminders}
                style={{
                  padding: "12px 28px", fontSize: 14, fontWeight: 600, fontFamily: font, border: "1.5px solid #E24B4A",
                  borderRadius: 10, background: "#FFF", color: "#E24B4A", cursor: "pointer",
                }}
              >
                Desactivar
              </button>
            )}
            {notifPermission === "denied" && (
              <p style={{ fontSize: 12, color: "#E24B4A", marginTop: 12 }}>
                Las notificaciones están bloqueadas. Habilítalas en la configuración de tu navegador.
              </p>
            )}
          </div>

          {/* Schedule preview */}
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "#555" }}>Horarios de hoy ({getDayLabel(dayOffset)})</h3>
          {getMealsForPhase(currentPhase).length > 0 ? (
            <div>
              {getMealsForPhase(currentPhase).map((meal, i) => {
                const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                const [mh, mm] = meal.time.split(":").map(Number);
                const mealMinutes = mh * 60 + mm;
                const isPast = nowMinutes > mealMinutes + 30;
                const isNow = Math.abs(nowMinutes - mealMinutes) <= 30;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 3,
                      borderRadius: 8, background: isNow ? "#EEEDFE" : "transparent",
                      opacity: isPast ? 0.5 : 1,
                    }}
                  >
                    <span style={{ fontFamily: fontMono, fontSize: 12, color: isNow ? "#534AB7" : "#999", fontWeight: 500, width: 44 }}>{meal.time}</span>
                    <span style={{ fontSize: 13, color: isNow ? "#3C3489" : "#555", fontWeight: isNow ? 600 : 400 }}>{meal.name}</span>
                    {isNow && <span style={{ fontSize: 9, background: "#7F77DD", color: "#FFF", padding: "2px 6px", borderRadius: 4, fontWeight: 600, marginLeft: "auto" }}>AHORA</span>}
                  </div>
                );
              })}
              <div style={{ borderTop: "1px solid #EEEEE8", marginTop: 10, paddingTop: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#378ADD", marginBottom: 6 }}>Hidratación</div>
                {HYDRATION_TIMES.map((t, i) => {
                  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                  const [hh, hm] = t.split(":").map(Number);
                  const isPast = nowMinutes > hh * 60 + hm + 30;
                  const isNow = Math.abs(nowMinutes - (hh * 60 + hm)) <= 30;
                  return (
                    <div key={i} style={{ display: "inline-block", padding: "3px 10px", margin: "2px 4px 2px 0", borderRadius: 6, fontSize: 12, fontFamily: fontMono, background: isNow ? "#E6F1FB" : "#F5F5F3", color: isNow ? "#185FA5" : (isPast ? "#CCC" : "#888"), fontWeight: isNow ? 600 : 400 }}>
                      {t}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "#999" }}>No hay comidas programadas para hoy.</p>
          )}
        </div>
      )}
    </div>
  );
}
