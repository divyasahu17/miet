import React, { createContext, useContext } from 'react';
import { FaEdit, FaEye, FaSearch, FaTrash, FaUserSlash } from 'react-icons/fa';
import styles from './admin.module.css';
import { filterAndSortData, getTotalPages, paginateData } from './dashboard.utils';

export type DashboardTableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
};

export type DashboardTableContext = {
  searchTerm: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  onSearch: (value: string) => void;
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
};

type DashboardTableProps = {
  data: any[];
  columns: DashboardTableColumn[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onHardDelete?: (item: any) => void;
  onView?: (item: any) => void;
  searchPlaceholder?: string;
  title?: string;
};

export const AdminTableContext = createContext<DashboardTableContext | null>(null);

export const DashboardDataTable = ({
  data,
  columns,
  onEdit,
  onDelete,
  onHardDelete,
  onView,
  searchPlaceholder = 'Search...',
  title = 'Data Table'
}: DashboardTableProps) => {
  const context = useContext(AdminTableContext);
  if (!context) {
    throw new Error('DashboardDataTable must be used within an AdminTableContext.Provider');
  }

  const filteredData = filterAndSortData(data, context.searchTerm, context.sortField, context.sortDirection);
  const paginatedData = paginateData(filteredData, context.currentPage, context.itemsPerPage);
  const totalPages = getTotalPages(filteredData.length, context.itemsPerPage);

  return (
    <div className={styles.extractedStyle1}>
      <div className={styles.extractedStyle2}>
        <div className={styles.extractedStyle3}>
          <h3 className={styles.extractedStyle4}>{title}</h3>
          <div className={styles.extractedStyle5}>
            <div className={styles.extractedStyle6} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FaSearch className={styles.extractedStyle7} style={{ position: 'absolute', left: '12px', zIndex: 10, color: '#9ca3af' }} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={context.searchTerm}
                onChange={(e) => context.onSearch(e.target.value)}
                className={`admin-search-input ${styles.extractedStyle8}`}
                style={{ paddingLeft: '40px' }} // Fix input overlap explicitly
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.backgroundColor = '#1e293b';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4a5568';
                  e.target.style.backgroundColor = '#2d3748';
                }}
              />
            </div>
          </div>
        </div>
      </div>

        <div className={styles.extractedStyle9}>
          <table className={styles.extractedStyle10}>
            <thead>
              <tr className={styles.extractedStyle11}>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => column.sortable && context.onSort(column.key)}
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: column.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={column.sortable ? (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)' : undefined}
                    onMouseLeave={column.sortable ? (e) => e.currentTarget.style.background = 'transparent' : undefined}
                  >
                    <div className={styles.extractedStyle12}>
                      {column.label}
                      {column.sortable && (
                        <span className={styles.extractedStyle13}>
                          {context.sortField === column.key ? (context.sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete || onHardDelete || onView) && (
                  <th className={styles.extractedStyle14}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={row.id || index} style={{
                  background: index % 2 === 0 ? '#f8fafc' : '#fff',
                  transition: 'all 0.2s ease'
                }}>
                  {columns.map((column) => (
                    <td key={column.key} className={styles.extractedStyle15}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onHardDelete || onView) && (
                    <td className={styles.extractedStyle16}>
                      <div className={styles.extractedStyle17}>
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className={styles.extractedStyle18}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                          >
                            <FaEye size={14} /> View
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className={styles.extractedStyle19}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                          >
                            <FaEdit size={14} /> Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className={styles.extractedStyle20}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
                          >
                            <FaTrash size={14} /> Delete
                          </button>
                        )}
                        {onHardDelete && (
                          <button
                            onClick={() => onHardDelete(row)}
                            className={styles.extractedStyle20}
                            style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', border: '1px solid #dc2626' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220, 38, 38, 1)'; e.currentTarget.style.color = '#fff' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'; e.currentTarget.style.color = '#dc2626' }}
                          >
                            <FaUserSlash size={14} /> Hard Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.extractedStyle21}>
            <div className={styles.extractedStyle22}>
              Showing {((context.currentPage - 1) * context.itemsPerPage) + 1} to {Math.min(context.currentPage * context.itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className={styles.extractedStyle23}>
              <button
                onClick={() => context.onPageChange(Math.max(1, context.currentPage - 1))}
                disabled={context.currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  background: context.currentPage === 1 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
                  color: context.currentPage === 1 ? '#9ca3af' : '#667eea',
                  cursor: context.currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => context.onPageChange(page)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    background: context.currentPage === page ? 'rgba(102, 126, 234, 0.9)' : 'rgba(102, 126, 234, 0.1)',
                    color: context.currentPage === page ? '#fff' : '#667eea',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => context.currentPage !== page && (e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)')}
                  onMouseLeave={(e) => context.currentPage !== page && (e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)')}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => context.onPageChange(Math.min(totalPages, context.currentPage + 1))}
                disabled={context.currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  background: context.currentPage === totalPages ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
                  color: context.currentPage === totalPages ? '#9ca3af' : '#667eea',
                  cursor: context.currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
};
