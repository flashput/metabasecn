/* @flow */


import LineAreaBarChart from "../components/LineAreaBarChart.jsx";
import { scatterRenderer } from "../lib/LineAreaBarRenderer";

import {
    GRAPH_DATA_SETTINGS,
    GRAPH_BUBBLE_SETTINGS,
    GRAPH_GOAL_SETTINGS,
    GRAPH_COLORS_SETTINGS,
    GRAPH_AXIS_SETTINGS
} from "../lib/settings/graph";

export default class ScatterPlot extends LineAreaBarChart {
    static uiName = "散点图/气泡图";
    static identifier = "scatter";
    static iconName = "bubble";
    static noun = "scatter plot";

    static renderer = scatterRenderer;

    static settings = {
        ...GRAPH_DATA_SETTINGS,
        ...GRAPH_BUBBLE_SETTINGS,
        ...GRAPH_GOAL_SETTINGS,
        ...GRAPH_COLORS_SETTINGS,
        ...GRAPH_AXIS_SETTINGS
    }
}
