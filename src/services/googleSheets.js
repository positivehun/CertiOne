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
    console.log('Fetching questions from sheet:', sheetName);
    const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!A2:B1000?key=${API_KEY}`;
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
      throw new Error(`Failed to fetch questions: ${response.status}`);
    }

    const data = await response.json();
    console.log('Questions data:', data);
    return data.values?.map(([question, answer]) => ({
      question,
      answer
    })) || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}; 