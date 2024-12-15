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
  
  export type SectorDataType = SectorQuestionType
  
  export type QuestionAnswerType = Record<
    string,
    {
      answer: string;
      file?:string// File | null;
    }
  >;
  
  export type UploadedQuestionAnswerType ={
      [question_id:string]:string//File
  }
  
  export type QuestionAnswerAnalysisPreCheckType={
      [sector:string]:{
        allAnswered:boolean,
        allReqAnswered:boolean,
        someAnswered:boolean,
      }
  }
  
  // export type { SectorQuestionType as Sector, SectorQuestionChoiceType as Choice, SectorDataType };
  