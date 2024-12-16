export type SectorQuestionType = {
  sector: string;
  category: string;
  id: number;
  text: string;
  is_required: boolean;
  requires_file_upload: boolean;
  choices: SectorQuestionChoiceType[];
};

export type SectorQuestionChoiceType = {
  id: number;
  description: string;
  value: string;
};

export type SectorDataType = SectorQuestionType;

export type QuestionAnswerType = Record<
  string,
  {
    answer: string;
    file?: string; // File | null;
  }
>;

export type UploadedQuestionAnswerType = {
  [question_id: string]: string; //File
};

export type QuestionAnswerAnalysisPreCheckType = {
  [sector: string]: {
    allAnswered: boolean;
    allReqAnswered: boolean;
    someAnswered: boolean;
  };
};
export type SessionDataType = {
  id: number;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    country_name: string;
  };
  session_date: string;
  session_status: "PartialStop" | "Start" | "Pause" | "Stop";
  responses: {
    id: number;
    question: number;
    selected_choice: number;
    response_date: string;
  }[];

  analyses: {
    sector_analyses: {
      sector: string;
      score: string;
      label: string;
    }[];

    category_analyses: {
      category: string;
      score: string;
      label: string;
    }[];
    overall_sector_scores: [
      {
        sector: string;
        total_score: number;
        label: string;
        recommendations: string[];
      }
    ];
  };
  overall_score: {
    total_score: number;
    label: string;
  };
};

export type SesctorGraphDataAnalysisType = {
  session_date: string;
  analysis: {
    sector: string;
    score: string;
    label: string;
    category: string;
    session_date: string;
  }[];
};

export type SubmitSectorQuizResponseType = {
  detail: string;
  session: {
    id: number;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      country_name: string;
    };
    session_date: string;
    session_status: "PartialStop" | "Start" | "Pause" | "Stop";
    responses: {
      id: number;
      question: number;
      selected_choice: number;
      response_date: string;
    }[];
    analyses: {
      sector_analyses: {
        sector: string;
        score: string;
        label: string;
      }[];
      category_analyses: {
        category: string;
        score: string;
        label: string;
      }[];
      overall_sector_scores: {
        sector: string;
        total_score: 29.5;
        label: string;
        recommendations: string[];
      }[];
    };
    overall_score: {
      total_score: number;
      label: string;
    };
  };
  sectors_analyzed: [];
};

// export type { SectorQuestionType as Sector, SectorQuestionChoiceType as Choice, SectorDataType };
