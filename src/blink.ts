
import $ = require("jquery");

export class Blink {
        static blink(obj:any, css:string,delay?: number) {
		if(!delay) {
			delay = 250
		}
                $(obj).addClass(css);
                setTimeout(function() {
                        $(obj).removeClass(css);
                },delay);
        }
}
