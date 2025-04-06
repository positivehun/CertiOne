export interface Question {
  question: string;
  answer: string;
}

export interface Sheet {
  id: string;
  title: string;
}

export interface Subject {
  id: string;
  name: string;
  sheetId: string;
  sheetName: string;
} 