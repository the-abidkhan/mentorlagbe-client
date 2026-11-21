import { TuitionFormData } from "@/types/tuition";

export const createTuition = async (
  tuitionData: TuitionFormData,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tuitionData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to post tuition.");
  }

  return result;
};