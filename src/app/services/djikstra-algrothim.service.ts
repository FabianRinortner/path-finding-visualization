import {Injectable} from '@angular/core';
import NodeModel from '../models/node.model';

@Injectable({
  providedIn: 'root'
})
export class DjikstraAlgrothimService {

  start(nodes, startNode, endNode) {
    startNode.distance = 0;
    const unvisitedNodes: Array<NodeModel> = [];
    const visitedNodes: Array<NodeModel> = [];
    for (const node of nodes) {
      unvisitedNodes.push(...node);
    }

    while (unvisitedNodes.length > 0) {
      this.sortNodes(unvisitedNodes);
      const currentNode = unvisitedNodes.shift();
      currentNode.isVisited = true;
      visitedNodes.push(currentNode);
      if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
        console.log('Finished');
        return visitedNodes;
      }
      this.UpdateNeighbors(currentNode, nodes);
    }
  }

  updateReference(currentNode, Original) {
    console.log(currentNode.row);
    setTimeout(() => {
      Original[currentNode.row][currentNode.col] = currentNode;
    }, 20);
  }

  sortNodes(nodes) {
    nodes.sort((a, b) => a.distance - b.distance);
  }

  UpdateNeighbors(currentNode, nodes) {
    const neighbors = this.getNeighbors(currentNode, nodes);
    for (const neighbor of neighbors) {
      neighbor.distance = currentNode.distance + 1;
      neighbor.previousNode = currentNode;
    }
  }

  getNeighbors(currentNode, nodes) {
    let neighbors: Array<NodeModel> = [];
    if (currentNode.row > 0) {
      neighbors.push(nodes[currentNode.row - 1][currentNode.col]);
    }
    if (currentNode.col > 0) {
      neighbors.push(nodes[currentNode.row][currentNode.col - 1]);
    }
    if (currentNode.row < nodes.length - 1) {
      neighbors.push(nodes[currentNode.row + 1][currentNode.col]);
    }
    if (currentNode.col < nodes[0].length - 1) {
      neighbors.push(nodes[currentNode.row][currentNode.col + 1]);
    }
    neighbors = neighbors.filter(
      neighbor => !neighbor.isVisited && !neighbor.isWall
    );
    return neighbors;
  }
}
