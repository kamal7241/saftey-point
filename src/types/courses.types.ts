export interface Question {
    id: number;
    title: string;
    description: string;
    type: string;
    options: Array<{
        optionText: string;
        isCorrect: boolean;
    }>;
}
