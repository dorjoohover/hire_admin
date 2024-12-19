import React from "react";
import {
  Radio,
  Checkbox,
  Input,
  Button,
  Dropdown,
  InputNumber,
  Tooltip,
} from "antd";
import {
  TrashIcon,
  ImageIcon,
  MoreIcon,
  TagIcon,
  DropdownIcon,
  PenIcon,
} from "../../Icons";
import MatrixGrid from "./MatrixGrid";

const AnswerOptions = ({
  question,
  onUpdate,
  assessmentData,
  editingOptionIndex,
  setEditingOptionIndex,
}) => {
  const handleOptionImageUpload = async (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        const newOptions = [...question.answers];
        newOptions[index].answer.image = { url: imageUrl };
        onUpdate({ answers: newOptions });
      }
    };

    input.click();
  };

  const handleOptionChange = (index, changes) => {
    const newOptions = [...question.answers];
    newOptions[index].answer = {
      ...newOptions[index].answer,
      ...changes,
    };
    onUpdate({ answers: newOptions });
  };

  const handleOptionBlur = (index) => {
    if (!question.answers[index].answer.value) {
      handleOptionChange(index, { value: `Сонголт ${index + 1}` });
    }
    setEditingOptionIndex(null);
  };

  const handleCategorySelect = (category, index) => {
    const newOptions = [...question.answers];
    newOptions[index].answer.category = category.id;
    newOptions[index].answer.categoryName = category.name;
    onUpdate({ answers: newOptions });
  };

  const handleRemoveCategory = (index) => {
    const newOptions = [...question.answers];
    newOptions[index].answer.category = null;
    newOptions[index].answer.categoryName = null;
    onUpdate({ answers: newOptions });
  };

  const removeOptionImage = (index) => {
    const newOptions = [...question.answers];
    newOptions[index].answer.image = null;
    onUpdate({ answers: newOptions });
  };

  const handleCorrectAnswerChange = (index, checked) => {
    const newOptions = [...question.answers];
    if (question.type === 10) {
      newOptions.forEach((opt, i) => {
        opt.answer.correct = i === index ? checked : false;
      });
    } else {
      newOptions[index].answer.correct = checked;
    }
    onUpdate({ answers: newOptions });
  };

  const getOptionMenu = (index) => ({
    items: [
      {
        key: "image",
        label: <div className="pl-2">Зураг оруулах</div>,
        icon: <ImageIcon width={16} />,
        onClick: () => handleOptionImageUpload(index),
      },
      {
        key: "category",
        label: <div className="pl-2 pt-[1px] pr-3">Ангилал тохируулах</div>,
        icon: <PenIcon width={16} />,
        disabled: !assessmentData?.data.answerCategories.length > 0,
        children: assessmentData?.data.answerCategories.map((category) => ({
          key: category.id,
          label: (
            <div className="flex items-center gap-2">
              <TagIcon width={16} />
              <span className="font-medium">{category.name}</span>
            </div>
          ),
          onClick: () => handleCategorySelect(category, index),
        })),
        expandIcon: <DropdownIcon width={15} rotate={-90} />,
      },
      {
        key: "remove",
        label: <div className="pl-2">Устгах</div>,
        icon: <TrashIcon width={16} />,
        onClick: () => {
          const newOptions = [...question.answers];
          newOptions.splice(index, 1);
          onUpdate({
            answers: newOptions,
            optionCount: newOptions.length,
          });
        },
        danger: true,
        disabled: question.answers.length <= 2,
      },
    ],
  });

  const renderSingleOrMultipleChoice = () => (
    <div className="w-full">
      {question.answers.map((option, index) => {
        return (
          <div key={index} className="flex items-center gap-2 group">
            <AnswerTypeControl
              type={question.type}
              option={option}
              index={index}
              assessmentData={assessmentData}
              onChange={handleCorrectAnswerChange}
            />
            <AnswerContent
              option={option}
              index={index}
              editingOptionIndex={editingOptionIndex}
              setEditingOptionIndex={setEditingOptionIndex}
              handleOptionChange={handleOptionChange}
              handleOptionBlur={handleOptionBlur}
              removeOptionImage={removeOptionImage}
              handleRemoveCategory={handleRemoveCategory}
              getOptionMenu={getOptionMenu}
              question={question}
            />
          </div>
        );
      })}
    </div>
  );

  const renderConstantSum = () => (
    <div>
      {question.answers.map((option, index) => (
        <div key={index} className="flex items-center gap-2 group">
          <div className="flex-1">
            <AnswerContent
              option={option}
              index={index}
              editingOptionIndex={editingOptionIndex}
              setEditingOptionIndex={setEditingOptionIndex}
              handleOptionChange={handleOptionChange}
              handleOptionBlur={handleOptionBlur}
              handleRemoveCategory={handleRemoveCategory}
              getOptionMenu={getOptionMenu}
              isConstantSum
              question={question}
            />
          </div>
        </div>
      ))}
    </div>
  );

  if (question.type === 40) {
    return (
      <MatrixGrid
        question={question}
        onUpdate={onUpdate}
        assessmentData={assessmentData}
      />
    );
  }

  const renderTrueFalse = () => (
    <div className="w-full">
      {question.answers?.slice(0, 2).map((option, index) => (
        <div key={index} className="flex items-center gap-2 mb-0.5">
          <Radio
            checked={option.answer.correct}
            onChange={(e) => {
              const newOptions = [...question.answers];
              newOptions.forEach((opt, i) => {
                opt.answer.correct = i === index;
              });
              onUpdate({ answers: newOptions });
            }}
          />
          <div className="flex items-center gap-2 flex-1">
            <div className="w-16">{index === 0 ? "Үнэн" : "Худал"}</div>
            <InputNumber
              min={0}
              value={option.answer.point || 0}
              onChange={(value) => {
                const newOptions = [...question.answers];
                newOptions[index].answer = {
                  ...newOptions[index].answer,
                  point: value,
                };
                onUpdate({ answers: newOptions });
              }}
              className="w-24 h-[30px]"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderTextInput = () => (
    <div className="w-2/5 flex gap-2 items-center">
      <div className="w-[80%]">
        <Input disabled placeholder="Хариулт бичих хэсэг" />
      </div>
      <InputNumber
        min={0}
        value={question.question?.minValue || 0}
        onChange={(value) =>
          onUpdate(question.id, {
            question: {
              ...question.question,
              minValue: value,
            },
          })
        }
        className="w-full h-[30px]"
      />
    </div>
  );

  const renderMap = {
    10: renderSingleOrMultipleChoice,
    20: renderSingleOrMultipleChoice,
    50: renderConstantSum,
    30: renderTrueFalse,
    60: renderTextInput,
  };

  return renderMap[question.type]?.() || null;
};

const AnswerTypeControl = ({
  type,
  option,
  index,
  assessmentData,
  onChange,
}) => {
  const Control = type === 10 ? Radio : Checkbox;

  return (
    <Tooltip
      title={assessmentData?.data.type === 10 ? "Зөв хариугаар тэмдэглэх" : ""}
    >
      <Control
        disabled={assessmentData?.data.type === 20}
        checked={option.answer?.correct || false}
        onChange={(e) => onChange(index, e.target.checked)}
        className={type === 20 ? "pr-2" : ""}
      />
    </Tooltip>
  );
};

const AnswerContent = ({
  option,
  index,
  editingOptionIndex,
  setEditingOptionIndex,
  handleOptionChange,
  handleOptionBlur,
  removeOptionImage,
  handleRemoveCategory,
  getOptionMenu,
  isConstantSum = false,
  question,
}) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          {option.answer?.image ? (
            <div className="mt-2 relative group/image">
              <img
                src={option.answer.image.url}
                alt={option.answer.value}
                className="h-[100px] object-cover rounded"
              />
              <button
                onClick={() => removeOptionImage(index)}
                className="absolute top-2 left-2 px-1 bg-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
              >
                <TrashIcon width={16} className="text-red-500" />
              </button>
            </div>
          ) : (
            <div className="flex items-center w-full">
              {editingOptionIndex === index ? (
                <input
                  value={option.answer?.value || ""}
                  onChange={(e) =>
                    handleOptionChange(index, { value: e.target.value })
                  }
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const nextIndex =
                        index < question.answers.length - 1 ? index + 1 : 0;
                      setEditingOptionIndex(nextIndex);
                    }
                  }}
                  onBlur={() => handleOptionBlur(index)}
                  autoFocus
                  className="outline-none underline w-full"
                  size={option.answer?.value?.length + 10}
                />
              ) : (
                <div
                  className={`cursor-pointer rounded-md ${
                    editingOptionIndex === null ? "hover:bg-neutral" : ""
                  }`}
                  onClick={() => setEditingOptionIndex(index)}
                >
                  {option.answer?.value?.trim() || `Сонголт ${index + 1}`}
                </div>
              )}
            </div>
          )}
        </div>

        {!isConstantSum && (
          <InputNumber
            min={0}
            value={option.answer?.point || 0}
            onChange={(value) => handleOptionChange(index, { point: value })}
            className="w-24 h-[30px] ml-8"
          />
        )}

        {option.answer?.category && (
          <Tooltip title="Ангилал устгах">
            <div
              className="flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-md text-sm cursor-pointer hover:bg-blue-200"
              onClick={() => handleRemoveCategory(index)}
            >
              <TagIcon width={14} />
              {option.answer?.categoryName || option.answer?.category?.name}
            </div>
          </Tooltip>
        )}

        {isConstantSum && (
          <InputNumber disabled value={0} className="w-24 mr-2 h-[30px]" />
        )}

        <Dropdown
          menu={getOptionMenu(index)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            icon={<MoreIcon width={16} />}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default AnswerOptions;
