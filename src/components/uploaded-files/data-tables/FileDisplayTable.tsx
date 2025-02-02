import React from 'react';
import Card from 'components/card';
import { RiFileDownloadLine } from 'react-icons/ri';
import { FaDownload } from 'react-icons/fa';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

type FileRowObject = {
  name: string;
  createdOn: string;
  size: string;
  type: string;
};

const columnHelper = createColumnHelper<FileRowObject>();

function CheckTable(props: { tableData: FileRowObject[] }) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState<FileRowObject[]>([]);

  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NAME</p>
      ),
      cell: (info) => {
        const file = info.row.original; // Access the original data object
        return (
          <div className="flex items-center">
            <span className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </span>
            <a
              href={`/api/download?file=${file.name}`}
              className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" // Styling for the icon
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDownload />
            </a>
          </div>
        );
      },
    }),
    columnHelper.accessor('createdOn', {
      id: 'createdOn',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          CREATED ON
        </p>
      ),
      cell: (info) => {
        const date = new Date(info.getValue());
        const formattedDate = date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {formattedDate}
          </p>
        );
      },
    }),
    columnHelper.accessor('size', {
      id: 'size',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">SIZE</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('type', {
      id: 'type',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">TYPE</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,  // Remove in production
  });

  return (
    <Card extra={'w-full h-full sm:overflow-auto px-6'}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-gray-200 dark:border-white/30"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className="relative cursor-pointer px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-white" // Added relative positioning
                  >
                    <div className="flex items-center">
                      {' '}
                      {/* Added flex container */}
                      <span className="mr-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>
                      {header.column.getIsSorted() ? (
                        <span className="inline-block">
                          {header.column.getIsSorted() === 'asc' ? '▲' : '▼'}
                        </span>
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-50 dark:border-white/30 dark:hover:bg-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-white"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default CheckTable;
