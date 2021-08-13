<template>
    <div>
        <script src="https://unpkg.com/@hpcc-js/wasm/dist/index.min.js" type="javascript/worker"></script>
        <h2>Force-based label placement I</h2>
        <div id="graph" />
        <!-- <svg id="graph" class="container-border"></svg> -->
    </div>
</template>

<script>
import * as d3 from "d3"
import {wasmFolder} from "@hpcc-js/wasm"
import 'd3-graphviz'

export default {
    name: "GraphView",
    props: {
      code: {
        type: String,
        default: 'digraph {a -> b}'
      }
    },
    mounted() {
      wasmFolder('https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/');
      // fetch('static/test.dot').then(response => response.text()).then(text => console.log(text))
      fetch('static/test2.dot').then(response => response.text()).then( text => {
        let graphdot = text
        console.log("begin to draw")
        console.log(graphdot)
        d3.select("#graph").graphviz().renderDot(graphdot)
      })
    },
}


</script>
