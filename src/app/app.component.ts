import { Component } from '@angular/core';
import { ScriptOptimizerComponent } from '../../dist/ngx-script-optimizer';

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

  runAfterLoad2() {
    const init = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = init?.getContext('2d');
    const myChart = new (window as any).Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    console.log('I ran after loading x2', myChart)
  }
}
