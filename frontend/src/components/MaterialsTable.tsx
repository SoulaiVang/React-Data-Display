interface MaterialsTableProps {
    data: Record<string, any>[];
    showId: boolean; // Show ID state passed from parent
    selectedRowIndex: number | null;
    onRowClick: (index: number) => void;
}
  
const MaterialsTable = ({ data, showId, selectedRowIndex, onRowClick }: MaterialsTableProps) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  // Extract headers dynamically from the keys of the first object in the data array
  const headers = Object.keys(data[0]);

  return (
    <table className="materials-table">
      <thead>
        <tr>
          {headers.map((header) => {
            // Only render the header if it's not 'id' or if showId is true
            if (header === 'Id' && !showId) {
              return null; // Skip rendering this header if 'id' should be hidden
            }
            return <th key={header}>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
          key={rowIndex}
          className={selectedRowIndex === rowIndex ? 'highlight' : 'materials-table-row'}
          onClick={() => onRowClick(rowIndex)}
          >
            {headers.map((header) => {
              // Only render the 'id' column if showId is true
              if (header === 'Id' && !showId) {
                return null; // Skip rendering this column if 'id' should be hidden
              }
              return <td key={header}>{row[header] ?? 'NULL'}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaterialsTable;  