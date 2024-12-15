export const resourceLinks = /**@type {const}*/ ({
    finance: [
      {
        title: "NDC Investment Planning Guide",
        url: "https://ndcpartnership.org/sites/default/files/2023-12/ndc-investment-planning-guide-best-practice-brief2023.pdf",
      },
      {
        title: "Finance at the NDC Partnership",
        url: "https://ndcpartnership.org/sites/default/files/2023-09/finance-ndc-partnership-insight-brief.pdf",
      },
      {
        title: "NDC Partnership Finance Strategy",
        url: "https://ndcpartnership.org/sites/default/files/2023-09/ndc-partnership-finance-strategy.pdf",
      },
    ],
    technical: [
      {
        title: "Enhancing NDCs: A Guide to Strengthening National Climate Plans",
        url: "https://ndcpartnership.org/knowledgeportal/climatetoolbox/enhancingndcsguidestrengtheningnationalclimateplans",
      },
      {
        title: "UNFCCC Capacity-Building Portal",
        url: "https://unfccc.int/topics/capacity-building/workstreams/capacity-building-portal/capacity-building-portal-resources-on-ndc",
      },
      {
        title: "NDC Partnership's Climate Toolbox",
        url: "https://ndcpartnership.org/knowledgeportal/climate-toolbox/capacity-building-resources-accessing-mobilizing-scaling-climate-finance",
      },
    ],
    governance: [
      {
        title: "Planning for NDC Implementation:  A Quick-Start Guide",
        url: "https://ndcguide.cdkn.org/book/planning-for-ndc-implementation-a-quick-start-guide/delivering-the-plan/",
      },
      {
        title: "Institutional Capacities for NDC Implementation",
        url: "https://ndcpartnership.org/knowledgeportal/climate-toolbox/institutional-capacities-ndc-implementation-guidance-document",
      },
      {
        title: "Enhancing Capacities for NDC Preparation and Implementation",
        url: "https://unfccc.int/sites/default/files/resource/NDC%20Workshop.pdf",
      },
    ],
    monitoring: [
      {
        title: "Planning for NDC Implementation:  MRV Guide",
        url: "https://ndcguide.cdkn.org/book/planning-for-ndc-implementation-a-quick-start-guide/measuring-reporting-and-verification/",
      },
      {
        title: "NDC Implementation Monitoring and Tracking Training Manual",
        url: "https://atpsnet.org/wp-content/uploads/2024/03/NDC-English.pdf",
      },
      {
        title: "Capacity-Building Resource E-Booklets",
        url: "https://ndcpartnership.org/knowledge-portal/climate-toolbox/capacity-building-resource-e-booklets",
      },
    ],
  });
  
  /**
   * Transforms resource links into select options based on provided sectors.
   *
   * @param {string[]} sectors - Array of sector names to map.
   * @returns {object} - Transformed object with sector keys mapped to their resource links.
   */
  export function transformResourceLinksToSelectOptions(sectors) {
    const newHashTable = {
      "Monitoring and Evaluation": "monitoring",
      Financial: "finance",
      Technical: "technical",
      Governance: "governance",
    };
  
    const obj = {};
    for (const sector of sectors) {
      obj[sector] = resourceLinks[newHashTable[sector]];
    }
    return obj;
  }
  