"use client";

import { useState, useEffect } from "react";

type Exercise = {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState("");

  const fetchExercises = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3001/api/exercise", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setExercises(data);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleAddExercise = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/api/exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }
    setName("");
    fetchExercises();
  };

  return (
    <div>
      <h1>種目一覧</h1>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>{exercise.name}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="種目名"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAddExercise}>追加</button>
    </div>
  );
}
