import { StrOrNum } from './types';


export class SvgTransform {
    // matrix
    public matrix: StrOrNum[];
    public matrix3d: StrOrNum[];

    // perspective
    public perspective: [StrOrNum];

    // rotate
    public rotate: [StrOrNum, StrOrNum?, StrOrNum?];

    // translate
    public translate: [StrOrNum, StrOrNum?];

    // scale
    public scale: [StrOrNum, StrOrNum?];

    // skew
    public skewX: [StrOrNum];
    public skewY: [StrOrNum];

    constructor(transformString?: string) {
        if (transformString) {
            return SvgTransform.parse(transformString);
        }
    }

    public static parse(transformString: string): SvgTransform {
        const transform = new SvgTransform();
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
