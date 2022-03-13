interface OperateMethods {
	hasClass( el: Element, Class: string ): any;
	addClass( el: Element, Class: string, extraClass?: string ): any;
	remClass( el: Element, Class: string, extraClass?: string ): any;
	chgClass( flag: boolean, name: string, target?: HTMLElement ): any;
}

class Operate implements OperateMethods {
	private readonly reg: ( match: string ) => RegExp;

	constructor() {
		this.reg = function ( match: string ) {
			return new RegExp( `(\\s|^)${ match }(\\s|$)` );
		}
	}

	public hasClass( el: Element, Class: string ): any {
		return !!el.className.match( new RegExp( this.reg( Class ) ) );
	}

	public addClass( el: Element, Class: string, extraClass?: string ): any {
		if ( !this.hasClass( el, Class ) ) {
			el.className += " " + Class;
		}
		if ( extraClass && !this.hasClass( el, extraClass ) ) {
			el.className += " " + extraClass;
		}
	}

	public remClass( el: Element, Class: string, extraClass?: string ): any {
		if ( this.hasClass( el, Class ) ) {
			el.className = el.className.replace( this.reg( Class ), " " ).trim();
		}
		if ( extraClass && this.hasClass( el, extraClass ) ) {
			el.className = el.className.replace( this.reg( extraClass ), " " ).trim();
		}
	}

	public chgClass( flag: boolean, name: string, target?: HTMLElement ): any {
		const targetElement = target || document.body;
		let { className } = targetElement;
		className = className.replace( name, "" );
		targetElement.className = flag ? `${ className } ${ name }` : className;
	}
}

export function splitFunc( arr: Array<any>, step: number ): any {
	let index: number = 0;
	const res = [];
	const len: number = arr.length;
	while ( index < len ) {
		res.push( arr.slice( index, index += step ) );
	}
	return res;
}

export const operate = new Operate();
