import React, {FormEvent} from 'react';
import './App.css';
import {
  GraphVisualizer, IGraphView,
  Template,
  Toolbar,
  ToolButtonList,
  store
} from "graphlabs.core.template";
import { IGraph, IVertex, IEdge, Graph, Vertex, Edge } from "graphlabs.core.graphs";
import { ChangeEvent } from "react";
import {MatrixCell, Matrix} from "graphlabs.core.lib";
import {select, style} from 'd3-selection';



class App extends Template{

 /*data = [
    {
      "type": "graph",
      "value": {
        "vertices": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7"
        ],
        "edges": [
          {
            "source": "1",
            "target": "2",
            "name": "5"
          },
          {
            "source": "2",
            "target": "3",
            "name": "1"
          },
          {
            "source": "3",
            "target": "4",
            "name": "2"
          },
          {
            "source": "4",
            "target": "5",
            "name": "4"
          },
          {
            "source": "4",
            "target": "1",
            "name": "3"
          },
          {
            "source": "5",
            "target": "2",
            "name": "3"
          },
          {
            "source": "1",
            "target": "6",
            "name": "5"
          },
          {
            "source": "6",
            "target": "7",
            "name": "2"
          },
          {
            "source": "3",
            "target": "7",
            "name": "6"
          }
        ]
      }
    }
  ]*/

  //graph: IGraph< IVertex, IEdge> = this.graphMy(this.data[0].value);
  //graph: IGraph< IVertex, IEdge> = this.get_graph();
  graph: IGraph< IVertex, IEdge> = this.my_graph();
  private inAnswer?: string;
  private tempAnswer?: string;



 /*graphMy(data:any): IGraph<IVertex, IEdge> {
    const graph: IGraph<IVertex, IEdge> = new Graph() as unknown as IGraph<IVertex, IEdge>;
    if (data) {
      let vertices = data.vertices;
      let edges = data.edges;
      vertices.forEach((v: any) => {
        graph.addVertex(new Vertex(v));
      });
      edges.forEach((e: any) => {
        if (e.name) {
          graph.addEdge(new Edge(graph.getVertex(e.source)[0], graph.getVertex(e.target)[0], e.name[0]));
        } else {
          graph.addEdge(new Edge(graph.getVertex(e.source)[0], graph.getVertex(e.target)[0]));
        }
      });

    }
    return graph;
  }*/

  get_graph(): IGraph<IVertex, IEdge>{
    const graph: IGraphView = store.getState().graph;
    let data =[
      {
        "type": "graph",
        "value": {
          "vertices": [""],
          "edges": [{
            "source": "",
            "target": "",
            "name": ""
          }]
        }

      }
    ]
    let vertices = graph.vertices;
    let edges = graph.edges;
    let i = 0;
    data[0].value.vertices.shift();
    vertices.forEach((v: any) =>{
      i = data[0].value.vertices.push(i.toString());
    });
    data[0].value.edges.shift();
    edges.forEach((e:any) => {
      if (e.name){
        data[0].value.edges.push({"source": e.vertexOne, "target": e.vertexTwo, "name": e.name})
      }
      else{
        data[0].value.edges.push({"source": e.vertexOne, "target": e.vertexTwo, "name": Math.round(Math.random()*10).toString()})
      }
    });
    let result: IGraph<IVertex, IEdge> = this.graphManager(data[0].value);
    return result;
  }

    my_graph():IGraph<IVertex, IEdge>{
        const data = sessionStorage.getItem('variant');
        let graph: IGraph<IVertex, IEdge> = new Graph() as unknown as IGraph<IVertex, IEdge>;
        let objectData;
        try {
            objectData = JSON.parse(data || 'null');
        } catch (err) {
            console.log('Error while JSON parsing');
        }
        if (objectData && objectData.data[0] && objectData.data[0].type === 'graph') {
            graph = this.graphManager(objectData.data[0].value);
            const vertices = objectData.data[0].value.graph.vertices;
            const edges  = objectData.data[0].value.graph.edges;
            vertices.forEach((v: any) => {
                graph.addVertex(new Vertex(v));
            });
            edges.forEach((e: any) => {
                if (e.name) {
                    graph.addEdge(new Edge(graph.getVertex(e.source)[0], graph.getVertex(e.target)[0], e.name[0]));
                } else {
                    graph.addEdge(new Edge(graph.getVertex(e.source)[0], graph.getVertex(e.target)[0],Math.round(Math.random()*10).toString() ));
                }
            });
        }
        return graph;
    }


  constructor(props: {}) {
    super(props);
    this.calculate = this.calculate.bind(this);
    this.getArea = this.getArea.bind(this);
    this.handler = this.handler.bind(this);
  }


  private changeCell(){
   let element = document.getElementById('cell');
   if (element != null) {
      element.style.background = '#87CEEB';
    }
   /* if (el != null) {
      el.setAttribute('style','#87CEEB')
    }*/
  /*if (this.cell != null) {
    select<HTMLElement, IMatrixCell[]>(this.cell)
  }*/
  }
 private addInAnswer(value: FormEvent<HTMLButtonElement>){
    let element = document.getElementById('cell');
  if (element != null) {
     element.style.background = '#98FB98';
     element.setAttribute('disabled','disabled');
   }

  }


