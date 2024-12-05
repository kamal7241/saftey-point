import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-branches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-branches.component.html',
})
export class ManageBranchesComponent {}
