import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, Inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';

type ScriptLoadingStrategy = 'eager' | 'lazy' | 'idle' | 'worker';
type ScriptAppendStrategy = 'body' | 'head';
type ScriptRenderStrategy = 'server' | 'client';
@Component({
  selector: 'ngx-script-optimizer',
  imports: [],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScriptOptimizerComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private injector: Injector
  ) { }

  @Input() src?: string;
  @Input() scriptContent?: any;
  @Input() appendTo: ScriptAppendStrategy = 'head';
  @Input() loadStrategy: ScriptLoadingStrategy = 'lazy';
  @Input() renderStrategy: ScriptRenderStrategy = 'server';
  private worker?: Worker;
  private scriptElem!: HTMLScriptElement;

  ngOnInit(): void {
    try {
      if (this.renderStrategy == 'server') {
        debugger
        this.addScriptToHead();
      }
      if(this.renderStrategy == 'client') {
        debugger
        afterNextRender(() => {
          this.addScriptToHead();
        }, {injector: this.injector})
      }
    } catch (error) {
      console.error(error)
    }
  }

  private addScriptToHead(): void {
    if (this.loadStrategy == 'worker') {
      if (typeof Worker !== 'undefined') {
        if(this.scriptContent) {
          this.createAndExecuteWorker(this.scriptContent)
          return
        }
        throw new Error(
          'ScriptOptimizerComponent: `scriptContent` must be provided.'
        );
      }
      return
    }
    if(!this.scriptContent && !this.src) {
      throw new Error(
        'ScriptOptimizerComponent: Either `src` or `scriptContent` must be provided.'
      );
    }
    this.scriptElem = this.document.createElement('script');
    if (this.src) {
      this.scriptElem.src = this.src;
    }
    if (this.scriptContent) {
      this.scriptElem.text = this.scriptContent;
    }
    if (this.loadStrategy == 'eager') {
      this.scriptElem.defer = false;
      this.scriptElem.async = false;
      if (this.appendTo == 'head') {
        this.document.head.appendChild(this.scriptElem);
      }
      if (this.appendTo == 'body') {
        this.document.body.appendChild(this.scriptElem);
      }
    }
    if (this.loadStrategy == 'lazy') {
      this.scriptElem.defer = true;
      this.scriptElem.async = true;
      if (this.appendTo == 'head') {
        this.document.head.appendChild(this.scriptElem);
      }
      if (this.appendTo == 'body') {
        this.document.body.appendChild(this.scriptElem);
      }
    }
    if (this.loadStrategy == 'idle') {
      this.scriptElem.defer = true;
      this.scriptElem.async = true;
      debugger
      if (typeof window != 'undefined' && 'requestIdleCallback' in window) {
        debugger
        if (this.appendTo == 'head') {
          this.document.head.appendChild(this.scriptElem);
        }
        if (this.appendTo == 'body') {
          this.document.body.appendChild(this.scriptElem);
        }
      }
    }
  }

  private createAndExecuteWorker(scriptContent: string): void {
    const blob = new Blob([scriptContent], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    this.worker = new Worker(workerUrl);

    this.worker.onmessage = (event) => {
      console.log('Message from worker:', event.data);
    };

    this.worker.onerror = (error) => {
      console.error('Error in worker:', error.message);
    };
  }

  ngOnDestroy() {
    if (this.scriptElem && typeof document != 'undefined') {
      document?.body?.removeChild(this.scriptElem);
      document?.head?.removeChild(this.scriptElem);
      this.worker?.terminate();
    }
  }

}
