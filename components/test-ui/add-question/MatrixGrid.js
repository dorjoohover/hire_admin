"use client";

import React, { useState } from "react";
import { InputNumber, Button, Tooltip, Dropdown } from "antd";
import { TagIcon, DropdownIcon, PenIcon, MoreIcon } from "../../Icons";

const MatrixGrid = ({ question, onUpdate, assessmentData }) => {
  const [editingCell, setEditingCell] = useState(null);

  const handleScalePointKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex =
        index < question.answers[0].matrix.length - 1 ? index + 1 : 0;
      setEditingCell({ type: "scale", index: nextIndex });
    }
  };

  const handleOptionKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = index < question.answers.length - 1 ? index + 1 : 0;
      setEditingCell({ type: "option", index: nextIndex });
    }
  };

  const handleCategorySelect = (category, index) => {
    const newAnswers = question.answers.map((answer) => ({
      ...answer,
      matrix: answer.matrix.map((item, i) =>
        i === index ? { ...item, category: category.id } : item
      ),
    }));
    onUpdate({ answers: newAnswers });
  };

  const handleRemoveCategory = (index) => {
    const newAnswers = question.answers.map((answer) => ({
      ...answer,
      matrix: answer.matrix.map((item, i) =>
        i === index ? { ...item, category: null } : item
      ),
    }));
    onUpdate({ answers: newAnswers });
  };

  const handleScalePointEdit = (index, newValue) => {
    const newAnswers = question.answers.map((answer) => ({
      ...answer,
      matrix: answer.matrix.map((item, i) =>
        i === index ? { ...item, value: newValue } : item
      ),
    }));
    onUpdate({ answers: newAnswers });
  };

  const handleOptionEdit = (index, newText) => {
    const newAnswers = [...question.answers];
    newAnswers[index].answer.value = newText;
    onUpdate({ answers: newAnswers });
  };

  const handlePointChange = (rowIndex, colIndex, value) => {
    const newAnswers = [...question.answers];
    if (!newAnswers[rowIndex].matrix[colIndex]) {
      newAnswers[rowIndex].matrix[colIndex] = {};
    }
    newAnswers[rowIndex].matrix[colIndex].point = value;
    onUpdate({ answers: newAnswers });
  };

  return (
    <div className="w-full pr-12">
      <div className="flex">
        <div className="w-1/4 border-b border-r"></div>
        <div
          className="flex-1 grid border-b"
          style={{
            gridTemplateColumns: `repeat(${question.answers[0].matrix?.length}, 1fr)`,
          }}
        >
          {question.answers[0].matrix?.map((point, index) => (
            <div key={index} className="text-center mb-1">
              <div className="flex flex-col items-center">
                {editingCell?.type === "scale" &&
                editingCell?.index === index ? (
                  <input
                    value={point.value}
                    onChange={(e) =>
                      handleScalePointEdit(index, e.target.value)
                    }
                    onBlur={() => {
                      if (!point.value.trim()) {
                        handleScalePointEdit(index, `Цэг ${index + 1}`);
                      }
                      setEditingCell(null);
                    }}
                    onKeyDown={(e) => handleScalePointKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    autoFocus
                    className="w-full text-center outline-none underline"
                  />
                ) : (
                  <div
                    className="cursor-pointer hover:bg-neutral rounded text-gray-600 px-2"
                    onClick={() => setEditingCell({ type: "scale", index })}
                  >
                    {point.value}
                  </div>
                )}
                {point.category ? (
                  <Tooltip title="Ангилал устгах">
                    <div
                      className="flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-md text-sm cursor-pointer hover:bg-blue-200 mt-1"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <TagIcon width={14} />
                      {assessmentData?.data.answerCategories.find(
                        (c) => c.id === point.category
                      )?.name || ""}
                    </div>
                  </Tooltip>
                ) : (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "category",
                          label: (
                            <div className="pl-2 pr-3 pt-[1px]">
                              Ангилал тохируулах
                            </div>
                          ),
                          icon: <PenIcon width={16} />,
                          disabled:
                            !assessmentData?.data.answerCategories?.length,
                          children: assessmentData?.data.answerCategories?.map(
                            (category) => ({
                              key: category.id,
                              label: (
                                <div>
                                  <div className="flex items-center gap-2">
                                    <TagIcon
                                      width={16}
                                      className="text-gray-400"
                                    />
                                    <span className="text-gray-600 font-medium">
                                      {category.name.toLowerCase()}
                                    </span>
                                  </div>
                                </div>
                              ),
                              onClick: () =>
                                handleCategorySelect(category, index),
                            })
                          ),
                          expandIcon: <DropdownIcon width={15} rotate={-90} />,
                        },
                      ],
                    }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      className="mt-1 opacity-0 hover:opacity-100"
                      icon={<MoreIcon width={16} />}
                    />
                  </Dropdown>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4"></div>
      {question.answers.map((answer, rowIndex) => (
        <div key={rowIndex} className="flex items-center">
          <div className="w-1/4 border-r py-1 pb-2">
            {editingCell?.type === "option" &&
            editingCell?.index === rowIndex ? (
              <input
                value={answer.answer.value}
                onChange={(e) => handleOptionEdit(rowIndex, e.target.value)}
                onBlur={() => {
                  if (!answer.answer.value.trim()) {
                    handleOptionEdit(rowIndex, `Сонголт ${rowIndex + 1}`);
                  }
                  setEditingCell(null);
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, rowIndex)}
                onFocus={(e) => e.target.select()}
                autoFocus
                className="w-full outline-none underline"
              />
            ) : (
              <div
                className="cursor-pointer hover:bg-neutral rounded"
                onClick={() =>
                  setEditingCell({ type: "option", index: rowIndex })
                }
              >
                {answer.answer.value}
              </div>
            )}
          </div>
          <div
            className="flex-1 grid"
            style={{
              gridTemplateColumns: `repeat(${answer.matrix?.length}, 1fr)`,
            }}
          >
            {answer.matrix?.map((point, colIndex) => (
              <div key={colIndex} className="flex justify-center p-1">
                <InputNumber
                  min={-1}
                  value={point.point || 0}
                  onChange={(value) =>
                    handlePointChange(rowIndex, colIndex, value)
                  }
                  className="w-20"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatrixGrid;
