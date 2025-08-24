import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./SignalsDashbord.css"; // animasyon için CSS dosyası

export default function SignalsTable() {
    // const [symbols, setSymbols] = useState("ASELS.IS,THYAO.IS");
    const [symbols, setSymbols] = useState("A1CAP.IS,A1YEN.IS,ACSEL.IS,ADEL.IS,ADESE.IS,ADGYO.IS,AEFES.IS,AFYON.IS,AGESA.IS,AGHOL.IS,AGROT.IS,AGYO.IS,AHGAZ.IS,AHSGY.IS,AKBNK.IS,AKCNS.IS,AKENR.IS,AKFGY.IS,AKFIS.IS,AKFYE.IS,AKGRT.IS,AKMGY.IS,AKSA.IS,AKSEN.IS,AKSGY.IS,AKSUE.IS,AKYHO.IS,ALARK.IS,ALBRK.IS,ALCAR.IS,ALCTL.IS,ALFAS.IS,ALGYO.IS,ALKA.IS,ALKIM.IS,ALKLC.IS,ALTNY.IS,ALVES.IS,ANELE.IS,ANGEN.IS,ANHYT.IS,ANSGR.IS,ARASE.IS,ARCLK.IS,ARDYZ.IS,ARENA.IS,ARMGD.IS,ARSAN.IS,ARTMS.IS,ARZUM.IS,ASELS.IS,ASGYO.IS,ASTOR.IS,ASUZU.IS,ATAGY.IS,ATAKP.IS,ATATP.IS,AVGYO.IS,AVHOL.IS,AVOD.IS,AVPGY.IS,AVTUR.IS,AYCES.IS,AYDEM.IS,AYEN.IS,AYES.IS,AYGAZ.IS,AZTEK.IS,BAGFS.IS,BAHKM.IS,BAKAB.IS,BALAT.IS,BALSU.IS,BANVT.IS,BARMA.IS,BASCM.IS,BASGZ.IS,BAYRK.IS,BEGYO.IS,BERA.IS,BESLR.IS,BEYAZ.IS,BFREN.IS,BIENY.IS,BIGCH.IS,BIGEN.IS,BIMAS.IS,BINBN.IS,BINHO.IS,BIOEN.IS,BIZIM.IS,BJKAS.IS,BLCYT.IS,BMSCH.IS,BMSTL.IS,BNTAS.IS,BOBET.IS,BORLS.IS,BORSK.IS,BOSSA.IS,BRISA.IS,BRKSN.IS,BRKVY.IS,BRLSM.IS,BRSAN.IS,BRYAT.IS,BSOKE.IS,BTCIM.IS,BUCIM.IS,BULGS.IS,BURCE.IS,BURVA.IS,BVSAN.IS,BYDNR.IS,CANTE.IS,CATES.IS,CCOLA.IS,CELHA.IS,CEMAS.IS,CEMTS.IS,CEMZY.IS,CEOEM.IS,CGCAM.IS,CIMSA.IS,CLEBI.IS,CMBTN.IS,CMENT.IS,CONSE.IS,COSMO.IS,CRDFA.IS,CRFSA.IS,CUSAN.IS,CVKMD.IS,CWENE.IS,DAGHL.IS,DAGI.IS,DAPGM.IS,DARDL.IS,DCTTR.IS,DENGE.IS,DERHL.IS,DERIM.IS,DESA.IS,DESPC.IS,DEVA.IS,DGATE.IS,DGGYO.IS,DGNMO.IS,DITAS.IS,DMRGD.IS,DMSAS.IS,DNISI.IS,DOAS.IS,DOBUR.IS,DOCO.IS,DOFER.IS,DOGUB.IS,DOHOL.IS,DOKTA.IS,DSTKF.IS,DURDO.IS,DURKN.IS,DYOBY.IS,DZGYO.IS,EBEBK.IS,ECILC.IS,ECZYT.IS,EDATA.IS,EDIP.IS,EFORC.IS,EGEEN.IS,EGEGY.IS,EGEPO.IS,EGGUB.IS,EGPRO.IS,EGSER.IS,EKGYO.IS,EKOS.IS,EKSUN.IS,ELITE.IS,EMKEL.IS,ENDAE.IS,ENERY.IS,ENJSA.IS,ENKAI.IS,ENSRI.IS,ENTRA.IS,EPLAS.IS,ERBOS.IS,ERCB.IS,EREGL.IS,ERSU.IS,ESCAR.IS,ESCOM.IS,ESEN.IS,ETILR.IS,EUPWR.IS,EUREN.IS,EYGYO.IS,FADE.IS,FENER.IS,FLAP.IS,FMIZP.IS,FONET.IS,FORMT.IS,FORTE.IS,FRIGO.IS,FROTO.IS,FZLGY.IS,GARAN.IS,GARFA.IS,GEDIK.IS,GEDZA.IS,GENIL.IS,GENTS.IS,GEREL.IS,GESAN.IS,GIPTA.IS,GLBMD.IS,GLCVY.IS,GLRMK.IS,GLRYH.IS,GLYHO.IS,GMTAS.IS,GOKNR.IS,GOLTS.IS,GOODY.IS,GOZDE.IS,GRSEL.IS,GRTHO.IS,GSDDE.IS,GSDHO.IS,GSRAY.IS,GUBRF.IS,GUNDG.IS,GWIND.IS,GZNMI.IS,HALKB.IS,HATEK.IS,HATSN.IS,HDFGS.IS,HEDEF.IS,HEKTS.IS,HKTM.IS,HLGYO.IS,HOROZ.IS,HRKET.IS,HTTBT.IS,HUBVC.IS,HUNER.IS,HURGZ.IS,ICBCT.IS,ICUGS.IS,IDGYO.IS,IEYHO.IS,IHAAS.IS,IHEVA.IS,IHGZT.IS,IHLAS.IS,IHLGM.IS,IHYAY.IS,IMASM.IS,INDES.IS,INFO.IS,INGRM.IS,INTEK.IS,INTEM.IS,INVEO.IS,INVES.IS,IPEKE.IS,ISBIR.IS,ISBTR.IS,ISCTR.IS,ISDMR.IS,ISFIN.IS,ISGSY.IS,ISGYO.IS,ISKPL.IS,ISMEN.IS,ISSEN.IS,IZENR.IS,IZFAS.IS,IZINV.IS,IZMDC.IS,JANTS.IS,KAPLM.IS,KAREL.IS,KARSN.IS,KARTN.IS,KATMR.IS,KAYSE.IS,KBORU.IS,KCAER.IS,KCHOL.IS,KENT.IS,KFEIN.IS,KGYO.IS,KIMMR.IS,KLGYO.IS,KLKIM.IS,KLMSN.IS,KLNMA.IS,KLRHO.IS,KLSER.IS,KLSYN.IS,KLYPV.IS,KMPUR.IS,KNFRT.IS,KOCMT.IS,KONKA.IS,KONTR.IS,KONYA.IS,KOPOL.IS,KORDS.IS,KOTON.IS,KOZAA.IS,KOZAL.IS,KRDMA.IS,KRDMB.IS,KRDMD.IS,KRGYO.IS,KRONT.IS,KRPLS.IS,KRSTL.IS,KRTEK.IS,KRVGD.IS,KSTUR.IS,KTLEV.IS,KTSKR.IS,KUTPO.IS,KUYAS.IS,KZBGY.IS,KZGYO.IS,LIDER.IS,LIDFA.IS,LILAK.IS,LINK.IS,LKMNH.IS,LMKDC.IS,LOGO.IS,LRSHO.IS,LUKSK.IS,LYDHO.IS,LYDYE.IS,MAALT.IS,MACKO.IS,MAGEN.IS,MAKIM.IS,MAKTK.IS,MANAS.IS,MARBL.IS,MARKA.IS,MARTI.IS,MAVI.IS,MEDTR.IS,MEGMT.IS,MEKAG.IS,MEPET.IS,MERCN.IS,MERIT.IS,MERKO.IS,METRO.IS,METUR.IS,MGROS.IS,MHRGY.IS,MIATK.IS,MNDRS.IS,MNDTR.IS,MOBTL.IS,MOGAN.IS,MOPAS.IS,MPARK.IS,MRGYO.IS,MRSHL.IS,MSGYO.IS,MTRKS.IS,MZHLD.IS,NATEN.IS,NETAS.IS,NIBAS.IS,NTGAZ.IS,NTHOL.IS,NUGYO.IS,NUHCM.IS,OBAMS.IS,OBASE.IS,ODAS.IS,ODINE.IS,OFSYM.IS,ONCSM.IS,ONRYT.IS,ORCAY.IS,ORGE.IS,ORMA.IS,OSMEN.IS,OSTIM.IS,OTKAR.IS,OTTO.IS,OYAKC.IS,OYLUM.IS,OYYAT.IS,OZATD.IS,OZGYO.IS,OZKGY.IS,OZRDN.IS,OZSUB.IS,OZYSR.IS,PAGYO.IS,PAMEL.IS,PAPIL.IS,PARSN.IS,PASEU.IS,PATEK.IS,PCILT.IS,PEKGY.IS,PENGD.IS,PENTA.IS,PETKM.IS,PETUN.IS,PGSUS.IS,PINSU.IS,PKART.IS,PKENT.IS,PLTUR.IS,PNLSN.IS,PNSUT.IS,POLHO.IS,POLTK.IS,PRDGS.IS,PRKAB.IS,PRKME.IS,PRZMA.IS,PSDTC.IS,PSGYO.IS,QNBFK.IS,QUAGR.IS,RALYH.IS,RAYSG.IS,REEDR.IS,RGYAS.IS,RNPOL.IS,RODRG.IS,RTALB.IS,RUBNS.IS,RUZYE.IS,RYGYO.IS,RYSAS.IS,SAFKR.IS,SAHOL.IS,SAMAT.IS,SANEL.IS,SANFM.IS,SANKO.IS,SARKY.IS,SASA.IS,SAYAS.IS,SDTTR.IS,SEGMN.IS,SEGYO.IS,SEKFK.IS,SEKUR.IS,SELEC.IS,SELGD.IS,SELVA.IS,SERNT.IS,SEYKM.IS,SILVR.IS,SISE.IS,SKBNK.IS,SKTAS.IS,SKYLP.IS,SKYMD.IS,SMART.IS,SMRTG.IS,SMRVA.IS,SNGYO.IS,SNICA.IS,SNPAM.IS,SODSN.IS,SOKE.IS,SOKM.IS,SONME.IS,SRVGY.IS,SUMAS.IS,SUNTK.IS,SURGY.IS,SUWEN.IS,TABGD.IS,TARKM.IS,TATEN.IS,TATGD.IS,TAVHL.IS,TBORG.IS,TCELL.IS,TCKRC.IS,TDGYO.IS,TEHOL.IS,TEKTU.IS,TERA.IS,TEZOL.IS,TGSAS.IS,THYAO.IS,TKFEN.IS,TKNSA.IS,TLMAN.IS,TMPOL.IS,TMSN.IS,TNZTP.IS,TOASO.IS,TRCAS.IS,TRGYO.IS,TRILC.IS,TSGYO.IS,TSKB.IS,TSPOR.IS,TTKOM.IS,TTRAK.IS,TUCLK.IS,TUKAS.IS,TUPRS.IS,TUREX.IS,TURGG.IS,TURSG.IS,UFUK.IS,ULAS.IS,ULKER.IS,ULUFA.IS,ULUSE.IS,ULUUN.IS,UNLU.IS,USAK.IS,VAKBN.IS,VAKFN.IS,VAKKO.IS,VANGD.IS,VBTYZ.IS,VERTU.IS,VERUS.IS,VESBE.IS,VESTL.IS,VKGYO.IS,VKING.IS,VRGYO.IS,VSNMD.IS,YAPRK.IS,YATAS.IS,YAYLA.IS,YBTAS.IS,YEOTK.IS,YESIL.IS,YGGYO.IS,YIGIT.IS,YKBNK.IS,YKSLN.IS,YONGA.IS,YUNSA.IS,YYAPI.IS,YYLGD.IS,ZEDUR.IS,ZOREN.IS,ZRGYO.IS");
    const [selectedInterval, setSelectedInterval] = useState("1m");
    const [selectedRange, setSelectedRange] = useState("1d");
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [highlightedRows, setHighlightedRows] = useState([]);
    const [data, setData] = useState([]);

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
        { label: "30 Dakika", value: "30m" },
        { label: "1 Saat", value: "1h" },
        { label: "1 Gün", value: "1d" },
        { label: "2 Gün", value: "2d" },
    ];

    const rangeOptions = [
        { label: "1 Gün", value: "1d" },
        { label: "2 Gün", value: "2d" },
        { label: "5 Gün", value: "5d" },
        { label: "15 Gün", value: "15d" },
        { label: "1 Ay", value: "1mo" },
        { label: "6 Ay", value: "6mo" },
        { label: "1 yıl", value: "1y" },
    ];

    const fetchSignals = async () => {
        try {
            setLoading(true);
            const url = `https://dotnet-api-bist.onrender.com/api/WhaleSignals?symbols=${latestSymbols.current}&interval=${latestInterval.current}&range=${latestRange.current}`;
            // const url = `http://localhost:5109/api/WhaleSignals?symbols=${latestSymbols.current}&interval=${latestInterval.current}&range=${latestRange.current}`;


            const res = await axios.get(url);

            // Yeni satırları tespit et
            const newSignals = res.data;
            const oldKeys = new Set(signals.map((s) => s.time + s.symbol));
            const newKeys = newSignals.map((s) => s.time + s.symbol);
            const diff = newKeys.filter((k) => !oldKeys.has(k));
            
            setSignals(newSignals);
            setHighlightedRows(diff);
            
            setData(res.data);
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
                    <Button icon="pi pi-file-excel" label="Excel'e Aktar" className="p-button-success" onClick={exportCSV} />

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
                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
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
                    <Column field="time" header="Zaman" sortable filter />
                    <Column field="symbol" header="Sembol" sortable filter/>
                     <Column field="value" header="Deger" sortable filter/>
                       <Column field="open" header="Açılış" sortable filter />
                    <Column
                        field="action"
                        header="Sinyal"
                        sortable
                        filter
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
                    <Column field="reason" header="Açıklama" sortable filter />
                </DataTable>
            </Card>
        </div>
    );
}
