export class Page {
    constructor(size, totalElements, totalPages, number) {
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.number = number;
    }

    static fromProps(props) {
        return new Page(
            props.size,
            props.totalElements,
            props.totalPages,
            props.number
        );
    }
}
