import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Input() headerMapping: { [key: string]: string } = {};
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() toggle = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();


  onEdit(rowData: any) {
    this.edit.emit(rowData);
  }

  onDelete(rowData: any) {
    this.delete.emit(rowData);
  }

  onToggle(rowData: any) {
    this.toggle.emit(rowData);
  }

  onView(rowData: any) {
    this.view.emit(rowData);
  }
}
