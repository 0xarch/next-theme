import { join } from "path";

export default function append_page(ctx) {
    ctx.plugin.append_pages.push({
        type: 'side_widget',
        get(ctx) {
            return [join(ctx.PUBLIC_DIRECTORY, 'neo/side-widgets/index.html')];
        }
    },{
        type: 'page',
        get(ctx) {
            let array = [];
            for (let i = 0; i < Math.ceil(ctx.data.posts.length/10); i++) {
                array.push(join(ctx.PUBLIC_DIRECTORY, 'page', i.toString(), 'index.html'));
            }
            return array;
        }
    });
}
