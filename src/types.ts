export type Difficulties = 'easy' | 'medium' | 'hard'

type QuestionType = "boolean" | "multiple"

export type Question = {
    category: string
    type: QuestionType
    difficulty: Difficulties
    question: string
    correct_answer: string
    incorrect_answers: Array<string>
}

export type OpenTDBResponse = {
    response_code: number
    results: Array<Question>
}