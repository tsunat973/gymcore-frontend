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

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/exercise/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      alert("削除に失敗しました");
      return;
    }
    fetchExercises();
  };
  // 編集
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/exercise/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editName }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.error);
      return;
    }
    setEditingId(null);
    setEditName("");
    fetchExercises();
  };

  return (
    <div>
      <h1>種目一覧</h1>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            {editingId === exercise.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button onClick={() => handleUpdate(exercise.id)}>保存</button>
              </>
            ) : (
              <>
                {exercise.name}
                <button
                  onClick={() => {
                    setEditingId(exercise.id);
                    setEditName(exercise.name);
                  }}
                >
                  編集
                </button>
                <button onClick={() => handleDelete(exercise.id)}>削除</button>
              </>
            )}
          </li>
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
