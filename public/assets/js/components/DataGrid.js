/**
 * DataGrid Component - Professional table with sorting, filtering, and column management
 */
class DataGrid {
    constructor(config) {
        this.config = {
            container: config.container,
            columns: config.columns || [],
            data: config.data || [],
            features: {
                sorting: true,
                filtering: true,
                pagination: true,
                columnManager: true,
                selection: 'multiple',
                ...config.features
            },
            pagination: {
                pageSize: 25,
                pageSizeOptions: [10, 25, 50, 100],
                ...config.pagination
            },
            onSelectionChange: config.onSelectionChange || (() => {}),
            onRowClick: config.onRowClick || (() => {})
        };

        this.state = {
            data: [],
            filteredData: [],
            currentPage: 1,
            sortColumn: null,
            sortDirection: 'asc',
            filters: {},
            selectedRows: new Set(),
            visibleColumns: this.config.columns.filter(col => col.visible !== false).map(col => col.id)
        };

        this.init();
    }

    init() {
        this.container = document.querySelector(this.config.container);
        if (!this.container) {
            console.error('Container not found:', this.config.container);
            return;
        }
        this.loadFromStorage();
        this.render();
    }

    setData(data) {
        this.state.data = data;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.state.data];

        // Aplicar filtros
        Object.entries(this.state.filters).forEach(([columnId, filterValue]) => {
            if (filterValue && filterValue.trim() !== '') {
                filtered = filtered.filter(row => {
                    const cellValue = String(row[columnId] || '').toLowerCase();
                    return cellValue.includes(filterValue.toLowerCase());
                });
            }
        });

