
import $ = require("jquery");

export class Blink {
        static blink(obj:any, css:string) {
                $(obj).addClass(css);
                setTimeout(function() {
                        $(obj).removeClass(css);
                },250);
        }
}
