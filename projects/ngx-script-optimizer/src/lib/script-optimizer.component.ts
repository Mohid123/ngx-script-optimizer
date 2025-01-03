import { DOCUMENT, isPlatformServer } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, EventEmitter, Inject, Injector, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';

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
    @Inject(PLATFORM_ID) private platformId: any,
    private injector: Injector
  ) { }

  @Input() src?: string;
  @Input() scriptContent?: any;
  @Input() appendTo: ScriptAppendStrategy = 'head';
  @Input() loadStrategy: ScriptLoadingStrategy = 'lazy';
  @Input() renderStrategy: ScriptRenderStrategy = 'server';
  @Input() contentType: string = 'text/javascript';
  @Input() integrity?: string | any;
  @Input() origin?: string | any;
  @Output() onLoad = new EventEmitter<void>();
  private worker?: Worker;
  private scriptElem!: HTMLScriptElement;

  ngOnInit(): void {
    try {
      if (isPlatformServer(this.platformId) && this.renderStrategy == 'server') {
        this.addScriptToHead();
      }
      if(this.renderStrategy == 'client') {
        afterNextRender(() => {
          this.addScriptToHead();
        }, {injector: this.injector})
      }
    } catch (error) {
      console.error(error)
    }
  }

  private addScriptToHead(): void {
    if(!this.scriptContent && !this.src) {
      throw new Error(
        'ScriptOptimizerComponent: Either `src` or `scriptContent` must be provided.'
      );
    }
    if(this.scriptContent && this.src) {
      throw new Error(
        'ScriptOptimizerComponent: Both `src` or `scriptContent` cannot be provided at the same time.'
      );
    }
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
    this.scriptElem = this.document.createElement('script');
    this.scriptElem.type = this.contentType;
    this.scriptElem.integrity = this.integrity;
    this.scriptElem.crossOrigin = this.origin;
    if (this.src) {
      this.scriptElem.src = this.src;
    }
    if (this.scriptContent) {
      this.scriptElem.text = this.scriptContent;
    }
    this.scriptElem.onload = () => {
      this.onLoad.emit();
    }
    if (this.loadStrategy == 'eager') {
      this.scriptElem.defer = false;
      this.scriptElem.async = true;
      this.appendScripts();
    }
    if (this.loadStrategy == 'lazy') {
      this.scriptElem.defer = true;
      this.scriptElem.async = true;
      this.appendScripts();
    }
    if (this.loadStrategy == 'idle') {
      this.scriptElem.defer = true;
      this.scriptElem.async = true;
      if (typeof window != 'undefined' && 'requestIdleCallback' in window) {
        this.appendScripts();
      }
    }
  }

  private createAndExecuteWorker(scriptContent: string): void {
    const blob = new Blob([scriptContent], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    this.worker = new Worker(workerUrl);

    this.worker.onmessage = (event) => {
      console.log('Message from worker:', event.data);
      this.onLoad.emit();
    };

    this.worker.onerror = (error) => {
      console.error('Error in worker:', error.message);
    };
  }

  private appendScripts(): void {
    if (this.appendTo == 'head') {
      this.document.head.appendChild(this.scriptElem);
    }
    if (this.appendTo == 'body') {
      this.document.body.appendChild(this.scriptElem);
    }
  }

  ngOnDestroy(): void {
    if (this.scriptElem && typeof document != 'undefined') {
      document?.body?.removeChild(this.scriptElem);
      document?.head?.removeChild(this.scriptElem);
      this.worker?.terminate();
    }
  }

}
