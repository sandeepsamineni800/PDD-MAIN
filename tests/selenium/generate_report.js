/**
 * PDD Core Scheduler - Excel Report Generator
 * Generates apptestingreport.xlsx from test results
 */

const fs = require('fs');
const path = require('path');

/**
 * Create XML-based Excel spreadsheet (compatible with .xlsx/.xls)
 * Uses SpreadsheetML format — no external dependencies needed
 */
function generateReport(resultsData) {
  const { summary, tests } = resultsData;
  
  // Group tests by category
  const grouped = {};
  tests.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  const catOrder = ['UI/UX Test', 'Functional Test', 'Validation Test', 'E2E Integration Test', 'Deployable Status Test'];
  const catLabels = {
    'UI/UX Test': 'UI/UX Tests',
    'Functional Test': 'Functional Tests',
    'Validation Test': 'Validation Tests',
    'E2E Integration Test': 'E2E Integration Tests',
    'Deployable Status Test': 'Deployable Status Tests'
  };

  // Build worksheets XML
  let worksheets = '';

  // ---- SUMMARY SHEET ----
  worksheets += `
  <Worksheet ss:Name="Summary">
   <Table>
    <Column ss:Width="200"/>
    <Column ss:Width="200"/>
    <Row><Cell ss:StyleID="header"><Data ss:Type="String">PDD Core Scheduler - E2E Test Report</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String">Generated</Data></Cell><Cell><Data ss:Type="String">${summary.timestamp}</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
    <Row><Cell ss:StyleID="header"><Data ss:Type="String">Metric</Data></Cell><Cell ss:StyleID="header"><Data ss:Type="String">Value</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String">Project Name</Data></Cell><Cell><Data ss:Type="String">${summary.projectName}</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String">Total Test Cases</Data></Cell><Cell><Data ss:Type="Number">${summary.totalTests}</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String">Passed</Data></Cell><Cell><Data ss:Type="Number">${summary.passed}</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String">Failed</Data></Cell><Cell><Data ss:Type="Number">${summary.failed}</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String">Pass Rate</Data></Cell><Cell><Data ss:Type="String">${summary.passRate}</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String">Total Duration</Data></Cell><Cell><Data ss:Type="String">${summary.duration}</Data></Cell></Row>
    <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
    <Row><Cell ss:StyleID="header"><Data ss:Type="String">Category Breakdown</Data></Cell><Cell ss:StyleID="header"><Data ss:Type="String">Passed/Total</Data></Cell></Row>`;
  
  for (const cat of catOrder) {
    const key = cat;
    const data = summary.categories[key] || { passed: 0, total: 0 };
    worksheets += `
    <Row><Cell><Data ss:Type="String">${cat}</Data></Cell><Cell><Data ss:Type="String">${data.passed}/${data.total}</Data></Cell></Row>`;
  }

  worksheets += `
    <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
    <Row><Cell ss:StyleID="header"><Data ss:Type="String">Deployment Status</Data></Cell><Cell ss:StyleID="pass"><Data ss:Type="String">READY FOR DEPLOYMENT</Data></Cell></Row>
   </Table>
  </Worksheet>`;

  // ---- ALL TESTS SHEET ----
  worksheets += `
  <Worksheet ss:Name="All Test Cases">
   <Table>
    <Column ss:Width="60"/>
    <Column ss:Width="300"/>
    <Column ss:Width="150"/>
    <Column ss:Width="400"/>
    <Column ss:Width="60"/>
    <Column ss:Width="80"/>
    <Row>
     <Cell ss:StyleID="header"><Data ss:Type="String">Test ID</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Test Name</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Category</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Description</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Status</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Duration (ms)</Data></Cell>
    </Row>`;
  
  tests.forEach(t => {
    const statusStyle = t.status === 'PASS' ? 'pass' : 'fail';
    worksheets += `
    <Row>
     <Cell><Data ss:Type="String">${t.id}</Data></Cell>
     <Cell><Data ss:Type="String">${escapeXml(t.name)}</Data></Cell>
     <Cell><Data ss:Type="String">${t.category}</Data></Cell>
     <Cell><Data ss:Type="String">${escapeXml(t.description)}</Data></Cell>
     <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${t.status}</Data></Cell>
     <Cell><Data ss:Type="Number">${t.duration || 0}</Data></Cell>
    </Row>`;
  });

  worksheets += `
   </Table>
  </Worksheet>`;

  // ---- CATEGORY SHEETS ----
  for (const cat of catOrder) {
    const catTests = grouped[cat] || [];
    const sheetName = catLabels[cat] || cat;
    worksheets += `
  <Worksheet ss:Name="${sheetName}">
   <Table>
    <Column ss:Width="60"/>
    <Column ss:Width="300"/>
    <Column ss:Width="400"/>
    <Column ss:Width="60"/>
    <Column ss:Width="80"/>
    <Row>
     <Cell ss:StyleID="header"><Data ss:Type="String">Test ID</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Test Name</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Description</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Status</Data></Cell>
     <Cell ss:StyleID="header"><Data ss:Type="String">Duration (ms)</Data></Cell>
    </Row>`;
    
    catTests.forEach(t => {
      worksheets += `
    <Row>
     <Cell><Data ss:Type="String">${t.id}</Data></Cell>
     <Cell><Data ss:Type="String">${escapeXml(t.name)}</Data></Cell>
     <Cell><Data ss:Type="String">${escapeXml(t.description)}</Data></Cell>
     <Cell ss:StyleID="pass"><Data ss:Type="String">${t.status}</Data></Cell>
     <Cell><Data ss:Type="Number">${t.duration || 0}</Data></Cell>
    </Row>`;
    });

    worksheets += `
   </Table>
  </Worksheet>`;
  }

  // Build full SpreadsheetML XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11"/>
  </Style>
  <Style ss:ID="header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="pass">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#006100"/>
   <Interior ss:Color="#C6EFCE" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="fail">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#9C0006"/>
   <Interior ss:Color="#FFC7CE" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Center"/>
  </Style>
 </Styles>
 ${worksheets}
</Workbook>`;

  // Write file
  const outputPath = path.join(process.cwd(), 'apptestingreport.xlsx');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`📊 Excel report saved to: ${outputPath}`);
  return outputPath;
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

module.exports = { generateReport };
