const createLighthouseReport = input => "report";

const createLighthouseReportAdapter = (summary) => createLighthouseReport(
  { 
    links: {}, 
    results: [
      {
        url: '',
        summary
      }
    ]
  }
);

export default createLighthouseReportAdapter;