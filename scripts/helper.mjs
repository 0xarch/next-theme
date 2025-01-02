import { join, relative } from "path";
import { Marked } from "marked";
import SVGS from "./svgs.mjs";
import markedFootnote from "marked-footnote";
import extendedTables from "marked-extended-tables";

let SVG_USED = [];

let _marked = new Marked();
_marked.use(markedFootnote());
_marked.use(extendedTables());

export default function (ctx) {
    let helpers = {
        i18n: (str)=> str,
        range: (start, end) => {
            let array = [];
            for (let i = start; i <= end; i++) {
                array.push(i);
            }
            return array;
        },
        get_svg: (str) => {
            if (SVG_USED.includes(str)) {
                return SVGS[str].prefix + `<use xlink:href="#svg:${str}"` + SVGS[str].suffix;
            } else {
                SVG_USED.push(str);
                return SVGS[str].prefix + `<symbol id="svg:${str}">${SVGS[str].inner}</symbol><use xlink:href="#svg:${str}"` + SVGS[str].suffix;
            }
        },
        clear_build: () => {
            SVG_USED = [];
        },
        post_url_for: (path) => {
            return join(ctx.config.root,relative(ctx.PUBLIC_DIRECTORY, path));
        },
        analyze_license: (str) => {
            let _str = String(str).toLowerCase();
            if(_str === 'private') {
                return {
                    type: 'private'
                }
            }
            if(_str === 'custom') {
                return {
                    type: 'custom'
                }
            }
            if(_str.startsWith('cc')){
                let types = ['by','nc','nd','sa'];
                let version = _str.replace(/[^0-9^.]/g,'') ?? '4.0';
                types = types.filter(v => _str.includes(v));
                return {
                    type: 'creative-common',
                    value: types,
                    version
                }
            }
            return {
                type: 'creative-common',
                value: ['by','nc','sa'],
                version: '4.0'
            }
        },
        rerender_markdown(str){
            return _marked.parse(str);
        }
    };
    ctx.plugin.helpers.array_unique = (array) => [... new Set(array)]
    Object.assign(ctx.plugin.helpers,helpers);
}