        this.state.filteredData = filtered;
        this.applySorting();
    }

    applySorting() {
        if (!this.state.sortColumn) {
            this.state.currentPage = 1;
            this.render();
            return;
        }

        const column = this.config.columns.find(col => col.id === this.state.sortColumn);
        const sorted = [...this.state.filteredData].sort((a, b) => {
            let aVal = a[this.state.sortColumn];
            let bVal = b[this.state.sortColumn];

            if (column && column.type === 'number') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            } else {
                aVal = String(aVal || '').toLowerCase();
                bVal = String(bVal || '').toLowerCase();
            }

            if (aVal < bVal) return this.state.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.state.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.state.filteredData = sorted;
        this.state.currentPage = 1;
        this.render();
    }

    sort(columnId) {
        if (this.state.sortColumn === columnId) {
            this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.state.sortColumn = columnId;
            this.state.sortDirection = 'asc';
        }
        this.saveToStorage();
        this.applySorting();
    }

    filter(columnId, value) {
        if (value && value.trim() !== '') {
            this.state.filters[columnId] = value;
        } else {
            delete this.state.filters[columnId];
        }
        this.saveToStorage();
        this.applyFiltersWithoutRerender();
    }

    applyFiltersWithoutRerender() {
        let filtered = [...this.state.data];

        // Aplicar filtros
        Object.entries(this.state.filters).forEach(([columnId, filterValue]) => {
            if (filterValue && filterValue.trim() !== '') {
                filtered = filtered.filter(row => {
                    const cellValue = String(row[columnId] || '').toLowerCase();
                    return cellValue.includes(filterValue.toLowerCase());
                });
            }
        });

        this.state.filteredData = filtered;
        
        // Aplicar ordenamiento si existe
        if (this.state.sortColumn) {
            const column = this.config.columns.find(col => col.id === this.state.sortColumn);
            const sorted = [...this.state.filteredData].sort((a, b) => {
                let aVal = a[this.state.sortColumn];
                let bVal = b[this.state.sortColumn];

                if (column && column.type === 'number') {
                    aVal = parseFloat(aVal) || 0;
                    bVal = parseFloat(bVal) || 0;
                } else {
                    aVal = String(aVal || '').toLowerCase();
                    bVal = String(bVal || '').toLowerCase();
                }

                if (aVal < bVal) return this.state.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.state.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
            this.state.filteredData = sorted;
        }

        this.state.currentPage = 1;
        this.updateTableBody();
        this.updateFilterChips();
        this.updatePagination();
    }

    updateTableBody() {
        const tbody = this.container.querySelector('.datagrid-table tbody');
        if (!tbody) return;

        const pageData = this.getPageData();
        const visibleColumns = this.config.columns.filter(col => 
            this.state.visibleColumns.includes(col.id)
        );

        tbody.innerHTML = this.renderBodyRows(pageData, visibleColumns);
        this.attachRowEvents();
    }

    updateFilterChips() {
        const existingChipsContainer = this.container.querySelector('.filter-chips');
        const newChips = this.renderFilterChips();
        
        if (existingChipsContainer) {
            if (newChips) {
                existingChipsContainer.outerHTML = newChips;
            } else {
                existingChipsContainer.remove();
            }
        } else if (newChips) {
            const toolbar = this.container.querySelector('.datagrid-toolbar');
            toolbar.insertAdjacentHTML('afterend', newChips);
        }
        
        // Reattach chip events
        this.container.querySelectorAll('.chip-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const columnId = btn.dataset.column;
                delete this.state.filters[columnId];
                
                // Actualizar el input de filtro correspondiente
                const filterInput = this.container.querySelector(`.column-filter[data-column="${columnId}"]`);
                if (filterInput) {
                    filterInput.value = '';
                }
                
                this.saveToStorage();
                this.applyFiltersWithoutRerender();
            });
        });
    }

    updatePagination() {
        const paginationContainer = this.container.querySelector('.datagrid-pagination');
        if (!paginationContainer) return;

        const totalPages = this.getTotalPages();
        paginationContainer.outerHTML = this.renderPagination(totalPages);
        this.attachPaginationEvents();
    }

    clearFilters() {
        this.state.filters = {};
        this.saveToStorage();
        this.applyFilters();
    }

    toggleColumn(columnId) {
        const index = this.state.visibleColumns.indexOf(columnId);
        if (index > -1) {
            this.state.visibleColumns.splice(index, 1);
        } else {
            this.state.visibleColumns.push(columnId);
        }
        this.saveToStorage();
        this.render();
    }

    toggleSelectAll() {
        const pageData = this.getPageData();
        const allSelected = pageData.every(row => this.state.selectedRows.has(this.getRowId(row)));

        if (allSelected) {
            pageData.forEach(row => this.state.selectedRows.delete(this.getRowId(row)));
        } else {
            pageData.forEach(row => this.state.selectedRows.add(this.getRowId(row)));
        }

        this.render();
        this.config.onSelectionChange(this.getSelectedItems());
    }

    toggleRowSelection(row) {
        const rowId = this.getRowId(row);
        const isCurrentlySelected = this.state.selectedRows.has(rowId);
        
        if (isCurrentlySelected) {
            // Always allow deselection
            this.state.selectedRows.delete(rowId);
        } else {
            // Check if we can select this row (OV validation)
            const currentlySelected = this.getSelectedItems();
            
            if (currentlySelected.length > 0) {
                // Get the OV of the first selected item
                const firstOV = currentlySelected[0].OV;
                
                // Check if the new row has the same OV
                if (row.OV !== firstOV) {
                    // Don't add the row, trigger validation callback
                    this.config.onSelectionChange(currentlySelected);
                    return; // Exit without adding the row
                }
            }
            
            // Add the row if validation passed
            this.state.selectedRows.add(rowId);
        }
        
        this.render();
        this.config.onSelectionChange(this.getSelectedItems());
    }

    getRowId(row) {
        return row.ID || JSON.stringify(row);
    }

    getSelectedItems() {
        return this.state.data.filter(row => this.state.selectedRows.has(this.getRowId(row)));
    }

    getPageData() {
        if (!this.config.features.pagination) {
            return this.state.filteredData;
        }

        const start = (this.state.currentPage - 1) * this.config.pagination.pageSize;
        const end = start + this.config.pagination.pageSize;
        return this.state.filteredData.slice(start, end);
    }

    getTotalPages() {
        return Math.ceil(this.state.filteredData.length / this.config.pagination.pageSize);
    }

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            this.state.currentPage = page;
            this.render();
        }
    }

    saveToStorage() {
        const storageData = {
            sortColumn: this.state.sortColumn,
            sortDirection: this.state.sortDirection,
            filters: this.state.filters,
            visibleColumns: this.state.visibleColumns
        };
        localStorage.setItem('dataGrid-config', JSON.stringify(storageData));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('dataGrid-config');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.state.sortColumn = data.sortColumn;
                this.state.sortDirection = data.sortDirection;
                this.state.filters = data.filters || {};
                if (data.visibleColumns) {
                    this.state.visibleColumns = data.visibleColumns;
                }
            } catch (e) {
                console.error('Error loading storage:', e);
            }
        }
    }

    render() {
        const pageData = this.getPageData();
        const totalPages = this.getTotalPages();
        const visibleColumns = this.config.columns.filter(col => 
            this.state.visibleColumns.includes(col.id)
        );

        this.container.innerHTML = `
            <div class="datagrid-wrapper">
                ${this.renderToolbar()}
                ${this.renderFilterChips()}
                <div class="datagrid-table-container">
                    <table class="datagrid-table">
                        ${this.renderHeader(visibleColumns)}
                        ${this.renderBody(pageData, visibleColumns)}
                    </table>
                </div>
                ${this.config.features.pagination ? this.renderPagination(totalPages) : ''}
            </div>
        `;

        this.attachEvents();
    }

    renderToolbar() {
        return `
            <div class="datagrid-toolbar">
                <div class="datagrid-actions">
                    <button class="btn-tool" id="btnClearFilters" title="Limpiar filtros">
                        🎯 Filtros
                    </button>
                    <button class="btn-tool" id="btnColumnManager" title="Gestionar columnas">
                        👁️ Columnas
                    </button>
                </div>
            </div>
        `;
    }

    renderFilterChips() {
        const chips = Object.entries(this.state.filters)
            .filter(([_, value]) => value)
            .map(([columnId, value]) => {
                const column = this.config.columns.find(col => col.id === columnId);
                const label = column ? column.label : columnId;
                return `
                    <span class="filter-chip">
                        ${label}: ${value}
                        <button class="chip-close" data-column="${columnId}">✕</button>
                    </span>
                `;
            }).join('');

        return chips ? `<div class="filter-chips">${chips}</div>` : '';
    }

    renderHeader(visibleColumns) {
        const headers = visibleColumns.map(col => {
            if (col.type === 'checkbox') {
                return `<th class="col-checkbox"><input type="checkbox" id="selectAll" /></th>`;
            }

            const sortIcon = this.state.sortColumn === col.id 
                ? (this.state.sortDirection === 'asc' ? ' ↑' : ' ↓')
                : '';

            const sortable = col.sortable !== false ? 'sortable' : '';

            return `
                <th class="${sortable}" data-column="${col.id}">
                    <div class="th-content">
                        <span>${col.label}${sortIcon}</span>
                        ${col.filterable !== false ? `
                            <input type="text" 
                                class="column-filter" 
                                data-column="${col.id}"
                                placeholder="Filtrar..."
                                value="${this.state.filters[col.id] || ''}"
                                onclick="event.stopPropagation()" />
                        ` : ''}
                    </div>
                </th>
            `;
        }).join('');

        return `<thead><tr>${headers}</tr></thead>`;
    }

    renderBody(data, visibleColumns) {
        if (data.length === 0) {
            return `
                <tbody>
                    <tr>
                        <td colspan="${visibleColumns.length}" class="empty-state">
                            No se encontraron resultados
                        </td>
                    </tr>
                </tbody>
            `;
        }

        return `<tbody>${this.renderBodyRows(data, visibleColumns)}</tbody>`;
    }

    renderBodyRows(data, visibleColumns) {
        return data.map(row => {
            const rowId = this.getRowId(row);
            const isSelected = this.state.selectedRows.has(rowId);
            
            const cells = visibleColumns.map(col => {
                if (col.type === 'checkbox') {
                    return `<td class="col-checkbox">
                        <input type="checkbox" class="row-checkbox" ${isSelected ? 'checked' : ''} />
                    </td>`;
                }

                let value = row[col.id] || '';
                if (col.format && typeof col.format === 'function') {
                    value = col.format(value);
                }

                return `<td>${value}</td>`;
            }).join('');

            return `<tr data-row='${JSON.stringify(row)}'>${cells}</tr>`;
        }).join('');
    }

    renderPagination(totalPages) {
        if (totalPages <= 1) return '';

        const start = (this.state.currentPage - 1) * this.config.pagination.pageSize + 1;
        const end = Math.min(start + this.config.pagination.pageSize - 1, this.state.filteredData.length);

        return `
            <div class="datagrid-pagination">
                <div class="pagination-info">
                    Mostrando ${start}-${end} de ${this.state.filteredData.length} items
                </div>
                <div class="pagination-controls">
                    <button class="btn-page" data-page="1" ${this.state.currentPage === 1 ? 'disabled' : ''}>◀◀</button>
                    <button class="btn-page" data-page="${this.state.currentPage - 1}" ${this.state.currentPage === 1 ? 'disabled' : ''}>◀</button>
                    <span class="page-numbers">
                        ${this.renderPageNumbers(totalPages)}
                    </span>
                    <button class="btn-page" data-page="${this.state.currentPage + 1}" ${this.state.currentPage === totalPages ? 'disabled' : ''}>▶</button>
                    <button class="btn-page" data-page="${totalPages}" ${this.state.currentPage === totalPages ? 'disabled' : ''}>▶▶</button>
                </div>
                <div class="pagination-size">
                    <select id="pageSize">
                        ${this.config.pagination.pageSizeOptions.map(size => 
                            `<option value="${size}" ${size === this.config.pagination.pageSize ? 'selected' : ''}>${size}/página</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;
    }

    renderPageNumbers(totalPages) {
        const current = this.state.currentPage;
        const pages = [];
        
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (current <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (current >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
            }
        }

        return pages.map(page => {
            if (page === '...') {
                return '<span class="page-ellipsis">...</span>';
            }
            const active = page === current ? 'active' : '';
            return `<button class="btn-page ${active}" data-page="${page}">${page}</button>`;
        }).join('');
    }

    attachEvents() {
        // Column sorting
        this.container.querySelectorAll('th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const columnId = th.dataset.column;
                this.sort(columnId);
            });
        });

        // Column filters
        this.container.querySelectorAll('.column-filter').forEach(input => {
            input.addEventListener('input', (e) => {
                const columnId = e.target.dataset.column;
                this.filter(columnId, e.target.value);
            });
        });

        // Filter chips
        this.container.querySelectorAll('.chip-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const columnId = btn.dataset.column;
                delete this.state.filters[columnId];
                this.saveToStorage();
                this.applyFilters();
            });
        });

        // Clear filters
        const btnClearFilters = document.getElementById('btnClearFilters');
        if (btnClearFilters) {
            btnClearFilters.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Column manager
        const btnColumnManager = document.getElementById('btnColumnManager');
        if (btnColumnManager) {
            btnColumnManager.addEventListener('click', () => {
                this.showColumnManager();
            });
        }

        // Select all
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', () => {
                this.toggleSelectAll();
            });
        }

        // Row selection
        this.attachRowEvents();

        // Pagination
        this.attachPaginationEvents();
    }

    attachRowEvents() {
        // Row selection
        this.container.querySelectorAll('.row-checkbox').forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                const row = this.getPageData()[index];
                this.toggleRowSelection(row);
            });
        });
    }

    attachPaginationEvents() {
        // Pagination
        this.container.querySelectorAll('.btn-page:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                this.goToPage(page);
            });
        });

        // Page size
        const pageSize = document.getElementById('pageSize');
        if (pageSize) {
            pageSize.addEventListener('change', (e) => {
                this.config.pagination.pageSize = parseInt(e.target.value);
                this.state.currentPage = 1;
                this.render();
            });
        }
    }

    showColumnManager() {
        const modal = document.createElement('div');
        modal.className = 'column-manager-modal';
        
        const checkboxes = this.config.columns
            .filter(col => col.type !== 'checkbox')
            .map(col => {
                const checked = this.state.visibleColumns.includes(col.id) ? 'checked' : '';
                return `
                    <label class="column-option">
                        <input type="checkbox" value="${col.id}" ${checked} />
                        ${col.label}
                    </label>
                `;
            }).join('');

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Gestionar Columnas</h3>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    ${checkboxes}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="btnCancelColumns">Cancelar</button>
                    <button class="btn btn-primary" id="btnApplyColumns">Aplicar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('#btnCancelColumns').addEventListener('click', () => modal.remove());
        modal.querySelector('#btnApplyColumns').addEventListener('click', () => {
            const selected = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            
            // Mantener checkbox column siempre visible
            const checkboxCol = this.config.columns.find(col => col.type === 'checkbox');
            if (checkboxCol) {
                this.state.visibleColumns = [checkboxCol.id, ...selected];
            } else {
                this.state.visibleColumns = selected;
            }
            
            this.saveToStorage();
            this.render();
            modal.remove();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}
