export const AssessmentType = {
  TEST: 10,
  UNELGEE: 20,
};

export const QUESTION_TYPES = {
  SINGLE: 10,
  MULTIPLE: 20,
  TRUE_FALSE: 30,
  MATRIX: 40,
  CONSTANT_SUM: 50,
  TEXT: 60,
};

export const customLocale = {
  filterTitle: "Шүүлтүүр",
  filterConfirm: "Сонгох",
  filterReset: "Цэвэрлэх",
  filterEmptyText: "Өгөгдөл олдсонгүй",
  filterCheckall: "Бүгдийг сонгох",
  filterSearchPlaceholder: "Хайх",
  emptyText: "Өгөгдөл олдсонгүй",
  selectAll: "Энэ хуудсыг сонгох",
  selectInvert: "Сонголтыг эсрэгээр нь",
  selectNone: "Бүх сонгосныг арилгах",
  selectionAll: "Бүх өгөгдлийг сонгох",
  sortTitle: "Эрэмбэлэх",
  expand: "Мөр өргөтгөх",
  collapse: "Мөр хураах",
  triggerDesc: "Буурахаар эрэмбэлэх",
  triggerAsc: "Өсөхөөр эрэмбэлэх",
  cancelSort: "Эрэмбэлэлт цуцлах",
};

export const getDefaultAnswers = (type, count = 4) => {
  const templates = {
    [QUESTION_TYPES.SINGLE]: (i) => ({
      answer: {
        value: `Сонголт ${i + 1}`,
        point: 0,
        orderNumber: i,
        category: null,
        correct: false,
      },
    }),
    [QUESTION_TYPES.MULTIPLE]: (i) => ({
      answer: {
        value: `Сонголт ${i + 1}`,
        point: 0,
        orderNumber: i,
        category: null,
        correct: false,
      },
    }),
    [QUESTION_TYPES.TRUE_FALSE]: (i) => ({
      answer: {
        value: i === 0 ? "Үнэн" : "Худал",
        point: i === 0 ? 1 : 0,
        orderNumber: i,
        category: null,
        correct: i === 0,
      },
    }),
    [QUESTION_TYPES.MATRIX]: (i) => ({
      answer: {
        value: `Сонголт ${i + 1}`,
        point: 0,
        orderNumber: i,
        category: null,
      },
      matrix: Array.from({ length: count }, (_, j) => ({
        value: `Цэг ${j + 1}`,
        category: null,
        orderNumber: j,
      })),
    }),
    [QUESTION_TYPES.CONSTANT_SUM]: (i) => ({
      answer: {
        value: `Сонголт ${i + 1}`,
        orderNumber: i,
        category: null,
      },
    }),
    [QUESTION_TYPES.TEXT]: () => [],
  };

  if (type === QUESTION_TYPES.TEXT) return [];

  return Array.from({ length: count }, (_, i) => templates[type](i));
};

export const questionTypes = [
  { value: QUESTION_TYPES.SINGLE, label: "Нэг хариулттай" },
  { value: QUESTION_TYPES.MULTIPLE, label: "Олон хариулттай" },
  { value: QUESTION_TYPES.TRUE_FALSE, label: "Үнэн, худал" },
  { value: QUESTION_TYPES.TEXT, label: "Текст оруулах" },
  { value: QUESTION_TYPES.MATRIX, label: "Матриц" },
  { value: QUESTION_TYPES.CONSTANT_SUM, label: "Оноо байршуулах" },
];
