export function track(url){
  const send = (name, value) => navigator.sendBeacon(url, JSON.stringify({name, value, ts: Date.now()}));
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') send('FCP', entry.startTime);
      if (entry.entryType === 'largest-contentful-paint') send('LCP', entry.renderTime || entry.loadTime);
      if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) send('CLS', entry.value);
    }
  }).observe({type:'paint', buffered:true});
  new PerformanceObserver((list) => {
    list.getEntries().forEach(e => send('INP', e.duration));
  }).observe({type:'event', buffered:true, durationThreshold:40});
}
