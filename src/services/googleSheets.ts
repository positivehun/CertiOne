import { Question, Sheet } from '../types';

const SPREADSHEET_ID = process.env.VITE_SPREADSHEET_ID;
const API_KEY = process.env.VITE_GOOGLE_API_KEY;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export const getSheets = async (): Promise<Sheet[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${SPREADSHEET_ID}/sheets/${API_KEY}`);
    const data = await response.json();
    return data.sheets.map((sheet: any) => ({
      id: sheet.properties.sheetId,
      title: sheet.properties.title
    }));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching sheets:', error);
    }
    throw error;
  }
};

export const getQuestionsFromSheet = async (sheetName: string): Promise<Question[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!A:B${API_KEY}`);
    const data = await response.json();
    
    if (!data.values || data.values.length <= 1) {
      return [];
    }

    // 첫 번째 행(헤더)를 제외하고 문제와 답을 매핑
    return data.values.slice(1).map((row: any) => ({
      question: row[0] || '',
      answer: row[1] || ''
    }));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching questions:', error);
    }
    throw error;
  }
}; 