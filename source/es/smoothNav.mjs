const DOMParserI = new DOMParser();

const Reload = {
    goTo: async function (url, isBack = false, DoOthers) {
        document.body.classList.add('being-replaced');
        scrollToTop();
        let NEO_REPLACE_NODE = document.querySelector('#NEO_REPLACE');
        document.querySelector('header.global').classList.remove('collapsed');
        let least_timer = new Promise(resolve => setTimeout(resolve, 200));
        let content = await (await fetch(url)).text();
        await least_timer;
        let newDocument = DOMParserI.parseFromString(content, 'text/html');
        // set url
        if (!isBack) passedLocation.push(url);
        window.history[isBack ? 'replaceState' : 'pushState']('', '', url);
        // process head.
        let newTitle = newDocument.head.querySelector('title').innerHTML;
        let links = [];
        let unusedNodes = [];
        for (let childNode of newDocument.head.childNodes) {
            if (childNode.nodeType !== 1 || childNode.dataset.across) continue;
            switch (childNode.nodeName) {
                case 'LINK':
                    links.push({
                        rel: childNode.rel,
                        href: childNode.getAttribute('href')
                    })
                    break;
            }
        }
        for (let childNode of document.head.childNodes) {
            if (childNode.nodeType !== 1 || childNode.dataset.across) continue;
            outer: switch (childNode.nodeName) {
                case 'TITLE':
                    childNode.textContent = newTitle;
                    break;
                case 'LINK':
                    for (let i = 0; i < links.length; i++) {
                        if (childNode.rel == links[i].rel && childNode.href == links[i].href) {
                            links.splice(i, 1);
                            break outer;
                        }
                    }
                    unusedNodes.push(childNode);
                    break;
            }
        }
        links.forEach(v => {
            let el = document.createElement('link');
            el.rel = v.rel;
            el.href = v.href;
            document.head.appendChild(el);
        });
        unusedNodes.forEach(el => el.remove());
        // process body
        document.body.classList.add('not-ready');
        document.body.classList.remove('being-replaced');
        NEO_REPLACE_NODE.innerHTML = newDocument.querySelector('#NEO_REPLACE').innerHTML;
        document.body.classList.remove('not-ready');
        // scroll pos
        DoOthers();
    }
}

export default Reload;