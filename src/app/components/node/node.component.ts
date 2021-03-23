import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import NodeModel from '../../models/node.model';
import {MessagesService} from '../../services/messages.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent implements OnInit, OnChanges {

  @Input() node: NodeModel;
  @Input() isClicked: boolean;
  @Output() dropped: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('nodeel', { static: true }) nodeEl;

  isStartNode = false;
  isEndNode = false;

  constructor(
    private messageService: MessagesService,
    private ref: ChangeDetectorRef,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.messageService.messages$.subscribe(
      (message: NodeModel) => {
        console.log('M', message);
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnChanges(changes) {
    console.log('changes ', changes);
  }

  runChangeDetector() {
    this.ref.markForCheck();
  }

  MouseUp(event: Event) {
    console.log(event);
    try {
      const data = (event as any).dataTransfer.getData('text');
      console.log(data, (event as any).data);
      this.dropped.emit({
        previousNode: JSON.parse(data),
        newNode: this.node,
      });
    } catch (err) {
      console.error(err);
    }
  }

  MouseDown(event: Event) {
    if (this.node.isStartNode || this.node.isEndNode) {
      this.messageService.MouseRelease();
      // event.preventDefault();
      event.stopPropagation();

      return;
    }
    this.node.isWall = !this.node.isWall;
  }

  CreateWall(event) {
    console.log('inside', this.isClicked);
    if (
      this.messageService.GetMouseClicked() === true &&
      !this.node.isEndNode &&
      !this.node.isStartNode
    ) {
      this.node.isWall = !this.node.isWall;
    }
  }

  DragCancel(event: Event) {
    event.preventDefault();
  }

  DragStart(event) {
    event.dataTransfer.setData('text/plain', JSON.stringify(this.node));
    event.data = this.node;
  }
}
