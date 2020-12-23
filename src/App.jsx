import './App.css';
import React from 'react';

import {
  GraphVisualizer,
    Template,
    Toolbar,
    ToolButtonList
} from "graphlabs.core.template";
import { IGraph, IVertex, IEdge, Graph, Vertex, Edge } from " graphlabs.core.graphs ";
import { ChangeEvent } from "react";


/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/
class App extends Template{

  data = [
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
            "target": "2"
          },
          {
            "source": "2",
            "target": "3"
          },
          {
            "source": "3",
            "target": "4"
          },
          {
            "source": "4",
            "target": "5"
          },
          {
            "source": "4",
            "target": "1"
          },
          {
            "source": "5",
            "target": "2"
          },
          {
            "source": "1",
            "target": "6"
          },
          {
            "source": "6",
            "target": "7"
          },
          {
            "source": "3",
            "target": "7"
          }
        ]
      }
    }
  ]

  graph: IGraph< IVertex, IEdge> = this.graphMy(this.data[0].value);
  private studentAnswer?: string;
  private studentRoute?: string;

  public graphMy(data:any): IGraph<IVertex, IEdge> {
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
  }

  constructor(props: {}) {
    super(props);
    this.calculate = this.calculate.bind(this);
    this.getArea = this.getArea.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.checkRoute = this.checkRoute.bind(this);
  }

  private checkAnswer(value: ChangeEvent<HTMLInputElement>) {
    this.studentAnswer = value.target.value ;

  }
  private checkRoute(value: ChangeEvent<HTMLInputElement>){
    this.studentRoute = value.target.value;
  }

  public task() {
    return () => (
        <div>
            <span>
                Введите кратчайшее расстояние между 1 и {this.graph.vertices.length} вершинами. <br/> <br/>
                Также через запятую выпишите номера вершин, через которые проходит путь.
                <br/>
                <br/>
                </span>
          <p><b>Введите длину пути: </b>
            <input type="text" name={"answer"} size={2} value={this.studentAnswer}
                   onChange={this.checkAnswer}/></p>
          <p><b>Введите вершины: </b>
            <input type="text" name={"ans"} size={8} value={this.studentRoute}
                   onChange={this.checkRoute}/></p>
        </div>);
  }

  public getArea(): React.SFC<{}> {
    return () => <GraphVisualizer
        graph={this.graph}
        adapterType={'readable'}
        namedEdges={true}
        incidentEdges={true}
    />;
  }

  public getTaskToolbar() {
    Toolbar.prototype.getButtonList = () => {
      ToolButtonList.prototype.help = () =>
          `В данном задании Вы должны определить минимальное расстояние между вершинами графа`;
      ToolButtonList.prototype.beforeComplete = this.calculate;
      return ToolButtonList;
    }
    return Toolbar;
  }

}

export default App;
