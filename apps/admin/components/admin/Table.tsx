import React from "react";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; header: string }[];
  renderRowActions?: (item: T) => React.ReactNode;
}

const Table = <T extends { id: string | number }>({ data, columns, renderRowActions }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto card-premium">
      <table className="min-w-full divide-y divide-[rgba(var(--border-color),0.1)]">
        <thead className="bg-[rgba(var(--bg-secondary),0.5)]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {renderRowActions && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(var(--border-color),0.1)]">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-[rgba(var(--brand-color),0.05)] transition-colors">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--text-primary))]">
                  {String(item[column.key])}
                </td>
              ))}
              {renderRowActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderRowActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
