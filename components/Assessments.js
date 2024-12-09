"use client";

import React, { useEffect, useState } from "react";
import { Input, Spin, Button, Table, Dropdown, message } from "antd";
import {
  SearchIcon,
  PlusIcon,
  MoreIcon,
  SurveyIcon,
  CircleCheckIcon,
  EyeIcon,
  CopyIcon,
  TrashIcon,
  TestIcon,
} from "./Icons";
import { useRouter } from "next/navigation";
import NewAssessment from "./NewAssessment";
import {
  createAssessment,
  getAssessmentCategory,
  getAssessments,
} from "@/app/(api)/assessment";
import { customLocale } from "@/utils/values";

const getActionMenu = (record) => ({
  items: [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2">
          <CircleCheckIcon width={18} /> Төлөв өөрчлөх
        </div>
      ),
      onClick: () => {},
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2">
          <EyeIcon width={18} /> Урьдчилж харах
        </div>
      ),
      onClick: () => {},
    },
    {
      key: "3",
      label: (
        <div className="flex items-center gap-2">
          <CopyIcon width={18} /> Хувилах
        </div>
      ),
      onClick: () => {},
    },
    {
      key: "4",
      label: (
        <div className="flex items-center gap-2">
          <TrashIcon width={18} /> Устгах
        </div>
      ),
      danger: true,
      onClick: () => {},
    },
  ],
});

const Assessments = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredAssessments, setFilteredAssessments] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getConstant = async () => {
    try {
      await getAssessments().then((d) => {
        if (d.success) setAssessments(d.data.ass);
      });
      await getAssessmentCategory().then((d) => {
        if (d.success) setCategory(d.data);
      });
    } catch (error) {
      message.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConstant();
  }, []);

  useEffect(() => {
    const filtered = assessments.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAssessments(filtered);
  }, [assessments, searchText]);

  const handleOk = async (formData) => {
    localStorage.removeItem("assessmentData");

    localStorage.setItem("assessmentData", JSON.stringify(formData));

    await createAssessment({
      category: formData.assessmentCategory,
      name: formData.testName,
      description: "",
      usage: "",
      measure: "",
      questionCount: 0,
      price: 0,
      duration: 0,
      type: formData.type,
    }).then((d) => {
      if (d.success) {
        router.push(`/test?id=${d.data}`);
      }
    });
    // router.push("/test");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    localStorage.removeItem("assessmentData");
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Тестийн нэр",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div className="flex items-center gap-2 text-main">
          {record.type === 20 ? (
            <SurveyIcon width={18} />
          ) : (
            <TestIcon width={18} />
          )}
          <div className="text-black font-semibold">{text}</div>
        </div>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "type",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Category 1",
          value: "Category 1",
          children: [
            {
              text: "Yellow",
              value: "Yellow",
            },
            {
              text: "Pink",
              value: "Pink",
            },
          ],
        },
        {
          text: "Category 2",
          value: "Category 2",
          children: [
            {
              text: "Green",
              value: "Green",
            },
            {
              text: "Black",
              value: "Black",
            },
          ],
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "Төлөв",
      dataIndex: "status",
    },
    {
      title: "Үүсгэсэн",
      dataIndex: "createdUser",
      filters: [...new Set(assessments.map((item) => item.createdUser))].map(
        (user) => ({
          text: user,
          value: user,
        })
      ),
      onFilter: (value, record) => record.createdUser === value,
      filterSearch: true,
    },
    {
      title: "Үүсгэсэн огноо",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => new Date(date).toISOString().split("T")[0],
    },
    {
      title: "Шинэчилсэн огноо",
      dataIndex: "updatedAt",
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (date) => new Date(date).toISOString().split("T")[0],
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={getActionMenu(record)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            className="hover:opacity-100"
            icon={<MoreIcon width={16} />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Spin tip="Уншиж байна..." fullscreen spinning={loading} />
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div>
            <Input
              className="home"
              prefix={<SearchIcon />}
              placeholder="Нэрээр хайх"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            onClick={showModal}
            className="bg-main border-none text-white rounded-xl px-4 login mb-0 font-bold"
          >
            <PlusIcon width={18} />
            Тест үүсгэх
          </Button>
        </div>
      </div>
      <div className="pt-6">
        <Table
          columns={columns}
          dataSource={filteredAssessments}
          locale={customLocale}
          onRow={(record) => ({
            onClick: () => router.push(`/test?id=${record.id}`),
          })}
          className="cursor-pointer"
        />
      </div>

      <NewAssessment
        assessmentCategories={category}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default Assessments;
