export default {
  appTitle: 'Набор конвертеров файлов',
  title: 'Конвертер Excel в SQL',
  subtitle: 'Загрузите файл Excel для преобразования в SQL запросы с автоматическим определением типов данных',
  uploadFile: 'Выберите файл',
  configureColumns: 'Настройка типов столбцов',
  tableName: 'Имя таблицы',
  tableNamePlaceholder: 'моя_таблица',
  generateSQL: 'Сгенерировать SQL',
  generateAndDownload: 'Сгенерировать и скачать',
  generatedSQL: 'Сгенерированный SQL',
  copyToClipboard: 'Копировать в буфер',
  downloadSQL: 'Скачать SQL файл',
  copiedSuccess: 'SQL скопирован в буфер обмена!',
  columnTypes: {
    varchar: 'VARCHAR(255)',
    int: 'INT',
    bigint: 'BIGINT',
    decimal: 'DECIMAL(10,2)',
    date: 'DATE',
    datetime: 'DATETIME',
    text: 'TEXT',
    boolean: 'BOOLEAN'
  },
  themes: {
    light: 'Светлая тема',
    dark: 'Темная тема',
    warm: 'Теплая тема',
    cold: 'Холодная тема'
  },
  nav: {
    excelToSQL: 'Excel → SQL',
    excelToWord: 'Excel → Word',
    excelToPDF: 'Excel → PDF',
    excelToJPG: 'Excel → JPG',
    pdfToWord: 'PDF → Word',
    pdfToExcel: 'PDF → Excel',
    pdfToJPG: 'PDF → JPG',
    wordToPDF: 'Word → PDF',
    wordToJPG: 'Word → JPG',
    wordEditor: 'Редактор Word',
    mdToPDF: 'MD → PDF'
  },
  common: {
    chooseFile: 'Выбрать файл',
    convert: 'Конвертировать',
    download: 'Скачать',
    converting: 'Конвертация',
    featureComingSoon: 'Эта функция скоро появится! Полная реализация в процессе.'
  },
  pages: {
    excelToWord: {
      title: 'Конвертер Excel в Word',
      desc: 'Конвертируйте таблицы Excel в документы Word'
    },
    excelToPDF: {
      title: 'Конвертер Excel в PDF',
      desc: 'Конвертируйте таблицы Excel в PDF документы'
    },
    excelToJPG: {
      title: 'Конвертер Excel в JPG',
      desc: 'Конвертируйте таблицы Excel в изображения JPG'
    },
    pdfToWord: {
      title: 'Конвертер PDF в Word',
      desc: 'Конвертируйте PDF документы в формат Word'
    },
    pdfToExcel: {
      title: 'Конвертер PDF в Excel',
      desc: 'Извлекайте таблицы из PDF в Excel'
    },
    pdfToJPG: {
      title: 'Конвертер PDF в JPG',
      desc: 'Конвертируйте страницы PDF в изображения JPG'
    },
    wordEditor: {
      title: 'Онлайн редактор Word',
      desc: 'Редактируйте и создавайте документы Word онлайн',
      placeholder: 'Начните печатать здесь...',
      uploadFile: 'Загрузить файл .docx',
      newDocument: 'Новый документ',
      confirmClear: 'Вы уверены, что хотите очистить документ и начать новый?'
    },
    wordToPDF: {
      title: 'Конвертер Word в PDF',
      desc: 'Конвертируйте документы Word в формат PDF'
    },
    wordToJPG: {
      title: 'Конвертер Word в JPG',
      desc: 'Конвертируйте документы Word в изображения JPG'
    },
    mdToPDF: {
      title: 'Конвертер Markdown в PDF',
      desc: 'Конвертируйте файлы Markdown в формат PDF'
    }
  }
}
