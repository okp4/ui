/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

/** @typedef {Record<'performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa', number>} LighthouseSummary */

/** @type {Record<keyof LighthouseSummary, string>} */
const summaryKeys = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
  pwa: 'PWA',
};

/** @param {number} rawScore */
const scoreEntry = (rawScore) => {
  const score = Math.round(rawScore * 100);
  // eslint-disable-next-line no-nested-ternary
  const scoreIcon = score >= 90 ? '🟢' : score >= 50 ? '🟠' : '🔴';
  return `${scoreIcon} ${score}`;
};

/**
 * @param {Object} param0
 * @param {LighthouseSummary} param0.summary
 */
const createMarkdownTableRow = ({summary}) =>
  [ '', 
    .../** @type {(keyof LighthouseSummary)[]} */ (
      Object.keys(summaryKeys)
    ).map((k) => scoreEntry(summary[k])),
    `[Report](link to report) |`,
  ].join(' | ');

const createMarkdownTableHeader = () => [
  ['', ...Object.values(summaryKeys), 'Report |'].join(' | '),
  ['', ...Array(Object.keys(summaryKeys).length).fill('---'), '---|'].join(
    '|',
  ),
];

/**
 * @param {Object} param0
 * @param {Record<string, string>} param0.links
 * @param {{url: string, summary: LighthouseSummary}[]} param0.results
 */
const createLighthouseReport = ({results, links}) => {
  const tableHeader = createMarkdownTableHeader();
  const tableBody = results.map((result) => {
    // const testUrl = /** @type {string} */ (
    //   Object.keys(links).find((key) => key === result.url)
    // );
    // const reportPublicUrl = /** @type {string} */ (links[testUrl]);

    return createMarkdownTableRow({
      summary: result.summary,
    });
  });
  const comment = [
    '### ⚡️ Lighthouse report for the deploy preview of this PR',
    '',
    ...tableHeader,
    ...tableBody,
    '',
  ];
  return comment.join('\n');
};

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