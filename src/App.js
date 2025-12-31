import { useEffect, useState } from "react"
import { supabase } from "./supabase"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

const DAYS_IN_MONTH = 31

function calculateStreak(stamps, user, month) {
  const days = stamps
    .filter(s => s.user === user && s.month === month)
    .map(s => s.day)
    .sort((a, b) => b - a)

  if (days.length === 0) return 0

  let streak = 1
  let expectedDay = days[0] - 1

  for (let i = 1; i < days.length; i++) {
    if (days[i] === expectedDay) {
      streak++
      expectedDay--
    } else {
      break
    }
  }

  return streak
}



export default function App() {
  const [user, setUser] = useState(localStorage.getItem("ritual-user"))
  const [month, setMonth] = useState(MONTHS[0])
  const [stamps, setStamps] = useState([])
  const vnStreak = calculateStreak(stamps, "VN", month)
  const spStreak = calculateStreak(stamps, "SP", month)

  useEffect(() => {
    fetchStamps()
  }, [month])

  const fetchStamps = async () => {
    const { data } = await supabase
      .from("stamps")
      .select("*")
      .eq("month", month)

    setStamps(data || [])
  }

  const handleStamp = async (day) => {
    const existing = stamps.find(
      s => s.day === day && s.user === user
    )

    if (existing) {
      await supabase.from("stamps").delete().eq("id", existing.id)
    } else {
      await supabase.from("stamps").insert({
        day,
        month,
        user
      })
    }

    fetchStamps()
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linen">
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <h1 className="font-serif text-3xl mb-6">Who are you?</h1>
          <div className="flex gap-6 justify-center">
            {["VN", "SP"].map(u => (
              <button
                key={u}
                onClick={() => {
                  localStorage.setItem("ritual-user", u)
                  setUser(u)
                }}
                className="px-8 py-3 bg-linen rounded-xl shadow font-serif"
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linen py-10 px-6 flex flex-col items-center">
      <h1 className="font-serif text-4xl mb-1">{month} Ritual</h1>
      <p className="text-sm text-gray-600 mb-6">
        Gentle movement. Every day.
      </p>
      <div className="flex gap-6 text-sm text-gray-700 mb-8">
        <span>VN streak: <strong>{vnStreak}</strong> days</span>
        <span>SP streak: <strong>{spStreak}</strong> days</span>
      </div>

      {/* Month Selector */}
      <div className="flex gap-3 mb-10 flex-wrap justify-center">
        {MONTHS.map(m => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            className={`px-4 py-2 rounded-full text-sm shadow
              ${month === m ? "bg-white font-semibold" : "bg-linen"}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 sm:gap-4">
        {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => {
          const day = i + 1
          const vn = stamps.find(s => s.day === day && s.user === "VN")
          const sp = stamps.find(s => s.day === day && s.user === "SP")

          return (
            <div
              key={day}
              onClick={() => handleStamp(day)}
              className="
                w-full aspect-square
                bg-white rounded-xl shadow-sm
                flex flex-col items-center justify-center
                cursor-pointer hover:shadow-md transition
              "
            >
              <span className="text-xs text-gray-400 mb-1">{day}</span>

              <div className="flex gap-2">
                {vn && <GoldStamp text="VN" />}
                {sp && <GoldStamp text="SP" />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GoldStamp({ text }) {
  return (
    <span className="font-script text-xl bg-gradient-to-r from-gold1 to-gold2 bg-clip-text text-transparent drop-shadow">
      {text}
    </span>
  )
}
