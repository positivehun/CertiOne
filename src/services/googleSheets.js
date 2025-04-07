import axios from 'axios';

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export const getSheets = async () => {
  try {
    console.log('Fetching sheets with ID:', SPREADSHEET_ID);
    const url = `${BASE_URL}/${SPREADSHEET_ID}?key=${API_KEY}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error Response:', errorData);
      throw new Error(`Failed to fetch sheets: ${response.status}`);
    }

    const data = await response.json();
    console.log('Sheets data:', data);
    return data.sheets.map((sheet) => ({
      id: sheet.properties.sheetId,
      title: sheet.properties.title
    }));
  } catch (error) {
    console.error('Error fetching sheets:', error);
    throw error;
  }
};

export const getQuestionsFromSheet = async (sheetName) => {
  try {
    // 시트 이름이 없는 경우 기본값 설정
    const targetSheet = sheetName || '정보처리기사';
    
    // 시트 이름에 특수문자가 있는 경우를 대비해 인코딩
    const encodedSheetName = encodeURIComponent(targetSheet);
    
    console.log('Fetching questions from sheet:', targetSheet);
    
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedSheetName}!A2:B1000?key=${API_KEY}`
    );

    console.log('API Response:', response.data);

    if (response.data.values && response.data.values.length > 0) {
      return response.data.values.map(([question, answer]) => ({
        question: question || '',
        answer: answer || ''
      }));
    }
    
    console.log('No questions found in sheet:', targetSheet);
    return [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
}; 