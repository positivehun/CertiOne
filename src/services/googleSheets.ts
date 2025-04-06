import { Question, Sheet } from '../types';

// 고정된 시트 ID
const FIXED_SHEET_ID = '1lbdwRNzG30akrgbHx-DClXH6WS28hwEv2MWVGvNHIGs';

export async function getSheets(): Promise<Sheet[]> {
  try {
    console.log('Fetching sheets from spreadsheet:', FIXED_SHEET_ID);
    const response = await fetch(`http://localhost:3000/api/sheets/${FIXED_SHEET_ID}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch sheets: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const data = await response.json();
    console.log('Sheets response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching sheets:', error);
    throw error;
  }
}

export async function getQuestionsFromSheet(sheetName: string): Promise<Question[]> {
  try {
    console.log('Fetching questions from sheet:', FIXED_SHEET_ID, 'sheet name:', sheetName);
    const response = await fetch(
      `http://localhost:3000/api/questions/${FIXED_SHEET_ID}/${encodeURIComponent(sheetName)}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const data = await response.json();
    console.log('Questions response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
} 