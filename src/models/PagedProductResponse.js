import Embedded from "./Embedded";
import {Page} from "./Page";

export class PagedProductResponse{
    constructor(_embedded, page) {
        this._embedded = _embedded;
        this.page = page;
    }

    static fromProps(props) {
        return new PagedProductResponse(
            Embedded.fromProps(props._embedded),
            Page.fromProps(props.page)
        );
    }

}
export default PagedProductResponse;