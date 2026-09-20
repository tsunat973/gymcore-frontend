"use client";

import { useState, useEffect } from "react";

type RecordItemItem = {
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

  return <div>種目ID: {exerciseId}</div>
}
