import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useFinancialStore = defineStore("opendataFinancial", () => {
    const dataUrlJson = "https://apiservice.mol.gov.tw/OdService/download/A17030000J-000016-xC8";
    const dataUrlSrc = "https://data.gov.tw/dataset/13228";
    const isDownloading = ref(false);

    const refreshTime = ref("Null");
    const dataSet = reactive([]);

    const valueCheck = (input) => {
        if (input === "…" || input === "-" || input === "--") {
            //undefine
            return {"value": undefined, "status": "unavailable"};
        }
        let status = "OK";
        let newInput = input.trim();
        if (newInput.startsWith("r"))
        {
            // revise
            status = "r";
        }
        else if (newInput.startsWith("p"))
        {
            // pre
            status = "p";
        }
        else if (newInput.startsWith("f"))
        {
            // forecast
            status = "f";
        }
        newInput = Number(newInput.replace(status, "").replace(",", "").trim());
        
        return {"value": newInput, "sttus": status}
    }

    const timeKey = "月份";
    const dataKey = reactive([
        "經濟成長率",
        "平均每人國民所得毛額",
        "儲蓄率",
        "失業率",
        "產業結構-農業",
        "產業結構-工業",
        "產業結構-服務業",
        "產業結構-金融中介業",
        "產業結構-保險業",
        "產業結構-證券期貨及其它金融業",
        "生產者物價-指數",
        "生產者物價-年增率",
        "消費者物價-指數",
        "消費者物價-年增率",
        "基本工資-月薪",
        "基本工資-時薪",
        "工業及服務業平均月薪資",
        "製造業平均月薪資",
        "工業及服務業平均月工時"
    ])
    const keyRemaping = {
        "日期（月別）": "月份",
        "經濟成長率": "經濟成長率",
        "平均每人國民所得毛額（美元）": "平均每人國民所得毛額",
        "儲蓄率":"儲蓄率",
        "失業率（百分比）": "失業率",
        "產業結構（按各產業GDP比重）-農業": "產業結構-農業",
        "產業結構（按各產業GDP比重）-工業": "產業結構-工業",
        "產業結構（按各產業GDP比重）-服務業": "產業結構-服務業",
        "產業結構（按各產業GDP比重）-服務業-金融中介業": "產業結構-金融中介業",
        "產業結構（按各產業GDP比重）-服務業-保險業": "產業結構-保險業",
        "產業結構（按各產業GDP比重）-服務業-證券期貨及其它金融業": "產業結構-證券期貨及其它金融業",
        "生產者物價-指數":"生產者物價-指數",
        "生產者物價-年增率":"生產者物價-年增率",
        "消費者物價-指數":"消費者物價-指數",
        "消費者物價-年增率":"消費者物價-年增率",
        "基本工資（金額）-月薪":"基本工資-月薪",
        "基本工資（金額）-時薪":"基本工資-時薪",
        "工業及服務業平均月薪資（元）":"工業及服務業平均月薪資",
        "製造業平均月薪資（元）":"製造業平均月薪資",
        "工業及服務業平均月工時（小時）":"工業及服務業平均月工時"
    }
    const keyUnits = {
        "月份": "time",
        "經濟成長率": "%",
        "平均每人國民所得毛額": "USD",
        "儲蓄率": "%",
        "失業率": "%",
        "產業結構-農業": "%",
        "產業結構-工業": "%",
        "產業結構-服務業": "%",
        "產業結構-金融中介業": "%",
        "產業結構-保險業": "%",
        "產業結構-證券期貨及其它金融業": "%",
        "生產者物價-指數": "index",
        "生產者物價-年增率": "%",
        "消費者物價-指數": "index",
        "消費者物價-年增率": "%",
        "基本工資-月薪": "NTD/ mon",
        "基本工資-時薪": "NTD/ hr",
        "工業及服務業平均月薪資": "NTD/ mon",
        "製造業平均月薪資": "NTD/ mon",
        "工業及服務業平均月工時": "hr/ mon"
    }

    async function fetchData (forceUpdate = false) {
        if (!forceUpdate && refreshTime.value !== "Null") {
            console.log ("Last refreshTime: ", refreshTime.value);
            return;
        }
        if (isDownloading.value) {
            console.log ("There is a download process, skip this time...");
            return;
        }
        isDownloading.value = true;
        await axios.get(dataUrlJson)
            .then((response) => {
                dataSet.splice(0, dataSet.length);
                response.data.forEach((item) => {
                    const output = {};
                    for (const key in item) {
                        const newKey = keyRemaping[key];
                        if (newKey === "月份") {
                            output[newKey] = item[key]
                        }
                        else {
                            const tmp = {};
                            tmp["type"] = newKey
                            tmp["unit"] = keyUnits[newKey]
                            tmp["data"] = valueCheck(item[key])
                            output[newKey] = tmp;
                        }  
                    }
                    dataSet.push(output)
                })
                refreshTime.value = new Date().toLocaleString();
                console.log ("Download Complete!!");
                isDownloading.value = false;
            })
            .catch(error => {
                console.log ("error: ", error.message);
                isDownloading.value = false;
            })
    }
    return {fetchData, refreshTime, dataSet, dataUrlSrc, dataKey, timeKey};
})
