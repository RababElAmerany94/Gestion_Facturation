export class PageConfig {
    public defaults: any = {
        dashboard: {
            page: {
                title: 'Dashboard',
                desc: 'Latest updates and statistic charts'
            },
        }
    };

    public get configs(): any {
        return this.defaults;
    }
}
