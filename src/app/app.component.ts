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
  content = `function sum(a, b) {
    return a * b + a + b;
  }
  console.log(sum(1,2))`;

  runAfterLoad() {
    console.log('I ran after loading')
  }
}
