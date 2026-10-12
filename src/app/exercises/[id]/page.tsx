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
    const response = await fetch("http://localhost:3001/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        exercise_id: Number(exerciseId),
        date,
        weight: Number(weight),
        reps: Number(reps),
        sets: Number(sets),
        memo,
      }),
    });
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

  // 削除機能
  const handleDeleteRecord = async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/records/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      alert("削除に失敗しました");
      return;
    }
    fetchRecords();
  };

  // 記録編集更新用
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editReps, setEditReps] = useState("");
  const [editSets, setEditSets] = useState("");
  const [editMemo, setEditMemo] = useState("");

  const handleUpdateRecord = async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/api/records/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: editDate,
        weight: Number(editWeight),
        reps: Number(editReps),
        sets: Number(editSets),
        memo: editMemo,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.error);
      return;
    }
    setEditingId(null);
    setEditDate("");
    setEditWeight("");
    setEditReps("");
    setEditSets("");
    setEditMemo("");
    fetchRecords();
  };

  return (
    <div>
      <ul>
        {records.map((record) => {
          return (
            <li key={record.id}>
              {editingId === record.id ? (
                <>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="重量(kg)"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="回数"
                    value={editReps}
                    onChange={(e) => setEditReps(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="セット数"
                    value={editSets}
                    onChange={(e) => setEditSets(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="メモ"
                    value={editMemo}
                    onChange={(e) => setEditMemo(e.target.value)}
                  />
                  <button onClick={() => handleUpdateRecord(record.id)}>完了</button>
                </>
              ) : (
                <>
                  {" "}
                  {record.date}: {record.weight}kg × {record.reps}回 ×{" "}
                  {record.sets}
                  セット
                  <button
                    onClick={() => {
                      setEditingId(record.id);
                      setEditDate(record.date);
                      setEditWeight(String(record.weight));
                      setEditReps(String(record.reps));
                      setEditSets(String(record.sets));
                      setEditMemo(record.memo);
                    }}
                  >
                    編集
                  </button>
                  <button onClick={() => handleDeleteRecord(record.id)}>
                    削除
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="number"
        placeholder="重量(kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="回数"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <input
        type="number"
        placeholder="セット数"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
      />
      <input
        type="text"
        placeholder="メモ"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      />
      <button onClick={handleAddRecords}>追加</button>
    </div>
  );
}
