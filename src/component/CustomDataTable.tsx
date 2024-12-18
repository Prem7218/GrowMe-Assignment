import React, { useRef } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { url } from "../url_link/links";

interface TableProps {
  mainData: object[];
  loading: boolean;
  currentPage: number;
  totalRecords: number;
  onPageChange: (event: DataTablePageEvent) => void;
  selectedProducts: object[];
  setSelectedProducts: (value: object[]) => void;
  rowsToSelect: number;
  setRowsToSelect: (value: number) => void;
}

const CustomDataTable: React.FC<TableProps> = ({
  mainData,
  loading,
  currentPage,
  totalRecords,
  onPageChange,
  selectedProducts,
  setSelectedProducts,
  rowsToSelect,
  setRowsToSelect,
}) => {
  const overlayRef = useRef<OverlayPanel>(null);

  const handleRowSelection = async () => {
    if (rowsToSelect <= 0 || rowsToSelect > totalRecords) {
      console.warn("Invalid number of rows to select.");
      overlayRef.current?.hide();
      return;
    }

    const selectedRows: object[] = []; 
    let currentPage = 1;

    try {
      while (selectedRows.length < rowsToSelect) {
        const response = await fetch(`${url}${currentPage}`);
        const responseJson = await response.json();
        const { data } = responseJson;

        const remainingSlots = rowsToSelect - selectedRows.length;
        selectedRows.push(...data.slice(0, remainingSlots));

        if (selectedRows.length < rowsToSelect) {
          currentPage++;
        }
      }

      setSelectedProducts(selectedRows); 
    } catch (error) {
      console.error("Error selecting rows:", error);
    } finally {
      overlayRef.current?.hide();
    }
  };

  const titleHeaderWithOverlay = (
    <div className="header-title-container">
      Title
      <Button
        type="button"
        icon="pi pi-caret-down"
        className="p-button-text p-button-sm"
        onClick={(e) => overlayRef.current?.toggle(e)}
      />
      <OverlayPanel ref={overlayRef}>
        <div className="overlay-content">
          <h4>Select Rows</h4>
          <InputNumber
            value={rowsToSelect}
            onValueChange={(e) => setRowsToSelect(e.value ?? 0)}
            min={0}
            max={totalRecords}
            placeholder="Number of Rows"
          />
          <Button label="Select Rows" onClick={handleRowSelection} />
        </div>
      </OverlayPanel>
    </div>
  );

  const rowNumberTemplate = (_rowData: object, options: { rowIndex: number }) => {
    return (currentPage - 1) + options.rowIndex + 1;
  };

  return (
    <DataTable
      value={mainData}
      paginator
      lazy
      rows={10}
      first={(currentPage - 1) * 10}
      totalRecords={totalRecords}
      loading={loading}
      onPage={onPageChange}
      selectionMode="checkbox"
      selection={selectedProducts} 
      onSelectionChange={(e) => setSelectedProducts(e.value)} 
      dataKey="id"
    >
      <Column
        header="No."
        body={rowNumberTemplate}
        style={{ width: "4rem", textAlign: "center" }}
      />
      <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
      <Column field="title" header={titleHeaderWithOverlay} />
      <Column field="place_of_origin" header="Place of Origin" />
      <Column field="artist_display" header="Artist" />
      <Column field="date_start" header="Start Date" />
      <Column field="date_end" header="End Date" />
    </DataTable>
  );
};

export default CustomDataTable;
