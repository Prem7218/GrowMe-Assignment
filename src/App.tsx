import { useEffect, useState } from "react";
import { DataTablePageEvent } from "primereact/datatable";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import { url } from "./url_link/links";
import CustomDataTable from "./component/CustomDataTable";

function App() {
  const [mainData, setMainData] = useState<object[]>([]);
  const [rowsToSelect, setRowsToSelect] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<object[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}${page}`);
      const responseJson = await response.json();
      const { data, pagination } = responseJson;

      setMainData(data);
      setTotalRecords(pagination.total_pages * pagination.limit);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (event: DataTablePageEvent) => {
    setCurrentPage((event.page ?? 0) + 1);
  };

  return (
    <div className="app-container">
      <h2 className="app-title">Artworks Table</h2>
      <div className="table-container">
        <CustomDataTable
          mainData={mainData}
          loading={loading}
          currentPage={currentPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          rowsToSelect={rowsToSelect}
          setRowsToSelect={setRowsToSelect}
        />
      </div>
    </div>
  );
}

export default App;
