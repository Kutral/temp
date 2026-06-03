export type ManagerRoundDomain = {
  title: string
  managerAngle: string
  mustExplain: string[]
  mustMemorize: string[]
  likelyQuestions: string[]
  answerFormula: string
}

export type ManagerRoundFlow = {
  title: string
  interviewPrompt: string
  steps: string[]
  talkTrack: string
  evidence: string[]
}

export type ManagerRoundScenario = {
  title: string
  prompt: string
  firstChecks: string[]
  signals: string[]
  answerFrame: string[]
  escalateWhen: string
}

export type ManagerRoundQuestionGroup = {
  title: string
  focus: string
  questions: {
    question: string
    answer: string[]
  }[]
}

export type ManagerRoundStudyBlock = {
  title: string
  items: string[]
}

export type ManagerRoundSource = {
  title: string
  whyItMatters: string
  url: string
}
