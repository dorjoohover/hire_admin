"use server";
import { api } from "@/utils/routes";
import { cookies } from "next/headers";

export const createQuestionCategory = async (values) => {
  const token = (await cookies()).get("auth-token");
  if (!token?.value) return { token: false };
  try {
    const body = {
      name: values.name,
      duration: values.duration,
      totalPrice: values.totalPrice,
      questionCount: values.questionCount,
      orderNumber: values.orderNumber,
      assessment: values.assessment,
    };
    const res = await fetch(`${api}question/category`, {
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
      message: res?.payload?.message,
      status: res?.payload?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};

export const createQuestion = async (values) => {
  const token = (await cookies()).get("auth-token");
  if (!token?.value) return { token: false };
  try {
    const body = {
      category: values.category,
      type: values.type,
      question: values.question,
      answers: values.answers,
    };
    const res = await fetch(`${api}question/all`, {
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
      message: res?.payload?.message,
      status: res?.payload?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
  }
};

export const getQuestionsByAssessmentId = async (id) => {
  try {
    const token = (await cookies()).get("auth-token");
    const res = await fetch(`${api}question/assessment/${id}`, {
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

export const deleteQuestionCategoryById = async (id) => {
  try {
    const token = (await cookies()).get("auth-token");
    const res = await fetch(`${api}question/category/${id}`, {
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

export const deleteQuestionById = async (id) => {
  try {
    const token = (await cookies()).get("auth-token");
    const res = await fetch(`${api}question/question/${id}`, {
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

export const updateQuestions = async (questionData) => {
  const token = (await cookies()).get("auth-token");
  if (!token?.value) return { token: false };

  try {
    const res = await fetch(`${api}question/all`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value ?? ""}`,
      },
      body: JSON.stringify({
        category: questionData.category,
        type: questionData.type,
        question: questionData.question,
        answers: questionData.answers,
      }),
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
