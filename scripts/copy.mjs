import { cp } from "fs";
import { dirname, join } from "path";

let regExps = {
    MATCH_H1: /\n# /,
    MATCH_IMAGE: /\!\[([^\]]*?)\]\(([^\n]+?)\)/g,
    MATCH_WEB_URL: /^(https?:)?(\/\/)/,
};

export default function (ctx) {
    ctx.data.posts.forEach(post => {
        let referencedImages = [...post.raw.matchAll(regExps.MATCH_IMAGE)].map(v => v[2]);
        referencedImages.forEach(v => {
            if (!regExps.MATCH_WEB_URL.test(v)) {
                let originPath = join(dirname(post.full_source), v);
                let targetPath = join(dirname(post.path), v);
                cp(originPath, targetPath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    });
}