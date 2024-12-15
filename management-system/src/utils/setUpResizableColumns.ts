export const setupResizableColumns = (table: HTMLTableElement | null) => {
    if (!table) return;
  
    const headers = table.querySelectorAll('th.resizable');
  
    headers.forEach((header) => {
      const resizer = document.createElement('div');
      resizer.className = 'resizer';
      resizer.style.position = 'absolute';
      resizer.style.right = '0';
      resizer.style.top = '0';
      resizer.style.width = '5px';
      resizer.style.height = '100%';
      resizer.style.cursor = 'col-resize';
      resizer.style.background = 'transparent';
  
      const headerElement = header as HTMLElement;
      headerElement.style.position = 'relative';
      headerElement.appendChild(resizer);
  
      let startX: number, startWidth: number;
  
      const onMouseMove = (e: MouseEvent) => {
        const newWidth = startWidth + (e.clientX - startX);
        headerElement.style.width = `${newWidth}px`;
      };
  
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
  
      resizer.addEventListener('mousedown', (e: MouseEvent) => {
        startX = e.clientX;
        startWidth = headerElement.offsetWidth;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });
  };
  