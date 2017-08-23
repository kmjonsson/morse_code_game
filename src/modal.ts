
import $ = require("jquery");

export class ModalDialog {
	public id:string;
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
		this.modals.forEach(function(e) {
			if(e.id == id) {
				e.show();
			} else {
				e.close();
			}
		});
	}
	visable(id:string):boolean {
		return this.modals.reduce(function(v,e) {
			if(e.id == id) {
				return e.visable();
			}
			return v;
		},false);
	}
	close() {
		this.modals.forEach(function(e) {
			e.close();
		});
	}
}

