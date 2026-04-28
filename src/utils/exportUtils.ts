/**
 * Utility to export data to an MS Excel compatible XML format (.xls)
 * This allows for multiple columns and correct data types without external libraries.
 */
export const exportToExcel = (headers: string[], rows: (string | number)[][], fileName: string) => {
  const worksheetName = "Report";
  
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#2563EB" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="cell">
   <Alignment ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${worksheetName}">
  <Table>
   <Row ss:Height="25">
    ${headers.map(h => `
    <Cell ss:StyleID="header">
     <Data ss:Type="String">${h}</Data>
    </Cell>`).join('')}
   </Row>
   ${rows.map(row => `
   <Row ss:Height="20">
    ${row.map(cell => {
      const type = typeof cell === 'number' ? 'Number' : 'String';
      const cleanCell = typeof cell === 'string' ? cell.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : cell;
      return `
    <Cell ss:StyleID="cell">
     <Data ss:Type="${type}">${cleanCell}</Data>
    </Cell>`;
    }).join('')}
   </Row>`).join('')}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
