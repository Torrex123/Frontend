import axios from 'axios';
import { LANGUAGES } from '@/app/components/language.selector';

const pixonApi = axios.create({
    baseURL:  'https://emkc.org/api/v2/piston',
});


export const runCode = async (language: string, code: string) => {
    try {
        const response = await pixonApi.post('/execute', {
            "language": language,
            "version": LANGUAGES[language],
            "files": [
                {
                "content": code
                }
            ],
        });
        return response.data;
    } catch (error) {
        return error;
    }
}