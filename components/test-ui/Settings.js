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

const { TextArea } = Input;

const Settings = ({
  assessmentData,
  onUpdateAssessment,
  assessmentCategories,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState("general");
  const [form] = Form.useForm();

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
                      value={assessmentData?.data.duration}
                      onChange={(value) => handleFieldChange("duration", value)}
                    />
                    <span>минут</span>
                  </div>
                  <Divider />
                  <div className="flex items-center gap-2">
                    <Switch
                      size="small"
                      onChange={(checked) => handleFieldChange("", checked)}
                    />
                    <span className="text-sm">Блок тус бүр хугацаатай</span>
                  </div>
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
                      onChange={(checked) => handleFieldChange("", checked)}
                    />
                    <span className="text-sm">Асуулт хэсэгчлэх</span>
                  </div>
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
                    <span className="text-sm">Асуултууд холих</span>
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
