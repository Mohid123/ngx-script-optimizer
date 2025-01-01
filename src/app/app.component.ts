import { Component } from '@angular/core';
import { ScriptOptimizerComponent } from '../../projects/script-optimizer/src/public-api';

@Component({
  selector: 'app-root',
  imports: [ScriptOptimizerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ngx-script-optimizer';
  content = `console.log('HEY IT WORKS!')`;
}
