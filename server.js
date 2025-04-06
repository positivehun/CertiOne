import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  keyFile: join(__dirname, 'credential.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// 시트 목록 가져오기
app.get('/api/sheets/:spreadsheetId', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: req.params.spreadsheetId,
    });
    res.json(response.data.sheets.map(sheet => ({
      id: sheet.properties.sheetId,
      title: sheet.properties.title
    })));
  } catch (error) {
    console.error('Error fetching sheets:', error);
    res.status(500).json({ error: 'Failed to fetch sheets' });
  }
});

// 특정 시트의 문제 가져오기
app.get('/api/questions/:spreadsheetId/:sheetName', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: req.params.spreadsheetId,
      range: `'${req.params.sheetName}'!A2:B1000`,
    });
    
    const questions = response.data.values?.map(([question, answer]) => ({
      question,
      answer
    })) || [];
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// 기존 API와의 호환성을 위한 엔드포인트
app.get('/api/questions/:spreadsheetId', async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    console.log('Fetching questions from default sheet in spreadsheet:', spreadsheetId);
    
    // 먼저 스프레드시트의 모든 시트 목록을 가져옵니다
    const sheetsResponse = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    // 첫 번째 시트의 이름을 가져옵니다
    const firstSheet = sheetsResponse.data.sheets[0];
    if (!firstSheet) {
      return res.json([]);
    }
    
    const sheetName = firstSheet.properties.title;
    console.log('Using first sheet:', sheetName);
    
    // 해당 시트의 데이터를 가져옵니다
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${sheetName}'!A2:B`,
    });

    console.log('API Response:', response.data);

    const rows = response.data.values;
    if (!rows) {
      console.log('No data found in the sheet');
      return res.json([]);
    }

    const questions = rows.map((row) => ({
      question: row[0] || '',
      answer: row[1] || '',
    }));

    res.json(questions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '문제를 불러오는데 실패했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 