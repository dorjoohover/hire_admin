"use client";

import React, { useEffect, useState } from "react";
import { Input, Spin, Button, Table, Dropdown, message, Select } from "antd";
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
  GlobeIcon,
  DropdownIcon,
} from "./Icons";
import { useRouter } from "next/navigation";
import NewAssessment from "./NewAssessment";
import InfoModal from "./modals/Info";
import {
  createAssessment,
  getAssessmentCategory,
  getAssessments,
  deleteAssessmentById,
} from "@/app/(api)/assessment";
import { customLocale } from "@/utils/values";

const typeOptions = [
  {
    label: (
      <div className="flex gap-2 items-center">
        <span className="text-main">
          <SurveyIcon width={18} />
        </span>
        <span>Үнэлгээ</span>
      </div>
    ),
    value: 20,
  },
  {
    label: (
      <div className="flex gap-2 items-center">
        <span className="text-main">
          <TestIcon width={18} />
        </span>
        <span>Зөв хариулттай тест</span>
      </div>
    ),
    value: 10,
  },
];

const Assessments = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    record: null,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const getActionMenu = (record) => ({
    items: [
      {
        key: "1",
        label: (
          <div className="flex items-center gap-2">
            <CircleCheckIcon width={18} /> Төлөв өөрчлөх
          </div>
        ),
        onClick: (e) => {
          e.domEvent.stopPropagation();
        },
      },
      {
        key: "2",
        label: (
          <div className="flex items-center gap-2">
            <EyeIcon width={18} /> Урьдчилж харах
          </div>
        ),
        onClick: (e) => {
          e.domEvent.stopPropagation();
        },
      },
      {
        key: "3",
        label: (
          <div className="flex items-center gap-2">
            <CopyIcon width={18} /> Хувилах
          </div>
        ),
        onClick: (e) => {
          e.domEvent.stopPropagation();
        },
      },
      {
        key: "4",
        label: (
          <div className="flex items-center gap-2">
            <TrashIcon width={18} /> Устгах
          </div>
        ),
        danger: true,
        onClick: (e) => {
          e.domEvent.stopPropagation();
          setDeleteModal({ open: true, record });
        },
      },
    ],
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getConstant = async () => {
    try {
      await getAssessments().then((d) => {
        if (d.success) setAssessments(d.data.res);
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
    let filtered = assessments;

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.data.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((item) => item.data.type === typeFilter);
    }

    setFilteredAssessments(filtered);
  }, [assessments, searchText, typeFilter]);

  const handleOk = async (formData) => {
    localStorage.removeItem("assessmentData");

    localStorage.setItem("assessmentData", JSON.stringify(formData));

    const answerCategories =
      formData.categories?.map((category) => ({
        name: category,
        description: "",
      })) || [];

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
      answerCategories: answerCategories,
    }).then((d) => {
      if (d.success) {
        router.push(`/test?id=${d.data.id}`);
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
      title: "Төрөл",
      dataIndex: ["data", "type"],
      render: (record) => (
        <div className="text-center gap-2 text-main">
          {record === 20 ? <SurveyIcon width={18} /> : <TestIcon width={18} />}
          <div className="text-black font-semibold"></div>
        </div>
      ),
      width: "0px",
    },
    {
      title: "Тестийн нэр",
      dataIndex: ["data", "name"],
      sorter: (a, b) => a.data.name.localeCompare(b.data.name),
      render: (text, record) => (
        <div className="flex items-center gap-2 text-main">
          <div className="text-black font-semibold">{text}</div>
        </div>
      ),
      width: "22%",
    },
    {
      title: "Ангилал",
      dataIndex: "category",
      render: (_, record) => {
        // If category has parent, show parent name, otherwise show category name
        const categoryName = record.category?.parent
          ? record.category.parent.name
          : record.category?.name;

        return <span>{categoryName}</span>;
      },
      filters: category
        .filter((cat) => cat.parent === null) // Get top-level categories
        .map((mainCat) => ({
          text: mainCat.name,
          value: mainCat.id,
          children: mainCat.subcategories?.map((subCat) => ({
            text: subCat.name,
            value: subCat.id,
          })),
        })),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        // Check if the record's category matches either directly or via parent
        return (
          record.category?.id === value || record.category?.parent?.id === value
        );
      },
    },
    {
      title: "Төлөв",
      dataIndex: ["data", "status"],
    },
    {
      title: "Үүсгэсэн",
      dataIndex: "user",
      render: (user) => {
        if (!user?.createdUser) return null;
        const firstName = user.createdUser.firstname;
        const lastInitial = user.createdUser.lastname?.charAt(0) || "";
        return `${firstName}.${lastInitial}`;
      },
      filters: [
        ...new Set(
          assessments
            .filter((item) => item.user?.createdUser)
            .map((item) => item.user.createdUser.id)
        ),
      ]
        .map((userId) => {
          const user = assessments.find(
            (item) => item.user?.createdUser?.id === userId
          )?.user?.createdUser;
          return {
            text: `${user?.firstname}.${user?.lastname?.charAt(0) || ""}`,
            value: user?.id,
          };
        })
        .filter(Boolean),
      onFilter: (value, record) => record.user?.createdUser?.id === value,
      filterSearch: true,
    },
    {
      title: "Үүсгэсэн огноо",
      dataIndex: ["data", "createdAt"],
      sorter: (a, b) => new Date(a.data.createdAt) - new Date(b.data.createdAt),
      render: (date) => new Date(date).toISOString().split("T")[0],
    },
    {
      title: "Шинэчилсэн огноо",
      dataIndex: ["data", "updatedAt"],
      sorter: (a, b) => new Date(a.data.updatedAt) - new Date(b.data.updatedAt),
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

  const handleDelete = async (record) => {
    if (!record?.data?.id) return;

    setLoading(true);
    await deleteAssessmentById(record.data.id)
      .then((d) => {
        if (d.success) {
          setDeleteModal({ open: false, record: null });
          messageApi.info("Тест устсан.", [3]);
          getConstant();
        } else {
          messageApi.error(d.message || "Тест устгахад алдаа гарлаа.");
        }
      })
      .catch(() => {
        message.error("Сервертэй холбогдоход алдаа гарлаа");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Spin tip="Уншиж байна..." fullscreen spinning={loading} />
      {contextHolder}
      <InfoModal
        open={deleteModal.open}
        onOk={() => {
          if (deleteModal.record) {
            handleDelete(deleteModal.record);
          }
        }}
        onCancel={() => setDeleteModal({ open: false, record: null })}
        text={`${deleteModal.record?.data?.name}-ийг устгах гэж байна. Итгэлтэй байна уу?`}
      />
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
          <div>
            <Select
              className="w-56"
              placeholder="Төрлөөр хайх"
              suffixIcon={<DropdownIcon width={15} height={15} />}
              options={typeOptions}
              onChange={(value) => setTypeFilter(value)}
              allowClear
              onClear={() => setTypeFilter(null)}
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
          rowKey={(record) => record.data.id}
          onRow={(record) => ({
            onClick: () => router.push(`/test?id=${record.data.id}`),
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
