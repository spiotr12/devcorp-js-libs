import { StrOrNum } from './types';


export class CssTransform {
    // matrix
    public matrix: StrOrNum[];
    public matrix3d: StrOrNum[];

    // perspective
    public perspective: [StrOrNum];

    // rotate
    public rotate: [StrOrNum];
    public rotate3d: [StrOrNum, StrOrNum, StrOrNum, StrOrNum];
    public rotateX: [StrOrNum];
    public rotateY: [StrOrNum];
    public rotateZ: [StrOrNum];

    // translate
    public translate: [StrOrNum, StrOrNum];
    public translate3d: [StrOrNum, StrOrNum, StrOrNum];
    public translateX: [StrOrNum];
    public translateY: [StrOrNum];
    public translateZ: [StrOrNum];

    // scale
    public scale: [StrOrNum, StrOrNum];
    public scale3d: [StrOrNum, StrOrNum, StrOrNum];
    public scaleX: [StrOrNum];
    public scaleY: [StrOrNum];
    public scaleZ: [StrOrNum];

    // skew
    public skew: [StrOrNum, StrOrNum];
    public skewX: [StrOrNum];
    public skewY: [StrOrNum];

    constructor(transformString?: string) {
        if (transformString) {
            return CssTransform.parse(transformString);
        }
    }

    public static parse(transformString: string): CssTransform {
        const transform = new CssTransform();
        if (!transformString) {
            return transform;
        }

        const functions = transformString.match(/(\w+\((\-?\d+\.?\d*e?\-?\w*(,|, | )?)+\))+/g);

        for (const fn of functions) {
            const segments = fn.match(/[\w\.\-]+/g);
            const key = segments.shift();

            transform[key] = segments.map(s => isNaN(+s) ? s : +s);
        }

        return transform;
    }

    public toString(): string {
        let str = '';

        for (const key of Object.keys(this)) {
            const values: StrOrNum[] = this[key];
            if (values) {
                str += `${key}(${values.join(',')}) `;
            }
        }

        return str;
    }

}
