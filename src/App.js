import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";


import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const intervals = ["1m","15m", "1h", "4h", "1d"].map((i) => ({ label: i, value: i }));
const ranges = ["1d", "5d","10d","20d", "1mo", "3mo", "6mo","1y"].map((r) => ({ label: r, value: r }));
const pageSizeOptions = [5, 10, 20, 50, 100].map((r) => ({ label: `${r} kayıt`, value: r }));

function App() {
  const [symbol, setSymbol] = useState("DAGHL.IS");
  const [interval, setInterval] = useState("4h");
  const [range, setRange] = useState("5d");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    if (!symbol || !interval || !range) return;

    try {
      const response = await fetch("https://dotnet-api-bist.onrender.com/Data/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          symbol,
          interval: interval,
          range: range
        })
      });

      console.log(symbol + interval + range);

      if (!response.ok) throw new Error("İstek başarısız");

      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError("❌ Hata: " + err.message);
    }
  };

  const handleStart = () => {
    fetchData();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(fetchData, 20000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // const formatDate = (isoString) => {
  //   const date = new Date(isoString);
  //   return date.toLocaleString("tr-TR", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit"
  //   });

  // };

  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(row => ({
      ...row
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Veri");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "veri.xlsx");
  };

  return (
    <div className="p-4 surface-ground min-h-screen flex flex-column align-items-center justify-content-start">
      <Card title="📊 BIST Veri Sorgulama" className="w-full md:w-8 lg:w-6">
        <div className="p-fluid grid formgrid">
          <div className="field col-12">
            <label htmlFor="symbol">Sembol</label>
            <InputText
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Örn: DAGHL.IS"
            />
          </div>

          <div className="field col-6">
            <label>Aralık (interval)</label>
            <Dropdown
              value={interval}
              options={intervals}
              onChange={(e) => setInterval(e.value)}
              placeholder="Seçiniz"
            />
          </div>

          <div className="field col-6">
            <label>Range</label>
            <Dropdown
              value={range}
              options={ranges}
              onChange={(e) => setRange(e.value)}
              placeholder="Seçiniz"
            />
          </div>

          <div className="col-12 mt-2">
            <Button
              label="Veri Çekmeye Başla"
              icon="pi pi-play"
              onClick={handleStart}
              className="p-button-success w-full"
            />
          </div>
        </div>
      </Card>

      {error && (
        <Card className="w-full md:w-10 mt-3 p-error">
          <p>{error}</p>
        </Card>
      )}

      {data?.length > 0 && (
        <>
          <Card className="mt-4" title="📊 Grafik: Açılış, Kapanış, Yüksek, Düşük + Hacim">
            <ResponsiveContainer width={1000} height={400}>
              <LineChart
                data={data.slice().reverse()}
                margin={{ top: 20, right: 50, left: 0, bottom: 60 }}
                barCategoryGap="80%"  // barlar arası boşluk biraz artırıldı
                barGap={15}            // barlar arası boşluk biraz artırıldı
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="tarih"
                  tickFormatter={(t) => {
                    const d = new Date(t);
                    return `${d.getDate()}.${d.getMonth() + 1}`;
                  }}
                  interval={0} // tüm etiketleri göster
                  angle={-45} // eğik göster
                  textAnchor="end" // sağa hizala
                  height={60} // alt boşluk artır
                  minTickGap={15}
                />

                <YAxis
                  yAxisId="left"
                  orientation="left"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(v) => v.toFixed(2)}
                  allowDataOverflow={true}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
                />

                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleString("tr-TR")}
                  formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="acilis"
                  stroke="#00bcd4"
                  name="Açılış"
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="kapanis"
                  stroke="#4caf50"
                  name="Kapanış"
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="yüksek"
                  stroke="#ff9800"
                  name="Yüksek"
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="dusuk"
                  stroke="#f44336"
                  name="Düşük"
                  dot={false}
                />

                <Bar
                  yAxisId="right"
                  dataKey="hacim"
                  fill="rgba(136, 132, 216, 0.4)" // %40 opaklık (şeffaf)
                  name="Hacim"
                  barSize={12}
                  radius={[3, 3, 0, 0]}
                />

                <Brush
                  dataKey="tarih"
                  height={30}
                  stroke="#8884d8"
                  travellerWidth={15}
                  tickFormatter={(t) => {
                    const d = new Date(t);
                    return `${d.getDate()}.${d.getMonth() + 1}`;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>



          <Card className="w-full md:w-10 mt-4" title="📈 Veri Tablosu">
            <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-3 gap-2">
              <span className="p-input-icon-left w-full md:w-8">
                <i className="pi pi-search" />
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Tabloda ara..."
                  className="w-full"
                />
              </span>

              <div className="w-full md:w-3">
                <Dropdown
                  value={rowsPerPage}
                  options={pageSizeOptions}
                  onChange={(e) => setRowsPerPage(e.value)}
                  placeholder="Sayfa boyutu"
                  className="w-full"
                />
              </div>
              <Button icon="pi pi-file-excel" label="Excel'e Aktar" className="p-button-success" onClick={exportCSV} />

            </div>


            <DataTable
              value={data}
              paginator
              rows={rowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              stripedRows
              responsiveLayout="scroll"
              globalFilter={globalFilter}
              emptyMessage="Veri yok"
            >
              <Column
                field="tarih"
                header="Tarih"
                sortable
                filter
               
              />
              <Column field="acilis" header="Açılış" sortable filter />
              <Column field="yüksek" header="Yüksek" sortable filter />
              <Column field="dusuk" header="Düşük" sortable filter />
              <Column field="kapanis" header="Kapanış" sortable filter />
              <Column field="hacim" header="Hacim" sortable filter />
            </DataTable>
          </Card>
        </>
      )}
    </div>
  );
}

export default App;
