/**
 * Basic HTML sanitizer for rendering trusted admin content.
 * Only allows safe formatting tags, strips everything else.
 */
export function sanitizeHtml(html) {
    if (!html) return '';
    
    const allowedTags = ['br', 'span', 'b', 'i', 'strong', 'em', 'p', 'ul', 'li', 'ol', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'hr'];
    const allowedAttrs = ['class', 'href', 'target', 'rel'];
    
    const div = document.createElement('div');
    div.innerHTML = html;
    
    function clean(node) {
        const children = Array.from(node.childNodes);
        children.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toLowerCase();
                if (!allowedTags.includes(tagName)) {
                    // Replace disallowed tag with its text content
                    const text = document.createTextNode(child.textContent);
                    node.replaceChild(text, child);
                } else {
                    // Remove disallowed attributes
                    Array.from(child.attributes).forEach(attr => {
                        if (!allowedAttrs.includes(attr.name)) {
                            child.removeAttribute(attr.name);
                        }
                    });
                    // Also sanitize href to prevent javascript: protocol
                    if (child.hasAttribute('href')) {
                        const href = child.getAttribute('href');
                        if (href.trim().toLowerCase().startsWith('javascript:')) {
                            child.removeAttribute('href');
                        }
                    }
                    clean(child);
                }
            }
        });
    }
    
    clean(div);
    return div.innerHTML;
}
