"use client";

import React, { useState } from "react";
import { Modal, Select, Input, Switch, Button, Form, Radio } from "antd";
import { DropdownIcon, TagIcon } from "./Icons";

const NewAssessment = ({
  isModalOpen,
  assessmentCategories,
  handleOk,
  handleCancel,
}) => {
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [testName, setTestName] = useState("Тестийн нэр");
  const [categories, setCategories] = useState([]);

  const [isCategorySwitchOn, setCategorySwitchOn] = useState(false);
  const [isAssessment, setIsAssessment] = useState(20);
  const [categoryInput, setCategoryInput] = useState("");

  const handleEditClick = () => setIsEditing(true);
  const handleInputChange = (e) => setTestName(e.target.value);
  const handleBlur = () => setIsEditing(false);

  const handleCategorySwitchChange = (checked) => {
    setCategorySwitchOn(checked);
    if (!checked) {
      setCategories([]);
      setCategoryInput("");
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(undefined);

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);

    if (value.trim()) {
      const categoryArray = value
        .split(",")
        .map((category) => category.trim())
        .filter((category) => category !== "");
      setCategories(categoryArray);
    } else {
      setCategories([]);
    }
  };

  const onSubmit = async () => {
    if (isCategorySwitchOn) {
      try {
        await form.validateFields();
      } catch (error) {
        return;
      }
    }

    const formData = {
      testName: testName,
      hasAnswerCategory: isCategorySwitchOn,
      categories: categories,
      type: isAssessment,
      assessmentCategory: selectedCategory,
    };

    setTestName("Тестийн нэр");
    setCategories([]);
    setCategoryInput("");
    setIsEditing(false);
    setCategorySwitchOn(false);
    form.resetFields();
    handleOk(formData);
  };

  return (
    <Modal
      //title="Тест үүсгэх"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={onSubmit}
      footer={
        <div className="flex gap-4 justify-end">
          <Button
            className="back border rounded-xl text-[13px] font-medium"
            onClick={handleCancel}
          >
            Буцах
          </Button>
          <Button
            className="border-none rounded-xl font-semibold text-white bg-main"
            onClick={onSubmit}
          >
            Үүсгэх
          </Button>
        </div>
      }
    >
      <div className="flex items-center">
        {isEditing ? (
          <input
            className="outline-none underline"
            value={testName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoFocus
            size={testName.length + 10}
            style={{
              fontWeight: "bold",
              fontSize: "18px",
            }}
          />
        ) : (
          <div
            className="cursor-pointer font-bold text-[18px] hover:bg-neutral rounded-md"
            onClick={handleEditClick}
          >
            {testName}
          </div>
        )}
      </div>

      <div className="flex pt-3 gap-4">
        <Select
          placeholder="Тестийн ангилал"
          options={assessmentCategories
            .filter((cate) => cate.parent == null)
            .map((cate) => {
              return {
                label: cate.name,
                value: cate.id,
              };
            })}
          onChange={(e) => {
            setSelectedCategory(e);
          }}
          suffixIcon={<DropdownIcon width={15} height={15} />}
        />
        <Select
          placeholder="Дэд ангилал"
          options={assessmentCategories
            .filter((cate) => cate.parent != null)
            .map((cate) => {
              return {
                label: cate.name,
                value: cate.id,
              };
            })}
          onChange={(e) => {
            setSelectedCategory(e);
          }}
          suffixIcon={<DropdownIcon width={15} height={15} />}
        />
      </div>
      <div className="flex gap-4 pt-4">
        <Radio.Group
          value={isAssessment}
          onChange={(e) => setIsAssessment(e.target.value)}
        >
          <Radio value={20}>Үнэлгээ</Radio>
          <Radio value={10}>Зөв хариулттай тест</Radio>
        </Radio.Group>
      </div>

      <div className="pt-4 gap-2 flex items-center">
        <Switch
          size="small"
          checked={isCategorySwitchOn}
          onChange={handleCategorySwitchChange}
        />
        <div>Хариулт нь ангилалтай байх уу?</div>
      </div>

      {isCategorySwitchOn && (
        <div className="pt-3">
          <div>
            <div className="font-bold pb-1">Ангиллууд</div>
            <Form form={form}>
              <Form.Item
                name="categoryInput"
                rules={[
                  {
                    validator: () => {
                      if (categories.length === 0) {
                        return Promise.reject("Ангиллууд оруулна уу.");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  value={categoryInput}
                  onChange={handleCategoryInputChange}
                  placeholder="Таслалаар хязгаарлан оруулна уу. Жишээ нь: D,I,S,C"
                  className="category"
                />
              </Form.Item>
            </Form>
            {categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 px-2 py-0.5 gap-2 rounded-md text-sm flex items-center"
                  >
                    <TagIcon width={14} />
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default NewAssessment;
