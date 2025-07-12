<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import * as d3 from "d3";

const props = defineProps({
    tickX: {
        type: Array,
        required: true,
        /* will be xtick */
    },
    axisName: {
        type: Object,
        default: {x: "xaxis", y: "yaxis"}
    },
    dataY: {
        type: Array,
        required: true,
        /* will be
            [{ value: [], color: String, legend: String}, {},...]
         */
    },
    title: {
        type: String,
        default: "fig title"
    },
    imageId: {
        type: String,
        required: true,
    },
    yValueMargin: {
        type: Number,
        default: 50,
    },
    imageSize: {
        type: Object,
        default: {width: 400, height: 200}
    },
    imageMargin: {
        type: Object,
        default: { top: 30, right: 60, bottom: 60, left: 100 }
    }
})

const isShowFullScreenFigure = ref(false);
const changeFullScreenStatus = () => {
    isShowFullScreenFigure.value = !isShowFullScreenFigure.value;
}

const tickX = reactive([]);
const figY = reactive ([]);
const figLegend = reactive ([]);
const figYMax = ref(undefined);
const figYMin = ref(undefined);
const figColor = reactive({});


const updateLocalDataset = () => {
    figY.splice(0, figY.length);
    tickX.splice(0, tickX.length);
    figLegend.splice(0, figLegend.length);
    figYMax.value = undefined;
    figYMin.value = undefined;

    props.dataY.forEach((item, i) => {
        const key = item["legend"] || "xxx";
        figLegend.push(key);
        figColor[key] = item["color"] || "blue";
        figY.push (item["value"]);


        const filterSet = item.value.filter(num => typeof num === "number")
        const tmpMax = Math.max(...filterSet)
        if (figYMax.value === undefined || figYMax.value < tmpMax)
        {
            figYMax.value = tmpMax
        }

        const tmpMin = Math.min(...filterSet)
        if (figYMin.value === undefined || figYMin.value > tmpMin)
        {
            figYMin.value = tmpMin
        }
        if (tmpMax === NaN || tmpMin === NaN)
        {
            console.log ("Something wrong...", item);
        }
    });

    figYMax.value += props.yValueMargin;
    figYMin.value -= props.yValueMargin;

    props.tickX.forEach((timeStamp) => {
        tickX.push (timeStamp)
    })
}

const getClassStr = (key = undefined, type = "line") => {
    if (key === undefined)
        return props.imageId + "-" + type;
    else
        return props.imageId + "-" + key + "-" + type;
}

const updateFigure = () => {
    const idStr = "#" + props.imageId;
    // clear old image
    d3.select(idStr).select("svg").remove();

    const margin = props.imageMargin;
    const coreWidth = props.imageSize.width - margin.left - margin.right;
    const coreHeight = props.imageSize.height - margin.top - margin.bottom;
    const imageHeight = props.imageSize.height;
    const imageWidth = props.imageSize.width;

    // svg components
    const svg = d3.select(idStr).append("svg")
                    .attr("width", imageWidth)
                    .attr("height", imageHeight)
                    .attr("class", "mx-auto shadow rounded\
                                        bg-white/86 hover:bg-white\
                                        dark:bg-black/75 hover:dark:bg-black/90\
                                        dark:border dark:border-slate-500")
                    .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // scale
    const xScale = d3.scaleLinear()
                .domain([0, tickX.length-1])
                .range([0, coreWidth]);
    const yScale = d3.scaleLinear()
                .domain([figYMin.value, figYMax.value])
                .range([coreHeight, 0]);

    // axes
    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(5)
                    .tickFormat((d) => tickX[d]);

    svg.append("g")
        .attr("id", idStr+"-xaxis")
        .attr("transform", `translate(0, ${coreHeight})`)
        .call(xAxis);
    
    svg.append("g")
        .call(d3.axisLeft(yScale));

    const lineGenerator = d3.line()
        .x((d, i) => xScale(i)) // x-axis
        .y(d => yScale(d)); // y-axis

    // data
    figLegend.forEach((key, i) => {
        const strokeWidth = 2.5;
        const brighterValue = 1.3;
        svg.append("path")
        .attr("class", getClassStr(key, "line"))
        .datum(figY[i])
        .attr("fill", "none")
        .attr("stroke", figColor[key])
        .attr("stroke-width", strokeWidth)
        .attr("d", lineGenerator)
        .on("mouseover", (event) => {
            d3.select("." + getClassStr(key, "line"))
                .attr("stroke", d3.rgb(figColor[key]).brighter(brighterValue))
                .attr("stroke-width", strokeWidth * 1.6);
        })
        .on("mouseout", (event) => {
            d3.select("." + getClassStr(key, "line"))
                .attr("stroke", figColor[key])
                .attr("stroke-width", 2.5)
        });

        const circleData = figY[i].map((yval, j) => {
            return {x: xScale(j),
                    y: yScale(yval),
                    r: 4, color: figColor[key],
                    val: yval
                    }
        }).filter((item) => item.y !== undefined)
    
        svg.selectAll("." + getClassStr(key, "circle"))
            .data(circleData)
            .enter()
            .append("circle")
            .attr("class", getClassStr(key, "circle"))
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .attr("fill", d => d.color);

        /* TODO: able to show value when mouse hover data or line
        svg.selectAll("." + getClassStr(key, "dataValue"))
            .data(circleData)
            .enter()
            .append("text")
            .attr("class", getClassStr(key, "dataValue"))
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .text(d => d.val)
        */  
    })

    svg.append("text")
        .attr("x", coreWidth/2)
        .attr("y", -margin.top/2)
        .text(props.title)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .attr("fill", "currentColor")
        .attr("class", " text-slate-800 dark:text-slate-200");

    
    const lineLegend =
    svg.selectAll("." + getClassStr(undefined,  "legend"))
            .data(figLegend)
            .enter()
            .append("g")
            .attr("class", getClassStr("legend", "legend"))
            .attr("transform", (d,i) => {
                return "translate(" + (margin.left) + "," + (i*20)+")";
            })
    lineLegend.append("text")
            .text((d) => d)
            .attr("transform", "translate(15, 6)")
            .attr("class", " text-slate-800 dark:text-slate-200")
            .attr("fill", "currentColor")
    lineLegend.append("rect")
            .attr("fill", d => figColor[d])
            .attr("width", 12).attr("height", 5)

    if (props.axisName.x)
    {
        svg.append("text")
        .attr("fill", "currentColor")
        .attr("class", getClassStr(undefined, "xaxis") +
                        " text-slate-800 dark:text-slate-200")
        .attr("x", coreWidth * 0.75)
        .attr("y", 3 * margin.bottom/4 + coreHeight)
        .text(props.axisName.x)
        .attr("font-size", "16px")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold");
    }

    if (props.axisName.y)
    {
        svg.append("text")
            .attr("fill", "currentColor")
            .attr("class", getClassStr(undefined, "yaxis") +
                            " text-slate-800 dark:text-slate-200")
            .attr("x", -margin.top/2)
            .attr("y", -margin.left+25)
            .text(props.axisName.y)
            .attr("font-size", "16px")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("font-weight", "bold");
    }
}


const processContainer = () => {
    updateLocalDataset();
    updateFigure();
}

onMounted (() => {
    processContainer();
})

watch (() => props, () => {
    processContainer();
}, {deep: true})


</script>

<template>
    <div class=""
        style="cursor: pointer;"
    >
        <div class="mx-auto">
            <div :id="props.imageId"></div>
        </div>
    </div>
</template>

<style scoped>
</style>