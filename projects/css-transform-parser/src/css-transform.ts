export class CssTransform {
    // matrix
    public matrix: string[];
    public matrix3d: string[];

    // perspective
    public perspective: [string];

    // rotate
    public rotate: [string];
    public rotate3d: [string, string, string, string];
    public rotateX: [string];
    public rotateY: [string];
    public rotateZ: [string];

    // translate
    public translate: [string, string];
    public translate3d: [string, string, string];
    public translateX: [string];
    public translateY: [string];
    public translateZ: [string];

    // scale
    public scale: [string, string];
    public scale3d: [string, string, string];
    public scaleX: [string];
    public scaleY: [string];
    public scaleZ: [string];

    // skew
    public skew: [string, string];
    public skewX: [string];
    public skewY: [string];

    constructor(transformString?: string) {
        if (transformString) {
            return CssTransform.parse(transformString);
        }
    }

    public static parse(transformString: string): CssTransform {
        const transform = new CssTransform();
        const functions = transformString.match(/(\w+\((\-?\d+\.?\d*e?\-?\w*(,|, )?)+\))+/g);

        for (const fn of functions) {
            const segments = fn.match(/[\w\.\-]+/g);
            transform[segments.shift()] = segments;
        }

        return transform;
    }

    public toString(): string {
        let str = '';

        for (const key of Object.keys(this)) {
            const values: string[] = this[key];
            str += `${key}(${values.join(',')}) `;
        }

        return str;
    }

}
