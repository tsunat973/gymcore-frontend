"use client";

import { useState, useEffect } from "react";

type RecordItem = {
  id: number;
  exercise_id: number;
  date: string;
  weight: number;
  reps: number;
  sets: number;
  memo: string;
};

export default function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [memo, setMemo] = useState("");
  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      setExerciseId(id);
    };
    resolveParams();
  }, [params]);

  const [records, setRecords] = useState<RecordItem[]>([]);

  const fetchRecords = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3001/api/records/${exerciseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return;
    }
    setRecords(data);
  };

  useEffect(() => {
    if (exerciseId) {
      fetchRecords();
    }
  }, [exerciseId]);

  //  記録追加
  const handleAddRecords = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:3001/api/records",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exercise_id: Number(exerciseId), date, weight: Number(weight), reps: Number(reps), sets: Number(sets), memo }),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }
    setDate("");
    setMemo("");
    setWeight("");
    setReps("");
    setSets("");
    fetchRecords();
  };

  return (
    <div>
      <ul>
        {records.map((record) => {
          return (
            <li key={record.id}>
              {record.date}: {record.weight}kg × {record.reps}回 × {record.sets}
              セット
            </li>
          );
        })}
      </ul>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="number" placeholder="重量(kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <input type="number" placeholder="回数" value={reps} onChange={(e) => setReps(e.target.value)} />
      <input type="number" placeholder="セット数" value={sets} onChange={(e) => setSets(e.target.value)} />
      <input type="text" placeholder="メモ" value={memo} onChange={(e) => setMemo(e.target.value)} />
      <button onClick={handleAddRecords}>追加</button>
    </div>
  );
}
