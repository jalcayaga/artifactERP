import React from "react";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; header: string }[];
  renderRowActions?: (item: T) => React.ReactNode;
}

const Table = <T extends { id: string | number }>({ data, columns, renderRowActions }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="border-b border-blue-gray-100/5 py-4 px-4"
              >
                <p className="block font-sans text-xs font-bold uppercase text-blue-gray-200 opacity-70">
                  {column.header}
                </p>
              </th>
            ))}
            {renderRowActions && (
              <th className="border-b border-blue-gray-100/5 py-4 px-4">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const isLast = index === data.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-100/5";

            return (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                {columns.map((column) => (
                  <td key={String(column.key)} className={classes}>
                    <p className="block font-sans text-sm font-medium text-white">
                      {String(item[column.key])}
                    </p>
                  </td>
                ))}
                {renderRowActions && (
                  <td className={classes}>
                    <div className="flex justify-end gap-2">
                      {renderRowActions(item)}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
