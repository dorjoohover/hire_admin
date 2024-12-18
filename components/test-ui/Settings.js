"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Divider,
  InputNumber,
  Collapse,
  Switch,
} from "antd";
import { DropdownIcon, SettingsIcon } from "../Icons";
import { TestName } from "./TestName";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableBlock = ({ block, blockDurations, blockQuestionCounts }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded-lg p-3 mb-2 cursor-move"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{block.name}</h3>
          <div className="text-sm text-gray-500 mt-1">
            {block.questions.length} асуулт
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm">
            Хугацаа: {blockDurations[block.id] || 0} мин
          </div>
          <div className="text-sm mt-1">
            Асуулт: {blockQuestionCounts[block.id] || block.questions.length}
          </div>
        </div>
      </div>
    </div>
  );
};

const { TextArea } = Input;

const Settings = ({
  blocks,
  assessmentData,
  onUpdateAssessment,
  assessmentCategories,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState("general");
  const [form] = Form.useForm();

  const [blockDurationEnabled, setBlockDurationEnabled] = useState(false);
  const [blockDurations, setBlockDurations] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [questionCountEnabled, setQuestionCountEnabled] = useState(false);
  const [blockQuestionCounts, setBlockQuestionCounts] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);

  useEffect(() => {
    if (blocks) {
      const initialDurations = {};
      const initialQuestionCounts = {};
      blocks.forEach((block) => {
        initialDurations[block.id] = block.duration || 0;
        initialQuestionCounts[block.id] =
          block.maxQuestions || block.questions.length;
      });
      setBlockDurations(initialDurations);
      setBlockQuestionCounts(initialQuestionCounts);
    }
  }, [blocks]);

  const totalBlockDuration = Object.values(blockDurations).reduce(
    (sum, duration) => sum + (duration || 0),
    0
  );

  const handleBlockDurationChange = (blockId, value) => {
    const newDurations = {
      ...blockDurations,
      [blockId]: parseInt(value) || 0,
    };
    setBlockDurations(newDurations);

    // Update assessment data with new durations
    if (onUpdateAssessment) {
      onUpdateAssessment({
        ...assessmentData,
        data: {
          ...assessmentData.data,
          blockDurations: newDurations,
          duration: Object.values(newDurations).reduce(
            (sum, d) => sum + (d || 0),
            0
          ),
        },
      });
    }
  };

  const handleBlockDurationToggle = (checked) => {
    setBlockDurationEnabled(checked);
    if (!checked) {
      // Reset all block durations when disabled
      const resetDurations = {};
      blocks?.forEach((block) => {
        resetDurations[block.id] = 0;
      });
      setBlockDurations(resetDurations);
      onUpdateAssessment({
        ...assessmentData,
        data: {
          ...assessmentData.data,
          blockDurations: resetDurations,
          duration: assessmentData?.data.duration || 0,
        },
      });
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (assessmentData?.category?.parent) {
      return {
        id: assessmentData.category.parent.id,
        name: assessmentData.category.parent.name,
      };
    }
    return assessmentData?.category
      ? {
          id: assessmentData.category.id,
          name: assessmentData.category.name,
        }
      : null;
  });

  const availableSubCategories = selectedCategory
    ? assessmentCategories.find((cat) => cat.id === selectedCategory.id)
        ?.subcategories || []
    : [];

  const [selectedSubCategory, setSelectedSubCategory] = useState(() => {
    return assessmentData?.category?.parent
      ? {
          id: assessmentData.category.id,
          name: assessmentData.category.name,
        }
      : null;
  });

  useEffect(() => {
    if (assessmentData) {
      form.setFieldsValue({
        name: assessmentData.data.name,
        category: assessmentData.data.category,
        description: assessmentData.data.description,
        price: assessmentData.data.price,
        author: assessmentData.data.author,
        level: assessmentData.data.level,
        usage: assessmentData.data.usage,
        measure: assessmentData.data.measure,
        duration: assessmentData.data.duration,
        questionShuffle: assessmentData.data.questionShuffle,
        answerShuffle: assessmentData.data.answerShuffle,
        categoryShuffle: assessmentData.data.categoryShuffle,
      });
    }
  }, [assessmentData, form]);

  const handleFieldChange = (field, value) => {
    if (onUpdateAssessment) {
      onUpdateAssessment({
        ...assessmentData,
        data: {
          ...assessmentData.data,
          [field]: value,
        },
      });
    }
  };

  const handleQuestionCountToggle = (checked) => {
    setQuestionCountEnabled(checked);
    if (!checked) {
      const resetCounts = {};
      blocks?.forEach((block) => {
        resetCounts[block.id] = block.questions.length;
      });
      setBlockQuestionCounts(resetCounts);
      onUpdateAssessment({
        ...assessmentData,
        data: {
          ...assessmentData.data,
          blockQuestionCounts: resetCounts,
        },
      });
    }
  };

  const handleQuestionCountChange = (blockId, value) => {
    const newCounts = {
      ...blockQuestionCounts,
      [blockId]: parseInt(value) || 0,
    };
    setBlockQuestionCounts(newCounts);

    onUpdateAssessment({
      ...assessmentData,
      data: {
        ...assessmentData.data,
        blockQuestionCounts: newCounts,
      },
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex).map(
        (block, index) => ({
          ...block,
          order: index + 1,
        })
      );

      onUpdateBlocks(newBlocks);
    }
  };

  const renderGeneral = () => (
    <div className="p-4 px-6">
      <div className="pr-36">
        <div className="px-1 pb-1">Тестийн нэр</div>
        <TestName
          testName={assessmentData?.data.name || ""}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setTestName={(value) => handleFieldChange("name", value)}
        />
      </div>
      <Divider />
      <div className="pr-36 pt-1">
        <div className="px-1 pb-2"> Тестийн ангилал</div>
        <div className="flex gap-4 pb-2">
          <Select
            value={selectedCategory?.id}
            options={assessmentCategories
              .filter((cate) => cate.parent == null)
              .map((cate) => ({
                label: cate.name,
                value: cate.id,
              }))}
            placeholder="Тестийн ангилал"
            suffixIcon={<DropdownIcon width={15} height={15} />}
            onChange={(value) => {
              const selectedCate = assessmentCategories.find(
                (c) => c.id === value
              );
              setSelectedCategory({
                id: selectedCate.id,
                name: selectedCate.name,
              });
              setSelectedSubCategory(null); // Clear sub-selection when main category changes
              handleFieldChange("category", selectedCate); // Update with main category
            }}
          />
          <Select
            value={selectedSubCategory?.id}
            options={availableSubCategories.map((cate) => ({
              label: cate.name,
              value: cate.id,
            }))}
            placeholder="Дэд ангилал"
            suffixIcon={<DropdownIcon width={15} height={15} />}
            disabled={!selectedCategory || availableSubCategories.length === 0}
            onChange={(value) => {
              const selectedCate = availableSubCategories.find(
                (c) => c.id === value
              );
              setSelectedSubCategory({
                id: selectedCate.id,
                name: selectedCate.name,
              });
              handleFieldChange("category", selectedCate);
            }}
          />
        </div>
      </div>
      <Divider />
      <div className="pr-36 pb-2">
        <div className="px-1 pb-2">Тайлбар</div>
        <TextArea
          rows={4}
          value={assessmentData?.data.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
        />
      </div>
      <Divider />
      <div className="pr-36 pt-1">
        <div className="px-1 pb-2">Тестийн үнэ</div>
        <InputNumber
          addonAfter="₮"
          className="price"
          value={assessmentData?.data.price}
          onChange={(value) => handleFieldChange("price", value)}
        />
      </div>
    </div>
  );

  const renderMore = () => (
    <div className="p-4 px-6">
      <div className="pr-36">
        <div className="px-1 pb-2">Түвшин</div>
        <Select
          placeholder="Тестийн түвшин"
          value={assessmentData?.data.level}
          onChange={(value) => handleFieldChange("level", value)}
          suffixIcon={<DropdownIcon width={15} height={15} />}
        />
      </div>
      <Divider />
      <div className="pr-36 py-1">
        <div className="px-1 pb-2">Тест зохиогч</div>
        <Input
          className="w-[200px]"
          value={assessmentData?.data.author}
          onChange={(e) => handleFieldChange("author", e.target.value)}
        />
      </div>
      <Divider />
      <div className="pr-36 pb-2">
        <div className="px-1 pb-2">Хэрэглээ</div>
        <TextArea
          rows={4}
          value={assessmentData?.data.usage}
          onChange={(e) => handleFieldChange("usage", e.target.value)}
        />
      </div>
      <Divider />
      <div className="pr-36 pb-2">
        <div className="px-1 pb-2">Хэмжих зүйлс</div>
        <TextArea
          rows={4}
          value={assessmentData?.data.measure}
          onChange={(e) => handleFieldChange("measure", e.target.value)}
        />
      </div>
    </div>
  );

  const renderBlocks = () => (
    <>
      <div className="border-r py-[14px] w-1/5 fixed h-screen">
        <Collapse
          expandIcon={({ isActive }) => (
            <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
          )}
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Хугацаа",
              children: (
                <>
                  <div className="flex items-center gap-2">
                    <InputNumber
                      disabled={blockDurationEnabled}
                      value={assessmentData?.data.duration}
                      onChange={(value) => handleFieldChange("duration", value)}
                    />
                    <span>минут</span>
                  </div>
                  <Divider />
                  <div className="flex items-center gap-2">
                    <Switch
                      size="small"
                      onChange={() =>
                        handleBlockDurationToggle(!blockDurationEnabled)
                      }
                    />
                    <span className="text-sm">Блок тус бүр хугацаатай</span>
                  </div>
                  {blockDurationEnabled && blocks && blocks.length > 0 && (
                    <>
                      <Divider />
                      <div className="mt-4 space-y-3">
                        {blocks.map((block) => (
                          <div
                            key={block.id}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm">{block.name}:</span>
                            <InputNumber
                              defaultValue={blockDurations[block.id] || 0}
                              onChange={(value) =>
                                handleBlockDurationChange(block.id, value)
                              }
                            />
                            <span className="text-sm">минут</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ),
            },
          ]}
        />
        <Divider className="clps" />
        <Collapse
          expandIcon={({ isActive }) => (
            <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
          )}
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Асуултын тоо",
              children: (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      size="small"
                      onChange={() =>
                        handleQuestionCountToggle(!questionCountEnabled)
                      }
                    />
                    <span className="text-sm">Асуулт хэсэгчлэх</span>
                  </div>
                  {questionCountEnabled && blocks && blocks.length > 0 && (
                    <>
                      <Divider />
                      <div className="space-y-3">
                        {blocks.map((block) => (
                          <div
                            key={block.id}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm">{block.name}:</span>
                            <span className="text-xs text-gray-500">
                              (Нийт {block.questions.length} асуулт)
                            </span>
                            <InputNumber
                              max={block.questions.length}
                              value={
                                blockQuestionCounts[block.id] ||
                                block.questions.length
                              }
                              onChange={(value) =>
                                handleQuestionCountChange(block.id, value)
                              }
                            />
                            <span className="text-sm">асуулт</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ),
            },
          ]}
        />
        <Divider className="clps" />
        <Collapse
          expandIcon={({ isActive }) => (
            <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
          )}
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Холих",
              children: (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Switch
                      size="small"
                      checked={assessmentData?.data.questionShuffle}
                      onChange={(checked) =>
                        handleFieldChange("questionShuffle", checked)
                      }
                    />
                    <span className="text-sm">Бүх асуултууд холих</span>
                  </div>
                  <Divider />
                  <div className="flex items-center gap-2 mb-2">
                    <Switch
                      size="small"
                      checked={assessmentData?.data.questionShuffle}
                      onChange={(checked) =>
                        handleFieldChange("questionShuffle", checked)
                      }
                    />
                    <span className="text-sm">Блок доторх асуултууд холих</span>
                  </div>
                  <Divider />
                  <div className="flex items-center gap-2 mb-2">
                    <Switch
                      size="small"
                      checked={assessmentData?.data.answerShuffle}
                      onChange={(checked) =>
                        handleFieldChange("answerShuffle", checked)
                      }
                    />
                    <span className="text-sm">Хариултууд холих</span>
                  </div>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="border rounded-lg overflow-hidden ml-[320px]">
        <div className="px-4 py-2 bg-gray-50">
          <h4 className="text-sm font-semibold">Блокууд</h4>
        </div>
        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((block) => block.id)}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  blockDurations={blockDurations}
                  blockQuestionCounts={blockQuestionCounts}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );

  const contentMap = {
    general: renderGeneral,
    more: renderMore,
    blocks: renderBlocks,
  };

  return (
    <div className="mt-[98px]">
      <div className="border-r py-3 w-1/5 fixed h-screen">
        <div className="px-6 font-bold text-menu flex items-center gap-2 pb-3">
          <SettingsIcon width={16} />
          Тохиргоо
        </div>
        <div
          className={`px-6 py-3 hover:bg-gray-100 border-t cursor-pointer ${
            selected === "general" ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelected("general")}
        >
          <div className="font-bold">Ерөнхий мэдээлэл</div>
          <div className="text-[13px] pb-0.5">Тестийн нэр, тайлбар, төрөл</div>
        </div>
        <div
          className={`px-6 py-3 hover:bg-gray-100 border-t cursor-pointer ${
            selected === "more" ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelected("more")}
        >
          <div className="font-bold">Дэлгэрэнгүй мэдээлэл</div>
          <div className="text-[13px] pb-0.5">
            Хэмжих зүйлс, хэрэглээ, түвшин
          </div>
        </div>
        <div
          className={`px-6 py-3 hover:bg-gray-100 border-t cursor-pointer ${
            selected === "blocks" ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelected("blocks")}
        >
          <div className="font-bold">Блокууд</div>
          <div className="text-[13px] pb-0.5">
            Дараалал, хугацаа, асуултын тоо
          </div>
        </div>
        <div
          className={`px-6 py-3 hover:bg-gray-100 border-t cursor-pointer ${
            selected === "preview" ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelected("preview")}
        >
          <div className="font-bold">Тестийн тойм</div>
          <div className="text-[13px] pb-0.5">Харагдах байдал</div>
        </div>
      </div>
      <div className="ml-[20%] w-1/2">
        <Form form={form}>{contentMap[selected]?.()}</Form>
      </div>
    </div>
  );
};

export default Settings;
