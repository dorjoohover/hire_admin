"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button, Spin, message } from "antd";
import { EyeIcon } from "@/components/Icons";
import Questions from "@/components/test-ui/Questions";
import {
  getAssessmentById,
  getAssessmentCategory,
  updateAssessmentById,
} from "../(api)/assessment";
import {
  createQuestion,
  createQuestionCategory,
  getQuestionsByAssessmentId,
  updateQuestions,
} from "../(api)/question";
import { useSearchParams, useRouter } from "next/navigation";
import Settings from "@/components/test-ui/Settings";

export default function Home() {
  const [assessmentData, setAssessmentData] = useState(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState(null);
  const [assessmentCategories, setAssessmentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState({});
  const params = useSearchParams();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [blocks, setBlocks] = useState([
    {
      id: "block-1",
      name: "Блок #1",
      order: 1,
      value: "",
      image: null,
      hasQuestion: false,
      isExpanded: true,
      questions: [],
    },
  ]);

  const fetchData = async () => {
    try {
      const id = params.get("id");
      if (id) {
        await getAssessmentById(id).then((d) => {
          if (d.success) setAssessmentData(d.data);
        });
        await getAssessmentCategory().then((d) => {
          if (d.success) setAssessmentCategories(d.data);
        });
        await getQuestionsByAssessmentId(id).then((d) => {
          if (d.success) {
            setAssessmentQuestions(d.data);
            if (d.data && d.data.length > 0) {
              const transformedBlocks = d.data.map((block) => ({
                id: block.category.id,
                name: block.category.name,
                order: block.category.orderNumber,
                value: "",
                image: null,
                hasQuestion: false,
                isExpanded: true,
                questions: block.questions.map((question) => {
                  if (question.type === 40) {
                    return {
                      id: question.id,
                      order: question.orderNumber,
                      type: question.type,
                      value: question.name,
                      question: {
                        name: question.name,
                        minValue: question.minValue,
                        maxValue: question.maxValue,
                        orderNumber: question.orderNumber,
                      },
                      answers: question.answers.map((answerObj) => ({
                        answer: {
                          id: answerObj.id,
                          value: answerObj.value,
                          point: answerObj.point || 0,
                          orderNumber: answerObj.orderNumber,
                          category: answerObj.category || null,
                        },
                        matrix: answerObj.matrix.map((matrixItem) => ({
                          id: matrixItem.id,
                          value: matrixItem.value,
                          point: matrixItem.point,
                          category: matrixItem.category || null,
                          orderNumber: matrixItem.orderNumber,
                        })),
                      })),
                      optionCount: question.answers.length,
                    };
                  } else {
                    return {
                      id: question.id,
                      order: question.orderNumber,
                      type: question.type,
                      value: question.name,
                      question: {
                        name: question.name,
                        minValue: question.minValue,
                        maxValue: question.maxValue,
                        orderNumber: question.orderNumber,
                      },
                      answers: question.answers.map((answer) => {
                        return {
                          answer: {
                            id: answer.id,
                            value: answer.value,
                            point: answer.point !== null ? answer.point : 0,
                            orderNumber: answer.orderNumber,
                            category: answer.category,
                            correct: answer.correct || false,
                          },
                        };
                      }),
                      optionCount: question.answers.length,
                    };
                  }
                }),
              }));
              setBlocks(transformedBlocks);
            }
          }
        });
      }
    } catch (error) {
      message.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  console.log("father", assessmentQuestions);
  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateAssessment = (updates) => {
    if (updates.blocks) {
      setBlocks(updates.blocks);
    }
    setAssessmentData(updates);

    setChanges((prev) => ({
      ...prev,
      ...updates.data,
    }));
  };

  const items = [
    {
      key: "1",
      label: "Асуултууд",
      content: (
        <Questions
          blocks={blocks}
          setBlocks={setBlocks}
          assessmentData={assessmentData}
          onUpdateAssessment={handleUpdateAssessment}
        />
      ),
    },
    {
      key: "2",
      label: "Тохиргоо",
      content: (
        <Settings
          blocks={blocks}
          assessmentData={assessmentData}
          assessmentCategories={assessmentCategories}
          onUpdateAssessment={handleUpdateAssessment}
        />
      ),
    },
    {
      key: "3",
      label: "Үр дүн",
      content: "",
    },

    {
      key: "4",
      label: "Тайлан",
      content: "",
    },
  ];

  const [activeKey, setActiveKey] = useState("1");

  const handleTabClick = (key) => {
    setActiveKey(key);
  };

  const formatAnswers = (question) => {
    if (question.type === 40) {
      return question.answers.map((answerObj) => {
        const id = isNaN(parseInt(answerObj.answer.id));

        const answer = {
          id: id ? null : answerObj.answer.id,
          value: answerObj.answer.value,
          point: answerObj.answer.point || 0,
          orderNumber: answerObj.answer.orderNumber,
          category: answerObj.answer.category || null,
        };

        const matrix = answerObj.matrix.map((matrixItem) => {
          const mId = isNaN(parseInt(matrixItem.id));
          return {
            value: matrixItem.value,
            id: mId ? null : matrixItem.id,
            category: matrixItem.category || null,
            orderNumber: matrixItem.orderNumber,
            point: matrixItem.point || 0,
          };
        });
        return {
          answer,
          matrix,
        };
      });
    }

    return question.answers.map((answerObj) => {
      const id = isNaN(parseInt(answerObj.answer.id));
      return {
        answer: {
          id: id ? null : answerObj.answer.id,
          value: answerObj.answer.value,
          point: answerObj.answer.point || 0,
          orderNumber: answerObj.answer.orderNumber,
          category: answerObj.answer.category || null,
          correct: answerObj.answer.correct || false,
        },
      };
    });
  };

  const publish = async () => {
    try {
      setLoading(true);
      const id = params.get("id");
      if (!id) return;

      if (Object.keys(changes).length > 0) {
        const assessmentResponse = await updateAssessmentById(id, changes);
        if (!assessmentResponse.success) {
          messageApi.error(
            assessmentResponse.message || "Хадгалахад алдаа гарлаа"
          );
          return;
        }
      }

      for (const block of blocks) {
        let blockId = block.id;

        if (!assessmentQuestions?.some((aq) => aq.category.id === block.id)) {
          const blockResponse = await createQuestionCategory({
            name: block.name,
            duration: 0,
            totalPrice: 0,
            questionCount: block.questions.length,
            orderNumber: block.order,
            assessment: id,
          });
          if (!blockResponse.success) {
            messageApi.error("Блок үүсгэхэд алдаа гарлаа");
            return;
          }
          blockId = blockResponse.data;
        }

        const existingBlockQuestions =
          assessmentQuestions?.find((aq) => aq.category.id === block.id)
            ?.questions || [];

        for (const question of block.questions) {
          console.log({
            id: question.id,
            category: blockId,
            type: question.type,
            question: {
              name: question.value,
              minValue: question.question?.minValue || 0,
              maxValue: question.question?.maxValue || 1,
              orderNumber: question.order,
            },
            answers: formatAnswers(question),
          });
          if (existingBlockQuestions.find((eq) => eq.id === question.id)) {
            await updateQuestions({
              id: question.id,
              category: blockId,
              type: question.type,
              question: {
                name: question.value,
                minValue: question.question?.minValue || 0,
                maxValue: question.question?.maxValue || 1,
                orderNumber: question.order,
              },
              answers: formatAnswers(question),
            });
          } else {
            await createQuestion({
              category: blockId,
              type: question.type,
              question: {
                name: question.value,
                minValue: question.question?.minValue || 0,
                maxValue: question.question?.maxValue || 1,
                orderNumber: question.order,
              },
              answers: formatAnswers(question),
            });
          }
        }
      }

      messageApi.success("Амжилттай хадгаллаа");
      await fetchData();
      setChanges({});
    } catch (error) {
      console.error("Error in publish:", error);
      messageApi.error("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {contextHolder}
      <Spin tip="Уншиж байна..." fullscreen spinning={loading} />
      <div className="fixed w-full top-0 z-10 bg-white">
        <Header />
        <div className="flex border-b pr-6 pl-4 justify-between items-end">
          <div className="flex gap-6">
            <div className="flex gap-6">
              {items.map((item) => (
                <div
                  key={item.key}
                  className={`cursor-pointer p-2 ${
                    item.key === activeKey
                      ? "font-bold text-main border-b-2 border-main"
                      : ""
                  }`}
                  onClick={() => handleTabClick(item.key)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 py-2 items-center">
            <div className="mr-2 flex gap-1 items-center bg-bg20 px-2 py-0.5 rounded-lg text-main">
              <div>Сүүлд шинэчилсэн:</div>
              <div>
                {assessmentData?.data.updatedAt &&
                  (() => {
                    const date = new Date(assessmentData.data.updatedAt);
                    date.setHours(date.getHours() + 8);
                    return `${
                      date
                        .toISOString()
                        .slice(5, 16)
                        .replace("T", " ")
                        .replace("-", "-")
                        .split(" ")[0]
                    }-нд ${date.toISOString().slice(11, 16)}`;
                  })()}
              </div>
            </div>
            <Button className="border-main text-main rounded-xl px-4 login mb-0 font-semibold button-2">
              <EyeIcon />
            </Button>
            <Button
              className="bg-main border-none text-white rounded-xl px-4 login mb-0 font-bold"
              onClick={publish}
            >
              Хадгалах
            </Button>
          </div>
        </div>
      </div>

      <div>
        {items
          .filter((item) => item.key === activeKey)
          .map((item) => (
            <div className="w-full" key={item.key}>
              {item.content}
            </div>
          ))}
      </div>
    </div>
  );
}
