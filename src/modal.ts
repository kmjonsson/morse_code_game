
import $ = require("jquery");

export class ModalDialog {
	private id:string;
        constructor(id: string) {
		this.id = id;
        }
	show() {
		$(this.id).addClass('modalDialog_show');
	}
	close() {
		$(this.id).removeClass('modalDialog_show');
	}
	visable():boolean {
		return $(this.id).hasClass('modalDialog_show');
	}
}

export class ModalDialogs {
	private modals:ModalDialog[];
        constructor(modals: ModalDialog[]) {
		this.modals = modals;
        }
	show(id:string) {
		$(this.modals).each(function() {
			if(this.id == id) {
				$(this.id).addClass('modalDialog_show');
			} else {
				$(this.id).removeClass('modalDialog_show');
			}
		});
	}
	visable(id:string):boolean {
		var result=false;
		$(this.modals).each(function() {
			if(this.id == id) {
				result = $(this.id).hasClass('modalDialog_show');
			}
		});
		return result;
	}
	close() {
		$(this.modals).each(function() {
			$(this.id).removeClass('modalDialog_show');
		});
	}
}

