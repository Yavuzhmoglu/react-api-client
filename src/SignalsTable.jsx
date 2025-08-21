import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import "./SignalsDashbord.css"; // animasyon için CSS dosyası

export default function SignalsTable() {
    const [symbols, setSymbols] = useState("ASELS.IS,THYAO.IS");
    const [selectedInterval, setSelectedInterval] = useState("1m");
    const [selectedRange, setSelectedRange] = useState("1d");
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [highlightedRows, setHighlightedRows] = useState([]);

    const intervalRef = useRef(null);
    const latestSymbols = useRef(symbols);
    const latestInterval = useRef(selectedInterval);
    const latestRange = useRef(selectedRange);

    useEffect(() => {
        latestSymbols.current = symbols;
    }, [symbols]);

    useEffect(() => {
        latestInterval.current = selectedInterval;
    }, [selectedInterval]);

    useEffect(() => {
        latestRange.current = selectedRange;
    }, [selectedRange]);

    const intervalOptions = [
        { label: "1 Dakika", value: "1m" },
        { label: "5 Dakika", value: "5m" },
        { label: "10 Dakika", value: "10m" },
        { label: "15 Dakika", value: "15m" },
        { label: "1 Saat", value: "1h" },
        { label: "1 Gün", value: "1d" },
    ];

    const rangeOptions = [
        { label: "1 Gün", value: "1d" },
        { label: "2 Gün", value: "2d" },
        { label: "5 Gün", value: "5d" },
        { label: "15 Gün", value: "15d" },
        { label: "1 Ay", value: "1mo" },
        { label: "6 Ay", value: "6mo" },
    ];

    const fetchSignals = async () => {
        try {
            setLoading(true);
            // const url = `https://dotnet-api-bist.onrender.com/api/WhaleSignals?symbols=${latestSymbols.current}&interval=${latestInterval.current}&range=${latestRange.current}`;
            const url = `http://localhost:5109/api/WhaleSignals?symbols=${latestSymbols.current}&interval=${latestInterval.current}&range=${latestRange.current}`;


            const res = await axios.get(url);

            // Yeni satırları tespit et
            const newSignals = res.data;
            const oldKeys = new Set(signals.map((s) => s.time + s.symbol));
            const newKeys = newSignals.map((s) => s.time + s.symbol);
            const diff = newKeys.filter((k) => !oldKeys.has(k));

            setSignals(newSignals);
            setHighlightedRows(diff);

            // Highlight 2 sn sonra kaybolsun
            setTimeout(() => setHighlightedRows([]), 2000);
        } catch (err) {
            console.error(err);
            alert("API'den veri alınamadı!");
        } finally {
            setLoading(false);
        }
    };

    const startAutoRefresh = () => {
        if (!intervalRef.current) {
            fetchSignals();
            intervalRef.current = setInterval(fetchSignals, 60 * 1000);
            alert("Otomatik güncelleme başladı (1 dakikada bir) ✅");
        }
    };

    const stopAutoRefresh = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            alert("Otomatik güncelleme durduruldu ⏹️");
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="p-4">
            <Card title="🐋 Whale Intel - Balina Sinyalleri">
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                    <InputText
                        value={symbols}
                        onChange={(e) => setSymbols(e.target.value)}
                        placeholder="Semboller (örn: ASELS.IS,THYAO.IS)"
                        className="p-inputtext-sm flex-1"
                    />
                    <Dropdown
                        value={selectedInterval}
                        options={intervalOptions}
                        onChange={(e) => setSelectedInterval(e.value)}
                        placeholder="Interval"
                    />
                    <Dropdown
                        value={selectedRange}
                        options={rangeOptions}
                        onChange={(e) => setSelectedRange(e.value)}
                        placeholder="Range"
                    />
                    <Button
                        label="Yenile"
                        icon="pi pi-refresh"
                        onClick={fetchSignals}
                        loading={loading}
                    />
                    <Button
                        label="Başlat"
                        icon="pi pi-play"
                        className="p-button-success"
                        onClick={startAutoRefresh}
                    />
                    <Button
                        label="Durdur"
                        icon="pi pi-stop"
                        className="p-button-danger"
                        onClick={stopAutoRefresh}
                    />
                </div>

                <div className="flex justify-end mb-2">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Tabloda Ara..."
                        />
                    </span>
                </div>

                <DataTable
                    value={signals}
                    paginator
                    rows={15}
                    stripedRows
                    responsiveLayout="scroll"
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    emptyMessage="Sinyal bulunamadı."
                    rowClassName={(row) => {
                        let base = "";
                        if (row.action === "Alış") base = "bg-green-50";
                        if (row.action === "Satış") base = "bg-red-50";
                        if (row.action === "Toplama") base = "bg-blue-50";
                        if (row.action === "Dağıtım") base = "bg-yellow-50";

                        // highlight yeni satırları
                        if (highlightedRows.includes(row.time + row.symbol)) {
                            return base + " flash";
                        }
                        return base;
                    }}
                >
                    <Column field="time" header="Zaman" sortable />
                    <Column field="symbol" header="Sembol" sortable />
                     <Column field="value" header="Deger" sortable />
                       <Column field="open" header="Açılış" sortable />
                    <Column
                        field="action"
                        header="Sinyal"
                        sortable
                        body={(row) => (
                            <span
                                className={
                                    row.action === "Alış"
                                        ? "text-green-600 font-bold"
                                        : row.action === "Satış"
                                            ? "text-red-600 font-bold"
                                            : row.action === "Toplama"
                                                ? "text-blue-600 font-bold"
                                                : "text-yellow-600 font-bold"
                                }
                            >
                                {row.action}
                            </span>
                        )}
                    />
                    <Column field="reason" header="Açıklama" sortable />
                </DataTable>
            </Card>
        </div>
    );
}
