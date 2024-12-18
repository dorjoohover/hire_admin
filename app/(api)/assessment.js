"use server";
import { api } from "@/utils/routes";
import { cookies } from "next/headers";

export const createAssessmentCategory = async ({ name, description }) => {
  const token = (await cookies()).get("auth-token");
  if (!token?.value) return { token: false };
  try {
    const body = {
      name: name,
      description: description,
    };
    const res = await fetch(`${api}level`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token?.value ?? ""}`,
      },
      body: JSON.stringify(body),
    }).then((d) => d.json());
    console.log(res);
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};
export const createAssessmentLevel = async ({ name, parent }) => {
  const token = (await cookies()).get("auth-token");
  if (!token?.value) return { token: false };
  try {
    const body = {
      name: name,
      parent: parent ?? null,
    };
    const res = await fetch(`${api}assessmentCategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token?.value ?? ""}`,
      },
      body: JSON.stringify(body),
    }).then((d) => d.json());
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};
export const getAssessments = async () => {
  const token = (await cookies()).get("auth-token");
  if (!token?.value) return { token: false };
  try {
    const res = await fetch(`${api}assessment`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value ?? ""}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());
    console.log(res);
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};
export const getAssessmentCategory = async () => {
  try {
    const res = await fetch(`${api}assessmentCategory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());
    console.log(res);
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};
export const getAssessmentCategoryById = async (id) => {
  try {
    const res = await fetch(`${api}assessmentCategory/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());
    console.log(res);
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};
export const getAssessmentById = async (id) => {
  try {
    const token = (await cookies()).get("auth-token");
    const res = await fetch(`${api}assessment/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value ?? ""}`,
      },
    }).then((d) => d.json());
    console.log(res);
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};

export const deleteAssessmentById = async (id) => {
  try {
    const token = (await cookies()).get("auth-token");
    const res = await fetch(`${api}assessment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value ?? ""}`,
      },
    }).then((d) => d.json());
    console.log(res);
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};

export const createAssessment = async (values) => {
  const token = (await cookies()).get("auth-token");
  if (!token?.value) return { token: false };
  try {
    const body = {
      name: values.name,
      description: values.description,
      measure: values.measure,
      usage: values.usage,
      duration: values.duration,
      price: values.price,
      function: values.function,
      advice: values.advice,
      author: values.author,
      type: values.type,
      questionShuffle: values.questionShuffle,
      answerShuffle: values.answerShuffle,
      questionCount: values.questionCount,
      level: values.level,
      category: values.category,
      icons: values.icons,
      answerCategories: values.answerCategories,
    };
    const res = await fetch(`${api}assessment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value ?? ""}`,
      },
      body: JSON.stringify(body),
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};

export const updateAssessmentById = async (id, values) => {
  const token = (await cookies()).get("auth-token");
  if (!token?.value) return { token: false };

  try {
    const res = await fetch(`${api}assessment/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value ?? ""}`,
      },
      body: JSON.stringify(values),
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};
