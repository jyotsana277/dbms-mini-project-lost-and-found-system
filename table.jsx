import "./table.css";

/*Props
-columns → array of column names
- data → array of objects (rows)
- actions (optional) → buttons (Edit/Delete/Approve)
Renders
- A <table>
- <th> for each column
- <td> for each row field*/ 
export default function Table({ columns, data, actions }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j}>{row[col]}</td>
            ))}

            {actions && (
              <td>
                {actions.map((action, k) => (
                  <button 
                    key={k} 
                    onClick={() => action.onClick(row)}
                    className="btn"
                    style={{ marginRight: "6px" }}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}