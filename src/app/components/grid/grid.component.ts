import {ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import NodeModel from '../../models/node.model';
import Point from '../../models/point';
import {DjikstraAlgrothimService} from '../../services/djikstra-algrothim.service';
import {NodeComponent} from '../node/node.component';
import {MessagesService} from '../../services/messages.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  @ViewChildren('node') noteComponents: QueryList<any>;
  nodes: Array<Array<NodeModel>> = [];

  rows = 20;
  cols = 45;

  startNode: Point = {row: 10, col: 14};
  endNode: Point = {row: 8, col: 34};

  constructor(
    private ref: ChangeDetectorRef,
    private messageService: MessagesService
  ) {
    this.CreateNodes();
    this.InitializeStartEndNodes();
  }

  CreateNodes() {
    for (let i = 0; i < this.rows; i++) {
      const cols: Array<NodeModel> = [];
      for (let j = 0; j < this.cols; j++) {
        cols.push(new NodeModel(i, j, false, false, this.startNode, this.endNode));
      }
      this.nodes.push(cols);
    }
  }

  InitializeStartEndNodes() {
    this.startNode = {row: 10, col: 14};
    this.endNode = {row: 8, col: 34};
    const stNd: NodeModel = this.getNode(this.startNode);
    stNd.isStartNode = true;
    this.startNode = stNd;
    const enNd = this.getNode(this.endNode);
    enNd.isEndNode = true;
    this.endNode = enNd;
  }

  getNode(point): NodeModel {
    for (const row of this.nodes) {
      for (const node of row) {
        if (node.row === point.row && node.col === point.col) {
          console.log('get Node return node: ');
          console.log(node);
          return node;
        }
      }
    }
  }

  MouseUp(event: Event) {
    this.messageService.MouseRelease();
    event.preventDefault();
    event.stopPropagation();
  }

  MouseDown(event: Event) {
    this.messageService.MouseClicked();
    event.preventDefault();
    event.stopPropagation();
  }

  Drop(event) {
    const previousNode: NodeModel = event.previousNode;
    const newNode: NodeModel = event.newNode;
    console.log(previousNode, this.endNode);
    // handle if the node was startnode
    if (previousNode.isStartNode && !newNode.isEndNode) {
      console.log(previousNode, this.endNode);
      const {row, col} = previousNode;
      this.nodes[row][col].isStartNode = false;
      previousNode.isStartNode = false;
      this.nodes[newNode.row][newNode.col].isStartNode = true;
      this.startNode = this.nodes[newNode.row][newNode.col];

      // handle of the node was endNode
    } else if (previousNode.isEndNode && !newNode.isStartNode) {
      const {row, col} = previousNode;
      this.nodes[row][col].isEndNode = false;
      previousNode.isEndNode = false;
      this.nodes[newNode.row][newNode.col].isEndNode = true;
      this.endNode = this.nodes[newNode.row][newNode.col];
    }
    this.RunChangeDetector();
  }

  start() {
    // initialize the algorithm
    const dj = new DjikstraAlgrothimService();

    // run algorithm and get visited nodes
    const visitedNodes = dj.start(this.nodes, this.startNode, this.endNode);

    // run change detection to create animated effect
    for (let i = 0; i < visitedNodes.length; i++) {
      this.noteComponents.forEach((cmp: NodeComponent) => {
        if (cmp.node === visitedNodes[i]) {
          setTimeout(() => {
            cmp.runChangeDetector();
          }, 5 * i);
        }
      });
    }

    let lastnode = visitedNodes[visitedNodes.length - 1];
    while (lastnode != null) {
      lastnode.inPath = true;
      lastnode = lastnode.previousNode;
    }

    const totalTime = 5 * (visitedNodes.length - 1);

    // update the nodes to reflect the shortest path
    setTimeout(() => {
      let i = 0;
      this.noteComponents.forEach((cmp: NodeComponent) => {
        setTimeout(() => {
          cmp.runChangeDetector();
        }, i * 2);
        i += 1;
      });
    }, totalTime);
  }

  Reset() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].reset();
      }
    }
    this.InitializeStartEndNodes();

    const newNodes = [];
    for (let i = 0; i < this.rows; i++) {
      newNodes.push([...this.nodes[i]]);
    }
    delete this.nodes;
    this.nodes = newNodes;

    this.RunChangeDetector();
  }

  RunChangeDetector(type = 'all', index?) {
    if (type === 'all') {
      console.log('her');
      const toRun = [];
      this.noteComponents.forEach((cmp: NodeComponent) => {
        toRun.push(cmp.runChangeDetector());
      });
      Promise.all(toRun);
    }
  }


  ActionTakenHandler(action) {
    if (action === 'stop') {
      console.log('startWasTriggered');
      this.Reset();
    }
    if (action === 'start') {
      console.log('startWasTriggered');
      this.start();
    }
  }
}
