export default function openUrlInNewTab(url) {
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