  matrix: number[][] = [];

  task() {

    return () => (
        <div>
          <form>

            <span>
                Введите расстояние между 1 и остальными {this.graph.vertices.length-1} вершинами в матрицу. <br/> <br/>
            </span>
          <p><b>Введите расстояния: </b></p>
            <p><Matrix
        rows={1}
        columns={this.graph.vertices.length}
        readonly={false}
        handler={this.handler}
        matrixFilling={true}
    /></p>
          <br/>
          <br/>
          <br/>
            <br/>
          <p><button type={"button"} style={{border: '1px double black', background: 'white', margin: '5px'}} onClick={this.changeCell}>Временно</button>
            <button type={"button"} style={{border: '1px double black', background: 'white', margin: '5px'}}  onClick={this.addInAnswer} aria-readonly={true}>В ответ</button>
          </p>
            <br/>
            <p> Если у Вас возникли проблемы, то начните задание сначала.</p>
          <p><button type={"reset"} className={'reset'} style={{border: '1px double black', background: 'white', margin: '5px'}} onClick={()=>this.forceUpdate()}>Начать заново</button></p>
            </form>
        </div>)
  }

  handler(values: number[][]) {
    this.matrix = values;
  }



  getArea(): React.SFC<{}> {
    //this.graph = this.get_graph();
    this.graph = this.my_graph();
    //store.getState().graph = this.graph;
    return () => <GraphVisualizer
        graph={this.graph}
        adapterType={'readable'}
        incidentEdges={true}
        weightedEdges={true}
        namedEdges={true}
    />;
  }

  public getTaskToolbar() {
    Toolbar.prototype.getButtonList = () => {
      ToolButtonList.prototype.help = () =>
          `В данном задании Вы должны определить минимальное расстояние между первой и всеми остальными 
          вершинами графа`;
      ToolButtonList.prototype.beforeComplete = this.calculate;
      return ToolButtonList;
    }
    return Toolbar;
  }

  public calculate() {
    let answer: number[] = this.dijkstrasAlgorithm(this.graph);
    let numCorrectAnswer: number = 0;
    let res = 0;
    for (let h = 0; h < this.graph.vertices.length; h++){
      console.log("вершина" + h + " "+ this.dijkstrasAlgorithm(this.graph)[h])
      if (answer[h] === this.matrix[0][h]){
       numCorrectAnswer += 1;
      }
    }
    //console.log(numCorrectAnswer);
    let maxWrongAns = Math.round((this.graph.vertices.length - 1)/2);
    let wrongAnswers = (this.graph.vertices.length - numCorrectAnswer);
    if (numCorrectAnswer === this.graph.vertices.length){
      res = 0;
    }
    else if (numCorrectAnswer >= maxWrongAns){
      res = Math.round((40/maxWrongAns) * wrongAnswers);
    }
    else {
      res = 50;
    }

    let element = document.querySelector('.reset');
    if (element != null){
      element.setAttribute('disabled','disabled');
    }
    return Promise.resolve({success: res === 0, fee: res});
  }

  public dijkstrasAlgorithm(graph: IGraph<IVertex, IEdge>){
    let matrixOfWeight = [];
    let start = 0;
    let visited: boolean[] = [];
    let weight: number[] = [];
    for(let p = 0; p < graph.vertices.length; p++){
      visited.push(false);
      weight.push(10000)
    }
    weight[start] = 0;
    for (let i = 0; i < graph.vertices.length; i++){ //заполнение матрицы всеми весами
      let row: number[] = [];
      for (let j = 0; j < graph.vertices.length;j++){
       if (i === j){
         row.push(0)
      }
       else if (graph.vertices[j].isAdjacent(graph, graph.vertices[i])){
         for (let e = 0; e<graph.edges.length; e++){
           if (graph.edges[e].vertexOne.name === graph.vertices[j].name
               && graph.edges[e].vertexTwo.name === graph.vertices[i].name ||
               graph.edges[e].vertexOne.name === graph.vertices[i].name
               && graph.edges[e].vertexTwo.name === graph.vertices[j].name){
             row.push(+graph.edges[e].name)
           }
         }
        }
       else if (!graph.vertices[j].isAdjacent(graph, graph.vertices[i])){
          row.push(10000)
        }
      }
      matrixOfWeight.push(row);
    }

    for (let k = 0; k < graph.vertices.length; k++){
      let min_weight = 10000;
      let id_min_weight = -1;
      for (let l = 0; l < graph.vertices.length; l++){
        if (!visited[l] && weight[l] < min_weight){
          min_weight = weight[l];
          id_min_weight = l;
        }
      }
      for (let z = 0; z < graph.vertices.length; z++){
        if (weight[id_min_weight] + matrixOfWeight[id_min_weight][z] < weight[z]){
          weight[z] = weight[id_min_weight] + matrixOfWeight[id_min_weight][z]
        }
      }
      visited[id_min_weight] = true;
    }
    return weight;
  }

}

export default App;
