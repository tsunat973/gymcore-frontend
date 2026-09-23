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
    setRecords(data);
  };

  useEffect(() => {
    if (exerciseId) {
      fetchRecords();
    }
  }, [exerciseId]);

  return (
    <div>
      <ul>
        {records.map((record) => {
          return(
          <li key={record.id}>
            {record.date}: {record.weight}kg × {record.reps}回 × {record.sets}
            セット
          </li>);
        })}
      </ul>
    </div>
  );
}
