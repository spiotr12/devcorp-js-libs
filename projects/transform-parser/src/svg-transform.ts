export class SvgTransform {
    // matrix
    public matrix: number[];
    public matrix3d: number[];

    // perspective
    public perspective: [number];

    // rotate
    public rotate: [number, number?, number?];

    // translate
    public translate: [number, number?];

    // scale
    public scale: [number, number?];

    // skew
    public skewX: [number];
    public skewY: [number];

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

        const functions = transformString.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*(,|, | )?)+\))+/g);

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
            const values: number[] = this[key];
            if (values) {
                str += `${key}(${values.join(',')}) `;
            }
        }

        return str;
    }

}
