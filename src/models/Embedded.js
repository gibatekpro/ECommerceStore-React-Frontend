
export class Embedded {
    constructor(data) {
        this.data = data;
    }

    static fromProps(props) {
        return new Embedded(props.data);
    }
}

export default Embedded;